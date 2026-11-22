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

/* ---------- Cluster, Event Occupancy Score e Deal Conversion Layer ---------- */
require('../dados.js');
const D = globalThis.RadarDados;
const { eventScore, dealConversion, csvDcl, faixa } = require('../calc.js');
const cad2 = { regras: [{ id: 'o1', obrigatoria: true }, { id: 'r1', obrigatoria: false }, { id: 'r2', obrigatoria: false }] };
const notas5 = { fitCluster: 5, atratividade: 5, patrocinio: 5, fluxo: 5, lojistas: 5, montagem: 5, recorrencia: 5 };

test('pesos do Event Occupancy Score somam 100', () => {
  assert.strictEqual(D.EOS_CRITERIOS.reduce((s, c) => s + c.peso, 0), 100);
});

test('score não fecha sem cluster, batalha ou nota (nada é estimado)', () => {
  const r = eventScore({ eos: { fitCluster: 4 } }, cad2, D, null);
  assert.strictEqual(r.score, null);
  assert.ok(r.faltas.some(f => f.includes('cluster')));
  assert.ok(r.faltas.some(f => f.includes('batalha')));
  assert.ok(r.faltas.some(f => f.includes('Atratividade')));
  assert.strictEqual(r.clusterFit, 80);
});

test('score completo: tudo 5 e todas as regras atendidas = 100', () => {
  const ev = { batalha: 'Entretenimento', eos: notas5, regras: { o1: 'atende', r1: 'atende', r2: 'na' } };
  const r = eventScore(ev, cad2, D, 'Entretenimento');
  assert.strictEqual(r.score, 100);
  assert.strictEqual(r.faixa.id, 'estrategico');
  assert.deepStrictEqual(r.alertas, []);
});

test('segurança: obrigatória não atendida zera; recomendação faltando tira parte dos 15', () => {
  const base = { batalha: 'Entretenimento', eos: notas5 };
  assert.strictEqual(eventScore({ ...base, regras: { o1: 'nao' } }, cad2, D, 'Entretenimento').score, 85);
  assert.strictEqual(eventScore({ ...base, regras: { o1: 'atende', r1: 'atende' } }, cad2, D, 'Entretenimento').score, 99); // 15×(0,8+0,2×½)=13,5
  assert.strictEqual(eventScore({ ...base, regras: {} }, cad2, D, 'Entretenimento').score, null);
});

test('alerta quando a batalha não é do cluster', () => {
  const r = eventScore({ batalha: 'Hospitality', eos: notas5, regras: { o1: 'atende' } }, cad2, D, 'Convenientes');
  assert.ok(r.alertas[0].includes('não pertence'));
});

test('faixas seguem o Cluster Fit do OS', () => {
  assert.strictEqual(faixa(40).id, 'baixo'); assert.strictEqual(faixa(41).id, 'aceitavel');
  assert.strictEqual(faixa(85).id, 'forte'); assert.strictEqual(faixa(86).id, 'estrategico');
});

test('Deal Conversion: mapeia etapa, aplica regras do OS e pondera impacto', () => {
  const ev = { id: 'x', nome: 'Feira', etapa: 'proposta', batalha: 'Gastronomia',
    dcl: { dono: 'Ana', proximaAcao: 'Enviar proposta', prazo: '2026-11-25', probabilidade: 40, criterioKill: 'sem resposta em 3 tentativas' } };
  const r = dealConversion(ev, { hoje: '2026-11-20', receitaBase: 50000, score: { clusterFit: 60, score: 70, cluster: 'Passeio Familiar' } }, D);
  assert.strictEqual(r.estagio, 'Proposal');
  assert.strictEqual(r.impacto_ponderado, 20000);
  assert.strictEqual(r.decisao, 'Cobrar blocker');
  assert.deepStrictEqual(r.faltas, []);
});

test('Deal Conversion: sem dono / prazo longo rebaixa; fit < 40 pausa', () => {
  const ev = { id: 'y', etapa: 'qualificacao', dcl: { proximaAcao: 'Ligar', prazo: '2026-12-30' } };
  const r = dealConversion(ev, { hoje: '2026-11-20', receitaBase: null, score: { clusterFit: 20 } }, D);
  assert.strictEqual(r.decisao, 'Pausar');
  assert.ok(r.alertas.some(a => a.nivel === 'risco'));
  assert.ok(r.alertas.some(a => a.nivel === 'rebaixar'));
  assert.ok(r.faltas.includes('probabilidade de fechamento'));
  const c = dealConversion({ id: 'z', etapa: 'cancelado' }, { score: {} }, D);
  assert.strictEqual(c.estagio, 'Lost / Parked');
});

test('CSV do Deal Conversion abre no Excel (;, BOM, aspas)', () => {
  const r = dealConversion({ id: 'k', nome: 'Show; "VIP"', etapa: 'prospeccao' }, { hoje: '2026-11-20', score: {} }, D);
  const csv = csvDcl([r]);
  assert.ok(csv.startsWith('﻿oportunidade_id;'));
  assert.ok(csv.includes('"Show; ""VIP"""'));
});
