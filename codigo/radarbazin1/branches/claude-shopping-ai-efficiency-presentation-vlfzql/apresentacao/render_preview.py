# -*- coding: utf-8 -*-
"""Renderiza o slide final (Inteligencia Aumentada) como PNG para avaliacao."""
from PIL import Image, ImageDraw, ImageFont

S = 2
W, H = int(13.333*96*S), int(7.5*96*S)
def px(inch): return int(inch*96*S)
def pt(p):    return int(p*(96/72)*S)

PETROLEO=(0,97,111); VERDE=(13,69,74); TEAL=(54,140,130)
AMBAR=(237,167,84); BEGE=(204,197,188); AREIA=(229,222,212); WHITE=(255,255,255)

REG="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BLD="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def f(sz, bold=True): return ImageFont.truetype(BLD if bold else REG, pt(sz))

img = Image.new("RGB",(W,H),VERDE); d = ImageDraw.Draw(img)

# barras
d.rectangle([0,0,W,px(0.18)], fill=AMBAR)
d.rectangle([0,H-px(0.18),W,H], fill=PETROLEO)

def text_runs(x,y,runs,anchor="la"):
    cx=x
    for s,fnt,col in runs:
        d.text((cx,y),s,font=fnt,fill=col,anchor=anchor)
        cx+=d.textlength(s,font=fnt)
    return cx

def wrap(draw,s,fnt,maxw):
    words=s.split(); lines=[]; cur=""
    for w in words:
        t=(cur+" "+w).strip()
        if draw.textlength(t,font=fnt)<=maxw: cur=t
        else:
            if cur: lines.append(cur)
            cur=w
    if cur: lines.append(cur)
    return lines

# chip
chip="PARA FECHAR  •  INTELIGÊNCIA AUMENTADA"
cf=f(12); tw=d.textlength(chip,font=cf)
cx0,cy0=px(0.9),px(0.95); cw=tw+px(0.25); ch=px(0.42)
d.rounded_rectangle([cx0,cy0,cx0+cw,cy0+ch],radius=ch//2,fill=AMBAR)
d.text((cx0+cw/2,cy0+ch/2),chip,font=cf,fill=VERDE,anchor="mm")

# titulo (quebra de linha, com palavra em ambar)
def rich_wrap(x,y,tokens,fnt,maxw,leading):
    space=d.textlength(" ",font=fnt); line=[]; w=0; cy=y
    def flush(yy,ln):
        cx=x
        for word,col in ln:
            d.text((cx,yy),word,font=fnt,fill=col,anchor="la")
            cx+=d.textlength(word,font=fnt)+space
    for word,col in tokens:
        ww=d.textlength(word,font=fnt)
        if line and w+space+ww>maxw:
            flush(cy,line); cy+=leading; line=[]; w=0
        line.append((word,col)); w+=(space if w else 0)+ww
    if line: flush(cy,line)
tf=f(28)
ttoks=[(w,WHITE) for w in "A IA não substitui o fator humano na direção do nosso propósito. Ela o".split()]+[("amplifica.",AMBAR)]
rich_wrap(px(0.9),px(1.5),ttoks,tf,px(11.6),int(pt(28)*1.2))

# subtitulo
sf=f(16,False)
sub="Existimos para conectar pessoas, negócios e a sociedade — servindo e encantando todos os dias."
yy=px(3.18)
for ln in wrap(d,sub,sf,px(11.6)):
    d.text((px(0.9),yy),ln,font=sf,fill=AREIA,anchor="la"); yy+=pt(16)*1.3

# bullets
hf=f(15); bf=f(13,False); mf=f(15)
bullets=[
 ("Nós lemos o contexto",
  "o clima e a experiência no mall, nos eventos, na gastronomia, os lojistas que encantam o cliente. Isso se vive — não se baixa de um sistema."),
 ("A IA cuida do que se repete",
  "resume, organiza e rascunha — e nos devolve o recurso mais escasso: tempo para gente."),
 ("A decisão é nossa",
  "a IA propõe e amplia o alcance; quem conecta, encanta e transforma somos nós."),
]
yy=px(3.72)
for head,subt in bullets:
    cx=text_runs(px(0.9),yy,[("—  ",mf,AMBAR),(head,hf,WHITE)]); yy+=pt(15)*1.35
    for ln in wrap(d,subt,bf,px(11.0)):
        d.text((px(1.25),yy),ln,font=bf,fill=BEGE,anchor="la"); yy+=pt(13)*1.3
    yy+=pt(6)

# caixa final (duas linhas)
bx0,by0=px(0.8),px(6.12); bw,bh=px(11.73),px(0.98)
d.rounded_rectangle([bx0,by0,bx0+bw,by0+bh],radius=pt(8),fill=PETROLEO)
l1f=f(17); l2f=f(15.5)
l1="A IA amplia o nosso alcance. O encontro humano é o que transforma."
l2="Inteligência Aumentada é como conectamos, encantamos e transformamos — todos os dias."
d.text((bx0+bw/2, by0+bh*0.34), l1, font=l1f, fill=WHITE, anchor="mm")
d.text((bx0+bw/2, by0+bh*0.70), l2, font=l2f, fill=AMBAR, anchor="mm")

out="/home/user/radarbazin1/apresentacao/preview_slide_final.png"
img.save(out); print("ok",out, img.size)
