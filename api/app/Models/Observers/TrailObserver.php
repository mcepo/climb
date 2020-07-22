<?php

namespace App\Models\Observers;

use App\Models\Trail;
use App\Models\Area;

class TrailObserver
{

    public function saving(Trail $trail)
    {
        $trail->owner_id = auth()->user()->id;

        if ($trail->isDirty('area_id')) {
            // get path from parent
            $area = Area::findOrFail($trail->area_id);
            $trail->path = $area->getPathWithSelf();
        }
    }

    public function deleting(Trail $trail)
    {
        $trail->imageTags()->delete();
    }
}
