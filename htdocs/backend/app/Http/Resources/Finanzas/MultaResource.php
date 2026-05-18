<?php
declare(strict_types=1);
namespace App\Http\Resources\Finanzas;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MultaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_multa'      => $this->id_multa,
            'persona'       => $this->whenLoaded('persona', fn() => [
                'id' => $this->persona->id_persona, 'nombre' => $this->persona->nombre_completo, 'cedula' => $this->persona->cedula,
            ]),
            'motivo_multa'  => $this->motivo_multa,
            'monto'         => $this->monto,
            'estado_pago'   => $this->estado_pago,
            'fecha_emision' => $this->fecha_emision?->format('Y-m-d H:i:s'),
        ];
    }
}
