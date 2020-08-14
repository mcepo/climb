<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

use App\Http\Requests\Request;

use App\User;

class PasswordController extends Controller
{

    public function forgotten() {

    }

    public function change(Request $request) {

        $user = User::findOrFail(auth()->user()->id);

        $user->password = $request->password;

        $user->save();

    }
}
