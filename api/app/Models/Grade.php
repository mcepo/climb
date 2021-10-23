<?php

namespace App\Models;

use App\Models\Traits\IsDescendent;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{

    use IsDescendent;

    protected $guarded = [];

    public function route()
    {
        return $this->belongsTo(Route::class);
    }

    public function toArray()
    {
        return [$this->type_id, $this->weight];
    }
}
