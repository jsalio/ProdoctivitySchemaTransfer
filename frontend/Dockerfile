# Frontend Dockerfile: Angular -> Node.js/Express
# Build: docker build -t prodoctivity-frontend:latest --build-arg CONFIGURATION=production .
# Run:   docker run -p 8080:4200 prodoctivity-frontend:latest

# 1) Install deps
FROM node:20-alpine AS deps
WORKDIR /app

# Use only package.json so npm resolves fresh versions (ignore lockfile inside container)
COPY package.json ./
RUN apk add --no-cache ca-certificates && update-ca-certificates \
    && npm config set registry https://registry.npmjs.org/ \
    && npm config set fetch-retries 5 \
    && npm config set fetch-retry-maxtimeout 600000 \
    && npm config set prefer-online true \
    && npm install --no-audit --no-fund

# 2) Build application
FROM node:20-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Angular configuration: production by default
ARG CONFIGURATION=production
ENV NODE_ENV=production

# Build the Angular app
RUN npm run build -- --configuration=${CONFIGURATION}

# 3) Node.js/Express to serve static files
FROM node:20-alpine AS runtime
WORKDIR /app

# Copy package.json and install production dependencies
COPY --from=build /app/package.json ./
RUN npm install --only=production \
    && npm install express compression

# Copy built Angular app
COPY --from=build /app/dist/sample/ ./dist/sample/

# Add simple Express server
COPY server.js ./

EXPOSE 4200
CMD ["node", "server.js"]