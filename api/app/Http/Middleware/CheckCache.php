<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CheckCache
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

        $route = $request->route();

        $routeName = $request->route()->getName();

        if(!$routeName || $request->getQueryString() !== null) {
          return $next($request);
        }

        [$model] = explode('.', $routeName);

        $modelId = $route->parameter($model);

        $cacheKey = $routeName.$modelId;

        if(Cache::has($cacheKey)) {
          return Cache::get($cacheKey);
        }

        $response = $next($request);

        Cache::put($cacheKey, $response);

        return $response;
    }
}