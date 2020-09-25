<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Models\Area;
use App\Services\AreaUpdateService;


class UpdateAllAreas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'area:update-all';

    protected $areaUpdateService;

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Updating stats for all areas in DB';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(AreaUpdateService $areaUpdateService)
    {

        $this->areaUpdateService = $areaUpdateService;

        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        Area::chunk(100, function($areas){
            $areas->each(function($area){
                dump($area->name);
                $this->areaUpdateService->update($area);  
            });
        });
    }
}
