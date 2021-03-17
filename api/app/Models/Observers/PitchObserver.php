<?php

namespace App\Models\Observers;

use App\Models\Pitch;

class PitchObserver
{

    public function creating(Pitch $pitch)
    {
        Pitch::updateOrder($pitch->route_id, $pitch->order);
    }

    public function updating(Pitch $pitch)
    {
        if($pitch->isDirty('order'))
        {
            // order change is same as first deleting then adding a pitch
            Pitch::updateOrder($pitch->area_id, $pitch->original['order'], false);
            Pitch::updateOrder($pitch->area_id, $pitch->order);
        }
    }

    public function saving(Pitch $pitch)
    {
        $pitch->owner_id = auth()->user()->id;
        $pitch->path = $pitch->route->path;
    }

    public function saved(Pitch $pitch)
    {
        if (request()->has('grades')) {
            $pitch->saveGrades(request()->grades);
        }
    }

    public function deleting(Pitch $pitch)
    {

        Pitch::updateOrder($pitch->route_id, $pitch->original['order'], false);
        // delete all grades
        // delete all image tags
        $pitch->imageTags()->delete();
        $pitch->grades()->delete();
    }
}
