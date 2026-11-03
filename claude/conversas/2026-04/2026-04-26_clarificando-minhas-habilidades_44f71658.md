---
title: "Clarificando minhas habilidades"
date: 2026-04-26
updated: 2026-04-26
source: "claude-chat"
source_id: "44f71658-ddbe-454d-9289-688304d61a82"
url: "https://claude.ai/chat/44f71658-ddbe-454d-9289-688304d61a82"
project: null
messages: 8
tags: ["claude", "conversa"]
---
# Clarificando minhas habilidades

> **Resumo:** **Conversation Overview**

The person is interested in creating a custom skill for the Claude.ai platform and engaged in a structured dialogue to clarify their intent. Through a series of multiple-choice clarifications, they confirmed they wanted to create a skill for Claude.ai specifically and indicated they were unfamiliar with the format and standards used for skill creation, requesting an explanation from scratch.

Claude attempted to consult internal documentation via file system tools to retrieve skill structure information, then provided an overview of how skills are organized. The explanation covered the basic directory structure (with a required SKILL.md file and optional subdirectories for scripts, references, and assets), the YAML frontmatter format, and a four-step creation process: defining intent, writing the SKILL.md, testing with real cases, and iterating based on results. The conversation ended with Claude asking the person to specify what type of skill they want to build, with the next step being to draft the SKILL.md together.

The person communicates with very brief messages and uses numbered responses to navigate options, suggesting a preference for concise, menu-driven interactions. No specific skill topic or use case was shared yet; that remains the open question for the next interaction.

**Tool Knowledge**

Claude attempted to access skill documentation via file system view operations targeting `/mnt/skills/examples/skill-creator/SKILL.md`. The tool calls were made but no actual file content was returned in the conversation, meaning the explanation Claude provided was based on general knowledge rather than retrieved documentation. Future Claude instances should verify whether the `/mnt/skills/` path is accessible in the current environment before presenting retrieved content as confirmed.

**Mensagens:** 8 · **Criada:** 2026-04-26 · **Atualizada:** 2026-04-26

---

## 👤 Usuário · 2026-04-26 14:02

Habilidades

## 🤖 Claude · 2026-04-26 14:02



Opa! Vi que você listou "Habilidades" na mensagem. Parece que você quer consultar minhas habilidades, mas preciso esclarecer melhor:

1. **Você quer saber quais são minhas capacidades gerais?** (Como posso ajudar em diferentes tarefas)

2. **Você está falando sobre um sistema ou recurso específico** chamado "Habilidades" que você tem acesso?

3. **Você quer que eu ajude com algo relacionado a desenvolver, listar ou gerenciar habilidades?**

Me dá mais contexto aí que respondo direitinho! 

---

**Confiança: 1/10** ⚠️
*Não tenho informação suficiente para responder adequadamente.*

## 👤 Usuário · 2026-04-26 14:02

Quero criar uma habilidade

## 🤖 Claude · 2026-04-26 14:02



Beleza! Algumas perguntas pra entender melhor o que você quer:

1. **Você quer criar uma skill para o Claude.ai** (tipo, adicionar uma funcionalidade nova ao assistente que você usa)?

2. **Você quer aprender a criar uma habilidade/competência pessoal sua?** (Desenvolvimento profissional/pessoal)

3. **Você está falando sobre criar uma "skill" em alguma plataforma específica** (tipo Anthropic, um framework, ou algo assim)?

Dependendo da resposta, a abordagem é bem diferente. Diz aí qual é! 🚀

---

**Confiança: 2/10** ⚠️
*Preciso saber exatamente o contexto antes de dar uma resposta útil.*

## 👤 Usuário · 2026-04-26 14:02

1

## 🤖 Claude · 2026-04-26 14:02



Ótimo! Você quer criar uma skill para o Claude.ai. Preciso de alguns detalhes antes de começar:

1. **Você já tem um arquivo SKILL.md em mãos** ou quer que eu te guie desde o zero sobre como estruturar uma?

2. **Que tipo de skill você quer criar?** (exemplo: uma para processar PDFs, uma para integrar com um serviço externo, uma para um tipo específico de tarefa, etc.)

3. **Você conhece o formato/padrão que o Anthropic usa** para skills, ou preciso explicar como funciona?

Essas respostas vão me ajudar a te direcionar melhor! 

---

**Confiança: 4/10** ⚠️
*Preciso desses detalhes específicos para dar instruções precisas.*

## 👤 Usuário · 2026-04-26 14:03

3

## 🤖 Claude · 2026-04-26 14:03



Certo! Vou te mostrar como o Anthropic estrutura skills. Deixa eu buscar a documentação mais atualizada pra garantir que você tenha as informações corretas:
```
This block is not supported on your current device yet.
```

Perfeito! Deixa eu ver o SKILL.md principal pra te passar a informação correta:
```
This block is not supported on your current device yet.
```

Ótimo! Agora tenho a informação fresca. Vou te explicar como funciona:

## Como criar uma skill para o Claude.ai

Uma **skill** no Anthropic é basicamente um conjunto de instruções especializadas que o Claude consulta quando você precisa fazer algo específico. É como adicionar um "especialista" dentro do assistente.

### A estrutura básica é simples:

```
sua-skill/
├── SKILL.md (obrigatório)
│   ├── YAML no topo (nome, descrição)
│   └── Instruções em Markdown
└── Recursos opcionais
    ├── scripts/    (código para tarefas repetitivas)
    ├── references/ (documentação)
    └── assets/     (templates, ícones, etc.)
```

### Os 4 passos principais:

1. **Defina a intenção**: O que a skill faz? Quando deve ser usada?
2. **Crie um SKILL.md**: Com o frontmatter YAML e as instruções
3. **Teste com casos**: Rode a skill em cenários reais pra ver se funciona
4. **Itere**: Melhore baseado nos resultados

### Agora vem a pergunta importante:

**Que tipo de skill você quer criar?** Por exemplo:
- Uma para processar um tipo específico de arquivo?
- Uma para um workflow repetitivo?
- Uma para integrar com um serviço específico?
- Uma para uma tarefa profissional sua?

Depois que você me disser, a gente:
- Define exatamente o que a skill vai fazer
- Escrevo um rascunho do SKILL.md
- Testamos com alguns exemplos
- Melhoramos baseado no feedback
- Empacota pronto pra usar

Qual é a sua ideia? 🎯

---

**Confiança: 8/10** ✅
*Tenho a documentação oficial em mãos.*
