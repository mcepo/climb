<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\IsTagged;
use App\Models\Traits\IsDescendent;
use App\Models\Traits\HasOwner;
use Spatie\Activitylog\Traits\LogsActivity;

class Tag extends Model
{
    use IsTagged,
        IsDescendent,
        HasOwner,
        LogsActivity;

    protected static $logAttributes = ['*'];

    // need image_id as well because of admin panel tag view
    protected $hidden = [
        'binary_coordinates'
    ];

    protected $casts = [
        'geometry' => 'array'
    ];

    protected $fillable = [
        'geometry',
        'image_id',
        'tagged_type',
        'tagged_id'
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
            'binary_coordinates' => \DB::raw('ST_GeomFromGeoJSON(geometry::text)')
        ]
    );
}
}