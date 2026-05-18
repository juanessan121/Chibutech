<?php
declare(strict_types=1);
namespace App\Http\Controllers\Api\Finanzas;

use App\Http\Controllers\Controller;
use App\Http\Requests\Finanzas\StoreMultaRequest;
use App\Http\Resources\Finanzas\MultaResource;
use App\Models\Multa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Tag(name="Finanzas - Multas", description="Gestión de multas")
 */
class MultaController extends Controller
{
    /** @OA\Get(path="/api/finanzas/multas", tags={"Finanzas - Multas"}, security={{"sanctum":{}}},
     *  summary="Listar multas con filtros",
     *  @OA\Parameter(name="estado_pago", in="query", @OA\Schema(type="string", enum={"Pendiente","Pagada","Anulada"})),
     *  @OA\Parameter(name="id_persona", in="query", @OA\Schema(type="integer")),
     *  @OA\Response(response=200, description="Lista paginada de multas")) */
    public function index(Request $request): JsonResponse
    {
        $multas = Multa::with('persona')
            ->when($request->estado_pago, fn($q, $v) => $q->where('estado_pago', $v))
            ->when($request->id_persona,  fn($q, $v) => $q->where('id_persona', $v))
            ->orderBy('fecha_emision', 'desc')
            ->paginate(15);

        return response()->json(MultaResource::collection($multas));
    }

    /** @OA\Post(path="/api/finanzas/multas", tags={"Finanzas - Multas"}, security={{"sanctum":{}}},
     *  summary="Emitir nueva multa",
     *  @OA\Response(response=201, description="Multa emitida")) */
    public function store(StoreMultaRequest $request): JsonResponse
    {
        $multa = Multa::create(array_merge($request->validated(), ['estado_pago' => 'Pendiente']));
        return response()->json(new MultaResource($multa->load('persona')), 201);
    }

    /** @OA\Get(path="/api/finanzas/multas/{id}", tags={"Finanzas - Multas"}, security={{"sanctum":{}}},
     *  summary="Ver multa",
     *  @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *  @OA\Response(response=200, description="Detalle")) */
    public function show(int $id): JsonResponse
    {
        return response()->json(new MultaResource(Multa::with('persona')->findOrFail($id)));
    }

    /** @OA\Patch(path="/api/finanzas/multas/{id}/pagar", tags={"Finanzas - Multas"}, security={{"sanctum":{}}},
     *  summary="Marcar multa como pagada",
     *  @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *  @OA\Response(response=200, description="Multa pagada")) */
    public function pagar(int $id): JsonResponse
    {
        $multa = Multa::findOrFail($id);
        if ($multa->estado_pago !== 'Pendiente') {
            return response()->json(['message' => "La multa ya está en estado: {$multa->estado_pago}."], 422);
        }
        $multa->update(['estado_pago' => 'Pagada']);
        return response()->json(new MultaResource($multa->load('persona')));
    }

    /** @OA\Patch(path="/api/finanzas/multas/{id}/anular", tags={"Finanzas - Multas"}, security={{"sanctum":{}}},
     *  summary="Anular una multa",
     *  @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *  @OA\Response(response=200, description="Multa anulada")) */
    public function anular(int $id): JsonResponse
    {
        $multa = Multa::findOrFail($id);
        if ($multa->estado_pago === 'Anulada') {
            return response()->json(['message' => 'La multa ya estaba anulada.'], 422);
        }
        $multa->update(['estado_pago' => 'Anulada']);
        return response()->json(new MultaResource($multa->load('persona')));
    }
}
