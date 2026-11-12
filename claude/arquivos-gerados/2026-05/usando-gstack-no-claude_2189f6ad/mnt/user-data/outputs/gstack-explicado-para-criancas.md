---
tipo: nota
área: tecnologia/ia
status: ativo
criado: 2026-05-24
tags:
  - claude
  - claude-code
  - gstack
  - ia
  - desenvolvimento
  - didático
aliases:
  - gstack para crianças
  - gstack analogia chapéus
  - gstack explicação simples
---

# 🎩 gstack Explicado para Crianças

> [!info] Sobre esta nota
> Explicação didática do [[gstack]] usando a analogia da **caixa de chapéus**. O gstack é uma extensão do [[Claude Code]] criada por [[Garry Tan]] (CEO da [[Y Combinator]]).

---

## 🤖 A Ideia Principal

Imagina que o [[Claude Code]] é um **robô ajudante** que sabe programar. Ele é tipo um estagiário muito esperto: faz o que você pede, mas às vezes faz besteira porque não sabe *qual chapéu* colocar na hora certa.

O [[gstack]] é uma **caixa de chapéus** 🎩 — cada chapéu transforma o robô numa pessoa diferente do time. Você fala "põe esse chapéu!" e ele muda de personalidade.

---

## 🎩 Os Chapéus Principais

### 🧠 Chapéu de CEO — `/office-hours`
**Pergunta que ele faz:** "Espera, isso é realmente o que o usuário precisa?"

> [!example] Exemplo
> Você diz: *"quero um app de listas de tarefas"*.
> Ele responde: *"Mas espera, você quer organizar tarefas ou quer não esquecer das coisas? Talvez um lembrete por voz seja melhor!"*

---

### 🏗️ Chapéu de Arquiteto — `/plan-eng-review`
**Pergunta que ele faz:** "Como vamos construir isso sem cair?"

> [!example] Exemplo
> É como decidir se a casa precisa de 1 ou 3 andares **antes** de começar a construir.

---

### 👀 Chapéu de Revisor — `/review`
**Pergunta que ele faz:** "Tem algum bug escondido aqui?"

> [!example] Exemplo
> É como sua mãe revisando a lição de casa antes de você entregar. Acha os erros bobos.

---

### 🧪 Chapéu de Testador — `/qa`
**Pergunta que ele faz:** "Será que funciona de verdade?"

> [!example] Exemplo
> O robô abre um navegador igualzinho ao seu e clica nos botões pra ver se o site quebra.

---

### 🚀 Chapéu de Entregador — `/ship`
**Pergunta que ele faz:** "Tá pronto pra ir pro mundo?"

> [!example] Exemplo
> É o moço dos Correios que pega seu pacote e manda.

---

## 🎯 Como Funciona na Prática

```text
Você:  "Quero fazer um joguinho de adivinhação"
Robô:  /office-hours      → "Que tipo de adivinhação? Pra quem?"
Robô:  /plan-eng-review   → "Vamos usar Python, com 3 telas"
Robô:  (programa o jogo)
Robô:  /review            → "Achei 2 bugs, corrigi"
Robô:  /qa                → "Testei, funciona!"
Robô:  /ship              → "Pronto, tá no ar!"
```

> [!tip] Por que isso é melhor?
> **Sem o gstack:** o robô tenta fazer tudo de uma vez e mistura as coisas — tipo cozinhar, lavar louça e atender telefone ao mesmo tempo.
> **Com o gstack:** ele faz **uma coisa por vez, com o chapéu certo**. 🎯

---

## ⚠️ Aviso Importante

> [!warning] Onde funciona?
> O [[gstack]] **só funciona no [[Claude Code]]** (programa de terminal pra programadores).
> **NÃO funciona no [[Claude.ai]]** (app web/mobile de conversa).

---

## ✅ Próximos Passos

- [ ] Instalar o [[Claude Code]] se ainda não tiver
- [ ] Conferir os pré-requisitos: [[Git]], [[Bun]] v1.0+, [[Node.js]] (Windows)
- [ ] Clonar o repositório do gstack
- [ ] Adicionar seção `## gstack` no `CLAUDE.md` do projeto
- [ ] Testar com `/office-hours` num projeto pequeno

---

## 🔗 Fontes

- Repositório oficial: https://github.com/garrytan/gstack
- Tutorial passo-a-passo: https://www.ququ123.top/en/2026/04/gstack-setup-guide/
- Documentação técnica: https://deepwiki.com/garrytan/gstack
- Análise: https://www.sitepoint.com/gstack-garry-tan-claude-code/

---

## 🔍 Conexões (Dataview)

```dataview
LIST
FROM [[gstack]] OR [[Claude Code]] OR [[Claude.ai]]
WHERE file.name != this.file.name
SORT file.mtime DESC
```

---

## 📖 Nota de Uso (Obsidian)

> [!note] Como usar esta nota
> - **`[[wikilinks]]`**: clique para navegar entre notas conectadas. Se a nota ainda não existe, será criada ao clicar.
> - **Bloco Dataview**: requer o plugin [Dataview](https://github.com/blacksmithgu/obsidian-dataview) instalado. Ele lista automaticamente notas que mencionam os conceitos relacionados.
> - **Callouts** (`>[!info]`, `>[!example]`, `>[!warning]`, `>[!tip]`): destacam visualmente blocos importantes. Funcionam nativamente no Obsidian.
> - **Templates**: esta nota pode virar um template via [Templater](https://github.com/SilentVoid13/Templater) — só substituir conteúdo por placeholders.
> - **Tags YAML**: usadas para filtragem e busca rápida pelo painel de tags.

---

**Confiança: 9/10.** A analogia dos chapéus é didática (criação minha). Os comandos `/office-hours`, `/plan-eng-review`, `/review`, `/qa` e `/ship` e suas funções vieram da documentação oficial do gstack no GitHub e tutoriais publicados (sitepoint.com, ququ123.top, deepwiki.com). O ecossistema gstack evolui rápido — confira o README atual antes de uso prático.
