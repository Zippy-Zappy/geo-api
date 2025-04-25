# Imagen base de Node.js
FROM node:latest

# Establece el directorio de trabajo
WORKDIR /app

# Copia archivos base
COPY frontend/pnpm-lock.yaml frontend/package.json ./

# Instala pnpm y dependencias
RUN npm install -g pnpm && pnpm install

# Copia el resto del frontend
COPY frontend/ .

# Expone el puerto de desarrollo
EXPOSE 3000

# Ejecuta el servidor de desarrollo
CMD ["pnpm", "dev"]