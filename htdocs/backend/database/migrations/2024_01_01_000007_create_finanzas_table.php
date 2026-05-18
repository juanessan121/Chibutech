<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('multa', function (Blueprint $table) {
            $table->id('id_multa');
            $table->unsignedBigInteger('id_persona');
            $table->string('motivo_multa', 200);
            $table->decimal('monto', 8, 2);
            $table->enum('estado_pago', ['Pendiente', 'Pagada', 'Anulada'])->default('Pendiente');
            $table->timestamp('fecha_emision')->useCurrent();

            $table->foreign('id_persona')
                  ->references('id_persona')->on('persona')
                  ->onDelete('cascade');
        });

        Schema::create('caja_comunitaria', function (Blueprint $table) {
            $table->id('id_transaccion');
            $table->string('numero_comprobante', 50)->unique()->nullable();
            $table->enum('tipo_movimiento', ['Ingreso', 'Egreso']);
            $table->string('concepto', 255);
            $table->unsignedBigInteger('id_multa')->nullable();
            $table->decimal('monto', 12, 2);
            $table->unsignedBigInteger('responsable_registro');

            $table->foreign('id_multa')
                  ->references('id_multa')->on('multa')
                  ->onDelete('set null');

            $table->foreign('responsable_registro')
                  ->references('id_usuario')->on('usuario_sistema');
        });

        Schema::create('configuracion_global', function (Blueprint $table) {
            $table->id('id_configuracion');
            $table->string('clave', 100)->unique();
            $table->string('valor', 255);
            $table->enum('tipo_dato', ['Entero', 'Decimal', 'Texto', 'Booleano']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('configuracion_global');
        Schema::dropIfExists('caja_comunitaria');
        Schema::dropIfExists('multa');
    }
};
