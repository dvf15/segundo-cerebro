"""
Filtra os dados do extrato do usuário e popula a planilha v2:
1. Mantém SOMENTE 2025
2. Mantém SOMENTE ações (ticker padrão XXXX# / XXXX## / XXXXX##)
3. Ordena por ticker + data ascendente
4. Inclui TODOS os movimentos (incluindo os que serão classificados como IGNORAR)
   para o usuário ter visibilidade completa do que aconteceu
"""
import pandas as pd
import re
import shutil
from openpyxl import load_workbook

src_template = "/home/claude/work/Calculadora_Preco_Medio_IR_v2.xlsx"
src_extract = "/mnt/user-data/uploads/movimentacao-2026-05-04-09-46-03.xlsx"
dst = "/home/claude/work/Calculadora_Preco_Medio_IR_PREENCHIDA.xlsx"

shutil.copy(src_template, dst)

df = pd.read_excel(src_extract)
df['Data'] = pd.to_datetime(df['Data'], dayfirst=True, errors='coerce')
df = df[df['Data'].dt.year == 2025].copy()

# Extrai ticker
def extract_ticker(produto):
    if pd.isna(produto):
        return ""
    s = str(produto).strip()
    if " - " in s:
        return s.split(" - ")[0].strip()
    return s.strip()

df['Ticker'] = df['Produto'].apply(extract_ticker)

# Filtro de stocks: ticker tem que ser 4-6 chars, todas letras maiusculas + 1-2 dígitos no final
# Padrões válidos: XXXX# (5), XXXX## (6), XXXXX## (raro mas existe)
stock_pattern = re.compile(r'^[A-Z]{4,5}\d{1,2}$')
df_stocks = df[df['Ticker'].apply(lambda t: bool(stock_pattern.match(t)))].copy()

print(f"Total movimentações em 2025: {len(df)}")
print(f"Movimentações de ações em 2025: {len(df_stocks)}")
print(f"Tickers de ações: {sorted(df_stocks['Ticker'].unique())}")

# Ordena por ticker + data ascendente
df_stocks = df_stocks.sort_values(['Ticker', 'Data']).reset_index(drop=True)

# Limpa o Produto removendo trailing whitespace (B3 às vezes vem com espaços extras)
df_stocks['Produto'] = df_stocks['Produto'].str.strip()

# Substitui "-" por valor numérico onde aplicável
def clean_value(v):
    if pd.isna(v):
        return None
    if isinstance(v, str):
        if v.strip() == "-":
            return None
        try:
            return float(v.replace(',', '.'))
        except:
            return v
    return v

df_stocks['Preço unitário'] = df_stocks['Preço unitário'].apply(clean_value)
df_stocks['Valor da Operação'] = df_stocks['Valor da Operação'].apply(clean_value)
df_stocks['Quantidade'] = df_stocks['Quantidade'].apply(clean_value)

# Carrega template e cola
wb = load_workbook(dst)
ws = wb["2_Extrato_B3"]

cols = ['Entrada/Saída', 'Data', 'Movimentação', 'Produto', 'Instituição',
        'Quantidade', 'Preço unitário', 'Valor da Operação']

for i, (_, row) in enumerate(df_stocks.iterrows()):
    excel_row = i + 2
    for j, col in enumerate(cols):
        val = row[col]
        if col == 'Data' and hasattr(val, 'to_pydatetime'):
            val = val.to_pydatetime()
        cell = ws.cell(row=excel_row, column=j+1, value=val)

wb.save(dst)
print(f"\nDados colados em: {dst}")
print(f"Linhas usadas: {len(df_stocks)}")
