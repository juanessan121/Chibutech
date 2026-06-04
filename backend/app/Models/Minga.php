<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Minga extends Model
{
    protected $table = 'Minga';
    protected $primaryKey = 'id_minga';
    public $timestamps = false; // We use fecha_registro instead of created_at/updated_at

    protected $fillable = [
        'id_tipo_evento',
        'fecha_programada',
        'motivo_general',
        'lugar_encuentro',
        'latitud',
        'longitud',
        'id_estado_minga',
        'valor_multa_inasistencia',
        'observacion_estado',
        'fecha_registro'
    ];

    public function asignacionesSectores()
    {
        return $this->hasMany(AsignacionSectorMinga::class, 'id_minga', 'id_minga');
    }
}
