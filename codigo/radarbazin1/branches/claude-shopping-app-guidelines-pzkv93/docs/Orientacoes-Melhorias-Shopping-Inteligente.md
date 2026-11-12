---
title: Orientações de Melhoria — Shopping Inteligente
aliases:
  - Orientações Shopping Inteligente
  - Roadmap Shopping Inteligente
tags:
  - shopping-inteligente
  - orientacoes
  - roadmap
  - base-unica
  - cluster-positioning
  - builder
created: 2026-07-08
updated: 2026-07-21
status: orientação
---

# Orientações de Melhoria — Shopping Inteligente

> [!abstract] Sobre este documento
> Orientações de evolução do conceito de **[[Shopping Inteligente]]** e das
> ferramentas do repositório (a começar pelo [[Radar Quiosques]],
> `public/quiosques.html`). Cada orientação está escrita para ser **executável
> pelo Claude Code**: contexto, objetivo, o que construir (campos e regras),
> critérios de aceite e dependências. A ordem importa — as duas primeiras são
> **fundação** (base única) e destravam as demais.

## Índice
- [[#Visão geral e ordem de execução]]
- **Ciclo 1 — Fundação e novos agentes**
	- [[#Orientação 1 — Base única de investidores]]
	- [[#Orientação 2 — Cadastro único de pontos (lojas e quiosques)]]
	- [[#Orientação 3 — Agente Cluster Positioning]]
	- [[#Orientação 4 — Agente Builder (fornecedores de obra)]]
- **Ciclo 2 — Goal, contexto do shopping e revisão dos agentes**
	- [[#Orientação 5 — O Goal como norte de todos os agentes]]
	- [[#Orientação 6 — Shopping ativo: o contexto que governa o sistema]]
	- [[#Orientação 7 — Farmer: base de mix ideal do planejamento comercial]]
	- [[#Orientação 8 — Deal Conversion Layer: dashboard do funil com termômetro de prazo]]
	- [[#Orientação 9 — Hunter: correções de busca, filtros múltiplos, faixa de distância e ruas quentes]]
- [[#Glossário]]

---

## Visão geral e ordem de execução

Hoje cada ferramenta guarda seus dados em `localStorage` (por navegador e por
dispositivo). Isso funciona para **um** executivo, mas quebra o conceito de
Shopping Inteligente quando há **vários agentes** (Farmer, Cluster Positioning,
Builder…) e vários executivos: cada um enxerga uma base diferente.

```
        HOJE (silos)                        ALVO (base única)
 ┌──────────┐ ┌──────────┐           ┌─────────────────────────────┐
 │ Agente A │ │ Agente B │           │   Banco único (Postgres)    │
 │ localSt. │ │ localSt. │    ──►    │ investidores │ pontos │ ... │
 └──────────┘ └──────────┘           └──────┬───────────┬──────────┘
   bases divergem, campos              ┌────┴───┐  ┌────┴───┐
   diferentes, retrabalho              │Agente A│  │Agente B│  (todos leem
                                       └────────┘  └────────┘   e escrevem
                                                                 na mesma base)
```

| # | Orientação | Tipo | Depende de |
|---|------------|------|------------|
| 1 | Base única de **investidores** | Fundação (dados) | — |
| 2 | Cadastro único de **pontos** (lojas e quiosques) | Fundação (dados) | — |
| 3 | Agente **Cluster Positioning** (batalhas do cluster) | Novo agente | 2 (pontos) |
| 4 | Agente **Builder** (fornecedores de obra) | Novo agente | 2 (pontos, opcional) |

> [!note] Infra já disponível
> O repositório já tem **Next.js + Prisma + PostgreSQL** funcionando (Neon +
> Vercel). A base única deve usar essa stack — é a "evolução possível" já
> apontada em [[Agente Farmer e Conector de Quiosques]] §5. Não introduzir
> outro banco ou outro ORM.

---

## Orientação 1 — Base única de investidores

### Contexto
Cada instância do Radar Quiosques guarda seus investidores no `localStorage`
do navegador. Dois executivos (ou dois agentes) nunca veem a mesma base; os
campos podem divergir conforme a versão da ferramenta; e a troca de dados hoje
depende de export/import manual (CSV / backup JSON / código `RQ1:`).

### Objetivo
**Uma única base de investidores, em um único banco, com um único conjunto de
campos, consumida por todos os agentes.** Qualquer investidor cadastrado ou
atualizado por um agente aparece imediatamente para os demais.

### O que construir
1. **Modelo canônico `Investidor` no Prisma** (`prisma/schema.prisma`) — o
   contrato de campos passa a ser o schema, não o front. Campos mínimos,
   espelhando a triagem atual:
   - Identificação: `nome`, `contato` (telefone/e-mail), `origemLead`.
   - Capacidade: `capitalImplantacao`, `capitalGiro` (**sempre separados** —
     ver princípio em [[Agente Farmer e Conector de Quiosques]] §3.1),
     `fonteCapital`.
   - Dedicação: `tempo` (integral/parcial/baixa), `operacao` (dono/gerente).
   - Experiência: `experiencia`, `segmentosConhecidos`, `jaFranqueado`.
   - Intenção: `marcaEmMente`, `segmentosInteresse`, `perfilRisco`, `objetivo`.
   - Gestão: `status` (Novo/Em contato/Proposta/Fechado/Descartado),
     `anotacoes`, `criadoEm`, `atualizadoEm`, `criadoPor` (agente/executivo).
2. **API de investidores** (`app/api/investidores/…`): listar, criar,
   atualizar, buscar. Toda leitura/escrita dos agentes passa por aqui — nenhum
   agente mantém cópia própria dos campos.
3. **Migração do Radar Quiosques**: a ferramenta passa a ler/gravar na API.
   Manter `localStorage` apenas como **cache/rascunho offline**, com
   sincronização ao reconectar — nunca como fonte de verdade.
4. **Importador de legado**: botão "Enviar minha base local para o banco"
   que sobe o backup JSON/CSV atual, deduplicando por contato (telefone ou
   e-mail normalizado).
5. **Dicionário de dados** em `docs/` listando cada campo, tipo, valores
   aceitos (rótulo e código) e qual agente o usa — é o que garante que "os
   campos de informação são os mesmos" também para humanos preenchendo
   planilha.

### Critérios de aceite
- [ ] Investidor cadastrado pela Triagem em um dispositivo aparece na aba
      Investidores de outro dispositivo/executivo sem export/import manual.
- [ ] O código `RQ1:` da ficha do investidor grava direto no banco.
- [ ] Import CSV continua funcionando e valida contra o schema canônico
      (rejeita coluna desconhecida com mensagem clara, aceita rótulo ou código).
- [ ] Nenhum agente define campo de investidor fora do schema Prisma.

---

## Orientação 2 — Cadastro único de pontos (lojas e quiosques)

### Contexto
O planejamento por pontos (ocupados/vagos com até 3 opções de mix) hoje é do
Radar Quiosques e vive no `localStorage`, cobrindo só **quiosques**. Os novos
agentes (Cluster Positioning, Builder) também precisam saber quais pontos
existem, onde e em que estado — e a resposta tem que ser a mesma para todos.

### Objetivo
**Um cadastro único de pontos do shopping — lojas E quiosques — no mesmo banco
da Orientação 1, compartilhado por todos os agentes.** O ponto é a entidade
central do empreendimento: o Farmer o usa para mix e cruzamento, o Cluster
Positioning para posicionamento, o Builder para obras.

### O que construir
1. **Modelo `Ponto` no Prisma**:
   - `nome`/código do ponto, `tipo` (**loja** | **quiosque**), `piso`/área
     (localização), `metragem`.
   - `status` (**ocupado** | **vago** | em obra — ver Builder).
   - Se ocupado: `marca` que opera e `segmento`.
   - Se vago: `mix1`, `mix2`, `mix3` (opções de mix desejado, em ordem de
     preferência — 1ª pesa mais, como hoje).
   - `cluster` ao qual o ponto pertence (usado pela Orientação 3).
2. **API de pontos** (`app/api/pontos/…`) com as mesmas garantias da
   Orientação 1: agentes leem/escrevem só via API.
3. **Migração do Radar Quiosques**: aba Planejamento passa a operar sobre a
   base única; o importador CSV de pontos existente (`nome, status, marca,
   mix1..3`) ganha as colunas novas (`tipo`, `piso`, `metragem`, `cluster`) e
   continua tolerante (`,` ou `;`, aspas, linhas `#`, match parcial de
   segmento).
4. **Regra de unicidade**: um ponto é identificado por código único no
   empreendimento; dois agentes nunca criam registros duplicados do mesmo
   ponto (upsert por código).

### Critérios de aceite
- [ ] Um ponto vago cadastrado por qualquer agente aparece idêntico (mesmos
      campos, mesmo status) para todos os demais.
- [ ] O cruzamento do Farmer (ponto vago × investidor × marca) roda sobre a
      base única sem mudança de comportamento na pontuação.
- [ ] Lojas e quiosques convivem no mesmo cadastro, filtráveis por `tipo`.

---

## Orientação 3 — Agente Cluster Positioning

### Contexto
Novo capítulo do Shopping Inteligente. Cada **cluster** do shopping (agrupamento
de pontos por região/vocação — ex.: praça gourmet, corredor de moda, área
família) disputa **batalhas de posicionamento**: frentes nas quais o cluster
quer ganhar na cabeça do cliente (ex.: "melhor happy hour da região",
"destino de moda jovem", "programa de família de fim de semana").

### Objetivo
Cadastrar as **batalhas de cada cluster** e **cruzá-las com as marcas e os
eventos cadastrados**, validando quem de fato atua em cada batalha. Quando a
base não tiver opções aderentes (ou os campos de aderência estiverem vazios),
o agente **busca na internet** e sugere eventos e lojas mais aderentes às
batalhas.

### O que construir
1. **Modelo `Cluster`**: nome, descrição/vocação, pontos associados (via campo
   `cluster` da Orientação 2).
2. **Modelo `Batalha`** (pertence a um cluster):
   - `nome` (ex.: "happy hour"), `descricao` (o que significa ganhar essa
     batalha), `publicoAlvo`, `palavrasChave` (termos que caracterizam a
     batalha — usados no matching e na busca), `prioridade`.
3. **Modelo `Evento`**: nome, tipo, data/período, cluster onde acontece,
   público esperado, `batalhasAtendidas` (preenchido manualmente ou pelo
   matching). Hoje não existe cadastro de eventos — criar do zero.
4. **Motor de cruzamento batalha × marca × evento**:
   - Para cada batalha, varrer as **marcas** (dos pontos ocupados + base de
     marcas) e os **eventos** cadastrados e classificar a aderência
     (**atua** / **atua parcialmente** / **não atua**), usando segmento,
     descrição e `palavrasChave`.
   - Saída por cluster: **mapa de batalhas** — quais estão bem servidas, quais
     estão descobertas (nenhuma marca/evento aderente).
   - Seguir a regra de transparência da nota: toda classificação vem com o
     "porquê" ([[Agente Farmer e Conector de Quiosques]] §4).
5. **Busca na internet quando a base não responde** (o "filtro de busca"):
   - **Gatilho**: batalha sem nenhuma marca/evento aderente na base, **ou**
     base com campos de aderência não preenchidos.
   - **Ação**: montar consulta a partir de `nome + palavrasChave + publicoAlvo`
     da batalha (+ cidade/região do shopping) e buscar **eventos** (feiras,
     ativações, calendário local) e **lojas/marcas** que operem no tema.
   - **Saída**: lista de sugestões com nome, tipo (evento/loja), fonte (URL),
     e a batalha que atende — com ação de 1 clique para **incorporar à base**
     (vira `Evento` cadastrado ou marca desejada do cluster).
   - Sugestão de internet é sempre **rascunho até curadoria do executivo** —
     o agente organiza, a curadoria é humana (princípio §4).

### Critérios de aceite
- [ ] Consigo cadastrar clusters e batalhas e ver, por batalha, quais marcas e
      eventos da base atuam nela (com justificativa).
- [ ] Batalha descoberta (sem aderentes) dispara a busca na internet e retorna
      sugestões de eventos e lojas com fonte, sem gravar nada na base antes da
      aprovação do executivo.
- [ ] Evento incorporado de uma sugestão entra na base única e passa a contar
      no cruzamento das batalhas.

### Dependências e observações
- Depende da Orientação 2 (pontos com `cluster`).
- A busca na internet requer backend com acesso a uma API de busca — mais um
  motivo para a fundação das Orientações 1–2 (o app 100% estático não faz
  essa chamada com segurança).

---

## Orientação 4 — Agente Builder (fornecedores de obra)

### Contexto
Entre a assinatura do contrato e a inauguração existe a **obra** do ponto —
hoje sem apoio de dado nenhum. O executivo/lojista precisa indicar
fornecedores, e a informação de quem já fez obra no shopping (e para qual
segmento, e com que qualidade) se perde.

### Objetivo
Criar **campo e base de cadastro de fornecedores de obra**, organizados pelo
**porte da obra** que atendem, com **qualificação**, **especialidade** e
**histórico dos segmentos para os quais já fizeram obra no shopping**, abertos
pelos segmentos de obra: **gerenciamento, medição, civil, marcenaria,
marmoraria e turnkey**.

### O que construir
1. **Modelo `Fornecedor`** (na base única):
   - Identificação: `nome`, `contato`, `cnpj` (opcional).
   - `segmentosObra`: um ou mais entre **gerenciamento | medição | civil |
     marcenaria | marmoraria | turnkey** (enum fixo; um fornecedor pode atuar
     em vários).
   - `porteObra`: portes que atende — **quiosque | loja pequena | loja média |
     loja âncora** (faixas de m² definidas no dicionário de dados; um
     fornecedor pode atender mais de um porte).
   - `qualificacao`: nota/avaliação do shopping (ex.: 1–5) + certificações e
     exigências atendidas (seguro, ART, cadastro na administração).
   - `especificidade`: texto curto do que o diferencia (ex.: "marcenaria de
     alto padrão para joalheria", "turnkey expresso ≤ 30 dias").
2. **Modelo `Obra` (histórico)** — o que dá memória ao agente:
   - `fornecedor`, `ponto` (da base única — Orientação 2), `segmentoLoja`
     (alimentação, moda, joalheria…), `segmentoObra` executado, `porte`,
     `periodo`, `avaliacao` + observações (prazo cumprido? retrabalho?).
   - O histórico por **segmento de loja** é requisito explícito: "quem já fez
     obra de restaurante aqui?" precisa ter resposta direta.
3. **Consulta do agente** ("quem indico para esta obra?"):
   - Entrada: ponto (→ porte via metragem) + segmento da futura loja +
     segmentos de obra necessários.
   - Saída: fornecedores ranqueados por **aderência de porte + qualificação +
     histórico no segmento**, com o porquê de cada indicação (transparência).
4. **Integração com pontos**: status **"em obra"** no `Ponto` (Orientação 2),
   ligando o ponto às obras em andamento.
5. **Importador CSV** de fornecedores no mesmo padrão dos demais (modelo para
   baixar, tolerante a `;`, rótulo ou código nos enums).

### Critérios de aceite
- [ ] Fornecedor cadastrado com múltiplos segmentos de obra e portes aparece
      nas consultas de todos os agentes (base única).
- [ ] Consulta por porte + segmento de loja + segmento de obra retorna ranking
      com justificativa, priorizando quem tem histórico naquele segmento no
      próprio shopping.
- [ ] Histórico de obra registrado em um ponto fica visível na ficha do ponto
      e na ficha do fornecedor.

---

# Ciclo 2 — Goal, contexto do shopping e revisão dos agentes

> [!abstract] Sobre este ciclo
> O Ciclo 1 criou fundação (base única) e novos agentes. O Ciclo 2 faz três
> movimentos: (a) fixa o **Goal** como critério de revisão de **todos** os
> agentes; (b) coloca o sistema inteiro para girar em torno de **um shopping
> selecionado por vez**; (c) corrige e evolui agentes específicos — Farmer,
> Deal Conversion Layer e Hunter.

| # | Orientação | Tipo | Depende de |
|---|------------|------|------------|
| 5 | O **Goal** como norte de todos os agentes | Revisão transversal | — |
| 6 | **Shopping ativo** como contexto global | Fundação (contexto) | — |
| 7 | Farmer: base de **mix ideal** do planejamento comercial | Evolução de agente | 6 |
| 8 | **Deal Conversion Layer**: dashboard do funil + termômetro | Evolução de agente | 6 |
| 9 | Hunter: **correções de busca**, filtros múltiplos, faixa de distância e **ruas quentes** | Correção + evolução | 6 |

---

## Orientação 5 — O Goal como norte de todos os agentes

### Contexto
Os agentes cresceram em número (Farmer, Hunter, Cluster Positioning, Builder,
Seller, Entertainer, KA, Governance…) e cada um resolve um pedaço do problema.
Falta o critério unificador: **para que** cada agente existe e **qual alavanca
do resultado do shopping** ele move.

### O Goal (norte oficial — usar este texto, na íntegra, em todo agente)

> [!important] Goal
> **"O objetivo dos shoppings é trazer as melhores ofertas de lojas, serviços,
> entretenimento e gastronomia, visando aumentar a frequência de visita e o
> ticket médio gasto nas lojas, com uma experiência qualificada, gerando
> encantamento para seus consumidores e maximizando venda para seus lojistas e
> anunciantes, com isso, maximizando o retorno sobre investimento aos
> empreendedores de shoppings a longo prazo."**

Para isso, é necessário **planejar e executar a seleção ideal de mix de
lojas**, maximizar processos para a **gestão das lojas**, o **crescimento das
vendas das lojas** e a **velocidade na reposição de lojas**, acelerando a
entrada do lojista no shopping — **desde a prospecção, assinatura do contrato
e obra, até a alavancagem financeira e de vendas** — através de todo o
ecossistema do shopping: **eventos, programa de benefícios e mídia**.

### O que fazer
1. **Registrar o Goal como artefato do sistema** — um único lugar canônico
   (ex.: `docs/GOAL.md` + constante no código/skill compartilhada), citado por
   todos os agentes. Nenhum agente parafraseia o Goal com texto próprio.
2. **Revisitar todos os agentes contra o Goal.** Para **cada** agente
   existente, produzir e manter uma seção "Como sirvo ao Goal" declarando:
   - **Alavancas de resultado** que move: frequência de visita · ticket médio ·
     experiência/encantamento do consumidor · venda do lojista e anunciante ·
     ROI do empreendedor no longo prazo.
   - **Alavancas de processo** que acelera: seleção ideal de mix · gestão e
     crescimento de vendas das lojas · velocidade de reposição de lojas ·
     entrada do lojista (prospecção → contrato → obra → alavancagem) ·
     ecossistema (eventos, programa de benefícios, mídia).
   - **O que está fora** do seu escopo (evita sobreposição entre agentes).
3. **Mapa de cobertura Goal × agentes**: uma tabela única mostrando qual
   agente cobre qual alavanca. Alavanca sem agente = lacuna declarada;
   alavanca com muitos agentes = candidata a consolidação.
4. **Critério de priorização**: toda melhoria futura (deste documento em
   diante) declara em uma linha qual alavanca do Goal atende. Melhoria que não
   move nenhuma alavanca não entra no roadmap.

### Critérios de aceite
- [ ] O Goal existe em um único lugar canônico e é citado (não parafraseado)
      por todos os agentes.
- [ ] Cada agente tem sua seção "Como sirvo ao Goal" com alavancas de
      resultado, de processo e escopo negativo.
- [ ] Existe o mapa de cobertura Goal × agentes, com lacunas e sobreposições
      explicitadas.

---

## Orientação 6 — Shopping ativo: o contexto que governa o sistema

### Contexto
Os agentes hoje operam sem um empreendimento definido — cada ferramenta assume
implicitamente "o shopping". Com vários agentes (e futuramente vários
empreendimentos), isso gera ambiguidade: busca a partir de onde? raio em torno
de quê? mix comparado com o quê?

### Objetivo
**Todo o sistema roda em torno de UM shopping selecionado por vez no menu
principal.** O shopping ativo é o contexto-mestre: define localização, raio,
ponto de partida das buscas dos hunters e a referência de comparação de mix e
posicionamento.

### O que construir
1. **Seletor de shopping no menu principal**:
   - Campo para **digitar o nome do shopping** (com autocomplete sobre os já
     cadastrados; nome novo → cria o cadastro).
   - O shopping selecionado fica **visível em todas as telas** (ex.: no topo)
     — o usuário sempre sabe em qual contexto está operando.
2. **Modelo `Shopping`** (na base única): `nome`, `cidade`/UF, `endereco`,
   `latitude`/`longitude` (geocodificar a partir do endereço), `raioPadraoKm`
   (raio de atuação default das buscas), dados de porte (ABL, nº de pontos)
   quando disponíveis.
3. **Contexto propagado a todos os agentes** — nenhum agente roda sem
   shopping ativo:
   - **Localização e raio**: toda análise geográfica gira em torno da
     lat/long do shopping ativo, com o raio definido.
   - **Hunters** (Hunter, Regional Hunter, Premium Hunter…): a busca de
     marcas com raio definido usa a **localização do shopping ativo como
     ponto de partida**.
   - **Cidades adicionais**: é permitido acrescentar cidades à busca (ex.:
     capitais próximas, polos regionais) — mas a **comparação de mix e o
     posicionamento são sempre do shopping ativo**, nunca da cidade
     acrescentada.
   - Farmer, Cluster Positioning, Builder, Deal Conversion: leem pontos,
     clusters, funil e obras **do shopping ativo**.
4. **Segregação de dados por shopping**: as entidades da base única
   (investidores*, pontos, clusters, batalhas, eventos, fornecedores, obras,
   funil) ganham vínculo com `Shopping`. Trocar o shopping no menu troca todo
   o dado exibido, sem vazamento entre empreendimentos.
   - *Investidores e fornecedores podem ser compartilháveis entre shoppings do
     mesmo grupo — decisão a validar; na dúvida, vincular ao shopping e
     permitir cópia.

### Critérios de aceite
- [ ] Existe o campo de seleção/digitação do shopping no menu principal e o
      shopping ativo aparece em todas as telas.
- [ ] Nenhum agente executa sem shopping ativo definido (mensagem clara
      pedindo a seleção).
- [ ] Uma busca de hunter com raio X retorna resultados centrados na
      localização do shopping ativo; adicionar uma cidade expande a busca sem
      mudar a referência de mix/posicionamento.
- [ ] Trocar o shopping ativo troca pontos, funil, clusters e análises
      exibidas em todos os agentes.

---

## Orientação 7 — Farmer: base de mix ideal do planejamento comercial

### Contexto
O Farmer casa investidor × marca × ponto, e hoje deriva a demanda de mix das
opções dos pontos vagos. Falta a referência **de cima para baixo**: o **mix
ideal** definido pelo **planejamento comercial** do shopping (quantas
operações de cada segmento o empreendimento quer ter).

### Objetivo
Colocar no Farmer a **base de mix ideal com base no planejamento comercial**,
em formato ajustado para esse uso, com **importação via planilha**.

### O que construir
1. **Modelo `MixIdeal`** (por shopping ativo): por segmento/categoria —
   `segmento`, `metaOperacoes` (ou % do ABL), `atual` (derivado dos pontos
   ocupados, não digitado), `prioridade`, `observacoes`. Fonte: planejamento
   comercial do empreendimento.
2. **Ajuste de formato**: revisar a tela atual de mix do Farmer para exibir
   **ideal × atual × gap** por segmento — o gap (lacuna ou excesso) é o que
   orienta captação e recomendação. Gap positivo = foco de captação; gap
   negativo = segmento saturado (anti-canibalização).
3. **Importação via planilha**: botão **Baixar modelo (CSV/XLSX)** com os
   segmentos atuais e colunas do MixIdeal; **Importar planilha** no mesmo
   padrão tolerante dos demais importadores (`,` ou `;`, aspas, linhas `#`,
   rótulo ou código, match parcial de segmento), com opção de substituir ou
   mesclar.
4. **Integração com o motor de score**: a aderência ao mix
   (que hoje modula o match — ver [[#A regra de ouro do score|regra de ouro]])
   passa a considerar o gap contra o **mix ideal do planejamento comercial**,
   mantendo a regra: **modula, nunca infla**.

### Critérios de aceite
- [ ] Consigo importar o mix ideal do planejamento comercial por planilha e
      ver ideal × atual × gap por segmento.
- [ ] O ranking de recomendação do Farmer prioriza segmentos com gap positivo
      e penaliza saturados, sem resgatar perfis financeiramente inviáveis.
- [ ] O mix ideal é do shopping ativo (Orientação 6).

---

## Orientação 8 — Deal Conversion Layer: dashboard do funil com termômetro de prazo

### Contexto
O Deal Conversion Layer acompanha a conversão de leads em lojas abertas —
mas falta visão consolidada de gestão: quem é responsável por cada negócio, em
que estágio está, e se os prazos de assinatura e inauguração estão em risco.
Velocidade de reposição de lojas é alavanca direta do Goal.

### Objetivo
Criar **um botão de acesso e um dashboard de acompanhamento** do funil de
vendas, **consolidado por responsável** e **editável por estágio**, com
**termômetro de prazo para assinatura e para inauguração**.

### O que construir
1. **Modelo `Negocio` (deal)** no funil (por shopping ativo): `lead`/marca,
   `ponto` pretendido, `responsavel` (executivo), `estagio` do funil
   (ex.: prospecção → qualificação → proposta → negociação → **assinatura** →
   obra → **inauguração**; confirmar os estágios com o time comercial),
   `dataEntradaEstagio`, `prazoAssinatura`, `prazoInauguracao`, `valor`
   (aluguel/luvas quando aplicável), `observacoes`.
2. **Botão de acesso**: entrada clara no menu/tela principal ("Funil" /
   "Deal Conversion") abrindo o dashboard.
3. **Dashboard consolidado**:
   - **Por responsável**: quantos negócios em cada estágio, valor somado,
     e os atrasados — a visão de gestão de time.
   - **Por estágio (kanban)**: colunas do funil, com **edição direta** —
     arrastar/alterar o estágio do negócio no próprio dashboard atualiza a
     base (nada de editar em outra tela).
4. **Termômetro de prazo** (assinatura e inauguração, separados):
   - 🟢 **No prazo** · 🟡 **Atenção** (a X dias do prazo — X configurável,
     sugerido 15) · 🔴 **Estourado**.
   - Visível no cartão do negócio e agregado por responsável (quantos 🔴/🟡
     cada um tem). Ordenação default: mais crítico primeiro.
5. **Histórico de estágio**: registrar cada mudança (de/para, quando, por
   quem) para medir **tempo por estágio** — o dado que depois alimenta a
   melhoria de velocidade de reposição (Goal).

### Critérios de aceite
- [ ] Um botão no menu abre o dashboard do funil do shopping ativo.
- [ ] Vejo o funil consolidado por responsável e por estágio, e edito o
      estágio de um negócio diretamente no dashboard.
- [ ] Cada negócio exibe o termômetro de assinatura e o de inauguração com a
      regra verde/amarelo/vermelho, e o agregado por responsável destaca os
      críticos.
- [ ] Mudanças de estágio ficam registradas com data e autor.

---

## Orientação 9 — Hunter: correções de busca, filtros múltiplos, faixa de distância e ruas quentes

### Contexto
O objetivo do Hunter é **buscar potenciais leads e depois qualificá-los** para
a abordagem posterior. Hoje a ferramenta tem um defeito e três limitações de
filtro que travam esse objetivo — e falta um recurso de inteligência de
localização ("ruas quentes").

### O que fazer

#### 9.1 Corrigir o sistema de busca (bug — prioridade máxima)
O sistema de busca **não está funcionando**. Antes de qualquer melhoria:
1. Reproduzir o defeito (quais entradas, o que acontece vs. o esperado —
   sem resultado? erro? trava?).
2. Diagnosticar e corrigir a causa raiz.
3. Adicionar verificação/teste que impeça a regressão e registrar no
   documento da correção o que estava quebrado.

> Nenhuma das melhorias 9.2–9.5 deve ser feita "por cima" do defeito: primeiro
> a busca volta a funcionar, depois evolui.

#### 9.2 Fonte da descoberta: seleção múltipla
O campo **fonte da descoberta** hoje só aceita uma opção. Permitir:
- Selecionar **mais de uma** fonte simultaneamente (checkboxes/multi-select);
- Atalho **"Todas"** que marca/desmarca todas de uma vez;
- A busca retorna a união dos resultados, com a fonte identificada em cada
  lead retornado.

#### 9.3 Categoria/segmento: seleção múltipla
Idem para **categoria/segmento**: mais de uma categoria por busca e atalho
**"Todas"**. O segmento de cada lead retornado fica visível para a triagem
posterior.

#### 9.4 Distância do shopping: faixa (min–max), não número único
O campo **distância do shopping** hoje só aceita um número, impossibilitando
"maior que X e menor que Y". Ajustar para **faixa**:
- Dois campos (**de** km / **até** km) ou slider de intervalo;
- `de` vazio = 0 (a partir do shopping); `até` vazio = raio padrão do
  shopping ativo (Orientação 6);
- Validação: `de` < `até`, valores não-negativos, mensagem clara em erro;
- Caso de uso a garantir: excluir o entorno imediato (ex.: **de 5 até 30 km**
  para prospectar fora da área de canibalização).
- A distância é sempre medida **a partir da localização do shopping ativo**.

#### 9.5 Filtro de "ruas quentes"
Criar, com base na **localização do shopping ativo**, um filtro/ranking de
**ruas quentes** para prospecção presencial e dirigida:
- **Definição de rua quente** (os dois sinais, combinados):
  1. **Abertura de operações**: ruas com a **maior quantidade de aberturas de
     operações de varejo e restaurantes nos últimos 2 anos** (dados de
     abertura de CNPJ/alvará por logradouro quando disponíveis, e/ou
     contagem de novos estabelecimentos em mapas — ex.: Google Places);
  2. **Engajamento crescente**: ruas cujos estabelecimentos apresentam
     **engajamento crescente no Google** (avaliações, volume de reviews
     recentes) **e em redes sociais** (menções, check-ins, crescimento de
     seguidores das operações da rua).
- **Saída**: ranking de ruas com nota de "temperatura", os sinais que a
  justificam (nº de aberturas, tendência de engajamento) e as operações
  identificadas na rua — cada uma podendo virar lead do Hunter com 1 clique.
- **Integração**: o filtro respeita a faixa de distância (9.4) e as
  categorias selecionadas (9.3); leads gerados entram no funil
  (Orientação 8) vinculados a uma batalha do cluster quando aplicável.
- Como todo dado externo: sinal de internet é **indício, não veredito** — a
  curadoria da rua e do lead é do executivo (princípio §4 do Ciclo 1).

### Critérios de aceite
- [ ] A busca do Hunter funciona de ponta a ponta (bug corrigido e coberto
      contra regressão).
- [ ] Consigo buscar com múltiplas fontes e múltiplas categorias, inclusive
      "todas", e cada lead mostra fonte e segmento.
- [ ] Consigo buscar leads "entre X e Y km" do shopping ativo, e os limites
      são validados.
- [ ] O filtro de ruas quentes retorna ranking justificado (aberturas em 2
      anos + engajamento crescente) em torno do shopping ativo, e cada
      operação listada pode virar lead com 1 clique.

---

## Glossário

| Termo | Definição neste documento |
|-------|---------------------------|
| **Agente** | Ferramenta/persona digital do Shopping Inteligente (Farmer, Cluster Positioning, Builder…) que organiza dados e apoia a decisão do executivo. |
| **Base única** | O banco PostgreSQL (Prisma) compartilhado — fonte de verdade de investidores, pontos, clusters, batalhas, eventos, fornecedores e obras. |
| **Ponto** | Espaço comercializável do shopping — loja ou quiosque — ocupado, vago ou em obra. |
| **Cluster** | Agrupamento de pontos por região/vocação do shopping. |
| **Batalha** | Frente de posicionamento que um cluster disputa na percepção do cliente; tem público-alvo e palavras-chave. |
| **Aderência** | Grau em que uma marca/evento/fornecedor atende a uma batalha ou a uma obra — sempre exibida com justificativa. |
| **Porte da obra** | Classificação por tamanho/complexidade: quiosque, loja pequena, média, âncora (faixas de m² no dicionário de dados). |
| **Segmentos de obra** | gerenciamento, medição, civil, marcenaria, marmoraria, turnkey. |
| **Goal** | O objetivo oficial dos shoppings (Orientação 5) — critério único de revisão e priorização de todos os agentes. |
| **Shopping ativo** | O shopping selecionado no menu principal; contexto-mestre de todos os agentes (localização, raio, mix, funil). |
| **Hunter** | Agente de prospecção: busca potenciais leads (marcas, serviços, gastronomia, entretenimento) e os qualifica para abordagem posterior. |
| **Deal Conversion Layer** | Camada/funil de conversão de leads em lojas abertas: prospecção → assinatura → obra → inauguração. |
| **Mix ideal** | Referência do planejamento comercial: quantas operações de cada segmento o shopping quer ter; comparado ao atual gera o gap. |
| **Rua quente** | Rua com alta abertura de operações de varejo/restaurantes nos últimos 2 anos e engajamento crescente no Google e redes sociais. |
| **Termômetro de prazo** | Indicador 🟢/🟡/🔴 do risco de estouro dos prazos de assinatura e inauguração de um negócio do funil. |

## Notas relacionadas
- [[Shopping Inteligente]]
- [[Agente Farmer e Conector de Quiosques]]
- [[Radar Quiosques]] — `docs/RADAR-QUIOSQUES.md`
- [[Guia Claude Code — Construir ou Melhorar]]
