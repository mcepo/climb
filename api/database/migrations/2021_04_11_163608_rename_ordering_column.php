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
        Schema::table('routes', function (Blueprint $table) 
        {
            $table->renameColumn('order', 'position');
        });

        Schema::table('pitches', function (Blueprint $table) 
        {
            $table->renameColumn('order', 'position');
        });
    }
}
