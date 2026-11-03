---
title: "Planilha de ações da declaração de IR"
date: 2026-05-06
updated: 2026-05-07
source: "claude-chat"
source_id: "c5477133-317d-4d53-9ddb-a530470d3942"
url: "https://claude.ai/chat/c5477133-317d-4d53-9ddb-a530470d3942"
project: null
messages: 6
tags: ["claude", "conversa"]
---
# Planilha de ações da declaração de IR

> **Resumo:** **Conversation Overview**

The person requested help building a structured Excel spreadsheet to track Brazilian stock positions extracted from their Brazilian income tax declaration (DIRPF 2025, calendar year 2024). The goal was to create a base that could be updated year-over-year with B3 (Brazilian stock exchange) transaction data to automatically recalculate average acquisition prices. The person explicitly asked to focus only on stocks (ações) and ignore all other asset classes in the declaration.

Claude generated a Python script using openpyxl to produce the spreadsheet, extracting 12 Brazilian stock positions: ITSA4, TOTS3 (zeroed in 2024), CMIG4, SAPR11, KLBN4, TAEE11, ALOS3 (in three separate lots corresponding to different acquisition origins and vesting rules — bens 19, 20, and 42), BBSE3, AURE3, and BBDC4. The spreadsheet was structured with columns A–I containing data from the DIRPF (ticker, company name, CNPJ, market, declaration item number, quantity, total cost, calculated average price via formula, and the literal historical description from the declaration), columns J–N highlighted in yellow for future B3 movement data input (purchases, sales, bonuses/splits), and columns O–Q with formulas to automatically recalculate quantity, total cost, and average price for the following year using the standard weighted average cost method. A second tab with usage legend and notes was also included.

In a follow-up instruction, the person asked to remove all foreign-market stocks (originally 6 U.S.-listed positions had been included), keeping only the 12 Brazilian positions. Claude updated the script accordingly, also removing exterior-related references from the legend tab and consolidating the totals row into a single "TOTAL" line. The recalculation validation confirmed zero errors across 50 formulas after the adjustment.

**Mensagens:** 6 · **Criada:** 2026-05-06 · **Atualizada:** 2026-05-07

---

## 👤 Usuário · 2026-05-06 15:46

Como criar skills

## 👤 Usuário · 2026-05-07 11:56

com base na declaracao de ir anexa, monte uma planilha com cada acao declarada, quantidade, preco medio e campo com o descritivo historico conforme lancado na declaracao, essa planilha deve ter como output uma base que possa ser complementada com os dados da B3 do ano seguinte para calculo do preco medio ano apos ano. foque somente nas acoes. ignore o restante

## 🤖 Claude · 2026-05-07 12:00

 
```
This block is not supported on your current device yet.
```

 Vou extrair as ações declaradas e organizar em uma planilha, focando apenas no grupo de aplicações e investimentos, especificamente ações e ETFs negociados em bolsa. Começando pelas ações brasileiras, vejo que ITSA4 aparece como a primeira entrada.

Agora estou compilando o restante das posições: TOTS3 foi zerada em maio de 2024, enquanto CMIG4, SAPR11, KLBN4 e TAESA mantêm posições ativas. Para ALLOS, há três registros separados - uma posição de matching de 2023, outra convertida de BRMALLS e uma terceira de matching de 2024 - totalizando mais de 43 mil ações. Ainda preciso verificar as ações americanas e completar a lista com as demais posições. Continuando com as ações americanas, tenho posições em NVDA, SHEL, PLTR e TSLA com seus respectivos valores em dólares e conversão para reais, além de algumas posições zeradas em ETFs como BIL SPDR.

Agora vejo que o usuário quer focar apenas em ações regulares, então vou separar os ETFs em uma seção diferente e manter a lista principal com as ações puras, deixando uma nota clara sobre essa distinção.

Para montar a tabela de acompanhamento, preciso estruturar os dados com ticker, empresa, CNPJ, quantidade e preço médio em 31/12/2024, além de deixar espaço para rastrear as movimentações ao longo de 2025. Estou decidindo entre organizar os lotes de ALOS3 separadamente conforme aparecem na declaração ou consolidá-los por ticker para fins de cálculo na B3, já que lá são tratados como uma única posição. Vou criar duas abas: uma com o detalhe de cada lote individual e outra consolidada por ticker para uso direto com a B3.Vou extrair as ações da declaração e montar a planilha. Olhando o documento, identifiquei as ações listadas no grupo 03 (Participações Societárias) - tanto Brasil quanto Exterior.
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

Pronto. Planilha com 3 abas:

**Acoes_Detalhe** — uma linha por bem da DIRPF (18 ações no total, BR e EUA), com colunas em azul para você preencher os dados B3 de 2025 (compras, vendas, bonificações) e colunas em preto que recalculam automaticamente quantidade, custo total e preço médio de 31/12/2025.

**Consolidado_Ticker** — soma os lotes que aparecem separados na declaração (ALOS3 está em 3 lotes diferentes: matching 2023, conversão BRMALLS, matching 2024). Útil porque na B3 a posição é única por ticker.

**Notas_Legenda** — escopo, legenda de cores e divergências detectadas.

**Pontos que merecem sua atenção (achei conferindo os números):**

1. **ALOS3 Bem 42**: a declaração diz "preço médio R$ 23,76", mas R$ 257.605,92 ÷ 10.902 ações = **R$ 23,63**. Pode ser arredondamento na hora de declarar, mas vale conferir.
2. **NVDA Bem 16**: o campo "Situação 31/12/2024" mostra **R$ 12.505,27**, mas o texto da descrição diz **R$ 12.507,27**. Diferença de R$ 2.
3. **ALOS3 Bem 20**: 8.708 ações × R$ 21,28 = R$ 185.310,24, não R$ 185.354,50 (diferença ~R$ 44, indica que o preço médio real é R$ 21,29).

Mantive os valores **exatamente como estão na declaração** na planilha — não corrigi de ofício. Marquei essas divergências na aba de notas.

**Considerações importantes:**
- A fórmula de baixa em vendas usa o preço médio anterior (método do custo médio ponderado). Se sua corretora usar FIFO ou se houver venda de lote específico, ajuste manualmente.
- ALOS3 com vesting: as ações em matching têm vesting de 3 anos. Se houver evento de quebra de vesting em 2025, isso afeta o tratamento — não está coberto pela fórmula simples.
- **Ações no exterior (TSLA, NVDA, MMM, SHEL, PLTR)**: a Lei 14.754/2023 mudou completamente a tributação a partir de 2024 (alíquota fixa de 15% sobre ganho anual, regime de competência). Para essas, o "preço médio" tem aplicação diferente do que o regime brasileiro tradicional. Não sou advogado tributarista — recomendo confirmar com seu contador antes de usar para cálculo fiscal.

**Confiança: 7/10.** A extração dos números da DIRPF está correta (conferi cada linha), mas as divergências internas da própria declaração e o tratamento da Lei 14.754 para ativos no exterior são pontos onde recomendo validação humana antes de usar como base oficial.

## 🤖 Claude · 2026-05-07 12:04

 
```
This block is not supported on your current device yet.
```

 Estou extraindo as ações listadas na declaração e organizando os dados em uma planilha. Identifiquei as posições em ações brasileiras: ITSA4 com cerca de 8.449 ações a um preço médio de R$ 10,86, TOTS3 que foi zerada durante 2024, e CMIG4 com 2.748 ações.

Continuando com as demais posições: SAPR11, KLBN4, TAEE11, e várias posições em ALOS3 (incluindo ações de matching com vesting de 3 anos e conversões de BRMALLS), além de BBSE3, AURE3 e BBDC4, cada uma com suas respectivas quantidades, custos totais e preços médios.

Agora passando para as ações no exterior: INTC foi zerada em 2024 (tinha 20 ações em 2023), enquanto MMM, NVDA, SHEL, PLTR e TSLA mantêm posições ativas com valores em reais após conversão, considerando splits e vendas parciais onde aplicável. Vou organizar tudo isso numa planilha clara.

Estruturando com colunas para ticker, nome da empresa, CNPJ, mercado de origem, quantidade e valores em 31/12/2024, além de campos históricos da declaração e espaço reservado para adicionar dados B3 do próximo ano com movimentações, quantidades e valores adicionais.

Vou aplicar fórmulas para calcular automaticamente o preço médio, destacar as colunas de entrada em azul para facilitar futuras atualizações, e manter um padrão profissional. Há uma discrepância nos valores do NVDA entre duas linhas do documento (12.505,27 versus 12.507,27), então vou usar 12.505,27 como o valor final confirmado para 31/12/2024.Vou montar a planilha extraindo apenas as ações da declaração. Identifiquei 18 posições de ações (12 no Brasil, 6 no exterior, incluindo posições zeradas).
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

 Ah, I see the issue now — the legend tab has errors because entries starting with "=" are being interpreted as Excel formulas. I need to escape those characters so they're treated as plain text instead.Os textos da legenda começam com "=" e o Excel interpreta como fórmula. Vou corrigir:
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Zero erros, 78 fórmulas validadas. Vou copiar o arquivo para a pasta de outputs:
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Planilha pronta. Resumo do que extraí da declaração:

**18 posições de ações** identificadas (ignorei imóveis, Tesouro Direto, bonds, fundos, VGBL, créditos em trânsito e SCP, conforme você pediu):

- **12 no Brasil**: ITSA4, TOTS3 (zerada), CMIG4, SAPR11, KLBN4, TAEE11, ALOS3 (em 3 lotes — bens 19, 20 e 42), BBSE3, AURE3, BBDC4
- **6 no exterior (EUA)**: INTC (zerada), MMM, NVDA, SHEL, PLTR, TSLA

**Estrutura da planilha**:
- Colunas A–I: dados consolidados de 31/12/2024 (ticker, empresa, CNPJ, mercado, nº do bem na DIRPF, qtd, custo total, preço médio calculado, descritivo histórico literal da declaração)
- Colunas J–N (em amarelo): campos para preencher com a movimentação de 2025 vinda da B3 — compras, vendas, bonificações/desdobramentos
- Colunas O–Q: fórmulas que recalculam automaticamente qtd, custo total e preço médio em 31/12/2025

**Pontos que vale destacar**:

1. **ALOS3 em 3 linhas separadas** — a declaração separa por origem (matching 2023 com vesting, lote convertido de BRMALLS, matching 2024). Mantive separado porque os custos médios e datas de aquisição são diferentes; para apuração de IR sobre venda você provavelmente vai consolidar.
2. **TOTS3 e INTC** ficaram com qtd 0 (zeradas em 2024) — pode apagar na consolidação ou manter como histórico.
3. **NVDA tem uma divergência na própria declaração**: o campo de saldo mostra R$ 12.505,27 e o descritivo menciona R$ 12.507,27 (diferença de R$ 2). Adotei R$ 12.505,27, que é o valor da coluna oficial 31/12/2024.
4. **Ações no exterior**: o custo em R$ está na PTAX da data de aquisição (Lei 14.754/2023). Movimentações futuras precisam usar PTAX da data correspondente.
5. A fórmula de preço médio para 2025 usa o método clássico: vendas saem ao preço médio antigo (não alteram o preço médio), compras ponderam o novo preço médio.

**Confiança: 8/10**. Os dados das ações foram extraídos diretamente da declaração com alta fidelidade. O ponto que reduz a nota: (a) a divergência NVDA na origem; (b) a metodologia de preço médio para o ano seguinte é a convencional, mas pode precisar de ajuste se houver eventos corporativos atípicos (split, grupamento, cisão) — nesses casos ajuste manualmente a coluna N e/ou as fórmulas. Sobre fontes: todos os números vieram do PDF que você anexou, sem dados externos.

## 👤 Usuário · 2026-05-07 12:06

elimine as acoes do exterior, deixe somente as do brasil

## 🤖 Claude · 2026-05-07 12:08

  O usuário quer que eu remova as ações internacionais do script, mantendo apenas as brasileiras. Vou tirar as seis entradas de ações estrangeiras, além das linhas de totalizações e a nota sobre exterior na legenda.
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

Zero erros, 50 fórmulas validadas.
```
This block is not supported on your current device yet.
```

Pronto. Removi as 6 ações do exterior (INTC, MMM, NVDA, SHEL, PLTR, TSLA) e ajustei:

- A planilha agora tem **12 linhas** (todas Brasil/B3): ITSA4, TOTS3, CMIG4, SAPR11, KLBN4, TAEE11, ALOS3 (3 lotes), BBSE3, AURE3, BBDC4
- O bloco de totais virou um único **TOTAL** (sem mais "Total Brasil/Exterior/Geral")
- A aba "Legenda e Notas" foi limpa: removi a referência ao fundo laranja, à PTAX para exterior, à divergência da NVDA e o item da Avenue. Renumerei as observações restantes
- Estrutura das colunas preservada igual: A–I com dados da DIRPF, J–N (amarelo) para preencher com a B3 de 2025, O–Q com fórmulas que recalculam qtd, custo total e preço médio do ano seguinte

**Confiança: 9/10**. Operação simples de remoção, validada pelo recálculo (50 fórmulas, zero erros). O ponto que mantém abaixo de 10 é só a observação que já tinha feito antes: ALOS3 está em 3 linhas separadas — se você quiser consolidar em uma única posição com preço médio ponderado, me avise que ajusto.
