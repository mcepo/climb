<?php

namespace Tests\Feature;

use Tests\TestCase;

use App\User;

class PermissionPathsTest extends TestCase
{

    private $_user;

    public function setUp(): void {

        $this->_user = new User();

        $this->_user->permitted_paths = ['1.2.3', '4.5.6.7', '1.2.4', '4.5.6.8.9'];
        parent::setUp();
    }

    public function testHasPermissionsToPath()
    {

        $this->assertTrue($this->_user->hasPermissionInPath('1.2.3'));
        $this->assertTrue($this->_user->hasPermissionInPath('1.2.3.10'));
        $this->assertTrue($this->_user->hasPermissionInPath('4.5.6.7'));
        $this->assertTrue($this->_user->hasPermissionInPath('4.5.6.7.8'));

    }

    public function testHasntPermissionsToPath() {
        $this->assertFalse($this->_user->hasPermissionInPath('1.2'));
        $this->assertFalse($this->_user->hasPermissionInPath('1.2.5'));
        $this->assertFalse($this->_user->hasPermissionInPath('4.5.6'));
        $this->assertFalse($this->_user->hasPermissionInPath('4.5.6.9.8'));
    }

}
