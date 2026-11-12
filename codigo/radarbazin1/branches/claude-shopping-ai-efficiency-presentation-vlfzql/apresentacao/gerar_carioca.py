# -*- coding: utf-8 -*-
"""
Versao Carioca Shopping da apresentacao Shopping Inteligente (base: Mooca Plaza).
- Troca nomes Mooca -> Carioca (capa, slide 26, notas).
- Insere 1 slide-resumo "Claude Chat, Cowork e Code: quando usar cada um",
  com espaco reservado para colar um exemplo do app Shopping Inteligente.
Entrada: Shopping_Inteligente_IA_Mooca_Plaza.pptx
Saida:   Shopping_Inteligente_IA_Carioca_Shopping.pptx
"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.ns import qn

PETROLEO=RGBColor(0x00,0x61,0x6F); VERDE=RGBColor(0x0D,0x45,0x4A); TEAL=RGBColor(0x36,0x8C,0x82)
CORAL=RGBColor(0xCD,0x51,0x51); MENTA=RGBColor(0x6C,0xC6,0x80); AMBAR=RGBColor(0xED,0xA7,0x54)
BEGE=RGBColor(0xCC,0xC5,0xBC); AREIA=RGBColor(0xE5,0xDE,0xD4); WHITE=RGBColor(0xFF,0xFF,0xFF)
PAGE=WHITE; DARK=VERDE; INK=VERDE; TITLE=PETROLEO; SUB=TEAL; CARD=AREIA; CLINE=BEGE; ONDARK=AREIA; FONT="Calibri"

base="/home/user/radarbazin1/apresentacao/"
prs=Presentation(base+"Shopping_Inteligente_IA_Mooca_Plaza.pptx")
SW,SH=prs.slide_width,prs.slide_height

# ---------- helpers (mesmo padrao do gerador) ----------
def box(s,l,t,w,h,fill=None,line=None,line_w=1.0,round_=False):
    shp=s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE if round_ else MSO_SHAPE.RECTANGLE,l,t,w,h)
    if fill is None: shp.fill.background()
    else: shp.fill.solid(); shp.fill.fore_color.rgb=fill
    if line is None: shp.line.fill.background()
    else: shp.line.color.rgb=line; shp.line.width=Pt(line_w)
    shp.shadow.inherit=False; return shp
def text(s,l,t,w,h,runs,align=PP_ALIGN.LEFT,anchor=MSO_ANCHOR.TOP,space_after=6,line_spacing=1.0):
    tb=s.shapes.add_textbox(l,t,w,h); tf=tb.text_frame; tf.word_wrap=True; tf.vertical_anchor=anchor
    for i,para in enumerate(runs):
        p=tf.paragraphs[0] if i==0 else tf.add_paragraph()
        p.alignment=align; p.space_after=Pt(space_after); p.space_before=Pt(0); p.line_spacing=line_spacing
        for (tx,sz,co,bo) in para:
            r=p.add_run(); r.text=tx; r.font.size=Pt(sz); r.font.color.rgb=co; r.font.bold=bo; r.font.name=FONT
    return tb
def chip(s,l,t,label,fill=PETROLEO,fg=AREIA,size=12):
    w=Inches(0.2+0.095*len(label)); c=box(s,l,t,w,Inches(0.42),fill=fill,round_=True)
    tf=c.text_frame; tf.word_wrap=False; tf.margin_top=Pt(2); tf.margin_bottom=Pt(2); tf.margin_left=Pt(10); tf.margin_right=Pt(10)
    p=tf.paragraphs[0]; p.alignment=PP_ALIGN.CENTER; r=p.add_run(); r.text=label
    r.font.size=Pt(size); r.font.bold=True; r.font.color.rgb=fg; r.font.name=FONT; return c
def header(s,kicker,title,time_label=None):
    box(s,Inches(0.55),Inches(0.55),Inches(0.12),Inches(0.95),fill=PETROLEO)
    text(s,Inches(0.8),Inches(0.5),Inches(9.8),Inches(0.4),[[(kicker.upper(),13,TEAL,True)]])
    text(s,Inches(0.8),Inches(0.85),Inches(11.2),Inches(0.9),[[(title,29,TITLE,True)]])
    if time_label:
        c=box(s,Inches(11.5),Inches(0.55),Inches(1.28),Inches(0.5),fill=AREIA,round_=True)
        tf=c.text_frame; p=tf.paragraphs[0]; p.alignment=PP_ALIGN.CENTER
        r=p.add_run(); r.text=time_label; r.font.size=Pt(13); r.font.bold=True; r.font.color.rgb=PETROLEO; r.font.name=FONT
def new_slide():
    s=prs.slides.add_slide(prs.slide_layouts[6])
    bg=s.shapes.add_shape(MSO_SHAPE.RECTANGLE,0,0,SW,SH)
    bg.fill.solid(); bg.fill.fore_color.rgb=PAGE; bg.line.fill.background(); bg.shadow.inherit=False
    s.shapes._spTree.remove(bg._element); s.shapes._spTree.insert(2,bg._element); return s
def move_after(needle):
    """Reposiciona o ULTIMO slide adicionado para logo apos o slide cujo texto contem needle."""
    lst=prs.slides._sldIdLst; slides=list(prs.slides); tgt=None
    for i,sl in enumerate(slides):
        t=" ".join(sh.text_frame.text for sh in sl.shapes if sh.has_text_frame)
        if needle in t and i!=len(slides)-1: tgt=i; break
    newid=list(lst)[-1]; lst.remove(newid); lst.insert((tgt+1) if tgt is not None else len(list(lst)), newid)
def tokchip(s,x,y,label):
    w=0.14+0.108*len(label); c=box(s,Inches(x),Inches(y),Inches(w),Inches(0.32),fill=BEGE,round_=True)
    tf=c.text_frame; tf.word_wrap=False; tf.margin_top=Pt(1); tf.margin_bottom=Pt(1); tf.margin_left=Pt(6); tf.margin_right=Pt(6)
    p=tf.paragraphs[0]; p.alignment=PP_ALIGN.CENTER; r=p.add_run(); r.text=label
    r.font.size=Pt(10); r.font.bold=True; r.font.color.rgb=VERDE; r.font.name=FONT
    return x+w

# ============ 1) RENOMEAR Mooca -> Carioca (corpo + notas) ============
REPL=[("MOOCA PLAZA SHOPPING","CARIOCA SHOPPING"),("MOOCA PLAZA","CARIOCA SHOPPING"),
      ("Mooca Plaza","Carioca Shopping"),("TIME MOOCA","TIME CARIOCA"),
      ("Time Mooca","Time Carioca"),("MOOCA","CARIOCA"),("Mooca","Carioca")]
def apply_repl(t):
    for a,b in REPL: t=t.replace(a,b)
    return t
for sl in prs.slides:
    for sh in sl.shapes:
        if sh.has_text_frame:
            for p in sh.text_frame.paragraphs:
                for r in p.runs:
                    if any(a in r.text for a,_ in REPL): r.text=apply_repl(r.text)
    if sl.has_notes_slide:
        tf=sl.notes_slide.notes_text_frame
        if any(a in tf.text for a,_ in REPL): tf.text=apply_repl(tf.text)

# ============ 2) NOVO SLIDE: Chat x Cowork x Code + espaco p/ app ============
s=new_slide()
header(s,"ATO 2 · FERRAMENTAS","Claude Chat, Cowork e Code: quando usar cada um","1 min")

rows=[
 ("CLAUDE CHAT", TEAL, "a conversa no navegador/app",
  "Pergunta e resposta na hora — escrever, resumir, organizar, tirar dúvida.",
  "resumir um relatório, redigir um e-mail ao lojista, analisar uma planilha colada."),
 ("CLAUDE COWORK", PETROLEO, "o espaço onde o Claude vira agente",
  "Ganha contexto, arquivos e skills; executa em etapas e salva os entregáveis.",
  "o agente que roda uma rotina semanal e devolve a planilha e o resumo prontos."),
 ("CLAUDE CODE", AMBAR, "o Claude no ambiente técnico",
  "Cria e altera software — automações, integrações e sistemas (trabalho de TI).",
  "construir o app/painel Shopping Inteligente e conectá-lo às fontes de dados."),
]
LX, LW = 0.8, 7.0
y=1.98; RH=1.42; GAP=0.17
for name,acc,oque,melhor,exemplo in rows:
    box(s,Inches(LX),Inches(y),Inches(LW),Inches(RH),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    box(s,Inches(LX),Inches(y),Inches(0.12),Inches(RH),fill=acc)
    text(s,Inches(LX+0.28),Inches(y+0.12),Inches(LW-0.5),Inches(0.4),
         [[(name,15,TITLE,True),("   "+oque,12,SUB,False)]])
    text(s,Inches(LX+0.28),Inches(y+0.55),Inches(LW-0.5),Inches(0.4),
         [[("Melhor para:  ",11.5,VERDE,True),(melhor,11.5,INK,False)]],line_spacing=1.0)
    text(s,Inches(LX+0.28),Inches(y+0.95),Inches(LW-0.5),Inches(0.4),
         [[("No shopping:  ",11.5,PETROLEO,True),(exemplo,11.5,INK,False)]],line_spacing=1.0)
    y+=RH+GAP

# --- placeholder p/ exemplo do app (direita) ---
PX, PY, PW, PH = 8.1, 1.98, 4.43, 4.29
ph=box(s,Inches(PX),Inches(PY),Inches(PW),Inches(PH),fill=AREIA,line=PETROLEO,line_w=1.5,round_=True)
_ln=ph.line._get_or_add_ln(); _ln.append(_ln.makeelement(qn('a:prstDash'),{'val':'dash'}))
box(s,Inches(PX),Inches(PY),Inches(PW),Inches(0.44),fill=PETROLEO)
text(s,Inches(PX+0.2),Inches(PY+0.06),Inches(PW-0.4),Inches(0.34),
     [[("EXEMPLO — APP SHOPPING INTELIGENTE",11.5,AREIA,True)]],anchor=MSO_ANCHOR.MIDDLE)
text(s,Inches(PX+0.3),Inches(PY+PH/2-0.35),Inches(PW-0.6),Inches(0.8),
     [[("↳  Cole aqui um print do app",13.5,PETROLEO,True)],
      [("(a suíte de agentes do Shopping Inteligente)",11,SUB,False)]],
     align=PP_ALIGN.CENTER,anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.1)

# --- faixa de sintese (rodape) ---
box(s,Inches(0.8),Inches(6.62),Inches(11.73),Inches(0.55),fill=PETROLEO,round_=True)
text(s,Inches(1.0),Inches(6.64),Inches(11.4),Inches(0.5),
     [[("Comece pelo ",12.5,AREIA,True),("Chat",12.5,AMBAR,True),
       (". Virou rotina com entregáveis? Leve para o ",12.5,AREIA,True),
       ("Cowork",12.5,AMBAR,True),
       (".  O ",12.5,AREIA,True),("Code",12.5,AMBAR,True),
       (" é quando a solução vira sistema.",12.5,AREIA,True)]],
     anchor=MSO_ANCHOR.MIDDLE)
s.notes_slide.notes_text_frame.text=(
 "~1 min. Tres formas de usar o Claude: CHAT (conversa rapida, do dia a dia), COWORK "
 "(o Claude vira um agente com contexto/skills e entrega arquivos — foi onde o Shopping "
 "Inteligente foi construido), CODE (ambiente tecnico, para TI). Mensagem: comece no Chat; "
 "quando a tarefa vira rotina com entregaveis, leve para o Cowork. Cole aqui o print do app "
 "Shopping Inteligente para mostrar um exemplo real de Cowork.")

# mover o slide FERRAMENTAS para logo apos o C.R.I.A.R.
move_after("Anatomia de um bom pedido")

# ============ 3) NOVO SLIDE: o que é um LLM (didático p/ leigos) ============
s=new_slide()
header(s,"ATO 2 · FUNDAMENTO","O que é um LLM — e como Claude e ChatGPT funcionam","2 min")
CY, CH2 = 1.92, 2.98
cards=[
 ("O QUE É UM LLM", TEAL,
  ["LLM = Grande Modelo de Linguagem (do inglês Large Language Model).",
   "No fundo, é um programa que aprende a prever a próxima palavra de um texto.",
   "De tanto prever, aprende a escrever, resumir e raciocinar."], None),
 ("COMO FOI DESENVOLVIDO", PETROLEO,
  ["Foi treinado lendo uma imensidão de textos públicos — livros, sites, artigos.",
   "Sozinho, ajusta bilhões de “parâmetros” até prever cada vez melhor.",
   "Depois, pessoas o refinam para ser útil, honesto e seguro."], None),
 ("O QUE É UM TOKEN", AMBAR,
  ["Ele não lê letra nem palavra inteira: quebra o texto em pedaços — os tokens (≈ ¾ de palavra).",
   "Lê e escreve um token por vez."], ["Shop","ping"," Inteli","gente"]),
]
CW=3.71; GAP=0.30; cx=0.8
for title,acc,body,chips in cards:
    box(s,Inches(cx),Inches(CY),Inches(CW),Inches(CH2),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    box(s,Inches(cx),Inches(CY),Inches(CW),Inches(0.1),fill=acc)
    text(s,Inches(cx+0.2),Inches(CY+0.2),Inches(CW-0.4),Inches(0.35),[[(title,13.5,TITLE,True)]])
    text(s,Inches(cx+0.2),Inches(CY+0.62),Inches(CW-0.4),Inches(CH2-0.8),
         [[(ln,11.5,INK,False)] for ln in body],space_after=6,line_spacing=1.08)
    if chips:
        text(s,Inches(cx+0.2),Inches(CY+2.05),Inches(CW-0.4),Inches(0.28),
             [[("“Shopping Inteligente” vira 4 tokens:",10.5,SUB,True)]])
        px=cx+0.2
        for ch in chips: px=tokchip(s,px+0.06,CY+2.42,ch)
    cx+=CW+GAP
# faixa: como Claude e ChatGPT funcionam
BY=5.18; BH=1.7
box(s,Inches(0.8),Inches(BY),Inches(11.73),Inches(BH),fill=DARK,line=PETROLEO,line_w=1.2,round_=True)
box(s,Inches(0.8),Inches(BY),Inches(11.73),Inches(0.1),fill=AMBAR)
text(s,Inches(1.05),Inches(BY+0.16),Inches(11.2),Inches(0.35),
     [[("COMO CLAUDE E CHATGPT FUNCIONAM",12.5,AMBAR,True)]])
text(s,Inches(1.05),Inches(BY+0.55),Inches(11.2),Inches(0.4),
     [[("Seu pedido",14,AMBAR,True),
       ("  →  o modelo prevê o próximo token, um a um  →  ",14,ONDARK,False),
       ("a resposta se forma",14,AMBAR,True)]])
text(s,Inches(1.05),Inches(BY+1.02),Inches(11.2),Inches(0.55),
     [[("É probabilístico: cria muito bem, mas pode errar (“alucinar”) — por isso, confira sempre.  ",11.5,ONDARK,False),
       ("Claude (Anthropic) e ChatGPT (OpenAI) são marcas da mesma tecnologia.",11.5,BEGE,True)]],line_spacing=1.03)
s.notes_slide.notes_text_frame.text=(
 "~2 min. Explique sem jargao: LLM = Grande Modelo de Linguagem, um programa que aprende a "
 "prever a proxima palavra. Foi treinado lendo muito texto publico e ajustando bilhoes de "
 "parametros; depois refinado por pessoas. TOKEN = o pedaco em que o modelo quebra o texto "
 "(~3/4 de palavra); ele le e escreve um token por vez. Claude e ChatGPT sao a mesma "
 "tecnologia (LLM), de empresas diferentes; sao probabilisticos — por isso conferir sempre.")
move_after("O que é IA e Machine Learning")

out=base+"Shopping_Inteligente_IA_Carioca_Shopping.pptx"
prs.save(out)
p2=Presentation(out); SS=list(p2.slides)
print("slides:",len(SS))
T=" ".join(sh.text_frame.text for sl in SS for sh in sl.shapes if sh.has_text_frame)
NT=" ".join(sl.notes_slide.notes_text_frame.text for sl in SS if sl.has_notes_slide)
print("resta 'Mooca' (corpo):","Mooca" in T,"| (notas):","Mooca" in NT)
print("tem 'CARIOCA SHOPPING':","CARIOCA SHOPPING" in T,"| 'COWORK':","COWORK" in T)
# confirma ordem
for i in [13,14,15]:
    for sh in SS[i].shapes:
        if sh.has_text_frame and sh.text_frame.text.strip():
            print(f"  [{i+1}] {sh.text_frame.text.strip().splitlines()[0][:50]}"); break
