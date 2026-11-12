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
AZUL_INPUT    = "DEEBF7"

FMT_REAL = 'R$ #,##0.00'

def borda_fina():
    s = Side(border_style="thin", color="BFBFBF")
    return Border(left=s, right=s, top=s, bottom=s)
def borda_input():
    s = Side(border_style="thin", color="2E75B6")
    return Border(left=s, right=s, top=s, bottom=s)

wb = load_workbook('/mnt/user-data/outputs/Valor_Imovel_Ap_Av_Portugal_IR.xlsx')

# ════════════════════════════════════════════════════════════════════
# DADOS CONSOLIDADOS
# ════════════════════════════════════════════════════════════════════
# AQUISIÇÃO em 2023:
#   - Entrada recursos próprios: R$20.000
#   - Entrada FGTS:               R$279.894,85
#   - ITBI:                       R$26.100,00
#   - Emolumentos boleto 1:        R$6.433,76
#   - Emolumentos boleto 2:           R$71,45
#   - Tarifa avaliação Itaú:        R$1.017,80
ENTRADA_PROPRIA = 20000.00
ENTRADA_FGTS    = 279894.85
ITBI            = 26100.00
EMOLUMENTOS     = 6433.76 + 71.45 + 1017.80  # R$7.523,01
AQUIS_2023      = ENTRADA_PROPRIA + ENTRADA_FGTS + ITBI + EMOLUMENTOS  # R$333.517,86

# AMORTIZAÇÃO POR ANO (do DDC)
# 2024 inclui amortização extraordinária FGTS R$129.294,56 + amortização normal
amort_2023 = 7017.56
amort_2024_normal = 23396.55
amort_2024_fgts = 129294.56  # amortização extra com FGTS
amort_2024 = amort_2024_normal + amort_2024_fgts  # R$152.691,11
amort_2025 = 30212.89
# 2026: 4 parcelas pagas (jan-abr)
amort_2026_pago = 2545.27 + 2549.74 + 2552.87 + 2557.19  # R$10.205,07

# JUROS POR ANO
juros_2023 = 23783.08
juros_2024 = 49659.32 + 963.72  # +963,72 juros pró-rata da amortização extra
juros_2025 = 40978.23
juros_2026_pago = 3314.49 + 3299.03 + 3281.77 + 3265.99  # R$13.161,28

# SEGUROS (MIP + DFI APENAS — RES e TCA não são obrigatórios para o financiamento)
# Vou usar só MIP+DFI pois RES e TCA são opcionais/administrativos
seg_2023 = 1640.03 + 283.65  # MIP+DFI
seg_2024 = 3025.68 + 571.13
seg_2025 = 2754.42 + 578.70
# 2026: 4 parcelas
seg_2026_pago = (234.94+233.85+232.62+231.50) + (48.75+48.84+48.90+48.98)

# Saldos devedores
saldos_devedores = {
    2023: 566810.06, 2024: 419147.43, 2025: 396386.99, 2026: 368849.16,
    2027: 338111.76, 2028: 307374.36, 2029: 276636.96, 2030: 245899.56,
    2031: 215162.16, 2032: 184424.76, 2033: 153687.30, 2034: 122949.84,
    2035: 92212.38,
}

print("=== DADOS CONSOLIDADOS ===")
print(f"Aquisição 2023: R$ {AQUIS_2023:,.2f}")
print(f"Amortização 2023: R$ {amort_2023:,.2f}")
print(f"Amortização 2024 (normal+FGTS): R$ {amort_2024:,.2f}")
print(f"Amortização 2025: R$ {amort_2025:,.2f}")
print(f"Amortização 2026 (4 parc.): R$ {amort_2026_pago:,.2f}")

# ════════════════════════════════════════════════════════════════════
# 1. ABA Financiamento_IR — preencher dados do contrato
# ════════════════════════════════════════════════════════════════════
print("\n1. Preenchendo Financiamento_IR...")
wf = wb['Financiamento_IR']

# Atualizar subtítulo
wf.cell(row=2, column=1).value = "Contrato 10183777607 | Itaú Unibanco | Daniel Vieira de Freitas | Imóvel: Av. Portugal 1223, Apt 194 - One Brooklin"

# Dados do contrato (linhas 5-18)
dados_contrato = {
    5: "10183777607",            # Número
    6: "Itaú Unibanco",
    7: "9638 / 360-9",
    8: datetime(2023, 7, 7),     # Data início
    9: 570105.15,                 # Valor da operação
    # 10: "SAC" (já está)
    # 11: "Taxa fixa - Carteira Hipotecária" (já está) - vou trocar para SFH
    12: 0.008347551 / 100,        # Taxa mensal com benefício
    13: 10.0170612 / 100,         # Taxa anual com benefício
    14: 12.99 / 100,              # CET anual
    15: 408,                      # Prazo total
    16: 152,                      # Prazo remanescente
    17: datetime(2057, 7, 7),     # Data última parcela
    18: 386779.31,                # Saldo devedor 30/04/2026 (parcela 33)
}
for row, val in dados_contrato.items():
    wf.cell(row=row, column=3).value = val

# Atualizar modalidade L11 (era "Taxa fixa - Carteira Hipotecária")
wf.cell(row=11, column=3).value = "Taxa fixa - Sistema Financeiro Habitação (SFH)"

# Formatar datas e %
wf.cell(row=8, column=3).number_format = 'dd/mm/yyyy'
wf.cell(row=17, column=3).number_format = 'dd/mm/yyyy'
wf.cell(row=9, column=3).number_format = FMT_REAL
wf.cell(row=18, column=3).number_format = FMT_REAL
wf.cell(row=12, column=3).number_format = '0.00000000%'
wf.cell(row=13, column=3).number_format = '0.0000%'
wf.cell(row=14, column=3).number_format = '0.0000%'

# Tabela de parcelas (linhas 24-30) — preencher com as parcelas pagas que cabem
# Como temos 33 parcelas pagas (até abril/2026), vou preencher só as últimas 7 disponíveis para
# manter a estrutura. Mas o melhor é ampliar.
# Por simplicidade, vou preencher apenas as 4 parcelas pagas em 2026 (jan-abr),
# pois é o que importa para o IR atual.

# Estrutura da tabela: A=parcela, B=venc, C=amort, D=juros, E=MIP, F=DFI, G=total, H=saldo dev, I=ativ_cons, J=ativ_amplo
parcelas_2026 = [
    (30, datetime(2026,1,7), 2545.27, 3314.49, 234.94, 48.75, 6208.35, 394516.37),
    (31, datetime(2026,2,7), 2549.74, 3299.03, 233.85, 48.84, 6196.36, 392659.80),
    (32, datetime(2026,3,7), 2552.87, 3281.77, 232.62, 48.90, 6181.06, 390589.12),
    (33, datetime(2026,4,7), 2557.19, 3265.99, 231.50, 48.98, 6168.56, 388693.59),
]

for idx, (parc, venc, amort, juros, mip, dfi, total, saldo) in enumerate(parcelas_2026):
    r = 24 + idx
    wf.cell(row=r, column=1).value = parc
    wf.cell(row=r, column=2).value = venc
    wf.cell(row=r, column=2).number_format = 'dd/mm/yyyy'
    wf.cell(row=r, column=3).value = amort
    wf.cell(row=r, column=4).value = juros
    wf.cell(row=r, column=5).value = mip
    wf.cell(row=r, column=6).value = dfi
    wf.cell(row=r, column=7).value = total
    wf.cell(row=r, column=8).value = saldo
    wf.cell(row=r, column=9).value = amort  # ativável conservador
    wf.cell(row=r, column=10).value = amort + juros + mip + dfi  # ativável amplo
    for c in range(3, 11):
        wf.cell(row=r, column=c).number_format = FMT_REAL

# Saldo devedor na linha total
wf.cell(row=32, column=8).value = 386779.31
wf.cell(row=32, column=8).number_format = FMT_REAL

# Atualizar título do resumo
wf.cell(row=34, column=1).value = "RESUMO PARA O IR — ENCARGOS DO FINANCIAMENTO PAGOS (parcelas 30-33 jan-abr/2026 mostradas)"
wf.cell(row=32, column=2).value = "4 parcelas mostradas (jan-abr/2026)"

# ════════════════════════════════════════════════════════════════════
# 2. ABA Custo_Total_Imovel — preencher aquisição
# ════════════════════════════════════════════════════════════════════
print("\n2. Preenchendo Custo_Total_Imovel...")
wr = wb['Custo_Total_Imovel']

# Subtítulo
wr.cell(row=2, column=1).value = "Apartamento 194 — Av. Portugal 1223, One Brooklin | Daniel Vieira de Freitas | Adquirido em 07/07/2023"

# Linha 7: Entrada (recursos próprios + FGTS)
wr.cell(row=7, column=4).value = ENTRADA_PROPRIA + ENTRADA_FGTS
wr.cell(row=7, column=5).value = ENTRADA_PROPRIA + ENTRADA_FGTS
wr.cell(row=7, column=4).number_format = FMT_REAL
wr.cell(row=7, column=5).number_format = FMT_REAL
wr.cell(row=7, column=6).value = (
    f"Entrada total: R${ENTRADA_PROPRIA:,.2f} (recursos próprios) + R${ENTRADA_FGTS:,.2f} (FGTS) "
    f"= R${ENTRADA_PROPRIA+ENTRADA_FGTS:,.2f}. Contrato Itaú nº 10183777607 itens 3-A e 3-B. Ativável 100%."
)

# Linha 8: ITBI
wr.cell(row=8, column=4).value = ITBI
wr.cell(row=8, column=5).value = ITBI
wr.cell(row=8, column=4).number_format = FMT_REAL
wr.cell(row=8, column=5).number_format = FMT_REAL
wr.cell(row=8, column=6).value = (
    "ITBI Prefeitura SP. Transação 55018604-2 venc. 19/07/2023 | "
    "Base: R$870.000 (transação) x 3% = R$26.100. Pago em 10/07/2023 R$26.100. Ativável 100%."
)

# Linha 9: Emolumentos
wr.cell(row=9, column=4).value = EMOLUMENTOS
wr.cell(row=9, column=5).value = EMOLUMENTOS
wr.cell(row=9, column=4).number_format = FMT_REAL
wr.cell(row=9, column=5).number_format = FMT_REAL
wr.cell(row=9, column=6).value = (
    f"Emolumentos cartoriais via ONR: R$6.433,76 (pago 27/07/2023) + R$71,45 (pago 25/07/2023) "
    f"+ Tarifa avaliação Itaú R$1.017,80 = R${EMOLUMENTOS:,.2f}. Ativável 100%."
)

# Seção 5: informações complementares
wr.cell(row=25, column=4).value = 870000.00
wr.cell(row=25, column=4).number_format = FMT_REAL
wr.cell(row=25, column=6).value = "Contrato Itaú nº 10183777607, item 2."
wr.cell(row=26, column=4).value = 534678.00
wr.cell(row=26, column=4).number_format = FMT_REAL
wr.cell(row=26, column=6).value = "Guia ITBI 55018604-2."
wr.cell(row=27, column=4).value = 850000.00
wr.cell(row=27, column=4).number_format = FMT_REAL
wr.cell(row=27, column=6).value = "Contrato Itaú nº 10183777607, item 13 (avaliação para leilão)."
wr.cell(row=28, column=1).value = "Saldo devedor em 30/04/2026"
wr.cell(row=28, column=4).value = 386779.31
wr.cell(row=28, column=4).number_format = FMT_REAL
wr.cell(row=28, column=6).value = "Após parcela 33 (07/04/2026). DDC Itaú emitido em 30/04/2026."

# ════════════════════════════════════════════════════════════════════
# 3. ABA Evolucao_Anual_IR — preencher por ano
# ════════════════════════════════════════════════════════════════════
print("\n3. Preenchendo Evolucao_Anual_IR...")
we = wb['Evolucao_Anual_IR']

# Subtítulo
we.cell(row=2, column=1).value = (
    "Apartamento Av. Portugal 1223 Apt 194 | Apenas valores EFETIVAMENTE PAGOS são acumulados"
)

# Vou olhar a estrutura da tabela atual
# As linhas 9-19 são para 11 anos (2025-2035)
# MAS o imóvel foi comprado em 2023!
# Preciso verificar se é necessário ajustar os anos
print("\nAnos atuais da tabela:")
for r in range(9, 20):
    a = we.cell(row=r, column=1).value
    print(f"  L{r}: {a}")

# Vou modificar os anos para 2023-2033 (11 anos a partir da compra)
# Não — o usuário pediu 2025-2035 quando criamos, mas para o Av Portugal a compra foi em 2023.
# Vou ajustar para começar em 2023.

# Ajustar anos: 2023 a 2033 (11 anos)
for idx, ano in enumerate(range(2023, 2034)):
    r = 9 + idx
    we.cell(row=r, column=1).value = ano

# Preencher dados pagos por ano:
# Estrutura colunas: A=Ano, B=Aquis, C=Amort, D=Juros, E=Seguros, F=Benfeitorias (fórmula), 
# G=Outros, H=Total cons, I=Total amplo, J=Saldo devedor, K=Saldo cons acum, etc.

valores_pagos = {
    2023: {
        'aquis': AQUIS_2023, 'amort': amort_2023, 'juros': juros_2023, 'seguros': seg_2023,
    },
    2024: {
        'aquis': 0, 'amort': amort_2024, 'juros': juros_2024, 'seguros': seg_2024,
    },
    2025: {
        'aquis': 0, 'amort': amort_2025, 'juros': juros_2025, 'seguros': seg_2025,
    },
    2026: {
        'aquis': 0, 'amort': amort_2026_pago, 'juros': juros_2026_pago, 'seguros': seg_2026_pago,
    },
    # 2027-2033: futuros, deixar em branco
}

for idx, ano in enumerate(range(2023, 2034)):
    r = 9 + idx
    if ano in valores_pagos:
        v = valores_pagos[ano]
        we.cell(row=r, column=2).value = v['aquis'] if v['aquis'] else 0
        we.cell(row=r, column=3).value = v['amort']
        we.cell(row=r, column=4).value = v['juros']
        we.cell(row=r, column=5).value = v['seguros']
        for col in range(2, 6):
            we.cell(row=r, column=col).number_format = FMT_REAL
    else:
        # Anos futuros: deixar em branco
        for col in range(2, 6):
            we.cell(row=r, column=col).value = None

    # Saldo devedor (coluna J)
    if ano in saldos_devedores:
        we.cell(row=r, column=10).value = saldos_devedores[ano]
        we.cell(row=r, column=10).number_format = FMT_REAL
    else:
        we.cell(row=r, column=10).value = None

# Atualizar células do RESUMO IR (linhas 23-33) — anos correspondentes
# Estrutura: A=ano, B=entregar em, C=cons, D=amplo, E=diff, F=saldo dev
print("\nResumo IR - linhas 23-33:")
for idx, ano in enumerate(range(2023, 2034)):
    r = 23 + idx
    we.cell(row=r, column=1).value = ano
    we.cell(row=r, column=2).value = f"abr/{ano+1}"
    # As fórmulas C-F já apontam para K9, K10, etc - mantêm

wb.save('/mnt/user-data/outputs/Valor_Imovel_Ap_Av_Portugal_IR.xlsx')
print("\n✓ Salvo!")
