<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Persona;
use App\Models\ContactoPersona;
use App\Models\PerfilEducativoPersona;
use App\Models\TituloEducativo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class PersonaController extends Controller
{
    /**
     * Búsqueda de comuneros (dueños) por cédula o apellido
     * GET /api/personas
     */
    public function buscar(Request $request): JsonResponse
    {
        $termino = $request->query('search', '');
        
        $query = Persona::query()
            ->select('id_persona', 'cedula', 'nombre', 'apellido')
            ->whereNull('id_representante_familia'); // Solo titulares, no dependientes

        if (!empty($termino)) {
            $query->where(function($q) use ($termino) {
                $q->where('cedula', 'LIKE', '%' . $termino . '%')
                  ->orWhere('apellido', 'LIKE', '%' . $termino . '%')
                  ->orWhere('nombre', 'LIKE', '%' . $termino . '%');
            });
        }

        $personas = $query->limit(10)->get();

        return response()->json([
            'status' => 'ok',
            'data'   => $personas
        ]);
    }

    /**
     * Registra al titular y a sus dependientes en bloque (Transacción DB)
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'cedula' => 'required|string|unique:Persona,cedula',
            'nombres' => 'required|string|max:100',
            'apellidos' => 'required|string|max:100',
            'fecha_nacimiento' => 'nullable|date',
            'id_genero' => 'nullable|integer',
            'id_condicion_especial' => 'nullable|integer',
            'estado_vital' => 'nullable|in:Vivo,Fallecido',
            'sector' => 'nullable|integer', // id_sector
            
            'contactos' => 'nullable|array',
            'contactos.*.id_tipo_contacto' => 'required_with:contactos|integer',
            'contactos.*.valor_contacto' => 'required_with:contactos|string',
            
            'nivel_educativo_principal' => 'nullable|integer',
            'carreras_principal' => 'nullable|array',
            
            'dependientes' => 'nullable|array',
        ]);

        try {
            DB::beginTransaction();

            // 1. Guardar Titular
            $titular = Persona::create([
                'cedula' => $data['cedula'],
                'nombre' => $data['nombres'],
                'apellido' => $data['apellidos'],
                'fecha_nacimiento' => $data['fecha_nacimiento'] ?? null,
                'id_genero' => $data['id_genero'] ?? null,
                'id_sector' => $data['sector'] ?? null,
                'id_condicion_especial' => $data['id_condicion_especial'] ?? 1,
                'estado_vital' => $data['estado_vital'] ?? 'Vivo',
            ]);

            // 2. Guardar Contactos del Titular
            if (!empty($data['contactos'])) {
                foreach ($data['contactos'] as $contacto) {
                    if (!empty($contacto['valor_contacto'])) {
                        ContactoPersona::create([
                            'id_persona' => $titular->id_persona,
                            'id_tipo_contacto' => $contacto['id_tipo_contacto'],
                            'valor_contacto' => $contacto['valor_contacto'],
                            'es_principal' => 1
                        ]);
                    }
                }
            }

            // 3. Guardar Títulos del Titular
            if (!empty($data['carreras_principal'])) {
                foreach ($data['carreras_principal'] as $carrera) {
                    if (!empty($carrera['nombre'])) {
                        // Buscar el código del título en el catálogo
                        $tituloInfo = TituloEducativo::where('nombre', $carrera['nombre'])->first();
                        if ($tituloInfo) {
                            PerfilEducativoPersona::create([
                                'id_persona' => $titular->id_persona,
                                'codigo_titulo_cine' => $tituloInfo->codigo,
                                'estado_estudio' => 'Finalizado'
                            ]);
                        }
                    }
                }
            }

            // 4. Guardar Dependientes (Hijos)
            if (!empty($data['dependientes'])) {
                foreach ($data['dependientes'] as $dep) {
                    if (!empty($dep['nombres']) && !empty($dep['apellidos'])) {
                        $dependiente = Persona::create([
                            'cedula' => !empty($dep['cedula']) ? $dep['cedula'] : null,
                            'nombre' => $dep['nombres'],
                            'apellido' => $dep['apellidos'],
                            'id_genero' => $dep['id_genero'] ?? null,
                            'id_representante_familia' => $titular->id_persona,
                            'id_condicion_especial' => 1,
                            'estado_vital' => 'Vivo',
                        ]);

                        // Guardar Títulos del Dependiente
                        if (!empty($dep['carreras'])) {
                            foreach ($dep['carreras'] as $carreraDep) {
                                if (!empty($carreraDep['nombre'])) {
                                    $tituloInfo = TituloEducativo::where('nombre', $carreraDep['nombre'])->first();
                                    if ($tituloInfo) {
                                        PerfilEducativoPersona::create([
                                            'id_persona' => $dependiente->id_persona,
                                            'codigo_titulo_cine' => $tituloInfo->codigo,
                                            'estado_estudio' => 'Finalizado'
                                        ]);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Usuario y familia registrados correctamente.',
                'data' => $titular
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Error al guardar en la base de datos: ' . $e->getMessage()
            ], 500);
        }
    }
}
