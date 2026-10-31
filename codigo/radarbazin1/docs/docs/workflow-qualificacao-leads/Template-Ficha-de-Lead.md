---
title: Template — Ficha de lead
aliases:
  - Ficha de lead
  - Template de lead
tags:
  - qualificacao-leads
  - template
created: 2026-08-20
updated: 2026-08-20
status: ativo
tipo: template
---

# Template — Ficha de lead

> [!note] Como usar
> Copie **todo o bloco abaixo** (do `---` ao fim) para uma nota nova chamada
> `Lead - <Nome> - <AAAA-MM-DD>`. Em Obsidian, configure esta pasta como pasta de
> modelos (*Configurações → Modelos*) e insira com `Ctrl/Cmd + P → Inserir modelo`.
> O frontmatter já traz os campos que a consulta Dataview do
> [[Fluxo-de-Qualificacao-de-Leads|índice]] lê.

---

```markdown
---
title: Lead — NOME
tags:
  - lead
  - qualificacao-leads
data_contato: AAAA-MM-DD
origem: 
status: novo          # novo · triagem · viabilidade · proposta · standby · fechado · descartado
perfil:               # estruturado · investidor · saturado
operacao:             # loja satélite · megaloja · quiosque · alimentação · serviço
marca: 
tipo_marca:           # propria · franquia · multifranqueado
segmento: 
metragem: 
ticket_medio: 
faturamento_previsto: 
capital_implantacao: 
capital_giro: 
dedicacao:            # integral · parcial · baixa
quem_opera:           # dono · gerente · misto
experiencia:          # nenhuma · gestao · setor
score: 
executivo: 
proxima_acao: 
data_revisao: 
---

# Lead — NOME

> Fluxo: [[Fluxo-de-Qualificacao-de-Leads]]

## 1 · Entrada — [[Etapa-1-Lead-Entra-em-Contato]]

- **Contato:** 
- **Empresa:** 
- **Origem:** 
- **Pedido em uma frase:** 

## 2 · Triagem prévia — [[Etapa-2-Triagem-Previa]]

| # | Pergunta | Resposta |
|---|---|---|
| 1 | Qual é a operação? | |
| 2 | Marca própria ou franquia? | |
| 3 | Qual é o segmento? | |
| 4 | Qual metragem deseja? | |
| 5 | Qual é o ticket médio? | |
| 6 | Qual é o perfil do cliente? | ver bloco 3 |
| 7 | Qual é a previsão de faturamento? | |
| 8 | Possui apresentação ou projeto? | |

**Semáforo:** 🟢 / 🟡 / 🔴

## 3 · Perfil do cliente — [[Perfil-do-Cliente]]

### Camada 1 · operador/investidor

| Item | Valor |
|---|---|
| Capital de implantação (R$) | |
| Investimento estimado da operação (R$) | |
| `r` = capital ÷ investimento | |
| Capital de giro reservado (R$) | |
| Giro sugerido (R$) | |
| `rg` = giro ÷ giro sugerido | |
| Fonte do capital | próprio / sócio / financiado |
| Dedicação | integral / parcial / baixa |
| Quem opera | dono / gerente / misto |
| Experiência prévia | nenhuma / gestão / setor |
| Já foi franqueado | não / sim |
| Já operou em shopping | não / sim |
| Perfil de risco | conservador / moderado / arrojado |
| Objetivo | renda / passivo / realização / portfólio |

**Score por dimensão**

| Dimensão | Peso | Nota | Peso × nota |
|---|:--:|:--:|:--:|
| Financeiro | 34 | | |
| Giro | 16 | | |
| Experiência | 18 | | |
| Interesse | 16 | | |
| Dedicação | 9 | | |
| Risco | 7 | | |
| **Match** | 100 | | |

- **Travas aplicadas:** 
- **Mix:** 
- **Score final** = `match × (0,85 + 0,15 × mix/100) + bônus` = 
- **Faixa:** alto / médio / baixo / não recomendado

**Diagnóstico:** 
**Alertas:** 

### Camada 2 · consumidor

- **Público da marca:** 
- **Público do shopping:** 
- **Veredito:** 🟢 aderente / 🟡 parcial / 🔴 fora do perfil

## 4 · Viabilidade — [[Etapa-3-Analise-de-Viabilidade]]

| Teste | Resultado |
|---|---|
| Aderência ao mix | |
| Ponto e metragem | |
| Potencial de faturamento | |
| CTO estimado (R$ e %) | |

## 5 · Decisão — [[Decisao-Perfil-do-Lead]]

- **Saída:** A / B / C / standby / descarte
- **Motivo:** 
- **Data:** 
- **Executivo:** 
- **Próxima ação e prazo:** 

## Histórico de interações

| Data | Canal | O que aconteceu | Próximo passo |
|---|---|---|---|
| | | | |
```
