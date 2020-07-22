<?php

namespace Tests\Feature;

use App\Models\Area;
use App\Models\Image;
use App\Models\ImageTag;
use App\Models\MapTag;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\WithFaker;

class AreaCrudTest extends BaseCrud
{
    use WithFaker;

    protected $_baseUrl = 'area';

    protected $_model = Area::class;

    protected function _getStructure()
    {
        return [
            'id',
            'name',
            'max_altitude',
            'min_altitude',
            'orientation',
            'parent_id',
            'type_id',
            'path',
            'statistics',
            'ancestors' => [
                '*' => [
                    'id',
                    'name',
                ],
            ],
            'created_at',
            'updated_at',
        ];
    }

    public function testShow()
    {
        $item = Area::inRandomOrder()->first();

        $filters = http_build_query([
            'grades' => [
                1 => [0, 30],
            ],
            'length' => [20, 2000],
        ]);
// i need to use json() when ever i make a request to server
        $this->json('GET', 'ap/' . $this->_baseUrl . '/' . $item->id . '?' . $filters)
        //  ->dump()
            ->assertJSonStructure($this->_getStructure());
    }

    public function testIntegrity()
    {
        $this->checkTreeIntegrity();
    }

    public function testTreeStructure()
    {
        $response = $this->get(
            'api/' . $this->_baseUrl
        );
    }

    public function testIndex()
    {
        $response = $this->get('/api/area');
    }

    public function testCreate()
    {
        $item = factory(Area::class)->make()->toArray();

        $item = $this->create($item);

        $this->checkBranchIntegrity($this->_model::find($item['id']));
    }

    public function testUpdate()
    {
        $item = Area::whereNotNull('parent_id')->inRandomOrder()
            ->first();

        $forbiddenParentsId = Area::descendents($item->path) // my children can't be my parent
            ->get()
            ->pluck('id')
            ->push($item->id) // area can't be a parent to its self
            ->push($item->parent_id) // this is alread my parent
            ->toArray();

        $parent = Area::whereNotIn('id', $forbiddenParentsId)
            ->inRandomOrder()
            ->first();

        $itemNew = factory(Area::class)
            ->make(['parent_id' => $parent->id])
            ->toArray();

        $this->update($item->id, $itemNew);

        $this->checkTreeIntegrity();
    }

    // here i am deleting last added area
    // because areas that contain routes or subareas should not be deleted
    public function testDestroy()
    {
        $item = Area::latest()->first();
        $response = $this->destroy($item->id)
            ->assertOk();
    }

    public function testCantDeleteAreaWithChildrenOrRoutes()
    {
        $item = Area::has('children')->first();
        $response = $this->destroy($item->id)
            ->assertStatus(500);
    }

    public function testMapTag()
    {
        $item = Area::inRandomOrder()->first();

        $mapTag = $item->mapTag()->create([
            'geometry' => $this->faker->featureGeometry([
                'allowedTypes' => ['Point'],
                'moveBound' => null,
            ]),
        ]);

        $response = $this->post(
            'api/' . $this->_baseUrl . '/' . $item->id . '/tag',
            $mapTag
        )
        //   ->dump()
            ->assertOk();
    }

    public function testImageTag()
    {
        $item = Area::inRandomOrder()->first();

        $imageTag = factory(ImageTag::class)->make()->toArray();

        $response = $this->post(
            'api/' . $this->_baseUrl . '/' . $item->id . '/tag',
            $imageTag
        )
        //   ->dump()
            ->assertOk();
    }

    public function testImageUpload()
    {
        $item = Area::inRandomOrder()->first();

        $file = UploadedFile::fake()->image('test.jpg');

        $response = $this->post(
            'api/' . $this->_baseUrl . '/' . $item->id . '/image',
            [
                'image' => $file,
            ]
        )
        //   ->dump()
            ->assertOk();

        $imageId = json_decode($response->getContent(), true);

        $this->assertInternalType('int', $imageId);

        $image = Image::find($imageId);

        $this->assertNotNull($image);

        // Assert the file was stored...
        Storage::disk('images')->assertExists($image->path);
    }
}
