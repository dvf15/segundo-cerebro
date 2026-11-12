p = '/tmp/claude-0/-home-claude/1d373f48-ea32-5217-acc9-66547f6844b2/scratchpad/build.js'
s = open(p).read()

def rep(a, b):
    global s
    assert a in s, a[:80]
    s = s.replace(a, b, 1)

def ins_before(marker, code):
    global s
    assert marker in s, marker
    s = s.replace(marker, code + "\n  " + marker, 1)

# ---------- Cadeia de valor ----------
rep('"Loja abrindo mais rápido, obra sem surpresa",', '"Projeto devolvido em dias; loja abrindo mais rápido, obra sem surpresa",')

# ---------- Mapa de contribuição ----------
rep('["Radar de varejo",      "..P..PPSPP"],', '["Radar de varejo regional", "..P..PPSPP"],')

# ---------- Entraves ----------
rep('["Obra do lojista descobre pendência regulatória no fim", "Checklist local e gargalos antecipados desde a assinatura", "Otimizador de obras"],',
    '["Projeto de loja ou quiosque analisado à mão e devolvido em semanas", "Conferência contra o caderno técnico em .md; parecer padrão devolvido em dias", "Otimizador de obras"],')
rep('["Prospecção dependente da rede pessoal de cada gerente", "Radar guiado pelo posicionamento e pela vacância do shopping", "Radar de varejo"],',
    '["Investidor ou marca interessada chega por e-mail ou indicação, sem registro", "Link ou bot único da regional recebe, qualifica e encaminha ao shopping certo", "Radar de varejo regional"],')

# ---------- Time e papéis ----------
rep('c("Renovações, cláusulas, prospecção de marcas e auditoria de boletos")',
    'c("Renovações, cláusulas, radar de varejo regional (canal de investidores e marcas) e auditoria de boletos")')
rep('c("Radar de auditoria, manual operacional e otimizador de obras")',
    'c("Radar de auditoria, manual operacional e otimizador de obras (caderno técnico e devolução de projetos)")')

# ---------- Pilotos: visão ----------
rep('["FaSearch", "Radar de varejo", "Negócios", "Lojas, serviços, gastronomia e entretenimento aderentes ao posicionamento viram pipeline para a vacância", "Operações novas alinhadas ao posicionamento; leads e propostas"],',
    '["FaSearch", "Radar de varejo", "Negócios", "Regional: busca ativa pelo posicionamento + link ou bot único que recebe e qualifica investidores e marcas para a vacância", "Leads qualificados; operações novas alinhadas ao posicionamento"],')
rep('["FaHardHat", "Otimizador de obras", "Operações", "Cronograma, checklist regulatório e gargalos antecipados: a loja vende antes e o tapume sai mais cedo", "Dias entre assinatura e inauguração"],',
    '["FaHardHat", "Otimizador de obras", "Operações", "Caderno técnico em .md, conferência de projetos de lojas e quiosques com devolução em dias, cronograma e gargalos antecipados", "Dias para devolver projeto; dias entre assinatura e inauguração"],')

# ---------- Protocolo ----------
rep('["Dados de entrada", "preparar a entrada pelo conector ou pasta (ex.: PDFs dos boletos por mês)", "Dono do app + TI", "S4–S5", "Entrada disponível"],',
    '["Dados de entrada", "preparar a entrada pelo conector, pasta ou link (ex.: caderno técnico em .md, PDFs dos boletos por mês)", "Dono do app + TI", "S4–S5", "Entrada disponível"],')

# ---------- Especificação ----------
rep('[c("Radar de varejo", { bold: true, color: T.teal9 }), c("Posicionamento do shopping, vacância e mix (conector); pesquisa de marcas"), c("Prioriza lojas, serviços, gastronomia e entretenimento por aderência ao posicionamento e ao espaço vago"), c("Pipeline de leads"), c("Negócios qualifica antes do contato")],',
    '[c("Radar de varejo regional", { bold: true, color: T.teal9 }), c("Posicionamento e vacância de cada shopping; pesquisa de marcas; contatos recebidos pelo link ou bot único"), c("Prioriza lojas, serviços, gastronomia e entretenimento por aderência; qualifica investidores e marcas e indica o shopping certo"), c("Pipeline regional com dossiê por lead"), c("Negócios qualifica e responde em até 48 h")],')
rep('[c("Otimizador de obras", { bold: true, color: T.teal9 }), c("Cronogramas, projetos, checklist regulatório local"), c("Antecipa gargalos e pendências de cada obra"), c("Cronograma com alertas"), c("Operações confirma com o lojista")],',
    '[c("Otimizador de obras", { bold: true, color: T.teal9 }), c("Caderno técnico de obras em .md, checklist regulatório local, projetos de lojas e quiosques, cronogramas"), c("Confere o projeto contra o caderno e o checklist, lista não conformidades citando a seção; antecipa gargalos da obra"), c("Parecer padrão em dias; cronograma com alertas"), c("Engenharia/operações assina o parecer")],')

# ---------- Novos slides: radar regional + obras ----------
novos = r'''// ---------- 12d. Radar de varejo regional — canal único ----------
  {
    const s = content("Radar de varejo regional: um canal único para investidores e marcas", "Frente 3 · Piloto · Radar de varejo",
      "Além de buscar marcas ativamente, a regional passa a receber: um ponto de entrada único para investidores, multifranqueados, lojistas e marcas, com triagem por IA e encaminhamento ao shopping certo.");
    const fl = [
      ["Canal único", "Link centralizado ou bot, divulgado nos shoppings, no site e nas redes"],
      ["Triagem por IA", "Perfil (investidor, operador, marca), segmento, capital, experiência, praças de interesse; consentimento LGPD"],
      ["Qualificação", "Nota de aderência ao posicionamento e à vacância de cada shopping; cruza com o radar ativo"],
      ["Encaminhamento", "Dossiê e próxima ação para o ponto focal e o gerente do shopping; resposta em até 48 h"],
      ["Pipeline", "CRM do radar em 06-dados; status até a proposta; lições voltam ao segundo cérebro"],
    ];
    const bw = 2.2, gap = 0.275;
    fl.forEach(([t, d], i) => {
      const x = 0.6 + i * (bw + gap);
      card(s, x, 2.05, bw, 1.6, i === 2 ? T.teal : T.tint);
      s.addText(t, { x: x + 0.18, y: 2.15, w: bw - 0.36, h: 0.36, fontSize: 14.5, bold: true, color: i === 2 ? T.white : T.teal, margin: 0, isTextBox: true });
      s.addText(d, { x: x + 0.18, y: 2.52, w: bw - 0.36, h: 1.08, fontSize: 11.5, color: i === 2 ? T.off : T.text, margin: 0, valign: "top", isTextBox: true });
      if (i < fl.length - 1) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + bw + 0.04, y: 2.72, w: 0.2, h: 0.28, fill: { color: T.teal5 }, line: { color: T.teal5 } });
    });
    const op = [
      ["Opção A · Link centralizado", "Recomendada para começar", T.tint, T.teal, T.text, [
        "Formulário único da regional (QR code e link) com as perguntas de triagem",
        "Tarefa agendada no Claude lê as respostas, gera o dossiê e avisa o ponto focal",
        "Simples, barato e passa pela esteira padrão (G3)",
      ]],
      ["Opção B · Bot", "Fase 2, depois que o link provar a demanda", T.teal9, T.white, T.off, [
        "Chat (WhatsApp Business ou web) que conversa, faz a triagem e tira dúvidas 24 × 7",
        "Melhor experiência e mais captação; exige integração e validação adicional de SI por ser canal aberto ao público",
        "Decisão na S13 com base no volume e na qualidade dos leads do link",
      ]],
    ];
    op.forEach(([t, sub, bg, tc, bc, b], i) => {
      const x = 0.6 + i * 6.2;
      card(s, x, 3.9, 5.9, 2.0, bg);
      s.addText(t, { x: x + 0.25, y: 4.0, w: 3.6, h: 0.35, fontSize: 15, bold: true, color: tc, margin: 0, isTextBox: true });
      s.addText(sub, { x: x + 3.6, y: 4.02, w: 2.1, h: 0.35, fontSize: 11, italic: true, color: i ? T.off : T.muted, align: "right", margin: 0, isTextBox: true });
      s.addText(bullets(b, { fontSize: 12, color: bc, paraSpaceAfter: 4 }), { x: x + 0.25, y: 4.4, w: 5.4, h: 1.45, valign: "top", margin: 0, isTextBox: true });
    });
    s.addText([{ text: "Regras: ", options: { bold: true, color: T.teal } },
      { text: "o canal nunca negocia, promete espaço ou condição comercial; dados pessoais ficam no CRM, não no segundo cérebro; consentimento LGPD explícito; resposta humana em até 48 h.  ", options: { color: T.text } },
      { text: "Métrica: ", options: { bold: true, color: T.teal } },
      { text: "leads recebidos e qualificados por mês, reuniões, propostas e operações novas aderentes ao posicionamento.", options: { color: T.text } }],
      { x: 0.6, y: 6.05, w: 12.1, h: 0.85, fontSize: 12, margin: 0, valign: "top", isTextBox: true });
  }

  // ---------- 12e. Passo a passo radar regional ----------
  await stepSlide("Passo a passo · radar de varejo regional", "Frente 3 · Piloto · Radar de varejo", [
    ["Escopo regional", "segmentos-alvo por shopping a partir do posicionamento e da vacância; critérios de qualificação (capital, experiência, segmento, praça)", "Ponto focal de negócios", "S3", "Critérios de triagem"],
    ["Canal", "escolher link (opção A) ou bot (opção B); perguntas do formulário ou roteiro do bot; consentimento LGPD validado com Jurídico", "Negócios + Jurídico", "S4", "Canal aprovado"],
    ["Skill de triagem", "instruções em .md: perfil, nota de aderência por shopping, dossiê padrão e respostas permitidas", "Negócios + IA", "S4–S5", "Skill em dev"],
    ["Integração", "formulário → tarefa agendada no Claude → CRM em 06-dados; alertas ao ponto focal e ao gerente do shopping", "TI", "S5", "Fluxo em homologação"],
    ["Back-test", "rodar com contatos antigos (investidores e marcas que já procuraram a regional) e medir a precisão da triagem", "Ponto focal de negócios", "S6", "Taxa de acerto"],
    ["Esteira de segurança (G3)", "validação no Orca, com atenção extra por ser canal exposto ao público; liberação em produção", "TI + SI", "S7", "Canal em produção"],
    ["Divulgação", "QR code e link nos shoppings, site, redes e rede de multifranqueados; o radar ativo alimenta o mesmo pipeline", "Marketing + negócios", "S7–S8", "Canal divulgado"],
    ["Operação e decisão", "SLA de 48 h; revisão semanal do pipeline; na S13 decidir o bot (fase 2) e a replicação", "Ponto focal de negócios", "S7–S13", "Pipeline e decisão"],
  ], "Volume e qualidade dos leads nas primeiras semanas definem se vale investir no bot.");

  // ---------- 12f. Otimizador de obras — caderno técnico ----------
  {
    const s = content("Otimizador de obras: caderno técnico integrado e projeto devolvido em dias", "Frente 3 · Piloto · Otimizador de obras",
      "Cada dia a menos entre assinatura e inauguração é venda para o lojista e menos tapume na experiência do consumidor.");
    const fl = [
      ["Caderno técnico em .md", "Caderno de obras de cada shopping por capítulo: civil, elétrica, hidráulica, ar-condicionado, fachada e sinalização, incêndio, carga — com versão e dono"],
      ["Entrada do projeto", "Lojista ou projetista envia o projeto da loja ou do quiosque por link único, com checklist de documentos obrigatórios"],
      ["Conferência por IA", "Compara o projeto com o caderno técnico e o checklist regulatório local; lista não conformidades citando a seção e o que falta"],
      ["Devolução", "Engenharia valida e devolve o parecer padrão: aprovado, com ressalvas ou reprovado com o que corrigir — dentro do SLA"],
      ["Obra", "Cronograma com marcos, gargalos antecipados e alertas; ao final, as-built e lições voltam ao caderno"],
    ];
    const bw = 2.2, gap = 0.275;
    fl.forEach(([t, d], i) => {
      const x = 0.6 + i * (bw + gap);
      card(s, x, 2.05, bw, 1.95, i === 2 ? T.teal : T.tint);
      s.addText(t, { x: x + 0.18, y: 2.15, w: bw - 0.36, h: 0.36, fontSize: 14.5, bold: true, color: i === 2 ? T.white : T.teal, margin: 0, isTextBox: true });
      s.addText(d, { x: x + 0.18, y: 2.52, w: bw - 0.36, h: 1.42, fontSize: 11.5, color: i === 2 ? T.off : T.text, margin: 0, valign: "top", isTextBox: true });
      if (i < fl.length - 1) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + bw + 0.04, y: 2.9, w: 0.2, h: 0.28, fill: { color: T.teal5 }, line: { color: T.teal5 } });
    });
    card(s, 0.6, 4.25, 5.9, 2.35, T.teal9);
    s.addText("Metas do piloto", { x: 0.85, y: 4.38, w: 5.4, h: 0.35, fontSize: 15, bold: true, color: T.white, margin: 0, isTextBox: true });
    s.addText(bullets([
      "Devolução de projeto: do prazo medido no baseline para 5 dias úteis (meta inicial, a calibrar)",
      "% de projetos aprovados na primeira análise",
      "Dias entre assinatura e inauguração",
      "Zero retrabalho por divergência com o caderno técnico",
    ], { fontSize: 12.5, color: T.off, paraSpaceAfter: 5 }), { x: 0.85, y: 4.78, w: 5.45, h: 1.75, valign: "top", margin: 0, isTextBox: true });
    card(s, 6.8, 4.25, 5.9, 2.35, T.tint);
    s.addText("Regras", { x: 7.05, y: 4.38, w: 5.4, h: 0.35, fontSize: 15, bold: true, color: T.teal, margin: 0, isTextBox: true });
    s.addText(bullets([
      "O parecer é do engenheiro; a IA prepara e cita a seção do caderno",
      "O caderno técnico oficial continua sendo o documento da companhia; a versão .md é cópia controlada, com versão e dono",
      "Toda divergência entre projeto e caderno é registrada; o que se repete vira revisão do próprio caderno",
    ], { fontSize: 12.5, color: T.text, paraSpaceAfter: 5 }), { x: 7.05, y: 4.78, w: 5.45, h: 1.75, valign: "top", margin: 0, isTextBox: true });
  }

  // ---------- 12g. Passo a passo obras ----------
  await stepSlide("Passo a passo · otimizador de obras", "Frente 3 · Piloto · Otimizador de obras", [
    ["Caderno técnico", "reunir a versão vigente do caderno técnico de obras de cada shopping e o padrão da companhia; mapear diferenças", "Ponto focal de operações", "S4", "Cadernos vigentes"],
    ["Conversão", "um capítulo por arquivo .md com requisito, parâmetro e seção de origem; validação pelo engenheiro responsável", "IA + operações + engenharia", "S4–S5", "Caderno em .md validado"],
    ["Parecer padrão", "modelo de devolução (aprovado, com ressalvas, reprovado) e lista de documentos obrigatórios para loja e quiosque", "Operações + engenharia", "S5", "Parecer e checklist"],
    ["Entrada de projetos", "link único para envio de projetos; pasta ou conector; registro de cada projeto em 06-dados", "TI + operações", "S5", "Canal de projetos"],
    ["Skill de conferência", "compara projeto × caderno técnico × checklist regulatório; cita a seção; nunca aprova sozinha", "Operações + IA", "S5–S6", "App em dev"],
    ["Back-test", "rodar com projetos já analisados (aprovados e reprovados) e medir acerto e falsos positivos", "Ponto focal de operações", "S6", "Taxa de acerto"],
    ["Esteira de segurança (G3)", "validação no Orca e liberação em produção", "TI + SI", "S7", "App em produção"],
    ["Operação e decisão", "devolução dentro do SLA; cronograma e alertas por obra; medir dias de devolução e assinatura → inauguração; decisão na S13", "Ponto focal de operações", "S7–S13", "Log e decisão"],
  ], "Prazo atual de devolução de projetos entra no baseline (S4–S6); a meta de 5 dias úteis é ponto de partida, não compromisso.");
'''
ins_before("// ---------- 13. Frente 4 ----------", novos)

# ---------- Marcos ----------
rep('"Conversão de contratos nos demais shoppings", "Carga leve no pico de Natal"]],',
    '"Conversão de contratos nos demais shoppings", "Canal único de investidores e marcas no ar", "Carga leve no pico de Natal"]],')

# ---------- Scorecard ----------
rep('[c("Retorno", { bold: true }), c("NOI e inadimplência (tendência); dias de obra até a inauguração"), c("Financeiro")],',
    '[c("Retorno", { bold: true }), c("NOI e inadimplência (tendência); dias para devolver projeto e até a inauguração"), c("Financeiro e log de obras")],')

# ---------- Riscos ----------
rep('''      [c("Plano vira projeto de ferramenta e perde o propósito", { bold: true }), c("Mapa de contribuição e scorecard dos dois propósitos revisados todo mês com a diretoria; app sem métrica de propósito não escala")],
    ];''',
    '''      [c("Plano vira projeto de ferramenta e perde o propósito", { bold: true }), c("Mapa de contribuição e scorecard dos dois propósitos revisados todo mês com a diretoria; app sem métrica de propósito não escala")],
      [c("Canal aberto ao público traz contatos ruins e dados pessoais", { bold: true }), c("Triagem por critérios; consentimento LGPD; dados pessoais só no CRM; canal nunca promete condição comercial; bot só na fase 2")],
    ];''')
rep('''    const c = (t, o = {}) => ({ text: t, options: { fontSize: 12, color: T.text, valign: "middle", ...o } });
    const rows = [
      [{ text: "Risco", options: hdr }, { text: "Mitigação", options: hdr }],''',
    '''    const c = (t, o = {}) => ({ text: t, options: { fontSize: 11.5, color: T.text, valign: "middle", ...o } });
    const rows = [
      [{ text: "Risco", options: hdr }, { text: "Mitigação", options: hdr }],''')
rep('s.addTable(rows, { x: 0.6, y: 1.5, w: 12.1, colW: [4.0, 8.1], rowH: 0.5,', 's.addTable(rows, { x: 0.6, y: 1.5, w: 12.1, colW: [4.0, 8.1], rowH: 0.46,')

# ---------- Próximos passos ----------
rep('''      "Confirmar com SI o processo de liberação no Orca",''',
    '''      "Confirmar com SI o processo de liberação no Orca",
      "Canal de captação: começar pelo link ou já pelo bot",''')

open(p, 'w').write(s)
print("ok")
