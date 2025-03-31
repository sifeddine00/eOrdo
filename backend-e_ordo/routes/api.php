<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\MedicamentController;
use App\Http\Controllers\QuantiteController;
use App\Http\Controllers\PosologieController;
use App\Http\Controllers\OrdonnanceController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

Route::middleware('api')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
});

Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

Route::post('/login', [AuthController::class, 'login']);

// Protéger les routes avec Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
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
});
