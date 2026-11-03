---
title: "Mover projeto para Claude Cowork"
date: 2026-05-31
updated: 2026-05-31
source: "claude-chat"
source_id: "e0838011-665e-4e24-a535-dbe8f7e9e25b"
url: "https://claude.ai/chat/e0838011-665e-4e24-a535-dbe8f7e9e25b"
project: null
messages: 2
tags: ["claude", "conversa"]
---
# Mover projeto para Claude Cowork

> **Resumo:** **Conversation Overview** The person asked in Portuguese how to move a project to Claude Cowork. Claude explained that Cowork has a built-in import function for projects from Claude.ai, accessible via the Claude Desktop app (latest version required, paid plans only). Claude detailed the import process step-by-step and clarified what transfers during import (project name, custom instructions, memory settings) versus what does not (conversation history, uploaded files), noting the import is one-way with no cloud sync. Claude also flagged a specific technical consideration relevant to the person's project: it contains a `RadarBazin.jsx` artifact that relies on `window.storage`, a runtime behavior specific to Claude's artifact environment in Chat. Claude noted this persistence mechanism may not function the same way if treated as a local file in Cowork, and suggested keeping the radar as an artifact in Chat while using Cowork for execution tasks like generating reports or organizing data. Claude was transparent about source confidence, distinguishing between official Anthropic documentation (requirements, existence of import feature) and a third-party guide (specific transfer details), rating overall confidence at 7/10 and recommending the person verify import specifics directly in the app.

**Mensagens:** 2 · **Criada:** 2026-05-31 · **Atualizada:** 2026-05-31

---

## 👤 Usuário · 2026-05-31 15:17

como consigo mover esse projeto para o claude cowork?

## 🤖 Claude · 2026-05-31 15:18

 I need to search the documentation for information about Claude Cowork and how to move projects there, since this is a product-specific question. The user is asking in Portuguese, so I'll respond in that language.
```
This block is not supported on your current device yet.
```

 I'm realizing the user is asking how to move a Project from Claude.ai to Claude Cowork, but these are fundamentally different systems—Projects are web-based workspaces with custom instructions and files, while Cowork is a desktop app that works with local folders. There's no direct migration path between them.

Given the user's preference for honesty and sources, I should search the support documentation to see if there's an official way to do this, and be upfront about what I find or don't find.
```
This block is not supported on your current device yet.
```

 I'm finding that Cowork has its own Projects feature with an import option from Claude projects, though it only transfers the project name, custom instructions, and memory settings—conversation history and uploaded files stay behind in Chat.

The import is one-way and requires the latest Claude Desktop version plus a paid plan (Pro, Max, Team, or Enterprise). I should note that the specifics about what transfers come partly from third-party sources rather than official Anthropic documentation, so I'll flag that uncertainty. The RadarBazin.jsx artifact and skills are files that won't automatically migrate, so the user would need to manually re-upload or recreate them in Cowork.Dá pra mover, sim — o Cowork ganhou uma função de **projetos próprios** com importação direta dos seus projetos do Claude (claude.ai). Mas vale entender o que realmente "vai junto" antes, porque não é uma cópia idêntica.

**Como fazer**

1. Atualize o app **Claude Desktop** para a versão mais recente (Mac ou Windows) — o recurso de projetos no Cowork exige a versão atual.
2. Entre no modo **Cowork** (aba ao lado de Chat).
3. Na lista de projetos do Cowork, escolha **"Import from a Claude project"** (Importar de um projeto do Claude) e selecione este projeto.

**O que transfere e o que não transfere**

Pelo material que encontrei, a importação leva o **nome do projeto, as instruções personalizadas e as configurações de memória**. Não transferem automaticamente o **histórico de conversas** (fica no Chat) nem os **arquivos** — você precisa re-selecionar/re-apontar a pasta de trabalho local. E a importação é **só de ida** (one-way): não sincroniza de volta. Projetos no Cowork são locais no desktop, sem sincronização em nuvem no momento.

Isso importa bastante no seu caso: o `RadarBazin.jsx` e as skills (mandamentos, hunters, etc.) são **arquivos/contexto**. Eles não "saltam" sozinos para o Cowork. O caminho prático é salvar esses arquivos numa pasta local no seu computador e dar acesso a essa pasta ao Cowork — aí ele lê e edita de verdade (diferente do Chat, que só conversa).

**Requisitos**

O Cowork está disponível como research preview para planos pagos (Pro, Max, Team, Enterprise), rodando no app de desktop. Não há tier gratuito ainda.

Uma observação honesta sobre o conteúdo do seu projeto: o `RadarBazin.jsx` é um artifact React que usa `window.storage`, que funciona no ambiente de artifacts do Chat. Ao migrar pro Cowork, o Cowork trata isso como um arquivo de código numa pasta — o comportamento de persistência via `window.storage` é específico do runtime de artifacts e pode não funcionar igual fora dele. Se a ideia é continuar usando o radar como app interativo, talvez faça mais sentido mantê-lo como artifact no Chat e usar o Cowork para as tarefas de execução (gerar relatórios, organizar dados das skills, etc.).

---

**Fontes:** Central de Ajuda do Claude — "Use Claude Cowork on Team and Enterprise plans" (support.claude.com) e "Organize your tasks with projects in Claude Cowork" (support.claude.com). O detalhamento específico de "o que importa / o que não importa" veio de um guia de terceiros (claudelab.net), não da documentação oficial — então trate esse ponto como provável, mas confirme na própria tela de importação.

**Confiança: 7/10.** Tenho confiança alta de que a importação existe e nos requisitos (fonte oficial). Tenho confiança média no detalhamento exato do que transfere, porque a parte mais específica vem de fonte secundária e o roadmap do Cowork muda rápido — vale validar direto no app.
