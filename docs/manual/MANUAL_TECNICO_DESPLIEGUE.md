# Manual Técnico — Despliegue en Servidor
## Chibutech ERP — Guía general (cualquier proveedor de hosting)

> Esta guía explica cómo llevar el sistema a un servidor de producción **sin asumir un proveedor específico**. Los conceptos son los mismos sin importar si el hosting usa cPanel, Plesk, DirectAdmin, un VPS con Apache/Nginx a mano, o un contenedor Docker en la nube — solo cambian los nombres de los botones. La sección 8 da el detalle concreto para cada variante.
>
> Para entender el código y la arquitectura, ver [`MANUAL_TECNICO_DESARROLLO.md`](MANUAL_TECNICO_DESARROLLO.md). Para el manual de uso del sistema, ver [`MANUAL_USUARIO.md`](MANUAL_USUARIO.md).

---

## Índice

1. [Idea general del despliegue](#1-idea-general-del-despliegue)
2. [Requisitos del servidor](#2-requisitos-del-servidor)
3. [Preparar el paquete que se sube](#3-preparar-el-paquete-que-se-sube)
4. [La base de datos: crearla e importarla](#4-la-base-de-datos-crearla-e-importarla)
5. [Subir los archivos al servidor](#5-subir-los-archivos-al-servidor)
6. [Apuntar el dominio al lugar correcto](#6-apuntar-el-dominio-al-lugar-correcto)
7. [Configurar la aplicación (instalador web)](#7-configurar-la-aplicación-instalador-web)
8. [Variantes según el tipo de servidor](#8-variantes-según-el-tipo-de-servidor)
9. [HTTPS](#9-https)
10. [Mantenimiento y actualizaciones](#10-mantenimiento-y-actualizaciones)
11. [Checklist de errores comunes](#11-checklist-de-errores-comunes)

---

## 1. Idea general del despliegue

El sistema se compone de **una sola aplicación Laravel** que sirve dos cosas desde el mismo dominio:

- `/api/*` → la API (JSON) que usa el frontend
- Cualquier otra ruta → el frontend (React) ya compilado, guardado dentro de `backend/public/app/index.html`

Esto significa que **desplegar Chibutech es desplegar una aplicación Laravel normal**, con la particularidad de que el frontend ya viene empaquetado adentro — no hay un segundo sitio ni un segundo dominio que configurar. Cualquier guía general de "cómo desplegar Laravel en [tu proveedor]" aplica aquí casi sin cambios; la única condición especial es que el **Document Root** del sitio debe apuntar a la carpeta `backend/public/`, nunca a la raíz de `backend/`.

**Cero requisitos de Node.js, npm, o Docker en el servidor de producción.** Esas herramientas solo se usan en la computadora donde se prepara el paquete (sección 3).

---

## 2. Requisitos del servidor

| Requisito | Detalle |
|---|---|
| PHP | **8.2** o superior, con las extensiones: `mbstring`, `pdo_mysql`, `openssl`, `bcmath`, `ctype`, `fileinfo`, `curl`, `xml`, `tokenizer`, `json` |
| Base de datos | MySQL 8+ o MariaDB 10.6+ |
| Servidor web | Apache (con `mod_rewrite`) o Nginx (con PHP-FPM) — ver configuración exacta en la sección 8 |
| Certificado SSL | Recomendado (Let's Encrypt gratuito, o el que ofrezca el proveedor) |
| Acceso para subir archivos | Panel de archivos web, FTP/SFTP, o `git`/`scp` si hay Terminal |
| Herramienta para importar SQL | phpMyAdmin, Adminer, o acceso a la consola `mysql` |

**No hace falta:** Composer, Node.js/npm, ni Docker instalados en el servidor de producción — el paquete que se sube ya viene con todo resuelto (ver sección 3).

---

## 3. Preparar el paquete que se sube

Esto se hace **en la computadora de quien programa** (no en el servidor), una sola vez por cada actualización que se vaya a desplegar.

### 3.1 Generar `backend/vendor/` (dependencias de PHP)

Con Composer instalado localmente:
```bash
cd backend
composer install --no-dev --optimize-autoloader
```
Con Docker (sin Composer instalado en la máquina):
```bash
docker compose up -d backend
docker cp chibutech_backend:/var/www/html/vendor ./backend/vendor
```
> Verifica que `backend/vendor/autoload.php` quede directamente ahí (no en `backend/vendor/vendor/autoload.php` — un error común de `docker cp` si la carpeta destino ya existía antes de copiar).

### 3.2 Compilar el frontend y fusionarlo dentro del backend

Con Node.js instalado localmente:
```bash
cd frontend && npm install && npm run build && cd ..
sh deploy/fusionar-frontend.sh
```
Con Docker:
```bash
docker compose run --rm --entrypoint sh frontend -c "npm run build"
sh deploy/fusionar-frontend.sh
```
Esto deja `backend/public/app/index.html`, `backend/public/assets/`, `backend/public/config.js` listos, sin tocar los archivos propios de Laravel.

### 3.3 Resultado final

Después de 3.1 y 3.2, la carpeta `backend/` está **completa y autocontenida** — es lo único que hay que subir al servidor. Todo lo demás del repositorio (`frontend/` código fuente, `docs/`, `database/`, `docker-compose.yml`) se queda en la computadora de desarrollo, no tiene nada que hacer en el servidor.

---

## 4. La base de datos: crearla e importarla

Sin importar el proveedor, el proceso siempre son 3 pasos:

### 4.1 Crear una base de datos vacía y un usuario con permisos sobre ella

Cada panel le llama distinto a esta pantalla, pero el concepto es igual: crear una base de datos, crear un usuario, y asignarle **todos los privilegios** sobre esa base de datos específica (no privilegios globales de servidor).

| Panel | Dónde se hace |
|---|---|
| cPanel | "MySQL® Databases" |
| Plesk | "Bases de datos" → "Añadir base de datos" |
| DirectAdmin | "MySQL Management" |
| VPS con acceso root | `mysql -u root -p` y `CREATE DATABASE`, `CREATE USER`, `GRANT ALL PRIVILEGES ...` a mano |

Anota los 3 datos reales: nombre de la base de datos, usuario, contraseña. En hosting compartido con panel, casi siempre el nombre final lleva un prefijo (ej. `tuusuario_basechi`) — usa siempre el nombre completo tal como lo muestra el panel.

### 4.2 Importar la estructura y los datos

El proyecto trae un archivo listo para esto: **`database/01_chibutech_hosting_compartido.sql`**. A diferencia de `01_chibutech_completo.sql` (que se usa solo en Docker, donde el usuario de MySQL es `root`), este archivo:
- No incluye `CREATE DATABASE`/`USE` (en hosting compartido no se permite crear bases de datos por SQL).
- No incluye `DEFINER=root@localhost` en los triggers de auditoría (el usuario de hosting no es `root`, no tiene privilegio `SUPER`).
- No incluye `NO_AUTO_CREATE_USER` en el `sql_mode` de los triggers (opción eliminada en MySQL 8+).

Impórtalo con la herramienta que tenga tu proveedor (phpMyAdmin, Adminer) seleccionando primero la base de datos creada en 4.1, o por consola:
```bash
mysql -u tuusuario_dbuser -p tuusuario_basechi < database/01_chibutech_hosting_compartido.sql
```

### 4.3 Verificar

Debe haber ~18 tablas, incluyendo `Persona`, `Terreno`, `Usuario_Sistema`, `usuarios`, `Auditoria`, y la tabla `migrations` con ~15 filas.

---

## 5. Subir los archivos al servidor

Sube la carpeta `backend/` (ya completa según la sección 3) a una ubicación **fuera** de la carpeta pública del servidor (fuera de `public_html`, `htdocs`, `www`, o como se llame en tu proveedor). Esto evita que el código PHP quede accesible directamente desde el navegador — solo su subcarpeta `public/` debe ser accesible al público (ver sección 6).

Formas de subir, de más a menos común:
- Panel de administración de archivos (subir `.zip`, luego extraerlo ahí mismo).
- FTP/SFTP con un cliente como FileZilla.
- `scp`/`rsync` si hay acceso SSH.
- `git clone`/`git pull` directo en el servidor si hay Terminal con git instalado.

---

## 6. Apuntar el dominio al lugar correcto

Este es el paso más importante y donde más se falla: el **Document Root** (la carpeta que el servidor web realmente expone al público) debe apuntar exactamente a:
```
<donde subiste todo>/backend/public
```
**Nunca** a `backend/` a secas, ni a una carpeta contenedora superior. Dentro de `backend/public/` debe estar `index.php` directamente en el primer nivel.

| Panel/entorno | Dónde se configura |
|---|---|
| cPanel | "Domains" o "Subdomains" → campo "Document Root" |
| Plesk | "Hosting & DNS" → "Document root" |
| DirectAdmin | "Domain Setup" |
| VPS con Apache | Directiva `DocumentRoot` en el VirtualHost (ver 8.2) |
| VPS con Nginx | Directiva `root` en el bloque `server` (ver 8.3) |

---

## 7. Configurar la aplicación (instalador web)

El proyecto incluye `backend/public/instalar.php`, un instalador de un solo uso que evita tener que crear el archivo `.env` y generar la clave de la aplicación a mano.

1. Da permisos de escritura a `backend/storage/` y `backend/bootstrap/cache/` (755, o 775 si el proveedor lo exige).
2. Visita en el navegador (con tu dominio real):
   ```
   https://tu-dominio.com/instalar.php?token=41e63afb15c07232c2b7353d587d8955
   ```
3. Llena el formulario con los datos de la base de datos (sección 4.1) y tu dominio.
4. Al enviarlo, automáticamente:
   - Crea/actualiza `backend/.env` con esos datos (`APP_URL` y `FRONTEND_URL` quedan iguales, ya que comparten dominio).
   - Genera una clave de aplicación (`APP_KEY`) nueva.
   - Corre las migraciones que falten (no duplica lo ya importado en el paso 4.2 — Laravel reconoce por la tabla `migrations` cuáles ya están aplicadas).
   - Crea el enlace de almacenamiento (`storage:link`).
5. **Borra `instalar.php` del servidor** apenas veas "✅ ¡Listo!" — ya cumplió su función.

> El token de ejemplo de arriba es el que trae el archivo tal como está en el repositorio. Para cambiarlo, edita la constante `TOKEN` al inicio de `backend/public/instalar.php` antes de subirlo.

Si prefieres hacerlo a mano (por ejemplo, si tienes Terminal y prefieres el flujo clásico de Laravel):
```bash
cp backend/.env.example backend/.env
# editar backend/.env con los datos reales de DB_*, APP_URL, FRONTEND_URL
php artisan key:generate --force
php artisan migrate --force
php artisan storage:link
```

---

## 8. Variantes según el tipo de servidor

### 8.1 Hosting compartido con panel de control (cPanel, Plesk, DirectAdmin)

Es el caso cubierto en las secciones 1 a 7 tal cual. La única diferencia entre paneles es dónde hacen clic para crear la base de datos (4.1) y el Document Root (6) — el resto (subir archivos, importar SQL, correr el instalador) es idéntico.

### 8.2 VPS con acceso root — Apache

Instala PHP 8.2, Apache, y MySQL/MariaDB manualmente (`apt install apache2 php8.2 php8.2-mysql mariadb-server ...` en Ubuntu/Debian). Configura un VirtualHost:

```apache
<VirtualHost *:80>
    ServerName tu-dominio.com
    DocumentRoot /var/www/chibutech/backend/public

    <Directory /var/www/chibutech/backend/public>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/chibutech-error.log
    CustomLog ${APACHE_LOG_DIR}/chibutech-access.log combined
</VirtualHost>
```
`AllowOverride All` es importante: sin esto, el `.htaccess` que ya trae `backend/public/` (necesario para las rutas de Laravel) se ignora y todo da 404.

### 8.3 VPS con acceso root — Nginx

Nginx no usa `.htaccess` — la configuración equivalente va directo en el bloque `server`:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/chibutech/backend/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### 8.4 VPS con Docker

Si el servidor permite Docker, se puede reutilizar el mismo `docker-compose.yml` del desarrollo local, con estos cambios:
1. Cambia las contraseñas por defecto (`Chibutech2026`, `root_super_secreto`) — las del repositorio son solo para desarrollo.
2. En `backend/.env`, ajusta `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL` y `FRONTEND_URL` con el dominio real.
3. **No expongas el puerto de la base de datos (3308) a internet** — quita esa línea de `ports:` en el servicio `db` si el servidor tiene IP pública.
4. Coloca un proxy inverso (Nginx o Traefik) delante para servir HTTPS real con Let's Encrypt/Certbot.
5. `docker compose up -d --build`. La base de datos se crea importando lo que haya en `./database/` — en este caso **sí** se puede usar `01_chibutech_completo.sql` (el contenedor de MariaDB corre como root, sin las restricciones del hosting compartido).
6. Backups: `docker compose exec db mysqldump -u root -p basechi > backup.sql`, programado en un `cron` del sistema.

En este caso el frontend puede seguir sirviéndose como contenedor Docker separado (como en desarrollo) en vez de fusionado dentro de `backend/public/` — es una decisión de arquitectura válida si ya se tiene experiencia administrando Docker en producción, aunque implica volver a configurar CORS y un segundo dominio/subdominio.

### 8.5 Plataformas cloud (Render, Railway, DigitalOcean App Platform, etc.)

El concepto general aplica igual: la plataforma necesita saber que el punto de entrada del sitio es `backend/public/`, y necesita una base de datos MySQL/MariaDB gestionada aparte (la mayoría de estas plataformas ofrecen una como add-on). Sigue la documentación específica de la plataforma para "desplegar una aplicación Laravel" — el paquete que prepara este proyecto (sección 3) es compatible con cualquiera de ellas.

---

## 9. HTTPS

Sin importar el proveedor, activa un certificado SSL para el dominio (Let's Encrypt es gratuito en la inmensa mayoría de paneles y VPS vía Certbot). Verifica que el sitio cargue con `https://` sin advertencias antes de dar por terminado el despliegue — muchos navegadores bloquean funcionalidades (como el acceso a la cámara/GPS, usado en la captura de coordenadas del catastro) en sitios sin HTTPS.

---

## 10. Mantenimiento y actualizaciones

- **Cambios en el backend:** sube los archivos modificados. Si hubo dependencias nuevas de Composer, repite el paso 3.1 y sube `vendor/` actualizado. Corre `php artisan config:clear` tras cualquier cambio a `.env` o configuración.
- **Cambios en el frontend:** repite el paso 3.2 completo (compilar + `fusionar-frontend.sh`) y sube la carpeta `backend/public/` actualizada.
- **Cambios en la base de datos:** aplica los cambios puntuales (no reimportes el SQL completo, perderías los datos de producción). Si agregaste una migración nueva, súbela y corre `php artisan migrate --force` (por Terminal, o volviendo a visitar una versión reciente de `instalar.php` si aún la conservas para ese propósito — aunque lo normal es borrarla tras el primer uso, ver sección 7).
- **Backups:** programa una exportación periódica de la base de datos (semanal como mínimo) desde el panel del proveedor o por `mysqldump` vía cron.

---

## 11. Checklist de errores comunes

| Síntoma | Causa más probable | Solución |
|---|---|---|
| "Acceso denegado" al importar el SQL | Usaste `01_chibutech_completo.sql` en vez de la versión para hosting compartido | Usa `database/01_chibutech_hosting_compartido.sql` (sección 4.2) |
| Error de importación menciona "SUPER privilege" o `NO_AUTO_CREATE_USER` | Igual que arriba — el archivo correcto ya no tiene ninguno de los dos problemas | Confirma que usaste el archivo correcto y su versión más reciente |
| 403 Forbidden en todo el sitio | El Document Root apunta a `backend/` en vez de `backend/public/` | Corrige el Document Root (sección 6) |
| La raíz del sitio no muestra el login, sino un error o la instalación por defecto de Laravel | Falta `backend/public/app/index.html` — no se hizo el paso 3.2, o no se subió esa carpeta | Repite el paso 3.2 y sube `backend/public/` completa |
| Una ruta interna del frontend (`/dashboard/...`) da 404 al recargar | Falta el `Route::fallback()` en `backend/routes/web.php` (versión desactualizada del proyecto) | Sube la versión más reciente del repositorio |
| Error de conexión a la base de datos (`SQLSTATE[HY000] [1045]`) | Datos de conexión incorrectos en `.env`, o el usuario no tiene privilegios sobre esa base | Verifica `DB_DATABASE`/`DB_USERNAME`/`DB_PASSWORD` contra lo anotado en el paso 4.1 |
| Pantalla en blanco tras el login | Poco común en el flujo actual (mismo dominio); revisa la consola del navegador (F12) por errores de JavaScript o archivos `.js`/`.css` en 404 | Confirma que `backend/public/assets/` se subió completo |
| `instalar.php` dice "Falta vendor/" | No se subió `backend/vendor/`, o quedó anidada (`vendor/vendor/`) | Repite el paso 3.1 con cuidado, verificando que `autoload.php` quede en el primer nivel |
| `instalar.php` dice que ya se instaló y no deja continuar | Existe `backend/storage/instalado.lock` de un intento anterior | Bórralo desde el panel de archivos si de verdad necesitas repetir la instalación |
| Permisos denegados al escribir `.env` o logs | `backend/storage/` o `backend/bootstrap/cache/` sin permiso de escritura | Ajusta permisos a 755/775 (sección 7, paso 1) |

---

*Manual generado a partir del código fuente del sistema Chibutech. Última actualización: julio 2026.*
