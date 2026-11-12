const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak, LevelFormat, PageOrientation
} = require('docx');
const fs = require('fs');

// ── COLORS ─────────────────────────────────────────────
const C = {
  darkBg:   "0D0F14",
  gold:     "C9A843",
  goldL:    "F0CC72",
  teal:     "1FD4B0",
  violet:   "9D7DFA",
  sky:      "3AB6F5",
  amber:    "F5A623",
  coral:    "FF7C5C",
  mint:     "52E89C",
  rose:     "F56060",
  white:    "FFFFFF",
  nearW:    "EEE9E0",
  muted:    "8B95A8",
  dark1:    "1E2330",
  dark2:    "141720",
  gray:     "E8EAF0",
  grayDk:   "6B7280",
  labelBg:  "F0F4FF",
};

const border = { style: BorderStyle.SINGLE, size: 1, color: "D0D5E0" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const PAGE_W = 12240;
const MARGINS = 1440;
const CONTENT_W = PAGE_W - (MARGINS * 2); // 9360

// ── HELPERS ────────────────────────────────────────────
const sp = (before = 0, after = 0, line = null) => ({
  spacing: { before, after, ...(line ? { line, lineRule: "auto" } : {}) }
});

const txt = (text, opts = {}) => new TextRun({
  text,
  font: "Arial",
  size: opts.size || 22,
  bold: opts.bold || false,
  color: opts.color || "222222",
  italics: opts.italic || false,
  ...opts
});

const para = (children, opts = {}) => new Paragraph({
  children: Array.isArray(children) ? children : [children],
  alignment: opts.align || AlignmentType.LEFT,
  ...sp(opts.before || 0, opts.after || 120),
  ...opts
});

const heading = (text, level, color = C.darkBg, size = 32) => new Paragraph({
  children: [new TextRun({ text, font: "Arial", size, bold: true, color })],
  heading: level,
  alignment: AlignmentType.LEFT,
  spacing: { before: 240, after: 160 },
});

const cell = (children, opts = {}) => new TableCell({
  borders: opts.borders || borders,
  width: { size: opts.w || 4680, type: WidthType.DXA },
  shading: opts.bg ? { fill: opts.bg, type: ShadingType.CLEAR } : undefined,
  margins: { top: opts.mt || 120, bottom: opts.mb || 120, left: opts.ml || 160, right: opts.mr || 160 },
  verticalAlign: opts.va || VerticalAlign.TOP,
  columnSpan: opts.span || 1,
  children: Array.isArray(children) ? children : [para(children)],
});

const hCell = (text, bg = C.dark1, color = C.white, w = 4680) => cell(
  [para([txt(text, { bold: true, color, size: 18 })], { align: AlignmentType.CENTER, before: 0, after: 0 })],
  { bg, w, mt: 100, mb: 100 }
);

const row = (cells) => new TableRow({ children: cells });

const table = (rows, widths) => new Table({
  width: { size: CONTENT_W, type: WidthType.DXA },
  columnWidths: widths,
  rows,
});

const divider = (color = C.gold) => new Paragraph({
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color, space: 1 } },
  spacing: { before: 240, after: 240 },
  children: [],
});

const sceneHeader = (num, title, duration, color) => [
  divider(color),
  table([
    row([
      cell([para([txt(`CENA ${num}`, { bold: true, color: C.white, size: 24 })])],
        { bg: C.darkBg, w: 1200, mt: 140, mb: 140, ml: 200 }),
      cell([para([txt(title, { bold: true, color, size: 26 })])],
        { bg: C.dark2, w: 6560, mt: 140, mb: 140 }),
      cell([
        para([txt("⏱ DURAÇÃO", { color: C.muted, size: 16 })], { before: 0, after: 20 }),
        para([txt(duration, { bold: true, color, size: 20 })], { before: 0, after: 0 }),
      ], { bg: C.dark2, w: 1600, mt: 100, mb: 100, va: VerticalAlign.CENTER }),
    ])
  ], [1200, 6560, 1600]),
];

const fieldRow = (label, value, bg = C.labelBg) => row([
  cell([para([txt(label, { bold: true, color: C.grayDk, size: 18 })])],
    { bg, w: 2800, mt: 80, mb: 80 }),
  cell([para([txt(value, { color: "222222", size: 18 })])],
    { bg: C.white, w: 6560, mt: 80, mb: 80 }),
]);

const tagRow = (tags, color) => para(
  tags.map((t, i) => new TextRun({
    text: `  ${t}  ` + (i < tags.length - 1 ? "   " : ""),
    font: "Arial", size: 17, color,
    shading: { fill: "FFFFFF", type: ShadingType.CLEAR },
    bold: false,
  })),
  { before: 60, after: 60 }
);

// ── COVER PAGE ─────────────────────────────────────────
const coverPage = [
  new Paragraph({
    children: [new TextRun({ text: "", size: 2 })],
    spacing: { before: 0, after: 1440 },
  }),
  new Paragraph({
    children: [txt("STORYBOARD & ROTEIRO", { size: 18, color: C.gold, bold: true })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.gold, space: 8 } },
  }),
  new Paragraph({
    children: [txt("SHOPPING INTELIGENTE", { size: 72, bold: true, color: C.darkBg })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 80 },
  }),
  new Paragraph({
    children: [txt("Sistema Multi-Agente de Aceleração Comercial", { size: 28, color: C.grayDk })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 560 },
  }),
  table([
    row([
      cell([
        para([txt("FORMATO", { bold: true, color: C.muted, size: 17 })], { before: 0, after: 40 }),
        para([txt("Vídeo explicativo / Motion Graphics", { color: C.darkBg, size: 20 })], { before: 0, after: 0 }),
      ], { bg: C.gray, w: 3120, mt: 120, mb: 120 }),
      cell([
        para([txt("DURAÇÃO TOTAL", { bold: true, color: C.muted, size: 17 })], { before: 0, after: 40 }),
        para([txt("8–10 minutos", { color: C.darkBg, size: 20 })], { before: 0, after: 0 }),
      ], { bg: C.gray, w: 3120, mt: 120, mb: 120 }),
      cell([
        para([txt("CENAS", { bold: true, color: C.muted, size: 17 })], { before: 0, after: 40 }),
        para([txt("10 cenas + abertura + encerramento", { color: C.darkBg, size: 20 })], { before: 0, after: 0 }),
      ], { bg: C.gray, w: 3120, mt: 120, mb: 120 }),
    ])
  ], [3120, 3120, 3120]),
  new Paragraph({ children: [], spacing: { before: 400, after: 400 } }),
  table([
    row([
      cell([
        para([txt("FERRAMENTAS RECOMENDADAS PARA PRODUÇÃO", { bold: true, color: C.white, size: 18 })],
          { align: AlignmentType.CENTER, before: 80, after: 80 }),
      ], { bg: C.darkBg, w: CONTENT_W, span: 4, mt: 120, mb: 120 }),
    ]),
    row([
      hCell("Synthesia", "1F2D20", C.mint, 2340),
      hCell("HeyGen", "1F1F2D", C.violet, 2340),
      hCell("Canva Video", "2D1F1F", C.coral, 2340),
      hCell("Adobe After Effects", "2D2A1F", C.amber, 2340),
    ]),
    row([
      cell([para([txt("Avatar IA + voz gerada. Ideal para narração automática a partir deste roteiro.", { size: 17, color: C.grayDk })])],
        { bg: C.white, w: 2340, mt: 80, mb: 80 }),
      cell([para([txt("Vídeo com apresentador IA, suporta português. Upload de slides como base.", { size: 17, color: C.grayDk })])],
        { bg: C.white, w: 2340, mt: 80, mb: 80 }),
      cell([para([txt("Fácil para motion graphics. Importe os slides do infográfico HTML.", { size: 17, color: C.grayDk })])],
        { bg: C.white, w: 2340, mt: 80, mb: 80 }),
      cell([para([txt("Produção profissional completa. Use para animações dos diagramas.", { size: 17, color: C.grayDk })])],
        { bg: C.white, w: 2340, mt: 80, mb: 80 }),
    ]),
  ], [2340, 2340, 2340, 2340]),
  new Paragraph({ children: [new PageBreak()], spacing: { before: 0, after: 0 } }),
];

// ── TABLE OF CONTENTS ──────────────────────────────────
const tocPage = [
  heading("ÍNDICE DE CENAS", HeadingLevel.HEADING_1, C.darkBg, 36),
  divider(C.gold),
  table([
    row([hCell("CENA", C.darkBg, C.gold, 800), hCell("TÍTULO", C.darkBg, C.gold, 5360), hCell("DURAÇÃO", C.darkBg, C.gold, 1600), hCell("TEMA VISUAL", C.darkBg, C.gold, 1600)]),
    row([hCell("ABERTURA", C.dark1, C.goldL, 800), cell([para([txt("Título + Problema: O que falta no varejo brasileiro", { color: "111111", size: 18 })])], { w: 5360, mt: 80, mb: 80 }), cell([para([txt("0:00 – 0:45", { color: C.teal, bold: true, size: 18 })])], { w: 1600, mt: 80, mb: 80, va: VerticalAlign.CENTER }), cell([para([txt("Fundo escuro, grid dourado, texto revelando", { color: C.grayDk, size: 16 })])], { bg: C.gray, w: 1600, mt: 80, mb: 80 })]),
    row([hCell("CENA 1", C.dark1, C.rose, 800), cell([para([txt("As Dores Atuais: O custo do atrito", { color: "111111", size: 18 })])], { w: 5360, mt: 80, mb: 80 }), cell([para([txt("0:45 – 1:30", { color: C.rose, bold: true, size: 18 })])], { w: 1600, mt: 80, mb: 80 }), cell([para([txt("3 cards vermelhos revelando problemas", { color: C.grayDk, size: 16 })])], { bg: C.gray, w: 1600, mt: 80, mb: 80 })]),
    row([hCell("CENA 2", C.dark1, C.gold, 800), cell([para([txt("A Solução: Arquitetura do Sistema", { color: "111111", size: 18 })])], { w: 5360, mt: 80, mb: 80 }), cell([para([txt("1:30 – 2:15", { color: C.gold, bold: true, size: 18 })])], { w: 1600, mt: 80, mb: 80 }), cell([para([txt("Diagrama de nós se conectando de cima para baixo", { color: C.grayDk, size: 16 })])], { bg: C.gray, w: 1600, mt: 80, mb: 80 })]),
    row([hCell("CENA 3", C.dark1, C.teal, 800), cell([para([txt("Agente Hunter: Encontrando oportunidades", { color: "111111", size: 18 })])], { w: 5360, mt: 80, mb: 80 }), cell([para([txt("2:15 – 3:00", { color: C.teal, bold: true, size: 18 })])], { w: 1600, mt: 80, mb: 80 }), cell([para([txt("Mapa com raio expandindo, pontos aparecendo", { color: C.grayDk, size: 16 })])], { bg: C.gray, w: 1600, mt: 80, mb: 80 })]),
    row([hCell("CENA 4", C.dark1, C.violet, 800), cell([para([txt("Agente Farmer: Triagem inteligente de investidores", { color: "111111", size: 18 })])], { w: 5360, mt: 80, mb: 80 }), cell([para([txt("3:00 – 3:50", { color: C.violet, bold: true, size: 18 })])], { w: 1600, mt: 80, mb: 80 }), cell([para([txt("Funil de filtragem, perfis de investidores", { color: C.grayDk, size: 16 })])], { bg: C.gray, w: 1600, mt: 80, mb: 80 })]),
    row([hCell("CENA 5", C.dark1, C.sky, 800), cell([para([txt("Agente KA/Expansão: Marcas e match com investidores", { color: "111111", size: 18 })])], { w: 5360, mt: 80, mb: 80 }), cell([para([txt("3:50 – 4:35", { color: C.sky, bold: true, size: 18 })])], { w: 1600, mt: 80, mb: 80 }), cell([para([txt("Logos de marcas, setas de match bilaterais", { color: C.grayDk, size: 16 })])], { bg: C.gray, w: 1600, mt: 80, mb: 80 })]),
    row([hCell("CENA 6", C.dark1, C.amber, 800), cell([para([txt("Plataforma Alavancador: Soluções financeiras", { color: "111111", size: 18 })])], { w: 5360, mt: 80, mb: 80 }), cell([para([txt("4:35 – 5:20", { color: C.amber, bold: true, size: 18 })])], { w: 1600, mt: 80, mb: 80 }), cell([para([txt("Ícones financeiros flutuando, cards de produto", { color: C.grayDk, size: 16 })])], { bg: C.gray, w: 1600, mt: 80, mb: 80 })]),
    row([hCell("CENA 7", C.dark1, C.coral, 800), cell([para([txt("Plataforma Builder: Do projeto à abertura", { color: "111111", size: 18 })])], { w: 5360, mt: 80, mb: 80 }), cell([para([txt("5:20 – 6:05", { color: C.coral, bold: true, size: 18 })])], { w: 1600, mt: 80, mb: 80 }), cell([para([txt("Timeline de obra animada, fornecedores conectando", { color: C.grayDk, size: 16 })])], { bg: C.gray, w: 1600, mt: 80, mb: 80 })]),
    row([hCell("CENA 8", C.dark1, C.mint, 800), cell([para([txt("Plataforma Seller: Vendendo mais no shopping", { color: "111111", size: 18 })])], { w: 5360, mt: 80, mb: 80 }), cell([para([txt("6:05 – 6:50", { color: C.mint, bold: true, size: 18 })])], { w: 1600, mt: 80, mb: 80 }), cell([para([txt("Ícones de mídia e eventos animados, fluxo de vendas", { color: C.grayDk, size: 16 })])], { bg: C.gray, w: 1600, mt: 80, mb: 80 })]),
    row([hCell("CENA 9", C.dark1, C.goldL, 800), cell([para([txt("Jornada End-to-End: Os 5 passos", { color: "111111", size: 18 })])], { w: 5360, mt: 80, mb: 80 }), cell([para([txt("6:50 – 7:35", { color: C.goldL, bold: true, size: 18 })])], { w: 1600, mt: 80, mb: 80 }), cell([para([txt("5 etapas se iluminando em sequência", { color: C.grayDk, size: 16 })])], { bg: C.gray, w: 1600, mt: 80, mb: 80 })]),
    row([hCell("CENA 10", C.dark1, C.teal, 800), cell([para([txt("Benchmark e Oportunidade: O mercado que não está em shopping", { color: "111111", size: 18 })])], { w: 5360, mt: 80, mb: 80 }), cell([para([txt("7:35 – 8:20", { color: C.teal, bold: true, size: 18 })])], { w: 1600, mt: 80, mb: 80 }), cell([para([txt("Gráfico de barras animado, comparativo de países", { color: C.grayDk, size: 16 })])], { bg: C.gray, w: 1600, mt: 80, mb: 80 })]),
    row([hCell("ENCERRAMENTO", C.darkBg, C.gold, 800), cell([para([txt("Call to Action + Próximos Passos", { color: "111111", size: 18 })])], { w: 5360, mt: 80, mb: 80 }), cell([para([txt("8:20 – 9:00", { color: C.gold, bold: true, size: 18 })])], { w: 1600, mt: 80, mb: 80 }), cell([para([txt("Logotipo, frase de impacto, QR code / link", { color: C.grayDk, size: 16 })])], { bg: C.gray, w: 1600, mt: 80, mb: 80 })]),
  ], [800, 5360, 1600, 1600]),
  new Paragraph({ children: [new PageBreak()], spacing: { before: 0, after: 0 } }),
];

// ── LEGEND ─────────────────────────────────────────────
const legendBlock = (color, label) => [
  new TableRow({
    children: [
      cell([para([txt("■", { color, size: 22, bold: true })])], { bg: C.white, w: 400, mt: 60, mb: 60, borders: noBorders }),
      cell([para([txt(label, { color: C.grayDk, size: 17 })])], { bg: C.white, w: 2160, mt: 60, mb: 60, borders: noBorders }),
    ]
  })
];

// ── SCENE BLOCK BUILDER ────────────────────────────────
const sceneBlock = (num, title, duration, color, narration, visual, audio, elements, transitions, notes) => {
  const blocks = [
    ...sceneHeader(num, title, duration, color),
    new Paragraph({ children: [], spacing: { before: 120, after: 0 } }),

    // 2-col: Narration + Visual
    table([
      row([
        hCell("🎙 NARRAÇÃO (VOZ OFF)", C.darkBg, C.nearW, 4560),
        hCell("🎨 VISUAL / MOTION GRAPHICS", C.darkBg, C.nearW, 4800),
      ]),
      row([
        cell([
          ...narration.map(line => para([txt(line, { size: 19, color: "111111" })], { before: 40, after: 40 })),
        ], { bg: C.white, w: 4560, mt: 120, mb: 120 }),
        cell([
          ...visual.map(line => para([txt("→ " + line, { size: 18, color: "111111" })], { before: 40, after: 40 })),
        ], { bg: C.labelBg, w: 4800, mt: 120, mb: 120 }),
      ]),
    ], [4560, 4800]),

    new Paragraph({ children: [], spacing: { before: 100, after: 0 } }),

    // 3-col bottom row
    table([
      row([
        hCell("🎵 ÁUDIO / MÚSICA", C.dark1, C.amber, 2960),
        hCell("⚙ ELEMENTOS NA TELA", C.dark1, color, 3200),
        hCell("➜ TRANSIÇÃO DE SAÍDA", C.dark1, C.mint, 3200),
      ]),
      row([
        cell([
          ...audio.map(l => para([txt("• " + l, { size: 17, color: "111111" })], { before: 30, after: 30 })),
        ], { bg: C.white, w: 2960, mt: 100, mb: 100 }),
        cell([
          ...elements.map(l => para([txt("• " + l, { size: 17, color: "111111" })], { before: 30, after: 30 })),
        ], { bg: C.white, w: 3200, mt: 100, mb: 100 }),
        cell([
          ...transitions.map(l => para([txt("• " + l, { size: 17, color: "111111" })], { before: 30, after: 30 })),
        ], { bg: C.white, w: 3200, mt: 100, mb: 100 }),
      ]),
    ], [2960, 3200, 3200]),

    // Notes
    ...(notes.length ? [
      new Paragraph({ children: [], spacing: { before: 80, after: 0 } }),
      table([
        row([
          cell([
            para([txt("📌 NOTAS DE DIREÇÃO", { bold: true, color: C.white, size: 17 })], { before: 0, after: 60 }),
            ...notes.map(n => para([txt("• " + n, { size: 17, color: C.nearW })], { before: 30, after: 30 })),
          ], { bg: C.darkBg, w: CONTENT_W, mt: 120, mb: 120 }),
        ])
      ], [CONTENT_W]),
    ] : []),
    new Paragraph({ children: [new PageBreak()], spacing: { before: 0, after: 0 } }),
  ];
  return blocks;
};

// ── ALL SCENES ─────────────────────────────────────────
const scenes = [

  // ABERTURA
  sceneBlock("ABERTURA", "TÍTULO + O PROBLEMA DO VAREJO BRASILEIRO", "0:00 – 0:45 | 45 seg", C.gold,
    [
      "O varejo brasileiro tem um paradoxo.",
      "Enquanto México e Austrália concentram mais de 50% de suas vendas em shoppings centers...",
      "...o Brasil ainda não chegou a 30%.",
      "Por quê? Porque abrir uma loja num shopping ainda é lento, caro e cheio de atrito.",
      "Mas isso está prestes a mudar.",
    ],
    [
      "Fundo escuro com grid de linhas douradas sutis (efeito câmara fotográfica)",
      "Título 'SHOPPING INTELIGENTE' aparece letra por letra — fonte bold, branco",
      "Subtítulo aparece abaixo: 'Sistema Multi-Agente de Aceleração Comercial'",
      "Mapa do Brasil se ilumina. Percentual '<30%' pulsa em vermelho no centro",
      "Logos de México (53%) e Austrália (51%) flutuam ao redor para comparação",
      "Fade out do mapa → tela preta com frase de impacto",
    ],
    [
      "Música instrumental: eletrônico/corporativo, leve e moderno",
      "Sem batidas fortes — atmosfera de descoberta e curiosidade",
      "Volume baixo, espaço para a voz off respirar",
    ],
    [
      "Logo do Shopping no canto superior direito",
      "Percentuais animados com contador (0 → 53%, 0 → 28%)",
      "Seta descendente em vermelho ao lado do Brasil",
      "Barra de progresso sutil na base da tela",
    ],
    [
      "Fade to black suave (0.8 seg)",
      "Próxima cena entra com zoom out de um ícone de loja vazia",
    ],
    [
      "Esse é o gancho emocional do vídeo — o espectador deve sentir a dimensão da oportunidade perdida",
      "Narração deve ser pausada, com ênfase em 'México e Austrália' e 'prestes a mudar'",
      "Usar fonte Bebas Neue ou similar para o título — impacto visual alto",
    ]
  ),

  // CENA 1
  sceneBlock("1", "AS DORES ATUAIS — O CUSTO DO ATRITO", "0:45 – 1:30 | 45 seg", C.rose,
    [
      "Hoje, o caminho para abrir uma loja num shopping tem três grandes barreiras.",
      "Primeira: o processo é lento. Alto atrito, muita burocracia, e o empreendedor não sabe nem por onde começar.",
      "Segunda: a triagem é ineficiente. O executivo de vendas passa horas qualificando leads manualmente — às vezes alimentando a concorrência.",
      "Terceira: o market share está estagnado. A maioria dos nossos shoppings está abaixo dos 25% da demanda qualificada disponível.",
      "Esses três problemas têm uma solução. E ela começa com inteligência artificial.",
    ],
    [
      "3 cards vermelhos surgem em sequência (entrada com slide da direita)",
      "Card 1: ícone de ampulheta + '⏳ PROCESSO LENTO' — burocracia, sem saber o que perguntar",
      "Card 2: ícone de funil entupido + '🔀 TRIAGEM MANUAL' — EV perde tempo, alimenta concorrência",
      "Card 3: ícone de gráfico descendente + '📉 MARKET SHARE BAIXO' — média abaixo de 25%",
      "Os 3 cards se alinham horizontalmente",
      "Uma grande seta vermelha aponta para baixo entre eles — dissolve em fade",
      "Texto surge no centro: 'Isso tem solução.'",
    ],
    [
      "Mudança sutil na música: batida mais marcada entra",
      "Som de 'alerta suave' a cada card que aparece (não irritante)",
      "Silêncio de 0.5 seg antes de 'isso tem solução'",
    ],
    [
      "Fundo escuro muda para vermelho escuro (#2D0808) nos 3 cards",
      "Porcentagem '< 25%' pisca uma vez no card 3",
      "Contador de tempo: 'horas desperdiçadas' em loop sutil no card 2",
    ],
    [
      "Zoom out revelando os 3 cards como peças de um quebra-cabeça",
      "Quebra-cabeça se dissolve — transição para fundo com linhas de conexão douradas",
    ],
    [
      "Tom da narração: urgente mas não alarmista. O problema é sério mas a solução existe.",
      "Os 3 cards devem ter peso visual igual — não enfatizar um sobre os outros",
    ]
  ),

  // CENA 2
  sceneBlock("2", "A SOLUÇÃO — ARQUITETURA DO SISTEMA", "1:30 – 2:15 | 45 seg", C.gold,
    [
      "Shopping Inteligente é um ecossistema de agentes de inteligência artificial conectados.",
      "No centro, um Agente Orquestrador que recebe todas as informações, qualifica perfis e distribui as tarefas.",
      "Abaixo dele, três agentes especialistas: o Hunter, o Farmer e o KA Expansão.",
      "E sustentando tudo: três plataformas de suporte ao lojista — o Alavancador, o Builder e o Seller.",
      "Cada peça se encaixa. Cada dado alimenta as demais. Nenhum lead se perde. Nenhum ponto vago fica esquecido.",
    ],
    [
      "Tela escura. Um ponto dourado aparece no centro — pulsa lentamente",
      "Texto surge ao redor: 'AGENTE ORQUESTRADOR'",
      "3 linhas douradas se expandem para baixo: HUNTER, FARMER, KA/EXPANSÃO",
      "Cada agente aparece como um nó circular colorido (teal, violeta, azul)",
      "Novas linhas se expandem para baixo: ALAVANCADOR, BUILDER, SELLER (âmbar, coral, verde)",
      "Diagrama completo revela a arquitetura — pausa por 2 segundos",
      "Zoom out para mostrar o sistema inteiro como uma 'constelação'",
    ],
    [
      "Música cresce suavemente nesta cena — sensação de grandiosidade",
      "Som de 'conexão' (clique leve) cada vez que um nó aparece",
      "Reverb suave nos sons de conexão",
    ],
    [
      "Nós dos agentes pulsam em suas cores quando mencionados na narração",
      "Linhas de conexão têm partículas de dados fluindo (como sangue no sistema)",
      "Label de cada nó: nome + ícone emoji representativo",
    ],
    [
      "Diagrama persiste na tela enquanto a cena 3 começa",
      "Zoom in no nó HUNTER — que se expande para preencher a tela",
    ],
    [
      "Este é o momento mais importante de comunicação de arquitetura — dar tempo suficiente para o espectador absorver",
      "O diagrama de constelação deve ser exatamente o mesmo do infográfico entregue",
    ]
  ),

  // CENA 3
  sceneBlock("3", "AGENTE HUNTER — ENCONTRANDO OPORTUNIDADES", "2:15 – 3:00 | 45 seg", C.teal,
    [
      "O Agente Hunter é os olhos do executivo de vendas no mercado local.",
      "Ele varre um raio de 2 a 50 quilômetros ao redor do shopping...",
      "...buscando negócios que não estão no shopping mas deveriam estar.",
      "Para cada alvo, calcula um score de fit: a compatibilidade do negócio com as necessidades de mix declaradas pelo shopping.",
      "O resultado? O executivo de vendas chega ao prospecto com dados, justificativa e um script de abordagem — não mais com feeling.",
    ],
    [
      "Mapa estilizado do entorno do shopping aparece (top view, dark mode)",
      "Círculo de raio se expande a partir do ponto central: 2km → 50km",
      "Pontos verdes aparecem no mapa — cada um é um negócio prospectável",
      "Alguns pontos ficam em destaque: animação de 'lock on' militar/radar",
      "Card flutuante aparece sobre um ponto: nome, categoria, score 87/100",
      "Barra de score se preenche em verde",
      "Corte para lista priorizada: 5 alvos com score, endereço e justificativa de fit",
    ],
    [
      "Som de radar/ping suave ao detectar cada negócio",
      "Música: eletrônico mais dinâmico, sensação de varredura e descoberta",
    ],
    [
      "Ícone de radar rotacionando no canto da tela durante a varredura",
      "Tags coloridas nos pontos do mapa: categoria de negócio",
      "Score counter animado: 0 → 87 com aceleração",
      "Filtros sendo aplicados visualmente: energia kVA, área m², categoria",
    ],
    [
      "Zoom in na lista priorizada → zoom out revela o executivo recebendo o briefing",
      "Transição: mapa vira planilha de targets (cena 4 começa)",
    ],
    [
      "Enfatizar que o Hunter não substitui o EV — ele o arma com dados antes da abordagem",
      "O score 87/100 é um exemplo fictício — ajustar para algo crível",
    ]
  ),

  // CENA 4
  sceneBlock("4", "AGENTE FARMER — TRIAGEM INTELIGENTE DE INVESTIDORES", "3:00 – 3:50 | 50 seg", C.violet,
    [
      "Enquanto o Hunter vai ao mercado buscar oportunidades...",
      "...o Agente Farmer trabalha no sentido oposto: atraindo e qualificando investidores.",
      "Pense no modelo de suitability dos grandes bancos de investimento — aquele perfil detalhado que determina qual produto financeiro é ideal para você.",
      "O Farmer faz o mesmo, mas para o varejo em shopping.",
      "Capital disponível. Disponibilidade de tempo. Experiência prévia. Tolerância a risco. Expectativa de retorno.",
      "Com essas informações, o sistema calcula um score e recomenda: franquia, loja própria, quiosque ou pop-up.",
      "O executivo de vendas só entra em campo quando o lead já é qualificado.",
    ],
    [
      "Animação de funil: muitos perfis entram pelo topo",
      "Filtros se aplicam em camadas, com labels de cada critério",
      "Funil vai afunilando — poucos leads qualificados saem pelo fundo",
      "Zoom no lead qualificado: card de perfil com score 78/100",
      "Card revela: capital R$150k, operador parcial, exp. em varejo, payback 24m",
      "Match automático: card do investidor se conecta a card de oportunidade",
      "Seta dourada: 'EV acionado apenas aqui' com ícone de pessoa",
    ],
    [
      "Som de filtro/peneira suave a cada camada do funil",
      "Ping de 'match' quando investidor se conecta com oportunidade",
      "Música: continua dinâmica, adiciona elemento de percussão suave",
    ],
    [
      "Ícones de perfil genéricos (sem rostos reais) no topo do funil",
      "Labels dos filtros em roxo: 💰 Capital / 🕐 Tempo / 🧠 Experiência / 📉 Risco",
      "Score meter circular preenchendo em violeta",
      "Logo simulado de banco (XP/BTG style) com label 'modelo suitability'",
    ],
    [
      "Funil se dissolve → transição para logos de marcas (cena 5)",
      "Fade com partículas de roxo para azul",
    ],
    [
      "Analogia com XP Investimentos é chave para o público entender a profundidade do modelo",
      "Não mostrar dados reais de investidores — usar perfis fictícios",
      "Reforçar: o EV só entra após a triagem automática — esse é o ganho de produtividade",
    ]
  ),

  // CENA 5
  sceneBlock("5", "AGENTE KA/EXPANSÃO — MARCAS EM MATCH COM INVESTIDORES", "3:50 – 4:35 | 45 seg", C.sky,
    [
      "Do outro lado da equação estão as marcas e franquias que querem crescer.",
      "O Agente KA organiza todas as marcas em expansão que têm interesse nesta praça.",
      "Cada marca informa seus requisitos: metragem, energia, vizinhança, perfil de parceiro.",
      "E automaticamente, o sistema faz o match com os investidores qualificados pelo Farmer.",
      "O KA humano entra apenas para negociar contratos e aprovar o que estrategicamente importa.",
      "Resultado: o KA passa de operador a arquiteto de valor.",
    ],
    [
      "Logos estilizadas de marcas aparecem no lado esquerdo da tela",
      "Do lado direito: perfis de investidores do Farmer",
      "Linhas de match se formam entre marcas e investidores",
      "Destaque: seta bidirecional dourada com label 'MATCH AUTOMÁTICO'",
      "Zoom na ficha de uma vaga: vitrine digital com foto, m², energia, condições",
      "Barra de scroll animada mostrando a plataforma",
      "Ícone de KA humano aparece: 'KA foca em estratégia e relação 360°'",
    ],
    [
      "Som de 'encaixe' no momento do match — satisfatório, não intrusivo",
      "Música continua mas adiciona melodia mais suave — sensação de harmonia",
    ],
    [
      "Logos de marcas fictícias (ou marcas reais em expansão conhecidas)",
      "Ficha técnica da vaga com todos os campos do Form 01",
      "Porcentagem de compatibilidade animada: '94% fit'",
      "Label 'Integração Sistema Bahia' aparece nos preços",
    ],
    [
      "Vitrine digital se fecha → transição para ícones financeiros (cena 6)",
      "Dissolve com fade azul para âmbar",
    ],
    [
      "Vitrine Digital deve ser mostrada como se fosse um app — layout mobile é mais impactante aqui",
      "Mostrar que mesmo sem o KA, marcas e investidores se encontram — o KA fica livre para o que importa",
    ]
  ),

  // CENA 6
  sceneBlock("6", "PLATAFORMA ALAVANCADOR — SOLUÇÕES FINANCEIRAS", "4:35 – 5:20 | 45 seg", C.amber,
    [
      "Ter o match perfeito não basta se o empreendedor não conseguir viabilizar o negócio.",
      "A Plataforma Alavancador reúne, em um único lugar, tudo que o novo lojista precisa para sair do zero.",
      "Financiamento de obra e capital de giro. Seguros: da obra, da operação, de vida e saúde para a equipe.",
      "Vale alimentação, refeição, maquininha, gateway de pagamento e muito mais.",
      "Tudo integrado. Tudo negociado pelo shopping para o ecossistema de lojistas.",
    ],
    [
      "Fundo âmbar escuro. Ícones financeiros surgem flutuando suavemente",
      "Cada ícone tem label: 💰 Crédito Obra / 💵 Capital de Giro / 🛡 Seguros / ❤️ Saúde / 🍽 VA-VR / 💳 Pagamentos",
      "Ícones se organizam em grid 2x4 com cards individuais",
      "Zoom num card de crédito: taxa, prazo, valor mínimo/máximo",
      "Label 'tudo integrado' aparece com linha conectando todos os cards",
      "Empreendedor fictício clica em 'contratar' num dos cards",
    ],
    [
      "Música: mais suave, confortante — sensação de 'problema resolvido'",
      "Som de notificação positiva ao ativar cada produto",
    ],
    [
      "Moedas/notas digitais flutuando no fundo (sutil, não distrai)",
      "Badge 'Parceiro Negociado pelo Shopping' nos cards",
      "Ícone de CNPJ no topo do perfil do lojista",
      "Barra de progresso 'etapas para abrir a loja' avança ao contratar produtos",
    ],
    [
      "Cards se recolhem → zoom out para planta de loja em construção (cena 7)",
      "Transição: âmbar → coral com efeito de 'construção'",
    ],
    [
      "Enfatizar que os produtos são negociados coletivamente pelo shopping — vantagem competitiva real",
      "Não citar nomes de parceiros financeiros reais sem validação jurídica",
    ]
  ),

  // CENA 7
  sceneBlock("7", "PLATAFORMA BUILDER — DO PROJETO À ABERTURA", "5:20 – 6:05 | 45 seg", C.coral,
    [
      "Com o financiamento resolvido, começa a construção.",
      "A Plataforma Builder é o marketplace de fornecedores especializados em obras em shoppings.",
      "Arquitetura e engenharia. Materiais e acabamentos. Mobiliário e tecnologia para o ponto de venda.",
      "Recrutamento de equipe, folha de pagamento, suporte jurídico para abertura do CNPJ.",
      "Tudo num só lugar. Tudo com fornecedores que já conhecem o manual do lojista do shopping.",
      "Da assinar o contrato à inauguração — menos atrito, menos tempo, mais previsibilidade.",
    ],
    [
      "Animação isométrica de planta baixa vazia que vai sendo construída",
      "Cada elemento da loja aparece conforme mencionado na narração",
      "Prateleiras, balcão, iluminação, maquininha, placa da marca",
      "Ao lado: lista de fornecedores selecionados com avaliações em estrela",
      "Timeline de obra aparece abaixo: 'Projeto: 1 semana / Aprovação: 2 semanas / Obra: 4 semanas'",
      "Loja concluída pulsa suavemente — inauguração",
      "Texto: '7 semanas do contrato à inauguração'",
    ],
    [
      "Som de construção estilizado (não barulhento) — marteladas musicalizadas",
      "Música: ritmo mais acelerado, sensação de progressão e construção",
    ],
    [
      "Ícone de capacete no canto durante animação de construção",
      "Stars de avaliação (4.8★) nos cards de fornecedores",
      "Badge 'Homologado pelo Shopping' em cada fornecedor",
      "Contador de dias regressivo na timeline",
    ],
    [
      "Loja pronta pulsa e se ilumina → transição para cena com clientes entrando (cena 8)",
      "Fade coral → verde menta",
    ],
    [
      "A animação isométrica de construção é o momento mais memorável desta cena — investir em qualidade aqui",
      "O '7 semanas' é um exemplo — validar com o time operacional o tempo real médio",
    ]
  ),

  // CENA 8
  sceneBlock("8", "PLATAFORMA SELLER — VENDENDO MAIS NO SHOPPING", "6:05 – 6:50 | 45 seg", C.mint,
    [
      "A loja está aberta. Agora começa a fase mais importante: vender.",
      "A Plataforma Seller conecta o lojista a todo o arsenal de mídia e relacionamento do shopping.",
      "Telas no corredor, app, programa de benefícios e cashback.",
      "Patrocínio dos grandes eventos: Dia das Mães, Namorados, Black Friday, Natal, a chegada do Papai Noel.",
      "E expansão dos serviços do shopping: Pet Park, Taste Lab, Parquinho, Eletroposto, Área Esportiva.",
      "Quanto mais o shopping cresce, mais o lojista vende. Quanto mais o lojista vende, mais o shopping cresce.",
    ],
    [
      "Visão do shopping por dentro — corredores animados com telas e movimento",
      "Ícones de mídia surgem: 📺 Tela / 📱 App / 🎁 Benefícios",
      "Calendário de eventos aparece com datas destacadas em verde",
      "Ícones de espaços surgem no mapa do shopping: 🐾 🍴 🛝 ⚽ 🚗",
      "Gráfico de vendas do lojista sobe progressivamente",
      "Animação circular final: shopping e lojista em loop de crescimento mútuo",
    ],
    [
      "Música: o mais animado do vídeo — sensação de sucesso e movimento",
      "Som de caixa registradora modernizado (digital, não antiquado)",
      "Aplausos suaves no final desta cena",
    ],
    [
      "Contador de vendas animado subindo",
      "Badge 'Impulsionado pelo Seller' em alguns produtos",
      "Ícone de app com notificação: 'Sua oferta alcançou 12.000 pessoas'",
      "Mapa do shopping com pontos verdes indicando novos espaços",
    ],
    [
      "Cena final de vendas se dissolve → visão aérea do shopping (cena 9)",
      "Transição verde → dourado suave",
    ],
    [
      "Esta cena deve ter o ritmo mais alto do vídeo — energia de conclusão positiva",
      "O loop 'shopping cresce → lojista vende → shopping cresce' é a tese central — dar tempo para processar",
    ]
  ),

  // CENA 9
  sceneBlock("9", "JORNADA END-TO-END — OS 5 PASSOS", "6:50 – 7:35 | 45 seg", C.goldL,
    [
      "Vamos recapitular como tudo se conecta.",
      "Passo 1: Descoberta. Hunter e Farmer identificam oportunidades e leads de fora para dentro e de dentro para fora.",
      "Passo 2: Triagem. O Orquestrador qualifica e pontua. Só chega ao EV o que realmente importa.",
      "Passo 3: Match. KA conecta o investidor certo com a marca certa no ponto certo.",
      "Passo 4: Abertura. Alavancador financia. Builder constrói. Sem burocracia, sem fiador manual.",
      "Passo 5: Crescimento. Seller amplifica. O lojista se torna âncora do ecossistema.",
      "Do interesse à inauguração — acelerado. Do zero à venda — simplificado.",
    ],
    [
      "5 ícones circulares alinhados horizontalmente — apagados inicialmente",
      "Cada ícone se ilumina conforme mencionado na narração, com cor específica",
      "Seta animada conecta ícone 1 → 2 → 3 → 4 → 5",
      "Linha de timeline embaixo dos ícones mostra progressão temporal",
      "Zoom em cada ícone brevemente ao mencioná-lo",
      "Ao final, todos iluminados — diagrama completo pulsa uma vez",
      "Texto central: 'Menos atrito. Mais velocidade. Mais shopping.'",
    ],
    [
      "Música: épica e inspiradora no clímax — orquestração sobre a base eletrônica",
      "Cada ícone que se ilumina tem um som de confirmação ('ding' ascendente)",
      "Silêncio de 1 segundo antes da frase final",
    ],
    [
      "Ícones: 🔍 Descoberta / 🎯 Triagem / 🤝 Match / 🏗 Abertura / 📈 Crescimento",
      "Cores: teal / violeta / azul / âmbar / verde em sequência",
      "Timeline com estimativa: 'semana 1 / semana 2-3 / semana 3-4 / semana 5-12 / ongoing'",
      "Counter de tempo total: 'De 0 a inaugurado: ~8-12 semanas'",
    ],
    [
      "Diagrama persiste → fade para gráfico de barras (cena 10)",
      "Transição dourada suave com brilho",
    ],
    [
      "Esta é a cena de síntese — deve ser mais lenta e clara que as demais",
      "A frase 'Menos atrito. Mais velocidade. Mais shopping.' é o slogan candidato do projeto",
    ]
  ),

  // CENA 10
  sceneBlock("10", "BENCHMARK — A OPORTUNIDADE QUE EXISTE", "7:35 – 8:20 | 45 seg", C.teal,
    [
      "E a oportunidade é maior do que parece.",
      "Sabe quanto o e-commerce representa no varejo dos Estados Unidos — o país mais digital do mundo?",
      "27,5%.",
      "Isso significa que mesmo no pior cenário para o varejo físico...",
      "...a ameaça do e-commerce tem exatamente o mesmo tamanho da oportunidade que ainda não está em shoppings no Brasil.",
      "Não é sobre competir com o digital. É sobre capturar o mercado que já existe e que hoje está na rua.",
      "A meta é clara: sair de menos de 30% para pelo menos 25-30% de penetração real na demanda qualificada.",
      "Com o Shopping Inteligente, esse caminho tem um mapa.",
    ],
    [
      "Gráfico de barras animado cresce da esquerda para a direita",
      "Cada barra aparece em sequência: México 53% → Austrália 51% → EUA 35%",
      "Brasil aparece por último: 28% — barra menor, pulsando em amarelo-dourado",
      "Linha tracejada vermelha surge: 'E-commerce EUA: 27.5%'",
      "Texto de insight: 'A ameaça = A oportunidade'",
      "Seta verde apontando para cima a partir da barra do Brasil: 'META: 25-30%'",
      "Barra do Brasil cresce até a linha da meta — animação de conquista",
    ],
    [
      "Música: resolução harmônica — sensação de 'isso faz sentido'",
      "Som de barras crescendo (suave, como gráfico de EQ)",
      "Acorde final positivo quando o Brasil atinge a meta",
    ],
    [
      "Fontes dos dados visíveis: '* EUA e-commerce 2023 pós-pandemia'",
      "Cores distintas por país nas barras",
      "Porcentagens surgem com animação de contador",
      "Ícone de bandeira discreta ao lado de cada barra",
    ],
    [
      "Barra do Brasil na meta → dissolve para logo do Shopping (encerramento)",
      "Confetes dourados sutis aparecem brevemente",
    ],
    [
      "O dado dos EUA (27.5%) é o mais contraintuitivo e poderoso do vídeo — dar espaço para processar",
      "Validar os dados com fontes: ABRASCE para Brasil, ICSC para EUA/internacional",
    ]
  ),

  // ENCERRAMENTO
  sceneBlock("ENCERRAMENTO", "CALL TO ACTION + PRÓXIMOS PASSOS", "8:20 – 9:00 | 40 seg", C.gold,
    [
      "Shopping Inteligente.",
      "Um sistema de agentes que transforma o processo mais lento do setor no mais eficiente.",
      "Para o investidor: o caminho mais curto para abrir o negócio certo, no lugar certo.",
      "Para a marca: o canal mais direto para expandir com o parceiro ideal.",
      "Para o shopping: mais velocidade, mais ocupação, mais market share.",
      "O futuro do varejo físico é inteligente. E começa aqui.",
    ],
    [
      "Logo do Shopping centralizado com brilho sutil — fade in",
      "Tagline aparece abaixo: 'Menos atrito. Mais velocidade. Mais shopping.'",
      "3 cards flutuam: 'Para Investidores' / 'Para Marcas' / 'Para o Shopping'",
      "Cada card tem uma frase de valor de 1 linha",
      "QR Code aparece no canto — ou URL do portal / link de contato",
      "Fade final para escuro com logo persistindo",
    ],
    [
      "Música: versão final completa — épica, resolução total",
      "Silêncio de 0.5 seg antes de 'O futuro começa aqui'",
      "Fade out da música nos últimos 5 segundos",
    ],
    [
      "Logo em versão horizontal ou quadrado dependendo do formato",
      "QR Code deve ter frame dourado — alinhado ao branding",
      "Contato: e-mail ou WhatsApp do time de expansão",
      "Crédito discreto no rodapé: 'Shopping Inteligente © 2025'",
    ],
    [
      "Fade to black total",
      "Tela preta por 2 segundos antes de cortar",
    ],
    [
      "O encerramento deve ser curto e limpo — sem overload de informação",
      "O QR Code deve levar ao infográfico HTML ou a um link de contato com o time",
      "Validar tagline com o time de marketing antes da produção",
    ]
  ),
];

// ── PRODUCTION GUIDE PAGE ──────────────────────────────
const prodGuide = [
  new Paragraph({ children: [new PageBreak()], spacing: { before: 0, after: 0 } }),
  heading("GUIA DE PRODUÇÃO", HeadingLevel.HEADING_1, C.darkBg, 36),
  divider(C.gold),

  table([
    row([hCell("ESPECIFICAÇÕES TÉCNICAS RECOMENDADAS", C.darkBg, C.gold, CONTENT_W)]),
    row([
      cell([para([txt("Resolução", { bold: true, color: C.grayDk, size: 18 })])], { bg: C.labelBg, w: 2400, mt: 80, mb: 80 }),
      cell([para([txt("1920x1080 (Full HD) ou 3840x2160 (4K) — mínimo 1080p", { size: 18 })])], { bg: C.white, w: 6960, mt: 80, mb: 80 }),
    ]),
    row([
      cell([para([txt("Proporção", { bold: true, color: C.grayDk, size: 18 })])], { bg: C.labelBg, w: 2400, mt: 80, mb: 80 }),
      cell([para([txt("16:9 (landscape) para apresentação em tela. Exportar também 9:16 para stories/reels", { size: 18 })])], { bg: C.white, w: 6960, mt: 80, mb: 80 }),
    ]),
    row([
      cell([para([txt("Taxa de frames", { bold: true, color: C.grayDk, size: 18 })])], { bg: C.labelBg, w: 2400, mt: 80, mb: 80 }),
      cell([para([txt("30fps mínimo — 60fps para animações mais fluidas", { size: 18 })])], { bg: C.white, w: 6960, mt: 80, mb: 80 }),
    ]),
    row([
      cell([para([txt("Idioma / Voz", { bold: true, color: C.grayDk, size: 18 })])], { bg: C.labelBg, w: 2400, mt: 80, mb: 80 }),
      cell([para([txt("Português Brasileiro — sotaque neutro, dicção clara. Voz masculina ou feminina com perfil executivo.", { size: 18 })])], { bg: C.white, w: 6960, mt: 80, mb: 80 }),
    ]),
    row([
      cell([para([txt("Formato de entrega", { bold: true, color: C.grayDk, size: 18 })])], { bg: C.labelBg, w: 2400, mt: 80, mb: 80 }),
      cell([para([txt("MP4 H.264 (compartilhamento) + MOV ProRes (arquivo master)", { size: 18 })])], { bg: C.white, w: 6960, mt: 80, mb: 80 }),
    ]),
    row([
      cell([para([txt("Paleta de cores", { bold: true, color: C.grayDk, size: 18 })])], { bg: C.labelBg, w: 2400, mt: 80, mb: 80 }),
      cell([para([txt("#0D0F14 fundo / #C9A843 dourado / #1FD4B0 teal / #9D7DFA violeta / #3AB6F5 azul / #F5A623 âmbar / #FF7C5C coral / #52E89C verde / #F56060 vermelho", { size: 17 })])], { bg: C.white, w: 6960, mt: 80, mb: 80 }),
    ]),
    row([
      cell([para([txt("Tipografia", { bold: true, color: C.grayDk, size: 18 })])], { bg: C.labelBg, w: 2400, mt: 80, mb: 80 }),
      cell([para([txt("Títulos: Bebas Neue (ou similar condensed bold) | Corpo: DM Sans, Instrument Sans ou Arial", { size: 18 })])], { bg: C.white, w: 6960, mt: 80, mb: 80 }),
    ]),
  ], [2400, 6960]),

  new Paragraph({ children: [], spacing: { before: 240, after: 0 } }),

  table([
    row([hCell("FLUXO DE PRODUÇÃO RECOMENDADO", C.darkBg, C.teal, CONTENT_W)]),
    row([
      cell([para([txt("SEMANA 1", { bold: true, color: C.teal, size: 18 })])], { bg: "EBF9F6", w: 1800, mt: 80, mb: 80 }),
      cell([para([txt("Revisão e aprovação deste storyboard. Definição de ferramenta (Synthesia / HeyGen / After Effects). Seleção de voz off.", { size: 18 })])], { bg: C.white, w: 7560, mt: 80, mb: 80 }),
    ]),
    row([
      cell([para([txt("SEMANA 2", { bold: true, color: C.violet, size: 18 })])], { bg: "F5F0FF", w: 1800, mt: 80, mb: 80 }),
      cell([para([txt("Criação dos assets visuais (motion graphics de cada cena). Gravação da narração. Montagem das cenas 1-5.", { size: 18 })])], { bg: C.white, w: 7560, mt: 80, mb: 80 }),
    ]),
    row([
      cell([para([txt("SEMANA 3", { bold: true, color: C.amber, size: 18 })])], { bg: "FDF4E0", w: 1800, mt: 80, mb: 80 }),
      cell([para([txt("Montagem das cenas 6-10 + encerramento. Inclusão de música e sound design. Primeira versão completa.", { size: 18 })])], { bg: C.white, w: 7560, mt: 80, mb: 80 }),
    ]),
    row([
      cell([para([txt("SEMANA 4", { bold: true, color: C.mint, size: 18 })])], { bg: "EDFBF3", w: 1800, mt: 80, mb: 80 }),
      cell([para([txt("Revisão interna. Ajustes de timing e narração. Aprovação final. Exportação nos formatos definidos.", { size: 18 })])], { bg: C.white, w: 7560, mt: 80, mb: 80 }),
    ]),
  ], [1800, 7560]),

  new Paragraph({ children: [], spacing: { before: 240, after: 0 } }),

  table([
    row([hCell("PROMPT RECOMENDADO PARA SYNTHESIA / HEYGEN", C.darkBg, C.violet, CONTENT_W)]),
    row([
      cell([
        para([txt("Use o seguinte prompt para configurar o avatar e a voz:", { size: 18, color: C.grayDk })], { before: 0, after: 80 }),
        para([txt('"Criar vídeo explicativo corporativo em português brasileiro. Tom: executivo, confiante e inspirador — não formal demais. Ritmo: dinâmico com pausas para absorção. Avatar: profissional de negócios, traje executivo moderno. Fundo: sempre substituir pelo motion graphic de cada cena. Narração seguir exatamente o roteiro de cada cena do storyboard. Usar os timings indicados (45-50 segundos por cena). Duração total aproximada: 9 minutos."', { size: 18, color: "111111", italic: true })], { before: 0, after: 0 }),
      ], { bg: C.white, w: CONTENT_W, mt: 140, mb: 140 }),
    ]),
  ], [CONTENT_W]),
];

// ── BUILD DOCUMENT ──────────────────────────────────────
const allContent = [
  ...coverPage,
  ...tocPage,
  ...scenes.flat(),
  ...prodGuide,
];

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: C.darkBg },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: C.dark1 },
        paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 1 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022",
          alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
      }
    },
    headers: {
      default: {
        options: {
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "SHOPPING INTELIGENTE", font: "Arial", size: 16, bold: true, color: C.gold }),
                new TextRun({ text: "   |   Storyboard & Roteiro de Vídeo", font: "Arial", size: 16, color: C.grayDk }),
                new TextRun({ text: "   |   Confidencial", font: "Arial", size: 16, color: C.grayDk }),
              ],
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.gold, space: 4 } },
              spacing: { before: 0, after: 120 },
            }),
          ]
        }
      }
    },
    children: allContent,
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/home/claude/storyboard_shopping_inteligente.docx', buffer);
  console.log('Done');
});
