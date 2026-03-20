FROM oven/bun:1-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock* ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
RUN bun install --frozen-lockfile --production

# Copy source
COPY packages/shared packages/shared
COPY apps/api apps/api

EXPOSE 4000
CMD ["bun", "run", "apps/api/src/index.ts"]
