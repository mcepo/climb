<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAreaStatsColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('areas', function (Blueprint $table) {
            $table->jsonb('grade_stats')->nullable();
            $table->jsonb('orientations')->nullable();
            $table->jsonb('route_stats')->nullable();
            $table->jsonb('length_stats')->nullable();
            $table->float('tag_coverage')->nullable();
            $table->smallInteger('image_count')->nullable();
            $table->smallInteger('trail_count')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
