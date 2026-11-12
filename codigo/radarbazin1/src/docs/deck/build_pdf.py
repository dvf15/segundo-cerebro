# Renders the same deck as build_deck.py directly to a vector PDF (LibreOffice
# is unavailable in this environment). Layout/colors/texts mirror build_deck.py.
from reportlab.pdfgen import canvas
from reportlab.lib.colors import Color
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import Paragraph, Frame
from reportlab.lib.styles import ParagraphStyle
from PIL import Image

def rgb(r,g,b): return Color(r/255.0,g/255.0,b/255.0)
BG=rgb(0x22,0x28,0x38); CARD=rgb(0x2E,0x35,0x47); LINE=rgb(0x3E,0x46,0x59)
TXT=rgb(0xEE,0xF1,0xF7); MUT=rgb(0xAE,0xB7,0xC6); GRN=rgb(0x4A,0xDE,0x9A)
RED=rgb(0xFB,0x8D,0xA0); WHT=rgb(0xFF,0xFF,0xFF); AMB=rgb(0xFB,0xD2,0x4E)
BLU=rgb(0x6E,0xA8,0xFE); DKG=rgb(0x06,0x28,0x1D); SOFT=rgb(0xC8,0xCF,0xDC)
HEAD=rgb(0x34,0x3C,0x4C); ANT=rgb(0x3A,0x29,0x33); DEP=rgb(0x1F,0x3A,0x30)

W,H=960.0,540.0  # 13.333 x 7.5 in * 72
c=canvas.Canvas("/tmp/NuTre-Evolucao.pdf",pagesize=(W,H))

def IN(v): return v*72.0
def newslide():
    c.setFillColor(BG); c.rect(0,0,W,H,fill=1,stroke=0)
def box(l,t,w,h,fill=None,line=None):
    if fill is not None: c.setFillColor(fill)
    if line is not None: c.setStrokeColor(line); c.setLineWidth(1)
    c.rect(IN(l),H-IN(t+h),IN(w),IN(h),fill=1 if fill is not None else 0,
           stroke=1 if line is not None else 0)
def fnt(bold): return "Helvetica-Bold" if bold else "Helvetica"
def txt(l,t,w,h,runs,align=TA_LEFT,sa=4):
    paras=[]
    for (text,size,color,bold) in runs:
        st=ParagraphStyle("s",fontName=fnt(bold),fontSize=size,leading=size*1.18,
                          textColor=color,alignment=align,spaceAfter=sa,spaceBefore=0)
        paras.append(Paragraph(text.replace("&","&amp;"),st))
    f=Frame(IN(l),H-IN(t+h),IN(w),IN(h),leftPadding=0,rightPadding=0,
            topPadding=0,bottomPadding=0,showBoundary=0)
    f.addFromList(paras,c)
def ctext(cx_in,cy_in,text,size,color,bold=True):
    c.setFont(fnt(bold),size); c.setFillColor(color)
    c.drawCentredString(IN(cx_in),H-IN(cy_in)-size*0.36,text)
def badge(cx,cy,n,col=GRN,fg=DKG):
    box(cx,cy,0.42,0.42,fill=col); ctext(cx+0.21,cy+0.21,str(n),14,fg,True)

# 1 capa
newslide(); box(0,2.7,13.333,0.06,fill=GRN)
txt(0.9,1.95,11.5,1,[("Nu.tre",40,WHT,True)])
txt(0.9,2.98,11.5,1,[("Do problema ao produto — a evolução de um diário nutricional com IA",19,GRN,False)])
txt(0.9,3.7,11.5,1,[("Da dor (comer fora e não saber os macros) ao app · Claude + Next.js + Prisma · 2026 · antes NutriTreino",14,MUT,False)])
c.showPage()

# 2 problema
newslide(); txt(0.6,0.35,12.2,0.7,[("O problema → a jornada",24,WHT,True)])
txt(0.6,1.05,12.2,0.4,[("Tudo começou de uma dor concreta de quem vive na estrada.",13,MUT,False)])
cards=[(RED,"A DOR","Quem viaja muito e come na rua não consegue calcular os macros: pratos de restaurante sem rótulo, porções que variam, e apps manuais lentos e imprecisos para o dia a dia."),
(AMB,"O PALIATIVO · CHAT","Passou a perguntar ao Claude, num Projeto com instruções e skills. Resolvia na hora — mas a conversa crescia e estourava o contexto; o histórico ficava preso no chat."),
(GRN,"A SOLUÇÃO · APP","Virou um app: foto do prato → macros na hora. Histórico no banco, contexto mínimo por chamada, sugestões por IA — no celular, 24h, sem depender do PC.")]
cw=3.7; gap=0.515; x0=0.6; y=1.95; h=3.9
for i,(col,tag,body) in enumerate(cards):
    cx=x0+i*(cw+gap)
    box(cx,y,cw,h,fill=CARD,line=LINE); box(cx,y,cw,0.10,fill=col)
    txt(cx+0.25,y+0.28,cw-0.5,0.4,[(tag,13,col,True)])
    txt(cx+0.25,y+0.85,cw-0.5,h-1.0,[(body,13.5,TXT,False)],sa=0)
    if i<2: ctext(cx+cw+gap/2,y+h/2,"→",22,MUT,True)
c.showPage()

# 3-4 timeline
appsteps=[
("12–13/06","App criado (Next.js + Prisma + Claude)","Diário com foto/texto → estimativa de macros por IA. Tema escuro e PWA."),
("13/06","Publicado: PostgreSQL + Vercel","Banco na nuvem e deploy — acessível no celular, 24h, sem depender do PC."),
("15–16/06","Estabilização do banco + foto da galeria","Conexão ao Neon robusta, rota de diagnóstico e escolher foto da galeria (não só câmera)."),
("16/06","Sugestão da próxima refeição (IA)","Recomendação por metas restantes, treino, horário e histórico."),
("16/06","Perfil/Exames editável + skill","Tela ⚙ Perfil + skill que gera o JSON de importação — a IA passa a usar seus dados."),
("16/06","Ícone próprio (identidade)","9 iterações: do 'N' ao monograma folha + halter (nutrição + treino)."),
("18/06","Treinos: Nível 2 + HIIT","Novos tipos de treino com calorias/carbo calibrados por intensidade."),
("18/06","Refino de UI","Mais contraste e fontes, fundo cinza mais leve e macros padronizados."),
("21/06","Micronutrientes — Look Good × Feel Good","Score Micro (11 micros) ao lado do Score Macro; metas editáveis; sugestão prioriza imunidade."),
("21/06","Suplementos diários + Vit. D em UI","Suplementos por nº de cápsulas somando aos micros; doses editáveis, card recolhível; Vit. D em UI."),
("24/06","% diário + histórico de micros","% do dia em cada card de macro e no score micro; gráficos de evolução dos micronutrientes."),
("24/06","Referencial científico + recomendação integrada","Racional de instruções editável (Attia, Rhonda Patrick, Galpin/Huberman, McGill); sugestão equilibra macros e micros."),
("26/06","Sugestões de refeição (próxima + cardápio do dia)","A IA sugere a próxima refeição e monta o cardápio das refeições restantes, equilibrando macros e micros, com culinária brasileira."),
("27/06","Alertas por horário/ritmo do dia","Os avisos deixam de se contradizer: leituras de \"dia\" (déficit/ritmo calórico) só após o almoço, por projeção do fim do dia."),
("30/06","App para a família (2ª pessoa)","Instância isolada da esposa (Renata): perfil, treinos (Pilates) e banco próprios; nome e ícone (rosa) customizáveis — sem afetar o app do dono."),
("02/07","Acabamento profissional + treinos/sauna","Contraste, microinterações táteis e cartões/barras refinados; novo treino Musculação + HIIT e flag de Sauna somando ao gasto calórico."),
("08/08","Módulo de Pressão Arterial","Registro, gráfico com limiar 130/80, classificação por medição e alertas (MRPA); exportação de tudo em CSV."),
("09/08","Refeições editáveis + re-estimar por IA","Corrigir os macros ou refazer a estimativa por foto/descrição numa refeição já registrada."),
("09/08","Sinalização intradiária + peso do dia","Alertas por projeção do fim do dia (proteína, sódio, fibra), teto de 2 avisos e sem sugerir sal/potássio; registro do peso do dia."),
("09/08","Histórico de peso exportável","Aba Peso no Histórico: curva por período (1a/5a/tudo), registro/edição e CSV; base importada dos gráficos do app de saúde (2011→2026)."),
("20/09","Horário por refeição + jejum corrente","Foto assume +15 min; entrada manual usa a hora atual (editável). Painel mostra o jejum desde a última refeição, com reinício manual e fuso corrigido."),
("23/09","Redesign profissional + guia de uso","Barra de navegação inferior, anéis de progresso nos macros e cabeçalhos padronizados; vídeo orientativo legendado de cada aba."),
("23/09","Nova identidade: NuTre + ícone prato/halter","Nome curto e fácil de falar (Nu·Tre = Nutrição + Treino; em 24/09 vira Nu.tre) e ícone novo: prato visto de cima com o halter inclinado — verde no dono, rosa na Renata."),
("24/09","Nome Nu.tre + navegação refinada","Barra inferior maior e acima da área segura do iPhone; Histórico abre em Peso (atalhos 1m/6m e barra de tempo) ou em Pressão vindo da aba Pressão; nome passa a Nu.tre."),
("25/09","Cards de macros: realizado, meta e saldo","Título, realizado em destaque, meta e saldo até o teto (verde = livre, vermelho = acima) com anel de %; lista de refeições recolhível; guia em vídeo vertical com o passo a passo do JSON."),
]
def tl(items,start,title):
    newslide(); txt(0.6,0.35,12,0.7,[(title,24,WHT,True)])
    h=min(1.20,(7.5-1.33)/max(1,len(items))); y=1.18
    for n,(d,t,x) in enumerate(items,start=start):
        box(0.6,y,12.1,h-0.12,fill=CARD,line=LINE); badge(0.78,y+0.18,n)
        txt(1.5,y+0.08,11,0.3,[(d.upper(),10,MUT,True)],sa=1)
        txt(1.5,y+0.32,11,0.3,[(t,16,WHT,True)],sa=1)
        txt(1.5,y+0.60,11,h-0.62,[(x,12,SOFT,False)],sa=0)
        y+=h
    c.showPage()
tl(appsteps[0:5],1,"Evolução do app — cronológico (1/5)")
tl(appsteps[5:10],6,"Evolução do app — cronológico (2/5)")
tl(appsteps[10:15],11,"Evolução do app — cronológico (3/5)")
tl(appsteps[15:20],16,"Evolução do app — cronológico (4/5)")
tl(appsteps[20:25],21,"Evolução do app — cronológico (5/5)")

# 5 antes x depois
newslide(); txt(0.6,0.35,12,0.7,[("Antes × Depois  (chat → app)",24,WHT,True)])
rows=[("Tema","Antes (chat)","Depois (app)"),
("Registrar refeição","Descrever no chat; IA respondia na conversa.","Foto/texto → IA estima → confirma/edita → salva no banco."),
("Contexto da IA","Relia a conversa inteira a cada resposta.","Só perfil + dia atual; histórico no banco."),
("Histórico","Rolar a conversa; nada somado.","Gráficos 7/14/30 dias e totais por dia."),
("Perfil e metas","Instruções/skills fixas no Projeto.","Tela ⚙ Perfil editável + skill de importação."),
("Tipos de treino","Definido por texto.","Dropdown com metas: Descanso, Nível 2, Musculação, Pernas, HIIT, BJJ, Duplo."),
("Acesso","Só no chat do Claude.","App no celular, ícone próprio, online 24h."),
("Visual","Sem interface (texto).","Tema escuro refinado: cinza claro, fontes maiores, contraste.")]
tx0=0.6; ty0=1.2; tw=[2.3,4.6,5.2]; th=5.8/len(rows)
for ri,row in enumerate(rows):
    cx=tx0
    for ci,val in enumerate(row):
        fill=HEAD if ri==0 else (ANT if ci==1 else (DEP if ci==2 else CARD))
        box(cx,ty0+ri*th,tw[ci],th,fill=fill)
        bold=(ri==0 or ci==0); size=13 if ri==0 else 12
        color=WHT if ri==0 else (TXT if ci==0 else (RED if ci==1 else GRN))
        txt(cx+0.08,ty0+ri*th+0.10,tw[ci]-0.16,th-0.12,[(val,size,color,bold)],sa=0)
        cx+=tw[ci]
c.showPage()

# 6 build deep
newslide()
txt(0.6,0.30,12.2,0.7,[("“Build deep” — William Barnett (Stanford) aplicado ao produto",23,WHT,True)])
txt(0.6,1.0,12.2,0.5,[("Por que o app ganhou força aprofundando capacidades, e não apenas somando telas.",13,MUT,False)])
box(0.6,1.65,6.0,5.45,fill=CARD,line=LINE); txt(0.85,1.8,5.5,0.4,[("O CONCEITO (BARNETT)",12,GRN,True)])
txt(0.85,2.32,5.55,4.7,[
 ("Red Queen: produto e ambiente co-evoluem. A competição é aprendizado contínuo — é preciso melhorar sem parar só para se manter relevante.",12.5,TXT,False),
 ("“Build deep”: a vantagem durável vem de aprofundar capacidades por iteração e uso real (retornos crescentes do aprender-fazendo), não de copiar tendências nem escalar raso.",12.5,TXT,False),
 ("Profundidade cria ativos difíceis de imitar; cada ciclo de feedback torna o próximo passo mais forte.",12.5,TXT,False),
 ("Armadilha oposta: a competency trap — otimizar o superficial e parar de aprender.",12.5,AMB,False)],sa=9)
box(6.75,1.65,6.0,5.45,fill=CARD,line=LINE); txt(7.0,1.8,5.5,0.4,[("COMO O APP “CONSTRUIU FUNDO”",12,GRN,True)])
txt(7.0,2.32,5.55,4.7,[
 ("Partiu de uma dor real (comer fora sem saber macros) — problema verdadeiro, não hipótese.",12.5,TXT,False),
 ("Fundamentos antes de features: banco + deploy deram a base que sustenta o aprendizado.",12.5,TXT,False),
 ("Cada ciclo aprofundou UMA capacidade: foto→macros → sugestão por IA → perfil/skill (a IA aprende seus dados) → treinos/UI.",12.5,TXT,False),
 ("O uso real puxou as próximas iterações (Red Queen): correções de banco, foto da galeria, contraste — nasceram do uso, não do palpite.",12.5,TXT,False)],sa=9)
c.showPage()

# 7-9 telas
P="/tmp/sc/"
def native_asp(path):
    im=Image.open(path); return im.size[0]/float(im.size[1])
def screens(title,items,n):
    newslide(); txt(0.6,0.30,12.2,0.6,[(title,23,WHT,True)])
    txt(0.6,0.95,12.2,0.4,[("“Build deep”: cada tela aprofundou uma capacidade do produto.",12,GRN,True)])
    cw=13.333/n; imh=4.3; y=1.55
    for i,(bn,name,comment,date,path) in enumerate(items):
        asp=native_asp(path); imw=imh*asp; cx=i*cw+(cw-imw)/2
        c.drawImage(path,IN(cx),H-IN(y+imh),width=IN(imw),height=IN(imh),mask='auto')
        badge(cx-0.05,y-0.05,bn)
        capy=y+imh+0.12; capx=i*cw+0.1; capw=cw-0.2
        txt(capx,capy,capw,0.5,[(date+" · "+name,12,WHT,True)],align=TA_CENTER,sa=1)
        txt(capx,capy+0.42,capw,1.1,[(comment,11,SOFT,False)],align=TA_CENTER,sa=0)
    c.showPage()
screens("Evolução do produto — Telas (1/3)",[
 ("1","Diário inicial","Base: dia, treino e registrar — ainda sem macros.","jun/26",P+"1014.png"),
 ("2","Treinos (inicial)","Descanso, Leve, Musculação, Pernas, BJJ, Duplo.","jun/26",P+"1017.png"),
 ("3","Macros + Sugestão IA","Cartões de macro, saldo e sugestão da próxima refeição.","16/06",P+"1019.png"),
 ("4","Registrar refeição","Foto/galeria ou texto → IA estima os macros.","16/06",P+"1018.png"),
],4)
screens("Evolução do produto — Telas (2/3)",[
 ("5","Histórico","Gráficos 7/14/30 dias e totais por dia.","16/06",P+"1022.png"),
 ("6","Treinos (evoluído)","+ Treino nível 2 e HIIT (calorias calibradas).","18/06",P+"1020.png"),
 ("7","Dashboard completo","UI refinada: macros padronizados e refeições c/ flags.","18/06",P+"1023.png"),
 ("8","Perfil & Exames","Dados editáveis + skill (nome e dados ocultados).","18/06",P+"1021.png"),
],4)
screens("Evolução do produto — Telas (3/3)",[
 ("9","Look Good + Feel Good","Score Macro e Score Micro juntos; suplementos somam aos micros.","21/06",P+"1035.png"),
 ("10","Perfil: referencial científico","Racional de instruções (autores) + metas de micros editáveis; Vit. D em UI.","24/06",P+"1049.png"),
 ("11","Suplementos por dose","8 suplementos com cápsulas/dia somando aos micros do dia.","21/06",P+"1050.png"),
 ("12","Histórico de micros","Score micro ao longo do tempo e % da meta por micronutriente.","24/06",P+"1051.png"),
 ("13","Sugestões de refeição (IA)","Próxima refeição + cardápio do dia: considera consumo, treino, objetivo, histórico e culinária brasileira.","26/06",P+"1065.png"),
],5)

# 10 icones
newslide(); txt(0.6,0.35,12,0.7,[("Evolução do ícone (10 versões)",24,WHT,True)])
labels=["1) 'N' inicial","2) Folha + halter","3) Fundido N+T","4) Folha aberta","5) Anilhas + 3 riscos","6) Minimalista","7) Halter vazado","8) Maior","9) Folha + halter (2ª)","10) Nu.tre · prato + halter"]
cols=5; cw=2.45; ch=2.7; x0=0.6; y0=1.3; isz=1.25
for i in range(10):
    r=i//cols; cc=i%cols; cx=x0+cc*cw; cy=y0+r*ch
    box(cx,cy,cw-0.3,ch-0.2,fill=CARD,line=LINE)
    c.drawImage(f"/tmp/ic/{i}.png",IN(cx+(cw-0.3-isz)/2),H-IN(cy+0.12+isz),width=IN(isz),height=IN(isz),mask='auto')
    txt(cx,cy+isz+0.18,cw-0.3,0.3,[(labels[i],12,TXT,True)],align=TA_CENTER)
c.showPage()

# 11 micronutrientes
newslide(); txt(0.6,0.30,12.2,0.7,[("Micronutrientes — Look Good × Feel Good",23,WHT,True)])
txt(0.6,1.0,12.2,0.45,[("Dois placares complementares no app: macros (estética) e micros (saúde).",13,MUT,False)])
chips=[("Score Macro · Look Good — estética & composição",GRN),("Score Micro · Feel Good — saúde & imunidade",AMB)]
for i,(t,col) in enumerate(chips):
    cx=0.6+i*6.15; box(cx,1.5,6.0,0.6,fill=CARD,line=col); ctext(cx+3.0,1.5+0.3,t,12.5,col,True)
box(0.6,2.35,6.0,4.75,fill=CARD,line=LINE); txt(0.85,2.5,5.5,0.4,[("COMO FUNCIONA",12,GRN,True)])
txt(0.85,3.0,5.55,4.2,[
 ("A IA estima 11 micronutrientes por refeição (além dos macros).",12.5,TXT,False),
 ("Score Micro 0–100 = % das metas; sódio entra como teto. % do dia também em cada card de macro.",12.5,TXT,False),
 ("Metas editáveis no Perfil; suplementos diários (por dose) somam ao dia.",12.5,TXT,False),
 ("A sugestão da próxima refeição equilibra macros e micros — fecha os macros do treino e sobe os micros mais baixos (foco em imunidade: Vit C, Vit D, zinco, B12, ferro).",12.5,TXT,False),
 ("Histórico com a evolução dos micros (score no tempo e % por micronutriente).",12.5,TXT,False)],sa=6)
box(6.75,2.35,6.0,4.75,fill=CARD,line=LINE); txt(7.0,2.5,5.5,0.4,[("MICROS ACOMPANHADOS",12,GRN,True)])
micros=[("Fibra","30 g"),("Sódio","≤ 2300 mg (teto)"),("Potássio","3400 mg"),("Cálcio","1000 mg"),
("Ferro","8 mg"),("Magnésio","420 mg"),("Zinco","11 mg"),("Ômega-3","1,6 g"),
("Vitamina C","90 mg"),("Vitamina D","600 UI"),("Vitamina B12","2,4 mcg")]
txt(7.0,3.0,5.55,4.0,[(f"{n} — {v}",12.5,TXT,False) for (n,v) in micros],sa=5)
c.showPage()

# 11.5 sugestões de refeição (feature)
newslide(); txt(0.6,0.30,12.2,0.7,[("Sugestões de refeição — próxima refeição & cardápio do dia",23,WHT,True)])
txt(0.6,1.0,12.2,0.45,[("A IA fecha o dia: o que comer agora e o cardápio das refeições restantes — macros + micros, culinária brasileira.",13,MUT,False)])
mchips=[("Próxima refeição — o que comer agora",GRN),("Cardápio do dia — refeições restantes",BLU)]
for i,(t,col) in enumerate(mchips):
    cx=0.6+i*6.15; box(cx,1.5,6.0,0.6,fill=CARD,line=col); ctext(cx+3.0,1.5+0.3,t,12.5,col,True)
box(0.6,2.35,6.0,4.75,fill=CARD,line=LINE); txt(0.85,2.5,5.5,0.4,[("COMO FUNCIONA",12,GRN,True)])
txt(0.85,3.0,5.55,4.2,[
 ("Considera o que já foi consumido, o treino do dia e o objetivo do perfil.",12.5,TXT,False),
 ("Equilibra macros (fecha proteína/carbo do treino, gordura saturada baixa) e micros (sobe o score, com foco em imunidade).",12.5,TXT,False),
 ("Usa o histórico e a culinária brasileira para sugestões realistas.",12.5,TXT,False),
 ("“Próxima refeição”: uma sugestão imediata. “Cardápio do dia”: plano das próximas refeições (até 3) com a soma e como fecha as metas.",12.5,TXT,False)],sa=10)
box(6.75,2.35,6.0,4.75,fill=CARD,line=LINE); txt(7.0,2.5,5.5,0.4,[("EXEMPLO — CARDÁPIO DO DIA",12,GRN,True)])
txt(7.0,3.0,5.55,4.2,[
 ("R3 · Almoço proteico brasileiro",13,WHT,True),
 ("Frango, arroz, feijão e brócolis · ~720 kcal · P72 C83 G10",11.5,SOFT,False),
 ("R4 · Lanche pós-treino",13,WHT,True),
 ("Whey, banana e iogurte grego · ~630 kcal · P70 C89 G6",11.5,SOFT,False),
 ("R5 · Jantar completo",13,WHT,True),
 ("Saint Peter, arroz integral e salada · ~700 kcal · P38 C65 G18",11.5,SOFT,False),
 ("Soma do cardápio: ~2000 kcal · P180 · C238 · G34",12.5,GRN,True)],sa=8)
c.showPage()

# 11.7 pressão arterial (feature)
newslide(); txt(0.6,0.30,12.2,0.7,[("Saúde além da nutrição — Pressão Arterial",23,WHT,True)])
txt(0.6,1.0,12.2,0.45,[("O app passou a acompanhar também a pressão, com base residencial (MRPA — DBH/SBC).",13,MUT,False)])
for i,(t,col) in enumerate([("Aba Pressão — só o registro",GRN),("Histórico → Pressão — gráfico e dados",BLU)]):
    cx=0.6+i*6.15; box(cx,1.5,6.0,0.6,fill=CARD,line=col); ctext(cx+3.0,1.5+0.3,t,12.5,col,True)
box(0.6,2.35,6.0,4.75,fill=CARD,line=LINE); txt(0.85,2.5,5.5,0.4,[("COMO FUNCIONA",12,GRN,True)])
txt(0.85,3.0,5.55,4.2,[
 ("Registro rápido: data, hora, sistólica/diastólica e observação.",12.5,TXT,False),
 ("Gráfico de evolução com linhas de referência 130/80 (limiar residencial).",12.5,TXT,False),
 ("Classificação automática por medição e média de 7 dias.",12.5,TXT,False),
 ("Alertas: média 7d ≥ 130/80, lembrete do protocolo MRPA (2 de manhã + 2 à noite) e aviso de “muito alta”.",12.5,TXT,False),
 ("Exportação de TUDO em CSV (macros + micros + pressão).",12.5,TXT,False)],sa=8)
box(6.75,2.35,6.0,4.75,fill=CARD,line=LINE); txt(7.0,2.5,5.5,0.4,[("CLASSIFICAÇÃO (RESIDENCIAL)",12,GRN,True)])
txt(7.0,3.0,5.55,4.2,[
 ("Normal — < 120/80",13,GRN,True),
 ("Atenção — 120–129 ou 80–84",13,AMB,True),
 ("Alta — ≥ 130 ou ≥ 85",13,RED,True),
 ("Muito alta — ≥ 180 ou ≥ 110 (alerta destacado)",13,rgb(0xEF,0x44,0x44),True),
 ("Registro pessoal — não substitui avaliação médica.",12,MUT,False)],sa=12)
c.showPage()

# 11.8 app para a família (feature)
newslide(); txt(0.6,0.30,12.2,0.7,[("Um app, duas pessoas — isolado e personalizado",23,WHT,True)])
txt(0.6,1.0,12.2,0.45,[("A mesma base de código serve o casal, com dados e identidade totalmente separados.",13,MUT,False)])
for i,(t,col) in enumerate([("Daniel — verde",GRN),("Renata — rosa",RED)]):
    cx=0.6+i*6.15; box(cx,1.5,6.0,0.6,fill=CARD,line=col); ctext(cx+3.0,1.5+0.3,t,12.5,col,True)
box(0.6,2.35,6.0,4.75,fill=CARD,line=LINE); txt(0.85,2.5,5.5,0.4,[("COMO É ISOLADO",12,GRN,True)])
txt(0.85,3.0,5.55,4.2,[
 ("Segundo projeto na mesma conta Vercel, com banco de dados próprio — nada é compartilhado.",12.5,TXT,False),
 ("Perfil, treinos, refeições, suplementos e pressão independentes.",12.5,TXT,False),
 ("Preset por instância (nome, ícone e metas iniciais) via variáveis de ambiente.",12.5,TXT,False),
 ("O app do dono não é afetado: sem o preset, o comportamento é o padrão.",12.5,TXT,False)],sa=10)
box(6.75,2.35,6.0,4.75,fill=CARD,line=LINE); txt(7.0,2.5,5.5,0.4,[("PERSONALIZAÇÃO DA RENATA",12,GRN,True)])
txt(7.0,3.0,5.55,4.2,[
 ("Nome “Renata” e ícone rosa próprios.",12.5,TXT,False),
 ("Metas femininas estimadas (ela ajusta em “Metas por treino”).",12.5,TXT,False),
 ("Treinos dela: Musculação e Pilates, com agenda semanal automática (ter/qui e qua/sex).",12.5,TXT,False),
 ("Começa em branco — sem os suplementos/dados do dono.",12.5,TXT,False)],sa=10)
c.showPage()

# 11.9 histórico de peso (feature)
newslide(); txt(0.6,0.30,12.2,0.7,[("Histórico de peso — do panorama ao dia a dia",23,WHT,True)])
txt(0.6,1.0,12.2,0.45,[("Uma linha do tempo do peso, importada dos gráficos do app de saúde e enriquecida com o registro diário.",13,MUT,False)])
for i,(t,col) in enumerate([("Aba Peso no Histórico",GRN),("Exportável em CSV",BLU)]):
    cx=0.6+i*6.15; box(cx,1.5,6.0,0.6,fill=CARD,line=col); ctext(cx+3.0,1.5+0.3,t,12.5,col,True)
box(0.6,2.35,6.0,4.75,fill=CARD,line=LINE); txt(0.85,2.5,5.5,0.4,[("COMO FUNCIONA",12,GRN,True)])
txt(0.85,3.0,5.55,4.2,[
 ("Curva de peso ao longo do tempo, com seletor de período (1 ano / 5 anos / tudo).",12.5,TXT,False),
 ("Registro e edição do peso por data; variação total do período em destaque.",12.5,TXT,False),
 ("Exportação dedicada em CSV (data, peso) — além do CSV geral do histórico.",12.5,TXT,False),
 ("Base histórica importada dos gráficos exportados do app de saúde (2011→2026); pontos editáveis.",12.5,TXT,False)],sa=10)
box(6.75,2.35,6.0,4.75,fill=DEP,line=GRN); txt(7.0,2.5,5.5,0.4,[("A JORNADA DE PESO",12,GRN,True)])
txt(7.0,3.0,5.55,4.2,[
 ("Pico de ~127 kg em 2019.",13,WHT,True),
 ("~124 kg no fim de 2025, antes do corte atual.",12.5,SOFT,False),
 ("Corte de 2026: de ~124 kg para ~107,5 kg.",13,GRN,True),
 ("Tendência do último ano: −18,6 kg.",12.5,SOFT,False),
 ("Densidade crescente (mensal → quinzenal → semanal) captura a queda recente.",12.5,TXT,False)],sa=12)
c.showPage()

# 11.95 redesign profissional (feature)
newslide(); txt(0.6,0.30,12.2,0.7,[("Redesign — cara de app profissional",23,WHT,True)])
txt(0.6,1.0,12.2,0.45,[("Navegação inferior, anéis de progresso e cabeçalhos padronizados — e um guia de uso em vídeo.",13,MUT,False)])
for i,(t,col) in enumerate([("Barra inferior · Diário / Histórico / Pressão / Perfil",GRN),("Anéis de progresso · % da meta por macro",BLU)]):
    cx=0.6+i*6.15; box(cx,1.5,6.0,0.6,fill=CARD,line=col); ctext(cx+3.0,1.5+0.3,t,12.5,col,True)
box(0.6,2.35,6.0,4.75,fill=CARD,line=LINE); txt(0.85,2.5,5.5,0.4,[("O QUE MUDOU",12,GRN,True)])
txt(0.85,3.0,5.55,4.2,[
 ("Barra de navegação fixa no rodapé, com ícones vetoriais e aba ativa — padrão de app nativo; substitui os botões do cabeçalho.",12.5,TXT,False),
 ("Cards de macros com anel de progresso: % da meta, cor pelo status (dentro / abaixo / acima), valor e faixa-alvo.",12.5,TXT,False),
 ("Títulos de seção padronizados (Score Macro · Look Good / Score Micro · Feel Good) e cabeçalhos consistentes em todas as abas.",12.5,TXT,False),
 ("Guia de uso em vídeo (2 min, legendado): como preencher e ler cada aba, incluindo a configuração por JSON via skill.",12.5,TXT,False)],sa=9)
imh=4.55; y=2.45
for k,(name,cap) in enumerate([("redesign","Diário · anéis + barra"),("redesign_nav","Navegação inferior")]):
    imw=imh*0.4737; cx=6.75+0.35+k*(imw+0.6)
    c.drawImage(f"/tmp/sc/{name}.png",IN(cx),H-IN(y+imh),width=IN(imw),height=IN(imh),mask='auto')
    ctext(cx+imw/2,y+imh+0.2,cap,11,SOFT,False)
c.showPage()

# 11.96 processo de decisão: nome e logo (3 slides)
newslide(); txt(0.6,0.30,12.2,0.7,[("Nome e logo — como decidimos (1/3): o nome",23,WHT,True)])
txt(0.6,1.0,12.2,0.45,[("Um painel interativo com alternativas lado a lado, cada uma com o porquê e um ponto de atenção.",13,MUT,False)])
box(0.6,1.65,5.0,5.45,fill=CARD,line=LINE); txt(0.85,1.8,4.5,0.4,[("CRITÉRIOS",12,GRN,True)])
txt(0.85,2.32,4.55,4.7,[
 ("Uma palavra, de preferência 2 sílabas.",12.5,TXT,False),
 ("Fala-se como se escreve.",12.5,TXT,False),
 ("Ligada ao que o app faz: foto do prato, macros e micros, treino, peso, jejum e pressão.",12.5,TXT,False),
 ("8 opções: Fibra, Nutre, Massa, Prato, Vigor, Dose, Ritmo e Balança — o atual (NutriTreino) como referência.",12.5,TXT,False),
 ("Escolha: Nutre — “o que te nutre, medido”.",13,GRN,True)],sa=10)
imh=5.45; imw=imh*1.1324376199616122
c.drawImage("/tmp/sc/id_nomes.png",IN(5.8+(7.0-imw)/2),H-IN(1.65+imh),width=IN(imw),height=IN(imh),mask='auto')
c.showPage()

newslide(); txt(0.6,0.30,12.2,0.7,[("Nome e logo — como decidimos (2/3): o logo",23,WHT,True)])
txt(0.6,1.0,12.2,0.45,[("Quatro conceitos, cada um em verde (dono) e rosa (Renata) e nos tamanhos reais da tela inicial do iPhone.",13,MUT,False)])
imw=9.3; imh=imw/1.8238021638330757
c.drawImage("/tmp/sc/id_logos.png",IN((13.333-imw)/2),H-IN(1.55+imh),width=IN(imw),height=IN(imh),mask='auto')
txt(0.6,1.6+imh,12.2,0.4,[("Anel · Folha + halter · Prato · Monograma  →  escolhido: Prato (conceito C), prato visto de cima com o halter no lugar do talher.",12.5,GRN,True)],align=TA_CENTER)
c.showPage()

newslide(); txt(0.6,0.30,12.2,0.7,[("Nome e logo — como decidimos (3/3): da escolha ao Nu.tre",23,WHT,True)])
txt(0.6,1.0,12.2,0.45,[("A prévia do painel confirmou a combinação; dois ajustes e um refinamento chegaram ao nome final.",13,MUT,False)])
imw=6.6; imh=imw/2.0205
c.drawImage("/tmp/sc/id_combo.png",IN(0.6),H-IN(1.6+imh),width=IN(imw),height=IN(imh),mask='auto')
aw=5.4; ah=aw/2.8043478260869565
c.drawImage("/tmp/sc/app_nutre_top.png",IN(0.6),H-IN(1.75+imh+ah),width=IN(aw),height=IN(ah),mask='auto')
flow=[("PAINEL · 23/09","Nutre + Prato","Escolha feita na prévia: nome, cabeçalho e ícone verde/rosa.",BLU),
      ("AJUSTES · 23/09","NuTre + halter inclinado","T maiúsculo = Nutrição + Treino; halter na diagonal, como no primeiro desenho.",AMB),
      ("NOME FINAL · 24/09","Nu.tre","Ponto separa Nu(trição) e Tre(ino): mais leve de ler e de falar.",GRN)]
y=1.6
for tag,title,body,col in flow:
    box(7.9,y,4.83,1.62,fill=CARD,line=col)
    txt(8.1,y+0.12,4.5,0.3,[(tag,10,col,True)],sa=1)
    txt(8.1,y+0.40,4.5,0.5,[(title,20,WHT,True)],sa=1)
    txt(8.1,y+0.92,4.5,0.7,[(body,11.5,SOFT,False)],sa=0)
    if col is not GRN: ctext(7.9+4.83/2,y+1.76,"↓",14,MUT,True)
    y+=1.9
c.showPage()

# 11.97 cards de macros com saldo (feature)
newslide(); txt(0.6,0.30,12.2,0.7,[("Cards de macros — realizado, meta e saldo",23,WHT,True)])
txt(0.6,1.0,12.2,0.45,[("Refinados com o uso real no iPhone: foco no que importa ver de relance.",13,MUT,False)])
box(0.6,1.65,5.6,5.45,fill=CARD,line=LINE); txt(0.85,1.8,5.1,0.4,[("COMO LER O CARD",12,GRN,True)])
txt(0.85,2.32,5.15,4.7,[
 ("Título no topo, na cor do macro (Carboidrato vira Carbo).",12.5,TXT,False),
 ("Realizado em destaque, com a unidade ao lado: 2683 kcal, 197 g.",12.5,TXT,False),
 ("Meta numa linha só, com a faixa em negrito: meta 2850–2950.",12.5,TXT,False),
 ("Saldo até o teto: verde = ainda cabe (+267 kcal livres); vermelho = estourou (−28 g acima).",12.5,GRN,True),
 ("Anel com o % da meta e cor pelo status; altura fixa, os quatro cards iguais.",12.5,TXT,False),
 ("Iterado com prints do celular: fontes e anel ajustados até não invadir nada na fonte do iOS.",12.5,MUT,False)],sa=9)
imw=6.35; imh=imw/1.3961
c.drawImage("/tmp/sc/cards_saldo.png",IN(6.45),H-IN(1.65+(5.45-imh)/2+imh),width=IN(imw),height=IN(imh),mask='auto')
c.showPage()

# 12 resumo
newslide(); txt(0.6,0.35,12.2,0.7,[("Do problema ao produto — resumo & conclusão",23,WHT,True)])
chips=[("A dor",RED),("Chat (Projeto)",AMB),("App (foto→macros)",GRN),("Saúde + família",BLU)]
x=0.6; y=1.35; ch_w=2.7; ch_h=0.6
for i,(t,col) in enumerate(chips):
    cx=x+i*(ch_w+0.55); box(cx,y,ch_w,ch_h,fill=CARD,line=col); ctext(cx+ch_w/2,y+ch_h/2,t,12.5,col,True)
    if i<3: ctext(cx+ch_w+0.275,y+ch_h/2,"→",18,MUT,True)
box(0.6,2.25,6.0,4.7,fill=CARD,line=LINE); txt(0.85,2.4,5.5,0.4,[("RESUMO",12,GRN,True)])
txt(0.85,2.95,5.55,3.9,[
 ("Dor: calcular macros comendo fora / viajando — sem rótulo, porções variáveis.",13,TXT,False),
 ("Chat: resolvia rápido, mas sem memória e estourando o contexto.",13,TXT,False),
 ("App: foto→macros, histórico no banco, sugestão por IA, perfil + skill, no celular 24h.",13,TXT,False),
 ("Iteração: micros/suplementos, sugestões e cardápio, alertas por horário, horário/jejum por refeição, redesign com navegação inferior e cards com saldo da meta.",13,TXT,False),
 ("Expansão: Pressão Arterial e histórico de peso (saúde), 2ª instância isolada (Renata) e identidade própria: Nu.tre.",13,TXT,False)],sa=8)
box(6.75,2.25,6.0,4.7,fill=DEP,line=GRN); txt(7.0,2.4,5.5,0.4,[("CONCLUSÃO",12,GRN,True)])
txt(7.0,2.95,5.55,3.9,[
 ("Um problema real + iteração contínua sob uso real transformaram um paliativo de chat em um produto com capacidades profundas.",14,WHT,True),
 ("Cada passo aprofundou uma capacidade — não apenas somou features. É o “build deep” de Barnett: a vantagem está na profundidade construída ao longo do caminho, não num único lançamento.",13,SOFT,False),
 ("Resultado: um diário que melhora conforme é usado, virou plataforma de nutrição + saúde e já serve a família — sem depender do chat nem do PC.",13,GRN,False)],sa=10)
c.showPage()

c.save(); print("PDF salvo")
