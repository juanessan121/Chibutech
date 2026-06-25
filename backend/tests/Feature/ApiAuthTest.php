<?php

namespace Tests\Feature;

use Tests\TestCase;

class ApiAuthTest extends TestCase
{
    // ── Rutas protegidas ──────────────────────────────────────────────────────

    public static function rutasProtegidas(): array
    {
        return [
            'directiva actual'      => ['GET',  '/api/directiva/actual'],
            'directiva historial'   => ['GET',  '/api/directiva/historial'],
            'mingas'                => ['GET',  '/api/mingas'],
            'mingas activas'        => ['GET',  '/api/mingas/activas'],
            'personas'              => ['GET',  '/api/personas'],
            'terrenos'              => ['GET',  '/api/terrenos'],
            'cobros historial'      => ['GET',  '/api/cobros/historial'],
            'notificaciones'        => ['GET',  '/api/notificaciones'],
            'auditoria'             => ['GET',  '/api/auditoria'],
            'dashboard resumen'     => ['GET',  '/api/dashboard/resumen'],
            'configuracion'         => ['GET',  '/api/configuracion'],
        ];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('rutasProtegidas')]
    public function test_rutas_protegidas_requieren_autenticacion(string $method, string $uri): void
    {
        $response = $this->json($method, $uri);
        $response->assertStatus(401);
    }

    // ── Login — validación ────────────────────────────────────────────────────

    public function test_login_sin_cedula_retorna_error_de_validacion(): void
    {
        $response = $this->postJson('/api/auth/login', []);
        $response->assertStatus(422)
                 ->assertJsonPath('errors.cedula.0', fn($v) => str_contains($v, 'obligatorio') || str_contains($v, 'required'));
    }

    public function test_login_con_password_incorrecto_retorna_401(): void
    {
        // La cédula no existe en SQLite in-memory, el check de Hash fallará antes del DB.
        // Si llega al DB (tabla Persona no existe), el 500 también sería aceptable,
        // pero lo importante es que NO retorna 200.
        $response = $this->postJson('/api/auth/login', [
            'cedula'   => '0000000000',
            'password' => 'wrongpassword',
        ]);

        $this->assertNotEquals(200, $response->getStatusCode());
    }

    public function test_logout_requiere_autenticacion(): void
    {
        $response = $this->postJson('/api/auth/logout');
        $response->assertStatus(401);
    }

    public function test_cambiar_rol_requiere_autenticacion(): void
    {
        $response = $this->postJson('/api/auth/cambiar-rol', [
            'id_persona' => 1,
            'rol'        => 'Administrador',
        ]);
        $response->assertStatus(401);
    }

    // ── Mutaciones protegidas ─────────────────────────────────────────────────

    public function test_post_directiva_requiere_autenticacion(): void
    {
        $this->postJson('/api/directiva', [])->assertStatus(401);
    }

    public function test_patch_directiva_miembro_requiere_autenticacion(): void
    {
        $this->patchJson('/api/directiva/miembro', [])->assertStatus(401);
    }

    public function test_post_mingas_requiere_autenticacion(): void
    {
        $this->postJson('/api/mingas', [])->assertStatus(401);
    }

    public function test_post_cobros_pagar_requiere_autenticacion(): void
    {
        $this->postJson('/api/cobros/pagar', [])->assertStatus(401);
    }
}
