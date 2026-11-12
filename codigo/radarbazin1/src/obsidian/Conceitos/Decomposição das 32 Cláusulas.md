---
tags: [projeto/clausulas, conceito, custo, tabela]
aliases: [Decomposição, 32 Tipos, Tabela de Cláusulas]
---

# Decomposição das 32 Cláusulas

> [!info]
> Classificação de cada tipo como **A (computável)**, **B (risco ordinal)** ou **Limite duro**, com fórmula ou peso inicial. Base da oficina com Comercial + Jurídico (ver [[Decisões a Tomar|D1–D3]]). Relacionado a [[Custo da Concessão]].

## Legenda
- **A — Computável**: fórmula sobre os dados do contrato.
- **A/B — Híbrido**: parte computável, parte risco/definição.
- **B — Risco ordinal**: peso 1/3/9 (Baixo/Médio/Alto).
- **Limite duro**: inegociável (não entra na balança).

## Tabela

| Tema | Tipo | Classe | Fórmula / Peso | Risco |
|---|---|---|---|---|
| Taxa de Transferência | Isenção de Taxa de Transferência | A | = valor integral da taxa | Baixo |
| Taxa de Transferência | Isenção 1ª Taxa de Transferência | A | = valor da 1ª taxa | Baixo |
| Taxa de Transferência | Isenção TT mesmo Grupo Econômico | A | = taxa, sem entrada de terceiro | Baixo |
| Taxa de Transferência | Redução da Taxa de Transferência | A | = % reduzido × taxa | Baixo |
| Reajuste | Alteração de Índice de Reajuste | A | = Δ índice × aluguel × prazo | Médio |
| Reajuste | Alteração de Prazo para Reajuste | A | = aluguel × meses de postergação | Médio |
| Multa | Alteração de Multa Rescisória | A/B | = P(rescisão) × Δ multa | Médio |
| Multa | Isenção de Multa Rescisória | A | = P(rescisão) × multa integral | Alto |
| Multa | Redução de Multa Rescisória Fixa | A | = P(resc) × (padrão − fixa) | Médio |
| Multa | Redução de Multa Rescisória Gradual | A | = Σ P(resc período) × multa abdicada | Médio |
| Multa | Redução de Multa Rescisória Proporcional | A | = P(resc) × (cheia − proporcional) | Médio |
| Multa | Multa por Infração Contratual | B | Peso 3 | Médio |
| Multa | Multa por Infração - Auditoria de Vendas | B | Peso 9 | Alto |
| Multa | Multa por Infração - Auditoria (agravada) | B | Peso 9 | Alto |
| NAPP | Cláusula Padrão | Referência | Peso 0 (baseline) | Baixo |
| NAPP | Cláusula sem multa e custos | B | Peso 3 | Médio |
| NAPP | Cláusula "Fumaça" | B | Peso 9 | Alto |
| NAPP | Proteção de Dados ref. ao Sistema | Limite duro | Não negociável | Crítico |
| Vendas | Vendas Líquidas | A | = (bruta − líquida) × % aluguel | Alto |
| Vendas | Vendas Online | A/B | = vendas online não computadas × % | Médio |
| Vendas | Vendas Online - Fumaça | B | Peso 9 | Alto |
| Vendas | Ship from Store / Click & Collect | A/B | = vendas omni não computadas × % | Médio |
| Vendas | Informe Mensal de Vendas | A | Peso 1 | Baixo |
| Vendas | Informe Mensal de Vendas - 3º d.ú. | A | Peso 1 | Baixo |
| Compliance | Confidencialidade | Limite duro | Não negociável (retirada só por alçada) | Alto |
| Compliance | Anticorrupção | Limite duro | Não negociável | Crítico |
| Compliance | PEP | Limite duro | Não negociável | Crítico |
| Compliance | Proteção de Dados (LGPD) | Limite duro | Não negociável | Crítico |
| Outros | Remoção de Benfeitorias | A/B | = valor das benfeitorias não incorporadas | Médio |
| Outros | Perda de Benefícios | A | = benefícios não revertidos | Médio |
| Outros | Renúncia ao Direito de Preferência/Vigência | B | Peso 9 | Alto |
| Outros | Comunicação | A | Peso 1 | Baixo |

> [!warning] Cláusulas que protegem a Cia
> Em **Multa por Infração**, **Renúncia à Preferência** e **Perda de Benefícios**, "conceder" significa **enfraquecer uma proteção** (não dar desconto). Tratar com cuidado.

---
Voltar ao [[00 - MOC - Projeto Cláusulas|índice]].
