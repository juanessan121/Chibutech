FROM php:8.2-apache

# Extensiones PHP necesarias para Laravel + OPcache para rendimiento
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    git \
    cron \
    dos2unix \
    && docker-php-ext-install pdo_mysql zip opcache

# Configuración OPcache optimizada para producción/dev con volumen
RUN { \
    echo 'opcache.enable=1'; \
    echo 'opcache.memory_consumption=256'; \
    echo 'opcache.interned_strings_buffer=16'; \
    echo 'opcache.max_accelerated_files=10000'; \
    echo 'opcache.revalidate_freq=0'; \
    echo 'opcache.validate_timestamps=1'; \
    echo 'opcache.fast_shutdown=1'; \
    echo 'opcache.jit=1255'; \
    echo 'opcache.jit_buffer_size=64M'; \
    echo 'realpath_cache_size=4096K'; \
    echo 'realpath_cache_ttl=600'; \
} > /usr/local/etc/php/conf.d/opcache.ini

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Habilitar mod_rewrite de Apache
RUN a2enmod rewrite

# Configurar Apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!/var/www/html/public!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

WORKDIR /var/www/html

# Instalar dependencias en la imagen (vendor queda en capa de imagen)
# La imagen se usa para sembrar el named volume en docker-compose, evitando
# la lentitud de escribir ~5000 archivos en el filesystem de Windows.
COPY composer.json composer.lock ./
RUN composer install --no-interaction --no-progress --optimize-autoloader --no-scripts

COPY . /var/www/html/

RUN chown -R www-data:www-data /var/www/html

# Cron para el scheduler de Laravel — corre cada minuto, Laravel decide qué ejecutar
RUN echo "* * * * * www-data cd /var/www/html && php artisan schedule:run >> /var/log/laravel-scheduler.log 2>&1" \
    > /etc/cron.d/laravel-scheduler \
    && chmod 0644 /etc/cron.d/laravel-scheduler

# Launcher: lee el entrypoint desde el volumen (se actualiza con git pull sin rebuild)
# dos2unix previene errores de CRLF si el archivo fue editado en Windows
RUN printf '#!/bin/bash\ndos2unix /var/www/html/docker-entrypoint.sh 2>/dev/null || true\nexec bash /var/www/html/docker-entrypoint.sh\n' \
    > /usr/local/bin/launcher.sh \
    && chmod +x /usr/local/bin/launcher.sh

CMD ["/usr/local/bin/launcher.sh"]
