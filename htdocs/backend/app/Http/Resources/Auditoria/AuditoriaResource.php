<?php
declare(strict_types=1);
namespace App\Http\Resources\Auditoria;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuditoriaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_auditoria'    => $this->id_auditoria,
            'tabla_afectada'  => $this->tabla_afectada,
            'operacion'       => $this->operacion,
            'id_registro'     => $this->id_registro,
            'datos_anteriores'=> $this->datos_anteriores,
            'datos_nuevos'    => $this->datos_nuevos,
            'id_usuario'      => $this->id_usuario,
            'fecha_hora'      => $this->fecha_hora?->format('Y-m-d H:i:s'),
            'ip_origen'       => $this->ip_origen,
        ];
    }
}
