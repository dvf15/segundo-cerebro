---
title: "principles-and-ways-of-working"
date: 2026-09-28
source: "claude-memory"
source_id: "/projects/019daf89-59d9-7572-af98-2e7d8c2d5137/principles-and-ways-of-working.md"
description: "Operating principles for the Shopping Inteligente OS (structure-don't-refuse, outcome metrics, confidence flagging) plus PT-BR working style, Obsidian, and the tool stack"
tags: ["claude", "memoria", "memoria/projects"]
---
## Key learnings & principles

- [stated] Structure, don't refuse: high-risk tenants (high ESI, opening delays) are approved with stronger guarantees and performance clauses rather than rejected — commercial acquisition goals and credit risk are resolved through deal structure, not gatekeeping.
- [stated] Outcome metrics over input metrics: the Allos strategic directives failure confirmed that plans built entirely on activity metrics without KPIs, baselines, or budgets cannot be governed or optimized.
- [stated] Conversão is systematically underinvested: across strategic planning and commercial operations, Fluxo dominates attention while Conversão — the middle variable of the Master Equation — has the least instrumentation.
- [stated] Modular, self-correcting architecture: skills are designed to feed each other; execution results explicitly inform skill revisions (SKILL 17 v5.1 emerging from its own first execution is the clearest example).
- [stated] Confidence flagging discipline: numerical thresholds, benchmarks, and cluster values are consistently flagged at 6–7/10 confidence until validated against Sistema Bahia or equivalent data sources — Claude never guesses on uncertain facts or triggers paid APIs without explicit confirmation.
- [stated] Underwriting rules require formal validation: assumptions embedded in the OS (e.g., cluster placements, scoring cutoffs) must be formally validated before they function as decision rules, not just analytical defaults.

## Approach & patterns

- [stated] Works in Brazilian Portuguese throughout; all deliverables are in PT-BR.
- [stated] Prefers modular v5 format for all skill documents: mission, immutable references, structured tests, scoring system, failure taxonomy, integration points, output template.
- [stated] Uses targeted string replacements when updating skill files rather than full rewrites — preserves structure while layering new frameworks.
- [stated] Moves fast toward production but responds well to concrete redirects with actionable next steps (e.g., phased prototype → production approach).
- [stated] Organizes knowledge in Obsidian with a structured vault (`00-Inbox` through `99-Templates`) and a daily log habit.
- [stated] Validates OS outputs against Sistema Bahia as the canonical data source before treating thresholds as fixed.

## Tools & resources

- [stated] Claude (primary copilot and OS execution engine), ChatGPT (cross-validation).
- [stated] Claude Code (CLI agent for direct file editing).
- [stated] Cursor (AI-powered code editor).
- [stated] Lovable, v0, Bolt (prototyping and component generation).
- [stated] n8n (workflow orchestration, preferred over Make).
- [stated] Supabase (PostgreSQL database, preferred over Airtable) — São Paulo region.
- [stated] Anthropic API: model `claude-sonnet-4-6-20250929`, endpoint with `anthropic-dangerous-direct-browser-access` header, web search tool `web_search_20250305`.
- [stated] Sistema Bahia (internal Allos benchmarking and historical data platform).
- [stated] Cowork (plugin creation tool for OS deployment).
- [stated] GitHub (version control).
- [stated] Paid analytics tools under consideration for DNVB research: Zeeng, HypeAuditor, Stilingue.
