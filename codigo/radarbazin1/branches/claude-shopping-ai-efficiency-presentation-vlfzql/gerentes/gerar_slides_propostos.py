# -*- coding: utf-8 -*-
"""
Slides PROPOSTOS para encaixar no treinamento de gerentes (decks 06 e 07).
Tamanho 10 x 5.625in (igual aos decks), paleta Allos, fonte Calibri.
Cobre os 3 padroes pedidos: C.R.I.A.R., estrutura de agentes (sistema) e
conclusao 'Inteligencia Aumentada'. Pensados para MERGE/insercao manual.
"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

PETROLEO=RGBColor(0x00,0x61,0x6F); VERDE=RGBColor(0x0D,0x45,0x4A); TEAL=RGBColor(0x36,0x8C,0x82)
CORAL=RGBColor(0xCD,0x51,0x51); MENTA=RGBColor(0x6C,0xC6,0x80); AMBAR=RGBColor(0xED,0xA7,0x54)
BEGE=RGBColor(0xCC,0xC5,0xBC); AREIA=RGBColor(0xE5,0xDE,0xD4); WHITE=RGBColor(0xFF,0xFF,0xFF)
INK=VERDE; TITLE=PETROLEO; SUB=TEAL; CARD=WHITE; PAGE=AREIA; DARK=VERDE; ONDARK=AREIA

prs=Presentation(); prs.slide_width=Inches(10); prs.slide_height=Inches(5.625)
SW,SH=prs.slide_width,prs.slide_height; BLANK=prs.slide_layouts[6]
FONT="Calibri"

def slide(dark=False):
    s=prs.slides.add_slide(BLANK)
    bg=s.shapes.add_shape(MSO_SHAPE.RECTANGLE,0,0,SW,SH)
    bg.fill.solid(); bg.fill.fore_color.rgb=DARK if dark else PAGE
    bg.line.fill.background(); bg.shadow.inherit=False
    s.shapes._spTree.remove(bg._element); s.shapes._spTree.insert(2,bg._element); return s
def box(s,l,t,w,h,fill=None,line=None,lw=1.0,round_=False):
    sp=s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE if round_ else MSO_SHAPE.RECTANGLE,l,t,w,h)
    if fill is None: sp.fill.background()
    else: sp.fill.solid(); sp.fill.fore_color.rgb=fill
    if line is None: sp.line.fill.background()
    else: sp.line.color.rgb=line; sp.line.width=Pt(lw)
    sp.shadow.inherit=False; return sp
def text(s,l,t,w,h,runs,align=PP_ALIGN.LEFT,anchor=MSO_ANCHOR.TOP,sa=4,ls=1.0):
    tb=s.shapes.add_textbox(l,t,w,h); tf=tb.text_frame; tf.word_wrap=True; tf.vertical_anchor=anchor
    for i,para in enumerate(runs):
        p=tf.paragraphs[0] if i==0 else tf.add_paragraph()
        p.alignment=align; p.space_after=Pt(sa); p.space_before=Pt(0); p.line_spacing=ls
        for (tx,sz,co,bo) in para:
            r=p.add_run(); r.text=tx; r.font.size=Pt(sz); r.font.color.rgb=co; r.font.bold=bo; r.font.name=FONT
    return tb
def header(s,kicker,title):
    box(s,Inches(0.5),Inches(0.42),Inches(0.1),Inches(0.62),fill=PETROLEO)
    text(s,Inches(0.72),Inches(0.4),Inches(8.8),Inches(0.3),[[(kicker.upper(),10.5,TEAL,True)]])
    text(s,Inches(0.72),Inches(0.66),Inches(8.9),Inches(0.6),[[(title,22,TITLE,True)]])
def chip(s,l,t,label,fill=AMBAR,fg=VERDE,size=10):
    w=Inches(0.18+0.082*len(label)); c=box(s,l,t,w,Inches(0.34),fill=fill,round_=True)
    tf=c.text_frame; tf.margin_top=Pt(1); tf.margin_bottom=Pt(1); tf.margin_left=Pt(8); tf.margin_right=Pt(8)
    p=tf.paragraphs[0]; p.alignment=PP_ALIGN.CENTER; r=p.add_run(); r.text=label
    r.font.size=Pt(size); r.font.bold=True; r.font.color.rgb=fg; r.font.name=FONT; return c

# ============================================================= 1 — C.R.I.A.R.
s=slide(); header(s,"Régua de bolso · falar com o agente","C.R.I.A.R. — a régua do bom pedido")
text(s,Inches(0.72),Inches(1.32),Inches(8.6),Inches(0.3),
     [[("Um jeito de lembrar, na hora de pedir, o que todo bom prompt precisa ter.",12,INK,False)]])
rows=[("C — Contexto","quem você é e a situação","ex.: sou gerente de operações do shopping…"),
      ("R — Resultado","o que quer e em que formato","ex.: um plano em tabela, até 1 página"),
      ("I — Informação","os dados/base que ele deve usar","ex.: segue as vendas por loja do trimestre"),
      ("A — Audiência","para quem é (define o tom)","ex.: é para a diretoria / para o time"),
      ("R — Restrições","limites, tamanho, o que evitar","ex.: sem jargão, foco em ação")]
y=1.72
for h,w,ex in rows:
    box(s,Inches(0.5),Inches(y),Inches(9.0),Inches(0.52),fill=CARD,line=BEGE,round_=True)
    text(s,Inches(0.68),Inches(y+0.09),Inches(2.0),Inches(0.4),[[(h,12.5,TITLE,True)]])
    text(s,Inches(2.75),Inches(y+0.09),Inches(2.7),Inches(0.4),[[(w,11,INK,True)]],anchor=MSO_ANCHOR.MIDDLE)
    text(s,Inches(5.55),Inches(y+0.09),Inches(3.8),Inches(0.4),[[(ex,10.5,SUB,False)]],anchor=MSO_ANCHOR.MIDDLE)
    y+=0.6
text(s,Inches(0.5),Inches(4.85),Inches(9.0),Inches(0.5),
     [[("Como usar: ",11.5,AMBAR,True),
       ("comece com C + R + I e refine pedindo ajustes. Operacionaliza os 7 princípios — e confira sempre o resultado.",11.5,INK,False)]])

# ============================================================= 2 — SISTEMA DE AGENTES
s=slide(); header(s,"Visão de sistema","Os 4 agentes em um sistema só")
box(s,Inches(2.9),Inches(1.35),Inches(4.2),Inches(0.72),fill=PETROLEO,round_=True)
text(s,Inches(2.9),Inches(1.4),Inches(4.2),Inches(0.62),
     [[("VOCÊ ORQUESTRA",12.5,WHITE,True)],[("decide onde a IA propõe e onde o humano decide",9.5,AREIA,False)]],
     align=PP_ALIGN.CENTER,anchor=MSO_ANCHOR.MIDDLE,sa=0)
# duas camadas
cols=[("DESCOBERTA — traz oportunidade",[("Hunter","caça marcas que fecham as batalhas"),
                                        ("Farmer","cultiva investidores e multifranqueados")]),
      ("EXECUÇÃO — realiza e opera",[("Builder","obra e abertura: do contrato à loja operando"),
                                     ("Entertainer","praças e eventos que geram fluxo")])]
x=0.5
for titulo,ags in cols:
    box(s,Inches(x),Inches(2.45),Inches(4.5),Inches(2.35),fill=CARD,line=BEGE,round_=True)
    box(s,Inches(x),Inches(2.45),Inches(4.5),Inches(0.08),fill=(PETROLEO if 'DESCOBERTA' in titulo else AMBAR))
    text(s,Inches(x+0.2),Inches(2.6),Inches(4.1),Inches(0.3),[[(titulo,11.5,TITLE,True)]])
    yy=3.05
    for nome,desc in ags:
        box(s,Inches(x+0.2),Inches(yy),Inches(4.1),Inches(0.72),fill=AREIA,round_=True)
        text(s,Inches(x+0.35),Inches(yy+0.08),Inches(3.8),Inches(0.6),
             [[(nome,12,TITLE,True)],[(desc,10,INK,False)]],anchor=MSO_ANCHOR.MIDDLE,sa=0)
        yy+=0.82
    x+=4.75
text(s,Inches(0.5),Inches(4.95),Inches(9.0),Inches(0.4),
     [[("Ciclo fechado: ",11,AMBAR,True),
       ("a execução gera dados (vendas, fluxo, leads) que realimentam a descoberta. O gestor fecha o ciclo.",11,INK,False)]])

# ============================================================= 3 — CASO DE 1 PÁGINA
s=slide(); header(s,"De agente a resultado","O caso de 1 página (modelo reutilizável)")
box(s,Inches(0.5),Inches(1.35),Inches(4.45),Inches(3.35),fill=CARD,line=BEGE,round_=True)
box(s,Inches(0.5),Inches(1.35),Inches(4.45),Inches(0.08),fill=PETROLEO)
text(s,Inches(0.68),Inches(1.5),Inches(4.1),Inches(0.3),[[("ONDE USAR (no espírito do agente)",10.5,TITLE,True)]])
for i,it in enumerate(["Mapear marcas/lojas novas na região","Montar o dossiê do candidato",
                       "Classificar por aderência às batalhas","Gerar o e-mail de abordagem",
                       "Resumir o que mais se repete nos leads"]):
    text(s,Inches(0.68),Inches(1.9+i*0.5),Inches(4.1),Inches(0.45),
         [[("—  ",11,AMBAR,True),(it,11,INK,False)]])
box(s,Inches(5.05),Inches(1.35),Inches(4.45),Inches(3.35),fill=DARK,line=PETROLEO,lw=1.2,round_=True)
box(s,Inches(5.05),Inches(1.35),Inches(4.45),Inches(0.08),fill=AMBAR)
text(s,Inches(5.23),Inches(1.5),Inches(4.1),Inches(0.3),[[("PROMPT PRONTO PARA COPIAR",10.5,AMBAR,True)]])
text(s,Inches(5.23),Inches(1.95),Inches(4.1),Inches(2.6),
     [[(l,10.5,ONDARK,False)] for l in
      ["Você é o agente Hunter do shopping.","Abaixo, novos negócios da região (colei).",
       "Para cada um: categoria, tração (1–5), qual","batalha do cluster ele fecha e uma","pontuação de aderência (0–100) com 1 linha",
       "de justificativa. Ordene do maior ao menor.","Dados: <cole a lista>"]],ls=1.05)
text(s,Inches(0.5),Inches(4.85),Inches(9.0),Inches(0.45),
     [[("Ganho: ",11.5,AMBAR,True),("triagem e dossiê em minutos — mesmo padrão para todo agente (é só trocar a missão e o prompt).",11.5,INK,False)]])

# ============================================================= 4 — CONCLUSÃO (escuro)
s=slide(dark=True)
box(s,0,0,SW,Inches(0.14),fill=AMBAR); box(s,0,SH-Inches(0.14),SW,Inches(0.14),fill=PETROLEO)
chip(s,Inches(0.6),Inches(0.55),"PARA FECHAR · INTELIGÊNCIA AUMENTADA",fill=AMBAR,fg=VERDE)
text(s,Inches(0.6),Inches(1.05),Inches(8.8),Inches(1.0),
     [[("A IA não substitui o nosso julgamento. Ela o ",23,WHITE,True),("amplifica.",23,AMBAR,True)]],ls=1.04)
text(s,Inches(0.6),Inches(2.05),Inches(8.8),Inches(0.4),
     [[("Existimos para conectar pessoas, negócios e a sociedade — servindo e encantando todos os dias.",11.5,ONDARK,False)]])
pts=[("Nós lemos o contexto","o clima do shopping, o lojista, o time, a leitura da praça. Isso se vive, não se baixa de um sistema."),
     ("A IA cuida do que se repete","resume, organiza e rascunha — e nos devolve tempo para liderar pessoas."),
     ("A decisão é nossa","o agente propõe e amplia o alcance; quem conecta, encanta e transforma somos nós.")]
yy=2.55
for h,sub in pts:
    text(s,Inches(0.6),Inches(yy),Inches(8.8),Inches(0.5),
         [[("—  ",11.5,AMBAR,True),(h,11.5,WHITE,True),("  —  "+sub,10.5,BEGE,False)]],ls=1.02)
    yy+=0.5
box(s,Inches(0.5),Inches(4.55),Inches(9.0),Inches(0.7),fill=PETROLEO,round_=True)
text(s,Inches(0.6),Inches(4.58),Inches(8.8),Inches(0.64),
     [[("Make big plans. ",12.5,AMBAR,True),
       ("Inteligência Aumentada é como conectamos, encantamos e transformamos — todos os dias.",12.5,WHITE,True)]],
     anchor=MSO_ANCHOR.MIDDLE)

out="/home/user/radarbazin1/gerentes/Slides_propostos_gerentes.pptx"
prs.save(out); print("OK ->",out,"| slides:",len(prs.slides._sldIdLst))
