# Dados de referência — Estudo de estrutura da empresa de shoppings

Tabelas extraídas do estudo de estrutura dos shoppings da empresa de
shoppings. São a **fonte de verdade** do motor de cálculo do simulador e a
base de calibração (validação) de qualquer implementação.

---

## 1. Motivadores & premissas do estudo

**Curto prazo**: ineficiências vs. custo; divergências de escopo;
realinhamento expectativa vs. entregas; mapeamento da real volumetria das
demandas.

**Longo prazo**: reestruturação do organograma do shopping alinhada à
estratégia da companhia; foco nas jornadas (cliente & consumidor);
desenvolvimento de profissionais mais inovadores e focados no negócio.

**Premissas**: otimizar a estrutura eliminando redundâncias; mapear atividades
e tempo demandado de todas as cadeiras; clareza de skills e plano de
carreira; equilibrar custo, estrutura e entregas.

---

## 2. Matriz de criticidade (12 fatores, notas 1 / 3 / 5)

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

A matriz **não ocasionou mudança** nos organogramas de Operações — é régua
comparativa e insumo para o dimensionamento de Marketing.

---

## 3. Volumetria — Comercial (ficha técnica do shopping médio)

### Variáveis de entrada da ficha técnica

| Variável | Valor de referência |
|----------|---------------------|
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

### Blocos de escopo (horas/mês, shopping médio)

**Core business:**

| Bloco | Horas/mês |
|-------|-----------|
| NOI | 435 |
| Taxa de ocupação | 170 |
| Inadimplência | 231 |
| Vendas e SSS | 196 |
| Gestão | 152 |
| Relacionamento | 206 |
| Sócios | 23 |
| Outros | 175 |
| **Total core** | **1.588** |

**Canais digitais (omnicanalidade):**

| Bloco | Horas/mês |
|-------|-----------|
| Gestão omni | 112 |
| Ativação | 121 |
| Operação | 75 |
| Comercial | 39 |
| **Total omni** | **347** |

> 84 h/mês da gestão omni referem-se à participação do gerente comercial e
> do coordenador comercial (ou equivalentes) em rotinas de produtos digitais.

### Flags que ajustam a volumetria e o organograma

- **Processos institucionais** (Projeto Padrinhos, matinal de mídia, big
  shots): flags por shopping. Processo desligado → a variável correspondente
  da ficha técnica zera, o bloco **Gestão** (driver: rituais) encolhe
  proporcionalmente e o headcount é recalculado.
- **Assistente de compras**: flag por shopping. Ausente → o time de compras
  (assistente + auxiliar do assistente) sai do organograma de marketing,
  independentemente do GMV.
- **Programa de benefícios**: premissa fixa do modelo — todos os shoppings
  participam (não é flag).

### Fórmula de conversão horas → colaboradores

```
demanda_ajustada = horas_mapeadas × 1,05      # margem de 5% = 25 min/dia/colaborador
headcount       = demanda_ajustada ÷ 185      # capacidade ≈ 185 h/mês por colaborador
```

**Validação (shopping médio):**

| Escopo | Horas | + margem 5% | Headcount |
|--------|-------|-------------|-----------|
| Core business | 1.588 | 1.668 | 9,0 |
| Omnicanalidade | 347 | 364 | 2,0 |
| **Comercial total** | **1.935** | **2.032** | **11,0** |

Qualquer implementação do motor deve reproduzir esta tabela com os valores da
ficha técnica acima.

---

### Eficiência de processos (goal do modelo)

Classificação dos blocos: **gera resultado** (tempo é investimento —
preservar) × **suporte** (candidato a automação). PRESERVAR quando bloco de
resultado ≥ 10% do total; AUTOMATIZAR quando bloco de suporte ≥ 5%. No
shopping médio, **72,2% do tempo** está em atividades de resultado.

| Bloco | Tipo | Diretriz |
|-------|------|----------|
| NOI | Gera resultado | Manter (ganho de NOI); automatizar só o transacional: condomínio total (OBZ, caixa, CRD, orçamento) e Capex pró-business |
| Inadimplência | Gera resultado | Manter (recuperação traz retorno); automatizar RC/NFs/pagamentos junto ao BO para maximizar o tempo de negociação |
| Taxa de ocupação | Gera resultado | Manter; padronizar sistemas (CRM, plataforma de vendas, EPM) |
| Vendas e SSS | Gera resultado | Manter (frequência e ticket médio); comitês mais objetivos |
| Relacionamento | Gera resultado | Manter (renovações e mix); centralizar régua de CRM para qualificar o contato |
| Ativação / Comercial (omni) | Gera resultado | Manter; automatizar réguas recorrentes e integrar funil ao CRM |
| Gestão | Suporte | Aprimorar/automatizar: revisar calls, fóruns e processos institucionais |
| Sócios | Suporte | Padronizar reports |
| Outros | Suporte | Eliminar redundâncias; contas de consumo/medições via ERP |
| Gestão omni / Operação (omni) | Suporte | Reduzir sobreposição core/omni; automatizar rotinas do e-shopping |

## 4. Organogramas

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

1. Quantidade variável conforme a volumetria de cada empreendimento (pode ser
   assistente ou analista).
2. Quantidade variável conforme os desafios do empreendimento (função pode
   ser convertida para assistente fin./com. tradicional).
3. A equipe de campo de performance (auxiliares, por ex.) não consta no
   estudo e não sofre alteração.

### 4.2 Marketing — critérios de dimensionamento

| Critério | Perfil do shopping | Volumetria |
|----------|--------------------|------------|
| 1 | Grande porte + produtos digitais full | 9 HC + 1 gerente (nos 2 maiores); 8 HC + 1 gerente nos demais |
| 2 | Grande porte + praça de retail + assistente de compras | 8 HC + 1 gerente |
| 3 | Grande porte + assistente de compras | 7 HC + 1 gerente |

**Cargos por critério:**

- **Critério 1**: Analista MKT III, Analista de comunicação, Analista de
  community, Analista de trade, Analista de CRM, Analista de omnicanalidade
  ativação (somente e-shopping), Assistente de trade, Assistente de compras,
  Auxiliar do assistente de compras.
- **Critério 2**: idem, sem o Analista de omnicanalidade ativação.
- **Critério 3**: idem critério 2, sem o Analista MKT III.

**Estrutura proposta:**

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

1. Quantidade variável conforme implantação dos produtos digitais.
2. Varia com o GMV médio do produto: GMV médio < R$ 100 mil → 1 assistente de
   compras + 1 auxiliar; GMV médio > R$ 100 mil → 2 assistentes de compras.

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

---

## 5. Análise de QLP (portfólio — calibração)

| Camada | Atual | Futuro | Δ |
|--------|-------|--------|---|
| Gestão | 182 | 182 | 0,00% |
| Base | 389 | 452 | +16,20% (+63) |
| Analista III MKT | — | 8 | shoppings com ≥ 2 produtos digitais |
| Produtos digitais | ~54 | 68 | inclui 14 profissionais compartilhados |
| **Total** | **639** | **710** | **+11,11% (+71)** |

- O incremento de 71 = 63 na base (volumetria) + 8 analistas III de marketing
  (rollout de produtos digitais); 14 profissionais são compartilhados entre
  empreendimentos.
- Estrutura de produtos digitais compartilhada: assistentes e auxiliares de
  compras por shopping; analistas omnicanal alocados apenas nos shoppings com
  e-shopping; demais analistas atuam de forma ampla a partir da holding.

## 6. Análise de custos (portfólio — calibração, folha de referência)

| Camada | Atual (R$) | Futuro (R$) | Δ |
|--------|------------|-------------|---|
| Gestão | 57.926.494 | 57.926.494 | 0,00% |
| Base | 39.012.046 | 42.913.394 | +10,02% |
| Demais (ADM, Analista III, OMNI) | ~4,8 MM | ~6,6 MM | — |
| **Total** | **101.708.785** | **107.393.411** | **+5,59%** |

- Aumento de 63 profissionais no core ≈ +R$ 3,9 MM.
- Referência histórica (tese inicial): estrutura de 3 anos antes, corrigida
  por dissídios, ficaria ~R$ 99,8 MM; as reestruturações anteriores levaram a
  estrutura a ~R$ 95–97 MM antes do novo formato (Δ −4,48% vs. corrigida).

## 7. R&S — plano de mudanças (exemplo do estudo)

| Categoria | Qtde | Descrição |
|-----------|------|-----------|
| Mudanças totais mapeadas | 144 | movimentações no organograma dos shoppings |
| Contratações do novo organograma | 52 | evolução direta do formato (assistentes, analistas III etc.) |
| Esteira normal de operação | 32 | cadeiras já compatíveis, contratação de reposição |
| Cadeiras incompatíveis | 60 | **reaproveitar** em funções do novo organograma (avaliação G&G + shopping) |

Formato da planilha de R&S por shopping e área: três faixas —
**Contrata / Reduz / Mantém** — listando os cargos em cada uma
(ex.: Comercial → Contrata: assistente; Marketing → Reduz: analista de
community → assistente; Operações → Mantém: estrutura completa).

## 8. Governança e rollout

- G&G é a **guardiã** da estrutura de cada empreendimento.
- Exceções à estrutura aprovada: validação com diretor regional + diretor
  executivo de operações, com apoio de G&G.
- Shoppings com espaço no orçamento implementam **de imediato**, conforme
  cronograma; todos preveem a estrutura definida no orçamento do ano seguinte.
- Rollout em ondas: primeiro os cargos prioritários (produtos digitais),
  depois a adaptação da estrutura para todos os shoppings.
- Fases históricas do projeto: (1) insights sobre falta de critérios de
  dimensionamento; (2) alinhamento com matriciais e G&G + mapeamento da
  estrutura atual; (3) desenvolvimento da volumetria, novos organogramas e
  avaliação de quantitativos e custos.

## 9. Oportunidades de evolução (backlog do modelo)

- Volumetria por processo estruturado de **tempos & movimentos** (a atual é
  empírica, apurada com profissionais seniores).
- Pesagem e avaliação da estrutura de **liderança** (ex.: gerente de negócios
  unificando comercial + marketing; existência de coordenador de marketing).
- Plano de remuneração e plano de carreira.
- Evolução baseada em **jornadas** do cliente e do lojista, com operações
  como suporte a ambas; retomada do foco em CX.
- Estrutura necessária para shoppings com produtos digitais (alinhamento com
  agilidade) e revisão do escopo de marketing com/sem produtos digitais.
- Amadurecimento dos **rateios entre entidades** (governança).
- Revisão do escopo de operações: novas variáveis nas premissas (quantidade
  de obras vs. analistas de projetos, responsável por abertura de POs etc.).
