---
tags: [projeto/clausulas, conceito, custo]
aliases: [Custo, Custo por Loja, Custo Total, Tipo A, Tipo B]
---

# Custo da Concessão

> [!tip] Em resumo
> O custo é calculado **por loja** e o **total = por loja × nº de praças** — revela o tamanho real da concessão na rede.

## Cláusulas quantitativas (custo calculável)
Para **Taxa de Transferência, Reajuste e Multa Rescisória**, o custo sai de fórmula sobre o contrato:
- **Taxa**: `custo_loja = (taxa_padrão − taxa_negociada) × aluguel_mensal`
- **Reajuste (índice)**: `custo_loja = aluguel_mensal × Δíndice% × meses`
- **Reajuste (prazo)**: `custo_loja = aluguel_mensal × reajuste% × meses_postergação`
- **Multa**: `custo_loja = (multa_padrão − multa_negociada) × aluguel_mensal × P(rescisão)`
- **Custo total** = `custo_loja × nº de praças`
- **Desconto (%)** = `(padrão − negociado) / padrão × 100` → alimenta a régua de [[Alçadas e Roteamento|alçada]] (limite de 50%).

## Tipos de cláusula
- **Tipo A (computável)**: fórmula sobre o contrato (as acima).
- **Tipo B (risco ordinal)**: sem R$ direto; peso 1 / 3 / 9 (usado para custo estimado quando não há dados).
- **Limite duro**: Compliance (Anticorrupção, PEP, LGPD, Confidencialidade) — inegociável, fora da decisão econômica.

> [!info] Papel do custo
> O custo **não define mais a alçada** (isso agora é a régua de grau/praças/portfólio/desconto). Ele entra como **informação**: mostra à alçada o impacto por loja e no total da rede, e compõe o [[Business Case Automático|business case]].

Ver os 32 tipos em [[Decomposição das 32 Cláusulas]].

---
Voltar ao [[00 - MOC - Projeto Cláusulas|índice]].
