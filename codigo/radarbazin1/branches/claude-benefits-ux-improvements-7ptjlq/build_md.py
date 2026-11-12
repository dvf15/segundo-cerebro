#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera o relatorio em Markdown indexado para Obsidian."""

from deck_content import META, FRENTES, SECOES, QUICK_WINS, PRODUTO, PALETTE, ANEXO

OUT = "/home/user/radarbazin1/Programa de Beneficios - Relatorio (ALLOS).md"

# emoji por frente (mesmo texto usado no titulo e no indice p/ o link casar)
EMOJI = {
    "beneficios": "🎁",
    "notas": "🧾",
    "cadastro": "👤",
    "operacao": "🛠️",
}
# accent -> tipo de callout Obsidian
CALLOUT = {
    "petroleo": "info",
    "ambar": "warning",
    "teal": "tip",
    "coral": "danger",
    "menta": "success",
}

INDEX_TITLE = "🧭 Índice"

L = []
w = L.append

# ---------- Frontmatter ----------
w("---")
w('title: "Programa de Benefícios — Oportunidades de evolução do app"')
w("aliases:")
w('  - "Relatório PB App"')
w('  - "Benefícios ALLOS"')
w("tags:")
w("  - allos/programa-beneficios")
w("  - produto/app")
w("  - ux")
w("  - relatorio")
w("date: 2026-07-03")
w('up: "[[00 - MOC - Programa de Benefícios]]"')
w("cssclasses:")
w("  - allos")
w("---")
w("")

# ---------- Cabecalho ----------
w("# Programa de Benefícios — Oportunidades de evolução do app")
w("")
w(f"> [!quote] {META['subtitle']}")
w(f"> {META['lead']}")
w(">")
w(f"> **Relatório-resumo** · {META['date']} · paleta **ALLOS**")
w("")

# ---------- Indice ----------
titulos = {sid: f"{EMOJI[sid]} {titulo}" for sid, titulo, _, _ in SECOES}
w(f"## {INDEX_TITLE}")
w("")
w("1. [[#📊 Sumário executivo]]")
for i, (sid, titulo, _, _) in enumerate(SECOES, start=2):
    w(f"{i}. [[#{titulos[sid]}]]")
w(f"{len(SECOES)+2}. [[#✅ Priorização — por onde começar]]")
w(f"{len(SECOES)+3}. [[#📎 Anexo — textos originais (na íntegra)]]")
w("")
w("---")
w("")

# ---------- Sumario executivo ----------
w("## 📊 Sumário executivo")
w("")
w("Os feedbacks foram agrupados em **cinco frentes**. Muitos são ganhos "
  "rápidos de usabilidade; outros exigem evolução de produto.")
w("")
w("| # | Frente | Foco |")
w("|---|--------|------|")
for acc, t, d in FRENTES:
    num, _, nome = t.partition(" · ")
    w(f"| {num} | **{nome}** | {d} |")
w("")
w("> [!tip] Leitura rápida")
w("> Cada frente vira uma seção a seguir, com sugestões objetivas de ação.")
w("")
w("[[#🧭 Índice|↑ voltar ao índice]]")
w("")
w("---")
w("")

# ---------- Secoes detalhadas ----------
for sid, titulo, _, cards in SECOES:
    w(f"## {titulos[sid]}")
    w("")
    for ca, ct, bullets in cards:
        w(f"> [!{CALLOUT[ca]}] {ct}")
        for b in bullets:
            w(f"> - {b}")
        w("")   # linha em branco real separa callouts distintos
    w("[[#🧭 Índice|↑ voltar ao índice]]")
    w("")
    w("---")
    w("")

# ---------- Priorizacao ----------
w("## ✅ Priorização — por onde começar")
w("")
w("> [!success] Ganhos rápidos de usabilidade")
for it in QUICK_WINS:
    w(f"> - {it}")
w("")
w("> [!abstract] Evolução de produto")
for it in PRODUTO:
    w(f"> - {it}")
w("")
w("[[#🧭 Índice|↑ voltar ao índice]]")
w("")
w("---")
w("")

# ---------- Anexo para consulta ----------
w("## 📎 Anexo — textos originais (na íntegra)")
w("")
w("> [!quote] Referência")
w("> Textos colados na conversa, reproduzidos **na íntegra** para consulta.")
w("")
ANEXO_EMOJI = ["🎁", "📱", "🏬"]
for ci, (ctitle, cacc, cblocks) in enumerate(ANEXO):
    w(f"### {ANEXO_EMOJI[ci]} {ctitle}")
    w("")
    for kind, text in cblocks:
        if kind == "q":
            w("")               # separa o subtítulo da lista anterior
            w(f"**{text}**")
            w("")
        else:
            w(f"- {text}")
    w("")
w("[[#🧭 Índice|↑ voltar ao índice]]")
w("")
w("---")
w("")

# ---------- Rodape / paleta ----------
w("> [!note]- Paleta ALLOS utilizada")
for name in ["petroleo", "escuro", "teal", "coral", "menta", "ambar", "bege", "areia"]:
    w(f"> - `{PALETTE[name]}` — {name}")
w("")

with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(L))
print("OK ->", OUT)
