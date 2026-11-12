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

# ---------- Tese: H4 ----------
rep('["H4 · Escala", "Modelo documentado em arquivos abertos, pronto para ser replicado em outra regional sem depender de pessoas-chave"],',
    '["H4 · Escala", "Modelo modular e documentado em arquivos abertos: shoppings e pessoas entram e saem sem quebrar, e outra regional replica em 8 semanas"],')

# ---------- Entraves: nova linha ----------
rep('''      ["Conhecimento na cabeça de pessoas-chave", "Segundo cérebro validado, portátil para qualquer modelo", "Segundo cérebro"],
    ].forEach''',
    '''      ["Conhecimento na cabeça de pessoas-chave", "Segundo cérebro validado, portátil para qualquer modelo", "Segundo cérebro"],
      ["Troca de gerente ou de shopping leva meses de transição", "Playbooks: pessoa operando em 10 dias úteis, shopping no painel em 15", "Playbooks"],
    ].forEach''')
rep('rowH: [0.38].concat(Array(11).fill(0.43)),', 'rowH: [0.38].concat(Array(12).fill(0.39)),')
rep('''    const c = (t, o = {}) => ({ text: t, options: { fontSize: 11.5, color: T.text, valign: "middle", ...o } });
    const rows = [[{ text: "Hoje", options: hdr }''',
    '''    const c = (t, o = {}) => ({ text: t, options: { fontSize: 10.5, color: T.text, valign: "middle", ...o } });
    const rows = [[{ text: "Hoje", options: hdr }''')
rep('''    s.addText("Horas liberadas por entrave entram no baseline do teste (S1–S3) e no scorecard mensal.",
      { x: 0.6, y: 6.65,''', '''    s.addText("Horas liberadas por entrave entram no baseline do teste (S1–S3) e no scorecard mensal.",
      { x: 0.6, y: 6.72,''')

# ---------- Time e papéis: coluna suplente ----------
start = s.index("  // ---------- 5. Time e papéis ----------")
end = s.index("  // ---------- 5b. Etapa 0 — esteira ----------")
time = r'''  // ---------- 5. Time e papéis ----------
  {
    const s = content("Papéis, não pessoas: cada frente com dono e suplente", "Estrutura do time", null);
    const hdr = { bold: true, color: T.white, fill: { color: T.teal }, fontSize: 12.5, valign: "middle" };
    const c = (t, o = {}) => ({ text: t, options: { fontSize: 12.5, color: T.text, valign: "middle", ...o } });
    const rows = [
      [{ text: "Papel", options: hdr }, { text: "Responsabilidade no plano", options: hdr }, { text: "Lidera", options: hdr }, { text: "Suplente", options: hdr }, { text: "Dedicação sugerida", options: hdr }],
      [c("Diretor de portfólio", { bold: true }), c("Sponsor; arquitetura do segundo cérebro; decisões e alçadas; reporte à diretoria executiva"), c("Frentes 0 e 5"), c("Gerente regional"), c("~4 h/semana")],
      [c("Gerente regional", { bold: true }), c("PMO do plano; ritmo de gestão; gestão à vista e placar das batalhas; consolida o scorecard"), c("Frente 1 e PMO"), c("Diretor"), c("~6 h/semana")],
      [c("Ponto focal de negócios", { bold: true }), c("Renovações, cláusulas, radar de varejo regional (canal de investidores e marcas) e auditoria de boletos"), c("Frentes 2, 3 e 4"), c("Operações"), c("~5 h/semana")],
      [c("Ponto focal de marketing", { bold: true }), c("Radar de mídia; comunicação interna da adoção; materiais da RMR"), c("Frente 3"), c("Negócios"), c("~4 h/semana")],
      [c("Ponto focal de operações", { bold: true }), c("Radar de auditoria, manual operacional e otimizador de obras (caderno técnico e devolução de projetos)"), c("Frentes 2 e 3"), c("Marketing"), c("~5 h/semana")],
      [c("Equipes dos shoppings", { bold: true, color: T.muted }), c("Fonte de dados e usuárias dos painéis e materiais publicados (sem licença no piloto)", { color: T.muted }), c("—", { color: T.muted }), c("—", { color: T.muted }), c("Pontual", { color: T.muted })],
    ];
    s.addTable(rows, { x: 0.6, y: 1.55, w: 12.1, colW: [2.2, 4.7, 1.5, 1.9, 1.8], rowH: 0.62, border: { type: "solid", pt: 0.75, color: T.border }, fill: { color: T.white }, margin: [0.05, 0.12, 0.05, 0.12] });
    s.addText([{ text: "Acessos, Projects, alertas e licenças são atribuídos ao papel, não à pessoa. ", options: { bold: true, color: T.teal } },
      { text: "Quem sai é substituído no papel; o suplente assume no intervalo. Dedicação é estimativa inicial, a calibrar nas primeiras semanas.", options: { color: T.muted } }],
      { x: 0.6, y: 6.3, w: 12.1, h: 0.6, fontSize: 12, italic: true, margin: 0, valign: "top", isTextBox: true });
  }

'''
s = s[:start] + time + s[end:]

# ---------- Árvore ----------
rep('["  02-shoppings/<nome>/ posicionamento, batalhas, RMR", false],',
    '["  02-shoppings/_modelo/ template de shopping novo", false],\n      ["  02-shoppings/<nome>/ posicionamento, batalhas, RMR", false],')
rep('["  99-arquivo/         histórico", false],', '["  99-arquivo/         shoppings e pessoas desligados", false],')
rep('fontFace: "Courier New", fontSize: 13,', 'fontFace: "Courier New", fontSize: 12.5,')
rep('["Fichas dos shoppings", "posicionamento, público e cluster; metas, mix e plano anual, puxados pelo conector quando disponível", "Pontos focais", "S2–S3", "Uma ficha por shopping"],',
    '["Fichas dos shoppings", "a partir do modelo 02-shoppings/_modelo: posicionamento, público e cluster; metas, mix e plano anual, puxados pelo conector quando disponível", "Pontos focais", "S2–S3", "Uma ficha por shopping"],')

# ---------- Marcos ----------
rep('"Demo day do time", "Scorecard dos dois propósitos vs. modelo atual apresentado à diretoria"]],',
    '"Demo day do time", "Playbooks de entrada e saída testados em simulação", "Scorecard dos dois propósitos vs. modelo atual e go/no-go do rollout"]],')

# ---------- Scorecard ----------
rep('[c("Adoção", { bold: true }), c("Usuários ativos por semana; processos rodando com IA"), c("Uso do Claude Enterprise")],',
    '[c("Adoção", { bold: true }), c("Usuários ativos por semana; processos rodando com IA; dias para integrar pessoa ou shopping novo"), c("Uso do Claude Enterprise")],')

# ---------- Governança ----------
rep('''      "Toda recomendação parte do posicionamento e das metas do shopping",
    ], { fontSize: 13, color: T.off, paraSpaceAfter: 7 }), { x: 8.45, y: 2.25, w: 4.0, h: 3.5,''',
    '''      "Toda recomendação parte do posicionamento e das metas do shopping",
      "Cada frente tem dono e suplente; nada fica só na cabeça de alguém",
    ], { fontSize: 12.5, color: T.off, paraSpaceAfter: 6 }), { x: 8.45, y: 2.25, w: 4.0, h: 3.5,''')

# ---------- Seção: mudanças no portfólio e no time ----------
mud = r'''// ---------- 18b. Desenhado para mudar ----------
  {
    const s = content("Desenhado para mudar: shoppings e pessoas entram e saem sem quebrar o modelo", "Mudanças no portfólio e no time", null);
    const pr = [
      ["FaStore", "Modular por shopping", "Cada shopping é uma pasta autocontida: ficha, batalhas, contratos, dados e RMR. Entra ou sai sem tocar nos demais."],
      ["FaUserTie", "Papel, não pessoa", "Donos, Projects, alertas e acessos são definidos por papel; a pessoa é atribuída ao papel e pode ser trocada."],
      ["FaBook", "Conhecimento em arquivo", "O que alguém sabe sobre o trabalho fica no segundo cérebro validado. A saída de uma pessoa não leva o conhecimento."],
      ["FaUsers", "Dono e suplente", "Cada frente tem titular e suplente treinado. Uma troca não para a frente: o suplente assume no intervalo."],
      ["FaShieldAlt", "Acessos por grupo", "Licenças, conector e Projects ligados a grupos de papel no Claude Enterprise (SSO). Entrar ou sair é mudar o grupo."],
      ["FaCogs", "Catálogo versionado", "Apps, skills e templates com versão. Um shopping ou portfólio novo recebe a versão vigente, não uma cópia ad hoc."],
    ];
    for (let i = 0; i < pr.length; i++) {
      const col = i % 3, row = Math.floor(i / 3);
      const x = 0.6 + col * 4.1, y = 1.6 + row * 2.3;
      card(s, x, y, 3.85, 2.1);
      await iconCircle(s, pr[i][0], x + 0.25, y + 0.25, 0.55);
      s.addText(pr[i][1], { x: x + 0.95, y: y + 0.25, w: 2.8, h: 0.55, fontSize: 15, bold: true, color: T.text, valign: "middle", margin: 0, isTextBox: true });
      s.addText(pr[i][2], { x: x + 0.25, y: y + 0.92, w: 3.4, h: 1.1, fontSize: 12.5, color: T.text, margin: 0, valign: "top", isTextBox: true });
    }
    s.addText("Teste na S12: simular a saída de um ponto focal e a entrada de um shopping fictício, medindo os dias até operar.",
      { x: 0.6, y: 6.35, w: 12.1, h: 0.4, fontSize: 13, italic: true, color: T.teal9, margin: 0, isTextBox: true });
  }

  // ---------- 18c. Playbook shopping ----------
  {
    const s = content("Playbook: shopping entra ou sai do portfólio", "Mudanças no portfólio e no time", null);
    const cols = [
      ["Entrada · 15 dias úteis", "Da decisão ao shopping no painel e no scorecard", T.tint, T.teal, T.text, [
        "D0 · Decisão registrada; gerente regional nomeia o dono da entrada",
        "D1–3 · Pasta criada a partir de 02-shoppings/_modelo: ficha, posicionamento, batalhas e metas",
        "D3–5 · Contratos convertidos em .md e incluídos no índice; cláusulas em uso",
        "D5–8 · Shopping incluído nas views do conector (mudança padrão, já aprovada no Orca)",
        "D8–10 · Painel, placar das batalhas, alertas e RMR ligados",
        "D10–15 · Apps configurados (renovações, auditoria, boletos, obras); visita estruturada; equipe do shopping orientada",
        "D15 · Baseline do shopping registrado; entra no scorecard a partir do mês seguinte",
      ]],
      ["Saída · 10 dias úteis", "Sem perder histórico nem deixar acesso aberto", T.teal9, T.white, T.off, [
        "D0 · Decisão e data registradas; pendências abertas recebem dono de encerramento",
        "D1–5 · Handover: ações, renovações em curso e obras passadas a quem assume o ativo",
        "D5–8 · Pasta exportada (.md + CSV) para quem assume; cópia movida para 99-arquivo com data",
        "D8–10 · Removido do conector, painéis, alertas e Projects; acessos revogados",
        "D10 · Lições aprendidas registradas; scorecard recalculado na mesma base (like-for-like)",
        "Troca de regional: a pasta viaja com o shopping e entra na nova regional pelo mesmo playbook",
      ]],
    ];
    cols.forEach(([t, sub, bg, tc, bc, b], i) => {
      const x = 0.6 + i * 6.2;
      card(s, x, 1.6, 5.9, 4.95, bg);
      s.addText(t, { x: x + 0.3, y: 1.75, w: 5.3, h: 0.4, fontSize: 17, bold: true, color: tc, margin: 0, isTextBox: true });
      s.addText(sub, { x: x + 0.3, y: 2.15, w: 5.3, h: 0.3, fontSize: 12, italic: true, color: i ? T.off : T.muted, margin: 0, isTextBox: true });
      s.addText(b.map((t2, j) => ({ text: "☐  " + t2, options: { breakLine: j < b.length - 1 } })),
        { x: x + 0.3, y: 2.6, w: 5.35, h: 3.85, fontSize: 12, color: bc, paraSpaceAfter: 6, valign: "top", margin: 0, isTextBox: true });
    });
    s.addText("Prazos são metas iniciais, medidas na simulação da S12. O que leva tempo é o que é local: contratos, batalhas e dados.",
      { x: 0.6, y: 6.65, w: 12.1, h: 0.3, fontSize: 11.5, italic: true, color: T.muted, margin: 0, isTextBox: true });
  }

  // ---------- 18d. Playbook pessoa ----------
  {
    const s = content("Playbook: pessoa entra, sai ou é substituída", "Mudanças no portfólio e no time", null);
    const cols = [
      ["Entrada · 10 dias úteis", T.tint, T.teal, T.text, [
        "D0 · Atribuída ao papel: grupo SSO, licença, Projects e alertas do papel",
        "D1 · Leitura guiada do segundo cérebro: propósitos, governança, fichas e a frente dela",
        "D1–3 · Fundamentos (trilha gravada + clínica) e checklist de dados e segurança",
        "D3–5 · Opera a frente em par com o suplente ou o diretor",
        "D5–10 · Assume a frente; autoavaliação de competências registrada como baseline",
      ]],
      ["Saída · do aviso ao último dia", T.teal9, T.white, T.off, [
        "D-10 · Frente transferida ao suplente; pendências e decisões em curso registradas",
        "D-10 a -3 · Notas em rascunho validadas ou descartadas; handover.md com contexto",
        "D-1 · Revisão do que só ela sabia: vira nota validada ou lição aprendida",
        "D0 · Removida do grupo SSO; licença volta ao papel; Projects e alertas seguem com o papel",
        "Scorecard registra a troca; a comparação continua like-for-like",
      ]],
      ["Substituição", T.tint, T.teal, T.text, [
        "Dia seguinte · suplente assume como titular interino",
        "Novo titular entra pelo playbook de entrada (10 dias)",
        "Suplente volta ao papel de suplente e revisa o trabalho do novo titular por 30 dias",
        "Licença realocada: sem custo extra e sem pausa na frente",
        "Troca registrada em 00-governanca/decisoes",
      ]],
    ];
    cols.forEach(([t, bg, tc, bc, b], i) => {
      const x = 0.6 + i * 4.1;
      card(s, x, 1.6, 3.85, 4.95, bg);
      s.addText(t, { x: x + 0.25, y: 1.75, w: 3.4, h: 0.45, fontSize: 16, bold: true, color: tc, margin: 0, isTextBox: true });
      s.addText(b.map((t2, j) => ({ text: "☐  " + t2, options: { breakLine: j < b.length - 1 } })),
        { x: x + 0.25, y: 2.35, w: 3.4, h: 4.1, fontSize: 12, color: bc, paraSpaceAfter: 7, valign: "top", margin: 0, isTextBox: true });
    });
    s.addText("Vale para todos os papéis, inclusive diretor e gerente regional. A trilha de treinamento gravada é o que permite uma entrada em 10 dias.",
      { x: 0.6, y: 6.65, w: 12.1, h: 0.3, fontSize: 11.5, italic: true, color: T.muted, margin: 0, isTextBox: true });
  }
'''
ins_before("// ---------- 19. Riscos ----------", mud)

# ---------- Riscos ----------
rep('''      [c("Canal aberto ao público traz contatos ruins e dados pessoais", { bold: true }), c("Triagem por critérios; consentimento LGPD; dados pessoais só no CRM; canal nunca promete condição comercial; bot só na fase 2")],
    ];''',
    '''      [c("Canal aberto ao público traz contatos ruins e dados pessoais", { bold: true }), c("Triagem por critérios; consentimento LGPD; dados pessoais só no CRM; canal nunca promete condição comercial; bot só na fase 2")],
      [c("Troca de pessoa ou de shopping no meio do piloto", { bold: true }), c("Playbooks de entrada e saída; dono e suplente por frente; conhecimento, acessos e licenças por papel, não por pessoa")],
    ];''')
rep('s.addTable(rows, { x: 0.6, y: 1.5, w: 12.1, colW: [4.0, 8.1], rowH: 0.46,', 's.addTable(rows, { x: 0.6, y: 1.5, w: 12.1, colW: [4.0, 8.1], rowH: 0.44,')

# ---------- Próximos passos ----------
rep('''      "Primeira sessão de Fundamentos",
    ], { fontSize: 15, color: T.white, paraSpaceAfter: 8 }), { x: 6.7, y: 2.3, w: 5.5, h: 3.0,''',
    '''      "Primeira sessão de Fundamentos",
      "Suplente de cada frente nomeado",
    ], { fontSize: 15, color: T.white, paraSpaceAfter: 8 }), { x: 6.7, y: 2.3, w: 5.5, h: 3.6,''')
rep('], { fontSize: 15, color: T.white, paraSpaceAfter: 8 }), { x: 0.8, y: 2.3, w: 5.5, h: 3.0,',
    '], { fontSize: 15, color: T.white, paraSpaceAfter: 8 }), { x: 0.8, y: 2.3, w: 5.5, h: 3.6,')

# ---------- Rollout ----------
roll = r'''
  // ---------- 21. Rollout — divisor ----------
  {
    const s = pres.addSlide({ masterName: "ESCURO" });
    arcsDark(s);
    s.addText("DEPOIS DOS 90 DIAS", { x: 0.8, y: 1.6, w: 8, h: 0.4, fontSize: 14, bold: true, color: T.off, charSpacing: 3, margin: 0, isTextBox: true });
    s.addText("Rollout aos demais portfólios", { placeholder: "title" });
    s.addText("O que a regional piloto entrega para a companhia replicar — e como cada portfólio entra em 8 semanas, não em 13.", { placeholder: "body" });
  }

  // ---------- 22. Pacote de replicação ----------
  {
    const s = content("O pacote de replicação que o piloto entrega", "Rollout · O que escala", null);
    const pk = [
      ["FaBrain", "Segundo cérebro modelo", "Estrutura, templates, propósitos e governança — sem dados locais. Um portfólio novo instancia e preenche."],
      ["FaCogs", "Catálogo de apps v1", "Skills .md versionadas: gestão à vista, batalhas, renovações, auditoria, manual, cláusulas e os pilotos aprovados."],
      ["FaShieldAlt", "Esteira já aprovada", "Conector padrão e apps validados no Orca: o portfólio novo configura e passa por mudança padrão, não por projeto."],
      ["FaGraduationCap", "Trilha de treinamento", "Fundamentos gravados, exercícios, biblioteca de casos e formato da clínica semanal."],
      ["FaRoute", "Playbooks", "Entrada e saída de shopping e de pessoa, protocolo dos pilotos, ritmos de governança e regras do jogo."],
      ["FaChartLine", "Scorecard e referência", "Indicadores, método de comparação e os resultados do piloto como linha de referência."],
    ];
    for (let i = 0; i < pk.length; i++) {
      const col = i % 3, row = Math.floor(i / 3);
      const x = 0.6 + col * 4.1, y = 1.6 + row * 2.3;
      card(s, x, y, 3.85, 2.1);
      await iconCircle(s, pk[i][0], x + 0.25, y + 0.25, 0.55);
      s.addText(pk[i][1], { x: x + 0.95, y: y + 0.25, w: 2.8, h: 0.55, fontSize: 15, bold: true, color: T.text, valign: "middle", margin: 0, isTextBox: true });
      s.addText(pk[i][2], { x: x + 0.25, y: y + 0.92, w: 3.4, h: 1.1, fontSize: 12.5, color: T.text, margin: 0, valign: "top", isTextBox: true });
    }
    s.addText([{ text: "Multiplicadores: ", options: { bold: true, color: T.teal } }, { text: "o gerente regional e os pontos focais do piloto formam o primeiro portfólio; cada portfólio formado treina o seguinte.", options: { color: T.text } }],
      { x: 0.6, y: 6.35, w: 12.1, h: 0.45, fontSize: 13, margin: 0, isTextBox: true });
  }

  // ---------- 23. Ondas ----------
  {
    const s = content("Rollout em ondas ao longo de 2027", "Rollout · Cronograma", null);
    const x0 = 3.3, mw = 0.84, y0 = 1.55;
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    s.addShape(pres.shapes.RECTANGLE, { x: x0 + 0.02, y: y0, w: 12 * mw - 0.04, h: 0.3, fill: { color: T.teal9 }, line: { color: T.teal9 } });
    s.addText("2027", { x: x0, y: y0, w: 12 * mw, h: 0.3, fontSize: 11, bold: true, color: T.white, align: "center", valign: "middle", margin: 0, isTextBox: true });
    months.forEach((m, i) => s.addText(m, { x: x0 + i * mw, y: y0 + 0.33, w: mw, h: 0.28, fontSize: 10, color: T.muted, align: "center", margin: 0, isTextBox: true }));
    const rows = [
      ["Onda 0 · piloto", [[1, 1, T.warm, "S13 · go/no-go"]]],
      ["Onda 1 · portfólio-espelho", [[2, 4, T.teal, "1 portfólio · 8 semanas + ajuste do pacote"]]],
      ["Onda 2 · expansão", [[5, 7, T.teal6, "2 a 3 portfólios em paralelo"]]],
      ["Onda 3 · demais portfólios", [[8, 10, T.teal5, "restante, em lotes"]]],
      ["Consolidação", [[11, 12, T.teal9, "modelo padrão da Cia"]]],
      ["Centro de excelência", [[2, 12, T.warm, "diretor do piloto + 2 multiplicadores · catálogo, esteira, scorecard"]]],
    ];
    rows.forEach(([lbl, bars], r) => {
      const y = y0 + 0.75 + r * 0.55;
      s.addText(lbl, { x: 0.6, y, w: 2.6, h: 0.4, fontSize: 12.5, bold: r === 5, color: T.text, valign: "middle", margin: 0, isTextBox: true });
      bars.forEach(([a, b, c, t]) => {
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x0 + (a - 1) * mw + 0.04, y: y + 0.04, w: (b - a + 1) * mw - 0.08, h: 0.32, rectRadius: 0.06, fill: { color: c }, line: { color: c } });
        s.addText(t, { x: x0 + (a - 1) * mw, y: y + 0.04, w: (b - a + 1) * mw, h: 0.32, fontSize: 10, color: c === T.warm ? T.text : T.white, align: "center", valign: "middle", margin: 0, isTextBox: true });
      });
    });
    const nt = [
      ["Uma onda só começa", "quando a anterior atinge os critérios de saída: time autônomo, apps em produção, scorecard medido."],
      ["Multiplicadores em cascata", "cada portfólio formado treina o seguinte: 1 → 2 → 4 formadores. O centro de excelência não vira gargalo."],
      ["Licenças e custo", "+5 licenças Claude Enterprise por portfólio, realocáveis; custo por portfólio conhecido ao fim do piloto."],
    ];
    nt.forEach(([t, d], i) => {
      const x = 0.6 + i * 4.1;
      card(s, x, 5.1, 3.85, 1.6);
      s.addText(t, { x: x + 0.25, y: 5.2, w: 3.4, h: 0.35, fontSize: 13.5, bold: true, color: T.teal, margin: 0, isTextBox: true });
      s.addText(d, { x: x + 0.25, y: 5.55, w: 3.4, h: 1.1, fontSize: 11.5, color: T.text, margin: 0, valign: "top", isTextBox: true });
    });
    s.addText("Número e ordem dos portfólios a confirmar com a diretoria; o critério sugerido é prontidão de dados e batalhas definidas.",
      { x: 0.6, y: 6.75, w: 12.1, h: 0.25, fontSize: 10.5, italic: true, color: T.muted, margin: 0, isTextBox: true });
  }

  // ---------- 24. Passo a passo por portfólio ----------
  await stepSlide("Passo a passo · como cada portfólio entra (8 semanas)", "Rollout · Por portfólio", [
    ["Sponsor e time", "diretor do portfólio assume como sponsor; nomeia gerente regional e 3 pontos focais, com suplentes; +5 licenças ao grupo do papel", "Diretoria + diretor do portfólio", "S1", "Time nomeado"],
    ["Diagnóstico", "posicionamento e batalhas de cada shopping, fontes de dados, contratos e cadernos técnicos; baseline de horas e indicadores", "Gerente regional + multiplicador", "S1–S2", "Baseline do portfólio"],
    ["Segundo cérebro", "instanciar o modelo; uma pasta por shopping pelo playbook de entrada; Projects por frente", "Pontos focais", "S2–S3", "Base v1 do portfólio"],
    ["Dados e segurança", "portfólio incluído no conector padrão (views); mudança padrão no Orca; contratos convertidos em .md", "TI + SI", "S2–S4", "G1 do portfólio"],
    ["Gestão à vista e placar", "painéis, batalhas, RMR e visita estruturada a partir do catálogo", "Gerente regional", "S3–S4", "Painéis em produção"],
    ["Apps e pilotos", "renovações, auditoria, manual e cláusulas configurados; pilotos escolhidos pela vacância, obras e boletos do portfólio", "Pontos focais", "S4–S6", "Apps em uso"],
    ["Treinamento", "trilha condensada (fundamentos + prática) e clínica semanal com o multiplicador do portfólio anterior", "Multiplicador + diretor", "S1–S8", "Time autônomo"],
    ["Scorecard e passagem", "8 semanas medidas; o portfólio forma seus multiplicadores e entra na onda seguinte como formador", "Diretor do portfólio", "S8", "Decisão e multiplicadores"],
  ], "8 semanas porque fundação técnica, catálogo e trilha já existem; o que é local (batalhas, contratos, dados) é o que leva tempo.");

  // ---------- 25. Critérios e governança do rollout ----------
  {
    const s = content("Critérios de go/no-go e governança do rollout", "Rollout · Governança", null);
    const cols = [
      ["Go/no-go do rollout · S13", T.teal, T.white, T.off, [
        "Scorecard do piloto com ganho medido em pessoas, processos e adoção",
        "Teste de portabilidade aprovado",
        "Esteira Orca com mudança padrão aprovada para conector e apps",
        "Simulação de entrada e saída dentro dos prazos",
        "Custo por portfólio conhecido",
      ]],
      ["Pré-requisitos de cada portfólio", T.tint, T.teal, T.text, [
        "Sponsor: o diretor do portfólio",
        "Time nomeado, com dono e suplente por frente",
        "Batalhas de posicionamento definidas por shopping",
        "Dados conectáveis (views no conector padrão)",
        "5 licenças aprovadas",
      ]],
      ["Governança", T.teal9, T.white, T.off, [
        "Comitê mensal de rollout: diretoria + diretores dos portfólios",
        "Centro de excelência leve: diretor do piloto + 2 multiplicadores (~20% do tempo)",
        "Central: catálogo, esteira, templates, trilha, scorecard",
        "Local: batalhas, dados, contratos, escolha dos pilotos",
        "Mudança no catálogo entra por versão, para todos os portfólios ao mesmo tempo",
      ]],
    ];
    cols.forEach(([t, bg, tc, bc, b], i) => {
      const x = 0.6 + i * 4.1;
      card(s, x, 1.6, 3.85, 4.85, bg);
      s.addText(t, { x: x + 0.25, y: 1.75, w: 3.4, h: 0.5, fontSize: 15.5, bold: true, color: tc, valign: "top", margin: 0, isTextBox: true });
      s.addText(bullets(b, { fontSize: 12.5, color: bc, paraSpaceAfter: 7 }), { x: x + 0.25, y: 2.4, w: 3.4, h: 3.95, valign: "top", margin: 0, isTextBox: true });
    });
    s.addText("O que escala é o sistema: uma esteira, um catálogo, um scorecard. O que cada portfólio adapta é o conteúdo: suas batalhas, seus dados, seus contratos.",
      { x: 0.6, y: 6.55, w: 12.1, h: 0.4, fontSize: 13, italic: true, color: T.teal9, margin: 0, isTextBox: true });
  }

  // ---------- 26. Decisões do rollout ----------
  {
    const s = pres.addSlide({ masterName: "ESCURO" });
    arcsDark(s, true);
    s.addText("Rollout: o que decidir agora e o que decidir na S13", { x: 0.8, y: 0.7, w: 11, h: 0.8, fontSize: 32, bold: true, color: T.white, margin: 0, isTextBox: true });
    s.addText("Agora", { x: 0.8, y: 1.8, w: 5.5, h: 0.4, fontSize: 18, bold: true, color: T.orange, margin: 0, isTextBox: true });
    s.addText(bullets([
      "Aprovar o piloto como referência de rollout da companhia",
      "Confirmar quantos portfólios entram e em que ordem",
      "Reservar licenças e orçamento da onda 1",
      "Designar o centro de excelência e o comitê de rollout",
    ], { fontSize: 15, color: T.white, paraSpaceAfter: 8 }), { x: 0.8, y: 2.3, w: 5.5, h: 3.6, valign: "top", margin: 0, isTextBox: true });
    s.addText("Na semana 13", { x: 6.7, y: 1.8, w: 5.5, h: 0.4, fontSize: 18, bold: true, color: T.orange, margin: 0, isTextBox: true });
    s.addText(bullets([
      "Go/no-go com o scorecard do piloto",
      "Portfólio da onda 1 e seu sponsor",
      "Versão 1 do catálogo de apps congelada",
      "Calendário das ondas 2 e 3",
    ], { fontSize: 15, color: T.white, paraSpaceAfter: 8 }), { x: 6.7, y: 2.3, w: 5.5, h: 3.6, valign: "top", margin: 0, isTextBox: true });
  }

'''
ins_before("await pres.writeFile({ fileName: OUT });", roll)

open(p, 'w').write(s)
print("ok")
