# Chibutech ERP — Guía rápida para el equipo

## Requisitos previos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y **corriendo**
- Git instalado
- Puertos libres: **5173**, **8080**, **8081**, **3308**

---

## Primera vez (clonar el proyecto)

```bash
git clone https://github.com/juanessan121/Chibutech.git
cd Chibutech
docker compose up --build -d
```

La primera vez tarda **3–5 minutos** — el sistema hace todo solo:
1. Crea la base de datos e importa los datos iniciales (catálogos, sectores)
2. Instala dependencias PHP con Composer
3. Genera la clave de la aplicación (APP_KEY)
4. Aplica todas las migraciones de base de datos
5. Crea el usuario administrador
6. Instala dependencias del frontend (npm)
7. Levanta todos los servicios

Para ver el progreso en tiempo real:
```bash
docker compose logs -f backend
```

---

## Acceder al sistema

| Servicio        | URL                          |
|-----------------|------------------------------|
| **App web**     | http://localhost:5173        |
| Backend API     | http://localhost:8080/api    |
| phpMyAdmin (BD) | http://localhost:8081        |

### Credenciales de acceso al sistema

| Campo    | Valor   |
|----------|---------|
| Usuario  | `admin` |
| Clave    | `admin` |

> Cambia la contraseña desde el perfil después del primer acceso.

> ⚠️ **`http://localhost:5173` y `http://localhost:8080` solo existen en tu propia computadora.** No son URLs de producción — nadie más puede acceder a ellas, ni siquiera desde el mismo hosting. Si visitas `http://localhost:8080/api` directamente en el navegador verás "404 Not Found": es normal, esa ruta no existe por sí sola, solo rutas específicas como `/api/auth/login`. Para probar que el backend responde de verdad, usa Postman/Insomnia contra esa ruta con `POST`.

### Credenciales de base de datos (DBeaver / TablePlus / phpMyAdmin)

| Campo      | Valor           |
|------------|-----------------|
| Host       | `127.0.0.1`     |
| Puerto     | `3308`          |
| Base datos | `basechi`       |
| Usuario    | `ChibuleoP2026` |
| Contraseña | `Chibutech2026` |

---

## Después de hacer `git pull` (actualizaciones del equipo)

```bash
git pull
docker compose restart
```

El sistema aplica automáticamente al reiniciar:
- Migraciones nuevas de base de datos
- Dependencias PHP nuevas (Composer)
- Dependencias npm nuevas (frontend)

**Si hay cambios en algún `Dockerfile`** (poco frecuente):
```bash
git pull
docker compose up --build -d
```

---

## Apagar el sistema

```bash
docker compose down
```

Para apagar **y borrar la base de datos** (empezar desde cero):
```bash
docker compose down -v
```

> ⚠️ `down -v` elimina todos los datos. Úsalo solo si quieres un reset total.

---

## Solución de problemas comunes

### El frontend no carga / error de conexión
Espera 30 segundos más — el backend puede estar terminando de iniciar.
Verifica con: `docker compose ps` (todos deben estar `Up`)

### Error al iniciar: puerto ocupado
Alguien tiene otro servicio en el puerto 5173, 8080, 8081 o 3308.
Cierra ese servicio o edita los puertos en `docker-compose.yml`.

### La base de datos está vacía / no hay datos
```bash
docker compose down -v
docker compose up --build -d
```

### Ver logs de un contenedor
```bash
docker compose logs -f backend     # PHP / Laravel
docker compose logs -f frontend    # Vite / React
docker compose logs -f db          # MariaDB
```

---

## Correo electrónico (opcional)

Por defecto los correos se guardan en logs y no se envían realmente.
Para activar envío real, edita `backend/.env`:

```env
MAIL_MAILER=smtp
MAIL_USERNAME=tu_correo@gmail.com
MAIL_PASSWORD=tu_clave_de_aplicacion_gmail
MAIL_FROM_ADDRESS=tu_correo@gmail.com
```

La clave de aplicación se genera en:
`Cuenta Google → Seguridad → Verificación en 2 pasos → Contraseñas de aplicaciones`

---

## Subir el sistema a un servidor (producción)

Esta guía (arriba) es solo para desarrollo local con Docker. Para publicar el sistema en un servidor real, la guía técnica completa — para **cualquier tipo de hosting**, no solo cPanel — está en:

**[`docs/manual/MANUAL_TECNICO_DESPLIEGUE.md`](docs/manual/MANUAL_TECNICO_DESPLIEGUE.md)**

Y para entender la arquitectura/el código (si además de desplegarlo necesitas modificarlo):

**[`docs/manual/MANUAL_TECNICO_DESARROLLO.md`](docs/manual/MANUAL_TECNICO_DESARROLLO.md)**

Puntos clave que se pierden fácilmente al pasar de Docker a producción:
- Usa `database/01_chibutech_hosting_compartido.sql` para importar la base de datos (no `01_chibutech_completo.sql`, que solo sirve para Docker).
- El Document Root debe apuntar a `backend/public`, **no** a `backend`. Un solo dominio sirve la API y el frontend juntos — ya no hace falta un subdominio aparte para la API, ni configurar CORS.
- `backend/vendor/` y el frontend ya compilado (`backend/public/app/`, `backend/public/assets/`) **vienen incluidos en el proyecto**, listos para subir — no hace falta Composer, npm ni Terminal en el hosting.
- El sistema trae un instalador web de un solo uso: `backend/public/instalar.php`. Se visita una vez desde el navegador (`https://tu-dominio.com/instalar.php?token=...`, el token está dentro del propio archivo). Crea el `.env`, genera la clave de la aplicación y aplica lo que falte — sin Terminal, sin SSH. **Bórralo del servidor apenas termine de usarlo.**
- Si ves "Acceso denegado", "403 Forbidden" o "404" al desplegar, revisa el checklist completo de errores comunes en el manual de despliegue.
