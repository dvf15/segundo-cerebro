"""Gera o slide de highlights do Taste Lab Tijuca para apresentacao interna ALLOS.

Segue a paleta oficial ALLOS (skill pptallos). O texto dos bullets fica em uma
unica caixa de texto editavel, mantendo os placeholders (X, x,x, xx, xxx) para o
usuario preencher os dados sensiveis. Ha tambem uma area reservada para inserir a
imagem oficial do Taste Lab Tijuca.

Regenerar:  python3 build_slide.py
Requer: python-pptx
"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

# Fonte: a ALLOS usa uma sans-serif corporativa; trocar aqui se houver a fonte
# oficial instalada (ex.: a fonte da marca ALLOS). Poppins e um substituto limpo.
FONT = "Poppins"

# --- Paleta oficial ALLOS (skill pptallos) ---
PETROLEO = RGBColor(0x00, 0x61, 0x6F)  # primaria: titulos, marca
VERDE_ESC = RGBColor(0x0D, 0x45, 0x4A)  # texto sobre claro; fundos escuros
TEAL = RGBColor(0x36, 0x8C, 0x82)       # subtitulos, destaques
CORAL = RGBColor(0xCD, 0x51, 0x51)      # alertas / negativo
MENTA = RGBColor(0x6C, 0xC6, 0x80)      # sucesso / positivo
AMBAR = RGBColor(0xED, 0xA7, 0x54)      # KPIs / atencao
BEGE = RGBColor(0xCC, 0xC5, 0xBC)       # bordas, divisores
AREIA = RGBColor(0xE5, 0xDE, 0xD4)      # fundos claros, cards
BRANCO = RGBColor(0xFF, 0xFF, 0xFF)

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank = prs.slide_layouts[6]


def slide(bg=BRANCO):
    s = prs.slides.add_slide(blank)
    s.background.fill.solid()
    s.background.fill.fore_color.rgb = bg
    return s


def box(s, l, t, w, h, fill=None, line=None, line_w=1.0):
    sp = s.shapes.add_shape(1, Inches(l), Inches(t), Inches(w), Inches(h))
    sp.shadow.inherit = False
    if fill is None:
        sp.fill.background()
    else:
        sp.fill.solid(); sp.fill.fore_color.rgb = fill
    if line is None:
        sp.line.fill.background()
    else:
        sp.line.color.rgb = line; sp.line.width = Pt(line_w)
    sp.text_frame.clear()
    return sp


def txt(s, l, t, w, h, runs, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, sa=4, bullet=False):
    tb = s.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    for i, (text, size, color, bold) in enumerate(runs):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.space_after = Pt(sa)
        p.space_before = Pt(0)
        r = p.add_run()
        r.text = text
        r.font.size = Pt(size)
        r.font.color.rgb = color
        r.font.bold = bold
        r.font.name = FONT
    return tb


# ---------------------------------------------------------------------------
# Slide unico: Highlights Taste Lab Tijuca
# ---------------------------------------------------------------------------
s = slide(BRANCO)

# Faixa de titulo (petroleo)
box(s, 0, 0, 13.333, 1.25, fill=PETROLEO)
txt(s, 0.6, 0.18, 9.5, 0.6, [("Taste Lab Tijuca", 30, AREIA, True)])
txt(s, 0.6, 0.78, 9.5, 0.4, [("Highlights · Apresentação interna ALLOS", 14, BEGE, False)])
# detalhe ambar a direita
box(s, 11.3, 0.42, 1.45, 0.42, fill=AMBAR)
txt(s, 11.3, 0.45, 1.45, 0.4, [("DESTAQUES", 11, VERDE_ESC, True)], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

# Coluna esquerda: caixa de texto editavel com os bullets (texto verbatim)
LX, LY, LW, LH = 0.6, 1.55, 8.05, 5.55
box(s, LX, LY, LW, LH, fill=AREIA, line=BEGE)

bullets = [
    "X boxes em funcionamento, mais de x,x de vendas em x dias de operação;",
    "02 novos restaurantes: Coco Bambu com venda média de xx/dia e Vamo (Steak House) com venda média de xx/dia. Tendência de serem as operações número 2 e 3 em vendas absolutas dos restaurantes, ficando somente atrás do Outback;",
    "Ambiente familiar; público aproveitando não somente a área interna, mas também a externa. Paisagismo chamando muito a atenção e deixando o ambiente agradável;",
    "Repercussão positiva nas redes sociais, de forma orgânica: clientes e influenciadores trazendo a novidade, comentando sobre ambientação, operações e eventos;",
    "Rotinas de shows e transmissões de jogos criando clima de lazer e socialização do público;",
    "Fluxo do Taste tem batido uma média de xx% do fluxo total de pessoas do Shopping; no dia, temos xx mil clientes passando pelo espaço;",
    "Recorde de ocupação no último domingo, com mais de x mil clientes ao mesmo tempo no espaço; tínhamos uma atração musical em alta no RJ;",
    "De 2 a 14 de junho, bases compatíveis. Só boxes/quiosques: Tijuca 7 de 18 operações (x); Cuiabá 13 operações (x). Já estamos vendendo xx% com metade dos boxes; restaurantes devem vender na faixa de x a x MM;",
    "Último final de semana foi o primeiro final de semana com fluxo xxx no ano.",
]

# Caixa de texto unica e editavel com todos os bullets
tb = s.shapes.add_textbox(Inches(LX + 0.3), Inches(LY + 0.25), Inches(LW - 0.6), Inches(LH - 0.5))
tf = tb.text_frame
tf.word_wrap = True
tf.vertical_anchor = MSO_ANCHOR.TOP
for i, b in enumerate(bullets):
    p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
    p.alignment = PP_ALIGN.LEFT
    p.space_after = Pt(7)
    p.space_before = Pt(0)
    p.line_spacing = 1.0
    r = p.add_run()
    r.text = "•  " + b
    r.font.size = Pt(11.5)
    r.font.color.rgb = VERDE_ESC
    r.font.bold = False
    r.font.name = FONT

# Coluna direita: area reservada para imagem oficial do Taste Lab
RX, RY, RW = 8.85, 1.55, 3.9
box(s, RX, RY, RW, 3.55, fill=BEGE, line=TEAL)
txt(s, RX, RY + 1.35, RW, 0.9,
    [("\U0001F5BC", 30, PETROLEO, True),
     ("Inserir imagem oficial do Taste Lab Tijuca", 12, VERDE_ESC, True),
     ("(foto pública do espaço gastronômico)", 10, TEAL, False)],
    align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, sa=3)

# Nota de rodape sob a area de imagem: lembrete de dados sensiveis
box(s, RX, RY + 3.75, RW, 1.45, fill=PETROLEO)
txt(s, RX + 0.25, RY + 3.95, RW - 0.5, 1.1,
    [("PREENCHER", 11, AMBAR, True),
     ("Substituir os marcadores X / xx / xxx pelos dados reais antes de apresentar.", 11, AREIA, False)],
    sa=4)

# Rodape
txt(s, 0.6, 7.05, 8, 0.35, [("ALLOS · Taste Lab Tijuca — uso interno", 9, BEGE, False)])

prs.save("Taste-Lab-Tijuca-Highlights.pptx")
print("slides:", len(prs.slides._sldIdLst))
