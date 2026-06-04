<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanillaCabecera extends Model
{
    protected $table = 'Planilla_Cabecera';
    protected $primaryKey = 'id_planilla';
    public $timestamps = false;

    protected $fillable = [
        'id_persona',
        'fecha_emision',
        'anio_fiscal',
        'mes_fiscal',
        'total_pagar',
        'estado_pago',
        'fecha_registro'
    ];

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'id_persona', 'id_persona');
    }

    public function detalles()
    {
        return $this->hasMany(PlanillaDetalle::class, 'id_planilla', 'id_planilla');
    }
}
