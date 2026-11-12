// Workshop IA · Agente Hunter — Sóbrio corporativo
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

const {
  FaSearchLocation, FaChartBar, FaUserCheck, FaCommentDots, FaBalanceScale, FaClipboardList,
  FaBullseye, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaArrowRight,
  FaCogs, FaHandshake, FaBuilding, FaTools, FaQuoteLeft, FaCalendarAlt, FaRobot
} = require("react-icons/fa");

// ─── Palette: Charcoal / sage / amber accent (sóbrio corporativo) ───
const C = {
  bg: "FFFFFF",
  ink: "1F2A37",        // dark charcoal
  ink2: "374151",
  muted: "6B7280",
  light: "F3F4F6",
  border: "E5E7EB",
  accent: "B45309",      // amber/copper — sóbrio
  accent2: "065F46",     // forest green
  navy: "1E3A5F",
  paper: "FAFAF9",
  red: "991B1B",
  green: "166534",
  amberlight: "FEF3C7",
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

// ─── Fresh shadow factory (avoid mutation bug) ───
const cardShadow = () => ({ type: "outer", blur: 8, offset: 2, color: "000000", opacity: 0.08, angle: 90 });

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.3 × 7.5
  pres.title = "Agente Hunter — Workshop IA Shopping";
  pres.author = "Workshop interno";

  const W = 13.333, H = 7.5;

  // Pre-render icons used multiple times
  const icHunter = await icon(FaSearchLocation, C.accent);
  const icMap = await icon(FaSearchLocation, C.accent);
  const icScore = await icon(FaChartBar, C.accent);
  const icQual = await icon(FaUserCheck, C.accent);
  const icScript = await icon(FaCommentDots, C.accent);
  const icRC = await icon(FaBalanceScale, C.accent);
  const icRep = await icon(FaClipboardList, C.accent);
  const icBull = await icon(FaBullseye, C.accent2);
  const icOK = await icon(FaCheckCircle, C.green);
  const icWarn = await icon(FaExclamationTriangle, "B45309");
  const icNo = await icon(FaTimesCircle, C.red);
  const icArrow = await icon(FaArrowRight, C.muted);
  const icCog = await icon(FaCogs, C.accent);
  const icHand = await icon(FaHandshake, C.accent);
  const icBld = await icon(FaBuilding, C.accent);
  const icTools = await icon(FaTools, C.accent);
  const icQuote = await icon(FaQuoteLeft, "FFFFFF");
  const icCal = await icon(FaCalendarAlt, C.accent);
  const icRobot = await icon(FaRobot, C.accent);

  // ───────────────────────── HELPERS ─────────────────────────
  const sectionEyebrow = (slide, text) => {
    slide.addText(text, {
      x: 0.6, y: 0.45, w: 6, h: 0.3,
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
  const footer = (slide, num, total = 12) => {
    slide.addShape(pres.shapes.LINE, {
      x: 0.6, y: H - 0.4, w: W - 1.2, h: 0,
      line: { color: C.border, width: 0.75 }
    });
    slide.addText("Workshop IA · Agente Hunter", {
      x: 0.6, y: H - 0.32, w: 6, h: 0.25,
      fontSize: 9, fontFace: FONT_B, color: C.muted, margin: 0
    });
    slide.addText(`${num} / ${total}`, {
      x: W - 1.6, y: H - 0.32, w: 1, h: 0.25,
      fontSize: 9, fontFace: FONT_B, color: C.muted, align: "right", margin: 0
    });
  };

  // ═══════════════════════════════════════════════════════════
  // SLIDE 1 — COVER
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.ink };

    // Left accent block
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 0.4, h: H, fill: { color: C.accent }, line: { color: C.accent }
    });

    // Eyebrow
    s.addText("WORKSHOP INTERNO  ·  IA + SHOPPING", {
      x: 1.2, y: 1.3, w: 10, h: 0.4,
      fontSize: 12, fontFace: FONT_B, color: "D1D5DB",
      bold: true, charSpacing: 6, margin: 0
    });

    // Mega title
    s.addText("Agente Hunter", {
      x: 1.2, y: 1.9, w: 11, h: 1.5,
      fontSize: 72, fontFace: FONT_H, color: "FFFFFF",
      bold: true, italic: true, margin: 0
    });

    // Sub
    s.addText("Prospecção, qualificação e primeiro contato com lojistas — dentro e fora de shoppings.", {
      x: 1.2, y: 3.55, w: 9.5, h: 0.7,
      fontSize: 18, fontFace: FONT_B, color: "E5E7EB", margin: 0
    });

    // Divider
    s.addShape(pres.shapes.LINE, {
      x: 1.2, y: 4.6, w: 4, h: 0,
      line: { color: C.accent, width: 2 }
    });

    // Meta
    const meta = [
      ["Foco", "Agente Hunter"],
      ["Referência", "Sam Zell"],
      ["Ferramenta", "Claude.ai"],
      ["Output", "Lista D0"],
    ];
    meta.forEach((m, i) => {
      const x = 1.2 + i * 2.8;
      s.addText(m[0].toUpperCase(), {
        x, y: 5.0, w: 2.6, h: 0.3,
        fontSize: 10, fontFace: FONT_B, color: C.accent,
        bold: true, charSpacing: 4, margin: 0
      });
      s.addText(m[1], {
        x, y: 5.3, w: 2.6, h: 0.4,
        fontSize: 16, fontFace: FONT_H, color: "FFFFFF",
        bold: true, margin: 0
      });
    });

    // Bottom strip
    s.addText("MATERIAL DE USO INTERNO", {
      x: 1.2, y: H - 0.7, w: 6, h: 0.3,
      fontSize: 9, fontFace: FONT_B, color: "9CA3AF",
      charSpacing: 5, margin: 0
    });
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 2 — POR QUE ESTAMOS AQUI (Objetivos)
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    sectionEyebrow(s, "POR QUE ESTAMOS AQUI");
    slideTitle(s, "O que precisa sair deste workshop");

    const items = [
      {
        n: "01",
        title: "Nivelar IA na prática",
        desc: "Sair do workshop sabendo usar uma ferramenta de IA, escrever um prompt útil e entender o que um agente pode (e não pode) fazer no dia a dia comercial."
      },
      {
        n: "02",
        title: "Construir o Agente Hunter",
        desc: "Agente desenhado, com contexto real, skills detalhadas e lista D0 — pronto para a equipe do shopping usar na semana seguinte ao workshop."
      },
    ];

    items.forEach((it, i) => {
      const y = 2.0 + i * 2.3;
      // Card
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.6, y, w: W - 1.2, h: 1.9,
        fill: { color: C.paper }, line: { color: C.border, width: 1 }
      });
      // Accent
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.6, y, w: 0.08, h: 1.9,
        fill: { color: C.accent }, line: { color: C.accent }
      });
      // Number — moved further right, narrower, and as background
      s.addText(it.n, {
        x: 0.85, y: y + 0.1, w: 1.5, h: 1.7,
        fontSize: 72, fontFace: FONT_H, color: "E5E7EB",
        bold: true, italic: true, margin: 0, valign: "middle", align: "center"
      });
      // Title — pushed right to avoid number
      s.addText(it.title, {
        x: 2.6, y: y + 0.35, w: 9, h: 0.55,
        fontSize: 24, fontFace: FONT_H, color: C.ink,
        bold: true, margin: 0
      });
      // Desc
      s.addText(it.desc, {
        x: 2.6, y: y + 0.95, w: 9.5, h: 0.85,
        fontSize: 14, fontFace: FONT_B, color: C.ink2, margin: 0
      });
    });

    footer(s, 2);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 3 — IA EM 3 CONCEITOS
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    sectionEyebrow(s, "NIVELAMENTO");
    slideTitle(s, "IA, em 3 conceitos.");

    const cards = [
      {
        tag: "CONCEITO 1",
        title: "LLM",
        sub: "O modelo",
        body: "Modelo treinado em bilhões de textos. Não pensa — prediz o próximo token com base no contexto. A qualidade do output depende da qualidade do input."
      },
      {
        tag: "CONCEITO 2",
        title: "Prompt",
        sub: "A instrução",
        body: "Tudo começa aqui. Define quem é o agente, o que ele sabe, o que deve fazer e como deve responder. Lixo entra, lixo sai."
      },
      {
        tag: "CONCEITO 3",
        title: "Agente",
        sub: "A automação",
        body: "Combina modelo + contexto + ferramentas + memória. Executa tarefas repetitivas, toma decisões simples e integra com outros sistemas."
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
        fontSize: 10, fontFace: FONT_B, color: C.accent,
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
      { text: "Ferramenta do workshop:  ", options: { bold: true, color: C.accent } },
      { text: "Claude.ai (Anthropic). Todos criam conta free. Construção dos agentes em modo Projeto com contexto persistente.", options: { color: C.ink } }
    ], {
      x: 1.4, y: 6.27, w: W - 2, h: 0.55,
      fontSize: 13, fontFace: FONT_B, valign: "middle", margin: 0
    });

    footer(s, 3);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 4 — MISSÃO DO HUNTER
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    sectionEyebrow(s, "AGENTE HUNTER");
    slideTitle(s, "Missão.");

    // Big quote-like statement
    s.addShape(pres.shapes.LINE, {
      x: 0.6, y: 1.85, w: 1.5, h: 0,
      line: { color: C.accent, width: 3 }
    });
    s.addText(
      "Identificar, qualificar e iniciar o contato com lojistas com potencial de ocupação — em operação em outros shoppings ou fora deles — num raio de 2 a 50 km da unidade.",
      {
        x: 0.6, y: 2.05, w: 8.5, h: 2.2,
        fontSize: 24, fontFace: FONT_H, color: C.ink,
        italic: true, margin: 0, valign: "top"
      }
    );

    // Right side: 3 stat blocks (tighter spacing to clear the bottom card)
    const stats = [
      { num: "6", label: "Skills operacionais" },
      { num: "2–50", label: "Quilômetros de raio" },
      { num: "D0", label: "Output utilizável" },
    ];
    stats.forEach((st, i) => {
      const x = 9.5;
      const y = 1.95 + i * 1.05;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 0.04, h: 0.95, fill: { color: C.accent }, line: { color: C.accent }
      });
      s.addText(st.num, {
        x: x + 0.2, y: y - 0.05, w: 3.0, h: 0.65,
        fontSize: 38, fontFace: FONT_H, color: C.ink,
        bold: true, italic: true, margin: 0
      });
      s.addText(st.label, {
        x: x + 0.2, y: y + 0.6, w: 3.0, h: 0.35,
        fontSize: 12, fontFace: FONT_B, color: C.muted,
        charSpacing: 2, margin: 0
      });
    });

    // Bottom — what it produces
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 5.4, w: W - 1.2, h: 1.4,
      fill: { color: C.paper }, line: { color: C.border, width: 1 }
    });
    s.addText("O QUE O HUNTER ENTREGA", {
      x: 0.85, y: 5.55, w: 12, h: 0.3,
      fontSize: 10, fontFace: FONT_B, color: C.accent,
      bold: true, charSpacing: 4, margin: 0
    });
    s.addText([
      { text: "Lista ranqueada de prospects", options: { bold: true, color: C.ink } },
      { text: "  com score de fit de mix, dados de contato, perfil operacional resumido e próximo passo recomendado — pronta para a equipe acionar.", options: { color: C.ink2 } }
    ], {
      x: 0.85, y: 5.85, w: W - 1.7, h: 0.85,
      fontSize: 15, fontFace: FONT_B, valign: "top", margin: 0
    });

    footer(s, 4);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 5 — SYSTEM PROMPT (CONTEXTO)
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    sectionEyebrow(s, "BLOCO 1 · CONTEXTO DO AGENTE");
    slideTitle(s, "O prompt que define tudo.");

    // Code-like card
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 1.85, w: 8.0, h: 5.15,
      fill: { color: C.ink }, line: { color: C.ink }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 1.85, w: 8.0, h: 0.05, fill: { color: C.accent }, line: { color: C.accent }
    });
    s.addText("SYSTEM PROMPT — AGENTE HUNTER", {
      x: 0.85, y: 2.0, w: 7.5, h: 0.3,
      fontSize: 10, fontFace: FONT_B, color: C.accent,
      bold: true, charSpacing: 4, margin: 0
    });

    const prompt = [
      { text: "Você é ", options: { color: "F59E0B", bold: true } },
      { text: "Zél, agente Hunter de prospecção comercial do shopping [NOME].", options: { color: "E5E7EB", breakLine: true } },
      { text: " ", options: { breakLine: true } },
      { text: "Missão: ", options: { color: "F59E0B", bold: true } },
      { text: "Identificar, qualificar e iniciar contato com lojistas — em operação em outros shoppings ou fora deles — num raio de 2 a 50 km.", options: { color: "E5E7EB", breakLine: true } },
      { text: " ", options: { breakLine: true } },
      { text: "Você conhece:", options: { color: "F59E0B", bold: true, breakLine: true } },
      { text: "– Mix atual do shopping: presentes, ausentes, saturados", options: { color: "D1D5DB", breakLine: true } },
      { text: "– Área de influência: renda, densidade, concorrentes", options: { color: "D1D5DB", breakLine: true } },
      { text: "– Critérios: fit de mix, saúde financeira, sinais de expansão", options: { color: "D1D5DB", breakLine: true } },
      { text: " ", options: { breakLine: true } },
      { text: "Lógica de análise (Sam Zell):", options: { color: "F59E0B", bold: true, breakLine: true } },
      { text: "– Comece pelo downside: o que pode dar errado?", options: { color: "D1D5DB", breakLine: true } },
      { text: "– Busque o desequilíbrio oferta × demanda", options: { color: "D1D5DB", breakLine: true } },
      { text: "– Replacement cost: atrair x desenvolver?", options: { color: "D1D5DB", breakLine: true } },
      { text: "– Não suponha — busque dado antes de recomendar", options: { color: "D1D5DB", breakLine: true } },
      { text: " ", options: { breakLine: true } },
      { text: "Formato de resposta:", options: { color: "F59E0B", bold: true, breakLine: true } },
      { text: "1. Análise objetiva  2. Dado/evidência  3. Recomendação", options: { color: "D1D5DB" } },
    ];
    s.addText(prompt, {
      x: 0.85, y: 2.35, w: 7.5, h: 4.5,
      fontSize: 11.5, fontFace: "Consolas", margin: 0, valign: "top"
    });

    // Right — Zell pills
    s.addText("PRINCÍPIOS ZELL APLICADOS", {
      x: 8.85, y: 1.95, w: 4.2, h: 0.3,
      fontSize: 10, fontFace: FONT_B, color: C.muted,
      bold: true, charSpacing: 4, margin: 0
    });
    const pills = [
      { t: "Oferta × Demanda", d: "A oportunidade está no desequilíbrio. Categorias com demanda crescente e oferta parada." },
      { t: "Downside First", d: "Antes de qualificar, mapear o que pode dar errado com aquele lojista." },
      { t: "Replacement Cost", d: "Comparar: trazer existente ou desenvolver novo? Provado quase sempre vence." },
      { t: "Competição Limitada", d: "Priorizar categorias onde o shopping pode ter posição dominante ou única." },
    ];
    pills.forEach((p, i) => {
      const y = 2.35 + i * 1.15;
      s.addShape(pres.shapes.RECTANGLE, {
        x: 8.85, y, w: 4.0, h: 1.0,
        fill: { color: C.paper }, line: { color: C.border, width: 1 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: 8.85, y, w: 0.06, h: 1.0, fill: { color: C.accent }, line: { color: C.accent }
      });
      s.addText(p.t, {
        x: 9.05, y: y + 0.1, w: 3.7, h: 0.3,
        fontSize: 13, fontFace: FONT_H, color: C.ink, bold: true, margin: 0
      });
      s.addText(p.d, {
        x: 9.05, y: y + 0.4, w: 3.7, h: 0.55,
        fontSize: 11, fontFace: FONT_B, color: C.ink2, margin: 0
      });
    });

    footer(s, 5);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 6 — SKILLS (TABELA)
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    sectionEyebrow(s, "BLOCO 2 · SKILLS DETALHADAS");
    slideTitle(s, "6 skills, 1 pipeline.");

    const skills = [
      { id: "S1", name: "Mapeamento de Raio", input: "Endereço + raio (2/10/50km) + categorias-alvo", output: "Lista de negócios com nome, endereço, categoria, avaliação", freq: "Semanal", freqColor: "166534" },
      { id: "S2", name: "Score de Fit com Mix", input: "Dados do prospect + mix atual do shopping", output: "Nota 1–10 com justificativa: gaps, canibalização, posição", freq: "Sob demanda", freqColor: C.accent },
      { id: "S3", name: "Qualificação de Lojista", input: "Nome do negócio, CNPJ ou endereço", output: "Perfil: tempo, presença digital, faturamento estimado, sinais", freq: "Sob demanda", freqColor: C.accent },
      { id: "S4", name: "Script de Abordagem", input: "Perfil qualificado + canal (WhatsApp/ligação/e-mail)", output: "Script direto, sem jargão, adaptado ao perfil. Variação por canal.", freq: "Sob demanda", freqColor: C.accent },
      { id: "S5", name: "Análise Replacement Cost", input: "Categoria + espaço + histórico de lojas similares", output: "Comparativo custo/risco atrair vs desenvolver. Recomendação.", freq: "Mensal", freqColor: "1E3A8A" },
      { id: "S6", name: "Relatório de Pipeline", input: "Base atualizada de contatos da semana", output: "Lista por estágio: Identificado / Contatado / Negociação / Descartado", freq: "Semanal", freqColor: "166534" },
    ];

    // Header row
    const headerY = 1.95;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: headerY, w: W - 1.2, h: 0.45,
      fill: { color: C.ink }, line: { color: C.ink }
    });
    const cols = [
      { x: 0.6, w: 0.6, label: "#" },
      { x: 1.2, w: 2.5, label: "SKILL" },
      { x: 3.7, w: 4.0, label: "INPUT" },
      { x: 7.7, w: 4.2, label: "OUTPUT" },
      { x: 11.9, w: 1.2, label: "FREQ." },
    ];
    cols.forEach(c => {
      s.addText(c.label, {
        x: c.x + 0.15, y: headerY + 0.08, w: c.w - 0.2, h: 0.3,
        fontSize: 10, fontFace: FONT_B, color: "FFFFFF",
        bold: true, charSpacing: 3, margin: 0
      });
    });

    // Skill rows
    const rowH = 0.7;
    skills.forEach((sk, i) => {
      const y = headerY + 0.45 + i * rowH;
      // Alternating fill
      if (i % 2 === 0) {
        s.addShape(pres.shapes.RECTANGLE, {
          x: 0.6, y, w: W - 1.2, h: rowH,
          fill: { color: C.paper }, line: { color: C.border, width: 0.5 }
        });
      } else {
        s.addShape(pres.shapes.RECTANGLE, {
          x: 0.6, y, w: W - 1.2, h: rowH,
          fill: { color: C.bg }, line: { color: C.border, width: 0.5 }
        });
      }
      // ID
      s.addText(sk.id, {
        x: 0.75, y: y + 0.1, w: 0.5, h: 0.5,
        fontSize: 18, fontFace: FONT_H, color: C.accent,
        bold: true, italic: true, margin: 0, valign: "middle"
      });
      // Name
      s.addText(sk.name, {
        x: 1.25, y: y + 0.05, w: 2.4, h: rowH - 0.1,
        fontSize: 13, fontFace: FONT_B, color: C.ink,
        bold: true, margin: 0, valign: "middle"
      });
      // Input
      s.addText(sk.input, {
        x: 3.75, y: y + 0.05, w: 3.9, h: rowH - 0.1,
        fontSize: 11, fontFace: FONT_B, color: C.ink2,
        margin: 0, valign: "middle"
      });
      // Output
      s.addText(sk.output, {
        x: 7.75, y: y + 0.05, w: 4.1, h: rowH - 0.1,
        fontSize: 11, fontFace: FONT_B, color: C.ink2,
        margin: 0, valign: "middle"
      });
      // Freq badge
      s.addShape(pres.shapes.RECTANGLE, {
        x: 11.95, y: y + 0.18, w: 1.1, h: 0.34,
        fill: { color: sk.freqColor }, line: { color: sk.freqColor }
      });
      s.addText(sk.freq, {
        x: 11.95, y: y + 0.18, w: 1.1, h: 0.34,
        fontSize: 9, fontFace: FONT_B, color: "FFFFFF",
        bold: true, align: "center", valign: "middle", margin: 0
      });
    });

    footer(s, 6);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 7 — FLUXO OPERACIONAL
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    sectionEyebrow(s, "BLOCO 3 · COMO OPERA NA PRÁTICA");
    slideTitle(s, "Fluxo do Hunter.");

    const steps = [
      { n: "01", name: "Mapear", desc: "Varredura por categoria", ic: icMap },
      { n: "02", name: "Pontuar", desc: "Score de fit", ic: icScore },
      { n: "03", name: "Qualificar", desc: "Perfil do lojista", ic: icQual },
      { n: "04", name: "Abordar", desc: "Primeiro contato", ic: icScript },
      { n: "05", name: "Decidir", desc: "Replacement cost", ic: icRC },
      { n: "06", name: "Reportar", desc: "Pipeline semanal", ic: icRep },
    ];
    const cardW = 1.85, gap = 0.13;
    const totalW = cardW * 6 + gap * 5;
    const startX = (W - totalW) / 2;
    const cardY = 2.35;

    steps.forEach((st, i) => {
      const x = startX + i * (cardW + gap);
      const isHighlight = i === 1; // tweak: highlight Score
      // Card
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: cardY, w: cardW, h: 2.6,
        fill: { color: isHighlight ? C.ink : C.paper },
        line: { color: isHighlight ? C.ink : C.border, width: 1 }
      });
      // Number
      s.addText(st.n, {
        x: x + 0.15, y: cardY + 0.18, w: cardW - 0.3, h: 0.4,
        fontSize: 11, fontFace: FONT_B,
        color: isHighlight ? C.accent : C.muted,
        bold: true, charSpacing: 3, margin: 0
      });
      // Icon
      s.addImage({
        data: st.ic,
        x: x + (cardW - 0.6) / 2, y: cardY + 0.65, w: 0.6, h: 0.6
      });
      // Name
      s.addText(st.name, {
        x: x + 0.1, y: cardY + 1.4, w: cardW - 0.2, h: 0.4,
        fontSize: 18, fontFace: FONT_H,
        color: isHighlight ? "FFFFFF" : C.ink,
        bold: true, italic: true, align: "center", margin: 0
      });
      // Desc
      s.addText(st.desc, {
        x: x + 0.1, y: cardY + 1.85, w: cardW - 0.2, h: 0.6,
        fontSize: 11, fontFace: FONT_B,
        color: isHighlight ? "D1D5DB" : C.ink2,
        align: "center", margin: 0
      });

      // Arrow between
      if (i < 5) {
        const arrowX = x + cardW + (gap - 0.18) / 2;
        s.addImage({
          data: icArrow, x: arrowX, y: cardY + 1.15, w: 0.18, h: 0.18
        });
      }
    });

    // Bottom note
    s.addText("Cada etapa alimenta a próxima. O output do Hunter chega à equipe do shopping no formato de uma lista acionável — não como relatório teórico.", {
      x: 0.6, y: 5.6, w: W - 1.2, h: 0.7,
      fontSize: 14, fontFace: FONT_B, color: C.muted,
      italic: true, align: "center", margin: 0
    });

    footer(s, 7);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 8 — RUBRICA DE SCORE
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    sectionEyebrow(s, "CRITÉRIOS DE QUALIFICAÇÃO");
    slideTitle(s, "Como o Hunter avalia um prospect.");

    const rubric = [
      { crit: "Fit de Mix", peso: "Alto",
        good: "Categoria ausente ou sub-representada",
        warn: "Categoria existente, com espaço de mercado",
        bad: "Canibaliza lojista estratégico" },
      { crit: "Saúde Operacional", peso: "Alto",
        good: "+2 anos, avaliação ≥4.0, digital ativa",
        warn: "Operação recente (<2 anos) crescendo",
        bad: "Reclamações, processos, endividamento" },
      { crit: "Sinal de Expansão", peso: "Médio",
        good: "Crescimento visível, +1 unidade",
        warn: "Operação única, mas estruturada",
        bad: "Sem digital, sem foco em expansão" },
      { crit: "Fit de Ticket", peso: "Médio",
        good: "Ticket alinhado ao IPC da área",
        warn: "Ticket fora, com possibilidade de ajuste",
        bad: "Posicionamento incompatível" },
      { crit: "Replacement Cost", peso: "Situacional",
        good: "Operação provada barateia entrada",
        warn: "Custos equiparados",
        bad: "Desenvolver seria mais barato" },
    ];

    const rowH = 0.78;
    const headerY = 1.95;
    // Header
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: headerY, w: W - 1.2, h: 0.45,
      fill: { color: C.ink }, line: { color: C.ink }
    });
    const colHeaders = [
      { x: 0.6, w: 2.4, label: "CRITÉRIO" },
      { x: 3.0, w: 1.5, label: "PESO" },
      { x: 4.5, w: 2.8, label: "POSITIVO", color: "10B981" },
      { x: 7.3, w: 2.8, label: "ATENÇÃO", color: "F59E0B" },
      { x: 10.1, w: 3.0, label: "DESCARTA", color: "EF4444" },
    ];
    colHeaders.forEach(c => {
      s.addText(c.label, {
        x: c.x + 0.15, y: headerY + 0.08, w: c.w - 0.2, h: 0.3,
        fontSize: 10, fontFace: FONT_B,
        color: c.color || "FFFFFF",
        bold: true, charSpacing: 3, margin: 0
      });
    });

    rubric.forEach((r, i) => {
      const y = headerY + 0.45 + i * rowH;
      if (i % 2 === 0) {
        s.addShape(pres.shapes.RECTANGLE, {
          x: 0.6, y, w: W - 1.2, h: rowH,
          fill: { color: C.paper }, line: { color: C.border, width: 0.5 }
        });
      } else {
        s.addShape(pres.shapes.RECTANGLE, {
          x: 0.6, y, w: W - 1.2, h: rowH,
          fill: { color: C.bg }, line: { color: C.border, width: 0.5 }
        });
      }
      // Critério
      s.addText(r.crit, {
        x: 0.75, y: y + 0.05, w: 2.2, h: rowH - 0.1,
        fontSize: 13, fontFace: FONT_B, color: C.ink,
        bold: true, valign: "middle", margin: 0
      });
      // Peso
      s.addText(r.peso, {
        x: 3.15, y: y + 0.05, w: 1.3, h: rowH - 0.1,
        fontSize: 11, fontFace: FONT_H, color: C.accent,
        italic: true, valign: "middle", margin: 0
      });
      // Good
      s.addText(r.good, {
        x: 4.65, y: y + 0.05, w: 2.6, h: rowH - 0.1,
        fontSize: 10.5, fontFace: FONT_B, color: "065F46",
        valign: "middle", margin: 0
      });
      // Warn
      s.addText(r.warn, {
        x: 7.45, y: y + 0.05, w: 2.6, h: rowH - 0.1,
        fontSize: 10.5, fontFace: FONT_B, color: "92400E",
        valign: "middle", margin: 0
      });
      // Bad
      s.addText(r.bad, {
        x: 10.25, y: y + 0.05, w: 2.85, h: rowH - 0.1,
        fontSize: 10.5, fontFace: FONT_B, color: "991B1B",
        valign: "middle", margin: 0
      });
    });

    footer(s, 8);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 9 — SCRIPTS DE ABORDAGEM
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    sectionEyebrow(s, "SKILL S4 · EM DETALHE");
    slideTitle(s, "Scripts de primeira abordagem.");

    const scripts = [
      {
        channel: "WhatsApp · Lojista de rua",
        body: 'Olá, [Nome]! Aqui é [Seu nome], do shopping [Nome].\n\nAcompanho a operação de vocês há um tempo e fiquei curioso — vocês têm pensado em levar a marca para dentro de shopping?\n\nTenho uma oportunidade que faz sentido com o que vocês fazem. Posso te contar em 10 minutos?',
        note: "Tom: direto e pessoal. Sem aluguel nem taxas no primeiro contato. Objetivo é a reunião, não o fechamento."
      },
      {
        channel: "WhatsApp · Lojista em outro shopping",
        body: 'Olá, [Nome]! Tudo bem?\n\nVi que vocês operam no [shopping concorrente] e o resultado de vocês lá é forte.\n\nTenho um espaço aqui no [Shopping] que atende um perfil de cliente parecido — e hoje não temos ninguém fazendo o que vocês fazem.\n\nVale uma conversa rápida essa semana?',
        note: "Diferencial: mencionar o gap no mix. Posiciona o contato como oportunidade, não como venda."
      },
    ];

    const cardW = 6.0, gap = 0.3;
    const totalW = cardW * 2 + gap;
    const startX = (W - totalW) / 2;

    scripts.forEach((sc, i) => {
      const x = startX + i * (cardW + gap);
      const y = 2.0;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 4.7,
        fill: { color: C.paper }, line: { color: C.border, width: 1 }
      });
      // Channel header
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: 0.55,
        fill: { color: C.ink }, line: { color: C.ink }
      });
      s.addText(sc.channel.toUpperCase(), {
        x: x + 0.3, y: y + 0.13, w: cardW - 0.6, h: 0.3,
        fontSize: 11, fontFace: FONT_B, color: "FFFFFF",
        bold: true, charSpacing: 3, margin: 0
      });
      // Body
      s.addText(sc.body, {
        x: x + 0.4, y: y + 0.8, w: cardW - 0.8, h: 3.0,
        fontSize: 13, fontFace: FONT_B, color: C.ink2,
        margin: 0, valign: "top", paraSpaceAfter: 4
      });
      // Divider
      s.addShape(pres.shapes.LINE, {
        x: x + 0.4, y: y + 3.85, w: cardW - 0.8, h: 0,
        line: { color: C.border, width: 1 }
      });
      // Note
      s.addText("OBSERVAÇÃO", {
        x: x + 0.4, y: y + 3.95, w: cardW - 0.8, h: 0.25,
        fontSize: 9, fontFace: FONT_B, color: C.accent,
        bold: true, charSpacing: 3, margin: 0
      });
      s.addText(sc.note, {
        x: x + 0.4, y: y + 4.2, w: cardW - 0.8, h: 0.45,
        fontSize: 11, fontFace: FONT_B, color: C.muted,
        italic: true, margin: 0
      });
    });

    footer(s, 9);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 10 — INTEGRAÇÃO
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    sectionEyebrow(s, "ECOSSISTEMA · POSIÇÃO DO HUNTER");
    slideTitle(s, "Hunter alimenta o sistema inteiro.");

    s.addText("O Hunter não opera sozinho. Cada prospect qualificado é input para outros agentes.", {
      x: 0.6, y: 1.7, w: 11, h: 0.4,
      fontSize: 14, fontFace: FONT_B, color: C.muted,
      italic: true, margin: 0
    });

    // Hunter (left, dark block)
    const hX = 0.6, hY = 2.4, hW = 2.6, hH = 4.2;
    s.addShape(pres.shapes.RECTANGLE, {
      x: hX, y: hY, w: hW, h: hH,
      fill: { color: C.ink }, line: { color: C.ink }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: hX, y: hY, w: hW, h: 0.08, fill: { color: C.accent }, line: { color: C.accent }
    });
    s.addImage({
      data: icHunter, x: hX + (hW - 0.8) / 2, y: hY + 0.7, w: 0.8, h: 0.8
    });
    s.addText("HUNTER", {
      x: hX, y: hY + 1.7, w: hW, h: 0.5,
      fontSize: 24, fontFace: FONT_H, color: "FFFFFF",
      bold: true, italic: true, align: "center", margin: 0
    });
    s.addText("Identifica e qualifica o prospect", {
      x: hX + 0.3, y: hY + 2.3, w: hW - 0.6, h: 0.5,
      fontSize: 12, fontFace: FONT_B, color: "D1D5DB",
      align: "center", margin: 0
    });

    // Big arrow
    s.addImage({
      data: icArrow, x: 3.4, y: hY + (hH - 0.4) / 2, w: 0.4, h: 0.4
    });

    // 4 target cards (right side)
    const targets = [
      { name: "Agente Farmer", icon: icHand, desc: "Match com investidores locais disponíveis.", what: "Recebe: perfil + score" },
      { name: "Agente KA", icon: icBld, desc: "Quando o prospect é marca em expansão regional/nacional.", what: "Recebe: marcas com sinal de expansão" },
      { name: "Pl. Alavancador", icon: icCog, desc: "Quando o lojista precisa de suporte financeiro para abrir.", what: "Recebe: lojista + gap financeiro" },
      { name: "Pl. Builder", icon: icTools, desc: "Quando precisa de obra, projeto ou legalização.", what: "Recebe: lojista + necessidade estrutural" },
    ];
    const tX = 3.95, tY = hY;
    const tW = 4.55, tH = 2.05, tGap = 0.1;
    targets.forEach((t, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = tX + col * (tW + tGap);
      const y = tY + row * (tH + tGap);
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: tW, h: tH,
        fill: { color: C.paper }, line: { color: C.border, width: 1 }
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: tW, h: 0.05, fill: { color: C.accent }, line: { color: C.accent }
      });
      s.addImage({
        data: t.icon, x: x + 0.25, y: y + 0.25, w: 0.5, h: 0.5
      });
      s.addText(t.name, {
        x: x + 0.85, y: y + 0.2, w: tW - 1, h: 0.4,
        fontSize: 16, fontFace: FONT_H, color: C.ink,
        bold: true, italic: true, margin: 0
      });
      s.addText(t.desc, {
        x: x + 0.25, y: y + 0.85, w: tW - 0.5, h: 0.6,
        fontSize: 11.5, fontFace: FONT_B, color: C.ink2, margin: 0
      });
      s.addText(t.what.toUpperCase(), {
        x: x + 0.25, y: y + 1.55, w: tW - 0.5, h: 0.4,
        fontSize: 9, fontFace: FONT_B, color: C.accent,
        bold: true, charSpacing: 2, margin: 0
      });
    });

    footer(s, 10);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 11 — D0 LISTA (3 dias)
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    sectionEyebrow(s, "OUTPUT D0 · PARA A EQUIPE DO SHOPPING");
    slideTitle(s, "O que fazer na segunda-feira.");

    const days = [
      {
        day: "DIA 1", title: "Preparar o contexto",
        items: [
          "Criar conta no Claude.ai (free)",
          "Abrir Projeto e colar o system prompt do Hunter",
          "Preencher: nome do shopping, mix atual, raios",
          "Testar com uma categoria: pedir mapeamento de raio 2km",
          "Validar se o output bate com o que você já sabe"
        ]
      },
      {
        day: "DIA 2", title: "Primeiro pipeline",
        items: [
          "Rodar S1: 3 categorias prioritárias em raio de 10km",
          "Rodar S2: pedir score de fit dos 10 melhores",
          "Rodar S3: qualificar os 5 com maior score",
          "Exportar lista (nome, endereço, score, próximo passo)",
          "Validar com gestor antes do contato"
        ]
      },
      {
        day: "DIA 3", title: "Primeiro contato",
        items: [
          "Rodar S4: gerar script para os 3 prospects validados",
          "Fazer contato via WhatsApp (não e-mail no início)",
          "Registrar resposta (sim / não / sem resposta)",
          "Realimentar o Hunter com resultados",
          "Agendar reunião — passar lead para o Farmer"
        ]
      },
    ];

    const cardW = 4.0, gap = 0.27;
    const totalW = cardW * 3 + gap * 2;
    const startX = (W - totalW) / 2;

    days.forEach((d, i) => {
      const x = startX + i * (cardW + gap);
      const y = 2.0;
      const cardH = 4.85;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: cardH,
        fill: { color: C.bg }, line: { color: C.border, width: 1 },
        shadow: cardShadow()
      });
      // Top dark band
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
      // Items
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

    footer(s, 11);
  }

  // ═══════════════════════════════════════════════════════════
  // SLIDE 12 — QUOTE / CIERRE
  // ═══════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.ink };

    // Quote mark
    s.addImage({
      data: icQuote, x: 1.0, y: 1.5, w: 0.8, h: 0.8, transparency: 50
    });

    s.addText(
      "Look for micro opportunities in macro events.\nIf everyone is going left, look right.",
      {
        x: 1.0, y: 2.5, w: 11.3, h: 2.5,
        fontSize: 38, fontFace: FONT_H, color: "FFFFFF",
        italic: true, margin: 0, valign: "top"
      }
    );

    // Divider
    s.addShape(pres.shapes.LINE, {
      x: 1.0, y: 5.2, w: 1.5, h: 0,
      line: { color: C.accent, width: 2 }
    });

    s.addText("SAM ZELL", {
      x: 1.0, y: 5.4, w: 11, h: 0.35,
      fontSize: 12, fontFace: FONT_B, color: C.accent,
      bold: true, charSpacing: 5, margin: 0
    });
    s.addText("Princípio aplicado ao design do Agente Hunter", {
      x: 1.0, y: 5.75, w: 11, h: 0.35,
      fontSize: 14, fontFace: FONT_B, color: "9CA3AF",
      italic: true, margin: 0
    });

    // Bottom strip
    s.addShape(pres.shapes.LINE, {
      x: 0.6, y: H - 0.5, w: W - 1.2, h: 0,
      line: { color: "374151", width: 0.75 }
    });
    s.addText("FIM · WORKSHOP IA · AGENTE HUNTER", {
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

  await pres.writeFile({ fileName: "/home/claude/hunter/agente_hunter.pptx" });
  console.log("Created.");
})();
