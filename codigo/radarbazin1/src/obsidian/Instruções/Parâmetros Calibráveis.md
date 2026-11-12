---
tags: [projeto/clausulas, instrucao, parametros]
aliases: [Parâmetros, Números, Calibração]
---

# Parâmetros Calibráveis

> [!warning]
> Valores ILUSTRATIVOS — calibrar com Comercial, Jurídico e Diretoria. Ficam em `config/parametros.json`.

## Régua de alçada (ver [[Alçadas e Roteamento]])
| Parâmetro | Valor | Efeito |
|---|---|---|
| `desconto_max_pct` | **50** | desconto máximo que Superintendente e Diretor aprovam; acima → Diretoria |
| `max_pracas_diretor` | **4** | máximo de praças que o Diretor de Portfólio pode decidir |
| `graus_somente_diretoria` | **[A, B]** | graus que vão sempre à Diretoria de Operações |

## Graus da marca (parametrizáveis)
Rótulo, critério (definição) e **"só Diretoria"** por grau são editáveis (aba Parametrização):
| Código | Rótulo | Critério | Só Diretoria? |
|---|---|---|---|
| A | Âncora | Puxa fluxo / sustenta o corredor | ✅ |
| B | Alavancadora de posicionamento | Eleva o mix e o posicionamento | ✅ |
| Padrao | Padrão | Demais marcas | — |

> Na avaliação, o grau **vem do cadastro da marca** (não é escolhido caso a caso).

## Custo (informativo)
- `fator_peso_rs` (custo estimado por peso Tipo B): 1→0,5% · 3→1,5% · 9→4,5%
- `default_por_risco_pct`: Baixo 1% · Médio 3% · Alto/Crítico 6%
- Cláusulas quantitativas: custo por loja (fórmula) e **total = por loja × nº de praças**. Ver [[Custo da Concessão]].

## Dados de apoio (não em parametros.json)
- **Grau** de cada marca (dono: Operações central).
- **Portfólio de cada Diretor** — quais praças compõem cada portfólio.
- **Status por segmento** (`config/recomendacoes.json`) — informativo.

---
Voltar ao [[00 - MOC - Projeto Cláusulas|índice]].
