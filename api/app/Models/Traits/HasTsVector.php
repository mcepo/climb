<?php

namespace App\Models\Traits;

trait HasTsVector
{
  public function updateTsVector() {
      $tsVectorString = str_replace(" ", " || ", $this->name);
      $this->ts_vector = \DB::raw('to_tsvector(\'simple\',\''.$tsVectorString.'\')');
  }
}
