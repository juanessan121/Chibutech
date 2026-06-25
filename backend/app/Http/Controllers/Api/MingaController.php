<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Minga;
use App\Models\AsignacionSectorMinga;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\NotificacionController as Notif;

class MingaController extends Controller
{
    public function index()
    {
        // Una sola query con conteos agregados — elimina el N+1 anterior
        $mingas = DB::table('Minga as m')
            ->join('Catalogo_Estado_Minga as e', 'm.id_estado_minga', '=', 'e.id_estado_minga')
            ->leftJoin(DB::raw('(SELECT id_minga, SUM(id_estado_asistencia = 2) as total_presentes, SUM(id_estado_asistencia IN (3,4)) as total_faltos FROM Asistencia_Minga GROUP BY id_minga) as stats'), 'stats.id_minga', '=', 'm.id_minga')
            ->select(
                'm.id_minga',
                'm.fecha_programada',
                'm.motivo_general',
                'm.lugar_encuentro',
                'e.nombre_estado',
                'm.valor_multa_inasistencia',
                'm.observacion_estado',
                DB::raw('COALESCE(stats.total_presentes, 0) as asistentes'),
                DB::raw('COALESCE(stats.total_faltos, 0) as faltos')
            )
            ->orderBy('m.id_minga', 'desc')
            ->get();

        $data = $mingas->map(fn($m) => [
            'id'         => $m->id_minga,
            'fecha'      => $m->fecha_programada,
            'motivo'     => $m->motivo_general,
            'lugar'      => $m->lugar_encuentro,
            'estado'     => $m->nombre_estado,
            'asistentes' => (int) $m->asistentes,
            'faltos'     => (int) $m->faltos,
            'multa'      => (float) $m->valor_multa_inasistencia,
            'obs'        => $m->observacion_estado
        ]);

        return response()->json(['status' => 'ok', 'data' => $data]);
    }

    public function activas()
    {
        $mingas = DB::table('Minga')
            ->whereIn('id_estado_minga', [1, 2]) // Programada, En Ejecución
            ->orderBy('fecha_programada', 'asc')
            ->get();

        return response()->json(['status' => 'ok', 'data' => $mingas]);
    }

    public function activasDetalle()
    {
        $mingas = DB::table('Minga as m')
            ->join('Catalogo_Estado_Minga as e', 'm.id_estado_minga', '=', 'e.id_estado_minga')
            ->leftJoin(DB::raw('(
                SELECT asm.id_minga,
                       GROUP_CONCAT(DISTINCT s.nombre_sector ORDER BY s.nombre_sector SEPARATOR "|||") AS sectores,
                       GROUP_CONCAT(DISTINCT z.nombre_zona  ORDER BY z.nombre_zona  SEPARATOR "|||") AS zonas,
                       COUNT(DISTINCT p.id_persona) AS total_convocados
                FROM Asignacion_Sector_Minga asm
                JOIN Sector  s ON s.id_sector = asm.id_sector
                JOIN Zona    z ON z.id_zona   = s.id_zona
                LEFT JOIN Persona p ON p.id_sector = s.id_sector AND p.estado_vital = "Vivo"
                GROUP BY asm.id_minga
            ) AS sec'), 'sec.id_minga', '=', 'm.id_minga')
            ->whereIn('e.nombre_estado', ['Programada', 'En Ejecución', 'Pospuesta', 'Suspendida'])
            ->select(
                'm.id_minga', 'm.fecha_programada', 'm.motivo_general', 'm.lugar_encuentro',
                'e.nombre_estado', 'm.valor_multa_inasistencia', 'm.observacion_estado',
                'sec.sectores', 'sec.zonas',
                DB::raw('COALESCE(sec.total_convocados, 0) AS total_convocados')
            )
            ->orderBy('m.fecha_programada', 'asc')
            ->get();

        $data = $mingas->map(fn($m) => [
            'id'               => $m->id_minga,
            'fecha'            => $m->fecha_programada,
            'motivo'           => $m->motivo_general,
            'lugar'            => $m->lugar_encuentro,
            'estado'           => $m->nombre_estado,
            'multa'            => (float) $m->valor_multa_inasistencia,
            'obs'              => $m->observacion_estado,
            'sectores'         => $m->sectores ? explode('|||', $m->sectores) : [],
            'zonas'            => $m->zonas    ? array_values(array_unique(explode('|||', $m->zonas))) : [],
            'total_convocados' => (int) $m->total_convocados,
        ]);

        return response()->json(['status' => 'ok', 'data' => $data]);
    }

    public function convocados($id)
    {
        $sectores   = DB::table('Asignacion_Sector_Minga')->where('id_minga', $id)->pluck('id_sector');
        $fechaMinga = DB::table('Minga')->where('id_minga', $id)->value('fecha_programada') ?? '';

        // Sub-query: multas ligadas a esta minga por fecha (la tabla Multa no tiene id_minga FK)
        $multasSub = DB::table('Multa')
            ->where('motivo_multa', 'like', "Inasistencia a Minga: %({$fechaMinga})")
            ->select('id_persona', 'estado_pago', 'monto');

        $personas = DB::table('Persona as p')
            ->join('Sector as s', 'p.id_sector', '=', 's.id_sector')
            ->leftJoin('Asistencia_Minga as a', function ($join) use ($id) {
                $join->on('p.id_persona', '=', 'a.id_persona')
                     ->where('a.id_minga', '=', $id);
            })
            ->leftJoin('Catalogo_Estado_Asistencia as ea', 'a.id_estado_asistencia', '=', 'ea.id_estado_asistencia')
            ->leftJoinSub($multasSub, 'mul', 'p.id_persona', '=', 'mul.id_persona')
            ->whereIn('p.id_sector', $sectores)
            ->where('p.estado_vital', 'Vivo')
            ->select(
                'p.id_persona as id',
                'p.cedula',
                DB::raw("CONCAT(p.nombre, ' ', p.apellido) as nombre"),
                's.nombre_sector as sector',
                // Si la persona faltó Y su multa está Pagada → mostrar estado compuesto
                DB::raw("CASE
                    WHEN ea.nombre_estado = 'Faltó' AND mul.estado_pago = 'Pagada' THEN 'Faltó (Pagado)'
                    ELSE COALESCE(ea.nombre_estado, 'Pendiente')
                END as estado"),
                DB::raw("COALESCE(mul.estado_pago, NULL) as multa_estado"),
                DB::raw("COALESCE(mul.monto, NULL) as multa_monto")
            )
            ->orderBy('s.nombre_sector')
            ->orderBy('nombre')
            ->get();

        return response()->json(['status' => 'ok', 'data' => $personas]);
    }

    public function registrarAsistencia(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $estadoMap = [
                'Pendiente'      => 1,
                'Presente'       => 2,
                'Faltó'          => 3,
                'Justificado'    => 4,
                'Faltó (Pagado)' => 3,
            ];

            foreach ($request->asistencias as $asistencia) {
                $idEstado = $estadoMap[$asistencia['estado']] ?? 1;
                DB::table('Asistencia_Minga')->updateOrInsert(
                    ['id_minga' => $id, 'id_persona' => $asistencia['id']],
                    ['id_estado_asistencia' => $idEstado]
                );
            }

            // Finalizar si: se solicitó cerrar_registro O si ya no quedan Pendientes en la BD
            $pendientesRestantes = DB::table('Asistencia_Minga')
                ->where('id_minga', $id)
                ->where('id_estado_asistencia', 1) // Pendiente
                ->count();

            $totalRegistrados = DB::table('Asistencia_Minga')
                ->where('id_minga', $id)
                ->count();

            $debeFinalizarse = $request->cerrar_registro
                || ($totalRegistrados > 0 && $pendientesRestantes === 0);

            if ($debeFinalizarse) {
                $mingaData  = DB::table('Minga')->where('id_minga', $id)->first();
                $valorMulta = $mingaData ? $mingaData->valor_multa_inasistencia : 0;

                if ($valorMulta > 0) {
                    $faltos = DB::table('Asistencia_Minga')
                        ->where('id_minga', $id)
                        ->where('id_estado_asistencia', 3) // Faltó
                        ->pluck('id_persona');

                    $multasToInsert = [];
                    foreach ($faltos as $idPersona) {
                        $exists = DB::table('Multa')
                            ->where('id_persona', $idPersona)
                            ->where('motivo_multa', 'like', "Inasistencia a Minga: %($mingaData->fecha_programada)")
                            ->exists();
                        if (!$exists) {
                            $multasToInsert[] = [
                                'id_persona'   => $idPersona,
                                'motivo_multa' => 'Inasistencia a Minga: ' . $mingaData->motivo_general . ' (' . $mingaData->fecha_programada . ')',
                                'monto'        => $valorMulta,
                                'estado_pago'  => 'Pendiente',
                                'fecha_emision'=> now(),
                            ];
                        }
                    }
                    if (!empty($multasToInsert)) {
                        DB::table('Multa')->insert($multasToInsert);
                        foreach ($multasToInsert as $multa) {
                            Notif::insertar(
                                $multa['id_persona'],
                                'multa',
                                'Multa por inasistencia a minga',
                                "Se generó una multa de \${$valorMulta} por inasistencia: {$mingaData->motivo_general}",
                                '/dashboard/mis-deudas'
                            );
                        }
                    }
                }

                // Buscar el ID de "Finalizada" dinámicamente para no depender de un valor hardcodeado
                $idFinalizada = DB::table('Catalogo_Estado_Minga')
                    ->where('nombre_estado', 'Finalizada')
                    ->value('id_estado_minga') ?? 3;

                DB::table('Minga')->where('id_minga', $id)->update(['id_estado_minga' => $idFinalizada]);
            }

            DB::commit();
            return response()->json(['status' => 'ok', 'message' => 'Asistencia guardada']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'accion'      => 'required|in:posponer,cancelar,reactivar',
            'nueva_fecha' => 'required_if:accion,posponer|required_if:accion,reactivar|nullable|date',
            'observacion' => 'nullable|string|max:500',
        ]);

        $minga = DB::table('Minga')->where('id_minga', $id)->first();
        if (!$minga) {
            return response()->json(['status' => 'error', 'message' => 'Minga no encontrada'], 404);
        }

        $estados = DB::table('Catalogo_Estado_Minga')->pluck('id_estado_minga', 'nombre_estado');
        $idProgramada = $estados['Programada'] ?? 1;
        $idPospuesta  = $estados['Pospuesta']  ?? null;
        $idCancelada  = $estados['Cancelada']  ?? 5;
        $idSuspendida = $estados['Suspendida'] ?? 4;

        switch ($request->accion) {
            case 'posponer':
                if (!in_array($minga->id_estado_minga, [$idProgramada, $idPospuesta, $idSuspendida])) {
                    return response()->json(['status' => 'error', 'message' => 'Solo se puede posponer una minga Programada, Pospuesta o Suspendida'], 422);
                }
                DB::table('Minga')->where('id_minga', $id)->update([
                    'id_estado_minga'    => $idPospuesta,
                    'fecha_programada'   => $request->nueva_fecha,
                    'observacion_estado' => $request->observacion,
                ]);
                $mensaje = 'Minga marcada como Pospuesta para ' . $request->nueva_fecha;
                break;

            case 'cancelar':
                if ($minga->id_estado_minga == 3) {
                    return response()->json(['status' => 'error', 'message' => 'No se puede cancelar una minga ya finalizada'], 422);
                }
                DB::table('Minga')->where('id_minga', $id)->update([
                    'id_estado_minga'    => $idCancelada,
                    'observacion_estado' => $request->observacion,
                ]);
                $mensaje = 'Minga cancelada correctamente';
                break;

            case 'reactivar':
                if (!in_array($minga->id_estado_minga, [$idPospuesta, $idSuspendida, $idCancelada])) {
                    return response()->json(['status' => 'error', 'message' => 'Solo se puede reactivar una minga Pospuesta, Suspendida o Cancelada'], 422);
                }
                DB::table('Minga')->where('id_minga', $id)->update([
                    'id_estado_minga'    => $idProgramada,
                    'fecha_programada'   => $request->nueva_fecha,
                    'observacion_estado' => $request->observacion,
                ]);
                $mensaje = 'Minga reprogramada para ' . $request->nueva_fecha;
                break;

            default:
                return response()->json(['status' => 'error', 'message' => 'Acción no válida'], 422);
        }

        return response()->json(['status' => 'ok', 'message' => $mensaje]);
    }

    public function store(Request $request)
    {
        $fecha = substr($request->fecha_hora_programada, 0, 10);

        try {
            DB::beginTransaction();

            $minga = Minga::create([
                'id_tipo_evento' => $request->id_tipo_evento ?? 1,
                'fecha_programada' => $fecha,
                'motivo_general' => $request->motivo_minga,
                'lugar_encuentro' => $request->lugar_encuentro,
                'latitud' => $request->latitud,
                'longitud' => $request->longitud,
                'id_estado_minga' => 1, // Programada
                'valor_multa_inasistencia' => $request->valor_multa_inasistencia,
                'observacion_estado' => $request->observacion_estado
            ]);

            if ($request->has('asignaciones') && is_array($request->asignaciones)) {
                foreach ($request->asignaciones as $asignacion) {
                    if (isset($asignacion['id_sector'])) {
                        AsignacionSectorMinga::create([
                            'id_minga' => $minga->id_minga,
                            'id_sector' => $asignacion['id_sector'],
                            'id_actividad' => 1
                        ]);
                    }
                }
            }

            DB::commit();

            $fechaFmt = \Carbon\Carbon::parse($fecha)->format('d/m/Y');
            Notif::broadcast(
                'minga',
                'Nueva minga programada',
                "Se ha programado una minga para el {$fechaFmt}: {$request->motivo_minga} — {$request->lugar_encuentro}",
                '/dashboard/mingas/activas'
            );

            return response()->json(['status' => 'ok', 'message' => 'Minga programada correctamente', 'data' => $minga]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Error al guardar la minga: ' . $e->getMessage()], 500);
        }
    }
}
