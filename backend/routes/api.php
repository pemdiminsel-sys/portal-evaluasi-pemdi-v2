<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\PenilaianController;

Route::prefix('v1')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::get('/test-supabase', [\App\Http\Controllers\Api\V1\SupabaseTestController::class, 'test']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/dashboard-summary', [\App\Http\Controllers\Api\V1\DashboardController::class, 'index']);
        
        Route::get('/user', function (Request $request) {
            return $request->user();
        });
        Route::post('/logout', [AuthController::class, 'logout']);
        
        Route::get('/penilaian', [PenilaianController::class, 'index']);
        Route::post('/penilaian', [PenilaianController::class, 'store']);

        Route::apiResource('opd', \App\Http\Controllers\Api\V1\OpdController::class);
        Route::get('/indikator', [\App\Http\Controllers\Api\V1\IndikatorController::class, 'index']);

        Route::post('/bukti', [\App\Http\Controllers\Api\V1\BuktiController::class, 'store']);
        Route::delete('/bukti/{id}', [\App\Http\Controllers\Api\V1\BuktiController::class, 'destroy']);
        Route::get('/users', [\App\Http\Controllers\Api\V1\UserController::class, 'index']);
        Route::post('/users', [\App\Http\Controllers\Api\V1\UserController::class, 'store']);
        Route::delete('/users/{id}', [\App\Http\Controllers\Api\V1\UserController::class, 'destroy']);
        
        Route::post('/change-password', [AuthController::class, 'changePassword']);
    });
});
