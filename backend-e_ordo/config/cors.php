<?php


    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    return [
        'paths' => ['api/*', 'sanctum/csrf-cookie'], // Appliquer CORS sur l'API
        'allowed_methods' => ['*'], // Autoriser toutes les méthodes (GET, POST, etc.)
        'allowed_origins' => ['http://localhost:3000'], // Autoriser React en local
        'allowed_origins_patterns' => [],
        'allowed_headers' => ['*'], // Autoriser tous les headers
        'exposed_headers' => [],
        'max_age' => 0,
        'supports_credentials' => true, // Permettre l'authentification avec cookies/tokens
        'headers' => ['Content-Type', 'X-CSRF-TOKEN', 'Authorization'],

    ];
    