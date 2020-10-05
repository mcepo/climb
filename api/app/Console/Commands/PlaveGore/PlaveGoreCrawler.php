<?php

namespace App\Console\Commands\PlaveGore;

use Illuminate\Console\Command;

use App\Models\Link;
use App\User;
use App\Models\Area;
use App\Models\Route;
use Goutte\Client;
use Symfony\Component\HttpClient\HttpClient;

use App\Console\Commands\Plezanje\GradeParser;
use Illuminate\Support\Facades\Artisan;

class PlaveGoreCrawler extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'crawler:plavegore';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crawler for http://plave-gore.com';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $start_url = 'http://plave-gore.com/index.php';
    protected $base_url = 'http://plave-gore.com/';
    private $_runtime;
    private $_requestCount;

    public $patterns = [
        'tehnical' => "#Ae*\d#",
        'mix' => "#M\d\d?[\+-]?#",
        'alpine' => "#AI\d[\+-]?#",
        'ice' => "#WI\d[\+-]?#",
        'fr_combined' => "#[ABDEFOTP]{1,3}[\+-]?#",
        'ydr' => "#5\.\d{1,2}(a|b|c|d){0,1}#", // this has to be before fr grades because fr pattern matches ydr grades
        'incline' => "#\d\d#",
        'uiaa' => "#([IVX]{1,4}\+?\-{0,2})([IVX]{1,4}[\+-]?)?#",
        'fr' => "#\d[abc]?\+{0,1}(/\d?[abc]\+?)?#",
    ];

    private static $MOUNTAIN_COUNT = 7;
    private static $CRAG_COUNT = 11;

    private $_country;

    public function __construct()
    {
        parent::__construct();

        $this->gradeParser = new GradeParser();

        $this->_country = Area::where('name', 'ilike', 'Croatia')->first();

        //  \DB::listen(function ($query) {
        //      dump(
        //          implode("\n", [$query->sql, json_encode($query->bindings), $query->time])
        //      );
        //  });
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {

        $this->_loginMe();

        $this->_runtime = microtime(true);
        $this->_requestCount = 0;

        echo "Crawling plave gore \n";

        /// mountains 

        for ($i = 1; $i <= self::$MOUNTAIN_COUNT; $i++) {

            $link = 'http://plave-gore.com/mt?id=' . $i;

            $page = $this->_getPage($link);

            if ($page == null) {
                echo ' **** ' . $link . ' is null';
                continue;
            }

            $area = $this->_parseMountain($page);

            $this->_storeLink($area, $link);
        }

        for ($i = 1; $i <= self::$CRAG_COUNT; $i++) {

            $link = 'http://plave-gore.com/cr?id=' . $i;

            $page = $this->_getPage($link);

            if ($page == null) {
                echo ' **** ' . $link . ' is null';
                continue;
            }

            $crag = $this->_parseSportClimbingSite($this->_country, $page);

            $this->_storeLink($crag, $link);
        }

        Artisan::call('area:update-all');

        $this->_runtime = microtime(true) - $this->_runtime;

        echo 'DONE IN ' . $this->_runtime . ' - SENT REQUESTS ' . $this->_requestCount . "\n";
    }

    private function _parseMountain($page)
    {

        $areaName = $page->filter('div#page-title-content > h2')->eq(0)->text();

        echo $areaName . "\n";

        // type id for area => 1
        $area = $this->_getArea($this->_country, $areaName, 1);

        $cragLinks = $page->filter('.col-container > .one-third > dl#quick_facts > dt > a');

        $cragLinks->each(function ($a) use ($area) {

            $link = $a->attr('href');

            $page = $this->_getPage($link);

            if ($page == null) {
                echo ' **** ' . $link . ' is null';
                return;
            }

            $crag = $this->_parseCrag($area, $page);

            $this->_storeLink($crag, $link);
        });

        return $area;
    }

    private function _getArea($parent, $name, $typeId)
    {
        $area = Area::where('name', 'ilike', $name)->where('parent_id', $parent->id)->first();

        if (!$area) {

            echo $name . " -> new area\n";

            $area = new Area([
                'name' => $this->_santizeName($name),
                'parent_id' => $parent->id,
                'type_id' => $typeId
            ]);

            $area->save();
        } else {
            $area->fill([
                'name' => $this->_santizeName($name)
            ]);
            $area->save();
        }

        return $area;
    }

    private function _getPage($link)
    {
        echo 'Crawling -> ' . $link . "\n";

        $client = new Client(HttpClient::create(['headers' => [
            'User-Agent' => 'Googlebot',
        ]]));

        $page = $client->request('GET', $link);

        if ($client->getResponse()->getStatusCode() != 200) {
            return null;
        }
        $this->_requestCount++;

        return $page;
    }

    private function _parseSportClimbingSite($parent, $page)
    {

        $name = $page->filter('div.full-width > h2')->eq(0)->text();

        // type_id for crag => 6
        $crag = $this->_getArea($parent, $name, 6);

        // location

        $coordinates = $this->_getMapLocations($page);

        if (count($coordinates) == 1) {
            $this->_storeMapTag($crag, array_shift($coordinates));
        }

        $routeTableRows = $page->filter('table.datatable > tbody > tr');

        $sector = null;

        $routeTableRows->each(function ($tr) use ($crag, &$sector, $coordinates) {

            $tds = $tr->children();

            $sectorName = $tds->eq(2)->text();

            if (!isset($sector) || $sector->name != $sectorName) {
                // novi sektor
                // type_id = 7
                $sector = $this->_getArea($crag, $sectorName, 7);

                $this->_storeMapTag($sector, array_shift($coordinates));
            }

            $link = $tds->eq(2)->filter('a')->first()->attr('href');

            $route = $this->_storeRoute([
                'name' => $tds->eq(1)->text(),
                'grade' => $tds->eq(3)->text(),
                'length' => $tds->eq(4)->text(),
                'area_id' => $sector->id

            ]);

            $this->_storeLink($route, $link);
        });

        return $crag;
    }

    private function _storeRoute($routeArray)
    {

        $routeArray['name'] = $this->_santizeName($routeArray['name']);
        $routeArray['length'] = $routeArray['length'] == '' ? null : $routeArray['length'];

        $routeArray['type_id'] = $routeArray['length'] > 50 ? 0 : 1;

        $grades = $this->_parseGrade($routeArray['grade']);

        unset($routeArray['grade']);

        $route = Route::where('area_id', $routeArray['area_id'])
            ->where('name', $routeArray['name'])
            ->first();

        if ($route) {
            $route->fill($routeArray);
            $route->save();
        } else {
            $route = Route::create($routeArray);
        }

        $route->saveGrades($grades);

        return $route;
    }

    private function _parseCrag($parent, $page)
    {

        $name = $page->filter('div.full-width > h2')->eq(0)->text();

        echo $name . "\n";

        // type_id for crag => 6
        $crag = $this->_getArea($parent, $name, 6);

        // location

        $coordinates = $this->_getMapLocations($page);

        $this->_storeMapTags($crag, $coordinates);

        $routeTableRows = $page->filter('table.datatable > tbody > tr');

        $routeTableRows->each(function ($tr) use ($crag) {

            $tds = $tr->children();

            $link = $tds->eq(1)->filter('a')->first()->attr('href');

            $route = $this->_storeRoute([
                'name' => $tds->eq(1)->text(),
                'grade' => $tds->eq(2)->text(),
                'length' => $tds->eq(3)->text(),
                'area_id' => $crag->id
            ]);

            $this->_storeLink($route, $link);

            return $crag;
        });

        return $crag;
    }

    private function _getMapLocations($page)
    {

        $mapScriptTag = $page->filter('script')->last();

        $matches = [];

        preg_match_all('/L\.marker\(\[\d{2}\.\d{3,9}\,\d{2}\.\d{3,9}\]\,\s\{title:\s\"Penjanje\"\s\}\);/', $mapScriptTag->text(), $matches);

        $coordinates = [];

        foreach ($matches[0] as $match) {
            $tmp = preg_split('/[\[|\]|\,]/', $match);
            // [lat, lng]
            array_push($coordinates, [$tmp[2], $tmp[1]]);
        }

        return $coordinates;
    }

    private function _storeMapTags($area, $coordinates)
    {
        foreach ($coordinates as $coordinate) {
            $this->_storeMapTag($area, $coordinate);
        }
    }

    private function _storeMapTag($area, $coordinate)
    {
        $area->mapTag()->delete();

        if ($coordinate == null) return;

        $area->mapTag()
            ->create(
                [
                    'geometry' => [
                        'type' => 'Point',
                        'coordinates' => $coordinate
                    ]
                ]
            );
    }

    private function _storeLink($model, $href)
    {

        if (Link::where('href', $href)->first()) {
            echo "SKIPPING ( link exists ) : $href \n";

            return;
        }

        $link = $model->links()
            ->create(
                [
                    'name' => 'Plave gore',
                    'href' => $href
                ]
            );

        echo '** LINK: ' . $href . "\n";
    }

    private function _loginMe()
    {
        $user = User::where('email', 'marko.cepo.vk@gmail.com')->first();
        auth()->login($user);
    }

    private function _setGradeWeight(&$gradeWeights, $type, $grade)
    {
        // gradeWeights is structured like this because frontend form is sending
        // grades back in this format
        array_push($gradeWeights, [$this->_getTypeId($type), $this->_getWeight($grade)]);
    }

    private function _getTypeId($type)
    {
        return array_search($type, array_keys(config('types.climbing')));
    }

    private function _getWeight($grade)
    {
        if (is_null($type = $this->_getType($grade))) {
            return null;
        }

        $weights = array_keys(config('types.grades')[$type], $grade);

        return end($weights);
    }

    private function _getType($grade)
    {
        foreach ($this->patterns as $type => $pattern) {
            if (preg_match($pattern, $grade)) {
                return $type;
            }
        }
        return null;
    }

    private function _parseGrade($grade)
    {

        $gradeWeights = [];

        // tehnical climbing grade
        if (preg_match($this->patterns['tehnical'], $grade, $tehnicalGrade)) {
            $grade = preg_replace($this->patterns['tehnical'], '', $grade);
            $this->_setGradeWeight($gradeWeights, 'tehnical', $tehnicalGrade[0]);
        }

        // french climbing grade
        if (preg_match($this->patterns['fr'], $grade, $frenchGrade)) {
            $grade = preg_replace($this->patterns['fr'], '', $grade);
            $this->_setGradeWeight($gradeWeights, 'max', $frenchGrade[0]);

            return $gradeWeights;
        }

        // uiaa climbing grade
        if (preg_match($this->patterns['uiaa'], $grade, $uiaaGrade)) {
            $grade = preg_replace($this->patterns['uiaa'], '', $grade);
            $this->_setGradeWeight($gradeWeights, 'max', $uiaaGrade[0]);
        }

        return $gradeWeights;
    }

    private function _santizeName($name)
    {
        $lower = mb_strtolower($name);
        $lowerArray = explode(' ', $lower);
        $lowerArray[0] = mb_convert_case($lowerArray[0], MB_CASE_TITLE_SIMPLE);
        $lower = implode(' ', $lowerArray);
        return $lower;
    }
}
