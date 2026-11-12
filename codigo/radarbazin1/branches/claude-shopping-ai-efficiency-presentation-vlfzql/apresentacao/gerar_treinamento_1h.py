# -*- coding: utf-8 -*-
"""
TREINAMENTO Shopping Inteligente — ~1 hora (versão enxuta do workshop de 4 h).
Base: Shopping_Inteligente_IA_Carioca_Shopping.pptx (reaproveita conceitos, vídeo,
tese, impacto e fecho). Estrutura:
- Capa (parametrizada por shopping + data) + agenda (~1 h, 2 blocos).
- Bloco 1: IA na prática (conceitos, chat->agentes, chat/cowork/code, modelos,
  conectores/skills, harness/loop, salvaguardas).
- Bloco 2: O Shopping Inteligente (vídeo, tese, impacto, case real do iFood e
  como cada app nasceu — Radar de Varejo, Radar de Mídia, Otimizador de Obras,
  Apurador Fiscal).
- Fecho: o fator humano no centro.
Sem "melhores práticas dos 10 shoppings", sem a arquitetura/camadas de agentes e
sem "mão na massa". Gera 3 arquivos (Estação BH, Boulevard BH, DelRey).
"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.ns import qn
from PIL import Image as _PILImage

PETROLEO=RGBColor(0x00,0x61,0x6F); VERDE=RGBColor(0x0D,0x45,0x4A); TEAL=RGBColor(0x36,0x8C,0x82)
CORAL=RGBColor(0xCD,0x51,0x51); MENTA=RGBColor(0x6C,0xC6,0x80); AMBAR=RGBColor(0xED,0xA7,0x54)
BEGE=RGBColor(0xCC,0xC5,0xBC); AREIA=RGBColor(0xE5,0xDE,0xD4); WHITE=RGBColor(0xFF,0xFF,0xFF)
PAGE=WHITE; DARK=VERDE; INK=VERDE; TITLE=PETROLEO; SUB=TEAL; CARD=AREIA; CLINE=BEGE; ONDARK=AREIA
# Fonte oficial Allos (design system): Gantari, com Calibri como fallback.
FONT="Gantari"

base="/home/user/radarbazin1/apresentacao/"
LOGO_PRI=base+"allos_logo_primary.png"   # logo para fundos claros
LOGO_NEG=base+"allos_logo_negative.png"  # logo para fundos escuros/marca
LOGO_ASPECT=2919/837
prs=Presentation(base+"Shopping_Inteligente_IA_Carioca_Shopping.pptx")
SW,SH=prs.slide_width,prs.slide_height

def _is_dark_bg(s):
    for sh in s.shapes:
        try:
            if sh.width>=SW*0.9 and sh.height>=SH*0.9:
                hx=str(sh.fill.fore_color.rgb)
                r,g,b=int(hx[0:2],16),int(hx[2:4],16),int(hx[4:6],16)
                return (0.299*r+0.587*g+0.114*b)<120
        except Exception:
            continue
    return False
def stamp_logo(s,h=0.34,margin_r=0.6,margin_b=0.5,negative=None,left=None,top=None):
    if negative is None: negative=_is_dark_bg(s)
    w=h*LOGO_ASPECT
    l=left if left is not None else SW-Inches(w)-Inches(margin_r)
    t=top  if top  is not None else SH-Inches(h)-Inches(margin_b)
    s.shapes.add_picture(LOGO_NEG if negative else LOGO_PRI,l,t,height=Inches(h))

# ---------- helpers ----------
def box(s,l,t,w,h,fill=None,line=None,line_w=1.0,round_=False,rad=0.16):
    """rad = raio dos cantos em polegadas (0.16in ≈ 16px, o radius-l do design system Allos)."""
    shp=s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE if round_ else MSO_SHAPE.RECTANGLE,l,t,w,h)
    if round_:
        try: shp.adjustments[0]=max(0.0,min(0.5,rad/(min(int(w),int(h))/914400.0)))
        except Exception: pass
    if fill is None: shp.fill.background()
    else: shp.fill.solid(); shp.fill.fore_color.rgb=fill
    if line is None: shp.line.fill.background()
    else: shp.line.color.rgb=line; shp.line.width=Pt(line_w)
    shp.shadow.inherit=False; return shp
def accent(s,x,y,w,acc,inset=0.16):
    """Faixa de acento no topo de um card: pílula alinhada à parte reta da borda (não invade os cantos)."""
    box(s,Inches(x+inset),Inches(y),Inches(w-2*inset),Inches(0.09),fill=acc,round_=True)
def text(s,l,t,w,h,runs,align=PP_ALIGN.LEFT,anchor=MSO_ANCHOR.TOP,space_after=5,line_spacing=1.0):
    tb=s.shapes.add_textbox(l,t,w,h); tf=tb.text_frame; tf.word_wrap=True; tf.vertical_anchor=anchor
    for i,para in enumerate(runs):
        p=tf.paragraphs[0] if i==0 else tf.add_paragraph()
        p.alignment=align; p.space_after=Pt(space_after); p.space_before=Pt(0); p.line_spacing=line_spacing
        for spec in para:
            tx,sz,co,bo=spec[0],spec[1],spec[2],spec[3]
            r=p.add_run(); r.text=tx; r.font.size=Pt(sz); r.font.color.rgb=co; r.font.bold=bo; r.font.name=FONT
            if len(spec)>4 and spec[4]: r.font.underline=True
    return tb
def header(s,kicker,title,time_label=None):
    box(s,Inches(0.55),Inches(0.55),Inches(0.12),Inches(0.95),fill=PETROLEO)
    text(s,Inches(0.8),Inches(0.5),Inches(9.8),Inches(0.4),[[(kicker.upper(),13,TEAL,True)]])
    text(s,Inches(0.8),Inches(0.85),Inches(11.2),Inches(0.9),[[(title,27,TITLE,True)]])
    if time_label:
        c=box(s,Inches(11.35),Inches(0.55),Inches(1.45),Inches(0.5),fill=AREIA,round_=True)
        p=c.text_frame.paragraphs[0]; p.alignment=PP_ALIGN.CENTER
        r=p.add_run(); r.text=time_label; r.font.size=Pt(12.5); r.font.bold=True; r.font.color.rgb=PETROLEO; r.font.name=FONT
def new_slide(dark=False):
    s=prs.slides.add_slide(prs.slide_layouts[6])
    bg=s.shapes.add_shape(MSO_SHAPE.RECTANGLE,0,0,SW,SH)
    bg.fill.solid(); bg.fill.fore_color.rgb=(DARK if dark else PAGE); bg.line.fill.background(); bg.shadow.inherit=False
    s.shapes._spTree.remove(bg._element); s.shapes._spTree.insert(2,bg._element); return s
def card(s,x,y,w,h,acc,title,role,body,tsz=17):
    box(s,Inches(x),Inches(y),Inches(w),Inches(h),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    accent(s,x,y,w,acc)
    text(s,Inches(x+0.22),Inches(y+0.2),Inches(w-0.44),Inches(0.5),[[(title,tsz,TITLE,True)]])
    if role: text(s,Inches(x+0.22),Inches(y+0.2+0.44),Inches(w-0.44),Inches(0.54),[[(role,12,TEAL,True)]])
    text(s,Inches(x+0.22),Inches(y+(1.18 if role else 0.7)),Inches(w-0.44),Inches(h-1.32),[[(body,12.5,INK,False)]],line_spacing=1.08)
def band(s,y,h,label,runs):
    box(s,Inches(0.8),Inches(y),Inches(11.73),Inches(h),fill=DARK,line=PETROLEO,line_w=1.2,round_=True)
    accent(s,0.8,y,11.73,AMBAR)
    if label: text(s,Inches(1.05),Inches(y+0.14),Inches(11.2),Inches(0.35),[[(label,12.5,AMBAR,True)]])
    _top=0.5 if label else 0.16
    # altura interna SEMPRE positiva: cx/cy <= 0 corrompe o arquivo no PowerPoint
    text(s,Inches(1.05),Inches(y+_top),Inches(11.2),Inches(max(0.22,h-_top-0.05)),runs,line_spacing=1.05)
def divider(kicker,title,subtitle):
    s=new_slide(dark=True)
    box(s,0,0,SW,Inches(0.18),fill=AMBAR); box(s,0,SH-Inches(0.18),SW,Inches(0.18),fill=PETROLEO)
    ch=box(s,Inches(0.9),Inches(2.3),Inches(0.26+0.115*len(kicker)),Inches(0.5),fill=PETROLEO,round_=True)
    cf=ch.text_frame; cf.margin_left=Pt(14); cf.margin_right=Pt(14); cf.vertical_anchor=MSO_ANCHOR.MIDDLE
    cp=cf.paragraphs[0]; cr=cp.add_run(); cr.text=kicker.upper(); cr.font.size=Pt(12); cr.font.bold=True; cr.font.color.rgb=AREIA; cr.font.name=FONT
    text(s,Inches(0.85),Inches(2.9),Inches(11.6),Inches(1.6),[[(title,46,WHITE,True)]],line_spacing=1.0)
    if subtitle:
        text(s,Inches(0.9),Inches(4.65),Inches(11.2),Inches(1.2),[[(subtitle,16,AREIA,False)]],line_spacing=1.15)
    stamp_logo(s,h=0.34,negative=True,margin_r=0.6,margin_b=0.5)
    return s
def find(sub):
    for i,sl in enumerate(prs.slides):
        for sh in sl.shapes:
            if sh.has_text_frame and sub in sh.text_frame.text: return i
    return None
def _find_video():
    for i,sl in enumerate(prs.slides):
        for sh in sl.shapes:
            if sh.has_text_frame and sh.text_frame.text.strip()=="▶": return i

REUSE={k:find(v) for k,v in {
 "iaml":"O que é IA e Machine","llm":"O que é um LLM","pensa":"Como a IA pensa",
 "ferr":"Claude Chat, Cowork e Code","salv":"Salvaguardas",
 "tese":"A tese e a missão","impacto":"produtividade move","enc":"A IA não vai substituir"}.items()}
REUSE["video"]=_find_video()
assert None not in REUSE.values(), REUSE

# ===================== CAPA (parametrizada) =====================
s=new_slide(dark=True)
box(s,0,0,SW,Inches(0.18),fill=TEAL); box(s,0,SH-Inches(0.18),SW,Inches(0.18),fill=AMBAR)
ch=box(s,Inches(0.9),Inches(1.4),Inches(3.7),Inches(0.44),fill=PETROLEO,round_=True)
cf=ch.text_frame; cf.margin_left=Pt(14); cf.vertical_anchor=MSO_ANCHOR.MIDDLE
cp=cf.paragraphs[0]; cr=cp.add_run(); cr.text="TREINAMENTO · ≈ 1 HORA"; cr.font.size=Pt(13); cr.font.bold=True; cr.font.color.rgb=AREIA; cr.font.name=FONT
stamp_logo(s,h=0.52,negative=True,left=SW-Inches(0.52*LOGO_ASPECT)-Inches(0.9),top=Inches(1.38))
text(s,Inches(0.85),Inches(2.25),Inches(11.7),Inches(1.6),
     [[("Shopping Inteligente",52,WHITE,True)],[("IA na prática — Marketing, Operações e Negócios",20,AREIA,False)]],space_after=8,line_spacing=1.02)
capa_meta=text(s,Inches(0.9),Inches(4.8),Inches(11.6),Inches(0.6),[[("Time —   ·   00/00/00",19,AMBAR,True)]])
capa_meta_run=capa_meta.text_frame.paragraphs[0].runs[0]
text(s,Inches(0.9),Inches(6.5),Inches(11.6),Inches(0.6),
     [[("Os conceitos de IA na prática, o Shopping Inteligente e as ferramentas criadas no Claude Code — em cerca de uma hora.",13,ONDARK,False)]],line_spacing=1.1)
capa=s

# ===================== AGENDA (~1 h) =====================
s=new_slide()
box(s,Inches(0.55),Inches(0.55),Inches(0.12),Inches(0.95),fill=PETROLEO)
text(s,Inches(0.8),Inches(0.5),Inches(9.8),Inches(0.4),[[("ROTEIRO",13,TEAL,True)]])
text(s,Inches(0.8),Inches(0.85),Inches(11.0),Inches(0.9),[[("Cerca de 1h17, em 2 blocos + case",27,TITLE,True)]])
c=box(s,Inches(11.35),Inches(0.55),Inches(1.45),Inches(0.5),fill=AREIA,round_=True)
cp=c.text_frame.paragraphs[0]; cp.alignment=PP_ALIGN.CENTER
cr=cp.add_run(); cr.text="≈ 1h17"; cr.font.size=Pt(13); cr.font.bold=True; cr.font.color.rgb=PETROLEO; cr.font.name=FONT
rows=[("1",  "IA na prática: os conceitos","o que é, chat/cowork/code, modelos, conectores, harness & loop na prática, uso seguro","29 min",PETROLEO),
      ("2",  "O Shopping Inteligente","o vídeo, a tese, o impacto, como os apps nasceram e o vídeo de cada app funcionando","37 min",TEAL),
      ("",   "História real · Claude na prática","o case do iFood em vídeo (8:40)","9 min",CORAL),
      ("",   "Encerramento","o fator humano no centro","2 min",AMBAR)]
y=2.35; RH=0.86; GAP=0.16
for num,name,desc,tempo,acc in rows:
    box(s,Inches(0.8),Inches(y),Inches(11.73),Inches(RH),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    box(s,Inches(0.8),Inches(y+0.16),Inches(0.1),Inches(RH-0.32),fill=acc,round_=True)
    if num:
        nb=box(s,Inches(1.0),Inches(y+0.2),Inches(0.46),Inches(0.46),fill=acc,round_=True)
        nf=nb.text_frame; nf.word_wrap=False; nf.vertical_anchor=MSO_ANCHOR.MIDDLE
        np=nf.paragraphs[0]; np.alignment=PP_ALIGN.CENTER
        nr=np.add_run(); nr.text=num; nr.font.size=Pt(16); nr.font.bold=True; nr.font.color.rgb=WHITE; nr.font.name=FONT
    text(s,Inches(1.65),Inches(y+0.14),Inches(7.9),Inches(0.4),[[(name,15.5,TITLE,True)]])
    text(s,Inches(1.65),Inches(y+0.52),Inches(8.4),Inches(0.3),[[(desc,11.5,SUB,False)]])
    text(s,Inches(10.2),Inches(y),Inches(2.3),Inches(RH),[[(tempo,14.5,VERDE,True)]],align=PP_ALIGN.RIGHT,anchor=MSO_ANCHOR.MIDDLE)
    y+=RH+GAP
box(s,Inches(0.8),Inches(y+0.05),Inches(11.73),Inches(0.55),fill=PETROLEO,round_=True)
text(s,Inches(1.05),Inches(y+0.08),Inches(11.2),Inches(0.5),
     [[("Total ≈ 1h17 (77 min) ",13,AMBAR,True),("— IA na prática, do conceito à ferramenta que resolve.",13,WHITE,True)]],anchor=MSO_ANCHOR.MIDDLE)
s.notes_slide.notes_text_frame.text="Agenda (1 min). 2 blocos + case, ~1h17: os conceitos de IA na pratica, o Shopping Inteligente com os apps (e o video de cada um) e, no fim, o case do iFood."
agenda=s

# ===================== BLOCO 1: IA na prática =====================
d2=divider("Bloco 1","IA na prática","Os conceitos que sustentam tudo: do chat aos agentes, modelos, conectores, harness & loop e uso seguro.")

# ---- Do chat aos agentes ----
s=new_slide()
header(s,"Conceitos · Do chat aos agentes","Do chat que responde ao agente que resolve","2 min")
card(s,0.8,1.95,5.75,2.55,TEAL,"CHAT","pergunta e resposta","Você conduz cada passo: pergunta, lê e pede o próximo. Ótimo para tirar dúvidas e rascunhar na hora.")
card(s,6.78,1.95,5.75,2.55,PETROLEO,"AGENTE","objetivo e resultado","Você dá a meta e ele executa o processo inteiro — reúne o contexto, age e verifica, com a sua revisão no fim.")
band(s,4.85,1.7,None,
     [[("A virada de chave: delegue o objetivo, não cada etapa.  ",13.5,AREIA,True)],
      [("Não é “me ajude a fazer” — é “faça isso por mim”, com a sua revisão no fim. O “como” (loop) vem em Harness e Loop.",12,BEGE,False)]])
s.notes_slide.notes_text_frame.text="~2 min. Chat = voce conduz; agente = recebe um objetivo e entrega a tarefa inteira, com revisao humana."
chat_ag=s

# ---- Ferramentas: Chat x Cowork x Code (3 colunas, ocupando o slide inteiro) ----
s=new_slide()
header(s,"Prática · Ferramentas","Claude Chat, Cowork e Code: quando usar cada um","3 min")
cols=[("CLAUDE CHAT", TEAL, "a conversa no navegador/app",
       "Pergunta e resposta na hora — escrever, resumir, organizar, tirar dúvida.",
       "resumir um relatório, redigir um e-mail ao lojista, analisar uma planilha colada."),
      ("CLAUDE COWORK", PETROLEO, "o espaço onde o Claude vira agente",
       "Ganha contexto, arquivos e skills; executa em etapas e salva os entregáveis.",
       "o agente que roda uma rotina semanal e devolve a planilha e o resumo prontos."),
      ("CLAUDE CODE", AMBAR, "o Claude no ambiente técnico",
       "Cria e altera software — automações, integrações e sistemas.",
       "construir os apps Shopping Inteligente (Radar de Varejo, de Mídia, Obras, Fiscal) e ligá-los aos dados.")]
CW,CH,CY=3.71,4.3,1.95
for i,(name,acc,oque,melhor,exemplo) in enumerate(cols):
    x=0.8+i*(CW+0.3)
    box(s,Inches(x),Inches(CY),Inches(CW),Inches(CH),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    accent(s,x,CY,CW,acc)
    text(s,Inches(x+0.25),Inches(CY+0.25),Inches(CW-0.5),Inches(0.45),[[(name,17,TITLE,True)]])
    text(s,Inches(x+0.25),Inches(CY+0.7),Inches(CW-0.5),Inches(0.4),[[(oque,12,TEAL,True)]])
    text(s,Inches(x+0.25),Inches(CY+1.25),Inches(CW-0.5),Inches(1.3),
         [[("MELHOR PARA",10.5,VERDE,True)],[(melhor,12.5,INK,False)]],space_after=3,line_spacing=1.1)
    text(s,Inches(x+0.25),Inches(CY+2.65),Inches(CW-0.5),Inches(1.5),
         [[("NO SHOPPING",10.5,PETROLEO,True)],[(exemplo,12.5,INK,False)]],space_after=3,line_spacing=1.1)
box(s,Inches(0.8),Inches(6.5),Inches(11.73),Inches(0.6),fill=PETROLEO,round_=True)
text(s,Inches(1.0),Inches(6.52),Inches(11.4),Inches(0.55),
     [[("Comece pelo ",12.5,AREIA,True),("Chat",12.5,AMBAR,True),
       (". Virou rotina com entregáveis? Leve para o ",12.5,AREIA,True),("Cowork",12.5,AMBAR,True),
       (".  O ",12.5,AREIA,True),("Code",12.5,AMBAR,True),(" é quando a solução vira sistema.",12.5,AREIA,True)]],
     anchor=MSO_ANCHOR.MIDDLE)
s.notes_slide.notes_text_frame.text=("~3 min. Tres formas de usar o Claude: CHAT (conversa rapida, do dia a dia), COWORK (o Claude vira "
 "agente com contexto/skills e entrega arquivos), CODE (ambiente tecnico — foi onde os apps do Shopping Inteligente "
 "nasceram). Mensagem: comece no Chat; virou rotina com entregaveis, va para o Cowork; virou sistema, e Code.")
ferr=s

# ---- Modelos (4 cérebros, incluindo o Fable) ----
s=new_slide()
header(s,"Conceitos · Modelos","Um “cérebro” para cada tipo de tarefa","1,5 min")
MW=(11.73-3*0.25)/4
mods=[(TEAL,"HAIKU","velocidade e economia","Tarefas simples e em grande volume — respostas rápidas e baratas."),
      (PETROLEO,"SONNET","equilíbrio para o dia a dia","O trabalho do cotidiano: analisar, escrever, organizar com boa qualidade."),
      (AMBAR,"OPUS","raciocínio para o complexo","Análise densa e decisão difícil — quando vale pensar mais fundo."),
      (CORAL,"FABLE","o mais capaz da família","O topo da linha: as tarefas mais exigentes e os agentes que rodam sozinhos por mais tempo.")]
for i,(acc,name,role,body) in enumerate(mods):
    card(s,0.8+i*(MW+0.25),2.05,MW,2.85,acc,name,role,body,tsz=16)
band(s,5.2,0.9,None,
     [[("Você escolhe conforme a tarefa — do mais rápido e barato ao mais “pensante”.  ",13,AREIA,True)],
      [("Claude e ChatGPT têm famílias assim; o nome muda, a lógica é a mesma.",12,BEGE,False)]])
# destaque: a estratégia de modelo quando o trabalho passa a rodar em loop
box(s,Inches(0.8),Inches(6.30),Inches(11.73),Inches(1.0),fill=AMBAR,round_=True)
text(s,Inches(1.05),Inches(6.42),Inches(11.2),Inches(0.3),[[("DICA · QUANDO O TRABALHO RODA EM LOOP",11,VERDE,True)]])
text(s,Inches(1.05),Inches(6.70),Inches(11.2),Inches(0.58),
     [[("Desenvolva no modelo mais avançado",12.5,VERDE,True),
       (" — é ele que acerta o método. Depois deixe o loop ",12.5,VERDE,False),
       ("rodando e atualizando num modelo mais simples",12.5,VERDE,True),
       (": bem mais rápido e barato.",12.5,VERDE,False)]],
     line_spacing=1.08)
s.notes_slide.notes_text_frame.text=("~1,5 min. Quatro 'cerebros' para tipos de tarefa diferentes: Haiku (volume e velocidade), Sonnet "
 "(o dia a dia), Opus (raciocinio denso) e Fable (o mais capaz, para o que e mais exigente e para agentes que rodam "
 "sozinhos por mais tempo). O destaque: quando o trabalho passa a rodar em LOOP, construa no modelo mais avancado — e "
 "ele que acerta o metodo e o criterio — e depois deixe a rotina rodando e atualizando num modelo mais simples. "
 "A qualidade ja esta no metodo; o modelo simples so executa, por bem menos tempo e custo.")
modelos=s

# ---- Conectores e Skills ----
s=new_slide()
header(s,"Conceitos · Conectores e Skills","Como a IA entra no seu fluxo de trabalho","2 min")
card(s,0.8,2.05,5.75,2.85,PETROLEO,"CONECTORES","as pontes com os seus apps","Ligam a IA aos aplicativos onde o trabalho já acontece — e-mail, agenda, planilhas, drive. Ela lê e age no seu contexto real.")
card(s,6.78,2.05,5.75,2.85,AMBAR,"SKILLS","ensinam o seu método","Instruções reutilizáveis que ensinam o SEU jeito: quando usar, quais etapas seguir, como avaliar e em que formato entregar.")
band(s,5.1,1.35,None,
     [[("É o que transforma uma IA genérica em uma parceira que trabalha do jeito da sua operação.  ",13,AREIA,True)],
      [("Conector = onde ela atua.   Skill = como ela faz.",12,BEGE,False)]])
conect=s

# ---- Harness e Loop ----
s=new_slide()
header(s,"Conceitos · Harness e Loop","Harness + loop: quando o trabalho passa a rodar sozinho","2 min")
card(s,0.8,1.95,5.75,3.05,PETROLEO,"HARNESS","a estrutura do agente","A montagem em volta do modelo: contexto, skills, ferramentas e conectores. É o que transforma a IA em um agente que age no seu trabalho.")
# card LOOP montado à mão: ciclo + as 3 peças de todo loop
box(s,Inches(6.78),Inches(1.95),Inches(5.75),Inches(3.05),fill=CARD,line=CLINE,line_w=1.0,round_=True)
accent(s,6.78,1.95,5.75,TEAL)
text(s,Inches(7.0),Inches(2.15),Inches(5.31),Inches(0.5),[[("LOOP",17,TITLE,True)]])
text(s,Inches(7.0),Inches(2.59),Inches(5.31),Inches(0.4),[[("o ciclo que executa",12,TEAL,True)]])
text(s,Inches(7.0),Inches(3.0),Inches(5.31),Inches(1.95),
     [[("Objetivo → reúne o contexto → age → verifica → repete até concluir.  ",12,INK,False),("Loop se conduz sozinho.",12,INK,True)],
      [("Todo loop tem 3 peças:",11.5,PETROLEO,True)],
      [("Objetivo",11.5,INK,True),(" — o que conta como pronto",11.5,INK,False)],
      [("Métrica",11.5,INK,True),(" — como a IA sabe se melhorou",11.5,INK,False)],
      [("Fronteira",11.5,INK,True),(" — até onde ela pode ir sem te consultar",11.5,INK,False)]],
     space_after=3,line_spacing=1.08)
band(s,5.2,1.95,"AUTOMAÇÃO — QUANDO AS DUAS PEÇAS SE JUNTAM",
     [[("Um gatilho (horário ou evento)  →  o harness roda o loop  →  entrega pronta para você aprovar",13.5,AREIA,True)],
      [("Ex.: toda segunda, o agente puxa os dados, monta o relatório e deixa para revisão — a tarefa passa a rodar sozinha, com a decisão humana no fim.",12,BEGE,False)]])
harness=s

# ---- Harness e Loop NA PRÁTICA: o Apurador Fiscal, do prompt ao ar (com telas) ----
def screen_frame(s,img,cx,y,h,label):
    """Tela real (img) ou moldura tracejada para colar a tela depois."""
    if img:
        iw,ih=_PILImage.open(base+img).size; w=h*iw/ih; x=cx-w/2
        box(s,Inches(x-0.05),Inches(y-0.05),Inches(w+0.10),Inches(h+0.10),fill=VERDE,round_=True,rad=0.06)
        s.shapes.add_picture(base+img,Inches(x),Inches(y),Inches(w),Inches(h))
    else:
        w=1.5; x=cx-w/2
        ph=box(s,Inches(x),Inches(y),Inches(w),Inches(h),fill=AREIA,line=PETROLEO,line_w=1.5,round_=True)
        _ln=ph.line._get_or_add_ln(); _ln.append(_ln.makeelement(qn('a:prstDash'),{'val':'dash'}))
        text(s,Inches(x+0.08),Inches(y+h/2-0.55),Inches(w-0.16),Inches(1.1),
             [[("↳ cole a tela",11,PETROLEO,True)],[(label,9.5,SUB,False)]],
             align=PP_ALIGN.CENTER,anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.1)
s=new_slide()
header(s,"Harness e Loop · na prática","Do prompt ao ar — o caso do NuTre","2 min")
steps=[("1","Projeto com contexto",
        "As instruções: papel, objetivo e referencial.",
        "ws_nt_project.png"),
       ("2","Skills e arquivos",
        "Os arquivos do método e os exames do usuário.",
        "ws_nt_files.png"),
       ("3","Comando no Claude Code",
        "Uma frase; o Claude Code lê o projeto e constrói.",
        "ws_nt_code.png"),
       ("4","Conta na Vercel",
        "O código vai ao GitHub; a Vercel publica na web.",
        "ws_nt_vercel.png"),
       ("5","O app no ar",
        "Diário, jejum, scores e pressão. Testa, ajusta, nova versão.",
        "ws_nt_app.png")]
STW=(11.73-4*0.2)/5; SY=1.72
for i,(num,title,desc,img) in enumerate(steps):
    x=0.8+i*(STW+0.2); acc=[TEAL,PETROLEO,AMBAR,CORAL,MENTA][i]
    nb=box(s,Inches(x),Inches(SY),Inches(0.36),Inches(0.36),fill=acc,round_=True)
    nf=nb.text_frame; nf.word_wrap=False; nf.vertical_anchor=MSO_ANCHOR.MIDDLE
    np_=nf.paragraphs[0]; np_.alignment=PP_ALIGN.CENTER
    nr=np_.add_run(); nr.text=num; nr.font.size=Pt(13); nr.font.bold=True; nr.font.color.rgb=WHITE; nr.font.name=FONT
    text(s,Inches(x+0.44),Inches(SY-0.05),Inches(STW-0.44),Inches(0.58),[[(title,12,TITLE,True)]],line_spacing=1.0)
    text(s,Inches(x),Inches(SY+0.55),Inches(STW),Inches(0.78),[[(desc,9.5,INK,False)]],line_spacing=1.06)
    screen_frame(s,img,x+STW/2,3.12,3.05,None)
band(s,6.28,1.15,None,
     [[("O harness é essa montagem — projeto + skills + Claude Code + Vercel. O loop roda dentro dela até o app ficar pronto.  ",12.5,AREIA,True)],
      [("Mesmo caminho dos 4 apps do shopping. Dados públicos ou fictícios no teste — e a decisão final é sempre humana.",11,BEGE,False)]])
s.notes_slide.notes_text_frame.text=("~2 min. Harness e loop em um caso real (NuTre): (1) projeto 'Fitness' com as instrucoes (contexto); "
 "(2) skills e arquivos do metodo + exames; (3) o comando no Claude Code — uma frase; (4) repositorio no GitHub + conta na Vercel "
 "para publicar; (5) o app no ar, com o loop rodando a cada ajuste. Reforcar as boas praticas: conta da empresa, dados publicos "
 "ou ficticios no teste, politicas de acesso e sigilo, decisao humana.")
harness2=s

# ---- Antes do código: a IA ajudando a decidir nome e marca (artefato real) ----
s=new_slide()
header(s,"NuTre · antes do código","A IA no processo de criação — o nome e a marca","2 min")
telas=[("1","Os nomes","8 alternativas, com o significado, as sílabas e a ressalva de cada uma.","ia_nome.png"),
       ("2","Os logos","4 conceitos, já nos tamanhos reais do ícone e nas duas cores.","ia_logo.png"),
       ("3","A escolha aplicada","O nome e o logo montados no app — antes de mexer no código.","ia_combo.png")]
CW=(11.73-2*0.22)/3; TY=1.72; IY=3.02
for i,(num,titulo,desc,img) in enumerate(telas):
    x=0.8+i*(CW+0.22); acc=[TEAL,PETROLEO,AMBAR][i]
    nb=box(s,Inches(x),Inches(TY),Inches(0.36),Inches(0.36),fill=acc,round_=True)
    nf=nb.text_frame; nf.word_wrap=False; nf.vertical_anchor=MSO_ANCHOR.MIDDLE
    np_=nf.paragraphs[0]; np_.alignment=PP_ALIGN.CENTER
    nr=np_.add_run(); nr.text=num; nr.font.size=Pt(13); nr.font.bold=True; nr.font.color.rgb=WHITE; nr.font.name=FONT
    text(s,Inches(x+0.44),Inches(TY-0.05),Inches(CW-0.44),Inches(0.5),[[(titulo,13,TITLE,True)]],line_spacing=1.0)
    text(s,Inches(x),Inches(TY+0.48),Inches(CW),Inches(0.82),[[(desc,10,INK,False)]],line_spacing=1.06)
    _iw,_ih=_PILImage.open(base+img).size; IH=CW*_ih/_iw
    box(s,Inches(x-0.05),Inches(IY-0.05),Inches(CW+0.10),Inches(IH+0.10),fill=VERDE,round_=True,rad=0.06)
    s.shapes.add_picture(base+img,Inches(x),Inches(IY),Inches(CW),Inches(IH))
band(s,5.72,1.5,None,
     [[("Pedi ao Claude um artefato para me ajudar a decidir. Em minutos: as opções, os critérios e a prévia na tela.",12.5,AREIA,True)],
      [("A IA não escolheu o nome — ela organizou a escolha. Significado, ressalva e como fica no ícone de 29 px. "
        "A decisão, como sempre, continuou sendo humana.",11,BEGE,False)]])
s.notes_slide.notes_text_frame.text=("~2 min. Este slide mostra a IA ANTES do codigo. Para batizar o app, pedi ao Claude um artefato interativo: "
 "ele trouxe 8 nomes com significado, numero de silabas, a ressalva de cada um e uma recomendacao; 4 conceitos de logo "
 "desenhados em vetor e ja aplicados no tamanho real do icone; e uma previa com o nome e o logo montados no app. "
 "Clicando num nome e num logo, a previa se atualiza. A mensagem: a IA nao decide por voce — ela estrutura a decisao "
 "e encurta o caminho ate ela. O mesmo vale para uma marca de campanha, um nome de projeto ou um conceito de evento.")
criacao=s

# ---- Salvaguardas NA PRÁTICA (1): as telas de configuração da conta ----
s=new_slide()
header(s,"Salvaguardas · na prática","Configure a conta: as travas que ficam ligadas","2 min")
confs=[("1","Privacidade",
        "Desligue “Ajude a melhorar nossos modelos de IA”: suas conversas deixam de ir para treino.",
        "cl_priv.png"),
       ("2","Perfil",
        "Nome, apelido e o campo Instruções — o que você escreve ali vale para toda conversa.",
        "cl_perfil.png"),
       ("3","Instruções",
        "As suas regras de ouro, sempre ligadas: sem chute, com confiança declarada e fonte citada.",
        "cl_instr.png")]
CW=(11.73-2*0.22)/3; CY=1.72
for i,(num,title,desc,img) in enumerate(confs):
    x=0.8+i*(CW+0.22); acc=[PETROLEO,TEAL,AMBAR][i]
    nb=box(s,Inches(x),Inches(CY),Inches(0.36),Inches(0.36),fill=acc,round_=True)
    nf=nb.text_frame; nf.word_wrap=False; nf.vertical_anchor=MSO_ANCHOR.MIDDLE
    np_=nf.paragraphs[0]; np_.alignment=PP_ALIGN.CENTER
    nr=np_.add_run(); nr.text=num; nr.font.size=Pt(13); nr.font.bold=True; nr.font.color.rgb=WHITE; nr.font.name=FONT
    text(s,Inches(x+0.44),Inches(CY-0.05),Inches(CW-0.44),Inches(0.5),[[(title,13,TITLE,True)]],line_spacing=1.0)
    text(s,Inches(x),Inches(CY+0.48),Inches(CW),Inches(0.82),[[(desc,10,INK,False)]],line_spacing=1.06)
    screen_frame(s,img,x+CW/2,3.02,2.45,None)
band(s,5.58,1.80,"AS REGRAS QUE VALE A PENA COLAR NO CAMPO INSTRUÇÕES",
     [[("Sem certeza, diga “não sei” — nunca chute.   ·   Dê a confiança de 1 a 10; abaixo de 7, sinalize.",11.5,AREIA,True)],
      [("Cite sempre a fonte verificada de números e de afirmações sobre pessoas.",11.5,AREIA,True)],
      [("Nunca apague, compre ou contrate nada sem confirmar comigo duas vezes.",11.5,AREIA,True)],
      [("Não substitui o resto: conta da empresa, dados públicos ou fictícios, decisão sempre humana.",11,BEGE,False)]])
s.notes_slide.notes_text_frame.text=("~2 min. Mostrar as tres telas do app do Claude. (1) Configuracoes > Privacidade: desligar "
 "'Ajude a melhorar nossos modelos de IA' — as conversas param de ir para treino; vale tambem para a conta da empresa. "
 "(2) Perfil: nome, apelido e o campo Instrucoes. (3) Instrucoes: as regras de ouro, que valem em TODA conversa — sem chute, "
 "confianca de 1 a 10, fonte verificada e nunca apagar/comprar/contratar sem dupla confirmacao. Dizer que configuracao nao "
 "substitui politica: conta da empresa, dados publicos ou ficticios no teste, politicas de acesso e sigilo da Allos, decisao humana.")
salvcfg=s

# ---- Salvaguardas NA PRÁTICA (2): anonimizar dados ----
s=new_slide()
header(s,"Salvaguardas · na prática","Anonimizar para testar com dados reais","2 min")
def _anon_card(x,acc,tag,titulo,linhas):
    W,Y,H=5.75,1.72,2.85
    box(s,Inches(x),Inches(Y),Inches(W),Inches(H),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    accent(s,x,Y,W,acc)
    text(s,Inches(x+0.25),Inches(Y+0.2),Inches(W-0.5),Inches(0.34),[[(tag,11,acc,True)]])
    text(s,Inches(x+0.25),Inches(Y+0.52),Inches(W-0.5),Inches(0.44),[[(titulo,15,TITLE,True)]])
    box(s,Inches(x+0.25),Inches(Y+1.04),Inches(W-0.5),Inches(H-1.28),fill=WHITE,line=CLINE,line_w=0.75,round_=True,rad=0.08)
    text(s,Inches(x+0.45),Inches(Y+1.14),Inches(W-0.9),Inches(H-1.48),
         [[(l,10.5,INK,False)] for l in linhas],space_after=4,line_spacing=1.24)
_anon_card(0.8,CORAL,"ANTES · NÃO COLE ASSIM","A linha como ela sai do sistema",
           ["Loja: Café do Largo — piso L2, quiosque 14",
            "CNPJ 12.345.678/0001-90 · contrato 4471",
            "Responsável: Mariana Alves · (31) 9 8877-1234",
            "Venda set/26: R$ 412.300 · aluguel R$ 38.900"])
_anon_card(6.78,MENTA,"DEPOIS · PODE COLAR","A mesma linha, anonimizada",
           ["Loja: LOJA_07 — piso 2, quiosque A (alimentação)",
            "Identificador: LOJA_07 · a chave fica fora da IA",
            "Responsável: CONTATO_07",
            "Venda: índice 100 (média do piso) · aluguel 9,4%"])
band(s,4.85,2.2,"A RECEITA — 4 PASSOS ANTES DE COLAR QUALQUER DADO",
     [[("1 · Troque nome por código — LOJA_07, CONTATO_07. A chave que reverte fica na sua planilha, nunca na IA.",11.5,AREIA,False)],
      [("2 · Apague o que identifica: CNPJ, CPF, telefone, e-mail, número de contrato, endereço exato.",11.5,AREIA,False)],
      [("3 · Torne os valores relativos: índice, % da média ou faixa no lugar do número exato.",11.5,AREIA,False)],
      [("4 · Peça o método, não o dado: a IA devolve o critério e o ranking; você aplica na planilha real.",11.5,AREIA,False)],
      [("Na dúvida: se o dado identifica uma loja, uma pessoa ou um contrato, ele não entra na IA.",11.5,AMBAR,True)]])
s.notes_slide.notes_text_frame.text=("~2 min. Como trabalhar com dado real sem expor dado confidencial. A esquerda, a linha como sai do "
 "sistema — nome da loja, CNPJ, contrato, telefone do responsavel e o valor exato de venda e aluguel. A direita, a mesma linha "
 "anonimizada: codigo no lugar do nome, identificadores apagados, valores em indice e em percentual. A chave que liga LOJA_07 a "
 "loja real fica na SUA planilha, nunca na IA. Fechar com a regra pratica: se o dado identifica uma loja, uma pessoa ou um "
 "contrato, ele nao entra. E lembrar que isso nao dispensa as politicas de acesso e sigilo da Allos.")
anon=s

# ===================== BLOCO 2: O Shopping Inteligente =====================
d3=divider("Bloco 2","O Shopping Inteligente","A tese e o impacto — e como cada app nasceu no Claude Code, com o vídeo de cada um funcionando.")

# ---- Case real (iFood): título + sinalização de vídeo ----
s=new_slide()
box(s,Inches(0.55),Inches(0.42),Inches(0.12),Inches(0.82),fill=PETROLEO)
text(s,Inches(0.8),Inches(0.4),Inches(9.8),Inches(0.3),[[("HISTÓRIA REAL · CLAUDE NA PRÁTICA",12.5,TEAL,True)]])
text(s,Inches(0.8),Inches(0.68),Inches(10.4),Inches(0.5),[[("Do círculo de giz da Toyota ao Claude no ônibus",24,TITLE,True)]])
box(s,Inches(0.8),Inches(1.2),Inches(0.2),Inches(0.2),fill=CORAL,round_=True)
text(s,Inches(1.1),Inches(1.16),Inches(9.0),Inches(0.3),[[("Diego do iFood  ·  @diegocbarreto",11,VERDE,True)]])
cc=box(s,Inches(11.5),Inches(0.5),Inches(1.28),Inches(0.46),fill=AREIA,round_=True)
ccp=cc.text_frame.paragraphs[0]; ccp.alignment=PP_ALIGN.CENTER
ccr=ccp.add_run(); ccr.text="8:40"; ccr.font.size=Pt(12.5); ccr.font.bold=True; ccr.font.color.rgb=PETROLEO; ccr.font.name=FONT
PX,PY,PW,PH=0.8,2.05,11.73,4.55
box(s,Inches(PX),Inches(PY),Inches(PW),Inches(PH),fill=DARK,line=PETROLEO,line_w=1.4,round_=True)
accent(s,PX,PY,PW,AMBAR)
cx=PX+PW/2; cyd=1.55; cyt=PY+0.95
circ=s.shapes.add_shape(MSO_SHAPE.OVAL,Inches(cx-cyd/2),Inches(cyt),Inches(cyd),Inches(cyd))
circ.fill.solid(); circ.fill.fore_color.rgb=CORAL; circ.line.color.rgb=AREIA; circ.line.width=Pt(2); circ.shadow.inherit=False
tri=s.shapes.add_shape(MSO_SHAPE.ISOSCELES_TRIANGLE,Inches(cx-0.24),Inches(cyt+0.42),Inches(0.62),Inches(0.72))
tri.rotation=90; tri.fill.solid(); tri.fill.fore_color.rgb=WHITE; tri.line.fill.background(); tri.shadow.inherit=False
text(s,Inches(PX+0.5),Inches(cyt+cyd+0.18),Inches(PW-1.0),Inches(0.5),
     [[("VÍDEO A SEGUIR  ·  RESUMO DO CASE  ·  8:40",15,AMBAR,True)]],align=PP_ALIGN.CENTER)
text(s,Inches(PX+1.2),Inches(cyt+cyd+0.7),Inches(PW-2.4),Inches(1.0),
     [[("Um coordenador do iFood abriu o Claude no celular dentro de um ônibus e, sozinho, construiu um sistema real que tirou um processo do escuro — da certeza da loja ao dado que mudou a decisão.",15,ONDARK,False)]],
     align=PP_ALIGN.CENTER,line_spacing=1.12)
s.notes_slide.notes_text_frame.text=("~9 min (video 8:40). Rodar aqui o video com o resumo do case do iFood (thread do Diego do iFood · @diegocbarreto). "
 "Ponte: Toyota/Ohno — quem via o problema nao mudava o sistema; o coordenador zerou essa distancia com o Claude, "
 "tirou o processo do escuro e agiu com dado. Penultimo slide: fecha a ponte entre os apps que o time acabou de ver "
 "e a mensagem final do encerramento.")
story=s

# ---- Como cada app nasceu (telas reais) ----
def phone(s,img,x,y,h,caption):
    iw,ih=_PILImage.open(base+img).size; w=h*iw/ih
    box(s,Inches(x-0.05),Inches(y-0.05),Inches(w+0.10),Inches(h+0.10),fill=VERDE,round_=True,rad=0.06)
    s.shapes.add_picture(base+img,Inches(x),Inches(y),Inches(w),Inches(h))
    cap=box(s,Inches(x-0.05),Inches(y+h+0.08),Inches(w+0.10),Inches(0.32),fill=PETROLEO,round_=True)
    cf=cap.text_frame; cf.word_wrap=False; cf.vertical_anchor=MSO_ANCHOR.MIDDLE; cp=cf.paragraphs[0]; cp.alignment=PP_ALIGN.CENTER
    cr=cp.add_run(); cr.text=caption; cr.font.size=Pt(9.5); cr.font.bold=True; cr.font.color.rgb=AREIA; cr.font.name=FONT
    return x+w
def app_origin(kicker,title,prompt_img,app_img,oque,pergunta_final):
    s=new_slide()
    header(s,kicker,title,"3 min")
    HI,IY=4.85,1.68
    r1=phone(s,prompt_img,0.7,IY,HI,"como começou · o prompt")
    r2=phone(s,app_img,r1+0.32,IY,HI,"a ferramenta hoje")
    RX=r2+0.4; RW=12.53-RX
    box(s,Inches(RX),Inches(IY),Inches(RW),Inches(3.5),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    accent(s,RX,IY,RW,AMBAR)
    text(s,Inches(RX+0.25),Inches(IY+0.2),Inches(RW-0.5),Inches(0.35),[[("O QUE A FERRAMENTA RESOLVE",12,TITLE,True)]])
    text(s,Inches(RX+0.25),Inches(IY+0.62),Inches(RW-0.5),Inches(2.75),[[(oque,12.5,INK,False)]],line_spacing=1.12)
    dy,dh=5.35,1.85
    box(s,Inches(RX),Inches(dy),Inches(RW),Inches(dh),fill=DARK,line=PETROLEO,line_w=1.2,round_=True)
    accent(s,RX,dy,RW,AMBAR)
    text(s,Inches(RX+0.25),Inches(dy+0.16),Inches(RW-0.5),Inches(0.35),[[("DE UMA FRASE A UMA FERRAMENTA",11.5,AMBAR,True)]])
    text(s,Inches(RX+0.25),Inches(dy+0.56),Inches(RW-0.5),Inches(1.3),
         [[("Descrita em linguagem natural; o Claude Code leu, perguntou e construiu o app.",12.5,AREIA,True)],
          [(pergunta_final,11.5,BEGE,False)]],line_spacing=1.08)
    return s
app1=app_origin("Como os apps nasceram · 1","Radar de Varejo — do prompt ao app","ws_quiosque.png","ws_quiosque_app.png",
    "Triagem e seleção de operações de varejo — loja satélite ou quiosque. Faz as perguntas certas ao "
    "investidor (capacidade de investimento, capital de giro, tempo dedicado, experiência) para definir "
    "marca e segmento. Cruza o interesse com a base de marcas da ABF e das PMEs, valida o matching e "
    "cruza com o mix planejado do shopping.",
    "Apoia o time de Negócios.")
app2=app_origin("Como os apps nasceram · 2","Radar de Mídia (Helloo) — do prompt ao app","ws_midia.png","ws_midia_app.png",
    "Triagem e seleção de oferta de mídia. Pergunta ao anunciante (investimento, intenção, público-alvo, "
    "tempo, segmento) e cruza com a base de propriedades (totens, megabanners, testeiras, túneis, app do "
    "relacionamento, Venda Certa, patrocínio de eventos e espaços), achando a propriedade mais adequada.",
    "Apoia o time de Marketing.")
app3=app_origin("Como os apps nasceram · 3","Otimizador de Obras — do prompt ao app","ws_obras.png","ws_obras_app.png",
    "Triagem e seleção de fornecedores para obras. Pergunta ao lojista (tamanho, padrão, materiais, "
    "investimento, experiência) e cruza com a base de fornecedores (engenharia, materiais, segurança e "
    "regularização), achando quem faz a obra no menor tempo e custo, com segurança.",
    "Apoia o time de Operações.")
app4=app_origin("Como os apps nasceram · 4","Apurador Fiscal — do prompt ao app","ws_fiscal.png","ws_fiscal_app.png",
    "Auditoria de vendas fiscais. Lê os livros fiscais (PDF, foto, Excel, TXT/SPED, CSV), separa os códigos "
    "de entradas e saídas e apura a venda real por CNPJ — cruzando com as vendas informadas na planilha para "
    "achar divergências. No Simples Nacional, usa o extrato PGDAS-D como referência.",
    "Nasceu de um pedido de ambiente isolado e seguro — controle fiscal também vira ferramenta.")

# ---- vídeo de funcionamento (~3 min), um após cada app ----
def app_video(kicker,title,legenda,notes):
    s=new_slide()
    header(s,kicker,title,"~3 min")
    PX,PY,PW,PH=0.8,2.05,11.73,4.55
    box(s,Inches(PX),Inches(PY),Inches(PW),Inches(PH),fill=DARK,line=PETROLEO,line_w=1.4,round_=True)
    accent(s,PX,PY,PW,AMBAR)
    cx=PX+PW/2; cyd=1.55; cyt=PY+0.9
    circ=s.shapes.add_shape(MSO_SHAPE.OVAL,Inches(cx-cyd/2),Inches(cyt),Inches(cyd),Inches(cyd))
    circ.fill.solid(); circ.fill.fore_color.rgb=CORAL; circ.line.color.rgb=AREIA; circ.line.width=Pt(2); circ.shadow.inherit=False
    tri=s.shapes.add_shape(MSO_SHAPE.ISOSCELES_TRIANGLE,Inches(cx-0.24),Inches(cyt+0.42),Inches(0.62),Inches(0.72))
    tri.rotation=90; tri.fill.solid(); tri.fill.fore_color.rgb=WHITE; tri.line.fill.background(); tri.shadow.inherit=False
    text(s,Inches(PX+0.5),Inches(cyt+cyd+0.16),Inches(PW-1.0),Inches(0.5),
         [[("VÍDEO · O APP FUNCIONANDO  ·  ~3 MIN",15,AMBAR,True)]],align=PP_ALIGN.CENTER)
    text(s,Inches(PX+1.2),Inches(cyt+cyd+0.68),Inches(PW-2.4),Inches(1.0),
         [[(legenda,15,ONDARK,False)]],align=PP_ALIGN.CENTER,line_spacing=1.12)
    s.notes_slide.notes_text_frame.text=notes
    return s
av1=app_video("O app funcionando · 1","Radar de Varejo — vídeo",
    "Do perfil do investidor à recomendação: as perguntas de triagem, o cruzamento com a base de marcas (ABF e PMEs) e o match com o mix planejado.",
    "~3 min. Video do Radar de Varejo em uso, do login a recomendacao.")
av2=app_video("O app funcionando · 2","Radar de Mídia (Helloo) — vídeo",
    "Do briefing do anunciante à propriedade recomendada: público, verba e intenção cruzados com o inventário de mídia (totens, megabanners, Venda Certa, eventos).",
    "~3 min. Video do Radar de Midia em uso, do briefing a propriedade recomendada.")
av3=app_video("O app funcionando · 3","Otimizador de Obras — vídeo",
    "Do escopo da obra à shortlist de fornecedores: padrão, materiais, prazo e investimento cruzados com a base de engenharia, materiais, segurança e regularização.",
    "~3 min. Video do Otimizador de Obras em uso, do escopo a shortlist de fornecedores.")
av4=app_video("O app funcionando · 4","Apurador Fiscal — vídeo",
    "Do upload dos livros fiscais à apuração por CNPJ: leitura de PDF/foto/SPED/planilha, separação de entradas e saídas e o destaque das divergências.",
    "~3 min. Video do Apurador Fiscal em uso, do upload dos livros a apuracao e as divergencias.")

# ===================== ONDE BUSCAR INFORMAÇÕES (slide final) =====================
s=new_slide()
header(s,"Para continuar","Onde buscar informações")  # sem chip de tempo: slide de consulta
def ref_col(x,titulo,acc,rows):
    W,Y,H=5.75,1.8,4.75
    box(s,Inches(x),Inches(Y),Inches(W),Inches(H),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    accent(s,x,Y,W,acc)
    text(s,Inches(x+0.25),Inches(Y+0.2),Inches(W-0.5),Inches(0.42),[[(titulo,14,TITLE,True)]])
    y=Y+0.74
    for tag,name,link,sug in rows:
        text(s,Inches(x+0.25),Inches(y),Inches(W-0.5),Inches(0.3),[[(name,12,INK,True)]])
        runs=[(tag,10.5,acc,True),(" · ",10.5,BEGE,False),(link,10.5,TEAL,False)]
        if sug: runs.append((" · sugestão",10.5,BEGE,False))
        text(s,Inches(x+0.25),Inches(y+0.27),Inches(W-0.5),Inches(0.28),[runs])
        y+=0.58
ref_col(0.8,"PORTUGUÊS",TEAL,[
    ("CURSOS","Asimov Academy — vídeos e cursos","asimov.academy · YouTube",False),
    ("PODCAST","Hipsters Ponto Tech (Alura)","hipsters.tech · Spotify",True),
    ("INSTAGRAM","@aloisio — curadoria de IA em português","instagram.com/aloisio",False),
    ("INSTAGRAM","@obrunookamoto — SaaS, IA e negócios","instagram.com/obrunookamoto",False),
    ("INSTAGRAM","@larissagomes.ia — IA no trabalho real","instagram.com/larissagomes.ia",False),
    ("INSTAGRAM","@beprecht — adoção de IA nas empresas","instagram.com/beprecht · bernardo.vc",False),
    ("INSTAGRAM","@maestrosdaia — Maestros da IA","instagram.com/maestrosdaia · YouTube",False)])
ref_col(6.78,"INGLÊS",PETROLEO,[
    ("SITE","Anthropic · Claude","anthropic.com · claude.ai",False),
    ("VÍDEO","Andrej Karpathy — “Intro to LLMs”","youtube.com/@AndrejKarpathy",True),
    ("NEWSLETTER","Ethan Mollick — One Useful Thing","oneusefulthing.org",True),
    ("CURSO","DeepLearning.AI — short courses","deeplearning.ai/short-courses",True),
    ("VÍDEOS","Trilha Claude no YouTube — via @aloisio","Master Claude · /skills · Claude Code",False),
    ("INSTAGRAM","@sabrina_ramonov — cursos de IA","instagram.com/sabrina_ramonov",False),
    ("PODCAST","The Startup Ideas Podcast","Greg Isenberg · Spotify e YouTube",False)])
band(s,6.72,0.48,None,[[("“sugestão” = referências que acrescentamos além da lista.",10.5,BEGE,False)]])
s.notes_slide.notes_text_frame.text=("Slide de consulta — nao conta no tempo; deixar disponivel para depois. Onde continuar depois do treinamento: em portugues (Asimov, podcasts, Instagram) e em ingles "
 "(Anthropic/Claude, Karpathy, Ethan Mollick, DeepLearning.AI). Mensagem: na duvida, pergunte para a propria IA.")
refs=s

# ===================== SLIDE FINAL ANIMADO: "AI" → "Acelerar nossa Inteligência" =====================
# python-pptx nao expoe animacao; o efeito e escrito direto em OOXML (<p:timing>).
from pptx.oxml import parse_xml
_NS=('xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" '
     'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"')
def _nid(c): c[0]+=1; return c[0]
def _fx_motion(c,spid,dx,dy,delay,dur,primeiro=False):
    a,b=_nid(c),_nid(c)
    nt="clickEffect" if primeiro else "withEffect"
    return (f'<p:par><p:cTn id="{a}" presetID="0" presetClass="path" presetSubtype="0" accel="20000" decel="20000" fill="hold" nodeType="{nt}">'
            f'<p:stCondLst><p:cond delay="{delay}"/></p:stCondLst><p:childTnLst>'
            f'<p:animMotion origin="layout" path="M 0 0 L {dx:.5f} {dy:.5f} E" pathEditMode="relative">'
            f'<p:cBhvr><p:cTn id="{b}" dur="{dur}" fill="hold"/><p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl>'
            f'<p:attrNameLst><p:attrName>ppt_x</p:attrName><p:attrName>ppt_y</p:attrName></p:attrNameLst>'
            f'</p:cBhvr></p:animMotion></p:childTnLst></p:cTn></p:par>')
def _fx_scale(c,spid,pct,delay,dur):
    a,b=_nid(c),_nid(c)
    return (f'<p:par><p:cTn id="{a}" presetID="6" presetClass="emph" presetSubtype="0" fill="hold" nodeType="withEffect">'
            f'<p:stCondLst><p:cond delay="{delay}"/></p:stCondLst><p:childTnLst>'
            f'<p:animScale><p:cBhvr><p:cTn id="{b}" dur="{dur}" fill="hold"/>'
            f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cBhvr>'
            f'<p:from x="100000" y="100000"/><p:to x="{pct}" y="{pct}"/></p:animScale></p:childTnLst></p:cTn></p:par>')
def _fx_fade(c,spid,delay,dur,entrada=True):
    a,b,d=_nid(c),_nid(c),_nid(c)
    if entrada:
        return (f'<p:par><p:cTn id="{a}" presetID="10" presetClass="entr" presetSubtype="0" fill="hold" grpId="0" nodeType="withEffect">'
                f'<p:stCondLst><p:cond delay="{delay}"/></p:stCondLst><p:childTnLst>'
                f'<p:set><p:cBhvr><p:cTn id="{b}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>'
                f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst>'
                f'</p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set>'
                f'<p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="{d}" dur="{dur}"/>'
                f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cBhvr></p:animEffect>'
                f'</p:childTnLst></p:cTn></p:par>')
    return (f'<p:par><p:cTn id="{a}" presetID="10" presetClass="exit" presetSubtype="0" fill="hold" grpId="0" nodeType="withEffect">'
            f'<p:stCondLst><p:cond delay="{delay}"/></p:stCondLst><p:childTnLst>'
            f'<p:animEffect transition="out" filter="fade"><p:cBhvr><p:cTn id="{b}" dur="{dur}"/>'
            f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cBhvr></p:animEffect>'
            f'<p:set><p:cBhvr><p:cTn id="{d}" dur="1" fill="hold"><p:stCondLst><p:cond delay="{dur}"/></p:stCondLst></p:cTn>'
            f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst>'
            f'</p:cBhvr><p:to><p:strVal val="hidden"/></p:to></p:set>'
            f'</p:childTnLst></p:cTn></p:par>')
def _timing(effects):
    return (f'<p:timing {_NS}><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
            '<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>'
            '<p:par><p:cTn id="3" fill="hold"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst><p:childTnLst>'
            '<p:par><p:cTn id="4" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst>'
            f'<p:childTnLst>{effects}</p:childTnLst>'
            '</p:cTn></p:par></p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn>'
            '<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
            '<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst>'
            '</p:seq></p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>')

s=new_slide(dark=True)
box(s,0,0,SW,Inches(0.18),fill=TEAL); box(s,0,SH-Inches(0.18),SW,Inches(0.18),fill=AMBAR)
stamp_logo(s,h=0.34,negative=True,margin_r=0.6,margin_b=0.5)
# frase final em 2 linhas: o A e o I ficam na MESMA coluna da esquerda (destino exato das letras)
LX,Y1,Y2,FS=1.5,2.75,3.95,54
l1=text(s,Inches(LX),Inches(Y1),Inches(10.6),Inches(1.05),
        [[("A",FS,AMBAR,True),("celerar nossa",FS,WHITE,True)]],anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)
l2=text(s,Inches(LX),Inches(Y2),Inches(10.6),Inches(1.05),
        [[("I",FS,AMBAR,True),("nteligência",FS,WHITE,True)]],anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)
sub=text(s,Inches(LX+0.07),Inches(5.25),Inches(10.6),Inches(0.5),
         [[("A tecnologia acelera. A decisão — e o encontro humano — continuam nossos.",16,AREIA,False)]])
# ATENCAO: a animacao das letras "AI" (escrita a mao em <p:timing>) foi REMOVIDA — o
# PowerPoint recusava o arquivo ("encontrou um problema e precisa fechar"). O slide fica
# estatico com a frase final. Nao reintroduzir OOXML manual sem validar no PowerPoint.
s.notes_slide.notes_text_frame.text=("Slide de fecho. A frase fecha o treinamento: acelerar nossa inteligencia — "
 "a tecnologia acelera; a decisao e o encontro humano continuam nossos.")
fim=s

def _anima_fim():
    """Acrescenta ao slide final as letras 'AI' grandes + a animacao (motion path + shrink + crossfade)."""
    def _big(ch,x,w):
        tb=fim.shapes.add_textbox(Inches(x),Inches(2.15),Inches(w),Inches(2.8))
        tf=tb.text_frame; tf.word_wrap=False; tf.vertical_anchor=MSO_ANCHOR.MIDDLE
        tf.margin_left=0; tf.margin_right=0; tf.margin_top=0; tf.margin_bottom=0
        p=tf.paragraphs[0]; p.alignment=PP_ALIGN.CENTER
        r=p.add_run(); r.text=ch; r.font.size=Pt(200); r.font.bold=True; r.font.color.rgb=AMBAR; r.font.name=FONT
        return tb
    bA=_big("A",4.9,2.2); bI=_big("I",7.1,1.4)
    SWi,SHi=SW/914400.0,SH/914400.0
    cA=(4.9+2.2/2,2.15+2.8/2); cI=(7.1+1.4/2,2.15+2.8/2)   # centro das letras grandes
    tA=(LX+0.35,Y1+1.05/2);    tI=(LX+0.21,Y2+1.05/2)      # onde pousam (centro da caixa da frase)
    c=[4]; pct=int(round(FS/200*100000))
    fx=(_fx_motion(c,bA.shape_id,(tA[0]-cA[0])/SWi,(tA[1]-cA[1])/SHi,0,1200,primeiro=True)
       +_fx_scale (c,bA.shape_id,pct,0,1200)
       +_fx_motion(c,bI.shape_id,(tI[0]-cI[0])/SWi,(tI[1]-cI[1])/SHi,150,1200)
       +_fx_scale (c,bI.shape_id,pct,150,1200)
       +_fx_fade(c,bA.shape_id,1400,350,entrada=False)
       +_fx_fade(c,bI.shape_id,1550,350,entrada=False)
       +_fx_fade(c,l1.shape_id,1400,350)
       +_fx_fade(c,l2.shape_id,1550,350)
       +_fx_fade(c,sub.shape_id,1900,500))
    fim._element.append(parse_xml(_timing(fx)))
    fim.notes_slide.notes_text_frame.text=("Slide de fecho animado. Entra com 'AI' grande no centro; ao CLICAR, o A e o I "
     "deslizam e diminuem ate o inicio de 'Acelerar' e 'Inteligencia', e a frase aparece.")

# ===================== ORDEM FINAL =====================
lst=prs.slides._sldIdLst; ids=list(lst)
R=lambda k: ids[REUSE[k]]
def sid(sl): return ids[list(prs.slides).index(sl)]
order=[sid(capa), sid(agenda),
       sid(d2), R("iaml"), R("llm"), R("pensa"),
       sid(chat_ag), sid(ferr), sid(modelos), sid(conect), sid(harness), sid(harness2), sid(criacao), R("salv"), sid(salvcfg), sid(anon),
       sid(d3), R("video"), R("tese"), R("impacto"),
       sid(app1), sid(av1), sid(app2), sid(av2), sid(app3), sid(av3), sid(app4), sid(av4),
       sid(story),   # penúltimo: história real · Claude na prática
       R("enc"), sid(refs), sid(fim)]
for e in ids: lst.remove(e)
for e in order: lst.append(e)

# ---- fonte Allos (Gantari) + escala de leitura para telao em todos os slides ----
def _bump(pt):
    """Nada abaixo de 13pt (leitura no telao); corpo ~+12%; titulos (>=22pt) preservados."""
    if pt>=22: return pt
    return min(22.0,max(13.0,int(pt*1.12*2+0.5)/2))
for sl in prs.slides:
    for sh in sl.shapes:
        if sh.has_text_frame:
            for p in sh.text_frame.paragraphs:
                for r in p.runs:
                    r.font.name=FONT
                    if r.font.size is not None: r.font.size=Pt(_bump(r.font.size.pt))
# ajuste fino em slide reaproveitado: com a fonte maior o rotulo do token quebrava sobre os chips
for sl in prs.slides:
    for sh in sl.shapes:
        if not sh.has_text_frame: continue
        _t=sh.text_frame.text
        if "vira 4 tokens" in _t:
            for p in sh.text_frame.paragraphs:
                for r in p.runs:
                    if "vira 4 tokens" in r.text: r.text=r.text.replace("vira 4 tokens","= 4 tokens")
        elif _t.strip() in ("Shop","ping","Inteli","gente"):
            sh.top=sh.top+Inches(0.1)
_enc=[sl for sl in prs.slides if any(sh.has_text_frame and "A IA não vai substituir" in sh.text_frame.text for sh in sl.shapes)][0]  # slide de encerramento
stamp_logo(_enc,h=0.34,margin_r=0.6,margin_b=0.5)
for _sh in _enc.shapes:   # com a fonte maior, o chip do kicker precisa de mais largura
    if _sh.has_text_frame and _sh.text_frame.text.strip().startswith("PARA FECHAR"): _sh.width=Inches(5.9)
_nt=_enc.notes_slide.notes_text_frame
_nt.text=(_nt.text.rstrip()+"\n\nFecho — a mensagem central: a transformacao da Cia so vai acontecer quando estivermos "
 "inovando na ponta — no supervisor de seguranca, no de estacionamento, e assim por diante. O exemplo e o iFood: "
 "quem construiu o sistema foi um coordenador na operacao, perto do problema, e nao um time central. "
 "E isso que queremos aqui: quem esta mais perto do problema tambem tem o poder de mudar o que precisa.")
# comentário no início do fechamento (abaixo do título, antes dos pontos de atenção)
for _sh in _enc.shapes:  # abre um respiro: desce o bloco "pontos de atenção" em 0,15 in (faixa e logo ficam)
    if Inches(2.7) <= _sh.top <= Inches(5.4): _sh.top=_sh.top+Inches(0.15)
text(_enc,Inches(0.9),Inches(2.2),Inches(11.6),Inches(0.58),
     [[("Na dúvida, pergunte para a própria IA (claude.ai).  ",14,AMBAR,True),
       ("A velocidade de inovação em IA muda diariamente — busque sempre as informações mais atualizadas.",14,WHITE,True)]],line_spacing=1.05)

# ===================== GERA OS 3 ARQUIVOS =====================
SHOPPINGS=[("Estação BH","22/09/26","Treinamento_1h_Shopping_Inteligente_Estacao_BH.pptx"),
           ("Boulevard BH","23/09/26","Treinamento_1h_Shopping_Inteligente_Boulevard_BH.pptx"),
           ("Shopping DelRey","24/09/26","Treinamento_1h_Shopping_Inteligente_DelRey.pptx")]
def _checa_pacote(path):
    """Aborta se algum shape tiver dimensao <= 0 — isso corrompe o arquivo no PowerPoint."""
    import zipfile as _zp, re as _re
    from lxml import etree as _et
    _A='{http://schemas.openxmlformats.org/drawingml/2006/main}'
    _z=_zp.ZipFile(path); ruins=[]
    for _n in _z.namelist():
        if not _re.match(r'ppt/slides/slide\d+\.xml$',_n): continue
        for _e in _et.fromstring(_z.read(_n)).iter(_A+'ext'):
            if int(_e.get('cx',1))<=0 or int(_e.get('cy',1))<=0:
                ruins.append((_n,_e.get('cx'),_e.get('cy')))
    if ruins: raise SystemExit(f'ABORTADO: dimensao nao positiva em {ruins[:5]}')

for nome,data,out in SHOPPINGS:
    # animacao so no DelRey (ultimo save): Estacao BH e Boulevard BH ja foram baixados
    if "DelRey" in out: _anima_fim()
    capa_meta_run.text=f"Time {nome}   ·   {data}"
    prs.save(base+out)
    _checa_pacote(base+out)
    print("gerado:",out)

# verificacao (ultimo arquivo)
p2=Presentation(base+SHOPPINGS[-1][2]); SS=list(p2.slides)
print("slides:",len(SS))
for i,sl in enumerate(SS):
    ts=[sh.text_frame.text.strip() for sh in sl.shapes if sh.has_text_frame and sh.text_frame.text.strip()]
    kick=ts[0].splitlines()[0] if ts else ""
    print(f"[{i+1:2}] {kick[:52]}")
