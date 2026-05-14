<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

final class RbacSeeder extends Seeder
{
    /**
     * Estructura de roles y permisos de Chibutech.
     * Módulos: comuneros | profesiones | servicios | multas | dashboard | admin
     */
    public function run(): void
    {
        // ── 1. Permisos ───────────────────────────────────────────────────────
        $permisosData = [
            // Comuneros / Padrón
            ['nombre' => 'Ver comuneros',       'slug' => 'ver-comuneros',       'modulo' => 'comuneros'],
            ['nombre' => 'Crear comunero',      'slug' => 'crear-comunero',      'modulo' => 'comuneros'],
            ['nombre' => 'Editar comunero',     'slug' => 'editar-comunero',     'modulo' => 'comuneros'],
            ['nombre' => 'Eliminar comunero',   'slug' => 'eliminar-comunero',   'modulo' => 'comuneros'],
            // Profesiones
            ['nombre' => 'Ver profesiones',     'slug' => 'ver-profesiones',     'modulo' => 'profesiones'],
            // Servicios / Cuotas
            ['nombre' => 'Ver servicios',       'slug' => 'ver-servicios',       'modulo' => 'servicios'],
            ['nombre' => 'Gestionar cuotas',    'slug' => 'gestionar-cuotas',    'modulo' => 'servicios'],
            ['nombre' => 'Ver pagos',           'slug' => 'ver-pagos',           'modulo' => 'servicios'],
            // Multas
            ['nombre' => 'Ver multas',          'slug' => 'ver-multas',          'modulo' => 'multas'],
            ['nombre' => 'Emitir multa',        'slug' => 'emitir-multa',        'modulo' => 'multas'],
            ['nombre' => 'Anular multa',        'slug' => 'anular-multa',        'modulo' => 'multas'],
            // Dashboard
            ['nombre' => 'Ver dashboard zona',  'slug' => 'ver-dashboard-zona',  'modulo' => 'dashboard'],
            // Admin
            ['nombre' => 'Gestionar usuarios',  'slug' => 'gestionar-usuarios',  'modulo' => 'admin'],
            ['nombre' => 'Gestionar roles',     'slug' => 'gestionar-roles',     'modulo' => 'admin'],
        ];

        $permisos = collect($permisosData)->map(
            fn (array $data) => Permission::firstOrCreate(['slug' => $data['slug']], $data)
        );

        $bySlug = fn (string $slug) => $permisos->firstWhere('slug', $slug);

        // ── 2. Roles ──────────────────────────────────────────────────────────
        $admin = Role::firstOrCreate(
            ['slug' => 'admin'],
            ['nombre' => 'Administrador', 'descripcion' => 'Acceso total al sistema']
        );
        $jefeArea = Role::firstOrCreate(
            ['slug' => 'jefe-area'],
            ['nombre' => 'Jefe de Área', 'descripcion' => 'Gestiona su zona territorial']
        );
        $secretario = Role::firstOrCreate(
            ['slug' => 'secretario'],
            ['nombre' => 'Secretario', 'descripcion' => 'Consulta y registro de padrón']
        );
        $visitante = Role::firstOrCreate(
            ['slug' => 'visitante'],
            ['nombre' => 'Visitante', 'descripcion' => 'Solo lectura']
        );

        // ── 3. Asignación permisos → roles ────────────────────────────────────
        $admin->permissions()->sync($permisos->pluck('id')->toArray());

        $jefeArea->permissions()->sync(
            $permisos->filter(
                fn (Permission $p) => in_array($p->slug, [
                    'ver-comuneros', 'ver-servicios', 'gestionar-cuotas',
                    'ver-pagos', 'ver-multas', 'emitir-multa',
                    'ver-dashboard-zona', 'ver-profesiones',
                ], true)
            )->pluck('id')->toArray()
        );

        $secretario->permissions()->sync(
            $permisos->filter(
                fn (Permission $p) => in_array($p->slug, [
                    'ver-comuneros', 'crear-comunero', 'editar-comunero',
                    'ver-profesiones', 'ver-servicios', 'ver-pagos',
                ], true)
            )->pluck('id')->toArray()
        );

        $visitante->permissions()->sync(
            $permisos->filter(
                fn (Permission $p) => in_array($p->slug, [
                    'ver-comuneros', 'ver-profesiones',
                ], true)
            )->pluck('id')->toArray()
        );

        // ── 4. Usuario de prueba por rol ──────────────────────────────────────
        $usersDemo = [
            [
                'nombre'        => 'Admin Chibutech',
                'email'         => 'admin@chibutech.ec',
                'password'      => Hash::make('Admin1234!'),
                'zona_asignada' => null,
                'role'          => $admin,
            ],
            [
                'nombre'        => 'Jefe Zona Norte',
                'email'         => 'jefe.norte@chibutech.ec',
                'password'      => Hash::make('Jefe1234!'),
                'zona_asignada' => 'ZONA_NORTE',
                'role'          => $jefeArea,
            ],
            [
                'nombre'        => 'Secretario General',
                'email'         => 'secretario@chibutech.ec',
                'password'      => Hash::make('Secre1234!'),
                'zona_asignada' => null,
                'role'          => $secretario,
            ],
        ];

        foreach ($usersDemo as $data) {
            $role = $data['role'];
            unset($data['role']);

            $user = User::firstOrCreate(['email' => $data['email']], $data);
            $user->roles()->syncWithoutDetaching([$role->id]);
        }
    }
}
