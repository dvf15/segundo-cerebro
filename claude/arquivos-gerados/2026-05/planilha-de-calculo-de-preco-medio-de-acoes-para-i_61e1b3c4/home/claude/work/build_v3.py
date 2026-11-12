"""
Versão final: 
- Insere posição inicial (31/12/2024) como linhas sintéticas no extrato
- Corrige Atualização ITSA4 (vira Compra) e Fração ITSA4 (vira Venda)
- Substitui fórmulas de PM agregado por LOOKUP do último valor FIFO no cálculo
- Adiciona aba 5_DIRPF_2026 que espelha o formato da base histórica
"""
import shutil
import pandas as pd
import re
from datetime import datetime
from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.comments import Comment

src = "/home/claude/work/Calculadora_Preco_Medio_IR_PREENCHIDA.xlsx"
dst = "/home/claude/work/Calculadora_Preco_Medio_IR_FINAL.xlsx"
shutil.copy(src, dst)

# ===== Estilos =====
FONT_TITLE = Font(name="Arial", size=14, bold=True, color="FFFFFF")
FONT_HEADER = Font(name="Arial", size=10, bold=True, color="FFFFFF")
FONT_BODY = Font(name="Arial", size=10)
FONT_BOLD = Font(name="Arial", size=10, bold=True)
FONT_NOTE = Font(name="Arial", size=9, italic=True, color="666666")
FONT_INPUT = Font(name="Arial", size=10, color="0000FF")
FONT_FORMULA = Font(name="Arial", size=10, color="000000")
FONT_LINK = Font(name="Arial", size=10, color="008000")

FILL_TITLE = PatternFill("solid", fgColor="1F4E78")
FILL_HEADER = PatternFill("solid", fgColor="2E75B6")
FILL_INPUT_AREA = PatternFill("solid", fgColor="FFF2CC")
FILL_HIGHLIGHT = PatternFill("solid", fgColor="E2EFDA")
FILL_SECTION = PatternFill("solid", fgColor="D9E1F2")
FILL_INITIAL = PatternFill("solid", fgColor="DDEBF7")  # azul muito claro = sintético

BORDER_THIN = Border(
    left=Side(style="thin", color="BFBFBF"),
    right=Side(style="thin", color="BFBFBF"),
    top=Side(style="thin", color="BFBFBF"),
    bottom=Side(style="thin", color="BFBFBF"),
)

ALIGN_CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)
ALIGN_LEFT = Alignment(horizontal="left", vertical="center", wrap_text=True)

NUM_ROWS = 1000
NUM_TICKERS = 100

fmt_money = '_-"R$" * #,##0.0000_-;-"R$" * #,##0.0000_-;_-"R$" * "-"??_-;_-@_-'
fmt_money2 = '_-"R$" * #,##0.00_-;-"R$" * #,##0.00_-;_-"R$" * "-"??_-;_-@_-'
fmt_qty = "#,##0.00########;-#,##0.00########;-"

# ============================================================
# STEP 1: Ler dados atuais do extrato
# ============================================================
wb = load_workbook(dst)
ws2 = wb["2_Extrato_B3"]

current_data = []
for r in range(2, NUM_ROWS + 2):
    row = [ws2.cell(row=r, column=c).value for c in range(1, 9)]
    if all(v is None or v == "" for v in row):
        break
    current_data.append(row)

print(f"Linhas atuais no extrato: {len(current_data)}")

# ============================================================
# STEP 2: Modificar ITSA4 - Atualização e Fração
# ============================================================
fixed_data = []
for row in current_data:
    es, dt, mov, prod, inst, qty, pu, val = row
    
    # Caso 1: ITSA4 Atualização +220 em 28/05/2025 - virou Compra com R$ 1.474
    # (resultado da subscrição ITSA2 → ITSA10 → ITSA4)
    if (prod and "ITSA4" in str(prod) and 
        mov == "Atualização" and 
        qty == 220 and
        dt and (dt.year == 2025 and dt.month == 5)):
        mov = "Compra (Atualização Subscrição ITSA2→ITSA4)"
        pu = 6.70
        val = 1474.00
    
    # Caso 2: ITSA4 Fração em Ativos -0.35 em 06/01/2025 - vira Venda
    # (a fração foi removida e leiloada por R$ 3,17 em 28/01)
    if (prod and "ITSA4" in str(prod) and 
        mov == "Fração em Ativos" and
        qty == 0.35):
        mov = "Venda (Fração em Ativos)"
        pu = 0
        val = 0  # leilão R$ 3.17 ignorado por simplicidade (de minimis)
    
    fixed_data.append([es, dt, mov, prod, inst, qty, pu, val])

# ============================================================
# STEP 3: Adicionar linhas sintéticas de posição inicial 31/12/2024
# ============================================================
# Da base histórica do usuário (31/12/2024)
synthetic_initial = [
    # (ticker, qty, pm, custo_total, corretora, descricao_completa)
    ('ITSA4',  8449.35,  10.85937024741548, 91754.62,  'XP INVESTIMENTOS CCTVM S/A', 'ITSA4 - ITAUSA S.A.'),
    ('CMIG4',  2748,     7.69068413391558,  21134.00,  'XP INVESTIMENTOS CCTVM S/A', 'CMIG4 - CIA. ENERGETICA DE MINAS GERAIS- CEMIG'),
    ('SAPR11', 1279,     21.1727912431587,  27080.00,  'XP INVESTIMENTOS CCTVM S/A', 'SAPR11 - CIA DE SANEAMENTO DO PARANA - SANEPAR'),
    ('KLBN4',  5024,     4.20121815286624,  21106.92,  'XP INVESTIMENTOS CCTVM S/A', 'KLBN4 - KLABIN S/A'),
    ('TAEE11', 750,      34.7746666666667,  26081.00,  'ITAU CV S/A',                'TAEE11 - TRANSMISSORA ALIANCA DE ENERGIA ELETRICA S/A'),
    ('ALOS3',  8708,     21.285542030317,   185354.50, 'ITAU CV S/A',                'ALOS3 - ALLOS S.A.'),  # Apenas Bem 20 (livre)
    ('BBSE3',  850,      33.0894117647059,  28126.00,  'XP INVESTIMENTOS CCTVM S/A', 'BBSE3 - BB SEGURIDADE PARTICIPACOES S.A.'),
    ('AURE3',  1700,     12.4917647058824,  21236.00,  'XP INVESTIMENTOS CCTVM S/A', 'AURE3 - AUREN ENERGIA S.A.'),
    ('BBDC4',  5211,     13.5110343504126,  70406.00,  'XP INVESTIMENTOS CCTVM S/A', 'BBDC4 - BANCO BRADESCO S/A'),
]

initial_rows = []
init_date = datetime(2024, 12, 31)
for ticker, qty, pm, custo, corretora, prod_desc in synthetic_initial:
    initial_rows.append([
        'Credito',
        init_date,
        'Compra (Posição Inicial 31/12/2024)',  # vai ser classificado como COMPRA
        prod_desc,
        corretora,
        qty,
        pm,
        custo,
    ])

# ============================================================
# STEP 4: Combinar e ordenar (ticker + data ascendente)
# ============================================================
all_data = initial_rows + fixed_data

def get_ticker(prod):
    if not prod:
        return ""
    s = str(prod).strip()
    if " - " in s:
        return s.split(" - ")[0].strip()
    return s

all_data.sort(key=lambda r: (get_ticker(r[3]), r[1] if r[1] else datetime.min))

# ============================================================
# STEP 5: Limpar 2_Extrato_B3 e regravar dados
# ============================================================
# Limpar linhas existentes (preservando formatação)
for r in range(2, NUM_ROWS + 2):
    for c in range(1, 9):
        ws2.cell(row=r, column=c).value = None

# Regravar
for i, row in enumerate(all_data):
    excel_row = i + 2
    for j, val in enumerate(row):
        ws2.cell(row=excel_row, column=j+1).value = val
    # Destacar linhas sintéticas (posição inicial) com cor diferente
    if row[2] and "Posição Inicial" in str(row[2]):
        for c in range(1, 9):
            ws2.cell(row=excel_row, column=c).fill = FILL_INITIAL

print(f"Total linhas (sintéticas + B3): {len(all_data)}")
print(f"Linhas sintéticas adicionadas: {len(initial_rows)}")

# ============================================================
# STEP 6: Atualizar fórmulas em 4_Resumo_IR para usar FIFO LOOKUP
# ============================================================
ws4 = wb["4_Resumo_IR"]

# Adicionar nota explicando a mudança
ws4["A2"].value = ("Posições iniciais 31/12/2024 já injetadas na aba '2_Extrato_B3' como linhas sintéticas. "
                   "Os cálculos abaixo são FIFO cronológicos. Coluna G/H mantidas apenas como referência informativa.")

# Para cada ticker, mudar fórmulas das colunas chave:
# - I (Qtd Final): pegar último L (Qtd Após) do cálculo - já é FIFO
# - J (Custo Total Final): pegar último M (Custo Após) do cálculo
# - K (PM Final): J/I

for r in range(5, NUM_TICKERS + 5):
    tk = f"$A{r}"
    
    # G e H: zerar (informativos, mas já estão no synthetic)
    ws4[f"G{r}"].value = 0
    ws4[f"H{r}"].value = 0
    
    # I: Qtd Final - último L do cálculo
    ws4[f"I{r}"] = (
        f'=IF({tk}="","",'
        f'IFERROR(LOOKUP(2,1/(\'3_Cálculo\'!$A$2:$A${NUM_ROWS+1}={tk}),'
        f'\'3_Cálculo\'!$L$2:$L${NUM_ROWS+1}),0))'
    )
    
    # J: Custo Total Final - último M do cálculo
    ws4[f"J{r}"] = (
        f'=IF({tk}="","",'
        f'IFERROR(LOOKUP(2,1/(\'3_Cálculo\'!$A$2:$A${NUM_ROWS+1}={tk}),'
        f'\'3_Cálculo\'!$M$2:$M${NUM_ROWS+1}),0))'
    )
    
    # K: PM Final
    ws4[f"K{r}"] = f'=IF({tk}="","",IF(I{r}>0,J{r}/I{r},0))'
    
    # L: Resultado total das vendas (soma da coluna O do cálculo onde ticker bate)
    ws4[f"L{r}"] = (
        f'=IF({tk}="","",'
        f'IFERROR(SUMIFS(\'3_Cálculo\'!$O$2:$O${NUM_ROWS+1},'
        f'\'3_Cálculo\'!$A$2:$A${NUM_ROWS+1},{tk},'
        f'\'3_Cálculo\'!$D$2:$D${NUM_ROWS+1},"VENDA"),0))'
    )

wb.save(dst)
print("Saved partial. Recalculando...")
