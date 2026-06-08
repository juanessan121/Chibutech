FROM php:8.2-apache

# Extensiones PHP necesarias para Laravel + OPcache para rendimiento
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    git \
    cron \
    && docker-php-ext-install pdo_mysql zip opcache

# Configuración OPcache optimizada para producción/dev con volumen
RUN { \
    echo 'opcache.enable=1'; \
    echo 'opcache.memory_consumption=256'; \
    echo 'opcache.interned_strings_buffer=16'; \
    echo 'opcache.max_accelerated_files=10000'; \
    echo 'opcache.revalidate_freq=0'; \
    echo 'opcache.validate_timestamps=0'; \
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

COPY . /var/www/html/

RUN chown -R www-data:www-data /var/www/html

# Cron para el scheduler de Laravel — corre cada minuto, Laravel decide qué ejecutar
RUN echo "* * * * * www-data cd /var/www/html && php artisan schedule:run >> /var/log/laravel-scheduler.log 2>&1" \
    > /etc/cron.d/laravel-scheduler \
    && chmod 0644 /etc/cron.d/laravel-scheduler

# Entrypoint: inicia cron y luego Apache en foreground
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

CMD ["/usr/local/bin/docker-entrypoint.sh"]
