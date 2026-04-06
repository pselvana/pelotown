FROM node:20-alpine AS base
WORKDIR /app

# Install native build tools (required for better-sqlite3)
RUN apk add --no-cache python3 make g++

# ── deps stage: install all dependencies ──────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# ── build stage: compile SvelteKit app ────────────────────────────────────────
FROM deps AS builder
COPY . .
RUN npm run build

# ── production image ──────────────────────────────────────────────────────────
FROM base AS runner

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 appuser

WORKDIR /app

# Copy built output and production node_modules
COPY --from=builder --chown=appuser:nodejs /app/build ./build
COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /app/server.ts ./server.ts
COPY --from=builder --chown=appuser:nodejs /app/package.json ./package.json

# Compile server.ts entrypoint using tsx (already in node_modules)
# Alternatively: node --import tsx/esm server.ts at runtime
RUN ./node_modules/.bin/tsx --version && echo "tsx ok"

USER appuser

ENV NODE_ENV=production
ENV VIDEOS_PATH=/app/videos
ENV PORT=3000

EXPOSE 3000

# Video files and database persist in this volume
VOLUME ["/app/videos"]

CMD ["node", "--import", "tsx/esm", "server.ts"]
