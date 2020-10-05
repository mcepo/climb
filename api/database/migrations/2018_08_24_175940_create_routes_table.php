<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRoutesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(
            'routes',
            function (Blueprint $table) {
                $table->increments('id');
                $table->mediumText('name');
                $table->unsignedSmallInteger('type_id');
                $table->unsignedSmallInteger('length')->nullable();
                $table->unsignedSmallInteger('orientation')->nullable();
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

        \DB::statement('ALTER TABLE routes ADD COLUMN ts_vector tsvector');
        \DB::statement("CREATE INDEX routestext_gin ON routes USING GIN(ts_vector)");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('routes');
    }
}
