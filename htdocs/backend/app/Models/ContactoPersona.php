<?php
declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactoPersona extends Model {
    protected $table = 'contacto_persona'; protected $primaryKey = 'id_contacto'; public $timestamps = false;
    protected $fillable = ['id_persona','id_tipo_contacto','valor_contacto','operadora_o_detalle','es_principal'];
    public function persona(): BelongsTo { return $this->belongsTo(Persona::class, 'id_persona', 'id_persona'); }
    public function tipoContacto(): BelongsTo { return $this->belongsTo(CatalogoTipoContacto::class, 'id_tipo_contacto', 'id_tipo_contacto'); }
}
