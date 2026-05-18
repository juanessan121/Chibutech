<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;

class UsuarioSistema extends Authenticatable
{
    use HasApiTokens;

    protected $table      = 'usuario_sistema';
    protected $primaryKey = 'id_usuario';

    protected $fillable = [
        'id_persona',
        'id_rol',
        'username',
        'password_hash',
        'password_salt',
    ];

    protected $hidden = [
        'password_hash',
        'password_salt',
    ];

    // Sanctum espera el campo "password" — lo mapeamos al hash real
    public function getAuthPassword(): string
    {
        return $this->password_hash;
    }

    // ─── Relaciones ──────────────────────────────────────────────────────────

    public function persona(): BelongsTo
    {
        return $this->belongsTo(Persona::class, 'id_persona', 'id_persona');
    }

    public function rol(): BelongsTo
    {
        return $this->belongsTo(RolSistema::class, 'id_rol', 'id_rol');
    }

    // ─── RBAC helpers ────────────────────────────────────────────────────────

    public function hasPermission(string $permiso): bool
    {
        return $this->rol
            ->permisos()
            ->where('nombre_permiso', $permiso)
            ->exists();
    }

    public function hasRole(string $rol): bool
    {
        return $this->rol->nombre_rol === $rol;
    }
}
