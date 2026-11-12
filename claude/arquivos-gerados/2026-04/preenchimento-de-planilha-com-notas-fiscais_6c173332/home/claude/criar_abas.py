from openpyxl import load_workbook
from openpyxl.styles import (Font, PatternFill, Alignment, Border, Side,
                              GradientFill)
from openpyxl.utils import get_column_letter
from datetime import datetime

wb = load_workbook('/mnt/user-data/outputs/Controle_Gastos_Obra_Pro_IR.xlsx')

# ─── PALETA ──────────────────────────────────────────────────────────────────
AZUL_ESCURO  = "1F3864"   # cabeçalho primário
AZUL_MEDIO   = "2E75B6"   # cabeçalho secundário
AZUL_CLARO   = "D6E4F0"   # linha par
VERDE_ESCURO  = "1D6038"
VERDE_CLARO   = "E2EFDA"
AMARELO_ALERTA= "FFF2CC"
LARANJA_ALERTA= "FCE4D6"
CINZA_LINHA   = "F2F2F2"
BRANCO        = "FFFFFF"
TEXTO_BRANCO  = "FFFFFF"
TEXTO_ESCURO  = "1F1F1F"

def estilo_cabecalho_primario(cell, texto=None):
    if texto: cell.value = texto
    cell.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=11)
    cell.fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cell.border    = borda_fina()

def estilo_cabecalho_secundario(cell, texto=None):
    if texto: cell.value = texto
    cell.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=10)
    cell.fill      = PatternFill("solid", fgColor=AZUL_MEDIO)
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cell.border    = borda_fina()

def estilo_label(cell, texto=None, bold=False):
    if texto is not None: cell.value = texto
    cell.font      = Font(name="Arial", bold=bold, color=TEXTO_ESCURO, size=10)
    cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    cell.border    = borda_fina()

def estilo_valor(cell, fmt=None, bold=False, fill_color=None, color=None):
    cell.font      = Font(name="Arial", bold=bold, color=color or TEXTO_ESCURO, size=10)
    cell.alignment = Alignment(horizontal="right", vertical="center")
    cell.border    = borda_fina()
    if fill_color:
        cell.fill  = PatternFill("solid", fgColor=fill_color)
    if fmt:
        cell.number_format = fmt

def estilo_titulo_secao(cell, texto):
    cell.value     = texto
    cell.font      = Font(name="Arial", bold=True, color=AZUL_ESCURO, size=12)
    cell.alignment = Alignment(horizontal="left", vertical="center")

def borda_fina():
    s = Side(border_style="thin", color="BFBFBF")
    return Border(left=s, right=s, top=s, bottom=s)

def borda_media():
    s = Side(border_style="medium", color="1F3864")
    return Border(left=s, right=s, top=s, bottom=s)

FMT_REAL   = 'R$ #,##0.00'
FMT_REAL0  = 'R$ #,##0'
FMT_PCT    = '0.00%'
FMT_DATA   = 'dd/mm/yyyy'
FMT_INTEIRO= '#,##0'

# ═══════════════════════════════════════════════════════════════════════════════
# ABA 1: Financiamento_IR
# ═══════════════════════════════════════════════════════════════════════════════

# Remove se já existir
if "Financiamento_IR" in wb.sheetnames:
    del wb["Financiamento_IR"]

wf = wb.create_sheet("Financiamento_IR", len(wb.sheetnames) - 1)

# ── DADOS DO CONTRATO (bloco superior) ────────────────────────────────────────
dados_contrato = [
    ("Número do contrato",          "10199098907"),
    ("Banco",                       "Itaú Unibanco"),
    ("Agência / Conta",             "9638 / 360-9"),
    ("Data de início",              datetime(2025, 9, 29)),
    ("Valor da operação",           1700000.00),
    ("Sistema de amortização",      "SAC"),
    ("Modalidade",                  "Taxa fixa - Carteira Hipotecária"),
    ("Taxa de juros mensal",        0.009631393/100),   # convertido para decimal real
    ("Taxa de juros anual",         11.55767160/100),
    ("Taxa efetiva anual (CET)",    12.19/100),
    ("Prazo total (parcelas)",      383),
    ("Prazo remanescente",          376),
    ("Vencimento última parcela",   datetime(2057, 8, 29)),
    ("Saldo devedor em 29/04/2026", 1688975.63),
]

wf.merge_cells("A1:J1")
c = wf["A1"]
c.value     = "FINANCIAMENTO IMOBILIÁRIO — DEMONSTRATIVO PARA IMPOSTO DE RENDA"
c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=13)
c.fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
c.alignment = Alignment(horizontal="center", vertical="center")
wf.row_dimensions[1].height = 30

wf.merge_cells("A2:J2")
c2 = wf["A2"]
c2.value     = "Contrato 10199098907 | Itaú Unibanco | Daniel Vieira de Freitas | Imóvel: Palm Hill Casa 4"
c2.font      = Font(name="Arial", italic=True, color=AZUL_ESCURO, size=10)
c2.fill      = PatternFill("solid", fgColor=AZUL_CLARO)
c2.alignment = Alignment(horizontal="center", vertical="center")
wf.row_dimensions[2].height = 18

# Cabeçalho bloco contrato
wf.row_dimensions[3].height = 18
estilo_titulo_secao(wf["A3"], "DADOS DO CONTRATO")

wf.row_dimensions[4].height = 16
for col, txt in [("A","Campo"), ("C","Valor")]:
    estilo_cabecalho_secundario(wf[f"{col}4"], txt)
wf.merge_cells("A4:B4")
wf.merge_cells("C4:E4")

for i, (campo, valor) in enumerate(dados_contrato, start=5):
    row = i
    wf.row_dimensions[row].height = 16
    wf.merge_cells(f"A{row}:B{row}")
    c_label = wf[f"A{row}"]
    estilo_label(c_label, campo)
    fill = CINZA_LINHA if i % 2 == 0 else BRANCO
    c_label.fill = PatternFill("solid", fgColor=fill)

    wf.merge_cells(f"C{row}:E{row}")
    c_val = wf[f"C{row}"]
    c_val.border = borda_fina()
    c_val.alignment = Alignment(horizontal="right", vertical="center")
    c_val.fill = PatternFill("solid", fgColor=fill)
    c_val.font = Font(name="Arial", size=10, color=TEXTO_ESCURO)

    if isinstance(valor, datetime):
        c_val.value          = valor
        c_val.number_format  = FMT_DATA
    elif isinstance(valor, float) and valor < 1 and "Taxa" in campo:
        c_val.value          = valor
        c_val.number_format  = '0.000000%'
    elif isinstance(valor, float) and valor > 100:
        c_val.value          = valor
        c_val.number_format  = FMT_REAL
    elif isinstance(valor, float) and valor < 1:
        c_val.value          = valor
        c_val.number_format  = '0.00%'
    else:
        c_val.value = valor

# ── BLOCO NOTAS FISCAIS  ─────────────────────────────────────────────────────
linha_nf = len(dados_contrato) + 5 + 2  # ~21
wf.row_dimensions[linha_nf].height = 18
estilo_titulo_secao(wf[f"A{linha_nf}"], "ANÁLISE FISCAL — O QUE É ATIVÁVEL NO CUSTO DO IMÓVEL?")

linha_nf += 1
wf.merge_cells(f"A{linha_nf}:J{linha_nf}")
c_nota = wf[f"A{linha_nf}"]
c_nota.value = (
    "Base legal: IN RFB nº 84/2001, art. 16 — 'integram o custo de aquisição os encargos de financiamento pagos'. "
    "Posição conservadora: só amortização. Posição mais favorável: amortização + juros + MIP + DFI. Confirme com contador."
)
c_nota.font      = Font(name="Arial", italic=True, color="7F7F7F", size=9)
c_nota.fill      = PatternFill("solid", fgColor=AMARELO_ALERTA)
c_nota.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
c_nota.border    = borda_fina()
wf.row_dimensions[linha_nf].height = 36

# ── TABELA PARCELAS PAGAS ─────────────────────────────────────────────────────
linha_tab = linha_nf + 2
wf.row_dimensions[linha_tab].height = 22

# Cabeçalhos da tabela
cabecalhos = [
    ("A", "Parcela"),
    ("B", "Vencimento"),
    ("C", "Amortização\n(R$)"),
    ("D", "Juros\n(R$)"),
    ("E", "Seguro MIP\n(R$)"),
    ("F", "Seguro DFI\n(R$)"),
    ("G", "Total\nPago (R$)"),
    ("H", "Saldo Devedor\nApós (R$)"),
    ("I", "Ativável\nConservador (R$)"),
    ("J", "Ativável\nAmplo (R$)"),
]
for col, txt in cabecalhos:
    estilo_cabecalho_primario(wf[f"{col}{linha_tab}"], txt)
    wf.row_dimensions[linha_tab].height = 30

# Dados das parcelas pagas (extraídos do DDC)
parcelas = [
    (1, datetime(2025,10,29), 4446.36, 16401.83, 2015.28, 409.56, 23273.03, 1698508.24),
    (2, datetime(2025,11,29), 4454.10, 16387.48, 1006.76, 205.14, 22053.48, 1697011.24),
    (3, datetime(2025,12,29), 4461.45, 16371.55, 1005.78, 205.48, 22044.26, 1695349.86),
    (4, datetime(2026,1,29),  4469.20, 16356.96, 1004.88, 205.83, 22036.87, 1693827.18),
    (5, datetime(2026,2,28),  4476.79, 16341.63, 1003.94, 206.18, 22028.54, 1692228.20),
    (6, datetime(2026,3,29),  4484.39, 16326.17, 1002.99, 206.53, 22020.08, 1690615.52),
    (7, datetime(2026,4,29),  4491.96, 16310.45, 1002.02, 206.88, 22011.31, 1688975.63),
]

primeira_linha_dado = linha_tab + 1
for idx, p in enumerate(parcelas):
    r = linha_tab + 1 + idx
    wf.row_dimensions[r].height = 16
    fill_c = AZUL_CLARO if idx % 2 == 0 else BRANCO

    parc, dt, amort, juros, mip, dfi, total, saldo = p
    ativavel_cons = amort           # conservador: só amortização
    ativavel_ampl = amort + juros + mip + dfi  # amplo

    vals = [parc, dt, amort, juros, mip, dfi, total, saldo, ativavel_cons, ativavel_ampl]
    fmts = [FMT_INTEIRO, FMT_DATA, FMT_REAL, FMT_REAL, FMT_REAL, FMT_REAL,
            FMT_REAL, FMT_REAL, FMT_REAL, FMT_REAL]
    cols = list("ABCDEFGHIJ")

    for col, val, fmt in zip(cols, vals, fmts):
        cell = wf[f"{col}{r}"]
        cell.value          = val
        cell.number_format  = fmt
        cell.fill           = PatternFill("solid", fgColor=fill_c)
        cell.font           = Font(name="Arial", size=10, color=TEXTO_ESCURO)
        cell.alignment      = Alignment(horizontal="right" if col != "B" else "center",
                                       vertical="center")
        cell.border         = borda_fina()

    # Destacar colunas ativáveis
    wf[f"I{r}"].fill = PatternFill("solid", fgColor=VERDE_CLARO)
    wf[f"J{r}"].fill = PatternFill("solid", fgColor=AMARELO_ALERTA)

# ── LINHA TOTAL ───────────────────────────────────────────────────────────────
r_tot = linha_tab + 1 + len(parcelas)
wf.row_dimensions[r_tot].height = 20
primeira_dado = linha_tab + 1
ultima_dado   = r_tot - 1

total_row_data = {
    "A": "TOTAL",
    "B": f"{len(parcelas)} parcelas pagas",
    "C": f"=SUM(C{primeira_dado}:C{ultima_dado})",
    "D": f"=SUM(D{primeira_dado}:D{ultima_dado})",
    "E": f"=SUM(E{primeira_dado}:E{ultima_dado})",
    "F": f"=SUM(F{primeira_dado}:F{ultima_dado})",
    "G": f"=SUM(G{primeira_dado}:G{ultima_dado})",
    "H": "",   # saldo devedor atual
    "I": f"=SUM(I{primeira_dado}:I{ultima_dado})",
    "J": f"=SUM(J{primeira_dado}:J{ultima_dado})",
}
for col, val in total_row_data.items():
    c = wf[f"{col}{r_tot}"]
    c.value          = val
    c.font           = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=10)
    c.fill           = PatternFill("solid", fgColor=AZUL_MEDIO)
    c.alignment      = Alignment(horizontal="right" if col not in ("A","B") else "center",
                                 vertical="center")
    c.border         = borda_fina()
    if col not in ("A","B","H"):
        c.number_format = FMT_REAL

# Saldo devedor atual na coluna H
wf[f"H{r_tot}"].value          = 1688975.63
wf[f"H{r_tot}"].number_format  = FMT_REAL

# ── BLOCO RESUMO FISCAL ───────────────────────────────────────────────────────
r_res = r_tot + 2
wf.row_dimensions[r_res].height = 18
estilo_titulo_secao(wf[f"A{r_res}"], "RESUMO PARA DECLARAÇÃO DO IR — ENCARGOS PAGOS ATÉ 29/04/2026")

r_res += 1
resumo_fiscal = [
    ("Amortização total paga",
     f"=C{r_tot}", VERDE_CLARO,
     "Ativável em qualquer cenário. Compõe o custo de aquisição."),
    ("Juros totais pagos",
     f"=D{r_tot}", AMARELO_ALERTA,
     "Ativável se seguir IN RFB 84/2001 art.16. Confirmar com contador."),
    ("Seguro MIP total pago",
     f"=E{r_tot}", AMARELO_ALERTA,
     "Seguro de vida obrigatório do financiamento. Discussão fiscal similar aos juros."),
    ("Seguro DFI total pago",
     f"=F{r_tot}", AMARELO_ALERTA,
     "Seguro danos físicos obrigatório. Discussão fiscal similar."),
    ("TOTAL PAGO (amort+juros+seguros)",
     f"=G{r_tot}", AZUL_CLARO,
     "Total efetivamente desembolsado pelas 7 parcelas."),
    ("", "", None, ""),
    (">>> ATIVÁVEL CONSERVADOR (apenas amortização)",
     f"=I{r_tot}", VERDE_CLARO,
     "Posição mais segura. Menor risco de questionamento pela Receita Federal."),
    (">>> ATIVÁVEL AMPLO (amort + juros + seguros)",
     f"=J{r_tot}", AMARELO_ALERTA,
     "Amparado pela IN RFB 84/2001. Requer documentação e orientação contábil."),
]

cabecalhos_res = [("A","Componente"),("C","Valor (R$)"),("D","Elegibilidade / Observação")]
wf.merge_cells(f"A{r_res}:B{r_res}")
wf.merge_cells(f"D{r_res}:J{r_res}")
for col, txt in cabecalhos_res:
    estilo_cabecalho_secundario(wf[f"{col}{r_res}"], txt)
if "C" not in dict(cabecalhos_res):
    estilo_cabecalho_secundario(wf[f"C{r_res}"], "Valor (R$)")

r_res += 1
for campo, formula, fill, obs in resumo_fiscal:
    if not campo:
        r_res += 1
        continue
    wf.row_dimensions[r_res].height = 20
    wf.merge_cells(f"A{r_res}:B{r_res}")
    c_l = wf[f"A{r_res}"]
    bold_flag = ">>>" in campo
    estilo_label(c_l, campo.replace(">>>","").strip(), bold=bold_flag)
    if fill: c_l.fill = PatternFill("solid", fgColor=fill)

    c_v = wf[f"C{r_res}"]
    c_v.value          = formula
    c_v.number_format  = FMT_REAL
    c_v.font           = Font(name="Arial", bold=bold_flag, size=10)
    c_v.alignment      = Alignment(horizontal="right", vertical="center")
    c_v.border         = borda_fina()
    if fill: c_v.fill = PatternFill("solid", fgColor=fill)

    wf.merge_cells(f"D{r_res}:J{r_res}")
    c_o = wf[f"D{r_res}"]
    c_o.value          = obs
    c_o.font           = Font(name="Arial", italic=True, color="595959", size=9)
    c_o.alignment      = Alignment(horizontal="left", vertical="center", wrap_text=True)
    c_o.border         = borda_fina()
    if fill: c_o.fill = PatternFill("solid", fgColor=fill)

    r_res += 1

# ── LARGURAS COLUNAS ──────────────────────────────────────────────────────────
larguras = {"A":20,"B":14,"C":15,"D":15,"E":13,"F":13,"G":15,"H":17,"I":18,"J":18}
for col, w in larguras.items():
    wf.column_dimensions[col].width = w

# ═══════════════════════════════════════════════════════════════════════════════
# ABA 2: Custo_Total_Imóvel  (resumo consolidado)
# ═══════════════════════════════════════════════════════════════════════════════
if "Custo_Total_Imovel" in wb.sheetnames:
    del wb["Custo_Total_Imovel"]

wr = wb.create_sheet("Custo_Total_Imovel", len(wb.sheetnames))

# ── CABEÇALHO PRINCIPAL ───────────────────────────────────────────────────────
wr.merge_cells("A1:H1")
c = wr["A1"]
c.value     = "CUSTO TOTAL DE AQUISIÇÃO DO IMÓVEL — BASE PARA IMPOSTO DE RENDA"
c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=14)
c.fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
c.alignment = Alignment(horizontal="center", vertical="center")
wr.row_dimensions[1].height = 34

wr.merge_cells("A2:H2")
c2 = wr["A2"]
c2.value     = "Palm Hill — Casa 4 | Daniel Vieira de Freitas | Atualizado em 30/04/2026"
c2.font      = Font(name="Arial", italic=True, color=AZUL_ESCURO, size=10)
c2.fill      = PatternFill("solid", fgColor=AZUL_CLARO)
c2.alignment = Alignment(horizontal="center", vertical="center")
wr.row_dimensions[2].height = 18

# ── SEÇÃO 1: Custo de Aquisição ───────────────────────────────────────────────
wr.row_dimensions[3].height = 8

def sec_titulo(ws, row, texto, cor=AZUL_ESCURO, bg=AZUL_CLARO):
    ws.merge_cells(f"A{row}:H{row}")
    c = ws[f"A{row}"]
    c.value     = texto
    c.font      = Font(name="Arial", bold=True, color=cor, size=11)
    c.fill      = PatternFill("solid", fgColor=bg)
    c.alignment = Alignment(horizontal="left", vertical="center")
    c.border    = borda_fina()
    ws.row_dimensions[row].height = 22

def linha_item(ws, row, descricao, formula_cons, formula_amplo, fill=None,
               obs="", bold=False):
    fill = fill or BRANCO
    ws.row_dimensions[row].height = 18
    # A: descrição (merge A:C)
    ws.merge_cells(f"A{row}:C{row}")
    cl = ws[f"A{row}"]
    cl.value     = descricao
    cl.font      = Font(name="Arial", bold=bold, size=10, color=TEXTO_ESCURO)
    cl.fill      = PatternFill("solid", fgColor=fill)
    cl.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    cl.border    = borda_fina()

    # D: ativável conservador
    cd = ws[f"D{row}"]
    cd.value         = formula_cons
    cd.number_format = FMT_REAL
    cd.fill          = PatternFill("solid", fgColor=VERDE_CLARO if formula_cons else fill)
    cd.font          = Font(name="Arial", bold=bold, size=10)
    cd.alignment     = Alignment(horizontal="right", vertical="center")
    cd.border        = borda_fina()

    # E: ativável amplo
    ce = ws[f"E{row}"]
    ce.value         = formula_amplo
    ce.number_format = FMT_REAL
    ce.fill          = PatternFill("solid", fgColor=AMARELO_ALERTA if formula_amplo else fill)
    ce.font          = Font(name="Arial", bold=bold, size=10)
    ce.alignment     = Alignment(horizontal="right", vertical="center")
    ce.border        = borda_fina()

    # F-H: observação
    ws.merge_cells(f"F{row}:H{row}")
    co = ws[f"F{row}"]
    co.value     = obs
    co.font      = Font(name="Arial", italic=True, color="595959", size=9)
    co.fill      = PatternFill("solid", fgColor=fill)
    co.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    co.border    = borda_fina()

# Cabeçalhos colunas
row = 4
wr.row_dimensions[row].height = 28
cabecalhos_r = [
    ("A","Componente do custo"),
    ("D","Ativável CONSERVADOR\n(R$)"),
    ("E","Ativável AMPLO\n(R$)"),
    ("F","Observação / Risco fiscal"),
]
wr.merge_cells(f"A{row}:C{row}")
wr.merge_cells(f"F{row}:H{row}")
for col, txt in cabecalhos_r:
    estilo_cabecalho_primario(wr[f"{col}{row}"], txt)

row += 1
sec_titulo(wr, row, "1. CUSTO DE AQUISIÇÃO DO IMÓVEL")

row += 1
linha_item(wr, row,
    "Valor financiado (operação Itaú)",
    1700000.00, 1700000.00, fill=CINZA_LINHA,
    obs="Valor do contrato de financiamento nº 10199098907. Compõe custo base.")

row += 1
linha_item(wr, row,
    "Entrada / recursos próprios",
    None, None, fill=AMARELO_ALERTA,
    obs="⚠ Preencher: valor pago com recursos próprios na aquisição (não financiado).")

row += 1
linha_item(wr, row,
    "ITBI",
    None, None, fill=AMARELO_ALERTA,
    obs="⚠ Preencher: guia ITBI paga. Compõe custo de aquisição (ativável 100%).")

row += 1
linha_item(wr, row,
    "Registro em cartório / escritura",
    None, None, fill=AMARELO_ALERTA,
    obs="⚠ Preencher: custas de cartório. Ativável 100%.")

row += 1
linha_item(wr, row,
    "Corretagem / comissão na compra",
    None, None, fill=AMARELO_ALERTA,
    obs="⚠ Preencher se pago pelo comprador. Ativável 100%.")

# ── SEÇÃO 2: Encargos do Financiamento ────────────────────────────────────────
row += 1
sec_titulo(wr, row, "2. ENCARGOS DO FINANCIAMENTO PAGOS (parcelas 1 a 7 — out/2025 a abr/2026)")

# Referências cruzadas para a aba Financiamento_IR
# Encontrar as linhas dos totais na aba Financiamento_IR
# Total conservador = coluna I, linha r_tot; amplo = J, r_tot
# Mas é mais robusto usar referências dinâmicas
# Vamos usar SUMPRODUCT ou referência direta às células que calculamos

row += 1
linha_item(wr, row,
    "Amortização total paga (7 parcelas)",
    f"=Financiamento_IR!C{r_tot}",
    f"=Financiamento_IR!C{r_tot}",
    fill=CINZA_LINHA,
    obs="Extraído do DDC Itaú. Ativável em ambos os cenários.")

row += 1
linha_item(wr, row,
    "Juros pagos (7 parcelas)",
    0,
    f"=Financiamento_IR!D{r_tot}",
    fill=CINZA_LINHA,
    obs="Conservador: não ativa. Amplo: ativa com base na IN RFB 84/2001, art.16.")

row += 1
linha_item(wr, row,
    "Seguro MIP — Morte/Invalidez (7 parcelas)",
    0,
    f"=Financiamento_IR!E{r_tot}",
    fill=CINZA_LINHA,
    obs="Seguro obrigatório do financiamento. Mesmo tratamento fiscal dos juros.")

row += 1
linha_item(wr, row,
    "Seguro DFI — Danos Físicos (7 parcelas)",
    0,
    f"=Financiamento_IR!F{r_tot}",
    fill=CINZA_LINHA,
    obs="Seguro obrigatório do financiamento. Mesmo tratamento fiscal dos juros.")

# ── SEÇÃO 3: Benfeitorias (da aba Lancamentos) ───────────────────────────────
row += 1
sec_titulo(wr, row, "3. BENFEITORIAS, REFORMAS E PROJETOS (lançamentos na aba Lancamentos)")

row += 1
linha_item(wr, row,
    "Projetos de arquitetura (Bambu.Arq — 2 parcelas lançadas)",
    "=SUMIFS(Lancamentos!$S$2:$S$1000,Lancamentos!$F$2:$F$1000,\"Projetos e taxas\")",
    "=SUMIFS(Lancamentos!$S$2:$S$1000,Lancamentos!$F$2:$F$1000,\"Projetos e taxas\")",
    fill=CINZA_LINHA,
    obs="NFS-e 444 e 446. Parcial/Revisar com contador (50% padrão tabela). 2 de 4 parcelas pagas.")

row += 1
linha_item(wr, row,
    "Decoração / serviços GoStudio (sem NF)",
    "=SUMIFS(Lancamentos!$S$2:$S$1000,Lancamentos!$F$2:$F$1000,\"Decoração / móveis soltos\")",
    "=SUMIFS(Lancamentos!$S$2:$S$1000,Lancamentos!$F$2:$F$1000,\"Decoração / móveis soltos\")",
    fill=CINZA_LINHA,
    obs="⚠ RISCO ALTO: sem NF emitida. Classificação como 'Bem móvel' = 0% ativável. Solicitar NF e reclassificar.")

row += 1
linha_item(wr, row,
    "Demais lançamentos futuros (total ativável Lancamentos)",
    "=Resumo_Anual_IR!C14",
    "=Resumo_Anual_IR!C14",
    fill=CINZA_LINHA,
    obs="Total calculado automaticamente da aba Resumo_Anual_IR conforme novos lançamentos.")

# ── SEÇÃO 4: TOTAIS CONSOLIDADOS ─────────────────────────────────────────────
row += 1
row += 1
sec_titulo(wr, row, "4. CUSTO TOTAL ATIVÁVEL CONSOLIDADO", cor=TEXTO_BRANCO, bg=VERDE_ESCURO)

# Guardar linhas para somar
# Amortiz: row_amort; Juros: row_juros; MIP: row_mip; DFI: row_dfi
# Projetos: row_proj; Gostudio: row_gos; Demais: row_demais; Aquisicao: rows 6-10
r_valor = row

row += 1
wr.row_dimensions[row].height = 24

wr.merge_cells(f"A{row}:C{row}")
c_tot_label = wr[f"A{row}"]
c_tot_label.value     = "TOTAL ATIVÁVEL NO CUSTO DO IMÓVEL"
c_tot_label.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=12)
c_tot_label.fill      = PatternFill("solid", fgColor=VERDE_ESCURO)
c_tot_label.alignment = Alignment(horizontal="left", vertical="center")
c_tot_label.border    = borda_media()

# Fórmulas de soma dinâmica das colunas D e E
# Somamos todas as linhas de dados nas colunas D e E
# Seção 1: linhas 7 a 11 (valores fixos + vazios para campos não preenchidos)
# Seção 2: linhas 13 a 16
# Seção 3: linhas 18 a 20

# Vamos somar tudo que estiver nas col D e E (excluindo cabeçalhos e seções)
# A abordagem mais robusta é calcular manualmente aqui
# porque as referências cruzadas já estão nas células acima

# Seção 1 linhas (aquisição): começam em row 6
# row_aquisicao: 6 a 10 (valor financiado=6, entrada=7, itbi=8, cartório=9, corretagem=10)
# Seção 2 linhas: amort=12, juros=13, mip=14, dfi=15
# Seção 3 linhas: projetos=17, gostudio=18, demais=19
# (contagem desde o início do script)

# Em vez de hardcodar nºs de linha, vamos usar SUM de intervalo específico.
# Sabemos as linhas exatas de dados:
# linha 6 = imóvel financiado, 7=entrada, 8=ITBI, 9=cartório, 10=corretagem
# linha 12 = amortização, 13 = juros, 14 = MIP, 15 = DFI
# linha 17 = projetos, 18 = gostudio, 19 = demais
# row_valor = linha do total final

# Determinar as linhas exatas com base na construção acima
# Seção 1 começa na linha 6 (row=4+1+1=6), items 6..10
# Seção 2 começa linha 12, items 12..15
# Seção 3 começa linha 17, items 17..19
# Total = linha 21 (row)

# Usar fórmula de soma explícita por segmentos conhecidos
linha_tot_cons = f"=D6+D7+D8+D9+D10+D12+D13+D14+D15+D17+D18+D19"
linha_tot_ampl = f"=E6+E7+E8+E9+E10+E12+E13+E14+E15+E17+E18+E19"

for col, formula, label in [
    ("D", linha_tot_cons, "Cenário Conservador"),
    ("E", linha_tot_ampl, "Cenário Amplo"),
]:
    c = wr[f"{col}{row}"]
    c.value         = formula
    c.number_format = FMT_REAL
    c.font          = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=12)
    c.fill          = PatternFill("solid", fgColor=VERDE_ESCURO)
    c.alignment     = Alignment(horizontal="right", vertical="center")
    c.border        = borda_media()

wr.merge_cells(f"F{row}:H{row}")
c_obs_tot = wr[f"F{row}"]
c_obs_tot.value     = "Conservador: base segura. Amplo: requer confirmação contábil. Diferença = juros + seguros pagos no financiamento."
c_obs_tot.font      = Font(name="Arial", italic=True, bold=True, color=TEXTO_BRANCO, size=9)
c_obs_tot.fill      = PatternFill("solid", fgColor=VERDE_ESCURO)
c_obs_tot.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
c_obs_tot.border    = borda_media()

# ── LEGENDA ───────────────────────────────────────────────────────────────────
row += 2
sec_titulo(wr, row, "LEGENDA E INSTRUÇÕES", cor=AZUL_ESCURO, bg=AZUL_CLARO)

row += 1
legenda = [
    (VERDE_CLARO,   "Ativável CONSERVADOR: valor que a Receita Federal dificilmente questiona. "
                    "Inclui amortização e custos de aquisição documentados."),
    (AMARELO_ALERTA,"Ativável AMPLO: inclui juros e seguros obrigatórios do financiamento. "
                    "Amparado pela IN RFB 84/2001. Recomenda-se orientação de contador."),
    (AMARELO_ALERTA,"⚠ Campos em amarelo: precisam ser preenchidos com seus dados reais."),
    (LARANJA_ALERTA,"⚠ Risco ALTO: itens sem nota fiscal ou com classificação a revisar."),
    (CINZA_LINHA,   "Para adicionar novos gastos de obra, use sempre a aba Lancamentos — "
                    "os totais refletem automaticamente nesta aba."),
]
for fill, texto in legenda:
    wr.row_dimensions[row].height = 28
    wr.merge_cells(f"A{row}:H{row}")
    cl = wr[f"A{row}"]
    cl.value     = texto
    cl.font      = Font(name="Arial", size=9, color=TEXTO_ESCURO)
    cl.fill      = PatternFill("solid", fgColor=fill)
    cl.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    cl.border    = borda_fina()
    row += 1

# ── LARGURAS COLUNAS ──────────────────────────────────────────────────────────
larguras_r = {"A":5,"B":5,"C":40,"D":22,"E":22,"F":10,"G":10,"H":25}
for col, w in larguras_r.items():
    wr.column_dimensions[col].width = w

# Ajustar coluna A-C como merge, então A,B estreitas, C larga
wr.column_dimensions["A"].width = 2
wr.column_dimensions["B"].width = 2
wr.column_dimensions["C"].width = 44
wr.column_dimensions["D"].width = 24
wr.column_dimensions["E"].width = 24
wr.column_dimensions["F"].width = 8
wr.column_dimensions["G"].width = 8
wr.column_dimensions["H"].width = 28

wb.save('/mnt/user-data/outputs/Controle_Gastos_Obra_Pro_IR.xlsx')
print("Salvo com sucesso!")
print(f"Abas disponíveis: {wb.sheetnames}")
