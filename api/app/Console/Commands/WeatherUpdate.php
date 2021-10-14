<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Models\Area;
use App\Models\Weather;
use GuzzleHttp\Client;

class WeatherUpdate extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'weather:update';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Updating weather information for areas.';

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
    $areas = $this->getAreas();

    $areas->load('mapTag');

    $areas->each(
      function($area) {
        if(isset($area->mapTag)) {
          $weatherData = $this->getWeatherData($this->getUrl($area->mapTag->geometry['coordinates']));
          if(isset($weatherData)) {
            $this->storeWeatherData($area, $weatherData);
            die;
          }
        }
      }
    );
  }

  private function getWeatherData($url): ?array
  {

    $client = new Client();

    $page = $client->request('GET', $url);

    if ($page->getStatusCode() != 200) {
        return null;
    }

    return json_decode($page->getBody(), true);
  }

  private function storeWeatherData(Area $area, $weatherData)
  {
    $weather = new Weather();

    $weather->area_id = $area->id;
    $weather->current = $weatherData['current'];
    $weather->minutely = $weatherData['minutely'];
    $weather->hourly = $weatherData['hourly'];
    $weather->daily = $weatherData['daily'];

    $weather->save();

  }

  private function getUrl($coordinates)
  {
    return 'http://api.openweathermap.org/data/2.5/onecall?units=metric&exclude=alerts&lat='.$coordinates[1].'&lon='.$coordinates[0].'&dt='.time().'&appid='.config('app.weather_api_id');
  }

  private function getAreas()
  {
    $areas = Area::select(['id', 'path', 'name'])
      ->whereIn('type_id', [3, 6, 5])
      ->orderBy('id')
      ->get()
      ->keyBy('id');

    return $areas->filter(
      function($area, $key) use ($areas) {

        $ancestorIds = $area->ancestorIds;

        foreach($ancestorIds as $ancestorId) {
          if($areas->contains($ancestorId)) {
            return false;
          }
        }
        return true;
      }
    );
  }
}
