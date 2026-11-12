---
title: Treinamento Introdutório — Orquestração de IA
aliases:
  - Orquestração de IA
  - Treinamento Orquestração
  - Harness e Workflows
tags:
  - orquestracao
  - harness
  - workflow
  - agentes
  - guardrails
  - auditoria
  - claude
  - shopping-inteligente
  - treinamento
created: 2026-07-11
updated: 2026-07-11
status: treinamento
---

# Treinamento Introdutório — Técnicas de Orquestração para IA

> [!abstract] Para quem é este treinamento
> Para quem já usa IA em conversas soltas e quer dar o próximo passo:
> **estruturar** o trabalho da IA — com contexto controlado, ferramentas,
> verificação e fluxos de várias etapas. Sem pré-requisito de programação.
> Todos os exemplos são **reais, deste repositório**: o conceito de
> **[[Shopping Inteligente]]** (Radar Quiosques / Agente Farmer), o
> **NutriTreino** e o jogo **Bloquinhos Mágicos**.

## Índice
- [[#Módulo 1 — O que é orquestração de IA]]
- [[#Módulo 2 — O harness: a "carcaça" em volta do modelo]]
- [[#Módulo 3 — Orquestração de contexto (exemplo: NutriTreino)]]
- [[#Módulo 4 — Workflows: decompondo trabalho em etapas]]
- [[#Módulo 5 — Padrões de workflow (com exemplos do repositório)]]
- [[#Módulo 6 — Estudo de caso completo: Bloquinhos Mágicos]]
- [[#Módulo 7 — Estudo de caso: Shopping Inteligente como orquestração]]
- [[#Módulo 8 — Guardrails: limites que seguram o sistema quando o modelo erra]]
- [[#Módulo 9 — Auditoria do modelo: parâmetros, trilha e métricas]]
- [[#Módulo 10 — Exercícios práticos]]
- [[#Glossário]]

---

## Módulo 1 — O que é orquestração de IA

### 1.1 Da conversa ao sistema

Usar IA "no chat" é como ter um consultor brilhante **sem mesa, sem arquivo e
sem processo**: a cada conversa ele recomeça do zero, depende do que você
lembrou de contar, e o resultado vive só naquela janela.

**Orquestração** é dar a esse consultor uma estrutura de trabalho:

| Sem orquestração | Com orquestração |
|------------------|------------------|
| Você cola o contexto na mão, toda vez | O sistema monta o contexto certo, automaticamente |
| Uma pergunta, uma resposta | Um objetivo, várias etapas encadeadas |
| A IA "acha" que terminou | Critérios de aceite definem o que é "pronto" |
| Erros passam despercebidos | Verificação faz parte do fluxo |
| Um modelo faz tudo | Tarefas independentes rodam em paralelo, cada uma com o prompt certo |

> [!important] Definição de trabalho
> **Orquestrar IA é decidir: qual informação entra, qual tarefa é pedida, em
> que ordem, quem verifica, e o que acontece com a saída.** O modelo é o
> músculo; a orquestração é o sistema nervoso.

### 1.2 Os quatro papéis de todo sistema orquestrado

1. **Orquestrador** — quem decide a sequência: pode ser você, um script, ou a
   própria IA em modo agente (como o Claude Code conduzindo um projeto).
2. **Trabalhadores** — quem executa cada etapa: chamadas ao modelo, subagentes,
   funções determinísticas (código comum!), ou pessoas.
3. **Contexto** — a informação que cada trabalhador recebe. A regra de ouro:
   **contexto mínimo e suficiente** (Módulo 3).
4. **Verificador** — quem confere o resultado antes de ele valer: testes,
   revisão adversarial, ou o humano no circuito (*human-in-the-loop*).

### 1.3 Nem tudo precisa de IA

Um erro comum de iniciante é jogar IA em tudo. Orquestração madura **mistura**
IA com código determinístico:

- **IA** para o que é ambíguo: interpretar uma foto de refeição, entender a
  intenção de um texto, gerar código, revisar com julgamento.
- **Código comum** para o que é exato: somar macros, calcular um score,
  ordenar um ranking, validar um formato.

O **Radar Quiosques** é o exemplo extremo: o score investidor × marca × mix é
**100% determinístico** (Módulo 7) — e nem por isso deixa de ser um workflow de
decisão. A IA entrou na **construção** da ferramenta, não na execução dela.

---

## Módulo 2 — O harness: a "carcaça" em volta do modelo

### 2.1 O que é um harness

*Harness* (literalmente, "arreio") é **tudo que envolve o modelo** para
transformá-lo de um gerador de texto em um agente útil e seguro:

```
            ┌──────────────────── HARNESS ────────────────────┐
            │                                                  │
 objetivo → │  prompt de sistema + contexto montado            │
            │        ↓                                         │
            │     MODELO ⇄ ferramentas (ler/editar arquivos,   │
            │        ↓      rodar comandos, buscar, testar)    │
            │  loop de agente (age → observa → decide de novo) │
            │        ↓                                         │
            │  permissões, limites e verificação               │
            │                                                  │
            └───────────────→ resultado verificado ────────────┘
```

Componentes de um harness, do mais simples ao mais completo:

| Componente | O que faz | Exemplo neste repositório |
|------------|-----------|---------------------------|
| **Prompt de sistema** | Define papel, regras e formato de saída | Os prompts em `lib/prompts.ts` do NutriTreino |
| **Montagem de contexto** | Injeta só a informação relevante | `buildMealContext()` em `lib/mealAI.ts` |
| **Ferramentas** | Deixam o modelo *agir* no mundo | Claude Code lê/edita arquivos e roda testes |
| **Loop de agente** | O modelo age, observa o resultado, e decide o próximo passo | Claude Code construindo o Radar Quiosques |
| **Contrato de saída** | Força um formato verificável (JSON, schema) | A skill `atualizar-perfil-nutritreino` |
| **Permissões e limites** | O que o agente pode fazer sem perguntar | "Nunca commitar em `main`; dúvida de escopo → perguntar" (Bloquinhos) |
| **Verificação** | Confere antes de valer | Fase 5 do Bloquinhos: teste real no navegador + revisão adversarial |

> [!tip] O harness que você já usa
> O **Claude Code** é um harness pronto: prompt de sistema + ferramentas de
> arquivo/terminal + loop de agente + permissões que você aprova. Quando você
> escreve um `SKILL.md` ou um documento de instruções, está **programando o
> harness** — sem escrever código.

### 2.2 Contratos de saída: o exemplo da skill do NutriTreino

A skill `skill/atualizar-perfil-nutritreino/SKILL.md` é um harness mínimo e
perfeito para estudo. Ela transforma uma conversa livre ("fiz bioimpedância,
deu 110,4 kg e 53,5 kg de músculo") em uma saída **contratual**:

- Responda com **somente um JSON**, em bloco de código.
- **Apenas os campos que mudaram** (o app mantém o resto).
- Números são números (sem `"kg"`, sem aspas); datas em `YYYY-MM-DD`.
- Chaves válidas enumeradas (`rest`, `bjj`, `micro_targets`…).

Por que isso é orquestração? Porque a saída da IA vira **entrada de outra
etapa** (o botão "Importar do resumo" do app) sem intervenção humana de
formatação. **Todo workflow confiável nasce de contratos de saída claros entre
as etapas.**

### 2.3 Human-in-the-loop: onde o humano fica

O harness também define **quando parar e perguntar**. A regra do documento do
Bloquinhos é um modelo a copiar:

> Em caso de dúvida de **escopo** (ex.: adicionar níveis além do previsto),
> perguntar ao usuário; **para todo o resto, decidir e seguir**.

E no Radar Quiosques, o princípio nº 4: *"o agente organiza; a **curadoria é
do executivo**"*. A IA pontua e recomenda; quem fecha negócio é o humano.

---

## Módulo 3 — Orquestração de contexto (exemplo: NutriTreino)

### 3.1 O problema que o NutriTreino resolve

Antes do app, o registro de refeições era feito **no chat**: o histórico
inteiro ficava na conversa, e cada nova pergunta arrastava tudo de novo —
caro, lento e cada vez pior (contexto poluído).

A solução do NutriTreino (está na primeira linha do `README.md`):

> "o histórico fica no **banco** e cada chamada à IA usa só **perfil + dia
> atual** (**contexto mínimo**)"

Este é o conceito mais importante deste treinamento:

> [!important] Engenharia de contexto
> A qualidade da resposta depende menos do "prompt mágico" e mais de **qual
> informação chega ao modelo**. Guarde o estado em um lugar estruturado
> (banco, arquivos) e monte, **a cada chamada**, o menor contexto que resolve
> a tarefa.

### 3.2 Anatomia de `buildMealContext()` (`lib/mealAI.ts`)

Quando o usuário pede uma sugestão de refeição, o app **não** manda a
conversa inteira. Uma função determinística monta o contexto em camadas:

1. **Perfil** — nome, peso, massa muscular, objetivo, exames (LDL, HDL…).
2. **Metas do dia** — faixas de kcal/proteína/carbo/gordura conforme o treino.
3. **Estado atual** — o que já foi consumido hoje e **o que falta até o teto**.
4. **Histórico compacto** — últimos 7 dias, cada refeição resumida em uma
   linha (`R2 frango com arroz [520kcal P45 C50 G12]`) — não o registro cru.
5. **Dicas calculadas** — os 5 micronutrientes mais baixos do dia, alerta de
   imunidade. Repare: **o código calcula, a IA recebe a conclusão** ("hoje
   estão baixos vit. C e zinco — favoreça alimentos ricos nesses").

Lições transferíveis para qualquer projeto:

- **Resuma antes de enviar.** Uma linha por refeição, não o JSON completo.
- **Pré-calcule o que é exato.** Não peça para a IA somar macros; some no
  código e envie o saldo.
- **Injete diretrizes do usuário como regra.** O campo `notes` do perfil
  ("reduzir gordura saturada, LDL alto") entra em toda chamada — memória de
  longo prazo sem depender do chat.

### 3.3 O ciclo completo do NutriTreino

```
foto/texto → IA estima macros → HUMANO confirma/edita → salva no banco
                                                            ↓
     próxima sugestão ← IA ← contexto mínimo montado ← banco (estado)
```

Note os dois padrões de harness: **contrato de saída** (a estimativa vem em
formato estruturado para a tela de confirmação) e **human-in-the-loop** (nada
entra no banco sem o usuário confirmar).

---

## Módulo 4 — Workflows: decompondo trabalho em etapas

### 4.1 Por que decompor

Um pedido grande e vago ("construa um jogo de matemática") em uma tacada só
produz resultado raso. Decompor em etapas traz três ganhos:

1. **Qualidade** — cada etapa tem um prompt focado e um critério de pronto.
2. **Paralelismo** — etapas independentes rodam ao mesmo tempo.
3. **Verificabilidade** — dá para testar (e reverter) etapa por etapa.

### 4.2 Os cinco elementos de um bom workflow

Use como checklist ao desenhar qualquer fluxo:

1. **Fases ordenadas por dependência** — fundação antes de fachada. No
   Bloquinhos: o motor de blocos (Fase 1) vem antes dos personagens (Fase 2),
   porque tudo consome o motor.
2. **Critério de pronto por fase** — observável, não opinativo. Ex. real:
   *"no sandbox, arrastar 7 sobre 3 forma uma barra dourada com animação e
   som"*. Compare com "o motor deve funcionar bem" (inverificável).
3. **Pontos de paralelização identificados** — o que é independente entre si?
   No Bloquinhos: os 10 personagens SVG, e os 5 jogos de lógica.
4. **Fase de verificação obrigatória** — teste real + revisão. Não é opcional
   nem "se der tempo": no Bloquinhos ela é a Fase 5, marcada **obrigatória**.
5. **Checkpoint por fase** — um commit por fase, no mínimo. Se a fase 3
   quebrar, a fase 2 está salva.

### 4.3 Sequencial vs. paralelo vs. barreira

- **Sequencial (pipeline):** B precisa da saída de A. Ex.: gerar contexto →
  chamar a IA → validar o JSON → salvar.
- **Paralelo (fan-out):** N tarefas independentes ao mesmo tempo. Ex.: um
  agente por personagem SVG, **mesmo template de prompt, variando número, cor
  e personalidade** — o template garante consistência; a variação, cobertura.
- **Barreira (fan-in):** esperar **todos** os paralelos para uma etapa que
  precisa do conjunto. Ex.: o orquestrador "integra e **harmoniza o estilo**"
  dos 10 personagens — isso só dá para fazer com todos prontos.

> [!warning] Barreira tem custo
> Só sincronize quando a próxima etapa realmente precisa do **conjunto**
> (deduplicar, comparar, harmonizar). Se cada item pode seguir sozinho para a
> próxima etapa, deixe-o seguir — o workflow anda na velocidade do item mais
> lento apenas onde há barreira.

---

## Módulo 5 — Padrões de workflow (com exemplos do repositório)

### 5.1 Fan-out por template

**Quando usar:** N itens do mesmo tipo, independentes entre si.

**Exemplo real (Bloquinhos, Fase 2):** um agente por personagem, todos com o
mesmo prompt-template:

```
Desenhe o personagem {NÚMERO} ("{NOME}") em SVG inline:
cor base {COR}, personalidade {PERSONALIDADE}, bordão "{BORDÃO}".
Requisitos fixos: olhos e boca animados, 3 expressões (neutro, feliz,
pensativo), sem assets externos, seguindo as constantes de design do projeto.
```

A parte **fixa** do template carrega os requisitos de consistência; só as
**variáveis** mudam. Depois, uma etapa de integração harmoniza o resultado.

### 5.2 Revisão adversarial por lentes

**Quando usar:** antes de dar algo por pronto, quando o erro custa caro.

**Exemplo real (Bloquinhos, Fase 5):** quatro revisores **em paralelo**, cada
um com uma lente diferente:

1. **Correção matemática** — o gerador de contas nunca produz resposta errada.
2. **Usabilidade infantil** — alvos de toque, leitura, frustração.
3. **Performance mobile** — 60 fps no arrastar, sem travadas.
4. **Acessibilidade** — contraste, `prefers-reduced-motion`, teclado.

Duas regras tornam o padrão eficaz:

- **Lentes diversas, não redundantes.** Quatro revisores genéricos acham 4x o
  mesmo problema; quatro lentes distintas acham problemas *diferentes*.
- **Só integrar achados confirmados.** Todo achado passa por verificação
  antes de virar mudança — revisor também erra (e IA revisora "acha" bug onde
  não há). No repositório há um commit exatamente disso: *"verificação e
  correções da revisão adversarial (fase 5)"*.

### 5.3 Gerar → verificar de verdade → só então entregar

**Quando usar:** sempre que a saída é executável (código, planilha, fórmula).

**Exemplo real (Bloquinhos, Fase 5.1):** não basta a IA *dizer* que funciona —
o plano exige **abrir o jogo num navegador de verdade** (Chromium headless) e
exercitar: fusão 7+3, uma conta de cada nível certa **e errada**, recarregar e
conferir persistência, modo offline. O prompt mestre fecha com:

> "verifique tudo **de verdade** no Chromium antes do push e **reporte o que
> foi testado**".

**Exemplo no Radar Quiosques:** o guia orienta pedir testes "headless" após
mudanças: *"rode um teste rápido conferindo que os scores continuam entre 0 e
100"* — uma **invariante** barata de verificar que pega muitos erros.

### 5.4 Documento de instruções + prompt mestre

**Quando usar:** projetos grandes demais para um prompt de chat.

**Exemplo real:** `docs/JOGO-BLOQUINHOS-INSTRUCOES-FABLE5.md` separa dois
artefatos:

- O **documento de instruções** (longo): visão do produto, requisitos, plano
  de fases, regras de orquestração, critérios de aceite. É a "especificação
  executável" — versionada no git, revisável, reutilizável.
- O **prompt mestre** (curto): *"Construa o jogo seguindo à risca o documento
  X. Execute as fases 0 a 5 na ordem, commitando ao fim de cada fase…"* — só
  aponta para o documento e reforça o inegociável.

Vantagem: o conhecimento fica no **repositório**, não perdido numa conversa.
Qualquer sessão futura (ou outra pessoa) reexecuta o mesmo plano.

### 5.5 Evolução em camadas (o padrão do Radar Quiosques)

**Quando usar:** construir produto novo com IA, sem saber tudo de antemão.

O guia `docs/Guia-Claude-Code-Construir-ou-Melhorar.md` registra a ordem real
de construção do Radar Quiosques:

```
triagem simples → banco de investidores → planejamento por pontos
              → cruzamento → ficha do investidor → import CSV
```

Cada camada é **utilizável sozinha** e vira fundação da seguinte. As boas
práticas do guia são regras de orquestração para humanos:

- **Uma mudança por vez**, e teste antes da próxima.
- **Peça o critério**, não só a feature ("marca acima do capital deve *cair*
  no ranking").
- **Reverta sem medo** — com git, cada etapa é um checkpoint.

---

## Módulo 6 — Estudo de caso completo: Bloquinhos Mágicos

Este projeto (em `app-bloquinhos/`, plano em
`docs/JOGO-BLOQUINHOS-INSTRUCOES-FABLE5.md`) foi construído por orquestração
de ponta a ponta. Vale reler o documento inteiro com os olhos deste
treinamento; aqui, o mapa das decisões:

| Fase | Conteúdo | Técnica de orquestração |
|------|----------|-------------------------|
| **0 — Fundação** | Estrutura de pastas, constantes de design | **Inline, sem agentes** — barato demais para paralelizar |
| **1 — Motor** | BlockEngine (núcleo de tudo) | **Sequencial e caprichada** — dependência de todas as outras; critério de pronto observável |
| **2 — Personagens** | 10 personagens SVG + sandbox | **Fan-out por template** (um agente por personagem) + **barreira** de harmonização |
| **3 — Modos de jogo** | 4 níveis de contas + 5 jogos | **Fan-out** (um agente por jogo, todos sobre a mesma API) + núcleo puro e testável (`gerarConta`) |
| **4 — Polimento** | PWA, recompensas, persistência | Sequencial |
| **5 — Verificação** | Teste real + revisão | **Verificação real no navegador** + **revisão adversarial em 4 lentes** + só integrar confirmados |

E as **regras de orquestração** transversais:

- Branch de trabalho dedicada; **nunca commitar em `main`**.
- **Um commit por fase, no mínimo** (checkpoints).
- Nenhuma dependência externa **sem justificativa escrita**.
- Dúvida de **escopo** → perguntar; o resto → **decidir e seguir**.

> [!tip] Por que a Fase 0 e a Fase 1 não são paralelas
> Iniciantes tendem a paralelizar tudo. Paralelize **folhas** da árvore de
> dependências (personagens, jogos), nunca a **raiz** (o motor). Um motor
> malfeito multiplicado por 10 agentes é retrabalho em dobro.

---

## Módulo 7 — Estudo de caso: Shopping Inteligente como orquestração

O conceito de **[[Shopping Inteligente]]** — dados decidindo o tenant mix — é
em si um problema de orquestração: várias fontes, um fluxo de decisão, um
humano no fim. O **Agente Farmer / Radar Quiosques**
(`docs/Agente-Farmer-e-Conector-de-Quiosques.md`) implementa esse fluxo.

### 7.1 O workflow do Agente Farmer

```
CAPTAÇÃO            TRIAGEM                 CRUZAMENTO           DECISÃO
ficha por link  →   5 blocos de perguntas → investidor × marca → executivo
(sem servidor)      (restrições ANTES       × ponto do shopping  (curadoria
                     de desejos)             (score modulado)      humana)
```

Repare como cada conceito do treinamento aparece:

- **Ordem importa (pipeline):** o roteiro pergunta **restrições antes de
  desejos** — capital e giro antes de "qual marca você quer". É sequenciamento
  de contexto: as travas vêm antes das preferências.
- **Contrato de dados:** a ficha do investidor vira um **código `RQ1:...`**
  que entra no banco **já pontuado** — mesmo papel do JSON da skill do
  NutriTreino: formato fechado conectando duas etapas sem retrabalho.
- **Fan-in de três fontes:** investidores ⇄ base de marcas (ABF/PEGN) ⇄
  pontos do shopping — três "planilhas" que viviam separadas, cruzadas numa
  etapa só (a aba Cruzamento).
- **Regra de composição explícita:** `score_final = match × (0,7 + 0,3 ×
  mix/100) + bônus_lacuna`. A regra de ouro — *o mix **modula**, nunca
  **infla*** — é uma decisão de orquestração: uma etapa posterior não pode
  "resgatar" o que uma trava anterior reprovou.
- **Human-in-the-loop:** a ferramenta entrega ranking **com o porquê de cada
  nota** (transparência), e o executivo decide.

### 7.2 A dupla camada de orquestração

O Shopping Inteligente ensina que orquestração acontece em **duas camadas**:

1. **Na construção** — o Radar Quiosques foi construído *conversando com o
   Claude Code*, em camadas, com testes a cada passo (Módulo 5.5). IA como
   **trabalhadora**, humano como orquestrador.
2. **Na execução** — a ferramenta pronta orquestra um fluxo de decisão
   **determinístico** (sem IA em tempo de execução!). Provando o ponto do
   Módulo 1.3: orquestrar é estruturar decisão; IA é um dos trabalhadores
   possíveis, não o único.

**Evolução natural** (registrada no próprio doc): base compartilhada em nuvem
(o Postgres/Prisma já existe no repositório) e, daí, agentes de IA sobre a
base — ex.: um agente que lê a ficha recebida e **sugere as perguntas de
aprofundamento** para a reunião. A orquestração já está pronta para receber
esse trabalhador novo, porque as etapas têm contratos claros entre si.

---

## Módulo 8 — Guardrails: limites que seguram o sistema quando o modelo erra

### 8.1 O que é um guardrail

O modelo é **probabilístico**: em algum momento ele vai errar — estimar macros
absurdos, gerar um JSON inválido, recomendar uma marca inviável, tentar uma
ação fora do combinado. **Guardrail é o limite determinístico que impede o
erro de virar estrago.** Não é desconfiança da IA; é engenharia: freio não é
crítica ao motorista.

Um guardrail **eficiente** tem quatro propriedades:

1. **Fica no caminho obrigatório do fluxo** — não depende de alguém lembrar
   de verificar. A trava financeira do Radar Quiosques roda em *todo* cálculo
   de score; não é uma "boa prática recomendada".
2. **É barato** — roda em código, em milissegundos, sem custo de modelo.
3. **Falha fechado** — diante do inválido, bloqueia e repete; nunca "aproveita
   o que der".
4. **Explica por que bloqueou** — transparência para o humano corrigir a
   causa, não brigar com o sistema.

### 8.2 As quatro camadas de guardrails

Coloque limites em cada fronteira do sistema — todos os exemplos abaixo são
reais, deste repositório:

| Camada | Pergunta que responde | Exemplos reais |
|--------|----------------------|----------------|
| **1 · Entrada** | O que pode entrar no modelo? | Contexto mínimo do NutriTreino (o modelo nunca vê o banco cru); ficha do investidor com **campos fechados** (sem texto livre onde não precisa); Bloquinhos: **zero texto digitado livre** (adequação LGPD/COPPA para crianças). |
| **2 · Saída** | O que pode sair e ser aproveitado? | Contrato JSON da skill (chaves **enumeradas**, números sem unidade); invariante **"scores entre 0 e 100"**; flags automáticas do NutriTreino (⚠️ gordura saturada × LDL) — **código auditando a saída** da IA. |
| **3 · Ação** | O que o agente pode fazer no mundo? | **Nunca commitar em `main`**; dependência externa **só com justificativa escrita no commit**; `ANTHROPIC_API_KEY` **só no servidor, nunca no navegador**; jogo com **zero chamadas de rede** em tempo de execução. |
| **4 · Processo** | Quem aprova o quê, e quando? | Human-in-the-loop: nada entra no banco sem o usuário **confirmar/editar** os macros; a **curadoria é do executivo**; dúvida de **escopo** → perguntar (o resto, decidir e seguir). |

> [!tip] Onde nasce a maioria dos incidentes
> Quase sempre na camada que **não existia**: a saída era usada sem validação,
> ou o agente podia agir sem limite de ação. Ao desenhar um fluxo novo,
> percorra as 4 camadas e escreva **uma regra por camada, no mínimo**.

### 8.3 Trava dura vs. peso — a decisão de projeto mais importante

O princípio nº 2 do Radar Quiosques resume tudo:

> "**Trava dura onde o negócio quebra** — acessibilidade não é média, é porta."

No motor de match, **financeiro é trava**: implantação acima do capital
derruba a nota de forma que nenhuma outra dimensão compensa. **Interesse é
peso**: só ordena entre os viáveis. Como decidir no seu projeto:

- A violação **inviabiliza** o resultado? → **Trava (gate)**: reprova, e
  nenhuma etapa posterior resgata.
- A violação só **piora** o resultado? → **Peso**: entra na nota.

O anti-padrão clássico é a **média que esconde o veto**: um critério
eliminatório diluído entre sete pesos "some" na média e o sistema recomenda o
inviável com nota razoável. A regra de composição do score protege disso:

```
score_final = match × (0,7 + 0,3 × mix/100) + bônus_lacuna
```

O mix **modula entre 0,7× e 1,0×** — matematicamente **incapaz** de inflar um
match reprovado. Guardrail eficiente é assim: a violação é **impossível por
construção**, não "proibida por instrução".

### 8.4 A escada de custo da verificação

Use sempre o degrau **mais barato** que pega o erro:

```
1. Validação por código/schema     (milissegundos, custo ~zero)
      JSON parseia? chaves válidas? números nas faixas?
2. Invariantes de domínio          (baratas, rodam sempre)
      score ∈ [0,100] · kcal > 0 · resposta da conta confere
3. Revisão por IA (adversarial)    (custo moderado, sob demanda)
      4 lentes do Bloquinhos; só integrar achados confirmados
4. Revisão humana                  (cara — reserve para o que só o humano decide)
      confirmar macros · curadoria do executivo · aprovar escopo
```

Subir um degrau sem esgotar o anterior é desperdício: não use um agente
revisor para conferir se o JSON parseia, nem um humano para conferir se o
score está entre 0 e 100.

### 8.5 Guardrails para o agente construtor

Quando a IA é quem **constrói** (Claude Code executando um plano), os
guardrails vão no **documento de instruções** — as "regras de orquestração"
do Bloquinhos são um gabarito:

- **Limite de território:** branch dedicada, nunca `main`.
- **Limite de expansão:** nenhuma dependência externa sem justificativa
  escrita — atrito deliberado contra a solução preguiçosa.
- **Limite de escopo:** o que fazer na dúvida (perguntar) e no resto (seguir).
- **Critérios de aceite inegociáveis:** a lista numerada que a verificação
  final tem que provar — inclusive **negativos** ("zero chamadas de rede",
  "zero coleta de dados"), que são guardrails de comportamento do produto.

---

## Módulo 9 — Auditoria do modelo: parâmetros, trilha e métricas

### 9.1 A pergunta que a auditoria responde

> **"Por que o sistema decidiu isso — com qual modelo, qual prompt, qual
> contexto, e quem aprovou?"**

Se essa pergunta não tem resposta, você não pode confiar no sistema (não sabe
se errou), nem melhorá-lo (não sabe **onde** errou), nem prestar contas
(não reconstrói a decisão). Auditoria não é burocracia — é o que transforma
"a IA disse" em "o sistema decidiu assim, por estas razões, e está registrado".

### 9.2 Parâmetros do modelo: fixe e versione

A primeira camada de auditoria é **eliminar o implícito** — tudo que afeta o
comportamento do modelo deve ser explícito e versionado:

| Parâmetro | Regra | Exemplo real |
|-----------|-------|--------------|
| **Modelo (pinned)** | ID exato no código, nunca "o mais novo" implícito | `claude-sonnet-4-6` declarado no README/código do NutriTreino — trocar de modelo é um **diff no git**, com autor e data |
| **Prompts versionados** | Prompt mora no repositório, não na cabeça | `lib/prompts.ts` — mudou o prompt, tem diff, tem histórico, tem como reverter |
| **Parâmetros de geração** | `max_tokens`, temperatura etc. explícitos no código | Extração de dados (macros de uma foto) pede temperatura **baixa** — criatividade aqui é ruído |
| **Instruções do agente** | O plano que o agente executa é um arquivo versionado | `docs/JOGO-BLOQUINHOS-INSTRUCOES-FABLE5.md` — dá para saber **exatamente** o que foi pedido em cada fase |

> [!important] Reprodutibilidade primeiro
> Com modelo + prompt + contexto registrados, qualquer decisão pode ser
> **reexecutada e comparada**. Sem isso, todo debug vira arqueologia.

### 9.3 O registro mínimo por chamada

Para cada chamada ao modelo que produz uma decisão, registre:

| Campo | Para quê |
|-------|----------|
| `timestamp` | Reconstruir a linha do tempo |
| `model_id` + `prompt_version` | Saber **qual cérebro** e **qual instrução** decidiram |
| **Contexto enviado** (ou hash + resumo) | Reproduzir a chamada; detectar contexto podre |
| **Saída bruta** | O que o modelo respondeu, antes de qualquer tratamento |
| **Resultado da validação** | Passou no contrato? Qual regra falhou? |
| **Decisão humana** | Aceito como veio / **editado (com o delta)** / rejeitado |
| `tokens`, custo, latência | Detectar regressões de custo e desempenho |

O detalhe mais valioso é o **delta da decisão humana**. No NutriTreino, o
fluxo *estima → confirma/edita → salva* já produz esse dado de graça: a
diferença entre o que a IA estimou e o que o usuário confirmou é a **métrica
de qualidade do modelo no mundo real** — sem precisar de nenhum benchmark.

### 9.4 Trilha de auditoria nos três projetos

| Projeto | Mecanismo | O que fica auditável |
|---------|-----------|----------------------|
| **NutriTreino** | Confirmação humana antes de salvar; flags calculadas por dia; exames com data no perfil | Toda refeição no banco foi **aprovada por alguém**; os alertas do dia são reconstruíveis; a diretriz que a IA seguia em cada época está no perfil versionado |
| **Radar Quiosques** | **Explicabilidade**: todo score vem com as razões por dimensão; **proveniência**: dados de referência ABF/PEGN com a ressalva "validar na COF"; backup JSON | O executivo consegue defender a recomendação ponto a ponto; sabe-se de onde veio cada número — e o que ele **não** garante |
| **Bloquinhos / Claude Code** | **Git como trilha**: 1 commit por fase; justificativa escrita para dependências; relatório do que foi testado antes do push | O histórico conta a história: o que mudou, quando, por quê, e o que foi verificado antes de valer |

### 9.5 Métricas contínuas e o golden set

Auditoria não é só forense (olhar para trás) — é **monitoramento** (ver a
degradação chegando). Quatro métricas que qualquer sistema com IA deveria ter:

1. **Taxa de aceitação sem edição** — % de saídas que o humano aprova como
   vieram. Caiu? O modelo (ou o contexto) piorou.
2. **Taxa de contrato violado** — % de saídas que falham na validação (JSON
   inválido, faixa estourada). Subiu? Prompt ou modelo mudaram de comportamento.
3. **Distribuição das saídas** — scores, flags disparadas, macros médios.
   Deslocou sem causa conhecida? Investigue (*drift*).
4. **Custo e latência por tarefa** — regressões silenciosas aparecem aqui.

E a ferramenta que amarra tudo: o **golden set** — um conjunto de casos com
resposta conhecida, rodado a **cada mudança de prompt ou de modelo** (é o
teste de regressão da IA):

- Radar Quiosques: *"investidor com R$ 80 mil, primeira vez"* → o ranking
  esperado (e a marca cara **fora** dele).
- NutriTreino: 10 refeições típicas com macros conferidos à mão → a estimativa
  fica dentro de ±15%?
- Bloquinhos: o gerador de contas roda 1.000 vezes → **nenhuma** questão com
  resposta errada (critério de aceite nº 4 virando teste permanente).

> [!warning] Antes de trocar de modelo
> Nunca troque o `model_id` "porque saiu versão nova" sem rodar o golden set
> antes e depois. Modelo novo ≠ melhor **no seu caso**; a diferença entre os
> dois relatórios é a sua decisão de migração, documentada.

---

## Módulo 10 — Exercícios práticos

> [!note] Como praticar
> Os exercícios usam este repositório e o Claude Code. Faça na ordem — eles
> reproduzem a progressão dos módulos.

### Exercício 1 — Ler um harness (30 min)
Abra `skill/atualizar-perfil-nutritreino/SKILL.md` e responda:
1. Qual é o contrato de saída? Liste 3 regras que tornam a saída "importável
   sem retoque".
2. O que aconteceria se a regra "apenas os campos que mudaram" não existisse?
3. Escreva uma skill análoga para o seu contexto (ex.: transformar anotações
   de uma reunião com investidor em uma linha de CSV no formato que o Radar
   Quiosques importa — colunas `nome, status, tempo, operacao, experiencia`).

### Exercício 2 — Auditar contexto (45 min)
Leia `buildMealContext()` em `lib/mealAI.ts` e monte uma tabela: **camada de
contexto → de onde vem → por que resumida assim**. Depois responda: qual
informação foi **deliberadamente deixada de fora**, e por quê? (Dica: onde
está o histórico completo, e o que chega ao modelo no lugar dele?)

### Exercício 3 — Desenhar um workflow (1 h)
Escolha um projeto seu e escreva um **documento de instruções** no molde do
`docs/JOGO-BLOQUINHOS-INSTRUCOES-FABLE5.md`, contendo:
- Visão do produto (1 parágrafo) e requisitos inegociáveis.
- Fases ordenadas por dependência, com **critério de pronto observável** em
  cada uma.
- Onde paraleliza (e por que essas partes são independentes).
- A fase de verificação: o que será testado **de verdade** e quais lentes a
  revisão adversarial usará.
- O **prompt mestre** de 5–10 linhas que aponta para o documento.

Sugestão no espírito do Shopping Inteligente: *"Radar de Lojas Satélite"* —
mesma lógica do Radar Quiosques para lojas de rua/satélite, com outra base de
marcas e outros pesos.

### Exercício 4 — Executar e verificar (2 h)
Rode o prompt mestre do Exercício 3 no Claude Code, exigindo:
- um commit por fase, em branch própria;
- verificação real antes do push (abrir no navegador / rodar o caso de teste);
- relatório final do que foi testado.
Depois compare: o que o plano previu bem? Onde a IA precisou decidir sozinha?
O que você adicionaria ao documento na versão 2?

### Exercício 5 — Adicionar um trabalhador de IA a um fluxo determinístico (avançado)
Especifique (só o desenho, sem implementar) como adicionar ao Radar Quiosques
um agente que recebe a ficha `RQ1:` de um investidor e gera **3 perguntas de
aprofundamento** para a reunião. Defina: o contexto mínimo que ele recebe, o
contrato de saída, onde entra o humano, e **o que ele não pode fazer** (ex.:
alterar o score — lembre da regra de ouro).

### Exercício 6 — Guardrails e auditoria para o seu agente (1 h)
Complete o Exercício 5 com a camada de segurança e a de auditoria:
1. **Um guardrail por camada** (entrada, saída, ação, processo), com a regra
   exata — ex.: saída = "JSON com exatamente 3 perguntas, cada uma ≤ 200
   caracteres, sem dados que não estejam na ficha".
2. Classifique cada regra do seu fluxo como **trava dura ou peso**, e
   justifique (o que inviabiliza vs. o que só piora).
3. Defina o **registro por chamada** usando a tabela do Módulo 9.3 — quais
   campos, onde ficam gravados, e qual é o **delta humano** no seu caso.
4. Monte um **golden set de 5 fichas** com as perguntas esperadas, e diga em
   que momentos ele roda (mudança de prompt? de modelo? toda semana?).

---

## Glossário

| Termo | Definição |
|-------|-----------|
| **Orquestração** | Coordenar múltiplas etapas (IA, código, humanos) para atingir um objetivo, decidindo contexto, ordem, paralelismo e verificação. |
| **Harness** | A estrutura em volta do modelo: prompt de sistema, ferramentas, loop de agente, permissões, contratos de saída e verificação. |
| **Agente** | IA com ferramentas e um loop de decisão: age, observa o resultado, decide o próximo passo. |
| **Subagente** | Agente lançado por outro agente para uma subtarefa, com contexto próprio (limpo). |
| **Workflow** | Sequência estruturada de etapas com dependências explícitas, critérios de pronto e verificação. |
| **Pipeline** | Etapas em série: a saída de uma é a entrada da próxima. |
| **Fan-out** | Distribuir N tarefas independentes em paralelo (ex.: um agente por personagem SVG). |
| **Fan-in / barreira** | Ponto onde o fluxo espera todos os paralelos para uma etapa que precisa do conjunto (ex.: harmonizar estilo). |
| **Engenharia de contexto** | Montar, a cada chamada, o menor contexto suficiente — estado fica no banco/arquivos, não na conversa. |
| **Contrato de saída** | Formato fechado e verificável (JSON, CSV, código `RQ1:`) que conecta uma etapa à seguinte sem retrabalho. |
| **Critério de pronto** | Condição observável que define o fim de uma fase ("arrastar 7 sobre 3 forma uma barra dourada"). |
| **Revisão adversarial** | Revisores paralelos com lentes distintas tentando *derrubar* o resultado; só achados confirmados viram mudança. |
| **Human-in-the-loop** | Ponto do fluxo onde um humano confirma/decide antes de a etapa valer (confirmar macros; curadoria do executivo). |
| **Invariante** | Propriedade que deve valer sempre e é barata de testar ("scores entre 0 e 100"). |
| **Checkpoint** | Estado salvo e reversível ao fim de cada fase (na prática: um commit git). |
| **Prompt mestre** | Prompt curto que aciona um documento de instruções longo e versionado. |
| **Guardrail** | Limite determinístico que impede um erro do modelo de virar estrago: validação, trava, permissão ou aprovação humana no caminho obrigatório do fluxo. |
| **Trava dura (gate)** | Reprovação que nenhuma etapa posterior pode compensar — "não é média, é porta". Oposto de **peso**, que só ordena entre os viáveis. |
| **Falhar fechado** | Diante de saída inválida, bloquear e repetir a chamada — nunca aproveitar parcialmente o inválido. |
| **Parâmetros fixados (pinned)** | Modelo, prompt e parâmetros de geração explícitos no código e versionados — trocar é um diff, não um acaso. |
| **Trilha de auditoria** | Registro que permite reconstruir cada decisão: modelo, prompt, contexto, saída, validação e decisão humana. |
| **Delta humano** | Diferença entre o que a IA propôs e o que o humano confirmou — a métrica de qualidade mais barata que existe. |
| **Explicabilidade** | Toda nota/decisão acompanhada do porquê (as razões por dimensão do Radar Quiosques). |
| **Proveniência** | Origem declarada de cada dado, com sua ressalva ("referência ABF/PEGN — validar na COF"). |
| **Golden set** | Conjunto de casos com resposta conhecida, rodado a cada mudança de prompt/modelo — o teste de regressão da IA. |
| **Drift** | Mudança de comportamento do sistema ao longo do tempo ou ao trocar versão de modelo/prompt, detectada por métricas e golden set. |

---

## Referências neste repositório

- Conceito e workflow do Shopping Inteligente: `docs/Agente-Farmer-e-Conector-de-Quiosques.md` e `docs/RADAR-QUIOSQUES.md`
- Orquestração multiagente completa: `docs/JOGO-BLOQUINHOS-INSTRUCOES-FABLE5.md`
- Ciclo de construção com Claude Code: `docs/Guia-Claude-Code-Construir-ou-Melhorar.md`
- Engenharia de contexto na prática: `lib/mealAI.ts`, `lib/prompts.ts` e `README.md` (NutriTreino)
- Contrato de saída (skill): `skill/atualizar-perfil-nutritreino/SKILL.md`

## Notas relacionadas
- [[Shopping Inteligente]]
- [[Agente Farmer e Conector de Quiosques]]
- [[Guia Claude Code — Construir ou Melhorar]]
- [[Claude Code]]
