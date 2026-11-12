# -*- coding: utf-8 -*-
"""Gera Racional-Retrofit-Shoppings.pptx — deck para o board.
Tema corporativo claro. Inclui dois slides reservados para a planilha (TIR/NPV)."""
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
import os

FONT = "Calibri"; FONTH = "Calibri"
# ===== PALETA OFICIAL ALLOS (skill pptallos) — só estas cores =====
PETROLEO = 0x00616F   # primária: títulos, cabeçalhos, marca
VERDE    = 0x0D454A   # texto sobre claro; fundos escuros; footers
TEAL_    = 0x368C82   # secundária: subtítulos, ícones, destaques
CORAL    = 0xCD5151   # alertas, queda, dados negativos
MENTA    = 0x6CC680   # sucesso, crescimento, dados positivos
AMBAR    = 0xEDA754   # destaques, KPIs, atenção média
BEGE     = 0xCCC5BC   # bordas, divisores, neutros
AREIA    = 0xE5DED4   # fundos claros, cards, respiro

def C(h):
    return RGBColor((h >> 16) & 0xFF, (h >> 8) & 0xFF, h & 0xFF)
def tint(h, t):  # opacidade da cor sobre branco (t=fração de cor)
    r, g, b = (h >> 16) & 0xFF, (h >> 8) & 0xFF, h & 0xFF
    return RGBColor(int(r*t + 255*(1-t)), int(g*t + 255*(1-t)), int(b*t + 255*(1-t)))
def blend(h1, h2, t):  # mistura de duas cores da paleta (t=fração de h1)
    r1, g1, b1 = (h1 >> 16) & 0xFF, (h1 >> 8) & 0xFF, h1 & 0xFF
    r2, g2, b2 = (h2 >> 16) & 0xFF, (h2 >> 8) & 0xFF, h2 & 0xFF
    return RGBColor(int(r1*t + r2*(1-t)), int(g1*t + g2*(1-t)), int(b1*t + b2*(1-t)))

# mapeamento para os nomes usados no deck
BG    = C(0xFFFFFF)
PANEL = C(AREIA)
CARD  = C(0xFFFFFF)
LINE  = C(BEGE)
NAVY  = C(PETROLEO)
TEAL  = C(TEAL_)
TXT   = C(VERDE)
MUT   = tint(VERDE, 0.55)
GREEN = blend(MENTA, VERDE, 0.62)   # verde positivo legível sobre claro
RED   = C(CORAL)
AMBER = blend(AMBAR, VERDE, 0.55)   # âmbar legível sobre claro
WHITE = C(0xFFFFFF)
LIGHTG= tint(MENTA, 0.20)
LIGHTR= tint(CORAL, 0.15)
LIGHTA= tint(AMBAR, 0.22)
NAVYBG= C(PETROLEO)
# tons para fundos escuros (capa/painéis) e bordas semânticas
DK_KICK   = tint(TEAL_, 0.55)
DK_SUB    = C(AREIA)
DK_BODY   = C(BEGE)
DK_FOOT   = tint(TEAL_, 0.40)
DK_INNER  = C(VERDE)
BORD_POS  = tint(MENTA, 0.50)
BORD_ALERT= tint(CORAL, 0.45)
BORD_AMBER= tint(AMBAR, 0.55)

# ===== DADOS REAIS DO ATIVO (planilha preenchida — jul/2026) =====
# Inputs: NOI R$ 84,1 mi · Capex R$ 23,5 mi (7+7+9,5) · WACC 12% · cap 8,5%/9,0%
#         declínio base 2% + aceleração concorrencial 2% = 4% · θ 80%
R_NPV="R$ 136,6 mi"; R_TIR="45%"; R_HURDLE="12%"; R_PAYBACK="4 anos"
R_THETA="6,3%"; R_MARGEM="73,7 p.p."; R_DVAL="R$ 301,9 mi"; R_IL="6,8x"
R_CAPEX="R$ 23,5 mi"; R_NOI="R$ 84,1 mi"; R_DEFF="4%"
# cenários de concorrência (θ* · NPV)
R_SCEN=[("Sem concorrente (2%)","θ* 9,1%","NPV R$ 70,7 mi",RED),
        ("Concorrente anunciou (3%)","θ* 7,2%","NPV R$ 104,9 mi",AMBER),
        ("Concorrente entregou (4%)","θ* 6,3%","NPV R$ 136,6 mi",GREEN)]
# ===== BREAKEVEN DE CRESCIMENTO POR ATIVO (dados reais; independe da aceleração) =====
# Capex: Praça R$ 7 mi · Estacionamento R$ 7 mi · Banheiros R$ 9,5 mi (total 23,5)
FC_CAPEX="R$ 7 mi"; FC_VENDASM2="R$ 51.250"; FC_NOIM2="R$ 3.263"; FC_NOI="R$ 4,7 mi"
FC_BE="+15,6%"; FC_ALVO="R$ 59.267"; FC_ANOS="~2,2 anos"; FC_HIST="7,1%"; FC_UPLIFT="+R$ 8.017"
PK_CAPEX="R$ 7 mi"; PK_TAR="R$ 20,68"; PK_VOL="1,1 mi tickets"; PK_NOI="R$ 17,5 mi"
PK_BE="+4,2%"; PK_DTAR="+R$ 0,88"; PK_TARALVO="R$ 21,56"; PK_DVOL="+46.553 veículos/ano"
BN_CAPEX="R$ 9,5 mi"; R_NOI_ATIVO="R$ 84,1 mi"

prs = Presentation(); prs.slide_width = Inches(13.333); prs.slide_height = Inches(7.5)
blank = prs.slide_layouts[6]
SW, SH = 13.333, 7.5

def slide(bg=BG):
    s = prs.slides.add_slide(blank)
    s.background.fill.solid(); s.background.fill.fore_color.rgb = bg
    return s

def box(s, l, t, w, h, fill=None, line=None, lw=1.0, shape=MSO_SHAPE.RECTANGLE, rad=None):
    sp = s.shapes.add_shape(shape, Inches(l), Inches(t), Inches(w), Inches(h))
    sp.shadow.inherit = False
    if fill is None: sp.fill.background()
    else: sp.fill.solid(); sp.fill.fore_color.rgb = fill
    if line is None: sp.line.fill.background()
    else: sp.line.color.rgb = line; sp.line.width = Pt(lw)
    sp.text_frame.clear()
    return sp

def txt(s, l, t, w, h, runs, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, sa=4, sl=None):
    tb = s.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h)); tf = tb.text_frame
    tf.word_wrap = True; tf.vertical_anchor = anchor
    for i, item in enumerate(runs):
        text, size, color, bold = item[0], item[1], item[2], item[3]
        italic = item[4] if len(item) > 4 else False
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align; p.space_after = Pt(sa); p.space_before = Pt(0)
        if sl: p.line_spacing = sl
        r = p.add_run(); r.text = text
        r.font.size = Pt(size); r.font.color.rgb = color; r.font.bold = bold
        r.font.italic = italic; r.font.name = FONT
    return tb

def bullets(s, l, t, w, h, items, size=14, color=TXT, gap=7, marker="•", mcol=TEAL, sl=1.05):
    tb = s.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h)); tf = tb.text_frame
    tf.word_wrap = True
    for i, it in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_after = Pt(gap); p.space_before = Pt(0); p.line_spacing = sl
        if isinstance(it, tuple):
            head, body = it
            r = p.add_run(); r.text = f"{marker} "; r.font.size = Pt(size); r.font.color.rgb = mcol; r.font.bold = True; r.font.name = FONT
            r = p.add_run(); r.text = head + " "; r.font.size = Pt(size); r.font.color.rgb = NAVY; r.font.bold = True; r.font.name = FONT
            r = p.add_run(); r.text = body; r.font.size = Pt(size); r.font.color.rgb = color; r.font.name = FONT
        else:
            r = p.add_run(); r.text = f"{marker} "; r.font.size = Pt(size); r.font.color.rgb = mcol; r.font.bold = True; r.font.name = FONT
            r = p.add_run(); r.text = it; r.font.size = Pt(size); r.font.color.rgb = color; r.font.name = FONT
    return tb

def header(s, kicker, title, n=None):
    box(s, 0, 0, SW, 1.28, fill=PANEL)
    box(s, 0, 1.28, SW, 0.035, fill=TEAL)
    txt(s, 0.7, 0.22, 11.5, 0.35, [(kicker.upper(), 11, TEAL, True)])
    txt(s, 0.7, 0.5, 11.9, 0.7, [(title, 23, NAVY, True)])
    if n:
        b = box(s, 12.25, 0.34, 0.62, 0.62, fill=NAVY, shape=MSO_SHAPE.OVAL)
        b.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = b.text_frame.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
        r = p.add_run(); r.text = str(n); r.font.size = Pt(15); r.font.bold = True; r.font.color.rgb = WHITE; r.font.name = FONT

def footer(s, n):
    txt(s, 0.7, 7.08, 8, 0.3, [("Retrofit de Shoppings · Racional de Investimento · Confidencial", 8.5, MUT, False)])
    txt(s, 11.8, 7.08, 1.2, 0.3, [(str(n), 9, MUT, False)], align=PP_ALIGN.RIGHT)

def card(s, l, t, w, h, fill=CARD, line=LINE, top=None, topcol=None):
    box(s, l, t, w, h, fill=fill, line=line)
    if top: box(s, l, t, w, 0.08, fill=topcol)

PAGE = 0
def pg():
    global PAGE; PAGE += 1; return PAGE

# =====================================================================================
# 1 — CAPA
# =====================================================================================
s = slide(NAVYBG)
box(s, 0, 0, SW, SH, fill=NAVYBG)
box(s, 0.9, 2.55, 3.2, 0.09, fill=TEAL)
txt(s, 0.85, 1.5, 11.6, 0.5, [("PROPOSTA AO BOARD", 13, DK_KICK, True)])
txt(s, 0.85, 2.75, 11.8, 1.6, [("Investir em retrofit para proteger o valor do ativo", 38, WHITE, True)], sl=1.0)
txt(s, 0.85, 4.35, 11.6, 0.6, [("Estacionamentos · Banheiros · Praças de alimentação", 18, DK_SUB, False)])
txt(s, 0.85, 5.15, 11.6, 1.0,
    [("Por que estes investimentos defensivos preservam vendas, NOI e valuation — "
      "e por que a urgência aumenta quando um concorrente se moderniza.", 14, DK_BODY, False, True)], sl=1.15)
txt(s, 0.85, 6.75, 11.6, 0.4, [("Comitê de Investimentos · 2026", 12, DK_FOOT, False)])

# =====================================================================================
# 2 — SUMÁRIO EXECUTIVO
# =====================================================================================
s = slide(); n = pg()
header(s, "Sumário executivo", "A pergunta do board — e a resposta em uma linha", n)
# bloco pergunta
card(s, 0.7, 1.6, 11.93, 1.15, fill=PANEL, line=LINE)
txt(s, 1.0, 1.74, 11.4, 0.4, [("A PERGUNTA", 11, MUT, True)])
txt(s, 1.0, 2.06, 11.4, 0.6,
    [("“Se o retrofit não faz as vendas e o NOI crescerem, qual é o retorno do investimento?”", 16, NAVY, True, True)])
# bloco resposta
card(s, 0.7, 2.95, 11.93, 1.35, fill=LIGHTG, line=BORD_POS)
txt(s, 1.0, 3.1, 11.4, 0.4, [("A RESPOSTA", 11, GREEN, True)])
txt(s, 1.0, 3.42, 11.4, 0.85,
    [("O retorno é o declínio EVITADO. Retrofit é capex defensivo: preserva fluxo, vendas e NOI, "
      "e protege o valuation (cap rate). E vale mais — não menos — quando o concorrente se renova.", 15, TXT, False)], sl=1.1)
# 3 pilares
pil = [
 (TEAL, "ENQUADRAMENTO", "Avaliar por declínio evitado, não por NOI incremental."),
 (NAVY, "CONCORRÊNCIA", "Concorrente renovado acelera a perda e encurta a janela."),
 (GREEN, "PROVA", "Breakeven reverso: basta evitar ~6% do declínio para se pagar (NPV R$ 136,6 mi)."),
]
cw = 3.84; gap = 0.205; x0 = 0.7; y = 4.6; h = 1.95
for i, (col, tag, body) in enumerate(pil):
    cx = x0 + i*(cw+gap)
    card(s, cx, y, cw, h, top=True, topcol=col)
    txt(s, cx+0.28, y+0.32, cw-0.56, 0.4, [(tag, 12, col, True)])
    txt(s, cx+0.28, y+0.78, cw-0.56, h-0.95, [(body, 13.5, TXT, False)], sl=1.1)
footer(s, n)

# =====================================================================================
# 3 — ENQUADRAMENTO: capex defensivo vs expansão
# =====================================================================================
s = slide(); n = pg()
header(s, "O enquadramento correto", "Dois tipos de capex — duas réguas diferentes", n)
cols = [
 (NAVY, "CAPEX DE EXPANSÃO", ["Ex.: nova ABL, expansão de âncora",
   "Lógica: upside / vendas incrementais", "Métrica: NOI incremental", "Pergunta: “quanto de NOI novo gera?”"]),
 (TEAL, "CAPEX DEFENSIVO (retrofit)", ["Ex.: estacionamento, banheiro, praça",
   "Lógica: downside evitado", "Métrica: declínio de NOI evitado + cap rate", "Pergunta: “quanto perdemos se NÃO fizermos?”"]),
]
cw = 5.9; gap = 0.13; x0 = 0.7; y = 1.7; h = 3.2
for i, (col, tag, items) in enumerate(cols):
    cx = x0 + i*(cw+gap)
    card(s, cx, y, cw, h, top=True, topcol=col)
    txt(s, cx+0.32, y+0.3, cw-0.64, 0.5, [(tag, 15, col, True)])
    bullets(s, cx+0.32, y+0.95, cw-0.64, h-1.1, items, size=14, gap=9)
# faixa conclusao
card(s, 0.7, 5.15, 11.93, 1.25, fill=LIGHTA, line=BORD_AMBER)
txt(s, 1.0, 5.3, 11.4, 0.9,
    [("Cobrar do retrofit a régua do capex de expansão é o que trava a aprovação. ", 15, NAVY, True),
     ("A pergunta certa não é sobre crescimento — é sobre a perda evitada.", 15, TXT, False)], sa=2)
footer(s, n)

# =====================================================================================
# 4 — BASELINE ERRADA / ÁREA ENTRE AS CURVAS
# =====================================================================================
s = slide(); n = pg()
header(s, "O erro de enquadramento", "A baseline não é “vendas estáveis” — é o declínio", n)
# grafico esquematico
gx, gy, gw, gh = 0.9, 1.85, 7.1, 4.2
box(s, gx, gy, gw, gh, fill=PANEL, line=LINE)
# eixos
box(s, gx+0.7, gy+0.4, 0.018, gh-1.0, fill=MUT)
box(s, gx+0.7, gy+gh-0.6, gw-1.2, 0.018, fill=MUT)
txt(s, gx+0.1, gy+0.3, 0.6, 1.2, [("Vendas", 10, MUT, True), ("/ NOI", 10, MUT, True)])
txt(s, gx+gw-1.3, gy+gh-0.5, 1.2, 0.3, [("tempo", 10, MUT, True)])
# curva com retrofit (quase reta) - usar conector
from pptx.enum.shapes import MSO_CONNECTOR
def line2(s, x1, y1, x2, y2, color, w=2.5, dash=False):
    cn = s.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    cn.line.color.rgb = color; cn.line.width = Pt(w)
    if dash:
        from pptx.oxml.ns import qn
        ln = cn.line._get_or_add_ln(); d = ln.makeelement(qn('a:prstDash'), {'val':'dash'}); ln.append(d)
    return cn
x_a = gx+0.78; x_b = gx+gw-0.65
yc_top = gy+0.75
# com retrofit: leve queda
line2(s, x_a, yc_top, x_b, yc_top+0.55, GREEN, 3)
# sem retrofit: queda acentuada
line2(s, x_a, yc_top, x_b, yc_top+2.55, RED, 3)
# area entre curvas (triangulo aproximado)
tri = s.shapes.add_shape(MSO_SHAPE.RIGHT_TRIANGLE, Inches(x_a), Inches(yc_top+0.55), Inches(x_b-x_a), Inches(2.0))
tri.rotation = 0; tri.fill.solid(); tri.fill.fore_color.rgb = tint(CORAL,0.28); tri.line.fill.background(); tri.shadow.inherit=False
tri.adjustments  # keep
txt(s, x_a+1.3, yc_top+1.15, 2.6, 0.7, [("RETORNO =", 11, RED, True), ("área entre as curvas", 11, RED, True)], sa=1)
txt(s, x_b-2.6, yc_top+0.05, 2.5, 0.3, [("com retrofit", 11, GREEN, True)], align=PP_ALIGN.RIGHT)
txt(s, x_b-2.6, yc_top+2.35, 2.5, 0.3, [("sem retrofit", 11, RED, True)], align=PP_ALIGN.RIGHT)
# texto lateral
txt(s, 8.25, 1.95, 4.4, 0.6, [("A conta certa", 16, NAVY, True)])
bullets(s, 8.25, 2.6, 4.45, 3.4, [
  "O ativo se deprecia funcional e perceptualmente: a baseline real é de declínio.",
  ("O retorno não é", "Vendas_depois − Vendas_hoje."),
  ("É", "Vendas_com − Vendas_sem, ao longo do tempo."),
  "Isso inverte o ônus da prova: provar que o declínio NÃO virá é o difícil.",
], size=14, gap=11)
footer(s, n)

# =====================================================================================
# 5 — CADEIA DE CAUSALIDADE / DUPLA DESTRUIÇÃO
# =====================================================================================
s = slide(); n = pg()
header(s, "Como reforma vira fluxo de caixa", "A cadeia de causalidade — e a dupla destruição de valor", n)
steps = ["Deterioração física", "Queda de satisfação / NPS", "Menos fluxo e permanência",
         "Menos conversão e visitas", "Queda de vendas/m²", "↑ custo de ocupação",
         "↑ vacância e turnover", "Queda de NOI"]
# coluna de steps a esquerda
y = 1.7; bh = 0.535; bw = 5.3; x = 0.7
for i, st in enumerate(steps):
    cc = RED if i == len(steps)-1 else NAVY
    fl = LIGHTR if i == len(steps)-1 else PANEL
    b = box(s, x, y, bw, bh-0.07, fill=fl, line=LINE)
    b.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE
    txt(s, x+0.25, y+0.04, bw-0.4, bh-0.1, [(st, 12.5, cc, i==len(steps)-1)], anchor=MSO_ANCHOR.MIDDLE)
    y += bh
# painel dupla destruicao
px, py, pw, ph = 6.5, 1.7, 6.13, 4.3
card(s, px, py, pw, ph, fill=NAVYBG)
txt(s, px+0.4, py+0.3, pw-0.8, 0.5, [("A dupla destruição de valor", 17, WHITE, True)])
txt(s, px+0.4, py+1.0, pw-0.8, 0.9,
    [("Valor = NOI ÷ cap rate", 20, DK_KICK, True)])
bullets(s, px+0.4, py+1.95, pw-0.8, 2.2, [
  "O NOI cai (a cadeia ao lado).",
  "E o ativo é reprecificado a um cap rate PIOR: deixa de ser ‘core’, vira ‘risco/declínio’.",
  "As duas pontas pioram juntas — perda não-linear.",
], size=13.5, color=DK_BODY, mcol=TEAL, gap=10)
card(s, px+0.4, py+3.55, pw-0.8, 0.6, fill=DK_INNER)
txt(s, px+0.55, py+3.62, pw-1.1, 0.5,
    [("Evitar 25–50 bps de expansão do cap rate costuma valer mais que o capex.", 12.5, WHITE, True)], anchor=MSO_ANCHOR.MIDDLE)
footer(s, n)

# =====================================================================================
# 6 — POR QUE ESTES 3 ATIVOS
# =====================================================================================
s = slide(); n = pg()
header(s, "Onde investir primeiro", "Estacionamento, banheiros e praça: maior fricção e memória", n)
txt(s, 0.7, 1.5, 11.9, 0.45,
    [("Fluxo (footfall) e tempo de permanência (dwell time) são os ativos econômicos primários — tudo o que se vende decorre deles.", 13, MUT, False, True)])
ativos = [
 (NAVY, "ESTACIONAMENTO", "1ª e última impressão", "Fricção de acesso, insegurança percebida e evasão antes mesmo da compra; perda de capacidade no pico.", "Fluxo · receita direta · NPS de chegada"),
 (TEAL, "BANHEIROS", "Proxy da higiene de tudo", "Define o julgamento de ‘qualidade geral’; afeta desproporcionalmente público feminino e famílias — maiores decisores de gasto.", "Dwell time · satisfação · retorno"),
 (GREEN, "PRAÇA DE ALIMENTAÇÃO", "Âncora de permanência", "Cada vez mais é o motivo da visita; obsolescência encurta a permanência e entrega o cliente ao concorrente e ao delivery.", "Dwell time · footfall · A&B (alto NOI/m²)"),
]
cw = 3.84; gap = 0.205; x0 = 0.7; y = 2.05; h = 4.25
for i, (col, tag, sub, body, mets) in enumerate(ativos):
    cx = x0 + i*(cw+gap)
    card(s, cx, y, cw, h, top=True, topcol=col)
    txt(s, cx+0.28, y+0.3, cw-0.56, 0.4, [(tag, 14, col, True)])
    txt(s, cx+0.28, y+0.72, cw-0.56, 0.4, [(sub, 12, MUT, True, True)])
    txt(s, cx+0.28, y+1.25, cw-0.56, 2.0, [(body, 13, TXT, False)], sl=1.1)
    box(s, cx+0.28, y+h-1.0, cw-0.56, 0.02, fill=LINE)
    txt(s, cx+0.28, y+h-0.85, cw-0.56, 0.7, [("MÉTRICAS", 9.5, col, True), (mets, 11.5, TXT, False)], sa=2)
footer(s, n)

# =====================================================================================
# 7 — FATOR CONCORRENCIAL: mecanismos
# =====================================================================================
s = slide(); n = pg()
header(s, "Fator de aceleração concorrencial", "Quando o concorrente se moderniza, muda a natureza do problema", n)
card(s, 0.7, 1.55, 11.93, 0.95, fill=LIGHTR, line=BORD_ALERT)
txt(s, 1.0, 1.66, 11.4, 0.75,
    [("Sem concorrência, a deterioração é depreciação gradual. Com um concorrente renovado na mesma área, "
      "o declínio vira transferência ATIVA de share — e o cliente passa a ter um padrão superior a poucos km.", 14, NAVY, False)], sl=1.1)
mecs = [
 ("Deslocamento do referencial", "Satisfação é relativa: seu ativo piora ‘por comparação’, sem nada nele mudar."),
 ("Migração de lojistas", "Âncoras renovam no ativo vencedor; a saída de uma puxa as vizinhas — espiral de vacância."),
 ("Compressão do horizonte", "O declínio de 5–10 anos passa a ocorrer em 1–3. A janela de decisão encurta."),
 ("Assimetria 1º vs 2º", "Quem renova antes captura o share migrante; quem renova depois paga para recuperar — às vezes em vão."),
]
cw = 5.9; gap = 0.13; x0 = 0.7; y = 2.75; h = 1.55
for i, (head, body) in enumerate(mecs):
    cx = x0 + (i % 2)*(cw+gap); cy = y + (i//2)*(h+0.2)
    card(s, cx, cy, cw, h, fill=CARD, line=LINE)
    b = box(s, cx, cy, 0.12, h, fill=TEAL)
    txt(s, cx+0.35, cy+0.22, cw-0.6, 0.4, [(f"{i+1}.  {head}", 14.5, NAVY, True)])
    txt(s, cx+0.35, cy+0.68, cw-0.6, 0.8, [(body, 13, TXT, False)], sl=1.08)
footer(s, n)

# =====================================================================================
# 8 — FATOR CONCORRENCIAL: janela + cenários
# =====================================================================================
s = slide(); n = pg()
header(s, "Fator de aceleração concorrencial", "A pergunta deixou de ser ‘se’ — passou a ser ‘quando’", n)
# tabela de cenarios
tx, ty, tw = 0.7, 1.7, 11.93
rows = [
 ("Cenário de concorrência", "Declínio do NOI (ilustrativo)", "Implicação", None),
 ("Sem concorrente se renovando", "~2% a.a. (gradual)", "Desejável · urgência baixa", PANEL),
 ("Concorrente ANUNCIOU retrofit", "~3,5% a.a.", "Urgência média · agir antes da entrega", LIGHTA),
 ("Concorrente ENTREGOU retrofit", "~5–7% a.a. + risco de âncora", "Urgência alta · janela curta · risco de espiral", LIGHTR),
]
cwid = [4.6, 3.4, 3.93]; rh = 0.82
cy = ty
for ri, (a, b, c, fl) in enumerate(rows):
    cx = tx
    head = ri == 0
    for ci, val in enumerate([a, b, c]):
        w = cwid[ci]
        bg = NAVY if head else (fl if fl else CARD)
        bx = box(s, cx, cy, w, rh, fill=bg, line=LINE)
        bx.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE
        col = WHITE if head else (NAVY if ci == 0 else TXT)
        bold = head or ci == 0
        txt(s, cx+0.2, cy+0.05, w-0.35, rh-0.1, [(val, 12.5 if not head else 12.5, col, bold)], anchor=MSO_ANCHOR.MIDDLE)
        cx += w
    cy += rh
# frase de impacto
card(s, 0.7, ty+rh*4+0.25, 11.93, 1.4, fill=NAVYBG)
txt(s, 1.0, ty+rh*4+0.42, 11.3, 1.1,
    [("“Podemos nos dar ao luxo de ser os segundos?”", 18, WHITE, True),
     ("Cada trimestre de atraso, com o concorrente renovado, transfere fluxo, lojistas e valuation "
      "que não recuperamos na mesma proporção.", 13.5, DK_BODY, False)], sa=6)
footer(s, n)

# =====================================================================================
# 9 — COMO QUANTIFICAMOS
# =====================================================================================
s = slide(); n = pg()
header(s, "Como quantificamos o retorno", "Três abordagens — todas no modelo financeiro anexo", n)
abor = [
 (TEAL, "1 · BREAKEVEN REVERSO", "Em vez de prometer upside, calculamos quão POUCO do declínio basta evitar para se pagar.",
   "θ* = % mínimo do declínio a evitar p/ NPV = 0. Quanto menor, mais fácil aprovar."),
 (NAVY, "2 · BENCHMARK", "Comparáveis que NÃO fizeram retrofit dão a baseline empírica do declínio.",
   "Trajetória real de vendas/m², vacância e custo de ocupação em 5–10 anos."),
 (GREEN, "3 · PROTEÇÃO DE VALUATION", "Traduz para o valor do ativo: evitar a expansão do cap rate.",
   "25–50 bps evitados num ativo relevante costumam superar o capex."),
]
cw = 3.84; gap = 0.205; x0 = 0.7; y = 1.7; h = 4.0
for i, (col, tag, body, foot) in enumerate(abor):
    cx = x0 + i*(cw+gap)
    card(s, cx, y, cw, h, top=True, topcol=col)
    txt(s, cx+0.28, y+0.32, cw-0.56, 0.5, [(tag, 13.5, col, True)])
    txt(s, cx+0.28, y+1.0, cw-0.56, 1.8, [(body, 13.5, TXT, False)], sl=1.12)
    box(s, cx+0.28, y+h-1.35, cw-0.56, 0.02, fill=LINE)
    txt(s, cx+0.28, y+h-1.2, cw-0.56, 1.0, [(foot, 12, MUT, False, True)], sl=1.08)
footer(s, n)

def ilustra(s):
    txt(s, 9.0, 7.08, 3.8, 0.3, [("Valores ilustrativos — ver planilha", 8.5, MUT, False, True)], align=PP_ALIGN.RIGHT)

# =====================================================================================
# 9B — SEGUNDA PERSPECTIVA: O CRESCIMENTO NECESSÁRIO
# =====================================================================================
s = slide(); n = pg()
header(s, "Segunda perspectiva", "E se olhássemos pelo crescimento necessário?", n)
txt(s, 0.7, 1.55, 11.9, 0.85,
    [("A ótica defensiva pergunta ", 14, TXT, False), ("quanto de declínio evitar", 14, NAVY, True),
     (". Como teste de sanidade — mais conservador — esta ótica pergunta: ", 14, TXT, False),
     ("quanto de crescimento cada ativo com receita precisaria gerar para se pagar sozinho?", 14, NAVY, True)], sl=1.12)
cards = [
 (TEAL, "PRAÇA DE ALIMENTAÇÃO", "Crescimento necessário em VENDAS/m² (≈ NOI/m²).", "Comparável ao histórico de vendas/m²."),
 (NAVY, "ESTACIONAMENTO", "Crescimento necessário em FLUXO ou em TARIFA.", "Tarifa é alavanca de pricing da gestão."),
 (AMBER, "BANHEIROS", "Sem receita própria — não há breakeven de crescimento.", "Viabiliza-se pela proteção (defensivo)."),
]
cw = 3.84; gap = 0.205; x0 = 0.7; y = 2.7; h = 3.4
for i, (col, tag, body, foot) in enumerate(cards):
    cx = x0 + i*(cw+gap)
    card(s, cx, y, cw, h, top=True, topcol=col)
    txt(s, cx+0.28, y+0.32, cw-0.56, 0.5, [(tag, 13.5, col, True)])
    txt(s, cx+0.28, y+1.05, cw-0.56, 1.4, [(body, 14, TXT, False)], sl=1.12)
    box(s, cx+0.28, y+h-1.1, cw-0.56, 0.02, fill=LINE)
    txt(s, cx+0.28, y+h-0.95, cw-0.56, 0.8, [(foot, 12, MUT, False, True)], sl=1.05)
card(s, 0.7, 6.35, 11.93, 0.62, fill=LIGHTG, line=BORD_POS)
txt(s, 1.0, 6.42, 11.4, 0.5,
    [("A proteção segue sendo a justificativa primária; ", 12.5, GREEN, True),
     ("este corte mostra que o crescimento exigido para se pagar também é baixo.", 12.5, TXT, False)], anchor=MSO_ANCHOR.MIDDLE)
footer(s, n)

# =====================================================================================
# 9C — PRAÇA: CRESCIMENTO NECESSÁRIO EM VENDAS/m²
# =====================================================================================
s = slide(); n = pg()
header(s, "Praça de alimentação", "Quanto as vendas/m² precisariam crescer para se pagar", n)
# KPIs à esquerda
kp = [("Capex alocado", FC_CAPEX), ("Vendas/m²/ano atual", FC_VENDASM2), ("NOI/m²/ano atual", FC_NOIM2)]
y = 1.75
for lbl, val in kp:
    card(s, 0.7, y, 4.2, 1.05, fill=CARD, line=LINE)
    box(s, 0.7, y, 0.1, 1.05, fill=TEAL)
    txt(s, 0.95, y+0.16, 3.8, 0.4, [(lbl, 12, MUT, True)])
    txt(s, 0.95, y+0.5, 3.8, 0.5, [(val, 19, NAVY, True)])
    y += 1.2
# resultado à direita
card(s, 5.3, 1.75, 7.33, 3.45, fill=PANEL, line=LINE)
txt(s, 5.6, 1.95, 6.8, 0.4, [("BREAKEVEN DE CRESCIMENTO", 12, TEAL, True)])
txt(s, 5.6, 2.45, 6.8, 1.0, [(FC_BE, 46, GREEN, True)])
txt(s, 5.6, 3.5, 6.8, 0.5, [("de uplift sustentado em vendas/m²", 14, TXT, False)])
box(s, 5.6, 4.05, 6.7, 0.02, fill=LINE)
txt(s, 5.6, 4.2, 6.8, 0.9,
    [(FC_VENDASM2 + "  →  " + FC_ALVO + " / m²/ano", 16, NAVY, True),
     ("≈ 2,2 anos de crescimento histórico (" + FC_HIST + "/ano) antecipados", 13, MUT, False)], sa=4)
card(s, 0.7, 5.45, 11.93, 1.1, fill=LIGHTG, line=BORD_POS)
txt(s, 1.0, 5.6, 11.4, 0.85,
    [("Leitura: ", 14, GREEN, True),
     ("o retrofit precisa antecipar apenas ~2,2 anos de crescimento orgânico das vendas/m² "
      "(que já crescem " + FC_HIST + "/ano). O restante da justificativa vem da proteção do NOI.", 14, TXT, False)], sl=1.1)
footer(s, n)

# =====================================================================================
# 9D — ESTACIONAMENTO: FLUXO OU TARIFA
# =====================================================================================
s = slide(); n = pg()
header(s, "Estacionamento", "Quanto o fluxo ou a tarifa precisariam crescer", n)
kp = [("Capex alocado", PK_CAPEX), ("Tarifa média atual", PK_TAR), ("Volume anual", PK_VOL)]
y = 1.75
for lbl, val in kp:
    card(s, 0.7, y, 4.2, 1.05, fill=CARD, line=LINE)
    box(s, 0.7, y, 0.1, 1.05, fill=NAVY)
    txt(s, 0.95, y+0.16, 3.8, 0.4, [(lbl, 12, MUT, True)])
    txt(s, 0.95, y+0.5, 3.8, 0.5, [(val, 19, NAVY, True)])
    y += 1.2
# breakeven e duas alavancas
card(s, 5.3, 1.75, 7.33, 1.15, fill=PANEL, line=LINE)
txt(s, 5.6, 1.86, 6.8, 0.4, [("BREAKEVEN DE CRESCIMENTO", 11, TEAL, True)])
txt(s, 5.6, 2.2, 6.8, 0.6, [(PK_BE + "  ", 30, GREEN, True), ("em fluxo OU em tarifa", 14, TXT, False)])
lev = [
 (TEAL, "ALAVANCA 1 · TARIFA", PK_DTAR + " / ticket", PK_TAR + " → " + PK_TARALVO + "  (volume constante)"),
 (NAVY, "ALAVANCA 2 · FLUXO", PK_DVOL, PK_BE + " de fluxo  (tarifa constante)"),
]
for i, (col, tag, big, sub) in enumerate(lev):
    cx = 5.3 + i*(3.74)
    card(s, cx, 3.05, 3.55, 2.15, top=True, topcol=col)
    txt(s, cx+0.25, 3.3, 3.1, 0.4, [(tag, 11.5, col, True)])
    txt(s, cx+0.25, 3.75, 3.1, 0.6, [(big, 18, NAVY, True)])
    txt(s, cx+0.25, 4.45, 3.1, 0.7, [(sub, 12, MUT, False)], sl=1.05)
card(s, 0.7, 5.45, 11.93, 1.1, fill=LIGHTG, line=BORD_POS)
txt(s, 1.0, 5.6, 11.4, 0.85,
    [("Leitura: ", 14, GREEN, True),
     ("a tarifa é alavanca de pricing sob controle da gestão. Um reajuste de apenas " + PK_DTAR + "/ticket "
      "(" + PK_TAR + " → " + PK_TARALVO + ", ou " + PK_BE + " de fluxo) já paga o investimento — breakeven facilmente alcançável.", 14, TXT, False)], sl=1.1)
footer(s, n)

# =====================================================================================
# 9E — ABERTURA POR ATIVO + TOTALIZADOR
# =====================================================================================
s = slide(); n = pg()
header(s, "Abertura por ativo", "Capex e breakeven por ativo — com totalizador", n)
tx, ty = 0.7, 1.75
cols_w = [3.5, 1.9, 2.6, 2.3, 1.63]
headers = ["Ativo", "Capex", "NOI atribuível", "Breakeven cresc.", "% capex"]
rows_t = [
 ("Praça de alimentação", FC_CAPEX, FC_NOI, FC_BE, "30%", CARD),
 ("Estacionamento", PK_CAPEX, PK_NOI, PK_BE, "30%", CARD),
 ("Banheiros", BN_CAPEX, "—", "proteção", "40%", CARD),
 ("TOTAL", R_CAPEX, "ativo: " + R_NOI_ATIVO, "ótica defensiva", "100%", PANEL),
]
rh = 0.82; cy = ty
# cabeçalho
cx = tx
for ci, htxt in enumerate(headers):
    w = cols_w[ci]
    bx = box(s, cx, cy, w, rh, fill=NAVY, line=LINE); bx.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE
    txt(s, cx+0.15, cy+0.04, w-0.25, rh-0.08, [(htxt, 12, WHITE, True)], anchor=MSO_ANCHOR.MIDDLE,
        align=PP_ALIGN.LEFT if ci == 0 else PP_ALIGN.CENTER)
    cx += w
cy += rh
for nome, cap, noi_, be, pct, fl in rows_t:
    cx = tx; tot = nome == "TOTAL"
    for ci, val in enumerate([nome, cap, noi_, be, pct]):
        w = cols_w[ci]
        bg = PANEL if tot else CARD
        bx = box(s, cx, cy, w, rh, fill=bg, line=LINE); bx.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE
        col = NAVY if (ci == 0 or tot) else TXT
        if ci == 3 and not tot: col = GREEN
        txt(s, cx+0.15, cy+0.04, w-0.25, rh-0.08,
            [(val, 12.5 if ci == 0 else 12, col, ci == 0 or tot or ci == 3)],
            anchor=MSO_ANCHOR.MIDDLE, align=PP_ALIGN.LEFT if ci == 0 else PP_ALIGN.CENTER)
        cx += w
    cy += rh
card(s, 0.7, cy+0.2, 11.93, 1.25, fill=LIGHTG, line=BORD_POS)
txt(s, 1.0, cy+0.35, 11.4, 1.0,
    [("Totalizador (racional atual): ", 13.5, GREEN, True),
     ("o NPV defensivo do ativo inteiro (declínio evitado + proteção de cap rate) é a justificativa primária. "
      "A abertura por ativo mostra que, mesmo pela ótica de crescimento, praça e estacionamento têm breakeven baixo; "
      "banheiros entram pelo defensivo.", 13.5, TXT, False)], sl=1.1)
footer(s, n)

# =====================================================================================
# 10 — RESERVADO: RESULTADOS TIR / NPV  (placeholder planilha)
# =====================================================================================
s = slide(); n = pg()
header(s, "Resultados do modelo", "TIR · NPV · Payback — com os dados reais do ativo", n)
# 5 KPIs preenchidos
kpis = [("NPV", R_NPV, GREEN), ("TIR  (hurdle 12%)", R_TIR, NAVY),
        ("Payback", R_PAYBACK, NAVY), ("θ* (breakeven)", R_THETA, GREEN),
        ("Δ valuation", R_DVAL, GREEN)]
kw = 2.33; gx = 0.7; ky = 1.7
for i, (k, v, col) in enumerate(kpis):
    cx = gx + i*(kw+0.075)
    card(s, cx, ky, kw, 1.6, top=True, topcol=col)
    txt(s, cx+0.2, ky+0.3, kw-0.35, 0.5, [(k, 11, MUT, True)])
    txt(s, cx+0.2, ky+0.75, kw-0.35, 0.8, [(v, 18, col, True)], sl=0.95)
# premissas
card(s, 0.7, 3.55, 11.93, 1.0, fill=PANEL, line=LINE)
txt(s, 1.0, 3.68, 11.4, 0.35, [("PREMISSAS (dados do ativo)", 10.5, TEAL, True)])
txt(s, 1.0, 4.02, 11.4, 0.5,
    [("Capex " + R_CAPEX + "   ·   NOI " + R_NOI + "   ·   Declínio efetivo " + R_DEFF +
      " (2% base + 2% concorrência)   ·   Cap rate 8,5% → 9,0%   ·   θ 80%   ·   Índice de lucratividade " + R_IL, 12.5, TXT, False)])
# veredito
card(s, 0.7, 4.8, 11.93, 1.1, fill=LIGHTG, line=BORD_POS)
txt(s, 1.0, 4.95, 11.4, 0.9,
    [("APROVAR — o retrofit cria valor.  ", 15, GREEN, True),
     ("Basta evitar apenas " + R_THETA + " do declínio projetado para o NPV zerar; margem de segurança de " + R_MARGEM + ".", 14, TXT, False)], sl=1.08)
# nota de prudência
txt(s, 0.7, 6.05, 11.93, 0.7,
    [("Premissa conservadora de aceleração concorrencial (2%). Mesmo sem concorrente (declínio 2%), o projeto se paga: θ* 9,1% e NPV R$ 70,7 mi (próximo slide).", 11, MUT, False, True)], sl=1.05)
footer(s, n)

# =====================================================================================
# 11 — RESERVADO: BREAKEVEN & CENÁRIOS DE CONCORRÊNCIA (placeholder)
# =====================================================================================
s = slide(); n = pg()
header(s, "Breakeven reverso & concorrência", "Quanto do declínio basta evitar — por cenário", n)
# esquerda: conceito θ*
card(s, 0.7, 1.7, 5.6, 3.95, fill=NAVYBG)
txt(s, 1.0, 1.95, 5.0, 0.5, [("A ideia do breakeven reverso", 15, WHITE, True)])
txt(s, 1.0, 2.55, 5.0, 1.1, [("θ*", 46, DK_KICK, True)])
txt(s, 1.0, 3.7, 5.0, 1.0,
    [("é a fração MÍNIMA do declínio que o retrofit precisa evitar para o NPV zerar.", 13.5, DK_BODY, False)], sl=1.1)
card(s, 1.0, 4.8, 5.0, 0.6, fill=DK_INNER)
txt(s, 1.15, 4.87, 4.7, 0.5, [("Aqui: basta evitar " + R_THETA + " do declínio.", 12.5, WHITE, True)], anchor=MSO_ANCHOR.MIDDLE)
# direita: cenarios reais
box(s, 6.5, 1.7, 6.13, 3.95, fill=CARD, line=LINE)
txt(s, 6.8, 1.85, 5.5, 0.4, [("Cenários de concorrência (dados reais)", 13.5, NAVY, True)])
yy = 2.4
for nm, th_, npv_, col in R_SCEN:
    box(s, 6.8, yy, 5.5, 0.92, fill=PANEL, line=LINE)
    box(s, 6.8, yy, 0.1, 0.92, fill=col)
    txt(s, 7.05, yy+0.14, 3.2, 0.7, [(nm, 12.5, NAVY, True)], anchor=MSO_ANCHOR.MIDDLE)
    txt(s, 9.9, yy+0.09, 2.35, 0.8, [(th_, 16, col, True), (npv_, 11, MUT, False)], align=PP_ALIGN.RIGHT, sa=1)
    yy += 1.03
# leitura-chave
card(s, 0.7, 5.9, 11.93, 0.95, fill=LIGHTG, line=BORD_POS)
txt(s, 1.0, 6.01, 11.4, 0.75,
    [("Leitura-chave:  ", 14, GREEN, True),
     ("quanto mais o concorrente avança, MENOR o θ* e MAIOR o NPV — o retrofit fica mais fácil de justificar, não mais difícil.", 14, TXT, False)])
footer(s, n)

# =====================================================================================
# 12 — CUSTO DE NÃO FAZER
# =====================================================================================
s = slide(); n = pg()
header(s, "O custo de não fazer", "A assimetria que pesa contra o adiamento", n)
items = [
 ("Custo crescente e composto", "Reforma adiada fica mais cara; deterioração se acumula e contamina a percepção do ativo inteiro."),
 ("Recuperação é mais cara que prevenção", "Reverter um ativo já em espiral (âncoras e reputação perdidas) custa muito mais — e às vezes é irreversível."),
 ("Perda de poder de barganha", "Ativo deteriorado = renovações difíceis, mais carência, mais vacância e menos repasse de aluguel."),
 ("Entrega a vantagem competitiva", "Estacionamento, banheiro e praça são exatamente o que o e-commerce não entrega. Deixá-los cair é abrir mão do diferencial físico."),
]
y = 1.75; h = 1.18
for i, (head, body) in enumerate(items):
    card(s, 0.7, y, 11.93, h-0.12, fill=CARD, line=LINE)
    box(s, 0.7, y, 0.12, h-0.12, fill=RED)
    txt(s, 1.1, y+0.16, 11.2, 0.4, [(head, 15, NAVY, True)])
    txt(s, 1.1, y+0.58, 11.2, 0.5, [(body, 13, TXT, False)])
    y += h
footer(s, n)

# =====================================================================================
# 13 — RECOMENDAÇÃO & PRIORIZAÇÃO
# =====================================================================================
s = slide(); n = pg()
header(s, "Recomendação", "O que pedimos ao board — e como priorizamos", n)
# pedido
card(s, 0.7, 1.65, 11.93, 1.15, fill=LIGHTG, line=BORD_POS)
txt(s, 1.0, 1.78, 11.4, 0.9,
    [("Aprovar o retrofit como capex defensivo prioritário", 17, GREEN, True),
     ("avaliado por declínio evitado + proteção de valuation — não por NOI incremental.", 14, TXT, False)], sa=4)
recs = [
 ("1", "Priorizar por fricção × memória × concorrência", "Onde a deterioração mais corrói footfall/dwell e onde o concorrente mais ataca."),
 ("2", "Fasear para capturar a janela concorrencial", "Entregar antes/junto ao concorrente os itens de maior impacto perceptual."),
 ("3", "Decidir com a planilha preenchida", "Aprovar com base em TIR/NPV/Breakeven calculados sobre os dados reais do ativo."),
]
y = 3.0; h = 1.18
for num, head, body in recs:
    card(s, 0.7, y, 11.93, h-0.12, fill=CARD, line=LINE)
    b = box(s, 0.95, y+0.2, 0.66, 0.66, fill=NAVY, shape=MSO_SHAPE.OVAL)
    b.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = b.text_frame.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    rr = p.add_run(); rr.text = num; rr.font.size = Pt(16); rr.font.bold = True; rr.font.color.rgb = WHITE; rr.font.name = FONT
    txt(s, 1.85, y+0.16, 10.5, 0.4, [(head, 15, NAVY, True)])
    txt(s, 1.85, y+0.58, 10.5, 0.5, [(body, 13, TXT, False)])
    y += h
footer(s, n)

# =====================================================================================
# 14 — MÉTRICAS DE ACOMPANHAMENTO
# =====================================================================================
s = slide(); n = pg()
header(s, "Como mediremos o resultado", "Métricas de acompanhamento (baseline + trimestral)", n)
groups = [
 (TEAL, "EXPERIÊNCIA & FLUXO", ["Footfall (fluxo)", "Dwell time (permanência)", "NPS / satisfação por ponto de contato", "Taxa de conversão"]),
 (NAVY, "DESEMPENHO COMERCIAL", ["Vendas/m² dos lojistas", "Custo de ocupação (aluguel/vendas)", "Vacância", "Turnover e renovação de contratos"]),
 (GREEN, "VALOR DO ATIVO", ["Receita direta de estacionamento", "Cap rate / valuation", "NOI", "θ realizado vs projetado"]),
]
cw = 3.84; gap = 0.205; x0 = 0.7; y = 1.75; h = 4.3
for i, (col, tag, items) in enumerate(groups):
    cx = x0 + i*(cw+gap)
    card(s, cx, y, cw, h, top=True, topcol=col)
    txt(s, cx+0.28, y+0.3, cw-0.56, 0.5, [(tag, 13.5, col, True)])
    bullets(s, cx+0.28, y+0.95, cw-0.56, h-1.1, items, size=14, gap=12, mcol=col)
footer(s, n)

# =====================================================================================
# 14B — RESUMO DE VIABILIDADE: DUAS ÓTICAS
# =====================================================================================
s = slide(); n = pg()
header(s, "Resumo de viabilidade", "Duas óticas independentes confirmam o investimento", n)
# Ótica 1 — Proteção
card(s, 0.7, 1.65, 5.9, 4.05, fill=CARD, line=LINE, top=True, topcol=NAVY)
txt(s, 1.0, 1.92, 5.3, 0.4, [("ÓTICA 1 · PROTEÇÃO", 14, NAVY, True)])
txt(s, 1.0, 2.36, 5.3, 0.4, [("Preservação de NOI + cap rate · ativo inteiro (totalizador)", 11.5, MUT, True, True)])
bullets(s, 1.0, 2.95, 5.35, 2.6, [
  ("NPV defensivo", "R$ 136,6 mi (declínio evitado + proteção do valuation)."),
  ("Breakeven θ*", "basta evitar 6,3% do declínio projetado — margem de 73,7 p.p."),
  ("Δ valuation", "R$ 301,9 mi de proteção pela contenção do cap rate."),
], size=13.5, gap=11, mcol=NAVY)
card(s, 1.0, 5.05, 5.3, 0.5, fill=LIGHTG, line=BORD_POS)
txt(s, 1.15, 5.1, 5.0, 0.4, [("→ Viável no agregado, independentemente de crescimento.", 11.5, GREEN, True)], anchor=MSO_ANCHOR.MIDDLE)
# Ótica 2 — Breakeven de crescimento
card(s, 6.73, 1.65, 5.9, 4.05, fill=CARD, line=LINE, top=True, topcol=TEAL)
txt(s, 7.03, 1.92, 5.3, 0.4, [("ÓTICA 2 · BREAKEVEN DE CRESCIMENTO", 14, TEAL, True)])
txt(s, 7.03, 2.36, 5.3, 0.4, [("Crescimento necessário p/ se pagar · por ativo", 11.5, MUT, True, True)])
rows2 = [
 ("Praça", FC_BE + " em vendas/m²", "≈ 2,2 anos de crescimento histórico"),
 ("Estacionamento", PK_BE + "  (" + PK_DTAR + "/ticket)", "ou +46.553 veículos/ano"),
 ("Banheiros", "sem receita própria", "viabiliza-se pela proteção"),
]
yy = 2.95
for nm, big, sub in rows2:
    box(s, 7.03, yy, 5.3, 0.82, fill=PANEL, line=LINE)
    box(s, 7.03, yy, 0.09, 0.82, fill=TEAL)
    txt(s, 7.25, yy+0.08, 2.2, 0.7, [(nm, 12.5, NAVY, True)], anchor=MSO_ANCHOR.MIDDLE)
    txt(s, 9.2, yy+0.06, 3.0, 0.75, [(big, 12.5, GREEN, True), (sub, 10, MUT, False, True)], anchor=MSO_ANCHOR.MIDDLE, sa=1)
    yy += 0.9
# banner conclusão
card(s, 0.7, 5.95, 11.93, 1.0, fill=NAVYBG)
txt(s, 1.0, 6.08, 11.3, 0.8,
    [("Dupla confirmação:  ", 15, WHITE, True),
     ("o investimento é viável pela proteção do valor (NOI + cap rate) e, mesmo sob a ótica de crescimento, "
      "o breakeven de praça e estacionamento é baixo e plausível. Banheiros entram pelo defensivo.", 13, DK_BODY, False)], sl=1.08)
footer(s, n)

# =====================================================================================
# 15 — PRÓXIMOS PASSOS / ENCERRAMENTO
# =====================================================================================
s = slide(NAVYBG)
box(s, 0, 0, SW, SH, fill=NAVYBG)
box(s, 0.9, 1.5, 3.2, 0.09, fill=TEAL)
txt(s, 0.85, 1.75, 11.6, 0.6, [("Próximos passos", 32, WHITE, True)])
steps = [
 ("Preencher a planilha", "Inserir os dados reais do ativo na aba Inputs de Modelo-Breakeven-Reverso.xlsx."),
 ("Levar TIR / NPV / Breakeven", "Transportar os resultados para os slides reservados (10 e 11)."),
 ("Definir faseamento", "Sequenciar estacionamento / banheiros / praça pela janela concorrencial."),
 ("Aprovar e medir", "Aprovar o capex defensivo e acompanhar as métricas trimestrais."),
]
y = 2.9
for i, (head, body) in enumerate(steps):
    b = box(s, 0.9, y, 0.5, 0.5, fill=TEAL, shape=MSO_SHAPE.OVAL)
    b.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = b.text_frame.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    rr = p.add_run(); rr.text = str(i+1); rr.font.size = Pt(14); rr.font.bold = True; rr.font.color.rgb = NAVYBG; rr.font.name = FONT
    txt(s, 1.6, y-0.06, 11.0, 0.4, [(head, 16, WHITE, True)])
    txt(s, 1.6, y+0.34, 11.0, 0.4, [(body, 12.5, DK_SUB, False)])
    y += 0.95
txt(s, 0.9, 6.85, 11.6, 0.4, [("Anexos: Racional (Obsidian) · Modelo-Breakeven-Reverso.xlsx", 11, DK_FOOT, False)])

out = os.path.join(os.path.dirname(__file__), "Racional-Retrofit-Shoppings.pptx")
prs.save(out)
print("salvo:", out, "| slides:", len(prs.slides._sldIdLst))
