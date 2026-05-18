<?php
declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class CatalogoNivelAcademico extends Model {
    protected $table = 'catalogo_nivel_academico'; protected $primaryKey = 'id_nivel_academico'; public $timestamps = false;
    protected $fillable = ['nombre_nivel'];
}
