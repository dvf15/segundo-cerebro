# -*- coding: utf-8 -*-
"""
Ficha de melhorias (frente e verso, A4) para a 'Mão na massa' do workshop.
Cada time roda o seu app, registra as sugestões em 4 categorias — workflow (fluxo),
design, inclusões ou exclusões e outros — e marca a nº 1. As fichas entram em ajuste
no Claude Code durante os próximos blocos e o almoço; às 14:35, 10 min por app.
Saída: Workshop_Ficha_Melhorias.pdf
"""
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.colors import Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os
# fonte do deck (Gantari) quando disponivel; senao Helvetica
_fd=os.path.dirname(os.path.abspath(__file__))+"/fonts/"
if os.path.exists(_fd+"Gantari-Regular.ttf"):
    pdfmetrics.registerFont(TTFont("Gantari",_fd+"Gantari-Regular.ttf")); pdfmetrics.registerFont(TTFont("Gantari-Bold",_fd+"Gantari-Bold.ttf")); F,FB="Gantari","Gantari-Bold"
else: F,FB="Helvetica","Helvetica-Bold"

W,H=A4  # 595 x 842 pt
PET=Color(0,0x61/255,0x6F/255); VER=Color(0x0D/255,0x45/255,0x4A/255); TEAL=Color(0x36/255,0x8C/255,0x82/255)
AMB=Color(0xED/255,0xA7/255,0x54/255); AREIA=Color(0xE5/255,0xDE/255,0xD4/255); BEGE=Color(0xCC/255,0xC5/255,0xBC/255)
CORAL=Color(0xCD/255,0x51/255,0x51/255); MENTA=Color(0x6C/255,0xC6/255,0x80/255)
WHITE=Color(1,1,1); CARDBG=Color(0xF2/255,0xEF/255,0xEA/255); SOFT=Color(0xFB/255,0xF3/255,0xE6/255)
M=36
out="/home/user/radarbazin1/apresentacao/Workshop_Ficha_Melhorias.pdf"
c=canvas.Canvas(out,pagesize=A4)
c.setTitle("Ficha de melhorias — Mão na massa")

def Y(t): return H-t
def rect(x,tt,w,h,fill=None,line=None,lw=1,r=6):
    if fill is not None: c.setFillColor(fill)
    if line is not None: c.setStrokeColor(line); c.setLineWidth(lw)
    c.roundRect(x,Y(tt)-h,w,h,r,stroke=(line is not None),fill=(fill is not None))
def txt(x,tt,s,size=10,col=VER,bold=False,align="l"):
    c.setFillColor(col); c.setFont(FB if bold else F,size)
    if align=="l": c.drawString(x,Y(tt),s)
    elif align=="c": c.drawCentredString(x,Y(tt),s)
    else: c.drawRightString(x,Y(tt),s)
def line(x1,tt,x2,col=BEGE,lw=0.8):
    c.setStrokeColor(col); c.setLineWidth(lw); c.line(x1,Y(tt),x2,Y(tt))
def checkbox(x,tt,size=11):
    c.setStrokeColor(PET); c.setLineWidth(1); c.rect(x,Y(tt)-size,size,size,stroke=1,fill=0)

# ---- cabeçalho ----
c.setFillColor(PET); c.rect(0,H-78,W,78,stroke=0,fill=1)
c.setFillColor(AMB); c.rect(0,H-78,W,5,stroke=0,fill=1)
txt(M,32,"FICHA DE MELHORIAS",17,WHITE,True)
txt(M,51,"Workshop Regional · Mão na massa · 1 ficha por app",10,AREIA)
txt(W-M,32,"entrega às 11:15",11,AMB,True,"r")
txt(W-M,51,"apps ajustados às 14:35",10,AREIA,False,"r")

top=98
# ---- time / app ----
txt(M,top,"TIME  /  APP AVALIADO",10,TEAL,True)
# Negócios avalia dois apps: uma ficha para cada um
opts=[("Marketing","Radar de Mídia"),("Operações","Otimizador de Obras"),
      ("Negócios","Radar de Varejo"),("Negócios","Radar de Dispersão de Vendas")]
ow=(W-2*M-8)/2; oh=24
for i,(tm,ap) in enumerate(opts):
    x=M+(i%2)*(ow+8); tt=top+8+(i//2)*(oh+5)
    rect(x,tt,ow,oh,fill=CARDBG,line=BEGE)
    checkbox(x+10,tt+6)
    txt(x+29,tt+16,ap,10,VER,True)
    txt(x+ow-10,tt+16,tm,9,TEAL,False,"r")
top+=8+2*oh+5+14
txt(M,top+4,"Participantes:",9.5,VER,True)
line(M+72,top+5,W-M)
top+=18
# o caso de teste é sempre fictício
txt(M,top+4,"Caso fictício usado no teste:",9.5,VER,True)
line(M+142,top+5,W-M)
txt(M,top+16,"invente um caso parecido com os da praça — nomes, CNPJs e valores inventados; nenhum dado real",7.5,TEAL)
top+=26
# o recado principal + o que observar enquanto roda
BH=112
rect(M,top,W-2*M,BH,fill=SOFT,line=AMB,lw=1.1,r=5)
txt(M+10,top+14,"Vocês são os especialistas.",9.5,PET,True)
txt(M+10+c.stringWidth("Vocês são os especialistas. ",FB,9.5),top+14,
    "Critiquem com o que vivem na operação: o processo real, a prática da praça",8.5,VER)
txt(M+10,top+26,"e as dores que se repetem — onde trava, onde há retrabalho, o que o lojista ou o cliente reclama.",8.5,VER)
line(M+10,top+33,W-M-10,col=AMB,lw=0.6)
txt(M+10,top+45,"O QUE OBSERVAR ENQUANTO RODA",8.5,TEAL,True)
OBS=[("Resolve uma dor real?","a tarefa que hoje dá retrabalho, atraso ou reclamação"),
     ("Segue o processo de verdade?","as etapas batem com o que acontece na praça?"),
     ("O que falta?","o dado, a exceção, o caso que só quem opera conhece"),
     ("A saída é útil?","dá para agir amanhã sem retrabalho?"),
     ("É seguro?","respeita sigilo e mantém a decisão humana?")]
cw=(W-2*M-20)/2
for k,(q,h) in enumerate(OBS):
    x=M+10+(k//3)*(cw+10); yy=top+56+(k%3)*19
    txt(x,yy,"— "+q,8.5,VER,True)
    txt(x+9,yy+9,h,7.5,VER)
top+=BH+10

# ---- as 4 categorias (frente: A e B · verso: C e D) ----
CATS=[("A","WORKFLOW (FLUXO)","a ordem das etapas, perguntas que sobram ou faltam, o caminho até a resposta",PET),
      ("B","DESIGN","leitura, clareza, cores, tamanhos — o que confunde na tela",TEAL),
      ("C","INCLUSÕES OU EXCLUSÕES","o dado, a pergunta, o campo ou o relatório que falta — e o que pode sair",CORAL),
      ("D","OUTROS","o que não coube nas categorias acima",MENTA)]
tw=W-2*M; c1=tw*0.40; c2=tw*0.29; c3=tw*0.17; c4=tw-c1-c2-c3
HROW=17; RROW=26; NR=5
def categoria(top,letra,nome,dica,cor):
    c.setFillColor(cor); c.roundRect(M,Y(top)-18,18,18,4,stroke=0,fill=1)
    txt(M+9,top+13,letra,10.5,WHITE,True,"c")
    txt(M+26,top+13,nome,10.5,VER,True)
    txt(M+26+c.stringWidth(nome,FB,10.5)+8,top+13,"— "+dica,8.5,TEAL)
    top+=24
    rect(M,top,tw,HROW,fill=CARDBG,line=None,r=3)
    txt(M+6,top+12,"Sugestão",8.5,VER,True)
    txt(M+c1+6,top+12,"Dor que resolve",8.5,VER,True)
    txt(M+c1+c2+6,top+12,"Onde (tela/etapa)",8.5,VER,True)
    txt(M+c1+c2+c3+6,top+12,"Prior. A/M/B",8.5,VER,True)
    top+=HROW
    for r in range(NR):
        yb=top+r*RROW
        c.setStrokeColor(BEGE); c.setLineWidth(0.8)
        c.rect(M,Y(yb)-RROW,c1,RROW,stroke=1,fill=0)
        c.rect(M+c1,Y(yb)-RROW,c2,RROW,stroke=1,fill=0)
        c.rect(M+c1+c2,Y(yb)-RROW,c3,RROW,stroke=1,fill=0)
        c.rect(M+c1+c2+c3,Y(yb)-RROW,c4,RROW,stroke=1,fill=0)
        txt(M+5,yb+16,f"{letra}{r+1}",8,BEGE,True)
    return top+NR*RROW+16
def rodape(pag):
    c.setFillColor(VER); c.rect(0,0,W,30,stroke=0,fill=1)
    txt(M,H-20,"Rode sempre um caso fictício — nada de dado real ou confidencial. As fichas entram em ajuste no Claude Code logo em seguida",8,AREIA)
    txt(M,H-10,"e rodam durante os próximos blocos; às 14:35, 10 minutos por app para ver o que mudou. A decisão continua humana.",8,AREIA)
    txt(W-M,H-10,pag,8,AMB,True,"r")

# frente
for cat in CATS[:2]: top=categoria(top,*cat)
usado1=top
rodape("1/2 · vire a folha")
c.showPage()

# verso
c.setFillColor(PET); c.rect(0,H-46,W,46,stroke=0,fill=1)
c.setFillColor(AMB); c.rect(0,H-46,W,4,stroke=0,fill=1)
txt(M,28,"FICHA DE MELHORIAS  ·  VERSO",13,WHITE,True)
txt(W-M,28,"entrega às 11:15",10,AMB,True,"r")
top=66
txt(M,top+4,"App avaliado:",9.5,VER,True); line(M+68,top+5,W/2-10)
txt(W/2+4,top+4,"Time:",9.5,VER,True); line(W/2+34,top+5,W-M)
top+=26
for cat in CATS[2:]: top=categoria(top,*cat)

# a nº 1 (destaque)
txt(M,top+2,"★  A MELHORIA Nº 1 DESTE APP  —  se só der para fazer uma até as 14:35",10.5,PET,True)
top+=10
rect(M,top,tw,74,fill=SOFT,line=AMB,lw=1.4)
txt(M+12,top+17,"Código (ex.: A2):",9,VER,True); line(M+95,top+18,M+160,col=BEGE)
txt(M+180,top+17,"Por que ela primeiro:",9,VER,True); line(M+285,top+18,W-M-12,col=BEGE)
for k in range(3): line(M+12,top+36+k*14,W-M-12,col=BEGE)
top+=86
# anotações livres no espaço que sobra
txt(M,top+2,"ANOTAÇÕES DO TIME",9.5,TEAL,True)
top+=8
fim=H-30-14
rect(M,top,tw,fim-top,fill=None,line=BEGE,lw=0.8)
yy=top+20
while yy<fim-6:
    line(M+10,yy,W-M-10,col=CARDBG,lw=0.8); yy+=18
rodape("2/2")
c.showPage(); c.save()
print("gerado:",out,"| frente usada:",round(usado1),"de",int(H-30))
