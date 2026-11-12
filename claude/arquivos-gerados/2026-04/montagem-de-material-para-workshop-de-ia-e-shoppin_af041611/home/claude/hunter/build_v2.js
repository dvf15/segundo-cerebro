// Workshop IA · Agente Hunter — versão 2 (informal, com Zél mascote e dinâmica)
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fs = require("fs");

const {
  FaSearchLocation, FaChartBar, FaUserCheck, FaCommentDots, FaBalanceScale, FaClipboardList,
  FaArrowRight, FaCogs, FaHandshake, FaBuilding, FaTools, FaQuoteLeft, FaCalendarAlt, FaRobot,
  FaWalking, FaBinoculars, FaCoffee, FaUsers, FaLightbulb, FaMapMarkedAlt, FaStore,
  FaWhatsapp, FaBullhorn, FaFire, FaStopwatch
} = require("react-icons/fa");

// ─── Palette: charcoal + amber/copper accent (sóbrio mas com calor) ───
const C = {
  bg: "FFFFFF",
  ink: "1F2A37",
  ink2: "374151",
  muted: "6B7280",
  light: "F3F4F6",
  border: "E5E7EB",
  accent: "B45309",
  accent2: "065F46",
  navy: "1E3A5F",
  paper: "FAFAF9",
  red: "991B1B",
  green: "166534",
  amberlight: "FEF3C7",
  zellblue: "1E3A8A",
  levygreen: "047857",
};

const FONT_H = "Georgia";
const FONT_B = "Calibri";

// ─── Icon helper ───
function renderIconSvg(IconComponent, color = "#000000", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}
async function icon(IconComp, hex = C.ink, size = 256) {
  const svg = renderIconSvg(IconComp, "#" + hex, size);
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

const cardShadow = () => ({ type: "outer", blur: 8, offset: 2, color: "000000", opacity: 0.08, angle: 90 });

// Load Zél mascot — clean version without baked-in caption
const zelPath = "/home/claude/hunter/zel_clean.png";
const zelData = "image/png;base64," + fs.readFileSync(zelPath).toString("base64");
// Also full version with caption (for cover-style use if needed)
const zelFullData = "image/jpeg;base64," + fs.readFileSync("/home/claude/hunter/zel.jpeg").toString("base64");

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.title = "Agente Hunter — Workshop IA";
  pres.author = "Workshop interno";

  const W = 13.333, H = 7.5;

  // Pre-render icons
  const icMap = await icon(FaSearchLocation, C.accent);
  const icScore = await icon(FaChartBar, C.accent);
  const icQual = await icon(FaUserCheck, C.accent);
  const icScript = await icon(FaCommentDots, C.accent);
  const icRC = await icon(FaBalanceScale, C.accent);
  const icRep = await icon(FaClipboardList, C.accent);
  const icArrow = await icon(FaArrowRight, C.muted);
  const icCog = await icon(FaCogs, C.accent);
  const icHand = await icon(FaHandshake, C.accent);
  const icBld = await icon(FaBuilding, C.accent);
  const icTools = await icon(FaTools, C.accent);
  const icQuote = await icon(FaQuoteLeft, "FFFFFF");
  const icCal = await icon(FaCalendarAlt, C.accent);
  const icRobot = await icon(FaRobot, C.accent);
  const icWalk = await icon(FaWalking, C.levygreen);
  const icBino = await icon(FaBinoculars, C.zellblue);
  const icCoffee = await icon(FaCoffee, C.levygreen);
  const icUsers = await icon(FaUsers, C.accent);
  const icLight = await icon(FaLightbulb, C.accent);
  const icStore = await icon(FaStore, C.accent);
  const icWa = await icon(FaWhatsapp, C.green);
  const icBull = await icon(FaBullhorn, C.accent);
  const icFire = await icon(FaFire, C.accent);
  const icStop = await icon(FaStopwatch, C.accent);

  // ───────────────────────── HELPERS ─────────────────────────
  const sectionEyebrow = (slide, text) => {
    slide.addText(text, {
      x: 0.6, y: 0.45, w: 8, h: 0.3,
      fontSize: 10, fontFace: FONT_B, color: C.accent,
      bold: true, charSpacing: 4, margin: 0
    });
  };
  const slideTitle = (slide, text, opts = {}) => {
    slide.addText(text, {
      x: 0.6, y: 0.75, w: 12, h: 0.9,
      fontSize: opts.size || 36, fontFace: FONT_H, color: C.ink,
      bold: true, margin: 0, ...opts
    });
  };
  const footer = (slide, num, total = 14) => {
    slide.addShape(pres.shapes.LINE, {
      x: 0.6, y: H - 0.4, w: W - 1.2, h: 0,
      line: { color: C.border, width: 0.75 }
    });
    slide.addText("Workshop IA · Hunter · Zél", {
      x: 0.6, y: H - 0.32, w: 6, h: 0.25,
      fontSize: 9, fontFace: FONT_B, color: C.muted, margin: 0
    });
    slide.addText(`${num} / ${total}`, {
      x: W - 1.6, y: H - 0.32, w: 1, h: 0.25,
      fontSize: 9, fontFace: FONT_B, color: C.muted, align: "right", margin: 0
    });
  };
  // Mini Zél in corner (uses clean image — aspect ~0.77)
  const miniZel = (slide, x = W - 1.2, y = 0.3, size = 0.7) => {
    slide.addImage({ data: zelData, x, y, w: size, h: size / 0.77 });
  };

  // ═══════════════════════════════════════════════════════════
  // SLIDE 1 — COVER (com Zél grande)
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.ink };

    // Left amber strip
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 0.4, h: H, fill: { color: C.accent }, line: { color: C.accent }
    });

    // Eyebrow
    s.addText("WORKSHOP INTERNO  ·  IA + SHOPPING", {
      x: 1.2, y: 0.9, w: 10, h: 0.4,
      fontSize: 12, fontFace: FONT_B, color: "D1D5DB",
      bold: true, charSpacing: 6, margin: 0
    });

    // Big title with Zél on right
    s.addText("Conheça o Zél.", {
      x: 1.2, y: 1.65, w: 8.5, h: 1.4,
      fontSize: 60, fontFace: FONT_H, color: "FFFFFF",
      bold: true, italic: true, margin: 0
    });

    s.addText("O agente comercial que junta o Zell com o Levy.", {
      x: 1.2, y: 3.2, w: 8.0, h: 1.0,
      fontSize: 22, fontFace: FONT_H, color: "F3F4F6",
      italic: true, margin: 0
    });

    // Sub
    s.addText("Mentalidade do Sam Zell + execução do Zé Roberto Levy.\nNo trabalho, todo dia, no shopping.", {
      x: 1.2, y: 4.4, w: 8, h: 1.0,
      fontSize: 16, fontFace: FONT_B, color: "9CA3AF", margin: 0
    });

    // Zél image (full version with caption — looks intentional on cover)
    s.addImage({
      data: zelFullData, x: 9.4, y: 1.3, w: 3.4, h: 5.1
    });

    // Bottom strip
    s.addShape(pres.shapes.LINE, {
      x: 1.2, y: 5.8, w: 4, h: 0,
      line: { color: C.accent, width: 2 }
    });

    s.addText("DURAÇÃO  ·  MEIO PERÍODO", {
      x: 1.2, y: 5.95, w: 4, h: 0.3,
      fontSize: 10, fontFace: FONT_B, color: C.accent,
      bold: true, charSpacing: 4, margin: 0
    });

    s.addText("Material de uso interno · Anote, mexa, leve para casa.", {
      x: 1.2, y: H - 0.7, w: 8, h: 0.3,
      fontSize: 10, fontFace: FONT_B, color: "6B7280",
      italic: true, margin: 0
    });
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 2 — QUEM É O ZÉL (DNA)
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    sectionEyebrow(s, "QUEM É ESSE TAL DE ZÉL");
    slideTitle(s, "Dois pais, um agente.");

    // Zél in center (clean image, no baked caption)
    s.addImage({
      data: zelData, x: 5.5, y: 2.1, w: 2.3, h: 2.99
    });
    s.addText("ZÉL", {
      x: 5.5, y: 5.2, w: 2.3, h: 0.45,
      fontSize: 28, fontFace: FONT_H, color: C.ink,
      bold: true, italic: true, align: "center", margin: 0
    });
    s.addText("agente comercial IA", {
      x: 5.5, y: 5.65, w: 2.3, h: 0.3,
      fontSize: 12, fontFace: FONT_B, color: C.muted,
      italic: true, align: "center", margin: 0
    });

    // Left card — Zell
    const lx = 0.6, ly = 1.95, lw = 4.6, lh = 4.5;
    s.addShape(pres.shapes.RECTANGLE, {
      x: lx, y: ly, w: lw, h: lh,
      fill: { color: C.paper }, line: { color: C.border, width: 1 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: lx, y: ly, w: lw, h: 0.08,
      fill: { color: C.zellblue }, line: { color: C.zellblue }
    });
    s.addText("DA CABEÇA DELE", {
      x: lx + 0.3, y: ly + 0.25, w: lw - 0.6, h: 0.3,
      fontSize: 10, fontFace: FONT_B, color: C.zellblue,
      bold: true, charSpacing: 3, margin: 0
    });
    s.addText("Sam Zell", {
      x: lx + 0.3, y: ly + 0.55, w: lw - 0.6, h: 0.7,
      fontSize: 30, fontFace: FONT_H, color: C.ink,
      bold: true, italic: true, margin: 0
    });
    s.addText("Investidor americano. \"Am I being too subtle?\"", {
      x: lx + 0.3, y: ly + 1.25, w: lw - 0.6, h: 0.3,
      fontSize: 11, fontFace: FONT_B, color: C.muted,
      italic: true, margin: 0
    });
    s.addShape(pres.shapes.LINE, {
      x: lx + 0.3, y: ly + 1.65, w: 0.5, h: 0,
      line: { color: C.zellblue, width: 2 }
    });
    s.addText("O QUE ELE EMPRESTA AO ZÉL", {
      x: lx + 0.3, y: ly + 1.8, w: lw - 0.6, h: 0.3,
      fontSize: 9, fontFace: FONT_B, color: C.muted,
      bold: true, charSpacing: 2, margin: 0
    });
    s.addText([
      { text: "A mentalidade", options: { bold: true, color: C.ink, breakLine: true } },
      { text: "Como pensar antes de agir.", options: { color: C.ink2 } }
    ], {
      x: lx + 0.3, y: ly + 2.15, w: lw - 0.6, h: 0.7,
      fontSize: 14, fontFace: FONT_B, margin: 0
    });
    s.addText([
      { text: "Olha pro downside primeiro", options: { bullet: true, color: C.ink2, breakLine: true } },
      { text: "Caça desequilíbrio oferta × demanda", options: { bullet: true, color: C.ink2, breakLine: true } },
      { text: "Replacement cost: trazer ou desenvolver?", options: { bullet: true, color: C.ink2, breakLine: true } },
      { text: "\"If everyone goes left, look right\"", options: { bullet: true, color: C.ink2 } }
    ], {
      x: lx + 0.3, y: ly + 2.95, w: lw - 0.6, h: 1.5,
      fontSize: 12.5, fontFace: FONT_B, paraSpaceAfter: 4, margin: 0
    });

    // Right card — Levy
    const rx = 8.1, ry = 1.95, rw = 4.6, rh = 4.5;
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: ry, w: rw, h: rh,
      fill: { color: C.paper }, line: { color: C.border, width: 1 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: ry, w: rw, h: 0.08,
      fill: { color: C.levygreen }, line: { color: C.levygreen }
    });
    s.addText("DA SOLA DO SAPATO DELE", {
      x: rx + 0.3, y: ry + 0.25, w: rw - 0.6, h: 0.3,
      fontSize: 10, fontFace: FONT_B, color: C.levygreen,
      bold: true, charSpacing: 3, margin: 0
    });
    s.addText("Zé Roberto Levy", {
      x: rx + 0.3, y: ry + 0.55, w: rw - 0.6, h: 0.7,
      fontSize: 30, fontFace: FONT_H, color: C.ink,
      bold: true, italic: true, margin: 0
    });
    s.addText("Comercial de shopping. \"Reunião e sola de sapato.\"", {
      x: rx + 0.3, y: ry + 1.25, w: rw - 0.6, h: 0.3,
      fontSize: 11, fontFace: FONT_B, color: C.muted,
      italic: true, margin: 0
    });
    s.addShape(pres.shapes.LINE, {
      x: rx + 0.3, y: ry + 1.65, w: 0.5, h: 0,
      line: { color: C.levygreen, width: 2 }
    });
    s.addText("O QUE ELE EMPRESTA AO ZÉL", {
      x: rx + 0.3, y: ry + 1.8, w: rw - 0.6, h: 0.3,
      fontSize: 9, fontFace: FONT_B, color: C.muted,
      bold: true, charSpacing: 2, margin: 0
    });
    s.addText([
      { text: "A execução", options: { bold: true, color: C.ink, breakLine: true } },
      { text: "Como rodar todo dia.", options: { color: C.ink2 } }
    ], {
      x: rx + 0.3, y: ry + 2.15, w: rw - 0.6, h: 0.7,
      fontSize: 14, fontFace: FONT_B, margin: 0
    });
    s.addText([
      { text: "Sola de sapato: prospecção de rua", options: { bullet: true, color: C.ink2, breakLine: true } },
      { text: "10 reuniões/semana, sem desculpa", options: { bullet: true, color: C.ink2, breakLine: true } },
      { text: "Pescar no aquário (lojista que já conhecemos)", options: { bullet: true, color: C.ink2, breakLine: true } },
      { text: "Multifranqueado e multimarca como vetor", options: { bullet: true, color: C.ink2 } }
    ], {
      x: rx + 0.3, y: ry + 2.95, w: rw - 0.6, h: 1.5,
      fontSize: 12.5, fontFace: FONT_B, paraSpaceAfter: 4, margin: 0
    });

    // Bottom note
    s.addText("Zell pensa.  Levy executa.  Zél faz os dois — e ainda lembra de tudo na semana seguinte.", {
      x: 0.6, y: 6.65, w: W - 1.2, h: 0.4,
      fontSize: 14, fontFace: FONT_H, color: C.accent,
      italic: true, align: "center", margin: 0
    });

    footer(s, 2);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 3 — POR QUE ESTAMOS AQUI
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    miniZel(s);
    sectionEyebrow(s, "POR QUE A GENTE TÁ AQUI HOJE");
    slideTitle(s, "Duas coisas, e a gente vai embora.");

    const items = [
      {
        n: "01",
        title: "Aprender IA fazendo",
        desc: "Sem teoria chata. Você vai abrir o Claude.ai, escrever um prompt, ver o que sai. No final do dia, o agente é seu — você sabe como ele funciona porque você construiu."
      },
      {
        n: "02",
        title: "Sair com o Zél pronto",
        desc: "Não é simulação. É um agente que sua equipe usa na segunda-feira. Tem contexto do seu shopping, lista de skills e plano D0 — o que fazer dia 1, 2 e 3."
      },
    ];

    items.forEach((it, i) => {
      const y = 2.0 + i * 2.3;
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.6, y, w: W - 1.2, h: 1.9,
        fill: { color: C.paper }, line: { color: C.border, width: 1 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.6, y, w: 0.08, h: 1.9,
        fill: { color: C.accent }, line: { color: C.accent }
      });
      s.addText(it.n, {
        x: 0.85, y: y + 0.1, w: 1.5, h: 1.7,
        fontSize: 72, fontFace: FONT_H, color: "E5E7EB",
        bold: true, italic: true, margin: 0, valign: "middle", align: "center"
      });
      s.addText(it.title, {
        x: 2.7, y: y + 0.35, w: 9, h: 0.55,
        fontSize: 24, fontFace: FONT_H, color: C.ink,
        bold: true, margin: 0
      });
      s.addText(it.desc, {
        x: 2.7, y: y + 0.95, w: 9.5, h: 0.85,
        fontSize: 14, fontFace: FONT_B, color: C.ink2, margin: 0
      });
    });

    footer(s, 3);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 4 — IA RÁPIDO
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    miniZel(s);
    sectionEyebrow(s, "ANTES DE COMEÇAR");
    slideTitle(s, "IA em 3 minutos. Sério.");

    const cards = [
      {
        tag: "01",
        title: "LLM",
        sub: "o cérebro",
        body: "Um modelo treinado em bilhões de textos. Não pensa — completa o que vem a seguir. Quanto melhor você pergunta, melhor ele responde."
      },
      {
        tag: "02",
        title: "Prompt",
        sub: "o briefing",
        body: "É como você pede. Quanto você dá de contexto, mais útil é a resposta. Lixo entra, lixo sai. Briefing bom, output bom."
      },
      {
        tag: "03",
        title: "Agente",
        sub: "o funcionário",
        body: "Modelo + contexto + skills + memória. É um \"funcionário\" digital que sabe seu shopping, suas regras e suas tarefas. É o que a gente vai construir hoje."
      },
    ];

    const cardW = 4.0, cardH = 3.8, gap = 0.27;
    const totalW = cardW * 3 + gap * 2;
    const startX = (W - totalW) / 2;

    cards.forEach((c, i) => {
      const x = startX + i * (cardW + gap);
      const y = 2.0;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: cardH,
        fill: { color: C.bg }, line: { color: C.border, width: 1 },
        shadow: cardShadow()
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.08, fill: { color: C.accent }, line: { color: C.accent }
      });
      s.addText(c.tag, {
        x: x + 0.3, y: y + 0.3, w: cardW - 0.6, h: 0.3,
        fontSize: 11, fontFace: FONT_B, color: C.accent,
        bold: true, charSpacing: 4, margin: 0
      });
      s.addText(c.title, {
        x: x + 0.3, y: y + 0.65, w: cardW - 0.6, h: 0.7,
        fontSize: 32, fontFace: FONT_H, color: C.ink,
        bold: true, italic: true, margin: 0
      });
      s.addText(c.sub, {
        x: x + 0.3, y: y + 1.4, w: cardW - 0.6, h: 0.35,
        fontSize: 14, fontFace: FONT_B, color: C.muted, italic: true, margin: 0
      });
      s.addShape(pres.shapes.LINE, {
        x: x + 0.3, y: y + 1.85, w: 0.6, h: 0,
        line: { color: C.accent, width: 1.5 }
      });
      s.addText(c.body, {
        x: x + 0.3, y: y + 2.0, w: cardW - 0.6, h: 1.6,
        fontSize: 13, fontFace: FONT_B, color: C.ink2, margin: 0
      });
    });

    // Tool note
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 6.2, w: W - 1.2, h: 0.65,
      fill: { color: C.amberlight }, line: { color: "F59E0B", width: 0.5 }
    });
    s.addImage({
      data: icRobot, x: 0.85, y: 6.35, w: 0.35, h: 0.35
    });
    s.addText([
      { text: "Ferramenta de hoje:  ", options: { bold: true, color: C.accent } },
      { text: "Claude.ai (gratuito). Quem ainda não tem conta, faz agora — leva 1 minuto.", options: { color: C.ink } }
    ], {
      x: 1.4, y: 6.27, w: W - 2, h: 0.55,
      fontSize: 13, fontFace: FONT_B, valign: "middle", margin: 0
    });

    footer(s, 4);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 5 — MISSÃO DO ZÉL
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    miniZel(s);
    sectionEyebrow(s, "O QUE O ZÉL VAI FAZER");
    slideTitle(s, "Missão.");

    s.addShape(pres.shapes.LINE, {
      x: 0.6, y: 1.85, w: 1.5, h: 0,
      line: { color: C.accent, width: 3 }
    });
    s.addText(
      "Achar lojista bom (em outros shoppings ou nas ruas), ver se faz sentido pro seu shopping, montar o script de abordagem e te deixar pronto pra puxar a reunião.",
      {
        x: 0.6, y: 2.05, w: 8.5, h: 2.5,
        fontSize: 22, fontFace: FONT_H, color: C.ink,
        italic: true, margin: 0, valign: "top"
      }
    );

    // Right side: 3 stats
    const stats = [
      { num: "6", label: "Skills no dia a dia" },
      { num: "2–50", label: "km de raio de caça" },
      { num: "10", label: "Reuniões/semana — meta Levy" },
    ];
    stats.forEach((st, i) => {
      const x = 9.5;
      const y = 1.95 + i * 1.05;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 0.04, h: 0.95, fill: { color: C.accent }, line: { color: C.accent }
      });
      s.addText(st.num, {
        x: x + 0.2, y: y - 0.05, w: 3.3, h: 0.65,
        fontSize: 38, fontFace: FONT_H, color: C.ink,
        bold: true, italic: true, margin: 0
      });
      s.addText(st.label, {
        x: x + 0.2, y: y + 0.6, w: 3.3, h: 0.35,
        fontSize: 11, fontFace: FONT_B, color: C.muted,
        charSpacing: 1, margin: 0
      });
    });

    // Bottom — what it produces
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 5.4, w: W - 1.2, h: 1.4,
      fill: { color: C.paper }, line: { color: C.border, width: 1 }
    });
    s.addText("O QUE VOCÊ RECEBE TODA SEMANA", {
      x: 0.85, y: 5.55, w: 12, h: 0.3,
      fontSize: 10, fontFace: FONT_B, color: C.accent,
      bold: true, charSpacing: 4, margin: 0
    });
    s.addText([
      { text: "Lista de prospects ranqueada", options: { bold: true, color: C.ink } },
      { text: "  com nota de fit, contato, perfil curto e qual é o próximo passo. Sem relatório, sem floreio — só o que você precisa pra agendar a reunião.", options: { color: C.ink2 } }
    ], {
      x: 0.85, y: 5.85, w: W - 1.7, h: 0.85,
      fontSize: 14, fontFace: FONT_B, valign: "top", margin: 0
    });

    footer(s, 5);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 6 — MANDAMENTOS DO ZELL (CABEÇA)
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    miniZel(s);
    sectionEyebrow(s, "MENTALIDADE  ·  SAM ZELL");
    slideTitle(s, "Como o Zél pensa.");

    // 6 Zell pills (grid 2x3)
    const zellMandamentos = [
      { t: "Comece pelo downside", d: "Antes do upside, o que pode dar errado? Risco mora aí." },
      { t: "Caçe o desequilíbrio", d: "Demanda crescente + oferta parada = oportunidade." },
      { t: "Onde há escassez, preço não é problema", d: "Se ninguém faz, o cliente paga mais e você tem barreira." },
      { t: "Replacement cost manda", d: "Compare: trazer existente é quase sempre mais barato que desenvolver." },
      { t: "Liquidez = valor", d: "Lojista que tira fácil = ativo melhor. Trave o pior cenário." },
      { t: "If everyone goes left, look right", d: "Consenso é referência, não verdade. Olhe o que ninguém olha." },
    ];

    const cardW = 4.0, cardH = 1.75, gapX = 0.13, gapY = 0.13;
    const startX = 0.6, startY = 2.0;
    zellMandamentos.forEach((m, i) => {
      const col = i % 3, row = Math.floor(i / 3);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: cardH,
        fill: { color: C.paper }, line: { color: C.border, width: 1 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 0.06, h: cardH, fill: { color: C.zellblue }, line: { color: C.zellblue }
      });
      s.addText(`#${i + 1}`, {
        x: x + 0.2, y: y + 0.2, w: 0.6, h: 0.3,
        fontSize: 9, fontFace: FONT_B, color: C.zellblue,
        bold: true, charSpacing: 2, margin: 0
      });
      s.addText(m.t, {
        x: x + 0.2, y: y + 0.45, w: cardW - 0.4, h: 0.55,
        fontSize: 14, fontFace: FONT_H, color: C.ink,
        bold: true, italic: true, margin: 0
      });
      s.addText(m.d, {
        x: x + 0.2, y: y + 1.0, w: cardW - 0.4, h: 0.7,
        fontSize: 11, fontFace: FONT_B, color: C.ink2, margin: 0
      });
    });

    // Bottom note
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 5.95, w: W - 1.2, h: 0.85,
      fill: { color: C.ink }, line: { color: C.ink }
    });
    s.addText([
      { text: "ESTES PRINCÍPIOS VÃO DENTRO DO PROMPT  ", options: { color: C.accent, bold: true, charSpacing: 3 } },
      { text: "Eles dizem ao Zél COMO pensar antes de recomendar qualquer coisa.", options: { color: "FFFFFF" } }
    ], {
      x: 0.85, y: 6.1, w: W - 1.7, h: 0.55,
      fontSize: 13, fontFace: FONT_B, valign: "middle", margin: 0
    });

    footer(s, 6);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 7 — MANDAMENTOS DO LEVY (EXECUÇÃO)
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    miniZel(s);
    sectionEyebrow(s, "EXECUÇÃO  ·  ZÉ ROBERTO LEVY");
    slideTitle(s, "Como o Zél age na rua.");

    // 12 Levy mandamentos in compact list
    const levy = [
      { n: 1, t: "Sola de sapato", d: "Prospecção de rua e visita ao mercado." },
      { n: 2, t: "Concorrência mensal", d: "Monitora os shoppings concorrentes da praça." },
      { n: 3, t: "Cluster SP/Rio", d: "Olha shoppings do mesmo cluster em SP e Rio." },
      { n: 4, t: "Capitais vizinhas", d: "Marca local sai antes na vizinhança. Ex: Recife ↔ JP/Maceió." },
      { n: 5, t: "Base Allos (Bahia)", d: "Mapeia lojas dos shoppings das rotas que estão expandindo." },
      { n: 6, t: "Prospecção de rua", d: "Mapeia vias comerciais e multimarcas da praça." },
      { n: 7, t: "Multimarca = vetor", d: "Traz multimarca que carrega marca ainda sem shopping na praça." },
      { n: 8, t: "Multifranqueado é peça-chave", d: "Mapeia e oferece marcas que querem expandir pra região." },
      { n: 9, t: "Aquário em casa", d: "Almoço/café com lojista do shopping. Pescar no aquário > mar aberto." },
      { n: 10, t: "10 reuniões/semana", d: "Reunião é a peça-chave. Presença faz diferença." },
      { n: 11, t: "Status semanal Cia", d: "Acompanha relatório de assinado e aprovação na Cia." },
      { n: 12, t: "Vender ALLOS", d: "Todos vendem a Cia. Alavancar vendas." },
    ];

    // 4 columns x 3 rows
    const cardW = 3.05, cardH = 1.25, gapX = 0.1, gapY = 0.1;
    const startX = 0.6, startY = 1.85;
    levy.forEach((m, i) => {
      const col = i % 4, row = Math.floor(i / 4);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: cardH,
        fill: { color: C.paper }, line: { color: C.border, width: 1 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 0.06, h: cardH, fill: { color: C.levygreen }, line: { color: C.levygreen }
      });
      s.addText(`#${m.n}`, {
        x: x + 0.18, y: y + 0.12, w: 0.5, h: 0.25,
        fontSize: 9, fontFace: FONT_B, color: C.levygreen,
        bold: true, charSpacing: 2, margin: 0
      });
      s.addText(m.t, {
        x: x + 0.18, y: y + 0.32, w: cardW - 0.3, h: 0.35,
        fontSize: 12, fontFace: FONT_H, color: C.ink,
        bold: true, italic: true, margin: 0
      });
      s.addText(m.d, {
        x: x + 0.18, y: y + 0.65, w: cardW - 0.3, h: 0.55,
        fontSize: 10, fontFace: FONT_B, color: C.ink2, margin: 0
      });
    });

    // Bottom note
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 5.9, w: W - 1.2, h: 0.85,
      fill: { color: C.ink }, line: { color: C.ink }
    });
    s.addText([
      { text: "ESTES MANDAMENTOS VIRAM AS SKILLS DO ZÉL  ", options: { color: "10B981", bold: true, charSpacing: 3 } },
      { text: "Cada item da rua do Levy vira uma tarefa que o agente sabe rodar.", options: { color: "FFFFFF" } }
    ], {
      x: 0.85, y: 6.05, w: W - 1.7, h: 0.55,
      fontSize: 13, fontFace: FONT_B, valign: "middle", margin: 0
    });

    footer(s, 7);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 8 — ZELL VIRA CONTEXTO, LEVY VIRA SKILL
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    miniZel(s);
    sectionEyebrow(s, "A LÓGICA");
    slideTitle(s, "Zell vira contexto. Levy vira skill.");

    // Two big arrows / blocks
    const blockY = 2.0, blockH = 4.6;

    // Left: ZELL → CONTEXTO
    const lx = 0.6, lw = 6.0;
    s.addShape(pres.shapes.RECTANGLE, {
      x: lx, y: blockY, w: lw, h: blockH,
      fill: { color: C.bg }, line: { color: C.zellblue, width: 2 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: lx, y: blockY, w: lw, h: 0.55,
      fill: { color: C.zellblue }, line: { color: C.zellblue }
    });
    s.addImage({ data: icBino, x: lx + 0.3, y: blockY + 0.13, w: 0.3, h: 0.3 });
    s.addText("ZELL  →  CONTEXTO", {
      x: lx + 0.7, y: blockY + 0.13, w: lw - 1, h: 0.3,
      fontSize: 13, fontFace: FONT_B, color: "FFFFFF",
      bold: true, charSpacing: 3, margin: 0
    });
    s.addText("Como o Zél pensa.", {
      x: lx + 0.3, y: blockY + 0.8, w: lw - 0.6, h: 0.45,
      fontSize: 22, fontFace: FONT_H, color: C.ink,
      bold: true, italic: true, margin: 0
    });
    s.addText("A mentalidade do Zell vai dentro do prompt — instruções permanentes que valem pra toda resposta. Não é tarefa, é jeito de pensar.", {
      x: lx + 0.3, y: blockY + 1.35, w: lw - 0.6, h: 0.95,
      fontSize: 13, fontFace: FONT_B, color: C.ink2, margin: 0
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: lx + 0.3, y: blockY + 2.4, w: lw - 0.6, h: 1.95,
      fill: { color: C.paper }, line: { color: C.border, width: 1 }
    });
    s.addText("EXEMPLO NO PROMPT", {
      x: lx + 0.45, y: blockY + 2.5, w: lw - 0.9, h: 0.3,
      fontSize: 9, fontFace: FONT_B, color: C.zellblue,
      bold: true, charSpacing: 3, margin: 0
    });
    s.addText('"Antes de me recomendar um lojista, sempre me diga o que pode dar errado. E me mostre se há concorrência forte na praça pra essa categoria."', {
      x: lx + 0.45, y: blockY + 2.85, w: lw - 0.9, h: 1.4,
      fontSize: 12, fontFace: "Consolas", color: C.ink2,
      italic: true, margin: 0
    });

    // Right: LEVY → SKILL
    const rx = 6.85, rw = 6.0;
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: blockY, w: rw, h: blockH,
      fill: { color: C.bg }, line: { color: C.levygreen, width: 2 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: blockY, w: rw, h: 0.55,
      fill: { color: C.levygreen }, line: { color: C.levygreen }
    });
    s.addImage({ data: icWalk, x: rx + 0.3, y: blockY + 0.13, w: 0.3, h: 0.3 });
    s.addText("LEVY  →  SKILL", {
      x: rx + 0.7, y: blockY + 0.13, w: rw - 1, h: 0.3,
      fontSize: 13, fontFace: FONT_B, color: "FFFFFF",
      bold: true, charSpacing: 3, margin: 0
    });
    s.addText("O que o Zél faz.", {
      x: rx + 0.3, y: blockY + 0.8, w: rw - 0.6, h: 0.45,
      fontSize: 22, fontFace: FONT_H, color: C.ink,
      bold: true, italic: true, margin: 0
    });
    s.addText("Cada mandamento do Levy vira uma tarefa repetitiva que o agente sabe rodar. Tem input claro, output claro e frequência definida.", {
      x: rx + 0.3, y: blockY + 1.35, w: rw - 0.6, h: 0.95,
      fontSize: 13, fontFace: FONT_B, color: C.ink2, margin: 0
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx + 0.3, y: blockY + 2.4, w: rw - 0.6, h: 1.95,
      fill: { color: C.paper }, line: { color: C.border, width: 1 }
    });
    s.addText("EXEMPLO DE SKILL", {
      x: rx + 0.45, y: blockY + 2.5, w: rw - 0.9, h: 0.3,
      fontSize: 9, fontFace: FONT_B, color: C.levygreen,
      bold: true, charSpacing: 3, margin: 0
    });
    s.addText([
      { text: "Mandamento #4 (capitais vizinhas)  →  ", options: { color: C.levygreen, bold: true, breakLine: true } },
      { text: "Skill: \"Listar lojas que abriram nas capitais X e Y nos últimos 6 meses, na minha categoria-alvo, com presença digital e potencial de expansão.\"", options: { color: C.ink2, italic: true } },
    ], {
      x: rx + 0.45, y: blockY + 2.85, w: rw - 0.9, h: 1.4,
      fontSize: 12, fontFace: FONT_B, margin: 0
    });

    footer(s, 8);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 9 — DINÂMICA (REGRAS DA BRINCADEIRA)
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.ink };
    // Mini Zél in corner
    s.addImage({ data: zelData, x: W - 1.2, y: 0.3, w: 0.7, h: 0.91 });

    s.addText("DINÂMICA EM GRUPO  ·  60 MIN", {
      x: 0.6, y: 0.45, w: 8, h: 0.3,
      fontSize: 10, fontFace: FONT_B, color: C.accent,
      bold: true, charSpacing: 4, margin: 0
    });
    s.addText("Agora é sua vez. Constroi o Zél.", {
      x: 0.6, y: 0.8, w: 11, h: 0.9,
      fontSize: 36, fontFace: FONT_H, color: "FFFFFF",
      bold: true, italic: true, margin: 0
    });

    // 3-step process
    const steps = [
      { n: "1", time: "10 min", title: "Contexto", desc: "Pegue 3 mandamentos do Zell e transforme em instruções que vão no prompt do Zél. Use 1ª pessoa: \"você sempre…\", \"antes de recomendar…\"." },
      { n: "2", time: "25 min", title: "3 Skills", desc: "Pegue 3 mandamentos do Levy e vire skills. Pra cada uma: nome, input (o que precisa), output (o que entrega), frequência." },
      { n: "3", time: "15 min", title: "Teste no Claude.ai", desc: "Cole o contexto + uma skill no Claude. Peça pra rodar com um caso real do seu shopping. Se o output não serve, ajusta o prompt." },
    ];

    const sX = 0.6, sY = 2.05, sW = (W - 1.5) / 3, sGap = 0.15, sH = 3.7;
    steps.forEach((st, i) => {
      const x = sX + i * (sW + sGap);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: sY, w: sW, h: sH,
        fill: { color: "111827" }, line: { color: "374151", width: 1 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: sY, w: sW, h: 0.06, fill: { color: C.accent }, line: { color: C.accent }
      });
      // Big number
      s.addText(st.n, {
        x: x + 0.3, y: sY + 0.3, w: 1.2, h: 1.2,
        fontSize: 80, fontFace: FONT_H, color: C.accent,
        bold: true, italic: true, margin: 0
      });
      // Time badge
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + sW - 1.4, y: sY + 0.45, w: 1.1, h: 0.35,
        fill: { color: C.accent }, line: { color: C.accent }
      });
      s.addText(st.time, {
        x: x + sW - 1.4, y: sY + 0.45, w: 1.1, h: 0.35,
        fontSize: 10, fontFace: FONT_B, color: "FFFFFF",
        bold: true, align: "center", valign: "middle", charSpacing: 2, margin: 0
      });
      // Title
      s.addText(st.title, {
        x: x + 0.3, y: sY + 1.65, w: sW - 0.6, h: 0.6,
        fontSize: 28, fontFace: FONT_H, color: "FFFFFF",
        bold: true, italic: true, margin: 0
      });
      // Desc
      s.addText(st.desc, {
        x: x + 0.3, y: sY + 2.35, w: sW - 0.6, h: 1.3,
        fontSize: 13, fontFace: FONT_B, color: "D1D5DB", margin: 0
      });
    });

    // Rules of the game
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 5.95, w: W - 1.2, h: 1.0,
      fill: { color: "111827" }, line: { color: "374151", width: 1 }
    });
    s.addText("REGRAS DA BRINCADEIRA", {
      x: 0.85, y: 6.07, w: 5, h: 0.3,
      fontSize: 10, fontFace: FONT_B, color: C.accent,
      bold: true, charSpacing: 3, margin: 0
    });
    s.addText([
      { text: "📱 ", options: { color: "FFFFFF" } },
      { text: "WhatsApp do grupo só pro trabalho — sem bom dia, sem boa tarde.    ", options: { color: "D1D5DB" } },
      { text: "🤖 ", options: { color: "FFFFFF" } },
      { text: "Tudo no Claude.ai, todos juntos.    ", options: { color: "D1D5DB" } },
      { text: "📄 ", options: { color: "FFFFFF" } },
      { text: "Output é o documento, não o slide.    ", options: { color: "D1D5DB" } },
      { text: "⚡ ", options: { color: "FFFFFF" } },
      { text: "Tem que servir na segunda.", options: { color: "D1D5DB" } },
    ], {
      x: 0.85, y: 6.4, w: W - 1.7, h: 0.55,
      fontSize: 12, fontFace: FONT_B, valign: "middle", margin: 0
    });

    // No standard footer for this dark slide — done
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 10 — TEMPLATE DA DINÂMICA
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    miniZel(s);
    sectionEyebrow(s, "FOLHA DE TRABALHO  ·  USE ASSIM");
    slideTitle(s, "Modelo pra preencher.");

    // Left: contexto template
    const lx = 0.6, ly = 1.85, lw = 6.0, lh = 5.0;
    s.addShape(pres.shapes.RECTANGLE, {
      x: lx, y: ly, w: lw, h: lh,
      fill: { color: C.ink }, line: { color: C.ink }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: lx, y: ly, w: lw, h: 0.05, fill: { color: C.zellblue }, line: { color: C.zellblue }
    });
    s.addText("PARTE 1  ·  CONTEXTO  (10 min)", {
      x: lx + 0.3, y: ly + 0.2, w: lw - 0.6, h: 0.3,
      fontSize: 11, fontFace: FONT_B, color: C.accent,
      bold: true, charSpacing: 3, margin: 0
    });
    const promptL = [
      { text: "Você é o Zél, agente comercial do shopping ", options: { color: "E5E7EB" } },
      { text: "[NOME]", options: { color: C.accent, bold: true, breakLine: true } },
      { text: " ", options: { breakLine: true } },
      { text: "Sua missão é ", options: { color: "E5E7EB" } },
      { text: "[escreva em 1 frase]", options: { color: C.accent, bold: true, breakLine: true } },
      { text: " ", options: { breakLine: true } },
      { text: "Antes de recomendar qualquer coisa:", options: { color: "F59E0B", bold: true, breakLine: true } },
      { text: "1. ", options: { color: "9CA3AF" } },
      { text: "[mandamento Zell #__]", options: { color: C.accent, breakLine: true } },
      { text: "2. ", options: { color: "9CA3AF" } },
      { text: "[mandamento Zell #__]", options: { color: C.accent, breakLine: true } },
      { text: "3. ", options: { color: "9CA3AF" } },
      { text: "[mandamento Zell #__]", options: { color: C.accent, breakLine: true } },
      { text: " ", options: { breakLine: true } },
      { text: "Você responde sempre em 3 partes:", options: { color: "F59E0B", bold: true, breakLine: true } },
      { text: "Análise · Dado · Recomendação", options: { color: "D1D5DB" } },
    ];
    s.addText(promptL, {
      x: lx + 0.3, y: ly + 0.6, w: lw - 0.6, h: lh - 0.8,
      fontSize: 13, fontFace: "Consolas", margin: 0, valign: "top", paraSpaceAfter: 4
    });

    // Right: skills template
    const rx = 6.85, ry = 1.85, rw = 6.0, rh = 5.0;
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: ry, w: rw, h: rh,
      fill: { color: C.paper }, line: { color: C.border, width: 1 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: ry, w: rw, h: 0.05, fill: { color: C.levygreen }, line: { color: C.levygreen }
    });
    s.addText("PARTE 2  ·  3 SKILLS  (25 min)", {
      x: rx + 0.3, y: ry + 0.2, w: rw - 0.6, h: 0.3,
      fontSize: 11, fontFace: FONT_B, color: C.levygreen,
      bold: true, charSpacing: 3, margin: 0
    });
    s.addText("Pra cada mandamento Levy escolhido, preencha:", {
      x: rx + 0.3, y: ry + 0.55, w: rw - 0.6, h: 0.3,
      fontSize: 12, fontFace: FONT_B, color: C.muted,
      italic: true, margin: 0
    });

    // 4 fields
    const fields = [
      { label: "NOME DA SKILL", hint: "Verbo + objeto. Ex: \"Mapear multimarcas da praça\"" },
      { label: "INPUT", hint: "O que o Zél precisa receber pra rodar?" },
      { label: "OUTPUT", hint: "O que ele entrega de volta? Que formato?" },
      { label: "FREQUÊNCIA", hint: "Diária / semanal / mensal / sob demanda?" },
    ];
    fields.forEach((f, i) => {
      const fy = ry + 1.0 + i * 0.92;
      s.addText(f.label, {
        x: rx + 0.3, y: fy, w: rw - 0.6, h: 0.28,
        fontSize: 10, fontFace: FONT_B, color: C.levygreen,
        bold: true, charSpacing: 2, margin: 0
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: rx + 0.3, y: fy + 0.32, w: rw - 0.6, h: 0.5,
        fill: { color: C.bg }, line: { color: C.border, width: 0.75 }
      });
      s.addText(f.hint, {
        x: rx + 0.4, y: fy + 0.32, w: rw - 0.8, h: 0.5,
        fontSize: 11, fontFace: FONT_B, color: C.muted,
        italic: true, valign: "middle", margin: 0
      });
    });

    footer(s, 10);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 11 — EXEMPLO RESOLVIDO
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    miniZel(s);
    sectionEyebrow(s, "EXEMPLO PRONTO  ·  PRA TIRAR DÚVIDA");
    slideTitle(s, "Mandamento #4 do Levy, resolvido.");

    // Top: the mandamento itself
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 1.85, w: W - 1.2, h: 1.0,
      fill: { color: C.paper }, line: { color: C.levygreen, width: 1 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 1.85, w: 0.08, h: 1.0,
      fill: { color: C.levygreen }, line: { color: C.levygreen }
    });
    s.addText("MANDAMENTO LEVY #4", {
      x: 0.85, y: 1.97, w: 6, h: 0.3,
      fontSize: 10, fontFace: FONT_B, color: C.levygreen,
      bold: true, charSpacing: 3, margin: 0
    });
    s.addText('"Acompanhar o mercado das capitais mais próximas. Marca local sai antes nas vizinhanças. Recife → JP/Maceió. BH → SP/Rio/Brasília."', {
      x: 0.85, y: 2.27, w: W - 1.7, h: 0.55,
      fontSize: 14, fontFace: FONT_H, color: C.ink,
      italic: true, valign: "middle", margin: 0
    });

    // Skill table
    const tx = 0.6, ty = 3.1, tw = W - 1.2, tRowH = 0.85;
    const rows = [
      { label: "NOME", value: "Radar de capital vizinha" },
      { label: "INPUT", value: "Cidade do shopping + categoria-alvo + 2 capitais de referência" },
      { label: "OUTPUT", value: "Lista de marcas/lojas que abriram nas capitais de referência nos últimos 6 meses, com endereço, presença digital, sinal de expansão e nota de fit." },
      { label: "FREQUÊNCIA", value: "Mensal — primeira semana do mês" },
    ];
    rows.forEach((r, i) => {
      const y = ty + i * tRowH;
      const fill = i % 2 === 0 ? C.paper : C.bg;
      s.addShape(pres.shapes.RECTANGLE, {
        x: tx, y, w: tw, h: tRowH,
        fill: { color: fill }, line: { color: C.border, width: 0.5 }
      });
      // Label cell
      s.addShape(pres.shapes.RECTANGLE, {
        x: tx, y, w: 2.4, h: tRowH,
        fill: { color: C.ink }, line: { color: C.ink }
      });
      s.addText(r.label, {
        x: tx + 0.25, y: y + 0.05, w: 2.1, h: tRowH - 0.1,
        fontSize: 11, fontFace: FONT_B, color: C.accent,
        bold: true, charSpacing: 3, valign: "middle", margin: 0
      });
      s.addText(r.value, {
        x: tx + 2.65, y: y + 0.05, w: tw - 2.8, h: tRowH - 0.1,
        fontSize: 13, fontFace: FONT_B, color: C.ink2,
        valign: "middle", margin: 0
      });
    });

    // Bottom: the prompt to actually run
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 6.55, w: W - 1.2, h: 0.45,
      fill: { color: C.amberlight }, line: { color: "F59E0B", width: 0.5 }
    });
    s.addText([
      { text: "💡 PROMPT PRO CLAUDE: ", options: { color: C.accent, bold: true, charSpacing: 2 } },
      { text: "\"Rode a skill 'Radar de capital vizinha' pra Boulevard BH, categoria moda fitness, referências SP e Rio.\"", options: { color: C.ink, italic: true } }
    ], {
      x: 0.85, y: 6.55, w: W - 1.7, h: 0.45,
      fontSize: 12, fontFace: FONT_B, valign: "middle", margin: 0
    });

    footer(s, 11);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 12 — SKILLS SUGERIDAS (do Levy → Zél)
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    miniZel(s);
    sectionEyebrow(s, "SKILLS PRONTAS  ·  PARA INSPIRAÇÃO");
    slideTitle(s, "6 skills que o Zél já sabe rodar.");

    const skills = [
      { id: "S1", name: "Radar de Capital Vizinha", desc: "Mapeia o que abriu em cidades de referência. Mensal.", origin: "Levy #4", icon: icMap },
      { id: "S2", name: "Cluster SP-Rio", desc: "Lista lojas dos shoppings cluster em rota de expansão.", origin: "Levy #3, #5", icon: icBino },
      { id: "S3", name: "Sola de Sapato Digital", desc: "Mapeia vias comerciais e multimarcas da praça.", origin: "Levy #1, #6", icon: icWalk },
      { id: "S4", name: "Aquário do Lojista", desc: "Lista lojistas atuais com potencial de novas operações.", origin: "Levy #9", icon: icCoffee },
      { id: "S5", name: "Rastreador de Multifranqueado", desc: "Mapeia multifranqueados e marcas que querem a região.", origin: "Levy #7, #8", icon: icUsers },
      { id: "S6", name: "Pipeline 10×Semana", desc: "Consolida pipeline e cobra meta de 10 reuniões.", origin: "Levy #10, #11", icon: icRep },
    ];

    const cardW = 4.0, cardH = 2.3, gapX = 0.13, gapY = 0.13;
    const startX = 0.6, startY = 1.85;
    skills.forEach((sk, i) => {
      const col = i % 3, row = Math.floor(i / 3);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: cardH,
        fill: { color: C.bg }, line: { color: C.border, width: 1 },
        shadow: cardShadow()
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.06, fill: { color: C.accent }, line: { color: C.accent }
      });
      // Icon
      s.addImage({ data: sk.icon, x: x + 0.3, y: y + 0.25, w: 0.45, h: 0.45 });
      // ID
      s.addText(sk.id, {
        x: x + cardW - 0.9, y: y + 0.22, w: 0.7, h: 0.4,
        fontSize: 22, fontFace: FONT_H, color: C.accent,
        bold: true, italic: true, align: "right", margin: 0
      });
      // Name
      s.addText(sk.name, {
        x: x + 0.3, y: y + 0.82, w: cardW - 0.6, h: 0.55,
        fontSize: 14, fontFace: FONT_H, color: C.ink,
        bold: true, italic: true, margin: 0
      });
      // Desc
      s.addText(sk.desc, {
        x: x + 0.3, y: y + 1.35, w: cardW - 0.6, h: 0.5,
        fontSize: 10.5, fontFace: FONT_B, color: C.ink2, margin: 0
      });
      // Origin badge — bottom
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.3, y: y + cardH - 0.35, w: 1.5, h: 0.25,
        fill: { color: C.levygreen }, line: { color: C.levygreen }
      });
      s.addText(`Origem: ${sk.origin}`, {
        x: x + 0.3, y: y + cardH - 0.35, w: 1.5, h: 0.25,
        fontSize: 8, fontFace: FONT_B, color: "FFFFFF",
        bold: true, align: "center", valign: "middle", charSpacing: 1, margin: 0
      });
    });

    // Bottom note
    s.addText("As skills do seu grupo não precisam ser estas. Use como inspiração — invente as suas.", {
      x: 0.6, y: 6.7, w: W - 1.2, h: 0.25,
      fontSize: 11, fontFace: FONT_H, color: C.muted,
      italic: true, align: "center", margin: 0
    });

    footer(s, 12);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 13 — D0
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    miniZel(s);
    sectionEyebrow(s, "ENTREGÁVEL  ·  O QUE A EQUIPE FAZ NA SEGUNDA");
    slideTitle(s, "Plano D0.");

    const days = [
      {
        day: "DIA 1", title: "Ligar o Zél",
        items: [
          "Conta no Claude.ai (free)",
          "Abrir Projeto e colar o contexto",
          "Preencher: nome do shopping, categorias-alvo",
          "Testar 1 skill com caso real",
          "Validar se faz sentido"
        ]
      },
      {
        day: "DIA 2", title: "Primeira lista",
        items: [
          "Rodar 2 skills (uma de mapa, uma de qualificação)",
          "Pegar os 5 melhores resultados",
          "Pedir pro Zél fazer o script de abordagem",
          "Mostrar pro gestor",
          "Ajustar se precisar"
        ]
      },
      {
        day: "DIA 3", title: "Sola de sapato",
        items: [
          "WhatsApp pros 3 prospects validados",
          "Anotar quem respondeu (sim/não/nada)",
          "Devolver pro Zél: o que funcionou?",
          "Agendar reuniões",
          "Meta da semana: 10 (mandamento Levy #10)"
        ]
      },
    ];

    const cardW = 4.0, gap = 0.27;
    const totalW = cardW * 3 + gap * 2;
    const startX = (W - totalW) / 2;

    days.forEach((d, i) => {
      const x = startX + i * (cardW + gap);
      const y = 1.95;
      const cardH = 4.85;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: cardH,
        fill: { color: C.bg }, line: { color: C.border, width: 1 },
        shadow: cardShadow()
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 1.0,
        fill: { color: C.ink }, line: { color: C.ink }
      });
      s.addImage({
        data: icCal, x: x + 0.3, y: y + 0.25, w: 0.5, h: 0.5
      });
      s.addText(d.day, {
        x: x + 0.95, y: y + 0.18, w: cardW - 1.1, h: 0.35,
        fontSize: 10, fontFace: FONT_B, color: C.accent,
        bold: true, charSpacing: 4, margin: 0
      });
      s.addText(d.title, {
        x: x + 0.95, y: y + 0.5, w: cardW - 1.1, h: 0.45,
        fontSize: 18, fontFace: FONT_H, color: "FFFFFF",
        bold: true, italic: true, margin: 0
      });
      const items = d.items.map((it, idx) => ({
        text: it,
        options: {
          bullet: { type: "number" },
          breakLine: idx < d.items.length - 1,
          color: C.ink2
        }
      }));
      s.addText(items, {
        x: x + 0.4, y: y + 1.25, w: cardW - 0.6, h: cardH - 1.4,
        fontSize: 12.5, fontFace: FONT_B,
        paraSpaceAfter: 6, valign: "top", margin: 0
      });
    });

    footer(s, 13);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 14 — FECHAMENTO COM ZÉL
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.ink };

    // Zél on left (clean image)
    s.addImage({
      data: zelData, x: 1.0, y: 1.4, w: 3.6, h: 4.68
    });
    s.addText("ZÉL", {
      x: 1.0, y: 6.15, w: 3.6, h: 0.4,
      fontSize: 22, fontFace: FONT_H, color: C.accent,
      bold: true, italic: true, align: "center", margin: 0
    });

    // Right: quote + sign-off
    s.addText("BORA?", {
      x: 5.0, y: 1.4, w: 7.5, h: 0.4,
      fontSize: 12, fontFace: FONT_B, color: C.accent,
      bold: true, charSpacing: 5, margin: 0
    });

    s.addText(
      "\"Não tem segredo.\nÉ presença.\"",
      {
        x: 5.0, y: 1.9, w: 7.5, h: 2.0,
        fontSize: 48, fontFace: FONT_H, color: "FFFFFF",
        italic: true, bold: true, margin: 0
      }
    );
    s.addText("ZÉ ROBERTO LEVY  ·  MANDAMENTO #10", {
      x: 5.0, y: 4.0, w: 7.5, h: 0.3,
      fontSize: 10, fontFace: FONT_B, color: "9CA3AF",
      charSpacing: 3, margin: 0
    });

    s.addShape(pres.shapes.LINE, {
      x: 5.0, y: 4.7, w: 1.5, h: 0,
      line: { color: C.accent, width: 2 }
    });

    s.addText("O Zell te diz como pensar.\nO Levy te diz como agir.\nO Zél tá aqui pra fazer os dois nascerem juntos.", {
      x: 5.0, y: 4.95, w: 7.8, h: 1.4,
      fontSize: 18, fontFace: FONT_H, color: "E5E7EB",
      italic: true, margin: 0
    });

    // Bottom strip
    s.addShape(pres.shapes.LINE, {
      x: 0.6, y: H - 0.5, w: W - 1.2, h: 0,
      line: { color: "374151", width: 0.75 }
    });
    s.addText("WORKSHOP IA  ·  HUNTER  ·  ZÉL", {
      x: 0.6, y: H - 0.4, w: 6, h: 0.3,
      fontSize: 9, fontFace: FONT_B, color: "6B7280",
      charSpacing: 4, margin: 0
    });
    s.addText("Construído com Claude.ai", {
      x: W - 4, y: H - 0.4, w: 3.4, h: 0.3,
      fontSize: 9, fontFace: FONT_B, color: "6B7280",
      align: "right", margin: 0
    });
  }

  await pres.writeFile({ fileName: "/home/claude/hunter/zel_v2.pptx" });
  console.log("Created.");
})();
