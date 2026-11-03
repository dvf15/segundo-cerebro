---
title: "Resumo formatado para Obsidian"
date: 2026-05-21
updated: 2026-05-21
source: "claude-chat"
source_id: "b3e0fbbd-1d4a-4fe1-93ab-670a09922a3c"
url: "https://claude.ai/chat/b3e0fbbd-1d4a-4fe1-93ab-670a09922a3c"
project: null
messages: 2
tags: ["claude", "conversa"]
---
# Resumo formatado para Obsidian

> **Resumo:** **Conversation overview**

The person requested a detailed summary of a business case study — Stanford GSB case SM-321 on Scoot, Singapore Airlines' low-cost carrier strategy — formatted specifically for use within Obsidian, a personal knowledge management tool. The goal was to produce a structured, interconnected document ready to be dropped into an existing Obsidian vault.

Claude produced a comprehensive Obsidian-formatted markdown file covering the full case: the 2011 strategic decision to launch Scoot, the competitive pressures from Gulf carriers and Asian LCCs, Scoot's organizational design (including its distinct "Scootitude" culture), its operational model, route strategy, relationship with the SIA parent group, financial performance from 2014–2019, and forward-looking strategic questions. The summary preserved exact quotes from executives (Goh Choon Phong, Campbell Wilson, Ng Chin Hwee), specific financial figures, and route launch dates from the source document.

The formatting followed Obsidian conventions throughout: YAML frontmatter with `tipo`, `área`, `status`, `criado`, `tags`, and `aliases` fields; wikilinks on key concepts (e.g., `[[Scootitude]]`, `[[Canibalização]]`, `[[Low-Cost Carrier]]`); varied callout blocks (`[!info]`, `[!quote]`, `[!warning]`, `[!important]`, `[!example]`, `[!tip]`); a Dataview query block for automatic backlink discovery; checkbox action items compatible with Tasks or Dataview plugins; and hierarchical sections separated by horizontal rules. A "Nota de Uso" section explained how each formatting element functions within Obsidian, and a confidence assessment (9/10) was included noting where interpretation versus direct sourcing was used.

**Tool knowledge**

Claude used file system tools to create the output. The file was written directly to `/mnt/user-data/outputs/` using a `create_file` operation, followed by a `present_files` call to surface it. The full Obsidian markdown — including YAML frontmatter with special characters and multiline callout blocks — was passed as a single `file_text` parameter without requiring escaping or chunking. For future sessions, this pattern (single-pass file creation to the outputs directory, then present) worked reliably for long, formatting-heavy markdown documents destined for Obsidian import.

**Mensagens:** 2 · **Criada:** 2026-05-21 · **Atualizada:** 2026-05-21

---

## 👤 Usuário · 2026-05-21 22:06

Faça um resumo detalhado desse material, formatado para ser usado e conectado dentro do obsidian

- 📎 8-25-202211-20Scoot - Singapore Airlines' Low-Cost Carrier Strategy_SM321.pdf

## 🤖 Claude · 2026-05-21 22:08

 
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Resumo pronto no formato Obsidian. Estrutura aplicada conforme seu padrão:

- **YAML frontmatter** com `tipo`, `área`, `status`, `criado`, `tags`, `aliases`
- **Wikilinks** nos conceitos-chave (Scootitude, Canibalização, Singapore Airlines, etc.)
- **Callouts** variados (`>[!info]`, `>[!quote]`, `>[!warning]`, `>[!important]`, `>[!example]`, `>[!tip]`)
- **Checkboxes** em "Ações para Aplicar"
- **Bloco Dataview** para conexões automáticas no final
- Seções hierárquicas separadas por `---`
- **Nota de uso** explicando wikilinks/Dataview/templates
- **Avaliação de confiança** ao final

**Confiança: 9/10** — todos os dados, citações e números vêm diretamente do caso Stanford GSB SM-321 que você forneceu. O ponto que tira o 10 é que as seções "Lições-chave" e "Ações para Aplicar" contêm interpretação minha (não estão literais no caso) e que o próprio caso foi revisado pela SIA antes da publicação, então tem viés positivo embutido sobre o sucesso de Scoot.
