<?php
declare(strict_types=1);
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Multa extends Model {
    protected $table = 'multa'; protected $primaryKey = 'id_multa'; public $timestamps = false;
    protected $fillable = ['id_persona','motivo_multa','monto','estado_pago','fecha_emision'];
    protected $casts = ['fecha_emision' => 'datetime'];
    public function persona(): BelongsTo { return $this->belongsTo(Persona::class, 'id_persona', 'id_persona'); }
}
