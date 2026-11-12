---
title: "Tracking Fase 0 - Próximos 30 dias"
date: 2026-05-17
type: tracking
status: ativo
fase: 0
tags:
  - tracking
  - tasks-plugin
  - naval
  - fase-0
  - building-skills
  - daily-weekly
related:
  - "[[2026-05-17 - Sessão Naval - Mestre Consolidado]]"
  - "[[2026-05-17 - Naval Framework v3 - PI Interna Allos]]"
  - "[[Roadmap 90 dias - Building Skills]]"
plugin: obsidian-tasks
sintaxe-verificada: 2026-05-17
---

# Tracking Fase 0 — Próximos 30 dias

> [!success] Como usar este arquivo
> 1. Instalar plugin **Tasks** (instruções na seção final)
> 2. Marcar tasks com `Ctrl/Cmd + Enter` (não com clique padrão — Tasks rastreia data de conclusão)
> 3. Os blocos ```tasks renderizam automaticamente views dinâmicas (hoje, atrasadas, semana, etc.)
> 4. Recortar/duplicar tasks para daily notes conforme preferência

---

## 1. Visão dinâmica — gerada pelo plugin Tasks

### Tasks de hoje e atrasadas

```tasks
not done
(due before tomorrow) OR (scheduled before tomorrow)
sort by priority
sort by due
group by due
short mode
```

### Tasks desta semana

```tasks
not done
due after yesterday
due before in 8 days
sort by due
sort by priority
group by due
```

### Tasks concluídas nos últimos 7 dias

```tasks
done after 7 days ago
sort by done reverse
group by done
```

### Todas as tasks Fase 0 pendentes

```tasks
not done
path includes Tracking Fase 0
sort by due
group by priority
```

---

## 2. Hábito diário — Roadmap 90 dias

> [!note] Tarefa recorrente — 1h/dia, segunda a sexta
> Esta é a tarefa-âncora da Fase 0. Não negociar.

- [ ] ⏫ Estudo Roadmap 90 dias - 1h 🔁 every weekday 📅 2026-05-18

---

## 3. Próximos 30 dias — operacional

### Semana 1 (18-22 maio)

- [ ] ⏫ Bloquear horário fixo diário 1h no calendário 📅 2026-05-18 #fase-0/setup
- [ ] ⏫ Abrir conta Claude (Pro/Max) + ChatGPT + Lovable 📅 2026-05-18 #fase-0/setup
- [ ] ⏫ Iniciar fundamentos conceituais (frontend, backend, API, banco, deploy, auth) 🛫 2026-05-18 📅 2026-05-22 #fase-0/building-skills
- [ ] 🔼 Rascunhar v0 da tese de 1 página (1 parágrafo basta) 📅 2026-05-22 #fase-0/tese
- [ ] Listar 5 casos públicos internacionais para ler (Brookfield, Simon, Unibail, etc.) 📅 2026-05-22 #fase-0/research

### Semana 2 (25-29 maio)

- [ ] ⏫ Concluir fundamentos conceituais (semanas 1-2 do roadmap) 📅 2026-05-29 #fase-0/building-skills
- [ ] 🔼 Ler 2 casos públicos internacionais 📅 2026-05-29 #fase-0/research
- [ ] 🔼 Identificar 2-3 advogados trabalhistas/societários candidatos 📅 2026-05-29 #fase-0/preparacao-fase-1
- [ ] Definir identidade pública (LinkedIn como Diretor Allos ou conta separada?) 📅 2026-05-29 #fase-0/media

### Semana 3 (1-5 junho)

- [ ] ⏫ Criar primeiro [[Claude Projects]] com caso hipotético 📅 2026-06-05 #fase-0/building-skills
- [ ] ⏫ Refinar tese de 1 página até caber em 1 parágrafo afiado 📅 2026-06-05 #fase-0/tese
- [ ] 🔼 Conversa exploratória não-comprometedora com 1-2 peers do setor 📅 2026-06-05 #fase-0/research
- [ ] Ler mais 2 casos públicos internacionais 📅 2026-06-05 #fase-0/research

### Semana 4 (8-12 junho)

- [ ] ⏫ 3 Claude Projects rodando 📅 2026-06-12 #fase-0/building-skills
- [ ] ⏫ Primeira lista de 5-10 use cases mentais para o portfólio 📅 2026-06-12 #fase-0/tese
- [ ] 🔼 Avaliar: meta de "Project economiza 5h/semana" atingida? Se não, ajustar 📅 2026-06-12 #fase-0/checkpoint
- [ ] Mapear histórico de iniciativas de inovação Allos (mental) 📅 2026-06-12 #fase-0/preparacao-fase-1

---

## 4. Restrições ativas — não esquecer

> [!danger] O que NÃO fazer durante Fase 0
> Não risque essas — elas ficam permanentemente como lembretes. Se uma delas for violada, o plano colapsa em zona de conflito.

- [ ] ❌ Não usar dados Allos reais 🔁 every day 📅 2026-05-18 #fase-0/restricao
- [ ] ❌ Não captar nenhum cliente do setor de shopping 🔁 every day 📅 2026-05-18 #fase-0/restricao
- [ ] ❌ Não documentar nada em sistemas Allos 🔁 every day 📅 2026-05-18 #fase-0/restricao
- [ ] ❌ Não falar com COO/jurídico ainda — aguardar Fase 0 madura 🔁 every day 📅 2026-05-18 #fase-0/restricao

> [!tip] Configuração sugerida
> Essas restrições podem ser deslocadas para uma seção própria que **não** entra nas queries de "tasks pendentes" — ou criar uma tag específica (#fase-0/restricao) e excluir das queries acima via `tags do not include #fase-0/restricao`. Sugestão é manter visíveis como lembrete passivo.

---

## 5. Daily note — template sugerido

> [!note] Workflow recomendado
> Configurar **Daily Notes plugin** (core do Obsidian) + template abaixo. Cada dia, a query puxa automaticamente as tasks atribuídas à data.

```markdown
# {{date:YYYY-MM-DD dddd}}

## Tasks de hoje (auto-puxadas)
​```tasks
not done
(due on {{date:YYYY-MM-DD}}) OR (scheduled on {{date:YYYY-MM-DD}})
sort by priority
​```

## Hábito Fase 0
- [ ] 1h de Roadmap 90 dias completada hoje? 

## Notas livres
- 

## Bloqueios e ajustes
- 
```

---

## 6. Weekly note — template sugerido

```markdown
# Semana de {{date:YYYY-MM-DD}}

## Revisão de tasks da semana
​```tasks
done after {{date-7d:YYYY-MM-DD}}
done before {{date:YYYY-MM-DD}}
group by done
​```

## Pendentes que migraram
​```tasks
not done
due before {{date:YYYY-MM-DD}}
​```

## Próxima semana — foco
- 
- 
- 

## Checkpoint Fase 0
- [ ] Roadmap 90 dias avançou? Qual semana?
- [ ] Tese de 1 página teve iteração?
- [ ] Algum novo use case mental anotado?
```

---

## 7. Plugin Tasks — guia de instalação

### Passos (verificado em 2026-05-17)

1. **Settings → Community plugins → Browse**
2. Buscar **"Tasks"** (do grupo `obsidian-tasks-group`)
3. Install → Enable
4. **Settings → Hotkeys → buscar "Tasks: Toggle task done"**
5. Atribuir `Ctrl+Enter` (Windows/Linux) ou `Cmd+Enter` (macOS)
6. **Remover** o hotkey nativo "Toggle checkbox status" para evitar conflito
7. (Opcional) Settings → Tasks → **Global filter** → definir uma tag como `#task` se quiser separar tasks do Tasks plugin de outras checkboxes — para esta nota recomendo **não** definir filtro global

### Por que `Ctrl/Cmd + Enter` em vez de clicar
- Clicar na checkbox marca como done **sem rastrear data de conclusão**
- O atalho do Tasks adiciona `✅ YYYY-MM-DD` automaticamente — necessário para queries do tipo "done in last 7 days"

---

## 8. Sintaxe Tasks — referência rápida

### Datas
| Emoji | Significado | Uso |
|---|---|---|
| 📅 | **Due date** — deadline duro | `📅 2026-05-22` |
| ⏳ | **Scheduled** — quando planejo trabalhar | `⏳ 2026-05-20` |
| 🛫 | **Start** — só pode começar a partir de | `🛫 2026-06-01` |
| ✅ | **Done date** — preenchido automaticamente | `✅ 2026-05-18` |

### Prioridades
| Emoji | Nível |
|---|---|
| 🔺 | Highest |
| ⏫ | High |
| 🔼 | Medium |
| 🔽 | Low |
| ⏬ | Lowest |

### Recorrência
- `🔁 every day` — todo dia (strict — gera próxima na data certa, não importa quando foi feita)
- `🔁 every weekday` — seg a sex
- `🔁 every week` — semanalmente
- `🔁 every friday` — toda sexta
- `🔁 every 2 weeks when done` — 2 semanas após **conclusão** (flexible)
- `🔁 every month on the 1st` — primeiro dia do mês

> [!tip] `every X` vs `every X when done`
> - `every X` = regenera na data certa, mesmo se você completou atrasado
> - `every X when done` = regenera contando a partir da data em que você marcou done
>
> Para hábitos rígidos use `every X`. Para "fazer a cada N dias" use `every X when done`.

### Sintaxe completa de uma task
```
- [ ] ⏫ Texto da task 🛫 2026-05-18 ⏳ 2026-05-20 📅 2026-05-22 🔁 every week #tag
```
(prioridade · texto · start · scheduled · due · recorrência · tag)

---

## 9. Query blocks — receitas úteis

### Todas as tasks atrasadas
```tasks
not done
due before today
sort by due
```

### Tasks de alta prioridade pendentes
```tasks
not done
priority is above medium
sort by due
```

### Tasks de um tag específico
```tasks
not done
tags include #fase-0/building-skills
sort by due
```

### Tasks concluídas hoje
```tasks
done on today
```

### Visão Kanban-like por status temporal
```tasks
not done
group by happens
sort by priority
```
(`happens` é o "primeiro entre" start, scheduled e due)

### Limitar quantidade (importante para vaults grandes)
```tasks
not done
limit 50
```

---

## 10. Sugestões de evolução

### Curto prazo (já dá pra fazer)
- [ ] Criar pasta `tracking/` no vault e mover este arquivo para lá
- [ ] Configurar [[Daily Notes]] core plugin com template da seção 5
- [ ] Criar nota `00 - Dashboard Fase 0` com query blocks consolidados

### Médio prazo (quando dominar Tasks)
- [ ] Adicionar **Dataview** para queries mais complexas (tasks + metadata de notas)
- [ ] Adicionar **Kanban** plugin para visualização em colunas
- [ ] Avaliar **TaskForge** (mobile) se precisar de execução fora do desktop

### Longe — Fase 1+
- [ ] Migrar tracking para sistema mais robusto se a operação crescer
- [ ] Considerar Notion/Asana só **depois** da Fase 1 aprovada, nunca antes

---

## 11. Calibração desta nota

> [!info] Confiança: 8/10
> - Sintaxe Tasks: 9/10 (verificada via web_search em 2026-05-17 — sources: github.com/obsidian-tasks-group, publish.obsidian.md/tasks, blog recapio/taskforge)
> - Datas operacionais (semanas 1-4): 9/10 (calendário verificado, 17/05/2026 é domingo, semana 1 começa segunda 18/05)
> - Adequação aos seus hábitos: 6/10 — proponho um workflow específico; ajuste conforme sua preferência de Daily/Weekly notes
> - Atomicidade das tasks: 7/10 — algumas podem precisar ser quebradas conforme você executa

### Fontes verificadas
- **Sintaxe oficial Tasks plugin:** [GitHub obsidian-tasks-group/obsidian-tasks](https://github.com/obsidian-tasks-group/obsidian-tasks) e [publish.obsidian.md/tasks](https://publish.obsidian.md/tasks/)
- **Emojis de data/prioridade/recorrência:** confirmados em múltiplas fontes (Recapio, TaskForge, docs oficiais), consistentes entre si
- **Diferença `every X` vs `every X when done`:** confirmada nas docs e no blog Recapio (2026)

### Fontes NÃO verificadas
- Compatibilidade exata com versão do Obsidian que você usa: depende da sua versão. Plugin Tasks suporta Obsidian 1.1.1+. **Se quiser eu verifico sua versão antes.**
