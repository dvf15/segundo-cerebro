#!/usr/bin/env python3
"""
build_excel.py — Regenera a planilha Excel do sistema Plaza Niterói
a partir dos arquivos JSON em data/.

Uso:
    cd scripts
    pip install openpyxl
    python build_excel.py

Saída: excel/Plaza_Niteroi_Sistema.xlsx
"""

import json
import sys
from datetime import datetime, timedelta
from pathlib import Path

try:
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
    from openpyxl.formatting.rule import CellIsRule, FormulaRule, ColorScaleRule
    from openpyxl.worksheet.datavalidation import DataValidation
except ImportError:
    sys.stderr.write("ERRO: openpyxl não instalado. Rode: pip install openpyxl\n")
    sys.exit(1)


# Paths
ROOT = Path(__file__).parent.parent
DATA_DIR = ROOT / "data"
OUT_DIR = ROOT / "excel"
OUT_FILE = OUT_DIR / "Plaza_Niteroi_Sistema.xlsx"

# Estilos
FT_T = Font(name="Arial", bold=True, color="FFFFFF", size=13)
FT_H = Font(name="Arial", bold=True, color="FFFFFF", size=10)
FT_B = Font(name="Arial", size=10)
FT_BB = Font(name="Arial", size=10, bold=True)
FT_S = Font(name="Arial", size=9, italic=True, color="555555")
FT_KPI_LBL = Font(name="Arial", size=9, color="555555")
FT_KPI_VAL = Font(name="Arial", size=18, bold=True, color="1F4E78")

FL_T = PatternFill("solid", start_color="1F4E78")
FL_H = PatternFill("solid", start_color="2E75B6")
FL_HDR2 = PatternFill("solid", start_color="4F81BD")
FL_A = PatternFill("solid", start_color="F2F2F2")
FL_NV = PatternFill("solid", start_color="FFF2CC")
FL_G = PatternFill("solid", start_color="C6EFCE")
FL_R = PatternFill("solid", start_color="F8CBAD")
FL_BL = PatternFill("solid", start_color="D9E1F2")
FL_KPI = PatternFill("solid", start_color="EAF1F8")

thin = Side(border_style="thin", color="BFBFBF")
medium = Side(border_style="medium", color="1F4E78")
BD = Border(left=thin, right=thin, top=thin, bottom=thin)
BD_M = Border(left=medium, right=medium, top=medium, bottom=medium)
AL = Alignment(horizontal="left", vertical="center", wrap_text=True)
AC = Alignment(horizontal="center", vertical="center", wrap_text=True)
AR = Alignment(horizontal="right", vertical="center", wrap_text=True)

ESTAGIOS = ["Lead", "Qualified Lead", "Contacted", "Meeting Scheduled", "Meeting Done",
            "Proposal", "Technical Feasibility", "Investor Match", "Contract Negotiation",
            "Contract Signed", "Construction / Obra", "Opening", "Ramp-up",
            "Performance Review", "Lost / Parked"]
DONOS = ["EV", "KA", "Street Converter", "Hunter", "Farmer", "Diretoria + KA",
         "Allos Desenv. + EV", "Builder", "Cluster Engine"]
PRIORIDADES = ["ALTA", "MÉDIA", "BAIXA"]
STATUS_PLAZA = ["AUSENTE", "n.v. - verificar duplicidade", "JÁ EXISTE - descartar"]


def load_pipeline():
    """Carrega pipeline-seed.json."""
    with open(DATA_DIR / "pipeline-seed.json", encoding="utf-8") as f:
        return json.load(f)


def load_mix():
    """Carrega mix-atual-plaza.json."""
    with open(DATA_DIR / "mix-atual-plaza.json", encoding="utf-8") as f:
        return json.load(f)


def next_date(days):
    return (datetime.now() + timedelta(days=days)).strftime("%Y-%m-%d")


def build_workbook(pipeline_data, mix_data):
    wb = Workbook()

    # ============ Instruções ============
    ws = wb.active
    ws.title = "Instruções"
    ws.merge_cells("A1:F1")
    c = ws["A1"]
    c.value = "PLAZA NITERÓI — PIPELINE COLABORATIVO Workflow 1 Vacancy-to-Contract v5"
    c.font = FT_T
    c.fill = FL_T
    c.alignment = AC
    ws.row_dimensions[1].height = 28

    instrucoes_blocks = [
        ("BEM-VINDO AO SISTEMA DE ACOMPANHAMENTO", True),
        ("", False),
        ("ESTRUTURA DO SISTEMA:", True),
        ("1. Aba 'Pipeline' - tabela editável com dropdowns. Edite diretamente.", False),
        ("2. Aba 'Dashboard' - KPIs e contadores automáticos.", False),
        ("3. Aba 'Log Atualizações' - registre cada mudança importante.", False),
        ("4. Aba 'Mix Atual Plaza' - lista de marcas confirmadas. CONSULTE ANTES de adicionar nova marca-alvo.", False),
        ("5. Aba 'Contatos & Canais' - diretório de canais comerciais por marca.", False),
        ("6. Aba 'Glossário' - definições de estágios, scores e termos.", False),
        ("", False),
        ("CO-AUTORIA:", True),
        ("- Para uso colaborativo, suba este arquivo no SharePoint ou OneDrive.", False),
        ("- Múltiplos usuários podem editar simultaneamente.", False),
        ("- Conflito em mesma célula: prevalece a última gravação.", False),
        ("", False),
        ("REGRAS CRÍTICAS:", True),
        ("- ANTES de adicionar marca-alvo, verifique 'Mix Atual Plaza' para evitar duplicidade.", False),
        ("- Status 'JÁ EXISTE - descartar' = marca está no shopping (manter histórico).", False),
        ("- Prazo vencido sem update = ação atrasada (Dashboard sinaliza vermelho).", False),
        ("- Cluster Fit < 40 = não priorizar, salvo emergência de vacância.", False),
        ("- Atualizar 'Última atualização' a cada mudança.", False),
        ("", False),
        ("CONVENÇÕES DE COR:", True),
        ("- Verde: status positivo / fit alto / contrato assinado.", False),
        ("- Amarelo: precisa verificação ou n.v.", False),
        ("- Vermelho: marca já existe (descartar) / prazo vencido / risco alto.", False),
        ("- Azul: em análise ou estágio intermediário.", False),
        ("", False),
        ("REGENERAR ESTA PLANILHA:", True),
        ("Se houver atualização nos JSONs em data/, rode: python scripts/build_excel.py", False),
    ]

    for i, (txt, bold) in enumerate(instrucoes_blocks, start=3):
        cell = ws.cell(row=i, column=1, value=txt)
        cell.font = FT_BB if bold else FT_B
        cell.alignment = AL
        ws.merge_cells(start_row=i, start_column=1, end_row=i, end_column=6)

    ws.column_dimensions["A"].width = 30
    for col in "BCDEF":
        ws.column_dimensions[col].width = 15

    # ============ Pipeline ============
    ws = wb.create_sheet("Pipeline")
    ws.merge_cells("A1:P1")
    c = ws["A1"]
    c.value = "PIPELINE DE OPORTUNIDADES — Editar diretamente | Validar duplicidade em 'Mix Atual Plaza'"
    c.font = FT_T
    c.fill = FL_T
    c.alignment = AC
    ws.row_dimensions[1].height = 24

    headers = ["ID", "Saída/Espaço", "ABL m²", "Marca-alvo", "Tese", "Status Plaza",
               "Estágio", "Dono", "Prob %", "Fit", "Prio", "Canal Contato Comercial",
               "Próxima Ação", "Prazo", "Blocker", "Última atualização"]

    for col, h in enumerate(headers, 1):
        cell = ws.cell(row=3, column=col, value=h)
        cell.font = FT_H
        cell.fill = FL_H
        cell.alignment = AC
        cell.border = BD

    ws.row_dimensions[3].height = 30
    ws.freeze_panes = "C4"

    hoje = datetime.now().strftime("%Y-%m-%d")
    for i, opp in enumerate(pipeline_data, start=4):
        prazo = next_date(opp.get("prazo_dias", 30))
        row_values = [
            opp["id"], opp["saida"], opp["abl"], opp["marca"], opp["tese"],
            opp["status_plaza"], opp["estagio"], opp["dono"], opp["prob"],
            opp["fit"], opp["prio"], opp["canal"], opp["acao"], prazo,
            opp.get("blocker", ""), hoje
        ]
        for col_idx, val in enumerate(row_values, 1):
            cell = ws.cell(row=i, column=col_idx, value=val)
            cell.font = FT_B
            cell.alignment = AL if col_idx in (2, 4, 5, 12, 13, 15) else AC
            cell.border = BD
            if col_idx == 3:
                cell.number_format = "#,##0"
            if col_idx == 9:
                cell.number_format = '0"%"'
            if i % 2 == 0:
                cell.fill = FL_A

    ultimo_data = len(pipeline_data) + 3

    # Linhas em branco
    for i in range(ultimo_data + 1, ultimo_data + 51):
        for col_idx in range(1, 17):
            cell = ws.cell(row=i, column=col_idx)
            cell.font = FT_B
            cell.alignment = AL if col_idx in (2, 4, 5, 12, 13, 15) else AC
            cell.border = BD
            if i % 2 == 0:
                cell.fill = FL_A

    last_row = ultimo_data + 50

    # Validações
    dv_status = DataValidation(type="list", formula1='"' + ",".join(STATUS_PLAZA) + '"', allow_blank=True)
    ws.add_data_validation(dv_status)
    dv_status.add(f"F4:F{last_row}")

    dv_estagio = DataValidation(type="list", formula1='"' + ",".join(ESTAGIOS) + '"', allow_blank=True)
    ws.add_data_validation(dv_estagio)
    dv_estagio.add(f"G4:G{last_row}")

    dv_dono = DataValidation(type="list", formula1='"' + ",".join(DONOS) + '"', allow_blank=True)
    ws.add_data_validation(dv_dono)
    dv_dono.add(f"H4:H{last_row}")

    dv_prio = DataValidation(type="list", formula1='"' + ",".join(PRIORIDADES) + '"', allow_blank=True)
    ws.add_data_validation(dv_prio)
    dv_prio.add(f"K4:K{last_row}")

    dv_prob = DataValidation(type="whole", operator="between", formula1=0, formula2=100, allow_blank=True)
    ws.add_data_validation(dv_prob)
    dv_prob.add(f"I4:I{last_row}")

    dv_fit = DataValidation(type="whole", operator="between", formula1=0, formula2=100, allow_blank=True)
    ws.add_data_validation(dv_fit)
    dv_fit.add(f"J4:J{last_row}")

    dv_date = DataValidation(type="date", allow_blank=True)
    ws.add_data_validation(dv_date)
    dv_date.add(f"N4:N{last_row}")
    dv_date.add(f"P4:P{last_row}")

    # Formatação condicional
    ws.conditional_formatting.add(f"G4:G{last_row}",
        CellIsRule(operator="equal", formula=['"Contract Signed"'], fill=FL_G, font=FT_BB))
    ws.conditional_formatting.add(f"G4:G{last_row}",
        CellIsRule(operator="equal", formula=['"Lost / Parked"'], fill=FL_R, font=FT_BB))
    ws.conditional_formatting.add(f"G4:G{last_row}",
        CellIsRule(operator="equal", formula=['"Lead"'], fill=FL_NV))
    ws.conditional_formatting.add(f"K4:K{last_row}",
        CellIsRule(operator="equal", formula=['"ALTA"'], fill=FL_R, font=FT_BB))
    ws.conditional_formatting.add(f"K4:K{last_row}",
        CellIsRule(operator="equal", formula=['"MÉDIA"'], fill=FL_NV))
    ws.conditional_formatting.add(f"F4:F{last_row}",
        CellIsRule(operator="equal", formula=['"AUSENTE"'], fill=FL_G))
    ws.conditional_formatting.add(f"F4:F{last_row}",
        CellIsRule(operator="equal", formula=['"JÁ EXISTE - descartar"'], fill=FL_R, font=FT_BB))
    ws.conditional_formatting.add(f"F4:F{last_row}",
        CellIsRule(operator="equal", formula=['"n.v. - verificar duplicidade"'], fill=FL_NV))
    ws.conditional_formatting.add(f"N4:N{last_row}",
        FormulaRule(formula=[f'AND(N4<>"",N4<TODAY(),G4<>"Contract Signed",G4<>"Lost / Parked",G4<>"Opening",G4<>"Ramp-up")'],
                    fill=FL_R, font=FT_BB))
    ws.conditional_formatting.add(f"J4:J{last_row}",
        ColorScaleRule(start_type="num", start_value=0, start_color="F8CBAD",
                       mid_type="num", mid_value=70, mid_color="FFF2CC",
                       end_type="num", end_value=100, end_color="C6EFCE"))

    widths = {"A": 12, "B": 28, "C": 9, "D": 26, "E": 40, "F": 22, "G": 18, "H": 18,
              "I": 8, "J": 6, "K": 9, "L": 38, "M": 32, "N": 12, "O": 22, "P": 13}
    for col, w in widths.items():
        ws.column_dimensions[col].width = w

    # ============ Dashboard ============
    ws = wb.create_sheet("Dashboard")
    ws.merge_cells("A1:H1")
    c = ws["A1"]
    c.value = "DASHBOARD EXECUTIVO — Atualiza automaticamente"
    c.font = FT_T
    c.fill = FL_T
    c.alignment = AC
    ws.row_dimensions[1].height = 24

    ws["A2"] = f"Snapshot gerado em: " + datetime.now().strftime("%d/%m/%Y %H:%M")
    ws["A2"].font = FT_S
    ws.merge_cells("A2:H2")

    ws["A4"] = "KPIs DO PIPELINE"
    ws["A4"].font = FT_BB
    ws.merge_cells("A4:H4")

    # KPI cards
    kpis = [
        ("A", "TOTAL OPORTUNIDADES", f'=COUNTA(Pipeline!A4:A{last_row})-COUNTIF(Pipeline!A4:A{last_row},"")', None),
        ("B", "CONTRATOS ASSINADOS", f'=COUNTIF(Pipeline!G4:G{last_row},"Contract Signed")+COUNTIF(Pipeline!G4:G{last_row},"Opening")+COUNTIF(Pipeline!G4:G{last_row},"Ramp-up")', None),
        ("C", "EM NEGOCIAÇÃO AVANÇADA", f'=COUNTIF(Pipeline!G4:G{last_row},"Proposal")+COUNTIF(Pipeline!G4:G{last_row},"Contract Negotiation")+COUNTIF(Pipeline!G4:G{last_row},"Investor Match")', None),
        ("D", "ABL TOTAL PIPELINE (m²)", f"=SUM(Pipeline!C4:C{last_row})", "#,##0"),
        ("E", "AÇÕES ATRASADAS", f'=SUMPRODUCT((Pipeline!N4:N{last_row}<>"")*(Pipeline!N4:N{last_row}<TODAY())*(Pipeline!G4:G{last_row}<>"Contract Signed")*(Pipeline!G4:G{last_row}<>"Lost / Parked")*(Pipeline!G4:G{last_row}<>"Opening")*(Pipeline!G4:G{last_row}<>"Ramp-up"))', None),
        ("F", "ALTA PRIORIDADE", f'=COUNTIF(Pipeline!K4:K{last_row},"ALTA")', None),
        ("G", "CLUSTER FIT MÉDIO", f'=IFERROR(AVERAGEIF(Pipeline!J4:J{last_row},">0"),0)', "0"),
        ("H", "PIPELINE PONDERADO (ABL×Prob)", f"=SUMPRODUCT(Pipeline!C4:C{last_row},Pipeline!I4:I{last_row})/100", "#,##0"),
    ]

    for col, label, formula, fmt in kpis:
        lbl = ws[f"{col}6"]
        lbl.value = label
        lbl.font = FT_KPI_LBL
        lbl.alignment = AC
        lbl.fill = FL_KPI
        lbl.border = BD_M

        val = ws[f"{col}7"]
        val.value = formula
        val.font = FT_KPI_VAL
        val.alignment = AC
        val.fill = FL_KPI
        val.border = BD_M
        if fmt:
            val.number_format = fmt

    ws.row_dimensions[6].height = 18
    ws.row_dimensions[7].height = 36

    # Pipeline por Estágio
    ws["A10"] = "PIPELINE POR ESTÁGIO"
    ws["A10"].font = FT_BB
    ws.merge_cells("A10:C10")

    for col, h in enumerate(["Estágio", "Qtd", "ABL (m²)"], 1):
        cell = ws.cell(row=11, column=col, value=h)
        cell.font = FT_H
        cell.fill = FL_HDR2
        cell.alignment = AC
        cell.border = BD

    for i, stage in enumerate(ESTAGIOS, start=12):
        cs = ws.cell(row=i, column=1, value=stage)
        cs.font = FT_B
        cs.border = BD
        cs.alignment = AL
        cn = ws.cell(row=i, column=2, value=f'=COUNTIF(Pipeline!G4:G{last_row},"{stage}")')
        cn.font = FT_B
        cn.border = BD
        cn.alignment = AC
        cabl = ws.cell(row=i, column=3, value=f'=SUMIF(Pipeline!G4:G{last_row},"{stage}",Pipeline!C4:C{last_row})')
        cabl.font = FT_B
        cabl.border = BD
        cabl.alignment = AR
        cabl.number_format = "#,##0"
        if i % 2 == 0:
            for col in (1, 2, 3):
                ws.cell(row=i, column=col).fill = FL_A

    tot_row = 12 + len(ESTAGIOS)
    ws.cell(row=tot_row, column=1, value="TOTAL").font = FT_BB
    ws.cell(row=tot_row, column=1).border = BD
    ws.cell(row=tot_row, column=2, value=f"=SUM(B12:B{tot_row-1})").font = FT_BB
    ws.cell(row=tot_row, column=2).border = BD
    ws.cell(row=tot_row, column=2).alignment = AC
    ws.cell(row=tot_row, column=3, value=f"=SUM(C12:C{tot_row-1})").font = FT_BB
    ws.cell(row=tot_row, column=3).border = BD
    ws.cell(row=tot_row, column=3).alignment = AR
    ws.cell(row=tot_row, column=3).number_format = "#,##0"

    # Por Dono
    ws["E10"] = "PIPELINE POR DONO"
    ws["E10"].font = FT_BB
    ws.merge_cells("E10:G10")

    for col, h in enumerate(["Dono", "Qtd", "ABL (m²)"], 5):
        cell = ws.cell(row=11, column=col, value=h)
        cell.font = FT_H
        cell.fill = FL_HDR2
        cell.alignment = AC
        cell.border = BD

    for i, dono in enumerate(DONOS, start=12):
        cs = ws.cell(row=i, column=5, value=dono)
        cs.font = FT_B
        cs.border = BD
        cs.alignment = AL
        cn = ws.cell(row=i, column=6, value=f'=COUNTIF(Pipeline!H4:H{last_row},"{dono}")')
        cn.font = FT_B
        cn.border = BD
        cn.alignment = AC
        cabl = ws.cell(row=i, column=7, value=f'=SUMIF(Pipeline!H4:H{last_row},"{dono}",Pipeline!C4:C{last_row})')
        cabl.font = FT_B
        cabl.border = BD
        cabl.alignment = AR
        cabl.number_format = "#,##0"
        if i % 2 == 0:
            for col in (5, 6, 7):
                ws.cell(row=i, column=col).fill = FL_A

    # Por Prioridade
    prio_start = max(tot_row + 3, 12 + len(DONOS) + 3)
    ws.cell(row=prio_start, column=1, value="PIPELINE POR PRIORIDADE").font = FT_BB
    ws.merge_cells(start_row=prio_start, start_column=1, end_row=prio_start, end_column=3)

    for col, h in enumerate(["Prioridade", "Qtd", "ABL (m²)"], 1):
        cell = ws.cell(row=prio_start + 1, column=col, value=h)
        cell.font = FT_H
        cell.fill = FL_HDR2
        cell.alignment = AC
        cell.border = BD

    for i, prio in enumerate(PRIORIDADES, start=prio_start + 2):
        cs = ws.cell(row=i, column=1, value=prio)
        cs.font = FT_BB
        cs.border = BD
        cs.alignment = AL
        cn = ws.cell(row=i, column=2, value=f'=COUNTIF(Pipeline!K4:K{last_row},"{prio}")')
        cn.font = FT_B
        cn.border = BD
        cn.alignment = AC
        cabl = ws.cell(row=i, column=3, value=f'=SUMIF(Pipeline!K4:K{last_row},"{prio}",Pipeline!C4:C{last_row})')
        cabl.font = FT_B
        cabl.border = BD
        cabl.alignment = AR
        cabl.number_format = "#,##0"
        if prio == "ALTA":
            cs.fill = FL_R
        elif prio == "MÉDIA":
            cs.fill = FL_NV

    for col, w in {"A": 26, "B": 14, "C": 14, "D": 14, "E": 22, "F": 10, "G": 14, "H": 22}.items():
        ws.column_dimensions[col].width = w

    # ============ Log de Atualizações ============
    ws = wb.create_sheet("Log Atualizações")
    ws.merge_cells("A1:F1")
    c = ws["A1"]
    c.value = "LOG DE ATUALIZAÇÕES — registre cada mudança importante"
    c.font = FT_T
    c.fill = FL_T
    c.alignment = AC
    ws.row_dimensions[1].height = 24

    ws["A3"] = "INSTRUÇÃO: Sempre que mudar estágio/ação/blocker no Pipeline, registre aqui."
    ws["A3"].font = FT_S
    ws.merge_cells("A3:F3")

    log_headers = ["Data", "Usuário", "Papel", "ID Oportunidade", "Mudança", "Observação"]
    for col, h in enumerate(log_headers, 1):
        cell = ws.cell(row=5, column=col, value=h)
        cell.font = FT_H
        cell.fill = FL_H
        cell.alignment = AC
        cell.border = BD
    ws.row_dimensions[5].height = 24

    exemplos = [
        [hoje, "(seu nome)", "EV", "OPP-B-HM", "Lead → Contacted",
         "Email institucional enviado para Diretoria Allos [EXEMPLO]"],
        [hoje, "(seu nome)", "Street Converter", "OPP-F4a", "Lead → Meeting Scheduled",
         "Bullguer aceitou reunião [EXEMPLO]"],
    ]
    for i, row in enumerate(exemplos, start=6):
        for col_idx, val in enumerate(row, 1):
            cell = ws.cell(row=i, column=col_idx, value=val)
            cell.font = FT_B
            cell.alignment = AL if col_idx in (4, 5, 6) else AC
            cell.border = BD
            cell.fill = FL_NV

    for i in range(8, 208):
        for col_idx in range(1, 7):
            cell = ws.cell(row=i, column=col_idx)
            cell.font = FT_B
            cell.alignment = AL if col_idx in (4, 5, 6) else AC
            cell.border = BD
            if i % 2 == 0:
                cell.fill = FL_A

    dv_papel = DataValidation(type="list", formula1='"' + ",".join(DONOS) + '"', allow_blank=True)
    ws.add_data_validation(dv_papel)
    dv_papel.add("C6:C207")

    dv_date2 = DataValidation(type="date", allow_blank=True)
    ws.add_data_validation(dv_date2)
    dv_date2.add("A6:A207")

    for col, w in {"A": 12, "B": 25, "C": 22, "D": 18, "E": 32, "F": 60}.items():
        ws.column_dimensions[col].width = w

    # ============ Mix Atual Plaza ============
    ws = wb.create_sheet("Mix Atual Plaza")
    ws.merge_cells("A1:D1")
    c = ws["A1"]
    c.value = "MIX ATUAL PLAZA — consulte antes de adicionar marca-alvo nova"
    c.font = FT_T
    c.fill = FL_T
    c.alignment = AC
    ws.row_dimensions[1].height = 24

    ws["A3"] = "⚠️ REGRA: Marca presente nesta aba NÃO deve ser adicionada como pipeline novo."
    ws["A3"].font = FT_BB
    ws["A3"].fill = FL_R
    ws.merge_cells("A3:D3")

    for col, h in enumerate(["Categoria", "Marca", "Fonte", "Observação"], 1):
        cell = ws.cell(row=5, column=col, value=h)
        cell.font = FT_H
        cell.fill = FL_H
        cell.alignment = AC
        cell.border = BD

    marcas = mix_data.get("marcas", [])
    fonte_default = mix_data.get("_meta", {}).get("fonte_principal", "")
    for i, m in enumerate(marcas, start=6):
        vals = [m.get("categoria", ""), m.get("marca", ""), fonte_default, m.get("obs", "")]
        for col_idx, val in enumerate(vals, 1):
            cell = ws.cell(row=i, column=col_idx, value=val)
            cell.font = FT_B
            cell.alignment = AL
            cell.border = BD
            if i % 2 == 0:
                cell.fill = FL_A
            sv = str(val)
            if "JÁ EXISTE" in sv:
                cell.fill = FL_R
            elif "SATURADA" in sv or "ÂNCORA" in sv:
                cell.fill = FL_G
            elif "validar" in sv.lower():
                cell.fill = FL_NV

    for col, w in {"A": 22, "B": 70, "C": 38, "D": 35}.items():
        ws.column_dimensions[col].width = w
    ws.freeze_panes = "A6"

    # ============ Contatos & Canais ============
    ws = wb.create_sheet("Contatos & Canais")
    ws.merge_cells("A1:F1")
    c = ws["A1"]
    c.value = "DIRETÓRIO DE CONTATOS COMERCIAIS"
    c.font = FT_T
    c.fill = FL_T
    c.alignment = AC
    ws.row_dimensions[1].height = 24

    for col, h in enumerate(["Marca", "Categoria", "Canal", "Telefone/Email", "LinkedIn/IG", "Observação"], 1):
        cell = ws.cell(row=3, column=col, value=h)
        cell.font = FT_H
        cell.fill = FL_H
        cell.alignment = AC
        cell.border = BD

    contatos = [
        ["H&M Brasil", "Fast fashion internacional", "Grupo Dorben (JV oficial H&M Brasil)",
         "Via Diretoria Allos", "LinkedIn: H&M Brasil + Grupo Dorben",
         "CEO Daniel Ervér - prioridade ALTA"],
        ["Bullguer", "Hambúrguer autoral", "bullguer.com.br", "Via site",
         "IG @bullguerrio | LinkedIn fundadores", "Várias unidades Zona Sul Rio"],
        ["Ferro e Farinha", "Pizza autoral", "ferroefarinha.com.br | Catete (Rua Andrade Pertence 42)",
         "(21) 3495-1552", "IG @ferroefarinha", "Chef Sei Shiroma - 4 unidades RJ"],
        ["Tenore Churrascaria", "Churrascaria",
         "tenore.com.br | Av. Jornalista Alberto F. Torres 521, Icaraí", "(21) 2610-1893",
         "n.v.", "Vista praia Icaraí"],
        ["Cantón Peruvian & Chinese", "Chifa autoral",
         "canton.com.br | São Francisco beira-mar Niterói", "Via site",
         "IG @cantonbrasil", "3 unidades SP/RJ"],
        ["TT Burguer", "Hambúrguer Troisgros", "ttburger.com.br", "Via site",
         "Grupo Thomas Troisgros", "Várias unidades RJ"],
        ["Bossa Nova Bowl", "Boliche compacto", "bossanovabowl.com.br", "SAC site",
         "LinkedIn diretoria", "Categoria ausente Plaza"],
        ["Lock Quest", "Escape rooms", "lockquest.com.br", "Via site", "n.v.", ""],
        ["EnigMa Escape", "Escape rooms", "enigmaescape.com.br", "Via site", "n.v.", ""],
        ["Sandbox VR", "VR multiplayer", "sandboxvr.com (matriz)", "Via site matriz",
         "n.v.", "Sem rep BR confirmado"],
        ["Topgolf Brasil", "Entretenimento esportivo", "topgolf.com.br (Allianz Parque SP)",
         "Via site", "n.v.", "Expansão BR ativa"],
        ["Suplicy Cafés Especiais", "Café especial autoral", "suplicycafes.com.br",
         "Via site", "LinkedIn Diretoria Expansão", ""],
        ["The Coffee", "Café especial", "thecoffee.jp",
         "franquia@thecoffee.jp", "IG @thecoffee", "Expansão agressiva BR"],
        ["Octavio Café", "Café especial premium", "octaviocafe.com.br", "Via site",
         "n.v.", "SP base"],
        ["Coffee Lab", "Café premiado microlotes", "coffeelab.com.br", "Via site",
         "n.v.", ""],
        ["ALO Yoga", "Activewear premium", "aloyoga.com.br/institucional/lojas",
         "Via Iguatemi/I-Retail", "n.v.", "1ª loja Rio - VillageMall abr/26"],
        ["Smart Fit", "Academia", "smartfit.com.br/contato", "Via site",
         "LinkedIn Diretoria Expansão", "2 unidades Niterói mas não Plaza"],
        ["Cobasi", "Pet shop", "cobasi.com.br/parceria-expansao", "Via site",
         "LinkedIn Diretoria Expansão", "1 unidade Niterói (não Plaza)"],
        ["Petz", "Pet shop", "petz.com.br/expansao", "Via site",
         "LinkedIn Diretoria Expansão", ""],
        ["Dr. Consulta", "Clínica multi-especialidade", "drconsulta.com.br/expansao",
         "Via site", "LinkedIn Diretoria Expansão", ""],
        ["Onodera Estética", "Estética premium", "onoderaestetica.com.br",
         "0800 7717070", "n.v.", ""],
        ["Le Beauté Salon Bar", "Salão+bar (Icaraí)",
         "Matéria Cidade de Niterói (abr/2024)", "Prospectar diretamente",
         "n.v.", "Conceito exclusivo Icaraí"],
        ["Maria Brigadeiro", "Brigaderia autoral", "mariabrigadeiro.com.br",
         "franquia@mariabrigadeiro.com.br", "n.v.", ""],
        ["Briggo's", "Brigaderia gourmet", "briggos.com.br", "Via site", "n.v.", ""],
        ["Amaro", "DTC Guide Shop", "amaro.com", "Via site",
         "LinkedIn Diretoria Lojas", ""],
        ["Sindilojas RJ", "Multifranqueados", "sindilojas-rio.com.br",
         "(21) 2272-1300", "n.v.", "Mand. 8 Levy - lote 28 caixas pequenas"],
    ]
    for i, row in enumerate(contatos, start=4):
        for col_idx, val in enumerate(row, 1):
            cell = ws.cell(row=i, column=col_idx, value=val)
            cell.font = FT_B
            cell.alignment = AL
            cell.border = BD
            if i % 2 == 0:
                cell.fill = FL_A

    for col, w in {"A": 26, "B": 26, "C": 35, "D": 25, "E": 28, "F": 38}.items():
        ws.column_dimensions[col].width = w
    ws.freeze_panes = "A4"

    # ============ Glossário ============
    ws = wb.create_sheet("Glossário")
    ws.merge_cells("A1:C1")
    c = ws["A1"]
    c.value = "GLOSSÁRIO — definições de estágios, scores e termos"
    c.font = FT_T
    c.fill = FL_T
    c.alignment = AC
    ws.row_dimensions[1].height = 24

    for col, h in enumerate(["Termo", "Categoria", "Definição"], 1):
        cell = ws.cell(row=3, column=col, value=h)
        cell.font = FT_H
        cell.fill = FL_H
        cell.alignment = AC
        cell.border = BD

    glossario = [
        ["Lead", "Estágio", "Marca identificada como candidata. Nenhum contato ainda."],
        ["Qualified Lead", "Estágio", "Lead que passou pelo filtro de duplicidade e cluster fit."],
        ["Contacted", "Estágio", "Primeiro contato comercial realizado."],
        ["Meeting Scheduled", "Estágio", "Reunião agendada com a marca-alvo."],
        ["Meeting Done", "Estágio", "Reunião realizada. Próximos passos definidos."],
        ["Proposal", "Estágio", "Proposta comercial enviada à marca."],
        ["Technical Feasibility", "Estágio", "Análise técnica do espaço pela marca."],
        ["Investor Match", "Estágio", "Match com investidor identificado pelo Farmer."],
        ["Contract Negotiation", "Estágio", "Negociação contratual em curso."],
        ["Contract Signed", "Estágio", "Contrato assinado - meta principal."],
        ["Construction / Obra", "Estágio", "Obra em andamento - via Builder."],
        ["Opening", "Estágio", "Loja inaugurada."],
        ["Ramp-up", "Estágio", "Loja em ramp-up (primeiros 6 meses)."],
        ["Performance Review", "Estágio", "Revisão pós-ramp-up."],
        ["Lost / Parked", "Estágio", "Oportunidade perdida ou pausada."],
        ["ALTA", "Prioridade", "Foco máximo - sponsor + reunião semanal."],
        ["MÉDIA", "Prioridade", "Pipeline ativo - reunião quinzenal."],
        ["BAIXA", "Prioridade", "Mantém em pipeline sem cadência ativa."],
        ["AUSENTE", "Status Plaza", "Confirmada NÃO presente no Plaza - elegível."],
        ["n.v. - verificar duplicidade", "Status Plaza", "Não verificado. Cruzar com Mix Atual."],
        ["JÁ EXISTE - descartar", "Status Plaza", "Já presente. Descartar."],
        ["Cluster Fit (0-100)", "Score", "0-40: baixo | 41-70: aceitável | 71-85: forte | 86-100: estratégico"],
        ["Probabilidade %", "Score", "Probabilidade subjetiva de fechamento."],
        ["ABL", "Métrica", "Área Bruta Locável em m²."],
        ["EV", "Papel", "Executivo Comercial - dono do shopping."],
        ["KA Expansion", "Papel", "Relaciona com cadeias e franquias nacionais."],
        ["Street Converter", "Papel", "Converte operadores de rua para shopping."],
        ["Hunter", "Papel", "Prospecta marcas inovadoras raio 2-50km."],
        ["Farmer", "Papel", "Cultiva relacionamento com investidores."],
        ["Workflow 1", "Conceito", "Vacancy-to-Contract Sprint."],
        ["Cluster Entretenimento", "Conceito", "Plaza Niterói. Batalhas: Entretenimento, Gastronomia, Lojas."],
    ]

    for i, row in enumerate(glossario, start=4):
        for col_idx, val in enumerate(row, 1):
            cell = ws.cell(row=i, column=col_idx, value=val)
            cell.font = FT_B
            cell.alignment = AL
            cell.border = BD
            if i % 2 == 0:
                cell.fill = FL_A

    for col, w in {"A": 30, "B": 16, "C": 70}.items():
        ws.column_dimensions[col].width = w
    ws.freeze_panes = "A4"

    return wb


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"[*] Carregando dados de {DATA_DIR}...")
    pipeline = load_pipeline()
    mix = load_mix()
    print(f"[*] {len(pipeline)} oportunidades, {len(mix.get('marcas', []))} marcas atuais")

    print(f"[*] Construindo planilha...")
    wb = build_workbook(pipeline, mix)

    print(f"[*] Salvando em {OUT_FILE}...")
    wb.save(OUT_FILE)
    print(f"[OK] Planilha gerada: {OUT_FILE}")
    print(f"[*] Abas: {wb.sheetnames}")
    print()
    print("Próximo passo: rode a recalculação das fórmulas (opcional):")
    print(f"  python /mnt/skills/public/xlsx/scripts/recalc.py {OUT_FILE}")


if __name__ == "__main__":
    main()
