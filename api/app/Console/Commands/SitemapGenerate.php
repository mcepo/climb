<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;
use App\Models\Area;

class SitemapGenerate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sitemap:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generates a sitemap file inside public folder';

    protected $sitemap = null;

    private $baseUrl = 'https://climbline.net/a/';

    public function __construct()
    {

        $this->sitemap = Sitemap::create();

        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        Area::countries()->with('areas')->get()->each(function ($area) {
            $this->addSitemapEntry('', 1, $area);
        });

        $this->sitemap->writeToFile('./public/assets/sitemap.xml');
    }

    private function addSitemapEntry($url, $priority, $area)
    {

        $name = mb_strtolower($area->name);

        $name = preg_replace('/[^a-zđčćžš0-9\s\\-]/', '', $name );

        $name = preg_replace('/[\s|\-]+/', '_', $name );

        $name = trim($name, "_");

        if($url != '') {
            $url .= '-';
        }

        $url .= $name;

        $fullUrl = $this->baseUrl . $url . '/' . $area->id;

        var_dump($fullUrl);

        $this->sitemap->add(
            Url::create($fullUrl)
                ->setLastModificationDate($area->updated_at)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
                ->setPriority($priority)
        );

        $area->areas->each(function($area) use ($url, $priority) {
            $this->addSitemapEntry($url, $priority * 0.85, $area);
        });
    }
}
