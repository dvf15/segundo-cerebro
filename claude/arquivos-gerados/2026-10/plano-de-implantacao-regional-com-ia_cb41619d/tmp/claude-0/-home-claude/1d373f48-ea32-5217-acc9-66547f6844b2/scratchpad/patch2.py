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

# ---------- Capa ----------
rep('s.addText("Claude Enterprise · Diretor de portfólio, gerente regional e pontos focais de negócios, marketing e operações", { placeholder: "body" });',
    's.addText("Entregar o propósito da regional e de cada shopping com IA · Diretor de portfólio, gerente regional e pontos focais de negócios, marketing e operações", { placeholder: "body" });')

# ---------- Slide 2: dois propósitos ----------
start = s.index("  // ---------- 2. Propósito ----------")
end = s.index("  // ---------- 3. Tese ----------")
slide2 = r'''  // ---------- 2. Dois propósitos ----------
  {
    const s = content("Dois propósitos, um plano", "Por que",
      "Tudo o que o plano constrói serve a um destes dois objetivos — e o scorecard mede os dois.");
    const cols = [
      ["FaCompass", "O propósito da regional", T.teal, T.white, T.off, [
        "Propagar a cultura da empresa",
        "Formar lideranças para o futuro",
        "Entregar as metas e a estratégia dos ativos, maximizando criação e captura de valor",
        "Preparar e evoluir as pessoas, técnica e gerencialmente",
        "Eliminar entraves burocráticos e otimizar processos de forma contínua, respeitando as políticas",
      ]],
      ["FaStore", "O propósito de cada shopping", T.teal9, T.white, T.off, [
        "As melhores ofertas de lojas, serviços, entretenimento e gastronomia, conforme o posicionamento",
        "Mais frequência de visita e maior ticket médio nas lojas",
        "Experiência qualificada e segura, que encanta o consumidor",
        "Mais venda para lojistas e anunciantes",
        "Retorno de longo prazo ao empreendedor",
      ]],
    ];
    for (let i = 0; i < cols.length; i++) {
      const [ic, t, bg, fg, sub, b] = cols[i];
      const x = 0.6 + i * 6.2;
      card(s, x, 2.0, 5.9, 4.25, bg);
      await iconCircle(s, ic, x + 0.3, 2.3, 0.62, T.white, bg);
      s.addText(t, { x: x + 1.1, y: 2.33, w: 4.6, h: 0.55, fontSize: 20, bold: true, color: fg, valign: "middle", margin: 0, isTextBox: true });
      s.addText(bullets(b, { fontSize: 13.5, color: sub, paraSpaceAfter: 7 }), { x: x + 0.3, y: 3.1, w: 5.3, h: 3.0, valign: "top", margin: 0, isTextBox: true });
    }
    s.addText("A IA é o meio: menos tempo em tarefa manual e mais tempo em mix, lojista, consumidor e pessoas.",
      { x: 0.6, y: 6.45, w: 12.1, h: 0.4, fontSize: 14, italic: true, color: T.teal9, margin: 0, isTextBox: true });
  }

  // ---------- 2b. Cadeia de valor ----------
  {
    const s = content("Como a IA puxa o resultado: do processo ao retorno", "Cadeia de valor", null);
    const cols = [
      ["O que o plano constrói", T.tint, T.teal, T.text, [
        "Segundo cérebro e gestão à vista",
        "Apps de renovações, auditoria, manual e cláusulas",
        "Radares de varejo e mídia, otimizador de obras, auditoria de boletos",
        "Time treinado, cada um liderando uma frente",
      ]],
      ["O que muda na operação", T.tint, T.teal, T.text, [
        "Mix prospectado a partir do posicionamento",
        "Renovação na janela certa, dentro da alçada",
        "Loja abrindo mais rápido, obra sem surpresa",
        "Cobrança correta; pendência com dono e prazo",
        "Decisão com dado e fonte; menos horas manuais",
      ]],
      ["O que muda no shopping", T.teal, T.white, T.off, [
        "Oferta melhor de lojas, serviços, gastronomia e entretenimento",
        "Mais frequência de visita e ticket médio",
        "Experiência qualificada e segura",
        "Mais venda para lojistas e anunciantes",
      ]],
      ["O que muda para a companhia", T.teal9, T.white, T.off, [
        "Retorno de longo prazo ao empreendedor",
        "Metas e estratégia dos ativos entregues",
        "Lideranças formadas e cultura escrita",
        "Modelo replicável para outras regionais",
      ]],
    ];
    const bw = 2.82, gap = 0.27;
    cols.forEach(([t, bg, tc, bc, b], i) => {
      const x = 0.6 + i * (bw + gap);
      card(s, x, 1.6, bw, 4.7, bg);
      s.addText(t, { x: x + 0.22, y: 1.78, w: bw - 0.44, h: 0.75, fontSize: 16, bold: true, color: tc, valign: "top", margin: 0, isTextBox: true });
      s.addText(bullets(b, { fontSize: 12.5, color: bc, paraSpaceAfter: 7 }), { x: x + 0.22, y: 2.6, w: bw - 0.4, h: 3.6, valign: "top", margin: 0, isTextBox: true });
      if (i < cols.length - 1) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + bw + 0.03, y: 3.75, w: 0.21, h: 0.32, fill: { color: T.teal5 }, line: { color: T.teal5 } });
    });
    s.addText("Cada app tem uma métrica nesta cadeia; o mapa de contribuição mostra a qual propósito cada frente serve.",
      { x: 0.6, y: 6.5, w: 12.1, h: 0.35, fontSize: 12.5, italic: true, color: T.muted, margin: 0, isTextBox: true });
  }

'''
s = s[:start] + slide2 + s[end:]

# ---------- Slide 3: Tese ----------
rep('''      "Uma regional apoiada por IA entrega mais, com mais qualidade, usando a mesma estrutura — e vira modelo replicável para a companhia.");''',
    '''      "Uma regional apoiada por IA entrega os dois propósitos com mais qualidade, usando a mesma estrutura — e vira modelo replicável para a companhia.");''')
rep('''      card(s, x, 2.1, 3.8, 1.7);
      s.addText(n, { x: x + 0.3, y: 2.2, w: 3.2, h: 0.95, fontSize: 54, bold: true, color: T.teal, margin: 0, isTextBox: true });
      s.addText(l, { x: x + 0.3, y: 3.15, w: 3.3, h: 0.45, fontSize: 15, color: T.muted, margin: 0, isTextBox: true });''',
    '''      card(s, x, 2.0, 3.8, 1.35);
      s.addText(n, { x: x + 0.3, y: 2.05, w: 3.2, h: 0.8, fontSize: 48, bold: true, color: T.teal, margin: 0, isTextBox: true });
      s.addText(l, { x: x + 0.3, y: 2.85, w: 3.3, h: 0.4, fontSize: 14, color: T.muted, margin: 0, isTextBox: true });''')
rep('''    const hip = [
      ["H1 · Eficiência", "Menos horas do time em tarefas recorrentes (RMR, relatórios, preparação de visitas, consolidação de dados)"],
      ["H2 · Qualidade", "Menos prazos perdidos e menos erros: renovações dentro da janela, pendências de auditoria com dono, dados de contrato corretos"],
      ["H3 · Escala", "Modelo documentado em arquivos abertos, pronto para ser replicado em outra regional sem depender de pessoas-chave"],
    ];
    hip.forEach(([h, d], i) => {
      const y = 4.2 + i * 0.85;''',
    '''    const hip = [
      ["H1 · Pessoas e cultura", "Pontos focais liderando frentes e apresentando à diretoria; competências em IA medidas; decisões registradas e cultura escrita"],
      ["H2 · Processos e políticas", "Menos horas em tarefa recorrente, menos prazos perdidos e entraves eliminados — tudo dentro das políticas e alçadas da companhia"],
      ["H3 · Valor no shopping", "Mix pelo posicionamento, renovação na janela, obra mais rápida, receita correta e mídia: tendência de frequência, ticket e NOI"],
      ["H4 · Escala", "Modelo documentado em arquivos abertos, pronto para ser replicado em outra regional sem depender de pessoas-chave"],
    ];
    hip.forEach(([h, d], i) => {
      const y = 3.65 + i * 0.78;''')

# ---------- Slide 4: Visão geral ----------
rep('const s = content("Seis frentes, um sistema", "Visão geral", null);', 'const s = content("Seis frentes a serviço de dois propósitos", "Visão geral", null);')
rep('["0", "FaBrain", "Segundo cérebro", "Base de conhecimento em .md, portátil para qualquer modelo", "Diretor + gerente regional"],',
    '["0", "FaBrain", "Segundo cérebro", "Cultura, posicionamento e conhecimento da regional em .md, portáteis para qualquer modelo", "Diretor + gerente regional"],')
rep('["1", "FaChartLine", "Gestão à vista integrada", "Painel shopping → RMR → regional e visita estruturada", "Gerente regional"],',
    '["1", "FaChartLine", "Gestão à vista integrada", "Metas e estratégia de cada ativo visíveis do shopping à regional, com visita estruturada", "Gerente regional"],')
rep('["2", "FaCogs", "Apps de processo", "Renovações, radar de auditoria, manual operacional", "Negócios + operações"],',
    '["2", "FaCogs", "Apps de processo", "Menos burocracia em renovações, auditoria e manual — dentro das políticas", "Negócios + operações"],')
rep('["3", "FaFlask", "Pilotos operacionais", "Radar de varejo, radar de mídia, otimizador de obras e auditoria de boletos", "Negócios, marketing, operações"],',
    '["3", "FaFlask", "Pilotos operacionais", "Mix, mídia, obras e boletos: mais valor e melhor oferta em cada shopping", "Negócios, marketing, operações"],')
rep('["4", "FaFileContract", "Gestão de cláusulas", "Contratos em .md e ferramenta de cláusulas em toda a regional", "Negócios + jurídico"],',
    '["4", "FaFileContract", "Gestão de cláusulas", "Captura de valor e risco sob controle em todos os contratos da regional", "Negócios + jurídico"],')
rep('["5", "FaGraduationCap", "Treinamento em IA", "Trilha por função e formação de multiplicadores", "Diretor"],',
    '["5", "FaGraduationCap", "Treinamento em IA", "Lideranças formadas na prática, com trilha por função e multiplicadores", "Diretor"],')

# ---------- Novos slides após Visão geral: mapa de contribuição + entraves ----------
mapa = r'''// ---------- 4b. Mapa de contribuição ----------
  {
    const s = content("Cada frente a serviço de um propósito", "Mapa de contribuição", null);
    const cols = ["Cultura", "Lideranças", "Metas e valor", "Menos entraves", "Políticas", "Oferta e mix", "Frequência e ticket", "Experiência segura", "Vendas e mídia", "Retorno"];
    const M = [
      ["Segundo cérebro",      "PSSPSS...."],
      ["Gestão à vista",       "SSPP.SSSSS"],
      ["Gestão de renovações", "..PSPPS.SP"],
      ["Radar de auditoria",   "...SP..P.S"],
      ["Manual operacional",   "PS.PP..S.."],
      ["Radar de varejo",      "..P..PPSPP"],
      ["Radar de mídia",       "..P...S.PP"],
      ["Otimizador de obras",  "..SPSSSPPS"],
      ["Auditoria de boletos", "..PPP....P"],
      ["Gestão de cláusulas",  "..PPPS...P"],
      ["Treinamento em IA",    "PP.S......"],
    ];
    const gh = (t, o = {}) => ({ text: t, options: { bold: true, color: T.white, fontSize: 11.5, valign: "middle", align: "center", ...o } });
    const rows = [
      [{ text: "", options: { fill: { color: T.white } } }, gh("Propósito da regional", { colspan: 5, fill: { color: T.teal9 } }), gh("Propósito de cada shopping", { colspan: 5, fill: { color: T.teal } })],
      [{ text: "Frente / app", options: { bold: true, color: T.white, fill: { color: T.teal9 }, fontSize: 11, valign: "middle" } }]
        .concat(cols.map((c, i) => ({ text: c, options: { bold: true, color: T.white, fill: { color: i < 5 ? T.teal9 : T.teal }, fontSize: 9.5, valign: "middle", align: "center" } }))),
    ];
    M.forEach(([n, m]) => rows.push(
      [{ text: n, options: { fontSize: 11.5, bold: true, color: T.text, valign: "middle" } }]
        .concat(m.split("").map(ch => ({ text: ch === "P" ? "●" : ch === "S" ? "○" : "", options: { fontSize: 13, color: ch === "P" ? T.teal : T.muted, align: "center", valign: "middle" } })))
    ));
    s.addTable(rows, { x: 0.6, y: 1.5, w: 12.1, colW: [2.5].concat(cols.map(() => 0.96)), rowH: [0.32, 0.55].concat(M.map(() => 0.38)),
      border: { type: "solid", pt: 0.75, color: T.border }, fill: { color: T.white }, margin: [0.03, 0.06, 0.03, 0.08] });
    s.addText([{ text: "●", options: { color: T.teal, bold: true } }, { text: "  contribuição direta     ", options: { color: T.muted } }, { text: "○", options: { color: T.muted } }, { text: "  contribuição indireta", options: { color: T.muted } }],
      { x: 0.6, y: 6.62, w: 8, h: 0.3, fontSize: 11.5, margin: 0, isTextBox: true });
  }

  // ---------- 4c. Entraves eliminados ----------
  {
    const s = content("Entraves burocráticos que o plano elimina", "Menos burocracia", null);
    const hdr = { bold: true, color: T.white, fill: { color: T.teal }, fontSize: 12, valign: "middle" };
    const c = (t, o = {}) => ({ text: t, options: { fontSize: 11.5, color: T.text, valign: "middle", ...o } });
    const rows = [[{ text: "Hoje", options: hdr }, { text: "Com o plano", options: hdr }, { text: "Frente", options: hdr }]];
    [
      ["RMR montada à mão todo mês, a partir de planilhas paralelas", "Material gerado do painel 3 dias antes, com desvios explicados", "Gestão à vista"],
      ["Dados consolidados em planilhas de cada shopping", "Base única atualizada automaticamente, do shopping à regional", "Gestão à vista"],
      ["Visita ao shopping sem roteiro padrão e sem rastro das ações", "Roteiro gerado do painel; ações voltam para o painel e para a RMR", "Gestão à vista"],
      ["Vencimento de contrato descoberto perto da data", "Carteira de 18 meses com janela, argumentos e alçada prontos", "Renovações"],
      ["Cláusula procurada em PDF, contrato por contrato", "Busca, comparação e alerta de gatilhos em todos os contratos", "Cláusulas"],
      ["Pendência de conformidade descoberta na auditoria", "Radar com alerta 30, 15 e 7 dias antes, com dono e prazo", "Radar de auditoria"],
      ["Norma consultada por e-mail ou telefone a quem sabe", "Manual que responde citando a seção, ou diz que não há fonte", "Manual operacional"],
      ["Boleto conferido por amostra, ou não conferido", "100% dos boletos do mês comparados ao padrão de cada loja", "Auditoria de boletos"],
      ["Obra do lojista descobre pendência regulatória no fim", "Checklist local e gargalos antecipados desde a assinatura", "Otimizador de obras"],
      ["Prospecção dependente da rede pessoal de cada gerente", "Radar guiado pelo posicionamento e pela vacância do shopping", "Radar de varejo"],
      ["Conhecimento na cabeça de pessoas-chave", "Segundo cérebro validado, portátil para qualquer modelo", "Segundo cérebro"],
    ].forEach(([a, b, f]) => rows.push([c(a), c(b, { color: T.teal9 }), c(f, { color: T.muted })]));
    s.addTable(rows, { x: 0.6, y: 1.5, w: 12.1, colW: [4.7, 5.3, 2.1], rowH: [0.38].concat(Array(11).fill(0.43)),
      border: { type: "solid", pt: 0.75, color: T.border }, fill: { color: T.white }, margin: [0.03, 0.1, 0.03, 0.1] });
    s.addText("Horas liberadas por entrave entram no baseline do teste (S1–S3) e no scorecard mensal.",
      { x: 0.6, y: 6.65, w: 11.6, h: 0.3, fontSize: 11.5, italic: true, color: T.muted, margin: 0, isTextBox: true });
  }
'''
ins_before("// ---------- 5. Time e papéis ----------", mapa)

# ---------- Árvore do segundo cérebro ----------
rep('["  00-governanca/      papéis, ritmos, decisões", false],', '["  00-governanca/      propósito, cultura, papéis, decisões", false],')
rep('["  01-regional/        metas, políticas, alçadas", false],', '["  01-regional/        estratégia, metas, políticas", false],')
rep('["  02-shoppings/<nome>/ ficha, mix, visitas, RMR", false],', '["  02-shoppings/<nome>/ posicionamento, metas, mix, RMR", false],')
rep('["  07-treinamento/     trilhas e casos", false],', '["  07-treinamento/     trilhas, casos, lideranças", false],')
rep('fontFace: "Courier New", fontSize: 13.5,', 'fontFace: "Courier New", fontSize: 13,')
rep('''    s.addText("Cada pasta tem um dono responsável pela curadoria. O índice (06-dados) permite filtrar e consolidar sem abrir arquivo por arquivo.",''',
    '''    s.addText("Cada pasta tem um dono. O posicionamento de cada shopping (02) e a cultura e as políticas (00 e 01) são lidos por todos os apps: toda recomendação nasce dentro deles.",''')

# passos segundo cérebro
rep('["Governança e glossário", "papéis, ritmos, alçadas e siglas da regional", "Gerente regional", "S1–S2", "Pasta 00 completa"],',
    '["Propósito, cultura e governança", "os dois propósitos, valores e jeito de decidir da companhia, papéis, ritmos, alçadas e glossário", "Diretor + gerente regional", "S1–S2", "Pasta 00 completa"],')
rep('["Fichas dos shoppings", "dados cadastrais, mix, metas e plano anual, puxados pelo conector quando disponível", "Pontos focais", "S2–S3", "Uma ficha por shopping"],',
    '["Fichas dos shoppings", "posicionamento, público e cluster; metas, mix e plano anual, puxados pelo conector quando disponível", "Pontos focais", "S2–S3", "Uma ficha por shopping"],')

# ---------- Gestão à vista ----------
rep('const s = content("Gestão à vista em três níveis, com os mesmos números", "Frente 1 · Gestão à vista integrada", null);',
    'const s = content("Gestão à vista em três níveis, com os mesmos números", "Frente 1 · Gestão à vista integrada", "Do propósito do shopping à estratégia da regional: os indicadores que importam, atualizados sem retrabalho.");')
rep('["Shopping", "Indicadores da visita estruturada em destaque", ["Lista oficial da visita estruturada como ponto de partida", "Semáforo por indicador vs. meta", "Ações abertas com dono e prazo"]],',
    '["Shopping", "Indicadores da visita estruturada e do propósito", ["Frequência, ticket médio, vendas, vacância e mix, mídia, experiência e segurança", "Semáforo por indicador vs. meta", "Ações abertas com dono e prazo"]],')
rep('card(s, x, 1.55, 3.85, 3.45, i === 2 ? T.teal : T.tint);\n      const dark = i === 2;\n      s.addText(t, { x: x + 0.3, y: 1.75,',
    'card(s, x, 1.9, 3.85, 3.3, i === 2 ? T.teal : T.tint);\n      const dark = i === 2;\n      s.addText(t, { x: x + 0.3, y: 2.05,')
rep('s.addText(sub, { x: x + 0.3, y: 2.2, w: 3.3, h: 0.5, fontSize: 13, italic: true, color: dark ? T.off : T.muted, margin: 0, valign: "top", isTextBox: true });\n      s.addText(bullets(b, { fontSize: 13, color: dark ? T.white : T.text, paraSpaceAfter: 6 }), { x: x + 0.3, y: 2.8, w: 3.35, h: 2.1,',
    's.addText(sub, { x: x + 0.3, y: 2.5, w: 3.3, h: 0.5, fontSize: 13, italic: true, color: dark ? T.off : T.muted, margin: 0, valign: "top", isTextBox: true });\n      s.addText(bullets(b, { fontSize: 13, color: dark ? T.white : T.text, paraSpaceAfter: 6 }), { x: x + 0.3, y: 3.05, w: 3.35, h: 2.1,')
rep('await iconCircle(s, "FaRoute", 0.6, 5.3, 0.62);\n    s.addText("Visita estruturada", { x: 1.4, y: 5.25,',
    'await iconCircle(s, "FaRoute", 0.6, 5.45, 0.62);\n    s.addText("Visita estruturada", { x: 1.4, y: 5.4,')
rep('{ x: 1.4, y: 5.65, w: 11.3, h: 0.9, fontSize: 14, color: T.text, margin: 0, valign: "top", isTextBox: true });\n  }',
    '{ x: 1.4, y: 5.8, w: 11.3, h: 0.9, fontSize: 14, color: T.text, margin: 0, valign: "top", isTextBox: true });\n  }')
rep('["Dicionário de indicadores", "partir da lista da visita estruturada: definição, fórmula, fonte, meta e dono de cada indicador", "Gerente regional", "S2", "Dicionário em .md"],',
    '["Dicionário de indicadores", "lista da visita estruturada + indicadores do propósito (frequência, ticket, vendas, vacância, mídia, experiência, segurança): fórmula, fonte, meta e dono", "Gerente regional", "S2", "Dicionário em .md"],')

# ---------- Pilotos ----------
rep('["FaSearch", "Radar de varejo", "Negócios", "Marcas em expansão, varejo de rua e capitais próximas viram pipeline para a vacância do shopping", "Leads qualificados, reuniões e propostas geradas"],',
    '["FaSearch", "Radar de varejo", "Negócios", "Lojas, serviços, gastronomia e entretenimento aderentes ao posicionamento viram pipeline para a vacância", "Operações novas alinhadas ao posicionamento; leads e propostas"],')
rep('["FaBullhorn", "Radar de mídia", "Marketing", "Oportunidades de mídia e patrocínio mapeadas e priorizadas; acompanhamento das ações em curso", "Pipeline e receita de mídia vs. período anterior"],',
    '["FaBullhorn", "Radar de mídia", "Marketing", "Anunciantes e patrocínios mapeados e priorizados; acompanhamento das ações em curso", "Receita de anunciantes e patrocínio vs. período anterior"],')
rep('["FaHardHat", "Otimizador de obras", "Operações", "Cronograma de obra dos lojistas, checklist regulatório e gargalos antecipados", "Dias entre assinatura e inauguração"],',
    '["FaHardHat", "Otimizador de obras", "Operações", "Cronograma, checklist regulatório e gargalos antecipados: a loja vende antes e o tapume sai mais cedo", "Dias entre assinatura e inauguração"],')
rep('"Lê os boletos do mês, aprende o padrão de cada LUC/rubrica e aponta desvios: rubrica não cobrada, loja sem boleto, valor fora do histórico", "Pendências apontadas, confirmadas e valor recuperado"],',
    '"Lê os boletos do mês, aprende o padrão de cada LUC/rubrica e aponta desvios: rubrica não cobrada, loja sem boleto, valor fora do histórico", "Receita recuperada e pendências confirmadas"],')
rep('[c("Radar de varejo", { bold: true, color: T.teal9 }), c("Vacância e mix (conector); pesquisa de marcas"), c("Prioriza marcas por aderência ao cluster e ao espaço vago"), c("Pipeline de leads"), c("Negócios qualifica antes do contato")],',
    '[c("Radar de varejo", { bold: true, color: T.teal9 }), c("Posicionamento do shopping, vacância e mix (conector); pesquisa de marcas"), c("Prioriza lojas, serviços, gastronomia e entretenimento por aderência ao posicionamento e ao espaço vago"), c("Pipeline de leads"), c("Negócios qualifica antes do contato")],')

# ---------- Lideranças: novo slide antes do plano de treinamento ----------
lid = r'''// ---------- 13c. Lideranças ----------
  {
    const s = content("Lideranças formadas no trabalho, cultura escrita no sistema", "Frente 5 · Pessoas e cultura",
      "Propagar a cultura e formar líderes acontece no trabalho real do plano — não em sala.");
    const mech = [
      ["FaUserTie", "Dono de frente", "Cada ponto focal lidera uma frente de ponta a ponta: escopo, prazo, resultado e decisão de escalar ou parar."],
      ["FaUsers", "Pares revisam pares", "Negócios, marketing e operações revisam o trabalho uns dos outros antes de ir para a RMR."],
      ["FaChalkboardTeacher", "Palco mensal", "Rodízio: a cada mês um ponto focal apresenta o scorecard à diretoria executiva."],
      ["FaBook", "Decisões registradas", "Toda decisão com contexto e alternativas no segundo cérebro — o raciocínio da regional fica exposto e aprendível."],
      ["FaHandshake", "Mentoria do diretor", "30 min quinzenais por ponto focal: julgamento, política da companhia e carreira."],
      ["FaSeedling", "Multiplicadores", "Quem fecha o ciclo treina a próxima regional e leva o modelo adiante."],
    ];
    for (let i = 0; i < mech.length; i++) {
      const col = i % 3, row = Math.floor(i / 3);
      const x = 0.6 + col * 4.1, y = 2.0 + row * 2.05;
      card(s, x, y, 3.85, 1.85);
      await iconCircle(s, mech[i][0], x + 0.25, y + 0.25, 0.55);
      s.addText(mech[i][1], { x: x + 0.95, y: y + 0.25, w: 2.8, h: 0.55, fontSize: 15, bold: true, color: T.text, valign: "middle", margin: 0, isTextBox: true });
      s.addText(mech[i][2], { x: x + 0.25, y: y + 0.9, w: 3.4, h: 0.9, fontSize: 12.5, color: T.text, margin: 0, valign: "top", isTextBox: true });
    }
    s.addText([{ text: "Cultura escrita: ", options: { bold: true, color: T.teal } }, { text: "valores, políticas e o jeito Allos de decidir ficam em 00-governanca e entram nas instruções de cada app — toda recomendação já nasce dentro das regras.", options: { color: T.text } }],
      { x: 0.6, y: 6.2, w: 12.1, h: 0.6, fontSize: 13, margin: 0, valign: "top", isTextBox: true });
  }
'''
ins_before("// ---------- 14. Frente 5 ----------", lid)

# treinamento: bullets e passos
rep('["Prática por função", "Semanas 3 a 8", "Pontos focais", ["Cada um constrói e opera os apps da sua frente", "Clínica semanal de 1 h para dúvidas", "Pares revisam o trabalho um do outro"], "1 app em uso por pessoa"],',
    '["Prática por função", "Semanas 3 a 8", "Pontos focais", ["Cada um lidera a sua frente e opera os apps", "Clínica semanal de 1 h para dúvidas", "Pares revisam o trabalho um do outro"], "1 app em uso por pessoa"],')
rep('["Avançado", "Semanas 8 a 12", "Todos", ["Skills em .md e tarefas agendadas", "Painéis publicados", "Como avaliar qualidade da resposta"], "Automação rodando sem intervenção"],',
    '["Avançado", "Semanas 8 a 12", "Todos", ["Skills em .md e tarefas agendadas", "Painéis publicados", "Apresentar resultado à diretoria"], "Automação rodando sem intervenção"],')
rep('["Prática por função", "cada ponto focal constrói e opera o app da sua frente, em par com o diretor", "Pontos focais", "S3–S8", "1 app em uso por pessoa"],',
    '["Prática por função", "cada ponto focal lidera a sua frente e opera o app, em par com o diretor — formação pela responsabilidade", "Pontos focais", "S3–S8", "1 app em uso por pessoa"],')
rep('["Demo day", "cada pessoa apresenta um caso com ganho medido; autoavaliação final; multiplicadores definidos", "Todos", "S13", "Casos e multiplicadores"],',
    '["Demo day", "cada pessoa apresenta à diretoria um caso com ganho medido nos dois propósitos; autoavaliação final; multiplicadores definidos", "Todos", "S13", "Casos e multiplicadores"],')

# ---------- Marcos ----------
rep('"Segundo cérebro v1 com estrutura e templates", "Base de dados conectada',
    '"Segundo cérebro v1: propósitos, cultura e posicionamento de cada shopping", "Base de dados conectada')
rep('"Demo day do time", "Relatório final: regional inteligente vs. modelo atual"]],',
    '"Demo day do time", "Scorecard dos dois propósitos vs. modelo atual apresentado à diretoria"]],')

# ---------- Scorecard ----------
start = s.index("  // ---------- 17. Desenho do teste ----------")
end = s.index("  // ---------- 18. Governança ----------")
score = r'''  // ---------- 17. Desenho do teste ----------
  {
    const s = content("Scorecard: os dois propósitos medidos contra o modelo atual", "Teste: regional inteligente vs. atual", null);
    card(s, 0.6, 1.5, 3.4, 5.2, T.teal);
    s.addText("Método", { x: 0.85, y: 1.68, w: 3.0, h: 0.4, fontSize: 17, bold: true, color: T.white, margin: 0, isTextBox: true });
    s.addText(bullets([
      "Baseline nas semanas 1 a 3: horas por tarefa recorrente e foto dos indicadores",
      "Regional de comparação, medida com os mesmos indicadores",
      "Comparar a evolução de cada regional, não o nível absoluto",
      "Revisão mensal com a diretoria, apresentada por um ponto focal",
      "90 dias concluem sobre pessoas, processo e adoção; frequência, ticket e NOI só em tendência (6 a 12 meses para concluir)",
    ], { fontSize: 12, color: T.white, paraSpaceAfter: 7 }), { x: 0.85, y: 2.15, w: 2.95, h: 4.5, valign: "top", margin: 0, isTextBox: true });

    const hdr = { bold: true, color: T.white, fill: { color: T.teal9 }, fontSize: 12, valign: "middle" };
    const grp = (t, col) => [{ text: t, options: { bold: true, color: T.white, fill: { color: col }, fontSize: 11.5, valign: "middle", colspan: 3 } }];
    const c = (t, o = {}) => ({ text: t, options: { fontSize: 11.5, color: T.text, valign: "middle", ...o } });
    const rows = [
      [{ text: "Dimensão", options: hdr }, { text: "Indicador", options: hdr }, { text: "Como medir", options: hdr }],
      grp("Propósito da regional", T.teal5),
      [c("Pessoas e lideranças", { bold: true }), c("Competências em IA (início e fim); pontos focais liderando frente e apresentando à diretoria"), c("Autoavaliação e registro")],
      [c("Cultura e processos", { bold: true }), c("Horas por semana em tarefas recorrentes; entraves eliminados (hoje → com o plano); decisões registradas"), c("Registro amostral de tempo")],
      [c("Políticas e segurança", { bold: true }), c("Pendências de auditoria vencidas; achados do Orca tratados; alçadas respeitadas"), c("Radar e Orca")],
      [c("Adoção", { bold: true }), c("Usuários ativos por semana; processos rodando com IA"), c("Uso do Claude Enterprise")],
      grp("Propósito de cada shopping", T.teal6),
      [c("Oferta e mix", { bold: true }), c("Vacância; operações novas aderentes ao posicionamento; renovações na janela; leasing spread"), c("Painel e sistemas")],
      [c("Consumidor", { bold: true }), c("Fluxo e frequência de visita, ticket médio e satisfação (tendência)"), c("Fluxo e pesquisa")],
      [c("Lojistas e anunciantes", { bold: true }), c("Vendas por m², receita de mídia, receita recuperada em boletos"), c("Sistemas da companhia")],
      [c("Retorno", { bold: true }), c("NOI e inadimplência (tendência); dias de obra até a inauguração"), c("Financeiro")],
    ];
    s.addTable(rows, { x: 4.25, y: 1.5, w: 8.45, colW: [1.85, 4.3, 2.3], rowH: [0.38, 0.3, 0.52, 0.52, 0.52, 0.52, 0.3, 0.52, 0.52, 0.52, 0.52],
      border: { type: "solid", pt: 0.75, color: T.border }, fill: { color: T.white }, margin: [0.03, 0.1, 0.03, 0.1] });
  }

'''
s = s[:start] + score + s[end:]

# ---------- Governança ----------
rep('''    card(s, 8.2, 1.55, 4.5, 3.85, T.teal9);''', '''    card(s, 8.2, 1.55, 4.5, 4.3, T.teal9);''')
rep('''      "Decisões registradas no segundo cérebro",
      "Nada vai para produção sem aprovação no Orca",
    ], { fontSize: 14, color: T.off, paraSpaceAfter: 8 }), { x: 8.45, y: 2.25, w: 4.0, h: 3.0, valign: "top", margin: 0, isTextBox: true });
    s.addText("O teste só vale como modelo para a companhia se rodar dentro das regras atuais — o ganho tem de vir do processo, não de atalho.",
      { x: 0.6, y: 5.75, w: 12.1, h: 0.8,''',
    '''      "Decisões registradas no segundo cérebro",
      "Nada vai para produção sem aprovação no Orca",
      "Toda recomendação parte do posicionamento e das metas do shopping",
    ], { fontSize: 13, color: T.off, paraSpaceAfter: 7 }), { x: 8.45, y: 2.25, w: 4.0, h: 3.5, valign: "top", margin: 0, isTextBox: true });
    s.addText("O teste só vale como modelo para a companhia se rodar dentro das regras atuais — o ganho tem de vir do processo, não de atalho.",
      { x: 0.6, y: 6.05, w: 12.1, h: 0.7,''')

# ---------- Riscos ----------
rep('''      [c("Liberação de segurança atrasa o cronograma", { bold: true }), c("SI no kickoff da S1; gates planejados; trabalho segue em dev com dados mascarados enquanto aguarda")],
    ];
    s.addTable(rows, { x: 0.6, y: 1.55, w: 12.1, colW: [4.0, 8.1], rowH: 0.54,''',
    '''      [c("Liberação de segurança atrasa o cronograma", { bold: true }), c("SI no kickoff da S1; gates planejados; trabalho segue em dev com dados mascarados enquanto aguarda")],
      [c("Plano vira projeto de ferramenta e perde o propósito", { bold: true }), c("Mapa de contribuição e scorecard dos dois propósitos revisados todo mês com a diretoria; app sem métrica de propósito não escala")],
    ];
    s.addTable(rows, { x: 0.6, y: 1.5, w: 12.1, colW: [4.0, 8.1], rowH: 0.5,''')
rep('''    const c = (t, o = {}) => ({ text: t, options: { fontSize: 12.5, color: T.text, valign: "middle", ...o } });
    const rows = [
      [{ text: "Risco", options: hdr }, { text: "Mitigação", options: hdr }],''',
    '''    const c = (t, o = {}) => ({ text: t, options: { fontSize: 12, color: T.text, valign: "middle", ...o } });
    const rows = [
      [{ text: "Risco", options: hdr }, { text: "Mitigação", options: hdr }],''')

# ---------- Próximos passos ----------
rep('''      "Kickoff técnico com TI e SI: base de dados e Orca",''',
    '''      "Kickoff técnico com TI e SI: base de dados e Orca",
      "Propósitos, cultura e posicionamento de cada shopping no segundo cérebro",''')

open(p, 'w').write(s)
print("ok")
