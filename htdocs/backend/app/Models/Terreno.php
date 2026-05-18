<?php
declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Terreno extends Model {
    protected $table = 'terreno'; protected $primaryKey = 'id_terreno'; public $timestamps = false;
    protected $fillable = ['id_persona','clave_catastral','area_total','id_estado_construccion'];
    public function persona(): BelongsTo { return $this->belongsTo(Persona::class, 'id_persona', 'id_persona'); }
    public function estadoConstruccion(): BelongsTo { return $this->belongsTo(CatalogoEstadoConstruccion::class, 'id_estado_construccion', 'id_estado_construccion'); }
}
