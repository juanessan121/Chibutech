<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Perfil educativo
        Schema::create('perfil_educativo_persona', function (Blueprint $table) {
            $table->id('id_perfil');
            $table->unsignedBigInteger('id_persona');
            $table->string('codigo_titulo_cine', 15);
            $table->enum('estado_estudio_universidad', ['Cursando', 'Finalizado', 'Abandonado'])
                  ->default('Finalizado');

            $table->foreign('id_persona')
                  ->references('id_persona')->on('persona')
                  ->onDelete('cascade');

            $table->foreign('codigo_titulo_cine')
                  ->references('codigo')->on('catalogo_titulo_educativo');
        });

        // Contactos
        Schema::create('contacto_persona', function (Blueprint $table) {
            $table->id('id_contacto');
            $table->unsignedBigInteger('id_persona');
            $table->unsignedBigInteger('id_tipo_contacto');
            $table->string('valor_contacto', 150);
            $table->string('operadora_o_detalle', 50)->nullable()
                  ->comment('Ej: Claro, Movistar, CNT, Trabajo, Casa');
            $table->boolean('es_principal')->default(false);

            $table->foreign('id_persona')
                  ->references('id_persona')->on('persona')
                  ->onDelete('cascade');

            $table->foreign('id_tipo_contacto')
                  ->references('id_tipo_contacto')->on('catalogo_tipo_contacto')
                  ->onDelete('restrict');
        });

        // Catastro
        Schema::create('terreno', function (Blueprint $table) {
            $table->id('id_terreno');
            $table->unsignedBigInteger('id_persona');
            $table->string('clave_catastral', 50)->unique();
            $table->decimal('area_total', 10, 2);
            $table->unsignedBigInteger('id_estado_construccion')->default(1);

            $table->foreign('id_persona')
                  ->references('id_persona')->on('persona');

            $table->foreign('id_estado_construccion')
                  ->references('id_estado_construccion')->on('catalogo_estado_construccion')
                  ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('terreno');
        Schema::dropIfExists('contacto_persona');
        Schema::dropIfExists('perfil_educativo_persona');
    }
};
