<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AsignacionSectorMinga extends Model
{
    protected $table = 'Asignacion_Sector_Minga';
    protected $primaryKey = 'id_asignacion_sector';
    public $timestamps = false;

    protected $fillable = [
        'id_minga',
        'id_sector',
        'id_actividad',
        'valor_multa_grupo'
    ];

    public function sector()
    {
        return $this->belongsTo(CatalogoSector::class, 'id_sector', 'id_sector'); // Assuming Sector model exists, if not, raw query is fine for now
    }
}
