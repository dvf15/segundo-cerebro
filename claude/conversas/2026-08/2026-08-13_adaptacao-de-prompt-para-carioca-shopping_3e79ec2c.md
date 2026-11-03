---
title: "Adaptação de prompt para Carioca Shopping"
date: 2026-08-13
updated: 2026-08-13
source: "claude-chat"
source_id: "3e79ec2c-846e-44df-862a-95e0c6829ef4"
url: "https://claude.ai/chat/3e79ec2c-846e-44df-862a-95e0c6829ef4"
project: null
messages: 2
tags: ["claude", "conversa"]
---
# Adaptação de prompt para Carioca Shopping

> **Resumo:** **Conversation Overview**

The person is working on a Shopping Inteligente project — an AI agent system for shopping mall management — and requested that Claude adapt and improve an existing prompt for a specific Brazilian shopping mall asset, Carioca Shopping (located in Vila da Penha/Vicente de Carvalho, Rio de Janeiro). The agent being configured is called ALAVANCADOR / Retail Financial Engine, whose purpose is to identify financial solutions that reduce barriers for retailers looking to open or operate stores in the mall, converting opportunities that would otherwise be lost due to capital constraints.

The person provided a base prompt with a product catalog (covering construction financing, working capital, receivables anticipation, lease guarantees, insurance, team benefits, and payment systems), a critical rule against executing any product without explicit user confirmation, and a structured output format. They asked Claude to adapt this for Carioca Shopping specifically and to improve the overall prompt quality.

Claude produced a significantly enhanced Version 2.0 prompt. Key improvements included: grounding the prompt with verified factual data about the asset (ABL of 33,918 m², approximately 224 stores, ~92.6% occupancy, classes B and C public, approximately 1 million monthly visitors, partial stake sold to a real estate investment fund in January 2025); adding a five-step mandatory workflow with discovery, diagnosis, suitability assessment, structuring, and double-confirmation stages; defining five retailer profiles (A through E) calibrated to the regional operator reality of the area; expanding guardrails to prohibit invented numbers, prevent regulatory boundary violations, and automatically reject structures that transfer credit risk to the mall operator; adding confidence scoring, premise documentation, and data gap flagging to all outputs; and mapping integration handoffs to other agents in the broader system (Hunter, Street Converter, KA, Farmer, Builder, Seller, and a Deal Conversion governance committee). Claude also noted a transparency caveat that the occupancy figure came from a secondary analysis source rather than official operator data, and assigned an overall confidence score of 7/10 to the output. The conversation used domain-specific terminology throughout including ABL (Área Bruta Locável), CDU (Cessão de Direito de Uso), LUC (Loja de Uso Comum), CAPEX, carência, and suitability in the financial underwriting sense.

**Mensagens:** 2 · **Criada:** 2026-08-13 · **Atualizada:** 2026-08-13

---

## 👤 Usuário · 2026-08-13 01:56

Adeque esse prompt para o Carioca Shopping e aprimore o prompt

Você é o ALAVANCADOR / RETAIL FINANCIAL ENGINE do Shopping Inteligente. Missão: identificar e recomendar soluções financeiras que reduzam as barreiras de abertura e operação de lojistas, convertendo oportunidades que seriam perdidas por limitação de capital.### SOLUÇÕES DISPONÍVEIS (catálogo)Obras e adequação:- Financiamento de obra (capital para construção/reforma do ponto)- Antecipação de receitas do lojista para financiar obra Capital de operação:- Capital de giro (para estoque inicial, equipe, abertura)- Antecipação de recebíveis (para lojistas já em operação)- Crédito para reposição de estoque. Garantias locatícias:- Garantia locatícia alternativa ao fiador (seguro-fiança, carta fiança,  título de capitalização, depósito caução)Seguros:- Seguro de obra (cobre riscos durante a construção)- Seguro de operação (incêndio, roubo, responsabilidade civil)- Seguro de vida para o empresário- Plano de saúde coletivo para equipe Benefícios para equipe:- Vale alimentação / vale refeição- Conta PJ para o negócio Pagamentos:- Sistema de adquirência (maquininha, PIX, gateway online)- Integração com programa de benefícios do shopping ### REGRA CRÍTICA Nunca contratar ou acionar nenhum produto ou serviço sem confirmação explícita do usuário. Apenas recomendar e estruturar a proposta. ### SAÍDA DO AGENTE Oportunidade | Perfil do operador | Necessidade financeira identificada |Solução recomendada | Parceiro sugerido (apenas recomendar) |Custo estimado | Risco | Benefício para o lojista |Impacto para o shopping (vacância resolvida / renovação / nova abertura) |Próxima ação | Dono | Prazo

## 🤖 Claude · 2026-08-13 01:58


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

O que mudei além de trocar o nome do shopping:

- **Contexto do ativo com dados verificados** (ABL 33.918 m², ~224 lojas, ocupação 92,6%, classes B/C, ~1 mi visitantes/mês, 20% vendidos ao XPML11) — e um bloco explícito de `[A CONFIRMAR]` para os números internos que eu não tenho.
- **Perfis de operador A–E** calibrados para a praça (lojista de rua da Vicente de Carvalho/Penha/Irajá, franqueado regional, lojista em dificuldade), porque o gargalo real ali é subcapitalização, não demanda.
- **Fluxo obrigatório em 5 etapas** com descoberta e teste de *suitability* antes de recomendar — o prompt original pulava direto para a solução.
- **Confirmação dupla** em vez de simples, alinhado à sua regra.
- **Guardrails novos**: proibição de números inventados, sem promessa de aprovação, sinalização quando a estrutura exigir habilitação regulada (correspondente bancário/corretagem), e reprovação automática se a solução transferir risco de crédito ao empreendedor.
- **Saída ampliada** com métrica de sucesso, premissas, lacunas, fontes e nota de confiança.
- **Handoffs mapeados** para Hunter, Street Converter, KA, Farmer, Builder, Seller e o comitê de Deal Conversion.

Uma ressalva honesta: os dados operacionais vieram de um relatório de análise sobre a aquisição do XPML11 (jan/2025), não de fonte oficial da Allos — a ocupação de 92,6% pode estar defasada. Se você tiver o número atual, vale substituir.

**Fontes:** [Allos – Carioca Shopping](https://allos.com.br/en/shopping/carioca-shopping-en/) (inauguração 2001, torre comercial); [Nord Investimentos](https://www.nordinvestimentos.com.br/blog/xpml11-novas-aquisicoes-shoppings/) (ABL, lojas, ocupação, público, fluxo); [Exame](https://exame.com/invest/mercados/com-foco-em-otimizacao-de-capital-allos-faz-vende-fatias-de-shoppings-no-rio-e-em-sao-paulo/) e [Seu Dinheiro](https://www.seudinheiro.com/2024/empresas/allos-alos3-fecha-acordo-para-venda-de-fatia-dos-shoppings-carioca-tijuca-e-plaza-sul-e-vai-embolsar-r-393-milhoes-mcss/) (venda de 20%).

**Confiança: 7/10.** Alta na estrutura do prompt; média nos dados do ativo, pela fonte secundária e pela defasagem de ~18 meses.
