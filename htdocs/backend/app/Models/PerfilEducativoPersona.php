<?php
declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PerfilEducativoPersona extends Model {
    protected $table = 'perfil_educativo_persona'; protected $primaryKey = 'id_perfil'; public $timestamps = false;
    protected $fillable = ['id_persona','codigo_titulo_cine','estado_estudio_universidad'];
    public function persona(): BelongsTo { return $this->belongsTo(Persona::class, 'id_persona', 'id_persona'); }
    public function titulo(): BelongsTo { return $this->belongsTo(CatalogoTituloEducativo::class, 'codigo_titulo_cine', 'codigo'); }
}
