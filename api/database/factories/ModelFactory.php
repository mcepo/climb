<?php
use Faker\Generator as Faker;
use App\Models\Area;
use App\Models\Grade;
use App\Models\Route;
use App\Models\Image;

$factory->define(App\Models\Area::class, function (Faker $faker) {
    $parent = Area::inRandomOrder()->first();

    if (isset($parent)) {
        $parent_id = $parent->id;

        $min_altitude = $faker->numberBetween($parent->min_altitude, $parent->max_altitude);
        $max_altitude = $faker->numberBetween($min_altitude, $parent->max_altitude);
    } else {

        $parent_id = null;

        $min_altitude = $faker->numberBetween(0, 4000);
        $max_altitude = $faker->numberBetween($min_altitude, 8848);
    }

    return [
        'name' => filter_var($faker->name, FILTER_SANITIZE_STRING),
        'max_altitude' => $max_altitude,
        'min_altitude' => $min_altitude,
        'orientation' => $faker->numberBetween(0, 360),
        'type_id' => $faker->numberBetween(0, 7), // hand counted number of types from frontend config
        'parent_id' => $parent_id
    ];
});

$factory->define(App\Models\Route::class, function (Faker $faker) {
    $area = Area::inRandomOrder()->first();

    $type_id = $faker->numberBetween(0, 3); // hand counted number of types from frontend config

    if ($type_id === 1) {
        $length = $faker->numberBetween(5, 40);
        // has to be here, lame
        $grade = $faker->shortGrade;
    } else {
        $length = $faker->numberBetween(40, 2000);
        // has to be here, lame
        $grade = $faker->longGrade;
    }

    $grades = $faker->grades;

    return [
        'name' => filter_var($faker->name, FILTER_SANITIZE_STRING),
        'length' => $length,
        'area_id' => $area->id,
        'type_id' => $type_id,
        'grades' => $grades
    ];
});

function saveRandomImage(string $absolutePath, int $width = 640, int $height = 480): bool
{
    // Create a blank image:
    $im = imagecreatetruecolor($width, $height);
    // Add light background color:
    $bgColor = imagecolorallocate($im, rand(100, 255), rand(100, 255), rand(100, 255));
    imagefill($im, 0, 0, $bgColor);

    // Save the image:
    $isGenerated = imagejpeg($im, $absolutePath);

    // Free up memory:
    imagedestroy($im);

    return $isGenerated;
}

$factory->define(App\Models\Image::class, function (Faker $faker) {
    $dir = storage_path('app/images').'/'.$faker->numberBetween(0, 9);
    $width = $faker->numberBetween(640, 1980);
    $name = md5(filter_var($faker->name, FILTER_SANITIZE_STRING));
    $filePath = $dir.'/'.$name.'.jpeg';
    $height = $faker->numberBetween(480, 1250);
    saveRandomImage($filePath, $width, $height);
    $filePath = str_replace(storage_path('app/images'), '', $filePath);
    return [
        'file_path' => $filePath,
        'size' => [$width, $height]
    ];
});

$factory->define(App\Models\Pitch::class, function (Faker $faker) {

    // has to be here, lame
    $grade = $faker->shortGrade;
    
    return [
        'length' => $faker->numberBetween(10, 50),
        'grades' => $faker->grades
    ];
});

$factory->define(App\Models\Grade::class, function (Faker $faker) { 

    return [
        'type_id' => $faker->numberBetween(0, 10), // hand counted number of types from frontend config
        'weight' => $faker->numberBetween(1, 50)
    ];
});

$factory->define(App\Models\Trail::class, function (Faker $faker) {

    $area = Area::inRandomOrder()->first();

    return [
        'name' => $faker->name,
        'area_id' => $area->id
    ];
});

$factory->define(App\User::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'email' => $faker->email,
        'role_id' => App\User::USER
    ];
});
