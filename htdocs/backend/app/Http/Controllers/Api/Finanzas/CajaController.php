<?php
declare(strict_types=1);
namespace App\Http\Controllers\Api\Finanzas;

use App\Http\Controllers\Controller;
use App\Http\Requests\Finanzas\StoreCajaRequest;
use App\Http\Resources\Finanzas\CajaResource;
use App\Models\CajaComunitaria;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Tag(name="Finanzas - Caja", description="Movimientos de caja comunitaria")
 */
class CajaController extends Controller
{
    /** @OA\Get(path="/api/finanzas/caja", tags={"Finanzas - Caja"}, security={{"sanctum":{}}},
     *  summary="Listar movimientos de caja",
     *  @OA\Parameter(name="tipo_movimiento", in="query", @OA\Schema(type="string", enum={"Ingreso","Egreso"})),
     *  @OA\Parameter(name="fecha_desde", in="query", @OA\Schema(type="string", format="date")),
     *  @OA\Parameter(name="fecha_hasta", in="query", @OA\Schema(type="string", format="date")),
     *  @OA\Response(response=200, description="Lista paginada")) */
    public function index(Request $request): JsonResponse
    {
        $movimientos = CajaComunitaria::with(['multa', 'responsable'])
            ->when($request->tipo_movimiento, fn($q, $v) => $q->where('tipo_movimiento', $v))
            ->when($request->fecha_desde,     fn($q, $v) => $q->whereDate('id_transaccion', '>=', $v))
            ->when($request->fecha_hasta,     fn($q, $v) => $q->whereDate('id_transaccion', '<=', $v))
            ->orderByDesc('id_transaccion')
            ->paginate(15);

        return response()->json(CajaResource::collection($movimientos));
    }

    /** @OA\Post(path="/api/finanzas/caja", tags={"Finanzas - Caja"}, security={{"sanctum":{}}},
     *  summary="Registrar movimiento de caja",
     *  @OA\Response(response=201, description="Movimiento registrado")) */
    public function store(StoreCajaRequest $request): JsonResponse
    {
        $movimiento = CajaComunitaria::create(array_merge(
            $request->validated(),
            ['responsable_registro' => $request->user()->id_usuario]
        ));

        return response()->json(
            new CajaResource($movimiento->load(['multa', 'responsable'])),
            201
        );
    }

    /** @OA\Get(path="/api/finanzas/caja/{id}", tags={"Finanzas - Caja"}, security={{"sanctum":{}}},
     *  summary="Ver movimiento de caja",
     *  @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *  @OA\Response(response=200, description="Detalle")) */
    public function show(int $id): JsonResponse
    {
        return response()->json(
            new CajaResource(CajaComunitaria::with(['multa', 'responsable'])->findOrFail($id))
        );
    }

    /** @OA\Get(path="/api/finanzas/caja/resumen", tags={"Finanzas - Caja"}, security={{"sanctum":{}}},
     *  summary="Resumen de ingresos vs egresos",
     *  @OA\Response(response=200, description="Resumen financiero")) */
    public function resumen(): JsonResponse
    {
        $ingresos = CajaComunitaria::where('tipo_movimiento', 'Ingreso')->sum('monto');
        $egresos  = CajaComunitaria::where('tipo_movimiento', 'Egreso')->sum('monto');

        return response()->json([
            'ingresos' => round($ingresos, 2),
            'egresos'  => round($egresos, 2),
            'saldo'    => round($ingresos - $egresos, 2),
        ]);
    }
}
