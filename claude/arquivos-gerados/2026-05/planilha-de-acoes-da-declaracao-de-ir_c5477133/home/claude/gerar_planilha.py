from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = Workbook()
ws = wb.active
ws.title = "Controle Acoes"

# Estilos
header_font = Font(name='Arial', bold=True, color='FFFFFF', size=10)
header_fill = PatternFill('solid', start_color='1F4E78')
header_align = Alignment(horizontal='center', vertical='center', wrap_text=True)

input_font = Font(name='Arial', color='0000FF', size=10)  # azul = input (da declaracao / B3)
formula_font = Font(name='Arial', color='000000', size=10)  # preto = formula
text_font = Font(name='Arial', color='000000', size=10)
yellow_fill = PatternFill('solid', start_color='FFF2CC')  # amarelo claro = preencher com B3
section_fill_br = PatternFill('solid', start_color='E2EFDA')  # verde claro Brasil
section_fill_ex = PatternFill('solid', start_color='FCE4D6')  # laranja claro Exterior

thin = Side(border_style='thin', color='BFBFBF')
border = Border(left=thin, right=thin, top=thin, bottom=thin)

# Cabecalhos
headers = [
    "Ticker",                       # A
    "Empresa",                      # B
    "CNPJ / ID",                    # C
    "Mercado",                      # D
    "Bem nº (DIRPF)",               # E
    "Qtd em 31/12/2024",            # F  (input, declaracao)
    "Custo Total 31/12/2024 (R$)",  # G  (input, declaracao)
    "Preço Médio 31/12/2024 (R$)",  # H  (formula = G/F)
    "Descritivo histórico (DIRPF 2025 / AC 2024)",  # I
    # --- complementar com dados B3 ano seguinte (2025) ---
    "Compras 2025 - Qtd",           # J  (preencher com B3)
    "Compras 2025 - Valor (R$)",    # K
    "Vendas 2025 - Qtd",            # L
    "Vendas 2025 - Valor (R$)",     # M
    "Bonif./Desdobr. 2025 - Qtd",   # N
    "Qtd em 31/12/2025",            # O  (formula)
    "Custo Total 31/12/2025 (R$)",  # P  (formula)
    "Preço Médio 31/12/2025 (R$)",  # Q  (formula)
    "Observações 2025",             # R
]

for col_idx, h in enumerate(headers, start=1):
    c = ws.cell(row=1, column=col_idx, value=h)
    c.font = header_font
    c.fill = header_fill
    c.alignment = header_align
    c.border = border

ws.row_dimensions[1].height = 45

# Dados das acoes - extraidos da DIRPF
# (ticker, empresa, cnpj, mercado, bem_nr, qtd, custo_total, descritivo)
acoes = [
    # --- BRASIL ---
    ("ITSA4", "ITAUSA S.A.", "61.532.644/0001-15", "Brasil (B3)", "4",
     8449.35, 91754.62,
     "8.449,35 ACOES DE ITAUSA, CODIGO DE NEGOCIACAO ITSA4. CUSTO TOTAL DE R$ 91.754,62 PRECO MEDIO DE 10,86 JA CONSIDERANDO BONIFICACOES E SUBSCRICOES."),
    ("TOTS3", "TOTVS S.A.", "53.113.791/0001-22", "Brasil (B3)", "5",
     0, 0,
     "400 ACOES DE TOTVS, CODIGO DE NEGOCIACAO TOTS3. CUSTO TOTAL DE R$ 6.933,33 PRECO 17,33. POSICAO ZERADA EM 31/05/24 A 28,73, TOTAL R$ 11.492."),
    ("CMIG4", "CEMIG", "17.155.730/0001-64", "Brasil (B3)", "7",
     2748, 21134.00,
     "2.748 ACOES DE CEMIG, CODIGO DE NEGOCIACAO CMIG4. CUSTO TOTAL DE R$ 21.134,00, PRECO MEDIO 7,69."),
    ("SAPR11", "SANEPAR", "02.332.886/0001-04", "Brasil (B3)", "8",
     1279, 27080.00,
     "1.279 ACOES DE SANEPAR, CODIGO DE NEGOCIACAO SAPR11. CUSTO TOTAL DE R$ 27.080,00. CORRETORA XP INVESTIMENTOS CCTVM S/A, PRECO MEDIO 21,17."),
    ("KLBN4", "KLABIN S.A.", "89.637.490/0001-45", "Brasil (B3)", "11",
     5024, 21106.92,
     "5.024 ACOES DE KLABIN SA, CODIGO DE NEGOCIACAO KLBN4. CUSTO TOTAL DE R$ 21.106,92, PRECO MEDIO 4,20. CORRETORA XP INVESTIMENTOS CCTVM S/A."),
    ("TAEE11", "TAESA - Transmissora Aliança", "07.859.971/0001-30", "Brasil (B3)", "18",
     750, 26081.00,
     "750 ACOES DA TAESA, COD TAEE11. CUSTO TOTAL DE R$ 26.081. ITAU CORRETORA, PRECO MEDIO 34,77."),
    ("ALOS3", "ALLOS S.A. (matching 2023, em vesting 3 anos)", "05.878.397/0001-32", "Brasil (B3)", "19",
     24310, 606534.50,
     "24.310 ACOES DA ALLOS (ALOS3) (SENDO 12.155 ADQUIRIDAS EM 26 DE JULHO DE 2023 E 12.155 A TITULO DE MATCHING) A PRECO DE R$24,95 = R$ 606.534,50. CONFORME EMAIL MARINA CALVAO 17 DE MAIO DE 2024. ACOES EM CUSTODIA COM VESTING DE 3 ANOS A PARTIR DA AQUISICAO."),
    ("ALOS3", "ALLOS S.A. (convertidas de BRMALLS - BRML3)", "05.878.397/0001-32", "Brasil (B3)", "20",
     8708, 185354.50,
     "8.708 ACOES DA ALLOS (ALOS3) CONVERTIDAS DAS ACOES DA BRMALLS (BRML3) A UM CUSTO MEDIO DE R$ 21,28, TOTALIZANDO R$ 185.354,50. SALDO DEPOIS DE VENDAS EM 2024 DENTRO DOS R$ 20.000/MES, A CUSTO MEDIO DE R$ 21,28."),
    ("ALOS3", "ALLOS S.A. (matching 2024, em vesting 3 anos)", "05.878.397/0001-32", "Brasil (B3)", "42",
     10902, 257605.92,
     "10.902 ACOES DA ALLOS (ALOS3) (SENDO 5.451 PRECO 24,20 ADQUIRIDAS EM 11 DE ABRIL DE 2024 E 5.451 PRECO 23,32 A TITULO DE MATCHING) PONDERADO A PRECO DE R$23,76 = R$ 257.605,92. CONFORME EMAIL MARINA CALVAO 16 DE MAIO DE 2025. ACOES EM CUSTODIA COM VESTING DE 3 ANOS A PARTIR DA AQUISICAO."),
    ("BBSE3", "BB SEGURIDADE PARTICIPACOES S.A.", "17.344.597/0001-94", "Brasil (B3)", "48",
     850, 28126.00,
     "850 ACOES DE BB SEGURIDADE PARTICIPACOES S.A., CODIGO DE NEGOCIACAO BBSE3. CUSTO TOTAL DE R$ 28.126 PRECO 33,09."),
    ("AURE3", "AUREN ENERGIA S.A.", "28.594.234/0001-23", "Brasil (B3)", "1124",
     1700, 21236.00,
     "1.700 ACOES DE AUREN, CODIGO DE NEGOCIACAO AURE3. CUSTO TOTAL DE R$ 21.236. CORRETORA XP INVESTIMENTOS CCTVM S/A, PRECO MEDIO 12,49."),
    ("BBDC4", "BANCO BRADESCO S.A.", "60.746.948/0001-12", "Brasil (B3)", "1125",
     5211, 70406.00,
     "5.211 ACOES DE BANCO BRADESCO SA, CODIGO DE NEGOCIACAO BBDC4. CUSTO TOTAL DE R$ 70.406. CORRETORA XP INVESTIMENTOS CCTVM S/A, PRECO MEDIO 13,51."),
]

# Escreve linhas
for i, row in enumerate(acoes, start=2):
    ticker, empresa, cnpj, mercado, bem_nr, qtd, custo, descritivo = row
    is_brasil = mercado.startswith("Brasil")
    fill_section = section_fill_br if is_brasil else section_fill_ex

    ws.cell(row=i, column=1, value=ticker).font = Font(name='Arial', bold=True, size=10)
    ws.cell(row=i, column=2, value=empresa).font = text_font
    ws.cell(row=i, column=3, value=cnpj).font = text_font
    ws.cell(row=i, column=4, value=mercado).font = text_font
    ws.cell(row=i, column=5, value=bem_nr).font = text_font

    # Inputs (azul) - dados da declaracao
    c_qtd = ws.cell(row=i, column=6, value=qtd)
    c_qtd.font = input_font
    c_qtd.number_format = '#,##0.00000'

    c_custo = ws.cell(row=i, column=7, value=custo)
    c_custo.font = input_font
    c_custo.number_format = 'R$ #,##0.00;[Red](R$ #,##0.00);"-"'

    # Preco medio = G/F (formula, com protecao contra divisao por zero)
    c_pm = ws.cell(row=i, column=8, value=f'=IF(F{i}=0,0,G{i}/F{i})')
    c_pm.font = formula_font
    c_pm.number_format = 'R$ #,##0.0000;[Red](R$ #,##0.0000);"-"'

    c_desc = ws.cell(row=i, column=9, value=descritivo)
    c_desc.font = text_font
    c_desc.alignment = Alignment(wrap_text=True, vertical='top')

    # Colunas a serem preenchidas com B3 (amarelo claro)
    for col in range(10, 15):  # J, K, L, M, N
        cell = ws.cell(row=i, column=col, value=None)
        cell.font = input_font
        cell.fill = yellow_fill
        if col in (10, 12, 14):  # qtd
            cell.number_format = '#,##0.00000'
        else:
            cell.number_format = 'R$ #,##0.00;[Red](R$ #,##0.00);"-"'

    # Qtd 31/12/2025 = F + J - L + N
    c_qtd25 = ws.cell(row=i, column=15, value=f'=F{i}+IFERROR(J{i},0)-IFERROR(L{i},0)+IFERROR(N{i},0)')
    c_qtd25.font = formula_font
    c_qtd25.number_format = '#,##0.00000'

    # Custo Total 31/12/2025: ajuste pelo metodo do preco medio
    # custo_novo = custo_antigo + compras - (vendas_qtd * preco_medio_antigo)
    c_custo25 = ws.cell(row=i, column=16,
        value=f'=G{i}+IFERROR(K{i},0)-IFERROR(L{i},0)*H{i}')
    c_custo25.font = formula_font
    c_custo25.number_format = 'R$ #,##0.00;[Red](R$ #,##0.00);"-"'

    # Preco medio 2025
    c_pm25 = ws.cell(row=i, column=17, value=f'=IF(O{i}=0,0,P{i}/O{i})')
    c_pm25.font = formula_font
    c_pm25.number_format = 'R$ #,##0.0000;[Red](R$ #,##0.0000);"-"'

    c_obs = ws.cell(row=i, column=18, value=None)
    c_obs.font = text_font
    c_obs.alignment = Alignment(wrap_text=True, vertical='top')

    # Aplica preenchimento por mercado nas colunas A-E
    for col in range(1, 6):
        cell = ws.cell(row=i, column=col)
        cell.fill = fill_section
        cell.border = border
        cell.alignment = Alignment(vertical='top', wrap_text=True)

    # Bordas em todas as celulas
    for col in range(1, 19):
        ws.cell(row=i, column=col).border = border
        if col not in range(1, 6):
            ws.cell(row=i, column=col).alignment = Alignment(vertical='top', wrap_text=True)

# Linha de totais
total_row = len(acoes) + 3
ws.cell(row=total_row, column=1, value="TOTAL").font = Font(name='Arial', bold=True, size=10)
ws.cell(row=total_row, column=7, value=f'=SUM(G2:G{len(acoes)+1})').font = Font(name='Arial', bold=True, size=10)
ws.cell(row=total_row, column=7).number_format = 'R$ #,##0.00'
ws.cell(row=total_row, column=16, value=f'=SUM(P2:P{len(acoes)+1})').font = Font(name='Arial', bold=True, size=10)
ws.cell(row=total_row, column=16).number_format = 'R$ #,##0.00'

# Larguras
widths = {
    'A': 10, 'B': 38, 'C': 22, 'D': 16, 'E': 14,
    'F': 16, 'G': 18, 'H': 18, 'I': 60,
    'J': 14, 'K': 18, 'L': 14, 'M': 18, 'N': 16,
    'O': 16, 'P': 20, 'Q': 18, 'R': 30
}
for col, w in widths.items():
    ws.column_dimensions[col].width = w

# Freeze panes
ws.freeze_panes = 'F2'

# Aba 2 - Legenda / Notas
ws2 = wb.create_sheet("Legenda e Notas")
notas = [
    ("LEGENDA E NOTAS DE USO", ""),
    ("", ""),
    ("Cor azul (texto)", "Valor de input - extraido da DIRPF 2025 (ano-calendario 2024) ou a ser preenchido com dados da B3 do ano seguinte"),
    ("Cor preta (texto)", "Valor calculado por formula"),
    ("Fundo amarelo claro", "Celula a preencher com dados de movimentacao do proximo ano (B3 / corretora)"),
    ("Fundo verde claro (col A-E)", "Acao listada no Brasil (B3)"),
    ("", ""),
    ("FORMULAS UTILIZADAS", ""),
    ("Preço Médio 31/12/2024 (col H)", "Custo Total / Quantidade"),
    ("Qtd 31/12/2025 (col O)", "Qtd 2024 + Compras - Vendas + Bonificacoes/Desdobramentos"),
    ("Custo Total 31/12/2025 (col P)", "Custo 2024 + Valor Compras - (Qtd Vendida x Preco Medio anterior)"),
    ("Preço Médio 31/12/2025 (col Q)", "Custo Total 2025 / Qtd 2025"),
    ("", ""),
    ("OBSERVACOES IMPORTANTES", ""),
    ("1.", "ALOS3 aparece em 3 lotes separados na declaracao (Bens 19, 20 e 42). Mantidos como linhas distintas por terem origens, custos medios e regras de vesting diferentes. Para fins de IR, o preco medio efetivo da posicao livre/negociavel deve considerar a juncao."),
    ("2.", "TOTS3 aparecia em 31/12/2023 mas foi zerada em 2024. Mantida para historico - apagar quando consolidar."),
    ("3.", "BRMALLS (BRML3) foi convertida em ALOS3 - por isso o lote do Bem 20 mantem o custo medio historico de R$ 21,28."),
    ("4.", "Para complementar: importar relatorio anual de movimentacao da B3 (Brasil)."),
]
for i, (a, b) in enumerate(notas, start=1):
    ca = ws2.cell(row=i, column=1, value=a)
    cb = ws2.cell(row=i, column=2, value=b)
    if i == 1:
        ca.font = Font(name='Arial', bold=True, size=12)
    elif a in ("FORMULAS UTILIZADAS", "OBSERVACOES IMPORTANTES"):
        ca.font = Font(name='Arial', bold=True, size=11)
    else:
        ca.font = Font(name='Arial', bold=True, size=10)
    cb.font = Font(name='Arial', size=10)
    cb.alignment = Alignment(wrap_text=True, vertical='top')

ws2.column_dimensions['A'].width = 35
ws2.column_dimensions['B'].width = 100

wb.save('/home/claude/controle_acoes_dirpf2025.xlsx')
print("OK - arquivo gerado")
