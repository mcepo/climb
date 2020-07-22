<?php

namespace Tests\Feature;

use App\Models\Image;
use Illuminate\Support\Facades\Storage;

class ImageCrudTest extends BaseCrud
{
    /**
     * A basic test example.
     *
     * @return void
     */

    protected $_baseUrl = 'image';

    protected $_model = Image::class;

    public function testGet()
    {
        $image = Image::inRandomOrder()->first();

        $response = $this->get(
            'api/' . $this->_baseUrl . '/' . $image->id . '/layers/'
        )->dump();
    }

    public function testGetImageLayers()
    {
        $response = $this->get('api/' . $this->_baseUrl . '/1/layers')
     //   ->dump()
        ;
        $response = json_decode($response->content());
        
        foreach ($response->tags as $key => $value) {
            dump($key, $value);
        }
    }

    public function testDestroy()
    {
        $item = Image::inRandomOrder()->first();

        $this->destroy($item->id);

        $this->assertNull(Image::find($item->id));

        Storage::disk('images')->assertMissing($item->path);
    }
}
