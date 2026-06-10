<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/**
 * Genera planillas de agua para el mes indicado (o el mes actual si no se especifica).
 * Automático: día 1 de cada mes a las 8:00 AM (configurado en bootstrap/app.php).
 * Manual:     php artisan planillas:generar-mes --mes=6 --anio=2026
 */
Artisan::command('planillas:generar-mes {--mes= : Mes 1-12} {--anio= : Año}', function () {
    $mes  = (int) ($this->option('mes')  ?? now()->month);
    $anio = (int) ($this->option('anio') ?? now()->year);

    $this->info("Generando planillas de agua para {$mes}/{$anio}...");

    $config = DB::table('Configuracion_Global')
        ->whereIn('clave', ['TARIFA_VALOR_BASE', 'TARIFA_METROS_BASE'])
        ->pluck('valor', 'clave');
    $tarifaBase = (float) ($config['TARIFA_VALOR_BASE'] ?? 5.00);
    $metrosBase = (float) ($config['TARIFA_METROS_BASE'] ?? 1000.00);

    $generadas = 0;
    $omitidas  = 0;

    DB::beginTransaction();
    try {
        DB::table('Terreno')->orderBy('id_terreno')->chunk(200, function ($terrenos) use ($mes, $anio, $tarifaBase, $metrosBase, &$generadas, &$omitidas) {
            foreach ($terrenos as $terreno) {
                $existe = DB::table('Planilla_Cabecera as pc')
                    ->join('Planilla_Detalle_Terreno as pd', 'pc.id_planilla', '=', 'pd.id_planilla')
                    ->where('pd.id_terreno', $terreno->id_terreno)
                    ->where('pc.mes_fiscal',  $mes)
                    ->where('pc.anio_fiscal',  $anio)
                    ->exists();

                if ($existe) { $omitidas++; continue; }

                $area       = (float) $terreno->area_total;
                $fracciones = (int) ceil($area / $metrosBase);
                $subtotal   = $fracciones * $tarifaBase;

                $id_planilla = DB::table('Planilla_Cabecera')->insertGetId([
                    'id_persona'    => $terreno->id_persona,
                    'fecha_emision' => now(),
                    'anio_fiscal'   => $anio,
                    'mes_fiscal'    => $mes,
                    'total_pagar'   => $subtotal,
                    'estado_pago'   => 'Pendiente',
                ]);
                DB::table('Planilla_Detalle_Terreno')->insert([
                    'id_planilla'        => $id_planilla,
                    'id_terreno'         => $terreno->id_terreno,
                    'area_terreno_copia' => $area,
                    'subtotal_calculado' => $subtotal,
                ]);
                $generadas++;
            }
        });
        DB::commit();
        $this->info("✓ {$generadas} planillas generadas. {$omitidas} ya existían.");
    } catch (\Exception $e) {
        DB::rollBack();
        $this->error("Error: " . $e->getMessage());
    }
})->purpose('Genera planillas de agua del mes indicado (o mes actual si no se especifica)');
