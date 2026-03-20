FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json bun.lock* ./
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
RUN bun install --frozen-lockfile

# Copy source and build
COPY packages/shared packages/shared
COPY apps/web apps/web
RUN cd apps/web && bun run build

# Serve with Bun
FROM oven/bun:1-alpine
WORKDIR /app
COPY --from=builder /app/apps/web/dist ./dist

EXPOSE 3000
CMD ["bun", "-e", "Bun.serve({ port: 3000, fetch(req) { const url = new URL(req.url); let path = url.pathname === '/' ? '/index.html' : url.pathname; const file = Bun.file('./dist' + path); return file.exists().then(e => e ? new Response(file) : new Response(Bun.file('./dist/index.html'))); } })"]
