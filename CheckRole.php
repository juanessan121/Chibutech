<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Uso en rutas:
 *   ->middleware('role:jefe-area')
 *   ->middleware('role:admin,jefe-area')   // OR lógico
 */
final class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if ($user === null) {
            return $this->unauthorized('No autenticado.');
        }

        // Carga eager de roles sólo si no están ya en caché
        if (! $user->relationLoaded('roles')) {
            $user->load('roles.permissions');
        }

        foreach ($roles as $roleSlug) {
            if ($user->hasRole(trim($roleSlug))) {
                return $next($request);
            }
        }

        return $this->forbidden('Acceso denegado: rol insuficiente.');
    }

    private function unauthorized(string $mensaje): JsonResponse
    {
        return response()->json([
            'status'  => 'error',
            'codigo'  => 'AUTH_REQUIRED',
            'mensaje' => $mensaje,
        ], Response::HTTP_UNAUTHORIZED);
    }

    private function forbidden(string $mensaje): JsonResponse
    {
        return response()->json([
            'status'  => 'error',
            'codigo'  => 'FORBIDDEN',
            'mensaje' => $mensaje,
        ], Response::HTTP_FORBIDDEN);
    }
}
