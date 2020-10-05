<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateImagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'images',
            function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->mediumText('file_path');
                $table->mediumText('path')->index();
                $table->integer('owner_id');
                $table->jsonb('size');
                $table->integer('reviewer_id')->nullable(); // a person of trust who will review the image and approve it
                $table->timestamps();
                // so now here it can be captured an area or route ?
                $table->morphs('captured');
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
        Schema::dropIfExists('images');
    }
}
