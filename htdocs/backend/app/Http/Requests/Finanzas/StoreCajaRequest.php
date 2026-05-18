<?php
declare(strict_types=1);
namespace App\Http\Requests\Finanzas;
use Illuminate\Foundation\Http\FormRequest;

class StoreCajaRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'tipo_movimiento'    => ['required','in:Ingreso,Egreso'],
            'concepto'           => ['required','string','max:255'],
            'monto'              => ['required','numeric','min:0.01'],
            'numero_comprobante' => ['nullable','string','max:50','unique:caja_comunitaria,numero_comprobante'],
            'id_multa'           => ['nullable','integer','exists:multa,id_multa'],
        ];
    }
}
