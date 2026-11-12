# 02 — Metodologia (Shopping Inteligente OS v5)

## Contexto

Este sistema implementa o **Workflow 1 — Vacancy-to-Contract Sprint** do framework Shopping Inteligente OS v5, aplicado ao Plaza Shopping Niterói.

## Tese estratégica

O shopping deve operar como **plataforma inteligente de crescimento** para varejistas, marcas, investidores, franqueados, anunciantes e operadores de eventos.

O maior mercado endereçável está no **varejo qualificado fora dos shoppings**. A barreira não é apenas demanda — é burocracia, custo, lentidão, fiança, baixa transparência, falta de dados técnicos.

Portanto: reduzir fricções e capturar a oportunidade do varejo de rua, marcas em expansão, investidores locais e lojistas atuais com potencial de crescimento.

---

## Cluster do Plaza Niterói

**Entretenimento.** Batalhas (em ordem):
1. Entretenimento adulto
2. Gastronomia (foco em autenticidade, não cadeias)
3. Lojas (foco em experiencial)

**Implicação de underwriting:**
- Priorizar operações que criem motivo de visita e permanência
- Dar crédito multiplicado a operações multi-batalha (gastro + entret + lojas)
- Penalizar mix passivo e genérico

---

## Cluster Fit Score (financeiramente vinculante)

| Score | Decisão |
|---|---|
| 0–40 | Baixo fit — não priorizar, salvo emergência de vacância |
| 41–70 | Fit aceitável — priorizar apenas se pressão de ocupação ou ganho financeiro claro |
| 71–85 | Fit forte — priorizar |
| 86–100 | Fit estratégico — sponsor executivo obrigatório |

Toda recomendação traduz fit em pelo menos uma métrica: frequência, ticket, vendas/m², aluguel potencial, mídia/patrocínio, PB/CRM, NPS, vacância monetizada, posicionamento.

---

## Regra de prospecção

Para todas as operações prospectadas:
- Liste apenas marcas que **NÃO estejam presentes** no shopping (loja ou quiosque)
- Priorize operações que tenham presença em raio entre 2km e 50km
- Não duplicar categoria saturada

---

## Workflow 1 — Vacancy-to-Contract Sprint

**Objetivo:** reduzir vacância monetizada e tempo de reposição.

**Agentes:** Orquestrador Central, Cluster Positioning Engine, Plataforma de Espaços, Hunter, Street Converter, Farmer, KA Expansion, Deal Conversion Layer.

**KPI principal:** dias da vacância até contrato assinado.

**Etapas:**
1. Classificar cluster e batalha da loja
2. Estruturar ficha digital do espaço
3. Definir perfil ideal de ocupante
4. Buscar marcas e operadores
5. Buscar investidores
6. Fazer match marca × investidor × loja
7. Validar requisitos técnicos
8. Gerar abordagem
9. Registrar estágio no Deal Conversion Layer (este sistema)
10. Criar plano semanal de conversão

---

## Deal Conversion Layer

Estágios padrão:

```
Lead
  ↓
Qualified Lead
  ↓
Contacted
  ↓
Meeting Scheduled
  ↓
Meeting Done
  ↓
Proposal
  ↓
Technical Feasibility
  ↓
Investor Match
  ↓
Contract Negotiation
  ↓
Contract Signed  ←  meta principal
  ↓
Construction / Obra
  ↓
Opening
  ↓
Ramp-up
  ↓
Performance Review

(qualquer estágio → Lost / Parked)
```

Para cada oportunidade, registrar:
- Dono
- Próxima ação
- Prazo
- Blocker
- Probabilidade de fechamento
- Impacto financeiro estimado
- Batalha do cluster
- Apoio necessário
- Critério de matar ou pausar

---

## Mandamentos de Zé Roberto Levy aplicados

Diretrizes comerciais que estruturam o uso do sistema:

1. **Gastar sola** (Mand. 1): prospecção ativa de rua é registrada como `Street Converter` no campo Dono
2. **Monitorar cluster** (Mand. 3): comparativos com shoppings SP/RJ do mesmo cluster
3. **Acompanhar capitais próximas** (Mand. 4): RJ Zona Sul + Tijuca como raio expandido
4. **Base Allos** (Mand. 5): cruzar mix de shoppings vizinhos para identificar marcas em expansão
5. **Prospecção de rua** (Mand. 6): vias principais de Icaraí, Centro, São Francisco
6. **Multimarcas como vetor** (Mand. 7): trazer multimarcas que vendam marcas ainda não presentes
7. **Multifranqueado** (Mand. 8): lote de 28 caixas pequenas para 1-2 multifranqueados RJ
8. **Almoços/cafés com lojistas** (Mand. 9): "aquário em casa" — pescar internamente é mais fácil
9. **Reunião como peça-chave** (Mand. 10): meta de 10 reuniões semanais
10. **Acompanhar status** (Mand. 11): este sistema é o instrumento

---

## Política de API paga

**Nunca acionar sem confirmação explícita.**

Quando uma análise precisar de SerpApi, DataForSEO, Similarweb, Semrush, Apollo, Hunter.io, Clearbit ou similares, perguntar:

> "Essa etapa pode exigir API/ferramenta paga ([nome]). Confirma que devo acionar? Posso executar primeiro com fontes públicas gratuitas e marcar dados não encontrados como n.v."

Padrão atual: **nenhuma API paga acionada** na construção deste sistema.

---

## Saída padrão obrigatória

Toda execução do Workflow deve trazer:
1. Resumo executivo
2. Workflow usado
3. Cluster e batalhas aplicadas
4. Agentes acionados
5. Diagnóstico econômico
6. Oportunidades
7. Deal Conversion Table (esta planilha/sistema)
8. Priorização: impacto × velocidade × cluster fit
9. Plano 30/60/90 dias
10. KPIs
11. Riscos e blockers
12. Próxima ação por dono

---

## Premissas de underwriting comercial

- Dados fornecidos pelo usuário têm precedência
- Fontes públicas gratuitas são consultadas antes
- APIs pagas só com confirmação
- Dados ausentes marcados como `n.v.` (não verificado)
- Cluster Fit traduzido em impacto financeiro mensurável
