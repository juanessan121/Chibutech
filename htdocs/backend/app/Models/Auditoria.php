<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Auditoria extends Model
{
    protected $table      = 'auditoria';
    protected $primaryKey = 'id_auditoria';
    public $timestamps    = false;

    protected $fillable = [
        'tabla_afectada',
        'operacion',
        'id_registro',
        'datos_anteriores',
        'datos_nuevos',
        'id_usuario',
        'fecha_hora',
        'ip_origen',
    ];

    protected $casts = [
        'datos_anteriores' => 'array',
        'datos_nuevos'     => 'array',
        'fecha_hora'       => 'datetime',
    ];
}
