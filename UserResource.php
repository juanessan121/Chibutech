<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="UserResource",
 *     title="Usuario autenticado",
 *     @OA\Property(property="id",             type="integer",       example=1),
 *     @OA\Property(property="nombre",         type="string",        example="Admin Chibutech"),
 *     @OA\Property(property="email",          type="string",        format="email"),
 *     @OA\Property(property="zona_asignada",  type="string",        nullable=true, example="ZONA_NORTE"),
 *     @OA\Property(property="roles",          type="array",
 *         @OA\Items(
 *             @OA\Property(property="id",     type="integer"),
 *             @OA\Property(property="nombre", type="string"),
 *             @OA\Property(property="slug",   type="string")
 *         )
 *     ),
 *     @OA\Property(property="permisos",       type="array",
 *         @OA\Items(
 *             @OA\Property(property="slug",   type="string", example="emitir-multa"),
 *             @OA\Property(property="modulo", type="string", example="multas")
 *         )
 *     )
 * )
 */
final class UserResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'nombre'        => $this->nombre,
            'email'         => $this->email,
            'zona_asignada' => $this->zona_asignada,
            'roles'         => $this->whenLoaded('roles', fn () =>
                $this->roles->map(fn ($r) => [
                    'id'     => $r->id,
                    'nombre' => $r->nombre,
                    'slug'   => $r->slug,
                ])
            ),
            'permisos'      => $this->whenLoaded('roles', fn () =>
                $this->getAllPermissions()->map(fn ($p) => [
                    'slug'   => $p->slug,
                    'modulo' => $p->modulo,
                ])
            ),
        ];
    }
}
