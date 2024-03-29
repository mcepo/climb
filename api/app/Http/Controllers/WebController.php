<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Route;

class WebController extends Controller
{
   
    public function index()
    {
        // TODO
        // <meta name="description" content="Kalnik with map, topos, photos and more.">
        // <meta name="keywords" content="topo, climbing, rock climbing, bouldering, crag, boulder, route, climb, climbing trip">

        // og tags for facebook and twitter
        return view(
            'index', [
            'title' => 'Community maintained online climbers guide',
            'description' => 'Home of free route topos and crag locations. Document your favorite crag in an easy and efficient manner while on the crag and share it with others or explore existing topos and crags',
            'keywords' => 'rock climbing guidebook, route topo, crag location, online guide'
            ]
        );
    }

    public function route($path, Route $route)
    {
        return view(
            'index', [
            'title' => $route->name,
            'description' => "Explore route '" . $route->name . "' and add missing info.",
            'keywords' => 'rock climbing guidebook, route topo, crag location, online guide'
            ]
        );
    }

    public function area($path, Area $area)
    {
        $name = $area->name;

        if($area->isNoName()) {
            $name = $area->parent->name . ' - ' . $name;
        }

        return view(
            'index', [
            'title' => $name,
            'description' => $name . ' currently has a route topo coverage of ' . ($area->tag_coverage * 100) . "%. Explore existing routes and add missing info.",
            'keywords' => 'rock climbing guidebook, route topo, crag location, online guide'
            ]
        );
    }
}
