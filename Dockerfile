FROM node:20-alpine AS base

# Create app directory
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy app source and build if needed
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Uncomment if you need to build your app (e.g., for TypeScript)
# RUN npm run build

# Production image, copy all the files and run
FROM base AS runner

# Create a non-root user and switch to it
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 appuser \
    && chown -R appuser:nodejs /app
USER appuser

# Copy only necessary files from the builder stage
COPY --from=deps --chown=appuser:nodejs /app/node_modules ./node_modules
# Uncomment if using a build step
# COPY --from=builder --chown=appuser:nodejs /app/dist ./dist 
COPY --chown=appuser:nodejs . .

# Set NODE_ENV
ENV NODE_ENV=production

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["node", "server.js"]
