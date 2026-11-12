from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from datetime import datetime

# Cores
VERDE_CLARO  = "E2EFDA"
AZUL_CLARO   = "D6E4F0"
AZUL_INPUT   = "DEEBF7"
AMARELO      = "FFF2CC"
LARANJA      = "FCE4D6"
CINZA        = "F2F2F2"
BRANCO       = "FFFFFF"
TEXTO_ESCURO = "1F1F1F"

FMT_REAL = 'R$ #,##0.00'
FMT_DATA = 'dd/mm/yyyy'

def borda():
    s = Side(border_style="thin", color="BFBFBF")
    return Border(left=s, right=s, top=s, bottom=s)
def borda_input():
    s = Side(border_style="thin", color="2E75B6")
    return Border(left=s, right=s, top=s, bottom=s)

wb = load_workbook('/mnt/user-data/outputs/Valor_Imovel_Ap_Av_Portugal_IR.xlsx')

# ════════════════════════════════════════════════════════════════════════
# 1. ABA Custo_Total_Imovel
# ════════════════════════════════════════════════════════════════════════
print("1. Preenchendo Custo_Total_Imovel...")
wr = wb['Custo_Total_Imovel']

# Subtítulo
wr.cell(row=2, column=1).value = (
    "Apartamento 194 - Cond. One Brooklin - Av. Portugal 1.223 | Daniel Vieira de Freitas"
)

# Linha 7: Entrada (recursos próprios + FGTS)
# Recursos próprios: R$20.000 | FGTS: R$279.894,85 | Total: R$299.894,85
ws = wr
ws.cell(row=7, column=1).value = "Entrada — recursos próprios + FGTS"
ws.cell(row=7, column=4).value = 299894.85
ws.cell(row=7, column=4).number_format = FMT_REAL
ws.cell(row=7, column=5).value = 299894.85
ws.cell(row=7, column=5).number_format = FMT_REAL
ws.cell(row=7, column=6).value = (
    "Contrato Itaú nº 10183777607 (07/07/2023): R$20.000 recursos próprios + R$279.894,85 FGTS = R$299.894,85. "
    "Ativável 100% (compõe custo de aquisição)."
)

# Linha 8: ITBI
ws.cell(row=8, column=4).value = 26100.00
ws.cell(row=8, column=4).number_format = FMT_REAL
ws.cell(row=8, column=5).value = 26100.00
ws.cell(row=8, column=5).number_format = FMT_REAL
ws.cell(row=8, column=6).value = (
    "Guia ITBI-IV Prefeitura SP | Transação 55018604-2 | Pago em 10/07/2023 R$26.100. "
    "Base: valor de transação R$870.000 (maior que venal ref. R$534.678) x 3% = R$26.100. Ativável 100%."
)

# Linha 9: Emolumentos cartório + tarifa avaliação
# Boleto 1: R$6.433,76 + Boleto 2: R$71,45 = R$6.505,21
# + Tarifa avaliação Itaú (item L do contrato): R$1.017,80
# Total: R$7.523,01
ws.cell(row=9, column=4).value = 7523.01
ws.cell(row=9, column=4).number_format = FMT_REAL
ws.cell(row=9, column=5).value = 7523.01
ws.cell(row=9, column=5).number_format = FMT_REAL
ws.cell(row=9, column=6).value = (
    "Emolumentos 15º RI/SP via Operador Nacional do Registro: Boleto AC002650405 R$6.433,76 (pago 27/07/2023) "
    "+ Boleto Valid Hub R$71,45 (pago 25/07/2023) = R$6.505,21. Tarifa Avaliação Itaú (item L do contrato): R$1.017,80. "
    "Total: R$7.523,01. Ativável 100%."
)

# Linha 10: Corretagem - sem info
# manter vazio com nota

# Linha 25: Preço de venda
ws.cell(row=25, column=4).value = 870000.00
ws.cell(row=25, column=4).number_format = FMT_REAL
# Linha 26: Valor venal de referência
ws.cell(row=26, column=4).value = 534678.00
ws.cell(row=26, column=4).number_format = FMT_REAL
# Linha 27: Valor de avaliação Itaú (para leilão) - item 13 do contrato
ws.cell(row=27, column=4).value = 850000.00
ws.cell(row=27, column=4).number_format = FMT_REAL
# Linha 28: Saldo devedor mais recente (31/12/2025)
ws.cell(row=28, column=1).value = "Saldo devedor em 31/12/2025"
ws.cell(row=28, column=4).value = 396386.99
ws.cell(row=28, column=4).number_format = FMT_REAL

print("   ✓ Custo_Total_Imovel preenchido")

# ════════════════════════════════════════════════════════════════════════
# 2. ABA Financiamento_IR
# ════════════════════════════════════════════════════════════════════════
print("\n2. Preenchendo Financiamento_IR...")
wf = wb['Financiamento_IR']

# Cabeçalho L2
wf.cell(row=2, column=1).value = (
    "Contrato 10183777607 | Itaú Unibanco | Daniel Vieira de Freitas | Imóvel: Apartamento 194 - One Brooklin"
)

# Dados do contrato (linhas 5-18)
dados = {
    5:  10183777607,                # Número do contrato
    6:  "Itaú Unibanco",            # Banco
    7:  "9638 / 360-9",             # Agência/conta
    8:  datetime(2023, 7, 7),       # Data de início
    9:  570105.15,                  # Valor da operação
    # 10: SAC (já está)
    # 11: modalidade
    12: 0.008347551 / 100,          # Taxa mensal c/ benefício
    13: 10.0170612 / 100,           # Taxa anual c/ benefício
    14: 11.80 / 100,                # CET anual c/ benefício
    15: 408,                        # Prazo total
    16: 152,                        # Prazo remanescente
    17: datetime(2057, 7, 7),       # Vencimento última parcela
    18: 396386.99,                  # Saldo devedor em 31/12/2025
}
# Atualizar label da linha 18
wf.cell(row=18, column=1).value = "Saldo devedor em 31/12/2025"

for row, val in dados.items():
    cell = wf.cell(row=row, column=3)
    cell.value = val
    if isinstance(val, datetime):
        cell.number_format = FMT_DATA
    elif isinstance(val, float) and val < 1:
        cell.number_format = '0.000000%'
    elif isinstance(val, float):
        cell.number_format = FMT_REAL

# Atualizar modalidade (linha 11) para refletir SFH
wf.cell(row=11, column=3).value = "Taxa fixa - Sistema Financeiro Habitacional (SFH)"

print("   ✓ Dados do contrato preenchidos")

# ── Tabela de parcelas (linhas 24-30 normalmente)
# Vou preencher o resumo TOTAL acumulado (até 31/12/2025) já que são muitas parcelas (29)
# Linha 31 era a linha "TOTAL"
# Vou pôr os 29 totais agregados como uma linha-resumo

# Verificar estrutura
print("\n   Estrutura tabela de parcelas:")
for r in range(22, 35):
    a = wf.cell(row=r, column=1).value
    b = wf.cell(row=r, column=2).value
    if a or b:
        print(f"     L{r}: A={str(a)[:20]} B={b}")

# Vou popular as 7 linhas de parcelas com um resumo estilizado
# (até Dez/2025 = 29 parcelas + 1 amort extra FGTS)
# Como temos só 7 linhas no template, vou fazer 4 linhas-resumo:
# - 2023: 5 parcelas
# - 2024: 12 parcelas + amort extra FGTS  
# - 2025: 12 parcelas
# - 2026 (jan-abr): 4 parcelas

# Linha 24: 2023
wf.cell(row=24, column=1).value = "2023"
wf.cell(row=24, column=2).value = datetime(2023, 12, 31)
wf.cell(row=24, column=2).number_format = FMT_DATA
wf.cell(row=24, column=3).value = 7017.56     # Amort
wf.cell(row=24, column=4).value = 23783.08    # Juros
wf.cell(row=24, column=5).value = 1640.03     # MIP
wf.cell(row=24, column=6).value = 283.65      # DFI
wf.cell(row=24, column=7).value = 32724.32    # Total parcelas (sem RES/TCA do IR)
wf.cell(row=24, column=8).value = 566810.06   # Saldo devedor
for c in range(3, 11):
    wf.cell(row=24, column=c).number_format = FMT_REAL

# Linha 25: 2024 (com amortização extraordinária FGTS R$129.294,56)
wf.cell(row=25, column=1).value = "2024"
wf.cell(row=25, column=2).value = datetime(2024, 12, 31)
wf.cell(row=25, column=2).number_format = FMT_DATA
wf.cell(row=25, column=3).value = 23396.55 + 129294.56   # Amort + extraord. FGTS
wf.cell(row=25, column=4).value = 49659.32
wf.cell(row=25, column=5).value = 3025.68
wf.cell(row=25, column=6).value = 571.13
wf.cell(row=25, column=7).value = 23396.55 + 49659.32 + 3025.68 + 571.13 + 129294.56
wf.cell(row=25, column=8).value = 419147.43
for c in range(3, 11):
    wf.cell(row=25, column=c).number_format = FMT_REAL

# Linha 26: 2025
wf.cell(row=26, column=1).value = "2025"
wf.cell(row=26, column=2).value = datetime(2025, 12, 31)
wf.cell(row=26, column=2).number_format = FMT_DATA
wf.cell(row=26, column=3).value = 30212.89
wf.cell(row=26, column=4).value = 40978.23
wf.cell(row=26, column=5).value = 2754.42
wf.cell(row=26, column=6).value = 578.70
wf.cell(row=26, column=7).value = 30212.89 + 40978.23 + 2754.42 + 578.70
wf.cell(row=26, column=8).value = 396386.99
for c in range(3, 11):
    wf.cell(row=26, column=c).number_format = FMT_REAL

# Linha 27: 2026 (jan-abr) - parcial
wf.cell(row=27, column=1).value = "2026 (jan-abr)"
wf.cell(row=27, column=2).value = datetime(2026, 4, 30)
wf.cell(row=27, column=2).number_format = FMT_DATA
# Parcelas 30-33 do DDC (jan-abr 2026):
amort_2026_jan_abr = 2545.27 + 2549.74 + 2552.87 + 2557.19  # 10.205,07
juros_2026_jan_abr = 3314.49 + 3299.03 + 3281.77 + 3265.99  # 13.161,28
mip_2026_jan_abr   = 234.94 + 233.85 + 232.62 + 231.50      # 932,91
dfi_2026_jan_abr   = 48.75 + 48.84 + 48.90 + 48.98          # 195,47
wf.cell(row=27, column=3).value = amort_2026_jan_abr
wf.cell(row=27, column=4).value = juros_2026_jan_abr
wf.cell(row=27, column=5).value = mip_2026_jan_abr
wf.cell(row=27, column=6).value = dfi_2026_jan_abr
wf.cell(row=27, column=7).value = amort_2026_jan_abr + juros_2026_jan_abr + mip_2026_jan_abr + dfi_2026_jan_abr
wf.cell(row=27, column=8).value = 388693.59  # Saldo após parcela 33 (07/04/2026)
for c in range(3, 11):
    wf.cell(row=27, column=c).number_format = FMT_REAL

# Atualizar B32 (label "X parcelas")
wf.cell(row=32, column=2).value = "Resumo anual (33 parcelas pagas)"

# Atualizar título do bloco resumo
wf.cell(row=22, column=1).value = "TABELA-RESUMO POR ANO (período 2023-2026, até abr)"

print("   ✓ Tabela de parcelas preenchida (resumo por ano)")

# ════════════════════════════════════════════════════════════════════════
# 3. ABA Evolucao_Anual_IR — preencher pagamentos efetivos por ano
# ════════════════════════════════════════════════════════════════════════
print("\n3. Preenchendo Evolucao_Anual_IR...")
we = wb['Evolucao_Anual_IR']

# Subtítulo
we.cell(row=2, column=1).value = (
    "Apartamento 194 - One Brooklin - Av. Portugal 1.223 | Pagamentos efetivos do financiamento Itaú 10183777607"
)

# Estrutura: linhas 9-19 contêm anos 2025-2035
# Mas o imóvel foi adquirido em 2023, então preciso ajustar os anos!
# Vou trocar 2025-2035 para 2023-2033 (10 anos a partir da aquisição)

# Mapear que linha corresponde a que ano
print("\n   Anos atuais nas linhas:")
for r in range(9, 20):
    print(f"     L{r}: ano = {we.cell(row=r, column=1).value}")

# Ajustar para começar em 2023
anos_corrigidos = list(range(2023, 2034))  # 2023, 2024, ... 2033
for idx, ano in enumerate(anos_corrigidos):
    r = 9 + idx
    we.cell(row=r, column=1).value = ano
print(f"   ✓ Anos ajustados para 2023-2033 (linhas 9-19)")

# Dados por ano
# 2023: aquisição completa + 5 parcelas pagas
aquisicao_2023 = 299894.85 + 26100.00 + 7523.01  # = 333.517,86
amort_2023   = 7017.56
juros_2023   = 23783.08
seguros_2023 = 1640.03 + 283.65   # MIP + DFI

# 2024: 12 parcelas + amortização extraordinária FGTS
amort_2024   = 23396.55 + 129294.56  # Inclui amort extraord
juros_2024   = 49659.32
seguros_2024 = 3025.68 + 571.13

# 2025: 12 parcelas
amort_2025   = 30212.89
juros_2025   = 40978.23
seguros_2025 = 2754.42 + 578.70

# 2026 (até abril, parcial)
amort_2026   = 10205.07
juros_2026   = 13161.28
seguros_2026 = 932.91 + 195.47

# Preencher linhas 9-12 (2023-2026) com pagamentos
dados_ano = {
    2023: {'aquis': aquisicao_2023, 'amort': amort_2023, 'juros': juros_2023, 'seg': seguros_2023, 'saldo': 566810.06},
    2024: {'aquis': 0,              'amort': amort_2024, 'juros': juros_2024, 'seg': seguros_2024, 'saldo': 419147.43},
    2025: {'aquis': 0,              'amort': amort_2025, 'juros': juros_2025, 'seg': seguros_2025, 'saldo': 396386.99},
    2026: {'aquis': 0,              'amort': amort_2026, 'juros': juros_2026, 'seg': seguros_2026, 'saldo': 388693.59},
}

# Saldos devedores 31/12 para todos os anos (até 2033 - 11 linhas)
saldos_dev = {
    2023: 566810.06, 2024: 419147.43, 2025: 396386.99, 2026: 368849.16,
    2027: 338111.76, 2028: 307374.36, 2029: 276636.96, 2030: 245899.56,
    2031: 215162.16, 2032: 184424.76, 2033: 153687.30,
}

for idx, ano in enumerate(anos_corrigidos):
    r = 9 + idx
    if ano in dados_ano:
        d = dados_ano[ano]
        we.cell(row=r, column=2).value = d['aquis']    # B: Aquisição
        we.cell(row=r, column=3).value = d['amort']    # C: Amortização
        we.cell(row=r, column=4).value = d['juros']    # D: Juros
        we.cell(row=r, column=5).value = d['seg']      # E: Seguros
        for c in [2, 3, 4, 5]:
            we.cell(row=r, column=c).number_format = FMT_REAL
    
    # J: Saldo devedor (sempre preencher)
    if ano in saldos_dev:
        we.cell(row=r, column=10).value = saldos_dev[ano]
        we.cell(row=r, column=10).number_format = FMT_REAL

print("   ✓ Pagamentos por ano preenchidos (2023-2026)")
print("   ✓ Saldos devedores preenchidos (2023-2033)")

# Atualizar título da tabela (linha 6)
we.cell(row=6, column=1).value = (
    "TABELA INTEGRADA — Pagamentos do financiamento Itaú 10183777607 (One Brooklin)"
)

# Atualizar instruções (linha 4)
we.cell(row=4, column=1).value = (
    "📝 INSTRUÇÕES: Aquisição em 2023 = R$333.517,86 (entrada R$299.894,85 + ITBI R$26.100 + cartório/avaliação R$7.523,01). "
    "Amortização 2024 inclui R$129.294,56 de amort. extraordinária FGTS (DAMP II em 04/07/2024). "
    "Para anos futuros (2027 em diante), preencher conforme DDC anual real. Benfeitorias puxam de Lancamentos automaticamente."
)

# ════════════════════════════════════════════════════════════════════════
# 4. Atualizar Resumo IR (linhas 23-33) — anos automáticos via fórmulas
# ════════════════════════════════════════════════════════════════════════
# As linhas 23-33 referenciam K9:K19 e N9:N19 — já vai puxar automaticamente
# Mas o ano em A23 ainda é "2025" - precisamos mudar para "2023" etc.
print("\n4. Atualizando Resumo IR...")

for idx, ano in enumerate(anos_corrigidos):
    r = 23 + idx
    we.cell(row=r, column=1).value = ano
    # Coluna B (entregar em abril/ano+1)
    we.cell(row=r, column=2).value = f"abr/{ano+1}"

print("   ✓ Anos ajustados no Resumo IR (linhas 23-33)")

wb.save('/mnt/user-data/outputs/Valor_Imovel_Ap_Av_Portugal_IR.xlsx')
print("\n✓ Arquivo salvo")
