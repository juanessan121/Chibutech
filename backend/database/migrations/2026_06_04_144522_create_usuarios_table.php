<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id('id_usuario');
            $table->integer('id_persona')->unique();
            $table->string('cedula')->unique();
            $table->string('password');
            $table->string('rol'); // Admin, Presidente, Tesorero, etc.
            $table->timestamps();

            $table->foreign('id_persona')->references('id_persona')->on('Persona')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
