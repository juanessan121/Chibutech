<?php
declare(strict_types=1);
namespace App\Http\Resources\Usuario;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UsuarioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_usuario' => $this->id_usuario,
            'username'   => $this->username,
            'persona'    => $this->whenLoaded('persona', fn() => [
                'id' => $this->persona->id_persona, 'nombre' => $this->persona->nombre_completo, 'cedula' => $this->persona->cedula,
            ]),
            'rol'        => $this->whenLoaded('rol', fn() => [
                'id'       => $this->rol->id_rol,
                'nombre'   => $this->rol->nombre_rol,
                'permisos' => $this->rol->relationLoaded('permisos') ? $this->rol->permisos->pluck('nombre_permiso') : [],
            ]),
        ];
    }
}
