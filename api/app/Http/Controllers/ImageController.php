<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Intervention\Image\ImageManager;

class ImageController extends Controller
{

    public function __construct()
    {
        // $this->middleware('auth', ['only' => ['destroy']]);
        $this->middleware('flush-cache', ['only' => ['destroy']]);
    }

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
            ->resize(
                300, null, function ($constraint) {
                    $constraint->aspectRatio();
                }
            );

        return $thumbnail->response();
    }

    public function destroy(Image $image)
    {

        $this->canUserModify($image);

        if($image->canBeDeleted()) {
        
            $image->delete();

            $this->updateAreaStats($image->path);

        } else {
            return response()->json("Can't delete image while it is tagged or has tags!", 408);
        }
    }

    public function tags(Image $image)
    {

        $image->load(['tags.tagged']);

        $image->loadPitchRoutes();

        return $image;
    }
}
