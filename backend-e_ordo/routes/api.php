<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\MedicamentController;
use App\Http\Controllers\QuantiteController;
use App\Http\Controllers\PosologieController;
use App\Http\Controllers\OrdonnanceController;




Route::apiResource('medicaments', MedicamentController::class);


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


Route::get('/medicaments', [MedicamentController::class, 'index']);
Route::post('/medicaments', [MedicamentController::class, 'store']);
Route::get('/medicaments/{id}', [MedicamentController::class, 'show']);
Route::put('/medicaments/{id}', [MedicamentController::class, 'update']);
Route::delete('/medicaments/{id}', [MedicamentController::class, 'destroy']);


Route::get('/quantites', [QuantiteController::class, 'index']);
Route::get('/posologies', [PosologieController::class, 'index']);

Route::post('/ordonnances', [OrdonnanceController::class, 'store']);
