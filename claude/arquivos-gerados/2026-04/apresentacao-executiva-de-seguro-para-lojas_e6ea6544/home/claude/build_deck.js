const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3" x 7.5"
pres.author = "Diretoria de Portfólio";
pres.title = "Estratégia de Seguro para Lojas";

// Paleta Midnight Executive
const NAVY = "1E2761";
const NAVY_DARK = "141A47";
const ICE = "CADCFC";
const WHITE = "FFFFFF";
const GRAY = "5A6478";
const LIGHT_GRAY = "F4F6FB";
const ACCENT = "C9A961"; // dourado discreto para destaques

const FONT_HEAD = "Georgia";
const FONT_BODY = "Calibri";

const SLIDE_W = 13.3;
const SLIDE_H = 7.5;

// Helper: cabeçalho padrão dos slides de conteúdo
function addContentHeader(slide, eyebrow, title) {
  slide.background = { color: WHITE };
  slide.addText(eyebrow, {
    x: 0.6, y: 0.45, w: 12, h: 0.3,
    fontSize: 11, fontFace: FONT_BODY, color: ACCENT,
    bold: true, charSpacing: 4, margin: 0,
  });
  slide.addText(title, {
    x: 0.6, y: 0.75, w: 12, h: 0.8,
    fontSize: 30, fontFace: FONT_HEAD, color: NAVY,
    bold: true, margin: 0,
  });
  // separador discreto
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.55, w: 0.6, h: 0.04,
    fill: { color: ACCENT }, line: { color: ACCENT, width: 0 },
  });
}

// Helper: rodapé
function addFooter(slide, pageNum) {
  slide.addText("Estratégia de Seguro para Lojas", {
    x: 0.6, y: 7.05, w: 8, h: 0.3,
    fontSize: 9, fontFace: FONT_BODY, color: GRAY, margin: 0,
  });
  slide.addText(`${pageNum}`, {
    x: 12.4, y: 7.05, w: 0.4, h: 0.3,
    fontSize: 9, fontFace: FONT_BODY, color: GRAY,
    align: "right", margin: 0,
  });
}

// =========================================================
// SLIDE 1 — CAPA
// =========================================================
{
  const s = pres.addSlide();
  s.background = { color: NAVY };

  // motivo gráfico — bloco lateral
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.35, h: SLIDE_H,
    fill: { color: ACCENT }, line: { color: ACCENT, width: 0 },
  });

  s.addText("APRESENTAÇÃO EXECUTIVA  ·  CONFIDENCIAL", {
    x: 1.0, y: 2.2, w: 11, h: 0.4,
    fontSize: 12, fontFace: FONT_BODY, color: ICE,
    bold: true, charSpacing: 6, margin: 0,
  });

  s.addText("Estratégia de Seguro para Lojas", {
    x: 1.0, y: 2.7, w: 11, h: 1.4,
    fontSize: 54, fontFace: FONT_HEAD, color: WHITE,
    bold: true, margin: 0,
  });

  s.addText("Otimização de Risco e Eficiência de Capital", {
    x: 1.0, y: 4.2, w: 11, h: 0.6,
    fontSize: 22, fontFace: FONT_BODY, color: ICE,
    italic: true, margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 1.0, y: 5.1, w: 1.2, h: 0.04,
    fill: { color: ACCENT }, line: { color: ACCENT, width: 0 },
  });

  s.addText("Diretoria de Portfólio  |  Comitê Executivo", {
    x: 1.0, y: 5.3, w: 11, h: 0.4,
    fontSize: 13, fontFace: FONT_BODY, color: ICE, margin: 0,
  });
}

// =========================================================
// SLIDE 2 — EXECUTIVE SUMMARY
// =========================================================
{
  const s = pres.addSlide();
  addContentHeader(s, "01  ·  EXECUTIVE SUMMARY", "Pontos centrais para decisão");

  const cards = [
    {
      tag: "PROBLEMA",
      title: "Modelo atual não protege",
      body: "A obrigação contratual de seguro existe, mas o cumprimento e a qualidade da cobertura não são auditados.",
    },
    {
      tag: "RISCO OCULTO",
      title: "Exposição sistêmica",
      body: "Sinistros relevantes em lojistas podem escalar ao shopping via responsabilidade subsidiária e dano à operação.",
    },
    {
      tag: "OPORTUNIDADE",
      title: "Ganho de escala",
      body: "Negociação coordenada reduz prêmio, padroniza coberturas mínimas e gera dados de portfólio.",
    },
    {
      tag: "RECOMENDAÇÃO",
      title: "Modelo Híbrido",
      body: "Corretora homologada, regras mínimas obrigatórias e liberdade de escolha do lojista — controle sem fricção.",
    },
  ];

  const cardW = 2.85;
  const cardH = 4.4;
  const startX = 0.6;
  const gap = 0.2;

  cards.forEach((c, i) => {
    const x = startX + i * (cardW + gap);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.1, w: cardW, h: cardH,
      fill: { color: LIGHT_GRAY }, line: { color: LIGHT_GRAY, width: 0 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.1, w: cardW, h: 0.08,
      fill: { color: ACCENT }, line: { color: ACCENT, width: 0 },
    });
    s.addText(c.tag, {
      x: x + 0.25, y: 2.3, w: cardW - 0.5, h: 0.3,
      fontSize: 10, fontFace: FONT_BODY, color: ACCENT,
      bold: true, charSpacing: 3, margin: 0,
    });
    s.addText(c.title, {
      x: x + 0.25, y: 2.65, w: cardW - 0.5, h: 1.0,
      fontSize: 18, fontFace: FONT_HEAD, color: NAVY,
      bold: true, margin: 0,
    });
    s.addText(c.body, {
      x: x + 0.25, y: 3.85, w: cardW - 0.5, h: 2.4,
      fontSize: 12, fontFace: FONT_BODY, color: GRAY, margin: 0,
    });
  });

  addFooter(s, 2);
}

// =========================================================
// SLIDE 3 — PROBLEMA ESTRUTURAL
// =========================================================
{
  const s = pres.addSlide();
  addContentHeader(s, "02  ·  PROBLEMA ESTRUTURAL", "Por que o modelo atual falha");

  // citação à esquerda
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 2.1, w: 5.8, h: 4.4,
    fill: { color: NAVY }, line: { color: NAVY, width: 0 },
  });
  s.addText("\u201C", {
    x: 0.85, y: 2.0, w: 1.5, h: 1.5,
    fontSize: 110, fontFace: FONT_HEAD, color: ACCENT,
    bold: true, margin: 0,
  });
  s.addText("Exigir seguro não significa estar protegido.", {
    x: 0.9, y: 3.3, w: 5.2, h: 2.0,
    fontSize: 28, fontFace: FONT_HEAD, color: WHITE,
    italic: true, bold: true, margin: 0,
  });
  s.addText("A obrigação contratual cria conforto regulatório, não cobertura efetiva.", {
    x: 0.9, y: 5.6, w: 5.2, h: 0.7,
    fontSize: 13, fontFace: FONT_BODY, color: ICE, margin: 0,
  });

  // falhas estruturais à direita
  s.addText("Falhas no modelo atual", {
    x: 6.8, y: 2.1, w: 6.0, h: 0.5,
    fontSize: 18, fontFace: FONT_HEAD, color: NAVY,
    bold: true, margin: 0,
  });

  const fails = [
    { n: "01", t: "Apólice é exigida, não verificada", d: "Comprovação ocorre na entrada e raramente é renovada ou auditada." },
    { n: "02", t: "Coberturas heterogêneas", d: "Cada lojista contrata com escopo, limite e franquia distintos." },
    { n: "03", t: "Apólices baratas e frágeis", d: "O lojista busca menor preço, sem entender exclusões." },
    { n: "04", t: "Risco transborda para o shopping", d: "Sinistro do lojista pode gerar reclamação ao empreendedor." },
  ];

  fails.forEach((f, i) => {
    const y = 2.7 + i * 0.95;
    s.addText(f.n, {
      x: 6.8, y, w: 0.7, h: 0.5,
      fontSize: 22, fontFace: FONT_HEAD, color: ACCENT,
      bold: true, margin: 0,
    });
    s.addText(f.t, {
      x: 7.5, y, w: 5.3, h: 0.35,
      fontSize: 14, fontFace: FONT_BODY, color: NAVY,
      bold: true, margin: 0,
    });
    s.addText(f.d, {
      x: 7.5, y: y + 0.32, w: 5.3, h: 0.55,
      fontSize: 11, fontFace: FONT_BODY, color: GRAY, margin: 0,
    });
  });

  addFooter(s, 3);
}

// =========================================================
// SLIDE 4 — MODELOS EXISTENTES (visão geral)
// =========================================================
{
  const s = pres.addSlide();
  addContentHeader(s, "03  ·  MODELOS DE MERCADO", "Três caminhos possíveis");

  const models = [
    {
      n: "I",
      name: "Individual",
      sub: "Status quo",
      d: "Cada lojista contrata sua própria apólice, sem padronização do shopping.",
      color: GRAY,
    },
    {
      n: "II",
      name: "Híbrido",
      sub: "Recomendado",
      d: "Shopping define regras mínimas e homologa corretora; lojista mantém liberdade de escolha.",
      color: NAVY,
    },
    {
      n: "III",
      name: "Centralizado",
      sub: "Apólice única",
      d: "Shopping contrata apólice coletiva e repassa custo via condomínio ou taxa específica.",
      color: GRAY,
    },
  ];

  const cardW = 4.0;
  const cardH = 4.6;
  const startX = 0.65;
  const gap = 0.25;

  models.forEach((m, i) => {
    const x = startX + i * (cardW + gap);
    const isRec = m.sub === "Recomendado";
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.1, w: cardW, h: cardH,
      fill: { color: isRec ? NAVY : LIGHT_GRAY },
      line: { color: isRec ? NAVY : LIGHT_GRAY, width: 0 },
    });
    if (isRec) {
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 2.1, w: cardW, h: 0.08,
        fill: { color: ACCENT }, line: { color: ACCENT, width: 0 },
      });
    }
    s.addText(m.n, {
      x: x + 0.4, y: 2.4, w: 2.6, h: 1.2,
      fontSize: 60, fontFace: FONT_HEAD,
      color: isRec ? ACCENT : NAVY,
      bold: true, margin: 0,
    });
    s.addText(m.sub.toUpperCase(), {
      x: x + 0.4, y: 3.7, w: cardW - 0.8, h: 0.3,
      fontSize: 10, fontFace: FONT_BODY,
      color: isRec ? ACCENT : GRAY,
      bold: true, charSpacing: 3, margin: 0,
    });
    s.addText(m.name, {
      x: x + 0.4, y: 4.0, w: cardW - 0.8, h: 0.6,
      fontSize: 26, fontFace: FONT_HEAD,
      color: isRec ? WHITE : NAVY,
      bold: true, margin: 0,
    });
    s.addText(m.d, {
      x: x + 0.4, y: 4.7, w: cardW - 0.8, h: 1.7,
      fontSize: 13, fontFace: FONT_BODY,
      color: isRec ? ICE : GRAY, margin: 0,
    });
  });

  addFooter(s, 4);
}

// =========================================================
// Helper genérico para slides 5-7 (detalhamento de modelo)
// =========================================================
function addModelDetailSlide(meta, pageNum) {
  const s = pres.addSlide();
  addContentHeader(s, meta.eyebrow, meta.title);

  // Faixa lateral com nome do modelo
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 2.1, w: 3.4, h: 4.6,
    fill: { color: NAVY }, line: { color: NAVY, width: 0 },
  });
  s.addText(meta.label.toUpperCase(), {
    x: 0.8, y: 2.3, w: 3.0, h: 0.3,
    fontSize: 10, fontFace: FONT_BODY, color: ACCENT,
    bold: true, charSpacing: 3, margin: 0,
  });
  s.addText(meta.name, {
    x: 0.8, y: 2.7, w: 3.0, h: 1.0,
    fontSize: 30, fontFace: FONT_HEAD, color: WHITE,
    bold: true, margin: 0,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 3.85, w: 0.5, h: 0.04,
    fill: { color: ACCENT }, line: { color: ACCENT, width: 0 },
  });
  s.addText("DESCRIÇÃO", {
    x: 0.8, y: 4.0, w: 3.0, h: 0.3,
    fontSize: 10, fontFace: FONT_BODY, color: ACCENT,
    bold: true, charSpacing: 3, valign: "top", margin: 0,
  });
  s.addText(meta.desc, {
    x: 0.8, y: 4.3, w: 3.0, h: 2.3,
    fontSize: 13, fontFace: FONT_BODY, color: ICE,
    valign: "top", margin: 0,
  });

  // 3 colunas à direita
  const cols = [
    { tag: "PRÓS", color: "1F8A5F", items: meta.pros },
    { tag: "CONTRAS", color: "B85042", items: meta.cons },
    { tag: "RISCOS OCULTOS", color: ACCENT, items: meta.hidden },
  ];

  const colW = 2.85;
  const colStart = 4.25;
  const colGap = 0.15;

  cols.forEach((c, i) => {
    const x = colStart + i * (colW + colGap);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.1, w: colW, h: 4.6,
      fill: { color: LIGHT_GRAY }, line: { color: LIGHT_GRAY, width: 0 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.1, w: colW, h: 0.08,
      fill: { color: c.color }, line: { color: c.color, width: 0 },
    });
    s.addText(c.tag, {
      x: x + 0.2, y: 2.3, w: colW - 0.4, h: 0.3,
      fontSize: 11, fontFace: FONT_BODY, color: c.color,
      bold: true, charSpacing: 3, margin: 0,
    });
    const bulletItems = c.items.map((t, idx) => ({
      text: t,
      options: { bullet: { code: "25A0" }, breakLine: idx < c.items.length - 1, paraSpaceAfter: 6 },
    }));
    s.addText(bulletItems, {
      x: x + 0.2, y: 2.75, w: colW - 0.4, h: 3.85,
      fontSize: 12, fontFace: FONT_BODY, color: NAVY,
      valign: "top", margin: 0,
    });
  });

  addFooter(s, pageNum);
}

// SLIDE 5 — Individual
addModelDetailSlide({
  eyebrow: "04  ·  MODELO I",
  title: "Individual — cada lojista por si",
  label: "Modelo I",
  name: "Individual",
  desc: "Cada lojista contrata sua própria apólice de forma livre. O shopping apenas exige comprovação no contrato de locação.",
  pros: [
    "Zero esforço operacional do shopping",
    "Lojista escolhe o que cabe no seu bolso",
    "Sem custo de estrutura para o empreendedor",
  ],
  cons: [
    "Cobertura heterogênea entre lojas",
    "Difícil auditoria de vigência e escopo",
    "Sem ganho de escala em prêmio",
  ],
  hidden: [
    "Apólices baratas com exclusões críticas",
    "Lapsos de vigência não detectados",
    "Risco do lojista respinga no shopping",
  ],
}, 5);

// SLIDE 6 — Híbrido
addModelDetailSlide({
  eyebrow: "04  ·  MODELO II",
  title: "Híbrido — controle com flexibilidade",
  label: "Modelo II",
  name: "Híbrido",
  desc: "Shopping define coberturas mínimas obrigatórias e homologa uma corretora, mantendo liberdade de escolha do lojista.",
  pros: [
    "Padronização das coberturas mínimas",
    "Ganho de escala via corretora homologada",
    "Auditoria simplificada e centralizada",
    "Liberdade preservada para o lojista",
  ],
  cons: [
    "Exige governança e equipe dedicada",
    "Negociação inicial mais complexa",
    "Resistência de lojistas grandes/redes",
  ],
  hidden: [
    "Conflito de interesse na corretora homologada",
    "Risco de virar venda casada se mal desenhado",
    "Necessidade de revisão periódica das regras",
  ],
}, 6);

// SLIDE 7 — Centralizado
addModelDetailSlide({
  eyebrow: "04  ·  MODELO III",
  title: "Centralizado — apólice única do shopping",
  label: "Modelo III",
  name: "Centralizado",
  desc: "Shopping contrata uma apólice coletiva cobrindo todos os lojistas e repassa o custo via condomínio ou taxa específica.",
  pros: [
    "Cobertura 100% padronizada",
    "Maior poder de barganha por volume",
    "Visibilidade total do risco do portfólio",
  ],
  cons: [
    "Shopping assume papel de estipulante",
    "Custo embutido no condomínio gera atrito",
    "Resistência forte de redes nacionais",
  ],
  hidden: [
    "Responsabilidade reputacional em sinistros",
    "Risco regulatório (SUSEP) e tributário",
    "Lojista pode considerar cobertura insuficiente",
  ],
}, 7);

// =========================================================
// SLIDE 8 — COMPARATIVO ESTRATÉGICO
// =========================================================
{
  const s = pres.addSlide();
  addContentHeader(s, "05  ·  COMPARATIVO", "Avaliação cruzada dos três modelos");

  const headerCell = (text) => ({
    text,
    options: {
      bold: true, color: WHITE, fill: { color: NAVY },
      fontFace: FONT_BODY, fontSize: 13, align: "center", valign: "middle",
    },
  });

  const cell = (text, opts = {}) => ({
    text,
    options: {
      color: NAVY, fontFace: FONT_BODY, fontSize: 12,
      align: "center", valign: "middle", ...opts,
    },
  });

  const recCell = (text) => ({
    text,
    options: {
      color: WHITE, fill: { color: NAVY }, bold: true,
      fontFace: FONT_BODY, fontSize: 12,
      align: "center", valign: "middle",
    },
  });

  const dim = (text) => ({
    text,
    options: {
      color: NAVY, bold: true, fill: { color: LIGHT_GRAY },
      fontFace: FONT_BODY, fontSize: 12,
      align: "left", valign: "middle",
    },
  });

  const tableData = [
    [
      headerCell("Dimensão"),
      headerCell("Individual"),
      headerCell("Híbrido"),
      headerCell("Centralizado"),
    ],
    [dim("  Controle do shopping"), cell("Baixo"), recCell("Alto"), cell("Total")],
    [dim("  Custo para o lojista"), cell("Variável"), recCell("Otimizado"), cell("Diluído")],
    [dim("  Risco sistêmico"), cell("Alto"), recCell("Baixo"), cell("Concentrado")],
    [dim("  Complexidade operacional"), cell("Baixa"), recCell("Média"), cell("Alta")],
    [dim("  Padronização de cobertura"), cell("Baixa"), recCell("Alta"), cell("Total")],
    [dim("  Aceitação dos lojistas"), cell("Alta"), recCell("Média–Alta"), cell("Baixa")],
  ];

  s.addTable(tableData, {
    x: 0.6, y: 2.1, w: 12.1,
    colW: [3.4, 2.9, 2.9, 2.9],
    rowH: 0.55,
    border: { type: "solid", pt: 1, color: "DDE3EE" },
  });

  // Legenda
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 6.3, w: 0.25, h: 0.25,
    fill: { color: NAVY }, line: { color: NAVY, width: 0 },
  });
  s.addText("Coluna em destaque = modelo recomendado (Híbrido)", {
    x: 0.95, y: 6.28, w: 8, h: 0.3,
    fontSize: 10, fontFace: FONT_BODY, color: GRAY,
    italic: true, margin: 0,
  });

  addFooter(s, 8);
}

// =========================================================
// SLIDE 9 — ANÁLISE CRÍTICA
// =========================================================
{
  const s = pres.addSlide();
  addContentHeader(s, "06  ·  ANÁLISE CRÍTICA", "Onde o mercado erra hoje");

  const items = [
    {
      n: "01",
      t: "Foco no contrato, não no risco",
      d: "Áreas jurídicas validam a cláusula; ninguém valida se a apólice cobre o que importa.",
    },
    {
      n: "02",
      t: "Ausência de coberturas mínimas",
      d: "Sem padrão, o mercado nivela por baixo — apólices baratas e cheias de exclusão.",
    },
    {
      n: "03",
      t: "Sem inteligência de portfólio",
      d: "Shoppings não sabem qual % do GLA está efetivamente coberto, nem com que limite.",
    },
    {
      n: "04",
      t: "Subestimação do risco subsidiário",
      d: "Sinistros graves do lojista geram pleitos contra o shopping, mesmo sem culpa direta.",
    },
    {
      n: "05",
      t: "Tratamento do seguro como custo, não ativo",
      d: "Falta visão estratégica: seguro bem desenhado é alavanca de continuidade do negócio.",
    },
    {
      n: "06",
      t: "Falta de governança recorrente",
      d: "Não existe rito de revisão anual de cobertura, sinistralidade e adesão.",
    },
  ];

  const cardW = 6.0;
  const cardH = 1.4;
  const xs = [0.6, 6.7];

  items.forEach((it, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = xs[col];
    const y = 2.1 + row * (cardH + 0.2);

    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: cardW, h: cardH,
      fill: { color: LIGHT_GRAY }, line: { color: LIGHT_GRAY, width: 0 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.08, h: cardH,
      fill: { color: ACCENT }, line: { color: ACCENT, width: 0 },
    });
    s.addText(it.n, {
      x: x + 0.25, y: y + 0.2, w: 0.6, h: 0.5,
      fontSize: 18, fontFace: FONT_HEAD, color: ACCENT,
      bold: true, margin: 0,
    });
    s.addText(it.t, {
      x: x + 0.95, y: y + 0.18, w: cardW - 1.1, h: 0.4,
      fontSize: 14, fontFace: FONT_BODY, color: NAVY,
      bold: true, margin: 0,
    });
    s.addText(it.d, {
      x: x + 0.95, y: y + 0.6, w: cardW - 1.1, h: 0.7,
      fontSize: 11, fontFace: FONT_BODY, color: GRAY, margin: 0,
    });
  });

  addFooter(s, 9);
}

// =========================================================
// SLIDE 10 — RECOMENDAÇÃO ESTRATÉGICA
// =========================================================
{
  const s = pres.addSlide();
  s.background = { color: NAVY };

  s.addText("07  ·  RECOMENDAÇÃO ESTRATÉGICA", {
    x: 0.6, y: 0.6, w: 12, h: 0.4,
    fontSize: 11, fontFace: FONT_BODY, color: ACCENT,
    bold: true, charSpacing: 4, margin: 0,
  });
  s.addText("Adoção do Modelo Híbrido", {
    x: 0.6, y: 1.0, w: 12, h: 1.0,
    fontSize: 38, fontFace: FONT_HEAD, color: WHITE,
    bold: true, margin: 0,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 2.05, w: 0.6, h: 0.04,
    fill: { color: ACCENT }, line: { color: ACCENT, width: 0 },
  });

  s.addText("Equilíbrio entre controle do shopping, eficiência de capital e liberdade do lojista.", {
    x: 0.6, y: 2.25, w: 12, h: 0.6,
    fontSize: 17, fontFace: FONT_BODY, color: ICE,
    italic: true, margin: 0,
  });

  // 4 razões
  const reasons = [
    { t: "Controle sem fricção", d: "Regras mínimas obrigatórias garantem padrão sem retirar a escolha do lojista." },
    { t: "Custo otimizado", d: "Corretora homologada negocia em escala, com benefício direto para o varejista." },
    { t: "Risco sob medida", d: "Coberturas alinhadas ao perfil do shopping e ao porte da operação." },
    { t: "Governança contínua", d: "Dados consolidados permitem rito anual de revisão e melhoria." },
  ];

  const cardW = 2.85;
  const cardH = 3.2;
  const startX = 0.6;
  const gap = 0.2;

  reasons.forEach((r, i) => {
    const x = startX + i * (cardW + gap);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 3.2, w: cardW, h: cardH,
      fill: { color: NAVY_DARK }, line: { color: ACCENT, width: 1 },
    });
    s.addText(`0${i + 1}`, {
      x: x + 0.25, y: 3.4, w: 1.0, h: 0.6,
      fontSize: 26, fontFace: FONT_HEAD, color: ACCENT,
      bold: true, margin: 0,
    });
    s.addText(r.t, {
      x: x + 0.25, y: 4.1, w: cardW - 0.5, h: 0.7,
      fontSize: 16, fontFace: FONT_HEAD, color: WHITE,
      bold: true, margin: 0,
    });
    s.addText(r.d, {
      x: x + 0.25, y: 4.85, w: cardW - 0.5, h: 1.5,
      fontSize: 12, fontFace: FONT_BODY, color: ICE, margin: 0,
    });
  });

  s.addText("Programa sugerido:  Seguro Inteligente de Lojistas  ·  SIL", {
    x: 0.6, y: 6.7, w: 12, h: 0.4,
    fontSize: 12, fontFace: FONT_BODY, color: ACCENT,
    italic: true, margin: 0,
  });

  // rodapé claro
  s.addText("10", {
    x: 12.4, y: 7.05, w: 0.4, h: 0.3,
    fontSize: 9, fontFace: FONT_BODY, color: ICE,
    align: "right", margin: 0,
  });
}

// =========================================================
// SLIDE 11 — MODELO OPERACIONAL PROPOSTO
// =========================================================
{
  const s = pres.addSlide();
  addContentHeader(s, "08  ·  MODELO OPERACIONAL", "Como funciona na prática");

  // 3 pilares lado a lado
  const pillars = [
    {
      n: "01",
      title: "Corretora Homologada",
      items: [
        "Seleção via RFP estruturado",
        "Remuneração transparente",
        "Atendimento dedicado ao portfólio",
        "Reporte mensal ao shopping",
      ],
    },
    {
      n: "02",
      title: "Regras Mínimas",
      items: [
        "Coberturas obrigatórias definidas",
        "Limites mínimos por categoria de loja",
        "Cláusula de RC para o shopping",
        "Comprovação anual de vigência",
      ],
    },
    {
      n: "03",
      title: "Governança",
      items: [
        "Comitê trimestral de risco",
        "Painel de adesão e sinistralidade",
        "Revisão anual das regras mínimas",
        "Auditoria independente da corretora",
      ],
    },
  ];

  const cardW = 4.0;
  const cardH = 4.6;
  const startX = 0.65;
  const gap = 0.25;

  pillars.forEach((p, i) => {
    const x = startX + i * (cardW + gap);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.1, w: cardW, h: cardH,
      fill: { color: WHITE }, line: { color: "DDE3EE", width: 1 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.1, w: cardW, h: 0.08,
      fill: { color: ACCENT }, line: { color: ACCENT, width: 0 },
    });
    s.addText(p.n, {
      x: x + 0.3, y: 2.35, w: 1.0, h: 0.6,
      fontSize: 28, fontFace: FONT_HEAD, color: ACCENT,
      bold: true, margin: 0,
    });
    s.addText(p.title, {
      x: x + 0.3, y: 3.0, w: cardW - 0.6, h: 0.6,
      fontSize: 19, fontFace: FONT_HEAD, color: NAVY,
      bold: true, margin: 0,
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.3, y: 3.55, w: 0.4, h: 0.03,
      fill: { color: ACCENT }, line: { color: ACCENT, width: 0 },
    });
    const bulletItems = p.items.map((t, idx) => ({
      text: t,
      options: { bullet: { code: "25A0" }, breakLine: idx < p.items.length - 1, paraSpaceAfter: 8 },
    }));
    s.addText(bulletItems, {
      x: x + 0.3, y: 3.75, w: cardW - 0.6, h: 2.7,
      fontSize: 13, fontFace: FONT_BODY, color: NAVY,
      valign: "top", margin: 0,
    });
  });

  addFooter(s, 11);
}

// =========================================================
// SLIDE 12 — RISCOS E MITIGAÇÕES
// =========================================================
{
  const s = pres.addSlide();
  addContentHeader(s, "09  ·  RISCOS & MITIGAÇÕES", "Os principais pontos de atenção");

  const headerCell = (text) => ({
    text,
    options: {
      bold: true, color: WHITE, fill: { color: NAVY },
      fontFace: FONT_BODY, fontSize: 13, align: "left", valign: "middle",
    },
  });
  const cell = (text, opts = {}) => ({
    text,
    options: {
      color: NAVY, fontFace: FONT_BODY, fontSize: 11,
      align: "left", valign: "middle", ...opts,
    },
  });
  const sevHigh = { text: "Alto", options: { bold: true, color: WHITE, fill: { color: "B85042" }, fontFace: FONT_BODY, fontSize: 11, align: "center", valign: "middle" } };
  const sevMed = { text: "Médio", options: { bold: true, color: WHITE, fill: { color: ACCENT }, fontFace: FONT_BODY, fontSize: 11, align: "center", valign: "middle" } };
  const sevLow = { text: "Baixo", options: { bold: true, color: WHITE, fill: { color: "1F8A5F" }, fontFace: FONT_BODY, fontSize: 11, align: "center", valign: "middle" } };

  const tableData = [
    [headerCell("  Risco"), headerCell("Severidade"), headerCell("Mitigação")],
    [
      cell("  Percepção de venda casada", { bold: true }),
      sevHigh,
      cell("Liberdade explícita de escolha em contrato; corretora homologada como opção, não imposição."),
    ],
    [
      cell("  Conflito de interesse da corretora", { bold: true }),
      sevMed,
      cell("Auditoria independente anual; remuneração transparente; SLAs contratuais."),
    ],
    [
      cell("  Resistência de redes nacionais", { bold: true }),
      sevMed,
      cell("Aceitação de apólices próprias desde que cumpram coberturas mínimas."),
    ],
    [
      cell("  Baixa adesão inicial", { bold: true }),
      sevMed,
      cell("Comunicação ativa, comparativo de preço e plano de transição de 12 meses."),
    ],
    [
      cell("  Risco regulatório (SUSEP)", { bold: true }),
      sevLow,
      cell("Modelo opera como regra contratual, não como apólice coletiva — sem papel de estipulante."),
    ],
    [
      cell("  Sinistralidade fora do esperado", { bold: true }),
      sevLow,
      cell("Painel mensal e cláusula de revisão de prêmio com a seguradora."),
    ],
  ];

  s.addTable(tableData, {
    x: 0.6, y: 2.1, w: 12.1,
    colW: [4.5, 1.6, 6.0],
    rowH: 0.6,
    border: { type: "solid", pt: 1, color: "DDE3EE" },
  });

  addFooter(s, 12);
}

// =========================================================
// SLIDE 13 — ROADMAP
// =========================================================
{
  const s = pres.addSlide();
  addContentHeader(s, "10  ·  ROADMAP", "Implementação em três fases");

  const phases = [
    {
      n: "01",
      label: "CURTO PRAZO",
      window: "0 – 3 meses",
      title: "Estruturação",
      items: [
        "Definir coberturas mínimas obrigatórias",
        "RFP de corretora homologada",
        "Atualizar minuta de locação",
        "Comunicação aos lojistas",
      ],
    },
    {
      n: "02",
      label: "MÉDIO PRAZO",
      window: "3 – 12 meses",
      title: "Implementação",
      items: [
        "Onboarding gradual por shopping",
        "Migração de novas locações ao modelo",
        "Implantação do painel de adesão",
        "Primeiro ciclo de auditoria",
      ],
    },
    {
      n: "03",
      label: "LONGO PRAZO",
      window: "12 – 24 meses",
      title: "Otimização",
      items: [
        "Renegociação consolidada de prêmios",
        "Dados de portfólio para precificação",
        "Expansão para coberturas adicionais",
        "Programa SIL replicado em todo o portfólio",
      ],
    },
  ];

  // linha de tempo
  s.addShape(pres.shapes.RECTANGLE, {
    x: 1.3, y: 3.5, w: 10.7, h: 0.04,
    fill: { color: ICE }, line: { color: ICE, width: 0 },
  });

  const cardW = 4.0;
  const cardH = 3.5;
  const startX = 0.65;
  const gap = 0.25;

  phases.forEach((p, i) => {
    const x = startX + i * (cardW + gap);

    // marcador na linha
    s.addShape(pres.shapes.OVAL, {
      x: x + cardW / 2 - 0.15, y: 3.37, w: 0.3, h: 0.3,
      fill: { color: ACCENT }, line: { color: WHITE, width: 2 },
    });

    // card
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 3.85, w: cardW, h: cardH,
      fill: { color: LIGHT_GRAY }, line: { color: LIGHT_GRAY, width: 0 },
    });

    s.addText(p.n, {
      x, y: 2.3, w: cardW, h: 0.7,
      fontSize: 38, fontFace: FONT_HEAD, color: NAVY,
      bold: true, align: "center", margin: 0,
    });
    s.addText(p.label, {
      x, y: 2.95, w: cardW, h: 0.3,
      fontSize: 10, fontFace: FONT_BODY, color: ACCENT,
      bold: true, charSpacing: 3, align: "center", margin: 0,
    });

    s.addText(p.window, {
      x: x + 0.3, y: 4.05, w: cardW - 0.6, h: 0.3,
      fontSize: 11, fontFace: FONT_BODY, color: GRAY,
      italic: true, margin: 0,
    });
    s.addText(p.title, {
      x: x + 0.3, y: 4.35, w: cardW - 0.6, h: 0.5,
      fontSize: 18, fontFace: FONT_HEAD, color: NAVY,
      bold: true, margin: 0,
    });
    const bulletItems = p.items.map((t, idx) => ({
      text: t,
      options: { bullet: { code: "25A0" }, breakLine: idx < p.items.length - 1, paraSpaceAfter: 6 },
    }));
    s.addText(bulletItems, {
      x: x + 0.3, y: 4.95, w: cardW - 0.6, h: 2.3,
      fontSize: 11, fontFace: FONT_BODY, color: NAVY,
      valign: "top", margin: 0,
    });
  });

  addFooter(s, 13);
}

// =========================================================
// SLIDE 14 — CONCLUSÃO
// =========================================================
{
  const s = pres.addSlide();
  s.background = { color: NAVY };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.35, h: SLIDE_H,
    fill: { color: ACCENT }, line: { color: ACCENT, width: 0 },
  });

  s.addText("11  ·  CONCLUSÃO", {
    x: 1.0, y: 1.6, w: 11, h: 0.4,
    fontSize: 11, fontFace: FONT_BODY, color: ACCENT,
    bold: true, charSpacing: 4, margin: 0,
  });

  s.addText("Seguro deixa de ser exigência contratual.", {
    x: 1.0, y: 2.1, w: 11, h: 1.4,
    fontSize: 34, fontFace: FONT_HEAD, color: WHITE,
    bold: true, valign: "top", margin: 0,
  });
  s.addText("Passa a ser ativo estratégico de portfólio.", {
    x: 1.0, y: 3.4, w: 11, h: 1.4,
    fontSize: 34, fontFace: FONT_HEAD, color: ACCENT,
    italic: true, bold: true, valign: "top", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 1.0, y: 4.85, w: 1.2, h: 0.04,
    fill: { color: ACCENT }, line: { color: ACCENT, width: 0 },
  });

  const closing = [
    "Reduz risco sistêmico do portfólio",
    "Otimiza custo total para shopping e lojista",
    "Cria inteligência de dados sobre cobertura real",
    "Eleva o nível de governança para padrão de board",
  ];
  const closingItems = closing.map((t, idx) => ({
    text: t,
    options: { bullet: { code: "25A0" }, breakLine: idx < closing.length - 1, paraSpaceAfter: 6 },
  }));
  s.addText(closingItems, {
    x: 1.0, y: 5.1, w: 11, h: 1.5,
    fontSize: 14, fontFace: FONT_BODY, color: ICE,
    valign: "top", margin: 0,
  });

  s.addText("Próximo passo:  aprovação do comitê para início da Fase 1.", {
    x: 1.0, y: 6.75, w: 11, h: 0.4,
    fontSize: 13, fontFace: FONT_BODY, color: WHITE,
    italic: true, bold: true, margin: 0,
  });
}

pres.writeFile({ fileName: "/home/claude/estrategia_seguro_lojas.pptx" })
  .then((f) => console.log("OK:", f));
