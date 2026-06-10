<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Copropietario_Terreno.id_persona — filtrado en buscarUniversal() y cálculo de deudas
        if (!$this->indexExists('Copropietario_Terreno', 'idx_coprop_persona')) {
            DB::statement('ALTER TABLE Copropietario_Terreno ADD INDEX idx_coprop_persona (id_persona)');
        }

        // Asistencia_Minga.id_persona — filtrado al cerrar registro y consultas por comunero
        if (!$this->indexExists('Asistencia_Minga', 'idx_asistencia_persona')) {
            DB::statement('ALTER TABLE Asistencia_Minga ADD INDEX idx_asistencia_persona (id_persona)');
        }

        // Condicion_Persona.id_condicion — JOIN frecuente en PersonaController::show()
        if (!$this->indexExists('Condicion_Persona', 'idx_condicion_pers_cond')) {
            DB::statement('ALTER TABLE Condicion_Persona ADD INDEX idx_condicion_pers_cond (id_condicion)');
        }
    }

    public function down(): void
    {
        $drops = [
            ['Copropietario_Terreno', 'idx_coprop_persona'],
            ['Asistencia_Minga',      'idx_asistencia_persona'],
            ['Condicion_Persona',      'idx_condicion_pers_cond'],
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
