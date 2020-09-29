<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGradesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'grades',
            function (Blueprint $table) {
                $table->increments('id');
                $table->unsignedSmallInteger('type_id');
                $table->unsignedSmallInteger('weight');
                $table->mediumText('path')->index();
                $table->integer('route_id');
                $table->timestamps();

                $table->unique(['type_id', 'route_id']);

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
        Schema::dropIfExists('grades');
    }
}
