---
tags: [projeto/clausulas, MOC]
aliases: [Índice, Mapa do Projeto, Projeto Cláusulas]
status: discussão-conceitual
empresa: ALLOS
atualizado: 2026-07-17
---

# 🗺️ MOC — Copiloto de Decisão de Cláusulas (ALLOS)

> [!abstract] Em uma frase
> Um sistema de **apoio à decisão** que lê uma cláusula, calcula o custo e aplica uma **régua clara de alçadas** (grau da marca, praças, portfólio e desconto) — maximizando rentabilidade e minimizando risco. **A decisão é sempre humana.**

Comece pelo [[Problema Atual]] e siga a numeração.

## 1 · O problema e a proposta
- [[Problema Atual]] — por que falta uma régua de decisão
- [[Solução - Copiloto de Decisão]] — o que é e o que faz

## 2 · A régua de decisão (o racional)
- [[Balança de Decisão]] — a régua, em uma sequência
- [[Alçadas e Roteamento]] — **quem decide o quê** (o coração do modelo)
- [[Marca Estratégica]] — grau A / B (alavancadora de posicionamento) → Diretoria
- [[Pegada de Rede]] — praças + portfólio (a trava do Diretor)
- [[Custo da Concessão]] — custo por loja e total (× praças)
- [[Decomposição das 32 Cláusulas]] — a tabela base por tipo
- [[Business Case Automático]] — o dossiê que sobe à Diretoria

## 3 · Execução
- [[Decisões a Tomar]] — definições pendentes (D1–D9)
- [[Roadmap e Próximos Passos]] — Fases 0–4 e os passos imediatos

## 4 · Skills e Instruções (para construir/retomar)
- [[Briefing - Retomar o Projeto]] — **prompt pronto** para reabrir com IA
- [[Modelo de Dados (Fase 0)]] — como estruturar os dados
- [[Parâmetros Calibráveis]] — 50% de desconto · 4 praças · graus
- [[Skill - Paleta ALLOS (pptallos)]] · [[Skill - Geração de Artefatos (pptx, xlsx, pdf)]]

## 5 · Referências
- [[Glossário]] — termos do projeto
- Sistema construído em `sistema/` (motor, console, instruções do Projeto no Claude)

## Régua de alçada (resumo)
1. Grau **A / B** → Diretoria de Operações
2. Desconto **> 50%** → Diretoria de Operações
3. **1 praça** → Superintendente (até 50%)
4. **2–4 praças, todas no portfólio** → Diretor de Portfólio (até 50%)
5. **> 4 praças ou fora do portfólio** → Diretoria de Operações

## Decisões já tomadas
- ✅ Modo: **apoio à decisão** (humano decide)
- ✅ Alçada por **grau + desconto + praças + portfólio** (não mais por tetos %/fatores)
- ✅ Grau A (âncora) e B (**alavancadora de posicionamento**) → sempre **Diretoria de Operações**
- ✅ Diretor de Portfólio: **até 4 praças, todas no portfólio**; desconto até **50%**
- ✅ Nomes: Superintendente → Diretor de Portfólio → Diretoria de Operações
