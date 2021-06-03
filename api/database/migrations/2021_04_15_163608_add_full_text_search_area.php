<?php

use Illuminate\Database\Migrations\Migration;

class AddFullTextSearchArea extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::statement('ALTER TABLE areas ADD COLUMN ts_vector tsvector');
        \DB::statement("CREATE INDEX areastext_gin ON areas USING GIN(ts_vector)");
    }

    public function down()
    {
        \DB::statement('ALTER TABLE areas DROP COLUMN tsvector');
    }
}
