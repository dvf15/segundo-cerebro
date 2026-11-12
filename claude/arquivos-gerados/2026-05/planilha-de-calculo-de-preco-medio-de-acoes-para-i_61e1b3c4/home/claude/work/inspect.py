"""
Verifica:
1. Como cada movimentação foi classificada
2. Se há REVISAR pendentes
3. Os totais por ticker no resumo
"""
from openpyxl import load_workbook
from collections import Counter

wb = load_workbook("/home/claude/work/Calculadora_Preco_Medio_IR_PREENCHIDA.xlsx", data_only=True)

# 1. Auditoria de classificação
ws3 = wb["3_Cálculo"]
print("=" * 100)
print("AUDITORIA DE CLASSIFICAÇÃO (3_Cálculo)")
print("=" * 100)

classification_audit = []
for r in range(2, 200):
    ticker = ws3.cell(row=r, column=1).value
    if not ticker:
        continue
    mov = ws3.cell(row=r, column=3).value
    tipo = ws3.cell(row=r, column=4).value
    classification_audit.append((mov, tipo))

# Conta combinações únicas
classified_pairs = Counter(classification_audit)
print(f"{'Movimentação Original':<45} {'Tipo Classificado':<18} {'Count'}")
print("-" * 80)
for (mov, tipo), count in sorted(classified_pairs.items(), key=lambda x: (x[0][1] or "", x[0][0] or "")):
    if not mov:
        continue
    flag = "  ⚠" if tipo == "REVISAR" else ""
    print(f"{(mov or '')[:44]:<45} {(tipo or ''):<18} {count}{flag}")

# 2. Linhas marcadas como REVISAR (precisa atenção do usuário)
print()
print("=" * 100)
print("LINHAS MARCADAS COMO REVISAR")
print("=" * 100)
revisar_count = 0
for r in range(2, 200):
    tipo = ws3.cell(row=r, column=4).value
    if tipo == "REVISAR":
        ticker = ws3.cell(row=r, column=1).value
        data = ws3.cell(row=r, column=2).value
        mov = ws3.cell(row=r, column=3).value
        qtd = ws3.cell(row=r, column=6).value
        val = ws3.cell(row=r, column=8).value
        data_str = data.strftime("%d/%m/%Y") if hasattr(data, 'strftime') else str(data)
        print(f"  L{r}: {ticker} {data_str} '{mov}' qtd={qtd} val={val}")
        revisar_count += 1
print(f"\nTotal REVISAR: {revisar_count}")

# 3. Resumo por ticker
print()
print("=" * 100)
print("RESUMO POR TICKER (4_Resumo_IR) - sem posição inicial preenchida ainda")
print("=" * 100)
ws4 = wb["4_Resumo_IR"]
print(f"{'Ticker':<8} {'Δ Período':>12} {'Compras Qty':>12} {'Compras R$':>14} {'Vendas Qty':>11} {'Vendas R$':>13}")
print("-" * 75)
for r in range(5, 30):
    ticker = ws4.cell(row=r, column=1).value
    if not ticker:
        continue
    delta = ws4.cell(row=r, column=2).value or 0
    c_qty = ws4.cell(row=r, column=3).value or 0
    c_val = ws4.cell(row=r, column=4).value or 0
    v_qty = ws4.cell(row=r, column=5).value or 0
    v_val = ws4.cell(row=r, column=6).value or 0
    print(f"{ticker:<8} {delta:>12.4f} {c_qty:>12.2f} {c_val:>14.2f} {v_qty:>11.2f} {v_val:>13.2f}")

# Sem posição inicial, qtd final = delta (algumas serão negativas, indicando que precisa do saldo inicial)
print()
print("Tickers com Δ NEGATIVO (precisam saldo inicial preenchido para cálculo correto):")
for r in range(5, 30):
    ticker = ws4.cell(row=r, column=1).value
    if not ticker:
        continue
    delta = ws4.cell(row=r, column=2).value or 0
    if delta < 0:
        print(f"  {ticker}: Δ = {delta:.4f} (vendeu {-delta:.4f} a mais que comprou - tinha posição prévia)")

print()
print("Tickers com Δ POSITIVO ou zero:")
for r in range(5, 30):
    ticker = ws4.cell(row=r, column=1).value
    if not ticker:
        continue
    delta = ws4.cell(row=r, column=2).value or 0
    if delta > 0:
        c_qty = ws4.cell(row=r, column=3).value or 0
        v_qty = ws4.cell(row=r, column=5).value or 0
        print(f"  {ticker}: comprou {c_qty:.2f}, vendeu {v_qty:.2f}, líquido +{delta:.4f}")
    elif delta == 0:
        c_qty = ws4.cell(row=r, column=3).value or 0
        v_qty = ws4.cell(row=r, column=5).value or 0
        print(f"  {ticker}: comprou {c_qty:.2f}, vendeu {v_qty:.2f}, líquido 0")
