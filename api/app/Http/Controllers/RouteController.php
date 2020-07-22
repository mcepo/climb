<?php

namespace App\Http\Controllers;

use App\Models\Route;
use App\Models\Tag;
use App\Models\Pitch;
use Illuminate\Http\Request;

class RouteController extends Controller
{

    public function index(Request $request)
    {
        return response()->json(Route::loadChunk($request->all()));
    }

    public function store(Request $request)
    {
        $route = new Route($request->all());
        $route->save();

        return $route->id;
    }

    public function show(Route $route)
    {
        $route->load([
            'mapTag',
            'pitches.grades',
            'links'
        ])->append(['ancestors']);
        $route->loadImages();

        return response()->json($route);
    }

    public function move(Request $request, Route $route)
    {
        $this->isAdmin();

        $route->area_id = $request->get('id');
        $route->save();

        return $route->path;
    }

    public function update(Request $request, Route $route)
    {
        $this->canUserModify($route);

        $route->fill($request->all())->save();
    }

    public function destroy(Route $route)
    {
        $this->canUserModify($route);

        if(Tag::where(['tagged_type' => 'route', 'tagged_id' => $route->id])->count() == 0 && 
            Pitch::where(['route_id' => $route->id])->count() == 0 ) {
        
            $route->delete();
        } else {
            return response("Can't delete route while it is tagged or has pitches!", 403);
        }
    }
}
