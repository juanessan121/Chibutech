<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CatalogoOperadora extends Model
{
    protected $table = 'Catalogo_Operadora';
    protected $primaryKey = 'id_operadora';
    public $timestamps = false;
    protected $guarded = ['id_operadora'];
}
