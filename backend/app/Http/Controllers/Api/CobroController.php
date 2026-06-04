<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Multa;
use App\Models\PlanillaCabecera;
use App\Models\PlanillaDetalle;
use App\Models\CajaComunitaria;
use Illuminate\Support\Facades\DB;

class CobroController extends Controller
{
    public function deudasPendientes($id)
    {
        $multas = Multa::where('id_persona', $id)->where('estado_pago', 'Pendiente')->get()->map(function($m) {
            return [
                'id_deuda' => 'M-' . $m->id_multa,
                'id_multa' => $m->id_multa,
                'motivo' => $m->motivo_multa,
                'fecha_emision' => substr($m->fecha_emision, 0, 10),
                'monto' => (float) $m->monto,
                'tipo' => 'Multa'
            ];
        });

        $planillas = PlanillaCabecera::where('id_persona', $id)->where('estado_pago', 'Pendiente')->get()->map(function($p) {
            return [
                'id_deuda' => 'P-' . $p->id_planilla,
                'id_planilla' => $p->id_planilla,
                'motivo' => 'Planilla de Agua - ' . $p->mes_fiscal . '/' . $p->anio_fiscal,
                'fecha_emision' => $p->fecha_emision,
                'monto' => (float) $p->total_pagar,
                'tipo' => 'Planilla'
            ];
        });

        return response()->json([
            'status' => 'ok',
            'data' => $multas->merge($planillas)->values()
        ]);
    }

    public function procesarPago(Request $request)
    {
        try {
            DB::beginTransaction();

            $comprobante = $request->comprobante ?: 'REC-' . date('Y') . '-' . time();

            // Pagar Multas
            if (!empty($request->multas)) {
                foreach ($request->multas as $id_multa) {
                    $multa = Multa::find($id_multa);
                    if ($multa && $multa->estado_pago === 'Pendiente') {
                        $multa->update(['estado_pago' => 'Pagada']);
                        CajaComunitaria::create([
                            'numero_comprobante' => $comprobante,
                            'tipo_movimiento' => 'Ingreso',
                            'concepto' => 'Cobro Multa: ' . $multa->motivo_multa,
                            'id_multa' => $id_multa,
                            'monto' => $multa->monto,
                            'responsable_registro' => 1 // ID harcodeado hasta que haya auth real
                        ]);
                    }
                }
            }

            // Pagar Planillas
            if (!empty($request->planillas)) {
                foreach ($request->planillas as $id_planilla) {
                    $planilla = PlanillaCabecera::find($id_planilla);
                    if ($planilla && $planilla->estado_pago === 'Pendiente') {
                        $planilla->update(['estado_pago' => 'Pagada']);
                        CajaComunitaria::create([
                            'numero_comprobante' => $comprobante,
                            'tipo_movimiento' => 'Ingreso',
                            'concepto' => 'Cobro Planilla Agua ' . $planilla->mes_fiscal . '/' . $planilla->anio_fiscal,
                            'id_planilla' => $id_planilla,
                            'monto' => $planilla->total_pagar,
                            'responsable_registro' => 1
                        ]);
                    }
                }
            }

            DB::commit();
            return response()->json(['status' => 'ok', 'message' => 'Pago procesado correctamente']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function historialTransacciones()
    {
        $transacciones = CajaComunitaria::orderBy('id_transaccion', 'desc')->get()->map(function($t) {
            return [
                'id' => $t->id_transaccion,
                'fecha' => $t->numero_comprobante ? 'N/A' : 'N/A', // TODO: Agregar columna fecha en DB si se requiere, por ahora usaremos una calculada o timestamp si hubiera
                'tipo' => $t->tipo_movimiento,
                'concepto' => $t->concepto,
                'monto' => (float) $t->monto,
                'comprobante' => $t->numero_comprobante
            ];
        });

        // La base de datos original Caja_Comunitaria no tiene campo fecha, vamos a extraer fecha del ID autoincremental de forma aproximada o simplemente devolver la fecha actual, lo ideal es agregar fecha_registro en la tabla.
        // Dado que no la alteramos, devolveremos fecha actual.
        foreach($transacciones as $k => $v) {
            $transacciones[$k]['fecha'] = date('Y-m-d'); 
        }

        return response()->json([
            'status' => 'ok',
            'data' => $transacciones
        ]);
    }

    public function generarMulta(Request $request)
    {
        try {
            $multa = Multa::create([
                'id_persona' => $request->id_persona,
                'motivo_multa' => $request->motivo,
                'monto' => $request->monto,
                'estado_pago' => 'Pendiente',
                'url_documento_justificativo' => $request->url_documento
            ]);

            return response()->json(['status' => 'ok', 'message' => 'Multa generada', 'data' => $multa]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function registrarEgreso(Request $request)
    {
        try {
            $caja = CajaComunitaria::create([
                'numero_comprobante' => $request->comprobante,
                'tipo_movimiento' => 'Egreso',
                'concepto' => $request->concepto,
                'monto' => $request->monto,
                'responsable_registro' => 1
            ]);
            return response()->json(['status' => 'ok', 'message' => 'Egreso registrado', 'data' => $caja]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function generarPlanillas(Request $request)
    {
        try {
            DB::beginTransaction();

            $tipo = $request->tipo_emision; // 'masiva' o 'individual'

            // Obtener configuración
            $tarifaBase = DB::table('Configuracion_Global')->where('clave', 'TARIFA_VALOR_BASE')->value('valor') ?? 5.00;
            $metrosBase = DB::table('Configuracion_Global')->where('clave', 'TARIFA_METROS_BASE')->value('valor') ?? 1000.00;
            $tarifaBase = (float) $tarifaBase;
            $metrosBase = (float) $metrosBase;

            if ($tipo === 'masiva') {
                $terrenos = DB::table('Terreno')->get();
                foreach ($terrenos as $terreno) {
                    $area = (float) $terreno->area_total;
                    $fracciones = ceil($area / $metrosBase);
                    $subtotal = $fracciones * $tarifaBase;

                    $cabecera = PlanillaCabecera::create([
                        'id_persona' => $terreno->id_persona,
                        'fecha_emision' => $request->fecha_emision,
                        'anio_fiscal' => $request->anio,
                        'mes_fiscal' => $request->mes_correspondiente,
                        'total_pagar' => $subtotal,
                        'estado_pago' => 'Pendiente'
                    ]);

                    PlanillaDetalle::create([
                        'id_planilla' => $cabecera->id_planilla,
                        'id_terreno' => $terreno->id_terreno,
                        'area_terreno_copia' => $area,
                        'subtotal_calculado' => $subtotal
                    ]);
                }
            } else {
                $terreno = DB::table('Terreno')->where('id_terreno', $request->id_terreno)->first();
                if (!$terreno) {
                    throw new \Exception('Terreno no encontrado');
                }

                $area = (float) $terreno->area_total;
                $fracciones = ceil($area / $metrosBase);
                $subtotal = $fracciones * $tarifaBase;

                $cabecera = PlanillaCabecera::create([
                    'id_persona' => $terreno->id_persona,
                    'fecha_emision' => $request->fecha_emision,
                    'anio_fiscal' => $request->anio,
                    'mes_fiscal' => $request->mes_correspondiente,
                    'total_pagar' => $subtotal,
                    'estado_pago' => 'Pendiente'
                ]);

                PlanillaDetalle::create([
                    'id_planilla' => $cabecera->id_planilla,
                    'id_terreno' => $terreno->id_terreno,
                    'area_terreno_copia' => $area,
                    'subtotal_calculado' => $subtotal
                ]);
            }

            DB::commit();
            return response()->json(['status' => 'ok', 'message' => 'Planillas generadas exitosamente']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Reporte: Balance financiero (Ingresos y Egresos de la caja)
     */
    public function reporteBalance(Request $request)
    {
        try {
            $periodo = $request->query('periodo', 'este_mes');
            
            $query = DB::table('Caja_Comunitaria');

            if ($periodo === 'este_mes') {
                // Suponiendo que hay fecha, sino traemos todo. La tabla no tiene fecha, usamos id para mock si no hay, pero agregaremos filtro WHERE TRUE para que compile y traiga todo por ahora si no hay campo fecha.
                // Lo ideal: $query->whereMonth('fecha_registro', date('m'))->whereYear('fecha_registro', date('Y'));
                // Al no tener campo fecha en DB según modelo, lo traemos todo por ahora.
            }

            $movimientos = $query->get();

            $ingresos = $movimientos->where('tipo_movimiento', 'Ingreso')->map(function($i) {
                return [
                    'fecha' => date('Y-m-d'), // Simulado porque no hay fecha en DB
                    'concepto' => $i->concepto,
                    'monto' => (float) $i->monto
                ];
            })->values();

            $egresos = $movimientos->where('tipo_movimiento', 'Egreso')->map(function($e) {
                return [
                    'fecha' => date('Y-m-d'),
                    'concepto' => $e->concepto,
                    'monto' => (float) $e->monto
                ];
            })->values();

            $totalIngresos = $ingresos->sum('monto');
            $totalEgresos = $egresos->sum('monto');

            return response()->json([
                'status' => 'success',
                'data' => [
                    'resumen' => [
                        'ingresos' => $totalIngresos,
                        'egresos'  => $totalEgresos,
                        'saldo'    => $totalIngresos - $totalEgresos
                    ],
                    'ingresos' => $ingresos,
                    'egresos'  => $egresos
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}

