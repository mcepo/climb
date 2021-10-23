<?php

namespace App\Models\Observers;

use App\Models\Image;
use App\User;

use Illuminate\Support\Facades\Storage;

class ImageObserver
{

    public function saving(Image $image)
    {
        $user = auth()->user();

        if($user->role_id === User::ADMIN) {
            $image->reviewer_id = $user->id;
        }

        $image->owner_id = $user->id;
        // because for now i expect that images can be added
        // to routes as well, or even other images
        if ($image->captured_type == 'area') {
            $image->path = $image->captured->getPathWithSelf();
        } else {
            $image->path = $image->captured->path;
        }
    }

    public function deleted(Image $image)
    {
        Storage::disk('images')->delete($image->file_path);
    }

    public function deleting(Image $image)
    {

        // get all image tags and delete them by hand
        // this is done because of item tags
        // the item needs to be deleted as well
        $image->tags->each(
            function ($tag) {
                $tag->delete();
            }
        );

        $image->imageTags()->delete();
        $image->mapTag()->delete();
    }
}
