from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = Workbook()
ws = wb.active
ws.title = "Marcas Fitness Lutas BR"

# Cabeçalhos
headers = [
    "Marca",
    "Instagram (@)",
    "Seguidores IG",
    "Ano fundação",
    "Cidade/UF origem",
    "Sub-segmento luta",
    "Tipo de produto",
    "Fit cluster AB",
    "Confiança dado (1-10)",
    "Observação / fonte",
]

# Dados (ordenado por seguidores desc — top of pipe primeiro)
data = [
    # Marca, IG, Seguidores, Ano, Cidade, Sub-segmento, Produto, Fit AB, Confiança, Obs
    ["KVRA", "@kvraco", 235000, "~2010s (fundação exata n/d)", "São Paulo / SP",
     "BJJ + lifestyle + fitness", "Kimonos, rashguard, streetwear, calça/regata",
     "Alto", 8,
     "Marca de roupas/kimonos/acessórios; cofundada por Marcelo Baek, Guilherme Ferraz e Marcos Chae. Posicionamento lifestyle + jiu-jitsu. Fonte: PRNewswire 2021; bio @kvraco."],

    ["Atama", "@atamakimonos", 103000, "1989", "Rio de Janeiro / RJ",
     "BJJ (kimono-first)", "Kimonos, faixas, rashguard",
     "Médio (marca tradicional, menos lifestyle)", 9,
     "Fundada em 1989, vestiu Royce e Kyra Gracie. 100% brasileira, carioca, familiar. Fonte: roninwear.com, atama.com.br/blog, bio @atamakimonos."],

    ["Brazil Combat", "@brazilcombat", 99000, "1998", "Rio de Janeiro / RJ",
     "BJJ", "Kimonos, equipamentos, fightwear",
     "Médio", 9,
     "Desde 1998, Rio de Janeiro. Fonte: brazilcombat.com.br; brazilcombat.eu/pt/pages/sobre-nos."],

    ["Koral Fight Co.", "@koralfightco", 98000, "1997", "São Paulo / SP",
     "BJJ + MMA/muay thai/judô/boxe", "Kimonos, faixas, fightwear",
     "Médio-alto", 9,
     "Fundada em 1997 por Victor Costa em SP. Exporta para 25+ países. Fonte: roninwear.com, casadokimono.com.br, bio @koralfightco."],

    ["Red Nose Xtreme", "@rednose_oficial", 78000, "1996", "Brasil (não confirmada cidade)",
     "Xtreme: jiu-jitsu/MMA + surf/skate/skydive", "Roupas, calçados, óculos (licenciamento)",
     "Médio (mais lifestyle xtreme do que premium)", 8,
     "Criada em 1996 por Marcelo Leitão. ~30 empresas licenciadas. Foco em esportes radicais incluindo MMA e jiu-jitsu. Fonte: Wikipédia PT (Red Nose), LinkedIn da marca."],

    ["Pretorian", "@pretorianoficial", 60000, "2008-2009 (fontes divergem)", "São Paulo / SP",
     "MMA + muay thai + boxe + BJJ", "Luvas, protetores, equipamentos, lifestyle PTRN",
     "Médio (forte em equipamento; lifestyle em sub-marca)", 8,
     "Fundada por Ruy Drever. MundoDasMarcas indica 2008; Isto É Dinheiro 2009. Faturava R$75mi em 2013. Patrocinou UFC até 2013. Fonte: ISTOÉ Dinheiro 2014; MundoDasMarcas; FashionNetwork."],

    ["Keiko Sports", "@keiko_sports", 60000, "1988", "Brasil (Made in Brazil)",
     "BJJ (kimono-first)", "Kimonos, faixas, acessórios BJJ",
     "Médio", 9,
     "Operando desde 1988, 100% brasileira, produção em fábrica no Brasil. Fonte: keikousa.com/pages/about-us; ZoomInfo; bio @keiko_sports."],

    ["Dragão Kimonos", "@dragaokimonos", 45000, "1974", "São Paulo / SP",
     "Multi: BJJ + judô + taekwondo + karatê", "Kimonos para várias artes marciais",
     "Médio-baixo (tradicional, multi-modalidade)", 9,
     "Fundada em 1974 por Benildo Saba. Uma das mais antigas marcas brasileiras de kimonos. Fonte: kimonosdragao.com.br; kimonoparajiujitsu.com.br."],

    ["Vulkan (Brasil)", "@vulkanbrasil", 44000, "~2010-2011 (~15 anos em 2026)", "São Paulo / SP",
     "BJJ (kimono-first)", "Kimonos, faixas, no-gi, lifestyle",
     "Médio", 7,
     "Site informa '15 anos no mercado' em 2026; CNPJ 08.081.777/0001-30 (registro datado de 2007). Vulkan Fight Co. exporta. Fonte: vulkanfc.com/pagina/quem-somos; bio @vulkanbrasil."],

    ["Suerte Kimonos", "@suerte.kimonos", 44000, "Recente (DNVB, ano exato n/d)", "Brasil",
     "BJJ + lifestyle urbano", "Kimonos, rashguard, streetwear",
     "Alto (mais DNVB/urban do que a média da categoria)", 7,
     "Marca brasileira nova com posicionamento de jiu-jitsu como estilo de vida e estética contemporânea. Não consegui confirmar ano de fundação. Fonte: suertekimonos.com.br; bio @suerte.kimonos."],

    ["MKS Combat", "@mkscombat", 37000, "1994", "São Paulo / SP (CNPJ SP)",
     "Boxe + muay thai + kickboxing + BJJ", "Luvas, kimonos, judogi, equipamentos",
     "Médio (mais focada em equipamento)", 9,
     "Bio do IG informa 'Fighting since 1994'. Fonte: mksadidas.commercesuite.com.br; bio @mkscombat."],

    ["Storm Kimonos", "@stormkimonos", 32000, "1996", "Brasil",
     "BJJ (kimono-first premium)", "Kimonos técnicos, rashguard, no-gi",
     "Médio-alto (tem narrativa técnica/premium)", 8,
     "Fundada em 1996, atletas top como Romulo Barral e Cyborg Abreu. Bilíngue/global. Fonte: bjjfightgear.com; bio @stormkimonos."],

    ["Naja Extreme", "@najaextremeoficial", 17000, "n/d", "n/d",
     "Lutas em geral", "Kimonos, bermudas, luvas, acessórios",
     "Baixo-médio (mais mass-market)", 5,
     "Distribuída pela World Combat. Ano de fundação e cidade não confirmados em fontes públicas. Fonte: bio @najaextremeoficial."],
]

# Estilo do cabeçalho
header_font = Font(name="Arial", bold=True, color="FFFFFF", size=11)
header_fill = PatternFill("solid", start_color="1F4E78")
header_align = Alignment(horizontal="center", vertical="center", wrap_text=True)

# Borda
thin = Side(border_style="thin", color="BFBFBF")
border = Border(left=thin, right=thin, top=thin, bottom=thin)

# Escrever cabeçalhos
for col, h in enumerate(headers, 1):
    c = ws.cell(row=1, column=col, value=h)
    c.font = header_font
    c.fill = header_fill
    c.alignment = header_align
    c.border = border

# Escrever dados
data_font = Font(name="Arial", size=10)
data_align = Alignment(vertical="top", wrap_text=True)
alt_fill = PatternFill("solid", start_color="F2F2F2")

for r_idx, row in enumerate(data, 2):
    for c_idx, val in enumerate(row, 1):
        c = ws.cell(row=r_idx, column=c_idx, value=val)
        c.font = data_font
        c.alignment = data_align
        c.border = border
        if r_idx % 2 == 0:
            c.fill = alt_fill

# Largura das colunas
widths = [22, 22, 14, 18, 22, 32, 36, 22, 12, 70]
for i, w in enumerate(widths, 1):
    ws.column_dimensions[get_column_letter(i)].width = w

# Altura das linhas de dados (mais alto para wrap text)
for r in range(2, len(data) + 2):
    ws.row_dimensions[r].height = 70

ws.row_dimensions[1].height = 36

# Congelar primeira linha
ws.freeze_panes = "A2"

# Aba 2: nota metodológica
ws2 = wb.create_sheet("Nota metodológica")
notes = [
    "NOTA METODOLÓGICA — Marcas brasileiras de moda fitness voltada para lutas",
    "",
    "Critérios aplicados:",
    "• Segmento: moda fitness voltada para lutas (BJJ, MMA, muay thai, boxe, kickboxing)",
    "• Geografia: Brasil",
    "• Mínimo de seguidores no Instagram: 15.000",
    "• Quantidade alvo: 20",
    "• Cluster de shopping alvo: AB (médio-alto)",
    "• Ano mínimo: não definido pelo usuário; assumido 'universo amplo' (sem corte etário)",
    "",
    "Resultado: 13 marcas que atendem ao corte de 15K+ seguidores no Instagram",
    "(confirmados via busca em maio/2026, com link nas observações).",
    "",
    "Por que 13 e não 20:",
    "O nicho brasileiro de fightwear/luta é mais restrito que segmentos como athleisure",
    "ou moda íntima. A maioria das marcas brasileiras consolidadas são mais antigas",
    "(1974-2010) e focadas em equipamento (kimono, luvas). Não há um pipeline robusto",
    "de DNVBs pós-2020 com 15K+ seguidores no espaço de lutas no Brasil.",
    "",
    "Outras marcas relevantes pesquisadas mas DESCARTADAS pelo critério de origem:",
    "• Bull Terrier — japonesa (Hamamatsu, 2002)",
    "• Doguera — francesa",
    "• Hanran — francesa",
    "• Albino & Preto — americana (Signal Hill, CA), apesar de produzir no Brasil",
    "• Shoyoroll — americana (Los Alamitos, CA, 2006)",
    "• Top Ring — italiana",
    "• Tatami Fightwear — inglesa",
    "• Hayabusa — canadense",
    "• Venum — francesa",
    "",
    "Marcas brasileiras pesquisadas mas DESCARTADAS por Instagram < 15K:",
    "• BŌA Fightwear (~8K)",
    "• Aranha Kimonos (~1K-1,3K nos perfis encontrados)",
    "• LUTA Sportswear (~215 no IG principal; embora HQ em RJ)",
    "• Black Eagle Sports BR (não foi possível validar IG)",
    "",
    "Considerações para o cluster AB:",
    "Dentro da lista, as marcas com melhor fit para shoppings AB (médio-alto) são as que",
    "combinam (i) lifestyle + esporte (KVRA, Suerte, Storm, Koral) e (ii) posicionamento",
    "mais premium/técnico. Marcas mais mass-market ou predominantemente",
    "equipamento (Naja, Dragão multi-modalidade) tendem a fit mais médio-baixo.",
    "",
    "Confiança geral da planilha: 7/10. Pontos de atenção:",
    "• Ano de fundação de Pretorian: fontes divergem entre 2008 e 2009.",
    "• Ano exato de fundação de KVRA: não localizado em fonte primária pública.",
    "• Ano e cidade da Naja Extreme: não localizados em fonte pública confiável.",
    "• Seguidores são snapshot de maio/2026; podem flutuar.",
    "",
    "Fontes principais usadas para validação:",
    "Wikipédia (PT/EN), Instagram (bios e contadores oficiais), LinkedIn, sites oficiais",
    "(atama.com.br, koral.com.br, vulkanfc.com, brazilcombat.com.br, kimonosdragao.com.br,",
    "keikousa.com, pretorian.com, mksadidas.com.br, mundodasmarcas.blogspot.com,",
    "FashionNetwork, Isto É Dinheiro, PRNewswire).",
]

for i, line in enumerate(notes, 1):
    c = ws2.cell(row=i, column=1, value=line)
    c.font = Font(name="Arial", size=11, bold=(i == 1))
    c.alignment = Alignment(vertical="top", wrap_text=True)

ws2.column_dimensions["A"].width = 110

wb.save("/mnt/user-data/outputs/marcas_fightwear_brasil.xlsx")
print("OK")
