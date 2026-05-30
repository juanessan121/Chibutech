<?php

declare(strict_types=1);

namespace App\Actions;

use App\Exceptions\TarifaCalculoException;

/**
 * CalcularTarifaServicioAction
 * ─────────────────────────────────────────────────────────────────
 * Calcula el porcentaje de cobro para servicios de agua y luz
 * basado en la planimetría (m²) del predio.
 *
 * Regla de negocio (Chibutech):
 *   ≤ 200 m²   → 5%
 *   ≤ 500 m²   → 10%
 *   ≤ 1000 m²  → 15%
 *   > 1000 m²  → 20%
 *
 * Toda la lógica reside aquí (sin triggers ni procedimientos).
 * ─────────────────────────────────────────────────────────────────
 */
final class CalcularTarifaServicioAction
{
    // Tarifas base mensual por m² (configurables desde config/chibutech.php)
    private const TARIFA_AGUA_POR_M2 = 0.05;  // USD/m²
    private const TARIFA_LUZ_POR_M2  = 0.03;  // USD/m²

    /**
     * @param  float $planimetriaM2  Área del predio en metros cuadrados
     * @return TarifaResultado       DTO con todos los valores calculados
     *
     * @throws TarifaCalculoException  Si la planimetría es inválida
     */
    public function execute(float $planimetriaM2): TarifaResultado
    {
        $this->validarPlanimetria($planimetriaM2);

        $porcentaje = $this->resolverPorcentaje($planimetriaM2);
        $factor     = $porcentaje / 100;

        $baseFacturable = $planimetriaM2 * $factor;

        return new TarifaResultado(
            planimetriaM2:     $planimetriaM2,
            porcentajeCobro:   $porcentaje,
            baseFacturable:    round($baseFacturable, 4),
            cuotaAguaMensual:  round($baseFacturable * self::TARIFA_AGUA_POR_M2, 2),
            cuotaLuzMensual:   round($baseFacturable * self::TARIFA_LUZ_POR_M2, 2),
        );
    }

    private function resolverPorcentaje(float $m2): float
    {
        return match (true) {
            $m2 <= 200.0  => 5.0,
            $m2 <= 500.0  => 10.0,
            $m2 <= 1000.0 => 15.0,
            default        => 20.0,
        };
    }

    /**
     * @throws TarifaCalculoException
     */
    private function validarPlanimetria(float $m2): void
    {
        if ($m2 <= 0) {
            throw new TarifaCalculoException(
                "La planimetría debe ser mayor a 0 m². Recibido: {$m2}"
            );
        }

        if ($m2 > 100_000) {
            throw new TarifaCalculoException(
                "Planimetría excede el límite máximo permitido (100.000 m²). Recibido: {$m2}"
            );
        }
    }
}

// ─────────────────────────────────────────────────────────────────
//  DTO — TarifaResultado (PHP 8.2 readonly)
// ─────────────────────────────────────────────────────────────────
final readonly class TarifaResultado
{
    public function __construct(
        public float $planimetriaM2,
        public float $porcentajeCobro,
        public float $baseFacturable,
        public float $cuotaAguaMensual,
        public float $cuotaLuzMensual,
    ) {}

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return [
            'planimetria_m2'    => $this->planimetriaM2,
            'porcentaje_cobro'  => $this->porcentajeCobro,
            'base_facturable'   => $this->baseFacturable,
            'cuota_agua_mensual' => $this->cuotaAguaMensual,
            'cuota_luz_mensual'  => $this->cuotaLuzMensual,
            'total_mensual'      => round($this->cuotaAguaMensual + $this->cuotaLuzMensual, 2),
        ];
    }
}
