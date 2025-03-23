<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\PatientController;




// Routes d'authentification
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Route pour récupérer le token CSRF
Route::get('/sanctum/csrf-cookie', [Laravel\Sanctum\Http\Controllers\CsrfCookieController::class, 'show']);


// Routes pour la réinitialisation du mot de passe
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);



Route::get('/patients', [PatientController::class, 'index']);
Route::post('/add-patient', [PatientController::class, 'store']);
Route::get('/patients/{num_dossier}', [PatientController::class, 'show']);
Route::put('/patients/{num_dossier}', [PatientController::class, 'update']);
Route::delete('/patients/{num_dossier}', [PatientController::class, 'destroy']);
