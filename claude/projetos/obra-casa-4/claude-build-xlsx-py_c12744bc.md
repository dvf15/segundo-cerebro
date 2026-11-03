---
title: "claude/build_xlsx.py"
date: 2026-09-29
source: "claude-project-doc"
source_id: "c12744bc-5f59-4cb7-a41f-d2caddae7133"
project: "Obra Casa 4"
tags: ["claude", "projeto", "conhecimento"]
---
# claude/build_xlsx.py

# -*- coding: utf-8 -*-
"""Gera Obra_Casa4_Acompanhamento_Cenarios.xlsx — acompanhamento financeiro editável com simulação de cenários."""
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

ARIAL = "Arial"
F_TIT = Font(name=ARIAL, size=14, bold=True)
F_SEC = Font(name=ARIAL, size=11, bold=True)
F_HDR = Font(name=ARIAL, size=10, bold=True, color="FFFFFF")
F_TXT = Font(name=ARIAL, size=10)
F_INPUT = Font(name=ARIAL, size=10, color="0000FF")
F_FORM = Font(name=ARIAL, size=10)
F_LINK = Font(name=ARIAL, size=10, color="008000")
F_MUT = Font(name=ARIAL, size=9, italic=True, color="808080")
FILL_HDR = PatternFill("solid", fgColor="2A78D6")
FILL_YEL = PatternFill("solid", fgColor="FFFF00")
FILL_GRAY = PatternFill("solid", fgColor="F0EFEC")
FILL_TOT = PatternFill("solid", fgColor="DCE9F9")
THIN = Border(*[Side(style="thin", color="D0D0D0")]*4)
BRL = 'R$ #,##0.00;[Red](R$ #,##0.00);"-"'
PCT = '0.0%'
CENTER = Alignment(horizontal="center", vertical="center")

DATA = "30/10/2026"

wb = openpyxl.Workbook()

def sec(ws, cell, txt):
    ws[cell] = txt; ws[cell].font = F_SEC

def hdr_row(ws, row, cols, start=1):
    for i, h in enumerate(cols):
        c = ws.cell(row=row, column=start+i, value=h)
        c.font = F_HDR; c.fill = FILL_HDR; c.border = THIN
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

def put(ws, row, col, val, font=F_TXT, fmt=None, fill=None, border=True):
    c = ws.cell(row=row, column=col, value=val)
    c.font = font
    if fmt: c.number_format = fmt
    if fill: c.fill = fill
    if border: c.border = THIN
    return c

# ============ ABA: Leia-me ============
lm = wb.active; lm.title = "Leia-me"
lm["B2"] = "Obra Casa 4 Palm Hill — Acompanhamento Financeiro e Simulação de Cenários"; lm["B2"].font = F_TIT
lm["B3"] = f"Dados conciliados até {DATA} (orçamento R01 de 02/04/26 × comprovantes das pastas 2025/2026; cronograma Rev.04A / aditivo Fratelli)."; lm["B3"].font = F_MUT
rows = [
    ("", ""),
    ("Como usar:", ""),
    ("Azul", "Célula de ENTRADA — edite à vontade (valores pagos, contratados, alavancas de cenário)."),
    ("Preto", "Fórmula — recalcula sozinha; evite sobrescrever."),
    ("Verde", "Link para outra aba — não editar."),
    ("Fundo amarelo", "Alavancas de simulação e células-chave a preencher."),
    ("", ""),
    ("Abas:", ""),
    ("Resumo", "Totalizadores da obra (tudo por fórmula)."),
    ("Fluxo_Caixa", "Resumo do caixa + desembolso mês a mês (realizado × previsto até mar/27)."),
    ("Itens", "Um item do orçamento por linha. Atualize 'Pago' e 'Faturado' quando houver novos comprovantes."),
    ("Nao_Orcados", "Gastos fora da proposta civil (projetos, pré-obra)."),
    ("Pagamentos", "Registro dos pagamentos comprovados (adicione novas linhas no fim)."),
    ("Agenda", "Desembolsos futuros já contratados, com datas."),
    ("Cartoes", "Fluxo mês a mês das parcelas de cartão por vir + total geral por vir."),
    ("Cenarios", "Simulação: mexa nas alavancas amarelas (linhas 5–6) ou sobrescreva o saldo de qualquer item nos 3 cenários."),
    ("", ""),
    ("Critério 'Pago':", "só valores com comprovante de liquidação (Pix, cartão aprovado, recibo). NF/boleto sem comprovante = coluna 'Faturado a confirmar'. Exceções lançadas por confirmação expressa do Daniel: Bracci (28/09), Staccato 4º boleto (23/10), Piso Piso (30/10)."),
]
r = 4
for a, b in rows:
    lm.cell(row=r, column=2, value=a).font = F_SEC if a.endswith(":") else (F_INPUT if a=="Azul" else F_TXT)
    if a == "Verde": lm.cell(row=r, column=2).font = F_LINK
    if a == "Fundo amarelo": lm.cell(row=r, column=2).fill = FILL_YEL
    lm.cell(row=r, column=3, value=b).font = F_TXT
    r += 1
lm.column_dimensions["B"].width = 34; lm.column_dimensions["C"].width = 110

# ============ ABA: Itens ============
it = wb.create_sheet("Itens")
itens = [
    ("Marcenaria — Unimóveis (Francisco)", 342000.00, 320000.00, 276000.00, 0, "Sinal 100k + 5×44k; pagas sinal + parc.1–4 (parc.4 Pix 20/08); parc.5 (~21/09) venceu — comprovante a confirmar. Instalação prevista fev/27 (Rev.04A)"),
    ("Civil / Reforma — Fratelli (Salvador Arq.)", 363106.86, None, 272330.16, 0, "Pagas parc.1–6 (parc.6 Pix 28/09, NF pendente); aditivo (Rev.04A): parc. 7 em fev/27 e parc. 8 em mar/27 — saldo 90.776,70 (aditivo ainda não assinado)"),
    ("Marmoraria — Staccato", 157700.00, 130640.00, 130640.00, 0, "4 boletos de 32.660 pagos (29/04, 29/06, 28/07 e 28/08 — o 4º confirmado pelo Daniel em 23/10, sem comprovante na pasta). Pedidos somam 163.300 (5×32.660) × contratado 130.640: diferença 32.660 a conferir"),
    ("Gerenciamento (10%) — Fratelli", 98756.19, None, 68862.59, 0, "Parc.1–6 pagas (parc.5 13.636,10 em 04/09; parc.6 3.925,23 em 06/10; NFs das parc.5 e 6 pendentes). Saldo: 29.893,60 (estendido até a entrega, mar/27)"),
    ("Caixilhos — Alucustom (Inovar)", 37600.00, 62000.00, 48568.00, 0, "Parc.1–3 pagas; parc.4 (13.432) venceu 20/08 — comprovante a confirmar. Possível +9.500 (5ª parcela 20/09) fora da projeção"),
    ("Impermeabilização cobertura — TJK", 27784.00, 29284.00, 29284.00, 0, "4 Pix = NF-263 quitada"),
    ("Equip. gourmet / churrasqueira — Caixa de Fogo", 36012.00, None, 8272.00, 0, "Pix 1.000 + cartão 7.272 (10×)"),
    ("Casa de máquinas piscina — Hidrauli + tampão + bomba", 39695.00, 38920.00, 38920.00, 0, "Pedido 56760 (C6 10×) + tampão 80×80 2.665 (C6 4×, 20/08; NF-e 2599) + bomba Eberle 1/3 cv 1.255,00 (C6 4×, 13/10; NF-e 2705; proposta 17728)"),
    ("Ar-condicionado — Lino Ar + BHP", 22160.00, 15940.00, 4370.00, 11570.00, "NF-123.110 BHP (13.000) arquivada; saldo 11.570 em 5× cartão até set/26"),
    ("Porcelanatos e revestimentos — Portobello/Staccato/Telhanorte", 33686.54, None, 38852.03, 0, "Portobello 8.527,12 + Telhanorte 9.687,68 (Itaú 8×, 24/05 — extrato do cartão arquivado 26/09; cupom era 9.340,92) + Staccato rev. 15.280,51 + Portobello Gabriel 4.970,47 + pastilhas 386,25. ESTOURA o orçado em 5.165,49"),
    ("Louças e metais (Bracci + Franke/Deca/ML/Leroy)", 49658.04, None, 30301.02, 3289.88, "Bracci 23.660,15 (Getnet 6× de 3.943,36, 27/07) + Franke/ML/Deca pagos; Leroy Merlin 3.289,88 (8×, pedido 30/07) aguardando aprovação"),
    ("Serralherias e complementos — Márcio", 22000.00, None, 16604.50, 0, "Pago 16.604,50 (Pix 10/08); NFS-e 7 do Márcio Alessandro (13/08) arquivada"),
    ("Acabamentos elétricos — Andra + ML (materiais)", 6000.00, None, 7518.86, 0, "Andra P22621 6.240 (3×, 26/08) + Andra loja 394,28 (NFC-e 33985, 17/09) + Schneider/Mercado Livre 884,58 (Visa 1×, 18/09; NF-e pendente). Verba estourada em 1.518,86"),
    ("Aquecimento da casa — Hidrauli", 990.00, 5895.00, 0, 5895.00, "Proposta 16486 (20/05): produtos 3.595 (NF-e 2220) + MO 2.300 (NFS-e 697) = 5.895 em 8× no cartão; pedido 57035 (NF-e mostra 57045 — conferir); escopo maior que o orçado"),
    ("Reforço com vigas — PS Serralheria", 6300.00, 6000.00, 0, 6000.00, "NF-151 em 3× no cartão"),
    ("Laudo / projeto estrutural — R. Moralez", 3000.00, 3070.00, 3070.00, 0, "Quitado (Pix 08/04 + NFS-e 212)"),
    ("Deck Cumaru 7x2 — Piso Piso Arte", 31471.40, 38485.00, 38485.00, 0, "PAGO 07/08 (SumUp 5× de 7.697); NFS-e 316 (24/08) arquivada"),
    ("Itens omissos (5%)", 66032.42, None, 0, 0, "Verba de contingência do orçamento"),
    ("Iluminação — Andra + Yamamura + LED marceneiro", 28876.35, None, 11152.24, 0, "LED do marceneiro 1.707,70 (Cielo 6×, 06/10) + P23432: 7.562,44 em 6× Cielo (03/09) + Yamamura pedido 6784994: 1.882,10 em 24/09 (Visa 1.017,91 + vale-crédito 864,19; NFC-e 14700). Orçamento Yamamura 23.636 segue em análise (estouraria ~5.912)"),
    ("Restauração piso de madeira, escada e adequações do deck — Piso Piso Arte", 28845.96, 24730.00, 24730.00, 0, "NFS-e 319. Pago em 27/10: 23.900 no cartão 4× (divisão inferida; confirmado pelo Daniel em 30/10) + 830 SumUp (complemento: a cobrança anterior saiu errada). Sem comprovante da cobrança 4× na pasta"),
    ("Cortinas e persianas — Persol", 23467.50, None, 0, 0, ""),
    ("Box dos banheiros — Danglass", 16000.00, None, 0, 0, ""),
    ("Limpeza fina de obra", 12000.00, None, 0, 0, ""),
    ("Itens de marcenaria à parte (verbas)", 9300.00, None, 0, 0, ""),
    ("Corrimão escada — Anderson", 5700.00, None, 0, 0, ""),
    ("Piso emborrachado academia", 5582.73, None, 0, 0, "Proposta Aubicon ~2.930 em análise"),
    ("Serralheria interface marcenaria (verba)", 4500.00, None, 0, 0, ""),
    ("Piso intertravado garagem", 3212.00, None, 0, 0, ""),
    ("Instalação equipamentos cozinha/gourmet", 2500.00, None, 0, 0, ""),
    ("Varal de teto (verba)", 1500.00, None, 0, 0, ""),
]
it["A1"] = "Itens do orçamento (proposta civil R01)"; it["A1"].font = F_TIT
hdr_row(it, 3, ["Item", "Orçado R01", "Contratado", "Base (contratado ou orçado)", "Pago (comprovado)", "Faturado a confirmar", "Saldo a pagar", "% exec.", "Status", "Observações"])
r0 = 4
for i, (nome, orc, contr, pago, fat, obs) in enumerate(itens):
    r = r0 + i
    put(it, r, 1, nome)
    put(it, r, 2, orc, F_INPUT, BRL)
    put(it, r, 3, contr if contr else None, F_INPUT, BRL)
    put(it, r, 4, f'=IF(C{r}>0,C{r},B{r})', F_FORM, BRL)
    put(it, r, 5, pago, F_INPUT, BRL)
    put(it, r, 6, fat, F_INPUT, BRL)
    put(it, r, 7, f'=D{r}-E{r}-F{r}', F_FORM, BRL)
    put(it, r, 8, f'=IF(D{r}=0,0,(E{r}+F{r})/D{r})', F_FORM, PCT)
    put(it, r, 9, f'=IF(G{r}<=0.01,"Concluído",IF(E{r}+F{r}>0,"Em andamento",IF(C{r}>0,"Contratado","Não iniciado")))', F_FORM)
    put(it, r, 10, obs, F_MUT)
rT = r0 + len(itens)
put(it, rT, 1, "TOTAL", F_SEC, fill=FILL_TOT)
for col in "BCDEFG":
    put(it, rT, {"B":2,"C":3,"D":4,"E":5,"F":6,"G":7}[col],
        f'=SUM({col}{r0}:{col}{rT-1})', Font(name=ARIAL, size=10, bold=True), BRL, FILL_TOT)
put(it, rT, 8, f'=(E{rT}+F{rT})/D{rT}', Font(name=ARIAL, size=10, bold=True), PCT, FILL_TOT)
widths = [46, 14, 14, 16, 15, 15, 14, 8, 13, 60]
for i, w in enumerate(widths): it.column_dimensions[get_column_letter(i+1)].width = w
it.freeze_panes = "B4"
N_IT = len(itens); IT_TOT = rT

# ============ ABA: Nao_Orcados ============
no = wb.create_sheet("Nao_Orcados")
no["A1"] = "Itens não orçados e realizados (fora da proposta civil)"; no["A1"].font = F_TIT
hdr_row(no, 3, ["Item", "Pago (comprovado)", "Faturado a confirmar", "Total", "Observações"])
nao_orc = [
    ("Projeto de arquitetura — Bambu.Arq", 41600.00, 0, "4×10.400 quitado (Pix 12/11/25, 12/12/25, 12/01/26, 12/02/26)"),
    ("Elaboração de orçamentos — Fratelli", 7500.00, 7500.00, "Parc.1 paga; parc.2 só NF-477"),
    ("Levantamento de áreas — Gostudio", 2024.50, 0, "Pré-obra 2025, concluído"),
    ("Projeto luminotécnico — Letícia Brito", 2100.00, 0, "2 Pix de 1.050"),
]
for i, (nome, pago, fat, obs) in enumerate(nao_orc):
    r = 4 + i
    put(no, r, 1, nome); put(no, r, 2, pago, F_INPUT, BRL); put(no, r, 3, fat, F_INPUT, BRL)
    put(no, r, 4, f'=B{r}+C{r}', F_FORM, BRL); put(no, r, 5, obs, F_MUT)
put(no, 8, 1, "TOTAL", F_SEC, fill=FILL_TOT)
for col, cn in (("B",2),("C",3),("D",4)):
    put(no, 8, cn, f'=SUM({col}4:{col}7)', Font(name=ARIAL, size=10, bold=True), BRL, FILL_TOT)
for i, w in enumerate([42, 16, 16, 15, 60]): no.column_dimensions[get_column_letter(i+1)].width = w

# ============ ABA: Pagamentos ============
pg = wb.create_sheet("Pagamentos")
pg["A1"] = "Pagamentos comprovados (Pix, cartão aprovado, recibo)"; pg["A1"].font = F_TIT
hdr_row(pg, 3, ["Data", "Fornecedor", "Referência", "Valor"])
pagamentos = [
    ("24/09/2025", "Gostudio", "Levantamento de áreas (pré-obra)", 1026.25),
    ("24/10/2025", "Gostudio", "Levantamento de áreas (pré-obra)", 998.25),
    ("12/11/2025", "Bambu.Arq", "Projeto arquitetura — parc. 1/4", 10400.00),
    ("12/12/2025", "Bambu.Arq", "Projeto arquitetura — parc. 2/4", 10400.00),
    ("12/01/2026", "Bambu.Arq", "Projeto arquitetura — parc. 3/4", 10400.00),
    ("12/02/2026", "Bambu.Arq", "Projeto arquitetura — parc. 4/4 (quitado)", 10400.00),
    ("12/02/2026", "Fratelli", "Elaboração de orçamentos — parc. 1", 7500.00),
    ("07/04/2026", "Letícia Brito", "Projeto luminotécnico", 1050.00),
    ("08/04/2026", "R. Moralez", "Laudo estrutural (calculista)", 3070.00),
    ("20/04/2026", "Unimóveis (F. Limonta)", "Marcenaria — sinal (recibo)", 100000.00),
    ("29/04/2026", "Staccato", "Marmoraria — 1ª parcela", 32660.00),
    ("04/05/2026", "Fratelli", "Gerenciamento parc. 1 (8.289,40 + 5.809,00)", 14098.40),
    ("07/05/2026", "Caixa de Fogo", "Churrasqueira — sinal", 1000.00),
    ("16/05/2026", "Fratelli", "Reforma civil — parc. 1", 45388.36),
    ("18/05/2026", "Hidrauli", "Piscina/casa de máquinas — cartão C6 10×", 35000.00),
    ("18/05/2026", "TJK", "Impermeabilização — 1º pagamento", 8785.20),
    ("20/05/2026", "Alucustom", "Caixilhos — parc. 1 (pago por Renata)", 21700.00),
    ("20/05/2026", "Lino Ar", "Ar-condicionado — serviço", 2940.00),
    ("21/05/2026", "Unimóveis (F. Limonta)", "Marcenaria — parc. 1/5 (recibo)", 44000.00),
    ("21/05/2026", "Letícia Brito", "Projeto luminotécnico", 1050.00),
    ("22/05/2026", "Portobello", "Piso sala porcelanato — cartão 4×", 8527.12),
    ("24/05/2026", "Telhanorte (Itaú Apple Pay)", "Revestimentos — cartão 8× de 1.210,96 (cupom 9.340,92 + 346,76)", 9687.68),
    ("25/05/2026", "Staccato rev.", "Porcelanato banhos — SafraPay 5×", 15280.51),
    ("27/05/2026", "Fratelli", "Reforma civil — parc. 2 (NF-500)", 45388.36),
    ("01/06/2026", "TJK", "Impermeabilização — pagto 2", 2000.00),
    ("03/06/2026", "Caixa de Fogo (Rede)", "Churrasqueira — cartão 10×", 7272.00),
    ("04/06/2026", "Fratelli", "Gerenciamento parc. 2", 12502.30),
    ("05/06/2026", "TJK", "Impermeabilização — pagto 3", 9000.00),
    ("11/06/2026", "BHP", "Ar-condicionado — parcela NF", 1430.00),
    ("19/06/2026", "TJK", "Impermeabilização — pagto 4 (quitação NF-263)", 9498.80),
    ("19/06/2026", "Alucustom", "Caixilhos — parc. 2 (boleto venc. 20/06)", 13434.00),
    ("21/06/2026", "Unimóveis (F. Limonta)", "Marcenaria — parc. 2/5 (recibo)", 44000.00),
    ("29/06/2026", "Fratelli", "Reforma civil — parc. 3", 45388.36),
    ("29/06/2026", "Staccato", "Marmoraria — 2ª parcela (boleto)", 32660.00),
    ("03/07/2026", "Fratelli", "Gerenciamento parc. 3", 13354.78),
    ("20/07/2026", "Unimóveis (F. Limonta)", "Marcenaria — parc. 3/5", 44000.00),
    ("20/07/2026", "Alucustom", "Caixilhos — parc. 3 (boleto)", 13434.00),
    ("27/07/2026", "Fratelli", "Reforma civil — parc. 4 (NF-04 arquivada)", 45388.36),
    ("27/07/2026", "Bracci", "Louças e metais — Getnet 6× de 3.943,36", 23660.15),
    ("28/07/2026", "Staccato", "Marmoraria — 3ª parcela (boleto)", 32660.00),
    ("29/07/2026", "Loja Franke", "Cubas Franke 68x41 (2 un) — cartão 8×", 4663.92),
    ("29/07/2026", "Centro do Encanador (ML)", "Misturador monocomando — cartão 1×", 1545.09),
    ("30/07/2026", "Dexco (Deca)", "Torneira Deca parede Beta — cartão 5×", 431.86),
    ("05/08/2026", "Fratelli", "Gerenciamento parc. 4 (Pix; NF pendente)", 11345.78),
    ("07/08/2026", "Piso Piso Arte", "Deck cumaru — cartão SumUp 5× de 7.697 (NFS-e 316)", 38485.00),
    ("10/08/2026", "Mirian Virgílio da Silva", "Serralheria (Márcio) — Pix (NFS-e 7)", 16604.50),
    ("19/08/2026", "Pastilhas piscina (e-commerce)", "Pastilha Azul Aracati + argamassa — cartão 3×", 386.25),
    ("20/08/2026", "Casa dos Aquecedores", "Tampão 80×80 casa de máquinas — C6 4× (Orç. 17275)", 2665.00),
    ("20/08/2026", "Portobello Shop Gabriel", "Revestimentos (pedido 01554539) — PagBank 4×", 4970.47),
    ("20/08/2026", "Unimóveis (F. Limonta)", "Marcenaria — parc. 4/5 (Pix)", 44000.00),
    ("26/08/2026", "Andra Elétrica", "Materiais elétricos P22621 — cartão 3× de 2.080", 6240.00),
    ("27/08/2026", "Fratelli", "Reforma civil — parc. 5 (NF-05 arquivada)", 45388.36),
    ("28/08/2026", "Staccato", "Marmoraria — 4ª parcela (confirmada pelo Daniel em 23/10; sem comprovante na pasta)", 32660.00),
    ("03/09/2026", "Andra Elétrica (Cielo)", "Luminárias LED P23432 — cartão 6× de 1.260,40", 7562.44),
    ("04/09/2026", "Fratelli", "Gerenciamento parc. 5 (Pix; NF pendente)", 13636.10),
    ("17/09/2026", "Andra Elétrica (cartão)", "Suportes e tomadas Orion — NFC-e 33985", 394.28),
    ("18/09/2026", "Mercado Livre (Visa 1×)", "Tomadas Schneider USB A+C, 6 un (NF-e pendente; entrega 25–26/09)", 884.58),
    ("24/09/2026", "Lustres Yamamura", "Luminárias — pedido 6784994 (Visa 1.017,91 + vale-crédito 864,19; NFC-e 14700)", 1882.10),
    ("28/09/2026", "Fratelli", "Reforma civil — parc. 6 (Pix; NF pendente)", 45388.36),
    ("06/10/2026", "Fratelli", "Gerenciamento parc. 6 (Pix; NF pendente)", 3925.23),
    ("06/10/2026", "Cielo (link de pagamento)", "LED do marceneiro — 6× de 284,61", 1707.70),
    ("13/10/2026", "Hidrauli (C6)", "Bomba piscina Eberle 1/3 cv — proposta 17728, C6 4× (NF-e 2705)", 1255.00),
    ("27/10/2026", "Piso Piso Arte (cartão 4×)", "Restauração piso/escada + adequações do deck — NFS-e 319 (valor = 24.730 − 830; divisão inferida, confirmado pelo Daniel em 30/10)", 23900.00),
    ("27/10/2026", "Piso Piso Arte (SumUp)", "Complemento — cobrança anterior saiu errada (comprovante SumUp 18:50)", 830.00),
]
for i, (d, f, ref, v) in enumerate(pagamentos):
    r = 4 + i
    put(pg, r, 1, d, F_INPUT); put(pg, r, 2, f, F_INPUT); put(pg, r, 3, ref, F_INPUT)
    put(pg, r, 4, v, F_INPUT, BRL)
rP = 4 + len(pagamentos)
put(pg, rP, 3, "TOTAL", F_SEC, fill=FILL_TOT)
put(pg, rP, 4, f'=SUM(D4:D{rP-1})', Font(name=ARIAL, size=10, bold=True), BRL, FILL_TOT)
for i, w in enumerate([12, 24, 52, 15]): pg.column_dimensions[get_column_letter(i+1)].width = w
pg.freeze_panes = "A4"

# ============ ABA: Agenda ============
ag = wb.create_sheet("Agenda")
ag["A1"] = "Desembolsos futuros já contratados"; ag["A1"].font = F_TIT
hdr_row(ag, 3, ["Vencimento", "Compromisso", "Valor", "Situação"])
agenda = [
    ("20/08/2026", "Alucustom — parc. 4 (venceu 20/08 — confirmar pagamento)", 13432.00, "A CONFIRMAR"),
    ("21/09/2026", "Unimóveis — marcenaria parc. 5 de 5 (venceu ~21/09 — confirmar pagamento)", 44000.00, "A CONFIRMAR"),
    ("fev/2027", "Fratelli — reforma parc. 7 (aditivo / Rev.04A; ainda não assinado)", 45388.36, "A vencer"),
    ("mar/2027", "Fratelli — reforma parc. 8 (aditivo / Rev.04A; ainda não assinado)", 45388.36, "A vencer"),
    ("", "Rev.04A: marmoraria instala out–nov; marcenaria produz até dez e instala jan–fev/27; acabamentos e limpezas fev–mar; MUDANÇA mar/27", 0, "Cronograma"),
]
for i, (d, desc, v, st) in enumerate(agenda):
    r = 4 + i
    put(ag, r, 1, d, F_INPUT); put(ag, r, 2, desc, F_INPUT)
    put(ag, r, 3, v, F_INPUT, BRL)
    c = put(ag, r, 4, st, F_INPUT)
    if st == "A CONFIRMAR": c.fill = PatternFill("solid", fgColor="FDE9E0")
rA = 4 + len(agenda)
put(ag, rA, 2, "TOTAL", F_SEC, fill=FILL_TOT)
put(ag, rA, 3, f'=SUM(C4:C{rA-1})', Font(name=ARIAL, size=10, bold=True), BRL, FILL_TOT)
ag.cell(row=rA+2, column=2, value="Parcelas de cartão em curso já contadas nos totais (compra fechada) — ver aba Cartoes para o fluxo de fatura.").font = F_MUT
for i, w in enumerate([13, 70, 15, 15]): ag.column_dimensions[get_column_letter(i+1)].width = w

# ============ ABA: Cartoes ============
ct = wb.create_sheet("Cartoes")
ct["A1"] = "Cartão de crédito — parcelas contratadas por vir (fluxo de fatura mês a mês)"; ct["A1"].font = F_TIT
ct["A2"] = ("Numeração dos meses: mai/26=1, jun/26=2 ... jan/27=9, fev/27=10, mar/27=11. Edite as células azuis "
            "(total, nº de parcelas, mês da 1ª parcela, parcelas já pagas) — a grade recalcula. Premissa: faturas até ago/26 pagas.")
ct["A2"].font = F_MUT
MESES_GRID = ["set/26", "out/26", "nov/26", "dez/26", "jan/27", "fev/27", "mar/27", "abr/27"]
IDX0 = 5  # set/26 = mês nº 5
put(ct, 4, 8, "nº do mês →", F_MUT, border=False)
for j, m in enumerate(MESES_GRID):
    put(ct, 4, 9+j, IDX0+j, F_MUT)
hdr_row(ct, 5, ["Contrato", "Total", "Nº parc.", "Parcela", "Mês 1ª parc. (nº)", "Parc. pagas", "Próx. (nº)", "Últ. (nº)"] + MESES_GRID)
# (nome, total, n, mês nº da 1ª parcela, pagas) — mai/26=1
cartoes = [
    ("Hidrauli piscina (C6 10×)", 35000.00, 10, 1, 4),
    ("Staccato revest. (SafraPay 5×)", 15280.51, 5, 2, 3),
    ("BHP ar-condicionado (5×)", 11570.00, 5, 1, 4),
    ("Portobello piso sala (4×)", 8527.12, 4, 1, 4),
    ("Telhanorte revestimentos (Itaú 8×, compra 24/05)", 9687.68, 8, 1, 4),
    ("Churrasqueira Rede (10×)", 7272.00, 10, 2, 3),
    ("Hidrauli aquecimento (8×)", 5895.00, 8, 1, 4),
    ("PS Serralheria viga (3×)", 6000.00, 3, 1, 3),
    ("Deck Piso Piso (5× de 7.697, compra 07/08)", 38485.00, 5, 5, 0),
    ("Cubas Franke (8×, compra 29/07)", 4663.92, 8, 4, 1),
    ("Bracci louças/metais (Getnet 6× de 3.943,36, compra 27/07)", 23660.15, 6, 4, 1),
    ("Torneira Deca (5×, compra 30/07)", 431.86, 5, 4, 1),
    ("Leroy Merlin metais/chuveiro (8×, a confirmar)", 3289.88, 8, 4, 1),
    ("Portobello Gabriel (PagBank 4×, compra 20/08)", 4970.47, 4, 5, 0),
    ("Tampão casa de máquinas (C6 4×, compra 20/08)", 2665.00, 4, 5, 0),
    ("Pastilhas piscina (3×, compra 19/08)", 386.25, 3, 5, 0),
    ("Andra materiais elétricos (3× de 2.080, compra 26/08)", 6240.00, 3, 5, 0),
    ("Andra luminárias (6× de 1.260,40, compra 03/09)", 7562.44, 6, 6, 0),
    ("LED do marceneiro (Cielo 6×, compra 06/10)", 1707.70, 6, 7, 0),
    ("Hidrauli bomba piscina Eberle (C6 4×, compra 13/10)", 1255.00, 4, 7, 0),
    ("Piso Piso — restauração piso/escada/deck (4×, compra 27/10; divisão inferida)", 23900.00, 4, 7, 0),
]
r0t = 6
for i, (nome, tot, n, ini, pagas) in enumerate(cartoes):
    r = r0t + i
    put(ct, r, 1, nome)
    put(ct, r, 2, tot, F_INPUT, BRL)
    put(ct, r, 3, n, F_INPUT)
    put(ct, r, 4, f'=B{r}/C{r}', F_FORM, BRL)
    put(ct, r, 5, ini, F_INPUT)
    put(ct, r, 6, pagas, F_INPUT)
    put(ct, r, 7, f'=E{r}+F{r}', F_FORM)
    put(ct, r, 8, f'=E{r}+C{r}-1', F_FORM)
    for j in range(len(MESES_GRID)):
        col = get_column_letter(9+j)
        put(ct, r, 9+j, f'=IF(AND({col}$4>=$G{r},{col}$4<=$H{r}),$D{r},0)', F_FORM, BRL)
rTt = r0t + len(cartoes)
put(ct, rTt, 1, "TOTAL DO MÊS", F_SEC, fill=FILL_TOT)
for j in range(len(MESES_GRID)):
    col = get_column_letter(9+j)
    put(ct, rTt, 9+j, f'=SUM({col}{r0t}:{col}{rTt-1})', Font(name=ARIAL, size=10, bold=True), BRL, FILL_TOT)
put(ct, rTt+2, 1, "TOTAL GERAL POR VIR NO CARTÃO", F_SEC, fill=FILL_YEL)
put(ct, rTt+2, 2, f'=SUM(I{rTt}:{get_column_letter(8+len(MESES_GRID))}{rTt})',
    Font(name=ARIAL, size=12, bold=True), BRL, FILL_YEL)
ct.cell(row=rTt+4, column=1, value="Obs.: estas parcelas já estão contadas como pagas/faturadas nos totais da obra — esta aba é visão de fluxo de caixa da fatura.").font = F_MUT
for i, w in enumerate([44, 13, 8, 12, 13, 10, 9, 8] + [11]*len(MESES_GRID)):
    ct.column_dimensions[get_column_letter(i+1)].width = w
ct.freeze_panes = "B6"
CT_TOT_CELL = f"Cartoes!B{rTt+2}"

# ============ ABA: Cenarios ============
cn = wb.create_sheet("Cenarios")
cn["A1"] = "Simulação de cenários — saldo a pagar por item"; cn["A1"].font = F_TIT
cn["A2"] = "Mexa nas alavancas amarelas (linhas 5–6) OU sobrescreva o saldo de qualquer item nas colunas E–G (células azuis)."; cn["A2"].font = F_MUT
put(cn, 4, 1, "Alavancas globais", F_SEC, border=False)
put(cn, 4, 5, "Otimista", F_HDR, fill=FILL_HDR); put(cn, 4, 6, "Base", F_HDR, fill=FILL_HDR); put(cn, 4, 7, "Pessimista", F_HDR, fill=FILL_HDR)
put(cn, 5, 1, "Variação sobre saldos JÁ CONTRATADOS (%)", F_TXT)
for col, v in ((5, 0.0), (6, 0.0), (7, 0.05)):
    put(cn, 5, col, v, F_INPUT, PCT, FILL_YEL)
put(cn, 6, 1, "Variação sobre itens NÃO contratados (%)", F_TXT)
for col, v in ((5, -0.05), (6, 0.0), (7, 0.15)):
    put(cn, 6, col, v, F_INPUT, PCT, FILL_YEL)

hdr_row(cn, 8, ["Item", "Status", "Contratado?", "Saldo base", "Otimista", "Base", "Pessimista"])
r0c = 9
for i in range(N_IT):
    r = r0c + i
    ri = 4 + i
    put(cn, r, 1, f'=Itens!A{ri}', F_LINK)
    put(cn, r, 2, f'=Itens!I{ri}', F_LINK)
    put(cn, r, 3, f'=IF(Itens!C{ri}>0,"S","N")', F_FORM)
    put(cn, r, 4, f'=MAX(Itens!G{ri},0)', F_LINK, BRL)
    for cc, lev in ((5, "E"), (6, "F"), (7, "G")):
        put(cn, r, cc, f'=$D{r}*(1+IF($C{r}="S",{lev}$5,{lev}$6))', F_INPUT, BRL)
rTc = r0c + N_IT
put(cn, rTc, 1, "A DESEMBOLSAR (soma dos saldos)", F_SEC, fill=FILL_TOT)
for col, cnn in (("D",4),("E",5),("F",6),("G",7)):
    put(cn, rTc, cnn, f'=SUM({col}{r0c}:{col}{rTc-1})', Font(name=ARIAL, size=10, bold=True), BRL, FILL_TOT)

rs = rTc + 2
put(cn, rs, 1, "Custo final projetado da obra", F_SEC, border=False)
labels = [
    ("Pago até hoje (obra + fora do orçamento)", f"=Itens!E{IT_TOT}+Nao_Orcados!B8"),
    ("Faturado / parcelado a confirmar", f"=Itens!F{IT_TOT}+Nao_Orcados!C8"),
]
for j, (lab, form) in enumerate(labels):
    put(cn, rs+1+j, 1, lab, F_TXT)
    for cnn in (4, 5, 6, 7):
        put(cn, rs+1+j, cnn, form, F_LINK, BRL)
rq = rs + 3
put(cn, rq, 1, "CUSTO TOTAL PROJETADO", F_SEC, fill=FILL_TOT)
for col, cnn in (("D",4),("E",5),("F",6),("G",7)):
    put(cn, rq, cnn, f'={col}{rTc}+{col}{rs+1}+{col}{rs+2}', Font(name=ARIAL, size=11, bold=True), BRL, FILL_TOT)
put(cn, rq+1, 1, "Diferença vs. cenário base", F_TXT)
for col, cnn in (("E",5),("F",6),("G",7)):
    put(cn, rq+1, cnn, f'={col}{rq}-$D{rq}', F_FORM, BRL)
put(cn, rq+2, 1, "Diferença vs. orçamento R01 + não orçados", F_TXT)
put(cn, rq+2, 3, f'=Itens!B{IT_TOT}+Nao_Orcados!D8', F_LINK, BRL)
cn.cell(row=rq+2, column=3).font = F_LINK
for col, cnn in (("D",4),("E",5),("F",6),("G",7)):
    put(cn, rq+2, cnn, f'={col}{rq}-$C{rq+2}', F_FORM, BRL)
cn.cell(row=rq+4, column=1, value="Obs.: 'Saldo base' vem da aba Itens (contratado ou orçado, menos pago e faturado). Ao digitar um valor em E–G você substitui a fórmula daquele item.").font = F_MUT
for i, w in enumerate([46, 13, 11, 15, 15, 15, 15]): cn.column_dimensions[get_column_letter(i+1)].width = w
cn.freeze_panes = "B9"

# ============ ABA: Resumo ============
rs_ = wb.create_sheet("Resumo", 1)
rs_["B2"] = "Resumo — Obra Casa 4 Palm Hill"; rs_["B2"].font = F_TIT
rs_["B3"] = f"Atualizado até {DATA} — tudo por fórmula; edite apenas as abas Itens / Nao_Orcados / Pagamentos."; rs_["B3"].font = F_MUT
res = [
    ("Orçamento proposta civil (R01)", f"=Itens!B{IT_TOT}", None),
    ("Pago com comprovante (escopo civil)", f"=Itens!E{IT_TOT}", f"=Itens!E{IT_TOT}/Itens!B{IT_TOT}"),
    ("Faturado / parcelado a confirmar", f"=Itens!F{IT_TOT}", None),
    ("Falta pagar (vs. base contratada/orçada)", f"=Itens!G{IT_TOT}", None),
    ("", None, None),
    ("Itens não orçados realizados", "=Nao_Orcados!D8", None),
    ("Desembolsado total (com comprovante)", f"=Itens!E{IT_TOT}+Nao_Orcados!B8", None),
    ("Comprometido (pago + faturado)", f"=Itens!E{IT_TOT}+Itens!F{IT_TOT}+Nao_Orcados!D8", None),
    ("", None, None),
    ("Projeção de custo total (orçamento + não orçados)", f"=Itens!B{IT_TOT}+Nao_Orcados!D8", None),
    ("Projeção ajustada pelos contratos (cenário base)", "=Cenarios!D" + str(rq), None),
    ("Cartão de crédito por vir (fluxo de fatura)", f"={CT_TOT_CELL}", None),
    ("Conferência: total de pagamentos lançados", f"=Pagamentos!D{rP}", None),
]
r = 5
for lab, form, pct in res:
    if lab:
        put(rs_, r, 2, lab, F_TXT, border=False)
        put(rs_, r, 3, form, F_LINK, BRL, border=False)
        if pct: put(rs_, r, 4, pct, F_LINK, PCT, border=False)
    r += 1
rs_.column_dimensions["B"].width = 46; rs_.column_dimensions["C"].width = 20; rs_.column_dimensions["D"].width = 10

# ============ ABA: Fluxo_Caixa ============
fc = wb.create_sheet("Fluxo_Caixa", 2)
fc["B2"] = "Fluxo de caixa da obra — resumo"; fc["B2"].font = F_TIT
fc["B3"] = f"Posição de {DATA}. Azul = célula editável; verde = link de outra aba; preto = fórmula."; fc["B3"].font = F_MUT

resumo_fc = [
    ("Despesas orçadas (R01 + não orçados)", f"=Itens!B{IT_TOT}+Nao_Orcados!D8", F_LINK, BRL),
    ("Total estimado da obra (ajustado pelos contratos)", "=Cenarios!D" + str(rq), F_LINK, BRL),
    (f"Pago até 30/10 (com comprovante)", f"=Pagamentos!D{rP}", F_LINK, BRL),
    ("Faturado/parcelado a confirmar", f"=Itens!F{IT_TOT}+Nao_Orcados!C8", F_LINK, BRL),
    ("FALTA DESEMBOLSAR (estimado − pago)", "=C6-C7", F_SEC, BRL),
    ("% executado (pago ÷ estimado)", "=C7/C6", F_FORM, PCT),
]
r = 5
for lab, form, fnt, fmt in resumo_fc:
    put(fc, r, 2, lab, F_SEC if "FALTA" in lab else F_TXT, border=False)
    c = put(fc, r, 3, form, fnt, fmt, border=False)
    if "FALTA" in lab: c.fill = FILL_YEL; c.font = Font(name=ARIAL, size=12, bold=True)
    r += 1
fc.cell(row=r, column=2, value="Obs.: o 'faturado a confirmar' já está dentro do 'falta desembolsar' (é falta de comprovante, não de dívida nova).").font = F_MUT

r0f = r + 2
fc.cell(row=r0f-1, column=2, value="Desembolso mês a mês (base = mês da compra/parcela; realizado vem dos comprovantes)").font = F_SEC
hdr_row(fc, r0f, ["Mês", "Realizado", "Previsto (edite)", "Total do mês", "Acumulado", "% do estimado"], start=2)
# Previsto = soma do 'prog' do dashboard (build_dashboard.py), espelhado manualmente
meses_fc = [
    ("set/25", 1026.25, None), ("out/25", 998.25, None), ("nov/25", 10400.00, None), ("dez/25", 10400.00, None),
    ("jan/26", 10400.00, None), ("fev/26", 17900.00, None), ("mar/26", 0.00, None),
    ("abr/26", 136780.00, None), ("mai/26", 252845.63, None), ("jun/26", 177185.46, None), ("jul/26", 179138.16, None),
    ("ago/26", 202745.36, None), ("set/26", 69747.86, None), ("out/26", 31617.93, 126459.68), ("nov/26", None, 52960.54),
    ("dez/26", None, 29469.63), ("jan/27", None, 64706.00),
    ("fev/27", None, 98348.90),
    ("mar/27", None, "FECHA"),
]
r1 = r0f + 1
for i, (m, real, prev) in enumerate(meses_fc):
    rr = r1 + i
    put(fc, rr, 2, m, F_TXT)
    put(fc, rr, 3, real if real is not None else None, F_INPUT, BRL)
    if prev == "FECHA":  # último mês fecha a conta: estimado − pago − previstos anteriores
        put(fc, rr, 4, f'=$C$6-$C$7-SUM(D{r1+12}:D{rr-1})', F_FORM, BRL)
    else:
        put(fc, rr, 4, prev if prev is not None else None, F_INPUT, BRL)
    put(fc, rr, 5, f'=SUM(C{rr}:D{rr})', F_FORM, BRL)
    put(fc, rr, 6, f'=SUM($E${r1}:$E${rr})', F_FORM, BRL)
    put(fc, rr, 7, f'=F{rr}/$C$6', F_FORM, PCT)
rTf = r1 + len(meses_fc)
put(fc, rTf, 2, "TOTAL", F_SEC, fill=FILL_TOT)
put(fc, rTf, 3, f'=SUM(C{r1}:C{rTf-1})', Font(name=ARIAL, size=10, bold=True), BRL, FILL_TOT)
put(fc, rTf, 4, f'=SUM(D{r1}:D{rTf-1})', Font(name=ARIAL, size=10, bold=True), BRL, FILL_TOT)
put(fc, rTf, 5, f'=SUM(E{r1}:E{rTf-1})', Font(name=ARIAL, size=10, bold=True), BRL, FILL_TOT)
put(fc, rTf+1, 2, "Conferência: realizado − aba Pagamentos (deve ser 0)", F_MUT, border=False)
put(fc, rTf+1, 3, f'=C{rTf}-Pagamentos!D{rP}', F_FORM, BRL)
put(fc, rTf+2, 2, "Conferência: total geral − estimado (deve ser 0)", F_MUT, border=False)
put(fc, rTf+2, 3, f'=E{rTf}-C6', F_FORM, BRL)
fc.cell(row=rTf+4, column=2, value=("Premissas (Rev.04A / aditivo Fratelli — mudança em mar/27): set/26 fechado só com realizado (69.747,86). Out tem realizado até 30/10 (31.617,93: ger. parc.6, LED marceneiro, bomba Hidrauli e Piso Piso 24.730) "
    "+ previsto (Unimóveis última 44.000 e Alucustom 13.432 vencidos a confirmar, gerenciamento est. e louças); Fratelli parc. 7 em fev/27 e parc. 8 em mar/27 (aditivo ainda não assinado); gerenciamento mensal até fev; "
    "acabamentos não contratados rateados 20/20/10/25/20/5% entre out e mar. Mar/27 fecha exatamente no total estimado.")).font = F_MUT
for i, w in enumerate([2, 44, 16, 16, 15, 15, 13]):
    fc.column_dimensions[get_column_letter(i+1)].width = w

wb.save("/home/claude/Obra_Casa4_Acompanhamento_Cenarios.xlsx")
print("salvo")

