<?php

namespace App\Models\Traits;

use Illuminate\Support\Facades\DB;

trait HasOrder
{
    public static function updateOrder($parent_id, $order, $increment = true)
    {
        self::whereParent($parent_id)
            ->where('order', '>=', $order)
            ->update(['order', DB::raw('"order" = "order" '.($increment ? '+' : '-').' 1')]);
    }
}
