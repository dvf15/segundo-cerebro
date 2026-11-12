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
pres.layout = 'LAYOUT_16x9';
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.author = 'Claude';
pres.title = 'Allos 2036 - Visão de futuro sob a lente da IA';
const C = pres.SchemeColor;
const FOOT = 'Allos 2036 · Visão de futuro e plano de ação · out/2026';

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
  title: 'CONTENT',
  background: { color: THEME.colors.lt1 },
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 0.5, y: 0.3, w: 9.0, h: 0.65, fontSize: 22, bold: true, color: C.text2, valign: 'middle', margin: 0 }, text: '' } },
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
function tbl(slide, header, body, x, y, w, colW, name, fs, boldFirst) {
  fs = fs || 11;
  const hdr = { bold: true, color: THEME.colors.lt1, fill: { color: THEME.colors.dk2 }, fontSize: fs, valign: 'middle' };
  const rows = [header.map((h) => ({ text: h, options: { ...hdr } }))];
  body.forEach((r, i) => {
    const fill = i % 2 === 0 ? THEME.colors.lt1 : THEME.colors.lt2;
    rows.push(r.map((c, j) => {
      const o = { fontSize: fs, color: THEME.colors.dk1, fill: { color: fill }, valign: 'middle' };
      if (j === 0 && boldFirst !== false) { o.bold = true; o.color = THEME.colors.dk2; }
      return { text: c, options: o };
    }));
  });
  slide.addTable(rows, { x, y, w, colW, border: { type: 'solid', pt: 0.5, color: THEME.colors.accent5 }, margin: 0.05, objectName: name });
}

/*ACTIONS*/

// ======================================================================
pres.addSection({ title: 'Visão de futuro' });
let s = pres.addSlide({ masterName: 'TITLE_DARK', sectionTitle: 'Visão de futuro' });
s.addText('Allos 2036 — Visão de futuro sob a lente da IA', { placeholder: 'title' });
s.addText('Cenário, análise e plano de ação com 15 movimentos priorizados — investimento, ganho potencial, preparação do time e riscos por ação. Lentes: primeiros princípios, 7 Powers (Helmer), The Last Economy (Mostaque) e Zero a Um (Thiel). Base: Relatório de Resultados 2T26 da ALLOS.', { placeholder: 'body' });
s.addNotes('Relatório elaborado por Claude a pedido de Daniel. Cenários, estimativas e metas são hipóteses sinalizadas.');

// ---- Sumário executivo
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Visão de futuro' });
s.addText('Sumário executivo: a tese e seis conclusões', { placeholder: 'title' });
card(s, 0.5, 1.05, 9.0, 0.75, 'thesis band', true);
s.addText([{ text: 'Tese: ', options: { bold: true, color: C.accent2 } }, { text: 'a IA não ameaça a Allos como dona de imóveis dominantes; ameaça a Allos como cobradora de m². A cognição fica barata; o físico, o local e a confiança ficam escassos. O aluguel é cobrado no ponto de estrangulamento entre marcas e consumidores — e a IA está movendo esse ponto.', options: { color: C.background1 } }], { x: 0.7, y: 1.05, w: 8.6, h: 0.75, fontSize: 11.5, margin: 0, isTextBox: true, valign: 'middle', objectName: 'thesis' });
const exec = [
  ['A unidade de monopólio é a praça', 'A IA polariza: seis pressões encurtam o ciclo dos secundários; seis camadas alongam o dos dominantes. Thiel: dominar um mercado pequeno — a praça — antes de "liderar o Brasil".'],
  ['O produto não é m²; é atenção verificada + conversão comprovada', 'O único 10x do plano é o ciclo fechado dado → mídia → venda (VendaCerta). Telas, apps e CPM são copiáveis; venda comprovada não é.'],
  ['O rival é o agente do consumidor', 'Quem decide "onde ir" será um software. O Gateway é a corrida pelo novo chokepoint — a Allos deve ser a última e definitiva interface, não a primeira.'],
  ['Estacionamento é passivo; terreno e nó logístico são a opção', '18% da receita vem de vagas que tendem a sumir; o solo liberado vira adensamento, saúde, educação e hub de last-mile.'],
  ['Distribuição, execução e fundações decidem o ritmo', 'Thiel: vendas valem tanto quanto produto; fundação errada não se conserta. Dono único do dado, motor comercial B2B e padronizar antes de automatizar.'],
  ['O plano em números (hipóteses)', '15 ações, 5 delas apostas de lei de potência. Ações 2–15: ~R$ 150–250 mi/ano de capex e opex; ganho de ~R$ 450–550 mi/ano de EBITDA em 2030–32 (20–25% do EBITDA de 2026), com sobreposições.'],
];
exec.forEach((e, i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const x = 0.5 + col * 3.05, y = 1.95 + row * 1.6;
  card(s, x, y, 2.9, 1.45, 'exec card ' + (i + 1));
  badge(s, i + 1, x + 0.15, y + 0.15, 0.42, 'exec ' + (i + 1));
  s.addText(e[0], { x: x + 0.68, y: y + 0.08, w: 2.1, h: 0.56, fontSize: 10, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'exec title ' + (i + 1) });
  s.addText(e[1], { x: x + 0.15, y: y + 0.68, w: 2.6, h: 0.74, fontSize: 8.5, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'exec text ' + (i + 1) });
});

// ---- Premissas e três lentes
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Visão de futuro' });
s.addText('Premissas do cenário 2036 e as lentes usadas', { placeholder: 'title' });
card(s, 0.5, 1.05, 4.2, 4.05, 'prem card');
label(s, 'SEIS TRAJETÓRIAS DE IA ASSUMIDAS', 0.7, 1.2, 3.8, 'prem label');
s.addText(bullets([
  'Agentes fazem o trabalho cognitivo corporativo a custo marginal ~zero',
  'Comércio agêntico: comparáveis delegados; compra social e experiencial resiste',
  'Logística autônoma desvaloriza a conveniência; saúde, educação e lazer valorizam',
  'Conteúdo infinito desvaloriza a atenção digital; atenção física verificada vira ativo raro',
  'Dados físicos mais valiosos e mais regulados; consentimento mediado por agentes',
  'Juros reais altos permanecem; efeito da IA sobre renda da classe média é a maior incógnita',
], 10.5, 5), { x: 0.7, y: 1.5, w: 3.8, h: 3.5, fontSize: 10.5, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'prem text' });
const lenses = [
  ['PRIMEIROS PRINCÍPIOS', 'Decompor o shopping em funções fundamentais e perguntar o que a IA obsoleta, preserva ou valoriza em cada uma — sem analogia com o e-commerce.', false],
  ['7 POWERS · HELMER', 'Poder = benefício + barreira: escala, rede, contraposicionamento, custos de troca, marca, recurso encurralado, processo. Teste de durabilidade.', false],
  ['THE LAST ECONOMY · MOSTAQUE', 'IA é a 4ª inversão de valor; capitais Material, Inteligência, Rede e Diversidade. Separa o não copiável (Material) do comoditizável.', true],
  ['ZERO A UM · THIEL', 'Monopólio, não competição; comece pequeno; tecnologia 10x; segredos; distribuição; lei de potência; fundações; otimismo definido.', true],
];
lenses.forEach((l, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = 4.9 + col * 2.35, y = 1.05 + row * 2.1;
  card(s, x, y, 2.25, 1.95, 'lens card ' + (i + 1), l[2]);
  label(s, l[0], x + 0.15, y + 0.12, 2.0, 'lens label ' + (i + 1), l[2]);
  s.addText(l[1], { x: x + 0.15, y: y + 0.4, w: 1.98, h: 1.5, fontSize: 9.5, color: l[2] ? C.background1 : C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'lens text ' + (i + 1) });
});

// ---- Primeiros princípios e segredos
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Visão de futuro' });
s.addText('Primeiros princípios: o que o shopping é, e os três segredos de Thiel', { placeholder: 'title' });
card(s, 0.5, 1.05, 4.4, 4.05, 'fp card');
label(s, 'O SHOPPING DECOMPOSTO EM CINCO FUNÇÕES — E O QUE A IA FAZ', 0.7, 1.2, 4.0, 'fp label');
tbl(s, ['Função', 'Sob IA'], [
  ['Terreno + edifício numa localização', 'Mais valioso: escassez do físico'],
  ['Agregar demanda e reduzir custo de busca', 'Busca vai a zero no agente; sobrevive a agregação do que não é remoto'],
  ['Capturar renda no chokepoint marca ↔ consumidor', 'O chokepoint muda: o agente é o novo pedágio'],
  ['Serviços: clima, limpeza, segurança, vagas', 'Mais barato (automação); segurança vira atributo'],
  ['Confiança e marca do lugar', 'Mais valiosa: com oferta infinita, marca é confiança'],
], 0.7, 1.5, 4.0, [1.7, 2.3], 'fp table', 9, true);
s.addText('Conclusão: a Allos tem um chokepoint físico não copiável e disputa um chokepoint digital (relação e dado). O plano inteiro é ocupar o segundo antes do agente — e cobrar a renda nele.', { x: 0.7, y: 4.2, w: 4.0, h: 0.85, fontSize: 9.5, italic: true, color: C.accent4, margin: 0, isTextBox: true, valign: 'top', objectName: 'fp conclusion' });
card(s, 5.1, 1.05, 4.4, 2.75, 'secrets card', true);
label(s, '"QUE VERDADE IMPORTANTE POUCOS CONCORDAM?" — TRÊS SEGREDOS', 5.3, 1.17, 4.0, 'secrets label', true);
s.addText([
  { text: '1. ', options: { bold: true, color: C.accent2 } }, { text: 'O produto do shopping não é m²; é atenção física verificada + conversão comprovada. O lojista pagará mais por isso que por área — e o mercado ainda precifica shopping como imóvel.', options: { breakLine: true, paraSpaceAfter: 4 } },
  { text: '2. ', options: { bold: true, color: C.accent2 } }, { text: 'O concorrente de 2036 é o agente do consumidor, não o e-commerce. Só uma rede física por praça pode ser a resposta-padrão de "onde ir": um monopólio local a ocupar, não uma ameaça a defender.', options: { breakLine: true, paraSpaceAfter: 4 } },
  { text: '3. ', options: { bold: true, color: C.accent2 } }, { text: 'O estacionamento é o maior banco de terrenos urbanos bem localizados do Brasil, escondido como linha de receita.' },
], { x: 5.3, y: 1.45, w: 4.0, h: 2.3, fontSize: 9.5, color: C.background1, margin: 0, isTextBox: true, valign: 'top', objectName: 'secrets text' });
card(s, 5.1, 3.95, 4.4, 1.15, 'definite card');
label(s, 'OTIMISMO DEFINIDO: A FRASE DE 2036', 5.3, 4.05, 4.0, 'definite label');
s.addText('"Em 2036 a Allos é a resposta física padrão do agente do consumidor em 20 praças, cobra do lojista por conversão comprovada, da marca por atenção verificada e do incorporador pelo solo que o carro deixou livre — e é a gestora dos shoppings que não são seus."', { x: 5.3, y: 4.3, w: 4.0, h: 0.78, fontSize: 9, italic: true, color: C.text2, margin: 0, isTextBox: true, valign: 'top', objectName: 'definite text' });

// ---- Allos hoje: 8 números
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Visão de futuro' });
s.addText('Allos hoje: oito números do 2T26', { placeholder: 'title' });
const stats = [
  ['46', 'shoppings em 16 estados; 1,26 mi m² de ABL própria; ocupação 96,2%'],
  ['R$ 732 mi', 'receita líquida no trimestre (+11,6%); 63% é aluguel'],
  ['R$ 341 mi', 'FFO (+12,0%); EBITDA R$ 525 mi, margem 71,7%'],
  ['1,7x', 'dívida líquida/EBITDA; custo CDI + 0,57%; 98% em CDI'],
  ['10,6%', 'da receita é mídia (+84,5% a/a); helloo em 17 aeroportos da Aena'],
  ['R$ 1,56 bi', 'GMV capturado no trimestre (+31%); +15% de frequência pós-adesão'],
  ['18%', 'da receita líquida vem de estacionamento (R$ 133 mi no trimestre)'],
  ['1,74 mi m²', 'de área privativa multiúso disponível; 72 torres assinadas'],
];
stats.forEach((st, i) => {
  const col = i % 4, row = Math.floor(i / 4);
  const x = 0.5 + col * 2.3, y = 1.1 + row * 2.0;
  card(s, x, y, 2.1, 1.85, 'stat card ' + (i + 1));
  s.addText(st[0], { x: x + 0.15, y: y + 0.12, w: 1.85, h: 0.7, fontSize: 24, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'stat value ' + (i + 1) });
  s.addText(st[1], { x: x + 0.15, y: y + 0.85, w: 1.85, h: 0.95, fontSize: 10.5, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'stat label ' + (i + 1) });
});

// ======================================================================
pres.addSection({ title: 'Análise' });
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
s.addText('Ganhos e perdas prováveis em 2036, por frente', { placeholder: 'title' });
tbl(s, ['Frente', 'Ganhos prováveis', 'Perdas prováveis'], [
  ['Portfólio', 'Localizações dominantes viram recurso encurralado mais raro. Menos carros liberam estacionamento e terreno para multiúso (1,74 mi m²). Aluguel por desempenho medido em tempo real.', 'Categorias comparáveis (SSS 1–2%) migram para agentes de compra; satélites perdem viabilidade nos secundários. Estacionamento pode cair 30–50% em dez anos (hipótese).'],
  ['Relacionamento + helloo', 'Dado físico proprietário vira ativo escasso quando o digital é sintético. Ciclo fechado mídia → oferta → venda comprovada é o modelo mais defensável; IA zera o custo de segmentação.', 'O agente pessoal se interpõe entre marca e cliente; plataformas de agentes cobram "taxa de descoberta". CPMs genéricos caem com programática; telas são copiáveis, o dado não.'],
  ['Gestão e finanças', 'SG&A de ~14% para um dígito; agentes fazem underwriting, renovação e cobrança. Plataforma de gestão vira produto para terceiros e FIIs. Balanço a 1,7x financia a transição.', 'Know-how se comoditiza; taxa de administração encolhe. Lojistas pressionam por aluguel variável — mais volatilidade de NOI. Dependência de 2–3 provedores de IA. Sem queda de juros, o múltiplo não re-rateia.'],
  ['Governança', 'Capital pulverizado com institucionais de longo prazo favorece alocação por retorno. Conselho pode supervisionar IA como fez com ESG.', 'Payout de ~R$ 1,7 bi/ano vs capex de R$ 350–450 mi: a política de dividendos vira o gargalo da transição. Conselho sem competência em IA delega decisões algorítmicas sem accountability.'],
], 0.5, 1.05, 9.0, [1.5, 3.75, 3.75], 'gains table', 10);

// ---- Ciclo de vida: imagem + leitura
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
s.addText('Ciclo de vida: seis pressões encurtam, seis camadas alongam', { placeholder: 'title' });
s.addImage({ path: 'assets/ciclo-de-vida-v2.png', x: 1.55, y: 1.0, w: 6.9, h: 3.85, objectName: 'diagrama ciclo de vida' });
s.addText('Sob IA, as duas curvas viram destinos: secundários vão para a encurtada, dominantes para a alongada. As camadas deixam de ser sequenciais e passam a ser empilhadas em paralelo; dados e agentes são a argamassa entre elas. Para a cauda, a camada certa é a última (FII), aplicada cedo.', { x: 0.5, y: 4.88, w: 9.0, h: 0.38, fontSize: 9, italic: true, color: C.accent4, margin: 0, isTextBox: true, valign: 'top', objectName: 'ciclo note' });
s.addNotes('Diagrama fornecido por Daniel (versão 2): Painel 1 — seis variáveis de pressão de mercado; Painel 2 — construção de valor em seis camadas, da base (mídia aeroportos e home) ao topo (reciclagem via FII Kinea).');

// ---- Pressões
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
s.addText('As seis pressões de mercado: o que a IA faz com cada uma', { placeholder: 'title' });
tbl(s, ['Pressão', 'Como a IA a transforma', 'Exposição da Allos', 'Resposta'], [
  ['1. Concorrência e ABL', 'De "mais m²" para "mais destinos"; cognição barata nivela a gestão. ABL nova fere o secundário, não o dominante.', 'Média: vacância concentrada (Brasília 84,7%, Tijuca 90,2%, Passeio 91,5%)', 'Ações 3, 12 e 13'],
  ['2. E-commerce e digitalização', 'Vira comércio agêntico: o agente compra o comparável e decide "onde ir". A pressão migra da venda para a descoberta.', 'Alta em comparáveis (Roupas 1,2%); baixa em serviços e lazer (6,5%)', 'Ações 6, 4, 13 e 14'],
  ['3. Carga tributária', 'Reforma (2026–33; redutor de 70% para locação) muda a mecânica; IA reduz compliance, não a alíquota.', 'Média: custo de ocupação de 10,3% limita repasse', 'Ações 8 e 9'],
  ['4. Entraves regulatórios', 'Agentes montam dossiês em horas; o rito municipal segue humano. O gargalo migra para o Estado.', 'Alta no multiúso (72 torres; alvarás do Dom Pedro)', 'Ação 11 + H2'],
  ['5. Insegurança / criminalidade', 'Visão computacional e segurança preditiva baixam o custo de proteger; o shopping vira o "espaço seguro" vs a rua — pressão que vira atributo de marca.', 'Alta nas praças urbanas densas (RJ, SP, Nordeste); custo de condomínio sobe', 'Ações 8 e 13'],
  ['6. Recessão e PIB abaixo da inflação', 'Se a produtividade da IA não virar renda, o consumo presencial cai. Serviços essenciais resistem.', 'Alta: 63% da receita é aluguel; 98% da dívida em CDI', 'Ações 1, 3 e 13'],
], 0.5, 1.05, 9.0, [1.7, 3.5, 2.6, 1.2], 'pressoes table', 10);

// ---- Camadas
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
s.addText('As seis camadas de valor: como a IA amplifica cada uma', { placeholder: 'title' });
tbl(s, ['Camada (base → topo)', 'Como a IA a amplifica', 'Já visível na Allos', 'Ação'], [
  ['1. Mídia aeroportos e home', 'Atração de fluxo qualificado de fora para dentro; audiência verificada ganha prêmio quando o digital é sintético.', '17 aeroportos da Aena (incl. Congonhas); telas em edifícios residenciais na Copa', '4'],
  ['2. Expansão, adensamento e retrofit', 'Projeto e obra mais baratos; reconversão de área improdutiva (estacionamento) em uso que a IA valoriza.', 'Taste no Tijuca: 2.167 m² de ex-estacionamento, R$ 5 mi no 1º mês; 5 torres em Maceió', '11 e 14'],
  ['3. Mix transformacional', 'Modelos próprios escolhem o mix; agentes prospectam marcas (Hunter, Farmer, Builder).', 'On Running (Leblon), Fazenda Churrascada (Tamboré), Adidas (VillaLobos)', '13, 9 e 8'],
  ['4. Retail media e mídia digital', 'Segmentação e criação a custo zero; ciclo fechado mídia → oferta → venda comprovada.', 'VendaCerta (R$ 11,50 por R$ 1); Copa com C6, Coca-Cola, Hyundai', '4, 7 e 6'],
  ['5. Eventos, feiras e bilheteria', 'Experiência ao vivo é o que o agente não substitui; preço por demanda; evento vira dado de intenção.', 'Figurinhas da Copa em 45 shoppings; São João com Boticário, Natura, TIM', '13 e 10'],
  ['6. Reciclagem via FII Kinea', 'Valuation por ativo com fluxo e GMV reais; saída da cauda sem desconto de opacidade; a Allos fica como gestora.', 'Kinea ALLOS Malls FII (até R$ 2 bi); Curitiba a 9,6%', '3 e 15'],
  ['Argamassa: dados e agentes', 'Liga as camadas; sem dado proprietário e processo agêntico, cada camada é copiável.', 'GMV R$ 1,56 bi/tri; 17,1 mi de sessões; +15% de frequência', '2, 5 e 8'],
], 0.5, 1.05, 9.0, [1.9, 3.3, 3.0, 0.8], 'alavancas table', 10);

// ---- Fatores
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
s.addText('Fatores externos e internos: o que fortalece e o que enfraquece', { placeholder: 'title' });
const fat = [
  ['EXTERNOS · FORTALECEM', ['Escassez do físico e do local concentra a renda', 'Rejeição ao conteúdo genérico de IA valoriza a atenção física', 'Adensamento urbano: shopping como centralidade', 'Consolidação do setor dilui o custo fixo de IA']],
  ['EXTERNOS · ENFRAQUECEM', ['Comércio agêntico e logística autônoma', 'Juros reais altos: dívida 98% em CDI', 'Plataformas de agentes com "taxa de descoberta"', 'Regulação de dados e consentimento mediado', 'Insegurança urbana: custo sobe, mas vira atributo', 'Incertos: reforma tributária; renda da classe média']],
  ['INTERNOS · FORTALECEM', ['46 ativos dominantes: recurso encurralado + escala', 'Dado físico proprietário: GMV R$ 1,56 bi/tri', 'Ciclo fechado mídia → oferta → venda (helloo + CRM)', 'Pipeline multiúso de 1,74 mi m²; balanço a 1,7x', 'Governança pulverizada com institucionais']],
  ['INTERNOS · ENFRAQUECEM', ['Estacionamento: 18% da receita líquida', 'Mix comparável com SSS 1–2%', 'Payout ~R$ 1,7 bi/ano vs capex R$ 350–450 mi', 'Dependência de poucos provedores de IA; dado sem dono único', 'Sem motor de distribuição B2B para vender resultado', 'Gargalos: pessoas, processos instáveis, vacância artesanal']],
];
fat.forEach((f, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = 0.5 + col * 4.6, y = 1.05 + row * 2.1;
  card(s, x, y, 4.4, 1.95, 'fat card ' + (i + 1), col === 1);
  label(s, f[0], x + 0.2, y + 0.12, 4.0, 'fat label ' + (i + 1), col === 1);
  s.addText(bullets(f[1], 10, 2), { x: x + 0.2, y: y + 0.38, w: 4.0, h: 1.5, fontSize: 10, color: col === 1 ? C.background1 : C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'fat text ' + (i + 1) });
});

// ---- Sete poderes
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
s.addText('Os sete poderes de Helmer na Allos: 2026 vs 2036', { placeholder: 'title' });
tbl(s, ['Poder', '2026', '2036 (tendência)'], [
  ['Recurso encurralado', 'Forte: localizações dominantes em 16 estados', 'Mais forte: o físico não se copia; justifica concentrar capital'],
  ['Economias de escala', 'Moderada: 46 ativos, SG&A em queda', 'Mais forte: custo fixo de IA e dados dilui melhor; mais fluxo treina melhor'],
  ['Economias de rede', 'Incipiente: helloo + Programa de Benefícios', 'Decisiva e incerta: forte se o ciclo fechado virar padrão; fraca se agentes mediarem'],
  ['Custos de troca', 'Moderada no lojista; baixa no consumidor', 'Cai no lojista (contratos curtos); sobe no consumidor se integrado ao agente pessoal'],
  ['Marca', 'Forte por ativo; irrelevante como corporação', 'Mais importante: com oferta infinita, marca é confiança — a do shopping'],
  ['Contraposicionamento', 'Inexistente', 'Oportunidade: escada de contratos — cobrar por venda comprovada sem virar varejista (≠ El Corte Inglés)'],
  ['Poder de processo', 'Fraco: operação artesanal', 'O mais disputado: só vira poder se embutido em dados exclusivos e no dia a dia'],
], 0.5, 1.05, 9.0, [1.9, 2.9, 4.2], 'powers table', 10.5);
s.addText('Thiel descreve o monopólio por quatro traços — tecnologia 10x, efeitos de rede, economias de escala e marca — que coincidem com recurso encurralado/processo, rede, escala e marca de Helmer. O 10x do plano é o ciclo fechado de mídia; os demais poderes só se sustentam se forem o único por praça.', { x: 0.5, y: 4.62, w: 9, h: 0.55, fontSize: 9, italic: true, color: C.accent4, margin: 0, isTextBox: true, valign: 'top', objectName: 'powers note' });

// ---- Sete perguntas de Thiel
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
s.addText('As sete perguntas de Thiel (Zero a Um) aplicadas à Allos 2036', { placeholder: 'title' });
tbl(s, ['Pergunta', 'Resposta hoje', 'O que o plano faz'], [
  ['1. Engenharia: tecnologia 10x ou melhoria incremental?', 'Parcial. O ciclo fechado mídia → venda comprovada é 10x vs CPM; o resto é "melhor", não 10x.', 'Ações 4 e 5 concentram o 10x no ciclo fechado; o Gateway só é 10x se for o único por praça.'],
  ['2. Timing: agora é a hora?', 'Sim. Agentes de consumo emergem em 2026–29; a janela fecha quando as plataformas cobrarem pedágio.', 'Ação 6 em 12 meses (last mover, não first mover); ação 1 destrava o capital agora.'],
  ['3. Monopólio: grande fatia de um mercado pequeno?', 'Sim nos dominantes, por praça; não na cauda nem "no Brasil".', 'Ações 3 e 12: concentrar nos ~20 e medir share da praça, não só SSS.'],
  ['4. Pessoas: o time certo?', 'Ainda não: operação artesanal, conselho sem IA, sem perfil de orquestrador.', 'H1, ações 1 (conselho), 2 (incentivos) e 8 (Academia).'],
  ['5. Distribuição: como entregar, não só criar?', 'Lacuna. 13 mil lojistas e 100 marcas não compram resultado sozinhos.', 'Ação 7: motor comercial B2B (inside sales + key accounts).'],
  ['6. Durabilidade: defensável em 10–20 anos?', 'Sim no físico; incerta no dado (dispersos entre sócios, helloo, FII).', 'Ação 2 (dono único do dado) e 5 (camada proprietária).'],
  ['7. Segredo: oportunidade que outros não veem?', 'Três: atenção verificada > m²; o agente como monopólio local a ocupar; estacionamento como banco de terrenos.', 'Ações 4, 6 e 11 — nenhum dos três está precificado pelo mercado.'],
], 0.5, 1.05, 9.0, [2.5, 3.2, 3.3], 'thiel table', 9.5);

// ---- Gargalos: imagem
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
s.addText('Gargalos operacionais na execução da estratégia', { placeholder: 'title' });
s.addImage({ path: 'assets/gargalos.jpg', x: 1.2, y: 1.05, w: 7.6, h: 4.13, objectName: 'diagrama gargalos' });
s.addNotes('Diagrama fornecido por Daniel: escassez de pessoas capacitadas; instabilidade nos processos; gestão artesanal da vacância.');

// ---- Habilitadores
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
s.addText('Os três gargalos sob IA: habilitadores antes das alavancas', { placeholder: 'title' });
const garg = [
  ['H1 · Pessoas', 'A IA alivia a quantidade e eleva o perfil: o escasso passa a ser quem orquestra agentes, lê dados e negocia. Thiel: a máquina complementa, não substitui.', 'Academia Allos de Operação Agêntica: trilha de 6 meses; cada gestor com copilotos; carreira de "orquestrador" (4 → 7–8 shoppings por gestor, hipótese); ILP atrelado à transição (ação 2).', 'Shoppings por gestor; % de decisões com dossiê de agente'],
  ['H2 · Processos', 'Agentes amplificam a variância de processos instáveis. Padronizar antes de automatizar.', 'Playbooks com SLA por processo (renovação, vacância, obra, cobrança, licenciamento); cada playbook é a especificação do agente que o executará.', '% de processos com playbook e SLA; variância de prazo'],
  ['H3 · Vacância', 'Maior retorno imediato: o ciclo saída → inauguração vira pipeline previsto e orquestrado.', 'Churn por loja + prospecção por agentes (Hunter) + matching (Farmer/Alavancador) + kit de obra e licenças (Builder). Ex.: nova loja em 45 dias, não 120 (ilustrativo).', 'Dias de vacância; NOI perdido; % de saídas previstas'],
];
garg.forEach((g, i) => {
  const x = 0.5 + i * 3.05;
  card(s, x, 1.05, 2.9, 4.05, 'garg card ' + (i + 1));
  s.addText(g[0], { x: x + 0.2, y: 1.15, w: 2.5, h: 0.35, fontSize: 13, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'garg title ' + (i + 1) });
  label(s, 'DIAGNÓSTICO', x + 0.2, 1.55, 2.5, 'garg l1 ' + (i + 1));
  s.addText(g[1], { x: x + 0.2, y: 1.77, w: 2.5, h: 0.95, fontSize: 9.5, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'garg t1 ' + (i + 1) });
  label(s, 'HABILITADOR', x + 0.2, 2.75, 2.5, 'garg l2 ' + (i + 1));
  s.addText(g[2], { x: x + 0.2, y: 2.97, w: 2.5, h: 1.4, fontSize: 9.5, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'garg t2 ' + (i + 1) });
  label(s, 'KPI', x + 0.2, 4.4, 2.5, 'garg l3 ' + (i + 1));
  s.addText(g[3], { x: x + 0.2, y: 4.62, w: 2.5, h: 0.45, fontSize: 9.5, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: 'top', objectName: 'garg t3 ' + (i + 1) });
});

// ======================================================================
pres.addSection({ title: 'Plano de ação' });
const shortTitles = [
  'Envelope de capital e comitê de IA no conselho',
  'Um dono do cliente e do dado (fundações + ILP)',
  'Concentrar nos ~20 monopólios locais; sair da cauda',
  'Retail media de ciclo fechado (VendaCerta) — o 10x',
  'Camada proprietária de dados e IA, multi-fornecedor',
  'Allos Agent Gateway: interface definitiva com agentes',
  'Motor comercial B2B: vender resultado a lojistas e marcas',
  'Operação agêntica: vacância, renovação, cobrança',
  'Escada de contratos: teste → corner → híbrido → destino',
  'Yield management do inventário (mall, mídia, vagas, eventos)',
  'Reconverter estacionamento: adensamento e retrofit',
  'Gestão por praça: share e P&L por área de influência',
  'Rebalancear mix, eventos e segurança como atributo',
  'Hub de last-mile e mobilidade no estacionamento',
  'Plataforma de gestão para terceiros e FIIs',
];
const shortInv = [
  'Envelope R$ 220–330 mi/ano × 5 anos',
  'Opex R$ 2–5 mi; sem capex',
  'Transação 1–2% (R$ 10–40 mi); capex realocado',
  'Opex R$ 10–20 mi/ano; capex < R$ 5 mi',
  'Capex R$ 30–50 mi; opex R$ 15–25 mi/ano',
  'Capex R$ 15–30 mi; opex R$ 5–10 mi/ano',
  'Opex R$ 15–25 mi/ano (parte realocada)',
  'Capex R$ 10–20 mi; opex R$ 13–25 mi/ano',
  'Opex R$ 2–4 mi; capex R$ 5–10 mi',
  'Capex R$ 10–20 mi; opex R$ 5–8 mi/ano',
  'R$ 10–20 mi + capex R$ 150–400 mi (2029–34)',
  'Opex R$ 3–5 mi/ano; sem capex',
  'Capex R$ 50–100 mi/ano (no guidance)',
  'Capex R$ 20–40 mi; opex R$ 5–10 mi/ano',
  'Opex R$ 5–10 mi/ano',
];
const shortGain = [
  'Habilitador; não fazer ≈ R$ 20 mi/ano por p.p.',
  'Habilitador; protege o ganho de 4 e 6',
  'R$ 1–2 bi liberados; +R$ 15–25 mi/ano NOI',
  '+R$ 60–90 mi/ano de EBITDA',
  'Multiplicador; ~R$ 11 mi/ano em PDD',
  '+R$ 15–30 mi/ano; evita pedágio de 5–15%',
  'Destrava a 4: +R$ 20–30 mi por 10 p.p. adoção',
  '~R$ 110 mi/ano; ~R$ 150 mi em 2036',
  '~R$ 18 mi (SSR) + ~R$ 70 mi (mall) /ano',
  '+5–10% de R$ 1,1 bi ≈ R$ 55–110 mi/ano',
  'Protege ~R$ 510 mi; +R$ 80 mi/ano locação',
  '+2 p.p. de share ≈ R$ 40–60 mi/ano',
  '~R$ 50 mi/ano; +0,5 p.p. de SSS',
  'Opção: R$ 20–40 mi/ano até 2032',
  '~R$ 30–50 mi/ano com 300 mil m²',
];
const hz = ['1', '1', '1', '1', '1–2', '1', '1–2', '2', '2', '2', '2–3', '2', '2', '2–3', '3'];
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Plano de ação' });
s.addText('As 15 ações, por prioridade: tipo de aposta, investimento e ganho potencial', { placeholder: 'title' });
{
  const hdr = { bold: true, color: THEME.colors.lt1, fill: { color: THEME.colors.dk2 }, fontSize: 8.5, valign: 'middle' };
  const rows = [[
    { text: '#', options: { ...hdr, align: 'center' } }, { text: 'Ação', options: { ...hdr } }, { text: 'Tipo', options: { ...hdr, align: 'center' } },
    { text: 'Investimento (capex / opex)', options: { ...hdr } }, { text: 'Ganho potencial (run-rate 2030)', options: { ...hdr } }, { text: 'Onda', options: { ...hdr, align: 'center' } },
  ]];
  actions.forEach((a, i) => {
    const fill = i % 2 === 0 ? THEME.colors.lt1 : THEME.colors.lt2;
    const opt = { fontSize: 8, color: THEME.colors.dk1, fill: { color: fill }, valign: 'middle' };
    rows.push([
      { text: String(a.n), options: { ...opt, bold: true, color: THEME.colors.accent2, align: 'center', fontSize: 9 } },
      { text: shortTitles[i], options: { ...opt, bold: true, color: THEME.colors.dk2 } },
      { text: a.tag, options: { ...opt, bold: true, align: 'center', color: a.tag === '★' ? THEME.colors.accent2 : THEME.colors.dk2 } },
      { text: shortInv[i], options: { ...opt } },
      { text: shortGain[i], options: { ...opt, bold: true, color: THEME.colors.accent4 } },
      { text: hz[i], options: { ...opt, align: 'center' } },
    ]);
  });
  const rh = [0.27]; for (let i = 0; i < 15; i++) rh.push(0.245);
  s.addTable(rows, { x: 0.5, y: 0.98, w: 9.0, colW: [0.28, 3.05, 0.4, 2.35, 2.42, 0.5], rowH: rh, border: { type: 'solid', pt: 0.5, color: THEME.colors.accent5 }, margin: 0.03, objectName: 'overview table' });
}
s.addText('Tipo: ★ aposta de lei de potência (Thiel: poucas apostas valem mais que todas as outras) · H habilitador · $ monetizador · ◇ opção barata de alto potencial. Ondas: 1 Decidir e proteger (0–12 m) · 2 Construir a plataforma (12–36 m) · 3 Escalar (36 m+). H1–H3 são pré-condições. Valores são hipóteses sobre run-rates do 2T26; cada p.p. de ocupação ≈ R$ 20 mi/ano.', { x: 0.5, y: 4.95, w: 9, h: 0.32, fontSize: 7.5, italic: true, color: C.accent6, margin: 0, isTextBox: true, objectName: 'overview note' });

// ---- Action slides
actions.forEach((a) => {
  const sl = pres.addSlide({ masterName: 'ACTION', sectionTitle: 'Plano de ação' });
  sl.addText(a.title, { placeholder: 'title' });
  sl.addText(String(a.n).padStart(2, '0'), { x: 0.35, y: 0.25, w: 1.6, h: 0.8, fontSize: 44, bold: true, color: C.accent2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'action number' });
  const tagTxt = { '★': 'APOSTA DE LEI DE POTÊNCIA', H: 'HABILITADOR', $: 'MONETIZADOR', '◇': 'OPÇÃO' }[a.tag];
  sl.addText(a.tag + '  ' + tagTxt, { x: 1.95, y: 0.4, w: 1.1, h: 0.5, fontSize: 7.5, bold: true, charSpacing: 1, color: C.accent3, margin: 0, isTextBox: true, valign: 'middle', objectName: 'action tag' });
  const rows = [['ALVO', a.alvo, 1.15, 0.6], ['PODER DE HELMER · THIEL', a.poder, 1.95, 0.5], ['HORIZONTE · ONDA', a.horizonte, 2.65, 0.42], ['RESPONSÁVEL SUGERIDO', a.resp, 3.25, 0.6], ['KPI', a.kpi, 4.05, 1.1]];
  rows.forEach(([lab, val, y, h], i) => {
    label(sl, lab, 0.35, y, 2.6, 'label ' + (i + 1), true);
    sl.addText(val, { x: 0.35, y: y + 0.23, w: 2.6, h, fontSize: 10, bold: true, color: C.background1, margin: 0, isTextBox: true, valign: 'top', objectName: 'value ' + (i + 1) });
  });
  sl.addText(a.desc, { x: 3.65, y: 1.2, w: 5.85, h: 0.66, fontSize: 9.5, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'description' });
  label(sl, 'EXEMPLO PRÁTICO', 3.65, 1.88, 5.85, 'example label');
  sl.addText(a.ex, { x: 3.65, y: 2.09, w: 5.85, h: 0.82, fontSize: 9, italic: true, color: C.accent4, margin: 0, isTextBox: true, valign: 'top', objectName: 'example' });
  label(sl, 'MARCOS: 90 DIAS → 12 MESES → 36 MESES', 3.65, 2.93, 5.85, 'steps label');
  sl.addText([
    { text: '90 d: ', options: { bold: true, color: C.accent2 } }, { text: a.m90, options: { breakLine: true } },
    { text: '12 m: ', options: { bold: true, color: C.accent2 } }, { text: a.m12, options: { breakLine: true } },
    { text: '36 m: ', options: { bold: true, color: C.accent2 } }, { text: a.m36 },
  ], { x: 3.65, y: 3.14, w: 5.85, h: 0.64, fontSize: 9, color: C.text1, margin: 0, isTextBox: true, valign: 'top', paraSpaceAfter: 1, objectName: 'steps' });
  const strip = [['INVESTIMENTO', a.inv, false], ['GANHO', a.gain, true], ['TIME', a.team, false], ['RISCOS', a.risk, false]];
  strip.forEach(([lab, txt, dark], i) => {
    const x = 3.65 + i * 1.485;
    card(sl, x, 3.82, 1.4, 1.38, 'strip card ' + (i + 1), dark);
    label(sl, lab, x + 0.08, 3.88, 1.3, 'strip label ' + (i + 1), dark);
    sl.addText(txt, { x: x + 0.08, y: 4.08, w: 1.26, h: 1.08, fontSize: 7, color: dark ? C.background1 : C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'strip text ' + (i + 1) });
  });
  sl.addNotes(`Ação ${a.n} (${tagTxt}): ${a.title}. Alvo: ${a.alvo}. Poder: ${a.poder}. Horizonte: ${a.horizonte}. Responsável sugerido: ${a.resp}. Marcos: 90 dias — ${a.m90}; 12 meses — ${a.m12}; 36 meses — ${a.m36}. Investimento: ${a.inv} Ganho potencial: ${a.gain} Preparação do time: ${a.team} Riscos e dependências: ${a.risk}`);
});

// ---- Metas
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Plano de ação' });
s.addText('Painel de metas indicativas (hipóteses, não guidance)', { placeholder: 'title' });
{
  const kh = { bold: true, color: THEME.colors.lt1, fill: { color: THEME.colors.dk2 }, fontSize: 10.5, valign: 'middle' };
  const kpis = [
    ['SG&A / receita líquida', '~14%', '11%', '< 9%'],
    ['Estacionamento / receita líquida', '18%', '15%', '< 10%'],
    ['Mídia / receita total', '10,6%', '15%', '> 20%'],
    ['GMV capturado / vendas (base total)', '17%', '35%', '> 60%'],
    ['NOI nos top-20 ativos', 'n/d', '≥ 80%', '≥ 90%'],
    ['Share do gasto presencial da praça (top-20)', 'n/d', '+2 p.p.', '+5 p.p.'],
    ['Lojistas ativos em mídia por resultado', '< 5%', '30%', '> 60%'],
    ['ABL em categorias não agentizáveis', 'n/d', '+10 p.p.', '+20 p.p.'],
    ['Visitas originadas por agentes de IA', '0%', '10%', '> 40%'],
    ['Dias médios de vacância (saída → inauguração)', 'n/d', '−30%', '−60%'],
    ['Shoppings por gestor regional', 'n/d', '+50%', '2x'],
  ];
  const krows = [[{ text: 'Indicador', options: { ...kh } }, { text: '2T26', options: { ...kh, align: 'center' } }, { text: '2030', options: { ...kh, align: 'center' } }, { text: '2036', options: { ...kh, align: 'center' } }]];
  kpis.forEach((r, i) => {
    const fill = i % 2 === 0 ? THEME.colors.lt1 : THEME.colors.lt2;
    const o = { fontSize: 10.5, color: THEME.colors.dk1, fill: { color: fill }, valign: 'middle' };
    krows.push([{ text: r[0], options: { ...o } }, { text: r[1], options: { ...o, align: 'center' } }, { text: r[2], options: { ...o, align: 'center' } }, { text: r[3], options: { ...o, align: 'center', bold: true, color: THEME.colors.dk2 } }]);
  });
  s.addTable(krows, { x: 0.5, y: 1.02, w: 9.0, colW: [4.2, 1.6, 1.6, 1.6], rowH: 0.315, border: { type: 'solid', pt: 0.5, color: THEME.colors.accent5 }, margin: 0.04, objectName: 'kpi table' });
}
s.addText('Somadas, as ações 2–15 custam ~R$ 150–250 mi/ano (capex + opex, fora reconversões) e rendem ~R$ 450–550 mi/ano de EBITDA em run-rate 2030–32 — 20–25% do EBITDA de 2026 —, com sobreposições entre 9, 10, 12 e 13; não é soma linear.', { x: 0.5, y: 4.85, w: 9, h: 0.4, fontSize: 9.5, italic: true, color: C.accent6, margin: 0, isTextBox: true, valign: 'top', objectName: 'kpi note' });

// ---- Riscos, confiança e fontes
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Plano de ação' });
s.addText('Riscos do plano, confiança e fontes', { placeholder: 'title' });
card(s, 0.5, 1.05, 4.4, 3.0, 'riscos card');
label(s, 'RISCOS DO PLANO', 0.7, 1.2, 4.0, 'riscos label');
s.addText(bullets(['Conselho não libera o envelope: o plano para na ação 1', 'Dado sem dono: sócio ou FII contesta e o chokepoint digital vale zero (ação 2)', 'Plataformas de agentes cobram "taxa de descoberta" e anulam a ação 6', 'Construir sem distribuir: VendaCerta e Gateway sem motor comercial (ação 7)', 'Gerir 15 frentes como iguais e ignorar a lei de potência', 'Virar varejista ou logístico e perder o foco de locadora dominante', 'Automatizar antes de padronizar (H2) amplifica erros em escala', 'Produtividade da IA não vira renda: consumo presencial cai'], 10, 3), { x: 0.7, y: 1.5, w: 4.0, h: 2.5, fontSize: 10, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'riscos' });
card(s, 5.1, 1.05, 4.4, 3.0, 'fontes card');
label(s, 'FONTES', 5.3, 1.2, 4.0, 'fontes label');
s.addText(bullets(['Relatório de Resultados 2T26 — ALLOS (ri.allos.com.br)', 'Composição acionária; Diretoria e Conselho — RI Allos; TradeMap', 'BlackRock atinge 5,1% — Acionista.com.br (out/26)', 'Resultado 2T26 e licitação Aena — Estadão/Acessa (ago/26)', 'helloo lança VendaCerta — Nosso Meio (jun/26)', 'Reforma tributária e locação — Contábeis; Lei 8.245/91 — Aurum', 'Corners do El Corte Inglés — Modaes (2012, 2018)', '7 Powers (Helmer); The Last Economy (Mostaque); Zero a Um (Thiel & Masters, 2014) — as 7 perguntas via davidcummings.org', 'Diagramas fornecidos por Daniel: ciclo de vida (v2); gargalos de execução'], 9, 2), { x: 5.3, y: 1.5, w: 4.0, h: 2.5, fontSize: 9, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'fontes' });
card(s, 0.5, 4.2, 9.0, 0.9, 'confidence band', true);
s.addText([
  { text: 'Confiança: ', options: { bold: true, color: C.accent2 } },
  { text: '9/10 nos dados de base (fontes primárias) · ', options: { color: C.background1 } },
  { text: '6/10 no cenário e na priorização · 5/10 nos valores de investimento e ganho', options: { bold: true, color: C.background1 } },
  { text: ' — abaixo de 7 porque são hipóteses encadeadas sobre dez anos, sem fonte externa; servem para dimensionar a decisão, não para prometer resultado.', options: { color: C.background2 } },
], { x: 0.75, y: 4.2, w: 8.5, h: 0.9, fontSize: 11, margin: 0, isTextBox: true, valign: 'middle', objectName: 'confidence' });

(async () => {
  await pres.writeFile({ fileName: 'allos-2036-visao-de-futuro.pptx' });
  await applyTheme('allos-2036-visao-de-futuro.pptx', THEME);
  console.log('ok');
})();
