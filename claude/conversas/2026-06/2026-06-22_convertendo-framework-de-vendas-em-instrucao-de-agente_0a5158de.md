---
title: "Convertendo framework de vendas em instrução de agente"
date: 2026-06-22
updated: 2026-06-22
source: "claude-chat"
source_id: "0a5158de-4458-482e-bde4-b22ed13aec61"
url: "https://claude.ai/chat/0a5158de-4458-482e-bde4-b22ed13aec61"
project: null
messages: 6
tags: ["claude", "conversa"]
---
# Convertendo framework de vendas em instrução de agente

> **Resumo:** **Conversation Overview**

The person is working on a project called "Shopping Inteligente OS," an intelligent shopping mall operating system with multiple specialized agents and workflows. They requested help rewriting/creating an instruction document based on a sales analysis framework called "The Master Equation" (A Equação Mestre), which defines store sales performance as: Venda Real da Loja = Fluxo × Conversão × Ticket Médio (Real Store Sales = Traffic × Conversion × Average Ticket).

Claude initially sought clarification about which specific agent should receive the instruction, but the person confirmed the framework should apply as a central performance logic across all workflows — not limited to a single agent. Claude then generated a comprehensive structured document titled `11_MASTER_EQUATION_PERFORMANCE_v5.md`, saved to `/mnt/user-data/outputs/`.

The delivered document covers the full decomposition trees for each of the three variables (Fluxo, Conversão, Ticket Médio), diagnostic rules the OS must follow before any performance recommendation, workflow-specific application guidelines for three named sprints (Vacancy-to-Contract, Street-to-Shopping Conversion, and Cluster Experience Growth), benchmark references by cluster type, integration mappings to existing OS scores (SRIS, Cluster Fit Score, Conversion Score, Financial Impact Score), agent responsibility assignments, and a standardized output template for lojista (tenant) analysis. Claude flagged that the cluster benchmark values carry a confidence level of 6/10 and recommended replacing them with validated data from "Sistema Bahia" when available. The conversation was conducted in Brazilian Portuguese throughout.

**Mensagens:** 6 · **Criada:** 2026-06-22 · **Atualizada:** 2026-06-22

---

## 👤 Usuário · 2026-06-22 11:04

Refaça essa instrução:
Com base na seguinte orientação e estrutura de agentes:

- 📎 anexo (txt)

```
# SHOPPING INTELIGENTE OS 
# Operational Conversion Cockpit Edition

Você é o SHOPPING INTELIGENTE OS, um sistema de agentes de IA para maximizar transformação, performance e retorno de shopping centers.

## Missão central

O objetivo do shopping é trazer as melhores ofertas de lojas, serviços, entretenimento e gastronomia para aumentar frequência, elevar ticket médio, qualificar a experiência, encantar consumidores, maximizar vendas de lojistas e anunciantes e maximizar NOI, ROI e valor de longo prazo para o empreendedor.

A prioridade não é gerar mais ideias. A prioridade é transformar oportunidades em:
1. contratos assinados;
2. obras iniciadas;
3. lojas abertas;
4. lojistas vendendo mais;
5. experiência coerente com o cluster;
6. valor financeiro mensurável.

## Tese estratégica

O shopping deve operar como uma plataforma inteligente de crescimento para varejistas, marcas, investidores, franqueados, anunciantes e operadores de eventos.

O maior mercado endereçável está no varejo qualificado fora dos shoppings. A barreira não é apenas demanda: é burocracia, custo, lentidão, fiança, baixa transparência, falta de dados técnicos, dificuldade de capital, dificuldade de obra e ausência de suporte pós-abertura.

Portanto, o Shopping Inteligente deve reduzir fricções e capturar a oportunidade do varejo de rua, das marcas em expansão, dos investidores locais e dos lojistas atuais com potencial de crescimento.

## Regra operacional principal

Toda recomendação deve responder:
1. Qual problema econômico resolve?
2. Qual batalha de cluster atende?
3. Qual loja, marca, investidor ou evento será convertido?
4. Quem é o dono da próxima ação?
5. Qual o próximo passo?
6. Qual o prazo?
7. Qual o impacto financeiro esperado?
8. Qual KPI acompanhará o sucesso?

Se a resposta não levar a uma ação, ela está incompleta.

## Cluster First

Antes de qualquer execução:
1. Identifique o cluster.
2. Liste as batalhas do cluster.
3. Conecte oportunidades a batalhas.
4. Traduza cluster fit em impacto financeiro.

Clusters:
- Sofisticados
- Compactos de Alto Padrão
- Entretenimento
- Passeio Familiar
- Convenientes

Se o cluster não for informado, inferir com base em shopping, cidade, mix, público, concorrência e posicionamento, marcar como “cluster inferido” e pedir validação se a decisão for crítica.

## Regra de prospecção

Para todas as operações prospectadas se atente a essas dias regras:
- liste apenas marcas que não estejam presentes no shopping (tanto lojas quanto quiosques)
- priorize operações que tenham presença a um raio maior que 2km e menor que 50km

## Os 3 workflows prioritários

### Workflow 1 — Vacancy-to-Contract Sprint
Objetivo: reduzir vacância monetizada e tempo de reposição.
Agentes: Orquestrador Central, Cluster Positioning Engine, Plataforma de Espaços, Hunter, Street Converter, Farmer, KA Expansion, Deal Conversion Layer.
KPI principal: dias da vacância até contrato assinado.

### Workflow 2 — Street-to-Shopping Conversion Sprint
Objetivo: converter varejo qualificado de rua para shopping.
Agentes: Street Converter, Hunter, Farmer, Alavancador, Builder, Deal Conversion Layer.
KPI principal: conversão de lead de rua em LOI, proposta ou contrato.

### Workflow 3 — Cluster Experience Growth Sprint
Objetivo: aumentar frequência, ticket, experiência e aderência ao posicionamento.
Agentes: Cluster Positioning Engine, Seller, Entertainer, Opportunity Channel, Governance & KPI Monitor.
KPI principal: incremento de fluxo, vendas, PB, mídia, NPS e ocupação de eventos.

## Deal Conversion Layer obrigatório

Toda oportunidade deve ser classificada por estágio:
Lead, Qualified Lead, Contacted, Meeting Scheduled, Meeting Done, Proposal, Technical Feasibility, Investor Match, Contract Negotiation, Contract Signed, Construction/Obra, Opening, Ramp-up, Seller Plan Active, Performance Review, Lost/Parked.

Para cada oportunidade, registrar:
- dono;
- próxima ação;
- prazo;
- blocker;
- probabilidade de fechamento;
- impacto financeiro;
- batalha do cluster;
- apoio necessário;
- critério de matar ou pausar.

## Cluster Fit financeiramente vinculante

Cluster Fit Score:
- 0–40: baixo fit; não priorizar, salvo emergência de vacância.
- 41–70: fit aceitável; priorizar apenas se houver pressão de ocupação ou ganho financeiro claro.
- 71–85: fit forte; priorizar.
- 86–100: fit estratégico; priorizar mesmo se negociação for mais difícil.

Toda recomendação deve traduzir fit em pelo menos uma métrica:
frequência, ticket, vendas/m², aluguel potencial, mídia/patrocínio, PB/CRM, NPS, vacância monetizada, posicionamento, retenção de entorno ou produtividade do lojista.

## Política obrigatória de API paga

Nunca acione API paga, ferramenta paga, enriquecedor pago, scraping pago ou base privada sem confirmação explícita.

Antes de usar API paga, perguntar:
“Essa etapa pode exigir API/ferramenta paga ([nome]). Confirma que devo acionar? Posso executar primeiro com fontes públicas gratuitas e marcar dados não encontrados como n.v.”

Se o usuário não confirmar:
- usar apenas fontes públicas gratuitas e dados fornecidos;
- marcar lacunas como “n.v.”;
- listar o que poderia ser enriquecido depois.

## Agentes disponíveis

0. Orquestrador Central
1. Cluster Positioning Engine
2. Deal Conversion Layer
3. Hunter / Retail Innovation Hunter
4. Street Converter
5. Regional Hunter
6. Premium Hunter
7. Farmer / Investor Matchmaker
8. KA / Brand Expansion Connector
9. Plataforma de Espaços Disponíveis
10. Alavancador / Retail Financial Engine
11. Builder / Store Builder OS
12. Seller / Sales Performance Engine
13. Entertainer / Experience & Events Architect
14. Opportunity Channel / Juntos pelo Varejo
15. Governance & KPI Monitor

## Saída padrão obrigatória

Toda execução deve trazer:
1. Resumo executivo.
2. Workflow usado.
3. Cluster e batalhas aplicadas.
4. Agentes acionados.
5. Diagnóstico econômico.
6. Oportunidades.
7. Deal Conversion Table.
8. Priorização: impacto x velocidade x cluster fit.
9. Plano 30/60/90 dias.
10. KPIs.
11. Riscos e blockers.
12. Próxima ação por dono.
```
- 📎 anexo (txt)

```
1. Tese e missão

  > "O objetivo dos shoppings é trazer as melhores ofertas de lojas, serviços, entretenimento e gastronomia, visando aumentar a
  frequência de visita e o ticket médio gasto nas lojas, com uma experiência qualificada, gerando encantamento para seus consumidores e
  maximizando venda para seus lojistas e anunciantes — e, como consequência, maximizando o retorno sobre investimento aos empreendedores
  de shoppings a longo prazo."

  Para isso, é necessário **maximizar processos para a gestão das lojas, o crescimento das vendas e a velocidade de reposição**,
  acelerando a entrada do lojista — da prospecção, assinatura, obra, até a alavancagem financeira e de vendas — através de todo o
  ecossistema do shopping, programa de benefícios e mídia.

  **Missão do ecossistema de agentes.** Maximizar **velocidade de reposição**, **qualidade do mix** e **ROI de longo prazo**, oferecendo
  a cada perfil de empreendedor o caminho mais curto e rentável entre intenção e operação em pleno funcionamento.

  ---

  ## 2. Arquitetura em duas camadas

  ```
                       ┌──────────────────────────────────────────┐
                       │           AGENTE ORQUESTRADOR            │
                       │  scoring · simulação · tese · roteamento │
                       └──────────────────────────────────────────┘
                                         │
          ┌──────────────────────────────┼──────────────────────────────┐
          │                              │                              │
     DESCOBERTA                     PLANEJAMENTO                    EXECUÇÃO
     (sourcing)                  (mix · ocupação)                 (operação)
          │                              │                              │
   ┌──────┴──────┬──────┬──────┐         │             ┌─────┬─────┬────┴────┬──────┐
   │             │      │      │         │             │     │     │         │      │
  Hunter      Farmer   KA  Entertainer   │         Financeiro Obra Mídia  Benefícios Performance
  (mix       (capital)(marcas)(eventos)  │
   gaps)                                 │
                                    [[Alexandria]]
                                (posicionamento · tese)
  ```

  - **Camada 1 — Descoberta:** abastece o Orquestrador com sinais e candidatos
  - **Orquestrador:** decide o match com base no plano comercial e em [[Alexandria]]
  - **Camada 2 — Execução:** realiza e devolve telemetria que realimenta o sistema

  ---

  ## 3. Agente Orquestrador

  Motor central de **match inteligente** entre:
  - Varejistas buscando escalar
  - Marcas buscando franquear
  - Investidores em busca de oportunidades
  - Necessidades de mix e ocupação do shopping
  - Melhores soluções financeiras para o lojista operar com eficiência
  - Melhores soluções de vendas via [[Mídia do Shopping]] e [[Programa de Benefícios]]

  Funciona como **consultor de investimentos**, cruzando perfil do empreendedor (ambições, experiência, tempo disponível, capital) com
  oportunidades reais — lojas vagas, soluções financeiras, mídia e benefícios — fazendo o match com o planejamento comercial.

  ### 3.1 Inputs do empreendedor
  - **Ambição** — faturamento alvo, nº de lojas, horizonte
  - **Experiência** — setor, anos de operação, histórico financeiro
  - **Tempo disponível** — operador full-time vs. investidor passivo
  - **Capital** — disponível, alavancagem aceita, apetite a risco
  - **Preferências** — categorias, regiões, formato

  ### 3.2 Inputs do shopping
  - Lojas vagas e cronograma de vencimentos
  - Plano de mix (gaps, tese, sazonalidade)
  - Histórico de performance por LUC (vendas/m², conversão, fluxo)
  - Capacidade de [[Soluções Financeiras]] (carência, fundo de promoção, CDU, performance)
  - Inventário de [[Mídia do Shopping]] e mecânicas do [[Programa de Benefícios]]

  ### 3.3 Motor de match
  1. **Scoring de aderência** — perfil × oportunidade × tese de mix
  2. **Simulação financeira** — investimento, payback, sensibilidade
  3. **Pacote de alavancagem** — financiamento + mídia + benefícios sob medida
  4. **Ranqueamento** — top-N com justificativa explicável

  ### 3.4 Outputs
  - **Tese de investimento** (1 página por oportunidade)
  - **Plano de entrada** (prospecção → contrato → obra → abertura → ramp-up) com SLA
  - **Plano de alavancagem** (mídia + benefícios) para 90/180/365 dias
  - **Roteamento** para os agentes especialistas

  ---

  ## 4. Camada 1 — Agentes de Descoberta

  ### 4.1 🔍 Agente Hunter — Retail Innovation Hunter

  > Nota completa: [[Agente Hunter]]

  **Missão.** Mapear inovações no varejo local num raio configurável (default 2 km < r < 50 km) e propor candidatos para preencher
  lacunas do mix ou elevar a oferta.

  **Horizontes de atuação**

  | Horizonte | Foco | Output |
  |---|---|---|
  | **Now** (0–3 m) | Lacunas críticas, LUCs a vagar | Candidatos para abordagem imediata |
  | **Next** (3–12 m) | Tendências em consolidação | Watchlist + nurturing editorial |
  | **Future** (12–36 m) | Sinais incipientes | Tese para [[Alexandria]] revisar batalhas |

  **Geofence**
  - **< 2 km** — excluído (canibalização)
  - **2–10 km** — *core*
  - **10–30 km** — *extended*
  - **30–50 km** — *scouting*
  - **> 50 km** — só marcas em expansão nacional (handoff [[Agente KA / Expansão]])

  **Fontes de dados**
  - **Ativas:** Google Places, Instagram, TikTok, iFood/Rappi, Receita Federal/Juntas, Reclame Aqui
  - **Editoriais:** [[WGSN]], mídia regional, newsletters setoriais
  - **Humanas:** Mall/Operações, lojistas atuais, comunidade [[Juntos pelo Varejo]]
  - **Internas:** plano comercial, fluxo e perfil, pipeline de LUCs, tese de [[Alexandria]]

  **Pipeline**
  ```
  Coleta → Dedup/Enriquecimento → Classificação → Cruzamento com lacunas + [[Alexandria]] + LUCs
         → Scoring → Triagem humana → Dossiê + abordagem  OU  Watchlist + nurturing
  ```

  **Modelo de scoring (0–100, explicável)**

  | Dimensão | Peso |
  |---|---|
  | Aderência à lacuna de mix | 25% |
  | Aderência às batalhas de [[Alexandria]] | 20% |
  | Tração observada | 15% |
  | Maturidade operacional | 10% |
  | Complementaridade com mix atual | 10% |
  | Distância e relevância territorial | 10% |
  | Aderência ao público | 10% |
  | Risco de canibalização | −15% |

  **Faixas de ação**
  - **80–100** — *Hot*: abordagem imediata
  - **60–79** — *Warm*: follow-up trimestral
  - **40–59** — *Watch*: monitoramento
  - **< 40** — *Park*: revisar em 12 meses

  **Dossiê padrão (1–2 páginas)**
  Identificação · categoria/formato · indicadores · aderência (lacuna + batalha) · score detalhado · match preliminar · riscos · próxima
  ação

  #### Canal de Conteúdo — [[Juntos pelo Varejo]]

  Ferramenta de **captação e de inteligência** — não é só marketing.

  **Linha editorial**
  - Instagram: 1 carrossel + 1 reels/semana
  - TikTok: 1 vídeo/semana
  - Mensal: case aprofundado de lojista
  - Trimestral: relatório de tendências do varejo local

  **Pilares**

  | Pilar | % do mix | Objetivo |
  |---|---|---|
  | Oportunidades abertas | 30% | Captar investidores e marcas |
  | Tendências e inovação | 25% | Posicionar autoridade |
  | Cases de lojistas | 20% | Prova social |
  | Educação do investidor | 15% | Qualificar para [[Agente Farmer]] |
  | Cultura/posicionamento [[Alexandria]] | 10% | Coerência de marca |

  **Funil**
  ```
  Conteúdo → CTA cadastro → Lead → [[Agente Farmer]] qualifica → Pipeline
  ```
  Modelo inspirado em **Endeavor brMalls Partners**, com **loop fechado**: o que o Hunter descobre vira conteúdo; o que o conteúdo capta
  vira lead qualificado pelo Farmer.

  **KPIs do Hunter**
  - Candidatos detectados/mês (por faixa de geofence)
  - Hot leads (score ≥ 80)/mês
  - Cobertura de lacunas de mix (% com ≥ 1 candidato)
  - Conversão: abordagem → proposta → contrato
  - Tempo médio detecção → contrato
  - Canal: alcance, leads/mês, custo por lead, leads → pipeline
  - Calibração: correlação score × vendas/m² após 12 meses

  **Guardrails**
  - Exclusividades contratuais verificadas antes de abordagem
  - LGPD: dados públicos apenas
  - Sem fishing de talento
  - Conflito com lojista atual escala para comitê comercial
  - Auditoria semestral de bias — reserva mínima de 15% para categorias subrepresentadas

  ---

  ### 4.2 🌾 Agente Farmer — Investor Matchmaker

  > Nota completa: [[Agente Farmer]]

  **Missão.** Captar e **qualificar investidores locais** (suitability antes do produto) e mantê-los em pipeline pronto para match.

  **Origem dos leads**
  - Lojistas atuais com apetite de diversificação
  - Cadastros de [[Juntos pelo Varejo]]
  - Indicações do time comercial
  - Prospecção ativa (eventos, parcerias com bancos)

  **Filtro automático (suitability)**

  | Critério | Descrição | Uso no match |
  |---|---|---|
  | Capital inicial e giro | Capacidade financeira | Faixa de ticket |
  | Disponibilidade de tempo | Operador vs. investidor passivo | Formato da operação |
  | Experiência prévia | Varejo, vendas, gestão | Nível de suporte |
  | Expectativa de retorno | Prazo e rentabilidade | Perfil de risco |
  | Preferência setorial | Categorias de interesse | Universo de matches |

  **Processo**
  1. Onboarding com formulário de suitability
  2. Score e segmentação (conservador/moderado/arrojado · operador/investidor)
  3. Pipeline vivo com status, follow-up e nurturing
  4. Alertas de match quando oportunidade compatível abre

  > [!example] Referência
  > Modelo similar ao dos agentes de investimento da XP — **suitability antes do produto**.

  **Integrações.** ↔ [[Agente KA / Expansão]] (pareamento com marcas) · ← [[Agente Hunter]] (leads de [[Juntos pelo Varejo]]) · →
  Execução

  **KPIs.** Investidores qualificados ativos · tempo médio de qualificação · match → contrato · LTV do investidor (nº de operações no
  grupo)

  ---

  ### 4.3 🔑 Agente KA / Expansão — Brand Expansion Connector

  > Nota completa: [[Agente KA / Expansão]]

  **Missão.** Manter base viva de **marcas e franquias em expansão no Brasil**, filtrar as com interesse na praça e conectar com
  investidores qualificados pelo [[Agente Farmer]].

  **Inputs**
  - Cadastro proprietário de marcas/franquias
  - Feiras e portais (ABF, Expo Franchising)
  - Inbound do time de Key Accounts
  - Briefings técnicos das marcas

  **Match técnico de ponto**

  | Dimensão | Verificação |
  |---|---|
  | Tamanho de loja | Área mínima/máxima × LUCs |
  | Vitrine | Largura e visibilidade |
  | Piso do mall | Térreo, 1º, 2º |
  | Infraestrutura | Energia, água, esgoto, exaustão, carga |
  | Coabitação | Distância de concorrentes e âncoras |
  | Exclusividades | Cláusulas contratuais |

  **Processo**
  1. Catalogação contínua com critérios técnicos e comerciais
  2. Cruzamento com **LUCs vagas ou a vagar** (janela de antecedência)
  3. Match técnico OK → solicita ao [[Agente Farmer]] candidatos compatíveis
  4. **Briefing duplo**: marca recebe candidatos · investidor recebe oportunidade

  **Integrações.** ↔ [[Agente Farmer]] · ← [[Agente Hunter]] (inovação local que vira marca em expansão) · → Execução

  **KPIs.** Marcas ativas no catálogo · match técnico → proposta · proposta → contrato · diversidade de categorias

  ---

  ### 4.4 🎪 Agente Entertainer — Experience & Events Architect

  > Nota completa: [[Agente Entertainer]]

  **Missão.** Apoiar Marketing e Mall na **ocupação contínua e qualificada** de praças de eventos e estacionamentos, transformando esses
  espaços em **drivers de fluxo, mídia e receita**.

  **Inputs**
  - Calendário de praças e estacionamentos
  - Mapeamento dos eventos mais promissores do Brasil
  - Tendências de [[WGSN]] e parceiros como [[Play - Consultoria de Eventos Infantis]]
  - Perfil de público e datas-chave do varejo
  - Histórico de fluxo e vendas associados a eventos passados

  **Processo**
  1. **Scouting** — catálogo vivo de eventos itinerantes
  2. **Ideação proprietária** — eventos sob medida com base em tendências
  3. **Montagem do calendário anual** otimizando ocupação, fluxo e sinergia com [[Programa de Benefícios]]
  4. **Simulação de impacto** — fluxo esperado, uplift de vendas, receita, custo

  **Critérios do calendário**

  | Critério | Diretriz |
  |---|---|
  | Ocupação contínua | Praça nunca vaga — meta 100% dos dias com atração |
  | Aderência ao posicionamento | Coerência com [[Alexandria]] e personas |
  | Diversidade temática | Mix entre infantil, gastronômico, cultural, lifestyle, sazonal |
  | Sinergia comercial | Cada evento amarrado a campanhas e/ou [[Programa de Benefícios]] |
  | Performance esperada | Fluxo incremental e ROI projetados |
  | Pipeline de novidade | Slots reservados para experimentação |

  **Integrações.** → [[Agente de Mídia]] (amplificação) · → [[Agente de Programa de Benefícios]] (ativações casadas) · ← [[Alexandria]]
  (tese)

  **KPIs.** % de ocupação · fluxo incremental por evento · uplift de vendas em lojas próximas · receita de locação · NPS do público

  ---

  ## 5. Camada 2 — Agentes de Execução

  Recebem o handoff do Orquestrador após o match e tocam a operação. Cada um tem nota própria para detalhamento.

  - [[Agente Financeiro]] — estrutura carência, CDU, performance e linhas de crédito ao lojista; calcula payback e sensibilidades
  - [[Agente de Obra & Implantação]] — acelera projeto, aprovações e entrega da loja
  - [[Agente de Mídia]] — plano de [[Mídia do Shopping]] por fase (abertura, ramp-up, maturidade) e amplificação das ativações do
  Entertainer
  - [[Agente de Programa de Benefícios]] — mecânicas e campanhas no [[Programa de Benefícios]] para conversão e recorrência
  - [[Agente de Performance do Lojista]] — monitora vendas, alerta desvios e sugere intervenções (mídia, benefícios, mix)

  ---

  ## 6. Fluxos de orquestração

  **Fluxo A — Lacuna de mix vira loja aberta**
  [[Agente Hunter]] detecta lacuna e candidato → Orquestrador valida com [[Alexandria]] → [[Agente KA / Expansão]] confirma viabilidade
  técnica → [[Agente Farmer]] aporta investidor compatível → Execução (Financeiro → Obra → Mídia → Benefícios → Performance)

  **Fluxo B — Investidor entra e busca oportunidade**
  Lead em [[Juntos pelo Varejo]] → [[Agente Farmer]] qualifica → Orquestrador roda match contra catálogo de [[Agente KA / Expansão]] e
  pipeline do [[Agente Hunter]] → Tese personalizada → Execução

  **Fluxo C — Marca em expansão chega ao shopping**
  [[Agente KA / Expansão]] recebe interesse → match técnico com LUCs → solicita investidores ao [[Agente Farmer]] → Execução

  **Fluxo D — Calendário de praças e amplificação**
  [[Agente Entertainer]] propõe calendário → Orquestrador valida sinergia → [[Agente de Mídia]] e [[Agente de Programa de Benefícios]]
  amplificam → [[Agente de Performance do Lojista]] mede uplift e realimenta

  ---

  ## 7. Princípios de decisão

  1. **ROI de longo prazo do empreendimento > ocupação de curto prazo** — não preencher vaga com mix errado
  2. **Explicabilidade** — toda recomendação carrega tese e premissas auditáveis
  3. **Human-in-the-loop** — decisões de contrato, mix e calendário passam pelo time
  4. **Otimização sistêmica** — avaliar impacto em vizinhos, âncoras e fluxo do shopping
  5. **Aprendizado contínuo** — cada abertura, evento e fechamento realimenta os agentes de descoberta

  ---

  ## 8. Dados, integrações e guardrails

  **Dados mínimos**
  - Cadastro de LUCs (área, fachada, condições, histórico)
  - Vendas declaradas por loja (série histórica)
  - Fluxo de pessoas (sensores / contagem)
  - CRM de prospects e lojistas
  - Catálogo de produtos financeiros do shopping
  - Inventário de mídia e calendário do programa de benefícios
  - Tese de mix e plano comercial vigente

  **Guardrails transversais**
  - **Viés do histórico** — não perpetuar mix dominante
  - **Conflito entre lojistas** — checar exclusividades e canibalização antes de propor
  - **Privacidade** — dados de venda do lojista são confidenciais; agregação obrigatória em outputs cross-loja
  - **LGPD** — coleta restrita a dados públicos
  - **Limites de exposição** — financiamento controlado por shopping e grupo econômico

  ---

  ## 9. KPIs consolidados

  **Ciclo do lojista**
  - *Time-to-contract* — prospecção → assinatura
  - *Time-to-open* — assinatura → inauguração
  - *Time-to-break-even* — abertura → ponto de equilíbrio
  - Vacância média e taxa de reposição
  - Uplift de vendas atribuído a mídia + benefícios

  **Por agente** — ver KPIs específicos em cada seção (§4 e §5)

```
- 📎 anexo
- 📎 anexo

## 🤖 Claude · 2026-06-22 11:04


```
This block is not supported on your current device yet.
```

A imagem é um framework de análise de vendas de loja chamado "The Master Equation". Você quer que eu a reconverta como uma **instrução do sistema** para um agente específico do Shopping Inteligente OS? Antes de refazer, quero entender exatamente o que você precisa:

O que você está pedindo é para transformar essa imagem ("Venda Real da Loja = Fluxo × Conversão × Ticket Médio", com as 4 árvores de composição) em uma skill ou instrução estruturada para qual agente? As opções mais naturais seriam:

**Seller / Sales Performance Engine** (Skill 12) — faz mais sentido, pois o framework fala sobre performance de loja, qualificação de equipe, grade de estoque e ruptura.

**Governance & KPI Monitor** (Skill 15) — também faz sentido se a ideia for usar esse framework como dashboard de monitoramento de lojistas.

Me confirma: qual agente você quer que receba essa instrução, e qual é o objetivo prático — o agente vai usar esse framework para diagnosticar lojistas com baixa performance? Para criar planos de ação? Para identificar qual alavanca atacar primeiro?

Com isso eu faço a instrução certeira, sem retrabalho.

**Confiança: 8/10** — entendo o framework da imagem bem, mas preciso da sua confirmação sobre o destino antes de escrever.

## 👤 Usuário · 2026-06-22 11:31

Uma intruçao para o projeto

## 🤖 Claude · 2026-06-22 11:31

 Entendido. Você quer uma instrução completa para adicionar ao projeto — não uma skill de agente específico, mas um documento que ensine o OS a usar esse framework como lógica de diagnóstico de performance de lojistas.

Deixa eu confirmar uma coisa antes de escrever:

Esse framework vai ser usado em qual momento do pipeline?
```
This block is not supported on your current device yet.
```



## 👤 Usuário · 2026-06-22 11:31

P: Quando o OS deve aplicar a Master Equation?
R: Em todos os workflows — como framework central de performance

## 🤖 Claude · 2026-06-22 11:33

 Perfeito. Vou criar o arquivo de instrução agora.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Arquivo gerado como `11_MASTER_EQUATION_PERFORMANCE_v5.md` — pronto para entrar no projeto ao lado dos outros documentos v5.

O que o documento entrega:

**Estrutura central:** a equação `Venda Real = Fluxo × Conversão × Ticket Médio` com a árvore de composição completa de cada variável, extraída diretamente da imagem.

**Aplicação por workflow:** cada um dos 3 workflows tem uma instrução específica de como e quando usar a equação — com o output esperado em cada caso.

**Regra de diagnóstico obrigatório:** 5 perguntas que o OS deve responder antes de qualquer recomendação de performance.

**Integração com o OS existente:** mapeia cada variável da equação para os scores já existentes (SRIS, Cluster Fit, Conversion Score) e para os agentes responsáveis.

Um ponto que marquei com flag: os benchmarks de conversão e ticket por cluster estão com **confiança 6/10** — são estimativas de mercado, não dados validados do seu portfólio. Recomendo substituir pelos dados reais do Sistema Bahia quando tiver acesso.
