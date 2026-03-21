---
description: Como fazer deploy do Expansio para Cloudflare e via Docker
---

# Deploy Workflow — Expansio

## Opção 1 — Cloudflare (produção)

### API → Cloudflare Workers

```bash
cd apps/api && bunx wrangler deploy
```

### Web → Cloudflare Pages

```bash
cd apps/web && bun run build && bunx wrangler pages deploy dist
cd /home/ostuff/expansio/apps/web && VITE_API_URL=https://expansio-api.ricardorkaminski.workers.dev bun run build && bunx wrangler pages deploy dist

```

## Opção 2 — Docker Compose (local / staging)

### Build e rodar

```bash
docker compose up --build
```

### Parar

```bash
docker compose down
```

### Rebuild forçado

```bash
docker compose build --no-cache && docker compose up
```

## Verificação pós-deploy

1. Verificar health: `curl https://<api-url>/health`
2. Verificar frontend: abrir `https://<web-url>` no browser
3. Testar filtros e mapa
4. Verificar console do browser para erros de CORS