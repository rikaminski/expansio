---
name: biome
description: Biome v2 — linter e formatter ultra-rápido. Substitui ESLint + Prettier em um único tool.
---

# Biome v2 — Skill

## Versão

Biome **v2.4.x** — A API mudou significativamente do v1.

> [!CAUTION]
> **Biome v2 quebrando mudanças vs v1:**
> - `organizeImports` foi removido (agora é automático)
> - `files.ignore` foi removido — usar `files.includes` com padrões explícitos
> - O schema é `https://biomejs.dev/schemas/2.x.x/schema.json`

## Instalação

```bash
bun add -D -E @biomejs/biome
```

> A flag `-E` fixa a versão exata (importante para reprodutibilidade).

## Configuração (`biome.json`)

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.8/schema.json",
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab",
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded"
    }
  },
  "files": {
    "includes": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.css"]
  }
}
```

## Comandos

### Verificar (lint + formato)

```bash
bunx --bun biome check .
```

### Corrigir automaticamente

```bash
bunx --bun biome check --write .
```

### Apenas formatar

```bash
bunx --bun biome format --write .
```

### Apenas lint

```bash
bunx --bun biome lint .
```

## Scripts no `package.json` raiz

```json
{
  "scripts": {
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write ."
  }
}
```

## Regras para este projeto

1. **Uma config na raiz** (`biome.json`) que vale para todo o monorepo (apps/ + packages/)
2. **Indent com tab** — padrão do Biome, mais acessível
3. **Single quotes** + **sem semicolons** (estilo moderno)
4. **`files.includes`** com globs explícitos (não usar `ignore` que não existe no v2)
5. **Rodar `biome check`** antes de cada commit para garantir qualidade
6. **Não usar ESLint nem Prettier** — Biome substitui ambos
