"""
Reclassifica as 8 movimentações de aluguel como IGNORAR e refaz cálculos.
"""
import shutil
from openpyxl import load_workbook
from datetime import datetime

src = "/home/claude/work/Calculadora_Preco_Medio_IR_FINAL.xlsx"
dst = "/home/claude/work/Calculadora_Preco_Medio_IR_FINAL_v2.xlsx"
shutil.copy(src, dst)

wb = load_workbook(dst)
ws2 = wb["2_Extrato_B3"]

# Lista das 8 linhas a reclassificar
# (ticker, data, sinal_E/S, qty)
rentals = [
    ('CMIG4', datetime(2025, 3, 24), 'Debito', 2748),
    ('CMIG4', datetime(2025, 5, 20), 'Credito', 2748),
    ('BBDC4', datetime(2025, 6, 17), 'Credito', 5211),
    ('BBDC4', datetime(2025, 6, 24), 'Debito', 5211),
    ('BBDC4', datetime(2025, 11, 10), 'Credito', 5211),
    ('BBDC4', datetime(2025, 12, 23), 'Debito', 5211),
    ('ITSA4', datetime(2025, 8, 21), 'Debito', 15169),
    ('ITSA4', datetime(2025, 11, 12), 'Credito', 15169),
]

def get_ticker(prod):
    if not prod:
        return ""
    s = str(prod).strip()
    if " - " in s:
        return s.split(" - ")[0].strip()
    return s

# Localizar e renomear cada linha
modified = 0
for r in range(2, 1200):
    es = ws2.cell(row=r, column=1).value
    dt = ws2.cell(row=r, column=2).value
    mov = ws2.cell(row=r, column=3).value
    prod = ws2.cell(row=r, column=4).value
    qty = ws2.cell(row=r, column=6).value
    
    if not prod:
        continue
    ticker = get_ticker(prod)
    
    for rt, rd, res, rq in rentals:
        if (ticker == rt 
            and isinstance(dt, datetime) and dt.date() == rd.date()
            and es == res
            and qty == rq
            and mov == "Transferência - Liquidação"):
            # Reclassificar como aluguel
            ws2.cell(row=r, column=3).value = "Transferência - Liquidação (BTC - aluguel)"
            modified += 1
            print(f"L{r}: {ticker} {dt.date()} {es} qty={qty} → reclassificada como BTC")
            break

print(f"\nTotal reclassificadas: {modified} (esperado: 8)")

# Agora preciso atualizar a fórmula de classificação na aba 3 para pegar o sufixo "(BTC"
# Vou ler a fórmula atual da coluna D linha 2 e adicionar uma regra
ws3 = wb["3_Cálculo"]
old_formula = ws3.cell(row=2, column=4).value
print(f"\nFórmula atual D2 (primeiros 200 chars):")
print(old_formula[:200] if old_formula else "None")

wb.save(dst)
print(f"\nSaved: {dst}")
