from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = Workbook()

# ---------- Sheet 1: Planilha de Marcas ----------
ws = wb.active
ws.title = "Marcas Musculação BR"

headers = [
    "#", "Marca", "@ Instagram", "Seguidores IG (~)", "Ano Fundação",
    "Cidade / UF", "Foco em Musculação", "Site", "Faixa Preço Camiseta (R$)",
    "Bate critério ≥15k?", "Bate critério ≥2018?", "Match estrito (4/4)",
    "Confiança Dados (1-10)", "Observações / Fonte"
]

# Tier A: matches strict criteria (Brazilian, musculação focus, 15k+, founded 2018+)
# Tier B: matches most but founded before 2018
# Tier C: matches most but follower count below or near 15k

brands = [
    # Tier A - Matches all 4 criteria
    {
        "marca": "Berzerk",
        "ig": "@berzerk.club",
        "seguidores": 733000,
        "ano": 2024,
        "cidade": "São Paulo / SP",
        "foco": "Alto (bodybuilding/oversized para academia)",
        "site": "berzerk.com.br",
        "preco": "~R$56-89 (kits)",
        "ge_15k": "Sim",
        "ge_2018": "Sim",
        "match_estrito": "SIM (4/4)",
        "confianca": 9,
        "obs": "CNPJ 58.300.838/0001-80 fundada 02/12/2024. Sócios ligados à Nerd Explosion. Usa imagem de fisiculturistas da Ironberg Alphaville. Fonte: Serasa/Econodata + Reclame Aqui."
    },
    {
        "marca": "ARMYBR",
        "ig": "@armybr.oficial",
        "seguidores": 256000,
        "ano": None,  # uncertain
        "cidade": "?",
        "foco": "Alto (performance/bodybuilder, 'Dress the Army Inside You')",
        "site": "armybr.com.br",
        "preco": "R$159-359",
        "ge_15k": "Sim",
        "ge_2018": "Provável",
        "match_estrito": "PROVÁVEL (3-4/4)",
        "confianca": 6,
        "obs": "256k IG verificado. Citada em Macho Moda jun/2025. Ano de fundação NÃO confirmado por CNPJ — incluída por reputação no nicho mas precisa validação."
    },
    {
        "marca": "American Crime",
        "ig": "@americancrimefitness",
        "seguidores": 74000,
        "ano": None,  # uncertain, article de 2022 menciona como já existente
        "cidade": "Maceió / AL",
        "foco": "Médio-Alto (mais forte no feminino, fitness/performance)",
        "site": "americancrime.com.br",
        "preco": "R$189+ (masc)",
        "ge_15k": "Sim",
        "ge_2018": "Provável",
        "match_estrito": "PROVÁVEL (3-4/4)",
        "confianca": 6,
        "obs": "Sediada em Maceió/AL. Citada na S.Mag em 2022. Macho Moda nota que tem mais opção feminina que masculina. Ano de fundação não validado por CNPJ."
    },
    {
        "marca": "Surty",
        "ig": "@surtybrasil",
        "seguidores": 14000,
        "ano": 2018,
        "cidade": "Campina Grande / PB",
        "foco": "Médio (moda fitness com linha musculação)",
        "site": "surty.com.br",
        "preco": "Variado",
        "ge_15k": "Quase (14k)",
        "ge_2018": "Sim",
        "match_estrito": "PARCIAL (3/4 - seguidores quase no threshold)",
        "confianca": 8,
        "obs": "Fundada 2018, base em Campina Grande/PB. 14k seguidores no IG (1k abaixo do critério). Fonte: CB Insights."
    },
    {
        "marca": "Donna Maromba Fitness",
        "ig": "@donnamarombafitness",
        "seguidores": 14000,
        "ano": 2019,
        "cidade": "Vilar dos Teles / RJ",
        "foco": "Alto (moda fitness feminina 'maromba')",
        "site": "donnamarombafitness.com.br",
        "preco": "?",
        "ge_15k": "Quase (14k)",
        "ge_2018": "Sim",
        "match_estrito": "PARCIAL (3/4 - seguidores quase no threshold)",
        "confianca": 8,
        "obs": "Fundada em 11/02/2019. Foco feminino. 14k seguidores (1k abaixo do critério). Fonte: site oficial + IG."
    },

    # Tier B - Matches most but founded before 2018 (referência do nicho mesmo fora do critério)
    {
        "marca": "Bulking",
        "ig": "@bulkingoficial",
        "seguidores": 285000,
        "ano": 2013,
        "cidade": "Goiânia / GO",
        "foco": "Muito Alto (referência bodybuilder no Brasil)",
        "site": "bulking.com.br",
        "preco": "R$97-125",
        "ge_15k": "Sim",
        "ge_2018": "NÃO (2013)",
        "match_estrito": "NÃO (3/4 - fora do corte 2018)",
        "confianca": 10,
        "obs": "CNPJ 17.788.352/0001-56, fundada 20/03/2013. Referência da categoria — incluída para visão completa. Fonte: Serasa."
    },
    {
        "marca": "Alpha Co.",
        "ig": "@usealphaco",
        "seguidores": 692000,
        "ano": 2017,
        "cidade": "Salvador / BA",
        "foco": "Alto (oversized, dry-fit, foco academia)",
        "site": "usealphaco.com.br",
        "preco": "R$39-99 (kits R$119)",
        "ge_15k": "Sim",
        "ge_2018": "NÃO (2017)",
        "match_estrito": "NÃO (3/4 - 1 ano antes do corte)",
        "confianca": 9,
        "obs": "CNPJ 27.672.847/0001-79 (Salvador/BA, abertura 2017). Maior IG do nicho. Fonte: site oficial."
    },
    {
        "marca": "Fit Urban",
        "ig": "@fiturbanoficial",
        "seguidores": 967000,
        "ano": 2017,
        "cidade": "?",
        "foco": "Médio-Alto ('legado construído na sala de musculação')",
        "site": "fiturban.com.br",
        "preco": "?",
        "ge_15k": "Sim",
        "ge_2018": "NÃO (2017)",
        "match_estrito": "NÃO (3/4)",
        "confianca": 8,
        "obs": "Site oficial: 'desde 2017'. 967k seguidores. Foco mais feminino. Cidade-sede não verificada por CNPJ."
    },
    {
        "marca": "Mith",
        "ig": "@mithoficial",
        "seguidores": 340000,
        "ano": 2015,
        "cidade": "Maringá / PR",
        "foco": "Muito Alto (coleção 'Golden Era' bodybuilding, Arnold/Zane)",
        "site": "mithoficial.com.br",
        "preco": "R$57-100",
        "ge_15k": "Sim",
        "ge_2018": "NÃO (2015/2016)",
        "match_estrito": "NÃO (3/4 - fora do corte)",
        "confianca": 8,
        "obs": "Mith Confeccoes Ltda CNPJ 26.542.380/0001-80 fundada 16/11/2016 (algumas fontes citam 2015). Forte referência bodybuilder."
    },
    {
        "marca": "Sieg Sports",
        "ig": "@siegoficial",
        "seguidores": None,  # small, ~7k FB
        "ano": 2015,
        "cidade": "Fortaleza / CE",
        "foco": "Médio (mistura academia + praia)",
        "site": "siegsports.com.br",
        "preco": "R$99-139",
        "ge_15k": "Não / não confirmado",
        "ge_2018": "NÃO (2015)",
        "match_estrito": "NÃO (2/4)",
        "confianca": 7,
        "obs": "CNPJ 22.877.478/0001-37 fundada 18/07/2015 em Fortaleza/CE. 7.4k Facebook likes; IG provavelmente também abaixo do critério. Fonte: Serasa."
    },

    # Tier C - Outras referências do nicho (parcial match ou marca tangente)
    {
        "marca": "Crown Training",
        "ig": "@crowntraining",
        "seguidores": None,  # ~6k TikTok visível, IG não confirmado
        "ano": None,
        "cidade": "?",
        "foco": "Alto (focada em bodybuilder)",
        "site": "crowntraining.com.br",
        "preco": "R$74-89",
        "ge_15k": "Provavelmente não",
        "ge_2018": "Provável (marca jovem)",
        "match_estrito": "NÃO (1-2/4 confirmados)",
        "confianca": 4,
        "obs": "6.3k seguidores no TikTok. CNPJ não localizado em busca. Citada como 'marca nova e promissora' em Macho Moda jun/2025. Dados de IG não confirmados."
    },
    {
        "marca": "Body&Fit",
        "ig": "@bodyefitbsb",
        "seguidores": 114000,
        "ano": None,
        "cidade": "Taguatinga / DF",
        "foco": "Médio (multimarcas + private label)",
        "site": "?",
        "preco": "?",
        "ge_15k": "Sim",
        "ge_2018": "?",
        "match_estrito": "INCERTO (mais reseller que DNVB)",
        "confianca": 5,
        "obs": "Loja física + online em Taguatinga/Brasília. Pode ser mais multimarca/atacado que marca própria DNVB."
    },
    {
        "marca": "Growth Supplements (vestuário)",
        "ig": "@growthsuplementos",
        "seguidores": None,  # large, but supplement-first
        "ano": None,
        "cidade": "?",
        "foco": "Baixo-Médio (vestuário é extensão da marca de suplemento)",
        "site": "gsuplementos.com.br",
        "preco": "R$66+",
        "ge_15k": "Sim (na marca-mãe)",
        "ge_2018": "NÃO",
        "match_estrito": "NÃO - extensão de marca de suplemento",
        "confianca": 6,
        "obs": "Vestuário é linha secundária. Citada por Macho Moda mas não é pure-play DNVB de roupa."
    },
    {
        "marca": "Black Skull USA (vestuário)",
        "ig": "@blackskullofficialus",
        "seguidores": 31000,
        "ano": None,
        "cidade": "?",
        "foco": "Baixo-Médio (vestuário é extensão de suplemento)",
        "site": "blackskullusa.com.br",
        "preco": "?",
        "ge_15k": "Sim",
        "ge_2018": "NÃO",
        "match_estrito": "NÃO - extensão de marca de suplemento",
        "confianca": 6,
        "obs": "Marca de suplemento com linha de roupa secundária. Não é DNVB pure-play."
    },
    {
        "marca": "Marombada Moda Fitness",
        "ig": "@marombadamodafitness",
        "seguidores": None,
        "ano": 2015,
        "cidade": "?",
        "foco": "Médio (atacado/fábrica de moda fitness)",
        "site": "lojamarombada.com.br",
        "preco": "?",
        "ge_15k": "Não confirmado",
        "ge_2018": "NÃO (CNPJ 20.812.809 sugere ~2014)",
        "match_estrito": "NÃO",
        "confianca": 5,
        "obs": "Fábrica + loja física. Mais perfil atacado/wholesale. CNPJ 20.812.809/0001-25."
    },
    {
        "marca": "LabellaMafia",
        "ig": "@labellamafia",
        "seguidores": None,  # 1M+ FB
        "ano": 2007,
        "cidade": "Santa Catarina (Brasil)",
        "foco": "Alto historicamente (nasceu no bodybuilding)",
        "site": "labellamafia.com.br",
        "preco": "?",
        "ge_15k": "Sim",
        "ge_2018": "NÃO (2007)",
        "match_estrito": "NÃO (3/4 - muito antes do corte)",
        "confianca": 9,
        "obs": "Marca matriarca do nicho fitness brasileiro. Fundada 2007, base SC. Cresceu vestindo fisiculturistas. Hoje mais ampla que só musculação."
    },
    {
        "marca": "Caju Brasil",
        "ig": "@cajubrasiloficial",
        "seguidores": None,  # large
        "ano": None,  # pre-2018
        "cidade": "?",
        "foco": "Médio (athleisure premium, não exclusivo musculação)",
        "site": "cajubrasil.com",
        "preco": "Premium",
        "ge_15k": "Sim",
        "ge_2018": "NÃO",
        "match_estrito": "NÃO",
        "confianca": 5,
        "obs": "Marca conhecida no fitness brasileiro, mas perfil mais athleisure/fashion que musculação pura."
    },
    {
        "marca": "Track&Field",
        "ig": "@trackfield",
        "seguidores": None,  # large
        "ano": 1988,
        "cidade": "São Paulo / SP",
        "foco": "Baixo-Médio (esportivo amplo, não focado musculação)",
        "site": "tf.com.br",
        "preco": "Premium",
        "ge_15k": "Sim",
        "ge_2018": "NÃO (1988)",
        "match_estrito": "NÃO",
        "confianca": 9,
        "obs": "Listada na B3 (TFCO4). Tradicional, foco esportivo amplo. NÃO é DNVB nem foco musculação — incluída só como referência de mercado."
    },
    {
        "marca": "Live!",
        "ig": "@livesports",
        "seguidores": None,  # large
        "ano": 1994,
        "cidade": "São Paulo / SP",
        "foco": "Baixo (athleisure feminino premium)",
        "site": "liveatleisure.com",
        "preco": "Premium",
        "ge_15k": "Sim",
        "ge_2018": "NÃO (1994)",
        "match_estrito": "NÃO",
        "confianca": 9,
        "obs": "Marca grande e tradicional. Não é foco musculação — referência de mercado apenas."
    },
    {
        "marca": "Bodybuilders Suplementos (vestuário)",
        "ig": "@bodybuilders.oficial",
        "seguidores": 32000,
        "ano": 2001,
        "cidade": "?",
        "foco": "Baixo (vestuário é extensão)",
        "site": "bodybuilders.com.br",
        "preco": "?",
        "ge_15k": "Sim",
        "ge_2018": "NÃO (2001)",
        "match_estrito": "NÃO",
        "confianca": 7,
        "obs": "Marca de suplementos com linha de roupa. Não é DNVB pure-play."
    },
]

# Write headers
header_fill = PatternFill('solid', start_color='1F4E78')
header_font = Font(bold=True, color='FFFFFF', name='Arial', size=11)
center = Alignment(horizontal='center', vertical='center', wrap_text=True)
left_wrap = Alignment(horizontal='left', vertical='top', wrap_text=True)

for col_idx, h in enumerate(headers, 1):
    c = ws.cell(row=1, column=col_idx, value=h)
    c.fill = header_fill
    c.font = header_font
    c.alignment = center

# Write data
for row_idx, b in enumerate(brands, 2):
    ws.cell(row=row_idx, column=1, value=row_idx - 1)
    ws.cell(row=row_idx, column=2, value=b["marca"])
    ws.cell(row=row_idx, column=3, value=b["ig"])
    ws.cell(row=row_idx, column=4, value=b["seguidores"] if b["seguidores"] else "n/d")
    ws.cell(row=row_idx, column=5, value=b["ano"] if b["ano"] else "n/d")
    ws.cell(row=row_idx, column=6, value=b["cidade"])
    ws.cell(row=row_idx, column=7, value=b["foco"])
    ws.cell(row=row_idx, column=8, value=b["site"])
    ws.cell(row=row_idx, column=9, value=b["preco"])
    ws.cell(row=row_idx, column=10, value=b["ge_15k"])
    ws.cell(row=row_idx, column=11, value=b["ge_2018"])
    ws.cell(row=row_idx, column=12, value=b["match_estrito"])
    ws.cell(row=row_idx, column=13, value=b["confianca"])
    ws.cell(row=row_idx, column=14, value=b["obs"])

# Coloring: green for strict match, yellow for partial, orange/red for non-match
green_fill = PatternFill('solid', start_color='C6EFCE')
yellow_fill = PatternFill('solid', start_color='FFEB9C')
orange_fill = PatternFill('solid', start_color='FCE4D6')
red_fill = PatternFill('solid', start_color='F4CCCC')

for row_idx, b in enumerate(brands, 2):
    match_val = b["match_estrito"]
    if match_val.startswith("SIM"):
        fill = green_fill
    elif match_val.startswith("PROVÁVEL") or match_val.startswith("PARCIAL"):
        fill = yellow_fill
    elif "INCERTO" in match_val:
        fill = orange_fill
    else:
        fill = red_fill
    ws.cell(row=row_idx, column=12).fill = fill

# Apply general formatting (font + alignment) to all data
for row in ws.iter_rows(min_row=2, max_row=len(brands) + 1, min_col=1, max_col=len(headers)):
    for cell in row:
        cell.font = Font(name='Arial', size=10)
        cell.alignment = left_wrap

# Column widths
widths = [4, 26, 24, 17, 13, 22, 36, 27, 22, 19, 19, 28, 13, 60]
for i, w in enumerate(widths, 1):
    ws.column_dimensions[get_column_letter(i)].width = w

# Freeze header
ws.freeze_panes = 'A2'

# Set row height for header
ws.row_dimensions[1].height = 38

# ---------- Sheet 2: Notas e Metodologia ----------
ws2 = wb.create_sheet("Notas & Metodologia")
ws2.column_dimensions['A'].width = 110

intro_lines = [
    ("CONTEXTO DO PEDIDO", True),
    ("Critérios definidos pelo usuário:", False),
    ("• Segmento: moda fitness voltada para musculação no Brasil", False),
    ("• Mínimo de seguidores no Instagram: 15.000", False),
    ("• Ano mínimo de fundação: 2018", False),
    ("• Quantidade de marcas: 20", False),
    ("", False),
    ("CONCLUSÃO DA PESQUISA — IMPORTANTE LER", True),
    ("O cruzamento estrito dos 4 critérios (BR + foco musculação + 15k+ + fundada >=2018)", False),
    ("é restritivo. Após pesquisa ampla, identifiquei apenas 1 marca que claramente cumpre", False),
    ("os 4 critérios (Berzerk). Outras 4 cumprem 3 dos 4 critérios com alguma ressalva.", False),
    ("As marcas mais relevantes do nicho de musculação no Brasil (Bulking, Alpha Co, Mith,", False),
    ("Fit Urban, LabellaMafia) foram fundadas ANTES de 2018.", False),
    ("", False),
    ("Por isso a planilha foi estruturada em camadas, com sinalização clara em cada linha:", False),
    ("  • VERDE   = SIM (4/4) - bate todos os critérios", False),
    ("  • AMARELO = PROVÁVEL / PARCIAL (3/4)", False),
    ("  • LARANJA = INCERTO", False),
    ("  • VERMELHO = NÃO BATE (referências do nicho fora do corte)", False),
    ("", False),
    ("COMO CADA CRITÉRIO FOI VERIFICADO", True),
    ("• Seguidores: contagem direta no perfil oficial do Instagram (data: maio/2026)", False),
    ("• Ano de fundação: prioridade para CNPJ na Receita Federal (via Serasa/Econodata).", False),
    ("  Onde não foi possível confirmar por CNPJ, marca-se 'n/d' e confiança rebaixada.", False),
    ("• Cidade/UF: endereço da matriz no CNPJ ou no rodapé do site", False),
    ("• Foco em musculação: análise da comunicação da marca (site, IG, posicionamento)", False),
    ("", False),
    ("RESSALVAS E LIMITAÇÕES", True),
    ("• Não validei manualmente todos os CNPJs — algumas marcas (ARMYBR, American Crime,", False),
    ("  Fit Urban) têm ano de fundação inferido por comunicação pública, não por Receita Federal.", False),
    ("• Faturamento, rodada de investimento e colabs (colunas extras sugeridas no doc base)", False),
    ("  NÃO foram preenchidas pois não há dados públicos confiáveis para a maioria das marcas", False),
    ("  privadas brasileiras desse porte. Para isso precisaria acesso a Pitchbook/CB Insights pago.", False),
    ("• Marcas com 'n/d' em seguidores: o perfil oficial não foi localizado com certeza", False),
    ("  ou os números variam muito entre perfis. Não inventei números.", False),
    ("", False),
    ("RECOMENDAÇÕES", True),
    ("1. Se o objetivo é prospecção de marcas para um shopping cluster premium:", False),
    ("   Berzerk, Alpha Co, Mith e Bulking são as mais relevantes — apesar da ressalva de ano.", False),
    ("2. Se 'fundada >=2018' for critério estrito, o universo praticamente se resume a Berzerk,", False),
    ("   Surty e Donna Maromba. Sugiro flexibilizar para >=2015 para ter pipeline real.", False),
    ("3. Para a próxima rodada, faria sentido pedir um corte separado por gênero", False),
    ("   (masc. bodybuilder vs. fem. maromba) — a dinâmica das marcas é bem diferente.", False),
    ("", False),
    ("CONFIANÇA GLOBAL DA PESQUISA: 7/10", True),
    ("Pontos fortes: dados de IG e CNPJ verificados onde possível.", False),
    ("Pontos fracos: ano de fundação de algumas marcas não validado por CNPJ; faturamento", False),
    ("e rodada de investimento estão fora do alcance de pesquisa pública.", False),
]

row = 1
for text, is_header in intro_lines:
    c = ws2.cell(row=row, column=1, value=text)
    if is_header:
        c.font = Font(bold=True, name='Arial', size=12, color='1F4E78')
        c.fill = PatternFill('solid', start_color='DDEBF7')
    else:
        c.font = Font(name='Arial', size=10)
    c.alignment = Alignment(horizontal='left', vertical='top', wrap_text=True)
    row += 1

ws2.freeze_panes = 'A2'

wb.save('/mnt/user-data/outputs/Marcas_Moda_Fitness_Musculacao_BR.xlsx')
print("Saved successfully")
