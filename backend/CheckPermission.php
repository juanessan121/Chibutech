<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Uso en rutas:
 *   ->middleware('permission:emitir-multas')
 */
final class CheckPermission
{
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $user = $request->user();

        if ($user === null) {
            return response()->json([
                'status'  => 'error',
                'codigo'  => 'AUTH_REQUIRED',
                'mensaje' => 'No autenticado.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        if (! $user->relationLoaded('roles')) {
            $user->load('roles.permissions');
        }

        foreach ($permissions as $permissionSlug) {
            if ($user->hasPermission(trim($permissionSlug))) {
                return $next($request);
            }
        }

        return response()->json([
            'status'  => 'error',
            'codigo'  => 'FORBIDDEN',
            'mensaje' => 'Permiso insuficiente para esta operación.',
        ], Response::HTTP_FORBIDDEN);
    }
}
