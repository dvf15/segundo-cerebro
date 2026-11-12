---
title: Skill — Simulador de Estrutura de Shoppings
aliases:
  - Simulador de Estrutura (skill)
  - Skill Estrutura Shoppings
  - Motor de Domínio Estrutura Shoppings
tags:
  - skill
  - shoppings
  - organograma
  - simulador
  - volumetria
  - criticidade
created: 2026-07-14
updated: 2026-07-14
status: skill
---

# Skill — Simulador de Estrutura de Administração de Shoppings

> [!goal] Objetivo
> Ter a **estrutura mais eficiente** com base nos **processos** e na
> **complexidade de cada ativo**, **preservando tempo para as atividades
> core** e maximizando o objetivo do shopping: *"trazer as melhores ofertas
> de lojas, serviços, entretenimento e gastronomia, visando aumentar a
> frequência de visita e o ticket médio gasto nas lojas, com uma experiência
> qualificada, gerando encantamento para seus consumidores e maximizando
> venda para seus lojistas e anunciantes — com isso, maximizando o retorno
> sobre investimento aos empreendedores de shoppings a longo prazo"*.
> O resultado final é o **comparativo estrutura atual × proposta**;
> atividades que **trazem retorno** (recuperação de inadimplência, ganho de
> NOI) **são mantidas** — automatiza-se a parte transacional e o suporte.

> [!abstract] O que esta skill faz
> Transforma o Claude no **motor de domínio** do simulador de estrutura de
> administração de shoppings: dado o perfil de um empreendimento, produz a
> **criticidade**, o **organograma proposto**, o **QLP**, o **comparativo de
> custos** e o **plano de R&S**, seguindo a metodologia do estudo de
> estrutura da **empresa de shoppings**.
>
> Versão instalável (Claude Code): `skill/simulador-estrutura-shoppings/SKILL.md`.
> Dados numéricos: [[Dados-Referencia-Estrutura-Shoppings]].
> Orquestração do desenvolvimento: [[SIMULADOR-ESTRUTURA-SHOPPINGS]].

## Índice
- [[#Modos de uso]]
- [[#Premissas do modelo]]
- [[#Passo 1 — Coletar as variáveis do shopping]]
- [[#Passo 2 — Calcular a criticidade]]
- [[#Passo 3 — Calcular a volumetria (Comercial)]]
- [[#Passo 4 — Montar o organograma proposto]]
- [[#Passo 5 — QLP, custos e plano de R&S]]
- [[#Formato de saída]]

---

## Modos de uso

1. **Modo simulação** — o usuário informa os dados de um shopping e a skill
   calcula e apresenta o resultado (tabelas + organograma).
2. **Modo desenvolvimento** — o usuário está construindo a ferramenta
   (`public/simulador-estrutura.html`); as regras daqui são a especificação
   funcional, e a orquestração segue [[SIMULADOR-ESTRUTURA-SHOPPINGS]].

## Premissas do modelo

- **Partir da otimização da estrutura**: eliminar redundâncias e
  ineficiências de escopo antes de adicionar gente.
- **Dados antes de feeling**: dimensionamento sai da matriz de criticidade e
  da volumetria, não de percepção.
- **Manutenção da gestão**: a camada de gestão (superintendente, gerentes,
  coordenadores) **não muda** — a evolução acontece apenas na **equipe de
  base**.
- **Equilíbrio custo × estrutura × entregas**: todo resultado mostra o Δ de
  headcount e o Δ de custo contra a estrutura atual.
- **Governança**: exceções à estrutura aprovada exigem validação do diretor
  regional + diretor executivo de operações, com apoio de G&G (guardiã da
  estrutura).

## Passo 1 — Coletar as variáveis do shopping

As **12 variáveis da matriz de criticidade** (10 fatores *core* + 2
*eletivos*), cada uma pontuada em **1, 3 ou 5**:

| # | Fator | Nota 1 | Nota 3 | Nota 5 |
|---|-------|--------|--------|--------|
| 1 | Sócio | 100% empresa de shoppings | até 2 sócios | > 2 sócios e/ou fundações |
| 2 | ATC (área total construída) | ≤ 100.000 m² | 100–150 mil m² | > 150.000 m² |
| 3 | Fluxo de veículos | ≤ 100 mil/mês | 100–200 mil/mês | > 200 mil/mês |
| 4 | Risco técnico | baixo | médio | alto |
| 5 | Risco de segurança | baixo | médio | alto |
| 6 | Idade do shopping | < 10 anos | 10–20 anos | > 20 anos |
| 7 | Time orgânico | nenhuma disciplina | até 2 disciplinas | > 2 disciplinas |
| 8 | Número de lojas | ≤ 100 | 100–250 | > 250 |
| 9 | Regularização imobiliária | regular | irregular sem risco | irregular c/ risco de fechamento |
| 10 | Condomínio total (100%) | ≤ R$ 30 MM/ano | 30–50 MM/ano | > 50 MM/ano |
| 11 | Capex (eletivo) | ≤ R$ 20 MM/ano | 20–30 MM/ano | > 30 MM/ano |
| 12 | Produtos digitais (eletivo) | nenhum | só assistente de compras | produto completo |

Para a **volumetria comercial**, coletar também a ficha técnica (nº de lojas
sem quiosques, lojas disponíveis, garantias/mês, renovações/mês, pontos de
mall, profissionais em rituais). Para **Marketing**: produtos digitais
implantados e GMV médio do e-shopping. Para **Operações**: flag de Retrofit.

Flags adicionais do shopping:
- **Processos institucionais** (Projeto Padrinhos, matinal de mídia, big
  shots): desligado → horas saem do bloco Gestão e a estrutura recalcula.
- **Assistente de compras**: opcional — ausente → time de compras
  (assistente + auxiliar) sai do organograma de marketing.
- **Programa de benefícios**: premissa fixa — todos os shoppings participam.

## Passo 2 — Calcular a criticidade

Somar as 12 notas e classificar:

| Criticidade | Pontuação |
|-------------|-----------|
| 1 | 20–35 |
| 2 | 36–42 |
| 3 | 43–50 |
| 4 | 51–60 (*exceção — maior empreendimento do portfólio*) |

> [!note]
> A matriz de criticidade **não altera** o organograma de Operações — é
> régua comparativa entre shoppings e insumo para Marketing.

## Passo 3 — Calcular a volumetria (Comercial)

```
demanda_ajustada (h/mês) = Σ horas dos blocos de escopo × 1,05   # margem 5% ≈ 25 min/dia/colaborador
headcount = demanda_ajustada ÷ 185                               # capacidade ≈ 185 h/mês por colaborador
```

Arredondar para o inteiro mais próximo, separando **core business** (NOI,
taxa de ocupação, inadimplência, vendas & SSS, gestão, relacionamento,
sócios, outros) e **omnicanalidade**. Valores de referência do shopping
médio em [[Dados-Referencia-Estrutura-Shoppings#3 Volumetria — Comercial (ficha técnica do shopping médio)|Dados de referência §3]].

## Passo 4 — Montar o organograma proposto

- **Comercial**: Superintendente → Gerente comercial → Coordenador(a)
  comercial → base (analista comercial, analista/assistente/supervisor de
  performance, analista de recebíveis, **assistentes fin./com. de 1 a 7
  conforme a volumetria**, estagiário) + Gerente de contas → Executivo de
  vendas.
- **Marketing**: 3 critérios de dimensionamento — critério 1 → 9 HC +
  gerente (8 nos demais); critério 2 → 8 HC + gerente; critério 3 → 7 HC +
  gerente. Time de omnicanalidade só onde há e-shopping; GMV médio >
  R$ 100 mil converte assistente + auxiliar em 2 assistentes de compras.
- **Operações**: estrutura única; **coordenador de obras apenas em
  shoppings com Retrofit**.

Detalhes em [[Dados-Referencia-Estrutura-Shoppings#4 Organogramas|Dados de referência §4]].

## Passo 5 — QLP, custos e plano de R&S

1. **QLP**: atual × proposto por camada (gestão / base / adm / produtos
   digitais), Δ absoluto e %. Gestão fecha em Δ 0%.
2. **Custos**: salário de referência por cargo (parametrizável), mesmos
   cortes do QLP. Calibração: base +10% ≈ equipe total +5,6%.
3. **R&S**: mudanças em **Contrata / Reduz / Mantém**; reduções sempre como
   **reaproveitamento** a avaliar com G&G — nunca demissão automática.

## Formato de saída

1. **Resumo executivo** (criticidade, headcount proposto, Δ custo).
2. **Matriz de criticidade** preenchida.
3. **Volumetria comercial** (blocos, margem, headcount core + omni).
4. **Organogramas propostos** por área.
5. **QLP atual × proposto** e **custos** (com Δ).
6. **Plano de R&S**.
7. **Alertas de governança**.

Se faltar variável: assumir o valor do *shopping médio*, **sinalizar a
suposição** e seguir.
