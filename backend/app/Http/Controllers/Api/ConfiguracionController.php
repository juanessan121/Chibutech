<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Exception;

class ConfiguracionController extends Controller
{
    // ==========================================
    // PARÁMETROS GLOBALES
    // ==========================================
    public function getGlobales(): JsonResponse
    {
        try {
            $config = DB::table('Configuracion_Global')->get();
            return response()->json(['status' => 'success', 'data' => $config]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function updateGlobal(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'configuraciones' => 'required|array',
            ]);

            DB::beginTransaction();
            foreach ($validated['configuraciones'] as $item) {
                if (isset($item['clave']) && isset($item['valor'])) {
                    // Si no existe, lo creamos (Upsert manual)
                    $exists = DB::table('Configuracion_Global')->where('clave', $item['clave'])->first();
                    if ($exists) {
                        DB::table('Configuracion_Global')
                            ->where('clave', $item['clave'])
                            ->update(['valor' => $item['valor']]);
                    } else {
                        DB::table('Configuracion_Global')->insert([
                            'clave' => $item['clave'],
                            'valor' => $item['valor'],
                            'tipo_dato' => $item['tipo_dato'] ?? 'Texto'
                        ]);
                    }
                }
            }
            DB::commit();

            return response()->json(['status' => 'success', 'message' => 'Configuración actualizada']);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // ==========================================
    // ZONAS Y SECTORES
    // ==========================================
    public function getZonasSectores(): JsonResponse
    {
        try {
            $zonas = DB::table('Zona')->get();
            $sectores = DB::table('Sector as s')
                ->join('Zona as z', 's.id_zona', '=', 'z.id_zona')
                ->select('s.*', 'z.nombre_zona')
                ->get();
                
            return response()->json([
                'status' => 'success', 
                'data' => [
                    'zonas' => $zonas,
                    'sectores' => $sectores
                ]
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function addZona(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nombre_zona' => 'required|string|max:100|unique:Zona,nombre_zona',
                'descripcion' => 'nullable|string'
            ]);

            $id = DB::table('Zona')->insertGetId($validated);
            return response()->json(['status' => 'success', 'data' => ['id_zona' => $id]]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function addSector(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'id_zona' => 'required|integer|exists:Zona,id_zona',
                'nombre_sector' => 'required|string|max:100|unique:Sector,nombre_sector',
                'descripcion' => 'nullable|string'
            ]);

            $id = DB::table('Sector')->insertGetId($validated);
            return response()->json(['status' => 'success', 'data' => ['id_sector' => $id]]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // ==========================================
    // TÍTULOS EDUCATIVOS
    // ==========================================
    public function addTitulo(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nombre_titulo' => 'required|string|max:150|unique:Catalogo_Titulo_Educativo,nombre_titulo',
                'descripcion' => 'nullable|string'
            ]);

            $id = DB::table('Catalogo_Titulo_Educativo')->insertGetId($validated);
            return response()->json(['status' => 'success', 'data' => ['id_titulo_educativo' => $id]]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
