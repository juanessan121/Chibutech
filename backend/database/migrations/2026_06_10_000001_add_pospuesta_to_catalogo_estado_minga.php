<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (!DB::table('Catalogo_Estado_Minga')->where('nombre_estado', 'Pospuesta')->exists()) {
            DB::table('Catalogo_Estado_Minga')->insert(['nombre_estado' => 'Pospuesta']);
        }
    }

    public function down(): void
    {
        DB::table('Catalogo_Estado_Minga')->where('nombre_estado', 'Pospuesta')->delete();
    }
};
