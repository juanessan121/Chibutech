<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

final class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, list<string|\Illuminate\Contracts\Validation\Rule>> */
    public function rules(): array
    {
        return [
            'email'       => ['required', 'string', 'email:rfc,dns', 'max:255'],
            'password'    => ['required', 'string', 'min:8', 'max:100'],
            'device_name' => ['sometimes', 'string', 'max:100'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'email.required'    => 'El campo email es obligatorio.',
            'email.email'       => 'El email ingresado no tiene un formato válido.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min'      => 'La contraseña debe tener al menos :min caracteres.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'email'    => 'correo electrónico',
            'password' => 'contraseña',
        ];
    }
}
