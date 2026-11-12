# MASTER EQUATION — FRAMEWORK CENTRAL DE PERFORMANCE v5
# Shopping Inteligente OS — Operational Conversion Cockpit

---

## Missão deste documento

Ensinar o OS a usar a Master Equation como lógica universal de diagnóstico de performance de lojistas — aplicável em todos os workflows, agentes e estágios do pipeline.

Toda análise de performance começa aqui. Antes de recomendar ação, o OS deve identificar em qual variável da equação está o problema.

---

## A Equação

```
VENDA REAL DA LOJA = [FLUXO DA LOJA] × [CONVERSÃO] × [TICKET MÉDIO]
```

> Nota crítica: a Venda Informada da Loja pode diferir da Venda Real por sonegação.
> O OS nunca usa a venda declarada como verdade absoluta. Sempre cruzar com sinais externos:
> fluxo do shopping, ticket médio da categoria, benchmark de m²/venda do cluster.

---

## As 3 Variáveis e suas Árvores de Composição

---

### 1. FLUXO DA LOJA

O fluxo da loja é derivado do fluxo do shopping, filtrado pela atratividade da loja e da marca.

**Árvore de composição:**

```
Fluxo da Loja
└── Atratividade do Shopping
    ├── Rendimento / Mix
    │   ├── Eventos
    │   ├── Promoções
    │   └── Mix (Moda, Lazer, Cultura, Entretenimento, Alimentação,
    │           Conveniência e Serviços, Tecnologia, Saúde e Beleza,
    │           Pet Care, Supermercado)
    ├── Capacidade de Atendimento
    │   ├── Estacionamento
    │   └── Infraestrutura Geral
    ├── Conveniência de Acesso
    │   ├── Carro / Moto
    │   ├── Pedestres / Transporte Público
    │   └── Sinalização / Comunicação
    ├── Potencial da Área de Influência
    │   ├── Poder Aquisitivo do Público
    │   └── Densidade Demográfica
```

**Diagnóstico pelo OS:**
- Fluxo do shopping está caindo? → problema estrutural do ativo (mix, acesso, eventos).
- Fluxo do shopping está estável mas o da loja está caindo? → problema de atratividade da loja ou da marca.
- Identificar em qual nó da árvore está o desvio antes de recomendar ação.

---

### 2. CONVERSÃO

Conversão é a proporção de pessoas que entram na loja e efetivamente compram.

**Árvore de composição:**

```
Conversão
├── Qualificação Equipe de Vendas
│   ├── Comprometimento com o negócio
│   ├── Conhecimento (Pessoal, dos Produtos)
│   ├── Apresentação
│   └── Motivação do Time
└── Dimensionamento Equipe de Loja
    ├── Adequada
    ├── Ociosa
    └── Subdimensionada
```

**Diagnóstico pelo OS:**
- Conversão abaixo do benchmark da categoria no cluster? → investigar equipe primeiro.
- Loja com bom fluxo e baixa conversão → problema de vendedor, não de produto ou localização.
- Loja subdimensionada em horário de pico → conversão cai por falta de atendimento, não por falta de interesse.

---

### 3. TICKET MÉDIO

Ticket médio é o valor médio gasto por transação. Depende da grade de estoque e da qualidade do sortimento.

**Árvore de composição:**

```
Ticket Médio e Vendas
├── Cálculo Base: Valor Vendido ÷ Quantidade Vendida
├── Grade de Estoque
│   └── Impactado por: % Ruptura
└── Qualidade do Estoque (Idealização / Coleção)
    └── Impactado por: % Ruptura da curva ABC de vendas
```

**Diagnóstico pelo OS:**
- Ticket em queda com fluxo estável → verificar ruptura de estoque nos itens da curva A.
- Ticket abaixo do benchmark → avaliar se o sortimento está alinhado ao poder aquisitivo do cluster.
- Ruptura alta → problema operacional (compra, logística, reposição) — acionar Builder ou Seller.

---

## Regra de Aplicação por Workflow

### Workflow 1 — Vacancy-to-Contract Sprint
Uso: avaliar potencial de performance do ocupante candidato antes do contrato.
- Estimar Fluxo esperado pelo posicionamento do ponto (corredor, piso, vizinhança).
- Estimar Conversão esperada pela categoria e perfil do operador.
- Estimar Ticket Médio pelo poder aquisitivo da área de influência e pelo cluster.
- Output: projeção de Venda Real estimada para subsidiar a proposta financeira.

### Workflow 2 — Street-to-Shopping Conversion Sprint
Uso: comparar a equação do operador de rua com o potencial dentro do shopping.
- Fluxo de rua vs. fluxo projetado no shopping → quantificar o delta.
- Conversão de rua tende a ser maior (público mais qualificado) → ajustar expectativa.
- Ticket Médio pode crescer com a marca do shopping → usar como argumento de conversão.
- Output: tese financeira comparativa rua vs. shopping para o Street Converter usar na abordagem.

### Workflow 3 — Cluster Experience Growth Sprint
Uso: identificar qual variável da equação está sendo atacada por cada ação de experiência.
- Eventos e mídia → atuam no Fluxo.
- PB, CRM, Helloo → atuam na Conversão e no Ticket Médio.
- Treinamento de equipe → atua na Conversão.
- Curadoria de mix e sortimento → atua no Ticket Médio.
- Output: cada ação do calendário deve declarar qual variável da equação pretende mover e em quanto.

---

## Regra de Diagnóstico Obrigatório

Antes de qualquer recomendação de performance, o OS deve responder:

1. A venda informada é confiável? Há sinais de subnotificação?
2. Qual das 3 variáveis está abaixo do benchmark do cluster?
3. Em qual nó da árvore daquela variável está o problema?
4. Qual agente é responsável por atacar aquele nó?
5. Qual ação resolve o problema em 30 dias? Em 90?

Se não for possível responder ao item 2 por falta de dados, marcar como "n.v." e solicitar ao lojista ou ao time de operações.

---

## Benchmarks de Referência por Cluster

> Nota: os valores abaixo são estimativas de referência. Marcar como "n.v." quando não houver dado validado do ativo.

| Cluster | Conversão típica | Vendas/m² referência | Ticket médio referência |
|---|---|---|---|
| Sofisticados | 15–25% | Alto | Alto |
| Compactos de Alto Padrão | 20–35% | Médio-alto | Médio-alto |
| Entretenimento | 18–28% | Médio | Médio |
| Passeio Familiar | 22–35% | Médio | Médio |
| Convenientes | 30–45% | Médio-baixo | Baixo-médio |

> Confiança nos benchmarks: 6/10 — são estimativas de mercado sem fonte validada por ativo.
> Substituir pelos dados reais do Sistema Bahia quando disponíveis.

---

## Integração com os Scores do OS

| Variável da Equação | Score relacionado no OS |
|---|---|
| Fluxo da Loja | Cluster Fit Score, Financial Impact Score |
| Conversão | Conversion Score, Seller ROI Score |
| Ticket Médio | SRIS Score, Financial Impact Score |
| Venda Real | Financial Impact Score consolidado |

---

## Agentes responsáveis por variável

| Variável | Agente principal | Agentes de suporte |
|---|---|---|
| Fluxo | Entertainer, Seller, Opportunity Channel | Hunter, Cluster Positioning Engine |
| Conversão | Seller, Governance & KPI Monitor | Builder (dimensionamento), Alavancador |
| Ticket Médio | Seller, KA / Brand Expansion | Cluster Positioning Engine |
| Diagnóstico integrado | Orquestrador Central | Deal Conversion Layer |

---

## Saída padrão quando a Master Equation for acionada

Para cada lojista ou oportunidade analisada:

```
Lojista / Marca:
Cluster:
Venda informada (R$/mês):
Venda estimada real (R$/mês):
Delta (gap ou excesso):

Diagnóstico:
  Fluxo: [acima / dentro / abaixo do benchmark] — nó do problema: [nó]
  Conversão: [acima / dentro / abaixo do benchmark] — nó do problema: [nó]
  Ticket Médio: [acima / dentro / abaixo do benchmark] — nó do problema: [nó]

Variável prioritária a atacar: [Fluxo / Conversão / Ticket Médio]
Agente responsável: [agente]
Ação recomendada: [ação]
Prazo: [prazo]
Impacto financeiro estimado: [R$ ou %]
KPI de acompanhamento: [KPI]
```
