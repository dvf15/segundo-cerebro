---
title: "Tese Financeira"
date: 2026-09-25
source: "claude-project-doc"
source_id: "3afae573-fb8f-444a-915b-71e569964ce3"
project: "Analisador de Empresas"
tags: ["claude", "projeto", "conhecimento"]
---
# Tese Financeira

# Módulo 2 — Tese financeira

Objetivo: descobrir quanto a empresa ganha de verdade, quanto precisa reinvestir, a que retorno, e se o balanço aguenta o cenário ruim. Use 5–10 anos de histórico (DFP/10-K) — um ano isolado engana.

## 2.1 Tabela histórica obrigatória (5–10 anos)
Receita, EBIT, margem EBIT, lucro líquido reportado, **lucro normalizado**, FCO, capex (manutenção vs. expansão), **owner earnings**, capital investido, **ROIC**, ROE, dívida líquida/EBITDA, dividendos + JCP + recompras, número de ações (diluição), payout.

## 2.2 Fórmulas
- **Owner earnings** = lucro líquido + D&A + outros não-caixa − capex de manutenção (± variação de capital de giro estrutural). Se a empresa não separa capex de manutenção, aproxime por D&A ajustada pela inflação ou pelo capex de anos sem expansão — e diga que é aproximação.
- **ROIC** = NOPAT / (capital de giro operacional + imobilizado + intangível operacional). NOPAT = EBIT × (1 − alíquota efetiva). Compare com o custo de capital.
- **Teste do dólar retido** = Δ valor de mercado (5–10 anos) ÷ lucros retidos acumulados no período. < 1 indica que reter lucro destruiu valor.
- **Conversão de caixa** = FCO ÷ lucro líquido (média de 5 anos). Persistentemente < 80% merece explicação.

## 2.3 Forense — qualidade do lucro (lente Squadra)
Marque cada item como OK / Atenção / Bandeira vermelha, com o número:
1. Não-recorrentes que se repetem todo ano (reestruturação "anual", ganhos de venda de ativos, reversões de provisão).
2. Recebíveis ou estoques crescendo muito acima da receita.
3. Capitalização crescente de despesas (P&D, software, custos de contrato) vs. pares.
4. Mudança de premissas contábeis (vida útil, provisões, taxa de desconto atuarial) que aumenta lucro.
5. Rentabilidade muito acima dos pares sem vantagem estrutural identificável.
6. Resultado financeiro ou de equivalência dominante no lucro.
7. Troca de auditor, ressalvas, parágrafos de ênfase, atraso na divulgação.
8. Partes relacionadas relevantes (Formulário de Referência, seção de transações com partes relacionadas).
9. Créditos fiscais e ativos diferidos relevantes sobre o PL.
10. Diluição por remuneração em ações não refletida no "lucro ajustado".
Qualquer bandeira vermelha não explicada: rebaixa a nota de qualidade e aumenta a margem de segurança.

## 2.4 Balanço e risco
Dívida líquida/EBITDA, cronograma de amortização, custo e indexador da dívida (CDI, IPCA, dólar), covenants, descasamento cambial, passivos contingentes (tributários, trabalhistas, ambientais — nota explicativa), obrigações de arrendamento. Teste: a empresa sobrevive a 2 anos do cenário bear sem emitir ações?

## 2.5 Dividendos (para investidor de renda)
Payout sobre lucro e sobre FCF; cobertura por owner earnings; histórico em crises; dividend yield vs. NTN-B; política formal de dividendos; dependência de JCP. Dividendo pago com dívida ou acima do FCF não é sustentável — sinalize.

## 2.6 Setores com métricas próprias
- **Bancos:** ROE vs. custo de capital, índice de Basileia/CET1, NPL 90 dias, cobertura, custo de risco, índice de eficiência, P/VP justificado = (ROE − g)/(Ke − g).
- **Seguradoras/resseguradoras:** índice combinado, sinistralidade, resultado financeiro vs. operacional, suficiência de reservas, ROE ex-resultado financeiro.
- **Elétricas/transmissoras/saneamento:** RAP, base de ativos regulatória, WACC regulatório, revisões tarifárias, vencimento de concessões.
- **Shoppings/imobiliário:** NOI, vendas/m², SSS/SSR, taxa de ocupação, custo de ocupação, cap rate implícito, FFO.
- **Commodities:** custo caixa na curva global, preço normalizado de ciclo (não o spot), reservas.
- **Tecnologia/SaaS:** NRR, churn, CAC payback, margem bruta, regra dos 40 — e exija muito mais margem de segurança.

