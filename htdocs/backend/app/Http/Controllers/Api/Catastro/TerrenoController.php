<?php
declare(strict_types=1);
namespace App\Http\Controllers\Api\Catastro;

use App\Http\Controllers\Controller;
use App\Http\Requests\Catastro\StoreTerrenoRequest;
use App\Http\Resources\Catastro\TerrenoResource;
use App\Models\Terreno;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Tag(name="Catastro", description="Gestión de terrenos")
 */
class TerrenoController extends Controller
{
    /** @OA\Get(path="/api/catastro/terrenos", tags={"Catastro"}, security={{"sanctum":{}}},
     *  summary="Listar terrenos con filtros",
     *  @OA\Parameter(name="search", in="query", description="Buscar por clave catastral", @OA\Schema(type="string")),
     *  @OA\Parameter(name="id_estado_construccion", in="query", @OA\Schema(type="integer")),
     *  @OA\Response(response=200, description="Lista paginada")) */
    public function index(Request $request): JsonResponse
    {
        $terrenos = Terreno::with(['persona', 'estadoConstruccion'])
            ->when($request->search, fn($q, $s) => $q->where('clave_catastral', 'like', "%{$s}%"))
            ->when($request->id_estado_construccion, fn($q, $v) => $q->where('id_estado_construccion', $v))
            ->when($request->id_persona, fn($q, $v) => $q->where('id_persona', $v))
            ->orderBy('clave_catastral')
            ->paginate(15);

        return response()->json(TerrenoResource::collection($terrenos));
    }

    /** @OA\Post(path="/api/catastro/terrenos", tags={"Catastro"}, security={{"sanctum":{}}},
     *  summary="Registrar nuevo terreno",
     *  @OA\Response(response=201, description="Terreno registrado")) */
    public function store(StoreTerrenoRequest $request): JsonResponse
    {
        $terreno = Terreno::create($request->validated());
        return response()->json(
            new TerrenoResource($terreno->load(['persona', 'estadoConstruccion'])),
            201
        );
    }

    /** @OA\Get(path="/api/catastro/terrenos/{id}", tags={"Catastro"}, security={{"sanctum":{}}},
     *  summary="Ver terreno",
     *  @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *  @OA\Response(response=200, description="Detalle del terreno")) */
    public function show(int $id): JsonResponse
    {
        $terreno = Terreno::with(['persona', 'estadoConstruccion'])->findOrFail($id);
        return response()->json(new TerrenoResource($terreno));
    }

    /** @OA\Put(path="/api/catastro/terrenos/{id}", tags={"Catastro"}, security={{"sanctum":{}}},
     *  summary="Actualizar terreno",
     *  @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *  @OA\Response(response=200, description="Terreno actualizado")) */
    public function update(Request $request, int $id): JsonResponse
    {
        $terreno = Terreno::findOrFail($id);
        $data = $request->validate([
            'clave_catastral'        => ['sometimes','string','max:50',"unique:terreno,clave_catastral,{$id},id_terreno"],
            'area_total'             => ['sometimes','numeric','min:0.01'],
            'id_estado_construccion' => ['nullable','integer','exists:catalogo_estado_construccion,id_estado_construccion'],
            'id_persona'             => ['sometimes','integer','exists:persona,id_persona'],
        ]);
        $terreno->update($data);
        return response()->json(new TerrenoResource($terreno->load(['persona', 'estadoConstruccion'])));
    }

    /** @OA\Delete(path="/api/catastro/terrenos/{id}", tags={"Catastro"}, security={{"sanctum":{}}},
     *  summary="Eliminar terreno",
     *  @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *  @OA\Response(response=200, description="Terreno eliminado")) */
    public function destroy(int $id): JsonResponse
    {
        Terreno::findOrFail($id)->delete();
        return response()->json(['message' => 'Terreno eliminado.']);
    }
}
