<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('Miembro_Directiva', function (Blueprint $table) {
            $table->integer('id_persona')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('Miembro_Directiva', function (Blueprint $table) {
            $table->integer('id_persona')->nullable(false)->change();
        });
    }
};
