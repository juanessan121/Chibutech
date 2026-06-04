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
                foreach ($request->multas as $idx => $id_multa) {
                    $multa = Multa::find($id_multa);
                    if ($multa && $multa->estado_pago === 'Pendiente') {
                        $multa->update(['estado_pago' => 'Pagada']);
                        CajaComunitaria::create([
                            'numero_comprobante' => $comprobante . '-M' . $id_multa,
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
                foreach ($request->planillas as $idx => $id_planilla) {
                    $planilla = PlanillaCabecera::find($id_planilla);
                    if ($planilla && $planilla->estado_pago === 'Pendiente') {
                        $planilla->update(['estado_pago' => 'Pagada']);
                        CajaComunitaria::create([
                            'numero_comprobante' => $comprobante . '-P' . $id_planilla,
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
                'fecha' => date('Y-m-d'), // La tabla no tiene fecha_registro nativa por ahora
                'tipo' => $t->tipo_movimiento,
                'concepto' => $t->concepto ?: 'Sin concepto',
                'monto' => (float) $t->monto,
                'comprobante' => $t->numero_comprobante
            ];
        });

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

    public function deudas($id_terreno): \Illuminate\Http\JsonResponse
    {
        try {
            // Traer las cabeceras relacionadas con este terreno a través del detalle
            $planillas = DB::table('Planilla_Cabecera as pc')
                ->join('Planilla_Detalle_Terreno as pd', 'pc.id_planilla', '=', 'pd.id_planilla')
                ->where('pd.id_terreno', $id_terreno)
                ->select(
                    'pc.id_planilla',
                    'pc.anio_fiscal',
                    'pc.mes_fiscal',
                    'pc.estado_pago',
                    'pc.total_pagar',
                    'pc.fecha_emision',
                    'pc.fecha_pago',
                    'pc.numero_comprobante'
                )
                ->orderBy('pc.anio_fiscal', 'desc')
                ->orderBy('pc.mes_fiscal', 'desc')
                ->get();

            return response()->json(['status' => 'success', 'data' => $planillas]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function pagarAgua(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validated = $request->validate([
                'id_planilla' => 'required|integer',
                'numero_comprobante' => 'required|string|max:50'
            ]);

            DB::beginTransaction();

            $planilla = DB::table('Planilla_Cabecera')->where('id_planilla', $validated['id_planilla'])->first();
            if (!$planilla) {
                throw new \Exception("Planilla no encontrada");
            }
            if ($planilla->estado_pago === 'Pagada') {
                throw new \Exception("Esta planilla ya se encuentra pagada");
            }

            // Actualizar planilla
            DB::table('Planilla_Cabecera')
                ->where('id_planilla', $validated['id_planilla'])
                ->update([
                    'estado_pago' => 'Pagada',
                    'numero_comprobante' => $validated['numero_comprobante'],
                    'fecha_pago' => now()
                ]);

            // Ingreso a la caja comunitaria
            DB::table('Caja_Comunitaria')->insert([
                'numero_comprobante' => $validated['numero_comprobante'],
                'tipo_movimiento' => 'Ingreso',
                'concepto' => 'Pago de agua (Mes: '.$planilla->mes_fiscal.'/'.$planilla->anio_fiscal.')',
                'id_planilla' => $planilla->id_planilla,
                'monto' => $planilla->total_pagar,
                'responsable_registro' => 1 // Asumiendo ID 1 para el Admin por defecto si no hay auth web
            ]);

            DB::commit();
            return response()->json(['status' => 'success', 'message' => 'Pago registrado correctamente']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function consultarMes(Request $request, $id_terreno): \Illuminate\Http\JsonResponse
    {
        try {
            $mes = $request->query('mes');
            $anio = $request->query('anio');

            // Buscar si ya existe la planilla
            $planilla = DB::table('Planilla_Cabecera as pc')
                ->join('Planilla_Detalle_Terreno as pd', 'pc.id_planilla', '=', 'pd.id_planilla')
                ->where('pd.id_terreno', $id_terreno)
                ->where('pc.mes_fiscal', $mes)
                ->where('pc.anio_fiscal', $anio)
                ->select('pc.*')
                ->first();

            if ($planilla) {
                return response()->json(['status' => 'success', 'data' => $planilla]);
            }

            // Si no existe, generarla al vuelo usando el parámetro global de tarifa (ej. $5 por cada 1000m2)
            // 1. Obtener tarifa
            $valor_base = DB::table('Configuracion_Global')->where('clave', 'TARIFA_AGUA_VALOR')->value('valor') ?? 5;
            $metros_base = DB::table('Configuracion_Global')->where('clave', 'TARIFA_AGUA_METROS')->value('valor') ?? 1000;

            // 2. Obtener terreno y titular
            $terreno = DB::table('Terreno')->where('id_terreno', $id_terreno)->first();
            if (!$terreno) throw new \Exception('Terreno no encontrado');

            // 3. Calcular
            $subtotal = ($terreno->area_total / $metros_base) * $valor_base;

            DB::beginTransaction();
            $id_planilla = DB::table('Planilla_Cabecera')->insertGetId([
                'id_persona' => $terreno->id_persona,
                'fecha_emision' => now(),
                'anio_fiscal' => $anio,
                'mes_fiscal' => $mes,
                'total_pagar' => $subtotal,
                'estado_pago' => 'Pendiente'
            ]);

            DB::table('Planilla_Detalle_Terreno')->insert([
                'id_planilla' => $id_planilla,
                'id_terreno' => $id_terreno,
                'area_terreno_copia' => $terreno->area_total,
                'subtotal_calculado' => $subtotal
            ]);
            DB::commit();

            $nuevaPlanilla = DB::table('Planilla_Cabecera')->where('id_planilla', $id_planilla)->first();
            return response()->json(['status' => 'success', 'data' => $nuevaPlanilla, 'message' => 'Planilla generada automáticamente.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}

