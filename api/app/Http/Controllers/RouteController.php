<?php

namespace App\Http\Controllers;

use App\Models\Route;
use Illuminate\Http\Request;

class RouteController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth', ['except' => ['index','show']]);
        $this->middleware('check-cache', ['only' => ['show']]);
        $this->middleware('flush-cache', ['except' => ['show', 'index']]);
    }

    public function index(Request $request)
    {
        return response()->json(Route::loadChunk($request->all()));
    }

    public function store(Request $request)
    {
        $route = new Route($request->all());
        
        $route->save();

        $this->updateAreaStats($route->area_id);

        return [
            'id' => $route->id,
            'routes' => $route->area->routes->pluck('id')
        ];
    }

    public function show(Route $route)
    {
        $route->load(
            [
            'mapTag',
            'pitches.grades',
            'links'
            ]
        )->append(['ancestors']);

        $route->loadImages();

        return response()->json($route);
    }

    public function move(Request $request, Route $route)
    {
        $this->isAdmin();

        $oldParentId = $route->area_id;

        $route->area_id = $request->get('id');

        $route->save();

        $this->updateAreaStats($route->area_id);

        $this->updateAreaStats($oldParentId);

        return $route->path;
    }

    public function update(Request $request, Route $route)
    {
        // $this->canUserModify($route);

        $route->fill($request->all())->save();

        $this->updateAreaStats($route->area_id);

        return [
            'routes' => $route->area->routes->pluck('id')
        ];
    }

    public function destroy(Route $route)
    {
        $this->canUserModify($route);

        if($route->canBeDeleted()) {
        
            $route->delete();

            $this->updateAreaStats($route->area_id);

        } else {
            return response("Can't delete route while it is tagged or has pitches!", 408);
        }
    }
}
