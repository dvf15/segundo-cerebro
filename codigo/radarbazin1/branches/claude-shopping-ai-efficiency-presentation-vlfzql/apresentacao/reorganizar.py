# -*- coding: utf-8 -*-
"""
Reorganiza o fluxo da apresentacao do Carioca Shopping na ordem pedida:
  1) Conceitos de IA + salvaguardas   2) Video   3) Shopping Inteligente e agentes
  4) Exercicio de prompt   (+ capa no inicio e encerramento no fim)
- Reetiqueta os kickers (ATO 1/ATO 2 -> blocos coerentes).
- Reescreve o slide ROTEIRO como agenda em 4 partes.
- Corrige referencias 'do Ato 1' nas notas.
Roda DEPOIS de gerar_carioca.py, sobre o proprio arquivo Carioca (in place).
"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

PETROLEO=RGBColor(0x00,0x61,0x6F); VERDE=RGBColor(0x0D,0x45,0x4A); TEAL=RGBColor(0x36,0x8C,0x82)
CORAL=RGBColor(0xCD,0x51,0x51); MENTA=RGBColor(0x6C,0xC6,0x80); AMBAR=RGBColor(0xED,0xA7,0x54)
BEGE=RGBColor(0xCC,0xC5,0xBC); AREIA=RGBColor(0xE5,0xDE,0xD4); WHITE=RGBColor(0xFF,0xFF,0xFF)
TITLE=PETROLEO; SUB=TEAL; INK=VERDE; CARD=AREIA; CLINE=BEGE; FONT="Calibri"

base="/home/user/radarbazin1/apresentacao/"
f=base+"Shopping_Inteligente_IA_Carioca_Shopping.pptx"
prs=Presentation(f); SW,SH=prs.slide_width,prs.slide_height
S=list(prs.slides)

def box(s,l,t,w,h,fill=None,line=None,line_w=1.0,round_=False):
    shp=s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE if round_ else MSO_SHAPE.RECTANGLE,l,t,w,h)
    if fill is None: shp.fill.background()
    else: shp.fill.solid(); shp.fill.fore_color.rgb=fill
    if line is None: shp.line.fill.background()
    else: shp.line.color.rgb=line; shp.line.width=Pt(line_w)
    shp.shadow.inherit=False; return shp
def text(s,l,t,w,h,runs,align=PP_ALIGN.LEFT,anchor=MSO_ANCHOR.TOP,space_after=4,line_spacing=1.0):
    tb=s.shapes.add_textbox(l,t,w,h); tf=tb.text_frame; tf.word_wrap=True; tf.vertical_anchor=anchor
    for i,para in enumerate(runs):
        p=tf.paragraphs[0] if i==0 else tf.add_paragraph()
        p.alignment=align; p.space_after=Pt(space_after); p.space_before=Pt(0); p.line_spacing=line_spacing
        for (tx,sz,co,bo) in para:
            r=p.add_run(); r.text=tx; r.font.size=Pt(sz); r.font.color.rgb=co; r.font.bold=bo; r.font.name=FONT
    return tb

# ================= 1) REETIQUETAR KICKERS =================
KMAP=[("O que é IA e Machine","CONCEITOS DE IA · FUNDAMENTO"),
      ("O que é um LLM","CONCEITOS DE IA · LLM E TOKEN"),
      ("Como a IA pensa","CONCEITOS DE IA · COMO ELA PENSA"),
      ("Salvaguardas","CONCEITOS DE IA · SALVAGUARDAS"),
      ("A tese e a missão","SHOPPING INTELIGENTE · A TESE"),
      ("Dores mapeadas","SHOPPING INTELIGENTE · O PROBLEMA"),
      ("ecossistema de agentes","SHOPPING INTELIGENTE · ARQUITETURA"),
      ("Orquestrador e a Plataforma","SHOPPING INTELIGENTE · NÚCLEO"),
      ("Agentes de Descoberta","SHOPPING INTELIGENTE · CAMADA 1"),
      ("Agentes de Execução","SHOPPING INTELIGENTE · CAMADA 2"),
      ("Princípios que guiam","SHOPPING INTELIGENTE · PRINCÍPIOS"),
      ("Análise de dados sem ser","SHOPPING INTELIGENTE · CAPACITAÇÃO"),
      ("produtividade move","SHOPPING INTELIGENTE · IMPACTO"),
      ("Plano 30-60-90","SHOPPING INTELIGENTE · ADOÇÃO"),
      ("Da visão à sua mesa","PRÁTICA · A VIRADA"),
      ("Claude Chat, Cowork e Code","PRÁTICA · FERRAMENTAS"),
      ("Anatomia de um bom pedido","CONCEITOS DE IA · MÉTODO C.R.I.A.R."),
      ("Exercício ao vivo","PRÁTICA · MÃO NA MASSA")]
def set_kicker(sh,newtext):
    p=sh.text_frame.paragraphs[0]; p.runs[0].text=newtext
    for r in p.runs[1:]: r.text=""
for sl in S:
    tshapes=[sh for sh in sl.shapes if sh.has_text_frame and sh.text_frame.text.strip()]
    kick=None
    for sh in tshapes:
        tt=sh.text_frame.text.strip()
        if tt.startswith("ATO 1 · ") or tt.startswith("ATO 2 · "): kick=sh; break
    if kick is None: continue
    old=kick.text_frame.text.strip()
    if old.startswith("ATO 2 · CASO"):
        set_kicker(kick, old.replace("ATO 2 · ","AGENTES · ")); continue
    # titulo = maior fonte
    def fsz(sh):
        try: return sh.text_frame.paragraphs[0].runs[0].font.size or 0
        except: return 0
    title_sh=max(tshapes,key=fsz); title=title_sh.text_frame.text
    for sub,nk in KMAP:
        if sub in title: set_kicker(kick,nk); break

# ================= 2) CORRIGIR NOTAS ('do Ato 1') =================
for sl in S:
    if sl.has_notes_slide:
        tf=sl.notes_slide.notes_text_frame; t=tf.text
        if "do Ato 1" in t or "do Ato 2" in t:
            tf.text=t.replace("do Ato 1","da visão do Shopping Inteligente").replace("do Ato 2","da prática")

# ================= 3) REESCREVER O SLIDE ROTEIRO =================
r=S[2]
for sh in list(r.shapes): sh._element.getparent().remove(sh._element)
bg=r.shapes.add_shape(MSO_SHAPE.RECTANGLE,0,0,SW,SH)
bg.fill.solid(); bg.fill.fore_color.rgb=WHITE; bg.line.fill.background(); bg.shadow.inherit=False
box(r,Inches(0.55),Inches(0.55),Inches(0.12),Inches(0.95),fill=PETROLEO)
text(r,Inches(0.8),Inches(0.5),Inches(9.8),Inches(0.4),[[("ROTEIRO",13,TEAL,True)]])
text(r,Inches(0.8),Inches(0.85),Inches(11.0),Inches(0.9),[[("O caminho de hoje, em 4 partes",29,TITLE,True)]])
c=box(r,Inches(11.25),Inches(0.55),Inches(1.55),Inches(0.5),fill=AREIA,round_=True)
cp=c.text_frame.paragraphs[0]; cp.alignment=PP_ALIGN.CENTER
cr=cp.add_run(); cr.text="≈ 48 min"; cr.font.size=Pt(13); cr.font.bold=True; cr.font.color.rgb=PETROLEO; cr.font.name=FONT
rows=[("1","Conceitos de IA e salvaguardas","o que é IA, LLM e token; como pedir (C.R.I.A.R.) e usar com segurança","~10 min",TEAL),
      ("2","▶  Vídeo introdutório","o Shopping Inteligente em movimento","7,5 min",AMBAR),
      ("3","Shopping Inteligente e seus agentes","a tese, o ecossistema e os 8 agentes na prática","~23 min",PETROLEO),
      ("4","Exercício de prompt","mão na massa + as ferramentas: Chat, Cowork e Code","~8 min",VERDE)]
y=2.02; RH=0.98; GAP=0.2
for num,name,desc,tempo,acc in rows:
    box(r,Inches(0.8),Inches(y),Inches(11.73),Inches(RH),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    box(r,Inches(0.8),Inches(y),Inches(0.12),Inches(RH),fill=acc)
    nb=box(r,Inches(1.05),Inches(y+0.19),Inches(0.6),Inches(0.6),fill=acc,round_=True)
    npf=nb.text_frame; npf.word_wrap=False; np=npf.paragraphs[0]; np.alignment=PP_ALIGN.CENTER
    nr=np.add_run(); nr.text=num; nr.font.size=Pt(20); nr.font.bold=True; nr.font.color.rgb=WHITE; nr.font.name=FONT
    npf.vertical_anchor=MSO_ANCHOR.MIDDLE
    text(r,Inches(1.9),Inches(y+0.13),Inches(8.0),Inches(0.4),[[(name,17,TITLE,True)]])
    text(r,Inches(1.9),Inches(y+0.55),Inches(9.2),Inches(0.35),[[(desc,12.5,SUB,False)]])
    text(r,Inches(10.3),Inches(y),Inches(2.2),Inches(RH),[[(tempo,15,VERDE,True)]],align=PP_ALIGN.RIGHT,anchor=MSO_ANCHOR.MIDDLE)
    y+=RH+GAP
tb=box(r,Inches(0.8),Inches(y+0.02),Inches(11.73),Inches(0.55),fill=PETROLEO,round_=True)
text(r,Inches(1.05),Inches(y+0.04),Inches(11.2),Inches(0.5),
     [[("Tempo total ≈ 48 minutos  ·  ",13,AMBAR,True),
       ("vídeo 7,5 min + apresentação ~34,5 min + exercício 6 min",13,WHITE,True)]],anchor=MSO_ANCHOR.MIDDLE)
r.notes_slide.notes_text_frame.text=(
 "Agenda (1 min). Quatro partes: (1) conceitos de IA e salvaguardas — nivelar o time; "
 "(2) video introdutorio; (3) o Shopping Inteligente e seus agentes — a visao e os casos; "
 "(4) exercicio de prompt — mao na massa. ~48 min no total, com o video de 7,5 min.")

# ================= 4) REORDENAR OS SLIDES =================
# indices 0-based na ordem NOVA (relativo à saída do gerar_carioca.py):
# conceitos (IA/ML, LLM, como pensa, salvaguardas, C.R.I.A.R.) -> vídeo ->
# Shopping Inteligente e agentes -> A virada -> exercício -> ferramentas -> fecho
new_order=[0, 2, 11,12,13,25, 14, 1, 3,4,5,6,7,8,9, 16,17,18,19,20,21, 22,23,24, 10, 26, 15, 27,28]
assert sorted(new_order)==list(range(len(S))), "ordem invalida"
lst=prs.slides._sldIdLst; ids=list(lst)
for e in ids: lst.remove(e)
for idx in new_order: lst.append(ids[idx])

prs.save(f)
# verificacao
p2=Presentation(f); SS=list(p2.slides)
print("slides:",len(SS))
for i,sl in enumerate(SS):
    ts=[sh.text_frame.text.strip() for sh in sl.shapes if sh.has_text_frame and sh.text_frame.text.strip()]
    kick=ts[0].splitlines()[0] if ts else ""
    hid="(H)" if sl._element.get("show")=="0" else "   "
    print(f"[{i+1:2}]{hid} {kick[:44]}")
