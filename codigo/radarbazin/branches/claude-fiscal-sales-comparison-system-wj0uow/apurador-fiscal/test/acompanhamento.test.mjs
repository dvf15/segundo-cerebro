import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cicloAtual, mesesDoCiclo, ETAPAS, STATUS_LIVRO, acompanhamentoVazio, normalizarLojista, importarLojistas,
  mesclarLojistas, registroDe, cnpjValido, statusDoRegistro, situacao, resumoPainel, textoNotificacao, fecharMes,
  historicoParaCruzamento, acompanhamentoCsv } from '../src/acompanhamento.js'

/* ---- ciclo ---- */

test('ciclo: em setembro de 2026 o ciclo é 2026, livros de 2025, sexto mês', () => {
  const c = cicloAtual(new Date(2026, 8, 26))
  assert.equal(c.ano, 2026); assert.equal(c.anoLivros, 2025)
  assert.equal(c.inicio, '2026-04-01'); assert.equal(c.mesesDecorridos, 6)
})
test('ciclo: em março o ciclo ainda é o do ano anterior', () => {
  const c = cicloAtual(new Date(2027, 2, 15))
  assert.equal(c.ano, 2026); assert.equal(c.mesesDecorridos, 12)
})
test('ciclo: 1º de abril é o primeiro mês', () => {
  assert.equal(cicloAtual(new Date(2026, 3, 1)).mesesDecorridos, 1)
  assert.deepEqual(mesesDoCiclo(cicloAtual(new Date(2026, 5, 10))), ['2026-04', '2026-05', '2026-06'])
})

/* ---- carteira ---- */

test('lojista: CNPJ normalizado, regime detectado, telefone só dígitos', () => {
  const l = normalizarLojista({ cnpj: '11.222.333/0001-81', nome: ' Bela ', regime: 'Simples Nacional', telefone: '(11) 9 8888-7777' })
  assert.equal(l.cnpj, '11222333000181'); assert.equal(l.nome, 'Bela'); assert.equal(l.regime, 'simples')
  assert.equal(l.telefone, '1198888777'.slice(0, 0) + '11988887777'); assert.equal(l.ativo, true)
})
test('importar: reconhece o cabeçalho, recusa CNPJ inválido e repetido', () => {
  const r = importarLojistas([
    ['Relação de lojistas — Shopping X'],
    ['LUC', 'Loja', 'Razão Social', 'CNPJ', 'E-mail', 'WhatsApp', 'Regime'],
    ['101', 'Bela', 'BELA COSMETICOS LTDA', '11.222.333/0001-81', 'a@b.com', '11 98888-7777', 'Simples'],
    ['102', 'Bela 2', 'BELA COSMETICOS LTDA', '11.222.333/0002-62', '', '', 'Lucro presumido'],
    ['103', 'Ruim', '', '123', '', '', ''],
    ['104', 'Repetida', '', '11.222.333/0001-81', '', '', ''],
  ])
  assert.equal(r.lojistas.length, 2)
  assert.equal(r.lojistas[0].luc, '101'); assert.equal(r.lojistas[0].regime, 'simples'); assert.equal(r.lojistas[1].regime, 'normal')
  assert.equal(r.avisos.length, 2)
})
test('mesclar: CNPJ existente é atualizado, não duplicado', () => {
  const base = [normalizarLojista({ cnpj: '11222333000181', nome: 'Bela', email: 'x@y' })]
  const r = mesclarLojistas(base, [normalizarLojista({ cnpj: '11.222.333/0001-81', nome: 'Bela Cosméticos', email: '' }),
    normalizarLojista({ cnpj: '11222333000262', nome: 'Filial' })])
  assert.equal(r.lojistas.length, 2); assert.equal(r.inseridos, 1); assert.equal(r.atualizados, 1)
  assert.equal(r.lojistas[0].nome, 'Bela Cosméticos'); assert.equal(r.lojistas[0].email, 'x@y')  // vazio não apaga
})

/* ---- pipeline e notificações ---- */

test('status: o marco mais avançado com data manda', () => {
  assert.equal(statusDoRegistro(null), STATUS_LIVRO.NAO_RECEBIDO)
  assert.equal(statusDoRegistro({ recebido: '2026-04-10' }), STATUS_LIVRO.RECEBIDO)
  assert.equal(statusDoRegistro({ recebido: '2026-04-10', auditado: '2026-05-02', cobrado: '2026-06-01' }), STATUS_LIVRO.COBRADO)
})
test('situação: no sexto mês sem livros e sem nada feito, a etapa devida é a 1ª e há 5 atrasadas', () => {
  const ciclo = cicloAtual(new Date(2026, 8, 26))
  const s = situacao({ cnpj: 'x' }, null, ciclo)
  assert.equal(s.devida.chave, 'n1'); assert.equal(s.atrasadas, 5); assert.equal(s.multada, false)
})
test('situação: feitas as três notificações no quarto mês, a devida é o aviso de multa', () => {
  const ciclo = cicloAtual(new Date(2026, 6, 5))  // julho = mês 4
  const s = situacao({ cnpj: 'x' }, { notificacoes: { n1: '2026-04-05', n2: '2026-05-05', n3: '2026-06-05' } }, ciclo)
  assert.equal(s.devida.chave, 'aviso'); assert.equal(s.atrasadas, 1)
})
test('situação: em maio só a 2ª é devida — a multa ainda não chegou no calendário', () => {
  const ciclo = cicloAtual(new Date(2026, 4, 20))
  const s = situacao({ cnpj: 'x' }, { notificacoes: { n1: '2026-04-05' } }, ciclo)
  assert.equal(s.devida.chave, 'n2'); assert.equal(s.atrasadas, 1)
})
test('situação: quem entregou sai do fluxo, com o histórico preservado', () => {
  const ciclo = cicloAtual(new Date(2026, 8, 26))
  const s = situacao({ cnpj: 'x' }, { recebido: '2026-06-01', notificacoes: { n1: '2026-04-05', n2: '2026-05-05' } }, ciclo)
  assert.equal(s.devida, null); assert.equal(s.status, STATUS_LIVRO.RECEBIDO); assert.deepEqual(s.etapasFeitas, ['n1', 'n2'])
})
test('painel: contagem por status, recebimento acumulado por mês e pendentes', () => {
  const a = acompanhamentoVazio()
  a.lojistas = ['11222333000181', '11222333000262', '99888777000164', '55444333000107'].map((c, i) => normalizarLojista({ cnpj: c, nome: 'L' + i }))
  a.lojistas[3].ativo = false
  const ciclo = cicloAtual(new Date(2026, 8, 26))
  registroDe(a, ciclo.chave, '11222333000181').recebido = '2026-04-20'
  Object.assign(registroDe(a, ciclo.chave, '11222333000262'), { recebido: '2026-06-03', auditado: '2026-07-01', valores: { divergencia: 1500 } })
  registroDe(a, ciclo.chave, '99888777000164').notificacoes = { n1: '2026-04-30', n2: '2026-05-30', n3: '2026-06-30', aviso: '2026-07-30', multa: '2026-08-30' }
  const r = resumoPainel(a, ciclo)
  assert.equal(r.contagem.total, 3)
  assert.equal(r.contagem[STATUS_LIVRO.RECEBIDO], 1); assert.equal(r.contagem[STATUS_LIVRO.AUDITADO], 1); assert.equal(r.contagem[STATUS_LIVRO.NAO_RECEBIDO], 1)
  assert.deepEqual(r.porMes.map(p => p.acumulado), [1, 1, 2, 2, 2, 2])
  assert.equal(r.pendentes.length, 0)          // o multado já cumpriu as 5 etapas
  assert.equal(r.multados.length, 1)
  assert.equal(r.valores.divergencia, 1500)
  assert.equal(r.percentualRecebido, 66.7)
})
test('notificação: os textos trazem o ano dos livros, o nome, a LUC e o prazo', () => {
  const ciclo = cicloAtual(new Date(2026, 8, 26))
  const loj = normalizarLojista({ cnpj: '11222333000181', nome: 'Bela', luc: '101', email: 'a@b.com', telefone: '11988887777' })
  for (const e of ETAPAS) {
    const t = textoNotificacao(e.chave, loj, ciclo, { shopping: 'o Shopping Teste', prazoDias: 7 })
    assert.match(t.assunto, /2025/); assert.match(t.corpo, /Bela \(LUC 101\)/)
    if (e.chave !== 'multa') assert.match(t.corpo, /7 dias/)
    assert.match(t.mailto, /^mailto:a%40b\.com\?subject=/); assert.match(t.whatsapp, /^https:\/\/wa\.me\/11988887777\?text=/)
  }
  assert.match(textoNotificacao('multa', loj, ciclo).corpo, /fica aplicada/)
})

/* ---- fechamento mensal ---- */

test('fechar mês: vira histórico e fechar de novo substitui', () => {
  const porMes = [
    { cnpj: 'a', competencia: '2026-08', z: 100, pdv: 110, declarado: 100, dispersao: 9.09, amplitude: 10, status: 'DISPERSO', alertas: [{ tipo: 'x', grave: true, texto: 't' }] },
    { cnpj: 'a', competencia: '2026-09', z: 50, pdv: 50, declarado: null, dispersao: 0, amplitude: 0, status: 'COERENTE', alertas: [] },
  ]
  let f = fecharMes([], porMes, '2026-08', new Date(2026, 8, 2)).fechamentos
  assert.equal(f.length, 1); assert.equal(f[0].fechadoEm, '2026-09-02'); assert.equal(f[0].alertas[0].grave, true)
  f = fecharMes(f, [{ ...porMes[0], pdv: 100, dispersao: 0, status: 'COERENTE', alertas: [] }], '2026-08').fechamentos
  assert.equal(f.length, 1); assert.equal(f[0].pdv, 100)
  const h = historicoParaCruzamento(f, porMes)
  assert.equal(h.length, 2); assert.equal(h[0].fechado, true); assert.equal(h[1].fechado, false); assert.equal(h[1].competencia, '2026-09')
})
test('csv do acompanhamento: uma linha por lojista com a etapa devida', () => {
  const a = acompanhamentoVazio()
  a.lojistas = [normalizarLojista({ cnpj: '11222333000181', nome: 'Bela;Cia' })]
  const csv = acompanhamentoCsv(resumoPainel(a, cicloAtual(new Date(2026, 3, 15))))
  assert.match(csv, /"Bela;Cia"/); assert.match(csv, /1ª notificação/)
})

test('cnpj válido: confere os dígitos verificadores', () => {
  assert.equal(cnpjValido('11.222.333/0001-81'), true)
  assert.equal(cnpjValido('11222333000182'), false)
  assert.equal(cnpjValido('11111111111111'), false)
  assert.equal(cnpjValido('123'), false)
})
