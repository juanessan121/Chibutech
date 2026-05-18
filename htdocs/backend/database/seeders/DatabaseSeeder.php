<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ─── 1. Catálogos base ───────────────────────────────────────────────

        DB::table('catalogo_condicion_especial')->insertOrIgnore([
            ['nombre_condicion' => 'Ninguna'],
            ['nombre_condicion' => 'Tercera Edad'],
            ['nombre_condicion' => 'Discapacidad'],
            ['nombre_condicion' => 'Viudez'],
            ['nombre_condicion' => 'Enfermedad Catastrófica'],
        ]);

        DB::table('catalogo_tipo_contacto')->insertOrIgnore([
            ['nombre_tipo' => 'Celular'],
            ['nombre_tipo' => 'Teléfono Fijo'],
            ['nombre_tipo' => 'Correo Electrónico'],
            ['nombre_tipo' => 'WhatsApp'],
        ]);

        DB::table('catalogo_estado_construccion')->insertOrIgnore([
            ['nombre_estado' => 'Lote Baldío'],
            ['nombre_estado' => 'En Planificación'],
            ['nombre_estado' => 'En Construcción'],
            ['nombre_estado' => 'Construida'],
        ]);

        DB::table('catalogo_nivel_academico')->insertOrIgnore([
            ['id_nivel_academico' => 1, 'nombre_nivel' => 'No Especificado'],
            ['id_nivel_academico' => 2, 'nombre_nivel' => 'Técnico/Tecnológico'],
            ['id_nivel_academico' => 3, 'nombre_nivel' => 'Tercer Nivel'],
            ['id_nivel_academico' => 4, 'nombre_nivel' => 'Cuarto Nivel'],
            ['id_nivel_academico' => 5, 'nombre_nivel' => 'Quinto Nivel'],
        ]);

        // ─── 2. RBAC — Roles y Permisos ──────────────────────────────────────

        DB::table('rol_sistema')->insertOrIgnore([
            ['nombre_rol' => 'Administrador'],
            ['nombre_rol' => 'Directivo'],
            ['nombre_rol' => 'Operador'],
            ['nombre_rol' => 'Consultor'],
        ]);

        $permisos = [
            ['nombre_permiso' => 'usuarios.ver',          'modulo' => 'Usuarios'],
            ['nombre_permiso' => 'usuarios.crear',        'modulo' => 'Usuarios'],
            ['nombre_permiso' => 'usuarios.editar',       'modulo' => 'Usuarios'],
            ['nombre_permiso' => 'usuarios.eliminar',     'modulo' => 'Usuarios'],
            ['nombre_permiso' => 'personas.ver',          'modulo' => 'Catastro'],
            ['nombre_permiso' => 'personas.crear',        'modulo' => 'Catastro'],
            ['nombre_permiso' => 'personas.editar',       'modulo' => 'Catastro'],
            ['nombre_permiso' => 'personas.eliminar',     'modulo' => 'Catastro'],
            ['nombre_permiso' => 'terrenos.ver',          'modulo' => 'Catastro'],
            ['nombre_permiso' => 'terrenos.gestionar',    'modulo' => 'Catastro'],
            ['nombre_permiso' => 'multas.ver',            'modulo' => 'Finanzas'],
            ['nombre_permiso' => 'multas.gestionar',      'modulo' => 'Finanzas'],
            ['nombre_permiso' => 'caja.ver',              'modulo' => 'Finanzas'],
            ['nombre_permiso' => 'caja.registrar',        'modulo' => 'Finanzas'],
            ['nombre_permiso' => 'config.ver',            'modulo' => 'Configuración'],
            ['nombre_permiso' => 'config.editar',         'modulo' => 'Configuración'],
            ['nombre_permiso' => 'catalogos.gestionar',   'modulo' => 'Configuración'],
            ['nombre_permiso' => 'directiva.ver',         'modulo' => 'Directiva'],
            ['nombre_permiso' => 'directiva.gestionar',   'modulo' => 'Directiva'],
        ];
        DB::table('permiso_sistema')->insertOrIgnore($permisos);

        $idAdmin     = DB::table('rol_sistema')->where('nombre_rol', 'Administrador')->value('id_rol');
        $idDirectivo = DB::table('rol_sistema')->where('nombre_rol', 'Directivo')->value('id_rol');
        $idOperador  = DB::table('rol_sistema')->where('nombre_rol', 'Operador')->value('id_rol');
        $idConsultor = DB::table('rol_sistema')->where('nombre_rol', 'Consultor')->value('id_rol');

        // Admin → todos los permisos
        foreach (DB::table('permiso_sistema')->pluck('id_permiso') as $idP) {
            DB::table('permiso_rol')->insertOrIgnore(['id_rol' => $idAdmin, 'id_permiso' => $idP]);
        }

        // Directivo
        foreach (DB::table('permiso_sistema')->whereIn('nombre_permiso', [
            'personas.ver','terrenos.ver','multas.ver','multas.gestionar',
            'caja.ver','caja.registrar','directiva.ver','directiva.gestionar',
        ])->pluck('id_permiso') as $idP) {
            DB::table('permiso_rol')->insertOrIgnore(['id_rol' => $idDirectivo, 'id_permiso' => $idP]);
        }

        // Operador
        foreach (DB::table('permiso_sistema')->whereIn('nombre_permiso', [
            'personas.ver','personas.crear','personas.editar',
            'terrenos.ver','terrenos.gestionar',
            'multas.ver','multas.gestionar','caja.ver','caja.registrar',
        ])->pluck('id_permiso') as $idP) {
            DB::table('permiso_rol')->insertOrIgnore(['id_rol' => $idOperador, 'id_permiso' => $idP]);
        }

        // Consultor → solo .ver
        foreach (DB::table('permiso_sistema')->where('nombre_permiso', 'like', '%.ver')->pluck('id_permiso') as $idP) {
            DB::table('permiso_rol')->insertOrIgnore(['id_rol' => $idConsultor, 'id_permiso' => $idP]);
        }

        // ─── 3. Persona y usuario administrador inicial ───────────────────────

        if (! DB::table('persona')->where('cedula', '0000000000')->exists()) {
            $idPersona = DB::table('persona')->insertGetId([
                'cedula'                => '0000000000',
                'nombre'               => 'Admin',
                'apellido'             => 'Sistema',
                'id_condicion_especial' => 1,
                'estado_vital'         => 'Vivo',
            ]);

            $salt = bin2hex(random_bytes(16));

            DB::table('usuario_sistema')->insertOrIgnore([
                'id_persona'    => $idPersona,
                'id_rol'        => $idAdmin,
                'username'      => 'admin',
                'password_hash' => Hash::make('Chibutech2025!' . $salt),
                'password_salt' => $salt,
            ]);
        }

        // ─── 4. Configuracion_Global inicial ────────────────────────────────

        DB::table('configuracion_global')->insertOrIgnore([
            ['clave' => 'nombre_junta',        'valor' => 'Junta de Agua Chibutech', 'tipo_dato' => 'Texto'],
            ['clave' => 'iva_porcentaje',       'valor' => '12',                     'tipo_dato' => 'Decimal'],
            ['clave' => 'mora_diaria',          'valor' => '0.50',                   'tipo_dato' => 'Decimal'],
            ['clave' => 'max_meses_mora',       'valor' => '6',                      'tipo_dato' => 'Entero'],
            ['clave' => 'notificaciones_email', 'valor' => 'true',                   'tipo_dato' => 'Booleano'],
        ]);

        $this->command->info('✅ Seeder completo — usuario: admin / Chibutech2025!');
    }
}
