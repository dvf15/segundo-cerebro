"""
Detalha as movimentações ITSA4 em 2025 para validar cálculo
e identificar o problema da Atualização/ITSA2.
"""
from openpyxl import load_workbook

wb = load_workbook("/home/claude/work/Calculadora_Preco_Medio_IR_PREENCHIDA.xlsx", data_only=True)
ws3 = wb["3_Cálculo"]

print("ITSA4 - cronologia 2025:")
print(f"{'Data':<12} {'Mov.Original':<35} {'Tipo':<14} {'QtdMov':>10} {'Valor':>12} {'QtdAnt':>10} {'QtdApos':>10}")
print("-" * 110)
for r in range(2, 200):
    ticker = ws3.cell(row=r, column=1).value
    if ticker == "ITSA4":
        data = ws3.cell(row=r, column=2).value
        mov = ws3.cell(row=r, column=3).value
        tipo = ws3.cell(row=r, column=4).value
        qtd = ws3.cell(row=r, column=6).value or 0
        val = ws3.cell(row=r, column=8).value or 0
        qa = ws3.cell(row=r, column=9).value or 0
        qp = ws3.cell(row=r, column=12).value or 0
        data_str = data.strftime("%d/%m/%Y") if hasattr(data, 'strftime') else str(data)
        # só mostra os relevantes
        if tipo not in ("IGNORAR",):
            print(f"{data_str:<12} {(mov or '')[:34]:<35} {tipo:<14} {qtd:>10.4f} {val:>12.2f} {qa:>10.2f} {qp:>10.2f}")

print()
print("ITSA2 (direitos de subscrição):")
for r in range(2, 200):
    ticker = ws3.cell(row=r, column=1).value
    if ticker == "ITSA2":
        data = ws3.cell(row=r, column=2).value
        mov = ws3.cell(row=r, column=3).value
        tipo = ws3.cell(row=r, column=4).value
        qtd = ws3.cell(row=r, column=6).value or 0
        val = ws3.cell(row=r, column=8).value or 0
        data_str = data.strftime("%d/%m/%Y") if hasattr(data, 'strftime') else str(data)
        print(f"  {data_str} {(mov or ''):<35} {tipo:<14} qtd={qtd} val={val}")

print()
print("ITSA10 (recibos de subscrição):")
for r in range(2, 200):
    ticker = ws3.cell(row=r, column=1).value
    if ticker == "ITSA10":
        data = ws3.cell(row=r, column=2).value
        mov = ws3.cell(row=r, column=3).value
        tipo = ws3.cell(row=r, column=4).value
        qtd = ws3.cell(row=r, column=6).value or 0
        data_str = data.strftime("%d/%m/%Y") if hasattr(data, 'strftime') else str(data)
        print(f"  {data_str} {(mov or ''):<35} {tipo:<14} qtd={qtd}")
