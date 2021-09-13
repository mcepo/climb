<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\Taggable;
use App\Models\Traits\IsDescendent;
use App\Models\Traits\HasOwner;

class Trail extends Model
{
    use Taggable,
        IsDescendent,
        HasOwner;

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    public function scopeAncestorAreas($query, $path)
    {
        $areaIds = explode('.', $path);
        return $query->whereIn('area_id', $areaIds);
    }
}
