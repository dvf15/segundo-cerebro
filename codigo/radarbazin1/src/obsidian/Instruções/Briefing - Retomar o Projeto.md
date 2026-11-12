---
tags: [projeto/clausulas, instrucao, briefing, prompt]
aliases: [Briefing, Kickoff, Prompt de Retomada]
---

# Briefing — Retomar o Projeto

> [!tip]
> Cole o prompt abaixo num agente de IA (ex.: Claude Code) com este vault anexado para retomar o projeto.

## Prompt pronto (copiar)
```
Contexto: Projeto "Copiloto de Decisão de Cláusulas" da ALLOS (shopping centers).
Objetivo: apoiar a aprovação/recusa de cláusulas por marca e segmento. Modo: APOIO À DECISÃO (humano decide).

Régua de alçada (definida — ver vault Obsidian):
- Marca grau A (âncora) ou B (alavancadora de posicionamento) -> Diretoria de Operações (sempre).
- Senão desconto > 50% -> Diretoria de Operações.
- Senão marca Padrão, 1 praça (local) -> Superintendente (até 50%).
- Senão 2 a 4 praças, TODAS dentro do portfólio do Diretor -> Diretor de Portfólio (até 50%).
- Senão (>4 praças ou loja fora do portfólio) -> Diretoria de Operações.
- Compliance (LGPD/anticorrupção/PEP/confidencialidade) = limite duro, inegociável.

Parâmetros: desconto_max_pct=50, max_pracas_diretor=4.
Custo: por loja (fórmula sobre o contrato) e total = por loja × nº de praças (informativo).
Alçadas: Superintendente -> Diretor de Portfólio -> Diretoria de Operações.

Tarefa: [descreva aqui — ex.: "prototipar o motor", "atualizar o console/apresentação", etc.]
Padrões: paleta ALLOS (skill pptallos) e skills de geração de artefatos do vault.
```

## O que está pronto neste vault
- Régua: [[Alçadas e Roteamento]] · [[Marca Estratégica]] · [[Pegada de Rede]].
- Custo: [[Custo da Concessão]] · Parâmetros: [[Parâmetros Calibráveis]].
- Decisões pendentes: [[Decisões a Tomar]] · Roadmap: [[Roadmap e Próximos Passos]].
- Dados: [[Modelo de Dados (Fase 0)]] · Geração de arquivos: [[Skill - Geração de Artefatos (pptx, xlsx, pdf)]] + [[Skill - Paleta ALLOS (pptallos)]].

---
Voltar ao [[00 - MOC - Projeto Cláusulas|índice]].
