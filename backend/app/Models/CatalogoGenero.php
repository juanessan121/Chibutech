<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CatalogoGenero extends Model
{
    protected $table = 'Catalogo_Genero';
    protected $primaryKey = 'id_genero';
    public $timestamps = false;
    protected $guarded = ['id_genero'];
}
