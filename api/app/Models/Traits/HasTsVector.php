<?php

namespace App\Models\Traits;

trait HasTsVector
{
    public function updateTsVector()
    {
        $singleQuotaEscaped = str_replace("'", "''", $this->name);
        $tsVectorString = str_replace(" ", " || ", $singleQuotaEscaped);
        $this->ts_vector = \DB::raw('to_tsvector(\'simple\',\''.$tsVectorString.'\')');
    }
}
