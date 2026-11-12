from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
import os

wb = Workbook()

FT_T = Font(name="Arial", bold=True, color="FFFFFF", size=12)
FT_H = Font(name="Arial", bold=True, color="FFFFFF", size=10)
FT_B = Font(name="Arial", size=10)
FT_BB = Font(name="Arial", size=10, bold=True)

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

def fill_rows(ws, data, start_row, special_cols=None, num_cols=None, prio_col=None, fit_col=None):
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
            if "MANTIDA" in sv or "AUSENTE" in sv:
                cell.fill = FL_G
            if prio_col and cidx == prio_col:
                if val == "ALTA":
                    cell.fill = FL_R; cell.font = FT_BB
                elif val == "MEDIA" or val == "MÉDIA":
                    cell.fill = FL_BL
            if fit_col and cidx == fit_col and isinstance(val, (int, float)):
                if val >= 85:
                    cell.fill = FL_G
                elif val >= 70:
                    cell.fill = FL_BL

# ============ Resumo ============
ws = wb.active
ws.title = "Resumo"
title(ws, "WORKFLOW 1 v4 — Vacancy-to-Contract | Plaza Niterói | Duplicidade Filtrada")

info = [
    ("Cluster", "Entretenimento (Cinemark mantido)"),
    ("Cidade", "Niterói/RJ - Rua XV de Novembro, 8, Centro"),
    ("ABL total (Allos)", "43.000 m² | 300+ lojas | Inaugurado 1986"),
    ("Vacância tratada", "~6.028 m² em 38 saídas + redev foyer Cinemark 5.097 m²"),
    ("Filtro Duplicidade", "288 marcas mapeadas via brasil-shoppings + allos + plazaniteroi"),
    ("Raio Street Converter", "Niterói (0-10km) + Tijuca (15-20km) + Zona Sul Rio (18-25km)"),
    ("Batalhas", "1) Entretenimento adulto  2) Gastronomia AUTORAL  3) Lojas conceito"),
    ("APIs pagas", "Nenhuma acionada. Apenas fontes públicas."),
    ("Confiança", "8/10 - duplicidade verificada vs lista 288 marcas"),
]
for i, (k, v) in enumerate(info, start=3):
    ws.cell(row=i, column=1, value=k).font = FT_BB
    ws.cell(row=i, column=2, value=v).font = FT_B

ws["A14"] = "CORRECOES DESTA VERSAO v4"
ws["A14"].font = FT_BB
corr = [
    "[X] Outback, Coco Bambu, Madero, Abbraccio, Benihana, L'Entrecote (todos no shopping)",
    "[X] Renner, Riachuelo, C&A, Marisa, Calvin Klein, Lacoste, GAP, Levi's, Reserva (todos no shopping)",
    "[X] Decathlon, Nike, Centauro, Trackfield, World Tennis, Authentic Feet (esporte saturado)",
    "[X] LEGO, Ri Happy, Bay Games, Resident Games (lazer infantil saturado)",
    "[X] Hocus Pocus (quiosque ja existe)",
    "[X] Carter's, Puket, Lilica Tigor, Tip Top, Milon (infantil saturado)",
    "[OK] Foco: entretenimento ADULTO + gastronomia AUTORAL + cafes NICHO",
]
for i, t in enumerate(corr, start=15):
    ws.cell(row=i, column=1, value=t).font = FT_B

ws["A23"] = "ESTRUTURA"
ws["A23"].font = FT_BB
abas = ["1. Resumo", "2. Mix Atual (288 marcas)", "3. Saidas Ano 1", "4. Gaps Reais",
        "5. Foyer Redev v4", "6. Street Niteroi", "7. Street Tijuca", "8. Street Zona Sul",
        "9. Marcas Expansao Rio", "10. Deal Conversion v4", "11. Plano 30/60/90", "12. KPIs", "13. Riscos", "14. Fontes"]
for i, t in enumerate(abas, start=24):
    ws.cell(row=i, column=1, value=t).font = FT_B

ws.column_dimensions["A"].width = 32
ws.column_dimensions["B"].width = 95

# ============ Mix Atual ============
ws = wb.create_sheet("Mix Atual")
title(ws, "MIX ATUAL - marcas verificadas no Plaza (NAO sugerir nada daqui)")
ws["A3"] = "REGRA: NAO sugerir nada nesta aba. Validar antes de pipeline."
ws["A3"].font = FT_BB; ws["A3"].fill = FL_R
ws.merge_cells("A3:D3")
hdr(ws, 5, ["Categoria", "Marca", "Fonte verificacao", "Obs"])

mix = [
    ("Cinema", "Cinemark", "plazaniteroi + Ingresso.com", "Anchor mantida - foyer 5.097m2 em redev"),
    ("Gastro Premium", "Coco Bambu", "plazaniteroi/sobre-o-shopping", "Espaco Gourmet 2.200m2"),
    ("Gastro Premium", "Outback", "plazaniteroi", "Espaco Gourmet"),
    ("Gastro Premium", "Madero", "plazaniteroi", "Espaco Gourmet"),
    ("Gastro Premium", "Abbraccio", "plazaniteroi", "Espaco Gourmet"),
    ("Gastro Premium", "NOI", "plazaniteroi", "Espaco Gourmet"),
    ("Gastro Premium", "Cabana Burger", "plazaniteroi", "Espaco Gourmet"),
    ("Gastro Premium", "Balada Mix", "plazaniteroi", "Espaco Gourmet"),
    ("Gastro Premium", "Tutto Nhoque", "plazaniteroi", "Espaco Gourmet"),
    ("Gastro Premium", "Amelie + Juliette", "plazaniteroi", "Espaco Gourmet"),
    ("Gastro Premium", "Jappa da Quitanda", "plazaniteroi", "Espaco Gourmet"),
    ("Gastro Premium", "L'Entrecote de Paris", "brasil-shoppings", ""),
    ("Gastro Premium", "Benihana", "brasil-shoppings", "Japones"),
    ("Gastro Premium", "Billy The Grill", "brasil-shoppings", ""),
    ("Gastro Premium", "Galli Grill", "brasil-shoppings", ""),
    ("Gastro Premium", "Bond Chop", "brasil-shoppings", ""),
    ("Gastro Premium", "La Mole", "brasil-shoppings", ""),
    ("Gastro Premium", "Gula Gula", "brasil-shoppings", ""),
    ("Gastro Premium", "Mondo Vino", "brasil-shoppings", "Vinho"),
    ("Fast Food", "Burger King", "brasil-shoppings", ""),
    ("Fast Food", "Domino's Pizza", "brasil-shoppings", ""),
    ("Fast Food", "Spoleto", "brasil-shoppings", ""),
    ("Fast Food", "Koni", "brasil-shoppings", ""),
    ("Fast Food", "Gendai", "brasil-shoppings", ""),
    ("Fast Food", "Vivenda do Camarao", "brasil-shoppings", ""),
    ("Fast Food", "Giraffa's", "brasil-shoppings", ""),
    ("Fast Food", "Mister Pizza", "brasil-shoppings", ""),
    ("Fast Food", "Casa do Pao de Queijo", "brasil-shoppings", ""),
    ("Fast Food", "Waffle Store", "brasil-shoppings", ""),
    ("Fast Food", "Bendito Churros", "brasil-shoppings", ""),
    ("Fast Food", "Los Paleteros", "brasil-shoppings", ""),
    ("Fast Food", "Batata Inglesa", "brasil-shoppings", "Lista saidas - validar"),
    ("Cafe/Doceria", "Starbucks", "brasil-shoppings", ""),
    ("Cafe/Doceria", "Mr. Cheney", "brasil-shoppings", ""),
    ("Cafe/Doceria", "Kopenhagen", "brasil-shoppings", ""),
    ("Cafe/Doceria", "Havanna", "brasil-shoppings", ""),
    ("Cafe/Doceria", "Mahogany", "brasil-shoppings", ""),
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
    ("Moda Fem.", "Cynthia Pamplona", "brasil-shoppings", ""),
    ("Moda Fem.", "+15 outras marcas femininas", "brasil-shoppings", "Sacada, Salienta, Limits, Madame MS, Beluga, etc."),
    ("Moda Masc.", "Calvin Klein", "brasil-shoppings", ""),
    ("Moda Masc.", "Lacoste", "brasil-shoppings", ""),
    ("Moda Masc.", "Levi's", "brasil-shoppings", ""),
    ("Moda Masc.", "GAP", "brasil-shoppings", ""),
    ("Moda Masc.", "Brooksfield", "brasil-shoppings", ""),
    ("Moda Masc.", "Reserva", "brasil-shoppings", ""),
    ("Moda Masc.", "Richard's", "brasil-shoppings", ""),
    ("Moda Masc.", "Osklen", "brasil-shoppings", ""),
    ("Moda Masc.", "John John", "brasil-shoppings", ""),
    ("Moda Masc.", "Camisaria Colombo", "brasil-shoppings", ""),
    ("Moda Masc.", "Dudalina, Wollner, Hering, Taco, +10", "brasil-shoppings", "Moda masc. saturada"),
    ("Lingerie", "Intimissimi, Hope, Loungerie, Lupo, Liga Retro", "brasil-shoppings", ""),
    ("Moda Praia", "UV Line, Board Session, WQ Surf", "brasil-shoppings", ""),
    ("Moda Infantil", "Lilica Tigor, Milon, Alphabeto, Tip Top, Carter's, Mini Einstein", "brasil-shoppings", "Saturado"),
    ("Calcados", "Arezzo, Schutz/Outer Shoes, Santa Lolla, Carmen Steffens, Dumond, +20", "brasil-shoppings", "Saturado"),
    ("Esporte", "Nike, Centauro, DECATHLON, Trackfield, World Tennis, Authentic Feet, Atlhetic Way", "decathlon.com.br + brasil-shoppings", "Categoria SATURADA"),
    ("Beleza", "Sephora, MAC, L'Occitane (x2), Granado (x2), Dermage, Contem 1G, O Boticario, +5", "brasil-shoppings", "Saturado"),
    ("Salao", "Jacques Janine, Walter Coiffeur, Unhas Express, Depyl", "brasil-shoppings", ""),
    ("Joia", "Vivara, Pandora, Swarovski, H. Stern, Rommanel, Monte Carlo, +5", "brasil-shoppings", "Saturado"),
    ("Otica", "Otica Raysol, Oticas Carol, Maxvision, Hospital Olhos, Fast Frame", "brasil-shoppings", "Saturado"),
    ("Casa", "Tok&Stok, Camicado, Oppa, MMartan, First Class, Zelo, Imaginarium, +5", "brasil-shoppings", "CAMEBA saturada"),
    ("Eletro/Tech", "Casas Bahia, Ponto Frio, Fast Shop, Polishop, Americanas, iPlace, Samsung, Microsoft, Sony, +5", "brasil-shoppings", "Saturado"),
    ("Telefonia", "Vivo, TIM, Claro, Oi, Nextel, Telmix, Ponto Certo", "brasil-shoppings", "Saturado"),
    ("Lazer infantil", "LEGO, Ri Happy, Bay Games, World Games, Resident Games, Tempo Recreio, Toy Place", "brasil-shoppings", "SATURADO - NAO repor"),
    ("Lazer infantil", "Plaza Play, XDome, Bolinha Parque, Youplay, Ilha Aventura", "Jornal DR1 + Allos", "Espacos proprios do shopping"),
    ("Cinema/Som", "Tropical Music, Guitar Sound, Piticas, Saraiva (x2)", "brasil-shoppings", ""),
    ("Pet", "Zee.Dog, Animal Tour", "brasil-shoppings", "Pouco - gap real"),
    ("Saude/Farmacia", "DrogaRaia, Drogasmil, Hospital dos Olhos", "brasil-shoppings", "Saturado farmacia, gap clinica"),
    ("Servicos", "HSBC, Monaco Loterias, CVC, Flytour, Arranjos Express, Wizard, +20", "brasil-shoppings", ""),
    ("Servicos", "HOCUS POCUS (quiosque)", "Usuario confirmou", "Quiosque cervejaria - NAO repor"),
]

for i, r in enumerate(mix, start=6):
    for cidx, val in enumerate(r, 1):
        c = ws.cell(row=i, column=cidx, value=val)
        c.font = FT_B; c.alignment = AL; c.border = BD
        if i % 2 == 0: c.fill = FL_A
        if "validar" in str(val).lower() or "saidas" in str(val).lower(): c.fill = FL_NV

ws.cell(row=len(mix)+8, column=1, value=f"Total verificado: {len(mix)} linhas (cobre ~288 marcas individuais)").font = FT_BB
for col, w in zip("ABCD", [22, 50, 38, 45]): ws.column_dimensions[col].width = w

# ============ Saidas ============
ws = wb.create_sheet("Saidas Ano 1")
title(ws, "SAIDAS ANO 1 - Cinemark mantida; outras a validar")
hdr(ws, 3, ["#", "Segmento", "Loja", "Tier", "ABL (m2)", "Status", "Tese reposicao (sem duplicar)", "Prio"])

saidas = [
    [1, "Cinema", "Cinemark (foyer)", "Tier 1", 5097, "MANTIDA - redev", "Foyer INDOOR: entret. adulto + cafes nicho + autoral local", "ALTA"],
    [2, "Departamento", "Lojas Americanas", "Tier 1", 2724, "n.v. - validar", "H&M (em expansao Rio 2026 - Plaza fora plano) OU outlet hibrido", "ALTA"],
    [3, "Lazer/Games", "World Games", "Tier 3", 451, "Saida", "NAO repor (lazer infantil saturado). Pivotar p/ entret. adulto", "BAIXA"],
    [4, "Servicos", "Dinisa", "Tier 3", 326, "Saida", "Servicos recorrentes (lavanderia premium, conserto)", "MEDIA"],
    [5, "Restaurantes", "Viena E Batata Inglesa", "Tier 3", 256, "Saida", "Autoral Niteroi (Canton, Sunsaki, Toca da Traira)", "MEDIA"],
    [6, "Esportes", "Adidas", "Tier 1", 205, "Saida", "Esporte saturado. Pivotar p/ ALO activewear, wellness", "MEDIA"],
    [7, "Moda Fem.", "Zinzane", "Tier 1", 198, "Saida", "DTC nativa digital ou regional", "BAIXA"],
    [8, "Saude", "Espaco Crescer", "Tier 3", 165, "Saida", "Clinica multi-especialidade ou dermato estetica", "MEDIA"],
    [9, "Beleza", "Walter's Coiffeur", "Tier 3", 141, "Saida", "Le Beaute Salon Bar (Icarai) ou Studio W", "MEDIA"],
    [10, "Moda Fem.", "Lizie", "Tier 1", 126, "Saida", "Multimarca regional", "BAIXA"],
    [11, "Telefonia", "Vivo", "Tier 1", 118, "n.v. - validar", "Saturado - se saida, pivotar", "MEDIA"],
    [12, "Moda Geral", "Star Point", "Tier 2", 93, "Saida", "Marca local autoral", "BAIXA"],
    [13, "Moda Fem.", "Aquamar", "Tier 3", 80, "Saida", "Marca local", "BAIXA"],
    [14, "Calcados", "Havaianas", "Tier 1", 78, "n.v. - validar", "Se saida, pivotar p/ Vans", "MEDIA"],
    [15, "CAMEBA", "Mmartan", "Tier 1", 75, "Saida", "Saturado - pivotar", "BAIXA"],
    [16, "Restaurantes", "Mania De Churrasco", "Tier 1", 74, "Saida", "Autoral (Tenore Icarai, Vikings Tijuca)", "MEDIA"],
    [17, "Otica", "Kza Otica", "Tier 3", 69, "Saida", "Saturado - consolidar", "BAIXA"],
    [18, "Moda Fem.", "From", "Tier 3", 66, "Saida", "Local", "BAIXA"],
    [19, "Academia", "Fisico E Forma", "Tier 2", 65, "Saida", "Wellness studio (yoga, pilates) ou suplementos", "MEDIA"],
    [20, "Moda Fem.", "Garage Vintage", "Tier 3", 58, "Saida", "Multimarca vintage", "BAIXA"],
    [21, "Moda Masc.", "Ad Life Style", "Tier 2", 55, "Saida", "Autoral", "BAIXA"],
    [22, "Moda Geral", "55 Rj", "Tier 3", 50, "Saida", "Local", "BAIXA"],
    [23, "Moda Fem.", "Glam By", "Tier 3", 49, "Saida", "Multimarca", "BAIXA"],
    [24, "Brinquedos", "Criamigos", "Tier 1", 44, "Saida", "NAO repor (saturado)", "BAIXA"],
    [25, "Fast Food", "Taco Bell", "Tier 1", 43, "Saida", "Fast casual mexicano autoral", "BAIXA"],
    [26, "Beleza", "Cor E Unha Fashion Hair", "Tier 3", 41, "Saida", "Esmalteria express", "BAIXA"],
    [27, "Moda Infantil", "Puket", "Tier 1", 40, "Saida", "Saturado - pivotar", "BAIXA"],
    [28, "Calcados", "Energia Kids", "Tier 3", 38, "Saida", "Saturado - pivotar", "BAIXA"],
    [29, "Otica", "Otica Maxvision", "Tier 3", 35, "Saida", "Consolidar", "BAIXA"],
    [30, "Acessorios", "I Love Biju", "Tier 3", 35, "Saida", "Quiosque", "BAIXA"],
    [31, "Calcados Fem.", "Picadilly", "Tier 1", 34, "Saida", "Saturado", "BAIXA"],
    [32, "Beleza", "Sobrancelhas", "Tier 1", 34, "Saida", "Studio W", "BAIXA"],
    [33, "Produtos", "Vx Case", "Tier 2", 33, "Saida", "Saturado", "BAIXA"],
    [34, "Cafe", "B&B Cafeteria", "Tier 3", 33, "Saida", "Cafe especial nicho (Suplicy, Octavio)", "MEDIA"],
    [35, "CAMEBA", "First Class", "Tier 1", 29, "n.v. - validar", "Se saida, pivotar", "BAIXA"],
    [36, "Cafe", "Cacau Noir", "Tier 2", 26, "Saida", "Brigaderia autoral", "BAIXA"],
    [37, "Moda Fem.", "Marmello Modas", "Tier 3", 18, "Saida", "Quiosque", "BAIXA"],
    [38, "Cosmeticos", "Sensoria", "Tier 3", 13, "n.v. - validar", "Se saida, pivotar", "BAIXA"],
    [39, "Fast Food", "Mc Donald's2", "Tier 1", 10, "Saida", "Residual", "BAIXA"],
]

fill_rows(ws, saidas, 4, special_cols=[2,3,6,7], num_cols=[5], prio_col=8)
tot_row = len(saidas) + 4
ws.cell(row=tot_row, column=1, value="TOTAL").font = FT_BB
c = ws.cell(row=tot_row, column=5, value=f"=SUM(E4:E{tot_row-1})")
c.font = FT_BB; c.number_format = "#,##0"

for col, w in zip("ABCDEFGH", [5, 14, 25, 8, 10, 20, 55, 9]):
    ws.column_dimensions[col].width = w

# ============ Gaps Reais ============
ws = wb.create_sheet("Gaps Reais")
title(ws, "GAPS REAIS - Apos filtro vs 288 marcas")
hdr(ws, 3, ["#", "Categoria", "Por que e gap", "Operadores AUSENTES do Plaza", "Conf.", "Prio"])

gaps = [
    [1, "Bowling/Boliche compacto", "Nenhuma op de boliche nas 288 marcas", "Bossa Nova Bowl, Galaxy Bowling (n.v. expansao)", "Alta", "ALTA"],
    [2, "Escape Room/VR experiencial", "Nao ha escape nem VR (XDome e game tradicional)", "Lock Quest, EnigMa, Sherlock, Sandbox VR", "Alta", "ALTA"],
    [3, "Karaoke privativo", "Inexistente", "n.v. operadores BR", "Media", "MEDIA"],
    [4, "Sorveteria experiencial premium", "Plaza tem Mr.Cheney, Kopenhagen mas nao italiana experiencial", "Bacio di Latte (expansao forte BR)", "Alta", "ALTA"],
    [5, "Acai premium", "Sem Oakberry ou similar", "Oakberry (expansao global)", "Alta", "ALTA"],
    [6, "Bubble tea", "Inexistente", "Chatime (expansao BR)", "Media", "MEDIA"],
    [7, "Cafes especiais nicho", "Plaza tem Starbucks mas nao cafes autorais", "Suplicy Cafes, Octavio, Cafezzal, The Coffee", "Media", "MEDIA"],
    [8, "Fast-fashion internacional", "Tem GAP mas nao H&M nem Zara", "H&M (expandindo Rio 2026: RioSul abr/26, NorteShopping proxima)", "Alta", "ALTA"],
    [9, "Activewear premium", "Esporte tradicional saturado, falta lifestyle premium", "ALO Yoga (abriu Rio abr/26 VillageMall)", "Media", "MEDIA"],
    [10, "Gastro autoral local", "19+ ops gastro mas todas cadeias mainstream", "Ver Street Converter Niteroi/Tijuca/Zona Sul", "Alta", "ALTA"],
    [11, "Hamburguer autoral", "Tem BK, Cabana, McD, Galli, Bond Chop - falta autoral premium", "Clan BBQ/Bal.Clan, TT Burguer, Bullguer", "Alta", "ALTA"],
    [12, "Pizza autoral", "Tem Domino's, Mister Pizza, La Mole - falta autoral fermentacao natural", "Ferro e Farinha (Sei Shiroma, 4 unidades RJ)", "Alta", "ALTA"],
    [13, "Wellness studio", "Fisico Forma saiu - falta yoga/pilates premium", "Pilates Premium studios, Smartfit (n.v.)", "Media", "MEDIA"],
    [14, "Pet shop completo", "Tem Zee.Dog (acessorios), falta banho/tosa", "Cobasi/Petz formato compacto", "Media", "MEDIA"],
    [15, "Clinica/Estetica", "Tem Hospital Olhos. Falta multi-especialidade e dermato", "Dr. Consulta, Onodera Estetica", "Media", "MEDIA"],
]

fill_rows(ws, gaps, 4, special_cols=[2,3,4], prio_col=6)
for col, w in zip("ABCDEF", [5, 28, 40, 50, 9, 10]):
    ws.column_dimensions[col].width = w

# ============ Foyer ============
ws = wb.create_sheet("Foyer Redev v4")
title(ws, "FOYER REDEV v4 - 5.097m2 INDOOR | Operadores AUSENTES do Plaza")
ws["A3"] = "100% das ops sugeridas AUSENTES do Plaza. Conceitos INDOOR (NAO Taste Lab)."
ws["A3"].font = FT_BB
ws.merge_cells("A3:F3")
hdr(ws, 5, ["Sub-zona", "ABL (m2)", "Conceito", "Operadores-alvo (ausentes)", "Fit", "Status"])

foyer = [
    ["Entretenimento adulto", 1500, "Boliche + escape rooms + VR + simuladores",
     "Bossa Nova Bowl, Lock Quest, EnigMa, Sandbox VR (todos AUSENTES; n.v. RJ)", 90, "Lead"],
    ["Karaoke privativo", 600, "Salas privadas estilo asiatico",
     "n.v. operadores BR - prospectar", 70, "Lead"],
    ["Sorveterias + Cafes nicho", 1000, "5-7 ops premium NAO cadeia mainstream",
     "Bacio di Latte, Oakberry, Chatime, Suplicy, Octavio, brigaderia autoral - AUSENTES", 88, "Lead"],
    ["Gastrobar autoral local", 800, "1-2 operadores Niteroi/Tijuca/Zona Sul",
     "Canton (Niteroi), Pli On Board (Niteroi), Clan BBQ/Bal.Clan (Leblon), Ferro e Farinha (RJ) - AUSENTES", 90, "Lead"],
    ["Hamburguer + Pizza autorais", 600, "Categoria autoral falta (cadeias estao)",
     "Ferro e Farinha (forno duplex), Bal.Clan, TT Burguer (Troisgros), Bullguer - AUSENTES", 88, "Lead"],
    ["Pop-up + DTC showroom", 600, "Rotacao mensal + showroom DTC",
     "Pop-up Appearhere + showroom Insider/Amaro/Basico.com - AUSENTES", 80, "Lead"],
]

fill_rows(ws, foyer, 6, special_cols=[1,3,4], num_cols=[2], fit_col=5)
tot_row = len(foyer) + 6
c = ws.cell(row=tot_row, column=1, value="TOTAL FOYER"); c.font = FT_BB
c2 = ws.cell(row=tot_row, column=2, value=f"=SUM(B6:B{tot_row-1})")
c2.font = FT_BB; c2.number_format = "#,##0"; c2.fill = FL_G

for col, w in zip("ABCDEF", [28, 10, 38, 60, 8, 10]):
    ws.column_dimensions[col].width = w

# ============ Street Niteroi ============
ws = wb.create_sheet("Street Niteroi")
title(ws, "STREET CONVERTER - NITEROI (0-10km) | Todos AUSENTES do Plaza")
hdr(ws, 5, ["Operador", "Bairro/Endereco", "Categoria", "Tracao", "Fit", "Status Plaza", "Tese", "Acao"])

st_n = [
    ["Canton Peruvian & Chinese", "Sao Francisco beira-mar", "Chifa autoral", "Op consolidada SP+RJ; fila; ticket R$50-80", 85, "AUSENTE", "Conceito experiencial diferenciado", "Reuniao"],
    ["Pli On Board", "Niteroi", "Boteco autoral", "Vencedor Comida di Buteco Niteroi 2025", 82, "AUSENTE", "Gastrobar premiado", "Reuniao foyer"],
    ["Sunsaki", "Icarai", "Japones contemporaneo", "Referencia local; rodizio + a la carte", 78, "AUSENTE (Jappa e tradicional)", "Substitui japones moderno", "Sondar"],
    ["Tenore Churrascaria", "Icarai (Av. J.A.F. Torres, 521)", "Churrascaria com vista", "Vista praia Icarai; rodizio robusto", 72, "AUSENTE", "Substituir Mania Churrasco qualificado", "Sondar"],
    ["Buzin Gastronomia", "Icarai (Gen. Pereira Silva, 169)", "Restaurante autoral", "Local consolidado", 70, "AUSENTE", "Op rua autoral", "Sondar"],
    ["Lucca Forneria", "Icarai (Dr. Leandro Mota, 142)", "Italiana fermentacao natural", "Massa fermentacao natural", 68, "AUSENTE", "Forneria autoral diferenciada", "Sondar"],
    ["Da Carmine", "Icarai (Mariz e Barros, 305)", "Pizzaria autoral", "Pizzaria bairro estabelecida", 65, "AUSENTE", "Pizza autoral", "Sondar"],
    ["Toca da Traira", "Icarai (Mem de Sa, 8)", "Peixe e frutos do mar", "Op consolidada", 70, "AUSENTE", "Categoria ausente", "Sondar"],
    ["Le Beaute Salon Bar", "Icarai", "Beleza + bar/bistro", "Conceito hibrido exclusivo Niteroi", 78, "AUSENTE", "Substituir Walter's Coiffeur", "Reuniao"],
    ["Beco JT / Endorfina / Nosso Boteco", "Icarai (varios)", "Botecos CdB 2026", "Botecos Icarai autenticos", 60, "AUSENTE", "Vetor multimarcas - Mand. 7", "Pacote"],
]

fill_rows(ws, st_n, 6, special_cols=[1,2,3,4,7,8], fit_col=5)
for col, w in zip("ABCDEFGH", [28, 32, 22, 32, 8, 25, 35, 20]):
    ws.column_dimensions[col].width = w

# ============ Street Tijuca ============
ws = wb.create_sheet("Street Tijuca")
title(ws, "STREET CONVERTER - TIJUCA (15-20km via Ponte) | Todos AUSENTES do Plaza")
hdr(ws, 5, ["Operador", "Bairro/Endereco", "Categoria", "Tracao", "Fit", "Status Plaza", "Tese", "Acao"])

st_t = [
    ["Salete", "Tijuca (Afonso Pena, 189)", "Empadaria 60+ anos", "Empadas famosas; +60 anos historia", 75, "AUSENTE", "Conceito autoral tradicional", "Sondar"],
    ["Brasa Gourmet", "Tijuca", "Churrascaria", "Local tradicional", 68, "AUSENTE", "Alternativa Mania Churrasco saida", "Sondar"],
    ["Vikings (Tijuca)", "Tijuca", "Steaks/seafood/sandwiches", "Rede com unidade Tijuca", 65, "AUSENTE", "Variedade carnes/frutos do mar", "Sondar"],
    ["Noo Cachacaria", "Praca da Bandeira", "Cachacaria autoral pet-friendly", "Ampla selecao; pet friendly", 78, "AUSENTE", "Conceito autoral + pet friendly", "Reuniao"],
    ["Dida Bar e Restaurante", "Praca da Bandeira (B. Iguatemi, 379)", "Boteco feijoada premiada", "Feijoada considerada uma das melhores RJ", 72, "AUSENTE", "Feijoada autoral referencia", "Sondar"],
    ["On Tap", "Tijuca", "Pub artesanal cervejas", "Pub temas tematico irlandes", 70, "AUSENTE (Hocus quiosque)", "Pub completo diferente quiosque", "Sondar"],
    ["Padaria Santa Marta", "Tijuca (Praca Saens Pena)", "Padaria/Confeitaria", "Tradicional Tijuca", 60, "AUSENTE", "Padaria tradicional - avaliar quiosque", "Sondar"],
    ["Confeitaria Rita de Cassia", "Tijuca (Conde de Bonfim, desde 1971)", "Confeitaria familiar", "55+ anos historia", 65, "AUSENTE", "Conceito carioca", "Sondar"],
]

fill_rows(ws, st_t, 6, special_cols=[1,2,3,4,7,8], fit_col=5)
for col, w in zip("ABCDEFGH", [28, 38, 25, 38, 8, 28, 35, 18]):
    ws.column_dimensions[col].width = w

# ============ Street Zona Sul ============
ws = wb.create_sheet("Street Zona Sul")
title(ws, "STREET CONVERTER - ZONA SUL RIO (18-25km via Ponte) | Todos AUSENTES do Plaza")
hdr(ws, 5, ["Operador", "Bairro/Endereco", "Categoria", "Tracao", "Fit", "Status Plaza", "Tese", "Acao"])

st_zs = [
    ["Clan BBQ / Bal.Clan", "Leblon (Dias Ferreira) - Bal.Clan no Shopping Leblon", "Hamburguer autoral", "Versao express ja no Shopping Leblon; chefs Pepo Figueiredo + Newton Rique", 88, "AUSENTE", "Marca ja validada em mall (Shopping Leblon)", "Reuniao prioritaria"],
    ["Ferro e Farinha", "Ipanema + Botafogo + Leblon + Barra (4 unidades)", "Pizza fermentacao natural", "1o forno a lenha duplex BR; chef Sei Shiroma", 85, "AUSENTE", "Pizza autoral premium", "Reuniao prioritaria"],
    ["TT Burguer (Troisgros)", "Varias unidades RJ", "Hamburguer Troisgros", "Op consolidada chef Troisgros", 82, "AUSENTE", "Hamburguer autoral premium grupo Troisgros", "Sondar"],
    ["CT Boucherie (Claude Troisgros)", "Leblon", "Carnes francesas premium", "Op chef Claude Troisgros", 78, "AUSENTE", "Carnes premium diferente Outback/Madero", "Sondar"],
    ["IT Ristorante", "Shopping Leblon 4o piso", "Italiano com vista Cristo", "Modelo expansao mall validado", 80, "AUSENTE (cadeias italianas existem)", "Italiano premium modelo mall validado", "Sondar"],
    ["Quiteria Restaurant", "Ipanema (Maria Quiteria, 27)", "Brasileira contemporanea", "Conceito brasileiro contemporaneo", 75, "AUSENTE", "Brasileira premium", "Sondar"],
    ["Madame Olympe", "Leblon (Conde Bernadotte, 26)", "Frances by C. Troisgros", "Novo (2025) + chef Jessica", 76, "AUSENTE", "Frances premium novo conceito", "Sondar"],
    ["Bullguer", "Varias Zona Sul RJ", "Hamburguer autoral consolidado", "Op varias unidades RJ", 75, "AUSENTE", "Hamburguer autoral", "Sondar (validar status)"],
    ["Cedilha Bar", "Ipanema (Hotel Janeiro)", "Bar pos-praia", "Reaberto 2025 menu conciso", 70, "AUSENTE", "Bar conceito", "Sondar"],
]

fill_rows(ws, st_zs, 6, special_cols=[1,2,3,4,7,8], fit_col=5)
for col, w in zip("ABCDEFGH", [32, 42, 25, 40, 8, 30, 35, 22]):
    ws.column_dimensions[col].width = w

# ============ Marcas Expansao Rio ============
ws = wb.create_sheet("Marcas Expansao Rio")
title(ws, "MARCAS EM EXPANSAO RIO 2026 - Verificadas")
hdr(ws, 3, ["Marca", "Status RJ 2026", "Plano expansao", "Fit Plaza", "Tese de abordagem", "Prio", "Fonte"])

mexp = [
    ["H&M", "RioSul aberta 25/04/2026; NorteShopping proxima", "7 lojas BR em 2026; meta todos estados ate 2028", 88,
     "Plaza Niteroi NAO esta no plano atual. Pitch como 3a loja RJ. Caixa Americanas 2.724m2 ideal", "ALTA",
     "Promoview + Tempo Real RJ + Giro News (abr/2026)"],
    ["ALO Activewear", "1a loja Rio - VillageMall abr/2026", "Expansao BR ampliada", 75,
     "Activewear premium nao saturado. Quiosque ou caixa media", "MEDIA",
     "S.Mag.al (abr/2026)"],
    ["NV (moda fem.)", "Curitiba (Barigui), Rio Design Barra, Uberlandia", "Novo conceito 275m2", 70,
     "Avaliar caixa Zinzane (198m2)", "MEDIA",
     "FashionNetwork (nov/2024)"],
    ["Cinepolis", "Varias unidades BR", "Expansao BR ativa", 50,
     "Duplicaria Cinemark - DESCONSIDERAR", "BAIXA",
     "Promoview"],
    ["BAW Clothing (Arezzo)", "1a loja fisica SP", "Grupo Arezzo ja no Plaza", 60,
     "Grupo ja consolidado no shopping - avaliar standalone", "BAIXA",
     "Exame"],
]

fill_rows(ws, mexp, 4, special_cols=[1,2,3,5,7], fit_col=4, prio_col=6)
for col, w in zip("ABCDEFG", [22, 35, 40, 9, 50, 12, 38]):
    ws.column_dimensions[col].width = w

# ============ Deal Conversion v4 ============
ws = wb.create_sheet("Deal Conversion v4")
title(ws, "DEAL CONVERSION TABLE v4")
hdr(ws, 3, ["ID", "Espaco/Caixa", "ABL", "Tese (sem duplicar)", "Fit", "Estagio", "Dono", "Acao", "Prazo", "Prob", "Blocker", "Impacto"])

deals = [
    ["OPP-F1", "Foyer / Master Plan INDOOR", 5097, "Conceito INDOOR (NAO Taste Lab): entret. adulto + cafes nicho + autoral", 92, "Conceito", "Allos Desenv. + EV", "Apresentar conceito + CAPEX", 15, "70%", "Aprovacao CAPEX", "Alto"],
    ["OPP-F2", "Foyer / Entret. Adulto", 1500, "Boliche + escape + VR (Bossa Nova Bowl/Lock Quest/Sandbox VR) AUSENTES", 90, "Lead", "KA", "Sondar 3 ops BR", 45, "45%", "Disp. marca Rio", "Alto"],
    ["OPP-F3", "Foyer / Cafes nicho + sorveteria", 1000, "Bacio di Latte, Oakberry, Suplicy, Chatime - AUSENTES", 88, "Lead", "Hunter+KA", "Top 10 abordagens", 45, "60%", "Curadoria", "M-Alto"],
    ["OPP-F4", "Foyer / Gastrobar autoral", 800, "Canton (Niteroi) ou Pli On Board ou Clan BBQ/Bal.Clan (Leblon) ou Ferro e Farinha", 90, "Lead", "Street Conv.", "Reuniao top 3", 45, "50%", "Convenc. rua->mall", "Alto"],
    ["OPP-F5", "Foyer / Hamb + Pizza autorais", 600, "Bal.Clan + Ferro e Farinha - AUSENTES (cadeias ja tem)", 88, "Lead", "Street Conv.", "Reuniao + tese", 45, "50%", "Convenc.", "M-Alto"],
    ["OPP-F6", "Foyer / Pop-up + DTC showroom", 600, "Rotacao + showroom Insider/Amaro/Basico.com - AUSENTES", 80, "Lead", "Hunter", "Modelo comercial", 30, "55%", "Modelo", "Medio"],
    ["OPP-F7", "Foyer / Karaoke privativo", 600, "Conceito ausente", 75, "Lead", "KA", "Identificar redes BR", 60, "30%", "Op qualificado", "Medio"],
    ["OPP-B-H&M", "Americanas (Plano A)", 2724, "H&M - expansao Rio 2026 confirmada; Plaza fora plano - pitch ativo", 90, "Lead", "Diretoria + KA", "Reuniao H&M Brasil", 30, "40%", "Decisao H&M 3a loja RJ", "Muito Alto"],
    ["OPP-B-Out", "Americanas (Plano B)", 2724, "Se H&M nao fechar: outlet hibrido (Nike+Adidas Outlet) ou nova categoria", 75, "Lead", "KA", "Plano B paralelo", 45, "35%", "n.v.", "Alto"],
    ["OPP-M-Adidas", "Adidas saida", 205, "Esporte saturado - pivotar p/ ALO ou wellness", 70, "Lead", "KA", "Sondar ALO (ja Rio)", 30, "40%", "n.v.", "Medio"],
    ["OPP-M-Rest", "Mania Churr + Viena (330m2)", 330, "Autoral - Tenore (Icarai), Buzin, Toca da Traira, Brasa Gourmet (Tijuca)", 78, "Lead", "Street Conv.", "Top 5 abordagens", 30, "50%", "Convenc.", "Medio"],
    ["OPP-M-Beleza", "Walter Coiffeur 141m2", 141, "Le Beaute Salon Bar (beleza+bar Icarai) AUSENTE", 78, "Lead", "Street Conv.", "Reuniao", 30, "55%", "Convenc.", "Medio"],
    ["OPP-M-Saude", "Espaco Crescer 165m2", 165, "Clinica multi-especialidade ou dermato (Dr. Consulta, Onodera)", 70, "Lead", "KA", "Sondar Dr. Consulta", 45, "45%", "n.v.", "Medio"],
    ["OPP-M-Fem", "Moda fem. 5 caixas 457m2", 457, "DTC nativa digital (Linus, Zerezes) ou marca regional", 65, "Lead", "Hunter", "Map DTC RJ", 45, "40%", "Op escala", "Medio"],
    ["OPP-M-Rest2", "Caixas medias restantes 700m2", 700, "Caso a caso - evitar duplicar saturado", 60, "Lead", "Hunter", "Analise", 45, "40%", "n.v.", "B-M"],
    ["OPP-P", "Lote 28 caixas pequenas 1485m2", 1485, "1-2 multifranqueados RJ - Mand. 8", 55, "Lead", "Farmer", "Map multifranq RJ", 60, "30%", "Op unico", "M agreg."],
]

fill_rows(ws, deals, 4, special_cols=[2,4,8,11,12], num_cols=[3], fit_col=5)
tot_row = len(deals) + 4
ws.cell(row=tot_row, column=1, value="TOTAL").font = FT_BB
c = ws.cell(row=tot_row, column=3, value=f"=SUM(C4:C{tot_row-1})")
c.font = FT_BB; c.number_format = "#,##0"

for col, w in zip("ABCDEFGHIJKL", [12, 30, 9, 55, 8, 11, 22, 28, 9, 9, 22, 13]):
    ws.column_dimensions[col].width = w

# ============ Plano ============
ws = wb.create_sheet("Plano 30-60-90")
title(ws, "PLANO 30/60/90 DIAS v4")
hdr(ws, 3, ["Horizonte", "Acao", "Dono", "Entregavel", "KPI", "Status"])

plano = [
    ["30 dias", "Aprovar conceito INDOOR do foyer (NAO Taste Lab)", "Allos Desenv. + EV", "Aprov. exec. + CAPEX preliminar", "Aprov. binaria", "Pendente"],
    ["30 dias", "Pitch H&M Brasil para Americanas 2.724m2", "Diretoria + KA", "Reuniao H&M", "Resposta H&M", "Pendente"],
    ["30 dias", "Reunioes prio: Bal.Clan + Ferro Farinha + Canton + Pli On Board", "Street Conv.", "4 reunioes", "# LOIs em curso", "Pendente"],
    ["30 dias", "Curadoria 10 marcas quick-gastro (Bacio, Oakberry, Suplicy, Chatime)", "Hunter+KA", "Lista + 3 abordagens", "# abordagens", "Pendente"],
    ["30 dias", "Sondar ALO Activewear (ja Rio)", "KA", "1 reuniao", "Resposta ALO", "Pendente"],
    ["30 dias", "Validar status real das 39 saidas com EV", "EV Plaza", "Lista corrigida", "Lista validada", "Pendente"],
    ["30 dias", "Mapear 5 multifranqueados RJ (Mand. 8)", "Farmer", "Lista qualificada", "# identificados", "Pendente"],
    ["60 dias", "Master plan em projeto executivo", "Builder Allos", "Plantas executivas", "Aprovacao", "Pendente"],
    ["60 dias", "10 reunioes Street Converter (NI+TJ+ZS)", "Street Conv.", "10 reunioes", "Lead->LOI", "Pendente"],
    ["60 dias", "LOI ancora foyer entretenimento", "KA", "1 LOI", "1 LOI", "Pendente"],
    ["60 dias", "LOI gastrobar autoral foyer", "Street Conv.", "1 LOI", "1 LOI", "Pendente"],
    ["60 dias", "Proposta formal Americanas (H&M ou B)", "KA", "Proposta", "Proposta enviada", "Pendente"],
    ["90 dias", "3+ LOIs foyer assinados", "KA+Street Conv.", "3 LOIs", ">=3 LOIs", "Pendente"],
    ["90 dias", "Contrato ancora foyer assinado", "KA", "1 contrato", "1 contrato", "Pendente"],
    ["90 dias", "Resposta H&M Plaza Niteroi", "Diretoria+KA", "Sim/Nao definido", "Decisao", "Pendente"],
    ["90 dias", "Lote multifranqueado estruturado", "Farmer", "Termsheet", "1 operador", "Pendente"],
    ["90 dias", "Mid-review pipeline", "Orquestrador", "Relatorio", "Pipeline atualizado", "Pendente"],
]

for i, row in enumerate(plano, start=4):
    for cidx, val in enumerate(row, 1):
        c = ws.cell(row=i, column=cidx, value=val)
        c.font = FT_B
        c.alignment = AL if cidx in (2, 4, 5) else AC
        c.border = BD
        if i % 2 == 0: c.fill = FL_A
        if cidx == 1:
            if val == "30 dias": c.fill = FL_R; c.font = FT_BB
            elif val == "60 dias": c.fill = FL_NV; c.font = FT_BB
            else: c.fill = FL_BL; c.font = FT_BB

for col, w in zip("ABCDEF", [10, 60, 22, 28, 28, 11]):
    ws.column_dimensions[col].width = w

# ============ KPIs ============
ws = wb.create_sheet("KPIs")
title(ws, "KPIs - Workflow 1 v4")
hdr(ws, 3, ["KPI", "Base", "Meta 90d", "Meta 180d", "Meta 270d", "Fonte"])

kpis = [
    ["Conceito redev foyer aprovado", "Nao", "Sim", "-", "-", "Allos Desenv."],
    ["Pre-locacao Foyer (% LOIs)", "0%", "30%", "70%", "100%", "Pipeline KA"],
    ["Contratos Foyer assinados (#)", "0", "1", "3", "6", "Juridico Allos"],
    ["Resposta H&M Plaza Niteroi", "Nao abordada", "Sim/Nao", "Decisao final", "-", "KA + Diretoria"],
    ["ABL recolocada / vacancia 6.028 m2", "0%", "30%", "65%", "85%", "Plataforma Espacos"],
    ["Vendas/m2 zona cinema-adj vs anterior", "n.v.", "n.v.", "+25%", "+45%", "Sistema Allos"],
    ["Cluster Fit medio mix novo", "-", ">=78", ">=82", ">=85", "Cluster Engine"],
    ["Dwell time pre/pos cinema", "n.v.", "+10%", "+20%", "+25%", "Beacons/app"],
    ["Dias medios saida -> contrato", "n.v.", "<=180", "<=120", "<=90", "CRM Allos"],
    ["# reunioes Street Converter", "0", "30", "80", "150", "Agenda EV"],
    ["# operadores autorais abordados", "0", "10", "20", "30", "Pipeline"],
    ["# multifranqueados RJ mapeados", "0", "5", "10", "15", "Farmer"],
    ["# LOIs Street->Shopping convertidos", "0", "2", "5", "8", "Pipeline"],
]

fill_rows(ws, kpis, 4, special_cols=[1, 6])
for col, w in zip("ABCDEF", [48, 16, 14, 14, 14, 22]):
    ws.column_dimensions[col].width = w

# ============ Riscos ============
ws = wb.create_sheet("Riscos")
title(ws, "RISCOS E BLOCKERS v4")
hdr(ws, 3, ["#", "Risco", "Prob.", "Impacto", "Mitigacao", "Dono"])

riscos = [
    [1, "CAPEX redev foyer nao aprovado", "Media", "Alto", "Conceito modular - fases", "Allos Desenv."],
    [2, "H&M rejeita Plaza (nao no plano 2026)", "Media-Alta", "Alto", "Plano B paralelo: outlet hibrido", "KA"],
    [3, "Operadores rua nao migram para shopping", "Alta", "Medio", "Pacote Alavancador + caso Bal.Clan Shopping Leblon", "Street Conv."],
    [4, "Cluster mal classificado (Plaza pode ser Passeio Familiar)", "Media", "Alto", "Validar cluster antes do invest.", "Cluster Engine"],
    [5, "Status real das saidas nao confirmado", "Confirmada", "Medio", "EV validar antes pipeline avancar", "EV Plaza"],
    [6, "Sem Sistema Bahia - underwriting direcional", "Confirmada", "Alto", "Liberar acesso interno", "EV + TI Allos"],
    [7, "Sem CRM Farmer estruturado", "Confirmada", "Medio", "Form suitability", "Farmer"],
    [8, "Concorrencia regional reage (Bay Market, Icarai)", "Media", "Medio", "Speed-to-market", "EV"],
    [9, "Lazer infantil e esporte saturados", "Confirmada", "Baixo", "Pivotar caixas", "Cluster Engine"],
    [10, "Lista 288 marcas pode ter desatualizacoes", "Media", "Medio", "Cruzar sistema interno Allos", "EV + Allos"],
    [11, "Carter's anunciado mas abertura nao confirmada", "Media", "Baixo", "Validar com lojista", "EV"],
    [12, "Custo adaptacao operador autoral p/ shopping", "Alta", "Medio", "Pacote Builder + Alavancador", "Builder"],
]

fill_rows(ws, riscos, 4, special_cols=[2, 5])
# Color impact column
for r in range(4, 4+len(riscos)):
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
    [1, "Plaza Shopping Niteroi - oficial", "https://plazaniteroi.com.br/", "Tenant mix, Espaco Gourmet, eventos"],
    [2, "Plaza Niteroi - Sobre o Shopping", "https://plazaniteroi.com.br/sobre-o-shopping/", "Lista Espaco Gourmet 10 restaurantes"],
    [3, "Allos Co - Plaza Niteroi", "https://allos.co/en/shopping/plaza-shopping-niteroi-2/", "ABL 43.000m2, 300+ lojas"],
    [4, "Brasil-Shoppings - Plaza Niteroi (288 marcas)", "https://www.brasil-shoppings.com.br/centros-comerciais/rio-de-janeiro-shoppings/cidade-niteroi/plaza-niteroi", "Fonte principal filtro duplicidade"],
    [5, "Decathlon - Loja Plaza Niteroi", "https://www.decathlon.com.br/lojas/decathlon-plaza-niteroi", "Confirmacao Decathlon"],
    [6, "Cidade de Niteroi", "https://cidadedeniteroi.com/", "Plaza Play, XDome, Coco Bambu, Le Beaute"],
    [7, "Comida di Buteco 2025/2026 RJ", "https://cidadedeniteroi.com/gastronomia/guia-completo-bares-do-comida-di-buteco-no-rio-niteroi-e-baixada/", "Pli On Board vencedor 2025"],
    [8, "Visit Niteroi - Icarai", "https://visit.niteroi.br/en/jardim-icarai-santa-rosa/", "Mapeamento Icarai"],
    [9, "Quintoandar - Restaurantes Niteroi", "https://www.quintoandar.com.br/guias/cidades/restaurantes-em-niteroi/", "Mapeamento gastronomico"],
    [10, "Tripadvisor - Saens Pena", "https://www.tripadvisor.com.br/RestaurantsNear-g303506-d9578410-Saens_Pena-Rio_de_Janeiro_State_of_Rio_de_Janeiro.html", "Mapeamento Tijuca"],
    [11, "Fui Ser Viajante - Bares Tijuca", "https://www.fuiserviajante.com/rio-de-janeiro/bares-da-tijuca-e-grande-tijuca/", "Salete, Dida, Noo, On Tap"],
    [12, "Os Melhores do Rio - Padarias Tijuca", "https://osmelhoresdorio.wordpress.com/2018/07/05/as-melhores-padarias-da-tijuca/", "Padaria Santa Marta"],
    [13, "CNN Brasil - Retrospectiva 2025 RJ", "https://www.cnnbrasil.com.br/viagemegastronomia/gastronomia/retrospectiva-2025-os-novos-restaurantes-do-rio-de-janeiro/", "Bal.Clan, Madame Olympe"],
    [14, "Time Out RJ - Restaurantes Leblon/Ipanema", "https://www.timeout.com/pt/rio-de-janeiro/restaurantes/os-melhores-restaurantes-em-ipanema", "Sushi Leblon, Ipanema"],
    [15, "Judice Araujo - Novos Restaurantes Leblon", "https://blog.judicearaujo.com.br/novos-restaurantes-no-leblon-conheca-as-7-novidades-gastronomicas-do-bairro/", "IT Ristorante"],
    [16, "You Must Go - Restaurantes Ipanema", "https://youmustgo.com.br/restaurantes-em-ipanema-novidades-e-classicos-do-bairro/", "Ferro e Farinha, ToTo, TT Burguer"],
    [17, "Promoview - H&M Rio 2026", "https://www.promoview.com.br/hm-rio-ativacoes-abertura-loja-2026", "Plano expansao H&M Rio"],
    [18, "Giro News - H&M expansao", "https://gironews.com/redes-shopping/hm-inicia-expansao-fora-de-sao-paulo-com-primeira-loja-no-rio-de-janeiro/", "H&M BR 2026"],
    [19, "S.Mag - ALO Rio VillageMall", "https://www.smag.al/2026/04/marca-de-activewear-premium-inaugura-primeira-loja-no-rio-e-reforca-expansao-no-brasil/", "ALO Activewear"],
    [20, "FashionNetwork - NV expansao", "https://br.fashionnetwork.com/news/Nv-inaugura-loja-com-novo-conceito-em-belo-horizonte-e-preve-abertura-de-mais-tres-ainda-em-2024,1680403.html", "NV plano RJ"],
    [21, "Shopify - 10 marcas DTC 2026", "https://www.shopify.com/br/blog/marcas-dtc", "Linus, Basico, Amaro"],
    [22, "Wanderlog - Best Niteroi", "https://wanderlog.com/list/geoCategory/75579/where-to-eat-best-restaurants-in-niteroi", "Canton Chifa, Tenore"],
    [23, "Infomoney - BR Malls Plaza 2013", "https://www.infomoney.com.br/negocios/br-malls-anuncia-expansao-do-shopping-plaza-niteroi/", "Historico Plaza"],
    [24, "Jornal DR1 - Plaza Play", "https://jornaldr1.com.br/plaza-niteroi-inaugura-espaco-infantil-gratuito-com-programacao-especial/", "Saturacao lazer infantil"],
    [25, "Arranjos Express", "https://arranjosexpress.com.br/lojas/loja-shopping-plaza-niteroi/", "Confirmacao loja"],
]

fill_rows(ws, fontes, 4, special_cols=[2, 3, 4])
for col, w in zip("ABCD", [5, 48, 82, 45]):
    ws.column_dimensions[col].width = w

# Freeze panes
for sheet_name in wb.sheetnames:
    if sheet_name == "Resumo":
        continue
    s = wb[sheet_name]
    if sheet_name in ("Foyer Redev v4", "Street Niteroi", "Street Tijuca", "Street Zona Sul"):
        s.freeze_panes = "A6"
    else:
        s.freeze_panes = "A4"

out = "/mnt/user-data/outputs/Plaza_Niteroi_Workflow1_v4.xlsx"
os.makedirs(os.path.dirname(out), exist_ok=True)
wb.save(out)
print(f"OK: {out}")
print(f"Sheets: {len(wb.sheetnames)}")
for s in wb.sheetnames:
    print(f"  - {s}")
