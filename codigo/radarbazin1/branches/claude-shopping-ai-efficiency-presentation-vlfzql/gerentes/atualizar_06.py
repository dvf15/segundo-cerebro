# -*- coding: utf-8 -*-
"""
Atualiza o Deck 06 (workshop de gerentes): regenera a partir do ORIGINAL inserindo
- Intro "O que é IA e Machine Learning" (Nivelamento)
- C.R.I.A.R. (regua de bolso)
- Visao de sistema dos 4 agentes
- Conclusao "Inteligencia Aumentada" COM os pontos de atencao (Goldberg)
Conceitos extraidos do resumo de Amir Goldberg (Stanford GSB), "The AI-Powered Organization".
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
FONT="Calibri"

def make_slide(prs, dark=False):
    s=prs.slides.add_slide(prs.slide_layouts[0])
    bg=s.shapes.add_shape(MSO_SHAPE.RECTANGLE,0,0,prs.slide_width,prs.slide_height)
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

# ---------------------------------------------------------------- INTRO IA/ML
def build_intro(prs):
    s=make_slide(prs); header(s,"Nivelamento","O que é IA e Machine Learning")
    box(s,Inches(0.5),Inches(1.32),Inches(9.0),Inches(1.02),fill=CARD,line=BEGE,round_=True)
    box(s,Inches(0.5),Inches(1.32),Inches(0.09),Inches(1.02),fill=PETROLEO)
    text(s,Inches(0.75),Inches(1.42),Inches(8.55),Inches(0.85),
         [[("Machine Learning: ",13,TITLE,True),
           ("um algoritmo que aprende com dados, sem programação explícita. É ótimo em uma coisa — ",12,INK,False),
           ("predição.",12,TITLE,True)],
          [("Predição = ",12,TEAL,True),
           ("transformar a informação que você TEM na informação que você NÃO tem.",12,INK,False)]],
         sa=3,ls=1.05)
    cards=[("MÁQUINA","Predição",TEAL,"Transforma dados em dados que faltam.","ex.: qual a probabilidade de chover?"),
           ("HUMANO","Julgamento",AMBAR,"Decide com base na predição.","ex.: mudar o casamento para dentro?")]
    x=0.5
    for tit,papel,bar,desc,ex in cards:
        box(s,Inches(x),Inches(2.55),Inches(4.4),Inches(1.5),fill=CARD,line=BEGE,round_=True)
        box(s,Inches(x),Inches(2.55),Inches(4.4),Inches(0.08),fill=bar)
        text(s,Inches(x+0.22),Inches(2.68),Inches(4.0),Inches(0.35),
             [[(tit+"  ",12.5,TITLE,True),("· "+papel,12.5,bar if bar!=AMBAR else VERDE,True)]])
        text(s,Inches(x+0.22),Inches(3.06),Inches(4.0),Inches(0.4),[[(desc,11.5,INK,True)]])
        text(s,Inches(x+0.22),Inches(3.45),Inches(4.0),Inches(0.4),[[(ex,10.5,SUB,False)]])
        x+=4.6
    box(s,Inches(0.5),Inches(4.28),Inches(9.0),Inches(0.92),fill=AREIA,line=BEGE,round_=True)
    text(s,Inches(0.72),Inches(4.4),Inches(8.55),Inches(0.72),
         [[("Líder data-driven = ",12,AMBAR,True),
           ("consumidor informado de analytics. Não precisa programar — precisa saber o que os dados podem (e não podem) fazer. ",12,INK,False),
           ("Máquinas predizem; pessoas julgam.",12,TITLE,True)]],ls=1.05)
    return s

def build_criar(prs):
    s=make_slide(prs); header(s,"Régua de bolso · falar com o agente","C.R.I.A.R. — a régua do bom pedido")
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
    return s

def build_sistema(prs):
    s=make_slide(prs); header(s,"Visão de sistema","Os 4 agentes em um sistema só")
    box(s,Inches(2.9),Inches(1.35),Inches(4.2),Inches(0.72),fill=PETROLEO,round_=True)
    text(s,Inches(2.9),Inches(1.4),Inches(4.2),Inches(0.62),
         [[("VOCÊ ORQUESTRA",12.5,WHITE,True)],[("decide onde a IA propõe e onde o humano decide",9.5,AREIA,False)]],
         align=PP_ALIGN.CENTER,anchor=MSO_ANCHOR.MIDDLE,sa=0)
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
    return s

# ---------------------------------------------------------------- CONCLUSAO + PONTOS DE ATENCAO
def build_conclusao(prs):
    s=make_slide(prs,dark=True)
    box(s,0,0,prs.slide_width,Inches(0.14),fill=AMBAR); box(s,0,prs.slide_height-Inches(0.14),prs.slide_width,Inches(0.14),fill=PETROLEO)
    chip(s,Inches(0.6),Inches(0.45),"PARA FECHAR · INTELIGÊNCIA AUMENTADA",fill=AMBAR,fg=VERDE)
    text(s,Inches(0.6),Inches(0.92),Inches(8.8),Inches(0.85),
         [[("A IA não substitui o nosso julgamento. Ela o ",21,WHITE,True),("amplifica.",21,AMBAR,True)]],ls=1.02)
    text(s,Inches(0.6),Inches(1.72),Inches(8.8),Inches(0.35),
         [[("Máquinas predizem; nós julgamos. A decisão estratégica continua nossa.",12,ONDARK,False)]])
    text(s,Inches(0.6),Inches(2.16),Inches(8.8),Inches(0.3),[[("PONTOS DE ATENÇÃO",11,AMBAR,True)]])
    pts=[("Escolha o objetivo certo","a métrica de superfície engana — DAU, nº de estrelas (lembre do Tay.ai)."),
         ("IA não é mágica","há limites de predição: nem tudo é previsível, mesmo com muitos dados."),
         ("Não deixe o algoritmo pensar por você","meça o mesmo objetivo de várias formas e confira sempre."),
         ("People analytics no agregado","nunca para contratar/demitir no individual — insista no humano.")]
    yy=2.52
    for h,sub in pts:
        text(s,Inches(0.6),Inches(yy),Inches(8.8),Inches(0.4),
             [[("—  ",11,AMBAR,True),(h,11,WHITE,True),("  —  "+sub,10.5,BEGE,False)]],ls=1.0)
        yy+=0.42
    box(s,Inches(0.5),Inches(4.5),Inches(9.0),Inches(0.74),fill=PETROLEO,round_=True)
    text(s,Inches(0.7),Inches(4.54),Inches(8.6),Inches(0.66),
         [[("A IA reproduz o mundo que existe — não dirige a mudança. A decisão estratégica é nossa.",12.5,WHITE,True)],
          [("— adaptado de Amir Goldberg · Stanford GSB",9.5,AREIA,False)]],
         anchor=MSO_ANCHOR.MIDDLE,sa=0,ls=1.0)
    return s

def reorder(prs, insertions):
    lst=prs.slides._sldIdLst; orig=list(lst); N=len(orig)
    ins=sorted(insertions,key=lambda t:t[0]); new=[]
    for _,b in ins: b(prs); new.append(list(lst)[-1])
    pairs=list(zip([i for i,_ in ins],new)); final=[]; j=0
    for i in range(N):
        while j<len(pairs) and pairs[j][0]==i: final.append(pairs[j][1]); j+=1
        final.append(orig[i])
    while j<len(pairs): final.append(pairs[j][1]); j+=1
    for el in final: lst.append(el)

base="/home/user/radarbazin1/gerentes/"
prs=Presentation(base+"06_Workshop_Agentes.pptx")
# original 06: intro antes do 3 (Anatomia); CRIAR antes do 5; Sistema antes do 9; Conclusao antes do 29
reorder(prs,[(2,build_intro),(4,build_criar),(8,build_sistema),(28,build_conclusao)])
out=base+"06_Workshop_Agentes_ATUALIZADO.pptx"
prs.save(out); print(out.split('/')[-1],"-> slides:",len(prs.slides._sldIdLst))
