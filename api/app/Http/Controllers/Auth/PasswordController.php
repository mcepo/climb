<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

use App\Http\Requests\Request;

use App\User;

use App\Http\Requests\AuthRequest;

class PasswordController extends Controller
{

    public function forgotten(AuthRequest $request)
    {

        if(!$request->has('email')) {
            return abort(400);
        }

        $user = User::where('email', $request->get('email'))->first();

        if(!isset($user)) {
            return abort(400);
        }

        $user->sendPasswordResetLink();

        return response('Password reset link was sent to '.$request->get('email'), 200);
    }

    public function change(Request $request)
    {

        $user = User::findOrFail(auth()->user()->id);

        $user->password = $request->password;

        $user->save();

    }
}
