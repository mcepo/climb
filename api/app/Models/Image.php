<?php

namespace App\Models;

use App\Models\Traits\Taggable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use App\Models\Traits\IsDescendent;
use App\Models\Traits\HasOwner;
use Spatie\Activitylog\Traits\LogsActivity;


class Image extends Model
{

    use Taggable,
        IsDescendent,
        HasOwner,
        LogsActivity;

    protected $guarded = [];

    protected static $logAttributes = ['*'];

    protected $casts = [
        'size' => 'array',
        'boundary' => 'array',
    ];

    protected $hidden = [
        'file_path',
        'created_at',
        'updated_at'
    ];

    // whose image is this
    public function captured()
    {
        return $this->morphTo();
    }

    public function getContent()
    {
        return Storage::disk('images')->get($this->file_path);
    }

    public function tags()
    {
        return $this->hasMany(Tag::class);
    }

    // method that eagerly loads routes for the tagged pitches
    // and sets it in a attribute routes

    public function loadPitchRoutes()
    {

        $tagged = $this->tags
            ->pluck('tagged')
            ->groupBy(function ($model) {
                return get_class($model);
            });

        if (isset($tagged[Pitch::class])) {
            $routeIds = $tagged[Pitch::class]->pluck('route_id')->unique();
            $this->setAttribute('routes', Route::findMany($routeIds));
        } else {
            $this->setAttribute('routes', []);
        }
    }

    public function canBeDeleted()
    {

        // image can only be deleted if it doesn't have any tags on it
        // and isn't tagged anywhere
        // admin overrides this restriction
        return $this->tags->count() == 0 
            && $this->mapTag == null
            && $this->imageTags->count() == 0;
    }
}
