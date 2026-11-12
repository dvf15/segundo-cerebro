# -*- coding: utf-8 -*-
"""
Refaz a secao Cowork (Roteiro Tatico) do workshop de Inteligencia substituindo o
agente-exemplo (Hunter) pelo ANALISTA DE CREDITO (exemplo concreto, com a SKILL 16
Credit & Default) e referenciando o ANALISTA DE PERFORMANCE como o 2o agente.
Entrada: 06_Workshop_Inteligencia_v1.pptx -> Saida: 06_Workshop_Inteligencia_v2.pptx
"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

PETROLEO=RGBColor(0x00,0x61,0x6F); VERDE=RGBColor(0x0D,0x45,0x4A); TEAL=RGBColor(0x36,0x8C,0x82)
AMBAR=RGBColor(0xED,0xA7,0x54); BEGE=RGBColor(0xCC,0xC5,0xBC); AREIA=RGBColor(0xE5,0xDE,0xD4)
WHITE=RGBColor(0xFF,0xFF,0xFF); ONDARK=AREIA; FONT="Calibri"

# ---- substituicoes de FRASE (nivel paragrafo; feitas primeiro) ----
LONG=[
 ("Você é o HUNTER, agente comercial do shopping familiar classe B. Missão: caçar marcas que fecham as batalhas do cluster. Comece pelo downside; só loja física na cidade; fonte por linha; sem dado = VERIFICAR; nunca usar dado sensível.",
  "Você é o ANALISTA DE CRÉDITO do shopping. Missão: avaliar a saúde de crédito dos lojistas e prever inadimplência antes que vire vacância. Classifique o perfil A/B/C/D antes de analisar; boleto é o dado soberano; trajetória > fotografia; sem dado = n.v.; LGPD: dado de sócio PF nunca em output; decisão é humana."),
 ("Você é o HUNTER, agente comercial do shopping (familiar, classe B). Comece pelo downside; cite fonte por linha; sem dado = VERIFICAR.",
  "Você é o ANALISTA DE CRÉDITO do shopping. Classifique o perfil A/B/C/D; boleto é o dado soberano; trajetória > fotografia; sem dado = n.v.; decisão é humana."),
 ("Rode a skill varredura-de-rua-semanal e salve o resultado em saidas/, destacando os 3 leads quentes.",
  "Rode a skill early-warning-semanal e salve o resultado em saidas/, destacando os lojistas em faixa Laranja/Vermelho."),
 ("agentes — Builder, Hunter, Farmer e Entertainer",
  "agentes — Analista de Performance e Analista de Crédito"),
 ("Troque NOME pelo seu agente (Builder, Hunter, Farmer, Entertainer)",
  "Troque NOME pelo seu agente (Analista de Crédito ou Analista de Performance)"),
 ("Troque Agente-NOME por Agente-Hunter", "Troque Agente-NOME por Agente-Credito"),
 ("Repita até o mínimo: Builder/Entertainer 3, Negócios 4", "Repita até o mínimo: 3 skills por agente"),
 ("Negócios: 1 skill de conexão Hunter → Farmer", "Extra: 1 skill que conecta Performance → Crédito"),
 ("Identidade do Hunter carregada. Tenho 4 skills: varredura-de-rua-semanal, espiao-de-concorrente, radar-de-marcas e conexao-com-farmer. Qual rodar hoje?",
  "Identidade do Analista de Crédito carregada. Tenho 4 skills: early-warning-semanal, tenant-credit-score, custo-de-ocupacao e stress-de-expansao. Qual rodar hoje?"),
 ("varredura-de-rua-semanal","early-warning-semanal"),
 ("varredura-semanal","revisao-carteira-semanal"),
 # ---- exemplos concretos: trocar narrativa comercial (Hunter) por credito ----
 ("Mentalidade: comece pelo downside; onde há escassez, preço não é problema",
  "Mentalidade: comece pelo downside; trajetória vale mais que fotografia"),
 ("Execução: monitore o cluster; prospecção de rua, rua por rua",
  "Execução: acompanhe o boleto mês a mês; atraso eventual vira recorrente"),
 ("Missão: achar marcas que fecham as batalhas do cluster",
  "Missão: prever inadimplência antes que vire vacância"),
 ("Tarefa: toda segunda, varrer as 3 ruas e listar marcas fortes",
  "Tarefa: toda segunda, varrer a carteira e listar lojistas em piora"),
 ("Fontes: Maps, Instagram, iFood, imprensa",
  "Fontes: boleto interno, Master Equation, custo de ocupação"),
 ("Dono: gerente comercial leva os 3 leads quentes p/ reunião",
  "Dono: superintendente leva Laranja/Vermelho ao comitê"),
 ("Fontes: [ex.: Google Maps, Instagram, sites, imprensa]",
  "Fontes: [ex.: boleto interno, Master Equation, Receita]"),
 ("[Marca | Categoria | Local | Sinais | Fit | Fonte | Ação]",
  "[Lojista | Perfil | Score | Faixa | Gatilhos | Ação | Dono]"),
 ("Transforme em skill a forma como separamos Sinais em nota e evidência, e salve em skills/sinais-detalhados/SKILL.md.",
  "Transforme em skill a forma como classificamos a faixa de risco a partir do boleto, e salve em skills/faixa-de-risco/SKILL.md."),
 ("2026-06-15-varredura.xlsx","2026-06-15-early-warning.xlsx"),
 ("3. O que sabe: [cluster, público, batalhas, vias]",
  "3. O que sabe: [carteira, perfis A/B/C/D, sazonalidade, histórico]"),
]
# ---- substituicoes de TOKEN (nivel run; depois das frases) ----
TOKENS=[("Agente-Hunter","Agente-Credito"),("Agente Hunter","Agente Analista de Crédito"),
        ("HUNTER","ANALISTA DE CRÉDITO"),("Hunter","Analista de Crédito")]

def para_replace(p, frm, to):
    full="".join(r.text for r in p.runs)
    if frm in full and p.runs:
        p.runs[0].text=full.replace(frm,to)
        for r in p.runs[1:]: r.text=""

base="/home/user/radarbazin1/gerentes/"
prs=Presentation(base+"06_Workshop_Inteligencia_v1.pptx")
S=list(prs.slides)
for s in S:
    for sh in s.shapes:
        if not sh.has_text_frame: continue
        for p in sh.text_frame.paragraphs:
            for frm,to in LONG: para_replace(p,frm,to)
            for r in p.runs:
                for frm,to in TOKENS:
                    if frm in r.text: r.text=r.text.replace(frm,to)

# ================= REBUILD slide 33 (Anexo B — SKILL.md do Analista de Credito) =================
def box(s,l,t,w,h,fill=None,line=None,lw=1.0,round_=False):
    sp=s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE if round_ else MSO_SHAPE.RECTANGLE,l,t,w,h)
    if fill is None: sp.fill.background()
    else: sp.fill.solid(); sp.fill.fore_color.rgb=fill
    if line is None: sp.line.fill.background()
    else: sp.line.color.rgb=line; sp.line.width=Pt(lw)
    sp.shadow.inherit=False; return sp
def txt(s,l,t,w,h,runs,align=PP_ALIGN.LEFT,anchor=MSO_ANCHOR.TOP,sa=0,ls=1.0,font=FONT):
    tb=s.shapes.add_textbox(l,t,w,h); tf=tb.text_frame; tf.word_wrap=True; tf.vertical_anchor=anchor
    for i,para in enumerate(runs):
        p=tf.paragraphs[0] if i==0 else tf.add_paragraph()
        p.alignment=align; p.space_after=Pt(sa); p.space_before=Pt(0); p.line_spacing=ls
        for (tx_,sz,co,bo) in para:
            r=p.add_run(); r.text=tx_; r.font.size=Pt(sz); r.font.color.rgb=co; r.font.bold=bo; r.font.name=font
    return tb

s=S[32]
tree=s.shapes._spTree
for shp in list(s.shapes): tree.remove(shp._element)
bg=s.shapes.add_shape(MSO_SHAPE.RECTANGLE,0,0,prs.slide_width,prs.slide_height)
bg.fill.solid(); bg.fill.fore_color.rgb=AREIA; bg.line.fill.background(); bg.shadow.inherit=False
box(s,Inches(0.5),Inches(0.42),Inches(0.1),Inches(0.62),fill=PETROLEO)
txt(s,Inches(0.72),Inches(0.4),Inches(7.8),Inches(0.3),[[("ROTEIRO TÁTICO · ANEXO B",10.5,TEAL,True)]])
txt(s,Inches(0.72),Inches(0.66),Inches(8.9),Inches(0.5),[[("Modelo de SKILL.md — Early Warning (Analista de Crédito)",20,PETROLEO,True)]])
# chip consulta
c=box(s,Inches(8.35),Inches(0.24),Inches(1.15),Inches(0.3),fill=BEGE,round_=True)
cf=c.text_frame; cf.word_wrap=False; cf.margin_left=Pt(7); cf.margin_right=Pt(7); cf.margin_top=Pt(1); cf.margin_bottom=Pt(1)
cp=cf.paragraphs[0]; cp.alignment=PP_ALIGN.CENTER; cr=cp.add_run(); cr.text="consulta"; cr.font.size=Pt(9); cr.font.bold=True; cr.font.color.rgb=VERDE; cr.font.name=FONT
code=[
"---",
"name: early-warning-semanal",
"description: Use toda segunda, antes do comitê de crédito,",
"  para varrer a carteira, detectar trajetórias de risco",
"  e gerar a lista de lojistas em piora. Acione sob demanda.",
"---",
"# Early Warning Semanal — Analista de Crédito",
"## Gatilho",
"Toda segunda-feira, antes do comitê de crédito.",
"## Passos",
"1. Ler boleto/adimplência de 12 meses (dado ouro).",
"2. Marcar atraso eventual → recorrente e pagamento parcial.",
"3. Custo de ocupação subindo 2+ trimestres?",
"4. Venda caindo com o fluxo do shopping estável?",
"5. Classificar a faixa (Verde/Amarelo/Laranja/Vermelho).",
"6. Tabela: destacar Laranja/Vermelho com ação e dono.",
"## Fontes",
"Boleto interno, Master Equation, CNPJ/Receita, campo (EV).",
"## Output",
"Lojista | Perfil | Score | Faixa | Gatilhos | Ação | Dono",
"Dado faltante = n.v.  Decisão é humana.",
"## Dono",
"Superintendente/EV, que leva Laranja/Vermelho ao comitê.",
]
box(s,Inches(0.5),Inches(1.35),Inches(9.0),Inches(3.75),fill=VERDE,round_=True)
box(s,Inches(0.5),Inches(1.35),Inches(0.55),Inches(3.75),fill=RGBColor(0x0A,0x33,0x37),round_=True)
# gutter
gut=[[(str(i+1),8,TEAL,False)] for i in range(len(code))]
txt(s,Inches(0.6),Inches(1.5),Inches(0.4),Inches(3.5),gut,align=PP_ALIGN.RIGHT,sa=0,ls=1.12,font="Consolas")
# codigo
lines=[[(ln,8,ONDARK,False)] for ln in code]
txt(s,Inches(1.15),Inches(1.5),Inches(8.2),Inches(3.5),lines,sa=0,ls=1.12,font="Consolas")

out=base+"06_Workshop_Inteligencia_v2.pptx"
prs.save(out); print(out.split('/')[-1],"-> slides:",len(prs.slides._sldIdLst))
# verificacao
p2=Presentation(out); T=' '.join(sh.text_frame.text for sl in p2.slides for sh in sl.shapes if sh.has_text_frame)
print("resta 'Hunter':", 'Hunter' in T, "| tem 'Analista de Crédito':", 'Analista de Crédito' in T)
