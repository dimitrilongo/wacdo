<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TestController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\PosteController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AffectationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Routes de test API
Route::get('/test', [TestController::class, 'index']);
Route::get('/data', [TestController::class, 'getData']);

// Routes publiques pour l'authentification
Route::post('/register', [AuthController::class, 'register'])->name('api.register');
Route::post('/login', [AuthController::class, 'login'])->name('api.login');

// Routes protégées par authentification
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');
    Route::get('/me', [AuthController::class, 'me'])->name('api.me');

    // Routes pour les restaurants
    Route::apiResource('restaurants', RestaurantController::class);

    // Routes pour les postes
    Route::apiResource('postes', PosteController::class);

    // Routes pour les utilisateurs
    Route::apiResource('users', UserController::class);

    // Routes pour les affectations
    Route::apiResource('affectations', AffectationController::class);
});
