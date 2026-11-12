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

# fundo + moldura
parts.append(f'<rect x="0" y="0" width="{W}" height="{H}" fill="#ffffff"/>')
rect(16,16,W-32,H-32,stroke="#d9d9d9",sw=1.4,rx=16)

# cabeçalho
text(58,72,"ORGANIZE YOUR GOALS",12,fill="#888",weight="600",ls=5)
text(W-58,60,"MONTHLY",13,fill="#555",weight="600",anchor="end",ls=4)
text(W-58,102,"PLANNING",40,font=DISP,anchor="end")

# ====== HABITS (lista de referência) ======
list_top=150
text(58,list_top,"HABITS:",26,font=DISP)
# 8 linhas, alinhadas verticalmente com os 8 anéis da roda
row_step=44
y0=list_top+50
for i in range(1,9):
    yy=y0+(i-1)*row_step
    text(60,yy,f"{i}.",16,fill="#333",weight="700")
    line(88,yy+3,350,yy+3,col=INK,w=1.6)
text(60,y0+8*row_step-6,"Cada anel = 1 h\u00e1bito  (anel 1 interno  a  anel 8 externo)",10.5,fill="#9a9a9a",italic=True)

# ====== RODA RADIAL — alinhada com a lista ======
# centro vertical da roda = centro vertical do bloco de hábitos
list_center=(list_top+20 + y0+7*row_step+3)/2
cx,cy=602,list_center
r0,rMax=104,232
DAYS,RINGS=31,8
ringStep=(rMax-r0)/RINGS
GAP=20.0
start=GAP/2.0
dayAng=(360-GAP)/DAYS
ag=0.55; rg=1.3

def polar(r,deg):
    rad=math.radians(deg-90)
    return cx+r*math.cos(rad), cy+r*math.sin(rad)
def sector(rIn,rOut,a0,a1):
    x0,y0p=polar(rOut,a0); x1,y1=polar(rOut,a1)
    x2,y2=polar(rIn,a1);   x3,y3=polar(rIn,a0)
    large=1 if (a1-a0)>180 else 0
    return (f'M{x0:.2f} {y0p:.2f} A{rOut} {rOut} 0 {large} 1 {x1:.2f} {y1:.2f} '
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

# numeração dos 8 anéis no VÃO do topo (1=interno ... 8=externo)
for ring in range(RINGS):
    rMid=r0+(ring+0.5)*ringStep
    parts.append(f'<text x="{cx}" y="{cy-rMid:.1f}" text-anchor="middle" '
                 f'style="font-family:{BODY};font-size:12px;font-weight:700;fill:#7a7a7a;dominant-baseline:central">{ring+1}</text>')

# miolo: MONTH/YEAR
text(cx-70,cy-14,"MONTH / YEAR:",11.5,fill="#555",weight="700",ls=.5)
line(cx-70,cy+8,cx+38,cy+8,col=INK,w=1.5)
line(cx-70,cy+30,cx+38,cy+30,col=INK,w=1.5)

# ====== COLUNA DIREITA ======
rx=872; rw=262
parts.append(f'<rect x="{rx}" y="150" width="{rw}" height="34" fill="{INK}"/>')
text(rx+rw/2,174,"OBSERVATIONS",16,font=DISP,fill="#fff",anchor="middle",ls=1)
obs_rows=5; obs_h=36
rect(rx,184,rw,obs_h*obs_rows,stroke=INK,sw=1.6)
for i in range(1,obs_rows):
    line(rx,184+obs_h*i,rx+rw,184+obs_h*i,col=GRIDS,w=1)

ky=438
parts.append(f'<rect x="{rx}" y="{ky}" width="{rw}" height="34" fill="{INK}"/>')
text(rx+rw/2,ky+24,"KEY GOALS",16,font=DISP,fill="#fff",anchor="middle",ls=1)
gh=108; cols=3; cw=rw/cols
rect(rx,ky+34,rw,gh,stroke=INK,sw=1.6)
for c in range(1,cols):
    line(rx+cw*c,ky+34,rx+cw*c,ky+34+gh,col=GRIDS,w=1)
for c in range(cols):
    bx=rx+cw*c+cw/2-8; by=ky+34+10
    rect(bx,by,16,16,stroke=INK,sw=1.4)

# frase
text(W-58,756,'"Discipline doesn\u2019t care how you feel. Discipline is doing what',13,fill="#3a3a3a",anchor="end",italic=True)
text(W-58,776,'needs to be done, even when you don\u2019t feel like doing it"\u2026',13,fill="#3a3a3a",anchor="end",italic=True)
text(W-58,810,"DISCIPLINE.",22,font=DISP,anchor="end",ls=1)

svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">{"".join(parts)}</svg>'
cairosvg.svg2png(bytestring=svg.encode(), write_to="/mnt/user-data/outputs/monthly-planning.png",
                 output_width=W*2, output_height=H*2, background_color="#ffffff")
cairosvg.svg2pdf(bytestring=svg.encode(), write_to="/mnt/user-data/outputs/monthly-planning.pdf")
print("OK v3")
