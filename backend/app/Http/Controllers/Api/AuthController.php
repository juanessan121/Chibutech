<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;
use App\Models\Persona;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'cedula' => 'required|string',
            'password' => 'nullable|string'
        ]);

        $cedula = $request->input('cedula');
        $password = $request->input('password');

        // 1. Si enviaron contraseña, intentamos loguear como Directiva/Admin en la tabla Usuarios
        if (!empty($password)) {
            $usuario = Usuario::where('cedula', $cedula)->with('persona')->first();

            if (!$usuario || !Hash::check($password, $usuario->password)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Credenciales incorrectas o usuario no autorizado.'
                ], 401);
            }

            // Mapeo de permisos mock
            $permisos = ['ver_dashboard', 'ver_reportes'];
            if ($usuario->rol === 'Administrador') {
                $permisos = ['ver_dashboard', 'crear_usuario', 'editar_usuario', 'eliminar_usuario', 'gestionar_multas', 'gestionar_mingas', 'ver_reportes'];
            } elseif ($usuario->rol === 'Presidente') {
                $permisos = ['ver_dashboard', 'crear_usuario', 'editar_usuario', 'eliminar_usuario', 'gestionar_multas', 'gestionar_mingas', 'ver_reportes'];
            } elseif ($usuario->rol === 'Secretario') {
                $permisos = ['ver_dashboard', 'gestionar_mingas', 'crear_usuario', 'editar_usuario', 'ver_usuario'];
            } elseif ($usuario->rol === 'Tesorero') {
                $permisos = ['ver_dashboard', 'gestionar_multas', 'ver_reportes'];
            }

            $token = $usuario->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'data' => [
                    'token' => $token,
                    'user' => [
                        'id' => $usuario->id_usuario,
                        'username' => $usuario->cedula,
                        'nombre_completo' => $usuario->persona ? $usuario->persona->nombre . ' ' . $usuario->persona->apellido : 'Admin',
                        'rol' => $usuario->rol,
                        'permisos' => $permisos
                    ]
                ]
            ]);
        }

        // 2. Si NO enviaron contraseña, asumimos que es un Comunero (Usuario Regular)
        // Buscamos si existe la Persona con esa cedula
        $persona = Persona::where('cedula', $cedula)->first();

        if (!$persona) {
            return response()->json([
                'status' => 'error',
                'message' => 'No existe ningún comunero registrado con esa cédula.'
            ], 401);
        }

        // Verificamos si esta persona ya tiene un usuario asignado
        $usuarioExistente = Usuario::where('id_persona', $persona->id_persona)->first();

        if ($usuarioExistente && $usuarioExistente->rol !== 'Usuario Regular') {
            return response()->json([
                'status' => 'error',
                'message' => 'Esta cuenta tiene permisos especiales. Por favor ingresa tu contraseña.'
            ], 401);
        }

        // Si no tiene usuario, se lo creamos como Comunero
        if (!$usuarioExistente) {
            $usuarioExistente = Usuario::create([
                'id_persona' => $persona->id_persona,
                'cedula' => $cedula,
                'password' => Hash::make(uniqid()), // Contraseña aleatoria imposible
                'rol' => 'Usuario Regular'
            ]);
        }

        $token = $usuarioExistente->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $usuarioExistente->id_usuario,
                    'username' => $usuarioExistente->cedula,
                    'nombre_completo' => $persona->nombre . ' ' . $persona->apellido,
                    'rol' => 'Usuario Regular',
                    'permisos' => ['ver_dashboard', 'ver_perfil']
                ]
            ]
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Sesión cerrada exitosamente'
        ]);
    }
}
