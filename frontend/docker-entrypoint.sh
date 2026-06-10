#!/bin/sh
set -e

cd /app

# Instala paquetes nuevos si package.json cambio, o en el primer arranque.
# Con node_modules ya existente solo tarda ~3 segundos.
echo "[1/2] Verificando dependencias npm..."
npm install --prefer-offline 2>/dev/null || npm install
echo "[2/2] Iniciando servidor Vite..."

exec npm run dev
