<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Exception;

class AuditoriaController extends Controller
{
    /**
     * Obtiene todos los registros de la bitácora de auditoría.
     */
    public function index(): JsonResponse
    {
        try {
            $auditoria = DB::table('Auditoria as a')
                ->leftJoin('Usuario_Sistema as u', 'a.id_usuario', '=', 'u.id_usuario')
                ->select(
                    'a.id_auditoria as id',
                    'a.tabla_afectada as tabla',
                    'a.operacion as accion',
                    'a.fecha_hora as fecha',
                    'a.datos_anteriores',
                    'a.datos_nuevos',
                    DB::raw("COALESCE(u.nombre_usuario, 'Sistema') as usuario")
                )
                ->orderBy('a.fecha_hora', 'desc')
                ->limit(200) // Limitar a los últimos 200 registros por rendimiento
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $auditoria
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
