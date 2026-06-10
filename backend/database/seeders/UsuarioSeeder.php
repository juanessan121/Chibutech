<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UsuarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Crear una persona ficticia para el "Super Admin" si no existe
        $persona = \Illuminate\Support\Facades\DB::table('Persona')->where('cedula', '0000000000')->first();
        if (!$persona) {
            $idPersona = \Illuminate\Support\Facades\DB::table('Persona')->insertGetId([
                'cedula' => '0000000000',
                'nombre' => 'Super',
                'apellido' => 'Administrador',
                'id_sector' => null,
            ]);
        } else {
            $idPersona = $persona->id_persona;
        }

        // 2. Crear el usuario Administrador y desvincular al anterior si hubo cruce
        $adminUser = \App\Models\Usuario::where('cedula', 'admin')->first();
        if ($adminUser) {
            $adminUser->update(['id_persona' => $idPersona]);
        } else {
            \App\Models\Usuario::create([
                'cedula' => 'admin',
                'id_persona' => $idPersona,
                'password' => \Illuminate\Support\Facades\Hash::make('admin'),
                'rol' => 'Administrador'
            ]);
        }
    }
}
