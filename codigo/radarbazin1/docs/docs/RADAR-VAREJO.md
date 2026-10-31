---
title: Radar de Varejo — Triagem de Loja ou Quiosque
aliases:
  - Radar de Varejo
  - Radar de Operações
  - Triagem de Operações
  - Loja ou Quiosque
tags:
  - shopping-inteligente
  - qualificacao-leads
  - triagem
  - tenant-mix
  - cto
  - ferramenta
created: 2026-08-20
updated: 2026-09-07
status: ativo
---

# Radar de Varejo — Triagem de Loja ou Quiosque

Ferramenta de apoio ao **executivo comercial de shopping** para triar leads de
qualquer operação — **loja ou quiosque** — decidindo o formato pela **área
necessária** e pelo **capital disponível**, e devolvendo o direcionamento
comercial do fluxo de qualificação.

> Arquivo único, sem build, sem dependências: **`public/operacoes.html`**.
> Abra direto no navegador (duplo clique) **ou** acesse online — como está em
> `public/`, a Vercel serve em **`https://radarbazin1.vercel.app/operacoes.html`**
> após o merge na branch de produção.

## De onde ela vem

- **Metodologia:** a mesma do [[RADAR-QUIOSQUES|Radar Quiosques]] — roteiro de
  perguntas, score ponderado por dimensões, travas de pré-requisito e modulação
  pelo planejamento de mix.
- **Fluxo:** o workflow [[workflow-qualificacao-leads/Fluxo-de-Qualificacao-de-Leads|Fluxo de Qualificação de Leads]]
  (8 perguntas → viabilidade → decisão → saídas A/B/C).
- **O que é novo:** o **enquadramento de formato**. O Radar Quiosques assume
  quiosque; aqui a tipologia é *resultado* da triagem, não premissa.

---

## Estrutura em abas

1. **Triagem** — os 7 blocos do roteiro (as 8 perguntas do workflow + o perfil do
   operador) e, ao final, o resultado: direcionamento, enquadramento, diagnóstico
   e ranking de operações. No topo, **enviar e receber a ficha** do interessado.
2. **Leads** — banco de leads (mini-CRM) com status do workflow
   (novo · triagem · viabilidade · proposta · standby · fechado · descartado),
   busca, filtro por saída (A/B/C/standby), anotações, exportar CSV e backup JSON.
   Traz também o **briefing da vacância**, o acompanhamento que se extrai por
   período, montado na ordem do Planejamento.
3. **Lojistas** — os **lojistas da casa**: quem já opera no shopping e pode
   investir em uma nova marca ou levar a sua a outros shoppings (ver seção 5c).
4. **Planejamento** — **dados do shopping** (nome, cidade, outros shoppings da
   região, site), parâmetros do empreendimento (custo de implantação por m²,
   faixas de área, aluguel, condomínio, FPP, taxas) e os **pontos** do shopping,
   cada um com **tipologia**, **área** e status (ocupado com marca · vago com até
   3 opções de mix, marcas indicadas e o **estado da LUC** com as adequações,
   seção 5d). A lista tem um **filtro** por situação (vagos · ocupados) e
   por tipo (quiosques · lojas, sendo "lojas" satélite + megaloja), combináveis —
   só muda o que aparece; o resumo e o Cruzamento seguem usando todos os pontos.
   Tem os mesmos botões da aba Leads — **Excel (CSV)**, **Backup** e
   **Importar** — para passar o planejamento entre executivos.
5. **Cruzamento** — para cada ponto vago, as três melhores combinações
   **lead × operação** (leads e lojistas da casa), mais a **cobertura da vacância**.
6. **Prompts** — apoio, fora do fluxo principal: os prompts de mapeamento de
   varejistas para complementar a base de marcas desejo (seção 5b).

### Ficha do operador — enviar e receber (aba Triagem)

O executivo clica em **Enviar ficha** → obtém um **link** (a mesma página em modo
ficha, via `#investidor`) e o envia por WhatsApp ou e-mail. Quem recebe vê
**somente a ficha**: abas, banco de leads, planejamento e cruzamento são
**removidos da página**, não apenas ocultados.

O interessado preenche, vê o **formato sugerido** (loja ou quiosque, pela área e
pelo capital que informou) e as três operações mais aderentes ao seu perfil — sem
CTO, sem mix e sem os pontos do shopping. Ao final gera:

- um **código** `RO1:...`, que é a mensagem inteira enviada pelo WhatsApp ou
  e-mail, para colar em **Receber resposta**;
- um arquivo **`.json`** da ficha.

Links antigos `#resp=...` ainda são lidos ao serem tocados (com confirmação
antes de gravar, por virem de terceiro), mas não são mais gerados.

> [!note] O leitor tolera o que o caminho faz com o código
> O código raramente chega intacto: e-mail dobra o texto a cada ~76 colunas, o
> WhatsApp do iPhone às vezes insere quebra ou espaço ao copiar, alguns apps
> tiram o `=` do fim, e há quem cole o link antigo com o `:` virado `%3A`.
> Nada disso é erro de quem colou. O leitor tenta o texto como veio, sem
> espaços, decodificado de URL, e completa o preenchimento do base64 antes de
> desistir. A mensagem inteira, com texto em volta, também entra.

Toda ficha recebida passa por uma whitelist (`sanitizeLead`) que descarta campos
inesperados, limita tamanhos e força tipos numéricos antes de entrar no banco.

> A ficha só é útil com a ferramenta publicada num endereço acessível — o link
> gerado é o endereço da própria página. Aberta como arquivo local, ele sai como
> `file://…` e não serve para enviar.

Persistência em `localStorage` (por navegador). Use **Backup** para levar entre
dispositivos. Há dois backups, com alcances diferentes:

| Botão | Onde | O que leva | O que a importação faz |
|---|---|---|---|
| Backup (aba Leads) | Leads | leads + planejamento + parâmetros | substitui os três |
| Backup (aba Planejamento) | Planejamento | pontos + parâmetros | substitui pontos e parâmetros; **os leads do navegador ficam** |

A importação do Planejamento aceita qualquer um dos dois arquivos e pede
confirmação antes de trocar os pontos cadastrados. O **Excel (CSV)** do
Planejamento é só para conferência (um ponto por linha, com formato, área,
status, marca e as três opções de mix) — não é reimportável.

---

### Interesse em mais de um shopping da Allos

O lojista pode marcar, na ficha, outros shoppings da Allos da mesma região em
que também abriria a operação. A lista vem do Planejamento: no card de
prompts, o campo **Outros shoppings da Allos na mesma região** (nomes
separados por vírgula). Esses nomes e o nome do shopping vão no link da ficha
(`#investidor&sh=…&r=…`): a ficha abre como "Ficha de Interesse — <shopping>"
e mostra os shoppings da região como opções de toque, mais um campo "Outro
shopping". Sem lista no link, o lojista pode escrever o nome.

O que volta na ficha: `shoppingOrigem` (de quem é a ficha) e
`outrosShoppings` (a escolha do lead). Ao entrar no banco, a nota do lead já
começa com "Interesse também em: X, Y (ficha do Z)": é a nota que sai no
Excel, no briefing e na consolidação, sem mudar o layout da planilha de
acompanhamento. O interesse aparece ainda no cartão da aba Leads ("Também:
X · Y"), no diagnóstico da triagem e no dossiê do briefing, com o lembrete de
avisar os executivos dos outros shoppings. Os prompts de mapeamento também
citam os shoppings da região, como parte da área de influência.

---

## 1 · Enquadramento de formato (o que a ferramenta acrescenta)

Para cada tipologia, a ferramenta calcula com os parâmetros do empreendimento:

| Cálculo | Fórmula |
|---|---|
| Área que o capital comporta | `capital ÷ implantação (R$/m²) do formato` |
| Cabe? | `área viável ≥ área mínima do formato` |
| Área efetiva | `área desejada`, limitada pela faixa do formato e pelo capital |
| Faturamento estimado | `venda por m² de referência × área efetiva` |
| CTO estimado | `(aluguel + condomínio) × área × (1 + FPP) × (1 + taxas)` |

**Como o formato é escolhido**

1. Se o lead **pediu** um formato → é o escolhido (com aviso se não couber no capital).
2. Senão, se declarou **metragem** → o formato é derivado da área
   (≤ 12 m² quiosque · 12–150 m² satélite · ≥ 150 m² megaloja — faixas editáveis).
3. Senão → o formato que faz **melhor uso do capital**: maior margem estimada
   (`faturamento − CTO`) entre os que cabem.

**Rebaixamento.** Quando o formato pedido/derivado não cabe no capital, a
ferramenta desce para a maior tipologia viável e explica: *"Megaloja não cabe em
R$ 300 mil — o enquadramento viável é Loja satélite"*.

**Trava de gestão.** Megaloja fica bloqueada para lead sem experiência de gestão
(primeira vez e nunca franqueado) — aparece como *"exige gestão comprovada"*.

---

## 2 · Score da operação

Cada operação da base é pontuada em **7 dimensões**:

| Dimensão | Peso | O que mede |
|---|:--:|---|
| Financeiro | 30 | `capital ÷ implantação` na metragem pretendida |
| **Área & formato** | 18 | metragem pedida vs. faixa da marca, formato pedido, área que o capital comporta |
| Experiência | 16 | nível do lead (+1 se franqueado) vs. exigido, ajustado pela complexidade |
| Capital de giro | 14 | `giro reservado ÷ giro sugerido` |
| Interesse | 12 | marca citada e segmentos declarados |
| Dedicação | 5 | disponibilidade e quem opera vs. o que a operação exige |
| Risco | 5 | complexidade + payback + CTO %, filtrado pelo perfil de risco |

As faixas das notas financeira, de giro, de experiência e de dedicação são as
mesmas do [[RADAR-QUIOSQUES|Radar Quiosques]] (`r < 0,85` · `< 1` · `≤ 1,8` · `≤ 3`
no financeiro; `rg ≥ 1` · `≥ 0,6` no giro).

### Travas (sobrepõem a média)

| Condição | Efeito |
|---|---|
| `capital < 0,85 × implantação` | score ≤ **38** |
| `giro < 0,5 × giro sugerido` | score ≤ **62** |
| Metragem pedida fora do dobro/metade da faixa da marca | score ≤ **50** |
| Formato explicitamente pedido diferente do da operação | score ≤ **62** |
| CTO estimado > 25% do faturamento | score ≤ **55** |
| Marca já opera no shopping | score final ≤ **45** |

### Modulação pelo mix

```
score final = score × (0,85 + 0,15 × mix/100) + bônus de lacuna     (teto 100)
```

`mix` = 100 (1ª opção de mix em ponto vago, +3 de bônus) · 88 (consta no mix
desejado) · 52 (fora das opções) · 34 (segmento ocupado e fora do mix) · 32
(marca já presente). Marca indicada no Planejamento: 100, com bônus de +3 a +6
conforme o motivo (seção 5a).

**Faixas:** ≥78 alto match · 60–77 médio · 42–59 baixo · <42 não recomendado.

---

### Marca própria: sem sugestão de outras marcas

Quando o lead marca **Marca própria** na ficha, a base de franquias sai do
jogo: a única "operação" pontuada é a **marca dele**, uma leitura por segmento
de interesse. Área, faturamento por m², giro e payback vêm das referências do
segmento no formato; a implantação usa o parâmetro do Planejamento; taxa de
franquia e royalties são zero. O score, o direcionamento, o briefing e o
Cruzamento continuam funcionando — só que avaliando a marca do lead, nunca
recomendando outra. Quando a aderência fica abaixo de 60, a saída B vira
"Marca própria a aprofundar": pedir apresentação, projeto e histórico de
vendas antes de ponto e valores.

## 3 · Direcionamento comercial (saídas do workflow)

| Saída | Quando |
|---|---|
| **A · Negócio estruturado** | score ≥ 60, capital cobre a implantação, formato enquadrado e há ponto compatível |
| **B · Investidor sem operação** | capital sem marca/segmento definido, ou perfil investidor (baixa dedicação + gerente), ou score 42–59 |
| **C · Segmento saturado** | melhor operação cai em segmento já ocupado e fora do mix desejado (`mix ≤ 34`) |
| **Standby** | capital não sustenta a operação pretendida, ou não há ponto compatível com o formato |

Quando o **enquadramento** e o **ranking** divergem (o capital comporta uma loja,
mas o perfil leva a um quiosque, por exemplo), a ferramenta avisa e manda
prevalecer o ranking — ajustando a metragem da conversa.

---

## 4 · Base de operações

~50 operações de referência cobrindo **quiosque**, **loja satélite** e
**megaloja**, cada uma com faixa de área, taxa de entrada, implantação por m²,
faturamento por m²/mês, % de giro, payback, royalties, FPP, dedicação exigida,
experiência recomendada, complexidade e selos ABF / Destaque PEGN.

Para incluir ou ajustar operações, edite o array `BASE_OPS` em
`public/operacoes.html`:

| campo | significado |
|---|---|
| `n` · `seg` | nome e segmento (o segmento deve existir em `SEGMENTS`) |
| `form` | `quiosque` · `satelite` · `mega` |
| `aMin` / `aMax` | faixa de área da operação (m²) |
| `taxa` | taxa de franquia / entrada (R$) |
| `cm2` | implantação por m² (R$) — `investimento = taxa + cm2 × área` |
| `fm2` | faturamento por m²/mês (R$) |
| `gp` | capital de giro sugerido, como % da implantação |
| `payback` · `roy` · `fpp` | retorno em meses · royalties % · fundo de promoção % |
| `tempo` | `dono` \| `gerente` \| `passivo` |
| `exp` | `iniciante` \| `intermediario` \| `avancado` |
| `compl` | complexidade operacional (1–5) |
| `abf` / `pegn` | selo ABF / destaque PEGN (1/0) |

## 4b · Aprendizados do 1º mês: checagens, lacunas e follow-up

A consolidação dos leads de três executivos (outubro/2026) mostrou onde os
dados chegavam errados e onde a leitura do ranking enganava. Cada achado virou
um comportamento do app.

**Checagens da ficha (antes de concluir).** `checagens(lead, modo)` olha a
ficha e devolve avisos; nada bloqueia, mas o que fica passa marcado:

| Achado no 1º mês | O que o app faz agora |
|---|---|
| Nome da marca própria no campo empresa (3 leads) | Com marca própria, o campo vira "Nome da sua marca". Se ficar vazio, usa o nome da empresa e avisa |
| Rede de franquia marcada como marca própria | Avisa que a marca é uma rede da base e sugere marcar Franqueado |
| Giro maior que a implantação | Avisa que os valores podem estar trocados |
| Ticket de R$ 4 mil com faturamento de R$ 10 mil | Calcula as vendas por mês e pede para conferir |
| Giro, área, faturamento zerados; origem em branco | Um aviso por campo, com o link "corrigir" que leva ao campo |
| Celular sem o 9 | Avisa |

Na **ficha do lojista**, os avisos aparecem num passo "Confira antes de
concluir", com "Corrigir a ficha" ou "Seguir assim mesmo". Na **triagem do
executivo**, aparecem no topo do resultado como "Confira com o lead".

**Lacunas e explicação do ranking** (`lacunasHTML`), no resultado da triagem:

- *Lacuna da base*: o lead pediu um segmento que a base não tem no formato
  enquadrado (caso: livraria em quiosque). O aviso diz que o ranking traz
  outros segmentos e aponta para marcas indicadas e prompts de mapeamento.
- *Ranking × interesse*: o 1º do ranking está fora do segmento pedido. O
  aviso explica por quê (o mix das vagas pede outro segmento, ou a base tem
  mais marcas dele) e mostra a melhor opção dentro do segmento pedido.
- *Capital abaixo do mínimo*: nenhum formato cabe com os parâmetros atuais.
  O aviso mostra a conta e aponta para Planejamento › Parâmetros (caso de
  Uberlândia, onde o custo de quiosque é menor que a referência).

**Peso do interesse.** `W.interesse` subiu de 12 para 16 e a operação fora do
segmento pedido cai a 35 (era 50) na dimensão interesse. Marcas indicadas e
marca em mente não mudam.

**Follow-up na aba Leads.** Lead ativo sem atualização há mais de 7 dias ganha
a etiqueta "sem atualização há N dias"; lead que a triagem mandou para Standby
(ou saída C) e segue no funil ganha "triagem indicou Standby — confirme o
estágio". O filtro de status tem as opções "Parados há +7 dias" e "Estágio ≠
triagem".

**Nome do shopping nos arquivos.** O Excel (CSV) e o Backup saem como
`radar-varejo-leads-<shopping>.csv` e `radar-varejo-backup-<shopping>.json`,
com o nome do shopping do Planejamento. Na consolidação, é o que diz de onde
veio cada base.

**Revisão de outubro/2026 (o que mudou de comportamento).**

- A mesma ficha recebida duas vezes (mesmo nome e contato) pergunta se
  atualiza o lead existente em vez de criar um duplicado; a origem
  "Ficha do operador" aparece no seletor de origem e é preservada ao reeditar.
- Depois de Salvar, a triagem fica limpa: o resultado salvo não pode ser
  salvo de novo. Editar um lead que foi excluído no meio grava como novo.
- A anotação do executivo é guardada enquanto digita; buscar, filtrar ou
  mudar o estágio não apaga o texto. O briefing só recalcula quando a base
  muda, não a cada tecla da busca.
- "Ranking × interesse" também explica quando o 1º é uma marca indicada
  ("é marca indicada pelo shopping para Q-03").
- Saída C recém-salva (estágio Triagem) não aparece como divergência; só se
  avançar para Viabilidade ou Proposta.
- Importar o backup de um colega atualiza os campos do shopping, os chips de
  outros shoppings, e sane pontos e leads (id, formato, tipo). Um lead com
  formato desconhecido vale como "indiferente" em vez de quebrar a aba Leads.
- A ficha do lojista é avaliada sem nenhum ponto (nem os de exemplo), com os
  cartões na ordem da nota exibida, e com textos escritos para quem preenche.
- No CSV, quebras de linha das notas viram " / ", para colar na planilha.
- Standby com capital suficiente diz "rever metragem, formato ou segmento"
  em vez de culpar o capital.

**Base fictícia para testes.** `public/exemplos/radar-varejo-base-teste.json`
(17 leads, 10 pontos, parâmetros e shopping fictícios) e
`public/exemplos/fichas-para-receber.txt` (3 fichas prontas) cobrem os casos
acima; o roteiro está em `public/exemplos/LEIA-ME-base-de-teste.md`. Importa
em Leads › Importar; nada ali é real.

**Ajustes de 27/10/2026 (pedidos após o teste com o time).**

| Ajuste | Comportamento |
|---|---|
| Prompts | Saem do Planejamento para a aba **Prompts**, como apoio (seção 5b) |
| Lojistas da casa | Nova aba; quem quer investir entra no Cruzamento com etiqueta (seção 5c) |
| Estado da LUC | Adequações por ponto somam à implantação do lojista (seção 5d) |
| Tipo de espaço | Ficha e triagem: **Não sei · Quiosque · Loja**. Internamente, a loja segue dividida em satélite e megaloja pela área ou pelo capital, porque os custos diferem; a ficha mostra só "Loja". Leads antigos de satélite ou megaloja abrem como Loja |
| Perfil na ficha | **Quero ser franqueado · Quero criar minha marca · Já tenho minha marca própria**. Multifranqueado fica só na triagem do executivo, que mantém as quatro opções |
| Sugestão de marcas | A ficha não sugere marcas: mostra o formato e o próximo passo; o campo de marca não tem exemplos nem autocompletar. O ranking continua para o executivo, como apoio ao speech |

---

## 5 · Parâmetros do empreendimento (aba Planejamento)

Padrões de referência — **ajuste com os números do seu shopping**:

| Parâmetro | Quiosque | Satélite | Megaloja |
|---|:--:|:--:|:--:|
| Implantação (R$/m²) | 16.000 | 5.000 | 3.000 |
| Aluguel mínimo (R$/m²/mês) | 1.200 | 115 | 55 |
| Condomínio (R$/m²/mês) | 250 | 55 | 30 |
| Faixa de área (m²) | até 12 | 20–150 | 150+ |

FPP = 10% do aluguel · IPTU e taxas = 4% do CTO.

---

## 5a · Marcas indicadas por ponto (aba Planejamento)

Cada ponto vago aceita até **5 marcas indicadas** pelo executivo, além do mix
por segmento. O mix diz "que tipo de operação"; a indicação diz "qual marca":
quem tem aderência ao ponto e à estratégia do shopping, quem já procurou o
shopping, quem está atrás de investidor. É informação que a base de
referência não tem.

Cada indicação tem marca, segmento e o motivo:

| Motivo | Bônus no score |
|---|:--:|
| Aderente ao ponto e à estratégia | +3 |
| Quer entrar no shopping | +5 |
| Procura investidor / franqueado | +6 |

**No ranking do lead** (triagem, briefing, ficha recebida), a marca indicada
entra ao lado da base de 58 operações, com `mix` = 100 e o bônus do motivo
mais forte. Ela continua passando pelas travas (capital, giro, área, CTO): uma
indicação não faz caber o que não cabe. Em empate, a indicada vem primeiro.
O resultado da triagem ganha o bloco **★ Marcas indicadas pelo shopping**, que
mostra todas as indicadas avaliadas para aquele perfil, inclusive as que
ficaram fora do top 8. No briefing, as indicadas levam ★ e as que cabem fora do
top 3 aparecem numa linha própria.

**Marca fora da base** (ex.: Biscoitê, American Cookies) recebe os valores
típicos do segmento no formato: mediana de taxa, implantação por m²,
faturamento por m², giro e payback, e o perfil de operação mais comum do
segmento. O cartão avisa para confirmar na COF. Marca que está na base usa os
números dela.

**No Cruzamento**, o ponto mostra as indicadas, e uma marca indicada para o
ponto é avaliada nele mesmo que fuja da área de referência ou do mix: foi o
executivo quem a colocou ali. O bônus só vale no ponto da indicação.

**Nos prompts de mapeamento**, as indicadas entram como marcas já conhecidas,
para o modelo não repeti-las.

As indicações ficam no Planejamento: vão junto no Backup e no Importar, saem
na coluna `marcas_indicadas` do Excel (CSV) e são apagadas quando o ponto vira
ocupado.

Origem: sugestão do Alê (BH), a partir de um caso real. Para um lojista do
shopping aberto a novos negócios, a base sugeriu seis marcas e nenhuma
interessou; ele avançou com Biscoitê e American Cookies, que o executivo já
sabia que procuravam investidor. Com as duas indicadas no quiosque, elas
passam a liderar o ranking desse perfil.

---

## 5b · Prompts de mapeamento de varejistas (aba Prompts)

Desde 27/10/2026 os prompts ficam numa aba própria, depois do Cruzamento, com o
aviso de que são **apoio para complementar a base de marcas desejo** e não fazem
parte do fluxo principal. Os dados do shopping (nome, cidade, região e site)
ficaram no Planejamento, porque também alimentam a ficha e os nomes dos arquivos.

O executivo leva as vagas e o mix desejado para o modelo que preferir (Claude,
ChatGPT, Gemini…) e volta com marcas candidatas. O card monta o prompt a partir
do Planejamento: vagas com mix (ponto, formato, área e as opções em ordem),
segmentos-alvo do mais pedido ao menos, e as marcas que já operam no shopping
(ficam fora da busca). Pede o nome do shopping, a cidade/UF, o site do shopping
(página de lojas) e um raio mínimo e máximo (padrão 2 e 50 km), guardados junto
com o planejamento (entram no Backup).

**Diretório de lojas primeiro.** Todo prompt começa mandando o modelo abrir o
diretório de lojas no site do shopping e extrair a lista completa do que já
opera lá: é a lista de exclusão, somada às marcas cadastradas no Planejamento
(que é parcial). A resposta abre com um item de verificação (data da consulta,
operações encontradas por segmento, candidatas descartadas) e a tabela ganha a
coluna "Já opera em shopping Allos? (quais)". Em caso de dúvida (nome parecido,
mesma rede com outro nome fantasia), a regra é tratar como presente.

Quatro escopos, que não se sobrepõem:

| Botão | O que busca |
|---|---|
| Operações de rua | marcas em loja de rua na cidade (e, se interior, nas 2–3 maiores vizinhas) que ainda não estão em shopping |
| Rua + shoppings no raio | marcas de rua ou de shopping entre o raio mínimo e o máximo; dentro do mínimo é área de influência (fora), acima do máximo deixa de ser expansão natural (fora) |
| Nativos digitais | marcas nascidas no e-commerce, Instagram, TikTok ou marketplaces, com sinais de maturidade para a 1ª loja física ou quiosque de experiência |
| Portfólio Allos fora da região | cruzamento de diretórios: lista dos shoppings Allos no site institucional → diretório de lojas de cada um → marcas dos segmentos-alvo → menos o diretório deste shopping → menos quem tem loja a menos do raio máximo. Traz marcas que não aparecem nas demais |

Cada prompt segue a estrutura das skills de prospecção do Shopping Inteligente
(mandamentos 4 e 6, hunter, regional hunter): papel, contexto, escopo, método
(5 a 10 marcas por segmento, prontidão verde/amarela/vermelha, filtro Zell,
casamento com a vaga), fontes, tabela de saída com 13 colunas, top 5, lacunas,
alertas e próximos passos, e regras (nada inventado, fonte por marca, sem repetir
marcas presentes).

**Modelo de IA.** Acima dos tipos de busca, o executivo escolhe entre
**Claude · ChatGPT · Gemini** (versão completa) e **Microsoft Copilot**. A
escolha fica salva no aparelho. A versão para o Copilot existe por causa do
tamanho:

- O chat do Microsoft 365 Copilot aceita até 16 mil caracteres por mensagem,
  mas há relatos de corte em 8 mil, e as instruções de um agente do Copilot
  param em 8 mil. A versão completa passa disso com muitas vagas.
- A versão Copilot diz o mesmo em menos texto: diretório de lojas primeiro,
  vagas, segmentos-alvo, escopo, método, tabela de 10 colunas, top 5 e
  lacunas. Fica entre 3 e 6 mil caracteres. Se passar de 8 mil, o mix sai da
  lista de vagas (continua nos segmentos-alvo). Um contador abaixo do prompt
  mostra o tamanho.
- Ela pede a **pesquisa na web** de forma explícita e manda não usar arquivos,
  e-mails ou chats da empresa: no ambiente corporativo o Copilot também lê
  esses dados. Se a pesquisa na web estiver desligada, o modelo deve avisar e
  parar, em vez de responder de memória.
- No lugar de **Skill completa**, o botão vira **Agente Copilot**: um .txt
  com o passo a passo para criar um agente no Microsoft 365 Copilot (nome,
  descrição, instruções com as quatro buscas abaixo de 8 mil caracteres,
  pesquisa na web ligada e quatro prompts iniciais). Sem permissão para criar
  agentes, o executivo usa Copiar, uma busca de cada vez.

**Copiar** leva o prompt atual à área de transferência. **Baixar .txt** salva o
prompt atual no formato de skill (cabeçalho `name`/`description` + instruções).
**Skill completa** salva um único .txt com os quatro escopos e um guia de uso,
para guardar no modelo e reutilizar. Os prompts refletem o Planejamento no
momento da geração: mudou o mix, gere de novo.

## 5c · Lojistas da casa (aba Lojistas)

Cadastro de quem já opera no shopping: lojista, contato, marca e LUC atuais,
segmento, **interesse** (investir em nova marca · levar a marca a outros
shoppings · os dois), capital para o novo investimento, giro (opcional),
formato de interesse (não sei · quiosque · loja), segmentos de interesse,
shoppings de interesse, status (a contatar · em conversa · sem interesse) e
observações.

- **No Cruzamento**: entra quem tem interesse em nova marca (ou nos dois),
  capital informado e status diferente de "sem interesse", com a etiqueta
  **Lojista da casa**. Para o score, o lojista conta como experiente em varejo
  e em shopping, com dedicação parcial e gerente na loja. Respeita o formato de
  interesse e não recebe a marca que já opera.
- **Planilha**: Excel (CSV) exporta; **Modelo** baixa o formato; **Importar**
  aceita .xlsx ou CSV e atualiza quem já existe (mesmo nome e contato).
- Os lojistas vão no **Backup** da aba Leads.

## 5d · Estado da LUC e adequações (aba Planejamento)

Cada ponto vago tem o **estado da LUC** (texto livre, ex.: "casco nu, sem
mezanino") e até 8 **adequações**, cada uma com descrição, **valor em R$** e os
segmentos a que se aplica (texto livre; vazio ou "todos" vale para qualquer
segmento; um termo vale se estiver no nome do segmento, ex.: "calçados" →
Calçados & bolsas).

A adequação é paga pelo lojista: quando o score é calculado para aquele ponto,
o valor das adequações que valem para o segmento da operação **soma à
implantação**. Isso reduz a nota de quem não cobre o custo e aparece no
Cruzamento ("implantação R$ X, inclui R$ Y de adequação"), nos pontos sugeridos
da triagem e no briefing. Estado e adequações vão no CSV e no backup do
Planejamento.

## 6 · Briefing da vacância (aba Leads)

Saída de texto para acompanhamento diário, **organizada pela lógica do
Planejamento**: a pergunta que abre o dia não é "quais leads chegaram" e sim
"quais vagas eu preciso preencher e quem serve para elas". Escolhe-se o período
— hoje, últimos 7 ou 30 dias, ou a base inteira — e a saída pode ser copiada,
baixada em `.txt` ou mandada por WhatsApp.

A ordem do documento é a ordem da prioridade:

1. **Cobertura da vacância.** Quantas LUCs vagas já têm candidato de match ≥ 60,
   e quantas tiveram movimentação no período.
2. **Vacância por LUC.** Cada vaga, com tipologia, área e mix desejado, seguida
   dos candidatos — lead, operação de encaixe, match, capital disponível, perfil
   e contato. Vagas com melhor candidato aparecem primeiro; um 🆕 marca quem
   entrou ou foi mexido no período. Vaga sem candidato é sinalizada como aberta
   para captação.
3. **Lacunas de captação.** Os segmentos pedidos pelas vagas que seguem sem
   candidato — a lista de compras da prospecção.
4. **Aguardando oportunidade no mix.** Os leads ativos que nenhuma vaga de hoje
   comporta, com metragem-alvo para busca reversa e a operação mais próxima do
   perfil.
5. **Dossiês dos leads do período.** Um bloco por lead, para quem vai fazer a
   abordagem: identificação e origem, perfil da oportunidade, capacidade
   financeira, perfil do operador, premissas comerciais, direcionamento com nota
   de aderência e pontos de atenção, as LUCs que dão match, as três operações
   mais aderentes e a mensagem de abordagem já escrita.

> [!important] Sem planejamento, não há briefing
> Se não houver ponto vago cadastrado, o briefing não finge que há: avisa que
> sem as LUCs — tipologia, área e mix — não existe vacância a priorizar e que o
> ranking passa a ponderar só o perfil do lead. Os dossiês ainda saem, mas
> abaixo do aviso.

> [!note] É recalculado, não é o que ficou salvo
> Enquadramento, ranking e direcionamento dependem do Planejamento — mix
> desejado das vagas, marcas já presentes, pontos vagos. Isso muda de um dia
> para o outro, e um briefing de hoje precisa refletir o shopping de hoje.

### Ninguém sai da lista

Sob cada vaga os leads aparecem em dois grupos. Acima de 42 são **candidatos**,
com a operação de encaixe e o match. Abaixo disso entram em **fit baixo,
mantidos no radar** — continuam visíveis, mas com o próximo passo escrito ao
lado em vez de um número ruim solto:

- se existe uma **LUC vaga onde o lead já é forte candidato** (match ≥ 60), é
  ela que aparece — é o encaminhamento mais útil e evita dizer "aguardando"
  para quem tem vaga esperando;
- se não há vaga mas há **operação aderente ao perfil** (≥ 60), recomenda-se a
  operação;
- se não há nem uma nem outra, fica **"aguardando oportunidade no mix"**.

A vaga só é contada como coberta quando tem candidato de match ≥ 60 — o fit
baixo não maquia a cobertura nem tira o segmento das lacunas de captação.

### A lacuna conta a vaga, não o segmento

**A lacuna conta a vaga, não o segmento.** Uma vaga que pede
`Vestuário masculino › Esporte` e já tem um bom candidato de Esporte está
resolvida — listar "Vestuário masculino" como lacuna mandaria o time captar o
que não falta. Só entram na lista os segmentos de vagas que seguem sem
candidato de match ≥ 60.

### As LUCs do "Match sugerido" no dossiê

É o Cruzamento invertido. Lá a pergunta é "quais leads servem para este ponto";
no dossiê é "quais pontos servem para este lead", com os mesmos filtros: mesmo
formato, área dentro da faixa da operação, segmento dentro do mix desejado da
vaga e marca ainda não presente no shopping.

Essa diferença precisa ser dita porque o ranking usa um critério mais frouxo —
considera ponto compatível só por formato e área, sem olhar o mix. Quando um
critério passa e o outro não, o dossiê avisa que existe LUC cabendo em formato
e área mas fora do mix, e sugere as duas saídas: revisar o mix da vaga ou levar
ao lead um segmento que já esteja nas prioridades. Sem isso, o mesmo texto
diria "ponto disponível" no direcionamento e "nenhuma LUC" no match.

### Mensagem sugerida

Muda conforme a saída do direcionamento: a de saída A cita a LUC de melhor
match, a de saída B evita ponto e valores e propõe apresentar categorias, a de
saída C reconhece a saturação e oferece alternativa, e a de standby preserva o
relacionamento sem prometer vaga.

### Limite do botão de WhatsApp

O `wa.me` carrega o texto na própria URL e trunca acima de alguns milhares de
caracteres. Acima de 3.000 o botão avisa e não abre, em vez de mandar meio
briefing: nesse caso o caminho é **Copiar** ou reduzir o período.

## Fontes e ressalvas

Valores de implantação, faturamento por m², payback, royalties e fundo de
promoção são **referências**, compiladas de material público da **ABF** e do
**PEGN** e de práticas correntes do varejo de shopping.

> ⚠️ Números reais variam por praça, formato, ano e negociação. **Confirme na COF**
> e na proposta comercial antes de qualquer decisão. A ferramenta é apoio à
> decisão do executivo — **não substitui** a análise financeira formal nem a
> due diligence.

## Relacionadas

- [[workflow-qualificacao-leads/Fluxo-de-Qualificacao-de-Leads|Fluxo de Qualificação de Leads]] — o workflow que esta ferramenta executa
- [[workflow-qualificacao-leads/Perfil-do-Cliente|Perfil do cliente — detalhamento]] — a lógica de perfil, em papel
- [[RADAR-QUIOSQUES|Radar Quiosques]] — a ferramenta de origem (só quiosques)
- [[Shopping-Inteligente|Shopping Inteligente]] · [[Agente-Farmer-e-Conector-de-Quiosques|Agente Farmer]]
