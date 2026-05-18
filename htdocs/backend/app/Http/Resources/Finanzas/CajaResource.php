<?php
declare(strict_types=1);
namespace App\Http\Resources\Finanzas;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CajaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_transaccion'     => $this->id_transaccion,
            'numero_comprobante' => $this->numero_comprobante,
            'tipo_movimiento'    => $this->tipo_movimiento,
            'concepto'           => $this->concepto,
            'monto'              => $this->monto,
            'multa'              => $this->whenLoaded('multa', fn() => $this->multa ? [
                'id' => $this->multa->id_multa, 'motivo' => $this->multa->motivo_multa,
            ] : null),
            'responsable'        => $this->whenLoaded('responsable', fn() => [
                'id' => $this->responsable->id_usuario, 'username' => $this->responsable->username,
            ]),
        ];
    }
}
