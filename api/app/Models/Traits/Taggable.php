<?php

namespace App\Models\Traits;

use App\Models\Tag;

trait Taggable
{

    // these are all the tags that an item has on all of the images
    public function imageTags()
    {
        return $this->morphMany(Tag::class, 'tagged')->whereNotNull('image_id');
    }

    // item tag on the map
    public function mapTag()
    {
        return $this->morphOne(Tag::class, 'tagged')->whereNull('image_id');
    }
}
