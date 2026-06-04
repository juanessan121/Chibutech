<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CatalogoCondicionEspecial extends Model
{
    protected $table = 'Catalogo_Condicion_Especial';
    protected $primaryKey = 'id_condicion';
    public $timestamps = false;
    protected $guarded = ['id_condicion'];
}
