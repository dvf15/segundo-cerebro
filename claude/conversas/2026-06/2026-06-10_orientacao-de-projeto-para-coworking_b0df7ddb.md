---
title: "Orientação de projeto para coworking"
date: 2026-06-10
updated: 2026-06-10
source: "claude-chat"
source_id: "b0df7ddb-7cb8-4da2-8ac0-e4ef9570a518"
url: "https://claude.ai/chat/b0df7ddb-7cb8-4da2-8ac0-e4ef9570a518"
project: null
messages: 2
tags: ["claude", "conversa"]
---
# Orientação de projeto para coworking

> **Resumo:** **Conversation Overview**

Daniel, a commercial executive at Allos working with shopping center commercialization, asked for step-by-step instructions on how to use the Cowork desktop tool to transform his existing "Shopping Inteligente OS" project into a functional plugin. The Shopping Inteligente OS is a multi-agent AI system with 15+ specialized agents (including Hunter, Farmer, KA, Street Converter, and others), three priority workflows (Vacancy-to-Contract, Street-to-Shopping, Cluster Experience Growth), and a scoring system with multiple scores (SRIS, Cluster Fit, Conversion, Financial Impact).

Claude read the Cowork plugin creation SKILL.md file and provided a detailed guide covering the full five-phase plugin creation process: Discovery, Component Planning, Design, Implementation, and Package. The guidance included specific language for Daniel to use when initiating the Cowork session, a recommended component structure (approximately 10 skills, no agents or hooks initially), and a prioritized list of source files to map to skills, referencing Daniel's existing project files such as `01_SYSTEM_PROMPT_MASTER`, `06_SKILLS_AGENTES`, `08_DICIONARIO_DADOS_SCORES`, and others. Claude recommended a minimum viable approach starting with Orquestrador, Cluster Positioning, Deal Conversion Layer, and the two main prospecting agents before adding the rest in subsequent versions. A key constraint noted was the ~3,000-word limit per SKILL.md file, with dense content directed to `references/` folders.

**Mensagens:** 2 · **Criada:** 2026-06-10 · **Atualizada:** 2026-06-10

---

## 👤 Usuário · 2026-06-10 11:20

me diga como orientar o cowork para aprimorar esse projeto, me passe o passo a passo das instrucoes e etc

## 🤖 Claude · 2026-06-10 11:21

 Vou ler o skill do Cowork antes de responder.
```
This block is not supported on your current device yet.
```

Agora tenho o que preciso. Deixa eu te dar um guia prático e direto.

---

## Como usar o Cowork para aprimorar o Shopping Inteligente OS

O Cowork é uma ferramenta desktop que transforma Claude num agente com habilidades persistentes via **plugins**. O que você quer fazer é empacotar o Shopping Inteligente OS como um plugin `.plugin` que o Cowork carrega automaticamente em qualquer sessão.

---

### O que você ganha com isso

Hoje o sistema depende de você colar o system prompt toda vez. Com o plugin:

- Os agentes e skills ficam **sempre ativos** sem copiar nada
- Você pode adicionar **skills modulares** (uma por agente) que o Claude carrega só quando precisa, economizando contexto
- Dá pra versionar e evoluir o sistema sem reescrever tudo

---

### Passo a Passo

**Fase 1 — Abrir o Cowork e iniciar uma sessão de criação de plugin**

No Cowork, inicie uma conversa nova e diga exatamente isso:

> "Quero criar um plugin para o Cowork. Ele vai ser o Shopping Inteligente OS, um sistema de agentes de IA para comercialização de shoppings centers. Já tenho todo o conteúdo estruturado — system prompt, skills de agentes, workflows, dicionário de dados, templates de execução. Quero transformar isso num plugin funcional."

O Claude vai iniciar o fluxo guiado de 5 fases (Discovery → Planning → Design → Implementation → Package).

---

**Fase 2 — Discovery (o que responder)**

O Claude vai perguntar o propósito e escopo. Responda assim:

> "O plugin tem 15+ agentes especializados (Hunter, Farmer, KA, Street Converter, etc.), 3 workflows prioritários (Vacancy-to-Contract, Street-to-Shopping, Cluster Experience Growth), um sistema de scoring com múltiplos scores (SRIS, Cluster Fit, Conversion, Financial Impact), e regras operacionais fixas como política de API paga e Deal Conversion Layer obrigatório. Os usuários são executivos de comercialização de shoppings centers, especificamente eu (Daniel) na Allos."

---

**Fase 3 — Component Planning (o que confirmar)**

O Cowork vai propor os componentes. Confirme este plano:

| Componente | Quantidade | Propósito |
|---|---|---|
| Skills | ~10 | Uma por agente principal + workflows + dicionário |
| Agents | 0 | Não precisar por ora |
| Hooks | 0 | Não por ora |
| MCP | 0 | Não por ora |

Se ele sugerir mais, você pode aceitar ou simplificar. **Comece com o mínimo viável.**

---

**Fase 4 — Design (os arquivos que você vai fornecer)**

Aqui é onde você entrega o conteúdo. Para cada skill, o Cowork precisa de:

1. **Quais perguntas/comandos disparam a skill** — ex: "Rode o Hunter", "preciso prospectar marcas para loja vaga"
2. **O conteúdo da skill em si** — que você já tem nos arquivos do projeto

Você vai fornecer os arquivos do projeto diretamente. Os principais são:

- `01_SYSTEM_PROMPT_MASTER` → skill do Orquestrador / contexto base
- `04_SKILL_0_ORQUESTRADOR` → skill 0
- `05_SKILL_1_DEAL_CONVERSION` → skill do pipeline
- `06_SKILLS_AGENTES` → skills dos 15 agentes
- `02_CONTEXTO_CLUSTERIZACAO` → skill de cluster
- `07_TEMPLATES_EXECUCAO` → skill de templates
- `08_DICIONARIO_DADOS_SCORES` → skill de scoring/underwriting

**Dica prática:** cole o conteúdo de cada arquivo quando o Cowork pedir. Ele vai montar os SKILL.md automaticamente.

---

**Fase 5 — Review & Package**

O Cowork valida a estrutura, gera o arquivo `.plugin` e entrega para você instalar com um clique.

---

### Uma sugestão de ordem de prioridade para as skills

Se quiser começar pelo mínimo viável antes de empacotar tudo:

1. **Orquestrador + System Prompt** — contexto base que orienta tudo
2. **Cluster Positioning** — sem cluster nada funciona
3. **Deal Conversion Layer** — pipeline obrigatório em toda execução
4. **Hunter + Street Converter** — os dois agentes de prospecção mais usados
5. O resto depois, em versões subsequentes

---

### Observação importante

Esse fluxo funciona **dentro do Cowork desktop**, não no claude.ai. Se você ainda não tem o Cowork instalado, esse é o pré-requisito. O plugin final é um arquivo `.plugin` que você instala pelo app.

Confiança: 7/10 — tenho certeza do processo de criação do plugin e da arquitetura. O que não posso garantir sem testar é se todos os arquivos do projeto vão caber sem compressão dentro dos limites de tamanho das skills (máximo ~3.000 palavras por SKILL.md, conteúdo denso vai em `references/`).
