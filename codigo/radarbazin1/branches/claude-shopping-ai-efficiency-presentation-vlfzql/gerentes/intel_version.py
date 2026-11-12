# -*- coding: utf-8 -*-
"""
Versao do workshop para o TIME DE INTELIGENCIA, a partir do v3.4:
- Capa -> Time de Inteligencia.
- + slide 'A importancia do contexto' (nivelamento).
- + slide 'O segundo cerebro: salvar/organizar skills' (Obsidian).
- Substitui os agentes de exemplo por 2 novos: Analista de Performance e Analista
  de Credito (visao de sistema + 2 slides de caso com prompt + mao na massa).
- Slide de atividade sem imagem (texto + Mentimeter).
- Agenda/roteiro de tempo recalculado.
Saida: 06_Workshop_Inteligencia_v1.pptx
"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

PETROLEO=RGBColor(0x00,0x61,0x6F); VERDE=RGBColor(0x0D,0x45,0x4A); TEAL=RGBColor(0x36,0x8C,0x82)
AMBAR=RGBColor(0xED,0xA7,0x54); BEGE=RGBColor(0xCC,0xC5,0xBC); AREIA=RGBColor(0xE5,0xDE,0xD4)
WHITE=RGBColor(0xFF,0xFF,0xFF); CORAL=RGBColor(0xCD,0x51,0x51); ONDARK=AREIA; ONDARKM=BEGE
INK=VERDE; FONT="Calibri"

def _box(s,l,t,w,h,fill=None,line=None,lw=1.0,round_=False):
    sp=s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE if round_ else MSO_SHAPE.RECTANGLE,l,t,w,h)
    if fill is None: sp.fill.background()
    else: sp.fill.solid(); sp.fill.fore_color.rgb=fill
    if line is None: sp.line.fill.background()
    else: sp.line.color.rgb=line; sp.line.width=Pt(lw)
    sp.shadow.inherit=False; return sp
def _text(s,l,t,w,h,runs,align=PP_ALIGN.LEFT,anchor=MSO_ANCHOR.TOP,sa=3,ls=1.0):
    tb=s.shapes.add_textbox(l,t,w,h); tf=tb.text_frame; tf.word_wrap=True; tf.vertical_anchor=anchor
    for i,para in enumerate(runs):
        p=tf.paragraphs[0] if i==0 else tf.add_paragraph()
        p.alignment=align; p.space_after=Pt(sa); p.space_before=Pt(0); p.line_spacing=ls
        for (tx,sz,co,bo) in para:
            r=p.add_run(); r.text=tx; r.font.size=Pt(sz); r.font.color.rgb=co; r.font.bold=bo; r.font.name=FONT
    return tb
def header(s,kicker,title,ksize=10.5,tsize=22):
    _box(s,Inches(0.5),Inches(0.42),Inches(0.1),Inches(0.62),fill=PETROLEO)
    _text(s,Inches(0.72),Inches(0.4),Inches(7.4),Inches(0.3),[[(kicker.upper(),ksize,TEAL,True)]])
    _text(s,Inches(0.72),Inches(0.66),Inches(8.9),Inches(0.65),[[(title,tsize,PETROLEO,True)]])
def time_chip(s,label,fill=PETROLEO,fg=WHITE):
    w=Inches(0.28+0.088*len(label)); c=_box(s,Inches(9.62)-w,Inches(0.24),w,Inches(0.3),fill=fill,round_=True)
    tf=c.text_frame; tf.word_wrap=False; tf.margin_left=Pt(7); tf.margin_right=Pt(7); tf.margin_top=Pt(1); tf.margin_bottom=Pt(1)
    p=tf.paragraphs[0]; p.alignment=PP_ALIGN.CENTER; r=p.add_run(); r.text=label
    r.font.size=Pt(9); r.font.bold=True; r.font.color.rgb=fg; r.font.name=FONT; return c
def bullets(s,items,l,t,w,h,size=12,gap=6,mk="—  ",mc=AMBAR,hc=VERDE,sc=TEAL):
    runs=[]
    for it in items:
        if isinstance(it,tuple):
            runs.append([(mk,size,mc,True),(it[0],size,hc,True),("  —  "+it[1] if it[1] else "",size-1,sc,False)])
        else:
            runs.append([(mk,size,mc,True),(it,size,INK,False)])
    _text(s,l,t,w,h,runs,sa=gap,ls=1.03)

def make_slide(dark=False):
    s=prs.slides.add_slide(prs.slide_layouts[0])
    bg=s.shapes.add_shape(MSO_SHAPE.RECTANGLE,0,0,prs.slide_width,prs.slide_height)
    bg.fill.solid(); bg.fill.fore_color.rgb=(VERDE if dark else AREIA)
    bg.line.fill.background(); bg.shadow.inherit=False
    s.shapes._spTree.remove(bg._element); s.shapes._spTree.insert(2,bg._element); return s
def clear(s):
    tree=s.shapes._spTree
    for shp in list(s.shapes): tree.remove(shp._element)
def paint_bg(s,dark=False):
    bg=s.shapes.add_shape(MSO_SHAPE.RECTANGLE,0,0,prs.slide_width,prs.slide_height)
    bg.fill.solid(); bg.fill.fore_color.rgb=(VERDE if dark else AREIA); bg.line.fill.background(); bg.shadow.inherit=False

base="/home/user/radarbazin1/gerentes/"
prs=Presentation(base+"06_Workshop_Agentes_v3.4.pptx")
S=list(prs.slides)

# ================= 1) CAPA (edita textos) =================
rep={"SUPERS E GERENTES 2026":"TIME DE INTELIGÊNCIA · 2026","Agentes do Shopping":"Agentes de Inteligência",
     "3 grupos":"2 grupos","4 agentes":"2 agentes"}
for sh in S[0].shapes:
    if sh.has_text_frame:
        for p in sh.text_frame.paragraphs:
            for r in p.runs:
                for k,v in rep.items():
                    if k in r.text: r.text=r.text.replace(k,v)

# ================= 2) REBUILD Visao de sistema (slide 12, idx11) =================
s=S[11]; clear(s); paint_bg(s); header(s,"Visão de sistema","Os 2 agentes de Inteligência"); time_chip(s,"3 min")
_box(s,Inches(2.9),Inches(1.35),Inches(4.2),Inches(0.72),fill=PETROLEO,round_=True)
_text(s,Inches(2.9),Inches(1.4),Inches(4.2),Inches(0.62),
      [[("VOCÊ ORQUESTRA",12.5,WHITE,True)],[("define a pergunta, dá o contexto e decide",9.5,AREIA,False)]],
      align=PP_ALIGN.CENTER,anchor=MSO_ANCHOR.MIDDLE,sa=0)
ags=[("Analista de Performance","Store Performance Analysis","Lê vendas/m², fluxo e conversão; acha desvios e recomenda a ação.",PETROLEO),
     ("Analista de Crédito","Credit & Default Prediction","Avalia risco de inadimplência; sinaliza alerta e sugere a régua.",AMBAR)]
x=0.9
for nome,sub,desc,bar in ags:
    _box(s,Inches(x),Inches(2.5),Inches(4.05),Inches(2.15),fill=WHITE,line=BEGE,round_=True)
    _box(s,Inches(x),Inches(2.5),Inches(4.05),Inches(0.09),fill=bar)
    _text(s,Inches(x+0.22),Inches(2.66),Inches(3.6),Inches(0.4),[[(nome,14,PETROLEO,True)]])
    _text(s,Inches(x+0.22),Inches(3.05),Inches(3.6),Inches(0.3),[[(sub,10.5,TEAL,True)]])
    _text(s,Inches(x+0.22),Inches(3.45),Inches(3.6),Inches(1.0),[[(desc,11.5,INK,False)]],ls=1.06)
    x+=4.15
_text(s,Inches(0.5),Inches(4.95),Inches(9.0),Inches(0.4),
      [[("Ciclo fechado: ",11,AMBAR,True),
        ("cada análise vira dado e skill que realimentam o time — a memória viva do ‘segundo cérebro’.",11,INK,False)]])

# ================= 3) REBUILD Mao na massa (slide 13, idx12) =================
s=S[12]; clear(s); paint_bg(s); header(s,"Mão na massa","2 grupos, 2 agentes, 80 minutos"); time_chip(s,"80 min · grupos",fill=AMBAR,fg=VERDE)
grupos=[("GRUPO 1 · PERFORMANCE","Analista de Performance","Ler a performance das lojas e recomendar intervenções.",PETROLEO),
        ("GRUPO 2 · CRÉDITO","Analista de Crédito","Avaliar risco de inadimplência e a régua por faixa.",AMBAR)]
x=0.9
for tit,ag,desc,bar in grupos:
    _box(s,Inches(x),Inches(1.5),Inches(4.05),Inches(1.55),fill=WHITE,line=BEGE,round_=True)
    _box(s,Inches(x),Inches(1.5),Inches(4.05),Inches(0.09),fill=bar)
    _text(s,Inches(x+0.22),Inches(1.64),Inches(3.6),Inches(0.3),[[(tit,11.5,PETROLEO,True)]])
    _text(s,Inches(x+0.22),Inches(1.98),Inches(3.6),Inches(0.3),[[(ag,13,VERDE,True)]])
    _text(s,Inches(x+0.22),Inches(2.36),Inches(3.6),Inches(0.6),[[(desc,10.5,TEAL,False)]],ls=1.05)
    x+=4.15
etapas=[("1","CONTEXTO","25 min"),("2","SKILLS","30 min"),("3","TESTE NO COWORK","25 min")]
x=0.9
for n,nome,tp in etapas:
    _box(s,Inches(x),Inches(3.35),Inches(2.6),Inches(1.05),fill=AREIA,line=BEGE,round_=True)
    _text(s,Inches(x+0.2),Inches(3.5),Inches(2.2),Inches(0.4),[[(n+"  ",16,AMBAR,True),(nome,12,PETROLEO,True)]])
    _text(s,Inches(x+0.2),Inches(3.95),Inches(2.2),Inches(0.3),[[(tp,11,VERDE,True)]])
    x+=2.75
_text(s,Inches(0.9),Inches(4.6),Inches(8.2),Inches(0.5),
      [[("A ficha de trabalho guia tudo. ",11,PETROLEO,True),
        ("Cada grupo constrói o seu agente no Cowork, do contexto ao teste com dados fictícios.",11,INK,False)]])

# ================= 4) REBUILD Atividade (sem imagem) =================
act=[sl for sl in S if 'Agora vamos testar' in ' '.join(sh.text_frame.text for sh in sl.shapes if sh.has_text_frame)][0]
clear(act); paint_bg(act)
header(act,"Teste ao vivo · Mentimeter","Agora vamos testar um agente de Inteligência…"); time_chip(act,"5 min")
_text(act,Inches(0.55),Inches(1.65),Inches(8.8),Inches(0.5),
      [[("Rode o seu agente (Performance ou Crédito) com um dado real e ",14,VERDE,True),
        ("liste de 3 a 5 melhorias",14,PETROLEO,True),(".",14,VERDE,True)]])
mc=_box(act,Inches(0.55),Inches(2.25),Inches(3.9),Inches(0.42),fill=AMBAR,round_=True)
tf=mc.text_frame; tf.word_wrap=False; tf.margin_left=Pt(10); tf.margin_right=Pt(10)
pp=tf.paragraphs[0]; pp.alignment=PP_ALIGN.CENTER; rr=pp.add_run(); rr.text="→  Responda no Mentimeter"
rr.font.size=Pt(12); rr.font.bold=True; rr.font.color.rgb=VERDE; rr.font.name=FONT
yy=3.05
for n in range(1,6):
    _text(act,Inches(0.6),Inches(yy),Inches(4.4),Inches(0.32),[[(f"{n}.  ",13,PETROLEO,True),("______________________________",13,BEGE,False)]]); yy+=0.4
_box(act,Inches(5.35),Inches(1.65),Inches(4.15),Inches(3.35),fill=WHITE,line=BEGE,round_=True)
_text(act,Inches(5.6),Inches(1.85),Inches(3.7),Inches(0.35),[[("O QUE AVALIAR",11,PETROLEO,True)]])
bullets(act,["A resposta usou o contexto certo?","Os números batem? (confira antes de usar)",
             "Qual dado faltou para melhorar?","Vira uma skill nova para guardar?","O que o agente NÃO deveria fazer?"],
        Inches(5.6),Inches(2.25),Inches(3.7),Inches(2.6),size=11.5,gap=8)

# ================= 5) REBUILD Agenda (slide 3, idx2) =================
s=S[2]; clear(s); paint_bg(s)
_box(s,Inches(0.5),Inches(0.42),Inches(0.1),Inches(0.62),fill=PETROLEO)
_text(s,Inches(0.72),Inches(0.4),Inches(8.8),Inches(0.3),[[("ROTEIRO DE TEMPO",10.5,TEAL,True)]])
_text(s,Inches(0.72),Inches(0.66),Inches(8.9),Inches(0.6),[[("Quanto tempo leva o workshop",22,PETROLEO,True)]])
blocos=[("Abertura & Nivelamento","IA/ML, anatomia, contexto, DNA, C.R.I.A.R., segundo cérebro","23 min"),
        ("Demo ao vivo","construir 1 agente do zero","15 min"),
        ("Segurança de dados","semáforo + 5 regras","5 min"),
        ("Os 2 agentes de Inteligência","Performance + Crédito, com prompts","8 min"),
        ("☕ Intervalo","respiro antes da prática","15 min"),
        ("Mão na massa · 2 grupos","construção guiada no Cowork","80 min"),
        ("Apresentações dos grupos","+ feedback","45 min"),
        ("Teste + Mentimeter","testar o agente e votar melhorias","5 min"),
        ("Encerramento","Inteligência Acelerada","6 min")]
y=1.32
for nome,desc,tempo in blocos:
    _box(s,Inches(0.5),Inches(y),Inches(9.0),Inches(0.37),fill=WHITE,line=BEGE,round_=True)
    _text(s,Inches(0.68),Inches(y+0.04),Inches(5.9),Inches(0.3),[[(nome,11.5,PETROLEO,True),("   "+desc,9.5,TEAL,False)]],anchor=MSO_ANCHOR.MIDDLE)
    _text(s,Inches(8.1),Inches(y+0.04),Inches(1.25),Inches(0.3),[[(tempo,11.5,VERDE,True)]],align=PP_ALIGN.RIGHT,anchor=MSO_ANCHOR.MIDDLE)
    y+=0.4
_box(s,Inches(0.5),Inches(y+0.03),Inches(9.0),Inches(0.46),fill=PETROLEO,round_=True)
_text(s,Inches(0.7),Inches(y+0.04),Inches(8.6),Inches(0.44),
      [[("Total: ",12,AMBAR,True),("≈ 202 min (3h22) de conteúdo — janela de 4 h com buffer para dúvidas.",12,WHITE,True)]],
      anchor=MSO_ANCHOR.MIDDLE)

# ================= 6) NOVOS SLIDES =================
def build_contexto():
    s=make_slide(); header(s,"Nivelamento","A importância do contexto"); time_chip(s,"2 min")
    _box(s,Inches(0.5),Inches(1.35),Inches(9.0),Inches(0.9),fill=WHITE,line=BEGE,round_=True)
    _box(s,Inches(0.5),Inches(1.35),Inches(0.09),Inches(0.9),fill=PETROLEO)
    _text(s,Inches(0.75),Inches(1.5),Inches(8.5),Inches(0.7),
          [[("O agente só sabe o que você dá a ele. ",15,VERDE,True),
            ("Sem contexto, ele generaliza ou inventa — com confiança.",14,INK,False)]],ls=1.08)
    bullets(s,[("Contexto = os 5 campos","missão + persona + conhecimento + regras + limites"),
               ("Bom contexto → decisão previsível e explicável","contexto ruim → resposta genérica ou errada"),
               ("Para inteligência","o contexto certo transforma dado bruto em análise confiável"),
               ("A IA prediz; você julga","a verdade e a interpretação continuam sendo suas"),
               ("Teste do analista novo","se ele não saberia agir com o que você escreveu, o agente também não")],
            Inches(0.55),Inches(2.5),Inches(8.9),Inches(3.0),size=12.5,gap=9)
    return s
def build_cerebro():
    s=make_slide(); header(s,"Nivelamento · Skills","O segundo cérebro: salvar e organizar as skills"); time_chip(s,"3 min")
    _box(s,Inches(0.5),Inches(1.35),Inches(9.0),Inches(0.78),fill=WHITE,line=BEGE,round_=True)
    _box(s,Inches(0.5),Inches(1.35),Inches(0.09),Inches(0.78),fill=AMBAR)
    _text(s,Inches(0.75),Inches(1.48),Inches(8.5),Inches(0.6),
          [[("Um prompt/skill que funciona é um ativo. ",14.5,VERDE,True),
            ("Não deixe morrer no chat — guarde no seu ‘segundo cérebro’.",13.5,INK,False)]],ls=1.06)
    bullets(s,[("Obsidian (ou similar)","1 skill = 1 nota SKILL.md, em markdown — offline e sua"),
               ("Cada skill tem","gatilho · passos · fontes · output · dono"),
               ("Organize por pasta","agente → skills → uma nota por skill; conecte com links [[ ]]"),
               ("Versione","v1 do workshop, v2 melhorada — anote o que mudou"),
               ("Compartilhe","biblioteca do time; reuso multiplica o ganho")],
            Inches(0.55),Inches(2.35),Inches(8.9),Inches(2.6),size=12.5,gap=8)
    _text(s,Inches(0.5),Inches(5.05),Inches(9.0),Inches(0.4),
          [[("A skill é a memória do agente. ",11.5,AMBAR,True),
            ("O ‘segundo cérebro’ é onde ela vive, evolui e vira patrimônio do time.",11.5,INK,False)]])
    return s
def agent_case(kicker,title,where,prompt,ganho,chiplabel="3 min"):
    s=make_slide(); header(s,kicker,title,tsize=21); time_chip(s,chiplabel)
    _box(s,Inches(0.5),Inches(1.4),Inches(4.55),Inches(3.55),fill=WHITE,line=BEGE,round_=True)
    _box(s,Inches(0.5),Inches(1.4),Inches(4.55),Inches(0.09),fill=PETROLEO)
    _text(s,Inches(0.7),Inches(1.55),Inches(4.2),Inches(0.3),[[("ONDE USAR",11,PETROLEO,True)]])
    bullets(s,where,Inches(0.7),Inches(1.95),Inches(4.2),Inches(2.9),size=11,gap=7)
    _box(s,Inches(5.25),Inches(1.4),Inches(4.25),Inches(3.55),fill=VERDE,line=PETROLEO,lw=1.2,round_=True)
    _box(s,Inches(5.25),Inches(1.4),Inches(4.25),Inches(0.09),fill=AMBAR)
    _text(s,Inches(5.45),Inches(1.55),Inches(3.9),Inches(0.3),[[("PROMPT PRONTO PARA COPIAR",10.5,AMBAR,True)]])
    _text(s,Inches(5.45),Inches(1.95),Inches(3.9),Inches(2.9),[[(ln,9.5,ONDARK,False)] for ln in prompt],sa=2,ls=1.06)
    _text(s,Inches(0.5),Inches(5.05),Inches(9.0),Inches(0.4),[[("Ganho: ",11.5,AMBAR,True),(ganho,11.5,INK,True)]])
    return s

perf_where=[("Monitorar performance por loja","vendas/m², fluxo, conversão, ticket"),
            ("Detectar quedas/altas consistentes","e outliers na base"),
            ("Levantar hipóteses de causa","sazonalidade, mix, preço, localização"),
            ("Recomendar 1 intervenção por loja","mídia, benefício, mix, operação"),
            ("Priorizar por impacto","e gerar o resumo executivo")]
perf_prompt=["Você é o Analista de Performance de um shopping.",
             "Abaixo, vendas mensais por loja (LUC) dos últimos",
             "12 meses — vendas/m², fluxo e conversão (colei;",
             "lojas anonimizadas).",
             "1) Aponte lojas em queda consistente e em alta.",
             "2) Levante a causa provável de cada desvio.",
             "3) Recomende 1 intervenção por loja e priorize.",
             "Saída em tabela. Dados: <cole a base>"]
cred_where=[("Classificar risco de inadimplência","por lojista: baixo / médio / alto"),
            ("Ler sinais de alerta","atraso, queda de faturamento, setor"),
            ("Sugerir ação por faixa de risco","acompanhamento, régua, renegociação, garantia"),
            ("Priorizar a carteira de cobrança","foco no maior risco × maior exposição"),
            ("Salvaguarda","decisão humana; não decidir sobre pessoas sozinho")]
cred_prompt=["Você é o Analista de Crédito de um shopping.",
             "Abaixo, dados dos lojistas: histórico de atraso,",
             "faturamento declarado, tempo de operação e setor",
             "(colei; anonimizados).",
             "1) Classifique o risco (baixo/médio/alto) com",
             "   justificativa em 1 linha.",
             "2) Aponte os 3 sinais de alerta mais fortes.",
             "3) Sugira 1 ação por faixa. Responda em tabela.",
             "Decisão humana; conferir os números."]

orig=list(prs.slides._sldIdLst)  # 35 originais
c_ctx=build_contexto(); c_cer=build_cerebro()
c_perf=agent_case("Agente · Analista de Performance","Store Performance Analysis",perf_where,perf_prompt,
                  "Da planilha ao plano de ação em minutos — resumo executivo pronto para revisar.")
c_cred=agent_case("Agente · Analista de Crédito","Credit & Default Prediction Engine",cred_where,cred_prompt,
                  "Carteira classificada por risco + ação por faixa — foco onde importa, validado por você.")
new=[list(prs.slides._sldIdLst)[35+i] for i in range(4)]  # contexto,cerebro,perf,cred (ordem de criacao)
ins=[(5,new[0]),(7,new[1]),(12,new[2]),(12,new[3])]  # idx0-based (v3.4): DNA=5, Claude=7, MaoNaMassa=12
lst=prs.slides._sldIdLst
final=[]; j=0; insd=sorted(ins,key=lambda t:t[0])
for i in range(35):
    while j<len(insd) and insd[j][0]==i: final.append(insd[j][1]); j+=1
    final.append(orig[i])
while j<len(insd): final.append(insd[j][1]); j+=1
for el in final: lst.append(el)

out=base+"06_Workshop_Inteligencia_v1.pptx"
prs.save(out); print(out.split('/')[-1],"-> slides:",len(prs.slides._sldIdLst))
