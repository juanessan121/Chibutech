<?php
declare(strict_types=1);
namespace App\Http\Resources\Catalogo;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ZonaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return ['id_zona' => $this->id_zona, 'nombre_zona' => $this->nombre_zona, 'descripcion' => $this->descripcion];
    }
}
