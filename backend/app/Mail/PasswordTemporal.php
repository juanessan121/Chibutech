<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordTemporal extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $nombre,
        public string $cedula,
        public string $passwordTemp
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Chibutech ERP — Tu Contraseña Temporal');
    }

    public function content(): Content
    {
        $nombre   = htmlspecialchars($this->nombre);
        $cedula   = htmlspecialchars($this->cedula);
        $pass     = htmlspecialchars($this->passwordTemp);
        $loginUrl = env('FRONTEND_URL', 'http://localhost:5173') . '/login';

        $html = <<<HTML
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,Helvetica,sans-serif;background:#0f172a;padding:40px 20px}
  .wrap{max-width:520px;margin:0 auto}
  .header{background:linear-gradient(135deg,#0e7490,#0f172a);padding:28px 32px;border-radius:12px 12px 0 0;text-align:center}
  .header h1{color:#22d3ee;font-size:1.3rem;margin-top:8px}
  .header p{color:#94a3b8;font-size:0.85rem;margin-top:4px}
  .body{background:#1e293b;padding:32px;border-radius:0 0 12px 12px}
  .greeting{color:#e2e8f0;font-size:1rem;margin-bottom:16px}
  .label{color:#94a3b8;font-size:0.85rem;margin-bottom:8px}
  .pass-box{background:#0f172a;border:2px solid #22d3ee;border-radius:10px;padding:20px;text-align:center;margin:20px 0}
  .pass-val{font-size:2.2rem;font-weight:bold;color:#22d3ee;letter-spacing:8px;font-family:monospace}
  .cedula-tag{display:inline-block;background:rgba(34,211,238,0.1);color:#22d3ee;border:1px solid rgba(34,211,238,0.3);border-radius:6px;padding:4px 12px;font-size:0.9rem;font-weight:bold;margin:12px 0}
  .warn{background:rgba(245,158,11,0.12);border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:14px 16px;margin:20px 0}
  .warn p{color:#fcd34d;font-size:0.85rem;line-height:1.6}
  .steps{margin:20px 0}
  .steps p{color:#94a3b8;font-size:0.85rem;line-height:1.8}
  .steps span{color:#e2e8f0;font-weight:bold}
  .btn{display:block;background:#22d3ee;color:#0f172a;text-decoration:none;text-align:center;padding:14px 24px;border-radius:8px;font-weight:bold;font-size:1rem;margin:24px 0}
  .footer{text-align:center;color:#475569;font-size:0.78rem;margin-top:20px;line-height:1.6}
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div style="font-size:2rem">💧</div>
    <h1>Chibutech ERP</h1>
    <p>Sistema de Gestión — Junta de Agua Comunitaria</p>
  </div>
  <div class="body">
    <p class="greeting">Hola, <strong>{$nombre}</strong></p>
    <p class="label">Cédula registrada:</p>
    <div class="cedula-tag">{$cedula}</div>
    <p class="label" style="margin-top:16px">Tu contraseña temporal es:</p>
    <div class="pass-box">
      <div class="pass-val">{$pass}</div>
    </div>
    <div class="warn">
      <p>⚠️ Esta es una contraseña de <strong>uso único</strong>. Al ingresar con ella, el sistema te pedirá inmediatamente que establezcas una contraseña nueva y permanente.</p>
    </div>
    <div class="steps">
      <p><span>1.</span> Ingresa a la aplicación con tu cédula y la contraseña temporal.</p>
      <p><span>2.</span> El sistema te redirigirá automáticamente a la pantalla de cambio de contraseña.</p>
      <p><span>3.</span> Elige una nueva contraseña segura (mínimo 6 caracteres).</p>
    </div>
    <a href="{$loginUrl}" class="btn">Ir al sistema →</a>
    <div class="footer">
      Si no solicitaste este cambio, ignora este correo.<br>
      Tu contraseña anterior permanece activa hasta que ingreses con la temporal.<br><br>
      © Junta de Agua Comunitaria Chibuleo
    </div>
  </div>
</div>
</body>
</html>
HTML;

        return new Content(htmlString: $html);
    }

    public function attachments(): array
    {
        return [];
    }
}
