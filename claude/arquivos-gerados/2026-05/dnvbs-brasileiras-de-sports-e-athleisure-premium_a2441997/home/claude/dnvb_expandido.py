from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = Workbook()

# Estilos
header_font = Font(name="Arial", bold=True, color="FFFFFF", size=11)
header_fill = PatternFill("solid", start_color="1F3A5F")
section_fill = PatternFill("solid", start_color="4A6FA5")
ok_fill = PatternFill("solid", start_color="D4EDDA")
warn_fill = PatternFill("solid", start_color="FFF3CD")
watch_fill = PatternFill("solid", start_color="FFE4B5")
out_fill = PatternFill("solid", start_color="F8D7DA")
neutral_fill = PatternFill("solid", start_color="E2E3E5")
center = Alignment(horizontal="center", vertical="center", wrap_text=True)
left = Alignment(horizontal="left", vertical="center", wrap_text=True)
thin = Side(border_style="thin", color="999999")
border = Border(left=thin, right=thin, top=thin, bottom=thin)
arial10 = Font(name="Arial", size=10)
link_font = Font(name="Arial", size=10, color="0563C1", underline="single")


# ===================== SHEET 1: MARCAS =====================
ws = wb.active
ws.title = "Ranking expandido"

headers = [
    "#", "Tier", "Marca", "Categoria", "Segmento",
    "Fundação", "Fundadores", "HQ/Cidade",
    "Estado origem seguidores (estimado)", "Base inferência",
    "Seguidores IG", "Handle IG", "Link Instagram",
    "TikTok", "Link TikTok", "Website",
    "Loja física atual", "Em shopping?",
    "Posicionamento", "Diferencial", "Risco/Limite",
    "Fit shopping AB (1-5)", "Confiança da entrada (1-10)",
    "Sugestão de shopping AB",
    "Última verificação", "Fontes"
]

for col, h in enumerate(headers, 1):
    c = ws.cell(row=1, column=col, value=h)
    c.font = header_font
    c.fill = header_fill
    c.alignment = center
    c.border = border

# ============ TIER A — 4 marcas com critério estrito + alta confiança ============
# ============ TIER B — 3 marcas com critério estrito + média confiança ============
# ============ TIER C — Watch-list (1-2 marcas pequenas) ============
# ============ LIMÍTROFES — 2 marcas que não cumprem 100% mas merecem nota ============

marcas = [
    # TIER A — cumprem critério estrito, alta confiança
    {
        "tier": "A", "marca": "PACE",
        "categoria": "Streetwear performance + sportswear",
        "segmento": "Sports luxury / contemporary fashion",
        "fundacao": "2014",
        "fundadores": "Felipe Matayoshi",
        "hq": "São Paulo, SP",
        "estado_seg": "SP (estimado predominante)",
        "base_inferencia": "HQ em SP; flagship em Cerqueira César; pop-up no JK Iguatemi; eventos majoritariamente em SP. Marca global com tração em NY, LA, Tóquio - mas core no Brasil em SP",
        "seguidores_ig": 188000, "handle_ig": "@pace",
        "link_ig": "https://www.instagram.com/pace/",
        "tiktok": "@pacecompany",
        "link_tt": "https://www.tiktok.com/@pacecompany",
        "site": "https://pacecompany.com.br",
        "loja_fisica": "Alameda Itu, 1466 - Cerqueira César/SP + Café PACE",
        "em_shopping": "Não — apenas pop-up temporário JK Iguatemi (nov/2025)",
        "posicionamento": "Brazilian Okinawan Design — workwear híbrido",
        "diferencial": "Felipe Matayoshi (Forbes 30 Under 30; GQ Men of Year); colabs ASICS/NB/Spotify/Red Bull; Dover Street Market global",
        "risco": "Risco alto de migrar para shopping em 6-12 meses — pop-up no JK já validou",
        "fit": 5, "confianca": 9,
        "sugestao_shopping": "JK Iguatemi, Iguatemi SP, Cidade Jardim — fit imediato",
        "verificacao": "23/05/2026",
        "fontes": "pacecompany.com.br; Instagram; LinkedIn; ELLE Brasil; GQ"
    },
    {
        "tier": "A", "marca": "CLASS",
        "categoria": "Streetwear sportlife (luxury skate)",
        "segmento": "Street performance / contemporary fashion",
        "fundacao": "2014",
        "fundadores": "Eric Cesar + Rafaela Sayuri",
        "hq": "Santo André, SP",
        "estado_seg": "SP (estimado forte)",
        "base_inferencia": "Origem ABC Paulista; loja única em Santo André; pop-up internacional foi Lisboa (não Brasil); identidade visceralmente ligada ao ABC paulista (metalurgia, periferia SP)",
        "seguidores_ig": 170000, "handle_ig": "@class___official",
        "link_ig": "https://www.instagram.com/class___official/",
        "tiktok": "—", "link_tt": "",
        "site": "https://class-official.com",
        "loja_fisica": "R. Padre Vieira, 588 - Santo André/SP (loja única)",
        "em_shopping": "Não — apenas pop-up em Lisboa (jun/2024)",
        "posicionamento": "Simplicity for Original Minds — sportlife do ABC paulista",
        "diferencial": "Colab adidas 2026 (Megaride S2 + F50 Spider); colabs Rider/Nike; presença em lojas de prestígio internacionais",
        "risco": "Identidade muito ligada a skate/ABC pode limitar fit com público affluent shopping AB tradicional",
        "fit": 4, "confianca": 8,
        "sugestao_shopping": "JK Iguatemi (estilo PACE), Pátio Higienópolis, Shopping Iguatemi SP",
        "verificacao": "23/05/2026",
        "fontes": "Instagram oficial; LinkedIn CLASS; ELLE Brasil; FFW; ISMO (mai/2026)"
    },
    {
        "tier": "A", "marca": "CARNAN",
        "categoria": "Streetwear premium (com running via colabs)",
        "segmento": "Contemporary fashion / street performance",
        "fundacao": "2018",
        "fundadores": "Paulo, Breno, Lucca",
        "hq": "Rio de Janeiro (origem) + escritório SP",
        "estado_seg": "RJ + SP (estimado, distribuído)",
        "base_inferencia": "Origem carioca; flagship em SP (Pinheiros); colabs com marcas globais e cariocas (Copacabana Palace); operação internacional ativa nos EUA/Oriente Médio",
        "seguidores_ig": 140000, "handle_ig": "@carnan",
        "link_ig": "https://www.instagram.com/carnan/",
        "tiktok": "—", "link_tt": "",
        "site": "https://www.carnan.com.br",
        "loja_fisica": "R. Cônego Eugênio Leite, 932 - Pinheiros/SP (loja única)",
        "em_shopping": "Não — só rua + lojas no exterior",
        "posicionamento": "Multiculturalismo, viagens, modelagens oversized, tecidos premium",
        "diferencial": "Colabs ASICS (running 2024), Copacabana Palace, Rider; Je M'Appelle Brasil em Paris",
        "risco": "Mais streetwear que sports puro — pegada masculina pode não captar público feminino premium fitness",
        "fit": 4, "confianca": 9,
        "sugestao_shopping": "Shopping Leblon (RJ), JK Iguatemi, Cidade Jardim — fit premium",
        "verificacao": "23/05/2026",
        "fontes": "carnan.com.br; Instagram oficial; Steal The Look (abr/2025)"
    },
    {
        "tier": "A", "marca": "SIÉ Wear",
        "categoria": "Activewear premium creator-led",
        "segmento": "Wellness fashion / sports luxury",
        "fundacao": "~2024-2025",
        "fundadores": "Esther Marques + Michelle Coleto",
        "hq": "São Paulo, SP",
        "estado_seg": "SP + DF (estimado forte)",
        "base_inferencia": "HQ SP; 3 das 4 lojas em SP (Itaim, Vila Nova, Campinas); 1 em Brasília (Lago Sul); fundadora Esther Marques baseada em SP; eventos premium em SP",
        "seguidores_ig": 36000, "handle_ig": "@sie.wear",
        "link_ig": "https://www.instagram.com/sie.wear/",
        "tiktok": "—", "link_tt": "",
        "site": "https://www.siewear.com",
        "loja_fisica": "Dentro de academias SIX Sport Life: Itaim/SP, Vila Nova/SP, Lago Sul/BSB, Campinas/SP",
        "em_shopping": "Não — modelo em academias (não shopping)",
        "posicionamento": "Move with soul. Move with SIÉ — wellness fashion premium",
        "diferencial": "Creator-led (fundadora 171K); ativações premium (Pinacoteca + Porsche); R$7M projetado 2026",
        "risco": "Marca muito jovem; modelo em academias pode resistir tradução para shopping",
        "fit": 5, "confianca": 8,
        "sugestao_shopping": "JK Iguatemi, Cidade Jardim, Iguatemi Brasília (Lago Sul) — alinhamento perfeito com público SIX",
        "verificacao": "23/05/2026",
        "fontes": "Instagram oficial; Forbes Brasil (abr/2026); GLP4"
    },

    # TIER B — cumprem critério estrito, média confiança/tração menor
    {
        "tier": "B", "marca": "AIMO (Always In Motion)",
        "categoria": "Running design-led",
        "segmento": "Running premium / wellness fashion",
        "fundacao": "Novembro/2023",
        "fundadores": "Lorenzo e Daniela Parente",
        "hq": "São Paulo, SP",
        "estado_seg": "SP (estimado predominante)",
        "base_inferencia": "Flagship + Casa AIMO em SP; corridas gratuitas em SP; comunidade ativa local",
        "seguidores_ig": 16000, "handle_ig": "@aimo",
        "link_ig": "https://www.instagram.com/aimo/",
        "tiktok": "—", "link_tt": "",
        "site": "https://www.alwaysinmotion.com.br",
        "loja_fisica": "Flagship Rua Padre João Manuel/SP + Casa AIMO",
        "em_shopping": "Não",
        "posicionamento": "Running culture clean, design-led",
        "diferencial": "Corridas gratuitas; Casa AIMO como hub; estética minimalista",
        "risco": "Comunidade ainda pequena (16K); jovem em construção",
        "fit": 4, "confianca": 8,
        "sugestao_shopping": "Pátio Higienópolis, JK Iguatemi — público corredor premium SP",
        "verificacao": "23/05/2026",
        "fontes": "alwaysinmotion.com.br; Instagram; The Game Collective"
    },
    {
        "tier": "B", "marca": "BAD RUNNING",
        "categoria": "Athleisure running cultural",
        "segmento": "Running / athleisure",
        "fundacao": "Novembro/2024",
        "fundadores": "Bruno Bocchese, Duda di Pietro, Luiza Campanelli, Jana Borges",
        "hq": "São Paulo, SP",
        "estado_seg": "SP (estimado predominante)",
        "base_inferencia": "Pop-up em SP (Oscar Freire); fundadores SP; eventos SP; parcerias com VEJA e On Running ativadas em SP",
        "seguidores_ig": 16000, "handle_ig": "@bad__running",
        "link_ig": "https://www.instagram.com/bad__running/",
        "tiktok": "—", "link_tt": "",
        "site": "https://badrunning.com",
        "loja_fisica": "Sem loja fixa — pop-up VEJA Oscar Freire ago/2025",
        "em_shopping": "Não — e-commerce + pop-ups",
        "posicionamento": "Runners by accident — Extraordinary outfits for ordinary runners",
        "diferencial": "Tecidos 100% nacionais sem poliéster; ecossistema Bad Sports; parceria On Running",
        "risco": "Marca muito recente (1 ano); tração inicial",
        "fit": 4, "confianca": 8,
        "sugestao_shopping": "Shopping Cidade Jardim, JK Iguatemi — gen Z affluent",
        "verificacao": "23/05/2026",
        "fontes": "badrunning.com; Instagram; Projeto Draft; Webrun (ago/2025)"
    },
    {
        "tier": "B", "marca": "Lou Club",
        "categoria": "Premium athleisure feminino slow fashion",
        "segmento": "Wellness fashion premium",
        "fundacao": "~2024",
        "fundadores": "Não confirmado publicamente",
        "hq": "Não confirmado (provavelmente SP)",
        "estado_seg": "SP (estimado, baixa confiança)",
        "base_inferencia": "Inferência fraca — não consegui confirmar HQ. Conteúdo do IG sugere ativações em SP e Bali",
        "seguidores_ig": 1124, "handle_ig": "@louclub",
        "link_ig": "https://www.instagram.com/louclub/",
        "tiktok": "—", "link_tt": "",
        "site": "https://www.louclub.com.br",
        "loja_fisica": "E-commerce only",
        "em_shopping": "Não — DNVB pura",
        "posicionamento": "Premium athleisure minimalista — slow fashion",
        "diferencial": "Estética clean alinhada à categoria global luxury athleisure",
        "risco": "Comunidade muito pequena (1.1K); falta verificar HQ e fundadores; estágio embrionário",
        "fit": 3, "confianca": 5,
        "sugestao_shopping": "Watch-list — não candidata imediata",
        "verificacao": "23/05/2026",
        "fontes": "louclub.com.br; Instagram oficial"
    },

    # TIER C — Watch-list
    {
        "tier": "C", "marca": "Dies Mercuri",
        "categoria": "Running premium sustentável",
        "segmento": "Running premium / wellness fashion",
        "fundacao": "2025",
        "fundadores": "Time franco-brasileiro",
        "hq": "São Paulo, SP",
        "estado_seg": "SP (estimado)",
        "base_inferencia": "Time baseado em SP; e-commerce only",
        "seguidores_ig": 1938, "handle_ig": "@_diesmercuri",
        "link_ig": "https://www.instagram.com/_diesmercuri/",
        "tiktok": "—", "link_tt": "",
        "site": "https://diesmercuri.com",
        "loja_fisica": "E-commerce only",
        "em_shopping": "Não",
        "posicionamento": "Running premium com repair service e sustentabilidade",
        "diferencial": "Eco-luxury; equipe internacional; reparo de produtos",
        "risco": "Estágio embrionário (<2K seguidores)",
        "fit": 3, "confianca": 6,
        "sugestao_shopping": "Watch-list — reavaliar em 12 meses",
        "verificacao": "23/05/2026",
        "fontes": "diesmercuri.com; Instagram; The Game Collective"
    },

    # LIMÍTROFES — Não cumprem 100% mas merecem nota
    {
        "tier": "LIMÍTROFE", "marca": "Authen",
        "categoria": "Technical activewear running feminino",
        "segmento": "Running",
        "fundacao": "~2013",
        "fundadores": "Christopher Spikes",
        "hq": "Rio de Janeiro, RJ",
        "estado_seg": "RJ + SP (estimado, distribuído)",
        "base_inferencia": "Origem carioca, eventos Authen Run House no Rio; presença em 500+ lojas multimarcas no país; 4 franquias BR+EUA distribuem público",
        "seguidores_ig": 232000, "handle_ig": "@authenbrasil",
        "link_ig": "https://www.instagram.com/authenbrasil/",
        "tiktok": "—", "link_tt": "",
        "site": "https://www.authen.com.br",
        "loja_fisica": "4 franquias (BR+EUA) + 500+ multimarcas + Authen Run House Glória/RJ",
        "em_shopping": "Não confirmado se franquias estão em shopping — mas modelo já é varejo + wholesale, não DNVB",
        "posicionamento": "Brazilian Fit — running para mulheres brasileiras",
        "diferencial": "Crescimento 70%/ano desde 2015; foco em running feminino; tecnologia Pressus Pro; growth equity captado",
        "risco": "NÃO É DNVB no sentido estrito — modelo já é multicanal. Incluída no recorte expandido pelo perfil running premium e tração relevante.",
        "fit": 4, "confianca": 7,
        "sugestao_shopping": "Shopping Leblon, Village Mall (RJ) — público corredora carioca premium",
        "verificacao": "23/05/2026",
        "fontes": "authen.com.br; Webrun (mai/2026); Esportividade; CBInsights"
    },
    {
        "tier": "LIMÍTROFE", "marca": "Quadro Creations",
        "categoria": "Streetwear autoral funcional",
        "segmento": "Street performance",
        "fundacao": "2017",
        "fundadores": "Lucas Borges",
        "hq": "São Paulo, SP",
        "estado_seg": "SP (estimado predominante)",
        "base_inferencia": "Fundador e HQ SP; mídia internacional (HIGHXTAR, nss magazine) cobre como referência paulista",
        "seguidores_ig": 64000, "handle_ig": "@quadrocreations",
        "link_ig": "https://www.instagram.com/quadrocreations/",
        "tiktok": "—", "link_tt": "",
        "site": "https://www.quadrocreations.com",
        "loja_fisica": "Não localizei loja física confirmada via busca pública",
        "em_shopping": "Não confirmado (e-commerce + multimarcas como Quiver, Guadalupe)",
        "posicionamento": "Streetwear autoral, vintage moderno, alfaiataria street",
        "diferencial": "Reconhecimento internacional (HIGHXTAR, nss magazine); colabs com ASICS Kiko Kostadinov",
        "risco": "Streetwear puro, com ponte tênue para sports. Status DNVB precisa confirmação direta.",
        "fit": 3, "confianca": 6,
        "sugestao_shopping": "JK Iguatemi (próximo à PACE/CLASS) — se cluster aceitar streetwear premium",
        "verificacao": "23/05/2026",
        "fontes": "quadrocreations.com; Instagram; HIGHXTAR; nss magazine"
    },
    {
        "tier": "LIMÍTROFE", "marca": "High Minded (linha do Cotton Project)",
        "categoria": "Activewear acessível streetwear",
        "segmento": "Performance lifestyle",
        "fundacao": "~2023-2024",
        "fundadores": "Rafael Varandas",
        "hq": "São Paulo, SP",
        "estado_seg": "SP (estimado)",
        "base_inferencia": "Fundador SP; submarca Cotton Project (HQ SP); eventos SP",
        "seguidores_ig": 3442, "handle_ig": "@highmindedpeople",
        "link_ig": "https://www.instagram.com/highmindedpeople/",
        "tiktok": "—", "link_tt": "",
        "site": "Não encontrado site dedicado",
        "loja_fisica": "Sem flagship dedicada — usa estrutura Cotton Project",
        "em_shopping": "Linha de marca maior que provavelmente está em shopping. Marca-mãe (Cotton Project) já tem lojas próprias.",
        "posicionamento": "Ponte streetwear-running, acessível",
        "diferencial": "Sócio também opera Miradouro Hotel e Cotton Project — ecossistema lifestyle",
        "risco": "Linha pequena (3.4K); depende da estrutura Cotton Project — NÃO é DNVB independente",
        "fit": 3, "confianca": 5,
        "sugestao_shopping": "Não recomendada — usar como referência de categoria",
        "verificacao": "23/05/2026",
        "fontes": "Instagram oficial; ELLE Brasil (mai/2024); FFW (abr/2024)"
    },
]

def get_fill(tier):
    return {"A": ok_fill, "B": warn_fill, "C": watch_fill, "LIMÍTROFE": neutral_fill}.get(tier, neutral_fill)

for i, row in enumerate(marcas, start=2):
    values = [
        i - 1, row["tier"], row["marca"], row["categoria"], row["segmento"],
        row["fundacao"], row["fundadores"], row["hq"],
        row["estado_seg"], row["base_inferencia"],
        row["seguidores_ig"], row["handle_ig"], row["link_ig"],
        row["tiktok"], row["link_tt"], row["site"],
        row["loja_fisica"], row["em_shopping"],
        row["posicionamento"], row["diferencial"], row["risco"],
        row["fit"], row["confianca"], row["sugestao_shopping"],
        row["verificacao"], row["fontes"]
    ]
    fill = get_fill(row["tier"])
    for col, v in enumerate(values, 1):
        c = ws.cell(row=i, column=col, value=v)
        c.alignment = left if col not in (1, 2, 11, 22, 23) else center
        c.font = arial10
        c.border = border
        c.fill = fill
    ws.cell(row=i, column=11).number_format = '#,##0'

    if row["link_ig"]:
        ig = ws.cell(row=i, column=13)
        ig.hyperlink = row["link_ig"]
        ig.font = link_font
    if row["link_tt"]:
        tt = ws.cell(row=i, column=15)
        tt.hyperlink = row["link_tt"]
        tt.font = link_font
    if row["site"].startswith("http"):
        st = ws.cell(row=i, column=16)
        st.hyperlink = row["site"]
        st.font = link_font

widths = [5, 12, 22, 28, 28, 12, 30, 22, 26, 50, 14, 22, 36, 16, 36, 32, 38, 38, 38, 42, 42, 12, 14, 38, 14, 50]
for i, w in enumerate(widths, 1):
    ws.column_dimensions[get_column_letter(i)].width = w

ws.row_dimensions[1].height = 38
for i in range(2, len(marcas) + 2):
    ws.row_dimensions[i].height = 130

ws.freeze_panes = "D2"
ws.auto_filter.ref = f"A1:{get_column_letter(len(headers))}{len(marcas)+1}"


# ===================== SHEET 2: AVISO SOBRE COLUNA DE ESTADO =====================
ws2 = wb.create_sheet("Aviso — coluna de estado")
ws2.column_dimensions["A"].width = 35
ws2.column_dimensions["B"].width = 90

aviso = [
    ["LEIA ANTES DE USAR A COLUNA 'ESTADO ORIGEM SEGUIDORES'", ""],
    ["", ""],
    ["O QUE A COLUNA É", "Inferência baseada em proxies públicos: HQ da marca, localização das lojas, onde acontecem os eventos, onde estão os fundadores, cidades destacadas nas redes sociais."],
    ["", ""],
    ["O QUE A COLUNA NÃO É", "Não é dado real de Instagram Insights. Não tenho acesso ao dashboard de demographics de cada conta. Os percentuais reais podem divergir significativamente — uma marca com HQ em SP pode ter 40% de seguidores em RJ, por exemplo."],
    ["", ""],
    ["COMO LER", "'SP (estimado predominante)' = maior parte provavelmente concentrada em SP, mas sem confirmação numérica. Trate como hipótese, não como fato."],
    ["", ""],
    ["O QUE FARIA O DADO REAL", "Acesso ao Insights da marca (apenas marca + Anthropic/Meta), Modash, HypeAuditor, Stilingue, ou Buzzmonitor. Custo aproximado: R$ 500-3.000/mês."],
    ["", ""],
    ["CONFIANÇA DESTA COLUNA", "5/10 — útil para hipótese inicial e priorização de leasing approach, mas DEVE ser validada com dado real antes de decisão comercial significativa."],
    ["", ""],
    ["POR QUE INCLUI MESMO ASSIM", "Você pediu, e é melhor entregar uma estimativa transparente do que omitir um campo útil. Mas a transparência sobre o limite é parte da entrega."],
    ["", ""],
    ["SUGESTÃO DE PROTOCOLO", "Para qualquer leasing approach baseado nessa coluna: (1) abordar a marca diretamente e pedir dado real; (2) o próprio shopping AB pode rodar a análise via parceiros de mídia; (3) cruzar com tráfego do site da marca via SimilarWeb."],
]

for i, (k, v) in enumerate(aviso, 1):
    a = ws2.cell(row=i, column=1, value=k)
    b = ws2.cell(row=i, column=2, value=v)
    a.font = Font(name="Arial", bold=True, size=10)
    b.font = arial10
    a.alignment = Alignment(vertical="top", wrap_text=True)
    b.alignment = Alignment(vertical="top", wrap_text=True)
    if i == 1:
        a.font = Font(name="Arial", bold=True, size=14, color="FFFFFF")
        a.fill = section_fill
        b.fill = section_fill


# ===================== SHEET 3: METODOLOGIA =====================
ws3 = wb.create_sheet("Metodologia")
ws3.column_dimensions["A"].width = 42
ws3.column_dimensions["B"].width = 85

meta = [
    ["DNVB Sports Brasil — Lista expandida com inferência geográfica", ""],
    ["Última atualização", "23/05/2026"],
    ["Confiança geral", "7/10 — sobe pela verificação caso a caso, mas a coluna 'estado' baixa o nível geral"],
    ["Total de marcas catalogadas", "11 (não atingi as 20 pedidas — explicação abaixo)"],
    ["", ""],
    ["POR QUE NÃO CHEGUEI A 20", ""],
    ["Critério estrito limita o universo", "'Brasil + sem loja em shopping + DNVB de fato' filtra drasticamente. CHASE, Insider, Cotton Project, Athleta, todas saem por estarem em shopping ou ser wholesale."],
    ["Marcas com tração relevante já migraram", "Toda marca DNVB que atinge ~200K seguidores é cortejada por shopping centers e/ou migra para varejo. PACE é o caso emblemático (pop-up no JK)."],
    ["Streetwear puro não cabe em 'sports'", "Piet, Sufgang, Mad Enlatados, DOD, A Quem — todos relevantes culturalmente mas não fazem ponte para sports/wellness."],
    ["Para chegar a 20 com rigor", "Seria preciso (a) ampliar o recorte para incluir streetwear puro; (b) ampliar para marcas em wholesale/franquia; (c) acessar dados privados (Modash etc.) para descobrir marcas <10K que estão crescendo rápido. Sem isso, forçar 20 = inventar."],
    ["", ""],
    ["LISTA FINAL — 11 MARCAS", ""],
    ["TIER A (4) — críterio estrito + alta confiança", "PACE, CLASS, CARNAN, SIÉ Wear"],
    ["TIER B (3) — critério estrito + média confiança", "AIMO, BAD RUNNING, Lou Club"],
    ["TIER C (1) — watch-list", "Dies Mercuri"],
    ["LIMÍTROFES (3) — não cumprem 100% mas relevantes", "Authen (modelo wholesale), Quadro Creations (streetwear), High Minded (não-independente)"],
    ["", ""],
    ["DISTRIBUIÇÃO GEOGRÁFICA INFERIDA", ""],
    ["SP-centric (estimado)", "PACE, CLASS, SIÉ, AIMO, BAD RUNNING, Lou Club, Dies Mercuri, Quadro Creations, High Minded — 9 das 11"],
    ["RJ-centric (estimado)", "Authen"],
    ["RJ + SP (estimado distribuído)", "CARNAN (origem RJ, loja SP, operação SP)"],
    ["Implicação para shopping AB", "Concentração massiva em SP sugere: Iguatemi SP, JK Iguatemi, Cidade Jardim, Pátio Higienópolis como primeira opção. Para RJ: Shopping Leblon, Village Mall."],
    ["", ""],
    ["LIMITAÇÕES JÁ DOCUMENTADAS", ""],
    ["Coluna de estado é inferência", "Ver aba 'Aviso — coluna de estado'"],
    ["Sem taxa de engajamento real", "Ranking é por tamanho de comunidade + fit, não por interação"],
    ["Viés amostral provável", "Marcas regionais fora de SP-RJ subrepresentadas. Possivelmente perdi 3-5 marcas relevantes."],
    ["", ""],
    ["PRÓXIMOS PASSOS RECOMENDADOS", ""],
    ["1. Validar geograficamente", "Pedir dado real via Modash ou diretamente às marcas"],
    ["2. Abrir o jogo com as marcas Tier A", "PACE e SIÉ já são candidatos imediatos. CARNAN exige confirmação de fit (mais masculino)."],
    ["3. Expansão regional", "Field research específico em Curitiba, Porto Alegre, Recife — provavelmente há 2-4 DNVBs locais não capturadas"],
    ["4. Reavaliar PACE em 3-6 meses", "Pop-up no JK pode virar loja permanente"],
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
    if k in ("POR QUE NÃO CHEGUEI A 20", "LISTA FINAL — 11 MARCAS",
            "DISTRIBUIÇÃO GEOGRÁFICA INFERIDA", "LIMITAÇÕES JÁ DOCUMENTADAS",
            "PRÓXIMOS PASSOS RECOMENDADOS"):
        a.font = Font(name="Arial", bold=True, size=11, color="FFFFFF")
        a.fill = section_fill
        b.fill = section_fill

wb.save("/mnt/user-data/outputs/DNVB_Sports_Brasil_Expandido.xlsx")
print("OK")
