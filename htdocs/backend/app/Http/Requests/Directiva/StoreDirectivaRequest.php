<?php
declare(strict_types=1);
namespace App\Http\Requests\Directiva;
use Illuminate\Foundation\Http\FormRequest;

class StoreDirectivaRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'id_persona'         => ['required','integer','exists:persona,id_persona'],
            'id_cargo_directivo' => ['required','integer','exists:catalogo_cargo_directivo,id_cargo_directivo'],
            'fecha_inicio'       => ['required','date'],
            'fecha_fin'          => ['nullable','date','after:fecha_inicio'],
        ];
    }
}
