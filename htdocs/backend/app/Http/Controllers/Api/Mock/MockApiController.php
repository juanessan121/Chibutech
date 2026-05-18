<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Mock;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * @OA\Tag(name="Mock", description="Endpoints de prueba")
 */
class MockApiController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/mock/ping",
     *     tags={"Mock"},
     *     summary="Health check",
     *     security={{"sanctum":{}}},
     *     @OA\Response(response=200, description="pong")
     * )
     */
    public function ping(): JsonResponse
    {
        return response()->json([
            'message'   => 'pong',
            'timestamp' => now()->toISOString(),
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/mock/services",
     *     tags={"Mock"},
     *     summary="Lista de servicios mock",
     *     security={{"sanctum":{}}},
     *     @OA\Response(response=200, description="Servicios disponibles")
     * )
     */
    public function services(): JsonResponse
    {
        return response()->json([
            'services' => [
                ['id' => 1, 'name' => 'Corte de cabello', 'price' => 5.00],
                ['id' => 2, 'name' => 'Afeitado',         'price' => 3.50],
                ['id' => 3, 'name' => 'Manicure',         'price' => 8.00],
            ],
        ]);
    }
}
