<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlanillaDetalle extends Model
{
    protected $table = 'Planilla_Detalle_Terreno';
    protected $primaryKey = 'id_detalle';
    public $timestamps = false;

    protected $fillable = [
        'id_planilla',
        'id_terreno',
        'area_terreno_copia',
        'subtotal_calculado'
    ];
}
