<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

use App\Models\Area;
use App\Models\Route;
use App\Models\Grade;
use App\Models\Tag;
use App\Models\Image;
use App\Models\Trail;
use App\Models\Pitch;

class AreaUpdateService
{

    // passing in the id of an area that i want to update

    public function updateWithParents($areaId)
    {

        while ($areaId) {
            $area = Area::find($areaId);

            $this->update($area);

            $areaId = $area->parent_id;
        }
    }

    public function update($area)
    {

        $path = $area->getPathWithSelf();

        $area->grade_stats = $this->_getGradeStats($path);
        $area->orientations = $this->_getOrientations($path);
        $area->route_stats = $this->_getRoutesByType($path);
        $area->length_stats = $this->_getLengthStats($path);
        $area->tag_coverage = $this->_getTagCoverage($path);
        $area->image_count = $this->_getImageCount($path);
        $area->trail_count = $this->_getTrailCount($path);

        $area->updateTsVector();

        $area->save();
    }

    private function _getGradeStats($path)
    {

        // some grade types are just rediculous to report
        // like required grade
        return Grade::select(DB::raw('count(weight) as count, weight, type_id'))
            ->whereIn('type_id', [0, 1, 2, 3, 5, 10])
            ->descendents($path)
            ->groupBy(['type_id', 'weight'])
            ->orderBy('type_id', 'asc')
            ->orderBy('weight', 'asc')
            ->get()
            ->groupBy('type_id')
            ->transform(
                function ($item) {
                    return $item->keyBy('weight')
                        ->transform(
                            function ($item) {
                                return $item['count'];
                            }
                        );
                }
            )
        ->toArray();
    }

    private function _getLengthStats($path)
    {
        return Route::select(DB::raw('count(length) as count, length'))
            ->descendents($path)
            ->groupBy(['length'])
            ->orderBy('length', 'asc')
            ->whereNotNull('length')
            ->get()
            ->keyBy('length')
            ->transform(
                function ($item) {
                    return $item->count;
                }
            )
        ->toArray();
    }

    private function _getOrientations($path)
    {

        $orientations = [
        0 => 0,
        45 => 0,
        90 => 0,
        135 => 0,
        180 => 0,
        225 => 0,
        270 => 0,
        315 => 0
        ];

        Area::select(['orientation', 'route_stats'])
            ->descendents($path)
            ->whereNotNull('orientation')
            ->get()
            ->each(
                function ($area) use (&$orientations) {
                    if (!isset($orientations[$area->orientation])) {
                            $orientations[$area->orientation] = array_sum($area->route_stats ?? []);
                    } else {
                          $orientations[$area->orientation] += array_sum($area->route_stats ?? []);
                    }
                }
            );

        Route::select('orientation')
            ->descendents($path)
            ->whereNotNull('orientation')
            ->get()
            ->each(
                function ($route) use (&$orientations) {
                    if (!isset($orientations[$route->orientation])) {
                        $orientations[$route->orientation] = 1;
                    } else {
                        $orientations[$route->orientation] += 1;
                    }
                }
            );

        $orientationCount = array_sum($orientations);

        if($orientationCount !== 0) {
            $orientationsPercentage = array_map(
                function ($item) use ($orientationCount) {
                    return round(($item / $orientationCount) * 100, 2);
                }, $orientations
            );
  
            return $orientationsPercentage;
        }

        return null;
    }

    private function _getRoutesByType($path)
    {

        $typeCountClean = [0, 0, 0, 0];

        Route::select(DB::raw('count(type_id) as count, type_id'))
            ->descendents($path)
            ->groupBy(['type_id'])
            ->get()
            ->keyBy('type_id')
            ->each(
                function ($type, $key) use (&$typeCountClean) {
                    $typeCountClean[$key] = $type['count'];
                }
            );

        return $typeCountClean;
    }

    private function _getTagCoverage($path)
    {
        $imageToposCount = Tag::descendents($path)
            ->whereNotNull('image_id')
            ->where(
                function ($query) {
                    $query->where('tagged_type', 'route')
                        ->orWhere('tagged_type', 'pitch');
                }
            )->count();

        $pitchCount = Pitch::descendents($path)->count();

        // multipitch routes without added pitches
        // summing their lengths and then dividing it by 30 to get a ruff estimate on the number of pitches
        $routeMultiPitchCount = Route::where('type_id', '=', 0)->descendents($path)->doesntHave('pitches')->sum('length') / 30;

        $routeSinglePitchCount = Route::where('type_id', '!=', 0)->descendents($path)->count();
    
        if($imageToposCount === 0 || ($pitchCount === 0 && $routeSinglePitchCount === 0 && $routeMultiPitchCount === 0)) {
            return 0;
        }

        return round($imageToposCount / ($pitchCount + $routeSinglePitchCount + $routeMultiPitchCount), 4);
    }

    private function _getImageCount($path)
    {
        return Image::descendents($path)->count();
    }

    private function _getTrailCount($path)
    {
        return Trail::descendents($path)->count();
    }
}
