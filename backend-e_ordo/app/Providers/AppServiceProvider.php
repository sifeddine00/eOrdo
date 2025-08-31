<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Auth\Notifications\ResetPassword;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Corrige l'erreur de longueur des clés
        Schema::defaultStringLength(191);

        // Personnalise l'URL de réinitialisation
        ResetPassword::createUrlUsing(function ($notifiable, string $token) {
            return url("/reset-password/{$token}?email=" . urlencode($notifiable->email));
        });
    }
}
