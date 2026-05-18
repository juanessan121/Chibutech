# Chibutech — ERP Junta de Agua

API REST completa probada y funcional. Sin necesidad de instalar PHP, Composer ni Devilbox.

**Stack verificado:** Laravel 11.52 · PHP 8.2.31 · MariaDB 10.11 · Nginx 1.25 · PhpMyAdmin · Mailpit

---

## Requisitos

| Herramienta | Descarga |
|-------------|----------|
| Docker Desktop | https://www.docker.com/products/docker-desktop |
| Git | https://git-scm.com |

Verificar instalación:
```bash
docker --version
docker compose version
```

---

## Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/juanessan121/Chibutech
cd Chibutech/htdocs
```

### 2. Crear el archivo de entorno
```bash
# Linux / macOS
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env

# Windows (CMD)
copy .env.example .env
```

### 3. Levantar
```bash
docker compose up -d --build
```

Primera vez: 3–8 minutos. Las siguientes: menos de 30 segundos.

### 4. Verificar que todo levantó
```bash
docker compose ps
```

Resultado esperado — todos en `Up`:
```
NAME                   STATUS
chibutech_db           Up (healthy)
chibutech_backend      Up
chibutech_nginx        Up
chibutech_phpmyadmin   Up
chibutech_mailpit      Up
```

### 5. Verificar que la API responde
```bash
curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Chibutech2025!"}'
```

Debe devolver un JSON con `token` y datos del usuario. ✅

---

## Servicios

| Servicio | URL | Descripción |
|----------|-----|-------------|
| API REST | http://localhost:8000/api | Todos los endpoints |
| Swagger UI | http://localhost:8000/api/documentation | Documentación interactiva |
| PhpMyAdmin | http://localhost:8080 | Gestor visual de BD |
| Mailpit | http://localhost:8025 | Captura de emails locales |

> ⚠️ La API corre en el puerto **8000** (no 80) para compatibilidad con Devilbox.

---

## Credenciales

### API
| Campo | Valor |
|-------|-------|
| Usuario | `admin` |
| Contraseña | `Chibutech2025!` |

### PhpMyAdmin
| Campo | Valor |
|-------|-------|
| Usuario | `root` |
| Contraseña | `root_super_secreto` |

### Base de datos (DataGrip / DBeaver)
| Campo | Valor |
|-------|-------|
| Host | `localhost` |
| Puerto | `3308` |
| Base de datos | `chibutec_dev` |
| Usuario | `chibu_user` |
| Contraseña | `chibu_password` |

---

## Cómo usar la API

### 1. Obtener token
```bash
curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Chibutech2025!"}'
```

Respuesta:
```json
{
  "token": "1|abc123...",
  "usuario": {
    "id": 1,
    "username": "admin",
    "rol": "Administrador",
    "permisos": ["usuarios.ver", "personas.ver", ...]
  }
}
```

### 2. Usar el token
```bash
curl http://localhost:8000/api/personas \
  -H "Authorization: Bearer 1|abc123..."
```

### 3. Explorar con Swagger
1. Ir a http://localhost:8000/api/documentation
2. Click en **Authorize** (candado arriba a la derecha)
3. Pegar el token del paso 1
4. Probar cualquier endpoint desde el navegador

---

## Endpoints

### Auth (público)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Login — devuelve token |
| GET | `/api/auth/me` | Ver usuario autenticado |
| POST | `/api/auth/logout` | Cerrar sesión |

### Catálogos
| Método | Ruta | Permiso |
|--------|------|---------|
| GET | `/api/catalogos/zonas` | — |
| POST · PUT · DELETE | `/api/catalogos/zonas/{id}` | `catalogos.gestionar` |
| GET | `/api/catalogos/condiciones` | — |
| POST | `/api/catalogos/condiciones` | `catalogos.gestionar` |
| GET | `/api/catalogos/cargos-directivos` | — |
| POST | `/api/catalogos/cargos-directivos` | `catalogos.gestionar` |
| GET | `/api/catalogos/tipos-contacto` | — |
| GET | `/api/catalogos/estados-construccion` | — |
| GET | `/api/catalogos/niveles-academicos` | — |
| GET | `/api/catalogos/titulos?search=medicina` | — |

### Personas
| Método | Ruta | Permiso |
|--------|------|---------|
| GET | `/api/personas` | `personas.ver` |
| GET | `/api/personas/{id}` | `personas.ver` |
| POST | `/api/personas` | `personas.crear` |
| POST | `/api/personas/{id}/contactos` | `personas.crear` |
| PUT · PATCH | `/api/personas/{id}` | `personas.editar` |
| DELETE | `/api/personas/{id}` | `personas.eliminar` |
| DELETE | `/api/personas/{id}/contactos/{cId}` | `personas.eliminar` |

### Directiva
| Método | Ruta | Permiso |
|--------|------|---------|
| GET | `/api/directiva` | `directiva.ver` |
| GET | `/api/directiva/{id}` | `directiva.ver` |
| GET | `/api/directiva/historial/{personaId}` | `directiva.ver` |
| POST | `/api/directiva` | `directiva.gestionar` |
| PATCH | `/api/directiva/{id}/finalizar` | `directiva.gestionar` |

### Catastro
| Método | Ruta | Permiso |
|--------|------|---------|
| GET | `/api/catastro/terrenos` | `terrenos.ver` |
| GET | `/api/catastro/terrenos/{id}` | `terrenos.ver` |
| POST | `/api/catastro/terrenos` | `terrenos.gestionar` |
| PUT | `/api/catastro/terrenos/{id}` | `terrenos.gestionar` |
| DELETE | `/api/catastro/terrenos/{id}` | `terrenos.gestionar` |

### Finanzas
| Método | Ruta | Permiso |
|--------|------|---------|
| GET | `/api/finanzas/multas` | `multas.ver` |
| POST | `/api/finanzas/multas` | `multas.gestionar` |
| PATCH | `/api/finanzas/multas/{id}/pagar` | `multas.gestionar` |
| PATCH | `/api/finanzas/multas/{id}/anular` | `multas.gestionar` |
| GET | `/api/finanzas/caja` | `caja.ver` |
| GET | `/api/finanzas/caja/resumen` | `caja.ver` |
| POST | `/api/finanzas/caja` | `caja.registrar` |

### Auditoría (solo lectura)
| Método | Ruta | Permiso |
|--------|------|---------|
| GET | `/api/auditoria` | `config.ver` |
| GET | `/api/auditoria/tablas` | `config.ver` |
| GET | `/api/auditoria/{id}` | `config.ver` |

### Usuarios
| Método | Ruta | Permiso |
|--------|------|---------|
| GET | `/api/usuarios` | `usuarios.ver` |
| GET | `/api/usuarios/roles` | `usuarios.ver` |
| POST | `/api/usuarios` | `usuarios.crear` |
| PATCH | `/api/usuarios/{id}/rol` | `usuarios.editar` |
| PATCH | `/api/usuarios/{id}/password` | `usuarios.editar` |
| DELETE | `/api/usuarios/{id}` | `usuarios.eliminar` |

---

## Roles y permisos

| Rol | Acceso |
|-----|--------|
| **Administrador** | Todo el sistema (19 permisos) |
| **Directivo** | Ver personas · Finanzas · Directiva |
| **Operador** | CRUD personas · Catastro · Finanzas |
| **Consultor** | Solo lectura en todos los módulos |

---

## Comandos de desarrollo

```bash
make up              # levantar todo
make down            # bajar todo
make logs            # logs en tiempo real
make logs-backend    # logs solo del backend
make shell           # terminal dentro del backend
make db-shell        # consola MariaDB
make fresh           # reset total de BD (borra datos)
make migrate         # correr migraciones
make seed            # correr seeders
make routes          # listar todas las rutas
make swagger         # regenerar Swagger UI
make tinker          # Laravel Tinker
make ps              # estado de contenedores
```

Sin `make` (Windows):
```bash
docker compose up -d --build
docker compose down
docker compose logs -f
docker compose exec backend sh
docker compose exec backend php artisan migrate
docker compose exec backend php artisan route:list
```

---

## Base de datos

| Elemento | Detalle |
|----------|---------|
| Tablas | 18 |
| Triggers de auditoría | 18 (INSERT · UPDATE · DELETE × 6 tablas) |
| Títulos CINE | 2510 registros del catálogo nacional |
| Roles | 4 (Administrador, Directivo, Operador, Consultor) |
| Permisos | 19 distribuidos por módulo |

Conexión directa con DataGrip o DBeaver: `localhost:3308`

---

## Estructura del proyecto

```
htdocs/
├── docker-compose.yml
├── .env.example                  ← copiar a .env
├── .gitignore
├── Makefile
├── README.md
├── nginx/conf.d/default.conf
├── database/init/                ← SQLs que carga MariaDB al crear la BD
│   ├── 02_carreras_cine.sql      ← 2510 títulos CINE
│   └── 03_auditoria_triggers.sql ← 18 triggers
├── frontend/                     ← pendiente (equipo frontend)
└── backend/                      ← Laravel 11
    ├── Dockerfile
    ├── docker-entrypoint.sh
    ├── artisan
    ├── composer.json
    ├── bootstrap/app.php
    ├── app/
    │   ├── Models/               ← 18 modelos
    │   ├── Http/Controllers/Api/ ← 9 controllers
    │   ├── Http/Resources/       ← 8 transformadores JSON
    │   ├── Http/Requests/        ← 7 validadores
    │   └── Http/Middleware/      ← CheckRole, CheckPermission
    ├── config/                   ← app, auth, database, sanctum, cors...
    ├── database/
    │   ├── migrations/           ← 9 migraciones en orden
    │   ├── seeders/              ← DatabaseSeeder + CarrerasCineSeeder
    │   └── data/carreras_cine.sql
    └── routes/api.php            ← 40+ endpoints con RBAC
```

---

## Conflicto de puertos con Devilbox

Si Devilbox está corriendo al mismo tiempo, algunos puertos pueden chocar.
El `.env.example` ya usa puertos alternativos para evitarlo:

| Servicio | Puerto Chibutech | Puerto Devilbox |
|----------|-----------------|-----------------|
| HTTP / API | 8000 | 80 |
| MariaDB | 3308 | 3307 |
| PhpMyAdmin | 8080 | — |

Si igual hay conflicto, edita `.env` y cambia los puertos:
```env
NGINX_PORT=8001
DB_EXTERNAL_PORT=3309
PMA_PORT=8081
```

---

## Solución de problemas

### Puerto ya en uso
```bash
# Ver qué ocupa el puerto (ej: 8000)
sudo lsof -i :8000 | grep LISTEN
# Cambiar el puerto en .env y volver a levantar
docker compose up -d
```

### El backend no arranca
```bash
docker compose logs backend --tail=30
```

### Reset total de base de datos
```bash
make fresh
# o:
docker compose down -v && docker compose up -d --build
```

### Error "Method Not Allowed" en el navegador
Normal — los endpoints POST no se pueden probar desde el navegador directamente.
Usar Swagger en http://localhost:8000/api/documentation o un cliente como Postman/Insomnia.

### Windows: 'make' no reconocido
Instalar Make: https://gnuwin32.sourceforge.net/packages/make.htm
O usar los comandos `docker compose ...` directamente.

---

## Workflow para el equipo

```bash
# Al clonar por primera vez
git clone <repo> && cd Chibutech/htdocs
cp .env.example .env
docker compose up -d --build

# Al hacer git pull con cambios
git pull
docker compose up -d --build   # solo reconstruye si cambió el Dockerfile
docker compose exec backend php artisan migrate   # si hay migraciones nuevas
```

> Los cambios en archivos `.php` se reflejan inmediatamente — el código está montado como volumen, no hay que reconstruir.
