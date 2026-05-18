<?php
declare(strict_types=1);
namespace App\Http\Requests\Persona;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePersonaRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $id = $this->route('persona');
        return [
            'cedula'                   => ['sometimes','string','max:15',"unique:persona,cedula,{$id},id_persona"],
            'nombre'                   => ['sometimes','string','max:100'],
            'apellido'                 => ['sometimes','string','max:100'],
            'fecha_nacimiento'         => ['nullable','date'],
            'id_zona'                  => ['nullable','integer','exists:zona,id_zona'],
            'id_representante_familia' => ['nullable','integer','exists:persona,id_persona'],
            'id_condicion_especial'    => ['nullable','integer','exists:catalogo_condicion_especial,id_condicion'],
            'estado_vital'             => ['nullable','in:Vivo,Fallecido'],
            'fecha_defuncion'          => ['nullable','date'],
        ];
    }
}
