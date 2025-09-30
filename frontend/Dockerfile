FROM node:20-alpine

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps && npm install -g serve

COPY frontend/ .
RUN npm run build

# Limpiar dependencias de desarrollo después del build
RUN rm -rf node_modules && \
    npm install --production --legacy-peer-deps && \
    npm cache clean --force

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 4200

CMD ["serve", "-s", "dist/sample/browser", "-l", "4200"]