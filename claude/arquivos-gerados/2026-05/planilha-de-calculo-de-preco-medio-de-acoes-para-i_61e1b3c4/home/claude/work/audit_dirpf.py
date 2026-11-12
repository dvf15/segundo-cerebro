"""Audit final da aba 5_DIRPF_2026."""
from openpyxl import load_workbook

wb = load_workbook("/home/claude/work/Calculadora_Preco_Medio_IR_FINAL.xlsx", data_only=True)
ws5 = wb["5_DIRPF_2026"]

print("=" * 130)
print("ABA 5_DIRPF_2026 - posição final 31/12/2025")
print("=" * 130)
print(f"{'Bem':>4} {'Ticker':<8} {'Qty24':>10} {'PM24':>10} {'Custo24':>13} | "
      f"{'Compras':>9} {'V.Comp':>11} {'Vendas':>9} {'V.Vend':>11} {'Bonif':>7} | "
      f"{'Qty25':>10} {'PM25':>10} {'Custo25':>13}")
print("-" * 130)

for r in range(4, 20):
    bem = ws5.cell(row=r, column=5).value
    if not bem and ws5.cell(row=r, column=1).value != "TOTAL":
        continue
    ticker = ws5.cell(row=r, column=1).value
    
    if ticker == "TOTAL":
        cost24 = ws5.cell(row=r, column=7).value or 0
        cost25 = ws5.cell(row=r, column=16).value or 0
        print("-" * 130)
        print(f"     {ticker:<8} {'':>10} {'':>10} {cost24:>13,.2f} | "
              f"{'':>9} {'':>11} {'':>9} {'':>11} {'':>7} | "
              f"{'':>10} {'':>10} {cost25:>13,.2f}")
        continue
    
    qty24 = ws5.cell(row=r, column=6).value or 0
    cost24 = ws5.cell(row=r, column=7).value or 0
    pm24 = ws5.cell(row=r, column=8).value or 0
    comp_q = ws5.cell(row=r, column=10).value or 0
    comp_v = ws5.cell(row=r, column=11).value or 0
    vend_q = ws5.cell(row=r, column=12).value or 0
    vend_v = ws5.cell(row=r, column=13).value or 0
    bonif = ws5.cell(row=r, column=14).value or 0
    qty25 = ws5.cell(row=r, column=15).value or 0
    cost25 = ws5.cell(row=r, column=16).value or 0
    pm25 = ws5.cell(row=r, column=17).value or 0
    
    print(f"{bem:>4} {ticker:<8} {qty24:>10.2f} {pm24:>10.4f} {cost24:>13,.2f} | "
          f"{comp_q:>9.2f} {comp_v:>11,.2f} {vend_q:>9.2f} {vend_v:>11,.2f} {bonif:>7.2f} | "
          f"{qty25:>10.2f} {pm25:>10.4f} {cost25:>13,.2f}")

print()
print("=" * 130)
print("DESCRITIVOS NOVOS para DIRPF 2026")
print("=" * 130)
for r in range(4, 20):
    ticker = ws5.cell(row=r, column=1).value
    bem = ws5.cell(row=r, column=5).value
    desc = ws5.cell(row=r, column=18).value
    if not desc or ticker == "TOTAL":
        continue
    print(f"\n[Bem {bem} - {ticker}]")
    print(f"  {desc}")
