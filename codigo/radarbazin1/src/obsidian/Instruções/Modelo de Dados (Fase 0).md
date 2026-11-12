---
tags: [projeto/clausulas, instrucao, dados, fase0]
aliases: [Modelo de Dados, Fase 0]
---

# Modelo de Dados (Fase 0)

> [!info]
> Estrutura de dados que sustenta a régua de [[Alçadas e Roteamento|alçada]]. Ver [[Roadmap e Próximos Passos|Fase 0]].

## Entidades principais
- **Ramo / Segmento** — taxonomia (9 ramos, ~34 segmentos).
- **Tema / TipoClausula** — 7 temas, ~32 tipos. Campos: `classe` (A/AB/B/Limite), `peso`/`formula`, `risco`, `status_default`. Ver [[Decomposição das 32 Cláusulas]].
- **Recomendacao** — status (🟢🟡🔴) por (segmento × tipo) — informativo.
- **Marca** — `nome`, `segmento`, `grau_estrategico` (A/B/Padrao), `num_pracas`, `dentro_portfolio` (relativo ao Diretor que decide). Ver [[Marca Estratégica]] e [[Pegada de Rede]].
- **Portfolio** — praças que compõem o portfólio de cada Diretor de Portfólio.
- **Contrato** — dados para as fórmulas de custo (aluguel mensal, taxa/multa em aluguéis, % reajuste, meses).
- **Parametro** — [[Parâmetros Calibráveis]] (`desconto_max_pct`=50, `max_pracas_diretor`=4).
- **DecisaoLog** — registro de cada decisão (marca, grau, praças, portfólio, desconto, custo, alçada, decisão, justificativa).

## Motor (Fase 1)
`decidir(tipo, segmento, marca, contrato) ->`
1. status = Recomendacao (informativo).
2. classe "Limite" → inegociável / Diretoria.
3. desconto% = derivado (taxa/multa/reajuste) ou informado.
4. **alçada** = régua: grau A/B → Diretoria; desconto>50% → Diretoria; 1 praça → Superintendente; 2–4 no portfólio → Diretor de Portfólio; senão → Diretoria.
5. custo_por_loja e custo_total = por loja × num_pracas (informativo).
6. se Diretoria → montar [[Business Case Automático]].

## Saída da Fase 0
API de consulta (segmento, tipo) → status + texto-padrão + ressalvas; e a régua de alçada parametrizável.

---
Voltar ao [[00 - MOC - Projeto Cláusulas|índice]].
