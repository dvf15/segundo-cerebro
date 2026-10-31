---
title: Etapa 3 — Análise de viabilidade
aliases:
  - Etapa 3
  - Análise de viabilidade
  - Viabilidade
tags:
  - qualificacao-leads
  - etapa
  - viabilidade
  - cto
  - tenant-mix
created: 2026-08-20
updated: 2026-08-20
status: ativo
etapa: 3
---

# Etapa 3 — Análise de viabilidade

> [!abstract] Quatro testes
> Aderência ao mix · Ponto e metragem · Potencial de faturamento · CTO estimado.
> Só passa para a [[Decisao-Perfil-do-Lead|decisão]] quem tem os quatro avaliados —
> mesmo que algum reprove (reprovar rápido também é resultado).

⬅ [[Etapa-2-Triagem-Previa|Etapa 2]] · ➡ [[Decisao-Perfil-do-Lead|Decisão]] · 🏠 [[Fluxo-de-Qualificacao-de-Leads|Índice]]

> [!tip] O [[RADAR-VAREJO|Radar de Varejo]] calcula os quatro testes
> Aderência ao mix, ponto compatível, faturamento estimado por m² e CTO estimado
> saem prontos na triagem da ferramenta — esta nota registra a decisão.

## Painel de viabilidade (editável)

| Teste | Resultado | Nota / valor | Veredito |
|---|---|---|:--:|
| 1 · Aderência ao mix | | | ☐ |
| 2 · Ponto e metragem | | | ☐ |
| 3 · Potencial de faturamento | | | ☐ |
| 4 · CTO estimado | | | ☐ |

---

## 1 · Aderência ao mix

- **Segmento do lead:** 
- **Operações do mesmo segmento hoje:** 
- **Meta do segmento no mix desejado:** 
- **Pontos vagos que pedem este segmento:** 

| Situação | `mix` | Leitura |
|---|:--:|---|
| Segmento é **1ª opção** de mix de ponto vago | 100 | Prioridade máxima |
| Segmento consta no mix desejado de vagas | 88 | Aderente |
| Segmento fora das opções de mix atuais | 52 | Neutro — avaliar caso a caso |
| Segmento já ocupado e fora do mix desejado | 34 | Canibalização |
| **Marca** já opera no shopping | 32 | Não duplicar |

**Aderência apurada:** 

## 2 · Ponto e metragem

- **Metragem pedida (Etapa 2):** 
- **Pontos vagos compatíveis:** 
- **Piso / corredor / vizinhança de âncora:** 
- **Restrições técnicas atendidas?** [ ] sim [ ] não — quais faltam: 
- **Estado do ponto:** [ ] casca bruta [ ] reformado [ ] com benfeitorias aproveitáveis

**Veredito de ponto:** [ ] 🟢 há ponto agora [ ] 🟡 há ponto em negociação/obra [ ] 🔴 não há ponto compatível

> [!tip] Sem ponto compatível não significa descarte
> Vira `standby` com data de revisão — o lead entra no radar quando a vaga
> aparecer. Registre a metragem-alvo para busca reversa.

## 3 · Potencial de faturamento

- **Faturamento previsto pelo lead (R$/mês):** 
- **Referência do segmento no shopping (R$/m²):** 
- **Faturamento estimado pelo shopping (R$/mês):** `referência × metragem` = 
- **Divergência lead × shopping:** 

| Divergência | Leitura |
|---|---|
| Previsão do lead ≤ estimativa do shopping | 🟢 Projeção conservadora |
| Até +25% acima | 🟡 Otimista — checar base da previsão |
| Acima de +25% | 🔴 Superestimada — refazer conta antes da proposta |

**Estimativa adotada para o CTO:** 

## 4 · CTO estimado

**CTO = aluguel mínimo (ou percentual) + condomínio + FPP + IPTU/taxas + energia/água**

| Componente | R$/mês | Observação |
|---|---|---|
| Aluguel mínimo | | |
| Condomínio | | |
| FPP (fundo de promoção) | | |
| IPTU / taxas | | |
| Utilidades (energia, água, gás) | | |
| **CTO total** | | |

- **CTO % = CTO ÷ faturamento estimado:** 

| CTO % | Leitura |
|:--:|---|
| ≤ 12% | 🟢 Confortável |
| 12–18% | 🟢 Faixa usual do varejo de shopping |
| 18–25% | 🟡 Apertado — depende de margem alta do segmento |
| > 25% | 🔴 Insustentável na projeção apresentada |

> [!note] Ajuste a leitura por segmento
> Alimentação e serviços suportam CTO % mais alto (margem e recorrência);
> operações de alto estoque e baixa margem, não. Ancore a faixa no histórico do
> próprio shopping, não em média de mercado.

**Veredito de CTO:** 

---

## Consolidação

- **Score do perfil (de [[Perfil-do-Cliente]]):** 
- **Aderência ao mix:** 
- **Score final = `match × (0,85 + 0,15 × mix/100) + bônus`:** 
- **Faixa:** [ ] ≥78 alto [ ] 60–77 médio [ ] 42–59 baixo [ ] <42 não recomendado

## Saída

- [ ] Quatro testes preenchidos
- [ ] Score final calculado
- [ ] Ressalvas registradas (giro, previsão sem lastro, ponto em obra…)
- [ ] Segue para [[Decisao-Perfil-do-Lead|Decisão — Qual é o perfil do lead?]]
