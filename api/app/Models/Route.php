<?php

namespace App\Models;

use App\Models\Filters\QueryFilter;
use App\Models\Filters\RouteFilters;
use App\Models\Traits\Filterable;
use App\Models\Traits\Linkable;
use App\Models\Traits\Taggable;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasGrades;
use App\Models\Traits\HasTsVector;
use App\Models\Traits\IsDescendent;
use App\Models\Traits\HasAncestors;
use App\Models\Traits\HasOwner;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Support\Facades\DB;

class Route extends Model
{
    use Taggable,
    Linkable,
    Filterable,
    QueryFilter,
    RouteFilters,
    HasGrades,
    HasTsVector,
    HasAncestors,
    IsDescendent,
    HasOwner,
    LogsActivity;

    protected static $logAttributes = ['*'];

    protected $fillable = [
        'name',
        'length',
        'area_id',
        'type_id'
    ];

    protected $hidden = [
        'ts_vector',
    ];

    protected $with = ['grades'];

    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    public function pitches()
    {
        return $this->hasMany(Pitch::class)->orderBy('id');
    }

    public function grades()
    {
        return $this->hasMany(Grade::class)->orderBy('type_id', 'asc');
    }

    public function loadImages()
    {
        $pids = $this->pitches->pluck('id')->toArray();

        $routeId = $this->id;
        // get all images where route is tagged and where pitches 
        // of that route are tagged
        $images = Tag::where(function($query) use ($pids){
            // images with this route tags
            return $query->where('tagged_type', 'pitch')
                ->whereIn('tagged_id', $pids);
        })->orWhere(function($query) use ($routeId){
            // images with this route pitches tags
            return $query->where('tagged_type', 'route')
                ->where('tagged_id', $routeId);
        })->whereNotNull('image_id')
        ->with('image')
        ->get()
        // remove duplicate images
        ->unique('image_id')
        // get only images
        ->pluck('image');

        $this->setAttribute('images', $images);
    }

    public static function loadChunk($filters) {
        return self::filter($filters)->with(['mapTag', 'grades'])->limit(10)->get();
    }

    public static function lengthStatistics($path)
    {

        // some grade types are just rediculous to report
        // like required grade
        return Route::select(DB::raw('count(length) as count, length'))
            ->descendents($path)
            ->groupBy(['length'])
            ->orderBy('length', 'asc')
            ->whereNotNull('length')
            ->get()
            ->keyBy('length')
            ->transform(
                function ($item) {
                    return $item->count;
                }
            )
            ->toArray();
    }

    public function canBeDeleted() {
        return Tag::where(['tagged_type' => 'route', 'tagged_id' => $this->id])->count() == 0 && 
                Pitch::where(['route_id' => $this->id])->count() == 0 ;
    }
}
