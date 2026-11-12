const pptxgen = require("pptxgenjs");

const OUT = process.argv[2] || "Analise-Risco-Casas-Bahia.pptx";

// ---------- Design system ----------
const NAVY = "141B2D";
const NAVY2 = "232C42";
const NAVY3 = "323C56";
const RED = "B3121A";
const RED_T = "F7E7E8";
const AMBER = "C77A12";
const AMBER_T = "FBF0DF";
const GREEN = "2E7D5B";
const GREEN_T = "E6F1EC";
const TINT = "F1F3F7";
const GREY = "5F6A80";
const INK = "1A1F2B";
const WHITE = "FFFFFF";
const RED_L = "F08087";
const AMBER_L = "E8A93F";

const HF = "Cambria";
const BF = "Calibri";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.author = "Análise de Risco — Portfólio de Shopping Centers";
pres.title = "Grupo Casas Bahia — Análise de Risco";

// ---------- Grid ----------
const W = 13.333, H = 7.5, M = 0.62;
const CW = W - 2 * M;                 // 12.093
const C2W = (CW - 0.34) / 2, C2D = C2W + 0.34;   // 2 colunas
const C3W = (CW - 0.44) / 3, C3D = C3W + 0.22;   // 3 colunas
const C4W = (CW - 0.72) / 4, C4D = C4W + 0.24;   // 4 colunas
const KY = 0.44, TY = 0.70, TH = 0.62;           // kicker / título
const FY = 6.96;                                   // rodapé

function head(s, title, kicker, dark) {
  if (kicker) {
    s.addText(kicker.toUpperCase(), {
      x: M, y: KY, w: CW, h: 0.24, fontFace: BF, fontSize: 11,
      bold: true, color: dark ? "E9A6A9" : RED, charSpacing: 2, margin: 0,
    });
  }
  s.addText(title, {
    x: M, y: TY, w: CW, h: TH, fontFace: HF, fontSize: 32,
    bold: true, color: dark ? WHITE : INK, margin: 0, valign: "top",
  });
}

function badge(s, x, y, label, fill, txtColor, d) {
  const dia = d || 0.42;
  s.addShape(pres.ShapeType.ellipse, {
    x, y, w: dia, h: dia, fill: { color: fill }, line: { color: fill },
  });
  s.addText(label, {
    x, y, w: dia, h: dia, align: "center", valign: "middle",
    fontFace: BF, fontSize: dia > 0.5 ? 15 : 12, bold: true,
    color: txtColor || WHITE, margin: 0,
  });
}

function card(s, x, y, w, h, fill, lineColor) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.08,
    fill: { color: fill },
    line: lineColor ? { color: lineColor, width: 1 } : { type: "none" },
  });
}

function footer(s, txt, dark) {
  s.addText(txt, {
    x: M, y: FY, w: CW, h: 0.24, fontFace: BF, fontSize: 9,
    color: dark ? "8B94A8" : "8A93A5", margin: 0,
  });
}

// =====================================================================
// 1. CAPA
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: NAVY };

  s.addShape(pres.ShapeType.ellipse, { x: 9.6, y: -1.5, w: 5.6, h: 5.6, fill: { color: NAVY2 }, line: { type: "none" } });

  badge(s, M, 1.28, "!", RED, WHITE, 0.62);

  s.addText("Grupo Casas Bahia", {
    x: M, y: 2.12, w: 9.2, h: 0.95, fontFace: HF, fontSize: 46, bold: true, color: WHITE, margin: 0,
  });
  s.addText("Risco de reestruturação, RJ e falência — e o que isso significa para quem loca imóveis à rede", {
    x: M, y: 3.08, w: 8.6, h: 0.9, fontFace: BF, fontSize: 18, color: "C3CCDD", margin: 0,
  });
  s.addText("Documento de apoio à decisão · Comitê Comercial e de Investimentos de Shopping Centers", {
    x: M, y: 4.12, w: 8.8, h: 0.3, fontFace: BF, fontSize: 12, color: "94A0B8", margin: 0,
  });
  s.addText("Agosto de 2026 · Base: resultados do 2T26 divulgados em 14/08/2026", {
    x: M, y: 4.42, w: 8.8, h: 0.3, fontFace: BF, fontSize: 12, color: "94A0B8", margin: 0,
  });

  [["R$ 10,1 bi", "prejuízo no 2T26"],
   ["R$ 8,1 bi", "patrimônio líquido negativo"],
   ["298 lojas", "fechadas em 12 meses"]].forEach(([big, small], i) => {
    const x = M + i * C3D;
    card(s, x, 5.35, C3W, 1.24, NAVY2);
    s.addText(big, { x: x + 0.26, y: 5.5, w: C3W - 0.5, h: 0.5, fontFace: HF, fontSize: 26, bold: true, color: WHITE, margin: 0 });
    s.addText(small, { x: x + 0.26, y: 6.02, w: C3W - 0.5, h: 0.42, fontFace: BF, fontSize: 12, color: "A9B4C9", margin: 0 });
  });

  s.addNotes("Deck de apoio à decisão sobre exposição a Casas Bahia no portfólio de shoppings. Base factual: divulgação do 2T26 (14/08/2026), fatos relevantes e noticiário de agosto de 2026.");
}

// =====================================================================
// 2. SUMÁRIO EXECUTIVO
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  head(s, "A leitura em uma página", "Sumário executivo");

  [["Alta", "Nova reestruturação de dívida em 12 meses", RED, RED_T],
   ["Média", "Recuperação judicial em 12 meses", AMBER, AMBER_T],
   ["Baixa", "Falência ou liquidação em 12 meses", GREEN, GREEN_T]].forEach(([big, small, c, t], i) => {
    const x = M + i * C3D;
    card(s, x, 1.56, C3W, 1.44, t);
    s.addText(big, { x: x + 0.26, y: 1.68, w: C3W - 0.5, h: 0.5, fontFace: HF, fontSize: 28, bold: true, color: c, margin: 0 });
    s.addText(small, { x: x + 0.26, y: 2.2, w: C3W - 0.5, h: 0.66, fontFace: BF, fontSize: 12, color: INK, margin: 0 });
  });

  card(s, M, 3.2, CW, 0.98, NAVY);
  s.addText("A empresa não vai desaparecer — mas o contrato de locação, do jeito que está hoje, provavelmente não sobrevive intacto.", {
    x: M + 0.34, y: 3.3, w: CW - 0.68, h: 0.78, fontFace: HF, fontSize: 17, bold: true, color: WHITE, margin: 0, valign: "middle",
  });

  [["1", "O caixa melhorou, a solvência não.", "EBITDA ajustado de R$ 518 mi e fluxo de caixa livre de R$ 798 mi no trimestre convivem com PL negativo de R$ 8,1 bi e capital de giro negativo."],
   ["2", "O auditor não assinou embaixo.", "A EY se absteve de emitir conclusão sobre as informações do 2T26 por incerteza relevante quanto à continuidade operacional."],
   ["3", "A própria companhia colocou RJ na mesa.", "O release admite avaliar nova recuperação extrajudicial ou recuperação judicial para reorganizar a estrutura de capital."],
   ["4", "O ajuste de lojas já começou — e é grande.", "298 lojas fechadas (28,7% da rede) em agosto de 2026. Trate a reocupação como pipeline ativo de prospecção, não como contingência."]].forEach(([n, t, d], i) => {
    const y = 4.42 + i * 0.64;
    badge(s, M, y, n, RED, WHITE, 0.34);
    s.addText([
      { text: t + "  ", options: { bold: true, color: INK } },
      { text: d, options: { color: GREY } },
    ], { x: M + 0.5, y: y - 0.05, w: CW - 0.5, h: 0.56, fontFace: BF, fontSize: 12, margin: 0, valign: "top" });
  });

  footer(s, "Fontes: divulgação de resultados 2T26 do Grupo Casas Bahia (14/08/2026); relatório da EY; noticiário de agosto de 2026.");
}

// =====================================================================
// 3. HISTÓRICO
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  head(s, "Como a empresa chegou até aqui", "Histórico recente");

  s.addText("Não é um choque isolado: é uma deterioração de sete anos, com duas tentativas de reestruturação pelo caminho.", {
    x: M, y: 1.4, w: CW, h: 0.3, fontFace: BF, fontSize: 13, color: GREY, margin: 0,
  });

  [["2019-2022", "Alavancagem na expansão", "Crescimento apoiado em capital de giro, crediário próprio e estoques altos. Juros baixos escondem a fragilidade da estrutura de capital."],
   ["2023", "O ciclo de juros vira", "Selic alta encarece funding e crediário. Concorrência do e-commerce asiático pressiona preço em eletro e móveis. Começa o plano de transformação."],
   ["Jun/2024", "1ª reestruturação: RE homologada", "Recuperação extrajudicial de R$ 4,1 bi homologada em 19/06/2024: 78 meses de prazo, 24 meses de carência de juros e 30 de principal. A 10ª emissão de debêntures substitui a dívida quirografária."],
   ["2025", "Troca de controle via dívida", "A Mapa Capital converte cerca de R$ 1,6 bi de dívida em ações e se torna acionista majoritária. Michael Klein tenta retomar espaço no conselho. Prejuízo do ano em torno de R$ 3 bi."],
   ["1S/2026", "O ajuste vira corte na carne", "Prejuízo de R$ 1,06 bi no 1T26 e reperfilamento da dívida: a 1ª amortização de principal vai de nov/2026 para nov/2027. Em agosto, 298 lojas fechadas e prejuízo de R$ 10,1 bi no 2T26."]]
  .forEach(([per, tit, desc], i) => {
    const y = 1.82 + i * 0.99;
    card(s, M, y, CW, 0.90, i === 4 ? RED_T : TINT);
    s.addText(per, { x: M + 0.28, y: y + 0.15, w: 1.5, h: 0.32, fontFace: BF, fontSize: 12.5, bold: true, color: i === 4 ? RED : NAVY, margin: 0 });
    s.addText(tit, { x: M + 1.9, y: y + 0.1, w: 3.0, h: 0.72, fontFace: HF, fontSize: 14, bold: true, color: INK, margin: 0, valign: "middle" });
    s.addText(desc, { x: M + 5.05, y: y + 0.09, w: CW - 5.35, h: 0.76, fontFace: BF, fontSize: 11, color: GREY, margin: 0, valign: "middle" });
  });

  footer(s, "Fontes: Poder360, Seu Dinheiro, Exame, InvestNews, Investidor10 e divulgações da companhia (2024-2026).");
}

// =====================================================================
// 3B. DECISÕES ESTRATÉGICAS ERRADAS
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  head(s, "As decisões que produziram este balanço", "Erros estratégicos");

  [["Perder a janela digital", "Entre 2016 e 2019 a disputa societária entre Casino, GPA e a família Klein consumiu a atenção e o investimento da companhia. Magazine Luiza e Americanas usaram exatamente esse período para construir e-commerce e malha logística. O atraso nunca foi recuperado."],
   ["Comprar tecnologia no topo do ciclo", "ASAP Log e banQi em 2020, i9XP e 16,6% do Distrito no fim do mesmo ano, logtech CNT em 2022. Capital alocado em fintech e logtech às vésperas do aperto monetário. Boa parte desse ágio virou os R$ 971 mi de impairment reconhecidos no 2T26."],
   ["Manter rede e crediário superdimensionados", "Mais de mil lojas e uma carteira de carnê própria exigem capital de giro permanente. Com a Selic baixa isso era vantagem competitiva; com a Selic alta o mesmo modelo virou o principal consumidor de caixa da companhia."],
   ["Reposicionar a marca sem resolver a estrutura", "A troca de Via para Grupo Casas Bahia em 2023 e a reorganização de Ponto e Extra.com.br custaram caro em marketing e sistemas sem entregar tráfego novo. Marca nova não corrige estrutura de capital."],
   ["Financiar operação esticando fornecedor", "Alongar prazo de pagamento resolveu caixa no curto prazo e queimou confiança da cadeia justamente quando ela seria mais necessária. Fornecedor desconfiado encurta prazo — e o problema volta maior."],
   ["Chegar tarde à reestruturação", "A recuperação extrajudicial de R$ 4,1 bi só veio em 2024, depois de o custo da dívida já ter consumido a margem. A carência de 24 a 30 meses comprou tempo, não solvência: dois anos depois a companhia está de novo na mesa."]]
  .forEach(([t, d], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = M + col * C3D, y = 1.5 + row * 2.62;
    card(s, x, y, C3W, 2.46, TINT);
    badge(s, x + 0.24, y + 0.2, String(i + 1), RED, WHITE, 0.34);
    s.addText(t, { x: x + 0.24, y: y + 0.64, w: C3W - 0.48, h: 0.52, fontFace: BF, fontSize: 13, bold: true, color: INK, margin: 0, valign: "top" });
    s.addText(d, { x: x + 0.24, y: y + 1.18, w: C3W - 0.48, h: 1.16, fontFace: BF, fontSize: 10, color: GREY, margin: 0, valign: "top" });
  });

  footer(s, "Fontes: Baguete, NeoFeed, Forbes Brasil, Central do Varejo e histórico institucional da companhia (2020-2024).");
}

// =====================================================================
// 3C. VENDA DE ATIVOS E PARCERIAS
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  head(s, "Vender o imóvel e vender no canal do concorrente", "Venda de ativos e parcerias");

  s.addText("Os dois movimentos mais recentes da companhia dizem mais ao locador do que qualquer projeção de resultado.", {
    x: M, y: 1.4, w: CW, h: 0.3, fontFace: BF, fontSize: 13, color: GREY, margin: 0,
  });

  card(s, M, 1.84, C2W, 3.6, TINT);
  badge(s, M + 0.28, 2.04, "A", NAVY, WHITE, 0.4);
  s.addText("Venda de ativos", { x: M + 0.78, y: 2.02, w: C2W - 1.1, h: 0.42, fontFace: HF, fontSize: 16, bold: true, color: INK, margin: 0, valign: "middle" });
  s.addText([
    { text: "Sale and leaseback de sete imóveis próprios, incluindo uma megaloja de 9.000 m² na Marginal Tietê, anunciado após a entrada da Mapa Capital no controle.", options: { bullet: true, breakLine: true } },
    { text: "A venda é condicionada a contratos de locação de longo prazo: a loja permanece no lugar, mas a companhia deixa de ser dona do imóvel.", options: { bullet: true, breakLine: true } },
    { text: "Objetivo declarado: reduzir dívida e buscar margem EBITDA de dois dígitos.", options: { bullet: true } },
  ], { x: M + 0.28, y: 2.56, w: C2W - 0.56, h: 1.66, fontFace: BF, fontSize: 11, color: INK, margin: 0, paraSpaceAfter: 7, valign: "top" });
  card(s, M + 0.28, 4.3, C2W - 0.56, 0.96, NAVY);
  s.addText("Leitura: a companhia está convertendo imóvel próprio em despesa de aluguel. Isso aumenta — não reduz — a fatia de custo fixo que passa pela mesa de locação.", {
    x: M + 0.46, y: 4.4, w: C2W - 0.92, h: 0.76, fontFace: BF, fontSize: 10.5, bold: true, color: WHITE, margin: 0, valign: "middle" });

  card(s, M + C2D, 1.84, C2W, 3.6, TINT);
  badge(s, M + C2D + 0.28, 2.04, "B", NAVY, WHITE, 0.4);
  s.addText("Parcerias estratégicas", { x: M + C2D + 0.78, y: 2.02, w: C2W - 1.1, h: 0.42, fontFace: HF, fontSize: 16, bold: true, color: INK, margin: 0, valign: "middle" });
  s.addText([
    { text: "Mercado Livre desde out/2025, Amazon desde mar/2026 e Shopee: no 4T25 esses canais já eram 5% do GMV e responderam por quase metade do crescimento do e-commerce.", options: { bullet: true, breakLine: true } },
    { text: "CB Full unifica fulfillment, transporte e operação logística sob uma marca só, abrindo a estrutura para terceiros.", options: { bullet: true, breakLine: true } },
    { text: "Bradesco segue como parceiro de cartão e crediário, relação que vem de 2005.", options: { bullet: true } },
  ], { x: M + C2D + 0.28, y: 2.56, w: C2W - 0.56, h: 1.66, fontFace: BF, fontSize: 11, color: INK, margin: 0, paraSpaceAfter: 7, valign: "top" });
  card(s, M + C2D + 0.28, 4.3, C2W - 0.56, 0.96, NAVY);
  s.addText("Leitura: cada avanço dessas parcerias reduz o papel estratégico da loja. Se o cliente compra na Amazon e recebe pelo CB Full, a loja vira ponto de retirada — e ponto de retirada não paga aluguel de âncora.", {
    x: M + C2D + 0.46, y: 4.4, w: C2W - 0.92, h: 0.76, fontFace: BF, fontSize: 10.5, bold: true, color: WHITE, margin: 0, valign: "middle" });

  card(s, M, 5.62, CW, 0.94, RED);
  s.addText("O sinal combinado é inequívoco: a companhia está monetizando metro quadrado e migrando venda para canais de terceiros. Nenhum dos dois movimentos aumenta a disposição de pagar aluguel de loja âncora.", {
    x: M + 0.34, y: 5.72, w: CW - 0.68, h: 0.74, fontFace: BF, fontSize: 12.5, bold: true, color: WHITE, margin: 0, valign: "middle",
  });

  footer(s, "Fontes: Exame INSIGHT, NeoFeed, Forbes Brasil, E-Commerce Brasil, Seu Dinheiro, Genial e materiais institucionais do grupo (2025-2026).");
}

// =====================================================================
// 4. 2T26
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  head(s, "O 2T26 tem dois números opostos", "Última divulgação de resultado");

  card(s, M, 1.5, C2W, 1.46, RED_T);
  s.addText("R$ 10,1 bi", { x: M + 0.3, y: 1.62, w: C2W - 0.6, h: 0.55, fontFace: HF, fontSize: 30, bold: true, color: RED, margin: 0 });
  s.addText("Prejuízo líquido contábil — contra R$ 555 mi no 2T25. Dos quais cerca de R$ 9,1 bi são efeitos não recorrentes, sem impacto de caixa no trimestre.", {
    x: M + 0.3, y: 2.16, w: C2W - 0.58, h: 0.74, fontFace: BF, fontSize: 11.5, color: INK, margin: 0,
  });

  card(s, M + C2D, 1.5, C2W, 1.46, AMBER_T);
  s.addText("R$ 978 mi", { x: M + C2D + 0.3, y: 1.62, w: C2W - 0.6, h: 0.55, fontFace: HF, fontSize: 30, bold: true, color: AMBER, margin: 0 });
  s.addText("Prejuízo ajustado, ou seja, o que sobra depois de retirar o ruído contábil. Cresceu 76% contra o mesmo trimestre de 2025.", {
    x: M + C2D + 0.3, y: 2.16, w: C2W - 0.58, h: 0.74, fontFace: BF, fontSize: 11.5, color: INK, margin: 0,
  });

  s.addChart(pres.ChartType.bar, [{
    name: "R$ bilhões",
    labels: ["Imobilizado", "Reestruturação", "Impairment de ágio", "Contingências contratuais", "Ativos fiscais diferidos"],
    values: [0.21, 0.50, 0.97, 1.80, 5.70],
  }], {
    x: M, y: 3.18, w: 6.86, h: 3.4,
    barDir: "bar",
    showTitle: true, title: "Composição dos R$ 9,1 bi não recorrentes (R$ bi)",
    titleFontFace: BF, titleFontSize: 13, titleColor: INK, titleAlign: "left",
    chartColors: [NAVY, NAVY, NAVY, RED, RED], varyColors: true,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontFace: BF,
    dataLabelFontSize: 10, dataLabelColor: INK, dataLabelFormatCode: "0.00",
    catAxisLabelFontFace: BF, catAxisLabelFontSize: 10, catAxisLabelColor: GREY,
    valAxisLabelFontFace: BF, valAxisLabelFontSize: 9, valAxisLabelColor: GREY,
    valGridLine: { color: "E3E7EE", size: 1 }, catGridLine: { style: "none" },
    showLegend: false, barGapWidthPct: 55, valAxisMaxVal: 7,
  });

  const RX = M + 7.16, RW = 4.93;
  s.addText("Do lado operacional, o plano está funcionando", {
    x: RX, y: 3.18, w: RW, h: 0.3, fontFace: BF, fontSize: 13, bold: true, color: INK, margin: 0,
  });
  [["Receita líquida", "R$ 7,0 bi", "+1,6% a/a", GREEN],
   ["Margem bruta", "32,9%", "+2,8 p.p.", GREEN],
   ["EBITDA ajustado", "R$ 518 mi", "-9,4% a/a", AMBER],
   ["Fluxo de caixa livre", "R$ 798 mi", "+R$ 625 mi", GREEN],
   ["Dívida líquida (12m)", "-R$ 3,8 bi", "-76%", GREEN]].forEach(([k, v, d, c], i) => {
    const y = 3.6 + i * 0.58;
    card(s, RX, y, RW, 0.5, TINT);
    s.addText(k, { x: RX + 0.2, y: y + 0.02, w: 2.25, h: 0.46, fontFace: BF, fontSize: 11.5, color: GREY, margin: 0, valign: "middle" });
    s.addText(v, { x: RX + 2.5, y: y + 0.02, w: 1.3, h: 0.46, fontFace: BF, fontSize: 12.5, bold: true, color: INK, margin: 0, valign: "middle", align: "right" });
    s.addText(d, { x: RX + 3.85, y: y + 0.02, w: 0.88, h: 0.46, fontFace: BF, fontSize: 11, bold: true, color: c, margin: 0, valign: "middle", align: "right" });
  });

  footer(s, "Fonte: divulgação de resultados 2T26 do Grupo Casas Bahia; Money Times; Times Brasil; Brazil Journal.");
}

// =====================================================================
// 5. SOLVÊNCIA (DARK)
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  head(s, "O problema não é o trimestre. É o balanço.", "Radiografia de solvência", true);

  [["PL negativo", "R$ 8,1 bi", "Prejuízos acumulados consumiram todo o patrimônio. Em termos contábeis, a empresa vale menos que zero."],
   ["Capital de giro", "Negativo", "Obrigações de curto prazo superam os ativos de curto prazo — a definição prática de dependência de refinanciamento."],
   ["Valor de mercado", "~R$ 0,7 bi", "Ação em torno de R$ 0,66, com queda superior a 65% no ano. O mercado precifica reestruturação, não recuperação."],
   ["Rede de lojas", "~740", "Contra 1.042 no fim de 2025. A base de contratos de locação encolheu quase um terço em um único movimento."]]
  .forEach(([t, v, d], i) => {
    const x = M + i * C4D;
    card(s, x, 1.56, C4W, 2.3, NAVY2);
    s.addText(t.toUpperCase(), { x: x + 0.22, y: 1.74, w: C4W - 0.44, h: 0.26, fontFace: BF, fontSize: 10, bold: true, color: "8FA0BE", charSpacing: 1, margin: 0 });
    s.addText(v, { x: x + 0.22, y: 2.02, w: C4W - 0.4, h: 0.52, fontFace: HF, fontSize: 24, bold: true, color: WHITE, margin: 0 });
    s.addText(d, { x: x + 0.22, y: 2.58, w: C4W - 0.44, h: 1.14, fontFace: BF, fontSize: 10.5, color: "B4BFD3", margin: 0 });
  });

  card(s, M, 4.1, CW, 1.9, RED);
  badge(s, M + 0.34, 4.36, "EY", NAVY, WHITE, 0.5);
  s.addText("A EY se absteve de emitir conclusão sobre as informações financeiras do 2T26", {
    x: M + 1.0, y: 4.32, w: CW - 1.4, h: 0.4, fontFace: HF, fontSize: 17, bold: true, color: WHITE, margin: 0,
  });
  s.addText("O parecer aponta capital de giro negativo e patrimônio líquido negativo de R$ 8,27 bi e conclui que esses e outros fatores indicam incerteza relevante capaz de gerar dúvida significativa sobre a continuidade operacional. Para um locador, essa é a sinalização mais dura do documento: o auditor independente não se dispôs a atestar que a empresa continua operando no horizonte de 12 meses.", {
    x: M + 1.0, y: 4.78, w: CW - 1.4, h: 1.1, fontFace: BF, fontSize: 11.5, color: "FBE4E5", margin: 0,
  });

  s.addText("Leitura para o comitê: caixa operacional melhor não impede um pedido de proteção judicial — a maior parte dos pedidos de RJ no varejo brasileiro ocorre com EBITDA positivo e estrutura de capital quebrada.", {
    x: M, y: 6.22, w: CW, h: 0.48, fontFace: BF, fontSize: 11.5, italic: true, color: "AEB9CE", margin: 0,
  });

  footer(s, "Fontes: relatório da EY sobre o 2T26; Economic News Brasil; Investidor10; Status Invest (cotação em ago/2026).", true);
}

// =====================================================================
// 6. NOTÍCIAS RECENTES
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  head(s, "O que aconteceu nas últimas semanas", "Notícias recentes · agosto de 2026");

  [["298", "Lojas fechadas em 12 meses — 28,7% da rede", "Inclui unidades em shopping centers, como Conjunto Nacional e Taguatinga Shopping, em Brasília. A seleção priorizou lojas com menor rentabilidade, não menor faturamento.", RED],
   ["1,9 mil", "Desligamentos comunicados em 13 e 14 de agosto", "Com estimativas de mercado de até 3 mil no total do ciclo. R$ 502 mi foram provisionados em reestruturação no trimestre.", AMBER],
   ["RJ", "A companhia admitiu avaliar recuperação judicial", "O release cita nova recuperação extrajudicial ou RJ como alternativas para reorganizar a estrutura de capital. Não há decisão anunciada.", RED],
   ["85%", "Controle concentrado na Mapa Capital", "Após converter cerca de R$ 1,6 bi de dívida em ações em 2025. Um controlador de origem credora tende a priorizar recuperação de capital sobre preservação de rede física.", AMBER]]
  .forEach(([n, t, d, c], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * C2D, y = 1.52 + row * 2.4;
    card(s, x, y, C2W, 2.2, TINT);
    s.addText(n, { x: x + 0.3, y: y + 0.18, w: 1.9, h: 0.6, fontFace: HF, fontSize: 30, bold: true, color: c, margin: 0, valign: "middle" });
    s.addText(t, { x: x + 0.3, y: y + 0.84, w: C2W - 0.6, h: 0.5, fontFace: BF, fontSize: 13, bold: true, color: INK, margin: 0, valign: "top" });
    s.addText(d, { x: x + 0.3, y: y + 1.36, w: C2W - 0.6, h: 0.72, fontFace: BF, fontSize: 11, color: GREY, margin: 0, valign: "top" });
  });

  s.addText("Sinal relevante: o reperfilamento aprovado em 2026 empurrou a primeira amortização de principal das debêntures de nov/2026 para nov/2027, com séries alongadas até 2050. É prazo comprado — não dívida resolvida.", {
    x: M, y: 6.32, w: CW, h: 0.42, fontFace: BF, fontSize: 11.5, italic: true, color: NAVY, margin: 0,
  });

  footer(s, "Fontes: Poder360, Gazeta do Povo, InvestNews, Correio Braziliense, Money Times, Investidor10 e Seu Dinheiro (2025-2026).");
}

// =====================================================================
// 7. CENÁRIOS
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  head(s, "Cinco desfechos possíveis em 12 a 24 meses", "Cenários");

  s.addChart(pres.ChartType.bar, [{
    name: "Probabilidade estimada",
    labels: ["Falência / liquidação", "Fechamento de capital", "Venda de controle ou ativos", "Recuperação judicial", "Nova reestruturação extrajudicial"],
    values: [8, 20, 30, 35, 55],
  }], {
    x: M, y: 1.5, w: 6.6, h: 4.5,
    barDir: "bar",
    showTitle: true, title: "Probabilidade estimada em 12-24 meses (%)",
    titleFontFace: BF, titleFontSize: 13, titleColor: INK, titleAlign: "left",
    chartColors: [RED, AMBER, AMBER, RED, NAVY], varyColors: true,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontFace: BF,
    dataLabelFontSize: 11, dataLabelColor: INK, dataLabelFormatCode: '0"%"',
    catAxisLabelFontFace: BF, catAxisLabelFontSize: 10.5, catAxisLabelColor: INK,
    valAxisLabelFontFace: BF, valAxisLabelFontSize: 9, valAxisLabelColor: GREY,
    valGridLine: { color: "E3E7EE", size: 1 }, catGridLine: { style: "none" },
    showLegend: false, barGapWidthPct: 50, valAxisMaxVal: 70,
  });

  const DX = M + 6.86, TX = M + 7.12, TW = 4.95;
  [["Nova RE extrajudicial", "Caminho de menor atrito e já testado em 2024. Atinge sobretudo credores financeiros; locadores normalmente ficam fora do escopo.", NAVY],
   ["Recuperação judicial", "Entra na mesa se fornecedores travarem crédito ou se a adesão dos credores financeiros não se formar. Aí o aluguel vencido entra no plano.", RED],
   ["Venda ou cisão de ativos", "Venda de partes — crediário, marca, e-commerce, imóveis — ou entrada de sócio operacional. O perfil do controlador favorece esse desfecho.", AMBER],
   ["Fechamento de capital", "Com 85% em um único acionista e ação a ~R$ 0,66, o custo de fechar capital é baixo. Efeito para o locador: menos transparência e menos aviso prévio.", AMBER],
   ["Falência", "Improvável no curto prazo — há EBITDA positivo, caixa operacional e controlador capitalizado. Vira risco real apenas se a RJ fracassar.", GREEN]]
  .forEach(([t, d, c], i) => {
    const y = 1.5 + i * 0.92;
    s.addShape(pres.ShapeType.ellipse, { x: DX, y: y + 0.13, w: 0.16, h: 0.16, fill: { color: c }, line: { type: "none" } });
    s.addText(t, { x: TX, y: y, w: TW, h: 0.28, fontFace: BF, fontSize: 12.5, bold: true, color: INK, margin: 0 });
    s.addText(d, { x: TX, y: y + 0.28, w: TW, h: 0.62, fontFace: BF, fontSize: 10.5, color: GREY, margin: 0 });
  });

  footer(s, "Probabilidades são estimativas do analista calibradas por informações públicas até 16/08/2026, não são cenários oficiais da companhia, e os eventos não são mutuamente exclusivos.");
}

// =====================================================================
// 7B. EXPOSIÇÃO DAS ADMINISTRADORAS
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  head(s, "Quem tem mais a perder no setor de shoppings", "Exposição por administradora");

  [["Alta exposição", "Allos · Partage · Ancar Ivanhoe · General Shopping · HBR", "Portfólios com peso relevante em ativos médios e regionais de perfil popular — exatamente o terreno onde a rede concentra lojas.", RED, RED_T],
   ["Exposição média", "Syn · Iguatemi", "Presença em ativos médios, mas com carteira mais concentrada em shoppings dominantes, onde a reposição de uma âncora é mais rápida.", AMBER, AMBER_T],
   ["Baixa exposição", "Multiplan · JHSF", "Portfólio dominante e de alta renda. Pouca ou nenhuma presença da rede, e fila de interessados em qualquer ABL que vague.", GREEN, GREEN_T]]
  .forEach(([t, cos, d, c, tt], i) => {
    const y = 1.5 + i * 1.42;
    card(s, M, y, 7.2, 1.3, tt);
    s.addText(t.toUpperCase(), { x: M + 0.3, y: y + 0.14, w: 3.0, h: 0.26, fontFace: BF, fontSize: 10, bold: true, color: c, charSpacing: 1, margin: 0 });
    s.addText(cos, { x: M + 0.3, y: y + 0.4, w: 6.6, h: 0.34, fontFace: HF, fontSize: 14, bold: true, color: INK, margin: 0 });
    s.addText(d, { x: M + 0.3, y: y + 0.76, w: 6.6, h: 0.46, fontFace: BF, fontSize: 10.5, color: GREY, margin: 0, valign: "top" });
  });

  const RX = M + 7.54, RW = CW - 7.54;
  card(s, RX, 1.5, RW, 2.22, NAVY);
  s.addText("O melhor proxy público que existe", { x: RX + 0.3, y: 1.64, w: RW - 0.6, h: 0.34, fontFace: BF, fontSize: 12.5, bold: true, color: WHITE, margin: 0 });
  s.addText("58% da receita da Allos vem de shoppings que venderam menos de R$ 1 bi em 12 meses, contra 41% na Iguatemi e 27% na Multiplan. Como a rede se concentra em shoppings populares e de médio porte, esse indicador ordena a exposição melhor do que qualquer estimativa de número de lojas.", {
    x: RX + 0.3, y: 2.0, w: RW - 0.6, h: 1.6, fontFace: BF, fontSize: 10.5, color: "BCC7DA", margin: 0, valign: "top" });

  card(s, RX, 3.86, RW, 1.94, TINT);
  s.addText("Fechamentos já confirmados em shopping", { x: RX + 0.3, y: 4.0, w: RW - 0.6, h: 0.34, fontFace: BF, fontSize: 12.5, bold: true, color: INK, margin: 0 });
  s.addText("Conjunto Nacional e Taguatinga Shopping (DF), Midway Mall e Partage Norte Shopping (Natal), Partage Shopping Campos (RJ) e o encerramento de todas as lojas em shoppings de Salvador, sem aviso prévio ao mercado.", {
    x: RX + 0.3, y: 4.36, w: RW - 0.6, h: 1.32, fontFace: BF, fontSize: 10.5, color: GREY, margin: 0, valign: "top" });

  s.addText("Ressalva importante: este é um ranking de perfil de portfólio, não uma contagem de contratos. Nenhuma administradora divulga publicamente quantas lojas da rede opera — cada companhia precisa levantar o próprio cadastro de lojistas antes de dimensionar a exposição.", {
    x: M, y: 6.0, w: CW, h: 0.6, fontFace: BF, fontSize: 11, italic: true, color: NAVY, margin: 0, valign: "top",
  });

  footer(s, "Fontes: Bradesco BBI via Seu Dinheiro (perfil de ativos por administradora); A Tarde, Portal N10, Correio Braziliense e Gazeta do Povo (fechamentos de agosto de 2026).");
}

// =====================================================================
// 8. REGIMES (DARK)
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  head(s, "O que muda para o locador em cada regime", "Mecânica jurídica", true);

  [["Recuperação extrajudicial", "Só atinge as classes de credores que o devedor decidir incluir — em 2024 foram os credores financeiros quirografários. O contrato de locação segue normal, com aluguel exigível, despejo disponível e garantias íntegras.", "Impacto direto baixo. O risco é indireto: pressão para renegociar aluguel e sinalização de fragilidade.", GREEN],
   ["Recuperação judicial", "Aluguéis vencidos até a data do pedido viram crédito concursal e entram no plano, com deságio e alongamento. Os posteriores são extraconcursais e devem ser pagos em dia. A multa por rescisão antecipada também é concursal.", "Impacto alto sobre o passado e moderado sobre o futuro — desde que o locador cobre disciplina de pagamento pós-pedido.", RED],
   ["Falência", "O contrato pode ser denunciado pelo administrador judicial. O imóvel é devolvido, mas em geral com passivo de condomínio, FPP e reformas em aberto. O crédito de aluguel é quirografário — na prática, recuperação próxima de zero.", "Impacto severo, com o único mérito de liberar o ponto rapidamente para recomercialização.", RED]]
  .forEach(([t, d, v, c], i) => {
    const x = M + i * C3D;
    card(s, x, 1.5, C3W, 3.72, NAVY2);
    badge(s, x + 0.26, 1.74, String(i + 1), c, WHITE, 0.36);
    s.addText(t, { x: x + 0.68, y: 1.68, w: C3W - 0.9, h: 0.5, fontFace: HF, fontSize: 14, bold: true, color: WHITE, margin: 0, valign: "middle" });
    s.addText(d, { x: x + 0.26, y: 2.24, w: C3W - 0.52, h: 1.5, fontFace: BF, fontSize: 11, color: "BCC7DA", margin: 0, valign: "top" });
    card(s, x + 0.26, 3.8, C3W - 0.52, 1.24, NAVY3);
    s.addText(v, { x: x + 0.44, y: 3.9, w: C3W - 0.88, h: 1.04, fontFace: BF, fontSize: 10.5, bold: true, color: WHITE, margin: 0, valign: "middle" });
  });

  card(s, M, 5.44, CW, 0.94, RED);
  s.addText("A diferença decisiva para o locador é a data: o que vencer antes do pedido vira crédito de plano; o que vencer depois continua sendo dívida normal, exigível e com despejo disponível.", {
    x: M + 0.34, y: 5.54, w: CW - 0.68, h: 0.74, fontFace: BF, fontSize: 12.5, bold: true, color: WHITE, margin: 0, valign: "middle",
  });
  s.addText("Base legal: Lei 11.101/2005, arts. 49, 49 §1º, 59 e 161 e seguintes; Tema Repetitivo 1051 do STJ — o crédito se define pela data do fato gerador.", {
    x: M, y: 6.52, w: CW, h: 0.34, fontFace: BF, fontSize: 11, italic: true, color: "AEB9CE", margin: 0,
  });

  footer(s, "Este material é análise de risco de negócio e não substitui parecer jurídico sobre contratos específicos.", true);
}

// =====================================================================
// 9. DESPEJO
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  head(s, "Se ela pedir RJ, eu consigo retomar a loja?", "Despejo, essencialidade e stay period");

  [["A ação de despejo não se submete ao juízo universal", "O STJ consolidou que a competência para o despejo permanece na vara cível de origem. O locador não precisa se habilitar e esperar o plano para retomar o imóvel — o bem é de terceiro e não integra o patrimônio da recuperanda.", GREEN, "+"],
   ["Mas o juízo recuperacional pode declarar o bem essencial", "Embora não julgue o despejo, o juízo da recuperação é competente para decidir sobre a essencialidade do bem à atividade. Uma loja âncora relevante pode ser declarada essencial e a desocupação, sustada durante o stay period de 180 dias, prorrogável.", AMBER, "!"],
   ["Aluguel vencido antes do pedido entra no plano", "Pelo Tema 1051 do STJ, o que define a sujeição é a data do fato gerador. Aluguéis vencidos até o pedido sofrem deságio e alongamento; os posteriores são extraconcursais e exigíveis normalmente.", RED, "$"],
   ["Garantias de terceiros continuam íntegras", "Pelo art. 49 §1º, fiança bancária, seguro-fiança e fiadores pessoas físicas não são atingidos pela RJ da locatária. Quem tem garantia real ou fidejussória de terceiro cobra fora do processo.", GREEN, "+"]]
  .forEach(([t, d, c, ic], i) => {
    const y = 1.5 + i * 1.16;
    card(s, M, y, CW, 1.06, i % 2 === 0 ? TINT : WHITE, i % 2 === 0 ? null : "E1E5EC");
    badge(s, M + 0.28, y + 0.34, ic, c, WHITE, 0.42);
    s.addText(t, { x: M + 0.9, y: y + 0.1, w: 4.5, h: 0.86, fontFace: BF, fontSize: 13, bold: true, color: INK, margin: 0, valign: "middle" });
    s.addText(d, { x: M + 5.6, y: y + 0.08, w: CW - 5.9, h: 0.9, fontFace: BF, fontSize: 11, color: GREY, margin: 0, valign: "middle" });
  });

  s.addText("Conclusão prática: o risco jurídico de perder o imóvel não é o principal. O risco é econômico — ficar de 6 a 24 meses com ABL travada, sem aluguel corrente, e com um crédito passado que vale centavos.", {
    x: M, y: 6.22, w: CW, h: 0.44, fontFace: BF, fontSize: 12, bold: true, color: RED, margin: 0,
  });

  footer(s, "Fontes: jurisprudência do STJ sobre despejo e recuperação judicial (Migalhas, ConJur); Lei 11.101/2005.");
}

// =====================================================================
// 10. RISCOS DO LOCADOR
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  head(s, "Os oito riscos de quem loca imóvel à rede", "Exposição do locador");

  [["Renegociação sob pressão", "O risco mais provável e mais imediato: pedido de redução do aluguel mínimo, migração para percentual sobre vendas e carência, com a saída da loja como alternativa implícita.", "Muito alto", RED],
   ["Devolução seletiva do ponto", "A empresa já mostrou disposição de fechar 28,7% da rede de uma vez, incluindo lojas em shopping. Toda unidade abaixo da meta de rentabilidade é candidata.", "Alto", RED],
   ["Inadimplência e crédito concursal", "Aluguéis vencidos antes de um eventual pedido de RJ sofrem deságio e alongamento. A recuperação típica de crédito quirografário no varejo fica bem abaixo do valor de face.", "Médio-alto", AMBER],
   ["Vacância de ABL grande", "Lojas de eletro e móveis ocupam milhares de m², muitas vezes em pavimentos de menor valor. A reposição exige subdivisão, capex de adequação e prazo longo.", "Alto", RED],
   ["Perda de fluxo e efeito cascata", "Como âncora, a saída derruba o fluxo no piso e aciona cláusulas de co-tenancy e revisionais de satélites vizinhos. O prejuízo passa do contrato para o entorno.", "Médio-alto", AMBER],
   ["Passivos deixados para trás", "Condomínio, FPP, energia e obras de recomposição em aberto na devolução. Em cenário de falência, esses valores dificilmente são recuperados.", "Médio", AMBER],
   ["Impacto contábil e de laudo", "A queda de NOI reduz o FFO e afeta a avaliação do ativo. Contratos com locatário em incerteza de continuidade tendem a exigir provisão para perdas esperadas.", "Médio", AMBER],
   ["Assimetria de informação", "Um eventual fechamento de capital elimina fatos relevantes, ITRs e calls trimestrais — a fonte pública de alerta antecipado do locador desaparece.", "Médio", AMBER]]
  .forEach(([t, d, lv, c], i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const x = M + col * C4D, y = 1.5 + row * 2.6;
    card(s, x, y, C4W, 2.4, TINT);
    badge(s, x + 0.22, y + 0.2, String(i + 1), c, WHITE, 0.34);
    s.addText(lv.toUpperCase(), { x: x + 0.62, y: y + 0.24, w: C4W - 0.84, h: 0.26, fontFace: BF, fontSize: 9, bold: true, color: c, charSpacing: 1, margin: 0, align: "right" });
    s.addText(t, { x: x + 0.22, y: y + 0.6, w: C4W - 0.44, h: 0.54, fontFace: BF, fontSize: 12.5, bold: true, color: INK, margin: 0, valign: "top" });
    s.addText(d, { x: x + 0.22, y: y + 1.16, w: C4W - 0.44, h: 1.12, fontFace: BF, fontSize: 9.8, color: GREY, margin: 0, valign: "top" });
  });

  footer(s, "Classificação de severidade estimada para um portfólio típico de shopping centers com lojas da rede.");
}

// =====================================================================
// 11. PRECEDENTE HSLG11
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  head(s, "Já existe um precedente da renegociação", "Caso de referência · HSI Logística (HSLG11)");

  s.addText("Um fundo imobiliário com galpões locados à rede renegociou contratos para ajustar preços e reduzir dependência. O desenho do acordo é o melhor guia disponível do que a companhia vai pedir — e do que é possível obter em troca.", {
    x: M, y: 1.4, w: CW, h: 0.46, fontFace: BF, fontSize: 12.5, color: GREY, margin: 0,
  });

  [["Contagem (MG)", "R$ 35,98/m²", "R$ 30,00/m²", "-17% no aluguel: o ativo estava acima do valor de mercado.", RED],
   ["São José dos Pinhais (PR)", "R$ 13,00/m²", "R$ 18,50/m²", "+42%: onde o contrato estava defasado, o locador ganhou.", GREEN]]
  .forEach(([loc, de, para, obs, c], i) => {
    const x = M + i * C2D;
    card(s, x, 2.0, C2W, 1.84, TINT);
    s.addText(loc, { x: x + 0.3, y: 2.14, w: C2W - 0.6, h: 0.32, fontFace: BF, fontSize: 13, bold: true, color: INK, margin: 0 });
    s.addText("de", { x: x + 0.3, y: 2.56, w: 0.5, h: 0.3, fontFace: BF, fontSize: 10, color: GREY, margin: 0 });
    s.addText(de, { x: x + 0.3, y: 2.8, w: 2.1, h: 0.42, fontFace: HF, fontSize: 18, bold: true, color: GREY, margin: 0 });
    s.addText("→", { x: x + 2.4, y: 2.78, w: 0.5, h: 0.42, fontFace: BF, fontSize: 18, bold: true, color: c, margin: 0 });
    s.addText("para", { x: x + 2.94, y: 2.56, w: 0.7, h: 0.3, fontFace: BF, fontSize: 10, color: GREY, margin: 0 });
    s.addText(para, { x: x + 2.94, y: 2.8, w: 2.2, h: 0.42, fontFace: HF, fontSize: 18, bold: true, color: c, margin: 0 });
    s.addText(obs, { x: x + 0.3, y: 3.32, w: C2W - 0.6, h: 0.42, fontFace: BF, fontSize: 10.5, color: GREY, margin: 0 });
  });

  [["Sublocação como moeda de troca", "O acordo liberou até 44% da área para sublocação, permitindo reduzir a dependência da rede de 33,2% para cerca de 20,6% da receita do fundo."],
   ["O desconto veio com contrapartida", "A perda mensal foi pequena e comprada em troca de flexibilidade estrutural e uso multiusuário do ativo — não foi desconto puro."],
   ["Nem todo contrato piora", "Onde o aluguel estava abaixo do mercado, a renegociação subiu o preço. Renegociar cedo, contrato a contrato, é melhor que renegociar em bloco sob RJ."]]
  .forEach(([t, d], i) => {
    const x = M + i * C3D;
    card(s, x, 4.08, C3W, 2.24, WHITE, "E1E5EC");
    badge(s, x + 0.24, 4.3, String(i + 1), NAVY, WHITE, 0.34);
    s.addText(t, { x: x + 0.24, y: 4.74, w: C3W - 0.48, h: 0.5, fontFace: BF, fontSize: 12, bold: true, color: INK, margin: 0, valign: "top" });
    s.addText(d, { x: x + 0.24, y: 5.26, w: C3W - 0.48, h: 0.9, fontFace: BF, fontSize: 10.5, color: GREY, margin: 0, valign: "top" });
  });

  footer(s, "Fontes: fato relevante do HSI Logística FII (HSLG11); Nord Investimentos; Money Times; Acionista.com.br.");
}

// =====================================================================
// 11B. SEGMENTOS QUE CRESCEM
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  head(s, "Para onde a demanda por ABL está indo", "Segmentos em crescimento", true);

  [["R$ 200,9 bi", "vendas dos shoppings em 2025, alta de apenas 1,2%"],
   ["R$ 203,7 bi", "projeção para 2026, alta de 1,4%"],
   ["658", "shoppings em operação, com 11 inaugurações previstas em 2026"]].forEach(([big, small], i) => {
    const x = M + i * C3D;
    card(s, x, 1.5, C3W, 1.3, NAVY2);
    s.addText(big, { x: x + 0.26, y: 1.62, w: C3W - 0.5, h: 0.46, fontFace: HF, fontSize: 23, bold: true, color: WHITE, margin: 0 });
    s.addText(small, { x: x + 0.26, y: 2.08, w: C3W - 0.5, h: 0.6, fontFace: BF, fontSize: 10.5, color: "A9B4C9", margin: 0, valign: "top" });
  });

  s.addText("O setor cresce pouco no agregado. Reocupar ABL vaga com o mesmo tipo de operação que saiu é repetir o problema.", {
    x: M, y: 2.96, w: CW, h: 0.36, fontFace: BF, fontSize: 12.5, bold: true, color: "E9A6A9", margin: 0,
  });

  [["Academias e bem-estar", "Fluxo diário recorrente, contrato longo e baixa sensibilidade a e-commerce. Absorve ABL grande em pavimento de menor valor."],
   ["Saúde e estética", "Clínicas populares, laboratórios e odontologia. Traz público em dia útil e horário ocioso, quando o shopping mais precisa."],
   ["Alimentação", "O segmento que mais puxa permanência e frequência. Restaurante âncora sustenta o fim de semana e o período noturno."],
   ["Lazer e entretenimento", "Parques indoor, boliche e games. Converte visita em permanência longa e alimenta o food court."],
   ["Pet e serviços", "Consumo resiliente e recorrente. Formato migrou de megastore para loja de bairro com clínica e banho."]]
  .forEach(([t, d], i) => {
    const w = (CW - 4 * 0.2) / 5;
    const x = M + i * (w + 0.2);
    card(s, x, 3.48, w, 2.5, NAVY2);
    badge(s, x + 0.2, 3.66, String(i + 1), RED, WHITE, 0.32);
    s.addText(t, { x: x + 0.2, y: 4.06, w: w - 0.4, h: 0.66, fontFace: BF, fontSize: 11.5, bold: true, color: WHITE, margin: 0, valign: "top" });
    s.addText(d, { x: x + 0.2, y: 4.74, w: w - 0.4, h: 1.1, fontFace: BF, fontSize: 9.6, color: "B4BFD3", margin: 0, valign: "top" });
  });

  s.addText("Nenhum desses segmentos compete com marketplace por preço — é isso que os torna candidatos naturais a substituir uma âncora de eletro e móveis.", {
    x: M, y: 6.18, w: CW, h: 0.42, fontFace: BF, fontSize: 11.5, italic: true, color: "AEB9CE", margin: 0,
  });

  footer(s, "Fontes: Abrasce (faturamento 2025 e projeção 2026, censo do setor); CNN Brasil; Times Brasil; Revista Shopping Centers.", true);
}

// =====================================================================
// 11C. PIPELINE DE MARCAS 600-1.200 m²
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  head(s, "Pipeline de reocupação para 600 a 1.200 m²", "Marcas e redes em expansão");

  const CA = M + 0.24, CB = M + 4.9, CC = M + 6.6, CCW = CW - 6.6;
  card(s, M, 1.46, CW, 0.4, NAVY);
  [["SEGMENTO E REDES CANDIDATAS", CA, 4.5], ["ABL TÍPICA", CB, 1.6], ["SINAL DE EXPANSÃO VERIFICADO", CC, CCW]]
    .forEach(([t, x, w]) => {
      s.addText(t, { x, y: 1.5, w, h: 0.32, fontFace: BF, fontSize: 9.5, bold: true, color: WHITE, charSpacing: 1, margin: 0, valign: "middle" });
    });

  [["Academias", "Smart Fit, Bluefit, Selfit, Gold's Gym", "800-1.500 m²", "Smart Fit chegou a 2 mil unidades e prevê mais de 340 aberturas em 2026; Gold's Gym abriu a primeira loja de São Paulo neste ano.", RED],
   ["Pet com serviço", "Petz-Cobasi", "450-700 m²", "A fusão criou uma rede de R$ 7,9 bi e mais de 500 lojas, com padrão migrando de megastore de 1.500 m² para loja de bairro.", GREEN],
   ["Artigos esportivos", "Decathlon, Centauro", "800-1.500 m²", "A Decathlon lançou formato compacto desenhado para shopping, com foco em São Paulo, Rio de Janeiro e Brasília.", GREEN],
   ["Moda de grande porte", "Renner, Riachuelo, C&A", "1.000-1.800 m²", "A Renner prevê de 22 a 30 lojas próprias em 2026 com R$ 1,05 bi de capex e foco em cidades de até 100 mil habitantes.", RED],
   ["Casa, decoração e presente", "Camicado, Mobly, Tok&Stok", "500-900 m²", "Camicado com cerca de cinco aberturas em 2026 dentro do plano do grupo Renner.", AMBER],
   ["Saúde popular", "dr.consulta, Amor Saúde, laboratórios", "400-900 m²", "O dr.consulta abre cinco unidades no Rio em 2026 e já opera sete lojas dentro de shopping.", GREEN],
   ["Gastronomia âncora", "Madero, Coco Bambu, Outback", "400-900 m²", "Polos gastronômicos são o principal vetor de fluxo noturno e de fim de semana no mix atual.", GREEN],
   ["Lazer indoor", "Parques, boliche e games", "800-1.500 m²", "Segmento que converte visita em permanência longa e alimenta a praça de alimentação.", AMBER]]
  .forEach(([seg, marcas, abl, sinal, c], i) => {
    const y = 1.9 + i * 0.58;
    if (i % 2 === 0) card(s, M, y, CW, 0.54, TINT);
    s.addShape(pres.ShapeType.ellipse, { x: M + 0.1, y: y + 0.2, w: 0.13, h: 0.13, fill: { color: c }, line: { type: "none" } });
    s.addText([
      { text: seg + " — ", options: { bold: true, color: INK } },
      { text: marcas, options: { color: GREY } },
    ], { x: CA, y: y + 0.02, w: 4.5, h: 0.52, fontFace: BF, fontSize: 10.5, margin: 0, valign: "middle" });
    s.addText(abl, { x: CB, y: y + 0.02, w: 1.6, h: 0.52, fontFace: BF, fontSize: 10.5, bold: true, color: NAVY, margin: 0, valign: "middle" });
    s.addText(sinal, { x: CC, y: y + 0.02, w: CCW, h: 0.52, fontFace: BF, fontSize: 10, color: GREY, margin: 0, valign: "middle" });
  });

  s.addText("Prioridade: verde já cabe na faixa sem obra estrutural; vermelho exige o topo da faixa ou a junção de duas lojas; âmbar depende do pavimento e da vitrine.", {
    x: M, y: 6.6, w: CW, h: 0.26, fontFace: BF, fontSize: 9, color: "8A93A5", margin: 0,
  });

  footer(s, "Fontes: Monitor Mercantil, Portal Cães e Gatos, iNews, Bloomberg Línea, Saúde Business e Abrasce (2026). Faixas de ABL são estimativas de mercado por formato.");
}

// =====================================================================
// 11D. ARRANJOS DE OCUPAÇÃO
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  head(s, "Três formas de reocupar 1.000 m²", "Arranjos de ocupação");

  s.addText("A escolha define aluguel por m², capex de obra e tempo até o primeiro aluguel. Não há resposta única — há resposta por ativo.", {
    x: M, y: 1.4, w: CW, h: 0.3, fontFace: BF, fontSize: 13, color: GREY, margin: 0,
  });

  [["Operação única de tráfego", "1 loja de 800 a 1.200 m²", GREEN_T, GREEN,
    "Academia, esporte, lazer indoor ou moda de grande porte ocupam o vão inteiro.",
    [["Aluguel por m²", "Menor"], ["Capex de subdivisão", "Baixo"], ["Prazo até ocupar", "6 a 12 meses"], ["Efeito no fluxo", "Alto e recorrente"]],
    "Melhor para ativo com vacância alta ou pavimento fraco, onde o problema é trazer gente de volta antes de otimizar receita."],
   ["Duas operações médias", "2 lojas de 400 a 600 m²", AMBER_T, AMBER,
    "Combinações que se complementam: pet com clínica e saúde popular, ou casa e decoração com gastronomia.",
    [["Aluguel por m²", "Intermediário"], ["Capex de subdivisão", "Médio"], ["Prazo até ocupar", "9 a 15 meses"], ["Efeito no fluxo", "Médio e diversificado"]],
    "O arranjo mais equilibrado na maior parte dos casos: dilui risco de inquilino sem explodir o custo de obra."],
   ["Fracionamento em satélites", "3 a 4 lojas de 200 a 350 m²", RED_T, RED,
    "Exige abrir circulação nova, fachada e infraestrutura individual para cada ponto.",
    [["Aluguel por m²", "Maior"], ["Capex de subdivisão", "Alto"], ["Prazo até ocupar", "12 a 24 meses"], ["Efeito no fluxo", "Depende do piso"]],
    "Só se paga em piso com fluxo já comprovado e demanda reprimida de satélites. Em piso fraco, multiplica vacância em vez de receita."]]
  .forEach(([t, sub, bg, c, desc, kpis, quando], i) => {
    const x = M + i * C3D;
    card(s, x, 1.86, C3W, 4.5, bg);
    badge(s, x + 0.26, 2.06, String(i + 1), c, WHITE, 0.36);
    s.addText(t, { x: x + 0.26, y: 2.5, w: C3W - 0.52, h: 0.5, fontFace: HF, fontSize: 15, bold: true, color: INK, margin: 0, valign: "top" });
    s.addText(sub, { x: x + 0.26, y: 3.0, w: C3W - 0.52, h: 0.26, fontFace: BF, fontSize: 11, bold: true, color: c, margin: 0 });
    s.addText(desc, { x: x + 0.26, y: 3.3, w: C3W - 0.52, h: 0.62, fontFace: BF, fontSize: 10, color: GREY, margin: 0, valign: "top" });
    kpis.forEach(([k, v], j) => {
      const yy = 3.98 + j * 0.36;
      s.addText(k, { x: x + 0.26, y: yy, w: 1.9, h: 0.3, fontFace: BF, fontSize: 9.5, color: GREY, margin: 0, valign: "middle" });
      s.addText(v, { x: x + 2.0, y: yy, w: C3W - 2.26, h: 0.3, fontFace: BF, fontSize: 9.5, bold: true, color: INK, margin: 0, valign: "middle", align: "right" });
    });
    s.addText(quando, { x: x + 0.26, y: 5.5, w: C3W - 0.52, h: 0.76, fontFace: BF, fontSize: 10, italic: true, color: INK, margin: 0, valign: "top" });
  });

  s.addText("Regra prática: quanto mais fracionado o vão, maior o aluguel por m² e maior o capex e o prazo. Decida pelo tempo até o primeiro aluguel, não pelo aluguel teórico do plano.", {
    x: M, y: 6.5, w: CW, h: 0.4, fontFace: BF, fontSize: 12, bold: true, color: NAVY, margin: 0,
  });
}

// =====================================================================
// 12. PLAYBOOK
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  head(s, "O que fazer a partir de agora", "Playbook 30 / 60 / 90 dias");

  [["Primeiros 30 dias", "Medir e blindar", NAVY, TINT, [
    "Mapear toda a exposição: contratos, ABL, aluguel mínimo, percentual, vencimentos e peso no NOI de cada ativo.",
    "Levantar as garantias contrato a contrato — fiança bancária, seguro-fiança, fiador, caução — e checar vigência e suficiência.",
    "Zerar a inadimplência corrente: cobrar todo aluguel vencido agora, antes de qualquer pedido de proteção judicial.",
    "Classificar cada loja em A, B ou C conforme rentabilidade do contrato e criticidade para o fluxo do ativo.",
  ]],
  ["30 a 60 dias", "Negociar por escolha", RED, RED_T, [
    "Abrir a conversa comercial antes de a rede abrir — quem propõe define a pauta e o preço.",
    "Trocar redução do aluguel mínimo por prazo, percentual sobre vendas maior e direito de sublocação ou fracionamento.",
    "Exigir renovação ou reforço de garantia como condição de qualquer concessão.",
    "Incluir cláusula de rescisão por pedido de RJ ou RE e por descumprimento de meta de venda mínima.",
  ]],
  ["60 a 90 dias", "Preparar a substituição", AMBER, AMBER_T, [
    "Construir pipeline de reposição por loja C: âncoras alternativas, lazer, saúde, educação, supermercado ou academia.",
    "Orçar o capex de subdivisão e adequação da ABL e travar o prazo de obra com antecedência.",
    "Simular o impacto no NOI, no FFO e nos laudos de avaliação em cenário de saída total e parcial.",
    "Definir gatilhos objetivos que disparam a execução do plano B sem nova discussão de comitê.",
  ]]].forEach(([p, sub, c, bg, items], i) => {
    const x = M + i * C3D;
    card(s, x, 1.5, C3W, 4.06, bg);
    s.addText(p.toUpperCase(), { x: x + 0.28, y: 1.7, w: C3W - 0.56, h: 0.26, fontFace: BF, fontSize: 10, bold: true, color: c, charSpacing: 1, margin: 0 });
    s.addText(sub, { x: x + 0.28, y: 1.98, w: C3W - 0.56, h: 0.56, fontFace: HF, fontSize: 16, bold: true, color: INK, margin: 0, valign: "top" });
    s.addText(items.map((t, k) => ({ text: t, options: { bullet: true, breakLine: k !== items.length - 1 } })), {
      x: x + 0.28, y: 2.6, w: C3W - 0.52, h: 2.82, fontFace: BF, fontSize: 10.8, color: INK,
      margin: 0, paraSpaceAfter: 8, valign: "top",
    });
  });

  card(s, M, 5.76, CW, 0.86, NAVY);
  s.addText("Regra do playbook: toda concessão precisa de contrapartida contratual. Desconto sem prazo, sem garantia e sem direito de fracionamento é transferência pura de valor do shopping para o lojista.", {
    x: M + 0.34, y: 5.86, w: CW - 0.68, h: 0.66, fontFace: BF, fontSize: 12.5, bold: true, color: WHITE, margin: 0, valign: "middle",
  });
  footer(s, "Sequência recomendada para o comitê comercial em conjunto com jurídico e planejamento financeiro.");
}

// =====================================================================
// 13. MATRIZ DE DECISÃO
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  head(s, "A decisão não é uma só — é uma por loja", "Matriz de decisão");

  [["A", "Loja rentável em ativo dominante", GREEN, GREEN_T,
    "Contrato em linha ou acima do mercado, boa venda por m², shopping com fila de interessados.",
    "Segurar o preço. Conceder no máximo carência curta, sempre com contrapartida de prazo e garantia. Aqui o locador tem a mão mais forte, porque existe substituto."],
   ["B", "Loja relevante em ativo intermediário", AMBER, AMBER_T,
    "Venda média, contrato próximo do mercado, reposição possível mas com 9 a 18 meses de vacância e capex de adequação.",
    "Renegociar de forma proativa: migrar parte do aluguel mínimo para percentual sobre vendas, alongar prazo e liberar sublocação parcial da área."],
   ["C", "Loja deficitária ou ABL superdimensionada", RED, RED_T,
    "Aluguel acima do mercado, venda fraca ou área grande demais para o formato atual da rede. É a primeira da fila em qualquer novo corte.",
    "Assumir que a saída vem e antecipá-la em termos seus. Negociar devolução ordenada, com data, quitação de passivos e recomposição do imóvel, enquanto ainda há caixa do outro lado."]]
  .forEach(([l, t, c, tt, perfil, acao], i) => {
    const y = 1.5 + i * 1.58;
    card(s, M, y, CW, 1.46, tt);
    badge(s, M + 0.3, y + 0.45, l, c, WHITE, 0.56);
    s.addText(t, { x: M + 1.06, y: y + 0.16, w: 3.5, h: 0.6, fontFace: HF, fontSize: 15, bold: true, color: INK, margin: 0, valign: "top" });
    s.addText(perfil, { x: M + 1.06, y: y + 0.8, w: 3.6, h: 0.62, fontFace: BF, fontSize: 10, color: GREY, margin: 0, valign: "top" });
    s.addText("AÇÃO RECOMENDADA", { x: M + 4.96, y: y + 0.18, w: 3.0, h: 0.24, fontFace: BF, fontSize: 9, bold: true, color: c, charSpacing: 1, margin: 0 });
    s.addText(acao, { x: M + 4.96, y: y + 0.46, w: CW - 5.3, h: 0.94, fontFace: BF, fontSize: 11.5, color: INK, margin: 0, valign: "top" });
  });

  s.addText("Regra de bolso: conceda desconto onde a reposição é cara e demorada; segure o preço onde há substituto. Desconto linear para toda a rede é a única resposta claramente errada.", {
    x: M, y: 6.3, w: CW, h: 0.44, fontFace: BF, fontSize: 12, bold: true, color: NAVY, margin: 0,
  });

  footer(s, "Aplicar a classificação loja a loja antes de qualquer negociação em bloco com a rede.");
}

// =====================================================================
// 14. CLÁUSULAS
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  head(s, "O que exigir em qualquer repactuação", "Cláusulas e garantias");

  [["Garantia de terceiro, sempre", "Fiança bancária ou seguro-fiança cobrindo de 6 a 12 meses de aluguel e encargos. Pelo art. 49 §1º da Lei 11.101/2005 essa garantia não é atingida pela RJ da locatária — é o único instrumento que atravessa o processo intacto."],
   ["Vencimento antecipado por insolvência", "Rescisão e exigibilidade imediata em caso de pedido de RJ, RE, falência ou descumprimento das debêntures. Sem essa cláusula o locador fica preso ao cronograma do plano."],
   ["Aluguel percentual com piso e teto", "Reduz o mínimo em troca de captura de venda. Alinha o risco do locador ao desempenho real da loja e aumenta a chance de o contrato ser honrado."],
   ["Direito de sublocação e fracionamento", "Permite recolocar parte da ABL sem esperar a saída total, como no precedente do HSLG11, reduzindo a dependência de um único inquilino."],
   ["Devolução com estado definido", "Data certa, quitação de condomínio e FPP, recomposição do imóvel e multa proporcional. Evita a discussão de obras e passivos justamente quando não há mais o que negociar."],
   ["Auditoria e informação obrigatória", "Envio periódico de vendas por loja e comunicação imediata de eventos societários relevantes — crítico se a companhia fechar capital e as informações públicas desaparecerem."]]
  .forEach(([t, d], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * C2D, y = 1.5 + row * 1.7;
    card(s, x, y, C2W, 1.56, i % 2 === 0 ? TINT : WHITE, i % 2 === 0 ? null : "E1E5EC");
    badge(s, x + 0.26, y + 0.22, String(i + 1), NAVY, WHITE, 0.34);
    s.addText(t, { x: x + 0.72, y: y + 0.18, w: C2W - 0.98, h: 0.42, fontFace: BF, fontSize: 13, bold: true, color: INK, margin: 0, valign: "middle" });
    s.addText(d, { x: x + 0.26, y: y + 0.66, w: C2W - 0.52, h: 0.82, fontFace: BF, fontSize: 10.5, color: GREY, margin: 0, valign: "top" });
  });

  footer(s, "Checklist para o jurídico. As cláusulas devem ser adaptadas a cada contrato e à legislação aplicável.");
}

// =====================================================================
// 15. MONITORAMENTO (DARK)
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  head(s, "Os gatilhos que antecipam o desfecho", "Painel de monitoramento", true);

  s.addText("Cada gatilho abaixo tem uma ação pré-aprovada associada. Quando o gatilho acende, o plano executa sem nova rodada de discussão.", {
    x: M, y: 1.44, w: CW, h: 0.32, fontFace: BF, fontSize: 12.5, color: "AEB9CE", margin: 0,
  });

  [["Atraso de aluguel acima de 15 dias em qualquer loja da rede", "Vermelho", RED_L],
   ["Pedido formal de renegociação em bloco enviado a shoppings", "Vermelho", RED_L],
   ["Anúncio de nova rodada de fechamento de lojas", "Vermelho", RED_L],
   ["Assembleia de debenturistas ou novo aditamento de cronograma", "Amarelo", AMBER_L],
   ["Novo parecer de auditoria com ressalva ou abstenção no 3T26", "Amarelo", AMBER_L],
   ["Saída de executivos-chave ou mudança na composição do controle", "Amarelo", AMBER_L],
   ["Anúncio de OPA para fechamento de capital", "Amarelo", AMBER_L],
   ["Protocolo de RJ ou de nova RE em juízo", "Vermelho", RED_L]]
  .forEach(([t, lv, c], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * C2D, y = 1.94 + row * 0.86;
    card(s, x, y, C2W, 0.72, NAVY2);
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.26, y: y + 0.28, w: 0.17, h: 0.17, fill: { color: c }, line: { type: "none" } });
    s.addText(t, { x: x + 0.6, y: y + 0.04, w: C2W - 1.56, h: 0.64, fontFace: BF, fontSize: 11, color: "D6DEEB", margin: 0, valign: "middle" });
    s.addText(lv.toUpperCase(), { x: x + C2W - 0.92, y: y + 0.04, w: 0.7, h: 0.64, fontFace: BF, fontSize: 9, bold: true, color: c, margin: 0, valign: "middle", align: "right" });
  });

  card(s, M, 5.52, CW, 1.0, RED);
  s.addText("Responsável pelo painel: diretoria comercial, com revisão quinzenal em comitê e reporte imediato ao conselho quando dois gatilhos vermelhos acenderem no mesmo mês.", {
    x: M + 0.34, y: 5.62, w: CW - 0.68, h: 0.8, fontFace: BF, fontSize: 12.5, bold: true, color: WHITE, margin: 0, valign: "middle",
  });

  footer(s, "Painel a ser mantido pela equipe de risco de crédito de lojistas junto ao comercial.", true);
}

// =====================================================================
// 16. RECOMENDAÇÃO
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  head(s, "A recomendação", "Decisão", true);

  [["Trate a rede como risco de crédito", "Provisione perdas esperadas, exija garantia de terceiro e acompanhe a exposição loja a loja com a mesma disciplina de uma carteira de crédito."],
   ["Negocie agora, no seu tempo", "Renegociação voluntária antes de um pedido judicial preserva escolha, preço e contrapartidas. Depois do protocolo, o locador negocia dentro do plano e sem alavancagem."],
   ["Antecipe a saída e monte o pipeline", "Devolução ordenada vale mais que crédito concursal. E a fila de reposição — academia, saúde, pet, esporte, lazer — precisa estar prospectada antes da devolução, não depois."],
   ["Não conceda desconto linear", "Diferencie por ativo e por loja. Onde há substituto, segure o preço; onde a reposição é cara, compre prazo e flexibilidade com o desconto."]]
  .forEach(([t, d], i) => {
    const y = 1.52 + i * 1.14;
    card(s, M, y, CW, 1.04, NAVY2);
    badge(s, M + 0.3, y + 0.3, String(i + 1), RED, WHITE, 0.44);
    s.addText(t, { x: M + 0.94, y: y + 0.12, w: 4.6, h: 0.8, fontFace: HF, fontSize: 14.5, bold: true, color: WHITE, margin: 0, valign: "middle" });
    s.addText(d, { x: M + 5.72, y: y + 0.12, w: CW - 6.05, h: 0.8, fontFace: BF, fontSize: 11, color: "B4BFD3", margin: 0, valign: "middle" });
  });

  s.addText("O cenário-base não é o colapso da Casas Bahia. É uma rede menor, mais seletiva e permanentemente mais dura na mesa de negociação. Quem se preparar para isso agora, e não para a manchete de falência, protege o NOI.", {
    x: M, y: 6.2, w: CW, h: 0.8, fontFace: HF, fontSize: 14, bold: true, italic: true, color: "E9A6A9", margin: 0, valign: "middle",
  });
}

// =====================================================================
// 17. FONTES
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  head(s, "Fontes e ressalvas", "Anexo");

  const srcs = [
    "Divulgação de resultados do 2T26 do Grupo Casas Bahia (14/08/2026) e relatório de revisão da Ernst & Young.",
    "Money Times, Times Brasil (CNBC), Brasil 247, ICL Notícias e Forbes Brasil — cobertura do resultado do 2T26 e da menção a recuperação judicial.",
    "Poder360, Gazeta do Povo, InvestNews, Revista Oeste e Correio Braziliense — fechamento de 298 lojas e desligamentos de agosto de 2026.",
    "Poder360, Diário do Comércio e Seu Dinheiro — homologação da recuperação extrajudicial de R$ 4,1 bi em junho de 2024 e 10ª emissão de debêntures.",
    "Investidor10, Money Times e Clube FII — reperfilamento do cronograma de debêntures e conversão de dívida em ações; Seu Dinheiro e Exame — movimentação societária de Mapa Capital e Michael Klein.",
    "Nord Investimentos, Acionista.com.br e fato relevante do HSI Logística FII (HSLG11) — renegociação de contratos de locação com a rede.",
    "Migalhas e ConJur — jurisprudência do STJ sobre despejo, competência do juízo universal e essencialidade do bem; Lei 11.101/2005 e Tema Repetitivo 1051 do STJ.",
  ];
  s.addText(srcs.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i !== srcs.length - 1 } })), {
    x: M, y: 1.5, w: CW, h: 2.9, fontFace: BF, fontSize: 12, color: INK, margin: 0, paraSpaceAfter: 9, valign: "top",
  });

  card(s, M, 4.56, CW, 1.74, TINT);
  s.addText("Ressalvas metodológicas", { x: M + 0.32, y: 4.7, w: 6.0, h: 0.32, fontFace: BF, fontSize: 13, bold: true, color: INK, margin: 0 });
  s.addText("As probabilidades de cenário são estimativas do analista a partir de informações públicas disponíveis até 16/08/2026 e não refletem projeções oficiais da companhia. Alguns indicadores divulgados por agregadores de mercado apresentam pequenas divergências entre si e foram usados na faixa mais conservadora. Este documento é análise de risco de negócio para apoio à decisão comercial e não constitui recomendação de investimento nem parecer jurídico sobre contratos específicos.", {
    x: M + 0.32, y: 5.06, w: CW - 0.64, h: 1.12, fontFace: BF, fontSize: 11, color: GREY, margin: 0, valign: "top",
  });
}

pres.writeFile({ fileName: OUT }).then(() => console.log("OK ->", OUT));
