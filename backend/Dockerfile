FROM oven/bun:1.2 as base

WORKDIR /app

# Copy root manifests
COPY backend/package.json backend/bun.lock backend/bunfig.toml backend/tsconfig.json ./

# Copy all packages (including source code) to ensure local dependencies are available
COPY backend/packages/ packages/

# Debug: List copied files to verify
RUN ls -la . && find packages -name package.json

# Install dependencies
RUN bun install --no-cache

# Copy any remaining files (if needed)
COPY . .

ENV NODE_ENV=production

EXPOSE 3000

# CMD ["bun", "run", "packages/server/index.ts"]
# CMD ["bun", "packages/server/index.ts"]
# CMD [ "ls" ]
CMD ["bun", "backend/packages/server/index.ts"]