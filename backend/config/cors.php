<?php

// FRONTEND_URL (definida en .env, generada automáticamente por instalar.php)
// se agrega sola a la lista de orígenes permitidos — no requiere editar este
// archivo a mano en cada despliegue. Admite varias URLs separadas por coma
// (ej. "https://mi-dominio.com,https://www.mi-dominio.com").
$frontendUrls = array_values(array_filter(array_map('trim', explode(',', (string) env('FRONTEND_URL', '')))));

return [
    'paths' => ['api/*'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    'allowed_origins' => array_values(array_unique(array_merge([
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
    ], $frontendUrls))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
