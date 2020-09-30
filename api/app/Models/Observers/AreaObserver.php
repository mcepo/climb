<?php

namespace App\Models\Observers;

use App\Models\Area;
use App\Services\PathManager;

class AreaObserver
{

    public function saving(Area $area)
    {
        $area->owner_id = auth()->user()->id;

        if (isset($area->parent_id)) {
            $parent = Area::findOrFail($area->parent_id);
            $area->path = $parent->getPathWithSelf();
        }
    }

    public function updated(Area $area)
    {
        if ($area->isDirty('parent_id')) {

            $originalPath = $area->getOriginal('path');
            $originalPathWithSelf = $originalPath ? implode('.', [$originalPath, $area->id]) : $area->id;

            app()->make(PathManager::class)
                ->updateArea($area->getPathWithSelf(), $originalPathWithSelf);
        }
    }

    public function deleting(Area $area)
    {

        // getting all subareas in area and deleting them
        // can't do a mass delete because all areas have 
        // relations that need to be deleted by hand
        $area->areas->each(function ($area) {
            $area->delete();
        });

        // same as with subareas
        $area->routes->each(function ($route) {
            $route->delete();
        });

        $area->mapTag()->delete();

        // same as with images of area
        $area->images->each(function ($image) {
            $image->delete();
        });

        $area->imageTags()->delete();
        $area->links()->delete();
    }
}
