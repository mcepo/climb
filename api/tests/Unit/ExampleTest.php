<?php

namespace Tests\Unit;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function setUp():void
    {
        parent::setUp();

        \DB::listen(function ($query) {
            dump(
                implode("\n", [$query->sql, json_encode($query->bindings), $query->time])
            );
        });
    }

    public function testBasic()
    {
        $this->assertTrue(true);
    }
}
