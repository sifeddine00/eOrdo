<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;


// Route pour l'enregistrement des utilisateurs
Route::post('/register', [AuthController::class, 'register']);

// Route pour la connexion des utilisateurs
Route::post('/login', [AuthController::class, 'login']);

// Route personnalisée pour récupérer le token CSRF
Route::get('/sanctum/csrf-cookie', [Laravel\Sanctum\Http\Controllers\CsrfCookieController::class, 'show']);


