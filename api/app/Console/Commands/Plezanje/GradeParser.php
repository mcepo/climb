<?php

namespace App\Console\Commands\Plezanje;


class GradeParser
{

    private $_gradeWeights;

    public $patterns = [
        'tehnical' => "#A\d#",
        'mix' => "#M\d\d?[\+-]?#",
        'alpine' => "#AI\d[\+-]?#",
        'ice' => "#WI\d[\+-]?#",
        'fr_combined' => "#[ABDEFOTP]{1,3}[\+-]?#",
        'ydr' => "#5\.\d{1,2}(a|b|c|d){0,1}#", // this has to be before fr grades because fr pattern matches ydr grades
        'incline' => "#\d\d#",
        'uiaa' => "#([IVX]{1,4}\+?\-{0,2})([IVX]{1,4}[\+-]?)?#",
        'fr' => "#\d[abc]?\+{0,1}(/\d?[abc]\+?)?#",
    ];

    public function parse($gradeRaw)
    {
        $grade = $gradeRaw;
        $pitches = [];

        // if the grade containes pitches grades
        if (preg_match('#\s+\(.+,.+\)$#', trim($gradeRaw), $pitcheGrades)) {
            $grade = preg_replace('#\s+\(.+,.+\)$#', '', trim($gradeRaw));
            $pitches = explode(',', preg_replace('#\s|\(|\)#', '', $pitcheGrades[0]));

            $this->_gradeWeights[$this->_getTypeId('avg')] = $this->_getAvgGrade($pitches);

            // this is just to check that all grades are valid
            foreach ($pitches as $pitch) {
                if ($this->_getWeight($pitch) === null) {
                    throw new \Exception($gradeRaw);
                };
            }
        }

        return [ $this->_parseGrade($grade), $pitches ];
    }

    private function _parseGrade($grade)
    {

        //'VI- M6-,VII(VIII-,A3)/X+,WI5-,AI5,90°/80°,70°-60°'
        // 'AD M5+,VI(IV+,A2),WI4,AI5-,90°/80°'
        // 'D M5+,4b+(A3,Obl: 4c+),WI4,AI5-,90°/70°-60°'
        // '4b+(A3,Obl: 4c+),M3,WI4,AI5-,90°'
        // '4b+'
        // 'VI+/V-VI'
        // 'VI+,A1/V-VI'

        $this->_gradeWeights = [];

        $climbingTypes = config('types.climbing');

        //'VI- M6-,VII(VIII-,A3)/X+,WI5-,AI5,90°/80°,70°-60°'

        // if has get mixed grade

        if (preg_match($this->patterns['mix'], $grade, $mixGrade)) {
            $this->_setGradeWeight('mix', $mixGrade[0]);
            $grade = preg_replace($this->patterns['mix'], '', $grade);
        }

        //'VI- ,VII(VIII-,A3)/X+,WI5-,AI5,90°/80°,70°-60°'

        // if has get alpine grade

        if (preg_match($this->patterns['alpine'], $grade, $alpineGrade)) {
            $this->_setGradeWeight('alpine', $alpineGrade[0]);
            $grade = preg_replace($this->patterns['alpine'], '', $grade);
        }

        //'VI- ,VII(VIII-,A3)/X+,WI5-,,90°/80°,70°-60°'

        // if has get ice grade

        if (preg_match($this->patterns['ice'], $grade, $iceGrade)) {
            $this->_setGradeWeight('ice', $iceGrade[0]);
            $grade = preg_replace($this->patterns['ice'], '', $grade);
        }

        //'VI- ,VII(VIII-,A3)/X+,,,90°/80°,70°-60°'

        // check for incline

        if (preg_match_all($this->patterns['incline'], $grade, $inclineGrade)) {
            $this->_setGradeWeight('incline', $inclineGrade[0][0]);

            switch (count($inclineGrade[0])) {
            case 4:
                $this->_setGradeWeight('avg_incline', $inclineGrade[0][1]);
                $this->_setGradeWeight('rng_to_incline', $inclineGrade[0][2]);
                $this->_setGradeWeight('rng_from_incline', $inclineGrade[0][3]);
                break;
            case 3:
                $this->_setGradeWeight('incline', $inclineGrade[0][1]);
                $this->_setGradeWeight('incline', $inclineGrade[0][2]);
                break;
            case 2:
                $this->_setGradeWeight('incline', $inclineGrade[0][1]);
                break;
            }
            $grade = preg_replace($this->patterns['incline'], '', $grade);
        }

        //'VI- ,VII(VIII-,A3)/X+,,,°/°,°-°'

        // check for tehnical grade

        if (preg_match($this->patterns['tehnical'], $grade, $tehnicalGrade)) {
            $this->_setGradeWeight('tehnical', $tehnicalGrade[0]);
            $grade = preg_replace($this->patterns['tehnical'], '', $grade);
        }

        //'VI- ,VII(VIII-,)/X+,,,°/°,°-°'

        // check for required grade

        $tmp = preg_split('#\(|\)#', $grade);

        if (count($tmp) === 3) {
            foreach ($climbingTypes['required'] as $gradeType) {
                if (preg_match($this->patterns[$gradeType], $tmp[1], $requiredGrade)) {
                    $this->_setGradeWeight('required', $requiredGrade[0]);
                    $grade = $tmp[0] . $tmp[2];
                    break;
                }
            }
        }

        //'VI- ,VII(,)/X+,,,°/°,°-°'

        // check for average grade

        $tmp = preg_split('#/#', $grade);

        if (count($tmp) > 1 && !isset($this->_gradeWeights[$this->_getTypeId('avg')])) {
            foreach ($climbingTypes['avg'] as $gradeType) {
                if (preg_match($this->patterns[$gradeType], $tmp[1], $avgGrade)) {
                    $this->_setGradeWeight('avg', $avgGrade[0]);
                    $grade = $tmp[0];
                    break;
                }
            }
        }

        //VI- ,VII(,)/,,,°/°,°-°

        // get max value and possibly combined if its is like uiaa

        foreach ($climbingTypes['max'] as $gradeType) {
            if (preg_match_all($this->patterns[$gradeType], $grade, $maxGrade)) {
                if (count($maxGrade[0]) === 2) {
                    $this->_setGradeWeight('combined', $maxGrade[0][0]);
                    $this->_setGradeWeight('max', $maxGrade[0][1]);
                    return $this->_gradeWeights;
                } else if (count($maxGrade[0]) === 1) {
                    $this->_setGradeWeight('max', $maxGrade[0][0]);
                }
                break;
            }
        }

        if (preg_match($this->patterns['fr_combined'], $grade, $combinedGrade)) {

            if ($grade !== 'P') {
                $this->_setGradeWeight('combined', $combinedGrade[0]);
                $grade = preg_replace($this->patterns['fr_combined'], '', $grade);
            }
        }

        return $this->_gradeWeights;
    }

    private function _setGradeWeight($type, $grade)
    {
        // gradeWeights is structured like this because frontend form is sending
        // grades back in this format
        array_push($this->_gradeWeights, [$this->_getTypeId($type), $this->_getWeight($grade)]);
    }

    private function _getTypeId($type)
    {
        return array_search($type, array_keys(config('types.climbing')));
    }

    private function _getAvgGrade(array $grades)
    {
        $weights = [];

        foreach ($grades as $grade) {
            $weights[] = $this->_getWeight($grade);
        }

        $weights = array_filter($weights);

        return intval(round(array_sum($weights) / count($weights)));
    }

    private function _getWeight($grade)
    {
        if (is_null($type = $this->_getType($grade))) {
            return null;
        }

        $weights = array_keys(config('types.grades')[$type], $grade);

        return end($weights);
    }

    private function _getType($grade)
    {
        foreach ($this->patterns as $type => $pattern) {
            if (preg_match($pattern, $grade)) {
                return $type;
            }
        }
        return null;
    }
}
