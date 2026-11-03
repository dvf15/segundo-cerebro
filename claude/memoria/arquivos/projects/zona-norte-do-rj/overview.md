---
title: "overview"
date: 2026-09-28
source: "claude-memory"
source_id: "/projects/019e738c-45d8-743c-a067-55293d2a13b5/overview.md"
description: "Zona Norte Rio shopping-center study — clusters (NorteShopping, Nova América, Carioca, Madureira), methodology rules, and current state"
tags: ["claude", "memoria", "memoria/projects"]
---
- [stated] Daniel is running a research project analyzing the economic and population evolution of Rio de Janeiro's Zona Norte over roughly 20 years, centered on four major shopping centers.
- [stated] The shopping centers are grouped into three geographic clusters.
- [stated] Cluster A (Méier/Inhaúma): NorteShopping (Cachambi) + Nova América (Del Castilho) — treated as one cluster because they share an influence area (~1 km apart).
- [stated] Cluster B (Penha/Irajá): Carioca Shopping (Vila da Penha).
- [stated] Cluster C (Madureira): Madureira Shopping.
- [stated] The project appears connected to work involving Allos, a Brazilian shopping center company, given the use of their brand palette in deliverables.

## Methodology rules

- [stated] Verified sources with access dates are required.
- [stated] Confidence ratings are required on all claims.
- [stated] Correlation must be kept strictly separate from causation.
- [stated] Estimating or fabricating data is hard-prohibited.
- [stated] Rigor is explicitly prioritized over speed or completeness.
- [stated] The methodology follows a six-step structure documented in a formal Markdown project instruction document produced early in the project.
- [stated] Confidence ratings: 8/10 was the baseline in early project documentation, with geography/sources rated high and RA numbering/expansion dates as uncertain elements.
- [stated] Daniel works iteratively, directing specific chart substitutions and corrections rather than accepting wholesale outputs.
- [stated] Data sourcing challenges (rate limits, JavaScript-blocked pages, corrupted mirrors) are disclosed and documented rather than worked around silently.
- [stated] Partial deliverables with explicit flags are preferred over fabricated completeness.

## Current state

- [stated] Population layer is fully processed using IBGE Tabela 2972 census data (1991/2000/2010/2022). All 18 cluster bairros validated; bairro→RA→AP crosswalk confirmed.
- [stated] Population finding: all three clusters lost population faster than the city average between 2000–2022 (A: −7.0%, B: −12.8%, C: −20.5%), with decline concentrated in 2010–2022.
- [stated] Income layer is processed from FJP/IPP Tabela 1176 for household per-capita income (1991/2000/2010 in constant R$).
- [stated] Income finding: real income roughly tripled across all clusters 1991→2010, but only Cluster A remained above Rio's average (121% in 2010); Clusters B and C fell relative to the city mean (to ~69% and ~68% respectively).
- [stated] Deliverables produced: population charts (absolute, indexed, per-bairro variation), income charts (real per-cluster, per-bairro, and relative to Rio average), validated base spreadsheets (`base_populacao_clusters.xlsx`, `base_renda_clusters.xlsx`), and a two-slide McKinsey-style PowerPoint deck in the Allos brand palette.

## Data caveats to preserve

- [stated] Outlier bairros (Vista Alegre +102%, Del Castilho +45%, Vila Kosmos −39%) are possible census boundary artifacts.
- [stated] Income cluster means reflect partial bairro coverage (A: 4/6, B: 3/6, C: 2/6 isoláveis).
- [stated] Income series ends at 2010; 2022 income data remains pending.
- [stated] The Allos green palette used is an approximation (official hex unconfirmed).
- [stated] Nova América expansion date conflict: 2012 vs. 2014, unresolved.
- [stated] RA numbering should be verified against Data.Rio's "Bairros Cariocas" dataset rather than assumed.

## On the horizon

- [stated] Pending data layer: formal employment data from RAIS/CAGED by bairro.
- [stated] Pending data layer: real estate values, m² by bairro (FipeZAP/ITBI).
- [stated] Pending: income data extended to 2022, to close the gap in the income series.
- [stated] The full indicator set also includes the IDS index (IPP), vehicle registration as a consumption proxy, and shopping center expansion phase dates (especially Nova América).
