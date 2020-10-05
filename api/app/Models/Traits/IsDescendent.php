<?php

namespace App\Models\Traits;

trait IsDescendent
{
  public function scopeDescendents($query, $path)
  {
      return $query->where('path', $path)->orWhere('path', 'like', $path . '.%');
  }
}