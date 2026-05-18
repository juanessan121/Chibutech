<?php
declare(strict_types=1);
namespace App\Http\Controllers\Api\Directiva;

use App\Http\Controllers\Controller;
use App\Http\Requests\Directiva\StoreDirectivaRequest;
use App\Http\Resources\Directiva\DirectivaResource;
use App\Models\MiembroDirectiva;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Tag(name="Directiva", description="Gestión de miembros de la directiva")
 */
class DirectivaController extends Controller
{
    /** @OA\Get(path="/api/directiva", tags={"Directiva"}, security={{"sanctum":{}}},
     *  summary="Listar miembros de la directiva",
     *  @OA\Parameter(name="estado", in="query", @OA\Schema(type="string", enum={"Activo","Finalizado"})),
     *  @OA\Response(response=200, description="Lista de miembros")) */
    public function index(Request $request): JsonResponse
    {
        $miembros = MiembroDirectiva::with(['persona', 'cargo'])
            ->when($request->estado, fn($q, $v) => $q->where('estado', $v))
            ->orderBy('fecha_inicio', 'desc')
            ->get();

        return response()->json(DirectivaResource::collection($miembros));
    }

    /** @OA\Post(path="/api/directiva", tags={"Directiva"}, security={{"sanctum":{}}},
     *  summary="Asignar cargo a miembro",
     *  @OA\Response(response=201, description="Cargo asignado")) */
    public function store(StoreDirectivaRequest $request): JsonResponse
    {
        // Finalizar cargo anterior del mismo tipo si existe activo
        MiembroDirectiva::where('id_cargo_directivo', $request->id_cargo_directivo)
            ->where('estado', 'Activo')
            ->update(['estado' => 'Finalizado', 'fecha_fin' => now()->toDateString()]);

        $miembro = MiembroDirectiva::create(array_merge($request->validated(), ['estado' => 'Activo']));

        return response()->json(
            new DirectivaResource($miembro->load(['persona', 'cargo'])),
            201
        );
    }

    /** @OA\Get(path="/api/directiva/{id}", tags={"Directiva"}, security={{"sanctum":{}}},
     *  summary="Ver miembro de directiva",
     *  @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *  @OA\Response(response=200, description="Detalle")) */
    public function show(int $id): JsonResponse
    {
        $miembro = MiembroDirectiva::with(['persona', 'cargo'])->findOrFail($id);
        return response()->json(new DirectivaResource($miembro));
    }

    /** @OA\Patch(path="/api/directiva/{id}/finalizar", tags={"Directiva"}, security={{"sanctum":{}}},
     *  summary="Finalizar cargo de un miembro",
     *  @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *  @OA\Response(response=200, description="Cargo finalizado")) */
    public function finalizar(int $id): JsonResponse
    {
        $miembro = MiembroDirectiva::findOrFail($id);

        if ($miembro->estado === 'Finalizado') {
            return response()->json(['message' => 'El cargo ya estaba finalizado.'], 422);
        }

        $miembro->update(['estado' => 'Finalizado', 'fecha_fin' => now()->toDateString()]);
        return response()->json(new DirectivaResource($miembro->load(['persona', 'cargo'])));
    }

    /** @OA\Get(path="/api/directiva/historial/{personaId}", tags={"Directiva"}, security={{"sanctum":{}}},
     *  summary="Historial de cargos de una persona",
     *  @OA\Parameter(name="personaId", in="path", required=true, @OA\Schema(type="integer")),
     *  @OA\Response(response=200, description="Historial")) */
    public function historial(int $personaId): JsonResponse
    {
        $historial = MiembroDirectiva::with(['cargo'])
            ->where('id_persona', $personaId)
            ->orderBy('fecha_inicio', 'desc')
            ->get();

        return response()->json(DirectivaResource::collection($historial));
    }
}
