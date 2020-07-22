<?php

namespace Tests\Feature;

use App\Models\Route;
use App\Models\Area;
use App\Models\MapTag;
use App\Models\ImageTag;

class RouteCrudTest extends BaseCrud
{
    /**
     * A basic test example.
     *
     * @return void
     */

    protected $_baseUrl = 'route';

    protected $_model = Route::class;

    protected function _getStructure()
    {
        return [
            'id',
            'name',
            'area_id',
            'type_id',
            'length',
            'created_at',
            'updated_at'
        ];
    }

    public function testShow()
    {
        $item = Area::inRandomOrder()->first();

        $filters = http_build_query([
            'grades' => [
                1 => [0, 30],
            ],
            'length' => [20, 2000]
        ]);

        $response = $this->get(
            'api/' . $this->_baseUrl . '/'.$item->id.'?'.$filters)
              ->dump()
            ->assertJSonStructure($this->_getStructure());
    }

    public function testIndex() {
        $response = $this->get('/api/route')->dump();
    }

    public function testCreate()
    {
        $area = Area::inRandomOrder()
            ->first();

        $item = factory(Route::class)->make()->toArray();

        $item = $this->create($item);

        $this->assertEquals($item['id'], $item['grades'][0]['route_id']);
        $this->assertEquals($item['path'], $item['grades'][0]['path']);

        $this->checkRouteIntegrity($this->_model::find($item['id']));
    }

    public function testUpdate()
    {
        $item = Route::orderby('id', 'desc')->first();

        $area = Area::whereNotIn('id', [$item->id, $item->area_id])
            ->inRandomOrder()
            ->first();

        $itemNew = factory(Route::class)->make()->toArray();

        $item = $this->update($item->id, $itemNew);

        $this->assertEquals(count($itemNew['grades']), count($item['grades']));

        $this->assertEquals($item['id'], $item['grades'][0]['route_id']);
        $this->assertEquals($item['path'], $item['grades'][0]['path']);

        $this->checkRouteIntegrity($this->_model::find($item['id']));
    }

    public function testDestroy()
    {
        $item = Route::orderby('id', 'desc')->first();

        $this->destroy($item->id);
    }

    public function testMapTag()
    {
        $item = Route::inRandomOrder()->first();

        $mapTag = factory(MapTag::class)->make()->toArray();

        $response = $this->post(
            'api/'.$this->_baseUrl . '/' . $item->id . '/tag',
            $mapTag
        )
     //   ->dump()
        ->assertStatus(200);
    }

    public function testImageTag()
    {
        $item = Route::inRandomOrder()->first();

        $imageTag = factory(ImageTag::class)->make()->toArray();

        $response = $this->post(
            'api/'.$this->_baseUrl . '/' . $item->id . '/tag',
            $imageTag
        )
     //   ->dump()
        ->assertOk();
    }
}
