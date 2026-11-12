from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

# Paleta
INK = "0D1117"; PAPER = "F5F1E8"; TERRA = "C8553D"; GOLD = "C9A55C"; MOSS = "4A5D3A"; STEEL = "5C6878"
WHITE = "FFFFFF"

hdr_fill = PatternFill("solid", fgColor=INK)
hdr_font = Font(name="Arial", bold=True, color=WHITE, size=11)
sub_fill = PatternFill("solid", fgColor=STEEL)
sub_font = Font(name="Arial", bold=True, color=WHITE, size=10)
title_font = Font(name="Arial", bold=True, color=INK, size=16)
note_font = Font(name="Arial", italic=True, color=STEEL, size=9)
cell_font = Font(name="Arial", color=INK, size=10)
bold_cell = Font(name="Arial", bold=True, color=INK, size=10)
thin = Side(style="thin", color="CCCCCC")
border = Border(left=thin, right=thin, top=thin, bottom=thin)
wrap = Alignment(wrap_text=True, vertical="top")
center = Alignment(horizontal="center", vertical="center", wrap_text=True)

def style_header(ws, row, ncols):
    for c in range(1, ncols+1):
        cell = ws.cell(row=row, column=c)
        cell.fill = hdr_fill; cell.font = hdr_font
        cell.alignment = center; cell.border = border

def body(ws, start_row, ncols, last_row):
    for r in range(start_row, last_row+1):
        for c in range(1, ncols+1):
            cell = ws.cell(row=r, column=c)
            cell.font = cell_font; cell.alignment = wrap; cell.border = border
            if r % 2 == 0:
                cell.fill = PatternFill("solid", fgColor=PAPER)

wb = Workbook()

# ============ ABA 1: VISÃO GERAL DO ATIVO ============
ws = wb.active
ws.title = "1. Ativo"
ws["A1"] = "MOOCA PLAZA SHOPPING — DIAGNÓSTICO DO ATIVO"
ws["A1"].font = title_font
ws["A2"] = "Shopping Inteligente OS v5 · Cluster: Entretenimento · Pesquisa web pública (jun/2026) · Confiança geral: 7/10"
ws["A2"].font = note_font

rows = [
    ["Atributo", "Valor", "Fonte", "Confiança"],
    ["Operador", "Allos (ex-BRMalls)", "Gazeta Mercantil set/2025; Hedge Investments", "9/10"],
    ["Localização", "Rua Cap. Pacheco e Chaves, 313 — Mooca, Zona Leste, SP", "Hedge Investments jan/2026", "10/10"],
    ["Inauguração", "2011 (maior shopping inaugurado no Brasil naquele ano)", "PRNewswire 2011", "10/10"],
    ["ABL", "42.000 m²", "Allos / São Paulo Guia Online", "9/10"],
    ["Terreno", "112.000 m²", "Allos / São Paulo Guia Online", "9/10"],
    ["Nº de lojas", "~230 a 241 (fontes variam); 8 megalojas, 6 âncoras", "Allos; São Paulo Guia Online", "7/10"],
    ["Estacionamento", "~2.415 a 2.429 vagas", "Allos; São Paulo Guia Online", "8/10"],
    ["Cinema", "Cinemark — 6 salas (1 XD)", "Allos; moocaplaza.com.br", "9/10"],
    ["Teatro", "Teatro Mooca", "Radar360", "8/10"],
    ["Taxa de ocupação", "98,4% (ago/2025) — ACIMA da média de mercado (95,1%)", "Gazeta Mercantil set/2025 (Abrasce)", "8/10"],
    ["Área de influência", "1,2 milhão de consumidores; 64% classes A/B", "PRNewswire 2011", "6/10"],
    ["Potencial de consumo", "R$ 1,5 bilhão/ano na área de influência", "PRNewswire 2011 (dado antigo)", "5/10"],
    ["Perfil do público", "Classes A e B, idade média 39 anos", "Gazeta Mercantil set/2025", "7/10"],
    ["Programa de benefícios", "+100 mil clientes cadastrados, 3 categorias por recorrência/gasto", "Gazeta Mercantil set/2025", "8/10"],
    ["Instagram", "@moocaplaza — 89 mil seguidores", "Instagram jun/2026", "9/10"],
    ["Diferencial competitivo", "Pioneiro pet friendly: Village (praça ao ar livre pet) + Pet Park 2.000 m²", "Hedge Investments; Comercio SP", "8/10"],
    ["Horário", "Seg-Sáb 10h-22h; Dom/feriados 14h-20h (Instagram: Dom 12h-20h)", "moocaplaza.com.br", "8/10"],
    ["Reclame Aqui", "Nota média 3,56; 40,7% resolvidas (out/2025-mar/2026)", "Reclame Aqui", "7/10"],
]
for r in rows:
    ws.append(r)
style_header(ws, 4, 4)
body(ws, 5, 4, ws.max_row)
ws.column_dimensions["A"].width = 26
ws.column_dimensions["B"].width = 55
ws.column_dimensions["C"].width = 40
ws.column_dimensions["D"].width = 11

# ============ ABA 2: CLUSTER & BATALHAS ============
ws = wb.create_sheet("2. Cluster")
ws["A1"] = "CLUSTER POSITIONING ENGINE"
ws["A1"].font = title_font
ws["A2"] = "Cluster confirmado: ENTRETENIMENTO (confiança 8/10). Fronteira sutil com Passeio Familiar — validar com fluxo interno."
ws["A2"].font = note_font

rows = [
    ["Dimensão", "Leitura validada", "Fonte"],
    ["Essência", "Seu portal para um mundo de diversão", "Framework OS v5"],
    ["Autodefinição da gestão", "Centro de entretenimento, lifestyle, gastronomia e compras", "Gazeta Mercantil set/2025"],
    ["Target primário", "Classes A/B, idade média 39 anos", "Gazeta Mercantil set/2025"],
    ["Batalha 1", "Entretenimento (cinema, teatro, eventos, área de lazer)", "Framework + posicionamento real"],
    ["Batalha 2", "Gastronomia (Village é âncora de fato, atrai toda a cidade)", "Comercio SP dez/2025"],
    ["Batalha 3", "Lojas (mix A/B com inaugurações recentes premium)", "ABRASCE; imprensa"],
    ["Inauguração recente 1", "Sephora — 317 m² — set/2025 (qualificação de mix beleza)", "Mercado&Consumo set/2025"],
    ["Inauguração recente 2", "Cia Athletica — 1.500 m² — abr/2025 (fitness/bem-estar)", "ABRASCE abr/2025"],
    ["Implicação comercial 1", "Gastronomia já é geradora de fluxo — tratar como âncora, não complemento", "Análise OS"],
    ["Implicação comercial 2", "Público A/B 39 anos — priorizar marcas aspiracionais e de experiência, não preço", "Análise OS"],
    ["Implicação comercial 3", "Identidade italiana + pet = vantagem difícil de copiar; mix e eventos devem dialogar", "Análise OS"],
]
for r in rows:
    ws.append(r)
style_header(ws, 4, 3)
body(ws, 5, 3, ws.max_row)
ws.column_dimensions["A"].width = 26
ws.column_dimensions["B"].width = 62
ws.column_dimensions["C"].width = 38

# ============ ABA 3: HUNTER — LEADS DE RUA ============
ws = wb.create_sheet("3. Hunter Rua")
ws["A1"] = "HUNTER — MÓDULO STREET CONVERTER (operações de rua da Mooca)"
ws["A1"].font = title_font
ws["A2"] = "Operações com tração comprovada candidatas a conversão/versão shopping. Cluster Fit estimado (0-100). Confiança 8/10."
ws["A2"].font = note_font

rows = [
    ["Operação", "Categoria", "Sinal de tração", "Tese de conversão", "Batalha", "Cluster Fit (est.)", "Estágio Deal", "Próxima ação", "Fonte"],
    ["Hospedaria", "Gastronomia autoral", "Chef Rafael Zanutto; espera longa nos fins de semana", "Marca de chef com fila = âncora gastronômica de experiência", "Gastronomia", 85, "Lead", "Mapear interesse e contato do sócio", "La Central 2024"],
    ["A Pizza da Mooca", "Pizzaria premium", "77ª melhor pizzaria napolitana do mundo (50 Top Pizza); melhor do Brasil", "Selo internacional eleva percepção do mix", "Gastronomia", 82, "Lead", "Avaliar formato shopping (espaço/operação)", "La Central 2024"],
    ["Cadillac BBQ / Burger", "Hamburgueria/BBQ temática", "Decoração faroeste; bastante movimentado, vale a espera", "Conceito temático = entretenimento + gastronomia (2 batalhas)", "Gastronomia+Entret.", 80, "Lead", "Contato com proprietário (mesmo do Cadillac Burger)", "La Central 2024"],
    ["Di Cunto", "Confeitaria/cantina histórica", "+130 anos; cannoli de pistache feito na hora; vitrine de doces", "Patrimônio local; café/doceria de destino", "Gastronomia", 78, "Lead", "Avaliar quiosque/café no Village", "Roteiro Italia jan/2026"],
    ["Bar do Vardema", "Boteco premium", "Ícone da vida noturna; bolinhos artesanais frescos", "Boteco com marca forte para área externa/Village", "Gastronomia", 72, "Lead", "Sondar interesse em expansão", "Espaces jul/2025"],
    ["Quintal da Mooca", "Boteco premium", "Cerveja mais gelada da região; clientela fiel desde 2012", "Operação de bairro consolidada para Village", "Gastronomia", 70, "Lead", "Sondar interesse em expansão", "Espaces jul/2025"],
    ["Don Carlini", "Cantina italiana clássica", "Referência desde 1985; sorrentini criado pela família", "Tradição italiana autêntica = DNA da Mooca", "Gastronomia", 75, "Lead", "Avaliar fit (cantina é melhor na rua?)", "Alpha FM"],
    ["Esfiha Juventus", "Árabe", "Referência desde 1967 na Rua Visconde de Laguna", "Tradição árabe com público fiel", "Gastronomia", 68, "Lead", "Avaliar formato praça de alimentação", "Alpha FM"],
]
for r in rows:
    ws.append(r)
style_header(ws, 4, 9)
body(ws, 5, 9, ws.max_row)
for col, w in zip("ABCDEFGHI", [20, 22, 40, 40, 18, 12, 12, 32, 22]):
    ws.column_dimensions[col].width = w
# centralizar score
for r in range(5, ws.max_row+1):
    ws.cell(row=r, column=6).alignment = center

# ============ ABA 4: HUNTER — ENTRETENIMENTO ============
ws = wb.create_sheet("4. Hunter Entret")
ws["A1"] = "HUNTER — MÓDULO RETAIL INNOVATION (marcas de entretenimento em expansão)"
ws["A1"].font = title_font
ws["A2"] = "Marcas formato shopping para reforçar a batalha nº1. CONFIRMAR ausência no Mooca antes de abordar. Confiança 7/10."
ws["A2"].font = note_font

rows = [
    ["Marca", "Formato", "Investimento", "Faturamento médio", "Payback", "Sinal de tração / fonte", "Fit"],
    ["Game Station", "Parque indoor (boliche, simuladores, VR, restaurante)", "n.v.", "n.v.", "n.v.", "19ª unidade no estado; 1.300 m² (S.P. p/ Crianças mai/2026)", "Alto"],
    ["Studio Games", "Complexo gamer (VR, simuladores, arena, Just Dance)", "n.v.", "n.v.", "n.v.", "~30 unidades negociadas (Portal Franquia)", "Alto"],
    ["Escape 60", "Escape room", "R$ 600.000", "variável", "18 meses", "Rede nacional (Guia Franquias ago/2025)", "Médio-alto"],
    ["GEmotion", "Realidade virtual", "R$ 100.000", "R$ 35.000", "4-7 meses", "Lançada 2017; alta rentabilidade (Guia Franquias)", "Médio"],
    ["Let's Play Games", "Quiosque games/consoles/simuladores", "n.v.", "n.v.", "n.v.", "Formato quiosque p/ shoppings (site oficial)", "Médio"],
    ["Desbravadores", "Esporte/airsoft indoor", "R$ 65.000 a R$ 100.000", "R$ 30.800 a R$ 41.850", "14 meses", "Desde 2016 (Guia Franquias)", "Médio"],
    ["Lends Club", "Tabuleiria (bar+café+jogos)", "R$ 25.000 a R$ 132.000", "R$ 5.000 a R$ 37.000", "18-24 meses", "Conceito terceiro espaço (Guia Franquias)", "Médio"],
]
for r in rows:
    ws.append(r)
style_header(ws, 4, 7)
body(ws, 5, 7, ws.max_row)
for col, w in zip("ABCDEFG", [18, 42, 22, 20, 12, 42, 12]):
    ws.column_dimensions[col].width = w

# ============ ABA 5: KA — MARCAS GASTRONOMIA ============
ws = wb.create_sheet("5. KA Gastronomia")
ws["A1"] = "KA — MARCAS DE GASTRONOMIA EM EXPANSÃO"
ws["A1"].font = title_font
ws["A2"] = "Marcas em expansão com fit para o cluster. Dados públicos ABF/imprensa. Confiança 7/10."
ws["A2"].font = note_font

rows = [
    ["Marca", "Categoria", "Investimento", "Faturamento médio", "Payback", "Tração / fonte", "Fit cluster"],
    ["Cabana Burger", "Hamburgueria premium", "R$ 1,2 milhão (120 m²)", "n.v.", "n.v.", "43 endereços SP+RJ; expansão mista rua+shopping (Sua Franquia jul/2025)", "Alto"],
    ["ROOT", "Saudável / fresco", "R$ 130.000 a R$ 330.000", "R$ 140.000", "18-24 meses", "Comida fresca em 15 min (Guia Franquias nov/2025)", "Médio-alto"],
    ["Only Mule", "Drinks / bar", "R$ 156.900", "R$ 100.000", "12-24 meses", "Drinks autorais (Guia Franquias)", "Médio"],
    ["Mei Mei", "Comida asiática (praça)", "R$ 1 milhão (40 m²)", "R$ 250.000", "30-48 meses", "43 endereços SP+RJ (Sua Franquia)", "Médio-alto"],
    ["The Fifties", "Hamburgueria temática anos 50", "A partir de R$ 960.000 (Express)", "n.v.", "n.v.", "Já presente no Mooca Plaza desde inauguração — VERIFICAR exclusão", "n.v."],
    ["Heladeria Havanna", "Sorveteria/café premium", "n.v.", "n.v.", "n.v.", "Nova no setor 2T2025 (Abrasce/InvestSP)", "Médio-alto"],
    ["Firehouse Subs", "Sanduíches", "n.v.", "n.v.", "n.v.", "Nova no setor 2T2025 (Abrasce/InvestSP)", "Médio"],
]
for r in rows:
    ws.append(r)
style_header(ws, 4, 7)
body(ws, 5, 7, ws.max_row)
for col, w in zip("ABCDEFG", [20, 26, 26, 18, 14, 46, 12]):
    ws.column_dimensions[col].width = w

# ============ ABA 6: CONTEXTO DE MERCADO ============
ws = wb.create_sheet("6. Mercado")
ws["A1"] = "CONTEXTO DE MERCADO (dados setoriais)"
ws["A1"].font = title_font
ws["A2"] = "Benchmarks e tendências para fundamentar decisões. Confiança 8/10 (fontes Abrasce/ABF)."
ws["A2"].font = note_font

rows = [
    ["Indicador", "Valor", "Fonte"],
    ["Shoppings no Brasil", "658 em operação (2025)", "Abrasce / FecomercioSP"],
    ["Faturamento do setor", "R$ 200,9 bilhões (2025)", "Abrasce"],
    ["Visitantes/mês", "471 milhões (fluxo caiu no último ano)", "Abrasce / FecomercioSP"],
    ["Taxa de ocupação do mercado", "95,1% (2T2025)", "Abrasce"],
    ["Alimentação no mix", "19,1% das lojas (subiu de 17,5%)", "Abrasce 2024"],
    ["Lazer e entretenimento no mix", "2,4% (subiu de 2,2%)", "Abrasce 2024"],
    ["Tendência-chave", "'Food is the new fashion' — restaurantes viram as novas âncoras", "DComercio mar/2026 (LAM)"],
    ["Franchising — faturamento 2025", "R$ 301,7 bilhões (+10,5%)", "ABF"],
    ["Franchising — fat. médio/operação", "R$ 124.203/mês (+7,9%)", "ABF 2025"],
    ["Consumo de games no Brasil", "82,8% da população (recorde); mercado de R$ 12,7 bi em 2025", "Pesquisa Game Brasil 2025"],
    ["Tendência franquias 2026", "Modelos compactos, híbridos, asset-light (nano lojas, quiosques)", "Portal do Franchising mar/2026"],
    ["Segmentos em alta 2026", "Bem-estar, saúde, estética, alimentação, pet", "Portal do Franchising mar/2026"],
]
for r in rows:
    ws.append(r)
style_header(ws, 4, 3)
body(ws, 5, 3, ws.max_row)
ws.column_dimensions["A"].width = 32
ws.column_dimensions["B"].width = 55
ws.column_dimensions["C"].width = 36

# ============ ABA 7: LACUNAS / N.V. ============
ws = wb.create_sheet("7. Lacunas (n.v.)")
ws["A1"] = "DADOS NÃO ENCONTRADOS (n.v.) — necessários para completar a execução"
ws["A1"].font = title_font
ws["A2"] = "Dados internos não públicos. Sem eles, 7 dos 12 agentes não executam plenamente. Fornecer para destravar."
ws["A2"].font = note_font

rows = [
    ["Dado faltante", "Agente bloqueado", "Por que importa"],
    ["Lista completa de lojas atuais", "Hunter, KA", "Garantir que só prospectamos marcas AUSENTES"],
    ["Lojas vagas reais + plantas + metragens", "Plataforma de Espaços, Builder", "Sem isso não há ficha técnica nem cronograma de obra"],
    ["Contratos a vencer", "Deal Conversion, KA", "Janela real de qualificação de mix (vacância é ~zero)"],
    ["Preços/m², luvas, carência (Sistema Bahia)", "Plataforma de Espaços, Alavancador", "Viabilidade financeira de cada deal"],
    ["Fluxo e vendas por loja", "Seller, Governance", "Diagnóstico da Master Equation (Fluxo/Conversão/Ticket)"],
    ["Base de investidores/multifranqueados", "Farmer", "Match investidor x marca x loja"],
    ["Fornecedores homologados", "Builder", "Acelerar obra e abertura"],
    ["KPIs de baseline (NPS, dwell time, fluxo)", "Governance, Entertainer", "Metas 30/60/90 reais"],
]
for r in rows:
    ws.append(r)
style_header(ws, 4, 3)
body(ws, 5, 3, ws.max_row)
ws.column_dimensions["A"].width = 40
ws.column_dimensions["B"].width = 30
ws.column_dimensions["C"].width = 50

# destaque terracota nos títulos de aba que são achados-chave
for sheetname in ["1. Ativo"]:
    s = wb[sheetname]
    # marca a linha de ocupação 98,4%
    for r in range(5, s.max_row+1):
        if s.cell(row=r, column=1).value == "Taxa de ocupação":
            for c in range(1,5):
                s.cell(row=r, column=c).fill = PatternFill("solid", fgColor="FBE9E7")
                s.cell(row=r, column=c).font = bold_cell

wb.save("/mnt/user-data/outputs/Mooca_Plaza_Diagnostico_OS.xlsx")
print("OK")
