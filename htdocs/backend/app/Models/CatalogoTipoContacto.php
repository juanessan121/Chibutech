<?php
declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class CatalogoTipoContacto extends Model {
    protected $table = 'catalogo_tipo_contacto'; protected $primaryKey = 'id_tipo_contacto'; public $timestamps = false;
    protected $fillable = ['nombre_tipo'];
}
