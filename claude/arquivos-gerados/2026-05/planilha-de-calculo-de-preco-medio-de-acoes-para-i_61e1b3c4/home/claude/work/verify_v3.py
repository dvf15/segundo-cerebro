"""
Valida cálculo FIFO event-by-event para cada ticker contra os valores
calculados manualmente.
"""
from openpyxl import load_workbook

wb = load_workbook("/home/claude/work/Calculadora_Preco_Medio_IR_FINAL.xlsx", data_only=True)
ws3 = wb["3_Cálculo"]
ws4 = wb["4_Resumo_IR"]

# Trace cronológico de cada ticker
def trace_ticker(ticker):
    print(f"\n{'='*100}")
    print(f"TRAJETÓRIA FIFO - {ticker}")
    print('='*100)
    print(f"{'Data':<12} {'Mov.Original':<45} {'Tipo':<14} {'Qty':>9} {'Valor':>11} {'QtdApos':>10} {'CustoApos':>13} {'PMApos':>10}")
    print('-'*135)
    found = 0
    last_qty, last_cost, last_pm = 0, 0, 0
    for r in range(2, 200):
        tk = ws3.cell(row=r, column=1).value
        if tk == ticker:
            data = ws3.cell(row=r, column=2).value
            mov = ws3.cell(row=r, column=3).value
            tipo = ws3.cell(row=r, column=4).value
            qty = ws3.cell(row=r, column=6).value or 0
            val = ws3.cell(row=r, column=8).value or 0
            qa = ws3.cell(row=r, column=12).value or 0
            ca = ws3.cell(row=r, column=13).value or 0
            pm = ws3.cell(row=r, column=14).value or 0
            data_str = data.strftime("%d/%m/%Y") if hasattr(data, 'strftime') else str(data)
            # Não mostra IGNORAR para reduzir ruído
            if tipo != "IGNORAR":
                print(f"{data_str:<12} {(mov or '')[:44]:<45} {tipo:<14} {qty:>9.4f} {val:>11.2f} {qa:>10.4f} {ca:>13.2f} {pm:>10.4f}")
                found += 1
                last_qty, last_cost, last_pm = qa, ca, pm
    return last_qty, last_cost, last_pm

# Tickers de interesse
tickers = ['ITSA4', 'CMIG4', 'BBDC4', 'ALOS3', 'KLBN4', 'TAEE11', 'BBSE3', 'AURE3', 'SAPR11']

results = {}
for ticker in tickers:
    qty, cost, pm = trace_ticker(ticker)
    results[ticker] = (qty, cost, pm)

# Comparação com expected (calculado manualmente)
print("\n" + "="*100)
print("VERIFICAÇÃO vs valores esperados (calculados manualmente)")
print("="*100)

expected = {
    'ITSA4':  (24210.38, 270912.84, 11.1898),
    'CMIG4':  (2748.00, 29018.88, 10.5600),
    'BBDC4':  (5211.00, 88080.28, 16.9027),
    'ALOS3':  (2248.00, 47849.49, 21.2855),  # Bem 20 final
    'KLBN4':  (5074.24, 21106.92, 4.1597),
    'TAEE11': (750.00, 26081.00, 34.7747),
    'BBSE3':  (850.00, 28126.00, 33.0894),
    'AURE3':  (1700.00, 21236.00, 12.4918),
    'SAPR11': (1279.00, 27080.00, 21.1728),
}

import math
all_ok = True
print(f"{'Ticker':<8} {'Got Qty':>11} {'Exp Qty':>11} {'Got Cost':>13} {'Exp Cost':>13} {'Got PM':>10} {'Exp PM':>10} {'Status'}")
print('-'*95)
for ticker, (eq, ec, epm) in expected.items():
    gq, gc, gpm = results.get(ticker, (0, 0, 0))
    ok_q = math.isclose(gq, eq, abs_tol=0.5)
    ok_c = math.isclose(gc, ec, abs_tol=10)  # tolerância R$10 (rounding)
    ok_pm = math.isclose(gpm, epm, abs_tol=0.005)
    ok = ok_q and ok_c and ok_pm
    status = "✓ OK" if ok else "✗ FAIL"
    if not ok:
        all_ok = False
    print(f"{ticker:<8} {gq:>11.4f} {eq:>11.4f} {gc:>13.2f} {ec:>13.2f} {gpm:>10.4f} {epm:>10.4f}  {status}")

print(f"\n{'✓ TODOS OK' if all_ok else '✗ ERROS DETECTADOS'}")
