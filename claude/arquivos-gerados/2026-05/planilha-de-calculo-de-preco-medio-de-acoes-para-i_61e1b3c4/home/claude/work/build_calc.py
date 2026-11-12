"""
Calculadora de Preço Médio - IR Ações B3
Formato baseado no extrato padrão "Movimentação" exportável em XLSX
da Área Logada da B3 (antigo CEI).
"""

from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.comments import Comment
from openpyxl.worksheet.table import Table, TableStyleInfo
from copy import copy

# ===== Estilos comuns =====
FONT_TITLE = Font(name="Arial", size=14, bold=True, color="FFFFFF")
FONT_HEADER = Font(name="Arial", size=10, bold=True, color="FFFFFF")
FONT_BODY = Font(name="Arial", size=10)
FONT_BOLD = Font(name="Arial", size=10, bold=True)
FONT_NOTE = Font(name="Arial", size=9, italic=True, color="666666")
FONT_INPUT = Font(name="Arial", size=10, color="0000FF")     # azul = input
FONT_FORMULA = Font(name="Arial", size=10, color="000000")   # preto = fórmula
FONT_LINK = Font(name="Arial", size=10, color="008000")      # verde = link entre abas

FILL_TITLE = PatternFill("solid", fgColor="1F4E78")
FILL_HEADER = PatternFill("solid", fgColor="2E75B6")
FILL_INPUT_AREA = PatternFill("solid", fgColor="FFF2CC")     # amarelo claro = área de input
FILL_HIGHLIGHT = PatternFill("solid", fgColor="E2EFDA")      # verde claro = output final
FILL_SECTION = PatternFill("solid", fgColor="D9E1F2")

BORDER_THIN = Border(
    left=Side(style="thin", color="BFBFBF"),
    right=Side(style="thin", color="BFBFBF"),
    top=Side(style="thin", color="BFBFBF"),
    bottom=Side(style="thin", color="BFBFBF"),
)

ALIGN_CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)
ALIGN_LEFT = Alignment(horizontal="left", vertical="center", wrap_text=True)
ALIGN_RIGHT = Alignment(horizontal="right", vertical="center")

NUM_ROWS = 1000   # nº de linhas com fórmulas no extrato/cálculo
NUM_TICKERS = 100  # nº de linhas no resumo

wb = Workbook()

# =========================================================
# TAB 1 - INSTRUÇÕES
# =========================================================
ws = wb.active
ws.title = "1_Instruções"

ws.column_dimensions["A"].width = 4
ws.column_dimensions["B"].width = 110

# Título
ws.merge_cells("A1:B1")
ws["A1"] = "Calculadora de Preço Médio para IR - Ações B3"
ws["A1"].font = FONT_TITLE
ws["A1"].fill = FILL_TITLE
ws["A1"].alignment = ALIGN_CENTER
ws.row_dimensions[1].height = 28

instr = [
    ("", ""),
    ("§", "COMO USAR (passo a passo)"),
    ("1", "Acesse o site da B3 (Área Logada do Investidor) → menu Extratos e Informativos → 'Movimentação'."),
    ("2", "Selecione o período desejado (recomendado: desde 01/01 do ano em que começou a investir até 31/12 do ano da declaração) e exporte em Excel (.xlsx)."),
    ("3", "Abra o arquivo da B3, selecione TODAS as linhas de dados (sem o cabeçalho) e copie (Ctrl+C)."),
    ("4", "Vá para a aba '2_Extrato_B3' desta planilha. Clique na célula A2 e cole (Ctrl+V)."),
    ("5", "IMPORTANTE: ordene a aba '2_Extrato_B3' antes de prosseguir. Selecione todos os dados → Dados → Classificar → Classificar por: 'Produto' (crescente), depois Adicionar Nível: 'Data' (crescente, do mais antigo para o mais recente)."),
    ("6", "Vá para a aba '3_Cálculo'. Os preços médios são calculados automaticamente."),
    ("7", "Vá para a aba '4_Resumo_IR'. Você verá o preço médio final, quantidade e valor de cada ativo, além de um texto pronto para colar na 'Discriminação' da Ficha de Bens e Direitos."),
    ("", ""),
    ("§", "REGRAS DE CÁLCULO APLICADAS (custo médio ponderado)"),
    ("•", "COMPRA: nova_qtd = qtd anterior + qtd comprada; novo_custo = custo anterior + valor pago. Preço médio = novo_custo / nova_qtd."),
    ("•", "VENDA: a venda NÃO altera o preço médio. nova_qtd = qtd anterior - qtd vendida; novo_custo = custo anterior × (nova_qtd / qtd anterior)."),
    ("•", "DESDOBRAMENTO (split): aumenta a quantidade, custo total fica igual, preço médio cai proporcionalmente."),
    ("•", "GRUPAMENTO (inplit): reduz a quantidade, custo total fica igual, preço médio sobe proporcionalmente."),
    ("•", "BONIFICAÇÃO em ativos: usa o valor informado pela empresa no comunicado (campo 'Valor da Operação' do extrato). Se for 0, o preço médio cai. Se houver custo informado, ele é somado ao custo total."),
    ("•", "SUBSCRIÇÃO (recibo de subscrição exercido): tratada como compra - soma quantidade e valor pago ao custo total."),
    ("•", "DIVIDENDO / JCP / RENDIMENTO: ignorados no cálculo de preço médio (não afetam custo de aquisição)."),
    ("•", "DIREITO DE SUBSCRIÇÃO não exercido / FRAÇÃO em ativos: ignorados (não impactam posição em ações - o valor recebido é tributado separadamente)."),
    ("", ""),
    ("§", "COLUNAS ESPERADAS NA ABA '2_Extrato_B3' (formato padrão B3)"),
    ("A", "Entrada/Saída - 'Credito' ou 'Debito'"),
    ("B", "Data - DD/MM/AAAA"),
    ("C", "Movimentação - tipo de operação (texto)"),
    ("D", "Produto - código + nome (ex.: 'PETR4 - PETROLEO BRASILEIRO PN')"),
    ("E", "Instituição - nome da corretora"),
    ("F", "Quantidade - número de ativos"),
    ("G", "Preço unitário - R$ por ativo (pode estar vazio em bonificações/splits)"),
    ("H", "Valor da Operação - R$ total da operação"),
    ("", ""),
    ("§", "CÓDIGOS PARA DECLARAÇÃO IR (Ficha de Bens e Direitos)"),
    ("•", "Grupo 03 (Participações Societárias) → Código 01 - Ações (inclusive as listadas em bolsa)."),
    ("•", "FIIs: Grupo 07 → Código 03. ETFs e BDRs têm códigos próprios; consulte o manual da Receita do ano da declaração."),
    ("•", "O CNPJ da empresa precisa ser preenchido manualmente (não está no extrato B3). Consulte no site de RI da empresa ou na CVM."),
    ("", ""),
    ("§", "RESSALVAS E LIMITAÇÕES"),
    ("!", "Esta planilha NÃO substitui orientação contábil. É uma ferramenta de apoio."),
    ("!", "O formato do extrato B3 pode mudar. Se as colunas não baterem com as descritas acima, ajuste antes de colar."),
    ("!", "Apenas operações em ações no mercado à vista são tratadas. Aluguel de ações, opções, termo, futuros e operações em D-1 com day-trade exigem tratamento próprio."),
    ("!", "Cisões, fusões e incorporações com troca de ativos podem aparecer como 'Atualização' ou 'Cessão de Direitos' - revise manualmente."),
    ("!", "Para FIIs, o cálculo de preço médio funciona, mas a tributação dos rendimentos é diferente."),
    ("!", "Para BDRs, ETFs e ações no exterior, regras específicas se aplicam (não cobertas aqui)."),
    ("!", "Confira sempre o resultado contra seus informes de rendimentos da corretora."),
    ("", ""),
    ("§", "CONVENÇÃO DE CORES"),
    ("•", "Amarelo claro: área de input (você cola/edita aqui)."),
    ("•", "Verde claro: resultado final pronto para usar."),
    ("•", "Texto azul: valor que pode ser editado. Texto preto: fórmula. Texto verde: link entre abas."),
]

row = 2
for tag, text in instr:
    ws[f"A{row}"] = tag
    ws[f"B{row}"] = text
    if tag == "§":
        ws[f"A{row}"].font = FONT_BOLD
        ws[f"B{row}"].font = FONT_BOLD
        ws[f"A{row}"].fill = FILL_SECTION
        ws[f"B{row}"].fill = FILL_SECTION
    elif tag == "!":
        ws[f"A{row}"].font = Font(name="Arial", size=10, bold=True, color="C00000")
        ws[f"B{row}"].font = Font(name="Arial", size=10, color="C00000")
    else:
        ws[f"A{row}"].font = FONT_BODY
        ws[f"B{row}"].font = FONT_BODY
    ws[f"A{row}"].alignment = Alignment(horizontal="center", vertical="top")
    ws[f"B{row}"].alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)
    if len(text) > 110:
        ws.row_dimensions[row].height = 30
    row += 1

ws.sheet_view.showGridLines = False

# =========================================================
# TAB 2 - EXTRATO B3 (área de paste)
# =========================================================
ws2 = wb.create_sheet("2_Extrato_B3")

headers_b3 = [
    "Entrada/Saída", "Data", "Movimentação", "Produto",
    "Instituição", "Quantidade", "Preço unitário", "Valor da Operação"
]
for i, h in enumerate(headers_b3, start=1):
    c = ws2.cell(row=1, column=i, value=h)
    c.font = FONT_HEADER
    c.fill = FILL_HEADER
    c.alignment = ALIGN_CENTER
    c.border = BORDER_THIN

# Larguras
widths_b3 = [14, 12, 28, 38, 22, 14, 16, 18]
for i, w in enumerate(widths_b3, start=1):
    ws2.column_dimensions[get_column_letter(i)].width = w

# Linha vazia em amarelo claro pra indicar área de input
for r in range(2, NUM_ROWS + 2):
    for c in range(1, 9):
        cell = ws2.cell(row=r, column=c)
        cell.fill = FILL_INPUT_AREA
        cell.border = BORDER_THIN
        cell.font = FONT_INPUT
        if c == 2:
            cell.number_format = "DD/MM/YYYY"
        elif c in (7, 8):
            cell.number_format = '_-"R$" * #,##0.00_-;-"R$" * #,##0.00_-;_-"R$" * "-"??_-;_-@_-'
        elif c == 6:
            cell.number_format = "#,##0.00########"

# Comentário/Instrução acima
ws2.row_dimensions[1].height = 32
ws2["A1"].comment = Comment(
    "Cole aqui os dados do extrato 'Movimentação' da B3 a partir da linha 2.\n"
    "A linha 1 contém os cabeçalhos esperados.\n"
    "Depois de colar, ordene por 'Produto' (crescente) e 'Data' (crescente).",
    "Instruções"
)

ws2.freeze_panes = "A2"

# =========================================================
# TAB 3 - CÁLCULO
# =========================================================
ws3 = wb.create_sheet("3_Cálculo")

headers_calc = [
    "Ticker",                # A - extraído de Produto
    "Data",                  # B - de Extrato!B
    "Movimentação Original", # C - de Extrato!C
    "Tipo Classificado",     # D - classificação interna
    "Sinal",                 # E - +1 entrada / -1 saída / 0 ignorado
    "Qtd Movimento",         # F - de Extrato!F
    "Preço Unit.",           # G - de Extrato!G
    "Valor Op.",             # H - de Extrato!H
    "Qtd Anterior",          # I - lookup linha anterior mesmo ticker
    "Custo Total Anterior",  # J - lookup linha anterior
    "Preço Médio Anterior",  # K - calculado
    "Qtd Após",              # L - resultado
    "Custo Total Após",      # M - resultado
    "Preço Médio Após",      # N - resultado
    "Resultado Venda",       # O - lucro/prejuízo (apenas vendas)
    "Observação",            # P
]
for i, h in enumerate(headers_calc, start=1):
    c = ws3.cell(row=1, column=i, value=h)
    c.font = FONT_HEADER
    c.fill = FILL_HEADER
    c.alignment = ALIGN_CENTER
    c.border = BORDER_THIN

widths_calc = [10, 12, 26, 16, 8, 13, 13, 14, 13, 16, 16, 13, 16, 16, 16, 30]
for i, w in enumerate(widths_calc, start=1):
    ws3.column_dimensions[get_column_letter(i)].width = w
ws3.row_dimensions[1].height = 32

# Fórmulas linha a linha. Estratégia:
# - Os dados do extrato JÁ devem estar ordenados por Ticker + Data ASC.
# - Cada linha calcula com base na linha imediatamente anterior do MESMO ticker.
# - Se mudar de ticker, reinicia.

for r in range(2, NUM_ROWS + 2):
    # A: Ticker - extrai a parte antes de " - " do produto. Se produto vazio, retorna "".
    ws3.cell(row=r, column=1, value=(
        f'=IF(\'2_Extrato_B3\'!D{r}="","",'
        f'IFERROR(TRIM(LEFT(\'2_Extrato_B3\'!D{r},FIND(" - ",\'2_Extrato_B3\'!D{r})-1)),'
        f'TRIM(\'2_Extrato_B3\'!D{r})))'
    ))

    # B: Data
    ws3.cell(row=r, column=2, value=f'=IF(\'2_Extrato_B3\'!D{r}="","",\'2_Extrato_B3\'!B{r})')

    # C: Movimentação original
    ws3.cell(row=r, column=3, value=f'=IF(\'2_Extrato_B3\'!D{r}="","",\'2_Extrato_B3\'!C{r})')

    # D: Tipo classificado
    # Classifica baseado no texto da movimentação (case insensitive aproximado)
    mov_ref = f"'2_Extrato_B3'!C{r}"
    es_ref = f"'2_Extrato_B3'!A{r}"
    classify = (
        f'=IF(\'2_Extrato_B3\'!D{r}="","",'
        f'IFERROR('
        f'IF(ISNUMBER(SEARCH("Bonifica";{mov_ref})),"BONIFICACAO",'
        f'IF(ISNUMBER(SEARCH("Desdobr";{mov_ref})),"DESDOBRAMENTO",'
        f'IF(ISNUMBER(SEARCH("Grupament";{mov_ref})),"GRUPAMENTO",'
        f'IF(ISNUMBER(SEARCH("Recibo de Subscri";{mov_ref})),"SUBSCRICAO",'
        f'IF(AND(ISNUMBER(SEARCH("Subscri";{mov_ref})),ISNUMBER(SEARCH("Exerc";{mov_ref}))),"SUBSCRICAO",'
        f'IF(ISNUMBER(SEARCH("Dividendo";{mov_ref})),"IGNORAR",'
        f'IF(ISNUMBER(SEARCH("Juros sobre Capital";{mov_ref})),"IGNORAR",'
        f'IF(ISNUMBER(SEARCH("Rendimento";{mov_ref})),"IGNORAR",'
        f'IF(ISNUMBER(SEARCH("Fração";{mov_ref})),"IGNORAR",'
        f'IF(ISNUMBER(SEARCH("Fracao";{mov_ref})),"IGNORAR",'
        f'IF(AND(ISNUMBER(SEARCH("Direito";{mov_ref})),ISNUMBER(SEARCH("Subscri";{mov_ref}))),"IGNORAR",'
        f'IF(ISNUMBER(SEARCH("Cessão";{mov_ref})),"IGNORAR",'
        f'IF(ISNUMBER(SEARCH("Cessao";{mov_ref})),"IGNORAR",'
        f'IF(ISNUMBER(SEARCH("Atualiza";{mov_ref})),"REVISAR",'
        f'IF(ISNUMBER(SEARCH("Cisão";{mov_ref})),"REVISAR",'
        f'IF(ISNUMBER(SEARCH("Cisao";{mov_ref})),"REVISAR",'
        f'IF(ISNUMBER(SEARCH("Compra";{mov_ref})),"COMPRA",'
        f'IF(ISNUMBER(SEARCH("Venda";{mov_ref})),"VENDA",'
        f'IF(ISNUMBER(SEARCH("Transferência";{mov_ref})),IF({es_ref}="Credito","COMPRA","VENDA"),'
        f'IF(ISNUMBER(SEARCH("Transferencia";{mov_ref})),IF({es_ref}="Credito","COMPRA","VENDA"),'
        f'"REVISAR"'
        f')))))))))))))))))))),"REVISAR"))'
    )
    ws3.cell(row=r, column=4, value=classify)

    # E: Sinal
    ws3.cell(row=r, column=5, value=(
        f'=IF(D{r}="","",IF(\'2_Extrato_B3\'!A{r}="Credito",1,IF(\'2_Extrato_B3\'!A{r}="Debito",-1,0)))'
    ))

    # F: Qtd movimento (raw)
    ws3.cell(row=r, column=6, value=f'=IF(\'2_Extrato_B3\'!F{r}="",0,\'2_Extrato_B3\'!F{r})')

    # G: Preço unit
    ws3.cell(row=r, column=7, value=f'=IF(\'2_Extrato_B3\'!G{r}="",0,\'2_Extrato_B3\'!G{r})')

    # H: Valor op
    ws3.cell(row=r, column=8, value=f'=IF(\'2_Extrato_B3\'!H{r}="",0,\'2_Extrato_B3\'!H{r})')

    if r == 2:
        # Primeira linha: não tem anterior
        ws3.cell(row=r, column=9, value='=0')   # I Qtd Anterior
        ws3.cell(row=r, column=10, value='=0')  # J Custo Anterior
    else:
        # Se mesmo ticker que linha anterior, herda. Senão, zera.
        ws3.cell(row=r, column=9, value=(
            f'=IF(A{r}="",0,IF(A{r}=A{r-1},L{r-1},0))'
        ))
        ws3.cell(row=r, column=10, value=(
            f'=IF(A{r}="",0,IF(A{r}=A{r-1},M{r-1},0))'
        ))

    # K: Preço médio anterior
    ws3.cell(row=r, column=11, value=(
        f'=IF(I{r}>0,J{r}/I{r},0)'
    ))

    # L: Qtd Após - lógica por tipo
    # COMPRA / BONIFICACAO / SUBSCRICAO / DESDOBRAMENTO (entrada): I + F
    # GRUPAMENTO (saída) / VENDA: I - F
    # IGNORAR / REVISAR: I (mantém)
    qty_formula = (
        f'=IF(A{r}="","",'
        f'IF(D{r}="COMPRA",I{r}+F{r},'
        f'IF(D{r}="VENDA",I{r}-F{r},'
        f'IF(D{r}="DESDOBRAMENTO",I{r}+F{r}*E{r},'
        f'IF(D{r}="GRUPAMENTO",I{r}+F{r}*E{r},'
        f'IF(D{r}="BONIFICACAO",I{r}+F{r},'
        f'IF(D{r}="SUBSCRICAO",I{r}+F{r},'
        f'I{r})))))))'
    )
    ws3.cell(row=r, column=12, value=qty_formula)

    # M: Custo Total Após
    # COMPRA: J + H
    # VENDA: J * (L/I) -> mantém preço médio
    # DESDOBRAMENTO/GRUPAMENTO: J (custo total inalterado)
    # BONIFICACAO: J + H (valor informado pela empresa, pode ser 0)
    # SUBSCRICAO: J + H
    # IGNORAR/REVISAR: J
    cost_formula = (
        f'=IF(A{r}="","",'
        f'IF(D{r}="COMPRA",J{r}+H{r},'
        f'IF(D{r}="VENDA",IF(I{r}>0,J{r}*(L{r}/I{r}),0),'
        f'IF(D{r}="DESDOBRAMENTO",J{r},'
        f'IF(D{r}="GRUPAMENTO",J{r},'
        f'IF(D{r}="BONIFICACAO",J{r}+H{r},'
        f'IF(D{r}="SUBSCRICAO",J{r}+H{r},'
        f'J{r})))))))'
    )
    ws3.cell(row=r, column=13, value=cost_formula)

    # N: Preço Médio Após
    ws3.cell(row=r, column=14, value=(
        f'=IF(A{r}="","",IF(L{r}>0,M{r}/L{r},0))'
    ))

    # O: Resultado da venda (lucro/prejuízo) - apenas se for venda
    # Resultado = (preço médio venda - preço médio anterior) * qtd vendida
    # = H (valor recebido) - F (qtd vendida) * K (preço médio anterior)
    ws3.cell(row=r, column=15, value=(
        f'=IF(D{r}="VENDA",H{r}-F{r}*K{r},"")'
    ))

    # P: Observação
    ws3.cell(row=r, column=16, value=(
        f'=IF(A{r}="","",'
        f'IF(D{r}="REVISAR","⚠ Movimentação não classificada automaticamente - revise manualmente",'
        f'IF(AND(D{r}="VENDA",F{r}>I{r}),"⚠ Venda maior que posição - verifique ordenação dos dados",'
        f'IF(AND(D{r}="BONIFICACAO",H{r}=0),"ℹ Bonificação sem custo informado - reduz preço médio",""))))'
    ))

# Formatação das colunas
fmt_money = '_-"R$" * #,##0.0000_-;-"R$" * #,##0.0000_-;_-"R$" * "-"??_-;_-@_-'
fmt_money2 = '_-"R$" * #,##0.00_-;-"R$" * #,##0.00_-;_-"R$" * "-"??_-;_-@_-'
fmt_qty = "#,##0.00########;-#,##0.00########;-"

for r in range(2, NUM_ROWS + 2):
    ws3.cell(row=r, column=2).number_format = "DD/MM/YYYY"
    for c in [6, 9, 12]:  # quantidades
        ws3.cell(row=r, column=c).number_format = fmt_qty
    for c in [7, 11, 14]:  # preços (4 casas)
        ws3.cell(row=r, column=c).number_format = fmt_money
    for c in [8, 10, 13, 15]:  # valores totais (2 casas)
        ws3.cell(row=r, column=c).number_format = fmt_money2
    # Bordas e fonte
    for c in range(1, 17):
        cell = ws3.cell(row=r, column=c)
        cell.border = BORDER_THIN
        cell.font = FONT_FORMULA

# Destacar colunas de output (L, M, N) com fundo verde claro
for r in range(2, NUM_ROWS + 2):
    for col_letter in ["L", "M", "N"]:
        ws3[f"{col_letter}{r}"].fill = FILL_HIGHLIGHT

ws3.freeze_panes = "A2"

# =========================================================
# TAB 4 - RESUMO IR
# =========================================================
ws4 = wb.create_sheet("4_Resumo_IR")

# Cabeçalho
ws4.merge_cells("A1:I1")
ws4["A1"] = "Resumo por Ativo - Posição Final para Declaração IR"
ws4["A1"].font = FONT_TITLE
ws4["A1"].fill = FILL_TITLE
ws4["A1"].alignment = ALIGN_CENTER
ws4.row_dimensions[1].height = 28

# Notas de uso
ws4.merge_cells("A2:I2")
ws4["A2"] = ("Lista os tickers únicos da aba '3_Cálculo' e busca a ÚLTIMA posição de cada um. "
             "Edite a coluna 'CNPJ' (azul) com o CNPJ da empresa - não vem do extrato B3.")
ws4["A2"].font = FONT_NOTE
ws4["A2"].alignment = ALIGN_LEFT
ws4.row_dimensions[2].height = 24

# Headers
headers_resumo = [
    "Ticker",                # A - UNIQUE dos tickers
    "Quantidade Final",      # B - última qtd
    "Preço Médio (R$)",      # C - último preço médio
    "Custo Total (R$)",      # D - último custo total
    "Última Data",           # E
    "Corretora (última)",    # F
    "CNPJ da Empresa",       # G - INPUT MANUAL
    "Código do Bem (IR)",    # H - INPUT MANUAL (default 31)
    "Discriminação (copiar para IR)",  # I - texto pronto
]
for i, h in enumerate(headers_resumo, start=1):
    c = ws4.cell(row=3, column=i, value=h)
    c.font = FONT_HEADER
    c.fill = FILL_HEADER
    c.alignment = ALIGN_CENTER
    c.border = BORDER_THIN

widths_resumo = [12, 16, 16, 16, 13, 22, 22, 12, 80]
for i, w in enumerate(widths_resumo, start=1):
    ws4.column_dimensions[get_column_letter(i)].width = w
ws4.row_dimensions[3].height = 32

# Estratégia para listar tickers únicos:
# Usamos fórmulas tradicionais (não dependentes de UNIQUE/Excel365) para máxima compatibilidade.
# A4: primeiro ticker único da coluna A da Cálculo
# A5+: próximo ticker único, ignorando os já listados acima

# Linha 4: primeiro ticker
ws4["A4"] = (
    f'=IFERROR(INDEX(\'3_Cálculo\'!$A$2:$A${NUM_ROWS+1},'
    f'MATCH(TRUE,\'3_Cálculo\'!$A$2:$A${NUM_ROWS+1}<>"",0)),"")'
)
# É uma fórmula matricial em Excel antigo, mas em Excel 365 funciona normal.
# Para compatibilidade, vou usar uma alternativa não-matricial:
ws4["A4"] = (
    f'=IFERROR(INDEX(\'3_Cálculo\'!$A$2:$A${NUM_ROWS+1},'
    f'MATCH(1,INDEX((\'3_Cálculo\'!$A$2:$A${NUM_ROWS+1}<>"")*1,0),0)),"")'
)

# Linhas 5 a NUM_TICKERS+3: próximo ticker que ainda não foi listado
for i in range(1, NUM_TICKERS):
    r = 4 + i
    # Próximo ticker único: primeiro ticker em Cálculo!A que não esteja em A4:A(r-1)
    # Usando COUNTIF
    ws4[f"A{r}"] = (
        f'=IFERROR(INDEX(\'3_Cálculo\'!$A$2:$A${NUM_ROWS+1},'
        f'MATCH(1,'
        f'INDEX((\'3_Cálculo\'!$A$2:$A${NUM_ROWS+1}<>"")*'
        f'(COUNTIF($A$4:$A{r-1},\'3_Cálculo\'!$A$2:$A${NUM_ROWS+1})=0),0),'
        f'0)),"")'
    )

# Para cada ticker (linhas 4 a NUM_TICKERS+3), buscar a ÚLTIMA ocorrência na Cálculo
for r in range(4, NUM_TICKERS + 4):
    ticker_cell = f"$A{r}"

    # B: Quantidade Final - LOOKUP da última qtd com ticker = A
    # Usando LOOKUP(2, 1/(condição), valores) - fórmula clássica para "último valor"
    ws4[f"B{r}"] = (
        f'=IF({ticker_cell}="","",'
        f'IFERROR(LOOKUP(2,1/(\'3_Cálculo\'!$A$2:$A${NUM_ROWS+1}={ticker_cell}),'
        f'\'3_Cálculo\'!$L$2:$L${NUM_ROWS+1}),0))'
    )
    # C: Preço Médio (último)
    ws4[f"C{r}"] = (
        f'=IF({ticker_cell}="","",'
        f'IFERROR(LOOKUP(2,1/(\'3_Cálculo\'!$A$2:$A${NUM_ROWS+1}={ticker_cell}),'
        f'\'3_Cálculo\'!$N$2:$N${NUM_ROWS+1}),0))'
    )
    # D: Custo Total (último)
    ws4[f"D{r}"] = (
        f'=IF({ticker_cell}="","",'
        f'IFERROR(LOOKUP(2,1/(\'3_Cálculo\'!$A$2:$A${NUM_ROWS+1}={ticker_cell}),'
        f'\'3_Cálculo\'!$M$2:$M${NUM_ROWS+1}),0))'
    )
    # E: Última data
    ws4[f"E{r}"] = (
        f'=IF({ticker_cell}="","",'
        f'IFERROR(LOOKUP(2,1/(\'3_Cálculo\'!$A$2:$A${NUM_ROWS+1}={ticker_cell}),'
        f'\'3_Cálculo\'!$B$2:$B${NUM_ROWS+1}),""))'
    )
    # F: Corretora última (busca na aba Extrato)
    ws4[f"F{r}"] = (
        f'=IF({ticker_cell}="","",'
        f'IFERROR(LOOKUP(2,1/('
        f'IFERROR(LEFT(\'2_Extrato_B3\'!$D$2:$D${NUM_ROWS+1},'
        f'FIND(" - ",\'2_Extrato_B3\'!$D$2:$D${NUM_ROWS+1})-1),'
        f'\'2_Extrato_B3\'!$D$2:$D${NUM_ROWS+1})={ticker_cell}),'
        f'\'2_Extrato_B3\'!$E$2:$E${NUM_ROWS+1}),""))'
    )
    # G: CNPJ - INPUT manual
    ws4[f"G{r}"] = ""

    # H: Código IR - default 31 (ações), editável
    ws4[f"H{r}"] = f'=IF({ticker_cell}="","",31)'

    # I: Discriminação
    # Formato: "{qtd} ações de {TICKER} custodiadas na {corretora}, CNPJ {cnpj}.
    #           Preço médio de aquisição R$ {preço médio}."
    ws4[f"I{r}"] = (
        f'=IF({ticker_cell}="","",'
        f'TEXT(B{r},"#,##0.##")&" ativos do código "&{ticker_cell}'
        f'&" custodiados na "&IF(F{r}="","[corretora]",F{r})'
        f'&IF(G{r}="",", CNPJ [preencher].",", CNPJ "&G{r}&".")'
        f'&" Preço médio de aquisição: R$ "&TEXT(C{r},"#,##0.0000")'
        f'&". Custo total de aquisição: R$ "&TEXT(D{r},"#,##0.00")&".")'
    )

    # Formatação
    ws4[f"A{r}"].font = FONT_FORMULA
    ws4[f"A{r}"].alignment = ALIGN_CENTER
    ws4[f"B{r}"].number_format = fmt_qty
    ws4[f"C{r}"].number_format = fmt_money
    ws4[f"D{r}"].number_format = fmt_money2
    ws4[f"E{r}"].number_format = "DD/MM/YYYY"
    ws4[f"E{r}"].alignment = ALIGN_CENTER
    ws4[f"F{r}"].alignment = ALIGN_LEFT
    ws4[f"G{r}"].font = FONT_INPUT       # input manual = azul
    ws4[f"G{r}"].alignment = ALIGN_CENTER
    ws4[f"G{r}"].fill = FILL_INPUT_AREA  # destaca como input
    ws4[f"H{r}"].font = FONT_INPUT
    ws4[f"H{r}"].alignment = ALIGN_CENTER
    ws4[f"H{r}"].fill = FILL_INPUT_AREA
    ws4[f"I{r}"].font = FONT_FORMULA
    ws4[f"I{r}"].alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    ws4[f"I{r}"].fill = FILL_HIGHLIGHT
    for col_letter in "ABCDEFGHI":
        ws4[f"{col_letter}{r}"].border = BORDER_THIN
    ws4.row_dimensions[r].height = 32

# Linha de totais
total_row = NUM_TICKERS + 4
ws4[f"A{total_row}"] = "TOTAL"
ws4[f"A{total_row}"].font = FONT_BOLD
ws4[f"A{total_row}"].fill = FILL_SECTION
ws4[f"A{total_row}"].alignment = ALIGN_CENTER
ws4[f"D{total_row}"] = f'=SUM(D4:D{total_row-1})'
ws4[f"D{total_row}"].number_format = fmt_money2
ws4[f"D{total_row}"].font = FONT_BOLD
ws4[f"D{total_row}"].fill = FILL_SECTION
for col_letter in "ABCDEFGHI":
    ws4[f"{col_letter}{total_row}"].border = BORDER_THIN
    if col_letter not in ["A", "D"]:
        ws4[f"{col_letter}{total_row}"].fill = FILL_SECTION

ws4.freeze_panes = "A4"
ws4.sheet_view.showGridLines = False

# =========================================================
# Define ordem das abas e salva
# =========================================================
out_path = "/home/claude/work/Calculadora_Preco_Medio_IR.xlsx"
wb.save(out_path)
print(f"Saved: {out_path}")
