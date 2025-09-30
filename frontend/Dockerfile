# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias primero (mejor cache)
COPY frontend/package*.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar el código fuente
COPY . .

# Build de producción
RUN npm run build:prod

# Etapa 2: Servidor
FROM node:20-alpine

WORKDIR /app

# Instalar serve globalmente
RUN npm install -g serve

# Copiar solo los archivos compilados desde el builder
COPY --from=builder /app/dist/sample/browser ./dist

# Crear usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Cambiar al usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 4200

# Comando para servir la aplicación
CMD ["serve", "-s", "dist", "-l", "4200"]