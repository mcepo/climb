<?php

namespace App\Models\Traits;

trait IsDescendent
{
    public function scopeDescendents($query, $path)
    {
        $query->where(
            function ($query) use ($path) {
                $query->where('path', $path)->orWhere('path', 'like', $path . '.%');
            }
        );
    }
}