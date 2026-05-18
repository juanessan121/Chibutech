<?php
declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CajaComunitaria extends Model {
    protected $table = 'caja_comunitaria'; protected $primaryKey = 'id_transaccion'; public $timestamps = false;
    protected $fillable = ['numero_comprobante','tipo_movimiento','concepto','id_multa','monto','responsable_registro'];
    public function multa(): BelongsTo { return $this->belongsTo(Multa::class, 'id_multa', 'id_multa'); }
    public function responsable(): BelongsTo { return $this->belongsTo(UsuarioSistema::class, 'responsable_registro', 'id_usuario'); }
}
