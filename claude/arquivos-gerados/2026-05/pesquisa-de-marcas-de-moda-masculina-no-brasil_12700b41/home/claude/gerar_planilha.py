from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = Workbook()

# ============ ABA 1: MARCAS ============
ws = wb.active
ws.title = "Marcas"

headers = [
    "#",
    "Marca",
    "Ano de Fundação",
    "Cidade/Estado",
    "Handle Instagram",
    "Seguidores IG",
    "Segmento/Estilo",
    "Posicionamento",
    "Fit Regional Premium",
    "Confiança (1-10)",
    "Colab/Marco Relevante",
    "Fonte Principal",
    "Observações",
]

# Dados ordenados por seguidores desc
data = [
    [1, "Cariuma", 2018, "Rio de Janeiro / global", "@cariuma", 898000,
     "Sneakers sustentáveis (unissex)", "Marca global com sede no RJ; canvas, bambu, foco eco",
     "Médio", 7, "Pro skaters; presente em Vogue/Forbes",
     "Wikipedia + Instagram", "Mais global que regional; produção em SP. Unissex mas relevante p/ menswear"],

    [2, "DESGOSTO", 2021, "Curitiba/SP", "@desgosto", 199000,
     "Streetwear underground/hype", "Loja de inconveniência; começou como estúdio de tatuagem",
     "Baixo", 7, "Coleções com estética de brinquedos falsificados/cartoon",
     "ELLE Brasil + Instagram", "Posicionamento mais 'edgy' que 'premium tradicional'; pode não caber em Iguatemi POA"],

    [3, "PACE", 2017, "São Paulo", "@pace", 188000,
     "Streetwear / Brazilian Okinawan Design", "Lifestyle completo; calçados, RTW, acessórios, joias",
     "Médio-Alto", 9, "Asics, New Balance, Vans, Red Bull; Dover Street Market; Nubian Tokyo",
     "Site oficial + FFW + Instagram", "Fundador Felipe Matayoshi: Forbes 30 Under 30 (2021), GQ Homem do Ano (2024). Flagship + Café PACE"],

    [4, "Pornograffiti", 2016, "Londrina/PR", "@pornograffiti", 147000,
     "Streetwear satírico/memes", "Marca independente, produção limitada",
     "Baixo", 7, "Estúdio de design eletrônico que virou marca",
     "Steal The Look + Instagram", "Início como estúdio em 2014; entrou em vestuário em 2016. Humor/deboche."],

    [5, "CARNAN", 2018, "Rio de Janeiro", "@carnan", 140000,
     "Streetwear premium", "Sofisticação no streetwear; oversized, tons sóbrios, tecidos premium",
     "Alto", 9, "Copacabana Palace (centenário); Je M'Appelle Brasil; lojas EUA/Oriente Médio",
     "Hypebeast + Hypnotique + Instagram", "Flagship Rua Cônego Eugênio Leite (Pinheiros, SP). Sócios Paulo H. Carneiro e Breno Fernandes"],

    [6, "Welcome Sunny Garments", 2021, "Rio de Janeiro (Copacabana)", "@welcome.rio", 123000,
     "Streetwear + alfaiataria", "Lifestyle Copacabana; elegância casual carioca",
     "Alto", 9, "Olympikus (Corre 4, coleção cápsula corrida)",
     "CNPJ Econodata + Instagram", "Originalmente menswear, hoje unissex. Loja Av. NS de Copacabana 1226"],

    [7, "Mad Enlatados", 2018, "São Paulo", "@mad_enlatados", 104000,
     "Streetwear satírico", "Narrativas satíricas, críticas sociais; funcionalidade",
     "Médio", 8, "Paris Fashion Week (Je M'Appelle Brasil); 20+ PDVs (YourID, Guadalupe)",
     "LinkedIn + Instagram", "Fundador Luiz Paes"],

    [8, "DOD Alfaiataria", 2017, "São Paulo (Pinheiros)", "@dodalfaiataria", 81000,
     "Alfaiataria não tradicional", "Sob medida; mistura tradicional com skate/streetwear",
     "Alto", 8, "Fundador Jubba Sam virou sócio/diretor criativo da Beatnik (2025)",
     "LinkedIn + Esquire + Instagram", "Loja Rua Mateus Grou 540. Fundada por Juarez Tenório (Jubba Sam)"],

    [9, "P. Andrade", 2021, "São Paulo", "@p_____andrade", 75000,
     "Streetwear-luxo sustentável (menswear)", "Streetwear + luxo + sustentabilidade; alfaiataria despretensiosa",
     "Alto", 9, "1ª marca BR no calendário oficial masculino da Paris Fashion Week (jun/2025)",
     "BRIFW + CNN + Site oficial", "Pedro Andrade (fundador da PIET) + Paula Kim (Central Saint Martins). Tingimento por bactérias, couro de cacto"],

    [10, "HIST (How I See Things)", 2021, "São Paulo (Pinheiros)", "@hist_______", 44000,
     "Streetwear + alfaiataria desconstruída (unissex)", "Influência Brooklyn NYC; matérias-primas alternativas",
     "Médio-Alto", 7, "São Paulo Fashion Week N56 (estreante); WGSN 'Brands to Know'",
     "ELLE + SPFW + Instagram", "Fundadora Giuliana Braide (cearense). Loja H550 em Pinheiros. Unissex"],

    [11, "Sardegna Sartoria", 2021, "São Paulo", "@sardegnasartoria", 39000,
     "Resort wear / alfaiataria premium", "Slow fashion; alfaiataria resort; linho belga, algodão italiano/pima peruano",
     "Altíssimo", 9, "Lojas em CJ Shops Jardins e Shopping Cidade Jardim (AAA premium)",
     "Exame Casual + Abest + Instagram", "Fundadores Bia Harley + Lucas Albuquerque. Único da lista que está em mall cluster AAA premium hoje"],

    [12, "Dengo Club", 2020, "São Paulo (Vila Madalena)", "@dengo.club", 18000,
     "Streetwear lúdico/cartoon", "Identidade cartoon, traços marcantes, estética underground/lúdica/nostálgica",
     "Baixo-Médio", 6, "Sem colab high-profile relevante documentada",
     "Steal The Look + Instagram", "Boundary do critério de 15k. Posicionamento mais nicho que mall premium"],
]

# Cabeçalho
header_font = Font(name="Arial", bold=True, size=11, color="FFFFFF")
header_fill = PatternFill("solid", start_color="1F3864")
header_align = Alignment(horizontal="center", vertical="center", wrap_text=True)
thin_border = Border(
    left=Side(style="thin", color="BFBFBF"),
    right=Side(style="thin", color="BFBFBF"),
    top=Side(style="thin", color="BFBFBF"),
    bottom=Side(style="thin", color="BFBFBF"),
)

for col_idx, header in enumerate(headers, start=1):
    cell = ws.cell(row=1, column=col_idx, value=header)
    cell.font = header_font
    cell.fill = header_fill
    cell.alignment = header_align
    cell.border = thin_border

# Dados
data_font = Font(name="Arial", size=10)
data_align_wrap = Alignment(vertical="top", wrap_text=True)
data_align_center = Alignment(horizontal="center", vertical="top", wrap_text=True)

# Cores p/ Fit
fit_colors = {
    "Altíssimo": "C6EFCE",  # verde claro
    "Alto": "DDEBF7",        # azul claro
    "Médio-Alto": "FFF2CC",  # amarelo muito claro
    "Médio": "FCE4D6",       # laranja claro
    "Baixo-Médio": "F4CCCC", # vermelho claro
    "Baixo": "F4CCCC",
}

for row_idx, row_data in enumerate(data, start=2):
    for col_idx, value in enumerate(row_data, start=1):
        cell = ws.cell(row=row_idx, column=col_idx, value=value)
        cell.font = data_font
        cell.border = thin_border
        if col_idx in (1, 3, 6, 10):  # colunas numéricas/curtas
            cell.alignment = data_align_center
        else:
            cell.alignment = data_align_wrap

    # Pintar coluna Fit
    fit_cell = ws.cell(row=row_idx, column=9)
    fit_value = row_data[8]
    if fit_value in fit_colors:
        fit_cell.fill = PatternFill("solid", start_color=fit_colors[fit_value])

# Formatação numérica para seguidores
for row in range(2, len(data) + 2):
    ws.cell(row=row, column=6).number_format = "#,##0"

# Larguras de coluna
widths = {
    1: 5,    # #
    2: 22,   # Marca
    3: 10,   # Ano
    4: 22,   # Cidade
    5: 22,   # Handle
    6: 13,   # Seguidores
    7: 30,   # Segmento
    8: 38,   # Posicionamento
    9: 16,   # Fit
    10: 12,  # Confiança
    11: 38,  # Colab
    12: 30,  # Fonte
    13: 50,  # Observações
}
for col, w in widths.items():
    ws.column_dimensions[get_column_letter(col)].width = w

ws.row_dimensions[1].height = 35

# Altura mínima das linhas de dados
for row in range(2, len(data) + 2):
    ws.row_dimensions[row].height = 75

# Freeze panes
ws.freeze_panes = "C2"

# Filtros
ws.auto_filter.ref = f"A1:{get_column_letter(len(headers))}{len(data) + 1}"

# ============ ABA 2: CRITÉRIOS USADOS ============
ws2 = wb.create_sheet("Critérios da Busca")

criterios = [
    ["Variável", "Valor usado", "Variável original (template)"],
    ["SEGMENTO", "Moda masculina", "(exemplo do template: sports, beleza, F&B, etc.)"],
    ["GEOGRAFIA", "Brasil (todas as regiões)", "Brasil — eixo SP-RJ / Sul / Nordeste / capital específica"],
    ["MIN_SEGUIDORES", "15.000 (afrouxado de 50k)", "5k / 15k / 50k / 100k"],
    ["ANO_MINIMO", "2016 (afrouxado de 2018)", "2018 / 2020 / 2022"],
    ["QUANTIDADE", "20 (entreguei 12 com confiança)", "10 / 20 / 30"],
    ["CLUSTER_SHOPPING", "Regional premium (Iguatemi POA/Brasília)", "AAA premium / AB / Regional premium"],
    ["", "", ""],
    ["Nota:", "", ""],
    ["A interseção dos critérios — menswear + pós-2016 + 15k+ seguidores + posicionamento Regional premium — é estreita no Brasil.", "", ""],
    ["Após duas rodadas de afrouxamento (seguidores: 50k → 15k; ano: 2018 → 2016), entreguei 12 marcas verificadas.", "", ""],
    ["Marcas não incluídas porque ficaram abaixo do corte de 15k: Erreh (9,7k), Aries Linen (12k).", "", ""],
    ["Marcas que existem e fitariam, mas não confirmei follower count com fonte primária dentro do tempo: Suí, Owlshit, QUEM, Misturada, Reptilia.", "", ""],
]

for row_idx, row_data in enumerate(criterios, start=1):
    for col_idx, value in enumerate(row_data, start=1):
        cell = ws2.cell(row=row_idx, column=col_idx, value=value)
        if row_idx == 1:
            cell.font = Font(name="Arial", bold=True, size=11, color="FFFFFF")
            cell.fill = header_fill
            cell.alignment = header_align
            cell.border = thin_border
        else:
            cell.font = Font(name="Arial", size=10)
            cell.alignment = Alignment(vertical="top", wrap_text=True)
            if row_idx <= 7:
                cell.border = thin_border

ws2.column_dimensions["A"].width = 22
ws2.column_dimensions["B"].width = 45
ws2.column_dimensions["C"].width = 50
for row in range(1, len(criterios) + 1):
    ws2.row_dimensions[row].height = 22

# ============ ABA 3: METODOLOGIA ============
ws3 = wb.create_sheet("Metodologia & Confiança")

metodologia = [
    ["Tópico", "Detalhe"],
    ["Como verifiquei cada marca",
     "1) Confirmação do ano de fundação via site oficial, LinkedIn, ou imprensa especializada (FFW, ELLE, Steal The Look, Hypebeast). 2) Follower count via acesso direto ao perfil do Instagram (resultado de busca). 3) Posicionamento via descrição da marca + onde está vendida (lojas próprias, multimarcas premium, shoppings)."],
    ["Escala de confiança",
     "10 = info redundante em 3+ fontes incl. fonte primária. 7-9 = info em 2 fontes confiáveis. 5-6 = info em 1 fonte ou com conflito menor. <5 = não usei."],
    ["Por que apenas 12 marcas",
     "O recorte 'menswear brasileiro pós-2016 com 15k+ seguidores e posicionamento Regional premium' é estreito. O segmento foi dominado por marcas antigas (Reserva 2004, Aramis 2003, Foxton anos 90, PIET 2012). O ciclo 2016-2022 foi mais ativo em moda feminina/unissex que menswear estrito."],
    ["Limitações", 
     "Não fiz busca exaustiva em: marcas regionais do Sul/Nordeste, surfwear/sportswear premium, eyewear/joalheria masculina, marcas que comunicam mais no TikTok que no IG. Os números de seguidores foram capturados em 22-23/maio/2026 via busca."],
    ["Onde os critérios mais 'apertam'",
     "Cluster Regional premium (Iguatemi POA/Brasília) é o mais difícil de validar à distância. Marcas como CARNAN, P. Andrade, Sardegna Sartoria estão claramente nesse tier; outras como DESGOSTO e Mad Enlatados têm posicionamento mais underground/popular."],
    ["Para chegar nas 20 marcas",
     "Caminhos: (a) soltar p/ unissex com linha masculina; (b) incluir DNVB adjacente (eyewear, sneakers regionais, beachwear masc.); (c) aceitar marcas regionais com 5k-15k seguidores; (d) incluir marcas antigas que se reposicionaram pós-2016."],
]

for row_idx, row_data in enumerate(metodologia, start=1):
    for col_idx, value in enumerate(row_data, start=1):
        cell = ws3.cell(row=row_idx, column=col_idx, value=value)
        if row_idx == 1:
            cell.font = Font(name="Arial", bold=True, size=11, color="FFFFFF")
            cell.fill = header_fill
            cell.alignment = header_align
            cell.border = thin_border
        else:
            cell.font = Font(name="Arial", size=10)
            cell.alignment = Alignment(vertical="top", wrap_text=True)
            cell.border = thin_border
            if col_idx == 1:
                cell.font = Font(name="Arial", size=10, bold=True)

ws3.column_dimensions["A"].width = 28
ws3.column_dimensions["B"].width = 90
ws3.row_dimensions[1].height = 22
for row in range(2, len(metodologia) + 1):
    ws3.row_dimensions[row].height = 75

wb.save("/mnt/user-data/outputs/marcas_moda_masculina_brasil.xlsx")
print("Planilha gerada.")
