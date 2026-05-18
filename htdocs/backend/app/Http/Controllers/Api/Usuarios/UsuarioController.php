<?php
declare(strict_types=1);
namespace App\Http\Controllers\Api\Usuarios;

use App\Http\Controllers\Controller;
use App\Http\Requests\Usuario\StoreUsuarioRequest;
use App\Http\Resources\Usuario\UsuarioResource;
use App\Models\RolSistema;
use App\Models\UsuarioSistema;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

/**
 * @OA\Tag(name="Usuarios", description="Gestión de usuarios del sistema")
 */
class UsuarioController extends Controller
{
    /** @OA\Get(path="/api/usuarios", tags={"Usuarios"}, security={{"sanctum":{}}},
     *  summary="Listar usuarios del sistema",
     *  @OA\Response(response=200, description="Lista de usuarios")) */
    public function index(): JsonResponse
    {
        $usuarios = UsuarioSistema::with(['persona', 'rol.permisos'])->get();
        return response()->json(UsuarioResource::collection($usuarios));
    }

    /** @OA\Post(path="/api/usuarios", tags={"Usuarios"}, security={{"sanctum":{}}},
     *  summary="Crear usuario del sistema",
     *  @OA\Response(response=201, description="Usuario creado")) */
    public function store(StoreUsuarioRequest $request): JsonResponse
    {
        $salt = bin2hex(random_bytes(16));

        $usuario = UsuarioSistema::create([
            'id_persona'    => $request->id_persona,
            'id_rol'        => $request->id_rol,
            'username'      => $request->username,
            'password_hash' => Hash::make($request->password . $salt),
            'password_salt' => $salt,
        ]);

        return response()->json(
            new UsuarioResource($usuario->load(['persona', 'rol.permisos'])),
            201
        );
    }

    /** @OA\Get(path="/api/usuarios/{id}", tags={"Usuarios"}, security={{"sanctum":{}}},
     *  summary="Ver usuario",
     *  @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *  @OA\Response(response=200, description="Detalle del usuario")) */
    public function show(int $id): JsonResponse
    {
        return response()->json(
            new UsuarioResource(UsuarioSistema::with(['persona', 'rol.permisos'])->findOrFail($id))
        );
    }

    /** @OA\Patch(path="/api/usuarios/{id}/rol", tags={"Usuarios"}, security={{"sanctum":{}}},
     *  summary="Cambiar rol de un usuario",
     *  @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *  @OA\Response(response=200, description="Rol actualizado")) */
    public function cambiarRol(Request $request, int $id): JsonResponse
    {
        $request->validate(['id_rol' => ['required','integer','exists:rol_sistema,id_rol']]);
        $usuario = UsuarioSistema::findOrFail($id);
        $usuario->update(['id_rol' => $request->id_rol]);
        return response()->json(new UsuarioResource($usuario->load(['persona', 'rol.permisos'])));
    }

    /** @OA\Patch(path="/api/usuarios/{id}/password", tags={"Usuarios"}, security={{"sanctum":{}}},
     *  summary="Cambiar contraseña de un usuario",
     *  @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *  @OA\Response(response=200, description="Contraseña actualizada")) */
    public function cambiarPassword(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'password'              => ['required','string','min:8','confirmed'],
            'password_confirmation' => ['required'],
        ]);

        $usuario = UsuarioSistema::findOrFail($id);
        $salt    = bin2hex(random_bytes(16));
        $usuario->update([
            'password_hash' => Hash::make($request->password . $salt),
            'password_salt' => $salt,
        ]);

        return response()->json(['message' => 'Contraseña actualizada correctamente.']);
    }

    /** @OA\Delete(path="/api/usuarios/{id}", tags={"Usuarios"}, security={{"sanctum":{}}},
     *  summary="Eliminar usuario",
     *  @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *  @OA\Response(response=200, description="Usuario eliminado")) */
    public function destroy(int $id): JsonResponse
    {
        $usuario = UsuarioSistema::findOrFail($id);
        if ($usuario->username === 'admin') {
            return response()->json(['message' => 'No se puede eliminar el usuario administrador principal.'], 403);
        }
        $usuario->tokens()->delete();
        $usuario->delete();
        return response()->json(['message' => 'Usuario eliminado correctamente.']);
    }

    /** @OA\Get(path="/api/usuarios/roles", tags={"Usuarios"}, security={{"sanctum":{}}},
     *  summary="Listar roles disponibles",
     *  @OA\Response(response=200, description="Lista de roles con permisos")) */
    public function roles(): JsonResponse
    {
        return response()->json(RolSistema::with('permisos')->get());
    }
}
