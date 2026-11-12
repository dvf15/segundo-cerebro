from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.formatting.rule import CellIsRule

wb = Workbook()

# -------- Styles --------
FONT_TITLE = Font(name="Arial", bold=True, color="FFFFFF", size=12)
FONT_HDR = Font(name="Arial", bold=True, color="FFFFFF", size=10)
FONT_BODY = Font(name="Arial", size=10)
FONT_BODY_B = Font(name="Arial", size=10, bold=True)
FONT_NOTE = Font(name="Arial", size=9, italic=True, color="555555")

FILL_TITLE = PatternFill("solid", start_color="1F4E78")
FILL_HDR = PatternFill("solid", start_color="2E75B6")
FILL_ALT = PatternFill("solid", start_color="F2F2F2")
FILL_NV = PatternFill("solid", start_color="FFF2CC")  # n.v.
FILL_GREEN = PatternFill("solid", start_color="C6EFCE")
FILL_RED = PatternFill("solid", start_color="F8CBAD")
FILL_BLUE = PatternFill("solid", start_color="D9E1F2")

thin = Side(border_style="thin", color="BFBFBF")
BORDER = Border(left=thin, right=thin, top=thin, bottom=thin)

ALIGN_L = Alignment(horizontal="left", vertical="center", wrap_text=True)
ALIGN_C = Alignment(horizontal="center", vertical="center", wrap_text=True)
ALIGN_R = Alignment(horizontal="right", vertical="center", wrap_text=True)


def write_header(ws, row, headers, fill=FILL_HDR):
    for col, h in enumerate(headers, 1):
        c = ws.cell(row=row, column=col, value=h)
        c.font = FONT_HDR
        c.fill = fill
        c.alignment = ALIGN_C
        c.border = BORDER


def write_title(ws, text):
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=12)
    c = ws.cell(row=1, column=1, value=text)
    c.font = FONT_TITLE
    c.fill = FILL_TITLE
    c.alignment = ALIGN_L
    ws.row_dimensions[1].height = 24


def style_data(ws, start_row, end_row, n_cols, n_v_cols=None):
    n_v_cols = n_v_cols or []
    for r in range(start_row, end_row + 1):
        for c in range(1, n_cols + 1):
            cell = ws.cell(row=r, column=c)
            cell.font = FONT_BODY
            cell.alignment = ALIGN_L
            cell.border = BORDER
            if r % 2 == 0:
                cell.fill = FILL_ALT


# ========================================================
# Sheet 1 - CAPA / RESUMO
# ========================================================
ws = wb.active
ws.title = "Resumo"
write_title(ws, "WORKFLOW 1 – VACANCY-TO-CONTRACT  |  Plaza Shopping Niterói")

ws["A3"] = "Cluster"
ws["B3"] = "Entretenimento (Cinemark mantido — âncora preservada)"
ws["A4"] = "Cidade"
ws["B4"] = "Niterói / RJ — Rua XV de Novembro, 8, Centro"
ws["A5"] = "ABL total (fonte: Allos.com.br)"
ws["B5"] = "43.000 m²  |  300+ lojas"
ws["A6"] = "Vacância tratada"
ws["B6"] = "~6.028 m² em 38 saídas (Ano 1) + projeto redevelopment 5.097 m² (foyer Cinemark)"
ws["A7"] = "Batalhas prioritárias"
ws["B7"] = "1) Entretenimento  2) Gastronomia (autenticidade)  3) Lojas (experiencial)"
ws["A8"] = "Status política API paga"
ws["B8"] = "Não acionada. Apenas fontes públicas gratuitas usadas."
ws["A9"] = "Confiança da análise"
ws["B9"] = "7,5/10 — dados públicos verificados. Pendente: Sistema Bahia (preço/m², FPP), CRM Farmer, KA pipeline."

ws["A11"] = "ESTRUTURA DA PLANILHA"
ws["A11"].font = FONT_BODY_B
ws["A12"] = "1. Resumo (esta aba)"
ws["A13"] = "2. Mix Atual (verificado) — lojas já no shopping. NÃO sugerir nada que esteja aqui."
ws["A14"] = "3. Saídas Ano 1 — lista original do EV com status corrigido"
ws["A15"] = "4. Deal Conversion Table — pipeline com estágio, dono, prazo"
ws["A16"] = "5. Foyer Redevelopment — conceito 5.097m² (sem Taste Lab)"
ws["A17"] = "6. Street Converter Niterói — operadores de rua candidatos"
ws["A18"] = "7. Plano 30/60/90"
ws["A19"] = "8. KPIs"
ws["A20"] = "9. Riscos & Blockers"
ws["A21"] = "10. Fontes"

ws["A23"] = "LEGENDA DE CORES"
ws["A23"].font = FONT_BODY_B
ws["A24"] = "Amarelo claro"
ws["B24"] = "n.v. — não verificado, precisa enriquecimento"
ws["A24"].fill = FILL_NV
ws["A25"] = "Verde"
ws["B25"] = "Status positivo / mantida"
ws["A25"].fill = FILL_GREEN
ws["A26"] = "Vermelho claro"
ws["B26"] = "Risco ou ação crítica"
ws["A26"].fill = FILL_RED
ws["A27"] = "Azul claro"
ws["B27"] = "Em análise / em conceito"
ws["A27"].fill = FILL_BLUE

for row in range(3, 28):
    ws.cell(row=row, column=1).font = FONT_BODY_B
    ws.cell(row=row, column=2).font = FONT_BODY

ws.column_dimensions["A"].width = 32
ws.column_dimensions["B"].width = 90


# ========================================================
# Sheet 2 - MIX ATUAL (verificado)
# ========================================================
ws = wb.create_sheet("Mix Atual Verificado")
write_title(ws, "MIX ATUAL VERIFICADO — Plaza Niterói (NÃO duplicar nas sugestões)")

headers = ["Categoria", "Marca", "Localização interna", "Fonte de verificação", "Observação"]
write_header(ws, 3, headers)

mix_atual = [
    # Cinema
    ["Cinema", "Cinemark", "Anchor cinema (foyer adjacente em redesign)", "plazaniteroi.com.br + Ingresso.com", "Mantido. Foyer 5.097m² em redevelopment."],
    # Espaço Gourmet (4º Piso) - confirmado em plazaniteroi.com.br/sobre-o-shopping
    ["Restaurante", "Coco Bambu", "Espaço Gourmet 4º piso (2.200m², 500 lugares)", "plazaniteroi.com.br + Cidade de Niterói", "Maior restaurante da cidade, inaugurado 2014"],
    ["Restaurante", "Outback Steakhouse", "Espaço Gourmet 4º piso", "plazaniteroi.com.br", ""],
    ["Restaurante", "Madero", "Espaço Gourmet 4º piso", "plazaniteroi.com.br", ""],
    ["Restaurante", "Abbraccio", "Espaço Gourmet 4º piso", "plazaniteroi.com.br", ""],
    ["Restaurante", "NOI", "Espaço Gourmet 4º piso", "plazaniteroi.com.br", "Cervejaria Noi - matriz Icaraí"],
    ["Restaurante", "Cabana Burger", "Espaço Gourmet 4º piso", "plazaniteroi.com.br", ""],
    ["Restaurante", "Balada Mix", "Espaço Gourmet 4º piso", "plazaniteroi.com.br", ""],
    ["Restaurante", "Tutto Nhoque", "Espaço Gourmet 4º piso", "plazaniteroi.com.br", ""],
    ["Restaurante", "Amélie + Juliette", "Espaço Gourmet 4º piso", "plazaniteroi.com.br", ""],
    ["Restaurante", "Jappa da Quitanda", "Espaço Gourmet 4º piso", "plazaniteroi.com.br", ""],
    ["Restaurante", "Gula Gula", "n.v.", "Infomoney expansão 2013", "Confirmar se ativa"],
    # Moda
    ["Moda Feminina", "Renner", "n.v.", "Brasil-Shoppings + Quintoandar", ""],
    ["Moda Feminina", "Riachuelo", "n.v.", "Infomoney expansão 2013", ""],
    ["Moda Geral", "C&A", "plazaniteroi.com.br/lojas/cea", "plazaniteroi.com.br", ""],
    ["Moda Feminina", "Marisa", "n.v.", "Brasil-Shoppings", ""],
    ["Moda", "Le Lis Blanc", "n.v.", "Infomoney 2013", "Confirmar se ativa"],
    ["Moda Masculina", "Brooksfield", "n.v.", "Infomoney 2013", ""],
    ["Moda", "Calvin Klein", "n.v.", "Infomoney 2013", ""],
    ["Moda Premium", "The Fifties", "n.v.", "Infomoney 2013", ""],
    ["Moda Infantil", "Carter's", "n.v.", "Skyscrapercity (anúncio expansão)", "Verificar abertura efetiva"],
    ["Moda", "Sardinha", "plazaniteroi.com.br/lojas/sardinha", "plazaniteroi.com.br", ""],
    ["Moda", "Panna", "plazaniteroi.com.br/lojas/panna", "plazaniteroi.com.br", ""],
    ["Underwear", "Lupo", "n.v.", "Brasil-Shoppings", ""],
    # Beleza
    ["Beleza", "Sephora", "n.v.", "Infomoney 2013", ""],
    ["Cosméticos", "O Boticário", "n.v.", "Brasil-Shoppings", ""],
    ["Acessórios", "Chilli Beans", "n.v.", "Brasil-Shoppings", ""],
    # Joias
    ["Joias", "H. Stern", "n.v.", "Infomoney 2013", ""],
    # Telefonia
    ["Telefonia", "TIM", "n.v.", "Brasil-Shoppings", ""],
    ["Telefonia", "Claro", "n.v.", "Brasil-Shoppings", ""],
    # Tech
    ["Tech / Apple Reseller", "iPlace", "plazaniteroi.com.br/lojas/iplace", "plazaniteroi.com.br", ""],
    # Fast Food
    ["Fast Food", "Burger King", "n.v.", "Brasil-Shoppings", ""],
    # Entretenimento
    ["Entretenimento Digital", "XDome Game Experience", "n.v.", "Cidade de Niterói + Allos", "Projeto Allos + Siga.ag — game experience"],
    ["Lazer Infantil", "Plaza Play (corredor infantil)", "Piso 2", "Jornal DR1 + plazaniteroi.com.br", "Espaço gratuito da própria operação"],
    ["Lazer Infantil", "Bolinha Parque", "n.v.", "Jornal DR1", ""],
    ["Lazer Infantil", "Youplay Clube", "n.v.", "Jornal DR1", ""],
    ["Lazer Infantil", "Ilha da Aventura", "n.v.", "Jornal DR1", ""],
]

for i, row in enumerate(mix_atual, start=4):
    for col_idx, val in enumerate(row, 1):
        cell = ws.cell(row=i, column=col_idx, value=val)
        cell.font = FONT_BODY
        cell.alignment = ALIGN_L
        cell.border = BORDER
        if val == "n.v.":
            cell.fill = FILL_NV
        elif i % 2 == 0:
            cell.fill = FILL_ALT

ws.column_dimensions["A"].width = 22
ws.column_dimensions["B"].width = 28
ws.column_dimensions["C"].width = 38
ws.column_dimensions["D"].width = 38
ws.column_dimensions["E"].width = 45

ws["A" + str(len(mix_atual) + 6)] = "OBS: Esta lista não é exaustiva (Plaza tem 300+ lojas). Estas são as confirmadas via fontes públicas. Para o restante, consultar o sistema interno Allos."
ws.cell(row=len(mix_atual) + 6, column=1).font = FONT_NOTE


# ========================================================
# Sheet 3 - SAÍDAS ANO 1
# ========================================================
ws = wb.create_sheet("Saidas Ano 1")
write_title(ws, "SAÍDAS ANO 1 — Lista original do EV (38 ops + Cinemark redev. 5.097m²)")

headers = ["#", "Segmento", "Loja", "Tier", "ABL (m²)", "Status Atual (validar EV)", "Tese de reposição", "Prioridade"]
write_header(ws, 3, headers)

saidas = [
    [1, "Cinema", "Cinemark (foyer)", "Tier 1", 5097, "MANTIDA - foyer em redev.", "Redevelopment indoor: entretenimento + quick gastro + gastrobar", "ALTA"],
    [2, "Lojas departamento", "Lojas Americanas", "Tier 1", 2724, "n.v. - verificar status real", "Decathlon City / outlet âncora / nova categoria âncora (NÃO Renner/Riachuelo - já existem)", "ALTA"],
    [3, "Lazer e Diversão", "World Games", "Tier 3", 451, "Saída", "Avaliar se necessita reposição (lazer infantil saturado: XDome+Plaza Play+3 lojas)", "BAIXA"],
    [4, "Outros Serviços", "Dinisa", "Tier 3", 326, "Saída", "Serviços recorrentes (lavanderia, conserto, chaveiro)", "MÉDIA"],
    [5, "Restaurantes", "Viena E Batata Inglesa", "Tier 3", 256, "Saída", "Operador autoral local (Street Converter): Tenore, Buzin, Da Carmine", "MÉDIA"],
    [6, "Esportes", "Adidas", "Tier 1", 205, "Saída", "Concept esportivo alternativo (não Nike standard) - Adidas Originals, On Running, Track&Field", "ALTA"],
    [7, "Vestuário Feminino", "Zinzane", "Tier 1", 198, "Saída", "Marca regional/multimarca de Icaraí (Mandamento 7)", "MÉDIA"],
    [8, "Saúde", "Espaço Crescer", "Tier 3", 165, "Saída", "Clínica/serviços de saúde - bem-estar premium", "MÉDIA"],
    [9, "Serviços de Beleza", "Walter'S Coiffeur", "Tier 3", 141, "Saída", "Salão premium local ou rede (Le Beauté Salon Bar - Icaraí)", "MÉDIA"],
    [10, "Vestuário Feminino", "Lizie", "Tier 1", 126, "Saída", "Marca regional ou multimarca", "BAIXA"],
    [11, "Telefonia", "Vivo", "Tier 1", 118, "n.v. - verificar", "Outra operadora ou reposicionar para tech accessories", "MÉDIA"],
    [12, "Vestuário Geral", "Star Point", "Tier 2", 93, "Saída", "Marca local Icaraí", "BAIXA"],
    [13, "Vestuário Feminino", "Aquamar", "Tier 3", 80, "Saída", "Marca local", "BAIXA"],
    [14, "Calçados", "Havaianas", "Tier 1", 78, "n.v. - verificar", "Reposição direta ou Kichute/Vans", "MÉDIA"],
    [15, "CAMEBA", "Mmartan", "Tier 1", 75, "Saída", "Concorrente direto: Buddemeyer, Trousseau, Karsten", "MÉDIA"],
    [16, "Restaurantes", "Mania De Churrasco", "Tier 1", 74, "Saída", "Steakhouse alternativo OU pivot para gastrobar autoral", "MÉDIA"],
    [17, "Ótica", "Kza Otica", "Tier 3", 69, "Saída", "Ótica nativa digital (Lenscope, Look) ou local", "BAIXA"],
    [18, "Vestuário Feminino", "From", "Tier 3", 66, "Saída", "Marca local", "BAIXA"],
    [19, "Esportes", "Físico E Forma", "Tier 2", 65, "Saída", "Suplementos (Probiótica) ou wear esportivo", "BAIXA"],
    [20, "Vestuário Feminino", "Garage Vintage", "Tier 3", 58, "Saída", "Multimarca vintage local", "BAIXA"],
    [21, "Vestuário Masculino", "Ad Life Style", "Tier 2", 55, "Saída", "Marca masculina autêntica", "BAIXA"],
    [22, "Vestuário Geral", "55 Rj", "Tier 3", 50, "Saída", "Marca local Icaraí", "BAIXA"],
    [23, "Vestuário Feminino", "Glam By", "Tier 3", 49, "Saída", "Multimarca", "BAIXA"],
    [24, "Brinquedos e Games", "Criamigos", "Tier 1", 44, "Saída", "Avaliar (lazer infantil saturado)", "BAIXA"],
    [25, "Fast Food", "Taco Bell", "Tier 1", 43, "Saída", "Fast casual mexicano (Frida & Mina, El Cabriton)", "BAIXA"],
    [26, "Serviços de Beleza", "Cor E Unha Fashion Hair", "Tier 3", 41, "Saída", "Esmalteria/manicure express", "BAIXA"],
    [27, "Vestuário Infantil", "Puket", "Tier 1", 40, "Saída", "Marca infantil (Carter's já entrou - validar duplicidade)", "BAIXA"],
    [28, "Calçados Infantis", "Energia Kids", "Tier 3", 38, "Saída", "Bibi, Pé com Pé, ZigZig", "BAIXA"],
    [29, "Ótica", "Otica Maxvision", "Tier 3", 35, "Saída", "Ver OPP 17 - consolidar em 1 ponto de ótica", "BAIXA"],
    [30, "Outros Acessórios", "I Love Biju", "Tier 3", 35, "Saída", "Quiosque acessórios", "BAIXA"],
    [31, "Calçados Femininos", "Picadilly", "Tier 1", 34, "Saída", "Anacapri, Schutz, Capodarte", "BAIXA"],
    [32, "Serviços de Beleza", "Sobrancelhas", "Tier 1", 34, "Saída", "Sobrancelha Design, Studio W", "BAIXA"],
    [33, "Produtos Diversos", "Vx Case", "Tier 2", 33, "Saída", "Acessórios celular (Cellphone Express)", "BAIXA"],
    [34, "Café e lanches", "B&B Cafeteria", "Tier 3", 33, "Saída", "Café experiencial (ver foyer)", "BAIXA"],
    [35, "CAMEBA", "First Class", "Tier 1", 29, "Saída", "Consolidar com Mmartan ou Buddemeyer", "BAIXA"],
    [36, "Café e lanches", "Cacau Noir", "Tier 2", 26, "Saída", "Brigaderia autoral (Maria Brigadeiro, Briggo's)", "BAIXA"],
    [37, "Vestuário Feminino", "Marmello Modas", "Tier 3", 18, "Saída", "Quiosque/caixa pequena", "BAIXA"],
    [38, "Cosméticos", "Sensoria", "Tier 3", 13, "Saída", "Vult, Avon, Eudora kiosk", "BAIXA"],
    [39, "Fast Food", "Mc Donald's2", "Tier 1", 10, "Saída", "Espaço residual - reabsorver", "BAIXA"],
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

# Totals row
tot_row = len(saidas) + 4
ws.cell(row=tot_row, column=1, value="TOTAL").font = FONT_BODY_B
ws.cell(row=tot_row, column=5, value=f"=SUM(E4:E{tot_row-1})").font = FONT_BODY_B
ws.cell(row=tot_row, column=5).number_format = "#,##0"

ws.column_dimensions["A"].width = 5
ws.column_dimensions["B"].width = 18
ws.column_dimensions["C"].width = 28
ws.column_dimensions["D"].width = 8
ws.column_dimensions["E"].width = 10
ws.column_dimensions["F"].width = 28
ws.column_dimensions["G"].width = 55
ws.column_dimensions["H"].width = 10


# ========================================================
# Sheet 4 - DEAL CONVERSION TABLE
# ========================================================
ws = wb.create_sheet("Deal Conversion")
write_title(ws, "DEAL CONVERSION TABLE — Pipeline com estágio, dono e prazo")

headers = ["ID", "Espaço/Caixa", "ABL (m²)", "Tese (filtro duplicidade aplicado)",
           "Cluster Fit", "Estágio", "Dono", "Próxima Ação", "Prazo (dias)", "Prob. Fech.", "Blocker", "Impacto Financeiro"]
write_header(ws, 3, headers)

deals = [
    ["OPP-F1", "Foyer / Master Plan", 5097,
     "Aprovar conceito redev INDOOR (NÃO Taste Lab): entretenimento + quick gastro + gastrobar + pop-up",
     92, "Conceito", "Allos Desenv. + EV", "Apresentar conceito e CAPEX preliminar", 15, "70%", "Aprovação CAPEX", "Alto - vendas/m² potenciais acima do mix legado"],
    ["OPP-F2", "Foyer / Entret. Premium", 1500,
     "Boliche compacto + escape room + VR (Bossa Nova Bowl / Lock Quest / Sandbox VR)",
     90, "Lead", "KA Expansion", "Sondar 3 operadores", 45, "50%", "Disponibilidade marca para RJ", "Alto - novo motor de visita"],
    ["OPP-F3", "Foyer / Quick-gastro", 1200,
     "6-8 ops premium não-cadeia: Bacio di Latte, Oakberry, Suplicy, Davvero, Bombom Pinto, Chatime",
     85, "Lead", "Hunter + KA", "Lista 25 ops + abordagem", 45, "55%", "Curadoria final", "Médio-alto - ticket de espera pré-cinema"],
    ["OPP-F4", "Foyer / Gastrobar Autoral", 800,
     "Operador rua Icaraí: Hocus Pocus / Cantón / Pli On Board / Buzin / Cervejaria Noi",
     88, "Lead", "Street Converter", "Reunião com top 3 operadores", 45, "45%", "Convencimento street→mall", "Médio - autenticidade local"],
    ["OPP-F5", "Foyer / Karaokê Premium", 600,
     "Karaokê box estilo asiático (privativos)",
     75, "Lead", "KA Expansion", "Identificar redes em expansão BR", 60, "35%", "Operador qualificado RJ", "Médio - nicho diferenciado"],
    ["OPP-F6", "Foyer / Pop-up + Showroom", 600,
     "Rotação mensal + 1 showroom fixo de marca DTC",
     80, "Lead", "Hunter", "Modelo de receita + curadoria", 30, "50%", "Modelo comercial", "Médio - flex e mídia"],
    ["OPP-B", "Espaço Americanas", 2724,
     "Decathlon City (n.v. interesse) OU outlet âncora (Nike/Adidas Outlet híbrido) OU nova categoria",
     75, "Lead", "KA Expansion", "Abordar Decathlon + Centauro + outlet ops", 30, "35%", "Disponibilidade marca para RJ", "Alto - âncora 2.724m²"],
    ["OPP-M1", "Adidas (saída)", 205,
     "Não duplicar com Adidas existente alhures - Adidas Originals, On Running, Track&Field, ASICS",
     70, "Lead", "KA", "Sondar 3 marcas esporte premium", 30, "45%", "n.v.", "Médio"],
    ["OPP-M2", "Restaurantes médios (Viena+Mania Churrasco)", 330,
     "Substituir por operador rua Icaraí: Tenore, Buzin, Da Carmine, Toca da Traíra, Lucca Forneria",
     78, "Lead", "Street Converter", "Top 5 abordagens rua", 30, "50%", "Convencimento + pacote Alavancador", "Médio"],
    ["OPP-M3", "Vestuário fem. (5 lojas)", 457,
     "Reposição via multimarca regional Icaraí (Mand. 7) ou marca DTC",
     65, "Lead", "Street Converter", "Map multimarcas Gavião Peixoto + Moreira César", 45, "40%", "Achar operador escala", "Médio"],
    ["OPP-M4", "Caixas médias restantes", 700,
     "Avaliar caso a caso após filtro de duplicidade",
     60, "Lead", "Hunter", "Map raio 50km", 45, "40%", "n.v.", "Baixo-médio"],
    ["OPP-P", "Lote 28 caixas pequenas", 1485,
     "1-2 multifranqueados RJ — Mandamento 8 (Levy)",
     55, "Lead", "Farmer", "Map multifranqueados RJ", 60, "30%", "Achar operador único", "Médio agregado"],
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
            elif val < 60:
                cell.fill = FILL_NV

# total ABL
tot_row = len(deals) + 4
ws.cell(row=tot_row, column=1, value="TOTAL").font = FONT_BODY_B
ws.cell(row=tot_row, column=3, value=f"=SUM(C4:C{tot_row-1})").font = FONT_BODY_B
ws.cell(row=tot_row, column=3).number_format = "#,##0"

ws.column_dimensions["A"].width = 8
ws.column_dimensions["B"].width = 26
ws.column_dimensions["C"].width = 10
ws.column_dimensions["D"].width = 55
ws.column_dimensions["E"].width = 9
ws.column_dimensions["F"].width = 12
ws.column_dimensions["G"].width = 20
ws.column_dimensions["H"].width = 32
ws.column_dimensions["I"].width = 9
ws.column_dimensions["J"].width = 10
ws.column_dimensions["K"].width = 22
ws.column_dimensions["L"].width = 28


# ========================================================
# Sheet 5 - FOYER REDEVELOPMENT (5.097 m²)
# ========================================================
ws = wb.create_sheet("Foyer Redev")
write_title(ws, "FOYER REDEVELOPMENT — 5.097 m² INDOOR adjacente ao Cinemark (NÃO Taste Lab)")

ws["A3"] = "Princípio:"
ws["A3"].font = FONT_BODY_B
ws["B3"] = "Território de fluxo garantido pelo cinema. Conceito deve monetizar a espera pré-cinema e o pós-sessão. Taste Lab (open-air) NÃO se aplica - este é foyer indoor."
ws.merge_cells("B3:F3")

headers = ["Sub-zona", "ABL (m²)", "Conceito", "Operadores-alvo (filtro de duplicidade aplicado)", "Cluster Fit", "Status"]
write_header(ws, 5, headers)

foyer = [
    ["Entretenimento experiencial premium", 1500,
     "Boliche compacto + escape rooms + VR + simuladores",
     "Bossa Nova Bowl, Lock Quest, EnigMa, Sandbox VR, Pump Fliperama, NeoGeo, Sherlock Escape (n.v. interesse RJ)",
     90, "Lead"],
    ["Karaokê / private rooms", 600,
     "Karaokê box estilo asiático com salas privadas",
     "Boom Karaoke (n.v. expansão), Karaokê One (n.v.), modelo Lucky Voice",
     75, "Lead"],
    ["Quick-gastro premium pré-cinema", 1200,
     "6-8 operações premium fast-casual, NÃO duplicar com Espaço Gourmet",
     "Bacio di Latte, Oakberry, Suplicy, Davvero, Briggo's, Chatime, Mr. Cheney, brigaderia autoral",
     85, "Lead"],
    ["Gastrobar autoral pós-cinema", 800,
     "1 operador autoral local de Niterói (Street Converter)",
     "Hocus Pocus (já tem rua), Cantón (chifa - operação consolidada SP/RJ), Pli On Board (vencedor CdB Niterói 2025)",
     88, "Lead"],
    ["Pop-up rotativo + Showroom", 600,
     "Lojas interativas rotativas + 1 showroom fixo de marca DTC",
     "Pop-up rotativo (modelo Appearhere) + 1 showroom DTC (Insider, Amaro, etc.)",
     80, "Lead"],
    ["Circulação + lounge integrado", 397,
     "Área não monetizada mas crítica para experiência",
     "N/A - área de fluxo e experiência",
     "—", "Conceito"],
]

for i, row in enumerate(foyer, start=6):
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

tot_row = len(foyer) + 6
ws.cell(row=tot_row, column=1, value="TOTAL FOYER").font = FONT_BODY_B
ws.cell(row=tot_row, column=2, value=f"=SUM(B6:B{tot_row-1})").font = FONT_BODY_B
ws.cell(row=tot_row, column=2).number_format = "#,##0"

ws.column_dimensions["A"].width = 35
ws.column_dimensions["B"].width = 10
ws.column_dimensions["C"].width = 45
ws.column_dimensions["D"].width = 60
ws.column_dimensions["E"].width = 10
ws.column_dimensions["F"].width = 12


# ========================================================
# Sheet 6 - STREET CONVERTER
# ========================================================
ws = wb.create_sheet("Street Converter Niteroi")
write_title(ws, "STREET CONVERTER NITERÓI — Operadores de rua candidatos (Mand. 6 Levy)")

ws["A3"] = "Fontes: Tripadvisor, Visit Niterói (visit.niteroi.br), Quintoandar, Comida di Buteco 2025, Cidade de Niterói"
ws["A3"].font = FONT_NOTE
ws.merge_cells("A3:H3")

headers = ["Operador", "Bairro / Endereço", "Categoria", "Sinais de tração",
           "Fit cluster Entretenimento", "Tese de conversão", "Status atual no Plaza", "Próxima ação"]
write_header(ws, 5, headers)

street = [
    ["Cantón Peruvian & Chinese Food", "São Francisco beira-mar", "Chifa (peruano-chinês)",
     "Operação consolidada com unidades SP e RJ; ambiente distintivo",
     85, "Conceito experiencial diferenciado; fila comprovada; ticket médio R$50-80",
     "Ausente", "Reunião comercial"],
    ["Pli On Board", "Niterói", "Boteco autoral",
     "Vencedor Comida di Buteco Niterói 2025 (validação pública)",
     80, "Gastrobar autoral com prêmio recente; público local fidelizado",
     "Ausente", "Reunião + tese gastrobar foyer"],
    ["Sunsaki", "Icaraí", "Japonês contemporâneo",
     "Referência local em culinária japonesa moderna; rodízio + à la carte",
     78, "Substitui ausência de japonês moderno (Jappa é mais tradicional)",
     "Ausente (Jappa da Quitanda existe, mas é tradicional)", "Reunião"],
    ["Hocus Pocus Cervejaria", "Niterói (cidade)", "Cervejaria experiencial",
     "Marca já validada pela Allos no Taste Lab Shopping Tijuca; abertura recente em Niterói",
     88, "Marca em expansão validada pelo próprio grupo; gastrobar perfeito para foyer",
     "Ausente (NOI cervejaria existe, mas é outra marca)", "Alta prioridade - reunião imediata"],
    ["Buzin Gastronomia", "Icaraí (R. Gen. Pereira da Silva, 169)", "Restaurante autoral",
     "Operação local consolidada",
     70, "Operador de rua com produto autoral",
     "Ausente", "Sondar interesse"],
    ["Da Carmine", "Icaraí (R. Mariz e Barros, 305)", "Pizzaria autoral",
     "Pizzaria de bairro estabelecida",
     65, "Substituir pizzaria genérica se existir no shopping",
     "n.v. - verificar pizzaria atual", "Sondar"],
    ["Lucca Forneria", "Icaraí (Dr. Leandro Mota, 142)", "Italiana forneria",
     "Conceito de massa de fermentação natural",
     68, "Conceito diferenciado; pode complementar quick-gastro do foyer",
     "Ausente", "Sondar"],
    ["Toca da Traíra", "Icaraí (Mem de Sá, 8)", "Peixe e frutos do mar",
     "Operação consolidada de frutos do mar",
     70, "Sem direto no shopping (substituir Viena/Mania de Churrasco)",
     "Ausente", "Sondar"],
    ["Tenore", "Icaraí (Av. Jornalista Alberto F. Torres, 521)", "Churrascaria",
     "Vista para Praia de Icaraí; rodízio robusto",
     72, "Substituir Mania de Churrasco com versão mais qualificada",
     "Ausente", "Sondar"],
    ["Beco JT", "Icaraí", "Boteco autêntico — participante CdB 2026",
     "Boteco autêntico Icaraí",
     60, "Vetor de autenticidade — Mandamento 7 (multivetor petiscos)",
     "Ausente", "Avaliar pacote multi-boteco"],
    ["Endorfina Bar", "Icaraí", "Boteco — participante CdB 2026",
     "Boteco Icaraí",
     62, "Idem Beco JT",
     "Ausente", "Idem"],
    ["Nosso Boteco", "Icaraí", "Boteco — participante CdB 2026",
     "Boteco Icaraí",
     60, "Idem",
     "Ausente", "Idem"],
    ["Le Beauté Salon Bar", "Icaraí", "Salão de beleza completo + bar/bistrô",
     "Conceito inovador exclusivo na cidade (fonte: Cidade de Niterói)",
     78, "Conceito híbrido beleza+gastronomia; potencial para substituir Walter's Coiffeur",
     "Ausente", "Reunião"],
    ["Raízes Mercado & Algo a Mais", "Icaraí (Mariz e Barros, 115)", "Mercado conceito + bistrô",
     "Conceito novo, layout moderno, self-checkout",
     65, "Avaliar quiosque de produtos selecionados",
     "Ausente", "Sondar formato compacto"],
]

for i, row in enumerate(street, start=6):
    for col_idx, val in enumerate(row, 1):
        cell = ws.cell(row=i, column=col_idx, value=val)
        cell.font = FONT_BODY
        cell.alignment = ALIGN_L if col_idx in (1, 2, 3, 4, 6, 7, 8) else ALIGN_C
        cell.border = BORDER
        if i % 2 == 0:
            cell.fill = FILL_ALT
        if col_idx == 5 and isinstance(val, int):
            if val >= 85:
                cell.fill = FILL_GREEN
            elif val >= 70:
                cell.fill = FILL_BLUE

ws.column_dimensions["A"].width = 28
ws.column_dimensions["B"].width = 30
ws.column_dimensions["C"].width = 25
ws.column_dimensions["D"].width = 35
ws.column_dimensions["E"].width = 9
ws.column_dimensions["F"].width = 45
ws.column_dimensions["G"].width = 30
ws.column_dimensions["H"].width = 25


# ========================================================
# Sheet 7 - PLANO 30/60/90
# ========================================================
ws = wb.create_sheet("Plano 30-60-90")
write_title(ws, "PLANO 30 / 60 / 90 DIAS")

headers = ["Horizonte", "Ação", "Dono", "Entregável", "KPI", "Status"]
write_header(ws, 3, headers)

plano = [
    ["30 dias", "Aprovar master plan do foyer (conceito INDOOR sem Taste Lab)", "Allos Desenvolvimento + EV", "Aprovação executiva + CAPEX preliminar", "Aprovação binária", "Pendente"],
    ["30 dias", "Sondagem Decathlon City + Centauro + 1 outlet (Americanas)", "KA Expansion", "3 abordagens registradas", "# de respostas positivas", "Pendente"],
    ["30 dias", "Reuniões Hocus Pocus + Cantón + Pli On Board (gastrobar foyer)", "Street Converter", "3 reuniões realizadas", "# LOIs em curso", "Pendente"],
    ["30 dias", "Mapeamento de 5 multifranqueados RJ (Mand. 8)", "Farmer", "Lista qualificada", "# multifranqueados identificados", "Pendente"],
    ["30 dias", "Curadoria de 25 marcas quick-gastro premium (Bacio, Oakberry etc.)", "Hunter + KA", "Lista priorizada", "# marcas abordadas", "Pendente"],
    ["30 dias", "Validar status real das 38 saídas + cluster", "EV Plaza Niterói", "Lista corrigida", "Lista validada", "Pendente"],
    ["60 dias", "Master plan em projeto executivo (Builder)", "Builder Allos", "Plantas executivas", "Aprovação", "Pendente"],
    ["60 dias", "10 reuniões Street Converter realizadas (Icaraí/São Francisco)", "Street Converter", "10 reuniões", "Conversão lead→LOI", "Pendente"],
    ["60 dias", "LOI gastrobar autoral foyer (Hocus Pocus OU Cantón OU Pli On Board)", "Street Converter", "1 LOI", "1 LOI assinado", "Pendente"],
    ["60 dias", "LOI âncora foyer (Boliche / VR / Karaokê)", "KA", "1 LOI", "1 LOI", "Pendente"],
    ["60 dias", "Proposta formal Americanas (Decathlon/outlet)", "KA", "Proposta", "Proposta enviada", "Pendente"],
    ["90 dias", "3+ LOIs foyer assinados (entret. + quick-gastro + gastrobar)", "KA + Street Converter", "3 LOIs", "Mínimo 3 LOIs", "Pendente"],
    ["90 dias", "Contrato âncora foyer assinado", "KA", "1 contrato", "1 contrato", "Pendente"],
    ["90 dias", "Proposta Americanas em negociação avançada", "KA", "Termsheet", "Termsheet aceito", "Pendente"],
    ["90 dias", "Lote multifranqueado estruturado (10-15 caixas pequenas)", "Farmer", "Termsheet lote", "1 operador identificado", "Pendente"],
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

ws.column_dimensions["A"].width = 10
ws.column_dimensions["B"].width = 50
ws.column_dimensions["C"].width = 22
ws.column_dimensions["D"].width = 28
ws.column_dimensions["E"].width = 28
ws.column_dimensions["F"].width = 11


# ========================================================
# Sheet 8 - KPIs
# ========================================================
ws = wb.create_sheet("KPIs")
write_title(ws, "KPIs — Workflow 1 Plaza Niterói")

headers = ["KPI", "Linha de base", "Meta 90d", "Meta 180d", "Meta 270d", "Fonte de medição"]
write_header(ws, 3, headers)

kpis = [
    ["Conceito redev foyer aprovado (binário)", "Não", "Sim", "—", "—", "Allos Desenv."],
    ["Pré-locação Foyer (% LOIs assinados)", "0%", "30%", "70%", "100%", "Pipeline KA"],
    ["Contratos assinados Foyer (#)", "0", "1", "3", "6", "Jurídico Allos"],
    ["ABL recolocada / ABL vacância real 6.028 m²", "0%", "35%", "70%", "90%", "Plataforma Espaços"],
    ["Vendas/m² zona cinema-adjacente vs. mix anterior", "n.v.", "n.v.", "+30%", "+50%", "Sistema Allos"],
    ["Cluster Fit médio do mix novo", "—", "≥ 78", "≥ 82", "≥ 85", "Cluster Engine"],
    ["Dwell time pré/pós cinema (min)", "n.v.", "+10%", "+20%", "+25%", "Beacons / app"],
    ["Dias médios saída → contrato assinado", "n.v.", "≤ 180", "≤ 120", "≤ 90", "CRM Allos"],
    ["# reuniões Street Converter (Mand. 10 Levy)", "0", "30", "80", "150", "Agenda EV"],
    ["# multifranqueados RJ mapeados", "0", "5", "10", "15", "Farmer"],
    ["# LOIs Street→Shopping convertidos", "0", "2", "5", "8", "Pipeline"],
    ["Receita de mídia mall (Helloo + Praça eventos)", "n.v.", "n.v.", "+15%", "+25%", "Comercial Helloo"],
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

ws.column_dimensions["A"].width = 50
ws.column_dimensions["B"].width = 14
ws.column_dimensions["C"].width = 14
ws.column_dimensions["D"].width = 14
ws.column_dimensions["E"].width = 14
ws.column_dimensions["F"].width = 22


# ========================================================
# Sheet 9 - RISCOS
# ========================================================
ws = wb.create_sheet("Riscos e Blockers")
write_title(ws, "RISCOS, BLOCKERS E MITIGAÇÕES")

headers = ["#", "Risco / Blocker", "Probabilidade", "Impacto", "Mitigação", "Dono"]
write_header(ws, 3, headers)

riscos = [
    [1, "CAPEX redev foyer não aprovado pela Allos", "Média", "Alto", "Conceito modular: pode ser implementado por fases", "Allos Desenv."],
    [2, "Cluster pode estar mal classificado (declarado Entretenimento - Plaza tem perfil mais Passeio Familiar/Compacto Alto Padrão)", "Média", "Alto", "Validar cluster com Allos antes do investimento", "Cluster Engine"],
    [3, "Operadores rua Icaraí não aceitam migrar para shopping", "Alta", "Médio", "Pacote Alavancador robusto + caso de uso Hocus Pocus em Tijuca", "Street Converter"],
    [4, "Marcas-âncora (Decathlon, outlet) sem interesse RJ Niterói", "Média", "Alto", "Listar 5 alternativas em paralelo", "KA"],
    [5, "Concorrência regional (Bay Market, Icaraí Shopping) reage com gastronomia", "Média", "Médio", "Speed-to-market: travar gastrobar autoral antes", "EV"],
    [6, "Status real das saídas Ano 1 não confirmado (Lojas Americanas, Vivo, Havaianas aparecem em fontes públicas)", "Confirmada", "Médio", "EV deve validar status real antes do pipeline avançar", "EV Plaza"],
    [7, "Sem dados Sistema Bahia (preço/m², FPP, CDU) - underwriting é direcional", "Confirmada", "Alto", "Liberar acesso interno Sistema Bahia ao EV", "EV + TI Allos"],
    [8, "Sem CRM Farmer estruturado - investidores não cadastrados", "Confirmada", "Médio", "Implementar formulário de cadastro suitability", "Farmer"],
    [9, "Lazer infantil saturado (XDome + Plaza Play + 3 lojas) - difícil justificar mais", "Confirmada", "Baixo", "Não incluir nova operação de lazer infantil no foyer", "Cluster Engine"],
    [10, "Master plan do foyer pode atrasar pipeline de gastrobar", "Média", "Médio", "Aprovar conceito em 15d e iniciar sondagens em paralelo", "EV + Allos Desenv."],
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

ws.column_dimensions["A"].width = 5
ws.column_dimensions["B"].width = 60
ws.column_dimensions["C"].width = 14
ws.column_dimensions["D"].width = 10
ws.column_dimensions["E"].width = 50
ws.column_dimensions["F"].width = 22


# ========================================================
# Sheet 10 - FONTES
# ========================================================
ws = wb.create_sheet("Fontes")
write_title(ws, "FONTES VERIFICADAS (políticas API: nenhuma paga acionada)")

headers = ["#", "Fonte", "URL", "Uso na análise"]
write_header(ws, 3, headers)

fontes = [
    [1, "Plaza Shopping Niterói - Site oficial", "https://plazaniteroi.com.br/", "Tenant mix, Espaço Gourmet, Cinema, eventos atuais"],
    [2, "Plaza Shopping Niterói - Sobre o Shopping", "https://plazaniteroi.com.br/sobre-o-shopping/", "Lista Espaço Gourmet (Coco Bambu, Outback, Madero, Abbraccio, NOI, Cabana Burger, Balada Mix, etc.)"],
    [3, "Allos Co - Plaza Shopping Niterói", "https://allos.co/en/shopping/plaza-shopping-niteroi-2/", "ABL 43.000m², 300+ lojas, abertura 1986, Cinemark 3D/XD"],
    [4, "Cidade de Niterói - Plaza Niterói notícias", "https://cidadedeniteroi.com/", "Plaza Play, XDome Game, Coco Bambu, Le Beauté, eventos"],
    [5, "Cidade de Niterói - Comida di Buteco 2025/2026", "https://cidadedeniteroi.com/gastronomia/guia-completo-bares-do-comida-di-buteco-no-rio-niteroi-e-baixada/", "Operadores de rua qualificados (Pli On Board vencedor 2025)"],
    [6, "Visit Niterói - Icaraí & Jardim Icaraí", "https://visit.niteroi.br/en/jardim-icarai-santa-rosa/", "Lista de restaurantes e bares por endereço em Icaraí"],
    [7, "Quintoandar - Restaurantes em Niterói", "https://www.quintoandar.com.br/guias/cidades/restaurantes-em-niteroi/", "Mapeamento gastronômico de Niterói por bairro"],
    [8, "Tripadvisor - Restaurantes Icaraí", "https://www.tripadvisor.com/Restaurants-g303500-zfn20945527-Niteroi_State_of_Rio_de_Janeiro.html", "Validação de operadores e tração"],
    [9, "Portal Grande Tijuca - Shopping Tijuca expansão 2026", "https://grandetijuca.com.br/noticia/9049/shopping-tijuca-inicia-expansao-para-2026.html", "Benchmark Allos Taste Lab (referência conceitual)"],
    [10, "Revista Shopping Centers - Expansões Allos", "https://revistashoppingcenters.com.br/capa/projeto-de-expansao/", "Investimentos Allos R$ 450-550M em expansões"],
    [11, "Mercado&Consumo - Outlets crescem 25%", "https://mercadoeconsumo.com.br/08/01/2026/shopping-centers/outlets-avancam-no-brasil-e-ganham-espaco-em-shoppings-tradicionais/", "Tendência outlet híbrido para Americanas"],
    [12, "Infomoney - BR Malls expansão Plaza Niterói 2013", "https://www.infomoney.com.br/negocios/br-malls-anuncia-expansao-do-shopping-plaza-niteroi/", "Vendas/m² R$2.000 em 2012; marcas adicionadas em 2013"],
    [13, "Jornal DR1 - Plaza Play infantil", "https://jornaldr1.com.br/plaza-niteroi-inaugura-espaco-infantil-gratuito-com-programacao-especial/", "Confirmação saturação lazer infantil"],
    [14, "Brasil-Shoppings - Plaza Niterói tenants", "https://www.brasil-shoppings.com.br/centros-comerciais/rio-de-janeiro-shoppings/cidade-niteroi/plaza-niteroi/", "Lista tenants - precisão de data n.v."],
]

for i, row in enumerate(fontes, start=4):
    for col_idx, val in enumerate(row, 1):
        cell = ws.cell(row=i, column=col_idx, value=val)
        cell.font = FONT_BODY
        cell.alignment = ALIGN_L
        cell.border = BORDER
        if i % 2 == 0:
            cell.fill = FILL_ALT

ws["A" + str(len(fontes) + 6)] = "POLÍTICA DE APIs PAGAS: nenhuma API paga foi acionada. Para enriquecimento, sugerir:"
ws.cell(row=len(fontes) + 6, column=1).font = FONT_BODY_B
ws["A" + str(len(fontes) + 7)] = "• SerpApi / DataForSEO — tração digital de marcas-alvo"
ws["A" + str(len(fontes) + 8)] = "• Similarweb — audiência apps gastronomia/entretenimento"
ws["A" + str(len(fontes) + 9)] = "• Apollo / Hunter.io — contatos KA marcas DTC"
ws["A" + str(len(fontes) + 10)] = "• ABF base completa — franquias em expansão Sudeste"
ws["A" + str(len(fontes) + 11)] = "Confirmar com sponsor antes de acionar."
ws.cell(row=len(fontes) + 11, column=1).font = FONT_BODY_B

ws.column_dimensions["A"].width = 5
ws.column_dimensions["B"].width = 50
ws.column_dimensions["C"].width = 70
ws.column_dimensions["D"].width = 50


# Freeze panes
for sheet_name in ["Mix Atual Verificado", "Saidas Ano 1", "Deal Conversion", "Foyer Redev", "Street Converter Niteroi", "Plano 30-60-90", "KPIs", "Riscos e Blockers", "Fontes"]:
    s = wb[sheet_name]
    if sheet_name == "Foyer Redev" or sheet_name == "Street Converter Niteroi":
        s.freeze_panes = "A6"
    else:
        s.freeze_panes = "A4"

output_path = "/mnt/user-data/outputs/Plaza_Niteroi_Workflow1_Vacancy_to_Contract_v3.xlsx"
import os
os.makedirs(os.path.dirname(output_path), exist_ok=True)
wb.save(output_path)
print(f"OK: {output_path}")
