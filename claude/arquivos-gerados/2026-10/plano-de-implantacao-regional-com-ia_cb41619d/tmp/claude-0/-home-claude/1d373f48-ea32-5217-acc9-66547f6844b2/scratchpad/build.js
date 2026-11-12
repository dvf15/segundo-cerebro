const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");
const { applyTheme } = require("/mnt/skills/public/pptx/scripts/apply_theme.js");

const OUT = "/home/claude/Regional_Inteligente_Plano_90_dias.pptx";

const T = {
  teal: "00616F", teal6: "098B80", teal9: "0D454A", teal5: "368C82",
  orange: "EDA754", red: "CD5151", green: "6CC680", warm: "CCC5BC", off: "E5DED4",
  text: "1E2B2D", muted: "5C6E70", border: "D8D2C8", white: "FFFFFF", tint: "EEF5F5",
};
const THEME = {
  name: "Allos Regional",
  headFontFace: "Calibri", bodyFontFace: "Calibri",
  colors: {
    dk1: T.text, lt1: T.white, dk2: T.teal9, lt2: T.off,
    accent1: T.teal, accent2: T.teal6, accent3: T.orange, accent4: T.red,
    accent5: T.green, accent6: T.teal5, hlink: T.teal, folHlink: T.teal5,
  },
};

async function icon(name, color, size = 256) {
  const C = fa[name];
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(C, { color: "#" + color, size: String(size) }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
  pres.theme = { headFontFace: "Calibri", bodyFontFace: "Calibri" };
  pres.title = "Regional Inteligente — plano de implantação em 90 dias";
  pres.author = "Diretoria de Portfólio";

  const W = 13.333, H = 7.5;

  // ---------- Layouts ----------
  pres.defineSlideMaster({
    title: "ESCURO",
    background: { color: T.teal },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 2.3, w: 9.5, h: 1.8, fontSize: 44, bold: true, color: T.white, valign: "top", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 0.8, y: 4.2, w: 9.0, h: 1.2, fontSize: 20, color: T.off, valign: "top", margin: 0 }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "CONTEUDO",
    background: { color: T.white },
    margin: [0.5, 0.6, 0.6, 0.6],
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.62, w: 11.2, h: 0.7, fontSize: 30, bold: true, color: T.teal, valign: "top", margin: 0 }, text: "" } },
      { text: { text: "Regional Inteligente · plano de 90 dias", options: { x: 0.6, y: 7.02, w: 6, h: 0.3, fontSize: 10, color: T.muted, margin: 0 } } },
    ],
    slideNumber: { x: 12.3, y: 7.02, w: 0.5, h: 0.3, fontSize: 10, color: T.muted, align: "right" },
  });

  // arc motif helpers
  function arcsDark(s) {
    const rings = [[8.6, 0.6, 6.4], [9.6, 1.6, 5.2], [10.6, -1.2, 5.6], [7.8, 3.6, 5.0]];
    rings.forEach(([x, y, d], i) => s.addShape(pres.shapes.OVAL, {
      x, y, w: d, h: d, fill: { type: "none" }, line: { color: T.white, width: 1.25, transparency: 55 + i * 8 }, objectName: "arco-" + i,
    }));
  }
  function arcCorner(s) {
    s.addShape(pres.shapes.OVAL, { x: 11.9, y: -1.0, w: 2.2, h: 2.2, fill: { type: "none" }, line: { color: T.teal5, width: 1.25, transparency: 40 }, objectName: "arco-a" });
    s.addShape(pres.shapes.OVAL, { x: 12.4, y: -0.5, w: 2.2, h: 2.2, fill: { type: "none" }, line: { color: T.teal6, width: 1, transparency: 60 }, objectName: "arco-b" });
  }
  function tag(s, txt, color = T.teal6) {
    s.addText(txt.toUpperCase(), { x: 0.6, y: 0.3, w: 8, h: 0.3, fontSize: 11, bold: true, color, charSpacing: 2, margin: 0, isTextBox: true });
  }
  function lead(s, txt, y = 1.3) {
    s.addText(txt, { x: 0.6, y, w: 11.8, h: 0.5, fontSize: 16, color: T.muted, margin: 0, isTextBox: true, valign: "top" });
  }
  function content(title, tg, ld) {
    const s = pres.addSlide({ masterName: "CONTEUDO" });
    s.addText(title, { placeholder: "title" });
    if (tg) tag(s, tg);
    if (ld) lead(s, ld);
    arcCorner(s);
    return s;
  }
  function card(s, x, y, w, h, fill = T.tint) {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: { color: fill } });
  }
  async function iconCircle(s, name, x, y, d = 0.62, bg = T.teal, fg = T.white) {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: bg }, line: { color: bg } });
    const pad = d * 0.24;
    s.addImage({ data: await icon(name, fg), x: x + pad, y: y + pad, w: d - 2 * pad, h: d - 2 * pad });
  }
  const bullets = (arr, opts = {}) => arr.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < arr.length - 1, ...opts } }));

  // ---------- 1. Capa ----------
  {
    const s = pres.addSlide({ masterName: "ESCURO" });
    arcsDark(s);
    s.addText("REGIONAL INTELIGENTE", { x: 0.8, y: 1.6, w: 8, h: 0.4, fontSize: 14, bold: true, color: T.off, charSpacing: 3, margin: 0, isTextBox: true });
    s.addText("Plano de implantação em 90 dias", { placeholder: "title" });
    s.addText("Claude Enterprise · Diretor de portfólio, gerente regional e pontos focais de negócios, marketing e operações", { placeholder: "body" });
    s.addText("Novembro 2026 a janeiro 2027 · proposta para discussão", { x: 0.8, y: 6.3, w: 8, h: 0.4, fontSize: 14, color: T.off, margin: 0, isTextBox: true });
  }

  // ---------- 2. Propósito ----------
  {
    const s = content("A IA a serviço do propósito da regional", "Por que", null);
    card(s, 0.6, 1.55, 5.2, 4.95, T.teal);
    s.addText([
      { text: "Propagar a cultura, formar lideranças e entregar a estratégia", options: { fontSize: 24, bold: true, color: T.white, breakLine: true } },
      { text: " ", options: { fontSize: 10, breakLine: true } },
      { text: "maximizando a criação e a captura de valor nos shoppings da regional, com melhoria contínua e respeito às políticas da companhia.", options: { fontSize: 16, color: T.off } },
    ], { x: 0.95, y: 1.9, w: 4.5, h: 4.3, valign: "top", margin: 0, isTextBox: true });

    const pil = [
      ["FaUsers", "Pessoas", "Evolução técnica e gerencial do time, com a IA como acelerador de aprendizado"],
      ["FaUserTie", "Lideranças", "Pontos focais viram multiplicadores e futuros líderes do modelo"],
      ["FaBolt", "Simplicidade", "Eliminar entraves burocráticos e retrabalho em tarefas recorrentes"],
      ["FaBullseye", "Resultado", "Metas e estratégia dos ativos entregues com mais inteligência e menos esforço"],
    ];
    for (let i = 0; i < pil.length; i++) {
      const y = 1.55 + i * 1.25;
      await iconCircle(s, pil[i][0], 6.3, y + 0.1);
      s.addText(pil[i][1], { x: 7.15, y: y, w: 5.4, h: 0.4, fontSize: 18, bold: true, color: T.text, margin: 0, isTextBox: true });
      s.addText(pil[i][2], { x: 7.15, y: y + 0.42, w: 5.4, h: 0.7, fontSize: 14, color: T.muted, margin: 0, valign: "top", isTextBox: true });
    }
  }

  // ---------- 3. Tese ----------
  {
    const s = content("O que vamos provar em 90 dias", "Tese do piloto",
      "Uma regional apoiada por IA entrega mais, com mais qualidade, usando a mesma estrutura — e vira modelo replicável para a companhia.");
    const st = [["5", "usuários Claude Enterprise"], ["6", "frentes de trabalho"], ["13", "semanas de implantação"]];
    st.forEach(([n, l], i) => {
      const x = 0.6 + i * 4.1;
      card(s, x, 2.1, 3.8, 1.7);
      s.addText(n, { x: x + 0.3, y: 2.2, w: 3.2, h: 0.95, fontSize: 54, bold: true, color: T.teal, margin: 0, isTextBox: true });
      s.addText(l, { x: x + 0.3, y: 3.15, w: 3.3, h: 0.45, fontSize: 15, color: T.muted, margin: 0, isTextBox: true });
    });
    const hip = [
      ["H1 · Eficiência", "Menos horas do time em tarefas recorrentes (RMR, relatórios, preparação de visitas, consolidação de dados)"],
      ["H2 · Qualidade", "Menos prazos perdidos e menos erros: renovações dentro da janela, pendências de auditoria com dono, dados de contrato corretos"],
      ["H3 · Escala", "Modelo documentado em arquivos abertos, pronto para ser replicado em outra regional sem depender de pessoas-chave"],
    ];
    hip.forEach(([h, d], i) => {
      const y = 4.2 + i * 0.85;
      s.addText(h, { x: 0.6, y, w: 2.6, h: 0.7, fontSize: 16, bold: true, color: T.teal, margin: 0, valign: "top", isTextBox: true });
      s.addText(d, { x: 3.3, y, w: 9.3, h: 0.7, fontSize: 14, color: T.text, margin: 0, valign: "top", isTextBox: true });
    });
  }

  // ---------- 4. Visão geral ----------
  {
    const s = content("Seis frentes, um sistema", "Visão geral", null);
    const fr = [
      ["0", "FaBrain", "Segundo cérebro", "Base de conhecimento em .md, portátil para qualquer modelo", "Diretor + gerente regional"],
      ["1", "FaChartLine", "Gestão à vista integrada", "Painel shopping → RMR → regional e visita estruturada", "Gerente regional"],
      ["2", "FaCogs", "Apps de processo", "Renovações, radar de auditoria, manual operacional", "Negócios + operações"],
      ["3", "FaFlask", "Pilotos operacionais", "Radar de varejo, radar de mídia, otimizador de obras", "Negócios, marketing, operações"],
      ["4", "FaFileContract", "Gestão de cláusulas", "Contratos em .md e ferramenta de cláusulas em toda a regional", "Negócios + jurídico"],
      ["5", "FaGraduationCap", "Treinamento em IA", "Trilha por função e formação de multiplicadores", "Diretor"],
    ];
    for (let i = 0; i < fr.length; i++) {
      const col = i % 3, row = Math.floor(i / 3);
      const x = 0.6 + col * 4.1, y = 1.55 + row * 2.6;
      card(s, x, y, 3.85, 2.35);
      await iconCircle(s, fr[i][1], x + 0.3, y + 0.3, 0.6);
      s.addText("FRENTE " + fr[i][0], { x: x + 1.05, y: y + 0.3, w: 2.6, h: 0.25, fontSize: 11, bold: true, color: T.teal6, charSpacing: 2, margin: 0, isTextBox: true });
      s.addText(fr[i][2], { x: x + 1.05, y: y + 0.55, w: 2.7, h: 0.4, fontSize: 17, bold: true, color: T.text, margin: 0, isTextBox: true });
      s.addText(fr[i][3], { x: x + 0.3, y: y + 1.08, w: 3.3, h: 0.7, fontSize: 14, color: T.text, margin: 0, valign: "top", isTextBox: true });
      s.addText("Dono: " + fr[i][4], { x: x + 0.3, y: y + 1.8, w: 3.3, h: 0.35, fontSize: 12, italic: true, color: T.muted, margin: 0, isTextBox: true });
    }
  }

  // ---------- 5. Time e papéis ----------
  {
    const s = content("Cada pessoa com um papel claro no piloto", "Estrutura do time", null);
    const hdr = { bold: true, color: T.white, fill: { color: T.teal }, fontSize: 13, valign: "middle" };
    const c = (t, o = {}) => ({ text: t, options: { fontSize: 13, color: T.text, valign: "middle", ...o } });
    const rows = [
      [{ text: "Papel", options: hdr }, { text: "Responsabilidade no plano", options: hdr }, { text: "Lidera", options: hdr }, { text: "Dedicação sugerida", options: hdr }],
      [c("Diretor de portfólio", { bold: true }), c("Sponsor; arquitetura do segundo cérebro; decisões e alçadas; reporte à diretoria executiva"), c("Frentes 0 e 5"), c("~4 h/semana")],
      [c("Gerente regional", { bold: true }), c("PMO do plano; ritmo de gestão; gestão à vista; consolida o scorecard do teste"), c("Frente 1 e PMO"), c("~6 h/semana")],
      [c("Ponto focal de negócios", { bold: true }), c("Renovações, cláusulas e prospecção de marcas"), c("Frentes 2, 3 e 4"), c("~5 h/semana")],
      [c("Ponto focal de marketing", { bold: true }), c("Radar de mídia; comunicação interna da adoção; materiais da RMR"), c("Frente 3"), c("~4 h/semana")],
      [c("Ponto focal de operações", { bold: true }), c("Radar de auditoria, manual operacional e otimizador de obras"), c("Frentes 2 e 3"), c("~5 h/semana")],
      [c("Equipes dos shoppings", { bold: true, color: T.muted }), c("Fonte de dados e usuárias dos painéis e materiais publicados (sem licença no piloto)", { color: T.muted }), c("—", { color: T.muted }), c("Pontual", { color: T.muted })],
    ];
    s.addTable(rows, { x: 0.6, y: 1.55, w: 12.1, colW: [2.6, 5.9, 1.9, 1.7], rowH: 0.62, border: { type: "solid", pt: 0.75, color: T.border }, fill: { color: T.white }, margin: [0.05, 0.12, 0.05, 0.12] });
    s.addText("Dedicação é estimativa inicial, a calibrar com o registro de horas das primeiras semanas.", { x: 0.6, y: 6.5, w: 12, h: 0.35, fontSize: 12, italic: true, color: T.muted, margin: 0, isTextBox: true });
  }

  // ---------- 6. Frente 0 — princípios ----------
  {
    const s = content("Conhecimento em formato aberto, independente do modelo", "Frente 0 · Segundo cérebro",
      "O ativo é o conhecimento da regional — não a ferramenta. Tudo em texto que qualquer IA (ou modelo próprio) consiga ler.");
    const pr = [
      ["Markdown + frontmatter YAML", "Legível por pessoas e por qualquer LLM; metadados padronizados em todo arquivo"],
      ["Um assunto, um arquivo", "Notas curtas e ligadas por [[links]]; nada de documentos gigantes"],
      ["Instruções também em .md", "Prompts e skills de cada app versionados como texto: migram para outro modelo"],
      ["Dados em CSV", "Indicadores e índices de contratos em tabelas abertas, nunca presos a uma ferramenta"],
      ["Fonte única", "Repositório mestre na rede da companhia (SharePoint ou Git); o Claude consome uma cópia"],
      ["Classificação em cada arquivo", "Interno, restrito ou confidencial — define o que pode subir para a IA"],
    ];
    pr.forEach(([t, d], i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = 0.6 + col * 4.25, y = 2.05 + row * 1.5;
      card(s, x, y, 4.05, 1.3);
      s.addText(t, { x: x + 0.25, y: y + 0.18, w: 3.6, h: 0.35, fontSize: 15, bold: true, color: T.teal, margin: 0, isTextBox: true });
      s.addText(d, { x: x + 0.25, y: y + 0.55, w: 3.6, h: 0.7, fontSize: 13, color: T.text, margin: 0, valign: "top", isTextBox: true });
    });
    card(s, 9.2, 2.05, 3.5, 4.3, T.teal);
    await iconCircle(s, "FaSyncAlt", 9.5, 2.35, 0.6, T.white, T.teal);
    s.addText("Teste de portabilidade", { x: 9.5, y: 3.15, w: 3.0, h: 0.4, fontSize: 17, bold: true, color: T.white, margin: 0, isTextBox: true });
    s.addText("Na semana 12, rodar dois apps em outro modelo de IA usando apenas os arquivos .md. Se funcionar, a regional não está presa a fornecedor.", { x: 9.5, y: 3.6, w: 3.0, h: 2.5, fontSize: 14, color: T.off, margin: 0, valign: "top", isTextBox: true });
  }

  // ---------- 7. Frente 0 — estrutura de pastas ----------
  {
    const s = content("Estrutura do segundo cérebro", "Frente 0 · Segundo cérebro", null);
    const tree = [
      ["regional-inteligente/", true],
      ["  00-governanca/      propósito, papéis, ritmos, decisões, glossário", false],
      ["  01-regional/        estratégia, metas, políticas, alçadas", false],
      ["  02-shoppings/<nome>/ ficha, plano anual, mix, visitas, rmr", false],
      ["      contratos/       um .md por contrato e aditivo", false],
      ["  03-processos/       manual operacional, renovações, auditoria, obras", false],
      ["  04-conhecimento/    clusters, marcas, mercado, lições aprendidas", false],
      ["  05-agentes/         instruções de cada app (skills .md, versionadas)", false],
      ["  06-dados/           CSV: indicadores, índice de contratos, vacância", false],
      ["  07-treinamento/     trilhas, exercícios, casos do time", false],
      ["  99-arquivo/         histórico", false],
    ];
    card(s, 0.6, 1.55, 7.4, 5.1, T.teal9);
    s.addText(tree.map(([t, b], i) => ({ text: t, options: { bold: b, color: b ? T.white : T.off, breakLine: i < tree.length - 1 } })),
      { x: 0.85, y: 1.75, w: 7.0, h: 4.7, fontFace: "Courier New", fontSize: 12.5, valign: "top", margin: 0, paraSpaceAfter: 5, isTextBox: true });

    s.addText("Cabeçalho padrão de cada nota", { x: 8.35, y: 1.55, w: 4.4, h: 0.4, fontSize: 16, bold: true, color: T.text, margin: 0, isTextBox: true });
    const fm = ["---", "tipo: contrato | processo | visita | decisão", "shopping: <nome>", "dono: <papel>", "status: rascunho | validado", "confidencialidade: interno | restrito", "atualizado: 2026-11-02", "fonte: <sistema ou documento>", "---"];
    card(s, 8.35, 2.0, 4.4, 3.2);
    s.addText(fm.map((t, i) => ({ text: t, options: { breakLine: i < fm.length - 1 } })),
      { x: 8.55, y: 2.15, w: 4.1, h: 2.9, fontFace: "Courier New", fontSize: 11.5, color: T.teal9, valign: "top", margin: 0, isTextBox: true });
    s.addText("Cada pasta tem um dono responsável pela curadoria. O índice (06-dados) permite filtrar e consolidar sem abrir arquivo por arquivo.",
      { x: 8.35, y: 5.35, w: 4.4, h: 1.3, fontSize: 13, color: T.muted, margin: 0, valign: "top", isTextBox: true });
  }

  // ---------- 8. Frente 0 — trabalho integrado ----------
  {
    const s = content("Como o time trabalha de forma integrada", "Frente 0 · Segundo cérebro",
      "Um ciclo único de conhecimento: o que um ponto focal aprende vira ativo de toda a regional.");
    const st = [
      ["Captura", "Reuniões, visitas, contratos, e-mails relevantes viram nota .md", "Todos"],
      ["Estrutura", "Claude padroniza no template e liga às notas existentes", "IA + autor"],
      ["Curadoria", "Dono da pasta valida e muda status para validado", "Dono da pasta"],
      ["Uso", "Apps, painéis e RMR leem só conteúdo validado", "Time e shoppings"],
      ["Aprendizado", "Erros e acertos voltam como lições aprendidas", "Gerente regional"],
    ];
    const bw = 2.3, gap = 0.15;
    st.forEach(([t, d, w], i) => {
      const x = 0.6 + i * (bw + gap);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.1, w: bw, h: 0.7, rectRadius: 0.08, fill: { color: i % 2 ? T.teal6 : T.teal }, line: { color: i % 2 ? T.teal6 : T.teal } });
      s.addText((i + 1) + ". " + t, { x, y: 2.1, w: bw, h: 0.7, fontSize: 16, bold: true, color: T.white, align: "center", valign: "middle", margin: 0, isTextBox: true });
      s.addText(d, { x: x + 0.05, y: 2.95, w: bw - 0.1, h: 1.1, fontSize: 13, color: T.text, margin: 0, valign: "top", isTextBox: true });
      s.addText(w, { x: x + 0.05, y: 4.05, w: bw - 0.1, h: 0.3, fontSize: 12, italic: true, color: T.muted, margin: 0, isTextBox: true });
    });
    card(s, 0.6, 4.65, 12.1, 1.95);
    s.addText("No Claude Enterprise", { x: 0.9, y: 4.8, w: 5, h: 0.35, fontSize: 15, bold: true, color: T.teal, margin: 0, isTextBox: true });
    s.addText(bullets([
      "Um Project “Regional — base” compartilhado pelos 5 usuários, com os arquivos de governança, regional e dados",
      "Um Project por frente (renovações, auditoria, cláusulas…), com as instruções do app e as pastas que ele usa",
      "Toda decisão relevante registrada em 00-governanca/decisoes — a memória da regional não fica na cabeça de ninguém",
    ], { fontSize: 13, color: T.text, paraSpaceAfter: 4 }), { x: 0.9, y: 5.2, w: 11.6, h: 1.35, valign: "top", margin: 0, isTextBox: true });
  }

  // ---------- 9. Frente 1 — gestão à vista ----------
  {
    const s = content("Gestão à vista em três níveis, com os mesmos números", "Frente 1 · Gestão à vista integrada", null);
    const lv = [
      ["Shopping", "Indicadores da visita estruturada em destaque", ["Lista oficial da visita estruturada como ponto de partida", "Semáforo por indicador vs. meta", "Ações abertas com dono e prazo"]],
      ["RMR", "Reunião mensal de resultados por shopping", ["Material gerado a partir do painel, não montado à mão", "Desvios explicados e plano de ação", "Comparativo entre shoppings da regional"]],
      ["Regional", "Visão consolidada para a diretoria", ["Ranking e tendências dos ativos", "Status das 6 frentes e scorecard do teste", "Decisões pendentes e riscos"]],
    ];
    lv.forEach(([t, sub, b], i) => {
      const x = 0.6 + i * 4.1;
      card(s, x, 1.55, 3.85, 3.45, i === 2 ? T.teal : T.tint);
      const dark = i === 2;
      s.addText(t, { x: x + 0.3, y: 1.75, w: 3.3, h: 0.45, fontSize: 22, bold: true, color: dark ? T.white : T.teal, margin: 0, isTextBox: true });
      s.addText(sub, { x: x + 0.3, y: 2.2, w: 3.3, h: 0.5, fontSize: 13, italic: true, color: dark ? T.off : T.muted, margin: 0, valign: "top", isTextBox: true });
      s.addText(bullets(b, { fontSize: 13, color: dark ? T.white : T.text, paraSpaceAfter: 6 }), { x: x + 0.3, y: 2.8, w: 3.35, h: 2.1, valign: "top", margin: 0, isTextBox: true });
    });
    await iconCircle(s, "FaRoute", 0.6, 5.3, 0.62);
    s.addText("Visita estruturada", { x: 1.4, y: 5.25, w: 4, h: 0.4, fontSize: 17, bold: true, color: T.text, margin: 0, isTextBox: true });
    s.addText("Roteiro e checklist gerados do painel do shopping antes da visita; registro em .md no dia; ações entram automaticamente no painel e na pauta da próxima RMR.",
      { x: 1.4, y: 5.65, w: 11.3, h: 0.9, fontSize: 14, color: T.text, margin: 0, valign: "top", isTextBox: true });
  }

  // ---------- 10. Frente 1 — atualização automática ----------
  {
    const s = content("Atualização automática: da fonte ao painel sem retrabalho", "Frente 1 · Gestão à vista integrada", null);
    const fl = [
      ["Fontes", "Sistemas da companhia, BI, planilhas dos shoppings, auditoria"],
      ["Coleta", "Conector ou exportação periódica; tarefa agendada no Claude"],
      ["06-dados", "CSV padronizado por indicador e shopping"],
      ["Painel", "Dashboard publicado e compartilhado com os shoppings"],
      ["Alertas", "Desvios disparam aviso ao dono e entram na pauta"],
    ];
    const bw = 2.2, gap = 0.27;
    fl.forEach(([t, d], i) => {
      const x = 0.6 + i * (bw + gap);
      card(s, x, 1.7, bw, 2.2, i === 2 ? T.teal : T.tint);
      s.addText(t, { x: x + 0.2, y: 1.85, w: bw - 0.4, h: 0.45, fontSize: 17, bold: true, color: i === 2 ? T.white : T.teal, margin: 0, isTextBox: true });
      s.addText(d, { x: x + 0.2, y: 2.35, w: bw - 0.4, h: 1.45, fontSize: 13, color: i === 2 ? T.off : T.text, margin: 0, valign: "top", isTextBox: true });
      if (i < fl.length - 1) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + bw + 0.03, y: 2.65, w: 0.21, h: 0.3, fill: { color: T.teal5 }, line: { color: T.teal5 } });
    });
    s.addText("Cadência proposta", { x: 0.6, y: 4.25, w: 5.5, h: 0.4, fontSize: 16, bold: true, color: T.text, margin: 0, isTextBox: true });
    s.addText(bullets(["Diário: alertas operacionais e de prazos", "Semanal: painel do shopping atualizado", "Mensal: material da RMR pré-montado 3 dias antes"], { fontSize: 14, color: T.text, paraSpaceAfter: 6 }),
      { x: 0.6, y: 4.7, w: 5.6, h: 1.8, valign: "top", margin: 0, isTextBox: true });
    card(s, 6.7, 4.25, 6.0, 2.3, T.off);
    s.addText("Ponto de atenção", { x: 6.95, y: 4.4, w: 5.5, h: 0.35, fontSize: 15, bold: true, color: T.teal9, margin: 0, isTextBox: true });
    s.addText("O grau de automação depende de quais sistemas da Allos têm conector ou exportação. Nas semanas 1 e 2 mapeamos cada fonte; onde não houver integração, começamos com exportação semanal e automatizamos o resto da cadeia.",
      { x: 6.95, y: 4.8, w: 5.5, h: 1.65, fontSize: 13, color: T.text, margin: 0, valign: "top", isTextBox: true });
  }

  // ---------- 11. Frente 2 ----------
  {
    const s = content("Apps de melhoria de processos", "Frente 2 · Implantação", "Processos recorrentes, com regras claras e alto custo de erro — onde a IA paga a conta primeiro.");
    const ap = [
      ["FaSyncAlt", "Gestão de renovações", "Negócios",
        ["Carteira de vencimentos em 18 meses por shopping", "Janela de negociação, argumentos e cálculo de leasing spread", "Pauta e minuta de proposta dentro das alçadas"],
        "Pronto quando: 100% dos contratos que vencem em 12 meses têm estratégia definida"],
      ["FaClipboardCheck", "Radar de auditoria", "Operações",
        ["Cruza políticas e checklists com as evidências de cada shopping", "Pendências com risco, dono e prazo", "Alerta antes do vencimento, não depois"],
        "Pronto quando: nenhuma pendência sem dono e prazo"],
      ["FaBook", "Manual operacional", "Operações",
        ["Processos da companhia em .md, um por arquivo", "Perguntas em linguagem natural com resposta citando a seção", "Lacunas e conflitos viram backlog de revisão"],
        "Pronto quando: os 20 processos mais usados documentados e validados"],
    ];
    for (let i = 0; i < ap.length; i++) {
      const x = 0.6 + i * 4.1;
      card(s, x, 2.0, 3.85, 4.6);
      await iconCircle(s, ap[i][0], x + 0.3, 2.25, 0.6);
      s.addText(ap[i][1], { x: x + 1.05, y: 2.22, w: 2.7, h: 0.4, fontSize: 17, bold: true, color: T.text, margin: 0, isTextBox: true });
      s.addText("Dono: " + ap[i][2], { x: x + 1.05, y: 2.6, w: 2.7, h: 0.3, fontSize: 12, italic: true, color: T.muted, margin: 0, isTextBox: true });
      s.addText(bullets(ap[i][3], { fontSize: 13, color: T.text, paraSpaceAfter: 6 }), { x: x + 0.3, y: 3.15, w: 3.3, h: 2.2, valign: "top", margin: 0, isTextBox: true });
      s.addText(ap[i][4], { x: x + 0.3, y: 5.5, w: 3.3, h: 0.9, fontSize: 12.5, bold: true, color: T.teal, margin: 0, valign: "top", isTextBox: true });
    }
  }

  // ---------- 12. Frente 3 ----------
  {
    const s = content("Pilotos de melhoria operacional", "Frente 3 · Piloto",
      "Um shopping por app, baseline de 3 semanas, 6 semanas de operação e decisão na semana 13: escalar, ajustar ou parar.");
    const pl = [
      ["FaSearch", "Radar de varejo", "Negócios", "Marcas em expansão, varejo de rua e capitais próximas viram pipeline para a vacância do shopping", "Leads qualificados, reuniões e propostas geradas"],
      ["FaBullhorn", "Radar de mídia", "Marketing", "Oportunidades de mídia e patrocínio mapeadas e priorizadas; acompanhamento das ações em curso", "Pipeline e receita de mídia vs. período anterior"],
      ["FaHardHat", "Otimizador de obras", "Operações", "Cronograma de obra dos lojistas, checklist regulatório e gargalos antecipados", "Dias entre assinatura e inauguração"],
    ];
    for (let i = 0; i < pl.length; i++) {
      const y = 2.05 + i * 1.5;
      card(s, 0.6, y, 12.1, 1.3);
      await iconCircle(s, pl[i][0], 0.85, y + 0.33, 0.62);
      s.addText(pl[i][1], { x: 1.7, y: y + 0.2, w: 2.6, h: 0.4, fontSize: 17, bold: true, color: T.text, margin: 0, isTextBox: true });
      s.addText("Dono: " + pl[i][2], { x: 1.7, y: y + 0.65, w: 2.6, h: 0.3, fontSize: 12, italic: true, color: T.muted, margin: 0, isTextBox: true });
      s.addText(pl[i][3], { x: 4.4, y: y + 0.2, w: 4.6, h: 0.95, fontSize: 13, color: T.text, margin: 0, valign: "top", isTextBox: true });
      s.addText([{ text: "Métrica: ", options: { bold: true, color: T.teal } }, { text: pl[i][4], options: { color: T.text } }],
        { x: 9.2, y: y + 0.2, w: 3.3, h: 0.95, fontSize: 13, margin: 0, valign: "top", isTextBox: true });
    }
  }

  // ---------- 13. Frente 4 ----------
  {
    const s = content("Gestão de cláusulas em toda a regional", "Frente 4 · Contratos em .md", null);
    const st = [
      ["Inventário", "Lista de contratos e aditivos por shopping; identificar escaneados"],
      ["Conversão", "PDF para .md com campos-chave no cabeçalho: lojista, LUC, ABL, vigência, aluguel, reajuste, cláusulas especiais"],
      ["Validação", "100% dos campos críticos conferidos por pessoa; amostra do texto integral"],
      ["Ferramenta", "Busca, comparação entre contratos e alertas de prazos e gatilhos"],
      ["Rotina", "Alimenta renovações, auditoria e cobrança"],
    ];
    const bw = 2.3, gap = 0.15;
    st.forEach(([t, d], i) => {
      const x = 0.6 + i * (bw + gap);
      s.addShape(pres.shapes.OVAL, { x: x, y: 1.6, w: 0.55, h: 0.55, fill: { color: T.teal }, line: { color: T.teal } });
      s.addText(String(i + 1), { x: x, y: 1.6, w: 0.55, h: 0.55, fontSize: 16, bold: true, color: T.white, align: "center", valign: "middle", margin: 0, isTextBox: true });
      s.addText(t, { x: x + 0.65, y: 1.67, w: bw - 0.7, h: 0.4, fontSize: 16, bold: true, color: T.text, margin: 0, isTextBox: true });
      s.addText(d, { x: x, y: 2.3, w: bw - 0.05, h: 1.7, fontSize: 13, color: T.text, margin: 0, valign: "top", isTextBox: true });
    });
    card(s, 0.6, 4.25, 6.0, 2.35);
    s.addText("Ondas", { x: 0.85, y: 4.4, w: 5, h: 0.35, fontSize: 15, bold: true, color: T.teal, margin: 0, isTextBox: true });
    s.addText(bullets([
      "Semanas 2 a 5: shopping piloto — ajustar template e taxa de erro",
      "Semanas 6 a 11: demais shoppings da regional",
      "Semana 12: índice completo em 06-dados e ferramenta em uso pelo time",
    ], { fontSize: 13, color: T.text, paraSpaceAfter: 6 }), { x: 0.85, y: 4.8, w: 5.6, h: 1.7, valign: "top", margin: 0, isTextBox: true });
    card(s, 6.9, 4.25, 5.8, 2.35, T.teal9);
    await iconCircle(s, "FaShieldAlt", 7.15, 4.45, 0.55, T.orange, T.teal9);
    s.addText("Condição para começar", { x: 7.85, y: 4.5, w: 4.6, h: 0.4, fontSize: 15, bold: true, color: T.white, margin: 0, isTextBox: true });
    s.addText("Contratos são dados confidenciais. Antes de subir qualquer contrato, validar com TI, Jurídico e Segurança da Informação as regras de uso no Claude Enterprise e a classificação dos arquivos.",
      { x: 7.15, y: 5.1, w: 5.3, h: 1.4, fontSize: 13, color: T.off, margin: 0, valign: "top", isTextBox: true });
  }

  // ---------- 14. Frente 5 ----------
  {
    const s = content("Plano de treinamento: aprender fazendo", "Frente 5 · Treinamento em IA", "Cada sessão termina com um entregável real da regional — sem curso desconectado da rotina.");
    const tr = [
      ["Fundamentos", "Semanas 1 a 3", "Todos", ["Como um LLM funciona e onde erra", "Segurança e classificação de dados", "Prompts, Projects e o segundo cérebro"], "2 encontros de 90 min + exercícios"],
      ["Prática por função", "Semanas 3 a 8", "Pontos focais", ["Cada um constrói e opera os apps da sua frente", "Clínica semanal de 1 h para dúvidas", "Pares revisam o trabalho um do outro"], "1 app em uso por pessoa"],
      ["Avançado", "Semanas 8 a 12", "Todos", ["Skills em .md e tarefas agendadas", "Painéis publicados", "Como avaliar qualidade da resposta"], "Automação rodando sem intervenção"],
      ["Formação externa", "Em paralelo", "Conforme proposta", ["Asimov Academy para os 4 gerentes", "MIT Applied Agentic AI para o diretor", "Conteúdo trazido para 07-treinamento"], "Sujeito à aprovação da diretoria"],
    ];
    tr.forEach(([t, q, w, b, e], i) => {
      const x = 0.6 + i * 3.08;
      card(s, x, 1.95, 2.88, 4.15, i === 3 ? T.off : T.tint);
      s.addText(t, { x: x + 0.2, y: 2.1, w: 2.5, h: 0.4, fontSize: 17, bold: true, color: T.teal, margin: 0, isTextBox: true });
      s.addText(q + " · " + w, { x: x + 0.2, y: 2.5, w: 2.55, h: 0.55, fontSize: 12, italic: true, color: T.muted, margin: 0, valign: "top", isTextBox: true });
      s.addText(bullets(b, { fontSize: 13, color: T.text, paraSpaceAfter: 5 }), { x: x + 0.2, y: 3.1, w: 2.55, h: 2.0, valign: "top", margin: 0, isTextBox: true });
      s.addText(e, { x: x + 0.2, y: 5.25, w: 2.55, h: 0.7, fontSize: 12, bold: true, color: T.teal9, margin: 0, valign: "top", isTextBox: true });
    });
    s.addText([{ text: "Semana 13 · Demo day: ", options: { bold: true, color: T.teal } }, { text: "cada pessoa apresenta um caso com ganho medido. Os pontos focais saem como multiplicadores para a próxima regional.", options: { color: T.text } }],
      { x: 0.6, y: 6.3, w: 12.1, h: 0.5, fontSize: 14, margin: 0, isTextBox: true });
  }

  // ---------- 15. Cronograma ----------
  {
    const s = content("Cronograma de 13 semanas", "Execução", null);
    const x0 = 3.6, wk = 0.7, y0 = 1.55;
    // months
    [["Novembro", 1, 4], ["Dezembro", 5, 9], ["Janeiro", 10, 13]].forEach(([m, a, b]) => {
      s.addShape(pres.shapes.RECTANGLE, { x: x0 + (a - 1) * wk + 0.02, y: y0, w: (b - a + 1) * wk - 0.04, h: 0.3, fill: { color: T.teal9 }, line: { color: T.teal9 } });
      s.addText(m, { x: x0 + (a - 1) * wk, y: y0, w: (b - a + 1) * wk, h: 0.3, fontSize: 11, bold: true, color: T.white, align: "center", valign: "middle", margin: 0, isTextBox: true });
    });
    // Natal shading S6-S9
    s.addShape(pres.shapes.RECTANGLE, { x: x0 + 5 * wk, y: y0 + 0.65, w: 4 * wk, h: 4.75, fill: { color: T.orange, transparency: 82 }, line: { color: T.orange, transparency: 82 } });
    s.addText("Pico de Natal: só operação", { x: x0 + 5 * wk, y: y0 + 5.42, w: 4 * wk, h: 0.28, fontSize: 10, italic: true, color: "A36A1F", align: "center", margin: 0, isTextBox: true });
    for (let w = 1; w <= 13; w++) {
      s.addText("S" + w, { x: x0 + (w - 1) * wk, y: y0 + 0.33, w: wk, h: 0.28, fontSize: 10, color: T.muted, align: "center", margin: 0, isTextBox: true });
    }
    const rows = [
      ["0 · Segundo cérebro", [[1, 4, T.teal], [5, 13, T.teal5, "manutenção"]]],
      ["1 · Gestão à vista", [[2, 6, T.teal], [7, 13, T.teal5, "operação"]]],
      ["2 · Renovações", [[2, 6, T.teal]]],
      ["2 · Manual operacional", [[3, 9, T.teal]]],
      ["2 · Radar de auditoria", [[4, 8, T.teal]]],
      ["3 · Pilotos (baseline → teste)", [[4, 6, T.warm, "baseline"], [7, 12, T.teal6], [13, 13, T.orange]]],
      ["4 · Cláusulas", [[2, 5, T.teal, "piloto"], [6, 11, T.teal6, "regional"]]],
      ["5 · Treinamento", [[1, 3, T.teal], [3, 8, T.teal6], [8, 12, T.teal5], [13, 13, T.orange]]],
      ["Teste regional", [[1, 3, T.warm, "baseline"], [4, 12, T.teal9, "medição"], [13, 13, T.orange]]],
    ];
    rows.forEach(([lbl, bars], r) => {
      const y = y0 + 0.75 + r * 0.52;
      s.addText(lbl, { x: 0.6, y, w: 2.9, h: 0.38, fontSize: 12.5, bold: r === 8, color: T.text, valign: "middle", margin: 0, isTextBox: true });
      bars.forEach(([a, b, c, t]) => {
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x0 + (a - 1) * wk + 0.04, y: y + 0.04, w: (b - a + 1) * wk - 0.08, h: 0.3, rectRadius: 0.06, fill: { color: c }, line: { color: c } });
        if (t) s.addText(t, { x: x0 + (a - 1) * wk, y: y + 0.04, w: (b - a + 1) * wk, h: 0.3, fontSize: 10, color: c === T.warm ? T.text : T.white, align: "center", valign: "middle", margin: 0, isTextBox: true });
      });
    });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 6.62, w: 0.25, h: 0.2, rectRadius: 0.04, fill: { color: T.orange }, line: { color: T.orange } });
    s.addText("Decisão / demo day / relatório final", { x: 0.95, y: 6.57, w: 4, h: 0.3, fontSize: 11, color: T.muted, margin: 0, isTextBox: true });
  }

  // ---------- 16. Marcos ----------
  {
    const s = content("O que estará pronto ao fim de cada mês", "Execução", null);
    const ms = [
      ["Mês 1 · Fundação", "Novembro", ["Kickoff, papéis e ritmos definidos", "Baseline do teste medido", "Regras de dados validadas com TI e Jurídico", "Segundo cérebro v1 com estrutura e templates", "Fontes de dados mapeadas", "Renovações em uso; cláusulas no shopping piloto", "Fundamentos concluídos"]],
      ["Mês 2 · Implantação", "Dezembro", ["Painel de gestão à vista no ar nos três níveis", "Primeira RMR com material pré-montado", "Radar de auditoria em uso", "Pilotos operacionais rodando", "Conversão de contratos nos demais shoppings", "Carga leve no pico de Natal"]],
      ["Mês 3 · Prova e escala", "Janeiro", ["Manual operacional com top 20 processos", "100% dos contratos da regional em .md", "Teste de portabilidade em outro modelo", "Decisão sobre os pilotos", "Demo day do time", "Relatório final: regional inteligente vs. modelo atual"]],
    ];
    ms.forEach(([t, m, b], i) => {
      const x = 0.6 + i * 4.1;
      card(s, x, 1.55, 3.85, 5.1, i === 2 ? T.teal : T.tint);
      const dark = i === 2;
      s.addText(t, { x: x + 0.3, y: 1.75, w: 3.3, h: 0.45, fontSize: 19, bold: true, color: dark ? T.white : T.teal, margin: 0, isTextBox: true });
      s.addText(m, { x: x + 0.3, y: 2.2, w: 3.3, h: 0.3, fontSize: 13, italic: true, color: dark ? T.off : T.muted, margin: 0, isTextBox: true });
      s.addText(b.map((t2, j) => ({ text: "☐  " + t2, options: { breakLine: j < b.length - 1 } })),
        { x: x + 0.3, y: 2.7, w: 3.35, h: 3.8, fontSize: 13, color: dark ? T.white : T.text, paraSpaceAfter: 7, valign: "top", margin: 0, isTextBox: true });
    });
  }

  // ---------- 17. Desenho do teste ----------
  {
    const s = content("Como comparar com o modelo atual", "Teste: regional inteligente vs. atual", null);
    card(s, 0.6, 1.55, 4.2, 5.1, T.teal);
    s.addText("Método", { x: 0.9, y: 1.75, w: 3.6, h: 0.4, fontSize: 18, bold: true, color: T.white, margin: 0, isTextBox: true });
    s.addText(bullets([
      "Baseline nas semanas 1 a 3: registro amostral de horas por tarefa recorrente e foto dos indicadores",
      "Grupo de comparação: uma regional equivalente, medida com os mesmos indicadores",
      "Comparar a evolução de cada regional, não o nível absoluto",
      "Revisão mensal do scorecard com a diretoria",
    ], { fontSize: 13, color: T.white, paraSpaceAfter: 8 }), { x: 0.9, y: 2.25, w: 3.65, h: 4.2, valign: "top", margin: 0, isTextBox: true });

    const hdr = { bold: true, color: T.white, fill: { color: T.teal9 }, fontSize: 13, valign: "middle" };
    const c = (t, o = {}) => ({ text: t, options: { fontSize: 12.5, color: T.text, valign: "middle", ...o } });
    const rows = [
      [{ text: "Dimensão", options: hdr }, { text: "Indicador", options: hdr }, { text: "Como medir", options: hdr }],
      [c("Eficiência", { bold: true }), c("Horas por semana em RMR, relatórios e preparação de visitas"), c("Registro amostral de tempo")],
      [c("Qualidade", { bold: true }), c("Renovações tratadas dentro da janela; pendências de auditoria vencidas"), c("Painel e radar")],
      [c("Resultado", { bold: true }), c("Leasing spread, vacância, receita de mídia (tendência)"), c("Sistemas da companhia")],
      [c("Adoção", { bold: true }), c("Usuários ativos por semana; processos rodando com IA"), c("Uso do Claude Enterprise")],
      [c("Pessoas", { bold: true }), c("Autoavaliação de competências em IA, início e fim"), c("Questionário curto")],
    ];
    s.addTable(rows, { x: 5.1, y: 1.55, w: 7.6, colW: [1.5, 3.9, 2.2], rowH: 0.62, border: { type: "solid", pt: 0.75, color: T.border }, fill: { color: T.white }, margin: [0.05, 0.1, 0.05, 0.1] });
    card(s, 5.1, 5.6, 7.6, 1.05, T.off);
    s.addText("90 dias são suficientes para medir eficiência, qualidade e adoção. Impacto financeiro (spread, vacância) precisa de 6 a 12 meses para ser conclusivo — aqui medimos só a tendência.",
      { x: 5.3, y: 5.68, w: 7.2, h: 0.9, fontSize: 13, color: T.teal9, margin: 0, valign: "middle", isTextBox: true });
  }

  // ---------- 18. Governança ----------
  {
    const s = content("Ritmos de gestão do plano", "Governança", null);
    const rt = [
      ["Semanal", "30 min", "Gerente regional", "Status das frentes, bloqueios, próximos passos"],
      ["Quinzenal", "45 min", "Todo o time", "Demo do que foi construído e troca entre frentes"],
      ["Mensal", "60 min", "Diretoria executiva", "Scorecard do teste, decisões e recursos"],
      ["Contínuo", "—", "Donos de pasta", "Curadoria do segundo cérebro e lições aprendidas"],
    ];
    rt.forEach(([f, d, w, o], i) => {
      const y = 1.55 + i * 1.0;
      card(s, 0.6, y, 7.3, 0.85);
      s.addText(f, { x: 0.85, y: y + 0.12, w: 1.6, h: 0.6, fontSize: 18, bold: true, color: T.teal, valign: "middle", margin: 0, isTextBox: true });
      s.addText(d + " · " + w, { x: 2.5, y: y + 0.08, w: 5.2, h: 0.32, fontSize: 12, italic: true, color: T.muted, margin: 0, isTextBox: true });
      s.addText(o, { x: 2.5, y: y + 0.4, w: 5.2, h: 0.38, fontSize: 14, color: T.text, margin: 0, isTextBox: true });
    });
    card(s, 8.2, 1.55, 4.5, 3.85, T.teal9);
    s.addText("Regras do jogo", { x: 8.45, y: 1.75, w: 4, h: 0.4, fontSize: 17, bold: true, color: T.white, margin: 0, isTextBox: true });
    s.addText(bullets([
      "Políticas e alçadas da companhia não mudam",
      "A IA recomenda; a pessoa decide e assina",
      "Toda saída usada em decisão cita a fonte",
      "Dado sem classificação não sobe para a IA",
      "Decisões registradas no segundo cérebro",
    ], { fontSize: 14, color: T.off, paraSpaceAfter: 8 }), { x: 8.45, y: 2.25, w: 4.0, h: 3.0, valign: "top", margin: 0, isTextBox: true });
    s.addText("O teste só vale como modelo para a companhia se rodar dentro das regras atuais — o ganho tem de vir do processo, não de atalho.",
      { x: 0.6, y: 5.75, w: 12.1, h: 0.8, fontSize: 15, italic: true, color: T.teal9, margin: 0, valign: "top", isTextBox: true });
  }

  // ---------- 19. Riscos ----------
  {
    const s = content("Riscos e como mitigar", "Riscos", null);
    const hdr = { bold: true, color: T.white, fill: { color: T.teal }, fontSize: 13, valign: "middle" };
    const c = (t, o = {}) => ({ text: t, options: { fontSize: 12.5, color: T.text, valign: "middle", ...o } });
    const rows = [
      [{ text: "Risco", options: hdr }, { text: "Mitigação", options: hdr }],
      [c("Pico de Natal consome o time", { bold: true }), c("Construção pesada em novembro; dezembro só operação e pilotos leves")],
      [c("Exposição de dados confidenciais", { bold: true }), c("Validação prévia com TI, Jurídico e Segurança; classificação em cada arquivo; subir só o necessário")],
      [c("Erros de extração e alucinação", { bold: true }), c("Campos críticos 100% conferidos; resposta sempre com fonte; status rascunho/validado")],
      [c("Baixa adoção", { bold: true }), c("Casos do dia a dia de cada pessoa; clínica semanal; uso medido no scorecard")],
      [c("Fontes de dados sem integração", { bold: true }), c("Começar com exportação semanal; automatizar o restante da cadeia")],
      [c("Dependência de fornecedor", { bold: true }), c("Segundo cérebro em .md e teste de portabilidade na semana 12")],
      [c("Só 5 licenças no piloto", { bold: true }), c("Shoppings consomem painéis e materiais publicados, sem precisar de licença")],
    ];
    s.addTable(rows, { x: 0.6, y: 1.55, w: 12.1, colW: [4.0, 8.1], rowH: 0.6, border: { type: "solid", pt: 0.75, color: T.border }, fill: { color: T.white }, margin: [0.05, 0.12, 0.05, 0.12] });
  }

  // ---------- 20. Próximos passos ----------
  {
    const s = pres.addSlide({ masterName: "ESCURO" });
    arcsDark(s);
    s.addText("Para começar em 2 de novembro", { x: 0.8, y: 0.7, w: 9, h: 0.8, fontSize: 34, bold: true, color: T.white, margin: 0, isTextBox: true });
    s.addText("Decisões necessárias", { x: 0.8, y: 1.8, w: 5.5, h: 0.4, fontSize: 18, bold: true, color: T.orange, margin: 0, isTextBox: true });
    s.addText(bullets([
      "Aprovar os 5 usuários e a formação externa",
      "Validar regras de dados com TI, Jurídico e Segurança",
      "Escolher o shopping piloto de cada app",
      "Definir a regional de comparação",
    ], { fontSize: 15, color: T.white, paraSpaceAfter: 8 }), { x: 0.8, y: 2.3, w: 5.5, h: 3.0, valign: "top", margin: 0, isTextBox: true });
    s.addText("Primeiros 10 dias", { x: 6.7, y: 1.8, w: 5.5, h: 0.4, fontSize: 18, bold: true, color: T.orange, margin: 0, isTextBox: true });
    s.addText(bullets([
      "Kickoff com o time e papéis assinados",
      "Estrutura de pastas e templates criados",
      "Inventário de fontes de dados e contratos",
      "Início do baseline do teste",
      "Primeira sessão de Fundamentos",
    ], { fontSize: 15, color: T.white, paraSpaceAfter: 8 }), { x: 6.7, y: 2.3, w: 5.5, h: 3.0, valign: "top", margin: 0, isTextBox: true });
  }

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("ok", OUT);
})().catch(e => { console.error(e); process.exit(1); });
