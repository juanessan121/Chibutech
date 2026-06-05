<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

/**
 * DashboardController — devuelve todos los datos del panel en UNA sola petición HTTP.
 * Antes el frontend hacía 4 peticiones separadas; ahora hace 1.
 */
class DashboardController extends Controller
{
    public function resumen()
    {
        try {
            // Ejecutar todas las consultas de forma eficiente en paralelo de BD
            $comuneros = DB::table('Persona')
                ->whereNull('id_representante_familia')
                ->count();

            $terrenos = DB::table('Terreno')->count();

            $mingasMes = DB::table('Minga')
                ->whereMonth('fecha_programada', date('m'))
                ->whereYear('fecha_programada', date('Y'))
                ->count();

            // Totales de caja agrupados en una sola query
            $caja = DB::table('Caja_Comunitaria')
                ->select('tipo_movimiento', DB::raw('SUM(monto) as total'))
                ->groupBy('tipo_movimiento')
                ->get()
                ->keyBy('tipo_movimiento');

            $ingresos = (float) ($caja['Ingreso']->total ?? 0);
            $egresos  = (float) ($caja['Egreso']->total  ?? 0);

            $multasPendientes = DB::table('Multa')
                ->where('estado_pago', 'Pendiente')
                ->count();

            return response()->json([
                'status' => 'ok',
                'data'   => [
                    'comuneros'        => $comuneros,
                    'terrenos'         => $terrenos,
                    'mingas_mes'       => $mingasMes,
                    'ingresos'         => $ingresos,
                    'egresos'          => $egresos,
                    'saldo'            => $ingresos - $egresos,
                    'multas_pendientes'=> $multasPendientes,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Resumen personalizado para el comunero autenticado.
     * Devuelve sus terrenos, próxima minga y deudas pendientes en una sola petición.
     */
    public function resumenComunero(Request $request)
    {
        try {
            $idPersona = $request->user()->id_persona;

            // Terrenos del comunero (titular)
            $terrenosTitular = DB::table('Terreno as t')
                ->join('Persona as p', 't.id_persona', '=', 'p.id_persona')
                ->leftJoin('Sector as sec', 'p.id_sector', '=', 'sec.id_sector')
                ->where('t.id_persona', $idPersona)
                ->select('t.id_terreno', 't.clave_catastral', 't.area_total', 'sec.nombre_sector as sector',
                    DB::raw("CASE t.id_estado_terreno
                        WHEN 1 THEN 'Lote Baldío'
                        WHEN 2 THEN 'En Planificación'
                        WHEN 3 THEN 'En Construcción'
                        WHEN 4 THEN 'Construida'
                        ELSE 'Sin estado' END as estado"))
                ->get();

            $terrenosCopro = DB::table('Copropietario_Terreno as ct')
                ->join('Terreno as t', 'ct.id_terreno', '=', 't.id_terreno')
                ->join('Persona as p', 't.id_persona', '=', 'p.id_persona')
                ->leftJoin('Sector as sec', 'p.id_sector', '=', 'sec.id_sector')
                ->where('ct.id_persona', $idPersona)
                ->select('t.id_terreno', 't.clave_catastral', 't.area_total', 'sec.nombre_sector as sector',
                    DB::raw("CASE t.id_estado_terreno
                        WHEN 1 THEN 'Lote Baldío'
                        WHEN 2 THEN 'En Planificación'
                        WHEN 3 THEN 'En Construcción'
                        WHEN 4 THEN 'Construida'
                        ELSE 'Sin estado' END as estado"),
                    DB::raw("'copropietario' as tipo"))
                ->get();

            $terrenos = $terrenosTitular->map(fn($t) => [
                'id_terreno'      => $t->id_terreno,
                'clave_catastral' => $t->clave_catastral,
                'area_m2'         => (float) $t->area_total,
                'area_ha'         => round($t->area_total / 10000, 4),
                'sector'          => $t->sector ?? 'Sin sector',
                'estado'          => $t->estado,
                'es_copropietario'=> false,
            ])->concat($terrenosCopro->map(fn($t) => [
                'id_terreno'      => $t->id_terreno,
                'clave_catastral' => $t->clave_catastral,
                'area_m2'         => (float) $t->area_total,
                'area_ha'         => round($t->area_total / 10000, 4),
                'sector'          => $t->sector ?? 'Sin sector',
                'estado'          => $t->estado,
                'es_copropietario'=> true,
            ]))->values();

            // Próxima minga programada (fecha >= hoy)
            $mingaProxima = DB::table('Minga as m')
                ->join('Catalogo_Estado_Minga as e', 'm.id_estado_minga', '=', 'e.id_estado_minga')
                ->whereIn('m.id_estado_minga', [1, 2]) // Programada, En Ejecución
                ->where('m.fecha_programada', '>=', date('Y-m-d'))
                ->orderBy('m.fecha_programada', 'asc')
                ->select('m.id_minga', 'm.fecha_programada', 'm.lugar_encuentro',
                         'm.actividad_principal', 'm.valor_multa_inasistencia', 'e.nombre_estado')
                ->first();

            // Multas pendientes del comunero
            $multas = DB::table('Multa')
                ->where('id_persona', $idPersona)
                ->where('estado_pago', 'Pendiente')
                ->select('id_multa', 'motivo_multa', 'monto', 'fecha_emision')
                ->get();

            // Planillas pendientes del comunero
            $planillas = DB::table('Planilla_Cabecera')
                ->where('id_persona', $idPersona)
                ->where('estado_pago', 'Pendiente')
                ->select('id_planilla', 'mes_fiscal', 'anio_fiscal', 'total_pagar')
                ->get();

            $totalDeuda = $multas->sum('monto') + $planillas->sum('total_pagar');

            return response()->json([
                'status' => 'ok',
                'data'   => [
                    'terrenos'       => $terrenos,
                    'minga_proxima'  => $mingaProxima ? [
                        'id_minga'    => $mingaProxima->id_minga,
                        'fecha'       => $mingaProxima->fecha_programada,
                        'lugar'       => $mingaProxima->lugar_encuentro,
                        'actividad'   => $mingaProxima->actividad_principal ?? 'Sin descripción',
                        'multa'       => (float) $mingaProxima->valor_multa_inasistencia,
                        'estado'      => $mingaProxima->nombre_estado,
                    ] : null,
                    'multas_count'   => $multas->count(),
                    'planillas_count'=> $planillas->count(),
                    'total_deuda'    => (float) $totalDeuda,
                    'deudas_detalle' => $multas->map(fn($m) => [
                        'tipo'   => 'Multa',
                        'motivo' => $m->motivo_multa,
                        'monto'  => (float) $m->monto,
                    ])->concat($planillas->map(fn($p) => [
                        'tipo'   => 'Planilla',
                        'motivo' => "Planilla agua {$p->mes_fiscal}/{$p->anio_fiscal}",
                        'monto'  => (float) $p->total_pagar,
                    ]))->values(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
