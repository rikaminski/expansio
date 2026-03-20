**Teste Técnico**

Desenvolvedor(a) Frontend

_Plataforma de Inteligência de Mercado_

**Nível da vaga** Frontend                                       | 
**Forma de entrega** URL pública + repositório Git + vídeo |
**Stack obrigatória** Docker Compose + qualquer frontendmoderno |

# **1\. Contexto do Desafio**

Você foi contratado(a) como desenvolvedor(a) Frontend Pleno em uma empresa de varejo com operações em todo o Brasil. A área de estratégia precisa de uma ferramenta que permita a equipe de expansão visualizar dados de mercado sobre o território nacional de forma clara e interativa.

Sua missão é construir uma Plataforma de Inteligência de Mercado - uma aplicação web completa que exibe um mapa interativo do Brasil com múltiplas camadas de dados sobrepostas, permitindo à equipe identificar oportunidades de expansão, analisar demanda regional e acompanhar a rede de lojas existente.

_Este teste avalia não apenas suas habilidades de frontend, mas também sua capacidade de pensar como engenheiro(a) de software completo(a): desde a arquitetura da solução até o deploy em produção._

# **2\. Descrição do Produto**

## **2.1 Visão Geral**

A aplicação consiste em um dashboard que centraliza dados de mercado sobre o mapa do Brasil. O usuário pode ativar e desativar camadas de dados independentes, cada uma representando uma dimensão diferente de análise de negócio.

## **2.2 Funcionalidades Obrigatórias**

### **Mapa Base Interativo**

- Mapa do Brasil interativo com zoom, pan e tooltips
- Exibição por estados (UF) com delimitação de fronteiras
- Seleção de estado para ver detalhes regionais
- Indicador visual do estado/região em foco

### **Sistema de Camadas (Layers)**

O painel lateral deve permitir ao usuário ligar e desligar as seguintes camadas de dados de forma independente:

| **Camada**               | **Representação Visual** | **Descrição**                                                                                                                             |
| ------------------------ | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Filiais Ativas**       | Marcadores no mapa       | Localização das lojas em operação. Ao clicar, exibe nome, cidade, UF e data de abertura.                                                  |
| **Potencial de Mercado** | Heatmap sobre os estados | Coloração por intensidade (ex.: verde = alto potencial, vermelho = baixo). Baseado em dados como PIB per capita, população e renda média. |
| **Demanda Estimada**     | Bolhas proporcionais     | Círculos cujo tamanho representa o volume de demanda estimado por região. Tooltip com valor absoluto.                                     |
| **Zonas de Expansão**    | Regiões destacadas       | Áreas com alto potencial e sem loja presente, indicadas como prioridade de expansão. Polígonos ou estados destacados.                     |
| **Concorrência**         | Marcadores distintos     | Localização de concorrentes conhecidos (dados mockados). Ícone diferente das filiais próprias.                                            |

### **Painel de Análise por Região**

- Sidebar ou modal com dados detalhados ao clicar em um estado
- Exibir métricas como: população, PIB per capita, número de lojas próprias, score de potencial
- Mini gráfico (barra ou linha) com comparativo entre regiões

### **Filtros e Controles**

- Filtro por período (ex.: expansão nos últimos 12 meses vs. histórico completo)
- Filtro por região geográfica (Norte, Nordeste, Centro-Oeste, Sudeste, Sul)
- Barra de busca para localizar um estado ou cidade no mapa

# **3\. Requisitos Técnicos**

## **3.1 Stack e Arquitetura**

A aplicação deve ser construída como um projeto containerizado, orquestrado por Docker Compose, com separação clara entre frontend e backend.

| **Camada**          | **Requisito**                                                                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**        | React, Vue ou Angular (livre escolha). Recomendamos React + TypeScript.                                                            |
| **Mapa**            | Leaflet.js, MapLibre GL, Deck.gl ou similar. O uso de Google Maps é permitido mas não recomendado (custo de API).                  |
| **Backend / API**   | Node.js (Express/Fastify), Python (FastAPI/Flask) ou qualquer linguagem. Deve servir os dados das camadas via API REST ou GraphQL. |
| **Dados**           | Dados 100% mockados. Podem ser JSON estático, seed em banco ou gerados dinamicamente. Não é necessário usar dados reais.           |
| **Containerização** | Obrigatório: docker-compose.yml funcional. O avaliador deve conseguir subir toda a aplicação com um único comando.                 |
| **Deploy**          | Obrigatório: a aplicação deve estar acessível em uma URL pública.                                                                  |

## **3.2 Estrutura Esperada do Repositório**

_O repositório deve estar público no GitHub, GitLab ou Bitbucket. O candidato deve compartilhar o link junto com a URL de produção._

Estrutura mínima esperada:

**projeto/**

├── frontend/ # Código do frontend

├── backend/ # API / servidor de dados

├── docker-compose.yml # Orquestração dos containers

└── README.md # Instruções de setup e uso

## **3.3 README Obrigatório**

O README.md deve conter obrigatoriamente:

- URL pública da aplicação em produção
- Instruções para rodar localmente com Docker Compose (deve funcionar com docker compose up)
- Descrição das camadas de dados implementadas
- Decisões técnicas relevantes e trade-offs conscientes

# **4\. Critérios de Avaliação**

A avaliação será feita com base nos seguintes critérios:

| **Critério**            | **O que será avaliado**                                                     |
| ----------------------- | --------------------------------------------------------------------------- |
| **Funcionalidade**      | A aplicação roda? Todas as camadas obrigatórias estão implementadas?        |
| **Qualidade do Código** | Organização, legibilidade, componentização, separação de responsabilidades. |
| **UX / Interface**      | Design intuitivo, responsividade, clareza visual das camadas e dados.       |
| **Infraestrutura**      | Docker Compose funcional, deploy acessível e README claro.                  |
| **Arquitetura**         | Estrutura do projeto, decisões técnicas e clareza da API.                   |

# **5\. Instruções de Entrega**

## **5.1 O que enviar**

Ao final do prazo, o candidato deve enviar um e-mail para o recrutador com:

- Link do repositório público no GitHub/GitLab
- URL pública da aplicação em produção (deve estar acessível no momento da avaliação)
- Vídeo de demonstração da aplicação em funcionamento
- Breve descrição das suas escolhas técnicas (pode ser no corpo do e-mail ou no README)

## **5.2 Comando esperado de execução local**

O avaliador deve conseguir executar toda a stack localmente com o seguinte fluxo:

\# Clonar o repositório

git clone <https://github.com/seu-usuario/projeto>

cd projeto

\# Subir a aplicação

docker compose up --build

\# Acessar no navegador

open <http://localhost:3000>

## **5.3 Dúvidas**

Dúvidas técnicas ou de escopo podem ser enviadas por e-mail ao recrutador. Perguntas pertinentes serão respondidas a todos os candidatos.

# **6\. Observações Finais**

_Não existe uma única forma correta de resolver este desafio. Valorizamos candidatos que tomam decisões conscientes, comunicam trade-offs e demonstram cuidado com o produto final._

- Dados 100% mockados são suficientes - não se preocupe em integrar APIs externas reais
- A complexidade visual do mapa deve ser proporcional ao tempo disponível - priorize funcionalidade sobre perfeição
- Um código simples, limpo e funcional vale mais do que código complexo quebrado
- Documente suas decisões: o processo de raciocínio é tão importante quanto o resultado
- Commits frequentes e bem descritos demonstram organização e processo de trabalho