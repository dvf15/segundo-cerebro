---
title: "Filosofias de referência e como viram regras"
date: 2026-09-25
source: "claude-project-doc"
source_id: "9ad9d791-63e1-4997-b2c3-21b736df852a"
project: "Analisador de Empresas"
tags: ["claude", "projeto", "conhecimento"]
---
# Filosofias de referência e como viram regras

# Filosofias de referência e como viram regras

Este arquivo separa (a) o que cada casa declara publicamente, com fonte, de (b) a regra operacional que esta skill adota inspirada nela. As regras em (b) são interpretação — não atribua a elas autoria das gestoras.

## Berkshire Hathaway (Warren Buffett / Charlie Munger)

**O que declaram (fontes primárias):**
- Critérios de aquisição publicados nos relatórios anuais: poder de lucro consistente demonstrado (projeções futuras e turnarounds não interessam), bons retornos sobre o patrimônio com pouca ou nenhuma dívida, gestão já instalada, negócios simples e preço conhecido. Fonte: https://berkshirehathaway.com/1996ar/acq.html
- "Owner's Manual": princípios econômicos do dono, incluindo a definição de valor intrínseco e o teste de lucros retidos (princípio 9: cada dólar retido deve gerar ao menos um dólar de valor de mercado). Fontes: https://berkshirehathaway.com/1996ar/1996.html ; https://rationalwalk.com/berkshire-hathaways-retained-earnings/
- "Owner earnings" (carta de 1986): lucro líquido + depreciação/amortização e outros não-caixa − capex de manutenção necessário para manter posição competitiva e volume.

**Regras que a skill adota:**
- Filtro de círculo de competência na triagem (etapa 0).
- Valuation ancorado em owner earnings, não em EBITDA.
- Teste do dólar retido: crescimento do valor de mercado (ou do valor contábil ajustado) vs. lucros retidos acumulados em 5–10 anos.
- Preferência por baixa alavancagem; dívida alta reduz a nota de qualidade.
- Para negócios de qualidade A, a saída é guiada por quebra de tese ou TIR implícita muito baixa, não por "preço-alvo atingido" — o custo de vender uma franquia excepcional costuma ser maior que o de mantê-la um pouco cara.

## Dynamo (Rio de Janeiro, desde 1993)

**O que declaram:**
- Fundada em 1993, com filosofia baseada em análise fundamentalista, com pesquisa profunda sobre as companhias e o ambiente em que estão inseridas, buscando retornos consistentes no médio e longo prazo. Fonte: Formulário de Referência CVM — https://www.dynamo.com.br/wp-content/uploads/2026/04/DVC-Formulario_Referencia-CVM-2025.pdf
- Horizonte de médio e longo prazo, sem se comparar a benchmark específico. Fonte: https://dynamo.com.br/pt/performance
- As Cartas Dynamo discutem com frequência instituições, qualidade de regras e ambiente de negócios no Brasil. Fonte: https://www.dynamo.com.br/pt/biblioteca?page=2
- Relatos de terceiros (fonte secundária, não oficial) atribuem ao sócio Pedro Damasceno a ênfase em debate intenso dentro do time ao apresentar ideias. Fonte: https://medium.com/unifei-finance-itabira/melhores-decis%C3%B5es-emergem-da-integra%C3%A7%C3%A3o-das-ideias-2ad6b3e86c1a

**Regras que a skill adota:**
- Analisar a empresa E o ambiente: regulação, instituições, ciclo do país, relação com o Estado (crítico para estatais e setores regulados no Brasil).
- Horizonte de 5–10 anos nas projeções; ignorar ruído trimestral salvo quando muda a tese.
- Etapa de comitê/red team obrigatória antes do veredito.
- Governança e alinhamento do controlador pesam tanto quanto margem.

## Squadra Investimentos (Rio de Janeiro)

**O que é documentado publicamente:**
- Em fevereiro de 2020 publicou tese vendida em IRB Brasil, argumentando que os lucros normalizados (recorrentes) eram significativamente inferiores aos contábeis; a posição vinha sendo construída desde maio de 2018. Fontes: carta aos cotistas — https://www.squadrainvest.com.br/wp-content/uploads/2022/09/carta-2019.pdf ; relatório — https://www.squadrainvest.com.br/wp-content/uploads/2022/09/relatorio-2019.pdf
- Segundo entrevista do fundador (InfoMoney, jan/2021), a gestora opera com intensidade de análise micro, com cerca de 25 analistas cobrindo um universo de ~130 ações. Fonte: https://www.infomoney.com.br/onde-investir/conhecido-por-des

