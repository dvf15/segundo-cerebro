---
title: "💬 Como faço para conectar o obsi…"
date: 2026-05-23
updated: 2026-05-23
source: "claude-chat"
source_id: "8035dce6-a870-4436-80cd-df39caa20516"
url: "https://claude.ai/chat/8035dce6-a870-4436-80cd-df39caa20516"
project: null
messages: 2
generated_files: 0
tags: ["claude", "conversa"]
---
# 💬 Como faço para conectar o obsi…

> **Resumo:** **Conversation Overview** The person asked how to connect Obsidian to Claude Code in order to build a "second brain" system. The conversation was technical in nature, focused on integration setup and knowledge management methodology. No personal details, roles, or colleagues were mentioned. Claude outlined three integration paths: the recommended approach using the community plugin "obsidian-claude-code-mcp" by iansinnott, which exposes the Obsidian vault via WebSocket on port 22360 for automatic discovery by Claude Code; an alternative using the "Local REST API" Obsidian plugin combined with the Python package `mcp-obsidian` for richer search and patch capabilities; and a simpler symlink workaround requiring no MCP setup. Step-by-step instructions were provided for the recommended path, including installing Node.js, the Claude Code CLI via npm, and activating the plugin within Obsidian's community plugins settings. Claude also introduced the PARA method (Projects, Areas, Resources, Archive) from Tiago Forte's *Building a Second Brain* as a vault organizational framework, providing a suggested folder structure (`/00-Inbox`, `/01-Projetos`, `/02-Áreas`, `/03-Recursos`, `/04-Arquivo`, `/05-Templates`). Claude referenced the person's existing Obsidian conventions—YAML frontmatter, wikilinks, and callouts—suggesting these could be leveraged when prompting Claude Code to process or categorize notes. The conversation ended with Claude offering to detail any specific path further or build an initial PARA vault template matching the person's existing formatting standards.

**Mensagens:** 2 · **Criada:** 2026-05-23 · **Atualizada:** 2026-05-23

---

## 👤 Usuário · 2026-05-23 01:06

Como faço para conectar o obsidian ao claude code e criar o second brain

## 🤖 Claude · 2026-05-23 01:07

  The user is asking about connecting Obsidian to Claude Code to build a second brain system. I know Claude Code is Anthropic's CLI tool that supports MCP servers, and Obsidian has community MCP integrations available. Given my user preferences to be honest about confidence levels and provide verified sources, I should search for current setup documentation since this is a practical technical question that requires up-to-date information.
```
This block is not supported on your current device yet.
```

 I'm looking up what Obsidian MCP servers are available and how they can be connected to Claude Code.
```
This block is not supported on your current device yet.
```

 Alright, so there are three main ways to connect Claude with Obsidian. The first is a native Obsidian plugin that spins up an MCP server via WebSocket for automatic discovery. The second uses a Python package that leverages Obsidian's Local REST API plugin. And the third is an npm package that connects directly.

Now I'm thinking about how to structure this response — since Daniel already uses Obsidian with a defined setup (YAML frontmatter, wikilinks, callouts), I should give him a direct recommendation plus the alternative paths, keeping it concise for mobile viewing. I'll cite verified sources and note my confidence level, following his preferences for numbered lists and straightforward explanations.Existem 3 caminhos principais. Vou te dar o recomendado e citar as alternativas.

**Caminho recomendado: plugin "Obsidian Claude Code MCP" (iansinnott)**

É um plugin que roda dentro do Obsidian e expõe seu vault via MCP. O Claude Code descobre o vault automaticamente via WebSocket na porta 22360. Suporta WebSocket (para Claude Code) e HTTP/SSE (para Claude Desktop), com auto-discovery, operações de leitura/escrita de arquivos e suporte a múltiplos vaults simultâneos.

Passos:

1. No Obsidian: Configurações → Plugins da comunidade → Procurar "Claude Code MCP" → Instalar e ativar.
2. Instale o Node.js (necessário para o `npx`).
3. Instale o Claude Code se ainda não tiver: `npm install -g @anthropic-ai/claude-code`.
4. Abra o terminal na pasta do vault (ou em qualquer projeto) e rode `claude`. O Claude Code detecta o servidor automaticamente.
5. Teste com: "Liste os arquivos do meu vault Obsidian."

**Alternativa 1 — mcp-obsidian + Local REST API**

Usa o plugin "Local REST API" do Obsidian + pacote Python `mcp-obsidian`. Oferece recursos mais ricos como busca, patch de conteúdo e acesso a periodic notes. Mais setup, mais poder.

**Alternativa 2 — symlink simples**

Sem MCP. Você cria um link simbólico do vault dentro do projeto: `ln -s ~/Obsidian/MeuVault ./docs` e o Claude Code lê como arquivos normais. Simples, mas sem busca semântica nem APIs do Obsidian.

---

**Sobre o "second brain"**

O conceito (Tiago Forte, livro *Building a Second Brain*, 2022) usa o método **PARA**: Projetos, Áreas, Recursos, Arquivo. Estrutura sugerida no seu vault:

```
/00-Inbox
/01-Projetos
/02-Áreas
/03-Recursos
/04-Arquivo
/05-Templates
```

Com o MCP conectado, você pode pedir ao Claude Code coisas como: "leia minha inbox e categorize em PARA", "crie um índice Dataview de tudo que tem tag #mentoria", ou "transforme esta transcrição em nota no padrão Obsidian que eu uso" (puxando seu frontmatter YAML + wikilinks + callouts que já é seu padrão).

Quer que eu detalhe algum desses caminhos, ou prefere que eu monte um template inicial de vault PARA já no seu padrão Obsidian?

---

**Fontes:**
- Plugin oficial: https://github.com/iansinnott/obsidian-claude-code-mcp
- Docs Claude Code MCP: https://docs.claude.com/en/docs/claude-code/overview
- Guia mcp-obsidian + REST API: artigo Medium de Edward Anil Joseph (mar/2026)
- Livro *Building a Second Brain* — Tiago Forte, Atria Books, 2022

**Confiança: 8/10.** Alta certeza nos passos técnicos do plugin do iansinnott (documentação oficial no GitHub). Menor certeza: não testei pessoalmente o auto-discovery em todos os SOs, e a comunidade de plugins MCP para Obsidian muda rápido — pode haver opções mais novas que não apareceram na busca. Se algum passo falhar na sua máquina, me avise o erro exato.
