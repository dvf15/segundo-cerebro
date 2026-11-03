---
title: "Valuation e faixas de preço"
date: 2026-09-25
source: "claude-project-doc"
source_id: "0aa99f56-1a97-43dd-b22e-727123624bed"
project: "Analisador de Empresas"
tags: ["claude", "projeto", "conhecimento"]
---
# Valuation e faixas de preço

# Módulo 5 — Valuation e faixas de preço

## 5.1 Taxa mínima de retorno (hurdle)
- **Brasil (em R$ reais):** rendimento real da NTN-B longa (buscar valor atualizado no Tesouro Direto/ANBIMA, com data) + prêmio de risco de ações. Padrão da skill: +5 p.p. — é uma **premissa ajustável, não um dado de mercado**; mostre-a e deixe o usuário mudar.
- **EUA (em US$ nominais):** Treasury de 10 anos (buscar valor atual) + prêmio de 4–5 p.p. (premissa).
Ajuste +1 a +3 p.p. para risco de governança, estatal, alavancagem ou baixa liquidez. Trabalhe de forma consistente: fluxos reais com taxa real, nominais com nominal.

## 5.2 Métodos (use pelo menos dois)
1. **DCF de owner earnings/FCFF por cenários** — principal. `scripts/valuation.py`.
2. **DCF reverso** — que crescimento o preço atual embute? Se exige algo que a empresa nunca entregou, o preço é otimista.
3. **Múltiplos vs. histórico próprio e pares** — P/L normalizado, EV/EBIT, FCF yield, P/VP justificado (bancos). Sanidade, não âncora.
4. **Soma das partes** — holdings e conglomerados (aplique desconto de holding e justifique).
5. **Yield de dividendos vs. NTN-B** — para ativos de renda, complementar.

## 5.3 Margem de segurança por nota de qualidade
| Nota | Margem sobre o valor base ponderado | Lógica de saída |
|---|---|---|
| A | 20–25% | Vender se TIR implícita < hurdle − 2 p.p. OU preço > valor bull, OU gatilho de tese |
| B | 30–35% | Vender/reduzir se preço > valor base × 1,15 OU TIR < hurdle, OU gatilho |
| C | 40–50% | Vender ao atingir o valor base (sem prêmio) OU gatilho |
| D | não investir | — |
Faixas são convenção desta skill, inspirada no conceito de margem de segurança; ajuste com o usuário.

## 5.4 Definições de preço no relatório
- **Preço de entrada (teto de compra)** = valor base ponderado × (1 − margem).
- **Zona de acumulação** = entre entrada e valor base.
- **Preço de saída** = conforme a coluna de lógica de saída da nota.
- **TIR implícita ao preço atual** = taxa que iguala o fluxo projetado (cenário ponderado) ao preço atual. É o número mais honesto para decidir: "comprando hoje, espero X% a.a. real".

## 5.5 Uso do script
```bash
python scripts/valuation.py --config premissas.json
```
Formato do JSON (exemplo em `scripts/exemplo_premissas.json`): preço atual, ações, dívida líquida, owner earnings base, taxa, nota de qualidade e, por cenário, probabilidade, crescimento anos 1–5, crescimento anos 6–10 e crescimento na perpetuidade. O script imprime valor por cenário, valor ponderado, DCF reverso, TIR implícita, preço de entrada, zona de acumulação, preço de saída e recomendação mecânica — que você deve confrontar com o julgamento qualitativo (gatilhos, governança) antes do veredito final.

## 5.6 Sensibilidade
Mostre uma tabela de valor por ação variando taxa (±1 p.p.) e crescimento na perpetuidade (±1 p.p.). Se a recomendação muda dentro dessa faixa, diga que a decisão é sensível e reduza a confiança.

