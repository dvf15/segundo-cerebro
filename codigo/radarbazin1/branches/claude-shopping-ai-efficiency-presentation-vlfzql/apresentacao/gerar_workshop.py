# -*- coding: utf-8 -*-
"""
WORKSHOP Shopping Inteligente — 4 horas.
Base: Shopping_Inteligente_IA_Carioca_Shopping.pptx (reaproveita conceitos, vídeo,
ecossistema e fecho). Acrescenta:
- Abertura + agenda do dia (4 h).
- Bloco 4: práticas de IA dos shoppings (7 cases, 10 min cada), logo depois do almoço.
- Conceitos (IA/LLM/como pensa, chat->agentes, chat/cowork/code) + COMO CADA APP
  NASCEU (telas reais dos prompts: Radar de Varejo, Radar de Mídia, Otimizador
  de Obras) + modelos, conectores/skills, harness/loop, salvaguardas.
- Shopping Inteligente (vídeo + ecossistema).
- Mão na massa: rode os apps, critique e traga melhorias; divisão por time e
  formulário.
Saída: Workshop_Shopping_Inteligente_VF.pptx (VERSAO=dia) e Workshop_Shopping_Inteligente_1h30.pptx (VERSAO=1h30)
"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.ns import qn
from PIL import Image as _PILImage
import os as _os
# VERSAO=dia (padrao): workshop regional completo | VERSAO=1h30: workshop de shoppings, sem a mao na massa
VERSAO=_os.environ.get("VERSAO","dia"); assert VERSAO in ("dia","1h30"), VERSAO
V90=(VERSAO=="1h30")
CASE_MIN=2 if V90 else 10   # minutos por case de IA no Bloco 4 (na versao 1h30, so o slide do case)

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
    # caixa do corpo vai ate 0,14 in da base do card (sem papel, o corpo comeca mais alto e ganha esse espaco)
    text(s,Inches(x+0.22),Inches(y+(1.18 if role else 0.7)),Inches(w-0.44),Inches(h-(1.32 if role else 0.84)),[[(body,12.5,INK,False)]],line_spacing=1.08)
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
    ch=box(s,Inches(0.9),Inches(2.3),Inches(0.5+0.13*len(kicker)),Inches(0.5),fill=PETROLEO,round_=True)
    cf=ch.text_frame; cf.word_wrap=False; cf.margin_left=Pt(14); cf.margin_right=Pt(14); cf.vertical_anchor=MSO_ANCHOR.MIDDLE
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

REUSE={k:find(v) for k,v in {
 "iaml":"O que é IA e Machine","llm":"O que é um LLM","pensa":"Como a IA pensa",
 "ferr":"Claude Chat, Cowork e Code","salv":"Salvaguardas",
 "tese":"A tese e a missão","arq":"ecossistema de agentes de IA","cam1":"Agentes de Descoberta e Seleção",
 "cam2":"Agentes de Execução","impacto":"produtividade move","enc":"A IA não vai substituir"}.items()}
# vídeo: slide cujo kicker é o glifo "▶" (evita casar com a linha de agenda do ROTEIRO)
def _find_video():
    for i,sl in enumerate(prs.slides):
        for sh in sl.shapes:
            if sh.has_text_frame and sh.text_frame.text.strip()=="▶": return i
    return None
REUSE["video"]=_find_video()
assert None not in REUSE.values(), REUSE
impacto_sl=prs.slides[REUSE["impacto"]]   # guardado antes da reordenacao

created=[]  # slides recém-criados, na ordem em que quero inseri-los depois

# ===================== CAPA =====================
s=new_slide(dark=True)
box(s,0,0,SW,Inches(0.18),fill=TEAL); box(s,0,SH-Inches(0.18),SW,Inches(0.18),fill=AMBAR)
ch=box(s,Inches(0.9),Inches(1.5),Inches(4.0),Inches(0.44),fill=PETROLEO,round_=True)
cf=ch.text_frame; cf.margin_left=Pt(14); cf.vertical_anchor=MSO_ANCHOR.MIDDLE
cp=cf.paragraphs[0]; cr=cp.add_run(); cr.text=("WORKSHOP · 1H30" if V90 else "WORKSHOP · 9H ÀS 16H05"); cr.font.size=Pt(13); cr.font.bold=True; cr.font.color.rgb=AREIA; cr.font.name=FONT
stamp_logo(s,h=0.52,negative=True,left=SW-Inches(0.52*LOGO_ASPECT)-Inches(0.9),top=Inches(1.47))
text(s,Inches(0.85),Inches(2.3),Inches(11.7),Inches(1.6),
     [[(("Workshop Shopping Inteligente" if V90 else "Workshop Regional"),52,WHITE,True)],[(("IA na prática: conceitos, apps e cases dos shoppings" if V90 else "estratégia e caminhos para o crescimento"),20,AREIA,False)]],space_after=8,line_spacing=1.02)
text(s,Inches(0.9),Inches(4.9),Inches(11.0),Inches(0.5),[[(("estratégia  ·  conceitos  ·  apps  ·  cases dos shoppings" if V90 else "conceitos  ·  mão na massa  ·  receitas  ·  operação  ·  10 shoppings"),15,BEGE,False)]])
text(s,Inches(0.9),Inches(6.45),Inches(11.6),Inches(0.75),
     [[(("Os conceitos de IA na prática, os apps criados no Claude Code e os cases de IA dos shoppings." if V90 else "Melhores práticas, os conceitos de IA na prática e as ferramentas criadas no Claude Code — para rodar, criticar e melhorar juntos."),13,ONDARK,False)]],line_spacing=1.1)
s.notes_slide.notes_text_frame.text=(("Abertura (0:00). Workshop de 1h30 no shopping: estrategia, conceitos de IA, os apps do Shopping Inteligente e os cases dos shoppings." )
 if V90 else ("Abertura do workshop (09:00). Boas-vindas. Das 9h as 16h05, em 7 blocos: as ideias da mao na massa voltam a tarde como apps ajustados."))
capa=s

# ===================== AGENDA DO DIA =====================
s=new_slide()
box(s,Inches(0.55),Inches(0.55),Inches(0.12),Inches(0.95),fill=PETROLEO)
text(s,Inches(0.8),Inches(0.5),Inches(9.8),Inches(0.4),[[(("ROTEIRO" if V90 else "ROTEIRO DO DIA"),13,TEAL,True)]])
text(s,Inches(0.8),Inches(0.85),Inches(10.4),Inches(0.9),[[(("Em 1h30, em 3 blocos" if V90 else "Das 9h às 16h05, em 7 blocos"),27,TITLE,True)]])
c=box(s,Inches(11.35),Inches(0.55),Inches(1.45),Inches(0.5),fill=AREIA,round_=True)
cp=c.text_frame.paragraphs[0]; cp.alignment=PP_ALIGN.CENTER
cr=cp.add_run(); cr.text=("1h30" if V90 else "9h – 16h05"); cr.font.size=Pt(12); cr.font.bold=True; cr.font.color.rgb=PETROLEO; cr.font.name=FONT
# (hora, atividade, detalhe, duração, cor) — duas colunas
if V90:
    COLS=[("PARTE 1  ·  0:00 – 0:45",
           [("0:00","Abertura","o objetivo e o roteiro","3 min",BEGE),
            ("0:03","Abertura estratégica","o rumo da Cia e o que pode travar","7 min",VERDE),
            ("0:10","1 · IA na prática: os conceitos","modelos, conectores, skills e uso seguro","35 min",PETROLEO)]),
          ("PARTE 2  ·  0:45 – 1:30",
           [("0:45","2 · O Shopping Inteligente","o vídeo, a tese e como os apps nasceram","20 min",TEAL),
            ("1:05","3 · Práticas de IA dos shoppings","6 cases · 2 min por case","15 min",CORAL),
            ("1:20","Conclusões","história real (Toyota/iFood, 4 min) e fecho","10 min",MENTA)])]
else:
    COLS=[("MANHÃ  ·  09:00 – 12:45",
           [("09:00","Abertura & boas-vindas","o objetivo do dia","10 min",BEGE),
            ("09:10","Abertura estratégica","o rumo da Cia e o que pode travar","10 min",VERDE),
            ("09:20","1 · IA na prática: os conceitos","modelos, conectores, skills e uso seguro","35 min",PETROLEO),
            ("09:55","2 · O Shopping Inteligente","o vídeo, a tese e como os apps nasceram","20 min",TEAL),
            ("10:15","☕ Café na sala","break rápido","5 min",AMBAR),
            ("10:20","3 · Mão na massa","cada time testa um app e faz a ficha","55 min",VERDE),
            ("11:15","Almoço","enquanto isso, os apps entram em ajuste","90 min",BEGE)]),   # REGRA: almoco sempre de 1h30
          ("TARDE  ·  12:45 – 16:05",
           [("12:45","4 · Práticas de IA dos shoppings","6 cases · 10 min por case","60 min",TEAL),
            ("13:45","5 · Novas receitas","frentes de receita e 3 cases de 10 min","45 min",CORAL),
            ("14:30","☕ Café na sala","break rápido","5 min",AMBAR),
            ("14:35","6 · Os apps ajustados","10 min por app: o que mudou","40 min",VERDE),
            ("15:15","Conclusões","história real (Toyota/iFood, 4 min) e fecho","10 min",MENTA),
            ("15:25","7 · Manual Operacional e PRO","1 · por dentro do manual e o P.R.O.","20 min",PETROLEO),
            ("15:45","Guarda Alta","2 · segurança na reta final · 7 slides","20 min",PETROLEO)])]
AW=5.75; RH=0.48; PITCH=(0.62 if V90 else 0.535); Y0=2.08
for col,(titulo_col,rows) in enumerate(COLS):
    x=0.8+col*(AW+0.23)
    text(s,Inches(x),Inches(1.7),Inches(AW),Inches(0.36),[[(titulo_col,12,TEAL,True)]],line_spacing=1.0)
    y=Y0
    for hora,name,desc,tempo,acc in rows:
        box(s,Inches(x),Inches(y),Inches(AW),Inches(RH),fill=CARD,line=CLINE,line_w=1.0,round_=True)
        box(s,Inches(x),Inches(y+0.1),Inches(0.1),Inches(RH-0.2),fill=acc,round_=True)
        text(s,Inches(x+0.2),Inches(y),Inches(0.8),Inches(RH),[[(hora,14,VERDE,True)]],anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0).text_frame.word_wrap=False
        text(s,Inches(x+0.95),Inches(y-0.01),Inches(3.95),Inches(0.28),[[(name,12.5,TITLE,True)]],line_spacing=1.0)
        text(s,Inches(x+0.95),Inches(y+0.235),Inches(3.95),Inches(0.24),[[(desc,10,SUB,False)]],line_spacing=1.0)
        text(s,Inches(x+4.5),Inches(y),Inches(1.15),Inches(RH),[[(tempo,11.5,VERDE,True)]],align=PP_ALIGN.RIGHT,anchor=MSO_ANCHOR.MIDDLE)
        y+=PITCH
box(s,Inches(0.8),Inches(6.95),Inches(11.73),Inches(0.42),fill=PETROLEO,round_=True)
text(s,Inches(1.05),Inches(6.95),Inches(11.2),Inches(0.42),
     [[(("1h30 " if V90 else "Das 09:00 às 16:05 "),13,AMBAR,True),
       (("— do conceito ao case: a IA que já está no dia a dia dos shoppings." if V90 else "— as ideias da mão na massa voltam como app ajustado à tarde."),12.5,WHITE,True)]],anchor=MSO_ANCHOR.MIDDLE)
s.notes_slide.notes_text_frame.text=(("Agenda (1 min). 1h30 em 3 blocos: abertura (3 min) e abertura estrategica (7 min); IA na pratica (35 min); "
 "o Shopping Inteligente — video, tese e como os 4 apps nasceram (20 min); os 6 cases de IA dos shoppings, 2 min cada, so o slide do case (15 min); "
 "conclusoes com a historia real e o fecho (10 min). Sem a mao na massa.") if V90 else
 ("Agenda (2 min). Das 9h as 16h05, em 7 blocos. Manha: abertura (10 min), abertura estrategica (10 min), IA na pratica (35 min), "
 "o Shopping Inteligente (20 min), cafe na sala as 10:15 e a mao na massa (55 min; cada time preenche a ficha de melhorias). Almoco as 11:15 (1h30). "
 "Tarde: praticas de IA dos shoppings (12:45, 6 cases de 10 min = 60 min), novas receitas com 3 cases de 10 min (13:45, 45 min), cafe na sala as 14:30, "
 "apps ajustados as 14:35 (40 min), conclusoes as 15:15 (10 min), Manual Operacional e P.R.O. as 15:25 (20 min) e Guarda Alta as 15:45 (20 min) — fim as 16:05. "
 "As fichas entram em ajuste no Claude Code desde as 11:15."))
agenda=s

# ===================== ITENS DE GESTÃO (conteúdo a cargo de quem conduz) =====================
d_status=divider("Abertura","Status das metas",None)
d_status.notes_slide.notes_text_frame.text="~10 min (09:15). Status das metas e farol do portfolio; na sequencia, a abertura estrategica (~10 min) e o Programa de Desenvolvimento de Lideranca (~5 min). Conteudo a cargo de quem conduz — inserir aqui os slides do status."

# ===================== ABERTURA ESTRATÉGICA (depois do status das metas) =====================
d_estr=divider("Abertura estratégica","Estratégia de melhoria do produto, maximizando o ciclo do portfólio",
               "A estratégia de crescimento para os próximos anos e os três limitantes para executá-la.")
for _sh in d_estr.shapes:
    if _sh.has_text_frame and _sh.text_frame.text.strip()=="ABERTURA ESTRATÉGICA": _sh.width=Inches(3.5)
for _sh in d_estr.shapes:   # titulo longo: fonte menor e subtitulo mais abaixo
    if not _sh.has_text_frame: continue
    _t=_sh.text_frame.text.strip()
    if _t.startswith("Estratégia de melhoria"):
        for _p in _sh.text_frame.paragraphs:
            for _r in _p.runs: _r.font.size=Pt(38)
    elif _t.startswith("A estratégia de crescimento"): _sh.top=Inches(4.95)
d_estr.notes_slide.notes_text_frame.text=("Abertura estrategica (inicio do dia, apos o status das metas). Tres slides: o ciclo de vida dos shoppings, "
 "a reciclagem via FII K x tradicional e os gargalos operacionais para executar a estrategia. O fio do dia: "
 "a estrategia so se realiza se tivermos gente apta, processos estaveis e reposicao de vacancia sem improviso — "
 "e e ai que a IA e as ferramentas do workshop entram.")
def _infografico(arq,kicker,notas,borda=PETROLEO,destaque=None):
    s=new_slide()
    text(s,Inches(0.55),Inches(0.12),Inches(8.0),Inches(0.3),[[(kicker,11,TEAL,True)]],line_spacing=1.0)
    _w,_h=_PILImage.open(base+f"estrategia/{arq}.png").size
    IW=11.9; IH=IW*_h/_w; MAXH=5.35 if destaque else 6.75
    if IH>MAXH: IH=MAXH; IW=IH*_w/_h
    X=(13.333-IW)/2; Y=0.5
    box(s,Inches(X-0.04),Inches(Y-0.04),Inches(IW+0.08),Inches(IH+0.08),fill=borda,round_=True,rad=0.015)
    s.shapes.add_picture(base+f"estrategia/{arq}.png",Inches(X),Inches(Y),Inches(IW),Inches(IH))
    if destaque: band(s,Y+IH+0.22,7.5-(Y+IH+0.22)-0.3,None,destaque)
    s.notes_slide.notes_text_frame.text=notas
    return s
estr_ciclo=_infografico("ciclo_vida","ABERTURA ESTRATÉGICA · 1/3 · O CICLO DE VIDA",
 "~3 min. Ciclo de vida e estrategia de valor dos shoppings (vendas x tempo). Crescimento: Mooca, Estacao Cuiaba, BBH, "
 "Estacao BH e Carioca. Maturidade (pico de desempenho e receita): Plaza Niteroi, NS, Tijuca e CSU. Na extensao de produto "
 "ha tres alternativas ao declinio: expansao / multi-uso / redevelopment, FII Kinea e reciclagem de portfolio.")
estr_reit=_infografico("reciclagem_reit","ABERTURA ESTRATÉGICA · 2/3 · RECICLAGEM VIA FII K",
 "~3 min. Reciclagem tradicional (fim de ciclo) x via FII K (ciclo perpetuo e flywheel). Na tradicional, a venda do ativo perde "
 "AUM e fees recorrentes, escala e poder de negociacao, deixa capital limitado e baixo ROE e perde as oportunidades de "
 "redevelopment. Via FII K: AUM recorrente e fees, escala e negociacao com lojistas e fornecedores, redevelopment e valorizacao, "
 "reinvestimento e ROE — valor maximizado e crescimento exponencial.",borda=VERDE)
estr_gargalos=_infografico("gargalos","ABERTURA ESTRATÉGICA · 3/3 · O QUE LIMITA A EXECUÇÃO",
 "~3 min. Tres gargalos operacionais para executar a estrategia: (1) escassez de pessoas capacitadas — limitacao de "
 "profissionais aptos para liderar e gerenciar a escala do crescimento; (2) instabilidade nos processos — falta de "
 "padronizacao e consistencia operacional no fluxo de trabalho; (3) gestao artesanal da vacancia — processo moroso e nao "
 "automatizado entre a saida de uma loja e a inauguracao da nova. Ponte para o dia: e exatamente nesses tres pontos que "
 "a IA e as ferramentas do workshop podem ajudar.",borda=CORAL,
 destaque=[[("A IA pode acelerar — e muito — a solução desses três gargalos.  ",15,AMBAR,True)],
           [("Capacita gente mais rápido, estabiliza processos com rotinas que rodam sozinhas e tira o artesanal da reposição de vacância. É o que vamos ver hoje.",12,AREIA,False)]])
d_guarda=divider("Próximos passos · 2","Guarda Alta — Segurança na Reta Final",
                 "Guarda alta é reconhecer o risco e agir antes que ele vire crise.")
d_guarda.notes_slide.notes_text_frame.text=("~20 min (15:45 – 16:05). Guarda Alta — Seguranca na Reta Final, em 7 slides (~3 min cada; lojas temporarias ~2 min), "
 "a partir do resumo da convencao: riscos simultaneos, recursos essenciais, incendio, ocupacao e residuos, equipamentos e "
 "patrimonial, prontidao e oficios, comunicacao de ocorrencias e crise e o que a lideranca precisa garantir.")
# ---- Guarda Alta: 8 slides nativos a partir do resumo (guarda_alta/Guarda_Alta_Resumo.pptx) ----
_GA=[("Riscos simultâneos","Três fatores que aumentam o risco ao mesmo tempo",
      [("02_mais_movimento","Mais movimento",["Mais público, estoques, entregas e serviços pressionam a operação."]),
       ("02_mais_equipes_novas","Mais equipes novas",["Mais temporários e terceiros no shopping e nas lojas. Orientar sobre as rotinas locais antes de iniciar e acompanhar a execução."]),
       ("02_risco_de_reducao_da_atencao","Risco de redução da atenção",["A rotina e o clima de festas podem reduzir a atenção. Reforçar supervisão em campo, cumprimento dos procedimentos e reporte de desvios."])],
      None,"Esses fatores exigem equipes preparadas e atenção redobrada aos sistemas, acessos e rotinas do shopping."),
     ("Recursos essenciais","Infraestrutura sob maior demanda",
      [("03_agua_drenagem_e_abastecimento","Água, drenagem e abastecimento",["Calhas, condutores e bombas de drenagem: conferir limpeza e funcionamento.","Rever pontos com histórico de infiltração ou alagamento e o plano de resposta.","Conhecer autonomia e reposição de água, preservando a reserva de incêndio.","Confirmar recursos de contingência e suporte para falhas que possam interromper a operação."]),
       ("03_energia","Energia",["Avaliar cargas adicionais, quadros e QGBT (quadro geral de distribuição elétrica).","Tratar aquecimento anormal identificado na termografia, desarmes e reparos provisórios."]),
       ("03_climatizacao","Climatização",["Acompanhar desempenho no pico, condensação e chamados recorrentes.","Verificar setpoint, approach e corrente dos chillers.","Partida e desligamento acompanham o horário da operação."])],
      None,"Preparar a resposta aos pontos vulneráveis antes que a chuva comprometa a operação. Parâmetros e liberação seguem projeto, fabricante e plano técnico local."),
     ("Detecção, combate e novas exposições","Risco de incêndio",
      [("04_protecao_contra_incendio","Proteção contra incêndio",["Alarme e central: acionamentos exigem verificação e registro do retorno à central, conforme o procedimento. A liderança conhece falhas e limitações.","Combate: bombas, válvulas, rede e reserva de água em condição de uso. Acompanhar pendências e confirmar a correção.","Saídas e pessoas: rotas livres e proteção acessível. Brigada e equipes conhecem as funções previstas no plano de emergência."]),
       ("04_motos_e_bicicletas_eletricas","Motos e bicicletas elétricas",["Estoque e recarga: mapear lojas que vendem, armazenam ou recarregam. Avaliar estoque e recarga, preservando rotas de saída.","Proteção e resposta: proteção e recursos adequados às baterias presentes, com validação técnica. Alarme, proteção das pessoas e acionamento do socorro seguem o plano de emergência.","Especificação e quantidade de equipamentos dependem da avaliação técnica do risco."]),
       ("04_cozinhas_e_operacao_a_quente","Cozinhas e operação a quente",["Exaustão e limpeza: coifas, filtros, dutos e exaustores. Pendências de limpeza ou funcionamento exigem avaliação e tratamento.","Gás e proteção: proteção, identificação e acesso aos registros de gás de cada loja. Equipe conhece os pontos de corte. Mudanças exigem análise técnica.","Correção e retomada: acompanhar desvios das inspeções e condições de fechamento. Restrição e retorno seguem a matriz e a circular vigentes."])],
      None,"A proteção precisa funcionar quando necessária. Indisponibilidades exigem tratamento; a correção precisa atender ao risco identificado e ter confirmação técnica."),
     ("Mudanças na ocupação e acúmulo de materiais","Lojas temporárias, eventos e áreas de serviço",
      [("05_lojas_temporarias_estoques_e_eventos","Lojas temporárias, estoques e eventos",["Lojas temporárias: lojas e depósitos temporários passam por vistoria da brigada antes da ocupação, com elétrica, detecção, proteção e saídas adequadas. Não liberar por pressa ou pressão financeira.","Estoque e layout: caixas e mercadorias preservam saídas e proteção contra incêndio. Avaliar depósitos extras e cargas adicionais.","Áreas alinhadas: Marketing, Comercial e Operações alinham antes dos compromissos e montagens. Organizar filas, carga e descarga nas docas, preservando circulação e saídas."]),
       ("05_residuos_e_areas_de_servico","Resíduos e áreas de serviço",["Acúmulo de materiais: papelão e resíduos nas docas e depósitos precisam de coleta e armazenamento compatíveis com a demanda.","Compactadora e coleta: conferir funcionamento e capacidade de atendimento. Avaliar alternativa de coleta diante de falhas para evitar acúmulo.","Rotas e acesso: materiais não devem bloquear corredores de serviço, equipamentos de segurança ou acesso de socorro.","Falhas na coleta e acúmulo de materiais precisam chegar à gestão antes de comprometer a operação."])],
      "Nenhuma loja, depósito temporário ou evento poderá ser liberado para ocupação ou funcionamento sem validação prévia de Operações e cumprimento dos requisitos de segurança.",
      "Ocupação, estoque e resíduos mudam o risco do shopping: validar antes, preservar saídas e acessos de socorro."),
     ("Sinais que exigem atenção e segurança patrimonial","Equipamentos, acessos e equipes",
      [("06_equipamentos_acessos_e_comunicacao","Equipamentos, acessos e comunicação",["Escadas e elevadores: ruídos, vibrações, falhas repetidas e manutenção pendente exigem avaliação técnica. Paradas afetam circulação e acessibilidade.","Estacionamento: cancelas, insumos, máquinas de pagamento e filas precisam de suporte e contingência. Preservar saída do público e entrada de socorro.","CFTV e rádio: câmeras, gravação e comunicação apoiam a resposta. Conhecer falhas, pontos sem cobertura e alternativas disponíveis.","Equipe preparada para proteger o público e acionar apoio. Resgates e intervenções somente por profissionais habilitados."]),
       ("06_fechamento_acessos_e_equipes","Fechamento, acessos e equipes",["Fechamento seguro: conferir fechamento e permanência indevida. Reforçar atenção aos acessos restritos, forros e áreas técnicas, conforme o procedimento local.","Furtos e roubos: reforçar rondas e monitoramento nos pontos vulneráveis. Sinais suspeitos e ocorrências exigem acionamento e registro conforme o procedimento.","Temporários e terceiros: orientar antes do início sobre acessos, riscos e quem acionar. Treinar por função e acompanhar mais de perto a aplicação das rotinas, no shopping e nas lojas.","Potencial de crise exige comunicação pronta à regional. Proteção e socorro seguem em paralelo."])],
      None,"Conhecer falhas e limitações dos equipamentos e manter equipes orientadas é o que permite proteger o público e acionar apoio a tempo."),
     ("Recursos de resposta e planejamento por ofícios","Prontidão para a resposta",
      [("07_prateleira_vermelha","Prateleira vermelha",["O que é: estoque de peças essenciais para reduzir a interrupção dos sistemas críticos.","O que conferir: saldo físico, compatibilidade com o equipamento e condição de uso.","Reposição planejada: repor peças utilizadas. Conferir insumos para gerador, no-breaks e suporte técnico.","Peças de reposição reduzem a parada. Equipamentos de contingência apoiam a resposta."]),
       ("07_kit_crise_pronto_para_mobilizacao","Kit crise pronto para mobilização",["Inventário e testes: conferir itens e testes previstos no Book. Geradores, bombas, no-breaks e demais recursos de contingência em condição de uso.","Extratores: avaliar capacidade e funcionamento. Prever alternativa de apoio em caso de falha ou insuficiência, conforme avaliação técnica.","Apoio disponível: fornecedores e contatos atualizados. Conhecer os recursos da regional, responsáveis e condições para mobilizá-los."]),
       ("07_apoio_de_trânsito_e_policiamento","Apoio de trânsito e policiamento",["Apoio solicitado: encaminhar ofícios aos órgãos de trânsito e policiamento para o apoio previsto. Alinhar acessos, entorno, horários e pontos de maior concentração.","Dados do ofício: data, local e horários; previsão de movimento e impacto nas vias; apoio solicitado e acessos de emergência; contato responsável pelo shopping.","Confirmar recebimento, retorno e contatos antes da operação planejada."])],
      None,"Antecipar necessidades e confirmar prontidão. Compras e mobilização seguem as alçadas vigentes."),
     ("Informação antecipada, registro e escalonamento","Comunicação de ocorrências e crise",
      [("08_prevencao_diante_de_manifestacoes","Prevenção diante de manifestações",["Acompanhar sinais: mobilização, local, data e possível impacto no shopping e no entorno.","Avaliar impactos: antecipar efeitos sobre acessos, circulação e segurança. Alinhar apoio com a liderança.","Registrar e informar: fatos no grupo interno, se houver, ou no oficial, indicando o que falta confirmar.","Destacar e atualizar: potencial de crise vai prontamente à regional no grupo oficial, com atualizações.","Preservar acessos e orientar atuação respeitosa, sem confronto."]),
       ("08_comunicacao_de_crise","Comunicação de crise",["Informação inicial: horário, local, fato e impacto conhecido. Compartilhar antes que a ocorrência vire notícia ou post.","Resposta e apoio: medidas adotadas, atendimento em andamento e apoio necessário. Proteção e socorro seguem em paralelo.","Atualizações: fatos, decisões e condição de retomada. Separar confirmado do que falta verificar. Comunicação ao público e à imprensa segue o fluxo corporativo."])],
      None,"ATENÇÃO: comunicar o potencial de crise sem esperar a apuração completa."),
     ("Guarda Alta","O que a liderança precisa garantir",
      [("09_riscos_conhecidos","Riscos conhecidos",["Superintendência e Operações conhecem riscos, limitações e impactos. Presença em campo e equipes orientadas para reconhecer e reportar desvios."]),
       ("09_tratamento_articulado","Tratamento articulado",["Integrar Operações, Marketing e Financeiro. Antecipar recursos, acompanhar responsável e prazo e solicitar apoio regional quando necessário."]),
       ("09_solucao_confirmada","Solução confirmada",["Confirmar correção e liberação pelos responsáveis. Manter a regional informada sobre riscos não resolvidos e situações com potencial de crise."])],
      "Guarda alta é reconhecer o risco e agir antes que ele vire crise.",
      "Comunicar não encerra o tratamento: acompanhar até a solução confirmada.")]
def _ga_runs(par,sz=11):
    """'Lead: resto' vira lead em negrito; paragrafo sem lead curto fica normal."""
    if ": " in par:
        lead,rest=par.split(": ",1)
        if len(lead)<=28: return [(lead+": ",sz,TITLE,True),(rest,sz,INK,False)]
    return [(par,sz,INK,False)]
# 6 slides: abertura+recursos e comunicacao+lideranca dividem o slide (duas fileiras de cards)
_SL=[(_GA[1][0],_GA[1][1],[(_GA[1][2],4.6,13)],None,_GA[1][4]),
     (_GA[2][0],_GA[2][1],[(_GA[2][2],4.6,13)],None,_GA[2][4]),
     (_GA[3][0],_GA[3][1],[(_GA[3][2],3.45,13)],_GA[3][3],_GA[3][4]),
     (_GA[4][0],_GA[4][1],[(_GA[4][2],4.6,13)],None,_GA[4][4]),
     (_GA[5][0],_GA[5][1],[(_GA[5][2],4.6,13)],None,_GA[5][4]),
     ("Comunicação de crise e o que a liderança precisa garantir","Reconhecer o risco e agir antes que vire crise",
      [(_GA[6][2],2.95,11),(_GA[7][2],1.9,11)],None,
      "Comunicar o potencial de crise sem esperar a apuração — e acompanhar até a solução confirmada.")]
# ---- fatores de risco no periodo: slide ilustrado (3 fatores que se somam -> mais risco) ----
s=new_slide()
header(s,"Guarda Alta · riscos simultâneos","Três fatores que aumentam o risco ao mesmo tempo","3 min")
for _sh in s.shapes:
    if _sh.has_text_frame and _sh.text_frame.text.strip().startswith("Três fatores que aumentam"):
        for _p in _sh.text_frame.paragraphs:
            for _r in _p.runs: _r.font.size=Pt(24)
_FAT=[("02_mais_movimento","Mais movimento","Mais público, mais estoque, mais entregas e mais serviços no mesmo espaço e no mesmo horário.",
       ["Filas, docas e corredores no limite","Estoque extra em depósitos improvisados","Mais carga nos sistemas: energia, água, climatização"],TEAL),
      ("02_mais_equipes_novas","Mais equipes novas","Temporários e terceiros entram no shopping e nas lojas sem conhecer a rotina local.",
       ["Não sabem onde fica o registro, a saída, o rádio","Não sabem quem acionar nem como reportar","Orientar antes de começar e acompanhar em campo"],PETROLEO),
      ("02_risco_de_reducao_da_atencao","Redução da atenção","A rotina e o clima de festas afrouxam a vigilância justamente quando ela mais importa.",
       ["Procedimento pulado “só desta vez”","Desvio visto e não reportado","Supervisão presente em campo, não só no rádio"],AMBAR)]
_cw=3.71; _gap=0.3
for _i,(_ic,_tit,_desc,_pts,_cor) in enumerate(_FAT):
    _x=0.8+_i*(_cw+_gap)
    box(s,Inches(_x),Inches(1.85),Inches(_cw),Inches(3.55),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    accent(s,_x,1.85,_cw,_cor)
    # ilustracao: circulo grande com o icone
    _c=s.shapes.add_shape(MSO_SHAPE.OVAL,Inches(_x+0.3),Inches(2.05),Inches(0.8),Inches(0.8)); _c.fill.solid(); _c.fill.fore_color.rgb=_cor; _c.line.fill.background(); _c.shadow.inherit=False
    s.shapes.add_picture(base+f"guarda_alta/icons/{_ic}_w.png",Inches(_x+0.475),Inches(2.225),Inches(0.45),Inches(0.45))   # icone branco sobre o circulo
    text(s,Inches(_x+1.22),Inches(2.05),Inches(_cw-1.4),Inches(0.8),[[(_tit,16,TITLE,True)]],anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)
    text(s,Inches(_x+0.25),Inches(2.95),Inches(_cw-0.5),Inches(0.85),[[(_desc,11,INK,False)]],line_spacing=1.05)
    for _j,_p in enumerate(_pts):   # cada ponto tem espaco para 2 linhas (fonte do deck)
        _y=3.85+_j*0.5
        _d=s.shapes.add_shape(MSO_SHAPE.OVAL,Inches(_x+0.3),Inches(_y+0.18),Inches(0.14),Inches(0.14)); _d.fill.solid(); _d.fill.fore_color.rgb=_cor; _d.line.fill.background(); _d.shadow.inherit=False
        text(s,Inches(_x+0.5),Inches(_y),Inches(_cw-0.65),Inches(0.5),[[(_p,10,INK,False)]],anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)
# a soma: 3 fatores -> risco multiplicado
_sy=5.6
for _i,(_t,_cor) in enumerate([("mais movimento",TEAL),("mais gente nova",PETROLEO),("menos atenção",AMBAR)]):
    _x=0.8+_i*2.55
    _b=box(s,Inches(_x),Inches(_sy),Inches(2.2),Inches(0.5),fill=_cor,round_=True,rad=0.1)
    text(s,Inches(_x),Inches(_sy),Inches(2.2),Inches(0.5),[[(_t,12,WHITE,True)]],align=PP_ALIGN.CENTER,anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)
    if _i<2: text(s,Inches(_x+2.2),Inches(_sy),Inches(0.35),Inches(0.5),[[("+",20,TITLE,True)]],align=PP_ALIGN.CENTER,anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)
text(s,Inches(8.45),Inches(_sy),Inches(0.4),Inches(0.5),[[("=",20,TITLE,True)]],align=PP_ALIGN.CENTER,anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)
box(s,Inches(8.9),Inches(_sy-0.05),Inches(3.63),Inches(0.6),fill=CORAL,round_=True,rad=0.1)
text(s,Inches(8.9),Inches(_sy-0.05),Inches(3.63),Inches(0.6),[[("risco multiplicado na reta final",13,WHITE,True)]],align=PP_ALIGN.CENTER,anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)
band(s,6.35,0.82,None,[[("Os três chegam juntos no período de maior movimento. ",12,AMBAR,True),("Por isso: equipes preparadas antes, supervisão em campo e atenção redobrada a sistemas, acessos e rotinas.",12,AREIA,True)]])
s.notes_slide.notes_text_frame.text=("Guarda Alta 1/7 (~3 min). Tres fatores que aumentam o risco ao mesmo tempo no periodo de maior movimento. "
 "(1) Mais movimento: publico, estoque, entregas e servicos pressionam filas, docas, depositos e os sistemas do shopping. "
 "(2) Mais equipes novas: temporarios e terceiros nao conhecem a rotina local — nao sabem onde fica o registro, a saida, o radio, "
 "quem acionar; orientar antes de comecar e acompanhar a execucao em campo. (3) Reducao da atencao: a rotina e o clima de festas "
 "afrouxam a vigilancia — procedimento pulado, desvio visto e nao reportado; reforcar supervisao em campo. A soma dos tres multiplica "
 "o risco: por isso equipes preparadas e atencao redobrada a sistemas, acessos e rotinas.")
_fat=s
guarda=[_fat]
for _k,(_kick,_tit,_rows,_alerta,_resumo) in enumerate(_SL,start=1):
    s=new_slide()
    header(s,"Guarda Alta · "+_kick,_tit,("2 min" if _alerta else "3 min"))
    if len(_tit)>40:
        for _sh in s.shapes:
            if _sh.has_text_frame and _sh.text_frame.text.strip()==_tit:
                for _p in _sh.text_frame.paragraphs:
                    for _r in _p.runs: _r.font.size=Pt(24)
    _y=1.85 if len(_rows)==1 else 1.72
    for _cards,_ch,_fs in _rows:
        _n=len(_cards); _gap=0.3; _cw=(11.73-_gap*(_n-1))/_n
        for _i,(_ic,_ct,_body) in enumerate(_cards):
            _x=0.8+_i*(_cw+_gap)
            box(s,Inches(_x),Inches(_y),Inches(_cw),Inches(_ch),fill=CARD,line=CLINE,line_w=1.0,round_=True)
            accent(s,_x,_y,_cw,PETROLEO)
            s.shapes.add_picture(base+f"guarda_alta/icons/{_ic}.png",Inches(_x+0.22),Inches(_y+0.25),Inches(0.42),Inches(0.42))
            text(s,Inches(_x+0.75),Inches(_y+0.17),Inches(_cw-0.95),Inches(0.6),[[(_ct,14,TITLE,True)]],anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)
            _tb=text(s,Inches(_x+0.22),Inches(_y+0.85),Inches(_cw-0.44),Inches(_ch-0.95),[_ga_runs(p,_fs if _fs<13 else 11) for p in _body],space_after=2,line_spacing=1.0)
            if _fs<13:
                _tb.name="mini_ga"   # slides de duas fileiras: fonte fixa (nao escala)
                for _p in _tb.text_frame.paragraphs: _p.space_after=Pt(1)
        _y+=_ch+0.12
    if _alerta:
        box(s,Inches(0.8),Inches(_y+0.05),Inches(11.73),Inches(0.72),fill=AMBAR,round_=True)
        text(s,Inches(1.05),Inches(_y+0.05),Inches(11.2),Inches(0.72),[[(_alerta,11.5,VERDE,True)]],anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.05)
        _y+=0.9
    band(s,_y+0.06,min(0.72,7.42-(_y+0.06)),None,[[(_resumo,11.5,AREIA,True)]])
    s.notes_slide.notes_text_frame.text=(f"Guarda Alta {_k+1}/7 (~{2 if _alerta else 3} min). {_kick}: {_tit}. "+" ".join(f"{c[1]} — "+" ".join(c[2]) for _cards,_,_ in _rows for c in _cards)+(" "+_alerta if _alerta else "")+" Sintese: "+_resumo)
    guarda.append(s)
d_sprint=divider("Próximos passos · 3","Sprint final de resultados",None)
d_sprint.notes_slide.notes_text_frame.text="~15 min (17:15 – 17:30). Sprint final de resultados. Conteudo a cargo de quem conduz — inserir aqui os slides do sprint. Fecha com o recap das Guidelines 2026 (~5 min, ate 17:35)."

# ===================== BLOCO 4: PRÁTICAS DE IA DOS SHOPPINGS (logo depois do almoço) =====================
# 7 cases de 4 shoppings (consolidação executiva para a Diretoria). Cada case: 1 slide do case + 3 slides de contexto a preencher.
CASES_IA=[
 ("Shopping Del Rey","Auditoria de CFOPs",
  "Criamos um agente no Copilot para analisar CFOPs, identificar divergências, códigos ausentes e duplicidades, comparando as lojas conforme a matriz de classificação fiscal de forma automatizada.",
  "Redução de tempo na análise dos livros fiscais (CFOP), redução de erro humano na apuração e mais produtividade do time em outros processos — inclusive na cobrança de livros e das dispersões encontradas.",
  [("Tempo","↓"),("Compliance","↑")]),
 ("Shopping Tijuca","Auditoria de Boletos",
  "Sistema de auditoria de boletos apoiado por IA.",
  "Identifica erros de faturamento e evita perdas de receita.",
  [("Receita protegida","↑"),("Controle","↑")]),
 ("Mooca Plaza","Simulador de Laudo",
  "Simulador de laudo prévio para nos anteciparmos nas negociações comerciais de renovação, identificando aluguéis sensíveis e quais margens temos para buscar incremento.",
  "Antecedência de dados para negociar com operações que têm prazo para ação renovatória, sem precisar, num primeiro momento, contratar o laudo prévio de assistentes técnicos — que gira em torno de R$ 4 mil por laudo.",
  [("Custos","↓"),("Receita potencial","↑")]),
 ("Mooca Plaza","Programa de Benefícios com IA",
  "Processo integrado de IA (Copilot, Agente de Benefícios ALLOS e Gemini) para automatizar a estruturação, a análise e a apresentação dos dados do Programa de Benefícios.",
  "Reduz muito o tempo para investigar indicadores, analisar grandes volumes de dados e gerar diagnósticos estratégicos, aumentando a produtividade e apoiando decisões mais rápidas.",
  [("Análises automatizadas","↑"),("Tempo de diagnóstico","↓"),("Produtividade","↑"),("Decisão","↑")]),
 ("Plaza Niterói","CRM Comercialização",
  "Painel comercial gerado por IA que transforma a exportação semanal do Planner em um dashboard completo (desktop e mobile), sem trabalho manual. Toda semana mostra o funil por temperatura, o pipeline por ponto vago e por executivo, o planejamento de marcas prioritárias, os alertas de prazo, a evolução histórica e as novidades e conquistas da semana.",
  "Montar relatórios, bullets e dashboards consumia horas dos executivos e gestores e dependia de consolidação manual a cada nível da hierarquia. Hoje o processo é automatizado e o tempo vai para direcionar o foco, antecipar riscos, evidenciar avanços e decidir. O fluxo padronizado — Planner, IA e dashboard — é replicável em qualquer shopping com a mesma estrutura de buckets e rótulos.",
  [("Automação","↑"),("Tempo","↓")]),
 ("Plaza Niterói","Comercial em Movimento",
  "Sistema de inteligência de prospecção construído com IA (SRIS 3.0) que monta uma base de operações que ainda não estão no Plaza e têm perfil para virar lojistas. A IA pesquisa a web por um protocolo fixo — descoberta, qualificação, checagem de que a marca não está no Plaza e enriquecimento com fonte, contato e sócios quando públicos. Cada lead recebe score de 0 a 100; junto vêm o Top 20 com tese de abordagem, o gap de mix, os clusters geográficos e o playbook por perfil.",
  "Antes, o executivo garimpava no Google, no Instagram e na rua para descobrir quem poderia vir — um processo lento, dependente de quem fazia e sem critério comum para priorizar. Agora recebe a base pronta, ranqueada e com a abordagem sugerida, e o tempo vai para ligar, visitar e negociar. Cada dado traz a fonte e nada é inventado, então o time pode confiar no que recebe.",
  [("Leads","↑"),("Velocidade","↑")]),
 ("Plaza Niterói","Controle de Exaustão",
  "Ferramenta que integra vistorias em aplicativo, registros centralizados e dashboard gerencial para acompanhar o nível de gordura e as condições dos equipamentos de exaustão: medições de espessura, fotos e pendências de limpeza e manutenção, com classificação de risco e acompanhamento até a resolução. Alertas automáticos no Teams para risco nível 4 e nova comunicação após a regularização.",
  "Hoje as informações ficam espalhadas entre planilhas, fotos e mensagens e exigem consolidação manual. A solução mostra quais operações precisam de limpeza ou manutenção e quais riscos têm prioridade; o histórico apoia a identificação de reincidências e o ajuste da frequência das limpezas. Objetivo: menos trabalho manual e mais prevenção de incêndios e falhas que comprometam a segurança e a continuidade das operações.",
  [("Segurança","↑"),("Risco","↓")]),
]
CASES_IA=[_c for _c in CASES_IA if _c[1]!="Controle de Exaustão"]   # case 7 oculto na versao final
NCASE=len(CASES_IA)
d1=divider("Bloco 4","Práticas de IA dos shoppings",
           f"{NCASE} cases de 4 shoppings — {CASE_MIN} minutos por case. O que funciona em uma praça vira padrão nas outras.")
d1.notes_slide.notes_text_frame.text=(f"Bloco 4 (13:20 – 14:30, 70 min). {NCASE} cases de IA trazidos pelos shoppings, 10 min cada: "
 "o slide do case e tres slides de contexto que o proprio shopping preenche. Alguns shoppings trouxeram mais de um case; "
 "quem nao trouxe participa das perguntas e sai com a lista do que pode replicar.")
# ordem de apresentação
s=new_slide()
header(s,"Bloco 4 · práticas de IA",f"Ordem de apresentação — {CASE_MIN} min por case",f"{15 if V90 else NCASE*CASE_MIN} min")
_RW=5.75; _colx=[0.8,6.78]; _per=(NCASE+1)//2
for k,(shp,nome,_,_,_) in enumerate(CASES_IA):
    x=_colx[k//_per]; y=1.95+(k%_per)*0.98
    box(s,Inches(x),Inches(y),Inches(_RW),Inches(0.82),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    nb=box(s,Inches(x+0.15),Inches(y+0.16),Inches(0.5),Inches(0.5),fill=PETROLEO,round_=True)
    nf=nb.text_frame; nf.word_wrap=False; nf.vertical_anchor=MSO_ANCHOR.MIDDLE; npp=nf.paragraphs[0]; npp.alignment=PP_ALIGN.CENTER
    nr=npp.add_run(); nr.text=str(k+1); nr.font.size=Pt(16); nr.font.bold=True; nr.font.color.rgb=WHITE; nr.font.name=FONT
    text(s,Inches(x+0.8),Inches(y+0.06),Inches(3.85),Inches(0.36),[[(nome,13.5,TITLE,True)]],line_spacing=1.0,space_after=0)
    text(s,Inches(x+0.8),Inches(y+0.43),Inches(3.85),Inches(0.32),[[(shp,11,TEAL,True)]],line_spacing=1.0,space_after=0)
    cc=box(s,Inches(x+4.75),Inches(y+0.22),Inches(0.85),Inches(0.4),fill=AREIA,line=CLINE,round_=True)
    cpf=cc.text_frame; cpf.vertical_anchor=MSO_ANCHOR.MIDDLE; cpp=cpf.paragraphs[0]; cpp.alignment=PP_ALIGN.CENTER
    crr=cpp.add_run(); crr.text=f"{CASE_MIN} min"; crr.font.size=Pt(11); crr.font.bold=True; crr.font.color.rgb=VERDE; crr.font.name=FONT
if NCASE%2:   # celula livre da 2a coluna: quem nao trouxe case
    x=_colx[1]; y=1.95+(_per-1)*0.98
    box(s,Inches(x),Inches(y),Inches(_RW),Inches(0.82),fill=CARD,line=AMBAR,line_w=1.0,round_=True)
    text(s,Inches(x+0.25),Inches(y),Inches(_RW-0.5),Inches(0.82),
         [[("Quem não trouxe case: ",11.5,TITLE,True),("participa das perguntas e sai com o que pode replicar.",11.5,INK,False)]],anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)
band(s,6.0,0.95,None,[[(("Nesta versão: " if V90 else "Cada case: "),12.5,AMBAR,True),(("só o slide de cada case, 2 min — o contexto completo fica no material regional." if V90 else "o slide do case (solução, dor e KPIs) + os slides de contexto preenchidos pelo próprio shopping."),12.5,AREIA,True)],
                        [("Prints sempre com dados fictícios ou anonimizados.",11,BEGE,False)]])
s.notes_slide.notes_text_frame.text=(f"Ordem de apresentacao dos {NCASE} cases, 10 min cada = {NCASE*10} min (13:20 – 14:30). "
 "Del Rey, Tijuca, Mooca Plaza (2 cases) e Plaza Niteroi (3 cases). Ajustar a ordem se combinado com os shoppings.")
ordem=s
# formato sugerido
s=new_slide()
header(s,"Bloco 4 · formato","Formato de cada case: 10 minutos","10 min")
card(s,0.8,1.95,5.75,2.35,TEAL,"1 · O case (2 min)","", "Slide do case: a solução, a dor que resolve e os KPIs. Já vem pronto.")
card(s,6.78,1.95,5.75,2.35,PETROLEO,"2 · Como funciona (3 min)","", "Contexto 1 e 2: o fluxo — de onde vêm os dados, o que a IA faz, o que sai no fim — e um exemplo na tela.")
card(s,0.8,4.45,5.75,2.35,AMBAR,"3 · Resultados e como replicar (3 min)","", "Contexto 3: números de antes e depois, aprendizados e o que outro shopping precisa para replicar.")
card(s,6.78,4.45,5.75,2.35,MENTA,"4 · Perguntas (2 min)","", "Espaço curto para dúvidas e trocas com os outros shoppings.")
s.notes_slide.notes_text_frame.text=("Formato de 10 min por case: 1 slide do case (pronto) + 3 slides de contexto preenchidos pelo shopping. "
 "Prints e exemplos sempre com dados ficticios ou anonimizados.")
formato=s

def _caso_slide(k,shp,nome,sol,dor,kpis):
    s=new_slide()
    header(s,f"Bloco 4 · case {k}/{NCASE} · {shp}",nome,"10 min")
    W1=4.5; W3=2.33; G=0.2; y=1.85; h=5.1
    for i,(acc,tit,corpo) in enumerate([(TEAL,"QUAL A SOLUÇÃO?",sol),(PETROLEO,"DOR QUE RESOLVE?",dor)]):
        x=0.8+i*(W1+G); _sz=18 if len(corpo)<130 else 16 if len(corpo)<330 else 14
        box(s,Inches(x),Inches(y),Inches(W1),Inches(h),fill=CARD,line=CLINE,line_w=1.0,round_=True)
        accent(s,x,y,W1,acc)
        text(s,Inches(x+0.22),Inches(y+0.22),Inches(W1-0.44),Inches(0.4),[[(tit,13,acc,True)]],line_spacing=1.0)
        _t=text(s,Inches(x+0.22),Inches(y+0.7),Inches(W1-0.44),Inches(h-0.84),[[(corpo,_sz,INK,False)]],line_spacing=1.08)
    x=0.8+2*(W1+G)
    box(s,Inches(x),Inches(y),Inches(W3),Inches(h),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    accent(s,x,y,W3,AMBAR)
    text(s,Inches(x+0.2),Inches(y+0.22),Inches(W3-0.4),Inches(0.4),[[("KPIs EXECUTIVOS",13,AMBAR,True)]],line_spacing=1.0)
    for j,(kp,seta) in enumerate(kpis):
        yy=y+0.75+j*0.78
        c=box(s,Inches(x+0.18),Inches(yy),Inches(W3-0.36),Inches(0.62),fill=WHITE,line=CLINE,line_w=0.75,round_=True,rad=0.08)
        text(s,Inches(x+0.28),Inches(yy),Inches(W3-0.95),Inches(0.62),[[(kp,11.5,TITLE,True)]],anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)
        # seta desenhada (a fonte do deck nao tem os glifos de seta): sobe = verde-agua, desce = petroleo
        _ar=s.shapes.add_shape(MSO_SHAPE.UP_ARROW if seta=="↑" else MSO_SHAPE.DOWN_ARROW,Inches(x+W3-0.58),Inches(yy+0.14),Inches(0.26),Inches(0.34))
        _ar.fill.solid(); _ar.fill.fore_color.rgb=(TEAL if seta=="↑" else PETROLEO); _ar.line.fill.background(); _ar.shadow.inherit=False
    s.notes_slide.notes_text_frame.text=(f"Case {k}/{NCASE} — {shp} | {nome} (10 min no total: este slide + 3 de contexto). "
        f"Solucao: {sol} Dor: {dor} KPIs: "+", ".join(f"{a} {b}" for a,b in kpis)+".")
    return s
_CTX=[("Como funciona",
       ["De onde vêm os dados e em que formato","O que a IA faz — ferramenta, agente ou prompt usado","O que sai no fim: relatório, painel, alerta ou planilha"],
       "Fluxo ou print da ferramenta"),
      ("Na prática",
       ["Uma tela, um relatório ou um antes e depois real","Quem usa, com que frequência e em que rotina","O que ainda é feito por pessoas — a decisão é humana"],
       "Exemplo na tela (dados fictícios ou anonimizados)"),
      ("Resultados e como replicar",
       ["Números: tempo, custo, receita ou risco, antes e depois","Aprendizados: o que funcionou e o que mudaria","O que outro shopping precisa para replicar"],
       "Gráfico, números ou checklist de replicação")]
def _ctx_slide(k,shp,nome,j):
    tit,itens,ph=_CTX[j-1]
    s=new_slide()
    header(s,f"Bloco 4 · case {k}/{NCASE} · {shp} · contexto {j}/3",f"{nome} — {tit.lower()}")
    # area da imagem (tracejada) + coluna com o roteiro
    from pptx.enum.dml import MSO_LINE_DASH_STYLE
    ph_box=box(s,Inches(0.8),Inches(1.85),Inches(7.6),Inches(5.1),fill=WHITE,line=BEGE,line_w=1.5,round_=True,rad=0.08)
    ph_box.line.dash_style=MSO_LINE_DASH_STYLE.DASH
    chip=box(s,Inches(1.05),Inches(2.07),Inches(3.45),Inches(0.42),fill=AMBAR,round_=True)
    cf=chip.text_frame; cf.vertical_anchor=MSO_ANCHOR.MIDDLE; cp=cf.paragraphs[0]; cp.alignment=PP_ALIGN.CENTER
    cr=cp.add_run(); cr.text="A PREENCHER PELO SHOPPING"; cr.font.size=Pt(10.5); cr.font.bold=True; cr.font.color.rgb=VERDE; cr.font.name=FONT
    text(s,Inches(1.05),Inches(3.6),Inches(7.1),Inches(1.2),[[(ph,16,SUB,True)],[("cole aqui a imagem e apague este texto",12,BEGE,False)]],align=PP_ALIGN.CENTER,anchor=MSO_ANCHOR.MIDDLE)
    x=8.6; w=3.93
    box(s,Inches(x),Inches(1.85),Inches(w),Inches(5.1),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    accent(s,x,1.85,w,[TEAL,PETROLEO,AMBAR][j-1])
    text(s,Inches(x+0.22),Inches(2.07),Inches(w-0.44),Inches(0.4),[[("O QUE MOSTRAR",13,TEAL,True)]],line_spacing=1.0)
    for i,it in enumerate(itens):
        yy=2.65+i*1.05
        _d=s.shapes.add_shape(MSO_SHAPE.OVAL,Inches(x+0.25),Inches(yy+0.1),Inches(0.14),Inches(0.14)); _d.fill.solid(); _d.fill.fore_color.rgb=[TEAL,PETROLEO,AMBAR][j-1]; _d.line.fill.background(); _d.shadow.inherit=False
        text(s,Inches(x+0.5),Inches(yy),Inches(w-0.7),Inches(0.95),[[(it,12,INK,False)]],line_spacing=1.05)
    text(s,Inches(x+0.22),Inches(6.0),Inches(w-0.44),Inches(0.8),[[("Substitua os tópicos pelo conteúdo do case ou apague esta coluna.",10,SUB,False)]],line_spacing=1.0)
    s.notes_slide.notes_text_frame.text=(f"Case {k}/{NCASE} — {shp} | {nome}: contexto {j}/3 ({tit}). Slide a preencher pelo shopping. "
        "Usar apenas dados ficticios ou anonimizados nos prints.")
    return s
# os slides de case agora vem preenchidos pelos shoppings (PDF "incluir"); _caso_slide/_ctx_slide ficam como modelo
casos_sl=[]

# ===================== CONCEITOS: divider =====================
d2=divider("Bloco 1","IA na prática","Os conceitos que sustentam tudo: do chat aos agentes, modelos, conectores, harness & loop e uso seguro.")
for _k,(_ic,_tx) in enumerate([("i","Todo este treinamento foi feito utilizando IA."),
                                ("!","Consulte a política da empresa antes de usar.")]):
    _y=5.95+_k*0.48
    _c=d2.shapes.add_shape(MSO_SHAPE.OVAL,Inches(0.9),Inches(_y),Inches(0.34),Inches(0.34))
    _c.fill.solid(); _c.fill.fore_color.rgb=AMBAR; _c.line.fill.background(); _c.shadow.inherit=False
    _cf=_c.text_frame; _cf.margin_left=_cf.margin_right=_cf.margin_top=_cf.margin_bottom=0; _cf.vertical_anchor=MSO_ANCHOR.MIDDLE
    _cp=_cf.paragraphs[0]; _cp.alignment=PP_ALIGN.CENTER; _cr=_cp.add_run(); _cr.text=_ic
    _cr.font.size=Pt(12); _cr.font.bold=True; _cr.font.color.rgb=VERDE; _cr.font.name=FONT
    text(d2,Inches(1.4),Inches(_y-0.04),Inches(9.0),Inches(0.42),[[(_tx,13,AREIA,True)]],anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)
d2.notes_slide.notes_text_frame.text=("Abrir o bloco com os dois avisos: todo este material foi feito com IA (e revisado por pessoas), e "
 "cada um deve consultar a politica da empresa antes de usar qualquer ferramenta de IA no trabalho.")

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

# ---- Ferramentas: um Claude só (conversa + agente, com Docs/Slides/Design) e o Claude Code ----
s=new_slide()
header(s,"Prática · Ferramentas","Um Claude só — e o Code quando vira sistema","3 min")
cols=[("CLAUDE", TEAL, "conversa e agente juntos",
       "Da pergunta rápida à tarefa longa: você pede, ele decide quanto trabalhar — com seus arquivos, conectores e skills.",
       "resumir um relatório agora; ou pedir o fechamento da semana, fechar o notebook e receber o aviso quando ficar pronto.",
       ("chatgpt (+ work)","copilot chat · m365 copilot"), "NOVO · 16/SET"),
      ("DOCS · SLIDES · DESIGN", PETROLEO, "entregáveis na conversa",
       "Documento, apresentação e design editáveis, num link só — baixe em PowerPoint ou PDF e apresente direto do Claude.",
       "o deck das práticas do seu shopping, a carta ao lojista, o layout da campanha — para o time revisar e ajustar.",
       ("chatgpt work","copilot no word e powerpoint"), "BETA · PAGOS"),
      ("CLAUDE CODE", AMBAR, "o Claude no ambiente técnico",
       "Cria e altera software — automações, integrações e sistemas.",
       "construir os apps Shopping Inteligente (Radar de Varejo, de Mídia, Obras, Dispersão de Vendas) e ligá-los aos dados.",
       ("codex","github copilot"), None)]
CW,CH,CY=3.71,4.12,1.95
for i,(name,acc,oque,melhor,exemplo,_eq,_tag) in enumerate(cols):
    x=0.8+i*(CW+0.3)
    box(s,Inches(x),Inches(CY),Inches(CW),Inches(CH),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    accent(s,x,CY,CW,acc)
    text(s,Inches(x+0.25),Inches(CY+0.25),Inches(CW-0.5),Inches(0.45),[[(name,(14.5 if i==1 else 17),TITLE,True)]])
    if _tag:   # etiqueta do que e novo (nao escala com o telao: tamanho fixo)
        _tg=box(s,Inches(x+CW-1.42),Inches(CY+0.76),Inches(1.2),Inches(0.27),fill=(VERDE if i==0 else PETROLEO),round_=True,rad=0.08)
        _tp=_tg.text_frame; _tp.margin_left=_tp.margin_right=Pt(2); _tp.margin_top=_tp.margin_bottom=0; _tp.vertical_anchor=MSO_ANCHOR.MIDDLE
        _pp=_tp.paragraphs[0]; _pp.alignment=PP_ALIGN.CENTER; _rr=_pp.add_run(); _rr.text=_tag
        _rr.font.size=Pt(8.5); _rr.font.bold=True; _rr.font.color.rgb=WHITE; _rr.font.name=FONT; _tg.name="mini_tag"
    text(s,Inches(x+0.25),Inches(CY+0.7),Inches(CW-0.5-(1.3 if _tag else 0)),Inches(0.5),[[(oque,11.5,TEAL,True)]],line_spacing=1.0)
    text(s,Inches(x+0.25),Inches(CY+1.2),Inches(CW-0.5),Inches(1.5),
         [[("MELHOR PARA",10.5,VERDE,True)],[(melhor,12,INK,False)]],space_after=3,line_spacing=1.08)
    text(s,Inches(x+0.25),Inches(CY+2.72),Inches(CW-0.5),Inches(1.38),
         [[("NO SHOPPING",10.5,PETROLEO,True)],[(exemplo,12,INK,False)]],space_after=3,line_spacing=1.08)
    _m=text(s,Inches(x+0.1),Inches(CY+CH+0.0),Inches(CW-0.2),Inches(0.4),
            [[("openai: ",9.5,SUB,False),(_eq[0],9.5,SUB,True)],[("microsoft: ",9.5,SUB,False),(_eq[1],9.5,SUB,True)]],line_spacing=1.0,space_after=0); _m.name="mini_eq"
box(s,Inches(0.8),Inches(6.5),Inches(11.73),Inches(0.6),fill=PETROLEO,round_=True)
text(s,Inches(1.0),Inches(6.52),Inches(11.4),Inches(0.55),
     [[("Comece pela conversa. ",12.5,AREIA,True),("Tarefa longa?",12.5,AMBAR,True),
       (" Entregue e siga o dia — ele avisa. ",12.5,AREIA,True),("Virou sistema?",12.5,AMBAR,True),
       (" Code.",12.5,AREIA,True)]],
     anchor=MSO_ANCHOR.MIDDLE)
s.notes_slide.notes_text_frame.text=("~3 min. Desde 16/set/2026 Chat e Cowork sao um so: nao se escolhe mais 'onde' a tarefa vai — voce pede, "
 "e o Claude decide se responde na hora ou assume um trabalho longo, em segundo plano (da para fechar o notebook e "
 "acompanhar pelo celular), com os arquivos, conectores e skills que ja estavam na conta. Por padrao ele pergunta antes "
 "de agir; da para deixar seguir e so interromper no que exige decisao. Tarefas podem ser agendadas (ex.: relatorio semanal). "
 "Docs, Slides e Design nascem dentro da conversa (beta nos planos pagos; no Enterprise o admin liga). Chegou primeiro a "
 "Pro e Max; Team e Free na sequencia; Enterprise com 30 dias de aviso. O Claude Code segue separado, para o que vira "
 "sistema — foi onde os apps do Shopping Inteligente nasceram. Equivalentes na OpenAI: ChatGPT + ChatGPT Work (o agente "
 "de entregaveis) e Codex (codigo). Na Microsoft: Copilot Chat / Microsoft 365 Copilot (conversa e agentes como o Researcher), "
 "Copilot dentro do Word, PowerPoint e Excel (entregaveis) e GitHub Copilot (codigo). O Copilot usa modelos da OpenAI e tambem da "
 "Anthropic (Claude) — na Allos e a porta de entrada mais comum, por ja estar no Office.")
ferr=s

# ---- O que mudou nos últimos meses: Claude x ChatGPT (linha do tempo) ----
s=new_slide()
header(s,"Prática · Ferramentas · últimos meses","O que mudou no Claude e no ChatGPT","2 min")
TL=[("CLAUDE",AMBAR,[
      ("01/set","Fable 5.1","o modelo mais capaz da família, liberado na API e nas nuvens."),
      ("16/set","Chat + Cowork = um Claude","Docs, Slides e Design em qualquer conversa; trabalho em segundo plano e tarefas agendadas."),
      ("22/set","Opus 5.5","faz o trabalho do Fable 5.1 na maioria dos casos, 40% mais barato que o Opus 5; pensa sempre."),
      ("25/set","Diretório de plugins","portal para publicar skills e plugins, com revisão e uso medido."),
      ("28/set","Sonnet 5.5","30% mais rápido e até 30% mais barato que o Sonnet 5 — o modelo do dia a dia."),
      ("07/out","Haiku 5.5","o pequeno mais rápido e barato; Max e Team ganham créditos mensais de API.")]),
    ("CHATGPT",TEAL,[
      ("09/jul","ChatGPT Work","o “Cowork” da OpenAI: de um objetivo a planilhas, docs, slides e sites."),
      ("22/set","GPT-6 Sol e Luna","no ChatGPT Work e no Codex; Astra no topo, o melhor em uso de computador."),
      ("07/out","GPT-6 para todos","Sol nos planos pagos, Luna no grátis; “Intelligent UI”: visuais e mini-apps na resposta."),
      ("set/out","Thinking = esforço","Instante · Médio · Alto · Extra alto; Pro roda no Astra.")])]
for c,(nome,cor,rows) in enumerate(TL):
    x=0.8+c*(5.75+0.23)
    box(s,Inches(x),Inches(1.78),Inches(5.75),Inches(0.4),fill=cor,round_=True,rad=0.08)
    text(s,Inches(x),Inches(1.78),Inches(5.75),Inches(0.4),[[(nome,12,WHITE,True)]],align=PP_ALIGN.CENTER,anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)
    for r,(dt,tit,desc) in enumerate(rows):
        y=2.3+r*0.79
        box(s,Inches(x),Inches(y),Inches(5.75),Inches(0.72),fill=CARD,line=CLINE,line_w=0.8,round_=True,rad=0.1)
        text(s,Inches(x+0.12),Inches(y),Inches(0.78),Inches(0.72),[[(dt,10.5,VERDE,True)]],anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)
        text(s,Inches(x+0.92),Inches(y+0.04),Inches(4.7),Inches(0.66),
             [[(tit,11.5,TITLE,True)],[(desc,9.5,INK,False)]],space_after=1,line_spacing=1.0)
    if c==1:   # o espaco que sobra na coluna do ChatGPT: a leitura
        _y=2.3+len(rows)*0.79+0.05
        box(s,Inches(x),Inches(_y),Inches(5.75),Inches(7.05-_y-0.1),fill=AREIA,line=CLINE,line_w=1.0,round_=True)
        accent(s,x,_y,5.75,AMBAR)
        text(s,Inches(x+0.2),Inches(_y+0.18),Inches(5.35),Inches(7.05-_y-0.4),
             [[("A LEITURA",10.5,TITLE,True)],
              [("Os dois seguem o mesmo roteiro: um app só para conversar e delegar, uma família de modelos por tamanho e um nível de esforço para regular quanto pensar.",11,INK,False)]],
             space_after=3,line_spacing=1.06)
_m=text(s,Inches(0.8),Inches(7.08),Inches(11.73),Inches(0.26),
        [[("Conferido em 8/out/2026 (notas de versão do Claude, claude.com, ajuda da OpenAI, 9to5Mac). Muda todo mês: atualize antes de cada turma.",9,SUB,False)]],line_spacing=1.0); _m.name="mini_fonte"
s.notes_slide.notes_text_frame.text=("~2 min. Linha do tempo dos ultimos meses, lado a lado. Claude: Fable 5.1 (1/set), Chat+Cowork viram um app com Docs, "
 "Slides e Design (16/set), Opus 5.5 (22/set), diretorio de plugins (25/set), Sonnet 5.5 (28/set), Haiku 5.5 e creditos de API "
 "nos planos Max e Team (7/out). ChatGPT: ChatGPT Work (jul), GPT-6 Sol/Luna no Work e no Codex (22/set), GPT-6 para todos "
 "com Intelligent UI (7/out) e o controle Thinking, que e o equivalente ao esforco. Leitura: os dois convergem para o mesmo "
 "desenho — um app, familias de modelos, nivel de esforco. Fontes conferidas em 8/out/2026; atualizar antes de cada turma.")
novidades=s

# ---- (Ferramentas chat/cowork/code = reaproveitado) ----

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
def app_video(kicker,title,legenda,notes):
    s=new_slide()
    header(s,kicker,title,"~4 min")
    PX,PY,PW,PH=0.8,2.05,11.73,4.55
    box(s,Inches(PX),Inches(PY),Inches(PW),Inches(PH),fill=DARK,line=PETROLEO,line_w=1.4,round_=True)
    accent(s,PX,PY,PW,AMBAR)
    cx=PX+PW/2; cyd=1.55; cyt=PY+0.9
    circ=s.shapes.add_shape(MSO_SHAPE.OVAL,Inches(cx-cyd/2),Inches(cyt),Inches(cyd),Inches(cyd))
    circ.fill.solid(); circ.fill.fore_color.rgb=CORAL; circ.line.color.rgb=AREIA; circ.line.width=Pt(2); circ.shadow.inherit=False
    tri=s.shapes.add_shape(MSO_SHAPE.ISOSCELES_TRIANGLE,Inches(cx-0.24),Inches(cyt+0.42),Inches(0.62),Inches(0.72))
    tri.rotation=90; tri.fill.solid(); tri.fill.fore_color.rgb=WHITE; tri.line.fill.background(); tri.shadow.inherit=False
    text(s,Inches(PX+0.5),Inches(cyt+cyd+0.16),Inches(PW-1.0),Inches(0.5),
         [[("VÍDEO PASSO A PASSO  ·  ~4 MIN",15,AMBAR,True)]],align=PP_ALIGN.CENTER)
    text(s,Inches(PX+1.2),Inches(cyt+cyd+0.68),Inches(PW-2.4),Inches(1.0),
         [[(legenda,15,ONDARK,False)]],align=PP_ALIGN.CENTER,line_spacing=1.12)
    s.notes_slide.notes_text_frame.text=notes
    return s
app1=app_origin("Como os apps nasceram · 1","Radar de Varejo — do prompt ao app","ws_quiosque.png","ws_quiosque_app.png",
    "Triagem e seleção de operações de varejo — loja satélite ou quiosque. Faz as perguntas certas ao "
    "investidor (capacidade de investimento, capital de giro, tempo dedicado, experiência) para definir "
    "marca e segmento. Cruza o interesse com a base de marcas da ABF e das PMEs, valida o matching e "
    "cruza com o mix planejado do shopping.",
    "É a ferramenta que o time de Negócios vai testar no bloco 3.")
app2=app_origin("Como os apps nasceram · 2","Radar de Mídia (Helloo) — do prompt ao app","ws_midia.png","ws_midia_app.png",
    "Triagem e seleção de oferta de mídia. Pergunta ao anunciante (investimento, intenção, público-alvo, "
    "tempo, segmento) e cruza com a base de propriedades (totens, megabanners, testeiras, túneis, app do "
    "relacionamento, Venda Certa, patrocínio de eventos e espaços), achando a propriedade mais adequada.",
    "É a ferramenta que o time de Marketing vai testar no bloco 3.")
app3=app_origin("Como os apps nasceram · 3","Otimizador de Obras — do prompt ao app","ws_obras.png","ws_obras_app.png",
    "Triagem e seleção de fornecedores para obras. Pergunta ao lojista (tamanho, padrão, materiais, "
    "investimento, experiência) e cruza com a base de fornecedores (engenharia, materiais, segurança e "
    "regularização), achando quem faz a obra no menor tempo e custo, com segurança.",
    "É a ferramenta que o time de Operações vai testar no bloco 3.")
app4=app_origin("Como os apps nasceram · 4","Radar de Dispersão de Vendas — do prompt ao app","ws_fiscal.png","ws_rdv_app.png",
    "Auditoria de vendas fiscais. Lê os livros fiscais (PDF, foto, Excel, TXT/SPED, CSV), separa os códigos "
    "de entradas e saídas e apura a venda real por CNPJ — cruzando com as vendas informadas na planilha para "
    "achar divergências. No Simples Nacional, usa o extrato PGDAS-D como referência.",
    "É a outra ferramenta que o time de Negócios vai testar no bloco 3.")
# ---- vídeos passo a passo (um após cada app, ~4 min cada) ----
av1=app_video("Passo a passo · 1","Radar de Varejo — vídeo passo a passo",
    "Do perfil do investidor à recomendação: as perguntas de triagem, o cruzamento com a base de marcas (ABF e PMEs) e a leitura do match com o mix planejado do shopping.",
    "~4 min. Video passo a passo do Radar de Varejo, do login a recomendacao. Deixe o time acompanhar o fluxo antes de rodar no bloco 3.")
av2=app_video("Passo a passo · 2","Radar de Mídia (Helloo) — vídeo passo a passo",
    "Do briefing do anunciante à propriedade recomendada: público, verba e intenção cruzados com o inventário de mídia (totens, megabanners, testeiras, túneis, Venda Certa e eventos).",
    "~4 min. Video passo a passo do Radar de Midia, do briefing a propriedade recomendada. Base para o time de Marketing no bloco 3.")
av3=app_video("Passo a passo · 3","Otimizador de Obras — vídeo passo a passo",
    "Do escopo da obra à shortlist de fornecedores: padrão, materiais, prazo e investimento cruzados com a base de engenharia, materiais, segurança e regularização.",
    "~4 min. Video passo a passo do Otimizador de Obras, do escopo a shortlist de fornecedores. Base para o time de Operacoes no bloco 3.")
av4=app_video("Passo a passo · 4","Radar de Dispersão de Vendas — vídeo passo a passo",
    "Do upload dos livros fiscais à apuração por CNPJ: leitura de PDF/foto/SPED/planilha, separação de entradas e saídas e o destaque das divergências frente às vendas informadas.",
    "~4 min. Video passo a passo do Radar de Dispersão de Vendas, do upload dos livros a apuracao por CNPJ e as divergencias.")

# ---- O mercado: os assistentes de IA mais usados (antes dos modelos da Anthropic) ----
s=new_slide()
header(s,"Conceitos · Modelos · o mercado","Os assistentes de IA mais usados hoje","2 min")
mercado=[("ChatGPT","OpenAI",TEAL,"o mais usado; GPT-6 para todos desde 7/out — chat, ChatGPT Work, Codex, imagem, voz e Intelligent UI","muitos modelos e planos confundem; respostas às vezes genéricas"),
         ("Gemini","Google",PETROLEO,"integrado a Gmail, Drive e Docs; forte com imagem, vídeo e textos longos","rende mais para quem já vive no Google Workspace"),
         ("Claude","Anthropic",AMBAR,"um app só (conversa + agente) com Docs, Slides e Design; Code para sistemas; família 5.5 e Fable 5.1","não gera imagens; limites de uso por plano"),
         ("Grok","xAI",CORAL,"atualidades em tempo real pelo X; tom mais solto","filtros mais frouxos — cuidado no uso corporativo"),
         ("Muse","Meta",MENTA,"agente pessoal que age em sites e apps: reserva, compra, preenche formulários","lançado em set/2026; pede acesso amplo às suas contas"),
         ("Copilot","Microsoft",TEAL,"dentro de Word, Excel, Outlook e Teams, com os arquivos da empresa","depende da licença Microsoft 365; qualidade varia por app"),
         ("DeepSeek","DeepSeek",PETROLEO,"modelos abertos e baratos, bom raciocínio","dados vão para servidores na China — nada de dado da empresa")]
MX=0.8; NW=2.15; FW=5.1; AW_=11.73-NW-FW
text(s,Inches(MX+NW+0.1),Inches(1.72),Inches(FW),Inches(0.3),[[("FORTE EM",11,PETROLEO,True)]],line_spacing=1.0)
text(s,Inches(MX+NW+FW+0.1),Inches(1.72),Inches(AW_),Inches(0.3),[[("ATENÇÃO",11,CORAL,True)]],line_spacing=1.0)
for k,(nome,dono,cor,forte,atencao) in enumerate(mercado):
    y=2.05+k*0.62
    box(s,Inches(MX),Inches(y),Inches(11.73),Inches(0.55),fill=(CARD if k%2==0 else WHITE),line=CLINE,line_w=0.75,round_=True,rad=0.08)
    box(s,Inches(MX),Inches(y+0.1),Inches(0.08),Inches(0.35),fill=cor,round_=True)
    text(s,Inches(MX+0.18),Inches(y),Inches(NW-0.2),Inches(0.55),[[(nome,13,TITLE,True),("  "+dono,9.5,SUB,False)]],anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)
    text(s,Inches(MX+NW+0.05),Inches(y),Inches(FW-0.1),Inches(0.55),[[(forte,10,INK,False)]],anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)
    text(s,Inches(MX+NW+FW+0.05),Inches(y),Inches(AW_-0.15),Inches(0.55),[[(atencao,10,INK,False)]],anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)
band(s,6.45,0.85,None,
     [[("Todos evoluem todo mês — o melhor depende da tarefa e da política da empresa. ",12,AREIA,True),
       ("Neste treinamento, os exemplos usam o Claude.",12,AMBAR,True)]])
s.notes_slide.notes_text_frame.text=("~2 min. Panorama dos assistentes mais usados em out/2026 (ChatGPT lidera, com Gemini e Claude na sequencia; "
 "Grok, Copilot e DeepSeek com fatias menores; Muse, da Meta, lancado em 8/set). Nao e ranking de qualidade: cada um tem "
 "seu forte e seu ponto de atencao. Reforcar: usar so o que a politica da empresa permite, com a conta da empresa. "
 "Fontes: TechCrunch (jun/2026, participacao de mercado), Meta/Axios/TechCrunch (set/2026, Muse), OpenAI (out/2026, GPT-6) "
 "e notas de versao do Claude (set-out/2026). Atualizar antes de "
 "cada turma — esse mercado muda todo mes.")
mercado_s=s

# ---- Modelos (4 cérebros, incluindo o Fable) ----
s=new_slide()
header(s,"Conceitos · Modelos","Um “cérebro” para cada tipo de tarefa","1,5 min")
MW=(11.73-3*0.25)/4
mods=[(TEAL,"HAIKU 5.5","velocidade e economia · 7/out","Tarefas simples e em grande volume — o pequeno mais rápido e barato."),
      (PETROLEO,"SONNET 5.5","o dia a dia · 28/set","Analisar, escrever, organizar — 30% mais rápido e até 30% mais barato que o Sonnet 5."),
      (AMBAR,"OPUS 5.5","raciocínio para o complexo · 22/set","Análise densa e decisão difícil — faz o trabalho do Fable 5.1 na maioria dos casos, 40% mais barato que o Opus 5."),
      (CORAL,"FABLE 5.1","o mais capaz da família · 1/set","O topo da linha: as tarefas mais exigentes e os agentes que rodam sozinhos por mais tempo.")]
for i,(acc,name,role,body) in enumerate(mods):
    card(s,0.8+i*(MW+0.25),2.05,MW,2.85,acc,name,role,body,tsz=16)
    _eq=["gpt-6 luna","gpt-6 sol","gpt-6 sol · esforço alto","gpt-6 astra (pro)"][i]
    _m=text(s,Inches(0.8+i*(MW+0.25)+0.1),Inches(4.91),Inches(MW-0.2),Inches(0.24),
            [[("openai: ",10,SUB,False),(_eq,10,SUB,True)]],line_spacing=1.0); _m.name="mini_eq"
band(s,5.2,1.02,None,
     [[("Você escolhe conforme a tarefa — do mais rápido e barato ao mais “pensante”.  ",13,AREIA,True)],
      [("Claude e ChatGPT têm famílias assim — Haiku · Sonnet · Opus · Fable ≈ Luna · Sol · Astra. O Copilot escolhe o modelo por você (GPT ou Claude).",12,BEGE,False)]])
# destaque: a estratégia de modelo quando o trabalho passa a rodar em loop
box(s,Inches(0.8),Inches(6.30),Inches(11.73),Inches(1.0),fill=AMBAR,round_=True)
text(s,Inches(1.05),Inches(6.42),Inches(11.2),Inches(0.3),[[("DICA · QUANDO O TRABALHO RODA EM LOOP",11,VERDE,True)]])
text(s,Inches(1.05),Inches(6.70),Inches(11.2),Inches(0.58),
     [[("Desenvolva no modelo mais avançado",12.5,VERDE,True),
       (" — é ele que acerta o método. Depois deixe o loop ",12.5,VERDE,False),
       ("rodando e atualizando num modelo mais simples",12.5,VERDE,True),
       (": bem mais rápido e barato.",12.5,VERDE,False)]],
     line_spacing=1.08)
s.notes_slide.notes_text_frame.text=("~1,5 min. Quatro 'cerebros' para tipos de tarefa diferentes — a familia 5.5 e nova (set-out/2026): Haiku 5.5 "
 "(volume e velocidade, 7/out), Sonnet 5.5 (o dia a dia, 28/set), Opus 5.5 (raciocinio denso, 22/set — nivel do Fable 5.1 "
 "na maioria do trabalho e 40% mais barato que o Opus 5; pensa sempre, o esforco regula quanto) e Fable 5.1 (o mais capaz, "
 "1/set, para o que e mais exigente e para agentes que rodam sozinhos por mais tempo). Na OpenAI: Luna (gratis, volume), "
 "Sol (pagos; sobe o esforco para o complexo) e Astra (plano Pro, o topo). No Microsoft Copilot o modo automatico escolhe o modelo "
 "(GPT da OpenAI ou Claude da Anthropic); no Researcher e no Copilot Studio da para escolher o Claude. O destaque: quando o trabalho passa a rodar em LOOP, construa no modelo mais avancado — e "
 "ele que acerta o metodo e o criterio — e depois deixe a rotina rodando e atualizando num modelo mais simples. "
 "A qualidade ja esta no metodo; o modelo simples so executa, por bem menos tempo e custo.")
modelos=s

# ---- Níveis de esforço (conceitos do guia de esforço do Opus) ----
s=new_slide()
header(s,"Conceitos · Modelos · esforço","Quanto o Claude pensa: os 5 níveis de esforço","2 min")
niveis=[("Baixo",TEAL,"Pensa pouco e responde rápido.",
         "dá para explicar o pedido numa frase — ex.: corrigir o português de um texto"),
        ("Médio",PETROLEO,"O padrão: equilíbrio entre rapidez e qualidade.",
         "o dia a dia com escopo definido — ex.: escrever um post, montar um roteiro"),
        ("Alto",AMBAR,"Pensa mais a cada etapa.",
         "a resposta no médio veio incompleta, com erro ou rasa"),
        ("Extra",CORAL,"Testa hipóteses e considera mais caminhos.",
         "nem o alto resolveu"),
        ("Máx",VERDE,"Dedicação máxima — consome 6× ou mais de uso.",
         "só no que travou em todos os outros níveis")]
for i,(nome,cor,conceito,quando) in enumerate(niveis):
    y=1.78+i*0.9
    box(s,Inches(0.8),Inches(y),Inches(6.6),Inches(0.8),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    ch=box(s,Inches(0.95),Inches(y+0.2),Inches(1.2),Inches(0.4),fill=cor,round_=True)
    cf=ch.text_frame; cf.word_wrap=False; cf.vertical_anchor=MSO_ANCHOR.MIDDLE; cp=cf.paragraphs[0]; cp.alignment=PP_ALIGN.CENTER
    cr=cp.add_run(); cr.text=nome; cr.font.size=Pt(11); cr.font.bold=True; cr.font.color.rgb=WHITE; cr.font.name=FONT
    text(s,Inches(2.3),Inches(y+0.02),Inches(5.05),Inches(0.78),
         [[(conceito,11,TITLE,True)],[("Quando: ",10,SUB,True),(quando,10,INK,False)]],
         anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0,space_after=2)
# a tela real do seletor
_iw,_ih=_PILImage.open(base+"ia_esforco.png").size; SWd=4.88; SHt=SWd*_ih/_iw
box(s,Inches(7.65-0.05),Inches(1.78-0.05),Inches(SWd+0.10),Inches(SHt+0.10),fill=VERDE,round_=True,rad=0.06)
s.shapes.add_picture(base+"ia_esforco.png",Inches(7.65),Inches(1.78),Inches(SWd),Inches(SHt))
text(s,Inches(7.65),Inches(1.78+SHt+0.1),Inches(SWd),Inches(0.3),
     [[("No seletor de modelo → Esforço",9.5,SUB,False)]],line_spacing=1.0)
ty=1.78+SHt+0.5
box(s,Inches(7.65),Inches(ty),Inches(SWd),Inches(6.23-ty),fill=AREIA,line=CLINE,line_w=1.0,round_=True)
accent(s,7.65,ty,SWd,AMBAR)
text(s,Inches(7.85),Inches(ty+0.18),Inches(SWd-0.4),Inches(6.23-ty-0.25),
     [[("E SE AINDA NÃO DER CERTO?",11.5,TITLE,True)],
      [("Troque para o Fable 5.1, mais potente, só nessa tarefa — e depois volte para o Opus 5.5.",11,INK,False)]],
     line_spacing=1.05,space_after=4)
band(s,6.45,0.9,None,
     [[("Suba um degrau por vez: ",12.5,AREIA,True),("Médio → Alto → Extra → Máx → Fable.",12.5,AMBAR,True),
       ("  Mais esforço, mais tempo e uso.",12.5,AREIA,False)],
      [("ChatGPT: controle “Thinking” (Instante a Extra alto; Pro no lugar do Fable). Copilot: rápido ou mais profundo, e o Researcher.",11,BEGE,False)]])
s.notes_slide.notes_text_frame.text=("~2 min. Alem de escolher o modelo, da para escolher quanto ele pensa: o nivel de esforco, no proprio "
 "seletor de modelo. Baixo para o simples; Medio e o padrao e o ponto de partida; Alto quando o medio veio incompleto ou "
 "raso; Extra quando nem o alto resolveu; Max so no que travou em todos — ele pode consumir 6x ou mais de uso. Se ainda "
 "nao der certo, troque para o Fable 5.1 so naquela tarefa e volte. No Opus 5.5 o 'pensar' e sempre ligado — o esforco "
 "so regula quanto; o padrao e Medio. No ChatGPT o equivalente e o controle Thinking (Instante, Medio, Alto, Extra alto; "
 "Pro roda no Astra). No Microsoft Copilot: resposta rapida ou raciocinio mais profundo, e o agente Researcher para pesquisas e analises longas. Conceitos do guia de esforco da Anthropic para o Opus (divulgado por @thaleslaray).")
esforco=s

# ---- Conectores e Skills ----
s=new_slide()
header(s,"Conceitos · Conectores e Skills","Como a IA entra no seu fluxo de trabalho","1 min")
card(s,0.8,2.05,5.75,2.85,PETROLEO,"CONECTORES","as pontes com os seus apps","Ligam a IA aos aplicativos onde o trabalho já acontece — e-mail, agenda, planilhas, drive. Ela lê e age no seu contexto real.")
card(s,6.78,2.05,5.75,2.85,AMBAR,"SKILLS","ensinam o seu método","Instruções reutilizáveis que ensinam o SEU jeito: quando usar, quais etapas seguir, como avaliar e em que formato entregar.")
band(s,5.1,1.35,None,
     [[("É o que transforma uma IA genérica em uma parceira que trabalha do jeito da sua operação.  ",13,AREIA,True)],
      [("Conector = onde ela atua.   Skill = como ela faz.",12,BEGE,False)]])
conect=s

# ---- Passo a passo: conectar um programa e criar uma skill (telas desenhadas, editáveis) ----
def passos(s,itens,x=0.8,y0=1.85,w=5.55,pitch=0.8):
    cores=[TEAL,PETROLEO,AMBAR,CORAL,MENTA]
    for i,item in enumerate(itens):
        tit,desc=item[0],item[1]; tag=item[2] if len(item)>2 else None
        y=y0+i*pitch
        nb=box(s,Inches(x),Inches(y),Inches(0.36),Inches(0.36),fill=cores[i%5],round_=True)
        nf=nb.text_frame; nf.word_wrap=False; nf.vertical_anchor=MSO_ANCHOR.MIDDLE
        np_=nf.paragraphs[0]; np_.alignment=PP_ALIGN.CENTER
        nr=np_.add_run(); nr.text=str(i+1); nr.font.size=Pt(13); nr.font.bold=True; nr.font.color.rgb=WHITE; nr.font.name=FONT
        text(s,Inches(x+0.5),Inches(y-0.04),Inches(w-0.5),Inches(0.3),[[(tit,13,TITLE,True)]],line_spacing=1.0)
        runs=[(desc,10,INK,False)]
        if tag: runs=[(tag+"  ",10,(PETROLEO if tag=="SEMPRE" else CORAL),True)]+runs
        text(s,Inches(x+0.5),Inches(y+0.24),Inches(w-0.5),Inches(0.52),[runs],line_spacing=1.02)
def janela(s,x,y,w,h,titulo):
    box(s,Inches(x),Inches(y),Inches(w),Inches(h),fill=WHITE,line=BEGE,line_w=1.25,round_=True,rad=0.12)
    box(s,Inches(x),Inches(y),Inches(w),Inches(0.4),fill=AREIA,round_=True,rad=0.12)
    box(s,Inches(x),Inches(y+0.2),Inches(w),Inches(0.2),fill=AREIA)
    for k,cor in enumerate([CORAL,AMBAR,MENTA]):
        d=s.shapes.add_shape(MSO_SHAPE.OVAL,Inches(x+0.18+k*0.2),Inches(y+0.14),Inches(0.12),Inches(0.12))
        d.fill.solid(); d.fill.fore_color.rgb=cor; d.line.fill.background(); d.shadow.inherit=False
    text(s,Inches(x+0.85),Inches(y+0.02),Inches(w-1.0),Inches(0.36),[[(titulo,10.5,VERDE,True)]],anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)

# (1) conectar o Claude a um programa
s=new_slide()
header(s,"Conectores · passo a passo","Como conectar o Claude a um programa","3 min")
passos(s,[("Abra Configurações → Conectores","no claude.ai ou no app, com a conta da empresa"),
          ("Escolha o programa","ex.: Google Drive, Gmail, Microsoft 365, Slack, Notion"),
          ("Clique em Conectar e autorize","login do próprio programa; o Claude vê o que você vê"),
          ("Ative o conector na conversa","no menu de ferramentas do chat, ligue o conector"),
          ("Peça em linguagem natural","“Busque no Drive a planilha de setembro e resuma.”")])
WX,WY,WW,WH=6.75,1.85,5.78,2.95
janela(s,WX,WY,WW,WH,"Configurações  ›  Conectores")
cons=[("Google Drive","G",AMBAR,True),("Gmail","M",CORAL,False),("Microsoft 365","M",PETROLEO,False),("Slack","S",TEAL,False)]
for i,(nome,ini,cor,ok) in enumerate(cons):
    ry=WY+0.52+i*0.5
    ic=box(s,Inches(WX+0.25),Inches(ry),Inches(0.34),Inches(0.34),fill=cor,round_=True,rad=0.08)
    icf=ic.text_frame; icf.word_wrap=False; icf.vertical_anchor=MSO_ANCHOR.MIDDLE
    icp=icf.paragraphs[0]; icp.alignment=PP_ALIGN.CENTER
    icr=icp.add_run(); icr.text=ini; icr.font.size=Pt(11); icr.font.bold=True; icr.font.color.rgb=WHITE; icr.font.name=FONT
    text(s,Inches(WX+0.72),Inches(ry-0.03),Inches(2.8),Inches(0.4),[[(nome,12,VERDE,True)]],anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)
    pill=box(s,Inches(WX+WW-1.95),Inches(ry-0.01),Inches(1.7),Inches(0.36),
             fill=(MENTA if ok else WHITE),line=(None if ok else PETROLEO),line_w=1.0,round_=True)
    pf=pill.text_frame; pf.vertical_anchor=MSO_ANCHOR.MIDDLE; pp=pf.paragraphs[0]; pp.alignment=PP_ALIGN.CENTER
    pr=pp.add_run(); pr.text=("✓ Conectado" if ok else "Conectar"); pr.font.size=Pt(10.5); pr.font.bold=True
    pr.font.color.rgb=(VERDE if ok else PETROLEO); pr.font.name=FONT
text(s,Inches(WX+0.25),Inches(WY+2.5),Inches(WW-0.5),Inches(0.36),[[("+  Adicionar conector personalizado",11,TEAL,True)]],anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)
# a mensagem que usa o conector
bub=box(s,Inches(WX+0.9),Inches(WY+3.08),Inches(WW-0.9),Inches(0.62),fill=AREIA,round_=True,rad=0.14)
text(s,Inches(WX+1.05),Inches(WY+3.08),Inches(WW-1.2),Inches(0.62),
     [[("“Busque no Drive a planilha de fluxo de setembro e resuma em 5 pontos.”",11,VERDE,False)]],anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)
text(s,Inches(WX),Inches(WY+3.72),Inches(WW),Inches(0.3),[[("tela ilustrativa — o layout pode variar",9.5,SUB,False)]],align=PP_ALIGN.RIGHT,line_spacing=1.0)
band(s,6.0,1.15,"SALVAGUARDA",
     [[("Conecte só com a conta da empresa e só o que a política de acesso permite. O conector não amplia permissão: o Claude enxerga o que você já enxerga.",11.5,AREIA,True)]])
s.notes_slide.notes_text_frame.text=("~3 min. Passo a passo para conectar o Claude a um programa: Configuracoes > Conectores, escolher o "
 "programa, clicar em Conectar e autorizar com o login do proprio programa, ligar o conector na conversa pelo menu de "
 "ferramentas e pedir em linguagem natural. A tela e ilustrativa: os nomes podem variar conforme a versao. Para sistemas "
 "internos existe o conector personalizado (MCP), que exige o time de TI. Reforcar: conta da empresa e politica de acesso.")
conect_pp=s

# (2) criar uma skill
s=new_slide()
header(s,"Skills · passo a passo","Como criar uma skill","3 min")
passos(s,[("Escolha uma tarefa que se repete","ex.: o resumo semanal que sai toda segunda-feira"),
          ("Escreva o SKILL.md","nome, quando usar e o passo a passo"),
          ("Junte os arquivos de apoio","o modelo do relatório, um exemplo bom, o glossário"),
          ("Suba em Configurações → Skills","a pasta em .zip — ou peça ao Claude para criá-la"),
          ("Teste e ajuste","rode com um caso real, corrija e suba a nova versão")])
CX,CY_,CWd,CHt=6.75,1.85,5.78,3.95
box(s,Inches(CX),Inches(CY_),Inches(CWd),Inches(CHt),fill=VERDE,round_=True,rad=0.12)
tab=box(s,Inches(CX+0.2),Inches(CY_+0.14),Inches(1.35),Inches(0.34),fill=PETROLEO,round_=True,rad=0.06)
tf_=tab.text_frame; tf_.vertical_anchor=MSO_ANCHOR.MIDDLE; tp=tf_.paragraphs[0]; tp.alignment=PP_ALIGN.CENTER
tr=tp.add_run(); tr.text="SKILL.md"; tr.font.size=Pt(10.5); tr.font.bold=True; tr.font.color.rgb=AREIA; tr.font.name=FONT
text(s,Inches(CX+1.7),Inches(CY_+0.14),Inches(CWd-1.9),Inches(0.34),
     [[("na pasta: template.md · exemplo.md",9.5,BEGE,False)]],anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)
CODE=[("---",BEGE),("name: resumo-semanal-shopping",AMBAR),("description: Monta o resumo semanal de fluxo",AMBAR),
      ("  e vendas. Use quando pedirem o resumo",AMBAR),("  da semana ou o relatório de segunda.",AMBAR),("---",BEGE),
      ("# Resumo semanal do shopping",MENTA),("1. Leia a planilha anexada.",AREIA),
      ("2. Compare com a semana anterior e com a",AREIA),("   mesma semana do ano passado.",AREIA),
      ("3. Destaque 3 altas e 3 quedas, com o motivo.",AREIA),("4. Siga o modelo em template.md.",AREIA),
      ("5. Nunca cite a venda de uma loja: use",AREIA),("   índice ou segmento.",AREIA)]
cb=s.shapes.add_textbox(Inches(CX+0.25),Inches(CY_+0.58),Inches(CWd-0.4),Inches(CHt-0.7)); cb.name="mono_skill"
ctf=cb.text_frame; ctf.word_wrap=False
for i,(ln,cor) in enumerate(CODE):
    p=ctf.paragraphs[0] if i==0 else ctf.add_paragraph()
    p.space_after=Pt(0); p.line_spacing=1.0
    r=p.add_run(); r.text=ln; r.font.size=Pt(10.5); r.font.color.rgb=cor; r.font.name="Consolas"
band(s,6.0,1.15,None,
     [[("A skill é o manual da tarefa — escrito uma vez, usado toda vez.  ",12.5,AREIA,True),
       ("O Claude só a carrega quando o pedido bate com a descrição.",12.5,AMBAR,True)]])
s.notes_slide.notes_text_frame.text=("~3 min. Uma skill e uma pasta com um arquivo SKILL.md: no topo, o nome e a descricao (e ela que diz ao "
 "Claude QUANDO usar a skill); embaixo, o passo a passo em portugues simples. Arquivos de apoio (modelo, exemplo) vao "
 "na mesma pasta. Sobe em Configuracoes > Skills como .zip — ou o proprio Claude cria a skill a partir de uma conversa. "
 "Repare no passo 5 do exemplo: a regra de anonimizacao ja vem dentro da skill. Adianta o Bloco 7: a skill e o "
 "manual operacional da tarefa.")
skill_pp=s

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

# ---- Harness e Loop NA PRÁTICA: o NuTre, do prompt ao ar (5 telas reais) ----
def screen_frame(s,img,cx,y,h):
    iw,ih=_PILImage.open(base+img).size; w=h*iw/ih; x=cx-w/2
    box(s,Inches(x-0.05),Inches(y-0.05),Inches(w+0.10),Inches(h+0.10),fill=VERDE,round_=True,rad=0.06)
    s.shapes.add_picture(base+img,Inches(x),Inches(y),Inches(w),Inches(h))
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
    screen_frame(s,img,x+STW/2,3.12,3.05)
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
    screen_frame(s,img,x+CW/2,3.02,2.45)
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

# ---- Salvaguardas: proteger um app em teste/compartilhado ----
s=new_slide()
header(s,"Salvaguardas · app em teste","Como proteger um app em teste e compartilhado","2 min")
passos(s,[("Link com senha ou login","quando o app tem dado interno, banco ou chave de API","DEPENDE"),
          ("Só dados fictícios","enquanto for teste — dado real só depois de aprovado","SEMPRE"),
          ("Repositório privado","o código no GitHub, com acesso só de quem desenvolve","SEMPRE"),
          ("Teste separado da produção","quando o app já tem gente usando de verdade","DEPENDE"),
          ("Encerre o acesso no fim","quando o link é restrito: saiba quem tem e revogue","DEPENDE")])
QX,QY,QW=6.75,1.85,5.78
text(s,Inches(QX),Inches(QY-0.05),Inches(QW),Inches(0.36),[[("PRECISA DE SENHA?",12.5,TITLE,True)]],line_spacing=1.0)
def _quadro(y,h,cor,titulo,itens,exemplo):
    box(s,Inches(QX),Inches(y),Inches(QW),Inches(h),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    box(s,Inches(QX),Inches(y+0.15),Inches(0.1),Inches(h-0.3),fill=cor,round_=True)
    text(s,Inches(QX+0.3),Inches(y+0.1),Inches(QW-0.45),Inches(0.34),[[(titulo,12,cor,True)]],line_spacing=1.0)
    text(s,Inches(QX+0.3),Inches(y+0.44),Inches(QW-0.45),Inches(h-0.5),
         [[("•  "+it,10.5,INK,False)] for it in itens]+[[(exemplo,10,SUB,True)]],line_spacing=1.0,space_after=1)
_quadro(QY+0.38,1.78,CORAL,"SIM — feche com senha ou login",
        ["tem dado real ou interno","grava em banco ou servidor","chama uma API com chave"],
        "ex.: NuTre — banco de dados e chave da IA")
_quadro(QY+2.3,1.68,TEAL,"NÃO — pode circular aberto",
        ["roda só no navegador de quem usa","não tem chave nem banco","o conteúdo da página pode ser público"],
        "ex.: Radar de Mídia, Radar de Varejo e Otimizador de Obras")
band(s,5.88,1.42,"PROTÓTIPO É UMA COISA; APP DESDOBRADO É OUTRA",
     [[("Para uso pessoal ou como protótipo, pode desenvolver. ",12,AREIA,True),
       ("Qualquer app, para ser desdobrado, precisa ter o envolvimento da área de TI.",12,AMBAR,True)],
      [("Na dúvida, feche — e, quando der, processe no navegador, como o Radar de Dispersão de Vendas.",11,BEGE,False)]])
s.notes_slide.notes_text_frame.text=("~2 min. Comecar pela faixa de baixo: apps podem ser desenvolvidos para objetivos pessoais ou como "
 "prototipo. Qualquer app que for desdobrado — para outras pessoas, outros shoppings ou para o dia a dia da operacao — "
 "precisa ter o envolvimento da area de TI (seguranca, contas da empresa, dados, suporte). Nem todo app precisa de senha — depende do que ele guarda. SEMPRE: dados ficticios no teste e "
 "repositorio privado. DEPENDE: senha ou login e obrigatorio quando o app tem dado real ou interno, grava em banco ou "
 "servidor, ou chama uma API com chave (o NuTre, por isso, fica atras de senha). Ferramenta que roda so no navegador, "
 "sem chave e sem banco, e com conteudo que pode ser publico, pode circular aberta (Radar de Midia, Radar de Varejo, "
 "Otimizador de Obras). Cuidado: aberta significa que qualquer um le o conteudo da pagina — nada interno ali dentro. "
 "Na duvida, feche: na Vercel, em Settings > Deployment Protection. Antes de mandar o link: o link pede senha quando "
 "precisa? os dados sao ficticios? o repositorio e privado? nenhuma chave aparece? sei quem vai receber?")
app_seg=s

# ---- Salvaguardas: proteger uma chave de API ----
s=new_slide()
header(s,"Salvaguardas · chave de API","Como proteger uma chave de API","2 min")
passos(s,[("Precisa de chave?","só se o app chama uma API paga — como a IA do NuTre","DEPENDE"),
          ("Nunca no código, no chat ou no print","a chave é uma senha: quem tem gasta na sua conta","SEMPRE"),
          ("Guarde em variável de ambiente",".env no computador (no .gitignore); na Vercel, em Environment Variables","SEMPRE"),
          ("A chave fica no servidor","o navegador chama o seu servidor; só o servidor chama a API","SEMPRE"),
          ("Vazou? Revogue na hora","gere outra, troque no .env e avise TI; use limite de gasto","SEMPRE")])
KX,KY,KW,KH=6.75,1.85,5.78,3.95
box(s,Inches(KX),Inches(KY),Inches(KW),Inches(KH),fill=VERDE,round_=True,rad=0.12)
tab=box(s,Inches(KX+0.2),Inches(KY+0.14),Inches(1.7),Inches(0.34),fill=PETROLEO,round_=True,rad=0.06)
tf_=tab.text_frame; tf_.vertical_anchor=MSO_ANCHOR.MIDDLE; tp=tf_.paragraphs[0]; tp.alignment=PP_ALIGN.CENTER
tr=tp.add_run(); tr.text="o jeito certo"; tr.font.size=Pt(10.5); tr.font.bold=True; tr.font.color.rgb=AREIA; tr.font.name=FONT
KCODE=[("# .env — fica só no seu computador",BEGE),("ANTHROPIC_API_KEY=sk-ant-••••••••",AMBAR),("",AREIA),
       ("# .gitignore — o .env nunca vai pro GitHub",BEGE),(".env",AMBAR),("",AREIA),
       ("// no servidor (rota /api)",BEGE),("const chave = process.env.ANTHROPIC_API_KEY",MENTA),("",AREIA),
       ("// nunca assim:",CORAL),("const chave = \"sk-ant-abc123...\"",CORAL)]
kb=s.shapes.add_textbox(Inches(KX+0.25),Inches(KY+0.6),Inches(KW-0.4),Inches(KH-0.7)); kb.name="mono_api"
ktf=kb.text_frame; ktf.word_wrap=False
for i,(ln,cor) in enumerate(KCODE):
    p=ktf.paragraphs[0] if i==0 else ktf.add_paragraph()
    p.space_after=Pt(0); p.line_spacing=1.0
    r=p.add_run(); r.text=ln if ln else " "; r.font.size=Pt(10.5); r.font.color.rgb=cor; r.font.name="Consolas"
band(s,6.0,1.15,None,
     [[("Tendo chave, os passos 2 a 5 valem sempre.",12.5,AMBAR,True)],
      [("Nos apps da demonstração, o NuTre usa chave — guardada na Vercel e usada só no servidor. As ferramentas comerciais rodam no navegador: não têm chave, e não há o que vazar.",11.5,AREIA,False)]])
s.notes_slide.notes_text_frame.text=("~2 min. Primeiro: so precisa de chave o app que chama uma API paga (a IA do NuTre, por exemplo). "
 "App que roda so no navegador, como as ferramentas comerciais, nao tem chave. Quando tem, as regras valem SEMPRE. A chave de API e uma senha: quem tem gasta na sua conta. Nunca vai no codigo, no prompt, "
 "no GitHub, em print ou mensagem. Fica numa variavel de ambiente: arquivo .env no computador (listado no .gitignore) e, na "
 "Vercel, em Environment Variables. So o servidor usa a chave — o navegador nunca a ve. Se vazar: revogar no console, "
 "gerar outra, trocar no .env e avisar TI. Configure limite de gasto. Dica: pedir ao Claude Code para conferir se alguma "
 "chave ficou no codigo antes de cada commit.")
api_seg=s

# ===================== SHOPPING INTELIGENTE: divider =====================
d3=divider("Bloco 2","O Shopping Inteligente","A tese e o impacto — do vídeo do shopping do futuro a como cada app nasceu no Claude Code.")

# ===================== MÃO NA MASSA =====================
d4=divider("Bloco 3","Mão na massa: rode, critique, melhore",
           "4 ferramentas reais criadas no Claude Code. Cada time roda as suas e preenche a ficha de melhorias — às 14:35 vocês veem os apps ajustados.")
# cases
s=new_slide()
header(s,"Bloco 3 · casos","4 ferramentas criadas com Claude Code","5 min")
ferr4=[(TEAL,"Radar de Mídia","Marketing · liga ao Seller","Triagem de anunciantes da Helloo: casa o anunciante com a propriedade de mídia mais adequada."),
       (PETROLEO,"Otimizador de Obras","Operações · liga ao Builder","Triagem de fornecedores: casa o lojista com quem entrega a obra no menor tempo e custo."),
       (AMBAR,"Radar de Varejo","Negócios · liga ao Farmer/KA","Triagem de investidores: casa o investidor com a marca (base ABF) e o mix planejado."),
       (CORAL,"Radar de Dispersão de Vendas","Negócios · auditoria de vendas","Lê os livros fiscais e apura a venda real por CNPJ, cruzando com o que foi informado.")]
KW=(11.73-3*0.22)/4
for i,(acc,nome,papel,corpo) in enumerate(ferr4):
    x=0.8+i*(KW+0.22)
    box(s,Inches(x),Inches(1.95),Inches(KW),Inches(3.5),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    accent(s,x,1.95,KW,acc)
    text(s,Inches(x+0.22),Inches(2.15),Inches(KW-0.44),Inches(0.7),[[(nome,13.5,TITLE,True)]],line_spacing=1.0)
    text(s,Inches(x+0.22),Inches(2.9),Inches(KW-0.44),Inches(0.5),[[(papel,11,acc,True)]],line_spacing=1.0)
    text(s,Inches(x+0.22),Inches(3.45),Inches(KW-0.44),Inches(1.9),[[(corpo,11.5,INK,False)]],line_spacing=1.08)
band(s,5.7,1.15,None,
     [[("Foram construídas de um prompt — e ainda estão em evolução.  ",13,AREIA,True),
       ("Agora é a sua vez de testá-las e apontar o que melhorar.",13,AMBAR,True)]])
cases=s
# divisao dos times
s=new_slide()
header(s,"Bloco 3 · sua missão","O que cada time vai testar","40 min · em grupos")
card(s,0.8,1.95,3.71,2.35,TEAL,"TIME DE MARKETING","→ Radar de Mídia","Rode a triagem de mídia com um anunciante fictício, parecido com os da sua praça.",tsz=15)
card(s,4.81,1.95,3.71,2.35,PETROLEO,"TIME DE OPERAÇÕES","→ Otimizador de Obras","Rode a triagem de obra com um lojista fictício, como os que chegam na sua praça.",tsz=15)
card(s,8.82,1.95,3.71,2.35,AMBAR,"TIME DE NEGÓCIOS","→ Radar de Varejo e Radar de Dispersão de Vendas","Qualifique um investidor fictício e audite as vendas de uma loja fictícia — uma ficha por app.",tsz=15)
band(s,4.5,2.35,"A MISSÃO DE CADA TIME",
     [[("1) Rodem com um caso fictício, parecido com os da praça.   2) Critiquem com a experiência de vocês: o processo real, a prática e as dores.",13,AREIA,True)],
      [("3) Preencham a ficha nas 4 categorias.   4) Marquem a melhoria nº 1 — ela entra em ajuste logo em seguida.",13,AREIA,True)],
      [("O caso é sempre fictício: nomes, CNPJs e valores inventados — nada de dado real ou confidencial.",12,AMBAR,True)]])
s.notes_slide.notes_text_frame.text=("30 min em grupos. Reforcar ANTES de comecar: cada time monta um caso FICTICIO, parecido com os da praca — "
 "nome de loja, CNPJ, investidor e valores inventados. Nada de dado real ou confidencial, nem para testar. O caso inventado "
 "vai anotado no topo da ficha. Depois, criticar com a experiencia de cada um: o processo real, a pratica e as dores.")
times=s
# o que avaliar + formulário
s=new_slide()
header(s,"Bloco 3 · o que avaliar","Critique com o que vocês vivem na operação","preencher em grupo")
# destaque: quem opera é o especialista
box(s,Inches(0.8),Inches(1.75),Inches(6.1),Inches(1.2),fill=AMBAR,round_=True)
text(s,Inches(1.0),Inches(1.82),Inches(5.75),Inches(1.08),
     [[("Vocês são os especialistas. ",12.5,VERDE,True),
       ("Critiquem com o que só quem opera sabe: o processo como ele é de verdade, a prática da praça e as dores que se repetem.",12,VERDE,False)]],
     anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.05)
text(s,Inches(0.8),Inches(3.08),Inches(6.1),Inches(0.34),[[("O QUE OBSERVAR ENQUANTO RODA",12,TITLE,True)]],line_spacing=1.0)
for k,t in enumerate([
    ("Resolve uma dor real?","a tarefa que hoje dá retrabalho, atraso ou reclamação"),
    ("Segue o processo de verdade?","as etapas batem com o que acontece na praça?"),
    ("O que falta?","o dado, a exceção, o caso que só quem opera conhece"),
    ("A saída é útil?","dá para agir amanhã sem retrabalho?"),
    ("É seguro?","respeita sigilo e mantém a decisão humana?")]):
    yy=3.45+k*0.68
    box(s,Inches(0.8),Inches(yy),Inches(6.1),Inches(0.6),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    text(s,Inches(1.0),Inches(yy+0.02),Inches(5.8),Inches(0.3),[[("— ",12.5,AMBAR,True),(t[0],12.5,TITLE,True)]],line_spacing=1.0)
    text(s,Inches(1.2),Inches(yy+0.3),Inches(5.6),Inches(0.28),[[(t[1],10.5,SUB,False)]],line_spacing=1.0)
# painel: a ficha de melhorias, com as 4 categorias
box(s,Inches(7.15),Inches(1.75),Inches(5.35),Inches(5.05),fill=DARK,line=PETROLEO,line_w=1.2,round_=True)
accent(s,7.15,1.75,5.35,AMBAR)
text(s,Inches(7.4),Inches(1.98),Inches(4.9),Inches(0.4),[[("FICHA DE MELHORIAS · 4 CATEGORIAS",13,AMBAR,True)]])
cats=[("A","Workflow (fluxo)","a ordem das etapas, perguntas que sobram ou faltam, o caminho até a resposta"),
      ("B","Design","leitura, clareza, cores, tamanhos — o que confunde na tela"),
      ("C","Inclusões ou exclusões","o dado, a pergunta, o campo ou o relatório que falta — e o que pode sair"),
      ("D","Outros","o que não coube acima")]
yy=2.5
for k,(letra,nome,dica) in enumerate(cats):
    text(s,Inches(7.4),Inches(yy),Inches(4.9),Inches(0.34),[[(letra+" · ",13,AMBAR,True),(nome,13,WHITE,True)]],line_spacing=1.0)
    text(s,Inches(7.7),Inches(yy+0.33),Inches(4.6),Inches(0.5),[[(dica,10.5,AREIA,False)]],line_spacing=1.02)
    yy+=0.9
text(s,Inches(7.4),Inches(yy+0.05),Inches(4.9),Inches(0.5),[[("1 ficha por app · entrega às 11:15",11,AMBAR,True)]])
s.notes_slide.notes_text_frame.text=("Enquanto os times rodam o app: o ponto central e que ELES sao os especialistas. A ferramenta nasceu "
 "de um prompt; quem sabe onde o processo trava, onde ha retrabalho e o que o lojista reclama sao eles. Pedir que cada sugestao "
 "venha amarrada a uma dor real da praca (a coluna 'Dor que resolve' na ficha) — critica sem dor vira opiniao; com dor, vira prioridade.")
avaliar=s
# apresentação
s=new_slide()
header(s,"Bloco 3 · fechamento","As fichas viram ajuste — e o app volta às 14:35","10 min")
card(s,0.8,1.95,3.71,2.7,PETROLEO,"11:00 · A Nº 1 DO TIME","", "Cada time lê a melhoria nº 1 de cada app e entrega as fichas.",tsz=14)
card(s,4.81,1.95,3.71,2.7,TEAL,"ATÉ 14:35 · EM AJUSTE","", "As fichas entram no Claude Code e rodam durante os próximos blocos, o almoço e as práticas.",tsz=14)
card(s,8.82,1.95,3.71,2.7,AMBAR,"14:35 · APPS AJUSTADOS","", "10 minutos por app: o que o time pediu, o app ajustado ao vivo e o que ficou para depois.",tsz=14)
band(s,4.95,1.5,None,
     [[("O loop do NuTre, ao vivo: ideia de quem opera a praça → Claude Code → app ajustado no mesmo dia.",13.5,AREIA,True)],
      [("O que não couber no dia vira backlog com dono e prazo. A ferramenta nasceu de um prompt; agora evolui com a experiência de vocês.",12,BEGE,False)]])
apres=s

# ===================== BLOCO 5: Oportunidades de novas receitas =====================
d5=divider("Bloco 5","Oportunidades de novas receitas",
           "Onde o shopping ganha além do aluguel — e os cases de monetização que já provaram que funciona.")

# ---- o ciclo de vida otimizado: os 3 eixos de extensão de produto (infográfico) ----
rec0=_infografico("ciclo_otimizado","BLOCO 5 · CICLO ENCURTADO VS. CICLO ALONGADO",
 "~3 min. Ciclo de vida do shopping center: ciclo encurtado x ciclo alongado. Painel 1 (pressoes de mercado): seis variaveis "
 "antecipam a queda das vendas e cortam a maturidade — concorrencia e aumento de ABL, avanco do e-commerce, carga tributaria, "
 "entraves regulatorios e burocracia, inseguranca/criminalidade e recessao com PIB abaixo da inflacao. Painel 2 (alavancas "
 "estrategicas): construcao de valor em camadas, da base ao topo — midia em aeroportos e home, expansao/adensamento/retrofit, "
 "mix transformacional, retail media e midia digital, eventos/feiras/bilheteria e reciclagem de portfolio via FII Kinea — "
 "mantem a curva acima da normal e alongam a vida util do ativo. Ponte: as frentes de receita e os cases a seguir sao essas "
 "alavancas na pratica.",borda=CORAL)

# ---- as frentes de receita ----
s=new_slide()
header(s,"Bloco 5 · receitas","Onde o shopping ganha além do aluguel","10 min")
frentes=[(TEAL,"Mídia e merchandising","Totens, megabanners, testeiras e túneis. É a frente que o Radar de Mídia já endereça."),
         (PETROLEO,"Varejo temporário","Quiosques, RMU e pop-ups: ocupar espaço ocioso com contrato curto."),
         (AMBAR,"Eventos e ativações","Praças e espaços para marcas: receita e fluxo no mesmo movimento."),
         (CORAL,"Naming rights","Espaços, salas e praças com marca patrocinadora, em contrato de médio prazo."),
         (MENTA,"Serviços e conveniência","Estacionamento, lockers, pickup e logística de última milha para o lojista."),
         (VERDE,"Parcerias financeiras","Cartão, cooperativa, seguro e crédito ao lojista — receita recorrente.")]
FW=(11.73-2*0.22)/3
for i,(acc,titulo,corpo) in enumerate(frentes):
    x=0.8+(i%3)*(FW+0.22); yy=1.85+(i//3)*2.15
    card(s,x,yy,FW,1.95,acc,titulo,"",corpo,tsz=14)
band(s,6.25,0.95,None,
     [[("A pergunta do bloco: qual destas frentes a sua praça ainda não explora — e qual case daqui dá para replicar em 90 dias?",12.5,AREIA,True)]])
s.notes_slide.notes_text_frame.text=("~12 min. Mapa das frentes de receita alem do aluguel. Nao e uma lista fechada: o objetivo e cada praca "
 "reconhecer onde ja atua, onde nao atua e o porque. Amarrar com o Bloco 2 — o Radar de Midia ja e uma dessas frentes "
 "virando ferramenta. Fechar com a pergunta do rodape, que abre os cases do slide seguinte.")
rec1=s

# ---- cases de monetização: 3 cases de 10 min (slides de cada case vêm do PDF "incluir") ----
s=new_slide()
header(s,"Bloco 5 · cases","Cases de monetização — o que já funcionou","30 min")
casos=[("Venda Certa","NorteShopping",PETROLEO,"R$ 67,2 mil em venda incremental para 5 lojistas · ROAS de 23,2x no melhor case"),
       ("Sicredi · Números da Sorte Extra","Shopping Estação Cuiabá",AMBAR,"575 números extras e R$ 186,9 mil de GMV captado em 15 dias de outubro"),
       ("Dinisa · Status Match","Plaza Niterói",TEAL,"Ativação no KARG com upgrade de categoria: R$ 150 mil em negociação fechada")]
CY0=1.85; CRH=1.1; CGAP=0.18
for i,(nome,onde,acc,res) in enumerate(casos):
    yy=CY0+i*(CRH+CGAP)
    box(s,Inches(0.8),Inches(yy),Inches(11.73),Inches(CRH),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    box(s,Inches(0.8),Inches(yy+0.18),Inches(0.1),Inches(CRH-0.36),fill=acc,round_=True)
    text(s,Inches(1.15),Inches(yy+0.16),Inches(4.3),Inches(0.4),[[(nome,15,TITLE,True)]],line_spacing=1.0)
    text(s,Inches(1.15),Inches(yy+0.58),Inches(4.3),Inches(0.34),[[(onde,11.5,acc,True)]],line_spacing=1.0)
    text(s,Inches(5.6),Inches(yy),Inches(5.55),Inches(CRH),[[(res,12.5,INK,False)]],anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.05)
    cc=box(s,Inches(11.35),Inches(yy+0.35),Inches(1.0),Inches(0.4),fill=AREIA,line=CLINE,round_=True)
    cf2=cc.text_frame; cf2.vertical_anchor=MSO_ANCHOR.MIDDLE; cp2=cf2.paragraphs[0]; cp2.alignment=PP_ALIGN.CENTER
    cr2=cp2.add_run(); cr2.text="10 min"; cr2.font.size=Pt(11); cr2.font.bold=True; cr2.font.color.rgb=VERDE; cr2.font.name=FONT
band(s,6.0,1.02,"FORMATO DE CADA CASE — 10 MIN",
     [[("O que foi feito  ·  a receita que gerou, em número  ·  o que outro shopping precisa para replicar.",12,AREIA,True)]])
s.notes_slide.notes_text_frame.text=("~30 min, 10 min por case, na ordem dos slides: Venda Certa (NorteShopping, 5 slides), Sicredi Numeros da "
 "Sorte Extra (Estacao Cuiaba, 6 slides) e Dinisa Status Match (Plaza Niteroi, 2 slides). Cada um: o que foi feito, a receita "
 "que gerou (numero) e o que outro shopping precisa para replicar.")
rec2=s

# ===================== BLOCO 8: Próximos passos — 1 Guarda Alta, 2 Sprint final, 3 Manual operacional =====================
# slide de abertura do Bloco 7: as tres partes, na ordem
d_prox=divider("Bloco 7","Próximos passos",None)
for _k,(_n,_t,_d) in enumerate([("1","Manual operacional","o que entra e quem mantém"),("2","Guarda Alta","segurança na reta final"),("3","Sprint final","de resultados")]):
    _y=4.55+_k*0.68
    _c=d_prox.shapes.add_shape(MSO_SHAPE.OVAL,Inches(0.9),Inches(_y),Inches(0.5),Inches(0.5))
    _c.fill.solid(); _c.fill.fore_color.rgb=AMBAR; _c.line.fill.background(); _c.shadow.inherit=False
    _cf=_c.text_frame; _cf.margin_left=_cf.margin_right=_cf.margin_top=_cf.margin_bottom=0; _cf.vertical_anchor=MSO_ANCHOR.MIDDLE
    _cp=_cf.paragraphs[0]; _cp.alignment=PP_ALIGN.CENTER; _cr=_cp.add_run(); _cr.text=_n
    _cr.font.size=Pt(16); _cr.font.bold=True; _cr.font.color.rgb=VERDE; _cr.font.name=FONT
    text(d_prox,Inches(1.6),Inches(_y-0.04),Inches(10.5),Inches(0.58),[[(_t,22,WHITE,True),("   "+_d,15,AREIA,False)]],anchor=MSO_ANCHOR.MIDDLE,line_spacing=1.0)
d_prox.notes_slide.notes_text_frame.text=("Bloco 7 — Proximos passos (16:35 – 17:35): 1) Manual Operacional e PRO (20 min); 2) Guarda Alta — Seguranca na Reta Final (20 min); "
 "3) Sprint final de resultados (15 min). E o fim do dia — as conclusoes vieram antes.")
d6=divider("Próximos passos · 1","Manual operacional",
           "O passo a passo de como a operação roda: rotinas, responsáveis, padrões e o que fazer fora do padrão.")
s=new_slide()
header(s,"Próximos passos · 1 · manual operacional","O manual: o que entra e quem mantém","10 min")
card(s,0.8,1.85,5.75,2.05,PETROLEO,"O QUE ENTRA","",
     "Rotinas e cadências, responsáveis e alçadas, padrões e checklists — e o que fazer quando sai do padrão.")
card(s,6.78,1.85,5.75,2.05,TEAL,"ONDE VIVE","",
     "Um lugar só, versionado e acessível de qualquer lugar. Manual que ninguém acha, na prática, não existe.")
card(s,0.8,4.08,5.75,2.05,AMBAR,"QUEM MANTÉM","",
     "Um dono por capítulo e revisão com data marcada. Sem dono, o manual envelhece em poucas semanas.")
card(s,6.78,4.08,5.75,2.05,MENTA,"O MANUAL E A IA","",
     "O manual vira contexto e skill do agente: a IA passa a responder pelo padrão da casa, não pelo genérico.")
band(s,6.33,0.98,None,
     [[("O manual faz a boa prática sobreviver à troca de pessoas — e ensina a IA o nosso jeito de trabalhar.",12,AREIA,True)],
      [("Conversa (5 min): qual capítulo mais faz falta hoje na sua praça — e quem seria o dono dele?",12,AMBAR,True)]])
s.notes_slide.notes_text_frame.text=("~10 min (16:35): 5 de apresentacao e 5 de conversa; na sequencia, o P.R.O. (13 slides, ~20 min). O manual operacional e o que faz a boa pratica sobreviver a troca de pessoas. Quatro perguntas: o que "
 "entra, onde vive, quem mantem e como ele conversa com a IA. Esse ultimo ponto amarra com o Bloco 1: o manual e "
 "exatamente o contexto/skill que transforma um agente generico num agente que trabalha do nosso jeito. "
 "Adaptar os quatro cards ao manual que a Cia ja tem. Na conversa: cada shopping diz qual capitulo mais faz falta hoje e "
 "quem seria o dono dele — sai daqui uma lista de capitulos com dono e prazo.")
manual=s

# ===================== BLOCO 5: Melhoria contínua =====================
d7=divider("Bloco 5","Melhoria contínua",
           "Como uma boa prática deixa de ser um caso isolado e vira o padrão dos 10 shoppings.")
s=new_slide()
header(s,"Bloco 5 · melhoria contínua","De uma boa prática a padrão dos 10 shoppings","15 min")
passos=[("1","Registrar","A prática entra num lugar único: o que foi feito, em que contexto e com que resultado.",TEAL),
        ("2","Avaliar","O resultado se sustenta? Qual o custo e o risco? Cabe em outra praça?",PETROLEO),
        ("3","Padronizar","Vira capítulo do manual: passo a passo, responsável e checklist.",AMBAR),
        ("4","Replicar","Vai para os 10 shoppings com dono e prazo — por rotina, não por e-mail.",CORAL),
        ("5","Medir","O indicador dele. Melhorou, fica. Não melhorou, volta para avaliação.",MENTA)]
PW=(11.73-4*0.2)/5
for i,(num,titulo,corpo,acc) in enumerate(passos):
    x=0.8+i*(PW+0.2)
    box(s,Inches(x),Inches(1.95),Inches(PW),Inches(3.4),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    accent(s,x,1.95,PW,acc)
    nb=box(s,Inches(x+0.22),Inches(2.15),Inches(0.4),Inches(0.4),fill=acc,round_=True)
    nf=nb.text_frame; nf.word_wrap=False; nf.vertical_anchor=MSO_ANCHOR.MIDDLE
    np_=nf.paragraphs[0]; np_.alignment=PP_ALIGN.CENTER
    nr=np_.add_run(); nr.text=num; nr.font.size=Pt(13); nr.font.bold=True; nr.font.color.rgb=WHITE; nr.font.name=FONT
    text(s,Inches(x+0.22),Inches(2.68),Inches(PW-0.44),Inches(0.4),[[(titulo,14,TITLE,True)]],line_spacing=1.0)
    text(s,Inches(x+0.22),Inches(3.12),Inches(PW-0.44),Inches(2.1),[[(corpo,11.5,INK,False)]],line_spacing=1.08)
band(s,5.55,1.5,None,
     [[("É o caminho dos cases que os shoppings acabaram de apresentar — para que não morram na apresentação.",13,AREIA,True)],
      [("Repare que é o mesmo loop da IA: objetivo (o que conta como pronto), métrica (se melhorou) e fronteira (até onde vai sem consultar alguém). "
        "Muda o executor, não a lógica.",12,BEGE,False)]])
s.notes_slide.notes_text_frame.text=("~15 min. O ciclo que transforma um caso isolado em padrao: registrar, avaliar, padronizar, replicar, medir. "
 "Vem logo depois do Bloco 4: os cases de IA que os shoppings acabaram de apresentar entram no passo 1. Amarra com o Bloco 1 (e o mesmo "
 "loop: objetivo, metrica, fronteira). Combinar no fim quem e o dono de cada passo e qual a cadencia do forum.")
melhoria=s

# ===================== BLOCO 6: Os apps ajustados (10 min por app) =====================
d8=divider("Bloco 6","Os apps ajustados",
           "As ideias da ficha, no ar: 10 minutos por app para ver o que mudou desde a manhã.")
s=new_slide()
header(s,"Bloco 6 · apps ajustados","O que mudou com as ideias de vocês","40 min")
apps8=[("Radar de Mídia","Time de Marketing",TEAL),
       ("Otimizador de Obras","Time de Operações",PETROLEO),
       ("Radar de Varejo","Time de Negócios",AMBAR),
       ("Radar de Dispersão de Vendas","Time de Negócios",CORAL)]
AY0=1.8; ARH=0.98; AGAP=0.13
for i,(app,tm,acc) in enumerate(apps8):
    yy=AY0+i*(ARH+AGAP)
    box(s,Inches(0.8),Inches(yy),Inches(11.73),Inches(ARH),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    box(s,Inches(0.8),Inches(yy+0.2),Inches(0.1),Inches(ARH-0.4),fill=acc,round_=True)
    text(s,Inches(1.15),Inches(yy+0.12),Inches(3.9),Inches(0.36),[[(app,14,TITLE,True)]],line_spacing=1.0)
    text(s,Inches(1.15),Inches(yy+0.52),Inches(3.9),Inches(0.32),[[(tm,12,acc,True)]],line_spacing=1.0)
    for k,(rot,mins) in enumerate([("o pedido do time","2 min"),("o app, ao vivo","6 min"),("o que fica depois","2 min")]):
        bx=5.05+k*2.1
        ph=box(s,Inches(bx),Inches(yy+0.14),Inches(1.95),Inches(ARH-0.28),fill=AREIA,line=PETROLEO,line_w=1.0,round_=True,rad=0.08)
        _ln=ph.line._get_or_add_ln(); _ln.append(_ln.makeelement(qn('a:prstDash'),{'val':'dash'}))
        text(s,Inches(bx+0.08),Inches(yy+0.14),Inches(1.79),Inches(ARH-0.28),
             [[(rot,10.5,PETROLEO,True)],[(mins,10.5,SUB,False)]],align=PP_ALIGN.CENTER,anchor=MSO_ANCHOR.MIDDLE,space_after=1)
    cc=box(s,Inches(11.45),Inches(yy+0.27),Inches(0.95),Inches(0.44),fill=AREIA,line=CLINE,round_=True)
    cf8=cc.text_frame; cf8.vertical_anchor=MSO_ANCHOR.MIDDLE; cp8=cf8.paragraphs[0]; cp8.alignment=PP_ALIGN.CENTER
    cr8=cp8.add_run(); cr8.text="10 min"; cr8.font.size=Pt(11); cr8.font.bold=True; cr8.font.color.rgb=VERDE; cr8.font.name=FONT
band(s,6.3,0.9,None,
     [[("Da ficha da manhã ao app ajustado à tarde — o mesmo loop que o iFood mostra no vídeo a seguir.",13,AREIA,True)]])
s.notes_slide.notes_text_frame.text=("~40 min, 10 por app. Para cada app: (1) 2 min — o que o time pediu na ficha (a nº 1 e as demais); "
 "(2) 6 min — o app ajustado ao vivo, comparando com o que eles viram de manha; (3) 2 min — o que ficou para depois, "
 "com dono e prazo. Ordem sugerida: Marketing, Operacoes e Negocios (Radar de Varejo, depois Radar de Dispersão de Vendas). Emenda no video da Toyota/iFood: e exatamente isso "
 "— quem ve o problema passa a poder mudar o sistema.")
show=s

# ===================== HISTÓRIA REAL (thread @diegocbarreto) =====================
POSTS=[
 "Um coordenador abriu o celular dentro de um ônibus e, em cinco minutos, começou a desmontar uma certeza que a loja carregava há meses. Pra entender o que ele fez, preciso voltar 70 anos, até uma fábrica da Toyota.",
 "Nos anos 50, Taiichi Ohno desenhava um círculo de giz no chão da fábrica e colocava um gerente ali dentro. Horas depois, perguntava o que ele tinha visto. Quase sempre, bem menos do que estava acontecendo. O problema não estava escondido. Só que ninguém mais enxergava.",
 "Ohno ia além da observação. Na Toyota, quem enxergava um problema podia agir. O operador parava a linha e corrigia ali mesmo. Com software, isso nunca existiu. Quem vê o problema e quem muda o sistema sempre foram pessoas diferentes.",
 "O coordenador zerou essa distância. Ele tinha visitado uma loja parceira do iFood para entender a demora do entregador na expedição. No ônibus de volta, abriu o Claude no celular e começou a construir o sistema ali. Em cinco minutos, já tinha uma primeira versão rodando.",
 "Em quatro semanas: 12 telas, mais de 4 mil linhas de código, endereçamento por temperatura e controle de concorrência entre aparelhos. Um trabalho que envolveria um time inteiro e meses de desenvolvimento. Aqui foi uma pessoa sozinha, com 45 atualizações em produção.",
 "Das 27 versões do app, 24 saíram durante o piloto, dentro da loja, ao lado do time. Um operador reclamava de algo na coleta, o coordenador descrevia o problema, publicava, e o operador testava a correção no pedido seguinte.",
 "A loja tinha certeza do motivo da demora do entregador: era o tempo de conferência na saída. O sistema quebrou o tempo de espera em três partes: Conferência 22%, Busca do pedido 25%, Espera para ser atendido 53%.",
 "Foram atrás do porquê dos 53%. A loja tinha gente suficiente, o quadro mostrava isso. Mas o número de pessoas atendendo entregador de verdade ficava entre 1 e 2 na maior parte do tempo. Não faltava gente. Faltava atenção alocada, e ninguém media isso antes.",
 "Dias depois, os primeiros dados pareciam mostrar uma melhora: só 28% dos pedidos tinham espera longa. Eu quase publiquei como resultado. Mas era um dado parcial. No fim do dia, o número chegou a 46%. O piloto ainda não tinha reduzido a espera.",
 "Mas mostrou que estávamos tentando resolver a causa errada. Na semana seguinte, com o dado na mão, a liderança da loja mudou a forma de alocar gente na expedição. O indicador fechou em 18% num dia e 22% no outro. O software mostrou onde a fila travava, e a gente decidiu agir.",
 "O que a IA fez aqui não foi acelerar a expedição. Foi tirar ela do escuro. Um processo sem sistema é um processo em que todo mundo tem uma opinião e ninguém tem dado. E opinião, com tempo, pode virar certeza. Mas isso pode estar prejudicando o seu negócio.",
 "Esse sistema roda hoje sem revisão técnica, fora de qualquer esteira nossa. O coordenador fez exatamente o que um teste deve fazer e deixou claro tudo que falta para virar produto de verdade. A empresa que quer que ele tenha feito isso precisa decidir o que vem depois.",
]
K=True; N=False  # chave (negrito+sublinhado) / normal
SEG={
 1:[("Um coordenador abriu o celular dentro de um ônibus e, ",N),("em cinco minutos",K),(", começou a ",N),("desmontar uma certeza que a loja carregava há meses",K),(". Pra entender o que ele fez, preciso voltar 70 anos, até uma fábrica da Toyota.",N)],
 2:[("Nos anos 50, Taiichi Ohno desenhava um círculo de giz no chão da fábrica e colocava um gerente ali dentro. Horas depois, perguntava o que ele tinha visto. Quase sempre, bem menos do que estava acontecendo. ",N),("O problema não estava escondido. Só que ninguém mais enxergava.",K)],
 3:[("Ohno ia além da observação. Na Toyota, quem enxergava um problema podia agir — o operador parava a linha e corrigia ali mesmo. Com software, isso nunca existiu: ",N),("quem vê o problema e quem muda o sistema sempre foram pessoas diferentes.",K)],
 4:[("O coordenador zerou essa distância. Ele tinha visitado uma loja parceira do iFood para entender a demora do entregador na expedição. No ônibus de volta, ",N),("abriu o Claude no celular e começou a construir o sistema ali",K),(". ",N),("Em cinco minutos, já tinha uma primeira versão rodando.",K)],
 5:[("Em quatro semanas: 12 telas, mais de 4 mil linhas de código, endereçamento por temperatura e controle de concorrência entre aparelhos. Um trabalho que envolveria um time inteiro e meses. ",N),("Aqui foi uma pessoa sozinha, com 45 atualizações em produção.",K)],
 6:[("Das 27 versões do app, ",N),("24 saíram durante o piloto, dentro da loja, ao lado do time",K),(". Um operador reclamava de algo na coleta, o coordenador descrevia o problema, publicava, e o operador testava a correção no pedido seguinte.",N)],
 7:[("A loja tinha certeza do motivo da demora: era o tempo de conferência na saída. O sistema quebrou o tempo de espera em três partes: ",N),("Conferência 22%, Busca do pedido 25%, Espera para ser atendido 53%.",K)],
 8:[("Foram atrás do porquê dos 53%. A loja tinha gente suficiente, o quadro mostrava isso. Mas o número de pessoas atendendo entregador de verdade ficava entre 1 e 2 na maior parte do tempo. ",N),("Não faltava gente. Faltava atenção alocada, e ninguém media isso antes.",K)],
 9:[("Dias depois, os primeiros dados pareciam mostrar melhora: só 28% dos pedidos tinham espera longa. Eu quase publiquei como resultado. ",N),("Mas era um dado parcial. No fim do dia, o número chegou a 46%.",K),(" O piloto ainda não tinha reduzido a espera.",N)],
 10:[("Mas mostrou que ",N),("estávamos tentando resolver a causa errada",K),(". Na semana seguinte, com o dado na mão, a liderança da loja mudou a forma de alocar gente na expedição — o indicador fechou em 18% e 22%. ",N),("O software mostrou onde a fila travava, e a gente decidiu agir.",K)],
 11:[("O que a IA fez aqui ",N),("não foi acelerar a expedição. Foi tirar ela do escuro.",K),(" Um processo sem sistema é um processo em que ",N),("todo mundo tem uma opinião e ninguém tem dado",K),(". E opinião, com tempo, vira certeza — e isso pode estar prejudicando o seu negócio.",N)],
 12:[("Esse sistema roda hoje sem revisão técnica, fora de qualquer esteira nossa. O coordenador fez o que um teste deve fazer e ",N),("deixou claro tudo que falta para virar produto de verdade",K),(". A empresa que quer que ele tenha feito isso precisa decidir o que vem depois.",N)],
}
def post_runs(n):
    runs=[(f"{n}  ",12,AMBAR,True)]
    for tx,key in SEG[n]:
        runs.append((tx,12.5,(PETROLEO if key else INK),key,key))
    return runs
def story_header(s,kicker,title):
    box(s,Inches(0.55),Inches(0.42),Inches(0.12),Inches(0.82),fill=PETROLEO)
    text(s,Inches(0.8),Inches(0.4),Inches(9.8),Inches(0.3),[[(kicker,12.5,TEAL,True)]])
    text(s,Inches(0.8),Inches(0.68),Inches(10.4),Inches(0.5),[[(title,24,TITLE,True)]])
    box(s,Inches(0.8),Inches(1.2),Inches(0.2),Inches(0.2),fill=CORAL,round_=True)
    text(s,Inches(1.1),Inches(1.16),Inches(9.0),Inches(0.3),[[("Diego do iFood  ·  @diegocbarreto",11,VERDE,True)]])
    c=box(s,Inches(11.5),Inches(0.5),Inches(1.28),Inches(0.46),fill=AREIA,round_=True)
    cp=c.text_frame.paragraphs[0]; cp.alignment=PP_ALIGN.CENTER
    cr=cp.add_run(); cr.text="4:00"; cr.font.size=Pt(12.5); cr.font.bold=True; cr.font.color.rgb=PETROLEO; cr.font.name=FONT
# ---- Case real (iFood): título + sinalização de vídeo (resumo do case a seguir) ----
s=new_slide()
story_header(s,"HISTÓRIA REAL · CLAUDE NA PRÁTICA","Do círculo de giz da Toyota ao Claude no ônibus")
# painel de vídeo
PX,PY,PW,PH=0.8,2.05,11.73,4.55
box(s,Inches(PX),Inches(PY),Inches(PW),Inches(PH),fill=DARK,line=PETROLEO,line_w=1.4,round_=True)
accent(s,PX,PY,PW,AMBAR)
# botão de play (círculo + triângulo)
cx=PX+PW/2; cyd=1.55; cyt=PY+0.95
circ=s.shapes.add_shape(MSO_SHAPE.OVAL,Inches(cx-cyd/2),Inches(cyt),Inches(cyd),Inches(cyd))
circ.fill.solid(); circ.fill.fore_color.rgb=CORAL; circ.line.color.rgb=AREIA; circ.line.width=Pt(2); circ.shadow.inherit=False
tri=s.shapes.add_shape(MSO_SHAPE.ISOSCELES_TRIANGLE,Inches(cx-0.24),Inches(cyt+0.42),Inches(0.62),Inches(0.72))
tri.rotation=90; tri.fill.solid(); tri.fill.fore_color.rgb=WHITE; tri.line.fill.background(); tri.shadow.inherit=False
# legenda
text(s,Inches(PX+0.5),Inches(cyt+cyd+0.18),Inches(PW-1.0),Inches(0.5),
     [[("VÍDEO A SEGUIR  ·  RESUMO DO CASE  ·  4:00",15,AMBAR,True)]],align=PP_ALIGN.CENTER)
text(s,Inches(PX+1.2),Inches(cyt+cyd+0.7),Inches(PW-2.4),Inches(1.0),
     [[("Um coordenador do iFood abriu o Claude no celular dentro de um ônibus e, sozinho, construiu um sistema real que tirou um processo do escuro — da certeza da loja ao dado que mudou a decisão.",15,ONDARK,False)]],
     align=PP_ALIGN.CENTER,line_spacing=1.12)
s.notes_slide.notes_text_frame.text=("~5 min (video 4:00). Rodar aqui o video com o resumo do case do iFood (thread do Diego do iFood · @diegocbarreto). "
 "Ponte: Toyota/Ohno — quem via o problema nao mudava o sistema; o coordenador zerou essa distancia com o Claude, "
 "tirou o processo do escuro e agiu com dado. Fecho do dia: foi exatamente o que fizemos hoje — as ideias da manha "
 "viraram apps ajustados a tarde. Emenda direto nas conclusoes.")
story=s

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
s.notes_slide.notes_text_frame.text=("Slide de consulta — nao conta no tempo; deixar disponivel para depois. Onde continuar depois do workshop: em portugues (Asimov, podcasts, Instagram) e em ingles "
 "(Anthropic/Claude, Karpathy, Ethan Mollick, DeepLearning.AI). Mensagem: na duvida, pergunte para a propria IA.")
refs=s

# ===================== ANEXO: LEITURA PARA CONSTRUÇÃO DE CONTEXTO =====================
s=new_slide()
header(s,"Anexos","Leitura e podcasts para construção de contexto")  # slide de consulta, sem chip de tempo
LIVROS=[("last_economy","The Last Economy","Emad Mostaque","como a IA impactará a economia",TEAL),
        ("poder_nao","O Poder do Não Positivo","William Ury","Negociação: dizer não e ainda chegar ao sim",PETROLEO),
        ("naval","The Almanack of Naval Ravikant","Eric Jorgenson","riqueza, alavancagem e decisão",AMBAR),
        ("zero_to_one","Zero to One","Peter Thiel","como construir algo realmente novo",CORAL),
        ("too_subtle","Am I Being Too Subtle?","Sam Zell","investimento imobiliário e negócios",MENTA),
        ("muito_alem","Muito Além da Hierarquia","Pedro Mandelli","gestão de pessoas além do cargo",VERDE),
        ("making_great_strategy","Making Great Strategy","Sørensen e Carroll","como a estratégia se constrói",TEAL),
        ("corporate_explorer","Corporate Explorer","Binns, O'Reilly e Tushman","inovar de dentro da empresa",PETROLEO)]
# 2 fileiras de 4: capa com legenda embaixo
NC=4; GAP=0.2; BW=(11.73-GAP*(NC-1))/NC; BY,BH,RP=1.66,1.28,2.33   # capas menores: abre espaco para os podcasts
for i,(img,tit,aut,porque,cor) in enumerate(LIVROS):
    x=0.8+(i%NC)*(BW+GAP); y0=BY+(i//NC)*RP
    _iw,_ih=_PILImage.open(base+f"livros/{img}.jpg").size
    ih=BH; iw=ih*_iw/_ih; cx=x+(BW-iw)/2
    box(s,Inches(cx-0.04),Inches(y0-0.04),Inches(iw+0.08),Inches(ih+0.08),fill=cor,round_=True,rad=0.03)
    s.shapes.add_picture(base+f"livros/{img}.jpg",Inches(cx),Inches(y0),Inches(iw),Inches(ih))
    _t=text(s,Inches(x),Inches(y0+BH+0.08),Inches(BW),Inches(0.62),[[(tit,10.5,TITLE,True)],[(aut,9,cor,True)]],align=PP_ALIGN.CENTER,space_after=0,line_spacing=1.0); _t.name="mini_tit"
    _p=text(s,Inches(x),Inches(y0+BH+0.56),Inches(BW),Inches(0.3),[[(porque,9,INK,False)]],align=PP_ALIGN.CENTER,line_spacing=1.0); _p.name="mini_pq"
# podcasts: 3 cartoes com link clicavel (site oficial e canal no YouTube)
PODCASTS=[("All-In","tecnologia, IA e economia","allin.com","https://allin.com/","youtube.com/@allin","https://www.youtube.com/@allin",CORAL),
          ("Market Makers","economia e investimentos","mmakers.com.br","https://mmakers.com.br/","youtube.com/@mmakers","https://www.youtube.com/@mmakers",AMBAR),
          ("Acquired","a história de grandes empresas","acquired.fm","https://www.acquired.fm/","youtube.com/@AcquiredFM","https://www.youtube.com/@AcquiredFM",TEAL)]
_py=6.3; _ph=0.74; _pg=0.2; _pw=(11.73-2*_pg)/3
for _i,(_nm,_ds,_l1,_u1,_l2,_u2,_cor) in enumerate(PODCASTS):
    _x=0.8+_i*(_pw+_pg)
    box(s,Inches(_x),Inches(_py),Inches(_pw),Inches(_ph),fill=CARD,line=CLINE,line_w=1.0,round_=True,rad=0.08)
    box(s,Inches(_x),Inches(_py+0.12),Inches(0.08),Inches(_ph-0.24),fill=_cor,round_=True)
    _t=text(s,Inches(_x+0.18),Inches(_py+0.04),Inches(_pw-0.26),Inches(0.36),
            [[("PODCAST  ",8.5,_cor,True),(_nm,11.5,TITLE,True),("  ·  "+_ds,9,SUB,False)]],space_after=0,line_spacing=1.0,anchor=MSO_ANCHOR.MIDDLE); _t.name="mini_pod"
    _t=text(s,Inches(_x+0.18),Inches(_py+0.38),Inches(_pw-0.26),Inches(0.3),
            [[(_l1,9.5,TEAL,True,True),("   ·   ",9.5,SUB,False),(_l2,9.5,TEAL,True,True)]],space_after=0,line_spacing=1.0,anchor=MSO_ANCHOR.MIDDLE); _t.name="mini_podlink"
    _rs=_t.text_frame.paragraphs[0].runs; _rs[0].hyperlink.address=_u1; _rs[2].hyperlink.address=_u2
_m=text(s,Inches(0.8),Inches(7.1),Inches(11.73),Inches(0.32),[[("Para ler e ouvir com calma, depois do workshop: ajudam a enxergar o contexto em que a IA muda o negócio.",10,SUB,True)]],align=PP_ALIGN.CENTER,line_spacing=1.0); _m.name="mini_rodape"
s.notes_slide.notes_text_frame.text=("Slide de consulta — nao conta no tempo. Leitura para construcao de contexto: The Last Economy (Emad Mostaque), "
 "O Poder do Nao Positivo (William Ury), The Almanack of Naval Ravikant (Eric Jorgenson), Zero to One (Peter Thiel com Blake Masters), "
 "Am I Being Too Subtle? (Sam Zell), Muito Alem da Hierarquia (Pedro Mandelli), Making Great Strategy (Jesper Sorensen e Glenn Carroll) "
 "e Corporate Explorer (Andrew Binns, Charles O'Reilly e Michael Tushman). Podcasts: All-In (allin.com), Market Makers (mmakers.com.br) "
 "e Acquired (acquired.fm), todos tambem no YouTube. Indicacoes para quem quiser aprofundar depois.")
livros=s

# ===================== FECHO: ACELERAÇÃO E LONGEVIDADE NO CICLO DE VIDA =====================
longev=_infografico("aceleracao_longevidade","PARA FECHAR · ACELERAÇÃO E LONGEVIDADE NO CICLO DE VIDA",
 "Slide de fecho (antes do slide animado). Aceleracao e longevidade no ciclo de vida do shopping: do varejo tradicional, que "
 "atinge o pico e declina, ao ecossistema integrado, que maximiza o NOI e perpetua o ciclo. Quatro alavancas: adensamento "
 "multiuso (torres residenciais, comerciais, medicas e centro de convencoes — fluxo cativo permanente); retail media e midia "
 "digital (telas no mall, elevadores e aplicativos com beneficios patrocinados); picos de fluxo e novas receitas (feiras "
 "qualificadas, atracoes integradas e bilheteria); reciclagem de capital e perpetuidade (FII K, reinvestimento e gestao de "
 "portfolio para capturar valor). Amarra o dia: e o mapa de onde a IA e os apps aceleram a execucao.",borda=VERDE)

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
s.notes_slide.notes_text_frame.text=("Slide de fecho. A frase fecha o workshop: acelerar nossa inteligencia — "
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
_anima_fim()

# ===================== SLIDES INCLUÍDOS (PDF "incluir": páginas em imagem, nas posições da agenda) =====================
# Paginas convertidas em slides EDITAVEIS: incluir/incluir.pdf -> incluir/incluir_convertido.pptx
# (soffice --headless --infilter="impress_pdf_import" --convert-to pptx incluir.pdf). Cada pagina e copiada
# forma a forma (texto, vetores e imagens) e passa por uma limpeza: titulos com letras espacadas viram texto
# corrido com espacamento de caractere, e nomes de fonte quebrados na conversao sao corrigidos.
import io as _io, re as _re
from copy import deepcopy as _dc
_SRC=Presentation(base+"incluir/incluir_convertido.pptx")
_COPIADOS=set()   # slide_ids que mantem fonte e tamanho originais (fora do ajuste Gantari/telao)
_FONTES={"AptosDisplay":"Aptos Display","CambriaMath":"Cambria Math"}
_MAPA={"VI SÃO   G ERAL":"VISÃO GERAL","PRINCIPAI S  BENEFÍCI OS":"PRINCIPAIS BENEFÍCIOS","A SOL UÇÃO":"A SOLUÇÃO","3  ·  NOT A  DE  RI SCO":"3  ·  NOTA DE RISCO",
 "BL O CO   4   ·   CAS E  2 / 7   ·   SHO P PI NG   T I J UCA   ·   CO NT EX TO   3 / 3":"BLOCO 4 · CASE 2/7 · SHOPPING TIJUCA · CONTEXTO 3/3",
 "PA RA  RE PL I CAR":"PARA REPLICAR","AP REN DI Z ADO S":"APRENDIZADOS",
 "RE CEI T A  N ÃO   FA TU RADA   CO NF I RM AD A":"RECEITA NÃO FATURADA CONFIRMADA",
 "N AT AL  2 0 26  ·  10  P RO J ET O S  AN AL IS AD OS":"NATAL 2026 · 10 PROJETOS ANALISADOS","AN TE S":"ANTES","HO JE":"HOJE",
 "ME L HO RI A C ON T ÍNU A  · 2 02 3 –2 02 6":"MELHORIA CONTÍNUA · 2023–2026","P RIN CI PA IS  AV AN ÇO S":"PRINCIPAIS AVANÇOS",
 "P RO CE SS O S E  R OT IN A":"PROCESSOS E ROTINA","F UN CIO N A ·  PA DR ON IZ AR  (S DC A)":"FUNCIONA · PADRONIZAR (SDCA)",
 "ME L HO RA R  · AG IR  (P DC A)":"MELHORAR · AGIR (PDCA)"}
def _junta_espacado(t):
    """'C A S E   D E' -> 'CASE DE' quando todas as letras vem separadas por um espaco (palavras por 2+)."""
    core=t.strip()
    if len(core)<3 or " " not in core: return None
    words=_re.split(r" {2,}",core)
    if not all(all(len(tok)==1 for tok in w.split(" ")) for w in words): return None
    if sum(len(w.replace(" ","")) for w in words)<2: return None
    return " ".join(w.replace(" ","") for w in words)+(" " if t.endswith(" ") else "")
def _limpa(s):
    for el in s._element.iter():
        if el.tag in (qn("a:latin"),qn("a:ea"),qn("a:cs")) and el.get("typeface") in _FONTES: el.set("typeface",_FONTES[el.get("typeface")])
    for sh in s.shapes:
        if not sh.has_text_frame or len(sh.text_frame.paragraphs)!=1: continue
        p=sh.text_frame.paragraphs[0]; runs=p.runs
        if not runs: continue
        t="".join(r.text for r in runs)
        novo=_MAPA.get(t.strip()); fator=12
        if novo is None: novo=_junta_espacado(t); fator=25
        if not novo: continue
        runs[0].text=novo
        for r in runs[1:]: p._p.remove(r._r)
        sz=runs[0].font.size.pt if runs[0].font.size else 10
        runs[0]._r.get_or_add_rPr().set("spc",str(int(sz*fator)))   # mantem o visual espacado
def _pg(n,notas,src_pres=None):
    src=(src_pres or _SRC).slides[n-1]
    s=prs.slides.add_slide(prs.slide_layouts[6]); tree=s.shapes._spTree
    for el in src.shapes._spTree.iterchildren():
        if el.tag in (qn("p:nvGrpSpPr"),qn("p:grpSpPr")): continue
        e=_dc(el)
        for _x in e.iter(qn("a:ext")):   # linhas retas do PDF chegam com largura/altura zero: minimo de 0,002 in
            for _k in ("cx","cy"):
                if _x.get(_k)=="0": _x.set(_k,"1829")
        for blip in e.iter(qn("a:blip")):
            rid=blip.get(qn("r:embed"))
            if rid:
                _,nid=s.part.get_or_add_image_part(_io.BytesIO(src.part.related_part(rid).blob)); blip.set(qn("r:embed"),nid)
        tree.append(e)
    _limpa(s); _COPIADOS.add(s.slide_id)
    s.notes_slide.notes_text_frame.text=notas; return s
d_recap=divider("Abertura","Abertura – Recap Guidelines 2026",None)
d_recap.notes_slide.notes_text_frame.text="Abertura (09:05). Recap das Guidelines 2026 — ~8 min no slide seguinte."
guideline=_pg(2,"~8 min (09:05 – 09:15). Guidelines 2026, frente a frente: seguranca, estacionamento, mall, midia, processos, comercial, novos, maduros e produto.")
farol=_pg(4,"~10 min (09:15). Farol de metas do portfolio: real YTD (Mereo) e forecast por superintendente.")
pdl=_pg(6,"~5 min. Programa de Desenvolvimento de Lideranca: 6 modulos, um encontro por mes, de novembro/2026 a abril/2027. "
 "Amarra com o primeiro limitante da estrategia: gente apta a tocar o crescimento. QR code para inscricao.")
# PDF final do workshop (referencia VF): 4 paginas editadas no PowerPoint, convertidas como as demais
# (incluir/vf_convertido.pptx = paginas 30, 46, 94 e 100 do PDF VF): video introdutorio, Del Rey 4/4, historia real e "Por dentro do Manual"
_VF=Presentation(base+"incluir/vf_convertido.pptx")
_CASOS_PG=[(1,"Shopping Del Rey","Auditoria de CFOPs",[8,9,10,11]),(2,"Shopping Tijuca","Auditoria de Boletos",[12,13,14,15]),
           (3,"Mooca Plaza","Simulador de Laudo",[16,17,18,19,20,21,22]),(4,"Mooca Plaza","Programa de Beneficios com IA",[23,24,26,25]),
           (5,"Plaza Niteroi","CRM Comercializacao",[27,28,29,30]),(6,"Plaza Niteroi","Comercial em Movimento",[31,32,33,34]),
           (7,"Plaza Niteroi","Controle de Exaustao",[35,36,37,38])]
casos_pg=[]
for _k,_shp,_nome,_pgs in _CASOS_PG:
    for _i,_p in enumerate(_pgs):
        _n=(f"Case {_k}/7 — {_shp} | {_nome}: slide {_i+1}/{len(_pgs)} (10 min no total do case). Slide preenchido pelo shopping.")
        if _p==14: _n+=" ATENCAO: no original este slide tem um video — no PDF so veio a capa; colar o video aqui antes do workshop."
        casos_pg.append(_pg(2,_n,_VF) if _p==11 else _pg(_p,_n))   # Del Rey 4/4: versao atualizada do PDF final
natal=[_pg(41,"~4 min. A evolucao do Natal ALLOS: de campanha sazonal para plataforma de negocio."),
       _pg(42,"~3 min. A evolucao da maturidade 2023–2026 e os principais avancos (+R$ 5,1 mi em receitas diretas projetadas)."),
       _pg(43,"~3 min. Processos e rotina: o que padronizar (SDCA) e o que melhorar (PDCA).")]
monet=[_pg(_p,f"Case de monetizacao — {_c} (10 min no total do case).") for _p,_c in
       [(46,"Venda Certa"),(47,"Venda Certa"),(48,"Venda Certa"),(49,"Venda Certa"),(50,"Venda Certa"),
        (51,"Sicredi"),(52,"Sicredi"),(53,"Sicredi"),(54,"Sicredi"),(55,"Sicredi"),(56,"Sicredi"),(57,"Dinisa"),(58,"Dinisa")]]
pro=[_pg(_p,"P.R.O. — Programa de Reconhecimento Operacional (~20 min nos 13 slides, ~1,5 min cada).") for _p in range(61,74)]
# ---- "Por dentro do Manual Operacional": prints dos documentos da v3.2 em cascata (manual_prints/) ----
from pptx.oxml import parse_xml as _px
por_dentro=new_slide()
header(por_dentro,"Próximos passos · 1 · manual operacional","Por dentro do Manual Operacional","2 min")
_PR=["01_doc2_manual","02_doc3_checklists","03_doc5_academia","04_doc6_lideranca",
     "05_sete_documentos","06_pilares_alicerces","07_indice_etapas"]
_CH="08_checklist_coordenador"
_H=4.55; _chH=5.3
_chW=_chH*_PILImage.open(base+f"manual_prints/{_CH}.jpg").size[0]/_PILImage.open(base+f"manual_prints/{_CH}.jpg").size[1]
_chX=12.53-_chW; _x0=0.8; _wl=_H*_PILImage.open(base+f"manual_prints/{_PR[-1]}.jpg").size[0]/_PILImage.open(base+f"manual_prints/{_PR[-1]}.jpg").size[1]
_step=(_chX+0.55-_x0-_wl)/(len(_PR)-1)
def _sombra(pic):
    pic.line.color.rgb=BEGE; pic.line.width=Pt(0.75)
    pic._element.spPr.append(_px('<a:effectLst xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">'
        '<a:outerShdw blurRad="88900" dist="31750" dir="2700000" algn="tl" rotWithShape="0"><a:srgbClr val="0D454A"><a:alpha val="30000"/></a:srgbClr></a:outerShdw></a:effectLst>'))
for _i,_n in enumerate(_PR):   # da esquerda (atrás) para a direita (na frente)
    _w,_h=_PILImage.open(base+f"manual_prints/{_n}.jpg").size
    _pic=por_dentro.shapes.add_picture(base+f"manual_prints/{_n}.jpg",Inches(_x0+_i*_step),Inches(1.8+_i*0.1),height=Inches(_H)); _sombra(_pic)
_sombra(por_dentro.shapes.add_picture(base+f"manual_prints/{_CH}.jpg",Inches(_chX),Inches(1.72),height=Inches(_chH)))
por_dentro.notes_slide.notes_text_frame.text=("~2 min. Por dentro do Manual Operacional v3.2 (out/2026): 7 documentos — 1 Guia de Utilizacao, 2 Manual "
 "Operacional (20 Etapas e 178 rotinas), 3 Checklists de Bolso (uma folha por posicao e um cartao por Etapa), 4 Anexos Operacionais, "
 "5 Academia Operacional (3-30-5), 6 Lideranca e Gestao (PDL) e 7 Programa P.R.O. Na tela: as capas, os 7 documentos, os 4 pilares e "
 "3 alicerces, o indice das Etapas e, na frente, o checklist mensal de um cargo (Coordenador de Negocios).")
vf_video=_pg(1,("Video introdutorio: Futuro dos Shoppings (4 min 37 s). ATENCAO: no arquivo final o video estava embutido; "
 "aqui vem a capa — inserir o video (Inserir > Video) sobre a capa antes do workshop."),_VF)
vf_story=_pg(3,story.notes_slide.notes_text_frame.text+"\n\nATENCAO: no arquivo final este slide tem o video 'Do Circulo de Giz a IA' — inserir o video sobre a capa antes do workshop.",_VF)
vf_pordentro=_pg(4,por_dentro.notes_slide.notes_text_frame.text,_VF)
guide_fim=_pg(75,"~5 min (17:30 – 17:35). Fecho: as Guidelines 2026 ligadas ao que vimos hoje — Guarda Alta, gestao de eventos, Venda Certa, "
 "Numeros da Sorte Extra, Status Match, regua/foco inativos, capex de aceleracao.")

# ===================== ORDEM FINAL =====================
lst=prs.slides._sldIdLst; ids=list(lst)
R=lambda k: ids[REUSE[k]]
def sid(sl): return ids[list(prs.slides).index(sl)]
_exaust=casos_pg[-4:]; _casos6=casos_pg[:-4]
_primeiros=[]; _k=0
for _kk,_shp,_nome,_pgs in _CASOS_PG[:6]: _primeiros.append(_casos6[_k]); _k+=len(_pgs)
if V90:
    order=[sid(capa), sid(agenda), sid(d_estr), sid(estr_ciclo), sid(estr_reit), sid(estr_gargalos),
           sid(d2), R("iaml"), R("llm"), R("pensa"), sid(chat_ag), sid(ferr), sid(modelos), sid(esforco),
           sid(conect), sid(conect_pp), sid(skill_pp), sid(harness), sid(harness2), sid(criacao), R("salv"), sid(salvcfg), sid(app_seg), sid(api_seg),
           sid(d3), sid(vf_video), R("tese"), sid(app1), sid(app2), sid(app3), sid(app4),
           sid(d1), sid(ordem), *[sid(c) for c in _primeiros],
           sid(vf_story), R("enc"), sid(refs), sid(livros),
           sid(fim)]
else:
    order=[sid(capa), sid(agenda), sid(d_estr), sid(estr_ciclo), sid(estr_reit), sid(estr_gargalos), sid(pdl),
           sid(d2), R("iaml"), R("llm"), R("pensa"),
           sid(chat_ag), sid(ferr), sid(novidades),
           sid(mercado_s), sid(modelos), sid(esforco), sid(conect), sid(conect_pp), sid(skill_pp), sid(harness), sid(harness2), sid(criacao), R("salv"), sid(salvcfg), sid(anon), sid(app_seg), sid(api_seg),
           sid(d3), sid(vf_video), R("tese"), R("impacto"),
           sid(app1), sid(av1), sid(app2), sid(av2), sid(app3), sid(av3), sid(app4), sid(av4),
           sid(d4), sid(cases), sid(times), sid(avaliar), sid(apres),
           sid(d1), sid(ordem), sid(formato), *[sid(c) for c in casos_pg],
           sid(d5), sid(rec0), sid(rec1), sid(rec2), *[sid(c) for c in monet],
           sid(d8), sid(show),
           sid(vf_story),
           R("enc"), sid(refs), sid(livros), sid(longev),
           sid(d_prox),
           sid(d6), sid(manual), sid(pro[0]), sid(vf_pordentro), *[sid(c) for c in pro[1:]],
           sid(d_guarda), *[sid(g) for g in guarda],
           sid(fim)]
for e in ids: lst.remove(e)
for e in order: lst.append(e)
# slides que ficaram fora da ordem (sobras do deck base): remove a relacao para nao gravar slides orfaos no arquivo
_listed={e.get(qn("r:id")) for e in lst}
for _rid,_rel in list(prs.part.rels.items()):
    if _rel.reltype.endswith("/slide") and _rid not in _listed: prs.part.drop_rel(_rid)
# slides ocultos (ficam no arquivo; o PowerPoint pula na apresentacao)
for _h in (novidades, mercado_s, impacto_sl, anon, d_prox, longev, manual,
           pdl, av1, av2, av3, av4, formato, *_exaust):   # os ultimos: ocultos no arquivo final (PDF VF)
    _h._element.set("show","0")
# casos 1-6: numeracao "CASE n/6" nos slides copiados; na versao 1h30 o bloco de cases vira o Bloco 3 e cada case tem 2 min
for _sl in _casos6:
    for _sh in _sl.shapes:
        if _sh.has_text_frame:
            for _p in _sh.text_frame.paragraphs:
                for _r in _p.runs:
                    _t=_re.sub(r"CASE ([1-6]) ?/ ?7",r"CASE \1/6",_r.text)
                    if V90 and _t.strip()=="10 min": _t=_t.replace("10 min","2 min")
                    if _t!=_r.text: _r.text=_t
# Copilot no slide do LLM (reaproveitado do deck base) e ajustes da versao 1h30 nos textos
_TROCA={"O que é um LLM — e como Claude e ChatGPT funcionam":"O que é um LLM — e como Claude, ChatGPT e Copilot funcionam",
        "COMO CLAUDE E CHATGPT FUNCIONAM":"COMO CLAUDE, CHATGPT E COPILOT FUNCIONAM",
        "Claude (Anthropic) e ChatGPT (OpenAI) são marcas da mesma tecnologia.":"Claude (Anthropic), ChatGPT (OpenAI) e Copilot (Microsoft, com modelos da OpenAI e da Anthropic) são a mesma tecnologia."}
if V90:
    _TROCA.update({"BLOCO 4":"BLOCO 3","Bloco 4":"Bloco 3"})
for _sl in prs.slides:
    for _sh in _sl.shapes:
        if not _sh.has_text_frame: continue
        for _p in _sh.text_frame.paragraphs:
            for _r in _p.runs:
                _t=_r.text
                for _a,_b in _TROCA.items(): _t=_t.replace(_a,_b)
                if V90: _t=_re.sub(r"É a (outra )?ferramenta que o time de (\w+) vai testar no bloco 3\.",r"É a ferramenta do time de \2 — já no ar para o shopping usar.",_t)
                if _t!=_r.text: _r.text=_t
        if "como Claude, ChatGPT e Copilot funcionam" in _sh.text_frame.text:
            for _p in _sh.text_frame.paragraphs:
                for _r in _p.runs: _r.font.size=Pt(24)

# vídeo do shopping do futuro: nova duração (4 min 37 s)
for _sl in prs.slides:
    for _sh in _sl.shapes:
        if _sh.has_text_frame and _sh.text_frame.text.strip()=="7 MIN 30 S":
            for _p in _sh.text_frame.paragraphs:
                for _r in _p.runs:
                    if "7 MIN 30 S" in _r.text: _r.text=_r.text.replace("7 MIN 30 S","4 MIN 37 S")
            _sl.notes_slide.notes_text_frame.text=("Reproduza o video do shopping do futuro (4 min 37 s). Apos o video, faca a transicao: "
             "'agora vamos ver a tese e o impacto do Shopping Inteligente e, principalmente, como cada app nasceu no Claude Code'.")

# tese e missao (slide reaproveitado): com a fonte maior a citacao estourava a caixa — caixa cresce e o resto desce
for _sl in prs.slides:
    if any(_sh.has_text_frame and "A tese e a missão" in _sh.text_frame.text for _sh in _sl.shapes):
        for _sh in _sl.shapes:
            _t=_sh.top/914400
            if _t>=3.9: _sh.top=_sh.top+Inches(0.5)
            elif _t>=1.8: _sh.height=_sh.height+Inches(0.5)
# ---- fonte Allos (Gantari) + escala de leitura para telao em todos os slides ----
def _bump(pt):
    """Nada abaixo de 13pt (leitura no telao); corpo ~+12%; titulos (>=22pt) preservados."""
    if pt>=22: return pt
    return min(22.0,max(13.0,int(pt*1.12*2+0.5)/2))
for sl in prs.slides:
    if sl.slide_id in _COPIADOS: continue   # paginas convertidas do PDF mantem fonte e tamanho originais
    for sh in sl.shapes:
        if sh.has_text_frame:
            _mono=sh.name.startswith("mono")
            for p in sh.text_frame.paragraphs:
                for r in p.runs:
                    if not _mono: r.font.name=FONT
                    if r.font.size is not None and not sh.name.startswith("mini"): r.font.size=Pt(_bump(r.font.size.pt))
# ajuste fino em slide reaproveitado: com a fonte maior o rotulo do token quebrava sobre os chips
for sl in prs.slides:
    for sh in sl.shapes:
        if not sh.has_text_frame: continue
        _t=sh.text_frame.text
        if "vira 4 tokens" in _t:
            for p in sh.text_frame.paragraphs:
                for r in p.runs:
                    if "vira 4 tokens" in r.text: r.text=r.text.replace("vira 4 tokens","= 4 tokens")
        elif "subrepresentadas" in _t:   # grafia (slide reaproveitado do deck base)
            for p in sh.text_frame.paragraphs:
                for r in p.runs: r.text=r.text.replace("subrepresentadas","sub-representadas")
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

out=base+("Workshop_Shopping_Inteligente_1h30.pptx" if V90 else "Workshop_Shopping_Inteligente_VF.pptx")
prs.save(out)

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
_checa_pacote(out)
p2=Presentation(out); SS=list(p2.slides)
print("slides:",len(SS))
for i,sl in enumerate(SS):
    ts=[sh.text_frame.text.strip() for sh in sl.shapes if sh.has_text_frame and sh.text_frame.text.strip()]
    k=ts[0].splitlines()[0] if ts else ""
    t=ts[1].splitlines()[0] if len(ts)>1 else ""
    print(f"[{i+1:2}] {k[:30]:30} | {t[:42]}")
