<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

use App\Models\Area;
use App\Models\Route;
use App\Models\Grade;
use App\Models\Tag;
use App\Models\Image;
use App\Models\Trail;

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
    $areaOrientations = Area::distinct()
      ->select('orientation')
      ->descendents($path)
      ->whereNotNull('orientation')
      ->get()
      ->pluck('orientation');
    $routeOrientations = Route::distinct()
      ->select('orientation')
      ->descendents($path)
      ->whereNotNull('orientation')
      ->get()
      ->pluck('orientation');

    return $areaOrientations->merge($routeOrientations)->sort()->toArray();
  }

  private function _getRoutesByType($path)
  {

    $typeCountClean = [0, 0, 0, 0];

    Route::select(DB::raw('count(type_id) as count, type_id'))
      ->descendents($path)
      ->groupBy(['type_id'])
      ->get()
      ->keyBy('type_id')
      ->each(function ($type, $key) use (&$typeCountClean) {
        $typeCountClean[$key] = $type['count'];
      });

    return $typeCountClean;
  }

  private function _getTagCoverage($path)
  {
    $tagsCount = Tag::descendents($path)->count();

    $areaCount = Area::descendents($path)->count();

    // dividing multipitch count by 2 because usually there is no need to tag entrance 
    // to every single route because some route entrances are close together
    $routeMultiPitchCount = Route::where('type_id', 0)->descendents($path)->count() / 2;

    $routeSinglePitchCount = Route::where('type_id', '!=', 0)->descendents($path)->count();

    return round($tagsCount / ($areaCount + $routeMultiPitchCount + $routeSinglePitchCount + 1), 4);
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