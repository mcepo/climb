<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;

class EmptyStorageDisk extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'storage:flush {disk?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Flushing the specified disk, if no disk is specified all disks are flushed.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $disks = config('filesystems.disks');

        if ($this->argument('disk') == null) {
            foreach ($disks as $disk) {
                $this->_emptyDisk($disk);
            }
        } elseif (isset($disks[$this->argument('disk')])) {
            $this->_emptyDisk($disks[$this->argument('disk')]);
        }
    }

    private function _emptyDisk($disk)
    {
        if (isset($disk['root'])) {
            (new Filesystem)->cleanDirectory($disk['root']);
        }
    }
}
