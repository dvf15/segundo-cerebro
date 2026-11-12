---
tipo: resumo-artigo
área: varejo-omnichannel
status: ativo
criado: 2026-05-21
tags:
  - varejo
  - omnichannel
  - showroom
  - dnvb
  - e-commerce
  - operacoes
  - warby-parker
  - difference-in-differences
aliases:
  - Showrooms Omnichannel (Bell et al. 2018)
  - Warby Parker Showroom Study
  - Bell Gallino Moreno 2018
---

# Offline Showrooms in Omnichannel Retail: Demand and Operational Benefits

> [!info] Metadados da fonte
> **Autores:** David R. Bell (Wharton), Santiago Gallino (Tuck/Dartmouth), Antonio Moreno (Kellogg/Northwestern)
> **Publicado em:** Management Science, vol. 64, n. 4, abril 2018, pp. 1629–1651
> **DOI:** 10.1287/mnsc.2016.2684
> **Editor:** Vishal Gaur (Operations Management)
> **Empresa estudada:** [[Warby Parker]] (WarbyParker.com)

---

## 1. Pergunta de pesquisa

Os autores investigam se — e como — a abertura de [[showrooms]] físicos por varejistas [[online-first]] gera benefícios de **geração de demanda** e **eficiência operacional**. O foco é o quadrante ainda pouco estudado da matriz de canais: informação offline + fulfillment online (i.e., showrooms sem estoque).

> [!question] Hipótese central
> Showrooms, por entregarem **informação tátil** ([[atributos não-digitais]]) sem alterar o fulfillment centralizado, deveriam (a) aumentar demanda agregada, (b) realocar clientes entre canais conforme sua sensibilidade a fit, e (c) reduzir custos operacionais como devoluções.

---

## 2. Framework conceitual: matriz informação × fulfillment

A [[matriz de canais omnichannel]] cruza duas funções centrais do varejo:

| | **Fulfillment offline** | **Fulfillment online** |
|---|---|---|
| **Informação offline** | Varejo tradicional (Q1) | **Showrooms (Q2)** ← foco |
| **Informação online** | Pesquisa online, retira na loja (Q3) | E-commerce puro (Q4) |

A literatura prévia ([[Anderson et al. 2010]], [[Avery et al. 2012]]) se concentrou em Q1 ↔ Q4. Este paper é o primeiro a isolar **Q2 → Q4** ("haus to browse").

---

## 3. Contexto institucional: Warby Parker

> [!example] Por que Warby Parker é caso ideal
> - **Atributos não-digitais fortes:** óculos exigem "touch and feel" (fit, estilo, conforto)
> - **Mercado pouco penetrado online:** quando a WP lançou em fev/2010, apenas **1%–2%** do mercado de óculos de US$ 22 bi nos EUA era online (p. 1634)
> - **Preço único:** todos os óculos a **US$ 95** (lentes incluídas) no período analisado
> - **3 canais com fulfillment idêntico** (centralizado), permitindo isolar o efeito da informação

### Os três canais

1. **Web (WEB):** navegação online + ferramenta de "virtual try-on" com upload de foto
2. **[[Home Try-On]] (HTO):** programa de amostragem — 5 armações enviadas gratuitamente por 5 dias; conversão considerada se compra ocorre em até 2 meses. Cada HTO custa **~US$ 15** à empresa (p. 1631)
3. **[[Showroom]]:** acesso físico à linha completa de produtos em parceria com varejistas locais

---

## 4. Dados e método

> [!note] Desenho quasi-experimental
> - **Período:** 158 semanas (fev/2010 a mar/2013), com dados de devolução até mai/2013
> - **Amostra final:** 1.972 ZIP codes (823 tratados, 1.149 controle)
> - **Tratamento:** 20 showrooms abertos em 15 cidades (13 contínuos, 7 abriram e fecharam)
> - **Trading area:** raio de 30 milhas (82% das vendas do showroom em até 15 mi; 87% em até 30 mi — p. 1635)
> - **Método:** [[Difference-in-Differences]] (DiD) com [[propensity score weighting]] ([[Hirano e Imbens 2001]])
> - **Variáveis de matching:** 47 variáveis demográficas e socioeconômicas do Esri 2010 (testado também com subset de 22)

---

## 5. Resultados de demanda

> [!success] Efeitos médios sobre demanda (logs, modelo com PS weighting)

| Efeito | Variação | p-valor |
|---|---|---|
| Vendas totais na trading area | **+7,4%** | < 0,001 |
| Vendas no canal web | **+2,9%** | < 0,001 |
| Vendas via HTO | **−4,5%** | < 0,001 |
| Pedidos de HTO | **−10,0%** | < 0,001 |
| Primeiras compras (novos clientes) | **+7,3%** | < 0,001 |

Fonte: Tabelas 3–6, pp. 1637–1639.

### Mix de novos clientes por canal (raw data, p. 1638)

| Local | HTO | Web | Showroom |
|---|---|---|---|
| Sem showroom | 82% | 75% | — |
| Com showroom | 78% | 67% | **83%** |

O showroom é o canal **mais eficaz para aquisição** de clientes novos à marca.

---

## 6. Resultados de eficiência operacional

### 6.1. Conversão e disciplina no canal HTO

> [!check] Efeitos individuais (modelo logit, Tabela 7)
> - Probabilidade de **conversão HTO → venda:** **+1%** (marginal effect) — coef. 0,036, p < 0,05
> - Probabilidade de **múltiplos HTOs** por cliente: **−1,6%** (marginal effect) — coef. −0,142, p < 0,001

Como pedidos HTO caem mais (10%) do que vendas HTO (4,5%), a conversão sobe — confirmado também em nível individual.

### 6.2. Devoluções

> [!check] Efeito sobre [[taxa de devolução]] (Tabela 8, p. 1640)
> - **Total:** −1,1% (marginal effect; coef. −0,074, p < 0,01)
> - **Web:** efeito negativo significativo (coef. −0,098, p < 0,05)
> - **HTO:** efeito negativo mas **não significativo**

### 6.3. Interação com complexidade do produto

[[Dioptria]] ≥ 6 é proxy para uso intensivo do produto. Resultados da Tabela 9 (p. 1641):

- Produtos complexos têm **+15,6%** de taxa de devolução no web (base maior)
- Showroom reduz devoluções de produtos complexos no web em **−3,6%** adicional (vs. −1% médio)
- Efeito amplificado para clientes com maior necessidade do produto

---

## 7. Mecanismo: customer sorting

> [!abstract] Lógica do realinhamento de canais
> Clientes diferem em **"pickiness"** (sensibilidade a fit, parâmetro $k_i$ no modelo do Apêndice C). Quando o showroom abre:
> 1. Clientes mais "picky" (alto custo de servir) **migram** para o showroom
> 2. Os que **permanecem** no HTO estão melhor alinhados a esse canal → conversão sobe
> 3. Os que permanecem no web também são menos sensíveis a fit → devoluções caem
> 4. O showroom traz **novos clientes** que não comprariam em nenhum outro canal

A combinação gera **spillovers operacionais positivos** para os canais preexistentes.

---

## 8. Persistência e "channel awareness"

Os autores cunham o conceito de [[channel awareness]] — distinto de [[brand awareness]] — para descrever o aprendizado do consumidor sobre qual canal melhor atende suas necessidades. Os efeitos **aumentam com o tempo** (Tabela 10, p. 1641):

| Janela | Vendas totais | Vendas web | Vendas HTO | Pedidos HTO |
|---|---|---|---|---|
| 0–3 meses | +3,1% (ns) | +0,1% (ns) | −2,9% | −6,1% |
| 3–6 meses | **+7,2%** | **+2,9%** | −3,5% | −7,5% |
| 6+ meses | **+10,9%** | **+5,0%** | −6,3% | −14,4% |

---

## 9. Implicações econômicas: ponto de indiferença

> [!example] Quando abre um showroom compensa?
> Com custos típicos:
> - Operação do showroom: **US$ 3.000–6.000/mês** (dados Storefront, p. 1642)
> - Custo de HTO: **5%–40%** do preço de venda
> - Preço unitário: **US$ 95**
>
> Para custo operacional de US$ 4.000/mês e HTO a 15%, o **break-even** é ~**500 armações/mês** vendidas adicionalmente na trading area (Figura 3, p. 1643).

A análise de heterogeneidade entre os 15 showrooms mostra **uplift de vendas variando de 0 a 25%** — 11 de 15 com efeito positivo e significativo (p. 1643).

---

## 10. Implicações para a prática

> [!tip] Quando faz sentido abrir showrooms
> - Categoria com **alta incerteza de fit** (DNVBs como [[Bonobos]], [[Casper]], [[Wayfair]], [[Zappos]])
> - Marca própria com **alta variedade** (benefícios de [[pooling de estoque]] segundo [[Eppen 1979]])
> - Quando **gratificação imediata não é crítica** (cliente aceita receber depois)
> - Categorias commoditizadas (ex.: Amazon) tendem a priorizar fulfillment, não informação

> [!tip] Vantagens vs. lojas tradicionais
> - Sem reposição periódica de estoque
> - Sem forecast item-a-item
> - Fulfillment centralizado preservado
> - Clientes adquiridos via showroom ficam "condicionados" a aceitar fulfillment online → recompras online a custo muito menor

---

## 11. Limitações e o que o paper NÃO diz

- [ ] Não estuda **showrooming competitivo** (cliente vê em uma loja e compra em outra) — esclarecido em nota de rodapé 2 (p. 1630)
- [ ] Não avalia categorias com necessidade de **posse imediata**
- [ ] Heterogeneidade entre showrooms tem apenas **15 pontos de dados** — correlações geo-demográficas são exploratórias
- [ ] Não distingue formalmente brand awareness de channel awareness — apenas infere pela evolução temporal
- [ ] Período pré-pandêmico — não captura mudanças estruturais pós-2020 no varejo

---

## 12. Conceitos-chave para conectar

- [[Digitally Native Vertical Brand]] (DNVB) — termo de Andy Dunn (Bonobos)
- [[Atributos digitais vs não-digitais]] ([[Lal e Sarvary 1999]])
- [[BOPS - Buy Online Pickup In-Store]] (caso Q3, estudado em [[Gallino e Moreno 2014]])
- [[Centralized inventory management]]
- [[Cost-to-serve]] por canal
- [[Customer acquisition cost]] (CAC) por canal
- [[Experiential gap]] (lacuna entre virtual try-on e produto físico)
- [[Information vs fulfillment function]] de canais
- [[Pooling de estoque]] ([[Eppen 1979]])
- [[Tax nexus]] (estudado em [[Anderson et al. 2010]])

---

## 13. Aplicações para o contexto de varejo brasileiro

> [!question] Perguntas para reflexão e conexão com [[Blueprint da Performance no Varejo]]
> - Como o conceito de **channel awareness** se conecta com as métricas de [[conversão]] e [[deal conversion]] em shoppings?
> - O **customer sorting** observado pode ser replicado em lojas-âncora omnichannel em shoppings brasileiros?
> - Para marcas DNVB chegando ao Brasil, qual o **mínimo viável** de presença física (showroom vs. quiosque vs. loja completa)?
> - Como o efeito do showroom sobre **devoluções de produtos complexos** se traduz para categorias como moda premium ou óculos no Brasil?
> - O break-even de 500 unidades/mês é relevante para o ticket médio brasileiro?

---

## 14. Ações sugeridas

- [ ] Cruzar achados com casos brasileiros de DNVB com showroom (Amaro, Insider, Zee.Dog, Use Pante)
- [ ] Mapear quantas lojas no shopping operam efetivamente como **showroom + envio centralizado** (mesmo as tradicionais)
- [ ] Calcular o **uplift de vendas online** atribuível a presença física de marcas no shopping (analogia)
- [ ] Incluir o conceito de **channel awareness** nos materiais de mentoria/treinamento sobre omnichannel
- [ ] Conectar com a skill [[seller-sales-performance-engine]] para casos de marcas que precisam aumentar conversão

---

## 15. Dados quantitativos essenciais (referência rápida)

> [!cite] Números do paper com localização
> - **+7,4%** vendas totais na trading area (Tabela 3, p. 1637)
> - **+2,9%** vendas no web (Tabela 4, p. 1637)
> - **−4,5%** vendas HTO; **−10%** pedidos HTO (Tabela 5, p. 1638)
> - **+7,3%** primeiras compras (Tabela 6, p. 1639)
> - **−1,1%** devoluções totais (Tabela 8, p. 1640)
> - **+1%** conversão individual HTO; **−1,6%** múltiplos HTOs (Tabela 7, p. 1639)
> - **+3,6%** redução adicional de devoluções para lentes complexas (Tabela 9, p. 1641)
> - **US$ 15** custo por HTO; **US$ 95** preço unitário; **US$ 3k–6k/mês** custo de showroom
> - **82%** das vendas do showroom em até 15 mi; **87%** em até 30 mi
> - **1.972** ZIP codes na amostra; **20** showrooms em **15** cidades
> - **>1,8 milhão** de armações vendidas até o fim do período (p. 1634)

---

## 16. Conexões — Dataview

```dataview
LIST
FROM [[]]
WHERE contains(file.outlinks, this.file.link)
SORT file.name ASC
```

```dataview
TABLE tipo, área, status
FROM #varejo OR #omnichannel OR #operacoes
WHERE file.name != this.file.name
SORT file.mtime DESC
LIMIT 20
```

---

## Como usar essa nota no Obsidian

> [!info] Sobre formatação
> - **[[wikilinks]]:** Ctrl/Cmd+clique para navegar. Links para notas que ainda não existem aparecem em cinza — clicar cria a nota.
> - **Dataview:** o bloco acima exige o plugin Dataview ativo (Settings → Community plugins). Lista automaticamente notas que apontam para esta ou compartilham tags.
> - **Callouts** (`> [!info]`, `> [!tip]`, `> [!question]` etc.): tipos suportados nativos no Obsidian. Adicione `-` após o tipo para iniciá-lo colapsado.
> - **Templates:** essa estrutura pode virar template (Settings → Core plugins → Templates → pasta de templates).
> - **YAML frontmatter:** campos `tipo`, `área`, `status`, `criado`, `tags`, `aliases` permitem queries Dataview e busca por aliases.

---

## Avaliação de confiança

> [!warning] Nível de confiança: **9/10**
>
> **Por quê 9 e não 10:**
> - Todos os números, percentuais, tabelas e citações vêm diretamente do PDF fornecido — fonte primária, sem intermediação.
> - As páginas indicadas foram conferidas no documento.
> - O 1 ponto reservado: nas seções "Aplicações para o contexto de varejo brasileiro" e "Ações sugeridas" há **inferências minhas** (não estão no paper). Estão claramente sinalizadas como perguntas/sugestões, não como achados do estudo.
> - Não verifiquei se os autores/papers citados (referências bibliográficas) existem ou se a numeração de páginas do PDF corresponde à versão final publicada — usei a paginação do próprio PDF anexado.
