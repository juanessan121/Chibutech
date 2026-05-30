<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Terreno extends Model
{
    protected $table = 'Terreno';
    protected $primaryKey = 'id_terreno';
    public $timestamps = false;

    protected $guarded = ['id_terreno'];

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'id_persona', 'id_persona');
    }
}
