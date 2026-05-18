<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class PermisoSistema extends Model
{
    protected $table      = 'permiso_sistema';
    protected $primaryKey = 'id_permiso';
    public $timestamps    = false;

    protected $fillable = ['nombre_permiso', 'modulo'];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(
            RolSistema::class,
            'permiso_rol',
            'id_permiso',
            'id_rol'
        );
    }
}
