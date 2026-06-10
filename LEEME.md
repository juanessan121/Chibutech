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
