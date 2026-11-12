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

# ---------- Etapa 0B: NIST ----------
rep('["Alinhar o processo com SI", "critérios de aprovação, severidades que bloqueiam, prazos e quem aprova cada gate", "Diretor + SI", "S1", "Checklist de liberação"],',
    '["Alinhar o processo com SI", "critérios de aprovação, severidades que bloqueiam, prazos e quem aprova cada gate; plano de risco e segurança nas funções do NIST CSF, com resposta a incidentes", "Diretor + SI", "S1", "Checklist e plano de risco"],')

# ---------- Treinamento: formação externa ----------
rep('["Formação externa", "Em paralelo", "Conforme proposta", ["Asimov Academy para os 4 gerentes", "MIT Applied Agentic AI para o diretor", "Conteúdo trazido para 07-treinamento"], "Sujeito à aprovação da diretoria"],',
    '["Formação externa", "Próxima turma", "Conforme proposta", ["Asimov Academy para os 4 gerentes", "MIT: liderar a adoção de IA agêntica, 8 semanas, para o diretor", "Frameworks do curso já aplicados no plano; o plano é o projeto final"], "Sujeito à aprovação e à data da turma"],')
rep('["Formação externa", "Asimov para os gerentes e MIT para o diretor; conteúdo trazido para o time", "Diretor", "Em paralelo", "Sujeito à aprovação"],',
    '["Formação externa", "Asimov para os gerentes; MIT (8 semanas, 8 a 10 h/semana) para o diretor na próxima turma disponível; o relatório do piloto é o projeto final do curso", "Diretor", "Próxima turma", "Sujeito à aprovação"],')

# ---------- Marcos ----------
rep('"Regras de dados validadas com TI e Jurídico"', '"Regras de dados (LGPD) e plano de risco e segurança (NIST CSF) validados com TI, Jurídico e SI"')

# ---------- Governança: ética ----------
rep('''      "Cada frente tem dono e suplente; nada fica só na cabeça de alguém",
    ], { fontSize: 12.5, color: T.off, paraSpaceAfter: 6 }),''',
    '''      "Cada frente tem dono e suplente; nada fica só na cabeça de alguém",
      "Quem fala com a IA sabe que é IA: canal, bot e pareceres se identificam",
    ], { fontSize: 12, color: T.off, paraSpaceAfter: 5 }),''')

# ---------- Riscos ----------
rep('''      [c("Troca de pessoa ou de shopping no meio do piloto", { bold: true }), c("Playbooks de entrada e saída; dono e suplente por frente; conhecimento, acessos e licenças por papel, não por pessoa")],
    ];''',
    '''      [c("Troca de pessoa ou de shopping no meio do piloto", { bold: true }), c("Playbooks de entrada e saída; dono e suplente por frente; conhecimento, acessos e licenças por papel, não por pessoa")],
      [c("Curso do MIT em paralelo consome 8 a 10 h/semana do diretor", { bold: true }), c("Plano não depende da data da turma; gerente regional assume o PMO; o projeto final do curso é o relatório do piloto, não trabalho extra")],
    ];''')
rep('''    const c = (t, o = {}) => ({ text: t, options: { fontSize: 11.5, color: T.text, valign: "middle", ...o } });
    const rows = [
      [{ text: "Risco", options: hdr }, { text: "Mitigação", options: hdr }],''',
    '''    const c = (t, o = {}) => ({ text: t, options: { fontSize: 11, color: T.text, valign: "middle", ...o } });
    const rows = [
      [{ text: "Risco", options: hdr }, { text: "Mitigação", options: hdr }],''')
rep('s.addTable(rows, { x: 0.6, y: 1.5, w: 12.1, colW: [4.0, 8.1], rowH: 0.44, border', 's.addTable(rows, { x: 0.6, y: 1.5, w: 12.1, colW: [4.0, 8.1], rowH: 0.4, border')

# ---------- Próximos passos ----------
rep('''      "Canal de captação: começar pelo link ou já pelo bot",''',
    '''      "Canal de captação: começar pelo link ou já pelo bot",
      "Confirmar a próxima turma do curso do MIT (português ou inglês)",''')

# ---------- Seção MIT ----------
mit = r'''// ---------- 14c. MIT — como entra ----------
  {
    const s = content("O curso do MIT entra como método, não como pré-requisito", "Frente 5 · Curso do MIT",
      "Curso executivo, sem programação, sobre liderar a adoção de IA generativa e agêntica. Seus frameworks já estão aplicados nos 90 dias; a data da turma não trava o plano.");
    card(s, 0.6, 2.05, 5.2, 4.55, T.teal9);
    s.addText("Ficha do curso", { x: 0.85, y: 2.2, w: 4.7, h: 0.35, fontSize: 15, bold: true, color: T.white, margin: 0, isTextBox: true });
    s.addText(bullets([
      "MIT Professional Education, com Abel Sanchez e John R. Williams; entrega pela Global Alumni",
      "8 semanas online, 8 a 10 h/semana; 2 sessões ao vivo com o MIT e até 8 com facilitadores",
      "Última turma em português: 1/set a 27/out/2026 (US$ 1.870); versão em inglês US$ 3.200",
      "Próxima turma em português sem data divulgada: confirmar antes de decidir",
      "Projeto final: plano de integração de IA ou apresentação executiva com risco-benefício, custos e KPIs",
    ], { fontSize: 12, color: T.off, paraSpaceAfter: 6 }), { x: 0.85, y: 2.6, w: 4.75, h: 3.9, valign: "top", margin: 0, isTextBox: true });
    const rl = [
      ["O plano não espera a turma", "Os 90 dias começam em 2/nov; o diretor entra na próxima turma disponível, em português ou inglês."],
      ["Os frameworks já estão no plano", "NIST CSF e resposta a incidentes, 3 a 5 KPIs por app, quadrante Risco–Velocidade, sandbox e A/B, critérios de plataforma e custo do sistema."],
      ["O plano é o projeto final", "Este deck e o relatório da S13 são a apresentação executiva que o curso pede, sem trabalho extra para o diretor."],
      ["Leitura franca", "Módulos 1 a 3 tendem a ser básicos para quem já opera IA; o valor está em segurança, KPIs, governança e no certificado. A regulação ensinada é GDPR/CCPA/HIPAA: aqui, LGPD."],
    ];
    rl.forEach(([t, d], i) => {
      const y = 2.05 + i * 1.15;
      card(s, 6.1, y, 6.6, 1.0);
      s.addText(t, { x: 6.35, y: y + 0.1, w: 6.1, h: 0.3, fontSize: 13.5, bold: true, color: T.teal, margin: 0, isTextBox: true });
      s.addText(d, { x: 6.35, y: y + 0.4, w: 6.1, h: 0.58, fontSize: 11.5, color: T.text, margin: 0, valign: "top", isTextBox: true });
    });
    s.addText("Dados da ficha vêm das páginas do MIT PE e da Global Alumni; a grade da turma em português pode diferir da versão em inglês.",
      { x: 0.6, y: 6.7, w: 12.1, h: 0.28, fontSize: 10.5, italic: true, color: T.muted, margin: 0, isTextBox: true });
  }

  // ---------- 14d. MIT — mapa dos módulos ----------
  {
    const s = content("Cada módulo do curso, aplicado no plano", "Frente 5 · Curso do MIT", null);
    const hdr = { bold: true, color: T.white, fill: { color: T.teal }, fontSize: 12, valign: "middle" };
    const c = (t, o = {}) => ({ text: t, options: { fontSize: 11.5, color: T.text, valign: "middle", ...o } });
    const rows = [[{ text: "Módulo do curso", options: hdr }, { text: "Onde o plano aplica", options: hdr }]];
    [
      ["1 · Fundamentos de IA generativa e agêntica; custo de um sistema de IA", "Fundamentos 1 e 2 do treinamento; estrutura de custo do sistema; tipos de modelo no teste de portabilidade"],
      ["2 · Plataformas: open source × proprietária", "Decisão de plataforma registrada em 00-governanca (por que Claude Enterprise e o que mudaria a decisão); teste de portabilidade na S12"],
      ["3 · Conectar agentes ao ecossistema: fluxo, APIs, riscos e métricas", "Etapa 0A (conector com a base da companhia); tabela hoje → com o plano; especificação entrada / faz / saída de cada app"],
      ["4 · Cibersegurança: NIST CSF e resposta a incidentes", "Etapa 0B organizada nas funções do NIST CSF, com plano de resposta a incidentes; validação no Orca"],
      ["5 · Agentes por função de negócio; trade-offs de arquitetura", "Frentes por ponto focal (negócios, marketing, operações); um agente por app, orquestrados pelo segundo cérebro"],
      ["6 · Do piloto à prática: 3 a 5 KPIs", "3 a 5 KPIs por app, ligados aos dois propósitos; scorecard mensal com a diretoria"],
      ["7 · Governança e testes: sandbox, A/B, quadrante Risco–Velocidade; GDPR/CCPA/HIPAA", "Dev com dados mascarados (sandbox); back-test e regional de comparação (A/B); quadrante define a ordem dos apps; regulação traduzida para LGPD"],
      ["8 · Ética e projeto final", "Regras do jogo e transparência (quem fala com a IA sabe que é IA); este plano e o relatório da S13 são o projeto final"],
    ].forEach(([a, b]) => rows.push([c(a, { bold: true, color: T.teal9 }), c(b)]));
    s.addTable(rows, { x: 0.6, y: 1.5, w: 12.1, colW: [4.3, 7.8], rowH: [0.4].concat(Array(8).fill(0.6)),
      border: { type: "solid", pt: 0.75, color: T.border }, fill: { color: T.white }, margin: [0.04, 0.1, 0.04, 0.1] });
    s.addText("Lista de módulos da versão em inglês; o currículo está sujeito a mudanças.",
      { x: 0.6, y: 6.7, w: 12.1, h: 0.28, fontSize: 10.5, italic: true, color: T.muted, margin: 0, isTextBox: true });
  }

  // ---------- 14e. Quadrante Risco–Velocidade ----------
  {
    const s = content("Quadrante Risco–Velocidade: a ordem de entrada dos apps", "Frente 5 · Curso do MIT",
      "Risco = sensibilidade do dado, peso da decisão e exposição externa. Velocidade = prontidão para entrar em produção.");
    const q = [
      [0, 0, "Alto risco · menor velocidade", "Por último, com controle máximo", T.teal9, T.white, T.off, ["Gestão de cláusulas (contratos confidenciais)", "Canal público e bot do radar (dados pessoais, exposição)"], "G2 a G4 · validação extra de SI e Jurídico"],
      [1, 0, "Alto risco · alta velocidade", "Entrar cedo, com gates reforçados", T.teal, T.white, T.off, ["Gestão de renovações", "Auditoria de boletos", "Radar de auditoria"], "G2 e G3 · back-test obrigatório e assinatura humana"],
      [0, 1, "Baixo risco · menor velocidade", "Preparar a base e entrar quando pronta", T.tint, T.teal, T.text, ["Otimizador de obras (depende do caderno técnico)", "Radar de mídia", "Radar de varejo: busca ativa"], "G3 · esteira padrão"],
      [1, 1, "Baixo risco · alta velocidade", "Começar já", T.tint, T.teal, T.text, ["Segundo cérebro", "Gestão à vista e placar das batalhas", "Manual operacional"], "G1 e G2 · esteira padrão"],
    ];
    const qx = 1.3, qy = 2.05, qw = 5.5, qh = 2.15, gap = 0.15;
    q.forEach(([cx, cy, t, st, bg, tc, bc, apps, gate]) => {
      const x = qx + cx * (qw + gap), y = qy + cy * (qh + gap);
      card(s, x, y, qw, qh, bg);
      s.addText(t, { x: x + 0.25, y: y + 0.12, w: qw - 0.5, h: 0.3, fontSize: 11, bold: true, color: bg === T.tint ? T.muted : T.off, charSpacing: 1, margin: 0, isTextBox: true });
      s.addText(st, { x: x + 0.25, y: y + 0.4, w: qw - 0.5, h: 0.35, fontSize: 15, bold: true, color: tc, margin: 0, isTextBox: true });
      s.addText(bullets(apps, { fontSize: 12, color: bc, paraSpaceAfter: 3 }), { x: x + 0.25, y: y + 0.8, w: qw - 0.5, h: 1.0, valign: "top", margin: 0, isTextBox: true });
      s.addText(gate, { x: x + 0.25, y: y + qh - 0.35, w: qw - 0.5, h: 0.28, fontSize: 11, italic: true, color: bg === T.tint ? T.muted : T.off, margin: 0, isTextBox: true });
    });
    s.addText("Risco maior ↑", { x: 0.55, y: qy, w: 0.7, h: 0.3, fontSize: 11, bold: true, color: T.muted, margin: 0, isTextBox: true });
    s.addText("Risco menor ↓", { x: 0.55, y: qy + 2 * qh + gap - 0.3, w: 0.7, h: 0.3, fontSize: 11, bold: true, color: T.muted, margin: 0, isTextBox: true });
    s.addText("Velocidade: prontidão para produção  →", { x: qx, y: qy + 2 * qh + gap + 0.08, w: 2 * qw + gap, h: 0.3, fontSize: 11, bold: true, color: T.muted, align: "right", margin: 0, isTextBox: true });
    s.addText("Leitura inicial do diretor, a validar com SI na S1; um app muda de quadrante quando o dado ou a exposição mudam (ex.: bot do radar).",
      { x: 0.6, y: 6.72, w: 12.1, h: 0.26, fontSize: 10.5, italic: true, color: T.muted, margin: 0, isTextBox: true });
  }

  // ---------- 14f. NIST CSF ----------
  {
    const s = content("Plano de risco e segurança nas funções do NIST CSF", "Frente 5 · Curso do MIT",
      "O que o plano já faz, organizado no formato que SI reconhece — mais três cenários de resposta a incidentes.");
    const fn = [
      ["Governar", ["Política de uso de IA e regras do jogo", "Papéis, alçadas e suplentes", "Classificação de dados e LGPD", "Comitê mensal com a diretoria"]],
      ["Identificar", ["Inventário: conector, repositório, cofre, canal público", "Matriz frente × campos (minimização)", "Ativos registrados no Orca", "Quadrante Risco–Velocidade"]],
      ["Proteger", ["Acesso somente leitura; credencial em cofre", "Grupos SSO por papel", "Dev com dados mascarados", "Esteira de mudanças e gates"]],
      ["Detectar", ["Varredura contínua do Orca", "Logs de uso do Claude Enterprise", "Alerta de uso anômalo ou fora do papel", "Revisão de saídas usadas em decisão"]],
      ["Responder", ["Quem aciona: SI + diretor", "Isolar em 1 h: revogar grupo, pausar conector ou canal", "Dado pessoal: Jurídico e encarregado LGPD", "Registro em 00-governanca/decisoes"]],
      ["Recuperar", ["Restaurar do repositório versionado", "Reconciliar dados com o BI", "Lição aprendida e revisão do catálogo", "Retorno gradual pelos gates"]],
    ];
    const bw = 1.95, gap = 0.08;
    fn.forEach(([t, b], i) => {
      const x = 0.6 + i * (bw + gap);
      card(s, x, 2.05, bw, 2.75, i === 0 ? T.teal9 : T.tint);
      s.addText(t, { x: x + 0.15, y: 2.15, w: bw - 0.3, h: 0.35, fontSize: 14, bold: true, color: i === 0 ? T.white : T.teal, margin: 0, isTextBox: true });
      s.addText(bullets(b, { fontSize: 10.5, color: i === 0 ? T.off : T.text, paraSpaceAfter: 3 }), { x: x + 0.15, y: 2.55, w: bw - 0.25, h: 2.2, valign: "top", margin: 0, isTextBox: true });
    });
    s.addText("Resposta a incidentes · três cenários", { x: 0.6, y: 4.95, w: 8, h: 0.35, fontSize: 14, bold: true, color: T.text, margin: 0, isTextBox: true });
    const sc = [
      ["Dado confidencial exposto (contrato, boleto)", "Revogar o grupo, pausar o conector, avaliar alcance com SI; se houver dado pessoal, Jurídico e encarregado LGPD em até 24 h; comunicação conforme a política."],
      ["Saída errada usada em decisão", "Registrar o caso, reverter a decisão se possível, revisar a skill e o back-test; app volta a rascunho até nova validação."],
      ["Abuso do canal público", "Pausar o link ou bot, bloquear a origem, revisar a triagem; leads do período reavaliados por pessoa antes de qualquer contato."],
    ];
    sc.forEach(([t, d], i) => {
      const x = 0.6 + i * 4.1;
      card(s, x, 5.35, 3.85, 1.3, T.off);
      s.addText(t, { x: x + 0.2, y: 5.42, w: 3.45, h: 0.3, fontSize: 12, bold: true, color: T.teal9, margin: 0, isTextBox: true });
      s.addText(d, { x: x + 0.2, y: 5.72, w: 3.45, h: 0.9, fontSize: 10.5, color: T.text, margin: 0, valign: "top", isTextBox: true });
    });
    s.addText("NIST CSF 2.0 (seis funções). Escopo final a fechar com SI na S1; o Orca cobre Detectar e parte de Identificar e Proteger.",
      { x: 0.6, y: 6.72, w: 12.1, h: 0.26, fontSize: 10.5, italic: true, color: T.muted, margin: 0, isTextBox: true });
  }

  // ---------- 14g. KPIs ----------
  {
    const s = content("3 a 5 KPIs por app, ligados aos dois propósitos", "Frente 5 · Curso do MIT", null);
    const hdr = { bold: true, color: T.white, fill: { color: T.teal }, fontSize: 12, valign: "middle" };
    const c = (t, o = {}) => ({ text: t, options: { fontSize: 11, color: T.text, valign: "middle", ...o } });
    const rows = [[{ text: "App", options: hdr }, { text: "KPIs", options: hdr }, { text: "Fonte", options: hdr }]];
    [
      ["Gestão à vista e batalhas", "% de batalhas no prazo · indicadores atualizados sem intervenção (%) · horas de preparação da RMR · ações da visita fechadas no prazo (%)", "Painel"],
      ["Gestão de renovações", "renovações tratadas na janela (%) · leasing spread · tempo de preparação por negociação · aderência às batalhas (%)", "App e sistemas"],
      ["Radar de auditoria", "pendências vencidas · pendências com dono e prazo (%) · antecedência média do alerta · achados vs. período anterior", "Radar e auditoria"],
      ["Manual operacional", "taxa de acerto · consultas por semana · respostas com fonte (%) · lacunas convertidas em revisão", "Assistente e teste"],
      ["Radar de varejo regional", "leads qualificados por mês · resposta em até 48 h (%) · propostas geradas · operações novas aderentes ao posicionamento", "CRM do radar"],
      ["Radar de mídia", "pipeline de mídia · receita de anunciantes e patrocínio · ocupação do inventário (%)", "Marketing"],
      ["Otimizador de obras", "dias para devolver projeto · aprovados na 1ª análise (%) · dias assinatura → inauguração · retrabalho por divergência com o caderno", "Log de obras"],
      ["Auditoria de boletos", "boletos conferidos (%) · precisão (confirmadas / apontadas) · receita recuperada · tempo de conferência", "App e financeiro"],
      ["Gestão de cláusulas", "contratos em .md (%) · erro em campos críticos (%) · gatilhos atendidos no prazo (%) · tempo de busca por cláusula", "Índice e Jurídico"],
      ["Segundo cérebro e treinamento", "notas validadas / total · competências em IA (início e fim) · usuários ativos por semana · dias para integrar pessoa ou shopping", "Repositório e Claude"],
    ].forEach(([a, b, f]) => rows.push([c(a, { bold: true, color: T.teal9 }), c(b), c(f, { color: T.muted })]));
    s.addTable(rows, { x: 0.6, y: 1.5, w: 12.1, colW: [2.5, 7.6, 2.0], rowH: [0.38].concat(Array(10).fill(0.47)),
      border: { type: "solid", pt: 0.75, color: T.border }, fill: { color: T.white }, margin: [0.03, 0.1, 0.03, 0.1] });
    s.addText("Metas numéricas definidas no baseline (S1–S3); as métricas de custo e horas liberadas ficam no scorecard geral.",
      { x: 0.6, y: 6.72, w: 12.1, h: 0.26, fontSize: 10.5, italic: true, color: T.muted, margin: 0, isTextBox: true });
  }

  // ---------- 14h. Custo ----------
  {
    const s = content("Custo do sistema: o que entra na conta", "Frente 5 · Curso do MIT",
      "O projeto final do curso pede risco-benefício, custos e KPIs. Esta é a estrutura de custo; os valores fecham na S1 e na S13.");
    const it = [
      ["Licenças", "5 por portfólio (uma por papel) no Claude Enterprise já contratado; valor unitário do contrato vigente, a confirmar", "Custo marginal"],
      ["Horas do time", "~24 h/semana no piloto (4 + 6 + 5 + 4 + 5) × 13 semanas ≈ 310 h; no rollout, ~8 semanas por portfólio + multiplicador", "Medido no registro de tempo"],
      ["TI e SI", "conector, views, esteira Orca e mudanças padrão; horas estimadas no kickoff técnico da S1", "A estimar na S1"],
      ["Formação externa", "MIT: US$ 1.870 (turma em português) ou US$ 3.200 (inglês); Asimov Academy × 4 gerentes, valor a confirmar", "Sujeito à aprovação"],
      ["Infraestrutura", "hospedagem do conector e do formulário na nuvem da companhia; canal bot (fase 2) com custo próprio", "Marginal; bot a estimar"],
      ["Benefício medido", "horas liberadas × custo-hora, receita recuperada em boletos, dias de obra, spread e mídia: tudo no scorecard", "Scorecard S13"],
    ];
    it.forEach(([t, d, tag], i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = 0.6 + col * 6.2, y = 2.05 + row * 1.45;
      card(s, x, y, 5.9, 1.3, i === 5 ? T.teal : T.tint);
      const dark = i === 5;
      s.addText(t, { x: x + 0.25, y: y + 0.12, w: 3.5, h: 0.32, fontSize: 14, bold: true, color: dark ? T.white : T.teal, margin: 0, isTextBox: true });
      s.addText(tag, { x: x + 3.4, y: y + 0.15, w: 2.3, h: 0.3, fontSize: 10.5, italic: true, color: dark ? T.off : T.muted, align: "right", margin: 0, isTextBox: true });
      s.addText(d, { x: x + 0.25, y: y + 0.47, w: 5.4, h: 0.8, fontSize: 11.5, color: dark ? T.off : T.text, margin: 0, valign: "top", isTextBox: true });
    });
    s.addText([{ text: "Custo por portfólio = licenças × papéis + horas do time + TI/SI. ", options: { bold: true, color: T.teal9 } },
      { text: "É o número que o go/no-go do rollout usa na S13; sem valor de licença e horas de TI, hoje ele é uma estrutura, não um total.", options: { color: T.text } }],
      { x: 0.6, y: 6.45, w: 12.1, h: 0.5, fontSize: 12.5, margin: 0, valign: "top", isTextBox: true });
  }
'''
ins_before("// ---------- 15. Cronograma ----------", mit)

open(p, 'w').write(s)
print("ok")
