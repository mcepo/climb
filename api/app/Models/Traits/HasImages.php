<?php

namespace App\Models\Traits;

use App\Models\Image;
use Intervention\Image\Facades\Image as InterventionImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

trait HasImages
{
    public function images()
    {
        return $this->morphMany(Image::class, 'captured');
    }

    public function addImage(Request $request)
    {
        $randomFolder = rand(0, config('filesystems.disks.images.number_of_folders') - 1);

        $file = $request->file('image');

        $path = $file->hashName($randomFolder);

        $image = InterventionImage::make($file);

        // so that mobile images are displayed correctly
        $image->orientate();

        Storage::put('images/'.$path, (string) $image->encode());

        $size = [$image->width(), $image->height()];

        $image = $this->images()
            ->create([
                'file_path' => $path,
                'size' => $size
            ]);

        return $image;
    }
}
