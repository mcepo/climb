<?php

namespace App\Models;

use App\Models\Traits\IsDescendent;
use Illuminate\Database\Eloquent\Model;

class PitchGrade extends Model
{

    use IsDescendent;

    protected $guarded = [];

    public function toArray()
    {
        return [$this->type_id, $this->weight];
    }

    public function pitch()
    {
        return $this->belongsTo(Pitch::class);
    }
}
