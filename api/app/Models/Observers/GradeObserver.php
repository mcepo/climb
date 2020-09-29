<?php

namespace App\Models\Observers;

use App\Models\Route;
use App\Models\Grade;

class GradeObserver
{
    public function saving(Grade $grade)
    {
        if ($grade->isDirty('route_id')) {
            $route = Route::findOrFail($grade->route_id);
            $grade->path = $route->path;
        }
    }
}
