<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\User;
use Socialite;
use \Firebase\JWT\JWT;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;


class AuthController extends Controller
{

  private function _getResponseWithToken($user)
  {
    // using app key for signiture, the key string is in format
    // base64:KEY
    // so i need to get the key and base64 decode it
    $key = base64_decode(explode(':', config('app.key'))[1]);

    $token = JWT::encode($user, $key);

    return [
      'token' => $token,
      'user' => $user
    ];
  }


  public function socialLogin($provider)
  {
    // Socialite will pick response data automatic 
    $providerUser = Socialite::driver($provider)->stateless()->user();

    if (!$user = User::getByProviderId($provider, $providerUser->id)) {
      $user = User::registerFromProvider($provider, $providerUser);
    }

    return response($this->_getResponseWithToken($user));
  }

  public function login(Request $request)
  {

    $credentials = $request->only('email', 'password');

    if (Auth::attempt($credentials)) {
      return response($this->_getResponseWithToken(Auth::user()));
    } else {
      // failed to login, 401 is taken when users aren't logged in 
      // and need to to perform an action, so i am using 400 for failed login
      return response(null, 400);
    }
  }

  public function register(Request $request)
  {
    if ($user = User::register($request->all())) {

      $user->sendEmailVerificationNotification();
    } else {
      return response(null, 409);
    }
  }

  /**
   * Mark the authenticated user’s email address as verified.
   *
   * @param \Illuminate\Http\Request $request
   * @return \Illuminate\Http\Response
   */
  public function verify(Request $request)
  {

    dump($request);

    $userID = $request['id'];
    $user = User::findOrFail($userID);
    $date = date("Y-m-d g:i:s");
    $user->email_verified_at = $date; // to enable the “email_verified_at field of that user be a current time stamp by mimicing the must verify email feature
    $user->save();
    return response()->json('Email verified!');
  }

  /**
   * Resend the email verification notification.
   *
   * @param \Illuminate\Http\Request $request
   * @return \Illuminate\Http\Response
   */
  public function resend(Request $request)
  {
    if ($request->user()->hasVerifiedEmail()) {
      return response()->json('User already have verified email!', 422);
      // return redirect($this->redirectPath());
    }
    $request->user()->sendEmailVerificationNotification();
    return response()->json('The notification has been resubmitted');
    // return back()->with(‘resent’, true);
  }

  public function forgotPassword()
  {
  }

  public function resetPassword()
  {
  }
}