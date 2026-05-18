<?php
declare(strict_types=1);
namespace App\Http\Controllers\Api\Auditoria;

use App\Http\Controllers\Controller;
use App\Http\Resources\Auditoria\AuditoriaResource;
use App\Models\Auditoria;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Tag(name="Auditoría", description="Registro de auditoría del sistema (solo lectura)")
 */
class AuditoriaController extends Controller
{
    /** @OA\Get(path="/api/auditoria", tags={"Auditoría"}, security={{"sanctum":{}}},
     *  summary="Consultar registros de auditoría",
     *  @OA\Parameter(name="tabla", in="query", @OA\Schema(type="string")),
     *  @OA\Parameter(name="operacion", in="query", @OA\Schema(type="string", enum={"INSERT","UPDATE","DELETE"})),
     *  @OA\Parameter(name="id_usuario", in="query", @OA\Schema(type="integer")),
     *  @OA\Parameter(name="fecha_desde", in="query", @OA\Schema(type="string", format="date")),
     *  @OA\Parameter(name="fecha_hasta", in="query", @OA\Schema(type="string", format="date")),
     *  @OA\Response(response=200, description="Lista paginada de registros de auditoría")) */
    public function index(Request $request): JsonResponse
    {
        $registros = Auditoria::query()
            ->when($request->tabla,       fn($q, $v) => $q->where('tabla_afectada', $v))
            ->when($request->operacion,   fn($q, $v) => $q->where('operacion', $v))
            ->when($request->id_usuario,  fn($q, $v) => $q->where('id_usuario', $v))
            ->when($request->id_registro, fn($q, $v) => $q->where('id_registro', $v))
            ->when($request->fecha_desde, fn($q, $v) => $q->whereDate('fecha_hora', '>=', $v))
            ->when($request->fecha_hasta, fn($q, $v) => $q->whereDate('fecha_hora', '<=', $v))
            ->orderByDesc('fecha_hora')
            ->paginate(20);

        return response()->json(AuditoriaResource::collection($registros));
    }

    /** @OA\Get(path="/api/auditoria/{id}", tags={"Auditoría"}, security={{"sanctum":{}}},
     *  summary="Ver detalle de un registro de auditoría",
     *  @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *  @OA\Response(response=200, description="Detalle del registro")) */
    public function show(int $id): JsonResponse
    {
        return response()->json(new AuditoriaResource(Auditoria::findOrFail($id)));
    }

    /** @OA\Get(path="/api/auditoria/tablas", tags={"Auditoría"}, security={{"sanctum":{}}},
     *  summary="Listar tablas auditadas disponibles",
     *  @OA\Response(response=200, description="Lista de tablas")) */
    public function tablas(): JsonResponse
    {
        $tablas = Auditoria::select('tabla_afectada')
            ->distinct()
            ->orderBy('tabla_afectada')
            ->pluck('tabla_afectada');

        return response()->json($tablas);
    }
}
