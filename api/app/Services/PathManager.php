<?php

namespace App\Services;

use App\Models\Area;
use App\Models\Grade;
use App\Models\PitchGrade;
use App\Models\Route;
use App\Models\Pitch;
use App\Models\Trail;
use App\Models\Image;
use App\Models\Tag;

class PathManager
{

    public function updateArea($path, $oldPath)
    {

        $classesWithPath = [
        Area::class,
        Route::class,
        Trail::class,
        Image::class,
        Grade::class,
        Pitch::class,
        PitchGrade::class,
        Tag::class
        ];

        // how much characters to remove from path in database it is 
        // equal to oldPath length
        // and then prepend the new path
        $pathSubstring = strlen($oldPath) + 1;
        $updateQueryPart = [
        'path' => \DB::raw(" ('$path' || substring(path from $pathSubstring))")
        ];

        foreach ($classesWithPath as $class) {
            if (method_exists($class, 'scopeDescendents')) {
                $class::descendents($oldPath)->update($updateQueryPart);
            }
        }

    }

    public function updateRoute($route)
    {

        $path = $route->path;

        $updateArray = ['path' => $path];

        $route->grades()->update($updateArray);
        $route->pitches()->update($updateArray);
        $route->imageTags()->update($updateArray);
        $route->mapTag()->update($updateArray);

        $pids = $route->pitches->pluck('id')->toArray();

        // update pitch grades path
        PitchGrade::whereIn('pitch_id', $pids)->update($updateArray);

        // have to get all pitches of a route and then change tag for each
        Tag::where('tagged_type', 'pitch')->whereIn('tagged_id', $pids)->update($updateArray);
    }
}
