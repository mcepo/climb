<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->mediumText('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->mediumText('google_id')->nullable();
            $table->mediumText('avatar')->nullable();
            $table->mediumText('password')->nullable();
            $table->integer('role_id'); // is it a user or an admin for now
            $table->timestamps();
            $table->softDeletes();
        });

        \DB::statement('ALTER TABLE users ADD COLUMN ts_vector tsvector');
        \DB::statement("CREATE INDEX userstext_gin ON users USING GIN(ts_vector)");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
