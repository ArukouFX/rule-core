# Usamos una imagen ligera de Node.js
FROM node:20-alpine

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo los archivos de dependencias primero (optimiza el cache)
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código (src, data, tsconfig.json)
COPY . .

# Compilamos TypeScript a JavaScript (opcional para ejecución con tsx)
# Pero para producción, usualmente corremos el código compilado.
# Por ahora usaremos tsx para mantener tu flujo actual.
RUN npm install -g tsx

# Comando para ejecutar el motor cuando el contenedor inicie
CMD ["npx", "tsx", "src/index.ts"]