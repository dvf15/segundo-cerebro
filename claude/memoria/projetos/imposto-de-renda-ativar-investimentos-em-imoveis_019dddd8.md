---
title: "Memória do projeto: Imposto de renda - ativar investimentos em imoveis"
source: "claude-memory"
source_id: "019dddd8-73d7-7210-9bc2-5bb52315f39e"
project: "Imposto de renda - ativar investimentos em imoveis"
tags: ["claude", "memoria", "projeto/imposto-de-renda-ativar-investimentos-em"]
---
# Memória do projeto: Imposto de renda - ativar investimentos em imoveis

**Purpose & context**

Daniel is building and maintaining Excel spreadsheets to track real estate acquisition costs for Brazilian income tax (Imposto de Renda) purposes. The goal is accurate, declaration-ready cost basis records for two properties, structured around the *regime de caixa* (cash basis) principle and Brazilian tax authority (RFB) guidelines.

**Properties tracked:**
- **Casa 4 – Condomínio Palm Hill**: Financed acquisition (R$1.7M loan); construction/improvement works actively in progress
- **Apartamento 194 – One Brooklin (Av. Portugal 1.223)**: Itaú financing contract, acquired in 2023; includes an extraordinary FGTS amortization event in 2024

**Key collaborators/references:** Bambu.Arq (architecture), Fratelli, Rodolfo Moralez (structural report), Unimóveis (carpentry), Staccato (marble/stone)

---

**Current state**

Two parallel Excel workbooks are under active development, sharing the same structure (formulas, formatting, tabs) but with property-specific values.

**Core tabs in each workbook:**
- **Lancamentos**: Line-by-line expense records with activatable cost percentages
- **Evolucao_Anual_IR**: Annual cost basis evolution through a 10-year window, with pre-filled confirmed payments and blank cells for future manual entry from DDC statements
- **Resumo IR block**: Shows the exact declarable value for each year-end

**Two parallel scenarios per workbook:**
- *Cenário Conservador*: acquisition cost + amortization + improvements (benfeitorias)
- *Cenário Amplo*: adds interest (juros) and MIP/DFI insurance, per IN RFB 84/2001 art. 17, V

**Critical conceptual correction made:** Only actually paid amounts (down payment, ITBI, registry fees, annual amortization installments) are recorded as activatable cost in *Bens e Direitos*. The outstanding loan balance belongs in *Dívidas e Ônus Reais*, not in the cost basis.

**Casa 4 – recent additions to Lancamentos (2026):**
Seven construction expense records added totaling ~R$152,095 in activatable costs for 2026; Letícia Brito PIX excluded as unrelated to construction.

**Av. Portugal – setup completed:**
- Year range: 2023–2033 (matching actual acquisition year)
- Acquisition cost: R$333,517.86 (down payment incl. FGTS + ITBI + registry/appraisal fees)
- Financing: Itaú, 408 months, fixed rate; 33 paid installments entered from DDC (2023–April 2026)
- Extraordinary FGTS amortization (July 2024): recorded as additional amortization for 2024
- Karpat condomínio boleto explicitly excluded (recurring operating expense, not acquisition cost)

---

**Key learnings & principles**

- **Regime de caixa is fundamental**: Only cash actually disbursed in a given year is activatable; financed amounts are not a lump-sum cost in the acquisition year
- **Dívidas e Ônus Reais vs. Bens e Direitos**: Outstanding loan balance goes in the liabilities ficha, not the asset cost basis — this was a corrected error from a prior session
- **Activatable percentage matters**: Expenses are recorded with explicit activatable percentages (e.g., 50% for shared architect/contractor invoices, 100% for direct material purchases)
- **Benfeitorias via SUMIFS**: Improvement costs pull automatically from Lancamentos by year, with manual override capability
- **Exclusion discipline**: Recurring operating costs (condomínio, unrelated PIX transfers) are explicitly excluded and documented as such
- **DDC as source of truth**: Bank DDC statements are the authoritative source for installment and amortization data; future years left blank for manual entry as statements become available

---

**Approach & patterns**

- Workbooks are built as cleaned copies sharing structure, allowing parallel maintenance with consistent logic
- Pre-fill confirmed historical data; leave future periods blank for manual update from DDC
- Scenarios (Conservador/Amplo) are maintained side by side for flexibility at declaration time
- Uploaded source documents (contracts, ITBI receipts, boletos, DDC) drive data entry, with explicit per-item decisions on inclusion/exclusion and activatable percentage

---

**Tools & resources**

- **Microsoft Excel**: Primary tool for all workbooks
- **Source documents**: Purchase contracts, ITBI receipts, registry fee boletos, Itaú DDC statements, NF (invoices) from contractors
- **Legal reference**: IN RFB 84/2001 art. 17, V (basis for Cenário Amplo interest/insurance inclusion)
