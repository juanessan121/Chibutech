<?php
declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class CatalogoCargoDirectivo extends Model {
    protected $table = 'catalogo_cargo_directivo'; protected $primaryKey = 'id_cargo_directivo'; public $timestamps = false;
    protected $fillable = ['nombre_cargo', 'descripcion'];
}
