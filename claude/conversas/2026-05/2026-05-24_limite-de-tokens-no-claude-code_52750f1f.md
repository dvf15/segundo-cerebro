---
title: "Limite de tokens no Claude Code"
date: 2026-05-24
updated: 2026-05-24
source: "claude-chat"
source_id: "52750f1f-f57e-4454-8c41-79aac5fbd036"
url: "https://claude.ai/chat/52750f1f-f57e-4454-8c41-79aac5fbd036"
project: null
messages: 6
tags: ["claude", "conversa"]
---
# Limite de tokens no Claude Code

> **Resumo:** **Conversation Overview**

The person asked about token limits in Claude Code, specifically in the context of their subscription plan. The conversation covered two distinct aspects of limits: the context window per session (how much fits in the model's working memory) and usage caps (how much can be consumed before hitting a rate limit). The person is on the Max 5x plan at the $100/month tier.

Claude explained that the context window supports up to 1 million tokens on paid plans for newer models (with usage credits required for some), while the default is 200K tokens. For usage caps, Claude clarified that Anthropic does not publish exact token or hour counts publicly — the Max 5x plan is officially described only as "5× the Pro limit per session," with a rolling 5-hour window and two weekly limits (one general across all models, one specific to Sonnet). Claude noted a recent platform update that doubled per-session limits and removed peak-hour throttling, though weekly limits remained unchanged. Third-party community estimates of roughly 140–280 hours of Sonnet or 22–52 hours of Opus per week on Max 5x were shared but explicitly flagged as unofficial and potentially outdated.

The person was directed to use the `/usage` command in Claude Code as the most reliable way to check their actual remaining quota, along with `/status` and `/cost`. Options for when limits are reached were also outlined: waiting for reset, switching to a lighter model, enabling usage credits for pay-as-you-go continuation, or upgrading to Max 20x. Claude consistently noted confidence levels and distinguished between official documentation and third-party estimates throughout the conversation.

**Mensagens:** 6 · **Criada:** 2026-05-24 · **Atualizada:** 2026-05-24

---

## 👤 Usuário · 2026-05-24 00:51

Qual o limite de tokens que tenho no claude code?

## 🤖 Claude · 2026-05-24 00:52

  The user is asking about token limits in Claude Code, which is a product question, so I should check the product documentation to find accurate information.
```
This block is not supported on your current device yet.
```

 I need to look up the token limits for Claude Code to give the user accurate information about context windows and usage restrictions.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

 The question could be asking about either the context window or usage limits, so I should check Anthropic's official documentation for Claude Code to give an accurate answer.
```
This block is not supported on your current device yet.
```

 A pergunta é ambígua — o usuário pode estar perguntando sobre o tamanho da janela de contexto por conversa ou sobre limites de uso conforme o plano contratado. Vou verificar os limites específicos para cada plano (Pro, Max, etc.) para dar uma resposta completa.
```
This block is not supported on your current device yet.
```

 The user is asking about token limits in Claude Code, but they could mean either the context window per conversation or the overall usage limits tied to their plan. I should clarify both since the question is ambiguous, keeping it brief for mobile.

I know the context window is 200K tokens standard, expanding to 1M with paid plans on newer models like Sonnet 4.6 and Opus 4.7 (though credits might be needed in some cases). There are also usage caps—a 5-hour rolling window plus weekly limits depending on the plan. The `/usage` command can show them their current consumption.

I'm uncertain about the exact token allocations per plan since Anthropic doesn't publish precise numbers, and I don't know which plan Daniel has. I should mention this uncertainty and suggest checking official sources or the `/usage` command for accurate info.Sua pergunta tem dois sentidos possíveis, e Claude Code trata os dois separadamente:

**1. Janela de contexto (por sessão)**
É quanto cabe na "memória de trabalho" do modelo em uma conversa. Com Pro, Max, Team ou Enterprise, o Opus 4.7 suporta janela de 1M de tokens no Claude Code. Usuários Pro precisam ativar usage credits para acessar Opus 4.7. O Sonnet 4.6 também suporta 1M para todos os planos pagos, mas também exige usage credits (exceto Enterprise usage-based). Sem isso, o padrão é 200K.

**2. Limite de uso (cota ao longo do tempo)**
A Anthropic **não publica** o número exato de tokens por plano. O que está documentado é:
- Pro: limite por sessão a cada 5 horas + limite semanal que aplica a todos os modelos, resetando 7 dias após o início da sessão.
- Max 5x: 5x mais que o Pro por sessão. Max 20x: 20x mais que o Pro. Ambos têm dois limites semanais (um geral e um só para Sonnet).
- No Pro e Max, Claude e Claude Code compartilham o mesmo pool de uso.

**Como ver o seu agora mesmo:**
- `/usage` dentro do Claude Code → mostra % da sessão, % semanal e créditos
- `/cost` → gasto da sessão (se for API key)
- `/context` → o que está carregado na janela

Sobre os números "~44k tokens para Pro, ~88k para Max5, ~220k para Max20" que circulam: **não são oficiais**, vêm de ferramentas de terceiros que estimam a partir dos logs locais. Tratar como referência, não como verdade.

Fontes oficiais:
- [Models, usage, and limits in Claude Code](https://support.claude.com/en/articles/14552983-models-usage-and-limits-in-claude-code)
- [Context window em planos pagos](https://support.claude.com/en/articles/8606394-how-large-is-the-context-window-on-paid-claude-plans)
- [Claude Code com Pro/Max](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan)

Se me disser qual o seu plano, consigo ser mais específico — embora os tokens exatos só apareçam no `/usage` da sua conta.

**Confiança: 8/10.** Estou seguro sobre janela de contexto e sobre a estrutura (5h + semanal). O ponto fraco é que a Anthropic deliberadamente não divulga tokens exatos por plano, então não posso te dar um número definitivo sem você rodar `/usage`.

## 👤 Usuário · 2026-05-24 00:52

Qual o limite eu tenho para gastar no claude code no meu plano atual

## 🤖 Claude · 2026-05-24 00:52

  I need to figure out what plan they're on to answer their question about spending limits on Claude Code. Let me look back through our conversation history to see if they've mentioned it before, though I should be upfront that I can't access their account details directly.
```
This block is not supported on your current device yet.
```

 I don't actually have visibility into Daniel's subscription tier—he could be on Pro, Max 5x, Max 20x, or something else entirely. The most straightforward approach is to ask him directly, have him check his usage with the `/usage` command in Claude Code, or look it up in Settings > Usage on claude.ai.Não consigo ver isso daqui — não tenho acesso à sua conta nem ao seu plano atual. Por privacidade, a Anthropic não expõe esses dados de assinatura para o Claude.

**Como descobrir agora (3 caminhos rápidos):**

1. **No próprio Claude Code:** rode `/usage` no terminal. Mostra a porcentagem da sessão, a porcentagem semanal e o saldo de usage credits, tudo em uma só tela.

2. **No claude.ai:** Settings > Usage — mostra barras de progresso do limite de 5 horas e dos limites semanais, mais o reset do limite semanal (Opus e demais modelos) e o consumo de usage credits.

3. **Para ver o plano em si:** Settings > Billing no claude.ai.

**Para eu te ajudar com mais precisão, preciso de duas informações:**
```
This block is not supported on your current device yet.
```

Assim que você responder, te dou o número mais próximo da realidade que a documentação oficial permite — lembrando que, como falei na resposta anterior, **a Anthropic não divulga tokens exatos por plano**, então o valor definitivo só sai mesmo no `/usage`.

**Confiança: 9/10.** Estou seguro de que (a) não tenho acesso à sua conta e (b) os caminhos para você ver o seu limite são esses. O 1 ponto a menos é porque interfaces mudam — se o caminho do menu estiver levemente diferente no app que você usa, me avise.

## 👤 Usuário · 2026-05-24 01:29

P: Qual é o seu plano atual?
R: Max 5x ($100/mês)

P: Você quer saber o limite em quê?
R: Quanto posso usar antes de travar

## 🤖 Claude · 2026-05-24 01:30

  I need to find the current usage limits for the Max 5x plan specifically in Claude Code, including weekly caps and session durations, since the user mentioned limits were recently doubled.
```
This block is not supported on your current device yet.
```

 I'm checking the official Anthropic documentation to get accurate details about Max plan features and Claude Code availability across different subscription tiers.
```
This block is not supported on your current device yet.
```

 I'm pulling together the key details about Max 5x for Daniel—the official specs are that it provides five times the usage of Pro per session, with shared limits across Claude and Claude Code, a five-hour window per session, and a weekly cap of two sessions total (one general limit across all models plus one exclusive to Sonnet).

Anthropic doesn't publicly release exact token or hour counts, but third-party estimates suggest Pro users get around 40-80 hours of Claude Code weekly, which would scale to roughly 200-400 hours of Sonnet or 22-52 hours of Opus for Max 5x subscribers—though some sources cite different ranges like 140-280 hours for Sonnet. The May 2026 announcement that reset and doubled the five-hour limits while removing peak throttling means older estimates might be outdated.

I should be clear that Anthropic keeps these numbers proprietary, third-party figures are educated guesses at best, and the most reliable way for Daniel to check his actual usage is through the `/usage` command in Claude Code. I'll structure the answer in Portuguese, keep it mobile-friendly, and mark confidence levels with sources so he knows what's official versus estimated.**Resposta curta: a Anthropic não divulga o número exato em tokens ou horas. O Max 5x é descrito apenas como "5× o limite do Pro por sessão", sem cifra absoluta.**

**O que é oficial sobre o Max 5x:**

- Max 5x oferece 5× mais uso por sessão que o Pro. Tem dois limites semanais: um que se aplica a todos os modelos e outro só para Sonnet.
- Janela rolante de 5 horas a partir da primeira mensagem
- Os limites são compartilhados entre Claude (web/app) e Claude Code — tudo conta no mesmo balde.
- Anúncio recente: os limites por janela de 5 horas foram dobrados para Pro, Max, Team e Enterprise, e o throttling de horário de pico foi removido. Os limites semanais não mudaram.

**Estimativas de terceiros (não oficiais, trate com cautela):**

Não há fonte oficial Anthropic com horas/tokens exatos, mas blogs de comunidade estimam, com base em logs de usuários, algo como **140–280 horas de Sonnet por semana** e **22–52 horas de Opus por semana** no Max 5x. Esses números variam bruscamente conforme: tamanho dos arquivos lidos, uso de MCP servers, profundidade da janela de contexto e modelo escolhido. Por isso **não dá para te dizer "você tem X tokens"** com honestidade.

**O único número confiável é o da sua conta:**

Rode no Claude Code:
- `/usage` → % consumido da sessão 5h + % do limite semanal (Sonnet e geral)
- `/status` → quanto resta na sua alocação atual
- `/cost` → custo equivalente em dólares (referência API)

**Se travar:**
1. Esperar reset (5h ou semanal)
2. Trocar para Sonnet/Haiku se estava no Opus
3. Ativar usage credits para continuar usando em modo pay-as-you-go (cobrado nas tarifas padrão da API)
4. Upgrade para Max 20x

**Confiança: 7/10.** Tenho 9/10 sobre a estrutura (5h + semanal, "5× Pro", compartilhado entre produtos, comandos para conferir) — isso é documentação oficial. Tenho 4/10 sobre as horas estimadas — são números de terceiros, podem estar desatualizados pelas mudanças recentes de maio/2026. Por isso a média.

**Fontes:**
- Oficial: [Use Claude Code com Pro ou Max](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan)
- Oficial: [O que é o plano Max](https://support.claude.com/en/articles/11049741-what-is-the-max-plan)
- Oficial: [Modelos, uso e limites no Claude Code](https://support.claude.com/en/articles/14552983-models-usage-and-limits-in-claude-code)
- Terceiros (estimativas): [ClaudeLog](https://claudelog.com/claude-code-limits/), [TrueFoundry](https://www.truefoundry.com/blog/claude-code-limits-explained)
