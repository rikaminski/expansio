---
name: hono
description: Hono.js — framework web multi-runtime para API REST. Usado em dev (Bun) e prod (Cloudflare Workers).
---

# Hono.js — Skill

## Versão

Hono v4.x com Bun (dev local) e Cloudflare Workers (produção).

## Conceito Chave: Multi-Runtime

O **mesmo código** roda em Bun e CF Workers. A diferença está no entry point:

### Bun (dev local)

```typescript
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello Bun!'))

export default {
  port: 4000,
  fetch: app.fetch,
}
```

Script no `package.json`:
```json
{
  "scripts": {
    "dev": "bun run --hot src/index.ts"
  }
}
```

### Cloudflare Workers (prod)

```typescript
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello Workers!'))

export default app
```

## Roteamento

```typescript
// Métodos HTTP
app.get('/path', (c) => c.json({ data: 'value' }))
app.post('/path', (c) => c.json({ ok: true }))

// Parâmetros
app.get('/user/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id })
})

// Query strings
app.get('/search', (c) => {
  const q = c.req.query('q')
  return c.json({ query: q })
})
```

## Agrupamento de Rotas

```typescript
// routes/companies.ts
import { Hono } from 'hono'

const companies = new Hono()
companies.get('/count', (c) => c.json({ total: 850 }))
companies.get('/by-state', (c) => c.json({ SP: 180 }))

export default companies

// index.ts
import companies from './routes/companies'

const app = new Hono()
app.route('/companies', companies)
```

## Middleware CORS

```typescript
import { cors } from 'hono/cors'

app.use('/*', cors({
  origin: ['http://localhost:3000'],
  allowMethods: ['GET'],
}))
```

## Respostas

```typescript
// JSON
c.json({ key: 'value' })

// Texto
c.text('Hello')

// Com status
c.json({ error: 'Not found' }, 404)

// Headers customizados
c.header('X-Custom', 'value')
return c.json({ ok: true })
```

## Instalação

```bash
bun add hono
```

## Regras para este projeto

1. **Sempre use `c.json()`** para respostas — nunca `c.text()` para endpoints de dados
2. **Agrupe rotas** em arquivos separados (`routes/*.ts`) e monte com `app.route()`
3. **CORS** deve estar habilitado para o frontend em `localhost:3000`
4. **Porta 4000** para dev local
5. **Sem banco de dados** — dados gerados em runtime com seeded random
6. **GeoJSON** retornado como JSON normal (Hono serializa automaticamente)
