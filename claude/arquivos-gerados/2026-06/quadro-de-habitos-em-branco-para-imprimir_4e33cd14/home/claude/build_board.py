import math, cairosvg

W, H = 1190, 842
INK = "#1a1a1a"
GRID = "#b9b9b9"
GRIDS = "#9a9a9a"
GRAY = "#5a5a5a"
parts = []

def esc(s): return s.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")

def text(x,y,s,size,fill=INK,font="Barlow",weight="400",anchor="start",ls=None,italic=False):
    st=f'font-family:{font};font-size:{size}px;font-weight:{weight};fill:{fill};'
    if ls: st+=f'letter-spacing:{ls}px;'
    if italic: st+='font-style:italic;'
    parts.append(f'<text x="{x}" y="{y}" text-anchor="{anchor}" style="{st}">{esc(s)}</text>')

def line(x1,y1,x2,y2,col=INK,w=1.6):
    parts.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{col}" stroke-width="{w}"/>')

def rect(x,y,w,h,fill="none",stroke=INK,sw=1.6):
    parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')

# ---- fundo ----
parts.append(f'<rect x="0" y="0" width="{W}" height="{H}" fill="#ffffff"/>')
rect(20,20,W-40,H-40,stroke="#e2e2e2",sw=1)

# ---- cabeçalho ----
text(56,70,"ORGANIZE YOUR GOALS",12,fill="#777",weight="600",ls=5)
text(W-56,62,"MONTHLY",13,fill="#666",weight="600",anchor="end",ls=4)
text(W-56,104,"PLANNING",44,font="Anton",weight="400",anchor="end",ls=1)

# ---- HABITS ----
text(56,156,"HABITS:",30,font="Anton",weight="400",ls=2)
y=200
for i in range(1,9):
    text(58,y, f"{i}.",15,fill="#444",weight="700")
    line(86,y+3,352,y+3,col=INK,w=1.6)
    y+=40

# ---- MONTH/YEAR (coluna esquerda) ----
text(56,545,"MONTH / YEAR:",14,fill="#444",weight="700",ls=1)
line(56,572,300,572,col=INK,w=1.6)
line(56,602,300,602,col=INK,w=1.6)

# ====== RODA RADIAL ======
cx,cy = 600,470
r0,rMax = 80,205
DAYS,RINGS = 31,8
ringStep=(rMax-r0)/RINGS
da=360/DAYS
ag=0.7      # folga angular
rg=1.4      # folga radial

def polar(r,deg):
    rad=math.radians(deg-90)
    return cx+r*math.cos(rad), cy+r*math.sin(rad)

def sector(rIn,rOut,a0,a1):
    x0,y0=polar(rOut,a0); x1,y1=polar(rOut,a1)
    x2,y2=polar(rIn,a1);  x3,y3=polar(rIn,a0)
    large=1 if (a1-a0)>180 else 0
    return (f'M{x0:.2f} {y0:.2f} A{rOut} {rOut} 0 {large} 1 {x1:.2f} {y1:.2f} '
            f'L{x2:.2f} {y2:.2f} A{rIn} {rIn} 0 {large} 0 {x3:.2f} {y3:.2f} Z')

# células
for d in range(DAYS):
    a0=d*da+ag; a1=(d+1)*da-ag
    for ring in range(RINGS):
        rIn=r0+ring*ringStep+rg
        rOut=r0+(ring+1)*ringStep
        parts.append(f'<path d="{sector(rIn,rOut,a0,a1)}" fill="#ffffff" stroke="{GRID}" stroke-width="1"/>')

# números dos dias
for d in range(DAYS):
    mid=(d+0.5)*da
    tx,ty=polar(rMax+18,mid)
    parts.append(f'<text x="{tx:.1f}" y="{ty:.1f}" text-anchor="middle" '
                 f'style="font-family:Barlow;font-size:13px;font-weight:600;fill:{GRAY};dominant-baseline:central">{d+1}</text>')

# numeração dos 8 anéis na 1ª fatia
for ring in range(RINGS):
    rMid=r0+(ring+0.5)*ringStep
    tx,ty=polar(rMid,0.5*da)
    parts.append(f'<text x="{tx:.1f}" y="{ty:.1f}" text-anchor="middle" '
                 f'style="font-family:Barlow;font-size:9px;font-weight:700;fill:#cccccc;dominant-baseline:central">{ring+1}</text>')

# centro MONTH/YEAR
parts.append(f'<text x="{cx}" y="{cy-6}" text-anchor="middle" '
             f'style="font-family:Barlow;font-size:11px;font-weight:700;fill:#666;letter-spacing:1px">MONTH / YEAR</text>')
line(cx-46,cy+14,cx+46,cy+14,col=INK,w=1.4)

# ====== COLUNA DIREITA ======
rx=858; rw=276
# OBSERVATIONS
parts.append(f'<rect x="{rx}" y="140" width="{rw}" height="34" fill="{INK}"/>')
text(rx+rw/2,164,"OBSERVATIONS",17,font="Anton",weight="400",fill="#fff",anchor="middle",ls=2)
obs_h=34; rows=6
rect(rx,174,rw,obs_h*rows,stroke=INK,sw=1.6)
for i in range(1,rows):
    line(rx,174+obs_h*i,rx+rw,174+obs_h*i,col=GRIDS,w=1)

# KEY GOALS
ky=430
parts.append(f'<rect x="{rx}" y="{ky}" width="{rw}" height="34" fill="{INK}"/>')
text(rx+rw/2,ky+24,"KEY GOALS",17,font="Anton",weight="400",fill="#fff",anchor="middle",ls=2)
cols,grows=3,2
cw=rw/cols; ch=82
rect(rx,ky+34,rw,ch*grows,stroke=INK,sw=1.6)
for c in range(1,cols):
    line(rx+cw*c,ky+34,rx+cw*c,ky+34+ch*grows,col=GRIDS,w=1)
line(rx,ky+34+ch,rx+rw,ky+34+ch,col=GRIDS,w=1)
# caixinhas de check
for r in range(grows):
    for c in range(cols):
        bx=rx+cw*c+8; by=ky+34+ch*r+8
        rect(bx,by,14,14,stroke=INK,sw=1.4)

# ====== FRASE ======
text(W-56,752,'"Discipline doesn\u2019t care how you feel. Discipline is doing what',13,fill="#3a3a3a",anchor="end",italic=True)
text(W-56,772,'needs to be done, even when you don\u2019t feel like doing it"\u2026',13,fill="#3a3a3a",anchor="end",italic=True)
text(W-56,806,"DISCIPLINE.",22,font="Anton",weight="400",anchor="end",ls=2)
# rodapé
text(56,800,"Recriacao em branco \u00b7 31 dias \u00d7 8 habitos",10,fill="#bcbcbc")

svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">{"".join(parts)}</svg>'
open("/home/claude/board.svg","w").write(svg)

cairosvg.svg2png(bytestring=svg.encode(), write_to="/mnt/user-data/outputs/monthly-planning.png",
                 output_width=W*2, output_height=H*2, background_color="#ffffff")
cairosvg.svg2pdf(bytestring=svg.encode(), write_to="/mnt/user-data/outputs/monthly-planning.pdf")
print("OK - PNG e PDF gerados")
