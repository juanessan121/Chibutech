<?php

declare(strict_types=1);

namespace App\Http\Controllers;

/**
 * @OA\Info(
 *     title="Chibutech API",
 *     version="1.0.0",
 *     description="API REST del sistema Chibutech",
 *     @OA\Contact(email="dev@chibutech.com")
 * )
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 */
abstract class Controller
{
}
