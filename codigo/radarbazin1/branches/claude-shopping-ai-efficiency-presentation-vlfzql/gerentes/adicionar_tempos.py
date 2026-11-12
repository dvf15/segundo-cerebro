# -*- coding: utf-8 -*-
"""
Adiciona marcadores de tempo (chip no topo-direito) a cada slide do workshop de
gerentes e um slide de 'Roteiro de tempo' com o orcamento e o total.
Entrada: 06_Workshop_Agentes_v3.1.pptx  -> Saida: 06_Workshop_Agentes_v3.2.pptx
"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

PETROLEO=RGBColor(0x00,0x61,0x6F); VERDE=RGBColor(0x0D,0x45,0x4A); TEAL=RGBColor(0x36,0x8C,0x82)
AMBAR=RGBColor(0xED,0xA7,0x54); BEGE=RGBColor(0xCC,0xC5,0xBC); AREIA=RGBColor(0xE5,0xDE,0xD4)
WHITE=RGBColor(0xFF,0xFF,0xFF); INK=VERDE; FONT="Calibri"

def _box(s,l,t,w,h,fill=None,line=None,lw=1.0,round_=False):
    sp=s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE if round_ else MSO_SHAPE.RECTANGLE,l,t,w,h)
    if fill is None: sp.fill.background()
    else: sp.fill.solid(); sp.fill.fore_color.rgb=fill
    if line is None: sp.line.fill.background()
    else: sp.line.color.rgb=line; sp.line.width=Pt(lw)
    sp.shadow.inherit=False; return sp
def _text(s,l,t,w,h,runs,align=PP_ALIGN.LEFT,anchor=MSO_ANCHOR.TOP,sa=3,ls=1.0):
    tb=s.shapes.add_textbox(l,t,w,h); tf=tb.text_frame; tf.word_wrap=True; tf.vertical_anchor=anchor
    for i,para in enumerate(runs):
        p=tf.paragraphs[0] if i==0 else tf.add_paragraph()
        p.alignment=align; p.space_after=Pt(sa); p.space_before=Pt(0); p.line_spacing=ls
        for (tx,sz,co,bo) in para:
            r=p.add_run(); r.text=tx; r.font.size=Pt(sz); r.font.color.rgb=co; r.font.bold=bo; r.font.name=FONT
    return tb

def time_chip(s, label, fill=PETROLEO, fg=WHITE):
    w=Inches(0.28+0.088*len(label)); rt=Inches(9.62); h=Inches(0.3)
    c=_box(s, rt-w, Inches(0.24), w, h, fill=fill, round_=True)
    tf=c.text_frame; tf.word_wrap=False
    tf.margin_top=Pt(1); tf.margin_bottom=Pt(1); tf.margin_left=Pt(7); tf.margin_right=Pt(7)
    p=tf.paragraphs[0]; p.alignment=PP_ALIGN.CENTER; r=p.add_run(); r.text=label
    r.font.size=Pt(9); r.font.bold=True; r.font.color.rgb=fg; r.font.name=FONT; return c

# mapa: indice 1-based -> (label, tipo)  tipos: min | grupo | apres | consulta | skip
TMAP={
 1:("2 min","min"),2:("3 min","min"),3:("2 min","min"),4:("3 min","min"),5:("3 min","min"),
 6:("2 min","min"),7:("3 min","min"),8:("15 min","min"),9:("3 min","min"),10:("2 min","min"),
 11:("3 min","min"),12:("80 min · grupos","grupo"),
 13:("consulta","consulta"),14:("consulta","consulta"),15:("consulta","consulta"),16:("consulta","consulta"),
 17:("consulta","consulta"),18:("consulta","consulta"),19:("consulta","consulta"),20:("consulta","consulta"),
 21:("consulta","consulta"),22:("consulta","consulta"),23:("consulta","consulta"),24:("consulta","consulta"),
 25:("consulta","consulta"),26:("consulta","consulta"),27:("consulta","consulta"),28:("consulta","consulta"),
 29:("consulta","consulta"),
 30:("45 min","apres"),31:("3 min","min"),32:("skip","skip"),33:("skip","skip"),
}
STYLE={"min":(PETROLEO,WHITE),"grupo":(AMBAR,VERDE),"apres":(AMBAR,VERDE),"consulta":(BEGE,VERDE)}

base="/home/user/radarbazin1/gerentes/"
prs=Presentation(base+"06_Workshop_Agentes_v3.1.pptx")
for i,s in enumerate(prs.slides,1):
    lbl,tp=TMAP.get(i,("",""))
    if tp in ("","skip"): continue
    fill,fg=STYLE[tp]
    time_chip(s,lbl,fill=fill,fg=fg)

# ---- slide de Roteiro de tempo (inserido na posicao 3) ----
def make_slide(prs, dark=False):
    s=prs.slides.add_slide(prs.slide_layouts[0])
    bg=s.shapes.add_shape(MSO_SHAPE.RECTANGLE,0,0,prs.slide_width,prs.slide_height)
    bg.fill.solid(); bg.fill.fore_color.rgb=(VERDE if dark else AREIA)
    bg.line.fill.background(); bg.shadow.inherit=False
    s.shapes._spTree.remove(bg._element); s.shapes._spTree.insert(2,bg._element); return s

s=make_slide(prs)
_box(s,Inches(0.5),Inches(0.42),Inches(0.1),Inches(0.62),fill=PETROLEO)
_text(s,Inches(0.72),Inches(0.4),Inches(8.8),Inches(0.3),[[("ROTEIRO DE TEMPO",10.5,TEAL,True)]])
_text(s,Inches(0.72),Inches(0.66),Inches(8.9),Inches(0.6),[[("Quanto tempo leva o workshop",22,PETROLEO,True)]])
blocos=[("Abertura & Nivelamento","IA/ML, anatomia, DNA, C.R.I.A.R., Claude & Cowork","18 min"),
        ("Demo ao vivo","construir 1 agente do zero, sem mágica","15 min"),
        ("Segurança de dados","semáforo + 5 regras","5 min"),
        ("Visão de sistema","os 4 agentes em um sistema só","3 min"),
        ("☕ Intervalo","respiro antes da prática","15 min"),
        ("Mão na massa · 3 grupos","construção guiada no Cowork (roteiro tático = consulta)","80 min"),
        ("Apresentações dos grupos","12 min por grupo + feedback","45 min"),
        ("Teste no app + Mentimeter","testar o Shopping Inteligente e votar melhorias","5 min"),
        ("Encerramento","o agente nasceu + Inteligência Acelerada","6 min")]
y=1.32
for nome,desc,tempo in blocos:
    _box(s,Inches(0.5),Inches(y),Inches(9.0),Inches(0.37),fill=WHITE,line=BEGE,round_=True)
    _text(s,Inches(0.68),Inches(y+0.04),Inches(5.9),Inches(0.3),[[(nome,11.5,PETROLEO,True),("   "+desc,9.5,TEAL,False)]],anchor=MSO_ANCHOR.MIDDLE)
    _text(s,Inches(8.1),Inches(y+0.04),Inches(1.25),Inches(0.3),[[(tempo,11.5,VERDE,True)]],align=PP_ALIGN.RIGHT,anchor=MSO_ANCHOR.MIDDLE)
    y+=0.4
_box(s,Inches(0.5),Inches(y+0.03),Inches(9.0),Inches(0.46),fill=PETROLEO,round_=True)
_text(s,Inches(0.7),Inches(y+0.04),Inches(8.6),Inches(0.44),
      [[("Total: ",12,AMBAR,True),
        ("≈ 192 min (3h12) de conteúdo — janela de 4 h com buffer para dúvidas.",12,WHITE,True)]],
      anchor=MSO_ANCHOR.MIDDLE)
s.notes_slide.notes_text_frame.text=("Roteiro de tempo. ~3h de conteudo estruturado numa janela de 4h. Os slides de "
 "'Roteiro tatico' (13-29) sao consulta durante os 80 min de grupo, nao tempo adicional.")
# mover para a posicao 3
lst=prs.slides._sldIdLst; lst.insert(2, lst[-1])

# ---- slide de ATIVIDADE: testar o app Shopping Inteligente + Mentimeter ----
a=make_slide(prs)
_box(a,Inches(0.5),Inches(0.42),Inches(0.1),Inches(0.62),fill=PETROLEO)
_text(a,Inches(0.72),Inches(0.4),Inches(7.2),Inches(0.3),[[("TESTE AO VIVO · MENTIMETER",10.5,TEAL,True)]])
_text(a,Inches(0.72),Inches(0.66),Inches(8.9),Inches(0.7),
      [[("Agora vamos testar no Shopping Inteligente…",20,PETROLEO,True)]])
# esquerda: instrucao + Mentimeter + 5 linhas numeradas
_text(a,Inches(0.55),Inches(1.7),Inches(4.3),Inches(0.6),
      [[("Liste de ",15,VERDE,True),("3 a 5 itens",15,PETROLEO,True),(" que você melhoraria.",15,VERDE,True)]])
mc=_box(a,Inches(0.55),Inches(2.3),Inches(3.7),Inches(0.42),fill=AMBAR,round_=True)
tf=mc.text_frame; tf.word_wrap=False; tf.margin_left=Pt(10); tf.margin_right=Pt(10)
pp=tf.paragraphs[0]; pp.alignment=PP_ALIGN.CENTER; rr=pp.add_run(); rr.text="→  Responda no Mentimeter"
rr.font.size=Pt(12); rr.font.bold=True; rr.font.color.rgb=VERDE; rr.font.name=FONT
yy=3.05
for n in range(1,6):
    _text(a,Inches(0.6),Inches(yy),Inches(4.1),Inches(0.32),
          [[(f"{n}.  ",13,PETROLEO,True),("______________________",13,BEGE,False)]])
    yy+=0.38
# direita: IMAGEM real do app (screenshot), mantendo o aspecto (1.238)
imgw=4.55; imgh=imgw/1.238; imgx=4.95; imgy=1.62
a.shapes.add_picture(base+"app_shopping_inteligente.jpeg", Inches(imgx), Inches(imgy), Inches(imgw), Inches(imgh))
_box(a,Inches(imgx),Inches(imgy),Inches(imgw),Inches(imgh),fill=None,line=PETROLEO,lw=1.25)
time_chip(a,"5 min",fill=PETROLEO,fg=WHITE)
a.notes_slide.notes_text_frame.text=("~5 min. Atividade ao vivo: abram o app Shopping Inteligente e testem. Cada um "
 "lista de 3 a 5 melhorias no Mentimeter. Fechamos discutindo os itens mais votados. "
 "SUBSTITUA o quadro pela imagem/print real do app.")
# inserir apos as apresentacoes dos grupos
lst=prs.slides._sldIdLst; act=lst[-1]
apres=None
for i,sl in enumerate(prs.slides):
    t=' '.join(sh.text_frame.text for sh in sl.shapes if sh.has_text_frame).upper()
    if '45 MINUTOS' in t and '12 MINUTOS POR GRUPO' in t: apres=i; break
lst.remove(act); lst.insert((apres+1) if apres is not None else len(list(prs.slides))-1, act)

out=base+"06_Workshop_Agentes_v3.4.pptx"
prs.save(out); print(out.split('/')[-1],"-> slides:",len(prs.slides._sldIdLst))
