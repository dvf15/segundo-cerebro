---
title: "Memória do projeto: Zona Norte do RJ"
source: "claude-memory"
source_id: "019e738c-45d8-743c-a067-55293d2a13b5"
project: "Zona Norte do RJ"
tags: ["claude", "memoria", "projeto/zona-norte-do-rj"]
---
# Memória do projeto: Zona Norte do RJ

**Purpose & context**

Daniel is conducting a rigorous research project analyzing the economic and population evolution of Rio de Janeiro's Zona Norte over approximately 20 years, centered on four major shopping centers grouped into three geographic clusters:

- **Cluster A (Méier/Inhaúma):** NorteShopping (Cachambi) + Nova América (Del Castilho) — treated as one cluster due to shared influence area (~1 km apart)
- **Cluster B (Penha/Irajá):** Carioca Shopping (Vila da Penha)
- **Cluster C (Madureira):** Madureira Shopping

The project appears connected to work involving **Allos** (a Brazilian shopping center company), given the use of their brand palette in deliverables. The work is governed by explicit methodological rules: verified sources with access dates, confidence ratings on all claims, strict separation of correlation from causation, and a hard prohibition on estimating or fabricating data. Rigor is explicitly prioritized over speed or completeness.

**Current state**

Significant analytical groundwork has been completed:

- **Population layer:** Fully processed using IBGE Tabela 2972 census data (1991/2000/2010/2022). All 18 cluster bairros validated; bairro→RA→AP crosswalk confirmed. Key finding: all three clusters lost population faster than the city average between 2000–2022 (A: −7.0%, B: −12.8%, C: −20.5%), with decline concentrated in 2010–2022.
- **Income layer:** FJP/IPP Tabela 1176 processed for household per-capita income (1991/2000/2010 in constant R$). Key finding: real income roughly tripled across all clusters 1991→2010, but only Cluster A remained above Rio's average (121% in 2010); Clusters B and C fell relative to the city mean (to ~69% and ~68% respectively).
- **Deliverables produced:** Population charts (absolute, indexed, per-bairro variation), income charts (real per-cluster, per-bairro, and relative to Rio average), validated base spreadsheets (`base_populacao_clusters.xlsx`, `base_renda_clusters.xlsx`), and a two-slide McKinsey-style PowerPoint deck in Allos brand palette.

**Flagged data caveats to preserve:**
- Outlier bairros (Vista Alegre +102%, Del Castilho +45%, Vila Kosmos −39%) are possible census boundary artifacts
- Income cluster means reflect partial bairro coverage (A: 4/6, B: 3/6, C: 2/6 isoláveis)
- Income series ends at 2010; 2022 income data remains pending
- Allos green palette is an approximation (official hex unconfirmed)
- Nova América expansion date conflict: 2012 vs. 2014 (unresolved)
- RA numbering should be verified against Data.Rio's "Bairros Cariocas" dataset rather than assumed

**On the horizon**

Two data layers remain pending:
- **Formal employment data:** RAIS/CAGED by bairro
- **Real estate values:** m² by bairro (FipeZAP/ITBI)
- **Income data extended to 2022** (to close the gap in the income series)

The full indicator set also includes IDS index (IPP), vehicle registration as a consumption proxy, and shopping center expansion phase dates (especially Nova América).

**Key learnings & principles**

- **Municipal GDP is not usable** at this geographic resolution; neighborhood-level proxies are required (Censo income, IDS, real estate, RAIS, vehicle registration)
- **Bairro vs. RA distinction** is a recurring data-quality trap — must be kept explicit throughout
- **The FJP income data is already in constant R$** (evidenced by 1991 values predating the Real currency); re-deflating would corrupt the data. The correct approach for inflation-neutral comparison is indexing cluster income relative to Rio's average
- **Census temporal anchors** (2000, 2010, 2022) are the only available intervals for neighborhood-level data — annual series do not exist at this granularity
- Partial deliverables with explicit flags are preferred over fabricated completeness

**Approach & patterns**

- Daniel works iteratively, directing specific chart substitutions and corrections rather than accepting wholesale outputs
- Data sourcing challenges (rate limits, JavaScript-blocked pages, corrupted mirrors) are disclosed and documented rather than worked around silently
- Confidence ratings are required on all claims; 8/10 was the baseline in early project documentation, with geography/sources rated high and RA numbering/expansion dates as uncertain elements
- The methodology follows a six-step structure documented in a formal Markdown project instruction document produced early in the project

**Tools & resources**

- **Data sources confirmed and used:** IBGE Tabela 2972 (census population by sex per bairro), FJP/IPP Tabela 1176 (household income by quintile)
- **Data sources planned:** Data.Rio ("Bairros Cariocas" for RA crosswalk), FipeZAP/ITBI (real estate), RAIS/CAGED (formal employment), IPP IDS index
- **Output tools:** Excel/spreadsheets with documented formulas, PowerPoint (McKinsey-style consulting format)
- **Brand reference:** Allos palette (approximated; Brandfetch was blocked during the session)
