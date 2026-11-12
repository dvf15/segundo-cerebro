const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.title = "Book de Processos Operacionais v2.0";

const C = {
  t8: "00616F", t6: "098B80", t9: "0D454A", t5: "368C82", w: "FFFFFF",
  or: "EDA754", rd: "CD5151", gr: "6CC680", wg: "CCC5BC", ow: "E5DED4",
  tx: "1E2B2D", tx2: "5C6E70", bd: "D8D2C8", tint: "E6F0F1",
};
const F = "Calibri";
const W = 13.333, H = 7.5, M = 0.6;

function arcs(s, color, x, y, size, n = 3) {
  for (let i = 0; i < n; i++) {
    const d = size - i * 0.9;
    s.addShape(pres.shapes.ARC, {
      x: x + i * 0.45, y: y + i * 0.45, w: d, h: d,
      angleRange: [200 + i * 25, 20 + i * 25],
      line: { color, width: 1.25 }, fill: { type: "none" },
    });
  }
}
function title(s, t, sub) {
  s.addText(t, { x: M, y: 0.45, w: W - 2 * M, h: 0.8, fontFace: F, fontSize: 32, bold: true, color: C.t9, margin: 0, isTextBox: true });
  if (sub) s.addText(sub, { x: M, y: 1.22, w: W - 2 * M, h: 0.45, fontFace: F, fontSize: 16, color: C.tx2, margin: 0, isTextBox: true });
}
function foot(s, n) {
  s.addText(`Book de processos v2.0  ·  ${n}`, { x: M, y: H - 0.45, w: 6, h: 0.3, fontFace: F, fontSize: 10, color: C.tx2, margin: 0, isTextBox: true });
}
function txt(s, t, o) { s.addText(t, Object.assign({ fontFace: F, color: C.tx, margin: 0, isTextBox: true, valign: "top" }, o)); }
function box(s, x, y, w, h, fill) { s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: { color: fill } }); }
function pill(s, x, y, w, h, fill, t, col = C.w, fs = 12) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: h / 2, fill: { color: fill }, line: { color: fill } });
  txt(s, t, { x, y, w, h, fontSize: fs, bold: true, color: col, align: "center", valign: "middle" });
}
let n = 0;

// 1 CAPA
{
  const s = pres.addSlide(); s.background = { color: C.t8 };
  arcs(s, C.t5, 7.6, -1.2, 7.5, 4);
  txt(s, "Book de processos operacionais", { x: M, y: 2.1, w: 8, h: 0.5, fontSize: 20, color: C.ow });
  txt(s, "Versão 2.0: o que o PES nos ensinou e como executamos igual nos 10 shoppings", { x: M, y: 2.7, w: 7.6, h: 2.0, fontSize: 38, bold: true, color: C.w });
  txt(s, "Diretoria de Portfólio  ·  setembro de 2026  ·  proposta para o kickoff", { x: M, y: 6.3, w: 8, h: 0.4, fontSize: 14, color: C.ow });
  s.addNotes("Deck de apresentação da revisão do Book (v1.1 → v2.0) com base no PES 2020 e nos objetivos atualizados do projeto. Tudo que é proposta está sinalizado como tal.");
}

// 2 OBJETIVO + NÚMEROS
{
  const s = pres.addSlide(); n++;
  title(s, "O objetivo não mudou; a forma de chegar lá, sim", "Processos conhecidos e executados de forma rápida, eficiente e uniforme — na direção do objetivo de cada shopping");
  const stats = [["19", "macroprocessos em 4 pilares (mantidos)"], ["58", "itens novos ou ajustados, trazidos do PES 2020"], ["10", "shoppings entrando juntos, em 3 ondas por capítulo"], ["90", "dias para execução verificável"]];
  stats.forEach((st, i) => {
    const x = M + i * 3.07;
    box(s, x, 2.2, 2.85, 2.6, i === 1 ? C.t8 : C.tint);
    txt(s, st[0], { x: x + 0.3, y: 2.45, w: 2.3, h: 1.1, fontSize: 60, bold: true, color: i === 1 ? C.w : C.t8 });
    txt(s, st[1], { x: x + 0.3, y: 3.65, w: 2.3, h: 1.0, fontSize: 14, color: i === 1 ? C.w : C.tx });
  });
  txt(s, [
    { text: "O v1.1 dizia o que fazer. ", options: { bold: true, color: C.t9 } },
    { text: "A v2.0 acrescenta por que (linha de visão até o resultado), quem de fato faz (9 posições reais), como se prova (autoavaliação → auditoria → dispersão) e os itens operacionais que o PES cobrava e o book não tinha." },
  ], { x: M, y: 5.25, w: W - 2 * M, h: 1.2, fontSize: 16 });
  foot(s, n);
}

// 3 ARGUMENTO + HIERARQUIA
{
  const s = pres.addSlide(); n++;
  title(s, "Por que o book existe");
  box(s, M, 1.5, 6.3, 4.9, C.t8);
  arcs(s, C.t5, 3.8, 3.3, 3.6, 3);
  txt(s, "O shopping cria valor quando fluxo × conversão × ticket crescem com segurança, a um custo de ocupação que o lojista sustenta.", { x: M + 0.4, y: 1.85, w: 5.5, h: 2.2, fontSize: 22, bold: true, color: C.w });
  txt(s, "Executamos de forma verificável porque só assim conseguimos inferir o que funciona em cada ativo — em vez de depender da memória de quem está no cargo.", { x: M + 0.4, y: 4.2, w: 5.2, h: 1.8, fontSize: 15, color: C.ow });
  txt(s, "Regra de desempate: vence o pilar mais alto", { x: 7.4, y: 1.5, w: 5.3, h: 0.5, fontSize: 18, bold: true, color: C.t9 });
  const p = [["Segurança", "protege pessoas e a licença de operar", C.t9], ["Hospitalidade", "acolhe e converte fluxo em recorrência", C.t8], ["Atratividade", "traz público e mantém o mix vivo", C.t6], ["Eficiência", "sustenta e rentabiliza o NOI", C.t5]];
  p.forEach((q, i) => {
    const y = 2.2 + i * 1.0;
    pill(s, 7.4, y, 0.7, 0.7, q[2], String(i + 1), C.w, 18);
    txt(s, q[0], { x: 8.3, y: y, w: 4.4, h: 0.35, fontSize: 16, bold: true, color: C.tx });
    txt(s, q[1], { x: 8.3, y: y + 0.36, w: 4.4, h: 0.35, fontSize: 13, color: C.tx2 });
  });
  txt(s, "Evento não abre sem alvará. Economia de condomínio não corta ronda.", { x: 7.4, y: 6.2, w: 5.3, h: 0.4, fontSize: 13, italic: true, color: C.t8 });
  foot(s, n);
  s.addNotes("Teste no kickoff: 3 superintendentes explicam o argumento em 60 segundos, sem ler.");
}

// 4 LINHA DE VISÃO
{
  const s = pres.addSlide(); n++;
  title(s, "Cada capítulo move uma variável do resultado", "O score deixa de tratar os itens como iguais — o peso do pilar entra no cálculo");
  const hdr = { bold: true, color: C.w, fill: { color: C.t8 }, fontFace: F, fontSize: 14 };
  const r = (a, b, c) => [{ text: a, options: { bold: true, color: C.t9 } }, { text: b }, { text: c, options: { align: "center", bold: true, color: C.t8 } }];
  s.addTable([
    [{ text: "Variável", options: hdr }, { text: "Capítulos que a movem", options: hdr }, { text: "Peso (proposta)", options: Object.assign({}, hdr, { align: "center" }) }],
    r("Fluxo", "08 Comercial · 09 Marketing · 05 Estacionamento · 02 Operações · 03/04 segurança percebida", "1,2"),
    r("Conversão", "07 Lojistas · 16 Performance · 06 SAC · 09 Programa de Benefícios", "1,2"),
    r("Ticket", "08 mix · 18 Renovações · 09 PB · 16 Performance", "1,2"),
    r("Proteção do ativo", "03 Segurança · 04 SSMA · 11 Jurídico · 14 Fornecedores", "1,5"),
    r("Proteção do NOI", "10 · 15 · 17 · 19 · 13 · 01 · 20 · CAB", "1,0"),
  ], { x: M, y: 1.95, w: W - 2 * M, colW: [2.6, 7.4, 2.13], fontFace: F, fontSize: 14, color: C.tx, border: { type: "solid", pt: 0.75, color: C.bd }, rowH: 0.62, valign: "middle" });
  txt(s, "Pesos são proposta a calibrar com os superintendentes — a ordem vem da hierarquia de pilares; os números não têm benchmark externo.", { x: M, y: 6.0, w: W - 2 * M, h: 0.5, fontSize: 12, italic: true, color: C.tx2 });
  foot(s, n);
}

// 5 QUEM EXECUTA
{
  const s = pres.addSlide(); n++;
  title(s, "Quem executa: 9 posições reais, não 15 papéis genéricos", "O checklist do shopping contém só o que é do shopping");
  const cols = [
    ["Local", C.t8, "Superintendente · Ger. Negócios, Marketing e Operações · Coord. Negócios, Marketing, Operações, Mall/Segurança e Ambiência", "Cap. 00 · 01 · 02 · 03 · 04 · 05 · 06 · 07 · 08 · 09 · 16 · 18"],
    ["Compartilhado", C.t6, "Coord. Negócios com Tesouraria e Controladoria", "Cap. 10 Financeiro · 15 Garantias · PB com CRM corporativo"],
    ["Matricial", C.t5, "Jurídico · Controladoria/Auditoria · TI/BI · Suprimentos · Gente & Performance", "Cap. 11 · 13 · 17 · 19 · 20 — pontuados na área corporativa"],
  ];
  cols.forEach((c, i) => {
    const x = M + i * 4.1;
    pill(s, x, 2.0, 3.8, 0.55, c[1], c[0], C.w, 16);
    txt(s, c[2], { x: x, y: 2.8, w: 3.8, h: 1.6, fontSize: 15, color: C.tx });
    txt(s, c[3], { x: x, y: 4.5, w: 3.8, h: 1.0, fontSize: 13, color: C.tx2 });
  });
  box(s, M, 5.6, W - 2 * M, 0.9, C.tint);
  txt(s, "Coord. Negócios concentra 10, 15, 16, 17-local e 18 — é o papel mais carregado do book. AVCB passa a ter dono único: Coord. Mall. Validar com RH para ativos de porte P.", { x: M + 0.3, y: 5.7, w: W - 2 * M - 0.6, h: 0.7, fontSize: 14, color: C.t9, valign: "middle" });
  foot(s, n);
}

// 6 REGIMES
{
  const s = pres.addSlide(); n++;
  title(s, "Rígido onde protege, flexível onde cria");
  const L = [["Tight", C.t9, "Segurança, Eficiência e obrigações legais", "00 · 01 · 02 · 03 · 04 · 05 · 10 · 11 · 13 · 14 · 15 · 17 · 19 · 20", ["Meta = 100%", "Item legal pendente = alerta ao sponsor", "Exceção só documentada"]],
             ["Loose estruturado", C.t6, "Atratividade e Hospitalidade", "06 · 07 · 08 · 09 · 16 · 18", ["Meta em faixa (≥ 80%)", "Experimento declarado não pontua contra", "Todo experimento tem KPI e critério de parada"]]];
  L.forEach((l, i) => {
    const x = M + i * 6.2;
    box(s, x, 1.55, 5.9, 4.9, i === 0 ? C.t9 : C.tint);
    const c1 = i === 0 ? C.w : C.t9, c2 = i === 0 ? C.ow : C.tx2, c3 = i === 0 ? C.w : C.tx;
    txt(s, l[0], { x: x + 0.4, y: 1.85, w: 5.1, h: 0.6, fontSize: 28, bold: true, color: c1 });
    txt(s, l[2], { x: x + 0.4, y: 2.5, w: 5.1, h: 0.4, fontSize: 15, color: c2 });
    txt(s, "Capítulos " + l[3], { x: x + 0.4, y: 3.0, w: 5.1, h: 0.7, fontSize: 13, color: c2 });
    txt(s, l[4].map((b, k) => ({ text: b, options: { bullet: true, breakLine: k < 2 } })), { x: x + 0.4, y: 3.9, w: 5.1, h: 2.2, fontSize: 17, color: c3, paraSpaceAfter: 8 });
  });
  foot(s, n);
  s.addNotes("Gelfand (tight/loose) e O'Reilly (ambidestria): o explore — agentes do Shopping Inteligente — fica separado do exploit — o book — e integrado pelo topo.");
}

// 7 LIÇÕES PES
{
  const s = pres.addSlide(); n++;
  title(s, "O que herdamos do PES — e o que deixamos para trás", "O PES funcionou como verificação e falhou como aprendizado em parte dos ativos");
  const cols = [
    ["Mantém", C.t8, ["Autoavaliação + auditoria que só valida o declarado", "Dispersão como medida de confiabilidade", "Monitor (ponto focal) em cada ativo", "N/A formal e canal único de dúvidas"]],
    ["Adapta", C.or, ["Meios e fins em eixos separados, não somados", "Atraso vira pendência + alerta, não −100 pts/dia", "Dispersão alta = reauditoria, não eliminação", "Medalhas viram Selo + Premiallos"]],
    ["Abandona", C.rd, ["Ranking entre shoppings", "Prêmio monetário por cargo", "Critérios de desempate", "Pontuação como fim em si"]],
  ];
  cols.forEach((c, i) => {
    const x = M + i * 4.1;
    pill(s, x, 2.0, 1.9, 0.5, c[1], c[0], C.w, 15);
    txt(s, c[2].map((b, k) => ({ text: b, options: { bullet: true, breakLine: k < c[2].length - 1 } })), { x: x, y: 2.75, w: 3.8, h: 3.4, fontSize: 15, paraSpaceAfter: 10 });
  });
  foot(s, n);
}

// 8 CAB V2 CICLO
{
  const s = pres.addSlide(); n++;
  title(s, "O ciclo mensal (CAB v2)", "Mesmo ciclo nos 10 shoppings; o que muda é a leitura e a prova");
  const st = [["Preencher", "dono real marca Feito / Pendente / N/A com evidência padrão", "até 5º d.u."], ["Consolidar", "score ponderado por pilar, só itens do mês e do dono", "automático"], ["Ler meios × fins", "score do book ao lado do Farol de Metas", "painel"], ["Devolver", "PDCA 1:1: Pareto, porquês, até 5 ações", "30 min"], ["Auditar", "amostra + 3 itens no piso; aviso ≤ 2 dias", "trimestral"], ["Recalibrar", "pesos, itens e limiares com os supers", "trimestral"]];
  st.forEach((q, i) => {
    const x = M + i * 2.05;
    pill(s, x + 0.55, 2.1, 0.8, 0.8, i === 2 || i === 4 ? C.or : C.t8, String(i + 1), C.w, 20);
    if (i < 5) s.addShape(pres.shapes.LINE, { x: x + 1.45, y: 2.5, w: 1.25, h: 0, line: { color: C.bd, width: 1.5 } });
    txt(s, q[0], { x: x, y: 3.1, w: 1.9, h: 0.45, fontSize: 16, bold: true, color: C.t9, align: "center" });
    txt(s, q[1], { x: x, y: 3.6, w: 1.9, h: 1.5, fontSize: 13, color: C.tx, align: "center" });
    txt(s, q[2], { x: x, y: 5.15, w: 1.9, h: 0.35, fontSize: 12, bold: true, color: C.t6, align: "center" });
  });
  box(s, M, 5.8, W - 2 * M, 0.75, C.tint);
  txt(s, "Novo no ciclo: Monitor do Book em cada ativo · pedido formal de N/A · FAQ oficial (dúvidas até o dia 7) · janela de 1 semana para contestar auditoria", { x: M + 0.3, y: 5.85, w: W - 2 * M - 0.6, h: 0.65, fontSize: 14, color: C.t9, valign: "middle" });
  foot(s, n);
}

// 9 QUADRANTE
{
  const s = pres.addSlide(); n++;
  title(s, "Meios × fins: o diagnóstico que o PES escondia", "Somar execução e resultado produz uma média; separar produz uma decisão");
  const x0 = 2.4, y0 = 1.9, cw = 4.9, ch = 2.2;
  txt(s, "Farol positivo", { x: x0, y: y0 - 0.05, w: cw, h: 0.35, fontSize: 14, bold: true, color: C.tx2, align: "center" });
  txt(s, "Farol negativo", { x: x0 + cw + 0.2, y: y0 - 0.05, w: cw, h: 0.35, fontSize: 14, bold: true, color: C.tx2, align: "center" });
  txt(s, "Book ≥ 80%", { x: M, y: y0 + 0.4 + 0.8, w: 1.7, h: 0.5, fontSize: 14, bold: true, color: C.tx2 });
  txt(s, "Book < 60%", { x: M, y: y0 + 0.4 + ch + 0.2 + 0.8, w: 1.7, h: 0.5, fontSize: 14, bold: true, color: C.tx2 });
  const q = [["Executa e entrega", "Documentar e replicar", C.t8, C.w], ["Executa e não entrega", "Hipótese do capítulo errada para este ativo: recalibrar", C.or, C.tx], ["Entrega sem executar", "Checar sustentabilidade e dispersão", C.tint, C.t9], ["Não executa, não entrega", "Prioridade: devolutiva presencial", C.rd, C.w]];
  q.forEach((c, i) => {
    const x = x0 + (i % 2) * (cw + 0.2), y = y0 + 0.4 + Math.floor(i / 2) * (ch + 0.2);
    box(s, x, y, cw, ch, c[2]);
    txt(s, c[0], { x: x + 0.35, y: y + 0.35, w: cw - 0.7, h: 0.55, fontSize: 20, bold: true, color: c[3] });
    txt(s, c[1], { x: x + 0.35, y: y + 1.0, w: cw - 0.7, h: 1.0, fontSize: 15, color: c[3] });
  });
  foot(s, n);
}

// 10 DISPERSÃO
{
  const s = pres.addSlide(); n++;
  title(s, "Dispersão: a medida de confiança no dado");
  box(s, M, 1.55, 5.2, 4.9, C.t9);
  txt(s, "Dispersão =", { x: M + 0.4, y: 1.9, w: 4.4, h: 0.5, fontSize: 18, color: C.ow });
  txt(s, "1 − auditado ÷ declarado", { x: M + 0.4, y: 2.4, w: 4.5, h: 0.8, fontSize: 28, bold: true, color: C.w });
  txt(s, "Herdada do PES 2020. A auditoria só valida o que o shopping declarou como feito — nunca há pontuação auditada maior que a declarada.", { x: M + 0.4, y: 3.5, w: 4.4, h: 2.5, fontSize: 15, color: C.ow });
  const hdr = { bold: true, color: C.w, fill: { color: C.t8 }, fontFace: F, fontSize: 14 };
  s.addTable([
    [{ text: "Dispersão", options: hdr }, { text: "Consequência na v2 (proposta)", options: hdr }, { text: "PES 2020", options: hdr }],
    [{ text: "< 5%", options: { bold: true } }, "Nenhuma — dado confiável", "0 pts"],
    [{ text: "5% a 10%", options: { bold: true } }, "Devolutiva específica + amostra maior", "−200 pts"],
    [{ text: "10% a 15%", options: { bold: true } }, "Selo suspenso + reauditoria completa no mês seguinte", "−300 pts / eliminatório"],
    [{ text: "≥ 15%", options: { bold: true } }, "Escala ao sponsor; em 2+ ativos, reabrir o checklist", "−400 a desclassificação"],
  ], { x: 6.2, y: 1.55, w: 6.53, colW: [1.35, 3.35, 1.83], fontFace: F, fontSize: 13, color: C.tx, border: { type: "solid", pt: 0.75, color: C.bd }, rowH: 0.85, valign: "middle" });
  txt(s, "Selo Ouro exige dispersão < 5% na última auditoria.", { x: 6.2, y: 6.05, w: 6.5, h: 0.4, fontSize: 13, italic: true, color: C.t8 });
  foot(s, n);
}

// 11 ITENS POR CAPÍTULO (chart)
{
  const s = pres.addSlide(); n++;
  title(s, "O que entra no book: 58 itens do PES", "Concentrados nos capítulos que o v1.1 tratava de forma genérica");
  const labels = ["05 Estacionamento", "02 Operações", "09 Marketing", "03 Segurança", "06 SAC", "08 Comercial", "04 SSMA", "07 Lojistas", "17 Auditoria", "10 Financeiro", "20 Gente", "Outros (01·14·16·18·19)"];
  const vals = [9, 6, 6, 5, 5, 5, 4, 4, 4, 3, 2, 5];
  s.addChart(pres.charts.BAR, [{ name: "Itens", labels, values: vals }], {
    x: M, y: 1.8, w: 7.2, h: 5.0, barDir: "bar", chartColors: [C.t8], catAxisOrientation: "maxMin",
    showValue: true, dataLabelPosition: "outEnd", dataLabelColor: C.t9, dataLabelFontSize: 12, dataLabelFontBold: true,
    catAxisLabelColor: C.tx, catAxisLabelFontSize: 12, catAxisLabelFontFace: F, valAxisHidden: true,
    valGridLine: { style: "none" }, catGridLine: { style: "none" }, showLegend: false, barGapWidthPct: 45,
  });
  const hl = [["Estacionamento", "benchmark 2x/ano, alçadas de desconto, POP, 5 treinamentos, sinistros"], ["Segurança", "carro-forte, ATMs, operações sensíveis a < 50 m da portaria"], ["SAC e experiência", "SLA 24 h / 7 d.u. / 60 d.u., serviços mínimos, checklist 2x/semana"], ["Auditoria", "carta de aviso, devolutiva ao lojista, termo de quitação"]];
  hl.forEach((h, i) => {
    const y = 1.9 + i * 1.2;
    txt(s, h[0], { x: 8.2, y, w: 4.5, h: 0.38, fontSize: 15, bold: true, color: C.t8 });
    txt(s, h[1], { x: 8.2, y: y + 0.4, w: 4.5, h: 0.7, fontSize: 13, color: C.tx });
  });
  foot(s, n);
}

// 12 CHECKLIST CRESCE
{
  const s = pres.addSlide(); n++;
  title(s, "O risco: o checklist cresce 48%", "122 → cerca de 180 itens. O que impede que isso vire burocracia");
  txt(s, "122", { x: M, y: 2.2, w: 2.4, h: 1.2, fontSize: 60, bold: true, color: C.wg });
  txt(s, "v1.1", { x: M, y: 3.4, w: 2.4, h: 0.4, fontSize: 14, color: C.tx2 });
  s.addShape(pres.shapes.LINE, { x: 2.7, y: 2.85, w: 0.9, h: 0, line: { color: C.t8, width: 2, endArrowType: "triangle" } });
  txt(s, "~180", { x: 3.8, y: 2.2, w: 2.8, h: 1.2, fontSize: 60, bold: true, color: C.t8 });
  txt(s, "v2.0", { x: 3.8, y: 3.4, w: 2.4, h: 0.4, fontSize: 14, color: C.tx2 });
  txt(s, "Métrica de corte: se evidenciar um item levar mais de 5 minutos no dojo, o item sai ou é simplificado.", { x: M, y: 4.4, w: 5.8, h: 1.2, fontSize: 16, bold: true, color: C.rd });
  const m = [["Só o que é do mês e do dono", "boa parte dos itens novos é semestral, anual ou por evento"], ["Itens de estado 1–2x/ano", "política armada, ATMs, raio de 50 m, serviços mínimos"], ["Pareto tira o crônico", "pendente em 6+ ativos por 3 meses vira projeto corporativo"], ["Itens nas ondas", "Onda 1: 02·03·04·05 · Onda 2: 06·07·08·09·16·17 · Onda 3: 10·18·19·20"]];
  m.forEach((q, i) => {
    const y = 1.9 + i * 1.15;
    pill(s, 7.0, y + 0.05, 0.55, 0.55, C.t6, String(i + 1), C.w, 14);
    txt(s, q[0], { x: 7.8, y, w: 4.9, h: 0.38, fontSize: 15, bold: true, color: C.t9 });
    txt(s, q[1], { x: 7.8, y: y + 0.4, w: 4.9, h: 0.65, fontSize: 13, color: C.tx });
  });
  foot(s, n);
}

// 13 SEMANA DE COMITÊS
{
  const s = pres.addSlide(); n++;
  title(s, "Um calendário só: a Semana de Comitês", "Absorve os ritos do book, do PES, do Handbook de Operações e do Governance & KPI Monitor");
  s.addShape(pres.shapes.LINE, { x: M, y: 3.0, w: W - 2 * M, h: 0, line: { color: C.t8, width: 2 } });
  const ev = [["Até 5º d.u.", "Checklist CAB · repasse"], ["Até 6º d.u.", "100% vendas informadas"], ["Dia 7", "Prazo de dúvidas"], ["S2 · D12–14", "Performance → Auditoria → Comercial e vacância"], ["S3 · D16–18", "Jurídico → Inadimplência → Cluster experience"], ["Dia 20", "Utilidades · comitê gestor fecha o plano"], ["Fim do mês", "FAQ oficial · devolutiva CAB"]];
  const step = (W - 2 * M) / ev.length;
  ev.forEach((e, i) => {
    const x = M + i * step;
    s.addShape(pres.shapes.OVAL, { x: x + step / 2 - 0.13, y: 2.87, w: 0.26, h: 0.26, fill: { color: i === 3 || i === 4 ? C.or : C.t8 }, line: { color: C.w, width: 1.5 } });
    txt(s, e[0], { x: x + 0.05, y: 2.2, w: step - 0.1, h: 0.5, fontSize: 13, bold: true, color: C.t9, align: "center", valign: "bottom" });
    txt(s, e[1], { x: x + 0.05, y: 3.3, w: step - 0.1, h: 1.3, fontSize: 12, color: C.tx, align: "center" });
  });
  const g = [["Toda semana", "Superintendência · Deal Conversion · operadora de estacionamento · desvios de limpeza"], ["Trimestral", "Auditoria amostral e dispersão · recalibração · reunião com operadora · treinamento de postura"], ["Semestral", "Benchmark de estacionamento (mar/set) · gestão de crise · mapa de operações sensíveis"]];
  g.forEach((q, i) => {
    const x = M + i * 4.1;
    box(s, x, 4.9, 3.85, 1.6, C.tint);
    txt(s, q[0], { x: x + 0.25, y: 5.02, w: 3.4, h: 0.4, fontSize: 15, bold: true, color: C.t8 });
    txt(s, q[1], { x: x + 0.25, y: 5.45, w: 3.4, h: 1.0, fontSize: 12, color: C.tx });
  });
  foot(s, n);
}

// 14 FERRAMENTAS
{
  const s = pres.addSlide(); n++;
  title(s, "Ferramentas: primeiro o que já temos", "Uniformidade vem da ferramenta, não do treinamento. Nenhuma contratação antes da semana 6");
  const t = [
    ["Verificar", "Painel CAB v2", "SharePoint + Power Apps + Power Automate + Power BI. Campo: estender operacoes.allos.co; se faltar, avaliar Checklist Fácil"],
    ["Conhecer", "Microvídeos e quiz", "Roteiros prontos editados no Descript; Teams/Stream; quiz no Forms; QR code no cartão de bolso"],
    ["Executar", "Ritos e atas", "Convites padronizados no Outlook; ata única; transcrição para rascunho (não gravar o Comitê Jurídico); DocuSign"],
    ["Corrigir e inferir", "Copiloto do Book", "Rascunha a devolutiva meios × fins, aponta evidência suspeita antes da auditoria e monta o Pareto; skills de Performance, Renovações e Governança"],
  ];
  t.forEach((q, i) => {
    const x = M + (i % 2) * 6.15, y = 1.95 + Math.floor(i / 2) * 2.3;
    box(s, x, y, 5.95, 2.1, i === 3 ? C.t8 : C.tint);
    const c1 = i === 3 ? C.ow : C.t6, c2 = i === 3 ? C.w : C.t9, c3 = i === 3 ? C.w : C.tx;
    txt(s, q[0].toUpperCase(), { x: x + 0.3, y: y + 0.2, w: 5.3, h: 0.3, fontSize: 11, bold: true, color: c1, charSpacing: 2 });
    txt(s, q[1], { x: x + 0.3, y: y + 0.5, w: 5.3, h: 0.45, fontSize: 19, bold: true, color: c2 });
    txt(s, q[2], { x: x + 0.3, y: y + 1.0, w: 5.35, h: 1.05, fontSize: 13, color: c3 });
  });
  foot(s, n);
  s.addNotes("Não verificado: licenças da Allos (Power Apps, Power BI, Planner) e o escopo atual do operacoes.allos.co. Checklist Fácil: descrição a partir de fontes públicas, não testado.");
}

// 15 SEQUÊNCIA
{
  const s = pres.addSlide(); n++;
  title(s, "Sequência de ferramentas nas 6 primeiras semanas");
  const st = [["Sem. 0–2", "Painel v1 em SharePoint + Power Apps com os itens da Onda 1", "sem contratação"], ["Sem. 2–4", "Mapear o que o operacoes.allos.co já cobre; importar a rubrica do Handbook em vez de declarar duas vezes", "um shopping, um score"], ["Sem. 4–6", "Copiloto do Book rodando sobre o export do M1", "devolutiva + dispersão preditiva"], ["Sem. 6", "Decisão de arquitetura com TI: M365 × app próprio × ferramenta de campo", "com dados de M1–M2"]];
  st.forEach((q, i) => {
    const x = M + i * 3.07;
    box(s, x, 1.8, 2.85, 4.6, i === 3 ? C.t9 : C.tint);
    const c1 = i === 3 ? C.w : C.t8, c2 = i === 3 ? C.w : C.tx, c3 = i === 3 ? C.or : C.t6;
    txt(s, q[0], { x: x + 0.3, y: 2.1, w: 2.3, h: 0.6, fontSize: 24, bold: true, color: c1 });
    txt(s, q[1], { x: x + 0.3, y: 2.9, w: 2.3, h: 2.4, fontSize: 15, color: c2 });
    txt(s, q[2], { x: x + 0.3, y: 5.55, w: 2.3, h: 0.6, fontSize: 13, bold: true, color: c3 });
  });
  foot(s, n);
}

// 16 DECISÕES
{
  const s = pres.addSlide(); n++;
  title(s, "Decisões para o kickoff");
  const d = [
    ["Adotar meios × fins com o Farol de Metas", "alinhar com Planejamento/Controladoria, donos do Farol"],
    ["Confirmar donos reais com RH e diretores", "e quem responde pelos itens matriciais"],
    ["Validar políticas de 2020 ainda vigentes", "CRD, contratos de quiosque, alçadas de desconto, proteção armada"],
    ["Aceitar o regime loose para Atratividade", "é escolha de cultura, não de planilha"],
    ["Definir pesos, limiares de dispersão e de corte", "hoje 1,5 / 1,2 / 1,2 / 1,0 — proposta"],
    ["Autorizar a importação da rubrica do Handbook", "acordo com Operações corporativo"],
  ];
  d.forEach((q, i) => {
    const x = M + (i % 2) * 6.15, y = 1.6 + Math.floor(i / 2) * 1.6;
    pill(s, x, y + 0.05, 0.6, 0.6, i === 2 ? C.or : C.t8, String(i + 1), C.w, 16);
    txt(s, q[0], { x: x + 0.85, y, w: 5.1, h: 0.75, fontSize: 17, bold: true, color: C.t9 });
    txt(s, q[1], { x: x + 0.85, y: y + 0.75, w: 5.1, h: 0.5, fontSize: 13, color: C.tx2 });
  });
  foot(s, n);
}

// 17 FECHAMENTO
{
  const s = pres.addSlide(); s.background = { color: C.t9 };
  arcs(s, C.t6, -1.5, 3.2, 6.5, 4);
  txt(s, "A evidência existe para inferir, não só para cobrar.", { x: 4.2, y: 2.3, w: 8.4, h: 1.8, fontSize: 36, bold: true, color: C.w });
  txt(s, "Próximo passo: validar as 6 decisões e fechar o book v2.0 para a Onda 1.", { x: 4.2, y: 4.3, w: 8.4, h: 0.8, fontSize: 18, color: C.ow });
}

pres.writeFile({ fileName: "/home/claude/deck/Book-v2-apresentacao.pptx" }).then(f => console.log("ok", f));
