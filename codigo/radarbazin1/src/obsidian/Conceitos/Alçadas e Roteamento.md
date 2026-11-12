---
tags: [projeto/clausulas, conceito, alcadas, governanca, nucleo]
aliases: [Alçadas, Roteamento, Régua de Alçada, Quem Decide]
---

# Alçadas e Roteamento

> [!tip] Em resumo
> A alçada é definida por **grau da marca, nº de praças, portfólio e desconto** — não mais por tetos de % e fatores.

## A régua (na ordem)
1. Marca **[[Marca Estratégica|grau A (âncora) ou B (alavancadora de posicionamento)]]** → **Diretoria de Operações**.
2. Senão, **desconto > 50%** → **Diretoria de Operações**.
3. Senão, marca **1 praça (local)** → **Superintendente** (até 50%).
4. Senão, **2 a 4 praças, todas no portfólio** do Diretor → **Diretor de Portfólio** (até 50%).
5. Senão (**> 4 praças** OU **loja fora do portfólio**) → **Diretoria de Operações**.

```
grau A/B? ─sim→ Diretoria de Operações
   └no→ desconto>50%? ─sim→ Diretoria de Operações
          └no→ 1 praça? ─sim→ Superintendente
                 └no→ 2–4 praças e todas no portfólio? ─sim→ Diretor de Portfólio
                        └no→ Diretoria de Operações
```

## Os três níveis
| Alçada | Quando |
|---|---|
| **Superintendente** | Marca Padrão, **1 praça** (local), até 50% |
| **Diretor de Portfólio** | Marca Padrão, **2–4 praças, todas no portfólio**, até 50% (a trava) |
| **Diretoria de Operações** | Marca **A/B** · **>4 praças** · **loja fora do portfólio** · **desconto >50%** · limite duro |

## A trava do Diretor de Portfólio
O Diretor só decide marcas **100% dentro do seu portfólio** e com **até 4 praças** ([[Parâmetros Calibráveis|`max_pracas_diretor`]]). Uma loja fora, ou a 5ª praça, leva o caso à Diretoria de Operações. Ver [[Pegada de Rede]].

> [!note] Nomenclatura
> Superintendente (antes "Analista") · Diretor de Portfólio (antes "Comercial") · Diretoria de Operações.

Parâmetros em [[Parâmetros Calibráveis]] (desconto 50%, máx. 4 praças). O **status do guia** (🟢🟡🔴) passou a ser informativo (veredito), não define a alçada.

---
Voltar ao [[00 - MOC - Projeto Cláusulas|índice]].
