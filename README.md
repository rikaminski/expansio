# Plataforma de Inteligência de Mercado

Ferramenta de inteligência de mercado para planejamento de expansão no varejo. Filtre empresas por segmento, visualize potencial de mercado geograficamente, identifique oportunidades de expansão por análise de similaridade e analise o cenário competitivo — tudo em um mapa interativo do Brasil.

**Demo**: https://expansio.pages.dev

## Início Rápido

```bash
git clone https://github.com/rikaminski/expansio.git
cd expansio
docker compose up --build
open http://localhost:3003
```

## Arquitetura

Monorepo com três pacotes:

```
├── apps/web          React 19 + Vite + Leaflet (Cloudflare Pages)
├── apps/api          API REST com Hono.js (Cloudflare Workers)
├── packages/shared   Tipos TypeScript compartilhados
├── docker-compose.yml
├── biome.json
└── .env.example
```

**Frontend**: React 19, TypeScript, Tailwind CSS v4, Leaflet com react-leaflet para o mapa interativo, react-leaflet-cluster para agrupamento de marcadores. Design system com paleta customizada, tipografia Inter + Space Grotesk, e micro-animações. Deploy via Cloudflare Pages.

**Backend**: Hono.js rodando em Bun (dev local) e Cloudflare Workers (produção). Serve dados de empresas, filiais, concorrentes, scores de expansão e estimativas de demanda via endpoints REST. CORS wildcard para API pública somente leitura.

**Shared**: Interfaces TypeScript para tipos de domínio (FilterState, Sector, Porte, Region, RevenueRange) consumidos por ambos frontend e backend.

## Camadas de Dados

A plataforma possui duas categorias de visualização no mapa:

### Modos de visualização (segmented control — um por vez)

| Camada | Descrição |
|---|---|
| **Potencial de Mercado** | Heatmap colorindo estados pela densidade de empresas que correspondem aos filtros ativos. Verde = alta concentração, vermelho = baixa. Alimentado pelo banco de dados de empresas da plataforma. |
| **Oportunidades de Expansão** | Análise de similaridade inspirada na metodologia Cortex Geofusion. Analisa o perfil das lojas existentes (PIB, população, densidade de empresas) e destaca estados sem presença que compartilham perfil similar. Intensidade âmbar = score de similaridade. |

### Marcadores (checkboxes — sobreponíveis)

| Camada | Descrição |
|---|---|
| **Filiais** | Marcadores azuis com as lojas próprias. 24 localizações mockadas com agrupamento em cluster. Clique para ver nome, cidade e data de abertura. |
| **Concorrência** | Marcadores vermelhos com concorrentes conhecidos. 39 localizações de grandes redes varejistas com cluster. Clique para ver nome e cidade. |
| **Demanda Estimada** | Bolhas proporcionais roxas centralizadas em cada estado. Tamanho representa oportunidade de receita (quantidade de empresas × ponto médio de faturamento). Reativo aos filtros. |

## Busca e Filtros

**Barra de busca** no topo do sidebar com autocomplete por nome ou sigla do estado. Navegação por setas (↑↓), seleção com Enter, e zoom automático no estado selecionado.

**Filtro por período**: toggle segmentado "Últimos 12 meses" / "Histórico completo". Filtra empresas pela data de fundação (`foundedAt`), afetando o heatmap, demanda e contadores.

**Filtros de segmento** que restringem o universo de empresas em tempo real:

- **Setor**: Varejo, Tecnologia, Saúde, Indústria, Serviços, Educação
- **Porte**: Faixas de funcionários (1-10 até 500+)
- **Faturamento**: Faixas de receita (R$ 0-100k até R$ 50M+)
- **Região**: Norte, Nordeste, Centro-Oeste, Sudeste, Sul

O `CounterBar` mostra o afunilamento: `873 → 80 empresas`. O mapa, scores de expansão e bolhas de demanda reagem às mudanças de filtro com debounce de 200ms.

## Painel de Detalhes do Estado

Clique em qualquer estado no mapa para abrir um card flutuante minimizável com métricas contextuais:

- **Sempre visível**: população, PIB per capita, contagem de empresas filtradas, share percentual do total
- **Com Expansão ativa**: score de similaridade com barra de progresso
- **Gráfico comparativo**: mini bar chart horizontal com contagem de empresas por região (SE, S, NE, CO, N), região do estado selecionado destacada
- **Insights automáticos**: análise qualitativa baseada nos dados do estado (alto PIB, mercado saturado, etc.)
- **Minimizável**: colapsa para uma barra compacta com nome do estado + contagem de empresas

## Zoom Inteligente

- **Clique no estado**: `fitBounds()` ajusta o zoom à fronteira do estado
- **Clique no marker**: `flyTo()` com zoom 17 (nível de rua) em 0.8s
- **Tiles dinâmicos**: CartoDB Light (sem labels) para visão geral, OpenStreetMap para zoom de rua — troca automática no zoom 10
- **Coordenação**: clicar em marker de outro estado atualiza o card sem sobrescrever o zoom do marker
## Mobile

Layout responsivo com adaptações específicas para telas pequenas:

- **Bottom sheet** expansível sobre o mapa fullscreen — substitui o sidebar lateral
- **Filtros nativos** via `<select>` com toggle de seleção (ao invés de dropdowns customizados)
- **Filter chips** com botão "Limpar" para gerenciar filtros ativos
- **Marcadores e análise** em layout horizontal compacto
- **Card de estado** posicionado no rodapé com espaço otimizado
- **Mapa fullscreen** como experiência principal

## Decisões Técnicas

**Hono ao invés de Express**: Hono roda em Bun (dev local) e Cloudflare Workers (produção) sem alteração de código. Entry point único com guard `typeof Bun` para o servidor local. Resposta média < 5ms no Worker.

**Leaflet ao invés de MapLibre/Deck.gl**: Leaflet é a escolha mais pragmática para choropleth + marcadores. react-leaflet oferece bindings declarativos para React 19. react-leaflet-cluster agrupa marcadores automaticamente em zoom alto.

**Tailwind CSS v4 (CSS-first)**: Configuração zero — sem `tailwind.config.js`. Design tokens definidos com `@theme` diretamente no CSS. Paleta customizada com variáveis semânticas (surface, accent, danger).

**Filtros server-side**: Filtragem de empresas acontece via query parameters na API, espelhando comportamento real onde o banco de dados filtra. Evita enviar o dataset completo ao cliente.

**Expansão como análise de similaridade**: Ao invés de simplesmente marcar "estados sem lojas", calcula scores de similaridade baseados em PIB, população e densidade de empresas. Inspirado na metodologia Cortex Geofusion.

**Dados mockados com distribuição realista**: 873 empresas distribuídas entre 27 estados ponderadas por população. 24 filiais no corredor Sudeste/Sul. 39 concorrentes de grandes redes. Faixas de receita correlacionadas com porte. Cada empresa possui `foundedAt` (2020-2024) para suportar filtro por período.

**GeoJSON como import estático**: O arquivo de fronteiras dos estados é importado como módulo JSON no build, bundlado pelo esbuild. Funciona tanto em Bun (dev) quanto em Workers (produção) sem acesso a filesystem.

## Endpoints da API

| Endpoint | Descrição |
|---|---|
| `GET /health` | Health check |
| `GET /states/geojson` | GeoJSON dos estados com fronteiras e dados demográficos |
| `GET /states` | Lista de propriedades dos estados |
| `GET /companies/count?sector=...&porte=...` | Contagem total + filtrada |
| `GET /companies/by-state?sector=...` | Contagem por estado (heatmap) |
| `GET /branches` | Filiais como GeoJSON points |
| `GET /competitors` | Concorrentes como GeoJSON points |
| `GET /expansion?sector=...` | Scores de similaridade por estado |
| `GET /demand?sector=...` | Demanda estimada por estado |

## Desenvolvimento Local

```bash
# Instalar dependências
bun install

# Copiar variáveis de ambiente
cp .env.example .env

# Iniciar API e Web em paralelo
cd apps/api && bun run dev    # http://localhost:4000
cd apps/web && bun run dev    # http://localhost:3000

# Lint
bunx biome check .
bunx biome check --write .
```

### Via Docker Compose

```bash
docker compose up --build     # API :4003, Web :3003
docker compose up --watch     # Hot reload com sync de arquivos
docker compose down
```

## Deploy

API e Web deployam independentemente para Cloudflare:

```bash
# API → Cloudflare Workers
cd apps/api && npx wrangler deploy

# Web → Cloudflare Pages
cd apps/web && VITE_API_URL=https://expansio-api.ricardorkaminski.workers.dev bun run build
cd apps/web && npx wrangler pages deploy dist --project-name expansio
```

## Variáveis de Ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `API_PORT` | `4000` | Porta da API |
| `WEB_PORT` | `3000` | Porta do Vite |
| `DOCKER_API_PORT` | `4003` | Porta host Docker (API) |
| `DOCKER_WEB_PORT` | `3003` | Porta host Docker (Web) |
| `API_URL` | `http://localhost:4000` | URL da API (Docker: `http://api:4000`) |
| `CORS_ORIGINS` | `localhost:3000,5173,3003` | Origens CORS permitidas |
| `VITE_API_URL` | — | URL da API para build de produção |
