from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = Workbook()

# ==================== ABA 1: DETALHE POR BEM ====================
ws1 = wb.active
ws1.title = "Acoes_Detalhe"

headers = [
    "Bem (DIRPF)", "Ticker", "Empresa", "CNPJ", "País",
    "Qtd 31/12/2023", "Custo Total 2023 (R$)",
    "Qtd 31/12/2024", "Custo Total 2024 (R$)", "Preço Médio 2024 (R$)",
    "Compras 2025 (Qtd)", "Compras 2025 (R$)",
    "Vendas 2025 (Qtd)", "Vendas 2025 (R$)",
    "Bonif./Desdobr. 2025", "Outros Eventos 2025",
    "Qtd 31/12/2025", "Custo Total 2025 (R$)", "Preço Médio 2025 (R$)",
    "Descrição/Histórico (DIRPF 2025 - AC 2024)"
]

# Dados extraídos da declaração - ações grupo 03 código 01
# Formato: bem, ticker, empresa, cnpj, pais, qtd23, custo23, qtd24, custo24, pm24, descricao
acoes = [
    # BRASIL
    (4, "ITSA4", "ITAUSA S.A.", "61.532.644/0001-15", "Brasil",
     None, 59022.85, 8449.35, 91754.62, 10.86,
     "8.449,35 ACOES DE ITAUSA, CODIGO DE NEGOCIACAO ITSA4. CUSTO TOTAL DE R$ 91.754,62 PRECO MEDIO DE 10,86 JA CONSIDERANDO BONIFICACOES E SUBSCRICOES"),
    (5, "TOTS3", "TOTVS S.A.", "53.113.791/0001-22", "Brasil",
     400, 6933.33, 0, 0, None,
     "400 ACOES DE TOTVS, CODIGO DE NEGOCIACAO TOTS3. CUSTO TOTAL DE R$ 6.933,33 PRECO 17,33. POSICAO ZERADA EM 31/05/24 A 28,73, TOTAL 11.492."),
    (7, "CMIG4", "CEMIG", "17.155.730/0001-64", "Brasil",
     None, 12922.00, 2748, 21134.00, 7.69,
     "2.748 ACOES DE CEMIG, CODIGO DE NEGOCIACAO CMIG4. CUSTO TOTAL DE R$ 21.134,00, PRECO MEDIO 7,69"),
    (8, "SAPR11", "SANEPAR", "02.332.886/0001-04", "Brasil",
     None, 19740.00, 1279, 27080.00, 21.17,
     "1.279 ACOES DE SANEPAR, CODIGO DE NEGOCIACAO SAPR11. CUSTO TOTAL DE R$ 27.080,00. CORRETORA XP INVESTIMENTOS CCTVM S/A, PRECO MEDIO 21,17"),
    (11, "KLBN4", "KLABIN S.A.", "89.637.490/0001-45", "Brasil",
     None, 12600.13, 5024, 21106.92, 4.20,
     "5.024 ACOES DE KLABIN SA, CODIGO DE NEGOCIACAO KLBN4. CUSTO TOTAL DE R$ 21.106,92, PRECO MEDIO 4,20. CORRETORA XP INVESTIMENTOS CCTVM S/A"),
    (18, "TAEE11", "TAESA", "07.859.971/0001-30", "Brasil",
     750, 25061.40, 750, 26081.00, 34.77,
     "750 ACOES DA TAESA, COD TAEE11100 CUSTO TOTAL DE R$ 26.081. ITAU CORRETORA, PRECO MEDIO 34,77"),
    (19, "ALOS3", "ALLOS S.A. (Matching 2023)", "05.878.397/0001-32", "Brasil",
     24310, 606534.50, 24310, 606534.50, 24.95,
     "24.310 ACOES DA ALLOS (ALOS3) (SENDO 12.155 ADQUIRIDAS EM 26 DE JULHO DE 2023 E 12.155 A TITULO DE MATCHING) A PRECO DE R$24,95 R$ 606.534,50 (CONFORME EMAIL MARINA CALVAO 17 DE MAIO DE 2024, ACOES EM CUSTODIA COM VESTING DE 3 ANOS A PARTIR DA AQUISICAO."),
    (20, "ALOS3", "ALLOS S.A. (Conversão BRMALLS)", "05.878.397/0001-32", "Brasil",
     None, 257068.10, 8708, 185354.50, 21.28,
     "8.708 ACOES DA ALLOS (ALOS3) CONVERTIDAS DAS ACOES DA BRMALLS (BRML3) A UM CUSTO MEDIO DE R$ 21,28, TOTALIZANDO R$ 185.354,50. SALDO DEPOIS DE VENDAS EM 2024 DENTRO DOS R$ 20.000/MES, A CUSTO MEDIO DE R$ 21,28."),
    (42, "ALOS3", "ALLOS S.A. (Matching 2024)", "05.878.397/0001-32", "Brasil",
     0, 0, 10902, 257605.92, 23.63,
     "ACOES DA ALLOS (ALOS3) (SENDO 5.451 (PRECO 24,20) ADQUIRIDAS EM 11 DE ABRIL DE 2024 E 5.451 (PRECO 23,32) A TITULO DE MATCHING) PONDERADO A PRECO DE R$23,76 R$ 257.605,92 (CONFORME EMAIL MARINA CALVAO 16 DE MAIO DE 2025, ACOES EM CUSTODIA COM VESTING DE 3 ANOS A PARTIR DA AQUISICAO)"),
    (48, "BBSE3", "BB SEGURIDADE", "17.344.597/0001-94", "Brasil",
     0, 0, 850, 28126.00, 33.09,
     "850 ACOES DE BB SEGURIDADE PARTICIPACOES S.A., CODIGO DE NEGOCIACAO BBSE3. CUSTO TOTAL DE R$ 28.126 PRECO 33,09"),
    (1124, "AURE3", "AUREN ENERGIA", "28.594.234/0001-23", "Brasil",
     0, 0, 1700, 21236.00, 12.49,
     "1.700 ACOES DE AUREN, CODIGO DE NEGOCIACAO AURE3. CUSTO TOTAL DE R$ 21.236. CORRETORA XP INVESTIMENTOS CCTVM S/A, PRECO MEDIO 12,49"),
    (1125, "BBDC4", "BANCO BRADESCO", "60.746.948/0001-12", "Brasil",
     0, 0, 5211, 70406.00, 13.51,
     "5.211 ACOES DE BANCO BRADESCO SA, CODIGO DE NEGOCIACAO BBDC4. CUSTO TOTAL DE R$ 70.406. CORRETORA XP INVESTIMENTOS CCTVM S/A, PRECO MEDIO 13,51"),
    # EXTERIOR (EUA)
    (14, "INTC", "INTEL CORP", "-", "EUA",
     20, 3334.13, 0, 0, None,
     "INTC INTEL CORP. 20 $ 673.63 R$ 4,9495 R$ 3.334,13 (posição zerada em 2024)"),
    (15, "MMM", "3M COMPANY", "-", "EUA",
     None, 8139.01, 21.65234, 10624.55, 490.69,
     "MMM 3M COMPANY 21,65234 acoes $ 2.182,17 R$ 4,8688 R$ 10.624,55"),
    (16, "NVDA", "NVIDIA CORP", "-", "EUA",
     10, 19241.95, 65, 12505.27, 192.39,
     "NVDA NVIDIA CORPORATION 10 acoes $ 3.903,67 R$ 4,9292 R$ 19.241,95 (em 2023). VENDA POS SPLIT DE 45 ACOES, POSICAO 2024: NVDA 65 acoes $ 2.537,38 R$ 4,9292 R$ 12.507,27"),
    (17, "SHEL", "SHELL PLC", "-", "EUA",
     None, 4843.53, 31.91896, 9803.73, 307.14,
     "SHEL SHELL PLC 31,91896 acoes $ 1.972,39 R$ 4,9705 R$ 9.803,73"),
    (49, "PLTR", "PALANTIR TECH CL.A", "-", "EUA",
     0, 0, 112.4, 13635.14, 121.31,
     "PLTR PALANTIR TECHNOLOGIES INC CLA 112,4 acoes $ 2.583,69 R$ 5,2774 R$ 13.635,14"),
    (50, "TSLA", "TESLA INC", "-", "EUA",
     0, 0, 81.09333, 155734.30, 1920.45,
     "TSLA TESLA INC COM 81,09333 acoes $ 26.559,31 R$ 5,8636 R$ 155.734,30"),
]

# Estilos
header_font = Font(name='Arial', bold=True, color='FFFFFF', size=10)
header_fill = PatternFill('solid', start_color='1F4E78')
header_align = Alignment(horizontal='center', vertical='center', wrap_text=True)
br_fill = PatternFill('solid', start_color='E7F3FF')
us_fill = PatternFill('solid', start_color='FFF2CC')
input_font = Font(name='Arial', color='0000FF', size=10)  # azul = input
formula_font = Font(name='Arial', color='000000', size=10)  # preto = fórmula
default_font = Font(name='Arial', size=10)
thin = Side(border_style='thin', color='B0B0B0')
border = Border(left=thin, right=thin, top=thin, bottom=thin)

# Cabeçalho
for col_idx, h in enumerate(headers, start=1):
    c = ws1.cell(row=1, column=col_idx, value=h)
    c.font = header_font
    c.fill = header_fill
    c.alignment = header_align
    c.border = border

ws1.row_dimensions[1].height = 45

# Dados
for row_idx, acao in enumerate(acoes, start=2):
    bem, ticker, empresa, cnpj, pais, qtd23, custo23, qtd24, custo24, pm24, desc = acao

    row_fill = br_fill if pais == "Brasil" else us_fill

    ws1.cell(row=row_idx, column=1, value=bem)
    ws1.cell(row=row_idx, column=2, value=ticker)
    ws1.cell(row=row_idx, column=3, value=empresa)
    ws1.cell(row=row_idx, column=4, value=cnpj)
    ws1.cell(row=row_idx, column=5, value=pais)
    ws1.cell(row=row_idx, column=6, value=qtd23)
    ws1.cell(row=row_idx, column=7, value=custo23)
    ws1.cell(row=row_idx, column=8, value=qtd24)
    ws1.cell(row=row_idx, column=9, value=custo24)
    # Preço médio 2024 - usar fórmula quando possível
    if qtd24 and qtd24 > 0:
        ws1.cell(row=row_idx, column=10, value=f"=I{row_idx}/H{row_idx}")
    else:
        ws1.cell(row=row_idx, column=10, value=None)

    # Colunas 11-16 ficam em branco (a preencher com dados B3 2025)
    # Coluna 17 = Qtd final 2025 = Qtd 2024 + Compras - Vendas + Bonif
    ws1.cell(row=row_idx, column=17, value=f"=H{row_idx}+K{row_idx}-M{row_idx}+O{row_idx}")
    # Coluna 18 = Custo total 2025 = Custo 2024 + Compras_R$ - (Vendas_Qtd * PM2024) + Outros
    ws1.cell(row=row_idx, column=18, value=f"=I{row_idx}+L{row_idx}-IFERROR(M{row_idx}*J{row_idx},0)+P{row_idx}")
    # Coluna 19 = Preço médio 2025
    ws1.cell(row=row_idx, column=19, value=f"=IFERROR(R{row_idx}/Q{row_idx},0)")
    ws1.cell(row=row_idx, column=20, value=desc)

    for col_idx in range(1, len(headers) + 1):
        c = ws1.cell(row=row_idx, column=col_idx)
        c.border = border
        c.fill = row_fill
        if col_idx == 20:
            c.alignment = Alignment(horizontal='left', vertical='top', wrap_text=True)
        elif col_idx in (3, 4):
            c.alignment = Alignment(horizontal='left', vertical='center')
        else:
            c.alignment = Alignment(horizontal='center', vertical='center')

        # Fontes: azul para inputs (qtd, custo, compras, vendas), preto para fórmulas
        if col_idx in (6, 7, 8, 9, 11, 12, 13, 14, 15, 16):
            c.font = input_font
        elif col_idx in (10, 17, 18, 19):
            c.font = formula_font
        else:
            c.font = default_font

        # Formatação numérica
        if col_idx in (7, 9, 10, 12, 14, 16, 18, 19):  # valores R$
            c.number_format = 'R$ #,##0.00;[Red](R$ #,##0.00);-'
        elif col_idx in (6, 8, 11, 13, 15, 17):  # quantidades
            c.number_format = '#,##0.00######;[Red](#,##0.00######);-'

# Linha total (somente custos)
total_row = len(acoes) + 2
ws1.cell(row=total_row, column=3, value="TOTAL").font = Font(name='Arial', bold=True, size=10)
ws1.cell(row=total_row, column=7, value=f"=SUM(G2:G{total_row-1})")
ws1.cell(row=total_row, column=9, value=f"=SUM(I2:I{total_row-1})")
ws1.cell(row=total_row, column=18, value=f"=SUM(R2:R{total_row-1})")
for col_idx in range(1, len(headers) + 1):
    c = ws1.cell(row=total_row, column=col_idx)
    c.font = Font(name='Arial', bold=True, size=10)
    c.fill = PatternFill('solid', start_color='D9D9D9')
    c.border = border
    if col_idx in (7, 9, 18):
        c.number_format = 'R$ #,##0.00'
        c.alignment = Alignment(horizontal='center')

# Larguras
col_widths = {1:10, 2:10, 3:32, 4:22, 5:10, 6:14, 7:16, 8:14, 9:16, 10:14,
              11:14, 12:14, 13:14, 14:14, 15:16, 16:16, 17:14, 18:16, 19:14, 20:60}
for col_num, w in col_widths.items():
    ws1.column_dimensions[get_column_letter(col_num)].width = w

# Congela painel
ws1.freeze_panes = "C2"

# ==================== ABA 2: CONSOLIDADO POR TICKER ====================
ws2 = wb.create_sheet("Consolidado_Ticker")

headers2 = [
    "Ticker", "Empresa", "País",
    "Qtd 31/12/2024", "Custo Total 2024 (R$)", "Preço Médio 2024 (R$)",
    "Qtd 31/12/2025", "Custo Total 2025 (R$)", "Preço Médio 2025 (R$)",
    "Observação"
]

# Consolida por ticker (somar lotes ALOS3, NVDA etc.)
from collections import defaultdict
consolid = defaultdict(lambda: {"empresa":"", "pais":"", "qtd24":0, "custo24":0, "obs":[]})
for acao in acoes:
    bem, ticker, empresa, cnpj, pais, qtd23, custo23, qtd24, custo24, pm24, desc = acao
    if qtd24 and qtd24 > 0:
        consolid[ticker]["empresa"] = empresa.split(" (")[0]
        consolid[ticker]["pais"] = pais
        consolid[ticker]["qtd24"] += qtd24
        consolid[ticker]["custo24"] += custo24
        if "(" in empresa:
            consolid[ticker]["obs"].append(empresa.split("(")[1].replace(")",""))

for col_idx, h in enumerate(headers2, start=1):
    c = ws2.cell(row=1, column=col_idx, value=h)
    c.font = header_font
    c.fill = header_fill
    c.alignment = header_align
    c.border = border
ws2.row_dimensions[1].height = 45

row_idx = 2
for ticker in sorted(consolid.keys()):
    d = consolid[ticker]
    row_fill = br_fill if d["pais"] == "Brasil" else us_fill
    ws2.cell(row=row_idx, column=1, value=ticker)
    ws2.cell(row=row_idx, column=2, value=d["empresa"])
    ws2.cell(row=row_idx, column=3, value=d["pais"])
    ws2.cell(row=row_idx, column=4, value=d["qtd24"])
    ws2.cell(row=row_idx, column=5, value=d["custo24"])
    ws2.cell(row=row_idx, column=6, value=f"=E{row_idx}/D{row_idx}")
    # Linhas 7-9 ficam em branco para preencher com dados 2025
    ws2.cell(row=row_idx, column=9, value=f"=IFERROR(H{row_idx}/G{row_idx},0)")
    obs = "; ".join(d["obs"]) if d["obs"] else ""
    if len(d["obs"]) > 1:
        obs = f"Consolidação de {len(d['obs'])} lotes: {obs}"
    ws2.cell(row=row_idx, column=10, value=obs)

    for col_idx in range(1, len(headers2)+1):
        c = ws2.cell(row=row_idx, column=col_idx)
        c.border = border
        c.fill = row_fill
        c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
        if col_idx in (4, 5, 7, 8):
            c.font = input_font
        elif col_idx in (6, 9):
            c.font = formula_font
        else:
            c.font = default_font
        if col_idx in (5, 6, 8, 9):
            c.number_format = 'R$ #,##0.00;[Red](R$ #,##0.00);-'
        elif col_idx in (4, 7):
            c.number_format = '#,##0.00######;[Red](#,##0.00######);-'
    row_idx += 1

col_widths2 = {1:10, 2:30, 3:10, 4:16, 5:18, 6:16, 7:16, 8:18, 9:16, 10:50}
for col_num, w in col_widths2.items():
    ws2.column_dimensions[get_column_letter(col_num)].width = w
ws2.freeze_panes = "B2"

# ==================== ABA 3: NOTAS / LEGENDA ====================
ws3 = wb.create_sheet("Notas_Legenda")

notas = [
    ("PLANILHA DE CONTROLE DE PREÇO MÉDIO – AÇÕES", True, 14),
    ("Base: Declaração de Ajuste Anual IRPF 2025 (AC 2024) – Daniel Vieira de Freitas", False, 11),
    ("CPF: 281.409.738-58 | Tipo: Declaração Retificadora | Recibo anterior: 23.26.81.30.47-07", False, 10),
    ("", False, 10),
    ("ESCOPO", True, 12),
    ("Inclui apenas ações (Bens grupo 03 código 01 da DIRPF), Brasil e Exterior.", False, 10),
    ("Ignorados conforme solicitado: imóveis, motocicleta, fundos, ETFs, bonds, tesouro direto, previdência, saldos bancários, JCP a receber.", False, 10),
    ("", False, 10),
    ("LEGENDA DE CORES", True, 12),
    ("Azul (texto)  – Inputs (preencher manualmente, vão atualizar com dados B3 2025)", False, 10),
    ("Preto (texto) – Fórmulas (calculadas automaticamente)", False, 10),
    ("Fundo azul claro  – Ações listadas no Brasil (B3)", False, 10),
    ("Fundo amarelo claro – Ações listadas no Exterior (EUA)", False, 10),
    ("", False, 10),
    ("COMO USAR PARA O ANO-CALENDÁRIO 2025", True, 12),
    ("1. Na aba 'Acoes_Detalhe', preencha as colunas K-P (Compras/Vendas/Bonif./Outros) com base no informe de rendimentos da B3 / corretora.", False, 10),
    ("2. As colunas Q (Qtd 31/12/2025), R (Custo Total 2025) e S (Preço Médio 2025) são calculadas por fórmula.", False, 10),
    ("3. Para vendas, a fórmula assume baixa pelo preço médio anterior (J). Ajuste manualmente se houver casos de FIFO ou regras específicas.", False, 10),
    ("4. ALOS3 está em 3 lotes separados conforme a DIRPF (matching 2023, conversão BRMALLS, matching 2024). Para fins de B3 a posição é única — ver aba 'Consolidado_Ticker'.", False, 10),
    ("5. Para ações no exterior, a Lei 14.754/2023 mudou a tributação a partir de 2024 — verifique enquadramento separadamente.", False, 10),
    ("", False, 10),
    ("OBSERVAÇÕES IMPORTANTES SOBRE OS DADOS DA DIRPF", True, 12),
    ("• ITSA4 (Bem 4): preço médio R$ 10,86 'já considerando bonificações e subscrições' (texto da declaração).", False, 10),
    ("• ALOS3 Bem 19: 12.155 adquiridas + 12.155 matching em 26/jul/2023, vesting de 3 anos. Preço R$ 24,95.", False, 10),
    ("• ALOS3 Bem 20: 8.708 ações vindas de conversão BRMALLS (BRML3), preço médio R$ 21,28.", False, 10),
    ("• ALOS3 Bem 42: 5.451 + 5.451 (matching) adquiridas em 11/abr/2024. Preço médio ponderado R$ 23,76 declarado, mas R$ 257.605,92 / 10.902 = R$ 23,63.", False, 10),
    ("• TOTS3 (Bem 5): posição zerada em 31/05/2024 a R$ 28,73 (total R$ 11.492).", False, 10),
    ("• INTC (Bem 14): posição zerada em 2024.", False, 10),
    ("• NVDA (Bem 16): houve split — venda de 45 ações pós-split, posição final 65 ações.", False, 10),
    ("", False, 10),
    ("DIVERGÊNCIAS DETECTADAS NA DECLARAÇÃO (para conferência)", True, 12),
    ("• ALOS3 Bem 42: declaração diz 'preço médio R$ 23,76' mas R$ 257.605,92 / 10.902 ações = R$ 23,63. Diferença pode ser arredondamento.", False, 10),
    ("• ALOS3 Bem 20: descrição '8708 ACOES' mas custo R$ 185.354,50 / 8.708 = R$ 21,29 (declaração diz R$ 21,28).", False, 10),
    ("• NVDA Bem 16: posição final declarada R$ 12.505,27 (campo 31/12/2024) mas descrição diz R$ 12.507,27. Diferença R$ 2,00.", False, 10),
    ("", False, 10),
    ("Confiança da extração: ~8/10. Recomendo conferir cada linha com seus informes de corretora antes de usar para cálculo fiscal.", True, 10),
]

for i, (txt, bold, size) in enumerate(notas, start=1):
    c = ws3.cell(row=i, column=1, value=txt)
    c.font = Font(name='Arial', bold=bold, size=size)
    c.alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)
ws3.column_dimensions['A'].width = 130

wb.save('/home/claude/IRPF2025_Acoes_PrecoMedio.xlsx')
print("Arquivo criado com sucesso!")
