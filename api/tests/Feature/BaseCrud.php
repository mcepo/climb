<?php

namespace Tests\Feature;

use App\Models\Area;
use App\Models\Grade;
use App\Models\Image;
use App\Models\ImageTag;
use App\Models\MapTag;
use App\Models\Route;
use Tests\TestCase;

abstract class BaseCrud extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        \DB::listen(function ($query) {
            dump(
                implode("\n", [$query->sql, json_encode($query->bindings), $query->time])
            );
        });
    }

    public function create($item)
    {
        $response = $this->post(
            'api/' . $this->_baseUrl,
            $item
        );

        $this->_check($response);
        return $this->_return($response);
    }

    public function read($id)
    {
        $response = $this->get(
            'api/' . $this->_baseUrl . '/' . $id
        );

        $this->_check($response);
        return $this->_return($response);
    }

    public function update($id, $itemNew)
    {
        $response = $this->put(
            'api/' . $this->_baseUrl . '/' . $id,
            $itemNew
        );

        $this->_check($response);
        return $this->_return($response);
    }

    public function destroy($id)
    {
        $response = parent::delete(
            'api/' . $this->_baseUrl . '/' . $id
        );

        $this->checkTreeIntegrity();

        return $response;
    }

    // function that checks if path and ancestors are set right on an item
    public function checkBranchIntegrity($item)
    {
        $this->assertNotNull($item->type);

        if (is_null($item->parent_id)) {
            $this->assertEmpty($item->ancestors);
            $this->assertNull($item->path);
        } else {
            $this->assertNotNull($item->path);
            $this->assertNotEmpty($item->ancestors);
            $ancestors = $item->ancestors;

            $parentIds = explode('.', $item->path);

            $this->assertEquals(count($item->ancestors), count($parentIds));

            for ($i = count($parentIds) - 1; $i >= 0; $i--) {
                $item = $item->parent;

                $this->assertEquals($item->id, (int) $parentIds[$i]);

                $this->assertEquals($item->name, $ancestors[$i]['name']);
                $this->assertEquals($item->id, $ancestors[$i]['id']);
            }
        }

        $this->assertNotNull($item->ts_vector);
    }

    public function checkTreeIntegrity()
    {
        // checking path for all areas all the way to root area
        Area::whereNotIn(
            'id',
            function ($query) {
                $query->select('parent_id')
                    ->distinct()
                    ->whereNotNull('parent_id')
                    ->from('areas')
                    ->get();
            }
        )
            ->get()
            ->each(
                function ($item, $key) {
                    $this->checkBranchIntegrity($item);
                }
            );

        // checking path for all routes all the way to root area
        Route::all()->each(
            function ($item, $key) {
                $this->checkRouteIntegrity($item);
            }
        );

        // checking path for all grades all the way to root area
        Grade::all()->each(
            function ($item, $key) {
                $this->checkGradeIntegrity($item);
            }
        );

        MapTag::all()->each(
            function ($item, $key) {
                $this->assertNotNull($item->tagged);
            }
        );

        ImageTag::all()->each(
            function ($item, $key) {
                $this->assertNotNull($item->tagged);
            }
        );

        Image::all()->each(
            function ($item, $key) {
                $this->assertNotNull($item->captured);
            }
        );
    }

    public function checkRouteIntegrity($route)
    {
        $this->assertNotNull($route->type);
        $this->assertEquals($route->path, $route->area->getPathWithSelf());
        $this->assertNotNull($route->ts_vector);
        $this->checkBranchIntegrity($route->area);
    }

    public function checkGradeIntegrity($grade)
    {
        $this->assertNotNull($grade->type);
        $this->assertEquals($grade->path, $grade->route->path);
        $this->checkRouteIntegrity($grade->route);
    }

    private function _return($response)
    {
        return json_decode($response->getContent(), true)[$this->_baseUrl];
    }

    private function _check($response)
    {
        if ($response->getStatusCode() === 200) {
            $response->assertJsonStructure([
                $this->_baseUrl => $this->_getStructure(),
            ]);
        } else {
            dump($response);
        }
    }
}
