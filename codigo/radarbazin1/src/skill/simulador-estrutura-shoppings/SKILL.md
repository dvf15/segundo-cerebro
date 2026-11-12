---
name: simulador-estrutura-shoppings
description: >-
  Use quando o usuário quiser simular, dimensionar ou revisar a estrutura de
  administração (organograma, headcount e custo) de um shopping center — ou
  quando estiver desenvolvendo/melhorando o Simulador de Estrutura de
  Shoppings. Aplica a metodologia da empresa de shoppings: matriz de
  criticidade (12 fatores), volumetria de atividades (horas → colaboradores),
  organogramas de referência por área (Comercial, Marketing, Operações),
  análise de QLP/custos e plano de R&S.
---

# Simulador de Estrutura de Administração de Shoppings

> **Goal**: ter a **estrutura mais eficiente** com base nos **processos** e
> na **complexidade de cada ativo**, **preservando tempo para as atividades
> core** e maximizando o objetivo do shopping:
>
> *"Trazer as melhores ofertas de lojas, serviços, entretenimento e
> gastronomia, visando aumentar a frequência de visita e o ticket médio
> gasto nas lojas, com uma experiência qualificada, gerando encantamento
> para seus consumidores e maximizando venda para seus lojistas e
> anunciantes — com isso, maximizando o retorno sobre investimento aos
> empreendedores de shoppings a longo prazo."*
>
> O resultado final é sempre um **comparativo entre a estrutura atual e a
> proposta pelo modelo**. Atividades que consomem tempo **mas trazem
> resultado/retorno** (recuperação de inadimplência, ganho de NOI, vendas,
> ocupação) **devem ser mantidas** — automatiza-se apenas a parte
> transacional delas; as atividades de **suporte** são as candidatas a
> aprimoramento e/ou automação.

Esta skill transforma o Claude no **motor de domínio** do simulador: dado o
perfil de um shopping (variáveis abaixo), ela produz a **criticidade**, o
**organograma proposto**, o **quadro de lotação (QLP)**, o **comparativo de
custos**, o **plano de R&S** e a **análise de eficiência de processos** —
seguindo a metodologia do estudo de estrutura da empresa de shoppings.

Use-a em dois modos:

1. **Modo simulação** — o usuário informa os dados de um shopping e você
   calcula e apresenta o resultado (tabelas + organograma em texto/mermaid).
2. **Modo desenvolvimento** — o usuário está construindo a ferramenta
   (`public/simulador-estrutura.html`); use as regras daqui como especificação
   funcional e siga os direcionamentos de
   `docs/SIMULADOR-ESTRUTURA-SHOPPINGS.md`.

Os dados numéricos de referência (tabelas completas) estão em
[`referencia-dados.md`](referencia-dados.md). Leia esse arquivo sempre que for
calcular ou implementar o motor.

## Premissas do modelo (sempre respeitar)

- **Partir da otimização da estrutura**: eliminar redundâncias e ineficiências
  de escopo antes de adicionar gente.
- **Dados antes de feeling**: dimensionamento sai da matriz de criticidade e
  da volumetria, não de percepção.
- **Manutenção da gestão**: a camada de gestão (superintendente, gerentes,
  coordenadores) **não muda** na simulação — a evolução acontece apenas na
  **equipe de base**.
- **Equilíbrio custo × estrutura × entregas**: todo resultado deve mostrar o Δ
  de headcount e o Δ de custo contra a estrutura atual.
- **Governança**: exceções à estrutura aprovada exigem validação do diretor
  regional + diretor executivo de operações, com apoio de G&G (guardiã da
  estrutura). Shoppings com espaço no orçamento implementam de imediato; os
  demais preveem a estrutura no orçamento do ano seguinte.

## Passo 1 — Coletar as variáveis do shopping

Peça (ou leia do formulário da ferramenta) as **12 variáveis da matriz de
criticidade** — 10 fatores *core* + 2 *eletivos* — cada uma pontuada em
**1, 3 ou 5**:

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

Para a **volumetria comercial**, colete também: nº de lojas (sem quiosques),
lojas disponíveis para comercialização, target de garantias/mês, renovações
trabalhadas/mês, pontos de mall disponíveis, e nº de profissionais em rituais
(comitê de performance, RPS, matinal de mídia, big shots, padrinhos).

Colete ainda as **flags do shopping**:

- **Processos institucionais** (Projeto Padrinhos, matinal de mídia, big
  shots): quando um processo está **desligado**, as horas correspondentes
  saem do bloco Gestão da volumetria e a estrutura é recalculada.
- **Assistente de compras**: opcional por shopping — quando ausente, o time
  de compras (assistente + auxiliar) sai do organograma de marketing.
- **Programa de benefícios**: premissa fixa — **todos os shoppings
  participam**; não é flag, a estrutura já o considera.

Para o **Marketing**: quantidade de produtos digitais implantados e GMV médio
do e-shopping (se houver). Para **Operações**: se o shopping está em Retrofit.

## Passo 2 — Calcular a criticidade

Some as 12 notas (mínimo 12–20 na prática, máximo 60) e classifique:

| Criticidade | Pontuação |
|-------------|-----------|
| 1 | 20–35 |
| 2 | 36–42 |
| 3 | 43–50 |
| 4 | 51–60 (*exceção — reservada ao maior empreendimento do portfólio*) |

> A matriz de criticidade **não altera** o organograma de Operações — ela
> serve de régua comparativa entre shoppings e de insumo para Marketing.

## Passo 3 — Calcular a volumetria (Comercial)

Metodologia horas → colaboradores, validada com a ficha técnica do shopping
médio (ver `referencia-dados.md`):

```
demanda_ajustada (h/mês) = Σ horas dos blocos de escopo × 1,05   # margem de 5% ≈ 25 min/dia/colaborador
headcount = demanda_ajustada ÷ 185                               # capacidade ≈ 185 h/mês por colaborador
```

Arredonde o headcount para o inteiro mais próximo, separando **core business**
e **omnicanalidade** (canais digitais). Os blocos de escopo do core são: NOI,
taxa de ocupação, inadimplência, vendas & SSS, gestão, relacionamento, sócios
e outros. A gestão omni inclui horas do gerente e coordenador comercial em
rotinas de produtos digitais.

## Passo 4 — Montar o organograma proposto

Aplique a **estrutura proposta** de cada área (detalhes e variações em
`referencia-dados.md`):

- **Comercial**: Superintendente → Gerente comercial → Coordenador(a)
  comercial → base (analista comercial, analista/assistente/supervisor de
  performance, analista de recebíveis, **assistentes fin./com. em quantidade
  variável de 1 a 7 conforme a volumetria**, estagiário) + Gerente de contas →
  Executivo de vendas.
- **Marketing**: dimensionado por **3 critérios** (tamanho + produtos
  digitais): critério 1 → 9 HC + gerente (8 HC nos demais); critério 2 →
  8 HC + gerente; critério 3 → 7 HC + gerente. Time de omnicanalidade só onde
  há e-shopping; a dupla assistente de compras + auxiliar vira 2 assistentes
  quando o GMV médio do produto passa de R$ 100 mil. Se o shopping **não
  possui assistente de compras** (flag), o time de compras sai do organograma.
- **Operações**: estrutura única (gerente, coordenadores de operações /
  experiência / segurança, analistas, estagiários); **coordenador de obras
  apenas em shoppings com Retrofit**.

## Passo 5 — QLP, custos e plano de R&S

1. **QLP**: compare atual × proposto por camada (gestão / base / adm /
   produtos digitais) e mostre Δ absoluto e %. Gestão deve fechar em Δ 0%.
2. **Custos**: aplique o salário de referência de cada cargo (parametrizável
   na ferramenta) e apresente o comparativo com os mesmos cortes do QLP. Use
   os números do estudo em `referencia-dados.md` como calibração de ordem de
   grandeza (base +10% ≈ equipe total +5,6%).
3. **R&S**: classifique cada mudança em **Contrata / Reduz / Mantém** por área
   e derive as três categorias do estudo: contratações do novo organograma,
   contratações da esteira normal de operação, e cadeiras incompatíveis a
   **reaproveitar** em funções do novo formato (avaliação conjunta G&G +
   shopping — nunca apresentar como demissão automática).

## Passo 6 — Eficiência de processos (goal)

Ranqueie os blocos de escopo por consumo de horas (% do total) e classifique
cada um:

- **Gera resultado** (NOI, inadimplência, taxa de ocupação, vendas & SSS,
  relacionamento, ativação e comercial omni): tempo aqui é investimento —
  **PRESERVAR** quando ≥ 10% do total (ex.: recuperação de inadimplência e
  ganho de NOI trazem retorno direto). Automatizar **apenas a parte
  transacional** (RC/NFs/pagamentos no BO, condomínio total, sistemas
  comerciais, régua de CRM) para liberar ainda mais tempo core.
- **Suporte** (gestão, sócios, outros, gestão omni, operação omni):
  candidatos a **APRIMORAR/AUTOMATIZAR** quando ≥ 5% do total (calls e
  fóruns, reports, contas de consumo via ERP, redundâncias).

Reporte também o **% do tempo em atividades que geram resultado** (no
shopping médio: 72,2%) — o objetivo é maximizar esse percentual, não cortar
horas do core.

## Formato de saída (modo simulação)

Apresente sempre nesta ordem:

1. **Resumo executivo** (2–4 linhas): criticidade, **comparativo estrutura
   atual × proposta** (Δ HC e Δ custo) e os processos prioritários.
2. **Matriz de criticidade** preenchida (tabela com nota por fator + total).
3. **Volumetria comercial** (blocos de horas, margem, headcount core + omni).
4. **Eficiência de processos**: ranking de consumo de horas + o que
   aprimorar/automatizar.
5. **Organogramas propostos** por área (mermaid `graph TD` ou lista indentada).
6. **QLP atual × proposto** e **custos** (tabelas com Δ).
7. **Plano de R&S** (Contrata / Reduz-reaproveita / Mantém).
8. **Alertas de governança** (exceções que exigem validação).

Se faltar alguma variável, assuma o valor do *shopping médio* da ficha
técnica, **sinalize a suposição** e siga em frente.
