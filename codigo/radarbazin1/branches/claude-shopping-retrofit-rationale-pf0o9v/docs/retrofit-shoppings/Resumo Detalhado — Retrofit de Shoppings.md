---
title: "Resumo Detalhado — Retrofit de Shoppings"
aliases: ["Resumo Retrofit", "Resumo Detalhado Retrofit", "Sumário do Material Retrofit"]
tags: [retrofit, shoppings, capex, investimentos, real-estate, board, noi, cap-rate, resumo, breakeven, bbh]
created: 2026-06-26
updated: 2026-07-02
status: ativo
up: "[[Retrofit de Shoppings — MOC]]"
related: ["Racional — Retrofit de Shoppings", "Modelo-Breakeven-Reverso.xlsx", "Racional-Retrofit-Shoppings.pptx"]
---

# Resumo Detalhado — Retrofit de Shoppings

> [!abstract] O que é este material
> Pacote completo para **defender no board o investimento em retrofit** de shoppings (estacionamentos, banheiros e praças de alimentação). Reúne (1) o **racional teórico**, (2) um **deck de 20 slides** e (3) uma **planilha financeira**. Os números abaixo já refletem os **dados reais do ativo (BBH)** com **aceleração concorrencial de 2% a.a.**

> [!info] Premissas do caso (dados reais)
> NOI R$ 84,1 mi · Capex R$ 23,5 mi (Praça 7 + Estac. 7 + Banheiros 9,5) · WACC 12% · Cap rate 8,5% (com) vs 9,0% (sem) · Declínio efetivo **4%** (2% base + **2%** aceleração) · θ 80% · Horizonte 10 anos.

**Navegação:** [[Retrofit de Shoppings — MOC]] · [[Racional — Retrofit de Shoppings]] · Deck `Racional-Retrofit-Shoppings.pptx` · Planilha `Modelo-Breakeven-Reverso.xlsx`

---

## Índice

1. [[#1. A tese em uma página]]
2. [[#2. Os quatro blocos do argumento]]
3. [[#3. Os números (dados reais — BBH)]]
4. [[#4. As duas óticas de viabilidade]]
5. [[#5. Mapa do deck (20 slides)]]
6. [[#6. Mapa da planilha (8 abas)]]
7. [[#7. Fórmulas-chave]]
8. [[#8. Como usar (passo a passo)]]
9. [[#9. Inventário de arquivos]]
10. [[#10. Pendências e premissas]]

---

## 1. A tese em uma página

> [!important] Frase-síntese
> *"Não estamos comprando crescimento. Estamos comprando a **manutenção do valor do ativo** e a **prevenção de um declínio que é certo** — e a urgência **acelera** quando o concorrente se moderniza. Mesmo pela ótica de crescimento, o **breakeven é baixo**."*

- **Retrofit é capex defensivo**, não de expansão. O retorno é o **declínio evitado**, não vendas novas — por isso a régua de "NOI incremental" trava a aprovação. #capex-defensivo
- A **baseline correta** não é "vendas estáveis", é **declínio**. Retorno = **área entre as curvas** (com vs sem retrofit).
- A deterioração física vira queda de NOI por uma **cadeia rastreável**, e o ativo sofre **dupla destruição de valor**: `Valor = NOI / cap rate` — NOI cai **e** o cap rate se expande. #cap-rate
- **Estacionamento, banheiros e praça** são os pontos de maior **fricção e memória**; atacam diretamente **footfall** e **dwell time**. #footfall #dwell-time
- **Fator concorrencial:** um concorrente renovado transforma depreciação gradual em **transferência ativa de share**. #fator-concorrencial

---

## 2. Os quatro blocos do argumento

> [!note] Bloco A — Enquadramento (proteção)
> Dois tipos de capex, duas réguas. Expansão → upside/NOI incremental. **Defensivo → downside evitado + proteção de cap rate.** A pergunta certa: *"quanto perdemos se NÃO fizermos?"*

> [!note] Bloco B — Cadeia de causalidade
> Deterioração → ↓satisfação/NPS → ↓footfall/dwell → ↓conversão → ↓vendas/m² → ↑custo de ocupação → ↑vacância/turnover → ↓NOI → **↑cap rate**. Dupla destruição não-linear.

> [!warning] Bloco C — Fator de aceleração concorrencial
> Quatro mecanismos: (1) deslocamento do referencial de qualidade; (2) migração de lojistas em cascata; (3) compressão do horizonte; (4) assimetria 1º vs 2º a se mover. Entra no modelo como **acréscimo à taxa de declínio** (aqui, 2%).

> [!tip] Bloco D — Quantificação (duas óticas)
> **Ótica 1 (proteção):** breakeven reverso θ* + benchmark + proteção de valuation. **Ótica 2 (crescimento):** quanto cada ativo com receita precisaria crescer para se pagar — piso de viabilidade por ativo.

---

## 3. Os números (dados reais — BBH)

### 3.1 Modelo defensivo consolidado (totalizador · aceleração 2%)

| Indicador | Valor |
|---|---|
| NPV defensivo | **R$ 136,6 mi** |
| TIR | **45%** (hurdle 12%) |
| **θ\* (declínio a evitar p/ NPV=0)** | **6,3%** |
| Margem de segurança (θ − θ\*) | 73,7 p.p. |
| Δ valor terminal (proteção de cap rate) | R$ 301,9 mi |
| Payback | 4 anos |
| Índice de lucratividade | 6,8x |

> [!check] Validação
> Recomputação independente (Python) bate exatamente com a planilha. O NOI cai ~34% em 10 anos no cenário "fazer nada" (declínio 4%).

### 3.2 Cenários de concorrência (θ\* cai conforme o concorrente avança)

| Cenário | Declínio | θ\* | NPV |
|---|---|---|---|
| Sem concorrente | 2% a.a. | **9,1%** | R$ 70,7 mi |
| Concorrente anunciou | 3% a.a. | **7,2%** | R$ 104,9 mi |
| Concorrente entregou | 4% a.a. | **6,3%** | R$ 136,6 mi |

> **Leitura:** mesmo no cenário mais conservador (sem concorrente), basta evitar **9,1%** do declínio para o projeto se pagar.

### 3.3 Breakeven de crescimento por ativo (independe da aceleração)

> [!note] Por que independe da aceleração
> O breakeven de crescimento por ativo depende só de **capex do ativo, NOI do ativo, WACC e cap rate** — não da taxa de declínio. Logo, vale igual para 2% ou 5% de aceleração.

| Ativo | Capex | NOI atribuível | Breakeven de crescimento | Tradução |
|---|---|---|---|---|
| **Praça** | R$ 7 mi | R$ 4,7 mi | **+15,6%** vendas/m² | R$ 51.250 → **R$ 59.267/m²** · **~2,2 anos** do crescimento histórico (7,1%/ano) |
| **Estacionamento** | R$ 7 mi | R$ 17,5 mi | **+4,2%** fluxo *ou* tarifa | **+R$ 0,88/ticket** (R$ 20,68 → R$ 21,56) *ou* **+46.553 veículos/ano** |
| **Banheiros** | R$ 9,5 mi | — | sem receita própria | viabiliza-se pela **proteção** |
| **TOTAL** | **R$ 23,5 mi** | ativo: R$ 84,1 mi | ótica defensiva | NPV defensivo + θ\* |

> Praça: 1.453 m², vendas 2026 de R$ 74,5 mi (aba PA da planilha).

---

## 4. As duas óticas de viabilidade

> [!success] Ótica 1 — PROTEÇÃO (totalizador, ativo inteiro)
> Preserva **NOI + cap rate**. NPV defensivo **R$ 136,6 mi**; basta evitar **6,3%** do declínio (θ\*) para se pagar; margem de 73,7 p.p.; Δvaluation **R$ 301,9 mi**. **Viável no agregado, independentemente de crescimento.**

> [!success] Ótica 2 — BREAKEVEN DE CRESCIMENTO (por ativo)
> **Praça:** +15,6% em vendas/m² (~2,2 anos do crescimento histórico). **Estacionamento:** +4,2% = +R$ 0,88/ticket (alavanca de pricing da gestão) ou +46.553 veículos/ano. **Banheiros:** defensivo. **Breakeven baixo e plausível.**

**Conclusão (dupla confirmação):** o investimento é viável pela proteção do valor **e** tem breakeven de crescimento modesto para os ativos com receita. Banheiros entram pelo defensivo.

---

## 5. Mapa do deck (20 slides)

> Arquivo: `Racional-Retrofit-Shoppings.pptx` · 16:9 · paleta Allos · **preenchido com dados reais**.

| # | Slide | Bloco |
|---|---|---|
| 1 | Capa — proteger o valor do ativo | Abertura |
| 2 | A pergunta do board e a resposta em uma linha | Sumário |
| 3 | Dois tipos de capex — duas réguas | A · Enquadramento |
| 4 | A baseline é o declínio (área entre curvas) | A |
| 5 | Cadeia de causalidade + dupla destruição | B |
| 6 | Por que estacionamento, banheiros e praça | B |
| 7 | Fator concorrencial — mecanismos | C |
| 8 | Fator concorrencial — janela / cenários | C |
| 9 | Como quantificamos (3 abordagens) | D |
| **10** | **2ª perspectiva: o crescimento necessário** | **D · crescimento** |
| **11** | **Praça — +15,6% em vendas/m² (~2,2 anos)** | **D** |
| **12** | **Estacionamento — +R$ 0,88/ticket (+4,2%)** | **D** |
| **13** | **Abertura por ativo + totalizador (23,5 mi)** | **D** |
| **14** | **Resultados: NPV R$ 136,6 mi · TIR 45% · θ\* 6,3%** | **Proteção** |
| **15** | **Breakeven & cenários (9,1% / 7,2% / 6,3%)** | **Proteção** |
| 16 | Custo de não fazer (assimetria) | Fechamento |
| 17 | Recomendação & priorização | Fechamento |
| 18 | Métricas de acompanhamento | Fechamento |
| **19** | **Resumo de viabilidade — duas óticas** | **Síntese** |
| 20 | Próximos passos / encerramento | Fechamento |

---

## 6. Mapa da planilha (8 abas)

> Arquivo do ativo: `BBH-BreakevenReverso_RacionalRetrofit_2.0.xlsx` (template: `Modelo-Breakeven-Reverso.xlsx`). Células **âmbar = preencher**, **areia = calculadas**.

| Aba | Conteúdo |
|---|---|
| **Leia-me** | Instruções, lógica do modelo, legenda. |
| **Resumo** | Dashboard: NPV, TIR, payback, θ\*, Δvaluation + abertura por ativo (proteção × crescimento) + veredito. |
| **Inputs** | *Única aba de preenchimento.* Macro + **Detalhamento por ativo** (capex 7/7/9,5; praça: área, vendas/m², NOI/m², histórico; estac.: volume, tarifa, margem). Capex total = soma. |
| **Modelo (DCF)** | Fluxo de caixa incremental ano a ano, valor terminal, NPV/TIR/payback/IL. |
| **Breakeven Reverso** | θ\* em forma fechada + tabela de sensibilidade NPV × θ + veredito. |
| **Breakeven por Ativo** | NOI incremental necessário, breakeven de crescimento por ativo, traduções (R$/m², R$/ticket, veículos), "≈ anos de histórico" e totalizador defensivo. |
| **Cenários Concorrência** | Sem concorrente / anunciou / entregou — θ\* e NPV por cenário. |
| **PA** | Vendas 2026 por lojista da praça (base do R$/m² real). *Dados sensíveis — fora do git.* |

---

## 7. Fórmulas-chave

> [!note] Modelo defensivo (ótica 1)
> - NOI sem retrofit: `A(t) = NOI₀ · (1 − d)^t`, `d` = declínio base + aceleração (2%+2%=4%).
> - Perda projetada: `L(t) = NOI₀ − A(t)`. NOI incremental anual: `θ · L(t)`.
> - NPV **linear em θ**: `NPV(θ) = A + B·θ` ⇒ breakeven **`θ* = −A / B`** (fechado, exato).
> - Δ valor terminal: `[A(N)+θ·L(N)]/cap_com − A(N)/cap_sem`.

> [!note] Breakeven de crescimento (ótica 2, por ativo)
> - NOI incremental anual p/ NPV=0: **`X = Capex_ativo / [ a(r,N) + DF(N)/cap_rate ]`**
>   com `a(r,N) = (1−(1+r)^−N)/r` e `DF(N) = (1+r)^−N`.  *(independe do declínio)*
> - Breakeven de crescimento: **`X / NOI_atual_do_ativo`**.
> - **Praça:** uplift de vendas/m² = breakeven × vendas/m². "Anos equivalentes" = breakeven ÷ CAGR histórico.
> - **Estacionamento** (receita = volume × tarifa): `+R$/ticket = X / (margem·volume)`; `+veículos = X / (margem·tarifa)`.

---

## 8. Como usar (passo a passo)

1. Abrir a planilha do ativo → aba **Inputs**.
2. Preencher/atualizar as **células âmbar** (macro + detalhamento por ativo).
3. Ler resultados na aba **Resumo** (totalizador) e **Breakeven por Ativo** (por ativo).
4. Ajustar a aba **Cenários Concorrência** conforme o estágio do concorrente.
5. O deck já reflete os números reais (slides 10–15 e 19). Reabrir a planilha no Excel recalcula tudo.
6. Apresentar `Racional-Retrofit-Shoppings.pptx`. Aprofundar em [[Racional — Retrofit de Shoppings]].

---

## 9. Inventário de arquivos

| Arquivo | Tipo | Papel |
|---|---|---|
| `Retrofit de Shoppings — MOC.md` | Obsidian | Índice/mapa de conteúdo |
| `Racional — Retrofit de Shoppings.md` | Obsidian | Documento-base completo |
| `Resumo Detalhado — Retrofit de Shoppings.md` | Obsidian | **Esta nota** |
| `Racional-Retrofit-Shoppings.pptx` | Deck | Apresentação ao board (20 slides) |
| `Modelo-Breakeven-Reverso.xlsx` | Planilha | Template do modelo (7 abas) |
| `BBH-BreakevenReverso_RacionalRetrofit_2.0.xlsx` | Planilha | Ativo real (8 abas) — *só anexo, fora do git* |
| `build_deck.py` / `build_planilha.py` | Scripts | Geradores (paleta Allos) |

> Pasta: `docs/retrofit-shoppings/` · branch `claude/shopping-retrofit-rationale-pf0o9v`.

---

## 10. Pendências e premissas

> [!todo] Pontos em aberto
> - [ ] **Confirmar a aceleração concorrencial:** o deck usa **2%** (instrução do usuário); a planilha enviada trazia 5%. Reverter para 5% eleva o NPV para ~R$ 218,8 mi e reduz θ* para ~5,1%.
> - [ ] Validar a divisão de capex (Praça 7 · Estac. 7 · Banheiros 9,5).
> - [ ] Calibrar declínio base + aceleração ao estágio real do concorrente.
> - [ ] Conferir contraste visual ao abrir o deck (previews renderizados não gerados — LibreOffice indisponível no ambiente).

> [!info] Recomendação de comunicação ao board
> Liderar pelo **θ\*** (e pela robustez nos cenários), não pelo NPV nominal: *"mesmo sem concorrente, basta evitar 9,1% do declínio para se pagar"* comunica melhor do que "NPV de R$ 136,6 mi sobre capex de R$ 23,5 mi".

---

> [!cite] Voltar
> [[Retrofit de Shoppings — MOC]] · [[Racional — Retrofit de Shoppings]]
