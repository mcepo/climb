<?php

use App\Models\Area;
use App\Models\Image;
use App\Models\Pitch;
use App\Models\Route;
use App\Models\Trail;
use App\Role;
use App\User;
use Faker\Generator;
use Illuminate\Database\Seeder;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\File;
use Spatie\Activitylog\Models\Activity;

class DatabaseSeeder extends Seeder
{
    private $_faker;

    public function __construct()
    {
        $this->_faker = app(Generator::class);

        // \DB::listen(function ($query) {
        //     dump(
        //         implode("\n", [$query->sql, json_encode($query->bindings), $query->time])
        //     );
        // });
    }

    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

        echo "Seeding ...\n";

        echo "Root user ...";

        $this->_addRootUser();

        echo "Done\nTiding up image storage ...";

        // if in production i don't want the following 
        // seeders to execute
        if(config('app.env') == 'production') return ;


        // create folders for image storage if non exists
        $imageStorage = config('filesystems.disks.images');

        if (!File::exists($imageStorage['root'])) {
            File::makeDirectory($imageStorage['root']);
        } else {
            (new Filesystem)->cleanDirectory($imageStorage['root']);
        }

        if (!File::exists($imageStorage['root'] . '/0')) {
            for ($i = 0; $i < $imageStorage['number_of_folders']; $i++) {
                File::makeDirectory($imageStorage['root'] . "/{$i}");
            }
        }

        echo "Done\nSeeding areas ...";

        // adding areas
        for ($i = 1; $i < 5; $i++) {
            factory(Area::class, 2 * $i)->create()->each(function ($area) {
                $this->_addMapTag($area, ['Point']);

                // adding images of area
                $this->_addImageTo($area, 2);

                // adding image tags of area
                $this->_addImageTag($area, ['Point'], 3);
            });
        }

        echo "Done\nSeeding routes ...";

        // adding routes
        factory(Route::class, 20)->make()->each(function ($route) {
            $grades = $route->grades;
            unset($route->grades);

            $route->save();

            foreach ($grades as $type => $weight) {
                $route->grades()->create([
                    'type_id' => $type,
                    'weight' => $weight,
                    'path' => $route->path,
                ]);
            }

            // adding map tags of route
            $this->_addMapTag($route, ['Point']);

            // adding image tags of route
            $this->_addImageTag($route, ['LineString'], 'latitude', 2);

            // adding pitches
            factory(Pitch::class, rand(2, 20))
                ->make(['route_id' => $route->id])
                ->each(
                    function ($pitch, $key) {

                        $grades = $pitch->grades;
                        unset($pitch->grades);

                        $pitch->save();

                        foreach ($grades as $type => $weight) {
                            $pitch->grades()->create([
                                'type_id' => $type,
                                'weight' => $weight,
                                'path' => $pitch->path,
                            ]);
                        }


                        // adding image tags of pitche
                        $this->_addImageTag($pitch, ['LineString'], 'latitude', 2);
                    }
                );
        });

        echo "Done\nSeeding trails ...";

        // adding trails
        factory(Trail::class, 20)->create()->each(function ($trail) {

            // adding map tags of trail
            $this->_addMapTag($trail, ['LineString'], 'longitude');

            // adding image tags of trail
            $this->_addImageTag($trail, ['LineString'], 'longitude', 2);
        });

        echo "Done\nApproving all objects added ...";

        $user = User::first();

        Activity::whereNull('status')->update([
            'status' => true, 
            'reviewed_at' => now(), 
            'reviewed_by' => $user->id
        ]);

        echo "Done\nAdding users ...";

        $this->_addUsers();

        echo "Done\n";
    }

    private function _addImageTo($item, $upperBound)
    {
        $count = rand(1, $upperBound);
        factory(App\Models\Image::class, $count)
            ->make()
            ->each(function ($image) use ($item) {
                $savedImage = $item->images()
                    ->save($image);

                $this->_addMapTag($savedImage, ['Point']);

                $this->_addImageTag($savedImage, ['Point'], 3);
            });
    }

    private function _addMapTag($item, $types, $moveBound = null)
    {
        $item->mapTag()->create([
            'geometry' => $this->_faker->featureGeometry([
                'allowedTypes' => $types,
                'moveBound' => $moveBound,
            ]),
        ]);
    }

    private function _addImageTag($item, $types, $moveBound = null, $upperBound = 1)
    {
        $numberOfTags = rand(0, $upperBound);

        for ($i = 0; $i < $numberOfTags; $i++) {
            $image = Image::inRandomOrder()->first();

            // same model, so this is ok for image tag
            $item->mapTag()->create([
                'geometry' => $this->_faker->featureGeometry([
                    'bounds' => [[0, 0], [$image->size[0] / 10, $image->size[1] / 10]],
                    'allowedTypes' => $types,
                    'moveBound' => $moveBound,
                ]),
                'image_id' => $image->id,
            ]);
        }
    }

    private function _addRootUser() {

        $user = new User([
            'name' => 'Marko Čepo',
            'role_id' => User::ADMIN,
            'email' => 'marko.cepo.vk@gmail.com',
            'password' => 'Climb!'
        ]);

        $user->save();

        auth()->loginUsingId($user->id);
    }

    private function _addUsers() {

        factory(User::class, 20)->create()->each(function($user) {
            $numberOfAreas = rand(0, 10);

            $areas = Area::inRandomOrder()
                ->limit($numberOfAreas)->get();

            $areaIds = $areas->pluck('id')
                ->unique()
                ->filter(function ($path) { return $path != null;})
                ->values()
                ->all();

            if(count($areaIds)) {
                $user->areas()->attach($areaIds);
            }
        });
    }
}
