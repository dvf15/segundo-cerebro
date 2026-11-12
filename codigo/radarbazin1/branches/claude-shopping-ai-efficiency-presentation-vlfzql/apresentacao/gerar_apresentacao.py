# -*- coding: utf-8 -*-
"""
Apresentacao "Shopping Inteligente: IA na pratica" — versao 5
- Paleta OFICIAL Allos (skill pptallos): petroleo, verde-escuro, teal, coral,
  menta, ambar, bege, areia. Tema claro (fundo branco/areia); capa e
  encerramento em fundo escuro. Sem azul Office / cinza padrao.
- Termos tecnicos em portugues claro (Retorno sobre Investimentos, indicadores,
  tempo ate o contrato/abertura/equilibrio, pontuacao, tempo de retorno, etc.)
- Capa: "TIME MOOCA" (sem expressao de treinamento p/ coordenadores e analistas).
- Orcamento de 45 min COM video introdutorio de 7,5 min:
    video 7,5' + apresentacao 34,5' + exercicio 3' = 45'.
  Simplificado vs v4: agentes mesclados em 1 slide; removidos Fluxo, Antes x
  Depois e Ferramentas (virou nota); 6 casos acelerados (1-2' cada).
Publico: Time Mooca — Mooca Plaza Shopping. Duracao total: 45 minutos.
"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# ---------------------------------------------------------------- paleta ALLOS
PETROLEO = RGBColor(0x00, 0x61, 0x6F)   # primaria — titulos, cabecalhos, marca
VERDE    = RGBColor(0x0D, 0x45, 0x4A)   # texto sobre claro; fundos escuros; footers
TEAL     = RGBColor(0x36, 0x8C, 0x82)   # secundaria — subtitulos, destaques
CORAL    = RGBColor(0xCD, 0x51, 0x51)   # alertas, queda, dados negativos
MENTA    = RGBColor(0x6C, 0xC6, 0x80)   # sucesso, crescimento, positivos
AMBAR    = RGBColor(0xED, 0xA7, 0x54)   # destaques, indicadores, atencao media
BEGE     = RGBColor(0xCC, 0xC5, 0xBC)   # bordas, divisores, neutros
AREIA    = RGBColor(0xE5, 0xDE, 0xD4)   # fundos claros, cards, respiro
WHITE    = RGBColor(0xFF, 0xFF, 0xFF)
ALLOS_SERIES = [PETROLEO, AMBAR, TEAL, CORAL, MENTA, BEGE]

# papeis semanticos (tema claro)
PAGE   = WHITE       # fundo das paginas de conteudo
DARK   = VERDE       # fundo escuro (capa, encerramento, caixas de destaque)
INK    = VERDE       # corpo de texto sobre claro
TITLE  = PETROLEO    # titulos
SUB    = TEAL        # subtitulos / secundario
CARD   = AREIA       # fundo de card
CLINE  = BEGE        # borda de card / divisor
ONDARK = AREIA       # texto sobre escuro
ONDARKM= BEGE        # texto secundario sobre escuro

prs = Presentation()
prs.slide_width  = Inches(13.333)
prs.slide_height = Inches(7.5)
SW, SH = prs.slide_width, prs.slide_height
BLANK = prs.slide_layouts[6]

# ---------------------------------------------------------------- helpers
def slide(dark=False):
    s = prs.slides.add_slide(BLANK)
    bg = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, SW, SH)
    bg.fill.solid(); bg.fill.fore_color.rgb = DARK if dark else PAGE
    bg.line.fill.background(); bg.shadow.inherit = False
    s.shapes._spTree.remove(bg._element); s.shapes._spTree.insert(2, bg._element)
    return s

def box(s, l, t, w, h, fill=None, line=None, line_w=1.0, round_=False):
    shp = s.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE if round_ else MSO_SHAPE.RECTANGLE, l, t, w, h)
    if fill is None: shp.fill.background()
    else: shp.fill.solid(); shp.fill.fore_color.rgb = fill
    if line is None: shp.line.fill.background()
    else: shp.line.color.rgb = line; shp.line.width = Pt(line_w)
    shp.shadow.inherit = False
    return shp

def line(s, x, y, w, h, color=BEGE):
    return box(s, Inches(x), Inches(y), Inches(w), Inches(h), fill=color)

def text(s, l, t, w, h, runs, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP,
         space_after=6, line_spacing=1.0):
    tb = s.shapes.add_textbox(l, t, w, h); tf = tb.text_frame
    tf.word_wrap = True; tf.vertical_anchor = anchor
    for i, para in enumerate(runs):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align; p.space_after = Pt(space_after)
        p.space_before = Pt(0); p.line_spacing = line_spacing
        for (txt, size, color, bold) in para:
            r = p.add_run(); r.text = txt
            r.font.size = Pt(size); r.font.color.rgb = color
            r.font.bold = bold; r.font.name = "Calibri"
    return tb

def chip(s, l, t, label, fill=PETROLEO, fg=AREIA, size=12):
    w = Inches(0.2 + 0.095 * len(label))
    c = box(s, l, t, w, Inches(0.42), fill=fill, round_=True)
    tf = c.text_frame; tf.word_wrap = False
    tf.margin_top = Pt(2); tf.margin_bottom = Pt(2)
    tf.margin_left = Pt(10); tf.margin_right = Pt(10)
    p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = label
    r.font.size = Pt(size); r.font.bold = True; r.font.color.rgb = fg
    return c

def header(s, kicker, title, time_label=None):
    box(s, Inches(0.55), Inches(0.55), Inches(0.12), Inches(0.95), fill=PETROLEO)
    text(s, Inches(0.8), Inches(0.5), Inches(9.8), Inches(0.4),
         [[(kicker.upper(), 13, TEAL, True)]])
    text(s, Inches(0.8), Inches(0.85), Inches(11.2), Inches(0.9),
         [[(title, 29, TITLE, True)]])
    if time_label:
        c = box(s, Inches(11.5), Inches(0.55), Inches(1.28), Inches(0.5),
                fill=AREIA, round_=True)
        tf = c.text_frame; p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
        r = p.add_run(); r.text = time_label
        r.font.size = Pt(13); r.font.bold = True; r.font.color.rgb = PETROLEO

def notes(s, txt):
    s.notes_slide.notes_text_frame.text = txt

def bullets(s, items, l, t, w, h, size=16, gap=10, color=INK, marker="—  ",
            mcolor=PETROLEO, headcolor=PETROLEO, subcolor=SUB):
    runs = []
    for it in items:
        if isinstance(it, tuple):
            head, sub = it
            runs.append([(marker, size, mcolor, True), (head, size, headcolor, True)])
            if sub:
                runs.append([("      " + sub, size-2, subcolor, False)])
        else:
            runs.append([(marker, size, mcolor, True), (it, size, color, False)])
    text(s, l, t, w, h, runs, space_after=gap, line_spacing=1.05)

def hcards(s, items, top_in, height_in, title_size=15, role_size=11.5,
           body_size=12, bar_color=PETROLEO, gap=0.26):
    n = len(items); total = 11.73
    w = (total - (n - 1) * gap) / n; x = 0.8
    for (title, role, body) in items:
        box(s, Inches(x), Inches(top_in), Inches(w), Inches(height_in),
            fill=CARD, line=CLINE, line_w=1.0, round_=True)
        box(s, Inches(x), Inches(top_in), Inches(w), Inches(0.1), fill=bar_color)
        text(s, Inches(x + 0.18), Inches(top_in + 0.22), Inches(w - 0.36), Inches(0.5),
             [[(title, title_size, TITLE, True)]])
        text(s, Inches(x + 0.18), Inches(top_in + 0.66), Inches(w - 0.36), Inches(0.4),
             [[(role, role_size, TEAL, True)]])
        text(s, Inches(x + 0.18), Inches(top_in + 1.08), Inches(w - 0.36),
             Inches(height_in - 1.2),
             [[(body, body_size, INK, False)]], line_spacing=1.06)
        x += w + gap

def case_slide(kicker, title, time_label, where_items, prompt_lines, payoff, hidden=False):
    s = slide(); header(s, kicker, title, time_label)
    box(s, Inches(0.8), Inches(1.85), Inches(5.75), Inches(4.85),
        fill=CARD, line=CLINE, line_w=1.0, round_=True)
    box(s, Inches(0.8), Inches(1.85), Inches(5.75), Inches(0.1), fill=PETROLEO)
    text(s, Inches(1.05), Inches(2.08), Inches(5.3), Inches(0.4),
         [[("ONDE USAR — NO ESPÍRITO DESTE AGENTE", 12.5, TITLE, True)]])
    bullets(s, where_items, Inches(1.05), Inches(2.55), Inches(5.3), Inches(4.05),
            size=14, gap=8)
    box(s, Inches(6.78), Inches(1.85), Inches(5.75), Inches(4.85),
        fill=DARK, line=PETROLEO, line_w=1.2, round_=True)
    box(s, Inches(6.78), Inches(1.85), Inches(5.75), Inches(0.1), fill=AMBAR)
    text(s, Inches(7.03), Inches(2.08), Inches(5.3), Inches(0.4),
         [[("PROMPT PRONTO PARA COPIAR", 12.5, AMBAR, True)]])
    runs = [[(ln, 12, ONDARK, False)] for ln in prompt_lines]
    text(s, Inches(7.03), Inches(2.55), Inches(5.3), Inches(3.6), runs,
         space_after=4, line_spacing=1.05)
    text(s, Inches(0.8), Inches(6.84), Inches(11.7), Inches(0.5),
         [[("GANHO:  ", 13, TEAL, True), (payoff, 12.5, INK, True)]])
    if hidden:
        s._element.set("show", "0")   # oculta o slide (não exclui)
    return s

# ================================================================ 1 — CAPA (escura)
s = slide(dark=True)
box(s, 0, 0, SW, Inches(0.18), fill=PETROLEO)
box(s, 0, SH - Inches(0.18), SW, Inches(0.18), fill=AMBAR)
chip(s, Inches(0.9), Inches(1.5), "MOOCA PLAZA SHOPPING  •  TIME MOOCA", fill=PETROLEO, fg=AREIA)
text(s, Inches(0.9), Inches(2.25), Inches(11.6), Inches(2.2),
     [[("Shopping Inteligente", 54, WHITE, True)],
      [("IA para ", 29, ONDARK, False), ("eficiência e agilidade", 29, AMBAR, True),
       (" — da visão do ecossistema à sua rotina", 29, ONDARK, False)]],
     space_after=8)
text(s, Inches(0.9), Inches(4.7), Inches(11.6), Inches(0.6),
     [[("45 minutos", 18, ONDARKM, False)]])
text(s, Inches(0.9), Inches(6.55), Inches(11.6), Inches(0.6),
     [[("O caminho mais curto e rentável entre a intenção e a operação em pleno funcionamento — "
        "acelerado por dados e IA.", 14, ONDARK, False)]], line_spacing=1.1)
notes(s, "Boas-vindas (1 min). Esta versao tem duas partes: primeiro a VISAO (o ecossistema de agentes do "
         "Shopping Inteligente), para o Time Mooca entender a direcao; depois a PRATICA (como cada um ja usa IA "
         "hoje para acelerar isso). Pergunte quem ja usou IA no trabalho. Combine: saimos com prompts prontos.")

# ================================================================ 2 — VÍDEO INTRODUTÓRIO (escuro)
s = slide(dark=True)
box(s, 0, 0, SW, Inches(0.18), fill=PETROLEO)
box(s, 0, SH - Inches(0.18), SW, Inches(0.18), fill=AMBAR)
# circulo com play
circ = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(6.06), Inches(2.15), Inches(1.2), Inches(1.2))
circ.fill.background(); circ.line.color.rgb = AMBAR; circ.line.width = Pt(2.5)
circ.shadow.inherit = False
text(s, Inches(6.06), Inches(2.12), Inches(1.2), Inches(1.2),
     [[("▶", 34, AMBAR, True)]], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
text(s, Inches(0.9), Inches(3.7), Inches(11.5), Inches(0.9),
     [[("Vídeo introdutório", 40, WHITE, True)]], align=PP_ALIGN.CENTER)
chip(s, Inches(6.02), Inches(4.75), "7 MIN 30 S", fill=AMBAR, fg=VERDE)
text(s, Inches(0.9), Inches(5.5), Inches(11.5), Inches(0.8),
     [[("Abre o workshop e dá o tom: por que o Shopping Inteligente e por que agora. "
        "Depois do vídeo, entramos na visão e na prática.", 15, ONDARK, False)]],
     align=PP_ALIGN.CENTER, line_spacing=1.12)
notes(s, "Reproduza o video introdutorio (7 min 30 s). Apos o video, faca a transicao: 'agora vamos ver como esse "
         "Shopping Inteligente se organiza e, principalmente, como cada um do Time Mooca ja usa IA para acelera-lo'.")

# ================================================================ 3 — AGENDA
s = slide(); header(s, "Roteiro", "45 minutos, em dois atos", "45 min")
box(s, Inches(0.8), Inches(1.72), Inches(11.73), Inches(0.6), fill=DARK, round_=True)
text(s, Inches(1.05), Inches(1.74), Inches(11.3), Inches(0.55),
     [[("▶  0 · Vídeo introdutório — 7,5 min", 15, AMBAR, True),
       ("     (já assistido — abre o workshop)", 13, ONDARKM, False)]],
     anchor=MSO_ANCHOR.MIDDLE)
box(s, Inches(0.8), Inches(2.5), Inches(5.75), Inches(3.75), fill=CARD, line=CLINE, round_=True)
box(s, Inches(0.8), Inches(2.5), Inches(5.75), Inches(0.1), fill=PETROLEO)
text(s, Inches(1.05), Inches(2.7), Inches(5.3), Inches(0.4),
     [[("ATO 1 · A VISÃO  ·  ~15 min", 15, TITLE, True)]])
bullets(s, [("A tese, a missão e as dores", "o que o ecossistema resolve"),
            ("Orquestrador + Plataforma Comercial", "consultoria de negócios e match"),
            ("Os 8 agentes em 2 camadas", "Descoberta e Seleção + Execução"),
            ("Princípios e salvaguardas", "explicabilidade, decisão humana")],
        Inches(1.05), Inches(3.15), Inches(5.3), Inches(3.0), size=14, gap=8)
box(s, Inches(6.78), Inches(2.5), Inches(5.75), Inches(3.75), fill=CARD, line=CLINE, round_=True)
box(s, Inches(6.78), Inches(2.5), Inches(5.75), Inches(0.1), fill=AMBAR)
text(s, Inches(7.03), Inches(2.7), Inches(5.3), Inches(0.4),
     [[("ATO 2 · A PRÁTICA  ·  ~18 min", 15, TITLE, True)]])
bullets(s, [("Método C.R.I.A.R.", "fazer bons pedidos à IA"),
            ("3 casos em foco: aja como o agente", "Hunter · Entertainer · Builder"),
            ("  (demais agentes no material de apoio)", "com prompts prontos"),
            ("Indicadores, plano e mão na massa", "exercício ao vivo (6 min)")],
        Inches(7.03), Inches(3.15), Inches(5.3), Inches(3.0), size=14, gap=8)
box(s, Inches(0.8), Inches(6.45), Inches(11.73), Inches(0.62), fill=CARD, line=CLINE, round_=True)
text(s, Inches(1.05), Inches(6.47), Inches(11.3), Inches(0.58),
     [[("Tempo total:  ", 14, TITLE, True),
       ("vídeo 7,5 min  +  apresentação 31,5 min  +  exercício 6 min  =  45 min", 14, INK, True)]],
     anchor=MSO_ANCHOR.MIDDLE)
notes(s, "Agenda (1 min). Mostre o orcamento de tempo: o video ja consumiu 7,5 min; sobram 37,5 para apresentacao "
         "+ exercicio. Ato 1 e curto e conceitual; Ato 2 e a maior parte, pratico. Podem interromper, mas ha "
         "exercicio no fim.")

# ================================================================ 4 — TESE & MISSÃO
s = slide(); header(s, "Ato 1 · Fundamento", "A tese e a missão do Shopping Inteligente", "2 min")
box(s, Inches(0.8), Inches(1.85), Inches(11.73), Inches(1.9), fill=CARD,
    line=CLINE, line_w=1.0, round_=True)
box(s, Inches(0.8), Inches(1.85), Inches(0.12), Inches(1.9), fill=PETROLEO)
text(s, Inches(1.15), Inches(2.05), Inches(11.1), Inches(1.6),
     [[("“Aumentar a frequência de visita e o ticket médio, com uma experiência que encanta o consumidor "
        "e maximiza a venda dos lojistas — e, como consequência, o Retorno sobre Investimentos de longo "
        "prazo do empreendimento.”", 17, VERDE, True)],
      [("Para isso: planejar a seleção ideal do mix, maximizar a gestão e o crescimento das vendas das lojas "
        "e a velocidade de reposição — acelerando a entrada do lojista (prospecção → contrato → obra → alavancagem).",
        14, TEAL, False)]], space_after=8, line_spacing=1.12)
text(s, Inches(0.8), Inches(4.0), Inches(11.7), Inches(0.4),
     [[("A MISSÃO DO ECOSSISTEMA DE AGENTES — maximizar três coisas ao mesmo tempo:", 14, TITLE, True)]])
cards = [("Velocidade de reposição", "Encurtar o caminho da prospecção à loja aberta e vendendo.", PETROLEO),
         ("Qualidade do mix", "A loja certa no ponto certo — não preencher vaga com mix errado.", AMBAR),
         ("Retorno sobre Investimentos", "Retorno sustentável de longo prazo ao empreendedor, não ocupação de curto prazo.", TEAL)]
x = 0.8
for h, sub, bar in cards:
    box(s, Inches(x), Inches(4.5), Inches(3.78), Inches(2.1), fill=CARD, line=CLINE, round_=True)
    box(s, Inches(x), Inches(4.5), Inches(3.78), Inches(0.1), fill=bar)
    text(s, Inches(x + 0.22), Inches(4.72), Inches(3.4), Inches(0.7),
         [[(h, 16, TITLE, True)]])
    text(s, Inches(x + 0.22), Inches(5.4), Inches(3.4), Inches(1.2),
         [[(sub, 13.5, INK, False)]], line_spacing=1.1)
    x += 3.97
notes(s, "3 min. Leia a tese e traduza: tudo que fazemos serve a frequencia, ticket medio e ao Retorno sobre "
         "Investimentos de longo prazo. O ecossistema existe para dar a cada empreendedor 'o caminho mais curto e "
         "rentavel entre intencao e operacao'. Guarde os 3 pilares — voltam nos indicadores de tempo.")

# ================================================================ 5 — DORES MAPEADAS
s = slide(); header(s, "Ato 1 · O problema", "Dores mapeadas — o que o ecossistema resolve", "2 min")
dores = [
    ("EMPREENDEDOR (SHOPPING)", PETROLEO,
     ["Vacância e demora na comercialização", "Achar franqueados qualificados",
      "Prospectar o mix ideal", "Inadimplência",
      "Tempo alto triando e apresentando lojas"]),
    ("VAREJISTA / FRANQUEADO", TEAL,
     ["Contrato complexo e demora na assinatura", "Apresentar garantias (fiança)",
      "Pouca transparência de espaços e preços", "Obra burocrática, restritiva e cara",
      "Dificuldade de contratar mão de obra"]),
    ("MARCA", AMBAR,
     ["Achar franqueados em novas praças", "Escolher o melhor ponto pelo melhor custo",
      "Falta de transparência de preços", "Sem acesso a dados técnicos do ponto",
      "(pé-direito, carga, água/esgoto…)"]),
]
x = 0.8
for title, bar, items in dores:
    box(s, Inches(x), Inches(2.0), Inches(3.78), Inches(4.35), fill=CARD, line=CLINE, round_=True)
    box(s, Inches(x), Inches(2.0), Inches(3.78), Inches(0.1), fill=bar)
    text(s, Inches(x + 0.2), Inches(2.2), Inches(3.4), Inches(0.5),
         [[(title, 12.5, TITLE, True)]])
    bullets(s, items, Inches(x + 0.2), Inches(2.75), Inches(3.45), Inches(3.5),
            size=12, gap=9, marker="•  ", mcolor=CORAL)
    x += 3.97
text(s, Inches(0.8), Inches(6.5), Inches(11.7), Inches(0.5),
     [[("A solução: ", 13, TITLE, True),
       ("um processo automatizado que conecta investidores, marcas e shopping — e cada agente a seguir "
        "ataca uma dessas dores.", 13, INK, False)]], line_spacing=1.05)
notes(s, "2 min. Tres olhares de dor: o shopping (vacancia, mix, inadimplencia), o varejista/franqueado (contrato, "
         "fianca, obra, mao de obra) e a marca (achar franqueado, escolher ponto, transparencia tecnica). Cada agente "
         "do ecossistema responde a uma dessas dores — e o Time Mooca ja consegue mitigar varias com IA hoje.")

# ================================================================ 6 — ARQUITETURA (DIAGRAMA)
s = slide(); header(s, "Ato 1 · Arquitetura", "Um ecossistema de agentes de IA, em 2 camadas", "3 min")
box(s, Inches(4.0), Inches(1.85), Inches(5.33), Inches(0.92), fill=PETROLEO, round_=True)
text(s, Inches(4.0), Inches(1.93), Inches(5.33), Inches(0.8),
     [[("AGENTE ORQUESTRADOR", 17, WHITE, True)],
      [("consultoria de negócios · match inteligente", 12, AREIA, False)]],
     align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, space_after=0)
line(s, 6.62, 2.77, 0.05, 0.32, color=PETROLEO)
line(s, 2.6, 3.09, 8.13, 0.05, color=PETROLEO)
for cx in (2.6, 6.64, 10.72):
    line(s, cx, 3.09, 0.05, 0.26, color=PETROLEO)
pillars = [("DESCOBERTA E SELEÇÃO", "quem entra", 0.8), ("PLANEJAMENTO", "mix · preço", 4.86),
           ("EXECUÇÃO", "operar e vender", 8.92)]
for name, sub, px in pillars:
    box(s, Inches(px), Inches(3.35), Inches(3.6), Inches(0.62), fill=CARD, line=CLINE, round_=True)
    text(s, Inches(px), Inches(3.4), Inches(3.6), Inches(0.55),
         [[(name + "   ", 12, TITLE, True), (sub, 10.5, TEAL, False)]],
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
disc = [("Hunter", "lacunas de mix"), ("Farmer", "capital"),
        ("KA / Expansão", "marcas"), ("Entertainer", "eventos")]
dx, dy = 0.8, 4.02
for i, (nm, rl) in enumerate(disc):
    col = i % 2; row = i // 2
    bx = dx + col * 1.84; by = dy + row * 0.92
    box(s, Inches(bx), Inches(by), Inches(1.7), Inches(0.82), fill=VERDE, round_=True)
    text(s, Inches(bx), Inches(by + 0.1), Inches(1.7), Inches(0.62),
         [[(nm, 12, WHITE, True)], [(rl, 10, AMBAR, False)]],
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, space_after=0)
# Radar de Operações — seleção (caixa larga, destacada, sob os 4 agentes)
box(s, Inches(0.8), Inches(dy + 2 * 0.92), Inches(3.54), Inches(0.82), fill=PETROLEO, round_=True)
text(s, Inches(0.8), Inches(dy + 2 * 0.92 + 0.1), Inches(3.54), Inches(0.62),
     [[("Radar de Operações", 12, WHITE, True)], [("seleção: investidores & lojas de rua", 10, AMBAR, False)]],
     align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, space_after=0)
box(s, Inches(4.86), Inches(4.12), Inches(3.6), Inches(0.92), fill=CARD,
    line=AMBAR, line_w=1.4, round_=True)
text(s, Inches(4.86), Inches(4.16), Inches(3.6), Inches(0.85),
     [[("PLATAFORMA COMERCIAL", 12.5, TITLE, True)], [("vitrine de pontos · site/app", 10.5, TEAL, False)]],
     align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, space_after=0)
box(s, Inches(4.86), Inches(5.12), Inches(3.6), Inches(0.92), fill=CARD,
    line=AMBAR, line_w=1.4, round_=True)
text(s, Inches(4.86), Inches(5.16), Inches(3.6), Inches(0.85),
     [[("POSICIONAMENTO", 12.5, TITLE, True)], [("tese de mix · marca", 10.5, TEAL, False)]],
     align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, space_after=0)
exe = [("Alavancador", "soluções financeiras"), ("Builder", "obra & operação"),
       ("Seller", "vendas, mídia & benefícios")]
ex_x, ex_y = 8.92, 4.12
for i, (nm, rl) in enumerate(exe):
    by = ex_y + i * 0.66
    box(s, Inches(ex_x), Inches(by), Inches(3.6), Inches(0.56), fill=VERDE, round_=True)
    text(s, Inches(ex_x + 0.18), Inches(by + 0.02), Inches(3.3), Inches(0.52),
         [[(nm + "  ", 12.5, WHITE, True), (rl, 10.5, AMBAR, False)]], anchor=MSO_ANCHOR.MIDDLE)
text(s, Inches(0.8), Inches(6.95), Inches(11.7), Inches(0.4),
     [[("Ciclo fechado:  ", 12.5, TITLE, True),
       ("a Descoberta e Seleção abastece o Orquestrador → a Execução devolve dados de operação que realimentam todo o sistema.",
        12.5, INK, False)]])
notes(s, "3 min. Leitura do diagrama: o Orquestrador faz a conexao (consultoria de negocios); a Plataforma "
         "Comercial e a vitrine de pontos (autosserviço, site/app); Posicionamento e a tese de mix/marca. Descoberta traz "
         "quem entra (Hunter/Radar de Operacoes/Farmer/KA/Entertainer); Execucao opera e vende (Alavancador/Builder/Seller). No Ato 2 "
         "cada agente vira caso pratico.")

# ================================================================ 6 — ORQUESTRADOR
s = slide(); header(s, "Ato 1 · Núcleo", "O Orquestrador e a Plataforma Comercial", "2 min")
text(s, Inches(0.8), Inches(1.78), Inches(11.7), Inches(0.45),
     [[("Funciona como uma consultoria de negócios: ", 15.5, TITLE, True),
       ("cruza o perfil do empreendedor com oportunidades reais e com todas as soluções para abrir e operar.",
        15.5, INK, False)]], line_spacing=1.08)
cols = [
    ("O EMPREENDEDOR TRAZ", PETROLEO,
     ["Ambição — faturamento, nº de lojas", "Experiência — varejo, serviços, gestão",
      "Tempo — operador ou investidor", "Capital — disponível e apetite a risco",
      "Preferências — categoria, formato"]),
    ("O SHOPPING OFERECE", TEAL,
     ["Lojas vagas e pop-ups + preço mínimo", "Necessidades de mix por ponto",
      "Soluções financeiras (Alavancador)", "Obra e regularização (Builder)",
      "Vendas: mídia, eventos, benefícios (Seller)"]),
    ("PLATAFORMA COMERCIAL", AMBAR,
     ["Marcas, investidores e shopping se cadastram", "Perfil técnico do ponto (pé-direito, carga…)",
      "Match automático: perfil × ponto × mix", "Agendamento automático de visitas técnicas",
      "Autosserviço via site/app"]),
]
x = 0.8
for j, (title, bar, items) in enumerate(cols):
    dark_card = (j == 2)
    box(s, Inches(x), Inches(2.4), Inches(3.78), Inches(3.95),
        fill=(DARK if dark_card else CARD), line=(PETROLEO if dark_card else CLINE), round_=True)
    box(s, Inches(x), Inches(2.4), Inches(3.78), Inches(0.1), fill=bar)
    text(s, Inches(x + 0.2), Inches(2.6), Inches(3.4), Inches(0.5),
         [[(title, 13, (AMBAR if dark_card else TITLE), True)]])
    bullets(s, items, Inches(x + 0.2), Inches(3.12), Inches(3.45), Inches(3.1),
            size=12, gap=9, marker="•  ",
            color=(ONDARK if dark_card else INK),
            mcolor=(AMBAR if dark_card else PETROLEO))
    x += 3.97
text(s, Inches(0.8), Inches(6.5), Inches(11.7), Inches(0.5),
     [[("Saídas do match:  ", 12.5, TITLE, True),
       ("tese de investimento (1 pág) · plano de entrada com prazos · roteamento aos agentes.   "
        "Inspirações: Storematch · Appearhere · WeArePopUp · QuintoAndar.", 12.5, INK, False)]],
     line_spacing=1.05)
notes(s, "2 min. O Orquestrador e o coracao — uma consultoria de negocios que cruza o empreendedor com oportunidades "
         "E com todas as solucoes (financeira, obra, vendas). A Plataforma Comercial e o autosserviço: marcas, "
         "investidores e shopping se cadastram, o sistema faz o match e ate agenda a visita tecnica. Resultado "
         "explicavel: tese de 1 pagina + plano de entrada. Cite as inspiracoes (Storematch, Appearhere...).")

# ================================================================ 7 — CAMADA 1 · DESCOBERTA
s = slide(); header(s, "Ato 1 · Camada 1", "Agentes de Descoberta e Seleção — quem entra no shopping", "2 min")
hcards(s, [
    ("🔍 Hunter", "Inovação no varejo local",
     "Busca inovação num raio de 2–50 km: mix inovador, segmentos em alta (gastronomia, fitness, beleza), "
     "lojas de rua qualificadas e nativos digitais (DNVBs). Prioriza as lacunas do plano comercial e as "
     "‘batalhas’ do Posicionamento. Canal Juntos pelo Varejo."),
    ("📡 Radar de Operações", "Seleção de demanda ativa",
     "Seleciona investidores e operações de rua que já estão buscando abrir loja ou quiosque em shopping. "
     "Qualifica o interesse que chega (inbound) e complementa a prospecção ativa do Hunter e do Farmer."),
    ("🌾 Farmer", "Investidores qualificados",
     "Capta e qualifica investidores locais e regionais (multi-franqueados), lojistas atuais com boa "
     "performance e novos empreendedores. Suitability antes do produto: capital, tempo, experiência e retorno."),
    ("🔑 KA / Expansão", "Marcas em expansão",
     "Organiza marcas e franquias em expansão no Brasil, filtra as com interesse na praça e faz o match "
     "técnico do ponto (tamanho, vitrine, piso, energia, água, esgoto). Integra-se ao Farmer."),
    ("🎪 Entertainer", "Experiência e eventos",
     "Mapeia e idealiza eventos para praças e estacionamentos e monta o calendário anual: ocupação "
     "contínua, logística, segurança, férias escolares e datas do varejo."),
], top_in=1.95, height_in=4.6, title_size=13.5, role_size=10.5, body_size=9.5, bar_color=PETROLEO)
notes(s, "2 min. Descoberta E SELEÇÃO — 'quem entra'. Hunter faz a prospeccao ativa (rua, DNVBs). Radar de "
         "Operacoes seleciona a demanda que chega: investidores e operacoes de rua que ja buscam abrir loja/quiosque "
         "em shopping (inbound). Farmer qualifica por suitability. KA conecta marcas em expansao. Entertainer faz "
         "o calendario de eventos. Tudo priorizado pelo plano comercial e pelo Posicionamento.")

# ================================================================ 8 — CAMADA 2 · EXECUÇÃO
s = slide(); header(s, "Ato 1 · Camada 2", "Agentes de Execução — operar e vender", "2 min")
hcards(s, [
    ("💳 Alavancador", "Soluções financeiras",
     "Retail Financial Engine. Reúne as melhores soluções financeiras para o lojista focar em operar: "
     "financiamento de obra e capital de giro; seguros (obra, operação, vida, saúde); vale alimentação/"
     "refeição; e meios de pagamento online e offline."),
    ("🏗️ Builder", "Construir e operar",
     "Store Builder OS. Catálogo dos melhores fornecedores e soluções: engenharia, arquitetura e gestão "
     "de obra em shopping; materiais e acabamentos; segurança e regularização (prefeitura/bombeiros); "
     "tecnologia de varejo; mão de obra fixa/temporária; RH, folha, sindicato e apoio jurídico."),
    ("📈 Seller", "Vender mais",
     "Sales Performance Engine. Mídia no mall, no app e Home; indicação eficiente de benefícios "
     "(descontos, degustações, brindes) e uso da ferramenta Venda Certa; telas Helloo, outdoor e "
     "aeroporto; patrocínio de datas sazonais; e espaços (fraldário, vallet, Taste Lab, pet park, "
     "área esportiva…)."),
], top_in=1.95, height_in=4.6, title_size=15.5, role_size=12, body_size=11.5, bar_color=AMBAR)
text(s, Inches(0.8), Inches(6.7), Inches(11.7), Inches(0.4),
     [[("Ciclo fechado: ", 12.5, TITLE, True),
       ("a Execução devolve dados que realimentam a Descoberta e Seleção. Cada etapa hoje é manual — é aí que a IA "
        "acelera (Ato 2).", 12.5, INK, False)]], line_spacing=1.0)
notes(s, "2 min. Detalhe a Execucao — 'operar e vender'. Apos o match, 3 motores: Alavancador (dinheiro: "
         "financiamento, seguros, pagamentos), Builder (tijolo + regularizacao + RH/juridico) e Seller (vendas: "
         "midia, beneficios, eventos, espacos). Resolve as dores de obra burocratica, garantia e falta de mao de obra.")

# ================================================================ 8 — PRINCÍPIOS
s = slide(); header(s, "Ato 1 · Decisão", "Princípios que guiam o ecossistema", "1 min")
princ = [
    ("Retorno sobre Investimentos (longo prazo) > ocupação de curto prazo", "Não preencher vaga com mix errado."),
    ("Explicabilidade", "Toda recomendação carrega tese e premissas auditáveis."),
    ("Decisão sempre humana", "Contrato, mix e calendário sempre passam pelo time."),
    ("Otimização sistêmica", "Avaliar impacto em vizinhos, âncoras e fluxo do shopping."),
    ("Aprendizado contínuo", "Cada abertura, evento e fechamento realimenta os agentes."),
]
y = 2.0
for i, (h, sub) in enumerate(princ):
    box(s, Inches(0.8), Inches(y), Inches(11.73), Inches(0.85), fill=CARD, line=CLINE, round_=True)
    box(s, Inches(0.8), Inches(y), Inches(0.12), Inches(0.85), fill=PETROLEO)
    text(s, Inches(1.15), Inches(y + 0.08), Inches(11.0), Inches(0.4),
         [[(f"{i+1}.  ", 15, TEAL, True), (h, 16, TITLE, True)]])
    text(s, Inches(1.15), Inches(y + 0.45), Inches(11.0), Inches(0.4),
         [[(sub, 13, INK, False)]])
    y += 0.92
notes(s, "2 min. Esses principios sao o 'jeito de decidir' do shopping inteligente — e tambem como o time deve "
         "usar IA: com explicabilidade e decisao sempre humana. Voltam no slide de salvaguardas. O #2 e #3 sao a "
         "ponte com as 'regras de ouro' do uso de IA.")

# ================================================================ 10 — PONTE
s = slide(); header(s, "Ato 2 · A virada", "Da visão à sua mesa: você é quem decide", "1 min")
box(s, Inches(0.8), Inches(1.95), Inches(11.73), Inches(1.6), fill=CARD,
    line=PETROLEO, line_w=1.2, round_=True)
text(s, Inches(1.15), Inches(2.18), Inches(11.1), Inches(1.2),
     [[("O ecossistema completo é a direção — e se constrói com dados, processos e pessoas. ", 18, VERDE, True),
       ("Enquanto os agentes amadurecem, você já pode raciocinar como cada um deles usando IA, hoje, à mão.",
        17, TEAL, False)]], line_spacing=1.14)
bullets(s, [("A IA propõe o rascunho; você decide e assina", "a pessoa decide, exatamente como nos princípios"),
            ("Cada análise sua bem feita vira dado que treina o sistema", "ciclo fechado — você alimenta a inteligência"),
            ("Você não precisa virar especialista em tecnologia", "precisa fazer bons pedidos — é o que veremos agora"),
            ("A seguir: o método + 6 formas de agir como esses agentes já amanhã", "")],
        Inches(0.9), Inches(3.85), Inches(11.5), Inches(3.0), size=16, gap=12)
notes(s, "1 min. Slide-charneira. O recado: 'voces nao estao sendo substituidos — voces SAO os agentes, agora "
         "turbinados por IA, e ainda ajudam a treinar o sistema'. Reduz medo e aumenta adesao. Vira o tom para pratico.")

# ================================================================ 11 — O QUE É IA E ML
s = slide(); header(s, "Ato 2 · Fundamento", "O que é IA e Machine Learning", "2 min")
box(s, Inches(0.8), Inches(1.85), Inches(11.73), Inches(1.25), fill=CARD, line=CLINE, round_=True)
box(s, Inches(0.8), Inches(1.85), Inches(0.12), Inches(1.25), fill=PETROLEO)
text(s, Inches(1.15), Inches(2.02), Inches(11.0), Inches(1.05),
     [[("Machine Learning: ", 17, TITLE, True),
       ("um algoritmo que aprende com dados, sem programação explícita. É ótimo em uma coisa — ", 15, INK, False),
       ("predição.", 15, TITLE, True)],
      [("Predição = ", 15, TEAL, True),
       ("transformar a informação que você TEM na informação que você NÃO tem.", 15, INK, False)]],
     space_after=4, line_spacing=1.1)
cards = [("MÁQUINA", "Predição", TEAL, "Transforma dados em dados que faltam.", "ex.: qual a probabilidade de chover?"),
         ("HUMANO", "Julgamento", AMBAR, "Decide com base na predição.", "ex.: mudar o casamento para dentro?")]
x = 0.8
for tit, papel, bar, desc, ex in cards:
    box(s, Inches(x), Inches(3.3), Inches(5.75), Inches(2.15), fill=CARD, line=CLINE, round_=True)
    box(s, Inches(x), Inches(3.3), Inches(5.75), Inches(0.1), fill=bar)
    text(s, Inches(x + 0.25), Inches(3.5), Inches(5.3), Inches(0.45),
         [[(tit + "  ", 17, TITLE, True), ("· " + papel, 17, (VERDE if bar == AMBAR else TEAL), True)]])
    text(s, Inches(x + 0.25), Inches(4.05), Inches(5.3), Inches(0.5), [[(desc, 15, INK, True)]])
    text(s, Inches(x + 0.25), Inches(4.6), Inches(5.3), Inches(0.5), [[(ex, 13.5, SUB, False)]])
    x += 5.98
box(s, Inches(0.8), Inches(5.65), Inches(11.73), Inches(1.05), fill=CARD, line=CLINE, round_=True)
text(s, Inches(1.15), Inches(5.82), Inches(11.0), Inches(0.8),
     [[("Líder data-driven = ", 15, AMBAR, True),
       ("consumidor informado de análises. Não precisa programar — precisa saber o que os dados podem (e não podem) fazer.  ", 15, INK, False),
       ("Máquinas predizem; pessoas julgam.", 15, TITLE, True)]], line_spacing=1.1)
notes(s, "2 min. Nivelamento conceitual (adaptado de A. Goldberg, Stanford GSB). ML aprende com dados e e otimo "
         "em PREDICAO; predicao = transformar o que voce tem no que nao tem. A distincao-chave: MAQUINA prediz, "
         "HUMANO julga (vai chover? x mudar o casamento para dentro?). Ser data-driven nao e deixar a IA decidir — "
         "e usar a predicao como insumo. Emenda em 'Como a IA generativa pensa'.")

# ================================================================ 12 — IA EM 1 MIN
s = slide(); header(s, "Ato 2 · Fundamento", "Como a IA pensa — em 1 minuto", "1 min")
box(s, Inches(0.8), Inches(1.95), Inches(11.73), Inches(1.85), fill=CARD, line=CLINE, round_=True)
text(s, Inches(1.1), Inches(2.2), Inches(11.1), Inches(1.5),
     [[("Pense num assistente que leu quase tudo e completa textos. ", 18, VERDE, True),
       ("Você descreve o que precisa em linguagem natural e ele devolve um rascunho. É ótimo para escrever, "
        "resumir, organizar e analisar — mas não ‘sabe a verdade ou o contexto completo’: pode errar dados e/ou inventar com confiança.",
        16, INK, False)]], line_spacing=1.14)
good = ["Escrever e reescrever textos", "Resumir documentos e reuniões",
        "Organizar e classificar informação", "Analisar planilhas e tabelas",
        "Traduzir e ajustar o tom", "Gerar ideias e rascunhos"]
bad = ["Garantir números e fatos sem conferir", "Saber dados internos que não foram dados a ela",
       "Tomar a decisão no seu lugar", "Acessar sistemas sozinha"]
box(s, Inches(0.8), Inches(4.0), Inches(5.75), Inches(2.85), fill=CARD, line=CLINE, round_=True)
box(s, Inches(0.8), Inches(4.0), Inches(5.75), Inches(0.1), fill=MENTA)
text(s, Inches(1.05), Inches(4.2), Inches(5.3), Inches(0.4), [[("ÓTIMO PARA", 14, TITLE, True)]])
bullets(s, good, Inches(1.05), Inches(4.62), Inches(5.3), Inches(2.1), size=13, gap=4,
        marker="✓  ", mcolor=TEAL)
box(s, Inches(6.78), Inches(4.0), Inches(5.75), Inches(2.85), fill=CARD, line=CLINE, round_=True)
box(s, Inches(6.78), Inches(4.0), Inches(5.75), Inches(0.1), fill=CORAL)
text(s, Inches(7.03), Inches(4.2), Inches(5.3), Inches(0.4), [[("CUIDADO COM", 14, CORAL, True)]])
bullets(s, bad, Inches(7.03), Inches(4.62), Inches(5.3), Inches(2.1), size=13, gap=4,
        marker="!  ", mcolor=CORAL)
notes(s, "2 min. Desmistifique. Frase-chave: 'ela completa texto de forma muito convincente — por isso voce "
         "sempre confere numeros e fatos'. Conecta com 'explicabilidade' e prepara as regras de ouro.")

# ================================================================ 12 — C.R.I.A.R.
s = slide(); header(s, "Ato 2 · Método", "Anatomia de um bom pedido — C.R.I.A.R.", "2 min")
method = [
    ("C — Contexto", "Quem é você e a situação", "Sou coordenador de operações de um shopping com 200 lojas…"),
    ("R — Resultado", "O que quer e em que formato", "Quero um e-mail curto, tom cordial, até 6 linhas…"),
    ("I — Informação", "Cole os dados que ele deve usar", "Segue a lista de chamados da semana: …"),
    ("A — Audiência", "Para quem é (define o tom)", "É para os lojistas / a diretoria / o cliente…"),
    ("R — Restrições", "Limites, tamanho, o que evitar", "Máximo 1 página, sem jargão, em tabela…"),
]
y = 1.95
for h, what, ex in method:
    box(s, Inches(0.8), Inches(y), Inches(11.73), Inches(0.84), fill=CARD, line=CLINE, round_=True)
    text(s, Inches(1.1), Inches(y + 0.14), Inches(2.6), Inches(0.6), [[(h, 17, TITLE, True)]])
    text(s, Inches(3.7), Inches(y + 0.08), Inches(3.0), Inches(0.66),
         [[(what, 13.5, VERDE, True)]], anchor=MSO_ANCHOR.MIDDLE)
    text(s, Inches(6.7), Inches(y + 0.08), Inches(5.7), Inches(0.66),
         [[("ex.: " + ex, 12.5, TEAL, False)]], anchor=MSO_ANCHOR.MIDDLE)
    y += 0.9
text(s, Inches(0.8), Inches(6.7), Inches(11.7), Inches(0.5),
     [[("Dica: ", 14, TEAL, True),
       ("comece com Contexto + Resultado + Informação e refine pedindo ajustes. E sempre confira o resultado.",
        14, INK, False)]])
notes(s, "2 min. Coracao pratico. Prompt bom = pedido bem feito a um assistente. Faca um mini-exemplo ao vivo. "
         "A diferenca entre resposta ruim e otima quase sempre esta no pedido, nao na ferramenta.")

# ================================================================ 13-18 — CASOS
# --- VISÍVEIS (em foco): Hunter, Entertainer, Builder ---
case_slide(
    "Ato 2 · Caso 1 — agente Hunter", "Descobrir e qualificar o varejo local", "1–2 min",
    [("Mapear novos negócios da região", "raio configurável; achar candidatos para lacunas de mix"),
     ("Montar o dossiê de candidato (1–2 págs)", "identificação, indicadores, aderência, pontuação, riscos"),
     ("Classificar por horizonte", "Agora (0–3m) / Próximo (3–12m) / Futuro (12–36m)"),
     ("Gerar conteúdo do ‘Juntos pelo Varejo’", "carrossel, reels, case de lojista, relatório de tendência"),
     ("Resumir tendências em lista de acompanhamento", "WGSN, mídia regional, newsletters setoriais")],
    ["Você é analista de prospecção (Hunter) de um",
     "shopping. Abaixo, uma lista de novos negócios de",
     "varejo da região (colei). Para cada um: classifique",
     "a categoria, estime a tração (1–5), aponte qual",
     "lacuna de mix preencheria e dê uma pontuação de",
     "aderência (0–100) com 1 linha de justificativa.",
     "Ordene da maior para a menor. Dados: <cole a lista>"],
    "Triagem de dezenas de candidatos e rascunho de dossiê em minutos — encurta detecção → contrato.")
notes(prs.slides[-1], "2 min. Conecte ao agente Hunter do Ato 1. A pontuacao explicavel (0-100) e o que o agente faz "
      "— e o Time Mooca pode fazer a triagem hoje. Reforce a salvaguarda: so dados publicos (LGPD).")

case_slide(
    "Ato 2 · Caso 2 — agente Entertainer", "Praças e eventos como motor de fluxo", "1–2 min",
    [("Prospecção de eventos itinerantes", "catálogo vivo dos mais promissores"),
     ("Ideação de eventos sob medida", "por tendência (WGSN) e persona do público"),
     ("Montar calendário anual sem lacunas", "meta: 100% dos dias com atração"),
     ("Simular impacto", "fluxo esperado, aumento de vendas, receita, custo"),
     ("Amarrar evento a benefício e campanha", "sinergia comercial em cada ação")],
    ["Você é analista de eventos (Entertainer) de um",
     "shopping. Proponha um calendário trimestral para a",
     "praça de eventos que nunca fique vaga, equilibrando",
     "temas (infantil, gastronômico, cultural, estilo de",
     "vida, sazonal). Para cada mês: tema, público-alvo,",
     "gancho com data do varejo e ativação casada com o",
     "programa de benefícios. Formato: tabela."],
    "Calendário com sinergia comercial pronto para validar — praça vira fluxo, mídia e receita.")
notes(prs.slides[-1], "2 min. Marketing/Mall adoram. Reforce o criterio 'praca nunca vaga' e a diversidade tematica. "
      "A IA gera o rascunho do calendario; o time valida coerencia com o Posicionamento e viabilidade.")

case_slide(
    "Ato 2 · Caso 3 — agente Builder", "Construir e regularizar a loja com agilidade", "1–2 min",
    [("Comparar orçamentos de obra", "escopo, prazo, preço, incluído/excluído"),
     ("Checklist de regularização", "prefeitura, bombeiros, caderno técnico"),
     ("Triar fornecedores e soluções", "engenharia, arquitetura, tecnologia de varejo"),
     ("Roteiro de contratação de mão de obra", "fixa e temporária"),
     ("Dúvidas de RH, folha e sindicato", "apoio — decisão sempre com o jurídico")],
    ["Você é analista do agente Builder. Recebi 3",
     "orçamentos de obra para uma loja (colei abaixo).",
     "Compare por escopo, prazo, preço e o que está",
     "incluído/excluído; aponte riscos e liste 5 perguntas",
     "para alinhar com cada fornecedor antes de decidir.",
     "Responda em tabela.",
     "Orçamentos: <cole aqui>"],
    "Comparação de orçamentos e checklist de obra prontos — entrega da loja mais rápida e segura.")
notes(prs.slides[-1], "1-2 min. Builder = tijolo + regularizacao + RH/juridico. Ataca as dores de obra burocratica, "
      "caderno tecnico complexo e dificuldade de mao de obra. Reforce: comparar orcamentos e checklists e onde a IA mais ganha tempo.")

# --- OCULTOS (não excluídos; material de apoio): Farmer+KA, Alavancador, Seller ---
case_slide(
    "Ato 2 · Caso 4 — agentes Farmer + KA", "Qualificar investidor e casar com a marca", "1–2 min",
    [("Qualificar pelo perfil de adequação (antes do produto)", "capital, tempo, experiência, retorno, setor"),
     ("Segmentar o perfil", "conservador/moderado/arrojado · operador/investidor"),
     ("Roteiros de relacionamento e acompanhamento", "manter a carteira ativa"),
     ("Compatibilidade técnica do ponto", "área, vitrine, piso, infraestrutura, coabitação, exclusividades"),
     ("Briefing duplo", "marca recebe candidatos · investidor recebe a oportunidade")],
    ["Você é analista de relacionamento com",
     "investidores (Farmer). Com base nas respostas do",
     "questionário de adequação abaixo, classifique o",
     "perfil (conservador/moderado/arrojado e operador/",
     "investidor), aponte a faixa de ticket adequada e",
     "sugira 3 tipos de oportunidade compatíveis.",
     "Respostas: <cole o formulário, sem dados pessoais>"],
    "Perfil de adequação e segmentação padronizados — conexão → contrato mais ágil e fundamentado.",
    hidden=True)
notes(prs.slides[-1], "[OCULTO] Material de apoio. Une Farmer e KA (captacao). Adequacao antes do produto. "
      "Salvaguarda: NAO colar dados pessoais. Reexiba pelo PowerPoint se quiser usar.")

case_slide(
    "Ato 2 · Caso 5 — agente Alavancador", "Soluções financeiras para o lojista operar", "1–2 min",
    [("Comparar opções de financiamento", "obra e capital de giro"),
     ("Comparar seguros e meios de pagamento", "obra, operação, vida, saúde · online/offline"),
     ("Régua de cobrança por faixa de atraso", "reduzir inadimplência; tom firme e cordial"),
     ("Simular tempo de retorno e sensibilidade", "investimento, carência, cenários"),
     ("Gerar fórmulas de Excel/Sheets", "explica e entrega a fórmula pronta")],
    ["Você é analista do agente Alavancador. Para uma",
     "loja com investimento inicial de R$ X, aluguel",
     "mínimo R$ Y/mês e vendas projetadas Z, monte uma",
     "simulação de tempo de retorno em 24 meses e mostre",
     "o impacto de 3 meses de carência. Liste as premissas.",
     "Apresente em tabela mês a mês.",
     "(confira os números antes de usar)"],
    "Comparativo financeiro e simulação em minutos — decisão embasada, sempre validada por você.",
    hidden=True)
notes(prs.slides[-1], "[OCULTO] Material de apoio. Alavancador = motor financeiro. Dado sensivel -> ferramenta "
      "corporativa e conferir. Reexiba pelo PowerPoint se quiser usar.")

case_slide(
    "Ato 2 · Caso 6 — agente Seller", "Vender mais: mídia, benefícios e eventos", "1–2 min",
    [("Plano de vendas por fase", "abertura, crescimento, maturidade"),
     ("Combinar mídia + benefícios + eventos", "mall, app e Home · datas sazonais"),
     ("Mecânicas do Programa de Benefícios", "descontos, degustações, brindes"),
     ("Sugerir espaços e propriedades de mídia", "telas Helloo, outdoor, Taste Lab, pet park…"),
     ("Adaptar a mensagem por canal", "post, e-mail, cartaz")],
    ["Você é analista do agente Seller. Crie um plano de",
     "90 dias para uma nova loja de gastronomia usar",
     "mídia (mall, app e Home), o programa de benefícios",
     "e 1 evento sazonal. Para cada fase: canal,",
     "mensagem-chave, mecânica de benefício e métrica",
     "de sucesso. Formato: tabela."],
    "Plano de vendas integrado (mídia + benefícios + eventos) pronto para executar — acelera as vendas.",
    hidden=True)
notes(prs.slides[-1], "[OCULTO] Material de apoio. Seller = motor de vendas (midia, beneficios, eventos). "
      "Reexiba pelo PowerPoint se quiser usar.")

# ================================================================ 19 — ANÁLISE DE DADOS
s = slide(); header(s, "Ato 2 · Capacitação", "Análise de dados sem ser analista de dados", "1 min")
text(s, Inches(0.8), Inches(1.8), Inches(11.7), Inches(0.5),
     [[("Cole uma tabela e converse com ela em português. ", 17, VERDE, True),
       ("A IA lê, calcula, compara e explica — são os dados do dia a dia ao seu alcance.", 17, INK, False)]],
     line_spacing=1.1)
steps = [
    ("1 · Cole os dados", "Vendas, fluxo, chamados — respeitando o sigilo e as políticas da empresa."),
    ("2 · Pergunte em linguagem natural", "‘Qual mês teve maior fluxo?’ · ‘Quais 5 lojas caíram mais?’ · ‘Tem algo estranho?’"),
    ("3 · Peça o formato de saída", "‘Faça uma tabela’ · ‘Resuma em 3 bullets’ · ‘Gere o texto do slide’"),
    ("4 · Refine e valide", "‘Detalhe o item 2’ · ‘E se eu excluir feriados?’ — e confira os números."),
]
y = 2.45
for h, sub in steps:
    box(s, Inches(0.8), Inches(y), Inches(11.73), Inches(0.95), fill=CARD, line=CLINE, round_=True)
    box(s, Inches(0.8), Inches(y), Inches(0.1), Inches(0.95), fill=PETROLEO)
    text(s, Inches(1.15), Inches(y + 0.12), Inches(4.2), Inches(0.7),
         [[(h, 16, TITLE, True)]], anchor=MSO_ANCHOR.MIDDLE)
    text(s, Inches(4.85), Inches(y + 0.12), Inches(7.5), Inches(0.7),
         [[(sub, 13.5, INK, False)]], anchor=MSO_ANCHOR.MIDDLE)
    y += 1.02
notes(s, "2 min. Momento 'uau' para analistas. Demonstre ao vivo com uma tabelinha ficticia de fluxo por mes. "
         "Reforce: dados de venda sao confidenciais (siga as politicas da empresa) e valide os numeros — explicabilidade.")

# ================================================================ 18 — INDICADORES
s = slide(); header(s, "Ato 2 · Impacto", "Como sua produtividade move os indicadores do negócio", "1 min")
text(s, Inches(0.8), Inches(1.8), Inches(11.7), Inches(0.5),
     [[("Cada tarefa que você acelera com IA empurra um destes indicadores do ciclo do lojista:",
        16, VERDE, True)]])
kpis = [
    ("Tempo até o contrato", "prospecção → assinatura", "Dossiês (Hunter) e adequação (Farmer)"),
    ("Tempo até a abertura", "assinatura → inauguração", "Obra e regularização ágeis (Builder)"),
    ("Tempo até o equilíbrio", "abertura → ponto de equilíbrio", "Soluções financeiras (Alavancador) e vendas (Seller)"),
    ("Vacância e reposição", "% de lojas ocupadas", "Triagem de candidatos (Hunter)"),
    ("Aumento de vendas", "mídia, benefícios e eventos", "Plano do Seller e do Entertainer"),
    ("Qualidade do mix", "aderência à tese", "Match marca × investidor × ponto (Hunter, Farmer, KA)"),
]
xs = [0.8, 6.78]; y = 2.4; i = 0
for row in range(3):
    for x in xs:
        h, sub, link = kpis[i]
        box(s, Inches(x), Inches(y), Inches(5.75), Inches(1.32), fill=CARD, line=CLINE, round_=True)
        box(s, Inches(x), Inches(y), Inches(0.1), Inches(1.32), fill=AMBAR)
        text(s, Inches(x + 0.25), Inches(y + 0.12), Inches(5.4), Inches(0.4),
             [[(h + "   ", 15.5, VERDE, True), (sub, 12, TEAL, False)]])
        text(s, Inches(x + 0.25), Inches(y + 0.62), Inches(5.4), Inches(0.6),
             [[("↳ você acelera com:  ", 12, TITLE, True), (link, 12, INK, False)]],
             line_spacing=1.0)
        i += 1
    y += 1.42
notes(s, "2 min. Esse slide conecta 'minha tarefinha' ao resultado do negocio. Mostre que reduzir o tempo ate a "
         "abertura em dias significa loja vendendo antes. Use para justificar o investimento de tempo em aprender IA.")

# ================================================================ 19 — PLANO 30-60-90
s = slide(); header(s, "Ato 2 · Adoção", "Plano 30-60-90: construir o ecossistema pela base", "2 min")
phases = [
    ("30 dias · Experimentar", PETROLEO,
     ["Cada um escolhe 1 tarefa do ‘seu agente’", "Usar IA nessa tarefa por 2 semanas",
      "Caderno de prompts que funcionaram", "Compartilhar 1 vitória na reunião"]),
    ("60 dias · Padronizar", AMBAR,
     ["Modelos de prompt por área/agente", "Definir o que pode e o que não (LGPD/sigilo)",
      "Treinar quem ainda não usa", "Medir tempo economizado"]),
    ("90 dias · Escalar", TEAL,
     ["Integrar nos processos recorrentes", "Biblioteca de prompts do shopping",
      "Eleger ‘referências de IA’ por área", "Organizar os dados dos agentes"]),
]
x = 0.8
for title, bar, items in phases:
    box(s, Inches(x), Inches(1.95), Inches(3.85), Inches(4.2), fill=CARD, line=CLINE, round_=True)
    box(s, Inches(x), Inches(1.95), Inches(3.85), Inches(0.12), fill=bar)
    text(s, Inches(x + 0.25), Inches(2.2), Inches(3.4), Inches(0.6), [[(title, 16, TITLE, True)]])
    bullets(s, items, Inches(x + 0.25), Inches(2.85), Inches(3.4), Inches(3.2),
            size=13, gap=10, marker="•  ", mcolor=TEAL)
    x += 3.96
box(s, Inches(0.8), Inches(6.35), Inches(11.73), Inches(0.72), fill=DARK, round_=True)
text(s, Inches(1.05), Inches(6.37), Inches(11.3), Inches(0.68),
     [[("Ferramentas: ", 13, AMBAR, True),
       ("assistentes de chat (Claude, ChatGPT, Gemini, Copilot), IA no Office/Google e transcrição de "
        "reuniões — sempre na versão aprovada pelo grupo (protege o dado).", 13, ONDARK, False)]],
     anchor=MSO_ANCHOR.MIDDLE, line_spacing=1.05)
notes(s, "2 min. O 'o que fazer ao sair daqui'. A acao 1 e o compromisso minimo de todos. No dia 90, "
         "'organizar os dados' prepara o terreno para os agentes de verdade — conecta de volta ao Ato 1. "
         "A faixa de ferramentas substitui o antigo slide dedicado: use sempre a versao corporativa aprovada.")

# ================================================================ 24 — SALVAGUARDAS
s = slide(); header(s, "Ato 2 · Governança", "Salvaguardas: usar com segurança e responsabilidade", "1 min")
risks = [
    ("LGPD — só dados públicos", "Na descoberta, coletar apenas o que é público. Sem buscar talento alheio."),
    ("Sigilo de vendas e dados internos", "Dados de venda e dados internos são confidenciais — siga as políticas de acesso e sigilo da empresa."),
    ("Viés do histórico", "Não perpetuar o mix dominante; reservar espaço a categorias sub-representadas."),
    ("Conflito e irregularidade", "Checar políticas internas e perguntar sempre que tiver dúvidas."),
    ("Decisão sempre humana", "Contrato, mix e calendário sempre passam por uma pessoa. Você assina."),
    ("Explicabilidade", "Confira números e fatos; toda recomendação carrega tese e premissas."),
]
xs = [0.8, 6.78]; y = 1.95; i = 0
for row in range(3):
    for x in xs:
        h, sub = risks[i]
        box(s, Inches(x), Inches(y), Inches(5.75), Inches(1.45), fill=CARD, line=CLINE, round_=True)
        text(s, Inches(x + 0.25), Inches(y + 0.16), Inches(5.3), Inches(0.4),
             [[("●  ", 14, AMBAR, True), (h, 15, TITLE, True)]])
        text(s, Inches(x + 0.25), Inches(y + 0.66), Inches(5.3), Inches(0.7),
             [[(sub, 12.5, INK, False)]], line_spacing=1.05)
        i += 1
    y += 1.55
notes(s, "2 min. Espelha as salvaguardas do material + as regras de ouro de IA. O ponto mais sensivel para este "
         "publico: SIGILO de vendas do lojista — siga as politicas de sigilo da empresa. Reforce LGPD e decisao sempre humana.")

# ================================================================ 25 — EXERCÍCIO
s = slide(); header(s, "Ato 2 · Mão na massa", "Exercício ao vivo (6 minutos)", "6 min")
box(s, Inches(0.8), Inches(1.95), Inches(11.73), Inches(1.5), fill=CARD, line=PETROLEO, line_w=1.2, round_=True)
text(s, Inches(1.1), Inches(2.18), Inches(11.1), Inches(1.2),
     [[("Escolha uma tarefa do ‘seu agente’ ", 19, VERDE, True),
       ("(um dossiê do Hunter, um calendário do Entertainer, uma obra do Builder…) e escreva o pedido com o C.R.I.A.R.",
        18, TEAL, False)]], line_spacing=1.12)
text(s, Inches(0.8), Inches(3.58), Inches(11.7), Inches(0.4), [[("Passo a passo:", 16, TITLE, True)]])
bullets(s, [("Escolha a tarefa", "algo que você repete e consome tempo"),
            ("Escreva o pedido", "Contexto + Resultado + Informação, no mínimo"),
            ("Rode e leia o rascunho", "o que ficou bom? o que faltou?"),
            ("Refine em 1 ajuste", "‘mais curto’ / ‘em tabela’ / ‘tom mais formal’"),
            ("Troque com um colega", "leiam os prompts em dupla e melhorem juntos"),
            ("Anote o prompt no seu caderno", "se funcionou, vira modelo reutilizável")],
        Inches(0.9), Inches(4.0), Inches(11.5), Inches(3.1), size=14, gap=5)
notes(s, "6 min (tempo ampliado com a sobra dos casos ocultos). Facam ao vivo: ~3 min escrevendo, ~2 min "
         "refinando/trocando em dupla, ~1 min compartilhando 1-2 exemplos. Objetivo: sair com 1 prompt de verdade, "
         "ligado ao agente em foco (Hunter, Entertainer ou Builder).")

# ================================================================ 26 — ENCERRAMENTO (escuro)
s = slide(dark=True)
box(s, 0, 0, SW, Inches(0.18), fill=PETROLEO)
box(s, 0, SH - Inches(0.18), SW, Inches(0.18), fill=AMBAR)
chip(s, Inches(0.9), Inches(1.1), "SHOPPING INTELIGENTE  •  MOOCA PLAZA", fill=PETROLEO, fg=AREIA)
text(s, Inches(0.9), Inches(1.8), Inches(11.5), Inches(1.2),
     [[("Comece pequeno. Comece amanhã.", 40, WHITE, True)]])
text(s, Inches(0.9), Inches(3.0), Inches(11.5), Inches(0.5),
     [[("3 atitudes para levar deste workshop:", 18, AMBAR, True)]])
bullets(s, [("Aja como o seu agente", "escolha 1 tarefa e resolva com IA esta semana; monte um projeto"),
            ("Use o método C.R.I.A.R.", "pedido bem feito = resultado bom — e confira sempre"),
            ("Anote o que funciona", "construa seu caderno de prompts e compartilhe com a equipe")],
        Inches(0.9), Inches(3.6), Inches(11.5), Inches(2.0), size=17, gap=12,
        color=ONDARK, mcolor=AMBAR, headcolor=ONDARK, subcolor=ONDARKM)
text(s, Inches(0.9), Inches(6.2), Inches(11.5), Inches(0.7),
     [[("Eficiência é tirar o repetitivo do caminho para focar no que importa: o caminho mais curto "
        "entre a intenção do lojista e a loja aberta, vendendo — encantando o cliente e maximizando o "
        "Retorno sobre Investimentos do seu Shopping.", 14, ONDARK, False)]], line_spacing=1.12)
notes(s, "1 min. Feche com energia. Amarre de volta a tese do Ato 1: eficiencia individual -> velocidade de "
         "reposicao -> Retorno sobre Investimentos de longo prazo. Combine follow-up: na proxima reuniao, cada um "
         "do Time Mooca traz 1 vitoria com IA. Abra para perguntas. Agradeca.")

# ================================================================ 27 — IA = INTELIGÊNCIA ACELERADA (escuro)
s = slide(dark=True)
box(s, 0, 0, SW, Inches(0.18), fill=AMBAR)
box(s, 0, SH - Inches(0.18), SW, Inches(0.18), fill=PETROLEO)
chip(s, Inches(0.9), Inches(0.85), "PARA FECHAR  •  IA = INTELIGÊNCIA ACELERADA", fill=AMBAR, fg=VERDE)
text(s, Inches(0.9), Inches(1.35), Inches(11.6), Inches(1.35),
     [[("A IA não vai substituir o fator humano na busca pelo nosso propósito. Ela pode ", 25, WHITE, True),
       ("amplificá-lo e acelerá-lo.", 25, AMBAR, True)]],
     space_after=2, line_spacing=1.04)
text(s, Inches(0.9), Inches(2.72), Inches(11.6), Inches(0.3), [[("PONTOS DE ATENÇÃO", 12, AMBAR, True)]])
text(s, Inches(0.9), Inches(3.04), Inches(11.6), Inches(0.72),
     [[("—  ", 13.5, AMBAR, True), ("Pessoas leem o contexto e avaliam os fatos (verdade)", 13.5, WHITE, True),
       ("  —  o clima e a experiência no mall, nos eventos, na gastronomia, o que encanta o cliente; a operação e "
        "seus gargalos. Isso se vive, se avalia — e decide o melhor caminho.", 12.5, ONDARKM, False)]], line_spacing=1.02)
text(s, Inches(0.9), Inches(3.85), Inches(11.6), Inches(0.4),
     [[("—  ", 13.5, AMBAR, True), ("A IA cuida do que se repete", 13.5, WHITE, True),
       ("  —  resume, organiza e rascunha, e nos devolve o recurso mais escasso: tempo para gente.", 12.5, ONDARKM, False)]])
text(s, Inches(0.9), Inches(4.3), Inches(11.6), Inches(0.4),
     [[("—  ", 13.5, AMBAR, True), ("A decisão é nossa", 13.5, WHITE, True),
       ("  —  a IA propõe e amplia o alcance; quem conecta, encanta e transforma somos nós.", 12.5, ONDARKM, False)]])
text(s, Inches(0.9), Inches(4.9), Inches(11.6), Inches(0.4),
     [[("Máquinas predizem; nós julgamos. ", 14, WHITE, True),
       ("A IA amplia o nosso alcance — o encontro humano é o que transforma.", 14, ONDARK, False)]])
box(s, Inches(0.8), Inches(5.75), Inches(11.73), Inches(0.95), fill=PETROLEO, round_=True)
text(s, Inches(1.05), Inches(5.79), Inches(11.3), Inches(0.88),
     [[("Inteligência Acelerada ", 16, AMBAR, True),
       ("PODE nos ajudar a conectar, encantar e transformar — ", 16, WHITE, True),
       ("melhor e mais rápido.", 16, AMBAR, True)]],
     anchor=MSO_ANCHOR.MIDDLE, line_spacing=1.02)
notes(s, "~1 min. Fecho: IA = Inteligencia Acelerada. A IA nao substitui o fator humano na busca do proposito — "
         "amplifica e acelera. Pessoas leem o contexto e avaliam os fatos (verdade): mall, eventos, gastronomia, "
         "operacao e gargalos. A IA cuida do repetitivo e devolve tempo para gente. Maquinas predizem; nos julgamos "
         "— a decisao e nossa. Encerre na frase 'conectar, encantar e transformar — melhor e mais rapido'. Agradeca.")

# ---------------------------------------------------------------- salvar
out = "/home/user/radarbazin1/apresentacao/Shopping_Inteligente_IA_Mooca_Plaza.pptx"
prs.save(out)
print("OK ->", out, "| slides:", len(prs.slides._sldIdLst))
