<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1.1 Geográficos
        Schema::create('zona', function (Blueprint $table) {
            $table->id('id_zona');
            $table->string('nombre_zona', 100)->unique();
            $table->text('descripcion')->nullable();
        });

        Schema::create('catalogo_cargo_directivo', function (Blueprint $table) {
            $table->id('id_cargo_directivo');
            $table->string('nombre_cargo', 100)->unique();
            $table->text('descripcion')->nullable();
        });

        // 1.2 Personas y Contactos
        Schema::create('catalogo_condicion_especial', function (Blueprint $table) {
            $table->id('id_condicion');
            $table->string('nombre_condicion', 100)->unique();
        });

        Schema::create('catalogo_tipo_contacto', function (Blueprint $table) {
            $table->id('id_tipo_contacto');
            $table->string('nombre_tipo', 50)->unique();
        });

        // 1.3 Infraestructura
        Schema::create('catalogo_estado_construccion', function (Blueprint $table) {
            $table->id('id_estado_construccion');
            $table->string('nombre_estado', 50)->unique();
        });

        // 1.4 Niveles Académicos
        Schema::create('catalogo_nivel_academico', function (Blueprint $table) {
            $table->id('id_nivel_academico');
            $table->string('nombre_nivel', 100)->unique();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('catalogo_nivel_academico');
        Schema::dropIfExists('catalogo_estado_construccion');
        Schema::dropIfExists('catalogo_tipo_contacto');
        Schema::dropIfExists('catalogo_condicion_especial');
        Schema::dropIfExists('catalogo_cargo_directivo');
        Schema::dropIfExists('zona');
    }
};
