<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTagsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'tags',
            function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->jsonb('geometry');
                $table->mediumText('path')->index();
                $table->integer('owner_id');
                $table->unsignedInteger('image_id')->nullable();
                $table->morphs('tagged');
                $table->timestamps();
            }
        );

        \DB::statement('ALTER TABLE tags ADD COLUMN binary_coordinates geometry');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tags');
    }
}
