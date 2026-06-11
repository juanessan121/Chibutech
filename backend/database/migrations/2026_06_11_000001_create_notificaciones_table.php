<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Notificacion', function (Blueprint $table) {
            $table->bigIncrements('id_notificacion');
            $table->integer('id_persona');
            $table->enum('tipo', ['multa', 'minga', 'directiva', 'planilla', 'sistema']);
            $table->string('titulo', 255);
            $table->text('mensaje');
            $table->string('url_destino', 500)->nullable();
            $table->boolean('leida')->default(false);
            $table->timestamp('fecha_creacion')->useCurrent();

            $table->foreign('id_persona')
                  ->references('id_persona')
                  ->on('Persona')
                  ->onDelete('cascade');

            $table->index(['id_persona', 'leida']);
            $table->index('fecha_creacion');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Notificacion');
    }
};
