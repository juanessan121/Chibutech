FROM php:8.2-fpm-alpine

RUN apk add --no-cache \
    git curl libpng-dev libxml2-dev zip unzip oniguruma-dev \
    libzip-dev freetype-dev libjpeg-turbo-dev

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo_mysql mbstring exif pcntl bcmath gd xml zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock* ./
RUN composer install \
        --no-scripts \
        --no-autoloader \
        --prefer-dist \
        --no-interaction \
        --no-dev

COPY . .

# Copiar .env.example como .env base si no existe
RUN [ -f .env ] || cp .env.example .env

RUN composer dump-autoload --optimize --no-scripts \
    && mkdir -p storage/logs \
               storage/framework/cache/data \
               storage/framework/sessions \
               storage/framework/views \
               bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && chmod +x docker-entrypoint.sh artisan

EXPOSE 9000
ENTRYPOINT ["/bin/sh", "docker-entrypoint.sh"]
