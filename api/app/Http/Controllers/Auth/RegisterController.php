<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\User;

use App\Http\Requests\AuthRequest;

class RegisterController extends Controller
{
    public function register(AuthRequest $request)
    {
        if ($user = User::register($request->all())) {
  
            $user->sendEmailVerificationMail();
        } else {
            return response(null, 409);
        }
    }
}
