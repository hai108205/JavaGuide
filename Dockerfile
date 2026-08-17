# ---------- Stage 1: dependencies (cached via layer) ----------
FROM node:22-alpine AS deps
RUN npm i -g pnpm@10.0.0
WORKDIR /app
# Lockfile first -> dependency layers reused on rebuild
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---------- Stage 2: build ----------
FROM node:22-alpine AS build
RUN npm i -g pnpm@10.0.0
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# dev-tools like sass-embedded need cache dir; reuse pnpm store unsafe-perm ok
RUN pnpm docs:build

# ---------- Stage 3: serve static ----------
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime
COPY --from=build /app/docs/.vuepress/dist /usr/share/nginx/html
EXPOSE 8080