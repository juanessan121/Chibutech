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

## Producción (hosting compartido / cPanel)

El proceso completo para subir el sistema a un hosting con cPanel (crear base de datos, importar el SQL sin errores de permisos, configurar el backend y el frontend, dominios, CORS y HTTPS) está documentado paso a paso en:

**[`docs/manual/MANUAL_USUARIO.md` — Sección 11](docs/manual/MANUAL_USUARIO.md#11-guía-técnica-subir-chibutech-a-un-servidor-con-cpanel)**

Incluye también un checklist de errores comunes ("Acceso denegado", 403, 404, pantalla en blanco) con su causa y solución.

Para importar la base de datos en un hosting compartido, usa **`database/01_chibutech_hosting_compartido.sql`** (no `01_chibutech_completo.sql`, que solo funciona en el entorno Docker de desarrollo).

**Resumen del despliegue (sin Docker en el servidor):**
1. Sube `backend/` completo — **ya incluye `vendor/`**, no hace falta Composer ni Terminal en el hosting.
2. Sube el contenido de `frontend/dist/` (ya compilado, con `.htaccess` y `config.js` incluidos) directamente a `public_html`.
3. Importa `database/01_chibutech_hosting_compartido.sql` desde phpMyAdmin.
4. Visita `https://api.mi-dominio.com/instalar.php?token=...` una sola vez — crea el `.env`, genera la clave y termina la configuración. Bórralo del servidor después.
5. Edita `config.js` en el frontend con la URL real de la API.

---

## Estructura del proyecto

```
Chibutech/
├── docker-compose.yml
├── README.md                     ← este archivo
├── LEEME.md                      ← guía rápida para el equipo
├── docs/manual/                  ← manual de usuario + guía de despliegue en cPanel
├── database/
│   ├── 01_chibutech_completo.sql             ← para Docker (desarrollo)
│   └── 01_chibutech_hosting_compartido.sql   ← para hosting compartido / cPanel
├── backend/                      ← Laravel 12
│   ├── app/Models/                 modelos
│   ├── app/Http/Controllers/Api/   controladores
│   ├── app/Http/Middleware/        CheckRole, CheckPermission
│   ├── database/migrations/
│   ├── database/seeders/
│   ├── config/cors.php             dominios permitidos (editar en producción)
│   └── routes/api.php
└── frontend/                     ← React 19 + Vite
    ├── public/config.js           URL base de la API — editable en el servidor SIN recompilar
    └── src/
        ├── pages/                  una pantalla por módulo
        ├── services/axiosConfig.js  lee la URL desde config.js (window.__API_BASE_URL__)
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

### Estoy en producción (cPanel) y me sale 403 / 404 / pantalla en blanco
Revisa el checklist de la sección 11.9 del manual: **[`docs/manual/MANUAL_USUARIO.md`](docs/manual/MANUAL_USUARIO.md)**. Las causas más comunes son: Document Root del backend mal configurado (debe apuntar a `backend/public`, no a `backend`), el contenido de `dist/` del frontend subido dentro de una subcarpeta en vez de la raíz del dominio, o `frontend/public/config.js` sin actualizar con la URL real de la API (se edita directamente en el servidor, no requiere recompilar).
