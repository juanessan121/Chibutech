<?php
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

if (!Schema::hasTable('Copropietario_Terreno')) {
    Schema::create('Copropietario_Terreno', function (Blueprint $table) {
        $table->id('id_copropietario');
        $table->integer('id_terreno');
        $table->integer('id_persona');
        $table->timestamp('fecha_registro')->useCurrent();
        
        $table->foreign('id_terreno')->references('id_terreno')->on('Terreno')->onDelete('cascade');
        $table->foreign('id_persona')->references('id_persona')->on('Persona')->onDelete('cascade');
        
        $table->unique(['id_terreno', 'id_persona']);
    });
    echo "Tabla Copropietario_Terreno creada con exito.\n";
} else {
    echo "La tabla Copropietario_Terreno ya existe.\n";
}
