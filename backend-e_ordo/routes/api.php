<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\PasswordResetController;


// Route pour l'enregistrement des utilisateurs
Route::post('/register', [AuthController::class, 'register']);

// Route pour la connexion des utilisateurs
Route::post('/login', [AuthController::class, 'login']);

// Route personnalisée pour récupérer le token CSRF
Route::get('/sanctum/csrf-cookie', [Laravel\Sanctum\Http\Controllers\CsrfCookieController::class, 'show']);

Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);

// Route pour réinitialiser le mot de passe
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])->middleware('auth:sanctum');  // Par exemple, protéger cette route

// <?php

// use App\Http\Controllers\AuthController;
// use App\Http\Controllers\PasswordResetController;
// use Illuminate\Support\Facades\Route;

// // Route pour l'enregistrement des utilisateurs
// Route::post('/register', [AuthController::class, 'register']);

// // Route pour la connexion des utilisateurs
// Route::post('/login', [AuthController::class, 'login']);

// // Route personnalisée pour récupérer le token CSRF
// Route::get('/sanctum/csrf-cookie', [Laravel\Sanctum\Http\Controllers\CsrfCookieController::class, 'show']);

// Route pour demander un lien de réinitialisation

