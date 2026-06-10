# Chibutech ERP — Guía rápida para el equipo

## Requisitos previos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- Git instalado

---

## Primera vez (clonar el proyecto)

```bash
git clone https://github.com/juanessan121/Chibutech.git
cd Chibutech
git checkout feat/mejoras-jun-2026
docker compose up --build -d
```

Espera ~2–3 minutos la primera vez. El sistema hace todo solo:
- Importa la base de datos
- Instala dependencias PHP (Composer)
- Genera la clave de la aplicación
- Aplica todas las migraciones
- Levanta el frontend con sus dependencias

## Acceder al sistema

| Servicio | URL |
|---|---|
| Frontend (app) | http://localhost:5173 |
| Backend API | http://localhost:8080/api |
| phpMyAdmin | http://localhost:8081 |

---

## Después de hacer `git pull` (actualizaciones)

```bash
git pull
docker compose restart
```

El contenedor aplica automáticamente las migraciones nuevas al reiniciar.  
Si hay cambios en el `Dockerfile` o dependencias PHP nuevas:

```bash
git pull
docker compose up --build -d
```

---

## Apagar el sistema

```bash
docker compose down
```

---

## Correo electrónico (opcional)

Por defecto los correos se guardan en logs (`storage/logs/laravel.log`).  
Para activar envío real de correos, edita `backend/.env`:

```
MAIL_MAILER=smtp
MAIL_USERNAME=tu_correo@gmail.com
MAIL_PASSWORD=tu_clave_de_aplicacion_gmail
MAIL_FROM_ADDRESS=tu_correo@gmail.com
```

La clave de aplicación se genera en:  
`Cuenta Google → Seguridad → Verificación en 2 pasos → Contraseñas de aplicaciones`

---

## Base de datos (conexión externa con DBeaver / TablePlus)

| Campo | Valor |
|---|---|
| Host | 127.0.0.1 |
| Puerto | 3308 |
| Base de datos | basechi |
| Usuario | ChibuleoP2026 |
| Contraseña | Chibutech2026 |
