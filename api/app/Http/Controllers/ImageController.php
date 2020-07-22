<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\Tag;
use Intervention\Image\ImageManager;

class ImageController extends Controller
{

    public function show(Image $image)
    {
        $manager = new ImageManager();

        $image = $manager->make($image->getContent());

        return $image->response();
    }

    public function thumbnail(Image $image)
    {
        $manager = new ImageManager();

        $thumbnail = $manager->make($image->getContent())
            ->resize(300, null, function ($constraint) {
                $constraint->aspectRatio();
            });

        return $thumbnail->response();
    }

    public function destroy(Image $image)
    {

        $this->canUserModify($image);

        if($image->canBeDeleted()) {
        
            $image->delete();
        } else {
            return response()->json("Can't delete image while it is tagged or has tags!", 409);
        }
    }

    public function tags(Image $image) {

        $image->load(['captured', 'tags.tagged']);

        $image->loadPitchRoutes();

        return $image;
    }
}
