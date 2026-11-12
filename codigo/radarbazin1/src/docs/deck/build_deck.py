from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

FONT="Poppins"
BG=RGBColor(0x22,0x28,0x38); CARD=RGBColor(0x2E,0x35,0x47); LINE=RGBColor(0x3E,0x46,0x59)
TXT=RGBColor(0xEE,0xF1,0xF7); MUT=RGBColor(0xAE,0xB7,0xC6); GRN=RGBColor(0x4A,0xDE,0x9A)
RED=RGBColor(0xFB,0x8D,0xA0); WHT=RGBColor(0xFF,0xFF,0xFF); AMB=RGBColor(0xFB,0xD2,0x4E)
BLU=RGBColor(0x6E,0xA8,0xFE); DKG=RGBColor(0x06,0x28,0x1D); SOFT=RGBColor(0xC8,0xCF,0xDC)
HEAD=RGBColor(0x34,0x3C,0x4C); ANT=RGBColor(0x3A,0x29,0x33); DEP=RGBColor(0x1F,0x3A,0x30)
ASP=1290/2796; ASP23=1290/2522; ASP32=1290/2328

prs=Presentation(); prs.slide_width=Inches(13.333); prs.slide_height=Inches(7.5)
blank=prs.slide_layouts[6]
def slide():
    s=prs.slides.add_slide(blank); s.background.fill.solid(); s.background.fill.fore_color.rgb=BG; return s
def box(s,l,t,w,h,fill=None,line=None):
    sp=s.shapes.add_shape(1,Inches(l),Inches(t),Inches(w),Inches(h)); sp.shadow.inherit=False
    if fill is None: sp.fill.background()
    else: sp.fill.solid(); sp.fill.fore_color.rgb=fill
    if line is None: sp.line.fill.background()
    else: sp.line.color.rgb=line; sp.line.width=Pt(1)
    sp.text_frame.clear(); return sp
def txt(s,l,t,w,h,runs,align=PP_ALIGN.LEFT,anchor=MSO_ANCHOR.TOP,sa=4):
    tb=s.shapes.add_textbox(Inches(l),Inches(t),Inches(w),Inches(h)); tf=tb.text_frame
    tf.word_wrap=True; tf.vertical_anchor=anchor
    for i,(text,size,color,bold) in enumerate(runs):
        p=tf.paragraphs[0] if i==0 else tf.add_paragraph()
        p.alignment=align; p.space_after=Pt(sa); p.space_before=Pt(0)
        r=p.add_run(); r.text=text; r.font.size=Pt(size); r.font.color.rgb=color; r.font.bold=bold; r.font.name=FONT
    return tb
def badge(s,cx,cy,n,col=GRN,fg=DKG):
    b=box(s,cx,cy,0.42,0.42,fill=col); b.text_frame.vertical_anchor=MSO_ANCHOR.MIDDLE
    p=b.text_frame.paragraphs[0]; p.alignment=PP_ALIGN.CENTER; r=p.add_run()
    r.text=str(n); r.font.size=Pt(14); r.font.bold=True; r.font.color.rgb=fg; r.font.name=FONT

# 1 capa
s=slide(); box(s,0,2.7,13.333,0.06,fill=GRN)
txt(s,0.9,1.95,11.5,1,[("Nu.tre",40,WHT,True)])
txt(s,0.9,2.98,11.5,1,[("Do problema ao produto — a evolução de um diário nutricional com IA",19,GRN,False)])
txt(s,0.9,3.7,11.5,1,[("Da dor (comer fora e não saber os macros) ao app · Claude + Next.js + Prisma · 2026 · antes NutriTreino",14,MUT,False)])

# 2 problema -> jornada
s=slide(); txt(s,0.6,0.35,12.2,0.7,[("O problema → a jornada",24,WHT,True)])
txt(s,0.6,1.05,12.2,0.4,[("Tudo começou de uma dor concreta de quem vive na estrada.",13,MUT,False)])
cards=[
 (RED,"A DOR","Quem viaja muito e come na rua não consegue calcular os macros: pratos de restaurante sem rótulo, porções que variam, e apps manuais lentos e imprecisos para o dia a dia."),
 (AMB,"O PALIATIVO · CHAT","Passou a perguntar ao Claude, num Projeto com instruções e skills. Resolvia na hora — mas a conversa crescia e estourava o contexto; o histórico ficava preso no chat."),
 (GRN,"A SOLUÇÃO · APP","Virou um app: foto do prato → macros na hora. Histórico no banco, contexto mínimo por chamada, sugestões por IA — no celular, 24h, sem depender do PC."),
]
cw=3.7; gap=0.515; x0=0.6; y=1.95; h=3.9
for i,(col,tag,body) in enumerate(cards):
    cx=x0+i*(cw+gap)
    box(s,cx,y,cw,h,fill=CARD,line=LINE)
    box(s,cx,y,cw,0.10,fill=col)
    txt(s,cx+0.25,y+0.28,cw-0.5,0.4,[(tag,13,col,True)])
    txt(s,cx+0.25,y+0.85,cw-0.5,h-1.0,[(body,13.5,TXT,False)],sa=0)
    if i<2:
        ar=txt(s,cx+cw,y,gap,h,[("→",22,MUT,True)],align=PP_ALIGN.CENTER,anchor=MSO_ANCHOR.MIDDLE)

# 3-4 evolução do app (cronológico)
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
    s=slide(); txt(s,0.6,0.35,12,0.7,[(title,24,WHT,True)])
    h=min(1.20,(7.5-1.33)/max(1,len(items))); y=1.18
    for n,(d,t,x) in enumerate(items,start=start):
        box(s,0.6,y,12.1,h-0.12,fill=CARD,line=LINE); badge(s,0.78,y+0.18,n)
        txt(s,1.5,y+0.08,11,0.3,[(d.upper(),10,MUT,True)],sa=1)
        txt(s,1.5,y+0.32,11,0.3,[(t,16,WHT,True)],sa=1)
        txt(s,1.5,y+0.60,11,h-0.62,[(x,12,SOFT,False)],sa=0)
        y+=h
tl(appsteps[0:5],1,"Evolução do app — cronológico (1/5)")
tl(appsteps[5:10],6,"Evolução do app — cronológico (2/5)")
tl(appsteps[10:15],11,"Evolução do app — cronológico (3/5)")
tl(appsteps[15:20],16,"Evolução do app — cronológico (4/5)")
tl(appsteps[20:25],21,"Evolução do app — cronológico (5/5)")

# 5 antes x depois
s=slide(); txt(s,0.6,0.35,12,0.7,[("Antes × Depois  (chat → app)",24,WHT,True)])
rows=[("Tema","Antes (chat)","Depois (app)"),
("Registrar refeição","Descrever no chat; IA respondia na conversa.","Foto/texto → IA estima → confirma/edita → salva no banco."),
("Contexto da IA","Relia a conversa inteira a cada resposta.","Só perfil + dia atual; histórico no banco."),
("Histórico","Rolar a conversa; nada somado.","Gráficos 7/14/30 dias e totais por dia."),
("Perfil e metas","Instruções/skills fixas no Projeto.","Tela ⚙ Perfil editável + skill de importação."),
("Tipos de treino","Definido por texto.","Dropdown com metas: Descanso, Nível 2, Musculação, Pernas, HIIT, BJJ, Duplo."),
("Acesso","Só no chat do Claude.","App no celular, ícone próprio, online 24h."),
("Visual","Sem interface (texto).","Tema escuro refinado: cinza claro, fontes maiores, contraste.")]
t=s.shapes.add_table(len(rows),3,Inches(0.6),Inches(1.2),Inches(12.1),Inches(5.8)).table
t.columns[0].width=Inches(2.3); t.columns[1].width=Inches(4.6); t.columns[2].width=Inches(5.2)
for ri,row in enumerate(rows):
    for ci,val in enumerate(row):
        cell=t.cell(ri,ci); cell.vertical_anchor=MSO_ANCHOR.MIDDLE
        for m in("margin_left","margin_right"): setattr(cell,m,Inches(0.08))
        for m in("margin_top","margin_bottom"): setattr(cell,m,Inches(0.04))
        cell.fill.solid(); cell.fill.fore_color.rgb=(HEAD if ri==0 else ANT if ci==1 else DEP if ci==2 else CARD)
        p=cell.text_frame.paragraphs[0]; r=p.add_run(); r.text=val
        r.font.size=Pt(13 if ri==0 else 12); r.font.bold=(ri==0 or ci==0); r.font.name=FONT
        r.font.color.rgb=WHT if ri==0 else (TXT if ci==0 else (RED if ci==1 else GRN))

# 6 build deep (elaborado + conexão)
s=slide()
txt(s,0.6,0.30,12.2,0.7,[("“Build deep” — William Barnett (Stanford) aplicado ao produto",23,WHT,True)])
txt(s,0.6,1.0,12.2,0.5,[("Por que o app ganhou força aprofundando capacidades, e não apenas somando telas.",13,MUT,False)])
box(s,0.6,1.65,6.0,5.45,fill=CARD,line=LINE); txt(s,0.85,1.8,5.5,0.4,[("O CONCEITO (BARNETT)",12,GRN,True)])
txt(s,0.85,2.32,5.55,4.7,[
 ("Red Queen: produto e ambiente co-evoluem. A competição é aprendizado contínuo — é preciso melhorar sem parar só para se manter relevante.",12.5,TXT,False),
 ("“Build deep”: a vantagem durável vem de aprofundar capacidades por iteração e uso real (retornos crescentes do aprender-fazendo), não de copiar tendências nem escalar raso.",12.5,TXT,False),
 ("Profundidade cria ativos difíceis de imitar; cada ciclo de feedback torna o próximo passo mais forte.",12.5,TXT,False),
 ("Armadilha oposta: a competency trap — otimizar o superficial e parar de aprender.",12.5,AMB,False)],sa=9)
box(s,6.75,1.65,6.0,5.45,fill=CARD,line=LINE); txt(s,7.0,1.8,5.5,0.4,[("COMO O APP “CONSTRUIU FUNDO”",12,GRN,True)])
txt(s,7.0,2.32,5.55,4.7,[
 ("Partiu de uma dor real (comer fora sem saber macros) — problema verdadeiro, não hipótese.",12.5,TXT,False),
 ("Fundamentos antes de features: banco + deploy deram a base que sustenta o aprendizado.",12.5,TXT,False),
 ("Cada ciclo aprofundou UMA capacidade: foto→macros → sugestão por IA → perfil/skill (a IA aprende seus dados) → treinos/UI.",12.5,TXT,False),
 ("O uso real puxou as próximas iterações (Red Queen): correções de banco, foto da galeria, contraste — nasceram do uso, não do palpite.",12.5,TXT,False)],sa=9)

# 7-8 telas
def screens(title, items, n):
    s=slide(); txt(s,0.6,0.30,12.2,0.6,[(title,23,WHT,True)])
    txt(s,0.6,0.95,12.2,0.4,[("“Build deep”: cada tela aprofundou uma capacidade do produto.",12,GRN,True)])
    cw=13.333/n; imh=4.3; y=1.55
    for i,(bn,name,comment,date,path,asp) in enumerate(items):
        imw=imh*asp; cx=i*cw+(cw-imw)/2
        s.shapes.add_picture(path,Inches(cx),Inches(y),height=Inches(imh)); badge(s,cx-0.05,y-0.05,bn)
        capy=y+imh+0.12
        txt(s,cx-0.35,capy,imw+0.7,0.3,[(date+" · "+name,12,WHT,True)],align=PP_ALIGN.CENTER,sa=1)
        txt(s,cx-0.45,capy+0.32,imw+0.9,1.0,[(comment,11,SOFT,False)],align=PP_ALIGN.CENTER,sa=0)
P="/tmp/sc/"
screens("Evolução do produto — Telas (1/3)",[
 ("1","Diário inicial","Base: dia, treino e registrar — ainda sem macros.","jun/26",P+"1014.png",ASP),
 ("2","Treinos (inicial)","Descanso, Leve, Musculação, Pernas, BJJ, Duplo.","jun/26",P+"1017.png",ASP),
 ("3","Macros + Sugestão IA","Cartões de macro, saldo e sugestão da próxima refeição.","16/06",P+"1019.png",ASP),
 ("4","Registrar refeição","Foto/galeria ou texto → IA estima os macros.","16/06",P+"1018.png",ASP),
],4)
screens("Evolução do produto — Telas (2/3)",[
 ("5","Histórico","Gráficos 7/14/30 dias e totais por dia.","16/06",P+"1022.png",ASP),
 ("6","Treinos (evoluído)","+ Treino nível 2 e HIIT (calorias calibradas).","18/06",P+"1020.png",ASP),
 ("7","Dashboard completo","UI refinada: macros padronizados e refeições c/ flags.","18/06",P+"1023.png",ASP23),
 ("8","Perfil & Exames","Dados editáveis + skill (nome e dados ocultados).","18/06",P+"1021.png",ASP),
],4)
screens("Evolução do produto — Telas (3/3)",[
 ("9","Look Good + Feel Good","Score Macro e Score Micro juntos; suplementos somam aos micros.","21/06",P+"1035.png",0.3980),
 ("10","Perfil: referencial científico","Racional de instruções (autores) + metas de micros editáveis; Vit. D em UI.","24/06",P+"1049.png",0.6988),
 ("11","Suplementos por dose","8 suplementos com cápsulas/dia somando aos micros do dia.","21/06",P+"1050.png",0.4614),
 ("12","Histórico de micros","Score micro ao longo do tempo e % da meta por micronutriente.","24/06",P+"1051.png",0.4614),
 ("13","Sugestões de refeição (IA)","Próxima refeição + cardápio do dia: considera consumo, treino, objetivo, histórico e culinária brasileira.","26/06",P+"1065.png",0.4614),
],5)

# 9 icones
s=slide(); txt(s,0.6,0.35,12,0.7,[("Evolução do ícone (10 versões)",24,WHT,True)])
labels=["1) 'N' inicial","2) Folha + halter","3) Fundido N+T","4) Folha aberta","5) Anilhas + 3 riscos","6) Minimalista","7) Halter vazado","8) Maior","9) Folha + halter (2ª)","10) Nu.tre · prato + halter"]
cols=5; cw=2.45; ch=2.7; x0=0.6; y0=1.3; isz=1.25
for i in range(10):
    r=i//cols; c=i%cols; cx=x0+c*cw; cy=y0+r*ch
    box(s,cx,cy,cw-0.3,ch-0.2,fill=CARD,line=LINE)
    s.shapes.add_picture(f"/tmp/ic/{i}.png",Inches(cx+(cw-0.3-isz)/2),Inches(cy+0.12),Inches(isz),Inches(isz))
    txt(s,cx,cy+isz+0.18,cw-0.3,0.3,[(labels[i],12,TXT,True)],align=PP_ALIGN.CENTER)

# 9.5 micronutrientes (feature)
s=slide(); txt(s,0.6,0.30,12.2,0.7,[("Micronutrientes — Look Good \u00d7 Feel Good",23,WHT,True)])
txt(s,0.6,1.0,12.2,0.45,[("Dois placares complementares no app: macros (est\u00e9tica) e micros (sa\u00fade).",13,MUT,False)])
chips=[("Score Macro \u00b7 Look Good \u2014 est\u00e9tica & composi\u00e7\u00e3o",GRN),("Score Micro \u00b7 Feel Good \u2014 sa\u00fade & imunidade",AMB)]
for i,(t,col) in enumerate(chips):
    cx=0.6+i*6.15
    bx=box(s,cx,1.5,6.0,0.6,fill=CARD,line=col); bx.text_frame.vertical_anchor=MSO_ANCHOR.MIDDLE
    pp=bx.text_frame.paragraphs[0]; pp.alignment=PP_ALIGN.CENTER; rr=pp.add_run(); rr.text=t; rr.font.size=Pt(12.5); rr.font.bold=True; rr.font.color.rgb=col; rr.font.name=FONT
box(s,0.6,2.35,6.0,4.75,fill=CARD,line=LINE); txt(s,0.85,2.5,5.5,0.4,[("COMO FUNCIONA",12,GRN,True)])
txt(s,0.85,3.0,5.55,4.2,[
 ("A IA estima 11 micronutrientes por refei\u00e7\u00e3o (al\u00e9m dos macros).",12.5,TXT,False),
 ("Score Micro 0\u2013100 = % das metas; s\u00f3dio entra como teto. % do dia tamb\u00e9m em cada card de macro.",12.5,TXT,False),
 ("Metas edit\u00e1veis no Perfil; suplementos di\u00e1rios (por dose) somam ao dia.",12.5,TXT,False),
 ("A sugest\u00e3o da pr\u00f3xima refei\u00e7\u00e3o equilibra macros e micros \u2014 fecha os macros do treino e sobe os micros mais baixos (foco em imunidade: Vit C, Vit D, zinco, B12, ferro).",12.5,TXT,False),
 ("Hist\u00f3rico com a evolu\u00e7\u00e3o dos micros (score no tempo e % por micronutriente).",12.5,TXT,False)],sa=6)
box(s,6.75,2.35,6.0,4.75,fill=CARD,line=LINE); txt(s,7.0,2.5,5.5,0.4,[("MICROS ACOMPANHADOS",12,GRN,True)])
micros=[("Fibra","30 g"),("S\u00f3dio","\u2264 2300 mg (teto)"),("Pot\u00e1ssio","3400 mg"),("C\u00e1lcio","1000 mg"),
("Ferro","8 mg"),("Magn\u00e9sio","420 mg"),("Zinco","11 mg"),("\u00d4mega-3","1,6 g"),
("Vitamina C","90 mg"),("Vitamina D","600 UI"),("Vitamina B12","2,4 mcg")]
txt(s,7.0,3.0,5.55,4.0,[(f"{n} \u2014 {v}",12.5,TXT,False) for (n,v) in micros],sa=5)

# 9.6 sugest\u00f5es de refei\u00e7\u00e3o (feature)
s=slide(); txt(s,0.6,0.30,12.2,0.7,[("Sugest\u00f5es de refei\u00e7\u00e3o \u2014 pr\u00f3xima refei\u00e7\u00e3o & card\u00e1pio do dia",23,WHT,True)])
txt(s,0.6,1.0,12.2,0.45,[("A IA fecha o dia: o que comer agora e o card\u00e1pio das refei\u00e7\u00f5es restantes \u2014 macros + micros, culin\u00e1ria brasileira.",13,MUT,False)])
chips=[("Pr\u00f3xima refei\u00e7\u00e3o \u2014 o que comer agora",GRN),("Card\u00e1pio do dia \u2014 refei\u00e7\u00f5es restantes",BLU)]
for i,(t,col) in enumerate(chips):
    cx=0.6+i*6.15
    bx=box(s,cx,1.5,6.0,0.6,fill=CARD,line=col); bx.text_frame.vertical_anchor=MSO_ANCHOR.MIDDLE
    pp=bx.text_frame.paragraphs[0]; pp.alignment=PP_ALIGN.CENTER; rr=pp.add_run(); rr.text=t; rr.font.size=Pt(12.5); rr.font.bold=True; rr.font.color.rgb=col; rr.font.name=FONT
box(s,0.6,2.35,6.0,4.75,fill=CARD,line=LINE); txt(s,0.85,2.5,5.5,0.4,[("COMO FUNCIONA",12,GRN,True)])
txt(s,0.85,3.0,5.55,4.2,[
 ("Considera o que j\u00e1 foi consumido, o treino do dia e o objetivo do perfil.",12.5,TXT,False),
 ("Equilibra macros (fecha prote\u00edna/carbo do treino, gordura saturada baixa) e micros (sobe o score, com foco em imunidade).",12.5,TXT,False),
 ("Usa o hist\u00f3rico e a culin\u00e1ria brasileira para sugest\u00f5es realistas.",12.5,TXT,False),
 ("\u201cPr\u00f3xima refei\u00e7\u00e3o\u201d: uma sugest\u00e3o imediata. \u201cCard\u00e1pio do dia\u201d: plano das pr\u00f3ximas refei\u00e7\u00f5es (at\u00e9 3) com a soma e como fecha as metas.",12.5,TXT,False)],sa=10)
box(s,6.75,2.35,6.0,4.75,fill=CARD,line=LINE); txt(s,7.0,2.5,5.5,0.4,[("EXEMPLO \u2014 CARD\u00c1PIO DO DIA",12,GRN,True)])
txt(s,7.0,3.0,5.55,4.2,[
 ("R3 \u00b7 Almo\u00e7o proteico brasileiro",13,WHT,True),
 ("Frango, arroz, feij\u00e3o e br\u00f3colis \u00b7 ~720 kcal \u00b7 P72 C83 G10",11.5,SOFT,False),
 ("R4 \u00b7 Lanche p\u00f3s-treino",13,WHT,True),
 ("Whey, banana e iogurte grego \u00b7 ~630 kcal \u00b7 P70 C89 G6",11.5,SOFT,False),
 ("R5 \u00b7 Jantar completo",13,WHT,True),
 ("Saint Peter, arroz integral e salada \u00b7 ~700 kcal \u00b7 P38 C65 G18",11.5,SOFT,False),
 ("Soma do card\u00e1pio: ~2000 kcal \u00b7 P180 \u00b7 C238 \u00b7 G34",12.5,GRN,True)],sa=8)

# 9.7 pressão arterial (feature)
s=slide(); txt(s,0.6,0.30,12.2,0.7,[("Saúde além da nutrição — Pressão Arterial",23,WHT,True)])
txt(s,0.6,1.0,12.2,0.45,[("O app passou a acompanhar também a pressão, com base residencial (MRPA — DBH/SBC).",13,MUT,False)])
chips=[("Aba Pressão — só o registro",GRN),("Histórico → Pressão — gráfico e dados",BLU)]
for i,(t,col) in enumerate(chips):
    cx=0.6+i*6.15
    bx=box(s,cx,1.5,6.0,0.6,fill=CARD,line=col); bx.text_frame.vertical_anchor=MSO_ANCHOR.MIDDLE
    pp=bx.text_frame.paragraphs[0]; pp.alignment=PP_ALIGN.CENTER; rr=pp.add_run(); rr.text=t; rr.font.size=Pt(12.5); rr.font.bold=True; rr.font.color.rgb=col; rr.font.name=FONT
box(s,0.6,2.35,6.0,4.75,fill=CARD,line=LINE); txt(s,0.85,2.5,5.5,0.4,[("COMO FUNCIONA",12,GRN,True)])
txt(s,0.85,3.0,5.55,4.2,[
 ("Registro rápido: data, hora, sistólica/diastólica e observação.",12.5,TXT,False),
 ("Gráfico de evolução com linhas de referência 130/80 (limiar residencial).",12.5,TXT,False),
 ("Classificação automática por medição e média de 7 dias.",12.5,TXT,False),
 ("Alertas: média 7d ≥ 130/80, lembrete do protocolo MRPA (2 de manhã + 2 à noite) e aviso de “muito alta”.",12.5,TXT,False),
 ("Exportação de TUDO em CSV (macros + micros + pressão).",12.5,TXT,False)],sa=8)
box(s,6.75,2.35,6.0,4.75,fill=CARD,line=LINE); txt(s,7.0,2.5,5.5,0.4,[("CLASSIFICAÇÃO (RESIDENCIAL)",12,GRN,True)])
txt(s,7.0,3.0,5.55,4.2,[
 ("Normal — < 120/80",13,GRN,True),
 ("Atenção — 120–129 ou 80–84",13,AMB,True),
 ("Alta — ≥ 130 ou ≥ 85",13,RED,True),
 ("Muito alta — ≥ 180 ou ≥ 110 (alerta destacado)",13,RGBColor(0xEF,0x44,0x44),True),
 ("Registro pessoal — não substitui avaliação médica.",12,MUT,False)],sa=12)

# 9.8 app para a família (feature)
s=slide(); txt(s,0.6,0.30,12.2,0.7,[("Um app, duas pessoas — isolado e personalizado",23,WHT,True)])
txt(s,0.6,1.0,12.2,0.45,[("A mesma base de código serve o casal, com dados e identidade totalmente separados.",13,MUT,False)])
chips=[("Daniel — verde",GRN),("Renata — rosa",RED)]
for i,(t,col) in enumerate(chips):
    cx=0.6+i*6.15
    bx=box(s,cx,1.5,6.0,0.6,fill=CARD,line=col); bx.text_frame.vertical_anchor=MSO_ANCHOR.MIDDLE
    pp=bx.text_frame.paragraphs[0]; pp.alignment=PP_ALIGN.CENTER; rr=pp.add_run(); rr.text=t; rr.font.size=Pt(12.5); rr.font.bold=True; rr.font.color.rgb=col; rr.font.name=FONT
box(s,0.6,2.35,6.0,4.75,fill=CARD,line=LINE); txt(s,0.85,2.5,5.5,0.4,[("COMO É ISOLADO",12,GRN,True)])
txt(s,0.85,3.0,5.55,4.2,[
 ("Segundo projeto na mesma conta Vercel, com banco de dados próprio — nada é compartilhado.",12.5,TXT,False),
 ("Perfil, treinos, refeições, suplementos e pressão independentes.",12.5,TXT,False),
 ("Preset por instância (nome, ícone e metas iniciais) via variáveis de ambiente.",12.5,TXT,False),
 ("O app do dono não é afetado: sem o preset, o comportamento é o padrão.",12.5,TXT,False)],sa=10)
box(s,6.75,2.35,6.0,4.75,fill=CARD,line=LINE); txt(s,7.0,2.5,5.5,0.4,[("PERSONALIZAÇÃO DA RENATA",12,GRN,True)])
txt(s,7.0,3.0,5.55,4.2,[
 ("Nome “Renata” e ícone rosa próprios.",12.5,TXT,False),
 ("Metas femininas estimadas (ela ajusta em “Metas por treino”).",12.5,TXT,False),
 ("Treinos dela: Musculação e Pilates, com agenda semanal automática (ter/qui e qua/sex).",12.5,TXT,False),
 ("Começa em branco — sem os suplementos/dados do dono.",12.5,TXT,False)],sa=10)

# 9.9 histórico de peso (feature)
s=slide(); txt(s,0.6,0.30,12.2,0.7,[("Histórico de peso — do panorama ao dia a dia",23,WHT,True)])
txt(s,0.6,1.0,12.2,0.45,[("Uma linha do tempo do peso, importada dos gráficos do app de saúde e enriquecida com o registro diário.",13,MUT,False)])
chips=[("Aba Peso no Histórico",GRN),("Exportável em CSV",BLU)]
for i,(t,col) in enumerate(chips):
    cx=0.6+i*6.15
    bx=box(s,cx,1.5,6.0,0.6,fill=CARD,line=col); bx.text_frame.vertical_anchor=MSO_ANCHOR.MIDDLE
    pp=bx.text_frame.paragraphs[0]; pp.alignment=PP_ALIGN.CENTER; rr=pp.add_run(); rr.text=t; rr.font.size=Pt(12.5); rr.font.bold=True; rr.font.color.rgb=col; rr.font.name=FONT
box(s,0.6,2.35,6.0,4.75,fill=CARD,line=LINE); txt(s,0.85,2.5,5.5,0.4,[("COMO FUNCIONA",12,GRN,True)])
txt(s,0.85,3.0,5.55,4.2,[
 ("Curva de peso ao longo do tempo, com seletor de período (1 ano / 5 anos / tudo).",12.5,TXT,False),
 ("Registro e edição do peso por data; variação total do período em destaque.",12.5,TXT,False),
 ("Exportação dedicada em CSV (data, peso) — além do CSV geral do histórico.",12.5,TXT,False),
 ("Base histórica importada dos gráficos exportados do app de saúde (2011→2026); pontos editáveis.",12.5,TXT,False)],sa=10)
box(s,6.75,2.35,6.0,4.75,fill=DEP,line=GRN); txt(s,7.0,2.5,5.5,0.4,[("A JORNADA DE PESO",12,GRN,True)])
txt(s,7.0,3.0,5.55,4.2,[
 ("Pico de ~127 kg em 2019.",13,WHT,True),
 ("~124 kg no fim de 2025, antes do corte atual.",12.5,SOFT,False),
 ("Corte de 2026: de ~124 kg para ~107,5 kg.",13,GRN,True),
 ("Tendência do último ano: −18,6 kg.",12.5,SOFT,False),
 ("Densidade crescente (mensal → quinzenal → semanal) captura a queda recente.",12.5,TXT,False)],sa=12)

# 9.95 redesign profissional (feature)
s=slide(); txt(s,0.6,0.30,12.2,0.7,[("Redesign — cara de app profissional",23,WHT,True)])
txt(s,0.6,1.0,12.2,0.45,[("Navegação inferior, anéis de progresso e cabeçalhos padronizados — e um guia de uso em vídeo.",13,MUT,False)])
chips=[("Barra inferior · Diário / Histórico / Pressão / Perfil",GRN),("Anéis de progresso · % da meta por macro",BLU)]
for i,(t,col) in enumerate(chips):
    cx=0.6+i*6.15
    bx=box(s,cx,1.5,6.0,0.6,fill=CARD,line=col); bx.text_frame.vertical_anchor=MSO_ANCHOR.MIDDLE
    pp=bx.text_frame.paragraphs[0]; pp.alignment=PP_ALIGN.CENTER; rr=pp.add_run(); rr.text=t; rr.font.size=Pt(12.5); rr.font.bold=True; rr.font.color.rgb=col; rr.font.name=FONT
box(s,0.6,2.35,6.0,4.75,fill=CARD,line=LINE); txt(s,0.85,2.5,5.5,0.4,[("O QUE MUDOU",12,GRN,True)])
txt(s,0.85,3.0,5.55,4.2,[
 ("Barra de navegação fixa no rodapé, com ícones vetoriais e aba ativa — padrão de app nativo; substitui os botões do cabeçalho.",12.5,TXT,False),
 ("Cards de macros com anel de progresso: % da meta, cor pelo status (dentro / abaixo / acima), valor e faixa-alvo.",12.5,TXT,False),
 ("Títulos de seção padronizados (Score Macro · Look Good / Score Micro · Feel Good) e cabeçalhos consistentes em todas as abas.",12.5,TXT,False),
 ("Guia de uso em vídeo (2 min, legendado): como preencher e ler cada aba, incluindo a configuração por JSON via skill.",12.5,TXT,False)],sa=9)
imh=4.55; y=2.45
for k,(name,cap) in enumerate([("redesign","Diário · anéis + barra"),("redesign_nav","Navegação inferior")]):
    imw=imh*0.4737; cx=6.75+0.35+k*(imw+0.6)
    s.shapes.add_picture(f"/tmp/sc/{name}.png",Inches(cx),Inches(y),height=Inches(imh))
    txt(s,cx-0.2,y+imh+0.05,imw+0.4,0.3,[(cap,11,SOFT,False)],align=PP_ALIGN.CENTER,sa=0)

# 9.96 processo de decisão: nome e logo (3 slides)
s=slide(); txt(s,0.6,0.30,12.2,0.7,[("Nome e logo — como decidimos (1/3): o nome",23,WHT,True)])
txt(s,0.6,1.0,12.2,0.45,[("Um painel interativo com alternativas lado a lado, cada uma com o porquê e um ponto de atenção.",13,MUT,False)])
box(s,0.6,1.65,5.0,5.45,fill=CARD,line=LINE); txt(s,0.85,1.8,4.5,0.4,[("CRITÉRIOS",12,GRN,True)])
txt(s,0.85,2.32,4.55,4.7,[
 ("Uma palavra, de preferência 2 sílabas.",12.5,TXT,False),
 ("Fala-se como se escreve.",12.5,TXT,False),
 ("Ligada ao que o app faz: foto do prato, macros e micros, treino, peso, jejum e pressão.",12.5,TXT,False),
 ("8 opções: Fibra, Nutre, Massa, Prato, Vigor, Dose, Ritmo e Balança — o atual (NutriTreino) como referência.",12.5,TXT,False),
 ("Escolha: Nutre — “o que te nutre, medido”.",13,GRN,True)],sa=10)
imh=5.45; imw=imh*1.1324376199616122
s.shapes.add_picture("/tmp/sc/id_nomes.png",Inches(5.8+(7.0-imw)/2),Inches(1.65),height=Inches(imh))

s=slide(); txt(s,0.6,0.30,12.2,0.7,[("Nome e logo — como decidimos (2/3): o logo",23,WHT,True)])
txt(s,0.6,1.0,12.2,0.45,[("Quatro conceitos, cada um em verde (dono) e rosa (Renata) e nos tamanhos reais da tela inicial do iPhone.",13,MUT,False)])
imw=9.3; imh=imw/1.8238021638330757
s.shapes.add_picture("/tmp/sc/id_logos.png",Inches((13.333-imw)/2),Inches(1.55),width=Inches(imw))
txt(s,0.6,1.6+imh,12.2,0.4,[("Anel · Folha + halter · Prato · Monograma  →  escolhido: Prato (conceito C), prato visto de cima com o halter no lugar do talher.",12.5,GRN,True)],align=PP_ALIGN.CENTER)

s=slide(); txt(s,0.6,0.30,12.2,0.7,[("Nome e logo — como decidimos (3/3): da escolha ao Nu.tre",23,WHT,True)])
txt(s,0.6,1.0,12.2,0.45,[("A prévia do painel confirmou a combinação; dois ajustes e um refinamento chegaram ao nome final.",13,MUT,False)])
imw=6.6; imh=imw/2.0205
s.shapes.add_picture("/tmp/sc/id_combo.png",Inches(0.6),Inches(1.6),width=Inches(imw))
aw=5.4; ah=aw/2.8043478260869565
s.shapes.add_picture("/tmp/sc/app_nutre_top.png",Inches(0.6),Inches(1.75+imh),width=Inches(aw))
flow=[("PAINEL · 23/09","Nutre + Prato","Escolha feita na prévia: nome, cabeçalho e ícone verde/rosa.",BLU),
      ("AJUSTES · 23/09","NuTre + halter inclinado","T maiúsculo = Nutrição + Treino; halter na diagonal, como no primeiro desenho.",AMB),
      ("NOME FINAL · 24/09","Nu.tre","Ponto separa Nu(trição) e Tre(ino): mais leve de ler e de falar.",GRN)]
y=1.6
for tag,title,body,col in flow:
    box(s,7.9,y,4.83,1.62,fill=CARD,line=col)
    txt(s,8.1,y+0.12,4.5,0.3,[(tag,10,col,True)],sa=1)
    txt(s,8.1,y+0.40,4.5,0.5,[(title,20,WHT,True)],sa=1)
    txt(s,8.1,y+0.92,4.5,0.7,[(body,11.5,SOFT,False)],sa=0)
    if col is not GRN: txt(s,7.9,y+1.62,4.83,0.28,[("↓",14,MUT,True)],align=PP_ALIGN.CENTER,sa=0)
    y+=1.9

# 9.97 cards de macros com saldo (feature)
s=slide(); txt(s,0.6,0.30,12.2,0.7,[("Cards de macros — realizado, meta e saldo",23,WHT,True)])
txt(s,0.6,1.0,12.2,0.45,[("Refinados com o uso real no iPhone: foco no que importa ver de relance.",13,MUT,False)])
box(s,0.6,1.65,5.6,5.45,fill=CARD,line=LINE); txt(s,0.85,1.8,5.1,0.4,[("COMO LER O CARD",12,GRN,True)])
txt(s,0.85,2.32,5.15,4.7,[
 ("Título no topo, na cor do macro (Carboidrato vira Carbo).",12.5,TXT,False),
 ("Realizado em destaque, com a unidade ao lado: 2683 kcal, 197 g.",12.5,TXT,False),
 ("Meta numa linha só, com a faixa em negrito: meta 2850–2950.",12.5,TXT,False),
 ("Saldo até o teto: verde = ainda cabe (+267 kcal livres); vermelho = estourou (−28 g acima).",12.5,GRN,True),
 ("Anel com o % da meta e cor pelo status; altura fixa, os quatro cards iguais.",12.5,TXT,False),
 ("Iterado com prints do celular: fontes e anel ajustados até não invadir nada na fonte do iOS.",12.5,MUT,False)],sa=9)
imw=6.35; imh=imw/1.3961
s.shapes.add_picture("/tmp/sc/cards_saldo.png",Inches(6.45),Inches(1.65+(5.45-imh)/2),width=Inches(imw))

# 10 resumo & conclusão
s=slide(); txt(s,0.6,0.35,12.2,0.7,[("Do problema ao produto — resumo & conclusão",23,WHT,True)])
# strip da jornada
chips=[("A dor",RED),("Chat (Projeto)",AMB),("App (foto→macros)",GRN),("Saúde + família",BLU)]
x=0.6; y=1.35; ch_w=2.7; ch_h=0.6
for i,(t,col) in enumerate(chips):
    cx=x+i*(ch_w+0.55)
    b=box(s,cx,y,ch_w,ch_h,fill=CARD,line=col); b.text_frame.vertical_anchor=MSO_ANCHOR.MIDDLE
    p=b.text_frame.paragraphs[0]; p.alignment=PP_ALIGN.CENTER; r=p.add_run(); r.text=t; r.font.size=Pt(12.5); r.font.bold=True; r.font.color.rgb=col; r.font.name=FONT
    if i<3: txt(s,cx+ch_w,y,0.55,ch_h,[("→",18,MUT,True)],align=PP_ALIGN.CENTER,anchor=MSO_ANCHOR.MIDDLE)
# resumo card
box(s,0.6,2.25,6.0,4.7,fill=CARD,line=LINE); txt(s,0.85,2.4,5.5,0.4,[("RESUMO",12,GRN,True)])
txt(s,0.85,2.95,5.55,3.9,[
 ("Dor: calcular macros comendo fora / viajando — sem rótulo, porções variáveis.",13,TXT,False),
 ("Chat: resolvia rápido, mas sem memória e estourando o contexto.",13,TXT,False),
 ("App: foto→macros, histórico no banco, sugestão por IA, perfil + skill, no celular 24h.",13,TXT,False),
 ("Iteração: micros/suplementos, sugestões e cardápio, alertas por horário, horário/jejum por refeição, redesign com navegação inferior e cards com saldo da meta.",13,TXT,False),
 ("Expansão: Pressão Arterial e histórico de peso (saúde), 2ª instância isolada (Renata) e identidade própria: Nu.tre.",13,TXT,False)],sa=8)
# conclusão card (destaque)
box(s,6.75,2.25,6.0,4.7,fill=DEP,line=GRN); txt(s,7.0,2.4,5.5,0.4,[("CONCLUSÃO",12,GRN,True)])
txt(s,7.0,2.95,5.55,3.9,[
 ("Um problema real + iteração contínua sob uso real transformaram um paliativo de chat em um produto com capacidades profundas.",14,WHT,True),
 ("Cada passo aprofundou uma capacidade — não apenas somou features. É o “build deep” de Barnett: a vantagem está na profundidade construída ao longo do caminho, não num único lançamento.",13,SOFT,False),
 ("Resultado: um diário que melhora conforme é usado, virou plataforma de nutrição + saúde e já serve a família — sem depender do chat nem do PC.",13,GRN,False)],sa=10)

prs.save("/tmp/NuTre-Evolucao.pptx"); print("slides:", len(prs.slides._sldIdLst))
