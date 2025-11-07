<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TestController;

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
Route::post('/register', [TestController::class, 'register'])->name('api.register');
Route::post('/login', [TestController::class, 'login'])->name('api.login');
