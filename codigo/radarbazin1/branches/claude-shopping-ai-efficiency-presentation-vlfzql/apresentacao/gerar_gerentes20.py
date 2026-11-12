# -*- coding: utf-8 -*-
"""
Versao de 20 min para GERENTES (Marketing, Operacoes e Negocios) de shoppings.
Base: Shopping_Inteligente_IA_Carioca_Shopping.pptx (concept-focused; sem video,
sem exercicio de prompt). Adiciona conceitos da palestra anexa (Larissa Gomes):
chat x agentes / agentic loop, modelos (Haiku/Sonnet/Opus), conectores e skills.
Saida: Shopping_Inteligente_IA_Gerentes_20min.pptx
"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

PETROLEO=RGBColor(0x00,0x61,0x6F); VERDE=RGBColor(0x0D,0x45,0x4A); TEAL=RGBColor(0x36,0x8C,0x82)
CORAL=RGBColor(0xCD,0x51,0x51); MENTA=RGBColor(0x6C,0xC6,0x80); AMBAR=RGBColor(0xED,0xA7,0x54)
BEGE=RGBColor(0xCC,0xC5,0xBC); AREIA=RGBColor(0xE5,0xDE,0xD4); WHITE=RGBColor(0xFF,0xFF,0xFF)
PAGE=WHITE; DARK=VERDE; INK=VERDE; TITLE=PETROLEO; SUB=TEAL; CARD=AREIA; CLINE=BEGE; ONDARK=AREIA; FONT="Calibri"

base="/home/user/radarbazin1/apresentacao/"
prs=Presentation(base+"Shopping_Inteligente_IA_Carioca_Shopping.pptx")
SW,SH=prs.slide_width,prs.slide_height

def box(s,l,t,w,h,fill=None,line=None,line_w=1.0,round_=False):
    shp=s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE if round_ else MSO_SHAPE.RECTANGLE,l,t,w,h)
    if fill is None: shp.fill.background()
    else: shp.fill.solid(); shp.fill.fore_color.rgb=fill
    if line is None: shp.line.fill.background()
    else: shp.line.color.rgb=line; shp.line.width=Pt(line_w)
    shp.shadow.inherit=False; return shp
def text(s,l,t,w,h,runs,align=PP_ALIGN.LEFT,anchor=MSO_ANCHOR.TOP,space_after=5,line_spacing=1.0):
    tb=s.shapes.add_textbox(l,t,w,h); tf=tb.text_frame; tf.word_wrap=True; tf.vertical_anchor=anchor
    for i,para in enumerate(runs):
        p=tf.paragraphs[0] if i==0 else tf.add_paragraph()
        p.alignment=align; p.space_after=Pt(space_after); p.space_before=Pt(0); p.line_spacing=line_spacing
        for (tx,sz,co,bo) in para:
            r=p.add_run(); r.text=tx; r.font.size=Pt(sz); r.font.color.rgb=co; r.font.bold=bo; r.font.name=FONT
    return tb
def header(s,kicker,title,time_label=None):
    box(s,Inches(0.55),Inches(0.55),Inches(0.12),Inches(0.95),fill=PETROLEO)
    text(s,Inches(0.8),Inches(0.5),Inches(9.8),Inches(0.4),[[(kicker.upper(),13,TEAL,True)]])
    text(s,Inches(0.8),Inches(0.85),Inches(11.2),Inches(0.9),[[(title,28,TITLE,True)]])
    if time_label:
        c=box(s,Inches(11.5),Inches(0.55),Inches(1.28),Inches(0.5),fill=AREIA,round_=True)
        p=c.text_frame.paragraphs[0]; p.alignment=PP_ALIGN.CENTER
        r=p.add_run(); r.text=time_label; r.font.size=Pt(13); r.font.bold=True; r.font.color.rgb=PETROLEO; r.font.name=FONT
def new_slide():
    s=prs.slides.add_slide(prs.slide_layouts[6])
    bg=s.shapes.add_shape(MSO_SHAPE.RECTANGLE,0,0,SW,SH)
    bg.fill.solid(); bg.fill.fore_color.rgb=PAGE; bg.line.fill.background(); bg.shadow.inherit=False
    s.shapes._spTree.remove(bg._element); s.shapes._spTree.insert(2,bg._element); return s
def card(s,x,y,w,h,acc,title,role,body):
    box(s,Inches(x),Inches(y),Inches(w),Inches(h),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    box(s,Inches(x),Inches(y),Inches(w),Inches(0.1),fill=acc)
    text(s,Inches(x+0.25),Inches(y+0.22),Inches(w-0.5),Inches(0.5),[[(title,17,TITLE,True)]])
    text(s,Inches(x+0.25),Inches(y+0.66),Inches(w-0.5),Inches(0.4),[[(role,12.5,TEAL,True)]])
    text(s,Inches(x+0.25),Inches(y+1.08),Inches(w-0.5),Inches(h-1.2),[[(body,13,INK,False)]],line_spacing=1.08)
def band(s,y,h,label,runs):
    box(s,Inches(0.8),Inches(y),Inches(11.73),Inches(h),fill=DARK,line=PETROLEO,line_w=1.2,round_=True)
    box(s,Inches(0.8),Inches(y),Inches(11.73),Inches(0.1),fill=AMBAR)
    if label: text(s,Inches(1.05),Inches(y+0.14),Inches(11.2),Inches(0.35),[[(label,12.5,AMBAR,True)]])
    text(s,Inches(1.05),Inches(y+(0.5 if label else 0.16)),Inches(11.2),Inches(h-0.5),runs,line_spacing=1.05)

def find(sub):
    for i,sl in enumerate(prs.slides):
        for sh in sl.shapes:
            if sh.has_text_frame and sub in sh.text_frame.text: return i
    return None

# ---- indices dos slides reaproveitados (ordem atual) ----
IX={k:find(v) for k,v in {
 "iaml":"O que é IA e Machine","llm":"O que é um LLM","pensa":"Como a IA pensa",
 "salv":"Salvaguardas","tese":"A tese e a missão","arq":"ecossistema de agentes de IA",
 "cam1":"Agentes de Descoberta","cam2":"Agentes de Execução","impacto":"produtividade move",
 "ferr":"Claude Chat, Cowork e Code","enc":"A IA não vai substituir"}.items()}
assert None not in IX.values(), IX

# ================= ADAPTAR CAPA =================
capa=prs.slides[0]
for sh in capa.shapes:
    if not sh.has_text_frame: continue
    t=sh.text_frame.text
    if "TIME CARIOCA" in t:
        sh.text_frame.paragraphs[0].runs[0].text="GERENTES DE SHOPPING"
    elif t.startswith("Shopping Inteligente"):
        # paragrafo 1 = subtitulo
        ps=sh.text_frame.paragraphs
        if len(ps)>1 and ps[1].runs:
            ps[1].runs[0].text="IA na prática para Marketing, Operações e Negócios"
            for rr in ps[1].runs[1:]: rr.text=""
    elif t.strip()=="45 minutos":
        sh.text_frame.paragraphs[0].runs[0].text="20 minutos"

# ================= RELABEL FERRAMENTAS -> conceito =================
ferr=prs.slides[IX["ferr"]]
for sh in ferr.shapes:
    if sh.has_text_frame and sh.text_frame.text.strip().startswith("PRÁTICA · FERRAMENTAS"):
        sh.text_frame.paragraphs[0].runs[0].text="CONCEITOS DE IA · O ECOSSISTEMA"
        for rr in sh.text_frame.paragraphs[0].runs[1:]: rr.text=""

# ================= REBUILD ROTEIRO (3 blocos, 20 min) =================
r=prs.slides[1]
for sh in list(r.shapes): sh._element.getparent().remove(sh._element)
bg=r.shapes.add_shape(MSO_SHAPE.RECTANGLE,0,0,SW,SH)
bg.fill.solid(); bg.fill.fore_color.rgb=WHITE; bg.line.fill.background(); bg.shadow.inherit=False
box(r,Inches(0.55),Inches(0.55),Inches(0.12),Inches(0.95),fill=PETROLEO)
text(r,Inches(0.8),Inches(0.5),Inches(9.8),Inches(0.4),[[("ROTEIRO",13,TEAL,True)]])
text(r,Inches(0.8),Inches(0.85),Inches(11.0),Inches(0.9),[[("20 minutos, em 3 blocos",28,TITLE,True)]])
c=box(r,Inches(11.25),Inches(0.55),Inches(1.55),Inches(0.5),fill=AREIA,round_=True)
cp=c.text_frame.paragraphs[0]; cp.alignment=PP_ALIGN.CENTER
cr=cp.add_run(); cr.text="20 min"; cr.font.size=Pt(13); cr.font.bold=True; cr.font.color.rgb=PETROLEO; cr.font.name=FONT
rows=[("1","O que é a IA (e como funciona)","predição x julgamento, LLM e token, como a IA pensa","~5 min",TEAL),
      ("2","Como se trabalha com a IA","chat → agentes, ecossistema, modelos, conectores, harness & loop e uso seguro","~8 min",PETROLEO),
      ("3","O Shopping Inteligente na prática","a visão do ecossistema de agentes e o impacto nos indicadores","~6 min",AMBAR)]
y=2.25; RH=1.15; GAP=0.25
for num,name,desc,tempo,acc in rows:
    box(r,Inches(0.8),Inches(y),Inches(11.73),Inches(RH),fill=CARD,line=CLINE,line_w=1.0,round_=True)
    box(r,Inches(0.8),Inches(y),Inches(0.12),Inches(RH),fill=acc)
    nb=box(r,Inches(1.05),Inches(y+0.27),Inches(0.62),Inches(0.62),fill=acc,round_=True)
    npf=nb.text_frame; npf.word_wrap=False; npf.vertical_anchor=MSO_ANCHOR.MIDDLE
    np=npf.paragraphs[0]; np.alignment=PP_ALIGN.CENTER
    nr=np.add_run(); nr.text=num; nr.font.size=Pt(21); nr.font.bold=True; nr.font.color.rgb=WHITE; nr.font.name=FONT
    text(r,Inches(1.95),Inches(y+0.2),Inches(8.1),Inches(0.4),[[(name,17,TITLE,True)]])
    text(r,Inches(1.95),Inches(y+0.64),Inches(8.4),Inches(0.4),[[(desc,12.5,SUB,False)]],line_spacing=1.0)
    text(r,Inches(10.3),Inches(y),Inches(2.2),Inches(RH),[[(tempo,15,VERDE,True)]],align=PP_ALIGN.RIGHT,anchor=MSO_ANCHOR.MIDDLE)
    y+=RH+GAP
tb=box(r,Inches(0.8),Inches(y+0.05),Inches(11.73),Inches(0.55),fill=PETROLEO,round_=True)
text(r,Inches(1.05),Inches(y+0.07),Inches(11.2),Inches(0.5),
     [[("Foco em conceitos ",13,AMBAR,True),
       ("— para decidir onde a IA acelera Marketing, Operações e Negócios. Sem exercício prático.",13,WHITE,True)]],anchor=MSO_ANCHOR.MIDDLE)
r.notes_slide.notes_text_frame.text=("Agenda (30s). ~20 min, 3 blocos, foco em conceito e decisao: (1) o que e a IA; "
 "(2) como se trabalha com ela hoje — chat->agentes, ecossistema, modelos, conectores/skills, harness & loop, uso seguro; "
 "(3) o Shopping Inteligente (visao do ecossistema no diagrama) e o impacto. Sem exercicio de prompt.")

# ================= NOVO 1: DO CHAT AOS AGENTES (a virada de chave) =================
s=new_slide()
header(s,"Conceitos de IA · Do chat aos agentes","Do chat que responde ao agente que resolve","1 min")
card(s,0.8,1.95,5.75,2.75,TEAL,"CHAT","pergunta e resposta",
     "Você conduz cada passo: pergunta, lê e pede o próximo. Ótimo para tirar dúvidas e rascunhar na hora.")
card(s,6.78,1.95,5.75,2.75,PETROLEO,"AGENTE","objetivo e resultado",
     "Você dá a meta e ele executa o processo inteiro — reúne o contexto, age e verifica, com a sua revisão no fim. (o “como” está no Harness e Loop, adiante.)")
band(s,5.05,1.55,None,
     [[("A virada de chave: delegue o objetivo, não cada etapa.  ",13.5,AREIA,True)],
      [("Não é “me ajude a fazer” — é “faça isso por mim”, com a sua revisão no fim.",12.5,BEGE,False)]])
s.notes_slide.notes_text_frame.text=("~1 min. Diferenca central: no chat voce conduz passo a passo; o agente recebe um "
 "OBJETIVO e entrega a tarefa inteira, com revisao humana no fim. Para gerente: delegar o objetivo, nao a tarefa. "
 "'Faca isso por mim'. O ciclo (loop) e a estrutura (harness) que fazem isso vem no slide Harness e Loop.")
new1=s

# ================= NOVO 2: MODELOS =================
s=new_slide()
header(s,"Conceitos de IA · Modelos","Um “cérebro” para cada tipo de tarefa","1 min")
card(s,0.8,2.05,3.71,2.8,TEAL,"HAIKU","velocidade e economia",
     "Tarefas simples e em grande volume — respostas rápidas e baratas.")
card(s,4.81,2.05,3.71,2.8,PETROLEO,"SONNET","equilíbrio para o dia a dia",
     "O trabalho do cotidiano: analisar, escrever, organizar com boa qualidade.")
card(s,8.82,2.05,3.71,2.8,AMBAR,"OPUS","raciocínio para o complexo",
     "Análise densa e decisão difícil — quando vale pensar mais fundo.")
band(s,5.15,1.35,None,
     [[("Você escolhe conforme a tarefa — do mais rápido e barato ao mais “pensante”.  ",13,AREIA,True)],
      [("Claude e ChatGPT têm famílias assim; o nome muda, a lógica é a mesma.",12,BEGE,False)]])
s.notes_slide.notes_text_frame.text=("~1 min. Nao existe 'um modelo': ha uma familia. Haiku (rapido/barato), Sonnet "
 "(equilibrio do dia a dia), Opus (raciocinio para o complexo). O usuario escolhe conforme a "
 "tarefa. ChatGPT tem familia equivalente. Mensagem: casar o custo/velocidade com a dificuldade.")
new2=s

# ================= NOVO 3: CONECTORES E SKILLS =================
s=new_slide()
header(s,"Conceitos de IA · Conectores e Skills","Como a IA entra no seu fluxo de trabalho","2 min")
card(s,0.8,2.05,5.75,2.9,PETROLEO,"CONECTORES","as pontes com os seus apps",
     "Ligam a IA aos aplicativos onde o trabalho já acontece — e-mail, agenda, planilhas, drive. Ela lê e age no seu contexto real, não numa caixa isolada.")
card(s,6.78,2.05,5.75,2.9,AMBAR,"SKILLS","ensinam o seu método",
     "Instruções reutilizáveis que ensinam o SEU jeito: quando usar, quais etapas seguir, como avaliar e em que formato entregar. Ensina uma vez; repete sempre igual.")
band(s,5.25,1.25,None,
     [[("É o que transforma uma IA genérica em uma parceira que trabalha do jeito da sua operação.  ",13,AREIA,True)],
      [("Conector = onde ela atua.   Skill = como ela faz.",12,BEGE,False)]])
s.notes_slide.notes_text_frame.text=("~2 min. Dois conceitos que tiram a IA da 'caixa de chat': CONECTORES (pontes com "
 "e-mail, agenda, planilhas, drive — ela age no contexto real) e SKILLS (procedimentos "
 "reutilizaveis que ensinam o metodo da casa). Conector = onde atua; skill = como faz. "
 "E a base de um 'agente' de verdade — e do proprio Shopping Inteligente.")
new3=s

# ================= NOVO 4: HARNESS E LOOP -> AUTOMAÇÃO =================
s=new_slide()
header(s,"Conceitos de IA · Harness e Loop","Harness + loop: quando o trabalho passa a rodar sozinho","2 min")
card(s,0.8,1.95,5.75,2.4,PETROLEO,"HARNESS","a estrutura do agente",
     "A montagem em volta do modelo: contexto, skills, ferramentas e conectores. É o que transforma a IA de “quem responde” em um agente que age no seu trabalho.")
card(s,6.78,1.95,5.75,2.4,TEAL,"LOOP","o ciclo que executa",
     "Objetivo → reúne o contexto → age → verifica → repete até concluir. O agente toca a tarefa inteira, não só um passo.")
band(s,4.55,2.12,"AUTOMAÇÃO — QUANDO AS DUAS PEÇAS SE JUNTAM",
     [[("Um gatilho (horário ou evento)  →  o harness roda o loop  →  entrega pronta para você aprovar",13.5,AREIA,True)],
      [("Ex.: toda segunda, o agente puxa os dados, monta o relatório de performance e deixa para revisão. A tarefa "
        "repetitiva passa a rodar sozinha — com a decisão humana no fim.",12,BEGE,False)]])
s.notes_slide.notes_text_frame.text=("~2 min. Duas palavras que explicam a automacao: HARNESS (o 'arnes' — a estrutura de "
 "contexto+skills+ferramentas+conectores em volta do modelo, que o torna um agente capaz de agir) e LOOP (o ciclo "
 "objetivo->contexto->age->verifica->repete->conclui). Quando o harness roda o loop a partir de um gatilho (um "
 "horario, um evento), a atividade se AUTOMATIZA: roda sozinha, repete e entrega, com a pessoa revisando. E assim "
 "que tarefas recorrentes (relatorio semanal, triagem, follow-up) saem da mao e passam a rodar sozinhas.")
new4=s

# ================= ANEXOS: slide de rosto (divisor escuro) =================
s=prs.slides.add_slide(prs.slide_layouts[6])
bg=s.shapes.add_shape(MSO_SHAPE.RECTANGLE,0,0,SW,SH)
bg.fill.solid(); bg.fill.fore_color.rgb=VERDE; bg.line.fill.background(); bg.shadow.inherit=False
s.shapes._spTree.remove(bg._element); s.shapes._spTree.insert(2,bg._element)
box(s,0,0,SW,Inches(0.18),fill=AMBAR)
box(s,0,SH-Inches(0.18),SW,Inches(0.18),fill=PETROLEO)
ch=box(s,Inches(0.9),Inches(2.35),Inches(2.95),Inches(0.44),fill=PETROLEO,round_=True)
cf=ch.text_frame; cf.margin_left=Pt(14); cf.margin_top=Pt(2); cf.margin_bottom=Pt(2); cf.vertical_anchor=MSO_ANCHOR.MIDDLE
cp=cf.paragraphs[0]; cr=cp.add_run(); cr.text="MATERIAL DE APOIO"; cr.font.size=Pt(12); cr.font.bold=True; cr.font.color.rgb=AREIA; cr.font.name=FONT
text(s,Inches(0.85),Inches(2.95),Inches(11.6),Inches(1.3),[[("Anexos",54,WHITE,True)]])
text(s,Inches(0.9),Inches(4.45),Inches(11.0),Inches(1.0),
     [[("Detalhamento dos agentes — Camadas de Descoberta e Seleção e de Execução. Retirado da sequência "
        "principal para caber em 20 min; use se sobrar tempo ou nas perguntas.",16,AREIA,False)]],line_spacing=1.12)
s.notes_slide.notes_text_frame.text=("Divisor de anexos. Os proximos slides sao o detalhamento dos agentes (Camada 1 e "
 "Camada 2), retirado da apresentacao de 20 min para otimizar o tempo. Material de apoio/consulta.")
anexos=s

# ================= REORDENAR / SELECIONAR =================
lst=prs.slides._sldIdLst; ids=list(lst)
I=lambda k: IX[k]
def sid(slide):  # sldId element de um objeto slide recém-criado
    return ids[list(prs.slides).index(slide)]
order=[ids[0], ids[1], ids[I("iaml")], ids[I("llm")], ids[I("pensa")],
       sid(new1), ids[I("ferr")], sid(new2), sid(new3), sid(new4), ids[I("salv")],
       ids[I("tese")], ids[I("arq")], ids[I("impacto")], ids[I("enc")],
       sid(anexos), ids[I("cam1")], ids[I("cam2")]]
for e in ids: lst.remove(e)
for e in order: lst.append(e)

out=base+"Shopping_Inteligente_IA_Gerentes_20min.pptx"
prs.save(out)
p2=Presentation(out); SS=list(p2.slides)
print("slides:",len(SS))
for i,sl in enumerate(SS):
    ts=[sh.text_frame.text.strip() for sh in sl.shapes if sh.has_text_frame and sh.text_frame.text.strip()]
    print(f"[{i+1:2}] {ts[0].splitlines()[0][:42]:42} | {(ts[1].splitlines()[0][:40] if len(ts)>1 else '')}")
