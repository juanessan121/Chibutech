<?php
declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class CatalogoEstadoConstruccion extends Model {
    protected $table = 'catalogo_estado_construccion'; protected $primaryKey = 'id_estado_construccion'; public $timestamps = false;
    protected $fillable = ['nombre_estado'];
}
