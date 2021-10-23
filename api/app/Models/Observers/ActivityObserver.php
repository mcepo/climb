<?php

namespace App\Models\Observers;

use Spatie\Activitylog\Models\Activity;

class ActivityObserver
{

    public function saving(Activity $activity)
    { 
        if(!$activity->path) {
            $activity->path = $activity->properties->get('attributes')['path'];
        }
    }
}
