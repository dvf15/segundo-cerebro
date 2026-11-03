---
title: "Adaptando prompt Hunter para Carioca Shopping"
date: 2026-08-13
updated: 2026-08-13
source: "claude-chat"
source_id: "46bb3ab7-927b-437a-a283-3b2eb31c8a95"
url: "https://claude.ai/chat/46bb3ab7-927b-437a-a283-3b2eb31c8a95"
project: null
messages: 2
tags: ["claude", "conversa"]
---
# Adaptando prompt Hunter para Carioca Shopping

> **Resumo:** **Conversation Overview** The person asked Claude to adapt and improve an existing HUNTER prompt — an operational agent prompt for active retail prospecting — from a previous shopping context (Mooca Plaza, São Paulo) to the Carioca Shopping (Vila da Penha, Zona Norte, Rio de Janeiro), administered by Allos. The task involved both geographic adaptation and substantive improvement of the prompt's methodology. Claude conducted web research on the Carioca Shopping's profile, competitive landscape, and recent market developments before producing the adapted prompt. Key domain terminology used throughout includes: cluster, batalha do cluster, Cluster Fit score, ABL (Área Bruta Locável), mix, lead, vacância, pop-up, quiosque, Módulo (Hunter/Street Converter/Regional Hunter), and Taste Lab. The person works in a shopping mall context involving retail prospecting, leasing, and tenant mix strategy. The delivered output (HUNTER_Carioca_Shopping_v2.0) included a fully restructured prompt with ten documented improvements over the prior version. The most significant structural changes were: replacing the intuition-based 0–100 Cluster Fit score with a weighted, auditable 6-dimension scoring model with a cutoff at 60; introducing a mandatory "2 verified public signals with traceable source" rule for every lead; adding a mandatory calibration step before execution; and incorporating a strategic alert about the Shopping Tijuca's Taste Lab expansion (2,165 m², 22 operations, confirmed brands including Coco Bambu and Bar da Gema, opening forecast 1H 2026) as an active competitive threat for gastronomy tenant capture in the Zona Norte. The prompt also introduced segmented confidence scoring across three axes — current mix data, traction signals, and brand appetite — rather than a single overall confidence score. Claude flagged that ABL figures (~23,500 m², ~211 stores, ~97.2% occupancy) came from secondary market sources and require internal validation before use in presentations, and that street corridor names in Module 2 are geographic inferences requiring field validation. **Tool Knowledge** Claude used web search to gather verified public information about the Carioca Shopping and its competitive context. Searching for "Carioca Shopping Vila da Penha ABL administradora lojas" retrieved ownership and structural data, while "Carioca Shopping expansão Taste Lab Allos gastronomia 2026" surfaced the competitive intelligence about the Shopping Tijuca Taste Lab. Claude also read local skill files (`SKILL.md` for the HUNTER and cluster-positioning-engine skills) via bash to align terminology and output structure with the person's established frameworks. The `create_file` tool was used to save the output to `/mnt/user-data/outputs/HUNTER_Carioca_Shopping_v2.md` and `present_files` was used to surface it. Secondary sources (market press, Allos investor materials, XPML11 fact sheet) were sufficient for the competitive map but insufficient for precise operational data on the asset itself, which Claude explicitly flagged rather than filling in.

**Mensagens:** 2 · **Criada:** 2026-08-13 · **Atualizada:** 2026-08-13

---

## 👤 Usuário · 2026-08-13 01:54

Adeque esse prompt para o Carioca shopping e aprimore o prompt

## 🤖 Claude · 2026-08-13 01:57


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

**Assumi que "esse prompt" é o do HUNTER** (o que você usou no Mooca Plaza) — era o único com shopping fixo no texto. Se era outro (ALAVANCADOR, ENTERTAINER, FARMER), me diz que refaço.

As três mudanças que mais importam:

1. **Cluster Fit virou score com pesos decompostos.** Na v1 era "0–100" sem método — o que na prática vira nota inventada. Agora tem 6 dimensões somando 100 e corte em 60.
2. **Regra dos 2 sinais públicos verificáveis com fonte.** Foi o que mais gerou ruído no Mooca: leads com um sinal fraco entrando como lead firme.
3. **Alerta competitivo real:** o Taste Lab do Shopping Tijuca (2.165 m², 22 operações, 1S2026, com Coco Bambu, Bar da Gema, Angu do Gomes) está absorvendo capital gastronômico da Zona Norte agora. Marcas que ficaram de fora dessa curadoria são janela imediata para o Carioca.

Ressalva importante: ABL ~23.500 m² / 211 lojas / ocupação 97,2% vieram de fonte de mercado secundária (matéria sobre a aquisição de 20% pelo XPML11), não do relatório da Allos. Confirme internamente antes de usar.

**Confiança: 7/10** — alta na estrutura e no alerta Tijuca, média nos números do ativo, baixa nos eixos de rua (inferência geográfica, não validada).
