<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class PermissionsTest extends TestCase
{
    private function permisosParaRol(string $rol): array
    {
        return match ($rol) {
            'Administrador' => [
                'ver_dashboard', 'crear_usuario', 'editar_usuario', 'eliminar_usuario',
                'gestionar_multas', 'gestionar_mingas', 'ver_reportes',
                'ver_usuarios', 'ver_mingas', 'ver_catastro', 'administrar_sistema',
            ],
            'Presidente' => [
                'ver_dashboard', 'crear_usuario', 'editar_usuario', 'eliminar_usuario',
                'gestionar_multas', 'gestionar_mingas', 'ver_reportes',
                'ver_usuarios', 'ver_mingas', 'ver_catastro',
            ],
            'Vicepresidente' => [
                'ver_dashboard', 'ver_reportes', 'ver_usuarios', 'ver_catastro',
            ],
            'Secretario' => [
                'ver_dashboard', 'gestionar_mingas', 'crear_usuario', 'editar_usuario',
                'ver_usuarios', 'ver_mingas', 'ver_catastro',
            ],
            'Tesorero' => [
                'ver_dashboard', 'gestionar_multas', 'ver_reportes',
            ],
            default => ['ver_dashboard', 'ver_mingas'],
        };
    }

    public function test_administrador_tiene_acceso_total(): void
    {
        $permisos = $this->permisosParaRol('Administrador');

        $this->assertContains('administrar_sistema', $permisos);
        $this->assertContains('eliminar_usuario', $permisos);
        $this->assertContains('gestionar_multas', $permisos);
        $this->assertContains('gestionar_mingas', $permisos);
    }

    public function test_presidente_no_tiene_administrar_sistema(): void
    {
        $permisos = $this->permisosParaRol('Presidente');

        $this->assertNotContains('administrar_sistema', $permisos);
        $this->assertContains('gestionar_multas', $permisos);
        $this->assertContains('gestionar_mingas', $permisos);
        $this->assertContains('crear_usuario', $permisos);
    }

    public function test_administrador_y_presidente_difieren_solo_en_administrar_sistema(): void
    {
        $admin      = $this->permisosParaRol('Administrador');
        $presidente = $this->permisosParaRol('Presidente');

        $diferencia = array_diff($admin, $presidente);

        $this->assertCount(1, $diferencia);
        $this->assertContains('administrar_sistema', $diferencia);
    }

    public function test_secretario_no_gestiona_multas(): void
    {
        $permisos = $this->permisosParaRol('Secretario');

        $this->assertNotContains('gestionar_multas', $permisos);
        $this->assertContains('gestionar_mingas', $permisos);
    }

    public function test_tesorero_no_ve_usuarios_ni_mingas(): void
    {
        $permisos = $this->permisosParaRol('Tesorero');

        $this->assertNotContains('ver_usuarios', $permisos);
        $this->assertNotContains('gestionar_mingas', $permisos);
        $this->assertContains('gestionar_multas', $permisos);
    }

    public function test_vicepresidente_solo_tiene_acceso_de_lectura(): void
    {
        $permisos = $this->permisosParaRol('Vicepresidente');

        $this->assertNotContains('gestionar_multas', $permisos);
        $this->assertNotContains('gestionar_mingas', $permisos);
        $this->assertNotContains('crear_usuario', $permisos);
        $this->assertContains('ver_reportes', $permisos);
    }

    public function test_vocal_solo_puede_ver_mingas(): void
    {
        $permisos = $this->permisosParaRol('Vocal Principal 1');

        $this->assertCount(2, $permisos);
        $this->assertContains('ver_dashboard', $permisos);
        $this->assertContains('ver_mingas', $permisos);
    }

    public function test_todos_los_roles_tienen_ver_dashboard(): void
    {
        $roles = [
            'Administrador', 'Presidente', 'Vicepresidente',
            'Secretario', 'Tesorero', 'Vocal Principal 1',
        ];

        foreach ($roles as $rol) {
            $this->assertContains(
                'ver_dashboard',
                $this->permisosParaRol($rol),
                "El rol '{$rol}' debe tener 'ver_dashboard'."
            );
        }
    }
}
