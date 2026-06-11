<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificacionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $notificaciones = DB::table('Notificacion')
            ->where('id_persona', $user->id_persona)
            ->orderBy('fecha_creacion', 'desc')
            ->limit(50)
            ->get()
            ->map(fn($n) => [
                'id'             => $n->id_notificacion,
                'tipo'           => $n->tipo,
                'titulo'         => $n->titulo,
                'mensaje'        => $n->mensaje,
                'url_destino'    => $n->url_destino,
                'leida'          => (bool) $n->leida,
                'fecha_creacion' => $n->fecha_creacion,
            ]);

        $no_leidas = $notificaciones->where('leida', false)->count();

        return response()->json([
            'status'    => 'ok',
            'data'      => $notificaciones,
            'no_leidas' => $no_leidas,
        ]);
    }

    public function marcarLeida(Request $request, $id)
    {
        $user = $request->user();

        $updated = DB::table('Notificacion')
            ->where('id_notificacion', $id)
            ->where('id_persona', $user->id_persona)
            ->update(['leida' => true]);

        if (!$updated) {
            return response()->json(['status' => 'error', 'message' => 'Notificación no encontrada'], 404);
        }

        return response()->json(['status' => 'ok']);
    }

    public function marcarTodasLeidas(Request $request)
    {
        $user = $request->user();

        DB::table('Notificacion')
            ->where('id_persona', $user->id_persona)
            ->where('leida', false)
            ->update(['leida' => true]);

        return response()->json(['status' => 'ok']);
    }

    // ─── Helper estático usado por los demás controladores ───────────────────

    public static function insertar(int $idPersona, string $tipo, string $titulo, string $mensaje, ?string $url = null): void
    {
        try {
            DB::table('Notificacion')->insert([
                'id_persona'     => $idPersona,
                'tipo'           => $tipo,
                'titulo'         => $titulo,
                'mensaje'        => $mensaje,
                'url_destino'    => $url,
                'leida'          => false,
                'fecha_creacion' => now(),
            ]);
        } catch (\Throwable) {
            // Notificaciones son no críticas — no romper el flujo principal
        }
    }

    public static function broadcast(string $tipo, string $titulo, string $mensaje, ?string $url = null): void
    {
        try {
            $personas = DB::table('Persona')
                ->where('estado_vital', 'Vivo')
                ->pluck('id_persona');

            $rows = $personas->map(fn($id) => [
                'id_persona'     => $id,
                'tipo'           => $tipo,
                'titulo'         => $titulo,
                'mensaje'        => $mensaje,
                'url_destino'    => $url,
                'leida'          => false,
                'fecha_creacion' => now(),
            ])->all();

            foreach (array_chunk($rows, 200) as $chunk) {
                DB::table('Notificacion')->insert($chunk);
            }
        } catch (\Throwable) {
            // Notificaciones son no críticas
        }
    }
}
