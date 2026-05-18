<?php

declare(strict_types=1);

namespace App\Actions\Tarifa;

use App\Exceptions\TarifaCalculoException;

class CalcularTarifaServicioAction
{
    /**
     * Calcula el precio final de un servicio aplicando descuentos e impuestos.
     *
     * @param  float  $precioBase
     * @param  float  $descuentoPorcentaje  (0–100)
     * @param  float  $ivaPorcentaje        (0–100)
     * @return float
     *
     * @throws TarifaCalculoException
     */
    public function execute(
        float $precioBase,
        float $descuentoPorcentaje = 0.0,
        float $ivaPorcentaje       = 12.0,
    ): float {
        if ($precioBase < 0) {
            throw new TarifaCalculoException('El precio base no puede ser negativo.');
        }

        if ($descuentoPorcentaje < 0 || $descuentoPorcentaje > 100) {
            throw new TarifaCalculoException('El descuento debe estar entre 0 y 100.');
        }

        $precioConDescuento = $precioBase * (1 - $descuentoPorcentaje / 100);
        $precioFinal        = $precioConDescuento * (1 + $ivaPorcentaje / 100);

        return round($precioFinal, 2);
    }
}
