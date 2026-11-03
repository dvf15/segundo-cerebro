---
title: "data-sources-and-learnings"
date: 2026-09-28
source: "claude-memory"
source_id: "/projects/019e738c-45d8-743c-a067-55293d2a13b5/data-sources-and-learnings.md"
description: "Data sources (IBGE Tabela 2972, FJP/IPP Tabela 1176, Data.Rio, RAIS/CAGED, FipeZAP/ITBI) and hard-won methodological learnings"
tags: ["claude", "memoria", "memoria/projects"]
---
## Key learnings

- [stated] Municipal GDP is not usable at this geographic resolution; neighborhood-level proxies are required (Censo income, IDS, real estate, RAIS, vehicle registration).
- [stated] The bairro vs. RA distinction is a recurring data-quality trap and must be kept explicit throughout.
- [stated] The FJP income data is already in constant R$ (evidenced by 1991 values predating the Real currency); re-deflating would corrupt the data. The correct approach for inflation-neutral comparison is indexing cluster income relative to Rio's average.
- [stated] Census temporal anchors (2000, 2010, 2022) are the only available intervals for neighborhood-level data — annual series do not exist at this granularity.

## Sources confirmed and used

- [stated] IBGE Tabela 2972 — census population by sex per bairro.
- [stated] FJP/IPP Tabela 1176 — household income by quintile.

## Sources planned

- [stated] Data.Rio "Bairros Cariocas" dataset — for the RA crosswalk.
- [stated] FipeZAP/ITBI — real estate values.
- [stated] RAIS/CAGED — formal employment.
- [stated] IPP IDS index.

## Output tools and references

- [stated] Excel/spreadsheets with documented formulas.
- [stated] PowerPoint in McKinsey-style consulting format.
- [stated] Allos brand palette as reference (approximated; Brandfetch was blocked during the session).
