<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Area;
use App\Models\Route;
use App\Models\Grade;
use App\Models\Tag;
use App\Models\Observers\AreaObserver;
use App\Models\Observers\RouteObserver;
use App\Models\Observers\TagObserver;
use App\Models\Observers\GradeObserver;
use App\Models\Trail;
use App\Models\Observers\TrailObserver;

use App\Models\Image;
use App\Models\Observers\ActivityObserver;
use App\Models\Observers\ImageObserver;
use App\Models\Pitch;
use App\Models\Observers\PitchObserver;
use Illuminate\Database\Eloquent\Relations\Relation;
use Spatie\Activitylog\Models\Activity;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Area::observe(AreaObserver::class);
        Route::observe(RouteObserver::class);
        Tag::observe(TagObserver::class);
        Grade::observe(GradeObserver::class);
        Trail::observe(TrailObserver::class);
        Image::observe(ImageObserver::class);
        Pitch::observe(PitchObserver::class);
        Activity::observe(ActivityObserver::class);
        
        Relation::morphMap(
            [
            'area' => 'App\Models\Area',
            'route' => 'App\Models\Route',
            'image' => 'App\Models\Image',
            'trail' => 'App\Models\Trail',
            'pitch' => 'App\Models\Pitch',
            'tag' => 'App\Models\Tag',
            ]
        );
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(
            \App\Services\AreaUpdateService::class, function ($app) {
                return new \App\Services\AreaUpdateService();
            }
        );
    }
}
