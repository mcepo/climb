<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Faker\Providers\Geojson;

class GeoJsonTest extends TestCase
{
    private $_config;
    private $_service;

    protected function setUp()
    {
        $generator  = \Faker\Factory::create();
        $this->_service = new Geojson($generator);
    }
    public function testFeatureCollection()
    {
        $this->_config = [
            'bounds' => [[0,0],[50,50]],
            'allowedTypes' => [
                'Point',
                'LineString',
                'Polygon'
                ]
        ];

        $collection = $this->_service->featureCollection($this->_config);

        $this->_validateCollection($collection);
    }

    public function testFeaturePoint()
    {
        $this->_config = [
            'bounds' => [[-10,-10],[10,10]],
            'allowedTypes' => [
                'Point'
                ]
        ];

        $feature = $this->_service->feature($this->_config);

        $this->_validateFeature($feature);
    }

    public function testFeatureLineStringLat()
    {
        $this->_config = [
            'bounds' => [[-10,-10],[10,10]],
            'allowedTypes' => [
                'LineString'
            ],
            'moveBound' => 'latitude'
        ];

        $feature = $this->_service->feature($this->_config);

        $this->_validateFeature($feature);
    }

    public function testFeatureLineStringLong()
    {
        $this->_config = [
            'bounds' => [[0,0],[20,10]],
            'allowedTypes' => [
                'LineString'
            ],
            'moveBound' => 'longitude'
        ];

        $feature = $this->_service->feature($this->_config);

        $this->_validateFeature($feature);
    }

    public function testFeaturePolygon()
    {
        $this->_config = [
            'bounds' => [[-10,-10],[10,10]],
            'allowedTypes' => [
                'Polygon'
                ]
        ];

        $feature = $this->_service->feature($this->_config);

        $this->_validateFeature($feature);
    }

    private function _validateCollection($collection)
    {
        $this->assertArrayHasKey('type', $collection);

        $this->assertEquals($collection['type'], 'FeatureCollection');

        $this->assertArrayHasKey('features', $collection);

        foreach ($collection['features'] as $feature) {
            $this->_validateFeature($feature);
        }
    }

    private function _validateFeature($feature)
    {
        $this->assertArrayHasKey('type', $feature);

        $this->assertEquals($feature['type'], 'Feature');

        $this->assertArrayHasKey('geometry', $feature);

        $this->_validateGeometry($feature['geometry']);
    }

    private function _validateGeometry($geometry)
    {
        $this->assertArrayHasKey('type', $geometry);

        $this->assertArrayHasKey('coordinates', $geometry);


        $this->assertContains($geometry['type'], $this->_config['allowedTypes']);

        $method = '_validate'.$geometry['type'];

        $this->$method($geometry['coordinates']);
    }

    private function _validatePolygon($polygonArray)
    {
        $polygon = $polygonArray[0];

        $this->_validateLineString($polygon);

        $firstCoordinate = $polygon[0];
        
        $lastCoordinate = end($polygon);

        $this->assertEquals($firstCoordinate[0], $lastCoordinate[0]);

        $this->assertEquals($firstCoordinate[1], $lastCoordinate[1]);
    }

    private function _validateLineString($lineString)
    {
        foreach ($lineString as $coordinate) {
            $this->_validatePoint($coordinate);
            if (isset($this->_config['moveBound'])
            && $this->_config['moveBound'] == 'longitude') {
                $this->_config['bounds'][0][0] = $coordinate[0];
            } else {
                $this->_config['bounds'][0][1] = $coordinate[1];
            }
        }
    }

    private function _validatePoint($coordinate)
    {
        $this->assertLessThanOrEqual($this->_config['bounds'][1][1], $coordinate[1]);

        $this->assertLessThanOrEqual($this->_config['bounds'][1][0], $coordinate[0]);

        $this->assertGreaterThanOrEqual($this->_config['bounds'][0][1], $coordinate[1]);

        $this->assertGreaterThanOrEqual($this->_config['bounds'][0][0], $coordinate[0]);
    }
}
