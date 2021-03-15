<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Area;
use App\User;
use App\Models\Route;

class InitOrdering extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ordering:refresh';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ordering of routes in area and pitches in route by there id value';
    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        $this->_loginMe();

        Area::with(['routes' => function($query){
            return $query->orderBy('id', 'asc');
        }])
            ->whereHas('routes')
            ->chunk(500, function($chunk){
                $chunk->each(function($area){
                    $area->routes->reduce(function($carry, $route){
                        $route->order = $carry;
                        $route->save();
                        $carry++;
                        return $carry;
                    }, 1);
                });
            });

        Route::with(['pitches' => function($query){
                return $query->orderBy('id', 'asc');
            }])
                ->where('type_id', 0)
                ->chunk(500, function($chunk){
                    $chunk->each(function($route){
                        $route->pitches->reduce(function($carry, $pitch){
                            $pitch->order = $carry;
                            $pitch->save();
                            $carry++;
                            return $carry;
                        }, 1);
                    });
                });
    }

    private function _loginMe()
    {
        $user = User::where('email', 'marko.cepo.vk@gmail.com')->first();
        auth()->login($user);
    }
}
