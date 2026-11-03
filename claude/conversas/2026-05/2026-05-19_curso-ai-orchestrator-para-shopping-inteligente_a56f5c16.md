---
title: "Curso AI orchestrator para shopping inteligente"
date: 2026-05-19
updated: 2026-05-22
source: "claude-chat"
source_id: "a56f5c16-4156-4ca7-b728-8ea68b965420"
url: "https://claude.ai/chat/a56f5c16-4156-4ca7-b728-8ea68b965420"
project: null
messages: 6
tags: ["claude", "conversa"]
---
# Curso AI orchestrator para shopping inteligente

> **Resumo:** **Conversation overview** The person is building a product called "Shopping Inteligente OS" (an intelligent shopping center management system with 16 AI agents for tasks like vacancy management, investor matching, and brand prospecting) and wants to become an AI orchestrator capable of prototyping this product. They are a complete beginner to programming and AI tooling. The conversation covered a full 8-week course structure followed by a deep-dive explanation of every tool as if the person had zero technical background, and concluded with the generation of two Obsidian-ready markdown files. The tools covered in detail were: Claude (web copilot), ChatGPT (secondary copilot for cross-validation), Claude Code (CLI agent that edits files directly), Cursor (AI-powered code editor with Cmd+K shortcut), Lovable (no-code full-stack app generator), v0 (component-level generator by Vercel), Bolt (throwaway prototype tool), n8n (workflow orchestration with JS node support, preferred over Make), Supabase (PostgreSQL database with RLS and Edge Functions, preferred over Airtable), and Airtable (noted as inadequate for production). Key concepts explained from scratch included the distinction between copilot/agent/workflow, what an API and API key are, and what a prompt is. The course structure prioritizes building one complete workflow (Vacancy-to-Contract) before replicating patterns, with Week 1 dedicated entirely to setup. The Week 1 passo a passo was broken into 5 days covering account creation (Anthropic Pro, GitHub, Supabase, Lovable, n8n), Cursor installation and configuration, Anthropic API key generation with `.env` and `.gitignore` security practices, Claude Code installation via npm, Supabase project creation with the São Paulo region, and a first Lovable app connected to Supabase as an end-to-end circuit test. An Obsidian vault structure was also specified (`00-Inbox`, `01-Curso`, `02-Sistema v5`, `03-Skills`, `04-Workflows`, `05-Logs`, `99-Templates`) with a daily log habit recommended. Two `.md` files with full Obsidian formatting (frontmatter, callouts, Mermaid diagrams, wikilinks, checkboxes) were generated and delivered for download. Confidence was consistently flagged at 7-8/10 with explicit uncertainty noted around the exact Claude Code npm package name, Lovable interface changes, and realistic time estimates for a complete beginner.

**Mensagens:** 6 · **Criada:** 2026-05-19 · **Atualizada:** 2026-05-22

---

## 👤 Usuário · 2026-05-19 00:29

Monte um curso para que eu consiga programar um protótipo do produto shopping inteligente. Esse curso deve me preparar para ser im AI orchestrator através das ferramentas:

[[Claude]] + [[ChatGPT]] (copilotos) · [[Claude Code]] (agente CLI) · [[Lovable]] / [[v0]] / [[Bolt]] (apps no-code) · [[n8n]] ou [[Make]] (workflows) · [[Supabase]] ou [[Airtable]] (banco) · [[Cursor]] (editor IA)

## 🤖 Claude · 2026-05-19 00:30

  Estou estruturando um curso prático para o usuário se tornar um AI orchestrator, construindo um protótipo do "Shopping Inteligente" com as ferramentas específicas que ele mencionou — Claude, ChatGPT, Lovable, n8n, Supabase e Cursor — mantendo o foco em objetividade e confiança calibrada conforme suas preferências.

Agora estou pensando na arquitetura real do produto: Lovable para a interface do cockpit, Supabase como banco de dados escalável, n8n para orquestração de workflows entre agentes, Claude como agente principal com prompts específicos, e Cursor para desenvolvimento local. Vou estruturar o curso em módulos que começam com fundamentos sobre como pensar como orchestrator, depois avançam para arquitetura...

Mapeando os 16 agentes no sistema real, decidindo o que é prompt versus workflow versus código, e desenhando o fluxo de dados completo. Depois vem a construção do Supabase com as 7 tabelas principais, RLS, autenticação e Edge Functions. Finalmente, implemento os agentes começando com o Orquestrador e Deal Conversion, seguido pelos agentes Hunter, Farmer e KA.

Depois preciso orquestrar tudo com n8n, conectando webhooks à Claude API e Supabase com workflows automáticos. O frontend em Lovable/v0/Bolt terá o cockpit visual com pipeline Kanban, tabelas de Deal Conversion e formulários de input. Vou usar Cursor e Claude Code para iteração rápida, e finalmente integro tudo para o MVP e deploy.

Tenho confiança na estrutura geral, mas reconheço incertezas nos detalhes específicos de cada ferramenta frontend — essas tecnologias evoluem rápido — e nas best practices mais atualizadas. Vou manter a resposta concisa para mobile, mas com substância de curso, usando headers para os módulos e prosa curta com bullets quando necessário, e flagarei essas limitações no final. Vou estruturar a resposta de forma mais longa já que é um curso, mas mantendo cada seção concisa e focada.# Curso: AI Orchestrator do Shopping Inteligente

Vou te dar uma estrutura de **8 semanas** que entrega um MVP funcional do cockpit, não um curso teórico. A ordem importa: cada módulo destrava o seguinte.

**Princípio guia (Sam Zell + Gary Tan):** não construa os 16 agentes. Construa **1 workflow ponta-a-ponta** (sugiro Vacancy-to-Contract) e depois replique o padrão. Plan first, verify before done.

---

## Módulo 0 — Mentalidade de Orchestrator (3 dias)

Antes de qualquer ferramenta, internalize 3 distinções:

- **Copiloto** (Claude/ChatGPT no chat): pensa *com você*. Usa para planejar, debugar, escrever prompts.
- **Agente** (Claude API via prompt + skill): executa tarefa específica sozinho. Cada uma das 16 skills do v5 é um agente.
- **Workflow** (n8n/Make): orquestra múltiplos agentes + banco + APIs. É o "encanamento".

**Entrega:** um doc de 1 página mapeando, para cada agente do v5, se ele vira *prompt puro*, *workflow*, ou *código*. Use o Claude (web) para gerar a primeira versão e iterar.

---

## Módulo 1 — Arquitetura e Setup (semana 1)

**Decisões irreversíveis primeiro:**

- **Banco:** Supabase (não Airtable). Você precisa de RLS, Edge Functions e SQL real para os scores. Airtable trava em volume.
- **Frontend:** Lovable para o cockpit (gera app React + conecta Supabase nativamente). v0 só se for componente isolado. Bolt para protótipo descartável.
- **Orquestração:** n8n self-hosted (Docker) ou cloud. Make só se quiser zero-code total — mas vai te limitar nos agentes.
- **Editor:** Cursor com Claude Sonnet 4.6 como modelo padrão. Claude Code no terminal para tarefas multi-arquivo.

**Setup checklist:**
1. Conta Anthropic com créditos API
2. Supabase projeto criado
3. n8n rodando (cloud ou Docker local)
4. Cursor instalado, GitHub conectado
5. Lovable conta com Supabase linkado

---

## Módulo 2 — Modelagem do Banco (semana 2)

As 7 bases do infográfico viram tabelas Supabase. Comece por **4 tabelas críticas**, não as 7:

1. `pontos_vagos` (Form 01)
2. `investidores` (Form 02 + suitability score)
3. `marcas` (Form 03 + ABF enriquecida depois)
4. `deal_pipeline` (16 estágios do Deal Conversion Layer)

**Use Claude (web) como copiloto de schema:** cole o doc `08_DICIONARIO_DADOS_SCORES_UNDERWRITING_v5.md` e peça: *"gere o SQL Supabase com RLS para essas tabelas, incluindo campos calculados para Cluster Fit Score, SRIS, Conversion Score"*.

Verifique cada tabela rodando inserts manuais antes de seguir. Esta é a etapa onde mais gente quebra o pescoço depois.

---

## Módulo 3 — Construir os Agentes como Prompts (semanas 3–4)

Cada skill do v5 é um **system prompt** + **schema de input/output JSON**. Você não vai treinar nada — vai engenheirar prompts.

**Ordem de construção (a mais valiosa primeiro):**

1. **Skill 0 — Orquestrador Central**: recebe pedido em PT-BR, decide workflow, chama outros agentes
2. **Skill 1 — Deal Conversion Layer**: classifica leads nos 16 estágios
3. **Skill 3 — Hunter**: prospecção 2–50km (usa Google Places API gratuita)
4. **Skill 7 — Farmer**: suitability de investidor
5. **Skill 8 — KA Expansion**: match marca × investidor × ponto

**Padrão de cada agente:**

```
Input JSON → Claude API (system prompt + user prompt) → Output JSON validado → Supabase
```

Use Cursor + Claude Code para escrever os wrappers em Node.js ou Python. Cada agente é uma função de ~50 linhas.

**Teste isolado antes de orquestrar.** Cada agente precisa funcionar standalone via curl ou Postman.

---

## Módulo 4 — Orquestração com n8n (semanas 5–6)

Implemente **Workflow 1 — Vacancy-to-Contract Sprint** inteiro:

```
Webhook (loja vaga) 
  → Cluster Positioning Engine (agente) 
  → Plataforma de Espaços (lê Supabase) 
  → Hunter (Google Places + Claude) 
  → Farmer (lê CRM investidores) 
  → KA Match (Claude)
  → Deal Conversion Layer (insere no pipeline)
  → Notifica EV (Slack/email)
```

Em n8n cada nó é um agente ou uma query Supabase. Use **Set Node** para validar JSON entre etapas (o erro mais comum).

**Regra crítica:** respeite o gate de API paga. Crie um nó condicional que só chama SerpApi/Similarweb se `api_paga_autorizada = true` no input.

---

## Módulo 5 — Frontend Cockpit (semana 7)

No Lovable, gere o cockpit em 3 telas:

1. **Pipeline Kanban** dos 16 estágios (Deal Conversion Table visual)
2. **Ficha do Ponto Vago** com fotos, planta, scores
3. **Dashboard KPIs** (dias-de-vacância, taxa de conversão, impacto financeiro)

Prompt inicial pro Lovable: *"crie um cockpit operacional B2B para shopping center, conectado ao Supabase [link], com Kanban dos estágios de pipeline imobiliário, autenticação por email, e tabela filtrável de oportunidades com scores 0-100 codificados por cor"*.

Itere com prints e feedback. Lovable acerta em 3–5 ciclos.

---

## Módulo 6 — Cursor + Claude Code (semana 8, paralelo)

Use **ao longo de todos os módulos**, não só no final:

- **Cursor:** edição de arquivos do projeto. Tab autocompleta, Cmd+K refatora, chat lateral pra explicar.
- **Claude Code:** tarefas grandes ("crie a integração Supabase → n8n → Slack com tratamento de erros"). Roda no terminal, edita múltiplos arquivos.

**Quando usar qual:**
- Sei o que quero, 1 arquivo → Cursor
- Quero delegar uma feature inteira → Claude Code
- Quero pensar/discutir → Claude web

---

## Módulo 7 — MVP integrado, demo e iteração

Roda Workflow 1 com 1 loja real do seu shopping. Mede:
- Tempo do lead até proposta
- Qualidade do match (você aprova o que o KA sugeriu?)
- Onde o sistema falha sozinho

Só depois disso replique para Workflows 2 e 3.

---

## Stack final por função

| Função | Ferramenta |
|---|---|
| Planejamento e prompts | Claude web |
| Código e refactor | Cursor + Claude Code |
| Banco | Supabase |
| Agentes (LLM calls) | Claude API |
| Orquestração | n8n |
| Frontend | Lovable |
| Copiloto cruzado | ChatGPT (segunda opinião) |

---

## Pontos onde não tenho certeza alta

- **Lovable vs v0 vs Bolt** mudam rápido. Em mai/2026 acredito que Lovable continua o mais forte pra apps full-stack com Supabase, mas vale você abrir os três e fazer um teste de 1h em cada antes de cravar.
- **n8n vs Make:** prefiro n8n pela flexibilidade com código JS dentro dos nós (você vai precisar disso pros scores). Make é mais bonito mas trava antes.
- **Tempo de 8 semanas** assume ~15h/semana focadas. Se for menos, dobra. Se você já programa, corta 30%.

**Confiança geral: 7/10.** A arquitetura está sólida e segue o que funciona em produtos similares. O 3 que falta é por (1) não saber teu nível de programação atual, (2) preço/features atualizados das ferramentas no-code podem ter mudado, e (3) não testei essa stack específica end-to-end com o v5 do seu sistema.

**Quer que eu detalhe um módulo específico, monte o SQL das 4 tabelas do Módulo 2, ou escreva o system prompt do Orquestrador (Skill 0) já pronto para colar na API?**

## 👤 Usuário · 2026-05-19 00:35

Me ensine sobre todos os recursos como se eu fosse completamente leigo

## 🤖 Claude · 2026-05-19 00:37

 # Curso AI Orchestrator do Zero — Versão Leigo

Vou te explicar **o que cada coisa é, pra que serve e por que existe**, antes de qualquer "como fazer". Sem jargão. Quando aparecer um termo técnico, eu explico na hora.

---

## Parte 1 — O conceito antes das ferramentas

### O que é um "AI Orchestrator"?

Imagina um maestro de orquestra. Ele não toca nenhum instrumento, mas sabe qual músico chamar, em que ordem, e por quanto tempo. Um AI Orchestrator faz isso com ferramentas de IA: você decide *qual IA faz qual tarefa, em que ordem, usando quais dados*.

No teu caso: o "Hunter" precisa achar lojas no Google Maps, depois o "Farmer" precisa achar um investidor no teu banco de dados, depois o "KA" cruza os dois. Você é o maestro que monta esse fluxo.

### Por que isso virou possível agora?

Porque as IAs (Claude, ChatGPT) hoje conseguem **ler instruções em português, decidir o que fazer, e devolver resultado estruturado**. Antes você precisava programar tudo na mão. Hoje você descreve em texto e a IA executa.

### Os 3 tipos de ferramenta que você vai usar

Pensa numa cozinha:

1. **Copiloto** = o chef que conversa com você enquanto cozinha. Te ajuda a pensar. (Claude e ChatGPT no navegador)
2. **Agente** = um robô que faz UMA tarefa específica bem feita, sozinho. (Claude via API, Claude Code)
3. **Workflow** = a esteira da cozinha industrial que conecta vários robôs em sequência. (n8n, Make)

Você precisa dos três. Cada um tem um momento.

---

## Parte 2 — As ferramentas, uma por uma

### Claude (claude.ai) — seu copiloto principal

**O que é:** um chatbot, igual ao ChatGPT. Você abre no navegador, escreve uma pergunta, ele responde.

**Por que importa:** o Claude é particularmente bom em raciocínio longo, escrever código e seguir instruções complexas. Para o teu projeto, ele vai ser teu "sócio de pensamento".

**Quando usar:**
- "Claude, me explica o que é uma API REST como se eu tivesse 12 anos"
- "Claude, olha esse documento e me diz se faz sentido"
- "Claude, escreve o prompt do agente Hunter"

**Como começar:** vai em claude.ai, cria conta, assina o Pro (~US$20/mês). O plano grátis trava rápido.

---

### ChatGPT — copiloto secundário

**O que é:** mesma coisa que o Claude, feito pela OpenAI.

**Por que ter os dois:** quando você está em dúvida sobre uma resposta do Claude, joga a mesma pergunta no ChatGPT e compara. Funciona como segunda opinião médica. Modelos diferentes erram em coisas diferentes.

**Quando usar:** validação cruzada, brainstorming alternativo, quando o Claude trava num assunto.

---

### Claude Code — o agente que mexe nos teus arquivos

**O que é:** um programa que roda no **Terminal** do teu computador (aquela tela preta com texto que faz programador parecer hacker em filme). Você escreve em português o que quer e ele cria, edita e deleta arquivos no teu projeto sozinho.

**Diferença pro Claude do navegador:** o Claude do navegador *te diz* o código. O Claude Code *executa* o código por você, escrevendo direto nos arquivos.

**Analogia:** Claude do navegador é um arquiteto que te entrega a planta. Claude Code é o pedreiro que constrói a parede enquanto você assiste.

**Quando usar:** "cria um projeto novo de cockpit", "conecta esse projeto ao Supabase", "implementa o agente Hunter". Tarefas grandes que envolvem vários arquivos.

**Como começar:** depois que você tiver o Cursor instalado (próximo item), o Claude Code se instala com um comando único no terminal. A documentação da Anthropic tem o passo a passo.

---

### Cursor — o editor de código com IA embutida

**O que é:** um programa onde você abre os arquivos do teu projeto pra editar. Igual ao Word, mas pra código. A diferença: o Cursor tem IA dentro dele, então enquanto você digita, ele sugere o próximo trecho, e você pode pedir "explica essa linha" ou "refatora isso" sem sair do editor.

**Por que não usar bloco de notas:** porque você vai trabalhar com dezenas de arquivos. Cursor organiza, destaca erros em vermelho, e tem o atalho mágico **Cmd+K** (Mac) ou **Ctrl+K** (Windows) que abre uma caixinha onde você pede em português pra IA mudar o código selecionado.

**Quando usar:** edição fina, ajustes pontuais, ler código pra entender.

**Como começar:** baixa em cursor.com, instala, abre a pasta do teu projeto. Pronto.

---

### Lovable — fábrica de app pronto, sem código

**O que é:** um site onde você descreve em português o app que quer ("um cockpit pra shopping com kanban de oportunidades") e ele gera o app inteiro funcionando, com tela bonita e tudo.

**Por que parece mágica e quase é:** o Lovable usa IA pra escrever todo o código por trás. Você só vê o resultado e fala "muda isso, adiciona aquilo".

**Limitações reais:** ele acerta o básico fácil, mas em coisas muito específicas você precisa entrar no código (que ele mostra) e ajustar. Por isso o Cursor importa.

**Quando usar:** pra construir a tela onde teu usuário (executivo do shopping) vai clicar. O "front-end", como chamam.

**Como começar:** lovable.dev, descreve teu app, ele constrói. Conecta com Supabase em 2 cliques.

---

### v0 — irmão do Lovable, feito pela Vercel

**O que é:** mesma ideia, focado mais em **componentes** (pedaços de tela) do que app inteiro. Você pede "um card de oportunidade com score colorido" e ele entrega.

**Quando usar em vez do Lovable:** quando você só precisa de uma peça isolada, não um app completo.

**Honestamente:** começa com Lovable. v0 é complemento.

---

### Bolt — outro irmão da família

**O que é:** parecido com Lovable, da empresa StackBlitz.

**Quando usar:** pra protótipo descartável de 1 hora. "Quero ver como ficaria essa ideia". Não pra produto final.

---

### n8n — a esteira que conecta tudo

**O que é:** imagina o jogo de tabuleiro onde você liga blocos com setas. Cada bloco é uma ação ("buscar no Google", "perguntar pro Claude", "salvar no banco"). As setas definem a ordem. Isso é n8n.

**Por que isso existe:** sem n8n, você precisaria programar manualmente cada conexão. Com n8n, você arrasta blocos, conecta com setas, e a esteira roda sozinha 24h por dia.

**Caso teu:** quando uma loja fica vaga no teu shopping, o n8n pode automaticamente: 
1. detectar a vacância → 
2. chamar o Hunter pra buscar marcas → 
3. chamar o Farmer pra achar investidor → 
4. salvar tudo no banco → 
5. mandar notificação no teu celular.

Sem você fazer nada. Esse é o pulo do gato.

**Como começar:** n8n.io, plano cloud (mais fácil) ou self-hosted (mais barato, mais técnico).

---

### Make — primo do n8n

**O que é:** mesma coisa que n8n, mais bonito visualmente, um pouco menos flexível.

**Qual escolher:** n8n é melhor para o teu caso porque permite escrever pedacinhos de código JavaScript dentro dos blocos quando você precisa de algo específico (e você vai precisar, pros cálculos de score). Make trava nisso.

---

### Supabase — o banco de dados

**O que é um banco de dados:** uma planilha gigante, organizada, que várias pessoas e programas podem ler e escrever ao mesmo tempo sem dar pau. Tipo um Excel com superpoderes.

**O que o Supabase faz:** te entrega esse banco pronto, na nuvem, com tela de administração, autenticação de usuário (login/senha), e uma "API" automática (jeito do teu app conversar com o banco).

**Por que ele e não o Excel:** Excel quebra com mais de 10 mil linhas, não tem login, não conecta com app. Banco resolve.

**Como começar:** supabase.com, cria projeto, ele te dá um link e umas chaves. Você usa essas chaves no Lovable e no n8n pra todos conversarem com a mesma base.

---

### Airtable — alternativa mais simples

**O que é:** uma planilha online turbinada, parecida com Excel, mas que funciona como banco de dados leve.

**Por que NÃO usar no teu caso:** trava em volume e não tem regras de segurança boas. Supabase é mais trabalhoso de aprender mas é o certo. Airtable serve pra protótipo de 1 semana.

---

## Parte 3 — Como tudo se encaixa

Imagina o fluxo de uma oportunidade real no teu shopping:

```
Você cadastra uma loja vaga no Lovable (app bonito)
         ↓
Lovable salva no Supabase (banco)
         ↓
n8n detecta novo registro no Supabase
         ↓
n8n chama o Claude API com prompt do Hunter
         ↓
Claude retorna lista de marcas candidatas
         ↓
n8n salva candidatas no Supabase
         ↓
Lovable mostra as candidatas na tua tela
         ↓
Você aprova/reprova clicando
```

Você nunca toca em nada técnico depois de montado. Só usa o app.

---

## Parte 4 — Onde cada ferramenta entra no teu curso

| Semana | Foco | Ferramenta principal |
|---|---|---|
| 1 | Entender o todo, criar contas | Claude web, ChatGPT |
| 2 | Montar o banco | Supabase (com Claude te ensinando) |
| 3–4 | Escrever os prompts dos agentes | Claude web + Cursor |
| 5–6 | Montar a esteira | n8n |
| 7 | Montar a tela | Lovable |
| 8 | Juntar tudo e testar | Claude Code pra ajustes finos |

---

## Parte 5 — Dois conceitos técnicos que você precisa entender

**API:** é o "telefone" que um programa usa pra falar com outro. Quando o n8n "chama o Claude", ele liga pra API do Claude. Você não precisa entender como funciona por dentro, só saber que existe e que você vai precisar de uma **API key** (uma senha longa) pra usar.

**Prompt:** é a instrução em português que você dá pra IA. "Você é o Hunter, sua missão é encontrar marcas..." é um prompt. A qualidade do teu prompt define a qualidade da resposta. Engenharia de prompt é 50% do teu trabalho.

---

## Por onde começar AMANHÃ

1. Abre claude.ai e assina o Pro
2. Cria conta no Supabase (grátis)
3. Cria conta no Lovable (tem trial)
4. Baixa o Cursor (grátis pra começar)
5. Pega o doc `01_SYSTEM_PROMPT_MASTER` que você já tem, cola no Claude e pede: *"me explica esse documento como se eu fosse leigo, em 3 parágrafos"*

Esse último passo é o teste do limiar — se você entende a resposta, está pronto pra Semana 1. Se não, pergunta de novo até entender.

---

## Confiança e ressalvas

**Confiança: 8/10.**

Pontos onde tenho menos certeza:
- **Preço exato e features mais novas** das ferramentas no-code (Lovable, v0, Bolt) podem ter mudado nas últimas semanas — vale você abrir e conferir
- **Curva de aprendizado real** depende muito do teu background (se já mexeu com fórmula de Excel complexa, vai ser mais rápido)
- **n8n vs Make** é uma escolha que outros engenheiros podem discordar — ambos funcionam, n8n é minha aposta

**O que eu não sei sobre você** e mudaria a recomendação: se você já programa minimamente, se tem ajuda técnica disponível, se o orçamento mensal pra ferramentas (~US$100–200) é confortável.

**Quer que eu detalhe alguma ferramenta específica em mais profundidade, ou prefere que eu te guie passo a passo pelo Setup da Semana 1 (criar as contas e configurar)?**

## 👤 Usuário · 2026-05-19 10:39

Gere um arquivo .md para exportar para o obsidian com essas instruções e na sequência faça o passo a passo do Setup da Semana 1

## 🤖 Claude · 2026-05-19 10:42

 
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

Dois arquivos prontos pra arrastar no teu vault do Obsidian:

**1. Curso_AI_Orchestrator_Shopping_Inteligente.md** — o curso completo conceitual com frontmatter, callouts (`> [!tip]`, `> [!warning]`), checkboxes, diagrama Mermaid e wikilinks `[[ ]]` ligando pra nota da Semana 1.

**2. Setup Semana 1 - Passo a Passo.md** — roteiro operacional dividido em 5 dias, ~6-10h totais. Cada dia tem checkpoint, comandos exatos pra copiar/colar, troubleshooting e log diário.

## Como importar no Obsidian

1. Abre teu vault do Obsidian
2. Cria a pasta `01 - Curso/`
3. Arrasta os dois arquivos pra dentro
4. Os wikilinks ligam sozinhos

## Pontos onde tenho menos confiança

**Confiança geral: 7/10.**

- **Comando de instalação do Claude Code** (`npm install -g @anthropic-ai/claude-code`) pode estar desatualizado — recomendo verificar [docs.claude.com](https://docs.claude.com) antes de rodar. Confiança nesse trecho específico: 6/10.
- **Interface do Lovable** muda quase toda semana — os botões "Integrations" e "Connect Supabase" podem ter outro nome
- **Tempo estimado de 6-10h** assume zero trava. Se você é leigo total, espera 12-15h
- **Modelos disponíveis no Cursor** evoluem rápido; `claude-sonnet-4`/`claude-opus-4` podem ter sido substituídos por versões mais novas

## Sugestão de próximo passo

Antes de começar o Dia 1, te recomendo fortemente fazer o **"teste do limiar"** que está na Parte 5: cola o doc `01_SYSTEM_PROMPT_MASTER_SHOPPING_INTELIGENTE_OS_v5.txt` no Claude e pede pra ele explicar como se você fosse leigo. Se a resposta fizer sentido, você está pronto. Se não, pergunta de novo até fazer.

Quer que eu já prepare a **Semana 2 — Modelagem do Banco** com o SQL pronto das 4 tabelas críticas?
