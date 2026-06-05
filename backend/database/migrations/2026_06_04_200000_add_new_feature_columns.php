<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $check = fn($table, $col) => DB::select(
            "SELECT COUNT(*) as cnt FROM information_schema.COLUMNS
             WHERE table_schema=DATABASE() AND table_name=? AND column_name=?",
            [$table, $col]
        )[0]->cnt > 0;

        if (!$check('Persona', 'estado_registro')) {
            DB::statement("ALTER TABLE Persona ADD COLUMN estado_registro ENUM('Activo','Pendiente') NOT NULL DEFAULT 'Activo' AFTER estado_vital");
        }

        if (!$check('Condicion_Persona', 'archivo_carnet')) {
            DB::statement("ALTER TABLE Condicion_Persona ADD COLUMN archivo_carnet VARCHAR(255) NULL AFTER codigo_carnet");
        }

        if (!$check('Perfil_Educativo_Persona', 'archivo_titulo')) {
            DB::statement("ALTER TABLE Perfil_Educativo_Persona ADD COLUMN archivo_titulo VARCHAR(255) NULL");
        }
    }

    public function down(): void {}
};
