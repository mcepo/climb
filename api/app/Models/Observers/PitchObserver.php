<?php

namespace App\Models\Observers;

use App\Models\Pitch;

class PitchObserver
{

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
        // delete all grades
        // delete all image tags
        $pitch->imageTags()->delete();
        $pitch->grades()->delete();
    }
}
