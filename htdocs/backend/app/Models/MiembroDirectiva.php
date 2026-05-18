<?php
declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MiembroDirectiva extends Model {
    protected $table = 'miembro_directiva'; protected $primaryKey = 'id_directiva'; public $timestamps = false;
    protected $fillable = ['id_persona','id_cargo_directivo','fecha_inicio','fecha_fin','estado'];
    protected $casts = ['fecha_inicio' => 'date', 'fecha_fin' => 'date'];
    public function persona(): BelongsTo { return $this->belongsTo(Persona::class, 'id_persona', 'id_persona'); }
    public function cargo(): BelongsTo { return $this->belongsTo(CatalogoCargoDirectivo::class, 'id_cargo_directivo', 'id_cargo_directivo'); }
}
