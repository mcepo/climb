<?php

namespace Tests\Feature;

use App\Models\ImageTag;

class ImageTagCrudTest extends BaseCrud
{
    /**
     * A basic test example.
     *
     * @return void
     */

    protected $_baseUrl = 'image_tag';

    protected $_model = ImageTag::class;

    protected function _getStructure()
    {
        return [
            'id',
            'geometry' => [
                'type',
                'coordinates'
            ],
            'image_id',
            'tagged_type',
            'tagged_id',
            'created_at',
            'updated_at'
        ];
    }

    public function testUpdate()
    {
        $imageTag = ImageTag::inRandomOrder()->first();

        $imageTagNew = factory(ImageTag::class)->make()->toArray();

        $item = $this->update($imageTag->id, $imageTagNew);
    }

    public function testDestroy()
    {
        $item = ImageTag::inRandomOrder()->first();

        $this->destroy($item->id);
    }
}
