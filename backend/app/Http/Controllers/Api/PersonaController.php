<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Persona;
use App\Models\ContactoPersona;
use App\Models\PerfilEducativoPersona;
use App\Models\TituloEducativo;
use App\Models\CondicionPersona;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class PersonaController extends Controller
{
    /**
     * Valida la Cédula Ecuatoriana (Módulo 10)
     */
    private function validarCedulaEcuatoriana($cedula)
    {
        if (strlen($cedula) !== 10) return false;
        
        $provincia = intval(substr($cedula, 0, 2));
        if ($provincia < 1 || $provincia > 24) return false;
        
        $tercerDigito = intval(substr($cedula, 2, 1));
        if ($tercerDigito >= 6) return false;
        
        $coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        $suma = 0;
        
        for ($i = 0; $i < 9; $i++) {
            $valor = intval($cedula[$i]) * $coeficientes[$i];
            if ($valor > 9) $valor -= 9;
            $suma += $valor;
        }
        
        $decenaSuperior = (int) (ceil($suma / 10) * 10);
        $digitoVerificador = $decenaSuperior - $suma;
        if ($digitoVerificador === 10) $digitoVerificador = 0;
        
        return $digitoVerificador === (int)$cedula[9];
    }
    /**
     * Búsqueda de comuneros (dueños) por cédula o apellido
     * GET /api/personas
     */
    public function buscar(Request $request): JsonResponse
    {
        $termino = $request->query('search', '');
        
        $query = DB::table('Persona as p')
            ->leftJoin('Sector as s', 'p.id_sector', '=', 's.id_sector')
            ->select('p.id_persona', 'p.cedula', 'p.nombre', 'p.apellido', 'p.estado_vital', 's.nombre_sector')
            ->whereNull('p.id_representante_familia');

        if (!empty($termino)) {
            $query->where(function($q) use ($termino) {
                $q->where('p.cedula', 'LIKE', '%' . $termino . '%')
                  ->orWhere('p.apellido', 'LIKE', '%' . $termino . '%')
                  ->orWhere('p.nombre', 'LIKE', '%' . $termino . '%');
            });
        }

        $personas = $query->limit(50)->get()->map(function($p) {
            return [
                'id' => $p->id_persona, // Retrocompatibilidad
                'id_persona' => $p->id_persona,
                'cedula' => $p->cedula,
                'nombre' => $p->nombre,
                'apellido' => $p->apellido,
                'nombre_completo' => trim($p->nombre . ' ' . $p->apellido),
                'sector' => $p->nombre_sector ? $p->nombre_sector : 'No Asignado',
                'rol' => 'Usuario',
                'estado' => $p->estado_vital === 'Fallecido' ? 'Suspendido' : 'Activo'
            ];
        });

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
            'cedula' => 'required|string|size:10|unique:Persona,cedula',
            'nombres' => 'required|string|max:100|regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/',
            'apellidos' => 'required|string|max:100|regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/',
            'fecha_nacimiento' => 'nullable|date',
            'id_genero' => 'nullable|integer',
            'tiene_condicion' => 'nullable|boolean',
            'condiciones' => 'nullable|array',
            'condiciones.*.id_condicion' => 'required_with:condiciones|integer',
            'condiciones.*.porcentaje' => 'nullable|numeric|min:0|max:100',
            'condiciones.*.codigo' => 'nullable|string',
            'condiciones.*.observacion' => 'nullable|string',
            'estado_vital' => 'nullable|in:Vivo,Fallecido',
            'id_sector' => 'nullable|integer',
            
            'contactos' => 'nullable|array',
            'contactos.*.id_tipo_contacto' => 'required_with:contactos|integer',
            'contactos.*.valor_contacto' => 'required_with:contactos|string|regex:/^[0-9A-Za-z@._-]+$/',
            'contactos.*.id_operadora' => 'nullable|integer',
            
            'nivel_educativo_principal' => 'nullable|integer',
            'carreras_principal' => 'nullable|array',
            
            'dependientes' => 'nullable|array',
        ]);

        if (!$this->validarCedulaEcuatoriana($data['cedula'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'La cédula ingresada no es válida para Ecuador.'
            ], 422);
        }

        try {
            DB::beginTransaction();

            // 1. Guardar Titular
            $titular = Persona::create([
                'cedula' => $data['cedula'],
                'nombre' => $data['nombres'],
                'apellido' => $data['apellidos'],
                'fecha_nacimiento' => $data['fecha_nacimiento'] ?? null,
                'id_genero' => $data['id_genero'] ?? null,
                'id_sector' => $data['id_sector'] ?? null,
                'estado_vital' => $data['estado_vital'] ?? 'Vivo',
            ]);

            // Guardar Condiciones Especiales
            if (!empty($data['tiene_condicion']) && !empty($data['condiciones'])) {
                foreach ($data['condiciones'] as $cond) {
                    CondicionPersona::create([
                        'id_persona' => $titular->id_persona,
                        'id_condicion' => $cond['id_condicion'],
                        'porcentaje_discapacidad' => $cond['porcentaje'] ?? null,
                        'codigo_carnet' => $cond['codigo'] ?? null,
                        'observacion' => $cond['observacion'] ?? null,
                    ]);
                }
            }

            // 2. Guardar Contactos del Titular
            if (!empty($data['contactos'])) {
                foreach ($data['contactos'] as $contacto) {
                    if (!empty($contacto['valor_contacto'])) {
                        ContactoPersona::create([
                            'id_persona' => $titular->id_persona,
                            'id_tipo_contacto' => $contacto['id_tipo_contacto'],
                            'valor_contacto' => $contacto['valor_contacto'],
                            'id_operadora' => $contacto['id_operadora'] ?? null,
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

    /**
     * Obtener una persona y sus relaciones para editar
     */
    public function show($id): JsonResponse
    {
        try {
            $persona = Persona::with([
                'condiciones',
                'contactos',
                'perfilEducativo.titulo',
                'dependientes.perfilEducativo.titulo'
            ])->findOrFail($id);

            $tiene_condicion = $persona->condiciones->count() > 0;
            
            $condiciones = $persona->condiciones->map(function($c) {
                return [
                    'id_condicion' => (string) $c->id_condicion,
                    'porcentaje' => $c->porcentaje_discapacidad,
                    'codigo' => $c->codigo_carnet,
                    'observacion' => $c->observacion
                ];
            })->toArray();

            $contactos = $persona->contactos->map(function($c) {
                return [
                    'id_tipo_contacto' => (string) $c->id_tipo_contacto,
                    'valor_contacto' => $c->valor_contacto,
                    'id_operadora' => $c->id_operadora ? (string) $c->id_operadora : ''
                ];
            })->toArray();
            
            if (empty($contactos)) {
                $contactos = [['id_tipo_contacto' => '1', 'valor_contacto' => '', 'id_operadora' => '']];
            }

            $carreras_principal = $persona->perfilEducativo->map(function($p) {
                return ['nombre' => $p->titulo ? $p->titulo->nombre : ''];
            })->filter(function($c) { return !empty($c['nombre']); })->values()->toArray();

            $nivel_educativo_principal = count($carreras_principal) > 0 ? '3' : '1';

            $dependientes = $persona->dependientes->map(function($d) {
                $carreras = $d->perfilEducativo->map(function($p) {
                    return ['nombre' => $p->titulo ? $p->titulo->nombre : ''];
                })->filter(function($c) { return !empty($c['nombre']); })->values()->toArray();
                
                return [
                    'id_persona' => $d->id_persona,
                    'nombres' => $d->nombre,
                    'apellidos' => $d->apellido,
                    'cedula' => $d->cedula,
                    'id_genero' => (string) $d->id_genero,
                    'nivel_educativo' => count($carreras) > 0 ? '3' : '1',
                    'carreras' => $carreras
                ];
            })->toArray();

            // Mock Zonas (hasta tener tabla)
            $sectoresMock = [
                1=>1, 2=>1, 3=>1, 4=>1, 5=>1,
                6=>2, 7=>2, 8=>2, 9=>2, 10=>2,
                11=>3, 12=>3, 13=>3, 14=>3, 15=>3,
                16=>4, 17=>4, 18=>4, 19=>4, 20=>4
            ];
            $id_zona = isset($sectoresMock[$persona->id_sector]) ? (string)$sectoresMock[$persona->id_sector] : '';

            $data = [
                'id_persona' => $persona->id_persona,
                'cedula' => $persona->cedula,
                'fecha_nacimiento' => $persona->fecha_nacimiento,
                'nombres' => $persona->nombre,
                'apellidos' => $persona->apellido,
                'id_genero' => (string) $persona->id_genero,
                'id_zona' => $id_zona,
                'id_sector' => (string) $persona->id_sector,
                'nivel_educativo_principal' => $nivel_educativo_principal,
                'tiene_condicion' => $tiene_condicion,
                'condiciones' => $condiciones,
                'contactos' => $contactos,
                'carreras_principal' => $carreras_principal,
                'numero_hijos' => count($dependientes),
                'dependientes' => $dependientes
            ];

            return response()->json([
                'status' => 'success',
                'data' => $data
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Usuario no encontrado'], 404);
        }
    }

    /**
     * Actualiza al titular y a sus dependientes en bloque (Transacción DB)
     */
    public function update(Request $request, $id): JsonResponse
    {
        $data = $request->validate([
            'cedula' => 'required|string|size:10|unique:Persona,cedula,' . $id . ',id_persona',
            'nombres' => 'required|string|max:100|regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/',
            'apellidos' => 'required|string|max:100|regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/',
            'fecha_nacimiento' => 'nullable|date',
            'id_genero' => 'nullable|integer',
            'tiene_condicion' => 'nullable|boolean',
            'condiciones' => 'nullable|array',
            'condiciones.*.id_condicion' => 'required_with:condiciones|integer',
            'condiciones.*.porcentaje' => 'nullable|numeric|min:0|max:100',
            'condiciones.*.codigo' => 'nullable|string',
            'condiciones.*.observacion' => 'nullable|string',
            'estado_vital' => 'nullable|in:Vivo,Fallecido',
            'id_sector' => 'nullable|integer',
            
            'contactos' => 'nullable|array',
            'contactos.*.id_tipo_contacto' => 'required_with:contactos|integer',
            'contactos.*.valor_contacto' => 'required_with:contactos|string',
            'contactos.*.id_operadora' => 'nullable|integer',
            
            'nivel_educativo_principal' => 'nullable|integer',
            'carreras_principal' => 'nullable|array',
            
            'dependientes' => 'nullable|array',
        ]);

        if (!$this->validarCedulaEcuatoriana($data['cedula'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'La cédula ingresada no es válida para Ecuador.'
            ], 422);
        }

        try {
            DB::beginTransaction();

            $titular = Persona::findOrFail($id);
            $titular->update([
                'cedula' => $data['cedula'],
                'nombre' => $data['nombres'],
                'apellido' => $data['apellidos'],
                'fecha_nacimiento' => $data['fecha_nacimiento'] ?? null,
                'id_genero' => $data['id_genero'] ?? null,
                'id_sector' => $data['id_sector'] ?? null,
                'estado_vital' => $data['estado_vital'] ?? 'Vivo',
            ]);

            // Sync Condiciones
            CondicionPersona::where('id_persona', $id)->delete();
            if (!empty($data['tiene_condicion']) && !empty($data['condiciones'])) {
                foreach ($data['condiciones'] as $cond) {
                    CondicionPersona::create([
                        'id_persona' => $id,
                        'id_condicion' => $cond['id_condicion'],
                        'porcentaje_discapacidad' => $cond['porcentaje'] ?? null,
                        'codigo_carnet' => $cond['codigo'] ?? null,
                        'observacion' => $cond['observacion'] ?? null,
                    ]);
                }
            }

            // Sync Contactos
            ContactoPersona::where('id_persona', $id)->delete();
            if (!empty($data['contactos'])) {
                foreach ($data['contactos'] as $contacto) {
                    if (!empty($contacto['valor_contacto'])) {
                        ContactoPersona::create([
                            'id_persona' => $id,
                            'id_tipo_contacto' => $contacto['id_tipo_contacto'],
                            'valor_contacto' => $contacto['valor_contacto'],
                            'id_operadora' => $contacto['id_operadora'] ?? null,
                            'es_principal' => 1
                        ]);
                    }
                }
            }

            // Sync Perfil Educativo Titular
            PerfilEducativoPersona::where('id_persona', $id)->delete();
            if (!empty($data['carreras_principal'])) {
                foreach ($data['carreras_principal'] as $carrera) {
                    if (!empty($carrera['nombre'])) {
                        $tituloInfo = TituloEducativo::where('nombre', $carrera['nombre'])->first();
                        if ($tituloInfo) {
                            PerfilEducativoPersona::create([
                                'id_persona' => $id,
                                'codigo_titulo_cine' => $tituloInfo->codigo,
                                'estado_estudio' => 'Finalizado'
                            ]);
                        }
                    }
                }
            }

            // Sync Dependientes
            $incomingDependientes = $data['dependientes'] ?? [];
            $incomingIds = collect($incomingDependientes)->pluck('id_persona')->filter()->toArray();
            
            // Eliminar dependientes que ya no están
            Persona::where('id_representante_familia', $id)
                ->whereNotIn('id_persona', $incomingIds)
                ->delete();

            foreach ($incomingDependientes as $dep) {
                if (!empty($dep['nombres']) && !empty($dep['apellidos'])) {
                    if (!empty($dep['id_persona'])) {
                        $dependiente = Persona::find($dep['id_persona']);
                        if ($dependiente) {
                            $dependiente->update([
                                'cedula' => !empty($dep['cedula']) ? $dep['cedula'] : null,
                                'nombre' => $dep['nombres'],
                                'apellido' => $dep['apellidos'],
                                'id_genero' => $dep['id_genero'] ?? null,
                            ]);
                        }
                    } else {
                        $dependiente = Persona::create([
                            'cedula' => !empty($dep['cedula']) ? $dep['cedula'] : null,
                            'nombre' => $dep['nombres'],
                            'apellido' => $dep['apellidos'],
                            'id_genero' => $dep['id_genero'] ?? null,
                            'id_representante_familia' => $id,
                            'estado_vital' => 'Vivo',
                        ]);
                    }

                    if ($dependiente) {
                        PerfilEducativoPersona::where('id_persona', $dependiente->id_persona)->delete();
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
                'message' => 'Usuario y familia actualizados correctamente.',
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Error al actualizar en la base de datos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar Persona lógicamente (Fallecido o Suspendido) o físicamente si no tiene dependencias críticas
     */
    public function destroy($id): JsonResponse
    {
        try {
            $persona = Persona::findOrFail($id);
            // Podríamos borrar dependientes, pero de momento borrado físico si no viola llaves
            $persona->delete();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Usuario eliminado correctamente'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'No se puede eliminar el usuario. Es posible que tenga registros asociados.'
            ], 400);
        }
    }
}
