<?php

namespace App\Models\Traits;

trait HasGrades
{

    public function saveGrades($grades)
    {
        if(!$grades) { return;
        }

        $this->grades()->delete();

        foreach ($grades as $grade) {
            $this->grades()->create(
                [
                'type_id' => $grade[0],
                'weight' => $grade[1],
                'path' => $this->path,
                ]
            );
        }
    }
}
