---
title: "Framework de mentoria em formato Obsidian"
date: 2026-05-18
updated: 2026-05-18
source: "claude-chat"
source_id: "a3af41b2-6df1-48fe-93d2-34620732841c"
url: "https://claude.ai/chat/a3af41b2-6df1-48fe-93d2-34620732841c"
project: null
messages: 4
tags: ["claude", "conversa"]
---
# Framework de mentoria em formato Obsidian

> **Resumo:** **Conversation Overview**

The person asked Claude to reformat a mentoring framework document into Obsidian-compatible Markdown format. The original content was a structured Portuguese-language guide for conducting mentoring sessions, covering pre-session diagnosis, an opening phase (with agreements, roles, theme, broad and specific context, and structured demand), a development phase (mentee requests, context exploration, reflective questions, and mentor input), and a closing phase (co-construction of actions, next steps, and session summary with competencies).

Claude produced a fully formatted Obsidian note using YAML frontmatter (with fields for tipo, área, status, criado, tags, and aliases), wikilinks on key concepts, callout blocks, checkbox-style action items, a Dataview query block for linked sessions, and horizontal dividers between sections. Claude also appended a usage note explaining the purpose of wikilinks, the Dataview plugin dependency, the aliases feature, and a suggested templating workflow for instancing per-session copies.

After receiving the formatted output, the person explicitly instructed Claude to apply this same Obsidian formatting approach to all future formatting requests of this type. Claude confirmed the preference was saved to memory. The established format standard includes: YAML frontmatter, wikilinks on conceptual terms, callouts, checkboxes for actions, a Dataview block for connections, a usage note, and a confidence rating at the end.

**Mensagens:** 4 · **Criada:** 2026-05-18 · **Atualizada:** 2026-05-18

---

## 👤 Usuário · 2026-05-18 07:46

Coloque obtexto abaixo no formato para obsidian, preparado para conexões:

Framework Mentoria
Histórico profissional e de vida do Mentorado
 
No que pretende se desenvolver? Qual o projeto?
 
Desafios e dificuldades até aqui
 
ABERTURA
Acordos (agendamento (6 sessões), encontros e prioridades); Confidencialidade, transparêncoia (falar caso algo não esteja adequado); O que mais?
Papeis 
Tema
Contexto Amplo – Momento em relação ao projeto; Ambições; contexto organizacional; Como se alinha a estratégia?; Passos necessários?
Contexto Específico – Desafios? Como posso te ajudar hoje? Como vc gostaria de sair dessa conversa? Alguma pergunta que vc gostaria de ter respondida ao final dessa conversa?
Demanda Estruturada
 
DESENVOLVIMENTO
Pedidos do mentorado
Exploração do contexto
Perguntas que gerem reflexões
Partilhar a visão do mentor (se fizer sentido)
 
FECHAMENTO
Co-construção das ações para atender à demanda
Pacto dos próximos passos
Resumo do encontro coletando as competências trabalhadas

## 🤖 Claude · 2026-05-18 07:46

  I'm recognizing this is a formatting task for Obsidian, so I need to structure the content with wikilinks for key concepts, tags for organization, and YAML frontmatter to make it ready for internal connections.```markdown
---
tipo: framework
área: mentoria
status: ativo
criado: 2026-05-18
tags:
  - mentoria
  - framework
  - desenvolvimento-pessoal
  - coaching
aliases:
  - Framework de Mentoria
  - Roteiro de Sessão de Mentoria
---

# Framework Mentoria

> [!info] Sobre este framework
> Roteiro estruturado para condução de sessões de [[Mentoria]] entre [[Mentor]] e [[Mentorado]].

---

## Pré-sessão: Diagnóstico do Mentorado

### Histórico profissional e de vida do [[Mentorado]]
- 

### No que pretende se desenvolver? Qual o [[Projeto]]?
- 

### Desafios e dificuldades até aqui
- 

---

## 1. ABERTURA

### Acordos
- [[Agendamento]] — 6 sessões
- Encontros e prioridades
- [[Confidencialidade]]
- [[Transparência]] — falar caso algo não esteja adequado
- O que mais?

### [[Papéis]]
- 

### [[Tema]]
- 

### [[Contexto Amplo]]
- Momento em relação ao [[Projeto]]
- [[Ambições]]
- [[Contexto Organizacional]]
- Como se alinha à [[Estratégia]]?
- Passos necessários?

### [[Contexto Específico]]
- Desafios?
- Como posso te ajudar hoje?
- Como você gostaria de sair dessa conversa?
- Alguma pergunta que você gostaria de ter respondida ao final dessa conversa?

### [[Demanda Estruturada]]
- 

---

## 2. DESENVOLVIMENTO

### Pedidos do [[Mentorado]]
- 

### Exploração do contexto
- 

### [[Perguntas Poderosas|Perguntas que gerem reflexões]]
- 

### Partilhar a visão do [[Mentor]]
> _Se fizer sentido_
- 

---

## 3. FECHAMENTO

### Co-construção das [[Ações]] para atender à demanda
- [ ] 
- [ ] 

### [[Pacto]] dos próximos passos
- 

### Resumo do encontro
> Coletar as [[Competências]] trabalhadas
- 

---

## Conexões relacionadas
- [[Mentoria]]
- [[Coaching]]
- [[Desenvolvimento de Pessoas]]
- [[Liderança]]

## Sessões registradas
```dataview
LIST FROM #sessao-mentoria
SORT file.ctime DESC
```
```

---

**Notas de uso no Obsidian:**

- Os `[[wikilinks]]` criam conexões automáticas — clicando em qualquer um, o Obsidian abre (ou propõe criar) a nota correspondente.
- O bloco `dataview` no final só funciona se você tiver o plugin **Dataview** instalado. Caso não use, é só remover.
- O `aliases` no frontmatter permite que a nota seja encontrada por nomes alternativos.
- Sugestão: duplicar este arquivo como **template** (`Templates` plugin) e instanciar uma cópia a cada sessão com nome tipo `Sessão 1 — [Nome do Mentorado] — 2026-05-18`.

**Confiança: 10/10** — tarefa de formatação pura, sem afirmações factuais a verificar. A sintaxe Markdown/Obsidian utilizada (frontmatter YAML, wikilinks, callouts, checkboxes, blocos dataview) é estável e documentada.

## 👤 Usuário · 2026-05-18 07:51

De agora em diante, sempre que eu pedir para colocar no formato para obsidian, faça dessa maneira

## 🤖 Claude · 2026-05-18 07:52

 
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Anotado. Sempre que você pedir "formato para obsidian", vou seguir esse mesmo padrão: frontmatter YAML, wikilinks nos conceitos-chave, callouts, checkboxes, bloco dataview para conexões e nota de uso ao final.

**Confiança: 10/10** — preferência registrada na memória.
