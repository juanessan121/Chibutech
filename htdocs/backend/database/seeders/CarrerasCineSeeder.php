<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CarrerasCineSeeder extends Seeder
{
    public function run(): void
    {
        // Solo correr si la tabla está vacía
        if (DB::table('catalogo_titulo_educativo')->count() > 0) {
            $this->command->info('⏭️  Catálogo CINE ya cargado — omitiendo.');
            return;
        }

        $this->command->info('📚 Cargando 2510 títulos del catálogo CINE nacional...');

        $sqlPath = database_path('data/carreras_cine.sql');

        if (! file_exists($sqlPath)) {
            $this->command->error("❌ No se encontró el archivo: {$sqlPath}");
            return;
        }

        // Deshabilitar FK temporalmente para el TRUNCATE inicial del SQL
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        $sql = file_get_contents($sqlPath);

        // Ejecutar bloque por bloque (separados por ';')
        $statements = array_filter(
            array_map('trim', explode(';', $sql)),
            fn ($s) => ! empty($s) && ! str_starts_with($s, '--') && ! str_starts_with($s, 'SELECT')
        );

        foreach ($statements as $statement) {
            DB::unprepared($statement . ';');
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $total = DB::table('catalogo_titulo_educativo')->count();
        $this->command->info("✅ Catálogo CINE cargado — {$total} registros.");
    }
}
