<?php

declare(strict_types=1);

require_once __DIR__ . '/TarifaCalculoException.php';
require_once __DIR__ . '/CalcularTarifaServicioAction.php';

use App\Actions\CalcularTarifaServicioAction;
use App\Exceptions\TarifaCalculoException;

echo "Iniciando pruebas de backend...\n";

$action = new CalcularTarifaServicioAction();

// Test 1: Planimetria <= 200 (5%)
$resultado = $action->execute(150);
assert($resultado->porcentajeCobro === 5.0, "Fallo Test 1: porcentajeCobro esperado 5.0, obtenido {$resultado->porcentajeCobro}");
assert($resultado->baseFacturable === 7.5, "Fallo Test 1: baseFacturable esperado 7.5, obtenido {$resultado->baseFacturable}");

// Test 2: Planimetria <= 500 (10%)
$resultado = $action->execute(300);
assert($resultado->porcentajeCobro === 10.0, "Fallo Test 2: porcentajeCobro esperado 10.0, obtenido {$resultado->porcentajeCobro}");
assert($resultado->baseFacturable === 30.0, "Fallo Test 2: baseFacturable esperado 30.0, obtenido {$resultado->baseFacturable}");

// Test 3: Exception on <= 0
try {
    $action->execute(0);
    echo "Fallo Test 3: No lanzó excepción en <= 0\n";
    exit(1);
} catch (TarifaCalculoException $e) {
    // OK
}

// Test 4: L5 Swagger config presence
assert(file_exists(__DIR__ . '/l5-swagger.php'), "Fallo Test 4: Falta l5-swagger.php");

echo "Todas las pruebas unitarias aisladas pasaron correctamente.\n";
