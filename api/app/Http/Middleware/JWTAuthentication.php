<?php

namespace App\Http\Middleware;

use App\User;
use Closure;
use Exception;
use \Firebase\JWT\JWT;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JWTAuthentication
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure                 $next
     * @param  string|null              $guard
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $guard = null)
    {
        if($request->hasHeader('Authorization')) {
            // get authorization header from request
            $token = explode(' ', $request->header('Authorization'))[1];

            // using app key for signiture, the key string is in format
            // base64:KEY
            // so i need to get the key and base64 decode it
            $key = base64_decode(explode(':', config('app.key'))[1]);

            try {
                // try and get user data from JWT
                $userArray = (array) JWT::decode($token, $key, array('HS256'));

                // create a new user object from user array data
                $user = new User($userArray);

                // don't want the user id to be fillable in the user model
                // better this way
                $user->id = $userArray['id'];

                // login the new user
                Auth::login($user);
          
            } catch (Exception $e) {
                // unable to authenticate user from JWT
                // ignore error
            }
        }

        $response = $next($request);
      
        if(!isset($token) && auth()->user() && $response->status() === 200) {

            $jwtToken = auth()->user()->getToken();
        
            $response->headers->set('Authorization', 'Bearer ' . $jwtToken);
        }

        return $response;
    }
}