<?php

namespace App\Models\Filters;

use function GuzzleHttp\json_decode;

// query
// path
// length
// grades
// type


trait RouteFilters
{
    public function filterGradeWeights($query, $grades)
    {
        // TODO: refactore this into multiple functions so its more readable
        $grades = json_decode($grades, true);
        return $query->whereDoesntHave(
            'grades',
            function ($query) use ($grades) {
                return $query->where(
                    function ($query) use ($grades) {
                        foreach ($grades as $type_id => $grade) {
                            $query = $query->orWhere(
                                function ($query) use ($type_id, $grade) {
                                    return $query->where('type_id', $type_id)
                                        ->where(
                                            function ($query) use ($grade) {
                                                return $query->orWhere('weight', '<', $grade[0])
                                                    ->orWhere('weight', '>', $grade[1]);
                                            }
                                        );
                                }
                            );
                        }
                        return $query;
                    }
                );
            }
        );
    }

    public function filterGradeTypes($query, $grades)
    {
        return $query->whereDoesntHave(
            'grades',
            function ($query) use ($grades) {
                return $query->where(
                    function ($query) use ($grades) {
                        foreach ($grades as $grade) {
                            $query = $query->orWhere('type_id', '=', $grade);
                        }
                        return $query;
                    }
                );
            }
        );
    }

    public function filterPath($query, $path)
    {
        return $query->descendents($path);
    }

    public function filterOrientation($query, $orientations)
    {
        return $query->where(
            function ($query) use ($orientations) {
                foreach ($orientations as $orientation) {
                    $query = $query->orWhere('orientation', '=', $orientation);
                }
                return $query;
            }
        );
    }

    // i am always getting routes in chunks
    // this will make sure i get the next chunk
    public function filterOffset($query, $offset)
    {
        return $query->offset($offset);
    }

    public function filterLength($query, $range)
    {
        return $query->where('length', '>', $range[0])
            ->where('length', '<', $range[1]);
    }

    public function filterType($query, $types)
    {
        return $query->where(
            function ($query) use ($types) {
                foreach ($types as $type_id) {
                    $query = $query->orWhere('type_id', $type_id);
                }

                return $query;
            }
        );
    }
}
