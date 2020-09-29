<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePitchGradesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pitch_grades', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedSmallInteger('type_id');
            $table->unsignedSmallInteger('weight');
            $table->integer('pitch_id')->index();
            $table->mediumText('path')->index();
            $table->timestamps();

            $table->unique(['type_id', 'pitch_id']);

            $table->foreign('pitch_id')
                ->onDelete('cascade')
                ->references('id')
                ->on('pitches');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pitch_grades');
    }
}
