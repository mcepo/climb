<?php

namespace App\Models\Observers;

use App\Models\Route;
use App\Models\Area;
use App\Services\PathManager;

class RouteObserver
{

    public function saving(Route $route)
    {
        $route->owner_id = auth()->user()->id;

        if ($route->isDirty('area_id')) {
            // get path from parent
            $area = Area::findOrFail($route->area_id);
            $route->path = $area->getPathWithSelf();
        }
        // if route name changed update ts vector
        if ($route->isDirty('name')) {
            $route->updateTsVector();
        }
    }

    public function saved(Route $route)
    {
        // when the route is saved and route id is set
        // save the route grades if any
        if (request()->has('grades')) {
            $route->saveGrades(request()->grades);
        }

        if($route->isDirty('position')) {
            $route->updateSiblingPositions();
        }
    }

    public function updated(Route $route)
    {
        // if the route is updated and area_id is changed
        // update path to all related entities
        if ($route->isDirty('area_id')) {
            app()->make(PathManager::class)
                ->updateRoute($route);
        }
    }

    public function deleting(Route $route)
    {
        // getting all pitches in route and deleting them
        // can't do a mass delete because all pitches have 
        // relations that need to be deleted by hand
        $route->pitches->each(function ($pitch) {
            $pitch->delete();
        });

        $route->mapTag()->delete();
        $route->imageTags()->delete();
        $route->grades()->delete();
        $route->links()->delete();
    }
}
