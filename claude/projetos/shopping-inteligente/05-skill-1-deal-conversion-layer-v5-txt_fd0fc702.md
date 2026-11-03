---
title: "05_SKILL_1_DEAL_CONVERSION_LAYER_v5.txt"
date: 2026-05-11
source: "claude-project-doc"
source_id: "fd0fc702-4511-4ae0-bfa0-48b06d2529b7"
project: "Shopping Inteligente"
tags: ["claude", "projeto", "conhecimento"]
---
# 05_SKILL_1_DEAL_CONVERSION_LAYER_v5.txt

# SKILL 1 — DEAL CONVERSION LAYER v5
# The Commercial Cockpit

## Missão
Transformar inteligência em execução comercial rastreável. Nenhum lead deve ficar sem estágio, dono, próxima ação e prazo.

## Estágios do pipeline

1. Lead
2. Qualified Lead
3. Contacted
4. Meeting Scheduled
5. Meeting Done
6. Proposal
7. Technical Feasibility
8. Investor Match
9. Contract Negotiation
10. Contract Signed
11. Construction / Obra
12. Opening
13. Ramp-up
14. Seller Plan Active
15. Performance Review
16. Lost / Parked

## Campos obrigatórios

- oportunidade_id
- shopping
- cluster
- batalha
- tipo: marca / investidor / loja / evento / seller
- nome
- categoria
- loja_relacionada
- investidor_relacionado
- marca_relacionada
- estágio
- dono
- próxima_ação
- prazo
- blocker
- probabilidade_fechamento
- impacto_financeiro_estimado
- cluster_fit_score
- conversion_score
- apoio_necessário
- critério_de_kill
- última_atualização
- próxima_revisão

## Regras de conversão

- Todo lead sem dono é risco.
- Toda oportunidade sem próxima ação em até 7 dias deve ser rebaixada.
- Toda proposta sem blocker claro deve ser cobrada.
- Toda oportunidade com Cluster Fit abaixo de 40 deve ser pausada, salvo emergência de vacância.
- Toda oportunidade estratégica com Cluster Fit acima de 85 deve ter sponsor executivo.

## Kill criteria

Pausar ou matar se:
- não atende cluster;
- não tem capacidade financeira;
- não atende requisito técnico;
- não responde após 3 tentativas qualificadas;
- o aluguel viável não fecha conta;
- obra inviabiliza abertura;
- risco reputacional alto;
- não há investidor compatível;
- conflito com exclusividade ou restrição contratual.

## Saída padrão

Oportunidade | Estágio | Dono | Próxima ação | Prazo | Blocker | Probabilidade | Impacto financeiro | Cluster Fit | Apoio necessário | Decisão

