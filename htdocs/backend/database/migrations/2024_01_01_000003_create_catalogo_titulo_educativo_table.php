<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('catalogo_titulo_educativo', function (Blueprint $table) {
            $table->string('codigo', 15)->primary();
            $table->string('nombre', 255);
            $table->integer('nivel_jerarquico')->comment('Profundidad en árbol CINE: 1, 3, 6, 9');
            $table->unsignedBigInteger('id_nivel_academico')->default(1);
            $table->string('parent_codigo', 15)->nullable();

            $table->foreign('id_nivel_academico')
                  ->references('id_nivel_academico')->on('catalogo_nivel_academico')
                  ->onDelete('restrict');

            $table->foreign('parent_codigo')
                  ->references('codigo')->on('catalogo_titulo_educativo')
                  ->onDelete('restrict');

            $table->index('nivel_jerarquico', 'idx_cat_nivel_jerarquico');
            // FULLTEXT se agrega raw porque Blueprint no lo soporta limpio en todos los motores
        });

        \DB::statement('ALTER TABLE catalogo_titulo_educativo ADD FULLTEXT INDEX idx_cat_nombre (nombre)');
    }

    public function down(): void
    {
        Schema::dropIfExists('catalogo_titulo_educativo');
    }
};
