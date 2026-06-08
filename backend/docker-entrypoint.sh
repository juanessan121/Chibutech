#!/bin/bash
set -e

# Iniciar el daemon de cron (necesario para el scheduler de Laravel)
service cron start

# Correr Apache en primer plano (comportamiento estándar del contenedor)
exec apache2-foreground
