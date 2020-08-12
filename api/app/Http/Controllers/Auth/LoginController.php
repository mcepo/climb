<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Socialite;

use App\User;

class LoginController extends Controller
{
    public function socialLogin($provider)
    {
      // Socialite will pick response data automatic 
      $providerUser = Socialite::driver($provider)->stateless()->user();
  
      if (!$user = User::getByProviderId($provider, $providerUser->id)) {
        $user = User::registerFromProvider($provider, $providerUser);
      }
  
      return response($user->getToken());
    }
  
    public function login(Request $request)
    {
  
      $credentials = $request->only('email', 'password');
  
      if (Auth::attempt($credentials)) {
        return response(auth()->user()->getToken());
      } else {
        // failed to login, 401 is taken when users aren't logged in 
        // and need to to perform an action, so i am using 400 for failed login
        return response(null, 400);
      }
    }
}
