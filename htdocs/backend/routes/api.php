<?php
declare(strict_types=1);

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Auditoria\AuditoriaController;
use App\Http\Controllers\Api\Catalogos\CatalogoController;
use App\Http\Controllers\Api\Catastro\TerrenoController;
use App\Http\Controllers\Api\Directiva\DirectivaController;
use App\Http\Controllers\Api\Finanzas\CajaController;
use App\Http\Controllers\Api\Finanzas\MultaController;
use App\Http\Controllers\Api\Mock\MockApiController;
use App\Http\Controllers\Api\Personas\PersonaController;
use App\Http\Controllers\Api\Usuarios\UsuarioController;
use Illuminate\Support\Facades\Route;

// AUTH - publico
Route::prefix('auth')->group(function () {
    Route::post('/login',  [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/me',      [AuthController::class, 'me'])->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('mock')->group(function () {
        Route::get('/ping',     [MockApiController::class, 'ping']);
        Route::get('/services', [MockApiController::class, 'services']);
    });

    // Catalogos
    Route::prefix('catalogos')->group(function () {
        Route::get('/zonas',                [CatalogoController::class, 'zonas']);
        Route::get('/condiciones',          [CatalogoController::class, 'condiciones']);
        Route::get('/cargos-directivos',    [CatalogoController::class, 'cargosDirectivos']);
        Route::get('/tipos-contacto',       [CatalogoController::class, 'tiposContacto']);
        Route::get('/estados-construccion', [CatalogoController::class, 'estadosConstruccion']);
        Route::get('/niveles-academicos',   [CatalogoController::class, 'nivelesAcademicos']);
        Route::get('/titulos',              [CatalogoController::class, 'titulos']);
        Route::middleware('check.permission:catalogos.gestionar')->group(function () {
            Route::post('/zonas',             [CatalogoController::class, 'storeZona']);
            Route::put('/zonas/{id}',         [CatalogoController::class, 'updateZona']);
            Route::delete('/zonas/{id}',      [CatalogoController::class, 'destroyZona']);
            Route::post('/condiciones',       [CatalogoController::class, 'storeCondicion']);
            Route::post('/cargos-directivos', [CatalogoController::class, 'storeCargoDirectivo']);
        });
    });

    // Personas
    Route::prefix('personas')->group(function () {
        Route::middleware('check.permission:personas.ver')->group(function () {
            Route::get('/',     [PersonaController::class, 'index']);
            Route::get('/{id}', [PersonaController::class, 'show']);
        });
        Route::middleware('check.permission:personas.crear')->group(function () {
            Route::post('/',                   [PersonaController::class, 'store']);
            Route::post('/{id}/contactos',     [PersonaController::class, 'storeContacto']);
        });
        Route::middleware('check.permission:personas.editar')->group(function () {
            Route::put('/{id}',   [PersonaController::class, 'update']);
            Route::patch('/{id}', [PersonaController::class, 'update']);
        });
        Route::middleware('check.permission:personas.eliminar')->group(function () {
            Route::delete('/{id}',                        [PersonaController::class, 'destroy']);
            Route::delete('/{id}/contactos/{contactoId}', [PersonaController::class, 'destroyContacto']);
        });
    });

    // Directiva
    Route::prefix('directiva')->group(function () {
        Route::middleware('check.permission:directiva.ver')->group(function () {
            Route::get('/',                      [DirectivaController::class, 'index']);
            Route::get('/{id}',                  [DirectivaController::class, 'show']);
            Route::get('/historial/{personaId}', [DirectivaController::class, 'historial']);
        });
        Route::middleware('check.permission:directiva.gestionar')->group(function () {
            Route::post('/',                [DirectivaController::class, 'store']);
            Route::patch('/{id}/finalizar', [DirectivaController::class, 'finalizar']);
        });
    });

    // Catastro
    Route::prefix('catastro')->group(function () {
        Route::middleware('check.permission:terrenos.ver')->group(function () {
            Route::get('/terrenos',      [TerrenoController::class, 'index']);
            Route::get('/terrenos/{id}', [TerrenoController::class, 'show']);
        });
        Route::middleware('check.permission:terrenos.gestionar')->group(function () {
            Route::post('/terrenos',        [TerrenoController::class, 'store']);
            Route::put('/terrenos/{id}',    [TerrenoController::class, 'update']);
            Route::delete('/terrenos/{id}', [TerrenoController::class, 'destroy']);
        });
    });

    // Finanzas
    Route::prefix('finanzas')->group(function () {
        Route::middleware('check.permission:multas.ver')->group(function () {
            Route::get('/multas',      [MultaController::class, 'index']);
            Route::get('/multas/{id}', [MultaController::class, 'show']);
        });
        Route::middleware('check.permission:multas.gestionar')->group(function () {
            Route::post('/multas',              [MultaController::class, 'store']);
            Route::patch('/multas/{id}/pagar',  [MultaController::class, 'pagar']);
            Route::patch('/multas/{id}/anular', [MultaController::class, 'anular']);
        });
        Route::middleware('check.permission:caja.ver')->group(function () {
            Route::get('/caja',         [CajaController::class, 'index']);
            Route::get('/caja/resumen', [CajaController::class, 'resumen']);
            Route::get('/caja/{id}',    [CajaController::class, 'show']);
        });
        Route::middleware('check.permission:caja.registrar')->group(function () {
            Route::post('/caja', [CajaController::class, 'store']);
        });
    });

    // Auditoria
    Route::prefix('auditoria')->middleware('check.permission:config.ver')->group(function () {
        Route::get('/',       [AuditoriaController::class, 'index']);
        Route::get('/tablas', [AuditoriaController::class, 'tablas']);
        Route::get('/{id}',   [AuditoriaController::class, 'show']);
    });

    // Usuarios
    Route::prefix('usuarios')->group(function () {
        Route::middleware('check.permission:usuarios.ver')->group(function () {
            Route::get('/',      [UsuarioController::class, 'index']);
            Route::get('/roles', [UsuarioController::class, 'roles']);
            Route::get('/{id}',  [UsuarioController::class, 'show']);
        });
        Route::middleware('check.permission:usuarios.crear')->group(function () {
            Route::post('/', [UsuarioController::class, 'store']);
        });
        Route::middleware('check.permission:usuarios.editar')->group(function () {
            Route::patch('/{id}/rol',      [UsuarioController::class, 'cambiarRol']);
            Route::patch('/{id}/password', [UsuarioController::class, 'cambiarPassword']);
        });
        Route::middleware('check.permission:usuarios.eliminar')->group(function () {
            Route::delete('/{id}', [UsuarioController::class, 'destroy']);
        });
    });
});
