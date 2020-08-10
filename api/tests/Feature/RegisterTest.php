<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\User;

class RegisterTest extends TestCase
{

    public function setUp(): void
    {

        parent::setUp();

        User::truncate();
    }

    public function testRegister()
    {
        $userArray = [
            'email' => 'marko.cepo.vk@gmail.com',
            'name' => 'marko',
            'password' => 'test'
        ];

        $this->json("post", '/api/register', $userArray)->dump();

        $this->assertNotNull(User::first());
        $this->assertEquals(User::count(), 1);

    }

    public function testVerification() {
        
        factory(User::class, 1)->create();

        $user = User::first();

        $emailVerificationHash = $user->getEmailForVerification();

    }
}
