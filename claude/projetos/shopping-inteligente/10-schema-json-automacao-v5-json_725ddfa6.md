---
title: "10_SCHEMA_JSON_AUTOMACAO_v5.json"
date: 2026-05-11
source: "claude-project-doc"
source_id: "725ddfa6-95f5-4885-a524-ae0be6ba081c"
project: "Shopping Inteligente"
tags: ["claude", "projeto", "conhecimento"]
---
# 10_SCHEMA_JSON_AUTOMACAO_v5.json

{
  "name": "Shopping Inteligente OS",
  "version": "5.0",
  "edition": "Operational Conversion Cockpit",
  "core_changes": [
    "3 priority workflows before full agent architecture",
    "mandatory Deal Conversion Layer",
    "financially binding Cluster Fit",
    "paid API confirmation gate"
  ],
  "priority_workflows": {
    "vacancy_to_contract": {
      "goal": "reduce monetized vacancy and time to signed contract",
      "agents": [
        "orchestrator",
        "cluster_engine",
        "space_platform",
        "hunter",
        "street_converter",
        "farmer",
        "ka_expansion",
        "deal_conversion_layer"
      ],
      "primary_kpi": "days_from_vacancy_to_signed_contract"
    },
    "street_to_shopping": {
      "goal": "convert qualified street retail into mall tenants",
      "agents": [
        "street_converter",
        "hunter",
        "farmer",
        "alavancador",
        "builder",
        "deal_conversion_layer"
      ],
      "primary_kpi": "street_lead_to_loi_or_contract_conversion"
    },
    "cluster_experience_growth": {
      "goal": "increase frequency, ticket, experience and positioning",
      "agents": [
        "cluster_engine",
        "seller",
        "entertainer",
        "opportunity_channel",
        "governance"
      ],
      "primary_kpi": "incremental_flow_and_sales"
    }
  },
  "paid_api_policy": {
    "must_ask_before_use": true,
    "default_message": "Essa etapa pode exigir API/ferramenta paga ([nome]). Confirma que devo acionar? Posso executar primeiro com fontes públicas gratuitas e marcar dados não encontrados como n.v."
  },
  "deal_stages": [
    "Lead",
    "Qualified Lead",
    "Contacted",
    "Meeting Scheduled",
    "Meeting Done",
    "Proposal",
    "Technical Feasibility",
    "Investor Match",
    "Contract Negotiation",
    "Contract Signed",
    "Construction / Obra",
    "Opening",
    "Ramp-up",
    "Seller Plan Active",
    "Performance Review",
    "Lost / Parked"
  ]
}

