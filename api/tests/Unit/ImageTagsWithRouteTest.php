<?php

namespace Tests\Unit;

use App\Models\Image;
use App\Models\Pitch;
use App\Models\Route;
use Tests\TestCase;

class ImageTagsWithRouteTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        \DB::listen(function ($query) {
            dump(
                implode("\n", [$query->sql, json_encode($query->bindings), $query->time])
            );
        });
    }

    public function testWork(){
        $image = Image::find(1)->load(['captured', 'tags.tagged']);

        $routeIds = $image->tags
            ->pluck('tagged')
            ->groupBy(function($model) {
                return get_class($model);
            })[Pitch::class]
            ->pluck('route_id')
            ->unique();

        $routes = Route::findMany($routeIds);

        dump($routes);
    }

}
