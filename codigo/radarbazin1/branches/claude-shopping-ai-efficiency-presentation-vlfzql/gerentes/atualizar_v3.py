# -*- coding: utf-8 -*-
"""
Atualiza 06_Workshop_Agentes_v3.0 -> incorpora o conteudo refinado na intro e
conclusao, sem distorcer o restante:
- Slide 3 (intro): 'analytics' -> 'analises' (coerencia).
- Slide 32 (conclusao): reescreve para IA = INTELIGENCIA ACELERADA (mesmos
  conceitos do deck do shopping), preservando o slide 33 (Sam Zell) como fecho.
"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

PETROLEO=RGBColor(0x00,0x61,0x6F); VERDE=RGBColor(0x0D,0x45,0x4A); TEAL=RGBColor(0x36,0x8C,0x82)
AMBAR=RGBColor(0xED,0xA7,0x54); BEGE=RGBColor(0xCC,0xC5,0xBC); AREIA=RGBColor(0xE5,0xDE,0xD4)
WHITE=RGBColor(0xFF,0xFF,0xFF); ONDARK=AREIA; ONDARKM=BEGE
FONT="Calibri"

def box(s,l,t,w,h,fill=None,line=None,lw=1.0,round_=False):
    sp=s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE if round_ else MSO_SHAPE.RECTANGLE,l,t,w,h)
    if fill is None: sp.fill.background()
    else: sp.fill.solid(); sp.fill.fore_color.rgb=fill
    if line is None: sp.line.fill.background()
    else: sp.line.color.rgb=line; sp.line.width=Pt(lw)
    sp.shadow.inherit=False; return sp
def text(s,l,t,w,h,runs,align=PP_ALIGN.LEFT,anchor=MSO_ANCHOR.TOP,sa=3,ls=1.0):
    tb=s.shapes.add_textbox(l,t,w,h); tf=tb.text_frame; tf.word_wrap=True; tf.vertical_anchor=anchor
    for i,para in enumerate(runs):
        p=tf.paragraphs[0] if i==0 else tf.add_paragraph()
        p.alignment=align; p.space_after=Pt(sa); p.space_before=Pt(0); p.line_spacing=ls
        for (tx,sz,co,bo) in para:
            r=p.add_run(); r.text=tx; r.font.size=Pt(sz); r.font.color.rgb=co; r.font.bold=bo; r.font.name=FONT
    return tb
def chip(s,l,t,label,fill=AMBAR,fg=VERDE,size=9.5):
    w=Inches(0.16+0.076*len(label)); c=box(s,l,t,w,Inches(0.32),fill=fill,round_=True)
    tf=c.text_frame; tf.margin_top=Pt(1); tf.margin_bottom=Pt(1); tf.margin_left=Pt(7); tf.margin_right=Pt(7)
    p=tf.paragraphs[0]; p.alignment=PP_ALIGN.CENTER; r=p.add_run(); r.text=label
    r.font.size=Pt(size); r.font.bold=True; r.font.color.rgb=fg; r.font.name=FONT; return c

base="/home/user/radarbazin1/gerentes/"
prs=Presentation(base+"06_Workshop_Agentes_v3.0.pptx")
S=list(prs.slides)

# ---- SLIDE 3: analytics -> analises (coerencia) ----
for sh in S[2].shapes:
    if sh.has_text_frame:
        for p in sh.text_frame.paragraphs:
            for r in p.runs:
                if "analytics" in r.text:
                    r.text=r.text.replace("analytics","análises")

# ---- SLIDE 32: reescreve para IA = INTELIGENCIA ACELERADA ----
s=S[31]; tree=s.shapes._spTree
for shp in list(s.shapes): tree.remove(shp._element)
bg=s.shapes.add_shape(MSO_SHAPE.RECTANGLE,0,0,prs.slide_width,prs.slide_height)
bg.fill.solid(); bg.fill.fore_color.rgb=VERDE; bg.line.fill.background(); bg.shadow.inherit=False
box(s,0,0,prs.slide_width,Inches(0.14),fill=AMBAR)
box(s,0,prs.slide_height-Inches(0.14),prs.slide_width,Inches(0.14),fill=PETROLEO)
chip(s,Inches(0.5),Inches(0.4),"PARA FECHAR · IA = INTELIGÊNCIA ACELERADA")
text(s,Inches(0.5),Inches(0.85),Inches(9.0),Inches(0.95),
     [[("A IA não vai substituir o fator humano na busca pelo nosso propósito. Ela pode ",17,WHITE,True),
       ("amplificá-lo e acelerá-lo.",17,AMBAR,True)]],ls=1.03)
text(s,Inches(0.5),Inches(1.9),Inches(9.0),Inches(0.25),[[("PONTOS DE ATENÇÃO",9.5,AMBAR,True)]])
text(s,Inches(0.5),Inches(2.18),Inches(9.0),Inches(0.6),
     [[("—  ",11,AMBAR,True),("Pessoas leem o contexto e avaliam os fatos (verdade)",11,WHITE,True),
       ("  —  o clima e a experiência no mall, eventos e gastronomia, o que encanta o cliente; a operação e seus "
        "gargalos. Isso se vive, se avalia — e decide o melhor caminho.",10,ONDARKM,False)]],ls=1.0)
text(s,Inches(0.5),Inches(2.82),Inches(9.0),Inches(0.35),
     [[("—  ",11,AMBAR,True),("A IA cuida do que se repete",11,WHITE,True),
       ("  —  resume, organiza e rascunha, e nos devolve o recurso mais escasso: tempo para gente.",10,ONDARKM,False)]])
text(s,Inches(0.5),Inches(3.2),Inches(9.0),Inches(0.35),
     [[("—  ",11,AMBAR,True),("A decisão é nossa",11,WHITE,True),
       ("  —  a IA propõe e amplia o alcance; quem conecta, encanta e transforma somos nós.",10,ONDARKM,False)]])
text(s,Inches(0.5),Inches(3.7),Inches(9.0),Inches(0.35),
     [[("Máquinas predizem; nós julgamos. ",11,WHITE,True),
       ("A IA amplia o nosso alcance — o encontro humano é o que transforma.",11,ONDARK,False)]])
box(s,Inches(0.45),Inches(4.4),Inches(9.1),Inches(0.82),fill=PETROLEO,round_=True)
text(s,Inches(0.65),Inches(4.44),Inches(8.7),Inches(0.74),
     [[("Inteligência Acelerada ",12.5,AMBAR,True),
       ("PODE nos ajudar a conectar, encantar e transformar — ",12.5,WHITE,True),
       ("melhor e mais rápido.",12.5,AMBAR,True)]],anchor=MSO_ANCHOR.MIDDLE,ls=1.02)
# notas
s.notes_slide.notes_text_frame.text=(
 "~1 min. Fecho: IA = Inteligencia Acelerada. A IA nao substitui o fator humano na busca do proposito — "
 "amplifica e acelera. Pessoas leem o contexto e avaliam os fatos (verdade). A IA cuida do repetitivo e "
 "devolve tempo para gente. Maquinas predizem; nos julgamos — a decisao e nossa. Emenda no 'Make big plans' do Zell (slide seguinte).")

out=base+"06_Workshop_Agentes_v3.1.pptx"
prs.save(out); print(out.split('/')[-1],"-> slides:",len(prs.slides._sldIdLst))
