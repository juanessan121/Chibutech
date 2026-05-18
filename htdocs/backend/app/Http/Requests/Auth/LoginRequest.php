<?php
declare(strict_types=1);
namespace App\Http\Requests\Auth;
use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array {
        return [
            'username' => ['required', 'string', 'max:50'],
            'password' => ['required', 'string', 'min:6'],
        ];
    }

    public function messages(): array {
        return [
            'username.required' => 'El nombre de usuario es obligatorio.',
            'password.required' => 'La contraseña es obligatoria.',
        ];
    }
}
