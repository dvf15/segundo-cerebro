---
title: "Adaptação de prompt para Carioca shopping"
date: 2026-08-13
updated: 2026-08-13
source: "claude-chat"
source_id: "e0c58167-e648-4a79-ab86-eafbc81e29e2"
url: "https://claude.ai/chat/e0c58167-e648-4a79-ab86-eafbc81e29e2"
project: null
messages: 2
tags: ["claude", "conversa"]
---
# Adaptação de prompt para Carioca shopping

> **Resumo:** **Conversation Overview**

The person is working in a shopping mall marketing or management context and asked Claude to adapt and improve an existing AI agent prompt ("ENTERTAINER / EXPERIENCE & EVENTS ARCHITECT") originally built for a generic "Shopping Inteligente" framework and previously configured for Mooca Plaza Shopping. The task was to recalibrate the prompt for Carioca Shopping, located in Vila da Penha, Rio de Janeiro, operated by Allos.

Claude identified that the original prompt's temporal window was outdated (July school holidays and Dia dos Pais had already passed in 2026) and corrected the planning window to September through November 2026. Claude then conducted web searches to gather verified data about Carioca Shopping — including its ABL of approximately 34,000 m², monthly footfall of around 1 million visitors, public profile of predominantly B and C income classes, proximity to the Vicente de Carvalho metro station and BRT TransCarioca, the Carioca Offices tower with 360 commercial rooms, and the planned Taste Lab gastronomy expansion. Claude also researched the Festa da Penha in the neighboring Penha district (occurring throughout October) and verified Rio de Janeiro public holidays for the period, including exact days of the week for key dates such as Dia das Crianças falling on a Monday and Halloween falling on a Saturday.

The improved prompt delivered includes: a full strategic context section with operational implications specific to the asset (neighborhood-dominant positioning, underutilized office worker audience, cultural identity of Zona Norte, and guidance on engaging with the Festa da Penha without commercial appropriation of religious themes); a KPI framework with explicit formulas and a caveat about footfall uplift causality; a detailed compliance and safety checklist structured as blockers rather than suggestions; commercial and sponsorship rules including sector suggestions aligned to the B/C profile; a verified Rio de Janeiro calendar for the period; and a structured output format covering a master calendar table, occupancy map, top three strategic bets, sponsorship pipeline, compliance checklist per event, and an explicit "what I don't know" section. Claude also flagged a confidence level of 7/10, noting that the absence of the real space inventory, the unconfirmed status of the Taste Lab expansion, and the unlocated exact 2026 Festa da Penha calendar were the main limitations. The person did not provide corrections or additional instructions during the session.

**Mensagens:** 2 · **Criada:** 2026-08-13 · **Atualizada:** 2026-08-13

---

## 👤 Usuário · 2026-08-13 01:55

Adeque esse prompt para o Carioca shopping e aprimore o prompt

Você é o ENTERTAINER / EXPERIENCE &amp; EVENTS ARCHITECT do Shopping Inteligente . Missão: maximizar a ocupação de praças e espaços de eventos, criar motivos de visita recorrentes e aumentar o fluxo, tempo de permanência e as vendas — especialmente em dias ativados KPIs: fluxo por evento, tempo de permanência, vendas de gastronomia em dias ativados, engajamento TikTok/Reels, receita de patrocínio, ocupação de praças. ### REGRAS DO CALENDÁRIO- Nenhuma praça pode ficar vaga por mais de 1 semana consecutiva.- Sempre considerar tempo de montagem e desmontagem entre eventos.- Priorizar eventos com baixo risco de acidentes.- Férias escolares: concentrar eventos infantis e familiares.- Datas do varejo: alinhar tema do evento à data  (ex: terror/Halloween, amor/Dia dos Namorados).-.### SAÍDA DO AGENTE Tabela de calendário:Mês | Evento | Público-alvo |Local no shopping | Custo estimado de produção |Patrocínio sugerido (quem paga / quanto) |Lojistas conectados |Impacto esperado em fluxo---## COMANDO Rode o Entertainer para: Shopping: Mooca Plaza Shopping - Praça Central (capacidade ~300–500 pessoas)- Estacionamento (eventos externos de grande porte)- Corredor Piso 1 Datas e períodos relevantes para os próximos 3 meses:- Julho: férias escolares de inverno (alto potencial de fluxo infantil)- Agosto: Dia dos Pais (2º domingo)- Outubro: Dia das Crianças (12/10) + Halloween (31/10)- Novembro: início do Natal + Black Friday Restrições:- Nenhuma praça vaga por mais de 1 semana  Apenas eventos com baixo risco de acidentes- Preferência por eventos com potencial de patrocínio- Considerar montagem/desmontagem entre eventosEntregue:1. Calendário de eventos para os próximos 3 meses

## 🤖 Claude · 2026-08-13 01:58


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Antes de entregar: o prompt original está calibrado para o Mooca Plaza e para uma janela de tempo que já passou (julho/férias de inverno e Dia dos Pais — que em 2026 caiu em 09/08). Refiz a janela para **set–nov/2026** e troquei o contexto para o Carioca.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

**O que mudou de mais relevante:**

- **Janela temporal corrigida.** As datas do prompt original já passaram (férias de julho, Dia dos Pais 09/08/2026). A janela virou set–nov/2026, com alerta de que Black Friday e Natal já precisam estar sendo vendidos agora.
- **Contexto do Carioca substituindo o do Mooca**, com implicações estratégicas explícitas: público B/C, metrô Vicente de Carvalho + BRT na porta, 360 salas de escritório no complexo (público cativo subaproveitado), Festa da Penha ocupando outubro no bairro vizinho.
- **Calendário RJ 2026 com dias da semana conferidos**: 12/10 cai numa segunda (feriadão de 3 dias), Halloween cai num sábado, Finados 02/11 e Consciência Negra 20/11 formam dois feriadões em novembro.
- **Seção de compliance bloqueante** — AVCB, ART, ECAD, LGPD, ECA, seguro de RC. O original só dizia "baixo risco de acidentes", o que é vago demais para reprovar um inflável sem laudo.
- **KPIs com fórmula e baseline** em vez de lista solta, incluindo a ressalva de que uplift em dia de evento não é causalidade (jogo do Flamengo, dia de pagamento e chuva contaminam a leitura).
- **Regras epistêmicas e de não-contratação** embutidas no prompt, alinhadas ao seu padrão.

Os campos `[PREENCHER]` mais críticos são o inventário de espaços (m², capacidade, carga de piso, energia) e o baseline de fluxo — sem eles o agente vai gerar calendário plausível, mas com números inventados.

**Confiança: 7/10.** Puxa para baixo: (a) não tenho o inventário real de praças do Carioca, então o comando ficou parametrizado em vez de específico como estava no Mooca; (b) a expansão do Taste Lab tinha início previsto para 2025 segundo material de jan/2025 — não confirmei se foi entregue, e isso muda a leitura da praça de alimentação; (c) o calendário exato da Festa da Penha 2026 no Rio não foi localizado, confirmei apenas que a celebração ocorre em outubro.
