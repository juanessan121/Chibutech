<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('auditoria', function (Blueprint $table) {
            $table->bigIncrements('id_auditoria');
            $table->string('tabla_afectada', 100)->comment('Nombre de la tabla modificada');
            $table->enum('operacion', ['INSERT', 'UPDATE', 'DELETE']);
            $table->string('id_registro', 50)->comment('PK del registro afectado');
            $table->json('datos_anteriores')->nullable()->comment('Valores ANTES del cambio (NULL en INSERT)');
            $table->json('datos_nuevos')->nullable()->comment('Valores DESPUÉS del cambio (NULL en DELETE)');
            $table->unsignedInteger('id_usuario')->nullable()->comment('Usuario del sistema que ejecutó la acción');
            $table->dateTime('fecha_hora')->useCurrent();
            $table->string('ip_origen', 45)->nullable()->comment('IP de conexión (llenada por el backend)');

            $table->index('tabla_afectada', 'idx_aud_tabla');
            $table->index('fecha_hora',     'idx_aud_fecha');
            $table->index('id_usuario',     'idx_aud_usuario');
            $table->index('operacion',      'idx_aud_operacion');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auditoria');
    }
};
