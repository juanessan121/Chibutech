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
                // Mapear estado_terreno a id_estado_construccion (Sembrio=1, Construccion=2, Abandonado=3 por defecto)
                $idEstado = 1;
                if ($t['estado_terreno'] === 'Construccion') $idEstado = 2;
                if ($t['estado_terreno'] === 'Abandonado') $idEstado = 3;

                Terreno::create([
                    'id_persona' => $data['id_persona'],
                    'clave_catastral' => $t['clave_catastral'],
                    'area_total' => $t['area'],
                    'latitud' => $t['latitud'] ?? null,
                    'longitud' => $t['longitud'] ?? null,
                    'id_estado_construccion' => $idEstado
                ]);
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
}
