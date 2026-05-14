<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * @OA\Info(
 *     title="Chibutech API",
 *     version="1.0.0",
 *     description="Sistema de Gestión Comunitaria y Territorial — CHIBUTECH",
 *     @OA\Contact(email="dev@chibutech.ec"),
 *     @OA\License(name="MIT")
 * )
 *
 * @OA\Server(
 *     url=L5_SWAGGER_CONST_HOST,
 *     description="Servidor principal"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Token emitido por Laravel Sanctum. Incluir como: Bearer {token}"
 * )
 *
 * @OA\Tag(name="Auth",         description="Autenticación y sesión")
 * @OA\Tag(name="Comuneros",    description="Padrón comunitario — comuneros y predios")
 * @OA\Tag(name="Profesiones",  description="Directorio CIUO-08")
 * @OA\Tag(name="Servicios",    description="Cuotas, tarifas y multas")
 * @OA\Tag(name="Dashboard",    description="Dashboard Jefe de Área")
 * @OA\Tag(name="Mock",         description="Endpoints simulados para el equipo Frontend")
 */
abstract class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}
