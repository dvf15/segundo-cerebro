---
title: "claude/build_dashboard.py"
date: 2026-09-29
source: "claude-project-doc"
source_id: "2d8a18f6-8928-4b0c-b433-26126b81f1cc"
project: "Obra Casa 4"
tags: ["claude", "projeto", "conhecimento"]
---
# claude/build_dashboard.py

# -*- coding: utf-8 -*-
# Gera o painel HTML do acompanhamento financeiro da Obra Casa 4
import html as H

def br(v, dec=0):
    s = f"{v:,.{dec}f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return s

DATA_CORTE = "30/10/2026"
TOTAL_PROPOSTA = 1485436.99

# item: (nome, orçado, contratado(ou None), pago, faturado_sem_comprovante, nota)
itens = [
    ("Marcenaria — Unimóveis (Francisco)", 342000.00, 320000.00, 276000.00, 0, "Sinal 100 mil + 5×44 mil. Pagas: sinal + parc. 1–4 (parc. 4: Pix 44.000 em 20/08). Falta só a parc. 5 (~21/09, sem comprovante). Instalação física: fev/27 (Rev.04A)."),
    ("Civil / Reforma — Fratelli (Salvador Arq.)", 363106.86, None, 272330.16, 0, "Pagas parc. 1–6 (6×45.388,36: 16/05, 27/05, 29/06, 27/07, 27/08 e 28/09 — NF da parc. 6 pendente). Aditivo acordado em 22–26/10: parc. 7 (45.388,36) na conclusão da instalação da marcenaria (fev/27, vistoria conjunta) e parc. 8 (45.388,36) na entrega definitiva com Termo (mar/27); multa da Cl. 3 perdoada se entrega até 15/03/27. Saldo vs. orçado 90.776,70."),
    ("Marmoraria — Staccato", 157700.00, 130640.00, 130640.00, 0, "4 boletos de 32.660 (29/04, 29/06, 28/07 e 28/08). Os 3 primeiros com comprovante; o último (28/08) entra como pago por confirmação do Daniel em 23/10 (\"Staccato 100% paga\"), sem comprovante na pasta. ATENÇÃO: os pedidos GABR-260253 + 260254 somam 163.300 (5×32.660) — diferença de 32.660 vs. o contratado registrado; conferir. Última bancada prevista ~02/12/26."),
    ("Gerenciamento (10%) — Fratelli", 98756.19, None, 68862.59, 0, "Parc. 1–6 pagas (14.098,40 / 12.502,30 / 13.354,78 / 11.345,78 / 13.636,10 em 04/09 / 3.925,23 em 06/10 — parc. 6 classificada pelo Daniel em 13/10, valor abaixo das anteriores; NFs das parc. 5 e 6 pendentes). Saldo: 29.893,60."),
    ("Caixilhos — Alucustom (Inovar)", 37600.00, 62000.00, 48568.00, 0, "Contrato de 62 mil ficou 24,4 mil acima do orçado. Parc. 1–3 pagas (20/05, 19/06 e 20/07); parc. 4 (13.432) venceu 20/08 — comprovante a confirmar. O contrato de 28/05 menciona ainda +9.500 (parc. 5, 20/09) — fora da projeção, aguardando confirmação."),
    ("Impermeabilização cobertura — TJK", 27784.00, 29284.00, 29284.00, 0, "4 Pix pagos (8.785,20 em 18/05 + 2.000 + 9.000 + 9.498,80) = NF-263 quitada. Concluído."),
    ("Equip. gourmet / churrasqueira — Caixa de Fogo", 36012.00, None, 8272.00, 0, "Pix 1.000 + cartão 7.272 (10x). Saldo do orçado: 27.740."),
    ("Casa de máquinas piscina — Hidrauli + tampão + bomba", 39695.00, 38920.00, 38920.00, 0, "Pedido 56760 pago no C6 10× (mai/26) + tampão 80×80: 2.665 em 4× no C6 (20/08, Orç. 17275, NF-e 2599 de 31/08) + bomba Eberle 1/3 cv com pré-filtro: 1.255,00 em 4× no C6 (13/10, proposta 17728, NF-e 2705 de 27/10). Contratado original 37.665 → 38.920 (+1.255)."),
    ("Ar-condicionado — Lino Ar + BHP", 22160.00, 15940.00, 4370.00, 11570.00, "Pago: Lino Ar 2.940 + BHP 1.430 (parc. 2 da NF). NF-123.110 do cassete LG 24k BTUs (R$ 13.000) arquivada; saldo 11.570 em 5× no cartão até set/26."),
    ("Porcelanatos e revestimentos — Portobello, Staccato, Telhanorte", 33686.54, None, 38852.03, 0, "Portobello 8.527,12 + Telhanorte 9.687,68 (Itaú 8× de 1.210,96, 24/05 — extrato do cartão arquivado em 26/09; cupom era 9.340,92) + Staccato rev. 15.280,51 + Portobello Gabriel 4.970,47 (PagBank 4×, 20/08) + pastilhas piscina 386,25 (3×, 19/08). Tudo pago. ATENÇÃO: estoura o orçado em 5.165,49."),
    ("Louças e metais — Bracci + Franke/Deca/ML/Leroy", 49658.04, None, 30301.02, 3289.88, "Pagos: Bracci 23.660,15 (Getnet 6× de 3.943,36, 27/07 — forma confirmada pelo Daniel em 28/09) + Franke 4.663,92 (8×) + Mercado Livre 1.545,09 + Deca 431,86 (5×). A confirmar: Leroy Merlin 3.289,88 (8× de 411,24, pedido 30/07 aguardando aprovação). Saldo do orçado: 16.067,14."),
    ("Serralherias e complementos — Márcio", 22000.00, None, 16604.50, 0, "Pago 16.604,50 (Pix 10/08). NFS-e nº 7 de Márcio Alessandro (13/08) arquivada — serralheria, esquadrias de alumínio, reparo vidros. Saldo do orçado: 5.395,50."),
    ("Acabamentos elétricos — Andra + Mercado Livre (materiais)", 6000.00, None, 7518.86, 0, "Andra P22621 6.240 (3× de 2.080, 26/08) + Andra loja 394,28 (suportes/tomadas Orion, NFC-e 33985, cartão 17/09) + tomadas Schneider USB no Mercado Livre 884,58 (Visa 1×, 18/09; NF-e pendente, entrega 25–26/09). Verba estourada em 1.518,86."),
    ("Iluminação — Andra + Yamamura + LED marceneiro", 28876.35, None, 11152.24, 0, "LED do marceneiro: 1.707,70 em 6× de 284,61 na Cielo (06/10, link de pagamento; Daniel informou em 13/10 que é o LED do marceneiro — classificado aqui por ser iluminação; fornecedor a confirmar). Luminárias LED Interlight (pedido P23432): 7.562,44 em 6× de 1.260,40 via Cielo (03/09) + Lustres Yamamura pedido 6784994: 1.882,10 em 24/09 (Visa 1.017,91 + vale-crédito 864,19; NFC-e 14700). Saldo do orçado: 17.724,11. Orçamento Yamamura de 23.636 segue em análise."),
    ("Aquecimento da casa — Hidrauli", 990.00, 5895.00, 0, 5895.00, "Proposta Hidrauli 16486 (20/05): produtos 3.595 (NF-e 2220) + mão de obra 2.300 (NFS-e 697) = 5.895 em até 8× sem juros (pedido 57035 no VENDA CLIENTE; a NF-e mostra 57045 — número a conferir). Contratado 5.895 vs 990 orçados (escopo maior que o previsto)."),
    ("Reforço com vigas — PS Serralheria", 6300.00, 6000.00, 0, 6000.00, "NF-151 (viga de aço) em 3× no cartão — sem comprovante de liquidação."),
    ("Laudo / projeto estrutural — R. Moralez", 3000.00, 3070.00, 3070.00, 0, "Pix 08/04 + NFS-e 212. Concluído."),
    ("Deck Cumaru 7x2 — Piso Piso Arte", 31471.40, 38485.00, 38485.00, 0, "PAGO em 07/08 (cartão SumUp 5× de 7.697); NFS-e 316 (24/08) arquivada. Instalação ago–set."),
    ("Restauração piso de madeira, escada e adequações do deck — Piso Piso Arte", 28845.96, 24730.00, 24730.00, 0, "Proposta de R$ 24.740 (adequações estruturais do deck/reposição 5.910 + restauração de assoalhos, tacos e escada 18.830, em 4× de 6.185 no cartão); NFS-e 319 de 27/10 = 24.730. Daniel confirmou em 30/10 que pagou em 4× no cartão e que os R$ 830 da SumUp (27/10) foram complemento porque a cobrança saiu errada. Lançado 23.900 (4× no cartão) + 830 (SumUp) = 24.730 — a divisão é inferência; sem comprovante do 4× na pasta. Substitui o item 'Tratamento piso de madeira' (28.845,96) que estava em não iniciados."),
]

# não iniciados (nome, orçado)
nao_iniciados = [
    ("Itens omissos (5%)", 66032.42),
    ("Cortinas e persianas — Persol", 23467.50),
    ("Box dos banheiros — Danglass", 16000.00),
    ("Limpeza fina de obra", 12000.00),
    ("Itens de marcenaria à parte (verbas)", 9300.00),
    ("Corrimão escada — Anderson", 5700.00),
    ("Piso emborrachado academia (proposta Aubicon ~2.930 em análise)", 5582.73),
    ("Serralheria interface marcenaria (verba)", 4500.00),
    ("Piso intertravado garagem", 3212.00),
    ("Instalação equipamentos cozinha/gourmet", 2500.00),
    ("Varal de teto (verba)", 1500.00),
]

pago_civil = sum(i[3] for i in itens)
fat_civil = sum(i[4] for i in itens)
saldo_est = TOTAL_PROPOSTA - pago_civil - fat_civil
tot_nao_iniciado = sum(v for _, v in nao_iniciados)

# Itens NÃO orçados na proposta civil e realizados
nao_orcados = [
    ("Projeto de arquitetura — Bambu.Arq", 41600.00, 0,
     "Contrato 25ARQ183: 4×10.400 = R$ 41.600, quitado. Pix de 12/11/25, 12/12/25, 12/01/26 e 12/02/26. Concluído."),
    ("Elaboração de orçamentos — Fratelli", 7500.00, 7500.00,
     "2×7.500 = R$ 15.000. Parc. 1 paga por Pix (12/02); parc. 2 só com NF-477 (06/04), sem comprovante."),
    ("Levantamento de áreas — Gostudio (pré-obra)", 2024.50, 0,
     "2 Pix em set e out/25 (1.026,25 + 998,25). NFS-e 943 cobre os dois. Concluído."),
    ("Projeto luminotécnico — Letícia Brito", 2100.00, 0,
     "2 Pix de 1.050 (07/04 e 21/05). Classificação informada pelo Daniel em 26/07."),
]
pago_no = sum(i[1] for i in nao_orcados)
fat_no = sum(i[2] for i in nao_orcados)
tot_no = pago_no + fat_no

desembolsado_total = pago_civil + pago_no
comprometido_total = desembolsado_total + fat_civil + fat_no
projecao_total = TOTAL_PROPOSTA + tot_no
ajustes_contratos = [
    ("Marcenaria", 320000.00 - 342000.00),
    ("Marmoraria", 130640.00 - 157700.00),
    ("Caixilhos", 62000.00 - 37600.00),
    ("Impermeabilização", 29284.00 - 27784.00),
    ("Casa de máquinas (+bomba adicional)", 38920.00 - 39695.00),
    ("Aquecimento", 5895.00 - 990.00),
    ("Laudo estrutural", 3070.00 - 3000.00),
    ("Reforço vigas", 6000.00 - 6300.00),
    ("Deck", 38485.00 - 31471.40),
    ("Piso de madeira/escada/deck (Piso Piso)", 24730.00 - 28845.96),
    ("Ar-condicionado", 15940.00 - 22160.00),
    ("Porcelanatos acima do orçado", 5165.49),
    ("Acab. elétricos acima da verba", 1518.86),
]
delta_contratos = sum(v for _, v in ajustes_contratos)
projecao_ajustada = projecao_total + delta_contratos

# agenda futura
agenda = [
    ("Vencidos — sem comprovante na pasta", [
        ("Alucustom — parc. 4, boleto venceu 20/08 (confirmar)", 13432.00, True),
        ("Unimóveis — parc. 5 de 5 (venc. ~21/09, confirmar)", 44000.00, True),
    ]),
    ("Out/26 – Mar/27 (aditivo Fratelli + Rev.04A)", [
        ("Fratelli — reforma parc. 7 (fev/27, na conclusão da instalação da marcenaria)", 45388.36, False),
        ("Fratelli — reforma parc. 8 (mar/27, na entrega definitiva com Termo)", 45388.36, False),
        ("Gerenciamento out–fev (~5.979/mês, est.)", 29893.60, False),
        ("Louças e metais — saldo do orçado", 16067.14, False),
        ("Serralheria Márcio — saldo do orçado", 5395.50, False),
        (f"Itens ainda não contratados ({len(nao_iniciados)} itens)", tot_nao_iniciado, False),
    ]),
]

# Contratos no cartão: (nome, total, n_parcelas, (ano,mes) da 1ª parcela, parcelas já pagas)
# Premissa: faturas até ago/26 consideradas pagas.
cartoes_contratos = [
    ("Hidrauli piscina (C6)", 35000.00, 10, (2026, 5), 4),
    ("Staccato revest. (SafraPay)", 15280.51, 5, (2026, 6), 3),
    ("BHP ar-condicionado", 11570.00, 5, (2026, 5), 4),
    ("Portobello piso sala", 8527.12, 4, (2026, 5), 4),
    ("Telhanorte revestimentos (Itaú 8× de 1.210,96, compra 24/05)", 9687.68, 8, (2026, 5), 4),
    ("Churrasqueira (Rede)", 7272.00, 10, (2026, 6), 3),
    ("Hidrauli aquecimento", 5895.00, 8, (2026, 5), 4),
    ("PS Serralheria viga", 6000.00, 3, (2026, 5), 3),
    ("Deck Piso Piso (5× de 7.697, compra 07/08)", 38485.00, 5, (2026, 9), 0),
    ("Cubas Franke (8×, compra 29/07)", 4663.92, 8, (2026, 8), 1),
    ("Bracci louças/metais (Getnet 6× de 3.943,36, compra 27/07)", 23660.15, 6, (2026, 8), 1),
    ("Torneira Deca (5×, compra 30/07)", 431.86, 5, (2026, 8), 1),
    ("Misturador Mercado Livre (1×)", 1545.09, 1, (2026, 8), 1),
    ("Leroy Merlin metais/chuveiro (8×, a confirmar)", 3289.88, 8, (2026, 8), 1),
    ("Portobello Gabriel (PagBank 4×, compra 20/08)", 4970.47, 4, (2026, 9), 0),
    ("Tampão casa de máquinas (C6 4×, compra 20/08)", 2665.00, 4, (2026, 9), 0),
    ("Pastilhas piscina (3×, compra 19/08)", 386.25, 3, (2026, 9), 0),
    ("Andra materiais elétricos (3× de 2.080, compra 26/08)", 6240.00, 3, (2026, 9), 0),
    ("Andra luminárias (6× de 1.260,40, compra 03/09)", 7562.44, 6, (2026, 10), 0),
    ("LED do marceneiro (Cielo 6×, compra 06/10)", 1707.70, 6, (2026, 11), 0),
    ("Hidrauli bomba piscina Eberle (C6 4×, compra 13/10)", 1255.00, 4, (2026, 11), 0),
    ("Piso Piso — restauração piso/escada/deck (cartão 4×, compra 27/10; divisão inferida)", 23900.00, 4, (2026, 11), 0),
]
MESES_PT = {1:"jan",2:"fev",3:"mar",4:"abr",5:"mai",6:"jun",7:"jul",8:"ago",9:"set",10:"out",11:"nov",12:"dez"}
def add_m(am, k):
    a, m = am; m += k
    return (a + (m-1)//12, (m-1)%12 + 1)
fluxo_cartao = {}
cart_por_vir = []
for nome, tot, n, ini, pagas in cartoes_contratos:
    parc = tot / n
    rest = 0
    for i in range(pagas, n):
        am = add_m(ini, i)
        fluxo_cartao.setdefault(am, []).append((nome, parc))
        rest += parc
    if rest > 0:
        fim = add_m(ini, n-1)
        cart_por_vir.append((nome, rest, parc, f"{MESES_PT[fim[1]]}/{str(fim[0])[2:]}"))
TOTAL_CARTAO_VIR = sum(r for _, r, _, _ in cart_por_vir)

alertas = [
    ("Aditivo Fratelli acordado (22–26/10) — Rev.04A: entrega definitiva até 15/03/2027", "Parcela 7 (45.388,36) na conclusão da instalação da marcenaria (fev/27, vistoria conjunta) e parcela 8 (45.388,36) na entrega definitiva com Termo (mar/27) — o fluxo antigo previa out e nov/26. Multa da Cl. 3 (1%/semana sobre o saldo de 90.776,72 = 907,77/semana, desde 28/12/26) perdoada se a entrega definitiva ocorrer até 15/03/27. Em aberto: extensão da data de perdão por atraso da Staccato (última bancada prevista ~02/12/26). O aditivo ainda precisa ser assinado. As fases do gráfico seguem a Rev.04A (15/10) de forma aproximada."),
    ("Boletos vencidos sem comprovante: Alucustom (20/08) e Unimóveis (~21/09) — R$ 57.432", "Última parcela dos caixilhos (13.432) e última parcela da marcenaria (44.000, venc. ~21/09). Staccato (último boleto, 28/08) foi confirmada como paga pelo Daniel em 23/10. Possível parcela extra da Alucustom de 9.500 (20/09) no contrato de 28/05 — fora da projeção até você confirmar."),
    ("Staccato: pedidos somam 163.300 (5×32.660) vs. 130.640 contratados/registrados", "Os pedidos GABR-260253 (129.220) + GABR-260254 (34.080) totalizam 163.300; o painel registra 4 boletos de 32.660 (130.640), todos pagos. Diferença de 32.660 — conferir se há um 5º pagamento (ex.: boleto de 28/05) sem comprovante na pasta ou se o pedido inclui outro escopo."),
    ("Verbas estouradas: porcelanatos (+5.165) e acab. elétricos (+1.519); iluminação em risco", "Porcelanatos: 38.852,03 pagos vs 33.687 orçados (Telhanorte confirmado em 9.687,68 no cartão, 346,76 acima do cupom). Elétricos: 7.518,86 pagos vs 6.000 orçados. Iluminação: pago 11.152,24 (Interlight 7.562,44 + Yamamura 1.882,10 em 24/09 + LED do marceneiro 1.707,70 em 06/10) — se o orçamento Yamamura de 23.636 em análise fechar integral E somar às compras já feitas, o item (28.876) estouraria em ~5.912."),
    (f"Cartão de crédito: R$ {br(TOTAL_CARTAO_VIR)} por vir — faturas de ~R$ 28–35 mil/mês de nov a jan", f"Parcelas em curso (fluxo de fatura): set {br(sum(x for _,x in fluxo_cartao.get((2026,9),[])))}, out {br(sum(x for _,x in fluxo_cartao.get((2026,10),[])))}, nov {br(sum(x for _,x in fluxo_cartao.get((2026,11),[])))}, dez {br(sum(x for _,x in fluxo_cartao.get((2026,12),[])))}, jan {br(sum(x for _,x in fluxo_cartao.get((2027,1),[])))}. Novas compras: LED do marceneiro (1.707,70 em 6×, 06/10), bomba da piscina Hidrauli (1.255,00 em 4×, 13/10) e Piso Piso (4× no cartão, 27/10, ~5.975/parcela) entram a partir de nov. Premissa: faturas pagas até ago/26 — set e out ainda aparecem como por vir até você confirmar."),
    ("Portobello Gabriel × Telhanorte — ambos pagos", "Telhanorte (9.687,68, 24/05) confirmado pelo extrato do cartão; Portobello Gabriel (4.970,47, 20/08) foi especificado pela Fratelli. Falta entender se o segundo substituiu ou somou ao primeiro — se substituiu, há material Telhanorte a devolver/reaproveitar."),
]

pagamentos = [
    ("24/09/25", "Gostudio", "Levantamento de áreas (pré-obra)", 1026.25),
    ("24/10/25", "Gostudio", "Levantamento de áreas (pré-obra)", 998.25),
    ("12/11/25", "Bambu.Arq", "Projeto arquitetura — parc. 1/4", 10400.00),
    ("12/12/25", "Bambu.Arq", "Projeto arquitetura — parc. 2/4", 10400.00),
    ("12/01/26", "Bambu.Arq", "Projeto arquitetura — parc. 3/4", 10400.00),
    ("12/02/26", "Bambu.Arq", "Projeto arquitetura — parc. 4/4 (quitado)", 10400.00),
    ("12/02/26", "Fratelli", "Elaboração de orçamentos — parc. 1", 7500.00),
    ("07/04/26", "Letícia Brito", "Projeto luminotécnico", 1050.00),
    ("08/04/26", "R. Moralez", "Laudo estrutural (calculista)", 3070.00),
    ("20/04/26", "Unimóveis (F. Limonta)", "Marcenaria — sinal (recibo)", 100000.00),
    ("29/04/26", "Staccato", "Marmoraria — 1ª parcela", 32660.00),
    ("04/05/26", "Fratelli", "Gerenciamento parc. 1 (8.289,40 + 5.809,00)", 14098.40),
    ("07/05/26", "Caixa de Fogo", "Churrasqueira — sinal", 1000.00),
    ("16/05/26", "Fratelli", "Reforma civil — parc. 1", 45388.36),
    ("18/05/26", "Hidrauli", "Piscina/casa de máquinas — cartão C6 10×", 35000.00),
    ("18/05/26", "TJK", "Impermeabilização — 1º pagamento", 8785.20),
    ("20/05/26", "Alucustom", "Caixilhos — parc. 1 (pago por Renata)", 21700.00),
    ("20/05/26", "Lino Ar", "Ar-condicionado — serviço", 2940.00),
    ("21/05/26", "Unimóveis (F. Limonta)", "Marcenaria — parc. 1/5 (recibo)", 44000.00),
    ("21/05/26", "Letícia Brito", "Projeto luminotécnico", 1050.00),
    ("22/05/26", "Portobello", "Piso sala porcelanato — cartão 4×", 8527.12),
    ("24/05/26", "Telhanorte (Itaú Apple Pay)", "Revestimentos — cartão 8× de 1.210,96 (cupom 9.340,92 + 346,76)", 9687.68),
    ("25/05/26", "Staccato rev.", "Porcelanato banhos — SafraPay 5×", 15280.51),
    ("27/05/26", "Fratelli", "Reforma civil — parc. 2 (NF-500)", 45388.36),
    ("01/06/26", "TJK", "Impermeabilização — pagto 2", 2000.00),
    ("03/06/26", "Caixa de Fogo (Rede)", "Churrasqueira — cartão 10×", 7272.00),
    ("04/06/26", "Fratelli", "Gerenciamento parc. 2", 12502.30),
    ("05/06/26", "TJK", "Impermeabilização — pagto 3", 9000.00),
    ("11/06/26", "BHP", "Ar-condicionado — parcela NF", 1430.00),
    ("19/06/26", "TJK", "Impermeabilização — pagto 4 (quitação NF-263)", 9498.80),
    ("19/06/26", "Alucustom", "Caixilhos — parc. 2 (boleto venc. 20/06)", 13434.00),
    ("21/06/26", "Unimóveis (F. Limonta)", "Marcenaria — parc. 2/5 (recibo)", 44000.00),
    ("29/06/26", "Fratelli", "Reforma civil — parc. 3", 45388.36),
    ("29/06/26", "Staccato", "Marmoraria — 2ª parcela (boleto)", 32660.00),
    ("03/07/26", "Fratelli", "Gerenciamento parc. 3", 13354.78),
    ("20/07/26", "Unimóveis (F. Limonta)", "Marcenaria — parc. 3/5", 44000.00),
    ("20/07/26", "Alucustom", "Caixilhos — parc. 3 (boleto)", 13434.00),
    ("27/07/26", "Fratelli", "Reforma civil — parc. 4 (NF-04 arquivada)", 45388.36),
    ("27/07/26", "Bracci", "Louças e metais — Getnet 6× de 3.943,36", 23660.15),
    ("28/07/26", "Staccato", "Marmoraria — 3ª parcela (boleto)", 32660.00),
    ("29/07/26", "Loja Franke", "Cubas Franke 68x41 (2 un) — cartão 8×", 4663.92),
    ("29/07/26", "Centro do Encanador (ML)", "Misturador monocomando — cartão 1×", 1545.09),
    ("30/07/26", "Dexco (Deca)", "Torneira Deca parede Beta — cartão 5×", 431.86),
    ("05/08/26", "Fratelli", "Gerenciamento parc. 4 (Pix; NF pendente)", 11345.78),
    ("07/08/26", "Piso Piso Arte", "Deck cumaru — cartão SumUp 5× de 7.697 (NFS-e 316)", 38485.00),
    ("10/08/26", "Mirian Virgílio da Silva", "Serralheria Márcio — Pix (NFS-e 7 de 13/08)", 16604.50),
    ("19/08/26", "Pastilhas piscina (e-commerce)", "Pastilha Azul Aracati + argamassa — cartão 3×", 386.25),
    ("20/08/26", "Casa dos Aquecedores", "Tampão 80×80 casa de máquinas — C6 4× (Orç. 17275)", 2665.00),
    ("20/08/26", "Portobello Shop Gabriel", "Revestimentos (pedido 01554539) — PagBank 4×", 4970.47),
    ("20/08/26", "Unimóveis (F. Limonta)", "Marcenaria — parc. 4/5 (Pix)", 44000.00),
    ("26/08/26", "Andra Elétrica", "Materiais elétricos P22621 — cartão 3× de 2.080", 6240.00),
    ("27/08/26", "Fratelli", "Reforma civil — parc. 5 (NF-05 arquivada)", 45388.36),
    ("28/08/26", "Staccato", "Marmoraria — 4ª parcela (confirmada pelo Daniel em 23/10; sem comprovante na pasta)", 32660.00),
    ("03/09/26", "Andra Elétrica (Cielo)", "Luminárias LED P23432 — cartão 6× de 1.260,40", 7562.44),
    ("04/09/26", "Fratelli", "Gerenciamento parc. 5 (Pix; NF pendente)", 13636.10),
    ("17/09/26", "Andra Elétrica (cartão)", "Suportes e tomadas Orion — NFC-e 33985", 394.28),
    ("18/09/26", "Mercado Livre (Visa 1×)", "Tomadas Schneider USB A+C, 6 un (NF-e pendente; entrega 25–26/09)", 884.58),
    ("24/09/26", "Lustres Yamamura", "Luminárias — pedido 6784994 (Visa 1.017,91 + vale-crédito 864,19; NFC-e 14700)", 1882.10),
    ("28/09/26", "Fratelli", "Reforma civil — parc. 6 (Pix; NF pendente)", 45388.36),
    ("06/10/26", "Fratelli", "Gerenciamento parc. 6 (Pix; NF pendente)", 3925.23),
    ("06/10/26", "Cielo (link de pagamento)", "LED do marceneiro — 6× de 284,61 (fornecedor a confirmar)", 1707.70),
    ("13/10/26", "Hidrauli (C6)", "Bomba piscina Eberle 1/3 cv — proposta 17728, C6 4×", 1255.00),
    ("27/10/26", "Piso Piso Arte (cartão 4×)", "Restauração piso/escada + adequações do deck — NFS-e 319 (valor = 24.730 − 830; divisão inferida, confirmado pelo Daniel em 30/10)", 23900.00),
    ("27/10/26", "Piso Piso Arte (SumUp)", "Complemento — cobrança anterior saiu errada (comprovante SumUp 18:50)", 830.00),
]
tot_pagos_geral = sum(p[3] for p in pagamentos)

pct_pago = 100*pago_civil/TOTAL_PROPOSTA
pct_fat = 100*fat_civil/TOTAL_PROPOSTA

# ============================================================
# Evolução física (curva S) + desembolsos programados — Rev.04A (aprox.)
# ============================================================
PROJ_AJUSTADA = projecao_ajustada
REALIZADO = desembolsado_total
assert abs(REALIZADO - tot_pagos_geral) < 0.02, f"ledger {tot_pagos_geral} != itens {REALIZADO}"

curva_real = [
    ("abr/26", 187904.50),
    ("mai/26", 440750.13),
    ("jun/26", 617935.59),
    ("jul/26", 797073.75),
    ("ago/26", 999819.11),   # 967.159,11 + Staccato 28/08 (32.660)
    ("set/26", 1069566.97),  # fechado em 30/09 (1.036.906,97 + 32.660)
    ("out/26", REALIZADO),   # parcial até 30/10
]
PRE_OBRA = 51124.50

ger_rest = 98756.19 - 68862.59
assert abs(ger_rest - 29893.60) < 0.01
ger_mes = ger_rest / 5
prog = {
    "out/26": [("Unimóveis parc. 5 (venc. ~21/09, a confirmar)", 44000.00, True),
                ("Alucustom parc. 4 (venc. 20/08, a confirmar)", 13432.00, True),
                ("Gerenciamento (est.)", ger_mes, False),
                ("Louças/metais — saldo do orçado (est.)", 16067.14, False)],
    "nov/26": [("Gerenciamento (est.)", ger_mes, False)],
    "dez/26": [("Gerenciamento (est.)", ger_mes, False)],
    "jan/27": [("Gerenciamento (est.)", ger_mes, False)],
    "fev/27": [("Fratelli reforma parc. 7 — conclusão da instalação da marcenaria (aditivo)", 45388.36, False),
               ("Gerenciamento (est.)", ger_mes, False)],
    "mar/27": [("Fratelli reforma parc. 8 — entrega definitiva com Termo (aditivo)", 45388.36, False)],
}
ja_alocado = sum(v for lst in prog.values() for _, v, _ in lst)
bucket = PROJ_AJUSTADA - REALIZADO - ja_alocado
RATEIO = (("out/26", .20), ("nov/26", .20), ("dez/26", .10), ("jan/27", .25), ("fev/27", .20), ("mar/27", .05))
assert abs(sum(f for _, f in RATEIO) - 1) < 1e-9
for m, fr in RATEIO:
    prog[m].append(("Acabamentos não contratados (rateio est.)", bucket*fr, False))

MESES_EVO = ["abr/26", "mai/26", "jun/26", "jul/26", "ago/26", "set/26", "out/26", "nov/26", "dez/26", "jan/27", "fev/27", "mar/27"]
MESES_PROG = ["out/26", "nov/26", "dez/26", "jan/27", "fev/27", "mar/27"]
curva_proj = []
acum = REALIZADO
for m in MESES_PROG:
    acum += sum(v for _, v, _ in prog[m])
    curva_proj.append((m, acum))

# fases físicas (abr=0 … mar/27=11) — Rev.04A aproximada (15/10): mudança na 3ª semana de mar/27
fases = [
    ("Demolição e obra civil pesada", 0, 3.0, True),
    ("Hidráulica, elétrica e pintura 1ª etapa — Fratelli", 2, 5.3, False),
    ("Serralherias, pisos e revestimentos", 3, 5.8, False),
    ("Deck cumaru e piso de madeira (Piso Piso)", 4, 6.9, True),
    ("Marmoraria — produção → última bancada ~02/12 (Staccato)", 5, 8.1, False),
    ("Marcenaria — produção out–jan (recesso dez) → instalação fev", 6, 10.9, False),
    ("Acabamentos finais (louças, banheira, box, pintura)", 10, 11.3, False),
    ("Recesso de fim de ano (2 semanas)", 8.5, 9.0, False),
    ("Limpezas finais e MUDANÇA (3ª semana de mar/27)", 11.3, 11.7, False),
]

# ---------- SVG: curva S ----------
W, HC, ML, MR, MT, MB = 920, 320, 52, 16, 18, 34
PW, PH = W-ML-MR, HC-MT-MB
def xm(i): return ML + PW*i/(len(MESES_EVO)-1)
def yp(pct): return MT + PH*(1-pct/100)
def pts(seq):
    return " ".join(f"{xm(i):.1f},{yp(p):.1f}" for i, p in seq)
real_seq = [(MESES_EVO.index(m), 100*v/PROJ_AJUSTADA) for m, v in curva_real]
proj_seq = [real_seq[-1]] + [(MESES_EVO.index(m), 100*v/PROJ_AJUSTADA) for m, v in curva_proj]
grid = "".join(f'<line x1="{ML}" y1="{yp(g):.1f}" x2="{W-MR}" y2="{yp(g):.1f}" class="gl"/>'
               f'<text x="{ML-8}" y="{yp(g)+4:.1f}" class="ax" text-anchor="end">{g}%</text>' for g in (0,25,50,75,100))
xlabels = "".join(f'<text x="{xm(i):.1f}" y="{HC-10}" class="ax" text-anchor="middle">{m}</text>' for i, m in enumerate(MESES_EVO))
dots = ""
for (i, p), (m, v) in zip(real_seq, curva_real):
    dots += (f'<circle cx="{xm(i):.1f}" cy="{yp(p):.1f}" r="4.5" class="dot-r hv" '
             f'data-tip="<b>{m} (realizado)</b><br>R$ {br(v,2)} acumulado · {p:.1f}% da projeção"/>')
for (m, v) in curva_proj:
    i, p = MESES_EVO.index(m), 100*v/PROJ_AJUSTADA
    dots += (f'<circle cx="{xm(i):.1f}" cy="{yp(p):.1f}" r="4.5" class="dot-p hv" '
             f'data-tip="<b>{m} (previsto)</b><br>R$ {br(v,2)} acumulado · {p:.1f}% da projeção"/>')
pct_real_lbl = f"{real_seq[-1][1]:.1f}".replace(".", ",") + "%"
lbl_last = (f'<text x="{xm(real_seq[-1][0]):.1f}" y="{yp(real_seq[-1][1])-12:.1f}" class="lb lb-r" text-anchor="middle">{pct_real_lbl}</text>'
            f'<text x="{xm(len(MESES_EVO)-1)-4:.1f}" y="{yp(100)-10:.1f}" class="lb lb-p" text-anchor="end">100% · mar/27 (mudança — Rev.04A)</text>')
svg_curva = f"""<svg viewBox="0 0 {W} {HC}" role="img" aria-label="Curva S de evolução física prevista da obra">
{grid}{xlabels}
<polyline points="{pts(real_seq)}" class="ln-r"/>
<polyline points="{pts(proj_seq)}" class="ln-p"/>
{dots}{lbl_last}
</svg>"""

# ---------- SVG: gantt de fases ----------
GH, ROWH, GML = 30+len(fases)*34+26, 34, 330
GW = W
gpw = GW-GML-MR
HOJE = 6.97  # 30/10 = out (6) + 30/31
DEN = len(MESES_EVO) - 1 + 0.8
def gx(t): return GML + gpw*t/DEN
gantt = ""
for k, (nome, ini, fim, done) in enumerate(fases):
    y = 12 + k*ROWH
    x1, x2 = gx(ini), gx(fim)
    lim = gx(HOJE)  # hoje ≈ 30/10
    gantt += f'<text x="{GML-10}" y="{y+15}" class="gt" text-anchor="end">{H.escape(nome)}</text>'
    if done or ini < HOJE:
        xa = min(x2, lim)
        gantt += f'<rect x="{x1:.1f}" y="{y}" width="{max(xa-x1,2):.1f}" height="20" rx="4" class="gb-r hv" data-tip="<b>{H.escape(nome)}</b><br>trecho já executado"/>'
        if x2 > lim and not done:
            gantt += f'<rect x="{lim+2:.1f}" y="{y}" width="{x2-lim-2:.1f}" height="20" rx="4" class="gb-p hv" data-tip="<b>{H.escape(nome)}</b><br>trecho previsto"/>'
    else:
        gantt += f'<rect x="{x1:.1f}" y="{y}" width="{x2-x1:.1f}" height="20" rx="4" class="gb-p hv" data-tip="<b>{H.escape(nome)}</b><br>previsto"/>'
glabels = "".join(f'<text x="{gx(i):.1f}" y="{GH-8}" class="ax" text-anchor="middle">{m}</text>' for i, m in enumerate(MESES_EVO))
gnow = f'<line x1="{gx(HOJE):.1f}" y1="4" x2="{gx(HOJE):.1f}" y2="{GH-24}" class="now"/><text x="{gx(HOJE)+5:.1f}" y="14" class="ax">hoje (30/10)</text>'
svg_gantt = f'<svg viewBox="0 0 {GW} {GH}" role="img" aria-label="Fases físicas da obra ao longo dos meses">{glabels}{gnow}{gantt}</svg>'

# ---------- SVG: barras de desembolso programado ----------
bar_meses = MESES_PROG
bar_data = []
for m in bar_meses:
    c = sum(v for _, v, f in prog[m] if f)
    e = sum(v for _, v, f in prog[m] if not f)
    det = "<br>".join(f"{H.escape(n)}: R$ {br(v,2)}" for n, v, _ in prog[m])
    bar_data.append((m, c, e, det))
bmax = max(c+e for _, c, e, _ in bar_data)
BW, BH2, BML, BMB = 920, 260, 52, 34
bpw, bph = BW-BML-MR, BH2-MT-BMB
slot = bpw/len(bar_data)
def by(v): return MT + bph*(1-v/(bmax*1.12))
bars = ""
for k, (m, c, e, det) in enumerate(bar_data):
    xc = BML + slot*k + slot*0.5
    wbar = min(slot*0.52, 64)
    y0 = MT + bph
    yc, ye = by(c), by(c+e)
    tip = f"<b>{m}</b> — total R$ {br(c+e,2)}<br>{det}"
    if c > 0:
        bars += f'<rect x="{xc-wbar/2:.1f}" y="{yc:.1f}" width="{wbar:.1f}" height="{y0-yc:.1f}" rx="4" class="gb-r hv" data-tip="{tip}"/>'
    if e > 0:
        bars += f'<rect x="{xc-wbar/2:.1f}" y="{ye:.1f}" width="{wbar:.1f}" height="{max(yc-ye-2,2):.1f}" rx="4" class="gb-p hv" data-tip="{tip}"/>'
    bars += (f'<text x="{xc:.1f}" y="{ye-7:.1f}" class="lb" text-anchor="middle">{(c+e)/1000:.0f} mil</text>'
             f'<text x="{xc:.1f}" y="{BH2-10}" class="ax" text-anchor="middle">{m}</text>')
svg_bars = f'<svg viewBox="0 0 {BW} {BH2}" role="img" aria-label="Desembolsos programados por mês">{bars}</svg>'

tot_prog_tabela = "".join(
    f'<tr><td>{m}</td><td class="num">R$ {br(c,2)}</td><td class="num">R$ {br(e,2)}</td><td class="num"><b>R$ {br(c+e,2)}</b></td></tr>'
    for m, c, e, _ in bar_data)
top2 = sorted(bar_data, key=lambda b: -(b[1]+b[2]))[:2]
top2_txt = " e ".join(f"<b>{b[0]} (~R$ {br(b[1]+b[2])})</b>" for b in sorted(top2, key=lambda b: MESES_PROG.index(b[0])))

secao_evolucao = f"""
<h2>Evolução física prevista da obra (curva S)</h2>
<div class="muted" style="font-size:12.5px;margin:-4px 0 10px">Curva calibrada ao <b>cronograma Rev.04A da gerenciadora (Salvador Arq., 15/10)</b> e ao aditivo Fratelli em negociação: <b>mudança na 3ª semana de mar/27</b>, com recesso de 2 semanas em dez.
Avanço = R$ pagos ÷ projeção ajustada de R$ {br(PROJ_AJUSTADA,2)} (proxy financeiro do físico; a distribuição mensal do previsto é estimativa).
Antes de abr/26: projetos e pré-obra (R$ {br(PRE_OBRA,2)}, já no acumulado).</div>
<div class="card">
  {svg_curva}
  <div class="legenda" style="margin-top:6px">
    <span class="l-pago">Realizado (comprovantes até 30/10 — {pct_real_lbl})</span>
    <span class="l-fat">Previsto (contratos + estimativas)</span>
  </div>
</div>

<h2>Fases físicas ao longo do tempo (cronograma Rev.04A, aproximado)</h2>
<div class="card">
  {svg_gantt}
  <div class="muted" style="font-size:12px;margin-top:6px">Fases conforme o Rev.04A (Salvador Arquitetura, 15/10/26), desenhadas de forma aproximada a partir do que consta nos documentos do projeto: Staccato com última bancada prevista ~02/12; marcenaria produz out–jan com recesso de 2 semanas em dez e instala em fev; acabamentos finais em fev–mar; limpezas e <b>mudança na 3ª semana de mar/27</b>. Rev.04A tem 3 semanas a menos que a Rev.02 (17/08); datas definitivas dependem do aditivo e da Staccato.</div>
</div>

<h2>Onde concentram os desembolsos programados</h2>
<div class="card">
  {svg_bars}
  <div class="legenda" style="margin-top:2px">
    <span class="l-pago">Contratado com data</span>
    <span class="l-fat">Estimado (parcelas 7–8 da Fratelli pelo aditivo, gerenciamento e rateio dos acabamentos)</span>
  </div>
  <details style="margin-top:8px"><summary>Tabela mês a mês</summary>
  <table style="margin-top:6px"><tr><th>Mês</th><th class="num">Contratado</th><th class="num">Estimado</th><th class="num">Total</th></tr>{tot_prog_tabela}</table></details>
  <div class="muted" style="font-size:12px;margin-top:8px">Maiores concentrações: {top2_txt}. Out/26 reúne os vencidos a confirmar, louças e rateio; fev e mar/27 trazem as parcelas 7 e 8 da Fratelli (aditivo), na instalação da marcenaria e na entrega definitiva.
  Base = mês da compra/parcela contratual (fluxo de fatura dos cartões já tem tabela própria acima). Rateio dos acabamentos não contratados: 20/20/10/25/20/5% entre out e mar (estimativa).</div>
</div>
"""

# ---------- HTML ----------
def barra(nome, orc, contr, pago, fat, nota):
    base = contr if contr else orc
    ppct = 100*pago/base if base else 0
    fpct = 100*fat/base if base else 0
    saldo = base - pago - fat
    ref = f"contratado · orçado era {br(orc)}" if contr and abs(contr-orc)>1 else "orçado"
    done = saldo <= 1
    pct_lbl = f"{(ppct+fpct):.0f}%"
    saldo_lbl = "✓ concluído" if done else f"falta <b>R$ {br(max(saldo,0))}</b>"
    return f"""
    <div class="item" title="{H.escape(nota)}">
      <div class="item-head">
        <span class="item-nome">{H.escape(nome)}</span>
        <span class="item-vals">R$ {br(pago+fat)} de R$ {br(base)} <span class="muted">({ref})</span> · {saldo_lbl}</span>
      </div>
      <div class="track">
        <div class="fill pago" style="width:{min(ppct,100):.2f}%"></div>
        <div class="fill fat" style="width:{min(fpct,100-min(ppct,100)):.2f}%"></div>
        <span class="pct">{pct_lbl}</span>
      </div>
      <div class="item-nota">{H.escape(nota)}</div>
    </div>"""

itens_html = "\n".join(barra(*i) for i in itens)

max_no = max(i[1] + i[2] for i in nao_orcados)
no_html = ""
for nome, p, f, nota in nao_orcados:
    tot = p + f
    w = 100 * tot / max_no
    wp = w * (p / tot) if tot else 0
    wf = w * (f / tot) if tot else 0
    det = f"R$ {br(p, 2)} pago" + (f" + R$ {br(f, 2)} a confirmar" if f else "")
    no_html += f"""
    <div class="item">
      <div class="item-head">
        <span class="item-nome">{H.escape(nome)}</span>
        <span class="item-vals"><b>R$ {br(tot, 2)}</b> <span class="muted">({det})</span></span>
      </div>
      <div class="track" style="background:transparent">
        <div class="fill pago" style="width:{wp:.2f}%; border-radius:4px 0 0 4px"></div>
        <div class="fill fat" style="width:{wf:.2f}%; border-radius:0 4px 4px 0"></div>
      </div>
      <div class="item-nota">{H.escape(nota)}</div>
    </div>"""

ni_rows = "\n".join(
    f'<tr><td>{H.escape(n)}</td><td class="num">R$ {br(v)}</td></tr>' for n, v in nao_iniciados)

agenda_html = ""
for mes, lst in agenda:
    tot = sum(v for _, v, _ in lst)
    rows = "\n".join(
        f'<tr class="{"warn" if w else ""}"><td>{H.escape(d)}</td><td class="num">R$ {br(v)}</td></tr>'
        for d, v, w in lst)
    agenda_html += f"""
    <div class="mes">
      <div class="mes-head"><span>{mes}</span><span class="mes-tot">R$ {br(tot)}</span></div>
      <table>{rows}</table>
    </div>"""

cartoes_html = ""
for am in sorted(fluxo_cartao):
    lst = fluxo_cartao[am]
    mes_lbl = f"{MESES_PT[am[1]]}/{str(am[0])[2:]}"
    det = " + ".join(n.split(" (")[0] for n, _ in lst)
    cartoes_html += (f'<tr><td><b>{mes_lbl}</b><br><span class="muted" style="font-size:11px">{H.escape(det)}</span></td>'
                     f'<td class="num">R$ {br(sum(v for _, v in lst), 2)}</td></tr>\n')
cartoes_html += (f'<tr><td><b>TOTAL POR VIR NO CARTÃO</b></td>'
                 f'<td class="num"><b>R$ {br(TOTAL_CARTAO_VIR, 2)}</b></td></tr>')
cartoes_det_html = "\n".join(
    f'<tr><td>{H.escape(n)}</td><td class="num">R$ {br(p,2)}/mês</td><td class="num">R$ {br(r,2)}</td><td class="muted">até {ate}</td></tr>'
    for n, r, p, ate in cart_por_vir)

alertas_html = "\n".join(
    f'<div class="alerta"><b>{H.escape(t)}</b><br>{H.escape(d)}</div>' for t, d in alertas)

pag_rows = "\n".join(
    f'<tr><td>{d}</td><td>{H.escape(f)}</td><td>{H.escape(desc)}</td><td class="num">R$ {br(v,2)}</td></tr>'
    for d, f, desc, v in pagamentos)

html_doc = f"""<!DOCTYPE html>
<html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Obra Casa 4 Palm Hill — Acompanhamento Financeiro</title>
<style>
:root {{
  color-scheme: light;
  --surface: #fcfcfb; --card: #ffffff; --border: #e8e7e3;
  --ink: #0b0b0b; --ink2: #52514e; --muted: #8a8984;
  --pago: #2a78d6; --fat: #eb6834; --track: #f0efec;
  --ok: #008300; --warnbg: #fdf3ef;
}}
@media (prefers-color-scheme: dark) {{
  :root {{
    color-scheme: dark;
    --surface: #1a1a19; --card: #222220; --border: #3a3a37;
    --ink: #ffffff; --ink2: #c3c2b7; --muted: #8a8984;
    --pago: #3987e5; --fat: #d95926; --track: #383835;
    --warnbg: #33231d;
  }}
}}
* {{ box-sizing: border-box; }}
body {{ margin: 0; background: var(--surface); color: var(--ink);
  font: 14px/1.5 -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }}
.wrap {{ max-width: 980px; margin: 0 auto; padding: 24px 20px 48px; }}
h1 {{ font-size: 21px; margin: 0 0 2px; }}
.sub {{ color: var(--ink2); margin-bottom: 20px; }}
h2 {{ font-size: 15px; margin: 30px 0 10px; letter-spacing: .01em; }}
.muted {{ color: var(--muted); }}
.num {{ text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }}
.kpis {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(210px,1fr)); gap: 10px; }}
.kpi {{ background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; }}
.kpi .lbl {{ font-size: 12px; color: var(--ink2); }}
.kpi .val {{ font-size: 24px; font-weight: 700; margin-top: 2px; font-variant-numeric: tabular-nums; }}
.kpi .det {{ font-size: 12px; color: var(--muted); margin-top: 2px; }}
.kpi.pago .val {{ color: var(--pago); }}
.kpi.fat .val {{ color: var(--fat); }}
.meter {{ margin: 16px 0 4px; }}
.meter .track {{ height: 22px; }}
.track {{ position: relative; background: var(--track); border-radius: 5px; height: 16px;
  display: flex; overflow: hidden; }}
.fill {{ height: 100%; }}
.fill.pago {{ background: var(--pago); border-radius: 4px 0 0 4px; }}
.fill.fat {{ background: var(--fat); margin-left: 2px; }}
.pct {{ position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  font-size: 11px; font-weight: 600; color: var(--ink2); }}
.legenda {{ display: flex; gap: 18px; font-size: 12px; color: var(--ink2); margin: 8px 0 0; flex-wrap: wrap; }}
.legenda span::before {{ content: ""; display: inline-block; width: 10px; height: 10px;
  border-radius: 3px; margin-right: 6px; vertical-align: -1px; }}
.legenda .l-pago::before {{ background: var(--pago); }}
.legenda .l-fat::before {{ background: var(--fat); }}
.legenda .l-saldo::before {{ background: var(--track); border: 1px solid var(--border); }}
.item {{ background: var(--card); border: 1px solid var(--border); border-radius: 10px;
  padding: 12px 16px; margin-bottom: 8px; }}
.item-head {{ display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 7px; }}
.item-nome {{ font-weight: 600; }}
.item-vals {{ font-size: 12.5px; color: var(--ink2); }}
.item-nota {{ font-size: 12px; color: var(--muted); margin-top: 6px; }}
table {{ width: 100%; border-collapse: collapse; }}
td, th {{ padding: 6px 8px; border-bottom: 1px solid var(--border); font-size: 13px; vertical-align: top; }}
th {{ text-align: left; color: var(--ink2); font-weight: 600; font-size: 12px; }}
tr:last-child td {{ border-bottom: none; }}
tr.warn td {{ background: var(--warnbg); }}
.grid2 {{ display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }}
@media (max-width: 720px) {{ .grid2 {{ grid-template-columns: 1fr; }} }}
.card {{ background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; }}
.mes {{ margin-bottom: 12px; }}
.mes-head {{ display: flex; justify-content: space-between; font-weight: 600; margin-bottom: 4px; }}
.mes-tot {{ font-variant-numeric: tabular-nums; }}
.total-card {{ padding: 18px 20px; }}
.total-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(240px,1fr)); gap: 18px; }}
.total-card .lbl {{ font-size: 12px; color: var(--ink2); }}
.hero {{ font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums; margin-top: 2px; }}
.total-card .det {{ font-size: 12px; margin-top: 3px; }}
.alerta {{ background: var(--warnbg); border: 1px solid var(--border); border-left: 3px solid var(--fat);
  border-radius: 8px; padding: 10px 14px; margin-bottom: 8px; font-size: 13px; }}
details {{ margin-top: 10px; }}
summary {{ cursor: pointer; font-weight: 600; font-size: 13px; color: var(--ink2); }}
.rodape {{ margin-top: 34px; font-size: 12px; color: var(--muted); border-top: 1px solid var(--border); padding-top: 12px; }}
svg {{ width: 100%; height: auto; display: block; }}
.gl {{ stroke: var(--border); stroke-width: 1; }}
.ax {{ font-size: 11px; fill: var(--muted); }}
.gt {{ font-size: 12px; fill: var(--ink2); }}
.lb {{ font-size: 11.5px; font-weight: 600; fill: var(--ink2); }}
.lb-r {{ fill: var(--pago); }} .lb-p {{ fill: var(--fat); }}
.ln-r {{ fill: none; stroke: var(--pago); stroke-width: 2.5; }}
.ln-p {{ fill: none; stroke: var(--fat); stroke-width: 2.5; stroke-dasharray: 6 5; }}
.dot-r {{ fill: var(--pago); stroke: var(--card); stroke-width: 2; }}
.dot-p {{ fill: var(--fat); stroke: var(--card); stroke-width: 2; }}
.gb-r {{ fill: var(--pago); }} .gb-p {{ fill: var(--fat); }}
.now {{ stroke: var(--muted); stroke-width: 1.5; stroke-dasharray: 3 3; }}
.hv {{ cursor: pointer; }}
#tt {{ position: fixed; z-index: 9; background: var(--card); border: 1px solid var(--border);
  border-radius: 8px; padding: 8px 10px; font-size: 12px; color: var(--ink);
  box-shadow: 0 4px 14px rgba(0,0,0,.14); pointer-events: none; display: none; max-width: 320px; }}
</style></head>
<body><div class="wrap">
<h1>Obra Casa 4 Palm Hill — Acompanhamento Financeiro</h1>
<div class="sub">Orçamento R01 (02/04/26) × comprovantes de pagamento · atualizado até {DATA_CORTE}</div>

<div class="kpis">
  <div class="kpi"><div class="lbl">Orçamento da obra (proposta civil R01)</div>
    <div class="val">R$ {br(TOTAL_PROPOSTA)}</div><div class="det">37 itens, inclui 5% omissos + 10% gerenciamento</div></div>
  <div class="kpi pago"><div class="lbl">Pago com comprovante</div>
    <div class="val">R$ {br(pago_civil)}</div><div class="det">{pct_pago:.1f}% do orçamento</div></div>
  <div class="kpi fat"><div class="lbl">Faturado / parcelado a confirmar</div>
    <div class="val">R$ {br(fat_civil)}</div><div class="det">NF ou cartão sem comprovante de liquidação</div></div>
  <div class="kpi"><div class="lbl">Falta pagar (estimado)</div>
    <div class="val">R$ {br(saldo_est)}</div><div class="det">{100-pct_pago-pct_fat:.1f}% do orçamento</div></div>
</div>

<div class="meter">
  <div class="track">
    <div class="fill pago" style="width:{pct_pago:.2f}%"></div>
    <div class="fill fat" style="width:{pct_fat:.2f}%"></div>
    <span class="pct">{pct_pago+pct_fat:.1f}% executado</span>
  </div>
  <div class="legenda">
    <span class="l-pago">Pago (comprovante)</span>
    <span class="l-fat">Faturado / a confirmar</span>
    <span class="l-saldo">Falta pagar</span>
  </div>
</div>

<h2>Custo total da obra</h2>
<div class="card total-card">
  <div class="total-grid">
    <div>
      <div class="lbl">Desembolsado até hoje (com comprovante)</div>
      <div class="hero" style="color:var(--pago)">R$ {br(desembolsado_total, 2)}</div>
      <div class="det muted">obra R$ {br(pago_civil)} + fora do orçamento R$ {br(pago_no, 2)}</div>
    </div>
    <div>
      <div class="lbl">Comprometido (pago + faturado/parcelado)</div>
      <div class="hero">R$ {br(comprometido_total, 2)}</div>
      <div class="det muted">{100*comprometido_total/projecao_total:.1f}% da projeção total</div>
    </div>
    <div>
      <div class="lbl">Projeção de custo total da obra</div>
      <div class="hero">R$ {br(projecao_total, 2)}</div>
      <div class="det muted">orçamento R01 (R$ {br(TOTAL_PROPOSTA)}) + não orçados (R$ {br(tot_no, 2)})<br>
      ajustada pelos contratos já fechados: <b>R$ {br(projecao_ajustada, 2)}</b> ({'−' if delta_contratos < 0 else '+'}R$ {br(abs(delta_contratos))})</div>
    </div>
  </div>
</div>

{secao_evolucao}

<h2>Itens em andamento — pago × previsto</h2>
{itens_html}

<h2>Ainda não iniciado / sem pagamento — R$ {br(tot_nao_iniciado)}</h2>
<div class="card">
  <table>{ni_rows}
  <tr><td><b>Total não iniciado</b></td><td class="num"><b>R$ {br(tot_nao_iniciado)}</b></td></tr></table>
  <div class="muted" style="font-size:12px;margin-top:8px">Saíram desta lista: louças/metais (27/07), serralheria Márcio (11/08), acabamentos elétricos (26/08) e tratamento do piso de madeira (Piso Piso, 27/10), já com pagamentos.</div>
</div>

<div class="grid2">
  <div>
    <h2>Agenda de desembolsos já contratados</h2>
    <div class="card">{agenda_html}
      <div class="muted" style="font-size:12px">Linhas destacadas = vencidas ou sem comprovante — confirmar antes de reprogramar.</div>
    </div>
  </div>
  <div>
    <h2>Cartão de crédito — parcelas por vir, mês a mês</h2>
    <div class="card">
      <table>
        <tr><th>Mês (fatura)</th><th class="num">Total no cartão</th></tr>
        {cartoes_html}
      </table>
      <details style="margin-top:8px">
        <summary>Detalhe por contrato</summary>
        <table style="margin-top:6px">
          <tr><th>Contrato</th><th class="num">Parcela</th><th class="num">Restante</th><th>Última</th></tr>
          {cartoes_det_html}
        </table>
      </details>
      <div class="muted" style="font-size:12px;margin-top:8px">Estas parcelas já estão contadas nos totais (compra fechada) — a tabela é visão de fluxo de caixa da fatura. Premissa: faturas até ago/26 pagas.</div>
    </div>
  </div>
</div>

<h2>Itens não orçados e realizados — R$ {br(tot_no, 2)}</h2>
<div class="muted" style="font-size:12.5px;margin:-4px 0 10px">Gastos que não constam na proposta civil R01 (projetos e pré-obra). Já somados na projeção de custo total acima.</div>
{no_html}
<div class="item" style="border-left:3px solid var(--pago)">
  <div class="item-head">
    <span class="item-nome">Total não orçado realizado</span>
    <span class="item-vals"><b>R$ {br(tot_no, 2)}</b> <span class="muted">(R$ {br(pago_no, 2)} pago + R$ {br(fat_no, 2)} a confirmar)</span></span>
  </div>
</div>

<h2>Pontos de atenção</h2>
{alertas_html}

<details>
  <summary>Todos os pagamentos comprovados ({len(pagamentos)} lançamentos · R$ {br(tot_pagos_geral,2)})</summary>
  <div class="card" style="margin-top:8px">
  <table>
    <tr><th>Data</th><th>Fornecedor</th><th>Referência</th><th class="num">Valor</th></tr>
    {pag_rows}
  </table></div>
</details>

<div class="rodape">
Fontes: planilha de orçamento “SADANIEL E RENATAR01.xlsx” (R01, 02/04/26) e os comprovantes das pastas
Comprov Pagto Obra/2025 e 2026 (Pix, recibos, NFs, contratos e pedidos), conciliados até 30/10/26. Valores “pago” exigem comprovante de
liquidação (Pix, cartão aprovado ou recibo assinado); NFs e boletos sem comprovante entram como “a confirmar”. Exceções informadas pelo Daniel: Bracci (28/09), Staccato 4ª parcela (23/10) e Piso Piso (30/10).
NF de gerenciamento 518 (cancelada) substituída pela 521 — contada uma única vez.
Fases físicas conforme cronograma Rev.04A da gerenciadora (15/10/26, mudança na 3ª semana de mar/27, desenho aproximado) e aditivo Fratelli (22–26/10); a distribuição financeira mensal do previsto é estimativa do Claude.
</div>
<div id="tt"></div>
<script>
(function() {{
  var tt = document.getElementById('tt');
  document.querySelectorAll('.hv').forEach(function(el) {{
    el.addEventListener('mousemove', function(ev) {{
      tt.innerHTML = el.getAttribute('data-tip');
      tt.style.display = 'block';
      var x = Math.min(ev.clientX + 14, window.innerWidth - tt.offsetWidth - 8);
      var y = Math.min(ev.clientY + 14, window.innerHeight - tt.offsetHeight - 8);
      tt.style.left = x + 'px'; tt.style.top = y + 'px';
    }});
    el.addEventListener('mouseleave', function() {{ tt.style.display = 'none'; }});
  }});
}})();
</script>
</div></body></html>"""

with open("/home/claude/obra_casa4_financeiro.html", "w", encoding="utf-8") as f:
    f.write(html_doc)

print("OK", len(html_doc), "bytes")
print(f"pago_civil={pago_civil:,.2f} fat_civil={fat_civil:,.2f} saldo={saldo_est:,.2f} nao_iniciado={tot_nao_iniciado:,.2f}")
print(f"desembolsado={desembolsado_total:,.2f} comprometido={comprometido_total:,.2f} proj_ajustada={projecao_ajustada:,.2f}")
print(f"check pagos gerais: {tot_pagos_geral:,.2f} | %realizado={100*REALIZADO/projecao_ajustada:.2f}")

