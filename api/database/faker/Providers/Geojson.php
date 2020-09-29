<?php

namespace App\Faker\Providers;

use Faker\Provider\Base;

class Geojson extends Base
{

    /**
     * @var array $_bounds represents a bounding box, all generated points will be inside this box
     * structure: [longitude_min, latitude_min], [longitude_max, latitude_max]
     * Default: from -179 to 179 for longitude and -89 to 89 for latitude
     */
    private $_bounds;

    /**
     * @var array $_allowedTypes array of allowed types for generated features
     * Default: all types can be used while faking geojson objects
     */
    private $_allowedTypes;

    /**
     * @var string $_moveBound  defines what bound will be moved when
     * genereting points in linestring so that there is no intersections
     * and we get a pathlike feature
     * Values: 'latitude' for moving latitude bound; 'longitude' for moving longitude bound
     * Default: null
     */
    private $_moveBound;

    public function __call($method, $arguments)
    {

        $this->_bounds = [[-179, -89], [179, 89]];
        $this->_allowedTypes = [
            'Point',
            'LineString',
            'Polygon',
            'MultiPoint'
        ];

        $this->_moveBound = null;

        if (method_exists($this, $method)) {
            $this->_registerConfig($arguments[0]);
            return $this->$method();
        }
    }

    private function _registerConfig($config = [])
    {
        foreach ($config as $key => $value) {
            $key = '_'.$key;
            if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }
    }

    private function featureCollection()
    {
        $numberOfFeatures = $this->numberBetween(0, 30);

        $features = [];

        for ($i = 0;$i < $numberOfFeatures; $i++) {
            array_push($features, $this->feature());
        }

        return [
            'type' => 'FeatureCollection',
            'features' => $features
        ];
    }

    private function feature()
    {
        return [
            'type' => 'Feature',
            'geometry' => $this->featureGeometry()
        ];
    }

    private function featureGeometry()
    {
        $type = $this->geometryType();
        return [
            'type' => $type,
            'coordinates' => $this->geometryCoordinates($type)
        ];
    }

    private function geometryType()
    {
        return $this->_allowedTypes[$this->generator->numberBetween(0, count($this->_allowedTypes) - 1)];
    }

    private function geometryCoordinates($type)
    {
        $method = lcfirst($type).'Coordinates';

        if (method_exists($this, $method)) {
            if ($method === 'pointCoordinates'){
                return $this->$method($this->_bounds);
            } else{
                return $this->$method();
            }
        }
    }

    private function pointCoordinates($bounds)
    {
        return  [
            $this->generator->randomFloat(null, $bounds[0][0], $bounds[1][0]),
            $this->generator->randomFloat(null, $bounds[0][1], $bounds[1][1])
        ];
    }

    private function multiPointCoordinates()
    {
        $numberOfPoints = $this->generator->numberBetween(2, 50);
        $numberOfPoints = 10;

        $coordinates = [];

        $spreadLong = ($this->_bounds[1][0] - $this->_bounds[0][0]) / ($numberOfPoints*2);
        $spreadLat = ($this->_bounds[1][1] - $this->_bounds[0][1]) / ($numberOfPoints*2);


        $bounds = $this->_bounds;

        // long_min lat_min, long_max, lat_max
        // 00        01         10          11
        
        for ($i = 0; $i < $numberOfPoints; $i++) {
            $coordinate = $this->pointCoordinates($bounds);
            array_push($coordinates, $coordinate);

            if ($this->_moveBound !== null) {
                if ($this->_moveBound == 'longitude') {
                    $bounds[0][0] = $coordinate[0];
                    $bounds[1][0] = $bounds[0][0] + ($this->_bounds[1][0] - $bounds[0][0]) / ($numberOfPoints - $i);
                    $bounds[1][1] = $coordinate[1] + $spreadLat;
                    $bounds[0][1] = $coordinate[1] - $spreadLat;
                } else {
                    $bounds[0][1] = $coordinate[1];
                    $bounds[1][1] = $bounds[0][1] +  (($this->_bounds[1][1] - $bounds[0][1]) / ($numberOfPoints - $i));
                    $bounds[1][0] = $coordinate[0] + $spreadLong;
                    $bounds[0][0] = $coordinate[0] - $spreadLong;
                }
            }

        }

        return $coordinates;
    }

    private function lineStringCoordinates()
    {
        return $this->multiPointCoordinates();
    }

    private function polygonCoordinates()
    {
        $coordinates = $this->lineStringCoordinates();

        array_push($coordinates, $coordinates[0]);

        return [$coordinates];
    }
}
