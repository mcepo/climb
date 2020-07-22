<?php

namespace Tests\Feature;

use App\Models\Tag;
use function GuzzleHttp\json_decode;

class TagCrudTest extends BaseCrud
{
    /**
     * A basic test example.
     *
     * @return void
     */

    protected $_baseUrl = 'tag';

    protected $_model = Tag::class;

    protected function _getStructure()
    {
        return [
            'id',
            'geometry' => [
                'type',
                'coordinates'
            ],
            'tagged_type',
            'tagged_id',
            'created_at',
            'updated_at'
        ];
    }

    public function testGetLayers()
    {
        $response = $this->post('api/' . $this->_baseUrl . '/layers')
        ->dump();

        $response = json_decode($response->content());
        
        foreach ($response as $key => $value) {
     //       dump($key);
        }
    }

    public function testUpdate()
    {
        $tag = Tag::inRandomOrder()->first()->toArray();

        $tagNew = factory(Tag::class)->make();

        $tag['geometry'] = $tagNew->geometry;

        $item = $this->update($tag['id'], $tag);
    }

    public function testDestroy()
    {
        $item = Tag::inRandomOrder()->first();

        $this->destroy($item->id);
    }
}
