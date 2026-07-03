# Manual Técnico — Desarrollo
## Chibutech ERP — Sistema de Gestión Comunitaria

> Este manual es para quien programa o mantiene el sistema. Explica la arquitectura, el stack, la estructura del código, la base de datos y cómo trabajar en el entorno de desarrollo local.
>
> Para el manual de **uso** del sistema (pantalla por pantalla, para comuneros/directiva/administradores), ver [`MANUAL_USUARIO.md`](MANUAL_USUARIO.md).
> Para llevar el sistema a un servidor de producción, ver [`MANUAL_TECNICO_DESPLIEGUE.md`](MANUAL_TECNICO_DESPLIEGUE.md).

---

## Índice

1. [Resumen del proyecto](#1-resumen-del-proyecto)
2. [Arquitectura general](#2-arquitectura-general)
3. [Estructura de carpetas](#3-estructura-de-carpetas)
4. [Entorno de desarrollo local con Docker](#4-entorno-de-desarrollo-local-con-docker)
5. [Backend (Laravel)](#5-backend-laravel)
   - 5.1 [Modelos](#51-modelos)
   - 5.2 [Controladores de la API](#52-controladores-de-la-api)
   - 5.3 [Rutas](#53-rutas)
   - 5.4 [Autenticación y permisos](#54-autenticación-y-permisos)
   - 5.5 [Migraciones y seeders](#55-migraciones-y-seeders)
   - 5.6 [Triggers de auditoría](#56-triggers-de-auditoría)
   - 5.7 [Tareas programadas (scheduler)](#57-tareas-programadas-scheduler)
6. [Frontend (React)](#6-frontend-react)
   - 6.1 [Estructura de carpetas](#61-estructura-de-carpetas)
   - 6.2 [Enrutamiento y permisos en pantalla](#62-enrutamiento-y-permisos-en-pantalla)
   - 6.3 [Estado global (Zustand)](#63-estado-global-zustand)
   - 6.4 [Comunicación con la API](#64-comunicación-con-la-api)
   - 6.5 [Build de producción](#65-build-de-producción)
7. [Base de datos](#7-base-de-datos)
8. [Reglas de negocio clave](#8-reglas-de-negocio-clave)
9. [Cómo agregar una funcionalidad nueva (flujo típico)](#9-cómo-agregar-una-funcionalidad-nueva-flujo-típico)
10. [Depuración y logs](#10-depuración-y-logs)

---

## 1. Resumen del proyecto

**Chibutech** es un ERP para la gestión de una junta/consejo de agua comunitario (caso real: Consejo de Gobierno Comunitario Chibuleo-San Francisco, Ecuador). Administra:

- Padrón de comuneros (personas, familias, condiciones especiales, nivel educativo)
- Catastro de terrenos y cálculo de cuotas de agua
- Mingas (jornadas de trabajo comunitario) y control de asistencia
- Multas y cobros (ventanilla, planillas de agua, arqueo de caja)
- Directiva (organigrama, periodos, cargos)
- Auditoría (quién cambió qué y cuándo)
- Reportes (padrón, morosidad, balance financiero) en PDF

**Stack:**

| Capa | Tecnología |
|---|---|
| Backend | Laravel 12 (`^12.0`), PHP 8.2, Laravel Sanctum 4 (auth por token) |
| Base de datos | MariaDB 10.6.25 |
| Frontend | React 19.2, Vite 8, React Router 7, Zustand 5, Axios, Tailwind-like CSS in-line, Leaflet (mapas), jsPDF (reportes) |
| Orquestación local | Docker Compose |
| Producción | Un solo dominio: Laravel sirve la API y el frontend compilado juntos (ver sección 2) |

---

## 2. Arquitectura general

### Desarrollo local (Docker)

En desarrollo, el frontend y el backend corren como **dos servicios separados** dentro de Docker, para aprovechar el recargado en caliente (hot reload) de Vite:

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────┐
│  frontend        │      │  backend          │      │  db          │
│  Vite dev server │──────▶  Laravel (Apache)  │──────▶  MariaDB      │
│  :5173           │ CORS │  :8080             │      │  :3306→3308  │
└─────────────────┘      └──────────────────┘      └─────────────┘
        ▲                                                    ▲
        │                                                    │
   navegador                                          phpMyAdmin :8081
```

El frontend en `:5173` le habla a la API en `http://localhost:8080/api` (URL fija, ver `frontend/src/services/axiosConfig.js`). Como son puertos distintos, técnicamente es una petición **cross-origin**, por eso `backend/config/cors.php` incluye `http://localhost:5173` en `allowed_origins`.

### Producción (unificada)

En producción, el frontend **no corre como servidor aparte** — se compila a archivos estáticos (HTML/JS/CSS) y esos archivos se colocan **dentro de `backend/public/`**. Laravel pasa a servir todo desde un único dominio:

```
┌───────────────────────────────────────────────────────────┐
│  Un solo dominio (Apache + PHP, o Nginx + PHP-FPM)          │
│                                                              │
│  /api/*         → Laravel (routes/api.php)  → JSON          │
│  /assets/*      → archivos estáticos (JS/CSS del frontend)  │
│  /config.js     → archivo estático (override opcional)      │
│  cualquier otra → Route::fallback() (routes/web.php)        │
│  ruta            → sirve public/app/index.html              │
│                     (React Router toma el control ahí)      │
└───────────────────────────────────────────────────────────┘
```

Esto elimina CORS por completo (mismo origen) y evita tener que administrar dos Document Root / dos subdominios. El detalle completo de cómo se arma este empaquetado está en el manual de despliegue.

### Autenticación

- Login por **cédula + contraseña** (roles de gestión/directiva) o **solo cédula** (comuneros — se crea automáticamente el usuario si la cédula no existe en la tabla `usuarios` pero sí en `Persona`).
- Laravel Sanctum emite un **token Bearer** (no cookies de sesión) al hacer login (`POST /api/auth/login`). El frontend lo guarda en `localStorage` (vía Zustand `persist`, clave `auth-storage`) y lo manda en cada petición como `Authorization: Bearer <token>` (ver `axiosConfig.js`).
- **Los permisos NO se verifican en el backend.** El array `permisos` (ej. `ver_usuarios`, `crear_usuario`, `gestionar_mingas`) se calcula una sola vez en `AuthController::login()` según el campo `rol` del usuario, y se envía al frontend en la respuesta del login. El frontend usa ese array para decidir qué mostrar/ocultar (`usePermissions.js`, `PermissionRoute` en `AppRouter.jsx`). **Cualquier endpoint de la API solo exige estar autenticado (`auth:sanctum`)**, no exige un permiso específico — es una decisión de diseño a tener en cuenta si se expone la API más allá del propio frontend.

---

## 3. Estructura de carpetas

```
Chibutech/
├── docker-compose.yml         Orquestación local (db, backend, frontend, phpmyadmin)
├── Dockerfile                 (raíz, histórico — el real es backend/Dockerfile y frontend/Dockerfile)
├── docs/manual/                Los 3 manuales (usuario, desarrollo, despliegue)
├── database/
│   ├── 01_chibutech_completo.sql              Dump completo — solo para Docker (usuario root)
│   └── 01_chibutech_hosting_compartido.sql    Mismo dump, sin privilegios de superusuario — para producción
├── deploy/
│   └── fusionar-frontend.sh    Recompila el frontend y lo copia dentro de backend/public/
├── backend/                    Laravel 12
│   ├── app/
│   │   ├── Models/                Persona, Terreno, Usuario, Multa, Minga, etc.
│   │   ├── Http/Controllers/Api/   Un controlador por módulo
│   │   └── Console/Commands/       Comandos artisan personalizados (generación de planillas)
│   ├── bootstrap/app.php        Registro de rutas, middleware, scheduler (Laravel 12 usa este archivo en vez de Kernel.php)
│   ├── config/                  cors.php, database.php, sanctum.php, etc.
│   ├── database/
│   │   ├── migrations/            15 migraciones
│   │   └── seeders/                DatabaseSeeder, UsuarioSeeder, ImportComunerosSeeder
│   ├── public/
│   │   ├── index.php              Punto de entrada de Laravel
│   │   ├── instalar.php           Instalador web de un solo uso (solo debe existir en el paquete de despliegue)
│   │   ├── app/index.html          El frontend compilado (ver deploy/fusionar-frontend.sh)
│   │   ├── assets/                  JS/CSS del frontend compilado
│   │   └── config.js               Override opcional de la URL de la API
│   ├── routes/
│   │   ├── api.php                 Endpoints /api/*
│   │   └── web.php                 Route::fallback() que sirve el frontend
│   └── vendor/                  Dependencias de Composer (pre-instaladas, se suben tal cual a producción)
└── frontend/                    React 19 + Vite (código fuente)
    ├── public/                    Archivos estáticos: favicon, icons, config.js
    └── src/
        ├── pages/                  Una pantalla por archivo (30+ pantallas)
        ├── layouts/DashboardLayout.jsx   Menú lateral + topbar, arma el layout general
        ├── components/              Componentes reutilizables (CardSlider, ConfirmModal, CoordinateCapture, etc.)
        ├── hooks/usePermissions.js  Lee el array `permisos` del store de auth
        ├── services/                 Un archivo por dominio (personaService.js, cobroService.js, etc.) + axiosConfig.js
        ├── store/useAuthStore.js    Zustand con persistencia en localStorage
        └── routes/AppRouter.jsx    Definición de rutas + PermissionRoute/PrivateRoute
```

---

## 4. Entorno de desarrollo local con Docker

### Servicios (`docker-compose.yml`)

| Servicio | Imagen/Build | Puerto host | Descripción |
|---|---|---|---|
| `db` | `mariadb:10.6.25-jammy` | `3308→3306` | Base de datos. Importa automáticamente los `.sql` de `./database/` **solo la primera vez** (volumen vacío) |
| `backend` | `backend/Dockerfile` | `8080→80` | Apache + PHP 8.2. Su `docker-entrypoint.sh` instala dependencias, genera `APP_KEY`, corre migraciones/seeders cada vez que arranca |
| `frontend` | `frontend/Dockerfile` | `5173→5173` | Node 20, corre `npm run dev` (Vite) vía su propio `docker-entrypoint.sh` |
| `phpmyadmin` | `phpmyadmin/phpmyadmin` | `8081→80` | Administración visual de la base de datos |

Credenciales de desarrollo (**nunca usar en producción**): DB `basechi`, usuario `ChibuleoP2026`, contraseña `Chibutech2026`; login del sistema `admin`/`admin`.

### Comandos esenciales

```bash
docker-compose up -d --build      # levantar todo (primera vez tarda 3-5 min)
docker-compose down               # apagar, conserva los datos
docker-compose down -v            # apagar y BORRAR la base de datos (reset total)
docker-compose logs -f backend    # logs en vivo del backend
docker-compose exec backend php artisan migrate     # correr migraciones sueltas
docker-compose exec backend php artisan tinker       # consola interactiva de Laravel
docker-compose run --rm --entrypoint sh frontend -c "npm run build"   # compilar el frontend sin arrancar el dev server
```

> **Importante:** `docker-compose run --rm frontend npm run build` (sin `--entrypoint sh -c`) **no funciona** — el `docker-entrypoint.sh` del frontend ignora los argumentos y siempre arranca `npm run dev`. Hay que forzar `--entrypoint sh -c "..."` para saltarse ese script.

### Particularidad de `vendor/` en desarrollo

`docker-compose.yml` monta `backend/vendor` como un **volumen nombrado de Docker** (`backend_vendor`), no como parte del bind mount de `./backend`. Esto significa que `backend/vendor/` **no existe como carpeta real en el disco de Windows/host** durante el desarrollo normal — solo vive dentro del contenedor. Para producción, hay que extraerlo explícitamente:

```bash
docker cp chibutech_backend:/var/www/html/vendor ./backend/vendor
```

> Ojo: si `./backend/vendor` ya existe como carpeta (vacía o no) en el host antes de correr `docker cp`, Docker anida el contenido un nivel de más (`backend/vendor/vendor/...`). Verifica con `ls backend/vendor` que `autoload.php` esté directamente ahí, no un nivel más adentro.

---

## 5. Backend (Laravel)

### 5.1 Modelos

Ubicados en `backend/app/Models/`:

| Modelo | Tabla | Qué representa |
|---|---|---|
| `Persona` | `Persona` | Comunero, familiar o directivo. `$guarded = ['id_persona']` (todo lo demás es asignable) |
| `Usuario` | `usuarios` | Cuenta de acceso al sistema (cédula, password, rol, password_temporal) — distinta de `Persona` |
| `Terreno` | `Terreno` | Predio catastrado, con clave catastral, área, coordenadas, estado de construcción |
| `Multa` | `Multa` | Sanción económica (inasistencia a minga, u otra manual) |
| `PlanillaCabecera` / `PlanillaDetalle` | `Planilla_Cabecera` / `Planilla_Detalle_Terreno` | Factura de agua mensual por terreno |
| `Minga` | `Minga` | Jornada de trabajo comunitario convocada |
| `AsignacionSectorMinga` | `Asignacion_Sector_Minga` | Qué sectores fueron convocados a una minga |
| `CajaComunitaria` | `Caja_Comunitaria` | Movimiento de caja (ingreso/egreso) |
| `ContactoPersona` | `Contacto_Persona` | Teléfono/correo de una persona |
| `CondicionPersona` | `Condicion_Persona` | Discapacidad/condición especial de una persona |
| `PerfilEducativoPersona` | `Perfil_Educativo_Persona` | Título educativo de una persona |
| `TituloEducativo` | `Catalogo_Titulo_Educativo` | Catálogo nacional de 2500+ títulos (CINE) |
| `CatalogoGenero`, `CatalogoOperadora`, `CatalogoCondicionEspecial` | catálogos varios | Listas de selección |

No hay modelos Eloquent para `Miembro_Directiva`, `Auditoria`, `Sector`, `Zona`, `Configuracion_Global` — esas tablas se consultan directamente con el Query Builder (`DB::table(...)`) desde sus respectivos controladores.

### 5.2 Controladores de la API

Ubicados en `backend/app/Http/Controllers/Api/`:

| Controlador | Módulo que atiende |
|---|---|
| `AuthController` | Login, logout, recuperar contraseña, cambio de contraseña temporal, cambio de rol |
| `PersonaController` | Padrón de personas/usuarios, alta/edición, búsqueda |
| `TerrenoController` | Catastro, registro de terrenos, traspaso de dominio, copropietarios |
| `MingaController` | Programar mingas, asistencia, historial, actas PDF |
| `CobroController` | Ventanilla de cobro, multas, planillas, caja, reportes |
| `DirectivaController` | Organigrama, periodos, cambio de miembros |
| `DashboardController` | Endpoints consolidados `/dashboard/resumen` y `/dashboard/resumen-comunero` |
| `AuditoriaController` | Lectura de la bitácora (solo lectura) |
| `ConfiguracionController` | Parámetros globales, zonas/sectores, títulos |
| `TituloController` | Búsqueda de títulos educativos (autocompletar) |
| `NotificacionController` | Notificaciones de la campana (topbar) |

### 5.3 Rutas

`backend/routes/api.php` — todas las rutas de negocio, agrupadas bajo `Route::middleware('auth:sanctum')->group(...)` excepto login/forgot-password. No hay más granularidad de permisos que "estar autenticado" (ver sección 2).

`backend/routes/web.php` — en producción, sirve el frontend vía `Route::fallback()` (ver sección 2). En desarrollo esta ruta casi no se usa porque el frontend corre aparte en Vite.

`backend/bootstrap/app.php` — en Laravel 12 ya no existe `app/Http/Kernel.php`; el registro de rutas, middleware y el scheduler se hace acá, con `Application::configure(...)->withRouting(...)->withSchedule(...)`.

### 5.4 Autenticación y permisos

- **Login:** `POST /api/auth/login` con `{cedula, password?}`. Si la cédula corresponde a un usuario con `rol` de gestión, exige contraseña. Si es comunero (rol base), la contraseña es opcional; si el usuario no existe pero la cédula sí está en `Persona`, se crea automáticamente.
- **Token:** Sanctum Personal Access Token, devuelto como string plano (`"id|hash"`). El frontend lo manda como `Authorization: Bearer <token>` en cada petición (interceptor de Axios en `axiosConfig.js`).
- **Contraseña temporal:** campo `password_temporal` en `usuarios`. Si está en `true`, el frontend redirige obligatoriamente a la pantalla de cambio de contraseña antes de dejar usar el resto del sistema.
- **Permisos:** ver tabla de la sección 2. Se recalculan en cada login, no se guardan en base de datos como tabla de permisos.

### 5.5 Migraciones y seeders

15 migraciones en `backend/database/migrations/`, aplicadas en orden por nombre (timestamp). Los seeders (`backend/database/seeders/`):
- `DatabaseSeeder`: orquesta el resto.
- `UsuarioSeeder`: crea el usuario `admin`/`admin` si no existe (ver código en la sección de despliegue).
- `ImportComunerosSeeder`: importación masiva de comuneros (uso puntual, no se corre en cada despliegue).

**Nota clave:** el archivo `database/01_chibutech_completo.sql` (usado por Docker) es un **dump completo** de la base de datos (estructura + datos + triggers), no un conjunto de migraciones — por eso el flujo de producción dice explícitamente "no corras `migrate` después de importar ese SQL, ya está todo creado". El instalador de producción (`instalar.php`) sí corre `migrate --force`, pero de forma segura: Laravel reconoce por la tabla `migrations` (incluida en el dump) cuáles ya se aplicaron y no las repite.

### 5.6 Triggers de auditoría

18 triggers en MySQL/MariaDB (3 por tabla: INSERT/UPDATE/DELETE) sobre las tablas: `Persona`, `Terreno`, `Multa`, `Planilla_Cabecera`, `Planilla_Detalle_Terreno`, `Caja_Comunitaria`, `Usuario_Sistema`, `Miembro_Directiva`, `Jefe_Zona`. Cada uno inserta un registro en la tabla `Auditoria` con los datos anteriores/nuevos en formato JSON. Viven **dentro del SQL**, no en migraciones de Laravel — si se necesita modificar un trigger, se edita directamente el dump y se re-importa (o se escribe una migración `DB::unprepared(...)` para producción).

> Al exportar el dump para producción, estos triggers requirieron dos ajustes (ver `MANUAL_TECNICO_DESPLIEGUE.md`): quitar `DEFINER=root@localhost` (no existe en hosting compartido) y quitar `NO_AUTO_CREATE_USER` del `sql_mode` (eliminado en MySQL 8+).

### 5.7 Tareas programadas (scheduler)

Definida en `bootstrap/app.php`:
```php
->withSchedule(function (Schedule $schedule) {
    $schedule->command('planillas:generar-mes')->monthlyOn(1, '08:00');
})
```
Genera automáticamente las planillas de agua del mes, el día 1 a las 8:00 AM. En Docker, el contenedor de backend corre `cron` (ver `docker-entrypoint.sh`, línea `service cron start`) para que el scheduler de Laravel se dispare.

---

## 6. Frontend (React)

### 6.1 Estructura de carpetas

Ver sección 3. Cada pantalla vive en `src/pages/NombrePantalla.jsx` y se importa de forma perezosa (`lazy()`) en `src/routes/AppRouter.jsx`, excepto las pantallas de entrada (Landing, Login, ForgotPassword, CambiarPasswordTemporal) que cargan de inmediato.

### 6.2 Enrutamiento y permisos en pantalla

`AppRouter.jsx` define dos wrappers:
- `PrivateRoute`: exige que `isAuthenticated` sea `true` en el store de auth.
- `PermissionRoute`: además exige que el array `permisos` del usuario incluya el permiso indicado; si no, redirige a `/dashboard`.

`layouts/DashboardLayout.jsx` arma el menú lateral dinámicamente: cada ítem tiene una condición `show: hasPermission(...) || isRole(...)`, calculada con el hook `usePermissions.js`.

### 6.3 Estado global (Zustand)

`store/useAuthStore.js` guarda `{ user, token, isAuthenticated }` con el middleware `persist` de Zustand, serializado en `localStorage` bajo la clave `auth-storage`. Esto es lo que sobrevive a recargar la página.

### 6.4 Comunicación con la API

`services/axiosConfig.js` decide la URL base de la API con esta prioridad:
1. `window.__API_BASE_URL__` — si `public/config.js` define un valor (override manual).
2. Si el navegador está en `localhost`/`127.0.0.1` → `http://localhost:8080/api` (desarrollo).
3. Cualquier otro dominio → ruta relativa `/api` (producción — mismo origen que el frontend, ver sección 2).

Cada archivo en `services/` (ej. `personaService.js`, `cobroService.js`) exporta funciones que llaman a `api.get/post/put/delete(...)` usando esa instancia configurada de Axios, que además agrega el header `Authorization` automáticamente (interceptor).

### 6.5 Build de producción

```bash
cd frontend && npm run build
```
Genera `frontend/dist/` (gitignored, no se sube). El script `deploy/fusionar-frontend.sh` copia ese resultado dentro de `backend/public/` (ver `MANUAL_TECNICO_DESPLIEGUE.md`).

> `vite.config.js` usa `manualChunks` como **función** (no como objeto) — es un requisito de Vite 8, que usa el bundler Rolldown por defecto. Si se actualiza Vite y esto cambia de nuevo, revisar el mensaje de error `TypeError: manualChunks is not a function` como pista.

---

## 7. Base de datos

18 tablas principales (sin contar las de Laravel como `sessions`, `cache`, `jobs`, `migrations`). Ver el dump `database/01_chibutech_completo.sql` como referencia autoritativa del esquema (columnas, claves foráneas, triggers).

**Catálogos con valores fijos importantes:**
- `Catalogo_Tipo_Contacto`: 1=Celular, 2=Teléfono Fijo, 3=Correo Electrónico, 4=WhatsApp
- `Catalogo_Condicion_Especial`: incluye Discapacidad Física/Intelectual/Visual/Auditiva, Tercera Edad, Enfermedad Catastrófica
- `Catalogo_Estado_Construccion`: 1=Lote Baldío, 2=En Planificación, 3=En Construcción, 4=Construida
- `Catalogo_Cargo_Directivo`: Presidente, Vicepresidente, Secretario, Tesorero, Vocal Principal 1/2/3, Vocal Suplente 1/2 (9 cargos fijos)
- `Configuracion_Global`: parámetros clave-valor editables desde Administración → Configuración (`TARIFA_METROS_BASE`, `TARIFA_VALOR_BASE`, `valor_multa_minga_base`, etc.)

---

## 8. Reglas de negocio clave

(Ver también sección 10 de `MANUAL_USUARIO.md`, que las describe desde el punto de vista del usuario final.)

1. **Cobro de agua:** `ceil(área_m² / metros_base) × tarifa_base` por mes, **por terreno** (no por persona). `metros_base` y `tarifa_base` son configurables (`Configuracion_Global`, por defecto 1000 m² y $5).
2. **Copropietarios:** no reciben planilla propia; el cobro va siempre al titular (`id_persona` de `Terreno`).
3. **Multas bloquean el pago de agua:** si hay multas pendientes, no se puede pagar solo la planilla — hay que incluir el 100% de las multas en la misma transacción (ver `CobroController`).
4. **Mingas:** al cerrar el registro de asistencia, quienes quedaron "Faltó" generan una multa automáticamente; "Justificado" no genera nada.
5. **Directiva:** al registrar un nuevo periodo completo, el periodo anterior pasa a `Finalizado` automáticamente (nunca se borra, queda como historial).
6. **Traspaso de dominio de un terreno:** las deudas quedan con el dueño saliente; los copropietarios se eliminan (deben re-registrarse si aplica al nuevo dueño).
7. **Estado de registro de una persona:** `Pendiente` (correo no obligatorio, requiere aprobación) vs. `Activo` (flujo normal).

---

## 9. Cómo agregar una funcionalidad nueva (flujo típico)

1. **Base de datos:** si hace falta una tabla/columna nueva, crear una migración en `backend/database/migrations/` (no editar el dump SQL directamente para cambios nuevos — el dump es una foto inicial, las migraciones son el mecanismo real de versionado de esquema hacia adelante).
2. **Modelo:** crear/editar en `backend/app/Models/` si aplica.
3. **Controlador:** agregar el método en el controlador del módulo correspondiente (`backend/app/Http/Controllers/Api/`).
4. **Ruta:** registrar en `backend/routes/api.php`, dentro del grupo `auth:sanctum`.
5. **Servicio frontend:** agregar la función en `frontend/src/services/xxxService.js` que llama a esa ruta.
6. **Pantalla:** crear/editar el archivo en `frontend/src/pages/`, y registrar la ruta en `frontend/src/routes/AppRouter.jsx` (con `PermissionRoute` si aplica un permiso nuevo).
7. **Menú:** si es una pantalla nueva visible desde el menú lateral, agregar el ítem en `frontend/src/layouts/DashboardLayout.jsx` con su condición `show`.
8. **Permiso nuevo (si aplica):** agregarlo al array `$permisos` correspondiente en `AuthController::login()` (backend) y usarlo en `hasPermission('...')` (frontend). Recordar que esto no se persiste en base de datos, es lógica de código.
9. Probar en Docker local, y si el cambio toca `frontend/`, recordar correr `deploy/fusionar-frontend.sh` antes de desplegar a producción (ver manual de despliegue).

---

## 10. Depuración y logs

```bash
docker-compose logs -f backend              # logs de Apache/PHP en vivo
docker-compose exec backend php artisan tinker    # consola interactiva (probar queries, modelos)
docker-compose exec backend tail -f storage/logs/laravel.log   # log de errores de Laravel
docker-compose logs -f frontend             # logs de Vite (errores de compilación)
docker-compose exec db mysql -u root -p     # consola MySQL directa (contraseña: root_super_secreto)
```

Para depurar el instalador de producción (`instalar.php`) localmente antes de subirlo, se puede probar contra el propio Docker: `curl -X POST "http://localhost:8080/instalar.php?token=..." -d "db_host=db" -d "db_name=basechi" ...` — ver el detalle en `MANUAL_TECNICO_DESPLIEGUE.md`.

---

*Manual generado a partir del código fuente del sistema Chibutech. Última actualización: julio 2026.*
