from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

# Paleta
AZUL_ESCURO   = "1F3864"
AZUL_MEDIO    = "2E75B6"
AZUL_CLARO    = "D6E4F0"
VERDE_ESCURO  = "1D6038"
VERDE_CLARO   = "E2EFDA"
VERDE_MEDIO   = "70AD47"
AMARELO       = "FFF2CC"
LARANJA       = "FCE4D6"
CINZA         = "F2F2F2"
BRANCO        = "FFFFFF"
TEXTO_BRANCO  = "FFFFFF"
TEXTO_ESCURO  = "1F1F1F"

FMT_REAL    = 'R$ #,##0.00'
FMT_INTEIRO = '#,##0'

def borda_fina():
    s = Side(border_style="thin", color="BFBFBF")
    return Border(left=s, right=s, top=s, bottom=s)

def borda_media():
    s = Side(border_style="medium", color="1F3864")
    return Border(left=s, right=s, top=s, bottom=s)

wb = load_workbook('/mnt/user-data/outputs/Controle_Gastos_Obra_Pro_IR.xlsx')

# Remove se existir
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
c2.value     = ("Palm Hill Casa 4 | Pago no ano (movimentação) + Saldo acumulado (valor a declarar em 31/12 de cada ano)")
c2.font      = Font(name="Arial", italic=True, color=AZUL_ESCURO, size=10)
c2.fill      = PatternFill("solid", fgColor=AZUL_CLARO)
c2.alignment = Alignment(horizontal="center", vertical="center")
we.row_dimensions[2].height = 18

we.row_dimensions[3].height = 8

# ── INSTRUÇÕES ────────────────────────────────────────────────────────────────
we.merge_cells("A4:N4")
c4 = we["A4"]
c4.value     = ("ℹ Como usar: cada linha = um ano-calendário. As colunas 'Pago no ano' mostram a "
                "movimentação anual (vai para 'Discriminação' da ficha de Bens). As colunas "
                "'Saldo acumulado em 31/12' mostram o valor a declarar como custo do imóvel naquele ano.")
c4.font      = Font(name="Arial", italic=True, color="7F3F00", size=9)
c4.fill      = PatternFill("solid", fgColor=AMARELO)
c4.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
c4.border    = borda_fina()
we.row_dimensions[4].height = 36

we.row_dimensions[5].height = 8

# ════════════════════════════════════════════════════════════════════════════
# TABELA — CENÁRIO CONSERVADOR (apenas amortização do financiamento + obra)
# ════════════════════════════════════════════════════════════════════════════
linha = 6
we.merge_cells(f"A{linha}:N{linha}")
ct = we[f"A{linha}"]
ct.value     = "CENÁRIO CONSERVADOR — Aquisição + Amortização + Benfeitorias"
ct.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=12)
ct.fill      = PatternFill("solid", fgColor=VERDE_ESCURO)
ct.alignment = Alignment(horizontal="left", vertical="center")
ct.border    = borda_media()
we.row_dimensions[linha].height = 24

# ── Cabeçalho duplo ──────────────────────────────────────────────────────────
linha += 1  # 7
we.row_dimensions[linha].height = 20
we.row_dimensions[linha+1].height = 30

# Linha 7: agrupadores
we[f"A{linha}"].value = "Ano"
we.merge_cells(f"A{linha}:A{linha+1}")
we.merge_cells(f"B{linha}:F{linha}")
we[f"B{linha}"].value = "PAGO NO ANO (movimentação anual)"
we.merge_cells(f"G{linha}:K{linha}")
we[f"G{linha}"].value = "SALDO ACUMULADO EM 31/12 (valor a declarar)"
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

# Linha 8: subcabeçalhos
linha += 1  # 8
sub_pago = [
    ("B", "Aquisição\n(R$)"),
    ("C", "Amortização\n(R$)"),
    ("D", "Benfeitorias\n(R$)"),
    ("E", "Outros\n(R$)"),
    ("F", "TOTAL pago\nano (R$)"),
]
sub_acum = [
    ("G", "Aquisição\nacum. (R$)"),
    ("H", "Amortização\nacum. (R$)"),
    ("I", "Benfeitorias\nacum. (R$)"),
    ("J", "Outros\nacum. (R$)"),
    ("K", "SALDO TOTAL\nem 31/12 (R$)"),
]
for col, txt in sub_pago + sub_acum:
    c = we[f"{col}{linha}"]
    c.value     = txt
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=9)
    c.fill      = PatternFill("solid", fgColor=AZUL_MEDIO)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()

# ── DADOS POR ANO — CENÁRIO CONSERVADOR ──────────────────────────────────────
# Estrutura: (ano, aquisição_no_ano, amortização_no_ano, benfeitorias_no_ano, outros_no_ano,
#             status_financ, status_obra, obs)

# Aquisição lançada em 2025 (compra realizada em 29/09/2025):
# 1.700.000 (financ) + 1.500.000 (entrada) + 96.000 (ITBI) + 12.897,67 (cartório) = 3.308.897,67
aquisicao_2025 = 1700000 + 1500000 + 96000 + 12897.67  # 3.308.897,67

# Benfeitorias - Bambu.Arq:
# 2025: parcela 1 NF 444 paga em 12/11/2025 (R$10.400) - mas usar o lançamento total
# Olhando os lançamentos: 4 entradas
#   24/09/2025: GoStudio R$1.026,25 → 0% ativável (decoração/bem móvel)
#   24/10/2025: GoStudio R$998,25 → 0% ativável
#   12/11/2025: Bambu R$10.400 → 50% (parcial)
#   12/12/2025: Bambu R$10.400 → 50%
# Ativável conservador 2025: 0,5 * 20.800 = R$10.400 (50% projetos) + 0 (decor) = R$10.400
# Mas a tabela Classificacao_IR pode ter outros %. Para consistência com a planilha,
# vou usar o "Resumo_Anual_IR" que já calcula isso, mas como é fixo por ano, vou
# colocar valores manuais para os anos passados/atuais e deixar fórmula para futuros

# Para simplificar e ser realista: em 2025 só houve R$10.400 ativável de obra (Bambu parcela 1)
# Em 2026 (até abr): R$10.400 (Bambu parcela 2 paga em dez/2025... espera)
# 
# Vou olhar de novo: parcela 1 Bambu = 12/11/2025 → ANO 2025
#                   parcela 2 Bambu = 12/12/2025 → ANO 2025
# Ambas em 2025! Então:
# 2025: GoStudio (R$2.024,50) + 2 Bambu (R$20.800) = R$22.824,50 total pago
#   Ativável (50% em projetos, 0% em decoração) = R$10.400
# 2026 em diante: nenhum lançamento ainda

# Dados anuais:
linhas_dados_cons = [
    # (ano, aquisição, amort, benfeit, outros, status_fin, status_obra, obs)
    (2025, aquisicao_2025, 13361.91, 10400.00, 0,
     "Pago",  "Em curso",  "Compra do imóvel + 3 parcelas pagas + 2 parcelas Bambu pagas"),
    (2026,  0,             53858.02,     0.00, 0,
     "Pago/Projet.", "—",  "12 parcelas (4 pagas até abr/2026, 8 projetadas). Sem novos lançamentos de obra."),
    (2027,  0,             53903.52,     0.00, 0,
     "Projetada", "—",     "Projeção SAC. Inserir benfeitorias quando ocorrerem."),
    (2028,  0,             53903.52,     0.00, 0,
     "Projetada", "—",     "Projeção SAC."),
]

linha_inicio_dados = linha + 1  # 9

for idx, (ano, aq, am, ben, out, sf, so, obs) in enumerate(linhas_dados_cons):
    r = linha_inicio_dados + idx
    we.row_dimensions[r].height = 22
    fill = AZUL_CLARO if idx % 2 == 0 else BRANCO

    # A: Ano
    we[f"A{r}"].value = ano
    we[f"A{r}"].font = Font(name="Arial", bold=True, size=11)
    we[f"A{r}"].alignment = Alignment(horizontal="center", vertical="center")
    we[f"A{r}"].fill = PatternFill("solid", fgColor=fill)
    we[f"A{r}"].border = borda_fina()

    # B-E: pago no ano
    for col, val in [("B", aq), ("C", am), ("D", ben), ("E", out)]:
        c = we[f"{col}{r}"]
        c.value         = val if val else 0
        c.number_format = FMT_REAL
        c.font          = Font(name="Arial", size=10)
        c.alignment     = Alignment(horizontal="right", vertical="center")
        c.fill          = PatternFill("solid", fgColor=fill)
        c.border        = borda_fina()

    # F: Total pago ano (fórmula)
    cf = we[f"F{r}"]
    cf.value         = f"=B{r}+C{r}+D{r}+E{r}"
    cf.number_format = FMT_REAL
    cf.font          = Font(name="Arial", bold=True, size=10)
    cf.alignment     = Alignment(horizontal="right", vertical="center")
    cf.fill          = PatternFill("solid", fgColor=VERDE_CLARO)
    cf.border        = borda_fina()

    # G-J: acumulado (fórmula = anterior + atual, primeira linha = atual)
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

    # K: Saldo total acumulado em 31/12
    ck = we[f"K{r}"]
    ck.value         = f"=G{r}+H{r}+I{r}+J{r}"
    ck.number_format = FMT_REAL
    ck.font          = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=10)
    ck.fill          = PatternFill("solid", fgColor=VERDE_ESCURO)
    ck.alignment     = Alignment(horizontal="right", vertical="center")
    ck.border        = borda_fina()

    # L, M: status
    for col, val in [("L", sf), ("M", so)]:
        c = we[f"{col}{r}"]
        c.value     = val
        c.font      = Font(name="Arial", size=9)
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        c.fill      = PatternFill("solid", fgColor=fill)
        c.border    = borda_fina()

    # N: observações
    cn = we[f"N{r}"]
    cn.value     = obs
    cn.font      = Font(name="Arial", italic=True, size=9, color="595959")
    cn.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    cn.fill      = PatternFill("solid", fgColor=fill)
    cn.border    = borda_fina()

linha_fim_cons = linha_inicio_dados + len(linhas_dados_cons) - 1

# ════════════════════════════════════════════════════════════════════════════
# TABELA — CENÁRIO AMPLO (inclui juros + seguros)
# ════════════════════════════════════════════════════════════════════════════
linha = linha_fim_cons + 2  # 14
we.row_dimensions[linha].height = 24
we.merge_cells(f"A{linha}:N{linha}")
ct = we[f"A{linha}"]
ct.value     = "CENÁRIO AMPLO — Inclui juros e seguros obrigatórios (MIP/DFI)"
ct.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=12)
ct.fill      = PatternFill("solid", fgColor="7F6000")
ct.alignment = Alignment(horizontal="left", vertical="center")
ct.border    = borda_media()

# Cabeçalho
linha += 1
we.row_dimensions[linha].height = 20
we.row_dimensions[linha+1].height = 30

we[f"A{linha}"].value = "Ano"
we.merge_cells(f"A{linha}:A{linha+1}")
we.merge_cells(f"B{linha}:G{linha}")
we[f"B{linha}"].value = "PAGO NO ANO (movimentação anual)"
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
    ("E", "Seguros MIP+DFI\n(R$)"),
    ("F", "Benfeitorias\n(R$)"),
    ("G", "TOTAL pago\nano (R$)"),
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
    c.fill      = PatternFill("solid", fgColor="BF8F00")
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()

# Dados ampliados:
linhas_dados_ampl = [
    # (ano, aquis, amort, juros, seguros, benf, status_obs)
    (2025, aquisicao_2025, 13361.91, 49160.86, 4027.82+820.18,    10400.00,
     "Compra + 3 parc. + 2 NF Bambu"),
    (2026, 0,              53858.02, 194261.33, 12573.71+2480.46,     0.00,
     "12 parcelas (4 pagas + 8 projetadas)"),
    (2027, 0,              53903.52, 188197.52, 13299.59+2482.56,     0.00,
     "Projeção SAC"),
    (2028, 0,              53903.52, 181967.52, 14363.96+2482.56,     0.00,
     "Projeção SAC"),
]

linha_inicio_ampl = linha + 1

for idx, (ano, aq, am, ju, se, ben, obs) in enumerate(linhas_dados_ampl):
    r = linha_inicio_ampl + idx
    we.row_dimensions[r].height = 22
    fill = AMARELO if idx % 2 == 0 else BRANCO

    we[f"A{r}"].value = ano
    we[f"A{r}"].font = Font(name="Arial", bold=True, size=11)
    we[f"A{r}"].alignment = Alignment(horizontal="center", vertical="center")
    we[f"A{r}"].fill = PatternFill("solid", fgColor=fill)
    we[f"A{r}"].border = borda_fina()

    # B-F: pago no ano
    for col, val in [("B", aq), ("C", am), ("D", ju), ("E", se), ("F", ben)]:
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

    # H-L: acumulados
    for col_pago, col_acum in [("B","H"), ("C","I"), ("D","J"), ("E","K"), ("F","L")]:
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

    # M: total acumulado
    cm = we[f"M{r}"]
    cm.value         = f"=H{r}+I{r}+J{r}+K{r}+L{r}"
    cm.number_format = FMT_REAL
    cm.font          = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=10)
    cm.fill          = PatternFill("solid", fgColor="7F6000")
    cm.alignment     = Alignment(horizontal="right", vertical="center")
    cm.border        = borda_fina()

    cn = we[f"N{r}"]
    cn.value     = obs
    cn.font      = Font(name="Arial", italic=True, size=9, color="595959")
    cn.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    cn.fill      = PatternFill("solid", fgColor=fill)
    cn.border    = borda_fina()

linha_fim_ampl = linha_inicio_ampl + len(linhas_dados_ampl) - 1

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

# Cabeçalho
linha += 1
we.row_dimensions[linha].height = 30
cabecalhos_resumo = [
    ("A", "Ano-base IR"),
    ("B", "Cenário\nCONSERVADOR (R$)"),
    ("C", "Cenário\nAMPLO (R$)"),
    ("D", "Diferença (R$)\n[Juros + Seguros]"),
    ("E", "Observação para a ficha de Bens e Direitos do IRPF"),
]
we.merge_cells(f"E{linha}:N{linha}")
for col, txt in cabecalhos_resumo:
    c = we[f"{col}{linha}"]
    c.value     = txt
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=10)
    c.fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()

# Linhas
resumo_obs = {
    2025: "Primeiro ano de declaração do imóvel. Discriminar: compra + entrada + ITBI + cartório + parcelas pagas em 2025.",
    2026: "Acrescentar: parcelas 4-15 pagas/projetadas em 2026. Saldo aumenta com mais 12 parcelas.",
    2027: "Acrescentar: parcelas 16-27. Inserir benfeitorias quando ocorrerem.",
    2028: "Acrescentar: parcelas 28-39. Continuar acompanhando.",
}

linha_inicio_resumo = linha + 1
for idx, ano in enumerate([2025, 2026, 2027, 2028]):
    r = linha_inicio_resumo + idx
    we.row_dimensions[r].height = 28
    fill = AZUL_CLARO if idx % 2 == 0 else BRANCO

    # A: Ano
    we[f"A{r}"].value = ano
    we[f"A{r}"].font = Font(name="Arial", bold=True, size=11)
    we[f"A{r}"].alignment = Alignment(horizontal="center", vertical="center")
    we[f"A{r}"].fill = PatternFill("solid", fgColor=fill)
    we[f"A{r}"].border = borda_fina()

    # B: cenário conservador (puxar de coluna K linha correspondente da tabela cons)
    r_cons = linha_inicio_dados + idx
    cb = we[f"B{r}"]
    cb.value         = f"=K{r_cons}"
    cb.number_format = FMT_REAL
    cb.font          = Font(name="Arial", bold=True, size=10, color=VERDE_ESCURO)
    cb.alignment     = Alignment(horizontal="right", vertical="center")
    cb.fill          = PatternFill("solid", fgColor=VERDE_CLARO)
    cb.border        = borda_fina()

    # C: cenário amplo (puxar de M da tabela amplo)
    r_ampl = linha_inicio_ampl + idx
    cc = we[f"C{r}"]
    cc.value         = f"=M{r_ampl}"
    cc.number_format = FMT_REAL
    cc.font          = Font(name="Arial", bold=True, size=10, color="7F3F00")
    cc.alignment     = Alignment(horizontal="right", vertical="center")
    cc.fill          = PatternFill("solid", fgColor=AMARELO)
    cc.border        = borda_fina()

    # D: diferença
    cd = we[f"D{r}"]
    cd.value         = f"=C{r}-B{r}"
    cd.number_format = FMT_REAL
    cd.font          = Font(name="Arial", bold=True, size=10)
    cd.alignment     = Alignment(horizontal="right", vertical="center")
    cd.fill          = PatternFill("solid", fgColor=fill)
    cd.border        = borda_fina()

    # E: observação
    we.merge_cells(f"E{r}:N{r}")
    ce = we[f"E{r}"]
    ce.value     = resumo_obs.get(ano, "")
    ce.font      = Font(name="Arial", italic=True, size=9, color="595959")
    ce.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    ce.fill      = PatternFill("solid", fgColor=fill)
    ce.border    = borda_fina()

# ── ALERTAS E NOTAS METODOLÓGICAS ──────────────────────────────────────────────
linha = linha_inicio_resumo + 4 + 2

we.row_dimensions[linha].height = 22
we.merge_cells(f"A{linha}:N{linha}")
ct = we[f"A{linha}"]
ct.value     = "NOTAS METODOLÓGICAS E ALERTAS"
ct.font      = Font(name="Arial", bold=True, color=AZUL_ESCURO, size=12)
ct.fill      = PatternFill("solid", fgColor=AZUL_CLARO)
ct.alignment = Alignment(horizontal="left", vertical="center")
ct.border    = borda_fina()

linha += 1
notas = [
    (AMARELO,
     "⚠ Parcelas de 2026 em diante incluem valores PROJETADOS pelo DDC (taxa fixa + estimativa de seguros). "
     "Valores reais podem variar com correção monetária e reajuste anual da TR/seguros."),
    (LARANJA,
     "⚠ Para anos futuros, atualize as benfeitorias na coluna 'Benfeitorias' à medida que novos lançamentos "
     "forem registrados na aba Lancamentos. Esta aba não atualiza automaticamente — preencha manualmente."),
    (VERDE_CLARO,
     "✓ Coluna 'TOTAL pago no ano' = movimentação a explicar na 'Discriminação' da ficha de Bens e Direitos."),
    (VERDE_CLARO,
     "✓ Coluna 'SALDO TOTAL em 31/12' = valor a declarar na coluna 'Situação em 31/12/AAAA' do imóvel."),
    (CINZA,
     "ℹ A primeira declaração com este imóvel será a do ano-base 2025 (entregue em 2026)."),
]
for fill, texto in notas:
    we.row_dimensions[linha].height = 28
    we.merge_cells(f"A{linha}:N{linha}")
    c = we[f"A{linha}"]
    c.value     = texto
    c.font      = Font(name="Arial", size=9)
    c.fill      = PatternFill("solid", fgColor=fill)
    c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    c.border    = borda_fina()
    linha += 1

# ── LARGURAS ──────────────────────────────────────────────────────────────────
larguras = {"A":8, "B":15, "C":15, "D":15, "E":15, "F":15, "G":14, "H":14,
            "I":14, "J":14, "K":17, "L":11, "M":11, "N":40}
for col, w in larguras.items():
    we.column_dimensions[col].width = w

wb.save('/mnt/user-data/outputs/Controle_Gastos_Obra_Pro_IR.xlsx')
print("Salvo!")
print(f"\nLinhas da tabela CONSERVADOR: {linha_inicio_dados} a {linha_fim_cons}")
print(f"Linhas da tabela AMPLO:       {linha_inicio_ampl} a {linha_fim_ampl}")
