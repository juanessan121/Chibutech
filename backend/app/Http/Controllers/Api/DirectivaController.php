<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;
use Exception;
use App\Models\Usuario;
use Carbon\Carbon;
use App\Http\Controllers\Api\NotificacionController as Notif;

class DirectivaController extends Controller
{
    /**
     * Obtiene la directiva actual (estado = 'Activo')
     */
    public function actual(): JsonResponse
    {
        try {
            $directiva = DB::table('Miembro_Directiva as md')
                ->leftJoin('Persona as p', 'md.id_persona', '=', 'p.id_persona')
                ->join('Catalogo_Cargo_Directivo as ccd', 'md.id_cargo_directivo', '=', 'ccd.id_cargo_directivo')
                ->where('md.estado', 'Activo')
                ->select(
                    'md.id_directiva as id',
                    'md.id_cargo_directivo',
                    'md.id_persona',
                    DB::raw("COALESCE(CONCAT(p.nombre, ' ', p.apellido), 'Vacante') as nombre"),
                    'p.cedula',
                    'ccd.nombre_cargo as cargo',
                    'md.fecha_inicio',
                    'md.fecha_fin',
                    'md.estado'
                )
                ->orderBy('md.id_cargo_directivo')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $directiva
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Obtiene el historial de directivas agrupado por periodo (año o fecha)
     */
    public function historial(Request $request): JsonResponse
    {
        try {
            $periodo = $request->query('periodo');

            $query = DB::table('Miembro_Directiva as md')
                ->join('Persona as p', 'md.id_persona', '=', 'p.id_persona')
                ->join('Catalogo_Cargo_Directivo as ccd', 'md.id_cargo_directivo', '=', 'ccd.id_cargo_directivo')
                ->where('md.estado', 'Finalizado');

            if ($periodo) {
                // Suponiendo que el periodo es el año de inicio
                $query->whereYear('md.fecha_inicio', $periodo);
            }

            $directiva = $query->select(
                    'md.id_directiva as id',
                    DB::raw("CONCAT(p.nombre, ' ', p.apellido) as nombre"),
                    'p.cedula',
                    'ccd.nombre_cargo as cargo',
                    'md.fecha_inicio',
                    'md.fecha_fin',
                    'md.estado',
                    'md.resolucion_nombramiento'
                )
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $directiva
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Reactiva una directiva histórica como la directiva oficial actual.
     * Finaliza la directiva actual y reactiva todos los miembros del período indicado.
     */
    public function reactivar(Request $request): JsonResponse
    {
        $request->validate([
            'periodo' => 'required|integer|min:2000|max:2100'
        ]);

        $periodo = (int) $request->input('periodo');

        try {
            DB::beginTransaction();

            // 1. Verificar que existe la directiva del período a reactivar
            $miembros = DB::table('Miembro_Directiva')
                ->whereYear('fecha_inicio', $periodo)
                ->get();

            if ($miembros->isEmpty()) {
                DB::rollBack();
                return response()->json([
                    'status'  => 'error',
                    'message' => "No se encontraron miembros para el período {$periodo}."
                ], 404);
            }

            // 2. Finalizar la directiva actualmente activa
            DB::table('Miembro_Directiva')
                ->where('estado', 'Activo')
                ->update(['estado' => 'Finalizado']);

            // 3. Reactivar los miembros del período indicado
            DB::table('Miembro_Directiva')
                ->whereYear('fecha_inicio', $periodo)
                ->update(['estado' => 'Activo']);

            // 4. Actualizar roles en tabla usuarios según cargo — 1 query por grupo de rol en lugar de N queries
            $rolMap = [1 => 'Presidente', 2 => 'Vicepresidente', 3 => 'Secretario', 4 => 'Tesorero'];
            $rolGroups = [];
            foreach ($miembros as $miembro) {
                $rol = $rolMap[$miembro->id_cargo_directivo] ?? 'Vocal';
                $rolGroups[$rol][] = $miembro->id_persona;
            }
            foreach ($rolGroups as $rol => $personaIds) {
                Usuario::whereIn('id_persona', $personaIds)->update(['rol' => $rol]);
            }

            DB::commit();

            return response()->json([
                'status'  => 'success',
                'message' => "Directiva del período {$periodo} reactivada correctamente como directiva actual."
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Registra una nueva directiva.
     * Finaliza la actual y crea los nuevos registros.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'fecha_inicio' => 'required|date',
                'fecha_fin' => 'nullable|date|after:fecha_inicio',
                'resolucion' => 'nullable|string',
                'cargos' => 'required|array',
            ]);

            $nuevaFecha = new \DateTime($validated['fecha_inicio']);

            // Regla 1: no más de 2 meses en el pasado
            $limiteAtras = (new \DateTime())->modify('-2 months');
            if ($nuevaFecha < $limiteAtras) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'La fecha de inicio no puede ser anterior al ' . $limiteAtras->format('d/m/Y') . '. El límite permitido es de 2 meses hacia atrás para cubrir procesos de elección y sucesión.'
                ], 422);
            }

            // Regla 2: no puede chocar con la directiva activa
            $activa = DB::table('Miembro_Directiva')
                ->where('estado', 'Activo')
                ->select('fecha_inicio', 'fecha_fin')
                ->first();

            if ($activa) {
                // Si tiene fecha_fin proyectada, la nueva debe comenzar DESPUÉS de ella
                if ($activa->fecha_fin) {
                    $limiteDatetime = new \DateTime($activa->fecha_fin);
                    if ($nuevaFecha <= $limiteDatetime) {
                        return response()->json([
                            'status'  => 'error',
                            'message' => 'La directiva activa tiene proyectado su fin el ' . $limiteDatetime->format('d/m/Y') . '. No se puede registrar una nueva directiva antes de que termine el periodo vigente.'
                        ], 422);
                    }
                } else {
                    // Sin fecha_fin: basta con que sea posterior al inicio de la activa
                    $activaInicio = new \DateTime($activa->fecha_inicio);
                    if ($nuevaFecha <= $activaInicio) {
                        return response()->json([
                            'status'  => 'error',
                            'message' => 'Ya existe una directiva activa que inició el ' . $activaInicio->format('d/m/Y') . '. La nueva directiva debe comenzar a partir del ' . $activaInicio->modify('+1 day')->format('d/m/Y') . '.'
                        ], 422);
                    }
                }
            }

            DB::beginTransaction();

            // 1. Finalizar la directiva actual (marcar estado = 'Finalizado' y fecha_fin si no la tiene)
            DB::table('Miembro_Directiva')
                ->where('estado', 'Activo')
                ->update([
                    'estado' => 'Finalizado',
                    'fecha_fin' => DB::raw("COALESCE(fecha_fin, '" . $validated['fecha_inicio'] . "')")
                ]);

            // 2. Insertar los nuevos miembros y actualizar usuarios
            $nuevosMiembros = [];
            foreach ($request->input('cargos', []) as $cargo) {
                if (!empty($cargo['id_persona'])) {
                    $nuevosMiembros[] = [
                        'id_persona' => $cargo['id_persona'],
                        'id_cargo_directivo' => $cargo['id_cargo_directivo'],
                        'fecha_inicio' => $validated['fecha_inicio'],
                        'fecha_fin' => $validated['fecha_fin'] ?? null,
                        'resolucion_nombramiento' => $validated['resolucion'] ?? null,
                        'estado' => 'Activo'
                    ];

                    // Mapear el ID de cargo al nombre del rol
                    $rol = 'Vocal';
                    if ($cargo['id_cargo_directivo'] == 1) $rol = 'Presidente';
                    elseif ($cargo['id_cargo_directivo'] == 2) $rol = 'Vicepresidente';
                    elseif ($cargo['id_cargo_directivo'] == 3) $rol = 'Secretario';
                    elseif ($cargo['id_cargo_directivo'] == 4) $rol = 'Tesorero';

                    $persona = DB::table('Persona')->where('id_persona', $cargo['id_persona'])->first();

                    if ($persona) {
                        Usuario::updateOrCreate(
                            ['id_persona' => $cargo['id_persona']],
                            [
                                'cedula'            => $persona->cedula,
                                'password'          => Hash::make($cargo['password'] ?? 'chibuleo2024'),
                                'rol'               => $rol,
                                'password_temporal' => true,
                            ]
                        );
                    }
                }
            }

            if (!empty($nuevosMiembros)) {
                DB::table('Miembro_Directiva')->insert($nuevosMiembros);
            }

            DB::commit();

            $fechaFmt = Carbon::parse($validated['fecha_inicio'])->format('d/m/Y');
            foreach ($request->input('cargos', []) as $cargo) {
                if (empty($cargo['id_persona'])) continue;
                $rolNombre = match ((int) ($cargo['id_cargo_directivo'] ?? 0)) {
                    1 => 'Presidente',
                    2 => 'Vicepresidente',
                    3 => 'Secretario',
                    4 => 'Tesorero',
                    default => 'Vocal',
                };
                Notif::insertar(
                    (int) $cargo['id_persona'],
                    'directiva',
                    'Nombramiento en la directiva',
                    "Ha sido nombrado como {$rolNombre} en la nueva directiva desde el {$fechaFmt}",
                    '/dashboard/directiva'
                );
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Directiva registrada correctamente. La anterior ha sido finalizada.'
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Reemplaza un miembro de la directiva activa en un cargo específico.
     * El saliente pasa a Finalizado; el entrante hereda la fecha_fin del periodo.
     * Permite reelección: no bloquea si la persona ya participó antes.
     */
    public function cambiarMiembro(Request $request): JsonResponse
    {
        $request->validate([
            'id_cargo_directivo' => 'required|integer',
            'id_persona_nueva'   => 'required|integer',
            'password'           => 'nullable|string|min:6',
        ]);

        try {
            DB::beginTransaction();

            $hoy = now()->toDateString();

            // 1. Encontrar el registro activo del cargo destino (puede tener persona, estar vacante, o no existir)
            $registroCargo = DB::table('Miembro_Directiva')
                ->where('estado', 'Activo')
                ->where('id_cargo_directivo', $request->id_cargo_directivo)
                ->first();

            // Si el cargo nunca tuvo registro, tomamos los datos del periodo del cargo del directiva activa
            $periodoRef = $registroCargo;
            if (!$registroCargo) {
                $periodoRef = DB::table('Miembro_Directiva')
                    ->where('estado', 'Activo')
                    ->whereNotNull('id_persona')
                    ->first();

                if (!$periodoRef) {
                    DB::rollBack();
                    return response()->json([
                        'status'  => 'error',
                        'message' => 'No hay directiva activa a la que agregar este cargo.'
                    ], 404);
                }
            }

            // 2. Finalizar el registro existente del cargo (solo si había uno)
            if ($registroCargo) {
                DB::table('Miembro_Directiva')
                    ->where('id_directiva', $registroCargo->id_directiva)
                    ->update(['estado' => 'Finalizado', 'fecha_fin' => $hoy]);

                if ($registroCargo->id_persona !== null) {
                    Usuario::where('id_persona', $registroCargo->id_persona)
                        ->update(['rol' => 'Comunero']);
                }
            }

            // 3. Si la persona nueva ya ocupa otro cargo activo, finalizarlo y dejar ESE cargo vacante
            $cargoAnterior = DB::table('Miembro_Directiva')
                ->where('estado', 'Activo')
                ->where('id_persona', $request->id_persona_nueva)
                ->first();

            if ($cargoAnterior) {
                DB::table('Miembro_Directiva')
                    ->where('id_directiva', $cargoAnterior->id_directiva)
                    ->update(['estado' => 'Finalizado', 'fecha_fin' => $hoy]);

                // Crear vacante para el cargo que dejó libre
                DB::table('Miembro_Directiva')->insert([
                    'id_persona'              => null,
                    'id_cargo_directivo'      => $cargoAnterior->id_cargo_directivo,
                    'fecha_inicio'            => $hoy,
                    'fecha_fin'               => $cargoAnterior->fecha_fin,
                    'resolucion_nombramiento' => $cargoAnterior->resolucion_nombramiento,
                    'estado'                  => 'Activo',
                ]);
            }

            // 4. Buscar la persona entrante
            $persona = DB::table('Persona')->where('id_persona', $request->id_persona_nueva)->first();

            if (!$persona) {
                DB::rollBack();
                return response()->json(['status' => 'error', 'message' => 'Persona no encontrada.'], 404);
            }

            // 5. Insertar al nuevo miembro en el cargo destino
            DB::table('Miembro_Directiva')->insert([
                'id_persona'             => $request->id_persona_nueva,
                'id_cargo_directivo'     => $request->id_cargo_directivo,
                'fecha_inicio'           => $hoy,
                'fecha_fin'              => $periodoRef->fecha_fin,
                'resolucion_nombramiento'=> $periodoRef->resolucion_nombramiento,
                'estado'                 => 'Activo',
            ]);

            // 4. Asignar rol según cargo
            $rolMap = [1 => 'Presidente', 2 => 'Vicepresidente', 3 => 'Secretario', 4 => 'Tesorero'];
            $rol = $rolMap[(int) $request->id_cargo_directivo] ?? 'Vocal';

            $usuarioExistente = Usuario::where('id_persona', $request->id_persona_nueva)->first();

            $rolesDirectiva = ['Presidente','Vicepresidente','Secretario','Tesorero','Vocal Principal 1','Vocal Principal 2','Vocal Principal 3','Vocal Suplente 1','Vocal Suplente 2'];
            $tieneClavePropia = $usuarioExistente
                && in_array($usuarioExistente->rol, $rolesDirectiva)
                && !$usuarioExistente->password_temporal;

            if ($tieneClavePropia) {
                $usuarioExistente->rol = $rol;
                $usuarioExistente->save();
            } else {
                Usuario::updateOrCreate(
                    ['id_persona' => $request->id_persona_nueva],
                    [
                        'cedula'            => $persona->cedula,
                        'password'          => Hash::make($request->password ?? 'chibuleo2024'),
                        'rol'               => $rol,
                        'password_temporal' => true,
                    ]
                );
            }

            DB::commit();

            Notif::insertar(
                (int) $request->id_persona_nueva,
                'directiva',
                'Nombramiento en la directiva',
                "Ha sido nombrado como {$rol} en la directiva a partir de hoy",
                '/dashboard/directiva'
            );

            return response()->json([
                'status'  => 'success',
                'message' => 'Miembro actualizado correctamente. El cambio aplica desde hoy.'
            ]);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage() ?: 'Error interno al cambiar el miembro.'], 500);
        }
    }
}

