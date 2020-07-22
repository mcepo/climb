<?php

return [

    // so far these are only required for the crawler
    'areas' =>
    [
        0 => 'country',
        1 => 'area',
        2 => 'mountain',
        3 => 'peak',
        4 => 'mountain_side',
        5 => 'climbing_site',
        6 => 'crag',
        7 => 'sector',
    ],
    'routes' =>
    [
        0 => 'multipitch',
        1 => 'singlepitch',
        2 => 'waterfall',
        3 => 'boulder',
    ],

    'grades' => [
        'fr' => ['-','1', '1', '1', '2', '2', '3', '3', '4a', '4a/a+', '4a+', '4a+/b', '4b', '4b/b+', '4b+', '4b+/c', '4c', '4c/c+', '4c+', '4c+/5a', '5a', '5a/a+', '5a+', '5a+/b', '5b', '5b/b+', '5b+', '5b+/c', '5c', '5c/c+', '5c+', '5c+/6a', '6a', '6a/a+', '6a+', '6a+/b', '6b', '6b/b+', '6b+', '6b+/c', '6c', '6c/c+', '6c+', '6c+/7a', '7a', '7a/a+', '7a+', '7a+/b', '7b', '7b/b+', '7b+', '7b+/c', '7c', '7c/c+', '7c+', '7c+/8a', '8a', '8a/a+', '8a+', '8a+/b', '8b', '8b/b+', '8b+', '8b+/c', '8c', '8c/c+', '8c+', '8c+/9a', '9a', '9a/a+', '9a+', '9a+/b', '9b'],
        'uiaa' => ['-','I', 'I-II', 'II', 'II-III', 'III', 'III-IV', 'IV-', 'IV', 'IV+', 'IV+', 'IV-V', 'IV-V', 'V-', 'V-', 'V', 'V', 'V', 'V+', 'V+', 'V+', 'V-VI', 'VI-', 'VI-', 'VI-', 'VI', 'VI', 'VI', 'VI', 'VI+', 'VI+', 'VI+', 'VI-VII', 'VII-', 'VII-', 'VII-', 'VII', 'VII', 'VII+', 'VII+', 'VII-VIII', 'VIII-', 'VIII-', 'VIII', 'VIII', 'VIII', 'VIII+', 'VIII+', 'VIII-IX', 'IX-', 'IX-', 'IX--IX', 'IX', 'IX', 'IX+', 'IX+', 'IX-X', 'X-', 'X-', 'X--X', 'X', 'X', 'X-X+', 'X+', 'X-XI', 'XI-', 'XI--XI', 'XI', 'XI-XI+', 'XI+', 'XI+', 'XI-XII', 'XII-'],
        'ydr' => ['-','5.1', '5.1', '5.2', '5.3', '5.3', '5.4', '5.4', '5.5', '5.5', '5.6', '5.6', '5.6', '5.6', '5.6', '5.7', '5.7', '5.7', '5.7', '5.8', '5.8', '5.8', '5.8', '5.9', '5.9', '5.9', '5.10a', '5.10a', '5.10a', '5.10a', '5.10b', '5.10b', '5.10b', '5.10b', '5.10c', '5.10c', '5.10d', '5.10d', '5.11a', '5.11a', '5.11b', '5.11c', '5.11c', '5.11d', '5.11d', '5.12a', '5.12a', '5.12b', '5.12b', '5.12c', '5.12c', '5.12d', '5.12d', '5.13a', '5.13a', '5.13b', '5.13b', '5.13c', '5.13c', '5.13d', '5.13d', '5.14a', '5.14a', '5.14b', '5.14b', '5.14c', '5.14c', '5.14d', '5.14d', '5.15a', '5.15a', '5.15b', '5.15b'],
        'tehnical' => ['-','A0', 'A1', 'A2', 'A3', 'A4', 'A5'],
        'incline' => ['-','10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60', '65', '70', '75', '80', '85', '90'],
        'ice' => ['-','WI1', 'WI2', 'WI3', 'WI3+', 'WI4-', 'WI4', 'WI4+', 'WI5-', 'WI5', 'WI5+', 'WI6-', 'WI6', 'WI6+', 'WI7-', 'WI7', 'WI7+', 'WI8-', 'WI8', 'WI8+'],
        'alpine' => ['-','AI1', 'AI2', 'AI3', 'AI3+', 'AI4-', 'AI4', 'AI4+', 'AI5-', 'AI5', 'AI5+', 'AI6-', 'AI6', 'AI6+', 'AI7-', 'AI7', 'AI7+', 'AI8-', 'AI8', 'AI8+'],
        'mix' => ['-','M1', 'M2', 'M3', 'M4', 'M5-', 'M5', 'M5+', 'M6-', 'M6', 'M6+', 'M7-', 'M7', 'M7+', 'M8-', 'M8', 'M8+', 'M9-', 'M9', 'M9+', 'M10-', 'M10', 'M10+', 'M11-', 'M11', 'M11+', 'M12-', 'M12', 'M12+', 'M13-', 'M13', 'M13+'],
        'fr_combined' => ['-','F-', 'F-', 'F', 'F+', 'PD-', 'PD', 'PD+', 'AD-', 'AD', 'AD+', 'D-', 'D', 'D+', 'TD-', 'TD', 'TD+', 'ED-', 'ED', 'ED+', 'ABO-', 'ABO', 'ABO+'],
    ],
    'climbing' => [
        'combined' => ['fr_combined', 'uiaa'],
        'mix' => ['mix'],
        'alpine' => ['alpine'],
        'tehnical' => ['tehnical'],
        'required' => ['fr', 'uiaa', 'ydr'],
        'ice' => ['ice'],
        'incline' => ['incline'],
        'avg_incline' => ['incline'],
        'rng_from_incline' => ['incline'],
        'rng_to_incline' => ['incline'],
        'max' => ['fr', 'uiaa', 'ydr'],
        'avg' => ['fr', 'uiaa', 'ydr'],
    ],
];
