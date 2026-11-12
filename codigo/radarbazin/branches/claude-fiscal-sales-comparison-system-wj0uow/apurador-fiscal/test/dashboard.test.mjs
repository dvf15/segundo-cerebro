import { test } from 'node:test'
import assert from 'node:assert/strict'
import { dashFiscal, dashTriangulacao, dashSocietario } from '../src/dashboard.js'
import { acompanhamentoVazio, normalizarLojista, registroDe, cicloAtual } from '../src/acompanhamento.js'
import { registroSocietario } from '../src/societario.js'

const hoje = new Date(2026, 9, 17)
function carteira () {
  const a = acompanhamentoVazio()
  a.lojistas = ['11222333000181', '11222333000262', '12345678000195', '45678912000155']
    .map((c, i) => normalizarLojista({ cnpj: c, nome: 'L' + i, uf: 'SP', inicioContrato: '2020-01-01' }))
  return a
}

test('fiscal: % por marco sobre os ativos e evolução acumulada por mês', () => {
  const a = carteira(); const c = cicloAtual(hoje)
  Object.assign(registroDe(a, c.chave, '11222333000181'), { recebido: '2026-04-20', auditado: '2026-06-02', negociado: '2026-07-01', cobrado: '2026-08-10' })
  Object.assign(registroDe(a, c.chave, '11222333000262'), { recebido: '2026-05-03', valores: { divergencia: 1200 } })
  const d = dashFiscal(a, c)
  assert.deepEqual(d.etapas.map(e => e.pct), [50, 25, 25, 25])
  const rec = d.series.find(s => s.chave === 'recebido').pontos
  assert.deepEqual(rec.slice(0, 3).map(p => p.qtd), [1, 2, 2])
  assert.equal(d.series.find(s => s.chave === 'cobrado').pontos[4].qtd, 1)   // agosto
  assert.equal(d.valores.divergencia, 1200)
  assert.equal(d.pendencias[0].lista.length, 2); assert.equal(d.pendencias[1].lista.length, 1)
})

test('triangulação: etapas na competência de referência, variação em R$ por mês e pendências', () => {
  const a = carteira()
  const hist = [
    { cnpj: '11222333000181', competencia: '2026-08', z: 100000, pdv: 102500, napp: 101000, declarado: 100000, amplitude: 2500, naoDeclarado: 2500, fechado: true },
    { cnpj: '11222333000262', competencia: '2026-08', z: 50000, pdv: 50000, declarado: null, amplitude: 0, fechado: true },
    { cnpj: '11222333000181', competencia: '2026-09', z: 100000, pdv: null, declarado: null, amplitude: null, fechado: false },
  ]
  const d = dashTriangulacao(a, hist)
  assert.equal(d.referencia, '2026-09')
  assert.deepEqual(d.etapas.map(e => e.rotulo), ['Redução Z recebida', 'Relatório de PDV recebido', 'NAPP recebido', 'Declarado (ficha) presente', 'Mês fechado'])
  assert.deepEqual(d.etapas.map(e => e.qtd), [1, 0, 0, 0, 0])
  const d8 = dashTriangulacao(a, hist, { competencia: '2026-08' })
  assert.deepEqual(d8.etapas.map(e => e.pct), [50, 50, 25, 25, 50])
  const ago = d.dispersao.find(x => x.competencia === '2026-08')
  assert.equal(ago.media, 1250); assert.equal(ago.maxima, 2500); assert.equal(ago.naoDeclarado, 2500); assert.equal(ago.fechada, true)
  assert.equal(d.pendencias[2].lista.length, 1)   // setembro aberto
  assert.match(d.pendencias[3].rotulo, /Variação acima de R\$\s1\.000,00/)
  assert.equal(d.pendencias[3].lista.length, 1)   // R$ 2.500 de variação > R$ 1.000
  assert.equal(dashTriangulacao(a, []).referencia, null)
})

test('societário: pesquisados, contatados, TT encontrada e % faturado', () => {
  const a = carteira()
  Object.assign(registroSocietario(a, '11222333000181'), { houveMudanca: true, dataMudanca: '2026-06-10', tipo: 'capital', isencao: 'nao',
    validadoEm: '2026-08-01', cobrar: true, notificacoes: { n1: '2026-08-02' }, valores: { taxa: 20000, cobrado: 5000 } })
  Object.assign(registroSocietario(a, '11222333000262'), { houveMudanca: false, consultadoEm: '2026-09-01' })
  Object.assign(registroSocietario(a, '12345678000195'), { indicio: 'sim' })
  const d = dashSocietario(a, hoje)
  assert.equal(d.etapas[0].qtd, 3); assert.equal(d.etapas[0].pct, 75)
  assert.equal(d.etapas[4].qtd, 1); assert.equal(d.etapas[4].total, 1)
  assert.equal(d.ttEncontrada, 20000); assert.equal(d.ttFaturada, 5000); assert.equal(d.pctFaturado, 25)
  assert.equal(d.pendencias[0].lista.length, 1); assert.equal(d.pendencias[1].lista.length, 1)
})

test('base fictícia: CNPJs válidos e únicos, todos os processos com dados e pendências', async () => {
  const { gerarBaseFicticia, lojistasFicticiosCsv } = await import('../src/basefic.js')
  const { cnpjValido, importarLojistas } = await import('../src/acompanhamento.js')
  const { historicoParaCruzamento } = await import('../src/acompanhamento.js')
  const b = gerarBaseFicticia(hoje)
  assert.equal(b.lojistas.length, 40)
  assert.ok(b.lojistas.every(l => cnpjValido(l.cnpj)))
  assert.equal(new Set(b.lojistas.map(l => l.cnpj)).size, 40)
  assert.deepEqual(gerarBaseFicticia(hoje), b)   // determinística
  const f = dashFiscal(b, cicloAtual(hoje))
  assert.ok(f.etapas[0].pct > 0 && f.etapas[3].pct > 0)
  assert.ok(f.pendencias.every(p => p.lista.length > 0))
  const t = dashTriangulacao(b, historicoParaCruzamento(b.fechamentos, []), { atencaoPercent: 2 })
  assert.equal(t.dispersao.length, 6); assert.ok(t.pendencias[3].lista.length > 0)
  const s = dashSocietario(b, hoje)
  assert.ok(s.ttEncontrada > 0 && s.ttFaturada > 0)
  // a carteira em CSV volta inteira pela importação da aba Lojistas
  const linhas = lojistasFicticiosCsv(b).replace('﻿', '').trim().split('\r\n').map(l => l.split(';'))
  const imp = importarLojistas(linhas)
  assert.equal(imp.lojistas.length, 40); assert.equal(imp.lojistas[5].inicioContrato, b.lojistas[5].inicioContrato)
})

test('base fictícia: 27 cenários fixos cobrindo cada situação', async () => {
  const { gerarBaseFicticia, roteiroMarkdown } = await import('../src/basefic.js')
  const { situacaoSocietaria, STATUS_SOC } = await import('../src/societario.js')
  const { situacao, STATUS_LIVRO } = await import('../src/acompanhamento.js')
  const b = gerarBaseFicticia(hoje); const c = cicloAtual(hoje)
  assert.equal(b.cenarios.length, 27)
  const soc = new Set(b.lojistas.slice(0, 22).map(l => situacaoSocietaria(l, b.societario[l.cnpj], hoje).status))
  for (const st of [STATUS_SOC.NAO_CONSULTADO, STATUS_SOC.SEM_INDICIO, STATUS_SOC.SEM_MUDANCA, STATUS_SOC.ANTERIOR_CONTRATO, STATUS_SOC.OUTRA_ALTERACAO,
    STATUS_SOC.FALTA_DATA, STATUS_SOC.SINALIZADO, STATUS_SOC.ISENTO, STATUS_SOC.EM_COBRANCA, STATUS_SOC.NEGOCIADO, STATUS_SOC.COBRADO]) assert.ok(soc.has(st), st)
  const fis = new Set(b.lojistas.slice(0, 8).map(l => situacao(l, b.ciclos[c.chave][l.cnpj], c).status))
  for (const st of Object.values(STATUS_LIVRO)) assert.ok(fis.has(st), st)
  assert.match(roteiroMarkdown(b), /\| 27 \|/)
})
