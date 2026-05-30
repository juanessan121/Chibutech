<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property int         $id
 * @property string      $nombre
 * @property string      $email
 * @property string      $password
 * @property string|null $zona_asignada  -- clave para filtrar Dashboard Jefe de Área
 */
final class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nombre',
        'email',
        'password',
        'zona_asignada',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',  // PHP 8.2 + Laravel 10 — bcrypt/argon2 auto
    ];

    // ─── RBAC Relations ───────────────────────────────────────────────────────

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_user')
            ->with('permissions')
            ->withTimestamps();
    }

    // ─── RBAC Helpers (lógica en backend, no DB) ──────────────────────────────

    public function hasRole(string $roleSlug): bool
    {
        return $this->roles->contains('slug', $roleSlug);
    }

    public function hasAnyRole(array $roleSlugs): bool
    {
        return $this->roles->whereIn('slug', $roleSlugs)->isNotEmpty();
    }

    public function hasPermission(string $permissionSlug): bool
    {
        foreach ($this->roles as $role) {
            if ($role->hasPermission($permissionSlug)) {
                return true;
            }
        }

        return false;
    }

    public function getAllPermissions(): \Illuminate\Support\Collection
    {
        return $this->roles
            ->flatMap(fn (Role $role) => $role->permissions)
            ->unique('slug');
    }
}
