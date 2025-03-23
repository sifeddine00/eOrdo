<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use Illuminate\Http\Middleware\HandleCors; // Middleware pour gérer CORS

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php', // Routes API
        commands: __DIR__.'/../routes/console.php', // Routes console
        health: '/up', // Vérification de l'état du serveur
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Active Sanctum pour gérer les requêtes API stateful
        $middleware->prependToGroup('api', EnsureFrontendRequestsAreStateful::class);
        
        // Active CORS pour permettre les requêtes depuis le frontend (React, Vue, etc.)
        $middleware->append(HandleCors::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        
    })
    ->create();
