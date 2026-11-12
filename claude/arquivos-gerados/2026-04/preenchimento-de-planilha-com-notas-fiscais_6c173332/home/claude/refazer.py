from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from datetime import datetime

# ─── PALETA ──────────────────────────────────────────────────────────────────
AZUL_ESCURO   = "1F3864"
AZUL_MEDIO    = "2E75B6"
AZUL_CLARO    = "D6E4F0"
VERDE_ESCURO  = "1D6038"
VERDE_CLARO   = "E2EFDA"
AMARELO       = "FFF2CC"
LARANJA       = "FCE4D6"
CINZA         = "F2F2F2"
BRANCO        = "FFFFFF"
TEXTO_BRANCO  = "FFFFFF"
TEXTO_ESCURO  = "1F1F1F"

FMT_REAL    = 'R$ #,##0.00'
FMT_PCT     = '0.00%'
FMT_DATA    = 'dd/mm/yyyy'
FMT_INTEIRO = '#,##0'

def borda_fina():
    s = Side(border_style="thin", color="BFBFBF")
    return Border(left=s, right=s, top=s, bottom=s)

def borda_media():
    s = Side(border_style="medium", color="1F3864")
    return Border(left=s, right=s, top=s, bottom=s)

wb = load_workbook('/mnt/user-data/outputs/Controle_Gastos_Obra_Pro_IR.xlsx')

# ═════════════════════════════════════════════════════════════════════════════
# REMOVER ABAS ANTIGAS
# ═════════════════════════════════════════════════════════════════════════════
if "Financiamento_IR" in wb.sheetnames:
    del wb["Financiamento_IR"]
if "Custo_Total_Imovel" in wb.sheetnames:
    del wb["Custo_Total_Imovel"]

# ═════════════════════════════════════════════════════════════════════════════
# ABA 1: Financiamento_IR
# ═════════════════════════════════════════════════════════════════════════════
wf = wb.create_sheet("Financiamento_IR")

# ── HEADER PRINCIPAL ──────────────────────────────────────────────────────────
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

# ── DADOS DO CONTRATO ─────────────────────────────────────────────────────────
wf.row_dimensions[3].height = 18
ct = wf["A3"]
ct.value = "DADOS DO CONTRATO"
ct.font  = Font(name="Arial", bold=True, color=AZUL_ESCURO, size=12)
ct.alignment = Alignment(horizontal="left", vertical="center")

wf.row_dimensions[4].height = 18
for col, txt in [("A", "Campo"), ("C", "Valor")]:
    cc = wf[f"{col}4"]
    cc.value = txt
    cc.font  = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=10)
    cc.fill  = PatternFill("solid", fgColor=AZUL_MEDIO)
    cc.alignment = Alignment(horizontal="center", vertical="center")
    cc.border = borda_fina()
wf.merge_cells("A4:B4")
wf.merge_cells("C4:E4")

dados_contrato = [
    ("Número do contrato",          "10199098907"),
    ("Banco",                       "Itaú Unibanco"),
    ("Agência / Conta",             "9638 / 360-9"),
    ("Data de início",              datetime(2025, 9, 29)),
    ("Valor da operação",           1700000.00),
    ("Sistema de amortização",      "SAC"),
    ("Modalidade",                  "Taxa fixa - Carteira Hipotecária"),
    ("Taxa de juros mensal (com benefício)", 0.009631393/100),
    ("Taxa de juros anual (com benefício)",  11.55767160/100),
    ("Taxa efetiva anual (CET)",    12.19/100),
    ("Prazo total (parcelas)",      383),
    ("Prazo remanescente",          376),
    ("Vencimento última parcela",   datetime(2057, 8, 29)),
    ("Saldo devedor em 29/04/2026", 1688975.63),
]

for i, (campo, valor) in enumerate(dados_contrato, start=5):
    wf.row_dimensions[i].height = 16
    wf.merge_cells(f"A{i}:B{i}")
    wf.merge_cells(f"C{i}:E{i}")
    fill = CINZA if i % 2 == 0 else BRANCO

    cl = wf[f"A{i}"]
    cl.value     = campo
    cl.font      = Font(name="Arial", size=10, color=TEXTO_ESCURO)
    cl.alignment = Alignment(horizontal="left", vertical="center")
    cl.fill      = PatternFill("solid", fgColor=fill)
    cl.border    = borda_fina()

    cv = wf[f"C{i}"]
    cv.font      = Font(name="Arial", size=10)
    cv.alignment = Alignment(horizontal="right", vertical="center")
    cv.fill      = PatternFill("solid", fgColor=fill)
    cv.border    = borda_fina()

    if isinstance(valor, datetime):
        cv.value = valor
        cv.number_format = FMT_DATA
    elif isinstance(valor, float) and "Taxa" in campo:
        cv.value = valor
        cv.number_format = '0.000000%'
    elif isinstance(valor, float) and valor > 100:
        cv.value = valor
        cv.number_format = FMT_REAL
    else:
        cv.value = valor

# ── BASE LEGAL ────────────────────────────────────────────────────────────────
linha = len(dados_contrato) + 5 + 2  # 21
wf.row_dimensions[linha].height = 18
ct2 = wf[f"A{linha}"]
ct2.value = "ANÁLISE FISCAL — O QUE PODE SER ATIVADO NO CUSTO DO IMÓVEL?"
ct2.font  = Font(name="Arial", bold=True, color=AZUL_ESCURO, size=12)

linha += 1
wf.merge_cells(f"A{linha}:J{linha}")
nota = wf[f"A{linha}"]
nota.value = (
    "Base legal: IN RFB nº 84/2001, art. 17, V — '...integram o custo de aquisição os "
    "encargos relativos à obtenção do financiamento'. Posição CONSERVADORA: ativa "
    "apenas amortização. Posição AMPLA: ativa amortização + juros + seguros obrigatórios "
    "(MIP/DFI). Recomenda-se confirmação com contador antes da declaração."
)
nota.font      = Font(name="Arial", italic=True, color="7F3F00", size=9)
nota.fill      = PatternFill("solid", fgColor=AMARELO)
nota.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
nota.border    = borda_fina()
wf.row_dimensions[linha].height = 42

# ── TABELA DE PARCELAS PAGAS ──────────────────────────────────────────────────
linha_tab = linha + 2
wf.row_dimensions[linha_tab].height = 32

cabecalhos = [
    ("A", "Parcela"),
    ("B", "Vencimento"),
    ("C", "Amortização\n(R$)"),
    ("D", "Juros\n(R$)"),
    ("E", "Seguro MIP\n(R$)"),
    ("F", "Seguro DFI\n(R$)"),
    ("G", "Total Pago\n(R$)"),
    ("H", "Saldo Devedor\nApós (R$)"),
    ("I", "Ativável\nCONSERVADOR"),
    ("J", "Ativável\nAMPLO"),
]
for col, txt in cabecalhos:
    c = wf[f"{col}{linha_tab}"]
    c.value     = txt
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=10)
    c.fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()

# Dados extraídos do DDC (parcelas 1 a 7 com situação "Paga")
parcelas = [
    (1, datetime(2025,10,29), 4446.36, 16401.83, 2015.28, 409.56, 23273.03, 1698508.24),
    (2, datetime(2025,11,29), 4454.10, 16387.48, 1006.76, 205.14, 22053.48, 1697011.24),
    (3, datetime(2025,12,29), 4461.45, 16371.55, 1005.78, 205.48, 22044.26, 1695349.86),
    (4, datetime(2026,1,29),  4469.20, 16356.96, 1004.88, 205.83, 22036.87, 1693827.18),
    (5, datetime(2026,2,28),  4476.79, 16341.63, 1003.94, 206.18, 22028.54, 1692228.20),
    (6, datetime(2026,3,29),  4484.39, 16326.17, 1002.99, 206.53, 22020.08, 1690615.52),
    (7, datetime(2026,4,29),  4491.96, 16310.45, 1002.02, 206.88, 22011.31, 1688975.63),
]

primeira_dado = linha_tab + 1
for idx, p in enumerate(parcelas):
    r = primeira_dado + idx
    wf.row_dimensions[r].height = 16
    fill_c = AZUL_CLARO if idx % 2 == 0 else BRANCO
    parc, dt, amort, juros, mip, dfi, total, saldo = p
    ativ_cons = amort
    ativ_ampl = amort + juros + mip + dfi

    valores = [parc, dt, amort, juros, mip, dfi, total, saldo, ativ_cons, ativ_ampl]
    formatos = [FMT_INTEIRO, FMT_DATA, FMT_REAL, FMT_REAL, FMT_REAL, FMT_REAL,
                FMT_REAL, FMT_REAL, FMT_REAL, FMT_REAL]
    cols = list("ABCDEFGHIJ")

    for col, val, fmt in zip(cols, valores, formatos):
        c = wf[f"{col}{r}"]
        c.value         = val
        c.number_format = fmt
        c.fill          = PatternFill("solid", fgColor=fill_c)
        c.font          = Font(name="Arial", size=10)
        c.alignment     = Alignment(horizontal="center" if col in ("A","B") else "right",
                                     vertical="center")
        c.border        = borda_fina()

    # Destacar colunas de ativável
    wf[f"I{r}"].fill = PatternFill("solid", fgColor=VERDE_CLARO)
    wf[f"J{r}"].fill = PatternFill("solid", fgColor=AMARELO)

# ── LINHA TOTAL ───────────────────────────────────────────────────────────────
r_tot = primeira_dado + len(parcelas)
ultima_dado = r_tot - 1
wf.row_dimensions[r_tot].height = 22

total_data = {
    "A": "TOTAL",
    "B": f"{len(parcelas)} parcelas pagas",
    "C": f"=SUM(C{primeira_dado}:C{ultima_dado})",
    "D": f"=SUM(D{primeira_dado}:D{ultima_dado})",
    "E": f"=SUM(E{primeira_dado}:E{ultima_dado})",
    "F": f"=SUM(F{primeira_dado}:F{ultima_dado})",
    "G": f"=SUM(G{primeira_dado}:G{ultima_dado})",
    "H": 1688975.63,
    "I": f"=SUM(I{primeira_dado}:I{ultima_dado})",
    "J": f"=SUM(J{primeira_dado}:J{ultima_dado})",
}
for col, val in total_data.items():
    c = wf[f"{col}{r_tot}"]
    c.value     = val
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=11)
    c.fill      = PatternFill("solid", fgColor=AZUL_MEDIO)
    c.alignment = Alignment(horizontal="center" if col in ("A","B") else "right",
                            vertical="center")
    c.border    = borda_fina()
    if col not in ("A","B"):
        c.number_format = FMT_REAL

# ── BLOCO RESUMO FISCAL ───────────────────────────────────────────────────────
r_res = r_tot + 2
wf.row_dimensions[r_res].height = 18
ctrf = wf[f"A{r_res}"]
ctrf.value = "RESUMO PARA O IR — ENCARGOS PAGOS DE OUT/2025 A ABR/2026"
ctrf.font  = Font(name="Arial", bold=True, color=AZUL_ESCURO, size=12)

r_res += 1
wf.row_dimensions[r_res].height = 18
wf.merge_cells(f"A{r_res}:B{r_res}")
wf.merge_cells(f"D{r_res}:J{r_res}")
for col, txt in [("A", "Componente"), ("C", "Valor (R$)"), ("D", "Observação")]:
    c = wf[f"{col}{r_res}"]
    c.value     = txt
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=10)
    c.fill      = PatternFill("solid", fgColor=AZUL_MEDIO)
    c.alignment = Alignment(horizontal="center", vertical="center")
    c.border    = borda_fina()

r_res += 1
resumo_fiscal = [
    ("Amortização total paga",
     f"=C{r_tot}", VERDE_CLARO,
     "Ativável em qualquer cenário. Compõe diretamente o custo de aquisição."),
    ("Juros totais pagos",
     f"=D{r_tot}", AMARELO,
     "Ativável conforme IN RFB 84/2001 art.17, V. Confirmar com contador."),
    ("Seguro MIP total pago",
     f"=E{r_tot}", AMARELO,
     "Seguro de Morte/Invalidez obrigatório do financiamento. Tratamento similar aos juros."),
    ("Seguro DFI total pago",
     f"=F{r_tot}", AMARELO,
     "Seguro Danos Físicos no Imóvel obrigatório. Tratamento similar aos juros."),
    ("TOTAL PAGO (geral)",
     f"=G{r_tot}", AZUL_CLARO,
     "Soma de todas as parcelas efetivamente desembolsadas até abril/2026."),
    ("", "", None, ""),
    (">> ATIVÁVEL CONSERVADOR (apenas amortização)",
     f"=I{r_tot}", VERDE_CLARO,
     "Posição mais segura. Menor risco de questionamento da Receita Federal."),
    (">> ATIVÁVEL AMPLO (amort + juros + MIP + DFI)",
     f"=J{r_tot}", AMARELO,
     "Amparado pela IN RFB 84/2001. Requer documentação completa."),
]

for campo, formula, fill, obs in resumo_fiscal:
    if not campo:
        r_res += 1
        continue
    wf.row_dimensions[r_res].height = 22
    wf.merge_cells(f"A{r_res}:B{r_res}")
    wf.merge_cells(f"D{r_res}:J{r_res}")
    bold = ">>" in campo

    cl = wf[f"A{r_res}"]
    cl.value     = campo.replace(">>", "").strip()
    cl.font      = Font(name="Arial", bold=bold, size=10)
    cl.alignment = Alignment(horizontal="left", vertical="center")
    cl.fill      = PatternFill("solid", fgColor=fill or BRANCO)
    cl.border    = borda_fina()

    cv = wf[f"C{r_res}"]
    cv.value         = formula
    cv.number_format = FMT_REAL
    cv.font          = Font(name="Arial", bold=bold, size=10)
    cv.alignment     = Alignment(horizontal="right", vertical="center")
    cv.fill          = PatternFill("solid", fgColor=fill or BRANCO)
    cv.border        = borda_fina()

    co = wf[f"D{r_res}"]
    co.value     = obs
    co.font      = Font(name="Arial", italic=True, color="595959", size=9)
    co.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    co.fill      = PatternFill("solid", fgColor=fill or BRANCO)
    co.border    = borda_fina()

    r_res += 1

# Larguras
larguras_f = {"A":18,"B":13,"C":14,"D":14,"E":13,"F":13,"G":14,"H":17,"I":18,"J":18}
for col, w in larguras_f.items():
    wf.column_dimensions[col].width = w

# ═════════════════════════════════════════════════════════════════════════════
# ABA 2: Custo_Total_Imovel  — preservando dados de aquisição já preenchidos
# ═════════════════════════════════════════════════════════════════════════════
wr = wb.create_sheet("Custo_Total_Imovel")

# ── HEADER ────────────────────────────────────────────────────────────────────
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

# Espaço
wr.row_dimensions[3].height = 8

# ── HELPERS ───────────────────────────────────────────────────────────────────
def secao(ws, row, texto, cor_texto=AZUL_ESCURO, cor_fundo=AZUL_CLARO):
    ws.merge_cells(f"A{row}:H{row}")
    c = ws[f"A{row}"]
    c.value     = texto
    c.font      = Font(name="Arial", bold=True, color=cor_texto, size=11)
    c.fill      = PatternFill("solid", fgColor=cor_fundo)
    c.alignment = Alignment(horizontal="left", vertical="center")
    c.border    = borda_fina()
    ws.row_dimensions[row].height = 22

def linha_item(ws, row, descricao, val_cons, val_ampl, obs, fill=BRANCO, bold=False,
               cor_d=None, cor_e=None):
    ws.row_dimensions[row].height = 22
    ws.merge_cells(f"A{row}:C{row}")
    cl = ws[f"A{row}"]
    cl.value     = descricao
    cl.font      = Font(name="Arial", bold=bold, size=10)
    cl.fill      = PatternFill("solid", fgColor=fill)
    cl.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    cl.border    = borda_fina()

    cd = ws[f"D{row}"]
    cd.value         = val_cons
    cd.number_format = FMT_REAL
    cd.fill          = PatternFill("solid", fgColor=cor_d or (VERDE_CLARO if val_cons else AMARELO))
    cd.font          = Font(name="Arial", bold=bold, size=10)
    cd.alignment     = Alignment(horizontal="right", vertical="center")
    cd.border        = borda_fina()

    ce = ws[f"E{row}"]
    ce.value         = val_ampl
    ce.number_format = FMT_REAL
    ce.fill          = PatternFill("solid", fgColor=cor_e or (AMARELO if val_ampl else AMARELO))
    ce.font          = Font(name="Arial", bold=bold, size=10)
    ce.alignment     = Alignment(horizontal="right", vertical="center")
    ce.border        = borda_fina()

    ws.merge_cells(f"F{row}:H{row}")
    co = ws[f"F{row}"]
    co.value     = obs
    co.font      = Font(name="Arial", italic=True, color="595959", size=9)
    co.fill      = PatternFill("solid", fgColor=fill)
    co.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    co.border    = borda_fina()

# ── CABEÇALHOS DAS COLUNAS ────────────────────────────────────────────────────
row = 4
wr.row_dimensions[row].height = 32
wr.merge_cells(f"A{row}:C{row}")
wr.merge_cells(f"F{row}:H{row}")
for col, txt in [("A","Componente do custo"),
                 ("D","Ativável CONSERVADOR\n(R$)"),
                 ("E","Ativável AMPLO\n(R$)"),
                 ("F","Observação / Risco fiscal")]:
    c = wr[f"{col}{row}"]
    c.value     = txt
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=11)
    c.fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()

# ── SEÇÃO 1: AQUISIÇÃO (PRESERVAR VALORES) ────────────────────────────────────
row += 1
secao(wr, row, "1. CUSTO DE AQUISIÇÃO DO IMÓVEL")

row += 1  # 6
linha_item(wr, row,
    "Valor financiado (operação Itaú)",
    1700000.00, 1700000.00,
    "Contrato de financiamento nº 10199098907. Compõe o custo base do imóvel.",
    fill=CINZA, cor_d=VERDE_CLARO, cor_e=VERDE_CLARO)

row += 1  # 7
linha_item(wr, row,
    "Entrada — recursos próprios (item 3-A do contrato)",
    1500000.00, 1500000.00,
    "Contrato Itaú nº 10199098907, pág.2, item 3-A. Ativável 100%. Documenta custo de aquisição.",
    fill=CINZA, cor_d=VERDE_CLARO, cor_e=VERDE_CLARO)

row += 1  # 8
linha_item(wr, row,
    "ITBI — Imposto sobre Transmissão de Bens Imóveis",
    96000.00, 96000.00,
    ("Guia ITBI-IV Prefeitura SP | Transação 56385496-0 | Venc. 09/10/2025 | "
     "Base: valor de transação R$3.200.000 (maior que venal ref. R$1.598.406) x 3% = R$96.000. "
     "Ativável 100%. Documento: DAMSP via banco."),
    fill=CINZA, cor_d=VERDE_CLARO, cor_e=VERDE_CLARO)

row += 1  # 9
linha_item(wr, row,
    "Emolumentos Cartório + Tarifa Avaliação Itaú",
    12897.67, 12897.67,
    ("11º RI SP (15/10/2025): V&C R$6.647,08 + Alienação R$4.886,77 + Certidão R$73,74 = "
     "R$11.607,59. Tarifa Avaliação Itaú (item L do contrato): R$1.290,08. "
     "Total: R$12.897,67. Ativável 100%."),
    fill=CINZA, cor_d=VERDE_CLARO, cor_e=VERDE_CLARO)

row += 1  # 10
linha_item(wr, row,
    "Corretagem / comissão de venda",
    None, None,
    "⚠ Não localizado nos documentos. Preencher se houve comissão paga pelo comprador. Ativável 100%.",
    fill=AMARELO)

# ── SEÇÃO 2: ENCARGOS DO FINANCIAMENTO ────────────────────────────────────────
row += 1  # 11
secao(wr, row, "2. ENCARGOS DO FINANCIAMENTO PAGOS (parcelas 1 a 7 — out/2025 a abr/2026)")

row += 1  # 12 - Amortização
linha_item(wr, row,
    "Amortização total paga (7 parcelas)",
    f"=Financiamento_IR!C{r_tot}",
    f"=Financiamento_IR!C{r_tot}",
    "Extraído do DDC Itaú emitido em 30/04/2026. Ativável em ambos os cenários.",
    fill=CINZA, cor_d=VERDE_CLARO, cor_e=VERDE_CLARO)

row += 1  # 13 - Juros
linha_item(wr, row,
    "Juros pagos (7 parcelas)",
    0,
    f"=Financiamento_IR!D{r_tot}",
    "Conservador: não ativa. Amplo: ativa com base na IN RFB 84/2001, art.17, V.",
    fill=CINZA, cor_d=VERDE_CLARO, cor_e=AMARELO)

row += 1  # 14 - MIP
linha_item(wr, row,
    "Seguro MIP — Morte/Invalidez (7 parcelas)",
    0,
    f"=Financiamento_IR!E{r_tot}",
    "Seguro obrigatório do financiamento. Mesmo tratamento fiscal dos juros.",
    fill=CINZA, cor_d=VERDE_CLARO, cor_e=AMARELO)

row += 1  # 15 - DFI
linha_item(wr, row,
    "Seguro DFI — Danos Físicos (7 parcelas)",
    0,
    f"=Financiamento_IR!F{r_tot}",
    "Seguro obrigatório do financiamento. Mesmo tratamento fiscal dos juros.",
    fill=CINZA, cor_d=VERDE_CLARO, cor_e=AMARELO)

# ── SEÇÃO 3: BENFEITORIAS ─────────────────────────────────────────────────────
row += 1  # 16
secao(wr, row, "3. BENFEITORIAS, REFORMAS E PROJETOS (lançamentos na aba Lancamentos)")

row += 1  # 17 - Projetos
linha_item(wr, row,
    "Projetos de arquitetura (Bambu.Arq)",
    "=SUMIFS(Lancamentos!$S$2:$S$1000,Lancamentos!$F$2:$F$1000,\"Projetos e taxas\")",
    "=SUMIFS(Lancamentos!$S$2:$S$1000,Lancamentos!$F$2:$F$1000,\"Projetos e taxas\")",
    "NFS-e 444 e 446. Parcial/Revisar (50% padrão tabela). 2 de 4 parcelas pagas.",
    fill=CINZA, cor_d=VERDE_CLARO, cor_e=VERDE_CLARO)

row += 1  # 18 - GoStudio
linha_item(wr, row,
    "Decoração / serviços GoStudio (sem NF)",
    "=SUMIFS(Lancamentos!$S$2:$S$1000,Lancamentos!$F$2:$F$1000,\"Decoração / móveis soltos\")",
    "=SUMIFS(Lancamentos!$S$2:$S$1000,Lancamentos!$F$2:$F$1000,\"Decoração / móveis soltos\")",
    "⚠ RISCO ALTO: sem NF emitida. Bem móvel = 0% ativável. Solicitar NF.",
    fill=CINZA, cor_d=LARANJA, cor_e=LARANJA)

row += 1  # 19 - Demais
linha_item(wr, row,
    "Demais lançamentos (total ativável Lancamentos)",
    "=Resumo_Anual_IR!C14",
    "=Resumo_Anual_IR!C14",
    "Total automático conforme novos lançamentos forem adicionados na aba Lancamentos.",
    fill=CINZA, cor_d=VERDE_CLARO, cor_e=VERDE_CLARO)

# Espaço antes do total
row += 1  # 20

# ── SEÇÃO 4: TOTAL CONSOLIDADO ────────────────────────────────────────────────
row += 1  # 21
secao(wr, row, "4. CUSTO TOTAL ATIVÁVEL CONSOLIDADO", cor_texto=TEXTO_BRANCO, cor_fundo=VERDE_ESCURO)

row += 1  # 22 — TOTAL
wr.row_dimensions[row].height = 28

# Linhas a somar:
# Aquisição: 6, 7, 8, 9, 10
# Encargos:  12, 13, 14, 15
# Benfeitorias: 17, 18, 19
linhas_soma = [6,7,8,9,10, 12,13,14,15, 17,18,19]
formula_d = "=" + "+".join([f"D{l}" for l in linhas_soma])
formula_e = "=" + "+".join([f"E{l}" for l in linhas_soma])

wr.merge_cells(f"A{row}:C{row}")
ct = wr[f"A{row}"]
ct.value     = "TOTAL ATIVÁVEL NO CUSTO DO IMÓVEL"
ct.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=12)
ct.fill      = PatternFill("solid", fgColor=VERDE_ESCURO)
ct.alignment = Alignment(horizontal="left", vertical="center")
ct.border    = borda_media()

for col, formula in [("D", formula_d), ("E", formula_e)]:
    c = wr[f"{col}{row}"]
    c.value         = formula
    c.number_format = FMT_REAL
    c.font          = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=12)
    c.fill          = PatternFill("solid", fgColor=VERDE_ESCURO)
    c.alignment     = Alignment(horizontal="right", vertical="center")
    c.border        = borda_media()

wr.merge_cells(f"F{row}:H{row}")
co = wr[f"F{row}"]
co.value     = ("Conservador: base segura. Amplo: requer confirmação contábil. "
                "Diferença = juros + seguros pagos no financiamento.")
co.font      = Font(name="Arial", italic=True, bold=True, color=TEXTO_BRANCO, size=9)
co.fill      = PatternFill("solid", fgColor=VERDE_ESCURO)
co.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
co.border    = borda_media()

# ── SEÇÃO 5: BLOCO INFORMATIVO — VALOR PAGO vs VALOR AVALIADO ─────────────────
row += 2  # 24
secao(wr, row, "5. INFORMAÇÕES COMPLEMENTARES PARA O IR")

row += 1  # 25
informacoes = [
    ("Preço de venda do imóvel", 3200000.00,
     "Contrato Itaú nº 10199098907, item 2 - Preço de Venda do Imóvel."),
    ("Valor venal de referência (Prefeitura SP)", 1598406.00,
     "Guia ITBI-IV. Usado para verificar base de cálculo do imposto municipal."),
    ("Valor de avaliação Itaú (para leilão)", 3690000.00,
     "Contrato item 13. Valor estimado pelo banco para garantia em caso de leilão."),
    ("Saldo devedor em 29/04/2026", 1688975.63,
     "Saldo do financiamento após 7 parcelas pagas. Não compõe custo de aquisição."),
]
for desc, val, obs in informacoes:
    wr.row_dimensions[row].height = 18
    wr.merge_cells(f"A{row}:C{row}")
    cl = wr[f"A{row}"]
    cl.value     = desc
    cl.font      = Font(name="Arial", size=10)
    cl.fill      = PatternFill("solid", fgColor=BRANCO)
    cl.alignment = Alignment(horizontal="left", vertical="center")
    cl.border    = borda_fina()

    wr.merge_cells(f"D{row}:E{row}")
    cv = wr[f"D{row}"]
    cv.value         = val
    cv.number_format = FMT_REAL
    cv.font          = Font(name="Arial", size=10)
    cv.fill          = PatternFill("solid", fgColor=AZUL_CLARO)
    cv.alignment     = Alignment(horizontal="right", vertical="center")
    cv.border        = borda_fina()

    wr.merge_cells(f"F{row}:H{row}")
    co = wr[f"F{row}"]
    co.value     = obs
    co.font      = Font(name="Arial", italic=True, color="595959", size=9)
    co.fill      = PatternFill("solid", fgColor=BRANCO)
    co.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    co.border    = borda_fina()
    row += 1

# ── LEGENDA ───────────────────────────────────────────────────────────────────
row += 1
secao(wr, row, "LEGENDA E INSTRUÇÕES")

row += 1
legenda = [
    (VERDE_CLARO,  "Ativável CONSERVADOR: amortização e custos de aquisição com risco fiscal mínimo."),
    (AMARELO,      "Ativável AMPLO: inclui juros e seguros obrigatórios. Amparado por IN RFB 84/2001."),
    (LARANJA,      "⚠ Risco ALTO: itens sem nota fiscal ou com classificação a revisar."),
    (CINZA,        "Para novos lançamentos de obra, use sempre a aba Lancamentos — totais atualizam automaticamente."),
]
for fill, texto in legenda:
    wr.row_dimensions[row].height = 22
    wr.merge_cells(f"A{row}:H{row}")
    c = wr[f"A{row}"]
    c.value     = texto
    c.font      = Font(name="Arial", size=9)
    c.fill      = PatternFill("solid", fgColor=fill)
    c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    c.border    = borda_fina()
    row += 1

# ── LARGURAS ──────────────────────────────────────────────────────────────────
wr.column_dimensions["A"].width = 2
wr.column_dimensions["B"].width = 2
wr.column_dimensions["C"].width = 44
wr.column_dimensions["D"].width = 22
wr.column_dimensions["E"].width = 22
wr.column_dimensions["F"].width = 8
wr.column_dimensions["G"].width = 8
wr.column_dimensions["H"].width = 30

wb.save('/mnt/user-data/outputs/Controle_Gastos_Obra_Pro_IR.xlsx')
print(f"Salvo. Linha do total na Financiamento_IR: {r_tot}")
print(f"Linha do TOTAL ATIVÁVEL na Custo_Total_Imovel: 22")
