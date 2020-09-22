<?php

namespace App\Console\Commands\PlaveGore;

use Illuminate\Console\Command;

use App\Models\Link;
use App\Models\Area;
use App\Models\Route;
use Goutte\Client;
use Symfony\Component\HttpClient\HttpClient;

use App\Console\Commands\Plezanje\GradeParser;

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
    protected $start_url = 'http://plave-gore.com/index.php';
    protected $base_url = 'http://plave-gore.com/';
    private $_runtime;
    private $_requestCount;

    private static $MOUNTAIN_COUNT = 7;
    private static $CRAG_COUNT = 11;

    private $gradeParser;

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

        for($i=1;$i <= self::$MOUNTAIN_COUNT; $i++) {

            $link = 'http://plave-gore.com/mt?id='.$i;

            $page = $this->_getPage($link);

            if ($page == null) {
                echo ' **** '. $link . ' is null';
                exit;
            }

            $this->parseMountain($page);

            break;
        }

        return;

        for($i=1;$i <= self::$CRAG_COUNT; $i++) {

            $link = 'http://plave-gore.com/cr?id='.$i;

            $page = $this->_getPage($link);

            if ($page == null) {
                echo ' **** '.$link. ' is null';
                exit;
            }
        }

        $this->_runtime = microtime(true) - $this->_runtime;

        echo 'DONE IN ' . $this->_runtime . ' - SENT REQUESTS ' . $this->_requestCount . "\n";
    }

    private function parseMountain($page) {

        $areaName = $page->filter('div#page-title-content > h2')->eq(0)->text();

        // type id for area => 1
        $area = $this->_getArea($this->_country, $areaName, 1);

        $cragLinks = $page->filter('.col-container > .one-third > dl#quick_facts > dt > a');

        $cragLinks->each(function($a) use ($area) {

            $page = $this->_getPage($a->attr('href'));

            if ($page == null) {
                echo ' **** '.$a->attr('href'). ' is null';
                exit;
            }

            $this->_parseCrag($area, $page);

        });
    }

    private function _getArea($parent, $name, $typeId) 
    {
        $areas = Area::where('name', 'ilike', $name)->get();

        if($areas->count() ==  0) {

            echo $name . " -> new area\n";

            $area = new Area([
                'name' => $name,
                'parent_id' => $parent->id,
                'type_id' => $typeId
            ]);

       //     $area->save();

        } else if ($areas->count() >  1) {
            echo $name . " -> multiple results\n";
        }

        if(!isset($area)) {
            $area = $areas[0];
        }

        return $area;
    }

    private function _getPage($link)
    {
        echo 'Crawling -> ' . $link . "\n";

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

    private function _parseCrag($parent, $page)
    {

        $name = $page->filter('div.full-width > h2')->eq(0)->text();

        // type_id for crag => 6
        $crag = $this->_getArea($parent, $name, 6);

        // get location, store in database

        $routeTableRows = $page->filter('table.datatable > tbody > tr');

        $routeTableRows->each(function($tr) use ($crag){

            $tds = $tr->children();

            $name = $tds->eq(1)->text();
            $grade = $tds->eq(2)->text();
            $length = $tds->eq(3)->text();

            // multipitch 0 ; singlepitch 1
            $type_id = $length > 50 ? 0 : 1;

             dump($name, $grade, $length, $type_id);
        });

        exit;
    }

    private function _storeLink($model, $href)
    {
        $link = $model->links()
                ->create(
                    [
                        'name' => 'Plave gore',
                        'href' => $href
                    ]
                );

        echo '** LINK: ' . $link->toJson() . "\n";
    }

    private function _loginMe() {
        auth()->loginUsingId(1);
    }
}
