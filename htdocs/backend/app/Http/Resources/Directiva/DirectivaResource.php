<?php
declare(strict_types=1);
namespace App\Http\Resources\Directiva;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DirectivaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_directiva' => $this->id_directiva,
            'persona'      => $this->whenLoaded('persona', fn() => [
                'id' => $this->persona->id_persona, 'nombre' => $this->persona->nombre_completo, 'cedula' => $this->persona->cedula,
            ]),
            'cargo'        => $this->whenLoaded('cargo', fn() => [
                'id' => $this->cargo->id_cargo_directivo, 'nombre' => $this->cargo->nombre_cargo,
            ]),
            'fecha_inicio' => $this->fecha_inicio?->format('Y-m-d'),
            'fecha_fin'    => $this->fecha_fin?->format('Y-m-d'),
            'estado'       => $this->estado,
        ];
    }
}
