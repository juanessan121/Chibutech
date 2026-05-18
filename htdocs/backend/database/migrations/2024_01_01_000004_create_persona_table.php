<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('persona', function (Blueprint $table) {
            $table->id('id_persona');
            $table->string('cedula', 15)->unique();
            $table->string('nombre', 100);
            $table->string('apellido', 100);
            $table->date('fecha_nacimiento')->nullable();
            $table->unsignedBigInteger('id_zona')->nullable();
            $table->unsignedBigInteger('id_representante_familia')->nullable()
                  ->comment('Padre/tutor si es dependiente');
            $table->unsignedBigInteger('id_condicion_especial')->default(1);
            $table->enum('estado_vital', ['Vivo', 'Fallecido'])->default('Vivo');
            $table->date('fecha_defuncion')->nullable();

            $table->foreign('id_zona')
                  ->references('id_zona')->on('zona')
                  ->onDelete('set null');

            $table->foreign('id_representante_familia')
                  ->references('id_persona')->on('persona')
                  ->onDelete('set null');

            $table->foreign('id_condicion_especial')
                  ->references('id_condicion')->on('catalogo_condicion_especial')
                  ->onDelete('restrict');
        });

        Schema::create('miembro_directiva', function (Blueprint $table) {
            $table->id('id_directiva');
            $table->unsignedBigInteger('id_persona');
            $table->unsignedBigInteger('id_cargo_directivo');
            $table->date('fecha_inicio');
            $table->date('fecha_fin')->nullable();
            $table->enum('estado', ['Activo', 'Finalizado'])->default('Activo');

            $table->foreign('id_persona')
                  ->references('id_persona')->on('persona')
                  ->onDelete('cascade');

            $table->foreign('id_cargo_directivo')
                  ->references('id_cargo_directivo')->on('catalogo_cargo_directivo')
                  ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('miembro_directiva');
        Schema::dropIfExists('persona');
    }
};
