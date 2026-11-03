---
title: "Analisador modular de empresas para investimento"
date: 2026-09-24
updated: 2026-09-25
source: "claude-chat"
source_id: "611aea54-e044-4eeb-97d7-158d32f9c593"
url: "https://claude.ai/chat/611aea54-e044-4eeb-97d7-158d32f9c593"
project: null
messages: 10
tags: ["claude", "conversa"]
---
# Analisador modular de empresas para investimento

> **Resumo:** **Conversation overview**

The person is building a professional-grade investment analysis system using Claude skills. The conversation focused on two major skill construction projects: a traditional company analyzer inspired by Berkshire Hathaway, Dynamo, and Squadra Investimentos, and a technology company analyzer inspired by Peter Thiel, Chamath Palihapitiya, Andreessen Horowitz (a16z), and David Sacks. Both skills were fully built, packaged, and the person requested the complete file contents displayed in the chat for review.

The analisador-empresas skill covers eight pipeline stages: triaging, strategic thesis (moat with numerical evidence, sector, environment), financial thesis (owner earnings, ROIC, forensic quality checklist of ten items, sector-specific metrics for banks, utilities, shoppings, and commodities), executive and governance evaluation (promises-vs-delivery scorecards, capital allocation, incentives, controlling shareholder governance), perspectives and risks (bear/base/bull scenarios with probabilities, pre-mortem, revision triggers), valuation (DCF by scenarios, reverse DCF, implied IRR, entry and exit price bands by quality grade), mandatory red team, and a standardized report. It includes a Python script (`valuation.py`) using bisection to compute scenario DCFs, reverse DCF, implied IRR, safety margins by quality grade (A: 20–25%, B: 30–35%, C: 40–50%), and a sensitivity table. The inspiration sources are kept strictly separated from the operational rules the skill adopts, with explicit sourcing for each claim and clear notation where source access was limited.

The analisador-tech skill was built as a distinct system rather than an adaptation, with three explicit justifications: value lies far in the future (Thiel's PayPal example: ~75% of present value from post-2011 cash flows), results follow a power law requiring an explicit failure scenario with probability, and stock-based compensation (SBC) is always treated as a cost. The skill incorporates Thiel's seven-question scorecard (engineering, timing, monopoly, people, distribution, durability, secret; scored 0–2 each, max 14), a16z's metrics checklist against common distortions (ARR vs. run rate, GMV vs. revenue, blended vs. paid CAC), Chamath's growth accounting and cohort framework (quick ratio decomposition, cohort retention curves), and Sacks's burn multiple thresholds (under 1x excellent through over 3x poor, adjusted for gross margin and NRR). The Python script (`valuation_tech.py`) models revenue with linear growth fade, margin ramp to target FCF margin after SBC, fixed-value failure scenarios, reverse DCF on both growth and margin dimensions, implied IRR, opcionalidade alert when failure probability exceeds 25%, and a sensitivity table varying rate and target margin. The person reviewed all file contents across both skills in full, and Claude identified several bugs and inconsistencies during review (bisection boundary behavior, label mismatch between script and SKILL.md, undocumented `margem_override` parameter in the first skill; `anos_fade: 1` edge case and failure-scenario detection logic in the second).

The person communicates with high technical precision, expects code that is tested and explained, wants all claims attributed to primary sources with explicit separation between what sources actually say and what the skill operationalizes as interpretation, and wants known limitations and unverified references flagged explicitly rather than omitted. The person requested the full text of all files opened directly in the chat rather than summarized, indicating a preference for complete transparency over condensed output.

**Mensagens:** 10 · **Criada:** 2026-09-24 · **Atualizada:** 2026-09-25

---

## 👤 Usuário · 2026-09-24 12:40

Construa as skills para um analisador de empresas para investimentoe que pesquise com profundidade a tese estratégica e financeira das empresas, o histórico de entrega dos executivos e as perpactivas de futuro, recomendando ou nao o investimento nessas ações, dizendo claramente o patamar de preço de entrada e de saída corretos.  O modelo deve ser inspirado nos modelos usados pelas casas de investimento Berkshire Hathaway, na Dynamo e na Squadra

## 🤖 Claude · 2026-09-24 12:44


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Montei como **uma skill modular** em vez de seis skills soltas. Assim ela é acionada por um pedido só ("analisa WEGE3") e percorre todas as etapas em ordem, sem depender de você lembrar qual skill chamar. O arquivo está abaixo; é só clicar em "Save skill" para instalar.

**Como funciona (pipeline de 8 etapas):**
- **0. Triagem:** checa o círculo de competência e o conflito de interesse. Ex.: se você analisar ALOS3, ela lembra que só vale informação pública e cita as regras da CVM 44.
- **1. Tese estratégica:** moat com evidência numérica e ambiente regulatório/institucional. Termina com nota de qualidade A/B/C/D.
- **2. Tese financeira:** 5–10 anos de owner earnings, ROIC, teste do dólar retido e sustentabilidade de dividendos. Inclui um checklist forense de 10 itens sobre qualidade do lucro, com métricas específicas para bancos, seguradoras, elétricas e shoppings.
- **3. Executivos:** placar "prometido vs. entregue" com fonte para cada linha, placar de alocação de capital (aquisições, recompras, emissões), incentivos e governança do controlador.
- **4. Perspectivas:** cenários bear/base/bull com probabilidades, pre-mortem e gatilhos objetivos de venda.
- **5. Valuation:** um script Python calcula o DCF por cenário, o DCF reverso, a TIR implícita e as faixas de entrada e saída. Testei com dados fictícios e funcionou.
- **6. Red team:** escreve o melhor argumento de um vendido contra a própria tese antes de concluir.
- **7. Relatório:** formato fixo que abre com a recomendação e os preços e fecha com "o que eu não sei" e a nota de confiança. Também tem modo Obsidian.

**O que veio de cada casa:**
- **Berkshire:** os critérios de aquisição publicados pedem poder de lucro consistente, bom retorno sobre o patrimônio com pouca dívida, gestão já instalada e negócio simples ([berkshirehathaway.com](https://berkshirehathaway.com/1996ar/acq.html)). Daí vieram o owner earnings e o teste do dólar retido.
- **Dynamo:** o próprio Formulário de Referência descreve análise fundamentalista com pesquisa profunda sobre as companhias e o ambiente em que atuam, com horizonte de médio e longo prazo ([Dynamo/CVM](https://www.dynamo.com.br/wp-content/uploads/2026/04/DVC-Formulario_Referencia-CVM-2025.pdf)).
- **Squadra:** na tese vendida contra o IRB, a gestora argumentou que o lucro recorrente era bem menor que o contábil ([carta Squadra](https://www.squadrainvest.com.br/wp-content/uploads/2022/09/carta-2019.pdf)). Daí vieram o módulo forense e o red team.

**Onde fui além das fontes:**
- As margens de segurança (A: 20–25%, B: 30–35%, C: 40–50%) e as regras de saída são **convenção minha**, inspirada no conceito de margem de segurança. Nenhuma das três casas publica essas faixas.
- A taxa mínima padrão (NTN-B longa + 5 p.p.) também é premissa minha. O script deixa isso explícito e ajustável.
- Não achei documentação pública detalhada do processo interno da Dynamo e da Squadra. O que está na skill é inspiração a partir do que publicam, não uma réplica do método delas. A skill separa isso nas referências para não atribuir às gestoras regras que são nossas.

**Próximo passo sugerido:** rodar a skill numa ação que você conhece bem, como ITSA4 ou TAEE11. Você consegue julgar se o resultado faz sentido e aí calibramos as margens e o formato.

**Confiança: 7/10.** A estrutura e o script estão testados e as caracterizações das casas têm fonte. O ponto mais fraco é que ela ainda não rodou numa análise real, e a qualidade vai depender muito da disponibilidade de dados de RI/CVM na busca web. Só um teste mostra isso.

- 📎 analisador-empresas.skill

## 👤 Usuário · 2026-09-24 23:56

Abra o texto da skill aqui

## 🤖 Claude · 2026-09-24 23:57


```
This block is not supported on your current device yet.
```

Este é o texto completo do arquivo principal (`SKILL.md`):

````markdown
---
name: analisador-empresas
description: "Analisa ações para investimento com profundidade de gestora fundamentalista (inspirado em Berkshire Hathaway, Dynamo e Squadra) e entrega recomendação clara (comprar, acumular, manter, reduzir, vender ou fora do círculo de competência) com faixa de preço de ENTRADA e de SAÍDA. Cobre tese estratégica (moat, setor, posicionamento), tese financeira (ROIC, owner earnings, qualidade do lucro, balanço, dividendos), histórico de entrega dos executivos (guidance vs. realizado, alocação de capital, incentivos, governança do controlador) e perspectivas (cenários, riscos, pre-mortem). Use SEMPRE que o usuário pedir para analisar uma ação, empresa listada, ticker (ex.: ITSA4, WEGE3, AAPL), tese de investimento, valuation, preço-alvo, preço teto, \"vale a pena comprar\", \"está cara ou barata\", \"quando vender\", revisão de tese ou comparação entre empresas para investir — mesmo que ele não use a palavra \"análise\"."
---

# Analisador de Empresas

Você atua como analista sênior de uma gestora fundamentalista de longo prazo. O produto final é uma **decisão de capital**, não um resumo de notícias: recomendação explícita, preço de entrada, preço de saída e as condições que invalidam a tese.

## Princípios (por que o processo é assim)

1. **Negócio antes do preço, preço antes da decisão.** Uma empresa ótima comprada cara pode ser um investimento ruim; uma empresa ruim barata costuma continuar ruim. Avalie qualidade primeiro, depois preço.
2. **Círculo de competência.** Se não dá para explicar como a empresa ganha dinheiro daqui a 10 anos, a resposta honesta é "FORA DO CÍRCULO" — isso é uma recomendação válida, não uma falha.
3. **Lucro normalizado > lucro contábil.** O lucro reportado pode conter não-recorrentes, mudanças de premissa e agressividade contábil. Reconstrua o lucro recorrente e a geração de caixa do dono antes de valorar.
4. **Executivos se julgam pelo que entregaram, não pelo que prometem.** Compare guidance e planos passados com o realizado.
5. **Tese com prova de estresse.** Toda tese passa por um advogado do diabo e por um pre-mortem antes de virar recomendação.
6. **Honestidade sobre incerteza.** Nunca invente número. Todo dado tem fonte e data. Se não achou, escreva "não encontrei" e explique o impacto na conclusão.

As bases de cada casa e como viram regras operacionais estão em `references/filosofias.md` — leia na primeira análise da conversa.

## Fluxo de trabalho

Execute as etapas em ordem. Cada etapa tem um módulo de referência com checklists; leia o módulo antes de executar a etapa.

| Etapa | O que responder | Módulo |
|---|---|---|
| 0. Triagem | Dá para analisar? Há conflito de interesse? Qual o universo de dados? | abaixo |
| 1. Tese estratégica | Como ganha dinheiro, por que isso dura, quem pode destruir | `references/tese-estrategica.md` |
| 2. Tese financeira | Quanto ganha de verdade, quanto reinveste, a que retorno, qual o risco de balanço | `references/tese-financeira.md` |
| 3. Executivos e governança | Entregam o que prometem? Alocam bem capital? Estão alinhados ao minoritário? | `references/executivos-governanca.md` |
| 4. Perspectivas e riscos | Cenários bear/base/bull com probabilidades; pre-mortem; gatilhos | `references/perspectivas-riscos.md` |
| 5. Valuation e preços | Valor intrínseco, margem de segurança, entrada, saída, TIR implícita | `references/valuation-precos.md` + `scripts/valuation.py` |
| 6. Comitê (red team) | O melhor argumento contra a tese, e a resposta a ele | abaixo |
| 7. Relatório | Recomendação no formato padrão | abaixo |

### Etapa 0 — Triagem

- Identifique ticker, classe da ação (ON/PN/Unit), moeda e bolsa. Para B3, confira liquidez e free float.
- **Conflito de interesse:** se o usuário trabalha na empresa, em controlada/coligada ou tem acesso a informação não pública, avise que a análise deve usar apenas informação pública e que existem regras de vedação à negociação (no Brasil, Resolução CVM 44). Não use informação privilegiada.
- **Círculo de competência:** se o negócio depende de variáveis que ninguém consegue projetar com razoável confiança (ex.: biotech pré-receita, mineração junior sem reservas certificadas), diga isso cedo e ofereça uma análise de opcionalidade em vez de valuation com falsa precisão.
- Setores com contabilidade própria (bancos, seguradoras, resseguradoras, elétricas reguladas, REITs/FIIs, shoppings): use as métricas específicas descritas em `references/tese-financeira.md`.

### Pesquisa: fontes e hierarquia

Pesquise de verdade — use web search e web fetch várias vezes (uma análise completa costuma exigir 15–30 buscas). Hierarquia de confiança:

1. **Primárias:** DFP/ITR e Formulário de Referência (CVM/RAD), site de RI, releases, transcrições de teleconferência, fatos relevantes, 10-K/10-Q/proxy (SEC), cartas anuais do CEO.
2. **Reguladores e dados oficiais:** CVM, BCB, ANEEL, ANS, SUSEP, IBGE, SEC, Fed.
3. **Imprensa de negócios reconhecida:** Valor, Pipeline, Brazil Journal, InfoMoney, Estadão, Reuters, Bloomberg, FT, WSJ.
4. **Research de terceiros e cartas de gestoras:** úteis para perspectivas, nunca como fonte única de número.

Evite fóruns, influenciadores e comentaristas de TV sem dados verificáveis (não cite Jim Cramer). Registre para cada número: valor, período, fonte e data de acesso. Se duas fontes divergem, mostre as duas.

### Etapa 6 — Comitê (red team)

Antes de concluir, escreva o **melhor argumento de um vendido** contra a tese (no estilo de um relatório short: onde o lucro pode estar inflado, onde o moat pode ser mais fraco, onde a gestão pode estar errando). Depois responda a ele com evidências. Se não conseguir refutar um ponto, ele vira risco-chave ou reduz a margem de segurança. Isso existe porque viés de confirmação é o erro mais caro em análise.

### Etapa 7 — Relatório (formato padrão)

Use este template. Prosa direta, tabelas onde há números. Todo número com fonte (link) e data.

```
# [Empresa] ([TICKER]) — [RECOMENDAÇÃO]
Data da análise | Preço de referência (fonte, data) | Moeda

## Veredito em 5 linhas
- Recomendação: COMPRAR | ACUMULAR ABAIXO DE R$X | MANTER | REDUZIR | VENDER | FORA DO CÍRCULO
- Faixa de ENTRADA: até R$X (margem de segurança Y% sobre valor base)
- Faixa de SAÍDA: acima de R$Z (ou gatilho de tese — ver abaixo)
- Valor intrínseco (bear / base / bull): R$A / R$B / R$C | ponderado: R$D
- TIR real implícita ao preço atual: W% a.a. vs. taxa mínima de K%

## 1. Tese em uma frase (e o que o mercado está precificando — DCF reverso)
## 2. Qualidade do negócio (nota A/B/C/D + justificativa)
## 3. Tese financeira (tabela 5–10 anos: receita, EBIT, lucro normalizado, FCF do dono, ROIC, dívida líquida/EBITDA, payout)
## 4. Executivos: histórico de entrega (tabela guidance vs. realizado; placar de alocação de capital)
## 5. Perspectivas: cenários com probabilidades e premissas
## 6. Red team: melhor argumento contra e resposta
## 7. Riscos-chave e gatilhos de revisão (o que me faria vender mesmo abaixo do preço de saída)
## 8. O que eu não sei (lacunas de dados e seu impacto)
## Fontes
## Confiança: N/10 (sinalizar ⚠️ se < 7, explicando por quê)
```

Regras do veredito:
- A recomendação decorre dos números: se preço atual ≤ entrada → COMPRAR; entre entrada e valor base → ACUMULAR ABAIXO DE (entrada) ou MANTER para quem já tem; entre valor base e saída → MANTER/REDUZIR; ≥ saída → VENDER. Qualidade D ou tese quebrada → VENDER/EVITAR independentemente do preço.
- Não suavize. Se a conclusão é "não investir", diga isso na primeira linha.
- Deixe claro que é uma análise, não recomendação de investidor profissional registrado, em uma frase no rodapé — sem ladainha.

## Formatos alternativos

- **"formato para obsidian"**: frontmatter YAML (tipo: analise-acao, área, status, criado, tags, aliases com o ticker), `[[wikilinks]]` em conceitos (ex.: [[Owner Earnings]], [[Margem de Segurança]], [[Nome da Empresa]]), callouts (`>[!info]`, `>[!warning]` para riscos, `>[!success]` para veredito), checkboxes para gatilhos de revisão, bloco Dataview no final, nota de uso e nota de confiança.
- **Comparação entre empresas**: rode as etapas 1–5 de forma resumida para cada uma e termine com uma tabela ranqueando por (qualidade, TIR implícita, margem de segurança, risco).
- **Revisão de tese existente**: foque no que mudou desde a última análise (resultados, guidance, preço) e se algum gatilho de revisão foi acionado.

## Cálculos

Use `scripts/valuation.py` para DCF por cenários, DCF reverso, TIR implícita e faixas de entrada/saída — isso evita erro aritmético e deixa as premissas explícitas. Uso em `references/valuation-precos.md`. Sempre mostre as premissas ao usuário em tabela; um preço-alvo sem premissa visível não vale nada.
````

Esse é só o arquivo principal. A skill tem mais seis arquivos: cinco módulos em `references/` (filosofias, tese estratégica, tese financeira, executivos e governança, perspectivas e riscos, valuation) e o script `valuation.py`. Posso abrir qualquer um deles aqui.

**Confiança: 10/10.** O texto acima é a cópia exata do arquivo empacotado.

## 👤 Usuário · 2026-09-25 00:09

Traga aqui cita references/*.md e scripts/valuation.py

## 🤖 Claude · 2026-09-25 00:10


```
This block is not supported on your current device yet.
```

Seguem os arquivos exatamente como estão no pacote.

### references/filosofias.md
````markdown
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
- Segundo entrevista do fundador (InfoMoney, jan/2021), a gestora opera com intensidade de análise micro, com cerca de 25 analistas cobrindo um universo de ~130 ações. Fonte: https://www.infomoney.com.br/onde-investir/conhecido-por-desmascarar-numeros-do-irb-ache-da-squadra-conta-por-que-ve-bancoes-hoje-em-situacao-fragil/
- O caso gerou disputa (a IRB acusou a gestora perante a CVM). Fonte: https://www.jusbrasil.com.br/artigos/irb-brasil-x-squadra-investimentos-uma-analise-de-caso/1114544906 — lembrete de que análise forense deve ser rigorosa e baseada só em informação pública.

**Regras que a skill adota:**
- Módulo forense de qualidade do lucro obrigatório (ver tese-financeira.md): reconstruir lucro recorrente, conferir conversão de caixa, comparar rentabilidade com pares — rentabilidade muito acima dos pares sem explicação estrutural é bandeira vermelha.
- Pensar como vendido: a etapa de red team escreve o melhor relatório short possível contra a própria tese.
- Profundidade em poucos nomes: melhor uma análise completa que várias superficiais.
````

### references/tese-estrategica.md
````markdown
# Módulo 1 — Tese estratégica

Objetivo: explicar como a empresa ganha dinheiro, por que isso deve durar e o que pode destruir isso. Termine com nota de qualidade A/B/C/D.

## Checklist de pesquisa
1. **Modelo de negócio:** receita por segmento, geografia, cliente; quem paga, por quê, com que frequência. Unit economics quando existirem.
2. **Setor:** tamanho, crescimento, ciclicidade, estrutura (concentração, poder de fornecedores/clientes, substitutos, entrantes). Quem captura o lucro da cadeia?
3. **Vantagem competitiva (moat)** — identifique qual e busque evidência numérica, não adjetivo:
   - Custo de troca (retenção, churn, contratos longos)
   - Efeito de rede (valor cresce com usuários; share que se consolida)
   - Ativos intangíveis (marca com poder de preço — preço acima da inflação sem perda de volume; patentes; licenças/concessões)
   - Vantagem de custo (escala, localização, processo — margem estruturalmente acima dos pares)
   - Escala eficiente (mercado que só comporta poucos players)
   Evidência mínima: ROIC acima do custo de capital sustentado por 5–10 anos, margens estáveis ou crescentes, market share estável ou crescente.
4. **Ameaças:** disrupção tecnológica, desintermediação, regulação, dependência de cliente/fornecedor, dependência do Estado (tarifas, subsídios, crédito direcionado).
5. **Ambiente (lente Dynamo):** risco regulatório e institucional, câmbio, juros, ciclo doméstico. Para estatais: histórico de interferência política em preço, dividendos e investimento.
6. **Reinvestimento:** a empresa tem onde reinvestir a retornos altos (pista de crescimento) ou é madura e deve distribuir? Isso define se o valor vem de crescimento ou de dividendos.

## Nota de qualidade
- **A:** moat claro com evidência numérica, ROIC alto e estável, baixa alavancagem, pista de reinvestimento, gestão alinhada.
- **B:** bom negócio com uma fragilidade relevante (ciclicidade, regulação, alavancagem moderada, moat estreito).
- **C:** negócio commoditizado ou muito cíclico; retorno ≈ custo de capital; só interessa com desconto grande.
- **D:** destrói valor (ROIC < custo de capital de forma estrutural), governança ruim ou contabilidade duvidosa. Evitar.

A nota define a margem de segurança exigida no módulo de valuation.
````

### references/tese-financeira.md
````markdown
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
````

### references/executivos-governanca.md
````markdown
# Módulo 3 — Executivos e governança

Objetivo: julgar a gestão pelo que entregou. Uma boa história com histórico ruim de entrega é um sinal de venda.

## 3.1 Placar de promessas (guidance vs. realizado)
Monte uma tabela com 5–10 promessas dos últimos 3–7 anos, buscando em releases, apresentações de Investor Day, teleconferências e cartas do CEO:

| Ano | Quem prometeu | O que prometeu (métrica, prazo) | Fonte | O que entregou | Fonte | Status |
|---|---|---|---|---|---|---|

Status: Entregou / Entregou parcialmente / Não entregou / Mudou a métrica sem explicar. **Trocar a métrica prometida sem explicação é pior que errar.** Calcule a taxa de entrega.

## 3.2 Placar de alocação de capital
Para cada grande decisão dos últimos 10 anos:
- **Aquisições:** preço pago (múltiplo), sinergias prometidas vs. realizadas, ROIC da aquisição após 3 anos, impairments posteriores.
- **Recompras:** a que preço vs. valor intrínseco estimado; recomprar caro destrói valor.
- **Emissões de ações:** a que preço; emitir barato para financiar aquisição cara é bandeira vermelha dupla.
- **Dividendos vs. reinvestimento:** coerente com a pista de crescimento?
- **Capex de expansão:** retorno obtido vs. prometido.

## 3.3 Pessoas
Tempo de casa do CEO/CFO, rotatividade da alta gestão (especialmente CFO), trajetória anterior (entregaram em outras empresas?), sucessão planejada, franqueza nas comunicações (reconhecem erros? — Buffett valoriza post-mortems honestos).

## 3.4 Incentivos e alinhamento (Formulário de Referência, seção de remuneração / proxy statement)
- Remuneração variável atrelada a quê? Lucro por ação e receita incentivam crescimento a qualquer custo; ROIC, FCF por ação e TSR de longo prazo alinham melhor.
- Executivos têm ações relevantes compradas com dinheiro próprio? Compras e vendas de insiders nos últimos 24 meses (CVM: formulário de negociação de administradores; EUA: Form 4).
- Diluição anual por planos de opções/ações.

## 3.5 Governança do controlador (crítico no Brasil)
Estrutura de controle (controlador definido, corporation, estatal, familiar), segmento de listagem (Novo Mercado, N1, N2, tradicional), tag along, diferença ON/PN, conselheiros independentes, transações com partes relacionadas, histórico de tratamento do minoritário (OPAs, incorporações, reorganizações), acordos de acionistas. Para estatais: histórico de interferência política e mudança de política de dividendos.

## Saída do módulo
Nota de gestão: **Excelente / Boa / Neutra / Ruim**, com as 3 evidências mais fortes. Gestão Ruim limita a nota de qualidade do negócio a no máximo C.
````

### references/perspectivas-riscos.md
````markdown
# Módulo 4 — Perspectivas e riscos

## 4.1 Cenários (bear / base / bull)
Para cada cenário defina premissas explícitas em tabela: crescimento de receita (5 e 10 anos), margem EBIT de chegada, reinvestimento (% do NOPAT) ou ROIC incremental, múltiplo ou crescimento na perpetuidade, e a narrativa que justifica cada número. Atribua probabilidades que somem 100%. O cenário base NÃO é o guidance da empresa — é sua melhor estimativa independente.

Regra de sanidade: o cenário bull não pode exigir margem ou share acima do melhor par global sem justificativa; o bear deve incluir o que aconteceu na pior crise da história da empresa.

## 4.2 Catalisadores e horizonte
Eventos que podem destravar ou destruir valor em 1–3 anos: revisão tarifária, fim de ciclo de capex, desalavancagem, venda de ativo, mudança regulatória, eleição, entrada de concorrente.

## 4.3 Pre-mortem
"Estamos em [data + 3 anos] e este investimento perdeu 50%. Por quê?" Liste as 3–5 causas mais plausíveis e a probabilidade de cada. Elas viram os gatilhos de revisão.

## 4.4 Gatilhos de revisão (vão no relatório como checkboxes)
Condições objetivas e observáveis que invalidam a tese e mandam vender mesmo abaixo do preço de saída. Ex.: "ROIC abaixo de X% por 2 anos", "dívida líquida/EBITDA acima de Y", "saída do CEO/CFO sem sucessor", "mudança da política de dividendos", "bandeira vermelha contábil confirmada".

## 4.5 Consenso vs. visão própria
Busque o consenso de mercado (projeções de analistas, preço-alvo médio) e explique onde e por que sua visão difere. Se não difere em nada, a vantagem da tese é pequena — diga isso.
````

### references/valuation-precos.md
````markdown
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
````

### scripts/valuation.py
```python
#!/usr/bin/env python3
"""Valuation por cenários (owner earnings / FCF), DCF reverso, TIR implícita e faixas de preço.

Uso: python valuation.py --config premissas.json
Todos os valores monetários na mesma moeda e base (reais ou nominais) da taxa.
"""
import argparse
import json
import sys

MARGENS = {"A": 0.225, "B": 0.325, "C": 0.45}


def dcf(oe0, r, g1, g2, gt, anos1=5, anos2=5):
    if r <= gt:
        raise ValueError(f"taxa ({r:.2%}) deve ser maior que o crescimento na perpetuidade ({gt:.2%})")
    pv, oe = 0.0, oe0
    n = anos1 + anos2
    for t in range(1, n + 1):
        oe *= 1 + (g1 if t <= anos1 else g2)
        pv += oe / (1 + r) ** t
    tv = oe * (1 + gt) / (r - gt)
    return pv + tv / (1 + r) ** n


def valor_por_acao(cfg, cen, r):
    v = dcf(cfg["owner_earnings_base"], r, cen["g1"], cen["g2"], cen["gt"])
    if cfg.get("fluxo_tipo", "acionista") == "firma":
        v -= cfg.get("divida_liquida", 0.0)
    return v / cfg["acoes"]


def ponderado(cfg, r):
    return sum(c["prob"] * valor_por_acao(cfg, c, r) for c in cfg["cenarios"].values())


def bissecao(f, lo, hi, it=200):
    flo = f(lo)
    for _ in range(it):
        mid = (lo + hi) / 2
        fm = f(mid)
        if (fm > 0) == (flo > 0):
            lo, flo = mid, fm
        else:
            hi = mid
    return (lo + hi) / 2


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", required=True)
    cfg = json.load(open(ap.parse_args().config, encoding="utf-8"))

    probs = sum(c["prob"] for c in cfg["cenarios"].values())
    if abs(probs - 1) > 1e-6:
        sys.exit(f"Probabilidades somam {probs:.2f}; devem somar 1.")

    r, preco, nota = cfg["taxa"], cfg["preco_atual"], cfg["nota_qualidade"].upper()
    print(f"== {cfg.get('empresa', '')} | preço atual {preco:,.2f} | taxa {r:.2%} | nota {nota}\n")

    valores = {}
    for nome, c in cfg["cenarios"].items():
        valores[nome] = valor_por_acao(cfg, c, r)
        print(f"{nome:>6}: {valores[nome]:>10,.2f}  (prob {c['prob']:.0%}, g1 {c['g1']:.1%}, g2 {c['g2']:.1%}, gt {c['gt']:.1%})")
    base_pond = ponderado(cfg, r)
    print(f"Ponderado: {base_pond:,.2f}  | upside/downside vs. preço: {base_pond / preco - 1:+.1%}\n")

    # DCF reverso: crescimento constante 10 anos que justifica o preço (gt do cenário base)
    base = cfg["cenarios"].get("base", list(cfg["cenarios"].values())[0])
    f_rev = lambda g: valor_por_acao(cfg, {"g1": g, "g2": g, "gt": base["gt"]}, r) - preco
    try:
        g_imp = bissecao(f_rev, -0.5, 1.0)
        print(f"DCF reverso: o preço embute crescimento de {g_imp:.2%} a.a. por 10 anos (perpetuidade {base['gt']:.1%})")
    except Exception as e:
        print(f"DCF reverso não convergiu: {e}")

    # TIR implícita
    gt_max = max(c["gt"] for c in cfg["cenarios"].values())
    try:
        tir = bissecao(lambda x: ponderado(cfg, x) - preco, gt_max + 0.001, 1.0)
        print(f"TIR implícita ao preço atual: {tir:.2%} a.a. (hurdle {r:.2%})\n")
    except Exception as e:
        tir = None
        print(f"TIR não convergiu: {e}\n")

    if nota == "D":
        print("Nota D: não investir, independentemente do preço.")
        return
    m = cfg.get("margem_override", MARGENS[nota])
    entrada = base_pond * (1 - m)
    if nota == "A":
        saida = valores.get("bull", base_pond * 1.3)
        regra = "preço > valor bull OU TIR < hurdle − 2 p.p."
        vender = preco > saida or (tir is not None and tir < r - 0.02)
    elif nota == "B":
        saida = base_pond * 1.15
        regra = "preço > valor ponderado × 1,15 OU TIR < hurdle"
        vender = preco > saida or (tir is not None and tir < r)
    else:
        saida = base_pond
        regra = "preço ≥ valor ponderado"
        vender = preco >= saida

    print(f"Margem de segurança: {m:.0%}")
    print(f"PREÇO DE ENTRADA (teto de compra): {entrada:,.2f}")
    print(f"Zona de acumulação: {entrada:,.2f} – {base_pond:,.2f}")
    print(f"PREÇO DE SAÍDA: {saida:,.2f}  ({regra})")

    if vender:
        rec = "VENDER / REDUZIR"
    elif preco <= entrada:
        rec = "COMPRAR"
    elif preco <= base_pond:
        rec = f"ACUMULAR ABAIXO DE {entrada:,.2f} / MANTER"
    else:
        rec = "MANTER (sem novas compras)"
    print(f"\nRecomendação mecânica: {rec}")
    print("(Confrontar com gatilhos qualitativos, governança e red team antes do veredito.)\n")

    # Sensibilidade
    print("Sensibilidade do valor ponderado por ação (linhas: taxa; colunas: Δ gt):")
    deltas = [-0.01, 0.0, 0.01]
    print("        " + "".join(f"{d:+.1%}".rjust(12) for d in deltas))
    for dr in [-0.01, 0.0, 0.01]:
        linha = []
        for dg in deltas:
            c2 = dict(cfg)
            c2["cenarios"] = {k: {**v, "gt": v["gt"] + dg} for k, v in cfg["cenarios"].items()}
            try:
                linha.append(f"{ponderado(c2, r + dr):,.2f}".rjust(12))
            except ValueError:
                linha.append("n/a".rjust(12))
        print(f"{r + dr:>7.2%} " + "".join(linha))


if __name__ == "__main__":
    main()
```

### scripts/exemplo_premissas.json
```json
{
  "empresa": "EXEMPLO FICTÍCIO S.A. (EXMP3)",
  "_nota": "Números fictícios apenas para ilustrar o formato. Taxa real (NTN-B + prêmio) com fluxos em R$ reais.",
  "preco_atual": 40.0,
  "acoes": 1000000000,
  "fluxo_tipo": "acionista",
  "divida_liquida": 0,
  "owner_earnings_base": 3500000000,
  "taxa": 0.115,
  "nota_qualidade": "B",
  "cenarios": {
    "bear": {"prob": 0.25, "g1": 0.00, "g2": 0.00, "gt": 0.00},
    "base": {"prob": 0.50, "g1": 0.05, "g2": 0.03, "gt": 0.02},
    "bull": {"prob": 0.25, "g1": 0.10, "g2": 0.06, "gt": 0.03}
  }
}
```

**Três problemas que achei ao reler o código**, nenhum deles aparece no teste com dados fictícios:

1. **Bug na bisseção.** Se o preço estiver fora da faixa pesquisada (ex.: um preço que exigiria TIR acima de 100% ou crescimento implícito acima de 100% a.a.), a função não avisa. Ela devolve o limite da faixa como se fosse a resposta. O `try/except` não pega isso, porque nenhum erro é lançado.
2. **Inconsistência de rótulos.** Entre o valor ponderado e o preço de saída, o script diz "MANTER (sem novas compras)". O SKILL.md diz "MANTER/REDUZIR" para essa faixa. Vale padronizar.
3. **Parâmetro não documentado.** O `margem_override` existe no código, mas não aparece no módulo de valuation.

Posso corrigir os três e reempacotar se quiser.

**Confiança: 9/10.** O conteúdo é a cópia exata dos arquivos. Não dou 10 porque a revisão do código foi só leitura, sem testes de casos extremos além do que descrevi.

## 👤 Usuário · 2026-09-25 01:48

Usando o mesmo racional, construa skills  para avaliação de empresas de tecnologia, considerando Peter Thiel, Chamath Palihapatia, Andrew Horrowitz e David Sacks

## 🤖 Claude · 2026-09-25 01:53


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Agora David Sacks e Chamath.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Criei a skill **analisador-tech**. Ela segue a mesma estrutura da primeira: triagem, 5 módulos, red team e relatório com preço de entrada e de saída.

Uma suposição antes: "Andrew Horrowitz" não bate com nenhum investidor conhecido. Tratei como **Andreessen Horowitz (a16z)**, a firma de Marc Andreessen e Ben Horowitz. Se era outra pessoa, me avise.

**Por que uma skill separada, e não uma adaptação da primeira:** o método de valor clássico falha em tech em três pontos, e cada um virou uma regra.
- **O valor está longe no tempo.** Em março de 2001, Thiel projetou que 75% do valor presente do PayPal viria de lucros de 2011 em diante. Por isso o DCF reverso é obrigatório e a durabilidade pesa mais que o lucro de hoje.
- **Os resultados seguem lei de potência.** Todo modelo tem um **cenário de fracasso** com probabilidade explícita. Se essa probabilidade passa de 25%, a recomendação máxima vira "posição de opcionalidade" (posição pequena).
- **SBC é custo, sempre.** O script desconta a remuneração em ações da margem de fluxo de caixa livre.

**O que veio de cada um:**
- **Thiel:** placar das 7 perguntas, com nota de 0 a 2 cada. São elas: engenharia, timing, monopólio, pessoas, distribuição, durabilidade (posição defensável em 10 e 20 anos) e segredo (oportunidade que outros não veem).
- **a16z:** "mercado antes de time" e o checklist das 16+16 métricas contra definições enganosas. Andreessen define PMF como estar em um bom mercado com um produto que o satisfaça, e credita a ideia a Rachleff. Também entra o diagnóstico de CEO em tempo de paz ou de guerra, post de Ben Horowitz de abril de 2011.
- **Chamath:** growth accounting e análise de coortes. O "8-ball" da Social Capital combina growth accounting, comportamento de coortes e distribuição de product-market fit.
  - O histórico de SPACs dele entrou como lição de governança, não como método: os 6 SPACs com fusão rendiam em média −34,6% sobre o preço de US$10 em agosto de 2022.
  - Por isso, projeções de deck (SPAC, IPO, Investor Day) entram no placar "prometido vs. entregue" com ceticismo.
- **Sacks:** burn multiple obrigatório para empresas que queimam caixa. A escala dele: abaixo de 1x é excelente e acima de 3x é ruim, com 1,5–2x bom e 2–3x suspeito.
  - A skill ajusta essa faixa pela margem bruta e pela NRR, porque a conta pressupõe margem bruta de 75–80% e NRR de 100% ou mais.

**Limites que você precisa saber:**
- **Onde não achei fonte primária:**
  - Não acessei o post original de Sacks; os números vêm de fontes secundárias que o reproduzem.
  - A lei de potência de Thiel está no livro, mas não tenho link verificado.
  - As referências de quick ratio > 4 e payback de CAC < 18 meses são convenção de mercado; estão marcadas como não verificadas dentro da skill.
- **O que é convenção minha:** margens de segurança de 30/40/50%, taxa mínima de Treasury + 5–8 p.p., o limite de 25% para opcionalidade e o uso de "fracasso" como cenário fixo.
- **Aplicação a ações listadas é adaptação.** Os quatro escreveram sobre startups e venture. A skill avisa isso e proíbe usar opiniões deles sobre ações específicas como evidência, já que podem ter posição ou agenda.

**Script:** testei com um SaaS fictício e com dois casos extremos (preço absurdo e fracasso com 30% de probabilidade). Esse script já tem a correção da bisseção que apontei na skill anterior: agora ele avisa quando não há solução, em vez de devolver o limite da faixa como resposta. Posso aplicar a mesma correção no `valuation.py` do analisador-empresas.

**Confiança: 7/10.** A estrutura e o script estão testados, e os frameworks centrais têm fonte. Perco pontos pelos itens sem fonte primária listados acima e porque a skill ainda não rodou numa empresa real.

- 📎 analisador-tech.skill

## 👤 Usuário · 2026-09-25 02:29

Traga as skills abertas aqui

## 🤖 Claude · 2026-09-25 02:31


```
This block is not supported on your current device yet.
```

Seguem os arquivos da **analisador-tech** exatamente como estão no pacote. A skill anterior (analisador-empresas) já foi aberta mais acima nesta conversa.

### SKILL.md
````markdown
---
name: analisador-tech
description: "Analisa ações de empresas de tecnologia (SaaS, internet, marketplaces, fintechs, semicondutores, infraestrutura de IA) com lentes inspiradas em Peter Thiel, Chamath Palihapitiya, Andreessen Horowitz e David Sacks, e entrega recomendação clara (comprar, acumular, manter, reduzir, vender, opcionalidade ou fora do círculo) com preço de ENTRADA e de SAÍDA. Cobre monopólio e as 7 perguntas de Thiel, product-market fit, efeitos de rede, risco de disrupção por IA, growth accounting e coortes, NRR, burn multiple, SBC, histórico de entrega de fundadores e executivos, diluição, governança e cenários com probabilidade de fracasso e DCF reverso. Use SEMPRE que o usuário pedir para analisar uma empresa de tecnologia ou growth listada (ex.: NVDA, PLTR, MSFT, MELI, TOTS3), perguntar se uma tech está cara, preço justo, quando vender, se o crescimento justifica o múltiplo, ou comparar techs. Para empresas não-tech, use analisador-empresas."
---

# Analisador de Empresas de Tecnologia

Você atua como analista sênior de um fundo de crossover (público + growth) que combina a disciplina de preço de uma gestora fundamentalista com as lentes de quem constrói e financia empresas de tecnologia. O produto é uma **decisão de capital**: recomendação, preço de entrada, preço de saída e as condições que invalidam a tese.

## Por que uma skill separada para tech

O processo de valor clássico (owner earnings sobre lucro atual, margem de segurança sobre histórico) falha em tech por três motivos, e esta skill corrige cada um:
1. **O valor está longe no tempo.** Thiel relata que, em 2001, projetou que ~75% do valor presente do PayPal viria de lucros de 2011 em diante. Logo, **durabilidade** pesa mais que o lucro de hoje — e o preço atual precisa ser lido por DCF reverso.
2. **Os resultados seguem lei de potência.** Poucas empresas capturam quase todo o valor; muitas vão a zero. O modelo precisa ter um **cenário de fracasso com probabilidade explícita**, não só bear/base/bull ao redor de um centro.
3. **A contabilidade esconde o custo real.** Remuneração em ações (SBC), receita "ajustada", GMV apresentado como receita e ARR mal definido distorcem o retrato. Aqui SBC é custo, sempre.

Fontes e a separação "o que eles dizem" vs. "regra que a skill adota" estão em `references/filosofias-tech.md` — leia na primeira análise da conversa.

## Princípios

1. **Monopólio > competição.** Procure a empresa que escapou da competição (Thiel). Se o setor é uma guerra de preços entre iguais, o crescimento não vira valor para o acionista.
2. **Mercado primeiro.** Em mercado ruim, produto e time bons perdem (Andreessen, citando Rachleff). Avalie o mercado antes do time.
3. **Crescimento só vale se for eficiente e retido.** Crescimento comprado com queima alta ou que vaza em coortes ruins não é crescimento (lentes de Sacks e Chamath).
4. **Executivos se julgam pelo que entregaram**, e em tech também pelo quanto diluíram o acionista para entregar.
5. **Tese com prova de estresse:** red team e pre-mortem obrigatórios.
6. **Honestidade sobre incerteza.** Nunca invente número; toda métrica com fonte e data. Empresas de tech mudam de definição de KPI com frequência — registre a definição usada.

## Fluxo de trabalho

| Etapa | Pergunta | Módulo |
|---|---|---|
| 0. Triagem | Estágio, tipo de negócio, círculo de competência, conflito de interesse | abaixo |
| 1. Tese estratégica | Escapou da competição? Por que dura 10–20 anos? | `references/tese-estrategica-tech.md` |
| 2. Métricas e unit economics | O crescimento é real, retido e eficiente? Quanto custa de verdade? | `references/metricas-unit-economics.md` |
| 3. Fundadores e executivos | Entregam? Alocam bem? Diluem quanto? Governança? | `references/fundadores-executivos.md` |
| 4. Perspectivas e riscos | Cenários com fracasso explícito; DCF reverso; pre-mortem | `references/perspectivas-riscos-tech.md` |
| 5. Valuation e preços | Valor por cenário, TIR implícita, entrada, saída | `references/valuation-tech.md` + `scripts/valuation_tech.py` |
| 6. Red team | O melhor relatório short contra a tese | abaixo |
| 7. Relatório | Formato padrão | abaixo |

### Etapa 0 — Triagem

- Ticker, classe (inclusive dual class / super-voto), bolsa, moeda, liquidez.
- **Estágio:** (a) pré-lucro em hipercrescimento, (b) escala com lucro recente, (c) madura/geradora de caixa. O estágio muda quais métricas importam e qual método de valuation domina.
- **Tipo:** SaaS/software, marketplace, consumo/internet (anúncios), fintech, semicondutor/hardware (cíclico — use preço e margem normalizados de ciclo), infraestrutura de IA, plataforma com receita de governo. Cada tipo tem KPIs próprios no módulo 2.
- **Conflito de interesse:** se o usuário trabalha na empresa ou tem informação não pública, avise que só se usa informação pública e que há regras de vedação (Brasil: Resolução CVM 44; EUA: regras de insider trading da SEC).
- **Círculo de competência:** se o valor depende de um evento binário impossível de estimar (aprovação regulatória única, tecnologia ainda não demonstrada), diga isso e trate como **posição de opcionalidade** — tamanho pequeno, sem preço-alvo com falsa precisão.

### Pesquisa: fontes

Pesquise de verdade (análise completa: 15–30 buscas). Hierarquia:
1. **Primárias:** 10-K/10-Q/20-F/proxy (SEC), DFP/ITR/Formulário de Referência (CVM), cartas aos acionistas, transcrições de earnings calls, apresentações de Investor Day, S-1/F-1 (a seção de métricas-chave do prospecto costuma ser a melhor fonte de definições).
2. **Dados oficiais e reguladores:** SEC, CVM, FTC/DOJ, Comissão Europeia (antitruste), órgãos de controle de exportação.
3. **Imprensa de negócios:** Reuters, Bloomberg, FT, WSJ, The Information, Valor, Brazil Journal, Pipeline.
4. **Research e posts de investidores (inclusive dos quatro inspiradores):** servem para lentes e perspectivas, nunca como fonte única de número.

Evite fóruns, influenciadores e comentaristas de TV sem dados verificáveis (não cite Jim Cramer). Opiniões dos próprios Thiel, Chamath, a16z ou Sacks sobre uma ação específica **não são evidência** — eles podem ter posição, conflito ou agenda; use seus frameworks, não suas recomendações.

### Etapa 6 — Red team

Escreva o melhor argumento de um vendido: onde a receita pode estar inflada (definições de ARR, receita de partes relacionadas, acordos circulares com fornecedores/clientes), onde a SBC esconde o custo, onde o mercado é menor que o TAM vendido, onde a IA ou uma plataforma pode comoditizar o produto, onde a gestão já trocou métrica. Responda com evidência. Ponto não refutado vira risco-chave ou aumenta a margem de segurança.

### Etapa 7 — Relatório

```
# [Empresa] ([TICKER]) — [RECOMENDAÇÃO]
Data | Preço de referência (fonte, data) | Moeda | Estágio | Tipo

## Veredito em 6 linhas
- Recomendação: COMPRAR | ACUMULAR ABAIXO DE $X | MANTER | REDUZIR | VENDER | OPCIONALIDADE (posição pequena) | FORA DO CÍRCULO
- Faixa de ENTRADA: até $X (margem Y% sobre valor ponderado)
- Faixa de SAÍDA: acima de $Z (ou gatilho de tese)
- Valor por ação (fracasso / bear / base / bull): $F / $A / $B / $C | ponderado: $D
- O que o preço embute (DCF reverso): crescimento de W% a.a. e/ou margem FCF de chegada de M%
- TIR implícita ao preço atual: T% a.a. vs. taxa mínima de K%

## 1. Tese em uma frase e o "segredo" (o que sabemos que o mercado não precifica?)
## 2. Placar de Thiel (7 perguntas, 0–2 cada) e nota de qualidade A/B/C/D
## 3. Métricas: tabela de 3–5 anos (receita, crescimento, margem bruta, NRR, burn multiple ou FCF, SBC % receita, FCF após SBC, diluição, Rule of 40)
## 4. Fundadores e executivos: placar promessa vs. entrega; alocação de capital; diluição
## 5. Cenários com probabilidades (incluindo fracasso) e premissas
## 6. Red team e resposta
## 7. Riscos-chave e gatilhos de revisão (checkboxes)
## 8. O que eu não sei
## Fontes
## Confiança: N/10 (⚠️ se < 7, com o porquê)
```

Regras do veredito:
- A recomendação decorre dos números (ver módulo 5); qualidade D ou tese quebrada → VENDER/EVITAR independentemente do preço.
- Se a probabilidade de fracasso > 25%, a recomendação máxima é OPCIONALIDADE — diga o tamanho como fração da carteira que o usuário definir, não "compre".
- Não suavize. Se a resposta é "não investir", diga na primeira linha.
- Rodapé de uma frase: é uma análise, não recomendação de profissional registrado.

## Formatos alternativos
- **"formato para obsidian"**: frontmatter YAML (tipo: analise-acao-tech, área, status, criado, tags, aliases com ticker), `[[wikilinks]]` (ex.: [[Burn Multiple]], [[Product-Market Fit]], [[Lei de Potência]], [[Nome da Empresa]]), callouts (`>[!info]`, `>[!warning]`, `>[!success]`), checkboxes para gatilhos, bloco Dataview, nota de uso e nota de confiança.
- **Comparação entre techs:** etapas 1–5 resumidas para cada uma; tabela final ranqueando por placar de Thiel, eficiência (burn multiple ou Rule of 40), TIR implícita, probabilidade de fracasso e margem de segurança.
- **Revisão de tese:** o que mudou (KPIs, guidance, definição de métrica, preço) e se algum gatilho foi acionado.

## Cálculos
Use `scripts/valuation_tech.py` (modelo por receita com desaceleração do crescimento, rampa de margem FCF após SBC, cenário de fracasso, DCF reverso, TIR implícita, faixas de preço e sensibilidade). Mostre sempre as premissas em tabela.
````

### references/filosofias-tech.md
````markdown
# Filosofias de referência e como viram regras

Separação obrigatória: (a) o que cada um declarou publicamente, com fonte; (b) a regra operacional que a skill adota, que é **interpretação** — não atribua a regra ao autor.

Aviso geral: os quatro são investidores ativos com posições, fundos e, em alguns casos, papéis políticos. Use seus **frameworks**; não trate suas opiniões sobre ações específicas como evidência.

## Peter Thiel (PayPal, Palantir, Founders Fund)

**O que declarou (livro "Zero to One", 2014, com Blake Masters; baseado no curso CS183 em Stanford, 2012):**
- Sete perguntas que todo negócio deve responder: engenharia (tecnologia de ruptura vs. melhoria incremental), timing, monopólio (começar com grande fatia de mercado pequeno), pessoas, distribuição, durabilidade (posição defensável em 10 e 20 anos) e segredo (oportunidade que outros não veem). Fonte (resumo com número de página): https://davidcummings.org/2024/11/16/thiels-seven-questions-every-business-must-answer/ ; lista completa: https://grahammann.net/book-notes/zero-to-one-peter-thiel
- Distribuição: vendas e distribuição superiores podem criar monopólio mesmo sem diferenciação de produto; a causa mais comum de fracasso é venda ruim, não produto ruim. Fonte: https://grahammann.net/book-notes/zero-to-one-peter-thiel
- Valor distante: em março de 2001 projetou que 75% do valor presente do PayPal viria de lucros de 2011 em diante. Fonte (trecho do livro): https://www.goodreads.com/notes/37653154-zero-to-one/8045645-giedrius-padriezas/6a2cd10b-8e84-4f0a-ad27-4e28d4ba79e2
- Durabilidade > crescimento de curto prazo; cita Zynga e Groupon como crescimento rápido sem durabilidade. Fonte: https://www.fool.com/investing/general/2015/02/13/7-insights-for-investors-from-peter-thiels-zero-to.aspx
- Lei de potência nos retornos de venture (capítulo "Follow the Money" do livro). ⚠️ Sem link verificado nesta skill; conferir no livro.

**Regras que a skill adota:**
- Placar de Thiel: 7 perguntas, nota 0–2 cada (máx. 14). < 8 impede nota de qualidade A.
- DCF reverso obrigatório e ênfase em durabilidade: se o valor depende de fluxos após o ano 10, a pergunta decisiva é a da durabilidade.
- Cenário de fracasso com probabilidade explícita (lei de potência).
- Aplicação a ações listadas é adaptação: Thiel escreveu sobre startups.

## Andreessen Horowitz — a16z (Marc Andreessen e Ben Horowitz)

> Assumimos que "Andrew Horowitz" se refere à a16z / Ben Horowitz e Marc Andreessen.

**O que declararam:**
- Andreessen (2007): chegar ao product/market fit é a única coisa que importa; PMF é estar em um bom mercado com um produto capaz de satisfazê-lo. Credita a Andy Rachleff a ideia de que, quando time bom encontra mercado ruim, o mercado vence. Fontes: https://stanford.edu/class/ee204/ProductMarketFit.html ; https://en.wikipedia.org/wiki/Product-market_fit ; https://www.skmurphy.com/blog/2009/11/02/marc-andreessens-entrepreneurial-insights-rescued-from-bit-rot-by-jed-christiansen/
- a16z "16 Startup Metrics" (Jeff Jordan, Anu Hariharan, Frank Chen, Preethi Kasireddy, 2015): bookings vs. receita, receita recorrente vs. total, lucro bruto, TCV vs. ACV, LTV, GMV vs. receita, receita diferida e billings, CAC blended vs. pago, usuários ativos, churn, burn, truques de gráfico. E "16 more": TAM, ARR ≠ run rate anualizado, ARPU, margem bruta, efeitos de rede, viralidade, escala, NPS, coortes, concentração de clientes. Fontes: http://a16z.com/2015/08/21/16-metrics/ ; https://www.startupbusiness.it/32-metriche-della-startup-digitale-secondo-andreessen-horowitz/85457/
- Ben Horowitz (2011): CEO de tempo de paz vs. CEO de tempo de guerra — a gestão em ameaça existencial é diferente da gestão com grande vantagem em mercado crescente. Fonte: https://a16z.com/peacetime-ceo-wartime-ceo/

**Regras que a skill adota:**
- Avaliar mercado antes de time e produto.
- Checklist de definições de métricas (módulo 2) contra os "truques" que a a16z aponta.
- Diagnóstico de modo (paz/guerra) na avaliação da gestão: a gestão atual é adequada ao momento competitivo?

## Chamath Palihapitiya (Social Capital; ex-Facebook growth)

**O que é documentado:**
- Social Capital desenvolveu o "8-ball" de diligência quantitativa: growth accounting, comportamento de coortes e distribuição de product-market fit, medidos na unidade central de valor do negócio (usuários e/ou receita recorrente). Fonte (Jonathan Hsu, que construiu o método): https://medium.com/swlh/diligence-at-social-capital-epilogue-introducing-the-8-ball-and-gaap-for-startups-7ab215c378bc ; Forbes: https://www.forbes.com/sites/alexkonrad/2016/02/10/social-capital-opens-up-its-magic-8-ball-growth-hacking-tools-for-any-startup/
- Em 2018 criticou o "crescer a qualquer custo" e defendeu buscar crescimento real e sustentável. Fonte: https://fortune.com/2018/10/11/social-capital-startup-growth-ponzi-scheme
- **Histórico como emissor de SPACs (lição de governança, não de framework):** o retorno médio dos seus 6 SPACs com fusão era −34,6% sobre US$10 em ago/2022; IPOD e IPOF foram liquidados sem alvo. Fontes: https://benzinga.com/z/28540799 ; carta à SEC: https://www.sec.gov/Archives/edgar/data/1818873/000110465922101316/tm2225965d1_ex99-1.htm . Levantamento posterior (Benzinga, ago/2025) mostra perdas grandes em quase todos, com SoFi como exceção positiva: https://www.benzinga.com/markets/ipos/25/08/47213886/chamath-palihapitiya-returns-to-spacs-past-18-deals-investments-average-loss-of-14

**Regras que a skill adota:**
- Growth accounting e coortes são obrigatórios quando os dados existem: quick ratio de receita ou usuários, curvas de retenção por coorte, profundidade de engajamento.
- Projeções de deck de SPAC/IPO/Investor Day entram no placar de promessas do módulo 3 e são tratadas com ceticismo até serem entregues. O próprio histórico de SPACs de Chamath é o exemplo de por que o método pesa entrega sobre narrativa.

## David Sacks (PayPal, Yammer, Craft Ventures)

**O que declarou:**
- "The Burn Multiple" (Craft Ventures, abr/2020): burn multiple = queima líquida ÷ ARR novo líquido; mede quanto a empresa queima para gerar cada dólar incremental de ARR. Escala: < 1x excelente, 1–1,5x ótimo, 1,5–2x bom, 2–3x suspeito, > 3x ruim. Fontes secundárias que reproduzem o post: https://www.indinero.com/blog/burn-multiple-by-saas-stage ; https://www.thesaascfo.com/how-to-calculate-the-burn-multiple/ . ⚠️ Não acessei o post original nesta pesquisa.
- Limitação apontada por terceiros (SaaStr): a métrica pressupõe margem bruta de ~75–80% e NRR ≥ 100%; abaixo disso, o burn multiple aceitável é menor. Fonte: https://www.saastr.com/a-low-burn-multiple-is-great-but-it-doesnt-mean-you-wont-run-out-of-money/
- Contexto: nomeado pelo governo Trump, em dez/2024, como responsável por IA e cripto na Casa Branca. Fonte: https://www.hustlefund.vc/post/angel-squad-david-sacks-investments-the-paypal-mafia-playbook-for-saas-and-crypto — ao analisar empresas afetadas por política de IA/cripto dos EUA, trate declarações dele como sinal de política, não de valuation.

**Regras que a skill adota:**
- Burn multiple obrigatório para empresas que queimam caixa; para empresas lucrativas, usar FCF após SBC e Rule of 40.
- Ajustar a faixa aceitável pela margem bruta e pela NRR.
````

### references/tese-estrategica-tech.md
````markdown
# Módulo 1 — Tese estratégica (tech)

Objetivo: decidir se a empresa escapou da competição e se isso dura 10–20 anos. Termina com placar de Thiel e nota A/B/C/D.

## 1.1 Mercado primeiro (lente a16z)
- Qual problema, quem paga, quanto, com que frequência. Mercado real hoje vs. TAM vendido pela empresa — reconstrua o TAM de baixo para cima (clientes × gasto possível), nunca aceite o número do deck.
- Sinais de PMF observáveis em empresa listada: crescimento orgânico sem aumento proporcional de marketing, NRR > 100%, coortes que se estabilizam, pricing power (aumentos de preço sem churn).

## 1.2 Placar de Thiel (0 = não, 1 = parcial, 2 = sim, com evidência)
| Pergunta | Evidência a buscar |
|---|---|
| Engenharia | Vantagem tecnológica de ordem de grandeza (custo, desempenho, capacidade) vs. melhor alternativa — não "10% melhor" |
| Timing | Por que agora? A onda tecnológica/regulatória está começando ou já é consenso precificado? |
| Monopólio | Share dominante em um nicho definido e plano crível de expansão para mercados adjacentes |
| Pessoas | Fundador/time com histórico de execução; retenção de talento técnico |
| Distribuição | Canal que funciona (vendas enterprise, viralidade, loja de apps, parceiros) com CAC pagável |
| Durabilidade | O que impede um entrante (inclusive Big Tech ou modelo de IA) de replicar em 3–5 anos? |
| Segredo | Qual verdade importante poucos enxergam? Se a tese é consenso, a vantagem é pequena |

## 1.3 Fontes de monopólio (evidência numérica, não adjetivo)
- **Efeito de rede:** valor por usuário cresce com a base (marketplaces com liquidez local, redes sociais, sistemas de pagamentos). Medir: share crescente, take rate estável/crescente, custo de aquisição caindo com a escala.
- **Custo de troca / lock-in:** dados, integrações, workflows, treinamento. Medir: churn bruto, NRR, duração de contratos.
- **Tecnologia proprietária:** ordem de grandeza de vantagem; P&D efetivo, não só gasto.
- **Economia de escala:** custo unitário cai com volume (nuvem, semicondutores, logística). Medir: margem bruta vs. pares por escala.
- **Marca/ecossistema:** pricing power demonstrado.

## 1.4 Ameaças específicas de tech
- **Comoditização por IA:** o produto pode ser substituído ou barateado por modelos de fundação/agentes? A empresa é dona dos dados e do workflow ou só de uma interface?
- **Dependência de plataforma:** Apple/Google (lojas, privacidade), AWS/Azure/GCP (custo e concorrência), Nvidia/TSMC (oferta), um cliente ou governo concentrado.
- **Regulação e geopolítica:** antitruste (EUA/UE), privacidade, controles de exportação de chips, tarifas, regulação de IA.
- **Ciclo:** semicondutores e hardware são cíclicos — use margens de ciclo completo.

## 1.5 Nota de qualidade
- **A:** placar de Thiel ≥ 11, monopólio com evidência numérica, NRR/retenção forte, lucrativa ou com caminho demonstrado, SBC controlada, governança aceitável.
- **B:** placar 8–10; bom negócio com uma fragilidade relevante (dependência de plataforma, ciclicidade, SBC alta, competição forte em um segmento).
- **C:** placar 5–7; produto bom em mercado competitivo, ou sem caminho demonstrado para lucro.
- **D:** placar < 5, destruição estrutural de valor, contabilidade duvidosa ou governança que expropria o minoritário. Evitar.
````

### references/metricas-unit-economics.md
````markdown
# Módulo 2 — Métricas e unit economics

Objetivo: saber se o crescimento é real, retido e eficiente, e quanto a empresa custa de verdade depois da SBC. Use 3–5 anos e dados trimestrais quando a tendência importar.

## 2.1 Tabela obrigatória
Receita, crescimento a/a, margem bruta, margem operacional GAAP e ajustada, **SBC (% da receita)**, FCO, capex, **FCF após SBC** (FCF − SBC), número de ações diluídas (variação anual), caixa líquido, recompras (e se só compensam SBC), NRR/GRR ou retenção de usuários, burn multiple (se queima caixa), Rule of 40.

## 2.2 Definições (lente a16z — as distorções mais comuns)
Para cada KPI, registre a definição que a empresa usa e se ela mudou:
1. **Bookings ≠ receita ≠ billings.** Crescimento de bookings acima da receita pode ser bom (backlog) ou contratos multianuais inflados.
2. **ARR ≠ run rate anualizado.** ARR deve incluir só receita recorrente contratada; run rate de um mês forte não é ARR.
3. **GMV ≠ receita.** Marketplaces: a receita é o take rate × GMV. Compare take rate ao longo do tempo.
4. **Receita recorrente vs. total:** serviços profissionais e hardware têm margem e previsibilidade menores.
5. **CAC blended vs. pago:** CAC blended esconde canais caros atrás do orgânico.
6. **Usuários registrados ≠ ativos.** Use DAU/MAU e profundidade de uso.
7. **Gráficos cumulativos e eixos truncados** escondem desaceleração — sempre olhe variações.
8. **Concentração de clientes:** top 10 clientes (% receita); governo como cliente relevante.

## 2.3 Growth accounting e coortes (lente Chamath / 8-ball)
Quando houver dados (S-1, investor day, supplement trimestral):
- **Decomposição do ARR/receita no período:** novo + expansão + ressuscitado − contração − churn. **Quick ratio** = (novo + expansão + ressuscitado) ÷ (contração + churn). Referência usual de mercado (não verificada nesta pesquisa): > 4 é forte para SaaS em crescimento; < 1 significa que a base encolhe.
- **Coortes:** retenção de receita por safra de clientes. Coortes que achatam (param de cair) indicam PMF; coortes que decaem sempre indicam produto que vaza. NRR > 120% em enterprise é forte; < 100% significa que a base existente encolhe.
- **Profundidade de engajamento:** distribuição de uso (ex.: dias ativos por mês). Base com "sorriso" (grupo grande de usuários intensos) é sinal de PMF.
Se a empresa não divulga coortes nem retenção, registre em "o que eu não sei" e reduza a confiança.

## 2.4 Eficiência (lente Sacks)
- **Burn multiple** = queima líquida ÷ ARR novo líquido (ou receita nova líquida, adaptação). < 1x excelente; 1–1,5x ótimo; 1,5–2x bom; 2–3x suspeito; > 3x ruim. Ajuste: exija valores menores se margem bruta < 70% ou NRR < 100%.
- **Rule of 40** (convenção de mercado, não dos autores): crescimento % + margem FCF % ≥ 40. Calcule com FCF **após SBC** também.
- **Payback de CAC** = CAC ÷ (receita nova por cliente × margem bruta), em meses. < 18 meses é saudável em SaaS (convenção de mercado).
- **LTV/CAC** só é confiável com coortes reais; LTV projetado com churn otimista é ficção.

## 2.5 Forense de tech (qualidade da receita e do lucro)
Marque OK / Atenção / Bandeira vermelha, com número:
1. **SBC excluída do "lucro ajustado"** e SBC > 15% da receita; ações diluídas crescendo > 2–3% a.a. apesar de recompras.
2. **Mudança de definição de KPI** (ARR, usuário ativo, "clientes") sem reconciliação.
3. **Receita de partes relacionadas ou circular:** clientes que são investidos, parceiros que recebem investimento/crédito da empresa e compram dela, vendor financing. Relevante em infraestrutura de IA.
4. **Capitalização de software/P&D** crescendo acima da receita.
5. **Recebíveis (DSO) e receita diferida:** DSO subindo e diferida caindo podem indicar antecipação de receita.
6. **Receita não recorrente apresentada como recorrente** (licenças perpétuas, implantação).
7. **Ajustes "one-off" recorrentes** (reestruturação todo ano, "custos de aquisição" permanentes).
8. **Crescimento dependente de aquisições** sem divulgação do orgânico.
9. **Concentração** em um cliente, plataforma ou contrato de governo.
10. **Troca de auditor, restatement, material weakness** em controles internos.

## 2.6 KPIs por tipo
- **SaaS/software:** ARR, NRR/GRR, RPO/cRPO, margem bruta de subscrição, CAC payback, burn multiple.
- **Marketplace:** GMV, take rate, compradores/vendedores ativos, frequência, contribuição por pedido.
- **Consumo/anúncios:** DAU/MAU, ARPU por região, tempo de uso, custo por usuário, dependência de algoritmo de terceiros.
- **Fintech:** TPV, take rate, custo de funding, inadimplência por safra, PDD, capital regulatório (use também a skill analisador-empresas, bancos).
- **Semicondutores/hardware:** margem bruta de ciclo, estoques no canal, share por nó/produto, capex, concentração de clientes (hyperscalers).
- **Infraestrutura de IA:** backlog, capex dos clientes, contratos take-or-pay, custo de GPU/energia, financiamento de clientes.
````

### references/fundadores-executivos.md
````markdown
# Módulo 3 — Fundadores e executivos

Objetivo: julgar a gestão pelo que entregou e pelo custo que impôs ao acionista para entregar.

## 3.1 Placar de promessas (guidance vs. realizado)
Tabela com 5–10 promessas dos últimos 3–7 anos (guidance anual, metas de Investor Day, projeções de S-1/deck de SPAC, metas de margem, datas de lançamento de produto):

| Ano | Quem | Promessa (métrica, prazo) | Fonte | Entrega | Fonte | Status |
|---|---|---|---|---|---|---|

Status: Entregou / Parcial / Não entregou / **Mudou a métrica sem explicar** (pior que errar). Calcule a taxa de entrega. Projeções de SPAC e IPO têm peso especial: foram usadas para vender ações.

## 3.2 Alocação de capital
- **Aquisições:** preço (EV/receita), racional, integração, impairments, se o crescimento orgânico caiu depois.
- **Recompras:** compensam só a SBC (diluição neutra) ou reduzem ações de fato? A que preço vs. valor intrínseco?
- **Emissões:** follow-ons e conversíveis — a que preço e para quê.
- **Diluição total** = variação anual das ações diluídas. Acima de 2–3% a.a. de forma persistente é custo relevante para o acionista.
- **P&D e capex:** retorno visível (produtos, share) ou gasto sem resultado?

## 3.3 Fundador e modo de gestão (lente Horowitz)
- Empresa liderada pelo fundador? Tempo no cargo, histórico em crises.
- **Modo:** a empresa está em paz (vantagem grande em mercado crescente) ou em guerra (ameaça existencial: novo concorrente, mudança de plataforma, IA)? A gestão atual opera no modo certo? Gestão de "paz" em momento de "guerra" é risco.
- Rotatividade de CFO e de líderes de produto/engenharia; saída de cofundadores.
- Franqueza: reconhecem erros nas cartas e calls, ou trocam de narrativa?

## 3.4 Incentivos e insiders
- Remuneração: metas atreladas a receita/ajustado incentivam crescimento a qualquer custo; FCF por ação, TSR de longo prazo e retorno sobre capital alinham melhor (proxy statement / Formulário de Referência).
- Vendas de insiders (Form 4; planos 10b5-1) e compras com dinheiro próprio nos últimos 24 meses. Vendas programadas são normais; vendas grandes e fora do padrão perto de máximas merecem nota.
- Mega-grants ao CEO: tamanho vs. valor criado; aprovação por minoritários.

## 3.5 Governança
- **Dual class / super-voto:** o fundador controla com pouco capital econômico? Há cláusula de expiração (sunset)? Controle sem sunset limita a nota de qualidade a B, salvo histórico excepcional de alocação.
- Conselho independente, comitês, transações com partes relacionadas (empresas do fundador).
- Brasil: segmento de listagem, tag along, acordo de acionistas.

## Saída
Nota de gestão **Excelente / Boa / Neutra / Ruim** com as 3 evidências mais fortes. Gestão Ruim limita a nota de qualidade a no máximo C.
````

### references/perspectivas-riscos-tech.md
````markdown
# Módulo 4 — Perspectivas e riscos (tech)

## 4.1 Cenários com fracasso explícito (lei de potência)
Quatro cenários, probabilidades somando 100%:
- **Fracasso:** a tese quebra (perde a guerra competitiva, é comoditizada, fica sem caixa, fraude). Valor por ação = caixa líquido por ação, valor de liquidação ou zero — justifique. Probabilidade nunca é 0% em tech; para empresa pré-lucro com queima, dificilmente < 10%.
- **Bear:** sobrevive, mas cresce pouco e com margem de "commodity".
- **Base:** sua melhor estimativa independente — não o guidance.
- **Bull:** o monopólio se confirma e expande para adjacências.

Para cada um: crescimento inicial da receita, ano em que o crescimento converge para a perpetuidade, margem FCF após SBC de chegada, anos até chegar lá, crescimento na perpetuidade e a narrativa.

Regras de sanidade:
- Margem FCF de chegada no bull não pode superar a do melhor par global maduro sem justificativa.
- Receita implícita no ano 10 dividida pelo TAM reconstruído = share implícito. Share implícito > 50% exige justificativa de monopólio.
- O bear deve incluir a pior desaceleração já sofrida pela empresa ou pelo setor (ex.: 2001–02, 2008, 2022 para software).

## 4.2 O que o preço embute (DCF reverso)
Calcule com o script: (a) crescimento inicial implícito mantendo a margem do base; (b) margem de chegada implícita mantendo o crescimento do base. Compare com o que a empresa já entregou e com os melhores pares. Se o preço exige algo que ninguém do setor entregou, o preço é otimista — diga isso.

## 4.3 Catalisadores (1–3 anos)
Lançamentos, ciclos de produto, virada para lucro/FCF positivo, inclusão em índice, decisões antitruste, controles de exportação, renegociação com plataforma, vencimento de lock-up, fim de ciclo de capex de clientes.

## 4.4 Pre-mortem
"Estamos em [data + 3 anos] e a ação caiu 60%. Por quê?" 3–5 causas com probabilidade. Causas típicas em tech: comoditização por IA/concorrente com capital infinito; desaceleração + compressão de múltiplo; plataforma muda regras; SBC/diluição corroem o valor por ação; fraude/definição de métrica.

## 4.5 Gatilhos de revisão (checkboxes no relatório)
Exemplos de gatilhos objetivos:
- NRR abaixo de 100% por 2 trimestres, ou queda > 10 p.p. em 4 trimestres.
- Burn multiple acima de 2x por 2 trimestres (empresas que queimam).
- Margem bruta cai > 5 p.p. sem explicação de mix.
- SBC acima de X% da receita ou diluição acima de Y% a.a.
- Mudança de definição de KPI sem reconciliação.
- Saída de fundador/CTO/CFO sem sucessor.
- Perda de cliente ou contrato que represente > 10% da receita.
- Decisão regulatória que invalide o modelo.

## 4.6 Consenso vs. visão própria
Busque consenso (receita e margem dos próximos 2–3 anos, preço-alvo médio) e explique onde você difere e por quê. Se não difere em nada, a tese não tem "segredo" — diga isso.
````

### references/valuation-tech.md
````markdown
# Módulo 5 — Valuation e faixas de preço (tech)

## 5.1 Taxa mínima (hurdle)
- **EUA (US$ nominais):** Treasury de 10 anos (buscar valor atual, com data) + prêmio de 5 p.p. para tech lucrativa ou 6–8 p.p. para tech pré-lucro. **Premissas ajustáveis, não dados de mercado.**
- **Brasil (R$ reais):** NTN-B longa + 6 p.p. (tech lucrativa) a 8 p.p. (pré-lucro). Premissa.
- +1 a +2 p.p. para dual class sem sunset, concentração extrema ou risco geopolítico.
Fluxos nominais com taxa nominal; reais com real.

## 5.2 Métodos
1. **DCF por receita e margem após SBC, por cenários, com fracasso** — principal (`scripts/valuation_tech.py`). A SBC é tratada como custo: margem FCF de chegada **após SBC**, ou informe a SBC e o script desconta. Não desconte SBC e diluição ao mesmo tempo (dupla contagem).
2. **DCF reverso** — obrigatório (ver módulo 4.2).
3. **Múltiplos como sanidade:** EV/receita NTM vs. crescimento (e vs. histórico próprio), EV/lucro bruto, EV/FCF após SBC, P/L em empresas maduras. Nunca como âncora.
4. **Soma das partes** para conglomerados (ex.: nuvem + anúncios + apostas).
5. **Empresas maduras e lucrativas** (ex.: grandes plataformas com FCF estável): o DCF de owner earnings da skill analisador-empresas também serve; use os dois e explique diferenças.

## 5.3 Margem de segurança por nota
| Nota | Margem sobre o valor ponderado | Lógica de saída |
|---|---|---|
| A | 30% | Vender se TIR implícita < hurdle − 2 p.p., OU preço > valor bull, OU gatilho |
| B | 40% | Reduzir/vender se preço > valor ponderado × 1,15 OU TIR < hurdle, OU gatilho |
| C | 50% | Vender ao atingir o valor ponderado OU gatilho |
| D | não investir | — |
As margens são maiores que na skill de empresas tradicionais porque o erro de estimativa em tech é maior. **Convenção desta skill, ajustável.**

**Opcionalidade:** se a probabilidade de fracasso > 25%, a recomendação máxima é "posição de opcionalidade" — o preço de entrada ainda vale, mas o tamanho deve ser pequeno e definido pelo usuário, pois a chance de perda total é material.

## 5.4 Definições
- **Entrada** = valor ponderado × (1 − margem). **Zona de acumulação** = entre entrada e valor ponderado. **Saída** = conforme a nota. **TIR implícita** = taxa que iguala o valor ponderado ao preço atual.

## 5.5 Script
```bash
python scripts/valuation_tech.py --config premissas_tech.json
```
Campos (exemplo em `scripts/exemplo_premissas_tech.json`): preço, ações diluídas, caixa líquido (negativo se dívida líquida), receita base (últimos 12 meses), taxa, nota, `margem_inclui_sbc` (true se as margens já são após SBC), `sbc_pct_receita` (usado se false), e por cenário: prob, g_inicial, g_terminal (perpetuidade), anos_fade (anos até o crescimento convergir), margem_inicial, margem_alvo, anos_rampa. Um cenário pode usar `valor_fixo_por_acao` (ex.: fracasso = caixa por ação ou 0). O script imprime valores por cenário, ponderado, DCF reverso (crescimento e margem implícitos), TIR, entrada, zona, saída, recomendação mecânica, alerta de opcionalidade e sensibilidade. Confronte com o qualitativo antes do veredito.

## 5.6 Sensibilidade
Mostre a tabela taxa (±1 p.p.) × margem de chegada (±5 p.p.). Se a recomendação muda dentro da faixa, a decisão é sensível: reduza a confiança e diga isso.
````

### scripts/valuation_tech.py
```python
#!/usr/bin/env python3
"""Valuation de empresas de tecnologia por cenários (com cenário de fracasso).

Modelo: receita cresce com desaceleração linear (g_inicial -> g_terminal em anos_fade),
margem FCF sobe linearmente (margem_inicial -> margem_alvo em anos_rampa),
FCF após SBC, valor terminal por Gordon, + caixa líquido.

Uso: python valuation_tech.py --config premissas_tech.json
Moeda e base (nominal/real) da taxa devem ser as mesmas dos fluxos.
"""
import argparse
import json
import sys

MARGENS = {"A": 0.30, "B": 0.40, "C": 0.50}
LIMIAR_OPCIONALIDADE = 0.25


class SemSolucao(Exception):
    pass


def bissecao(f, lo, hi, it=200):
    """Raiz de f em [lo, hi]. Levanta SemSolucao se não houver troca de sinal."""
    flo, fhi = f(lo), f(hi)
    if (flo > 0) == (fhi > 0):
        raise SemSolucao(f"sem troca de sinal em [{lo:.2%}, {hi:.2%}]")
    for _ in range(it):
        mid = (lo + hi) / 2
        fm = f(mid)
        if (fm > 0) == (flo > 0):
            lo, flo = mid, fm
        else:
            hi = mid
    return (lo + hi) / 2


def fluxo_equity(cfg, cen, r):
    """Valor do equity (PV dos FCFs + terminal + caixa líquido)."""
    gi, gt = cen["g_inicial"], cen["g_terminal"]
    if r <= gt:
        raise ValueError(f"taxa ({r:.2%}) deve ser maior que a perpetuidade ({gt:.2%})")
    fade = max(1, int(cen.get("anos_fade", 10)))
    rampa = max(1, int(cen.get("anos_rampa", 5)))
    n = max(10, fade, rampa)
    m0, mt = cen["margem_inicial"], cen["margem_alvo"]
    sbc = 0.0 if cfg.get("margem_inclui_sbc", True) else cfg.get("sbc_pct_receita", 0.0)

    receita, pv, fcf = cfg["receita_base"], 0.0, 0.0
    for t in range(1, n + 1):
        g = gi + (gt - gi) * min(t - 1, fade - 1) / max(fade - 1, 1) if fade > 1 else gt
        receita *= 1 + g
        m = m0 + (mt - m0) * min(t, rampa) / rampa
        fcf = receita * (m - sbc)
        pv += fcf / (1 + r) ** t
    tv = fcf * (1 + gt) / (r - gt)
    return pv + tv / (1 + r) ** n + cfg.get("caixa_liquido", 0.0)


def valor_por_acao(cfg, cen, r):
    if "valor_fixo_por_acao" in cen:
        return cen["valor_fixo_por_acao"]
    return fluxo_equity(cfg, cen, r) / cfg["acoes"]


def ponderado(cfg, r, cenarios=None):
    cens = cenarios or cfg["cenarios"]
    return sum(c["prob"] * valor_por_acao(cfg, c, r) for c in cens.values())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", required=True)
    cfg = json.load(open(ap.parse_args().config, encoding="utf-8"))

    cens = cfg["cenarios"]
    probs = sum(c["prob"] for c in cens.values())
    if abs(probs - 1) > 1e-6:
        sys.exit(f"Probabilidades somam {probs:.2f}; devem somar 1.")

    r, preco, nota = cfg["taxa"], cfg["preco_atual"], cfg["nota_qualidade"].upper()
    sbc_txt = "margens já após SBC" if cfg.get("margem_inclui_sbc", True) else f"SBC descontada: {cfg.get('sbc_pct_receita', 0):.1%} da receita"
    print(f"== {cfg.get('empresa', '')} | preço {preco:,.2f} | taxa {r:.2%} | nota {nota} | {sbc_txt}\n")

    valores = {}
    for nome, c in cens.items():
        valores[nome] = valor_por_acao(cfg, c, r)
        if "valor_fixo_por_acao" in c:
            desc = "valor fixo"
        else:
            desc = (f"g {c['g_inicial']:.0%}→{c['g_terminal']:.1%} em {c.get('anos_fade', 10)}a, "
                    f"margem {c['margem_inicial']:.0%}→{c['margem_alvo']:.0%} em {c.get('anos_rampa', 5)}a")
        print(f"{nome:>9}: {valores[nome]:>10,.2f}  (prob {c['prob']:.0%}; {desc})")
    base_pond = ponderado(cfg, r)
    print(f"Ponderado: {base_pond:,.2f}  | upside/downside vs. preço: {base_pond / preco - 1:+.1%}\n")

    prob_fracasso = sum(c["prob"] for n, c in cens.items() if "valor_fixo_por_acao" in c or n.lower() in ("fracasso", "bust"))

    # DCF reverso sobre o cenário base
    base = cens.get("base")
    if base and "valor_fixo_por_acao" not in base:
        try:
            g_imp = bissecao(lambda g: valor_por_acao(cfg, {**base, "g_inicial": g}, r) - preco, -0.5, 3.0)
            print(f"DCF reverso (a): crescimento inicial implícito {g_imp:.1%} a.a. (base usa {base['g_inicial']:.1%}), mantendo margem-alvo {base['margem_alvo']:.0%}")
        except SemSolucao as e:
            print(f"DCF reverso (a): nenhum crescimento entre -50% e 300% justifica o preço ({e})")
        try:
            m_imp = bissecao(lambda m: valor_por_acao(cfg, {**base, "margem_alvo": m}, r) - preco, -1.0, 1.0)
            print(f"DCF reverso (b): margem FCF de chegada implícita {m_imp:.1%} (base usa {base['margem_alvo']:.0%}), mantendo o crescimento do base")
        except SemSolucao as e:
            print(f"DCF reverso (b): nenhuma margem entre -100% e 100% justifica o preço ({e})")
    else:
        print("DCF reverso: defina um cenário chamado 'base' (não fixo) para calcular.")

    gt_max = max(c.get("g_terminal", -1) for c in cens.values())
    try:
        tir = bissecao(lambda x: ponderado(cfg, x) - preco, gt_max + 0.001, 1.5)
        print(f"TIR implícita ao preço atual: {tir:.2%} a.a. (hurdle {r:.2%})\n")
    except SemSolucao as e:
        tir = None
        print(f"TIR implícita: fora da faixa pesquisada ({e}) — revise premissas; não use TIR para decidir\n")

    if nota == "D":
        print("Nota D: não investir, independentemente do preço.")
        return
    m = cfg.get("margem_override", MARGENS[nota])
    entrada = base_pond * (1 - m)
    if nota == "A":
        saida = valores.get("bull", base_pond * 1.3)
        regra = "preço > valor bull OU TIR < hurdle − 2 p.p."
        vender = preco > saida or (tir is not None and tir < r - 0.02)
    elif nota == "B":
        saida = base_pond * 1.15
        regra = "preço > valor ponderado × 1,15 OU TIR < hurdle"
        vender = preco > saida or (tir is not None and tir < r)
    else:
        saida = base_pond
        regra = "preço ≥ valor ponderado"
        vender = preco >= saida

    print(f"Margem de segurança: {m:.1%}")
    print(f"PREÇO DE ENTRADA (teto de compra): {entrada:,.2f}")
    print(f"Zona de acumulação: {entrada:,.2f} – {base_pond:,.2f}")
    print(f"PREÇO DE SAÍDA: {saida:,.2f}  ({regra})")

    if vender:
        rec = "VENDER / REDUZIR"
    elif preco <= entrada:
        rec = "COMPRAR"
    elif preco <= base_pond:
        rec = f"ACUMULAR ABAIXO DE {entrada:,.2f} / MANTER"
    else:
        rec = "MANTER / REDUZIR (sem novas compras)"
    if prob_fracasso > LIMIAR_OPCIONALIDADE and (rec == "COMPRAR" or rec.startswith("ACUMULAR")):
        rec += f"  → limitado a OPCIONALIDADE (prob. de fracasso {prob_fracasso:.0%} > {LIMIAR_OPCIONALIDADE:.0%}: posição pequena)"
    print(f"\nRecomendação mecânica: {rec}")
    print("(Confrontar com placar de Thiel, gatilhos, governança e red team antes do veredito.)\n")

    print("Sensibilidade do valor ponderado (linhas: taxa; colunas: Δ margem-alvo em todos os cenários não fixos):")
    deltas = [-0.05, 0.0, 0.05]
    print("         " + "".join(f"{d:+.0%}".rjust(12) for d in deltas))
    for dr in [-0.01, 0.0, 0.01]:
        linha = []
        for dm in deltas:
            c2 = {k: (v if "valor_fixo_por_acao" in v else {**v, "margem_alvo": v["margem_alvo"] + dm}) for k, v in cens.items()}
            try:
                linha.append(f"{ponderado(cfg, r + dr, c2):,.2f}".rjust(12))
            except ValueError:
                linha.append("n/a".rjust(12))
        print(f"{r + dr:>8.2%} " + "".join(linha))


if __name__ == "__main__":
    main()
```

### scripts/exemplo_premissas_tech.json
```json
{
  "empresa": "EXEMPLO SAAS FICTÍCIO (EXSW)",
  "_nota": "Números fictícios só para ilustrar o formato. Fluxos e taxa em US$ nominais (Treasury 10a + prêmio).",
  "preco_atual": 50.0,
  "acoes": 500000000,
  "caixa_liquido": 2000000000,
  "receita_base": 5000000000,
  "taxa": 0.10,
  "nota_qualidade": "B",
  "margem_inclui_sbc": false,
  "sbc_pct_receita": 0.12,
  "cenarios": {
    "fracasso": {"prob": 0.10, "valor_fixo_por_acao": 4.0},
    "bear": {"prob": 0.25, "g_inicial": 0.10, "g_terminal": 0.02, "anos_fade": 5, "margem_inicial": 0.20, "margem_alvo": 0.25, "anos_rampa": 5},
    "base": {"prob": 0.45, "g_inicial": 0.20, "g_terminal": 0.03, "anos_fade": 10, "margem_inicial": 0.22, "margem_alvo": 0.35, "anos_rampa": 7},
    "bull": {"prob": 0.20, "g_inicial": 0.30, "g_terminal": 0.035, "anos_fade": 12, "margem_inicial": 0.24, "margem_alvo": 0.42, "anos_rampa": 8}
  }
}
```

Relendo o código, achei dois pontos que vale ajustar:

1. **Cenário com `anos_fade: 1` ignora o `g_inicial`.** Nesse caso o script usa o crescimento da perpetuidade desde o ano 1. É um caso raro, mas o comportamento esperado seria crescer `g_inicial` no ano 1 e só depois convergir.
2. **O limite de 25% para opcionalidade só conta cenários com valor fixo ou chamados "fracasso" / "bust".** Se você modelar o fracasso com outro nome e margem negativa, o alerta não dispara.

Posso corrigir os dois nesta skill e, junto, a bisseção do `valuation.py` da primeira skill.

**Confiança: 9/10.** O texto é cópia exata dos arquivos. Não dou 10 porque a revisão do código foi só leitura, sem testes novos além dos que rodei ao criar.
