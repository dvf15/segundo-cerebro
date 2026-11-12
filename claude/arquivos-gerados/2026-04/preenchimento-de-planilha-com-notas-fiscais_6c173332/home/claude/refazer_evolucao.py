from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from datetime import datetime

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

FMT_REAL    = 'R$ #,##0.00'
FMT_INTEIRO = '#,##0'

def borda_fina():
    s = Side(border_style="thin", color="BFBFBF")
    return Border(left=s, right=s, top=s, bottom=s)
def borda_media():
    s = Side(border_style="medium", color="1F3864")
    return Border(left=s, right=s, top=s, bottom=s)

wb = load_workbook('/mnt/user-data/outputs/Controle_Gastos_Obra_Pro_IR.xlsx')

# ════════════════════════════════════════════════════════════════════════════
# DADOS BASE — pagamentos efetivos por ano
# ════════════════════════════════════════════════════════════════════════════

# AQUISIÇÃO em 2025 (efetivamente pago - não inclui o saldo do financiamento)
# Entrada própria + ITBI + Emolumentos + Tarifa avaliação
aquisicao_2025 = 1500000.00 + 96000.00 + 12897.67  # = 1.608.897,67

# AMORTIZAÇÃO POR ANO (extraído do DDC)
# 2025: parcelas 1-3 (out, nov, dez) - PAGAS
# 2026: parcelas 4-15 - 4 pagas + 8 projetadas
# 2027+: projetadas
amort_por_ano = {
    2025: 4446.36 + 4454.10 + 4461.45,                          # 13.361,91
    2026: (4469.20 + 4476.79 + 4484.39 + 4491.96 +              # pagas
           4491.96 + 4491.96 + 4491.96 + 4491.96 +              # projetadas
           4491.96 + 4491.96 + 4491.96 + 4491.96),              # 53.858,02
    2027: 4491.96 * 12,                                          # 53.903,52
    2028: 4491.96 * 12,                                          # 53.903,52
}

# JUROS POR ANO
juros_por_ano = {
    2025: 16401.83 + 16387.48 + 16371.55,                       # 49.160,86
    2026: (16356.96 + 16341.63 + 16326.17 + 16310.45 +
           16267.19 + 16223.92 + 16180.66 + 16137.40 +
           16094.13 + 16050.87 + 16007.61 + 15964.34),          # 194.261,33
    2027: (15921.08 + 15877.81 + 15834.55 + 15791.29 +
           15748.02 + 15704.76 + 15661.49 + 15618.23 +
           15574.97 + 15531.70 + 15488.44 + 15445.18),          # 188.197,52
    2028: (15401.91 + 15358.65 + 15315.38 + 15272.12 +
           15228.86 + 15185.59 + 15142.33 + 15099.06 +
           15055.80 + 15012.54 + 14969.27 + 14926.01),          # 181.967,52
}

# SEGUROS (MIP+DFI) POR ANO
seguros_por_ano = {
    2025: (2015.28 + 1006.76 + 1005.78) + (409.56 + 205.14 + 205.48),       # 4.847,99
    2026: ((1004.88+1003.94+1002.99+1002.02+999.37+1085.28+
            1082.39+1084.38+1081.48+1078.57+1075.66+1072.75) +
           (205.83+206.18+206.53+206.88+206.88+206.88+
            206.88+206.88+206.88+206.88+206.88+206.88)),
    2027: ((1069.85+1066.94+1064.03+1061.13+1058.22+1145.84+
            1142.68+1144.52+1141.35+1138.18+1135.01+1131.84) +
            206.88*12),
    2028: ((1128.67+1125.50+1122.33+1119.16+1115.99+1255.47+
            1251.89+1256.19+1252.59+1248.99+1245.39+1241.79) +
            206.88*12),
}

# BENFEITORIAS POR ANO (lançamentos da aba Lancamentos com % ativável aplicado)
# 2025: Bambu parc 1 (10.400) + Bambu parc 2 (10.400) = 20.800 x 50% = 10.400
# Decoração GoStudio = 0% ativável
benfeitorias_por_ano = {
    2025: 10400.00,
    2026: 0.00,
    2027: 0.00,
    2028: 0.00,
}

print("=== Valores anuais (lógica corrigida) ===")
for ano in [2025, 2026, 2027, 2028]:
    print(f"\n{ano}:")
    aq = aquisicao_2025 if ano == 2025 else 0
    print(f"  Aquisição:    R$ {aq:>12,.2f}")
    print(f"  Amortização:  R$ {amort_por_ano[ano]:>12,.2f}")
    print(f"  Juros:        R$ {juros_por_ano[ano]:>12,.2f}")
    print(f"  Seguros:      R$ {seguros_por_ano[ano]:>12,.2f}")
    print(f"  Benfeitorias: R$ {benfeitorias_por_ano[ano]:>12,.2f}")
    cons = aq + amort_por_ano[ano] + benfeitorias_por_ano[ano]
    ampl = cons + juros_por_ano[ano] + seguros_por_ano[ano]
    print(f"  TOTAL CONS:   R$ {cons:>12,.2f}")
    print(f"  TOTAL AMPLO:  R$ {ampl:>12,.2f}")

# ════════════════════════════════════════════════════════════════════════════
# REFAZER ABA Evolucao_Anual_IR
# ════════════════════════════════════════════════════════════════════════════
if "Evolucao_Anual_IR" in wb.sheetnames:
    del wb["Evolucao_Anual_IR"]

we = wb.create_sheet("Evolucao_Anual_IR")

# ── HEADER ────────────────────────────────────────────────────────────────────
we.merge_cells("A1:N1")
c = we["A1"]
c.value     = "EVOLUÇÃO ANUAL DO CUSTO ATIVÁVEL — DECLARAÇÃO DE BENS E DIREITOS (IR)"
c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=13)
c.fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
c.alignment = Alignment(horizontal="center", vertical="center")
we.row_dimensions[1].height = 30

we.merge_cells("A2:N2")
c2 = we["A2"]
c2.value     = ("Palm Hill Casa 4 | Apenas valores EFETIVAMENTE PAGOS são acumulados (saldo do financiamento NÃO entra)")
c2.font      = Font(name="Arial", italic=True, color=AZUL_ESCURO, size=10)
c2.fill      = PatternFill("solid", fgColor=AZUL_CLARO)
c2.alignment = Alignment(horizontal="center", vertical="center")
we.row_dimensions[2].height = 18

we.row_dimensions[3].height = 8

# ── ALERTA METODOLÓGICO ───────────────────────────────────────────────────────
we.merge_cells("A4:N4")
c4 = we["A4"]
c4.value     = ("⚠ LÓGICA: A 'Aquisição' em 2025 inclui APENAS o que saiu do bolso (entrada R$1.500.000 + "
                "ITBI R$96.000 + cartório R$12.897,67 = R$1.608.897,67). O saldo do financiamento "
                "(R$1.700.000) NÃO é custo — é dívida. Vai sendo ativado ano a ano, conforme cada parcela "
                "é paga (amortização).")
c4.font      = Font(name="Arial", italic=True, color="7F3F00", size=9)
c4.fill      = PatternFill("solid", fgColor=AMARELO)
c4.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
c4.border    = borda_fina()
we.row_dimensions[4].height = 48

we.row_dimensions[5].height = 8

# ════════════════════════════════════════════════════════════════════════════
# TABELA 1 — CENÁRIO CONSERVADOR
# ════════════════════════════════════════════════════════════════════════════
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
we.row_dimensions[linha+1].height = 30

we.merge_cells(f"A{linha}:A{linha+1}")
we[f"A{linha}"].value = "Ano"
we.merge_cells(f"B{linha}:F{linha}")
we[f"B{linha}"].value = "PAGO NO ANO (movimentação)"
we.merge_cells(f"G{linha}:K{linha}")
we[f"G{linha}"].value = "SALDO ACUMULADO EM 31/12 (a declarar)"
we.merge_cells(f"L{linha}:L{linha+1}")
we[f"L{linha}"].value = "Status\nfinanc."
we.merge_cells(f"M{linha}:M{linha+1}")
we[f"M{linha}"].value = "Status\nobra"
we.merge_cells(f"N{linha}:N{linha+1}")
we[f"N{linha}"].value = "Observações"
for col in ["A","B","G","L","M","N"]:
    c = we[f"{col}{linha}"]
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=10)
    c.fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()

linha += 1  # 8
sub_pago = [
    ("B", "Aquisição\n(R$)"),
    ("C", "Amortização\n(R$)"),
    ("D", "Benfeitorias\n(R$)"),
    ("E", "Outros\n(R$)"),
    ("F", "TOTAL pago\nano (R$)"),
]
sub_acum = [
    ("G", "Aquisição\nacum."),
    ("H", "Amortização\nacum."),
    ("I", "Benfeitorias\nacum."),
    ("J", "Outros\nacum."),
    ("K", "SALDO TOTAL\nem 31/12"),
]
for col, txt in sub_pago + sub_acum:
    c = we[f"{col}{linha}"]
    c.value     = txt
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=9)
    c.fill      = PatternFill("solid", fgColor=AZUL_MEDIO)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()

# ── DADOS — CENÁRIO CONSERVADOR (LÓGICA CORRIGIDA) ──────────────────────────
# AGORA a aquisição só conta em 2025 (entrada+ITBI+cartório, NÃO o saldo do financ)
linhas_cons = [
    # (ano, aquis, amort, benf, outros, status_fin, status_obra, obs)
    (2025, aquisicao_2025, amort_por_ano[2025], benfeitorias_por_ano[2025], 0,
     "Pago", "Em curso",
     "Compra: entrada R$1,5M + ITBI + cartório. 3 parc. financ. pagas. 2 NF Bambu pagas (50% ativável)."),
    (2026, 0, amort_por_ano[2026], benfeitorias_por_ano[2026], 0,
     "Pago/Projet.", "—",
     "12 parcelas (4 pagas até abr/2026, 8 projetadas). Lançar benfeitorias futuras na aba Lancamentos."),
    (2027, 0, amort_por_ano[2027], benfeitorias_por_ano[2027], 0,
     "Projetada", "—",
     "Projeção SAC (taxa fixa). Atualizar após confirmação dos pagamentos efetivos."),
    (2028, 0, amort_por_ano[2028], benfeitorias_por_ano[2028], 0,
     "Projetada", "—",
     "Projeção SAC."),
]

linha_inicio_cons = linha + 1  # 9
for idx, (ano, aq, am, ben, out, sf, so, obs) in enumerate(linhas_cons):
    r = linha_inicio_cons + idx
    we.row_dimensions[r].height = 22
    fill = AZUL_CLARO if idx % 2 == 0 else BRANCO

    we[f"A{r}"].value     = ano
    we[f"A{r}"].font      = Font(name="Arial", bold=True, size=11)
    we[f"A{r}"].alignment = Alignment(horizontal="center", vertical="center")
    we[f"A{r}"].fill      = PatternFill("solid", fgColor=fill)
    we[f"A{r}"].border    = borda_fina()

    for col, val in [("B", aq), ("C", am), ("D", ben), ("E", out)]:
        c = we[f"{col}{r}"]
        c.value         = val if val else 0
        c.number_format = FMT_REAL
        c.font          = Font(name="Arial", size=10)
        c.alignment     = Alignment(horizontal="right", vertical="center")
        c.fill          = PatternFill("solid", fgColor=fill)
        c.border        = borda_fina()

    # F: total pago
    cf = we[f"F{r}"]
    cf.value         = f"=B{r}+C{r}+D{r}+E{r}"
    cf.number_format = FMT_REAL
    cf.font          = Font(name="Arial", bold=True, size=10)
    cf.alignment     = Alignment(horizontal="right", vertical="center")
    cf.fill          = PatternFill("solid", fgColor=VERDE_CLARO)
    cf.border        = borda_fina()

    # G-J: acumulados
    for col_pago, col_acum in [("B","G"), ("C","H"), ("D","I"), ("E","J")]:
        c = we[f"{col_acum}{r}"]
        if idx == 0:
            c.value = f"={col_pago}{r}"
        else:
            c.value = f"={col_acum}{r-1}+{col_pago}{r}"
        c.number_format = FMT_REAL
        c.font          = Font(name="Arial", size=10)
        c.alignment     = Alignment(horizontal="right", vertical="center")
        c.fill          = PatternFill("solid", fgColor=fill)
        c.border        = borda_fina()

    # K: saldo total
    ck = we[f"K{r}"]
    ck.value         = f"=G{r}+H{r}+I{r}+J{r}"
    ck.number_format = FMT_REAL
    ck.font          = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=11)
    ck.fill          = PatternFill("solid", fgColor=VERDE_ESCURO)
    ck.alignment     = Alignment(horizontal="right", vertical="center")
    ck.border        = borda_fina()

    for col, val in [("L", sf), ("M", so)]:
        c = we[f"{col}{r}"]
        c.value     = val
        c.font      = Font(name="Arial", size=9)
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        c.fill      = PatternFill("solid", fgColor=fill)
        c.border    = borda_fina()

    cn = we[f"N{r}"]
    cn.value     = obs
    cn.font      = Font(name="Arial", italic=True, size=9, color="595959")
    cn.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    cn.fill      = PatternFill("solid", fgColor=fill)
    cn.border    = borda_fina()

linha_fim_cons = linha_inicio_cons + len(linhas_cons) - 1

# ════════════════════════════════════════════════════════════════════════════
# TABELA 2 — CENÁRIO AMPLO
# ════════════════════════════════════════════════════════════════════════════
linha = linha_fim_cons + 2
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
we.row_dimensions[linha+1].height = 30

we.merge_cells(f"A{linha}:A{linha+1}")
we[f"A{linha}"].value = "Ano"
we.merge_cells(f"B{linha}:G{linha}")
we[f"B{linha}"].value = "PAGO NO ANO (movimentação)"
we.merge_cells(f"H{linha}:M{linha}")
we[f"H{linha}"].value = "SALDO ACUMULADO EM 31/12"
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
    ("B", "Aquisição\n(R$)"),
    ("C", "Amortização\n(R$)"),
    ("D", "Juros\n(R$)"),
    ("E", "Seguros\nMIP+DFI (R$)"),
    ("F", "Benfeitorias\n(R$)"),
    ("G", "TOTAL pago\nano"),
    ("H", "Aquisição\nacum."),
    ("I", "Amortiz.\nacum."),
    ("J", "Juros\nacum."),
    ("K", "Seguros\nacum."),
    ("L", "Benfeit.\nacum."),
    ("M", "SALDO TOTAL\nem 31/12"),
]
for col, txt in sub_amplo:
    c = we[f"{col}{linha}"]
    c.value     = txt
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=9)
    c.fill      = PatternFill("solid", fgColor=DOURADO)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()

# Dados ampliados
linhas_ampl = [
    (2025, aquisicao_2025, amort_por_ano[2025], juros_por_ano[2025],
     seguros_por_ano[2025], benfeitorias_por_ano[2025],
     "Compra + 3 parc. financ. + 2 NF Bambu"),
    (2026, 0, amort_por_ano[2026], juros_por_ano[2026],
     seguros_por_ano[2026], benfeitorias_por_ano[2026],
     "12 parc. (4 pagas + 8 projetadas)"),
    (2027, 0, amort_por_ano[2027], juros_por_ano[2027],
     seguros_por_ano[2027], benfeitorias_por_ano[2027],
     "Projeção SAC"),
    (2028, 0, amort_por_ano[2028], juros_por_ano[2028],
     seguros_por_ano[2028], benfeitorias_por_ano[2028],
     "Projeção SAC"),
]

linha_inicio_ampl = linha + 1
for idx, (ano, aq, am, ju, se, ben, obs) in enumerate(linhas_ampl):
    r = linha_inicio_ampl + idx
    we.row_dimensions[r].height = 22
    fill = AMARELO if idx % 2 == 0 else BRANCO

    we[f"A{r}"].value     = ano
    we[f"A{r}"].font      = Font(name="Arial", bold=True, size=11)
    we[f"A{r}"].alignment = Alignment(horizontal="center", vertical="center")
    we[f"A{r}"].fill      = PatternFill("solid", fgColor=fill)
    we[f"A{r}"].border    = borda_fina()

    for col, val in [("B",aq),("C",am),("D",ju),("E",se),("F",ben)]:
        c = we[f"{col}{r}"]
        c.value         = val if val else 0
        c.number_format = FMT_REAL
        c.font          = Font(name="Arial", size=10)
        c.alignment     = Alignment(horizontal="right", vertical="center")
        c.fill          = PatternFill("solid", fgColor=fill)
        c.border        = borda_fina()

    # G: total pago
    cg = we[f"G{r}"]
    cg.value         = f"=B{r}+C{r}+D{r}+E{r}+F{r}"
    cg.number_format = FMT_REAL
    cg.font          = Font(name="Arial", bold=True, size=10)
    cg.fill          = PatternFill("solid", fgColor=AMARELO)
    cg.alignment     = Alignment(horizontal="right", vertical="center")
    cg.border        = borda_fina()

    # H-L acumulados
    for col_p, col_a in [("B","H"),("C","I"),("D","J"),("E","K"),("F","L")]:
        c = we[f"{col_a}{r}"]
        if idx == 0:
            c.value = f"={col_p}{r}"
        else:
            c.value = f"={col_a}{r-1}+{col_p}{r}"
        c.number_format = FMT_REAL
        c.font          = Font(name="Arial", size=10)
        c.alignment     = Alignment(horizontal="right", vertical="center")
        c.fill          = PatternFill("solid", fgColor=fill)
        c.border        = borda_fina()

    # M: total
    cm = we[f"M{r}"]
    cm.value         = f"=H{r}+I{r}+J{r}+K{r}+L{r}"
    cm.number_format = FMT_REAL
    cm.font          = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=11)
    cm.fill          = PatternFill("solid", fgColor="7F6000")
    cm.alignment     = Alignment(horizontal="right", vertical="center")
    cm.border        = borda_fina()

    cn = we[f"N{r}"]
    cn.value     = obs
    cn.font      = Font(name="Arial", italic=True, size=9, color="595959")
    cn.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    cn.fill      = PatternFill("solid", fgColor=fill)
    cn.border    = borda_fina()

linha_fim_ampl = linha_inicio_ampl + len(linhas_ampl) - 1

# ════════════════════════════════════════════════════════════════════════════
# RESUMO COMPARATIVO
# ════════════════════════════════════════════════════════════════════════════
linha = linha_fim_ampl + 2
we.row_dimensions[linha].height = 24
we.merge_cells(f"A{linha}:N{linha}")
ct = we[f"A{linha}"]
ct.value     = "RESUMO COMPARATIVO — Saldo a declarar em 31/12 de cada ano"
ct.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=12)
ct.fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
ct.alignment = Alignment(horizontal="left", vertical="center")
ct.border    = borda_media()

linha += 1
we.row_dimensions[linha].height = 30
cabecs = [
    ("A","Ano-base IR"),
    ("B","Cenário\nCONSERVADOR"),
    ("C","Cenário\nAMPLO"),
    ("D","Diferença\n(Juros + Seguros)"),
    ("E","Como declarar (ficha de Bens e Direitos do IRPF)"),
]
we.merge_cells(f"E{linha}:N{linha}")
for col, txt in cabecs:
    c = we[f"{col}{linha}"]
    c.value     = txt
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=10)
    c.fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()

resumo_obs = {
    2025: "1ª declaração do imóvel. Discriminar: compra (entrada+ITBI+cartório) + 3 parcelas pagas + 2 NF Bambu.",
    2026: "Acrescentar à discriminação: 12 parcelas pagas/projetadas em 2026 + benfeitorias do ano.",
    2027: "Acrescentar: 12 parcelas + benfeitorias. Atualizar com valores reais quando disponíveis.",
    2028: "Acrescentar: 12 parcelas + benfeitorias. Continuar acompanhando ano a ano.",
}

linha_inicio_resumo = linha + 1
for idx, ano in enumerate([2025, 2026, 2027, 2028]):
    r = linha_inicio_resumo + idx
    we.row_dimensions[r].height = 28
    fill = AZUL_CLARO if idx % 2 == 0 else BRANCO

    we[f"A{r}"].value     = ano
    we[f"A{r}"].font      = Font(name="Arial", bold=True, size=11)
    we[f"A{r}"].alignment = Alignment(horizontal="center", vertical="center")
    we[f"A{r}"].fill      = PatternFill("solid", fgColor=fill)
    we[f"A{r}"].border    = borda_fina()

    r_cons = linha_inicio_cons + idx
    cb = we[f"B{r}"]
    cb.value         = f"=K{r_cons}"
    cb.number_format = FMT_REAL
    cb.font          = Font(name="Arial", bold=True, size=10, color=VERDE_ESCURO)
    cb.alignment     = Alignment(horizontal="right", vertical="center")
    cb.fill          = PatternFill("solid", fgColor=VERDE_CLARO)
    cb.border        = borda_fina()

    r_ampl = linha_inicio_ampl + idx
    cc = we[f"C{r}"]
    cc.value         = f"=M{r_ampl}"
    cc.number_format = FMT_REAL
    cc.font          = Font(name="Arial", bold=True, size=10, color="7F3F00")
    cc.alignment     = Alignment(horizontal="right", vertical="center")
    cc.fill          = PatternFill("solid", fgColor=AMARELO)
    cc.border        = borda_fina()

    cd = we[f"D{r}"]
    cd.value         = f"=C{r}-B{r}"
    cd.number_format = FMT_REAL
    cd.font          = Font(name="Arial", bold=True, size=10)
    cd.alignment     = Alignment(horizontal="right", vertical="center")
    cd.fill          = PatternFill("solid", fgColor=fill)
    cd.border        = borda_fina()

    we.merge_cells(f"E{r}:N{r}")
    ce = we[f"E{r}"]
    ce.value     = resumo_obs.get(ano, "")
    ce.font      = Font(name="Arial", italic=True, size=9, color="595959")
    ce.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    ce.fill      = PatternFill("solid", fgColor=fill)
    ce.border    = borda_fina()

# ── DÍVIDA REMANESCENTE (informativo) ─────────────────────────────────────────
linha = linha_inicio_resumo + 4 + 2
we.row_dimensions[linha].height = 24
we.merge_cells(f"A{linha}:N{linha}")
ct = we[f"A{linha}"]
ct.value     = "DÍVIDA REMANESCENTE DO FINANCIAMENTO — Ficha de DÍVIDAS e ÔNUS REAIS (não custo)"
ct.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=12)
ct.fill      = PatternFill("solid", fgColor=LARANJA_FORTE)
ct.alignment = Alignment(horizontal="left", vertical="center")
ct.border    = borda_media()

linha += 1
we.row_dimensions[linha].height = 28
for col, txt in [("A","Ano"),("B","Saldo devedor 31/12 (R$)"),
                 ("C","Total amortizado acum. (R$)"),
                 ("D","Observação")]:
    c = we[f"{col}{linha}"]
    c.value     = txt
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=10)
    c.fill      = PatternFill("solid", fgColor=LARANJA_FORTE)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()
we.merge_cells(f"D{linha}:N{linha}")

# Saldo devedor extraído do DDC ao fim de cada ano
# Final 2025 = parcela 3 (29/12/2025): R$1.695.349,86
# Final 2026 = parcela 15 (29/12/2026): R$1.653.039,95
# Final 2027 = parcela 27 (29/12/2027): R$1.599.136,43
# Final 2028 = parcela 39 (29/12/2028): R$1.545.232,91
saldos_devedores = {
    2025: 1695349.86,
    2026: 1653039.95,
    2027: 1599136.43,
    2028: 1545232.91,
}

linha += 1
amort_acum = 0
for idx, ano in enumerate([2025, 2026, 2027, 2028]):
    r = linha + idx
    we.row_dimensions[r].height = 22
    fill = LARANJA if idx % 2 == 0 else BRANCO
    amort_acum += amort_por_ano[ano]

    we[f"A{r}"].value     = ano
    we[f"A{r}"].font      = Font(name="Arial", bold=True, size=11)
    we[f"A{r}"].alignment = Alignment(horizontal="center", vertical="center")
    we[f"A{r}"].fill      = PatternFill("solid", fgColor=fill)
    we[f"A{r}"].border    = borda_fina()

    cb = we[f"B{r}"]
    cb.value         = saldos_devedores[ano]
    cb.number_format = FMT_REAL
    cb.font          = Font(name="Arial", bold=True, size=10, color=LARANJA_FORTE)
    cb.fill          = PatternFill("solid", fgColor=fill)
    cb.alignment     = Alignment(horizontal="right", vertical="center")
    cb.border        = borda_fina()

    cc = we[f"C{r}"]
    cc.value         = amort_acum
    cc.number_format = FMT_REAL
    cc.font          = Font(name="Arial", size=10)
    cc.fill          = PatternFill("solid", fgColor=fill)
    cc.alignment     = Alignment(horizontal="right", vertical="center")
    cc.border        = borda_fina()

    we.merge_cells(f"D{r}:N{r}")
    cd = we[f"D{r}"]
    cd.value     = (f"Soma com saldo devedor + amortização ≈ R$1,7M (valor original do financiamento). "
                    f"Saldo devedor é DÍVIDA, declara em ficha separada.")
    cd.font      = Font(name="Arial", italic=True, size=9, color="595959")
    cd.fill      = PatternFill("solid", fgColor=fill)
    cd.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    cd.border    = borda_fina()

# ── NOTAS FINAIS ──────────────────────────────────────────────────────────────
linha = linha + 4 + 2
we.row_dimensions[linha].height = 22
we.merge_cells(f"A{linha}:N{linha}")
ct = we[f"A{linha}"]
ct.value     = "NOTAS METODOLÓGICAS"
ct.font      = Font(name="Arial", bold=True, color=AZUL_ESCURO, size=12)
ct.fill      = PatternFill("solid", fgColor=AZUL_CLARO)
ct.alignment = Alignment(horizontal="left", vertical="center")
ct.border    = borda_fina()

linha += 1
notas = [
    (VERDE_CLARO,
     "✓ Aquisição em 2025 = R$1.608.897,67 (entrada + ITBI + cartório). NÃO inclui o saldo do financiamento."),
    (VERDE_CLARO,
     "✓ Amortização paga em cada ano vai sendo acumulada — esse é o mecanismo de 'pagar' o imóvel ao longo do tempo."),
    (AMARELO,
     "⚠ Cenário Amplo (juros+seguros): amparo na IN RFB 84/2001 art.17, V. Receita tem interpretação restritiva. Confirmar com contador."),
    (LARANJA,
     "⚠ Atualizar a coluna 'Benfeitorias' deste anos à medida que houver novos lançamentos na aba Lancamentos."),
    (LARANJA,
     "⚠ Valores de 2026 a 2028 são parcialmente PROJETADOS (DDC). Confirmar com extratos reais ao fim de cada ano."),
    (CINZA,
     "ℹ A 1ª declaração com este imóvel será o ano-base 2025 (entregue em abril/2026)."),
    (CINZA,
     "ℹ O saldo devedor do financiamento NÃO é custo de aquisição. Ele é DÍVIDA, vai na ficha 'Dívidas e Ônus Reais'."),
]
for fill, texto in notas:
    we.row_dimensions[linha].height = 24
    we.merge_cells(f"A{linha}:N{linha}")
    c = we[f"A{linha}"]
    c.value     = texto
    c.font      = Font(name="Arial", size=9)
    c.fill      = PatternFill("solid", fgColor=fill)
    c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    c.border    = borda_fina()
    linha += 1

# Larguras
larguras = {"A":8,"B":15,"C":15,"D":15,"E":15,"F":15,"G":14,"H":14,
            "I":14,"J":14,"K":17,"L":11,"M":11,"N":40}
for col, w in larguras.items():
    we.column_dimensions[col].width = w


# ════════════════════════════════════════════════════════════════════════════
# CORRIGIR Custo_Total_Imovel — refletir só o que foi PAGO até abr/2026
# ════════════════════════════════════════════════════════════════════════════
wr = wb['Custo_Total_Imovel']

# Linha 6: era "Valor financiado" R$1.700.000 → trocar para zero e mudar texto
# Vou desfazer merges e refazer a linha
merges_to_remove = [m for m in wr.merged_cells.ranges if m.min_row == 6]
for m in merges_to_remove:
    wr.merged_cells.remove(m)

wr.merge_cells("A6:C6")
cl = wr["A6"]
cl.value     = "Saldo do financiamento (NÃO é custo — vai sendo ativado via amortização)"
cl.font      = Font(name="Arial", size=10, italic=True, color="7F3F00")
cl.fill      = PatternFill("solid", fgColor=LARANJA)
cl.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
cl.border    = borda_fina()
wr.row_dimensions[6].height = 22

for col in ("D","E"):
    c = wr[f"{col}6"]
    c.value          = 0
    c.number_format  = FMT_REAL
    c.fill           = PatternFill("solid", fgColor=LARANJA)
    c.font           = Font(name="Arial", size=10, italic=True, color="7F3F00")
    c.alignment      = Alignment(horizontal="right", vertical="center")
    c.border         = borda_fina()

wr.merge_cells("F6:H6")
co = wr["F6"]
co.value     = ("Saldo de R$1.700.000 do financiamento Itaú NÃO é custo. É DÍVIDA — declara em "
                "'Dívidas e Ônus Reais'. Vai virando custo conforme amortização (ver Evolucao_Anual_IR).")
co.font      = Font(name="Arial", italic=True, color="7F3F00", size=9)
co.fill      = PatternFill("solid", fgColor=LARANJA)
co.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
co.border    = borda_fina()

# Linhas 12-15 (encargos): manter como estão (já refletem o que foi pago: 7 parcelas)
# Mas vou atualizar o subtítulo da seção 2 para deixar ainda mais claro

# Adicionar uma referência à nova aba de evolução em algum lugar visível
# Vou adicionar uma nota na seção 5 (informações complementares)
# A aba já tem essa seção em volta da linha 25. Vou inserir uma linha extra de destaque
# mais segura é adicionar logo abaixo do total na linha 22

# Atualizar a célula de observação do TOTAL na linha 22
merges_to_remove = [m for m in wr.merged_cells.ranges if m.min_row == 22 and m.min_col == 6]
for m in merges_to_remove:
    wr.merged_cells.remove(m)

wr.merge_cells("F22:H22")
cot = wr["F22"]
cot.value     = ("Este é o custo ATIVÁVEL ATÉ ABR/2026 (7 parcelas pagas). "
                 "Para evolução ano a ano com saldo a declarar em 31/12, ver aba 'Evolucao_Anual_IR'.")
cot.font      = Font(name="Arial", italic=True, bold=True, color=TEXTO_BRANCO, size=9)
cot.fill      = PatternFill("solid", fgColor=VERDE_ESCURO)
cot.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
cot.border    = borda_media()

wb.save('/mnt/user-data/outputs/Controle_Gastos_Obra_Pro_IR.xlsx')
print("\n=== Salvo! ===")
