<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameOrderingColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::statement('ALTER TABLE routes ADD COLUMN ts_vector tsvector');
        \DB::statement("CREATE INDEX routestext_gin ON routes USING GIN(ts_vector)");
    }

    public function down()
    {
        \DB::statement('ALTER TABLE routes DROP COLUMN tsvector');
    }
}
