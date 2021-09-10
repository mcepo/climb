<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Route;

class WebController extends Controller
{   
    public function index()
    {
        return view('index', [
            'title' => 'ClimbLine - Community maintained online climbers guide',
            'description' => 'Home of free route topos and crag locations. Document your favorite crag in an easy and efficient manner while on the crag and share it with others or explore existing topos and crags',
            'keywords' => 'rock climbing guidebook, route topo, crag location, online guide'
        ]);
    }

    public function route($path, Route $route)
    {
        return view('index', [
            'title' => 'ClimbLine - ' . $route->name,
            'description' => "Explore route '" . $route->name . "' and add missing info.",
            'keywords' => 'rock climbing guidebook, route topo, crag location, online guide'
        ]);
    }

    public function area($path, Area $area)
    {
        $name = $area->name;

        if($area->isNoName()) {
            $name = $area->parent->name . ' - ' . $name;
        }

        return view('index', [
            'title' => 'ClimbLine - ' . $name,
            'description' => $name . ' currently has a route topo coverage of ' . ($area->tag_coverage * 100) . "%. Explore existing routes and add missing info.",
            'keywords' => 'rock climbing guidebook, route topo, crag location, online guide'
        ]);
    }
}
