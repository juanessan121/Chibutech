<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TituloController;
use App\Http\Controllers\Api\PersonaController;
use App\Http\Controllers\Api\TerrenoController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Buscar títulos educativos
Route::get('/catalogos/titulos/todos', [TituloController::class, 'todos']);
Route::get('/catalogos/titulos', [TituloController::class, 'buscar']);

// Personas (Búsqueda y Registro)
Route::get('/personas', [PersonaController::class, 'buscar']);
Route::post('/personas', [PersonaController::class, 'store']);

// Terrenos (Registro)
Route::post('/terrenos', [TerrenoController::class, 'store']);
