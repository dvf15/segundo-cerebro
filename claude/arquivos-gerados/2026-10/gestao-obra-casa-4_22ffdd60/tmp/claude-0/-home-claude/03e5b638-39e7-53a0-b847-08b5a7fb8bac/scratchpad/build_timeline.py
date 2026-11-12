# -*- coding: utf-8 -*-
"""Linha do tempo - Obra Daniel e Renata (rev. 21/10/2026)"""
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                TableStyle, KeepTogether)

OUT = "/home/claude/Linha_do_tempo_Obra_Daniel_Renata_rev2.pdf"

INK = colors.HexColor("#1f2937")
MUTED = colors.HexColor("#6b7280")
LINE = colors.HexColor("#e5e7eb")
ERR_BG = colors.HexColor("#fde8e8")
ERR_TAG = colors.HexColor("#c0392b")
INFO_BG = colors.HexColor("#f3f4f6")
INFO_TAG = colors.HexColor("#6b7280")
STAT_BG = colors.HexColor("#f3f4f6")

H1 = ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=16, leading=20, textColor=INK)
SUB = ParagraphStyle("sub", fontName="Helvetica", fontSize=8, leading=11, textColor=MUTED)
H2 = ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=12, leading=15, textColor=INK, spaceBefore=6)
BODY = ParagraphStyle("body", fontName="Helvetica", fontSize=7.6, leading=10, textColor=INK)
SMALL = ParagraphStyle("small", fontName="Helvetica", fontSize=6.8, leading=9, textColor=MUTED)
DATE = ParagraphStyle("date", fontName="Helvetica-Bold", fontSize=7.6, leading=10, textColor=INK)
TAG_E = ParagraphStyle("tage", fontName="Helvetica-Bold", fontSize=6.5, leading=8, textColor=colors.white, alignment=1)
TAG_I = ParagraphStyle("tagi", fontName="Helvetica-Bold", fontSize=6.5, leading=8, textColor=colors.white, alignment=1)
STAT_L = ParagraphStyle("statl", fontName="Helvetica-Bold", fontSize=7, leading=9, textColor=INK)
STAT_V = ParagraphStyle("statv", fontName="Helvetica", fontSize=7.6, leading=10, textColor=INK)
PAT_K = ParagraphStyle("patk", fontName="Helvetica-Bold", fontSize=7.6, leading=10, textColor=INK)

def tag(kind):
    if kind == "ERRO":
        t = Table([[Paragraph("ERRO", TAG_E)]], colWidths=[11*mm], rowHeights=[4.2*mm])
        t.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,-1), ERR_TAG), ("VALIGN", (0,0), (-1,-1), "MIDDLE")]))
    else:
        t = Table([[Paragraph("INFO", TAG_I)]], colWidths=[11*mm], rowHeights=[4.2*mm])
        t.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,-1), INFO_TAG), ("VALIGN", (0,0), (-1,-1), "MIDDLE")]))
    return t

# (data, tipo, texto)  — texto aceita <b>
EVENTS = [
    ("19/jun (sex)", "ERRO", "13:32 - Biel alerta Roberto Salvador: alturas da churrasqueira estranhas (sóculo baixo, muretas altas demais). <b>Detectado pelo Biel, não pela gerenciadora.</b>"),
    ("", "INFO", "Staccato (pedido GABR-260305) programa entrega para 26/06 e pede dados de logística."),
    ("21/jun (dom)", "INFO", "Renata envia à Jaqueline os comprovantes de pagamento - pagamentos em dia."),
    ("26/jun (sex)", "ERRO", "14:42 - Biel confirma, após visita de 25/06 com Jaqueline: alturas da base da parrilha e dos dois sóculos <b>incorretas</b>. Pede correção e instalação do refratário antes da medição da pedra."),
    ("20/jul (seg)", "ERRO", "Daniel pede as medidas finais da churrasqueira. Roberto responde que o colocador \"não parou lá pra fazer a churrasqueira\" e que ainda fará os refratários. <b>Quase 4 semanas após o apontamento, a correção não estava concluída.</b>"),
    ("", "ERRO", "Medição do mármore marcada para 21/jul (3ª semana), não para a 1ª semana prevista. Atraso já visível e não comunicado como impacto no prazo."),
    ("Semana de 20/jul", "ERRO", "<b>Semana com a maior concentração de erros de execução civil</b>, constatados na medição inicial da Staccato. Itens executados fora do projeto e refeitos: "
        "(1) <b>floreira</b> ao lado da churrasqueira ignorada; "
        "(2) <b>piso da cozinha</b> na paginação errada; "
        "(3) <b>civil da churrasqueira</b> executada errada; "
        "(4) <b>nicho da TV</b> executado errado; "
        "(5) <b>descida em cascata da cozinha</b> executada com 15 cm em vez de 10 cm. "
        "<b>Com muitos itens de civil errados na medição inicial, o projeto das pedras foi impactado.</b>"),
    ("29/jul (qua)", "ERRO", "Micher informa que a Staccato voltou à casa no dia anterior (28/jul) porque faltaram medidas na visita anterior."),
    ("", "ERRO", "Renata pergunta se está tudo no prazo. Micher: \"Me passaram que sim. Que vão correr para não termos impacto.\""),
    ("~03/ago", "ERRO", "Na obra, Daniel é informado de que o cronograma estava dentro do prazo (citado na mensagem de Daniel de 17/ago)."),
    ("04/ago", "INFO", "Recebimento do projeto das pedras (segundo Jaqueline)."),
    ("15/ago (sáb)", "INFO", "12:57 - Daniel pergunta se a entrega de dezembro está mantida. Sem resposta no dia."),
    ("17/ago (seg)", "INFO", "13:13 - Daniel cobra novamente. Jaqueline: \"atualizando desde de manhã\"."),
    ("", "INFO", "17:34 - Envio do Cronograma Obra Daniel e Renata Rev.02."),
    ("", "ERRO", "17:37 - Gerenciadora assume <b>atraso de ~10 semanas</b>: medição das bancadas +2 sem (plano de medir \"em duas partes\" inviável); projeto das pedras +4 sem (ajustes a resolver em obra, nova medição); gabinetes +2 sem (60 dias úteis após bancadas); lixamento do piso +1 sem (duas fases); Carnaval +1 sem."),
    ("", "INFO", "17:39 - Proposta de negociar prazos: Staccato de 35 para 20 dias úteis; marcenaria para 40 dias úteis. Pedem que os clientes também cobrem os fornecedores."),
    ("", "INFO", "18:04 - Daniel classifica como inaceitável e solicita reunião urgente."),
]

PATTERNS = [
    ("1. Retrabalho", "Churrasqueira executada fora do projeto; na semana de 20/jul, cinco itens de civil refeitos (floreira, piso da cozinha, civil da churrasqueira, nicho da TV, descida em cascata com 15 cm em vez de 10 cm); medição da pedra incompleta, exigindo retorno da Staccato."),
    ("2. Planejamento", "Premissas previsíveis ausentes do cronograma original: medição só com ambiente 100% revestido, Carnaval, lixamento em duas fases, prazo de 60 dias úteis dos gabinetes."),
    ("3. Comunicação", "Atraso da medição visível desde 20/jul; ainda assim informado \"dentro do prazo\" até ~03/ago. Impacto revelado apenas em 17/ago, após duas cobranças do cliente."),
    ("4. Responsabilidade", "Gerenciadora solicita que o cliente ajude a cobrar fornecedores - atribuição contratada do gerenciamento. Os \"ajustes a resolver em obra\" citados em 17/ago para o projeto das pedras coincidem com os erros de civil da semana de 20/jul."),
]

RESSALVAS = [
    "- Não estão nos prints a resposta de Roberto a Biel (26/jun) nem as mensagens entre 26/jun e 20/jul, que podem trazer contexto adicional.",
    "- Os cinco itens da semana de 20/jul vêm do relato de Daniel (21/10/2026); anexar fotos e mensagens do período para documentá-los.",
    "- Com +10 semanas, a entrega estimada passaria para fevereiro-março/2027 (estimativa; o dia previsto em dezembro não é conhecido).",
    "- A soma dos impactos (2+4+2+1+1) fecha com as ~10 semanas informadas, mas não é possível verificar sobreposições no cronograma Rev.02.",
]

def build():
    doc = SimpleDocTemplate(OUT, pagesize=A4, leftMargin=16*mm, rightMargin=16*mm,
                            topMargin=14*mm, bottomMargin=14*mm,
                            title="Linha do tempo - Obra Daniel e Renata", author="Daniel Vieira de Freitas")
    W = A4[0] - 32*mm
    story = []
    story.append(Paragraph("Linha do tempo - Obra Daniel e Renata", H1))
    story.append(Paragraph("Histórico do grupo GE-Salvador+Bambu+Renata (jun-ago/2026), com destaque para erros de execução e de gestão. Elaborado em 19/10/2026; revisado em 21/10/2026 com os erros de civil da semana de 20/jul.", SUB))
    story.append(Spacer(1, 5*mm))

    stats = [[Paragraph("Atraso assumido", STAT_L), Paragraph("Erros registrados", STAT_L), Paragraph("Refações civis", STAT_L), Paragraph("Entrega original", STAT_L)],
             [Paragraph("~10 semanas", STAT_V), Paragraph("9 ocorrências", STAT_V), Paragraph("5 itens (semana de 20/jul)", STAT_V), Paragraph("dezembro/2026", STAT_V)]]
    st = Table(stats, colWidths=[W/4]*4)
    st.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,-1), STAT_BG), ("BOX", (0,0), (-1,-1), 0.5, LINE),
                            ("LINEAFTER", (0,0), (-2,-1), 0.5, colors.white),
                            ("TOPPADDING", (0,0), (-1,-1), 4), ("BOTTOMPADDING", (0,0), (-1,-1), 4),
                            ("LEFTPADDING", (0,0), (-1,-1), 6)]))
    story.append(st)
    story.append(Spacer(1, 5*mm))
    story.append(Paragraph("Cronologia", H2))
    story.append(Spacer(1, 2*mm))

    rows, styles = [], [("VALIGN", (0,0), (-1,-1), "TOP"), ("LEFTPADDING", (0,0), (-1,-1), 5),
                        ("RIGHTPADDING", (0,0), (-1,-1), 5), ("TOPPADDING", (0,0), (-1,-1), 4),
                        ("BOTTOMPADDING", (0,0), (-1,-1), 4)]
    for i, (d, k, txt) in enumerate(EVENTS):
        rows.append([Paragraph(d, DATE), tag(k), Paragraph(txt, BODY)])
        styles.append(("BACKGROUND", (2,i), (2,i), ERR_BG if k == "ERRO" else INFO_BG))
        styles.append(("LINEBELOW", (0,i), (-1,i), 0.4, colors.white))
    t = Table(rows, colWidths=[28*mm, 15*mm, W-43*mm], repeatRows=0)
    t.setStyle(TableStyle(styles))
    story.append(t)

    story.append(Spacer(1, 6*mm))
    prow = [[Paragraph(k, PAT_K), Paragraph(v, BODY)] for k, v in PATTERNS]
    pt = Table(prow, colWidths=[32*mm, W-32*mm])
    pt.setStyle(TableStyle([("VALIGN", (0,0), (-1,-1), "TOP"), ("LINEBELOW", (0,0), (-1,-2), 0.4, LINE),
                            ("TOPPADDING", (0,0), (-1,-1), 4), ("BOTTOMPADDING", (0,0), (-1,-1), 4),
                            ("LEFTPADDING", (0,0), (-1,-1), 0)]))
    story.append(KeepTogether([Paragraph("Padrões identificados", H2), Spacer(1, 2*mm), pt]))

    story.append(Spacer(1, 6*mm))
    story.append(Paragraph("Ressalvas", H2))
    story.append(Spacer(1, 1.5*mm))
    for r in RESSALVAS:
        story.append(Paragraph(r, SMALL))
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph("Fonte: capturas de tela do grupo de WhatsApp GE-Salvador+Bambu+Renata (19/06/2026 a 17/08/2026) e relato de Daniel (21/10/2026) sobre a semana de 20/jul.", SMALL))

    def footer(canvas, doc_):
        canvas.saveState()
        canvas.setFont("Helvetica", 7); canvas.setFillColor(MUTED)
        canvas.drawRightString(A4[0]-16*mm, 8*mm, "Página %d" % doc_.page)
        canvas.restoreState()
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print("ok", OUT)

if __name__ == "__main__":
    build()
