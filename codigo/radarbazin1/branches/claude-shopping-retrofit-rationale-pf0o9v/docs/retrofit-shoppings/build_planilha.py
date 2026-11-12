# -*- coding: utf-8 -*-
"""Gera Modelo-Breakeven-Reverso.xlsx — modelo de breakeven reverso para retrofit de shoppings.
O usuario so precisa preencher as celulas de INPUT (destacadas em âmbar na aba 'Inputs').
Tudo o mais recalcula via formulas nativas do Excel."""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side, NamedStyle
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

# ---- PALETA OFICIAL ALLOS (skill pptallos) ----
NAVY = "00616F"      # petróleo — títulos, cabeçalhos, marca
TEAL = "368C82"      # teal — secundária, destaques
LIGHT = "E5DED4"     # areia — fundos de células calculadas
INPUTF = "F9E4CB"    # âmbar suave (tint) — células de input
GREY = "7A989B"      # verde-petróleo dessaturado — texto neutro
GREEN = "46926A"     # menta escurecida — positivo legível
POS_FILL = "DEF2E3"  # menta clara — fundos de sucesso/veredito
RED = "CD5151"       # coral — negativo/alerta
WHITE = "FFFFFF"
HEADBG = "00616F"    # petróleo — cabeçalhos de tabela
INK = "0D454A"       # verde-escuro — corpo de texto
thin = Side(style="thin", color="CCC5BC")  # bege — bordas
border = Border(left=thin, right=thin, top=thin, bottom=thin)
inbox = Border(left=Side(style="thin", color="EDA754"), right=Side(style="thin", color="EDA754"),
               top=Side(style="thin", color="EDA754"), bottom=Side(style="thin", color="EDA754"))

def title(ws, cell, text, size=14, color=NAVY):
    ws[cell] = text; ws[cell].font = Font(bold=True, size=size, color=color)

def hcell(ws, cell, text):
    ws[cell] = text; ws[cell].font = Font(bold=True, color=WHITE, size=10)
    ws[cell].fill = PatternFill("solid", fgColor=HEADBG); ws[cell].alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    ws[cell].border = border

def label(ws, cell, text, bold=False, color=INK):
    ws[cell] = text; ws[cell].font = Font(bold=bold, size=10, color=color)

def inputcell(ws, cell, value, fmt=None):
    ws[cell] = value; ws[cell].fill = PatternFill("solid", fgColor=INPUTF)
    ws[cell].font = Font(bold=True, size=10, color=INK); ws[cell].border = inbox
    ws[cell].alignment = Alignment(horizontal="center")
    if fmt: ws[cell].number_format = fmt

def outcell(ws, cell, formula, fmt=None, bold=True, color=NAVY, fill=None):
    ws[cell] = formula; ws[cell].font = Font(bold=bold, size=10, color=color)
    ws[cell].alignment = Alignment(horizontal="center"); ws[cell].border = border
    if fill: ws[cell].fill = PatternFill("solid", fgColor=fill)
    if fmt: ws[cell].number_format = fmt

CUR = u'R$ #,##0'; CUR2 = u'R$ #,##0.00'; PCT = '0.0%'; PCT2 = '0.00%'; NUM = '#,##0'; MULT = '0.0%'

wb = Workbook()

# =====================================================================================
# ABA 1 — LEIA-ME
# =====================================================================================
ws0 = wb.active; ws0.title = "Leia-me"
ws0.sheet_view.showGridLines = False
ws0.column_dimensions['A'].width = 3; ws0.column_dimensions['B'].width = 110
title(ws0, "B2", "Modelo de Breakeven Reverso — Retrofit de Shoppings", 16)
ws0["B3"] = "Estacionamentos · Banheiros · Praças de alimentação"; ws0["B3"].font = Font(italic=True, color=GREY, size=11)
linhas = [
 ("", ""),
 ("COMO USAR (3 passos)", "h"),
 ("1.  Vá até a aba 'Inputs' e preencha APENAS as células amarelas com os dados do seu ativo.", "n"),
 ("2.  Os resultados (TIR, NPV, Payback e Breakeven) aparecem na aba 'Resumo' e detalhados em 'Modelo (DCF)'.", "n"),
 ("3.  Use a aba 'Cenários Concorrência' para ver como a reforma de um concorrente muda a urgência.", "n"),
 ("", ""),
 ("A LÓGICA DO MODELO", "h"),
 ("Retrofit é capex DEFENSIVO: o retorno NÃO é venda nova, é o DECLÍNIO DE NOI EVITADO.", "n"),
 ("O modelo compara dois cenários ao longo do horizonte escolhido:", "n"),
 ("   • SEM retrofit  → o NOI cai à 'taxa de declínio efetiva' (declínio base + aceleração do concorrente).", "n"),
 ("   • COM retrofit  → a reforma evita uma fração θ (eficácia) desse declínio.", "n"),
 ("O retorno é a ÁREA ENTRE AS DUAS CURVAS + a proteção do valor de saída (cap rate menor).", "n"),
 ("", ""),
 ("BREAKEVEN REVERSO (o número-chave para o board)", "h"),
 ("Em vez de prometer crescimento, o modelo responde: 'quão pouco do declínio basta evitar para o projeto se pagar?'", "n"),
 ("θ* = fração mínima do declínio projetado que precisa ser evitada para o NPV ser ZERO.", "n"),
 ("Quanto MENOR o θ*, mais fácil de justificar o investimento.", "n"),
 ("", ""),
 ("FATOR DE ACELERAÇÃO CONCORRENCIAL", "h"),
 ("Quando um concorrente da mesma área se moderniza, o declínio deixa de ser gradual e vira transferência de share.", "n"),
 ("Isso entra como ACRÉSCIMO à taxa de declínio (campo 'Aceleração concorrencial' na aba Inputs).", "n"),
 ("A aba 'Cenários Concorrência' compara: sem concorrente / concorrente anunciou / concorrente entregou.", "n"),
 ("", ""),
 ("ABERTURA POR ATIVO + ÓTICA DE CRESCIMENTO", "h"),
 ("A aba 'Breakeven por Ativo' abre o capex entre praça, estacionamento e banheiros (com totalizador).", "n"),
 ("Mostra a OUTRA ótica: quanto de CRESCIMENTO cada ativo precisaria para se pagar —", "n"),
 ("   • Praça: uplift necessário em vendas/m² (≈ NOI/m²), comparado ao crescimento histórico.", "n"),
 ("   • Estacionamento: ganho necessário em fluxo OU em tarifa (R$/ticket).", "n"),
 ("   • Banheiros: sem receita própria — viabilizam-se pela proteção (defensivo).", "n"),
 ("", ""),
 ("LEGENDA", "h"),
 ("Células ÂMBAR = você preenche.   Células claras (areia) = calculadas automaticamente (não editar).", "n"),
 ("Todos os valores de exemplo são ILUSTRATIVOS — substitua pelos números reais do ativo.", "n"),
]
r = 5
for txt, kind in linhas:
    c = f"B{r}"
    if kind == "h": ws0[c] = txt; ws0[c].font = Font(bold=True, size=12, color=TEAL)
    elif kind == "n": ws0[c] = txt; ws0[c].font = Font(size=10, color=INK)
    r += 1

# =====================================================================================
# ABA 2 — INPUTS
# =====================================================================================
wi = wb.create_sheet("Inputs")
wi.sheet_view.showGridLines = False
wi.column_dimensions['A'].width = 3
wi.column_dimensions['B'].width = 52
wi.column_dimensions['C'].width = 16
wi.column_dimensions['D'].width = 60
title(wi, "B2", "INPUTS — preencha apenas as células âmbar", 14)
wi["B3"] = "Valores abaixo são exemplos ilustrativos. Substitua pelos dados do ativo."
wi["B3"].font = Font(italic=True, color=GREY, size=10)

hcell(wi, "B5", "Parâmetro"); hcell(wi, "C5", "Valor"); hcell(wi, "D5", "Observação / unidade")

# (linha, rótulo, valor, formato, obs)
inputs = [
 ("Horizonte de análise (anos)", 10, NUM, "Período de projeção (máx. 25). Ex.: 10"),
 ("Taxa de desconto / WACC (a.a.)", 0.12, PCT, "Custo de capital para o NPV"),
 ("TIR alvo / hurdle rate (a.a.)", 0.12, PCT, "Retorno mínimo aceitável"),
 ("NOI atual do ativo (anual)", 60000000, CUR, "NOI dos últimos 12 meses"),
 ("Cap rate de saída — COM retrofit", 0.085, PCT, "Ativo cuidado = cap rate menor (mais valor)"),
 ("Cap rate de saída — SEM retrofit", 0.090, PCT, "Ativo em declínio = cap rate maior (menos valor)"),
 ("Declínio base do NOI (a.a.)", 0.02, PCT, "Depreciação gradual, SEM concorrente novo"),
 ("Aceleração concorrencial (a.a.)", 0.02, PCT, "Acréscimo ao declínio se concorrente se moderniza"),
 ("Eficácia do retrofit θ (% do declínio evitado)", 0.80, PCT, "Quanto do declínio a reforma evita (0%–100%)"),
 ("Receita direta incremental anual", 0, CUR, "Ex.: ganho de estacionamento (conservador = 0)"),
 ("Opex incremental anual", 0, CUR, "Manutenção adicional gerada pela reforma"),
]
row = 6
inkeys = {}
for lbl, val, fmt, obs in inputs:
    label(wi, f"B{row}", lbl); wi[f"B{row}"].border = border
    inputcell(wi, f"C{row}", val, fmt)
    label(wi, f"D{row}", obs, color=GREY); wi[f"D{row}"].border = border
    inkeys[lbl] = f"Inputs!C{row}"
    row += 1

# referencias
N   = inkeys["Horizonte de análise (anos)"]
R   = inkeys["Taxa de desconto / WACC (a.a.)"]
HUR = inkeys["TIR alvo / hurdle rate (a.a.)"]
NOI = inkeys["NOI atual do ativo (anual)"]
CL  = inkeys["Cap rate de saída — COM retrofit"]
CH  = inkeys["Cap rate de saída — SEM retrofit"]
DB  = inkeys["Declínio base do NOI (a.a.)"]
DC  = inkeys["Aceleração concorrencial (a.a.)"]
TH  = inkeys["Eficácia do retrofit θ (% do declínio evitado)"]
REV = inkeys["Receita direta incremental anual"]
OPX = inkeys["Opex incremental anual"]

# taxa de declinio efetiva (derivada)
row += 1
label(wi, f"B{row}", "Taxa de declínio efetiva (base + aceleração)", bold=True, color=NAVY)
wi[f"B{row}"].border = border
outcell(wi, f"C{row}", f"={DB}+{DC}", PCT, fill=LIGHT)
label(wi, f"D{row}", "Calculado automaticamente — usado no cenário 'sem retrofit'", color=GREY); wi[f"D{row}"].border = border
DEFF = f"Inputs!C{row}"

# validação θ 0..1
dv = DataValidation(type="decimal", operator="between", formula1="0", formula2="1", allow_blank=False)
dv.error = "θ deve estar entre 0% e 100%."; dv.errorTitle = "Valor inválido"
wi.add_data_validation(dv); dv.add(wi[TH.split("!")[1]])

# ---- Seção 2: detalhamento por ativo (para o breakeven de crescimento) ----
def inrow(lbl, val, fmt, obs):
    global row
    label(wi, f"B{row}", lbl); wi[f"B{row}"].border = border
    inputcell(wi, f"C{row}", val, fmt)
    label(wi, f"D{row}", obs, color=GREY); wi[f"D{row}"].border = border
    cell = f"Inputs!C{row}"; row += 1
    return cell

row += 2
title(wi, f"B{row}", "Detalhamento por ativo (abertura do capex + ótica de crescimento)", 12); row += 1
hcell(wi, f"B{row}", "Parâmetro"); hcell(wi, f"C{row}", "Valor"); hcell(wi, f"D{row}", "Observação / unidade"); row += 1

CAP_FC = inrow("Capex — Praça de alimentação", 16000000, CUR, "Parcela do capex na praça")
CAP_BN = inrow("Capex — Banheiros", 8000000, CUR, "Parcela do capex nos banheiros")
CAP_PK = inrow("Capex — Estacionamento", 16000000, CUR, "Parcela do capex no estacionamento")
label(wi, f"B{row}", "Capex total (soma dos 3 ativos)", bold=True, color=NAVY); wi[f"B{row}"].border = border
outcell(wi, f"C{row}", f"={CAP_FC}+{CAP_BN}+{CAP_PK}", CUR, fill=LIGHT)
label(wi, f"D{row}", "Calculado — usado no modelo defensivo (totalizador)", color=GREY); wi[f"D{row}"].border = border
CAP = f"Inputs!C{row}"; row += 2

title(wi, f"B{row}", "Praça de alimentação — operacional", 11); row += 1
A_FC    = inrow("Área da praça (m²)", 3000, NUM, "ABL da praça de alimentação")
S_FC    = inrow("Vendas/m²/ano — atual", 18000, CUR, "Vendas dos lojistas da praça por m²")
NOIM_FC = inrow("NOI/m²/ano — atual", 3500, CUR, "NOI do locador atribuível à praça por m²")
G_FC    = inrow("Crescimento histórico de vendas/m² (a.a.)", 0.04, PCT, "CAGR recente — base de comparação")
row += 1

title(wi, f"B{row}", "Estacionamento — operacional", 11); row += 1
VOL_PK = inrow("Volume anual pagante (tickets/ano)", 1800000, NUM, "Veículos/tickets pagos por ano")
TAR_PK = inrow("Tarifa média (R$/ticket)", 15, CUR2, "Receita média por ticket")
MAR_PK = inrow("Margem de NOI do estacionamento", 0.60, PCT, "NOI como % da receita bruta")
G_PK   = inrow("Crescimento histórico de fluxo (a.a.)", 0.01, PCT, "CAGR recente do fluxo")

# =====================================================================================
# ABA 3 — MODELO (DCF) ano a ano
# =====================================================================================
wm = wb.create_sheet("Modelo (DCF)")
wm.sheet_view.showGridLines = False
wm.column_dimensions['A'].width = 3
wm.column_dimensions['B'].width = 38
for col in range(3, 3+26):
    wm.column_dimensions[get_column_letter(col)].width = 12
title(wm, "B2", "Modelo de Fluxo de Caixa Incremental (Com vs Sem retrofit)", 14)
wm["B3"] = "Linhas calculadas automaticamente a partir da aba Inputs. Não editar."
wm["B3"].font = Font(italic=True, color=GREY, size=10)

MAXY = 25
hcell(wm, "B5", "Ano →")
for t in range(0, MAXY+1):
    c = f"{get_column_letter(3+t)}5"; hcell(wm, c, t)

def rowlabel(rw, text, bold=False, color=INK):
    label(wm, f"B{rw}", text, bold=bold, color=color); wm[f"B{rw}"].border = border

# helper: coluna do ano t
def col(t): return get_column_letter(3+t)

# Linha 6: ativo? indicador t<=N
rowlabel(6, "Dentro do horizonte? (1/0)")
for t in range(0, MAXY+1):
    outcell(wm, f"{col(t)}6", f"=IF({t}<={N},1,0)", '0', bold=False, color=GREY)

# Linha 7: NOI SEM retrofit  A(t)=NOI*(1-deff)^t
rowlabel(7, "NOI — SEM retrofit", color=RED)
for t in range(0, MAXY+1):
    outcell(wm, f"{col(t)}7", f"={NOI}*(1-{DEFF})^{t}", CUR, bold=False, color=RED)

# Linha 8: NOI COM retrofit = NOI - (1-θ)*L(t) ; L=NOI-A
rowlabel(8, "NOI — COM retrofit", color=GREEN)
for t in range(0, MAXY+1):
    A = f"{col(t)}7"
    outcell(wm, f"{col(t)}8", f"={NOI}-(1-{TH})*({NOI}-{A})", CUR, bold=False, color=GREEN)

# Linha 9: Perda projetada L(t)=NOI-A(t)
rowlabel(9, "Perda projetada vs hoje  L(t)")
for t in range(0, MAXY+1):
    outcell(wm, f"{col(t)}9", f"={NOI}-{col(t)}7", CUR, bold=False, color=GREY)

# Linha 10: NOI incremental anual = θ*L(t)+rev-opex (t>=1, dentro horizonte)
rowlabel(10, "NOI incremental anual")
for t in range(0, MAXY+1):
    if t == 0:
        outcell(wm, f"{col(t)}10", 0, CUR, bold=False)
    else:
        outcell(wm, f"{col(t)}10", f"=IF({col(t)}6=1,{TH}*{col(t)}9+{REV}-{OPX},0)", CUR, bold=False)

# Helper cells para terminal (ano N) — usar formulas fechadas
# A(N)=NOI*(1-deff)^N ; L(N)=NOI-A(N)
wm["B12"].value = "— Componentes do valor terminal (ano N) —"; wm["B12"].font = Font(bold=True, italic=True, color=TEAL, size=10)
rowlabel(13, "A(N) = NOI sem retrofit no ano N")
outcell(wm, "C13", f"={NOI}*(1-{DEFF})^{N}", CUR)
AN = "'Modelo (DCF)'!C13"
rowlabel(14, "L(N) = perda no ano N")
outcell(wm, "C14", f"={NOI}-{AN}", CUR)
LN = "'Modelo (DCF)'!C14"
rowlabel(15, "Valor de saída SEM retrofit = A(N)/caprate_sem")
outcell(wm, "C15", f"={AN}/{CH}", CUR)
EXA = "'Modelo (DCF)'!C15"
rowlabel(16, "Valor de saída COM retrofit = (A(N)+θ·L(N)+rev)/caprate_com")
outcell(wm, "C16", f"=({AN}+{TH}*{LN}+{REV})/{CL}", CUR)
EXB = "'Modelo (DCF)'!C16"
rowlabel(17, "Δ Valor terminal (proteção do valuation)", bold=True, color=NAVY)
outcell(wm, "C17", f"={EXB}-{EXA}", CUR, fill=LIGHT)
DTV = "'Modelo (DCF)'!C17"

# Linha 19: valor terminal incremental (so no ano N)
rowlabel(19, "Valor terminal incremental (ano N)")
for t in range(0, MAXY+1):
    outcell(wm, f"{col(t)}19", f"=IF({t}={N},{DTV},0)", CUR, bold=False, color=GREY)

# Linha 20: Fluxo de caixa incremental total
rowlabel(20, "Fluxo de caixa incremental", bold=True, color=NAVY)
for t in range(0, MAXY+1):
    if t == 0:
        outcell(wm, f"{col(t)}20", f"=-{CAP}", CUR, fill=LIGHT)
    else:
        outcell(wm, f"{col(t)}20", f"={col(t)}10+{col(t)}19", CUR, fill=LIGHT)

# Linha 21: FC acumulado (para payback)
rowlabel(21, "FC incremental acumulado")
outcell(wm, "C21", "=C20", CUR, bold=False, color=GREY)
for t in range(1, MAXY+1):
    outcell(wm, f"{col(t)}21", f"={get_column_letter(3+t-1)}21+{col(t)}20", CUR, bold=False, color=GREY)

# Resultados (à esquerda, bloco)
last = col(MAXY)
cf_full = f"'Modelo (DCF)'!C20:{last}20"
cf_1toN = f"'Modelo (DCF)'!D20:{last}20"
title(wm, "B24", "RESULTADOS", 13)
rowlabel(25, "NPV (Valor Presente Líquido)", bold=True)
outcell(wm, "C25", f"=C20+NPV({R},{cf_1toN})", CUR, fill=LIGHT)
NPVcell = "'Modelo (DCF)'!C25"
rowlabel(26, "TIR (Taxa Interna de Retorno)", bold=True)
outcell(wm, "C26", f"=IFERROR(IRR({cf_full}),\"n/d\")", PCT, fill=LIGHT)
rowlabel(27, "TIR alvo (hurdle)")
outcell(wm, "C27", f"={HUR}", PCT, bold=False, color=GREY)
rowlabel(28, "Payback simples (anos)")
# primeiro ano em que acumulado >=0 (após ano 0)
outcell(wm, "C28", f"=IFERROR(MATCH(TRUE,INDEX('Modelo (DCF)'!C21:{last}21>=0,0),0)-1,\">horizonte\")", '0', fill=LIGHT)
rowlabel(29, "Índice de lucratividade (PV/Capex)")
outcell(wm, "C29", f"=({NPVcell}+{CAP})/{CAP}", '0.00x', fill=LIGHT)

# =====================================================================================
# ABA 4 — BREAKEVEN (forma fechada, NPV linear em θ)
# =====================================================================================
wb2 = wb.create_sheet("Breakeven Reverso")
wb2.sheet_view.showGridLines = False
wb2.column_dimensions['A'].width = 3
wb2.column_dimensions['B'].width = 56
wb2.column_dimensions['C'].width = 18
wb2.column_dimensions['D'].width = 60
title(wb2, "B2", "Breakeven Reverso — quão pouco do declínio basta evitar?", 14)
wb2["B3"] = "NPV é linear em θ (eficácia). Resolve-se θ* (para NPV=0) em forma fechada."
wb2["B3"].font = Font(italic=True, color=GREY, size=10)

hcell(wb2, "B5", "Componente"); hcell(wb2, "C5", "Valor"); hcell(wb2, "D5", "O que é")
# Fator de anuidade A_r = (1-(1+r)^-N)/r
br = [
 ("Fator de anuidade  a(r,N)", f"=(1-(1+{R})^-{N})/{R}", '0.000', "Σ 1/(1+r)^t, t=1..N"),
 ("DF(N) = 1/(1+r)^N", f"=1/(1+{R})^{N}", '0.000', "fator de desconto no ano N"),
 ("B = sensibilidade do NPV a θ", f"={NOI}*(C6-((1-{DEFF})/(1+{R}))*(1-((1-{DEFF})/(1+{R}))^{N})/(1-((1-{DEFF})/(1+{R}))))+('Modelo (DCF)'!C14/{CL})*C7", CUR, "PV das perdas (até N) + termo terminal"),
 ("A = NPV quando θ=0", f"=-{CAP}+({REV}-{OPX})*C6+(('Modelo (DCF)'!C13+{REV})/{CL}-'Modelo (DCF)'!C13/{CH})*C7", CUR, "NPV sem evitar nada do declínio"),
]
row = 6
for lbl, f, fmt, obs in br:
    label(wb2, f"B{row}", lbl); wb2[f"B{row}"].border = border
    outcell(wb2, f"C{row}", f, fmt, fill=LIGHT)
    label(wb2, f"D{row}", obs, color=GREY); wb2[f"D{row}"].border = border
    row += 1
Acell = "'Breakeven Reverso'!C9"; Bcell = "'Breakeven Reverso'!C8"

row += 1
title(wb2, f"B{row}", "RESULTADO PRINCIPAL", 12); row += 1
label(wb2, f"B{row}", "θ*  —  % MÍNIMO do declínio a evitar p/ NPV = 0", bold=True, color=NAVY)
wb2[f"B{row}"].border = border
outcell(wb2, f"C{row}", f"=-{Acell}/{Bcell}", PCT, fill=POS_FILL, color=GREEN)
thetastar = f"'Breakeven Reverso'!C{row}"
label(wb2, f"D{row}", "Quanto menor, mais fácil justificar o investimento", color=GREY); wb2[f"D{row}"].border = border
row += 1
label(wb2, f"B{row}", "Eficácia θ assumida (input)"); wb2[f"B{row}"].border = border
outcell(wb2, f"C{row}", f"={TH}", PCT, bold=False)
wb2[f"D{row}"] = "vinda da aba Inputs"; wb2[f"D{row}"].font = Font(color=GREY, size=10); wb2[f"D{row}"].border = border
row += 1
label(wb2, f"B{row}", "Margem de segurança (θ assumida − θ*)", bold=True); wb2[f"B{row}"].border = border
outcell(wb2, f"C{row}", f"={TH}-{thetastar}", PCT, fill=LIGHT)
label(wb2, f"D{row}", "Positivo = projeto cria valor no cenário assumido", color=GREY); wb2[f"D{row}"].border = border
row += 1
label(wb2, f"B{row}", "Veredito", bold=True, color=NAVY); wb2[f"B{row}"].border = border
outcell(wb2, f"C{row}", f"=IF({TH}>={thetastar},\"APROVAR\",\"REAVALIAR\")", None, fill=POS_FILL, color=GREEN)

# Tabela de sensibilidade NPV vs θ (usando A + Bθ)
row += 3
title(wb2, f"B{row}", "Sensibilidade: NPV por nível de eficácia θ", 12); row += 1
hcell(wb2, f"B{row}", "θ (declínio evitado)"); hcell(wb2, f"C{row}", "NPV"); hcell(wb2, f"D{row}", "Cria valor?")
row += 1
for i in range(0, 11):
    th = i/10.0
    label(wb2, f"B{row}", None); wb2[f"B{row}"] = th; wb2[f"B{row}"].number_format = PCT
    wb2[f"B{row}"].alignment = Alignment(horizontal="center"); wb2[f"B{row}"].border = border
    outcell(wb2, f"C{row}", f"={Acell}+{Bcell}*B{row}", CUR, bold=False)
    outcell(wb2, f"D{row}", f"=IF(C{row}>=0,\"sim\",\"não\")", None, bold=False, color=GREY)
    row += 1

# =====================================================================================
# ABA 5 — CENÁRIOS DE CONCORRÊNCIA
# =====================================================================================
wc = wb.create_sheet("Cenários Concorrência")
wc.sheet_view.showGridLines = False
wc.column_dimensions['A'].width = 3
wc.column_dimensions['B'].width = 46
for c in ['C','D','E']:
    wc.column_dimensions[c].width = 22
title(wc, "B2", "Fator de Aceleração Concorrencial", 14)
wc["B3"] = "Mesmo capex e ativo; muda só a taxa de declínio conforme o concorrente se moderniza."
wc["B3"].font = Font(italic=True, color=GREY, size=10)

hcell(wc, "B5", "Parâmetro / Resultado")
hcell(wc, "C5", "Sem concorrente"); hcell(wc, "D5", "Concorrente anunciou"); hcell(wc, "E5", "Concorrente entregou")

# linha 6: taxa de declinio (editavel por cenario)
label(wc, "B6", "Taxa de declínio efetiva (a.a.)", bold=True); wc["B6"].border = border
inputcell(wc, "C6", f"={DB}", PCT)            # so base
inputcell(wc, "D6", f"={DB}+{DC}/2", PCT)     # base + metade da aceleracao (anuncio)
inputcell(wc, "E6", f"={DB}+{DC}", PCT)       # base + aceleracao cheia (entrega)
label(wc, "B7", "(editável — ajuste a hipótese de cada cenário)", color=GREY);

# Para cada cenario, calcular em forma fechada A, B, theta*, NPV (no theta input)
# usar formulas com d = celula do cenario
def scen_formulas(dcell):
    # a(r,N) e DF(N)
    ar = f"(1-(1+{R})^-{N})/{R}"
    dfn = f"1/(1+{R})^{N}"
    # q = (1-d)/(1+r) ; S_q = q*(1-q^N)/(1-q)
    q = f"((1-{dcell})/(1+{R}))"
    sq = f"({q}*(1-{q}^{N})/(1-{q}))"
    pv_l = f"({NOI}*({ar}-{sq}))"        # PV das perdas
    an = f"({NOI}*(1-{dcell})^{N})"       # A(N)
    ln = f"({NOI}-{an})"                  # L(N)
    B = f"({pv_l}+({ln}/{CL})*({dfn}))"
    dtv0 = f"(({an}+{REV})/{CL}-{an}/{CH})"
    A = f"(-{CAP}+({REV}-{OPX})*({ar})+{dtv0}*({dfn}))"
    return A, B

rows = [
 ("NOI no ano N — sem retrofit", lambda d: f"={NOI}*(1-{d})^{N}", CUR),
 ("Perda acumulada no ano N", lambda d: f"={NOI}-{NOI}*(1-{d})^{N}", CUR),
]
rr = 9
for lbl, fn, fmt in rows:
    label(wc, f"B{rr}", lbl); wc[f"B{rr}"].border = border
    for cc in ["C", "D", "E"]:
        dref = f"'Cenários Concorrência'!{cc}6"
        outcell(wc, f"{cc}{rr}", fn(dref), fmt, bold=False)
    rr += 1

# A, B helpers (linhas ocultas-ish)
label(wc, f"B{rr}", "A (NPV com θ=0)", color=GREY); wc[f"B{rr}"].border = border
for cc in ["C","D","E"]:
    A,_ = scen_formulas(f"'Cenários Concorrência'!{cc}6")
    outcell(wc, f"{cc}{rr}", "="+A, CUR, bold=False, color=GREY)
Arow = rr; rr += 1
label(wc, f"B{rr}", "B (sensibilidade a θ)", color=GREY); wc[f"B{rr}"].border = border
for cc in ["C","D","E"]:
    _,B = scen_formulas(f"'Cenários Concorrência'!{cc}6")
    outcell(wc, f"{cc}{rr}", "="+B, CUR, bold=False, color=GREY)
Brow = rr; rr += 2

label(wc, f"B{rr}", "θ*  — % mínimo do declínio a evitar (NPV=0)", bold=True, color=NAVY); wc[f"B{rr}"].border = border
for cc in ["C","D","E"]:
    outcell(wc, f"{cc}{rr}", f"=-{cc}{Arow}/{cc}{Brow}", PCT, fill=POS_FILL, color=GREEN)
rr += 1
label(wc, f"B{rr}", "NPV na eficácia θ assumida (input)", bold=True); wc[f"B{rr}"].border = border
for cc in ["C","D","E"]:
    outcell(wc, f"{cc}{rr}", f"={cc}{Arow}+{cc}{Brow}*{TH}", CUR, fill=LIGHT)
rr += 1
label(wc, f"B{rr}", "Valor protegido vs. 'sem concorrente'", bold=True, color=NAVY); wc[f"B{rr}"].border = border
outcell(wc, f"C{rr}", "—", None, bold=False, color=GREY)
outcell(wc, f"D{rr}", f"=D{rr-1}-C{rr-1}", CUR, fill=LIGHT)
outcell(wc, f"E{rr}", f"=E{rr-1}-C{rr-1}", CUR, fill=LIGHT)
rr += 2
label(wc, f"B{rr}", "Leitura", bold=True, color=TEAL)
rr += 1
for txt in [
  "→ Quanto mais o concorrente avança, MAIOR o declínio evitado e MAIOR o NPV do retrofit.",
  "→ O retrofit vale mais, não menos, quando o concorrente se moderniza: a urgência é financeira.",
  "→ θ* tende a cair: basta evitar uma fração menor do declínio (agora maior) para se pagar.",
]:
    wc[f"B{rr}"] = txt; wc[f"B{rr}"].font = Font(size=10, color=INK); rr += 1

# =====================================================================================
# ABA 6 — BREAKEVEN POR ATIVO (ótica de crescimento)
# =====================================================================================
wa = wb.create_sheet("Breakeven por Ativo")
wa.sheet_view.showGridLines = False
wa.column_dimensions['A'].width = 3
wa.column_dimensions['B'].width = 44
for c in ['C', 'D', 'E', 'F']:
    wa.column_dimensions[c].width = 18
title(wa, "B2", "Breakeven de Crescimento por Ativo — a outra ótica", 14)
wa["B3"] = "Quanto de CRESCIMENTO cada ativo precisaria sustentar para se pagar (complementa a ótica defensiva/proteção)."
wa["B3"].font = Font(italic=True, color=GREY, size=10)

AR  = "'Breakeven Reverso'!C6"   # a(r,N)
DFN = "'Breakeven Reverso'!C7"   # DF(N)
DENOM = f"({AR}+{DFN}/{CL})"     # anuidade + valor terminal do uplift permanente

NOI_FC   = f"({NOIM_FC}*{A_FC})"
SALES_FC = f"({S_FC}*{A_FC})"
NOI_PK   = f"({MAR_PK}*{VOL_PK}*{TAR_PK})"
GROSS_PK = f"({VOL_PK}*{TAR_PK})"

# cabeçalho da tabela comparativa
hcell(wa, "B5", "Métrica"); hcell(wa, "C5", "Praça aliment."); hcell(wa, "D5", "Estacionamento")
hcell(wa, "E5", "Banheiros"); hcell(wa, "F5", "Total")

def arow(rw, lbl, cC, cD, cE, cF, fmt=CUR, bold=False, fillpos=False):
    label(wa, f"B{rw}", lbl, bold=bold); wa[f"B{rw}"].border = border
    for col, val in [("C", cC), ("D", cD), ("E", cE), ("F", cF)]:
        if val is None:
            outcell(wa, f"{col}{rw}", "—", None, bold=False, color=GREY)
        else:
            fl = POS_FILL if fillpos else None
            outcell(wa, f"{col}{rw}", val, fmt, bold=bold, fill=fl,
                    color=(GREEN if fillpos else NAVY))

arow(6,  "Capex alocado (R$)",            CAP_FC, CAP_PK, CAP_BN, "=C6+D6+E6")
arow(7,  "% do capex total",              "=C6/$F$6", "=D6/$F$6", "=E6/$F$6", "=F6/$F$6", fmt=PCT)
arow(8,  "NOI atual atribuível (R$/ano)", f"={NOI_FC}", f"={NOI_PK}", None, f"={NOI}")
arow(9,  "Vendas/Receita bruta (R$/ano)", f"={SALES_FC}", f"={GROSS_PK}", None, None)
arow(10, "NOI incremental/ano p/ breakeven", f"={CAP_FC}/{DENOM}", f"={CAP_PK}/{DENOM}", None, "=C10+D10", bold=True, fillpos=True)
arow(11, "Breakeven de crescimento (%)",  "=C10/C8", "=D10/D8", None, None, fmt=PCT, bold=True, fillpos=True)
arow(12, "≈ anos de crescimento histórico", f"=C11/{G_FC}", f"=D11/{G_PK}", None, None, fmt='0.0')
# linha textual de ótica
label(wa, "B13", "Ótica de viabilização", bold=True); wa["B13"].border = border
for col, val in [("C","Proteção + crescimento"), ("D","Proteção + crescimento"), ("E","Proteção (defensivo)"), ("F","—")]:
    outcell(wa, f"{col}13", val, None, bold=False, color=(GREY if val=="—" else TEAL))
wa["B11"].comment = None

label(wa, "B14", "Em % de:  praça → vendas/m²(≈NOI/m²);  estacionamento → fluxo OU tarifa.", color=GREY)
wa["B14"].font = Font(italic=True, size=9, color=GREY)

# ---- Tradução PRAÇA ----
title(wa, "B16", "Praça de alimentação — tradução do breakeven", 11)
def trow(rw, lbl, formula, fmt, bold=False, pos=False):
    label(wa, f"B{rw}", lbl, bold=bold); wa[f"B{rw}"].border = border
    outcell(wa, f"C{rw}", formula, fmt, bold=bold, fill=(POS_FILL if pos else None),
            color=(GREEN if pos else NAVY))
trow(17, "Vendas/m²/ano — atual", f"={S_FC}", CUR)
trow(18, "NOI/m²/ano — atual", f"={NOIM_FC}", CUR)
trow(19, "Uplift necessário de vendas/m²/ano (R$)", "=C11*C17", CUR)
trow(20, "Vendas/m²/ano alvo (após uplift)", "=C17*(1+C11)", CUR, bold=True, pos=True)

# ---- Tradução ESTACIONAMENTO ----
title(wa, "E16", "Estacionamento — tradução do breakeven", 11)
def trowE(rw, lbl, formula, fmt, bold=False, pos=False):
    label(wa, f"E{rw}", lbl, bold=bold); wa[f"E{rw}"].border = border
    wa[f"E{rw}"].alignment = Alignment(wrap_text=True, vertical="center")
    outcell(wa, f"G{rw}", formula, fmt, bold=bold, fill=(POS_FILL if pos else None),
            color=(GREEN if pos else NAVY))
wa.column_dimensions['G'].width = 14
trowE(17, "Tarifa média atual (R$/ticket)", f"={TAR_PK}", CUR2)
trowE(18, "+R$/ticket necessário (volume constante)", f"=D10/({MAR_PK}*{VOL_PK})", CUR2, bold=True, pos=True)
trowE(19, "Tarifa-alvo (R$/ticket)", f"={TAR_PK}+G18", CUR2)
trowE(20, "OU +veículos/ano (tarifa constante)", f"=D10/({MAR_PK}*{TAR_PK})", NUM, bold=True, pos=True)
trowE(21, "  → em % do fluxo atual", f"=G20/{VOL_PK}", PCT)

# ---- Totalizador (defensivo, racional atual) ----
title(wa, "B22", "Totalizador — racional atual (defensivo / proteção)", 11)
label(wa, "B23", "Capex total (3 ativos)"); wa["B23"].border = border
outcell(wa, "C23", "=F6", CUR, fill=LIGHT)
label(wa, "B24", "NPV defensivo (declínio evitado + valuation)", bold=True); wa["B24"].border = border
outcell(wa, "C24", "='Modelo (DCF)'!C25", CUR, fill=POS_FILL, color=GREEN)
label(wa, "B25", "θ* — declínio a evitar p/ NPV=0"); wa["B25"].border = border
outcell(wa, "C25", "='Breakeven Reverso'!C12", PCT, fill=LIGHT, color=GREEN)
label(wa, "B26", "Δ valor terminal (proteção de cap rate)"); wa["B26"].border = border
outcell(wa, "C26", "='Modelo (DCF)'!C17", CUR, fill=LIGHT, color=GREEN)

# leitura
label(wa, "B28", "Leitura", bold=True, color=TEAL)
for i, t in enumerate([
  "→ Banheiros não têm receita própria: viabilizam-se pela PROTEÇÃO (footfall/dwell), não por crescimento.",
  "→ Estacionamento se paga com ganho modesto de tarifa OU fluxo — alavanca de pricing sob controle da gestão.",
  "→ Praça exige uplift maior de vendas/m²; parte vem de crescimento, o restante da proteção do NOI.",
]):
    wa[f"B{29+i}"] = t; wa[f"B{29+i}"].font = Font(size=10, color=INK)

# =====================================================================================
# ABA 7 — RESUMO (dashboard)
# =====================================================================================
wr = wb.create_sheet("Resumo")
wr.sheet_view.showGridLines = False
wr.column_dimensions['A'].width = 3
wr.column_dimensions['B'].width = 46
wr.column_dimensions['C'].width = 22
wr.column_dimensions['D'].width = 4
wr.column_dimensions['E'].width = 46
wr.column_dimensions['F'].width = 22
title(wr, "B2", "RESUMO EXECUTIVO — Retrofit do Ativo", 16)
wr["B3"] = "Indicadores-chave para o board. Preencha a aba Inputs; tudo recalcula aqui."
wr["B3"].font = Font(italic=True, color=GREY, size=10)

def kpi(cell_lbl, cell_val, txt, formula, fmt, color=NAVY):
    wr[cell_lbl] = txt; wr[cell_lbl].font = Font(bold=True, size=11, color=WHITE)
    wr[cell_lbl].fill = PatternFill("solid", fgColor=NAVY); wr[cell_lbl].border = border
    wr[cell_lbl].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    wr[cell_val] = formula; wr[cell_val].font = Font(bold=True, size=14, color=color)
    wr[cell_val].fill = PatternFill("solid", fgColor=LIGHT); wr[cell_val].border = border
    wr[cell_val].alignment = Alignment(horizontal="center", vertical="center")
    wr[cell_val].number_format = fmt
    wr.row_dimensions[int(cell_lbl[1:])].height = 28

kpi("B6","C6","NPV (Valor Presente Líquido)", "='Modelo (DCF)'!C25", CUR)
kpi("B8","C8","TIR (Taxa Interna de Retorno)", "='Modelo (DCF)'!C26", PCT, color=GREEN)
kpi("B10","C10","TIR alvo (hurdle)", f"={HUR}", PCT, color=GREY)
kpi("B12","C12","Payback simples (anos)", "='Modelo (DCF)'!C28", '0')
kpi("B14","C14","Índice de lucratividade", "='Modelo (DCF)'!C29", '0.00x')

kpi("E6","F6","θ* — declínio a evitar p/ NPV=0", "='Breakeven Reverso'!C12", PCT, color=GREEN)
kpi("E8","F8","Eficácia θ assumida (input)", f"={TH}", PCT)
kpi("E10","F10","Margem de segurança (θ − θ*)", "='Breakeven Reverso'!C14", PCT, color=GREEN)
kpi("E12","F12","Δ Valor terminal (proteção valuation)", "='Modelo (DCF)'!C17", CUR, color=GREEN)
kpi("E14","F14","Taxa de declínio efetiva usada", f"={DEFF}", PCT, color=RED)

# veredito grande
wr["B17"] = "VEREDITO"; wr["B17"].font = Font(bold=True, size=12, color=NAVY)
wr.merge_cells("B18:F19")
wr["B18"] = ('=IF(\'Modelo (DCF)\'!C25>=0,'
             '"APROVAR — o retrofit cria valor: basta evitar "&TEXT(\'Breakeven Reverso\'!C12,"0.0%")&" do declínio para se pagar.",'
             '"REAVALIAR — premissas atuais não cobrem o custo de capital.")')
wr["B18"].font = Font(bold=True, size=13, color=GREEN)
wr["B18"].alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
wr["B18"].fill = PatternFill("solid", fgColor=POS_FILL)
for rrow in range(18,20):
    for ccol in "BCDEF":
        wr[f"{ccol}{rrow}"].border = border

# ---- Abertura por ativo: duas óticas ----
wr["B21"] = "ABERTURA POR ATIVO — PROTEÇÃO (totalizador) × BREAKEVEN DE CRESCIMENTO"
wr["B21"].font = Font(bold=True, size=12, color=NAVY)
heads = ["Ativo", "Capex", "Breakeven de crescimento", "Ótica"]
for i, htxt in enumerate(heads):
    cell = f"{chr(66+i)}22"  # B,C,D,E
    wr[cell] = htxt; wr[cell].font = Font(bold=True, color=WHITE, size=10)
    wr[cell].fill = PatternFill("solid", fgColor=HEADBG); wr[cell].border = border
    wr[cell].alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
rows_ativo = [
 ("Praça de alimentação", "='Breakeven por Ativo'!C6", "='Breakeven por Ativo'!C11", "Proteção + crescimento"),
 ("Estacionamento",       "='Breakeven por Ativo'!D6", "='Breakeven por Ativo'!D11", "Proteção + crescimento"),
 ("Banheiros",            "='Breakeven por Ativo'!E6", None,                          "Proteção (defensivo)"),
 ("TOTAL (totalizador)",  "='Breakeven por Ativo'!F6", None,                          "NPV defensivo na ótica 1"),
]
rr = 23
for nome, capf, bef, otica in rows_ativo:
    tot = nome.startswith("TOTAL")
    wr[f"B{rr}"] = nome; wr[f"B{rr}"].font = Font(bold=tot, size=10, color=(NAVY if tot else INK))
    wr[f"B{rr}"].border = border
    wr[f"C{rr}"] = capf; wr[f"C{rr}"].number_format = CUR; wr[f"C{rr}"].border = border
    wr[f"C{rr}"].font = Font(bold=tot, size=10, color=INK); wr[f"C{rr}"].alignment = Alignment(horizontal="center")
    if bef:
        wr[f"D{rr}"] = bef; wr[f"D{rr}"].number_format = PCT
        wr[f"D{rr}"].font = Font(bold=True, size=10, color=GREEN)
    else:
        wr[f"D{rr}"] = "—"; wr[f"D{rr}"].font = Font(size=10, color=GREY)
    wr[f"D{rr}"].border = border; wr[f"D{rr}"].alignment = Alignment(horizontal="center")
    wr[f"E{rr}"] = otica; wr[f"E{rr}"].font = Font(size=10, color=(TEAL if not tot else NAVY))
    wr[f"E{rr}"].border = border
    rr += 1

wr[f"B{rr+1}"] = ("Ótica 1 (proteção): NPV defensivo ='Modelo (DCF)'!C25 · θ*='Breakeven Reverso'!C12.   "
                  "Ótica 2 (crescimento): % de uplift em vendas/m² (praça) e em fluxo/tarifa (estac.).")
wr[f"B{rr+1}"].font = Font(italic=True, size=9, color=GREY)
wr[f"B{rr+2}"] = "Nota: valores derivam da aba Inputs (exemplos ilustrativos). Substitua pelos dados reais do ativo."
wr[f"B{rr+2}"].font = Font(italic=True, size=9, color=GREY)

# ordenar abas
order = ["Leia-me","Resumo","Inputs","Modelo (DCF)","Breakeven Reverso","Breakeven por Ativo","Cenários Concorrência"]
wb._sheets.sort(key=lambda s: order.index(s.title))
wb.active = 1

import os
out = os.path.join(os.path.dirname(__file__), "Modelo-Breakeven-Reverso.xlsx")
wb.save(out)
print("salvo:", out)
