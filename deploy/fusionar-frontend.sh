#!/bin/sh
# ─────────────────────────────────────────────────────────────────────────
# Compila el frontend y lo fusiona dentro de backend/public/, para que
# Laravel sirva la API y el frontend desde un único dominio.
#
# Úsalo cada vez que cambie el código de frontend/ y haya que actualizar
# lo que ya está listo para subir en backend/public/.
#
# Uso (con Docker corriendo):
#   docker compose run --rm --entrypoint sh frontend -c "npm run build"
#   sh deploy/fusionar-frontend.sh
#
# Uso (con Node.js local, sin Docker):
#   cd frontend && npm install && npm run build && cd ..
#   sh deploy/fusionar-frontend.sh
# ─────────────────────────────────────────────────────────────────────────
set -e
cd "$(dirname "$0")/.."

if [ ! -f frontend/dist/index.html ]; then
  echo "No se encontró frontend/dist/index.html — compila el frontend primero (npm run build)."
  exit 1
fi

rm -rf backend/public/assets
cp -r frontend/dist/assets backend/public/assets
cp frontend/dist/config.js backend/public/config.js
cp frontend/dist/favicon.svg backend/public/favicon.svg
cp frontend/dist/icons.svg backend/public/icons.svg
mkdir -p backend/public/app
cp frontend/dist/index.html backend/public/app/index.html

echo "Listo: frontend fusionado dentro de backend/public/."
echo "Recuerda hacer commit de los cambios en backend/public/ (assets/, config.js, app/index.html, etc.)."
