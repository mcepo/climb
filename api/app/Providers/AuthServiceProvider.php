<?php

namespace App\Providers;

use App\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        //    \App\Models\Area::class => \App\Policies\AreaPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Gate::before(
            function (User $user) {
                if($user->isAdmin()) {
                    // if a user is admin don't log activity for that user
                    activity()->disableLogging();
                    return true;
                }
            }
        );

        Gate::define(
            'authorize', function ($user, $item) {
                if ($user->hasPermissionInArea($item->path)) {
                    return true;
                }

                if($user->isOwnerOf($item)) {
                    return true;
                }

            }
        );
    }
}
