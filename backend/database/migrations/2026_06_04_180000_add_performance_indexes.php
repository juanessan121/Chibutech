<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Índice en Multa.estado_pago — siempre se filtra por 'Pendiente'
        if (!$this->indexExists('Multa', 'idx_multa_estado_pago')) {
            DB::statement('ALTER TABLE Multa ADD INDEX idx_multa_estado_pago (estado_pago)');
        }

        // Índice compuesto en Asistencia_Minga — el N+1 que corregimos usa (id_minga, id_estado_asistencia)
        if (!$this->indexExists('Asistencia_Minga', 'idx_asistencia_minga_estado')) {
            DB::statement('ALTER TABLE Asistencia_Minga ADD INDEX idx_asistencia_minga_estado (id_minga, id_estado_asistencia)');
        }

        // Índice en Planilla_Cabecera — se filtra por persona+estado y por mes+año
        if (!$this->indexExists('Planilla_Cabecera', 'idx_planilla_persona_estado')) {
            DB::statement('ALTER TABLE Planilla_Cabecera ADD INDEX idx_planilla_persona_estado (id_persona, estado_pago)');
        }
        if (!$this->indexExists('Planilla_Cabecera', 'idx_planilla_mes_anio')) {
            DB::statement('ALTER TABLE Planilla_Cabecera ADD INDEX idx_planilla_mes_anio (mes_fiscal, anio_fiscal)');
        }

        // Índice en Minga.id_estado_minga — activas() y el index() filtran siempre por estado
        if (!$this->indexExists('Minga', 'idx_minga_estado')) {
            DB::statement('ALTER TABLE Minga ADD INDEX idx_minga_estado (id_estado_minga)');
        }

        // Índice en Configuracion_Global.clave — siempre se busca por clave
        if (!$this->indexExists('Configuracion_Global', 'idx_config_clave')) {
            DB::statement('ALTER TABLE Configuracion_Global ADD INDEX idx_config_clave (clave)');
        }
    }

    public function down(): void
    {
        $drops = [
            ['Multa',               'idx_multa_estado_pago'],
            ['Asistencia_Minga',    'idx_asistencia_minga_estado'],
            ['Planilla_Cabecera',   'idx_planilla_persona_estado'],
            ['Planilla_Cabecera',   'idx_planilla_mes_anio'],
            ['Minga',               'idx_minga_estado'],
            ['Configuracion_Global','idx_config_clave'],
        ];

        foreach ($drops as [$table, $idx]) {
            if ($this->indexExists($table, $idx)) {
                DB::statement("ALTER TABLE `{$table}` DROP INDEX `{$idx}`");
            }
        }
    }

    private function indexExists(string $table, string $indexName): bool
    {
        $result = DB::select(
            "SELECT COUNT(*) as cnt FROM information_schema.STATISTICS
             WHERE table_schema = DATABASE() AND table_name = ? AND index_name = ?",
            [$table, $indexName]
        );
        return $result[0]->cnt > 0;
    }
};
