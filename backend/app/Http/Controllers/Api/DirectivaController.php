<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Exception;

class DirectivaController extends Controller
{
    /**
     * Obtiene la directiva actual (estado = 'Activo')
     */
    public function actual(): JsonResponse
    {
        try {
            $directiva = DB::table('Miembro_Directiva as md')
                ->join('Persona as p', 'md.id_persona', '=', 'p.id_persona')
                ->join('Catalogo_Cargo_Directivo as ccd', 'md.id_cargo_directivo', '=', 'ccd.id_cargo_directivo')
                ->where('md.estado', 'Activo')
                ->select(
                    'md.id_directiva as id',
                    DB::raw("CONCAT(p.nombre, ' ', p.apellido) as nombre"),
                    'p.cedula',
                    'ccd.nombre_cargo as cargo',
                    'md.fecha_inicio',
                    'md.estado'
                )
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $directiva
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Obtiene el historial de directivas agrupado por periodo (año o fecha)
     */
    public function historial(Request $request): JsonResponse
    {
        try {
            $periodo = $request->query('periodo');

            $query = DB::table('Miembro_Directiva as md')
                ->join('Persona as p', 'md.id_persona', '=', 'p.id_persona')
                ->join('Catalogo_Cargo_Directivo as ccd', 'md.id_cargo_directivo', '=', 'ccd.id_cargo_directivo')
                ->where('md.estado', 'Finalizado');

            if ($periodo) {
                // Suponiendo que el periodo es el año de inicio
                $query->whereYear('md.fecha_inicio', $periodo);
            }

            $directiva = $query->select(
                    'md.id_directiva as id',
                    DB::raw("CONCAT(p.nombre, ' ', p.apellido) as nombre"),
                    'p.cedula',
                    'ccd.nombre_cargo as cargo',
                    'md.fecha_inicio',
                    'md.fecha_fin',
                    'md.estado'
                )
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $directiva
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Registra una nueva directiva.
     * Finaliza la actual y crea los nuevos registros.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'fecha_inicio' => 'required|date',
                'fecha_fin' => 'nullable|date',
                'resolucion' => 'nullable|string',
                'cargos' => 'required|array', // [{ id_cargo_directivo: 1, id_persona: 5 }]
            ]);

            DB::beginTransaction();

            // 1. Finalizar la directiva actual (marcar estado = 'Finalizado' y fecha_fin si no la tiene)
            DB::table('Miembro_Directiva')
                ->where('estado', 'Activo')
                ->update([
                    'estado' => 'Finalizado',
                    'fecha_fin' => DB::raw("COALESCE(fecha_fin, '" . $validated['fecha_inicio'] . "')")
                ]);

            // 2. Insertar los nuevos miembros
            $nuevosMiembros = [];
            foreach ($validated['cargos'] as $cargo) {
                if (!empty($cargo['id_persona'])) {
                    $nuevosMiembros[] = [
                        'id_persona' => $cargo['id_persona'],
                        'id_cargo_directivo' => $cargo['id_cargo_directivo'],
                        'fecha_inicio' => $validated['fecha_inicio'],
                        'fecha_fin' => $validated['fecha_fin'] ?? null,
                        'resolucion_nombramiento' => $validated['resolucion'] ?? null,
                        'estado' => 'Activo'
                    ];
                }
            }

            if (!empty($nuevosMiembros)) {
                DB::table('Miembro_Directiva')->insert($nuevosMiembros);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Directiva registrada correctamente. La anterior ha sido finalizada.'
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}

