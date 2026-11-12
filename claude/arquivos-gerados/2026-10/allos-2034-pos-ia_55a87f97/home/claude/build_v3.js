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

// ======================================================================
pres.addSection({ title: 'Visão de futuro' });
let s = pres.addSlide({ masterName: 'TITLE_DARK', sectionTitle: 'Visão de futuro' });
s.addText('Allos 2036 — Visão de futuro sob a lente da IA', { placeholder: 'title' });
s.addText('Cenário, análise e plano de ação com 10 movimentos priorizados — investimento, ganho potencial e preparação do time por ação. Referências: 7 Powers (Helmer) e The Last Economy (Mostaque). Base: Relatório de Resultados 2T26 da ALLOS.', { placeholder: 'body' });
s.addNotes('Relatório elaborado por Claude a pedido de Daniel. Cenários, estimativas e metas são hipóteses sinalizadas.');

// ---- Sumário executivo
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Visão de futuro' });
s.addText('Sumário executivo: a tese e cinco conclusões', { placeholder: 'title' });
card(s, 0.5, 1.05, 9.0, 0.75, 'thesis band', true);
s.addText([{ text: 'Tese: ', options: { bold: true, color: C.accent2 } }, { text: 'a IA não ameaça a Allos como dona de imóveis dominantes; ameaça a Allos como cobradora de m². A cognição fica barata; o físico, o local e a confiança ficam escassos — e é isso que um shopping dominante vende.', options: { color: C.background1 } }], { x: 0.7, y: 1.05, w: 8.6, h: 0.75, fontSize: 12, margin: 0, isTextBox: true, valign: 'middle', objectName: 'thesis' });
const exec = [
  ['A IA polariza o setor', 'Pressões encurtam o ciclo dos secundários; alavancas alongam o dos dominantes. Dados e agentes são a 6ª alavanca que multiplica as outras.'],
  ['O valor migra do m² para a jornada', 'Cobrar do lojista por venda gerada, da marca por atenção verificada e do incorporador pelo terreno — sobre uma única base de dados.'],
  ['O rival é o agente do consumidor', 'Quem decide "onde ir" será um software. A Allos precisa ser legível por ele, não só ter um app.'],
  ['Estacionamento é passivo; terreno é opção', '18% da receita líquida vem de vagas que tendem a sumir; 1,74 mi m² de área privativa é a opção mais valiosa.'],
  ['Execução e governança decidem o ritmo', 'Padronizar antes de automatizar; pessoas mudam de "quantidade" para "perfil". Sem envelope de capital, o plano para na ação 1.'],
  ['O plano em números (hipóteses)', 'Ações 3–10: ~R$ 110–200 mi/ano de capex e opex; ganho de ~R$ 350–450 mi/ano de EBITDA em 2030–32 — 15–20% do EBITDA de 2026.'],
];
exec.forEach((e, i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const x = 0.5 + col * 3.05, y = 1.95 + row * 1.6;
  card(s, x, y, 2.9, 1.45, 'exec card ' + (i + 1));
  badge(s, i + 1, x + 0.15, y + 0.15, 0.42, 'exec ' + (i + 1));
  s.addText(e[0], { x: x + 0.68, y: y + 0.1, w: 2.1, h: 0.52, fontSize: 11, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'exec title ' + (i + 1) });
  s.addText(e[1], { x: x + 0.15, y: y + 0.66, w: 2.6, h: 0.76, fontSize: 9.5, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'exec text ' + (i + 1) });
});

// ---- Premissas e lentes
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Visão de futuro' });
s.addText('Premissas do cenário 2036 e as duas lentes', { placeholder: 'title' });
card(s, 0.5, 1.05, 4.4, 4.05, 'prem card');
label(s, 'SEIS TRAJETÓRIAS DE IA ASSUMIDAS', 0.7, 1.2, 4.0, 'prem label');
s.addText(bullets([
  'Agentes fazem o trabalho cognitivo corporativo a custo marginal ~zero',
  'Comércio agêntico: comparáveis delegados; compra social e experiencial resiste',
  'Logística autônoma desvaloriza a conveniência; saúde, educação e lazer valorizam',
  'Conteúdo infinito desvaloriza a atenção digital; atenção física verificada vira ativo raro',
  'Dados físicos mais valiosos e mais regulados; consentimento mediado por agentes',
  'Juros reais altos permanecem; efeito da IA sobre renda da classe média é a maior incógnita',
], 11, 5), { x: 0.7, y: 1.5, w: 4.0, h: 3.5, fontSize: 11, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'prem text' });
card(s, 5.1, 1.05, 4.4, 1.95, 'lens helmer');
label(s, '7 POWERS · HELMER', 5.3, 1.2, 4.0, 'lens helmer label');
s.addText('Poder = benefício para quem detém + barreira para quem copia: escala, rede, contraposicionamento, custos de troca, marca, recurso encurralado, processo. Uso como teste de durabilidade de cada vantagem da Allos sob IA.', { x: 5.3, y: 1.5, w: 4.0, h: 1.45, fontSize: 10.5, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'lens helmer text' });
card(s, 5.1, 3.15, 4.4, 1.95, 'lens mostaque', true);
label(s, 'THE LAST ECONOMY · MOSTAQUE', 5.3, 3.3, 4.0, 'lens mostaque label', true);
s.addText('IA é a 4ª inversão de valor (terra, trabalho, capital, inteligência); valor é capacidade de predição; capitais Material, Inteligência, Rede e Diversidade. Uso para separar o que é capital Material (não copiável) do que é Inteligência (comoditizável). Não adoto a janela de "mil dias".', { x: 5.3, y: 3.6, w: 4.0, h: 1.45, fontSize: 10.5, color: C.background1, margin: 0, isTextBox: true, valign: 'top', objectName: 'lens mostaque text' });

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

// ---- Linha de base (uma tabela)
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Visão de futuro' });
s.addText('Linha de base 2T26: o que mais importa para 2036', { placeholder: 'title' });
tbl(s, ['Frente', 'Situação (abr–jun 2026) e leitura'], [
  ['Portfólio', '46 shoppings (1.934 mil m² de ABL total; 1.262 mil própria) + 6 de terceiros administrados. Ocupação 96,2%; inadimplência 1,4%; SSS 2,6% — Serviços e Lazer 6,5% vs Roupas 1,2%: o mix comparável já cresce menos.'],
  ['Mídia e plataforma', 'Mídia +84,5% a/a (10,6% da receita); VendaCerta: mídia por resultado com o CRM, R$ 11,50 por R$ 1 nos pilotos. 17,1 mi de sessões; GMV capturado R$ 1,56 bi (27% das vendas nos maduros); +15% de frequência pós-adesão.'],
  ['Multiúso e reciclagem', '72 torres assinadas; 1,74 mi m² disponíveis; masterplan Parque Dom Pedro (VGV R$ 4,5 bi). Taste no Tijuca: estacionamento virou 2.167 m² com R$ 5 mi no 1º mês. Curitiba vendido a cap rate 9,6%; Kinea ALLOS Malls FII (até R$ 2 bi).'],
  ['Finanças', 'Dívida líquida R$ 3,68 bi (1,7x), CDI + 0,57%, 98% em CDI. Guidance 2026: EBITDA R$ 2,17–2,24 bi; capex R$ 350–450 mi; dividendos R$ 0,28–0,30/ação/mês (~R$ 1,7 bi/ano). Payout alto vs capex baixo é a tensão central.'],
  ['Gestão', 'Integração de sistemas concluída em 2025; Simplifica Allos: SG&A −5,6% a/a (~14% da receita líquida), com IA citada pela CFO. Operação ainda artesanal em vacância e renovação.'],
  ['Governança', 'Sem controlador: CPPIB 9,0%, Guepardo 5,4%, SPX 5,2%, Sonae Sierra 5,1%, BlackRock 5,1%. Conselho presidido por Renato Rique, com independentes; FTSE4Good e Pró-Ética. Falta competência profunda em IA no conselho.'],
], 0.5, 1.05, 9.0, [1.5, 7.5], 'base table', 10.5);

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
s.addText('Ciclo de vida: sob IA, as duas curvas viram destinos', { placeholder: 'title' });
s.addImage({ path: 'assets/ciclo-de-vida.png', x: 1.55, y: 1.0, w: 6.9, h: 3.85, objectName: 'diagrama ciclo de vida' });
s.addText('A IA empurra os secundários para a curva encurtada e os dominantes para a alongada; as alavancas passam a rodar em paralelo, alimentadas por uma 6ª — dados e agentes. Para a cauda, a alavanca certa é a reciclagem via FII, aplicada cedo.', { x: 0.5, y: 4.88, w: 9.0, h: 0.38, fontSize: 9.5, italic: true, color: C.accent4, margin: 0, isTextBox: true, valign: 'top', objectName: 'ciclo note' });
s.addNotes('Diagrama fornecido por Daniel. Versão 1: pressões encurtam o ciclo. Versão 2: alavancas alongam o ciclo.');

// ---- Pressões
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
s.addText('As cinco pressões: o que a IA faz com cada uma', { placeholder: 'title' });
tbl(s, ['Pressão', 'Como a IA a transforma', 'Exposição da Allos', 'Resposta'], [
  ['ABL concorrencial', 'De "mais m²" para "mais destinos"; cognição barata nivela a gestão. ABL nova fere o secundário, não o dominante.', 'Média: vacância concentrada (Brasília 84,7%, Tijuca 90,2%, Passeio 91,5%)', 'Ações 2 e 9'],
  ['E-commerce', 'Vira comércio agêntico: o agente compra o comparável e decide "onde ir". A pressão migra da venda para a descoberta.', 'Alta em comparáveis (Roupas 1,2%); baixa em serviços e lazer (6,5%)', 'Ações 3, 4 e 9'],
  ['Tributação elevada', 'Reforma (2026–33; redutor de 70% para locação) muda a mecânica; IA reduz compliance, não a alíquota.', 'Média: custo de ocupação de 10,3% limita repasse', 'Ações 7 e 8'],
  ['Entraves burocráticos', 'Agentes montam dossiês em horas; o rito municipal segue humano. O gargalo migra para o Estado.', 'Alta no multiúso (72 torres; alvarás do Dom Pedro)', 'Ação 6 + H2'],
  ['Recessão econômica', 'Se a produtividade não virar renda, o consumo presencial cai. Serviços essenciais resistem.', 'Alta: 63% da receita é aluguel; 98% da dívida em CDI', 'Ações 1, 2 e 9'],
], 0.5, 1.05, 9.0, [1.5, 3.6, 2.7, 1.2], 'pressoes table', 11);

// ---- Alavancas
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
s.addText('As cinco alavancas (e a sexta): como a IA as amplifica', { placeholder: 'title' });
tbl(s, ['Alavanca', 'Como a IA a amplifica', 'Já visível na Allos', 'Ação'], [
  ['Expansão / retrofit', 'Projeto e obra mais baratos; reconversão de área improdutiva em uso que a IA valoriza.', 'Taste no Tijuca: 2.167 m² de ex-estacionamento, R$ 5 mi no 1º mês', '6 e 9'],
  ['Mix transformacional', 'Modelos próprios escolhem o mix; agentes prospectam marcas (Hunter, Farmer, Builder).', 'On Running (Leblon), Fazenda Churrascada (Tamboré), Adidas (VillaLobos)', '9 e 7'],
  ['Retail media', 'Segmentação e criação a custo zero; ciclo fechado mídia → oferta → venda comprovada.', 'VendaCerta (R$ 11,50 por R$ 1); Copa com C6, Coca-Cola, Hyundai', '4'],
  ['Eventos / bilheteria', 'Experiência ao vivo é o que o agente não substitui; preço por demanda; evento vira dado de intenção.', 'Figurinhas da Copa em 45 shoppings; São João com Boticário, Natura, TIM', '9 e 4'],
  ['Reciclagem via FII', 'Valuation por ativo com fluxo e GMV reais; saída da cauda sem desconto de opacidade.', 'Kinea ALLOS Malls FII (até R$ 2 bi); Curitiba a 9,6%', '2 e 10'],
  ['6ª: dados e agentes', 'Multiplicador das outras cinco; sem ele, cada alavanca é copiável.', 'GMV R$ 1,56 bi/tri; 17,1 mi de sessões; +15% de frequência', '3, 5 e 7'],
], 0.5, 1.05, 9.0, [1.6, 3.5, 3.1, 0.8], 'alavancas table', 11);

// ---- Fatores externos e internos (um slide)
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
s.addText('Fatores externos e internos: o que fortalece e o que enfraquece', { placeholder: 'title' });
const fat = [
  ['EXTERNOS · FORTALECEM', ['Escassez do físico e do local concentra a renda', 'Rejeição ao conteúdo genérico de IA valoriza a atenção física', 'Adensamento urbano: shopping como centralidade', 'Consolidação do setor dilui o custo fixo de IA']],
  ['EXTERNOS · ENFRAQUECEM', ['Comércio agêntico e logística autônoma', 'Juros reais altos: dívida 98% em CDI', 'Plataformas de agentes com "taxa de descoberta"', 'Regulação de dados e consentimento mediado', 'Incertos: reforma tributária; renda da classe média']],
  ['INTERNOS · FORTALECEM', ['46 ativos dominantes: recurso encurralado + escala', 'Dado físico proprietário: GMV R$ 1,56 bi/tri', 'Ciclo fechado mídia → oferta → venda (helloo + CRM)', 'Pipeline multiúso de 1,74 mi m²; balanço a 1,7x', 'Governança pulverizada com institucionais']],
  ['INTERNOS · ENFRAQUECEM', ['Estacionamento: 18% da receita líquida', 'Mix comparável com SSS 1–2%', 'Payout ~R$ 1,7 bi/ano vs capex R$ 350–450 mi', 'Dependência de poucos provedores de IA', 'Gargalos: pessoas, processos instáveis, vacância artesanal']],
];
fat.forEach((f, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = 0.5 + col * 4.6, y = 1.05 + row * 2.1;
  card(s, x, y, 4.4, 1.95, 'fat card ' + (i + 1), col === 1);
  label(s, f[0], x + 0.2, y + 0.12, 4.0, 'fat label ' + (i + 1), col === 1);
  s.addText(bullets(f[1], 10.5, 3), { x: x + 0.2, y: y + 0.38, w: 4.0, h: 1.5, fontSize: 10.5, color: col === 1 ? C.background1 : C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'fat text ' + (i + 1) });
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
  ['Contraposicionamento', 'Inexistente', 'Oportunidade: cobrar por venda comprovada em vez de m²'],
  ['Poder de processo', 'Fraco: operação artesanal', 'O mais disputado: só vira poder se embutido em dados exclusivos e no dia a dia'],
], 0.5, 1.05, 9.0, [1.9, 2.9, 4.2], 'powers table', 11);

// ---- Gargalos: imagem
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
s.addText('Gargalos operacionais na execução da estratégia', { placeholder: 'title' });
s.addImage({ path: 'assets/gargalos.jpg', x: 1.2, y: 1.05, w: 7.6, h: 4.13, objectName: 'diagrama gargalos' });
s.addNotes('Diagrama fornecido por Daniel: escassez de pessoas capacitadas; instabilidade nos processos; gestão artesanal da vacância.');

// ---- Habilitadores
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Análise' });
s.addText('Os três gargalos sob IA: habilitadores antes das alavancas', { placeholder: 'title' });
const garg = [
  ['H1 · Pessoas', 'A IA alivia a quantidade e eleva o perfil: o escasso passa a ser quem orquestra agentes, lê dados e negocia.', 'Academia Allos de Operação Agêntica: trilha de 6 meses; cada gestor com copilotos; carreira de "orquestrador" (4 → 7–8 shoppings por gestor, hipótese).', 'Shoppings por gestor; % de decisões com dossiê de agente'],
  ['H2 · Processos', 'Agentes amplificam a variância de processos instáveis. Padronizar antes de automatizar.', 'Playbooks com SLA por processo (renovação, vacância, obra, cobrança, licenciamento); cada playbook é a especificação do agente que o executará.', '% de processos com playbook e SLA; variância de prazo'],
  ['H3 · Vacância', 'Maior retorno imediato: o ciclo saída → inauguração vira pipeline previsto e orquestrado.', 'Churn por loja + prospecção por agentes (Hunter) + matching (Farmer/Alavancador) + kit de obra e licenças (Builder). Ex.: nova loja em 45 dias, não 120 (ilustrativo).', 'Dias de vacância; NOI perdido; % de saídas previstas'],
];
garg.forEach((g, i) => {
  const x = 0.5 + i * 3.05;
  card(s, x, 1.05, 2.9, 4.05, 'garg card ' + (i + 1));
  s.addText(g[0], { x: x + 0.2, y: 1.15, w: 2.5, h: 0.35, fontSize: 13, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'garg title ' + (i + 1) });
  label(s, 'DIAGNÓSTICO', x + 0.2, 1.55, 2.5, 'garg l1 ' + (i + 1));
  s.addText(g[1], { x: x + 0.2, y: 1.77, w: 2.5, h: 0.85, fontSize: 10, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'garg t1 ' + (i + 1) });
  label(s, 'HABILITADOR', x + 0.2, 2.65, 2.5, 'garg l2 ' + (i + 1));
  s.addText(g[2], { x: x + 0.2, y: 2.87, w: 2.5, h: 1.45, fontSize: 10, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'garg t2 ' + (i + 1) });
  label(s, 'KPI', x + 0.2, 4.38, 2.5, 'garg l3 ' + (i + 1));
  s.addText(g[3], { x: x + 0.2, y: 4.6, w: 2.5, h: 0.45, fontSize: 10, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: 'top', objectName: 'garg t3 ' + (i + 1) });
});

// ======================================================================
pres.addSection({ title: 'Plano de ação' });
/*ACTIONS*/

// ---- Visão geral (um slide)
const shortTitles = [
  'Envelope de capital da transição e comitê de IA',
  'Concentrar o portfólio nos ~20 "destino"; sair da cauda',
  'Allos Agent Gateway: legível para agentes de IA',
  'Escalar o retail media de ciclo fechado (VendaCerta)',
  'Camada proprietária de dados e IA, multi-fornecedor',
  'Reconverter estacionamento antes da queda',
  'Operação agêntica: vacância, renovação, cobrança',
  'Contrato híbrido por desempenho (piloto)',
  'Rebalancear o mix para categorias não agentizáveis',
  'Plataforma de gestão para terceiros e FIIs',
];
const shortInv = [
  'Envelope R$ 220–330 mi/ano × 5 anos',
  'Transação 1–2% (R$ 10–40 mi); capex realocado',
  'Capex R$ 15–30 mi; opex R$ 5–10 mi/ano',
  'Opex R$ 10–20 mi/ano; capex < R$ 5 mi',
  'Capex R$ 30–50 mi; opex R$ 15–25 mi/ano',
  'Projetos R$ 10–20 mi; capex R$ 150–400 mi (2029–34)',
  'Capex R$ 10–20 mi; opex R$ 13–25 mi/ano',
  'Opex R$ 1–3 mi; risco limitado ao piloto',
  'Capex R$ 50–100 mi/ano (no guidance de expansões)',
  'Opex R$ 5–10 mi/ano',
];
const shortGain = [
  'Habilitador; não fazer custa ~R$ 20 mi/ano por p.p. de ocupação',
  'R$ 1–2 bi de capital liberado; +R$ 15–25 mi/ano de NOI',
  '+1–2% de vendas (~R$ 15–30 mi/ano); evita taxa de 5–15%',
  '+R$ 120–170 mi de mídia; ~R$ 60–90 mi/ano de EBITDA',
  '~R$ 11 mi/ano em PDD; evita lock-in; multiplicador',
  'Protege ~R$ 510 mi/ano; ~R$ 80 mi/ano de locação + VGV',
  '~R$ 110 mi/ano (SG&A, vacância, PDD); ~R$ 150 mi em 2036',
  '~R$ 18 mi/ano se escalado a 30% dos satélites',
  '~R$ 50 mi/ano com 10 reconversões tipo Taste',
  '~R$ 30–50 mi/ano com 300 mil m² de terceiros',
];
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Plano de ação' });
s.addText('As 10 ações, por prioridade: investimento e ganho potencial', { placeholder: 'title' });
{
  const hdr = { bold: true, color: THEME.colors.lt1, fill: { color: THEME.colors.dk2 }, fontSize: 10, valign: 'middle' };
  const rows = [[
    { text: '#', options: { ...hdr, align: 'center' } }, { text: 'Ação', options: { ...hdr } },
    { text: 'Investimento (capex / opex)', options: { ...hdr } }, { text: 'Ganho potencial (run-rate 2030)', options: { ...hdr } }, { text: 'Horizonte', options: { ...hdr } },
  ]];
  const hz = ['0–6 m', '6–36 m', '12–24 m', '12–24 m', '12–24 m', '36 m + obra', '12–36 m', '12–24 m', '24–60 m', '24–48 m'];
  actions.forEach((a, i) => {
    const fill = i % 2 === 0 ? THEME.colors.lt1 : THEME.colors.lt2;
    const opt = { fontSize: 9.5, color: THEME.colors.dk1, fill: { color: fill }, valign: 'middle' };
    rows.push([
      { text: String(a.n), options: { ...opt, bold: true, color: THEME.colors.accent2, align: 'center', fontSize: 11 } },
      { text: shortTitles[i], options: { ...opt, bold: true, color: THEME.colors.dk2 } },
      { text: shortInv[i], options: { ...opt } },
      { text: shortGain[i], options: { ...opt, bold: true, color: THEME.colors.accent4 } },
      { text: hz[i], options: { ...opt, align: 'center' } },
    ]);
  });
  s.addTable(rows, { x: 0.5, y: 1.0, w: 9.0, colW: [0.3, 2.9, 2.5, 2.5, 0.8], rowH: [0.3, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36], border: { type: 'solid', pt: 0.5, color: THEME.colors.accent5 }, margin: 0.04, objectName: 'overview table' });
}
s.addText('Prioridade por: janela que se fecha · alavancagem · impacto em FFO · reversibilidade. H1–H3 (pessoas, processos, vacância) são pré-condições. Valores são hipóteses sobre run-rates do 2T26; cada p.p. de ocupação ≈ R$ 20 mi/ano de locação.', { x: 0.5, y: 4.98, w: 9, h: 0.3, fontSize: 8.5, italic: true, color: C.accent6, margin: 0, isTextBox: true, objectName: 'overview note' });

// ---- Action slides
actions.forEach((a) => {
  const sl = pres.addSlide({ masterName: 'ACTION', sectionTitle: 'Plano de ação' });
  sl.addText(a.title, { placeholder: 'title' });
  sl.addText(String(a.n).padStart(2, '0'), { x: 0.35, y: 0.25, w: 2.6, h: 0.8, fontSize: 44, bold: true, color: C.accent2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'action number' });
  const rows = [['ALVO', a.alvo, 1.15, 0.6], ['PODER DE HELMER', a.poder, 1.95, 0.5], ['HORIZONTE', a.horizonte, 2.65, 0.42], ['RESPONSÁVEL SUGERIDO', a.resp, 3.25, 0.6], ['KPI', a.kpi, 4.05, 1.1]];
  rows.forEach(([lab, val, y, h], i) => {
    label(sl, lab, 0.35, y, 2.6, 'label ' + (i + 1), true);
    sl.addText(val, { x: 0.35, y: y + 0.23, w: 2.6, h, fontSize: 10.5, bold: true, color: C.background1, margin: 0, isTextBox: true, valign: 'top', objectName: 'value ' + (i + 1) });
  });
  sl.addText(a.desc, { x: 3.65, y: 1.2, w: 5.85, h: 0.62, fontSize: 10.5, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'description' });
  label(sl, 'EXEMPLO PRÁTICO', 3.65, 1.86, 5.85, 'example label');
  sl.addText(a.ex, { x: 3.65, y: 2.07, w: 5.85, h: 0.9, fontSize: 10, italic: true, color: C.accent4, margin: 0, isTextBox: true, valign: 'top', objectName: 'example' });
  label(sl, 'PRIMEIROS 90 DIAS E MARCOS DE 12 MESES', 3.65, 3.0, 5.85, 'steps label');
  sl.addText(bullets(a.passos, 10, 2), { x: 3.65, y: 3.21, w: 5.85, h: 0.62, fontSize: 10, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'steps' });
  const strip = [['INVESTIMENTO', a.inv, false], ['GANHO POTENCIAL', a.gain, true], ['PREPARAÇÃO DO TIME', a.team, false]];
  strip.forEach(([lab, txt, dark], i) => {
    const x = 3.65 + i * 1.98;
    card(sl, x, 3.85, 1.88, 1.3, 'strip card ' + (i + 1), dark);
    label(sl, lab, x + 0.1, 3.93, 1.7, 'strip label ' + (i + 1), dark);
    sl.addText(txt, { x: x + 0.1, y: 4.15, w: 1.7, h: 0.95, fontSize: 8.5, color: dark ? C.background1 : C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'strip text ' + (i + 1) });
  });
  sl.addNotes(`Ação ${a.n}: ${a.title}. Alvo: ${a.alvo}. Poder: ${a.poder}. Horizonte: ${a.horizonte}. Responsável sugerido: ${a.resp}. Investimento: ${a.inv} Ganho potencial: ${a.gain} Preparação do time: ${a.team}`);
});

// ---- Ondas + metas
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Plano de ação' });
s.addText('Sequenciamento em três ondas', { placeholder: 'title' });
const waves = [
  ['Onda 1 · Decidir e proteger', '0–12 meses', ['H2 · Playbooks com SLA', 'H1 · Academia de operação agêntica', '1 · Envelope de capital e comitê de IA', '2 · Concentrar o portfólio', '3 · Agent Gateway (MVP)', '4 · Escalar o VendaCerta'], 'Destravar capital e ocupar a interface com os agentes antes dos concorrentes.'],
  ['Onda 2 · Construir a plataforma', '12–36 meses', ['H3 · Pipeline de vacância', '5 · Camada de dados e IA', '6 · Projetos de reconversão', '7 · Operação agêntica', '8 · Contrato híbrido (piloto)', '9 · Rebalancear o mix'], 'Dado próprio, processos agênticos, novo contrato e novo mix.'],
  ['Onda 3 · Escalar', '36+ meses', ['6 · Execução da reconversão', '10 · Plataforma de gestão para terceiros'], 'Reconversão física e venda da plataforma de gestão.'],
];
waves.forEach((w, i) => {
  const x = 0.5 + i * 3.05;
  card(s, x, 1.05, 2.9, 4.05, 'wave card ' + (i + 1));
  badge(s, i + 1, x + 0.2, 1.25, 0.55, 'wave ' + (i + 1));
  s.addText(w[0], { x: x + 0.9, y: 1.23, w: 1.95, h: 0.6, fontSize: 13, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'wave title ' + (i + 1) });
  s.addText(w[1], { x: x + 0.2, y: 1.95, w: 2.5, h: 0.3, fontSize: 11, bold: true, color: C.accent2, margin: 0, isTextBox: true, objectName: 'wave period ' + (i + 1) });
  s.addText(bullets(w[2], 11, 3), { x: x + 0.2, y: 2.3, w: 2.5, h: 1.95, fontSize: 11, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'wave items ' + (i + 1) });
  s.addText(w[3], { x: x + 0.2, y: 4.3, w: 2.5, h: 0.7, fontSize: 10.5, italic: true, color: C.accent4, margin: 0, isTextBox: true, valign: 'top', objectName: 'wave goal ' + (i + 1) });
});

s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Plano de ação' });
s.addText('Painel de metas indicativas (hipóteses, não guidance)', { placeholder: 'title' });
{
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
  s.addTable(krows, { x: 0.5, y: 1.05, w: 9.0, colW: [4.2, 1.6, 1.6, 1.6], rowH: 0.36, border: { type: 'solid', pt: 0.5, color: THEME.colors.accent5 }, margin: 0.05, objectName: 'kpi table' });
}
s.addText('Somadas, as ações 3–10 custam ~R$ 110–200 mi/ano (capex + opex, fora reconversões) e rendem ~R$ 350–450 mi/ano de EBITDA em run-rate 2030–32 — 15–20% do EBITDA de 2026.', { x: 0.5, y: 4.75, w: 9, h: 0.4, fontSize: 10.5, italic: true, color: C.accent6, margin: 0, isTextBox: true, valign: 'top', objectName: 'kpi note' });

// ---- Riscos, confiança e fontes
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Plano de ação' });
s.addText('Riscos do plano, confiança e fontes', { placeholder: 'title' });
card(s, 0.5, 1.05, 4.4, 3.0, 'riscos card');
label(s, 'RISCOS DO PLANO', 0.7, 1.2, 4.0, 'riscos label');
s.addText(bullets(['Conselho não libera o envelope: o plano para na ação 1', 'Plataformas de agentes cobram "taxa de descoberta" e anulam a ação 3', 'Regulação de dados limita o ciclo fechado da ação 4', 'Estacionamento cai antes da reconversão da ação 6', 'Automatizar antes de padronizar (H2) amplifica erros em escala', 'Produtividade da IA não vira renda: consumo presencial cai'], 11, 4), { x: 0.7, y: 1.5, w: 4.0, h: 2.5, fontSize: 11, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'riscos' });
card(s, 5.1, 1.05, 4.4, 3.0, 'fontes card');
label(s, 'FONTES', 5.3, 1.2, 4.0, 'fontes label');
s.addText(bullets(['Relatório de Resultados 2T26 — ALLOS (ri.allos.com.br)', 'Composição acionária; Diretoria e Conselho — RI Allos; TradeMap', 'BlackRock atinge 5,1% — Acionista.com.br (out/26)', 'Resultado 2T26 e licitação Aena — Estadão/Acessa (ago/26)', 'helloo lança VendaCerta — Nosso Meio (jun/26)', 'Reforma tributária e locação — Contábeis', '7 Powers (Helmer) — ThinkInsights; The Last Economy — ii.inc, SoBrief', 'Diagramas fornecidos por Daniel: ciclo de vida; gargalos de execução'], 9.5, 2), { x: 5.3, y: 1.5, w: 4.0, h: 2.5, fontSize: 9.5, color: C.text1, margin: 0, isTextBox: true, valign: 'top', objectName: 'fontes' });
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
