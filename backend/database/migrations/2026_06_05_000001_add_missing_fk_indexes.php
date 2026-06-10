<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Terreno.id_persona — generarMesActual hace JOIN Terreno→Planilla_Cabecera por persona
        if (!$this->indexExists('Terreno', 'idx_terreno_persona')) {
            DB::statement('ALTER TABLE Terreno ADD INDEX idx_terreno_persona (id_persona)');
        }

        // Planilla_Detalle_Terreno.id_terreno — filtro central en planillasPeriodo y cobros
        if (!$this->indexExists('Planilla_Detalle_Terreno', 'idx_planilla_detalle_terreno')) {
            DB::statement('ALTER TABLE Planilla_Detalle_Terreno ADD INDEX idx_planilla_detalle_terreno (id_terreno)');
        }

        // Persona.id_sector — JOIN frecuente desde Catastro/Padrón
        if (!$this->indexExists('Persona', 'idx_persona_sector')) {
            DB::statement('ALTER TABLE Persona ADD INDEX idx_persona_sector (id_sector)');
        }
    }

    public function down(): void
    {
        $drops = [
            ['Terreno',                  'idx_terreno_persona'],
            ['Planilla_Detalle_Terreno', 'idx_planilla_detalle_terreno'],
            ['Persona',                  'idx_persona_sector'],
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
