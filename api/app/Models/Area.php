<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\Taggable;
use App\Models\Traits\Linkable;
use App\Models\Traits\Filterable;
use App\Models\Traits\HasImages;
use App\Models\Filters\QueryFilter;
use App\Models\Filters\AreaFilters;
use App\Models\Traits\HasAncestors;
use App\Models\Traits\HasOwner;
use App\Models\Traits\IsDescendent;
use Spatie\Activitylog\Traits\LogsActivity;

use App\User;

class Area extends Model
{
    use Taggable,
        Linkable,
        Filterable,
        HasImages,
        QueryFilter,
        AreaFilters,
        HasAncestors,
        IsDescendent,
        HasOwner,
        LogsActivity;

    protected $casts = [
        'path' => 'text'
    ];

    protected static $logAttributes = ['*'];

    protected $guarded = [
        'id',
    ];

    protected $attributes = [
        'parent_id' => null,
        'path' => null,
    ];

    protected $hidden = [
        'min_altitude',
        'max_altitude'
    ];

    protected $appends = [
        'altitude'
    ];

    public function moderators()
    {
        return $this->belongsToMany(User::class);
    }

    public function areas()
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function setAltitudeAttribute($value)
    {
        $this->attributes['min_altitude'] = $value[0];
        $this->attributes['max_altitude'] = $value[1];
    }

    public function getAltitudeAttribute()
    {

        $altitude = [];
        $altitude[0] = isset($this->min_altitude) ? $this->min_altitude : null;
        $altitude[1] = isset($this->max_altitude) ? $this->max_altitude : null;
        return $altitude;
    }

    public function routes()
    {
        return $this->hasMany(Route::class);
    }

    public function trails()
    {
        return $this->hasMany(Trail::class);
    }

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function getPathWithSelf()
    {
        return $this->path ? implode('.', [$this->path, $this->id]): $this->id;
    }

    // setting statistics of the grades and route length in this area
    public function setStatistics()
    {
        $path = $this->getPathWithSelf();

        $this->setAttribute('statistics', Grade::statistics($path));
        $this->setAttribute('lengthStatistics', Route::lengthStatistics($path));
    }

    public static function scopeRoots($query)
    {
        return $query->whereNull('parent_id');
    }

    public function loadAreaAssets($filters)
    {

        $filters['path'] = $this->getPathWithSelf();

        $this->setAttribute('routes', Route::loadChunk($filters));

        $this->loadImages();

        $this->load(['areas.mapTag', 'trails.mapTag']);
    }

    public function loadImages()
    {
        // getting images of this area
        $this->load(['images.mapTag', 'images.captured']);

        // loading all image tags of this area with the image they are tagged on
        $this->load(['imageTags.image.mapTag', 'imageTags.image.captured']);

        $this->setAttribute('images', $this->imageTags
            ->pluck('image') // getting images from image tag collection
            ->merge($this->images) // merging images with area image
            ->unique('id')); // removing duplicate images
    }

    public function toArray()
    {
        $area = parent::toArray();

        unset($area['image_tags']);
        
        return $area;
    }

    public function canBeDeleted() {
        return Route::where('area_id', $this->id)->count() == 0
            && Trail::where('area_id', $this->id)->count() == 0
            && Area::where('parent_id', $this->id)->count() == 0
            && Image::where(['captured_type' => 'area', 'captured_id' => $this->id])->count() == 0
            && Tag::where(['tagged_type' => 'area', 'tagged_id' => $this->id])->count() == 0;
    }
}
