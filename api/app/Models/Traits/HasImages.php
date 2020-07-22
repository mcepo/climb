<?php

namespace App\Models\Traits;

use App\Models\Image;
use Illuminate\Http\Request;

trait HasImages
{
    public function images()
    {
        return $this->morphMany(Image::class, 'captured');
    }

    public function addImage(Request $request)
    {
        $randomFolder = rand(0, config('filesystems.disks.images.number_of_folders') - 1);

        $filePath = $request->file('image')
            ->store($randomFolder, 'images');

            $size = getimagesize($request->file('image'));

        $image = $this->images()
            ->create([
                'file_path' => $filePath,
                'size' => [$size[0], $size[1]]
            ]);

        return $image;
    }
}
