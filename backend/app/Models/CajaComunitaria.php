<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CajaComunitaria extends Model
{
    protected $table = 'Caja_Comunitaria';
    protected $primaryKey = 'id_transaccion';
    public $timestamps = false;

    protected $fillable = [
        'numero_comprobante',
        'tipo_movimiento',
        'concepto',
        'id_multa',
        'id_planilla',
        'monto',
        'responsable_registro',
        'fecha_registro'
    ];
}
