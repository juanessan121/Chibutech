<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\PasswordTemporal;
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

            // Permisos por rol
            switch ($usuario->rol) {
                case 'Administrador':
                case 'Presidente':
                    $permisos = ['ver_dashboard', 'crear_usuario', 'editar_usuario', 'eliminar_usuario',
                                 'gestionar_multas', 'gestionar_mingas', 'ver_reportes',
                                 'ver_usuarios', 'ver_mingas', 'ver_catastro'];
                    break;
                case 'Vicepresidente':
                    $permisos = ['ver_dashboard', 'ver_reportes', 'ver_usuarios', 'ver_catastro'];
                    break;
                case 'Secretario':
                    $permisos = ['ver_dashboard', 'gestionar_mingas', 'crear_usuario', 'editar_usuario',
                                 'ver_usuarios', 'ver_mingas', 'ver_catastro'];
                    break;
                case 'Tesorero':
                    $permisos = ['ver_dashboard', 'gestionar_multas', 'ver_reportes'];
                    break;
                case 'Vocal Principal 1':
                case 'Vocal Principal 2':
                case 'Vocal Principal 3':
                case 'Vocal Suplente 1':
                case 'Vocal Suplente 2':
                    $permisos = ['ver_dashboard', 'ver_mingas'];
                    break;
                default:
                    $permisos = ['ver_dashboard'];
            }

            $token = $usuario->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'data' => [
                    'token' => $token,
                    'user' => [
                        'id'               => $usuario->id_usuario,
                        'id_persona'       => $usuario->id_persona,
                        'username'         => $usuario->cedula,
                        'nombre_completo'  => $usuario->persona ? $usuario->persona->nombre . ' ' . $usuario->persona->apellido : 'Admin',
                        'rol'              => $usuario->rol,
                        'permisos'         => $permisos,
                        'password_temporal'=> (bool) $usuario->password_temporal,
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
                    'id'             => $usuarioExistente->id_usuario,
                    'id_persona'     => $persona->id_persona,
                    'username'       => $usuarioExistente->cedula,
                    'nombre_completo'=> $persona->nombre . ' ' . $persona->apellido,
                    'rol'            => 'Usuario Regular',
                    'permisos'       => ['ver_dashboard', 'ver_perfil']
                ]
            ]
        ]);
    }

    /**
     * Cambia el rol y la contraseña de un usuario existente (o crea el usuario si no existe).
     * Solo accesible para Administrador/Presidente.
     */
    public function cambiarRol(Request $request): JsonResponse
    {
        $request->validate([
            'id_persona' => 'required|integer|exists:Persona,id_persona',
            'rol'        => 'required|in:Administrador,Presidente,Vicepresidente,Secretario,Tesorero,Vocal Principal 1,Vocal Principal 2,Vocal Principal 3,Vocal Suplente 1,Vocal Suplente 2,Usuario Regular',
            'password'   => 'nullable|string|min:4',
        ]);

        // Un administrador no puede modificar su propio rol
        if ((int) $request->id_persona === (int) $request->user()->id_persona) {
            return response()->json([
                'status'  => 'error',
                'message' => 'No puedes modificar tu propio rol. Solicita a otro administrador que realice este cambio.',
            ], 403);
        }

        $usuario = Usuario::where('id_persona', $request->id_persona)->first();

        if ($usuario) {
            $usuario->rol = $request->rol;
            if (!empty($request->password)) {
                $usuario->password = Hash::make($request->password);
            }
            $usuario->save();
        } else {
            $persona = Persona::findOrFail($request->id_persona);
            $usuario = Usuario::create([
                'id_persona' => $request->id_persona,
                'cedula'     => $persona->cedula,
                'password'   => Hash::make($request->password ?? $persona->cedula),
                'rol'        => $request->rol,
            ]);
        }

        return response()->json([
            'status'  => 'success',
            'message' => "Rol actualizado a '{$request->rol}' correctamente.",
            'data'    => ['id_usuario' => $usuario->id_usuario, 'rol' => $usuario->rol]
        ]);
    }

    /**
     * Envía una contraseña temporal al correo registrado del usuario.
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['cedula' => 'required|string']);

        $persona = Persona::where('cedula', $request->cedula)->first();
        if (!$persona) {
            return response()->json([
                'status'  => 'error',
                'message' => 'No existe ningún comunero registrado con esa cédula.',
            ], 404);
        }

        $contacto = \DB::table('Contacto_Persona')
            ->where('id_persona', $persona->id_persona)
            ->where('id_tipo_contacto', 3) // Correo Electrónico
            ->where('es_principal', 1)
            ->first();

        // Si no hay correo principal, buscar cualquier correo
        if (!$contacto) {
            $contacto = \DB::table('Contacto_Persona')
                ->where('id_persona', $persona->id_persona)
                ->where('id_tipo_contacto', 3)
                ->first();
        }

        if (!$contacto || empty($contacto->valor_contacto)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Este comunero no tiene un correo electrónico registrado. Contacta al administrador para que lo registre.',
            ], 422);
        }

        $correo = $contacto->valor_contacto;

        // Generar contraseña temporal de 8 caracteres (legible, sin caracteres confusos)
        $chars    = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        $tempPass = '';
        for ($i = 0; $i < 8; $i++) {
            $tempPass .= $chars[random_int(0, strlen($chars) - 1)];
        }

        $usuario = Usuario::where('id_persona', $persona->id_persona)->first();

        if ($usuario) {
            $usuario->password          = Hash::make($tempPass);
            $usuario->password_temporal = true;
            $usuario->save();
        } else {
            $usuario = Usuario::create([
                'id_persona'        => $persona->id_persona,
                'cedula'            => $persona->cedula,
                'password'          => Hash::make($tempPass),
                'rol'               => 'Usuario Regular',
                'password_temporal' => true,
            ]);
        }

        Mail::to($correo)->send(new PasswordTemporal(
            $persona->nombre . ' ' . $persona->apellido,
            $persona->cedula,
            $tempPass
        ));

        return response()->json([
            'status'  => 'ok',
            'message' => 'Se ha enviado una contraseña temporal a tu correo registrado. Revisa tu bandeja de entrada.',
        ]);
    }

    /**
     * Cambia la contraseña temporal por una nueva (requiere auth).
     */
    public function cambiarPasswordTemporal(Request $request): JsonResponse
    {
        $request->validate([
            'nueva_password'  => 'required|string|min:6',
            'confirmar_password' => 'required|string|same:nueva_password',
        ]);

        $usuario = $request->user();
        $usuario->password          = Hash::make($request->nueva_password);
        $usuario->password_temporal = false;
        $usuario->save();

        return response()->json([
            'status'  => 'ok',
            'message' => 'Contraseña actualizada correctamente. Ahora puedes ingresar con tu nueva contraseña.',
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
