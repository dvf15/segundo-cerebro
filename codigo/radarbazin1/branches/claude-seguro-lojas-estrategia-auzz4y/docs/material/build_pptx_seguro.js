const pptxgen = require("pptxgenjs");

/* ---------- paleta (do deck v21.08, mesma do material HTML) ---------- */
const TEAL   = "0D454A";  // teal profundo — dominante
const TEAL_M = "008C9E";  // teal médio — dados
const TEAL_D = "0A3338";  // teal quase preto — fundos escuros
const AMBER  = "C07A10";  // âmbar — acento
const AMBER_L= "EDA754";  // âmbar claro — acento sobre escuro
const SAND   = "F0EBE1";  // areia — cards
const SAND_D = "E0D8C8";  // areia escura — bordas
const WHITE  = "FFFFFF";
const BODY   = "41565A";
const MUTED  = "77898B";
const CRIT   = "B0392B";
const GOOD   = "177A53";
const NAVY   = "1B2A4A";

const SERIF = "Cambria";
const SANS  = "Calibri";
const MONO  = "Courier New";

const W = 13.333, H = 7.5, ML = 0.65, CW = W - ML * 2;

const p = new pptxgen();
p.layout = "LAYOUT_WIDE";
p.author = "Diretoria de Portfólio";
p.title = "Pré-Comitê Seguro Lojas";

let pageNo = 0;

function slide(opts = {}) {
  const s = p.addSlide();
  s.background = { color: opts.dark ? TEAL_D : WHITE };
  if (!opts.dark && !opts.noFooter) {
    pageNo++;
    s.addText(String(pageNo).padStart(2, "0"), {
      x: W - 1.05, y: H - 0.52, w: 0.5, h: 0.28, align: "right",
      fontFace: MONO, fontSize: 9, color: MUTED, margin: 0,
    });
    s.addText("Seguro de Lojas · base de decisão", {
      x: ML, y: H - 0.52, w: 6, h: 0.28,
      fontFace: MONO, fontSize: 8, color: MUTED, charSpacing: 1, margin: 0,
    });
  }
  return s;
}

function head(s, eyebrow, title, lede) {
  s.addText(eyebrow, {
    x: ML, y: 0.42, w: CW, h: 0.25, fontFace: MONO, fontSize: 9.5,
    color: AMBER, charSpacing: 2.2, bold: true, margin: 0,
  });
  s.addText(title, {
    x: ML, y: 0.72, w: CW, h: 0.62, fontFace: SERIF, fontSize: 31,
    bold: true, color: TEAL, margin: 0,
  });
  if (lede) {
    s.addText(lede, {
      x: ML, y: 1.42, w: CW * 0.82, h: 0.62, fontFace: SANS, fontSize: 13.5,
      color: BODY, margin: 0, lineSpacing: 18,
    });
    return 2.05;
  }
  return 1.55;
}

function card(s, x, y, w, h, fill) {
  s.addShape(p.ShapeType.rect, {
    x, y, w, h, fill: { color: fill || SAND }, line: { color: SAND_D, width: 0.5 },
  });
}

function tbl(s, rows, opts) {
  s.addTable(rows, Object.assign({
    x: ML, w: CW, border: { type: "solid", color: SAND_D, pt: 0.5 },
    fontFace: SANS, fontSize: 10.5, color: BODY, valign: "top",
    autoPage: false,
  }, opts));
}
const th = (t, o = {}) => Object.assign({
  text: t, options: Object.assign({
    fill: TEAL, color: WHITE, bold: true, fontFace: MONO, fontSize: 8.5,
    charSpacing: 1, valign: "middle",
  }, o),
});
const td = (t, o = {}) => ({ text: t, options: Object.assign({ valign: "top" }, o) });
const sub = (t, span) => [{
  text: t, options: {
    colspan: span, fill: SAND, color: TEAL, bold: true, fontFace: MONO,
    fontSize: 8.5, charSpacing: 1.4, valign: "middle",
  },
}];

/* ===================== 01 · capa ===================== */
{
  const s = slide({ dark: true, noFooter: true });
  s.addText("DOCUMENTO DE TRABALHO   ·   PRÉ-COMITÊ   ·   CONFIDENCIAL", {
    x: ML, y: 1.35, w: CW, h: 0.3, fontFace: MONO, fontSize: 10.5,
    color: AMBER_L, charSpacing: 2.4, margin: 0,
  });
  s.addText("Seguro de Lojas", {
    x: ML, y: 1.9, w: CW, h: 1.0, fontFace: SERIF, fontSize: 58, bold: true,
    color: WHITE, margin: 0,
  });
  s.addText("O que sabemos, o que falta e o que precisamos provar", {
    x: ML, y: 2.95, w: CW * 0.92, h: 0.68, fontFace: SERIF, fontSize: 25,
    color: AMBER_L, margin: 0,
  });
  s.addText(
    "Consolidação da estratégia v21.08 e da crítica técnica. Este material não pede aprovação de modelo — pede aprovação do levantamento que torna a decisão de modelo defensável.",
    { x: ML, y: 3.85, w: CW * 0.62, h: 0.9, fontFace: SANS, fontSize: 14,
      color: "C3D2D3", margin: 0, lineSpacing: 21 });

  const meta = [
    ["BASE ANALISADA", "Deck v21.08 · 15 slides"],
    ["ESCOPO DOS DADOS", "10 shoppings · ~2.570 lojas"],
    ["ESTÁGIO", "Pré-Fase 0"],
    ["DECISÃO PEDIDA", "Aprovar baseline, não o modelo"],
  ];
  const mw = (CW - 0.45) / 4;
  meta.forEach(([k, v], i) => {
    const x = ML + i * (mw + 0.15);
    s.addShape(p.ShapeType.rect, { x, y: 5.3, w: mw, h: 0.85,
      fill: { color: "12363B" }, line: { color: "1E5057", width: 0.75 } });
    s.addText(k, { x: x + 0.16, y: 5.42, w: mw - 0.32, h: 0.22,
      fontFace: MONO, fontSize: 7.5, color: MUTED, charSpacing: 1.2, margin: 0 });
    s.addText(v, { x: x + 0.16, y: 5.64, w: mw - 0.32, h: 0.46,
      fontFace: SANS, fontSize: 12, bold: true, color: WHITE, margin: 0 });
  });
  s.addText("Diretoria de Portfólio  ·  23 de agosto de 2026  ·  versão 1", {
    x: ML, y: 6.55, w: CW, h: 0.3, fontFace: MONO, fontSize: 9,
    color: MUTED, charSpacing: 1, margin: 0 });
  s.addNotes("Abertura. O ponto central: não estamos pedindo escolha de modelo hoje. Estamos pedindo aprovação do levantamento de 45 dias que torna essa escolha defensável.");
}

/* ===================== 02 · o pedido ===================== */
{
  const s = slide();
  const y0 = head(s, "SUMÁRIO EXECUTIVO", "Três frases e um pedido");

  const items = [
    ["O diagnóstico está certo.",
     "A exigência contratual de seguro não transfere risco. Isso está estabelecido pelos dados do próprio material: LMI de R$ 1,5 mil convivendo com R$ 7 milhões, 3% de apólices já vencidas sem detecção e adesão que só avança com esforço manual recorrente.", GOOD],
    ["A recomendação está prematura.",
     "O deck recomenda o modelo híbrido sem business case, sem preço de mercado, sem parecer jurídico e com uma única observação a favor — que os próprios dados enfraquecem. A apólice master, cujo custo é o objetivo macro nº 1, não é mencionada em nenhum dos 15 slides.", CRIT],
    ["Existe uma quarta opção que não foi avaliada.",
     "Centralizar apenas as coberturas de interesse do empreendedor — RC, incêndio e perda de aluguel — e deixar o resto livre. É a única alternativa na mesa que protege o shopping em 100% desde o primeiro dia, sem depender de uma curva de adesão parada em 48%.", AMBER],
  ];
  let y = y0 + 0.05;
  items.forEach(([t, d, c]) => {
    card(s, ML, y, CW, 1.36);
    s.addShape(p.ShapeType.rect, { x: ML + 0.28, y: y + 0.3, w: 0.16, h: 0.16, fill: { color: c }, line: { color: c } });
    s.addText(t, { x: ML + 0.62, y: y + 0.2, w: CW - 1.0, h: 0.34,
      fontFace: SERIF, fontSize: 17, bold: true, color: TEAL, margin: 0 });
    s.addText(d, { x: ML + 0.62, y: y + 0.56, w: CW - 1.1, h: 0.74,
      fontFace: SANS, fontSize: 12, color: BODY, margin: 0, lineSpacing: 16.5 });
    y += 1.44;
  });

  s.addShape(p.ShapeType.rect, { x: ML, y: y + 0.06, w: CW, h: 0.82,
    fill: { color: TEAL }, line: { color: TEAL } });
  s.addText("O PEDIDO", { x: ML + 0.28, y: y + 0.2, w: 1.3, h: 0.24,
    fontFace: MONO, fontSize: 8.5, color: AMBER_L, charSpacing: 1.6, margin: 0 });
  s.addText("Aprovar a Fase 0 — 45 dias de levantamento — e as seis decisões que não dependem de dado nenhum.",
    { x: ML + 1.75, y: y + 0.14, w: CW - 2.1, h: 0.6, fontFace: SERIF,
      fontSize: 15.5, bold: true, color: WHITE, margin: 0 });
  s.addNotes("Se o comitê só ouvir um slide, é este. Diagnóstico certo, recomendação prematura, e uma quarta opção que ninguém avaliou.");
}

/* ===================== 03 · onde estamos ===================== */
{
  const s = slide();
  const y0 = head(s, "01 · SITUAÇÃO", "Onde estamos",
    "Programa de cobrança de apólices em curso desde março/26 em 10 shoppings. A adesão subiu, mas estacionou abaixo da metade — e a qualidade das apólices nunca foi verificada.");

  const stats = [
    ["48%", "ADESÃO NOMINAL · JUL/26", "Partiu de ~16% em março. Mede posse de documento, não proteção.", TEAL],
    ["63 p.p.", "DISPERSÃO ENTRE SHOPPINGS", "De 8,2% no Norteshopping a 74,9% na Estação Cuiabá.", CRIT],
    ["4.667×", "VARIAÇÃO DE LMI", "De R$ 1,5 mil a R$ 7 milhões na mesma base, sem regra mínima.", CRIT],
    ["3%", "APÓLICES JÁ VENCIDAS", "Sem rotina de detecção de cancelamento ou não renovação.", AMBER],
    ["30%", "COMISSÃO DE REFERÊNCIA", "Tabela usada na negociação Ezze, encerrada pela seguradora em julho.", AMBER],
  ];
  const cw = (CW - 0.6) / 5;
  stats.forEach(([v, l, n, c], i) => {
    const x = ML + i * (cw + 0.15);
    card(s, x, y0, cw, 2.35);
    s.addText(v, { x: x + 0.2, y: y0 + 0.22, w: cw - 0.4, h: 0.6,
      fontFace: SERIF, fontSize: 33, bold: true, color: c, margin: 0 });
    s.addText(l, { x: x + 0.2, y: y0 + 0.88, w: cw - 0.35, h: 0.42,
      fontFace: MONO, fontSize: 7.5, color: MUTED, charSpacing: 0.8, margin: 0 });
    s.addText(n, { x: x + 0.2, y: y0 + 1.34, w: cw - 0.4, h: 0.9,
      fontFace: SANS, fontSize: 11, color: BODY, margin: 0, lineSpacing: 14.5 });
  });

  s.addText(
    "O deck v21.08 recomenda migrar do modelo individual para o híbrido, com corretora homologada e regras mínimas. A recomendação é razoável em tese. O problema é que ela não está sustentada por números — e há dúvidas materiais sobre o que exatamente resolve.",
    { x: ML, y: y0 + 2.68, w: CW * 0.86, h: 0.82, fontFace: SANS, fontSize: 12.5,
      color: BODY, margin: 0, lineSpacing: 17.5 });
  s.addNotes("Os cinco números que definem o problema. Note que três deles são de qualidade, não de quantidade — e nenhum é endereçado pela mudança de modelo proposta.");
}

/* ===================== 04 · estabelecido vs não provado ===================== */
{
  const s = slide();
  const y0 = head(s, "02 · INVENTÁRIO", "O que já sabemos, com que confiança",
    "Separar o que está estabelecido do que é hipótese é o primeiro passo para saber o que ir buscar.");

  tbl(s, [
    [th("Afirmação"), th("Status", { fill: TEAL }), th("Base")],
    [td("A exigência contratual não transfere risco de forma efetiva", { bold: true }),
     td("Estabelecido", { color: GOOD, bold: true }),
     td("Diagnóstico do deck, confirmado pelos dados de LMI e vencimento.")],
    [td("A cobertura contratada é heterogênea a ponto de ser inútil em parte dos casos", { bold: true }),
     td("Estabelecido", { color: GOOD, bold: true }),
     td("LMI de R$ 1,5 mil convivendo com R$ 7 milhões na mesma base.")],
    [td("A adesão depende de esforço operacional recorrente e não se sustenta sozinha", { bold: true }),
     td("Estabelecido", { color: GOOD, bold: true }),
     td("Curva de adesão e reconhecimento explícito no material.")],
    [td("O mercado segurador não priorizou o projeto como desenhado", { bold: true }),
     td("Estabelecido", { color: GOOD, bold: true }),
     td("Ezze: 5 meses, 3 calls sem retorno, desistência unilateral.")],
    [td("O modelo híbrido produz adesão maior que o individual", { bold: true }),
     td("Não provado", { color: CRIT, bold: true }),
     td("Um único caso (Cuiabá, 74,9%) contra Mooca individual a 71,3%.")],
    [td("Existe transbordo material de risco do lojista para o empreendedor", { bold: true }),
     td("Não medido", { color: CRIT, bold: true }),
     td("Afirmado sem quantificação, jurisprudência ou histórico de sinistros.")],
    [td("Há ganho de escala de prêmio a capturar", { bold: true }),
     td("Não medido", { color: CRIT, bold: true }),
     td("Nenhuma cotação comparativa. Parte do ganho pode ser só corte de comissão.")],
    [td("O programa reduz o custo da apólice master", { bold: true }),
     td("Não endereçado", { color: CRIT, bold: true }),
     td("A apólice master não aparece em nenhum dos 15 slides.")],
    [td("Julho/26 teve evolução sobre junho", { bold: true }),
     td("A verificar", { color: AMBER, bold: true }),
     td("Todas as séries do gráfico repetem junho em julho.")],
  ], { y: y0, colW: [5.0, 1.6, 5.4], rowH: 0.42, fontSize: 10.5 });
  s.addNotes("Quatro das nove afirmações centrais do material caem na coluna de não provado, não medido ou não endereçado. É isso que a Fase 0 resolve.");
}

/* ===================== 05 · os cinco furos ===================== */
{
  const s = slide();
  const y0 = head(s, "03 · DIAGNÓSTICO", "Os cinco furos que impedem a decisão",
    "Não são críticas de forma. Cada um deles muda a resposta que o comitê daria.");

  const f = [
    ["F1", "Não existe business case — e o objetivo nº 1 não aparece",
     "Nenhum número financeiro: prêmio, sinistralidade, valor em risco, economia, custo do programa. A apólice master não é mencionada em nenhum slide."],
    ["F2", "A métrica principal mede a coisa errada",
     "Adesão mede posse de documento. Uma apólice de R$ 1,5 mil de LMI conta como aderente. O programa pode chegar a 100% sem reduzir a exposição em um centavo."],
    ["F3", "A recomendação não é sustentada pelos dados",
     "O único caso híbrido está 3,6 p.p. acima do melhor caso individual — ruído. A dispersão dentro do modelo individual é de 63 p.p."],
    ["F4", "A pergunta central do desenho não é respondida",
     "Quem fica com a comissão? O material promete transparência e nunca diz quem recebe o quê — enquanto revela, de passagem, uma tabela de referência de 30%."],
    ["F5", "O roadmap não alcança o estoque de contratos vigentes",
     "Minuta nova só afeta novas locações. Com prazo de 5 anos, portfólio inteiro em 12–24 meses não fecha. Falta a via da assembleia."],
  ];
  let y = y0;
  f.forEach(([n, t, d]) => {
    card(s, ML, y, CW, 0.9);
    s.addShape(p.ShapeType.rect, { x: ML, y: y, w: 0.62, h: 0.9,
      fill: { color: TEAL }, line: { color: TEAL } });
    s.addText(n, { x: ML, y: y + 0.3, w: 0.62, h: 0.3, align: "center",
      fontFace: MONO, fontSize: 12, bold: true, color: AMBER_L, margin: 0 });
    s.addText(t, { x: ML + 0.82, y: y + 0.11, w: CW - 1.1, h: 0.3,
      fontFace: SERIF, fontSize: 14.5, bold: true, color: TEAL, margin: 0 });
    s.addText(d, { x: ML + 0.82, y: y + 0.44, w: CW - 1.15, h: 0.44,
      fontFace: SANS, fontSize: 10.5, color: BODY, margin: 0, lineSpacing: 14 });
    y += 0.97;
  });
  s.addNotes("Cinco furos, todos críticos. F4 é o que mais surpreende o comitê: a comissão de 30% aparece de passagem no slide 12 do material original.");
}

/* ===================== 06 · evidência / gráfico ===================== */
{
  const s = slide();
  const y0 = head(s, "04 · EVIDÊNCIA", "A evidência sob escrutínio",
    "O ranking de adesão é a única evidência empírica a favor do modelo híbrido. Lido com atenção, ele diz outra coisa.");

  const cats = ["Estação Cuiabá","Mooca","Belo Horizonte","Estação BH","Center Uberlândia",
                "Plaza Niterói","Del Rey","Carioca","Norteshopping"];
  s.addChart(p.ChartType.bar, [
    { name: "Híbrido",    labels: cats, values: [74.9,null,null,null,null,null,null,null,null] },
    { name: "Individual", labels: cats, values: [null,71.3,63.2,58.3,43.5,36.7,29.2,21.7,8.2] },
  ], {
    x: ML, y: y0, w: 8.15, h: 4.45,
    barDir: "bar", barGrouping: "stacked", barGapWidthPct: 45,
    chartColors: [AMBER, TEAL_M],
    showTitle: false, showLegend: true, legendPos: "t",
    legendFontFace: MONO, legendFontSize: 9, legendColor: BODY,
    showValue: true, dataLabelPosition: "inEnd", dataLabelFormatCode: '0.0"%"',
    dataLabelFontFace: MONO, dataLabelFontSize: 9, dataLabelColor: "FFFFFF",
    catAxisLabelFontFace: SANS, catAxisLabelFontSize: 10.5, catAxisLabelColor: BODY,
    catAxisLineShow: false, catGridLine: { style: "none" },
    valAxisLabelFontFace: MONO, valAxisLabelFontSize: 9, valAxisLabelColor: MUTED,
    valAxisMaxVal: 80, valAxisMajorUnit: 20, valAxisLineShow: false,
    valGridLine: { color: SAND_D, size: 0.5 },
    valAxisLabelFormatCode: '0"%"',
  });

  const bx = ML + 8.5, bw = CW - 8.5;
  card(s, bx, y0, bw, 4.45);
  s.addText("A leitura correta", { x: bx + 0.26, y: y0 + 0.24, w: bw - 0.5, h: 0.32,
    fontFace: SERIF, fontSize: 16, bold: true, color: TEAL, margin: 0 });
  const pts = [
    ["3,6 p.p.", "separam o único caso híbrido (Cuiabá) do melhor caso individual (Mooca). Isso é ruído, não efeito."],
    ["63 p.p.", "separam os shoppings dentro do mesmo modelo individual — de 8,2% a 71,3%."],
    ["n = 1", "não sustenta uma recomendação de portfólio: não há controle nem contrafactual."],
  ];
  let yy = y0 + 0.72;
  pts.forEach(([big, txt]) => {
    s.addText(big, { x: bx + 0.26, y: yy, w: bw - 0.5, h: 0.42,
      fontFace: SERIF, fontSize: 22, bold: true, color: AMBER, margin: 0 });
    s.addText(txt, { x: bx + 0.26, y: yy + 0.42, w: bw - 0.55, h: 0.74,
      fontFace: SANS, fontSize: 11, color: BODY, margin: 0, lineSpacing: 15 });
    yy += 1.28;
  });

  s.addText("Fonte: deck Estratégia de Seguro para Lojas v21.08, slide 14 · posição de jul/26",
    { x: ML, y: y0 + 4.55, w: CW, h: 0.25, fontFace: MONO, fontSize: 8, color: MUTED, margin: 0 });
  s.addNotes("Este é o slide que muda a conversa. O gráfico do material original sugere que o híbrido funciona. Os mesmos números mostram que a execução explica quase tudo.");
}

/* ===================== 07 · alerta de dado ===================== */
{
  const s = slide();
  const y0 = head(s, "04 · EVIDÊNCIA", "Quatro alertas de dado",
    "Verificar antes de qualquer apresentação a comitê. São o tipo de erro que compromete a credibilidade de todo o material.");

  const al = [
    ["Julho parece replicar junho", CRIT,
     "Na série mensal do slide 13, todos os estágios repetem exatamente os valores de junho em julho: 181, 786, 378 e 1.223. Ou o mês não foi atualizado, ou o gráfico está mal montado — e o material reporta 48% em jul/26 e evolução sobre ele."],
    ["A base de março não é mostrada", AMBER,
     "O indicador +32 p.p. contra março implica uma base de aproximadamente 16%. A série exibida começa em abril, em torno de 21%. A base que sustenta o principal número de progresso do programa não aparece."],
    ["A queda em sem contato não é contínua", AMBER,
     "A série vai de 576 em abril para 129 em maio e sobe para 181 em junho e julho. O −68% está correto na ponta, mas apresentar como evolução contínua não corresponde à série."],
    ["O escopo do portfólio não é declarado", AMBER,
     "O material trata de 10 shoppings e cerca de 2.570 lojas, sem dizer se é o portfólio inteiro ou um piloto. A diferença muda completamente a leitura dos 48%."],
  ];
  const cw2 = (CW - 0.3) / 2;
  al.forEach(([t, c, d], i) => {
    const x = ML + (i % 2) * (cw2 + 0.3);
    const y = y0 + Math.floor(i / 2) * 2.05;
    card(s, x, y, cw2, 1.8);
    s.addShape(p.ShapeType.rect, { x: x + 0.26, y: y + 0.3, w: 0.14, h: 0.14,
      fill: { color: c }, line: { color: c } });
    s.addText(t, { x: x + 0.56, y: y + 0.19, w: cw2 - 0.8, h: 0.32,
      fontFace: SERIF, fontSize: 15, bold: true, color: TEAL, margin: 0 });
    s.addText(d, { x: x + 0.56, y: y + 0.56, w: cw2 - 0.85, h: 1.1,
      fontFace: SANS, fontSize: 11, color: BODY, margin: 0, lineSpacing: 15.5 });
  });
  s.addNotes("O primeiro alerta é o mais sério. Antes de levar qualquer número a comitê, o BI precisa reconstruir a série de abril a julho.");
}

/* ===================== 08 · quem tem o interesse ===================== */
{
  const s = slide();
  const y0 = head(s, "05 · OPÇÕES", "Quatro modelos, não três",
    "O material compara os modelos por um único eixo — quem contrata. Falta o eixo mais produtivo: o que se contrata. Nem toda cobertura tem o mesmo dono de interesse.");

  tbl(s, [
    [th("Cobertura"), th("Interesse primário"), th("Quem deveria contratar"), th("Consequência se faltar")],
    [td("RC Operações — danos a terceiros e ao empreendimento"), td("Shopping"),
     td("Shopping", { bold: true, color: TEAL }), td("Pleito chega ao empreendedor sem lastro de cobertura")],
    [td("Incêndio e explosão com dano à estrutura"), td("Shopping"),
     td("Shopping", { bold: true, color: TEAL }), td("Dano ao imóvel locado corre por conta do proprietário")],
    [td("Perda de aluguel e encargos"), td("Shopping (locador)"),
     td("Shopping", { bold: true, color: TEAL }), td("Receita perdida durante a reconstrução não é reposta")],
    [td("Estoque, benfeitorias e equipamentos"), td("Lojista"),
     td("Lojista"), td("Prejuízo do lojista; não atinge o shopping diretamente")],
    [td("Lucros cessantes da operação"), td("Lojista"),
     td("Lojista"), td("Prejuízo do lojista; risco indireto de inadimplência")],
    [td("RC profissional — saúde e estética"), td("Lojista"),
     td("Lojista"), td("Risco da atividade, com respingo reputacional")],
  ], { y: y0, colW: [4.3, 2.0, 2.2, 3.5], rowH: 0.5, fontSize: 10.5 });

  s.addText(
    "As três primeiras linhas protegem o empreendedor. Hoje elas dependem de uma curva de adesão que está em 48% — ou seja, mais da metade do portfólio não tem essa proteção, e o shopping não controla quando terá.",
    { x: ML, y: y0 + 3.95, w: CW * 0.88, h: 0.6, fontFace: SANS, fontSize: 12.5,
      color: BODY, margin: 0, lineSpacing: 17.5 });
  s.addNotes("A pergunta que abre o Modelo IV: por que estamos tratando coberturas com donos de interesse diferentes como um pacote único?");
}

/* ===================== 09 · modelo IV ===================== */
{
  const s = slide();
  const y0 = head(s, "05 · OPÇÕES", "Modelo IV — centralizado por escopo");

  card(s, ML, y0, CW, 1.15, SAND);
  s.addText(
    "O shopping contrata, como estipulante, uma apólice coletiva cobrindo apenas as coberturas de interesse do empreendedor — RC, incêndio com dano ao imóvel locado e perda de aluguel — com rateio por m². As coberturas de interesse exclusivo do lojista permanecem livres, com regras mínimas e corretora homologada opcional.",
    { x: ML + 0.3, y: y0 + 0.18, w: CW - 0.6, h: 0.94, fontFace: SERIF, fontSize: 14.5,
      color: TEAL, margin: 0, lineSpacing: 21 });

  const ben = [
    ["Protege em 100% no dia 1", "Elimina a dependência de adesão justamente na camada onde o shopping está exposto. Hoje essa proteção é função direta de um número parado em 48%."],
    ["Fricção baixa com redes", "O lojista não abandona sua apólice de estoque nem sua corretora. Neutraliza a principal objeção das redes nacionais ao modelo centralizado puro."],
    ["Volume contratado, não esperado", "Muda o poder de negociação. A Ezze desistiu de um projeto que pedia customização sem garantir volume — porque, no híbrido, a adesão é voluntária."],
    ["Cria o elo com a apólice master", "Pode ser negociada como extensão do programa corporativo, permitindo discutir retenção e prêmio consolidados — o objetivo macro nº 1."],
  ];
  const bw = (CW - 0.45) / 4;
  ben.forEach(([t, d], i) => {
    const x = ML + i * (bw + 0.15);
    card(s, x, y0 + 1.35, bw, 2.05, WHITE);
    s.addText(t, { x: x + 0.22, y: y0 + 1.55, w: bw - 0.44, h: 0.55,
      fontFace: SERIF, fontSize: 14, bold: true, color: AMBER, margin: 0, lineSpacing: 18 });
    s.addText(d, { x: x + 0.22, y: y0 + 2.12, w: bw - 0.44, h: 1.26,
      fontFace: SANS, fontSize: 10.5, color: BODY, margin: 0, lineSpacing: 14.5 });
  });

  s.addShape(p.ShapeType.rect, { x: ML, y: y0 + 3.6, w: CW, h: 1.12,
    fill: { color: "FBF3E4" }, line: { color: AMBER_L, width: 0.75 } });
  s.addText("RISCOS A TRATAR", { x: ML + 0.3, y: y0 + 3.74, w: 2, h: 0.22,
    fontFace: MONO, fontSize: 8, color: AMBER, charSpacing: 1.4, margin: 0 });
  s.addText(
    "Caracterização do repasse no condomínio (exige previsão em normas gerais e aprovação em assembleia) · papel de estipulante perante a SUSEP, que aqui sim se aplica · tratamento tributário do repasse · responsabilidade reputacional em sinistro. São riscos reais e administráveis — e precisam ser comparados de frente com o custo de conviver com 48% de cobertura por tempo indeterminado.",
    { x: ML + 0.3, y: y0 + 3.98, w: CW - 0.6, h: 0.68, fontFace: SANS, fontSize: 10.5,
      color: BODY, margin: 0, lineSpacing: 14.5 });
  s.addNotes("Não estou recomendando o Modelo IV hoje. Estou dizendo que ele precisa estar na matriz de comparação, e que a Fase 0 deve cotá-lo.");
}

/* ===================== 10 · comparativo ===================== */
{
  const s = slide();
  const y0 = head(s, "05 · OPÇÕES", "Comparativo dos quatro modelos",
    "A tabela do material original é qualitativa, mistura dimensões e não tem pesos — não permite auditar como a recomendação foi obtida.");

  tbl(s, [
    [th("Critério"), th("I · Individual"), th("II · Híbrido"), th("III · Centralizado"),
     th("IV · Por escopo", { fill: AMBER })],
    [td("Proteção do empreendedor", { bold: true }), td("Depende da adesão"), td("Depende da adesão"),
     td("Total"), td("Total na camada que importa", { bold: true, color: TEAL, fill: "FBF3E4" })],
    [td("Fricção com redes nacionais", { bold: true }), td("Nenhuma"), td("Média"), td("Alta"),
     td("Baixa", { bold: true, color: TEAL, fill: "FBF3E4" })],
    [td("Custo repassado ao lojista", { bold: true }), td("Variável"), td("Variável"), td("Integral"),
     td("Parcial e previsível", { fill: "FBF3E4" })],
    [td("Poder de negociação", { bold: true }), td("Nenhum"), td("Volume esperado"), td("Volume contratado"),
     td("Volume contratado", { bold: true, color: TEAL, fill: "FBF3E4" })],
    [td("Papel de estipulante · SUSEP", { bold: true }), td("Não"), td("Não"), td("Sim"),
     td("Sim", { fill: "FBF3E4" })],
    [td("Prazo até efeito pleno", { bold: true }), td("—"), td("~5 anos · ciclo contratual"), td("~5 anos"),
     td("1 ciclo de assembleia", { bold: true, color: TEAL, fill: "FBF3E4" })],
    [td("Esforço operacional recorrente", { bold: true }), td("Alto e improdutivo"), td("Alto"), td("Médio"),
     td("Baixo na camada central", { fill: "FBF3E4" })],
  ], { y: y0, colW: [3.0, 2.1, 2.35, 2.25, 2.3], rowH: 0.44, fontSize: 10 });

  s.addText(
    "A comparação final deve ser uma matriz ponderada com pesos declarados por critério, alimentada pelos dados da Fase 0. Até lá, nenhum modelo deveria ser recomendado.",
    { x: ML, y: y0 + 4.0, w: CW * 0.85, h: 0.58, fontFace: SANS, fontSize: 12.5,
      bold: true, color: TEAL, margin: 0, lineSpacing: 17 });
  s.addNotes("A coluna destacada é a que falta no material original. Ela não é a resposta — é a opção que precisa ser cotada antes de decidir.");
}

/* ===================== 11 · enforcement ===================== */
{
  const s = slide();
  const y0 = head(s, "06 · ALAVANCAS", "A alavanca de enforcement que falta",
    "O fluxo atual termina em despejo — sanção que ninguém executa com pressão de vacância. É um blefe que o lojista conhece, e explica boa parte dos 48%.");

  const lev = [
    ["1", "Seguro contratado pelo shopping por conta do lojista inadimplente", AMBER,
     "Force-placed insurance, padrão em real estate nos EUA. Passado o prazo de notificação, o shopping contrata a cobertura mínima e cobra no boleto de condomínio. Converte cobrança de documento — que o shopping não sabe fazer — em cobrança financeira, que ele faz todo mês. É a mudança de maior impacto isolado disponível.",
     "Requer cláusula contratual expressa, previsão em normas gerais, notificação prévia, preço de mercado comprovado e repasse a custo, sem margem."],
    ["2", "Bloqueio de benefícios", TEAL,
     "Mídia interna, participação em campanhas, ações promocionais e destaque em app e site — retirados enquanto houver pendência documental.", ""],
    ["3", "Retenção de aprovações", TEAL,
     "Projeto de reforma, autorização de obra, nada consta para renovação e para cessão ou transferência de ponto.", ""],
    ["4", "Multa lançada no boleto", TEAL,
     "Débito automático no condomínio, sem passar pela etapa jurídica que hoje trava o fluxo.", ""],
  ];

  card(s, ML, y0, CW * 0.53, 3.5, "FBF3E4");
  s.addText("01", { x: ML + 0.3, y: y0 + 0.24, w: 0.6, h: 0.35,
    fontFace: MONO, fontSize: 13, bold: true, color: AMBER, margin: 0 });
  s.addText(lev[0][1], { x: ML + 0.3, y: y0 + 0.6, w: CW * 0.53 - 0.6, h: 0.6,
    fontFace: SERIF, fontSize: 16, bold: true, color: TEAL, margin: 0, lineSpacing: 21 });
  s.addText(lev[0][3], { x: ML + 0.3, y: y0 + 1.3, w: CW * 0.53 - 0.6, h: 1.35,
    fontFace: SANS, fontSize: 11.5, color: BODY, margin: 0, lineSpacing: 16 });
  s.addText(lev[0][4], { x: ML + 0.3, y: y0 + 2.72, w: CW * 0.53 - 0.6, h: 0.6,
    fontFace: SANS, fontSize: 10, italic: true, color: MUTED, margin: 0, lineSpacing: 13.5 });

  let y = y0;
  const rx = ML + CW * 0.53 + 0.3, rw = CW - CW * 0.53 - 0.3;
  lev.slice(1).forEach(([n, t, c, d]) => {
    card(s, rx, y, rw, 1.16, WHITE);
    s.addText("0" + n, { x: rx + 0.24, y: y + 0.2, w: 0.5, h: 0.25,
      fontFace: MONO, fontSize: 10, bold: true, color: AMBER, margin: 0 });
    s.addText(t, { x: rx + 0.8, y: y + 0.16, w: rw - 1.05, h: 0.3,
      fontFace: SERIF, fontSize: 13.5, bold: true, color: TEAL, margin: 0 });
    s.addText(d, { x: rx + 0.8, y: y + 0.48, w: rw - 1.05, h: 0.62,
      fontFace: SANS, fontSize: 10.5, color: BODY, margin: 0, lineSpacing: 14 });
    y += 1.26;
  });

  s.addText("Estas alavancas funcionam nos quatro modelos, e provavelmente têm efeito maior sobre a cobertura real do que a troca de modelo — a um custo de implantação muito menor.",
    { x: ML, y: y0 + 3.72, w: CW * 0.9, h: 0.55, fontFace: SANS, fontSize: 12.5,
      bold: true, color: TEAL, margin: 0, lineSpacing: 17 });
  s.addNotes("O ganho rápido. Não depende de escolher modelo, não depende de RFP, e ataca diretamente a causa dos 48%.");
}

/* ===================== 12 · perguntas-chave ===================== */
{
  const s = slide();
  const y0 = head(s, "07 · PERGUNTAS", "As dez perguntas que o comitê vai fazer",
    "Nenhuma é respondível com o material atual. Cada uma está mapeada ao dado que a responde.");

  const qs = [
    ["Quanto custa hoje a apólice master, e quanto deste projeto retorna para ela?", "A1 · A2"],
    ["Quantos sinistros com origem em loja o shopping absorveu em 5 anos, e quanto pagou?", "A3 · A4"],
    ["Quanto custa montar e operar o programa por ano — headcount, sistema, auditoria?", "A5"],
    ["Qual é a economia esperada para o lojista, em R$/m², e com que evidência?", "D1"],
    ["O shopping recebe alguma remuneração da corretora ou seguradora, direta ou indireta?", "Decisão D1"],
    ["Se a comissão de mercado é 30%, quanto do ganho de escala é apenas corte de comissão?", "D2"],
    ["Quais são exatamente as coberturas e os LMIs mínimos que estamos aprovando?", "B1 · B2 · D1"],
    ["Como isso alcança os contratos vigentes, e não só as novas locações?", "C1 · C3 · C4"],
    ["Por que Norteshopping está em 8,2% e Cuiabá em 74,9%? Isso é modelo ou é gestão?", "E1 · E2"],
    ["Qual é o gate de go/no-go da Fase 1, com que critério e em que prazo?", "Fase 0"],
  ];
  const cw2 = (CW - 0.35) / 2;
  qs.forEach(([q, m], i) => {
    const col = i < 5 ? 0 : 1;
    const row = i % 5;
    const x = ML + col * (cw2 + 0.35);
    const y = y0 + row * 0.86;
    s.addText(String(i + 1).padStart(2, "0"), { x, y: y + 0.04, w: 0.38, h: 0.28,
      fontFace: MONO, fontSize: 11, bold: true, color: AMBER, margin: 0 });
    s.addText(q, { x: x + 0.45, y, w: cw2 - 0.5, h: 0.46,
      fontFace: SANS, fontSize: 12, color: TEAL, margin: 0, lineSpacing: 16 });
    s.addText("responde: " + m, { x: x + 0.45, y: y + 0.46, w: cw2 - 0.5, h: 0.22,
      fontFace: MONO, fontSize: 8, color: MUTED, charSpacing: 0.8, margin: 0 });
    s.addShape(p.ShapeType.line, { x, y: y + 0.74, w: cw2, h: 0,
      line: { color: SAND_D, width: 0.75 } });
  });
  s.addNotes("Se alguma dessas perguntas for feita e não tivermos resposta, o projeto volta para a mesa. Melhor antecipar.");
}

/* ===================== 13 · decisões ===================== */
{
  const s = slide();
  const y0 = head(s, "08 · DECISÕES", "O que depende de escolha, não de dado",
    "Seis posições que a liderança precisa tomar para que o levantamento tenha direção.");

  tbl(s, [
    [th("#"), th("Decisão"), th("Recomendação"), th("Dono")],
    [td("D1", { bold: true, color: AMBER, fontFace: MONO }),
     td("O shopping recebe alguma remuneração da corretora ou seguradora? Direta, indireta, verba de marketing, rebate.", { bold: true }),
     td("Não receber nada. Se houver qualquer valor, reverter ao condomínio com transparência em assembleia. Teto de comissão de 15–20% no RFP, com a diferença revertida em prêmio."),
     td("Jurídico + Diretoria")],
    [td("D2", { bold: true, color: AMBER, fontFace: MONO }),
     td("Qual é a métrica oficial do programa?", { bold: true }),
     td("Cobertura Qualificada, em % do GLA. Adesão nominal vira métrica de processo."),
     td("Riscos")],
    [td("D3", { bold: true, color: AMBER, fontFace: MONO }),
     td("O escopo é o portfólio inteiro ou os 10 shoppings acompanhados?", { bold: true }),
     td("Definir e declarar. Muda a leitura de todos os números reportados até aqui."),
     td("Diretoria de Portfólio")],
    [td("D4", { bold: true, color: AMBER, fontFace: MONO }),
     td("Quem é o dono do KPI? Hoje o programa não tem dono nomeado, meta por shopping nem consequência.", { bold: true }),
     td("Gerente geral de cada shopping, com meta trimestral, escalada regional e revisão em comitê."),
     td("Diretoria de Portfólio")],
    [td("D5", { bold: true, color: AMBER, fontFace: MONO }),
     td("Qual é o apetite para atrito com redes nacionais?", { bold: true }),
     td("Aceitar apólices próprias que cumpram os mínimos. Define a viabilidade dos modelos III e IV."),
     td("Comercial + Diretoria")],
    [td("D6", { bold: true, color: AMBER, fontFace: MONO }),
     td("Como vamos a mercado? A negociação Ezze foi sequencial e exclusiva.", { bold: true }),
     td("RFP simultâneo com 4–6 seguradoras, critérios publicados e gates de 30 dias."),
     td("Riscos + Suprimentos")],
  ], { y: y0, colW: [0.55, 4.1, 5.5, 1.85], rowH: 0.52, fontSize: 10 });
  s.addNotes("D1 é a decisão que condiciona todo o desenho. Sem ela resolvida, qualquer conversa com corretora fica contaminada.");
}

/* ===================== 14 · dados A e B ===================== */
{
  const s = slide();
  const y0 = head(s, "09 · LEVANTAMENTO", "Os dados que precisamos buscar — 1 de 3",
    "Fase 0, 45 dias. Cada linha existe porque destrava uma pergunta do comitê ou uma hipótese. O que não destrava nada não entra.");

  tbl(s, [
    [th("#"), th("Dado"), th("Onde buscar"), th("Dono"), th("Prazo")],
    sub("BLOCO A · FINANCEIRO E APÓLICE MASTER", 5),
    [td("A1", { fontFace: MONO, color: AMBER }), td("Prêmio anual, franquia e escopo da apólice master, por shopping e consolidado"), td("Corretora atual · seguros corporativos"), td("Riscos"), td("D+10", { fontFace: MONO, align: "right" })],
    [td("A2", { fontFace: MONO, color: AMBER }), td("Sinistralidade do master nos últimos 5 anos — avisados, pagos, negados"), td("Corretora · seguradora"), td("Riscos"), td("D+15", { fontFace: MONO, align: "right" })],
    [td("A3", { fontFace: MONO, color: AMBER }), td("Sinistros com origem em loja: quantidade, valor e quanto o shopping absorveu"), td("Jurídico + Riscos"), td("Jurídico"), td("D+20", { fontFace: MONO, align: "right" })],
    [td("A4", { fontFace: MONO, color: AMBER }), td("Contingências e provisões judiciais ligadas a sinistros de lojistas"), td("Jurídico · Contabilidade"), td("Jurídico"), td("D+20", { fontFace: MONO, align: "right" })],
    [td("A5", { fontFace: MONO, color: AMBER }), td("Custo atual do processo de cobrança — horas de regional e jurídico, por amostragem"), td("Operações · Regional"), td("Operações"), td("D+15", { fontFace: MONO, align: "right" })],
    sub("BLOCO B · EXPOSIÇÃO E COBERTURA REAL", 5),
    [td("B1", { fontFace: MONO, color: AMBER }), td("Auditoria amostral de 200 apólices: LMI por cobertura, exclusões, vigência, seguradora"), td("Base documental dos shoppings"), td("Riscos"), td("D+25", { fontFace: MONO, align: "right" })],
    [td("B2", { fontFace: MONO, color: AMBER }), td("Distribuição de LMI por categoria de operação"), td("Derivado de B1"), td("Riscos"), td("D+30", { fontFace: MONO, align: "right" })],
    [td("B3", { fontFace: MONO, color: AMBER }), td("Baseline de Cobertura Qualificada — % do GLA que atenderia a um mínimo razoável hoje", { bold: true }), td("Derivado de B1 + B2"), td("Riscos"), td("D+30", { fontFace: MONO, align: "right" })],
    [td("B4", { fontFace: MONO, color: AMBER }), td("Mapa de operações de alto risco — cocção, lazer infantil, saúde, alto valor de estoque"), td("Base de mix · Comercial"), td("Comercial"), td("D+10", { fontFace: MONO, align: "right" })],
    [td("B5", { fontFace: MONO, color: AMBER }), td("Conformidade PPCI, AVCB e laudo elétrico por loja"), td("Engenharia · Operações"), td("Operações"), td("D+20", { fontFace: MONO, align: "right" })],
  ], { y: y0, colW: [0.6, 5.5, 3.0, 1.6, 1.3], rowH: 0.32, fontSize: 9.5 });
  s.addNotes("B3 é o entregável mais importante do bloco: é o baseline da métrica nova. Sem ele não há como medir sucesso.");
}

/* ===================== 15 · dados C e D ===================== */
{
  const s = slide();
  const y0 = head(s, "09 · LEVANTAMENTO", "Os dados que precisamos buscar — 2 de 3");

  tbl(s, [
    [th("#"), th("Dado"), th("Onde buscar"), th("Dono"), th("Prazo")],
    sub("BLOCO C · CONTRATOS E ALAVANCAS JURÍDICAS", 5),
    [td("C1", { fontFace: MONO, color: AMBER }), td("Curva de vencimento dos contratos de locação nos próximos 60 meses"), td("Contratos · BI"), td("Jurídico"), td("D+10", { fontFace: MONO, align: "right" })],
    [td("C2", { fontFace: MONO, color: AMBER }), td("Redação atual da cláusula de seguro — quantas versões de minuta circulam"), td("Jurídico"), td("Jurídico"), td("D+10", { fontFace: MONO, align: "right" })],
    [td("C3", { fontFace: MONO, color: AMBER }), td("Normas Gerais por shopping, rito de alteração e calendário de assembleias"), td("Jurídico · Condomínio"), td("Jurídico"), td("D+15", { fontFace: MONO, align: "right" })],
    [td("C4", { fontFace: MONO, color: AMBER }), td("Parecer sobre force-placed insurance, com repasse a custo", { bold: true }), td("Parecer jurídico externo"), td("Jurídico"), td("D+30", { fontFace: MONO, align: "right" })],
    [td("C5", { fontFace: MONO, color: AMBER }), td("Parecer sobre venda casada, papel de estipulante e repasse via condomínio", { bold: true }), td("Parecer jurídico externo"), td("Jurídico"), td("D+30", { fontFace: MONO, align: "right" })],
    [td("C6", { fontFace: MONO, color: AMBER }), td("Covenants de financiamento que exijam programa de seguros"), td("Tesouraria"), td("Financeiro"), td("D+15", { fontFace: MONO, align: "right" })],
    sub("BLOCO D · MERCADO E PREÇO", 5),
    [td("D1", { fontFace: MONO, color: AMBER }), td("Cotação-referência por categoria e por m², com 4–6 seguradoras"), td("RFP · sondagem simultânea"), td("Riscos"), td("D+45", { fontFace: MONO, align: "right" })],
    [td("D2", { fontFace: MONO, color: AMBER }), td("Tabela de comissionamento praticada e teto negociável por player"), td("RFP"), td("Riscos"), td("D+45", { fontFace: MONO, align: "right" })],
    [td("D3", { fontFace: MONO, color: AMBER }), td("Apetite do mercado para a camada por escopo (Modelo IV) e preço por m²"), td("Sondagem dirigida"), td("Riscos"), td("D+45", { fontFace: MONO, align: "right" })],
    [td("D4", { fontFace: MONO, color: AMBER }), td("Benchmark de como outros grupos estruturam — modelo, escopo, adesão obtida"), td("Pares · corretoras · Abrasce"), td("Riscos"), td("D+30", { fontFace: MONO, align: "right" })],
  ], { y: y0, colW: [0.6, 5.5, 3.0, 1.6, 1.3], rowH: 0.34, fontSize: 9.5 });
  s.addNotes("C4 e C5 são os dois pareceres externos que precisam de orçamento aprovado. São o item de maior lead time do bloco.");
}

/* ===================== 16 · bloco E ===================== */
{
  const s = slide();
  const y0 = head(s, "09 · LEVANTAMENTO", "Os dados que precisamos buscar — 3 de 3",
    "Bloco E existe para responder a uma única pergunta: por que Cuiabá consegue 74,9% e Norteshopping fica em 8,2%?");

  const e = [
    ["E1", "Entrevistas estruturadas nos extremos", "D+20", "Operações",
     "Cuiabá e Mooca, de um lado; Norteshopping e Carioca, do outro. O que investigar: processo usado, quem executa, ferramentas, discurso empregado com o lojista e ponto exato onde a esteira trava."],
    ["E2", "Perfil comparável dos 10 shoppings", "D+10", "BI",
     "Percentual de redes nacionais, GLA médio, idade do empreendimento, vacância e tempo médio de contrato. Sem esses controles, comparar modelos é comparar coisas diferentes."],
    ["E3", "Reconstrução e validação da série abr–jul/26", "D+5", "BI",
     "Item de caminho crítico e o mais urgente da lista. Enquanto julho não for confirmado, nenhum número de progresso do programa deve ser apresentado externamente."],
  ];
  let y = y0;
  e.forEach(([n, t, prazo, dono, d], i) => {
    card(s, ML, y, CW, 1.12, i === 2 ? "FBF3E4" : SAND);
    s.addText(n, { x: ML + 0.3, y: y + 0.22, w: 0.6, h: 0.3,
      fontFace: MONO, fontSize: 13, bold: true, color: AMBER, margin: 0 });
    s.addText(t, { x: ML + 1.0, y: y + 0.18, w: CW - 3.6, h: 0.34,
      fontFace: SERIF, fontSize: 15.5, bold: true, color: TEAL, margin: 0 });
    s.addText(d, { x: ML + 1.0, y: y + 0.55, w: CW - 3.6, h: 0.5,
      fontFace: SANS, fontSize: 11, color: BODY, margin: 0, lineSpacing: 15 });
    s.addText(prazo, { x: W - ML - 2.3, y: y + 0.24, w: 2.0, h: 0.35, align: "right",
      fontFace: MONO, fontSize: 17, bold: true, color: TEAL, margin: 0 });
    s.addText(dono, { x: W - ML - 2.3, y: y + 0.62, w: 2.0, h: 0.24, align: "right",
      fontFace: MONO, fontSize: 9, color: MUTED, charSpacing: 0.8, margin: 0 });
    y += 1.24;
  });

  s.addShape(p.ShapeType.rect, { x: ML, y: y + 0.1, w: CW, h: 0.82,
    fill: { color: TEAL }, line: { color: TEAL } });
  s.addText("Se a resposta do bloco E for gestão e não modelo, a prioridade do programa muda por completo — e fica muito mais barata.",
    { x: ML + 0.3, y: y + 0.24, w: CW - 0.6, h: 0.56, fontFace: SERIF,
      fontSize: 14.5, bold: true, color: WHITE, margin: 0 });
  s.addNotes("E3 é o item mais urgente de toda a Fase 0: cinco dias, e destrava a credibilidade de todo o reporting.");
}

/* ===================== 17-18 · hipóteses ===================== */
const hyps = [
  ["H1", "Existe transbordo material de risco do lojista para o empreendedor",
   "Os últimos 5 anos mostram custo absorvido pelo shopping — franquia, não coberto, acordo, condenação.",
   "A exposição histórica é imaterial: o projeto é compliance, não risco, e o investimento encolhe.",
   "O tamanho do prêmio que vale a pena pagar, e se há caso econômico para o Modelo IV."],
  ["H2", "A cobertura real é muito menor do que a adesão nominal sugere",
   "A amostra mostra que uma minoria das apólices atende a um mínimo razoável de coberturas e limites.",
   "A cauda de LMI baixo é residual e a mediana já é adequada: o problema é de alcance, não de qualidade.",
   "A troca da métrica oficial e a calibragem dos LMIs mínimos por categoria."],
  ["H3", "A variação de adesão é explicada por execução, não por modelo",
   "Controlados porte, mix e % de redes, o efeito do híbrido é pequeno e as entrevistas apontam processo.",
   "Shoppings comparáveis divergem sistematicamente pelo modelo adotado, e não pela gestão.",
   "A prioridade: processo e enforcement, barato, contra mudança de modelo, cara e lenta."],
  ["H4", "Existe ganho de escala real, e ele não é só corte de comissão",
   "A cotação consolidada fica abaixo do prêmio médio atual, mesmo mantida a comissão de mercado.",
   "A diferença some quando a comissão é normalizada: o ganho é de remuneração, não de escala.",
   "A proposta de valor ao lojista e a régua de negociação com as seguradoras."],
  ["H5", "A camada centralizada por escopo é viável, barata e segura",
   "A cotação de RC, incêndio e perda de aluguel cabe no rateio, e o parecer valida o repasse.",
   "O preço se aproxima do seguro completo, ou o repasse via condomínio é juridicamente frágil.",
   "A recomendação final de modelo ao comitê — hoje prematura."],
  ["H6", "O gargalo é enforcement, e há alavanca melhor que o despejo",
   "O parecer valida o force-placed e as Normas Gerais admitem alteração em prazo razoável.",
   "A contratação por conta do lojista é inexequível: restam bloqueio de benefícios e retenção de aprovações.",
   "Um ganho rápido, independente da escolha de modelo."],
  ["H7", "O programa se paga",
   "Economia no master, perdas evitadas e prêmio do lojista superam o custo do programa em 24 meses.",
   "O payback passa de 36 meses: a justificativa vira governança e risco de cauda, e muda de termos.",
   "O orçamento e o headcount que o comitê está sendo chamado a aprovar."],
];

[[0, 4, "1 de 2", "As conclusões que precisamos buscar",
  "Sete hipóteses, cada uma com critério de refutação declarado antes de olhar o dado."],
 [4, 7, "2 de 2", "As conclusões que precisamos buscar",
  "O levantamento não existe para produzir relatório: existe para confirmar ou derrubar cada uma delas."]]
.forEach(([a, b, tag, title, note]) => {
  const s = slide();
  head(s, "10 · HIPÓTESES · " + tag, title);
  s.addText(note, { x: ML, y: 1.38, w: CW * 0.85, h: 0.3,
    fontFace: SANS, fontSize: 13, color: BODY, margin: 0 });
  const y0 = 1.8;
  const items = hyps.slice(a, b);
  const cw2 = (CW - 0.3) / 2, ch = 2.26;
  items.forEach((h, i) => {
    const x = ML + (i % 2) * (cw2 + 0.3);
    const y = y0 + Math.floor(i / 2) * (ch + 0.22);
    card(s, x, y, cw2, ch, WHITE);
    s.addText(h[0], { x: x + 0.24, y: y + 0.17, w: 0.45, h: 0.26,
      fontFace: MONO, fontSize: 11, bold: true, color: AMBER, margin: 0 });
    s.addText(h[1], { x: x + 0.75, y: y + 0.13, w: cw2 - 1.0, h: 0.58,
      fontFace: SERIF, fontSize: 13.5, bold: true, color: TEAL, margin: 0, lineSpacing: 18 });
    const rows = [["CONFIRMA SE", h[2], BODY], ["REFUTA SE", h[3], BODY], ["DESTRAVA", h[4], TEAL]];
    let yy = y + 0.74;
    rows.forEach(([lab, txt, col], j) => {
      if (j === 2) {
        s.addShape(p.ShapeType.line, { x: x + 0.24, y: yy - 0.03, w: cw2 - 0.48, h: 0,
          line: { color: SAND_D, width: 0.75 } });
        yy += 0.05;
      }
      s.addText(lab, { x: x + 0.24, y: yy, w: 1.05, h: 0.2,
        fontFace: MONO, fontSize: 7.5, color: MUTED, charSpacing: 0.8, margin: 0 });
      s.addText(txt, { x: x + 1.34, y: yy - 0.04, w: cw2 - 1.6, h: 0.42,
        fontFace: SANS, fontSize: 10, color: col, bold: j === 2, margin: 0, lineSpacing: 13 });
      yy += 0.49;
    });
  });
  s.addNotes("Critério de refutação declarado antes do dado. É o que separa levantamento de confirmação de viés.");
});
/* ===================== 19 · plano ===================== */
{
  const s = slide();
  const y0 = head(s, "11 · PLANO", "Plano revisado em quatro fases",
    "A Fase 0 não existe no roadmap atual — e é justamente o que falta para que as demais sejam executáveis.");

  const ph = [
    ["FASE 0 · NOVA", "Baseline", "0 – 45 dias", AMBER,
     ["Blocos A a E do levantamento", "Decisões D1 a D6 tomadas", "Pareceres jurídicos contratados", "Série abr–jul reconstruída", "Matriz ponderada dos 4 modelos"]],
    ["FASE 1", "Estruturação", "45 dias – 6 meses", TEAL,
     ["Matriz de coberturas e LMIs mínimos", "RFP simultâneo com 4–6 seguradoras", "Padronização das Normas Gerais", "Nova cláusula na minuta de locação", "Piloto controlado e pareado, 3 contra 3"]],
    ["FASE 2", "Implantação", "6 – 18 meses", TEAL,
     ["Duas vias: locação e assembleia", "Painel de Cobertura Qualificada", "Enforcement gradual em produção", "Primeiro ciclo de auditoria independente"]],
    ["FASE 3", "Consolidação", "18 – 36 meses", TEAL,
     ["Renegociação consolidada, master incluída", "Índice de Risco da Loja em produção", "Precificação por conformidade", "Replicação no portfólio inteiro"]],
  ];
  const pw = (CW - 0.45) / 4;
  ph.forEach(([tag, name, when, col, bullets], i) => {
    const x = ML + i * (pw + 0.15);
    card(s, x, y0, pw, 3.75, i === 0 ? "FBF3E4" : SAND);
    s.addText(tag, { x: x + 0.24, y: y0 + 0.22, w: pw - 0.4, h: 0.22,
      fontFace: MONO, fontSize: 8, color: col, charSpacing: 1.4, bold: true, margin: 0 });
    s.addText(name, { x: x + 0.24, y: y0 + 0.48, w: pw - 0.4, h: 0.38,
      fontFace: SERIF, fontSize: 20, bold: true, color: TEAL, margin: 0 });
    s.addText(when, { x: x + 0.24, y: y0 + 0.88, w: pw - 0.4, h: 0.24,
      fontFace: MONO, fontSize: 9, color: MUTED, margin: 0 });
    s.addText(bullets.map((b, j) => ({
      text: b, options: { bullet: true, breakLine: j !== bullets.length - 1 },
    })), { x: x + 0.24, y: y0 + 1.28, w: pw - 0.44, h: 2.3,
      fontFace: SANS, fontSize: 10.5, color: BODY, margin: 0,
      paraSpaceAfter: 6, lineSpacing: 13.5 });
  });

  s.addText("Do painel de conformidade ao painel de risco:", { x: ML, y: y0 + 3.9, w: 3.3, h: 0.5,
    fontFace: SERIF, fontSize: 13, bold: true, color: TEAL, margin: 0 });
  s.addText("a tese de que o seguro vira camada de inteligência operacional só se sustenta se o dado retroalimentar decisão. A ponte é um Índice de Risco da Loja — cobertura qualificada, conformidade de PPCI e laudos, histórico de ocorrências e categoria — usado como entrada formal em renovação contratual, aprovação de reforma e precificação.",
    { x: ML + 3.4, y: y0 + 3.88, w: CW - 3.4, h: 0.68, fontFace: SANS, fontSize: 10.5,
      color: BODY, margin: 0, lineSpacing: 14 });
  s.addNotes("As fases 1 a 3 são as do material original, realinhadas ao ciclo contratual real de cinco anos.");
}

/* ===================== 20 · KPIs ===================== */
{
  const s = slide();
  const y0 = head(s, "12 · GOVERNANÇA", "Painel de KPIs proposto",
    "Substitui o painel atual, que mede conformidade documental. A métrica principal muda de posse de papel para proteção efetiva.");

  tbl(s, [
    [th("Indicador"), th("Papel"), th("Por que existe")],
    [td("Cobertura Qualificada — % do GLA", { bold: true, color: TEAL }),
     td("Principal", { color: GOOD, bold: true }),
     td("Mede proteção, não papel. Meta por shopping, com dono nomeado.")],
    [td("Adesão nominal — %"), td("Processo", { color: MUTED }),
     td("Continua útil para gestão da esteira de cobrança.")],
    [td("Apólices vencidas ou canceladas em 30 dias"), td("Processo", { color: MUTED }),
     td("Hoje em 3%, sem rotina de detecção.")],
    [td("Prazo médio de regularização"), td("Processo", { color: MUTED }),
     td("Da notificação à apólice válida. Mede eficiência real do fluxo.")],
    [td("LMI mediano por categoria contra o mínimo"), td("Qualidade", { color: NAVY }),
     td("Mede a qualidade da cobertura, não a quantidade de documentos.")],
    [td("Prêmio médio por m² por categoria"), td("Econômico", { color: NAVY }),
     td("Única forma de provar o ganho de escala prometido ao lojista.")],
    [td("Sinistros com transbordo ao shopping — nº e R$", { bold: true, color: TEAL }),
     td("Resultado", { color: GOOD, bold: true }),
     td("O desfecho que de fato importa para o empreendedor.")],
    [td("Custo do programa contra economia comprovada", { bold: true, color: TEAL }),
     td("Resultado", { color: GOOD, bold: true }),
     td("O business case, medido continuamente e não só na aprovação.")],
  ], { y: y0, colW: [4.6, 1.7, 5.7], rowH: 0.42, fontSize: 10.5 });

  s.addText("Governança: dono do KPI por shopping (gerente geral), meta trimestral, escalada regional e revisão em comitê. Hoje o programa não tem nenhum dos quatro.",
    { x: ML, y: y0 + 4.05, w: CW * 0.9, h: 0.56, fontFace: SANS, fontSize: 12,
      bold: true, color: TEAL, margin: 0, lineSpacing: 16 });
  s.addNotes("A diferença entre os dois primeiros indicadores é a diferença entre o programa funcionar e o programa parecer que funciona.");
}

/* ===================== 21 · pedido ===================== */
{
  const s = slide({ dark: true, noFooter: true });
  s.addText("13 · PEDIDO AO COMITÊ", { x: ML, y: 0.75, w: CW, h: 0.28,
    fontFace: MONO, fontSize: 10, color: AMBER_L, charSpacing: 2.4, margin: 0 });
  s.addText("Aprovar a Fase 0, não o modelo", { x: ML, y: 1.1, w: CW, h: 0.75,
    fontFace: SERIF, fontSize: 40, bold: true, color: WHITE, margin: 0 });
  s.addText("Escolher entre híbrido, centralizado ou camada por escopo hoje seria escolher sem baseline, sem preço e sem parecer. O pedido é outro, e é menor.",
    { x: ML, y: 1.95, w: CW * 0.72, h: 0.6, fontFace: SANS, fontSize: 14.5,
      color: "C3D2D3", margin: 0, lineSpacing: 21 });

  const asks = [
    ["Aprovar o levantamento de 45 dias", "Com orçamento de pareceres jurídicos externos e auditoria amostral de 200 apólices."],
    ["Tomar as seis decisões de liderança", "Em especial D1, sobre remuneração da corretora, que condiciona todo o desenho."],
    ["Adotar a Cobertura Qualificada como métrica oficial", "E nomear dono do KPI por shopping, com meta trimestral."],
    ["Autorizar o RFP simultâneo com 4–6 seguradoras", "Com gates de 30 dias, em substituição à negociação exclusiva."],
    ["Fixar o gate de go/no-go em D+60", "Quando a recomendação de modelo volta ao comitê, com matriz ponderada, business case e as sete hipóteses respondidas."],
  ];
  let y = 2.85;
  asks.forEach(([t, d], i) => {
    s.addShape(p.ShapeType.rect, { x: ML, y, w: 0.44, h: 0.44,
      fill: { color: AMBER }, line: { color: AMBER } });
    s.addText(String(i + 1), { x: ML, y: y + 0.09, w: 0.44, h: 0.28, align: "center",
      fontFace: MONO, fontSize: 12, bold: true, color: TEAL_D, margin: 0 });
    s.addText(t, { x: ML + 0.68, y: y + 0.01, w: CW - 0.9, h: 0.3,
      fontFace: SERIF, fontSize: 16.5, bold: true, color: WHITE, margin: 0 });
    s.addText(d, { x: ML + 0.68, y: y + 0.32, w: CW - 1.0, h: 0.3,
      fontFace: SANS, fontSize: 11.5, color: "9FB6B8", margin: 0 });
    y += 0.78;
  });
  s.addText("Diretoria de Portfólio  ·  23 de agosto de 2026  ·  documento de trabalho v1  ·  confidencial",
    { x: ML, y: 6.9, w: CW, h: 0.3, fontFace: MONO, fontSize: 9, color: MUTED,
      charSpacing: 1, margin: 0 });
  s.addNotes("O fechamento. Cinco pedidos, nenhum deles irreversível, todos executáveis em 45 dias.");
}

p.writeFile({ fileName: "/home/user/radarbazin1/docs/material/Pre-Comite-Seguro-Lojas.pptx" })
  .then(f => console.log("OK:", f));
