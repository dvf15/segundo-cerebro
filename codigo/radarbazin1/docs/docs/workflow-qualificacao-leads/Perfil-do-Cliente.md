---
title: Perfil do cliente — detalhamento
aliases:
  - Perfil do cliente
  - Perfil do lead
  - Detalhamento do perfil
  - Pergunta 6
tags:
  - qualificacao-leads
  - perfil-investidor
  - triagem
  - score
  - radar-quiosques
created: 2026-08-20
updated: 2026-08-20
status: ativo
etapa: 2.6
---

# Perfil do cliente — detalhamento

> [!abstract] Abertura da pergunta 6 da [[Etapa-2-Triagem-Previa|triagem prévia]]
> "Qual é o perfil do cliente?" tem **duas camadas** e as duas precisam ser
> respondidas antes da [[Etapa-3-Analise-de-Viabilidade|viabilidade]]:
>
> | Camada | Pergunta real | Onde entra |
> |--------|---------------|------------|
> | **1 · Operador/investidor** | Quem é o lead, quanto tem, quanto tempo dá, o que já operou | Define se o negócio **para em pé** |
> | **2 · Consumidor** | Quem a marca atende e se esse público existe na praça | Define se o negócio **vende aqui** |
>
> A camada 1 reproduz o motor de triagem do [[RADAR-QUIOSQUES|Radar Quiosques]]
> (`public/quiosques.html`, função `scoreBrand()`), adaptado de quiosque para
> **loja/operação de shopping**: no lugar do investimento de implantação da
> franquia entra o **investimento de implantação da loja + CTO**.

⬅ [[Etapa-2-Triagem-Previa|Etapa 2 — Triagem prévia]] · 🏠 [[Fluxo-de-Qualificacao-de-Leads|Índice]]

> [!tip] Fazer isso automaticamente
> O [[RADAR-VAREJO|Radar de Varejo]] (`public/operacoes.html`) calcula este
> score sozinho, incluindo o enquadramento de formato (loja ou quiosque) pela
> área necessária e pelo capital disponível.

---

# Camada 1 · Perfil do operador / investidor

## Bloco 1 — Identificação e origem do capital

- **Quem assina o contrato (PF / PJ):** 
- **CNPJ / tempo de mercado:** 
- **Sócios envolvidos (quem faz o quê):** 
- **Origem do lead:** ver [[Etapa-1-Lead-Entra-em-Contato|Etapa 1]]

**Fonte do capital** *(marque uma)*

- [ ] `proprio` — Recursos próprios
- [ ] `socio` — Com sócio
- [ ] `financiado` — Parte financiada (banco, FGI, fornecedor)

> [!warning] Leitura comercial
> Capital financiado não desqualifica, mas **antecipa** o ponto de equilíbrio:
> a parcela entra no fluxo antes do faturamento maduro. Registre valor da parcela
> mensal e prazo — vira ressalva na [[Etapa-3-Analise-de-Viabilidade|viabilidade]].

## Bloco 2 — Investimento disponível (implantação)

- **Capital disponível para implantação (R$):** 
- **Investimento estimado da operação (R$):** 
  *(obra + instalações + equipamentos + estoque inicial + taxa de franquia + luvas/cessão)*
- **Razão `r = capital ÷ investimento estimado`:** 

> [!note] O que entra em "implantação"
> Obra civil e instalações · mobiliário e comunicação visual · equipamentos ·
> estoque inicial · taxa de franquia (se houver) · projeto e ART/TRT ·
> despesas de abertura (alvará, AVCB, contábil) · reserva técnica de obra.

### Pontuação — dimensão financeira (peso 34)

| Faixa de `r` | Nota | Leitura |
|---|:--:|---|
| `r < 0,85` | `60 × r` | 🔴 Implantação acima do capital disponível |
| `0,85 ≤ r < 1` | 70 | 🟡 No limite — margem apertada |
| `1 ≤ r ≤ 1,8` | 100 | 🟢 Cabe com folga saudável |
| `1,8 < r ≤ 3` | 88 | 🟢 Folga grande |
| `r > 3` | 72 | ⚪ Capital muito acima — poderia mirar formato/metragem maior |
| não informado | 50 | 🟡 Confirmar antes de avançar |

**Nota financeira deste lead:** 

## Bloco 3 — Capital de giro

- **Capital de giro reservado (R$):** 
- **Giro sugerido para a operação (R$):** 
  *(referência: 3 a 6 meses de CTO + folha + reposição de estoque)*
- **Razão `rg = giro reservado ÷ giro sugerido`:** 

> [!danger] Por que giro é pergunta separada
> Giro insuficiente é a **maior causa de mortalidade no 1º ano** — a loja abre,
> vende razoavelmente e morre por falta de fôlego até o ponto de equilíbrio.
> Nunca deduza o giro do capital de implantação: pergunte os dois separadamente.

### Pontuação — capital de giro (peso 16)

| Faixa de `rg` | Nota | Leitura |
|---|:--:|---|
| `rg ≥ 1` | 100 | 🟢 Reserva compatível |
| `0,6 ≤ rg < 1` | 72 | 🟡 Abaixo do sugerido — acompanhar |
| `rg < 0,6` | 40 | 🔴 Giro insuficiente — sustentação em risco |
| não informado | 45 | 🟡 Confirmar reserva |

**Nota de giro deste lead:** 

## Bloco 4 — Quem vai operar e quanta dedicação

**Disponibilidade para tocar o negócio** *(marque uma)*

- [ ] `integral` — Integral · operador presente
- [ ] `parcial` — Parcial · meio-período
- [ ] `baixo` — Baixa · investidor / à distância

**Quem opera no dia a dia** *(marque uma)*

- [ ] `dono` — O próprio lead na loja
- [ ] `gerente` — Contrata gerente
- [ ] `misto` — Misto (sócio operador + gerente)

- **Equipe prevista (nº de pessoas):** 
- **Já tem gerente / equipe identificada?** 
- **Mora na praça ou vem de outra cidade?** 

### Pontuação — dedicação × exigência da operação (peso 9)

Compare a **dedicação que a operação exige** (`dono`, `gerente`, `passivo`) com
o que o lead oferece:

| Operação exige | Lead oferece | Nota | Leitura |
|---|---|:--:|---|
| `dono` (mão na massa) | Integral e não delega | 100 | 🟢 Compatível |
| `dono` | Parcial | 70 | 🟡 Exige gerente forte |
| `dono` | Baixa / só gerente | 42 | 🔴 Descasamento — risco alto |
| `gerente` (delegável) | Baixa ou gerente | 100 | 🟢 Compatível e delegável |
| `gerente` | Integral | 88 | 🟢 Compatível (sobra dedicação) |
| `passivo` | qualquer | 95 | 🟢 Indiferente |

**Nota de dedicação deste lead:** 

> [!tip] Regra prática
> Alimentação, serviço e operações de alta manipulação pedem `dono`.
> Vestuário, acessórios e franquias com manual maduro toleram `gerente`.

## Bloco 5 — Experiência prévia

**Já teve ou tocou algum negócio?** *(marque uma)*

- [ ] `nenhuma` — Primeira vez (nível 1)
- [ ] `gestao` — Já geriu negócio / equipe (nível 2)
- [ ] `setor` — Experiência no varejo / no setor (nível 3)

**Já é ou foi franqueado?** [ ] Não  [ ] Sim → *+1 nível (teto 3)*

- **Segmentos em que tem experiência:** 
- **Já operou em shopping?** [ ] Não [ ] Sim — quais: 
- **Operações ativas hoje (quantas / onde):** 

### Pontuação — experiência (peso 18)

Seja `nível_lead` = nível declarado **+1 se já foi franqueado** (máx. 3) e
`nível_exigido` = perfil que a operação pede (`iniciante` 1 · `intermediário` 2 ·
`avançado` 3). `complexidade` = 1 a 5.

| Situação | Nota |
|---|:--:|
| `nível_lead ≥ nível_exigido` | 100 |
| Um nível abaixo, complexidade ≤ 3 | 78 🟡 |
| Um nível abaixo, complexidade ≥ 4 | 62 🟡 |
| Dois níveis abaixo, complexidade ≤ 3 | 58 🔴 |
| Dois níveis abaixo, complexidade ≥ 4 | 38 🔴 |
| **Bônus:** já tem experiência **no mesmo segmento** | +15 (teto 100) |

**Nota de experiência deste lead:** 

> [!note] Operar em shopping é outro jogo
> Quem vem da rua ([[Shopping-Inteligente|street to mall]]) tem experiência de
> varejo mas não de shopping: horário estendido de 7 dias, CTO fixo, condomínio,
> FPP, calendário promocional e regras de obra. Registre isso como ponto de
> atenção mesmo com nota alta — é o que a [[Saida-A-Negocio-Estruturado|Saída A]]
> vai endereçar.

## Bloco 6 — Marca em mente, interesse e risco

- **Marca específica em mente:** 
- **Segmentos de interesse:** 
- **Principal objetivo:** [ ] renda / novo trabalho [ ] investimento (renda passiva) [ ] realização / marca que admira [ ] ampliar portfólio
- **Perfil de risco:** [ ] conservador [ ] moderado [ ] arrojado

### Pontuação — interesse (peso 16)

| Situação | Nota |
|---|:--:|
| A marca citada é exatamente a avaliada | 100 ★ |
| Correspondência parcial no nome da marca | 92 |
| Segmento avaliado está entre os de interesse | ≥ 88 |
| Sem marca em mente e sem segmento declarado | 60 |
| Declarou segmentos e o avaliado **não** está entre eles | ≤ 50 |

**Nota de interesse deste lead:** 

### Pontuação — risco (peso 7)

`nível_risco = complexidade + (payback > 28 meses ? 2 : payback > 24 ? 1 : 0)`

| Perfil do lead | `nível_risco ≤ 3` | `4–5` | `≥ 6` |
|---|:--:|:--:|:--:|
| Conservador | 100 | 70 | 45 |
| Moderado | 92 | 92 | 70 |
| Arrojado | 88 | 88 | 88 |

**Nota de risco deste lead:** 

---

## Cálculo do score do perfil

> [!important] Fórmula (idêntica ao `scoreBrand()` do Radar Quiosques)
> ```
> match = ( fin×34 + giro×16 + exp×18 + interesse×16 + tempo×9 + risco×7 ) ÷ 100
> ```

| Dimensão | Peso | Nota (0–100) | Peso × nota |
|---|:--:|:--:|:--:|
| Financeiro (implantação) | 34 | | |
| Capital de giro | 16 | | |
| Experiência | 18 | | |
| Interesse / marca em mente | 16 | | |
| Dedicação e operação | 9 | | |
| Risco | 7 | | |
| **Match do lead** | **100** | | **= /100** |

### Travas (pré-requisitos que sobrepõem a média)

| Condição | Efeito |
|---|---|
| Capital não informado **ou** `capital < 0,85 × implantação` | `match` limitado a **38** — pré-requisito não atendido |
| Giro informado e `giro < 0,5 × giro sugerido` | `match` limitado a **62** — sustentação do 1º ano em risco |
| Marca já opera no shopping | Score final limitado a **45** — evitar duplicar |

> [!danger] A trava financeira vem primeiro
> Sem capital de implantação a operação é inviável **independentemente do resto**.
> Nenhuma vaga, lacuna de mix ou entusiasmo do lead resgata esse caso — no máximo
> ele vira [[Saida-B-Investidor-sem-Operacao|investidor sem operação]] ou `standby`
> até recompor capital.

### Modulação pela aderência ao mix

A aderência ao planejamento comercial **modula** o match, nunca o substitui:

```
score final = match × (0,85 + 0,15 × mix/100) + bônus_lacuna     (teto 100)
```

| Situação do segmento | `mix` | Bônus |
|---|:--:|:--:|
| Pedido como **1ª opção** de mix em ponto vago | 100 | +3 |
| Consta no mix desejado de algum ponto vago | 88 | — |
| Fora das opções de mix dos pontos vagos | 52 | — |
| Já ocupado e fora do mix desejado (canibalização) | 34 | — |
| Marca já presente no shopping | 32 | — |
| **Marca desejada** no planejamento comercial | — | +3 |

- **Mix deste lead:** 
- **Bônus:** 
- **Score final:** 

### Faixas de score

| Faixa | Classificação | Encaminhamento sugerido |
|---|---|---|
| ≥ 78 | 🟢 Alto match | [[Saida-A-Negocio-Estruturado\|Saída A]] — direcionar ao executivo e avaliar o ponto |
| 60–77 | 🟡 Match médio | Saída A com ressalvas, ou [[Saida-B-Investidor-sem-Operacao\|Saída B]] se faltar operação |
| 42–59 | ⚪ Match baixo | [[Saida-B-Investidor-sem-Operacao\|Saída B]] ou `standby` |
| < 42 | 🔴 Não recomendado | [[Saida-C-Segmento-Saturado\|Saída C]] ou descarte com motivo |

---

## Diagnóstico do lead (preencher)

**Tipo de perfil identificado:**

- [ ] **Operador estruturado** — capital + giro + experiência + dedicação
- [ ] **Operador iniciante capitalizado** — dinheiro sim, experiência não → priorizar franquia madura, baixa complexidade
- [ ] **Operador experiente subcapitalizado** — sabe operar, falta capital → formato menor, ponto menor, ou sócio investidor
- [ ] **Investidor puro** — capital sem intenção de operar → exige marca delegável + gerente
- [ ] **Multifranqueado / expansão** — lead prioritário, ciclo curto
- [ ] **Curioso / exploratório** — sem capital definido nem projeto → nutrir, não consumir agenda do executivo

**Alertas levantados**

- [ ] Reserva de giro abaixo do recomendado
- [ ] Primeira operação — priorizar baixa complexidade e rede com suporte
- [ ] Vem da rua — nunca operou em shopping (CTO, horário, condomínio)
- [ ] Capital parcialmente financiado — parcela antecipa o ponto de equilíbrio
- [ ] Previsão de faturamento sem lastro
- [ ] Quer delegar operação que exige dono presente
- [ ] Segmento saturado no mix atual
- [ ] Outro: 

**Resumo para o CRM (copiar):**

> 

---

# Camada 2 · Perfil do consumidor da operação

Quem a marca atende — e se esse público existe **nesta praça**.

- **Faixa etária predominante:** 
- **Classe / renda:** [ ] A [ ] B [ ] C [ ] D
- **Gênero predominante:** 
- **Momento de compra:** [ ] impulso [ ] destino [ ] presente [ ] reposição [ ] serviço
- **Frequência esperada:** [ ] diária [ ] semanal [ ] mensal [ ] esporádica
- **Horário de pico:** [ ] manhã [ ] almoço [ ] tarde [ ] noite [ ] fim de semana
- **Ticket médio declarado (Etapa 2, pergunta 5):** 

### Aderência ao público do shopping

| Critério | Público da marca | Público do shopping | Aderência |
|---|---|---|---|
| Classe / renda | | | |
| Faixa etária | | | |
| Momento de compra | | | |
| Ticket compatível | | | |

**Veredito de público:** [ ] 🟢 aderente [ ] 🟡 parcial (ajuste de linha/mix de produto) [ ] 🔴 fora do perfil da praça

> [!tip] Cruze com o fluxo real
> Ticket alto em praça de renda média não é veto automático — é questão de
> **posicionamento do ponto** (corredor nobre, proximidade de âncora aderente).
> Já público-alvo que simplesmente não circula no shopping é veto: nenhum ponto
> corrige ausência de demanda.

## Saída desta nota

- [ ] Camada 1 pontuada (match + score final)
- [ ] Camada 2 com veredito de público
- [ ] Diagnóstico e alertas preenchidos
- [ ] Resultado copiado para a linha 6 da [[Etapa-2-Triagem-Previa|triagem]]
- [ ] Segue para [[Etapa-3-Analise-de-Viabilidade|Etapa 3 — Análise de viabilidade]]
