const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/mnt/skills/public/pptx/scripts/apply_theme.js');

const THEME = {
  name: 'Allos2036',
  headFontFace: 'Cambria',
  bodyFontFace: 'Calibri',
  colors: {
    dk1: '1C1C1C', lt1: 'FFFFFF', dk2: '173F35', lt2: 'EEF1EC',
    accent1: '173F35', accent2: 'C46A3A', accent3: '6B8F7E', accent4: '2E6B5A',
    accent5: 'D9D2C5', accent6: '8A949E', hlink: '2E6B5A', folHlink: '6B8F7E',
  },
};

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9'; // 10 x 5.625
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.author = 'Claude';
pres.title = 'Allos 2036 - Plano de ação';
const C = pres.SchemeColor;
const FOOT = 'Allos 2036 · Plano de ação · out/2026';

// ---------- Layouts ----------
pres.defineSlideMaster({
  title: 'TITLE_DARK',
  background: { color: THEME.colors.dk2 },
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 1.5, w: 8.8, h: 1.5, fontSize: 38, bold: true, color: C.background1, valign: 'bottom', margin: 0 }, text: '' } },
    { placeholder: { options: { name: 'body', type: 'body', x: 0.6, y: 3.15, w: 8.8, h: 1.2, fontSize: 18, color: C.background2, valign: 'top', margin: 0 }, text: '' } },
    { text: { text: FOOT, options: { x: 0.6, y: 5.05, w: 6, h: 0.3, fontSize: 10, color: C.accent3, margin: 0 } } },
  ],
});

pres.defineSlideMaster({
  title: 'CONTENT',
  background: { color: THEME.colors.lt1 },
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 0.5, y: 0.3, w: 9.0, h: 0.7, fontSize: 26, bold: true, color: C.text2, valign: 'middle', margin: 0 }, text: '' } },
    { text: { text: FOOT, options: { x: 0.5, y: 5.25, w: 6, h: 0.25, fontSize: 9, color: C.accent6, margin: 0 } } },
  ],
  slideNumber: { x: 9.0, y: 5.25, w: 0.5, h: 0.25, fontSize: 9, color: THEME.colors.accent6, align: 'right' },
});

pres.defineSlideMaster({
  title: 'ACTION',
  background: { color: THEME.colors.lt1 },
  objects: [
    { rect: { x: 0, y: 0, w: 3.3, h: 5.625, fill: { color: C.text2 } } },
    { placeholder: { options: { name: 'title', type: 'title', x: 3.7, y: 0.35, w: 5.8, h: 1.0, fontSize: 21, bold: true, color: C.text2, valign: 'top', margin: 0 }, text: '' } },
    { text: { text: FOOT, options: { x: 3.7, y: 5.25, w: 5, h: 0.25, fontSize: 9, color: C.accent6, margin: 0 } } },
  ],
  slideNumber: { x: 9.0, y: 5.25, w: 0.5, h: 0.25, fontSize: 9, color: THEME.colors.accent6, align: 'right' },
});

// ---------- Helpers ----------
function numberBadge(slide, n, x, y, d, name) {
  slide.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: C.accent2 }, line: { color: C.accent2, width: 0 }, objectName: name + ' badge' });
  slide.addText(String(n), { x, y, w: d, h: d, fontSize: d * 36, bold: true, color: C.background1, align: 'center', valign: 'middle', margin: 0, isTextBox: true, objectName: name + ' number' });
}

function card(slide, x, y, w, h, name) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: C.background2 }, line: { color: C.background2, width: 0 }, objectName: name });
}

// ---------- Data ----------
const actions = [
  {
    n: 1, title: 'Definir o envelope de capital da transição e a supervisão de IA no conselho',
    alvo: 'Fraqueza: payout ~R$ 1,7 bi/ano vs capex R$ 350–450 mi', poder: 'Habilitador de todas as demais', horizonte: '0–6 meses',
    desc: 'Envelope plurianual de capex para dados, tecnologia e reconversão (hipótese: 10–15% do EBITDA por 5 anos), comitê de IA & Dados no conselho e métricas de IA no relatório trimestral.',
    passos: ['Proposta formal ao conselho: envelope, comitê e KPIs', 'Revisão da política de dividendos sem romper o guidance 2026', 'Um conselheiro independente especialista em IA'],
    kpi: 'Capex de transição / EBITDA; métricas de IA reportadas ao mercado',
  },
  {
    n: 2, title: 'Concentrar o portfólio: eleger ~20 ativos "destino" e sair da cauda em 24–36 meses',
    alvo: 'Fraqueza: cauda exposta a "agente + entrega"', poder: 'Recurso encurralado + escala', horizonte: '6–36 meses',
    desc: 'Pontuar os 46 ativos por dominância, exposição do mix e opcionalidade de terreno; concentrar capex nos ~20 melhores e vender ou aportar os demais no Kinea ALLOS Malls FII e em permutas.',
    passos: ['Scoring dos 46 ativos aprovado pelo comitê de investimentos', 'Lista de saída e cronograma 2027–2028', 'Capex 2027 realocado para os top-20'],
    kpi: '% do NOI nos top-20; cap rate de saída vs custo de capital',
  },
  {
    n: 3, title: 'Construir o "Allos Agent Gateway": oferta, benefício, estoque e evento legíveis por agentes de IA',
    alvo: 'Ameaça → oportunidade: comércio agêntico', poder: 'Economias de rede + custos de troca', horizonte: 'MVP em 12 meses; total em 24',
    desc: 'API em padrão aberto (estilo MCP) com catálogo de lojas, benefícios, eventos, estacionamento e reservas, integrada aos assistentes de consumo que decidirão "onde ir".',
    passos: ['MVP com catálogo e benefícios de 5 shoppings', 'Piloto com um assistente de massa (WhatsApp, Google ou Apple)', 'Padrão de dados para lojistas publicarem estoque'],
    kpi: '% de visitas e resgates originados por agentes; cobertura do catálogo',
  },
  {
    n: 4, title: 'Escalar o ciclo fechado de retail media (VendaCerta) para todo o portfólio e para marcas nacionais',
    alvo: 'Oportunidade: mídia já é 10,6% da receita', poder: 'Economias de rede + recurso encurralado (dado)', horizonte: '12–24 meses',
    desc: 'Levar o VendaCerta dos pilotos SP/RJ aos 37 shoppings com plataforma e criar o produto "venda incremental comprovada" para marcas de consumo, medido contra grupo de controle.',
    passos: ['Rollout em 15 shoppings', '3 marcas nacionais em piloto com medição de incrementalidade', 'Painel de ROAS auditável para anunciantes'],
    kpi: 'Receita de mídia por resultado; ROAS comprovado; % lojistas ativos',
  },
  {
    n: 5, title: 'Camada proprietária de dados e IA, com estratégia multi-fornecedor',
    alvo: 'Fraqueza: dependência de 2–3 provedores de IA', poder: 'Recurso encurralado + escala', horizonte: '12–24 meses',
    desc: 'Unificar CRM, GMV, fluxo, estacionamento e locação num modelo de dados único; treinar modelos próprios de propensão, mix e preço; portabilidade entre provedores; consentimento "agent-ready" (LGPD).',
    passos: ['Inventário e governança de dados', 'Contrato com ≥2 provedores de modelos, com portabilidade', 'Primeiro modelo próprio (propensão a visita) em produção'],
    kpi: '% das decisões de mix, preço e mídia com modelos próprios; custo de IA por shopping',
  },
  {
    n: 6, title: 'Reconverter estacionamento antes da queda: plano por ativo',
    alvo: 'Fraqueza: 18% da receita líquida', poder: 'Recurso encurralado (terreno) + contraposicionamento', horizonte: 'Projetos em 36 meses; obra 2029–34',
    desc: 'Mapear ocupação de vagas por ativo e horário; definir para cada dominante o uso que substitui o deck (saúde, educação, moradia, last-mile, lazer); aprovar projetos enquanto a receita atual financia a obra.',
    passos: ['Mapa de ocupação de vagas dos 46 ativos', '3 pilotos de reconversão de deck', 'Modelo financeiro de receita por m² de solo'],
    kpi: 'm² de estacionamento com projeto aprovado; receita/m² de solo vs receita perdida',
  },
  {
    n: 7, title: 'Operação agêntica: leasing, renovação, cobrança e atendimento',
    alvo: 'Oportunidade: SG&A de ~14% para um dígito', poder: 'Poder de processo + escala', horizonte: '12–36 meses',
    desc: 'Agentes em produção nos processos de maior volume — underwriting de renovação, previsão de inadimplência e PDD, atendimento e cobrança — com o processo redesenhado em torno deles, não só uma ferramenta acoplada.',
    passos: ['3 agentes em produção em 5 shoppings', 'Linha de base de ciclo e custo por processo', 'Redesenho do fluxo de renovação (LSR) com o agente'],
    kpi: 'SG&A / receita líquida; dias do ciclo de renovação; inadimplência líquida',
  },
  {
    n: 8, title: 'Contrato híbrido por desempenho: piloto em 5 shoppings',
    alvo: 'Oportunidade de contraposicionamento', poder: 'Contraposicionamento + custos de troca do lojista', horizonte: '12–24 meses',
    desc: 'Aluguel mínimo menor, parcela variável sobre venda medida pela plataforma e pacote de mídia e dados incluído: cobrar por resultado, não só por m², antes que os lojistas imponham o variável.',
    passos: ['Desenho jurídico e financeiro do contrato', 'Piloto com 30 lojistas e grupo de controle', 'Regras de compartilhamento de dados com o lojista'],
    kpi: 'SSR do piloto vs controle; churn; share de GMV capturado',
  },
  {
    n: 9, title: 'Rebalancear o mix para categorias não agentizáveis',
    alvo: 'Fraqueza: categorias comparáveis com SSS de 1–2%', poder: 'Marca por ativo + recurso encurralado', horizonte: '24–60 meses',
    desc: 'Meta por ativo de % de ABL em serviços, saúde, educação, gastronomia e lazer; replicar o modelo Taste (R$ 5 mi no 1º mês no Tijuca) em áreas de baixa produtividade; pipeline de operadores de saúde e educação.',
    passos: ['Diagnóstico de mix por ativo e exposição a categorias comparáveis', 'Metas 2028 por shopping', 'Pipeline de saúde e educação nos top-20'],
    kpi: '% de ABL não agentizável; SSS de serviços e lazer; fluxo',
  },
  {
    n: 10, title: 'Plataforma de gestão como produto para terceiros e FIIs',
    alvo: 'Oportunidade: monetizar o know-how antes que a IA o comoditize', poder: 'Escala + poder de processo', horizonte: '24–48 meses',
    desc: 'Empacotar a operação agêntica (7), a camada de dados (5) e a mídia (4) como serviço de gestão para shoppings de terceiros e fundos imobiliários, começando pelo Kinea ALLOS Malls FII.',
    passos: ['Proposta de valor e precificação do serviço', 'Oferta aos 6 shoppings já administrados', 'Modelo de SLA com métricas de IA'],
    kpi: 'ABL administrada de terceiros; receita e margem de serviços de gestão',
  },
];

// ---------- Slide 1: title ----------
pres.addSection({ title: 'Abertura' });
let s = pres.addSlide({ masterName: 'TITLE_DARK', sectionTitle: 'Abertura' });
s.addText('Allos 2036 — Plano de ação', { placeholder: 'title' });
s.addText('Dez movimentos priorizados para capturar oportunidades e cobrir fraquezas no cenário de IA. Anexo ao documento "Allos 2036 — Futurologia sob a lente da IA".', { placeholder: 'body' });
s.addNotes('Plano elaborado por Claude a pedido de Daniel. Base factual: Relatório de Resultados 2T26 da ALLOS. Metas e estimativas são hipóteses sinalizadas.');

// ---------- Slide 2: por que agora ----------
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Abertura' });
s.addText('Por que agir agora: quatro números do 2T26', { placeholder: 'title' });
const stats = [
  { v: '18%', l: 'da receita líquida vem de estacionamento — a linha mais exposta à autonomia veicular' },
  { v: '10,6%', l: 'da receita já é mídia (+84,5% a/a) — a vertical que mais cresce' },
  { v: 'R$ 1,56 bi', l: 'de GMV capturado no trimestre — o dado físico que vira ativo raro' },
  { v: '1,7x', l: 'dívida líquida/EBITDA — balanço para financiar a transição' },
];
stats.forEach((st, i) => {
  const x = 0.5 + i * 2.3;
  card(s, x, 1.3, 2.1, 2.6, 'stat card ' + (i + 1));
  s.addText(st.v, { x: x + 0.15, y: 1.45, w: 1.8, h: 0.9, fontSize: 30, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'stat value ' + (i + 1) });
  s.addText(st.l, { x: x + 0.15, y: 2.4, w: 1.8, h: 1.4, fontSize: 12, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'stat label ' + (i + 1) });
});
s.addText([
  { text: 'Tese: ', options: { bold: true, color: C.accent2 } },
  { text: 'a IA não ameaça a Allos como dona de imóveis dominantes; ameaça a Allos como cobradora de m². O plano troca a lógica de "aluguel por área" pela de "renda por jornada" antes que o agente do consumidor faça isso por ela.' },
], { x: 0.5, y: 4.15, w: 9.0, h: 0.95, fontSize: 14, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'thesis' });

// ---------- Slide 3: critérios ----------
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Abertura' });
s.addText('Como priorizei: quatro critérios', { placeholder: 'title' });
const crit = [
  { t: 'Janela que se fecha', d: 'Quanto antes precisa começar para ainda fazer diferença em 2036.' },
  { t: 'Alavancagem', d: 'Quantas outras ações dependem desta.' },
  { t: 'Impacto em FFO e valor', d: 'Tamanho da linha de receita ou custo que protege ou cria.' },
  { t: 'Reversibilidade', d: 'O que é barato testar e reverter vem antes do irreversível.' },
];
crit.forEach((c, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = 0.5 + col * 4.6, y = 1.3 + row * 1.75;
  card(s, x, y, 4.4, 1.5, 'criterio card ' + (i + 1));
  numberBadge(s, i + 1, x + 0.25, y + 0.4, 0.7, 'criterio ' + (i + 1));
  s.addText(c.t, { x: x + 1.15, y: y + 0.2, w: 3.1, h: 0.45, fontSize: 16, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'criterio title ' + (i + 1) });
  s.addText(c.d, { x: x + 1.15, y: y + 0.68, w: 3.1, h: 0.7, fontSize: 13, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'criterio desc ' + (i + 1) });
});
s.addText('A ordem é a ordem em que eu as iniciaria; os horizontes se sobrepõem.', { x: 0.5, y: 4.85, w: 9, h: 0.3, fontSize: 11, italic: true, color: C.accent6, margin: 0, isTextBox: true, objectName: 'criterio note' });

// ---------- Slide 4: overview table ----------
pres.addSection({ title: 'As 10 ações' });
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'As 10 ações' });
s.addText('As 10 ações, por prioridade', { placeholder: 'title' });
const shortTitles = [
  'Envelope de capital da transição e comitê de IA no conselho',
  'Concentrar o portfólio nos ~20 ativos "destino"; sair da cauda',
  'Allos Agent Gateway: legível para agentes de IA',
  'Escalar o ciclo fechado de retail media (VendaCerta)',
  'Camada proprietária de dados e IA, multi-fornecedor',
  'Reconverter estacionamento antes da queda',
  'Operação agêntica: leasing, renovação, cobrança, atendimento',
  'Contrato híbrido por desempenho (piloto)',
  'Rebalancear o mix para categorias não agentizáveis',
  'Plataforma de gestão como produto para terceiros e FIIs',
];
const hdr = { bold: true, color: THEME.colors.lt1, fill: { color: THEME.colors.dk2 }, fontSize: 11, valign: 'middle' };
const rows = [[
  { text: '#', options: { ...hdr, align: 'center' } },
  { text: 'Ação', options: { ...hdr } },
  { text: 'Alvo', options: { ...hdr } },
  { text: 'Poder de Helmer', options: { ...hdr } },
]];
actions.forEach((a, i) => {
  const fill = i % 2 === 0 ? THEME.colors.lt1 : THEME.colors.lt2;
  const opt = { fontSize: 11, color: THEME.colors.dk1, fill: { color: fill }, valign: 'middle' };
  rows.push([
    { text: String(a.n), options: { ...opt, bold: true, color: THEME.colors.accent2, align: 'center' } },
    { text: shortTitles[i], options: { ...opt } },
    { text: a.alvo, options: { ...opt } },
    { text: a.poder, options: { ...opt } },
  ]);
});
s.addTable(rows, { x: 0.5, y: 1.1, w: 9.0, colW: [0.4, 3.6, 2.9, 2.1], rowH: [0.34, 0.37, 0.37, 0.37, 0.37, 0.37, 0.37, 0.37, 0.37, 0.37, 0.37], border: { type: 'solid', pt: 0.5, color: THEME.colors.accent5 }, margin: 0.05, objectName: 'overview table' });

// ---------- Slides 5-14: one per action ----------
actions.forEach((a) => {
  const sl = pres.addSlide({ masterName: 'ACTION', sectionTitle: 'As 10 ações' });
  sl.addText(a.title, { placeholder: 'title' });
  // left panel
  sl.addText(String(a.n).padStart(2, '0'), { x: 0.35, y: 0.35, w: 2.6, h: 1.1, fontSize: 56, bold: true, color: C.accent2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'action number' });
  const labels = [['ALVO', a.alvo, 1.7], ['PODER DE HELMER', a.poder, 2.85], ['HORIZONTE', a.horizonte, 4.0]];
  labels.forEach(([lab, val, y], i) => {
    sl.addText(lab, { x: 0.35, y, w: 2.6, h: 0.25, fontSize: 9, bold: true, charSpacing: 2, color: C.accent3, margin: 0, isTextBox: true, objectName: 'label ' + (i + 1) });
    sl.addText(val, { x: 0.35, y: y + 0.27, w: 2.6, h: 0.8, fontSize: 13, bold: true, color: C.background1, margin: 0, isTextBox: true, valign: 'top', objectName: 'value ' + (i + 1) });
  });
  // right
  sl.addText(a.desc, { x: 3.7, y: 1.4, w: 5.8, h: 1.05, fontSize: 13, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'description' });
  sl.addText('PRIMEIRO PASSO (90 DIAS)', { x: 3.7, y: 2.55, w: 5.8, h: 0.25, fontSize: 10, bold: true, charSpacing: 2, color: C.accent2, margin: 0, isTextBox: true, objectName: 'steps label' });
  sl.addText(a.passos.map((p, i) => ({ text: p, options: { bullet: true, breakLine: i < a.passos.length - 1, paraSpaceAfter: 4 } })), { x: 3.7, y: 2.82, w: 5.8, h: 1.4, fontSize: 13, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'steps' });
  sl.addText('KPI', { x: 3.7, y: 4.3, w: 5.8, h: 0.25, fontSize: 10, bold: true, charSpacing: 2, color: C.accent2, margin: 0, isTextBox: true, objectName: 'kpi label' });
  sl.addText(a.kpi, { x: 3.7, y: 4.57, w: 5.8, h: 0.6, fontSize: 13, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: 'top', objectName: 'kpi' });
  sl.addNotes(`Ação ${a.n}: ${a.title}. Alvo: ${a.alvo}. Poder: ${a.poder}. Horizonte: ${a.horizonte}.`);
});

// ---------- Slide 15: roadmap ----------
pres.addSection({ title: 'Execução' });
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Execução' });
s.addText('Sequenciamento em três ondas', { placeholder: 'title' });
const waves = [
  { t: 'Onda 1 · Decidir e proteger', p: '0–12 meses', items: ['1 · Envelope de capital e comitê de IA', '2 · Concentrar o portfólio', '3 · Agent Gateway (MVP)', '4 · Escalar o VendaCerta'], g: 'Destravar capital e ocupar a interface com os agentes antes dos concorrentes.' },
  { t: 'Onda 2 · Construir a plataforma', p: '12–36 meses', items: ['5 · Camada de dados e IA', '6 · Projetos de reconversão', '7 · Operação agêntica', '8 · Contrato híbrido (piloto)', '9 · Rebalancear o mix'], g: 'Dado próprio, processos agênticos, novo contrato e novo mix.' },
  { t: 'Onda 3 · Escalar', p: '36+ meses', items: ['6 · Execução da reconversão', '10 · Plataforma de gestão para terceiros'], g: 'Reconversão física e venda da plataforma de gestão.' },
];
waves.forEach((w, i) => {
  const x = 0.5 + i * 3.05;
  card(s, x, 1.2, 2.9, 3.85, 'wave card ' + (i + 1));
  numberBadge(s, i + 1, x + 0.2, 1.4, 0.55, 'wave ' + (i + 1));
  s.addText(w.t, { x: x + 0.9, y: 1.38, w: 1.95, h: 0.6, fontSize: 13, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'wave title ' + (i + 1) });
  s.addText(w.p, { x: x + 0.2, y: 2.1, w: 2.5, h: 0.3, fontSize: 11, bold: true, color: C.accent2, margin: 0, isTextBox: true, objectName: 'wave period ' + (i + 1) });
  s.addText(w.items.map((it, j) => ({ text: it, options: { bullet: true, breakLine: j < w.items.length - 1, paraSpaceAfter: 3 } })), { x: x + 0.2, y: 2.45, w: 2.5, h: 1.7, fontSize: 12, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'wave items ' + (i + 1) });
  s.addText(w.g, { x: x + 0.2, y: 4.2, w: 2.5, h: 0.75, fontSize: 11, italic: true, color: C.accent4, margin: 0, isTextBox: true, valign: 'top', objectName: 'wave goal ' + (i + 1) });
});

// ---------- Slide 16: KPI table ----------
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Execução' });
s.addText('Painel de metas indicativas (hipóteses, não guidance)', { placeholder: 'title' });
const kh = { bold: true, color: THEME.colors.lt1, fill: { color: THEME.colors.dk2 }, fontSize: 12, valign: 'middle' };
const kpis = [
  ['SG&A / receita líquida', '~14%', '11%', '< 9%'],
  ['Estacionamento / receita líquida', '18%', '15%', '< 10%'],
  ['Mídia / receita total', '10,6%', '15%', '> 20%'],
  ['GMV capturado / vendas (base total)', '17%', '35%', '> 60%'],
  ['NOI nos top-20 ativos', 'n/d', '≥ 80%', '≥ 90%'],
  ['ABL em categorias não agentizáveis', 'n/d', '+10 p.p.', '+20 p.p.'],
  ['Visitas originadas por agentes de IA', '0%', '10%', '> 40%'],
];
const krows = [[
  { text: 'Indicador', options: { ...kh } }, { text: '2T26', options: { ...kh, align: 'center' } },
  { text: '2030', options: { ...kh, align: 'center' } }, { text: '2036', options: { ...kh, align: 'center' } },
]];
kpis.forEach((r, i) => {
  const fill = i % 2 === 0 ? THEME.colors.lt1 : THEME.colors.lt2;
  const o = { fontSize: 12, color: THEME.colors.dk1, fill: { color: fill }, valign: 'middle' };
  krows.push([
    { text: r[0], options: { ...o } },
    { text: r[1], options: { ...o, align: 'center' } },
    { text: r[2], options: { ...o, align: 'center' } },
    { text: r[3], options: { ...o, align: 'center', bold: true, color: THEME.colors.dk2 } },
  ]);
});
s.addTable(krows, { x: 0.5, y: 1.15, w: 9.0, colW: [4.2, 1.6, 1.6, 1.6], rowH: 0.4, border: { type: 'solid', pt: 0.5, color: THEME.colors.accent5 }, margin: 0.06, objectName: 'kpi table' });
s.addText('Metas são hipóteses minhas, derivadas do cenário 2036; o estacionamento cai, mas o solo reconvertido deve render mais do que a receita perdida.', { x: 0.5, y: 4.45, w: 9, h: 0.6, fontSize: 11, italic: true, color: C.accent6, margin: 0, isTextBox: true, valign: 'top', objectName: 'kpi note' });

// ---------- Slide 17: premissas e riscos ----------
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Execução' });
s.addText('Premissas, riscos e confiança', { placeholder: 'title' });
card(s, 0.5, 1.2, 4.4, 2.9, 'premissas card');
s.addText('PREMISSAS', { x: 0.75, y: 1.35, w: 4.0, h: 0.3, fontSize: 10, bold: true, charSpacing: 2, color: C.accent2, margin: 0, isTextBox: true, objectName: 'premissas label' });
s.addText([
  { text: 'Cognição abundante e barata', options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
  { text: 'Comércio agêntico domina categorias comparáveis', options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
  { text: 'Juros reais brasileiros ainda altos', options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
  { text: 'Dados físicos mais valiosos e mais regulados', options: { bullet: true } },
], { x: 0.75, y: 1.7, w: 4.0, h: 2.3, fontSize: 13, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'premissas' });
card(s, 5.1, 1.2, 4.4, 2.9, 'riscos card');
s.addText('RISCOS DO PLANO', { x: 5.35, y: 1.35, w: 4.0, h: 0.3, fontSize: 10, bold: true, charSpacing: 2, color: C.accent2, margin: 0, isTextBox: true, objectName: 'riscos label' });
s.addText([
  { text: 'Conselho não libera o envelope: o plano para na ação 1', options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
  { text: 'Plataformas de agentes cobram "taxa de descoberta" e anulam a ação 3', options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
  { text: 'Regulação de dados limita o ciclo fechado da ação 4', options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } },
  { text: 'Estacionamento cai antes da reconversão da ação 6', options: { bullet: true } },
], { x: 5.35, y: 1.7, w: 4.0, h: 2.3, fontSize: 13, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'riscos' });
s.addShape(pres.ShapeType.roundRect, { x: 0.5, y: 4.3, w: 9.0, h: 0.75, rectRadius: 0.08, fill: { color: C.text2 }, line: { color: C.text2, width: 0 }, objectName: 'confidence band' });
s.addText([
  { text: 'Confiança: ', options: { bold: true, color: C.accent2 } },
  { text: '9/10 nos dados de base (fontes primárias) · ', options: { color: C.background1 } },
  { text: '6/10 na priorização e nas metas', options: { bold: true, color: C.background1 } },
  { text: ' — sinalizado abaixo de 7: são juízos sobre um cenário de dez anos.', options: { color: C.background2 } },
], { x: 0.75, y: 4.3, w: 8.5, h: 0.75, fontSize: 13, margin: 0, isTextBox: true, valign: 'middle', objectName: 'confidence' });

(async () => {
  await pres.writeFile({ fileName: 'allos-2036-plano-de-acao.pptx' });
  await applyTheme('allos-2036-plano-de-acao.pptx', THEME);
  console.log('ok');
})();
