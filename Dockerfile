# Next.js 16 standalone build for Railway.
# (No BuildKit cache mounts — Railway's Metal builder rejects them.)
ARG NODE_VERSION=24-slim

# ---- deps: install all deps (dev deps needed for `next build`) ----
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# ---- builder: compile the app (output: "standalone") ----
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

# ---- runner: minimal standalone server ----
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000
# standalone server.js honours $PORT + $HOSTNAME (Railway injects PORT).
CMD ["node", "server.js"]
