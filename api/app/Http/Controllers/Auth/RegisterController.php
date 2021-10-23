<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\User;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        if ($user = User::register($request->all())) {
  
            $user->sendEmailVerificationMail();
        } else {
            return response(null, 409);
        }
    }
}
