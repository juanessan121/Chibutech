<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Minga;
use App\Models\AsignacionSectorMinga;
use Illuminate\Support\Facades\DB;

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

    public function convocados($id)
    {
        // Obtener sectores asignados
        $sectores = DB::table('Asignacion_Sector_Minga')->where('id_minga', $id)->pluck('id_sector');

        // Obtener personas de esos sectores
        $personas = DB::table('Persona as p')
            ->join('Sector as s', 'p.id_sector', '=', 's.id_sector')
            ->leftJoin('Asistencia_Minga as a', function($join) use ($id) {
                $join->on('p.id_persona', '=', 'a.id_persona')
                     ->where('a.id_minga', '=', $id);
            })
            ->leftJoin('Catalogo_Estado_Asistencia as ea', 'a.id_estado_asistencia', '=', 'ea.id_estado_asistencia')
            ->whereIn('p.id_sector', $sectores)
            ->where('p.estado_vital', 'Vivo')
            ->select(
                'p.id_persona as id',
                'p.cedula',
                DB::raw("CONCAT(p.nombre, ' ', p.apellido) as nombre"),
                's.nombre_sector as sector',
                DB::raw("COALESCE(ea.nombre_estado, 'Pendiente') as estado")
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

            // Mapeo inverso de estado a ID
            // 'Pendiente' => 1, 'Presente' => 2, 'Faltó' => 3, 'Justificado' => 4
            $estadoMap = [
                'Pendiente' => 1,
                'Presente' => 2,
                'Faltó' => 3,
                'Justificado' => 4,
                'Faltó (Pagado)' => 3 // Tratar igual en BD por ahora
            ];

            foreach ($request->asistencias as $asistencia) {
                $idEstado = $estadoMap[$asistencia['estado']] ?? 1;
                
                DB::table('Asistencia_Minga')->updateOrInsert(
                    ['id_minga' => $id, 'id_persona' => $asistencia['id']],
                    ['id_estado_asistencia' => $idEstado]
                );
            }

            if ($request->cerrar_registro) {
                // Primero obtenemos el valor de la multa para esta minga
                $mingaData = DB::table('Minga')->where('id_minga', $id)->first();
                $valorMulta = $mingaData ? $mingaData->valor_multa_inasistencia : 0;
                
                // Si la minga tiene multa configurada, generamos el registro en la tabla Multa
                if ($valorMulta > 0) {
                    $faltos = DB::table('Asistencia_Minga')
                        ->where('id_minga', $id)
                        ->where('id_estado_asistencia', 3) // 3 = Faltó
                        ->pluck('id_persona');
                    
                    $multasToInsert = [];
                    foreach ($faltos as $idPersona) {
                        // Verificamos que no exista ya la multa para evitar duplicados en caso de múltiples clics
                        $exists = DB::table('Multa')
                            ->where('id_persona', $idPersona)
                            ->where('motivo_multa', 'like', "Inasistencia a Minga: %($mingaData->fecha_programada)")
                            ->exists();
                            
                        if (!$exists) {
                            $multasToInsert[] = [
                                'id_persona' => $idPersona,
                                'motivo_multa' => 'Inasistencia a Minga: ' . $mingaData->motivo_general . ' (' . $mingaData->fecha_programada . ')',
                                'monto' => $valorMulta,
                                'estado_pago' => 'Pendiente',
                                'fecha_emision' => now()
                            ];
                        }
                    }
                    if (!empty($multasToInsert)) {
                        DB::table('Multa')->insert($multasToInsert);
                    }
                }

                DB::table('Minga')->where('id_minga', $id)->update(['id_estado_minga' => 3]); // 3 = Finalizada
            }

            DB::commit();

            return response()->json(['status' => 'ok', 'message' => 'Asistencia guardada']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
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

            return response()->json(['status' => 'ok', 'message' => 'Minga programada correctamente', 'data' => $minga]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Error al guardar la minga: ' . $e->getMessage()], 500);
        }
    }
}
