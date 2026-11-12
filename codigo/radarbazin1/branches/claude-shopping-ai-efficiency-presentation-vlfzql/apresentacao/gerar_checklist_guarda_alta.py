# -*- coding: utf-8 -*-
"""
Guarda Alta — Check-list de acompanhamento (A4), no padrao visual do workshop
(mesmas cores e fontes da ficha de melhorias). Conteudo: guarda_alta/checklist_dados.json,
extraido do PDF da convencao (14 secoes, 154 itens), mais a tabela dos grupos de WhatsApp
e a de pendencias. Saida: Guarda_Alta_Checklist.pdf
"""
import json, os
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.colors import Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import simpleSplit

W,H=A4
PET=Color(0,0x61/255,0x6F/255); VER=Color(0x0D/255,0x45/255,0x4A/255); TEAL=Color(0x36/255,0x8C/255,0x82/255)
AMB=Color(0xED/255,0xA7/255,0x54/255); AREIA=Color(0xE5/255,0xDE/255,0xD4/255); BEGE=Color(0xCC/255,0xC5/255,0xBC/255)
CORAL=Color(0xCD/255,0x51/255,0x51/255); WHITE=Color(1,1,1); CARDBG=Color(0xF2/255,0xEF/255,0xEA/255); SOFT=Color(0xFB/255,0xF3/255,0xE6/255)
INK=Color(0x1A/255,0x1A/255,0x1A/255)
M=40
base=os.path.dirname(os.path.abspath(__file__))+"/"
out=base+"Guarda_Alta_Checklist.pdf"
SECS=json.load(open(base+"guarda_alta/checklist_dados.json",encoding="utf-8"))

# fontes: Gantari (deck) se houver, senao DejaVu (tem ☐ e →)
def _font():
    for name,reg,bold in (("Gantari",base+"fonts/Gantari-Regular.ttf",base+"fonts/Gantari-Bold.ttf"),
                          ("DejaVu","/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf","/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")):
        if os.path.exists(reg) and os.path.exists(bold):
            pdfmetrics.registerFont(TTFont(name,reg)); pdfmetrics.registerFont(TTFont(name+"-Bold",bold)); return name
    return "Helvetica"
F=_font(); FB=F+"-Bold" if F!="Helvetica" else "Helvetica-Bold"

c=canvas.Canvas(out,pagesize=A4); c.setTitle("Guarda Alta — Check-list de acompanhamento")
_pc=base+"guarda_alta/.checklist_pages"
TOTAL=[int(open(_pc).read()) if os.path.exists(_pc) else 0]   # total de paginas: lido da execucao anterior (rodar 2x)

def txt(x,y,s,size=10,col=VER,bold=False,align="l"):
    c.setFillColor(col); c.setFont(FB if bold else F,size)
    (c.drawString if align=="l" else c.drawCentredString if align=="c" else c.drawRightString)(x,y,s)
def rect(x,y,w,h,fill=None,line=None,lw=1,r=6):
    if fill is not None: c.setFillColor(fill)
    if line is not None: c.setStrokeColor(line); c.setLineWidth(lw)
    c.roundRect(x,y,w,h,r,stroke=(line is not None),fill=(fill is not None))
def checkbox(x,y,size=10):
    c.setStrokeColor(PET); c.setLineWidth(1); c.rect(x,y,size,size,stroke=1,fill=0)

# ---- paginacao simples: cursor y desce; nova pagina quando nao cabe ----
page=[1]; y=[0]
def header_page():
    c.setFillColor(PET); c.rect(0,H-62,W,62,stroke=0,fill=1); c.setFillColor(AMB); c.rect(0,H-62,W,4,stroke=0,fill=1)
    txt(M,H-28,"GUARDA ALTA — CHECK-LIST DE ACOMPANHAMENTO",13,WHITE,True)
    txt(M,H-46,"Prevenção de riscos e crises no shopping · Convenção de Gerentes e Superintendentes",9,AREIA)
    txt(W-M,H-28,"1 check-list por shopping",10,AMB,True,"r")
    txt(W-M,H-46,"marcar só depois de conferir em campo",8.5,AREIA,False,"r")
def footer_page():
    c.setFillColor(VER); c.rect(0,0,W,26,stroke=0,fill=1)
    txt(M,10,"Item não conforme vai para a tabela de pendências, com responsável e prazo. Risco não resolvido ou potencial de crise: informar à regional.",7.5,AREIA)
    txt(W-M,10,f"{page[0]}"+(f" / {TOTAL[0]}" if TOTAL[0] else ""),8,AMB,True,"r")
def new_page():
    if page[0]>0 and y[0]!=0: footer_page(); c.showPage(); page[0]+=1
    header_page(); y[0]=H-62-22
def need(h):
    if y[0]-h<26+14: footer_page(); c.showPage(); page[0]+=1; header_page(); y[0]=H-62-22

def paragraph(x,w,s,size,col,bold=False,lead=None):
    lead=lead or size*1.3
    for ln in simpleSplit(s,FB if bold else F,size,w):
        txt(x,y[0],ln,size,col,bold); y[0]-=lead

# ================= pagina 1: como usar + identificacao =================
header_page(); y[0]=H-62-26
txt(M,y[0],"COMO USAR",10,TEAL,True); y[0]-=16
paragraph(M,W-2*M,"Este check-list cobre, item a item, todo o conteúdo da apresentação Guarda Alta — Prevenção de riscos e crises no shopping. "
          "Serve para a superintendência e a gerência de operações confirmarem, antes e durante o período de maior movimento, que cada ponto foi verificado e tratado.",9.5,VER)
y[0]-=4
for b in ["Preencher um check-list por shopping; marcar o item só depois de conferido em campo ou com evidência do responsável.",
          "Item não conforme vai para a tabela Pendências e plano de tratamento, no fim do documento, com responsável e prazo.",
          "Reportar à regional todo risco não resolvido e toda situação com potencial de crise, sem esperar a apuração completa."]:
    c.setFillColor(AMB); c.circle(M+4,y[0]+3,2.2,stroke=0,fill=1)
    sv=y[0]; y[0]=sv;
    lines=simpleSplit(b,F,9.5,W-2*M-14)
    for ln in lines: txt(M+14,y[0],ln,9.5,VER); y[0]-=12.5
    y[0]-=2
y[0]-=6
# identificacao
cols=[("Shopping",0.25),("Superintendente",0.20),("Gerente de Operações",0.21),("Data da verificação",0.17),("Próxima revisão",0.17)]
tw=W-2*M; x=M; hh=18; rh=26
rect(M,y[0]-hh,tw,hh,fill=CARDBG,r=3)
for nome,fr in cols:
    txt(x+6,y[0]-12.5,nome,8,VER,True); x+=tw*fr
c.setStrokeColor(BEGE); c.setLineWidth(0.8); c.rect(M,y[0]-hh-rh,tw,rh,stroke=1,fill=0)
x=M
for nome,fr in cols[:-1]:
    x+=tw*fr; c.line(x,y[0]-hh-rh,x,y[0])
y[0]-=hh+rh+22

# ================= secoes =================
def secao(sec):
    num,nome=sec["titulo"].split(". ",1)
    need(110)   # cabecalho + intro + subtitulo + primeiro item juntos
    rect(M,y[0]-22,22,22,fill=PET,r=4); txt(M+11,y[0]-16,num,10,WHITE,True,"c")
    txt(M+30,y[0]-16,nome.upper(),11.5,VER,True); y[0]-=30
    if sec["intro"]:
        s=sec["intro"]; regra=s.startswith("Regra:")
        lines=simpleSplit(s,FB if regra else F,8.5,W-2*M-16)
        bh=len(lines)*11+10; need(bh+6)
        rect(M,y[0]-bh,W-2*M,bh,fill=(SOFT if regra else CARDBG),line=(AMB if regra else None),lw=0.9,r=4)
        yy=y[0]-12
        for ln in lines: txt(M+8,yy,ln,8.5,(PET if regra else TEAL),regra); yy-=11
        y[0]-=bh+8
    for sb in sec["subs"]:
        if sb["nome"]:
            need(28); txt(M+2,y[0]-9,sb["nome"],9,TEAL,True); y[0]-=15
        for it in sb["itens"]:
            lines=simpleSplit(it,F,9,W-2*M-22); ih=len(lines)*11.5+3
            need(ih)
            checkbox(M+2,y[0]-9.5); yy=y[0]-8
            for ln in lines: txt(M+20,yy,ln,9,INK); yy-=11.5
            y[0]-=ih
        y[0]-=3
    if num=="15":   # tabela dos grupos
        need(80)
        tabela([("Grupo",0.18),("Para quê",0.34),("Quem participa",0.48)],
               [("Interno (opcional)","Ocorrências de baixa, média ou alta relevância","Liderança do shopping; supervisores de mall, conservação e SAC; sem assessoria de imprensa"),
                ("Oficial / Regional","Potencial de crise operacional ou de imagem","Diretor regional e todos os gerentes regionais; plantonistas (superintendente, gerentes e coordenadores); assessoria de imprensa")])
    y[0]-=10
def tabela(cols,rows):
    tw=W-2*M; hh=16
    rect(M,y[0]-hh,tw,hh,fill=CARDBG,r=3); x=M
    for nome,fr in cols: txt(x+5,y[0]-11,nome,8,VER,True); x+=tw*fr
    y[0]-=hh
    for row in rows:
        cells=[simpleSplit(t,F,8,tw*fr-10) for t,(_,fr) in zip(row,cols)]
        rh=max(len(cl) for cl in cells)*10+8; need(rh)
        c.setStrokeColor(BEGE); c.setLineWidth(0.7); c.rect(M,y[0]-rh,tw,rh,stroke=1,fill=0)
        x=M
        for cl,(nome,fr) in zip(cells,cols):
            yy=y[0]-11
            for ln in cl: txt(x+5,yy,ln,8,INK,nome=="Grupo"); yy-=10
            x+=tw*fr
            if nome!=cols[-1][0]: c.line(x,y[0]-rh,x,y[0])
        y[0]-=rh
    y[0]-=6
for sec in SECS: secao(sec)

# ================= pendencias =================
need(120)
rect(M,y[0]-22,22,22,fill=AMB,r=4); txt(M+11,y[0]-16,"!",11,VER,True,"c")
txt(M+30,y[0]-16,"PENDÊNCIAS E PLANO DE TRATAMENTO",11.5,VER,True); y[0]-=30
paragraph(M,W-2*M,"Todo item não conforme entra aqui com responsável e prazo. Riscos não resolvidos e situações com potencial de crise são informados à regional.",8.5,TEAL)
y[0]-=4
pc=[("Seção",0.08),("Item não conforme",0.34),("Responsável",0.17),("Prazo",0.10),("Status",0.11),("Observações",0.20)]
tw=W-2*M; rect(M,y[0]-16,tw,16,fill=CARDBG,r=3); x=M
for nome,fr in pc: txt(x+5,y[0]-11,nome,8,VER,True); x+=tw*fr
y[0]-=16
RH=24; n=0
while n<14 or y[0]-RH>26+14+40:   # pelo menos 14 linhas; completa a pagina
    if y[0]-RH<26+14: break
    c.setStrokeColor(BEGE); c.setLineWidth(0.7); c.rect(M,y[0]-RH,tw,RH,stroke=1,fill=0); x=M
    for nome,fr in pc[:-1]: x+=tw*fr; c.line(x,y[0]-RH,x,y[0])
    y[0]-=RH; n+=1
footer_page(); c.showPage()
open(_pc,"w").write(str(page[0]))
c.save()
print("gerado:",out,"| paginas:",page[0],"| itens:",sum(len(sb["itens"]) for s in SECS for sb in s["subs"]),"| fonte:",F)
