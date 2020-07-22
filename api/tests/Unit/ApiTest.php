<?php

namespace Tests\Unit;

use App\Models\Area;
use App\Models\Route;
use Tests\TestCase;

class ApiTest extends TestCase
{
    public function setUp()
    {
        parent::setUp();

        \DB::listen(function ($query) {
            dump(
                implode("\n", [$query->sql, json_encode($query->bindings), $query->time])
            );
        });
    }

    public function testMapLayers()
    {
        $this->post('/api/layers/map')->dump();
    }

    public function testGetRoutesWithLength()
    {
        $filters = [
            "length" => ["485", "1308"]
        ];
        $uri = 'api/route?'.http_build_query($filters);
        
        dump($filters);
        dump($uri);

        $this->get($uri);
    }

    public function testGetRoutesWithGradeTypes()
    {
        $filters = [
            "gradeTypes" => ["1", "3"]
        ];
        $uri = 'api/route?'.http_build_query($filters);
        
        dump($filters);
        dump($uri);

        $this->get($uri);
    }

    public function testGetRoutesWithGradeWeights()
    {
        $filters = [
            'gradeWeights' => '{"0":[5,14],"5":[5,15],"9":[0,10],"10":[0,30]}'
        ];
        $uri = 'api/route?'.http_build_query($filters);
        
        dump($filters);
        dump($uri);

        $this->get($uri);
    }

    public function testGetRoutesWithFullFilter()
    {
        $filters = [
            'gradeWeights' => '{"0":[5,14],"5":[5,15],"9":[0,10],"10":[0,30]}',
            "gradeTypes" => ["1", "3"],
            "length" => ["485", "1308"]
        ];
        $uri = 'api/route?'.http_build_query($filters);
        
        dump($filters);
        dump($uri);

        $this->get($uri);
    }
}
