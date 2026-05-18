<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rol_sistema', function (Blueprint $table) {
            $table->id('id_rol');
            $table->string('nombre_rol', 50)->unique();
        });

        Schema::create('permiso_sistema', function (Blueprint $table) {
            $table->id('id_permiso');
            $table->string('nombre_permiso', 100)->unique();
            $table->string('modulo', 50)->comment('Ej: Finanzas, Catastro, Usuarios, Configuración');
        });

        Schema::create('permiso_rol', function (Blueprint $table) {
            $table->unsignedBigInteger('id_rol');
            $table->unsignedBigInteger('id_permiso');
            $table->primary(['id_rol', 'id_permiso']);

            $table->foreign('id_rol')
                ->references('id_rol')->on('rol_sistema')
                ->onDelete('cascade');

            $table->foreign('id_permiso')
                ->references('id_permiso')->on('permiso_sistema')
                ->onDelete('cascade');
        });

        Schema::create('usuario_sistema', function (Blueprint $table) {
            $table->id('id_usuario');
            $table->unsignedBigInteger('id_persona');
            $table->unsignedBigInteger('id_rol');
            $table->string('username', 50)->unique();
            $table->string('password_hash', 255);
            $table->string('password_salt', 255);

            $table->foreign('id_persona')
                ->references('id_persona')->on('persona');

            $table->foreign('id_rol')
                ->references('id_rol')->on('rol_sistema');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuario_sistema');
        Schema::dropIfExists('permiso_rol');
        Schema::dropIfExists('permiso_sistema');
        Schema::dropIfExists('rol_sistema');
    }
};