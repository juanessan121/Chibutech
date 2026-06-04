<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Terreno;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class TerrenoController extends Controller
{
    /**
     * Obtiene el listado completo de predios/terrenos con sus relaciones
     */
    public function index(): JsonResponse
    {
        try {
            $terrenos = DB::table('Terreno as t')
                ->join('Persona as p', 't.id_persona', '=', 'p.id_persona')
                ->leftJoin('Sector as s', 'p.id_sector', '=', 's.id_sector')
                ->leftJoin('Zona as z', 's.id_zona', '=', 'z.id_zona')
                ->join('Catalogo_Estado_Construccion as cec', 't.id_estado_construccion', '=', 'cec.id_estado_construccion')
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
                    't.url_planimetria'
                )
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $terrenos
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
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
            'terrenos.*.clave_catastral' => 'required|string|unique:Terreno,clave_catastral',
            'terrenos.*.area' => 'required|numeric|min:0.01',
            'terrenos.*.latitud' => 'nullable|numeric',
            'terrenos.*.longitud' => 'nullable|numeric',
            'terrenos.*.estado_terreno' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            foreach ($data['terrenos'] as $t) {
                $nuevoTerreno = Terreno::create([
                    'id_persona' => $data['id_persona'],
                    'clave_catastral' => $t['clave_catastral'],
                    'area_total' => $t['area'],
                    'latitud' => $t['latitud'] ?? null,
                    'longitud' => $t['longitud'] ?? null,
                    'id_estado_construccion' => $t['estado_terreno'] ?? 1
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
            $terreno = DB::table('Terreno as t')
                ->join('Persona as p', 't.id_persona', '=', 'p.id_persona')
                ->leftJoin('Sector as s', 'p.id_sector', '=', 's.id_sector')
                ->leftJoin('Zona as z', 's.id_zona', '=', 'z.id_zona')
                ->join('Catalogo_Estado_Construccion as c', 't.id_estado_construccion', '=', 'c.id_estado_construccion')
                ->select(
                    't.id_terreno', 't.clave_catastral', 't.area_total', 't.latitud', 't.longitud', 't.url_planimetria', 't.id_estado_construccion',
                    'p.id_persona', 'p.nombre', 'p.apellido', 'p.cedula',
                    's.nombre_sector', 'z.nombre_zona', 'c.nombre_estado'
                )
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
            'area_total' => 'required|numeric|min:0',
            'id_estado_construccion' => 'required|integer',
            'latitud' => 'nullable|numeric',
            'longitud' => 'nullable|numeric'
        ]);

        try {
            DB::beginTransaction();
            $terrenoAnterior = DB::table('Terreno')->where('id_terreno', $id)->first();
            
            DB::table('Terreno')->where('id_terreno', $id)->update([
                'area_total' => $request->area_total,
                'id_estado_construccion' => $request->id_estado_construccion,
                'latitud' => $request->latitud,
                'longitud' => $request->longitud
            ]);

            // Auditoría (Opcional para edicion tecnica, pero la incluimos)
            DB::table('Auditoria')->insert([
                'tabla_afectada' => 'Terreno',
                'operacion' => 'UPDATE',
                'id_registro' => $id,
                'datos_anteriores' => json_encode($terrenoAnterior),
                'datos_nuevos' => json_encode($request->all()),
                'id_usuario' => 1,
                'fecha_hora' => now()
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
                'id_usuario' => 1, // Usuario Dummy por ahora
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
    public function reporteMorosos(): JsonResponse
    {
        try {
            $morosos = DB::table('Multa as m')
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
                )
                ->orderByDesc('m.monto')
                ->get();

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
}

