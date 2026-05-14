<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Mock;

use App\Http\Controllers\Controller;
use Faker\Factory as Faker;
use Faker\Generator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * ─────────────────────────────────────────────────────────────────
 *  MOCK API — Chibutech
 * ─────────────────────────────────────────────────────────────────
 *  Propósito: Permitir al equipo Frontend consumir endpoints
 *  inmediatamente, con contratos idénticos a la API real.
 *
 *  IMPORTANTE: Este controlador NO debe ejecutarse en producción.
 *  Protegido por middleware 'mock.guard' (ver AppServiceProvider).
 * ─────────────────────────────────────────────────────────────────
 */
final class MockApiController extends Controller
{
    private readonly Generator $faker;

    public function __construct()
    {
        $this->faker = Faker::create('es_EC');
    }

    // ─── 1. Login simulado ─────────────────────────────────────────────────

    /**
     * @OA\Post(
     *     path="/api/mock/auth/login",
     *     tags={"Mock"},
     *     summary="[MOCK] Login — retorna token estático",
     *     @OA\RequestBody(required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="email",    type="string"),
     *             @OA\Property(property="password", type="string")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Token simulado")
     * )
     */
    public function login(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'token'  => 'mock_token_' . bin2hex(random_bytes(16)),
            'usuario' => [
                'id'            => 1,
                'nombre'        => 'Jefe Área Mock',
                'email'         => $request->input('email', 'jefe@chibutech.ec'),
                'zona_asignada' => 'ZONA_NORTE',
                'roles'         => [['id' => 2, 'nombre' => 'Jefe de Área', 'slug' => 'jefe-area']],
                'permisos'      => [
                    ['slug' => 'ver-dashboard-zona', 'modulo' => 'dashboard'],
                    ['slug' => 'emitir-multa',        'modulo' => 'multas'],
                    ['slug' => 'gestionar-cuotas',    'modulo' => 'servicios'],
                ],
            ],
        ]);
    }

    // ─── 2. Listado de Comuneros ───────────────────────────────────────────

    /**
     * @OA\Get(
     *     path="/api/mock/comuneros",
     *     tags={"Mock"},
     *     summary="[MOCK] Listado paginado de comuneros",
     *     @OA\Parameter(name="page", in="query", @OA\Schema(type="integer", default=1)),
     *     @OA\Response(response=200, description="Comuneros paginados")
     * )
     */
    public function comuneros(Request $request): JsonResponse
    {
        $page     = max(1, (int) $request->query('page', 1));
        $perPage  = 15;
        $total    = 87;

        $comuneros = collect(range(1, $perPage))->map(fn (int $i) => [
            'id'                   => ($page - 1) * $perPage + $i,
            'cedula'               => $this->faker->numerify('##########'),
            'nombres'              => $this->faker->firstName(),
            'apellidos'            => $this->faker->lastName() . ' MockApiController.php' . $this->faker->lastName(),
            'fecha_nacimiento'     => $this->faker->date('Y-m-d', '-25 years'),
            'sexo'                 => $this->faker->randomElement(['M', 'F']),
            'estado_civil'         => $this->faker->randomElement(['soltero', 'casado', 'divorciado', 'viudo']),
            'zona'                 => $this->faker->randomElement(['ZONA_NORTE', 'ZONA_SUR', 'ZONA_CENTRO']),
            'total_cargas_familiares' => $this->faker->numberBetween(0, 5), // Accessor real en el modelo
            'predio_principal'     => [
                'id'          => $this->faker->unique()->numberBetween(100, 999),
                'codigo'      => strtoupper($this->faker->bothify('PR-####')),
                'planimetria' => round($this->faker->randomFloat(2, 50, 1500), 2),
                'zona'        => $this->faker->randomElement(['ZONA_NORTE', 'ZONA_SUR', 'ZONA_CENTRO']),
            ],
            'created_at'           => $this->faker->dateTimeThisYear()->format('Y-m-d H:i:s'),
        ]);

        return response()->json([
            'status' => 'ok',
            'data'   => $comuneros,
            'meta'   => [
                'total'        => $total,
                'per_page'     => $perPage,
                'current_page' => $page,
                'last_page'    => (int) ceil($total / $perPage),
                'from'         => ($page - 1) * $perPage + 1,
                'to'           => min($page * $perPage, $total),
            ],
            'links' => [
                'first' => "/api/mock/comuneros?page=1",
                'prev'  => $page > 1 ? "/api/mock/comuneros?page=" . ($page - 1) : null,
                'next'  => $page < ceil($total / $perPage) ? "/api/mock/comuneros?page=" . ($page + 1) : null,
                'last'  => "/api/mock/comuneros?page=" . ceil($total / $perPage),
            ],
        ]);
    }

    // ─── 3. Búsqueda de Profesiones (autocomplete CIUO-08) ────────────────

    /**
     * @OA\Get(
     *     path="/api/mock/profesiones/buscar",
     *     tags={"Mock"},
     *     summary="[MOCK] Búsqueda Full-Text de profesiones CIUO-08",
     *     @OA\Parameter(name="q", in="query", required=true, @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Lista de profesiones nivel 4")
     * )
     */
    public function buscarProfesiones(Request $request): JsonResponse
    {
        $termino = $request->query('q', '');

        if (strlen((string) $termino) < 2) {
            return response()->json([
                'status' => 'ok',
                'data'   => [],
                'meta'   => ['total' => 0, 'termino' => $termino],
            ]);
        }

        $profesionesMock = [
            ['codigo' => '2141', 'nombre' => 'Ingenieros industriales y de producción', 'nivel' => 4, 'parent_codigo' => '214', 'parent_nombre' => 'Ingenieros (excluyendo electrotecnólogos)'],
            ['codigo' => '2144', 'nombre' => 'Ingenieros mecánicos', 'nivel' => 4, 'parent_codigo' => '214', 'parent_nombre' => 'Ingenieros (excluyendo electrotecnólogos)'],
            ['codigo' => '2153', 'nombre' => 'Ingenieros en telecomunicaciones', 'nivel' => 4, 'parent_codigo' => '215', 'parent_nombre' => 'Ingenieros electrotecnólogos'],
            ['codigo' => '2511', 'nombre' => 'Analistas de sistemas', 'nivel' => 4, 'parent_codigo' => '251', 'parent_nombre' => 'Desarrolladores y analistas de software'],
            ['codigo' => '2512', 'nombre' => 'Desarrolladores de software', 'nivel' => 4, 'parent_codigo' => '251', 'parent_nombre' => 'Desarrolladores y analistas de software'],
            ['codigo' => '2513', 'nombre' => 'Desarrolladores web y multimedia', 'nivel' => 4, 'parent_codigo' => '251', 'parent_nombre' => 'Desarrolladores y analistas de software'],
            ['codigo' => '3512', 'nombre' => 'Técnicos en tecnologías de la información y comunicación', 'nivel' => 4, 'parent_codigo' => '351', 'parent_nombre' => 'Técnicos en operaciones TIC'],
            ['codigo' => '2631', 'nombre' => 'Economistas', 'nivel' => 4, 'parent_codigo' => '263', 'parent_nombre' => 'Especialistas en ciencias sociales'],
            ['codigo' => '2641', 'nombre' => 'Autores y escritores', 'nivel' => 4, 'parent_codigo' => '264', 'parent_nombre' => 'Archivistas, bibliotecarios y documentalistas'],
            ['codigo' => '3411', 'nombre' => 'Agentes de valores y de finanzas', 'nivel' => 4, 'parent_codigo' => '341', 'parent_nombre' => 'Técnicos en finanzas'],
        ];

        $termLower = strtolower((string) $termino);
        $filtrados = array_filter($profesionesMock, fn (array $p) =>
            str_contains(strtolower($p['nombre']), $termLower) ||
            str_contains($p['codigo'], (string) $termino)
        );

        return response()->json([
            'status' => 'ok',
            'data'   => array_values($filtrados),
            'meta'   => [
                'total'   => count($filtrados),
                'termino' => $termino,
                'nota'    => 'Mock: MATCH() AGAINST() real activo en endpoint /api/profesiones/buscar',
            ],
        ]);
    }

    // ─── 4. Dashboard Jefe de Área ────────────────────────────────────────

    /**
     * @OA\Get(
     *     path="/api/mock/dashboard/jefe-area",
     *     tags={"Mock"},
     *     summary="[MOCK] Dashboard del Jefe de Área — datos de zona",
     *     @OA\Response(response=200, description="Resumen de zona con estados de cuenta, pagos y multas")
     * )
     */
    public function dashboardJefeArea(): JsonResponse
    {
        $zona = 'ZONA_NORTE';

        return response()->json([
            'status' => 'ok',
            'data'   => [
                'zona' => $zona,
                'resumen_zona' => [
                    'total_comuneros'    => 142,
                    'total_predios'      => 98,
                    'comuneros_al_dia'   => 110,
                    'comuneros_en_mora'  => 32,
                    'monto_recaudado_mes' => 4_850.75,
                    'monto_pendiente'    => 1_230.00,
                ],
                'pagos_pendientes_agua_luz' => collect(range(1, 5))->map(fn (int $i) => [
                    'comunero_id'   => $i + 100,
                    'nombres'       => $this->faker->name(),
                    'servicio'      => $this->faker->randomElement(['agua', 'luz', 'agua_luz']),
                    'monto_deuda'   => round($this->faker->randomFloat(2, 10, 200), 2),
                    'meses_mora'    => $this->faker->numberBetween(1, 6),
                    'predio_codigo' => strtoupper($this->faker->bothify('PR-####')),
                ])->toArray(),
                'multas_zona' => [
                    'historial' => collect(range(1, 4))->map(fn (int $i) => [
                        'id'               => $i,
                        'comunero_nombres' => $this->faker->name(),
                        'tipo_infraccion'  => $this->faker->randomElement(['Daño a bien común', 'Incumplimiento de faena', 'Ocupación indebida']),
                        'monto'            => round($this->faker->randomFloat(2, 20, 500), 2),
                        'estado'           => $this->faker->randomElement(['pendiente', 'pagada', 'anulada']),
                        'fecha_emision'    => $this->faker->dateTimeThisYear()->format('Y-m-d'),
                    ])->toArray(),
                    'total_emitidas'  => 14,
                    'total_cobradas'  => 9,
                    'total_pendientes' => 5,
                ],
            ],
        ]);
    }

    // ─── 5. Detalle de un Predio ──────────────────────────────────────────

    /**
     * @OA\Get(
     *     path="/api/mock/predios/{id}",
     *     tags={"Mock"},
     *     summary="[MOCK] Detalle de predio con tarifa calculada",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Predio con planimetría y tarifa estimada")
     * )
     */
    public function detallePredio(int $id): JsonResponse
    {
        $planimetria  = round($this->faker->randomFloat(2, 50, 1500), 2);
        $porcentajeCobro = $this->calcularPorcentajeCobroMock($planimetria);

        return response()->json([
            'status' => 'ok',
            'data'   => [
                'id'              => $id,
                'codigo'          => strtoupper($this->faker->bothify('PR-####')),
                'planimetria_m2'  => $planimetria,
                'zona'            => 'ZONA_NORTE',
                'uso_suelo'       => $this->faker->randomElement(['residencial', 'agricola', 'comercial']),
                'tarifa_calculada' => [
                    'porcentaje_cobro' => $porcentajeCobro,
                    'agua_mensual'     => round($planimetria * $porcentajeCobro / 100 * 0.05, 2),
                    'luz_mensual'      => round($planimetria * $porcentajeCobro / 100 * 0.03, 2),
                    'nota'             => 'Calculado por CalcularTarifaServicioAction (mock)',
                ],
                'comunero_propietario' => [
                    'id'       => $this->faker->numberBetween(1, 500),
                    'nombres'  => $this->faker->firstName(),
                    'apellidos' => $this->faker->lastName(),
                ],
            ],
        ]);
    }

    // ─── Helper privado — lógica idéntica a CalcularTarifaServicioAction ──

    private function calcularPorcentajeCobroMock(float $planimetriaM2): float
    {
        return match (true) {
            $planimetriaM2 <= 200  => 5.0,
            $planimetriaM2 <= 500  => 10.0,
            $planimetriaM2 <= 1000 => 15.0,
            default                => 20.0,
        };
    }
}
