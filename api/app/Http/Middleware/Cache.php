<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cache
{
   /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $guard = null)
    {

      // $key = $request->getRequestUri();

      // if(cache()->has($key)) {
      //   return response()->json(cache()->get($key));
      // }

      $response = $next($request);

      //cache()->set($key, $response->getOriginalContent());

      return $response;
    }
}