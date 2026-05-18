#!/bin/sh
set -e

echo "⏳ Esperando MariaDB en ${DB_HOST}:${DB_PORT:-3306}..."
until php -r "new PDO('mysql:host=${DB_HOST};port=${DB_PORT:-3306};dbname=${DB_DATABASE}', '${DB_USERNAME}', '${DB_PASSWORD}');" 2>/dev/null; do
    sleep 2
done
echo "✅ MariaDB lista"

composer dump-autoload --optimize 2>/dev/null || true

if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:" ]; then
    echo "🔑 Generando APP_KEY..."
    php artisan key:generate --force
fi

echo "🗄️  Ejecutando migraciones..."
php artisan migrate --force 2>&1 || true

USER_COUNT=$(php -r "
    \$pdo = new PDO('mysql:host=${DB_HOST};dbname=${DB_DATABASE}', '${DB_USERNAME}', '${DB_PASSWORD}');
    echo \$pdo->query('SELECT COUNT(*) FROM usuario_sistema')->fetchColumn();
" 2>/dev/null || echo "0")

if [ "$USER_COUNT" = "0" ]; then
    echo "🌱 Cargando catálogos, RBAC y admin..."
    php artisan db:seed --force 2>&1 || true

    echo "📚 Cargando 2510 títulos CINE..."
    php artisan db:seed --class=CarrerasCineSeeder --force 2>&1 || true
fi

php artisan config:cache
php artisan route:cache

echo "🚀 Iniciando PHP-FPM..."
exec php-fpm
