<?php

namespace App\Faker\Providers;

use Faker\Provider\Base;

class ClimbingGrades extends Base
{
    private $_grades; // array grade_type => grade_weight
    private $_grade; // grade string
    private $_gradeChart; // grade chart used
    private $_gradeModel;

    public function __construct($faker, $gradeModel)
    {
        $this->_gradeChart = config('types.grades');
        $this->_gradeModel = $gradeModel;

        parent::__construct($faker);
    }

    public function shortGrade($gradeType = 'fr')
    {
        $this->_grade = '';
        $this->_grades = [];

        $this->_grades['max'] = $this->generator->numberBetween(1, count($this->_gradeChart[$gradeType]) - 1);
        $this->_combineGrade($gradeType);

        $this->_switchToIndex();

        return $this->_grade;
    }

    public function longGrade($gradeType = 'uiaa', $excludeGrades = [])
    {
        $this->_grade = '';
        $this->_grades = [];

        $climbingTypes = config('types.climbing');

        foreach ($climbingTypes as $type => $arrayGradeTypes) {
            if (in_array($type, $excludeGrades) || $this->generator->boolean === false) {
                continue;
            }

            $this->_grades[$type] = $this->generator->numberBetween(1, count($this->_gradeChart[$climbingTypes[$type][0]]) - 1);
        }

        if (isset($this->_grades['avg_incline'])) {
            $this->_grades['incline'] = $this->generator->numberBetween($this->_grades['avg_incline'], count($this->_gradeChart['incline']) - 1);
        }

        if (isset($this->_grades['rng_from_incline']) || isset($this->_grades['rng_to_incline'])) {
            $this->_grades['rng_from_incline'] = $this->generator->numberBetween(1, count($this->_gradeChart['incline']) - 1);
            $this->_grades['rng_to_incline'] = $this->generator->numberBetween(1, count($this->_gradeChart['incline']) - 1);
        }

        // max grade will always be generated
        $this->_grades['max'] = $this->generator->numberBetween(1, count($this->_gradeChart[$gradeType]) - 1);

        $this->_combineGrade($gradeType);

        $this->_switchToIndex();

        return $this->_grade;
    }

    public function grades()
    {
        if (isset($this->_grades)) {
            return $this->_grades;
        }

        return null;
    }

    private function _combineGrade($type)
    {
        $this->_combineTehnical($type);

        $this->_combineMax($type);

        $this->_combineAvg($type);

        $this->_combineMixAndCombined();

        $this->_combineAlpine();

        $this->_combineIce();

        $this->_combineIncline();
    }

    private function _combineTehnical($type)
    {
        if (isset($this->_grades['tehnical']) && isset($this->_grades['required'])) {
            $this->_grade = $this->_gradeChart[$type][$this->_grades['required']] . ',' . $this->_gradeChart['tehnical'][$this->_grades['tehnical']];
        } elseif (isset($this->_grades['tehnical'])) {
            $this->_grade = $this->_gradeChart['tehnical'][$this->_grades['tehnical']];
        } elseif (isset($this->_grades['required'])) {
            $this->_grade = $this->_gradeChart[$type][$this->_grades['required']];
        }

        if ($this->_grade !== '') {
            $this->_grade = '(' . $this->_grade . ')';
        }
    }

    private function _combineMax($type)
    {
        if (isset($this->_grades['max'])) {
            $this->_grade = $this->_gradeChart[$type][$this->_grades['max']] . $this->_grade;
        }
    }

    private function _combineAvg($type)
    {
        if (isset($this->_grades['avg'])) {
            $this->_grade = $this->_grade . '/' . $this->_gradeChart[$type][$this->_grades['avg']];
        }
    }

    private function _combineMixAndCombined()
    {
        if (isset($this->_grades['mix']) && isset($this->_grades['combined'])) {
            $this->_grade =
                $this->_gradeChart['fr_combined'][$this->_grades['combined']]
                . ' ' .
                $this->_gradeChart['mix'][$this->_grades['mix']]
                . ',' .
                $this->_grade;
        } elseif (isset($this->_grades['mix'])) {
            $this->_grade = $this->_grade . ',' . $this->_gradeChart['mix'][$this->_grades['mix']];
        } elseif (isset($this->_grades['combined'])) {
            $this->_grade = $this->_gradeChart['fr_combined'][$this->_grades['combined']]. ' ' . $this->_grade;
        }
    }

    private function _combineAlpine()
    {
        if (isset($this->_grades['alpine'])) {
            $this->_grade = $this->_grade . ',' . $this->_gradeChart['alpine'][$this->_grades['alpine']];
        }
    }

    private function _combineIce()
    {
        if (isset($this->_grades['ice'])) {
            $this->_grade = $this->_grade . ',' . $this->_gradeChart['ice'][$this->_grades['ice']];
        }
    }

    // TODO: incline nije riješen za prosječan i raspon
    private function _combineIncline()
    {
        if (isset($this->_grades['incline'])) {
            $this->_grade = $this->_grade . ',' . $this->_gradeChart['incline'][$this->_grades['incline']]. '°';

            if (isset($this->_grades['avg_incline']) && isset($this->_grades['rng_from_incline'])) {
                $this->_grade .=
                    '/' .
                    $this->_gradeChart['incline'][$this->_grades['avg_incline']]
                    . '°,' .
                    $this->_gradeChart['incline'][$this->_grades['rng_from_incline']]
                    . '°-' .
                    $this->_gradeChart['incline'][$this->_grades['rng_to_incline']] . '°';
            } elseif (isset($this->_grades['avg_incline'])) {
                $this->_grade .=
                    '/' .
                    $this->_gradeChart['incline'][$this->_grades['avg_incline']] . '°';
            } elseif (isset($this->_grades['rng_from_incline'])) {
                $this->_grade .=
                '/' .
                $this->_gradeChart['incline'][$this->_grades['rng_from_incline']]
                . '°-' .
                $this->_gradeChart['incline'][$this->_grades['rng_to_incline']] . '°';
            }
        }
    }

    private function _switchToIndex()
    {
        $climbingTypes = array_keys(config('types.climbing'));
        
        foreach ($this->_grades as $type => $grade) {

            $typeId =  array_search($type, $climbingTypes);

            $this->_grades[$typeId] = $grade;
            unset($this->_grades[$type]);
        }
    }
}
