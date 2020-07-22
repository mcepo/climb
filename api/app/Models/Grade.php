<?php

namespace App\Models;

use App\Models\Traits\IsDescendent;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Grade extends Model
{

    use IsDescendent;

    protected $guarded = [];

    public function route()
    {
        return $this->belongsTo(Route::class);
    }

    public function toArray() {
        return [$this->type_id, $this->weight];
    }

    public static function statistics($path)
    {
        return Grade::select(DB::raw('count(weight) as count, weight, type_id'))
            ->descendents($path)
            ->groupBy(['type_id', 'weight'])
            ->orderBy('type_id', 'asc')
            ->orderBy('weight', 'asc')
            ->get()
            ->groupBy('type_id')
            ->transform(
                function ($item) {
                    return $item->keyBy('weight')
                        ->transform(
                            function ($item) {
                                return $item['count'];
                            }
                        );
                }
            )
            ->toArray();
    }
}
