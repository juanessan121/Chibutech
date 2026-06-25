<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class ValidatorsTest extends TestCase
{
    // ── Regla de negocio: fecha directiva no puede ser >2 meses atrás ─────────

    private function esFechaValida(string $fecha): bool
    {
        $nueva      = new \DateTime($fecha);
        $limiteAtras = (new \DateTime())->modify('-2 months');
        return $nueva >= $limiteAtras;
    }

    public function test_fecha_directiva_de_hoy_es_valida(): void
    {
        $this->assertTrue($this->esFechaValida(date('Y-m-d')));
    }

    public function test_fecha_directiva_de_hace_3_meses_es_invalida(): void
    {
        $tresMesesAtras = date('Y-m-d', strtotime('-3 months'));
        $this->assertFalse($this->esFechaValida($tresMesesAtras));
    }

    public function test_fecha_directiva_de_hace_1_mes_es_valida(): void
    {
        $unMesAtras = date('Y-m-d', strtotime('-1 month'));
        $this->assertTrue($this->esFechaValida($unMesAtras));
    }

    public function test_fecha_directiva_futura_es_valida(): void
    {
        $manana = date('Y-m-d', strtotime('+1 day'));
        $this->assertTrue($this->esFechaValida($manana));
    }

    // ── Regla de negocio: mapa de roles directiva ─────────────────────────────

    private function rolPorCargo(int $idCargo): string
    {
        return match ($idCargo) {
            1 => 'Presidente',
            2 => 'Vicepresidente',
            3 => 'Secretario',
            4 => 'Tesorero',
            default => 'Vocal',
        };
    }

    public function test_cargo_1_asigna_rol_presidente(): void
    {
        $this->assertSame('Presidente', $this->rolPorCargo(1));
    }

    public function test_cargo_2_asigna_rol_vicepresidente(): void
    {
        $this->assertSame('Vicepresidente', $this->rolPorCargo(2));
    }

    public function test_cargo_3_asigna_rol_secretario(): void
    {
        $this->assertSame('Secretario', $this->rolPorCargo(3));
    }

    public function test_cargo_4_asigna_rol_tesorero(): void
    {
        $this->assertSame('Tesorero', $this->rolPorCargo(4));
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('cargosVocales')]
    public function test_cargos_5_al_9_asignan_rol_vocal(int $idCargo): void
    {
        $this->assertSame('Vocal', $this->rolPorCargo($idCargo));
    }

    public static function cargosVocales(): array
    {
        return [[5], [6], [7], [8], [9]];
    }

    public function test_cargo_desconocido_asigna_rol_vocal(): void
    {
        $this->assertSame('Vocal', $this->rolPorCargo(99));
    }
}
