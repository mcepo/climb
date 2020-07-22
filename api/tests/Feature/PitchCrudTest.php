<?php

namespace Tests\Feature;

use App\Models\Pitch;
use App\Models\MapTag;
use App\Models\ImageTag;

class PitchCrudTest extends BaseCrud
{
    /**
     * A basic test example.
     *
     * @return void
     */

    protected $_baseUrl = 'pitch';

    protected $_model = Pitch::class;

    protected function _getStructure()
    {
        return [
            'id',
            'grade',
            'length',
            'created_at',
            'updated_at'
        ];
    }

    public function testCreate()
    {
        $item = factory(Pitch::class)->make()->toArray();

        $item = $this->create($item);
    }

    public function testUpdate()
    {
        $item = Pitch::orderby('id', 'desc')->first();

        $itemNew = factory(Pitch::class)->make()->toArray();

        $item = $this->update($item->id, $itemNew);
    }

    public function testDestroy()
    {
        $item = Pitch::orderby('id', 'desc')->first();

        $this->destroy($item->id);
    }

    public function testImageTag()
    {
        $item = Pitch::inRandomOrder()->first();

        $imageTag = factory(ImageTag::class)->make()->toArray();

        $response = $this->post(
            'api/'.$this->_baseUrl . '/' . $item->id . '/tag',
            $imageTag
        )
     //   ->dump()
        ->assertOk();
    }

    // pitch cannot be tagged on map, maybe, what about routes that
    // are flat and stretch across long areas
    // maybe allow only routes to have linestring as a tag

    // public function testMapTagTest() {

    //     $item = Pitch::inRandomOrder()->first();

    //     $mapTag = factory(MapTag::class)->make()->toArray();

    //     $response = $this->post(
    //         $this->_baseUrl.'/'.$item->id.'/tag',
    //         $mapTag
    //     )
    //     ->dump()
    //     ->assertStatus(200);
    // }
}
