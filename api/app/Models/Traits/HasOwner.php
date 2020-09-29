<?php

namespace App\Models\Traits;

use App\User;

trait HasOwner
{

  public function owner()
  {
    return $this->belongsTo(User::class, 'owner_id');
  }
}
