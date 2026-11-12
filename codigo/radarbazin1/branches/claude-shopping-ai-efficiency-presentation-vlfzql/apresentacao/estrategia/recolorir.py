# Recolore os infograficos originais para a paleta do deck e troca REIT -> FII K dentro da imagem.
import glob, os, sys
# Entrada: os PNGs originais (uploads) e as fontes Montserrat/Roboto (Google Fonts) em ../fonts; saida: os PNGs desta pasta.
from PIL import Image, ImageDraw, ImageFont, ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES=True
U="/root/.claude/uploads/084482db-f1c2-5f15-a6d5-4eadc77b89b5/"
OUT="/home/user/radarbazin1/apresentacao/estrategia/"
HERE=os.path.dirname(os.path.abspath(__file__)); FD=os.path.join(HERE,"..","fonts")
SRC={"ciclo_vida":("1eb02615",48),"reciclagem_reit":("c036ff51",48),"gargalos":("36b00dbf",14),"aceleracao_longevidade":("1a01850a",48)}

def font(kind,size):
    """kind: 'bold' (titulos, Montserrat) ou 'reg' (paragrafos, Roboto); cai para Liberation se nao houver."""
    try:
        if kind=="bold":
            f=ImageFont.truetype(os.path.join(FD,"Montserrat.ttf"),size); f.set_variation_by_name("Bold"); return f
        f=ImageFont.truetype(os.path.join(FD,"Roboto.ttf"),size)
        try: f.set_variation_by_name("Regular")
        except Exception: pass
        return f
    except Exception:
        return ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-%s.ttf"%("Bold" if kind=="bold" else "Regular"),size)

def lut_h(h):
    if 136<=h<=182: return int(132+(h-136)*0.25)   # azul -> petroleo/teal
    if 182<h<=215: return int((h-182)*0.15)          # roxo -> coral
    return h
def recolor(im):
    H,S,V=im.convert("HSV").split()
    H2=H.point([lut_h(i) for i in range(256)]); mask=S.point(lambda v:255 if v>55 else 0)
    return Image.merge("HSV",(Image.composite(H2,H,mask),S,V)).convert("RGB")

def wrap(d,txt,f,maxw):
    lines=[]; cur=""
    for w in txt.split():
        t=(cur+" "+w).strip()
        if d.textlength(t,font=f)<=maxw: cur=t
        else: lines.append(cur); cur=w
    if cur: lines.append(cur)
    return lines
def center_lines(d,lines,f,cx,y0,lh,fill):
    for i,l in enumerate(lines):
        tw=d.textlength(l,font=f); d.text((cx-tw/2,y0+i*lh),l,font=f,fill=fill)

imgs={}
for n,(k,cut) in SRC.items():
    im=Image.open(glob.glob(U+k+"*")[0]).convert("RGB"); w,h=im.size
    imgs[n]=recolor(im.crop((0,0,w,h-cut)))

# ---- reciclagem: REIT -> FII K em 4 pontos ----
im=imgs["reciclagem_reit"]; d=ImageDraw.Draw(im); INK=(24,24,24)
band=im.getpixel((12,70)); d.rectangle((0,26,2752,134),fill=band)
f=font("bold",74); t="Reciclagem via FII K vs. Tradicional: O Ciclo Perpétuo de Valor"
tw=d.textlength(t,font=f); d.text((1376-tw/2,80-38),t,font=f,fill=(255,255,255))
hdr=im.getpixel((1415,250)); d.rectangle((1420,214,2715,286),fill=hdr)
f=font("bold",44); t="RECICLAGEM VIA FII K (Ciclo Perpétuo & Flywheel)"
tw=d.textlength(t,font=f); d.text(((1420+2715)/2-tw/2,250-24),t,font=f,fill=(255,255,255))
d.rectangle((1938,440,2302,600),fill=(255,255,255))
f=font("reg",24); L=wrap(d,"O modelo FII K retém a gestão do fundo e do ativo gerando taxas estáveis, enquanto a tradicional perde essa receita permanente.",f,345)
center_lines(d,L,f,2122,448,29,INK)
d.rectangle((1452,1288,1838,1452),fill=(255,255,255))
f=font("reg",25); L=wrap(d,"Permite realizar futuras expansões e remodelações nos ativos mantidos no FII K, gerando novos ciclos de valorização.",f,380)
center_lines(d,L,f,1645,1300,29,INK)

# ---- aceleracao e longevidade: REIT/FII -> FII K no anel; OFEIZIA -> OFERTA ----
im=imgs["aceleracao_longevidade"]; d=ImageDraw.Draw(im)
d.ellipse((2270-102,965-102,2270+102,965+102),fill=(255,255,255))
f=font("bold",60); t="FII K"; tw=d.textlength(t,font=f); d.text((2270-tw/2,965-36),t,font=f,fill=INK)
bg=im.getpixel((1176,1123)); d.rectangle((1172,1112,1246,1135),fill=bg)
f=font("bold",20); tw=d.textlength("OFERTA",font=f); d.text((1209-tw/2,1111),"OFERTA",font=f,fill=(255,255,255))

# ---- salva (2000px) + recortes de conferencia ----
for n,im in imgs.items():
    full=im.copy(); full.thumbnail((2000,1200)); full.save(OUT+n+".png",optimize=True); print(n,full.size)
r=imgs["reciclagem_reit"]; r.crop((0,20,2752,140)).save(os.path.join(HERE,"p_title.png")); r.crop((1380,195,2752,300)).save(os.path.join(HERE,"p_hdr.png"))
r.crop((1780,330,2340,620)).save(os.path.join(HERE,"p_aum.png")); r.crop((1420,1180,1880,1470)).save(os.path.join(HERE,"p_redev.png"))
l=imgs["aceleracao_longevidade"]; l.crop((2080,780,2460,1120)).save(os.path.join(HERE,"p_circ.png")); l.crop((1120,1000,1300,1220)).save(os.path.join(HERE,"p_phone.png"))
print("fontes:",font("bold",10).getname(),font("reg",10).getname())
