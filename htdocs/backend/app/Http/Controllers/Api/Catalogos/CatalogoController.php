<?php
declare(strict_types=1);
namespace App\Http\Controllers\Api\Catalogos;

use App\Http\Controllers\Controller;
use App\Http\Resources\Catalogo\ZonaResource;
use App\Models\CatalogoCargoDirectivo;
use App\Models\CatalogoCondicionEspecial;
use App\Models\CatalogoEstadoConstruccion;
use App\Models\CatalogoNivelAcademico;
use App\Models\CatalogoTipoContacto;
use App\Models\CatalogoTituloEducativo;
use App\Models\Zona;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Tag(name="Catálogos", description="Catálogos dinámicos del sistema")
 */
class CatalogoController extends Controller
{
    // ── Zonas ─────────────────────────────────────────────────────────────────

    /** @OA\Get(path="/api/catalogos/zonas", tags={"Catálogos"}, security={{"sanctum":{}}}, summary="Listar zonas",
     *  @OA\Response(response=200, description="Lista de zonas")) */
    public function zonas(): JsonResponse
    {
        return response()->json(ZonaResource::collection(Zona::orderBy('nombre_zona')->get()));
    }

    /** @OA\Post(path="/api/catalogos/zonas", tags={"Catálogos"}, security={{"sanctum":{}}}, summary="Crear zona",
     *  @OA\Response(response=201, description="Zona creada")) */
    public function storeZona(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nombre_zona' => ['required','string','max:100','unique:zona,nombre_zona'],
            'descripcion' => ['nullable','string'],
        ]);
        return response()->json(new ZonaResource(Zona::create($data)), 201);
    }

    /** @OA\Put(path="/api/catalogos/zonas/{id}", tags={"Catálogos"}, security={{"sanctum":{}}}, summary="Actualizar zona",
     *  @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *  @OA\Response(response=200, description="Zona actualizada")) */
    public function updateZona(Request $request, int $id): JsonResponse
    {
        $zona = Zona::findOrFail($id);
        $data = $request->validate([
            'nombre_zona' => ['sometimes','string','max:100',"unique:zona,nombre_zona,{$id},id_zona"],
            'descripcion' => ['nullable','string'],
        ]);
        $zona->update($data);
        return response()->json(new ZonaResource($zona));
    }

    /** @OA\Delete(path="/api/catalogos/zonas/{id}", tags={"Catálogos"}, security={{"sanctum":{}}}, summary="Eliminar zona",
     *  @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *  @OA\Response(response=200, description="Zona eliminada")) */
    public function destroyZona(int $id): JsonResponse
    {
        Zona::findOrFail($id)->delete();
        return response()->json(['message' => 'Zona eliminada.']);
    }

    // ── Condiciones Especiales ────────────────────────────────────────────────

    /** @OA\Get(path="/api/catalogos/condiciones", tags={"Catálogos"}, security={{"sanctum":{}}}, summary="Listar condiciones especiales",
     *  @OA\Response(response=200, description="OK")) */
    public function condiciones(): JsonResponse
    {
        return response()->json(CatalogoCondicionEspecial::orderBy('nombre_condicion')->get());
    }

    /** @OA\Post(path="/api/catalogos/condiciones", tags={"Catálogos"}, security={{"sanctum":{}}}, summary="Crear condición especial",
     *  @OA\Response(response=201, description="Creada")) */
    public function storeCondicion(Request $request): JsonResponse
    {
        $data = $request->validate(['nombre_condicion' => ['required','string','max:100','unique:catalogo_condicion_especial,nombre_condicion']]);
        return response()->json(CatalogoCondicionEspecial::create($data), 201);
    }

    // ── Cargos Directivos ─────────────────────────────────────────────────────

    /** @OA\Get(path="/api/catalogos/cargos-directivos", tags={"Catálogos"}, security={{"sanctum":{}}}, summary="Listar cargos directivos",
     *  @OA\Response(response=200, description="OK")) */
    public function cargosDirectivos(): JsonResponse
    {
        return response()->json(CatalogoCargoDirectivo::orderBy('nombre_cargo')->get());
    }

    /** @OA\Post(path="/api/catalogos/cargos-directivos", tags={"Catálogos"}, security={{"sanctum":{}}}, summary="Crear cargo directivo",
     *  @OA\Response(response=201, description="Creado")) */
    public function storeCargoDirectivo(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nombre_cargo' => ['required','string','max:100','unique:catalogo_cargo_directivo,nombre_cargo'],
            'descripcion'  => ['nullable','string'],
        ]);
        return response()->json(CatalogoCargoDirectivo::create($data), 201);
    }

    // ── Tipos de Contacto ─────────────────────────────────────────────────────

    /** @OA\Get(path="/api/catalogos/tipos-contacto", tags={"Catálogos"}, security={{"sanctum":{}}}, summary="Listar tipos de contacto",
     *  @OA\Response(response=200, description="OK")) */
    public function tiposContacto(): JsonResponse
    {
        return response()->json(CatalogoTipoContacto::orderBy('nombre_tipo')->get());
    }

    // ── Estados de Construcción ───────────────────────────────────────────────

    /** @OA\Get(path="/api/catalogos/estados-construccion", tags={"Catálogos"}, security={{"sanctum":{}}}, summary="Listar estados de construcción",
     *  @OA\Response(response=200, description="OK")) */
    public function estadosConstruccion(): JsonResponse
    {
        return response()->json(CatalogoEstadoConstruccion::orderBy('nombre_estado')->get());
    }

    // ── Niveles Académicos ────────────────────────────────────────────────────

    /** @OA\Get(path="/api/catalogos/niveles-academicos", tags={"Catálogos"}, security={{"sanctum":{}}}, summary="Listar niveles académicos",
     *  @OA\Response(response=200, description="OK")) */
    public function nivelesAcademicos(): JsonResponse
    {
        return response()->json(CatalogoNivelAcademico::orderBy('id_nivel_academico')->get());
    }

    // ── Títulos CINE ──────────────────────────────────────────────────────────

    /** @OA\Get(path="/api/catalogos/titulos", tags={"Catálogos"}, security={{"sanctum":{}}}, summary="Buscar títulos educativos CINE",
     *  @OA\Parameter(name="search", in="query", @OA\Schema(type="string")),
     *  @OA\Parameter(name="id_nivel_academico", in="query", @OA\Schema(type="integer")),
     *  @OA\Response(response=200, description="OK")) */
    public function titulos(Request $request): JsonResponse
    {
        $query = CatalogoTituloEducativo::with('nivelAcademico')
            ->when($request->search, fn($q, $s) => $q->where('nombre', 'like', "%{$s}%"))
            ->when($request->id_nivel_academico, fn($q, $v) => $q->where('id_nivel_academico', $v))
            ->orderBy('nombre')
            ->limit(50);

        return response()->json($query->get());
    }
}
