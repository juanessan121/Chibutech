# Chibutech — ERP Junta de Agua
## Consejo de Gobierno Comunitario Chibuleo-San Francisco

Sistema de gestión comunitaria: agua potable, mingas (trabajo comunitario), catastro de terrenos, cobros/multas, directiva y auditoría.

**Stack real (verificado contra el código):**

| Componente | Versión |
|---|---|
| Backend | Laravel 12 (`^12.0`) + PHP 8.2 + Laravel Sanctum 4 |
| Base de datos | MariaDB 10.6.25 |
| Frontend | React 19.2 + Vite 8 + React Router 7 + Zustand 5 + Axios |
| Orquestación | Docker Compose |

---

## Acceso rápido (desarrollo local)

### 1. Requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y **corriendo**
- Git
- Puertos libres en tu máquina: **5173**, **8080**, **8081**, **3308**

### 2. Levantar el proyecto
```bash
git clone https://github.com/juanessan121/Chibutech.git
cd Chibutech
docker-compose up -d --build
```
La primera vez tarda 3–5 minutos (instala dependencias, crea la base de datos, aplica migraciones y seeders). Ver progreso:
```bash
docker-compose logs -f backend
```

### 3. URLs y credenciales

| Servicio | URL | Usuario | Contraseña |
|---|---|---|---|
| **App web** | http://localhost:5173 | `admin` | `admin` |
| Backend API | http://localhost:8080/api | — | — |
| phpMyAdmin | http://localhost:8081 | `root` | `root_super_secreto` |

> ⚠️ `http://localhost:8080/api` solo funciona en tu propia computadora (donde corre Docker). En producción la URL del backend es la del dominio real (ver sección "Producción" abajo). Visitar `http://localhost:8080/api` directamente en el navegador siempre muestra "404 Not Found" — es normal, esa ruta no existe; prueba en su lugar una ruta real como `/api/auth/login` (requiere `POST`).

**Base de datos (conexión directa con DBeaver / TablePlus / phpMyAdmin):**

| Campo | Valor |
|---|---|
| Host | `127.0.0.1` |
| Puerto | `3308` |
| Base de datos | `basechi` |
| Usuario | `ChibuleoP2026` |
| Contraseña | `Chibutech2026` |

### 4. Login en la aplicación
- **Cédula + contraseña** (`admin` / `admin`): entra como Administrador/Directiva.
- **Solo cédula** (sin contraseña): cualquier comunero registrado entra como usuario regular; si la cédula no existe en el sistema, se crea automáticamente.

---

## Comandos esenciales

```bash
docker-compose up -d --build     # levantar / reconstruir todo
docker-compose down              # apagar (conserva los datos)
docker-compose down -v           # apagar y BORRAR la base de datos (reset total)
docker-compose ps                # ver estado de los contenedores
docker-compose logs -f backend   # logs del backend en vivo
docker-compose logs -f frontend  # logs del frontend en vivo
docker-compose exec backend php artisan migrate   # correr migraciones nuevas manualmente
```

---

## Documentación técnica

| Manual | Para qué sirve |
|---|---|
| [`docs/manual/MANUAL_TECNICO_DESARROLLO.md`](docs/manual/MANUAL_TECNICO_DESARROLLO.md) | Arquitectura, stack, estructura del código, base de datos, cómo agregar funcionalidades — para quien programa/mantiene el sistema |
| [`docs/manual/MANUAL_TECNICO_DESPLIEGUE.md`](docs/manual/MANUAL_TECNICO_DESPLIEGUE.md) | Cómo llevar el sistema a un servidor de producción — **general, sirve para cualquier proveedor** (cPanel, Plesk, VPS con Apache/Nginx, Docker, plataformas cloud), con checklist de errores comunes |
| [`docs/manual/MANUAL_USUARIO.md`](docs/manual/MANUAL_USUARIO.md) | Manual de uso del sistema, pantalla por pantalla, para comuneros/directiva/administradores |

Para importar la base de datos en un hosting compartido, usa **`database/01_chibutech_hosting_compartido.sql`** (no `01_chibutech_completo.sql`, que solo funciona en el entorno Docker de desarrollo).

**Resumen del despliegue (sin Docker en el servidor, un solo dominio):**
1. Sube `backend/` completo — **ya incluye `vendor/` y el frontend compilado dentro de `public/app/` y `public/assets/`**. No hace falta Composer, npm ni Terminal en el hosting.
2. Configura el Document Root de tu dominio apuntando a `backend/public`. Ese mismo dominio sirve la API (`/api/*`) y las pantallas del sistema — no hace falta un subdominio aparte ni configurar CORS.
3. Importa `database/01_chibutech_hosting_compartido.sql` desde phpMyAdmin.
4. Visita `https://mi-dominio.com/instalar.php?token=...` una sola vez — crea el `.env`, genera la clave y termina la configuración. Bórralo del servidor después.

---

## Estructura del proyecto

```
Chibutech/
├── docker-compose.yml
├── README.md                     ← este archivo
├── LEEME.md                      ← guía rápida para el equipo
├── docs/manual/                  ← manual de usuario + manual técnico de desarrollo + manual técnico de despliegue
├── database/
│   ├── 01_chibutech_completo.sql             ← para Docker (desarrollo)
│   └── 01_chibutech_hosting_compartido.sql   ← para hosting compartido / cPanel
├── deploy/fusionar-frontend.sh   ← recompila el frontend y lo fusiona en backend/public/
├── backend/                      ← Laravel 12 (sirve la API Y el frontend juntos)
│   ├── app/Models/                 modelos
│   ├── app/Http/Controllers/Api/   controladores
│   ├── app/Http/Middleware/        CheckRole, CheckPermission
│   ├── database/migrations/
│   ├── database/seeders/
│   ├── config/cors.php             lee FRONTEND_URL del .env (normalmente ni se usa, mismo dominio)
│   ├── routes/web.php              Route::fallback sirve el frontend para rutas que no son /api/*
│   ├── routes/api.php
│   ├── vendor/                     dependencias PHP ya instaladas (no falta correr composer)
│   └── public/
│       ├── index.php               punto de entrada de Laravel
│       ├── instalar.php            instalador web de un solo uso (borrar tras usarlo)
│       ├── app/index.html          el frontend compilado (pantalla inicial)
│       ├── assets/                 JS/CSS del frontend compilado
│       └── config.js               override opcional de la URL de la API
└── frontend/                     ← React 19 + Vite (código fuente, se compila y se fusiona en backend/public/)
    └── src/
        ├── pages/                  una pantalla por módulo
        ├── services/axiosConfig.js  usa ruta relativa /api en producción (mismo dominio)
        └── routes/AppRouter.jsx
```

---

## Solución de problemas

### El frontend no carga / error de conexión
Espera 30 segundos más — el backend puede estar terminando de iniciar. Verifica con `docker-compose ps` (todos deben estar `Up`, la base de datos en `healthy`).

### Puerto ya en uso
Otro programa está usando el puerto 5173, 8080, 8081 o 3308. Ciérralo o cambia el puerto en `docker-compose.yml`.

### La base de datos está vacía / quiero reiniciar todo
```bash
docker-compose down -v
docker-compose up -d --build
```
⚠️ Esto borra todos los datos y vuelve a importar el SQL desde cero.

### Estoy en producción y me sale 403 / 404 / pantalla en blanco
Revisa el checklist de errores comunes en **[`docs/manual/MANUAL_TECNICO_DESPLIEGUE.md`](docs/manual/MANUAL_TECNICO_DESPLIEGUE.md#11-checklist-de-errores-comunes)**. La causa más común es el Document Root mal configurado (debe apuntar a `backend/public`, no a `backend`) o que falte la carpeta `backend/public/app/` (el frontend compilado) al subir los archivos.
