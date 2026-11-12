#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera o relatorio em PDF (paisagem 16:9) na paleta ALLOS."""

from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from deck_content import META, FRENTES, SECOES, QUICK_WINS, PRODUTO, PALETTE, ANEXO

W, H = 960, 540           # 16:9 em pontos
C = {k: HexColor(v) for k, v in PALETTE.items()}
OUT = "/home/user/radarbazin1/Allos_Programa_Beneficios_Relatorio.pdf"

c = canvas.Canvas(OUT, pagesize=(W, H))


def rect(x, top, w, h, fill=None, stroke=None, lw=1, r=None):
    if fill is not None:
        c.setFillColor(fill)
    if stroke is not None:
        c.setStrokeColor(stroke); c.setLineWidth(lw)
    kw = dict(fill=1 if fill is not None else 0,
              stroke=1 if stroke is not None else 0)
    y = H - top - h
    if r:
        c.roundRect(x, y, w, h, r, **kw)
    else:
        c.rect(x, y, w, h, **kw)


def circle(cx, cy_top, rad, fill):
    c.setFillColor(fill)
    c.circle(cx, H - cy_top, rad, fill=1, stroke=0)


def style(size, color, bold=False, leading=None, space=2):
    return ParagraphStyle(
        "s", fontName="Helvetica-Bold" if bold else "Helvetica",
        fontSize=size, leading=leading or size * 1.18,
        textColor=C[color] if color in C else HexColor(color),
        spaceAfter=space)


def flow(x, top, width, paras, gap=3):
    """paras: list of (text, ParagraphStyle). Desenha de cima p/ baixo."""
    used = 0
    for text, st in paras:
        p = Paragraph(text, st)
        _, ph = p.wrap(width, H)
        p.drawOn(c, x, H - top - used - ph)
        used += ph + gap
    return used


def hx(color):
    return PALETTE[color]


def header(kicker, title, accent, num):
    rect(0, 0, W, 92, fill=C["petroleo"])
    rect(0, 92, W, 4, fill=C[accent])
    rect(40, 22, 10, 48, fill=C[accent], r=4)
    flow(62, 20, 720, [
        (kicker.upper(), style(9, "ambar", bold=True)),
        (title, style(19, "areia", bold=True)),
    ], gap=3)
    c.setFillColor(C["ambar"]); c.setFont("Helvetica-Bold", 22)
    c.drawRightString(W - 40, H - 62, f"{num:02d}")
    footer(num)


def footer(num):
    c.setFillColor(C["teal"]); c.setFont("Helvetica", 6.5)
    c.drawString(40, 18, "ALLOS  ·  Programa de Benefícios — Oportunidades de evolução do app")
    c.drawRightString(W - 40, 18, f"{num} / 8")


def card(x, top, w, h, accent, title, bullets, tsize=10.5, bsize=8.2):
    rect(x, top, w, h, fill=C["areia"], stroke=C["bege"], lw=0.8, r=8)
    rect(x, top + 12, 7, h - 24, fill=C[accent], r=3)
    paras = [(title, style(tsize, "petroleo", bold=True, space=3))]
    for b in bullets:
        paras.append((f'<font color="{hx(accent)}">•</font>  {b}',
                      style(bsize, "escuro", leading=bsize * 1.28)))
    flow(x + 22, top + 15, w - 34, paras, gap=3)


# ============ PAGE 1 — CAPA ============
rect(0, 0, W, H, fill=C["escuro"])
rect(677, 0, 283, H, fill=C["petroleo"])
rect(677, 0, 4, H, fill=C["ambar"])
circle(820, 175, 86, C["teal"])
circle(880, 305, 54, C["ambar"])
circle(815, 445, 68, C["menta"])
rect(65, 82, 120, 36, fill=C["ambar"], r=7)
c.setFillColor(C["escuro"]); c.setFont("Helvetica-Bold", 15)
c.drawCentredString(125, H - 106, META["brand"])
flow(65, 168, 560, [("PROGRAMA DE BENEFÍCIOS", style(11, "ambar", bold=True))])
flow(63, 200, 590, [
    ("Oportunidades de evolução", style(30, "areia", bold=True, leading=34)),
    ("da experiência no app", style(30, "areia", bold=True, leading=34)),
])
rect(66, 350, 185, 5, fill=C["teal"])
flow(65, 372, 560, [(META["lead"], style(10.5, "bege", leading=15))])
flow(65, 462, 560, [(f'Relatório-resumo  ·  {META["date"]}', style(8.5, "teal"))])
c.showPage()

# ============ PAGE 2 — SUMARIO ============
header("Visão geral", "Sumário executivo — 5 frentes de melhoria", "petroleo", 2)
flow(50, 108, 860, [(
    "Os feedbacks foram agrupados em cinco frentes. Muitos são ganhos "
    "rápidos de usabilidade; outros exigem evolução de produto.",
    style(9.5, "escuro", leading=13))])
gx, gy, ggap = 50, 165, 20
cw = (W - 50 * 2 - ggap * 2) / 3
chh = 140
for i, (acc, t, d) in enumerate(FRENTES):
    col, row = i % 3, i // 3
    x = gx + col * (cw + ggap)
    y = gy + row * (chh + 18)
    card(x, y, cw, chh, acc, t, [d], tsize=10.5, bsize=8.5)
# destaque
x = gx + 2 * (cw + ggap); y = gy + (chh + 18)
rect(x, y, cw, chh, fill=C["petroleo"], r=8)
flow(x + 20, y + 20, cw - 36, [
    ("Leitura rápida", style(9.5, "ambar", bold=True, space=4)),
    ("Cada frente vira uma seção a seguir, com sugestões objetivas de ação.",
     style(8.5, "areia", leading=12)),
])
c.showPage()

# ============ PAGES 3-6 — SECOES ============
for idx, (sid, titulo, acc, cards) in enumerate(SECOES):
    header(f"Frente {idx+1}", titulo, acc, idx + 3)
    n = len(cards)
    left, ggap = 50, 22
    if n <= 4:
        cols = 2
        cw = (W - left * 2 - ggap) / 2
        chh = 185
        top0 = 112
        for i, (ca, ct, cb) in enumerate(cards):
            col, row = i % 2, i // 2
            card(left + col * (cw + ggap), top0 + row * (chh + 18),
                 cw, chh, ca, ct, cb)
    else:
        # 3 em cima, 2 embaixo
        cw3 = (W - left * 2 - ggap * 2) / 3
        cw2 = (W - left * 2 - ggap) / 2
        top0 = 112
        h_top, h_bot = 205, 150
        for i in range(3):
            ca, ct, cb = cards[i]
            card(left + i * (cw3 + ggap), top0, cw3, h_top, ca, ct, cb)
        for j in range(3, n):
            ca, ct, cb = cards[j]
            card(left + (j - 3) * (cw2 + ggap), top0 + h_top + 18,
                 cw2, h_bot, ca, ct, cb)
    c.showPage()

# ============ PAGE 7 — PRIORIZACAO ============
header("Síntese", "Priorização — por onde começar", "petroleo", 7)
left, ggap = 50, 22
cw = (W - left * 2 - ggap) / 2
top0, chh = 118, 350


def prio_card(x, band_color, band_text_color, title, items, bullet_color):
    rect(x, top0, cw, chh, fill=C["areia"], stroke=C["bege"], lw=0.8, r=8)
    rect(x, top0, cw, 50, fill=C[band_color], r=8)
    rect(x, top0 + 25, cw, 25, fill=C[band_color])
    c.setFillColor(C[band_text_color]); c.setFont("Helvetica-Bold", 12.5)
    c.drawString(x + 24, H - top0 - 32, title)
    paras = [(f'<font color="{hx(bullet_color)}">●</font>  {it}',
              style(9.2, "escuro", leading=12)) for it in items]
    flow(x + 26, top0 + 66, cw - 46, paras, gap=5)


prio_card(left, "menta", "escuro", "Ganhos rápidos de usabilidade",
          QUICK_WINS, "menta")
prio_card(left + cw + ggap, "petroleo", "areia", "Evolução de produto",
          PRODUTO, "petroleo")
c.showPage()


# ============ PAGE 8 — ANEXO PARA CONSULTA ============
def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def annex_col(x, top, w, h, accent, title, blocks, bsize):
    rect(x, top, w, h, fill=C["areia"], stroke=C["bege"], lw=0.8, r=8)
    rect(x, top + 10, 6, h - 20, fill=C[accent], r=3)
    paras = [(title, style(8.5, "petroleo", bold=True, space=3))]
    for kind, text in blocks:
        if kind == "q":
            paras.append((esc(text), style(6.8, "teal", bold=True,
                                            leading=8.2, space=2)))
            continue
        ci = text.find(":")
        dot = f'<font color="{hx(accent)}">•</font> '
        if 0 < ci < 46:
            body = dot + f"<b>{esc(text[:ci+1])}</b> {esc(text[ci+1:].strip())}"
        else:
            body = dot + esc(text)
        paras.append((body, style(bsize, "escuro", leading=bsize * 1.28)))
    flow(x + 13, top + 12, w - 24, paras, gap=2.5)


header("Referência · textos originais na íntegra", "Anexo para consulta",
       "petroleo", 8)
axl, agap = 40, 20
acw = (W - axl * 2 - agap * 2) / 3
atop, ach = 104, 414
for i, (ctitle, cacc, cblocks) in enumerate(ANEXO):
    annex_col(axl + i * (acw + agap), atop, acw, ach, cacc, ctitle, cblocks,
              bsize=5.6 if i == 2 else 6.2)
c.showPage()

c.save()
print("OK ->", OUT)
