<?php

namespace App\Models\Traits;


use Illuminate\Support\Facades\DB;
use App\Models\Area;

trait HasAncestors
{

  public function getAncestorsAttribute()
  {

    if ($this->path) {
      $ids = array_map('intval', explode('.', $this->path));
      $path = str_replace('.', ',', $this->path);
      return Area::orderByRaw(DB::raw("POSITION(id::text in '$path')"))
      // max_altitude and min_altitude is needed if i edit the child area
      // and parent wans't loaded already before i don't have altitude
        ->select('id', 'name', 'max_altitude', 'min_altitude', 'type_id', 'path')
        ->with('mapTag')
        ->findMany($ids);
    }
    return [];
  }

  public function getAncestorIdsAttribute()
  {
    return isset($this->path) ? explode('.', $this->path) : [];
  }
}
