#!/usr/bin/env python3
"""Gera a apresentacao 'Radar Quiosques — Guia do Executivo' em PPTX (16:9, tema escuro).
Uso: python3 docs/deck/build_quiosques_ppt.py [saida.pptx]
"""
import sys
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.ns import qn

# paleta ALLOS (tema claro)
BG   = RGBColor(0xFF, 0xFF, 0xFF)  # fundo claro
CARD = RGBColor(0xE5, 0xDE, 0xD4)  # areia (cards)
LINE = RGBColor(0xCC, 0xC5, 0xBC)  # bege (divisores)
LINE2= RGBColor(0xCC, 0xC5, 0xBC)
TX   = RGBColor(0x0D, 0x45, 0x4A)  # verde-escuro (corpo)
MUT  = RGBColor(0x3A, 0x5C, 0x5A)  # muted
DIM  = RGBColor(0x6E, 0x86, 0x84)
WHITE= RGBColor(0x00, 0x61, 0x6F)  # títulos sobre claro = petróleo
GRN  = RGBColor(0x3F, 0x9E, 0x6A)  # menta legível (positivo)
BLU  = RGBColor(0x36, 0x8C, 0x82)  # teal (destaque/eyebrow)
AMB  = RGBColor(0xC0, 0x7D, 0x1E)  # âmbar legível (atenção)
CORAL= RGBColor(0xCD, 0x51, 0x51)  # coral (negativo)
PETRO= RGBColor(0x00, 0x61, 0x6F)  # petróleo (primária)
AREIA= RGBColor(0xE5, 0xDE, 0xD4)
BLU_BG = CARD    # notas: fundo = areia
AMB_BG = CARD

prs = Presentation()
prs.slide_width  = Inches(13.333)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]
SW, SH = prs.slide_width, prs.slide_height
LX = Inches(0.92)
CW = Inches(11.49)

def solid(shape, color, line=None, lw=1.0):
    shape.fill.solid(); shape.fill.fore_color.rgb = color
    if line is None:
        shape.line.fill.background()
    else:
        shape.line.color.rgb = line; shape.line.width = Pt(lw)
    shape.shadow.inherit = False

def add_bg(slide):
    r = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, SW, SH)
    solid(r, BG); return r

def tb(slide, l, t, w, h):
    box = slide.shapes.add_textbox(l, t, w, h); tf = box.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    return box, tf

def setrun(p, text, size, color, bold=False, italic=False, font="Calibri"):
    r = p.add_run(); r.text = text
    r.font.size = Pt(size); r.font.bold = bold; r.font.italic = italic
    r.font.name = font; r.font.color.rgb = color
    return r

def para(tf, first=False):
    return tf.paragraphs[0] if first else tf.add_paragraph()

def eyebrow(slide, text):
    box, tf = tb(slide, LX, Inches(0.62), CW, Inches(0.4))
    p = para(tf, True); p.alignment = PP_ALIGN.LEFT
    setrun(p, text.upper(), 12.5, BLU, bold=True)
    for r in p.runs: r.font.spacing = Pt(1.2)

def title(slide, text, size=30):
    box, tf = tb(slide, LX, Inches(1.06), CW, Inches(1.2))
    p = para(tf, True); setrun(p, text, size, WHITE, bold=True)

def lead(slide, text, t=Inches(2.12)):
    box, tf = tb(slide, LX, t, Inches(9.6), Inches(0.9))
    p = para(tf, True); p.line_spacing = 1.3; setrun(p, text, 15, MUT)
    return box

def note(slide, text, warn=False, t=None):
    h = Inches(0.9)
    if t is None: t = SH - Inches(1.28)
    r = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, LX, t, CW, h)
    solid(r, AMB_BG if warn else BLU_BG, (AMB if warn else BLU), 1.0)
    tf = r.text_frame; tf.word_wrap = True
    tf.margin_left = tf.margin_right = Inches(0.16); tf.margin_top = tf.margin_bottom = Inches(0.08)
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = para(tf, True); p.line_spacing = 1.25
    setrun(p, text, 12.5, TX)

def footer(slide, idx, total):
    box, tf = tb(slide, LX, SH - Inches(0.34), CW, Inches(0.26))
    p = para(tf, True)
    setrun(p, "Radar Quiosques — Guia do Executivo", 9, DIM)
    box2, tf2 = tb(slide, SW - Inches(1.6), SH - Inches(0.34), Inches(0.7), Inches(0.26))
    p2 = para(tf2, True); p2.alignment = PP_ALIGN.RIGHT
    setrun(p2, f"{idx}/{total}", 9, DIM, bold=True)

def steps(slide, items, t=Inches(2.35)):
    h = Inches(0.74); gap = Inches(0.17); y = t
    for i, txt in enumerate(items, 1):
        r = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, LX, y, CW, h)
        solid(r, CARD, LINE, 0.75)
        c = slide.shapes.add_shape(MSO_SHAPE.OVAL, LX + Inches(0.18), y + Inches(0.2), Inches(0.34), Inches(0.34))
        solid(c, PETRO, PETRO, 1.0)
        ctf = c.text_frame; ctf.margin_left=ctf.margin_right=ctf.margin_top=ctf.margin_bottom=0
        ctf.vertical_anchor = MSO_ANCHOR.MIDDLE
        cp = para(ctf, True); cp.alignment = PP_ALIGN.CENTER; setrun(cp, str(i), 13, AREIA, bold=True)
        box, tf = tb(slide, LX + Inches(0.7), y, CW - Inches(0.9), h)
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = para(tf, True); p.line_spacing = 1.15
        _rich(p, txt)
        y = y + h + gap

def _rich(p, txt):
    """suporta **negrito** e [botao] simples."""
    import re
    parts = re.split(r'(\*\*[^*]+\*\*|\[[^\]]+\])', txt)
    for seg in parts:
        if not seg: continue
        if seg.startswith("**") and seg.endswith("**"):
            setrun(p, seg[2:-2], 14, WHITE, bold=True)
        elif seg.startswith("[") and seg.endswith("]"):
            r = setrun(p, " "+seg[1:-1]+" ", 12.5, TX, bold=True)
        else:
            setrun(p, seg, 14, TX)

def cards(slide, items, cols, t=Inches(2.35), total_h=Inches(3.9)):
    n = len(items); rows = (n + cols - 1) // cols
    gap = Inches(0.24)
    cw = int((CW - gap*(cols-1)) / cols)
    ch = int((total_h - gap*(rows-1)) / rows)
    for k, (h3, body) in enumerate(items):
        rr = k // cols; cc = k % cols
        x = LX + cc*(cw + gap); y = t + rr*(ch + gap)
        r = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, cw, ch)
        solid(r, CARD, LINE, 0.75)
        tf = r.text_frame; tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.16); tf.margin_top = Inches(0.14); tf.margin_bottom = Inches(0.1)
        p = para(tf, True); setrun(p, h3, 15, WHITE, bold=True)
        p2 = para(tf); p2.space_before = Pt(4); p2.line_spacing = 1.2; setrun(p2, body, 12.5, MUT)

def bullets(slide, items, t=Inches(2.3)):
    box, tf = tb(slide, LX, t, CW, Inches(3.4))
    for i, txt in enumerate(items):
        p = para(tf, i==0); p.space_after = Pt(9); p.line_spacing = 1.2
        setrun(p, "✓  ", 14, GRN, bold=True)
        _rich(p, txt)

def pills(slide, items, t):
    x = LX
    for txt in items:
        w = Inches(0.42 + 0.098*len(txt))
        r = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, t, w, Inches(0.44))
        solid(r, CARD, LINE2, 0.75)
        tf = r.text_frame; tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        tf.margin_left = tf.margin_right = Inches(0.12); tf.margin_top=tf.margin_bottom=0
        p = para(tf, True); p.alignment = PP_ALIGN.CENTER; setrun(p, txt, 12.5, MUT, bold=True)
        x = x + w + Inches(0.16)

def brandmark(slide, t=Inches(0.7)):
    r = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, LX, t, Inches(0.82), Inches(0.82))
    solid(r, PETRO, PETRO, 1.0)
    tf = r.text_frame; tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    tf.margin_left=tf.margin_right=tf.margin_top=tf.margin_bottom=0
    p = para(tf, True); p.alignment = PP_ALIGN.CENTER; setrun(p, "Q", 34, AREIA, bold=True)

# ------------------------------------------------------------------ slides
TOTAL = 13
def new():
    s = prs.slides.add_slide(BLANK); add_bg(s); return s

# 1 capa
s = new()
brandmark(s, Inches(1.15))
b, tf = tb(s, LX, Inches(2.2), CW, Inches(0.4)); p=para(tf,True); r=setrun(p,"GUIA DO EXECUTIVO",13,BLU,bold=True); r.font.spacing=Pt(1.2)
b, tf = tb(s, LX, Inches(2.62), CW, Inches(1.1)); p=para(tf,True); setrun(p,"Radar Quiosques",44,WHITE,bold=True)
lead(s, "Como captar e triar investidores, apoiar a decisão de marca e conectar cada investidor ao ponto certo do shopping — passo a passo, em cada funcionalidade do app.", Inches(3.75))
pills(s, ["🖥️ Roda no seu computador", "📴 Funciona offline", "📄 Imprima em PDF"], Inches(5.0))
footer(s, 1, TOTAL)

# 2 visão geral
s = new(); eyebrow(s, "1 · Visão geral"); title(s, "Quatro abas, um fluxo")
lead(s, "O app organiza todo o trabalho comercial de quiosques em quatro abas — do planejamento ao fechamento.")
cards(s, [
    ("➕ Triagem", "Faz as perguntas certas e recomenda marcas ao investidor."),
    ("👥 Investidores", "O banco de investidores para consulta futura."),
    ("🗺️ Planejamento", "Pontos do shopping, mix desejado e marcas-alvo."),
    ("🔗 Cruzamento", "Conecta a base ao planejamento comercial."),
], cols=4, t=Inches(2.85), total_h=Inches(2.6))
note(s, "Fluxo: 1) configure o Planejamento  →  2) faça a Triagem ou receba fichas  →  3) consulte o banco de Investidores  →  4) use o Cruzamento para conectar investidor ↔ marca ↔ ponto.")
footer(s, 2, TOTAL)

# 3 rodar local
s = new(); eyebrow(s, "2 · Como abrir"); title(s, "Roda no seu computador, sem internet")
steps(s, [
    "Salve o arquivo **quiosques.html** no computador (ou no celular).",
    "**Duplo clique** — abre no seu navegador (Chrome, Edge, Safari). Não precisa instalar nada.",
    "Opcional (online): abra por **radarbazin1.vercel.app/quiosques.html**; no celular, use “Adicionar à Tela de Início”.",
])
note(s, "Os dados ficam salvos NESTE navegador/dispositivo. Para não perder ou mudar de máquina, use Backup (aba Investidores).", warn=True)
footer(s, 3, TOTAL)

# 4 triagem
s = new(); eyebrow(s, "3 · Aba Triagem"); title(s, "Triar um investidor e recomendar marcas")
steps(s, [
    "Preencha as 5 seções: **identificação**, **capacidade** (capital + capital de giro), **tempo**, **experiência** e **marca/segmento em mente**.",
    "Clique em [Cruzar dados & recomendar ▸]",
    "Leia o **Diagnóstico** (perfil + alertas), as **lacunas do planejamento** e o **ranking de marcas** (nota 0–100 + o porquê).",
    "[💾 Salvar] grava o investidor no banco, ou [Copiar resumo] para enviar ao investidor / CRM.",
])
note(s, "Só o capital de implantação é obrigatório. Marcas 🎯 Desejada são as que o shopping quer atrair; marcas já presentes num ponto não são recomendadas de novo.")
footer(s, 4, TOTAL)

# 5 ficha
s = new(); eyebrow(s, "4 · Ficha do investidor"); title(s, "Enviar a ficha e receber preenchida")
steps(s, [
    "Na Triagem, clique em [📤 Enviar ficha] e compartilhe o **link** por WhatsApp/e-mail.",
    "O investidor abre no próprio celular, preenche uma ficha simples (sem ver notas) e clica em **Concluir**.",
    "Ele te devolve um **código** (começa com **RQ1:**) ou um arquivo — por WhatsApp, e-mail ou download.",
    "Você clica em [📥 Receber resposta], cola o código (ou importa o arquivo) e a ficha **entra no banco já pontuada**.",
])
note(s, "Para enviar a ficha, use o app pela versão online (link Vercel) — assim o link gerado funciona no celular do investidor.", warn=True)
footer(s, 5, TOTAL)

# 6 investidores
s = new(); eyebrow(s, "5 · Aba Investidores"); title(s, "O banco de investidores")
cards(s, [
    ("🔎 Consultar", "Busque por nome/contato/marca e filtre por status: Novo, Em contato, Proposta, Fechado, Descartado (clique no status para avançar)."),
    ("👁️ Detalhar", "Ver recalcula diagnóstico e ranking ao vivo. Reabrir edita o cadastro; há campo de anotações do executivo."),
    ("⬇ Exportar", "Exportar CSV (abre no Excel) e Backup JSON (cópia completa dos dados)."),
    ("⬆ Importar", "Importar CSV cadastra vários investidores de uma planilha (modelo em anexo)."),
], cols=2, t=Inches(2.35), total_h=Inches(3.35))
note(s, "Cada investidor guarda as 3 melhores marcas recomendadas na hora do cadastro — visíveis já na lista.")
footer(s, 6, TOTAL)

# 7 planejamento pontos
s = new(); eyebrow(s, "6 · Aba Planejamento · Pontos"); title(s, "Lançar os pontos do shopping")
steps(s, [
    "Para cada ponto, escolha **Ocupado** (informe a **marca** que opera) ou **Vago**.",
    "No ponto vago, defina até **3 opções de mix desejado** (segmentos, por ordem de preferência).",
    "[+ Adicionar ponto] quantos precisar e clique em [Salvar pontos].",
    "Em massa: [⬇ Baixar modelo (CSV)], preencha no Excel e [⬆ Importar CSV] (modelo em anexo).",
])
note(s, "A ocupação e a demanda de cada segmento saem daqui: pontos vagos com determinado mix puxam as marcas certas no ranking e no Cruzamento.")
footer(s, 7, TOTAL)

# 8 planejamento marcas
s = new(); eyebrow(s, "7 · Aba Planejamento · Marcas"); title(s, "Marcas desejadas e base de marcas")
cards(s, [
    ("⭐ Marcas desejadas", "Marcas que o shopping quer atrair (prioridade Alta/Média). Ganham destaque na recomendação e uma seção no Cruzamento."),
    ("🏷️ Base de marcas", "Modelo de marcas exporta as marcas atuais; Importar marcas carrega a sua base (Excel)."),
], cols=2, t=Inches(2.3), total_h=Inches(1.7))
bullets(s, [
    "Expanda a base com as marcas da **sua praça** sem mexer no código.",
    "Marca com nome igual à da base **substitui** a original (sem duplicar).",
    "**Segmentos novos** na planilha são criados automaticamente (mix e interesses).",
], t=Inches(4.15))
note(s, "Os valores da base são de referência (ABF/PEGN). Sempre confirme na COF de cada rede antes de decidir.", warn=True)
footer(s, 8, TOTAL)

# 9 cruzamento
s = new(); eyebrow(s, "8 · Aba Cruzamento"); title(s, "Conectar base × planejamento")
cards(s, [
    ("🗺️ Pontos vagos × encaixe", "Para cada ponto vago, mostra os melhores investidores × marca dos segmentos desejados daquele ponto."),
    ("⭐ Marcas desejadas × base", "Para cada marca-alvo, quem na base se encaixa (com a trava financeira: sem capital, não aparece)."),
    ("📊 Cobertura", "Quantos pontos vagos já têm candidato forte — e quais estão sem candidato (foco de captação)."),
    ("🎯 Ação", "Cada linha é um convite: “ligar para o investidor X sobre a marca Y no ponto Z”."),
], cols=2, t=Inches(2.35), total_h=Inches(4.35))
footer(s, 9, TOTAL)

# 10 planilhas
s = new(); eyebrow(s, "9 · Carga por planilha"); title(s, "Planilhas-modelo (em anexo)")
lead(s, "Preencha no Excel/Google Sheets e importe. Cada planilha vai para uma aba diferente.")
steps(s, [
    "**investidores-exemplo.csv**  →  aba Investidores › [Importar CSV]",
    "**pontos-shopping-exemplo.csv**  →  aba Planejamento › [Importar CSV]",
    "**marcas-exemplo.csv**  →  Planejamento › Base de marcas › [Importar marcas]",
], t=Inches(2.75))
note(s, "Também online em radarbazin1.vercel.app/exemplos/. As colunas de status/tempo/experiência aceitam o texto amigável (ex.: “Integral”, “Novo”).")
footer(s, 10, TOTAL)

# 11 backup
s = new(); eyebrow(s, "10 · Backup & portabilidade"); title(s, "Não perca seus dados")
steps(s, [
    "Periodicamente, aba Investidores › [⬇ Backup JSON] (salva investidores + planejamento).",
    "Para usar em **outro computador**: abra o app lá e use [⬆ Importar backup] com o arquivo salvo.",
    "Para levar ao Excel/relatório: [⬇ Exportar CSV].",
])
note(s, "Como tudo roda local, o backup é a sua rede de segurança. Guarde-o em nuvem pessoal (Drive/OneDrive) ou e-mail.")
footer(s, 11, TOTAL)

# 12 dicas
s = new(); eyebrow(s, "11 · Boas práticas"); title(s, "Dicas para tirar o máximo")
bullets(s, [
    "Configure o **Planejamento** antes: o cruzamento só é bom com os pontos e marcas reais.",
    "Substitua a base de exemplo pelas **marcas da sua praça**, com números de COF.",
    "Pergunte o **capital de giro** separado — maior causa de mortalidade no 1º ano.",
    "Atualize o **status** de cada investidor; use as **anotações** para o follow-up.",
    "Faça **backup** ao fim de cada dia de captação.",
])
note(s, "Ferramenta de apoio à decisão — não substitui a análise financeira formal nem a due diligence da franquia.", warn=True)
footer(s, 12, TOTAL)

# 13 fim
s = new(); brandmark(s, Inches(1.15))
b, tf = tb(s, LX, Inches(2.35), CW, Inches(1.1)); p=para(tf,True); setrun(p,"Pronto para usar",40,WHITE,bold=True)
lead(s, "Abra o quiosques.html, importe as planilhas-modelo em anexo e comece pela aba Planejamento. Em minutos você tem o banco de investidores cruzando com o mix do shopping.", Inches(3.5))
pills(s, ["➕ Triagem", "👥 Investidores", "🗺️ Planejamento", "🔗 Cruzamento"], Inches(4.8))
footer(s, 13, TOTAL)

out = sys.argv[1] if len(sys.argv) > 1 else "Radar-Quiosques-Guia-Executivo.pptx"
prs.save(out)
print("Salvo:", out, "|", len(prs.slides.__iter__.__self__._sldIdLst), "slides")
