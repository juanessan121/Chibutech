<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Persona extends Model
{
    protected $table      = 'persona';
    protected $primaryKey = 'id_persona';
    public $timestamps    = false;

    protected $fillable = [
        'cedula', 'nombre', 'apellido', 'fecha_nacimiento',
        'id_zona', 'id_representante_familia', 'id_condicion_especial',
        'estado_vital', 'fecha_defuncion',
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date',
        'fecha_defuncion'  => 'date',
    ];

    // ─── Relaciones ──────────────────────────────────────────────────────────

    public function zona(): BelongsTo
    {
        return $this->belongsTo(Zona::class, 'id_zona', 'id_zona');
    }

    public function condicionEspecial(): BelongsTo
    {
        return $this->belongsTo(CatalogoCondicionEspecial::class, 'id_condicion_especial', 'id_condicion');
    }

    public function representanteFamilia(): BelongsTo
    {
        return $this->belongsTo(Persona::class, 'id_representante_familia', 'id_persona');
    }

    public function dependientes(): HasMany
    {
        return $this->hasMany(Persona::class, 'id_representante_familia', 'id_persona');
    }

    public function contactos(): HasMany
    {
        return $this->hasMany(ContactoPersona::class, 'id_persona', 'id_persona');
    }

    public function perfilEducativo(): HasMany
    {
        return $this->hasMany(PerfilEducativoPersona::class, 'id_persona', 'id_persona');
    }

    public function terrenos(): HasMany
    {
        return $this->hasMany(Terreno::class, 'id_persona', 'id_persona');
    }

    public function multas(): HasMany
    {
        return $this->hasMany(Multa::class, 'id_persona', 'id_persona');
    }

    public function cargoDirectiva(): HasMany
    {
        return $this->hasMany(MiembroDirectiva::class, 'id_persona', 'id_persona');
    }

    public function usuario(): HasOne
    {
        return $this->hasOne(UsuarioSistema::class, 'id_persona', 'id_persona');
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    public function getNombreCompletoAttribute(): string
    {
        return "{$this->nombre} {$this->apellido}";
    }
}
