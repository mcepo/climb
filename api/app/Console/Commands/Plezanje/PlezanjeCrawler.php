<?php

namespace App\Console\Commands\Plezanje;

use Illuminate\Console\Command;
use App\Models\Link;
use App\Models\Area;
use App\Models\Route;
use Goutte\Client;
use Symfony\Component\HttpClient\HttpClient;

class PlezanjeCrawler extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'crawler:plezanje';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crawler for www.plezanje.net';

    protected static $replace_country = [
        'Hrvaška' => 'Croatia',
        'Albanija' => 'Albania',
        'Slovenija' => 'Slovenia'
    ];

    protected static $mountainSides = [
        'severna stena' => 'North face',
        'severovzhodna stena' => 'Northeast face',
        'vzhodna stena' => 'East face',
        'jugovzhodna stena' => 'Southeast face',
        'južna stena' => 'South face',
        'jugozahodna stena' => 'Southwest face',
        'zahodna stena' => 'West face',
        'severozahodna stena' => 'Northwest face',
    ];

    protected static $orientations = [
        'North face' => 0,
        'Northeast face' => 45,
        'East face' => 90,
        'Southeast face' => 135,
        'South face' => 180,
        'Southwest face' => 225,
        'West face' => 270,
        'Northwest face' => 315,
    ];

    /**
    * The console command description.
    *
    * @var string
    */
    protected $start_url = 'https://www.plezanje.net/climbing/db/countryIntro.asp';
    protected $base_url = 'https://www.plezanje.net/climbing/db/';
    private $_pattern;
    private $_runtime;
    private $_requestCount;

    private $gradeParser;

    public function __construct()
    {
        parent::__construct();

        $this->gradeParser = new GradeParser();

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

        $this->_pattern = 'Croatia';

        $this->_runtime = microtime(true);
        $this->_requestCount = 0;

        echo "Starting update for pattern -> /$this->_pattern/i \n";

        $mainPage = $this->_getPage($this->start_url);

        if ($mainPage == null) {
            echo "Main page is null!\n";
            exit;
        }

        // get all the counteries on the page
        $countries = $mainPage->filter('.fmtTable')->children();

        $countries->each(
                function ($tr, $i) {
                    $td = $tr->children();

                    $country = $td->eq(0)->text();

                    //check if country has a english name in list
                    if (!isset(self::$replace_country[$country])) {
                        echo "Country $country  not listed in replace array \n";

                        return;
                    }
                    // check if country in pattern for parsing
                    if (!preg_match("/$this->_pattern/", self::$replace_country[$country])) {
                        echo "Skipping country $country \n";

                        return ;
                    }
                    echo 'Parsing countery ' . $country . "\n";

                    // get all pages for parsing
                    $pages = [
                        $td->eq(2)->filter('a'), // peak list
                        $td->eq(3)->filter('a'), // crags list
                        $td->eq(5)->filter('a'), // boldering areas
                        $td->eq(7)->filter('a') // ice climbing valleys
                    ];
       
                    foreach ($pages as $page) {
                        if ($page->count() === 1) {
                            // parse page
                            $this->_getFromLink(
                                $this->base_url
                                . $page->attr('href')
                            );
                        }
                    }
                }
            );

        $this->_runtime = microtime(true) - $this->_runtime;

        echo 'DONE IN ' . $this->_runtime . ' - SENT REQUESTS ' . $this->_requestCount . "\n";
    }

    private function _getFromLink($link)
    {
        $page = $this->_getPage($link);

        if ($page == null) {
            return;
        }

        // get the table with useful data from the page
        $areas = $page->filter('.fmtTable > tr, #wallTable > tr');

        // foreach row, if a link exists in row follow that link
        // to new page
        $areas->each(
                function ($tr) {
                    // rows with this class are to be skipped
                    if ($tr->attr('class') !== 'sectorRow expandable') {
                        // getting links from row
                        $a = $tr->filter('a');

                        // if there is only one link
                        if (($a->count()) === 1) {
                            // get area type that the link will lead to
                            $type = $this->_getAreaType($a);

                            // call aproppriate method for parsing
                            if ($type === 'crag') {
                                $this->_parseCrag($this->base_url . $a->attr('href'));
                            } else {
                                $this->_getFromLink($this->base_url . $a->attr('href'));
                            }
                        }
                    }
                }
            );
    }

    private function _getPage($link)
    {
        if (Link::where('href', $link)->first()) {
            echo "SKIPPING (link exists - DIDN'T OPEN LINK) : $link \n";

            return null;
        }

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

    private function _parseCrag($link)
    {
        $page = $this->_getPage($link);

        if ($page == null) {
            return;
        }

        [$name, $parent] = $this->_parseBreadcrumbs($page->filter('#breadcrumbs > p'));

        $parent = $this->_storeArea($parent, 'crag', $link, $name);
        $grandParent = $parent;

        $routes = $page->filter('#routeTable > tbody > tr');

        $routes->each(
                function ($tr, $i) use ($grandParent, &$parent, $link) {
                    if ($tr->attr('class') == 'sectorRow expandable') {
                        // this is a sector so store it as area
                        $parent = $this->_storeArea($grandParent, 'sector', $link, trim($tr->text()));
                    } else {
                        // this  is an actual route
                        $td = $tr->filter('td');
                        $href = $this->base_url . $td->eq(0)->filter('a')->eq(0)->attr('href');

                        $length = (int)preg_replace('/[^0-9]/', '', $td->eq(2)->text());
                        $grade = trim($td->eq(1)->text());

                        [$grades, $pitches] = $this->gradeParser->parse($grade);

                        $route = [
                            'name' => filter_var(trim($td->eq(0)->filter('a')->eq(0)->text()), FILTER_SANITIZE_STRING),
                            'length' => $length,
                            'grades' => $grades
                        ];

                        $routeModel = $this->_storeRoute($route, $parent, $pitches);
                        $this->_storeLink($routeModel, $href );
                    }
                }
            );
    }

    private function _parseBreadcrumbs($p)
    {
        $temp = explode(' >> ', $p->text());
        $name = end($temp);

        $parent = null;

        $p->eq(0)->filter('a')
                ->each(
                    function ($a, $i) use (&$parent) {
                        if ($i < 3) {
                            return;
                        }

                        $name = $a->text();
                        $link = $this->base_url . $a->attr('href');

                        $type = $this->_getAreaType($a);

                        if ($type == 'type') {
                            $type = 'country';
                            $name = self::$replace_country[$name];
                        }

                        $parent = $this->_storeArea($parent, $type, $link, $name);
                    }
                );

        return [$name, $parent];
    }

    private function _storeArea($parent, $type, $href, $name)
    {
        // checking if his link was already visited
        $link = Link::where('href', $href)->first();

        // if the area is a sector the don't check that it exists
        // because a lot of sectors has short names and there is a lot of duplicates
        if (isset($link->linked_id) && $type != 'sector') {
            echo "SKIPPING link exists: $href -> $name -> $type\n";
            return Area::find($link->linked_id);
        }

        // check if the area is already stored by checking area name and parent id
        if ($parent == null) {
            $area = Area::where(['name' => $name, 'parent_id' => null])->first();
        } else {
            $area = Area::where(['name' => $name, 'parent_id' => $parent->id])->first();
        }

        if (isset($area->id)) {
            echo 'SKIPPING: area exists!';

            return $area;
        }

        // if the area is a peak get altitude from area name
        if ($type === 'peak') {
            // get max altitude from peak name
            [$name, $maxAltitude] = $this->_parseMaxAltitude($name);
        }

        // get mountain side from area name
        $name = $this->_parseMountainSide($name);
        $orientation = $this->_parseOrientation($name);

        // if i got orientation from area name then it is a mountain side
        if (!is_null($orientation)) {
            $type = 'mountain_side';
        }

        // get id of area type
        $areaType = $this->_getAreaTypeId($type);

        if ($areaType === false) {
            // id must exist if it doesn't exist then this is an error
            throw new \Exception("Area type {$type} not found!\n");
        }

        $area = [
            'name' => filter_var($name, FILTER_SANITIZE_STRING),
            'max_altitude' => isset($maxAltitude) ? $maxAltitude : null,
            'type_id' => $areaType,
            'orientation' => $orientation
        ];

        if ($parent) {
            $area['parent_id'] = $parent->id;
        }

        $area = new Area($area);
        $area->save();

        $this->_storeLink($area, $href);

        echo '*** AREA: ' . $area->toJson() . "\n";

        return $area;
    }

    private function _storeRoute($route, $area, $pitches = [])
    {
        if ($route['length'] == 0) {
            $route['length'] = null;
        }
        $routeType = $this->_getRouteTypeId((!empty($pitches) || $route['length'] > 40) ? 'multipitch' : 'singlepitch');

        if ($routeType === false) {
            throw new \Exception("No route type {$routeType}!\n");
        }

        $route['type_id'] = $routeType;
        $route['area_id'] = $area->id;
        $grades = $route['grades'];

        $route = new Route($route);
        $route->save();

        $route->saveGrades($grades);

        foreach ($pitches as $key => $value) {
            [$grades] = $this->gradeParser->parse($value);
            $pitch = $route->pitches()->create([
                'length' => null,
            ]);
            $pitch->saveGrades($grades);
        }

        echo '** ROUTE: ' . $route->toJson() . "\n";

        return $route;
    }

    private function _storeLink($model, $href)
    {
        $link = $model->links()
                ->create(
                    [
                        'name' => 'Plezanje.net',
                        'href' => $href
                    ]
                );

        echo '** LINK: ' . $link->toJson() . "\n";
    }

    private function _parseMountainSide($name)
    {
        foreach (self::$mountainSides as $sloMountainSide => $engMountainSide) {
            if (strpos($name, ', ' . $sloMountainSide) !== false) {
                return $engMountainSide;
            }
        }

        return $name;
    }

    private function _parseOrientation($name)
    {
        foreach (self::$orientations as $orientation => $deg) {
            if (strcmp($name, $orientation) == 0) {
                return $deg;
            }
        }

        return null;
    }

    private function _parseMaxAltitude($name)
    {
        $tmp = preg_split("/\(|\)/", $name);

        if (count($tmp) == 1) {
            return [
                $name,
                null
            ];
        } else {
            $max_altitude = (int) filter_var($tmp[1], FILTER_SANITIZE_NUMBER_INT);
            if ($max_altitude == 0) {
                $max_altitude = null;
            }

            return [
                trim($tmp[0]),
                $max_altitude
            ];
        }
    }

    private function _getAreaType($a)
    {
        return (preg_split('/[\\?=]/', $a->attr('href')))[1];
    }

    private function _getRouteTypeId($type) {
        return array_search($type, config('types.routes'));
    }

    private function _getAreaTypeId($type) {
        return array_search($type, config('types.areas'));
    }

    private function _loginMe() {
        auth()->loginUsingId(1);
    }
}
