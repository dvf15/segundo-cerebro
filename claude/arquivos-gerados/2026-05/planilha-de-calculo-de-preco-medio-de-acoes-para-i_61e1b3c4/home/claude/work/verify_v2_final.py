"""Verifica cálculos após reclassificação de aluguel."""
from openpyxl import load_workbook
import math

wb = load_workbook("/home/claude/work/Calculadora_Preco_Medio_IR_FINAL_v2.xlsx", data_only=True)
ws3 = wb["3_Cálculo"]

def trace(ticker):
    print(f"\n{'='*100}")
    print(f"TRAJETÓRIA - {ticker}")
    print('='*100)
    print(f"{'Data':<12} {'Movimentação':<55} {'Tipo':<14} {'Qty':>9} {'QtdApós':>10} {'CustoApós':>13} {'PMApós':>10}")
    print('-'*125)
    last_qty, last_cost, last_pm = 0, 0, 0
    for r in range(2, 200):
        tk = ws3.cell(row=r, column=1).value
        if tk == ticker:
            data = ws3.cell(row=r, column=2).value
            mov = ws3.cell(row=r, column=3).value
            tipo = ws3.cell(row=r, column=4).value
            qty = ws3.cell(row=r, column=6).value or 0
            qa = ws3.cell(row=r, column=12).value or 0
            ca = ws3.cell(row=r, column=13).value or 0
            pm = ws3.cell(row=r, column=14).value or 0
            data_str = data.strftime("%d/%m/%Y") if hasattr(data, 'strftime') else str(data)
            if tipo != "IGNORAR":
                print(f"{data_str:<12} {(mov or '')[:54]:<55} {tipo:<14} {qty:>9.4f} {qa:>10.4f} {ca:>13.2f} {pm:>10.4f}")
                last_qty, last_cost, last_pm = qa, ca, pm
            else:
                # Mostra IGNORAR só se for relevante (pra confirmar que aluguel foi pego)
                if "BTC" in str(mov) or "aluguel" in str(mov):
                    print(f"{data_str:<12} {(mov or '')[:54]:<55} [IGNORAR-BTC] qty={qty}")
    return last_qty, last_cost, last_pm

results = {}
for t in ['ITSA4', 'CMIG4', 'BBDC4', 'ALOS3', 'KLBN4']:
    results[t] = trace(t)

# Comparação com expected
print("\n" + "="*100)
print("VERIFICAÇÃO vs cálculo manual esperado")
print("="*100)

# Expected:
# ITSA4: 8449.35 inicial + 6500 + 8738 + 220 - 0.35 + 303.38 = 24210.38 (mesmo de antes)
#   Custo: 91754.62 + 58890 + 84845.98 + 1474 + 0 (frac) = 236964.60 (~)
#   PM: 236964.60 / 24210.38 ≈ 9.79 (cuidado: fração mexe um pouco)
#
# CMIG4: 2748 a 7.69 = 21134 (mantém)
# BBDC4: 5211 a 13.51 = 70406 (mantém)

expected = {
    'ITSA4':  (24210.38, 236961.18, 9.7876),  # ajustado pra fração R$ -3.80 (= 91754.62 * 0.35/8449.35)
    'CMIG4':  (2748, 21134.00, 7.6907),
    'BBDC4':  (5211, 70406.00, 13.5110),
    'ALOS3':  (2248, 47849.90, 21.2855),
    'KLBN4':  (5074.24, 21106.92, 4.1596),
}

print(f"{'Ticker':<8} {'Got Qty':>11} {'Exp Qty':>11} {'Got Cost':>13} {'Exp Cost':>13} {'Got PM':>10} {'Exp PM':>10} {'Status'}")
print('-'*95)
all_ok = True
for ticker, (eq, ec, epm) in expected.items():
    gq, gc, gpm = results.get(ticker, (0, 0, 0))
    ok_q = math.isclose(gq, eq, abs_tol=0.5)
    ok_c = math.isclose(gc, ec, abs_tol=10)
    ok_pm = math.isclose(gpm, epm, abs_tol=0.005)
    ok = ok_q and ok_c and ok_pm
    status = "✓ OK" if ok else "✗ FAIL"
    if not ok:
        all_ok = False
    print(f"{ticker:<8} {gq:>11.4f} {eq:>11.4f} {gc:>13.2f} {ec:>13.2f} {gpm:>10.4f} {epm:>10.4f}  {status}")

print(f"\n{'✓ TODOS OK' if all_ok else '✗ ERROS'}")
