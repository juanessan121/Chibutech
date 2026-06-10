#!/bin/bash
set -e

cd /var/www/html

echo ""
echo "=================================================="
echo "  Chibutech ERP — Iniciando configuracion"
echo "=================================================="

# ── 1. Crear .env si no existe (primer clone) ─────────────────────────────────
if [ ! -f .env ]; then
    cp .env.example .env
    echo "[1/7] .env creado desde .env.example"
else
    echo "[1/7] .env ya existe — OK"
fi

# ── 2. Instalar dependencias Composer si vendor/ no existe ────────────────────
if [ ! -d vendor ]; then
    echo "[2/7] Instalando dependencias PHP (primera vez, ~60 segundos)..."
    composer install --no-interaction --no-progress --optimize-autoloader
    echo "[2/7] Dependencias instaladas."
else
    echo "[2/7] vendor/ ya existe — OK"
fi

# ── 3. Generar APP_KEY si está vacío ──────────────────────────────────────────
APP_KEY_VAL=$(grep "^APP_KEY=" .env | cut -d'=' -f2)
if [ -z "$APP_KEY_VAL" ]; then
    php artisan key:generate --force
    echo "[3/7] APP_KEY generado."
else
    echo "[3/7] APP_KEY ya configurado — OK"
fi

# ── 4. Permisos de escritura en storage y cache ───────────────────────────────
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
echo "[4/7] Permisos de storage configurados."

# ── 5. Enlace simbolico para archivos publicos ────────────────────────────────
php artisan storage:link --force 2>/dev/null || true
echo "[5/7] storage:link listo."

# ── 6. Limpiar caches (importante al hacer pull con cambios de config) ────────
php artisan config:clear
php artisan cache:clear
echo "[6/7] Cache limpiado."

# ── 7. Ejecutar migraciones y seeders iniciales ───────────────────────────────
php artisan migrate --force
php artisan db:seed --force
echo "[7/7] Migraciones y datos iniciales aplicados."

echo ""
echo "=================================================="
echo "  Backend listo en http://localhost:8080"
echo "=================================================="
echo ""

# ── Iniciar cron para el scheduler de Laravel ─────────────────────────────────
service cron start

# ── Apache en foreground ──────────────────────────────────────────────────────
exec apache2-foreground
