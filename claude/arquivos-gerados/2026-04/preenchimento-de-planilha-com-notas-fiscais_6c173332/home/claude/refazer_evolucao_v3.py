from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.formatting.rule import CellIsRule
from copy import copy

# ─── PALETA ──────────────────────────────────────────────────────────────────
AZUL_ESCURO   = "1F3864"
AZUL_MEDIO    = "2E75B6"
AZUL_CLARO    = "D6E4F0"
VERDE_ESCURO  = "1D6038"
VERDE_CLARO   = "E2EFDA"
VERDE_MEDIO   = "70AD47"
AMARELO       = "FFF2CC"
AMARELO_CLARO = "FFFCE5"
LARANJA_FORTE = "ED7D31"
LARANJA       = "FCE4D6"
CINZA         = "F2F2F2"
CINZA_BORDA   = "BFBFBF"
BRANCO        = "FFFFFF"
TEXTO_BRANCO  = "FFFFFF"
TEXTO_ESCURO  = "1F1F1F"
DOURADO       = "BF8F00"
DOURADO_ESC   = "7F6000"

FMT_REAL = 'R$ #,##0.00'

def borda_fina():
    s = Side(border_style="thin", color=CINZA_BORDA)
    return Border(left=s, right=s, top=s, bottom=s)
def borda_media():
    s = Side(border_style="medium", color="1F3864")
    return Border(left=s, right=s, top=s, bottom=s)

INPUT_PATH  = "/mnt/user-data/outputs/Valor Imovel Casa4 IR (Custos Aquisi+Obra+Financ).xlsx"
OUTPUT_PATH = INPUT_PATH

wb = load_workbook(INPUT_PATH)

# ════════════════════════════════════════════════════════════════════════════
# DADOS QUE JÁ FORAM PAGOS (extraídos do DDC)
# ════════════════════════════════════════════════════════════════════════════
aquisicao_2025 = 1500000.00 + 96000.00 + 12897.67  # 1.608.897,67

# Apenas valores PAGOS reais
# 2025: 3 parcelas (out, nov, dez)
amort_2025  = 4446.36 + 4454.10 + 4461.45                    # 13.361,91
juros_2025  = 16401.83 + 16387.48 + 16371.55                 # 49.160,86
mip_2025    = 2015.28 + 1006.76 + 1005.78                    # 4.027,82
dfi_2025    =  409.56 +  205.14 +  205.48                    #    820,18
seguros_2025 = mip_2025 + dfi_2025                            # 4.847,99

# 2026: PARCIAL — apenas 4 parcelas pagas (jan, fev, mar, abr) até a data de hoje
# Conforme regra acordada: "Pré-preenchidos só onde já pagou; futuros em branco"
amort_2026_pago = 4469.20 + 4476.79 + 4484.39 + 4491.96       # 17.922,34
juros_2026_pago = 16356.96 + 16341.63 + 16326.17 + 16310.45   # 65.335,21
mip_2026_pago   = 1004.88 + 1003.94 + 1002.99 + 1002.02       # 4.013,83
dfi_2026_pago   = 205.83 + 206.18 + 206.53 + 206.88           #   825,42
seguros_2026_pago = mip_2026_pago + dfi_2026_pago             # 4.839,25

# ════════════════════════════════════════════════════════════════════════════
# REFAZER ABA Evolucao_Anual_IR
# ════════════════════════════════════════════════════════════════════════════
if "Evolucao_Anual_IR" in wb.sheetnames:
    del wb["Evolucao_Anual_IR"]

we = wb.create_sheet("Evolucao_Anual_IR")

# ── HEADER ────────────────────────────────────────────────────────────────────
we.merge_cells("A1:O1")
c = we["A1"]
c.value     = "EVOLUÇÃO ANUAL DO CUSTO ATIVÁVEL — DECLARAÇÃO DE BENS E DIREITOS (IR)"
c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=13)
c.fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
c.alignment = Alignment(horizontal="center", vertical="center")
we.row_dimensions[1].height = 30

we.merge_cells("A2:O2")
c2 = we["A2"]
c2.value     = ("Palm Hill Casa 4 | Período: 2025–2035 | Atualizar a cada ano com os valores reais "
                "do DDC do Itaú e dos pagamentos efetivamente realizados")
c2.font      = Font(name="Arial", italic=True, color=AZUL_ESCURO, size=10)
c2.fill      = PatternFill("solid", fgColor=AZUL_CLARO)
c2.alignment = Alignment(horizontal="center", vertical="center")
we.row_dimensions[2].height = 18

we.row_dimensions[3].height = 8

# ── INSTRUÇÕES DE PREENCHIMENTO ──────────────────────────────────────────────
we.merge_cells("A4:O4")
c4 = we["A4"]
c4.value     = ("📝 INSTRUÇÕES: (1) Células AMARELAS = preencher manualmente com valores reais do DDC ao final do ano. "
                "(2) Benfeitorias puxam da aba 'Lancamentos' automaticamente, mas você pode sobrescrever. "
                "(3) Aquisição só conta em 2025 (entrada+ITBI+cartório). (4) Saldo do financiamento NÃO é custo (vai para ficha de Dívidas).")
c4.font      = Font(name="Arial", italic=True, color="7F3F00", size=9)
c4.fill      = PatternFill("solid", fgColor=AMARELO)
c4.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
c4.border    = borda_fina()
we.row_dimensions[4].height = 48

we.row_dimensions[5].height = 8

# ════════════════════════════════════════════════════════════════════════════
# ÚNICA TABELA INTEGRADA — entradas brutas → cálculos → resumo
# ════════════════════════════════════════════════════════════════════════════
# Cobertura: 2025 a 2035 (10 anos)
ANOS = list(range(2025, 2036))

# ── TÍTULO TABELA ────────────────────────────────────────────────────────────
linha = 6
we.row_dimensions[linha].height = 24
we.merge_cells(f"A{linha}:O{linha}")
ct = we[f"A{linha}"]
ct.value     = "TABELA INTEGRADA — Pagamentos do ano + Acumulados (cenários Conservador e Amplo)"
ct.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=12)
ct.fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
ct.alignment = Alignment(horizontal="left", vertical="center")
ct.border    = borda_media()

# ── CABEÇALHO DUPLO ──────────────────────────────────────────────────────────
linha += 1  # 7 — agrupadores
we.row_dimensions[linha].height = 24
we.row_dimensions[linha+1].height = 38

# Linha 7: agrupadores principais
# Layout:
#  A         = Ano
#  B-G       = "PAGO NO ANO" (entradas)
#  H-I       = TOTAIS pagos no ano (cons / amplo)
#  J         = Saldo devedor 31/12
#  K-N       = ACUMULADOS por componente
#  O         = SALDO TOTAL ATIVÁVEL 31/12 (cons / amplo)

we.merge_cells(f"A{linha}:A{linha+1}")
we[f"A{linha}"].value = "Ano"

we.merge_cells(f"B{linha}:G{linha}")
we[f"B{linha}"].value = "PAGO NO ANO  (preencher conforme DDC ao final de cada ano)"

we.merge_cells(f"H{linha}:I{linha}")
we[f"H{linha}"].value = "TOTAIS pagos no ano"

we.merge_cells(f"J{linha}:J{linha+1}")
we[f"J{linha}"].value = "Saldo Devedor\nFinanciamento\n31/12 (R$)"

we.merge_cells(f"K{linha}:N{linha}")
we[f"K{linha}"].value = "ACUMULADO até 31/12 (componentes)"

we.merge_cells(f"O{linha}:O{linha+1}")
we[f"O{linha}"].value = "SALDO TOTAL\nATIVÁVEL\n31/12 (R$)"

for col in ["A","B","H","J","K","O"]:
    c = we[f"{col}{linha}"]
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=10)
    c.fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()

# Linha 8: subcabeçalhos
linha += 1  # 8
subcabs = [
    ("B", "Aquisição\n(R$)",          AZUL_MEDIO,   "Entrada + ITBI + cartório (só 2025)"),
    ("C", "Amortização\n(R$)",        AZUL_MEDIO,   "Pago no ano via DDC"),
    ("D", "Juros\n(R$)",              DOURADO,      "Pago no ano via DDC"),
    ("E", "Seguros\nMIP+DFI (R$)",    DOURADO,      "Pago no ano via DDC"),
    ("F", "Benfeitorias\n(R$)",       VERDE_MEDIO,  "Auto da aba Lancamentos"),
    ("G", "Outros\n(R$)",             VERDE_MEDIO,  "Manual (corretagem extra etc.)"),
    ("H", "Total CONS.\n(B+C+F+G)",   VERDE_ESCURO, ""),
    ("I", "Total AMPLO\n(B+C+D+E+F+G)", DOURADO_ESC,""),
    ("K", "Cons.\n(B+C+F+G)",         VERDE_MEDIO, ""),
    ("L", "Juros\nacum.",             DOURADO, ""),
    ("M", "Seguros\nacum.",           DOURADO, ""),
    ("N", "Total AMPLO\nacum.",       DOURADO_ESC, ""),
]
for col, txt, cor, _ in subcabs:
    c = we[f"{col}{linha}"]
    c.value     = txt
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=8.5)
    c.fill      = PatternFill("solid", fgColor=cor)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()

# ── DADOS — uma linha por ano ────────────────────────────────────────────────
# Linha 9 = 2025
# Linha 10 = 2026
# ...
# Linha 19 = 2035

# Saldos devedores conhecidos (do DDC):
# Final 2025 = parcela 3 (29/12/2025): R$1.695.349,86
# Final 2026 = parcela 15 (29/12/2026): R$1.653.039,95 (se pagar todas as 12 do ano)
# Mas como pediu "só onde pagou", deixo só 2025 confirmado e 2026 vazio
saldos_devedores_conhecidos = {
    2025: 1695349.86,
}

linha_inicio = linha + 1  # 9
ano_para_linha = {ano: linha_inicio + i for i, ano in enumerate(ANOS)}

# Estilos de células de input
def preencher_celula_input(cell, valor, fill_color):
    """Célula que o usuário pode editar - amarelo se vazia, valor se preenchida"""
    cell.value = valor
    cell.number_format = FMT_REAL
    cell.font = Font(name="Arial", size=10)
    cell.alignment = Alignment(horizontal="right", vertical="center")
    cell.fill = PatternFill("solid", fgColor=fill_color)
    cell.border = borda_fina()

def preencher_celula_formula(cell, formula, fill_color, bold=False, cor_texto=None):
    cell.value = formula
    cell.number_format = FMT_REAL
    cell.font = Font(name="Arial", bold=bold, size=10, color=cor_texto or TEXTO_ESCURO)
    cell.alignment = Alignment(horizontal="right", vertical="center")
    cell.fill = PatternFill("solid", fgColor=fill_color)
    cell.border = borda_fina()

for idx, ano in enumerate(ANOS):
    r = ano_para_linha[ano]
    we.row_dimensions[r].height = 24
    fill_linha = AZUL_CLARO if idx % 2 == 0 else BRANCO

    # ── Coluna A: Ano ──
    we[f"A{r}"].value     = ano
    we[f"A{r}"].font      = Font(name="Arial", bold=True, size=12)
    we[f"A{r}"].fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
    we[f"A{r}"].font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=12)
    we[f"A{r}"].alignment = Alignment(horizontal="center", vertical="center")
    we[f"A{r}"].border    = borda_fina()

    # ── B: Aquisição (só 2025) ──
    if ano == 2025:
        preencher_celula_input(we[f"B{r}"], aquisicao_2025, fill_linha)
    else:
        # Travado em zero, com fill diferente para indicar "não editável"
        preencher_celula_input(we[f"B{r}"], 0, CINZA)
        we[f"B{r}"].font = Font(name="Arial", size=10, color="A0A0A0", italic=True)

    # ── C: Amortização (input) ──
    if ano == 2025:
        preencher_celula_input(we[f"C{r}"], amort_2025, fill_linha)
    elif ano == 2026:
        # Marcar como "parcial - 4 parcelas até abr/2026"
        preencher_celula_input(we[f"C{r}"], amort_2026_pago, AMARELO_CLARO)
    else:
        # Vazio com fundo amarelo (preencher quando vier o ano)
        preencher_celula_input(we[f"C{r}"], None, AMARELO)

    # ── D: Juros (input) ──
    if ano == 2025:
        preencher_celula_input(we[f"D{r}"], juros_2025, fill_linha)
    elif ano == 2026:
        preencher_celula_input(we[f"D{r}"], juros_2026_pago, AMARELO_CLARO)
    else:
        preencher_celula_input(we[f"D{r}"], None, AMARELO)

    # ── E: Seguros MIP+DFI (input) ──
    if ano == 2025:
        preencher_celula_input(we[f"E{r}"], seguros_2025, fill_linha)
    elif ano == 2026:
        preencher_celula_input(we[f"E{r}"], seguros_2026_pago, AMARELO_CLARO)
    else:
        preencher_celula_input(we[f"E{r}"], None, AMARELO)

    # ── F: Benfeitorias (FÓRMULA puxando de Lancamentos, sobrescrevível) ──
    # SUMIFS: soma S onde C=ano (coluna C de Lancamentos é o ano)
    formula_benf = f'=IFERROR(SUMIFS(Lancamentos!$S$2:$S$1000,Lancamentos!$C$2:$C$1000,{ano}),0)'
    preencher_celula_formula(we[f"F{r}"], formula_benf, fill_linha)
    # Cor de fonte azul para indicar que é fórmula
    we[f"F{r}"].font = Font(name="Arial", size=10, color="0070C0", italic=True)

    # ── G: Outros (input manual) ──
    preencher_celula_input(we[f"G{r}"], 0, fill_linha if ano in (2025,2026) else AMARELO)
    if ano not in (2025, 2026):
        we[f"G{r}"].value = None  # vazia para 2027+

    # ── H: Total CONS pago no ano (B+C+F+G) ──
    formula_h = f"=B{r}+C{r}+F{r}+G{r}"
    preencher_celula_formula(we[f"H{r}"], formula_h, VERDE_CLARO, bold=True, cor_texto=VERDE_ESCURO)

    # ── I: Total AMPLO pago no ano (B+C+D+E+F+G) ──
    formula_i = f"=B{r}+C{r}+D{r}+E{r}+F{r}+G{r}"
    preencher_celula_formula(we[f"I{r}"], formula_i, AMARELO, bold=True, cor_texto=DOURADO_ESC)

    # ── J: Saldo devedor 31/12 (input) ──
    if ano in saldos_devedores_conhecidos:
        preencher_celula_input(we[f"J{r}"], saldos_devedores_conhecidos[ano], fill_linha)
    else:
        preencher_celula_input(we[f"J{r}"], None, AMARELO)
    we[f"J{r}"].font = Font(name="Arial", size=10, color=LARANJA_FORTE, italic=True)

    # ── K: Cons. acumulado ──
    if idx == 0:
        formula_k = f"=H{r}"
    else:
        formula_k = f"=K{r-1}+H{r}"
    preencher_celula_formula(we[f"K{r}"], formula_k, VERDE_CLARO)

    # ── L: Juros acumulado ──
    if idx == 0:
        formula_l = f"=D{r}"
    else:
        formula_l = f"=L{r-1}+D{r}"
    preencher_celula_formula(we[f"L{r}"], formula_l, AMARELO_CLARO)

    # ── M: Seguros acumulado ──
    if idx == 0:
        formula_m = f"=E{r}"
    else:
        formula_m = f"=M{r-1}+E{r}"
    preencher_celula_formula(we[f"M{r}"], formula_m, AMARELO_CLARO)

    # ── N: Total AMPLO acumulado ──
    if idx == 0:
        formula_n = f"=I{r}"
    else:
        formula_n = f"=N{r-1}+I{r}"
    preencher_celula_formula(we[f"N{r}"], formula_n, AMARELO)

    # ── O: SALDO TOTAL ATIVÁVEL 31/12 (cons / amplo lado a lado) ──
    # Uso K para cons, N para amplo - mostro o cons mas com nota
    # Melhor: faço duas células empilhadas? Não, deixo o cons em verde escuro destacado
    formula_o = f"=K{r}"
    preencher_celula_formula(we[f"O{r}"], formula_o, VERDE_ESCURO,
                              bold=True, cor_texto=TEXTO_BRANCO)
    we[f"O{r}"].border = borda_media()

linha_fim = ano_para_linha[2035]

# ════════════════════════════════════════════════════════════════════════════
# RESUMO PARA O IR — DESTACADO PARA COPIAR
# ════════════════════════════════════════════════════════════════════════════
linha = linha_fim + 2

we.row_dimensions[linha].height = 26
we.merge_cells(f"A{linha}:O{linha}")
ct = we[f"A{linha}"]
ct.value     = "💰  VALOR A LANÇAR NO IR — Saldo total ativável em 31/12 de cada ano"
ct.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=13)
ct.fill      = PatternFill("solid", fgColor=VERDE_ESCURO)
ct.alignment = Alignment(horizontal="center", vertical="center")
ct.border    = borda_media()

# Cabeçalho do resumo
linha += 1
we.row_dimensions[linha].height = 32
cabecs = [
    ("A","Declaração\n(ano-base)"),
    ("B","Entregar em\n(abr/ano+1)"),
    ("C","CENÁRIO\nCONSERVADOR (R$)"),
    ("D","CENÁRIO\nAMPLO (R$)"),
    ("E","Diferença\n(juros+seguros)"),
    ("F","Saldo Devedor\n(Dívida) 31/12"),
    ("G","Status"),
    ("H","Como preencher na Ficha de Bens e Direitos do IRPF"),
]
we.merge_cells(f"H{linha}:O{linha}")
for col, txt in cabecs:
    c = we[f"{col}{linha}"]
    c.value     = txt
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=10)
    c.fill      = PatternFill("solid", fgColor=VERDE_ESCURO)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()

# Observações por ano
obs_por_ano = {
    2025: "1ª declaração. Discriminar: compra (entrada+ITBI+cartório) + parcelas pagas + benfeitorias.",
    2026: "Acrescentar: parcelas pagas em 2026 + novas benfeitorias.",
    2027: "Acrescentar: parcelas pagas em 2027 + novas benfeitorias.",
    2028: "Acrescentar: parcelas pagas em 2028 + novas benfeitorias.",
    2029: "Acrescentar: parcelas pagas em 2029 + novas benfeitorias.",
    2030: "Acrescentar: parcelas pagas em 2030 + novas benfeitorias.",
    2031: "Acrescentar: parcelas pagas em 2031 + novas benfeitorias.",
    2032: "Acrescentar: parcelas pagas em 2032 + novas benfeitorias.",
    2033: "Acrescentar: parcelas pagas em 2033 + novas benfeitorias.",
    2034: "Acrescentar: parcelas pagas em 2034 + novas benfeitorias.",
    2035: "Acrescentar: parcelas pagas em 2035 + novas benfeitorias.",
}

linha_inicio_resumo = linha + 1
for idx, ano in enumerate(ANOS):
    r = linha_inicio_resumo + idx
    we.row_dimensions[r].height = 28
    fill = AZUL_CLARO if idx % 2 == 0 else BRANCO

    # A: Ano-base
    we[f"A{r}"].value     = ano
    we[f"A{r}"].font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=12)
    we[f"A{r}"].fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
    we[f"A{r}"].alignment = Alignment(horizontal="center", vertical="center")
    we[f"A{r}"].border    = borda_fina()

    # B: Entregar em
    we[f"B{r}"].value     = f"abr/{ano+1}"
    we[f"B{r}"].font      = Font(name="Arial", size=10, italic=True)
    we[f"B{r}"].fill      = PatternFill("solid", fgColor=fill)
    we[f"B{r}"].alignment = Alignment(horizontal="center", vertical="center")
    we[f"B{r}"].border    = borda_fina()

    # C: CONSERVADOR (puxa de K)
    r_dado = ano_para_linha[ano]
    cc = we[f"C{r}"]
    cc.value         = f"=K{r_dado}"
    cc.number_format = FMT_REAL
    cc.font          = Font(name="Arial", bold=True, color=VERDE_ESCURO, size=12)
    cc.fill          = PatternFill("solid", fgColor=VERDE_CLARO)
    cc.alignment     = Alignment(horizontal="right", vertical="center")
    cc.border        = borda_media()

    # D: AMPLO (puxa de N)
    cd = we[f"D{r}"]
    cd.value         = f"=N{r_dado}"
    cd.number_format = FMT_REAL
    cd.font          = Font(name="Arial", bold=True, color=DOURADO_ESC, size=12)
    cd.fill          = PatternFill("solid", fgColor=AMARELO)
    cd.alignment     = Alignment(horizontal="right", vertical="center")
    cd.border        = borda_media()

    # E: Diferença
    ce = we[f"E{r}"]
    ce.value         = f"=D{r}-C{r}"
    ce.number_format = FMT_REAL
    ce.font          = Font(name="Arial", size=10, color="595959")
    ce.fill          = PatternFill("solid", fgColor=fill)
    ce.alignment     = Alignment(horizontal="right", vertical="center")
    ce.border        = borda_fina()

    # F: Saldo devedor
    cf = we[f"F{r}"]
    cf.value         = f"=J{r_dado}"
    cf.number_format = FMT_REAL
    cf.font          = Font(name="Arial", size=10, color=LARANJA_FORTE)
    cf.fill          = PatternFill("solid", fgColor=LARANJA)
    cf.alignment     = Alignment(horizontal="right", vertical="center")
    cf.border        = borda_fina()

    # G: Status
    if ano == 2025:
        status = "✓ Real"
    elif ano == 2026:
        status = "⚠ Parcial"
    else:
        status = "○ Pendente"
    cg = we[f"G{r}"]
    cg.value     = status
    cg.font      = Font(name="Arial", size=10)
    cg.fill      = PatternFill("solid", fgColor=fill)
    cg.alignment = Alignment(horizontal="center", vertical="center")
    cg.border    = borda_fina()

    # H: Observação
    we.merge_cells(f"H{r}:O{r}")
    ch = we[f"H{r}"]
    ch.value     = obs_por_ano.get(ano, "")
    ch.font      = Font(name="Arial", italic=True, size=9, color="595959")
    ch.fill      = PatternFill("solid", fgColor=fill)
    ch.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    ch.border    = borda_fina()

# ════════════════════════════════════════════════════════════════════════════
# LEGENDA E NOTAS
# ════════════════════════════════════════════════════════════════════════════
linha = linha_inicio_resumo + len(ANOS) + 2

we.row_dimensions[linha].height = 24
we.merge_cells(f"A{linha}:O{linha}")
ct = we[f"A{linha}"]
ct.value     = "LEGENDA E PROCEDIMENTO DE ATUALIZAÇÃO ANUAL"
ct.font      = Font(name="Arial", bold=True, color=AZUL_ESCURO, size=12)
ct.fill      = PatternFill("solid", fgColor=AZUL_CLARO)
ct.alignment = Alignment(horizontal="left", vertical="center")
ct.border    = borda_fina()

linha += 1
notas = [
    (AMARELO,
     "🟡 CÉLULAS AMARELAS: preencher com valores reais ao final de cada ano (após receber DDC atualizado do Itaú)."),
    (VERDE_CLARO,
     "🟢 BENFEITORIAS (coluna F): puxa automaticamente da aba 'Lancamentos' por ano. Sobrescreva apenas se quiser ajuste manual."),
    (LARANJA,
     "🟠 SALDO DEVEDOR (coluna J/F resumo): vai na ficha 'Dívidas e Ônus Reais' do IRPF — NÃO é custo do imóvel."),
    (VERDE_CLARO,
     "✓ STATUS Real = valores efetivamente pagos confirmados."),
    (AMARELO_CLARO,
     "⚠ STATUS Parcial = ano ainda em curso, alguns meses pagos (caso do 2026 com 4 parcelas até abr/26)."),
    (CINZA,
     "○ STATUS Pendente = preencher após o final do ano com os valores reais do DDC."),
    (VERDE_CLARO,
     "✓ COLUNA C (Conservador): aquisição + amortização + benfeitorias. Valor mais seguro com a Receita."),
    (AMARELO,
     "⚠ COLUNA D (Amplo): inclui juros + seguros (IN RFB 84/2001 art.17, V). Confirmar com contador."),
    (CINZA,
     "ℹ COMO ATUALIZAR: ao final de cada ano (dez), peça novo DDC ao Itaú e preencha as colunas C, D, E e J da linha do ano correspondente. As demais colunas calculam automaticamente."),
]
for fill, texto in notas:
    we.row_dimensions[linha].height = 22
    we.merge_cells(f"A{linha}:O{linha}")
    c = we[f"A{linha}"]
    c.value     = texto
    c.font      = Font(name="Arial", size=9)
    c.fill      = PatternFill("solid", fgColor=fill)
    c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    c.border    = borda_fina()
    linha += 1

# ── LARGURAS ──────────────────────────────────────────────────────────────────
larguras = {
    "A":8,"B":13,"C":13,"D":13,"E":13,"F":13,"G":11,
    "H":13,"I":13,"J":15,"K":13,"L":13,"M":13,"N":14,"O":17
}
for col, w in larguras.items():
    we.column_dimensions[col].width = w

# Freeze panes para facilitar navegação (acima da linha de dados)
we.freeze_panes = "B9"

wb.save(OUTPUT_PATH)
print("Salvo!")
print(f"\nLinhas dos anos:")
for ano, ln in ano_para_linha.items():
    print(f"  {ano}: linha {ln}")
print(f"\nLinhas do resumo IR: {linha_inicio_resumo} a {linha_inicio_resumo + len(ANOS) - 1}")
