from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = Workbook()

# Estilos compartilhados
header_font = Font(name="Arial", bold=True, color="FFFFFF", size=11)
header_fill = PatternFill("solid", start_color="1F3A5F")
section_fill = PatternFill("solid", start_color="4A6FA5")
ok_fill = PatternFill("solid", start_color="D4EDDA")
warn_fill = PatternFill("solid", start_color="FFF3CD")
out_fill = PatternFill("solid", start_color="F8D7DA")
neutral_fill = PatternFill("solid", start_color="E2E3E5")
center = Alignment(horizontal="center", vertical="center", wrap_text=True)
left = Alignment(horizontal="left", vertical="center", wrap_text=True)
thin = Side(border_style="thin", color="999999")
border = Border(left=thin, right=thin, top=thin, bottom=thin)
arial10 = Font(name="Arial", size=10)
link_font = Font(name="Arial", size=10, color="0563C1", underline="single")


# ===================== SHEET 1: MARCAS APROVADAS =====================
ws = wb.active
ws.title = "Aprovadas (critério estrito)"

headers = [
    "#", "Marca", "Categoria", "Segmento", "Fundação",
    "Fundadores", "HQ/Cidade", "Seguidores IG",
    "Handle IG", "Link Instagram", "TikTok", "Link TikTok",
    "Website", "Loja física atual (verificada)", "Em shopping?",
    "Posicionamento", "Diferencial", "Risco/Limite",
    "Fit shopping AB (1-5)", "Confiança da entrada (1-10)",
    "Última verificação", "Fontes"
]

for col, h in enumerate(headers, 1):
    c = ws.cell(row=1, column=col, value=h)
    c.font = header_font
    c.fill = header_fill
    c.alignment = center
    c.border = border

# 7 marcas que passaram no critério estrito (BR + sem loja em shopping)
# Ordenadas por seguidores IG
aprovadas = [
    {
        "marca": "PACE", "categoria": "Streetwear performance + sportswear",
        "segmento": "Sports luxury / contemporary fashion",
        "fundacao": "2014",
        "fundadores": "Felipe Matayoshi",
        "hq": "São Paulo, SP",
        "seguidores_ig": 188000,
        "handle_ig": "@pace",
        "link_ig": "https://www.instagram.com/pace/",
        "tiktok": "@pacecompany",
        "link_tt": "https://www.tiktok.com/@pacecompany",
        "site": "https://pacecompany.com.br",
        "loja_fisica": "Flagship Alameda Itu, 1466 - Cerqueira César/SP + Café PACE (mesma rua)",
        "em_shopping": "Não — apenas pop-up temporário no JK Iguatemi em nov/2025 (não é loja permanente)",
        "posicionamento": "Brazilian Okinawan Design — workwear híbrido",
        "diferencial": "Felipe Matayoshi (Forbes 30 Under 30 2021; GQ Men of Year 2024); colabs ASICS, New Balance, TikTok, Spotify, Red Bull; presente em Dover Street Market (Paris/NY/LA/Singapura)",
        "risco": "Risco alto de migrar para shopping em breve — pop-up no JK já testou o mercado; janela de aquisição estreita",
        "fit": 5, "confianca": 9,
        "verificacao": "23/05/2026",
        "fontes": "Site oficial pacecompany.com.br/pages/sobre; Instagram oficial; Threads sneakersmobproject; LinkedIn PACE"
    },
    {
        "marca": "CLASS",
        "categoria": "Streetwear sportlife (luxury skate)",
        "segmento": "Street performance / contemporary fashion",
        "fundacao": "2014",
        "fundadores": "Eric Cesar + Rafaela Sayuri",
        "hq": "Santo André, SP",
        "seguidores_ig": 170000,
        "handle_ig": "@class___official",
        "link_ig": "https://www.instagram.com/class___official/",
        "tiktok": "—", "link_tt": "",
        "site": "https://class-official.com",
        "loja_fisica": "R. Padre Vieira, 588 - Santo André/SP (única loja)",
        "em_shopping": "Não — apenas pop-up em Lisboa (jun/2024) e parcerias em multimarcas",
        "posicionamento": "Simplicity for Original Minds — sportlife do ABC paulista",
        "diferencial": "Recente colab com adidas (Megaride S2 + F50 Spider, 2026); colabs Rider, Nike; presença em lojas de prestígio internacionais",
        "risco": "Vinculação a skate/streetwear pode limitar tradução para fitness/wellness shopping AB. Verificar se atrai público affluent que shopping busca.",
        "fit": 4, "confianca": 8,
        "verificacao": "23/05/2026",
        "fontes": "Instagram oficial; LinkedIn CLASS official; ELLE Brasil (out/2022); FFW (ago/2023); ISMO (mai/2026)"
    },
    {
        "marca": "CARNAN",
        "categoria": "Streetwear premium (ponte para running via colabs)",
        "segmento": "Contemporary fashion / street performance",
        "fundacao": "2018",
        "fundadores": "Paulo, Breno e Lucca (cariocas)",
        "hq": "Rio de Janeiro (origem) + escritório em SP",
        "seguidores_ig": 140000,
        "handle_ig": "@carnan",
        "link_ig": "https://www.instagram.com/carnan/",
        "tiktok": "—", "link_tt": "",
        "site": "https://www.carnan.com.br",
        "loja_fisica": "Flagship R. Cônego Eugênio Leite, 932 - Pinheiros/SP (única loja)",
        "em_shopping": "Não — exclusivamente rua + presença em lojas no exterior (EUA, Oriente Médio)",
        "posicionamento": "Multiculturalismo, viagens, modelagens oversized, tecidos premium",
        "diferencial": "Colabs ASICS (running 2024), Copacabana Palace, Rider; expansão internacional ativa; integra Je M'Appelle Brasil em Paris",
        "risco": "Mais streetwear que sports puro — incluir só se cluster aceitar híbrido lifestyle",
        "fit": 4, "confianca": 9,
        "verificacao": "23/05/2026",
        "fontes": "Site oficial carnan.com.br; Instagram oficial; Steal The Look (abr/2025); IAM Inteligência em Moda"
    },
    {
        "marca": "SIÉ Wear",
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
        "loja_fisica": "Dentro de academias SIX Sport Life: Itaim Bibi/SP, Vila Nova/SP, Lago Sul/BSB, Campinas/SP",
        "em_shopping": "Não — modelo dentro de academias (não shopping)",
        "posicionamento": "'Move with soul. Move with SIÉ' — wellness fashion premium",
        "diferencial": "Creator-led (fundadora 171K seguidores); ativações premium (Pinacoteca + Porsche abr/2026); R$7M projetado 2026 (autodeclarado)",
        "risco": "Marca muito jovem (~1 ano); modelo atrelado a academias pode dificultar tradução para shopping",
        "fit": 5, "confianca": 8,
        "verificacao": "23/05/2026",
        "fontes": "Instagram oficial; Forbes Brasil (abr/2026); GLP4; Topview"
    },
    {
        "marca": "AIMO (Always In Motion)",
        "categoria": "Running design-led",
        "segmento": "Running premium / wellness fashion",
        "fundacao": "Novembro/2023",
        "fundadores": "Lorenzo e Daniela Parente",
        "hq": "São Paulo, SP",
        "seguidores_ig": 16000,
        "handle_ig": "@aimo",
        "link_ig": "https://www.instagram.com/aimo/",
        "tiktok": "—", "link_tt": "",
        "site": "https://www.alwaysinmotion.com.br",
        "loja_fisica": "Flagship Rua Padre João Manuel/SP + Casa AIMO (espaço comunidade)",
        "em_shopping": "Não — apenas rua",
        "posicionamento": "Running culture clean, design-led",
        "diferencial": "Corridas gratuitas regulares; estética minimalista; Casa AIMO como hub de comunidade",
        "risco": "Comunidade ainda pequena (16K); marca jovem em construção",
        "fit": 4, "confianca": 8,
        "verificacao": "23/05/2026",
        "fontes": "Site oficial alwaysinmotion.com.br; Instagram oficial; The Game Collective (set/2025)"
    },
    {
        "marca": "BAD RUNNING",
        "categoria": "Athleisure running cultural",
        "segmento": "Running / athleisure",
        "fundacao": "Novembro/2024",
        "fundadores": "Bruno Bocchese, Duda di Pietro, Luiza Campanelli, Jana Borges",
        "hq": "São Paulo, SP",
        "seguidores_ig": 16000,
        "handle_ig": "@bad__running",
        "link_ig": "https://www.instagram.com/bad__running/",
        "tiktok": "—", "link_tt": "",
        "site": "https://badrunning.com",
        "loja_fisica": "Sem loja fixa — pop-up na VEJA Oscar Freire (ago/2025) + parcerias temporárias",
        "em_shopping": "Não — DNVB pura e-commerce + pop-ups esporádicos",
        "posicionamento": "'Runners by accident' — Extraordinary outfits for ordinary runners",
        "diferencial": "Tecidos 100% nacionais sem poliéster; tamanhos P ao XXG; ecossistema 'Bad Sports' anunciado; parceria On Running",
        "risco": "Marca muito recente (1 ano); ainda construindo tração",
        "fit": 4, "confianca": 8,
        "verificacao": "23/05/2026",
        "fontes": "Site oficial badrunning.com; Instagram oficial; Projeto Draft (fev/2025); Webrun (ago/2025); Steal The Look"
    },
    {
        "marca": "Dies Mercuri",
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
        "loja_fisica": "E-commerce only",
        "em_shopping": "Não — DNVB pura",
        "posicionamento": "Running premium com repair service e sustentabilidade",
        "diferencial": "Eco-luxury; equipe internacional; reparo de produtos",
        "risco": "Estágio embrionário (<2K seguidores); watch-list, não candidato imediato",
        "fit": 3, "confianca": 7,
        "verificacao": "23/05/2026",
        "fontes": "Site oficial diesmercuri.com; Instagram oficial; The Game Collective (set/2025)"
    },
]

for i, row in enumerate(aprovadas, start=2):
    values = [
        i - 1, row["marca"], row["categoria"], row["segmento"], row["fundacao"],
        row["fundadores"], row["hq"], row["seguidores_ig"],
        row["handle_ig"], row["link_ig"], row["tiktok"], row["link_tt"],
        row["site"], row["loja_fisica"], row["em_shopping"],
        row["posicionamento"], row["diferencial"], row["risco"],
        row["fit"], row["confianca"], row["verificacao"], row["fontes"]
    ]
    for col, v in enumerate(values, 1):
        c = ws.cell(row=i, column=col, value=v)
        c.alignment = left if col not in (1, 8, 19, 20) else center
        c.font = arial10
        c.border = border
        c.fill = ok_fill
    ws.cell(row=i, column=8).number_format = '#,##0'

    if row["link_ig"]:
        ig = ws.cell(row=i, column=10)
        ig.hyperlink = row["link_ig"]
        ig.font = link_font
    if row["link_tt"]:
        tt = ws.cell(row=i, column=12)
        tt.hyperlink = row["link_tt"]
        tt.font = link_font
    if row["site"].startswith("http"):
        st = ws.cell(row=i, column=13)
        st.hyperlink = row["site"]
        st.font = link_font

widths = [5, 24, 30, 30, 12, 32, 22, 14, 26, 38, 18, 38, 36, 42, 38, 38, 42, 42, 12, 14, 14, 50]
for i, w in enumerate(widths, 1):
    ws.column_dimensions[get_column_letter(i)].width = w

ws.row_dimensions[1].height = 32
for i in range(2, len(aprovadas) + 2):
    ws.row_dimensions[i].height = 110

ws.freeze_panes = "C2"
ws.auto_filter.ref = f"A1:{get_column_letter(len(headers))}{len(aprovadas)+1}"


# ===================== SHEET 2: REMOVIDAS/LIMÍTROFES =====================
ws2 = wb.create_sheet("Removidas no refino")

remove_headers = ["Marca", "Status", "Motivo da remoção", "Seguidores IG",
                  "Link Instagram", "Detalhes", "Fontes"]
for col, h in enumerate(remove_headers, 1):
    c = ws2.cell(row=1, column=col, value=h)
    c.font = header_font
    c.fill = header_fill
    c.alignment = center
    c.border = border

removidas = [
    {
        "marca": "CHASE Brasil", "status": "REMOVIDA",
        "motivo": "JÁ TEM LOJA EM SHOPPING — BH Shopping, 4º Piso (Belvedere)",
        "seg": 265000, "ig": "https://www.instagram.com/chasebrasil/",
        "detalhes": "Site oficial lista 2 lojas: Lagoa Seca (rua, BH) E BH Shopping. Não cumpre o critério estrito 'sem loja em shopping'.",
        "fontes": "chasebrasil.com/pages/lojas-1; Instagram oficial",
        "fill": out_fill
    },
    {
        "marca": "Cotton Project + High Minded", "status": "REMOVIDA",
        "motivo": "Cotton Project não é DNVB (>10 anos, presença em varejo tradicional). High Minded ainda muito pequeno (~3.4K seguidores)",
        "seg": 51000, "ig": "https://www.instagram.com/cottonproject/",
        "detalhes": "Cotton Project é marca consolidada com várias lojas próprias. High Minded é submarca recente, sem tração suficiente para shopping AB premium.",
        "fontes": "Instagram oficial; ELLE Brasil (mai/2024)",
        "fill": warn_fill
    },
    {
        "marca": "Authen", "status": "LIMÍTROFE (não recomendada para o recorte)",
        "motivo": "Possui 4 franquias (BR + EUA) + presença em 500+ lojas multimarcas. Modelo já é varejo + wholesale, não DNVB pura.",
        "seg": 232000, "ig": "https://www.instagram.com/authenbrasil/",
        "detalhes": "Fundada por Christopher Spikes no Rio. Crescimento de 70% ao ano desde 2015. Forte para running feminino, mas migrou do modelo DNVB. Caso o cluster aceite 'marcas em expansão' (não estritamente DNVB), reavaliar.",
        "fontes": "Webrun (mai/2026); Esportividade (mai/2026); CBInsights; site authen.com.br",
        "fill": warn_fill
    },
    {
        "marca": "Insider Store", "status": "REMOVIDA",
        "motivo": "Loja física no Morumbi Shopping desde out/2025",
        "seg": 2000000, "ig": "https://www.instagram.com/insiderstore/",
        "detalhes": "Já saiu do modelo DNVB. Expansão própria para shopping em curso. R$400M em 2024.",
        "fontes": "Exame (out/2025); Bloomberg Línea (out/2025); blog Insider",
        "fill": out_fill
    },
    {
        "marca": "Cariuma", "status": "REMOVIDA",
        "motivo": "Adquirida pelo ZZ Mall em out/2025. HQ legal em Singapura. Não é mais marca brasileira no recorte.",
        "seg": 898000, "ig": "https://www.instagram.com/cariuma/",
        "detalhes": "Origem RJ, mas operação global pós-aquisição. Pop-ups internacionais (Tóquio dez/2025).",
        "fontes": "CBInsights/Crunchbase; Wikipedia Cariuma",
        "fill": out_fill
    },
    {
        "marca": "Cajubrasil", "status": "REMOVIDA",
        "motivo": "Modelo B2B/atacado, fundada em 2005 — não é DNVB",
        "seg": 449000, "ig": "https://www.instagram.com/cajubrasil/",
        "detalhes": "Vende em 45+ países via revendedores autorizados. Modelo wholesale tradicional.",
        "fontes": "Site oficial cajubrasil.com.br; Amazon",
        "fill": out_fill
    },
]

for i, row in enumerate(removidas, start=2):
    values = [row["marca"], row["status"], row["motivo"], row["seg"],
              row["ig"], row["detalhes"], row["fontes"]]
    for col, v in enumerate(values, 1):
        c = ws2.cell(row=i, column=col, value=v)
        c.alignment = left if col not in (4,) else center
        c.font = arial10
        c.border = border
        c.fill = row["fill"]
    ws2.cell(row=i, column=4).number_format = '#,##0'
    ig = ws2.cell(row=i, column=5)
    ig.hyperlink = row["ig"]
    ig.font = link_font

widths2 = [26, 38, 50, 14, 36, 55, 40]
for i, w in enumerate(widths2, 1):
    ws2.column_dimensions[get_column_letter(i)].width = w
ws2.row_dimensions[1].height = 32
for i in range(2, len(removidas) + 2):
    ws2.row_dimensions[i].height = 80


# ===================== SHEET 3: RESUMO E METODOLOGIA =====================
ws3 = wb.create_sheet("Metodologia")
ws3.column_dimensions["A"].width = 45
ws3.column_dimensions["B"].width = 90

meta = [
    ["DNVB Sports Brasil — Lista refinada (critério estrito)", ""],
    ["Última atualização", "23 de maio de 2026"],
    ["Confiança geral do levantamento", "7,5/10 (acima do threshold de 7)"],
    ["", ""],
    ["CRITÉRIO ESTRITO APLICADO", ""],
    ["1. Origem", "Marca brasileira (operação no Brasil)"],
    ["2. Sem loja em shopping", "Verificado caso a caso no site oficial e mídia especializada"],
    ["3. DNVB de fato", "Predominantemente digital, sem expansão massiva por shoppings ou wholesale"],
    ["4. Fit para shopping AB", "Estética/posicionamento compatíveis com público affluent"],
    ["", ""],
    ["O QUE MUDOU NO REFINO", ""],
    ["CHASE Brasil removida", "Foi a maior descoberta: o site oficial lista loja no BH Shopping (4º Piso, Belvedere). Não cumpre o critério estrito."],
    ["Authen NÃO incluída", "232K seguidores, mas tem 4 franquias + 500 multimarcas. Modelo de wholesale + varejo tradicional, não DNVB pura."],
    ["Cotton Project NÃO incluída", "Marca consolidada com várias lojas; High Minded (a linha de running) ainda é muito pequena (~3.4K)."],
    ["CLASS adicionada", "170K seguidores, loja única em Santo André (rua), colab adidas recente. Cumpre critério."],
    ["", ""],
    ["LISTA FINAL — 7 MARCAS APROVADAS", ""],
    ["Ordenadas por seguidores IG (proxy de comunidade)", ""],
    ["1. PACE (188K)", "Sports luxury, designer-led, Felipe Matayoshi — risco de migrar para shopping em breve"],
    ["2. CLASS (170K)", "Sportlife streetwear, colab adidas 2026"],
    ["3. CARNAN (140K)", "Streetwear premium com colabs running (ASICS)"],
    ["4. SIÉ Wear (36K)", "Wellness premium creator-led, em academias SIX"],
    ["5. AIMO (16K)", "Running design-led com Casa AIMO"],
    ["6. BAD RUNNING (16K)", "Athleisure cultural, runners by accident"],
    ["7. Dies Mercuri (~2K)", "Watch-list: running premium sustentável"],
    ["", ""],
    ["FIT SHOPPING AB — RANKING (1-5)", ""],
    ["5 (alto)", "PACE, SIÉ Wear"],
    ["4 (médio-alto)", "CLASS, CARNAN, AIMO, BAD RUNNING"],
    ["3 (médio)", "Dies Mercuri (watch-list)"],
    ["", ""],
    ["LIMITAÇÕES DESTE LEVANTAMENTO", ""],
    ["Sem dados de engajamento real", "Não tenho taxa de interação (likes/seguidor). 'Ranking' é por tamanho de comunidade + fit + DNVB status."],
    ["Sem dados de crescimento 12m", "Sem série histórica de seguidores"],
    ["Viés amostral", "Provavelmente perdi marcas regionais (Sul, Nordeste), masculinas puras e lançadas em 2026"],
    ["Pop-up vs loja permanente", "PACE fez pop-up em JK Iguatemi (nov/2025). Tratei como temporário porque a página de Lojas oficial não lista o JK. Reavaliar em 6 meses."],
    ["", ""],
    ["PRÓXIMOS PASSOS RECOMENDADOS", ""],
    ["1. Validar com leasing team", "Iguatemi, JK Iguatemi, JHSF, Multiplan, brMalls — eles têm visão do que está em pipeline"],
    ["2. Visita de campo", "Oscar Freire, Vila Madalena, Itaim, Pinheiros — onde essas marcas estão concentradas"],
    ["3. Métricas de engajamento", "Contratar Modash/HypeAuditor (R$500-2.000/mês) para taxa real"],
    ["4. Reavaliar PACE", "Em 3-6 meses, checar se o pop-up no JK virou loja permanente"],
]

for i, (k, v) in enumerate(meta, 1):
    a = ws3.cell(row=i, column=1, value=k)
    b = ws3.cell(row=i, column=2, value=v)
    a.font = Font(name="Arial", bold=True, size=10)
    b.font = arial10
    a.alignment = Alignment(vertical="top", wrap_text=True)
    b.alignment = Alignment(vertical="top", wrap_text=True)
    if i == 1:
        a.font = Font(name="Arial", bold=True, size=14, color="FFFFFF")
        a.fill = header_fill
        b.fill = header_fill
    if k in ("CRITÉRIO ESTRITO APLICADO", "O QUE MUDOU NO REFINO",
            "LISTA FINAL — 7 MARCAS APROVADAS", "FIT SHOPPING AB — RANKING (1-5)",
            "LIMITAÇÕES DESTE LEVANTAMENTO", "PRÓXIMOS PASSOS RECOMENDADOS"):
        a.font = Font(name="Arial", bold=True, size=11, color="FFFFFF")
        a.fill = section_fill
        b.fill = section_fill


# ===================== SHEET 4: EXCLUÍDAS A PRIORI =====================
ws4 = wb.create_sheet("Excluídas a priori")
ws4.column_dimensions["A"].width = 32
ws4.column_dimensions["B"].width = 75

excl_header = ws4.cell(row=1, column=1, value="EXCLUÍDAS DO ESCOPO (regra geral do briefing)")
excl_header2 = ws4.cell(row=1, column=2, value="Motivo")
for c in (excl_header, excl_header2):
    c.font = header_font
    c.fill = header_fill
    c.alignment = center
    c.border = border

excluidas = [
    ["Track&Field", "Marca tradicional consolidada em múltiplos shoppings"],
    ["Live!", "Em múltiplos shoppings"],
    ["Olympikus", "Marca tradicional brasileira em expansão massiva"],
    ["Nike Brasil", "Multinacional"],
    ["Adidas Brasil", "Multinacional"],
    ["Centauro", "Varejo omnichannel tradicional"],
    ["Fila", "Multinacional consolidada"],
    ["Under Armour", "Multinacional"],
    ["Lupo Sport", "Tradicional, vendida em multimarcas"],
    ["Alto Giro", "Em múltiplos shoppings"],
    ["Five Athletic", "Em expansão por franquias"],
    ["Lauf", "Vendida em Centauro e outros omnichannel"],
    ["Vestem", "Fundada em 2010, modelo de revendedores"],
    ["Reserva Sprint", "Linha esportiva de Reserva (já consolidada em shopping)"],
    ["PIET", "Streetwear consolidado, marca grande do segmento"],
    ["Sufgang", "Streetwear puro, sem ponte para sports"],
    ["Mad Enlatados", "Streetwear satírico, sem ponte para sports"],
    ["Disturb", "Streetwear/skate, sem ponte para sports"],
    ["Quadro Creations", "Streetwear puro"],
    ["DOD Alfaiataria", "Streetwear puro"],
]

for i, (k, v) in enumerate(excluidas, 2):
    a = ws4.cell(row=i, column=1, value=k)
    b = ws4.cell(row=i, column=2, value=v)
    a.font = arial10
    b.font = arial10
    a.alignment = left
    b.alignment = left
    a.border = border
    b.border = border
    a.fill = neutral_fill
    b.fill = neutral_fill

wb.save("/mnt/user-data/outputs/DNVB_Sports_Brasil_Refinado.xlsx")
print("OK")
