---
title: "overview"
date: 2026-09-28
source: "claude-memory"
source_id: "/projects/019dddd8-73d7-7210-9bc2-5bb52315f39e/overview.md"
description: "Excel cost-basis workbooks for Brazilian Imposto de Renda on Casa 4 (Palm Hill) and Apartamento 194 (Av. Portugal 1.223, One Brooklin)"
tags: ["claude", "memoria", "memoria/projects"]
---
- [stated] Daniel builds and maintains Excel spreadsheets tracking real estate acquisition costs for Brazilian income tax (Imposto de Renda) purposes
- [stated] Goal is accurate, declaration-ready cost basis records for two properties, structured around the regime de caixa (cash basis) principle and RFB guidelines
- [stated] Property 1: Casa 4 – Condomínio Palm Hill, a financed acquisition with an R$1.7M loan; construction/improvement works actively in progress
- [stated] Property 2: Apartamento 194 – One Brooklin (Av. Portugal 1.223), acquired 2023 under an Itaú financing contract, including an extraordinary FGTS amortization event in 2024
- [stated] Key collaborators and references: Bambu.Arq (architecture), Fratelli, Rodolfo Moralez (structural report), Unimóveis (carpentry), Staccato (marble/stone)

## Workbook structure

- [stated] Two parallel Excel workbooks share the same structure (formulas, formatting, tabs) with property-specific values; built as cleaned copies to allow parallel maintenance with consistent logic
- [stated] Core tab "Lancamentos": line-by-line expense records with activatable cost percentages
- [stated] Core tab "Evolucao_Anual_IR": annual cost basis evolution across a 10-year window, with pre-filled confirmed payments and blank cells for future manual entry from DDC statements
- [stated] "Resumo IR" block shows the exact declarable value for each year-end
- [stated] Two parallel scenarios per workbook — Cenário Conservador (acquisition cost + amortization + improvements/benfeitorias) and Cenário Amplo (adds juros and MIP/DFI insurance, per IN RFB 84/2001 art. 17, V) — maintained side by side for flexibility at declaration time
- [stated] Benfeitorias pull automatically from Lancamentos by year via SUMIFS, with manual override capability

## Current state

- [stated] Both workbooks are under active development
- [stated] Casa 4 Lancamentos: seven 2026 construction expense records added, totaling ~R$152,095 in activatable costs for 2026; a Letícia Brito PIX was excluded as unrelated to construction
- [stated] Av. Portugal setup completed: year range 2023–2033 (matching the actual acquisition year)
- [stated] Av. Portugal acquisition cost: R$333,517.86 (down payment incl. FGTS + ITBI + registry/appraisal fees)
- [stated] Av. Portugal financing: Itaú, 408 months, fixed rate; 33 paid installments entered from DDC covering 2023–April 2026
- [stated] Av. Portugal extraordinary FGTS amortization (July 2024) recorded as additional amortization for 2024
- [stated] Karpat condomínio boleto explicitly excluded from Av. Portugal as a recurring operating expense, not acquisition cost

## Principles and learnings

- [stated] Regime de caixa is fundamental: only cash actually disbursed in a given year is activatable; financed amounts are not a lump-sum cost in the acquisition year
- [stated] Only actually paid amounts (down payment, ITBI, registry fees, annual amortization installments) are recorded as activatable cost in Bens e Direitos — a corrected conceptual error from a prior session
- [stated] The outstanding loan balance belongs in Dívidas e Ônus Reais, not in the asset cost basis
- [stated] Activatable percentages are recorded explicitly per expense — e.g. 50% for shared architect/contractor invoices, 100% for direct material purchases
- [stated] Exclusion discipline: recurring operating costs (condomínio, unrelated PIX transfers) are explicitly excluded and documented as such
- [stated] Bank DDC statements are the authoritative source of truth for installment and amortization data; future years are left blank for manual entry as statements become available
- [stated] Working pattern: pre-fill confirmed historical data, leave future periods blank for manual DDC update
- [stated] Uploaded source documents drive data entry, with explicit per-item decisions on inclusion/exclusion and activatable percentage

## Tools and sources

- [stated] Microsoft Excel is the primary tool for all workbooks
- [stated] Source documents: purchase contracts, ITBI receipts, registry fee boletos, Itaú DDC statements, and NF (invoices) from contractors
- [stated] Legal reference: IN RFB 84/2001 art. 17, V — the basis for including interest and insurance in Cenário Amplo
