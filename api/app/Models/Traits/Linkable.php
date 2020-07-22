<?php

namespace App\Models\Traits;

use App\Models\Link;

trait Linkable
{
    public function links()
    {
        return $this->morphMany(Link::class, 'linked');
    }
}
