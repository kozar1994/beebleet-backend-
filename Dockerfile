# Dockerfile for a NestJS Prisma application

# ---- Base ----
FROM node:20-slim AS base
# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl
WORKDIR /usr/src/app
RUN npm install -g pnpm

# ---- Builder ----
FROM base AS builder
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run prisma:generate
# Build the main application and the seed script based on tsconfig.json
RUN pnpm exec tsc -p tsconfig.json

# ---- Runner ----
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
# Copy tsconfig.json so tsconfig-paths can find it
COPY tsconfig.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
# Copy prisma folder to run migrations in production
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/main"]
