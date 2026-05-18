<?php
declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Zona extends Model {
    protected $table = 'zona'; protected $primaryKey = 'id_zona'; public $timestamps = false;
    protected $fillable = ['nombre_zona', 'descripcion'];
    public function personas(): HasMany { return $this->hasMany(Persona::class, 'id_zona', 'id_zona'); }
}
