"""
Verifica se os cálculos batem com os esperados.

Cenário PETR4:
1. Compra 100 @ R$ 30 = 3000 → qtd 100, custo 3000, avg 30
2. Compra 50 @ R$ 25 = 1250 → qtd 150, custo 4250, avg 28.3333
3. Bonificação +15 sem custo → qtd 165, custo 4250, avg 25.7576
4. (Dividendo ignorado - qtd 165, custo 4250)
5. Desdobramento +165 → qtd 330, custo 4250, avg 12.8788
6. Venda 100 @ 15 = 1500 → qtd 230, custo = 4250 * (230/330) = 2962.121, avg 12.8788
7. Subscrição +20 @ 10 = 200 → qtd 250, custo 3162.121, avg 12.6485

Cenário VALE3:
1. Compra 50 @ 60 = 3000 → qtd 50, custo 3000, avg 60
2. Grupamento -10 → qtd 40, custo 3000, avg 75
"""
from openpyxl import load_workbook

wb = load_workbook("/home/claude/work/Test_Calculadora.xlsx", data_only=True)
ws = wb["3_Cálculo"]

print("=" * 100)
print("ABA 3_Cálculo - resultados linha a linha")
print("=" * 100)
header = ["Ticker", "Data", "Movim.", "Tipo", "QtdMov", "Valor", "QtdAnt", "CustoAnt", "QtdApós", "CustoApós", "PrecoMed"]
print(f"{header[0]:<7} {header[1]:<12} {header[3]:<14} {header[4]:>7} {header[5]:>10} {header[6]:>8} {header[7]:>10} {header[8]:>9} {header[9]:>11} {header[10]:>10}")
print("-" * 100)

for r in range(2, 12):
    ticker = ws.cell(row=r, column=1).value
    if ticker is None or ticker == "":
        continue
    data = ws.cell(row=r, column=2).value
    tipo = ws.cell(row=r, column=4).value
    qtd_mov = ws.cell(row=r, column=6).value
    valor = ws.cell(row=r, column=8).value
    qtd_ant = ws.cell(row=r, column=9).value
    custo_ant = ws.cell(row=r, column=10).value
    qtd_apos = ws.cell(row=r, column=12).value
    custo_apos = ws.cell(row=r, column=13).value
    preco_med = ws.cell(row=r, column=14).value
    
    data_str = data.strftime("%d/%m/%Y") if hasattr(data, 'strftime') else str(data)
    print(f"{ticker:<7} {data_str:<12} {tipo:<14} "
          f"{qtd_mov or 0:>7.2f} {valor or 0:>10.2f} "
          f"{qtd_ant or 0:>8.2f} {custo_ant or 0:>10.2f} "
          f"{qtd_apos or 0:>9.2f} {custo_apos or 0:>11.2f} {preco_med or 0:>10.4f}")

print()
print("=" * 100)
print("ABA 4_Resumo_IR - posição final por ticker")
print("=" * 100)
ws4 = wb["4_Resumo_IR"]
print(f"{'Ticker':<8} {'Qtd Final':>12} {'Preço Médio':>14} {'Custo Total':>14} {'Última Data':<12}")
print("-" * 60)
for r in range(4, 8):
    ticker = ws4.cell(row=r, column=1).value
    if not ticker:
        continue
    qtd = ws4.cell(row=r, column=2).value or 0
    pm = ws4.cell(row=r, column=3).value or 0
    custo = ws4.cell(row=r, column=4).value or 0
    data = ws4.cell(row=r, column=5).value
    data_str = data.strftime("%d/%m/%Y") if hasattr(data, 'strftime') else str(data)
    print(f"{ticker:<8} {qtd:>12.2f} {pm:>14.4f} {custo:>14.2f} {data_str:<12}")

print()
print("Discriminação de cada ticker:")
for r in range(4, 8):
    ticker = ws4.cell(row=r, column=1).value
    discr = ws4.cell(row=r, column=9).value
    if ticker:
        print(f"  [{ticker}] {discr}")

# Verificações
print()
print("=" * 100)
print("VERIFICAÇÕES vs valores esperados")
print("=" * 100)

# PETR4 final esperado: qtd 250, custo 3162.121, avg 12.6485
# VALE3 final esperado: qtd 40, custo 3000, avg 75

import math

def find_resumo(ticker_target):
    for r in range(4, NUM_TICKERS + 4):
        if ws4.cell(row=r, column=1).value == ticker_target:
            return (
                ws4.cell(row=r, column=2).value or 0,
                ws4.cell(row=r, column=3).value or 0,
                ws4.cell(row=r, column=4).value or 0,
            )
    return None

NUM_TICKERS = 100

q_petr4, pm_petr4, c_petr4 = find_resumo("PETR4")
q_vale3, pm_vale3, c_vale3 = find_resumo("VALE3")

checks = [
    ("PETR4 qtd final", q_petr4, 250, 0.01),
    ("PETR4 custo total", c_petr4, 3162.12, 0.05),
    ("PETR4 preço médio", pm_petr4, 12.6485, 0.0005),
    ("VALE3 qtd final", q_vale3, 40, 0.01),
    ("VALE3 custo total", c_vale3, 3000.00, 0.01),
    ("VALE3 preço médio", pm_vale3, 75.0, 0.01),
]
all_ok = True
for name, got, expected, tol in checks:
    ok = math.isclose(got, expected, abs_tol=tol)
    status = "✓ OK" if ok else "✗ FALHA"
    print(f"  {status}  {name}: got={got:.4f}  esperado={expected:.4f}")
    if not ok:
        all_ok = False

print()
print("RESULTADO:", "✓ TODOS OS TESTES PASSARAM" if all_ok else "✗ HÁ DIVERGÊNCIAS")
