<?php
declare(strict_types=1);
namespace App\Http\Controllers\Api\Personas;

use App\Http\Controllers\Controller;
use App\Http\Requests\Persona\StorePersonaRequest;
use App\Http\Requests\Persona\UpdatePersonaRequest;
use App\Http\Resources\Persona\PersonaResource;
use App\Models\ContactoPersona;
use App\Models\Persona;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * @OA\Tag(name="Personas", description="Gestión de personas del padrón")
 */
class PersonaController extends Controller
{
    /**
     * @OA\Get(path="/api/personas", tags={"Personas"}, security={{"sanctum":{}}},
     *     summary="Listar personas con filtros",
     *     @OA\Parameter(name="search", in="query", description="Buscar por cédula, nombre o apellido", @OA\Schema(type="string")),
     *     @OA\Parameter(name="id_zona", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="id_condicion_especial", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="estado_vital", in="query", @OA\Schema(type="string", enum={"Vivo","Fallecido"})),
     *     @OA\Response(response=200, description="Lista paginada de personas")
     * )
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Persona::with(['zona', 'condicionEspecial'])
            ->when($request->search, fn($q, $s) =>
                $q->where(fn($q) =>
                    $q->where('cedula', 'like', "%{$s}%")
                      ->orWhere('nombre', 'like', "%{$s}%")
                      ->orWhere('apellido', 'like', "%{$s}%")
                )
            )
            ->when($request->id_zona, fn($q, $v) => $q->where('id_zona', $v))
            ->when($request->id_condicion_especial, fn($q, $v) => $q->where('id_condicion_especial', $v))
            ->when($request->estado_vital, fn($q, $v) => $q->where('estado_vital', $v))
            ->orderBy('apellido')
            ->orderBy('nombre');

        return PersonaResource::collection($query->paginate(15));
    }

    /**
     * @OA\Post(path="/api/personas", tags={"Personas"}, security={{"sanctum":{}}},
     *     summary="Registrar nueva persona",
     *     @OA\RequestBody(required=true,
     *         @OA\JsonContent(required={"cedula","nombre","apellido"},
     *             @OA\Property(property="cedula", type="string", example="1804567890"),
     *             @OA\Property(property="nombre", type="string", example="Juan"),
     *             @OA\Property(property="apellido", type="string", example="Pérez"),
     *             @OA\Property(property="fecha_nacimiento", type="string", format="date"),
     *             @OA\Property(property="id_zona", type="integer"),
     *             @OA\Property(property="id_condicion_especial", type="integer"),
     *             @OA\Property(property="contactos", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(response=201, description="Persona creada")
     * )
     */
    public function store(StorePersonaRequest $request): JsonResponse
    {
        $persona = Persona::create($request->safe()->except('contactos'));

        if ($request->has('contactos')) {
            foreach ($request->contactos as $contacto) {
                $persona->contactos()->create($contacto);
            }
        }

        return response()->json(
            new PersonaResource($persona->load(['zona', 'condicionEspecial', 'contactos.tipoContacto'])),
            201
        );
    }

    /**
     * @OA\Get(path="/api/personas/{id}", tags={"Personas"}, security={{"sanctum":{}}},
     *     summary="Ver detalle completo de una persona",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Detalle de la persona")
     * )
     */
    public function show(int $id): JsonResponse
    {
        $persona = Persona::with([
            'zona', 'condicionEspecial', 'representanteFamilia',
            'contactos.tipoContacto', 'terrenos.estadoConstruccion',
            'multas', 'cargoDirectiva.cargo',
        ])->findOrFail($id);

        return response()->json(new PersonaResource($persona));
    }

    /**
     * @OA\Put(path="/api/personas/{id}", tags={"Personas"}, security={{"sanctum":{}}},
     *     summary="Actualizar datos de una persona",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Persona actualizada")
     * )
     */
    public function update(UpdatePersonaRequest $request, int $id): JsonResponse
    {
        $persona = Persona::findOrFail($id);
        $persona->update($request->validated());

        return response()->json(
            new PersonaResource($persona->load(['zona', 'condicionEspecial', 'contactos.tipoContacto']))
        );
    }

    /**
     * @OA\Delete(path="/api/personas/{id}", tags={"Personas"}, security={{"sanctum":{}}},
     *     summary="Eliminar persona",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Persona eliminada")
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        $persona = Persona::findOrFail($id);
        $persona->delete();
        return response()->json(['message' => 'Persona eliminada correctamente.']);
    }

    // ── Contactos de una persona ──────────────────────────────────────────────

    /**
     * @OA\Post(path="/api/personas/{id}/contactos", tags={"Personas"}, security={{"sanctum":{}}},
     *     summary="Agregar contacto a una persona",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=201, description="Contacto agregado")
     * )
     */
    public function storeContacto(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'id_tipo_contacto'    => ['required','integer','exists:catalogo_tipo_contacto,id_tipo_contacto'],
            'valor_contacto'      => ['required','string','max:150'],
            'operadora_o_detalle' => ['nullable','string','max:50'],
            'es_principal'        => ['nullable','boolean'],
        ]);

        $persona = Persona::findOrFail($id);

        if ($request->boolean('es_principal')) {
            $persona->contactos()->update(['es_principal' => false]);
        }

        $contacto = $persona->contactos()->create($request->all());
        return response()->json($contacto->load('tipoContacto'), 201);
    }

    /**
     * @OA\Delete(path="/api/personas/{id}/contactos/{contactoId}", tags={"Personas"}, security={{"sanctum":{}}},
     *     summary="Eliminar contacto de una persona",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="contactoId", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Contacto eliminado")
     * )
     */
    public function destroyContacto(int $id, int $contactoId): JsonResponse
    {
        $contacto = ContactoPersona::where('id_persona', $id)->findOrFail($contactoId);
        $contacto->delete();
        return response()->json(['message' => 'Contacto eliminado.']);
    }
}
