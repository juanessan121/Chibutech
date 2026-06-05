<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $exists = DB::select(
            "SELECT COUNT(*) as cnt FROM information_schema.COLUMNS
             WHERE table_schema = DATABASE() AND table_name = 'Caja_Comunitaria' AND column_name = 'fecha_registro'"
        );

        if ($exists[0]->cnt === 0) {
            DB::statement('ALTER TABLE Caja_Comunitaria ADD COLUMN fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP');
            DB::statement('ALTER TABLE Caja_Comunitaria ADD INDEX idx_caja_fecha (fecha_registro)');
        }
    }

    public function down(): void
    {
        $exists = DB::select(
            "SELECT COUNT(*) as cnt FROM information_schema.COLUMNS
             WHERE table_schema = DATABASE() AND table_name = 'Caja_Comunitaria' AND column_name = 'fecha_registro'"
        );

        if ($exists[0]->cnt > 0) {
            DB::statement('ALTER TABLE Caja_Comunitaria DROP INDEX idx_caja_fecha');
            DB::statement('ALTER TABLE Caja_Comunitaria DROP COLUMN fecha_registro');
        }
    }
};
