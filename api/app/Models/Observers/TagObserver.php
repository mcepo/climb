<?php

namespace App\Models\Observers;

use App\Models\Tag;

class TagObserver
{

    public function saving(Tag $tag)
    {
        $tag->owner_id = auth()->user()->id;

        if ($tag->tagged_type == 'area') {
            $tag->path = $tag->tagged->getPathWithSelf();
        } else {
            $tag->path = $tag->tagged->path;
        }
    }

    public function saved(Tag $tag)
    {
        // once the geometry is stored into the database
        // we can generate the binary for that geometry
        $tag->setBinaryCoordinates();
    }
}
