<?php

namespace Tests\Feature;

use App\Models\ImageTag;
use App\Models\MapTag;
use App\Models\Trail;

class TrailCrudTest extends BaseCrud
{
    /**
     * A basic test example.
     *
     * @return void
     */

    protected $_baseUrl = 'trail';

    protected $_model = Trail::class;

    protected function _getStructure()
    {
        return [
            'id',
            'name',
            'created_at',
            'updated_at'
        ];
    }

    public function testCreate()
    {
        $item = factory(Trail::class)->make()->toArray();

        $item = $this->create($item);
    }

    public function testUpdate()
    {
        $item = Trail::inRandomOrder()->first();

        $itemNew = factory(Trail::class)->make()->toArray();

        $item = $this->update($item->id, $itemNew);
    }

    public function testDestroy()
    {
        $item = Trail::inRandomOrder()->first();

        $this->destroy($item->id);
    }

    public function testMapTag()
    {
        $item = Trail::inRandomOrder()->first();

        $mapTag = factory(MapTag::class)->make()->toArray();

        $response = $this->post(
            'api/'.$this->_baseUrl.'/'.$item->id.'/tag',
            $mapTag
        )
     //   ->dump()
        ->assertStatus(200);
    }

    public function testImageTag()
    {
        $item = Trail::inRandomOrder()->first();

        $imageTag = factory(ImageTag::class)->make()->toArray();

        $response = $this->post(
            'api/'.$this->_baseUrl.'/'.$item->id.'/tag',
            $imageTag
        )
       // ->dump()
        ->assertStatus(200);
    }
}
