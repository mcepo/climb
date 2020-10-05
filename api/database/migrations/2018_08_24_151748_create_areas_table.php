<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAreasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'areas',
            function (Blueprint $table) {
                $table->increments('id');
                $table->mediumText('name');
                $table->unsignedSmallInteger('type_id');
                $table->unsignedSmallInteger('max_altitude')->nullable();
                $table->unsignedSmallInteger('min_altitude')->nullable();
                $table->unsignedSmallInteger('orientation')->nullable();
                $table->mediumText('path')->nullable()->index();
                $table->integer('parent_id')->nullable();
                $table->integer('owner_id');
                $table->timestamps();
            }
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('areas');
    }
}
