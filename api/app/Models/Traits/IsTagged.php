<?php

namespace App\Models\Traits;

trait IsTagged
{
    public function tagged()
    {
        return $this->morphTo();
    }
}
