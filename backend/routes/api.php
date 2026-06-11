<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TituloController;
use App\Http\Controllers\Api\PersonaController;
use App\Http\Controllers\Api\TerrenoController;
use App\Http\Controllers\Api\MingaController;
use App\Http\Controllers\Api\CobroController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;

Route::middleware('throttle:10,1')->post('/auth/login', [AuthController::class, 'login']);
Route::middleware('throttle:5,1')->post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::middleware('auth:sanctum')->post('/auth/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->post('/auth/cambiar-rol', [AuthController::class, 'cambiarRol']);
Route::middleware('auth:sanctum')->post('/auth/cambiar-password-temporal', [AuthController::class, 'cambiarPasswordTemporal']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {

// Dashboard — resumen consolidado (reemplaza 4 peticiones por 1)
Route::get('/dashboard/resumen', [DashboardController::class, 'resumen']);
Route::get('/dashboard/resumen-comunero', [DashboardController::class, 'resumenComunero']);

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

// Verificación de correo electrónico (MX check)
Route::get('/verificar-email', [PersonaController::class, 'verificarEmail']);

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
Route::get('/mingas/activas/detalle', [MingaController::class, 'activasDetalle']);
Route::get('/mingas/{id}/convocados', [MingaController::class, 'convocados']);
Route::post('/mingas/{id}/asistencia', [MingaController::class, 'registrarAsistencia']);
Route::post('/mingas', [MingaController::class, 'store']);
Route::put('/mingas/{id}', [MingaController::class, 'update']);

// Cobros y Caja
Route::get('/cobros/deudas/{id}', [CobroController::class, 'deudasPendientes']);
Route::get('/cobros/terreno/{id}/deudas', [CobroController::class, 'deudas']);
Route::get('/cobros/terreno/{id}/consultar-mes', [CobroController::class, 'consultarMes']);
Route::post('/cobros/terreno/{id}/periodo', [CobroController::class, 'planillasPeriodo']);
Route::post('/cobros/pagar-periodo', [CobroController::class, 'pagarPeriodo']);
Route::post('/cobros/planillas/auto-generar', [CobroController::class, 'generarMesActual']);
Route::post('/cobros/pagar', [CobroController::class, 'procesarPago']);
Route::post('/cobros/pagar-agua', [CobroController::class, 'pagarAgua']);
Route::get('/cobros/historial', [CobroController::class, 'historialTransacciones']);
Route::get('/cobros/buscar-deudor', [CobroController::class, 'buscarDeudorSinTerreno']);
Route::post('/cobros/multa', [CobroController::class, 'generarMulta']);
Route::post('/cobros/egreso', [CobroController::class, 'registrarEgreso']);
Route::post('/cobros/planillas', [CobroController::class, 'generarPlanillas']);

// Reportes (datos reales para PDF)
Route::get('/reportes/padron',   [TerrenoController::class, 'reportePadron']);
Route::get('/reportes/morosos',  [TerrenoController::class, 'reporteMorosos']);
Route::get('/reportes/balance',  [CobroController::class,   'reporteBalance']);

// Directiva
Route::get('/directiva/actual', [\App\Http\Controllers\Api\DirectivaController::class, 'actual']);
Route::get('/directiva/historial', [\App\Http\Controllers\Api\DirectivaController::class, 'historial']);
Route::post('/directiva', [\App\Http\Controllers\Api\DirectivaController::class, 'store']);
Route::post('/directiva/reactivar', [\App\Http\Controllers\Api\DirectivaController::class, 'reactivar']);
Route::patch('/directiva/miembro', [\App\Http\Controllers\Api\DirectivaController::class, 'cambiarMiembro']);

// Notificaciones
Route::get('/notificaciones', [\App\Http\Controllers\Api\NotificacionController::class, 'index']);
Route::post('/notificaciones/leidas', [\App\Http\Controllers\Api\NotificacionController::class, 'marcarTodasLeidas']);
Route::patch('/notificaciones/{id}/leida', [\App\Http\Controllers\Api\NotificacionController::class, 'marcarLeida']);

// Auditoría
Route::get('/auditoria', [\App\Http\Controllers\Api\AuditoriaController::class, 'index']);

// Configuración Global y Catálogos
Route::get('/configuracion', [\App\Http\Controllers\Api\ConfiguracionController::class, 'getGlobales']);
Route::put('/configuracion', [\App\Http\Controllers\Api\ConfiguracionController::class, 'updateGlobal']);
Route::get('/configuracion/zonas-sectores', [\App\Http\Controllers\Api\ConfiguracionController::class, 'getZonasSectores']);
Route::post('/configuracion/zonas', [\App\Http\Controllers\Api\ConfiguracionController::class, 'addZona']);
Route::put('/configuracion/zonas/{id}', [\App\Http\Controllers\Api\ConfiguracionController::class, 'updateZona']);
Route::post('/configuracion/sectores', [\App\Http\Controllers\Api\ConfiguracionController::class, 'addSector']);
Route::put('/configuracion/sectores/{id}', [\App\Http\Controllers\Api\ConfiguracionController::class, 'updateSector']);
Route::post('/configuracion/titulos', [\App\Http\Controllers\Api\ConfiguracionController::class, 'addTitulo']);
});

