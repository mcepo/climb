<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Gate;

use App\Jobs\AreaUpdateJob;

class Controller extends BaseController
{
    public function canUserModify($item)
    {

        return Gate::authorize('authorize', $item);
    }

    public function isAdmin()
    {

        $user = auth()->user();

        if(!$user || !$user->isAdmin()) {
            abort(403, 'This action is unauthorized.');
        }
    }

    public function updateAreaStats($areaId) 
    {
        // i some cases i send a path in, so then i want to get the last id
        $areaIdArray = explode('.', $areaId);
        $areaId = end($areaIdArray);

        AreaUpdateJob::dispatch($areaId);
    }
}
