FROM php:8.2-apache

# Instalación de extensiones de PHP necesarias para Laravel/Chibutech
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    git \
    && docker-php-ext-install pdo_mysql zip

# Habilitar mod_rewrite de Apache
RUN a2enmod rewrite

# Copiar configuración de virtualhost si existiera, o configurar ServerName
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Directorio de trabajo
WORKDIR /var/www/html

# Copiar archivos del backend
COPY . /var/www/html/

# Permisos
RUN chown -R www-data:www-data /var/www/html
