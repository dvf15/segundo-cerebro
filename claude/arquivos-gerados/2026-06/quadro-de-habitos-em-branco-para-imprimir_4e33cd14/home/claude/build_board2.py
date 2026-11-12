import math, cairosvg

W, H = 1190, 842
INK="#1a1a1a"; GRID="#b9b9b9"; GRIDS="#9a9a9a"; GRAY="#5a5a5a"
DISP="Archivo Black"; BODY="Barlow"
parts=[]

def esc(s): return s.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
def text(x,y,s,size,fill=INK,font=BODY,weight="400",anchor="start",ls=None,italic=False):
    st=f'font-family:{font};font-size:{size}px;font-weight:{weight};fill:{fill};'
    if ls: st+=f'letter-spacing:{ls}px;'
    if italic: st+='font-style:italic;'
    parts.append(f'<text x="{x}" y="{y}" text-anchor="{anchor}" style="{st}">{esc(s)}</text>')
def line(x1,y1,x2,y2,col=INK,w=1.6):
    parts.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{col}" stroke-width="{w}"/>')
def rect(x,y,w,h,fill="none",stroke=INK,sw=1.6,rx=0):
    parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')

# fundo + moldura tipo quadro branco
parts.append(f'<rect x="0" y="0" width="{W}" height="{H}" fill="#ffffff"/>')
rect(16,16,W-32,H-32,stroke="#d9d9d9",sw=1.4,rx=16)

# cabeçalho
text(58,72,"ORGANIZE YOUR GOALS",12,fill="#888",weight="600",ls=5)
text(W-58,60,"MONTHLY",13,fill="#555",weight="600",anchor="end",ls=4)
text(W-58,102,"PLANNING",40,font=DISP,anchor="end",ls=0)

# HABITS
text(58,158,"HABITS:",26,font=DISP)
y=200
for i in range(1,9):
    text(60,y,f"{i}.",15,fill="#444",weight="700")
    line(86,y+3,352,y+3,col=INK,w=1.6)
    y+=38

# ====== RODA RADIAL ABERTA ======
cx,cy=590,468
r0,rMax=96,210
DAYS,RINGS=31,8
ringStep=(rMax-r0)/RINGS
GAP=16.0                 # vão no topo (graus)
start=GAP/2.0
dayAng=(360-GAP)/DAYS
ag=0.6; rg=1.3

def polar(r,deg):
    rad=math.radians(deg-90)
    return cx+r*math.cos(rad), cy+r*math.sin(rad)
def sector(rIn,rOut,a0,a1):
    x0,y0=polar(rOut,a0); x1,y1=polar(rOut,a1)
    x2,y2=polar(rIn,a1);  x3,y3=polar(rIn,a0)
    large=1 if (a1-a0)>180 else 0
    return (f'M{x0:.2f} {y0:.2f} A{rOut} {rOut} 0 {large} 1 {x1:.2f} {y1:.2f} '
            f'L{x2:.2f} {y2:.2f} A{rIn} {rIn} 0 {large} 0 {x3:.2f} {y3:.2f} Z')

for d in range(DAYS):
    a0=start+d*dayAng+ag; a1=start+(d+1)*dayAng-ag
    for ring in range(RINGS):
        rIn=r0+ring*ringStep+rg; rOut=r0+(ring+1)*ringStep
        parts.append(f'<path d="{sector(rIn,rOut,a0,a1)}" fill="#ffffff" stroke="{GRID}" stroke-width="1"/>')

# números dos dias
for d in range(DAYS):
    mid=start+(d+0.5)*dayAng
    tx,ty=polar(rMax+18,mid)
    parts.append(f'<text x="{tx:.1f}" y="{ty:.1f}" text-anchor="middle" '
                 f'style="font-family:{BODY};font-size:13px;font-weight:600;fill:{GRAY};dominant-baseline:central">{d+1}</text>')

# numeração dos 8 anéis (1ª fatia)
for ring in range(RINGS):
    rMid=r0+(ring+0.5)*ringStep
    tx,ty=polar(rMid,start+0.5*dayAng)
    parts.append(f'<text x="{tx:.1f}" y="{ty:.1f}" text-anchor="middle" '
                 f'style="font-family:{BODY};font-size:9px;font-weight:700;fill:#cccccc;dominant-baseline:central">{ring+1}</text>')

# MONTH/YEAR dentro do miolo (alinhado à esquerda, como na foto)
text(cx-66,cy-14,"MONTH / YEAR:",11,fill="#555",weight="700",ls=.5)
line(cx-66,cy+8,cx+34,cy+8,col=INK,w=1.5)
line(cx-66,cy+30,cx+34,cy+30,col=INK,w=1.5)

# ====== COLUNA DIREITA ======
rx=858; rw=276
# OBSERVATIONS
parts.append(f'<rect x="{rx}" y="146" width="{rw}" height="34" fill="{INK}"/>')
text(rx+rw/2,170,"OBSERVATIONS",16,font=DISP,fill="#fff",anchor="middle",ls=1)
obs_rows=5; obs_h=36
rect(rx,180,rw,obs_h*obs_rows,stroke=INK,sw=1.6)
for i in range(1,obs_rows):
    line(rx,180+obs_h*i,rx+rw,180+obs_h*i,col=GRIDS,w=1)

# KEY GOALS — 3 células numa linha + checkbox no topo de cada
ky=430
parts.append(f'<rect x="{rx}" y="{ky}" width="{rw}" height="34" fill="{INK}"/>')
text(rx+rw/2,ky+24,"KEY GOALS",16,font=DISP,fill="#fff",anchor="middle",ls=1)
gh=108; cols=3; cw=rw/cols
rect(rx,ky+34,rw,gh,stroke=INK,sw=1.6)
for c in range(1,cols):
    line(rx+cw*c,ky+34,rx+cw*c,ky+34+gh,col=GRIDS,w=1)
for c in range(cols):
    bx=rx+cw*c+cw/2-8; by=ky+34+10
    rect(bx,by,16,16,stroke=INK,sw=1.4)

# ====== FRASE ======
text(W-58,752,'"Discipline doesn\u2019t care how you feel. Discipline is doing what',13,fill="#3a3a3a",anchor="end",italic=True)
text(W-58,772,'needs to be done, even when you don\u2019t feel like doing it"\u2026',13,fill="#3a3a3a",anchor="end",italic=True)
text(W-58,808,"DISCIPLINE.",22,font=DISP,anchor="end",ls=1)
text(58,806,"Recriacao em branco \u00b7 31 dias \u00d7 8 habitos",10,fill="#bcbcbc")

svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">{"".join(parts)}</svg>'
open("/home/claude/board2.svg","w").write(svg)
cairosvg.svg2png(bytestring=svg.encode(), write_to="/mnt/user-data/outputs/monthly-planning.png",
                 output_width=W*2, output_height=H*2, background_color="#ffffff")
cairosvg.svg2pdf(bytestring=svg.encode(), write_to="/mnt/user-data/outputs/monthly-planning.pdf")
print("OK v2")
