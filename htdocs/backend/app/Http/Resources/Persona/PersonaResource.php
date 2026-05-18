<?php
declare(strict_types=1);
namespace App\Http\Resources\Persona;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PersonaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_persona'         => $this->id_persona,
            'cedula'             => $this->cedula,
            'nombre'             => $this->nombre,
            'apellido'           => $this->apellido,
            'nombre_completo'    => $this->nombre_completo,
            'fecha_nacimiento'   => $this->fecha_nacimiento?->format('Y-m-d'),
            'estado_vital'       => $this->estado_vital,
            'fecha_defuncion'    => $this->fecha_defuncion?->format('Y-m-d'),
            'zona'               => $this->whenLoaded('zona', fn() => $this->zona ? [
                'id' => $this->zona->id_zona, 'nombre' => $this->zona->nombre_zona,
            ] : null),
            'condicion_especial' => $this->whenLoaded('condicionEspecial', fn() => $this->condicionEspecial ? [
                'id' => $this->condicionEspecial->id_condicion, 'nombre' => $this->condicionEspecial->nombre_condicion,
            ] : null),
            'representante'      => $this->whenLoaded('representanteFamilia', fn() => $this->representanteFamilia ? [
                'id' => $this->representanteFamilia->id_persona, 'nombre' => $this->representanteFamilia->nombre_completo,
            ] : null),
            'contactos'          => $this->whenLoaded('contactos', fn() =>
                $this->contactos->map(fn($c) => [
                    'id' => $c->id_contacto, 'tipo' => $c->tipoContacto->nombre_tipo ?? null,
                    'valor' => $c->valor_contacto, 'detalle' => $c->operadora_o_detalle,
                    'principal' => (bool)$c->es_principal,
                ])
            ),
            'terrenos'           => $this->whenLoaded('terrenos', fn() =>
                $this->terrenos->map(fn($t) => [
                    'id' => $t->id_terreno, 'clave_catastral' => $t->clave_catastral,
                    'area_total' => $t->area_total, 'estado' => $t->estadoConstruccion->nombre_estado ?? null,
                ])
            ),
            'multas_pendientes'  => $this->whenLoaded('multas', fn() =>
                $this->multas->where('estado_pago', 'Pendiente')->count()
            ),
        ];
    }
}
