<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TituloController;
use App\Http\Controllers\Api\PersonaController;
use App\Http\Controllers\Api\TerrenoController;
use App\Http\Controllers\Api\MingaController;
use App\Http\Controllers\Api\CobroController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Buscar títulos educativos
Route::get('/catalogos/titulos/todos', [TituloController::class, 'todos']);
Route::get('/catalogos/titulos', [TituloController::class, 'buscar']);

// Otros catálogos
Route::get('/catalogos/operadoras', function() {
    return response()->json(['status' => 'ok', 'data' => \App\Models\CatalogoOperadora::all()]);
});
Route::get('/catalogos/generos', function() {
    return response()->json(['status' => 'ok', 'data' => \App\Models\CatalogoGenero::all()]);
});
Route::get('/catalogos/condiciones', function() {
    return response()->json(['status' => 'ok', 'data' => \App\Models\CatalogoCondicionEspecial::all()]);
});

// Personas (Búsqueda, Registro, Edición y Eliminación)
Route::get('/personas', [PersonaController::class, 'buscar']);
Route::get('/personas/{id}', [PersonaController::class, 'show']);
Route::post('/personas', [PersonaController::class, 'store']);
Route::put('/personas/{id}', [PersonaController::class, 'update']);
Route::delete('/personas/{id}', [PersonaController::class, 'destroy']);

// Terrenos y Propiedades
Route::get('/terrenos/buscar-universal', [TerrenoController::class, 'buscarUniversal']);
Route::get('/terrenos', [TerrenoController::class, 'index']);
Route::get('/terrenos/{id}', [TerrenoController::class, 'show']);
Route::post('/terrenos', [TerrenoController::class, 'store']);
Route::put('/terrenos/{id}', [TerrenoController::class, 'update']);
Route::put('/terrenos/{id}/estado', [TerrenoController::class, 'updateEstado']);
Route::put('/terrenos/{id}/traspaso', [TerrenoController::class, 'traspasoDominio']);

// Mingas
Route::get('/mingas', [MingaController::class, 'index']);
Route::get('/mingas/activas', [MingaController::class, 'activas']);
Route::get('/mingas/{id}/convocados', [MingaController::class, 'convocados']);
Route::post('/mingas/{id}/asistencia', [MingaController::class, 'registrarAsistencia']);
Route::post('/mingas', [MingaController::class, 'store']);

// Cobros y Caja
Route::get('/cobros/deudas/{id}', [CobroController::class, 'deudasPendientes']);
Route::get('/cobros/terreno/{id}/deudas', [CobroController::class, 'deudas']);
Route::get('/cobros/terreno/{id}/consultar-mes', [CobroController::class, 'consultarMes']);
Route::post('/cobros/pagar', [CobroController::class, 'procesarPago']);
Route::post('/cobros/pagar-agua', [CobroController::class, 'pagarAgua']);
Route::get('/cobros/historial', [CobroController::class, 'historialTransacciones']);
Route::post('/cobros/multa', [CobroController::class, 'generarMulta']);
Route::post('/cobros/egreso', [CobroController::class, 'registrarEgreso']);
Route::post('/cobros/planillas', [CobroController::class, 'generarPlanillas']);

// Reportes (datos reales para PDF)
Route::get('/reportes/padron',   [TerrenoController::class, 'reportePadron']);
Route::get('/reportes/morosos',  [TerrenoController::class, 'reporteMorosos']);
Route::get('/reportes/balance',  [CobroController::class,   'reporteBalance']);

// Directiva
use App\Http\Controllers\Api\DirectivaController;
Route::get('/directiva/actual', [DirectivaController::class, 'actual']);
Route::get('/directiva/historial', [DirectivaController::class, 'historial']);
Route::post('/directiva', [DirectivaController::class, 'store']);

// Auditoría
use App\Http\Controllers\Api\AuditoriaController;
Route::get('/auditoria', [AuditoriaController::class, 'index']);

// Configuración Global y Catálogos
use App\Http\Controllers\Api\ConfiguracionController;
Route::get('/configuracion', [ConfiguracionController::class, 'getGlobales']);
Route::put('/configuracion', [ConfiguracionController::class, 'updateGlobal']);
Route::get('/configuracion/zonas-sectores', [ConfiguracionController::class, 'getZonasSectores']);
Route::post('/configuracion/zonas', [ConfiguracionController::class, 'addZona']);
Route::put('/configuracion/zonas/{id}', [ConfiguracionController::class, 'updateZona']);
Route::post('/configuracion/sectores', [ConfiguracionController::class, 'addSector']);
Route::put('/configuracion/sectores/{id}', [ConfiguracionController::class, 'updateSector']);
Route::post('/configuracion/titulos', [ConfiguracionController::class, 'addTitulo']);

