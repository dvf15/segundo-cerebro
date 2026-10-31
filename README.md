# Segundo Cérebro

Vault do Obsidian e backup indexado, em Markdown, de tudo que foi feito no Claude: conversas do claude.ai, sessões do Claude Code, artifacts, skills, documentação dos repositórios e reuniões. Pensado para ser lido por humanos hoje e por um modelo próprio (RAG ou fine-tuning) no futuro.

## Estrutura

| Pasta | O que guarda | Como entra |
| --- | --- | --- |
| `00-index/` | Mapas de conteúdo gerados (Início, Conversas, Artifacts, Tags…) | `npm run indices` |
| `claude/conversas/AAAA-MM/` | Uma nota por conversa do claude.ai | export oficial + `npm run converter:export` |
| `claude/projetos/<projeto>/` | Instruções e arquivos de conhecimento de cada Project | idem |
| `claude/sessoes-code/AAAA-MM/` | Uma nota por sessão do Claude Code (local ou nuvem) | `.jsonl` + `npm run converter:sessao` |
| `claude/artifacts/<slug>/` | `index.html` original + nota `.md` com texto extraído | `npm run importar:artifacts` |
| `claude/skills/` | Pastas completas das skills (SKILL.md + referências) | copiadas de uma sessão do Claude Code |
| `codigo/<repo>/` | `_repo.md` + todos os `.md` do repositório | `npm run importar:repos` |
| `reunioes/` | Notas de reunião (Granola) | conector Granola |
| `_raw/` | Fontes brutas e sem perdas: JSON do export, `.jsonl` das sessões, manifestos | você / scripts |

Toda nota tem frontmatter YAML com, no mínimo: `title`, `date`, `source`, `source_id`, `url`, `tags`. É isso que o Dataview usa para indexar hoje e que um pipeline de RAG usa depois. `_raw/` é a fonte da verdade; tudo em `.md` é derivado e pode ser regenerado.

## Rotina

1. **Export do claude.ai (mensal, manual).** No claude.ai: Configurações → Privacidade → Exportar dados. Chega um e-mail com link válido por 24 h (só no navegador ou app desktop). Salve o zip em `_raw/claude-export/AAAA-MM-DD/` e faça commit. A Action converte; ou rode `npm run converter:export` localmente.
2. **Sessões do Claude Code.** Veja `claude/sessoes-code/COMO-EXPORTAR.md`. Resumo: ao fim de cada sessão peça "exporte sua transcrição para o segundo-cerebro"; para sessões antigas, `claude --teleport <id>` e depois `npm run converter:sessao ~/.claude/projects/<pasta>/<id>.jsonl`.
3. **Repositórios.** Liste-os em `codigo/repos.json`. A Action semanal copia os `.md` deles. Para repositórios privados, crie o secret `REPOS_TOKEN` (PAT fine-grained, só leitura de conteúdo).
4. **Índices.** `npm run indices` regenera `00-index/`. A Action faz isso toda segunda-feira e em todo push em `_raw/`.

## Obsidian

Abra esta pasta como vault. Plugins recomendados (já listados em `.obsidian/community-plugins.json`, instale pela interface): **Obsidian Git** (sincroniza com o GitHub sozinho) e **Dataview** (consultas sobre o frontmatter). Exemplo de consulta Dataview:

```dataview
TABLE date, source, project FROM "claude" SORT date DESC LIMIT 50
```

## Limites conhecidos

- O export oficial do claude.ai não inclui as sessões do Claude Code; por isso o fluxo separado via `.jsonl`.
- A Anthropic retém sessões do Claude Code por 30 dias em contas que não permitem treino; exporte antes disso.
- Granola no plano gratuito só expõe os últimos 30 dias via conector.
- Scripts só usam Node 20+ e `git`; `unzip` é opcional (para extrair o export automaticamente).
