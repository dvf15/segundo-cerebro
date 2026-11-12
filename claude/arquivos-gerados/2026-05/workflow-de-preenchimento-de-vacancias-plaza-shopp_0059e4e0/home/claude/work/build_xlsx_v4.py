from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

wb = Workbook()

FONT_TITLE = Font(name="Arial", bold=True, color="FFFFFF", size=12)
FONT_HDR = Font(name="Arial", bold=True, color="FFFFFF", size=10)
FONT_BODY = Font(name="Arial", size=10)
FONT_BODY_B = Font(name="Arial", size=10, bold=True)
FONT_NOTE = Font(name="Arial", size=9, italic=True, color="555555")

FILL_TITLE = PatternFill("solid", start_color="1F4E78")
FILL_HDR = PatternFill("solid", start_color="2E75B6")
FILL_ALT = PatternFill("solid", start_color="F2F2F2")
FILL_NV = PatternFill("solid", start_color="FFF2CC")
FILL_GREEN = PatternFill("solid", start_color="C6EFCE")
FILL_RED = PatternFill("solid", start_color="F8CBAD")
FILL_BLUE = PatternFill("solid", start_color="D9E1F2")
FILL_PURPLE = PatternFill("solid", start_color="E4DFEC")

thin = Side(border_style="thin", color="BFBFBF")
BORDER = Border(left=thin, right=thin, top=thin, bottom=thin)
ALIGN_L = Alignment(horizontal="left", vertical="center", wrap_text=True)
ALIGN_C = Alignment(horizontal="center", vertical="center", wrap_text=True)


def write_header(ws, row, headers, fill=FILL_HDR):
    for col, h in enumerate(headers, 1):
        c = ws.cell(row=row, column=col, value=h)
        c.font = FONT_HDR
        c.fill = fill
        c.alignment = ALIGN_C
        c.border = BORDER


def write_title(ws, text, ncols=12):
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=ncols)
    c = ws.cell(row=1, column=1, value=text)
    c.font = FONT_TITLE
    c.fill = FILL_TITLE
    c.alignment = ALIGN_L
    ws.row_dimensions[1].height = 24


# ========================================================
# Sheet 1 - RESUMO
# ========================================================
ws = wb.active
ws.title = "Resumo"
write_title(ws, "WORKFLOW 1 v4 — Vacancy-to-Contract | Plaza Niterói | Filtro Duplicidade Aplicado")

info = [
    ("Cluster", "Entretenimento (Cinemark mantido)"),
    ("Cidade", "Niterói/RJ — Rua XV de Novembro, 8, Centro"),
    ("ABL total (Allos)", "43.000 m² | 300+ lojas | Inaugurado 1986"),
    ("Vacância tratada", "~6.028 m² em 38 saídas + redev. foyer Cinemark 5.097 m²"),
    ("Filtro Duplicidade", "288 marcas mapeadas (brasil-shoppings + allos + plazaniteroi + decathlon)"),
    ("Raio Street Converter", "Niterói (0-10km) + Tijuca (15-20km) + Zona Sul Rio (18-25km via Ponte)"),
    ("Batalhas prioritárias", "1) Entretenimento adulto  2) Gastronomia autoral (NÃO cadeia)  3) Lojas conceito"),
    ("API paga acionada", "Nenhuma. Apenas fontes públicas."),
    ("Confiança da análise", "8/10 — duplicidade verificada vs lista 288 marcas"),
]

for i, (k, v) in enumerate(info, start=3):
    ws.cell(row=i, column=1, value=k).font = FONT_BODY_B
    ws.cell(row=i, column=2, value=v).font = FONT_BODY

ws["A14"] = "PRINCIPAIS CORREÇÕES DESTA VERSÃO"
ws["A14"].font = FONT_BODY_B
correcoes = [
    "❌ Outback, Coco Bambu, Madero, Abbraccio, Benihana, L'Entrecôte (todas no shopping)",
    "❌ Renner, Riachuelo, C&A, Marisa, Calvin Klein, Lacoste, GAP, Levi's, Reserva (todas no shopping)",
    "❌ Decathlon, Nike, Centauro, Trackfield, World Tennis, Authentic Feet (esporte saturado)",
    "❌ LEGO, Ri Happy, Bay Games, World Games, Resident Games (lazer infantil saturado)",
    "❌ Cherry Park, Hot Zone, Eletroplay, Karaokê (lazer infantil saturado)",
    "❌ Hocus Pocus (quiosque existe; pode ampliar mas não duplicar quiosque)",
    "❌ Carter's, Puket, Lilica Tigor, Tip Top, Milon (infantil saturado)",
    "✅ Foco redirecionado: entretenimento ADULTO (boliche/VR/escape) + gastronomia AUTORAL + cafés NICHO",
]
for i, txt in enumerate(correcoes, start=15):
    ws.cell(row=i, column=1, value=txt).font = FONT_BODY

ws["A24"] = "ESTRUTURA DA PLANILHA"
ws["A24"].font = FONT_BODY_B
abas = [
    "1. Resumo",
    "2. Mix Atual (288 marcas) — universo de DUPLICIDADE",
    "3. Saídas Ano 1 com status corrigido",
    "4. Gaps Reais — categorias com gap após filtro",
    "5. Foyer Redev v4 — conceitos verificados sem duplicar",
    "6. Street Converter Niterói",
    "7. Street Converter Tijuca",
    "8. Street Converter Zona Sul Rio",
    "9. Marcas Expansão Rio 2026 (H&M, ALO, NV)",
    "10. Deal Conversion Table v4",
    "11. Plano 30/60/90",
    "12. KPIs",
    "13. Riscos",
    "14. Fontes",
]
for i, txt in enumerate(abas, start=25):
    ws.cell(row=i, column=1, value=txt).font = FONT_BODY

ws.column_dimensions["A"].width = 32
ws.column_dimensions["B"].width = 95


# ========================================================
# Sheet 2 - MIX ATUAL (288 marcas verificadas)
# ========================================================
ws = wb.create_sheet("Mix Atual 288 marcas")
write_title(ws, "MIX ATUAL — 288 marcas verificadas (brasil-shoppings.com.br + allos + plazaniteroi)")

ws["A3"] = "REGRA: NÃO sugerir nada que esteja nesta aba. Verificar antes de qualquer pipeline."
ws["A3"].font = FONT_BODY_B
ws["A3"].fill = FILL_RED
ws.merge_cells("A3:F3")

headers = ["Categoria", "Marca", "Fonte verificação", "Obs"]
write_header(ws, 5, headers)

mix = [
    # Cinema
    ("Cinema", "Cinemark", "plazaniteroi + Ingresso.com", "Anchor mantida — foyer 5.097m² em redev"),

    # Espaço Gourmet (4º piso)
    ("Gastronomia Premium", "Coco Bambu", "plazaniteroi.com.br/sobre-o-shopping", "Espaço Gourmet 2.200m², 500 lugares (2014)"),
    ("Gastronomia Premium", "Outback Steakhouse", "plazaniteroi + brasil-shoppings", "Espaço Gourmet"),
    ("Gastronomia Premium", "Madero", "plazaniteroi", "Espaço Gourmet"),
    ("Gastronomia Premium", "Abbraccio", "plazaniteroi", "Espaço Gourmet"),
    ("Gastronomia Premium", "NOI", "plazaniteroi + brasil-shoppings", "Espaço Gourmet"),
    ("Gastronomia Premium", "Cabana Burger", "plazaniteroi", "Espaço Gourmet"),
    ("Gastronomia Premium", "Balada Mix", "plazaniteroi + brasil-shoppings", "Espaço Gourmet"),
    ("Gastronomia Premium", "Tutto Nhoque", "plazaniteroi", "Espaço Gourmet"),
    ("Gastronomia Premium", "Amélie + Juliette", "plazaniteroi", "Espaço Gourmet"),
    ("Gastronomia Premium", "Jappa da Quitanda", "plazaniteroi", "Espaço Gourmet"),
    ("Gastronomia Premium", "L'Entrecôte de Paris", "brasil-shoppings", "Steakhouse francês"),
    ("Gastronomia Premium", "Benihana", "brasil-shoppings", "Japonês"),
    ("Gastronomia Premium", "Billy The Grill", "brasil-shoppings", ""),
    ("Gastronomia Premium", "Galli Grill", "brasil-shoppings", ""),
    ("Gastronomia Premium", "Bond Chop", "brasil-shoppings", ""),
    ("Gastronomia Premium", "La Mole", "brasil-shoppings", ""),
    ("Gastronomia Premium", "Gula Gula", "brasil-shoppings", ""),
    ("Gastronomia Premium", "Mondo Vino", "brasil-shoppings", "Vinho"),

    # Fast Food / Casual
    ("Fast Food", "Burger King", "brasil-shoppings", ""),
    ("Fast Food", "Domino's Pizza", "brasil-shoppings", ""),
    ("Fast Food", "Spoleto", "brasil-shoppings", ""),
    ("Fast Food", "Koni", "brasil-shoppings", ""),
    ("Fast Food", "Gendai", "brasil-shoppings", ""),
    ("Fast Food", "Vivenda do Camarão", "brasil-shoppings", ""),
    ("Fast Food", "Giraffa's", "brasil-shoppings", ""),
    ("Fast Food", "Mister Pizza", "brasil-shoppings", ""),
    ("Fast Food", "Casa do Pão de Queijo", "brasil-shoppings", ""),
    ("Fast Food", "Compão", "brasil-shoppings", ""),
    ("Fast Food", "Waffle Store", "brasil-shoppings", ""),
    ("Fast Food", "Bendito Churros", "brasil-shoppings", ""),
    ("Fast Food", "Los Paleteros", "brasil-shoppings", ""),
    ("Fast Food", "Batata Inglesa", "brasil-shoppings", "Lista de saídas - confirmar status"),
    ("Fast Food", "Café Vienna", "brasil-shoppings", "Lista de saídas - confirmar"),

    # Cafés
    ("Café/Doceria", "Starbucks", "brasil-shoppings", ""),
    ("Café/Doceria", "Mr. Cheney", "brasil-shoppings", ""),
    ("Café/Doceria", "Kopenhagen", "brasil-shoppings", ""),
    ("Café/Doceria", "Havanna", "brasil-shoppings", ""),
    ("Café/Doceria", "Mahogany", "brasil-shoppings", ""),

    # Moda Feminina
    ("Moda Feminina", "Renner", "brasil-shoppings", ""),
    ("Moda Feminina", "Riachuelo", "brasil-shoppings", ""),
    ("Moda Feminina", "C&A", "brasil-shoppings", ""),
    ("Moda Feminina", "Marisa", "brasil-shoppings", ""),
    ("Moda Feminina", "Forever 21", "brasil-shoppings", ""),
    ("Moda Feminina", "Cantão", "brasil-shoppings", ""),
    ("Moda Feminina", "Maria Filó", "brasil-shoppings", ""),
    ("Moda Feminina", "Animale", "brasil-shoppings", ""),
    ("Moda Feminina", "Le Lis Blanc", "brasil-shoppings", ""),
    ("Moda Feminina", "Dress To", "brasil-shoppings", ""),
    ("Moda Feminina", "Mercatto", "brasil-shoppings", ""),
    ("Moda Feminina", "Cynthia Pamplona", "brasil-shoppings", ""),
    ("Moda Feminina", "Sacada", "brasil-shoppings", ""),
    ("Moda Feminina", "Salienta", "brasil-shoppings", ""),
    ("Moda Feminina", "Limits", "brasil-shoppings", ""),
    ("Moda Feminina", "Madame MS", "brasil-shoppings", ""),
    ("Moda Feminina", "Beluga", "brasil-shoppings", ""),
    ("Moda Feminina", "Botswana", "brasil-shoppings", ""),
    ("Moda Feminina", "Mahaman", "brasil-shoppings", ""),
    ("Moda Feminina", "My Place", "brasil-shoppings", ""),
    ("Moda Feminina", "Chifon", "brasil-shoppings", ""),
    ("Moda Feminina", "Casablanca", "brasil-shoppings", ""),
    ("Moda Feminina", "Pe'ahi", "brasil-shoppings", ""),
    ("Moda Feminina", "Toulon", "brasil-shoppings", ""),
    ("Moda Feminina", "Via Torino", "brasil-shoppings", ""),
    ("Moda Feminina", "Hangway", "brasil-shoppings", ""),
    ("Moda Feminina", "Aghata", "brasil-shoppings", ""),
    ("Moda Feminina", "Mazzini", "brasil-shoppings", ""),
    ("Moda Feminina", "Ferni", "brasil-shoppings", ""),
    ("Moda Feminina", "Lulean", "brasil-shoppings", ""),

    # Moda Masculina
    ("Moda Masculina", "Calvin Klein", "brasil-shoppings", ""),
    ("Moda Masculina", "Lacoste", "brasil-shoppings", ""),
    ("Moda Masculina", "Levi's", "brasil-shoppings", ""),
    ("Moda Masculina", "GAP", "brasil-shoppings", ""),
    ("Moda Masculina", "Brooksfield", "brasil-shoppings", ""),
    ("Moda Masculina", "Reserva", "brasil-shoppings", ""),
    ("Moda Masculina", "Richard's", "brasil-shoppings", ""),
    ("Moda Masculina", "Wollner", "brasil-shoppings", ""),
    ("Moda Masculina", "Dudalina", "brasil-shoppings", ""),
    ("Moda Masculina", "Osklen", "brasil-shoppings", ""),
    ("Moda Masculina", "John John", "brasil-shoppings", ""),
    ("Moda Masculina", "Camisaria Colombo", "brasil-shoppings", ""),
    ("Moda Masculina", "Cia do Terno", "brasil-shoppings", ""),
    ("Moda Masculina", "Les Chemises", "brasil-shoppings", ""),
    ("Moda Masculina", "Oh, Boy!", "brasil-shoppings", ""),
    ("Moda Masculina", "Redley", "brasil-shoppings", ""),
    ("Moda Masculina", "South", "brasil-shoppings", ""),
    ("Moda Masculina", "South Side", "brasil-shoppings", ""),
    ("Moda Masculina", "Cyclone", "brasil-shoppings", ""),
    ("Moda Masculina", "Cyclone Youth", "brasil-shoppings", ""),
    ("Moda Masculina", "Drill", "brasil-shoppings", ""),
    ("Moda Masculina", "Fuel", "brasil-shoppings", ""),
    ("Moda Masculina", "Carter's", "skyscrapercity (anúncio)", "Validar abertura"),
    ("Moda Masculina", "Taco", "brasil-shoppings", ""),
    ("Moda Masculina", "Hering Store", "brasil-shoppings", ""),
    ("Moda Masculina", "Mahogany (Masculina)", "brasil-shoppings", ""),
    ("Moda Masculina", "Dank", "brasil-shoppings", ""),
    ("Moda Masculina", "Aviator", "brasil-shoppings", ""),
    ("Moda Masculina", "Enjoy", "brasil-shoppings", ""),

    # Moda Lingerie
    ("Lingerie", "Intimissimi", "brasil-shoppings", ""),
    ("Lingerie", "Loungerie", "brasil-shoppings", ""),
    ("Lingerie", "Hope", "brasil-shoppings", ""),
    ("Lingerie", "Liga Retro", "brasil-shoppings", ""),
    ("Lingerie", "Lupo", "brasil-shoppings", ""),
    ("Lingerie", "Só Socks", "brasil-shoppings", ""),

    # Moda Praia
    ("Moda Praia", "UV Line", "brasil-shoppings", ""),
    ("Moda Praia", "Board Session", "brasil-shoppings", ""),
    ("Moda Praia", "WQ Surf", "brasil-shoppings", ""),

    # Moda Infantil
    ("Moda Infantil", "Lilica e Tigor", "brasil-shoppings", ""),
    ("Moda Infantil", "Milon", "brasil-shoppings", ""),
    ("Moda Infantil", "Alphabeto", "brasil-shoppings", ""),
    ("Moda Infantil", "Tip Top", "brasil-shoppings", ""),
    ("Moda Infantil", "Malwee Brasileirinhos", "brasil-shoppings", ""),
    ("Moda Infantil", "Mini Einstein", "brasil-shoppings", ""),
    ("Moda Infantil", "Antonella", "brasil-shoppings", ""),

    # Calçados
    ("Calçados", "Arezzo", "brasil-shoppings", ""),
    ("Calçados", "Schutz/Outer Shoes", "brasil-shoppings", ""),
    ("Calçados", "Santa Lolla", "brasil-shoppings", ""),
    ("Calçados", "Carmen Steffens", "brasil-shoppings", ""),
    ("Calçados", "Dumond", "brasil-shoppings", ""),
    ("Calçados", "Di Santinni", "brasil-shoppings", ""),
    ("Calçados", "Mr Cat", "brasil-shoppings", ""),
    ("Calçados", "Crocs", "brasil-shoppings", ""),
    ("Calçados", "Melissa", "brasil-shoppings", ""),
    ("Calçados", "Bibi", "brasil-shoppings", ""),
    ("Calçados", "Bagaggio", "brasil-shoppings", ""),
    ("Calçados", "Jorge Bischoff", "brasil-shoppings", ""),
    ("Calçados", "Magic Feet", "brasil-shoppings", ""),
    ("Calçados", "Fun Shoes", "brasil-shoppings", ""),
    ("Calçados", "Soulier", "brasil-shoppings", ""),
    ("Calçados", "Cassia Calçados", "brasil-shoppings", ""),
    ("Calçados", "Sonho dos Pés", "brasil-shoppings", ""),
    ("Calçados", "Pontapé", "brasil-shoppings", ""),
    ("Calçados", "Couro & Cia", "brasil-shoppings", ""),
    ("Calçados", "Mala Amada", "brasil-shoppings", ""),
    ("Calçados", "Le Postiche", "brasil-shoppings", ""),
    ("Calçados", "Zappato", "brasil-shoppings", ""),
    ("Calçados", "Sapatella", "brasil-shoppings", ""),
    ("Calçados", "Tubbo", "brasil-shoppings", ""),
    ("Calçados", "Luidgi", "brasil-shoppings", ""),
    ("Calçados", "Kayland", "brasil-shoppings", ""),
    ("Calçados", "Via Mia", "brasil-shoppings", ""),
    ("Calçados", "Loft Design", "brasil-shoppings", ""),
    ("Calçados", "Havaianas", "brasil-shoppings", "Lista de saídas - validar"),

    # Esportes (saturação completa)
    ("Esporte", "Nike Store", "brasil-shoppings", ""),
    ("Esporte", "Centauro", "brasil-shoppings", ""),
    ("Esporte", "Decathlon", "decathlon.com.br/lojas + brasil-shoppings", "Confirmação direta"),
    ("Esporte", "Trackfield", "brasil-shoppings", ""),
    ("Esporte", "World Tennis", "brasil-shoppings", ""),
    ("Esporte", "Authentic Feet", "brasil-shoppings", ""),
    ("Esporte", "Atlhetic Way", "brasil-shoppings", ""),
    ("Esporte", "Times e Torcidas", "brasil-shoppings", ""),
    ("Esporte", "Espaço Rubro Negro", "brasil-shoppings", "Flamengo"),

    # Beleza/Cosméticos
    ("Beleza", "Sephora", "brasil-shoppings", ""),
    ("Beleza", "MAC", "brasil-shoppings", ""),
    ("Beleza", "L'Occitane", "brasil-shoppings", ""),
    ("Beleza", "L'Occitane au Brésil", "brasil-shoppings", ""),
    ("Beleza", "Granado", "brasil-shoppings", ""),
    ("Beleza", "Granado Pink", "brasil-shoppings", ""),
    ("Beleza", "Dermage", "brasil-shoppings", ""),
    ("Beleza", "Contém 1G", "brasil-shoppings", ""),
    ("Beleza", "O Boticário", "brasil-shoppings", ""),
    ("Beleza", "Quem Disse, Berenice?", "brasil-shoppings", ""),
    ("Beleza", "The Beauty Box", "brasil-shoppings", ""),
    ("Beleza", "Maybelline NY", "brasil-shoppings", ""),
    ("Beleza", "Yes Cosmetics", "brasil-shoppings", ""),
    ("Beleza", "Skin Planet", "brasil-shoppings", ""),
    ("Beleza", "Premier Cosméticos", "brasil-shoppings", ""),
    ("Beleza", "My Gloss", "brasil-shoppings", ""),
    ("Beleza", "I Dream", "brasil-shoppings", ""),

    # Salões/Beleza
    ("Salão/Beleza", "Jacques Janine", "brasil-shoppings", ""),
    ("Salão/Beleza", "Walter Coiffeur", "brasil-shoppings", "Lista de saídas - confirmar"),
    ("Salão/Beleza", "Unhas Express", "brasil-shoppings", ""),
    ("Salão/Beleza", "Depyl", "brasil-shoppings", ""),
    ("Salão/Beleza", "Spé O Spa do Pé", "brasil-shoppings", ""),
    ("Salão/Beleza", "Cadeira de Massagem", "brasil-shoppings", ""),
    ("Salão/Beleza", "Corpo e Alma", "brasil-shoppings", ""),

    # Joias / Acessórios
    ("Joia/Acessório", "Vivara", "brasil-shoppings", ""),
    ("Joia/Acessório", "Pandora", "brasil-shoppings", ""),
    ("Joia/Acessório", "Swarovski", "brasil-shoppings", ""),
    ("Joia/Acessório", "H. Stern", "brasil-shoppings", ""),
    ("Joia/Acessório", "Rommanel", "brasil-shoppings", ""),
    ("Joia/Acessório", "Monte Carlo Joias", "brasil-shoppings", ""),
    ("Joia/Acessório", "Lior Jóias", "brasil-shoppings", ""),
    ("Joia/Acessório", "CL Jóias", "brasil-shoppings", ""),
    ("Joia/Acessório", "Elister Jóias", "brasil-shoppings", ""),
    ("Joia/Acessório", "Prata e Prata", "brasil-shoppings", ""),
    ("Joia/Acessório", "Morana", "brasil-shoppings", ""),
    ("Joia/Acessório", "Aldeia dos Ventos", "brasil-shoppings", ""),
    ("Joia/Acessório", "Jopar", "brasil-shoppings", ""),
    ("Joia/Acessório", "Chilli Beans", "brasil-shoppings", ""),
    ("Joia/Acessório", "Sunglass Hut", "brasil-shoppings", ""),
    ("Joia/Acessório", "Pe'ahi", "brasil-shoppings", ""),

    # Óticas
    ("Ótica", "Otica Raysol", "brasil-shoppings", ""),
    ("Ótica", "Oticas Carol", "brasil-shoppings", ""),
    ("Ótica", "Maxvision", "brasil-shoppings", "Lista de saídas - confirmar"),
    ("Ótica", "Hospital dos Olhos", "brasil-shoppings", ""),
    ("Ótica", "Fast Frame", "brasil-shoppings", ""),

    # Casa
    ("Casa", "Tok & Stok", "brasil-shoppings", ""),
    ("Casa", "Camicado", "brasil-shoppings", ""),
    ("Casa", "Oppa", "brasil-shoppings", ""),
    ("Casa", "MMartan", "brasil-shoppings", "Lista de saídas - confirmar"),
    ("Casa", "First Class", "brasil-shoppings", "Lista de saídas - confirmar"),
    ("Casa", "Zelo", "brasil-shoppings", ""),
    ("Casa", "Imaginarium", "brasil-shoppings", ""),
    ("Casa", "Fom Almofadas", "brasil-shoppings", ""),
    ("Casa", "Empório do Aço", "brasil-shoppings", ""),
    ("Casa", "Rei dos Quadros", "brasil-shoppings", ""),
    ("Casa", "Filtros Everest", "brasil-shoppings", ""),
    ("Casa", "Mirage", "brasil-shoppings", ""),
    ("Casa", "Studio do Sono", "brasil-shoppings", ""),
    ("Casa", "Colchões Ortobom", "brasil-shoppings", ""),
    ("Casa", "Serta Colchões", "brasil-shoppings", ""),
    ("Casa", "Fundição Filomena", "brasil-shoppings", ""),
    ("Casa", "Art Vert", "brasil-shoppings", ""),
    ("Casa", "Casa & Vídeo", "brasil-shoppings", ""),

    # Eletro / Tech
    ("Eletro/Tech", "Casas Bahia", "brasil-shoppings", ""),
    ("Eletro/Tech", "Ponto Frio", "brasil-shoppings", ""),
    ("Eletro/Tech", "Fast Shop", "brasil-shoppings", ""),
    ("Eletro/Tech", "Polishop", "brasil-shoppings", ""),
    ("Eletro/Tech", "Lojas Americanas", "brasil-shoppings", "Lista de saídas - validar"),
    ("Eletro/Tech", "iPlace", "plazaniteroi/lojas/iplace", "Apple Reseller"),
    ("Eletro/Tech", "i Solution", "brasil-shoppings", "Apple"),
    ("Eletro/Tech", "Samsung", "brasil-shoppings", ""),
    ("Eletro/Tech", "Microsoft", "brasil-shoppings", ""),
    ("Eletro/Tech", "Sony", "brasil-shoppings", ""),
    ("Eletro/Tech", "Motorola", "brasil-shoppings", ""),
    ("Eletro/Tech", "Nokia", "brasil-shoppings", ""),
    ("Eletro/Tech", "Cotrim Celular", "brasil-shoppings", ""),
    ("Eletro/Tech", "CommCenter", "brasil-shoppings", ""),
    ("Eletro/Tech", "Internet em Foco", "brasil-shoppings", ""),
    ("Eletro/Tech", "Conserte", "brasil-shoppings", "Conserto celular"),
    ("Eletro/Tech", "Jamf", "brasil-shoppings", ""),

    # Telefonia
    ("Telefonia", "Vivo", "brasil-shoppings", "Lista de saídas - validar"),
    ("Telefonia", "TIM", "brasil-shoppings", ""),
    ("Telefonia", "Claro", "brasil-shoppings", ""),
    ("Telefonia", "Oi", "brasil-shoppings", ""),
    ("Telefonia", "Nextel", "brasil-shoppings", ""),
    ("Telefonia", "Telmix Vivo", "brasil-shoppings", ""),
    ("Telefonia", "Ponto Certo Claro", "brasil-shoppings", ""),

    # Brinquedos / Lazer / Games
    ("Lazer/Games", "LEGO", "brasil-shoppings", "Loja temática infantil"),
    ("Lazer/Games", "Ri Happy", "brasil-shoppings", ""),
    ("Lazer/Games", "Bay Games", "brasil-shoppings", ""),
    ("Lazer/Games", "World Games", "brasil-shoppings", "Lista de saídas - validar"),
    ("Lazer/Games", "Resident Games", "brasil-shoppings", ""),
    ("Lazer/Games", "Tempo de Recreio", "brasil-shoppings", ""),
    ("Lazer/Games", "Toy Place", "brasil-shoppings", ""),
    ("Lazer/Games", "Tropical Music", "brasil-shoppings", ""),
    ("Lazer/Games", "Guitar Sound", "brasil-shoppings", ""),
    ("Lazer/Games", "Piticas", "brasil-shoppings", ""),
    ("Lazer/Games", "Casa & Vídeo", "brasil-shoppings", ""),
    ("Lazer/Games", "Saraiva Mega Store", "brasil-shoppings", ""),
    ("Lazer/Games", "Saraiva", "brasil-shoppings", ""),
    ("Lazer/Games", "Plaza Play (infantil grátis)", "Jornal DR1 + plazaniteroi", "Espaço gratuito Piso 2"),
    ("Lazer/Games", "XDome Game Experience", "Cidade de Niterói + Allos", "Projeto Allos + Siga.ag"),
    ("Lazer/Games", "Bolinha Parque", "Jornal DR1", ""),
    ("Lazer/Games", "Youplay Clube", "Jornal DR1", ""),
    ("Lazer/Games", "Ilha da Aventura", "Jornal DR1", ""),

    # Pet
    ("Pet", "Zee.Dog", "brasil-shoppings", "Acessórios pet"),
    ("Pet", "Animal Tour", "brasil-shoppings", ""),

    # Cigar/Vinho
    ("Tabacaria/Vinho", "Candice Cigar", "brasil-shoppings", ""),
    ("Tabacaria/Vinho", "Mondo Vino", "brasil-shoppings", ""),

    # Saúde/Farmácia
    ("Saúde/Farmácia", "DrogaRaia", "brasil-shoppings", ""),
    ("Saúde/Farmácia", "Drogasmil", "brasil-shoppings", ""),
    ("Saúde/Farmácia", "Hospital dos Olhos", "brasil-shoppings", ""),

    # Bolsas/Couro
    ("Bolsas/Couro", "Victor Hugo", "brasil-shoppings", ""),
    ("Bolsas/Couro", "Le Postiche", "brasil-shoppings", ""),
    ("Bolsas/Couro", "Bagaggio", "brasil-shoppings", ""),

    # Serviços / Financeiro
    ("Serviços", "HSBC", "brasil-shoppings", ""),
    ("Serviços", "Mônaco Loterias", "brasil-shoppings", ""),
    ("Serviços", "Renova Câmbio", "brasil-shoppings", ""),
    ("Serviços", "Via Fácil", "brasil-shoppings", ""),
    ("Serviços", "CVC Viagens", "brasil-shoppings", ""),
    ("Serviços", "Flytour", "brasil-shoppings", ""),
    ("Serviços", "Cotação", "brasil-shoppings", ""),
    ("Serviços", "Auto Shopping", "brasil-shoppings", ""),
    ("Serviços", "Natsu Mitsubishi", "brasil-shoppings", ""),
    ("Serviços", "Wizard", "brasil-shoppings", "Idiomas"),
    ("Serviços", "Arranjos Express", "arranjosexpress.com.br", "Ajustes de roupas"),
    ("Serviços", "Hocus Pocus (quiosque)", "Usuário confirmou", "Quiosque cervejaria"),
    ("Serviços", "Program", "brasil-shoppings", ""),
    ("Serviços", "SNC", "brasil-shoppings", ""),
    ("Serviços", "Paradis", "brasil-shoppings", ""),
    ("Serviços", "Parme", "brasil-shoppings", ""),
    ("Serviços", "Arnaldo Gonçalves", "brasil-shoppings", ""),
    ("Serviços", "Josefina Rosacor", "brasil-shoppings", ""),
    ("Serviços", "Feranda", "brasil-shoppings", ""),
    ("Serviços", "Gajah", "brasil-shoppings", ""),
    ("Serviços", "Armadillo", "brasil-shoppings", ""),
    ("Serviços", "A D", "brasil-shoppings", ""),
    ("Serviços", "Afghan", "brasil-shoppings", ""),
    ("Serviços", "QOY", "brasil-shoppings", ""),
    ("Serviços", "NYS", "brasil-shoppings", ""),
    ("Serviços", "Europa", "brasil-shoppings", ""),
    ("Serviços", "Opção", "brasil-shoppings", ""),
    ("Serviços", "Orattória", "brasil-shoppings", ""),
    ("Serviços", "Sensoria", "brasil-shoppings", "Lista de saídas - validar"),

    # Doces / Balas
    ("Doces", "Fini", "brasil-shoppings", ""),
    ("Doces", "Angel Candy Balas", "brasil-shoppings", ""),
    ("Doces", "Case Mix", "brasil-shoppings", "Acessórios celular"),
]

# Write each row
for i, row in enumerate(mix, start=6):
    for col_idx, val in enumerate(row, 1):
        cell = ws.cell(row=i, column=col_idx, value=val)
        cell.font = FONT_BODY
        cell.alignment = ALIGN_L
        cell.border = BORDER
        if i % 2 == 0:
            cell.fill = FILL_ALT
        if "saídas" in str(val).lower() or "validar" in str(val).lower():
            cell.fill = FILL_NV

ws["A" + str(len(mix) + 8)] = f"Total: {len(mix)} marcas verificadas (de ~288 totais segundo brasil-shoppings.com.br)"
ws.cell(row=len(mix) + 8, column=1).font = FONT_BODY_B

ws.column_dimensions["A"].width = 22
ws.column_dimensions["B"].width = 32
ws.column_dimensions["C"].width = 45
ws.column_dimensions["D"].width = 45


# ========================================================
# Sheet 3 - SAÍDAS ANO 1
# ========================================================
ws = wb.create_sheet("Saidas Ano 1")
write_title(ws, "SAÍDAS ANO 1 — Cinemark mantida; demais a validar com EV")

headers = ["#", "Segmento", "Loja", "Tier", "ABL (m²)", "Status", "Tese reposição (filtro duplicidade)", "Prioridade"]
write_header(ws, 3, headers)

saidas = [
    [1, "Cinema (foyer)", "Cinemark (foyer)", "Tier 1", 5097, "MANTIDA - foyer em redev", "Conceito INDOOR: entretenimento adulto + cafés nicho + autoral local", "ALTA"],
    [2, "Departamento", "Lojas Americanas", "Tier 1", 2724, "n.v. - validar", "H&M (em expansão Rio 2026, Plaza fora do plano - pitch ativo) OU outlet âncora híbrido", "ALTA"],
    [3, "Lazer/Games", "World Games", "Tier 3", 451, "Saída", "NÃO repor com lazer infantil (saturado). Pivotar para entret. adulto", "BAIXA"],
    [4, "Serviços", "Dinisa", "Tier 3", 326, "Saída", "Serviços recorrentes (lavanderia premium, conserto eletrônicos)", "MÉDIA"],
    [5, "Restaurantes", "Viena E Batata Inglesa", "Tier 3", 256, "Saída", "Operador autoral Niterói (Cantón, Sunsaki, Buzin, Toca da Traíra)", "MÉDIA"],
    [6, "Esportes", "Adidas", "Tier 1", 205, "Saída", "Esporte saturado. Pivotar caixa para outra categoria (ALO activewear, wellness)", "MÉDIA"],
    [7, "Moda Fem.", "Zinzane", "Tier 1", 198, "Saída", "Marca DTC nativa digital ou regional não-duplicada", "BAIXA"],
    [8, "Saúde", "Espaço Crescer", "Tier 3", 165, "Saída", "Clínica multi-especialidade ou dermatologia estética", "MÉDIA"],
    [9, "Beleza", "Walter'S Coiffeur", "Tier 3", 141, "Saída", "Le Beauté Salon Bar (conceito beleza+bar, Icaraí) ou Studio W", "MÉDIA"],
    [10, "Moda Fem.", "Lizie", "Tier 1", 126, "Saída", "Multimarca regional", "BAIXA"],
    [11, "Telefonia", "Vivo", "Tier 1", 118, "n.v. - validar", "Já tem Vivo, TIM, Claro, Oi - se saída real, pivotar", "MÉDIA"],
    [12, "Moda Geral", "Star Point", "Tier 2", 93, "Saída", "Marca local autoral", "BAIXA"],
    [13, "Moda Fem.", "Aquamar", "Tier 3", 80, "Saída", "Marca local", "BAIXA"],
    [14, "Calçados", "Havaianas", "Tier 1", 78, "n.v. - validar", "Se saída, pivotar para Vans, Kichute", "MÉDIA"],
    [15, "CAMEBA", "Mmartan", "Tier 1", 75, "Saída", "CAMEBA saturada (First Class, Tok&Stok, Camicado) - pivotar", "BAIXA"],
    [16, "Restaurantes", "Mania De Churrasco", "Tier 1", 74, "Saída", "Operador autoral Niterói/Tijuca (Tenore, Vikings Tijuca)", "MÉDIA"],
    [17, "Ótica", "Kza Otica", "Tier 3", 69, "Saída", "Ótica saturada - consolidar ou pivotar", "BAIXA"],
    [18, "Moda Fem.", "From", "Tier 3", 66, "Saída", "Marca local", "BAIXA"],
    [19, "Academia/Esp.", "Físico E Forma", "Tier 2", 65, "Saída", "Wellness studio (yoga, pilates) ou suplementos premium", "MÉDIA"],
    [20, "Moda Fem.", "Garage Vintage", "Tier 3", 58, "Saída", "Multimarca vintage local", "BAIXA"],
    [21, "Moda Masc.", "Ad Life Style", "Tier 2", 55, "Saída", "Marca autoral", "BAIXA"],
    [22, "Moda Geral", "55 Rj", "Tier 3", 50, "Saída", "Marca local", "BAIXA"],
    [23, "Moda Fem.", "Glam By", "Tier 3", 49, "Saída", "Multimarca", "BAIXA"],
    [24, "Brinquedos", "Criamigos", "Tier 1", 44, "Saída", "NÃO repor (lazer infantil saturado)", "BAIXA"],
    [25, "Fast Food", "Taco Bell", "Tier 1", 43, "Saída", "Fast casual mexicano (Frida & Mina, La Salsa)", "BAIXA"],
    [26, "Beleza", "Cor E Unha Fashion Hair", "Tier 3", 41, "Saída", "Esmalteria express ou consolidação com Unhas Express", "BAIXA"],
    [27, "Moda Infantil", "Puket", "Tier 1", 40, "Saída", "Saturado - pivotar caixa", "BAIXA"],
    [28, "Calçados", "Energia Kids", "Tier 3", 38, "Saída", "Bibi/Pé com Pé (já tem Bibi) - pivotar", "BAIXA"],
    [29, "Ótica", "Otica Maxvision", "Tier 3", 35, "Saída", "Ver OPP 17", "BAIXA"],
    [30, "Acessórios", "I Love Biju", "Tier 3", 35, "Saída", "Quiosque", "BAIXA"],
    [31, "Calçados Fem.", "Picadilly", "Tier 1", 34, "Saída", "Saturado - pivotar", "BAIXA"],
    [32, "Beleza", "Sobrancelhas", "Tier 1", 34, "Saída", "Studio W (sobrancelha design)", "BAIXA"],
    [33, "Produtos", "Vx Case", "Tier 2", 33, "Saída", "Já tem Case Mix - pivotar", "BAIXA"],
    [34, "Café", "B&B Cafeteria", "Tier 3", 33, "Saída", "Café especial nicho (Suplicy, Octavio)", "MÉDIA"],
    [35, "CAMEBA", "First Class", "Tier 1", 29, "n.v. - validar (lista de saída mas constatei na lista atual)", "Se saída real, pivotar", "BAIXA"],
    [36, "Café", "Cacau Noir", "Tier 2", 26, "Saída", "Brigaderia autoral (Maria Brigadeiro, Briggo's)", "BAIXA"],
    [37, "Moda Fem.", "Marmello Modas", "Tier 3", 18, "Saída", "Quiosque", "BAIXA"],
    [38, "Cosméticos", "Sensoria", "Tier 3", 13, "n.v. - validar (consta em brasil-shoppings)", "Se saída real, pivotar", "BAIXA"],
    [39, "Fast Food", "Mc Donald's2", "Tier 1", 10, "Saída", "Espaço residual", "BAIXA"],
]

for i, row in enumerate(saidas, start=4):
    for col_idx, val in enumerate(row, 1):
        cell = ws.cell(row=i, column=col_idx, value=val)
        cell.font = FONT_BODY
        cell.alignment = ALIGN_L if col_idx in (2, 3, 6, 7) else ALIGN_C
        cell.border = BORDER
        if col_idx == 5:
            cell.number_format = "#,##0"
        if i % 2 == 0:
            cell.fill = FILL_ALT
        if col_idx == 6 and "n.v." in str(val):
            cell.fill = FILL_NV
        if col_idx == 6 and "MANTIDA" in str(val):
            cell.fill = FILL_GREEN
        if col_idx == 8 and val == "ALTA":
            cell.fill = FILL_RED
            cell.font = FONT_BODY_B
        if col_idx == 8 and val == "MÉDIA":
            cell.fill = FILL_BLUE

tot_row = len(saidas) + 4
ws.cell(row=tot_row, column=1, value="TOTAL").font = FONT_BODY_B
ws.cell(row=tot_row, column=5, value=f"=SUM(E4:E{tot_row-1})").font = FONT_BODY_B
ws.cell(row=tot_row, column=5).number_format = "#,##0"

ws.column_dimensions["A"].width = 5
ws.column_dimensions["B"].width = 14
ws.column_dimensions["C"].width = 25
ws.column_dimensions["D"].width = 8
ws.column_dimensions["E"].width = 10
ws.column_dimensions["F"].width = 28
ws.column_dimensions["G"].width = 60
ws.column_dimensions["H"].width = 10


# ========================================================
# Sheet 4 - GAPS REAIS
# ========================================================
ws = wb.create_sheet("Gaps Reais")
write_title(ws, "GAPS REAIS — Após filtro de duplicidade vs 288 marcas")

headers = ["#", "Categoria", "Por que é gap real", "Operadores-alvo verificados (AUSENTES do Plaza)", "Confiança", "Prioridade"]
write_header(ws, 3, headers)

gaps = [
    [1, "Bowling / Boliche compacto", "Nenhuma operação de boliche nas 288 marcas. Categoria validada como motor pré/pós-cinema em outros malls", "Bossa Nova Bowl (n.v. expansão), Galaxy Bowling (n.v.)", "Alta", "ALTA"],
    [2, "Escape Room / VR experiencial", "Não há escape room nem VR no Plaza (XDome é game tradicional, não VR/escape)", "Lock Quest, EnigMa, Sherlock Escape Rooms, Sandbox VR", "Alta", "ALTA"],
    [3, "Karaokê privativo", "Inexistente. Conceito de salas privadas para grupos", "n.v. operadores BR", "Média", "MÉDIA"],
    [4, "Sorveteria experiencial premium", "Plaza tem Mr. Cheney, Kopenhagen, Havanna mas nenhuma sorveteria experiencial italiana", "Bacio di Latte (expansão forte BR)", "Alta", "ALTA"],
    [5, "Açaí premium", "Não há Oakberry nem similar. Plaza tem só fast food tradicional", "Oakberry (expansão global)", "Alta", "ALTA"],
    [6, "Bubble tea", "Inexistente", "Chatime (expansão BR)", "Média", "MÉDIA"],
    [7, "Cafés especiais nicho", "Plaza tem Starbucks e padaria, mas não tem cafés especiais autorais", "Suplicy Cafés Especiais, Octavio, Cafezzal, The Coffee", "Média", "MÉDIA"],
    [8, "Fast-fashion internacional", "Plaza tem GAP, Forever 21 (validar), mas não H&M nem Zara", "**H&M** (expandindo Rio 2026: RioSul abr/26, NorteShopping próxima)", "Alta", "ALTA"],
    [9, "Activewear premium", "Saturação esportiva tradicional, mas falta activewear lifestyle premium", "ALO Yoga (acaba de abrir Rio - VillageMall abr/26)", "Média", "MÉDIA"],
    [10, "Gastronomia autoral Niterói/Tijuca/Zona Sul", "Plaza tem 19+ ops gastronômicas, todas cadeias mainstream. Falta autoral local", "Ver abas Street Converter Niterói/Tijuca/Zona Sul", "Alta", "ALTA"],
    [11, "Hambúrguer autoral", "Plaza tem Burger King, Cabana Burger (cadeia), McDonald's, Galli Grill, Bond Chop. Falta hambúrguer autoral premium", "Clan BBQ/Bal.Clan, TT Burguer, Bullguer, Buen Bife", "Alta", "ALTA"],
    [12, "Pizza autoral", "Plaza tem Domino's, Mister Pizza, La Mole. Falta pizza autoral fermentação natural", "Ferro e Farinha (Sei Shiroma - 4 unidades RJ, forno duplex), Bráz Elettrica", "Alta", "ALTA"],
    [13, "Wellness studio", "Plaza tinha Físico e Forma (saída). Falta yoga/pilates premium", "Bodytech (mas é academia full), Pilates Premium studios, Smartfit (n.v.)", "Média", "MÉDIA"],
    [14, "Pet shop completo", "Plaza tem Zee.Dog (acessórios) e Animal Tour. Falta pet shop completo com banho/tosa", "Cobasi (formato compacto), Petz (formato compacto)", "Média", "MÉDIA"],
    [15, "Clínica/Estética", "Plaza tem Hospital dos Olhos (ótica). Falta clínica multi-especialidade e dermatologia estética", "Dr. Consulta, Onodera Estética, Clínica Bio Ritmo", "Média", "MÉDIA"],
]

for i, row in enumerate(gaps, start=4):
    for col_idx, val in enumerate(row, 1):
        cell = ws.cell(row=i, column=col_idx, value=val)
        cell.font = FONT_BODY
        cell.alignment = ALIGN_L if col_idx in (2, 3, 4) else ALIGN_C
        cell.border = BORDER
        if i % 2 == 0:
            cell.fill = FILL_ALT
        if col_idx == 6 and val == "ALTA":
            cell.fill = FILL_RED
            cell.font = FONT_BODY_B

ws.column_dimensions["A"].width = 5
ws.column_dimensions["B"].width = 30
ws.column_dimensions["C"].width = 45
ws.column_dimensions["D"].width = 55
ws.column_dimensions["E"].width = 10
ws.column_dimensions["F"].width = 11


# ========================================================
# Sheet 5 - FOYER REDEV
# ========================================================
ws = wb.create_sheet("Foyer Redev v4")
write_title(ws, "FOYER REDEVELOPMENT v4 — 5.097m² INDOOR | Operadores AUSENTES do Plaza")

ws["A3"] = "Princípio: 100% das operações sugeridas verificadas como AUSENTES da lista de 288 marcas. Conceitos INDOOR (NÃO Taste Lab)."
ws["A3"].font = FONT_BODY_B
ws.merge_cells("A3:F3")

headers = ["Sub-zona", "ABL (m²)", "Conceito", "Operadores-alvo (verificados ausentes)", "Cluster Fit", "Status"]
write_header(ws, 5, headers)

foyer = [
    ["Entretenimento adulto", 1500,
     "Boliche compacto + escape rooms + VR + simuladores",
     "Bossa Nova Bowl, Lock Quest, EnigMa, Sandbox VR, Sherlock Escape (todos AUSENTES; n.v. interesse RJ)",
     90, "Lead"],
    ["Karaokê privativo", 600,
     "Salas privadas estilo asiático",
     "n.v. operadores BR consolidados - prospectar",
     70, "Lead"],
    ["Sorveterias + Cafés nicho premium", 1000,
     "5-7 operações premium NÃO cadeia mainstream",
     "Bacio di Latte, Oakberry, Chatime, Suplicy Cafés, Octavio, brigaderia autoral (Maria Brigadeiro/Briggo's) - TODOS ausentes",
     88, "Lead"],
    ["Gastrobar autoral local", 800,
     "1-2 operadores Niterói/Tijuca/Zona Sul (Street Converter)",
     "Cantón (Niterói), Pli On Board (Niterói), Clan BBQ/Bal.Clan (Leblon), Ferro e Farinha (RJ), Noo Cachaçaria (Tijuca) - TODOS ausentes",
     90, "Lead"],
    ["Hambúrguer autoral + Pizza autoral", 600,
     "Substitui ausência de hambúrguer/pizza autorais (cadeias estão, autoral falta)",
     "Ferro e Farinha (4 unidades RJ, forno duplex), Bal.Clan, TT Burguer (Troisgros), Bullguer - TODOS ausentes",
     88, "Lead"],
    ["Pop-up rotativo + showroom", 600,
     "Lojas conceito rotativas + 1 showroom de marca DTC nativa digital",
     "Pop-up rotativo (Appearhere model) + showroom Insider/Amaro/Basico.com (TODOS ausentes)",
     80, "Lead"],
    ["TOTAL FOYER", "", "", "", "", ""],
]

for i, row in enumerate(foyer[:-1], start=6):
    for col_idx, val in enumerate(row, 1):
        cell = ws.cell(row=i, column=col_idx, value=val)
        cell.font = FONT_BODY
        cell.alignment = ALIGN_L if col_idx in (1, 3, 4) else ALIGN_C
        cell.border = BORDER
        if col_idx == 2:
            cell.number_format = "#,##0"
        if i % 2 == 0:
            cell.fill = FILL_ALT
        if col_idx == 5 and isinstance(val, int) and val >= 85:
            cell.fill = FILL_GREEN

tot_row = len(foyer) - 1 + 6
ws.cell(row=tot_row, column=1, value="TOTAL FOYER").font = FONT_BODY_B
ws.cell(row=tot_row, column=2, value=f"=SUM(B6:B{tot_row-1})").font = FONT_BODY_B
ws.cell(row=tot_row, column=2).number_format = "#,##0"
ws.cell(row=tot_row, column=2).fill = FILL_GREEN

ws.column_dimensions["A"].width = 30
ws.column_dimensions["B"].width = 10
ws.column_dimensions["C"].width = 45
ws.column_dimensions["D"].width = 65
ws.column_dimensions["E"].width = 10
ws.column_dimensions["F"].width = 11


# ========================================================
# Sheet 6 - STREET CONVERTER NITERÓI
# ========================================================
ws = wb.create_sheet("Street - Niteroi")
write_title(ws, "STREET CONVERTER — NITERÓI (raio 0-10 km) | Todos AUSENTES do Plaza")

ws["A3"] = "Fontes: Tripadvisor, Visit Niterói, Quintoandar, Comida di Buteco 2025, Cidade de Niterói"
ws["A3"].font = FONT_NOTE
ws.merge_cells("A3:H3")

headers = ["Operador", "Bairro / Endereço", "Categoria", "Sinais de tração", "Fit cluster", "Status no Plaza", "Tese conversão", "Próxima ação"]
write_header(ws, 5, headers)

street_nit = [
    ["Cantón Peruvian & Chinese", "São Francisco beira-mar", "Chifa autoral", "Operação consolidada SP+RJ; fila comprovada; ticket R$50-80", 85, "AUSENTE", "Conceito experiencial diferenciado", "Reunião comercial"],
    ["Pli On Board", "Niterói", "Boteco autoral", "Vencedor Comida di Buteco Niterói 2025", 82, "AUSENTE", "Gastrobar autoral com prêmio recente", "Reunião + tese foyer"],
    ["Sunsaki", "Icaraí", "Japonês contemporâneo", "Referência local; rodízio + à la carte", 78, "AUSENTE (Jappa é tradicional)", "Substitui ausência de japonês moderno", "Sondar"],
    ["Tenore Churrascaria", "Icaraí (Av. Jornalista Alberto F. Torres, 521)", "Churrascaria com vista", "Vista praia Icaraí; rodízio robusto", 72, "AUSENTE", "Substituir Mania de Churrasco com versão qualificada", "Sondar"],
    ["Buzin Gastronomia", "Icaraí (R. Gen. Pereira da Silva, 169)", "Restaurante autoral", "Local consolidado", 70, "AUSENTE", "Operador rua autoral", "Sondar"],
    ["Lucca Forneria", "Icaraí (Dr. Leandro Mota, 142)", "Italiana forneria", "Massa fermentação natural", 68, "AUSENTE (La Mole, Mister Pizza, Domino's existem)", "Forneria autoral diferenciada", "Sondar"],
    ["Da Carmine", "Icaraí (Mariz e Barros, 305)", "Pizzaria autoral", "Pizzaria de bairro estabelecida", 65, "AUSENTE", "Pizza autoral", "Sondar"],
    ["Toca da Traíra", "Icaraí (Mem de Sá, 8)", "Peixe e frutos do mar", "Operação consolidada", 70, "AUSENTE", "Categoria ausente no Plaza", "Sondar"],
    ["Le Beauté Salon Bar", "Icaraí", "Beleza + bar/bistrô", "Conceito híbrido exclusivo Niterói", 78, "AUSENTE", "Conceito beleza+gastro - pode substituir Walter's Coiffeur", "Reunião"],
    ["Beco JT / Endorfina / Nosso Boteco", "Icaraí (vários)", "Botecos autênticos (CdB 2026)", "Botecos Icaraí autênticos", 60, "AUSENTE", "Vetor multimarcas botecos - Mandamento 7", "Avaliar pacote"],
]

for i, row in enumerate(street_nit, start=6):
    for col_idx, val in enumerate(row, 1):
        cell = ws.cell(row=i, column=col_idx, value=val)
        cell.font = FONT_BODY
        cell.alignment = ALIGN_L if col_idx in (1, 2, 3, 4, 7, 8) else ALIGN_C
        cell.border = BORDER
        if i % 2 == 0:
            cell.fill = FILL_ALT
        if col_idx == 5 and isinstance(val, int) and val >= 80:
            cell.fill = FILL_GREEN
        elif col_idx == 5 and isinstance(val, int) and val >= 70:
            cell.fill = FILL_BLUE
        if col_idx == 6 and val == "AUSENTE":
            cell.fill = FILL_GREEN

for col, w in zip("ABCDEFGH", [28, 30, 22, 30, 8, 25, 35, 20]):
    ws.column_dimensions[col].width = w


# ========================================================
# Sheet 7 - STREET CONVERTER TIJUCA
# ========================================================
ws = wb.create_sheet("Street - Tijuca")
write_title(ws, "STREET CONVERTER — TIJUCA (raio 15-20 km via Ponte) | Todos AUSENTES do Plaza")

ws["A3"] = "Fontes: Tripadvisor, Fui Ser Viajante, Os Melhores do Rio"
ws["A3"].font = FONT_NOTE
ws.merge_cells("A3:H3")

write_header(ws, 5, headers)

street_tij = [
    ["Salete", "Tijuca (R. Afonso Pena, 189)", "Empadaria tradicional 60+ anos", "Empadas famosas; mais de 60 anos", 75, "AUSENTE", "Conceito autoral tradicional - quiosque ou loja pequena", "Sondar"],
    ["Brasa Gourmet", "Tijuca", "Churrascaria", "Local tradicional", 68, "AUSENTE", "Alternativa para Mania de Churrasco saída", "Sondar"],
    ["Vikings (Tijuca)", "Tijuca", "Steaks, seafood, sandwiches", "Rede com unidade Tijuca", 65, "AUSENTE", "Variedade carnes/frutos do mar", "Sondar"],
    ["Noo Cachaçaria", "Praça da Bandeira", "Cachaçaria autoral pet-friendly", "Ampla seleção rótulos; pet-friendly; petiscos vegetarianos", 78, "AUSENTE", "Conceito autoral; pet friendly - diferencial Plaza", "Reunião"],
    ["Dida Bar e Restaurante", "Praça da Bandeira (R. Barão de Iguatemi, 379)", "Boteco com feijoada premiada", "Feijoada considerada uma das melhores RJ", 72, "AUSENTE", "Feijoada autoral pode ser referência regional", "Sondar"],
    ["On Tap", "Tijuca", "Pub artesanal cervejas", "Pub temático irlandês; várias torneiras", 70, "AUSENTE (Hocus Pocus é quiosque)", "Pub completo com hamburgueres - diferente do quiosque Hocus Pocus", "Sondar"],
    ["Padaria Santa Marta", "Tijuca (Praça Saens Peña)", "Padaria/Confeitaria", "Tradicional Tijuca", 60, "AUSENTE", "Padaria tradicional - avaliar quiosque", "Sondar quiosque"],
    ["Confeitaria Rita de Cássia", "Tijuca (R. Conde de Bonfim, desde 1971)", "Confeitaria tradicional familiar", "55+ anos de história", 65, "AUSENTE", "Quitutes; podem virar conceito carioca", "Sondar"],
]

for i, row in enumerate(street_tij, start=6):
    for col_idx, val in enumerate(row, 1):
        cell = ws.cell(row=i, column=col_idx, value=val)
        cell.font = FONT_BODY
        cell.alignment = ALIGN_L if col_idx in (1, 2, 3, 4, 7, 8) else ALIGN_C
        cell.border = BORDER
        if i % 2 == 0:
            cell.fill = FILL_ALT
        if col_idx == 5 and isinstance(val, int) and val >= 75:
            cell.fill = FILL_GREEN
        elif col_idx == 5 and isinstance(val, int) and val >= 65:
            cell.fill = FILL_BLUE
        if col_idx == 6 and val.startswith("AUSENTE"):
            cell.fill = FILL_GREEN

for col, w in zip("ABCDEFGH", [28, 35, 25, 35, 8, 25, 35, 18]):
    ws.column_dimensions[col].width = w


# ========================================================
# Sheet 8 - STREET CONVERTER ZONA SUL
# ========================================================
ws = wb.create_sheet("Street - Zona Sul")
write_title(ws, "STREET CONVERTER — ZONA SUL RIO (raio 18-25 km via Ponte) | Todos AUSENTES do Plaza")

ws["A3"] = "Fontes: CNN Brasil Retrospectiva 2025, Time Out RJ, Judice Araújo, You Must Go, Ipanema Inn Blog"
ws["A3"].font = FONT_NOTE
ws.merge_cells("A3:H3")

write_header(ws, 5, headers)

street_zsul = [
    ["Clan BBQ / Bal.Clan", "Leblon (Dias Ferreira) - Bal.Clan no Shopping Leblon", "Hambúrguer autoral", "Versão express já no Shopping Leblon (chefs Pepo Figueiredo + Newton Rique); R$ 34-52", 88, "AUSENTE", "Marca já validada em mall (Shopping Leblon). Hambúrguer autoral 180g brasa", "Reunião prioritária"],
    ["Ferro e Farinha", "Ipanema (Maria Quitéria, 107) + Botafogo + Leblon + Barra", "Pizza autoral massa fermentação natural", "4 unidades RJ; primeiro forno à lenha duplex do Brasil; chef Sei Shiroma", 85, "AUSENTE (cadeia Domino's, Mister Pizza, La Mole existem)", "Pizza autoral premium completa lacuna autoral", "Reunião prioritária"],
    ["TT Burguer (Thomas Troisgros)", "Várias unidades RJ", "Hambúrguer Troisgros", "Operação consolidada chef Troisgros", 82, "AUSENTE", "Hambúrguer autoral premium do grupo Troisgros", "Sondar"],
    ["CT Boucherie (Claude Troisgros)", "Leblon", "Carnes francesas premium", "Operação chef Claude Troisgros", 78, "AUSENTE", "Carnes premium - diferente de Outback/Madero", "Sondar"],
    ["ÏT Ristorante", "Shopping Leblon 4º piso", "Italiano com vista Cristo Redentor", "Modelo de expansão validado em mall", 80, "AUSENTE (cadeias italianas existem)", "Italiano premium com modelo de mall validado", "Sondar"],
    ["Quitéria Restaurant", "Ipanema (Maria Quitéria, 27 - Ipanema Inn)", "Cozinha brasileira contemporânea", "Conceito brasileiro contemporâneo", 75, "AUSENTE", "Brasileira contemporânea premium", "Sondar"],
    ["Madame Olympe", "Leblon (R. Conde de Bernadotte, 26)", "Francês by Claude Troisgros", "Novo restaurante Troisgros (2025) + chef Jéssica", 76, "AUSENTE", "Francês premium novo conceito", "Sondar (novo, pode estar em expansão)"],
    ["Bullguer", "Várias Zona Sul RJ", "Hambúrguer autoral consolidado", "Operação consolidada várias unidades RJ", 75, "AUSENTE", "Hambúrguer autoral", "Sondar (validar status)"],
    ["Cedilha Bar", "Ipanema (Hotel Janeiro)", "Bar pós-praia", "Reaberto 2025 com menu conciso", 70, "AUSENTE", "Bar conceito", "Sondar"],
    ["Bistrô MAC", "Niterói (subsolo MAC) - mais perto que pensei", "Bistrô com vista Baía", "Edifício Niemeyer; bobó de camarão referência", 72, "AUSENTE (mas é dentro do MAC, conceito único)", "Replicação difícil mas pode inspirar conceito", "Avaliar fit"],
]

for i, row in enumerate(street_zsul, start=6):
    for col_idx, val in enumerate(row, 1):
        cell = ws.cell(row=i, column=col_idx, value=val)
        cell.font = FONT_BODY
        cell.alignment = ALIGN_L if col_idx in (1, 2, 3, 4, 7, 8) else ALIGN_C
        cell.border = BORDER
        if i % 2 == 0:
            cell.fill = FILL_ALT
        if col_idx == 5 and isinstance(val, int) and val >= 80:
            cell.fill = FILL_GREEN
        elif col_idx == 5 and isinstance(val, int) and val >= 70:
            cell.fill = FILL_BLUE
        if col_idx == 6 and str(val).startswith("AUSENTE"):
            cell.fill = FILL_GREEN

for col, w in zip("ABCDEFGH", [30, 42, 25, 40, 8, 30, 35, 24]):
    ws.column_dimensions[col].width = w


# ========================================================
# Sheet 9 - MARCAS EXPANSÃO RIO
# ========================================================
ws = wb.create_sheet("Marcas Expansao Rio")
write_title(ws, "MARCAS EM EXPANSÃO RIO 2026 — Verificadas (NÃO Street Converter)")

headers = ["Marca", "Status RJ 2026", "Plano expansão", "Fit Plaza", "Tese de abordagem", "Prioridade", "Fonte"]
write_header(ws, 3, headers)

marcas = [
    ["H&M", "RioSul aberta 25/04/2026; NorteShopping próxima", "7 lojas BR em 2026; meta: todos estados até 2028", 88, "Plaza Niterói NÃO está no plano atual. Pitch como 3ª loja RJ, primeira fora capital RJ. Caixa Americanas 2.724m² ideal", "ALTA", "Promoview + Tempo Real RJ + Giro News (abr/2026)"],
    ["ALO Activewear", "1ª loja Rio - VillageMall abr/2026", "Expansão BR ampliada", 75, "Activewear premium não saturado. Considerar quiosque ou caixa média", "MÉDIA", "S.Mag.al (abr/2026)"],
    ["NV (moda fem.)", "Curitiba (Park Shopping Barigui), Rio Design Barra, Uberlândia", "Plano de expansão com novo conceito 275m² aprovado", 70, "Moda feminina premium novo conceito - avaliar caixa Zinzane", "MÉDIA", "FashionNetwork (nov/2024)"],
    ["Cinépolis", "Várias unidades BR", "Expansão BR ativa", 50, "Plaza tem Cinemark. Cinépolis duplicaria - **DESCONSIDERAR**", "BAIXA (descartado)", "Promoview"],
    ["BAW Clothing (grupo Arezzo)", "1ª loja física SP", "Grupo Arezzo está consolidado em Niterói (Arezzo já está)", 60, "Avaliar se BAW expande standalone - grupo Arezzo já está no Plaza", "BAIXA", "Exame"],
]

for i, row in enumerate(marcas, start=4):
    for col_idx, val in enumerate(row, 1):
        cell = ws.cell(row=i, column=col_idx, value=val)
        cell.font = FONT_BODY
        cell.alignment = ALIGN_L if col_idx in (1, 2, 3, 5, 7) else ALIGN_C
        cell.border = BORDER
        if i % 2 == 0:
            cell.fill = FILL_ALT
        if col_idx == 4 and isinstance(val, int) and val >= 80:
            cell.fill = FILL_GREEN
        elif col_idx == 4 and isinstance(val, int) and val >= 70:
            cell.fill = FILL_BLUE
        if col_idx == 6 and val == "ALTA":
            cell.fill = FILL_RED
            cell.font = FONT_BODY_B
        if col_idx == 6 and val == "MÉDIA":
            cell.fill = FILL_BLUE

for col, w in zip("ABCDEFG", [22, 32, 40, 8, 50, 15, 38]):
    ws.column_dimensions[col].width = w


# ========================================================
# Sheet 10 - DEAL CONVERSION TABLE
# ========================================================
ws = wb.create_sheet("Deal Conversion v4")
write_title(ws, "DEAL CONVERSION TABLE v4 — Pipeline final com filtro de duplicidade")

headers = ["ID", "Espaço/Caixa", "ABL (m²)", "Tese (filtro duplicidade aplicado)", "Cluster Fit", "Estágio", "Dono", "Próxima Ação", "Prazo (dias)", "Prob. Fech.", "Blocker", "Impacto"]
write_header(ws, 3, headers)

deals = [
    ["OPP-F1", "Foyer / Master Plan INDOOR", 5097, "Conceito INDOOR (NÃO Taste Lab): entret. adulto + cafés nicho + autoral local", 92, "Conceito", "Allos Desenv. + EV", "Apresentar conceito + CAPEX", 15, "70%", "Aprovação CAPEX", "Alto"],
    ["OPP-F2", "Foyer / Entret. Adulto", 1500, "Boliche compacto + escape rooms + VR (Bossa Nova Bowl / Lock Quest / Sandbox VR) - TODOS ausentes", 90, "Lead", "KA Expansion", "Sondar 3 operadores BR", 45, "45%", "Disponibilidade marca Rio", "Alto"],
    ["OPP-F3", "Foyer / Cafés nicho + sorveteria", 1000, "Bacio di Latte, Oakberry, Suplicy, Chatime, brigaderia autoral - TODOS ausentes do Plaza", 88, "Lead", "Hunter + KA", "Top 10 abordagens", 45, "60%", "Curadoria", "Médio-alto"],
    ["OPP-F4", "Foyer / Gastrobar autoral", 800, "Cantón (Niterói) ou Pli On Board (Niterói) ou Clan BBQ/Bal.Clan (Leblon) ou Ferro e Farinha (RJ)", 90, "Lead", "Street Converter", "Reunião top 3", 45, "50%", "Convencimento rua→mall", "Alto"],
    ["OPP-F5", "Foyer / Hambúrguer + Pizza autorais", 600, "Bal.Clan + Ferro e Farinha (forneria) - ambos AUSENTES (cadeias já tem)", 88, "Lead", "Street Converter", "Reunião + tese", 45, "50%", "Convencimento", "Médio-alto"],
    ["OPP-F6", "Foyer / Pop-up + DTC showroom", 600, "Rotação mensal + showroom marca DTC (Insider/Amaro/Basico.com - ausentes)", 80, "Lead", "Hunter", "Modelo comercial", 30, "55%", "Modelo", "Médio"],
    ["OPP-F7", "Foyer / Karaokê privativo", 600, "Conceito ausente no Plaza", 75, "Lead", "KA", "Identificar redes BR", 60, "30%", "Operador qualificado", "Médio"],
    ["OPP-B-H&M", "Americanas (Plano A)", 2724, "**H&M** - expansão Rio confirmada 2026 (RioSul + NorteShopping); Plaza fora plano atual - pitch ativo", 90, "Lead", "Diretoria Allos + KA", "Reunião institucional H&M Brasil", 30, "40%", "Decisão H&M sobre 3ª loja RJ", "Muito Alto"],
    ["OPP-B-Out", "Americanas (Plano B)", 2724, "Se H&M não fechar: outlet híbrido (Nike Outlet + Adidas Outlet) ou nova categoria âncora", 75, "Lead", "KA Expansion", "Plano B em paralelo", 45, "35%", "n.v.", "Alto"],
    ["OPP-M-Adidas", "Adidas (saída)", 205, "Categoria esporte saturada - pivotar para ALO Activewear ou wellness studio", 70, "Lead", "KA", "Sondar ALO (já em Rio)", 30, "40%", "n.v.", "Médio"],
    ["OPP-M-Rest", "Mania Churrasco + Viena (256+74m²)", 330, "Operador rua autoral - Tenore (Icaraí), Buzin (Icaraí), Toca da Traíra, Brasa Gourmet (Tijuca)", 78, "Lead", "Street Converter", "Top 5 abordagens", 30, "50%", "Convencimento", "Médio"],
    ["OPP-M-Beleza", "Walter Coiffeur (141m²)", 141, "Le Beauté Salon Bar (conceito beleza+bar Icaraí, ausente do Plaza)", 78, "Lead", "Street Converter", "Reunião", 30, "55%", "Convencimento", "Médio"],
    ["OPP-M-Saude", "Espaço Crescer (165m²)", 165, "Clínica multi-especialidade ou dermatologia estética (gap real)", 70, "Lead", "KA", "Sondar Dr. Consulta, Onodera", 45, "45%", "n.v.", "Médio"],
    ["OPP-M-Fem", "Moda fem. 5 caixas (~457m²)", 457, "DTC nativa digital (BAW está consolidando, Linus, Zerezes) ou marca regional", 65, "Lead", "Hunter", "Map marcas DTC RJ", 45, "40%", "Achar operador escala", "Médio"],
    ["OPP-M-Rest2", "Caixas médias restantes (~700m²)", 700, "Pivotar com prudência - evitar duplicar categoria saturada", 60, "Lead", "Hunter", "Análise caso a caso", 45, "40%", "n.v.", "Baixo-médio"],
    ["OPP-P", "Lote 28 caixas pequenas (~1.485m²)", 1485, "1-2 multifranqueados RJ - Mandamento 8", 55, "Lead", "Farmer", "Map multifranqueados RJ", 60, "30%", "Achar operador único", "Médio agregado"],
]

for i, row in enumerate(deals, start=4):
    for col_idx, val in enumerate(row, 1):
        cell = ws.cell(row=i, column=col_idx, value=val)
        cell.font = FONT_BODY
        cell.alignment = ALIGN_L if col_idx in (2, 4, 8, 11, 12) else ALIGN_C
        cell.border = BORDER
        if col_idx == 3:
            cell.number_format = "#,##0"
        if i % 2 == 0:
            cell.fill = FILL_ALT
        if col_idx == 5 and isinstance(val, int):
            if val >= 85:
                cell.fill = FILL_GREEN
            elif val >= 70:
                cell.fill = FILL_BLUE

tot_row = len(deals) + 4
ws.cell(row=tot_row, column=1, value="TOTAL").font = FONT_BODY_B
ws.cell(row=tot_row, column=3, value=f"=SUM(C4:C{tot_row-1})").font = FONT_BODY_B
ws.cell(row=tot_row, column=3).number_format = "#,##0"

for col, w in zip("ABCDEFGHIJKL", [11, 28, 10, 60, 9, 11, 22, 30, 9, 10, 22, 14]):
    ws.column_dimensions[col].width = w


# ========================================================
# Sheet 11 - PLANO 30/60/90
# ========================================================
ws = wb.create_sheet("Plano 30-60-90")
write_title(ws, "PLANO 30 / 60 / 90 DIAS v4")

headers = ["Horizonte", "Ação", "Dono", "Entregável", "KPI", "Status"]
write_header(ws, 3, headers)

plano = [
    ["30 dias", "Aprovar conceito INDOOR do foyer (NÃO Taste Lab)", "Allos Desenv. + EV", "Aprovação executiva + CAPEX preliminar", "Aprovação binária", "Pendente"],
    ["30 dias", "**Pitch H&M Brasil para Americanas** (caixa 2.724m²) — H&M já em expansão Rio 2026 mas Plaza fora do plano atual", "Diretoria Allos + KA", "Reunião institucional H&M", "Resposta H&M", "Pendente"],
    ["30 dias", "Reuniões prioritárias: Clan BBQ/Bal.Clan (Leblon) + Ferro e Farinha (Ipanema) + Cantón (São Francisco) + Pli On Board (Niterói)", "Street Converter", "4 reuniões realizadas", "# LOIs em curso", "Pendente"],
    ["30 dias", "Curadoria de 10 marcas quick-gastro ausentes (Bacio di Latte, Oakberry, Suplicy, Chatime, brigaderias autorais)", "Hunter + KA", "Lista priorizada + 3 abordagens", "# abordagens iniciadas", "Pendente"],
    ["30 dias", "Sondar ALO Activewear (acaba de abrir Rio - VillageMall)", "KA", "1 reunião", "Resposta ALO", "Pendente"],
    ["30 dias", "Validar status real das 39 saídas com EV (Lojas Americanas, Vivo, Havaianas, Walter Coiffeur, Maxvision, MMartan, First Class, Sensoria estão na lista atual de brasil-shoppings)", "EV Plaza", "Lista corrigida", "Lista validada", "Pendente"],
    ["30 dias", "Mapeamento de 5 multifranqueados RJ (Mand. 8)", "Farmer", "Lista qualificada", "# identificados", "Pendente"],
    ["60 dias", "Master plan em projeto executivo (Builder)", "Builder Allos", "Plantas executivas", "Aprovação", "Pendente"],
    ["60 dias", "10 reuniões Street Converter (Niterói + Tijuca + Zona Sul)", "Street Converter", "10 reuniões", "Conversão lead→LOI", "Pendente"],
    ["60 dias", "LOI âncora foyer entretenimento (boliche/VR/escape)", "KA", "1 LOI", "1 LOI", "Pendente"],
    ["60 dias", "LOI gastrobar autoral foyer (Clan BBQ/Cantón/Pli/Ferro Farinha)", "Street Converter", "1 LOI", "1 LOI", "Pendente"],
    ["60 dias", "Proposta formal Americanas (H&M ou Plano B)", "KA", "Proposta", "Proposta enviada", "Pendente"],
    ["90 dias", "3+ LOIs foyer assinados (entret. + quick-gastro + autoral)", "KA + Street Converter", "3 LOIs", "≥ 3 LOIs", "Pendente"],
    ["90 dias", "Contrato âncora foyer assinado", "KA", "1 contrato", "1 contrato", "Pendente"],
    ["90 dias", "Resposta H&M sobre Plaza Niterói", "Diretoria + KA", "Sim/Não definido", "Decisão", "Pendente"],
    ["90 dias", "Lote multifranqueado estruturado (10-15 caixas pequenas)", "Farmer", "Termsheet", "1 operador", "Pendente"],
    ["90 dias", "Mid-review: revisar pipeline e priorizações", "Orquestrador", "Relatório", "Pipeline atualizado", "Pendente"],
]

for i, row in enumerate(plano, start=4):
    for col_idx, val in enumerate(row, 1):
        cell = ws.cell(row=i, column=col_idx, value=val)
        cell.font = FONT_BODY
        cell.alignment = ALIGN_L if col_idx in (2, 4, 5) else ALIGN_C
        cell.border = BORDER
        if i % 2 == 0:
            cell.fill = FILL_ALT
        if col_idx == 1:
            if val == "30 dias":
                cell.fill = FILL_RED
                cell.font = FONT_BODY_B
            elif val == "60 dias":
                cell.fill = FILL_NV
                cell.font = FONT_BODY_B
            else:
                cell.fill = FILL_BLUE
                cell.font = FONT_BODY_B

for col, w in zip("ABCDEF", [10, 65, 22, 28, 28, 11]):
    ws.column_dimensions[col].width = w


# ========================================================
# Sheet 12 - KPIs
# ========================================================
ws = wb.create_sheet("KPIs")
write_title(ws, "KPIs — Workflow 1 v4 Plaza Niterói")

headers = ["KPI", "Linha de base", "Meta 90d", "Meta 180d", "Meta 270d", "Fonte"]
write_header(ws, 3, headers)

kpis = [
    ["Conceito redev foyer aprovado", "Não", "Sim", "—", "—", "Allos Desenv."],
    ["Pré-locação Foyer (% LOIs)", "0%", "30%", "70%", "100%", "Pipeline KA"],
    ["Contratos Foyer assinados (#)", "0", "1", "3", "6", "Jurídico Allos"],
    ["Resposta H&M Plaza Niterói", "Não abordada", "Sim/Não", "Decisão final", "—", "KA + Diretoria"],
    ["ABL recolocada / vacância 6.028 m²", "0%", "30%", "65%", "85%", "Plataforma Espaços"],
    ["Vendas/m² zona cinema-adjacente vs. mix anterior", "n.v.", "n.v.", "+25%", "+45%", "Sistema Allos"],
    ["Cluster Fit médio mix novo", "—", "≥ 78", "≥ 82", "≥ 85", "Cluster Engine"],
    ["Dwell time pré/pós cinema", "n.v.", "+10%", "+20%", "+25%", "Beacons/app"],
    ["Dias médios saída → contrato", "n.v.", "≤ 180", "≤ 120", "≤ 90", "CRM Allos"],
    ["# reuniões Street Converter", "0", "30", "80", "150", "Agenda EV"],
    ["# operadores autorais Niterói/Tijuca/Zona Sul abordados", "0", "10", "20", "30", "Pipeline"],
    ["# multifranqueados RJ mapeados", "0", "5", "10", "15", "Farmer"],
    ["# LOIs Street→Shopping convertidos", "0", "2", "5", "8", "Pipeline"],
]

for i, row in enumerate(kpis, start=4):
    for col_idx, val in enumerate(row, 1):
        cell = ws.cell(row=i, column=col_idx, value=val)
        cell.font = FONT_BODY
        cell.alignment = ALIGN_L if col_idx in (1, 6) else ALIGN_C
        cell.border = BORDER
        if i % 2 == 0:
            cell.fill = FILL_ALT
        if "n.v." in str(val):
            cell.fill = FILL_NV

for col, w in zip("ABCDEF", [50, 16, 14, 14, 14, 22]):
    ws.column_dimensions[col].width = w


# ========================================================
# Sheet 13 - RISCOS
# ========================================================
ws = wb.create_sheet("Riscos")
write_title(ws, "RISCOS E BLOCKERS v4")

headers = ["#", "Risco", "Probabilidade", "Impacto", "Mitigação", "Dono"]
write_header(ws, 3, headers)

riscos = [
    [1, "CAPEX redev foyer não aprovado pela Allos", "Média", "Alto", "Conceito modular - implementação por fases", "Allos Desenv."],
    [2, "H&M rejeita Plaza Niterói (não está no plano 2026)", "Média-Alta", "Alto", "Plano B paralelo: outlet híbrido (Nike+Adidas) ou nova categoria âncora", "KA"],
    [3, "Operadores rua não migram para shopping (atrito principal histórico)", "Alta", "Médio", "Pacote Alavancador robusto + caso de uso Bal.Clan (já em Shopping Leblon)", "Street Converter"],
    [4, "Cluster mal classificado (Plaza tem perfil mais Passeio Familiar / Convenientes que Entretenimento)", "Média", "Alto", "Validar cluster antes do investimento", "Cluster Engine"],
    [5, "Status real das saídas não confirmado (8 marcas aparecem ainda na lista atual)", "Confirmada", "Médio", "EV validar antes de pipeline avançar", "EV Plaza"],
    [6, "Sem Sistema Bahia - underwriting é direcional", "Confirmada", "Alto", "Liberar acesso interno", "EV + TI Allos"],
    [7, "Sem CRM Farmer estruturado", "Confirmada", "Médio", "Implementar formulário suitability", "Farmer"],
    [8, "Concorrência regional (Bay Market, Niterói Shopping, Icaraí Shopping) reage", "Média", "Médio", "Speed-to-market", "EV"],
    [9, "Lazer infantil e esporte saturados - difícil ampliar mais", "Confirmada", "Baixo", "Pivotar caixas para outras categorias", "Cluster Engine"],
    [10, "Lista 288 marcas (brasil-shoppings) pode ter desatualizações", "Média", "Médio", "Cruzar com sistema interno Allos antes de pipeline final", "EV + Allos"],
    [11, "Carter's anunciado mas abertura não confirmada (anúncio antigo)", "Média", "Baixo", "Validar com lojista", "EV"],
    [12, "Custo de adaptação de operador autoral para shopping (PDV, ERP, etiqueta)", "Alta", "Médio", "Pacote Builder + Alavancador completo", "Builder"],
]

for i, row in enumerate(riscos, start=4):
    for col_idx, val in enumerate(row, 1):
        cell = ws.cell(row=i, column=col_idx, value=val)
        cell.font = FONT_BODY
        cell.alignment = ALIGN_L if col_idx in (2, 5) else ALIGN_C
        cell.border = BORDER
        if i % 2 == 0:
            cell.fill = FILL_ALT
        if col_idx == 4 and val == "Alto":
            cell.fill = FILL_RED
            cell.font = FONT_BODY_B

for col, w in zip("ABCDEF", [5, 60, 14, 10, 50, 22]):
    ws.column_dimensions[col].width = w


# ========================================================
# Sheet 14 - FONTES
# ========================================================
ws = wb.create_sheet("Fontes")
write_title(ws, "FONTES VERIFICADAS — Nenhuma API paga acionada")

headers = ["#", "Fonte", "URL", "Uso"]
write_header(ws, 3, headers)

fontes = [
    [1, "Plaza Shopping Niterói - Site oficial", "https://plazaniteroi.com.br/", "Tenant mix, Espaço Gourmet, eventos"],
    [2, "Plaza Shopping Niterói - Sobre o Shopping", "https://plazaniteroi.com.br/sobre-o-shopping/", "Lista Espaço Gourmet 10 restaurantes"],
    [3, "Allos Co - Plaza Shopping Niterói", "https://allos.co/en/shopping/plaza-shopping-niteroi-2/", "ABL 43.000m², 300+ lojas"],
    [4, "Brasil-Shoppings - Plaza Niterói (lista 288 marcas)", "https://www.brasil-shoppings.com.br/centros-comerciais/rio-de-janeiro-shoppings/cidade-niteroi/plaza-niteroi", "Fonte principal de filtro de duplicidade"],
    [5, "Decathlon - Loja Plaza Niterói", "https://www.decathlon.com.br/lojas/decathlon-plaza-niteroi", "Confirmação Decathlon"],
    [6, "Cidade de Niterói - Plaza Niterói notícias", "https://cidadedeniteroi.com/", "Plaza Play, XDome, Coco Bambu, Le Beauté"],
    [7, "Cidade de Niterói - Comida di Buteco 2025/2026", "https://cidadedeniteroi.com/gastronomia/guia-completo-bares-do-comida-di-buteco-no-rio-niteroi-e-baixada/", "Pli On Board vencedor 2025"],
    [8, "Visit Niterói - Icaraí & Jardim Icaraí", "https://visit.niteroi.br/en/jardim-icarai-santa-rosa/", "Mapeamento Icaraí"],
    [9, "Quintoandar - Restaurantes em Niterói", "https://www.quintoandar.com.br/guias/cidades/restaurantes-em-niteroi/", "Mapeamento gastronômico"],
    [10, "Tripadvisor - Restaurantes Saens Peña", "https://www.tripadvisor.com.br/RestaurantsNear-g303506-d9578410-Saens_Pena-Rio_de_Janeiro_State_of_Rio_de_Janeiro.html", "Mapeamento Tijuca"],
    [11, "Fui Ser Viajante - Bares Tijuca", "https://www.fuiserviajante.com/rio-de-janeiro/bares-da-tijuca-e-grande-tijuca/", "Salete, Dida, Noo, On Tap"],
    [12, "Os Melhores do Rio - Padarias Tijuca", "https://osmelhoresdorio.wordpress.com/2018/07/05/as-melhores-padarias-da-tijuca/", "Padaria Santa Marta, Confeitaria Rita de Cássia"],
    [13, "CNN Brasil - Retrospectiva 2025 Novos Restaurantes Rio", "https://www.cnnbrasil.com.br/viagemegastronomia/gastronomia/retrospectiva-2025-os-novos-restaurantes-do-rio-de-janeiro/", "Bal.Clan, Madame Olympe, Ophelia"],
    [14, "Time Out RJ - Melhores Restaurantes Leblon/Ipanema", "https://www.timeout.com/pt/rio-de-janeiro/restaurantes/os-melhores-restaurantes-em-ipanema", "Sushi Leblon, Ipanema"],
    [15, "Judice Araújo - Novos Restaurantes Leblon", "https://blog.judicearaujo.com.br/novos-restaurantes-no-leblon-conheca-as-7-novidades-gastronomicas-do-bairro/", "ÏT Ristorante, Taberna Rainha"],
    [16, "You Must Go - Restaurantes Ipanema", "https://youmustgo.com.br/restaurantes-em-ipanema-novidades-e-classicos-do-bairro/", "ToTo, Ferro e Farinha, Francese"],
    [17, "Ipanema Inn Blog", "https://blog.ipanemainn.com.br/en/restaurants-and-bars-in-ipanema-and-leblon/", "Quitéria, Cedilha, Madame Olympe"],
    [18, "Promoview - H&M Rio expansão 2026", "https://www.promoview.com.br/hm-rio-ativacoes-abertura-loja-2026", "Plano expansão H&M Rio"],
    [19, "Giro News - H&M expansão", "https://gironews.com/redes-shopping/hm-inicia-expansao-fora-de-sao-paulo-com-primeira-loja-no-rio-de-janeiro/", "H&M expansão BR 2026"],
    [20, "S.Mag.al - ALO Rio", "https://www.smag.al/2026/04/marca-de-activewear-premium-inaugura-primeira-loja-no-rio-e-reforca-expansao-no-brasil/", "ALO Activewear VillageMall"],
    [21, "FashionNetwork - NV expansão", "https://br.fashionnetwork.com/news/Nv-inaugura-loja-com-novo-conceito-em-belo-horizonte-e-preve-abertura-de-mais-tres-ainda-em-2024,1680403.html", "NV plano expansão RJ"],
    [22, "Shopify - 10 marcas DTC 2026", "https://www.shopify.com/br/blog/marcas-dtc", "Linus, Basico.com, Amaro, Duas Design, Zerezes"],
    [23, "Jornal DR1 - Plaza Play infantil", "https://jornaldr1.com.br/plaza-niteroi-inaugura-espaco-infantil-gratuito-com-programacao-especial/", "Saturação lazer infantil"],
    [24, "Infomoney - BR Malls expansão Plaza 2013", "https://www.infomoney.com.br/negocios/br-malls-anuncia-expansao-do-shopping-plaza-niteroi/", "Histórico produtividade Plaza"],
    [25, "Wanderlog - Best Restaurants Niteroi", "https://wanderlog.com/list/geoCategory/75579/where-to-eat-best-restaurants-in-niteroi", "Cantón Chifa, Tenore"],
    [26, "Arranjos Express", "https://arranjosexpress.com.br/lojas/loja-shopping-plaza-niteroi/", "Confirmação loja Arranjos"],
]

for i, row in enumerate(fontes, start=4):
    for col_idx, val in enumerate(row, 1):
        cell = ws.cell(row=i, column=col_idx, value=val)
        cell.font = FONT_BODY
        cell.alignment = ALIGN_L
        cell.border = BORDER
        if i % 2 == 0:
            cell.fill = FILL_ALT

for col, w in zip("ABCD", [5, 50, 80, 45]):
    ws.column_dimensions[col].width = w


# Freeze panes
for sheet_name in wb.sheetnames:
    if sheet_name == "Resumo":
        continue
    s = wb[sheet_name]
    if sheet_name in ("Foyer Redev v4", "Street - Niteroi", "Street - Tijuca", "Street - Zona Sul"):
        s.freeze_panes = "A6"
    else:
        s.freeze_panes = "A4"

output_path = "/mnt/user-data/outputs/Plaza_Niteroi_Workflow1_Vacancy_to_Contract_v4.xlsx"
import os
os.makedirs(os.path.dirname(output_path), exist_ok=True)
wb.save(output_path)
print(f"OK: {output_path}")
print(f"Sheets: {len(wb.sheetnames)}")
for s in wb.sheetnames:
    print(f"  - {s}")
