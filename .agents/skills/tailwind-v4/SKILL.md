---
name: tailwind-v4
description: Tailwind CSS v4 — CSS-first configuration, sem tailwind.config.js. Usado com Vite plugin.
---

# Tailwind CSS v4 — Skill

## Diferenças Críticas do v3

> [!CAUTION]
> Tailwind v4 **NÃO usa** `tailwind.config.js`. Toda configuração é feita em CSS com `@theme`.
> **NÃO use** `@tailwind base/components/utilities`. Use `@import "tailwindcss"`.

## Instalação com Vite

```bash
bun add tailwindcss @tailwindcss/vite
```

### `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### `index.css`

```css
@import "tailwindcss";

@theme {
  /* Fontes */
  --font-sans: "Inter", sans-serif;
  --font-display: "Space Grotesk", sans-serif;

  /* Cores customizadas */
  --color-primary: #111827;
  --color-accent: #2563eb;
  --color-danger: #dc2626;
  --color-warning: #d97706;
  --color-purple: #7c3aed;

  /* Superfícies */
  --color-surface-50: #f8fafc;
  --color-surface-100: #f1f5f9;
  --color-surface-200: #e2e8f0;
}
```

## CSS-first Configuration

Tudo que antes ia no `tailwind.config.js` agora vai no CSS:

### Cores

```css
@theme {
  --color-brand-500: oklch(0.84 0.18 117.33);
  --color-brand-600: oklch(0.53 0.12 118.34);
}
```

Uso: `bg-brand-500`, `text-brand-600`

### Fontes

```css
@theme {
  --font-display: "Space Grotesk", sans-serif;
}
```

Uso: `font-display`

### Breakpoints

```css
@theme {
  --breakpoint-3xl: 1920px;
}
```

### Animações customizadas

```css
@theme {
  --animate-fade-in: fade-in 0.3s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## Content Detection

Tailwind v4 detecta automaticamente os arquivos de template. **Não é necessário configurar `content`**. Ele usa `.gitignore` para excluir pastas.

Para incluir fontes externas:
```css
@source "../node_modules/@my-company/ui-lib";
```

## Utilidades v4 Comuns

```
/* Valores dinâmicos */
w-[350px]     /* largura arbitrária */
p-[14px]      /* padding arbitrário */
text-[15px]   /* font-size arbitrário */

/* Container queries */
@container    /* container variant */

/* color-mix (opacidade de qualquer cor) */
bg-blue-500/50  /* azul com 50% opacidade */
```

## Regras para este projeto

1. **Plugin Vite** (`@tailwindcss/vite`), NÃO PostCSS
2. **Sem `tailwind.config.js`** — tudo no CSS com `@theme`
3. **Sem `@tailwind` directives** — apenas `@import "tailwindcss"`
4. **Fontes**: Inter (body) + Space Grotesk (headlines) via Google Fonts link no HTML
5. **CSS customizado** para componentes Leaflet (`.leaflet-container`, clusters) — Tailwind não controla esses
6. **Design system** definido em `index.css` com `@theme`
