<?php

namespace App\Models\Filters;

trait BboxFilter
{

    public function scopeFilterByCenter($query, $center)
    {
        return $query->whereHas('mapTag', function ($query) use ($center) {

            $centerRaw = implode(', ', $center);

            // 0.1 === 10km radius
            return $query->whereRaw(
                /* 100km radius for testing TODO: change this to 0.5 in production */
                "ST_DWithin(binary_coordinates, ST_SetSRID(ST_MakePoint($centerRaw),4326), 10)"
            );
        });
    }
}
