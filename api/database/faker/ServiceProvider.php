<?php

namespace App\Faker;

use Faker\Generator;
use App\Faker\Providers\Geojson;
use App\Faker\Providers\ClimbingGrades;
use App\Models\Grade;

class ServiceProvider extends \Illuminate\Support\ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {

        $this->app->singleton(Generator::class, function ($app) {

            $faker = \Faker\Factory::create();
            
            $faker->addProvider(new Geojson($faker));
            $faker->addProvider(new ClimbingGrades($faker, Grade::class));
            return $faker;
        });
    }
}
