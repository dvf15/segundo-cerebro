from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.table import Table, TableStyleInfo
from openpyxl.worksheet.datavalidation import DataValidation

wb = Workbook()

# ── Palette ──────────────────────────────────────────────────────────────
C_HEADER_DARK = "1A1A2E"
C_HEADER_MID  = "16213E"
C_SECTION     = "0F3460"
C_GRAY_HDR    = "2D3561"
C_LIGHT_ROW   = "F0F4FF"
C_WHITE       = "FFFFFF"
C_YELLOW      = "FFF3CD"
C_GREEN       = "D4EDDA"

FONT_TITLE = Font(name="Arial", size=14, bold=True,  color=C_WHITE)
FONT_SUB   = Font(name="Arial", size=10, italic=True,color="CCDDFF")
FONT_COL   = Font(name="Arial", size=9,  bold=True,  color=C_WHITE)
FONT_SECT  = Font(name="Arial", size=9,  bold=True,  color=C_WHITE)
FONT_BODY  = Font(name="Arial", size=9,  color="1A1A2E")
FONT_AUTO  = Font(name="Arial", size=9,  color="2E7D32", italic=True)
FONT_NOTE  = Font(name="Arial", size=8,  color="555555", italic=True)
FONT_INDEX = Font(name="Arial", size=10, color="1A1A2E")

ALIGN_CTR  = Alignment(horizontal="center", vertical="center", wrap_text=True)
ALIGN_LEFT = Alignment(horizontal="left",   vertical="center", wrap_text=True)
ALIGN_WRAP = Alignment(horizontal="left",   vertical="top",    wrap_text=True)

THIN = Side(style="thin",   color="BBBBBB")
MED  = Side(style="medium", color="888888")
BORDER_THIN = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
BORDER_MED  = Border(left=MED,  right=MED,  top=MED,  bottom=MED)

def fill(hex_color):
    return PatternFill("solid", fgColor=hex_color)

def write_title(ws, title, subtitle, cols):
    ws.row_dimensions[1].height = 30
    ws.row_dimensions[2].height = 18
    ws.merge_cells(f"A1:{get_column_letter(cols)}1")
    ws.merge_cells(f"A2:{get_column_letter(cols)}2")
    c1 = ws["A1"]; c1.value = title; c1.font = FONT_TITLE
    c1.fill = fill(C_HEADER_DARK); c1.alignment = ALIGN_CTR
    c2 = ws["A2"]; c2.value = subtitle; c2.font = FONT_SUB
    c2.fill = fill(C_HEADER_MID); c2.alignment = ALIGN_CTR

def write_headers(ws, row, headers, bg=C_GRAY_HDR):
    ws.row_dimensions[row].height = 30
    for col_idx, h in enumerate(headers, 1):
        c = ws.cell(row=row, column=col_idx, value=h)
        c.font = FONT_COL; c.fill = fill(bg)
        c.alignment = ALIGN_CTR; c.border = BORDER_THIN

def write_data_row(ws, row, values, is_even=False, auto_cols=None):
    ws.row_dimensions[row].height = 18
    bg = C_LIGHT_ROW if is_even else C_WHITE
    auto_cols = auto_cols or []
    for col_idx, v in enumerate(values, 1):
        c = ws.cell(row=row, column=col_idx, value=v)
        if col_idx in auto_cols:
            c.font = FONT_AUTO; c.fill = fill(C_GREEN)
        else:
            c.font = FONT_BODY; c.fill = fill(bg)
        c.alignment = ALIGN_LEFT; c.border = BORDER_THIN

def add_table(ws, ref, name, style="TableStyleMedium2"):
    tbl = Table(displayName=name, ref=ref)
    tbl.tableStyleInfo = TableStyleInfo(
        name=style, showFirstColumn=False, showLastColumn=False,
        showRowStripes=True, showColumnStripes=False)
    ws.add_table(tbl)

def dv(ws, type_, formula1, sqref):
    d = DataValidation(type=type_, formula1=formula1, allow_blank=True)
    ws.add_data_validation(d)
    d.sqref = sqref

SHOPPINGS = '"Norte Shopping RJ,Carioca Shopping,Shopping Tijuca,Plaza Niterói,Boulevard BH,Estação BH,Shopping Del Rey,Estação Cuiabá,Center Shopping Uberlândia"'

# ═══════════════════════════════════════════════════════════════════════════
# 00 - ÍNDICE
# ═══════════════════════════════════════════════════════════════════════════
ws0 = wb.active
ws0.title = "00 - Índice"
for col, w in zip("ABCDE", [6,30,26,52,20]):
    ws0.column_dimensions[col].width = w

write_title(ws0, "🛍  SHOPPING INTELIGENTE — SISTEMA DE AGENTES",
            "Formulários de Cadastro | Banco de Dados Multi-Shopping | v2.0 — Dados Hipotéticos", 5)

ws0.row_dimensions[3].height = 6
write_headers(ws0, 4, ["Nº","Planilha","Agente / Plataforma","Descrição","Status"], C_GRAY_HDR)

sheets_info = [
    ("01","01 - Ponto Vago","Agente 02 + KA/Expansão","Ficha técnica de lojas, quiosques e pop-ups vagos ou a vagar","🟢 Ativo"),
    ("02","02 - Investidor (Farmer)","Agente 02 Farmer","Perfil suitability do investidor: capital, experiência, expectativas","🟢 Ativo"),
    ("03","03 - Marca_Franquia (KA)","Agente 03 KA/Expansão","Marcas e franquias em expansão com requisitos técnicos e praças","🟢 Ativo"),
    ("04","04 - Plano de Mix","Orquestrador + Hunter + KA","Necessidades estratégicas de mix por ponto e globais do shopping","🟢 Ativo"),
    ("05","05 - Fornecedores (Builder)","Plataforma B — Builder","Diretório de fornecedores homologados (obra, tech, RH, jurídico)","🟢 Ativo"),
    ("06","06 - Hunter (Targets)","Agente 01 Hunter","Pipeline de negócios prospectados num raio de 2–50km","🟢 Ativo"),
    ("07","07 - Produtos Financeiros","Plataforma A — Alavancador","Catálogo de soluções financeiras, seguros e benefícios parceiros","🟢 Ativo"),
]
for i,(num,name,agent,desc,status) in enumerate(sheets_info,5):
    even = i%2==0
    bg = C_LIGHT_ROW if even else C_WHITE
    for col,val in enumerate([num,name,agent,desc,status],1):
        c = ws0.cell(row=i,column=col,value=val)
        c.font=FONT_INDEX; c.fill=fill(bg); c.alignment=ALIGN_LEFT; c.border=BORDER_THIN

ws0.row_dimensions[13].height=8
ws0.row_dimensions[14].height=22
ws0.merge_cells("A14:E14")
c=ws0["A14"]; c.value="📡  BASES EXTERNAS (API) — integração automática"
c.font=FONT_SECT; c.fill=fill(C_SECTION); c.alignment=ALIGN_LEFT; c.border=BORDER_MED

api_rows=[
    ("✅","CNPJ / Receita Federal","Agente Hunter","API pública — dados cadastrais, CNAE, endereço, sócios"),
    ("✅","Google Maps / Places API","Agente Hunter","Geolocalização e mapeamento de negócios na região"),
    ("✅","Sistema Bahia (interno)","Todos os agentes","Preços, luvas e condições comerciais — expor via API interna"),
    ("✅","Google Trends API","Agente Hunter","Tendências de busca local para curadoria de mix"),
    ("⚠️","SERASA Experian","Agente Farmer","Contrato B2B necessário — score de crédito do investidor"),
    ("⚠️","ABF Franchising","Agente KA/Expansão","Curadoria manual periódica — redes em expansão"),
    ("⚠️","Dados de fluxo interno","Seller + Hunter","Enriquecer com dados do app do shopping e câmeras"),
]
for i,row in enumerate(api_rows,15):
    bg=C_LIGHT_ROW if i%2==0 else C_WHITE
    for col,val in enumerate(row,1):
        c=ws0.cell(row=i,column=col,value=val)
        c.font=FONT_NOTE; c.fill=fill(bg); c.alignment=ALIGN_LEFT; c.border=BORDER_THIN

ws0.row_dimensions[23].height=8
ws0.row_dimensions[24].height=60
ws0.merge_cells("A24:E24")
note=(
    "💡  COMO USAR ESTE BANCO DE DADOS\n"
    "Cada aba é uma tabela com campo SHOPPING como primeira coluna. "
    "Clique no ▼ do cabeçalho SHOPPING para filtrar por mall. "
    "Para adicionar registros: insira na próxima linha livre — formatação e validações se aplicam automaticamente. "
    "Campos em verde 🟩 são preenchidos automaticamente pelo sistema. "
    "⚠️ Este arquivo contém DADOS HIPOTÉTICOS para fins de demonstração."
)
c=ws0.cell(row=24,column=1,value=note)
c.font=Font(name="Arial",size=9,color="1A1A2E")
c.fill=fill(C_YELLOW); c.alignment=ALIGN_WRAP; c.border=BORDER_MED

# ═══════════════════════════════════════════════════════════════════════════
# 01 - PONTO VAGO
# ═══════════════════════════════════════════════════════════════════════════
ws1 = wb.create_sheet("01 - Ponto Vago")

h01 = ["SHOPPING","ID_PONTO","NOME_CODIGO","TIPO_PONTO","PISO","CORREDOR_ALA",
       "STATUS_ATUAL","DATA_DISPONIBILIDADE","AREA_TOTAL_M2","AREA_VENDAS_M2",
       "AREA_DEPOSITO_M2","VITRINE_ML","PE_DIREITO_M","FORMATO_PLANTA",
       "ENERGIA_KVA","AGUA","ESGOTO","ACESSO_DOCAS","AR_CONDICIONADO",
       "SPRINKLER","PISO_ATUAL","VIZINHA_DIR","VIZINHA_ESQ","VIZINHA_FRENTE",
       "FLUXO_CORREDOR","ANCORA_PROXIMA","PRECO_M2_R$","LUVAS_R$",
       "CARENCIA_MESES","PRAZO_CONTRATO_ANOS","FOTOS_LINKS",
       "PLANTA_BAIXA_LINK","VIDEO_360_LINK","ULTIMA_ATUALIZACAO","RESPONSAVEL"]

col_w01=[22,12,16,14,10,20,18,18,12,12,14,10,12,16,12,16,16,16,18,14,14,
          20,20,20,16,22,14,12,14,16,30,25,25,16,20]

write_title(ws1,"🏪  PONTO VAGO — BANCO DE DADOS MULTI-SHOPPING",
            "Ficha técnica completa de lojas, quiosques e pop-ups vagos ou a vagar",len(h01))
for i,w in enumerate(col_w01,1): ws1.column_dimensions[get_column_letter(i)].width=w
ws1.row_dimensions[3].height=6
write_headers(ws1,3,h01)

dv(ws1,"list",SHOPPINGS,"A4:A1003")
dv(ws1,"list",'"Loja,Quiosque,Pop-up,Corner,Megastore"',"D4:D1003")
dv(ws1,"list",'"Térreo,L1,L2,L3,Subsolo"',"E4:E1003")
dv(ws1,"list",'"Vago,A vagar (data),Em negociação,Ocupado"',"G4:G1003")
dv(ws1,"list",'"Retangular,L,U,Irregular"',"N4:N1003")
dv(ws1,"list",'"Disponível,A instalar,Não tem"',"P4:P1003")
dv(ws1,"list",'"Disponível,A instalar,Não tem"',"Q4:Q1003")
dv(ws1,"list",'"Direto,Indireto,Sem acesso"',"R4:R1003")
dv(ws1,"list",'"Central (incluso),Split próprio,Sem"',"S4:S1003")
dv(ws1,"list",'"Incluído,A instalar,Não tem"',"T4:T1003")
dv(ws1,"list",'"Cimentado,Porcelanato,Outro"',"U4:U1003")
dv(ws1,"list",'"Baixo,Médio,Alto,Âncora direta"',"Y4:Y1003")

rows01=[
# Norte Shopping RJ — maior da lista, vacâncias de médio/alto padrão
["Norte Shopping RJ","PV-001","L1-ALA-A-032","Loja","L1","Ala Moda A","Vago",
 "01/07/2025",210,168,28,12,4.2,"Retangular",
 25,"Disponível","Disponível","Indireto","Central (incluso)","Incluído","Porcelanato",
 "Renner","C&A","Corredor principal","Âncora direta","Renner (8m)",
 420,25000,2,5,
 "https://drive/norte/fotos-pv001","https://drive/norte/planta-pv001","",
 "01/06/2025","Fernanda EV"],

["Norte Shopping RJ","PV-002","T-PF-018","Quiosque","Térreo","Praça de Alimentação","A vagar (data)",
 "01/08/2025",22,20,0,5,3.0,"Retangular",
 10,"Disponível","Disponível","Sem acesso","Central (incluso)","Incluído","Porcelanato",
 "McDonald's","Bob's","Praça central","Âncora direta","McDonald's (4m)",
 580,0,1,2,
 "https://drive/norte/fotos-pv002","","",
 "03/06/2025","Fernanda EV"],

["Norte Shopping RJ","PV-003","L2-ALA-C-007","Loja","L2","Ala Serviços C","Em negociação",
 "15/07/2025",95,78,12,6,3.8,"L",
 15,"Disponível","Disponível","Indireto","Central (incluso)","Incluído","Porcelanato",
 "Ótica Diniz","Chilli Beans","Corredor serviços","Médio","Lojas Americanas (45m)",
 310,8000,2,3,
 "https://drive/norte/fotos-pv003","https://drive/norte/planta-pv003","",
 "05/06/2025","Ricardo EV"],

# Carioca Shopping — perfil popular/acessível, Zona Norte RJ
["Carioca Shopping","PV-004","T-POP-UP-003","Pop-up","Térreo","Entrada Principal","Vago",
 "15/06/2025",30,28,0,6,3.0,"Retangular",
 8,"Não tem","Não tem","Sem acesso","Central (incluso)","Incluído","Porcelanato",
 "Lojas Americanas","Hering","Entrada leste","Alto","Hering (12m)",
 390,5000,1,1,
 "https://drive/carioca/fotos-pv004","","",
 "02/06/2025","Marcos EV"],

["Carioca Shopping","PV-005","L1-ALA-B-015","Loja","L1","Ala Moda B","Vago",
 "01/07/2025",140,112,18,8,3.8,"Retangular",
 18,"Disponível","Disponível","Indireto","Central (incluso)","Incluído","Porcelanato",
 "Riachuelo","Marisa","Corredor moda","Alto","Riachuelo (10m)",
 295,12000,2,5,
 "https://drive/carioca/fotos-pv005","https://drive/carioca/planta-pv005","",
 "04/06/2025","Marcos EV"],

# Shopping Tijuca — premium para padrão Tijuca, moda e serviços
["Shopping Tijuca","PV-006","L1-ALA-P-009","Loja","L1","Ala Premium","Vago",
 "01/08/2025",180,145,22,10,4.5,"Retangular",
 22,"Disponível","Disponível","Direto","Central (incluso)","Incluído","Porcelanato",
 "Track&Field","Arezzo","Corredor premium","Alto","Track&Field (6m)",
 480,20000,2,5,
 "https://drive/tijuca/fotos-pv006","https://drive/tijuca/planta-pv006","https://drive/tijuca/360-pv006",
 "01/06/2025","Beatriz EV"],

["Shopping Tijuca","PV-007","T-KIOSK-011","Quiosque","Térreo","Mall Central","Em negociação",
 "15/07/2025",15,14,0,4,2.8,"Retangular",
 6,"Não tem","Não tem","Sem acesso","Central (incluso)","Incluído","Porcelanato",
 "Vivara","Pandora","Mall central","Alto","Pandora (5m)",
 650,0,0,2,
 "https://drive/tijuca/fotos-pv007","","",
 "06/06/2025","Beatriz EV"],

# Plaza Niterói — único grande em Niterói, mix diversificado
["Plaza Niterói","PV-008","L2-ALA-G-021","Loja","L2","Ala Gastronomia","Vago",
 "01/07/2025",320,265,40,14,4.5,"L",
 40,"Disponível","Disponível","Direto","Central (incluso)","Incluído","Porcelanato",
 "Outback","TGI Fridays","Corredor gastro","Alto","Outback (0m - saiu)",
 420,30000,3,5,
 "https://drive/plaza/fotos-pv008","https://drive/plaza/planta-pv008","https://drive/plaza/360-pv008",
 "01/06/2025","Giovana EV"],

["Plaza Niterói","PV-009","T-PF-005","Quiosque","Térreo","Praça de Alimentação","Vago",
 "15/06/2025",20,18,0,4,2.8,"Retangular",
 8,"Disponível","Disponível","Sem acesso","Central (incluso)","Incluído","Porcelanato",
 "Subway","Spoleto","Praça alimentação","Âncora direta","Cinemark (30m)",
 510,0,1,2,
 "https://drive/plaza/fotos-pv009","","",
 "03/06/2025","Giovana EV"],

# Boulevard BH — premium Belo Horizonte, ancoras fortes
["Boulevard BH","PV-010","L1-ALA-LX-003","Loja","L1","Ala Luxo","Vago",
 "01/09/2025",260,215,30,14,5.0,"Retangular",
 30,"Disponível","Disponível","Direto","Central (incluso)","Incluído","Porcelanato",
 "Zara","Farm","Boulevard central","Âncora direta","Zara (0m - saiu)",
 620,45000,3,5,
 "https://drive/boulevardbh/fotos-pv010","https://drive/boulevardbh/planta-pv010","https://drive/boulevardbh/360-pv010",
 "01/06/2025","Paulo EV"],

["Boulevard BH","PV-011","T-CORN-008","Corner","Térreo","Entrada Sul","Em negociação",
 "01/08/2025",35,33,0,5,3.5,"Retangular",
 10,"Não tem","Não tem","Sem acesso","Central (incluso)","Incluído","Porcelanato",
 "iPlace","Samsung Experience","Corredor tech","Alto","iPlace (10m)",
 580,8000,1,2,
 "https://drive/boulevardbh/fotos-pv011","","",
 "05/06/2025","Paulo EV"],

# Estação BH — popular/acessível, grande fluxo
["Estação BH","PV-012","L1-ALA-C-044","Loja","L1","Ala Central","Vago",
 "01/07/2025",175,140,22,9,3.8,"Retangular",
 20,"Disponível","Disponível","Indireto","Central (incluso)","Incluído","Porcelanato",
 "Marisa","Leader","Corredor moda central","Alto","Marisa (8m)",
 260,10000,2,5,
 "https://drive/estacaobh/fotos-pv012","https://drive/estacaobh/planta-pv012","",
 "02/06/2025","Carla EV"],

["Estação BH","PV-013","T-PF-022","Quiosque","Térreo","Praça Alimentação","Vago",
 "15/06/2025",18,16,0,3.5,2.8,"Retangular",
 8,"Disponível","Disponível","Sem acesso","Central (incluso)","Incluído","Porcelanato",
 "Bob's","Giraffas","Praça alimentação","Âncora direta","Bob's (5m)",
 380,0,1,2,
 "https://drive/estacaobh/fotos-pv013","","",
 "04/06/2025","Carla EV"],

# Shopping Del Rey — bairro consolidado BH, mix equilibrado
["Shopping Del Rey","PV-014","L2-ALA-S-011","Loja","L2","Ala Saúde-Beleza","Vago",
 "01/07/2025",120,96,18,7,3.8,"Retangular",
 15,"Disponível","Disponível","Indireto","Central (incluso)","Incluído","Porcelanato",
 "O Boticário","Granado","Corredor beleza","Médio","O Boticário (12m)",
 320,9000,2,3,
 "https://drive/delrey/fotos-pv014","https://drive/delrey/planta-pv014","",
 "01/06/2025","Felipe EV"],

# Estação Cuiabá — mercado crescente MT, food e âncora
["Estação Cuiabá","PV-015","L1-ALA-A-028","Loja","L1","Ala Moda A","Vago",
 "01/08/2025",160,130,20,9,4.0,"Retangular",
 20,"Disponível","Disponível","Indireto","Central (incluso)","Incluído","Porcelanato",
 "Riachuelo","C&A","Corredor moda","Alto","Riachuelo (0m - saiu)",
 290,12000,2,5,
 "https://drive/estacaocuiaba/fotos-pv015","https://drive/estacaocuiaba/planta-pv015","",
 "03/06/2025","Renata EV"],

["Estação Cuiabá","PV-016","T-PF-009","Quiosque","Térreo","Praça de Alimentação","Em negociação",
 "15/07/2025",20,18,0,4,2.8,"Retangular",
 8,"Disponível","Disponível","Sem acesso","Central (incluso)","Incluído","Porcelanato",
 "Subway","Frangolândia","Praça alimentação","Âncora direta","Burger King (8m)",
 420,0,1,2,
 "https://drive/estacaocuiaba/fotos-pv016","","",
 "05/06/2025","Renata EV"],

# Center Shopping Uberlândia — destaque regional Triângulo Mineiro
["Center Shopping Uberlândia","PV-017","L1-ALA-E-019","Loja","L1","Ala Entretenimento","Vago",
 "01/07/2025",280,230,35,12,4.2,"L",
 28,"Disponível","Disponível","Direto","Central (incluso)","Incluído","Porcelanato",
 "Centauro","Decathlon","Corredor esporte","Alto","Centauro (0m - saiu)",
 360,22000,2,5,
 "https://drive/centeruberl/fotos-pv017","https://drive/centeruberl/planta-pv017","https://drive/centeruberl/360-pv017",
 "01/06/2025","Lucas EV"],

["Center Shopping Uberlândia","PV-018","T-KIOSK-006","Quiosque","Térreo","Mall Central","Vago",
 "15/06/2025",14,13,0,3.5,2.8,"Retangular",
 6,"Não tem","Não tem","Sem acesso","Central (incluso)","Incluído","Porcelanato",
 "Chilli Beans","Ótica Diniz","Mall central","Alto","Cinemark (20m)",
 490,0,0,2,
 "https://drive/centeruberl/fotos-pv018","","",
 "06/06/2025","Lucas EV"],
]

for i,row in enumerate(rows01,4):
    write_data_row(ws1,i,row,is_even=(i%2==0),auto_cols=[2])
add_table(ws1,f"A3:{get_column_letter(len(h01))}1003","Tbl_PontoVago")
ws1.freeze_panes="B4"

# ═══════════════════════════════════════════════════════════════════════════
# 02 - INVESTIDOR (FARMER)
# ═══════════════════════════════════════════════════════════════════════════
ws2 = wb.create_sheet("02 - Investidor (Farmer)")

h02=["SHOPPING","ID_INVESTIDOR","NOME_COMPLETO","CPF","DATA_NASC","EMAIL",
     "TELEFONE_WHATSAPP","CIDADE_BAIRRO","OCUPACAO","SETOR","CARGO_FUNCAO",
     "TEM_CNPJ","CAPITAL_INICIAL_R$","ORIGEM_CAPITAL","CAPITAL_GIRO_MESES",
     "RENDA_MENSAL_R$","TEM_DIVIDAS","EXP_VAREJO","SETORES_ATUOU",
     "JA_EMPREENDEU","TEM_SOCIOS","HORAS_SEMANA","PREFERE_FRANQUIA",
     "CATEGORIA_1","CATEGORIA_2","TAMANHO_PONTO","PAYBACK_ESPERADO",
     "TOLERANCIA_RISCO","PRIORIDADE","FATURAMENTO_ESPERADO_R$",
     "SCORE_FIT","FAIXA_NEGOCIO_REC","STATUS_LEAD","EV_RESPONSAVEL","DATA_CADASTRO"]

col_w02=[22,14,24,14,12,26,18,22,16,16,16,12,18,18,16,14,14,20,22,16,16,
          16,16,18,18,24,16,16,16,20,10,22,18,18,14]

write_title(ws2,"💼  INVESTIDOR (FARMER) — BANCO DE DADOS MULTI-SHOPPING",
            "Perfil suitability do investidor: capital, experiência, tempo e expectativas",len(h02))
for i,w in enumerate(col_w02,1): ws2.column_dimensions[get_column_letter(i)].width=w
ws2.row_dimensions[3].height=6
write_headers(ws2,3,h02)
dv(ws2,"list",SHOPPINGS,"A4:A1003")

rows02=[
["Norte Shopping RJ","INV-001","Patricia Sousa","XXX.XXX.001-01","12/05/1978","patricia.sousa@gmail.com",
 "21-99001-1001","Del Castilho - RJ","CLT","Saúde","Enfermeira-chefe","Não",
 "100-200k","Poupança","12 meses","10-20k","Não",
 "Funcionário","Saúde / Serviços","Não","Não",
 "Parcial (20h)","Sim (franquia)","Saúde-Beleza","Serviços",
 "Loja pequena (15-50m²)","24-36m","Moderado","Equilíbrio","30-80k",
 68,"Franquia beleza/estética","Qualificado","Fernanda EV","10/05/2025"],

["Norte Shopping RJ","INV-002","Roberto Nunes","XXX.XXX.002-02","03/09/1965","roberto.nunes@hotmail.com",
 "21-99002-2002","Méier - RJ","PJ","Varejo","Empresário","Sim",
 "200-500k","Poupança","18+ meses","20-50k","Não",
 "Dono de loja","Moda / Serviços","Sim – Ainda ativo","Sim – sócio de negócio",
 "Integral (40h+)","Não (próprio)","Moda","Serviços",
 "Loja média (50-150m²)","18-24m","Moderado","Equilíbrio","80-200k",
 81,"Loja própria moda mid-market","Em negociação","Fernanda EV","15/05/2025"],

["Carioca Shopping","INV-003","Claudia Ferreira","XXX.XXX.003-03","22/11/1980","claudia.f@yahoo.com.br",
 "21-99003-3003","Andaraí - RJ","CLT","Indústria","Supervisora de produção","Não",
 "50-100k","FGTS","6 meses","5-10k","Não",
 "Nenhuma","Outro","Não","Não",
 "Parcial (20h)","Sim (franquia)","Alimentação","Saúde-Beleza",
 "Quiosque (até 15m²)","24-36m","Conservador","Priorizo segurança","Até 30k",
 55,"Quiosque alimentação franquia","Em triagem","Marcos EV","20/05/2025"],

["Carioca Shopping","INV-004","Alexandre Lima","XXX.XXX.004-04","07/02/1972","alex.lima@uol.com.br",
 "21-99004-4004","Riachuelo - RJ","Empreendedor","Varejo","Proprietário","Sim",
 "100-200k","Empréstimo","6 meses","10-20k","Sim (financiamento)",
 "Gerente","Moda / Serviços","Sim – Encerrou","Não",
 "Integral (40h+)","Indiferente","Moda","Serviços",
 "Loja pequena (15-50m²)","18-24m","Arrojado","Priorizo retorno alto","30-80k",
 62,"Franquia moda acessível","Em triagem","Marcos EV","22/05/2025"],

["Shopping Tijuca","INV-005","Mariana Castro","XXX.XXX.005-05","14/07/1985","mariana.castro@gmail.com",
 "21-99005-5005","Tijuca - RJ","PJ","Tech","Sócia de startup","Sim",
 "200-500k","Sócio","18+ meses","20-50k","Não",
 "Gerente","Tech / Serviços","Sim – Ainda ativo","Sim – sócio de negócio",
 "Parcial (20h)","Não (próprio)","Tech","Serviços",
 "Loja pequena (15-50m²)","18-24m","Moderado","Equilíbrio","30-80k",
 77,"Loja tech/serviços mid-market","Qualificado","Beatriz EV","18/05/2025"],

["Plaza Niterói","INV-006","Sergio Monteiro","XXX.XXX.006-06","29/03/1960","sergio.mont@ig.com.br",
 "21-99006-6006","Icaraí - Niterói","Aposentado","Outro","Aposentado","Não",
 "500k+","Herança","18+ meses","20-50k","Não",
 "Nenhuma","Outro","Não","Não",
 "Só capital","Sim (franquia)","Alimentação","Casa",
 "Quiosque (até 15m²)","36-48m","Conservador","Priorizo segurança","Até 30k",
 71,"Franquia alimentação operador sócio","Qualificado","Giovana EV","12/05/2025"],

["Plaza Niterói","INV-007","Fernanda Barbosa","XXX.XXX.007-07","16/10/1990","fernanda.b@outlook.com",
 "21-99007-7007","Centro - Niterói","CLT","Serviços","Advogada","Sim",
 "100-200k","Poupança","12 meses","10-20k","Não",
 "Funcionário","Saúde / Serviços","Não","Não",
 "Parcial (20h)","Sim (franquia)","Saúde-Beleza","Serviços",
 "Loja pequena (15-50m²)","24-36m","Moderado","Equilíbrio","30-80k",
 73,"Franquia beleza / clínica","Em triagem","Giovana EV","25/05/2025"],

["Boulevard BH","INV-008","Eduardo Pinheiro","XXX.XXX.008-08","08/04/1975","eduardo.pinh@gmail.com",
 "31-99008-8008","Lourdes - BH","PJ","Varejo","Empresário moda","Sim",
 "500k+","Poupança","18+ meses","50k+","Não",
 "Dono de loja","Moda / Outro","Sim – Ainda ativo","Não",
 "Integral (40h+)","Não (próprio)","Moda","Casa",
 "Loja média (50-150m²)","12-18m","Arrojado","Priorizo retorno alto","80-200k",
 89,"Loja moda premium própria","Em negociação","Paulo EV","08/05/2025"],

["Estação BH","INV-009","Camila Rocha","XXX.XXX.009-09","25/01/1988","camila.rocha@gmail.com",
 "31-99009-9009","Santa Efigênia - BH","CLT","Saúde","Nutricionista","Não",
 "50-100k","FGTS","6 meses","5-10k","Não",
 "Nenhuma","Saúde","Não","Sim – familiar",
 "Parcial (20h)","Sim (franquia)","Alimentação","Saúde-Beleza",
 "Quiosque (até 15m²)","24-36m","Conservador","Priorizo segurança","Até 30k",
 60,"Franquia alimentação saudável","Em triagem","Carla EV","14/05/2025"],

["Shopping Del Rey","INV-010","Thiago Alves","XXX.XXX.010-10","31/08/1982","thiago.alves@hotmail.com",
 "31-99010-0010","Buritis - BH","Empreendedor","Serviços","Proprietário academia","Sim",
 "200-500k","Sócio","12 meses","20-50k","Não",
 "Dono de loja","Serviços / Saúde","Sim – Ainda ativo","Sim – sócio de negócio",
 "Integral (40h+)","Não (próprio)","Saúde-Beleza","Serviços",
 "Loja média (50-150m²)","18-24m","Moderado","Equilíbrio","80-200k",
 78,"Academia/studio saúde mid-market","Qualificado","Felipe EV","17/05/2025"],

["Estação Cuiabá","INV-011","Ana Paula Matos","XXX.XXX.011-11","19/06/1979","anapaula.mt@gmail.com",
 "65-99011-1011","Centro - Cuiabá","CLT","Varejo","Gerente de loja","Não",
 "100-200k","Poupança","12 meses","10-20k","Não",
 "Gerente","Moda / Varejo","Não","Não",
 "Parcial (20h)","Sim (franquia)","Moda","Serviços",
 "Loja pequena (15-50m²)","24-36m","Moderado","Equilíbrio","30-80k",
 70,"Franquia moda mid-market","Qualificado","Renata EV","20/05/2025"],

["Center Shopping Uberlândia","INV-012","Gustavo Mendes","XXX.XXX.012-12","05/12/1970","gustavo.mg@outlook.com",
 "34-99012-2012","Tibery - Uberlândia","PJ","Varejo","Empresário supermercadista","Sim",
 "500k+","Poupança","18+ meses","50k+","Não",
 "Dono de loja","Varejo / Alimentação","Sim – Ainda ativo","Sim – sócio de negócio",
 "Integral (40h+)","Indiferente","Alimentação","Serviços",
 "Loja média (50-150m²)","12-18m","Arrojado","Priorizo retorno alto","200k+",
 85,"Operação food própria ou franquia premium","Em negociação","Lucas EV","10/05/2025"],
]

for i,row in enumerate(rows02,4):
    write_data_row(ws2,i,row,is_even=(i%2==0),auto_cols=[2,31,32])
add_table(ws2,f"A3:{get_column_letter(len(h02))}1003","Tbl_Investidor")
ws2.freeze_panes="B4"

# ═══════════════════════════════════════════════════════════════════════════
# 03 - MARCA / FRANQUIA (KA)
# ═══════════════════════════════════════════════════════════════════════════
ws3 = wb.create_sheet("03 - Marca_Franquia (KA)")

h03=["SHOPPING","ID_MARCA","NOME_MARCA","CNPJ_FRANQUEADORA",
     "CATEGORIA","SUBCATEGORIA","POSICIONAMENTO",
     "MODELO_EXPANSAO","UNIDADES_ATIVAS","ANOS_OPERACAO",
     "FATURAMENTO_MEDIO_MES","PAYBACK_MEDIO","TAXA_RENOVACAO_PCT",
     "AREA_MIN_M2","AREA_MAX_M2","VITRINE_MIN_ML",
     "PE_DIREITO_MIN_M","ENERGIA_KVA","AGUA_ESGOTO","DOCAS",
     "PISO_PREFERENCIAL","ESTADOS_INTERESSE","CIDADES_INTERESSE",
     "INTERESSE_NESTA_PRACA","STATUS_EXPANSAO",
     "PERFIL_PARCEIRO","INVESTIMENTO_INICIAL_R$",
     "ROYALTIES_PCT","TAXA_PUBLICIDADE_PCT","SUPORTE_OFERECIDO",
     "ANCORAS_REFERENCIA","CATEGORIAS_COMPLEMENTARES","CATEGORIAS_EVITAR",
     "KA_RESPONSAVEL","DATA_ULTIMO_CONTATO","SCORE_FIT"]

col_w03=[22,12,22,18,18,18,16,18,12,12,18,14,16,12,12,12,12,12,16,12,16,
          22,28,22,18,24,18,12,16,30,28,28,28,20,16,12]

write_title(ws3,"🏢  MARCA / FRANQUIA (KA) — BANCO DE DADOS MULTI-SHOPPING",
            "Cadastro de marcas e franquias em expansão com requisitos técnicos e praças de interesse",len(h03))
for i,w in enumerate(col_w03,1): ws3.column_dimensions[get_column_letter(i)].width=w
ws3.row_dimensions[3].height=6
write_headers(ws3,3,h03)
dv(ws3,"list",SHOPPINGS,"A4:A1003")

rows03=[
["Norte Shopping RJ","MRC-001","Oakberry","11.111.111/0001-01",
 "Alimentação","Açaí premium","Premium",
 "Franquia",320,8,"100-200k","18-24m",88,
 20,35,3.5,3.0,10,"Desejável","Não precisa","Térreo",
 "RJ / SP / MG","Rio de Janeiro, Niterói, Belo Horizonte",
 "Sim – Alta prioridade","Ativa buscando",
 "Operador integral (40h+)",280000,8,2,
 "Treinamento / Projeto de obra / Marketing",
 "McDonald's / Bob's","Moda casual / Serviços","",
 "Fernanda EV","05/06/2025",88],

["Norte Shopping RJ","MRC-002","Smart Fit","22.222.222/0001-02",
 "Saúde-Beleza","Academia low-cost","Acessível",
 "Loja própria",520,12,"200-500k","18-24m",91,
 600,1200,0,4.0,80,"Não precisa","Não precisa","L1",
 "RJ / SP / MG / PR","Rio de Janeiro, São Paulo, Belo Horizonte",
 "Sim – Alta prioridade","Ativa buscando",
 "Só capital (passivo)",4500000,0,0,
 "Projeto de obra / Marketing / TI",
 "Renner / C&A","Alimentação / Saúde","",
 "Fernanda EV","06/06/2025",82],

["Carioca Shopping","MRC-003","Cacau Show","33.333.333/0001-03",
 "Alimentação","Chocolates premium","Mid-market",
 "Franquia",2100,28,"50-100k","18-24m",85,
 25,60,3.0,3.0,8,"Não precisa","Não precisa","Térreo",
 "RJ / SP / MG / RS","Rio de Janeiro, Niterói, São Paulo",
 "Sim – Alta prioridade","Ativa buscando",
 "Operador integral (40h+)",120000,4,1,
 "Treinamento / Estoque inicial / Marketing",
 "McDonald's / Hering","Moda / Serviços","",
 "Marcos EV","04/06/2025",80],

["Shopping Tijuca","MRC-004","Animale","44.444.444/0001-04",
 "Moda","Moda feminina premium","Premium",
 "Loja própria",110,18,"200-500k","24-36m",78,
 80,150,8.0,3.5,20,"Não precisa","Não precisa","Térreo",
 "RJ / SP","Rio de Janeiro, São Paulo",
 "Sim – Alta prioridade","Ativa buscando",
 "Só capital (passivo)",900000,0,0,
 "Projeto de obra / Marketing / TI",
 "Farm / Arezzo","Acessórios / Saúde-Beleza","",
 "Beatriz EV","05/06/2025",85],

["Plaza Niterói","MRC-005","Bob's","55.555.555/0001-05",
 "Alimentação","Fast food brasileiro","Acessível",
 "Franquia",1100,45,"100-200k","18-24m",89,
 60,180,6.0,3.5,25,"Obrigatório","Obrigatório","Térreo",
 "RJ / SP / MG / DF","Rio de Janeiro, Niterói, São Paulo, Brasília",
 "Sim – Alta prioridade","Ativa buscando",
 "Operador integral (40h+)",600000,5,1,
 "Treinamento / Projeto de obra / Estoque inicial / Marketing",
 "McDonald's / Subway","Moda / Serviços","",
 "Giovana EV","06/06/2025",83],

["Boulevard BH","MRC-006","Reserva","66.666.666/0001-06",
 "Moda","Moda masculina casual-premium","Premium",
 "Loja própria",160,14,"200-500k","24-36m",82,
 80,160,8.0,3.8,18,"Não precisa","Não precisa","Térreo",
 "SP / RJ / MG / PR","São Paulo, Rio de Janeiro, Belo Horizonte",
 "Sim – Alta prioridade","Ativa buscando",
 "Só capital (passivo)",950000,0,0,
 "Projeto de obra / Marketing / TI",
 "Farm / Animale","Acessórios / Beleza","",
 "Paulo EV","03/06/2025",90],

["Boulevard BH","MRC-007","Kopenhagen","77.777.777/0001-07",
 "Alimentação","Chocolates / café premium","Premium",
 "Franquia",320,52,"100-200k","24-36m",87,
 30,80,3.5,3.0,10,"Não precisa","Não precisa","Térreo",
 "SP / RJ / MG","São Paulo, Rio de Janeiro, Belo Horizonte",
 "Sim – Alta prioridade","Ativa buscando",
 "Operador integral (40h+)",350000,8,2,
 "Treinamento / Marketing / TI",
 "Zara / Farm","Acessórios / Serviços","",
 "Paulo EV","04/06/2025",86],

["Estação BH","MRC-008","McDonald's","88.888.888/0001-08",
 "Alimentação","Fast food","Acessível",
 "Franquia",1050,40,"500k+","18-24m",93,
 150,350,0,4.0,80,"Obrigatório","Obrigatório","Térreo",
 "SP / RJ / MG / PR / RS / BA","Todas capitais e cidades 200k+",
 "Sim – Em análise","Ativa buscando",
 "Operador integral (40h+)",2800000,5,4,
 "Treinamento / Projeto de obra / Marketing / TI",
 "Renner / C&A","Varejo / Serviços","",
 "Carla EV","06/06/2025",79],

["Shopping Del Rey","MRC-009","O Boticário","99.999.999/0001-09",
 "Saúde-Beleza","Perfumaria e cosméticos","Mid-market",
 "Franquia",3900,42,"50-100k","18-24m",90,
 30,70,3.5,3.0,8,"Não precisa","Não precisa","Indiferente",
 "Todos os estados","Todas cidades 100k+",
 "Sim – Alta prioridade","Ativa buscando",
 "Operador integral (40h+)",180000,3,2,
 "Treinamento / Estoque inicial / Marketing",
 "Renner / C&A / Riachuelo","Moda / Farmácia","",
 "Felipe EV","05/06/2025",84],

["Estação Cuiabá","MRC-010","Chilli Beans","10.101.010/0001-10",
 "Moda","Óculos e acessórios","Mid-market",
 "Franquia",1020,20,"50-100k","18-24m",86,
 15,40,3.0,2.8,6,"Não precisa","Não precisa","Térreo",
 "Todos os estados","Cuiabá, Goiânia, Palmas, Campo Grande",
 "Sim – Alta prioridade","Ativa buscando",
 "Operador integral (40h+)",150000,8,2,
 "Treinamento / Estoque inicial / Marketing",
 "Renner / C&A","Moda / Calçados","",
 "Renata EV","04/06/2025",81],

["Center Shopping Uberlândia","MRC-011","Centauro","11.110.000/0001-11",
 "Esporte","Artigos esportivos","Acessível",
 "Loja própria",280,22,"500k+","24-36m",88,
 200,500,0,4.5,60,"Não precisa","Não precisa","Térreo",
 "SP / MG / RJ / PR / RS","São Paulo, BH, Rio, Curitiba, Porto Alegre, Uberlândia",
 "Sim – Alta prioridade","Ativa buscando",
 "Só capital (passivo)",3200000,0,0,
 "Projeto de obra / Marketing / TI",
 "Renner / C&A","Saúde-Beleza / Serviços","",
 "Lucas EV","05/06/2025",87],
]

for i,row in enumerate(rows03,4):
    write_data_row(ws3,i,row,is_even=(i%2==0),auto_cols=[2,36])
add_table(ws3,f"A3:{get_column_letter(len(h03))}1003","Tbl_MarcaFranquia")
ws3.freeze_panes="B4"

# ═══════════════════════════════════════════════════════════════════════════
# 04 - PLANO DE MIX
# ═══════════════════════════════════════════════════════════════════════════
ws4 = wb.create_sheet("04 - Plano de Mix")

h04=["SHOPPING","ID_PLANO","RESPONSAVEL","VALIDADE_PLANO",
     "VACANCIA_ATUAL_PCT","META_VACANCIA_PCT","SEGMENTO_ALVO",
     "CATEGORIAS_EM_FALTA","CATEGORIAS_EM_EXCESSO","CATEGORIAS_ANCORA",
     "INOVACOES_DESEJADAS","MARCAS_ALVO",
     "PONTO_ID","PISO","CAT_1A_OPCAO","CAT_2A_OPCAO","CATS_EXCLUIDAS","PRIORIDADE_PONTO",
     "DATAS_CHAVE","PRACA_EVENTOS","BUDGET_MARKETING_R$","ULTIMA_REVISAO"]

col_w04=[22,12,20,14,16,14,28,30,28,28,36,36,12,10,22,22,24,14,30,20,18,14]

write_title(ws4,"🗺  PLANO DE MIX — BANCO DE DADOS MULTI-SHOPPING",
            "Necessidades estratégicas de mix por ponto e globais do shopping",len(h04))
for i,w in enumerate(col_w04,1): ws4.column_dimensions[get_column_letter(i)].width=w
ws4.row_dimensions[3].height=6
write_headers(ws4,3,h04)
dv(ws4,"list",SHOPPINGS,"A4:A1003")
dv(ws4,"list",'"Alta,Média,Baixa"',"R4:R1003")
dv(ws4,"list",'"Disponível,Parcialmente,Em reforma"',"T4:T1003")
dv(ws4,"list",'"Até 500k,500k-1M,1M-3M,3M+"',"U4:U1003")

rows04=[
["Norte Shopping RJ","MIX-001","Fernanda Diretora","30/12/2025",
 3.8,2.5,"Classes A / B / Jovens / Famílias",
 "Alimentação saudável / Saúde-Beleza / Tech","Joalherias",
 "Renner / C&A / Cinemark / McDonald's",
 "Dark kitchen, academia boutique, clínica beauty tech",
 "Oakberry, Smart Fit, iPlace, Granado",
 "PV-001","L1","Alimentação saudável","Saúde-Beleza","Joalherias","Alta",
 "Dia das Mães / Natal / Black Friday","Disponível","3M+","01/06/2025"],

["Carioca Shopping","MIX-002","Marcos Gerente","30/12/2025",
 5.2,3.5,"Classes B / C / Famílias / Jovens",
 "Pet / Alimentação saudável / Serviços digitais","Óticas em excesso",
 "Lojas Americanas / Hering / Bob's",
 "Espaço kids, serviço cartório/lotérica, pet shop",
 "Cacau Show, Petlove, Espaço Laser",
 "PV-004","Térreo","Alimentação","Pet","Óticas","Alta",
 "Dia das Crianças / Natal / Carnaval","Disponível","500k-1M","01/06/2025"],

["Shopping Tijuca","MIX-003","Beatriz Diretora","30/12/2025",
 2.9,2.0,"Classes A / B / Adultos / Casais",
 "Moda premium feminina / Joias / Gastronomia diferenciada","Fast food popular",
 "Track&Field / Pandora / Farm",
 "Restaurante autoral, ateliê de moda, spa urban",
 "Animale, Farm Rio, Villa Dolce",
 "PV-006","L1","Moda premium","Gastronomia","Fast food popular","Alta",
 "Dia das Mães / Dia dos Namorados / Natal","Parcialmente","1M-3M","01/06/2025"],

["Plaza Niterói","MIX-004","Giovana Diretora","30/12/2025",
 4.5,3.0,"Classes A / B / C / Famílias",
 "Gastronomia sit-down / Academia / Pet","Varejo popular redundante",
 "Cinemark / C&A / Outback",
 "Food hall regional, studio pilates, clínica multidisciplinar",
 "Bob's, Smart Fit, Petlove, Madero",
 "PV-008","L2","Gastronomia","Saúde-Beleza","Varejo popular","Alta",
 "Dia das Mães / Natal / Black Friday","Disponível","1M-3M","01/06/2025"],

["Boulevard BH","MIX-005","Paulo Diretor","30/12/2025",
 2.1,1.5,"Classes A / B / Jovens premium",
 "Moda masculina premium / Casa & Design / Tech premium","Fast food popular",
 "Zara / Farm / Pandora",
 "Loja de design, studio fotografia, concept store",
 "Reserva, Kopenhagen, iPlace, Marimekko",
 "PV-010","L1","Moda premium","Casa & Design","Fast food popular","Alta",
 "Dia dos Namorados / Black Friday / Natal","Disponível","3M+","01/06/2025"],

["Estação BH","MIX-006","Carla Gerente","30/12/2025",
 6.1,4.0,"Classes B / C / Famílias / Trabalhadores",
 "Alimentação rápida / Serviços / Saúde básica","Moda masculina duplicada",
 "Americanas / Renner / Bob's",
 "Lotérica, cartório, clínica popular, dark kitchen",
 "McDonald's, Espaço Laser, Farmácia Popular, Giraffas",
 "PV-012","L1","Alimentação","Serviços","Moda masculina duplicada","Alta",
 "Dia das Mães / Natal / Carnaval","Disponível","500k-1M","01/06/2025"],

["Shopping Del Rey","MIX-007","Felipe Gerente","30/12/2025",
 3.3,2.5,"Classes B / C / Famílias / Sênior",
 "Saúde-Beleza / Pet / Serviços digitais","Papelaria redundante",
 "O Boticário / Renner / Cinemark",
 "Pet shop completo, studio pilates, farmácia + clínica",
 "O Boticário exp., Petlove, Clínica Sim",
 "PV-014","L2","Saúde-Beleza","Pet","Papelaria","Alta",
 "Dia das Mães / Black Friday / Natal","Parcialmente","500k-1M","01/06/2025"],

["Estação Cuiabá","MIX-008","Renata Gerente","30/12/2025",
 5.8,3.5,"Classes B / C / Jovens / Famílias",
 "Moda feminina / Pet / Tecnologia","Lojas de materiais de construção",
 "Riachuelo / Burger King / Cinemark",
 "Pop-up moda regional, petshop, loja de tecnologia",
 "Chilli Beans, Petlove, Magazine Luiza",
 "PV-015","L1","Moda","Tech","Materiais construção","Alta",
 "Dia das Mães / Natal / Black Friday","Disponível","500k-1M","01/06/2025"],

["Center Shopping Uberlândia","MIX-009","Lucas Diretor","30/12/2025",
 3.0,2.0,"Classes A / B / C / Famílias / Jovens",
 "Esporte premium / Gastronomia sit-down / Saúde","Academia low-cost duplicada",
 "Renner / C&A / Cinemark / Outback",
 "Esporte premium, food hall, clínica estética",
 "Centauro, Smart Fit, Madero, Clínica Sim",
 "PV-017","L1","Esporte","Gastronomia","Academia low-cost","Alta",
 "Dia das Mães / Natal / Black Friday","Disponível","1M-3M","01/06/2025"],
]

for i,row in enumerate(rows04,4):
    write_data_row(ws4,i,row,is_even=(i%2==0),auto_cols=[2])
add_table(ws4,f"A3:{get_column_letter(len(h04))}1003","Tbl_PlanoMix")
ws4.freeze_panes="B4"

# ═══════════════════════════════════════════════════════════════════════════
# 05 - FORNECEDORES (BUILDER)
# ═══════════════════════════════════════════════════════════════════════════
ws5 = wb.create_sheet("05 - Fornecedores (Builder)")

h05=["SHOPPING","ID_FORNECEDOR","RAZAO_SOCIAL","CNPJ",
     "NOME_FANTASIA","CATEGORIA_SERVICO","ESPECIALIDADE",
     "CONTATO_COMERCIAL","EMAIL","TELEFONE","SITE",
     "JA_REALIZOU_OBRAS_AQUI","CONHECE_MANUAL_LOJISTA",
     "CERTIFICACOES","STATUS_HOMOLOGACAO","DATA_HOMOLOGACAO",
     "PROJETOS_SHOPPING_TOTAL","PORTFOLIO_LINKS",
     "AVALIACAO_MEDIA","NUM_AVALIACOES",
     "FAIXA_PRECO","TICKET_MEDIO_R$","CAPACIDADE_SIMULTANEA","PRAZO_MEDIO_ENTREGA"]

col_w05=[22,14,28,18,22,24,28,22,26,16,24,18,18,22,16,14,14,30,12,12,16,16,16,20]

write_title(ws5,"🔨  FORNECEDORES (BUILDER) — BANCO DE DADOS MULTI-SHOPPING",
            "Marketplace de fornecedores homologados pelo shopping",len(h05))
for i,w in enumerate(col_w05,1): ws5.column_dimensions[get_column_letter(i)].width=w
ws5.row_dimensions[3].height=6
write_headers(ws5,3,h05)
dv(ws5,"list",SHOPPINGS,"A4:A1003")
dv(ws5,"list",'"Arquitetura,Engenharia,Obra,Materiais,Mobiliário,Tech Varejo,Site-Social,RH-Recrutamento,Folha-Sindicato,Jurídico"',"F4:F1003")
dv(ws5,"list",'"Homologado,Em análise,Suspenso"',"O4:O1003")
dv(ws5,"list",'"Econômico,Intermediário,Premium"',"U4:U1003")
dv(ws5,"list",'"Até 30k,30-100k,100-300k,300k+"',"V4:V1003")
dv(ws5,"list",'"Até 30 dias,30-60 dias,60-90 dias,90+ dias"',"X4:X1003")

rows05=[
["Norte Shopping RJ","FORN-001","Construtora Norte Obras Ltda","11.222.333/0001-01",
 "Norte Obras","Obra","Obras em shopping centers e lojas âncora",
 "Roberto Faria","roberto@norteobras.com.br","21-3201-4411","www.norteobras.com.br",
 "Sim","Sim","CREA / ISO","Homologado","10/01/2024",
 34,"https://norteobras.com.br/portfolio",4.7,31,"Intermediário","30-100k",5,"30-60 dias"],

["Norte Shopping RJ","FORN-002","TechPDV Soluções","22.333.444/0001-02",
 "TechPDV","Tech Varejo","Sistemas POS, software varejo, integrações ERP",
 "Camila Tech","camila@techpdv.com.br","21-3202-5522","www.techpdv.com.br",
 "Sim","Sim","CFT","Homologado","15/03/2024",
 18,"https://techpdv.com.br/cases",4.5,20,"Intermediário","Até 30k",8,"Até 30 dias"],

["Carioca Shopping","FORN-003","Arquitetura Carioca Atelier","33.444.555/0001-03",
 "Carioca Atelier","Arquitetura","Projeto e execução de lojas em shopping mid-market",
 "Ana Arquiteta","ana@cariocaatelier.com.br","21-3303-6633","www.cariocaatelier.com.br",
 "Sim","Sim","CAU / ISO","Homologado","20/02/2024",
 22,"https://cariocaatelier.com.br/portfolio",4.6,19,"Intermediário","30-100k",4,"30-60 dias"],

["Shopping Tijuca","FORN-004","Premium Fit Out RJ","44.555.666/0001-04",
 "Premium Fit Out","Obra","Fit out premium para marcas de moda e gastronomia",
 "Carlos Premium","carlos@premiumfitout.com.br","21-3404-7744","www.premiumfitout.com.br",
 "Sim","Sim","CREA / ISO","Homologado","05/01/2024",
 28,"https://premiumfitout.com.br/portfolio",4.8,26,"Premium","100-300k",3,"60-90 dias"],

["Plaza Niterói","FORN-005","Niterói Construções Ltda","55.666.777/0001-05",
 "Niterói Construções","Obra","Obras de varejo e alimentação em shopping",
 "Paulo Niterói","paulo@niteclass.com.br","21-3505-8855","www.niteclass.com.br",
 "Sim","Sim","CREA","Homologado","12/04/2024",
 15,"https://niteclass.com.br/obras",4.4,14,"Intermediário","30-100k",4,"30-60 dias"],

["Boulevard BH","FORN-006","BH Arquitetura Premium","66.777.888/0001-06",
 "BH Premium","Arquitetura","Projetos de alto padrão para marcas premium e luxo",
 "Lucia Premium","lucia@bhpremium.com.br","31-3201-9966","www.bhpremium.com.br",
 "Sim","Sim","CAU / ISO","Homologado","08/02/2024",
 31,"https://bhpremium.com.br/portfolio",4.9,29,"Premium","100-300k",3,"60-90 dias"],

["Estação BH","FORN-007","Construbh Popular Ltda","77.888.999/0001-07",
 "Construbh","Obra","Obras econômicas para varejo popular e serviços",
 "José Construbh","jose@construbh.com.br","31-3302-0077","www.construbh.com.br",
 "Sim","Sim","CREA","Homologado","20/03/2024",
 41,"https://construbh.com.br/obras",4.3,38,"Econômico","Até 30k",6,"Até 30 dias"],

["Shopping Del Rey","FORN-008","Del Rey Obras e Reformas","88.999.000/0001-08",
 "Del Rey Reformas","Obra","Reformas e manutenção predial em shopping",
 "André Reformas","andre@delreyreformas.com.br","31-3403-1188","www.delreyreformas.com.br",
 "Sim","Sim","CREA","Homologado","14/01/2024",
 23,"https://delreyreformas.com.br/cases",4.5,21,"Intermediário","30-100k",4,"30-60 dias"],

["Estação Cuiabá","FORN-009","CuiabáBuild Construtora","99.000.111/0001-09",
 "CuiabáBuild","Obra","Obras em shopping e varejo — Centro-Oeste",
 "Marcos Cuiabá","marcos@cuiababuild.com.br","65-3201-2299","www.cuiababuild.com.br",
 "Sim","Sim","CREA","Homologado","18/05/2024",
 12,"https://cuiababuild.com.br/portfolio",4.2,11,"Intermediário","30-100k",3,"30-60 dias"],

["Center Shopping Uberlândia","FORN-010","Uberlândia Fit Out","10.001.112/0001-10",
 "Uberl Fit Out","Obra","Fit out comercial varejo e food — Triângulo Mineiro",
 "Fernando Uberlândia","fernando@uberlfit.com.br","34-3202-3310","www.uberlfit.com.br",
 "Sim","Sim","CREA / ISO","Homologado","22/04/2024",
 19,"https://uberlfit.com.br/obras",4.6,17,"Intermediário","30-100k",4,"30-60 dias"],
]

for i,row in enumerate(rows05,4):
    write_data_row(ws5,i,row,is_even=(i%2==0),auto_cols=[2])
add_table(ws5,f"A3:{get_column_letter(len(h05))}1003","Tbl_Fornecedores")
ws5.freeze_panes="B4"

# ═══════════════════════════════════════════════════════════════════════════
# 06 - HUNTER (TARGETS)
# ═══════════════════════════════════════════════════════════════════════════
ws6 = wb.create_sheet("06 - Hunter (Targets)")

h06=["SHOPPING","ID_TARGET","NOME_NEGOCIO","CNPJ",
     "CATEGORIA","SUBCATEGORIA","RAIO_KM",
     "ENDERECO","CIDADE_UF",
     "FATURAMENTO_ESTIMADO","TEMPO_ATIVO_ANOS",
     "SCORE_FIT","STATUS_ABORDAGEM",
     "CONTATO_NOME","CONTATO_TEL","CONTATO_EMAIL",
     "DATA_1A_ABORDAGEM","DATA_ULTIMA_ACAO",
     "OBSERVACOES_PROXIMA_ACAO","EV_RESPONSAVEL"]

col_w06=[22,12,26,18,18,18,10,30,18,18,14,12,20,22,16,26,14,14,40,18]

write_title(ws6,"🔍  HUNTER (TARGETS) — BANCO DE DADOS MULTI-SHOPPING",
            "Pipeline de negócios prospectados num raio de 2–50km do shopping",len(h06))
for i,w in enumerate(col_w06,1): ws6.column_dimensions[get_column_letter(i)].width=w
ws6.row_dimensions[3].height=6
write_headers(ws6,3,h06)
dv(ws6,"list",SHOPPINGS,"A4:A1003")
dv(ws6,"list",'"Identificado,1ª Abordagem,Em Negociação,Proposta Enviada,Convertido,Descartado"',"M4:M1003")

rows06=[
["Norte Shopping RJ","TGT-001","Açaí do Morro RJ","AB.111.111/0001-01",
 "Alimentação","Açaí / Smoothies",1.8,
 "Rua Camboatá, 200 - Del Castilho","Rio de Janeiro - RJ",
 "50-100k",6,83,"1ª Abordagem",
 "Dona Maria","21-98801-1111","acaidomorrorj@gmail.com",
 "02/06/2025","05/06/2025",
 "Produto bom, atendimento inconsistente. Interesse em franquear. Enviar proposta de quiosque PV-002","Fernanda EV"],

["Norte Shopping RJ","TGT-002","Studio Looks Hair","AB.222.222/0001-02",
 "Saúde-Beleza","Salão premium / Coloração",2.5,
 "Av. Suburbana, 1400 - Engenho de Dentro","Rio de Janeiro - RJ",
 "50-100k",8,76,"Identificado",
 "","","",
 "","04/06/2025",
 "Salão bem posicionado, clientela fiel. Abordagem fria via Instagram agendada","Fernanda EV"],

["Carioca Shopping","TGT-003","Brigaderia Carioca","AB.333.333/0001-03",
 "Alimentação","Confeitaria artesanal / Brigadeiros",0.9,
 "Rua Haddock Lobo, 45 - Andaraí","Rio de Janeiro - RJ",
 "30-80k",4,78,"Em Negociação",
 "Bianca Doces","21-97703-3333","brigadeiriacarioca@insta.com",
 "28/05/2025","06/06/2025",
 "Muito interesse. Aguardando simulação financeira do quiosque PV-004 para fechar","Marcos EV"],

["Carioca Shopping","TGT-004","Clínica Ativa Saúde","AB.444.444/0001-04",
 "Saúde-Beleza","Clínica estética / Laser",1.2,
 "Rua Barão de Mesquita, 380 - Tijuca","Rio de Janeiro - RJ",
 "80-200k",5,82,"1ª Abordagem",
 "Dr. André","21-97704-4444","clinicaativa@gmail.com",
 "01/06/2025","05/06/2025",
 "Interesse em expansão. Precisa de ponto com pia/água. PV-005 é boa opção","Marcos EV"],

["Shopping Tijuca","TGT-005","Dona Firmeza Comida Mineira","AB.555.555/0001-05",
 "Alimentação","Restaurante regional / Marmitaria",1.1,
 "Rua Conde de Bonfim, 720 - Tijuca","Rio de Janeiro - RJ",
 "50-100k",11,79,"1ª Abordagem",
 "Firmeza Lima","21-97905-5555","donafirmeza@gmail.com",
 "03/06/2025","06/06/2025",
 "Reconhecida no bairro. Resistência ao aluguel de shopping. Mostrar fluxo e ROI comparado","Beatriz EV"],

["Shopping Tijuca","TGT-006","Ótica Visão Nítida","AB.666.666/0001-06",
 "Saúde-Beleza","Ótica / Exames de vista",0.7,
 "Rua Uruguai, 214 - Tijuca","Rio de Janeiro - RJ",
 "50-100k",14,71,"Identificado",
 "","","",
 "","05/06/2025",
 "Loja bem localizada, fluxo bom. Já tem presença em 2 shoppings de Niterói. Abordagem via KA","Beatriz EV"],

["Plaza Niterói","TGT-007","Petisco do Araribóia","AB.777.777/0001-07",
 "Alimentação","Bar / Petiscos / Cervejas artesanais",2.2,
 "Rua Visconde do Rio Branco, 80 - Centro Niterói","Niterói - RJ",
 "80-200k",7,86,"Em Negociação",
 "Marcelo Bar","21-97707-7777","petiscoararibuia@gmail.com",
 "25/05/2025","06/06/2025",
 "Excelente avaliação Google. Proposta para ponto PV-008 enviada. Reunião 12/06","Giovana EV"],

["Plaza Niterói","TGT-008","MathFit Academia","AB.888.888/0001-08",
 "Saúde-Beleza","Academia funcional / CrossFit",3.4,
 "Rua da Conceição, 120 - Icaraí","Niterói - RJ",
 "80-200k",4,74,"1ª Abordagem",
 "Matheus Fit","21-97708-8888","mathfit@outlook.com",
 "04/06/2025","06/06/2025",
 "Turmas lotadas, procura espaço maior. Mostrar viabilidade de 600m2 no L2","Giovana EV"],

["Boulevard BH","TGT-009","Ateliê Roupas MG","AB.999.999/0001-09",
 "Moda","Moda autoral feminina / Ateliê",1.4,
 "Rua dos Inconfidentes, 850 - Lourdes - BH","Belo Horizonte - MG",
 "80-200k",6,88,"Proposta Enviada",
 "Carolina Moda","31-97209-9999","atelieroupasmg@gmail.com",
 "22/05/2025","05/06/2025",
 "Marca com forte identidade e clientela A/B. Proposta loja PV-010 enviada. Decisão até 20/06","Paulo EV"],

["Boulevard BH","TGT-010","Café Libreria Belo","AB.100.100/0001-10",
 "Alimentação","Café com livros / Experiência cultural",0.8,
 "Av. do Contorno, 1200 - Santa Efigênia - BH","Belo Horizonte - MG",
 "30-80k",3,81,"Em Negociação",
 "Beatriz Café","31-97210-0010","cafelihreria@gmail.com",
 "28/05/2025","06/06/2025",
 "Conceito único, fit perfeito para Boulevard. Negociando adequação de espaço no L1","Paulo EV"],

["Estação BH","TGT-011","Frango da Roça BH","AB.110.110/0001-11",
 "Alimentação","Frango assado / Fast casual",1.6,
 "Rua Cláudio Manoel, 400 - Funcionários - BH","Belo Horizonte - MG",
 "50-100k",9,77,"1ª Abordagem",
 "Seu Zé","31-97611-1111","frangolaroca@hotmail.com",
 "01/06/2025","05/06/2025",
 "Produto muito bom, operação familiar. Ver interesse em quiosque PV-013","Carla EV"],

["Shopping Del Rey","TGT-012","Studio Corpore Pilates","AB.120.120/0001-12",
 "Saúde-Beleza","Pilates / Fisioterapia",2.1,
 "Rua Grão Pará, 600 - Buritis - BH","Belo Horizonte - MG",
 "50-100k",5,80,"1ª Abordagem",
 "Fernanda Pilates","31-97412-2112","studiocorpore@gmail.com",
 "03/06/2025","06/06/2025",
 "Studio com 3 turmas/dia lotadas. Interesse em expandir. PV-014 ideal para saúde","Felipe EV"],

["Estação Cuiabá","TGT-013","Sítio Verde Açaí MT","AB.130.130/0001-13",
 "Alimentação","Açaí regional / Vitaminas",1.3,
 "Av. CPA, 1500 - CPA - Cuiabá","Cuiabá - MT",
 "30-80k",3,75,"Em Negociação",
 "Josué MT","65-97613-3113","sitioverdeacai@gmail.com",
 "29/05/2025","06/06/2025",
 "Produto muito aceito localmente. Negociando quiosque PV-016 na praça de alimentação","Renata EV"],

["Estação Cuiabá","TGT-014","Pet Amor Cuiabá","AB.140.140/0001-14",
 "Saúde-Beleza","Pet shop / Banho & tosa",2.8,
 "Rua dos Ipês, 230 - Jardim Itália - Cuiabá","Cuiabá - MT",
 "50-100k",4,79,"Identificado",
 "","","",
 "","05/06/2025",
 "Único pet shop de qualidade no raio. Oportunidade clara. Abordagem presencial programada","Renata EV"],

["Center Shopping Uberlândia","TGT-015","TriAtleta Sports Uberl","AB.150.150/0001-15",
 "Esporte","Loja multimarcas esporte / Triathlon",1.7,
 "Av. João Naves de Ávila, 2200 - Santa Mônica - Uberlândia","Uberlândia - MG",
 "80-200k",7,84,"Proposta Enviada",
 "Ricardo Atleta","34-97615-5115","triatletasports@gmail.com",
 "23/05/2025","05/06/2025",
 "Loja referência triathlon no Triângulo. Proposta ponto PV-017 enviada. Resposta esperada 15/06","Lucas EV"],

["Center Shopping Uberlândia","TGT-016","Sabor do Cerrado Restaurante","AB.160.160/0001-16",
 "Alimentação","Gastronomia regional / Buffet executivo",2.5,
 "Av. Cesário Alvim, 900 - Centro - Uberlândia","Uberlândia - MG",
 "80-200k",12,80,"1ª Abordagem",
 "Chef Marcos","34-97616-6116","sabordocerrado@gmail.com",
 "02/06/2025","06/06/2025",
 "Referência gastronômica local. Avaliar possibilidade de ponto âncora gastro no L1","Lucas EV"],
]

for i,row in enumerate(rows06,4):
    write_data_row(ws6,i,row,is_even=(i%2==0),auto_cols=[2,12])
add_table(ws6,f"A3:{get_column_letter(len(h06))}1003","Tbl_Hunter")
ws6.freeze_panes="B4"

# ═══════════════════════════════════════════════════════════════════════════
# 07 - PRODUTOS FINANCEIROS
# ═══════════════════════════════════════════════════════════════════════════
ws7 = wb.create_sheet("07 - Produtos Financeiros")

h07=["SHOPPING","ID_PRODUTO","NOME_PRODUTO","TIPO_PRODUTO",
     "PARCEIRO_INSTITUICAO","CONTATO_PARCEIRO",
     "VALOR_MIN_R$","VALOR_MAX_R$","TAXA_JUROS_PCT_AM","PRAZO_MAX_MESES",
     "CARENCIA_MESES","GARANTIA_NECESSARIA",
     "FASE_NEGOCIO_ELEGIVEL","SCORE_CREDITO_MIN",
     "TEMPO_MIN_CONTRATO_MESES","NUM_MIN_FUNCIONARIOS",
     "LINK_CONTRATACAO","PRAZO_APROVACAO_DU","STATUS_PRODUTO","ULTIMA_ATUALIZACAO"]

col_w07=[22,12,26,22,24,22,14,14,14,14,12,24,28,14,16,16,30,14,20,14]

write_title(ws7,"🏦  PRODUTOS FINANCEIROS — BANCO DE DADOS MULTI-SHOPPING",
            "Catálogo de soluções financeiras, seguros e benefícios para lojistas",len(h07))
for i,w in enumerate(col_w07,1): ws7.column_dimensions[get_column_letter(i)].width=w
ws7.row_dimensions[3].height=6
write_headers(ws7,3,h07)
dv(ws7,"list",SHOPPINGS,"A4:A1003")
dv(ws7,"list",'"Crédito para obra,Capital de giro,Seguro,Benefícios RH,Pagamentos,Outro"',"D4:D1003")
dv(ws7,"list",'"Sem garantia,Contrato de locação,Imóvel,Aval,Outra"',"L4:L1003")
dv(ws7,"list",'"Pré-abertura,Em obra,Operando (<6m),Operando (6m+)"',"M4:M1003")
dv(ws7,"list",'"Ativo,Pausado,Em negociação com parceiro"',"S4:S1003")

rows07=[
["Norte Shopping RJ","PROD-001","Crédito Obra Express Norte","Crédito para obra",
 "Itaú BBA","Patricia Santos / 21-4001-1100",
 30000,500000,1.49,36,3,"Contrato de locação",
 "Pré-abertura / Em obra",580,12,0,
 "https://itaubba.com.br/credito-obra-norte",10,"Ativo","01/06/2025"],

["Norte Shopping RJ","PROD-002","Seguro Multirrisco Norte","Seguro",
 "Allianz","João Allianz / 21-4002-2200",
 1200,12000,0,12,0,"Sem garantia",
 "Operando (<6m) / Operando (6m+)",0,0,0,
 "https://allianz.com.br/norte",3,"Ativo","01/06/2025"],

["Norte Shopping RJ","PROD-003","Benefícios RH Multibenefícios","Benefícios RH",
 "VR Benefícios","Ana VR / 21-4003-3300",
 0,0,0,12,0,"Sem garantia",
 "Operando (<6m) / Operando (6m+)",0,2,0,
 "https://vr.com.br/norte",5,"Ativo","01/06/2025"],

["Carioca Shopping","PROD-004","Microcrédito Lojista Carioca","Capital de giro",
 "Creditas","Pedro Creditas / 21-4004-4400",
 5000,80000,2.19,24,1,"Contrato de locação",
 "Operando (6m+)",500,6,0,
 "https://creditas.com.br/lojista-carioca",7,"Ativo","01/06/2025"],

["Carioca Shopping","PROD-005","Seguro Carioca Loja","Seguro",
 "Porto Seguro","Luis Porto / 21-4005-5500",
 800,8000,0,12,0,"Sem garantia",
 "Operando (<6m) / Operando (6m+)",0,0,0,
 "https://portoseguro.com.br/lojista",3,"Ativo","01/06/2025"],

["Shopping Tijuca","PROD-006","Crédito Expansão Tijuca","Crédito para obra",
 "Banco do Brasil","Marcia BB / 21-4006-6600",
 50000,600000,1.29,48,3,"Contrato de locação",
 "Pré-abertura / Em obra",600,12,0,
 "https://bb.com.br/credito-tijuca",15,"Ativo","01/06/2025"],

["Plaza Niterói","PROD-007","Crédito Plaza Investidor","Crédito para obra",
 "Itaú BBA","Renata Itaú / 21-4007-7700",
 40000,400000,1.59,36,2,"Contrato de locação",
 "Pré-abertura / Em obra",560,12,0,
 "https://itaubba.com.br/plaza-niteroi",12,"Ativo","01/06/2025"],

["Boulevard BH","PROD-008","Premium Finance Boulevard","Crédito para obra",
 "BTG Pactual","Sérgio BTG / 31-4008-8800",
 100000,1500000,1.19,60,6,"Contrato de locação",
 "Pré-abertura / Em obra",650,24,0,
 "https://btgpactual.com.br/boulevard",10,"Ativo","01/06/2025"],

["Boulevard BH","PROD-009","Seguro Premium Boulevard","Seguro",
 "Zurich Seguros","Ana Zurich / 31-4009-9900",
 2000,25000,0,12,0,"Sem garantia",
 "Operando (<6m) / Operando (6m+)",0,0,0,
 "https://zurich.com.br/boulevard",3,"Ativo","01/06/2025"],

["Estação BH","PROD-010","Microcrédito Estação BH","Capital de giro",
 "Sicoob","Marcos Sicoob / 31-4010-0010",
 3000,60000,1.89,18,0,"Contrato de locação",
 "Operando (6m+)",480,3,0,
 "https://sicoob.com.br/estacaobh",5,"Ativo","01/06/2025"],

["Shopping Del Rey","PROD-011","Crédito Del Rey Lojista","Crédito para obra",
 "Caixa Econômica","Carlos Caixa / 31-4011-1011",
 20000,300000,1.69,36,2,"Contrato de locação",
 "Pré-abertura / Em obra",540,12,0,
 "https://cef.gov.br/del-rey",15,"Ativo","01/06/2025"],

["Estação Cuiabá","PROD-012","Capital de Giro Cuiabá","Capital de giro",
 "Banco do Brasil","Amanda BB / 65-4012-2012",
 5000,100000,1.99,24,1,"Contrato de locação",
 "Operando (6m+)",500,6,0,
 "https://bb.com.br/cuiaba-giro",7,"Ativo","01/06/2025"],

["Center Shopping Uberlândia","PROD-013","Crédito Center Uberlândia","Crédito para obra",
 "Itaú BBA","Fábio Itaú / 34-4013-3013",
 30000,500000,1.45,42,3,"Contrato de locação",
 "Pré-abertura / Em obra",570,12,0,
 "https://itaubba.com.br/center-uberl",12,"Ativo","01/06/2025"],

["Center Shopping Uberlândia","PROD-014","Seguro Center Uberlândia","Seguro",
 "Allianz","Mariana Allianz / 34-4014-4014",
 900,10000,0,12,0,"Sem garantia",
 "Operando (<6m) / Operando (6m+)",0,0,0,
 "https://allianz.com.br/center-uberl",3,"Ativo","01/06/2025"],
]

for i,row in enumerate(rows07,4):
    write_data_row(ws7,i,row,is_even=(i%2==0),auto_cols=[2])
add_table(ws7,f"A3:{get_column_letter(len(h07))}1003","Tbl_ProdFinanceiros")
ws7.freeze_panes="B4"

# ═══════════════════════════════════════════════════════════════════════════
# SAVE
# ═══════════════════════════════════════════════════════════════════════════
out = "/mnt/user-data/outputs/shopping_inteligente_DB_v2_populado.xlsx"
wb.save(out)
print(f"Saved: {out}")
