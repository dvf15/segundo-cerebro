---
title: "Como exportar sessões do Claude Code"
date: 2026-10-30
source: nota
tags: [claude, claude-code, procedimento]
---
# Como exportar sessões do Claude Code para este vault

## Sessão na nuvem (claude.ai/code), ainda aberta
Mande esta frase dentro da sessão:

> Leia a transcrição desta sessão em `/root/.claude/projects/` (arquivo `.jsonl`), copie-a para `_raw/sessoes-code/` do repositório `dvf15/segundo-cerebro`, rode `node scripts/converter-sessao.mjs` e `node scripts/gerar-indices.mjs`, e faça commit e push.

Se a sessão não tiver o repositório `segundo-cerebro` anexado, peça para ela te enviar o `.jsonl` como arquivo e faça o passo local abaixo.

## Sessão na nuvem, pelo terminal (teleport)
```bash
claude --teleport <session-id>
```
Isso grava a conversa em `~/.claude/projects/<pasta-do-repo>/<id>.jsonl`. Ressalva da documentação oficial: se a sessão foi compactada, as mensagens antigas resumidas não vêm no teleport. O arquivo dentro do container (método acima) é mais completo.

## Sessão local (terminal, Desktop, IDE)
Os `.jsonl` já estão em `~/.claude/projects/`. Converta direto:
```bash
node scripts/converter-sessao.mjs ~/.claude/projects/-Users-voce-projeto/*.jsonl
node scripts/gerar-indices.mjs
```
O conversor copia o `.jsonl` para `_raw/sessoes-code/` antes de gerar a nota.

## Automatizar
Adicione ao `CLAUDE.md` de cada repositório seu:

> Ao encerrar um trabalho relevante, se o repositório `dvf15/segundo-cerebro` estiver acessível, exporte a transcrição desta sessão para ele conforme `claude/sessoes-code/COMO-EXPORTAR.md`.

## Retenção
Contas Pro/Max que não permitem treino: a Anthropic retém sessões do Claude Code por 30 dias. A cópia local em `~/.claude/projects/` também é limpa em 30 dias por padrão (`cleanupPeriodDays`). Exporte antes.
