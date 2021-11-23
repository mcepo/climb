<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\IsTagged;
use App\Models\Traits\IsDescendent;
use App\Models\Traits\HasOwner;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Support\Facades\DB;

class Tag extends Model
{
    use IsTagged,
        IsDescendent,
        HasOwner,
        LogsActivity;

    protected static $logAttributes = [
        'id',
        'path',
        'owner_id',      
        'geometry',
        'image_id',
        'tagged_type',
        'tagged_id'
    ];

    protected static $ignoreChangedAttributes = ['binary_coordinates'];

    // need image_id as well because of admin panel tag view
    protected $hidden = [
        'binary_coordinates',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'geometry' => 'array'
    ];

    protected $fillable = [
        'geometry',
        'image_id',
        'tagged_type',
        'tagged_id',
        'accuracy'
    ];

    public function image()
    {
        return $this->belongsTo(Image::class);
    }

    public function setBinaryCoordinates()
    {
        self::where('id', $this->id)
        ->update(
            [
            'binary_coordinates' => DB::raw('ST_GeomFromGeoJSON(geometry::text)')
            ]
        );
    }
}