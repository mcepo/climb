<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\Taggable;
use App\Models\Traits\HasGrades;
use App\Models\Traits\IsDescendent;
use App\Models\Traits\HasOwner;
use Spatie\Activitylog\Traits\LogsActivity;

class Pitch extends Model
{
    use Taggable,
        HasGrades,
        IsDescendent,
        HasOwner,
        LogsActivity;

    protected static $logAttributes = ['*'];

    protected $fillable = [
        'route_id',
        'length'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];
    
    protected $with = ['grades'];

    public function route()
    {
        return $this->belongsTo(Route::class);
    }

    public function grades()
    {
        return $this->hasMany(PitchGrade::class)->orderBy('type_id', 'asc');
    }

    // this is used only when updating pitch ordering
    public static function scopeWhereParent($query, $route_id)
    {
        return $query->where('route_id', $route_id);
    }
}
