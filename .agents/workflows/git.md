---
description: Git workflow — convenções de commit e organização do repositório Expansio
---

# Git Workflow — Expansio

## Convenção de Commits

Formato: `tipo: mensagem descritiva`

Tipos aceitos:
- `feat:` — Nova funcionalidade
- `fix:` — Correção de bug
- `chore:` — Tarefas de infraestrutura, build, configuração
- `docs:` — Documentação
- `style:` — Formatação (não altera lógica)
- `refactor:` — Refatoração sem mudar comportamento
- `test:` — Adição ou ajuste de testes

## Regras

1. **Commit = Unidade funcional testável** — Cada commit compila e funciona isoladamente
2. **Ordem coesa** — Seguir a ordem do task.md
3. **Commit quando pronto** — Escrever, testar, commitar. Não acumular mudanças
4. **Mensagens descritivas** — Subject line curta + body com bullet points quando necessário

## Sequência planejada

// turbo-all

```
1.  chore: scaffold project (workspace, biome, tsconfig, gitignore)
2.  feat: add shared types package
3.  feat: add backend with Hono, data generation and all endpoints
4.  feat: add frontend scaffold (Vite + React + Tailwind)
5.  feat: add map with state boundaries and choropleth
6.  feat: add sidebar with Apollo-style filters and TAM counter
7.  feat: add layer panel with visualization modes and marker toggles
8.  feat: add analysis panel with contextual metrics and insights
9.  feat: add keyboard shortcuts and search
10. chore: add Docker Compose and Dockerfiles
11. docs: add README with architecture and decisions
12. chore: add CI/CD workflow
```

## Passos para cada commit

1. Verificar que o código compila sem erros
2. Testar funcionalidade manualmente
3. `git add -A`
4. `git commit -m "tipo: mensagem"` com body detalhado quando aplicável
