<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $exists = DB::select("
            SELECT COUNT(*) as cnt
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME   = 'Persona'
              AND COLUMN_NAME  = 'nivel_educativo'
        ");

        if ($exists[0]->cnt == 0) {
            DB::statement("ALTER TABLE Persona ADD COLUMN nivel_educativo TINYINT DEFAULT 0 AFTER id_sector");
        }
    }

    public function down(): void
    {
        $exists = DB::select("
            SELECT COUNT(*) as cnt
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME   = 'Persona'
              AND COLUMN_NAME  = 'nivel_educativo'
        ");

        if ($exists[0]->cnt > 0) {
            DB::statement("ALTER TABLE Persona DROP COLUMN nivel_educativo");
        }
    }
};
