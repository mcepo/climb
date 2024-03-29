<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

use Laravel\Socialite\Facades\Socialite;

use App\User;

use App\Http\Requests\AuthRequest;

class LoginController extends Controller
{
    public function socialLogin($provider)
    {
        // Socialite will pick response data automatic 
        $providerUser = Socialite::driver($provider)->userFromToken(request()->post('access_token'));
  
        if (!$user = User::getByProviderId($provider, $providerUser->id)) {
            $user = User::registerFromProvider($provider, $providerUser);
        }

        Auth::login($user);
    }
  
    public function login(AuthRequest $request)
    {
  
        $credentials = $request->only('email', 'password');
  
        // failed to login, 401 is taken when users aren't logged in 
        // and need to to perform an action, so i am using 400 for failed login

        if (!Auth::attempt($credentials)) {

            return response('Invalid credentials.', 400);
        }

        // at this point user is succesfully logged in

        // now i am checking if his email is verified
        // if not send an error response

        if(!auth()->user()->hasVerifiedEmail()) {

            return response('Please verify your email before using the application.', 422);
        }
    }
}
