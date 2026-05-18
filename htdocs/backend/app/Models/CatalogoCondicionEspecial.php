<?php
declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class CatalogoCondicionEspecial extends Model {
    protected $table = 'catalogo_condicion_especial'; protected $primaryKey = 'id_condicion'; public $timestamps = false;
    protected $fillable = ['nombre_condicion'];
}
