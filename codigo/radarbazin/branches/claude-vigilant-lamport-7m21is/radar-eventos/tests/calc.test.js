const test = require('node:test');
const assert = require('node:assert');
const { simular, viabilidade, diasEntre } = require('../calc.js');

test('diasEntre conta dias inclusivos', () => {
  assert.strictEqual(diasEntre('2026-12-01', '2026-12-10'), 10);
  assert.strictEqual(diasEntre('2026-12-10', '2026-12-01'), null);
});

test('simulador não estima: sem dados o total é nulo e lista faltas', () => {
  const r = simular({}, {}, null);
  assert.ok(r.faltas.length > 0);
  r.cenarios.forEach(c => assert.strictEqual(c.total, null));
});

test('simulador soma locação, % bilheteria, sublocação e mídia', () => {
  const sim = {
    dias: 10, temBilheteria: 'sim', sessoesDia: 4, capacidadeSessao: 100, ticketMedio: 50,
    ocupPess: 25, ocupBase: 50, ocupOtim: 100, pctBilheteria: 10,
    locacaoModelo: 'fixo', aluguelFixo: 20000, regraBilheteria: 'soma',
    sublocacoes: [{ qtd: 5, valor: 2000, pctShopping: 50 }],
    midias: [{ qtd: 2, valor: 10000, pctShopping: 100 }], custosShopping: 5000
  };
  const r = simular(sim, {}, null);
  assert.deepStrictEqual(r.faltas, []);
  const base = r.cenarios[1];
  assert.strictEqual(base.publico, 2000);
  assert.strictEqual(base.bilheteria, 100000);
  assert.strictEqual(base.parteBilheteria, 10000);
  assert.strictEqual(base.total, 20000 + 10000 + 5000 + 20000);
  assert.strictEqual(base.liquido, 50000);
});

test('regra "maior entre" usa aluguel mínimo ou % da bilheteria', () => {
  const sim = {
    dias: 10, temBilheteria: 'sim', sessoesDia: 4, capacidadeSessao: 100, ticketMedio: 50,
    ocupPess: 10, ocupBase: 50, ocupOtim: 100, pctBilheteria: 30,
    locacaoModelo: 'fixo', aluguelFixo: 20000, regraBilheteria: 'maior'
  };
  const r = simular(sim, {}, null);
  assert.strictEqual(r.cenarios[0].total, 20000); // 30% de 20.000 = 6.000 < mínimo
  assert.strictEqual(r.cenarios[2].total, 60000); // 30% de 200.000
});

test('locação por m²/dia usa metragem do evento e datas', () => {
  const r = simular({ temBilheteria: 'nao', locacaoModelo: 'm2dia', valorM2Dia: 10 },
    { inicio: '2026-12-01', fim: '2026-12-05', req: { areaM2: 200 } }, null);
  assert.strictEqual(r.locacao, 10000);
  assert.strictEqual(r.cenarios[1].total, 10000);
});

const area = { id: 'a', metragem: 500, peDireito: 6, lotacaoMax: 300, agua: 'sim', esgoto: 'nao', energia: { disponivel: 'sim', cargaKva: 75 } };
const evOk = {
  id: 'e1', nome: 'Feira', areaId: 'a', inicio: '2026-12-01', fim: '2026-12-10',
  req: { areaM2: 400, alturaM: 4, cargaKva: 50, agua: 'sim', esgoto: 'nao', publicoSimultaneo: 250 },
  docs: [{ obrigatorio: true, status: 'aprovado' }], regras: { r1: 'atende' }
};
const caderno = { folgaAlturaM: 1, regras: [{ id: 'r1', texto: 'Rotas de fuga livres', obrigatoria: true }] };

test('viabilidade: apto quando tudo atende', () => {
  const v = viabilidade(evOk, area, caderno, [evOk]);
  assert.strictEqual(v.veredito, 'apto');
});

test('viabilidade: inviável por altura, energia, esgoto e conflito de agenda', () => {
  const ev = JSON.parse(JSON.stringify(evOk));
  ev.req.alturaM = 5.5; ev.req.cargaKva = 100; ev.req.esgoto = 'sim';
  const outro = { id: 'e2', nome: 'Show', areaId: 'a', inicio: '2026-12-05', fim: '2026-12-06' };
  const v = viabilidade(ev, area, caderno, [ev, outro]);
  assert.strictEqual(v.veredito, 'inviavel');
  assert.strictEqual(v.falhas, 4);
});

test('viabilidade: pendente quando falta dado (nunca aprova no escuro)', () => {
  const ev = JSON.parse(JSON.stringify(evOk));
  delete ev.req.publicoSimultaneo; ev.regras = {};
  const v = viabilidade(ev, area, caderno, [ev]);
  assert.strictEqual(v.veredito, 'pendente');
  assert.strictEqual(v.faltas, 2);
});
