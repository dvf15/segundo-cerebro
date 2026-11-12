"""
Refaz a aba 5_DIRPF_2026 com os novos valores (sem aluguel inflando custos).
"""
from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Estilos
FONT_TITLE = Font(name="Arial", size=14, bold=True, color="FFFFFF")
FONT_HEADER = Font(name="Arial", size=10, bold=True, color="FFFFFF")
FONT_BODY = Font(name="Arial", size=10)
FONT_BOLD = Font(name="Arial", size=10, bold=True)
FONT_INPUT = Font(name="Arial", size=10, color="0000FF")
FONT_FORMULA = Font(name="Arial", size=10, color="000000")
FONT_NOTE = Font(name="Arial", size=9, italic=True, color="666666")

FILL_TITLE = PatternFill("solid", fgColor="1F4E78")
FILL_HEADER = PatternFill("solid", fgColor="2E75B6")
FILL_INPUT = PatternFill("solid", fgColor="FFF2CC")
FILL_HIGHLIGHT = PatternFill("solid", fgColor="E2EFDA")
FILL_SECTION = PatternFill("solid", fgColor="D9E1F2")
FILL_BR = PatternFill("solid", fgColor="C6EFCE")

BORDER_THIN = Border(
    left=Side(style="thin", color="BFBFBF"),
    right=Side(style="thin", color="BFBFBF"),
    top=Side(style="thin", color="BFBFBF"),
    bottom=Side(style="thin", color="BFBFBF"),
)

ALIGN_CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)
ALIGN_LEFT = Alignment(horizontal="left", vertical="center", wrap_text=True)

fmt_money = '_-"R$" * #,##0.0000_-;-"R$" * #,##0.0000_-;_-"R$" * "-"??_-;_-@_-'
fmt_money2 = '_-"R$" * #,##0.00_-;-"R$" * #,##0.00_-;_-"R$" * "-"??_-;_-@_-'
fmt_qty = "#,##0.00########;-#,##0.00########;-"

dst = "/home/claude/work/Calculadora_Preco_Medio_IR_FINAL_v2.xlsx"

# Lê valores calculados via data_only
wb_calc = load_workbook(dst, data_only=True)
ws3_calc = wb_calc["3_Cálculo"]

def get_movements_2025(ticker):
    compras_qty, compras_val, vendas_qty, vendas_val, bonif_qty = 0, 0, 0, 0, 0
    for r in range(2, 1000):
        tk = ws3_calc.cell(row=r, column=1).value
        if tk != ticker:
            continue
        mov_orig = str(ws3_calc.cell(row=r, column=3).value or "")
        if "Posição Inicial" in mov_orig:
            continue
        tipo = ws3_calc.cell(row=r, column=4).value
        qty = ws3_calc.cell(row=r, column=6).value or 0
        val = ws3_calc.cell(row=r, column=8).value or 0
        if tipo == "COMPRA":
            compras_qty += qty
            compras_val += val
        elif tipo == "VENDA":
            vendas_qty += qty
            vendas_val += val
        elif tipo == "BONIFICACAO":
            bonif_qty += qty
    return compras_qty, compras_val, vendas_qty, vendas_val, bonif_qty

def get_final_position(ticker):
    last_qty, last_cost, last_pm = 0, 0, 0
    for r in range(2, 1000):
        if ws3_calc.cell(row=r, column=1).value == ticker:
            last_qty = ws3_calc.cell(row=r, column=12).value or 0
            last_cost = ws3_calc.cell(row=r, column=13).value or 0
            last_pm = ws3_calc.cell(row=r, column=14).value or 0
    return last_qty, last_cost, last_pm

def br_num(value, decimals=2):
    if value is None or value == 0:
        return "0,00" if decimals == 2 else "0"
    fmt = f"{{:,.{decimals}f}}"
    s = fmt.format(value)
    s = s.replace(",", "X").replace(".", ",").replace("X", ".")
    return s

def br_qty(value):
    if value is None:
        return "0"
    if abs(value - round(value)) < 0.001:
        return br_num(round(value), 0)
    return br_num(value, 2)

# Reabre o WB pra escrita (sem data_only)
wb = load_workbook(dst)
if "5_DIRPF_2026" in wb.sheetnames:
    del wb["5_DIRPF_2026"]

ws5 = wb.create_sheet("5_DIRPF_2026")

# Cabeçalho
ws5.merge_cells("A1:R1")
ws5["A1"] = "DIRPF 2026 (Ano-Calendário 2025) - Ficha Bens e Direitos"
ws5["A1"].font = FONT_TITLE
ws5["A1"].fill = FILL_TITLE
ws5["A1"].alignment = ALIGN_CENTER
ws5.row_dimensions[1].height = 28

ws5.merge_cells("A2:R2")
ws5["A2"] = ("Mesmo formato da base histórica. Operações classificadas como aluguel/BTC foram ignoradas no cálculo "
             "(não afetam custo médio). Coluna I = descritivo histórico (informativo); coluna R = NOVO descritivo gerado.")
ws5["A2"].font = FONT_NOTE
ws5["A2"].alignment = ALIGN_LEFT
ws5.row_dimensions[2].height = 30

headers = [
    "Ticker", "Empresa", "CNPJ / ID", "Mercado", "Bem nº (DIRPF)",
    "Qtd em 31/12/2024", "Custo Total 31/12/2024 (R$)", "Preço Médio 31/12/2024 (R$)",
    "Descritivo histórico (DIRPF 2025 / AC 2024)",
    "Compras 2025 - Qtd", "Compras 2025 - Valor (R$)",
    "Vendas 2025 - Qtd", "Vendas 2025 - Valor (R$)",
    "Bonif./Desdobr. 2025 - Qtd",
    "Qtd em 31/12/2025", "Custo Total 31/12/2025 (R$)", "Preço Médio 31/12/2025 (R$)",
    "Descritivo NOVO para DIRPF 2026 (AC 2025)",
]
for i, h in enumerate(headers, start=1):
    c = ws5.cell(row=3, column=i, value=h)
    c.font = FONT_HEADER
    c.fill = FILL_HEADER
    c.alignment = ALIGN_CENTER
    c.border = BORDER_THIN

widths = [8, 30, 22, 14, 8, 14, 16, 14, 60, 12, 14, 12, 14, 14, 14, 16, 14, 80]
for i, w in enumerate(widths, start=1):
    ws5.column_dimensions[get_column_letter(i)].width = w
ws5.row_dimensions[3].height = 38

historical = [
    {'ticker': 'ITSA4', 'empresa': 'ITAUSA S.A.', 'cnpj': '61.532.644/0001-15',
     'mercado': 'Brasil (B3)', 'bem': 4, 'qty24': 8449.35, 'cost24': 91754.62,
     'desc_hist': '8.449,35 ACOES DE ITAUSA, CODIGO DE NEGOCIACAO ITSA4. CUSTO TOTAL DE R$ 91.754,62 PRECO MEDIO DE 10,86 JA CONSIDERANDO BONIFICACOES E SUBSCRICOES.'},
    {'ticker': 'TOTS3', 'empresa': 'TOTVS S.A.', 'cnpj': '53.113.791/0001-22',
     'mercado': 'Brasil (B3)', 'bem': 5, 'qty24': 0, 'cost24': 0,
     'desc_hist': '400 ACOES DE TOTVS, CODIGO DE NEGOCIACAO TOTS3. CUSTO TOTAL DE R$ 6.933,33 PRECO 17,33. POSICAO ZERADA EM 31/05/24 A 28,73, TOTAL R$ 11.492.'},
    {'ticker': 'CMIG4', 'empresa': 'CEMIG', 'cnpj': '17.155.730/0001-64',
     'mercado': 'Brasil (B3)', 'bem': 7, 'qty24': 2748, 'cost24': 21134.00,
     'desc_hist': '2.748 ACOES DE CEMIG, CODIGO DE NEGOCIACAO CMIG4. CUSTO TOTAL DE R$ 21.134,00, PRECO MEDIO 7,69.'},
    {'ticker': 'SAPR11', 'empresa': 'SANEPAR', 'cnpj': '02.332.886/0001-04',
     'mercado': 'Brasil (B3)', 'bem': 8, 'qty24': 1279, 'cost24': 27080.00,
     'desc_hist': '1.279 ACOES DE SANEPAR, CODIGO DE NEGOCIACAO SAPR11. CUSTO TOTAL DE R$ 27.080,00. CORRETORA XP INVESTIMENTOS CCTVM S/A, PRECO MEDIO 21,17.'},
    {'ticker': 'KLBN4', 'empresa': 'KLABIN S.A.', 'cnpj': '89.637.490/0001-45',
     'mercado': 'Brasil (B3)', 'bem': 11, 'qty24': 5024, 'cost24': 21106.92,
     'desc_hist': '5.024 ACOES DE KLABIN SA, CODIGO DE NEGOCIACAO KLBN4. CUSTO TOTAL DE R$ 21.106,92, PRECO MEDIO 4,20. CORRETORA XP INVESTIMENTOS CCTVM S/A.'},
    {'ticker': 'TAEE11', 'empresa': 'TAESA - Transmissora Aliança', 'cnpj': '07.859.971/0001-30',
     'mercado': 'Brasil (B3)', 'bem': 18, 'qty24': 750, 'cost24': 26081.00,
     'desc_hist': '750 ACOES DA TAESA, COD TAEE11. CUSTO TOTAL DE R$ 26.081. ITAU CORRETORA, PRECO MEDIO 34,77.'},
    {'ticker': 'ALOS3', 'empresa': 'ALLOS S.A. (matching 2023, em vesting 3 anos)',
     'cnpj': '05.878.397/0001-32', 'mercado': 'Brasil (B3)', 'bem': 19,
     'qty24': 24310, 'cost24': 606534.50,
     'desc_hist': '24.310 ACOES DA ALLOS (ALOS3) (SENDO 12.155 ADQUIRIDAS EM 26 DE JULHO DE 2023 E 12.155 A TITULO DE MATCHING) A PRECO DE R$24,95 = R$ 606.534,50. CONFORME EMAIL MARINA CALVAO 17 DE MAIO DE 2024. ACOES EM CUSTODIA COM VESTING DE 3 ANOS A PARTIR DA AQUISICAO.',
     'no_change_2025': True},
    {'ticker': 'ALOS3', 'empresa': 'ALLOS S.A. (convertidas de BRMALLS - BRML3)',
     'cnpj': '05.878.397/0001-32', 'mercado': 'Brasil (B3)', 'bem': 20,
     'qty24': 8708, 'cost24': 185354.50,
     'desc_hist': '8.708 ACOES DA ALLOS (ALOS3) CONVERTIDAS DAS ACOES DA BRMALLS (BRML3) A UM CUSTO MEDIO DE R$ 21,28, TOTALIZANDO R$ 185.354,50. SALDO DEPOIS DE VENDAS EM 2024 DENTRO DOS R$ 20.000/MES, A CUSTO MEDIO DE R$ 21,28.',
     'is_alos3_bem20': True},
    {'ticker': 'ALOS3', 'empresa': 'ALLOS S.A. (matching 2024, em vesting 3 anos)',
     'cnpj': '05.878.397/0001-32', 'mercado': 'Brasil (B3)', 'bem': 42,
     'qty24': 10902, 'cost24': 257605.92,
     'desc_hist': '10.902 ACOES DA ALLOS (ALOS3) (SENDO 5.451 PRECO 24,20 ADQUIRIDAS EM 11 DE ABRIL DE 2024 E 5.451 PRECO 23,32 A TITULO DE MATCHING) PONDERADO A PRECO DE R$23,76 = R$ 257.605,92. CONFORME EMAIL MARINA CALVAO 16 DE MAIO DE 2025. ACOES EM CUSTODIA COM VESTING DE 3 ANOS A PARTIR DA AQUISICAO.',
     'no_change_2025': True},
    {'ticker': 'BBSE3', 'empresa': 'BB SEGURIDADE PARTICIPACOES S.A.', 'cnpj': '17.344.597/0001-94',
     'mercado': 'Brasil (B3)', 'bem': 48, 'qty24': 850, 'cost24': 28126.00,
     'desc_hist': '850 ACOES DE BB SEGURIDADE PARTICIPACOES S.A., CODIGO DE NEGOCIACAO BBSE3. CUSTO TOTAL DE R$ 28.126 PRECO 33,09.'},
    {'ticker': 'AURE3', 'empresa': 'AUREN ENERGIA S.A.', 'cnpj': '28.594.234/0001-23',
     'mercado': 'Brasil (B3)', 'bem': 1124, 'qty24': 1700, 'cost24': 21236.00,
     'desc_hist': '1.700 ACOES DE AUREN, CODIGO DE NEGOCIACAO AURE3. CUSTO TOTAL DE R$ 21.236. CORRETORA XP INVESTIMENTOS CCTVM S/A, PRECO MEDIO 12,49.'},
    {'ticker': 'BBDC4', 'empresa': 'BANCO BRADESCO S.A.', 'cnpj': '60.746.948/0001-12',
     'mercado': 'Brasil (B3)', 'bem': 1125, 'qty24': 5211, 'cost24': 70406.00,
     'desc_hist': '5.211 ACOES DE BANCO BRADESCO SA, CODIGO DE NEGOCIACAO BBDC4. CUSTO TOTAL DE R$ 70.406. CORRETORA XP INVESTIMENTOS CCTVM S/A, PRECO MEDIO 13,51.'},
]

row_excel = 4
for item in historical:
    ticker = item['ticker']
    is_alos3_b20 = item.get('is_alos3_bem20', False)
    no_change = item.get('no_change_2025', False)
    
    if no_change:
        comp_qty, comp_val, vend_qty, vend_val, bonif_qty = 0, 0, 0, 0, 0
        qty_25, cost_25 = item['qty24'], item['cost24']
    elif ticker == 'TOTS3':
        comp_qty, comp_val, vend_qty, vend_val, bonif_qty = 0, 0, 0, 0, 0
        qty_25, cost_25 = 0, 0
    else:
        comp_qty, comp_val, vend_qty, vend_val, bonif_qty = get_movements_2025(ticker)
        qty_25, cost_25, _ = get_final_position(ticker)
    
    pm_25 = cost_25 / qty_25 if qty_25 > 0 else 0
    
    ws5.cell(row=row_excel, column=1, value=ticker)
    ws5.cell(row=row_excel, column=2, value=item['empresa'])
    ws5.cell(row=row_excel, column=3, value=item['cnpj'])
    ws5.cell(row=row_excel, column=4, value=item['mercado'])
    ws5.cell(row=row_excel, column=5, value=item['bem'])
    ws5.cell(row=row_excel, column=6, value=item['qty24'])
    ws5.cell(row=row_excel, column=7, value=item['cost24'])
    ws5.cell(row=row_excel, column=8, value=f"=IF(F{row_excel}>0,G{row_excel}/F{row_excel},0)")
    ws5.cell(row=row_excel, column=9, value=item['desc_hist'])
    ws5.cell(row=row_excel, column=10, value=comp_qty)
    ws5.cell(row=row_excel, column=11, value=comp_val)
    ws5.cell(row=row_excel, column=12, value=vend_qty)
    ws5.cell(row=row_excel, column=13, value=vend_val)
    ws5.cell(row=row_excel, column=14, value=bonif_qty)
    ws5.cell(row=row_excel, column=15, value=qty_25)
    ws5.cell(row=row_excel, column=16, value=cost_25)
    ws5.cell(row=row_excel, column=17, value=f"=IF(O{row_excel}>0,P{row_excel}/O{row_excel},0)")
    
    qty_str = br_qty(qty_25)
    cost_str = br_num(cost_25, 2)
    pm_str = br_num(pm_25, 2)
    
    if no_change:
        new_desc = item['desc_hist'] + " SEM MOVIMENTACAO EM 2025 (VESTING). POSICAO EM 31/12/2025 IDENTICA A 31/12/2024."
    elif ticker == 'TOTS3':
        new_desc = item['desc_hist'] + " POSICAO ZERADA EM 31/12/2025."
    elif is_alos3_b20:
        new_desc = (
            f"{qty_str} ACOES DA ALLOS (ALOS3) - SALDO REMANESCENTE DAS ACOES CONVERTIDAS DAS ACOES DA BRMALLS (BRML3) "
            f"A CUSTO MEDIO DE R$ {pm_str}, TOTALIZANDO R$ {cost_str}. "
            f"VENDAS EM 2025 DENTRO DO LIMITE DE R$ 20.000/MES (ISENTAS DE IR), "
            f"TOTAL VENDIDO {br_qty(vend_qty)} ACOES POR R$ {br_num(vend_val, 2)}. "
            f"CUSTO MEDIO MANTIDO."
        )
    elif ticker == 'ITSA4':
        # Movimentação real 2025: compras + subscrição + bonificação + remoção fração
        new_desc = (
            f"{qty_str} ACOES DE ITAUSA, CODIGO DE NEGOCIACAO ITSA4. "
            f"CUSTO TOTAL DE R$ {cost_str} PRECO MEDIO DE R$ {pm_str}. "
            f"MOVIMENTACAO 2025: COMPRAS DE 6.500 ACOES POR R$ 58.890,00 EM 21/01/2025 "
            f"E 8.738 ACOES POR R$ 84.845,98 EM 26/03/2025; "
            f"EXERCICIO DE 220 DIREITOS DE SUBSCRICAO (ITSA2) POR R$ 1.474,00 EM 28/05/2025; "
            f"BONIFICACAO DE 303,38 ACOES SEM CUSTO INFORMADO EM 22/12/2025; "
            f"REMOCAO DE FRACAO DE 0,35 ACAO EM 06/01/2025."
        )
    elif ticker == 'CMIG4':
        new_desc = (
            f"{qty_str} ACOES DE CEMIG, CODIGO DE NEGOCIACAO CMIG4. "
            f"CUSTO TOTAL DE R$ {cost_str}, PRECO MEDIO R$ {pm_str}. "
            f"SEM MOVIMENTACAO RELEVANTE EM 2025 (APENAS DIVIDENDOS/JCP E ALUGUEL DE ACOES, "
            f"QUE NAO ALTERAM CUSTO MEDIO)."
        )
    elif ticker == 'BBDC4':
        new_desc = (
            f"{qty_str} ACOES DE BANCO BRADESCO SA, CODIGO DE NEGOCIACAO BBDC4. "
            f"CUSTO TOTAL DE R$ {cost_str}, PRECO MEDIO R$ {pm_str}. "
            f"CORRETORA XP INVESTIMENTOS CCTVM S/A. "
            f"SEM MOVIMENTACAO RELEVANTE EM 2025 (APENAS DIVIDENDOS/JCP E ALUGUEL DE ACOES, "
            f"QUE NAO ALTERAM CUSTO MEDIO)."
        )
    elif ticker == 'KLBN4':
        new_desc = (
            f"{qty_str} ACOES DE KLABIN SA, CODIGO DE NEGOCIACAO KLBN4. "
            f"CUSTO TOTAL DE R$ {cost_str}, PRECO MEDIO R$ {pm_str}. "
            f"CORRETORA XP INVESTIMENTOS CCTVM S/A. "
            f"BONIFICACAO DE {br_qty(bonif_qty)} ACOES EM 19/12/2025 SEM CUSTO INFORMADO, "
            f"REDUZIU O PRECO MEDIO PROPORCIONALMENTE."
        )
    else:
        new_desc = item['desc_hist'].replace(
            f"{br_num(item['qty24'], 0)} ACOES",
            f"{qty_str} ACOES",
            1
        )
        if "SEM MOVIMENTACAO" not in new_desc:
            new_desc += " SEM MOVIMENTACAO RELEVANTE EM 2025 (APENAS DIVIDENDOS/JCP)."
    
    ws5.cell(row=row_excel, column=18, value=new_desc)
    
    for c in range(1, 19):
        cell = ws5.cell(row=row_excel, column=c)
        cell.border = BORDER_THIN
        cell.font = FONT_FORMULA
        cell.alignment = Alignment(horizontal="center" if c not in [2, 9, 18] else "left",
                                    vertical="center", wrap_text=True)
    
    ws5.cell(row=row_excel, column=4).fill = FILL_BR
    ws5.cell(row=row_excel, column=6).number_format = fmt_qty
    ws5.cell(row=row_excel, column=7).number_format = fmt_money2
    ws5.cell(row=row_excel, column=8).number_format = fmt_money
    ws5.cell(row=row_excel, column=10).number_format = fmt_qty
    ws5.cell(row=row_excel, column=11).number_format = fmt_money2
    ws5.cell(row=row_excel, column=12).number_format = fmt_qty
    ws5.cell(row=row_excel, column=13).number_format = fmt_money2
    ws5.cell(row=row_excel, column=14).number_format = fmt_qty
    ws5.cell(row=row_excel, column=15).number_format = fmt_qty
    ws5.cell(row=row_excel, column=16).number_format = fmt_money2
    ws5.cell(row=row_excel, column=17).number_format = fmt_money
    
    for c in [15, 16, 17, 18]:
        ws5.cell(row=row_excel, column=c).fill = FILL_HIGHLIGHT
    ws5.row_dimensions[row_excel].height = 80
    row_excel += 1

total_row = row_excel
ws5.cell(row=total_row, column=1, value="TOTAL")
ws5.cell(row=total_row, column=7, value=f"=SUM(G4:G{total_row-1})")
ws5.cell(row=total_row, column=11, value=f"=SUM(K4:K{total_row-1})")
ws5.cell(row=total_row, column=13, value=f"=SUM(M4:M{total_row-1})")
ws5.cell(row=total_row, column=16, value=f"=SUM(P4:P{total_row-1})")

for c in range(1, 19):
    cell = ws5.cell(row=total_row, column=c)
    cell.border = BORDER_THIN
    cell.font = FONT_BOLD
    cell.fill = FILL_SECTION
ws5.cell(row=total_row, column=7).number_format = fmt_money2
ws5.cell(row=total_row, column=11).number_format = fmt_money2
ws5.cell(row=total_row, column=13).number_format = fmt_money2
ws5.cell(row=total_row, column=16).number_format = fmt_money2

ws5.freeze_panes = "F4"
ws5.sheet_view.showGridLines = False

# Reordenar
order = ["1_Instruções", "2_Extrato_B3", "3_Cálculo", "4_Resumo_IR", "5_DIRPF_2026"]
for i, name in enumerate(order):
    if name in wb.sheetnames:
        idx = wb.sheetnames.index(name)
        wb.move_sheet(name, offset=i - idx)

wb.save(dst)
print(f"Saved: {dst}")
