from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

# Paleta
AZUL_ESCURO   = "1F3864"
AZUL_MEDIO    = "2E75B6"
AZUL_CLARO    = "D6E4F0"
VERDE_ESCURO  = "1D6038"
VERDE_CLARO   = "E2EFDA"
VERDE_DESTAQUE= "548235"
AMARELO       = "FFF2CC"
AMARELO_FORTE = "FFC000"
LARANJA_FORTE = "ED7D31"
LARANJA       = "FCE4D6"
CINZA         = "F2F2F2"
CINZA_ESCURO  = "595959"
BRANCO        = "FFFFFF"
TEXTO_BRANCO  = "FFFFFF"
TEXTO_ESCURO  = "1F1F1F"
DOURADO       = "BF8F00"

FMT_REAL    = 'R$ #,##0.00'

def borda_fina():
    s = Side(border_style="thin", color="BFBFBF")
    return Border(left=s, right=s, top=s, bottom=s)
def borda_media():
    s = Side(border_style="medium", color="1F3864")
    return Border(left=s, right=s, top=s, bottom=s)

wb = load_workbook('/mnt/user-data/outputs/Controle_Gastos_Obra_Pro_IR.xlsx')

# Remove versão anterior
if "Evolucao_Anual_IR" in wb.sheetnames:
    del wb["Evolucao_Anual_IR"]

we = wb.create_sheet("Evolucao_Anual_IR")

# ════════════════════════════════════════════════════════════════════════════
# HEADER
# ════════════════════════════════════════════════════════════════════════════
we.merge_cells("A1:N1")
c = we["A1"]
c.value     = "RESUMO ANUAL PARA O IR — VALORES A DECLARAR EM 31/12 DE CADA ANO"
c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=14)
c.fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
c.alignment = Alignment(horizontal="center", vertical="center")
we.row_dimensions[1].height = 32

we.merge_cells("A2:N2")
c2 = we["A2"]
c2.value     = ("Palm Hill Casa 4 | Atualize anualmente. Valores futuros (amarelo) são preenchidos conforme as parcelas vão sendo pagas.")
c2.font      = Font(name="Arial", italic=True, color=AZUL_ESCURO, size=10)
c2.fill      = PatternFill("solid", fgColor=AZUL_CLARO)
c2.alignment = Alignment(horizontal="center", vertical="center")
we.row_dimensions[2].height = 18

we.row_dimensions[3].height = 8

# ════════════════════════════════════════════════════════════════════════════
# PAINEL DE INSTRUÇÕES
# ════════════════════════════════════════════════════════════════════════════
we.merge_cells("A4:N4")
c4 = we["A4"]
c4.value     = "📋 COMO USAR ESTA ABA"
c4.font      = Font(name="Arial", bold=True, color=AZUL_ESCURO, size=11)
c4.fill      = PatternFill("solid", fgColor=AZUL_CLARO)
c4.alignment = Alignment(horizontal="left", vertical="center")
c4.border    = borda_fina()
we.row_dimensions[4].height = 22

instrucoes = [
    ("1.", "A coluna SALDO ACUMULADO (verde escuro / dourado) é o que você lança na ficha 'Bens e Direitos' do IR em 31/12 do ano correspondente."),
    ("2.", "Células com fundo CINZA estão fechadas (não editar) — vêm de fórmula ou de pagamentos já confirmados."),
    ("3.", "Células com fundo AMARELO são editáveis — preencha à medida que cada parcela for paga ao longo do ano."),
    ("4.", "Benfeitorias puxam automaticamente da aba Lancamentos. Se quiser sobrescrever, use a coluna 'Override manual' ao lado."),
    ("5.", "Use as duas tabelas para comparar: CONSERVADOR (mais seguro) vs AMPLO (com juros e seguros)."),
]
linha = 5
for num, txt in instrucoes:
    we.row_dimensions[linha].height = 18
    we.merge_cells(f"A{linha}:N{linha}")
    c = we[f"A{linha}"]
    c.value     = f"  {num}  {txt}"
    c.font      = Font(name="Arial", size=9, color=TEXTO_ESCURO)
    c.fill      = PatternFill("solid", fgColor=BRANCO if linha % 2 else CINZA)
    c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    c.border    = borda_fina()
    linha += 1

linha += 1  # espaço

# ════════════════════════════════════════════════════════════════════════════
# CONFIGURAÇÃO DE ANOS
# ════════════════════════════════════════════════════════════════════════════
ANO_INICIO = 2025
ANO_FIM = 2035
anos = list(range(ANO_INICIO, ANO_FIM + 1))

# Valores REALMENTE PAGOS (do DDC com situação "Paga")
# 2025: 3 parcelas pagas (out, nov, dez)
# 2026: 4 parcelas pagas (jan, fev, mar, abr - até hoje 01/05/2026)
PAGOS = {
    2025: {
        'amort': 13361.91, 'juros': 49160.86, 'seguros': 4848.00,
        'parcelas_pagas': 3, 'parcelas_total': 3, 'fechado': True
    },
    2026: {
        # PARCIAL - apenas jan-abr (parcelas 4-7)
        'amort': 17922.34, 'juros': 65335.21, 'seguros': 4839.25,
        'parcelas_pagas': 4, 'parcelas_total': 12, 'fechado': False
    },
    # 2027 em diante: branco (preenchimento manual)
}

# ════════════════════════════════════════════════════════════════════════════
# TABELA 1 — CENÁRIO CONSERVADOR
# ════════════════════════════════════════════════════════════════════════════
we.row_dimensions[linha].height = 26
we.merge_cells(f"A{linha}:N{linha}")
ct = we[f"A{linha}"]
ct.value     = "CENÁRIO CONSERVADOR — Aquisição + Amortização + Benfeitorias (posição segura)"
ct.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=12)
ct.fill      = PatternFill("solid", fgColor=VERDE_ESCURO)
ct.alignment = Alignment(horizontal="left", vertical="center")
ct.border    = borda_media()
LINHA_TITULO_CONS = linha

linha += 1
# Estrutura: A=Ano, B=Aquis, C=Amort, D=Outros, E=Benf Auto, F=Benf Override,
#            G=Benf Usado, H=Total Ano, I=Saldo Acum, J=Status, K-N=Obs
linha_cab1 = linha
linha_cab2 = linha_cab1 + 1

we.row_dimensions[linha_cab1].height = 20
we.row_dimensions[linha_cab2].height = 36

# Linha 1 do cabeçalho (agrupadores)
we.merge_cells(f"A{linha_cab1}:A{linha_cab2}")
we[f"A{linha_cab1}"].value = "Ano"

we.merge_cells(f"B{linha_cab1}:D{linha_cab1}")
we[f"B{linha_cab1}"].value = "PAGO NO ANO (movimentação)"

we.merge_cells(f"E{linha_cab1}:G{linha_cab1}")
we[f"E{linha_cab1}"].value = "BENFEITORIAS DA OBRA"

we.merge_cells(f"H{linha_cab1}:H{linha_cab2}")
we[f"H{linha_cab1}"].value = "TOTAL\npago no ano"

we.merge_cells(f"I{linha_cab1}:I{linha_cab2}")
we[f"I{linha_cab1}"].value = "💰 SALDO 31/12\nDECLARAR NO IR"

we.merge_cells(f"J{linha_cab1}:J{linha_cab2}")
we[f"J{linha_cab1}"].value = "Status"

we.merge_cells(f"K{linha_cab1}:N{linha_cab2}")
we[f"K{linha_cab1}"].value = "Observações / Discriminação"

for col in ["A","B","E","H","I","J","K"]:
    c = we[f"{col}{linha_cab1}"]
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=10)
    c.fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()

# Cor especial para coluna I (saldo a declarar)
we[f"I{linha_cab1}"].fill = PatternFill("solid", fgColor=VERDE_DESTAQUE)

# Linha 2 do cabeçalho (subitens)
sub_cab = [
    ("B", "Aquisição"),
    ("C", "Amortização"),
    ("D", "Outros"),
    ("E", "Auto\n(Lancamentos)"),
    ("F", "Override\nmanual"),
    ("G", "Usado"),
]
for col, txt in sub_cab:
    c = we[f"{col}{linha_cab2}"]
    c.value     = txt
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=9)
    c.fill      = PatternFill("solid", fgColor=AZUL_MEDIO)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()

# ── DADOS — CENÁRIO CONSERVADOR ──────────────────────────────────────────────
linha_inicio = linha_cab2 + 1
LINHA_INICIO_CONS = linha_inicio

# Aquisição em 2025
AQUISICAO_2025 = 1500000.00 + 96000.00 + 12897.67  # 1.608.897,67

obs_por_ano = {
    2025: "1ª declaração: compra (entrada R$1,5M + ITBI R$96k + cartório R$12,9k) + 3 parcelas pagas + 2 NF Bambu (50% = R$10.400).",
    2026: "Acrescentar 12 parcelas pagas + benfeitorias do ano. Em 01/05/2026 são 4 parcelas pagas (faltam 8).",
    2027: "Acrescentar 12 parcelas pagas + benfeitorias do ano.",
    2028: "Acrescentar 12 parcelas pagas + benfeitorias do ano.",
    2029: "Continuar acumulando.",
    2030: "Continuar acumulando.",
    2031: "Continuar acumulando.",
    2032: "Continuar acumulando.",
    2033: "Continuar acumulando.",
    2034: "Continuar acumulando.",
    2035: "Continuar acumulando.",
}

for idx, ano in enumerate(anos):
    r = linha_inicio + idx
    we.row_dimensions[r].height = 24
    fill_par = AZUL_CLARO if idx % 2 == 0 else BRANCO

    pagos = PAGOS.get(ano)
    eh_passado_fechado = pagos and pagos.get('fechado')
    eh_passado_parcial = pagos and not pagos.get('fechado')
    eh_futuro = pagos is None

    # A: Ano
    cA = we[f"A{r}"]
    cA.value     = ano
    cA.font      = Font(name="Arial", bold=True, size=12)
    cA.alignment = Alignment(horizontal="center", vertical="center")
    cA.fill      = PatternFill("solid", fgColor=fill_par)
    cA.border    = borda_fina()

    # B: Aquisição (só 2025; outros = 0, não editável)
    cB = we[f"B{r}"]
    if ano == 2025:
        cB.value = AQUISICAO_2025
        cB.fill  = PatternFill("solid", fgColor=CINZA)  # confirmado
    else:
        cB.value = 0
        cB.fill  = PatternFill("solid", fgColor=CINZA)
    cB.number_format = FMT_REAL
    cB.font      = Font(name="Arial", size=10)
    cB.alignment = Alignment(horizontal="right", vertical="center")
    cB.border    = borda_fina()

    # C: Amortização — preenchida só onde já pagou (real); resto branco para preencher
    cC = we[f"C{r}"]
    if pagos:
        cC.value = pagos['amort']
        cC.fill  = PatternFill("solid", fgColor=CINZA if eh_passado_fechado else AMARELO)
    else:
        cC.value = None
        cC.fill  = PatternFill("solid", fgColor=AMARELO)
    cC.number_format = FMT_REAL
    cC.font      = Font(name="Arial", size=10)
    cC.alignment = Alignment(horizontal="right", vertical="center")
    cC.border    = borda_fina()

    # D: Outros
    cD = we[f"D{r}"]
    cD.value = 0
    cD.number_format = FMT_REAL
    cD.font      = Font(name="Arial", size=10)
    cD.alignment = Alignment(horizontal="right", vertical="center")
    cD.fill      = PatternFill("solid", fgColor=AMARELO)
    cD.border    = borda_fina()

    # E: Benfeitorias AUTO (puxa da aba Lancamentos por ano)
    # Lancamentos!B2:B1000 = data, Lancamentos!S2:S1000 = valor ativável
    # SUMPRODUCT funciona melhor para datas
    cE = we[f"E{r}"]
    cE.value         = (f'=SUMPRODUCT((YEAR(Lancamentos!$B$2:$B$1000)={ano})*'
                        f'(Lancamentos!$S$2:$S$1000))')
    cE.number_format = FMT_REAL
    cE.font          = Font(name="Arial", size=10, color=CINZA_ESCURO)
    cE.alignment     = Alignment(horizontal="right", vertical="center")
    cE.fill          = PatternFill("solid", fgColor=CINZA)
    cE.border        = borda_fina()

    # F: Override manual (vazio)
    cF = we[f"F{r}"]
    cF.value         = None
    cF.number_format = FMT_REAL
    cF.font          = Font(name="Arial", size=10)
    cF.alignment     = Alignment(horizontal="right", vertical="center")
    cF.fill          = PatternFill("solid", fgColor=AMARELO)
    cF.border        = borda_fina()

    # G: Usado = IF(F<>"", F, E)
    cG = we[f"G{r}"]
    cG.value         = f'=IF(F{r}<>"",F{r},E{r})'
    cG.number_format = FMT_REAL
    cG.font          = Font(name="Arial", bold=True, size=10)
    cG.alignment     = Alignment(horizontal="right", vertical="center")
    cG.fill          = PatternFill("solid", fgColor=VERDE_CLARO)
    cG.border        = borda_fina()

    # H: TOTAL pago ano = B + C + D + G
    cH = we[f"H{r}"]
    cH.value         = f'=B{r}+IFERROR(C{r},0)+D{r}+G{r}'
    cH.number_format = FMT_REAL
    cH.font          = Font(name="Arial", bold=True, size=10)
    cH.alignment     = Alignment(horizontal="right", vertical="center")
    cH.fill          = PatternFill("solid", fgColor=VERDE_CLARO)
    cH.border        = borda_fina()

    # I: SALDO ACUMULADO = anterior + atual
    cI = we[f"I{r}"]
    if idx == 0:
        cI.value = f"=H{r}"
    else:
        cI.value = f"=I{r-1}+H{r}"
    cI.number_format = FMT_REAL
    cI.font          = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=12)
    cI.fill          = PatternFill("solid", fgColor=VERDE_DESTAQUE)
    cI.alignment     = Alignment(horizontal="right", vertical="center")
    cI.border        = borda_media()

    # J: Status
    cJ = we[f"J{r}"]
    if eh_passado_fechado:
        cJ.value = "✓ Fechado"
        cJ.fill  = PatternFill("solid", fgColor=VERDE_CLARO)
    elif eh_passado_parcial:
        cJ.value = f"⚠ Parcial\n({pagos['parcelas_pagas']}/{pagos['parcelas_total']} parc.)"
        cJ.fill  = PatternFill("solid", fgColor=AMARELO_FORTE)
    else:
        cJ.value = "○ A preencher"
        cJ.fill  = PatternFill("solid", fgColor=fill_par)
    cJ.font      = Font(name="Arial", bold=True, size=9)
    cJ.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cJ.border    = borda_fina()

    # K-N: Observações
    we.merge_cells(f"K{r}:N{r}")
    cK = we[f"K{r}"]
    cK.value     = obs_por_ano.get(ano, "")
    cK.font      = Font(name="Arial", italic=True, size=9, color=CINZA_ESCURO)
    cK.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    cK.fill      = PatternFill("solid", fgColor=fill_par)
    cK.border    = borda_fina()

LINHA_FIM_CONS = linha_inicio + len(anos) - 1

# ════════════════════════════════════════════════════════════════════════════
# TABELA 2 — CENÁRIO AMPLO
# ════════════════════════════════════════════════════════════════════════════
linha = LINHA_FIM_CONS + 3

# Título
we.row_dimensions[linha].height = 26
we.merge_cells(f"A{linha}:N{linha}")
ct = we[f"A{linha}"]
ct.value     = "CENÁRIO AMPLO — Inclui juros e seguros obrigatórios MIP+DFI (IN RFB 84/2001)"
ct.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=12)
ct.fill      = PatternFill("solid", fgColor="7F6000")
ct.alignment = Alignment(horizontal="left", vertical="center")
ct.border    = borda_media()
LINHA_TITULO_AMPL = linha

linha += 1
linha_cab1_a = linha
linha_cab2_a = linha + 1

we.row_dimensions[linha_cab1_a].height = 20
we.row_dimensions[linha_cab2_a].height = 36

# Layout AMPLO: A=Ano, B=Aquis, C=Amort, D=Juros, E=Seguros, F=Outros,
#               G=Benf Auto, H=Benf Override, I=Benf Usado,
#               J=Total ano, K=Saldo Acum, L=Status, M-N=Obs

we.merge_cells(f"A{linha_cab1_a}:A{linha_cab2_a}")
we[f"A{linha_cab1_a}"].value = "Ano"

we.merge_cells(f"B{linha_cab1_a}:F{linha_cab1_a}")
we[f"B{linha_cab1_a}"].value = "PAGO NO ANO (movimentação)"

we.merge_cells(f"G{linha_cab1_a}:I{linha_cab1_a}")
we[f"G{linha_cab1_a}"].value = "BENFEITORIAS DA OBRA"

we.merge_cells(f"J{linha_cab1_a}:J{linha_cab2_a}")
we[f"J{linha_cab1_a}"].value = "TOTAL\npago no ano"

we.merge_cells(f"K{linha_cab1_a}:K{linha_cab2_a}")
we[f"K{linha_cab1_a}"].value = "💰 SALDO 31/12\nDECLARAR NO IR"

we.merge_cells(f"L{linha_cab1_a}:L{linha_cab2_a}")
we[f"L{linha_cab1_a}"].value = "Status"

we.merge_cells(f"M{linha_cab1_a}:N{linha_cab2_a}")
we[f"M{linha_cab1_a}"].value = "Observações"

for col in ["A","B","G","J","K","L","M"]:
    c = we[f"{col}{linha_cab1_a}"]
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=10)
    c.fill      = PatternFill("solid", fgColor="7F6000")
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()

# Cor especial K (saldo amplo)
we[f"K{linha_cab1_a}"].fill = PatternFill("solid", fgColor=DOURADO)

sub_cab_a = [
    ("B", "Aquisição"),
    ("C", "Amortização"),
    ("D", "Juros"),
    ("E", "Seguros\nMIP+DFI"),
    ("F", "Outros"),
    ("G", "Auto\n(Lancamentos)"),
    ("H", "Override\nmanual"),
    ("I", "Usado"),
]
for col, txt in sub_cab_a:
    c = we[f"{col}{linha_cab2_a}"]
    c.value     = txt
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=9)
    c.fill      = PatternFill("solid", fgColor=DOURADO)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()

# Dados AMPLO
linha_inicio_a = linha_cab2_a + 1
LINHA_INICIO_AMPL = linha_inicio_a

for idx, ano in enumerate(anos):
    r = linha_inicio_a + idx
    we.row_dimensions[r].height = 24
    fill_par = AMARELO if idx % 2 == 0 else BRANCO

    pagos = PAGOS.get(ano)
    eh_passado_fechado = pagos and pagos.get('fechado')
    eh_passado_parcial = pagos and not pagos.get('fechado')

    # A: Ano
    cA = we[f"A{r}"]
    cA.value     = ano
    cA.font      = Font(name="Arial", bold=True, size=12)
    cA.alignment = Alignment(horizontal="center", vertical="center")
    cA.fill      = PatternFill("solid", fgColor=fill_par)
    cA.border    = borda_fina()

    # B: Aquisição
    cB = we[f"B{r}"]
    cB.value = AQUISICAO_2025 if ano == 2025 else 0
    cB.number_format = FMT_REAL
    cB.font      = Font(name="Arial", size=10)
    cB.alignment = Alignment(horizontal="right", vertical="center")
    cB.fill      = PatternFill("solid", fgColor=CINZA)
    cB.border    = borda_fina()

    # C: Amortização (paga onde já temos)
    cC = we[f"C{r}"]
    if pagos:
        cC.value = pagos['amort']
        cC.fill  = PatternFill("solid", fgColor=CINZA if eh_passado_fechado else AMARELO)
    else:
        cC.value = None
        cC.fill  = PatternFill("solid", fgColor=AMARELO)
    cC.number_format = FMT_REAL
    cC.font      = Font(name="Arial", size=10)
    cC.alignment = Alignment(horizontal="right", vertical="center")
    cC.border    = borda_fina()

    # D: Juros
    cD = we[f"D{r}"]
    if pagos:
        cD.value = pagos['juros']
        cD.fill  = PatternFill("solid", fgColor=CINZA if eh_passado_fechado else AMARELO)
    else:
        cD.value = None
        cD.fill  = PatternFill("solid", fgColor=AMARELO)
    cD.number_format = FMT_REAL
    cD.font      = Font(name="Arial", size=10)
    cD.alignment = Alignment(horizontal="right", vertical="center")
    cD.border    = borda_fina()

    # E: Seguros
    cE = we[f"E{r}"]
    if pagos:
        cE.value = pagos['seguros']
        cE.fill  = PatternFill("solid", fgColor=CINZA if eh_passado_fechado else AMARELO)
    else:
        cE.value = None
        cE.fill  = PatternFill("solid", fgColor=AMARELO)
    cE.number_format = FMT_REAL
    cE.font      = Font(name="Arial", size=10)
    cE.alignment = Alignment(horizontal="right", vertical="center")
    cE.border    = borda_fina()

    # F: Outros
    cF = we[f"F{r}"]
    cF.value = 0
    cF.number_format = FMT_REAL
    cF.font      = Font(name="Arial", size=10)
    cF.alignment = Alignment(horizontal="right", vertical="center")
    cF.fill      = PatternFill("solid", fgColor=AMARELO)
    cF.border    = borda_fina()

    # G: Benfeitorias auto (mesma fórmula da tabela conservadora)
    cG = we[f"G{r}"]
    cG.value         = (f'=SUMPRODUCT((YEAR(Lancamentos!$B$2:$B$1000)={ano})*'
                        f'(Lancamentos!$S$2:$S$1000))')
    cG.number_format = FMT_REAL
    cG.font          = Font(name="Arial", size=10, color=CINZA_ESCURO)
    cG.alignment     = Alignment(horizontal="right", vertical="center")
    cG.fill          = PatternFill("solid", fgColor=CINZA)
    cG.border        = borda_fina()

    # H: Benf override
    cH = we[f"H{r}"]
    cH.value         = None
    cH.number_format = FMT_REAL
    cH.font          = Font(name="Arial", size=10)
    cH.alignment     = Alignment(horizontal="right", vertical="center")
    cH.fill          = PatternFill("solid", fgColor=AMARELO)
    cH.border        = borda_fina()

    # I: Benf usado
    cI = we[f"I{r}"]
    cI.value         = f'=IF(H{r}<>"",H{r},G{r})'
    cI.number_format = FMT_REAL
    cI.font          = Font(name="Arial", bold=True, size=10)
    cI.alignment     = Alignment(horizontal="right", vertical="center")
    cI.fill          = PatternFill("solid", fgColor=AMARELO)
    cI.border        = borda_fina()

    # J: TOTAL pago ano
    cJ = we[f"J{r}"]
    cJ.value         = f'=B{r}+IFERROR(C{r},0)+IFERROR(D{r},0)+IFERROR(E{r},0)+F{r}+I{r}'
    cJ.number_format = FMT_REAL
    cJ.font          = Font(name="Arial", bold=True, size=10)
    cJ.alignment     = Alignment(horizontal="right", vertical="center")
    cJ.fill          = PatternFill("solid", fgColor=AMARELO)
    cJ.border        = borda_fina()

    # K: SALDO ACUMULADO
    cK = we[f"K{r}"]
    if idx == 0:
        cK.value = f"=J{r}"
    else:
        cK.value = f"=K{r-1}+J{r}"
    cK.number_format = FMT_REAL
    cK.font          = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=12)
    cK.fill          = PatternFill("solid", fgColor=DOURADO)
    cK.alignment     = Alignment(horizontal="right", vertical="center")
    cK.border        = borda_media()

    # L: Status
    cL = we[f"L{r}"]
    if eh_passado_fechado:
        cL.value = "✓ Fechado"
        cL.fill  = PatternFill("solid", fgColor=VERDE_CLARO)
    elif eh_passado_parcial:
        cL.value = f"⚠ Parcial\n({pagos['parcelas_pagas']}/{pagos['parcelas_total']} parc.)"
        cL.fill  = PatternFill("solid", fgColor=AMARELO_FORTE)
    else:
        cL.value = "○ A preencher"
        cL.fill  = PatternFill("solid", fgColor=fill_par)
    cL.font      = Font(name="Arial", bold=True, size=9)
    cL.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cL.border    = borda_fina()

    # M-N: Obs
    we.merge_cells(f"M{r}:N{r}")
    cM = we[f"M{r}"]
    cM.value     = obs_por_ano.get(ano, "")
    cM.font      = Font(name="Arial", italic=True, size=9, color=CINZA_ESCURO)
    cM.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    cM.fill      = PatternFill("solid", fgColor=fill_par)
    cM.border    = borda_fina()

LINHA_FIM_AMPL = linha_inicio_a + len(anos) - 1

# ════════════════════════════════════════════════════════════════════════════
# RESUMO COMPARATIVO ENXUTO (PAINEL DE LANÇAMENTO IR)
# ════════════════════════════════════════════════════════════════════════════
linha = LINHA_FIM_AMPL + 3
we.row_dimensions[linha].height = 28
we.merge_cells(f"A{linha}:N{linha}")
ct = we[f"A{linha}"]
ct.value     = "📊 PAINEL FINAL — VALOR EXATO A LANÇAR NA FICHA DE BENS DO IR"
ct.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=13)
ct.fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
ct.alignment = Alignment(horizontal="center", vertical="center")
ct.border    = borda_media()

linha += 1
we.row_dimensions[linha].height = 32
cabs_painel = [
    ("A", "Ano-base IR"),
    ("B", "Entrega da declaração"),
    ("C", "💰 CONSERVADOR\n(Saldo 31/12)"),
    ("D", "💰 AMPLO\n(Saldo 31/12)"),
    ("E", "Diferença\n(Juros + Seguros)"),
    ("F", "Status do ano"),
]
we.merge_cells(f"G{linha}:N{linha}")
we[f"G{linha}"].value = "Discriminação sugerida para a ficha de Bens e Direitos"
for col, txt in cabs_painel + [("G", we[f"G{linha}"].value)]:
    c = we[f"{col}{linha}"]
    c.value     = txt
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=10)
    c.fill      = PatternFill("solid", fgColor=AZUL_ESCURO)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()

discriminacao = {
    2025: "Compra: entrada R$1.500.000 + ITBI R$96.000 + cartório R$12.897,67. Financ. Itaú 10199098907 (3 parc. pagas). Projeto Bambu (2 NF, 50% ativável).",
    2026: "Acréscimo: 12 parcelas pagas em 2026 + benfeitorias do ano.",
    2027: "Acréscimo: 12 parcelas pagas em 2027 + benfeitorias do ano.",
    2028: "Acréscimo: 12 parcelas pagas em 2028 + benfeitorias do ano.",
    2029: "Acréscimo: 12 parcelas pagas em 2029 + benfeitorias do ano.",
    2030: "Acréscimo: 12 parcelas pagas em 2030 + benfeitorias do ano.",
    2031: "Acréscimo: 12 parcelas pagas em 2031 + benfeitorias do ano.",
    2032: "Acréscimo: 12 parcelas pagas em 2032 + benfeitorias do ano.",
    2033: "Acréscimo: 12 parcelas pagas em 2033 + benfeitorias do ano.",
    2034: "Acréscimo: 12 parcelas pagas em 2034 + benfeitorias do ano.",
    2035: "Acréscimo: 12 parcelas pagas em 2035 + benfeitorias do ano.",
}

linha_inicio_p = linha + 1
for idx, ano in enumerate(anos):
    r = linha_inicio_p + idx
    we.row_dimensions[r].height = 26
    fill = AZUL_CLARO if idx % 2 == 0 else BRANCO

    # A: ano
    cA = we[f"A{r}"]
    cA.value = ano
    cA.font  = Font(name="Arial", bold=True, size=12)
    cA.alignment = Alignment(horizontal="center", vertical="center")
    cA.fill  = PatternFill("solid", fgColor=fill)
    cA.border = borda_fina()

    # B: entrega
    cB = we[f"B{r}"]
    cB.value = f"Mar–Mai/{ano+1}"
    cB.font  = Font(name="Arial", size=10)
    cB.alignment = Alignment(horizontal="center", vertical="center")
    cB.fill  = PatternFill("solid", fgColor=fill)
    cB.border = borda_fina()

    # C: conservador (puxar da coluna I da tabela conservadora)
    r_c = LINHA_INICIO_CONS + idx
    cC = we[f"C{r}"]
    cC.value         = f"=I{r_c}"
    cC.number_format = FMT_REAL
    cC.font          = Font(name="Arial", bold=True, color=VERDE_ESCURO, size=11)
    cC.alignment     = Alignment(horizontal="right", vertical="center")
    cC.fill          = PatternFill("solid", fgColor=VERDE_CLARO)
    cC.border        = borda_fina()

    # D: amplo (puxar da K da tabela ampla)
    r_a = LINHA_INICIO_AMPL + idx
    cD = we[f"D{r}"]
    cD.value         = f"=K{r_a}"
    cD.number_format = FMT_REAL
    cD.font          = Font(name="Arial", bold=True, color="7F3F00", size=11)
    cD.alignment     = Alignment(horizontal="right", vertical="center")
    cD.fill          = PatternFill("solid", fgColor=AMARELO)
    cD.border        = borda_fina()

    # E: diferença
    cE = we[f"E{r}"]
    cE.value         = f"=D{r}-C{r}"
    cE.number_format = FMT_REAL
    cE.font          = Font(name="Arial", size=10)
    cE.alignment     = Alignment(horizontal="right", vertical="center")
    cE.fill          = PatternFill("solid", fgColor=fill)
    cE.border        = borda_fina()

    # F: Status
    cF = we[f"F{r}"]
    pagos_ano = PAGOS.get(ano)
    if pagos_ano and pagos_ano.get('fechado'):
        cF.value = "✓ Fechado"
        cF.fill  = PatternFill("solid", fgColor=VERDE_CLARO)
    elif pagos_ano and not pagos_ano.get('fechado'):
        cF.value = "⚠ Parcial"
        cF.fill  = PatternFill("solid", fgColor=AMARELO_FORTE)
    else:
        cF.value = "○ A preencher"
        cF.fill  = PatternFill("solid", fgColor=fill)
    cF.font      = Font(name="Arial", bold=True, size=9)
    cF.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cF.border    = borda_fina()

    # G-N: Discriminação
    we.merge_cells(f"G{r}:N{r}")
    cG = we[f"G{r}"]
    cG.value     = discriminacao.get(ano, "")
    cG.font      = Font(name="Arial", italic=True, size=9, color=CINZA_ESCURO)
    cG.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    cG.fill      = PatternFill("solid", fgColor=fill)
    cG.border    = borda_fina()

LINHA_FIM_PAINEL = linha_inicio_p + len(anos) - 1

# ════════════════════════════════════════════════════════════════════════════
# DÍVIDA REMANESCENTE — Ficha de Dívidas
# ════════════════════════════════════════════════════════════════════════════
linha = LINHA_FIM_PAINEL + 3
we.row_dimensions[linha].height = 26
we.merge_cells(f"A{linha}:N{linha}")
ct = we[f"A{linha}"]
ct.value     = "🏦 DÍVIDA REMANESCENTE — Ficha de DÍVIDAS E ÔNUS REAIS (NÃO é custo do imóvel)"
ct.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=12)
ct.fill      = PatternFill("solid", fgColor=LARANJA_FORTE)
ct.alignment = Alignment(horizontal="left", vertical="center")
ct.border    = borda_media()

linha += 1
we.row_dimensions[linha].height = 32
for col, txt in [("A","Ano"),("B","Saldo devedor 31/12 (R$)"),("C","Amortizado acum. (R$)"),
                 ("D","Verificação\n(saldo + amortizado)"),("E","Observação")]:
    c = we[f"{col}{linha}"]
    c.value     = txt
    c.font      = Font(name="Arial", bold=True, color=TEXTO_BRANCO, size=10)
    c.fill      = PatternFill("solid", fgColor=LARANJA_FORTE)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border    = borda_fina()
we.merge_cells(f"E{linha}:N{linha}")

# Saldos devedores extraídos do DDC ao final de cada ano
saldos_devedores_31_12 = {
    2025: 1695349.86,
    2026: 1653039.95,
    2027: 1599136.43,
    2028: 1545232.91,
    2029: 1491329.39,
    2030: 1437425.87,
    2031: 1383522.35,
    2032: 1329618.83,
    2033: 1275715.31,
    2034: 1221811.79,
    2035: 1167908.30,
}

linha_inicio_div = linha + 1
amort_acum = 0
for idx, ano in enumerate(anos):
    r = linha_inicio_div + idx
    we.row_dimensions[r].height = 22
    fill = LARANJA if idx % 2 == 0 else BRANCO
    pagos_ano = PAGOS.get(ano)
    if pagos_ano:
        amort_acum += pagos_ano['amort']

    cA = we[f"A{r}"]
    cA.value     = ano
    cA.font      = Font(name="Arial", bold=True, size=11)
    cA.alignment = Alignment(horizontal="center", vertical="center")
    cA.fill      = PatternFill("solid", fgColor=fill)
    cA.border    = borda_fina()

    cB = we[f"B{r}"]
    cB.value         = saldos_devedores_31_12[ano]
    cB.number_format = FMT_REAL
    cB.font          = Font(name="Arial", bold=True, size=10, color=LARANJA_FORTE)
    cB.fill          = PatternFill("solid", fgColor=fill)
    cB.alignment     = Alignment(horizontal="right", vertical="center")
    cB.border        = borda_fina()

    # C: amortizado acumulado — referencia diretamente da tabela conservador
    # = SUM(C{LINHA_INICIO_CONS}:C{LINHA_INICIO_CONS + idx})
    cC = we[f"C{r}"]
    cC.value         = f"=SUM(C{LINHA_INICIO_CONS}:C{LINHA_INICIO_CONS + idx})"
    cC.number_format = FMT_REAL
    cC.font          = Font(name="Arial", size=10)
    cC.fill          = PatternFill("solid", fgColor=fill)
    cC.alignment     = Alignment(horizontal="right", vertical="center")
    cC.border        = borda_fina()

    # D: verificação
    cD = we[f"D{r}"]
    cD.value         = f"=B{r}+C{r}"
    cD.number_format = FMT_REAL
    cD.font          = Font(name="Arial", italic=True, size=9, color=CINZA_ESCURO)
    cD.fill          = PatternFill("solid", fgColor=fill)
    cD.alignment     = Alignment(horizontal="right", vertical="center")
    cD.border        = borda_fina()

    # E: obs
    we.merge_cells(f"E{r}:N{r}")
    cE = we[f"E{r}"]
    cE.value     = ("Saldo + amortizado ≈ R$1,7M (valor original do contrato)."
                    if idx == 0 else "")
    cE.font      = Font(name="Arial", italic=True, size=9, color=CINZA_ESCURO)
    cE.fill      = PatternFill("solid", fgColor=fill)
    cE.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    cE.border    = borda_fina()

# ════════════════════════════════════════════════════════════════════════════
# NOTAS FINAIS
# ════════════════════════════════════════════════════════════════════════════
linha = linha_inicio_div + len(anos) + 2
we.row_dimensions[linha].height = 22
we.merge_cells(f"A{linha}:N{linha}")
ct = we[f"A{linha}"]
ct.value     = "NOTAS METODOLÓGICAS E LEGAIS"
ct.font      = Font(name="Arial", bold=True, color=AZUL_ESCURO, size=12)
ct.fill      = PatternFill("solid", fgColor=AZUL_CLARO)
ct.alignment = Alignment(horizontal="left", vertical="center")
ct.border    = borda_fina()

linha += 1
notas = [
    (VERDE_CLARO, "✓ Aquisição em 2025 = R$1.608.897,67 (entrada + ITBI + cartório). NÃO inclui o saldo do financiamento (esse é dívida)."),
    (VERDE_CLARO, "✓ Amortização paga em cada ano vai sendo acumulada — é assim que o financiamento se torna 'custo' ao longo do tempo."),
    (VERDE_CLARO, "✓ Benfeitorias são puxadas automaticamente da aba Lancamentos por ano (coluna 'Auto'). Use 'Override manual' apenas se precisar ajustar."),
    (AMARELO,     "⚠ Para preencher os anos futuros: extraia o DDC atualizado do Itaú no app/site e some os valores das parcelas pagas em cada ano."),
    (AMARELO,     "⚠ Cenário Amplo (juros+seguros): amparo na IN RFB 84/2001 art.17, V. Receita tem interpretação restritiva. Confirmar com contador antes de declarar."),
    (LARANJA,     "⚠ 2026 está PARCIAL: apenas 4 parcelas pagas (jan-abr). Atualizar mai-dez/2026 conforme forem pagas."),
    (CINZA,       "ℹ A 1ª declaração com este imóvel será o ano-base 2025 (entregue em mar-mai/2026)."),
    (CINZA,       "ℹ Saldo devedor do financiamento = DÍVIDA, declarar separadamente em 'Dívidas e Ônus Reais'."),
]
for fill, texto in notas:
    we.row_dimensions[linha].height = 22
    we.merge_cells(f"A{linha}:N{linha}")
    c = we[f"A{linha}"]
    c.value     = texto
    c.font      = Font(name="Arial", size=9)
    c.fill      = PatternFill("solid", fgColor=fill)
    c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    c.border    = borda_fina()
    linha += 1

# ── LEGENDA DE CORES ──────────────────────────────────────────────────────────
linha += 1
we.row_dimensions[linha].height = 20
we.merge_cells(f"A{linha}:N{linha}")
ct = we[f"A{linha}"]
ct.value     = "🎨 LEGENDA DE CORES"
ct.font      = Font(name="Arial", bold=True, color=AZUL_ESCURO, size=11)
ct.fill      = PatternFill("solid", fgColor=AZUL_CLARO)
ct.alignment = Alignment(horizontal="left", vertical="center")

linha += 1
legenda = [
    (CINZA, "Confirmado — não editar (vem de fórmula ou pagamento já efetuado)"),
    (AMARELO, "Editável — preencher conforme as parcelas forem pagas"),
    (VERDE_DESTAQUE, "💰 Saldo a declarar no IR (cenário conservador)", TEXTO_BRANCO),
    (DOURADO, "💰 Saldo a declarar no IR (cenário amplo)", TEXTO_BRANCO),
    (LARANJA, "Dívida — vai na ficha de Dívidas e Ônus Reais"),
]
for item in legenda:
    fill = item[0]
    texto = item[1]
    cor = item[2] if len(item) > 2 else TEXTO_ESCURO
    we.row_dimensions[linha].height = 20
    we.merge_cells(f"A{linha}:N{linha}")
    c = we[f"A{linha}"]
    c.value     = "    " + texto
    c.font      = Font(name="Arial", size=9, color=cor)
    c.fill      = PatternFill("solid", fgColor=fill)
    c.alignment = Alignment(horizontal="left", vertical="center")
    c.border    = borda_fina()
    linha += 1

# ── LARGURAS ──────────────────────────────────────────────────────────────────
larguras = {
    "A": 8,   # Ano
    "B": 14,  # Aquisição
    "C": 13,  # Amort
    "D": 13,  # Outros (cons) ou Juros (amplo)
    "E": 13,  # Benf auto (cons) ou Seguros (amplo)
    "F": 13,  # Benf override (cons) ou Outros (amplo)
    "G": 13,  # Benf usado (cons) ou Benf auto (amplo)
    "H": 14,  # Total ano (cons) ou Benf override (amplo)
    "I": 18,  # Saldo (cons) ou Benf usado (amplo)
    "J": 14,  # Status (cons) ou Total (amplo)
    "K": 18,  # Obs (cons) ou Saldo (amplo)
    "L": 12,
    "M": 18,
    "N": 22,
}
for col, w in larguras.items():
    we.column_dimensions[col].width = w

# Congelar primeiras 5 linhas para facilitar navegação
we.freeze_panes = "A8"

wb.save('/mnt/user-data/outputs/Controle_Gastos_Obra_Pro_IR.xlsx')
print(f"\n=== Salvo! ===")
print(f"LINHA_INICIO_CONS:  {LINHA_INICIO_CONS}")
print(f"LINHA_FIM_CONS:     {LINHA_FIM_CONS}")
print(f"LINHA_INICIO_AMPL:  {LINHA_INICIO_AMPL}")
print(f"LINHA_FIM_AMPL:     {LINHA_FIM_AMPL}")
