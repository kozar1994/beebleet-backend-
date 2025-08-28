# Dockerfile for a NestJS Prisma application

# ---- Base ----
FROM node:20-slim AS base
WORKDIR /usr/src/app
RUN npm install -g pnpm

# ---- Builder ----
FROM base AS builder
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run prisma:generate
RUN pnpm run build

# ---- Runner ----
FROM base AS runner
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile
COPY --from=builder /usr/src/app/dist ./dist
# Copy prisma folder to run migrations in production
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/main"]
