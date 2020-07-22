<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\Taggable;
use App\Models\Traits\IsDescendent;
use App\Models\Traits\HasOwner;
use Spatie\Activitylog\Traits\LogsActivity;

class Trail extends Model
{
    use Taggable,
        IsDescendent,
        HasOwner,
        LogsActivity;

    protected static $logAttributes = ['*'];

    protected $fillable = [
        'name'
    ];
}
