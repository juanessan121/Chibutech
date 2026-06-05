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
        $multas = Multa::where('id_persona', $id)
            ->where('estado_pago', 'Pendiente')
            ->select('id_multa', 'motivo_multa', 'fecha_emision', 'monto')
            ->get()
            ->map(function($m) {
                return [
                    'id_deuda'      => 'M-' . $m->id_multa,
                    'id_multa'      => $m->id_multa,
                    'motivo'        => $m->motivo_multa,
                    'fecha_emision' => substr($m->fecha_emision, 0, 10),
                    'monto'         => (float) $m->monto,
                    'tipo'          => 'Multa',
                    'compartido'    => false
                ];
            });

        $planillas = PlanillaCabecera::where('id_persona', $id)
            ->where('estado_pago', 'Pendiente')
            ->select('id_planilla', 'mes_fiscal', 'anio_fiscal', 'fecha_emision', 'total_pagar')
            ->get()
            ->map(function($p) {
                return [
                    'id_deuda'      => 'P-' . $p->id_planilla,
                    'id_planilla'   => $p->id_planilla,
                    'motivo'        => 'Planilla de Agua - ' . $p->mes_fiscal . '/' . $p->anio_fiscal,
                    'fecha_emision' => $p->fecha_emision,
                    'monto'         => (float) $p->total_pagar,
                    'tipo'          => 'Planilla',
                    'compartido'    => false
                ];
            });

        // Planillas de terrenos donde esta persona es COPROPIETARIO
        // Se muestran para que también pueda cancelarlas desde ventanilla
        $titularesCompartidos = DB::table('Copropietario_Terreno as ct')
            ->join('Terreno as t', 'ct.id_terreno', '=', 't.id_terreno')
            ->where('ct.id_persona', $id)
            ->pluck('t.id_persona')
            ->unique()
            ->values()
            ->toArray();

        $planillasCompartidas = collect();
        if (!empty($titularesCompartidos)) {
            $idsYaCargados = $planillas->pluck('id_planilla')->toArray();
            $planillasCompartidas = PlanillaCabecera::whereIn('id_persona', $titularesCompartidos)
                ->where('estado_pago', 'Pendiente')
                ->whereNotIn('id_planilla', $idsYaCargados)
                ->select('id_planilla', 'mes_fiscal', 'anio_fiscal', 'fecha_emision', 'total_pagar')
                ->get()
                ->map(function($p) {
                    return [
                        'id_deuda'      => 'P-' . $p->id_planilla,
                        'id_planilla'   => $p->id_planilla,
                        'motivo'        => 'Planilla de Agua - ' . $p->mes_fiscal . '/' . $p->anio_fiscal,
                        'fecha_emision' => $p->fecha_emision,
                        'monto'         => (float) $p->total_pagar,
                        'tipo'          => 'Planilla',
                        'compartido'    => true
                    ];
                });
        }

        return response()->json([
            'status' => 'ok',
            'data'   => $multas->merge($planillas)->merge($planillasCompartidas)->values()
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
                            'responsable_registro' => auth()->id()
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
                            'responsable_registro' => auth()->id()
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
        $transacciones = CajaComunitaria::orderBy('id_transaccion', 'desc')
            ->select('id_transaccion', 'tipo_movimiento', 'concepto', 'monto', 'numero_comprobante', 'fecha_registro')
            ->limit(200)
            ->get()
            ->map(function($t) {
                return [
                    'id' => $t->id_transaccion,
                    'fecha' => substr($t->fecha_registro, 0, 10),
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
                'responsable_registro' => auth()->id()
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

            // Una sola query para ambas configuraciones
            $config = DB::table('Configuracion_Global')
                ->whereIn('clave', ['TARIFA_VALOR_BASE', 'TARIFA_METROS_BASE'])
                ->pluck('valor', 'clave');
            $tarifaBase = (float) ($config['TARIFA_VALOR_BASE'] ?? 5.00);
            $metrosBase = (float) ($config['TARIFA_METROS_BASE'] ?? 1000.00);

            if ($tipo === 'masiva') {
                DB::table('Terreno')
                    ->select('id_terreno', 'id_persona', 'area_total')
                    ->orderBy('id_terreno')
                    ->chunk(200, function($terrenos) use ($request, $tarifaBase, $metrosBase) {
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
                    });
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
            // Calcular totales directamente en la BD, no en PHP
            $totales = DB::table('Caja_Comunitaria')
                ->select(
                    'tipo_movimiento',
                    DB::raw('SUM(monto) as total'),
                    DB::raw('COUNT(*) as cantidad')
                )
                ->groupBy('tipo_movimiento')
                ->get()
                ->keyBy('tipo_movimiento');

            $totalIngresos = (float) ($totales['Ingreso']->total ?? 0);
            $totalEgresos  = (float) ($totales['Egreso']->total ?? 0);

            // Trae los movimientos para el detalle (con límite razonable)
            $movimientos = DB::table('Caja_Comunitaria')
                ->orderBy('id_transaccion', 'desc')
                ->limit(500)
                ->get();

            $ingresos = $movimientos->where('tipo_movimiento', 'Ingreso')
                ->map(fn($i) => [
                    'fecha'    => date('Y-m-d'),
                    'concepto' => $i->concepto ?? 'Sin concepto',
                    'monto'    => (float) $i->monto
                ])->values();

            $egresos = $movimientos->where('tipo_movimiento', 'Egreso')
                ->map(fn($e) => [
                    'fecha'    => date('Y-m-d'),
                    'concepto' => $e->concepto ?? 'Sin concepto',
                    'monto'    => (float) $e->monto
                ])->values();

            return response()->json([
                'status' => 'success',
                'data'   => [
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
                'responsable_registro' => auth()->id()
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
            // Una sola query para ambas tarifas
            $config = DB::table('Configuracion_Global')
                ->whereIn('clave', ['TARIFA_AGUA_VALOR', 'TARIFA_AGUA_METROS'])
                ->pluck('valor', 'clave');
            $valor_base  = (float) ($config['TARIFA_AGUA_VALOR']  ?? 5);
            $metros_base = (float) ($config['TARIFA_AGUA_METROS'] ?? 1000);

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

