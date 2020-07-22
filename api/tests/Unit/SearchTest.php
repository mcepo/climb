<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Grade;
use App\Models\Image;

class SearchTest extends TestCase
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

    protected function _getSearchStructure()
    {
        return [
            'areas' => [
                '*' => [
                    'id',
                    'name',
                    'map_tag' => [
                        '*' => [
                            'geometry'
                        ]
                    ]
                ]
            ],
            'routes' => [
                '*' => [
                    'id',
                    'name',
                    'grade',
                    'length',
                    'map_tag' => [
                        '*' => [
                            'geometry'
                        ]
                    ]
                ]
            ],
        ];
    }

    protected function _getAutocompleteStructure()
    {
        return [
            'areas' => [
                '*' => [
                    'id',
                    'name'
                ]
            ],
            'routes' => [
                '*' => [
                    'id',
                    'name',
                    'grade',
                    'length'
                ]
            ],
        ];
    }

    public function testImageFilter() {
        $response = $this->_search([
            'image' => 1
        ]);

      //  dump($response);
    }

    public function testAutocompleteEmpty()
    {
        $response = $this->_autocomplete();

        $this->assertCount(2, $response['autocomplete']);
        $this->assertCount(15, $response['autocomplete']['areas']);
        $this->assertCount(15, $response['autocomplete']['routes']);
    }

    public function testSearchEmpty()
    {
        $response = $this->_search();

        $this->assertCount(2, $response['search']);
        $this->assertNotEmpty($response['search']['routes']);
        $this->assertNotEmpty($response['search']['areas']);
    }

    public function testQuerySearch()
    {
        $query = 'ma ver';
        $response = $this->_search(['query' => $query]);

        $this->_checkQueryResult($response['search']['routes'], $query);
        $this->_checkQueryResult($response['search']['areas'], $query);
    }

    public function testQueryAutocomplete()
    {
        $query = 'ma ver';
        $response = $this->_autocomplete(['query' => $query]);

        $this->_checkQueryResult($response['autocomplete']['routes'], $query);
        $this->_checkQueryResult($response['autocomplete']['areas'], $query);
    }

    public function testLengthSearch()
    {
        // [min, max]
        $length = [50, 100];

        $response = $this->_search(['length' => $length]);

        $this->_checkLengthResult($response['search']['routes'], $length);
    }

    public function testTypeSearch()
    {
        $this->_search(
            [
                'type' => [1, 2, 3]
            ]
        );
    }

    public function testGradesSearch()
    {
        $grades = [
            0 => [5, 10], // 'combined',
            // 'mix',
            // 'alpine',
            // 'tehnical',
            // 'required',
            5 => [1, 10], // 'ice',
            // 'incline',
            // 'avg_incline',
            // 'rng_from_incline',
            // 'rng_to_incline',
            10 => [10, 30]// 'max',
            // 'avg'
        ];

        $response = $this->_search(['grades' => $grades]);

        $this->_checkGradesResult($response['routes'], $grades);
    }

    public function testBboxSearch()
    {
        $bbox = [
            'west' => -50,
            'south' => -50,
            'east' => 50,
            'north' => 50
        ];
        // west, south, east, north
        $response = $this->_search(['bbox' => $bbox]);

        $this->_checkBboxResult($response['search']['areas'], $bbox);
        $this->_checkBboxResult($response['search']['routes'], $bbox);
    }

    public function testImageSearch()
    {
        $image = Image::inRandomOrder()->first();

        $response = $this->get(
            'api/route?image='.$image->id
        )
        //->dump()
        ->assertStatus(200);
    }

    private function _checkQueryResult($result, $query)
    {
        $tmp = preg_replace('/(\w+)/', '$1.*', $query);
        $queryRegEx = '#\b(' . preg_replace('/\s/', '|', $tmp) . ')\b#i';

        foreach ($result as $item) {
            $this->assertNotFalse(preg_match($queryRegEx, $item['name']));
        }
    }

    private function _checkLengthResult($result, $range)
    {
        foreach ($result as $item) {
            $this->assertTrue($item['length'] > $range[0]);
            $this->assertTrue($item['length'] < $range[1]);
        }
    }

    private function _checkGradesResult($result, $grades)
    {
        foreach ($result as $item) {
            $routeGradesThatMatchSearch = Grade::where('route_id', $item['id'])
                ->get()
                ->keyBy('type_id')
                ->intersectByKeys($grades)
                ->filter(
                    function ($item, $key) use ($grades) {
                        return ($item->weight > $grades[$key][0])
                        && ($item->weight < $grades[$key][1]);
                    }
                )
                ->toArray();

            $this->assertNotEmpty($routeGradesThatMatchSearch);
        }
    }

    // checking only for point tags because polyline and polygon
    // tags are just too complicated
    private function _checkBboxResult($result, $bbox)
    {
        $collection = collect($result)
            ->flatMap(
                function ($values) {
                    return $values['map_tag'];
                }
            )
            ->pluck('geometry')
            ->filter(
                function ($item) {
                    return $item['type'] === 'Point';
                }
            );
        $collectionChecked = $collection;
        $collectionChecked->filter(
            function ($item) use ($bbox) {
                return (
                    ($bbox['west'] < $item['coordinates'][0]) &&
                    ($bbox['east'] > $item['coordinates'][0])
                ) &&
                (
                    ($bbox['south'] < $item['coordinates'][1]) &&
                    ($bbox['north'] > $item['coordinates'][1])
                );
            }
        );

        $this->assertEquals($collection->count(), $collectionChecked->count());
    }

    private function _search($query = [])
    {
        $response = $this->post(
            'api/search',
            $query
        )
       // ->dump()
        ->assertStatus(200);
        return $this->_return($response);
    }

    private function _autocomplete($query = [])
    {
        $response = $this->post(
            'api/autocomplete',
            $query
        )
      //  ->dump()
        ->assertStatus(200)
        ->assertJsonStructure(
            [
                'autocomplete' => $this->_getAutocompleteStructure()
            ]
        );

        return $this->_return($response);
    }

    private function _return($response)
    {
        return json_decode($response->getContent(), true);
    }
}
