<?php
declare(strict_types=1);
namespace App\Http\Resources\Catastro;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TerrenoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_terreno'          => $this->id_terreno,
            'clave_catastral'     => $this->clave_catastral,
            'area_total'          => $this->area_total,
            'estado_construccion' => $this->whenLoaded('estadoConstruccion', fn() => [
                'id' => $this->estadoConstruccion->id_estado_construccion, 'nombre' => $this->estadoConstruccion->nombre_estado,
            ]),
            'persona'             => $this->whenLoaded('persona', fn() => [
                'id' => $this->persona->id_persona, 'nombre' => $this->persona->nombre_completo, 'cedula' => $this->persona->cedula,
            ]),
        ];
    }
}
