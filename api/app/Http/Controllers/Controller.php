<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Gate;

class Controller extends BaseController
{
    public function canUserModify($item) {

        return Gate::authorize('authorize', $item);
    }

    public function isAdmin() {

        $user = auth()->user();

        if(!$user || !$user->isAdmin()) {
            abort(403, 'This action is unauthorized.');
        }
    }
}
