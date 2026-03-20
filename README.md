# Expansio — Inteligência de Mercado

Plataforma de inteligência de mercado com **mapa interativo do Brasil**, análise de potencial de mercado, filtros avançados e recomendações de expansão.

## Stack

| Componente | Tecnologia |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4 |
| **Backend** | Hono.js, Bun |
| **Mapa** | Leaflet, react-leaflet v5 |
| **Linting** | Biome v2 |
| **Deploy** | Docker Compose / Cloudflare Workers + Pages |

## Estrutura

```
expansio/
├── apps/
│   ├── api/              # Backend Hono + Bun (porta 4000)
│   │   ├── src/
│   │   │   ├── data/     # Geração de dados + Brazil GeoJSON
│   │   │   ├── lib/      # Lógica de filtros
│   │   │   └── routes/   # REST endpoints
│   │   └── Dockerfile
│   └── web/              # Frontend React + Vite (porta 3000)
│       ├── src/
│       │   ├── components/  # MapView, Sidebar, StateDetail...
│       │   ├── hooks/       # useMapState, useFilteredData
│       │   └── lib/         # api, colors, format
│       └── Dockerfile
├── packages/
│   └── shared/           # Tipos e constantes compartilhados
├── docker-compose.yml
├── biome.json
└── tsconfig.json
```

## Desenvolvimento

### Pré-requisitos

- [Bun](https://bun.sh/) v1.3+
- Node.js 20+ (para compatibilidade)

### Instalação

```bash
bun install
```

### Rodar

```bash
# API (porta 4000)
cd apps/api && bun run dev

# Web (porta 3000)
cd apps/web && bun run dev

# Ambos simultaneamente
bun run dev
```

### Lint & Format

```bash
bun run lint        # Verificar
bun run lint:fix    # Corrigir
bun run format      # Formatar
```

## API Endpoints

| Endpoint | Descrição |
|---|---|
| `GET /health` | Health check |
| `GET /states` | Lista de estados com dados socioeconômicos |
| `GET /states/geojson` | GeoJSON com fronteiras dos estados |
| `GET /companies/count?sector=...&porte=...` | Contagem total e filtrada |
| `GET /companies/by-state?...` | Empresas por estado (com filtros) |
| `GET /branches` | Filiais em GeoJSON |
| `GET /competitors` | Concorrentes em GeoJSON |
| `GET /expansion?...` | Scores de similaridade para expansão |
| `GET /demand?...` | Demanda estimada por estado |

## Docker

```bash
docker compose up --build
```

- Web: http://localhost:3000
- API: http://localhost:4000

## Funcionalidades

- **Mapa coroplético** com 3 modos de visualização (Potencial, Expansão, Nenhum)
- **Filtros cascata** por Setor, Porte, Faturamento e Região
- **Camadas toggleáveis** (Filiais, Concorrentes, Demanda)
- **Clustering** de marcadores com react-leaflet-cluster
- **Painel de análise** com métricas e insights por estado
- **Score de expansão** baseado em similaridade com perfil de filiais
- **~850 empresas** geradas com distribuição ponderada por população
