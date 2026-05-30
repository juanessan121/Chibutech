<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TituloEducativo extends Model
{
    protected $table = 'Catalogo_Titulo_Educativo';
    protected $primaryKey = 'codigo';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false; // La tabla no tiene created_at ni updated_at

    protected $fillable = [
        'codigo',
        'nombre',
        'nivel_jerarquico',
        'id_nivel_academico',
        'parent_codigo',
    ];
}
