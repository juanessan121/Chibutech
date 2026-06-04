<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Persona;
use App\Models\Terreno;
use Carbon\Carbon;

class ImportComunerosSeeder extends Seeder
{
    /**
     * Ejecuta el script de llenado de base de datos de forma didáctica y de prueba.
     */
    public function run()
    {
        $comuneros = [
            ['nombre' => 'Braulio Andrés', 'apellido' => 'Silva Toaza', 'cedula' => '1804632030'],
            ['nombre' => 'Dilón Marcelo', 'apellido' => 'Lagua Poma', 'cedula' => '1850661651'],
            ['nombre' => 'Victor Hugo', 'apellido' => 'Toasa Pérez', 'cedula' => '1805637202'],
            ['nombre' => 'Alejandro Luis', 'apellido' => 'Sutherland Gómez', 'cedula' => '1851867026'],
            ['nombre' => 'Paúl Fernando', 'apellido' => 'Sánchez Vega', 'cedula' => '1850339944'],
            ['nombre' => 'Esteban Javier', 'apellido' => 'Ruiz Morales', 'cedula' => '1851025104'],
            ['nombre' => 'Gabriel Enrique', 'apellido' => 'Ramos Cruz', 'cedula' => '1805756663'],
        ];

        DB::beginTransaction();

        try {
            foreach ($comuneros as $index => $c) {
                // Verificar si ya existe para evitar errores o duplicados
                $existe = Persona::where('cedula', $c['cedula'])->first();
                if ($existe) {
                    $this->command->info("El usuario {$c['nombre']} {$c['apellido']} ya existe. Saltando...");
                    continue;
                }

                // 1. Crear Persona Titular (Dueño)
                $titular = Persona::create([
                    'cedula' => $c['cedula'],
                    'nombre' => $c['nombre'],
                    'apellido' => $c['apellido'],
                    'id_genero' => 1, // 1 = Masculino (Asignado por defecto para las pruebas)
                    'id_sector' => 1, // 1 = San Luis por defecto
                    'estado_vital' => 'Vivo',
                    'fecha_nacimiento' => Carbon::create(1980, 1, 1)->addYears($index)->format('Y-m-d'),
                ]);

                // 2. Agregarle un Contacto Telefónico por defecto para que no de error
                DB::table('Contacto_Persona')->insert([
                    'id_persona' => $titular->id_persona,
                    'id_tipo_contacto' => 1, // 1 = Celular
                    'valor_contacto' => '099999999' . $index,
                    'id_operadora' => 1,
                    'es_principal' => 1
                ]);

                // 3. Agregarle un Dependiente (Hijo de prueba)
                $hijo = Persona::create([
                    'cedula' => '0000000' . str_pad($index + 1, 3, '0', STR_PAD_LEFT), // Cédula ficticia para el hijo
                    'nombre' => 'Hijo de ' . explode(' ', $c['nombre'])[0],
                    'apellido' => $c['apellido'],
                    'id_genero' => 1,
                    'id_representante_familia' => $titular->id_persona, // Se vincula como su hijo
                    'estado_vital' => 'Vivo',
                    'fecha_nacimiento' => Carbon::create(2010, 1, 1)->addYears($index)->format('Y-m-d'),
                ]);

                // 4. Crear Terreno falso (Clave Catastral estandarizada: SEC-01-XXX)
                $secuencial = str_pad($index + 1, 3, '0', STR_PAD_LEFT);
                $claveCatastral = "SEC-01-{$secuencial}";

                Terreno::create([
                    'id_persona' => $titular->id_persona,
                    'clave_catastral' => $claveCatastral,
                    'area_total' => 250.50 + ($index * 10), // Areas progresivas y diferentes (250m2, 260m2...)
                    'id_estado_construccion' => 1, // Baldío o equivalente
                    'latitud' => -1.240 + ($index * 0.001),
                    'longitud' => -78.620 + ($index * 0.001),
                ]);

                $this->command->info("✓ Creado: {$c['nombre']} {$c['apellido']} | Terreno: {$claveCatastral} | 1 Hijo");
            }

            DB::commit();
            $this->command->info("========================================");
            $this->command->info("¡Todos los comuneros importados con éxito!");

        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error("Hubo un error en la importación: " . $e->getMessage());
        }
    }
}
