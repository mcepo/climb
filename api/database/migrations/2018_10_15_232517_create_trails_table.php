<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTrailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'trails',
            function (Blueprint $table) {
                $table->increments('id');
                $table->string('name');
                $table->unsignedInteger('area_id');
                $table->mediumText('path')->nullable()->index();
                $table->integer('owner_id');
                $table->timestamps();

                $table->foreign('area_id')
                ->onDelete('restrict')
                ->references('id')
                ->on('areas');
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
        Schema::dropIfExists('trails');
    }
}
