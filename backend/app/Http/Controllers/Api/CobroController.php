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

        // Planillas propias — con JOIN a detalle para obtener clave catastral del terreno
        $planillas = DB::table('Planilla_Cabecera as pc')
            ->leftJoin('Planilla_Detalle_Terreno as pd', 'pc.id_planilla', '=', 'pd.id_planilla')
            ->leftJoin('Terreno as t', 'pd.id_terreno', '=', 't.id_terreno')
            ->where('pc.id_persona', $id)
            ->where('pc.estado_pago', 'Pendiente')
            ->select('pc.id_planilla', 'pc.mes_fiscal', 'pc.anio_fiscal', 'pc.fecha_emision',
                     'pc.total_pagar', 't.clave_catastral', 't.area_total')
            ->get()
            ->map(function($p) {
                $terreno = $p->clave_catastral ? " — Predio {$p->clave_catastral}" : '';
                return [
                    'id_deuda'        => 'P-' . $p->id_planilla,
                    'id_planilla'     => $p->id_planilla,
                    'motivo'          => 'Planilla de Agua ' . $p->mes_fiscal . '/' . $p->anio_fiscal . $terreno,
                    'fecha_emision'   => $p->fecha_emision,
                    'monto'           => (float) $p->total_pagar,
                    'tipo'            => 'Planilla',
                    'compartido'      => false,
                    'clave_catastral' => $p->clave_catastral,
                ];
            });

        // Planillas de terrenos donde esta persona es COPROPIETARIO
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
            $planillasCompartidas = DB::table('Planilla_Cabecera as pc')
                ->leftJoin('Planilla_Detalle_Terreno as pd', 'pc.id_planilla', '=', 'pd.id_planilla')
                ->leftJoin('Terreno as t', 'pd.id_terreno', '=', 't.id_terreno')
                ->whereIn('pc.id_persona', $titularesCompartidos)
                ->where('pc.estado_pago', 'Pendiente')
                ->whereNotIn('pc.id_planilla', $idsYaCargados)
                ->select('pc.id_planilla', 'pc.mes_fiscal', 'pc.anio_fiscal', 'pc.fecha_emision',
                         'pc.total_pagar', 't.clave_catastral')
                ->get()
                ->map(function($p) {
                    $terreno = $p->clave_catastral ? " — Predio {$p->clave_catastral}" : '';
                    return [
                        'id_deuda'        => 'P-' . $p->id_planilla,
                        'id_planilla'     => $p->id_planilla,
                        'motivo'          => 'Planilla de Agua ' . $p->mes_fiscal . '/' . $p->anio_fiscal . $terreno,
                        'fecha_emision'   => $p->fecha_emision,
                        'monto'           => (float) $p->total_pagar,
                        'tipo'            => 'Planilla',
                        'compartido'      => true,
                        'clave_catastral' => $p->clave_catastral,
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
        $request->validate([
            'comprobante' => 'nullable|integer|min:1',
            'multas'      => 'nullable|array',
            'multas.*'    => 'integer|exists:Multa,id_multa',
            'planillas'   => 'nullable|array',
            'planillas.*' => 'integer|exists:Planilla_Cabecera,id_planilla',
        ]);

        try {
            DB::beginTransaction();

            $comprobante = $request->comprobante ?: (time() % 100000);

            // Pagar Multas — se verifica que la multa esté Pendiente
            if (!empty($request->multas)) {
                foreach ($request->multas as $id_multa) {
                    $multa = Multa::where('id_multa', $id_multa)
                        ->where('estado_pago', 'Pendiente')
                        ->first();
                    if ($multa) {
                        $multa->update(['estado_pago' => 'Pagada']);
                        CajaComunitaria::create([
                            'numero_comprobante' => $comprobante . '-M' . $id_multa,
                            'tipo_movimiento'    => 'Ingreso',
                            'concepto'           => 'Cobro Multa: ' . $multa->motivo_multa,
                            'id_multa'           => $id_multa,
                            'monto'              => $multa->monto,
                            'responsable_registro' => auth()->id()
                        ]);
                    }
                }
            }

            // Pagar Planillas — se verifica estado Pendiente
            if (!empty($request->planillas)) {
                foreach ($request->planillas as $id_planilla) {
                    $planilla = PlanillaCabecera::where('id_planilla', $id_planilla)
                        ->where('estado_pago', 'Pendiente')
                        ->first();
                    if ($planilla) {
                        $planilla->update(['estado_pago' => 'Pagada']);
                        CajaComunitaria::create([
                            'numero_comprobante' => $comprobante . '-P' . $id_planilla,
                            'tipo_movimiento'    => 'Ingreso',
                            'concepto'           => 'Cobro Planilla Agua ' . $planilla->mes_fiscal . '/' . $planilla->anio_fiscal,
                            'id_planilla'        => $id_planilla,
                            'monto'              => $planilla->total_pagar,
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
        $validated = $request->validate([
            'id_persona'   => 'required|integer|exists:Persona,id_persona',
            'motivo'       => 'required|string|min:5|max:500',
            'monto'        => 'required|numeric|min:0.01|max:10000',
            'url_documento'=> 'nullable|url|max:255',
            'fecha_limite' => 'nullable|date|after_or_equal:today',
        ], [
            'id_persona.exists' => 'La persona indicada no existe en el sistema.',
            'monto.min'         => 'El monto de la multa debe ser mayor a $0.00.',
            'monto.max'         => 'El monto no puede exceder $10,000.',
            'motivo.min'        => 'El motivo debe tener al menos 5 caracteres.',
        ]);

        try {
            $multa = Multa::create([
                'id_persona'                  => $validated['id_persona'],
                'motivo_multa'                => $validated['motivo'],
                'monto'                       => $validated['monto'],
                'estado_pago'                 => 'Pendiente',
                'url_documento_justificativo' => $validated['url_documento'] ?? null,
                'fecha_emision'               => now(),
            ]);

            return response()->json(['status' => 'ok', 'message' => 'Multa generada correctamente', 'data' => $multa]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function registrarEgreso(Request $request)
    {
        $validated = $request->validate([
            'comprobante' => 'required|integer|min:1',
            'concepto'    => 'required|string|min:5|max:500',
            'monto'       => 'required|numeric|min:0.01|max:100000',
        ], [
            'comprobante.required' => 'El número de comprobante es obligatorio.',
            'comprobante.integer'  => 'El comprobante debe ser un número entero.',
            'monto.min'            => 'El monto del egreso debe ser mayor a $0.00.',
            'concepto.min'         => 'El concepto debe tener al menos 5 caracteres.',
        ]);

        try {
            $caja = CajaComunitaria::create([
                'numero_comprobante'  => (string) $validated['comprobante'],
                'tipo_movimiento'     => 'Egreso',
                'concepto'            => $validated['concepto'],
                'monto'               => $validated['monto'],
                'responsable_registro'=> auth()->id()
            ]);
            return response()->json(['status' => 'ok', 'message' => 'Egreso registrado correctamente', 'data' => $caja]);
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
                'id_planilla'        => 'required|integer|exists:Planilla_Cabecera,id_planilla',
                'numero_comprobante' => 'required|integer|min:1',
            ], [
                'numero_comprobante.integer' => 'El número de comprobante debe ser un número entero.',
                'numero_comprobante.min'     => 'El número de comprobante debe ser mayor a 0.',
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
            $mes  = $request->query('mes');
            $anio = $request->query('anio');

            $config = DB::table('Configuracion_Global')
                ->whereIn('clave', ['TARIFA_AGUA_VALOR', 'TARIFA_AGUA_METROS'])
                ->pluck('valor', 'clave');
            $valor_base  = (float) ($config['TARIFA_AGUA_VALOR']  ?? 5);
            $metros_base = (float) ($config['TARIFA_AGUA_METROS'] ?? 1000);

            $terreno = DB::table('Terreno')->where('id_terreno', $id_terreno)->first();
            if (!$terreno) throw new \Exception('Terreno no encontrado');

            $area      = (float) $terreno->area_total;
            $fracciones = (int) ceil($area / $metros_base);
            $subtotal  = $fracciones * $valor_base;

            $extra = [
                'clave_catastral' => $terreno->clave_catastral,
                'area_total'      => $area,
                'fracciones'      => $fracciones,
                'metros_base'     => $metros_base,
                'tarifa_fraccion' => $valor_base,
            ];

            // Buscar si ya existe la planilla para este terreno/mes/año
            $planilla = DB::table('Planilla_Cabecera as pc')
                ->join('Planilla_Detalle_Terreno as pd', 'pc.id_planilla', '=', 'pd.id_planilla')
                ->where('pd.id_terreno', $id_terreno)
                ->where('pc.mes_fiscal', $mes)
                ->where('pc.anio_fiscal', $anio)
                ->select('pc.*')
                ->first();

            if ($planilla) {
                return response()->json([
                    'status' => 'success',
                    'data'   => array_merge((array) $planilla, $extra)
                ]);
            }

            DB::beginTransaction();
            $id_planilla = DB::table('Planilla_Cabecera')->insertGetId([
                'id_persona'    => $terreno->id_persona,
                'fecha_emision' => now(),
                'anio_fiscal'   => $anio,
                'mes_fiscal'    => $mes,
                'total_pagar'   => $subtotal,
                'estado_pago'   => 'Pendiente'
            ]);
            DB::table('Planilla_Detalle_Terreno')->insert([
                'id_planilla'        => $id_planilla,
                'id_terreno'         => $id_terreno,
                'area_terreno_copia' => $area,
                'subtotal_calculado' => $subtotal
            ]);
            DB::commit();

            $nuevaPlanilla = DB::table('Planilla_Cabecera')->where('id_planilla', $id_planilla)->first();
            return response()->json([
                'status'  => 'success',
                'data'    => array_merge((array) $nuevaPlanilla, $extra),
                'message' => 'Planilla generada automáticamente.'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}

