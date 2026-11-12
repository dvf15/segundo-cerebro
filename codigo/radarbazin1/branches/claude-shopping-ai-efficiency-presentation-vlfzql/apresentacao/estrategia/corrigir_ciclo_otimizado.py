# "Ciclo encurtado vs. ciclo alongado" (versao Gemini, 2752x1536): corrige a grafia e cobre a marca,
# sem alterar as cores do grafico. Cada linha errada e reescrita sobre o fundo reconstruido
# (interpolado coluna a coluna), com Roboto ajustada a largura e a linha de base do texto original.
# Uso: python3 corrigir_ciclo_otimizado.py   (le ciclo_otimizado_original.png, grava ciclo_otimizado.png)
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont
HERE=os.path.dirname(os.path.abspath(__file__)); FONT=os.path.join(HERE,"..","fonts","Roboto.ttf"); SS=4
def font(sz,wt): f=ImageFont.truetype(FONT,sz); f.set_variation_by_axes([wt,100]); return f
def bg(img,x0,x1,ya,yb):
    A=np.array(img).astype(float); t0=A[ya,x0:x1].copy(); t1=A[yb,x0:x1].copy()
    for y in range(ya+1,yb): t=(y-ya)/(yb-ya); A[y,x0:x1]=t0*(1-t)+t1*t
    return Image.fromarray(A.clip(0,255).astype("uint8"))
def put(img,x,top,W,old,new,sz,wt,color):
    """old: texto errado (define linha de base e compressao kx a partir da largura W do original)"""
    f=font(sz,wt); F=font(sz*SS,wt); bo=f.getbbox(old); kx=W/(bo[2]-bo[0])
    base=top-f.getbbox(old,anchor="ls")[1]
    b=F.getbbox(new,anchor="ls"); w,h=b[2]-b[0],b[3]-b[1]
    m=Image.new("L",(w+8,h+8),0); ImageDraw.Draw(m).text((4-b[0],4-b[1]),new,font=F,fill=255,anchor="ls")
    m=m.resize((max(1,round((w+8)*kx/SS)),round((h+8)/SS)),Image.LANCZOS)
    img.paste(Image.new("RGB",m.size,color),(round(x-4*kx/SS),round(base+(b[1]-4)/SS)),m)
im=Image.open(os.path.join(HERE,"ciclo_otimizado_original.png")).convert("RGB")
TIT=(241,254,252); SUB=(232,254,250); X0,X1=2052,2645
# 6 · Reciclagem: "reinvecimento" -> "reinvestimento"
im=bg(im,X0,X1,857,889)
put(im,2061,861,470,"Giro de capital e reinvecimento em ativos core","Giro de capital e reinvestimento em ativos core",23,400,SUB)
# 5 · Eventos: "inaromental" -> "incremental"
im=bg(im,X0,X1,944,978)
put(im,2061,948,539,"Geração de tráfego inaromental e receitas acessórias","Geração de tráfego incremental e receitas acessórias",23,400,SUB)
# 4 · Retail media: "Midia" -> "Mídia", "telas mali" -> "telas mall", "fluvo" -> "fluxo"
im=bg(im,X0,X1,992,1064)
put(im,2060,1002,532,"4. Retail Media & Midia Digital (app/telas mali)","4. Retail Media & Mídia Digital (app/telas mall)",27,650,TIT)
put(im,2061,1035,436,"Monetização de fluvo e engajamento digital","Monetização de fluxo e engajamento digital",23,400,SUB)
# rotulo da curva: "Cicio Alongado" -> "Ciclo Alongado"
d=ImageDraw.Draw(im); d.rectangle((2408,368,2610,403),fill=(250,250,249))
put(im,2412,373,193,"Cicio Alongado","Ciclo Alongado",27,600,(13,71,53))
# marca "Gemini Notebook" no rodape
d=ImageDraw.Draw(im); d.rectangle((2540,1500,2752,1536),fill=im.getpixel((2470,1520)))
im.save(os.path.join(HERE,"ciclo_otimizado_full.png"))
out=im.copy(); out.thumbnail((2000,1200)); out.save(os.path.join(HERE,"ciclo_otimizado.png"),optimize=True); print("ciclo_otimizado",out.size)
