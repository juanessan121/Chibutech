<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TituloEducativo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TituloController extends Controller
{
    /**
     * Búsqueda de Títulos (autocompletado para el frontend)
     * Ruta: GET /api/catalogos/titulos?search=...
     */
    public function buscar(Request $request): JsonResponse
    {
        $termino = $request->query('search', '');

        $query = \Illuminate\Support\Facades\DB::table('Catalogo_Titulo_Educativo as t1')
            ->leftJoin('Catalogo_Titulo_Educativo as t2', 't1.parent_codigo', '=', 't2.codigo')
            ->select('t1.codigo', 't1.nombre', 't2.nombre as categoria')
            ->where('t1.nivel_jerarquico', 9);

        if (!empty($termino)) {
            $query->where(function($q) use ($termino) {
                $q->where('t1.nombre', 'LIKE', '%' . $termino . '%')
                  ->orWhere('t1.codigo', 'LIKE', '%' . $termino . '%');
            });
        }

        $titulos = $query->limit(50)->get();

        return response()->json([
            'status' => 'ok',
            'data'   => $titulos
        ]);
    }

    /**
     * Obtener TODOS los títulos para caché local en el frontend (Optimización)
     * Ruta: GET /api/catalogos/titulos/todos
     */
    public function todos(): JsonResponse
    {
        $titulos = \Illuminate\Support\Facades\DB::table('Catalogo_Titulo_Educativo as t1')
            ->leftJoin('Catalogo_Titulo_Educativo as t2', 't1.parent_codigo', '=', 't2.codigo')
            ->select('t1.codigo', 't1.nombre', 't2.nombre as categoria')
            ->where('t1.nivel_jerarquico', 9)
            ->get();

        return response()->json([
            'status' => 'ok',
            'data'   => $titulos
        ]);
    }
}
