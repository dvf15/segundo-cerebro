---
title: "radarbazin1 · infraestrutura (Vercel + Neon)"
date: 2026-11-12
source: "github"
source_id: "dvf15/radarbazin1/infra"
url: "https://vercel.com/dvf15s-projects/radarbazin1-s68m"
tags: ["codigo", "infra", "vercel", "repo/radarbazin1"]
---
# radarbazin1 · infraestrutura

Levantado em 2026-11-12 a partir da Vercel e do repositório. **Nenhum valor de segredo está aqui**, só os nomes e onde cada coisa vive, para permitir reconstruir o ambiente.

## Onde cada parte está

| Parte | Onde vive | Está no backup? |
| --- | --- | --- |
| Código (Next.js 14, Prisma, Tailwind, ferramentas Radar em `public/*.html`) | GitHub `dvf15/radarbazin1` | Sim (GitHub; docs `.md` também neste vault) |
| Deploy | Vercel, projeto `radarbazin1-s68m`, time `dvf15s-projects`, ligado ao GitHub (branch `main` = produção; branches `claude/*` = preview) | Reconstruível a partir do GitHub |
| Domínios | `radarbazin1-s68m.vercel.app` e variantes; proteção SSO ligada | Config da Vercel, não versionada |
| Variáveis de ambiente | Vercel → Settings → Environment Variables | **Não.** Ver lista abaixo |
| Banco de dados (app "nutri": modelos Day, Meal, KnownFood, BpReading, Profile) | PostgreSQL no Neon, via integração Vercel (`store_kiJMAaxqWzGqJFA2`) | **Não.** Precisa de dump |
| Dados das ferramentas Radar (operações, obras, cláusulas, quiosques, mídia, simulador) | `localStorage` do navegador de cada usuário | **Não.** Só via botão de exportar de cada ferramenta |

## Variáveis de ambiente (nomes apenas)

- `APP_SENHA` (produção) — senha de acesso do app
- `ANTHROPIC_API_KEY` (produção e preview)
- `DATABASE_URL` (produção e preview) — connection string do Neon
- `NUTRI_*` (19 variáveis criadas pela integração Neon: `NUTRI_DATABASE_URL`, `NUTRI_POSTGRES_URL`, `NUTRI_PGHOST`, `NUTRI_PGUSER`, `NUTRI_PGPASSWORD`, `NUTRI_NEON_PROJECT_ID`, etc.)

Para recriar: nova conta Neon → connection string → `DATABASE_URL` na Vercel → `npm run db:migrate` → chave Anthropic → `APP_SENHA`. Passo a passo no README do repositório.

## Pendências de backup

1. **Banco Neon:** agendar `pg_dump` mensal (via GitHub Action do vault, com `DATABASE_URL` como secret) ou dump manual pelo painel do Neon. O Neon mantém restauração por poucos dias apenas.
2. **Ferramentas Radar:** os dados vivem no navegador. Exportar periodicamente pelo botão de cada ferramenta e guardar os JSON em `_raw/radar-exports/AAAA-MM-DD/`.
