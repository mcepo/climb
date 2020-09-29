<?php

namespace App\Models\Traits;

trait Filterable
{
    public function scopeFilter($query, $attributes)
    {
        foreach ($attributes as $name => $params) {
            $methodName = 'filter' . ucwords($name);

            if (method_exists($this, $methodName)) {
                $query = $this->$methodName($query, $params);
            }
        }
        return $query;
    }
}
