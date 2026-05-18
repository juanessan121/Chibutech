<?php
declare(strict_types=1);
namespace App\Http\Requests\Persona;
use Illuminate\Foundation\Http\FormRequest;

class StorePersonaRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'cedula'                   => ['required','string','max:15','unique:persona,cedula'],
            'nombre'                   => ['required','string','max:100'],
            'apellido'                 => ['required','string','max:100'],
            'fecha_nacimiento'         => ['nullable','date'],
            'id_zona'                  => ['nullable','integer','exists:zona,id_zona'],
            'id_representante_familia' => ['nullable','integer','exists:persona,id_persona'],
            'id_condicion_especial'    => ['nullable','integer','exists:catalogo_condicion_especial,id_condicion'],
            'estado_vital'             => ['nullable','in:Vivo,Fallecido'],
            'fecha_defuncion'          => ['nullable','date','required_if:estado_vital,Fallecido'],
            'contactos'                => ['nullable','array'],
            'contactos.*.id_tipo_contacto'    => ['required_with:contactos','integer','exists:catalogo_tipo_contacto,id_tipo_contacto'],
            'contactos.*.valor_contacto'      => ['required_with:contactos','string','max:150'],
            'contactos.*.operadora_o_detalle' => ['nullable','string','max:50'],
            'contactos.*.es_principal'        => ['nullable','boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'cedula.unique'         => 'Ya existe una persona registrada con esa cédula.',
            'cedula.required'       => 'La cédula es obligatoria.',
            'nombre.required'       => 'El nombre es obligatorio.',
            'apellido.required'     => 'El apellido es obligatorio.',
            'fecha_defuncion.required_if' => 'La fecha de defunción es obligatoria cuando el estado es Fallecido.',
        ];
    }
}
