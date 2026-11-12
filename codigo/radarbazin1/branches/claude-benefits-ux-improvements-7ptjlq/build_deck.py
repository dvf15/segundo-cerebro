#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Relatorio PPT (7 slides) - Programa de Beneficios / paleta oficial ALLOS."""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR, MSO_AUTO_SIZE
from pptx.enum.shapes import MSO_SHAPE
from deck_content import ANEXO

TOTAL = 8  # total de paginas (7 + anexo)

# ---------- Paleta OFICIAL ALLOS ----------
PETROLEO = RGBColor(0x00, 0x61, 0x6F)   # primaria - titulos/cabecalhos/marca
ESCURO   = RGBColor(0x0D, 0x45, 0x4A)   # texto sobre claro; fundos escuros; footers
TEAL     = RGBColor(0x36, 0x8C, 0x82)   # secundaria - subtitulos/icones/destaques
CORAL    = RGBColor(0xCD, 0x51, 0x51)   # alertas / negativo
MENTA    = RGBColor(0x6C, 0xC6, 0x80)   # sucesso / positivo
AMBAR    = RGBColor(0xED, 0xA7, 0x54)   # destaques / KPIs / atencao media
BEGE     = RGBColor(0xCC, 0xC5, 0xBC)   # bordas / divisores / neutros
AREIA    = RGBColor(0xE5, 0xDE, 0xD4)   # fundos claros / cards / respiro
WHITE    = RGBColor(0xFF, 0xFF, 0xFF)

# ordem de series: petroleo -> ambar -> teal -> coral -> menta -> bege
SERIES = [PETROLEO, AMBAR, TEAL, CORAL, MENTA, BEGE]

prs = Presentation()
prs.slide_width  = Inches(13.333)
prs.slide_height = Inches(7.5)
SW, SH = prs.slide_width, prs.slide_height
BLANK = prs.slide_layouts[6]


def slide():
    return prs.slides.add_slide(BLANK)


def rect(s, x, y, w, h, fill, line=None, shape=MSO_SHAPE.RECTANGLE, line_w=None):
    sp = s.shapes.add_shape(shape, x, y, w, h)
    sp.fill.solid(); sp.fill.fore_color.rgb = fill
    if line is None:
        sp.line.fill.background()
    else:
        sp.line.color.rgb = line
        sp.line.width = line_w or Pt(1)
    sp.shadow.inherit = False
    return sp


def bg(s, color=WHITE):
    rect(s, 0, 0, SW, SH, color)


def txt(s, x, y, w, h, runs, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP,
        space_after=Pt(4), line_spacing=1.0):
    tb = s.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    tf.margin_left = 0; tf.margin_right = 0
    tf.margin_top = 0; tf.margin_bottom = 0
    for i, para in enumerate(runs):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.space_after = space_after
        p.space_before = Pt(0)
        p.line_spacing = line_spacing
        for (t, sz, col, bold, ital) in para:
            r = p.add_run(); r.text = t
            r.font.size = Pt(sz); r.font.color.rgb = col
            r.font.bold = bold; r.font.italic = ital
            r.font.name = "Calibri"
    return tb


def R(t, sz, col, bold=False, ital=False):
    return (t, sz, col, bold, ital)


def header(s, kicker, title, accent, num):
    rect(s, 0, 0, SW, Inches(1.28), PETROLEO)
    rect(s, 0, Inches(1.28), SW, Inches(0.055), accent)
    rect(s, Inches(0.55), Inches(0.30), Inches(0.14), Inches(0.68), accent,
         shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    txt(s, Inches(0.85), Inches(0.24), Inches(10.5), Inches(0.9),
        [[R(kicker.upper(), 12, AMBAR, True)],
         [R(title, 25, AREIA, True)]], space_after=Pt(2))
    txt(s, Inches(12.15), Inches(0.28), Inches(0.95), Inches(0.7),
        [[R(f"{num:02d}", 30, AMBAR, True)]], align=PP_ALIGN.RIGHT)
    footer(s, num)


def footer(s, num):
    txt(s, Inches(0.55), Inches(7.05), Inches(9), Inches(0.35),
        [[R("ALLOS  ·  Programa de Beneficios — Oportunidades de evolucao do app",
            9, TEAL, False)]])
    txt(s, Inches(11.5), Inches(7.05), Inches(1.3), Inches(0.35),
        [[R(f"{num} / {TOTAL}", 9, TEAL, False)]], align=PP_ALIGN.RIGHT)


def card(s, x, y, w, h, accent, title, items, tsize=13.5, isize=10.5):
    c = rect(s, x, y, w, h, AREIA, line=BEGE, line_w=Pt(1),
             shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    c.adjustments[0] = 0.045
    rect(s, x, y+Inches(0.18), Inches(0.09), h-Inches(0.36), accent,
         shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    paras = [[R(title, tsize, PETROLEO, True)]]
    for it in items:
        paras.append([R("▸ ", isize, accent, True), R(it, isize, ESCURO, False)])
    txt(s, x+Inches(0.32), y+Inches(0.22), w-Inches(0.55), h-Inches(0.4),
        paras, space_after=Pt(5), line_spacing=1.02)
    return c


# =====================================================================
# SLIDE 1 — CAPA
# =====================================================================
s = slide()
rect(s, 0, 0, SW, SH, ESCURO)
rect(s, Inches(9.4), 0, Inches(3.93), SH, PETROLEO)
rect(s, Inches(9.4), 0, Inches(0.06), SH, AMBAR)
rect(s, Inches(10.15), Inches(1.15), Inches(2.4), Inches(2.4), TEAL,
     shape=MSO_SHAPE.OVAL)
rect(s, Inches(11.2), Inches(3.1), Inches(1.5), Inches(1.5), AMBAR,
     shape=MSO_SHAPE.OVAL)
rect(s, Inches(10.35), Inches(4.7), Inches(1.9), Inches(1.9), MENTA,
     shape=MSO_SHAPE.OVAL)
# chip da marca
rect(s, Inches(0.9), Inches(1.15), Inches(1.7), Inches(0.5), AMBAR,
     shape=MSO_SHAPE.ROUNDED_RECTANGLE)
txt(s, Inches(0.9), Inches(1.19), Inches(1.7), Inches(0.42),
    [[R("ALLOS", 17, ESCURO, True)]], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

txt(s, Inches(0.9), Inches(2.35), Inches(8.2), Inches(0.5),
    [[R("PROGRAMA DE BENEFICIOS", 15, AMBAR, True)]])
txt(s, Inches(0.85), Inches(2.85), Inches(8.4), Inches(2.3),
    [[R("Oportunidades de evolucao", 42, AREIA, True)],
     [R("da experiencia no app", 42, AREIA, True)]],
    space_after=Pt(2), line_spacing=0.98)
rect(s, Inches(0.92), Inches(4.95), Inches(2.6), Inches(0.07), TEAL)
txt(s, Inches(0.9), Inches(5.2), Inches(8.0), Inches(1.0),
    [[R("Consolidacao de feedbacks de clientes, lojistas e operacao — ",
        13.5, BEGE, False),
      R("com destaque NorteShopping.", 13.5, BEGE, False, True)]],
    line_spacing=1.15)
txt(s, Inches(0.9), Inches(6.55), Inches(8), Inches(0.4),
    [[R("Relatorio-resumo  ·  Julho / 2026", 11, TEAL, False)]])

# =====================================================================
# SLIDE 2 — SUMARIO EXECUTIVO
# =====================================================================
s = slide(); bg(s)
header(s, "Visao geral", "Sumario executivo — 5 frentes de melhoria", PETROLEO, 2)
intro = ("Os feedbacks foram agrupados em cinco frentes. Muitos sao ganhos "
         "rapidos de usabilidade; outros exigem evolucao de produto.")
txt(s, Inches(0.7), Inches(1.55), Inches(12), Inches(0.6),
    [[R(intro, 12.5, ESCURO, False)]], line_spacing=1.1)

frentes = [
    (PETROLEO, "1 · Beneficios & Segmentacao",
     "Lista unica, selo de exclusivo, visibilidade dos ativados e limpeza dos usados/expirados."),
    (AMBAR, "2 · Notas Fiscais & Sorteios",
     "Bloqueio automatico fora da campanha, motivo de rejeicao no app e historico de 90 dias."),
    (TEAL, "3 · Cadastro & Perfis",
     "Categorias para Administracao e Terceiros e CRM que respeita beneficios ja usados."),
    (CORAL, "4 · Experiencia no App",
     "Sessao/login sem senha, busca de lojas, valet por categoria e compra de ingressos."),
    (MENTA, "5 · Operacao, Retail & Comercial",
     "Validacao por QR Code, SKU/Retail por marca, anunciantes externos e capacitacao de midia."),
]
x0 = Inches(0.7); y0 = Inches(2.35); gap = Inches(0.28)
cw = (SW - Inches(0.7)*2 - gap*2) / 3
ch = Inches(1.95)
for i, (acc, t, d) in enumerate(frentes):
    col = i % 3; row = i // 3
    x = x0 + col*(cw+gap)
    y = y0 + row*(ch+Inches(0.25))
    card(s, x, y, cw, ch, acc, t, [d], tsize=13, isize=10.5)
# destaque no 6o espaco
x = x0 + 2*(cw+gap); y = y0 + (ch+Inches(0.25))
box = rect(s, x, y, cw, ch, PETROLEO, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
box.adjustments[0] = 0.06
txt(s, x+Inches(0.3), y+Inches(0.28), cw-Inches(0.6), ch-Inches(0.5),
    [[R("Leitura rapida", 12, AMBAR, True)],
     [R("Cada frente vira 1 slide a seguir, com sugestoes objetivas de acao.",
        11, AREIA, False)]], space_after=Pt(6), line_spacing=1.1)

# =====================================================================
# SLIDE 3 — BENEFICIOS & SEGMENTACAO
# =====================================================================
s = slide(); bg(s)
header(s, "Frente 1", "Beneficios & Segmentacao", PETROLEO, 3)
x0 = Inches(0.7); y0 = Inches(1.65); gap = Inches(0.3)
cw = (SW - Inches(0.7)*2 - gap) / 2
ch = Inches(2.4)
card(s, x0, y0, cw, ch, PETROLEO, "Lista completa de beneficios", [
    "Hoje \"Meus Beneficios\" fica em aba separada, dificil de localizar.",
    "Sugestao: lista completa de beneficios, adicional a visao por categoria.",
    "Identificar os segmentados/exclusivos com um selo especifico.",
])
card(s, x0+cw+gap, y0, cw, ch, AMBAR, "Selo \"Beneficio Exclusivo\"", [
    "Acoes segmentadas geram ruido com clientes fora do publico-alvo.",
    "Nem sempre fica claro que o beneficio e exclusivo.",
    "O selo reforca a comunicacao e o senso de exclusividade.",
])
y1 = y0 + ch + Inches(0.28)
card(s, x0, y1, cw, ch, TEAL, "Visibilidade dos beneficios ativados", [
    "Ao ativar e nao usar na hora, o beneficio some da lista principal.",
    "Fica so na aba \"Beneficios Ativos\" (menu) — parece que sumiu.",
    "Sugestao: manter indicador na lista principal ou facilitar o acesso.",
])
card(s, x0+cw+gap, y1, cw, ch, CORAL, "Beneficios usados / expirados", [
    "Beneficios ja usados seguem na lista geral e dao erro ao tentar usar.",
    "Ativos exibem historico parcial de acoes fora do ar (as vezes P&B).",
    "Sugestao: sair da lista ao usar; historico completo (ex.: 6 meses).",
])

# =====================================================================
# SLIDE 4 — NOTAS FISCAIS & SORTEIOS
# =====================================================================
s = slide(); bg(s)
header(s, "Frente 2", "Notas Fiscais & Sorteios", AMBAR, 4)
x0 = Inches(0.7); y0 = Inches(1.62); gap = Inches(0.28)
cw = (SW - Inches(0.7)*2 - gap*2) / 3
ch = Inches(2.55)
card(s, x0, y0, cw, ch, CORAL, "Bloqueio automatico de NF", [
    "Hoje o app permite ativar sorteio com NF fora do periodo promocional.",
    "Validacao so manual, quando ha ganhador.",
    "Ideal: bloquear a ativacao automaticamente, como ja ocorre no brinde.",
])
card(s, x0+cw+gap, y0, cw, ch, PETROLEO, "Rejeicao de NF transparente", [
    "NF e rejeitada sem motivo claro e sem prazo dentro do app.",
    "Cliente precisa ir ao balcao so para abrir chamado.",
    "Ideal: informar o motivo, permitir reenvio e acompanhar o status.",
])
card(s, x0+2*(cw+gap), y0, cw, ch, AMBAR, "Historico de NF (90 dias)", [
    "Historico exibido e limitado; nao cobre todas as NF dos ultimos 90 dias.",
    "Esse periodo e a base do calculo da categoria do cliente.",
    "Ideal: historico completo para acompanhamento e conferencia.",
])
y1 = y0 + ch + Inches(0.24)
ch2 = Inches(1.55)
cw2 = (SW - Inches(0.7)*2 - gap) / 2
card(s, x0, y1, cw2, ch2, TEAL, "Separacao de GMV por acao", [
    "Permitir que o cliente escolha para qual campanha direcionar a NF.",
    "Garante mensuracao correta do GMV de cada acao.",
])
card(s, x0+cw2+gap, y1, cw2, ch2, MENTA, "Ativacao de sorteios mais intuitiva", [
    "Destacar visualmente que e preciso clicar no sorteio para participar.",
    "Banner in-app atual atrapalha a navegacao — reduzir duvidas e elevar conversao.",
])

# =====================================================================
# SLIDE 5 — CADASTRO, PERFIS & EXPERIENCIA
# =====================================================================
s = slide(); bg(s)
header(s, "Frentes 3 e 4", "Cadastro, Perfis & Experiencia no App", TEAL, 5)
x0 = Inches(0.7); y0 = Inches(1.62); gap = Inches(0.28)
cw = (SW - Inches(0.7)*2 - gap*2) / 3
ch = Inches(2.5)
card(s, x0, y0, cw, ch, PETROLEO, "Perfis de usuario", [
    "Hoje so existem \"Clientes\" e \"Lojistas\".",
    "Colaboradores da administracao e terceiros entram como lojistas.",
    "Limita segmentacao — ex.: acao da adm nao exclui so os lojistas.",
    "Sugestao: criar categorias Administracao e Terceiros.",
])
card(s, x0+cw+gap, y0, cw, ch, AMBAR, "Sessao & login", [
    "Mesmo atualizado, o app desloga o cliente ao longo do dia/mes.",
    "Muitos esquecem a senha e recorrem ao balcao — filas e desistencia.",
    "Ideal: sessao mais longa; login por biometria, facial ou SMS/WhatsApp.",
])
card(s, x0+2*(cw+gap), y0, cw, ch, CORAL, "CRM \"customer in the mall\"", [
    "Comunicacao e pre-programada e impacta quem ja usou o beneficio.",
    "Ex.: ja usei o Outback e recebo o CRM do mesmo beneficio.",
    "Gera falsa percepcao de que esta disponivel de novo.",
])
y1 = y0 + ch + Inches(0.24)
ch2 = Inches(1.55)
cw2 = (SW - Inches(0.7)*2 - gap) / 2
card(s, x0, y1, cw2, ch2, TEAL, "Valet por categoria", [
    "Evoluir o produto para aplicar desconto/isencao de estacionamento pela categoria.",
    "Cliente paga apenas a taxa de manobra do valet sobre o valor comum do patio.",
])
card(s, x0+cw2+gap, y1, cw2, ch2, MENTA, "Outras melhorias de app", [
    "Retomar o filtro de busca de lojas (usabilidade).",
    "Nova funcionalidade: compra de ingressos e bilheteria pelo app.",
])

# =====================================================================
# SLIDE 6 — OPERACAO, RETAIL & COMERCIAL
# =====================================================================
s = slide(); bg(s)
header(s, "Frente 5", "Operacao, Retail & Comercial", MENTA, 6)
x0 = Inches(0.7); y0 = Inches(1.65); gap = Inches(0.3)
cw = (SW - Inches(0.7)*2 - gap) / 2
ch = Inches(2.4)
card(s, x0, y0, cw, ch, PETROLEO, "Validacao por QR Code", [
    "Hoje o lojista valida o beneficio manualmente, sem baixa automatica.",
    "Cliente digita um codigo — permite reuso e impede medir a conversao por loja.",
    "Ideal: validacao por QR Code, com baixa automatica e registro rastreavel no resgate.",
])
card(s, x0+cw+gap, y0, cw, ch, AMBAR, "SKU / Retail por marca", [
    "Limitacao de SKU dificulta usar produtos de Retail com algumas marcas.",
    "Ex.: numeros da sorte extras para quem compra produtos especificos (nao a loja toda).",
    "Amplia as possibilidades de negociacao.",
])
y1 = y0 + ch + Inches(0.28)
card(s, x0, y1, cw, ch, TEAL, "Anunciantes externos", [
    "Processo ja automatizado, mas ainda exige customizacao por cliente (ex.: Coca-Cola).",
    "Customizacao consome tempo e pode inviabilizar a negociacao pelo timing do anunciante.",
    "Oportunidade de receita a destravar.",
])
card(s, x0+cw+gap, y1, cw, ch, CORAL, "Capacitacao de midia", [
    "Capacitar os executivos de midia para inserir os produtos na rotina.",
    "Uso mais efetivo dos produtos = mais valor para shopping e lojista.",
])

# =====================================================================
# SLIDE 7 — PRIORIZACAO / PROXIMOS PASSOS
# =====================================================================
s = slide(); bg(s)
header(s, "Sintese", "Priorizacao — por onde comecar", PETROLEO, 7)
x0 = Inches(0.7); y0 = Inches(1.7); gap = Inches(0.3)
cw = (SW - Inches(0.7)*2 - gap) / 2
ch = Inches(4.7)
# Ganhos rapidos (menta = positivo/quick win)
c = rect(s, x0, y0, cw, ch, AREIA, line=BEGE, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
c.adjustments[0] = 0.04
rect(s, x0, y0, cw, Inches(0.7), MENTA, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
rect(s, x0, y0+Inches(0.35), cw, Inches(0.35), MENTA)
txt(s, x0+Inches(0.35), y0, cw-Inches(0.6), Inches(0.7),
    [[R("Ganhos rapidos de usabilidade", 15, ESCURO, True)]],
    anchor=MSO_ANCHOR.MIDDLE)
quick = [
    "Lista unica de beneficios + selo de exclusivo",
    "Sair da lista ao usar / historico de expirados",
    "Indicador dos beneficios ativados na lista principal",
    "Bloqueio automatico de NF fora da campanha",
    "Motivo de rejeicao de NF + reenvio e status no app",
    "Historico completo de NF (90 dias)",
    "Retomar o filtro de busca de lojas",
]
paras = [[R("● ", 11, MENTA, True), R(t, 11.5, ESCURO, False)] for t in quick]
txt(s, x0+Inches(0.4), y0+Inches(0.95), cw-Inches(0.75), ch-Inches(1.1),
    paras, space_after=Pt(7), line_spacing=1.02)
# Evolucao de produto (petroleo)
c = rect(s, x0+cw+gap, y0, cw, ch, AREIA, line=BEGE, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
c.adjustments[0] = 0.04
rect(s, x0+cw+gap, y0, cw, Inches(0.7), PETROLEO, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
rect(s, x0+cw+gap, y0+Inches(0.35), cw, Inches(0.35), PETROLEO)
txt(s, x0+cw+gap+Inches(0.35), y0, cw-Inches(0.6), Inches(0.7),
    [[R("Evolucao de produto", 15, AREIA, True)]], anchor=MSO_ANCHOR.MIDDLE)
prod = [
    "Login sem senha (biometria / facial / SMS-WhatsApp) e sessao longa",
    "Novos perfis: Administracao e Terceiros",
    "CRM que respeita beneficios ja utilizados",
    "Separacao de GMV por acao (cliente escolhe a campanha)",
    "Validacao por QR Code com baixa automatica e rastreio",
    "Flexibilizar SKU/Retail para acoes por marca",
    "Valet por categoria e compra de ingressos pelo app",
    "Destravar anunciantes externos + capacitacao de midia",
]
paras = [[R("● ", 11, PETROLEO, True), R(t, 11.5, ESCURO, False)] for t in prod]
txt(s, x0+cw+gap+Inches(0.4), y0+Inches(0.95), cw-Inches(0.75), ch-Inches(1.1),
    paras, space_after=Pt(7), line_spacing=1.02)

# =====================================================================
# SLIDE 8 — ANEXO PARA CONSULTA (textos originais na integra)
# =====================================================================
def annex_bullet_runs(text, accent, size):
    ci = text.find(":")
    runs = [R("•  ", size, accent, True)]
    if 0 < ci < 46:
        runs.append(R(text[:ci+1] + " ", size, ESCURO, True))
        runs.append(R(text[ci+1:].strip(), size, ESCURO, False))
    else:
        runs.append(R(text, size, ESCURO, False))
    return runs


def annex_col(s, x, y, w, h, accent, title, blocks, bsize=6.6):
    c = rect(s, x, y, w, h, AREIA, line=BEGE, line_w=Pt(0.8),
             shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    c.adjustments[0] = 0.02
    rect(s, x, y+Inches(0.14), Inches(0.07), h-Inches(0.28), accent,
         shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    paras = [[R(title, 9.5, PETROLEO, True)]]
    for kind, text in blocks:
        if kind == "q":
            paras.append([R(text, 7.2, TEAL, True)])
        else:
            paras.append(annex_bullet_runs(text, accent, bsize))
    tb = txt(s, x+Inches(0.2), y+Inches(0.16), w-Inches(0.34), h-Inches(0.3),
             paras, space_after=Pt(3), line_spacing=1.03)
    tb.text_frame.auto_size = MSO_AUTO_SIZE.TEXT_TO_FIT_SHAPE
    return c


NAMEC = {"petroleo": PETROLEO, "escuro": ESCURO, "teal": TEAL, "coral": CORAL,
         "menta": MENTA, "ambar": AMBAR}

s = slide(); bg(s)
header(s, "Referencia · textos originais na integra", "Anexo para consulta",
       PETROLEO, 8)
ax = Inches(0.5); ay = Inches(1.5); agap = Inches(0.3)
acw = (SW - Inches(0.5)*2 - agap*2) / 3
ach = Inches(5.4)
for ci, (ctitle, cacc, cblocks) in enumerate(ANEXO):
    annex_col(s, ax + ci*(acw+agap), ay, acw, ach, NAMEC[cacc], ctitle,
              cblocks, bsize=6.3 if ci == 2 else 6.6)

out = "/home/user/radarbazin1/Allos_Programa_Beneficios_Relatorio.pptx"
prs.save(out)
print("OK ->", out)
