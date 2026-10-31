---
title: Dados de Referência — Estrutura de Shoppings
aliases:
  - Dados Estrutura Shoppings
  - Calibração Simulador Estrutura
  - Matriz de Criticidade Shoppings
tags:
  - skill
  - shoppings
  - dados
  - criticidade
  - volumetria
  - qlp
created: 2026-07-14
updated: 2026-07-14
status: referencia
---

# Dados de referência — Estudo de estrutura da empresa de shoppings

> [!abstract] O que é
> Tabelas do estudo de estrutura dos shoppings da **empresa de shoppings**.
> São a **fonte de verdade** do motor de cálculo do simulador e a base de
> calibração de qualquer implementação.
> Skill: [[Skill-Simulador-Estrutura-Shoppings]] ·
> Orquestração: [[SIMULADOR-ESTRUTURA-SHOPPINGS]] ·
> Cópia instalável: `skill/simulador-estrutura-shoppings/referencia-dados.md`.

## Índice
- [[#1 Motivadores & premissas do estudo]]
- [[#2 Matriz de criticidade (12 fatores, notas 1 / 3 / 5)]]
- [[#3 Volumetria — Comercial (ficha técnica do shopping médio)]]
- [[#4 Organogramas]]
- [[#5 Análise de QLP (portfólio — calibração)]]
- [[#6 Análise de custos (portfólio — calibração)]]
- [[#7 R&S — plano de mudanças]]
- [[#8 Governança e rollout]]
- [[#9 Oportunidades de evolução (backlog do modelo)]]

---

## 1 Motivadores & premissas do estudo

**Curto prazo**: ineficiências vs. custo; divergências de escopo;
realinhamento expectativa vs. entregas; mapeamento da real volumetria das
demandas.

**Longo prazo**: reestruturação do organograma do shopping alinhada à
estratégia da companhia; foco nas jornadas (cliente & consumidor);
desenvolvimento de profissionais mais inovadores e focados no negócio.

**Premissas**: otimizar a estrutura eliminando redundâncias; mapear
atividades e tempo demandado de todas as cadeiras; clareza de skills e plano
de carreira; equilibrar custo, estrutura e entregas.

## 2 Matriz de criticidade (12 fatores, notas 1 / 3 / 5)

### Fatores core

| Fator | 1 | 3 | 5 |
|-------|---|---|---|
| Sócio | Shopping 100% empresa de shoppings | Shopping com até 2 sócios | Mais de 2 sócios e/ou fundações |
| ATC | até 100.000 m² | > 100.000 e < 150.000 m² | > 150.000 m² |
| Fluxo de veículos | até 100 mil/mês | > 100 mil e < 200 mil/mês | > 200 mil/mês |
| Risco técnico | baixo (base do laudo técnico) | médio | alto |
| Risco de segurança | baixo | médio | alto |
| Idade do shopping | < 10 anos | 10–20 anos | > 20 anos |
| Time orgânico | nenhuma disciplina | até 2 disciplinas | > 2 disciplinas |
| Número de lojas | até 100 | 100–250 | > 250 |
| Regularização imobiliária | regular | irregular sem risco de fechamento | irregular com risco de fechamento |
| Condomínio total (100%) | até R$ 30 MM/ano | 30–50 MM/ano | > 50 MM/ano |

### Fatores eletivos

| Fator | 1 | 3 | 5 |
|-------|---|---|---|
| Capex (investimento) | até R$ 20 MM/ano | 20–30 MM/ano | > 30 MM/ano |
| Produtos digitais | nenhum | somente 1 — assistente de compras | produto completo |

### Ranges de criticidade (soma das 12 notas)

| Criticidade | Mín | Máx | Observação |
|-------------|-----|-----|------------|
| 1 | 20 | 35 | |
| 2 | 36 | 42 | |
| 3 | 43 | 50 | |
| 4 | 51 | 60 | Exclusiva para o maior empreendimento do portfólio |

> [!note]
> A matriz **não ocasionou mudança** nos organogramas de Operações — é régua
> comparativa e insumo para o dimensionamento de Marketing.

## 3 Volumetria — Comercial (ficha técnica do shopping médio)

### Variáveis de entrada

| Variável | Referência |
|----------|------------|
| Quantidade de lojas (sem quiosques) | 170 |
| Lojas disponíveis p/ comercialização (vagas, repasse, despejo) | 24 |
| Target de garantias a atualizar por mês | 1 |
| Renovações trabalhadas no mês | 1 |
| Média mensal de pontos de mall disponíveis | 11 |
| Profissionais no comitê de performance | 5 |
| Profissionais em RPS | 7 |
| Profissionais na matinal de mídia | 8 |
| Profissionais nas discussões estratégicas (big shots) | 7 |
| Profissionais no projeto "Padrinhos" | 26 |

### Blocos de escopo (horas/mês)

| Bloco (core) | h/mês | | Bloco (omni) | h/mês |
|--------------|-------|-|--------------|-------|
| NOI | 435 | | Gestão omni | 112 |
| Taxa de ocupação | 170 | | Ativação | 121 |
| Inadimplência | 231 | | Operação | 75 |
| Vendas e SSS | 196 | | Comercial | 39 |
| Gestão | 152 | | **Total omni** | **347** |
| Relacionamento | 206 | | | |
| Sócios | 23 | | | |
| Outros | 175 | | | |
| **Total core** | **1.588** | | | |

> 84 h/mês da gestão omni são participação do gerente e do coordenador
> comercial (ou equivalentes) em rotinas de produtos digitais.

### Flags que ajustam a volumetria e o organograma

- **Processos institucionais** (Projeto Padrinhos, matinal de mídia, big
  shots): desligado → a variável da ficha zera, o bloco Gestão encolhe
  proporcionalmente e o headcount recalcula.
- **Assistente de compras**: ausente → time de compras (assistente +
  auxiliar) sai do organograma de marketing, independentemente do GMV.
- **Programa de benefícios**: premissa fixa — todos os shoppings participam.

### Fórmula horas → colaboradores

```
demanda_ajustada = horas_mapeadas × 1,05      # margem de 5% = 25 min/dia/colaborador
headcount       = demanda_ajustada ÷ 185      # capacidade ≈ 185 h/mês por colaborador
```

**Validação obrigatória (shopping médio):**

| Escopo | Horas | + margem 5% | Headcount |
|--------|-------|-------------|-----------|
| Core business | 1.588 | 1.668 | 9,0 |
| Omnicanalidade | 347 | 364 | 2,0 |
| **Comercial total** | **1.935** | **2.032** | **11,0** |

### Eficiência de processos (goal do modelo)

Blocos que **geram resultado** (NOI, inadimplência, ocupação, vendas & SSS,
relacionamento, ativação/comercial omni) → **PRESERVAR** quando ≥ 10% do
tempo: recuperação de inadimplência e ganho de NOI trazem retorno — automatiza-se
só a parte transacional (BO, condomínio total, sistemas, régua de CRM).
Blocos de **suporte** (gestão, sócios, outros, gestão/operação omni) →
**APRIMORAR/AUTOMATIZAR** quando ≥ 5%. No shopping médio, **72,2% do tempo**
está em atividades de resultado — o objetivo é maximizar esse percentual.

## 4 Organogramas

### 4.1 Comercial — estrutura proposta

```
Superintendente
├── Gerente comercial
│   └── Coordenador(a) comercial
│       ├── Analista comercial
│       ├── Analista de performance
│       ├── Assistente de performance ²
│       ├── Supervisor de performance ³
│       ├── Analista de recebíveis
│       ├── Assistentes fin./com. ¹  (1 a 7 profissionais)
│       └── Estagiário comercial
└── Gerente de contas
    └── Executivo de vendas
```

1. Quantidade variável conforme a volumetria (pode ser assistente ou analista).
2. Quantidade variável conforme os desafios (pode virar assistente fin./com.).
3. Equipe de campo de performance não consta no estudo e não sofre alteração.

### 4.2 Marketing — critérios de dimensionamento

| Critério | Perfil do shopping | Volumetria |
|----------|--------------------|------------|
| 1 | Grande porte + produtos digitais full | 9 HC + 1 gerente (nos 2 maiores); 8 HC + 1 gerente nos demais |
| 2 | Grande porte + praça de retail + assistente de compras | 8 HC + 1 gerente |
| 3 | Grande porte + assistente de compras | 7 HC + 1 gerente |

Cargos: critério 1 = Analista MKT III, comunicação, community, trade, CRM,
omnicanalidade ativação (somente e-shopping), assistente de trade,
assistente de compras, auxiliar; critério 2 = sem omnicanalidade ativação;
critério 3 = sem Analista MKT III.

```
Superintendente
└── Gerente de marketing
    ├── Analista MKT III ¹
    ├── Analista de comunicação
    ├── Analista community manager
    ├── Analista de CRM
    ├── Analista trade
    ├── Assistente
    └── Time de omnicanalidade ¹
        ├── Analista de omnicanalidade ativação
        ├── Assistente de compras
        └── Auxiliar do assistente de compras ²
```

1. Variável conforme implantação dos produtos digitais.
2. GMV médio < R$ 100 mil → assistente + auxiliar; > R$ 100 mil → 2
   assistentes de compras.

### 4.3 Operações — estrutura proposta

```
Superintendente
└── Gerente de operações
    ├── Coordenador(a) de operações
    │   ├── Analista de projetos
    │   ├── Analista de operações
    │   ├── Estagiário de projetos
    │   └── Estagiário de operações
    ├── Coordenador(a) de experiência
    ├── Coordenador(a) de segurança
    └── Coordenador(a) de obras ¹
```

1. Somente para shoppings com Retrofit.

## 5 Análise de QLP (portfólio — calibração)

| Camada | Atual | Futuro | Δ |
|--------|-------|--------|---|
| Gestão | 182 | 182 | 0,00% |
| Base | 389 | 452 | +16,20% (+63) |
| Analista III MKT | — | 8 | shoppings com ≥ 2 produtos digitais |
| Produtos digitais | ~54 | 68 | inclui 14 profissionais compartilhados |
| **Total** | **639** | **710** | **+11,11% (+71)** |

## 6 Análise de custos (portfólio — calibração)

| Camada | Atual (R$) | Futuro (R$) | Δ |
|--------|------------|-------------|---|
| Gestão | 57.926.494 | 57.926.494 | 0,00% |
| Base | 39.012.046 | 42.913.394 | +10,02% |
| Demais (ADM, Analista III, OMNI) | ~4,8 MM | ~6,6 MM | — |
| **Total** | **101.708.785** | **107.393.411** | **+5,59%** |

Aumento de 63 profissionais no core ≈ +R$ 3,9 MM.

## 7 R&S — plano de mudanças

| Categoria | Qtde | Descrição |
|-----------|------|-----------|
| Mudanças totais mapeadas | 144 | movimentações no organograma |
| Contratações do novo organograma | 52 | evolução direta do formato |
| Esteira normal de operação | 32 | reposição em cadeiras já compatíveis |
| Cadeiras incompatíveis | 60 | **reaproveitar** em novas funções (G&G + shopping) |

Formato da planilha por shopping e área: faixas **Contrata / Reduz /
Mantém** listando os cargos em cada uma.

## 8 Governança e rollout

- G&G é a **guardiã** da estrutura de cada empreendimento.
- Exceções: validação com diretor regional + diretor executivo de operações.
- Shoppings com espaço no orçamento implementam de imediato; todos preveem a
  estrutura no orçamento do ano seguinte.
- Rollout em ondas: primeiro produtos digitais, depois todos os shoppings.

## 9 Oportunidades de evolução (backlog do modelo)

- Volumetria por **tempos & movimentos** (a atual é empírica).
- Pesagem da estrutura de **liderança** (ex.: gerente de negócios único).
- Plano de remuneração e carreira.
- Evolução por **jornadas** (cliente e lojista); retomada do foco em CX.
- Estrutura para shoppings com produtos digitais; rateios entre entidades.
- Novas variáveis para Operações (obras vs. analistas de projetos, POs).
