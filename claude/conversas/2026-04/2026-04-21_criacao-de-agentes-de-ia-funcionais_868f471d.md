---
title: "Criação de agentes de IA funcionais"
date: 2026-04-21
updated: 2026-04-21
source: "claude-chat"
source_id: "868f471d-03a2-4a27-aa67-216749859156"
url: "https://claude.ai/chat/868f471d-03a2-4a27-aa67-216749859156"
project: null
messages: 2
tags: ["claude", "conversa"]
---
# Criação de agentes de IA funcionais

> **Resumo:** **Conversation Overview** The person requested that Claude create functional AI agents described in some reference material (the specific material was not shown in the conversation, but context makes clear it described a multi-agent system for shopping center commercial operations). Claude built a complete single-page HTML application called "Shopping Inteligente" featuring three distinct AI agents, each with its own configuration panel and live chat interface connected to the Anthropic Claude API. The three agents created were: Agente Hunter (prospecting tool that maps local businesses within a configurable radius of 2–50km, scores their fit for the shopping center's mix, and generates outreach scripts), Agente Farmer (an investor suitability screening tool modeled after financial services qualification frameworks, which calculates a score and recommends investment formats based on capital, time availability, experience, risk tolerance, and payback expectations), and Agente KA/Expansão (a key accounts and expansion tool that evaluates brands and franchise networks, generates a complete KA ficha with attractiveness scoring, ideal partner profiles, and expansion briefings). All three agents support follow-up conversation with persistent chat history per agent session. The application was built in Portuguese (Brazilian) with a dark design aesthetic featuring a sticky header, tab navigation between agents, split-panel layouts (configuration sidebar + chat window), chip-based multi-select inputs, animated status indicators, typing indicators, and formatted markdown-style output rendering. Each agent has a dedicated color scheme (teal for Hunter, violet for Farmer, sky blue for KA) applied consistently across UI elements. The implementation uses direct fetch calls to the Anthropic Messages API with system prompts tailored to each agent's role and the user-configured context parameters.

**Mensagens:** 2 · **Criada:** 2026-04-21 · **Atualizada:** 2026-04-21

---

## 👤 Usuário · 2026-04-21 10:19

Crie cada um dos agentes descritos no material

- 📎 anexo (txt)

```
<!DOCTYPE html>

<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Shopping Inteligente — Sistema Completo de Agentes</title>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;500;600;700;800&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
–bg:#07080a;
–s1:#0d0f14;
–s2:#13161d;
–border:rgba(255,255,255,0.06);
–border2:rgba(255,255,255,0.1);
–text:#edeae3;
–muted:#5a6070;
–muted2:#8892a0;

/* accent palette */
–gold:#d4a843;
–gold-d:#8a6a1f;
–teal:#1fd4b0;
–teal-d:#0d5c4a;
–violet:#9d7dfa;
–violet-d:#3d2a7a;
–sky:#3ab6f5;
–sky-d:#103e5a;
–rose:#f56b6b;
–rose-d:#5c1c1c;
–amber:#f5a623;
–amber-d:#5c3a00;
–mint:#5de8a0;
–mint-d:#1a4a32;
–coral:#ff7c5c;
–coral-d:#5c2010;
}

body{
background:var(–bg);
color:var(–text);
font-family:‘Instrument Sans’,sans-serif;
font-size:13.5px;
line-height:1.65;
}

/* ─── NAV TABS ─── */
.nav{
position:sticky;top:0;z-index:100;
background:rgba(7,8,10,0.92);
backdrop-filter:blur(16px);
border-bottom:1px solid var(–border);
display:flex;gap:2px;padding:8px 24px;
overflow-x:auto;
}
.nav button{
background:none;border:none;color:var(–muted);
font-family:‘Instrument Sans’,sans-serif;font-size:12px;
padding:6px 14px;border-radius:6px;cursor:pointer;white-space:nowrap;
transition:all 0.18s;
}
.nav button:hover{color:var(–text);background:var(–s2)}
.nav button.active{color:var(–text);background:var(–s2);border:1px solid var(–border2)}

/* ─── WRAP ─── */
.page{display:none;padding:40px 24px 80px;max-width:1100px;margin:0 auto}
.page.active{display:block}

/* ─── HERO ─── */
.hero{text-align:center;padding:40px 0 56px}
.eyebrow{
display:inline-flex;align-items:center;gap:10px;
font-size:10px;letter-spacing:0.28em;text-transform:uppercase;
color:var(–gold);margin-bottom:20px;
}
.eyebrow::before,.eyebrow::after{content:’’;width:32px;height:1px;background:var(–gold);opacity:0.5}
h1{
font-family:‘Bricolage Grotesque’,sans-serif;
font-size:clamp(32px,6vw,60px);font-weight:800;line-height:1.08;
letter-spacing:-0.03em;margin-bottom:20px;
}
h1 em{color:var(–gold);font-style:normal}
.hero-sub{color:var(–muted2);font-size:15px;max-width:580px;margin:0 auto 36px}

/* ─── ARCH DIAGRAM ─── */
.arch{
display:grid;
grid-template-rows:auto auto auto auto;
gap:0;
margin-bottom:56px;
}
.arch-row{display:flex;justify-content:center;position:relative;padding:16px 0}
.arch-row + .arch-row::before{
content:’’;position:absolute;top:0;left:50%;transform:translateX(-50%);
width:1px;height:16px;background:linear-gradient(to bottom,var(–border2),transparent);
}

.arch-node{
background:var(–s1);border:1px solid var(–border2);
border-radius:14px;padding:18px 28px;text-align:center;
position:relative;min-width:240px;
}
.arch-node.core{
background:linear-gradient(135deg,#1a1300,#150f00);
border-color:var(–gold);
box-shadow:0 0 40px rgba(212,168,67,0.12);
}
.arch-node h3{
font-family:‘Bricolage Grotesque’,sans-serif;font-size:16px;font-weight:700;
margin-bottom:4px;
}
.arch-node p{font-size:11.5px;color:var(–muted2)}
.arch-node .badge{
display:inline-block;
font-size:9px;letter-spacing:0.2em;text-transform:uppercase;
background:rgba(212,168,67,0.12);border:1px solid rgba(212,168,67,0.25);
color:var(–gold);padding:3px 10px;border-radius:100px;margin-bottom:10px;
}

.arch-agents{
display:flex;gap:12px;flex-wrap:wrap;justify-content:center;
}
.arch-agents .arch-node{min-width:160px;max-width:200px;flex:1}
.arch-platforms{
display:flex;gap:12px;flex-wrap:wrap;justify-content:center;
}
.arch-platforms .arch-node{min-width:200px;flex:1;max-width:260px}

/* ─── SECTION HEADER ─── */
.sec-head{
display:flex;align-items:center;gap:12px;margin-bottom:24px;
}
.sec-head .pill{
font-family:‘Bricolage Grotesque’,sans-serif;
font-size:10px;letter-spacing:0.2em;text-transform:uppercase;
padding:4px 12px;border-radius:100px;border:1px solid;flex-shrink:0;
}
.sec-head h2{
font-family:‘Bricolage Grotesque’,sans-serif;
font-size:22px;font-weight:800;letter-spacing:-0.02em;
}
.sec-head::after{content:’’;flex:1;height:1px;background:var(–border)}

/* ─── AGENT DETAIL CARD ─── */
.agent-detail{
background:var(–s1);border:1px solid var(–border);border-radius:16px;
padding:28px;margin-bottom:20px;position:relative;overflow:hidden;
}
.agent-detail::before{
content:’’;position:absolute;top:0;left:0;right:0;height:3px;border-radius:16px 16px 0 0;
}
.agent-detail .ad-head{
display:flex;align-items:flex-start;gap:16px;margin-bottom:20px;
}
.agent-detail .ad-icon{
width:44px;height:44px;border-radius:10px;display:flex;align-items:center;
justify-content:center;font-size:20px;flex-shrink:0;
}
.agent-detail .ad-title h3{
font-family:‘Bricolage Grotesque’,sans-serif;font-size:17px;font-weight:700;
}
.agent-detail .ad-title p{font-size:12px;color:var(–muted2);margin-top:3px}

.two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}

.block-label{
font-size:10px;letter-spacing:0.2em;text-transform:uppercase;
color:var(–muted);margin-bottom:10px;
}
.tag-list{display:flex;flex-wrap:wrap;gap:6px}
.tag{
font-size:11px;padding:4px 10px;border-radius:6px;
background:rgba(255,255,255,0.05);border:1px solid var(–border);
color:var(–muted2);
}

.filter-list{list-style:none}
.filter-list li{
font-size:12.5px;color:var(–muted2);
padding:7px 0;border-bottom:1px solid var(–border);
display:flex;align-items:flex-start;gap:8px;line-height:1.5;
}
.filter-list li::before{content:‘◈’;font-size:9px;flex-shrink:0;margin-top:3px}

/* ─── BASE CARDS ─── */
.base-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:32px}
.base-card{
background:var(–s1);border:1px solid var(–border);
border-radius:12px;padding:18px;
}
.base-card .base-status{
display:inline-block;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;
padding:3px 9px;border-radius:100px;margin-bottom:10px;
}
.base-card .base-status.exists{background:rgba(93,232,160,0.1);border:1px solid rgba(93,232,160,0.3);color:var(–mint)}
.base-card .base-status.create{background:rgba(245,107,107,0.1);border:1px solid rgba(245,107,107,0.3);color:var(–rose)}
.base-card .base-status.partial{background:rgba(245,166,35,0.1);border:1px solid rgba(245,166,35,0.3);color:var(–amber)}
.base-card h4{font-family:‘Bricolage Grotesque’,sans-serif;font-size:14px;font-weight:700;margin-bottom:6px}
.base-card p{font-size:11.5px;color:var(–muted2);line-height:1.6}
.base-card .fields{margin-top:10px;padding-top:10px;border-top:1px solid var(–border)}
.base-card .fields span{
display:inline-block;font-size:10px;
background:var(–s2);border:1px solid var(–border);
padding:2px 8px;border-radius:4px;color:var(–muted2);
margin:2px;
}

/* ─── FORM TEMPLATE ─── */
.form-template{
background:var(–s2);border:1px solid var(–border2);
border-radius:12px;padding:24px;margin-bottom:20px;
}
.form-template h4{
font-family:‘Bricolage Grotesque’,sans-serif;font-size:15px;font-weight:700;
margin-bottom:16px;display:flex;align-items:center;gap:8px;
}
.form-section{margin-bottom:20px}
.form-section h5{
font-size:10px;letter-spacing:0.2em;text-transform:uppercase;
color:var(–muted);margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(–border);
}
.form-field{
background:var(–s1);border:1px solid var(–border);border-radius:8px;
padding:10px 14px;margin-bottom:8px;
}
.form-field .ff-name{font-size:12px;font-weight:600;color:var(–text);margin-bottom:2px}
.form-field .ff-type{font-size:10px;color:var(–muted);margin-bottom:3px}
.form-field .ff-options{font-size:11px;color:var(–muted2)}
.form-field .ff-why{font-size:11px;color:var(–violet);margin-top:4px}

/* ─── PLATFORM CARDS ─── */
.platform-card{
background:var(–s1);border:1px solid var(–border);
border-radius:16px;padding:28px;margin-bottom:20px;
}
.platform-card h3{
font-family:‘Bricolage Grotesque’,sans-serif;font-size:18px;font-weight:800;
margin-bottom:6px;letter-spacing:-0.02em;
}
.platform-card .plat-sub{font-size:12px;color:var(–muted2);margin-bottom:20px}

.solution-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.sol-item{
background:var(–s2);border:1px solid var(–border);
border-radius:8px;padding:12px;
}
.sol-item .sol-icon{font-size:18px;margin-bottom:6px}
.sol-item p{font-size:11px;color:var(–muted2);line-height:1.5}

/* ─── FLOW TIMELINE ─── */
.timeline{position:relative;padding-left:28px;margin:16px 0}
.timeline::before{
content:’’;position:absolute;left:8px;top:0;bottom:0;width:1px;background:var(–border2);
}
.tl-step{position:relative;margin-bottom:16px}
.tl-step::before{
content:’’;position:absolute;left:-24px;top:5px;
width:8px;height:8px;border-radius:50%;border:1px solid;
}
.tl-step h5{font-size:12.5px;font-weight:600;margin-bottom:3px}
.tl-step p{font-size:11.5px;color:var(–muted2)}

/* ─── COLOR UTILS ─── */
.c-gold{color:var(–gold)}.c-teal{color:var(–teal)}.c-violet{color:var(–violet)}
.c-sky{color:var(–sky)}.c-rose{color:var(–rose)}.c-amber{color:var(–amber)}
.c-mint{color:var(–mint)}.c-coral{color:var(–coral)}

.bg-gold{background:rgba(212,168,67,0.08);border-color:rgba(212,168,67,0.2)!important}
.bg-teal{background:rgba(31,212,176,0.06);border-color:rgba(31,212,176,0.2)!important}
.bg-violet{background:rgba(157,125,250,0.06);border-color:rgba(157,125,250,0.2)!important}
.bg-sky{background:rgba(58,182,245,0.06);border-color:rgba(58,182,245,0.2)!important}
.bg-rose{background:rgba(245,107,107,0.06);border-color:rgba(245,107,107,0.2)!important}
.bg-amber{background:rgba(245,166,35,0.06);border-color:rgba(245,166,35,0.2)!important}
.bg-mint{background:rgba(93,232,160,0.06);border-color:rgba(93,232,160,0.2)!important}
.bg-coral{background:rgba(255,124,92,0.06);border-color:rgba(255,124,92,0.2)!important}

/* ─── MATCH DIAGRAM ─── */
.match-diagram{
display:grid;grid-template-columns:1fr 60px 1fr;gap:0;align-items:center;
background:var(–s2);border:1px solid var(–border);border-radius:12px;padding:20px;
margin:16px 0;
}
.match-side{display:flex;flex-direction:column;gap:6px}
.match-item{
background:var(–s1);border:1px solid var(–border);
border-radius:7px;padding:8px 12px;font-size:12px;color:var(–muted2);
text-align:center;
}
.match-center{
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;
}
.match-center .arrow{font-size:18px;color:var(–gold)}
.match-center p{font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:var(–gold);text-align:center}

/* ─── STATS ROW ─── */
.stats-row{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin:20px 0}
.stat-box{
background:var(–s2);border:1px solid var(–border);border-radius:10px;
padding:14px 12px;text-align:center;
}
.stat-box .big{
font-family:‘Bricolage Grotesque’,sans-serif;font-size:24px;font-weight:800;
line-height:1;margin-bottom:5px;
}
.stat-box p{font-size:10.5px;color:var(–muted2);line-height:1.4}

/* ─── RESPONSIVE ─── */
@media(max-width:700px){
.two-col,.three-col,.base-grid,.solution-grid,.stats-row{grid-template-columns:1fr}
.arch-agents,.arch-platforms{flex-direction:column;align-items:center}
.match-diagram{grid-template-columns:1fr;text-align:center}
.match-center{flex-direction:row;padding:8px 0}
}
</style>

</head>
<body>

<!-- NAV -->

<nav class="nav">
  <button class="active" onclick="show('visao')">🗺 Visão Geral</button>
  <button onclick="show('agentes')">🤖 Agentes (1-3)</button>
  <button onclick="show('plataformas')">🏗 Plataformas (A-C)</button>
  <button onclick="show('bases')">🗄 Bases de Dados</button>
  <button onclick="show('formularios')">📋 Formulários</button>
</nav>

<!-- ══════════════════════════════════════════════
     PAGE 1 — VISÃO GERAL
═══════════════════════════════════════════════ -->

<div id="visao" class="page active">
  <div class="hero">
    <div class="eyebrow">Arquitetura Completa</div>
    <h1>Shopping <em>Inteligente</em></h1>
    <p class="hero-sub">Sistema integrado de agentes para crescimento comercial, reposição de lojas e alavancagem do ecossistema do shopping.</p>
  </div>

  <!-- STATS -->

  <div class="stats-row">
    <div class="stat-box"><div class="big c-rose">&lt;30%</div><p>MktShare shoppings no varejo BR</p></div>
    <div class="stat-box"><div class="big c-teal">50%+</div><p>México e Austrália (benchmark)</p></div>
    <div class="stat-box"><div class="big c-gold">27.5%</div><p>E-commerce EUA pós-pandemia (2023)</p></div>
    <div class="stat-box"><div class="big c-violet">3</div><p>Agentes especialistas de vendas</p></div>
    <div class="stat-box"><div class="big c-mint">3</div><p>Plataformas de suporte ao lojista</p></div>
  </div>

  <!-- ARQUITETURA -->

  <div class="sec-head" style="margin-top:40px">
    <div class="pill" style="color:var(--gold);border-color:var(--gold-d)">Arquitetura</div>
    <h2>Ecossistema de Agentes</h2>
  </div>

  <div class="arch">

```
<!-- ORQUESTRADOR -->
<div class="arch-row">
  <div class="arch-node core">
    <div class="badge">Central de Inteligência</div>
    <h3 class="c-gold">Agente Orquestrador</h3>
    <p>Roteia todos os fluxos, mantém contexto, enriquece perfis e faz o match entre investidores, marcas, lojistas e oportunidades do shopping.</p>
  </div>
</div>

<!-- AGENTES ESPECIALISTAS -->
<div class="arch-row" style="padding-top:32px">
  <div class="arch-agents">
    <div class="arch-node bg-teal">
      <div style="font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:var(--teal);margin-bottom:6px">Agente 01</div>
      <h3>Hunter</h3>
      <p style="font-size:11px;color:var(--muted2)">Prospecção ativa de inovações e marcas num raio de 2–50km</p>
    </div>
    <div class="arch-node bg-violet">
      <div style="font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:var(--violet);margin-bottom:6px">Agente 02</div>
      <h3>Farmer</h3>
      <p style="font-size:11px;color:var(--muted2)">Captação e triagem de investidores locais por perfil e capital</p>
    </div>
    <div class="arch-node bg-sky">
      <div style="font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:var(--sky);margin-bottom:6px">Agente 03</div>
      <h3>KA / Expansão</h3>
      <p style="font-size:11px;color:var(--muted2)">Curadoria de marcas/franquias em expansão + match com Farmer</p>
    </div>
  </div>
</div>

<!-- PLATAFORMAS -->
<div class="arch-row" style="padding-top:32px">
  <div class="arch-platforms">
    <div class="arch-node bg-amber">
      <div style="font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:var(--amber);margin-bottom:6px">Plataforma A</div>
      <h3>Alavancador</h3>
      <p style="font-size:11px;color:var(--muted2)">Financiamento, seguros e soluções financeiras para abertura e operação</p>
    </div>
    <div class="arch-node bg-coral">
      <div style="font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:var(--coral);margin-bottom:6px">Plataforma B</div>
      <h3>Builder</h3>
      <p style="font-size:11px;color:var(--muted2)">Engenharia, obra, tecnologia, RH e suporte legal em um só lugar</p>
    </div>
    <div class="arch-node bg-mint">
      <div style="font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:var(--mint);margin-bottom:6px">Plataforma C</div>
      <h3>Seller</h3>
      <p style="font-size:11px;color:var(--muted2)">Mídia, eventos, benefícios e expansão de espaços para vender mais</p>
    </div>
  </div>
</div>
```

  </div>

  <!-- FLUXO MACRO -->

  <div class="sec-head">
    <div class="pill" style="color:var(--violet);border-color:var(--violet-d)">Jornada</div>
    <h2>Fluxo de Valor End-to-End</h2>
  </div>

  <div style="background:var(--s1);border:1px solid var(--border);border-radius:16px;padding:28px;margin-bottom:40px">
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:0;position:relative">
      <div style="position:absolute;top:28px;left:10%;right:10%;height:1px;background:linear-gradient(to right,var(--teal),var(--violet),var(--sky),var(--amber),var(--mint));opacity:0.3"></div>
      <div style="text-align:center;padding:0 8px">
        <div style="width:56px;height:56px;border-radius:50%;background:rgba(31,212,176,0.1);border:1px solid var(--teal);display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 12px">🔍</div>
        <div style="font-size:11px;font-weight:600;color:var(--teal);margin-bottom:4px">DESCOBERTA</div>
        <p style="font-size:11px;color:var(--muted2)">Hunter & Farmer identificam oportunidades e leads</p>
      </div>
      <div style="text-align:center;padding:0 8px">
        <div style="width:56px;height:56px;border-radius:50%;background:rgba(157,125,250,0.1);border:1px solid var(--violet);display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 12px">🎯</div>
        <div style="font-size:11px;font-weight:600;color:var(--violet);margin-bottom:4px">TRIAGEM</div>
        <p style="font-size:11px;color:var(--muted2)">Orquestrador filtra e qualifica por perfil e fit</p>
      </div>
      <div style="text-align:center;padding:0 8px">
        <div style="width:56px;height:56px;border-radius:50%;background:rgba(58,182,245,0.1);border:1px solid var(--sky);display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 12px">🤝</div>
        <div style="font-size:11px;font-weight:600;color:var(--sky);margin-bottom:4px">MATCH</div>
        <p style="font-size:11px;color:var(--muted2)">KA/Expansão conecta investidor ↔ marca ↔ ponto</p>
      </div>
      <div style="text-align:center;padding:0 8px">
        <div style="width:56px;height:56px;border-radius:50%;background:rgba(245,166,35,0.1);border:1px solid var(--amber);display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 12px">🏗</div>
        <div style="font-size:11px;font-weight:600;color:var(--amber);margin-bottom:4px">ABERTURA</div>
        <p style="font-size:11px;color:var(--muted2)">Alavancador + Builder suportam obra e operação</p>
      </div>
      <div style="text-align:center;padding:0 8px">
        <div style="width:56px;height:56px;border-radius:50%;background:rgba(93,232,160,0.1);border:1px solid var(--mint);display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 12px">📈</div>
        <div style="font-size:11px;font-weight:600;color:var(--mint);margin-bottom:4px">CRESCIMENTO</div>
        <p style="font-size:11px;color:var(--muted2)">Seller amplifica vendas e retém o lojista</p>
      </div>
    </div>
  </div>

</div>

<!-- ══════════════════════════════════════════════
     PAGE 2 — AGENTES 1-3
═══════════════════════════════════════════════ -->

<div id="agentes" class="page">

  <!-- AGENTE 01 — HUNTER -->

  <div class="sec-head">
    <div class="pill" style="color:var(--teal);border-color:var(--teal-d)">Agente 01</div>
    <h2 class="c-teal">Hunter de Inovação</h2>
  </div>

  <div class="agent-detail bg-teal">
    <div style="position:absolute;top:0;left:0;right:0;height:3px;background:var(--teal);border-radius:16px 16px 0 0"></div>
    <div class="ad-head">
      <div class="ad-icon" style="background:rgba(31,212,176,0.1);color:var(--teal)">🔍</div>
      <div class="ad-title">
        <h3>Agente Hunter — Prospecção Ativa de Inovação no Varejo</h3>
        <p>Auxilia o executivo de vendas na busca de negócios, marcas e tendências num raio de 2 a 50km do shopping</p>
      </div>
    </div>

```
<div class="two-col">
  <div>
    <div class="block-label">Filtros do Agente</div>
    <ul class="filter-list">
      <li><strong>Raio geográfico:</strong> 2km (mín.) a 50km (máx.) do shopping — configurável por EV</li>
      <li><strong>Categoria de varejo:</strong> moda, alimentação, serviços, entretenimento, saúde/beleza, casa/deco, esporte, pet, tech</li>
      <li><strong>Presença no shopping:</strong> ausente / presente com gap de qualidade / concorrente direto</li>
      <li><strong>Faturamento estim
```
- 📎 anexo

## 🤖 Claude · 2026-04-21 10:22


```
This block is not supported on your current device yet.
```

Entendido! Vou criar 3 agentes de IA funcionais usando a API do Claude — Hunter, Farmer e KA/Expansão — em uma única interface com o design do projeto.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Os 3 agentes estão funcionais. Cada um tem um painel esquerdo de configuração e uma janela de chat com a API:

**🔍 Agente Hunter** — configure shopping, raio (2–50km), categorias e o gap do mix atual → gera lista priorizada de negócios locais com score de fit 0–100 e script de abordagem

**💼 Agente Farmer** — preencha o perfil suitability do investidor (capital, tempo, experiência, risco, payback) → calcula score de qualificação e recomenda os 3 melhores formatos de investimento

**🏢 Agente KA/Expansão** — informe os dados da marca/franquia (categoria, área, investimento, modelo) → gera ficha KA completa com pontuação de atratividade, perfil de parceiro ideal e estratégia de abordagem

Após o primeiro disparo, o chat fica habilitado para perguntas de follow-up com histórico de conversa mantido por agente.
