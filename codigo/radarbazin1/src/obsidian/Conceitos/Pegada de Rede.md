---
tags: [projeto/clausulas, conceito, alcadas, rede, portfolio]
aliases: [Pegada de Rede, Praças e Portfólio, Efeito Precedente]
---

# Praças e Portfólio

> [!tip] Em resumo
> Para marca **Padrão**, a alçada depende de **em quantas praças** a marca opera e se estão **dentro do portfólio** do Diretor.

## A regra (marca Padrão)
| Pegada | Condição | Alçada |
|---|---|---|
| ⚪ **1 praça (local)** | decisão fica local | **Superintendente** (até 50%) |
| 🟡 **2 a 4 praças** | **todas dentro do portfólio** do Diretor | **Diretor de Portfólio** (até 50%) |
| 🔴 **> 4 praças** OU **loja fora do portfólio** | precedente de rede / fora do alcance | **Diretoria de Operações** |

## A trava (o ponto central)
O Diretor de Portfólio tem alçada **apenas** quando:
- a marca tem **≤ 4 praças** (parâmetro [[Parâmetros Calibráveis|`max_pracas_diretor`]]) **E**
- **todas as lojas** estão **dentro do seu portfólio**.

Basta **uma loja fora** do portfólio, ou a **5ª praça**, para o caso subir à **Diretoria de Operações**. É o que impede que uma concessão a marca de rede vire precedente sistêmico decidido localmente.

> [!info] Mudança de lógica
> Antes a pegada multiplicava o custo por um fator (FR ×1,8 / ×3,0). Agora ela **determina diretamente a alçada** (local / portfólio / rede). O tamanho da concessão aparece no [[Custo da Concessão|custo total = por loja × nº de praças]].

## Dados necessários
- Nº de praças por marca e a composição do **portfólio de cada Diretor** (quais praças). Ver [[Decisões a Tomar]] e [[Modelo de Dados (Fase 0)]].

---
Voltar ao [[00 - MOC - Projeto Cláusulas|índice]].
