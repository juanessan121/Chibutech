<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Terreno;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Exception;

class TerrenoController extends Controller
{
    /**
     * Obtiene el listado completo de predios/terrenos con sus relaciones
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $busqueda = trim($request->query('busqueda', ''));

            $query = DB::table('Terreno as t')
                ->join('Persona as p', 't.id_persona', '=', 'p.id_persona')
                ->leftJoin('Sector as s', 'p.id_sector', '=', 's.id_sector')
                ->leftJoin('Zona as z', 's.id_zona', '=', 'z.id_zona')
                ->join('Catalogo_Estado_Construccion as cec', 't.id_estado_construccion', '=', 'cec.id_estado_construccion')
                ->leftJoin(DB::raw(
                    '(SELECT ct.id_terreno, COUNT(*) as total_copros,
                      GROUP_CONCAT(CONCAT(cp.nombre," ",cp.apellido) SEPARATOR ", ") as nombres_copros
                      FROM Copropietario_Terreno ct
                      JOIN Persona cp ON ct.id_persona = cp.id_persona
                      GROUP BY ct.id_terreno) as coprodata'
                ), 'coprodata.id_terreno', '=', 't.id_terreno')
                ->select(
                    't.id_terreno',
                    DB::raw("CONCAT(p.nombre, ' ', p.apellido) as propietario"),
                    'p.cedula',
                    'z.nombre_zona as zona',
                    's.nombre_sector as sector',
                    'cec.nombre_estado as estado_construccion',
                    't.area_total as area_m2',
                    't.latitud',
                    't.longitud',
                    't.url_planimetria',
                    DB::raw('COALESCE(coprodata.total_copros, 0) as total_copropietarios'),
                    'coprodata.nombres_copros'
                );

            if ($busqueda !== '') {
                $like = '%' . $busqueda . '%';
                $query->where(function ($w) use ($like) {
                    $w->whereRaw("CONCAT(p.nombre, ' ', p.apellido) LIKE ?", [$like])
                      ->orWhere('p.cedula', 'like', $like)
                      ->orWhere('z.nombre_zona', 'like', $like)
                      ->orWhere('s.nombre_sector', 'like', $like);
                });
            }

            $paginated = $query->paginate(50);

            // Resumen global por estado — siempre refleja toda la tabla, no solo la página actual
            $resumenEstados = DB::table('Terreno as t')
                ->join('Catalogo_Estado_Construccion as cec', 't.id_estado_construccion', '=', 'cec.id_estado_construccion')
                ->select('cec.nombre_estado', DB::raw('COUNT(*) as total'))
                ->groupBy('cec.nombre_estado')
                ->pluck('total', 'nombre_estado');

            return response()->json([
                'status'          => 'success',
                'data'            => $paginated->items(),
                'pagination'      => [
                    'total'        => $paginated->total(),
                    'per_page'     => $paginated->perPage(),
                    'current_page' => $paginated->currentPage(),
                    'last_page'    => $paginated->lastPage(),
                ],
                'resumen_estados' => $resumenEstados,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Error al obtener catastro: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Registra múltiples terrenos para un dueño
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id_persona' => 'required|integer|exists:Persona,id_persona',
            'terrenos' => 'required|array',
            'terrenos.*.clave_catastral' => 'required|string|regex:/^\d{2}-\d{2}-\d{2}-\d{2}-\d{3}-\d{3}$/|unique:Terreno,clave_catastral',
            'terrenos.*.area' => 'required|numeric|min:0.01',
            'terrenos.*.latitud' => 'nullable|numeric',
            'terrenos.*.longitud' => 'nullable|numeric',
            'terrenos.*.estado_terreno' => 'required|string',
            'terrenos.*.archivo_escritura_base64' => 'nullable|string'
        ], [
            'terrenos.*.clave_catastral.unique' => 'La Clave Catastral ingresada ya se encuentra registrada en otro terreno.',
            'terrenos.*.clave_catastral.required' => 'La Clave Catastral es obligatoria.',
            'terrenos.*.area.required' => 'El área del terreno es obligatoria.'
        ]);

        try {
            DB::beginTransaction();


            foreach ($data['terrenos'] as $t) {
                $rutaArchivo = null;
                if (!empty($t['archivo_escritura_base64'])) {
                    // Extraer los datos y la extensión
                    $base64data = substr($t['archivo_escritura_base64'], strpos($t['archivo_escritura_base64'], ',') + 1);
                    $base64data = base64_decode($base64data);
                    
                    // Determinar extensión simple (asumiendo que viene en mime type)
                    $extension = 'pdf'; // Por defecto
                    if (str_contains(substr($t['archivo_escritura_base64'], 0, 30), 'image/jpeg')) $extension = 'jpg';
                    if (str_contains(substr($t['archivo_escritura_base64'], 0, 30), 'image/png')) $extension = 'png';

                    $nombreArchivo = 'escrituras/' . uniqid() . '_' . $t['clave_catastral'] . '.' . $extension;
                    Storage::disk('public')->put($nombreArchivo, $base64data);
                    $rutaArchivo = '/storage/' . $nombreArchivo;
                }

                $nuevoTerreno = Terreno::create([
                    'id_persona' => $data['id_persona'],
                    'clave_catastral' => $t['clave_catastral'],
                    'area_total' => $t['area'],
                    'latitud' => $t['latitud'] ?? null,
                    'longitud' => $t['longitud'] ?? null,
                    'id_estado_construccion' => $t['estado_terreno'] ?? 1,
                    'archivo_escritura' => $rutaArchivo
                ]);

                // Insertar copropietarios si existen
                if (isset($t['copropietarios']) && is_array($t['copropietarios'])) {
                    foreach ($t['copropietarios'] as $copropietario) {
                        if (isset($copropietario['id_persona'])) {
                            DB::table('Copropietario_Terreno')->insert([
                                'id_terreno' => $nuevoTerreno->id_terreno,
                                'id_persona' => $copropietario['id_persona']
                            ]);
                        }
                    }
                }
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Terrenos registrados correctamente.'
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Error al guardar los terrenos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Actualiza el estado de construcción de un terreno
     */
    public function updateEstado(Request $request, $id): JsonResponse
    {
        $request->validate(['id_estado_construccion' => 'required|integer']);
        try {
            DB::table('Terreno')->where('id_terreno', $id)->update(['id_estado_construccion' => $request->id_estado_construccion]);
            return response()->json(['status' => 'success', 'message' => 'Estado actualizado']);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Obtiene los detalles completos de un terreno
     */
    public function show($id): JsonResponse
    {
        try {
            $selects = [
                't.id_terreno', 't.clave_catastral', 't.area_total', 't.latitud', 't.longitud',
                't.url_planimetria', 't.id_estado_construccion', 't.archivo_escritura',
                'p.id_persona', 'p.nombre', 'p.apellido', 'p.cedula',
                's.nombre_sector', 'z.nombre_zona', 'c.nombre_estado'
            ];

            $terreno = DB::table('Terreno as t')
                ->join('Persona as p', 't.id_persona', '=', 'p.id_persona')
                ->leftJoin('Sector as s', 'p.id_sector', '=', 's.id_sector')
                ->leftJoin('Zona as z', 's.id_zona', '=', 'z.id_zona')
                ->join('Catalogo_Estado_Construccion as c', 't.id_estado_construccion', '=', 'c.id_estado_construccion')
                ->select($selects)
                ->where('t.id_terreno', $id)
                ->first();

            if (!$terreno) {
                return response()->json(['status' => 'error', 'message' => 'Terreno no encontrado'], 404);
            }

            // Formatear respuesta
            $data = [
                'id_terreno' => $terreno->id_terreno,
                'clave_catastral' => $terreno->clave_catastral,
                'propietario' => trim($terreno->nombre . ' ' . $terreno->apellido),
                'id_persona' => $terreno->id_persona,
                'cedula' => $terreno->cedula,
                'zona' => $terreno->nombre_zona ?? 'Sin Zona',
                'sector' => $terreno->nombre_sector ?? 'Sin Sector',
                'estado_construccion' => $terreno->nombre_estado,
                'id_estado_construccion' => $terreno->id_estado_construccion,
                'area_m2' => $terreno->area_total,
                'latitud' => $terreno->latitud,
                'longitud' => $terreno->longitud,
                'url_planimetria' => $terreno->url_planimetria,
                'archivo_escritura' => isset($terreno->archivo_escritura) ? $terreno->archivo_escritura : null,
                'caudal_ls' => 2.5, // Mock temporal hasta tabla de riego
                'acequia' => 'Ramal Principal',
                'turno' => 'Lunes 08:00 - 10:00'
            ];

            // Buscar copropietarios
            $copropietarios = DB::table('Copropietario_Terreno as ct')
                ->join('Persona as p', 'ct.id_persona', '=', 'p.id_persona')
                ->where('ct.id_terreno', $id)
                ->select('p.id_persona', 'p.cedula', 'p.nombre', 'p.apellido')
                ->get();
            
            $data['copropietarios'] = $copropietarios->map(function($c) {
                return [
                    'id_persona' => $c->id_persona,
                    'cedula' => $c->cedula,
                    'nombre' => trim($c->nombre . ' ' . $c->apellido)
                ];
            });

            return response()->json(['status' => 'success', 'data' => $data]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Error al obtener terreno: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Actualización Técnica (Solo medidas, GPS, estado)
     */
    public function update(Request $request, $id): JsonResponse
    {
        $request->validate([
            'area_total'              => 'required|numeric|min:0',
            'id_estado_construccion'  => 'required|integer',
            'latitud'                 => 'nullable|numeric',
            'longitud'                => 'nullable|numeric',
            'copropietarios'          => 'nullable|array',
            'copropietarios.*'        => 'integer|exists:Persona,id_persona',
        ]);

        try {
            DB::beginTransaction();
            $terrenoAnterior = DB::table('Terreno')->where('id_terreno', $id)->first();

            if (!$terrenoAnterior) {
                return response()->json(['status' => 'error', 'message' => 'Terreno no encontrado'], 404);
            }

            DB::table('Terreno')->where('id_terreno', $id)->update([
                'area_total'             => $request->area_total,
                'id_estado_construccion' => $request->id_estado_construccion,
                'latitud'                => $request->latitud,
                'longitud'               => $request->longitud,
            ]);

            // Sincronizar copropietarios si se envía el campo
            if ($request->has('copropietarios')) {
                DB::table('Copropietario_Terreno')->where('id_terreno', $id)->delete();
                foreach (array_unique($request->copropietarios) as $idPersona) {
                    // No permitir que el titular sea también copropietario
                    if ((int)$idPersona !== (int)$terrenoAnterior->id_persona) {
                        DB::table('Copropietario_Terreno')->insert([
                            'id_terreno' => $id,
                            'id_persona' => $idPersona,
                        ]);
                    }
                }
            }

            DB::table('Auditoria')->insert([
                'tabla_afectada'  => 'Terreno',
                'operacion'       => 'UPDATE',
                'id_registro'     => $id,
                'datos_anteriores'=> json_encode($terrenoAnterior),
                'datos_nuevos'    => json_encode($request->only(['area_total', 'id_estado_construccion', 'latitud', 'longitud', 'copropietarios'])),
                'id_usuario'      => auth()->id(),
                'fecha_hora'      => now(),
            ]);

            DB::commit();
            return response()->json(['status' => 'success', 'message' => 'Terreno actualizado correctamente']);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Traspaso de Dominio (Venta/Herencia)
     */
    public function traspasoDominio(Request $request, $id): JsonResponse
    {
        $request->validate([
            'nuevo_id_persona' => 'required|integer|exists:Persona,id_persona',
            'motivo' => 'required|string|max:500'
        ]);

        try {
            DB::beginTransaction();
            
            $terreno = DB::table('Terreno')->where('id_terreno', $id)->first();
            if (!$terreno) {
                return response()->json(['status' => 'error', 'message' => 'Terreno no encontrado'], 404);
            }

            if ($terreno->id_persona == $request->nuevo_id_persona) {
                return response()->json(['status' => 'error', 'message' => 'El nuevo dueño no puede ser el mismo que el actual'], 400);
            }

            // Cambiar dueño
            DB::table('Terreno')->where('id_terreno', $id)->update([
                'id_persona' => $request->nuevo_id_persona
            ]);

            // Eliminar copropietarios viejos (Regla de negocio: Nuevo dueño empieza limpio)
            DB::table('Copropietario_Terreno')->where('id_terreno', $id)->delete();

            // Insertar Auditoría
            DB::table('Auditoria')->insert([
                'tabla_afectada' => 'Terreno',
                'operacion' => 'UPDATE',
                'id_registro' => $id,
                'datos_anteriores' => json_encode(['id_persona_anterior' => $terreno->id_persona]),
                'datos_nuevos' => json_encode([
                    'nuevo_id_persona' => $request->nuevo_id_persona,
                    'motivo_traspaso' => $request->motivo
                ]),
                'id_usuario' => auth()->id(),
                'fecha_hora' => now()
            ]);

            DB::commit();
            return response()->json(['status' => 'success', 'message' => 'Traspaso de dominio ejecutado con éxito. Todo el historial ha sido guardado.']);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Error en el traspaso: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Reporte: Padrón completo de propietarios con sus terrenos
     */
    public function reportePadron(): JsonResponse
    {
        try {
            $datos = DB::table('Persona as p')
                ->leftJoin('Terreno as t', 'p.id_persona', '=', 't.id_persona')
                ->leftJoin('Sector as s', 'p.id_sector', '=', 's.id_sector')
                ->leftJoin('Zona as z', 's.id_zona', '=', 'z.id_zona')
                ->leftJoin('Catalogo_Estado_Construccion as cec', 't.id_estado_construccion', '=', 'cec.id_estado_construccion')
                ->select(
                    'p.cedula',
                    DB::raw("CONCAT(p.nombre, ' ', p.apellido) as nombre"),
                    's.nombre_sector as sector',
                    'z.nombre_zona as zona',
                    't.clave_catastral',
                    DB::raw("COALESCE(t.area_total, 0) as area_m2"),
                    'cec.nombre_estado as estado_terreno',
                    'p.estado_vital as estado'
                )
                ->orderBy('s.nombre_sector')
                ->orderBy('p.apellido')
                ->get();

            return response()->json(['status' => 'success', 'data' => $datos]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Reporte: Listado de morosos (personas con multas o planillas pendientes)
     */
    public function reporteMorosos(Request $request): JsonResponse
    {
        try {
            $fechaDesde = $request->query('fechaDesde');
            $fechaHasta = $request->query('fechaHasta');

            $query = DB::table('Multa as m')
                ->join('Persona as p', 'm.id_persona', '=', 'p.id_persona')
                ->leftJoin('Sector as s', 'p.id_sector', '=', 's.id_sector')
                ->where('m.estado_pago', 'Pendiente')
                ->select(
                    'p.cedula',
                    DB::raw("CONCAT(p.nombre, ' ', p.apellido) as nombre"),
                    's.nombre_sector as sector',
                    'm.motivo_multa as concepto',
                    DB::raw("COALESCE(m.fecha_emision, CURDATE()) as fecha_emision"),
                    DB::raw("CAST(m.monto AS DECIMAL(10,2)) as monto"),
                    'm.estado_pago as estado'
                );

            if (!empty($fechaDesde)) {
                $query->whereDate('m.fecha_emision', '>=', $fechaDesde);
            }
            if (!empty($fechaHasta)) {
                $query->whereDate('m.fecha_emision', '<=', $fechaHasta);
            }

            $morosos = $query->orderByDesc('m.monto')->get();

            $totalDeuda = $morosos->sum('monto');

            return response()->json([
                'status' => 'success',
                'data'   => $morosos,
                'total_deuda' => $totalDeuda
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function buscarUniversal(Request $request): JsonResponse
    {
        try {
            $termino = $request->query('termino');
            $criterio = $request->query('criterio', 'todos');

            if (empty($termino)) {
                return response()->json(['status' => 'success', 'data' => []]);
            }

            $query = DB::table('Terreno as t')
                ->join('Persona as p', 't.id_persona', '=', 'p.id_persona')
                ->leftJoin('Sector as s', 'p.id_sector', '=', 's.id_sector')
                // JOIN de copropietarios agregados — elimina el N+1 anterior
                ->leftJoin(DB::raw(
                    '(SELECT ct.id_terreno, GROUP_CONCAT(CONCAT(cp.cedula,"|",cp.nombre," ",cp.apellido) SEPARATOR ";") as copros'
                    . ' FROM Copropietario_Terreno ct'
                    . ' JOIN Persona cp ON ct.id_persona = cp.id_persona'
                    . ' GROUP BY ct.id_terreno) as coprodata'
                ), 'coprodata.id_terreno', '=', 't.id_terreno')
                ->select(
                    't.id_terreno',
                    't.clave_catastral',
                    't.area_total',
                    'p.id_persona as id_titular',
                    'p.cedula as cedula_titular',
                    DB::raw("CONCAT(p.nombre, ' ', p.apellido) as nombre_titular"),
                    's.nombre_sector as sector',
                    'coprodata.copros'
                );

            if ($criterio === 'clave') {
                $query->where('t.clave_catastral', 'LIKE', '%' . $termino . '%');
            } elseif ($criterio === 'cedula') {
                $query->where('p.cedula', 'LIKE', '%' . $termino . '%');
            } elseif ($criterio === 'nombre') {
                $query->where(DB::raw("CONCAT(p.nombre, ' ', p.apellido)"), 'LIKE', '%' . $termino . '%');
            } else {
                $query->where(function($q) use ($termino) {
                    $q->where('t.clave_catastral', 'LIKE', '%' . $termino . '%')
                      ->orWhere('p.cedula', 'LIKE', '%' . $termino . '%')
                      ->orWhere(DB::raw("CONCAT(p.nombre, ' ', p.apellido)"), 'LIKE', '%' . $termino . '%');
                });
            }

            $terrenosTitular = $query->get()->map(function($t) {
                $copros = [];
                if (!empty($t->copros)) {
                    foreach (explode(';', $t->copros) as $entry) {
                        [$cedula, $nombre] = explode('|', $entry, 2);
                        $copros[] = ['cedula' => $cedula, 'nombre' => $nombre];
                    }
                }
                return [
                    'id_terreno'      => $t->id_terreno,
                    'clave_catastral' => $t->clave_catastral,
                    'area_total'      => $t->area_total,
                    'id_titular'      => $t->id_titular,
                    'cedula_titular'  => $t->cedula_titular,
                    'nombre_titular'  => $t->nombre_titular,
                    'sector'          => $t->sector,
                    'copropietarios'  => $copros,
                    'id_persona_cobro'  => $t->id_titular,
                    'cedula_cobro'      => $t->cedula_titular,
                    'nombre_cobro'      => $t->nombre_titular,
                    'es_copropietario'  => false,
                ];
            });

            // Buscar también por cédula o nombre de copropietarios
            $terrenosCopro = DB::table('Copropietario_Terreno as ct')
                ->join('Persona as cp', 'ct.id_persona', '=', 'cp.id_persona')
                ->join('Terreno as t2', 'ct.id_terreno', '=', 't2.id_terreno')
                ->join('Persona as p2', 't2.id_persona', '=', 'p2.id_persona')
                ->leftJoin('Sector as s2', 'p2.id_sector', '=', 's2.id_sector')
                ->where(function($q) use ($termino) {
                    $q->where('cp.cedula', 'LIKE', '%'.$termino.'%')
                      ->orWhere(DB::raw("CONCAT(cp.nombre, ' ', cp.apellido)"), 'LIKE', '%'.$termino.'%');
                })
                ->select(
                    't2.id_terreno', 't2.clave_catastral', 't2.area_total',
                    'cp.id_persona as id_copropietario', 'cp.cedula as cedula_copropietario',
                    DB::raw("CONCAT(cp.nombre, ' ', cp.apellido) as nombre_copropietario"),
                    'p2.id_persona as id_titular', 'p2.cedula as cedula_titular',
                    DB::raw("CONCAT(p2.nombre, ' ', p2.apellido) as nombre_titular"),
                    's2.nombre_sector as sector'
                )
                ->get()
                ->map(function($t) {
                    return [
                        'id_terreno'        => $t->id_terreno,
                        'clave_catastral'   => $t->clave_catastral,
                        'area_total'        => $t->area_total,
                        'id_titular'        => $t->id_titular,
                        'cedula_titular'    => $t->cedula_titular,
                        'nombre_titular'    => $t->nombre_titular,
                        'sector'            => $t->sector,
                        'copropietarios'    => [],
                        'id_persona_cobro'  => $t->id_copropietario,
                        'cedula_cobro'      => $t->cedula_copropietario,
                        'nombre_cobro'      => $t->nombre_copropietario,
                        'es_copropietario'  => true,
                    ];
                });

            // Unir resultados eliminando duplicados (un terreno puede aparecer por titular Y copropietario)
            $idsYaIncluidos = $terrenosTitular->pluck('id_terreno')->toArray();
            $terrenosCoproFiltrados = $terrenosCopro->filter(
                fn($t) => !in_array($t['id_terreno'], $idsYaIncluidos)
                       || $t['es_copropietario'] // si hay coincidencia en copro y titular, mostrar ambos
            );

            $terrenos = $terrenosTitular->concat($terrenosCoproFiltrados)->values();

            return response()->json(['status' => 'success', 'data' => $terrenos]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}

