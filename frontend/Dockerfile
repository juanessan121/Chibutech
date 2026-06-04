FROM node:20-alpine

WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto de Vite
EXPOSE 5173

# Comando para iniciar el servidor en modo desarrollo
CMD ["npm", "run", "dev"]
