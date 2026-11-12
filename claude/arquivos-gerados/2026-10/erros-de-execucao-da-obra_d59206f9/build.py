from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import mm

RED = colors.HexColor("#B42318")
REDBG = colors.HexColor("#FDECEA")
GRAY = colors.HexColor("#667085")
GRAYBG = colors.HexColor("#F2F4F7")
DARK = colors.HexColor("#101828")

H1 = ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=18, leading=22, textColor=DARK, spaceAfter=4)
SUB = ParagraphStyle("sub", fontName="Helvetica", fontSize=9.5, leading=13, textColor=GRAY, spaceAfter=10)
H2 = ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=13, leading=16, textColor=DARK, spaceBefore=12, spaceAfter=6)
BODY = ParagraphStyle("b", fontName="Helvetica", fontSize=9.5, leading=13, textColor=DARK)
DATE = ParagraphStyle("d", fontName="Helvetica-Bold", fontSize=9.5, leading=12, textColor=DARK)
TAGR = ParagraphStyle("tr", fontName="Helvetica-Bold", fontSize=7.5, leading=9, textColor=colors.white, alignment=1)
TAGG = ParagraphStyle("tg", fontName="Helvetica-Bold", fontSize=7.5, leading=9, textColor=GRAY, alignment=1)
SMALL = ParagraphStyle("s", fontName="Helvetica", fontSize=8.5, leading=11.5, textColor=GRAY)

E, C = "ERRO", "CONTEXTO"

events = [
 ("19/jun (sex)", [
   (E, "<b>13:32</b> - Biel alerta Roberto Salvador: alturas da churrasqueira estranhas (sóculo baixo, muretas altas demais). <b>Detectado pelo Biel, não pela gerenciadora.</b>"),
   (C, "Staccato (pedido GABR-260305) programa entrega para 26/06 e pede dados de logística."),
 ]),
 ("21/jun (dom)", [
   (C, "Renata envia à Jaqueline os comprovantes de pagamento - pagamentos em dia."),
 ]),
 ("26/jun (sex)", [
   (E, "<b>14:42</b> - Biel confirma, após visita de 25/06 com Jaqueline: alturas da base da parrilha e dos dois sóculos <b>incorretas</b>. Pede correção e instalação do refratário antes da medição da pedra."),
 ]),
 ("20/jul (seg)", [
   (E, "Daniel pede as medidas finais da churrasqueira. Roberto responde que o colocador \"não parou lá pra fazer a churrasqueira\" e que ainda fará os refratários. <b>Quase 4 semanas após o apontamento, a correção não estava concluída.</b>"),
   (E, "Medição do mármore marcada para 21/jul (3ª semana), não para a 1ª semana prevista. <b>Atraso já visível e não comunicado como impacto no prazo.</b>"),
 ]),
 ("Data não visível (prov. fim jul / início ago)", [
   (E, "Micher informa que a Staccato voltou à casa porque <b>faltaram medidas</b> na visita anterior."),
   (E, "Renata pergunta se está tudo no prazo. Micher: \"Me passaram que sim. Que vão correr para não termos impacto.\""),
 ]),
 ("~03/ago", [
   (E, "Na obra, Daniel é informado de que o cronograma estava dentro do prazo (citado na mensagem de Daniel de 17/ago)."),
 ]),
 ("04/ago", [
   (C, "Recebimento do projeto das pedras (segundo Jaqueline)."),
 ]),
 ("15/ago (sáb)", [
   (C, "<b>12:57</b> - Daniel pergunta se a entrega de dezembro está mantida. Sem resposta no dia."),
 ]),
 ("17/ago (seg)", [
   (C, "<b>13:13</b> - Daniel cobra novamente. Jaqueline: \"atualizando desde de manhã\"."),
   (C, "<b>17:34</b> - Envio do Cronograma Obra Daniel e Renata Rev.02."),
   (E, "<b>17:37</b> - Gerenciadora assume <b>atraso de ~10 semanas</b>: medição das bancadas +2 sem (plano de medir \"em duas partes\" inviável); projeto das pedras +4 sem (ajustes a resolver em obra, nova medição); gabinetes +2 sem (60 dias úteis após bancadas); lixamento do piso +1 sem (duas fases); Carnaval +1 sem."),
   (C, "<b>17:39</b> - Proposta de negociar prazos: Staccato de 35 para 20 dias úteis; marcenaria para 40 dias úteis. Pedem que os clientes também cobrem os fornecedores."),
   (C, "<b>18:04</b> - Daniel classifica como inaceitável e solicita reunião urgente."),
 ]),
]

def tag(kind):
    if kind == E:
        return Paragraph("ERRO", TAGR), REDBG, RED
    return Paragraph("CONTEXTO", TAGG), GRAYBG, GRAYBG

story = [
  Paragraph("Linha do tempo - Obra Daniel e Renata", H1),
  Paragraph("Histórico do grupo GE-Salvador+Bambu+Renata (jun-ago/2026), com destaque para erros de execução e de gestão. Elaborado em 19/10/2026.", SUB),
]

summary = Table([[
  Paragraph("<b>Atraso assumido</b><br/>~10 semanas", BODY),
  Paragraph("<b>Erros registrados</b><br/>%d ocorrências" % sum(1 for _, it in events for k, _ in it if k == E), BODY),
  Paragraph("<b>Entrega original</b><br/>dezembro/2026", BODY),
]], colWidths=[58*mm]*3)
summary.setStyle(TableStyle([
  ("BACKGROUND", (0,0), (-1,-1), GRAYBG), ("BOX", (0,0), (-1,-1), 0, GRAYBG),
  ("LEFTPADDING", (0,0), (-1,-1), 8), ("TOPPADDING", (0,0), (-1,-1), 7), ("BOTTOMPADDING", (0,0), (-1,-1), 7),
  ("LINEAFTER", (0,0), (1,0), 1, colors.white),
]))
story += [summary, Paragraph("Cronologia", H2)]

for date, items in events:
    rows, styles = [], [("VALIGN", (0,0), (-1,-1), "TOP"),
                        ("LEFTPADDING", (0,0), (-1,-1), 5), ("RIGHTPADDING", (0,0), (-1,-1), 5),
                        ("TOPPADDING", (0,0), (-1,-1), 5), ("BOTTOMPADDING", (0,0), (-1,-1), 5),
                        ("LINEBELOW", (0,-1), (-1,-1), 0.5, colors.HexColor("#D0D5DD"))]
    for i, (k, txt) in enumerate(items):
        t, bg, tagbg = tag(k)
        rows.append([Paragraph(date, DATE) if i == 0 else "", t, Paragraph(txt, BODY)])
        styles.append(("BACKGROUND", (1,i), (1,i), tagbg))
        if k == E:
            styles.append(("BACKGROUND", (2,i), (2,i), bg))
    tb = Table(rows, colWidths=[34*mm, 18*mm, 122*mm])
    tb.setStyle(TableStyle(styles))
    story.append(KeepTogether(tb))

story.append(Paragraph("Padrões identificados", H2))
patterns = [
 ("Retrabalho", "Churrasqueira executada fora do projeto; medição da pedra incompleta, exigindo retorno da Staccato."),
 ("Planejamento", "Premissas previsíveis ausentes do cronograma original: medição só com ambiente 100% revestido, Carnaval, lixamento em duas fases, prazo de 60 dias úteis dos gabinetes."),
 ("Comunicação", "Atraso da medição visível desde 20/jul; ainda assim informado \"dentro do prazo\" até ~03/ago. Impacto revelado apenas em 17/ago, após duas cobranças do cliente."),
 ("Responsabilidade", "Gerenciadora solicita que o cliente ajude a cobrar fornecedores - atribuição contratada do gerenciamento."),
]
pt = Table([[Paragraph("<b>%d. %s</b>" % (i+1, a), BODY), Paragraph(b, BODY)] for i, (a, b) in enumerate(patterns)],
           colWidths=[38*mm, 136*mm])
pt.setStyle(TableStyle([("VALIGN", (0,0), (-1,-1), "TOP"), ("LINEBELOW", (0,0), (-1,-1), 0.5, colors.HexColor("#D0D5DD")),
                        ("TOPPADDING", (0,0), (-1,-1), 6), ("BOTTOMPADDING", (0,0), (-1,-1), 6)]))
story.append(pt)

story.append(Paragraph("Ressalvas", H2))
for r in [
 "A data das mensagens sobre o retorno da Staccato não aparece nos prints; a posição na cronologia é estimada.",
 "Não estão nos prints a resposta de Roberto a Biel (26/jun) nem as mensagens entre 26/jun e 20/jul, que podem trazer contexto adicional.",
 "Com +10 semanas, a entrega estimada passaria para fevereiro-março/2027 (estimativa; o dia previsto em dezembro não é conhecido).",
 "A soma dos impactos (2+4+2+1+1) fecha com as ~10 semanas informadas, mas não é possível verificar sobreposições no cronograma Rev.02.",
]:
    story.append(Paragraph("- " + r, SMALL))
    story.append(Spacer(1, 3))

story.append(Spacer(1, 8))
story.append(Paragraph("Fonte: capturas de tela do grupo de WhatsApp GE-Salvador+Bambu+Renata (19/06/2026 a 17/08/2026).", SMALL))

def footer(c, d):
    c.setFont("Helvetica", 8); c.setFillColor(GRAY)
    c.drawRightString(A4[0]-18*mm, 10*mm, "Página %d" % d.page)

doc = SimpleDocTemplate("Linha_do_tempo_Obra_Daniel_Renata.pdf", pagesize=A4,
                        leftMargin=18*mm, rightMargin=18*mm, topMargin=16*mm, bottomMargin=16*mm,
                        title="Linha do tempo - Obra Daniel e Renata")
doc.build(story, onFirstPage=footer, onLaterPages=footer)
