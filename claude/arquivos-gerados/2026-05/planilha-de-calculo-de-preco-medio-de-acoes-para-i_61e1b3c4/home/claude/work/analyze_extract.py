"""
Analisa o extrato B3 do usuário para entender a estrutura,
identificar tickers de ações vs outros instrumentos,
e identificar tipos de movimentação.
"""
import pandas as pd
import re

src = "/mnt/user-data/uploads/movimentacao-2026-05-04-09-46-03.xlsx"
df = pd.read_excel(src)

print(f"Total de linhas: {len(df)}")
print(f"Colunas: {list(df.columns)}")
print()

# Range de datas
df['Data'] = pd.to_datetime(df['Data'], dayfirst=True, errors='coerce')
print(f"Data mais antiga: {df['Data'].min()}")
print(f"Data mais recente: {df['Data'].max()}")
print()

# Filtra apenas 2025
df_2025 = df[df['Data'].dt.year == 2025].copy()
print(f"Linhas em 2025: {len(df_2025)}")
print()

# Tipos de Movimentação únicos
print("=== TIPOS DE MOVIMENTAÇÃO únicos (em 2025) ===")
mov_counts = df_2025['Movimentação'].value_counts()
for mov, count in mov_counts.items():
    print(f"  {count:>4} × {mov}")

print()
# Extrai ticker (parte antes de " - ")
def extract_ticker(produto):
    if pd.isna(produto):
        return ""
    s = str(produto).strip()
    if " - " in s:
        return s.split(" - ")[0].strip()
    return s.strip()

df_2025['Ticker'] = df_2025['Produto'].apply(extract_ticker)

# Padrão de ticker de ação: 4 letras + 1 ou 2 dígitos
stock_pattern = re.compile(r'^[A-Z]{4}\d{1,2}$')

# Categoriza
df_2025['Categoria'] = df_2025['Ticker'].apply(
    lambda t: "AÇÃO/FII" if stock_pattern.match(t) else (
        "Tesouro" if t.startswith("Tesouro") else (
            "CRI" if t == "CRI" else (
                "DEB" if t == "DEB" else "Outro"
            )
        )
    )
)

print("=== CATEGORIAS dos produtos (em 2025) ===")
print(df_2025['Categoria'].value_counts())
print()

print("=== TICKERS DE AÇÕES/FII únicos (em 2025) ===")
stocks = df_2025[df_2025['Categoria'] == "AÇÃO/FII"]['Ticker'].unique()
print(sorted(stocks))
print(f"Total: {len(stocks)} tickers")
print()

# Para cada ticker de ação, mostra movimentações
print("=== MOVIMENTAÇÕES por ticker (em 2025) ===")
for ticker in sorted(stocks):
    sub = df_2025[df_2025['Ticker'] == ticker]
    print(f"\n--- {ticker} ({len(sub)} movimentações) ---")
    for _, row in sub.sort_values('Data').iterrows():
        es = row['Entrada/Saída']
        d = row['Data'].strftime('%d/%m/%Y')
        m = row['Movimentação']
        q = row['Quantidade']
        p = row['Preço unitário']
        v = row['Valor da Operação']
        print(f"  {d} {es:8} {m:35} qtd={q} pu={p} val={v}")
