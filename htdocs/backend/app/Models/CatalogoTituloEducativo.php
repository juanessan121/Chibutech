<?php
declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CatalogoTituloEducativo extends Model {
    protected $table = 'catalogo_titulo_educativo'; protected $primaryKey = 'codigo'; public $incrementing = false; protected $keyType = 'string'; public $timestamps = false;
    protected $fillable = ['codigo','nombre','nivel_jerarquico','id_nivel_academico','parent_codigo'];
    public function nivelAcademico(): BelongsTo { return $this->belongsTo(CatalogoNivelAcademico::class, 'id_nivel_academico', 'id_nivel_academico'); }
    public function padre(): BelongsTo { return $this->belongsTo(CatalogoTituloEducativo::class, 'parent_codigo', 'codigo'); }
    public function hijos(): HasMany { return $this->hasMany(CatalogoTituloEducativo::class, 'parent_codigo', 'codigo'); }
}
