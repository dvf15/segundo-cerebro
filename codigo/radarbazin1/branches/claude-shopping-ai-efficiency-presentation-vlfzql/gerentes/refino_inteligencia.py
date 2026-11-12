# -*- coding: utf-8 -*-
"""
Refino do Workshop do Time de Inteligencia (v2 -> v3):
- Elimina Sam Zell / Zé Roberto Levy / 'DNA do agente' (slides 2, 3, 7, 24, 39).
- Remove referencias a supers/gerentes (material so para o Time de Inteligencia).
- Aprimora os prompts dos dois agentes com base nas skills enviadas
  (Credit & Default Prediction Engine v5 e Store Performance Analysis / Master Equation).
Entrada: 06_Workshop_Inteligencia_v2.pptx -> Saida: 06_Workshop_Inteligencia_v3.pptx
"""
from pptx import Presentation
from pptx.util import Pt
from pptx.dml.color import RGBColor

AREIA=RGBColor(0xE5,0xDE,0xD4)
base="/home/user/radarbazin1/gerentes/"
prs=Presentation(base+"06_Workshop_Inteligencia_v2.pptx")
S=list(prs.slides)

def sub(sh, old, new):
    """Substitui 'old' por 'new' preservando formatacao (run-level; fallback paragrafo)."""
    if not sh.has_text_frame: return False
    done=False
    for p in sh.text_frame.paragraphs:
        for r in p.runs:
            if old in r.text:
                r.text=r.text.replace(old,new); done=True
        if not done:
            full="".join(r.text for r in p.runs)
            if old in full and p.runs:
                p.runs[0].text=full.replace(old,new)
                for r in p.runs[1:]: r.text=""
                done=True
    return done

def set_line(sh, pi, txt):
    sh.text_frame.paragraphs[pi].runs[0].text=txt

def find(i, needle):
    for j,sh in enumerate(S[i].shapes):
        if sh.has_text_frame and needle in sh.text_frame.text:
            return j
    return None

# ================= SLIDE 2 — abertura =================
s=S[1]
set_line(s.shapes[2],0,"Hoje, o time de Inteligência constrói junto.")
set_line(s.shapes[3],0,
 "Um agente é um funcionário digital: tem identidade, método e entregáveis. "
 "Partimos das nossas skills de análise — Performance e Crédito — e cada grupo "
 "constrói o seu, do contexto ao teste.")
set_line(s.shapes[5],0,"2")
set_line(s.shapes[6],0,"grupos — um por agente")
set_line(s.shapes[8],0,"2")

# ================= SLIDE 3 — roteiro de tempo: tira 'DNA' =================
s=S[2]
j=find(2,"Abertura & Nivelamento")
if j is not None: sub(s.shapes[j], ", DNA,", ",")

# ================= SLIDE 7 — de-Zell/Levy (repurpose) =================
s=S[6]
set_line(s.shapes[1],0,"De onde nasce o agente")
set_line(s.shapes[3],0,"MENTALIDADE DE ANÁLISE")
ment=["Comece pelo risco: o downside primeiro",
      "Trajetória vale mais que fotografia",
      "Ouça os números, mesmo os que doem",
      "Boleto e indicador são o dado soberano",
      "Sem dado, marque n.v. — não invente"]
for k,t in enumerate(ment): set_line(s.shapes[5],k,t)
set_line(s.shapes[7],0,"MÉTODO DE TRABALHO")
exe=["Monitorar a performance e o fluxo por loja",
     "Ler os sinais de alerta cedo, na trajetória",
     "Classificar por perfil, faixa e prioridade",
     "Priorizar por impacto × exposição",
     "Virar cada análise em skill reutilizável"]
for k,t in enumerate(exe): set_line(s.shapes[9],k,t)
set_line(s.shapes[10],0,"Um número isolado não decide; a leitura do conjunto, sim.")

# ================= SLIDE 8 — C.R.I.A.R.: tira gerente =================
j=find(7,"gerente de operações")
if j is not None: sub(S[7].shapes[j],"sou gerente de operações do shopping","sou analista de Inteligência do shopping")

# ================= SLIDE 14 — visao de sistema: alinha descricoes =================
j=find(13,"Lê vendas/m²")
if j is not None: set_line(S[13].shapes[j],0,"Decompõe a venda (fluxo × conversão × ticket); acha o desvio e a ação.")
j=find(13,"Avalia risco de inadimplência")
if j is not None: set_line(S[13].shapes[j],0,"Classifica perfil e faixa de risco; lê o early warning e a ação.")

# ================= SLIDES 15/16 — prompts aprimorados =================
def set_bullets(sh, items):
    for k,(title,desc) in enumerate(items):
        p=sh.text_frame.paragraphs[k]
        p.runs[1].text=title
        p.runs[2].text="  —  "+desc

def rebuild_prompt(sh, lines):
    tf=sh.text_frame
    p0=tf.paragraphs[0]; sa=p0.space_after; ls=p0.line_spacing
    tf.clear()
    for k,ln in enumerate(lines):
        p=tf.paragraphs[0] if k==0 else tf.add_paragraph()
        if sa is not None: p.space_after=sa
        if ls is not None: p.line_spacing=ls
        r=p.add_run(); r.text=ln
        r.font.size=Pt(9.5); r.font.name="Calibri"; r.font.bold=False
        r.font.color.rgb=AREIA

perf_bullets=[
 ("Decompor a venda pela Master Equation","Fluxo × Conversão × Ticket, por loja"),
 ("Ler a trajetória, não a foto","12 meses vs. benchmark do cluster"),
 ("Isolar a origem do desvio","é a loja ou o fluxo do shopping?"),
 ("Recomendar 1 intervenção por loja","mídia, mix, preço, operação — por impacto"),
 ("Fechar com o resumo executivo","variável crítica, dono e próxima ação")]
perf_prompt=[
 "Você é o Analista de Performance de um shopping.",
 "Base (colei, lojas anonimizadas): vendas/m², fluxo,",
 "conversão e ticket dos últimos 12 meses.",
 "1) Decomponha cada desvio pela Master Equation",
 "   (Fluxo × Conversão × Ticket) e diga a variável crítica.",
 "2) Trajetória > foto: aponte quedas/altas consistentes",
 "   e separe 'problema da loja' de 'problema de fluxo'.",
 "3) 1 intervenção por loja, priorizada por impacto,",
 "   com dono e próxima ação. Saída em tabela.",
 "Sem dado = n.v. Confira os números."]
cred_bullets=[
 ("Classificar o perfil antes de analisar","A familiar · B franqueado · C rede · D capital aberto"),
 ("Ler a trajetória, não a foto","boleto 12m (soberano), custo de ocupação, venda vs. cluster"),
 ("Detectar o early warning","atraso eventual→recorrente, pagamento parcial, expansão"),
 ("Dar o score e a faixa","0–100 → Verde/Amarelo/Laranja/Vermelho + ação e dono"),
 ("Salvaguarda","score é insumo; decisão humana; LGPD; sem dado = n.v.")]
cred_prompt=[
 "Você é o Analista de Crédito de um shopping.",
 "Antes de analisar, classifique cada lojista num perfil",
 "(A familiar / B franqueado / C rede / D capital aberto).",
 "Base (colei, anonimizada): boleto 12m, custo de",
 "ocupação, venda vs. cluster, expansão e setor.",
 "1) Perfil + Tenant Credit Score (0–100) e faixa",
 "   (Verde/Amarelo/Laranja/Vermelho), confiança X/10.",
 "2) Trajetória > foto: liste os early warnings ativos.",
 "3) 1 ação por faixa, com dono e prazo. Em tabela.",
 "Sem dado = n.v. Score é insumo; a decisão é humana."]

set_bullets(S[14].shapes[8], perf_bullets); rebuild_prompt(S[14].shapes[12], perf_prompt)
set_bullets(S[15].shapes[8], cred_bullets); rebuild_prompt(S[15].shapes[12], cred_prompt)

# ================= SLIDE 24 — identidade: tira '— Zell' =================
j=find(23,"mentalidade — Zell")
if j is not None: sub(S[23].shapes[j],"mentalidade — Zell]","mentalidade]")

# ================= SLIDE 25 — passo 3: tira gerente/superintendente =================
j=find(24,"gerente comercial]")
if j is not None: sub(S[24].shapes[j],"gerente comercial]","o time de Inteligência]")
j=find(24,"superintendente leva")
if j is not None: sub(S[24].shapes[j],"superintendente leva Laranja/Vermelho ao comitê",
                       "o time de Inteligência sinaliza Laranja/Vermelho a quem decide")

# ================= SLIDE 33 — Anexo B (SKILL.md): dono sem superintendente =================
j=find(32,"Superintendente/EV")
if j is not None: sub(S[32].shapes[j],"Superintendente/EV, que leva Laranja/Vermelho ao comitê.",
                       "Time de Inteligência: sinaliza a quem decide (humano).")

# ================= SLIDE 39 — fecho sem Zell =================
s=S[38]
set_line(s.shapes[1],0,"Antecipar é a nossa vantagem —")
s.shapes[1].text_frame.paragraphs[1].runs[0].text="ver a trajetória antes do evento."
s.shapes[2].text_frame.paragraphs[0].runs[0].text=""   # remove '— Sam Zell'

# ================= NOTAS — limpeza de Zell/Levy/supers =================
notes_sub=[("Sam Zell","o método"),("Zell","o método"),("Zé Roberto Levy","a execução"),
           ("Levy","a execução"),("Zél","o agente"),("supers e gerentes","o time de Inteligência"),
           ("supers","o time"),("superintendência","a decisão humana"),
           ("superintendente","o time de Inteligência"),("gerentes","o time"),
           ("DNA do agente","a origem do agente")]
for sl in S:
    if not sl.has_notes_slide: continue
    tf=sl.notes_slide.notes_text_frame
    t=tf.text
    if any(a in t for a,_ in notes_sub):
        for a,b in notes_sub: t=t.replace(a,b)
        tf.text=t

out=base+"06_Workshop_Inteligencia_v3.pptx"
prs.save(out); print(out.split('/')[-1],"-> slides:",len(prs.slides._sldIdLst))
p2=Presentation(out)
T=' '.join(sh.text_frame.text for sl in p2.slides for sh in sl.shapes if sh.has_text_frame)
NT=' '.join(sl.notes_slide.notes_text_frame.text for sl in p2.slides if sl.has_notes_slide)
for w in ["Zell","Levy","Zél","DNA","supers","superintendente","gerente"]:
    print(f"  slides '{w}': {w in T}   | notas: {w in NT}")
