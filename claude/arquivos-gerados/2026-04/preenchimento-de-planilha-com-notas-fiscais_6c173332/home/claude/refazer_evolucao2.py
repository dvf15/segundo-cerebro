from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

# Paleta
AZUL_ESCURO   = "1F3864"
AZUL_MEDIO    = "2E75B6"
AZUL_CLARO    = "D6E4F0"
VERDE_ESCURO  = "1D6038"
VERDE_CLARO   = "E2EFDA"
AMARELO       = "FFF2CC"
LARANJA_FORTE = "ED7D31"
LARANJA       = "FCE4D6"
CINZA         = "F2F2F2"
BRANCO        = "FFFFFF"
TEXTO_BRANCO  = "FFFFFF"
TEXTO_ESCURO  = "1F1F1F"
DOURADO       = "BF8F00"
AZUL_INPUT    = "DEEBF7"   # cor de "célula editável"

FMT_REAL = 'R$ #,##0.00'

def borda_fina():
    s = Side(border_style="thin", color="BFBFBF")
    return Border(left=s, right=s, top=s, bottom=s)
def borda_media():
    s = Side(border_style="medium", color="1F3864")
    return Border(left=s, right=s, top=s, bottom=s)
def borda_input():
    s = Side(border_style="thin", color="2E75B6")
    return Border(left=s, right=s, top=s, bottom=s)

wb = load_workbook('/mnt/user-data/outputs/Controle_Gastos_Obra_Pro_IR.xlsx')

# ────── DADOS ANUAIS — só preencher onde efetivamente pago ──────────
# Aquisição em 2025
aquisicao_2025 = 1500000.00 + 96000.00 + 12897.67  # 1.608.897,67

# 2025: parcelas 1-3 PAGAS (3 parcelas)
amort_2025   = 4446.36 + 4454.10 + 4461.45                          # 13.361,91
juros_2025   = 16401.83 + 16387.48 + 16371.55                       # 49.160,86
mip_2025     = 2015.28 + 1006.76 + 1005.78                          # 4.027,82
dfi_2025     = 409.56 +  205.14 +  205.48                           # 820,18
seguros_2025 = mip_2025 + dfi_2025                                  # 4.847,99 (~4.848)

# 2026: parcelas 4-7 PAGAS (jan-abr 2026), demais ainda não foram pagas
# Como a planilha foi solicitada para refletir só o que foi pago,
# vou preencher 2026 só com as 4 parcelas pagas até abr/2026
amort_2026_pago   = 4469.20 + 4476.79 + 4484.39 + 4491.96            # 17.922,34
juros_2026_pago   = 16356.96 + 16341.63 + 16326.17 + 16310.45        # 65.335,21
mip_2026_pago     = 1004.88 + 1003.94 + 1002.99 + 1002.02            # 4.013,83
dfi_2026_pago     = 205.83 + 206.18 + 206.53 + 206.88                # 825,42
seguros_2026_pago = mip_2026_pago + dfi_2026_pago                    # 4.839,25

# Lista anos 2025-2035
anos = list(range(2025, 2036))  # 11 anos

# Saldo devedor ao fim de cada ano (do DDC)
saldos_devedores = {
    2025: 1695349.86,   # após parcela 3 (29/12/2025)
    2026: 1653039.95,   # após parcela 15 (29/12/2026)
    2027: 1599136.43,   # após parcela 27 (29/12/2027)
    2028: 1545232.91,   # após parcela 39 (29/12/2028)
    2029: 1491329.39,   # após parcela 51 (29/12/2029)
    2030: 1437425.87,   # após parcela 63 (29/12/2030)
    2031: 1383522.35,   # após parcela 75 (29/12/2031)
    2032: 1329618.83,   # após parcela 87 (29/12/2032)
    2033: 1275715.31,   # após parcela 99 (29/12/2033)
    2034: 1221811.79,   # após parcela 111 (29/12/2034)
    2035: 1167908.30,   # após parcela 123 (29/12/2035)
}

# ════════════════════════════════════════════════════════════════════
# REFAZER ABA Evolucao_Anual_IR
# ════════════════════════════════════════════════════════════════════
if "Evolucao_Anual_IR" in wb.sheetnames:
    del wb["Evolucao_Anual_IR"]

we = wb.create_sheet("Evolucao_Anual_IR")

# ── HEADER ──────────────────────────────────────────────────────────
we.merge_cells("A1:N1")
c = we["A1"]
c.value     = "EVOLUÇÃO ANUAL DO CUSTO ATIVÁVEL — DECLARAÇÃO DE BENS E DIREITOS (IR)"
c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=13)
c.fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
c.alignment = Alignment(horizontal="center", vertical="center")
we.row_dimensions[1].height = 30

we.merge_cells("A2:N2")
c2 = we["A2"]
c2.value     = "Palm Hill Casa 4 | Apenas valores EFETIVAMENTE PAGOS são acumulados"
c2.font      = Font(name="Arial", italic=True, color=AZUL_ESCURO, size=10)
c2.fill      = PatternFill("solid", fgColor=AZUL_CLARO)
c2.alignment = Alignment(horizontal="center", vertical="center")
we.row_dimensions[2].height = 18

we.row_dimensions[3].height = 8

# ── INSTRUÇÕES ──────────────────────────────────────────────────────
we.merge_cells("A4:N4")
c4 = we["A4"]
c4.value     = ("📋 COMO USAR: Ao final de cada ano, atualize as colunas em FUNDO AZUL CLARO com os "
                "valores reais pagos (consulte o DDC do Itaú no app/agência). A coluna 'Benfeitorias' "
                "atualiza sozinha conforme você lança gastos na aba 'Lancamentos'. Os totais e saldos "
                "acumulados são calculados automaticamente.")
c4.font      = Font(name="Arial", italic=True, color="7F3F00", size=9)
c4.fill      = PatternFill("solid", fgColor=AMARELO)
c4.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
c4.border    = borda_fina()
we.row_dimensions[4].height = 50

we.row_dimensions[5].height = 8

# ════════════════════════════════════════════════════════════════════
# TABELA 1 — CENÁRIO CONSERVADOR
# ════════════════════════════════════════════════════════════════════
linha = 6
we.row_dimensions[linha].height = 24
we.merge_cells(f"A{linha}:N{linha}")
ct = we[f"A{linha}"]
ct.value     = "CENÁRIO CONSERVADOR — Aquisição + Amortização + Benfeitorias"
ct.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=12)
ct.fill      = PatternFill("solid", fgColor=VERDE_ESCURO)
ct.alignment = Alignment(horizontal="left", vertical="center")
ct.border    = borda_media()

# Cabeçalho duplo
linha += 1  # 7
we.row_dimensions[linha].height = 20
we.row_dimensions[linha+1].height = 32

we.merge_cells(f"A{linha}:A{linha+1}")
we[f"A{linha}"].value = "Ano"
we.merge_cells(f"B{linha}:F{linha}")
we[f"B{linha}"].value = "PAGO NO ANO (movimentação)"
we.merge_cells(f"G{linha}:K{linha}")
we[f"G{linha}"].value = "SALDO ACUMULADO EM 31/12 (a declarar no IR)"
we.merge_cells(f"L{linha}:L{linha+1}")
we[f"L{linha}"].value = "Status\nfinanc."
we.merge_cells(f"M{linha}:M{linha+1}")
we[f"M{linha}"].value = "Saldo devedor\n31/12 (R$)"
we.merge_cells(f"N{linha}:N{linha+1}")
we[f"N{linha}"].value = "Observações"

for col in ["A","B","G","L","M","N"]:
    c = we[f"{col}{linha}"]
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=10)
    c.fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()

linha += 1  # 8
sub_cols = [
    ("B", "Aquisição\n(R$)",        "input"),
    ("C", "Amortização\n(R$)",      "input"),
    ("D", "Benfeitorias\n(R$)",     "auto"),
    ("E", "Outros\n(R$)",           "input"),
    ("F", "TOTAL pago\nano (R$)",   "calc"),
    ("G", "Aquisição\nacum.",       "calc"),
    ("H", "Amortização\nacum.",     "calc"),
    ("I", "Benfeitorias\nacum.",    "calc"),
    ("J", "Outros\nacum.",          "calc"),
    ("K", "💰 SALDO TOTAL\nem 31/12", "calc"),
]
for col, txt, _ in sub_cols:
    c = we[f"{col}{linha}"]
    c.value     = txt
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=9)
    c.fill      = PatternFill("solid", fgColor=AZUL_MEDIO)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()

# ── DADOS — CONSERVADOR ─────────────────────────────────────────────
# Para 2025: tudo pago. Para 2026: aquisição=0, amortização=parcial. Demais anos em branco.

linha_inicio_cons = linha + 1  # 9

def aplicar_estilo(cell, tipo, fill_linha, bold=False):
    """tipo: 'input' (azul claro editável), 'auto' (verde claro fórmula), 'calc' (cinza calculado)"""
    if tipo == "input":
        cell.fill = PatternFill("solid", fgColor=AZUL_INPUT)
        cell.border = borda_input()
        cell.font = Font(name="Arial", size=10, color=TEXTO_ESCURO)
    elif tipo == "auto":
        cell.fill = PatternFill("solid", fgColor=VERDE_CLARO)
        cell.border = borda_fina()
        cell.font = Font(name="Arial", size=10, color=VERDE_ESCURO, italic=True)
    elif tipo == "calc":
        cell.fill = PatternFill("solid", fgColor=fill_linha)
        cell.border = borda_fina()
        cell.font = Font(name="Arial", size=10, bold=bold)
    cell.alignment = Alignment(horizontal="right", vertical="center")
    cell.number_format = FMT_REAL

# Dados pré-preenchidos do que JÁ foi pago
valores_pre = {
    2025: {'aquis': aquisicao_2025, 'amort': amort_2025,
           'juros': juros_2025, 'seguros': seguros_2025,
           'status_f': "Pago (3/3)",
           'obs': "Compra: entrada R$1,5M + ITBI + cartório. 3 parcelas pagas. 2 NF Bambu pagas (50% ativável)."},
    2026: {'aquis': 0, 'amort': amort_2026_pago,
           'juros': juros_2026_pago, 'seguros': seguros_2026_pago,
           'status_f': "Parcial (4/12)",
           'obs': "ATENÇÃO: só 4 parcelas pagas (jan-abr/2026). Atualizar com o restante ao fim do ano."},
}

for idx, ano in enumerate(anos):
    r = linha_inicio_cons + idx
    we.row_dimensions[r].height = 22
    fill_l = AZUL_CLARO if idx % 2 == 0 else BRANCO

    # A: Ano
    we[f"A{r}"].value     = ano
    we[f"A{r}"].font      = Font(name="Arial", bold=True, size=11)
    we[f"A{r}"].alignment = Alignment(horizontal="center", vertical="center")
    we[f"A{r}"].fill      = PatternFill("solid", fgColor=fill_l)
    we[f"A{r}"].border    = borda_fina()

    # B: Aquisição (input — só preenchido em 2025)
    cb = we[f"B{r}"]
    cb.value = valores_pre[ano]['aquis'] if ano in valores_pre else None
    aplicar_estilo(cb, "input", fill_l)

    # C: Amortização (input — preenchido em 2025/2026)
    cc = we[f"C{r}"]
    cc.value = valores_pre[ano]['amort'] if ano in valores_pre else None
    aplicar_estilo(cc, "input", fill_l)

    # D: Benfeitorias (FÓRMULA dinâmica de Lancamentos, com permissão de sobrescrita)
    # Fórmula: SUMIFS(Lancamentos.S, Lancamentos.C, ano)
    cd = we[f"D{r}"]
    cd.value = f'=SUMIFS(Lancamentos!$S$2:$S$1000,Lancamentos!$C$2:$C$1000,A{r})'
    aplicar_estilo(cd, "auto", fill_l)

    # E: Outros (input — sempre vazio para preenchimento manual)
    ce = we[f"E{r}"]
    ce.value = None
    aplicar_estilo(ce, "input", fill_l)

    # F: TOTAL pago no ano (calc)
    cf = we[f"F{r}"]
    cf.value = f'=N(B{r})+N(C{r})+N(D{r})+N(E{r})'
    cf.fill = PatternFill("solid", fgColor=VERDE_CLARO)
    cf.border = borda_fina()
    cf.font = Font(name="Arial", size=10, bold=True)
    cf.alignment = Alignment(horizontal="right", vertical="center")
    cf.number_format = FMT_REAL

    # G-J: Acumulados (calc)
    for col_p, col_a in [("B","G"),("C","H"),("D","I"),("E","J")]:
        c = we[f"{col_a}{r}"]
        if idx == 0:
            c.value = f"=N({col_p}{r})"
        else:
            c.value = f"={col_a}{r-1}+N({col_p}{r})"
        aplicar_estilo(c, "calc", fill_l)

    # K: SALDO TOTAL acumulado (destacado)
    ck = we[f"K{r}"]
    ck.value = f"=G{r}+H{r}+I{r}+J{r}"
    ck.number_format = FMT_REAL
    ck.font = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=11)
    ck.fill = PatternFill("solid", fgColor=VERDE_ESCURO)
    ck.alignment = Alignment(horizontal="right", vertical="center")
    ck.border = borda_fina()

    # L: Status do financiamento
    cl = we[f"L{r}"]
    cl.value = valores_pre[ano]['status_f'] if ano in valores_pre else "—"
    cl.font = Font(name="Arial", size=9)
    cl.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cl.fill = PatternFill("solid", fgColor=fill_l)
    cl.border = borda_fina()

    # M: Saldo devedor 31/12 (informativo, do DDC)
    cm = we[f"M{r}"]
    cm.value = saldos_devedores.get(ano)
    cm.number_format = FMT_REAL
    cm.font = Font(name="Arial", size=9, color=LARANJA_FORTE, italic=True)
    cm.alignment = Alignment(horizontal="right", vertical="center")
    cm.fill = PatternFill("solid", fgColor=fill_l)
    cm.border = borda_fina()

    # N: Observações
    cn = we[f"N{r}"]
    cn.value = valores_pre[ano]['obs'] if ano in valores_pre else "Preencher ao final do ano com valores reais do DDC."
    cn.font = Font(name="Arial", italic=True, size=9, color="595959")
    cn.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    cn.fill = PatternFill("solid", fgColor=fill_l)
    cn.border = borda_fina()

linha_fim_cons = linha_inicio_cons + len(anos) - 1   # 19

# ════════════════════════════════════════════════════════════════════
# TABELA 2 — CENÁRIO AMPLO
# ════════════════════════════════════════════════════════════════════
linha = linha_fim_cons + 2  # 21
we.row_dimensions[linha].height = 24
we.merge_cells(f"A{linha}:N{linha}")
ct = we[f"A{linha}"]
ct.value     = "CENÁRIO AMPLO — Inclui juros e seguros obrigatórios (MIP/DFI)"
ct.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=12)
ct.fill      = PatternFill("solid", fgColor="7F6000")
ct.alignment = Alignment(horizontal="left", vertical="center")
ct.border    = borda_media()

linha += 1
we.row_dimensions[linha].height = 20
we.row_dimensions[linha+1].height = 32

we.merge_cells(f"A{linha}:A{linha+1}")
we[f"A{linha}"].value = "Ano"
we.merge_cells(f"B{linha}:G{linha}")
we[f"B{linha}"].value = "PAGO NO ANO (movimentação)"
we.merge_cells(f"H{linha}:M{linha}")
we[f"H{linha}"].value = "SALDO ACUMULADO EM 31/12 (a declarar no IR)"
we.merge_cells(f"N{linha}:N{linha+1}")
we[f"N{linha}"].value = "Observações"

for col in ["A","B","H","N"]:
    c = we[f"{col}{linha}"]
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=10)
    c.fill      = PatternFill("solid", fgColor="7F6000")
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()

linha += 1
sub_amplo = [
    ("B", "Aquisição\n(R$)",      "input"),
    ("C", "Amortização\n(R$)",    "input"),
    ("D", "Juros\n(R$)",          "input"),
    ("E", "Seguros\nMIP+DFI",     "input"),
    ("F", "Benfeitorias\n(R$)",   "auto"),
    ("G", "TOTAL pago\nano",      "calc"),
    ("H", "Aquisição\nacum.",     "calc"),
    ("I", "Amortiz.\nacum.",      "calc"),
    ("J", "Juros\nacum.",         "calc"),
    ("K", "Seguros\nacum.",       "calc"),
    ("L", "Benfeit.\nacum.",      "calc"),
    ("M", "💰 SALDO TOTAL\nem 31/12", "calc"),
]
for col, txt, _ in sub_amplo:
    c = we[f"{col}{linha}"]
    c.value     = txt
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=9)
    c.fill      = PatternFill("solid", fgColor=DOURADO)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()

linha_inicio_ampl = linha + 1  # 24

for idx, ano in enumerate(anos):
    r = linha_inicio_ampl + idx
    we.row_dimensions[r].height = 22
    fill_l = AMARELO if idx % 2 == 0 else BRANCO

    we[f"A{r}"].value     = ano
    we[f"A{r}"].font      = Font(name="Arial", bold=True, size=11)
    we[f"A{r}"].alignment = Alignment(horizontal="center", vertical="center")
    we[f"A{r}"].fill      = PatternFill("solid", fgColor=fill_l)
    we[f"A{r}"].border    = borda_fina()

    # B: Aquisição
    cb = we[f"B{r}"]
    cb.value = valores_pre[ano]['aquis'] if ano in valores_pre else None
    aplicar_estilo(cb, "input", fill_l)

    # C: Amortização
    cc = we[f"C{r}"]
    cc.value = valores_pre[ano]['amort'] if ano in valores_pre else None
    aplicar_estilo(cc, "input", fill_l)

    # D: Juros
    cd = we[f"D{r}"]
    cd.value = valores_pre[ano]['juros'] if ano in valores_pre else None
    aplicar_estilo(cd, "input", fill_l)

    # E: Seguros
    ce = we[f"E{r}"]
    ce.value = valores_pre[ano]['seguros'] if ano in valores_pre else None
    aplicar_estilo(ce, "input", fill_l)

    # F: Benfeitorias (fórmula automática)
    cf = we[f"F{r}"]
    cf.value = f'=SUMIFS(Lancamentos!$S$2:$S$1000,Lancamentos!$C$2:$C$1000,A{r})'
    aplicar_estilo(cf, "auto", fill_l)

    # G: TOTAL pago no ano
    cg = we[f"G{r}"]
    cg.value = f'=N(B{r})+N(C{r})+N(D{r})+N(E{r})+N(F{r})'
    cg.fill = PatternFill("solid", fgColor=AMARELO)
    cg.border = borda_fina()
    cg.font = Font(name="Arial", size=10, bold=True)
    cg.alignment = Alignment(horizontal="right", vertical="center")
    cg.number_format = FMT_REAL

    # H-L: Acumulados
    for col_p, col_a in [("B","H"),("C","I"),("D","J"),("E","K"),("F","L")]:
        c = we[f"{col_a}{r}"]
        if idx == 0:
            c.value = f"=N({col_p}{r})"
        else:
            c.value = f"={col_a}{r-1}+N({col_p}{r})"
        aplicar_estilo(c, "calc", fill_l)

    # M: TOTAL acumulado
    cm = we[f"M{r}"]
    cm.value = f"=H{r}+I{r}+J{r}+K{r}+L{r}"
    cm.number_format = FMT_REAL
    cm.font = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=11)
    cm.fill = PatternFill("solid", fgColor="7F6000")
    cm.alignment = Alignment(horizontal="right", vertical="center")
    cm.border = borda_fina()

    # N: Observações
    cn = we[f"N{r}"]
    cn.value = valores_pre[ano]['obs'] if ano in valores_pre else "Preencher ao final do ano com valores reais do DDC."
    cn.font = Font(name="Arial", italic=True, size=9, color="595959")
    cn.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    cn.fill = PatternFill("solid", fgColor=fill_l)
    cn.border = borda_fina()

linha_fim_ampl = linha_inicio_ampl + len(anos) - 1   # 34

# ════════════════════════════════════════════════════════════════════
# RESUMO PARA O IR — VALOR A LANÇAR EM 31/12 DE CADA ANO
# ════════════════════════════════════════════════════════════════════
linha = linha_fim_ampl + 2   # 36
we.row_dimensions[linha].height = 26
we.merge_cells(f"A{linha}:N{linha}")
ct = we[f"A{linha}"]
ct.value     = "📊 RESUMO IR — VALOR A LANÇAR NO 'BENS E DIREITOS' EM 31/12 DE CADA ANO"
ct.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=13)
ct.fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
ct.alignment = Alignment(horizontal="left", vertical="center")
ct.border    = borda_media()

linha += 1
we.row_dimensions[linha].height = 38
cabecs = [
    ("A", "Ano-base IR\n(declarar em ANO+1)"),
    ("B", "💰 Cenário\nCONSERVADOR (R$)"),
    ("C", "💰 Cenário\nAMPLO (R$)"),
    ("D", "Diferença"),
    ("E", "Saldo devedor\nem Dívidas e Ônus"),
    ("F", "Como declarar (orientação para discriminação)"),
]
we.merge_cells(f"F{linha}:N{linha}")
for col, txt in cabecs:
    c = we[f"{col}{linha}"]
    c.value     = txt
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=10)
    c.fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()

linha_inicio_resumo = linha + 1   # 38

for idx, ano in enumerate(anos):
    r = linha_inicio_resumo + idx
    we.row_dimensions[r].height = 32
    fill_l = AZUL_CLARO if idx % 2 == 0 else BRANCO

    # A: Ano (com label "declarar em")
    we.merge_cells(f"A{r}:A{r}")
    ca = we[f"A{r}"]
    ca.value = f"{ano}\n(IR {ano+1})"
    ca.font = Font(name="Arial", bold=True, size=11, color=AZUL_ESCURO)
    ca.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    ca.fill = PatternFill("solid", fgColor=fill_l)
    ca.border = borda_fina()

    # B: Conservador (puxar de K da tabela conservador)
    r_cons = linha_inicio_cons + idx
    cb = we[f"B{r}"]
    cb.value = f"=K{r_cons}"
    cb.number_format = FMT_REAL
    cb.font = Font(name="Arial", bold=True, size=12, color=VERDE_ESCURO)
    cb.alignment = Alignment(horizontal="right", vertical="center")
    cb.fill = PatternFill("solid", fgColor=VERDE_CLARO)
    cb.border = borda_media()

    # C: Amplo (puxar de M da tabela ampla)
    r_ampl = linha_inicio_ampl + idx
    cc = we[f"C{r}"]
    cc.value = f"=M{r_ampl}"
    cc.number_format = FMT_REAL
    cc.font = Font(name="Arial", bold=True, size=12, color="7F3F00")
    cc.alignment = Alignment(horizontal="right", vertical="center")
    cc.fill = PatternFill("solid", fgColor=AMARELO)
    cc.border = borda_media()

    # D: Diferença
    cd = we[f"D{r}"]
    cd.value = f"=C{r}-B{r}"
    cd.number_format = FMT_REAL
    cd.font = Font(name="Arial", bold=True, size=10)
    cd.alignment = Alignment(horizontal="right", vertical="center")
    cd.fill = PatternFill("solid", fgColor=fill_l)
    cd.border = borda_fina()

    # E: Saldo devedor (informativo - vai em outra ficha)
    ce = we[f"E{r}"]
    ce.value = saldos_devedores.get(ano)
    ce.number_format = FMT_REAL
    ce.font = Font(name="Arial", bold=True, size=10, color=LARANJA_FORTE)
    ce.alignment = Alignment(horizontal="right", vertical="center")
    ce.fill = PatternFill("solid", fgColor=LARANJA)
    ce.border = borda_fina()

    # F: Orientação
    we.merge_cells(f"F{r}:N{r}")
    cf = we[f"F{r}"]
    if ano == 2025:
        obs = ("📝 1ª declaração do imóvel (IR 2026, ano-base 2025). "
               "Discriminar: 'Imóvel Casa 4 Cond. Palm Hill, adquirido em 29/09/2025 por R$3.200.000,00 "
               "(financiado em R$1.700.000), conf. matrícula nº 330.365 11º RI/SP. ITBI R$96.000,00. "
               "Pagas 3 parcelas + 2 NF arquitetura.'")
    elif ano == 2026:
        obs = ("📝 Atualizar discriminação: '...em 2026 foram pagas 12 parcelas do financiamento + benfeitorias do ano.' "
               "Custo acumulado a declarar = saldo de 2025 + movimentação 2026.")
    else:
        obs = (f"📝 Atualizar discriminação: '...em {ano} foram pagas 12 parcelas + benfeitorias do ano.' "
               f"Continuar acumulando custo ano a ano.")
    cf.value = obs
    cf.font = Font(name="Arial", italic=True, size=9, color="595959")
    cf.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    cf.fill = PatternFill("solid", fgColor=fill_l)
    cf.border = borda_fina()

# ════════════════════════════════════════════════════════════════════
# LEGENDA E NOTAS
# ════════════════════════════════════════════════════════════════════
linha = linha_inicio_resumo + len(anos) + 1   # 50

we.row_dimensions[linha].height = 24
we.merge_cells(f"A{linha}:N{linha}")
ct = we[f"A{linha}"]
ct.value     = "LEGENDA E NOTAS METODOLÓGICAS"
ct.font      = Font(name="Arial", bold=True, color=AZUL_ESCURO, size=12)
ct.fill      = PatternFill("solid", fgColor=AZUL_CLARO)
ct.alignment = Alignment(horizontal="left", vertical="center")
ct.border    = borda_fina()

linha += 1
notas = [
    (AZUL_INPUT,
     "🔵 CÉLULAS EDITÁVEIS (azul claro, borda azul): preencher a cada ano com valores reais do DDC do Itaú."),
    (VERDE_CLARO,
     "🟢 CÉLULAS AUTOMÁTICAS (verde, itálico): coluna 'Benfeitorias' puxa direto da aba Lancamentos por ano. Pode sobrescrever digitando um valor."),
    (LARANJA,
     "🟠 SALDO DEVEDOR: NÃO é custo do imóvel — é DÍVIDA. Vai na ficha 'Dívidas e Ônus Reais' do IRPF."),
    (VERDE_CLARO,
     "✓ CONSERVADOR: aquisição + amortização + benfeitorias. Posição segura com a Receita."),
    (AMARELO,
     "✓ AMPLO: + juros + seguros (MIP/DFI). Amparo: IN RFB 84/2001 art. 17, V. Confirmar com contador."),
    (CINZA,
     "ℹ Aquisição em 2025 = R$1.608.897,67 (entrada R$1.500.000 + ITBI R$96.000 + cartório R$12.897,67). NÃO inclui o saldo do financiamento."),
    (CINZA,
     "ℹ Como atualizar: ao receber o DDC anual do Itaú, copie os valores totais do ano para as células da linha do ano correspondente."),
]
for fill, texto in notas:
    we.row_dimensions[linha].height = 26
    we.merge_cells(f"A{linha}:N{linha}")
    c = we[f"A{linha}"]
    c.value     = texto
    c.font      = Font(name="Arial", size=9)
    c.fill      = PatternFill("solid", fgColor=fill)
    c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    c.border    = borda_fina()
    linha += 1

# ── LARGURAS ────────────────────────────────────────────────────────
larguras = {"A":11,"B":15,"C":15,"D":15,"E":15,"F":15,"G":14,"H":14,
            "I":14,"J":14,"K":18,"L":13,"M":15,"N":40}
for col, w in larguras.items():
    we.column_dimensions[col].width = w

# Congelar painéis para facilitar navegação
we.freeze_panes = "B9"

wb.save('/mnt/user-data/outputs/Controle_Gastos_Obra_Pro_IR.xlsx')
print("Salvo!")
print(f"Anos: 2025 a 2035 ({len(anos)} linhas)")
print(f"Linha início conservador: {linha_inicio_cons}, fim: {linha_fim_cons}")
print(f"Linha início ampliado:    {linha_inicio_ampl}, fim: {linha_fim_ampl}")
print(f"Linha início resumo:      {linha_inicio_resumo}")
