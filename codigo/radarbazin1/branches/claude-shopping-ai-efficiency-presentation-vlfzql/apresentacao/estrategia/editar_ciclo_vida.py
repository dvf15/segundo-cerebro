# Ciclo de vida: CSU e Plaza Niteroi trocam de lugar; Carioca passa para a maturidade (antes do Plaza Niteroi) e Mooca/Estacao Cuiaba trocam de lugar.
# Uso: python3 editar_ciclo_vida.py ciclo_vida_original.png ciclo_vida.png
# Edicao por pixels: rotulos e ponto originais sao recortados e reposicionados (mesma fonte e cor).
import sys
from PIL import Image, ImageDraw
src=Image.open(sys.argv[1]).convert("RGB"); out=src.copy()
BG=src.getpixel((640,560))            # fundo branco do grafico
P=3                                   # margem do recorte de texto
def crop(b): return src.crop((b[0]-P,b[1]-P,b[2]+P,b[3]+P))
def erase(b): ImageDraw.Draw(out).rectangle((b[0]-P,b[1]-P,b[2]+P-1,b[3]+P-1),fill=BG)
def circ_mask(r,ss=4):
    m=Image.new("L",(2*r*ss,2*r*ss),0); ImageDraw.Draw(m).ellipse((0,0,2*r*ss-1,2*r*ss-1),fill=255)
    return m.resize((2*r,2*r),Image.LANCZOS)
CAR=(697,503,801,526); CUI=(700,674,808,728); MOO=(592,764,682,785)
DOT_OLD=(825,523); DOT_NEW=(925,452); R=17
car,cui,moo=crop(CAR),crop(CUI),crop(MOO)
dot=src.crop((DOT_OLD[0]-R,DOT_OLD[1]-R,DOT_OLD[0]+R,DOT_OLD[1]+R))
# 1) apaga o ponto antigo do Carioca: copia um trecho limpo da curva deslocado ao longo da tangente
# reconstrucao coluna a coluna: perfil da curva interpolado entre duas colunas limpas (antes e depois do ponto)
import numpy as np
A=np.array(src).astype(float); O=np.array(out).astype(float)
XL,XR=804,847; H=40
def center(x):
    col=A[DOT_OLD[1]-80:DOT_OLD[1]+80,x]; sat=col.max(axis=1)-col.min(axis=1); ys=np.where(sat>45)[0]
    return DOT_OLD[1]-80+ys.mean()
cl,cr=center(XL),center(XR)
def prof(x,c):   # perfil vertical centrado na curva, com subpixel
    ys=np.arange(-H,H+1)+c; y0=np.floor(ys).astype(int); f=(ys-y0)[:,None]
    return A[y0,x]*(1-f)+A[y0+1,x]*f
PL,PR=prof(XL,cl),prof(XR,cr)
for x in range(XL+1,XR):
    t=(x-XL)/(XR-XL); c=cl+(cr-cl)*t; PP=PL*(1-t)+PR*t
    for k,dy in enumerate(range(-H,H+1)):
        y=int(round(c+dy))
        O[y,x]=PP[k]
out=Image.fromarray(O.clip(0,255).astype("uint8"))
# 2) apaga os tres rotulos
for b in (CAR,CUI,MOO): erase(b)
# 3) ponto do Carioca na maturidade, sobre a curva
out.paste(dot,(DOT_NEW[0]-R,DOT_NEW[1]-R),circ_mask(R))
# 4) rotulo do Carioca acima do ponto (dentro da faixa de maturidade, sem tocar a curva)
out.paste(car,(889-P,385-P))
# 5) troca: Mooca no ponto de cima, Estacao Cuiaba no ponto de baixo
out.paste(moo,(CUI[0]-P,CUI[1]-P))
out.paste(cui,(MOO[0]-P,MOO[1]-P))
# 6) troca CSU <-> Plaza Niteroi (rotulos abaixo dos pontos)
PLA=(961,454,1053,508); CSU=(1205,466,1262,494)
pla,csu=crop(PLA),crop(CSU)
for b in (PLA,CSU): erase(b)
out.paste(csu,(1007-(CSU[2]-CSU[0])//2-P,454-P))                 # CSU sob o ponto do Plaza (x=1007)
out.paste(pla,(1238-(PLA[2]-PLA[0])//2-P,468-P))                 # Plaza Niteroi sob o ponto do CSU (x=1234), abaixo do Tijuca
out.save(sys.argv[2])
