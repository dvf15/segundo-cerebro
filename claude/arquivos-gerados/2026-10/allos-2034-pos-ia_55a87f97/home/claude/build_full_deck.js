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
pres.title = 'Allos 2036 - Relatório completo e plano de ação';
const C = pres.SchemeColor;
const FOOT = 'Allos 2036 · Relatório e plano de ação · out/2026';

// ---------- Layouts ----------
pres.defineSlideMaster({
  title: 'TITLE_DARK',
  background: { color: THEME.colors.dk2 },
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 1.4, w: 8.8, h: 1.6, fontSize: 36, bold: true, color: C.background1, valign: 'bottom', margin: 0 }, text: '' } },
    { placeholder: { options: { name: 'body', type: 'body', x: 0.6, y: 3.15, w: 8.8, h: 1.3, fontSize: 16, color: C.background2, valign: 'top', margin: 0 }, text: '' } },
    { text: { text: FOOT, options: { x: 0.6, y: 5.05, w: 6, h: 0.3, fontSize: 10, color: C.accent3, margin: 0 } } },
  ],
});
pres.defineSlideMaster({
  title: 'SECTION_DARK',
  background: { color: THEME.colors.dk2 },
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 1.9, w: 8.8, h: 1.2, fontSize: 32, bold: true, color: C.background1, valign: 'bottom', margin: 0 }, text: '' } },
    { placeholder: { options: { name: 'body', type: 'body', x: 0.6, y: 3.2, w: 8.8, h: 1.0, fontSize: 15, color: C.background2, valign: 'top', margin: 0 }, text: '' } },
    { text: { text: FOOT, options: { x: 0.6, y: 5.05, w: 6, h: 0.3, fontSize: 10, color: C.accent3, margin: 0 } } },
  ],
});
pres.defineSlideMaster({
  title: 'CONTENT',
  background: { color: THEME.colors.lt1 },
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 0.5, y: 0.3, w: 9.0, h: 0.65, fontSize: 24, bold: true, color: C.text2, valign: 'middle', margin: 0 }, text: '' } },
    { text: { text: FOOT, options: { x: 0.5, y: 5.27, w: 6, h: 0.25, fontSize: 9, color: C.accent6, margin: 0 } } },
  ],
  slideNumber: { x: 9.0, y: 5.27, w: 0.5, h: 0.25, fontSize: 9, color: THEME.colors.accent6, align: 'right' },
});
pres.defineSlideMaster({
  title: 'ACTION',
  background: { color: THEME.colors.lt1 },
  objects: [
    { rect: { x: 0, y: 0, w: 3.3, h: 5.625, fill: { color: C.text2 } } },
    { placeholder: { options: { name: 'title', type: 'title', x: 3.65, y: 0.3, w: 5.85, h: 0.9, fontSize: 19, bold: true, color: C.text2, valign: 'top', margin: 0 }, text: '' } },
    { text: { text: FOOT, options: { x: 3.65, y: 5.27, w: 5, h: 0.25, fontSize: 9, color: C.accent6, margin: 0 } } },
  ],
  slideNumber: { x: 9.0, y: 5.27, w: 0.5, h: 0.25, fontSize: 9, color: THEME.colors.accent6, align: 'right' },
});

// ---------- Helpers ----------
function badge(slide, n, x, y, d, name) {
  slide.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: C.accent2 }, line: { color: C.accent2, width: 0 }, objectName: name + ' badge' });
  slide.addText(String(n), { x, y, w: d, h: d, fontSize: Math.round(d * 32), bold: true, color: C.background1, align: 'center', valign: 'middle', margin: 0, isTextBox: true, objectName: name + ' number' });
}
function card(slide, x, y, w, h, name, dark) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: dark ? C.text2 : C.background2 }, line: { color: dark ? C.text2 : C.background2, width: 0 }, objectName: name });
}
function label(slide, txt, x, y, w, name, light) {
  slide.addText(txt, { x, y, w, h: 0.22, fontSize: 9, bold: true, charSpacing: 2, color: light ? C.accent3 : C.accent2, margin: 0, isTextBox: true, objectName: name });
}
function bullets(items, size, after) {
  return items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1, paraSpaceAfter: after || 3 } }));
}
function tbl(slide, header, body, x, y, w, colW, name, fs) {
  fs = fs || 11;
  const hdr = { bold: true, color: THEME.colors.lt1, fill: { color: THEME.colors.dk2 }, fontSize: fs, valign: 'middle' };
  const rows = [header.map((h) => ({ text: h, options: { ...hdr } }))];
  body.forEach((r, i) => {
    const fill = i % 2 === 0 ? THEME.colors.lt1 : THEME.colors.lt2;
    rows.push(r.map((c, j) => {
      const o = { fontSize: fs, color: THEME.colors.dk1, fill: { color: fill }, valign: 'middle' };
      if (j === 0) { o.bold = true; o.color = THEME.colors.dk2; }
      return { text: c, options: o };
    }));
  });
  slide.addTable(rows, { x, y, w, colW, border: { type: 'solid', pt: 0.5, color: THEME.colors.accent5 }, margin: 0.05, objectName: name });
}

// ======================================================================
pres.addSection({ title: 'Abertura' });
let s = pres.addSlide({ masterName: 'TITLE_DARK', sectionTitle: 'Abertura' });
s.addText('Allos 2036 — Futurologia sob a lente da IA', { placeholder: 'title' });
s.addText('Relatório completo: cenário, análise do ciclo de vida e dos gargalos de execução, e plano de ação com 10 movimentos priorizados. Referências: 7 Powers (Helmer) e The Last Economy (Mostaque). Base factual: Relatório de Resultados 2T26 da ALLOS.', { placeholder: 'body' });
s.addNotes('Relatório elaborado por Claude a pedido de Daniel. Cenários, estimativas e metas são hipóteses sinalizadas.');

// ---- Sumário executivo
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Abertura' });
s.addText('Sumário executivo: cinco conclusões', { placeholder: 'title' });
const exec = [
  ['A IA polariza o setor', 'As 5 pressões encurtam o ciclo dos secundários; as 5 alavancas alongam o dos dominantes. A IA adiciona uma 6ª alavanca — dados e agentes — que multiplica as outras.'],
  ['O valor migra do m² para a jornada', 'Cobrar do lojista por venda gerada, da marca por atenção verificada e do incorporador pelo terreno, sobre uma única base de dados.'],
  ['O rival é o agente do consumidor', 'Quem decide "onde ir" será um software. A Allos precisa ser legível por ele, não só ter um app.'],
  ['Estacionamento é o passivo; terreno é a opção', '18% da receita líquida vem de vagas que tendem a sumir; 1,74 mi m² de área privativa disponível é a opção mais valiosa.'],
  ['Execução decide o ritmo', 'Pessoas, processos e vacância artesanal limitam as alavancas. Padronizar antes de automatizar; a IA muda pessoas de "quantidade" para "perfil".'],
];
exec.forEach((e, i) => {
  const col = i < 3 ? 0 : 1; const row = i < 3 ? i : i - 3;
  const x = 0.5 + col * 4.6, y = 1.1 + row * 1.35;
  card(s, x, y, 4.4, 1.2, 'exec card ' + (i + 1));
  badge(s, i + 1, x + 0.2, y + 0.3, 0.55, 'exec ' + (i + 1));
  s.addText(e[0], { x: x + 0.95, y: y + 0.1, w: 3.3, h: 0.35, fontSize: 13, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'exec title ' + (i + 1) });
  s.addText(e[1], { x: x + 0.95, y: y + 0.47, w: 3.3, h: 0.7, fontSize: 10.5, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'exec text ' + (i + 1) });
});
card(s, 5.1, 3.8, 4.4, 1.2, 'exec card thesis', true);
s.addText([{ text: 'Tese: ', options: { bold: true, color: C.accent2 } }, { text: 'a IA não ameaça a Allos como dona de imóveis dominantes; ameaça a Allos como cobradora de m². Sem um envelope de capital para a transição, o plano para na ação 1.', options: { color: C.background1 } }], { x: 5.3, y: 3.9, w: 4.0, h: 1.0, fontSize: 11, margin: 0, isTextBox: true, valign: 'middle', objectName: 'exec thesis' });

// ======================================================================
pres.addSection({ title: 'Cenário e base' });
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Cenário e base' });
s.addText('Premissas do cenário 2036: seis trajetórias de IA', { placeholder: 'title' });
const prem = [
  ['Agentes fazem o cognitivo', 'Análise, negociação, contratos e atendimento a custo marginal próximo de zero.'],
  ['Comércio agêntico', 'Reposição e itens comparáveis delegados a agentes; a compra social e experiencial resiste e ganha prêmio.'],
  ['Logística autônoma', 'Entrega barata desvaloriza a conveniência física; saúde, educação, lazer e convivência valorizam.'],
  ['Atenção física vira ativo raro', 'Conteúdo infinito e "AI slop" desvalorizam a atenção digital genérica.'],
  ['Dados físicos valiosos e regulados', 'Consentimento mediado por agentes; o que pode ser ativado encolhe.'],
  ['Juros reais altos permanecem', 'Produtividade sobe; o efeito sobre emprego e renda da classe média é a maior incógnita.'],
];
prem.forEach((p, i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const x = 0.5 + col * 3.05, y = 1.1 + row * 2.0;
  card(s, x, y, 2.9, 1.85, 'prem card ' + (i + 1));
  badge(s, i + 1, x + 0.2, y + 0.2, 0.5, 'prem ' + (i + 1));
  s.addText(p[0], { x: x + 0.85, y: y + 0.17, w: 1.95, h: 0.55, fontSize: 12, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'prem title ' + (i + 1) });
  s.addText(p[1], { x: x + 0.2, y: y + 0.85, w: 2.5, h: 0.95, fontSize: 11, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'prem text ' + (i + 1) });
});

// ---- Lentes
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Cenário e base' });
s.addText('As duas lentes e como as uso', { placeholder: 'title' });
card(s, 0.5, 1.1, 4.4, 3.0, 'lens helmer');
label(s, '7 POWERS · HAMILTON HELMER', 0.75, 1.25, 4.0, 'lens helmer label');
s.addText(bullets(['Poder = benefício para quem detém + barreira para quem copia', 'Escala, rede, contraposicionamento, custos de troca, marca, recurso encurralado, poder de processo', 'Uso: teste de durabilidade de cada vantagem da Allos sob IA'], 11), { x: 0.75, y: 1.55, w: 4.0, h: 2.45, fontSize: 11, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'lens helmer text' });
card(s, 5.1, 1.1, 4.4, 3.0, 'lens mostaque');
label(s, 'THE LAST ECONOMY · EMAD MOSTAQUE', 5.35, 1.25, 4.0, 'lens mostaque label');
s.addText(bullets(['IA é a 4ª inversão de valor, depois de terra, trabalho e capital', 'Valor = redução de entropia e capacidade de predição; capitais Material, Inteligência, Rede, Diversidade', 'Três futuros: feudalismo digital, fragmentação, simbiose humana', 'Uso: separar capital Material (não copiável) de capital de Inteligência (comoditizável). Não adoto a janela de "mil dias".'], 11), { x: 5.35, y: 1.55, w: 4.0, h: 2.45, fontSize: 11, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'lens mostaque text' });
card(s, 0.5, 4.3, 9.0, 0.8, 'lens synth', true);
s.addText([{ text: 'Síntese: ', options: { bold: true, color: C.accent2 } }, { text: 'a IA comoditiza o cognitivo e valoriza o físico, o local e o confiável. O risco não é a IA destruir o modelo do shopping; é mudar quem fica com a margem dentro dele.', options: { color: C.background1 } }], { x: 0.75, y: 4.3, w: 8.5, h: 0.8, fontSize: 12, margin: 0, isTextBox: true, valign: 'middle', objectName: 'lens synth text' });

// ---- Allos hoje: stats
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Cenário e base' });
s.addText('Allos hoje: oito números do 2T26', { placeholder: 'title' });
const stats = [
  ['46', 'shoppings em 16 estados; 1,26 mi m² de ABL própria; ocupação 96,2%'],
  ['R$ 732 mi', 'receita líquida (+11,6%); 63% é aluguel'],
  ['R$ 341 mi', 'FFO (+12,0%); EBITDA R$ 525 mi, margem 71,7%'],
  ['1,7x', 'dívida líquida/EBITDA; custo CDI + 0,57%; 98% em CDI'],
  ['10,6%', 'da receita é mídia (+84,5% a/a); 17 aeroportos da Aena'],
  ['R$ 1,56 bi', 'GMV capturado no trimestre (+31%); +15% de frequência pós-adesão'],
  ['18%', 'da receita líquida vem de estacionamento (R$ 133 mi)'],
  ['1,74 mi m²', 'de área privativa multiúso disponível; 72 torres assinadas'],
];
stats.forEach((st, i) => {
  const col = i % 4, row = Math.floor(i / 4);
  const x = 0.5 + col * 2.3, y = 1.1 + row * 2.0;
  card(s, x, y, 2.1, 1.85, 'stat card ' + (i + 1));
  s.addText(st[0], { x: x + 0.15, y: y + 0.12, w: 1.85, h: 0.7, fontSize: 24, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'stat value ' + (i + 1) });
  s.addText(st[1], { x: x + 0.15, y: y + 0.85, w: 1.85, h: 0.95, fontSize: 10.5, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'stat label ' + (i + 1) });
});

// ---- Linha de base tables (2 slides)
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Cenário e base' });
s.addText('Linha de base 2T26 (1/2): portfólio, resultado, mídia e plataforma', { placeholder: 'title' });
tbl(s, ['Frente', 'Situação em 2T26 (abr–jun 2026)'], [
  ['Portfólio', '46 shoppings; ABL total 1.934 mil m², própria 1.262 mil m²; 6 shoppings de terceiros administrados. Ocupação 96,2%; inadimplência 1,4%; custo de ocupação 10,3%; vendas R$ 10,5 bi (SSS 2,6% ex-Tijuca). SSS: Serviços e Lazer 6,5% vs Roupas e Calçados 1,2%.'],
  ['Resultado', 'Receita líquida R$ 732,3 mi (+11,6%); EBITDA ajustado R$ 525,4 mi (+10,5%); FFO R$ 340,8 mi (+12,0%). Locação R$ 498,7 mi (+2,6%); estacionamento R$ 132,9 mi; serviços R$ 115,9 mi (+39,6%).'],
  ['helloo / mídia', 'Mídia +84,5% a/a, 10,6% da receita. Consórcio helloo | NEOOH: 17 aeroportos da Aena, incl. Congonhas. VendaCerta (jun/26): mídia por resultado com o CRM do programa; retorno declarado de R$ 11,50 por R$ 1 nos pilotos.'],
  ['Programa de Benefícios', '17,1 mi de sessões (+12%) em 37 shoppings; GMV reconhecido R$ 1,56 bi (+31%) = 27% das vendas nos maduros e 17% na base total; adesão eleva a frequência em 15% (31% nos maduros).'],
], 0.5, 1.1, 9.0, [1.6, 7.4], 'base table 1', 11);

s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Cenário e base' });
s.addText('Linha de base 2T26 (2/2): multiúso, capital, finanças, gestão e governança', { placeholder: 'title' });
tbl(s, ['Frente', 'Situação em 2T26 (abr–jun 2026)'], [
  ['Multiúso', '72 torres assinadas (9 entregues); 1,74 mi m² disponíveis; masterplan Parque Dom Pedro (VGV R$ 4,5 bi; hotel primeiro). Taste no Tijuca: estacionamento virou 2.167 m² de gastronomia; R$ 5 mi no 1º mês, +22% vs projeção.'],
  ['Reciclagem', 'Venda do Shopping Curitiba por R$ 199,6 mi (cap rate 9,6%); permutas em Campo Grande, Villagio Caxias e Taboão; 1,6% do Recife a 9,2%; Kinea ALLOS Malls FII (até R$ 2 bi).'],
  ['Finanças', 'Dívida líquida R$ 3,68 bi; 1,7x; CDI + 0,57%. Guidance 2026: EBITDA R$ 2,17–2,24 bi; capex R$ 350–450 mi; dividendos/JCP R$ 0,28–0,30/ação/mês; R$ 1,2 bi já pagos em 2026.'],
  ['Gestão', 'Integração de sistemas concluída em 2025; Simplifica Allos: SG&A −5,6% a/a (R$ 105,8 mi, ~14% da receita líquida), com uso de IA citado pela CFO.'],
  ['Governança', 'Sem controlador: CPPIB 9,0%, Guepardo 5,4%, SPX 5,2%, Sonae Sierra 5,1%, Rique 3,4%, Otto 3,4%; BlackRock 5,1% (out/26). Conselho presidido por Renato Rique, com independentes. FTSE4Good e Pró-Ética.'],
], 0.5, 1.1, 9.0, [1.6, 7.4], 'base table 2', 11);

// ======================================================================
pres.addSection({ title: 'Análise' });
s = pres.addSlide({ masterName: 'SECTION_DARK', sectionTitle: 'Análise' });
s.addText('Análise', { placeholder: 'title' });
s.addText('Ganhos e perdas por frente · ciclo de vida sob IA · fatores externos e internos · os sete poderes · gargalos de execução', { placeholder: 'body' });

// ---- Ganhos e perdas (2 slides)
function gainsSlide(title, blocks) {
  const sl = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
  sl.addText(title, { placeholder: 'title' });
  blocks.forEach((b, i) => {
    const y = 1.1 + i * 2.05;
    sl.addText(b[0], { x: 0.5, y, w: 9.0, h: 0.3, fontSize: 13, bold: true, color: C.text2, margin: 0, isTextBox: true, objectName: 'frente ' + (i + 1) });
    card(sl, 0.5, y + 0.35, 4.4, 1.55, 'ganhos card ' + (i + 1));
    label(sl, 'GANHOS PROVÁVEIS', 0.7, y + 0.45, 4.0, 'ganhos label ' + (i + 1));
    sl.addText(b[1], { x: 0.7, y: y + 0.7, w: 4.0, h: 1.15, fontSize: 10, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'ganhos text ' + (i + 1) });
    card(sl, 5.1, y + 0.35, 4.4, 1.55, 'perdas card ' + (i + 1));
    label(sl, 'PERDAS PROVÁVEIS', 5.3, y + 0.45, 4.0, 'perdas label ' + (i + 1));
    sl.addText(b[2], { x: 5.3, y: y + 0.7, w: 4.0, h: 1.15, fontSize: 10, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'perdas text ' + (i + 1) });
  });
}
gainsSlide('Ganhos e perdas em 2036 (1/2): portfólio e relacionamento', [
  ['Portfólio', 'Localizações dominantes viram recurso encurralado mais raro. Logística autônoma e menos carros liberam estacionamento e terreno — o pipeline de 1,74 mi m² é a opção real mais valiosa. IA reduz custo de obra e permite aluguel por desempenho em tempo real.', 'Categorias comparáveis (SSS 1–2%) migram para agentes de compra; satélites perdem viabilidade em shoppings secundários. Estacionamento (18% da receita) pode cair 30–50% em dez anos (hipótese). Shoppings não dominantes perdem para "agente + entrega".'],
  ['Relacionamento + helloo', 'Dado físico proprietário (R$ 1,56 bi de GMV/tri) vira ativo escasso quando o digital é sintético. DOOH com audiência verificada ganha prêmio. Ciclo fechado mídia → oferta → venda comprovada (VendaCerta) é o modelo mais defensável; IA zera o custo de segmentação.', 'O agente pessoal se interpõe entre marca e cliente: pontos e push perdem efeito se a decisão de "onde ir" for delegada. Plataformas de agentes cobram "taxa de descoberta". CPMs genéricos caem com programática; telas são copiáveis. Regulação de dados reduz o ativável.'],
]);
gainsSlide('Ganhos e perdas em 2036 (2/2): gestão, finanças e governança', [
  ['Gestão e finanças', 'SG&A de ~14% para um dígito da receita líquida. Agentes fazem underwriting, renovação, mix e cobrança. A plataforma de gestão vira produto asset-light para terceiros e FIIs. Balanço a 1,7x e CDI + 0,57% financiam a transição sem estresse.', 'Know-how de gestão se comoditiza; taxa de administração encolhe. Lojistas pressionam por variável sobre venda medida — menos mínimo, mais volatilidade de NOI. Dependência de 2–3 provedores de IA. Dívida 98% em CDI: sem queda de juros, o múltiplo não re-rateia.'],
  ['Governança', 'Capital pulverizado com institucionais de longo prazo favorece alocação por retorno. O conselho pode supervisionar IA e dados como fez com ESG; FTSE4Good e Pró-Ética dão licença social para projetos urbanos.', 'Payout de ~R$ 1,7 bi/ano vs capex de R$ 350–450 mi: a política de dividendos vira o gargalo da transição — decisão do conselho. Ativismo de curto prazo sem controlador. Conselho sem competência em IA delega decisões algorítmicas sem accountability.'],
]);

// ---- Ciclo de vida: imagem
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
s.addText('O ciclo de vida do shopping: cinco pressões vs. cinco alavancas', { placeholder: 'title' });
s.addImage({ path: 'assets/ciclo-de-vida.png', x: 1.3, y: 1.05, w: 7.4, h: 4.13, objectName: 'diagrama ciclo de vida' });
s.addNotes('Diagrama fornecido por Daniel. Versão 1: pressões de mercado encurtam o ciclo (ABL concorrencial, e-commerce, tributação, burocracia, recessão). Versão 2: alavancas estratégicas alongam o ciclo (expansão/retrofit, mix transformacional, retail media, eventos/bilheteria, reciclagem via FII).');

// ---- Leitura do ciclo sob IA
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
s.addText('Leitura sob IA: as duas curvas viram destinos, e nasce uma sexta alavanca', { placeholder: 'title' });
card(s, 0.5, 1.1, 2.9, 3.95, 'ciclo card 1');
label(s, 'O QUE O DIAGRAMA DIZ', 0.7, 1.25, 2.5, 'ciclo label 1');
s.addText('Cinco pressões encurtam o ciclo e geram "perda de potencial" frente à curva normal; cinco alavancas aplicadas em sequência alongam o ciclo e geram "ganho de vendas" acima dela.', { x: 0.7, y: 1.55, w: 2.5, h: 3.4, fontSize: 11, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'ciclo text 1' });
card(s, 3.55, 1.1, 2.9, 3.95, 'ciclo card 2');
label(s, 'O QUE A IA MUDA', 3.75, 1.25, 2.5, 'ciclo label 2');
s.addText(bullets(['As curvas deixam de ser alternativas: a IA empurra secundários para a encurtada e dominantes para a alongada', 'A sequência se comprime: as alavancas precisam rodar em paralelo', 'A reciclagem via FII é a alavanca certa para a cauda, aplicada cedo'], 11, 4), { x: 3.75, y: 1.55, w: 2.5, h: 3.4, fontSize: 11, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'ciclo text 2' });
card(s, 6.6, 1.1, 2.9, 3.95, 'ciclo card 3', true);
label(s, 'A SEXTA ALAVANCA', 6.8, 1.25, 2.5, 'ciclo label 3', true);
s.addText('Dados e agentes. É o multiplicador das outras cinco: sem dado proprietário e processo agêntico, cada alavanca é copiável.\n\nNa Allos: GMV capturado de R$ 1,56 bi/tri, 17,1 mi de sessões, +15% de frequência pós-adesão — e o sistema multiagente Shopping Inteligente como protótipo operacional.', { x: 6.8, y: 1.55, w: 2.5, h: 3.4, fontSize: 11, color: C.background1, margin: 0, isTextBox: true, valign: 'top', objectName: 'ciclo text 3' });

// ---- Pressões sob IA (table)
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
s.addText('As cinco pressões: o que a IA faz com cada uma', { placeholder: 'title' });
tbl(s, ['Pressão', 'Como a IA a transforma até 2036', 'Exposição da Allos', 'Resposta'], [
  ['ABL concorrencial', 'Deixa de ser "mais m²" e vira "mais destinos"; cognição barata nivela a gestão. ABL nova fere o secundário, não o dominante.', 'Média: dominância desigual; vacância concentrada (Brasília 84,7%, Tijuca 90,2%, Passeio 91,5%)', 'Ações 2 e 9'],
  ['E-commerce', 'Vira comércio agêntico: o agente compra o comparável e decide "onde ir". A pressão migra da venda para a descoberta.', 'Alta em comparáveis (Roupas 1,2%); baixa em serviços e lazer (6,5%)', 'Ações 3, 4 e 9'],
  ['Tributação elevada', 'Reforma tributária (2026–2033; redutor de 70% para locação) muda a mecânica; IA reduz compliance, não a alíquota.', 'Média: custo de ocupação de 10,3% limita repasse', 'Ações 7 e 8'],
  ['Entraves burocráticos', 'Agentes montam dossiês em horas; o rito municipal segue humano. O gargalo migra da empresa para o Estado.', 'Alta no multiúso (72 torres; alvarás do Dom Pedro)', 'Ação 6 + H2'],
  ['Recessão econômica', 'Se a produtividade não virar renda, o consumo presencial cai. Serviços essenciais (saúde, educação) resistem.', 'Alta: 63% da receita é aluguel; 98% da dívida em CDI', 'Ações 1, 2 e 9'],
], 0.5, 1.1, 9.0, [1.5, 3.5, 2.8, 1.2], 'pressoes table', 10);

// ---- Alavancas sob IA (table)
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
s.addText('As cinco alavancas (e a sexta): como a IA as amplifica', { placeholder: 'title' });
tbl(s, ['Alavanca', 'Como a IA a amplifica', 'Exemplo já visível na Allos', 'Ação'], [
  ['Expansão / retrofit', 'Projeto e obra mais baratos; reconversão de área improdutiva em uso que a IA valoriza.', 'Taste no Tijuca: estacionamento virou 2.167 m² de gastronomia; R$ 5 mi no 1º mês', '6 e 9'],
  ['Mix transformacional', 'Modelos próprios escolhem o mix por ativo; agentes prospectam marcas (Hunter, Farmer, Builder).', 'On Running (Leblon), Fazenda Churrascada (Tamboré), Adidas e Zerezes (VillaLobos)', '9 e 7'],
  ['Retail media', 'Segmentação e criação a custo zero; ciclo fechado mídia → oferta → venda comprovada.', 'VendaCerta (R$ 11,50 por R$ 1); Copa com C6, Coca-Cola, Hyundai; Nintendo segmentada', '4'],
  ['Eventos / bilheteria', 'Experiência ao vivo é o que o agente não substitui; preço por demanda; evento vira dado de intenção.', 'Figurinhas da Copa em 45 shoppings (Visa, BB); São João com Boticário, Natura, TIM', '9 e 4'],
  ['Reciclagem via FII', 'Valuation por ativo com fluxo e GMV reais; saída da cauda sem desconto de opacidade.', 'Kinea ALLOS Malls FII (até R$ 2 bi); Curitiba a cap rate 9,6%', '2 e 10'],
  ['6ª: dados e agentes', 'Multiplicador das outras cinco; sem ele, cada alavanca é copiável.', 'GMV R$ 1,56 bi/tri; 17,1 mi de sessões; +15% de frequência', '3, 5 e 7'],
], 0.5, 1.1, 9.0, [1.6, 3.4, 3.2, 0.8], 'alavancas table', 10);

// ---- Fatores externos
function factorSlide(title, left, right, leftLabel, rightLabel) {
  const sl = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
  sl.addText(title, { placeholder: 'title' });
  card(sl, 0.5, 1.1, 4.4, 4.0, 'fatores fortalecem');
  label(sl, leftLabel, 0.7, 1.25, 4.0, 'fortalecem label');
  sl.addText(bullets(left, 11, 4), { x: 0.7, y: 1.55, w: 4.0, h: 3.45, fontSize: 11, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'fortalecem text' });
  card(sl, 5.1, 1.1, 4.4, 4.0, 'fatores enfraquecem');
  label(sl, rightLabel, 5.3, 1.25, 4.0, 'enfraquecem label');
  sl.addText(bullets(right, 11, 4), { x: 5.3, y: 1.55, w: 4.0, h: 3.45, fontSize: 11, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'enfraquecem text' });
}
factorSlide('Fatores externos: o que fortalece e o que enfraquece', [
  'Escassez do físico e do local: terreno, fluxo e convivência concentram a renda',
  'Rejeição ao conteúdo genérico de IA: atenção física verificada ganha prêmio',
  'Adensamento urbano: shopping como eixo de moradia, trabalho, saúde e educação',
  'Consolidação do setor: escala dilui o custo fixo de IA e dados',
], [
  'Comércio agêntico e logística autônoma: o agente decide onde ir',
  'Juros reais altos: dívida 98% em CDI; múltiplo não re-rateia',
  'Plataformas de agentes com poder de intermediação: "taxa de descoberta"',
  'Regulação de dados e consentimento mediado por agentes',
  'Incerto: reforma tributária em transição (2026–2033)',
  'Incerto: emprego e renda da classe média sob IA — a maior incógnita',
], 'FORTALECEM', 'ENFRAQUECEM / INCERTOS');
factorSlide('Fatores internos: o que fortalece e o que enfraquece', [
  '46 ativos dominantes: recurso encurralado + escala para treinar modelos próprios',
  'Base proprietária de dados físicos: GMV R$ 1,56 bi/tri, 17 mi de sessões',
  'Ciclo fechado mídia → oferta → venda (helloo + CRM)',
  'Pipeline multiúso de 1,74 mi m²: converte área desvalorizada em uso valorizado',
  'Balanço (1,7x; CDI + 0,57%) e reciclagem de capital',
  'Governança pulverizada com institucionais de longo prazo',
], [
  'Estacionamento: 18% da receita líquida exposta à autonomia veicular',
  'Mix com categorias comparáveis (SSS 1–2%)',
  'Payout ~R$ 1,7 bi/ano vs capex R$ 350–450 mi: escolha de governança da década',
  'Dependência de poucos provedores de IA',
  'Gargalo 1: escassez de pessoas capacitadas para a escala',
  'Gargalo 2: instabilidade de processos — IA amplifica a variância',
  'Gargalo 3: gestão artesanal da vacância — maior perda evitável de NOI',
], 'FORTALECEM', 'ENFRAQUECEM');

// ---- Sete poderes
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
s.addText('Os sete poderes de Helmer na Allos: 2026 vs 2036', { placeholder: 'title' });
tbl(s, ['Poder', '2026', '2036 (tendência)'], [
  ['Recurso encurralado', 'Forte: localizações dominantes em 16 estados', 'Mais forte: o físico não se copia; poder-âncora que justifica concentrar capital'],
  ['Economias de escala', 'Moderada: 46 ativos, SG&A em queda', 'Mais forte: custo fixo de IA e dados dilui melhor; mais fluxo treina melhor'],
  ['Economias de rede', 'Incipiente: helloo + Programa de Benefícios', 'Decisiva e incerta: forte se o ciclo fechado virar padrão; fraca se agentes mediarem'],
  ['Custos de troca', 'Moderada no lojista; baixa no consumidor', 'Cai no lojista (contratos curtos); sobe no consumidor se integrado ao agente pessoal'],
  ['Marca', 'Forte por ativo; irrelevante como corporação', 'Mais importante: com oferta infinita, marca é confiança — a do shopping, não a da Allos'],
  ['Contraposicionamento', 'Inexistente', 'Oportunidade: cobrar por venda comprovada em vez de m²'],
  ['Poder de processo', 'Fraco: operação artesanal (gargalos 2 e 3)', 'O mais disputado: só vira poder se embutido em dados exclusivos e no dia a dia'],
], 0.5, 1.1, 9.0, [1.9, 2.9, 4.2], 'powers table', 10.5);

// ---- Gargalos: imagem
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
s.addText('Gargalos operacionais na execução da estratégia', { placeholder: 'title' });
s.addImage({ path: 'assets/gargalos.jpg', x: 1.2, y: 1.05, w: 7.6, h: 4.13, objectName: 'diagrama gargalos' });
s.addNotes('Diagrama fornecido por Daniel: escassez de pessoas capacitadas; instabilidade nos processos; gestão artesanal da vacância.');

// ---- Gargalos sob IA
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
s.addText('Os três gargalos sob IA: três habilitadores antes das alavancas', { placeholder: 'title' });
const garg = [
  ['H1 · Pessoas', 'A IA alivia a quantidade e eleva o perfil: o escasso passa a ser quem orquestra agentes, lê dados e negocia.', 'Academia Allos de Operação Agêntica: trilha de 6 meses; cada gestor com copilotos de renovação, vacância e mídia.', 'Ex.: gerente regional passa de 4 para 7–8 shoppings (hipótese).', 'Shoppings por gestor; % de decisões com dossiê de agente'],
  ['H2 · Processos', 'Agentes só funcionam sobre processo padronizado; sobre processo instável, amplificam a variância. Padronizar antes de automatizar.', 'Playbooks com SLA por processo (renovação, vacância, obra, cobrança, licenciamento); cada playbook é a especificação do agente.', 'Ex.: playbook de renovação = mix e quadrante, janela, argumentos, leasing spread real, alçadas.', '% de processos com playbook e SLA; variância de prazo'],
  ['H3 · Vacância', 'Maior retorno imediato: o ciclo saída → inauguração pode ser previsto e orquestrado como pipeline.', 'Churn por loja + prospecção por agentes (Hunter) + matching (Farmer/Alavancador) + kit de obra e licenças (Builder).', 'Ex.: loja sai; a nova abre em 45 dias, não 120 (prazos ilustrativos).', 'Dias de vacância; NOI perdido; % de saídas previstas'],
];
garg.forEach((g, i) => {
  const x = 0.5 + i * 3.05;
  card(s, x, 1.1, 2.9, 4.0, 'garg card ' + (i + 1));
  s.addText(g[0], { x: x + 0.2, y: 1.2, w: 2.5, h: 0.35, fontSize: 13, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'garg title ' + (i + 1) });
  label(s, 'DIAGNÓSTICO', x + 0.2, 1.6, 2.5, 'garg l1 ' + (i + 1));
  s.addText(g[1], { x: x + 0.2, y: 1.82, w: 2.5, h: 0.95, fontSize: 9.5, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'garg t1 ' + (i + 1) });
  label(s, 'HABILITADOR', x + 0.2, 2.8, 2.5, 'garg l2 ' + (i + 1));
  s.addText(g[2], { x: x + 0.2, y: 3.02, w: 2.5, h: 0.95, fontSize: 9.5, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'garg t2 ' + (i + 1) });
  s.addText(g[3], { x: x + 0.2, y: 3.98, w: 2.5, h: 0.5, fontSize: 9.5, italic: true, color: C.accent4, margin: 0, isTextBox: true, valign: 'top', objectName: 'garg ex ' + (i + 1) });
  label(s, 'KPI', x + 0.2, 4.5, 2.5, 'garg l3 ' + (i + 1));
  s.addText(g[4], { x: x + 0.2, y: 4.7, w: 2.5, h: 0.4, fontSize: 9.5, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: 'top', objectName: 'garg t3 ' + (i + 1) });
});

// ======================================================================
pres.addSection({ title: 'Plano de ação' });
s = pres.addSlide({ masterName: 'SECTION_DARK', sectionTitle: 'Plano de ação' });
s.addText('Plano de ação: 10 movimentos priorizados', { placeholder: 'title' });
s.addText('Critérios · visão geral · uma página por ação com exemplo prático · sequenciamento em três ondas · painel de metas', { placeholder: 'body' });

// ---- Critérios
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Plano de ação' });
s.addText('Como priorizei: quatro critérios', { placeholder: 'title' });
const crit = [
  ['Janela que se fecha', 'Quanto antes precisa começar para ainda fazer diferença em 2036.'],
  ['Alavancagem', 'Quantas outras ações dependem desta.'],
  ['Impacto em FFO e valor', 'Tamanho da linha de receita ou custo que protege ou cria.'],
  ['Reversibilidade', 'O que é barato testar e reverter vem antes do irreversível.'],
];
crit.forEach((c, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = 0.5 + col * 4.6, y = 1.2 + row * 1.75;
  card(s, x, y, 4.4, 1.5, 'criterio card ' + (i + 1));
  badge(s, i + 1, x + 0.25, y + 0.4, 0.7, 'criterio ' + (i + 1));
  s.addText(c[0], { x: x + 1.15, y: y + 0.2, w: 3.1, h: 0.45, fontSize: 16, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'criterio title ' + (i + 1) });
  s.addText(c[1], { x: x + 1.15, y: y + 0.68, w: 3.1, h: 0.7, fontSize: 13, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'criterio desc ' + (i + 1) });
});
s.addText('A ordem é a ordem em que eu as iniciaria; os horizontes se sobrepõem. Os habilitadores H1–H3 são pré-condições, não ações.', { x: 0.5, y: 4.75, w: 9, h: 0.4, fontSize: 11, italic: true, color: C.accent6, margin: 0, isTextBox: true, objectName: 'criterio note' });

// ---- Data
const actions = [
  { n: 1, title: 'Definir o envelope de capital da transição e a supervisão de IA no conselho',
    alvo: 'Fraqueza: payout ~R$ 1,7 bi/ano vs capex R$ 350–450 mi', poder: 'Habilitador de todas as demais', horizonte: '0–6 meses', resp: 'CEO + CFO/RI, com o Presidente do Conselho',
    desc: 'Envelope plurianual de capex para dados, tecnologia e reconversão; comitê de IA & Dados com um conselheiro independente especialista; métricas de IA no relatório trimestral e no guidance.',
    ex: 'R$ 250 mi/ano por 5 anos ≈ 11% do ponto médio do guidance de EBITDA 2026 e R$ 0,50/ação/ano: o dividendo mensal cairia de ~R$ 0,29 para ~R$ 0,25/ação, mantendo 1,7x. Alternativa: financiar com desinvestimentos da ação 2 (só o Curitiba rendeu R$ 199,6 mi). Aritmética minha, ilustrativa.',
    passos: ['Proposta formal ao conselho: envelope, comitê e KPIs', 'Revisão da política de dividendos sem romper o guidance 2026', 'Conselheiro especialista em IA indicado para a AGO 2027'],
    kpi: 'Capex de transição / EBITDA; métricas de IA reportadas; decisões revisadas pelo comitê' },
  { n: 2, title: 'Concentrar o portfólio: eleger ~20 ativos "destino" e sair da cauda em 24–36 meses',
    alvo: 'Fraqueza: cauda exposta a "agente + entrega"', poder: 'Recurso encurralado + escala', horizonte: '6–36 meses', resp: 'Investimentos e M&A + Portfólio',
    desc: 'Pontuar os 46 ativos por dominância, exposição do mix a comparáveis, opcionalidade de terreno e controle; concentrar capex nos ~20 melhores; vender ou aportar os demais no Kinea ALLOS Malls FII e em permutas.',
    ex: '"Destino": marca, terreno e controle — Parque Dom Pedro (319 mil m² disponíveis), Passeio das Águas (332 mil m²), Leblon, Villa-Lobos, Norteshopping, Tamboré. Critérios de revisão: participação minoritária sem gestão (ABC, 1,3%), ocupação baixa (Brasília 84,7%; Rio Design Leblon 63,9%). Dados públicos do 2T26; decisão exige NOI e cap rate.',
    passos: ['Scoring dos 46 ativos aprovado pelo comitê de investimentos', 'Lista de saída e cronograma 2027–2028; mandato para o FII', 'Capex 2027 realocado para os top-20'],
    kpi: '% do NOI nos top-20; cap rate de saída vs custo de capital; capex/m² nos top-20' },
  { n: 3, title: 'Allos Agent Gateway: oferta, benefício, estoque e evento legíveis por agentes de IA',
    alvo: 'Ameaça → oportunidade: comércio agêntico', poder: 'Economias de rede + custos de troca', horizonte: 'MVP em 12 meses; total em 24', resp: 'Desenvolvimento e Novos Negócios + helloo + TI',
    desc: 'API em padrão aberto (estilo MCP) com catálogo de lojas, benefícios, eventos, estacionamento e reservas; padrão para lojistas publicarem estoque; integração com assistentes de consumo de massa.',
    ex: 'O cliente diz ao assistente: "quero um tênis de corrida hoje à tarde, perto de casa". O assistente consulta o Gateway: On Running no Leblon tem o modelo, o programa dá cashback, há vaga reservável e corrida no sábado. Sugere a visita e reserva a vaga — e a Allos sabe que a visita veio de agente. Sem o Gateway, o assistente sugere entrega em casa.',
    passos: ['MVP com catálogo e benefícios de 5 shoppings', 'Piloto com um assistente de massa (WhatsApp, Google ou Apple)', 'Padrão de estoque publicado por ≥ 200 lojas em 12 meses'],
    kpi: '% de visitas e resgates originados por agentes; cobertura do catálogo; conversão sugestão → visita' },
  { n: 4, title: 'Escalar o ciclo fechado de retail media (VendaCerta) ao portfólio e às marcas',
    alvo: 'Oportunidade: mídia já é 10,6% da receita', poder: 'Economias de rede + recurso encurralado (dado)', horizonte: '12–24 meses', resp: 'helloo (Geral e Comercial) + CRM',
    desc: 'Levar o VendaCerta dos pilotos SP/RJ aos 37 shoppings com plataforma; produto "venda incremental comprovada" para marcas de consumo; tudo medido contra grupo de controle; mesmo ciclo em aeroportos e edifícios.',
    ex: 'Hoje: a loja cadastra um benefício no app; o CRM aciona "clientes de concorrentes", "adormecidos há 45 dias" e "compradores de lojas complementares"; a venda é comprovada no GMV (R$ 11,50 por R$ 1 nos pilotos). Em 2036: uma marca de bebidas paga por garrafa vendida a membros expostos nas telas e no app, com controle automático — nada sem comprovação é faturado.',
    passos: ['Rollout em 15 shoppings', '3 marcas nacionais em piloto com medição de incrementalidade', 'Painel de ROAS auditável para anunciantes'],
    kpi: 'Receita de mídia por resultado; ROAS comprovado; % lojistas ativos; mídia / receita total' },
  { n: 5, title: 'Camada proprietária de dados e IA, com estratégia multi-fornecedor',
    alvo: 'Fraqueza: dependência de 2–3 provedores de IA', poder: 'Recurso encurralado + escala', horizonte: '12–24 meses', resp: 'TI/Dados + helloo + Jurídico (privacidade)',
    desc: 'Modelo de dados único (CRM, GMV, fluxo, estacionamento, locação); modelos próprios de propensão, churn, inadimplência, mix e preço; ≥2 provedores com portabilidade; consentimento "agent-ready" e clean room para marcas.',
    ex: 'O modelo de propensão a visita cruza frequência pós-adesão (+15%; +31% nos maduros), categoria e horário, e alimenta o mix (9), a mídia (4) e o Gateway (3). Uma marca de CPG acessa a audiência por clean room — agregados, nunca o indivíduo — e paga pela ativação. O provedor de modelo é substituível; o dado não.',
    passos: ['Inventário e governança de dados', 'Contrato com ≥2 provedores, com cláusula de portabilidade', 'Primeiro modelo próprio (propensão a visita) em produção'],
    kpi: '% das decisões com modelos próprios; custo de IA por shopping; % de dados com consentimento ativável' },
  { n: 6, title: 'Reconverter estacionamento antes da queda: plano por ativo',
    alvo: 'Fraqueza: 18% da receita líquida', poder: 'Recurso encurralado (terreno) + contraposicionamento', horizonte: 'Projetos em 36 meses; obra 2029–34', resp: 'Desenvolvimento e Novos Negócios + Operações',
    desc: 'Mapear ocupação de vagas por ativo e horário; definir para cada dominante o uso que substitui o deck (saúde, educação, moradia, last-mile, lazer); aprovar projetos e licenças enquanto a receita atual financia a obra.',
    ex: 'O Taste do Tijuca é o caso-piloto realizado: estacionamento descoberto virou rooftop de 2.167 m² com 22 operações, R$ 5 mi no 1º mês (+22%) e ~15% do fluxo. Maceió é a versão residencial (5 torres). Em 2036, o deck superior abriga clínica-dia, escola de idiomas e hub de last-mile — fluxo e aluguel, não só tarifa.',
    passos: ['Mapa de ocupação de vagas dos 46 ativos', '3 pilotos de reconversão de deck com modelo de receita por m² de solo', 'Contratos de estacionamento revisados com cláusula de saída'],
    kpi: 'm² de estacionamento com projeto aprovado; receita/m² de solo vs receita perdida; prazo de licença' },
  { n: 7, title: 'Operação agêntica: vacância, renovação, cobrança e atendimento',
    alvo: 'Oportunidade: SG&A de ~14% para um dígito; gargalos H2/H3', poder: 'Poder de processo + escala', horizonte: '12–36 meses', resp: 'COO + Locação + Pessoas (H1)',
    desc: 'Padronizar os playbooks (H2) e colocar agentes em produção nos processos de maior volume — pipeline de vacância (H3), underwriting de renovação, PDD, atendimento e cobrança — redesenhando o processo, não só acoplando ferramenta.',
    ex: 'Contrato de satélite vence em 9 meses: o agente classifica a loja por mix e quadrante, define a janela, calcula o leasing spread real e a alçada e entrega o dossiê; o gerente negocia. Se o churn indica saída, o Hunter lista marcas em expansão com fit de cluster, o Farmer qualifica o investidor, o Alavancador estrutura a condição e o Builder entrega projeto e licenças.',
    passos: ['Playbooks com SLA para renovação, vacância e cobrança', '3 agentes em produção em 5 shoppings; linha de base de ciclo e custo', 'Pipeline de vacância em 20 shoppings em 12 meses'],
    kpi: 'SG&A / receita líquida; dias de renovação; dias de vacância; inadimplência; shoppings por gestor' },
  { n: 8, title: 'Contrato híbrido por desempenho: piloto em 5 shoppings',
    alvo: 'Oportunidade de contraposicionamento', poder: 'Contraposicionamento + custos de troca do lojista', horizonte: '12–24 meses', resp: 'Locação + Jurídico + helloo',
    desc: 'Aluguel mínimo menor, variável sobre venda medida pela plataforma e pacote de mídia e dados incluído; cobrar por resultado, não só por m²; medir contra grupo de controle antes de escalar.',
    ex: 'Ilustrativo: uma loja de moda paga mínimo + 7% sobre vendas acima do ponto de equilíbrio. No piloto, o mínimo cai 20%, a variável sobe para 9% sobre vendas medidas (GMV + nota fiscal) e o contrato inclui VendaCerta e painel de fluxo. Se vende mais, a Allos ganha mais; se vende menos, perde pouco e tem dado para agir. O lojista fica preso por dados, não por obra.',
    passos: ['Desenho jurídico e financeiro do contrato', 'Piloto com 30 lojistas e grupo de controle', 'Regras de compartilhamento de dados com o lojista'],
    kpi: 'SSR do piloto vs controle; churn; share de GMV capturado; margem de mídia incremental' },
  { n: 9, title: 'Rebalancear o mix para categorias não agentizáveis',
    alvo: 'Fraqueza: comparáveis com SSS de 1–2%', poder: 'Marca por ativo + recurso encurralado', horizonte: '24–60 meses', resp: 'Locação + Desenvolvimento + Marketing/Eventos',
    desc: 'Meta por ativo de % de ABL em serviços, saúde, educação, gastronomia, lazer e eventos; replicar o Taste em áreas de baixa produtividade; pipeline de operadores de saúde e educação; bilheteria precificada por demanda.',
    ex: 'Serviços e Lazer crescem 6,5% vs Roupas 1,2%. O Taste (4 unidades) é o formato replicável; On Running, Fazenda Churrascada, Track & Field e Aramis mostram a direção. Em 2036, uma antiga âncora de eletrônicos vira polo de saúde com agendamento via Gateway; o São João vende ingresso e patrocínio por dado de intenção.',
    passos: ['Diagnóstico de mix por ativo e exposição a comparáveis; metas 2028', '5 reconversões de âncora e 2 novos Taste em 12 meses', 'Bilheteria dinâmica em 10 shoppings'],
    kpi: '% de ABL não agentizável; SSS de serviços e lazer; fluxo; receita de bilheteria e patrocínio' },
  { n: 10, title: 'Plataforma de gestão como produto para terceiros e FIIs',
    alvo: 'Oportunidade: monetizar o know-how antes que a IA o comoditize', poder: 'Escala + poder de processo', horizonte: '24–48 meses', resp: 'Desenvolvimento e Novos Negócios + COO + helloo',
    desc: 'Empacotar operação agêntica (7), camada de dados (5), Gateway (3) e mídia (4) como serviço de gestão para shoppings de terceiros e FIIs, começando pelo Kinea ALLOS Malls FII; precificar com variável sobre NOI e GMV.',
    ex: 'O FII compra ativos da cauda (ação 2) e contrata a plataforma: o shopping ganha pipeline de vacância, retail media e Gateway sem o custo fixo de uma companhia aberta. A Allos troca aluguel por taxa de gestão + mídia + dados, sem capital imobilizado. Um shopping independente de cidade média contrata o pacote para não ficar invisível aos agentes.',
    passos: ['Proposta de valor e precificação do serviço', 'Oferta aos 6 shoppings já administrados (207,6 mil m²)', 'FII como cliente-âncora; 10 shoppings de terceiros em 12 meses'],
    kpi: 'ABL administrada de terceiros; receita e margem de serviços de gestão; NOI gerido vs benchmark' },
];

// ---- Overview tables
const shortTitles = [
  'Envelope de capital da transição e comitê de IA no conselho',
  'Concentrar o portfólio nos ~20 ativos "destino"; sair da cauda',
  'Allos Agent Gateway: legível para agentes de IA',
  'Escalar o ciclo fechado de retail media (VendaCerta)',
  'Camada proprietária de dados e IA, multi-fornecedor',
  'Reconverter estacionamento antes da queda',
  'Operação agêntica: vacância, renovação, cobrança, atendimento',
  'Contrato híbrido por desempenho (piloto)',
  'Rebalancear o mix para categorias não agentizáveis',
  'Plataforma de gestão como produto para terceiros e FIIs',
];
const shortAlvo = ['Fraqueza: payout alto vs capex baixo', 'Fraqueza: cauda do portfólio exposta', 'Ameaça → oportunidade: comércio agêntico', 'Oportunidade: mídia já é 10,6% da receita', 'Fraqueza: dependência de provedores de IA', 'Fraqueza: 18% da receita em estacionamento', 'Oportunidade: SG&A de ~14% para um dígito', 'Oportunidade: contraposicionamento', 'Fraqueza: comparáveis com SSS 1–2%', 'Oportunidade: monetizar o know-how'];
const shortPoder = ['Habilitador de todas as demais', 'Recurso encurralado + escala', 'Rede + custos de troca', 'Rede + recurso encurralado (dado)', 'Recurso encurralado + escala', 'Terreno + contraposicionamento', 'Poder de processo + escala', 'Contraposicionamento + custos de troca', 'Marca por ativo + recurso encurralado', 'Escala + poder de processo'];
const alav = ['—', 'Reciclagem via FII', 'E-commerce agêntico', 'Retail media', '6ª alavanca', 'Expansão/retrofit', 'Gargalos H2/H3', 'Tributação / e-commerce', 'Mix; eventos', 'Reciclagem via FII'];
[[0, 5, 'As 10 ações, por prioridade: 1 a 5'], [5, 10, 'As 10 ações, por prioridade: 6 a 10']].forEach(([from, to, ttl]) => {
  const sv = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Plano de ação' });
  sv.addText(ttl, { placeholder: 'title' });
  const hdr = { bold: true, color: THEME.colors.lt1, fill: { color: THEME.colors.dk2 }, fontSize: 11, valign: 'middle' };
  const rows = [[
    { text: '#', options: { ...hdr, align: 'center' } }, { text: 'Ação', options: { ...hdr } }, { text: 'Alvo', options: { ...hdr } },
    { text: 'Poder de Helmer', options: { ...hdr } }, { text: 'Alavanca / gargalo', options: { ...hdr } }, { text: 'Horizonte', options: { ...hdr } },
  ]];
  actions.slice(from, to).forEach((a, i) => {
    const fill = i % 2 === 0 ? THEME.colors.lt1 : THEME.colors.lt2;
    const opt = { fontSize: 11, color: THEME.colors.dk1, fill: { color: fill }, valign: 'middle' };
    rows.push([
      { text: String(a.n), options: { ...opt, bold: true, color: THEME.colors.accent2, align: 'center', fontSize: 14 } },
      { text: shortTitles[from + i], options: { ...opt, bold: true, color: THEME.colors.dk2 } },
      { text: shortAlvo[from + i], options: { ...opt } },
      { text: shortPoder[from + i], options: { ...opt } },
      { text: alav[from + i], options: { ...opt } },
      { text: a.horizonte, options: { ...opt } },
    ]);
  });
  sv.addTable(rows, { x: 0.5, y: 1.1, w: 9.0, colW: [0.35, 2.75, 2.0, 1.7, 1.1, 1.1], rowH: [0.4, 0.7, 0.7, 0.7, 0.7, 0.7], border: { type: 'solid', pt: 0.5, color: THEME.colors.accent5 }, margin: 0.06, objectName: 'overview table ' + (from + 1) });
});

// ---- Action slides
actions.forEach((a) => {
  const sl = pres.addSlide({ masterName: 'ACTION', sectionTitle: 'Plano de ação' });
  sl.addText(a.title, { placeholder: 'title' });
  sl.addText(String(a.n).padStart(2, '0'), { x: 0.35, y: 0.3, w: 2.6, h: 0.9, fontSize: 48, bold: true, color: C.accent2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'action number' });
  const rows = [['ALVO', a.alvo, 1.35, 0.75], ['PODER DE HELMER', a.poder, 2.35, 0.6], ['HORIZONTE', a.horizonte, 3.2, 0.55], ['RESPONSÁVEL SUGERIDO', a.resp, 4.0, 0.9]];
  rows.forEach(([lab, val, y, h], i) => {
    label(sl, lab, 0.35, y, 2.6, 'label ' + (i + 1), true);
    sl.addText(val, { x: 0.35, y: y + 0.24, w: 2.6, h, fontSize: 11.5, bold: true, color: C.background1, margin: 0, isTextBox: true, valign: 'top', objectName: 'value ' + (i + 1) });
  });
  sl.addText(a.desc, { x: 3.65, y: 1.25, w: 5.85, h: 0.75, fontSize: 11, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'description' });
  label(sl, 'EXEMPLO PRÁTICO', 3.65, 2.07, 5.85, 'example label');
  sl.addText(a.ex, { x: 3.65, y: 2.3, w: 5.85, h: 1.05, fontSize: 10.5, italic: true, color: C.accent4, margin: 0, isTextBox: true, valign: 'top', objectName: 'example' });
  label(sl, 'PRIMEIROS 90 DIAS E MARCOS', 3.65, 3.42, 5.85, 'steps label');
  sl.addText(bullets(a.passos, 11, 2), { x: 3.65, y: 3.65, w: 5.85, h: 0.85, fontSize: 11, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'steps' });
  label(sl, 'KPI', 3.65, 4.55, 5.85, 'kpi label');
  sl.addText(a.kpi, { x: 3.65, y: 4.77, w: 5.85, h: 0.45, fontSize: 11, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: 'top', objectName: 'kpi' });
  sl.addNotes(`Ação ${a.n}: ${a.title}. Alvo: ${a.alvo}. Poder: ${a.poder}. Horizonte: ${a.horizonte}. Responsável sugerido: ${a.resp}.`);
});

// ---- Roadmap
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Plano de ação' });
s.addText('Sequenciamento em três ondas', { placeholder: 'title' });
const waves = [
  ['Onda 1 · Decidir e proteger', '0–12 meses', ['H2 · Playbooks com SLA', 'H1 · Academia de operação agêntica', '1 · Envelope de capital e comitê de IA', '2 · Concentrar o portfólio', '3 · Agent Gateway (MVP)', '4 · Escalar o VendaCerta'], 'Destravar capital e ocupar a interface com os agentes antes dos concorrentes.'],
  ['Onda 2 · Construir a plataforma', '12–36 meses', ['H3 · Pipeline de vacância', '5 · Camada de dados e IA', '6 · Projetos de reconversão', '7 · Operação agêntica', '8 · Contrato híbrido (piloto)', '9 · Rebalancear o mix'], 'Dado próprio, processos agênticos, novo contrato e novo mix.'],
  ['Onda 3 · Escalar', '36+ meses', ['6 · Execução da reconversão', '10 · Plataforma de gestão para terceiros'], 'Reconversão física e venda da plataforma de gestão.'],
];
waves.forEach((w, i) => {
  const x = 0.5 + i * 3.05;
  card(s, x, 1.1, 2.9, 4.0, 'wave card ' + (i + 1));
  badge(s, i + 1, x + 0.2, 1.3, 0.55, 'wave ' + (i + 1));
  s.addText(w[0], { x: x + 0.9, y: 1.28, w: 1.95, h: 0.6, fontSize: 13, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'wave title ' + (i + 1) });
  s.addText(w[1], { x: x + 0.2, y: 2.0, w: 2.5, h: 0.3, fontSize: 11, bold: true, color: C.accent2, margin: 0, isTextBox: true, objectName: 'wave period ' + (i + 1) });
  s.addText(bullets(w[2], 11, 3), { x: x + 0.2, y: 2.35, w: 2.5, h: 1.95, fontSize: 11, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'wave items ' + (i + 1) });
  s.addText(w[3], { x: x + 0.2, y: 4.35, w: 2.5, h: 0.7, fontSize: 10.5, italic: true, color: C.accent4, margin: 0, isTextBox: true, valign: 'top', objectName: 'wave goal ' + (i + 1) });
});

// ---- KPI table
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Plano de ação' });
s.addText('Painel de metas indicativas (hipóteses, não guidance)', { placeholder: 'title' });
const kh = { bold: true, color: THEME.colors.lt1, fill: { color: THEME.colors.dk2 }, fontSize: 11, valign: 'middle' };
const kpis = [
  ['SG&A / receita líquida', '~14%', '11%', '< 9%'],
  ['Estacionamento / receita líquida', '18%', '15%', '< 10%'],
  ['Mídia / receita total', '10,6%', '15%', '> 20%'],
  ['GMV capturado / vendas (base total)', '17%', '35%', '> 60%'],
  ['NOI nos top-20 ativos', 'n/d', '≥ 80%', '≥ 90%'],
  ['ABL em categorias não agentizáveis', 'n/d', '+10 p.p.', '+20 p.p.'],
  ['Visitas originadas por agentes de IA', '0%', '10%', '> 40%'],
  ['Dias médios de vacância (saída → inauguração)', 'n/d', '−30%', '−60%'],
  ['Shoppings por gestor regional', 'n/d', '+50%', '2x'],
];
const krows = [[{ text: 'Indicador', options: { ...kh } }, { text: '2T26', options: { ...kh, align: 'center' } }, { text: '2030', options: { ...kh, align: 'center' } }, { text: '2036', options: { ...kh, align: 'center' } }]];
kpis.forEach((r, i) => {
  const fill = i % 2 === 0 ? THEME.colors.lt1 : THEME.colors.lt2;
  const o = { fontSize: 11, color: THEME.colors.dk1, fill: { color: fill }, valign: 'middle' };
  krows.push([{ text: r[0], options: { ...o } }, { text: r[1], options: { ...o, align: 'center' } }, { text: r[2], options: { ...o, align: 'center' } }, { text: r[3], options: { ...o, align: 'center', bold: true, color: THEME.colors.dk2 } }]);
});
s.addTable(krows, { x: 0.5, y: 1.1, w: 9.0, colW: [4.2, 1.6, 1.6, 1.6], rowH: 0.36, border: { type: 'solid', pt: 0.5, color: THEME.colors.accent5 }, margin: 0.05, objectName: 'kpi table' });
s.addText('Metas são hipóteses minhas, derivadas do cenário 2036; o estacionamento cai, mas o solo reconvertido deve render mais do que a receita perdida.', { x: 0.5, y: 4.78, w: 9, h: 0.4, fontSize: 10.5, italic: true, color: C.accent6, margin: 0, isTextBox: true, valign: 'top', objectName: 'kpi note' });

// ======================================================================
pres.addSection({ title: 'Conclusão' });
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Conclusão' });
s.addText('Conclusão: cinco teses próprias', { placeholder: 'title' });
const teses = [
  ['A IA mata o shopping mediano, não o shopping', 'Dominantes capturam fluxo, atenção e terreno; secundários perdem satélites e estacionamento. Sair cedo da cauda, concentrar capex nos destinos.'],
  ['O valor migra do m² para a jornada', 'Três receitas — venda gerada, atenção verificada, terreno — sobre uma única base de dados. Plataforma digital e helloo são o sistema nervoso.'],
  ['O rival é o agente do consumidor', 'Quem decide "onde ir" é um software. Ser legível por ele, não só ter um app.'],
  ['Estacionamento é o passivo escondido', '18% da receita depende de carros que tendem a diminuir; o Taste do Tijuca prova que a reconversão funciona.'],
  ['Governança decide o ritmo', 'Payout alto e capex modesto não são racionais numa transição tecnológica. O conselho escolhe entre dividendo e capital de Inteligência.'],
];
teses.forEach((t, i) => {
  const col = i < 3 ? 0 : 1; const row = i < 3 ? i : i - 3;
  const x = 0.5 + col * 4.6, y = 1.1 + row * 1.35;
  card(s, x, y, 4.4, 1.2, 'tese card ' + (i + 1));
  badge(s, i + 1, x + 0.2, y + 0.3, 0.55, 'tese ' + (i + 1));
  s.addText(t[0], { x: x + 0.95, y: y + 0.1, w: 3.3, h: 0.35, fontSize: 12.5, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'tese title ' + (i + 1) });
  s.addText(t[1], { x: x + 0.95, y: y + 0.47, w: 3.3, h: 0.7, fontSize: 10.5, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'tese text ' + (i + 1) });
});
card(s, 5.1, 3.8, 4.4, 1.2, 'tese card mostaque', true);
s.addText('Na leitura de Mostaque: a diferença entre ser um nó físico e confiável da simbiose humana ou um inquilino do feudalismo digital.', { x: 5.3, y: 3.9, w: 4.0, h: 1.0, fontSize: 11, italic: true, color: C.background1, margin: 0, isTextBox: true, valign: 'middle', objectName: 'tese mostaque' });

// ---- Premissas, riscos e confiança
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Conclusão' });
s.addText('Premissas, riscos e confiança', { placeholder: 'title' });
card(s, 0.5, 1.1, 4.4, 2.9, 'premissas card');
label(s, 'PREMISSAS', 0.75, 1.25, 4.0, 'premissas label');
s.addText(bullets(['Cognição abundante e barata', 'Comércio agêntico domina categorias comparáveis', 'Juros reais brasileiros ainda altos', 'Dados físicos mais valiosos e mais regulados', 'Reforma tributária em transição até 2033'], 12, 4), { x: 0.75, y: 1.55, w: 4.0, h: 2.4, fontSize: 12, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'premissas' });
card(s, 5.1, 1.1, 4.4, 2.9, 'riscos card');
label(s, 'RISCOS DO PLANO', 5.35, 1.25, 4.0, 'riscos label');
s.addText(bullets(['Conselho não libera o envelope: o plano para na ação 1', 'Plataformas de agentes cobram "taxa de descoberta" e anulam a ação 3', 'Regulação de dados limita o ciclo fechado da ação 4', 'Estacionamento cai antes da reconversão da ação 6', 'Automatizar antes de padronizar (H2) amplifica erros em escala'], 12, 4), { x: 5.35, y: 1.55, w: 4.0, h: 2.4, fontSize: 12, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'riscos' });
card(s, 0.5, 4.2, 9.0, 0.85, 'confidence band', true);
s.addText([
  { text: 'Confiança: ', options: { bold: true, color: C.accent2 } },
  { text: '9/10 nos dados de base (fontes primárias) · ', options: { color: C.background1 } },
  { text: '6/10 no cenário, na priorização e nas metas', options: { bold: true, color: C.background1 } },
  { text: ' — sinalizado abaixo de 7: são juízos sobre dez anos, e os exemplos numéricos (envelope, contrato, prazos de vacância) são ilustrativos.', options: { color: C.background2 } },
], { x: 0.75, y: 4.2, w: 8.5, h: 0.85, fontSize: 12, margin: 0, isTextBox: true, valign: 'middle', objectName: 'confidence' });

// ---- Fontes
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Conclusão' });
s.addText('Fontes', { placeholder: 'title' });
s.addText(bullets([
  'Relatório de Resultados 2T26 — ALLOS (ri.allos.com.br)',
  'Composição acionária e Diretoria/Conselho — RI Allos (ri.allos.com.br)',
  'BlackRock atinge 5,1% — Acionista.com.br (out/2026)',
  'Conselho e diretoria — TradeMap (trademap.com.br/ativos/ALOS3)',
  'Resultado 2T26 e licitação Aena — Estadão/Acessa (ago/2026)',
  'helloo lança VendaCerta — Nosso Meio (jun/2026)',
  'Sobre a empresa — Investidor10 (investidor10.com.br/acoes/alos3)',
  'Reforma tributária e locação — Contábeis (contabeis.com.br)',
  '7 Powers — síntese ThinkInsights; The Last Economy — ii.inc e SoBrief',
  'Diagramas fornecidos por Daniel: "Ciclo de vida do shopping center" e "Gargalos operacionais na execução da estratégia"',
], 12, 5), { x: 0.5, y: 1.15, w: 9.0, h: 3.9, fontSize: 12, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'fontes' });

(async () => {
  await pres.writeFile({ fileName: 'allos-2036-relatorio-completo.pptx' });
  await applyTheme('allos-2036-relatorio-completo.pptx', THEME);
  console.log('ok');
})();
