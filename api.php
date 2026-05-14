<?php

declare(strict_types=1);

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Mock\MockApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ═════════════════════════════════════════════════════════════════
//  CHIBUTECH API — routes/api.php
//  Prefijo base: /api  (definido en RouteServiceProvider)
// ═════════════════════════════════════════════════════════════════

// ─── Auth público ─────────────────────────────────────────────────────────────
Route::prefix('auth')->name('auth.')->group(function (): void {
    Route::post('login', [AuthController::class, 'login'])->name('login');
});

// ─── Auth protegido ───────────────────────────────────────────────────────────
Route::prefix('auth')
    ->name('auth.')
    ->middleware('auth:sanctum')
    ->group(function (): void {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('me',     [AuthController::class, 'me'])->name('me');
    });

// ═════════════════════════════════════════════════════════════════
//  MOCK API — Solo en entornos no productivos
//  Añadir en .env:  APP_MOCK_API_ENABLED=true
// ═════════════════════════════════════════════════════════════════
if (config('app.mock_api_enabled', false)) {
    Route::prefix('mock')
        ->name('mock.')
        ->group(function (): void {
            // Auth mock (no requiere token)
            Route::post('auth/login', [MockApiController::class, 'login'])->name('auth.login');

            // Datos mock (sin autenticación real, para maquetado)
            Route::get('comuneros',             [MockApiController::class, 'comuneros'])->name('comuneros.index');
            Route::get('profesiones/buscar',    [MockApiController::class, 'buscarProfesiones'])->name('profesiones.buscar');
            Route::get('dashboard/jefe-area',   [MockApiController::class, 'dashboardJefeArea'])->name('dashboard.jefe-area');
            Route::get('predios/{id}',          [MockApiController::class, 'detallePredio'])
                ->whereNumber('id')
                ->name('predios.show');
        });
}

// ═════════════════════════════════════════════════════════════════
//  RUTAS PROTEGIDAS (Sanctum + RBAC)
//  Stubs preparados — se completan en el paso 2
// ═════════════════════════════════════════════════════════════════
Route::middleware('auth:sanctum')->group(function (): void {

    // ── Padrón Comunitario ─────────────────────────────────────────────────
    Route::prefix('comuneros')->name('comuneros.')->group(function (): void {
        Route::get('/',       [\App\Http\Controllers\Api\ComuneroController::class, 'index'])->name('index');
        Route::post('/',      [\App\Http\Controllers\Api\ComuneroController::class, 'store'])
            ->middleware('permission:crear-comunero')->name('store');
        Route::get('{id}',    [\App\Http\Controllers\Api\ComuneroController::class, 'show'])->name('show');
        Route::put('{id}',    [\App\Http\Controllers\Api\ComuneroController::class, 'update'])
            ->middleware('permission:editar-comunero')->name('update');
        Route::delete('{id}', [\App\Http\Controllers\Api\ComuneroController::class, 'destroy'])
            ->middleware('permission:eliminar-comunero')->name('destroy');
    });

    // ── Directorio CIUO-08 ─────────────────────────────────────────────────
    Route::prefix('profesiones')->name('profesiones.')->group(function (): void {
        Route::get('buscar',  [\App\Http\Controllers\Api\ProfesionController::class, 'buscar'])->name('buscar');
    });

    // ── Servicios / Cuotas / Multas ────────────────────────────────────────
    Route::prefix('servicios')->name('servicios.')->middleware('role:jefe-area,admin')->group(function (): void {
        Route::get('tarifa/{predioId}', [\App\Http\Controllers\Api\ServicioController::class, 'calcularTarifa'])->name('tarifa');
    });

    Route::prefix('multas')->name('multas.')->group(function (): void {
        Route::get('/',  [\App\Http\Controllers\Api\MultaController::class, 'index'])->name('index');
        Route::post('/', [\App\Http\Controllers\Api\MultaController::class, 'store'])
            ->middleware('permission:emitir-multa')->name('store');
        Route::patch('{id}/anular', [\App\Http\Controllers\Api\MultaController::class, 'anular'])
            ->middleware('permission:anular-multa')->name('anular');
    });

    // ── Dashboard Jefe de Área ─────────────────────────────────────────────
    Route::prefix('dashboard')->name('dashboard.')->middleware('role:jefe-area,admin')->group(function (): void {
        Route::get('jefe-area', [\App\Http\Controllers\Api\JefeAreaDashboardController::class, 'index'])
            ->name('jefe-area');
    });

    // ── RBAC Admin ─────────────────────────────────────────────────────────
    Route::prefix('admin')->name('admin.')->middleware('role:admin')->group(function (): void {
        Route::apiResource('roles',       \App\Http\Controllers\Api\Admin\RoleController::class);
        Route::apiResource('permisos',    \App\Http\Controllers\Api\Admin\PermissionController::class);
        Route::post('usuarios/{userId}/roles', [\App\Http\Controllers\Api\Admin\UserRoleController::class, 'sync'])
            ->name('usuarios.roles.sync');
    });
});
