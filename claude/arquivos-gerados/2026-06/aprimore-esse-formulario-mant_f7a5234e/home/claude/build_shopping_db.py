from openpyxl import Workbook
from openpyxl.styles import (Font, PatternFill, Alignment, Border, Side,
                              GradientFill)
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.table import Table, TableStyleInfo
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.styles.numbers import FORMAT_DATE_DDMMYY
import datetime

wb = Workbook()

# ── Palette ──────────────────────────────────────────────────────────────────
C_HEADER_DARK  = "1A1A2E"   # dark navy
C_HEADER_MID   = "16213E"   # mid navy
C_SECTION      = "0F3460"   # section header blue
C_ACCENT       = "E94560"   # accent red/pink
C_LIGHT_ROW    = "F0F4FF"   # zebra even
C_WHITE        = "FFFFFF"
C_YELLOW       = "FFF3CD"   # input highlight
C_GREEN        = "D4EDDA"   # auto/calc field
C_GRAY_HDR     = "2D3561"   # column header bg

FONT_TITLE  = Font(name="Arial", size=14, bold=True, color=C_WHITE)
FONT_SUB    = Font(name="Arial", size=10, italic=True, color="CCDDFF")
FONT_COL    = Font(name="Arial", size=9,  bold=True,  color=C_WHITE)
FONT_SECT   = Font(name="Arial", size=9,  bold=True,  color=C_WHITE)
FONT_BODY   = Font(name="Arial", size=9,  color="1A1A2E")
FONT_AUTO   = Font(name="Arial", size=9,  color="2E7D32", italic=True)
FONT_NOTE   = Font(name="Arial", size=8,  color="555555", italic=True)
FONT_INDEX  = Font(name="Arial", size=10, color="1A1A2E")

ALIGN_CTR   = Alignment(horizontal="center", vertical="center", wrap_text=True)
ALIGN_LEFT  = Alignment(horizontal="left",   vertical="center", wrap_text=True)
ALIGN_WRAP  = Alignment(horizontal="left",   vertical="top",    wrap_text=True)

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

def write_section(ws, row, label, ncols):
    ws.row_dimensions[row].height = 18
    ws.merge_cells(start_row=row, start_column=1,
                   end_row=row, end_column=ncols)
    c = ws.cell(row=row, column=1, value=f"  {label}")
    c.font = FONT_SECT; c.fill = fill(C_SECTION)
    c.alignment = ALIGN_LEFT; c.border = BORDER_MED

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
        name=style, showFirstColumn=False,
        showLastColumn=False, showRowStripes=True, showColumnStripes=False)
    ws.add_table(tbl)

def dv(ws, type_, formula1, sqref, prompt="", showDropDown=False):
    d = DataValidation(type=type_, formula1=formula1,
                       allow_blank=True, showDropDown=showDropDown)
    d.prompt = prompt
    ws.add_data_validation(d)
    d.sqref = sqref
    return d

SHOPPINGS = '"Shopping A,Shopping B,Shopping C,Shopping D,Shopping E,Shopping F,Shopping G,Shopping H,Shopping I,Shopping J"'

# ═══════════════════════════════════════════════════════════════════════════
# 00 - ÍNDICE
# ═══════════════════════════════════════════════════════════════════════════
ws0 = wb.active
ws0.title = "00 - Índice"

ws0.column_dimensions["A"].width = 6
ws0.column_dimensions["B"].width = 30
ws0.column_dimensions["C"].width = 26
ws0.column_dimensions["D"].width = 52
ws0.column_dimensions["E"].width = 20

write_title(ws0, "🛍  SHOPPING INTELIGENTE — SISTEMA DE AGENTES",
            "Formulários de Cadastro | Banco de Dados Multi-Shopping | v2.0", 5)

ws0.row_dimensions[3].height = 6

# legend row
ws0.row_dimensions[4].height = 22
write_headers(ws0, 4,
    ["Nº", "Planilha", "Agente / Plataforma", "Descrição", "Status"], C_GRAY_HDR)

sheets_info = [
    ("01", "01 - Ponto Vago",           "Agente 02 + KA/Expansão",
     "Ficha técnica de lojas, quiosques e pop-ups vagos ou a vagar",        "🟢 Ativo"),
    ("02", "02 - Investidor (Farmer)",   "Agente 02 Farmer",
     "Perfil suitability do investidor: capital, experiência, expectativas", "🟢 Ativo"),
    ("03", "03 - Marca_Franquia (KA)",   "Agente 03 KA/Expansão",
     "Marcas e franquias em expansão com requisitos técnicos e praças",      "🟢 Ativo"),
    ("04", "04 - Plano de Mix",          "Orquestrador + Hunter + KA",
     "Necessidades estratégicas de mix por ponto e globais do shopping",     "🟢 Ativo"),
    ("05", "05 - Fornecedores (Builder)","Plataforma B — Builder",
     "Diretório de fornecedores homologados (obra, tech, RH, jurídico)",     "🟢 Ativo"),
    ("06", "06 - Hunter (Targets)",      "Agente 01 Hunter",
     "Pipeline de negócios prospectados num raio de 2–50km",                "🟢 Ativo"),
    ("07", "07 - Produtos Financeiros",  "Plataforma A — Alavancador",
     "Catálogo de soluções financeiras, seguros e benefícios parceiros",     "🟢 Ativo"),
]

for i, (num, name, agent, desc, status) in enumerate(sheets_info, 5):
    ws0.row_dimensions[i].height = 22
    even = (i % 2 == 0)
    bg = C_LIGHT_ROW if even else C_WHITE
    for col, val in enumerate([num, name, agent, desc, status], 1):
        c = ws0.cell(row=i, column=col, value=val)
        c.font = FONT_INDEX; c.fill = fill(bg)
        c.alignment = ALIGN_LEFT; c.border = BORDER_THIN

# API bases section
ws0.row_dimensions[13].height = 8
ws0.row_dimensions[14].height = 22
write_section(ws0, 14, "📡  BASES EXTERNAS (API) — não precisam de formulário manual", 5)

api_rows = [
    ("✅", "CNPJ / Receita Federal",   "Agente Hunter",     "API pública — dados cadastrais, CNAE, endereço, sócios"),
    ("✅", "Google Maps / Places API", "Agente Hunter",     "Geolocalização e mapeamento de negócios na região"),
    ("✅", "Sistema Bahia (interno)",  "Todos os agentes",  "Preços, luvas e condições comerciais — expor via API interna"),
    ("✅", "Google Trends API",        "Agente Hunter",     "Tendências de busca local para curadoria de mix"),
    ("⚠️", "SERASA Experian",          "Agente Farmer",     "Contrato B2B necessário — score de crédito do investidor"),
    ("⚠️", "ABF Franchising",          "Agente KA/Expansão","Curadoria manual periódica — redes em expansão"),
    ("⚠️", "Dados de fluxo interno",   "Seller + Hunter",   "Enriquecer com dados do app do shopping e câmeras"),
]
for i, row in enumerate(api_rows, 15):
    ws0.row_dimensions[i].height = 20
    bg = C_LIGHT_ROW if i % 2 == 0 else C_WHITE
    for col, val in enumerate(row, 1):
        c = ws0.cell(row=i, column=col, value=val)
        c.font = FONT_NOTE; c.fill = fill(bg)
        c.alignment = ALIGN_LEFT; c.border = BORDER_THIN

# how-to note
ws0.row_dimensions[23].height = 8
note_row = 24
ws0.row_dimensions[note_row].height = 60
ws0.merge_cells(f"A{note_row}:E{note_row}")
note_text = (
    "💡  COMO USAR ESTE BANCO DE DADOS\n"
    "Cada aba é uma tabela estruturada com campo SHOPPING como primeira coluna. "
    "Para filtrar por shopping: clique no ▼ do cabeçalho da coluna SHOPPING. "
    "Para adicionar registros: insira sempre na próxima linha livre da tabela — "
    "a formatação e validações se aplicam automaticamente. "
    "Campos em verde 🟩 são preenchidos automaticamente pelo sistema."
)
c = ws0.cell(row=note_row, column=1, value=note_text)
c.font = Font(name="Arial", size=9, color="1A1A2E")
c.fill = fill(C_YELLOW); c.alignment = ALIGN_WRAP; c.border = BORDER_MED

# ═══════════════════════════════════════════════════════════════════════════
# 01 - PONTO VAGO
# ═══════════════════════════════════════════════════════════════════════════
ws1 = wb.create_sheet("01 - Ponto Vago")

headers_01 = [
    "SHOPPING", "ID_PONTO", "NOME_CODIGO", "TIPO_PONTO",
    "PISO", "CORREDOR_ALA", "STATUS_ATUAL", "DATA_DISPONIBILIDADE",
    "AREA_TOTAL_M2", "AREA_VENDAS_M2", "AREA_DEPOSITO_M2",
    "VITRINE_ML", "PE_DIREITO_M", "FORMATO_PLANTA",
    "ENERGIA_KVA", "AGUA", "ESGOTO", "ACESSO_DOCAS",
    "AR_CONDICIONADO", "SPRINKLER", "PISO_ATUAL",
    "VIZINHA_DIR", "VIZINHA_ESQ", "VIZINHA_FRENTE",
    "FLUXO_CORREDOR", "ANCORA_PROXIMA",
    "PRECO_M2_R$", "LUVAS_R$", "CARENCIA_MESES", "PRAZO_CONTRATO_ANOS",
    "FOTOS_LINKS", "PLANTA_BAIXA_LINK", "VIDEO_360_LINK",
    "ULTIMA_ATUALIZACAO", "RESPONSAVEL"
]

col_widths_01 = [22,12,16,14,10,20,18,18,12,12,14,10,12,16,
                 12,16,16,16,18,14,14,20,20,20,16,22,
                 14,12,14,16,30,25,25,16,20]

write_title(ws1, "🏪  PONTO VAGO — BANCO DE DADOS MULTI-SHOPPING",
            "Ficha técnica completa de lojas, quiosques e pop-ups vagos ou a vagar", len(headers_01))

for i, w in enumerate(col_widths_01, 1):
    ws1.column_dimensions[get_column_letter(i)].width = w

ws1.row_dimensions[3].height = 6
write_headers(ws1, 3, headers_01)

# Pre-populate 5 blank template rows with validations
list_tipo   = '"Loja,Quiosque,Pop-up,Corner,Megastore"'
list_piso   = '"Térreo,L1,L2,L3,Subsolo"'
list_status = '"Vago,A vagar (data),Em negociação,Ocupado"'
list_formato= '"Retangular,L,U,Irregular"'
list_agua   = '"Disponível,A instalar,Não tem"'
list_docas  = '"Direto,Indireto,Sem acesso"'
list_ac     = '"Central (incluso),Split próprio,Sem"'
list_spr    = '"Incluído,A instalar,Não tem"'
list_piso_a = '"Cimentado,Porcelanato,Outro"'
list_fluxo  = '"Baixo,Médio,Alto,Âncora direta"'

dv(ws1, "list", SHOPPINGS,    "A4:A1003")
dv(ws1, "list", list_tipo,    "D4:D1003")
dv(ws1, "list", list_piso,    "E4:E1003")
dv(ws1, "list", list_status,  "G4:G1003")
dv(ws1, "list", list_formato, "N4:N1003")
dv(ws1, "list", list_agua,    "P4:P1003")
dv(ws1, "list", list_agua,    "Q4:Q1003")
dv(ws1, "list", list_docas,   "R4:R1003")
dv(ws1, "list", list_ac,      "S4:S1003")
dv(ws1, "list", list_spr,     "T4:T1003")
dv(ws1, "list", list_piso_a,  "U4:U1003")
dv(ws1, "list", list_fluxo,   "Y4:Y1003")

# 3 example rows
example_rows_01 = [
    ["Shopping A","PV-001","L1-P1-001","Loja","L1","Ala Norte","Vago",
     "01/06/2025",120,95,20,8.5,4.0,"Retangular",
     20,"Disponível","Disponível","Indireto","Central (incluso)","Incluído","Porcelanato",
     "Farm (moda)","Reserva (moda)","Corredor principal",
     "Alto","Renner (30m)",
     380,15000,2,5,
     "https://drive/fotos1","https://drive/planta1","",
     "01/06/2025","Carlos EV"],
    ["Shopping B","PV-002","T-P0-042","Quiosque","Térreo","Praça de Alimentação","Em negociação",
     "15/07/2025",18,16,0,4.0,2.8,"Retangular",
     8,"A instalar","A instalar","Sem acesso","Central (incluso)","Incluído","Porcelanato",
     "Bob's","McDonald's","Praça central",
     "Âncora direta","McDonald's (5m)",
     520,0,1,2,
     "https://drive/fotos2","","",
     "05/06/2025","Ana EV"],
]

for i, row in enumerate(example_rows_01, 4):
    write_data_row(ws1, i, row, is_even=(i % 2 == 0), auto_cols=[2])

last_data_row = max(5, 3 + len(example_rows_01))
table_end_row = 1003
add_table(ws1,
          f"A3:{get_column_letter(len(headers_01))}{table_end_row}",
          "Tbl_PontoVago")

ws1.freeze_panes = "B4"

# ═══════════════════════════════════════════════════════════════════════════
# 02 - INVESTIDOR (FARMER)
# ═══════════════════════════════════════════════════════════════════════════
ws2 = wb.create_sheet("02 - Investidor (Farmer)")

headers_02 = [
    "SHOPPING", "ID_INVESTIDOR", "NOME_COMPLETO", "CPF",
    "DATA_NASC", "EMAIL", "TELEFONE_WHATSAPP", "CIDADE_BAIRRO",
    "OCUPACAO", "SETOR", "CARGO_FUNCAO", "TEM_CNPJ",
    "CAPITAL_INICIAL_R$", "ORIGEM_CAPITAL", "CAPITAL_GIRO_MESES",
    "RENDA_MENSAL_R$", "TEM_DIVIDAS",
    "EXP_VAREJO", "SETORES_ATUOU", "JA_EMPREENDEU", "TEM_SOCIOS",
    "HORAS_SEMANA", "PREFERE_FRANQUIA", "CATEGORIA_1", "CATEGORIA_2",
    "TAMANHO_PONTO",
    "PAYBACK_ESPERADO", "TOLERANCIA_RISCO", "PRIORIDADE",
    "FATURAMENTO_ESPERADO_R$",
    "SCORE_FIT", "FAIXA_NEGOCIO_REC", "STATUS_LEAD",
    "EV_RESPONSAVEL", "DATA_CADASTRO"
]

col_widths_02 = [22,14,24,14,12,26,18,22,
                 16,16,16,12,
                 18,18,16,14,14,
                 20,22,16,16,
                 16,16,18,18,24,
                 16,16,16,20,
                 10,22,18,18,14]

write_title(ws2, "💼  INVESTIDOR (FARMER) — BANCO DE DADOS MULTI-SHOPPING",
            "Perfil suitability do investidor: capital, experiência, tempo e expectativas",
            len(headers_02))

for i, w in enumerate(col_widths_02, 1):
    ws2.column_dimensions[get_column_letter(i)].width = w

ws2.row_dimensions[3].height = 6
write_headers(ws2, 3, headers_02)

# validations
dv(ws2, "list", SHOPPINGS, "A4:A1003")
dv(ws2, "list", '"CLT,PJ,Empreendedor,Aposentado,Outro"', "I4:I1003")
dv(ws2, "list", '"Varejo,Serviços,Indústria,Saúde,Tech,Outro"', "J4:J1003")
dv(ws2, "list", '"Sim,Não,Vou abrir"', "L4:L1003")
dv(ws2, "list", '"Até 50k,50-100k,100-200k,200-500k,500k+"', "M4:M1003")
dv(ws2, "list", '"Poupança,FGTS,Herança,Empréstimo,Sócio,Misto"', "N4:N1003")
dv(ws2, "list", '"3 meses,6 meses,12 meses,18+ meses"', "O4:O1003")
dv(ws2, "list", '"Até 5k,5-10k,10-20k,20-50k,50k+"', "P4:P1003")
dv(ws2, "list", '"Não,Sim (financiamento),Sim (outras)"', "Q4:Q1003")
dv(ws2, "list", '"Nenhuma,Funcionário,Gerente,Dono de loja,Franqueado"', "R4:R1003")
dv(ws2, "list", '"Sim – Ainda ativo,Sim – Encerrou,Não"', "T4:T1003")
dv(ws2, "list", '"Não,Sim – familiar,Sim – sócio de negócio,Em busca"', "U4:U1003")
dv(ws2, "list", '"Integral (40h+),Parcial (20h),Eventual (5h),Só capital"', "V4:V1003")
dv(ws2, "list", '"Sim (franquia),Não (próprio),Indiferente"', "W4:W1003")
dv(ws2, "list", '"Alimentação,Moda,Saúde-Beleza,Serviços,Tech,Pet,Casa"', "X4:X1003")
dv(ws2, "list", '"Alimentação,Moda,Saúde-Beleza,Serviços,Tech,Pet,Casa"', "Y4:Y1003")
dv(ws2, "list", '"Quiosque (até 15m²),Loja pequena (15-50m²),Loja média (50-150m²),Não tem preferência"', "Z4:Z1003")
dv(ws2, "list", '"12-18m,18-24m,24-36m,36-48m,48m+"', "AA4:AA1003")
dv(ws2, "list", '"Conservador,Moderado,Arrojado"', "AB4:AB1003")
dv(ws2, "list", '"Priorizo retorno alto,Equilíbrio,Priorizo segurança"', "AC4:AC1003")
dv(ws2, "list", '"Até 30k,30-80k,80-200k,200k+"', "AD4:AD1003")
dv(ws2, "list", '"Novo,Em triagem,Qualificado,Em negociação,Fechado"', "AG4:AG1003")

example_rows_02 = [
    ["Shopping A","INV-001","João Silva","XXX.XXX.XXX-01",
     "15/03/1975","joao@email.com","21-99999-0001","Barra da Tijuca - RJ",
     "CLT","Varejo","Gerente Comercial","Sim",
     "100-200k","Poupança","12 meses",
     "10-20k","Não",
     "Gerente","Moda / Serviços","Sim – Encerrou","Não",
     "Parcial (20h)","Sim (franquia)","Moda","Serviços",
     "Loja pequena (15-50m²)",
     "24-36m","Moderado","Equilíbrio",
     "30-80k",
     72,"Franquia moda mid-market","Qualificado",
     "Ana EV","01/06/2025"],
]

for i, row in enumerate(example_rows_02, 4):
    write_data_row(ws2, i, row, is_even=(i % 2 == 0), auto_cols=[2, 31, 32])

add_table(ws2, f"A3:{get_column_letter(len(headers_02))}1003", "Tbl_Investidor")
ws2.freeze_panes = "B4"

# ═══════════════════════════════════════════════════════════════════════════
# 03 - MARCA / FRANQUIA (KA)
# ═══════════════════════════════════════════════════════════════════════════
ws3 = wb.create_sheet("03 - Marca_Franquia (KA)")

headers_03 = [
    "SHOPPING", "ID_MARCA", "NOME_MARCA", "CNPJ_FRANQUEADORA",
    "CATEGORIA", "SUBCATEGORIA", "POSICIONAMENTO",
    "MODELO_EXPANSAO", "UNIDADES_ATIVAS", "ANOS_OPERACAO",
    "FATURAMENTO_MEDIO_MES", "PAYBACK_MEDIO", "TAXA_RENOVACAO_PCT",
    "AREA_MIN_M2", "AREA_MAX_M2", "VITRINE_MIN_ML",
    "PE_DIREITO_MIN_M", "ENERGIA_KVA", "AGUA_ESGOTO", "DOCAS",
    "PISO_PREFERENCIAL",
    "ESTADOS_INTERESSE", "CIDADES_INTERESSE",
    "INTERESSE_NESTA_PRACA", "STATUS_EXPANSAO",
    "PERFIL_PARCEIRO", "INVESTIMENTO_INICIAL_R$",
    "ROYALTIES_PCT", "TAXA_PUBLICIDADE_PCT", "SUPORTE_OFERECIDO",
    "ANCORAS_REFERENCIA", "CATEGORIAS_COMPLEMENTARES",
    "CATEGORIAS_EVITAR",
    "KA_RESPONSAVEL", "DATA_ULTIMO_CONTATO", "SCORE_FIT"
]

col_widths_03 = [22,12,22,18,18,18,16,
                 18,12,12,
                 18,14,16,
                 12,12,12,12,12,16,12,16,
                 22,28,22,18,
                 24,18,12,16,30,
                 28,28,28,
                 20,16,12]

write_title(ws3, "🏢  MARCA / FRANQUIA (KA) — BANCO DE DADOS MULTI-SHOPPING",
            "Cadastro de marcas e franquias em expansão com requisitos técnicos e praças de interesse",
            len(headers_03))

for i, w in enumerate(col_widths_03, 1):
    ws3.column_dimensions[get_column_letter(i)].width = w

ws3.row_dimensions[3].height = 6
write_headers(ws3, 3, headers_03)

dv(ws3, "list", SHOPPINGS, "A4:A1003")
dv(ws3, "list", '"Alimentação,Moda,Saúde-Beleza,Serviços,Tech,Pet,Casa,Esporte"', "E4:E1003")
dv(ws3, "list", '"Popular,Acessível,Mid-market,Premium,Luxo"', "G4:G1003")
dv(ws3, "list", '"Franquia,Loja própria,Licenciado,Corner em multimarcas"', "H4:H1003")
dv(ws3, "list", '"Até 50k,50-100k,100-200k,200-500k,500k+"', "K4:K1003")
dv(ws3, "list", '"12-18m,18-24m,24-36m,36-48m,48m+"', "L4:L1003")
dv(ws3, "list", '"Obrigatório,Desejável,Não precisa"', "S4:S1003")
dv(ws3, "list", '"Obrigatório,Desejável,Não precisa"', "T4:T1003")
dv(ws3, "list", '"Térreo,L1,L2,Indiferente,Específico"', "U4:U1003")
dv(ws3, "list", '"Sim – Alta prioridade,Sim – Em análise,Não por ora"', "X4:X1003")
dv(ws3, "list", '"Ativa buscando,Em análise,Pausa temporária"', "Y4:Y1003")
dv(ws3, "list", '"Operador integral (40h+),Sócio parcial (20h),Só capital (passivo)"', "Z4:Z1003")

example_rows_03 = [
    ["Shopping A","MRC-001","Oakberry","XX.XXX.XXX/0001-01",
     "Alimentação","Açaí premium","Premium",
     "Franquia",320,8,
     "100-200k","18-24m",87,
     20,35,3.5,3.0,10,"Desejável","Não precisa","Térreo",
     "SP / RJ / MG / PR","São Paulo, Rio de Janeiro, Belo Horizonte",
     "Sim – Alta prioridade","Ativa buscando",
     "Operador integral (40h+)",280000,
     8,2,"Treinamento / Projeto de obra / Marketing",
     "McDonald's / Bob's","Moda casual / Serviços",
     "",
     "Carlos KA","05/06/2025",88],
]

for i, row in enumerate(example_rows_03, 4):
    write_data_row(ws3, i, row, is_even=(i % 2 == 0), auto_cols=[2, 36])

add_table(ws3, f"A3:{get_column_letter(len(headers_03))}1003", "Tbl_MarcaFranquia")
ws3.freeze_panes = "B4"

# ═══════════════════════════════════════════════════════════════════════════
# 04 - PLANO DE MIX
# ═══════════════════════════════════════════════════════════════════════════
ws4 = wb.create_sheet("04 - Plano de Mix")

headers_04 = [
    "SHOPPING", "ID_PLANO", "RESPONSAVEL", "VALIDADE_PLANO",
    "VACANCIA_ATUAL_PCT", "META_VACANCIA_PCT",
    "SEGMENTO_ALVO",
    "CATEGORIAS_EM_FALTA", "CATEGORIAS_EM_EXCESSO", "CATEGORIAS_ANCORA",
    "INOVACOES_DESEJADAS", "MARCAS_ALVO",
    "PONTO_ID", "PISO", "CAT_1A_OPCAO", "CAT_2A_OPCAO", "CATS_EXCLUIDAS", "PRIORIDADE_PONTO",
    "DATAS_CHAVE", "PRACA_EVENTOS",
    "BUDGET_MARKETING_R$", "ULTIMA_REVISAO"
]

col_widths_04 = [22,12,20,14,
                 16,14,
                 28,
                 30,28,28,
                 36,36,
                 12,10,22,22,24,14,
                 30,20,
                 18,14]

write_title(ws4, "🗺  PLANO DE MIX — BANCO DE DADOS MULTI-SHOPPING",
            "Necessidades estratégicas de mix por ponto e globais do shopping",
            len(headers_04))

for i, w in enumerate(col_widths_04, 1):
    ws4.column_dimensions[get_column_letter(i)].width = w

ws4.row_dimensions[3].height = 6
write_headers(ws4, 3, headers_04)

dv(ws4, "list", SHOPPINGS, "A4:A1003")
dv(ws4, "list", '"Disponível,Parcialmente,Em reforma"', "T4:T1003")
dv(ws4, "list", '"Até 500k,500k-1M,1M-3M,3M+"', "U4:U1003")
dv(ws4, "list", '"Alta,Média,Baixa"', "R4:R1003")

example_rows_04 = [
    ["Shopping A","MIX-001","Maria Diretora","30/12/2025",
     4.2, 3.0,
     "Classes A / B / Jovens / Famílias",
     "Alimentação saudável / Pet / Tech",
     "Moda popular",
     "Renner / C&A / Outback",
     "Dark kitchen, academia boutique, clínica beauty",
     "Oakberry, Smart Fit, Petlove",
     "PV-001","L1","Alimentação saudável","Pet","Moda popular","Alta",
     "Dia das Mães / Natal / Black Friday",
     "Disponível",
     "1M-3M","01/06/2025"],
]

for i, row in enumerate(example_rows_04, 4):
    write_data_row(ws4, i, row, is_even=(i % 2 == 0), auto_cols=[2])

add_table(ws4, f"A3:{get_column_letter(len(headers_04))}1003", "Tbl_PlanoMix")
ws4.freeze_panes = "B4"

# ═══════════════════════════════════════════════════════════════════════════
# 05 - FORNECEDORES (BUILDER)
# ═══════════════════════════════════════════════════════════════════════════
ws5 = wb.create_sheet("05 - Fornecedores (Builder)")

headers_05 = [
    "SHOPPING", "ID_FORNECEDOR", "RAZAO_SOCIAL", "CNPJ",
    "NOME_FANTASIA", "CATEGORIA_SERVICO", "ESPECIALIDADE",
    "CONTATO_COMERCIAL", "EMAIL", "TELEFONE", "SITE",
    "JA_REALIZOU_OBRAS_AQUI", "CONHECE_MANUAL_LOJISTA",
    "CERTIFICACOES", "STATUS_HOMOLOGACAO", "DATA_HOMOLOGACAO",
    "PROJETOS_SHOPPING_TOTAL", "PORTFOLIO_LINKS",
    "AVALIACAO_MEDIA", "NUM_AVALIACOES",
    "FAIXA_PRECO", "TICKET_MEDIO_R$",
    "CAPACIDADE_SIMULTANEA", "PRAZO_MEDIO_ENTREGA"
]

col_widths_05 = [22,14,28,18,
                 22,24,28,
                 22,26,16,24,
                 18,18,
                 22,16,14,
                 14,30,
                 12,12,
                 16,16,
                 16,20]

write_title(ws5, "🔨  FORNECEDORES (BUILDER) — BANCO DE DADOS MULTI-SHOPPING",
            "Marketplace de fornecedores homologados pelo shopping",
            len(headers_05))

for i, w in enumerate(col_widths_05, 1):
    ws5.column_dimensions[get_column_letter(i)].width = w

ws5.row_dimensions[3].height = 6
write_headers(ws5, 3, headers_05)

dv(ws5, "list", SHOPPINGS, "A4:A1003")
dv(ws5, "list",
   '"Arquitetura,Engenharia,Obra,Materiais,Mobiliário,Tech Varejo,Site-Social,RH-Recrutamento,Folha-Sindicato,Jurídico"',
   "F4:F1003")
dv(ws5, "list", '"Sim,Não"', "L4:L1003")
dv(ws5, "list", '"Sim,Não,Em processo"', "M4:M1003")
dv(ws5, "list", '"Homologado,Em análise,Suspenso"', "O4:O1003")
dv(ws5, "list", '"Econômico,Intermediário,Premium"', "U4:U1003")
dv(ws5, "list", '"Até 30k,30-100k,100-300k,300k+"', "V4:V1003")
dv(ws5, "list", '"Até 30 dias,30-60 dias,60-90 dias,90+ dias"', "X4:X1003")

example_rows_05 = [
    ["Shopping A","FORN-001","Construtora Alpha Ltda","XX.XXX.XXX/0001-02",
     "Alpha Obras","Obra","Obras em shopping centers e retrofit de lojas",
     "Roberto Silva","roberto@alpha.com.br","21-3333-4444","www.alphaobras.com.br",
     "Sim","Sim",
     "CREA / ISO","Homologado","15/01/2024",
     28,"https://portfolio.alpha.com.br",
     4.6,24,
     "Intermediário","30-100k",
     4,"30-60 dias"],
]

for i, row in enumerate(example_rows_05, 4):
    write_data_row(ws5, i, row, is_even=(i % 2 == 0), auto_cols=[2])

add_table(ws5, f"A3:{get_column_letter(len(headers_05))}1003", "Tbl_Fornecedores")
ws5.freeze_panes = "B4"

# ═══════════════════════════════════════════════════════════════════════════
# 06 - HUNTER (TARGETS)
# ═══════════════════════════════════════════════════════════════════════════
ws6 = wb.create_sheet("06 - Hunter (Targets)")

headers_06 = [
    "SHOPPING", "ID_TARGET", "NOME_NEGOCIO", "CNPJ",
    "CATEGORIA", "SUBCATEGORIA", "RAIO_KM",
    "ENDERECO", "CIDADE_UF",
    "FATURAMENTO_ESTIMADO", "TEMPO_ATIVO_ANOS",
    "SCORE_FIT", "STATUS_ABORDAGEM",
    "CONTATO_NOME", "CONTATO_TEL", "CONTATO_EMAIL",
    "DATA_1A_ABORDAGEM", "DATA_ULTIMA_ACAO",
    "OBSERVACOES_PROXIMA_ACAO", "EV_RESPONSAVEL"
]

col_widths_06 = [22,12,26,18,
                 18,18,10,
                 30,18,
                 18,14,
                 12,20,
                 22,16,26,
                 14,14,
                 40,18]

write_title(ws6, "🔍  HUNTER (TARGETS) — BANCO DE DADOS MULTI-SHOPPING",
            "Pipeline de negócios prospectados num raio de 2–50km do shopping",
            len(headers_06))

for i, w in enumerate(col_widths_06, 1):
    ws6.column_dimensions[get_column_letter(i)].width = w

ws6.row_dimensions[3].height = 6
write_headers(ws6, 3, headers_06)

dv(ws6, "list", SHOPPINGS, "A4:A1003")
dv(ws6, "list", '"Alimentação,Moda,Saúde-Beleza,Serviços,Tech,Pet,Casa,Esporte,Outro"', "E4:E1003")
dv(ws6, "list", '"Identificado,1ª Abordagem,Em Negociação,Proposta Enviada,Convertido,Descartado"', "M4:M1003")

example_rows_06 = [
    ["Shopping A","TGT-001","Vegê Açaí","XX.XXX.XXX/0001-03",
     "Alimentação","Açaí / Sucos naturais",2.1,
     "Rua das Flores, 123 - Barra da Tijuca","Rio de Janeiro - RJ",
     "50-100k",3,
     81,"1ª Abordagem",
     "Marcos Dono","21-99887-6655","marcos@vege.com.br",
     "03/06/2025","05/06/2025",
     "Interesse moderado — quer ver projeção de fluxo. Agendar visita ao ponto PV-001","Ana EV"],
    ["Shopping A","TGT-002","Studio Kenzo Beleza","XX.XXX.XXX/0001-04",
     "Saúde-Beleza","Salão de beleza / Nail art",3.5,
     "Av. das Américas, 5500 - Recreio","Rio de Janeiro - RJ",
     "30-80k",5,
     74,"Identificado",
     "","","",
     "","05/06/2025",
     "Verificar se tem interesse em expansão para shopping. Abordagem fria via Instagram","Carlos EV"],
]

for i, row in enumerate(example_rows_06, 4):
    write_data_row(ws6, i, row, is_even=(i % 2 == 0), auto_cols=[2, 12])

add_table(ws6, f"A3:{get_column_letter(len(headers_06))}1003", "Tbl_Hunter")
ws6.freeze_panes = "B4"

# ═══════════════════════════════════════════════════════════════════════════
# 07 - PRODUTOS FINANCEIROS
# ═══════════════════════════════════════════════════════════════════════════
ws7 = wb.create_sheet("07 - Produtos Financeiros")

headers_07 = [
    "SHOPPING", "ID_PRODUTO", "NOME_PRODUTO", "TIPO_PRODUTO",
    "PARCEIRO_INSTITUICAO", "CONTATO_PARCEIRO",
    "VALOR_MIN_R$", "VALOR_MAX_R$",
    "TAXA_JUROS_PCT_AM", "PRAZO_MAX_MESES", "CARENCIA_MESES",
    "GARANTIA_NECESSARIA",
    "FASE_NEGOCIO_ELEGIVEL", "SCORE_CREDITO_MIN",
    "TEMPO_MIN_CONTRATO_MESES", "NUM_MIN_FUNCIONARIOS",
    "LINK_CONTRATACAO", "PRAZO_APROVACAO_DU",
    "STATUS_PRODUTO", "ULTIMA_ATUALIZACAO"
]

col_widths_07 = [22,12,26,22,
                 24,22,
                 14,14,
                 14,14,12,
                 24,
                 28,14,
                 16,16,
                 30,14,
                 20,14]

write_title(ws7, "🏦  PRODUTOS FINANCEIROS — BANCO DE DADOS MULTI-SHOPPING",
            "Catálogo de soluções financeiras, seguros e benefícios para lojistas",
            len(headers_07))

for i, w in enumerate(col_widths_07, 1):
    ws7.column_dimensions[get_column_letter(i)].width = w

ws7.row_dimensions[3].height = 6
write_headers(ws7, 3, headers_07)

dv(ws7, "list", SHOPPINGS, "A4:A1003")
dv(ws7, "list",
   '"Crédito para obra,Capital de giro,Seguro,Benefícios RH,Pagamentos,Outro"',
   "D4:D1003")
dv(ws7, "list",
   '"Sem garantia,Contrato de locação,Imóvel,Aval,Outra"',
   "L4:L1003")
dv(ws7, "list",
   '"Pré-abertura,Em obra,Operando (<6m),Operando (6m+)"',
   "M4:M1003")
dv(ws7, "list",
   '"Ativo,Pausado,Em negociação com parceiro"',
   "S4:S1003")

example_rows_07 = [
    ["Shopping A","PROD-001","Crédito Obra Express","Crédito para obra",
     "Itaú BBA","Patricia Gomes / 11-4444-5555",
     30000,300000,
     1.49,36,3,
     "Contrato de locação",
     "Pré-abertura / Em obra",550,
     12,0,
     "https://itaubba.com.br/credito-obra",15,
     "Ativo","01/06/2025"],
    ["Shopping A","PROD-002","Seguro Multirrisco Lojista","Seguro",
     "Allianz","Joao Seguros / 21-3333-7777",
     800,8000,
     0,12,0,
     "Sem garantia",
     "Operando (<6m) / Operando (6m+)",0,
     0,0,
     "https://allianz.com.br/lojista",3,
     "Ativo","01/06/2025"],
]

for i, row in enumerate(example_rows_07, 4):
    write_data_row(ws7, i, row, is_even=(i % 2 == 0), auto_cols=[2])

add_table(ws7, f"A3:{get_column_letter(len(headers_07))}1003", "Tbl_ProdFinanceiros")
ws7.freeze_panes = "B4"

# ═══════════════════════════════════════════════════════════════════════════
# SAVE
# ═══════════════════════════════════════════════════════════════════════════
out = "/mnt/user-data/outputs/shopping_inteligente_DB_v2.xlsx"
wb.save(out)
print(f"Saved: {out}")
