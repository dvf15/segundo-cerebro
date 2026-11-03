---
title: "Tarefas agendadas do Claude Code"
date: 2026-11-03
source: "claude-routines"
source_id: "claude_code_cloud"
routines: 3
runs: 81
tags: ["claude", "claude-code", "rotinas"]
---
# Tarefas agendadas do Claude Code (nuvem)

> O export oficial traz apenas as definições e execuções das tarefas agendadas, não as transcrições das sessões.

## Radar Bazin — termômetro 7h

- **ID:** trig_01KV9kRDQtuUTwM5dwRzkesf
- **Ativa:** sim
- **Agenda:** 15 10 * * 1-5
- **Criada:** 2026-09-12
- **Execuções:** 37 (37 com sucesso)

**Prompt:**

```
Republicação matinal do painel Radar Bazin com o Termômetro do dia (rotina que roda dentro desta sessão). Faça, sem perguntar: (1) `git pull origin claude/painel-ativos-bazin-e19aqp` em /home/user/radarbazin; confira em data/termometro.json se `atualizadoEm` é de hoje (UTC). Se NÃO for, dispare o workflow termometro.yml com mcp__github__actions_run_trigger (ref claude/painel-ativos-bazin-e19aqp), espere o commit do bot com um laço em Bash em segundo plano (até 4 min, comparando `git ls-remote`), e faça `git pull` de novo. (2) `node scripts/gerar-painel.mjs`. (3) Publique /home/user/radarbazin/artifact/painel.html com a ferramenta Artifact (mesmo file_path, label "Termômetro AAAA-MM-DD", sem favicon, sem capabilities); em conflito de versão, action read no url https://claude.ai/code/artifact/76782c87-3a60-4d19-b5fc-72728cbfb0a5 e publique de novo. (4) Verifique com action read que "termometro":{"atualizadoEm" no HTML bate com o arquivo; se não, publique de novo uma vez. (5) Responda ao usuário em até 4 linhas: nível do termômetro (score e rótulo), viés do Ibovespa, os dois principais motivos, e qualquer falha. Sem falha, seja breve.
```

| Agendada para | Status | Sessão |
| --- | --- | --- |
| 2026-11-03 10:15 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-11-02 10:18 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-30 10:20 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-29 10:17 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-28 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-27 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-26 10:18 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-23 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-22 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-21 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-20 10:17 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-19 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-16 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-15 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-14 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-13 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-12 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-09 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-08 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-07 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-06 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-05 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-02 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-01 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-30 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-29 10:17 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-28 10:17 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-25 10:17 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-24 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-23 10:15 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-22 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-21 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-18 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-17 10:15 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-16 10:16 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-15 10:15 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-14 10:15 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |

## Radar Bazin — republicar

- **ID:** trig_01Lfdd8NUnNNqCCCVNA63Nox
- **Ativa:** sim
- **Agenda:** 45 21 * * 1-5
- **Criada:** 2026-09-10
- **Execuções:** 38 (38 com sucesso)

**Prompt:**

```
Republicação diária do painel Radar Bazin (rotina que roda dentro desta sessão, que já tem o repositório e o artifact). Faça, sem perguntar: (1) `git pull origin claude/painel-ativos-bazin-e19aqp` em /home/user/radarbazin e `node scripts/gerar-painel.mjs`; anote DATA_REPO = atualizadoEm de data/cotacoes.json. (2) Publique /home/user/radarbazin/artifact/painel.html com a ferramenta Artifact (mesmo file_path de sempre, que redeploya no mesmo URL; label "Atualização automática AAAA-MM-DD"; sem favicon, sem capabilities). Se der conflito de versão, faça action read no url https://claude.ai/code/artifact/76782c87-3a60-4d19-b5fc-72728cbfb0a5 e publique de novo. (3) Verifique: action read no url e confira que "cotacoes":{"atualizadoEm" no HTML devolvido é igual a DATA_REPO; se não for, publique de novo uma vez. (4) Se a coleta do GitHub não tiver rodado hoje (DATA_REPO com data diferente de hoje em dia útil), dispare o workflow atualizar-cotacoes.yml com mcp__github__actions_run_trigger, aguarde ~90 s com Bash em segundo plano, faça git pull, regenere e publique de novo. (5) Responda ao usuário em no máximo 3 linhas: data/hora dos dados publicados, se a verificação bateu, e qualquer falha. Se tudo correu bem, uma linha basta.
```

| Agendada para | Status | Sessão |
| --- | --- | --- |
| 2026-11-02 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-30 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-29 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-28 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-27 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-26 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-23 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-22 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-21 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-20 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-19 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-16 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-15 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-14 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-13 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-12 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-09 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-08 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-07 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-06 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-05 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-02 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-10-01 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-30 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-29 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-28 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-25 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-24 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-23 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-22 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-21 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-18 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-17 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-16 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-15 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-14 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-11 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |
| 2026-09-10 21:45 | succeeded | [cse_013eAZGH…](https://claude.ai/code/cse_013eAZGHpNh3n4V6pbcbMbXU) |

## Radar Bazin — republicar (sessão nova, desativada)

- **ID:** trig_017bbSnWRUt62u5kECFFcwYG
- **Ativa:** não
- **Agenda:** 45 21 * * 1-5
- **Criada:** 2026-09-06
- **Execuções:** 6 (6 com sucesso)

**Prompt:**

```
Você é a rotina de atualização do painel "Radar Bazin". Execute os passos na ordem, de forma autônoma, sem pedir confirmação. Não crie pull request, não edite data/carteira.json, data/fundamentos.json nem src/, não compartilhe o artifact, não altere favicon nem capabilities. Vá anotando, em uma variável mental LOG, uma linha por passo: `passo=N resultado=ok|falha detalhe=...`. Se um passo falhar, tente-o mais uma vez; se falhar de novo, continue para os passos seguintes que ainda fizerem sentido e, obrigatoriamente, execute o passo 7.

PASSO 1 — REPOSITÓRIO. Rode em Bash: `cd /home/user 2>/dev/null || cd ~; git clone --branch claude/painel-ativos-bazin-e19aqp https://github.com/dvf15/radarbazin radarbazin && cd radarbazin && git log --oneline -1`. Se o clone falhar por acesso, chame a ferramenta mcp__Claude_Code_Remote__add_repo com owner "dvf15", repo "radarbazin", access "push", execute o comando de clone que ela devolver e entre no diretório. Registre no LOG o hash do último commit.

PASSO 2 — REGENERAR. No diretório do repositório: `git pull origin claude/painel-ativos-bazin-e19aqp && node scripts/gerar-painel.mjs && grep -o '"atualizadoEm": "[^"]*"' data/cotacoes.json | head -1`. O valor impresso é DATA_REPO. Registre.

PASSO 3 — LER O ARTIFACT. Chame a ferramenta Artifact com action "read" e url https://claude.ai/code/artifact/76782c87-3a60-4d19-b5fc-72728cbfb0a5. É obrigatório antes de publicar a partir de outra conversa. Registre ok/falha.

PASSO 4 — PUBLICAR. Chame a ferramenta Artifact com file_path apontando para `artifact/painel.html` dentro do repositório clonado (caminho absoluto), url https://claude.ai/code/artifact/76782c87-3a60-4d19-b5fc-72728cbfb0a5, label "Atualização automática AAAA-MM-DD" (data de hoje). Não passe favicon nem capabilities. Se for recusado por conflito de versão, repita o passo 3 e publique de novo (uma vez). Registre o resultado, incluindo a mensagem de erro se houver.

PASSO 5 — VERIFICAR. Chame Artifact com action "read" e o mesmo url. A ferramenta salva o HTML num arquivo e informa o caminho; rode `grep -o '"cotacoes":{"atualizadoEm":"[^"]*"' <esse caminho>`. O valor lido é DATA_ARTIFACT. Deve ser igual a DATA_REPO. Se não for, repita o passo 4 uma vez e verifique de novo. Registre.

PASSO 6 — LOG NO REPOSITÓRIO. No repositório, escreva `data/rotina.log` com as linhas do LOG (prefixe cada uma com a hora UTC) e uma linha final `DATA_REPO=... DATA_ARTIFACT=... PUBLICADO=sim|nao`. Depois: `git add data/rotina.log index.html artifact/painel.html && git -c user.name=rotina -c user.email=rotina@radarbazin commit -m "chore: rotina de republicação" && git push origin claude/painel-ativos-bazin-e19aqp`. Se o push for rejeitado: `git pull --rebase origin claude/painel-ativos-bazin-e19aqp && git push origin claude/painel-ativos-bazin-e19aqp`. Registre.

PASSO 7 — REPORTAR (obrigatório, mesmo que tudo tenha falhado). Se a ferramenta SendMessage existir, envie para o destinatário "session_013eAZGHpNh3n4V6pbcbMbXU" (use ListAgents antes se precisar confirmar o nome) uma mensagem começando com "ROTINA RADAR BAZIN" contendo o LOG completo, DATA_REPO, DATA_ARTIFACT e PUBLICADO=sim|nao. Termine sua resposta com esse mesmo texto. Nunca diga que publicou sem ter passado pelo passo 5.
```

| Agendada para | Status | Sessão |
| --- | --- | --- |
| 2026-09-10 00:11 | succeeded | [cse_01QX56PA…](https://claude.ai/code/cse_01QX56PAJtkEgMnqWQw13aJb) |
| 2026-09-09 23:55 | succeeded | [cse_01NF7YVR…](https://claude.ai/code/cse_01NF7YVRV65wJRyx9WyCkw2z) |
| 2026-09-09 21:45 | succeeded | [cse_0138f6w4…](https://claude.ai/code/cse_0138f6w4P6UGBwRK5hccMkKq) |
| 2026-09-08 21:45 | succeeded | [cse_01GBPrXZ…](https://claude.ai/code/cse_01GBPrXZD56PQLEayrXLcPQ3) |
| 2026-09-07 21:45 | succeeded | [cse_01Lz2UBz…](https://claude.ai/code/cse_01Lz2UBzBH2KvPiRjMFFfQ7n) |
| 2026-09-06 21:25 | succeeded | [cse_01RdY8vq…](https://claude.ai/code/cse_01RdY8vqyoYw8xVT9gqNaSus) |
