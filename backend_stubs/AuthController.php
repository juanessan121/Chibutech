<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

final class AuthController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/auth/login",
     *     tags={"Auth"},
     *     summary="Iniciar sesión y obtener token Sanctum",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email","password"},
     *             @OA\Property(property="email",    type="string", format="email", example="admin@chibutech.ec"),
     *             @OA\Property(property="password", type="string", format="password", example="Admin1234!"),
     *             @OA\Property(property="device_name", type="string", example="web-app")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login exitoso",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="ok"),
     *             @OA\Property(property="token",  type="string"),
     *             @OA\Property(property="usuario", ref="#/components/schemas/UserResource")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Credenciales incorrectas")
     * )
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->validated('email'))
            ->with('roles.permissions')
            ->first();

        if ($user === null || ! Hash::check($request->validated('password'), $user->password)) {
            return response()->json([
                'status'  => 'error',
                'codigo'  => 'INVALID_CREDENTIALS',
                'mensaje' => 'Credenciales incorrectas.',
                'errores' => ['email' => ['Las credenciales proporcionadas no coinciden.']],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $deviceName = $request->validated('device_name', 'api-client');

        $token = $user->createToken($deviceName)->plainTextToken;

        return response()->json([
            'status'  => 'ok',
            'token'   => $token,
            'usuario' => new UserResource($user),
        ], Response::HTTP_OK);
    }

    /**
     * @OA\Post(
     *     path="/api/auth/logout",
     *     tags={"Auth"},
     *     summary="Cerrar sesión (revocar token actual)",
     *     security={{"sanctum":{}}},
     *     @OA\Response(response=200, description="Sesión cerrada"),
     *     @OA\Response(response=401, description="No autenticado")
     * )
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status'  => 'ok',
            'mensaje' => 'Sesión cerrada correctamente.',
        ], Response::HTTP_OK);
    }

    /**
     * @OA\Get(
     *     path="/api/auth/me",
     *     tags={"Auth"},
     *     summary="Obtener usuario autenticado con roles y permisos",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Datos del usuario actual",
     *         @OA\JsonContent(ref="#/components/schemas/UserResource")
     *     )
     * )
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('roles.permissions');

        return response()->json([
            'status'  => 'ok',
            'usuario' => new UserResource($user),
        ], Response::HTTP_OK);
    }
}
