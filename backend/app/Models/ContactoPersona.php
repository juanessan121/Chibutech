<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactoPersona extends Model
{
    protected $table = 'Contacto_Persona';
    protected $primaryKey = 'id_contacto';
    public $timestamps = false;

    protected $guarded = ['id_contacto'];

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'id_persona', 'id_persona');
    }
}
