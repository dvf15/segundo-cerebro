---
title: "Instalação de plugins de análise financeira"
date: 2026-05-20
updated: 2026-05-20
source: "claude-chat"
source_id: "50ed264d-d363-432e-976b-c95a898987f3"
url: "https://claude.ai/chat/50ed264d-d363-432e-976b-c95a898987f3"
project: null
messages: 2
generated_files: 0
tags: ["claude", "conversa"]
---
# Instalação de plugins de análise financeira

> **Resumo:** **Conversation Overview** The person asked Claude for instructions on how to install four financial services plugins: Equity Research, Earnings Reviewer, Financial Analysis, and Market Researcher. Claude conducted a web search and provided a structured installation guide in Portuguese, explaining that these plugins are part of Anthropic's official Financial Services marketplace and require a paid Claude subscription (either Cowork or Claude Code). Claude outlined two installation methods: a visual approach through Claude Cowork and a terminal-based approach via Claude Code, emphasizing that the Financial Analysis plugin must be installed first as the core dependency for the others. Specific CLI commands were provided for the Claude Code method. Claude also flagged uncertainty about the exact CLI slug for the Earnings Reviewer plugin, noting it could not be confirmed in official sources and recommending the person verify it in the marketplace before running the command. Official sources cited included Anthropic's support documentation, the GitHub repository, and the product announcement page. Claude assigned a confidence rating of 7/10 to the response, citing the unconfirmed Earnings Reviewer slug as the primary gap.

**Mensagens:** 2 · **Criada:** 2026-05-20 · **Atualizada:** 2026-05-20

---

## 👤 Usuário · 2026-05-20 09:17

Me mostre como posso instalar os plugins: 

1- Equity Research
2 — Earnings Reviewer
3 — Financial Analysis
4 — Market Researcher

## 🤖 Claude · 2026-05-20 09:18

  The user is asking about installing plugins with financial names, which could be Claude skills, ChatGPT plugins, or tools for financial software like Bloomberg or Excel. Given their background with retail analytics and Obsidian, I need to clarify what platform they're trying to add these to before I can give them installation steps.
```
This block is not supported on your current device yet.
```

 I'm getting a clearer sense of the landscape here—these financial-services plugins are part of Anthropic's marketplace ecosystem and can be deployed through Claude Cowork or Claude Code, with Financial Analysis serving as the foundational plugin. Let me pull up the official documentation to nail down the exact installation process. I've gathered enough information to give a clear answer. Let me structure this in Portuguese since that's how the user is communicating. I'll cover the three key points: what these plugins are, the installation order, and the two methods to install them, making sure to cite the official sources.

Now I'm working through the installation commands for Claude Code, describing how to add the marketplace and then install each plugin in the correct sequence, starting with the core Financial Analysis plugin before the others.

Looking at the actual GitHub repository list, I can see the available plugins more clearly — there's pitch-agent, gl-reconciler, market-researcher, investment-banking, and equity-research. I notice that "Earnings Reviewer" is mentioned in the article as one of the four agents, but I'm not finding it explicitly listed in the GitHub readme the same way the others are, so I should flag that uncertainty about the exact CLI name for that particular plugin.

I also need to mention the prerequisites — users will need a paid Claude subscription and access to either Cowork or Claude Code to use these agents. Given the user's preferences for a concise, structured response and the fact they asked about four specific items, I'll organize this as a how-to with clear steps, keeping it mobile-friendly while still being thorough. I'll include a confidence rating at the end as they requested.Esses 4 plugins fazem parte do **marketplace oficial de Financial Services da Anthropic**, lançado em fevereiro de 2026. Eles rodam no **Claude Cowork** ou no **Claude Code** (planos pagos).

## Ordem importante

Instale o **Financial Analysis primeiro** — é o plugin core que contém os conectores MCP compartilhados (Daloopa, Morningstar, S&P Global, FactSet, LSEG, PitchBook etc.) usados pelos outros plugins. Os demais dependem dele.

## Método 1 — Claude Cowork (mais simples)

A partir do marketplace de plugins, navegue pelos plugins de financial services disponíveis. Instale o Financial Analysis primeiro — é o core que provê tools e conectores compartilhados. Depois instale os demais conforme sua necessidade. Uma vez instalados, os plugins ativam automaticamente — skills disparam quando relevantes ou podem ser invocadas via "/" ou no botão "+" durante a sessão.

## Método 2 — Claude Code (via terminal)

Comandos oficiais do repositório anthropics/financial-services:

```bash
# 1. Adicionar o marketplace
claude plugin marketplace add anthropics/financial-services

# 2. Instalar o core primeiro (obrigatório)
claude plugin install financial-analysis@claude-for-financial-services

# 3. Instalar os demais
claude plugin install equity-research@claude-for-financial-services
claude plugin install market-researcher@claude-for-financial-services
```

## ⚠️ Ponto onde não tenho certeza

**Earnings Reviewer**: não consegui confirmar o slug CLI exato deste plugin nas fontes oficiais. O README do repositório lista explicitamente pitch-agent, gl-reconciler e market-researcher como exemplos de "named agents", mas não nomeia o earnings-reviewer. O nome provável seria `earnings-reviewer@claude-for-financial-services`, mas recomendo confirmar no marketplace antes de rodar. No Cowork visual isso não é problema — ele aparece pelo nome amigável.

## Pré-requisitos

- Plano pago do Claude (Cowork ou Claude Code)
- Alguns conectores de dados (FactSet, S&P Global, etc.) podem exigir assinatura/API key separada do provedor

## Fontes verificadas

- Documentação oficial Anthropic: https://support.claude.com/en/articles/13851150-install-financial-services-plugins-for-cowork
- Repositório oficial: https://github.com/anthropics/financial-services
- Anúncio Anthropic: https://www.anthropic.com/news/finance-agents

---

**Confiança: 7/10**

Pontos fortes: instalação geral, ordem (core primeiro) e comandos do Claude Code estão em fontes oficiais da Anthropic.
Ponto fraco (e por isso não é 9-10): não confirmei o slug CLI exato do Earnings Reviewer em fonte oficial. Para os outros três tenho confirmação direta no GitHub da Anthropic.
