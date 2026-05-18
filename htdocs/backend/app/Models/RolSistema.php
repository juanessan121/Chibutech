<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RolSistema extends Model
{
    protected $table      = 'rol_sistema';
    protected $primaryKey = 'id_rol';
    public $timestamps    = false;

    protected $fillable = ['nombre_rol'];

    public function permisos(): BelongsToMany
    {
        return $this->belongsToMany(
            PermisoSistema::class,
            'permiso_rol',
            'id_rol',
            'id_permiso'
        );
    }

    public function usuarios(): HasMany
    {
        return $this->hasMany(UsuarioSistema::class, 'id_rol', 'id_rol');
    }
}
