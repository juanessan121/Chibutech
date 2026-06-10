FROM node:20-alpine

WORKDIR /app

# Instalar dependencias en la imagen (queda cacheado en el anonymous volume /app/node_modules)
COPY package*.json ./
RUN npm install

COPY . .

# Entrypoint: re-ejecuta npm install al arrancar para detectar paquetes nuevos tras git pull
RUN apk add --no-cache dos2unix
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN dos2unix /usr/local/bin/docker-entrypoint.sh && chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 5173

CMD ["/usr/local/bin/docker-entrypoint.sh"]
