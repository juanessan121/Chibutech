<?php
declare(strict_types=1);
namespace App\Http\Requests\Finanzas;
use Illuminate\Foundation\Http\FormRequest;

class StoreMultaRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'id_persona'   => ['required','integer','exists:persona,id_persona'],
            'motivo_multa' => ['required','string','max:200'],
            'monto'        => ['required','numeric','min:0.01'],
        ];
    }
}
