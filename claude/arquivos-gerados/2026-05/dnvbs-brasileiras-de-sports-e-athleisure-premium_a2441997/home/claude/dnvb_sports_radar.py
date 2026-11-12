from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.hyperlink import Hyperlink

wb = Workbook()

# ============== SHEET 1: RANKING PRINCIPAL ==============
ws = wb.active
ws.title = "Ranking DNVB Sports"

# Estilos
header_font = Font(name="Arial", bold=True, color="FFFFFF", size=11)
header_fill = PatternFill("solid", start_color="1F3A5F")
tier_a_fill = PatternFill("solid", start_color="D4EDDA")
tier_b_fill = PatternFill("solid", start_color="FFF3CD")
tier_c_fill = PatternFill("solid", start_color="F8D7DA")
limit_fill = PatternFill("solid", start_color="E2E3E5")
center = Alignment(horizontal="center", vertical="center", wrap_text=True)
left = Alignment(horizontal="left", vertical="center", wrap_text=True)
thin = Side(border_style="thin", color="999999")
border = Border(left=thin, right=thin, top=thin, bottom=thin)

# Cabeçalhos
headers = [
    "Tier", "Marca", "Categoria", "Segmento", "Fundação",
    "Fundadores", "HQ/Cidade", "Seguidores IG",
    "Handle IG", "Link Instagram", "TikTok handle", "Link TikTok",
    "Website", "Lojas físicas", "Presença shopping",
    "Faturamento/projeção", "Posicionamento", "Diferencial",
    "Risco/Limite", "Fit shopping AB (1-5)",
    "Confiança da entrada (1-10)", "Última verificação", "Fontes"
]

for col, h in enumerate(headers, 1):
    c = ws.cell(row=1, column=col, value=h)
    c.font = header_font
    c.fill = header_fill
    c.alignment = center
    c.border = border

# Dados — 12 marcas defensáveis
data = [
    # Tier A
    {
        "tier": "A", "marca": "CHASE Brasil",
        "categoria": "Athleisure premium feminino",
        "segmento": "Wellness fashion / sports luxury",
        "fundacao": "2015",
        "fundadores": "Não confirmado publicamente",
        "hq": "Belo Horizonte, MG",
        "seguidores_ig": 265000,
        "handle_ig": "@chasebrasil",
        "link_ig": "https://www.instagram.com/chasebrasil/",
        "tiktok": "—", "link_tt": "",
        "site": "https://www.chasebrasil.com.br",
        "lojas": "1 boutique em BH",
        "shopping": "Sem presença em shopping (presença limitada)",
        "faturamento": "Crescimento 5.400% em 2 anos (autodeclarado, não auditado)",
        "posicionamento": "'It's not a sports brand' — luxury athleisure 100% nacional",
        "diferencial": "Estética premium, comunidade feminina engajada, branding diferenciado",
        "risco": "Marca opera há ~10 anos — não é 'emergente' no sentido estrito. Confirmar status de DNVB com leasing.",
        "fit": 5, "confianca": 7,
        "verificacao": "23/05/2026",
        "fontes": "Instagram oficial; Terra (abr/2024); Hooks Magazine (jan/2025)"
    },
    {
        "tier": "A", "marca": "PACE (+ DT2)",
        "categoria": "Streetwear performance + sportswear",
        "segmento": "Sports luxury / contemporary fashion",
        "fundacao": "2014 (PACE); jan/2025 (DT2)",
        "fundadores": "Felipe Matayoshi",
        "hq": "São Paulo, SP",
        "seguidores_ig": 188000,
        "handle_ig": "@pace",
        "link_ig": "https://www.instagram.com/pace/",
        "tiktok": "@pacecompany", "link_tt": "https://www.tiktok.com/@pacecompany",
        "site": "https://pacecompany.com.br",
        "lojas": "Flagship Alameda Itu 1466 (SP) + Café PACE",
        "shopping": "Pop-up no JK Iguatemi (nov/2025) — janela DNVB se fechando",
        "faturamento": "Não divulgado publicamente",
        "posicionamento": "Brazilian Okinawan Design — workwear híbrido com cultura asiática",
        "diferencial": "Forbes 30 Under 30 (2021); GQ Men of Year (2024); colabs ASICS, New Balance, Vans, Red Bull, Spotify",
        "risco": "Pop-up em JK Iguatemi sinaliza migração para shopping premium — janela de aquisição estreita",
        "fit": 5, "confianca": 8,
        "verificacao": "23/05/2026",
        "fontes": "Instagram/TikTok oficial; LinkedIn PACE Company; ELLE Brasil (mai/2024); Hypebeast100 Next"
    },
    {
        "tier": "A", "marca": "CARNAN",
        "categoria": "Streetwear premium (com ponte para running)",
        "segmento": "Contemporary fashion / street performance",
        "fundacao": "2018",
        "fundadores": "Paulo, Breno e Lucca (sócios cariocas)",
        "hq": "Rio de Janeiro (origem) + escritório em SP",
        "seguidores_ig": 140000,
        "handle_ig": "@carnan",
        "link_ig": "https://www.instagram.com/carnan/",
        "tiktok": "—", "link_tt": "",
        "site": "https://www.carnan.com.br",
        "lojas": "Flagship R. Cônego Eugênio Leite, 932 — Pinheiros, SP",
        "shopping": "Sem presença em shopping",
        "faturamento": "Não divulgado",
        "posicionamento": "Multiculturalismo, viagens, modelagens oversized, tecidos premium",
        "diferencial": "Colabs ASICS (running), Copacabana Palace, Rider; presença EUA + Oriente Médio; Je M'Appelle Brasil",
        "risco": "Mais streetwear que sports puro — incluir só se cluster aceitar híbrido lifestyle",
        "fit": 4, "confianca": 7,
        "verificacao": "23/05/2026",
        "fontes": "Instagram oficial; Steal The Look (abr/2025); Blog Adar (set/2025)"
    },
    {
        "tier": "A", "marca": "SIÉ Wear",
        "categoria": "Activewear premium creator-led",
        "segmento": "Wellness fashion / sports luxury",
        "fundacao": "~2024-2025",
        "fundadores": "Esther Marques (Creative Director) + Michelle Coleto (La Sirène)",
        "hq": "São Paulo, SP",
        "seguidores_ig": 36000,
        "handle_ig": "@sie.wear",
        "link_ig": "https://www.instagram.com/sie.wear/",
        "tiktok": "—", "link_tt": "",
        "site": "https://www.siewear.com",
        "lojas": "2 lojas dentro de academias SIX Sport Life: Itaim/SP, Vila Nova/SP, Lago Sul/BSB, Campinas",
        "shopping": "Sem presença em shopping (modelo atrelado a academias)",
        "faturamento": "R$ 7M projetado para 2026 (autodeclarado, Forbes abr/2026)",
        "posicionamento": "Wellness fashion premium — 'Move with soul. Move with SIÉ'",
        "diferencial": "Creator-led (fundadora 171K seguidores); ativações premium (Pinacoteca + Porsche abr/2026)",
        "risco": "Marca muito jovem (~1 ano); modelo dentro de academias pode dificultar tradução para shopping",
        "fit": 5, "confianca": 7,
        "verificacao": "23/05/2026",
        "fontes": "Instagram oficial; Forbes Brasil (abr/2026); Topview; GLP4 (abr/2026)"
    },
    # Tier B
    {
        "tier": "B", "marca": "AIMO (Always In Motion)",
        "categoria": "Running design-led",
        "segmento": "Running premium / wellness fashion",
        "fundacao": "Novembro de 2023",
        "fundadores": "Lorenzo e Daniela Parente",
        "hq": "São Paulo, SP",
        "seguidores_ig": 16000,
        "handle_ig": "@aimo",
        "link_ig": "https://www.instagram.com/aimo/",
        "tiktok": "—", "link_tt": "",
        "site": "https://www.alwaysinmotion.com.br",
        "lojas": "Flagship Rua Padre João Manuel (SP) + Casa AIMO (espaço comunidade)",
        "shopping": "Sem presença em shopping",
        "faturamento": "Não divulgado",
        "posicionamento": "Running culture clean, design-led, comunidade",
        "diferencial": "Corridas gratuitas regulares; estética minimalista; Casa AIMO como hub",
        "risco": "Comunidade ainda pequena (~16K); marca jovem, tração em construção",
        "fit": 4, "confianca": 7,
        "verificacao": "23/05/2026",
        "fontes": "Instagram oficial; The Game Collective (set/2025); site alwaysinmotion.com.br"
    },
    {
        "tier": "B", "marca": "BAD RUNNING",
        "categoria": "Athleisure running cultural",
        "segmento": "Running / athleisure",
        "fundacao": "Novembro de 2024",
        "fundadores": "Bruno Bocchese, Duda di Pietro, Luiza Campanelli, Jana Borges",
        "hq": "São Paulo, SP",
        "seguidores_ig": 16000,
        "handle_ig": "@bad__running",
        "link_ig": "https://www.instagram.com/bad__running/",
        "tiktok": "—", "link_tt": "",
        "site": "https://badrunning.com",
        "lojas": "Sem loja fixa; pop-up na VEJA Oscar Freire (ago/2025)",
        "shopping": "Sem presença em shopping",
        "faturamento": "Não divulgado",
        "posicionamento": "'Runners by accident' — Extraordinary outfits for ordinary runners",
        "diferencial": "Tecidos 100% nacionais sem poliéster; tamanhos P ao XXG; ecossistema 'Bad Sports' anunciado",
        "risco": "Marca muito recente (1 ano); ainda construindo tração",
        "fit": 4, "confianca": 7,
        "verificacao": "23/05/2026",
        "fontes": "Instagram oficial; Projeto Draft (fev/2025); Webrun (ago/2025); The Game Collective"
    },
    {
        "tier": "B", "marca": "Cotton Project + High Minded",
        "categoria": "Streetwear + activewear acessível",
        "segmento": "Performance lifestyle",
        "fundacao": "Cotton Project >10 anos; High Minded recente",
        "fundadores": "Rafael Varandas",
        "hq": "São Paulo, SP",
        "seguidores_ig": 51000,
        "handle_ig": "@cottonproject / @highmindedpeople",
        "link_ig": "https://www.instagram.com/cottonproject/",
        "tiktok": "—", "link_tt": "",
        "site": "https://cottonproject.com.br",
        "lojas": "Cotton Project tem lojas próprias; High Minded e-commerce",
        "shopping": "Cotton Project já em alguns shoppings — atenção ao recorte",
        "faturamento": "Não divulgado",
        "posicionamento": "High Minded: ponte streetwear-running com pegada acessível",
        "diferencial": "Sócio também opera Miradouro Hotel; ecossistema lifestyle",
        "risco": "Cotton Project NÃO é DNVB no sentido estrito. High Minded é linha pequena ainda (~3.4K)",
        "fit": 3, "confianca": 6,
        "verificacao": "23/05/2026",
        "fontes": "Instagram oficial; ELLE Brasil (mai/2024); FFW (abr/2024)"
    },
    # Tier C
    {
        "tier": "C", "marca": "Dies Mercuri",
        "categoria": "Running premium sustentável",
        "segmento": "Running premium / wellness fashion",
        "fundacao": "2025",
        "fundadores": "Time franco-brasileiro",
        "hq": "São Paulo, SP",
        "seguidores_ig": 1938,
        "handle_ig": "@_diesmercuri",
        "link_ig": "https://www.instagram.com/_diesmercuri/",
        "tiktok": "—", "link_tt": "",
        "site": "https://diesmercuri.com",
        "lojas": "E-commerce; sem loja física",
        "shopping": "Sem presença em shopping",
        "faturamento": "Não divulgado",
        "posicionamento": "Running premium com repair service e sustentabilidade",
        "diferencial": "Posicionamento eco-luxury; equipe internacional",
        "risco": "Estágio embrionário (<2K seguidores); incluir como watch-list",
        "fit": 3, "confianca": 6,
        "verificacao": "23/05/2026",
        "fontes": "Instagram oficial; site diesmercuri.com; The Game Collective (set/2025)"
    },
]

# Casos limítrofes (incluídos com fundo cinza para contexto)
limitrofes = [
    {
        "tier": "LIMITE", "marca": "Insider Store",
        "categoria": "Smartwear / tech apparel",
        "segmento": "Athleisure performance",
        "fundacao": "2017",
        "fundadores": "Carolina Matsuse e Yuri Gricheno",
        "hq": "São Paulo, SP",
        "seguidores_ig": 2000000,
        "handle_ig": "@insiderstore",
        "link_ig": "https://www.instagram.com/insiderstore/",
        "tiktok": "Não ativo", "link_tt": "",
        "site": "https://www.insiderstore.com.br",
        "lojas": "Loja física no Morumbi Shopping (out/2025)",
        "shopping": "JÁ EM SHOPPING — fora do recorte DNVB puro",
        "faturamento": "R$400M em 2024; projeção R$600M em 2025",
        "posicionamento": "Smart wear / tecnologia têxtil / grafeno",
        "diferencial": "Maior marca brasileira de essenciais com tecnologia",
        "risco": "Já saiu do modelo DNVB; expansão própria para shopping em curso",
        "fit": 2, "confianca": 9,
        "verificacao": "23/05/2026",
        "fontes": "Instagram oficial; Exame (out/2025); Bloomberg Línea (out/2025); blog Insider"
    },
    {
        "tier": "LIMITE", "marca": "Cariuma",
        "categoria": "Sneakers sustentáveis",
        "segmento": "Footwear / streetwear",
        "fundacao": "2018",
        "fundadores": "David Python e Fernando Porto (Harvard MBA)",
        "hq": "Singapura (HQ legal pós-aquisição); origem RJ",
        "seguidores_ig": 898000,
        "handle_ig": "@cariuma",
        "link_ig": "https://www.instagram.com/cariuma/",
        "tiktok": "—", "link_tt": "",
        "site": "https://www.cariuma.com",
        "lojas": "Pop-ups internacionais (Tóquio dez/2025)",
        "shopping": "Pop-ups globais; sem flagship em shopping BR",
        "faturamento": "US$16M captados; adquirida pelo ZZ Mall (out/2025)",
        "posicionamento": "Sustainable sneakers — 2 árvores plantadas por par vendido",
        "diferencial": "Marca global com origem brasileira; forte na cena de skate",
        "risco": "NÃO É MAIS DNVB BRASILEIRA — adquirida e com HQ em Singapura",
        "fit": 2, "confianca": 9,
        "verificacao": "23/05/2026",
        "fontes": "Instagram oficial; CBInsights/Crunchbase; Wikipedia Cariuma; Iguatemi 365"
    },
    {
        "tier": "LIMITE", "marca": "Cajubrasil",
        "categoria": "Fashion fitness / athleisure",
        "segmento": "Activewear feminino",
        "fundacao": "2005",
        "fundadores": "Não divulgado publicamente",
        "hq": "Brasil",
        "seguidores_ig": 449000,
        "handle_ig": "@cajubrasil",
        "link_ig": "https://www.instagram.com/cajubrasil/",
        "tiktok": "—", "link_tt": "",
        "site": "https://www.cajubrasil.com.br",
        "lojas": "Modelo B2B; revendedores em 45+ países",
        "shopping": "Vendida em multimarcas; sem flagship DNVB",
        "faturamento": "Não divulgado",
        "posicionamento": "Fashion fitness 100% brasileira; exportação para 45 países",
        "diferencial": "20 anos de operação; tecidos com tecnologia",
        "risco": "NÃO É DNVB (B2B/atacado, 20 anos de mercado)",
        "fit": 2, "confianca": 8,
        "verificacao": "23/05/2026",
        "fontes": "Instagram oficial; Amazon; site cajubrasil.com.br"
    },
]

all_rows = data + limitrofes

# Escreve dados
for i, row in enumerate(all_rows, start=2):
    values = [
        row["tier"], row["marca"], row["categoria"], row["segmento"], row["fundacao"],
        row["fundadores"], row["hq"], row["seguidores_ig"],
        row["handle_ig"], row["link_ig"], row["tiktok"], row["link_tt"],
        row["site"], row["lojas"], row["shopping"],
        row["faturamento"], row["posicionamento"], row["diferencial"],
        row["risco"], row["fit"], row["confianca"],
        row["verificacao"], row["fontes"]
    ]
    for col, v in enumerate(values, 1):
        c = ws.cell(row=i, column=col, value=v)
        c.alignment = left if col not in (1, 8, 20, 21) else center
        c.font = Font(name="Arial", size=10)
        c.border = border
        # cor por tier
        if row["tier"] == "A":
            c.fill = tier_a_fill
        elif row["tier"] == "B":
            c.fill = tier_b_fill
        elif row["tier"] == "C":
            c.fill = tier_c_fill
        else:
            c.fill = limit_fill

    # Hyperlinks reais
    ig_cell = ws.cell(row=i, column=10)
    if row["link_ig"]:
        ig_cell.hyperlink = row["link_ig"]
        ig_cell.font = Font(name="Arial", size=10, color="0563C1", underline="single")

    tt_cell = ws.cell(row=i, column=12)
    if row["link_tt"]:
        tt_cell.hyperlink = row["link_tt"]
        tt_cell.font = Font(name="Arial", size=10, color="0563C1", underline="single")

    site_cell = ws.cell(row=i, column=13)
    if row["site"].startswith("http"):
        site_cell.hyperlink = row["site"]
        site_cell.font = Font(name="Arial", size=10, color="0563C1", underline="single")

    # formato número seguidores
    ws.cell(row=i, column=8).number_format = '#,##0'

# Larguras de coluna
widths = [8, 25, 28, 28, 12, 32, 22, 14, 28, 38, 18, 38, 38, 38, 35, 38, 38, 42, 42, 12, 14, 14, 50]
for i, w in enumerate(widths, 1):
    ws.column_dimensions[get_column_letter(i)].width = w

# Altura das linhas
ws.row_dimensions[1].height = 32
for i in range(2, len(all_rows) + 2):
    ws.row_dimensions[i].height = 90

# Congelar primeira linha e primeiras colunas
ws.freeze_panes = "C2"

# Filtro automático
ws.auto_filter.ref = f"A1:{get_column_letter(len(headers))}{len(all_rows)+1}"


# ============== SHEET 2: LEGENDA E METODOLOGIA ==============
ws2 = wb.create_sheet("Metodologia")

meta = [
    ["DNVB Sports Brasil — Radar 2026", ""],
    ["Última atualização", "23 de maio de 2026"],
    ["Confiança geral do levantamento", "6,5/10 (FLAG, abaixo de 7)"],
    ["", ""],
    ["LEGENDA DE TIERS", ""],
    ["Tier A (verde)", "Alta confiança — comunidade verificada, mídia especializada, fit forte para shopping AB"],
    ["Tier B (amarelo)", "Confiança média — tração inicial sólida mas comunidade ainda em construção"],
    ["Tier C (vermelho)", "Watch-list — estágio embrionário (<5K seguidores), monitorar"],
    ["LIMITE (cinza)", "Fora do recorte DNVB (já em shopping, adquirida ou B2B)"],
    ["", ""],
    ["O QUE FOI VERIFICADO", ""],
    ["Contagem de seguidores no Instagram", "Acesso direto à página oficial (snapshot maio/2026)"],
    ["Existência da marca", "Site oficial + mídia especializada"],
    ["Presença física", "Site oficial + matérias datadas"],
    ["Fundadores", "Mídia especializada (Forbes, Exame, ELLE, etc.)"],
    ["", ""],
    ["O QUE NÃO FOI VERIFICADO", ""],
    ["Taxa de engajamento real (likes/seguidor)", "Requer HypeAuditor, Modash ou Stilingue"],
    ["Crescimento de seguidores nos últimos 12 meses", "Requer série histórica que não está disponível publicamente"],
    ["Faturamento auditado", "Números marcados 'autodeclarado' são da própria marca, sem auditoria"],
    ["Conversão de e-commerce / repeat rate", "Não disponível publicamente"],
    ["", ""],
    ["LIMITAÇÕES CONHECIDAS", ""],
    ["Viés amostral", "Provavelmente existem 5-15 marcas relevantes não capturadas no levantamento, especialmente regionais fora do eixo SP-RJ, masculinas puras e lançadas em 2026"],
    ["Categoria 'engajamento'", "Sem dados de taxa de interação real — a ordenação usa proxy de tamanho de comunidade + força de marca + fit para shopping"],
    ["Definição de DNVB", "Linha cinza: SIÉ tem lojas em academias, AIMO tem flagship, PACE tem pop-up em shopping. Critério aplicado: ainda predominantemente digital + sem expansão massiva por shoppings"],
    ["", ""],
    ["PARA ELEVAR CONFIANÇA PARA 8+", ""],
    ["1. Contratar análise via Modash/HypeAuditor", "Custo aproximado: R$ 500-2.000/mês por seat"],
    ["2. Validar com leasing teams de shoppings AB", "Iguatemi, JK Iguatemi, JHSF, Multiplan, brMalls"],
    ["3. Field research nas ruas-âncora", "Oscar Freire, Vila Madalena, Itaim Bibi, Leblon, Jardins"],
    ["4. Cruzar com Google Trends + Strava data", "Para validar awareness e fit com cultura de corrida"],
]

ws2.column_dimensions["A"].width = 42
ws2.column_dimensions["B"].width = 80

for i, (k, v) in enumerate(meta, 1):
    a = ws2.cell(row=i, column=1, value=k)
    b = ws2.cell(row=i, column=2, value=v)
    a.font = Font(name="Arial", bold=True, size=10)
    b.font = Font(name="Arial", size=10)
    a.alignment = Alignment(vertical="top", wrap_text=True)
    b.alignment = Alignment(vertical="top", wrap_text=True)
    if i == 1:
        a.font = Font(name="Arial", bold=True, size=14, color="FFFFFF")
        a.fill = header_fill
        b.fill = header_fill
    if k in ("LEGENDA DE TIERS", "O QUE FOI VERIFICADO", "O QUE NÃO FOI VERIFICADO",
            "LIMITAÇÕES CONHECIDAS", "PARA ELEVAR CONFIANÇA PARA 8+"):
        a.font = Font(name="Arial", bold=True, size=11, color="FFFFFF")
        a.fill = PatternFill("solid", start_color="4A6FA5")
        b.fill = PatternFill("solid", start_color="4A6FA5")

# Excluídas obrigatórias
ws3 = wb.create_sheet("Excluídas")
ws3.column_dimensions["A"].width = 30
ws3.column_dimensions["B"].width = 70

excluidas = [
    ["EXCLUÍDAS DO LEVANTAMENTO", "Motivo"],
    ["Track&Field", "Plenamente em shopping, marca tradicional consolidada"],
    ["Live!", "Em múltiplos shoppings"],
    ["Nike Brasil", "Multinacional, fora do recorte"],
    ["Adidas Brasil", "Multinacional, fora do recorte"],
    ["Centauro", "Varejo omnichannel tradicional"],
    ["Fila", "Multinacional consolidada"],
    ["Under Armour", "Multinacional"],
    ["Olympikus", "Marca tradicional brasileira em expansão massiva"],
    ["Lupo Sport", "Tradicional, vendida em multimarcas"],
    ["Alto Giro", "Em múltiplos shoppings"],
    ["Five Athletic", "Em expansão por franquias — fora do recorte DNVB"],
    ["Lauf", "Vendida em Centauro e outros omnichannel"],
    ["Vestem", "Fundada em 2010, modelo de revendedores"],
    ["Cariuma", "Adquirida em 2025; HQ Singapura (ver aba Ranking — Limítrofe)"],
    ["Insider Store", "Já em Morumbi Shopping desde out/2025 (ver aba Ranking — Limítrofe)"],
    ["Cajubrasil", "Modelo B2B/atacado, fundada 2005 (ver aba Ranking — Limítrofe)"],
]
for i, (k, v) in enumerate(excluidas, 1):
    a = ws3.cell(row=i, column=1, value=k)
    b = ws3.cell(row=i, column=2, value=v)
    a.font = Font(name="Arial", bold=(i==1), size=10)
    b.font = Font(name="Arial", size=10)
    a.alignment = Alignment(vertical="top", wrap_text=True)
    b.alignment = Alignment(vertical="top", wrap_text=True)
    a.border = border
    b.border = border
    if i == 1:
        a.fill = header_fill
        b.fill = header_fill
        a.font = Font(name="Arial", bold=True, color="FFFFFF", size=11)
        b.font = Font(name="Arial", bold=True, color="FFFFFF", size=11)

wb.save("/mnt/user-data/outputs/DNVB_Sports_Brasil_Radar.xlsx")
print("OK")
