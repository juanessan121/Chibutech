<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Multa extends Model
{
    protected $table = 'Multa';
    protected $primaryKey = 'id_multa';
    public $timestamps = false;

    protected $fillable = [
        'id_persona',
        'motivo_multa',
        'monto',
        'estado_pago',
        'url_documento_justificativo',
        'observacion_anulacion',
        'fecha_emision'
    ];

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'id_persona', 'id_persona');
    }
}
