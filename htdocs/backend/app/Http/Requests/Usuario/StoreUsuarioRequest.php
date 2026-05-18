<?php
declare(strict_types=1);
namespace App\Http\Requests\Usuario;
use Illuminate\Foundation\Http\FormRequest;

class StoreUsuarioRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'id_persona' => ['required','integer','exists:persona,id_persona','unique:usuario_sistema,id_persona'],
            'id_rol'     => ['required','integer','exists:rol_sistema,id_rol'],
            'username'   => ['required','string','max:50','unique:usuario_sistema,username'],
            'password'   => ['required','string','min:8','confirmed'],
        ];
    }

    public function messages(): array
    {
        return [
            'id_persona.unique' => 'Esta persona ya tiene una cuenta de usuario.',
            'username.unique'   => 'Ese nombre de usuario ya está en uso.',
            'password.confirmed'=> 'Las contraseñas no coinciden.',
        ];
    }
}
