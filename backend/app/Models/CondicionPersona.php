<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CondicionPersona extends Model
{
    protected $table = 'Condicion_Persona';
    protected $primaryKey = 'id_condicion_persona';
    public $timestamps = false;
    protected $guarded = ['id_condicion_persona'];

    public function condicion()
    {
        return $this->belongsTo(CatalogoCondicionEspecial::class, 'id_condicion', 'id_condicion');
    }
}
