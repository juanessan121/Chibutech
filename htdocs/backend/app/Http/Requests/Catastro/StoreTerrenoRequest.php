<?php
declare(strict_types=1);
namespace App\Http\Requests\Catastro;
use Illuminate\Foundation\Http\FormRequest;

class StoreTerrenoRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'id_persona'           => ['required','integer','exists:persona,id_persona'],
            'clave_catastral'      => ['required','string','max:50','unique:terreno,clave_catastral'],
            'area_total'           => ['required','numeric','min:0.01'],
            'id_estado_construccion' => ['nullable','integer','exists:catalogo_estado_construccion,id_estado_construccion'],
        ];
    }
}
