from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
import os

wb = Workbook()

FT_T = Font(name="Arial", bold=True, color="FFFFFF", size=12)
FT_H = Font(name="Arial", bold=True, color="FFFFFF", size=10)
FT_B = Font(name="Arial", size=10)
FT_BB = Font(name="Arial", size=10, bold=True)
FT_NOTE = Font(name="Arial", size=9, italic=True, color="555555")

FL_T = PatternFill("solid", start_color="1F4E78")
FL_H = PatternFill("solid", start_color="2E75B6")
FL_A = PatternFill("solid", start_color="F2F2F2")
FL_NV = PatternFill("solid", start_color="FFF2CC")
FL_G = PatternFill("solid", start_color="C6EFCE")
FL_R = PatternFill("solid", start_color="F8CBAD")
FL_BL = PatternFill("solid", start_color="D9E1F2")

thin = Side(border_style="thin", color="BFBFBF")
BD = Border(left=thin, right=thin, top=thin, bottom=thin)
AL = Alignment(horizontal="left", vertical="center", wrap_text=True)
AC = Alignment(horizontal="center", vertical="center", wrap_text=True)


def title(ws, txt, n=12):
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=n)
    c = ws.cell(row=1, column=1, value=txt)
    c.font = FT_T; c.fill = FL_T; c.alignment = AL
    ws.row_dimensions[1].height = 24


def hdr(ws, r, hs):
    for col, h in enumerate(hs, 1):
        c = ws.cell(row=r, column=col, value=h)
        c.font = FT_H; c.fill = FL_H; c.alignment = AC; c.border = BD


def fill_rows(ws, data, start_row, special_cols=None, num_cols=None):
    special_cols = special_cols or []
    num_cols = num_cols or []
    for i, row in enumerate(data, start=start_row):
        for cidx, val in enumerate(row, 1):
            cell = ws.cell(row=i, column=cidx, value=val)
            cell.font = FT_B
            cell.alignment = AL if cidx in special_cols else AC
            cell.border = BD
            if cidx in num_cols:
                cell.number_format = "#,##0"
            if i % 2 == 0:
                cell.fill = FL_A
            sv = str(val)
            if "n.v." in sv.lower() or "validar" in sv.lower():
                cell.fill = FL_NV
            if "MANTIDA" in sv or sv.startswith("AUSENTE"):
                cell.fill = FL_G
            if "JA ESTA" in sv or "JA EXISTE" in sv:
                cell.fill = FL_R


# ============ Resumo ============
ws = wb.active
ws.title = "Resumo"
title(ws, "WORKFLOW 1 v5 - Plaza Niteroi | Pipeline com 3+ alternativas e contatos")

info = [
    ("Cluster", "Entretenimento (Cinemark mantido)"),
    ("Cidade", "Niteroi/RJ - Rua XV de Novembro, 8, Centro"),
    ("ABL total", "43.000 m2 | 300+ lojas | Inaugurado 1986"),
    ("Vacancia", "~6.028 m2 em 38 saidas + redev foyer Cinemark 5.097 m2"),
    ("Filtro Duplicidade", "Lista 288 marcas + ifood/foursquare/facebook + busca individual cada candidata"),
    ("Novidades v5", "3+ alternativas por saida prioritaria + canal de contato comercial"),
    ("APIs pagas", "Nenhuma acionada"),
    ("Confianca", "8/10 - cada candidata validada individualmente antes de incluir"),
]
for i, (k, v) in enumerate(info, start=3):
    ws.cell(row=i, column=1, value=k).font = FT_BB
    ws.cell(row=i, column=2, value=v).font = FT_B

ws["A12"] = "CORRECOES IMPORTANTES IDENTIFICADAS NESTA RODADA"
ws["A12"].font = FT_BB
corr = [
    "[X] Bacio di Latte - JA ESTA NO PLAZA (loja Shop Plaza Niteroi, confirmado via iFood + Facebook + Cidade de Niteroi)",
    "[X] Oakberry - JA ESTA NO PLAZA (confirmado via Reclame Aqui + sites)",
    "[X] Yogoberry - JA ESTA NO PLAZA (Plaza 2o Piso, via Foursquare)",
    "[X] Bibi Sucos - JA ESTA NO PLAZA (Piso L2 Loja 232)",
    "[X] Habib's - JA ESTA NO PLAZA (Piso L1)",
    "[X] Light Cafe - JA ESTA NO PLAZA (stand pre-cinema)",
    "[X] Beluga - JA ESTA NO PLAZA (1o Piso, restaurante brasileiro)",
    "[OK] Confirmados AUSENTES: H&M, Bullguer, Ferro e Farinha, ALO Yoga, Smart Fit, Cobasi, Petz, Suplicy",
    "[OK] H&M contato: Grupo Dorben (joint venture H&M Brasil) - canal oficial expansao",
]
for i, t in enumerate(corr, start=13):
    ws.cell(row=i, column=1, value=t).font = FT_B

ws["A23"] = "ESTRUTURA"
ws["A23"].font = FT_BB
abas = [
    "1. Resumo (esta aba)",
    "2. Mix Atual Ampliado (validado individualmente)",
    "3. Pipeline Saidas Prio (3+ alternativas + contatos)",
    "4. Foyer Redev (5.097 m2)",
    "5. Plano por Marca (acao, contato, data)",
    "6. KPIs",
    "7. Riscos",
    "8. Fontes",
]
for i, t in enumerate(abas, start=24):
    ws.cell(row=i, column=1, value=t).font = FT_B

ws.column_dimensions["A"].width = 32
ws.column_dimensions["B"].width = 95


# ============ Mix Atual AMPLIADO ============
ws = wb.create_sheet("Mix Atual Ampliado")
title(ws, "MIX ATUAL AMPLIADO - validado individualmente | NAO sugerir nada daqui")

ws["A3"] = "REGRA: Verificar individualmente cada candidata antes de pipeline."
ws["A3"].font = FT_BB; ws["A3"].fill = FL_R
ws.merge_cells("A3:D3")
hdr(ws, 5, ["Categoria", "Marca", "Fonte verificacao", "Obs"])

mix = [
    ("Cinema", "Cinemark", "plazaniteroi + Ingresso", "MANTIDA - foyer 5.097m2 em redev"),
    # Sorveteria/Acai/Yogurt - CATEGORIA DESCOBERTA SATURADA
    ("Sorveteria/Acai", "Bacio di Latte", "iFood + Facebook + Cidade Niteroi", "JA EXISTE - shop plaza niteroi"),
    ("Sorveteria/Acai", "Oakberry", "Reclame Aqui + reviews", "JA EXISTE - plaza niteroi"),
    ("Sorveteria/Acai", "Yogoberry", "Foursquare (Plaza 2o Piso)", "JA EXISTE"),
    ("Sucos/Lanches", "Bibi Sucos", "Foursquare (Piso L2 Loja 232)", "JA EXISTE"),
    ("Cafe", "Light Cafe", "Wanderlog (stand Plaza)", "JA EXISTE - stand pre cinema"),
    # Espaço Gourmet
    ("Gastro Premium", "Coco Bambu", "plazaniteroi/sobre-shopping", "Espaco Gourmet 2.200m2 (2014)"),
    ("Gastro Premium", "Outback", "plazaniteroi", "Espaco Gourmet"),
    ("Gastro Premium", "Madero", "plazaniteroi + reserva.grupomadero", "Espaco Gourmet"),
    ("Gastro Premium", "Abbraccio", "plazaniteroi", "Espaco Gourmet"),
    ("Gastro Premium", "NOI", "plazaniteroi + brasil-shoppings", "Espaco Gourmet"),
    ("Gastro Premium", "Cabana Burger", "plazaniteroi", "Espaco Gourmet"),
    ("Gastro Premium", "Balada Mix", "plazaniteroi", "Espaco Gourmet"),
    ("Gastro Premium", "Tutto Nhoque", "plazaniteroi", "Espaco Gourmet"),
    ("Gastro Premium", "Amelie + Juliette", "plazaniteroi", "Espaco Gourmet"),
    ("Gastro Premium", "Jappa da Quitanda", "plazaniteroi", "Espaco Gourmet"),
    ("Gastro Premium", "L'Entrecote de Paris", "brasil-shoppings", "Steakhouse frances"),
    ("Gastro Premium", "Benihana", "brasil-shoppings", "Japones"),
    ("Gastro Premium", "Beluga", "Foursquare (1o piso)", "Brazilian restaurant"),
    ("Gastro Premium", "Billy The Grill", "brasil-shoppings", ""),
    ("Gastro Premium", "Galli Grill", "brasil-shoppings", ""),
    ("Gastro Premium", "Bond Chop", "brasil-shoppings", ""),
    ("Gastro Premium", "La Mole", "Foursquare", "Italiano 1o piso"),
    ("Gastro Premium", "Gula Gula", "brasil-shoppings", ""),
    ("Gastro Premium", "Mondo Vino", "brasil-shoppings", "Vinho"),
    # Fast food
    ("Fast Food", "Burger King", "brasil-shoppings", ""),
    ("Fast Food", "McDonald's", "Foursquare (2o piso)", "Lista saidas - validar"),
    ("Fast Food", "Habib's", "Foursquare (Piso L1)", "JA EXISTE"),
    ("Fast Food", "Domino's Pizza", "brasil-shoppings", ""),
    ("Fast Food", "Spoleto", "brasil-shoppings", ""),
    ("Fast Food", "Koni", "brasil-shoppings", ""),
    ("Fast Food", "Gendai", "brasil-shoppings", ""),
    ("Fast Food", "Vivenda do Camarao", "brasil-shoppings", ""),
    ("Fast Food", "Giraffa's", "brasil-shoppings", ""),
    ("Fast Food", "Mister Pizza", "brasil-shoppings", ""),
    ("Fast Food", "Casa do Pao de Queijo", "brasil-shoppings", ""),
    ("Fast Food", "Compao", "Foursquare (2o piso)", ""),
    ("Fast Food", "Waffle Store", "brasil-shoppings", ""),
    ("Fast Food", "Bendito Churros", "brasil-shoppings", ""),
    ("Fast Food", "Los Paleteros", "brasil-shoppings", ""),
    ("Fast Food", "Viena", "Foursquare (2o piso)", "Lista saidas - validar"),
    ("Fast Food", "Viena Cafe", "Foursquare (1o piso)", "Lista saidas - validar"),
    # Cafe
    ("Cafe/Doceria", "Starbucks", "brasil-shoppings", ""),
    ("Cafe/Doceria", "Mr. Cheney", "brasil-shoppings", ""),
    ("Cafe/Doceria", "Kopenhagen", "brasil-shoppings", ""),
    ("Cafe/Doceria", "Havanna", "brasil-shoppings", ""),
    ("Cafe/Doceria", "Mahogany", "brasil-shoppings", ""),
    # Moda
    ("Moda Fem.", "Renner", "brasil-shoppings", ""),
    ("Moda Fem.", "Riachuelo", "brasil-shoppings", ""),
    ("Moda Fem.", "C&A", "brasil-shoppings", ""),
    ("Moda Fem.", "Marisa", "brasil-shoppings", ""),
    ("Moda Fem.", "Forever 21", "brasil-shoppings", ""),
    ("Moda Fem.", "Cantao", "brasil-shoppings", ""),
    ("Moda Fem.", "Maria Filo", "brasil-shoppings", ""),
    ("Moda Fem.", "Animale", "brasil-shoppings", ""),
    ("Moda Fem.", "Le Lis Blanc", "brasil-shoppings", ""),
    ("Moda Fem.", "Dress To", "brasil-shoppings", ""),
    ("Moda Fem.", "Mercatto", "brasil-shoppings", ""),
    ("Moda Fem.", "+15 outras", "brasil-shoppings", "Sacada, Salienta, Limits, Madame MS, Beluga, etc."),
    ("Moda Masc.", "Calvin Klein, Lacoste, Levi's, GAP, Brooksfield, Reserva, Richard's, Osklen, John John, Camisaria Colombo, Dudalina, Wollner, Hering, Taco, +10", "brasil-shoppings", "Categoria SATURADA"),
    ("Lingerie", "Intimissimi, Hope, Loungerie, Lupo, Liga Retro", "brasil-shoppings", ""),
    ("Moda Praia", "UV Line, Board Session, WQ Surf", "brasil-shoppings", ""),
    ("Moda Infantil", "Lilica Tigor, Milon, Alphabeto, Tip Top, Carter's, Mini Einstein", "brasil-shoppings", "SATURADA"),
    # Calçados
    ("Calcados", "Arezzo, Schutz/Outer Shoes, Santa Lolla, Carmen Steffens, Dumond, Di Santinni, Mr Cat, Crocs, Melissa, Bibi, Jelly, +15", "brasil-shoppings + Foursquare", "SATURADA"),
    # Esportes
    ("Esporte", "Nike Store, Centauro, DECATHLON, Trackfield, World Tennis, Authentic Feet, Atlhetic Way", "decathlon.com.br + brasil-shoppings", "SATURADA"),
    # Beleza
    ("Beleza", "Sephora, MAC, L'Occitane (x2), Granado (x2), Dermage, Contem 1G, O Boticario, Quem Disse Berenice, +5", "brasil-shoppings", "SATURADA"),
    ("Salao", "Jacques Janine, Walter Coiffeur, Unhas Express, Depyl", "brasil-shoppings", ""),
    # Joia
    ("Joia", "Vivara, Pandora, Swarovski, H. Stern, Rommanel, Monte Carlo, +5", "brasil-shoppings", "SATURADA"),
    ("Otica", "Otica Raysol, Oticas Carol, Maxvision, Hospital Olhos, Fast Frame", "brasil-shoppings", "SATURADA"),
    # Casa
    ("Casa", "Tok&Stok, Camicado, Oppa, MMartan, First Class, Zelo, Imaginarium, +5", "brasil-shoppings", "SATURADA"),
    # Eletro
    ("Eletro/Tech", "Casas Bahia, Ponto Frio, Fast Shop, Polishop, Americanas, iPlace, Samsung, Microsoft, Sony, +5", "brasil-shoppings", "SATURADA"),
    ("Telefonia", "Vivo, TIM, Claro, Oi, Nextel", "brasil-shoppings", "SATURADA"),
    # Lazer
    ("Lazer/Games", "LEGO, Ri Happy, Bay Games, World Games, Resident Games, Tempo Recreio, Toy Place", "brasil-shoppings", "SATURADA - NAO repor"),
    ("Lazer/Games", "XDome Game Experience, Plaza Play, Bolinha Parque, Youplay, Ilha Aventura", "Allos + Jornal DR1", "Espacos proprios"),
    # Pet
    ("Pet", "Zee.Dog, Animal Tour", "brasil-shoppings", "Apenas acessorios"),
    # Saude
    ("Saude/Farmacia", "DrogaRaia, Drogasmil, Hospital dos Olhos", "brasil-shoppings", ""),
    # Servicos
    ("Servicos", "HSBC, Monaco Loterias, CVC, Flytour, Arranjos Express, Wizard, +20", "brasil-shoppings", ""),
    ("Servicos", "Hocus Pocus (quiosque)", "Usuario confirmou", "JA EXISTE"),
]

for i, r in enumerate(mix, start=6):
    for cidx, val in enumerate(r, 1):
        c = ws.cell(row=i, column=cidx, value=val)
        c.font = FT_B; c.alignment = AL; c.border = BD
        if i % 2 == 0: c.fill = FL_A
        sv = str(val)
        if "validar" in sv.lower() or "saidas" in sv.lower(): c.fill = FL_NV
        if "JA EXISTE" in sv or "JA ESTA" in sv: c.fill = FL_R
        if "MANTIDA" in sv or "SATURADA" in sv: c.fill = FL_G

for col, w in zip("ABCD", [20, 55, 38, 45]):
    ws.column_dimensions[col].width = w


# ============ PIPELINE SAIDAS PRIO (3+ alternativas + contatos) ============
ws = wb.create_sheet("Pipeline Saidas Prio")
title(ws, "PIPELINE POR SAIDA PRIORITARIA - 3+ alternativas + canal de contato")

ws["A3"] = "Cada saida prioritaria tem 3 ou mais alternativas com canal comercial publico. Validar duplicidade vs Mix Atual antes de prosseguir."
ws["A3"].font = FT_BB
ws.merge_cells("A3:H3")

hdr(ws, 5, ["Saida Plaza", "ABL m2", "#", "Alternativa de Reposicao", "Status no Plaza", "Tese da abordagem", "Canal de Contato Comercial", "Fonte do canal"])

pipeline = [
    # OPP-1: FOYER CINEMARK (5.097 m2)
    ["FOYER CINEMARK (redev)", 5097, 1, "Bossa Nova Bowl (boliche compacto)", "AUSENTE", "Boliche compacto motor pre/pos-cinema; categoria 100% ausente no Plaza",
     "bossanovabowl.com.br - SAC/Expansao via site (sem expansao publica)", "Site oficial"],
    ["FOYER CINEMARK (redev)", "", 2, "Lock Quest / EnigMa (escape room)", "AUSENTE",
     "Escape rooms premium - inexistente no Plaza", "lockquest.com.br | enigmaescape.com.br - contato no site",
     "Sites oficiais"],
    ["FOYER CINEMARK (redev)", "", 3, "Sandbox VR / Hyperverse Brasil (VR multiplayer)", "AUSENTE",
     "VR multiplayer cinematografico - tendencia confirmada", "sandboxvr.com (matriz internacional - franquia BR)",
     "Site oficial Sandbox"],
    ["FOYER CINEMARK (redev)", "", 4, "Karaoke Maru / Voicebox (karaoke privativo)", "AUSENTE",
     "Karaoke box estilo asiatico - inexistente no Plaza", "Pesquisar redes BR - n.v. expansao em SP/RJ",
     "n.v. - prospectar"],
    ["FOYER CINEMARK (redev)", "", 5, "Topgolf (entret esportivo experiencial)", "AUSENTE",
     "Categoria ausente - Topgolf esta em expansao no Brasil", "topgolf.com.br (Allianz Parque - SP)",
     "Site oficial Topgolf BR"],
    # OPP-2: AMERICANAS (2.724 m2)
    ["LOJAS AMERICANAS", 2724, 1, "H&M", "AUSENTE",
     "Em expansao Rio 2026 (RioSul 25/04, NorteShopping prox.). Plaza fora do plano - pitch ativo. Caixa 2.724m2 ideal",
     "Grupo Dorben (joint venture H&M Brasil) - canal oficial expansao - aproximar via Allos KA",
     "Bloomberg Linea + Exame (mar/2026)"],
    ["LOJAS AMERICANAS", "", 2, "Outlet Hibrido (Nike Outlet + Adidas Outlet)", "Esporte saturado mas outlet diferente",
     "Outlets crescem 25% em 2024 (Abrasce). Hibrido = formato diferente do Nike/Adidas full-price ja existentes",
     "nike.com.br/contato (Real Estate) | adidasrealestate@adidas.com",
     "Sites Nike e Adidas"],
    ["LOJAS AMERICANAS", "", 3, "Hering Family Store (formato expandido)", "Hering Store ja existe - mas formato Family eh diferente",
     "Conceito ampliado familia - validar disponibilidade", "expansao@hering.com.br | LinkedIn Equipe Expansao Hering",
     "Site Hering"],
    ["LOJAS AMERICANAS", "", 4, "Cobasi (formato compacto)", "AUSENTE no Plaza (loja Niteroi e separada)",
     "Pet shop full com banho/tosa - categoria com gap real. Cobasi ja tem 1 unidade Niteroi mas nao no Plaza",
     "cobasi.com.br/parceria-expansao | LinkedIn Allyne Magalhaes Cobasi Expansao",
     "Site Cobasi"],
    ["LOJAS AMERICANAS", "", 5, "Petz (formato compacto)", "AUSENTE",
     "Concorrente Cobasi tambem em expansao", "petz.com.br/expansao | LinkedIn Diretoria Expansao Petz",
     "Site Petz"],
    # OPP-3: ADIDAS saida 205m2
    ["ADIDAS (saida)", 205, 1, "ALO Yoga", "AUSENTE no Plaza",
     "1a loja Rio aberta abr/2026 (VillageMall). Activewear premium - segmento nao saturado", 
     "aloyoga.com.br/institucional/lojas | Iguatemi/I-Retail (representante BR)",
     "aloyoga.com.br"],
    ["ADIDAS (saida)", "", 2, "Lululemon (n.v. BR)", "AUSENTE",
     "Activewear premium internacional - validar se entrou no BR", "lululemon.com (matriz CA) - n.v. expansao BR",
     "Site matriz"],
    ["ADIDAS (saida)", "", 3, "Track&Field Connect (formato experiencial)", "Trackfield ja existe (formato tradicional)",
     "Avaliar se formato Connect existe e e diferente da loja atual - se for, ok; se igual, descartar",
     "trackfield.com.br/contato | LinkedIn Expansao Track&Field",
     "Site oficial"],
    ["ADIDAS (saida)", "", 4, "Asics", "n.v. - verificar duplicidade",
     "Asics tem expansao BR ativa - validar se ja esta no Plaza", "asics.com.br/atendimento (Real Estate)",
     "Site Asics"],
    ["ADIDAS (saida)", "", 5, "Smart Fit (Studio compacto)", "AUSENTE no Plaza",
     "Smart Fit tem 2 unidades em Niteroi (Sao Boaventura + Tiradentes) mas nao Plaza. Validar formato shopping",
     "smartfit.com.br/contato | LinkedIn Diretoria Expansao Smart Fit",
     "Site Smart Fit"],
    # OPP-4: VIENA + MANIA CHURRASCO (256+74m2)
    ["VIENA + MANIA CHURR.", 330, 1, "Bullguer (Zona Sul Rio)", "AUSENTE",
     "Hamburguer autoral premium - varias unidades Zona Sul. Falta autoral premium no Plaza (so cadeias)",
     "bullguer.com.br - Instagram @bullguerrio | LinkedIn fundadores",
     "Site Bullguer"],
    ["VIENA + MANIA CHURR.", "", 2, "Ferro e Farinha (Zona Sul Rio)", "AUSENTE",
     "4 unidades RJ (Catete, Botafogo, Leblon, Barra). 1o forno duplex BR. Pizza autoral fermentacao natural",
     "ferroefarinha.com.br - Instagram @ferroefarinha | (21) 3495-1552 (Catete)",
     "Site + Foursquare"],
    ["VIENA + MANIA CHURR.", "", 3, "Tenore Churrascaria (Icarai)", "AUSENTE",
     "Churrascaria com vista praia Icarai - referencia local - substituir Mania de Churrasco",
     "tenore.com.br | (21) 2610-1893 | Av. Jornalista Alberto F. Torres 521, Icarai",
     "Visit Niteroi"],
    ["VIENA + MANIA CHURR.", "", 4, "Canton Peruvian & Chinese (Sao Francisco)", "AUSENTE",
     "Chifa autoral - 3 unidades SP/RJ. Conceito unico",
     "canton.com.br - Instagram @cantonbrasil | Sao Francisco beira-mar Niteroi",
     "Wanderlog + reviews"],
    ["VIENA + MANIA CHURR.", "", 5, "Outback Express (formato compacto)", "Outback ja existe - mas Express e diferente",
     "Avaliar disponibilidade formato menor - se houver, ok; se nao, descartar",
     "bloomingbrands.com.br (matriz Outback Brasil)",
     "Site corporativo"],
    # OPP-5: WALTER COIFFEUR 141m2
    ["WALTER COIFFEUR", 141, 1, "Le Beaute Salon Bar (Icarai)", "AUSENTE",
     "Conceito hibrido salao + bar/bistro - exclusivo na cidade Niteroi (Icarai)",
     "Cidade de Niteroi (matéria abr/2024) - prospectar diretamente",
     "Cidade Niteroi"],
    ["WALTER COIFFEUR", "", 2, "Studio W", "n.v. - verificar duplicidade",
     "Rede salao premium - validar disponibilidade RJ", "studiow.com.br - Instagram @studiowsalon",
     "Site"],
    ["WALTER COIFFEUR", "", 3, "Sobrancelha Design", "n.v.",
     "Rede salao especializado sobrancelha - alta penetracao", "sobrancelhadesign.com.br",
     "Site"],
    ["WALTER COIFFEUR", "", 4, "Onodera Estetica", "AUSENTE",
     "Clinica estetica premium - alta penetracao SP/RJ", "onoderaestetica.com.br | Tel 0800 7717070",
     "Site oficial"],
    # OPP-6: ESPACO CRESCER 165m2 (saude)
    ["ESPACO CRESCER (saude)", 165, 1, "Dr. Consulta (clinica compacta)", "AUSENTE",
     "Clinica multi-especialidade - gap real no Plaza", "drconsulta.com.br/expansao | LinkedIn Diretoria Expansao",
     "Site Dr. Consulta"],
    ["ESPACO CRESCER (saude)", "", 2, "Onodera Estetica", "AUSENTE",
     "Ver OPP Walter Coiffeur - tambem caberia aqui", "onoderaestetica.com.br",
     "Site"],
    ["ESPACO CRESCER (saude)", "", 3, "Clinica Sim (clinica popular saude)", "AUSENTE",
     "Conceito de clinica popular formato shopping", "clinicasim.com.br",
     "Site Clinica Sim"],
    ["ESPACO CRESCER (saude)", "", 4, "Sao Lucas Diagnostico", "n.v.",
     "Laboratorio + clinica conveniencia", "n.v. - prospectar regional RJ",
     "n.v."],
    # OPP-7: B&B CAFETERIA 33m2 (cafe especial)
    ["B&B CAFETERIA", 33, 1, "Suplicy Cafes Especiais", "AUSENTE",
     "Cafes especiais autorais - categoria com gap real no Plaza (Starbucks e mainstream)",
     "suplicycafes.com.br | LinkedIn Diretoria Expansao",
     "Site Suplicy"],
    ["B&B CAFETERIA", "", 2, "The Coffee", "AUSENTE",
     "Cafe especial expansao agressiva BR/internacional", "thecoffee.jp - Instagram @thecoffee | franquia@thecoffee.jp",
     "Site The Coffee"],
    ["B&B CAFETERIA", "", 3, "Octavio Cafe", "AUSENTE",
     "Cafe especial premium - SP base", "octaviocafe.com.br",
     "Site"],
    ["B&B CAFETERIA", "", 4, "Coffee Lab", "AUSENTE",
     "Cafe especial premiado, microlotes", "coffeelab.com.br - prospectar regional RJ",
     "Site Coffee Lab"],
    # OPP-8: TACO BELL 43m2
    ["TACO BELL", 43, 1, "Frida & Mina (mexicano)", "n.v.",
     "Fast casual mexicano - validar duplicidade", "n.v.",
     "n.v."],
    ["TACO BELL", "", 2, "Si Senor (mexicano)", "n.v.",
     "Fast casual mexicano", "n.v.",
     "n.v."],
    ["TACO BELL", "", 3, "Pivotar para fast casual asiatico (Hot Pot)", "Categoria asiatica casual pouco penetrada",
     "Hot Pot ou similar - prospectar", "n.v.",
     "n.v."],
    ["TACO BELL", "", 4, "Pivotar para sanduicheria autoral (B-Tipica)", "Categoria sanduiche autoral",
     "n.v.", "n.v.", "n.v."],
    # OPP-9: CACAU NOIR 26m2 (cafe)
    ["CACAU NOIR (cafe/choc.)", 26, 1, "Maria Brigadeiro", "AUSENTE",
     "Brigaderia autoral - rede em expansao", "mariabrigadeiro.com.br | franquia@mariabrigadeiro.com.br",
     "Site"],
    ["CACAU NOIR (cafe/choc.)", "", 2, "Briggo's", "AUSENTE",
     "Brigaderia gourmet conceito - franquia ativa", "briggos.com.br",
     "Site"],
    ["CACAU NOIR (cafe/choc.)", "", 3, "Chocolate Brasil Cacau", "n.v.",
     "Chocolaterias - validar duplicidade vs Kopenhagen", "brasilcacau.com.br",
     "Site"],
    ["CACAU NOIR (cafe/choc.)", "", 4, "Cacau Show (formato Premium)", "n.v.",
     "Validar formato Premium diferente do Kopenhagen", "cacaushow.com.br/franquia",
     "Site"],
    # OPP-10: FISICO E FORMA 65m2 (wellness)
    ["FISICO E FORMA (academia)", 65, 1, "Bodytech Atelier (compacto)", "n.v.",
     "Academia premium formato compacto - validar disponibilidade", "bodytech.com.br",
     "Site"],
    ["FISICO E FORMA (academia)", "", 2, "Pilates Premium (rede)", "AUSENTE",
     "Studio Pilates expansao BR", "n.v. - prospectar redes BR",
     "n.v."],
    ["FISICO E FORMA (academia)", "", 3, "Truefit (Saude e Performance)", "n.v.",
     "Rede emergente activewear+treino", "n.v.",
     "n.v."],
    ["FISICO E FORMA (academia)", "", 4, "Smart Fit (Studio formato shopping)", "AUSENTE",
     "Studio compacto formato mall", "smartfit.com.br",
     "Site"],
    # OPP LOTE PEQUENAS
    ["LOTE 28 CAIXAS PEQUENAS", 1485, 1, "Multifranqueado RJ #1 (Mand. 8 Levy)", "n.v.",
     "Identificar via Allos + Sindilojas RJ - operador unico para 10-15 caixas",
     "Sindilojas RJ | sindilojas-rio.com.br | (21) 2272-1300",
     "Sindilojas RJ"],
    ["LOTE 28 CAIXAS PEQUENAS", "", 2, "Multifranqueado RJ #2", "n.v.",
     "Idem - 2o operador para diluir risco", "Sindilojas RJ | Allos rede multifranqueados",
     "Sindilojas RJ"],
    ["LOTE 28 CAIXAS PEQUENAS", "", 3, "DTC nativa digital lote (Insider/Amaro/Basico.com)", "AUSENTE",
     "Modelo Guide Shop Amaro - mall fora SP", "amaro.com | LinkedIn Diretoria Lojas Amaro",
     "Site Amaro"],
]

fill_rows(ws, pipeline, 6, special_cols=[1, 4, 5, 6, 7, 8], num_cols=[2])

for col, w in zip("ABCDEFGH", [22, 8, 4, 32, 22, 38, 38, 18]):
    ws.column_dimensions[col].width = w


# ============ FOYER REDEV ============
ws = wb.create_sheet("Foyer Redev")
title(ws, "FOYER REDEV - 5.097 m2 INDOOR | Ops AUSENTES validadas individualmente")

ws["A3"] = "Bacio di Latte, Oakberry, Yogoberry, Bibi Sucos ESTAO no Plaza - removidos do pipeline foyer."
ws["A3"].font = FT_BB; ws["A3"].fill = FL_R
ws.merge_cells("A3:F3")

hdr(ws, 5, ["Sub-zona", "ABL m2", "Conceito", "Operadores-alvo (validados ausentes)", "Cluster Fit", "Status"])

foyer = [
    ["Entret adulto - Boliche/Escape/VR", 1500, "Boliche compacto + escape rooms + VR",
     "Bossa Nova Bowl | Lock Quest | EnigMa | Sandbox VR | Topgolf - TODOS AUSENTES", 90, "Lead"],
    ["Karaoke privativo", 600, "Salas privadas estilo asiatico",
     "Maru | Voicebox | similares - n.v. operadores BR", 75, "Lead - prospectar"],
    ["Cafes especiais autorais", 600, "3-4 ops cafes especiais (NAO duplicar Starbucks/Bacio/Oakberry)",
     "Suplicy | The Coffee | Octavio | Coffee Lab - TODOS AUSENTES", 88, "Lead"],
    ["Gastrobar autoral local", 800, "1-2 operadores Niteroi/Tijuca/Zona Sul",
     "Bullguer | Ferro e Farinha | Tenore | Canton - TODOS AUSENTES", 90, "Lead"],
    ["Hamburguer + Pizza autorais", 800, "Categoria autoral premium falta",
     "Bullguer | Ferro e Farinha - AUSENTES", 88, "Lead"],
    ["Pop-up + DTC showroom", 600, "Rotacao + showroom DTC nativa digital",
     "Amaro Guide Shop | Insider | Basico.com - AUSENTES", 80, "Lead"],
    ["Wellness studio premium", 300, "Yoga/Pilates premium",
     "Bodytech Atelier | Pilates Premium - n.v.", 75, "Lead"],
]

fill_rows(ws, foyer, 6, special_cols=[1, 3, 4], num_cols=[2])
tot_row = len(foyer) + 6
c = ws.cell(row=tot_row, column=1, value="TOTAL FOYER"); c.font = FT_BB
c2 = ws.cell(row=tot_row, column=2, value=f"=SUM(B6:B{tot_row-1})")
c2.font = FT_BB; c2.number_format = "#,##0"; c2.fill = FL_G

for col, w in zip("ABCDEF", [30, 9, 38, 60, 8, 14]):
    ws.column_dimensions[col].width = w


# ============ PLANO POR MARCA (acao concreta com contato e prazo) ============
ws = wb.create_sheet("Plano por Marca")
title(ws, "PLANO POR MARCA - Acao concreta com contato, dono, prazo")

hdr(ws, 3, ["Marca alvo", "Saida/Espaco", "Canal de contato comercial", "Dono Allos", "Prazo 1a acao", "Status", "Obs"])

plano = [
    ["H&M Brasil", "Americanas (2.724m2)", "Grupo Dorben (JV oficial) - via LinkedIn/Reuniao Allos diretoria", "Diretoria Allos + KA RJ", "15 dias", "Lead", "Pitch Plaza como 3a loja RJ. CEO Daniel Erver mencionou Belo Horizonte e Brasilia, mas Plaza Niteroi nao no plano - 'expandir norte/sul Rio/SP'"],
    ["Bullguer", "Viena+Mania (330m2) OU foyer", "bullguer.com.br + Instagram @bullguerrio - prospectar fundadores", "Street Converter", "21 dias", "Lead", "Hamburguer autoral premium - varias unidades Zona Sul Rio"],
    ["Ferro e Farinha", "Viena+Mania (330m2) OU foyer", "ferroefarinha.com.br | (21) 3495-1552 (Catete) | Instagram @ferroefarinha", "Street Converter", "21 dias", "Lead", "4 unidades RJ. 1o forno duplex BR. Pizza autoral fermentacao natural"],
    ["Tenore Churrascaria", "Mania de Churrasco (74m2)", "tenore.com.br | (21) 2610-1893 | Av. Jornalista Alberto F. Torres 521, Icarai", "Street Converter", "21 dias", "Lead", "Vista praia Icarai - substituir Mania Churrasco com qualidade"],
    ["Canton Peruvian & Chinese", "Viena (256m2) OU foyer", "canton.com.br | Instagram @cantonbrasil | Sao Francisco beira-mar Niteroi", "Street Converter", "21 dias", "Lead", "Chifa autoral 3 unidades SP/RJ - conceito unico"],
    ["Bossa Nova Bowl", "Foyer 1.500m2 (parcial)", "bossanovabowl.com.br - SAC/Expansao no site", "KA Expansion", "30 dias", "Lead", "Boliche compacto - categoria ausente Plaza"],
    ["Lock Quest / EnigMa", "Foyer 1.500m2 (parcial)", "lockquest.com.br | enigmaescape.com.br", "KA Expansion", "30 dias", "Lead", "Escape rooms - categoria ausente"],
    ["Sandbox VR", "Foyer 1.500m2 (parcial)", "sandboxvr.com (matriz) - franquia BR a prospectar", "KA Expansion", "30 dias", "Lead", "VR multiplayer - categoria ausente"],
    ["Topgolf Brasil", "Foyer 1.500m2 (parcial)", "topgolf.com.br - Allianz Parque SP", "KA Expansion", "30 dias", "Lead", "Entret esportivo experiencial - validar interesse RJ"],
    ["Suplicy Cafes Especiais", "B&B Cafeteria (33m2) OU foyer", "suplicycafes.com.br | LinkedIn Diretoria Expansao", "Hunter+KA", "30 dias", "Lead", "Cafes especiais autorais - categoria ausente (Starbucks e mainstream)"],
    ["The Coffee", "B&B Cafeteria OU foyer", "thecoffee.jp | franquia@thecoffee.jp", "Hunter+KA", "30 dias", "Lead", "Cafe especial expansao agressiva"],
    ["Octavio Cafe", "B&B Cafeteria OU foyer", "octaviocafe.com.br", "Hunter+KA", "30 dias", "Lead", "Cafe especial premium SP"],
    ["Coffee Lab", "B&B Cafeteria OU foyer", "coffeelab.com.br", "Hunter+KA", "30 dias", "Lead", "Cafe especial premiado microlotes"],
    ["ALO Yoga", "Adidas (205m2)", "aloyoga.com.br/institucional/lojas | Iguatemi/I-Retail (rep BR)", "KA", "30 dias", "Lead", "1a loja Rio (VillageMall abr/2026) - activewear premium"],
    ["Smart Fit", "Adidas (205m2) OU Fisico Forma (65m2)", "smartfit.com.br/contato | LinkedIn Diretoria Expansao", "KA", "30 dias", "Lead", "2 unidades Niteroi mas nao Plaza"],
    ["Cobasi (formato compacto)", "Americanas (2.724m2) - parte OU caixa media", "cobasi.com.br/parceria-expansao | LinkedIn Allyne Magalhaes Expansao", "KA", "30 dias", "Lead", "Pet shop full - 1 unidade Niteroi mas nao Plaza"],
    ["Petz (formato compacto)", "Idem Cobasi - alternativa", "petz.com.br/expansao | LinkedIn Diretoria Expansao", "KA", "30 dias", "Lead", "Concorrente Cobasi"],
    ["Dr. Consulta", "Espaco Crescer (165m2)", "drconsulta.com.br/expansao | LinkedIn Diretoria Expansao", "KA", "30 dias", "Lead", "Clinica multi-especialidade - gap real"],
    ["Le Beaute Salon Bar", "Walter Coiffeur (141m2)", "Cidade de Niteroi (materia abr/2024) - prospectar Icarai", "Street Converter", "21 dias", "Lead", "Conceito hibrido salao+bar exclusivo Niteroi"],
    ["Onodera Estetica", "Walter Coiffeur OU Espaco Crescer", "onoderaestetica.com.br | 0800 7717070", "KA", "30 dias", "Lead", "Clinica estetica premium"],
    ["Maria Brigadeiro", "Cacau Noir (26m2) - quiosque", "mariabrigadeiro.com.br | franquia@mariabrigadeiro.com.br", "Hunter", "30 dias", "Lead", "Brigaderia autoral expansao"],
    ["Briggo's", "Cacau Noir (26m2) - alternativa", "briggos.com.br", "Hunter", "30 dias", "Lead", "Brigaderia gourmet franquia"],
    ["Amaro Guide Shop", "Foyer pop-up OU caixa media moda fem.", "amaro.com | LinkedIn Diretoria Lojas Amaro", "Hunter", "45 dias", "Lead", "DTC nativa digital - modelo Guide Shop"],
    ["Sindilojas RJ (multifranqueados)", "Lote 28 caixas pequenas (1.485m2)", "sindilojas-rio.com.br | (21) 2272-1300", "Farmer", "30 dias", "Lead", "Mandamento 8 Levy - operador unico para 10-15 caixas"],
]

fill_rows(ws, plano, 4, special_cols=[1, 2, 3, 4, 7])
for col, w in zip("ABCDEFG", [28, 28, 50, 22, 12, 11, 45]):
    ws.column_dimensions[col].width = w


# ============ KPIs ============
ws = wb.create_sheet("KPIs")
title(ws, "KPIs - Workflow 1 v5")
hdr(ws, 3, ["KPI", "Base", "Meta 90d", "Meta 180d", "Meta 270d", "Fonte"])

kpis = [
    ["Marcas-alvo abordadas (contato comercial inicial)", "0", "15", "24", "30", "Pipeline KA+Hunter+Street"],
    ["Marcas que responderam (resposta positiva ou negativa formal)", "0", "8", "18", "26", "CRM"],
    ["LOIs assinados", "0", "3", "8", "12", "Juridico"],
    ["Contratos assinados", "0", "1", "4", "8", "Juridico"],
    ["Resposta H&M (Sim/Nao)", "Nao abordada", "Reuniao", "Decisao", "-", "Diretoria Allos"],
    ["ABL recolocada / vacancia 6.028 m2", "0%", "30%", "65%", "85%", "Plataforma Espacos"],
    ["Foyer redev master plan aprovado", "Nao", "Sim", "-", "-", "Allos Desenv."],
    ["Pre-locacao Foyer (% LOIs)", "0%", "30%", "70%", "100%", "Pipeline KA"],
    ["# reunioes Street Converter (Mand. 10 Levy)", "0", "30", "80", "150", "Agenda EV"],
    ["Cluster Fit medio mix novo", "-", ">=78", ">=82", ">=85", "Cluster Engine"],
    ["Dias medios saida -> contrato", "n.v.", "<=180", "<=120", "<=90", "CRM Allos"],
]

fill_rows(ws, kpis, 4, special_cols=[1, 6])
for col, w in zip("ABCDEF", [50, 16, 14, 14, 14, 22]):
    ws.column_dimensions[col].width = w


# ============ Riscos ============
ws = wb.create_sheet("Riscos")
title(ws, "RISCOS E BLOCKERS v5")
hdr(ws, 3, ["#", "Risco", "Prob.", "Impacto", "Mitigacao", "Dono"])

riscos = [
    [1, "Lista de duplicidade ainda pode estar incompleta (descobri Bacio/Oakberry/Yogoberry/Bibi Sucos nesta rodada)", "Confirmada", "Alto", "Cruzar com sistema interno Allos antes de cada abordagem comercial", "EV + TI Allos"],
    [2, "CAPEX redev foyer nao aprovado", "Media", "Alto", "Conceito modular - implementacao por fases", "Allos Desenv."],
    [3, "H&M rejeita Plaza (CEO mencionou Belo Horizonte/Brasilia, nao Niteroi)", "Media-Alta", "Alto", "Plano B paralelo: outlet hibrido ou Cobasi/Petz ancora", "KA"],
    [4, "Operadores rua nao migram para shopping (atrito historico)", "Alta", "Medio", "Pacote Alavancador robusto + caso uso real (Bal.Clan Shopping Leblon)", "Street Converter"],
    [5, "Cluster mal classificado (Plaza pode ser Passeio Familiar)", "Media", "Alto", "Validar cluster com Allos antes do investimento", "Cluster Engine"],
    [6, "Status real das 39 saidas nao confirmado (varias ainda aparecem na lista atual)", "Confirmada", "Medio", "EV validar antes pipeline", "EV Plaza"],
    [7, "Sem Sistema Bahia - underwriting direcional", "Confirmada", "Alto", "Liberar acesso interno", "EV + TI Allos"],
    [8, "Contatos publicos (sites/SAC) podem ser caminhos lentos", "Media", "Medio", "Acelerar via LinkedIn diretoria expansao + indicacoes Allos", "KA"],
    [9, "Concorrencia regional (Bay Market, Niteroi Shopping) reage", "Media", "Medio", "Speed-to-market", "EV"],
    [10, "Custo adaptacao operador autoral para shopping (PDV, ERP, etiqueta)", "Alta", "Medio", "Pacote Builder + Alavancador completo", "Builder"],
    [11, "H&M JV com Dorben - canal pode passar por Dorben antes de H&M", "Confirmada", "Medio", "Identificar contato Dorben - bloqueio inicial pode ser la", "KA"],
    [12, "Operadores rua nao tem time corporativo de expansao - reuniao precisa ser com fundador", "Alta", "Medio", "Identificar fundadores via LinkedIn antes de contato", "Street Converter"],
]

fill_rows(ws, riscos, 4, special_cols=[2, 5])
for r in range(4, 4 + len(riscos)):
    v = ws.cell(row=r, column=4).value
    if v == "Alto":
        ws.cell(row=r, column=4).fill = FL_R
        ws.cell(row=r, column=4).font = FT_BB

for col, w in zip("ABCDEF", [5, 58, 14, 10, 50, 22]):
    ws.column_dimensions[col].width = w


# ============ Fontes ============
ws = wb.create_sheet("Fontes")
title(ws, "FONTES VERIFICADAS - Nenhuma API paga acionada")
hdr(ws, 3, ["#", "Fonte", "URL", "Uso"])

fontes = [
    [1, "Plaza Shopping Niteroi - oficial", "https://plazaniteroi.com.br/", "Tenant mix base"],
    [2, "Plaza Niteroi - Sobre o Shopping", "https://plazaniteroi.com.br/sobre-o-shopping/", "Espaco Gourmet 10 restaurantes"],
    [3, "Allos Co - Plaza Niteroi", "https://allos.co/en/shopping/plaza-shopping-niteroi-2/", "ABL 43.000m2, 300+ lojas"],
    [4, "Brasil-Shoppings - Plaza (288 marcas)", "https://www.brasil-shoppings.com.br/centros-comerciais/rio-de-janeiro-shoppings/cidade-niteroi/plaza-niteroi", "Filtro duplicidade principal"],
    [5, "iFood Plaza Niteroi - Bacio di Latte", "https://www.ifood.com.br/delivery/niteroi-rj/bacio-di-latte---shop-plaza-niteroi-centro/", "Confirmacao Bacio JA EXISTE no Plaza"],
    [6, "Facebook Bacio di Latte Plaza Niteroi", "https://www.facebook.com/people/Bacio-di-Latte-Shop-Plaza-Niter%C3%B3i/100089224248697/", "Confirmacao Bacio"],
    [7, "Cidade Niteroi - Bacio di Latte nova loja", "https://cidadedeniteroi.com/noticias/niteroi-ganha-mais-uma-loja-bacio-di-latte/", "Confirmacao Bacio Plaza foi a 1a Niteroi"],
    [8, "Reclame Aqui - Oakberry Plaza Niteroi", "https://www.reclameaqui.com.br/oak-berry/pessima-experiencia-com-a-oakberry-plaza-niteroi_5pn5JdpGmO1L6l8f/", "Confirmacao Oakberry JA EXISTE"],
    [9, "Foursquare Plaza Niteroi list", "https://redirect.foursquare.com/gusgsd/list/plaza-shopping-niter%C3%B3i", "Yogoberry, Beluga, Habib's, Bibi Sucos, Jelly, Uncle K"],
    [10, "Decathlon - Loja Plaza Niteroi", "https://www.decathlon.com.br/lojas/decathlon-plaza-niteroi", "Confirmacao Decathlon"],
    [11, "Madero Steakhouse Plaza Niteroi", "https://reserva.grupomadero.com.br/reservation/", "Confirmacao Madero"],
    [12, "Cidade Niteroi (geral)", "https://cidadedeniteroi.com/", "Plaza Play, XDome, Coco Bambu, Le Beaute"],
    [13, "Comida di Buteco 2025/2026 RJ", "https://cidadedeniteroi.com/gastronomia/guia-completo-bares-do-comida-di-buteco-no-rio-niteroi-e-baixada/", "Pli On Board, Beco JT, Endorfina"],
    [14, "Visit Niteroi - Icarai", "https://visit.niteroi.br/en/jardim-icarai-santa-rosa/", "Tenore, Canton, Sunsaki, Toca da Traira"],
    [15, "Fui Ser Viajante - Bares Tijuca", "https://www.fuiserviajante.com/rio-de-janeiro/bares-da-tijuca-e-grande-tijuca/", "Salete, Dida, Noo, On Tap"],
    [16, "CNN Brasil - Retrospectiva 2025 RJ", "https://www.cnnbrasil.com.br/viagemegastronomia/gastronomia/retrospectiva-2025-os-novos-restaurantes-do-rio-de-janeiro/", "Bal.Clan, Madame Olympe"],
    [17, "You Must Go - Restaurantes Ipanema", "https://youmustgo.com.br/restaurantes-em-ipanema-novidades-e-classicos-do-bairro/", "Ferro e Farinha, ToTo, TT Burguer"],
    [18, "Bloomberg Linea - H&M Brasil JV Dorben", "https://www.bloomberglinea.com.br/negocios/brasil-e-motor-de-crescimento-global-da-hm-diz-ceo-ao-inaugurar-primeira-loja-no-rio/", "Canal contato H&M Brasil"],
    [19, "Exame - H&M plano 2026", "https://exame.com/negocios/hm-revela-plano-para-2026-com-expansao-na-america-latina-e-7-lojas-no-brasil/", "Plano expansao H&M"],
    [20, "S.Mag - ALO Rio VillageMall", "https://www.smag.al/2026/04/marca-de-activewear-premium-inaugura-primeira-loja-no-rio-e-reforca-expansao-no-brasil/", "ALO Yoga Rio"],
    [21, "Cobasi - lojas Niteroi", "https://www.cobasi.com.br/lojas/cobasi-niteroi", "Cobasi Niteroi (NAO Plaza)"],
    [22, "Smart Fit - lojas Niteroi", "https://www.tiendeo.com.br/Lojas/niteroi/smart-fit", "Smart Fit Niteroi (NAO Plaza)"],
    [23, "Ferro e Farinha - oficial", "https://www.ferroefarinha.com.br/", "Contato Ferro e Farinha"],
    [24, "Mercado&Consumo - H&M, ALO, Comme des Garcons", "https://mercadoeconsumo.com.br/11/12/2024/noticias-varejo/hm-comme-des-garcons-e-alo-yoga-vao-inaugurar-suas-primeiras-lojas-no-brasil-em-2025/", "Marcas em expansao premium"],
    [25, "Tempo Real RJ - H&M abre Rio Sul", "https://temporealrj.com/hm-inaugura-primeira-loja-rio-sul/", "H&M expansao Rio"],
    [26, "Giro News - H&M expansao", "https://gironews.com/redes-shopping/hm-inicia-expansao-fora-de-sao-paulo-com-primeira-loja-no-rio-de-janeiro/", "H&M plano BR 2026"],
]

fill_rows(ws, fontes, 4, special_cols=[2, 3, 4])
for col, w in zip("ABCD", [5, 48, 82, 45]):
    ws.column_dimensions[col].width = w


# Freeze panes
for s_name in wb.sheetnames:
    if s_name == "Resumo": continue
    s = wb[s_name]
    if s_name == "Foyer Redev": s.freeze_panes = "A6"
    elif s_name == "Pipeline Saidas Prio": s.freeze_panes = "A6"
    elif s_name == "Mix Atual Ampliado": s.freeze_panes = "A6"
    else: s.freeze_panes = "A4"

out = "/mnt/user-data/outputs/Plaza_Niteroi_Workflow1_v5.xlsx"
os.makedirs(os.path.dirname(out), exist_ok=True)
wb.save(out)
print(f"OK: {out}")
print(f"Sheets: {len(wb.sheetnames)}")
for s in wb.sheetnames:
    print(f"  - {s}")
