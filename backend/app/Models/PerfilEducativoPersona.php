<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PerfilEducativoPersona extends Model
{
    protected $table = 'Perfil_Educativo_Persona';
    protected $primaryKey = 'id_perfil';
    public $timestamps = false;

    protected $guarded = ['id_perfil'];

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'id_persona', 'id_persona');
    }

    public function titulo()
    {
        return $this->belongsTo(TituloEducativo::class, 'codigo_titulo_cine', 'codigo');
    }
}
