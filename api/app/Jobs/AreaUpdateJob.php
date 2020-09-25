<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use App\Services\AreaUpdateService;

class AreaUpdateJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $areaId; 

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($areaId)
    {
        $this->areaId = $areaId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(AreaUpdateService $areaUpdateService)
    {
        $areaUpdateService->updateWithParents($this->areaId);
    }
}
