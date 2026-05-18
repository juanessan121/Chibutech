<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\UsuarioSistema;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

/**
 * @OA\Tag(name="Auth", description="Autenticación de usuarios del sistema")
 */
class AuthController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/auth/login",
     *     tags={"Auth"},
     *     summary="Iniciar sesión",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"username","password"},
     *             @OA\Property(property="username", type="string", example="admin"),
     *             @OA\Property(property="password", type="string", example="Chibutech2025!")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Login exitoso — retorna token Sanctum"),
     *     @OA\Response(response=422, description="Credenciales inválidas")
     * )
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $usuario = UsuarioSistema::with(['persona', 'rol.permisos'])
            ->where('username', $request->username)
            ->first();

        if (! $usuario || ! Hash::check($request->password . $usuario->password_salt, $usuario->password_hash)) {
            return response()->json(['message' => 'Credenciales incorrectas.'], 422);
        }

        $token = $usuario->createToken('api-token')->plainTextToken;

        return response()->json([
            'token'   => $token,
            'usuario' => [
                'id'       => $usuario->id_usuario,
                'username' => $usuario->username,
                'nombre'   => $usuario->persona?->nombre_completo,
                'rol'      => $usuario->rol->nombre_rol,
                'permisos' => $usuario->rol->permisos->pluck('nombre_permiso'),
            ],
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/auth/logout",
     *     tags={"Auth"},
     *     summary="Cerrar sesión",
     *     security={{"sanctum":{}}},
     *     @OA\Response(response=200, description="Sesión cerrada")
     * )
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada correctamente.']);
    }

    /**
     * @OA\Get(
     *     path="/api/auth/me",
     *     tags={"Auth"},
     *     summary="Usuario autenticado actual",
     *     security={{"sanctum":{}}},
     *     @OA\Response(response=200, description="Datos del usuario")
     * )
     */
    public function me(Request $request): JsonResponse
    {
        $usuario = $request->user()->load(['persona', 'rol.permisos']);

        return response()->json([
            'id'       => $usuario->id_usuario,
            'username' => $usuario->username,
            'nombre'   => $usuario->persona?->nombre_completo,
            'rol'      => $usuario->rol->nombre_rol,
            'permisos' => $usuario->rol->permisos->pluck('nombre_permiso'),
        ]);
    }
}
