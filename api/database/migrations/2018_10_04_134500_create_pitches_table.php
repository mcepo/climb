<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePitchesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'pitches',
            function (Blueprint $table) {
                $table->increments('id');
                $table->integer('route_id')->index();
                $table->mediumText('path')->index();
                $table->integer('owner_id');
                $table->unsignedSmallInteger('length')->nullable();
                $table->timestamps();

                $table->foreign('route_id')
                    ->onDelete('cascade')
                    ->references('id')
                    ->on('routes');
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
        Schema::dropIfExists('pitches');
    }
}
