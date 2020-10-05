<?php

namespace App\Models\Filters;

trait QueryFilter
{
  public function filterQuery($query, $term)
  {

    if($term == '') return $query;

    $term = str_replace(' ', ' & ', trim($term));
    $term .= ':*';
    return $query
      ->whereRaw('ts_vector @@ to_tsquery(?)', [$term])
      ->orderByRaw('ts_rank(ts_vector, to_tsquery(?)) DESC', [$term]);
  }
}