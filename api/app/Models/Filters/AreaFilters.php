<?php

namespace App\Models\Filters;

trait AreaFilters
{
    public function filterPath($query, $path) {

        $temp = explode('.', $path);

        $parent_id = end($temp);

        return $query->where(function ($query) use ($parent_id){
            return $query->where('parent_id', $parent_id)->orWhere('id', $parent_id);
        });
    }
}
