"""
Teste: cola dados simulados na aba 2_Extrato_B3, recalcula,
e verifica se os resultados batem com os esperados.
"""
import shutil
from openpyxl import load_workbook
from datetime import datetime

# Copia o arquivo para teste (não polui o original)
src = "/home/claude/work/Calculadora_Preco_Medio_IR.xlsx"
dst = "/home/claude/work/Test_Calculadora.xlsx"
shutil.copy(src, dst)

wb = load_workbook(dst)
ws = wb["2_Extrato_B3"]

# Cenário de teste - JÁ ORDENADO por ticker depois data ascendente
# (como o usuário deve ordenar antes do cálculo)
test_data = [
    # PETR4: compra inicial
    ("Credito", datetime(2023, 1, 10), "Transferência - Liquidação", "PETR4 - PETROLEO BRASILEIRO PN", "XP Investimentos", 100, 30.00, 3000.00),
    # PETR4: segunda compra
    ("Credito", datetime(2023, 3, 15), "Compra - Mercado à Vista", "PETR4 - PETROLEO BRASILEIRO PN", "XP Investimentos", 50, 25.00, 1250.00),
    # PETR4: bonificação 10% (15 ações sem custo)
    ("Credito", datetime(2023, 5, 20), "Bonificação em Ativos", "PETR4 - PETROLEO BRASILEIRO PN", "XP Investimentos", 15, 0.00, 0.00),
    # PETR4: dividendo (deve ser ignorado no cálculo)
    ("Credito", datetime(2023, 6, 1), "Dividendo", "PETR4 - PETROLEO BRASILEIRO PN", "XP Investimentos", 0, 0.00, 250.00),
    # PETR4: desdobramento 1:2 (recebe 165 ações adicionais)
    ("Credito", datetime(2023, 7, 10), "Desdobro", "PETR4 - PETROLEO BRASILEIRO PN", "XP Investimentos", 165, 0.00, 0.00),
    # PETR4: venda parcial
    ("Debito", datetime(2023, 9, 5), "Venda - Mercado à Vista", "PETR4 - PETROLEO BRASILEIRO PN", "XP Investimentos", 100, 15.00, 1500.00),
    # PETR4: subscrição
    ("Credito", datetime(2023, 11, 20), "Recibo de Subscrição", "PETR4 - PETROLEO BRASILEIRO PN", "XP Investimentos", 20, 10.00, 200.00),

    # VALE3: testando grupamento e novo ticker
    ("Credito", datetime(2023, 2, 5), "Compra - Mercado à Vista", "VALE3 - VALE ON", "Clear Corretora", 50, 60.00, 3000.00),
    ("Debito", datetime(2023, 8, 12), "Grupamento", "VALE3 - VALE ON", "Clear Corretora", 10, 0.00, 0.00),
]

# Reordena: por ticker (extraído) ascendente, depois por data ascendente
test_data.sort(key=lambda x: (x[3].split(" - ")[0], x[1]))

# Cola os dados
for i, row_data in enumerate(test_data):
    for j, val in enumerate(row_data):
        cell = ws.cell(row=i + 2, column=j + 1, value=val)

wb.save(dst)
print("Test data inserted. Recalculating...")
