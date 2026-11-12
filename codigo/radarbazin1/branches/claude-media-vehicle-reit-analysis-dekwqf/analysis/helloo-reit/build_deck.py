# -*- coding: utf-8 -*-
"""
Deck para board: "Helloo como REIT? Tese, cases e recomendacao"
Paleta ALLOS (pptallos).
"""
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.ns import qn

# ---- Paleta ALLOS ----
PETROLEO     = RGBColor(0x00, 0x61, 0x6F)
VERDE_ESCURO = RGBColor(0x0D, 0x45, 0x4A)
TEAL         = RGBColor(0x36, 0x8C, 0x82)
CORAL        = RGBColor(0xCD, 0x51, 0x51)
MENTA        = RGBColor(0x6C, 0xC6, 0x80)
AMBAR        = RGBColor(0xED, 0xA7, 0x54)
BEGE         = RGBColor(0xCC, 0xC5, 0xBC)
AREIA        = RGBColor(0xE5, 0xDE, 0xD4)
BRANCO       = RGBColor(0xFF, 0xFF, 0xFF)
SERIES = [PETROLEO, AMBAR, TEAL, CORAL, MENTA, BEGE]

prs = Presentation()
prs.slide_width  = Inches(13.333)
prs.slide_height = Inches(7.5)
SW, SH = prs.slide_width, prs.slide_height
BLANK = prs.slide_layouts[6]

EMU_IN = 914400

def slide():
    return prs.slides.add_slide(BLANK)

def bg(s, color):
    s.background.fill.solid()
    s.background.fill.fore_color.rgb = color

def rect(s, x, y, w, h, fill=None, line=None, line_w=1.0, shape=MSO_SHAPE.RECTANGLE):
    sp = s.shapes.add_shape(shape, Inches(x), Inches(y), Inches(w), Inches(h))
    sp.shadow.inherit = False
    if fill is None:
        sp.fill.background()
    else:
        sp.fill.solid(); sp.fill.fore_color.rgb = fill
    if line is None:
        sp.line.fill.background()
    else:
        sp.line.color.rgb = line; sp.line.width = Pt(line_w)
    return sp

def txt(s, x, y, w, h, runs, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP,
        space_after=6, line_spacing=1.0):
    """runs: list of paragraphs; each paragraph = list of (text, size, color, bold) tuples."""
    tb = s.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    tf.margin_left = tf.margin_right = Inches(0.05)
    tf.margin_top = tf.margin_bottom = Inches(0.02)
    for i, para in enumerate(runs):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.space_after = Pt(space_after)
        p.space_before = Pt(0)
        p.line_spacing = line_spacing
        for (t, size, color, bold) in para:
            r = p.add_run(); r.text = t
            r.font.size = Pt(size); r.font.color.rgb = color
            r.font.bold = bold; r.font.name = "Calibri"
    return tb

def bullets(s, x, y, w, h, items, size=14, color=VERDE_ESCURO, gap=8,
            marker_color=TEAL, line_spacing=1.05):
    tb = s.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame; tf.word_wrap = True
    for i, item in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_after = Pt(gap); p.space_before = Pt(0); p.line_spacing = line_spacing
        # support (bold_lead, rest) tuple or plain string
        rm = p.add_run(); rm.text = "■  "
        rm.font.size = Pt(size); rm.font.color.rgb = marker_color; rm.font.bold = True
        rm.font.name = "Calibri"
        if isinstance(item, tuple):
            lead, rest = item
            r1 = p.add_run(); r1.text = lead
            r1.font.size = Pt(size); r1.font.color.rgb = color; r1.font.bold = True
            r1.font.name = "Calibri"
            if rest:
                r2 = p.add_run(); r2.text = rest
                r2.font.size = Pt(size); r2.font.color.rgb = color; r2.font.bold = False
                r2.font.name = "Calibri"
        else:
            r = p.add_run(); r.text = item
            r.font.size = Pt(size); r.font.color.rgb = color; r.font.bold = False
            r.font.name = "Calibri"
    return tb

def header(s, kicker, title, page):
    """Cabecalho padrao em slides claros."""
    rect(s, 0, 0, 13.333, 0.18, fill=PETROLEO)
    txt(s, 0.6, 0.42, 11, 0.4, [[(kicker.upper(), 12, TEAL, True)]], space_after=0)
    txt(s, 0.6, 0.72, 12.1, 0.9, [[(title, 27, PETROLEO, True)]], space_after=0)
    rect(s, 0.62, 1.55, 1.6, 0.05, fill=AMBAR)
    # page number
    txt(s, 12.3, 7.02, 0.8, 0.35, [[(str(page), 11, BEGE, False)]], align=PP_ALIGN.RIGHT, space_after=0)
    txt(s, 0.6, 7.02, 6, 0.35, [[("Helloo × REIT  |  Análise para o board  |  Confidencial", 9, BEGE, False)]], space_after=0)

def card(s, x, y, w, h, title, value, sub, accent=PETROLEO, value_color=None):
    rect(s, x, y, w, h, fill=AREIA, line=BEGE, line_w=1.25)
    rect(s, x, y, 0.09, h, fill=accent)
    vy = y + 0.18
    txt(s, x+0.25, vy, w-0.4, 0.35, [[(title.upper(), 10.5, TEAL, True)]], space_after=0)
    txt(s, x+0.22, vy+0.32, w-0.4, 0.6, [[(value, 25, value_color or PETROLEO, True)]], space_after=0)
    txt(s, x+0.25, vy+0.92, w-0.45, h-1.0, [[(sub, 11, VERDE_ESCURO, False)]], space_after=0, line_spacing=1.02)

# =====================================================================
# SLIDE 1 — CAPA
# =====================================================================
s = slide(); bg(s, VERDE_ESCURO)
rect(s, 0, 0, 13.333, 0.25, fill=PETROLEO)
rect(s, 0, 7.25, 13.333, 0.25, fill=TEAL)
txt(s, 0.9, 1.5, 11.5, 0.5, [[("ANÁLISE ESTRATÉGICA  •  MÍDIA OOH × ESTRUTURA DE CAPITAL", 13, TEAL, True)]], space_after=0)
txt(s, 0.85, 2.15, 11.7, 1.8,
    [[("Explorar a Helloo como um REIT?", 44, AREIA, True)],
     [("Tese, cases comparáveis e recomendação de estrutura", 22, BEGE, False)]],
    space_after=10)
rect(s, 0.92, 4.35, 2.2, 0.06, fill=AMBAR)
txt(s, 0.9, 4.7, 11, 1.2,
    [[("A pergunta: faz sentido estruturar um veículo de mídia digital de elevador/prédios", 15, AREIA, False)],
     [("(DOOH) dentro de uma estrutura tipo REIT — à luz da cobertura da Green Street?", 15, AREIA, False)]],
    space_after=4, line_spacing=1.1)
txt(s, 0.9, 6.6, 11.5, 0.4, [[("Preparado para discussão de board  •  Junho 2026", 12, BEGE, False)]], space_after=0)

# =====================================================================
# SLIDE 2 — SUMARIO EXECUTIVO / RECOMENDACAO (BLUF)
# =====================================================================
s = slide(); bg(s, BRANCO)
header(s, "Sumário executivo — direto ao ponto", "A resposta curta para o board", 2)
# Veredito box
rect(s, 0.6, 1.75, 12.13, 1.35, fill=PETROLEO)
txt(s, 0.9, 1.9, 11.6, 1.1,
    [[("Veredito: ", 17, AMBAR, True),
      ("mídia OOH ", 17, AREIA, False),
      ("já virou REIT (billboards). Mídia ", 17, AREIA, False),
      ("de elevador/indoor como a Helloo, não — ", 17, AREIA, True),
      ("e não se enquadra como REIT/FII.", 17, AREIA, False)],
     [("O ativo da Helloo é contrato + recebível publicitário, não imóvel. A via correta no Brasil é securitizar recebíveis (FIDC), não um fundo imobiliário.", 13.5, BEGE, False)]],
    space_after=8, line_spacing=1.08)
card(s, 0.6, 3.4, 3.86, 3.2, "O precedente real",
     "2 REITs", "Lamar (2014) e Outfront/CBS (2014) converteram OOH em REIT — mas com base em outdoors = real property (IRS §1033(g)(3)).", accent=TEAL)
card(s, 4.73, 3.4, 3.86, 3.2, "Por que Helloo difere",
     "Locatária", "Helloo não é dona dos prédios — instala telas em condomínios de terceiros. Sem imóvel, não há 'real property' nem 'rents'.", accent=CORAL, value_color=CORAL)
card(s, 8.86, 3.4, 3.86, 3.2, "Recomendação",
     "FIDC", "Securitizar os recebíveis dos contratos de anunciantes. FII e CRI estão descartados por falta de natureza imobiliária.", accent=MENTA, value_color=PETROLEO)

# =====================================================================
# SLIDE 3 — A TESE
# =====================================================================
s = slide(); bg(s, BRANCO)
header(s, "A tese", "Por que a pergunta faz sentido", 3)
txt(s, 0.6, 1.8, 12, 0.7,
    [[("A intuição é correta: ", 15, VERDE_ESCURO, True),
      ("ativo físico de longa duração + fluxo de 'aluguel' previsível ligado a uma localização = candidato natural a REIT.", 15, VERDE_ESCURO, False)]],
    space_after=0, line_spacing=1.1)
bullets(s, 0.6, 2.65, 12.1, 3.6, [
    ("Lógica do REIT: ", "elimina o imposto corporativo na entidade em troca de distribuir ≥90% do lucro aos cotistas. Premia negócios intensivos em ativo com caixa estável."),
    ("Onde já funcionou além do 'tijolo': ", "torres de telecom (American Tower, Crown Castle), data centers, e — o caso mais próximo — outdoors/billboards."),
    ("O teste decisivo: ", "a renda precisa ser 'rents from real property' (≥75% da receita bruta). Ou seja, o veículo tem de DETER um imóvel/estrutura permanente e alugá-lo."),
    ("Onde a tese quebra para a Helloo: ", "mídia de elevador não aluga imóvel — vende espaço publicitário (serviço). A receita é operacional/ativa, não aluguel passivo de 'real property'."),
], size=14.5, gap=14)
rect(s, 0.6, 6.45, 12.13, 0.75, fill=AREIA, line=BEGE, line_w=1.25)
txt(s, 0.85, 6.56, 11.7, 0.6,
    [[("Conclusão da tese:  ", 13.5, PETROLEO, True),
      ("a estrutura REIT recompensa quem é dono do espaço — não quem opera mídia dentro do espaço de outro.", 13.5, VERDE_ESCURO, False)]],
    space_after=0, anchor=MSO_ANCHOR.MIDDLE)

# =====================================================================
# SLIDE 4 — CASES SEMELHANTES (OOH -> REIT)
# =====================================================================
s = slide(); bg(s, BRANCO)
header(s, "Cases semelhantes", "Mídia OOH que virou REIT — os precedentes", 4)
# 3 colunas: Lamar, Outfront, Clear Channel
def case_col(x, name, tag, tag_color, lines):
    rect(s, x, 1.8, 3.86, 4.5, fill=AREIA, line=BEGE, line_w=1.25)
    rect(s, x, 1.8, 3.86, 0.7, fill=PETROLEO)
    txt(s, x+0.22, 1.9, 3.5, 0.5, [[(name, 16, AREIA, True)]], space_after=0, anchor=MSO_ANCHOR.MIDDLE)
    rect(s, x+0.22, 2.62, 1.5, 0.34, fill=tag_color)
    txt(s, x+0.22, 2.63, 1.5, 0.32, [[(tag, 10.5, BRANCO, True)]], align=PP_ALIGN.CENTER, space_after=0, anchor=MSO_ANCHOR.MIDDLE)
    bullets(s, x+0.22, 3.08, 3.5, 3.1, lines, size=11.5, gap=7, line_spacing=1.02)

case_col(0.6, "Lamar Advertising", "REIT desde 2014", MENTA, [
    "Pediu ruling ao IRS em nov/2012; PLR favorável em 23/abr/2014.",
    "Eleição como REIT retroativa a 1º/jan/2014.",
    "Driblou a 'no-rule list' via eleição §1033(g)(3) (outdoor = real property).",
    "IRS confirmou: aluguel de espaço no painel = 'rents from real property'.",
])
case_col(4.73, "Outfront (ex-CBS)", "REIT desde 2014", MENTA, [
    "Spin-off da CBS: IPO de 19% em mar/2014.",
    "PLR favorável do IRS em 16/abr/2014.",
    "Separação total da CBS em 16/jul/2014; opera como REIT desde 17/jul/2014.",
    "Rebatizada Outfront Media (NYSE: OUT) em nov/2014.",
])
case_col(8.86, "Clear Channel Out.", "NÃO converteu", CORAL, [
    "Explorou a ideia, mas não executou.",
    "Alavancagem alta (~7–8x meta p/ 2028) é incompatível com distribuir 90%.",
    "Sem REIT = sem obrigação de dividendo; prioriza reduzir dívida.",
    "Mostra que o gatilho não é só jurídico — é estrutura de capital.",
])

# =====================================================================
# SLIDE 5 — O PONTO CRITICO: DONO vs LOCATARIO
# =====================================================================
s = slide(); bg(s, BRANCO)
header(s, "O ponto crítico", "Billboard vira REIT; mídia de elevador, não — eis o porquê", 5)
# Duas colunas comparativas
rect(s, 0.6, 1.8, 5.95, 4.55, fill=AREIA, line=MENTA, line_w=1.75)
rect(s, 0.6, 1.8, 5.95, 0.62, fill=TEAL)
txt(s, 0.8, 1.88, 5.6, 0.5, [[("BILLBOARD (Lamar/Outfront)  →  cabe em REIT", 13.5, AREIA, True)]], space_after=0, anchor=MSO_ANCHOR.MIDDLE)
bullets(s, 0.82, 2.6, 5.5, 3.6, [
    ("Dono da estrutura: ", "a empresa POSSUI o painel, fixado permanentemente ao solo/estrutura."),
    ("Real property: ", "outdoor com eleição §1033(g)(3) é 'estrutura inerentemente permanente' (Treas. Reg. §1.856-10, regs finais de 2016)."),
    ("Renda qualificada: ", "aluga o espaço do painel ao anunciante = 'rents from real property'."),
    ("Resultado: ", "passa nos testes de 75%/95% de renda imobiliária."),
], size=12.5, gap=9, marker_color=MENTA)

rect(s, 6.78, 1.8, 5.95, 4.55, fill=AREIA, line=CORAL, line_w=1.75)
rect(s, 6.78, 1.8, 5.95, 0.62, fill=CORAL)
txt(s, 6.98, 1.88, 5.6, 0.5, [[("ELEVADOR/INDOOR (Helloo)  →  não cabe", 13.5, BRANCO, True)]], space_after=0, anchor=MSO_ANCHOR.MIDDLE)
bullets(s, 7.0, 2.6, 5.5, 3.6, [
    ("Não é dona do imóvel: ", "instala telas em prédios de terceiros via contrato de licença de espaço."),
    ("Sem real property: ", "tela é bem móvel/equipamento; contrato de exibição é serviço — nenhum é 'imóvel'."),
    ("Renda operacional: ", "vende publicidade (verba de anunciante), não aluguel passivo de imóvel."),
    ("Resultado: ", "reprova nos testes de renda imobiliária do REIT (e do FII)."),
], size=12.5, gap=9, marker_color=CORAL)
txt(s, 0.6, 6.55, 12.1, 0.6,
    [[("Em uma frase: ", 13.5, PETROLEO, True),
      ("o REIT recompensa o DONO do espaço; a Helloo é OPERADORA de mídia dentro do espaço de outro.", 13.5, VERDE_ESCURO, False)]],
    space_after=0)

# =====================================================================
# SLIDE 6 — GREEN STREET
# =====================================================================
s = slide(); bg(s, BRANCO)
header(s, "O que a Green Street diz", "Onde billboards entram (e onde não entram) na cobertura", 6)
bullets(s, 0.6, 1.8, 6.0, 4.6, [
    ("Billboard NÃO é setor próprio na Green Street: ", "não está no índice de preços (CPPI) nem nas listas públicas de setores."),
    ("Atenção a uma confusão comum: ", "o 'Billboard REIT Index' que aparece em buscas é da Hoya Capital — não da Green Street."),
    ("A Green Street cobre o 'não-tradicional': ", "data centers, torres, gaming, self-storage, net/ground lease, cold storage, life science, senior/student housing."),
    ("Nova vertical de Infraestrutura (2025): ", "torres, data centers, aeroportos, rodovias, ferrovias — convergência infra × real estate."),
], size=13, gap=11)
# painel destaque
rect(s, 6.85, 1.8, 5.88, 4.55, fill=VERDE_ESCURO)
txt(s, 7.1, 2.0, 5.4, 0.5, [[("A LEITURA PARA O BOARD", 12, AMBAR, True)]], space_after=0)
bullets(s, 7.1, 2.55, 5.4, 3.7, [
    "A Green Street é simpática à tese 'fluxo previsível + ativo físico = real estate' — mas a aplica a torres e data centers, não a billboards.",
    "Jim Sullivan (Green Street): as tendências de crescimento das torres superam 'a maioria dos tipos tradicionais de real estate'.",
    "Tem prática de advisory de 'REIT conversion' e diz que o mercado está aberto a IPOs de REITs não-tradicionais.",
    "Sinal: a fronteira do 'novo REIT' hoje é infra/digital — mídia indoor não está no radar como real estate.",
], size=11.5, color=AREIA, gap=9, marker_color=AMBAR)

# =====================================================================
# SLIDE 7 — PRECEDENTE INFRA-REIT + PLAYERS INDOOR
# =====================================================================
s = slide(); bg(s, BRANCO)
header(s, "Mapa de comparáveis", "Do 'infra-REIT' à mídia indoor — quem é REIT e quem não é", 7)
# tabela simples desenhada
rows = [
    ("Empresa / ativo", "Tipo de ativo", "Estrutura", "REIT/FII?"),
    ("American Tower / Crown Castle", "Torres de telecom (dono)", "REIT (EUA)", "SIM"),
    ("Lamar / Outfront", "Outdoors/billboards (dono)", "REIT (EUA)", "SIM"),
    ("Focus Media (China)", "Mídia de elevador", "Media company (bolsa)", "NÃO"),
    ("Captivate (EUA)", "Mídia de elevador/lobby", "Private equity / TEGNA", "NÃO"),
    ("Eletromidia (Brasil)", "OOH/DOOH (concessão+licença)", "Operacional (Globo)", "NÃO"),
    ("Helloo (Brasil)", "Mídia de elevador (licença)", "Operacional (Allos)", "NÃO"),
]
x0, y0 = 0.6, 1.85
ws = [4.4, 3.7, 3.0, 1.03]
rh = 0.66
for ri, row in enumerate(rows):
    cx = x0
    head = (ri == 0)
    for ci, cell in enumerate(row):
        fill = PETROLEO if head else (AREIA if ri % 2 else BRANCO)
        cellrect = rect(s, cx, y0 + ri*rh, ws[ci], rh, fill=fill, line=BEGE, line_w=0.75)
        col = AREIA if head else VERDE_ESCURO
        bold = head
        align = PP_ALIGN.CENTER if ci == 3 else PP_ALIGN.LEFT
        if ci == 3 and not head:
            col = MENTA if cell == "SIM" else CORAL
            bold = True
        txt(s, cx+0.12, y0 + ri*rh, ws[ci]-0.2, rh,
            [[(cell, 11.5 if not head else 11.5, col, bold)]],
            align=align, space_after=0, anchor=MSO_ANCHOR.MIDDLE)
        cx += ws[ci]
txt(s, 0.6, y0 + len(rows)*rh + 0.18, 12.1, 0.7,
    [[("Padrão claro: ", 13, PETROLEO, True),
      ("quem é DONO do ativo físico (torre, painel) vira REIT. Quem OPERA mídia indoor sob licença permanece empresa operacional — em todos os mercados.", 13, VERDE_ESCURO, False)]],
    space_after=0, line_spacing=1.08)

# =====================================================================
# SLIDE 8 — LEGISLACAO BRASIL
# =====================================================================
s = slide(); bg(s, BRANCO)
header(s, "Legislação — Brasil", "FII, FIDC, CRI: qual estrutura cabe à Helloo", 8)
rows = [
    ("Objetivo", "Veículo", "Base legal", "Cabe à Helloo?"),
    ("Deter o imóvel (laje, prédio, terreno)", "FII", "Lei 8.668/93; Res. CVM 175, Anexo III", "NÃO"),
    ("Publicidade em fachada de imóvel próprio", "FII (receita acessória)", "Res. CVM 175", "NÃO"),
    ("Securitizar recebíveis de anunciantes", "FIDC", "Res. CVM 175, Anexo II", "SIM"),
    ("Emissão pública lastreada em recebíveis", "CR genérico (securitizadora)", "Lei 14.430/2022", "ALT."),
    ("Lastro imobiliário específico", "CRI", "Lei 14.430/2022", "NÃO"),
]
x0, y0 = 0.6, 1.85
ws = [4.5, 3.25, 3.4, 0.98]
rh = 0.62
for ri, row in enumerate(rows):
    cx = x0
    head = (ri == 0)
    for ci, cell in enumerate(row):
        fill = PETROLEO if head else (AREIA if ri % 2 else BRANCO)
        rect(s, cx, y0 + ri*rh, ws[ci], rh, fill=fill, line=BEGE, line_w=0.75)
        col = AREIA if head else VERDE_ESCURO
        bold = head
        align = PP_ALIGN.CENTER if ci == 3 else PP_ALIGN.LEFT
        if ci == 3 and not head:
            if cell == "SIM": col, bold = MENTA, True
            elif cell == "NÃO": col, bold = CORAL, True
            else: col, bold = AMBAR, True
        txt(s, cx+0.12, y0 + ri*rh, ws[ci]-0.2, rh,
            [[(cell, 11, col, bold)]], align=align, space_after=0, anchor=MSO_ANCHOR.MIDDLE)
        cx += ws[ci]
yb = y0 + len(rows)*rh + 0.16
bullets(s, 0.6, yb, 12.1, 1.3, [
    ("FII não serve: ", "telas e contratos de mídia não são 'empreendimento imobiliário' — não há FII de mídia/OOH na B3 (nem de torres de telecom)."),
    ("Marco da Securitização (Lei 14.430/22): ", "criou o CR genérico — securitiza qualquer recebível. Mas isenção de IR para PF só vale p/ CRI/CRA, não p/ CR genérico."),
], size=12, gap=8)

# =====================================================================
# SLIDE 9 — RECOMENDACAO
# =====================================================================
s = slide(); bg(s, BRANCO)
header(s, "Recomendação", "O caminho para a Helloo acessar o mercado de capitais", 9)
# 3 niveis: recomendado / alternativa / descartado
rect(s, 0.6, 1.8, 12.13, 1.5, fill=MENTA)
txt(s, 0.85, 1.92, 11.6, 1.3,
    [[("✓  RECOMENDADO — FIDC lastreado nos recebíveis de anunciantes", 17, VERDE_ESCURO, True)],
     [("Adquire os direitos creditórios dos contratos de mídia e emite cotas (sênior/mezanino/subordinada). Antecipa caixa, permite 'true sale' (desconsolidação) e estrutura risco por tranches — perfil ideal para carteira pulverizada e recorrente de anunciantes.", 12.5, VERDE_ESCURO, False)]],
    space_after=6, line_spacing=1.06)
rect(s, 0.6, 3.45, 12.13, 1.15, fill=AREIA, line=AMBAR, line_w=1.75)
txt(s, 0.85, 3.55, 11.6, 1.0,
    [[("~  ALTERNATIVA — CR genérico via securitizadora (Lei 14.430/22)", 15, PETROLEO, True)],
     [("Rótulo de mercado de capitais e acesso a investidores de renda fixa. Custo: sem isenção de IR para pessoa física (diferente de CRI/CRA). Debênture com cessão fiduciária dos recebíveis é uma variante.", 12, VERDE_ESCURO, False)]],
    space_after=5, line_spacing=1.05)
rect(s, 0.6, 4.75, 12.13, 1.0, fill=AREIA, line=CORAL, line_w=1.75)
txt(s, 0.85, 4.84, 11.6, 0.9,
    [[("✗  DESCARTADOS — REIT, FII e CRI", 15, CORAL, True)],
     [("Todos exigem natureza imobiliária ('real property' / empreendimento imobiliário) que a Helloo não possui. A única ponte com real estate seria o FII DONO dos prédios capturar receita de mídia como item acessório — o que não monetiza o negócio da Helloo.", 12, VERDE_ESCURO, False)]],
    space_after=5, line_spacing=1.05)
rect(s, 0.6, 5.95, 12.13, 0.85, fill=PETROLEO)
txt(s, 0.85, 6.04, 11.6, 0.7,
    [[("Se o objetivo é uma TESE DE EQUITY: ", 13, AMBAR, True),
      ("o caminho do setor é equity de empresa operacional (Eletromidia/B3, Focus Media/bolsa) ou private equity — não um veículo imobiliário.", 13, AREIA, False)]],
    space_after=0, anchor=MSO_ANCHOR.MIDDLE, line_spacing=1.05)

# =====================================================================
# SLIDE 10 — PROXIMOS PASSOS
# =====================================================================
s = slide(); bg(s, VERDE_ESCURO)
rect(s, 0, 0, 13.333, 0.18, fill=PETROLEO)
txt(s, 0.6, 0.7, 11, 0.4, [[("PRÓXIMOS PASSOS", 13, AMBAR, True)]], space_after=0)
txt(s, 0.58, 1.05, 12, 0.9, [[("Como avançar a partir daqui", 28, AREIA, True)]], space_after=0)
rect(s, 0.62, 1.85, 1.6, 0.05, fill=AMBAR)
bullets(s, 0.6, 2.3, 12.1, 4.0, [
    ("Validar tributação: ", "comparar FIDC vs CR genérico com estruturador/assessor jurídico (impacto de IR e de desconsolidação de balanço)."),
    ("Mapear a carteira de recebíveis: ", "concentração por anunciante, prazo médio, inadimplência e recorrência — define a viabilidade e o rating das tranches."),
    ("Definir o objetivo real: ", "caixa/antecipação (→ FIDC) vs narrativa de 'ativo imobiliário' para investidores (→ não se sustenta juridicamente)."),
    ("Benchmark de equity: ", "se a meta é valuation tipo infraestrutura, estudar o múltiplo de Eletromidia/Focus Media como empresa operacional."),
    ("Acesso à Green Street: ", "para confirmar cobertura/visão sobre OOH, é preciso acesso autenticado ao portal de research (conteúdo não é público)."),
], size=14, color=AREIA, gap=13, marker_color=AMBAR)
rect(s, 0.6, 6.7, 12.13, 0.62, fill=PETROLEO)
txt(s, 0.85, 6.75, 11.7, 0.5,
    [[("Nota: ", 11.5, AMBAR, True),
      ("análise estratégica baseada em fontes públicas — não constitui aconselhamento jurídico, tributário ou de investimento.", 11.5, BEGE, False)]],
    space_after=0, anchor=MSO_ANCHOR.MIDDLE)

prs.save("/home/user/radarbazin1/scratchpad/Helloo_REIT_Board_ALLOS.pptx")
print("OK - deck salvo")
