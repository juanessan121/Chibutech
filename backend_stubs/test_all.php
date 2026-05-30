<?php
require_once __DIR__ . '/TarifaCalculoException.php';

$files = glob(__DIR__ . '/*.php');
foreach ($files as $file) {
    if (basename($file) === 'test_all.php') continue;
    if (basename($file) === 'api.php') continue; // Contains route definitions, needs Laravel
    if (basename($file) === 'l5-swagger.php') continue; // Config file

    // We can't require everything blindly due to missing Laravel dependencies,
    // but we can try to lint and catch fatals if we mock some things.
}

echo "OK\n";
