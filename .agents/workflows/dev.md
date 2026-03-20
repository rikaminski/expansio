---
description: Como rodar o projeto Expansio em desenvolvimento local
---

# Dev Workflow — Expansio

## Pré-requisitos

- Bun >= 1.0
- Node >= 20 (para Vite)

## Instalar dependências

// turbo
```bash
bun install
```

## Rodar API (porta 4000)

// turbo
```bash
cd apps/api && bun run dev
```

## Rodar Web (porta 3000)

// turbo
```bash
cd apps/web && bun run dev
```

## Rodar tudo junto (dev)

// turbo
```bash
bun run dev
```

> O `package.json` raiz define script `dev` que inicia API e Web em paralelo.

## Verificar saúde da API

// turbo
```bash
curl http://localhost:4000/health
```

## Lint

// turbo
```bash
bunx biome check .
```

## Formato

// turbo
```bash
bunx biome format --write .
```

## Build de produção

```bash
bun run build
```
