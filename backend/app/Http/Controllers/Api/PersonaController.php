<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Persona;
use App\Models\ContactoPersona;
use App\Models\PerfilEducativoPersona;
use App\Models\TituloEducativo;
use App\Models\CondicionPersona;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Exception;

class PersonaController extends Controller
{
    /**
     * Valida la Cédula Ecuatoriana (Módulo 10)
     */
    private function validarCedulaEcuatoriana($cedula)
    {
        if (strlen($cedula) !== 10) return false;
        if (!ctype_digit($cedula)) return false;

        $provincia = intval(substr($cedula, 0, 2));
        if ($provincia < 1 || $provincia > 24) return false;

        $tercerDigito = intval(substr($cedula, 2, 1));
        if ($tercerDigito >= 6) return false;

        $coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        $suma = 0;

        for ($i = 0; $i < 9; $i++) {
            $valor = intval($cedula[$i]) * $coeficientes[$i];
            if ($valor > 9) $valor -= 9;
            $suma += $valor;
        }

        $decenaSuperior = (int) (ceil($suma / 10) * 10);
        $digitoVerificador = $decenaSuperior - $suma;
        if ($digitoVerificador === 10) $digitoVerificador = 0;

        return $digitoVerificador === (int)$cedula[9];
    }

    /**
     * Reglas de validación reutilizables para store y update
     */
    private function getValidationRules($idExcluir = null): array
    {
        $cedulaRule = $idExcluir
            ? 'required|string|size:10|unique:Persona,cedula,' . $idExcluir . ',id_persona'
            : 'required|string|size:10|unique:Persona,cedula';

        return [
            'rules' => [
                'cedula'                        => $cedulaRule,
                'nombres'                       => 'required|string|max:100|regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/',
                'apellidos'                     => 'required|string|max:100|regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/',
                'fecha_nacimiento'              => 'nullable|date|after_or_equal:' . date('Y-m-d', strtotime('-120 years')) . '|before_or_equal:today',
                'id_genero'                     => 'nullable|integer',
                'tiene_condicion'               => 'nullable|boolean',
                'condiciones'                   => 'nullable|array',
                'condiciones.*.id_condicion'    => 'required_with:condiciones|integer',
                'condiciones.*.porcentaje'      => 'nullable|numeric|min:0|max:100',
                'condiciones.*.codigo'          => 'nullable|string|max:50',
                'condiciones.*.observacion'     => 'nullable|string',
                'condiciones.*.archivo_carnet_base64' => 'nullable|string',
                'estado_vital'                  => 'nullable|in:Vivo,Fallecido',
                'estado_registro'               => 'nullable|in:Activo,Pendiente',
                'id_sector'                     => 'nullable|integer',
                'correo_electronico'            => 'nullable|email|max:150',
                'contactos'                     => 'nullable|array',
                'contactos.*.id_tipo_contacto'  => 'required_with:contactos|integer',
                'contactos.*.valor_contacto'    => 'required_with:contactos|string|regex:/^0[2-9][0-9]{8}$/',
                'contactos.*.id_operadora'      => 'nullable|integer',
                'nivel_educativo_principal'     => 'nullable|integer',
                'carreras_principal'            => 'nullable|array',
                'dependientes'                  => 'nullable|array',
            ],
            'messages' => [
                'cedula.unique'                         => 'La cédula ingresada ya se encuentra registrada en el sistema.',
                'cedula.size'                           => 'La cédula debe tener exactamente 10 dígitos.',
                'cedula.required'                       => 'El número de cédula es obligatorio.',
                'nombres.regex'                         => 'Los nombres solo pueden contener letras.',
                'apellidos.regex'                       => 'Los apellidos solo pueden contener letras.',
                'fecha_nacimiento.after_or_equal'       => 'La edad no puede ser mayor a 120 años.',
                'fecha_nacimiento.before_or_equal'      => 'La fecha de nacimiento no puede ser en el futuro.',
                'correo_electronico.required'           => 'El correo electrónico es obligatorio.',
                'correo_electronico.email'              => 'El formato del correo electrónico no es válido.',
                'contactos.*.valor_contacto.regex'      => 'El teléfono debe tener 10 dígitos y empezar con 0 (ej: 0991234567 celular, 032123456 fijo).',
            ]
        ];
    }

    /**
     * Verifica si el dominio del correo tiene registros MX activos.
     * GET /api/verificar-email?correo=xxx@dominio.com
     */
    public function verificarEmail(Request $request): \Illuminate\Http\JsonResponse
    {
        $correo = trim($request->query('correo', ''));

        if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            return response()->json(['valido' => false, 'mensaje' => 'Formato de correo inválido.']);
        }

        $dominio = substr(strrchr($correo, '@'), 1);
        $tieneMX = checkdnsrr($dominio, 'MX') || checkdnsrr($dominio, 'A');

        return response()->json([
            'valido'  => $tieneMX,
            'mensaje' => $tieneMX
                ? 'Dominio de correo verificado correctamente.'
                : 'El dominio del correo no tiene registros activos. Verifique que el correo sea válido.',
        ]);
    }

    /**
     * Guarda el archivo del carnet CONADIS en base64 y retorna la ruta pública.
     */
    private function validarMimeBase64(string $base64, array $mimesPermitidos = ['image/jpeg', 'image/png', 'application/pdf']): string
    {
        $header = substr($base64, 0, 50);
        foreach ($mimesPermitidos as $mime) {
            if (str_contains($header, $mime)) return $mime;
        }
        throw new \Exception('Tipo de archivo no permitido. Solo se aceptan: JPG, PNG o PDF.');
    }

    private function guardarArchivoCarnet(string $base64, string $identificador): ?string
    {
        $mime       = $this->validarMimeBase64($base64, ['image/jpeg', 'image/png', 'application/pdf']);
        $base64data = substr($base64, strpos($base64, ',') + 1);
        $decoded    = base64_decode($base64data);
        if ($decoded === false) throw new \Exception('El archivo del carnet no es válido.');

        $extMap        = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'application/pdf' => 'pdf'];
        $nombreArchivo = 'carnets/' . uniqid() . '_' . preg_replace('/[^a-zA-Z0-9]/', '', $identificador) . '.' . $extMap[$mime];
        Storage::disk('public')->put($nombreArchivo, $decoded);

        return '/storage/' . $nombreArchivo;
    }

    private function guardarArchivoTitulo(string $base64, string $identificador): ?string
    {
        $mime       = $this->validarMimeBase64($base64, ['image/jpeg', 'image/png', 'application/pdf']);
        $base64data = substr($base64, strpos($base64, ',') + 1);
        $decoded    = base64_decode($base64data);
        if ($decoded === false) throw new \Exception('El archivo del título no es válido.');

        $extMap        = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'application/pdf' => 'pdf'];
        $nombreArchivo = 'titulos/' . uniqid() . '_' . preg_replace('/[^a-zA-Z0-9]/', '', $identificador) . '.' . $extMap[$mime];
        Storage::disk('public')->put($nombreArchivo, $decoded);

        return '/storage/' . $nombreArchivo;
    }

    /**
     * Valida las cédulas de los dependientes y su unicidad
     */
    private function validarDependientes(array $dependientes, ?int $titularId = null): ?JsonResponse
    {
        foreach ($dependientes as $dep) {
            if (empty($dep['cedula'])) continue;

            if (!$this->validarCedulaEcuatoriana($dep['cedula'])) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'La cédula del dependiente ' . ($dep['nombres'] ?? '') . ' no es válida para Ecuador.'
                ], 422);
            }

            $query = Persona::where('cedula', $dep['cedula']);
            if (!empty($dep['id_persona'])) {
                $query->where('id_persona', '!=', $dep['id_persona']);
            }
            if ($titularId) {
                $query->where('id_persona', '!=', $titularId);
            }
            if ($query->exists()) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'La cédula del dependiente ' . ($dep['nombres'] ?? '') . ' ya se encuentra registrada en el sistema.'
                ], 422);
            }
        }
        return null;
    }

    /**
     * Guarda los títulos educativos de una persona
     */
    private function guardarTitulos(int $idPersona, array $carreras, string $identificador): void
    {
        foreach ($carreras as $carrera) {
            if (empty($carrera['nombre'])) continue;
            $tituloInfo = TituloEducativo::where('nombre', $carrera['nombre'])->first();
            if (!$tituloInfo) continue;

            $rutaArchivo = null;
            if (!empty($carrera['archivo_titulo_base64'])) {
                $rutaArchivo = $this->guardarArchivoTitulo($carrera['archivo_titulo_base64'], $identificador);
            }

            PerfilEducativoPersona::create([
                'id_persona'         => $idPersona,
                'codigo_titulo_cine' => $tituloInfo->codigo,
                'estado_estudio'     => 'Finalizado',
                'archivo_titulo'     => $rutaArchivo
            ]);
        }
    }

    /**
     * Búsqueda de comuneros (dueños) por cédula o apellido
     * GET /api/personas
     */
    public function buscar(Request $request): JsonResponse
    {
        $termino = $request->query('search', '');

        $query = DB::table('Persona as p')
            ->leftJoin('Sector as s', 'p.id_sector', '=', 's.id_sector')
            ->leftJoin('usuarios as u', 'p.id_persona', '=', 'u.id_persona')
            ->leftJoin('Miembro_Directiva as md', function($join) {
                $join->on('md.id_persona', '=', 'p.id_persona')
                     ->where('md.estado', '=', 'Activo');
            })
            ->leftJoin('Catalogo_Cargo_Directivo as cd', 'cd.id_cargo_directivo', '=', 'md.id_cargo_directivo')
            ->select(
                'p.id_persona', 'p.cedula', 'p.nombre', 'p.apellido',
                'p.estado_vital', 'p.estado_registro',
                's.nombre_sector',
                'u.rol as rol_sistema',
                'cd.nombre_cargo as cargo_directiva'
            );

        if (!$request->query('include_dependents')) {
            $query->whereNull('p.id_representante_familia');
        }

        if (!empty($termino)) {
            $query->where(function($q) use ($termino) {
                $q->where('p.cedula', 'LIKE', '%' . $termino . '%')
                  ->orWhere('p.apellido', 'LIKE', '%' . $termino . '%')
                  ->orWhere('p.nombre', 'LIKE', '%' . $termino . '%');
            });
        }

        $personas = $query->limit(50)->get()->map(function($p) {
            // Estado: Fallecido > Pendiente > Activo
            if ($p->estado_vital === 'Fallecido') {
                $estado = 'Suspendido';
            } elseif ($p->estado_registro === 'Pendiente') {
                $estado = 'Pendiente';
            } else {
                $estado = 'Activo';
            }

            // Prioridad: cargo activo en directiva > Administrador del sistema > Comunero
            if (!empty($p->cargo_directiva)) {
                $rol = $p->cargo_directiva;
            } elseif ($p->rol_sistema === 'Administrador') {
                $rol = 'Administrador';
            } else {
                $rol = 'Comunero';
            }

            return [
                'id'             => $p->id_persona,
                'id_persona'     => $p->id_persona,
                'cedula'         => $p->cedula,
                'nombre'         => $p->nombre,
                'apellido'       => $p->apellido,
                'nombre_completo'=> trim($p->nombre . ' ' . $p->apellido),
                'sector'         => $p->nombre_sector ?? 'No Asignado',
                'rol'            => $rol,
                'estado'         => $estado
            ];
        });

        return response()->json(['status' => 'ok', 'data' => $personas]);
    }

    /**
     * Registra al titular y a sus dependientes en bloque (Transacción DB)
     */
    public function store(Request $request): JsonResponse
    {
        $validation = $this->getValidationRules();
        $data = $request->validate($validation['rules'], $validation['messages']);

        if (!$this->validarCedulaEcuatoriana($data['cedula'])) {
            return response()->json(['status' => 'error', 'message' => 'La cédula ingresada no es válida para Ecuador.'], 422);
        }

        if (!empty($data['dependientes'])) {
            $error = $this->validarDependientes($data['dependientes']);
            if ($error) return $error;
        }

        try {
            DB::beginTransaction();

            // 1. Guardar Titular
            $titular = Persona::create([
                'cedula'            => $data['cedula'],
                'nombre'            => $data['nombres'],
                'apellido'          => $data['apellidos'],
                'fecha_nacimiento'  => $data['fecha_nacimiento'] ?? null,
                'id_genero'         => $data['id_genero'] ?? null,
                'id_sector'         => $data['id_sector'] ?? null,
                'nivel_educativo'   => $data['nivel_educativo_principal'] ?? 0,
                'estado_vital'      => $data['estado_vital'] ?? 'Vivo',
                'estado_registro'   => $data['estado_registro'] ?? 'Activo',
            ]);

            // 2. Guardar Condiciones Especiales
            if (!empty($data['tiene_condicion']) && !empty($data['condiciones'])) {
                foreach ($data['condiciones'] as $cond) {
                    $rutaCarnet = null;
                    if (!empty($cond['archivo_carnet_base64'])) {
                        $rutaCarnet = $this->guardarArchivoCarnet($cond['archivo_carnet_base64'], $data['cedula']);
                    }
                    CondicionPersona::create([
                        'id_persona'             => $titular->id_persona,
                        'id_condicion'           => $cond['id_condicion'],
                        'porcentaje_discapacidad'=> $cond['porcentaje'] ?? null,
                        'codigo_carnet'          => $cond['codigo'] ?? null,
                        'archivo_carnet'         => $rutaCarnet,
                        'observacion'            => $cond['observacion'] ?? null,
                    ]);
                }
            }

            // 3. Guardar Contactos del Titular (teléfono + correo)
            if (!empty($data['contactos'])) {
                foreach ($data['contactos'] as $contacto) {
                    if (!empty($contacto['valor_contacto'])) {
                        ContactoPersona::create([
                            'id_persona'      => $titular->id_persona,
                            'id_tipo_contacto'=> $contacto['id_tipo_contacto'],
                            'valor_contacto'  => $contacto['valor_contacto'],
                            'id_operadora'    => $contacto['id_operadora'] ?? null,
                            'es_principal'    => 1
                        ]);
                    }
                }
            }
            // 3b. Guardar correo electrónico como contacto tipo 3
            if (!empty($data['correo_electronico'])) {
                ContactoPersona::create([
                    'id_persona'      => $titular->id_persona,
                    'id_tipo_contacto'=> 3,
                    'valor_contacto'  => $data['correo_electronico'],
                    'id_operadora'    => null,
                    'es_principal'    => 0
                ]);
            }

            // 4. Guardar Títulos del Titular
            if (!empty($data['carreras_principal'])) {
                $this->guardarTitulos($titular->id_persona, $data['carreras_principal'], $titular->cedula);
            }

            // 5. Guardar Dependientes (Hijos)
            if (!empty($data['dependientes'])) {
                foreach ($data['dependientes'] as $dep) {
                    if (empty($dep['nombres']) || empty($dep['apellidos'])) continue;

                    $dependiente = Persona::create([
                        'cedula'                  => !empty($dep['cedula']) ? $dep['cedula'] : null,
                        'nombre'                  => $dep['nombres'],
                        'apellido'                => $dep['apellidos'],
                        'id_genero'               => $dep['id_genero'] ?? null,
                        'nivel_educativo'         => $dep['nivel_educativo'] ?? 0,
                        'id_representante_familia'=> $titular->id_persona,
                        'estado_vital'            => 'Vivo',
                    ]);

                    if (!empty($dep['carreras'])) {
                        $this->guardarTitulos($dependiente->id_persona, $dep['carreras'], $dep['cedula'] ?? 'dep_' . $dependiente->id_persona);
                    }
                }
            }

            DB::commit();

            return response()->json([
                'status'  => 'success',
                'message' => 'Usuario y familia registrados correctamente.',
                'data'    => $titular
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'status'  => 'error',
                'message' => 'Error al guardar en la base de datos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener una persona y sus relaciones para editar
     */
    public function show($id): JsonResponse
    {
        try {
            $persona = Persona::with([
                'condiciones',
                'contactos',
                'perfilEducativo.titulo',
                'dependientes.perfilEducativo.titulo'
            ])->findOrFail($id);

            $tiene_condicion = $persona->condiciones->count() > 0;

            $condiciones = $persona->condiciones->map(function($c) {
                return [
                    'id_condicion' => (string) $c->id_condicion,
                    'porcentaje'   => $c->porcentaje_discapacidad,
                    'codigo'       => $c->codigo_carnet,
                    'observacion'  => $c->observacion
                ];
            })->toArray();

            $correoContacto = $persona->contactos->firstWhere('id_tipo_contacto', 3);
            $correo_electronico = $correoContacto ? $correoContacto->valor_contacto : '';

            $contactos = $persona->contactos->filter(fn($c) => $c->id_tipo_contacto != 3)->map(function($c) {
                return [
                    'id_tipo_contacto' => (string) $c->id_tipo_contacto,
                    'valor_contacto'   => $c->valor_contacto,
                    'id_operadora'     => $c->id_operadora ? (string) $c->id_operadora : ''
                ];
            })->values()->toArray();

            if (empty($contactos)) {
                $contactos = [['id_tipo_contacto' => '1', 'valor_contacto' => '', 'id_operadora' => '']];
            }

            $carreras_principal = $persona->perfilEducativo->map(function($p) {
                return ['nombre' => $p->titulo ? $p->titulo->nombre : ''];
            })->filter(function($c) { return !empty($c['nombre']); })->values()->toArray();

            // Si la columna es 0 (default para registros viejos) pero tiene carreras guardadas,
            // inferir al menos nivel 3. Si la columna tiene un valor real (>0), usarlo.
            $nivelRaw = (int) ($persona->nivel_educativo ?? 0);
            if ($nivelRaw === 0 && count($carreras_principal) > 0) {
                $nivel_educativo_principal = '3';
            } else {
                $nivel_educativo_principal = (string) $nivelRaw;
            }

            $dependientes = $persona->dependientes->map(function($d) {
                $carreras = $d->perfilEducativo->map(function($p) {
                    return ['nombre' => $p->titulo ? $p->titulo->nombre : ''];
                })->filter(function($c) { return !empty($c['nombre']); })->values()->toArray();

                $nivelDep = (int) ($d->nivel_educativo ?? 0);
                return [
                    'id_persona'      => $d->id_persona,
                    'nombres'         => $d->nombre,
                    'apellidos'       => $d->apellido,
                    'cedula'          => $d->cedula,
                    'id_genero'       => (string) $d->id_genero,
                    'nivel_educativo' => ($nivelDep === 0 && count($carreras) > 0) ? '3' : (string) $nivelDep,
                    'carreras'        => $carreras
                ];
            })->toArray();

            $id_zona = '';
            if ($persona->id_sector) {
                $id_zona = (string) DB::table('Sector')
                    ->where('id_sector', $persona->id_sector)
                    ->value('id_zona') ?? '';
            }

            $data = [
                'id_persona'                => $persona->id_persona,
                'cedula'                    => $persona->cedula,
                'fecha_nacimiento'          => $persona->fecha_nacimiento,
                'nombres'                   => $persona->nombre,
                'apellidos'                 => $persona->apellido,
                'id_genero'                 => (string) $persona->id_genero,
                'id_zona'                   => $id_zona,
                'id_sector'                 => (string) $persona->id_sector,
                'estado_registro'           => $persona->estado_registro ?? 'Activo',
                'nivel_educativo_principal' => $nivel_educativo_principal,
                'tiene_condicion'           => $tiene_condicion,
                'condiciones'               => $condiciones,
                'contactos'                 => $contactos,
                'correo_electronico'        => $correo_electronico,
                'carreras_principal'        => $carreras_principal,
                'numero_hijos'              => count($dependientes),
                'dependientes'              => $dependientes
            ];

            return response()->json(['status' => 'success', 'data' => $data]);

        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Usuario no encontrado'], 404);
        }
    }

    /**
     * Actualiza al titular y a sus dependientes en bloque (Transacción DB)
     */
    public function update(Request $request, $id): JsonResponse
    {
        $validation = $this->getValidationRules($id);
        $data = $request->validate($validation['rules'], $validation['messages']);

        if (!$this->validarCedulaEcuatoriana($data['cedula'])) {
            return response()->json(['status' => 'error', 'message' => 'La cédula ingresada no es válida para Ecuador.'], 422);
        }

        if (!empty($data['dependientes'])) {
            $error = $this->validarDependientes($data['dependientes'], (int)$id);
            if ($error) return $error;
        }

        try {
            DB::beginTransaction();

            $titular = Persona::findOrFail($id);
            $titular->update([
                'cedula'            => $data['cedula'],
                'nombre'            => $data['nombres'],
                'apellido'          => $data['apellidos'],
                'fecha_nacimiento'  => $data['fecha_nacimiento'] ?? null,
                'id_genero'         => $data['id_genero'] ?? null,
                'id_sector'         => $data['id_sector'] ?? null,
                'nivel_educativo'   => $data['nivel_educativo_principal'] ?? 0,
                'estado_vital'      => $data['estado_vital'] ?? 'Vivo',
                'estado_registro'   => $data['estado_registro'] ?? 'Activo',
            ]);

            // Sync Condiciones
            CondicionPersona::where('id_persona', $id)->delete();
            if (!empty($data['tiene_condicion']) && !empty($data['condiciones'])) {
                foreach ($data['condiciones'] as $cond) {
                    $rutaCarnet = null;
                    if (!empty($cond['archivo_carnet_base64'])) {
                        $rutaCarnet = $this->guardarArchivoCarnet($cond['archivo_carnet_base64'], $data['cedula']);
                    }
                    CondicionPersona::create([
                        'id_persona'             => $id,
                        'id_condicion'           => $cond['id_condicion'],
                        'porcentaje_discapacidad'=> $cond['porcentaje'] ?? null,
                        'codigo_carnet'          => $cond['codigo'] ?? null,
                        'archivo_carnet'         => $rutaCarnet,
                        'observacion'            => $cond['observacion'] ?? null,
                    ]);
                }
            }

            // Sync Contactos (teléfonos)
            ContactoPersona::where('id_persona', $id)->where('id_tipo_contacto', '!=', 3)->delete();
            if (!empty($data['contactos'])) {
                foreach ($data['contactos'] as $contacto) {
                    if (!empty($contacto['valor_contacto'])) {
                        ContactoPersona::create([
                            'id_persona'      => $id,
                            'id_tipo_contacto'=> $contacto['id_tipo_contacto'],
                            'valor_contacto'  => $contacto['valor_contacto'],
                            'id_operadora'    => $contacto['id_operadora'] ?? null,
                            'es_principal'    => 1
                        ]);
                    }
                }
            }
            // Sync correo electrónico (tipo 3)
            ContactoPersona::where('id_persona', $id)->where('id_tipo_contacto', 3)->delete();
            if (!empty($data['correo_electronico'])) {
                ContactoPersona::create([
                    'id_persona'      => $id,
                    'id_tipo_contacto'=> 3,
                    'valor_contacto'  => $data['correo_electronico'],
                    'id_operadora'    => null,
                    'es_principal'    => 0
                ]);
            }

            // Sync Perfil Educativo Titular
            PerfilEducativoPersona::where('id_persona', $id)->delete();
            if (!empty($data['carreras_principal'])) {
                $this->guardarTitulos($id, $data['carreras_principal'], $data['cedula']);
            }

            // Sync Dependientes
            $incomingDependientes = $data['dependientes'] ?? [];
            $incomingIds = collect($incomingDependientes)->pluck('id_persona')->filter()->toArray();

            Persona::where('id_representante_familia', $id)
                ->whereNotIn('id_persona', $incomingIds)
                ->delete();

            foreach ($incomingDependientes as $dep) {
                if (empty($dep['nombres']) || empty($dep['apellidos'])) continue;

                if (!empty($dep['id_persona'])) {
                    $dependiente = Persona::find($dep['id_persona']);
                    if ($dependiente) {
                        $dependiente->update([
                            'cedula'          => !empty($dep['cedula']) ? $dep['cedula'] : null,
                            'nombre'          => $dep['nombres'],
                            'apellido'        => $dep['apellidos'],
                            'id_genero'       => $dep['id_genero'] ?? null,
                            'nivel_educativo' => $dep['nivel_educativo'] ?? 0,
                        ]);
                    }
                } else {
                    $dependiente = Persona::create([
                        'cedula'                  => !empty($dep['cedula']) ? $dep['cedula'] : null,
                        'nombre'                  => $dep['nombres'],
                        'apellido'                => $dep['apellidos'],
                        'id_genero'               => $dep['id_genero'] ?? null,
                        'nivel_educativo'         => $dep['nivel_educativo'] ?? 0,
                        'id_representante_familia'=> $id,
                        'estado_vital'            => 'Vivo',
                    ]);
                }

                if ($dependiente) {
                    PerfilEducativoPersona::where('id_persona', $dependiente->id_persona)->delete();
                    if (!empty($dep['carreras'])) {
                        $this->guardarTitulos($dependiente->id_persona, $dep['carreras'], $dep['cedula'] ?? 'dep_' . $dependiente->id_persona);
                    }
                }
            }

            DB::commit();

            return response()->json([
                'status'  => 'success',
                'message' => 'Usuario y familia actualizados correctamente.',
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'status'  => 'error',
                'message' => 'Error al actualizar en la base de datos: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Eliminar Persona (físicamente si no tiene dependencias críticas)
     */
    public function destroy($id): JsonResponse
    {
        try {
            $persona = Persona::findOrFail($id);
            $persona->delete();

            return response()->json(['status' => 'success', 'message' => 'Usuario eliminado correctamente']);
        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'No se puede eliminar el usuario. Es posible que tenga registros asociados.'
            ], 400);
        }
    }
}
