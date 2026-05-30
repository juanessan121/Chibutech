<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    protected $table = 'Persona';
    protected $primaryKey = 'id_persona';
    public $timestamps = false; // Según el esquema actual, no veo created_at/updated_at

    protected $guarded = ['id_persona'];

    public function dependientes()
    {
        return $this->hasMany(Persona::class, 'id_representante_familia', 'id_persona');
    }

    public function titular()
    {
        return $this->belongsTo(Persona::class, 'id_representante_familia', 'id_persona');
    }

    public function contactos()
    {
        return $this->hasMany(ContactoPersona::class, 'id_persona', 'id_persona');
    }

    public function perfilEducativo()
    {
        return $this->hasMany(PerfilEducativoPersona::class, 'id_persona', 'id_persona');
    }
}
