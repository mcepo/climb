<?php

namespace App\Models\Filters;

trait QueryFilter
{

    private function _sanitize($term) 
    {
        return preg_replace("/(\\,|\\.|\'|\")+/", "", trim($term));
    }

    public function filterQuery($query, $term)
    {

        $sanitizedTerm = $this->_sanitize($term);

        if($sanitizedTerm == '') { return $query;
        }

        $variableWordEnd = preg_replace('/\s+/', ':* ', $sanitizedTerm). ":*";
        $looseSearch = preg_replace('/\s/', ' | ', trim($variableWordEnd));
        $query
            ->whereRaw("ts_vector @@ to_tsquery('simple', '".$looseSearch."')")
            ->orderByRaw("ts_rank_cd(ts_vector, to_tsquery('".$looseSearch."')) desc");

        return $query;
    }
}