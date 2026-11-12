import { test } from 'node:test'
import assert from 'node:assert/strict'
import { UFS, JUNTAS, linksPesquisa, STATUS_SOC, registroSocietario, mudancaRecente, situacaoSocietaria, resumoSocietario,
  textoTaxa, rotuloEtapaTaxa, societarioCsv } from '../src/societario.js'
import { acompanhamentoVazio, normalizarLojista, ETAPAS } from '../src/acompanhamento.js'

const hoje = new Date(2026, 9, 14)   // 14/10/2026
const loj = normalizarLojista({ cnpj: '11222333000181', nome: 'Bela', razao: 'BELA COSMETICOS LTDA', luc: '101', uf: 'SP', email: 'a@b.com', telefone: '11988887777', inicioContrato: '15/03/2021' })

test('juntas: todas as 27 UF têm Junta com URL https/http', () => {
  assert.equal(UFS.length, 27)
  for (const uf of UFS) { assert.ok(JUNTAS[uf], uf); assert.match(JUNTAS[uf].url, /^https?:\/\//) }
})
test('links: Junta do estado do contrato, busca de apoio com o CNPJ e a Receita', () => {
  const l = linksPesquisa(loj)
  assert.equal(l.junta.sigla, 'JUCESP'); assert.match(l.busca, /11\.222\.333/); assert.match(l.receita, /receita\.fazenda/)
  assert.equal(linksPesquisa({ cnpj: '11222333000181', uf: '' }).junta, null)
})
test('mudança recente: dentro dos 12 meses sim, fora não, futuro não', () => {
  assert.equal(mudancaRecente('2026-03-01', hoje), true)
  assert.equal(mudancaRecente('2025-10-14', hoje), true)
  assert.equal(mudancaRecente('2025-10-13', hoje), false)
  assert.equal(mudancaRecente('2026-11-01', hoje), false)
  assert.equal(mudancaRecente(null, hoje), false)
})
test('situação: não consultado → sem mudança → antiga → sinalizada → a validar', () => {
  assert.equal(situacaoSocietaria(loj, null, hoje).status, STATUS_SOC.NAO_CONSULTADO)
  assert.equal(situacaoSocietaria(loj, { houveMudanca: false }, hoje).status, STATUS_SOC.SEM_MUDANCA)
  assert.equal(situacaoSocietaria(loj, { houveMudanca: true, dataMudanca: '2024-01-01' }, hoje).status, STATUS_SOC.MUDANCA_ANTIGA)
  const s = situacaoSocietaria(loj, { houveMudanca: true, dataMudanca: '2026-06-10' }, hoje)
  assert.equal(s.status, STATUS_SOC.SINALIZADO); assert.equal(s.precisaValidar, true); assert.equal(s.devida, null)
})
test('situação: isento validado encerra; cobrança confirmada abre o fluxo a partir da validação', () => {
  assert.equal(situacaoSocietaria(loj, { houveMudanca: true, dataMudanca: '2026-06-10', isencao: 'sim', validadoEm: '2026-07-01' }, hoje).status, STATUS_SOC.ISENTO)
  const s = situacaoSocietaria(loj, { houveMudanca: true, dataMudanca: '2026-06-10', isencao: 'nao', limite: 'até 25% das quotas', validadoEm: '2026-08-20', cobrar: true }, hoje)
  assert.equal(s.status, STATUS_SOC.EM_COBRANCA); assert.equal(s.precisaValidar, false)
  assert.equal(s.devida.chave, 'n1'); assert.equal(s.atrasadas, 3)   // ago, set, out = 3 meses → 3 etapas devidas
  const s2 = situacaoSocietaria(loj, { houveMudanca: true, dataMudanca: '2026-06-10', validadoEm: '2026-10-02', cobrar: true, notificacoes: { n1: '2026-10-02' } }, hoje)
  assert.equal(s2.devida, null); assert.equal(s2.atrasadas, 0)
  assert.equal(situacaoSocietaria(loj, { houveMudanca: true, dataMudanca: '2026-06-10', validadoEm: '2026-08-20', cobrar: true, negociado: '2026-09-01' }, hoje).status, STATUS_SOC.NEGOCIADO)
  assert.equal(situacaoSocietaria(loj, { houveMudanca: true, dataMudanca: '2026-06-10', validadoEm: '2026-08-20', cobrar: true, cobrado: '2026-09-15' }, hoje).status, STATUS_SOC.COBRADO)
})
test('resumo: contagens, a validar, pendentes e valores', () => {
  const a = acompanhamentoVazio()
  a.lojistas = [loj, normalizarLojista({ cnpj: '11222333000262', nome: 'Q', uf: 'RJ' }), normalizarLojista({ cnpj: '12345678000195', nome: 'C', uf: 'MG' })]
  Object.assign(registroSocietario(a, '11222333000181'), { houveMudanca: true, dataMudanca: '2026-06-10' })
  Object.assign(registroSocietario(a, '11222333000262'), { houveMudanca: true, dataMudanca: '2026-05-01', validadoEm: '2026-09-01', cobrar: true, valores: { taxa: 15000 } })
  const r = resumoSocietario(a, hoje)
  assert.equal(r.contagem[STATUS_SOC.SINALIZADO], 1); assert.equal(r.contagem[STATUS_SOC.EM_COBRANCA], 1); assert.equal(r.contagem[STATUS_SOC.NAO_CONSULTADO], 1)
  assert.equal(r.aValidar.length, 1); assert.equal(r.pendentes.length, 1); assert.equal(r.pendentes[0].devida.chave, 'n1')
  assert.equal(r.valores.taxa, 15000); assert.equal(r.sinalizados.length, 2)
})
test('textos da taxa: cada etapa cita a alteração, a cláusula e o valor; a última é lançamento', () => {
  const reg = { dataMudanca: '2026-06-10', tipo: 'entrada_saida', registro: '123/2026', limite: 'até 25% das quotas entre sócios', valores: { taxa: 15000 } }
  for (const e of ETAPAS) {
    const t = textoTaxa(e.chave, loj, reg, { shopping: 'o Shopping Teste', prazoDias: 7, clausulaTaxa: 'a taxa de transferência de 3 aluguéis (cláusula 20)' })
    assert.match(t.corpo, /Bela \(LUC 101\)/); assert.match(t.corpo, /cláusula 20/); assert.match(t.corpo, /15\.000,00/)
    assert.match(t.corpo, /10\/06\/2026/); assert.match(t.mailto, /^mailto:a%40b\.com/)
  }
  assert.match(textoTaxa('n1', loj, reg).corpo, /até 25% das quotas/)
  assert.match(textoTaxa('multa', loj, reg).assunto, /Lançamento/)
  assert.equal(rotuloEtapaTaxa(ETAPAS[4]), 'Taxa lançada'); assert.equal(rotuloEtapaTaxa(ETAPAS[0]), '1ª notificação')
})
test('csv: uma linha por lojista com a Junta do estado', () => {
  const a = acompanhamentoVazio(); a.lojistas = [loj]
  Object.assign(registroSocietario(a, loj.cnpj), { houveMudanca: true, dataMudanca: '2026-06-10' })
  const csv = societarioCsv(resumoSocietario(a, hoje))
  assert.match(csv, /JUCESP/); assert.match(csv, /MUDANÇA NOS ÚLTIMOS 12 MESES/)
})

test('racional: alteração anterior ao início do contrato não é TT; "outra" não sinaliza; triagem conta guias', () => {
  assert.equal(loj.inicioContrato, '2021-03-15')
  const tarde = normalizarLojista({ cnpj: '11222333000262', nome: 'Q', uf: 'SP', inicioContrato: '2026-08-01' })
  assert.equal(situacaoSocietaria(tarde, { houveMudanca: true, dataMudanca: '2026-06-10', tipo: 'capital' }, hoje).status, STATUS_SOC.ANTERIOR_CONTRATO)
  assert.equal(situacaoSocietaria(tarde, { houveMudanca: true, dataMudanca: '2026-09-10', tipo: 'capital' }, hoje).status, STATUS_SOC.SINALIZADO)
  assert.equal(situacaoSocietaria(loj, { houveMudanca: true, dataMudanca: '2026-06-10', tipo: 'outra' }, hoje).status, STATUS_SOC.OUTRA_ALTERACAO)
  for (const causa of ['capital', 'socio_admin', 'entrada_saida', 'objeto', 'cessao']) {
    assert.equal(situacaoSocietaria(loj, { houveMudanca: true, dataMudanca: '2026-06-10', tipo: causa }, hoje).status, STATUS_SOC.SINALIZADO, causa)
  }
  assert.equal(situacaoSocietaria(loj, { indicio: 'nao' }, hoje).status, STATUS_SOC.SEM_INDICIO)
  const s = situacaoSocietaria(loj, { indicio: 'sim' }, hoje)
  assert.equal(s.status, STATUS_SOC.NAO_CONSULTADO); assert.equal(s.guiaAPagar, true)
  assert.equal(situacaoSocietaria(loj, { indicio: 'sim', guiaPagaEm: '2026-10-01' }, hoje).guiaAPagar, false)
  const a = acompanhamentoVazio(); a.lojistas = [loj, normalizarLojista({ cnpj: '12345678000195', nome: 'C', uf: 'MG' })]
  Object.assign(registroSocietario(a, loj.cnpj), { indicio: 'sim' })
  const r = resumoSocietario(a, hoje)
  assert.equal(r.guiasAPagar.length, 1); assert.equal(r.semInicioContrato.length, 1)
})

test('checklist da skill: 7 itens, os de certidão não se aplicam sem gatilho', async () => {
  const { checklistTT, PASSOS_JUNTA, MOTIVOS_PESQUISA } = await import('../src/societario.js')
  assert.equal(PASSOS_JUNTA.reduce((a, e) => a + e.passos.length, 0), 17); assert.equal(MOTIVOS_PESQUISA.length, 3)
  const vazio = checklistTT(loj, null)
  assert.equal(vazio.itens.length, 7); assert.equal(vazio.total, 7); assert.equal(vazio.feitos, 1)   // só o início do contrato
  const sem = checklistTT(loj, { nireConfirmado: true, atosListados: true, indicio: 'nao' })
  assert.equal(sem.total, 4); assert.equal(sem.completo, true)
  const antes = checklistTT(loj, { nireConfirmado: true, atosListados: true, houveMudanca: true, dataMudanca: '2020-01-01', tipo: 'capital' })
  assert.equal(antes.gatilho, false); assert.equal(antes.completo, true)   // anterior ao contrato (15/03/2021)
  const com = checklistTT(loj, { nireConfirmado: true, atosListados: true, houveMudanca: true, dataMudanca: '2026-06-10', tipo: 'capital', protocolo: '123', guiaPagaEm: '2026-07-01' })
  assert.equal(com.total, 7); assert.equal(com.feitos, 5)
  const fim = checklistTT(loj, { nireConfirmado: true, atosListados: true, houveMudanca: true, dataMudanca: '2026-06-10', tipo: 'capital', protocolo: '123', guiaPagaEm: '2026-07-01', certidaoBaixadaEm: '2026-07-05', encaminhadoEm: '2026-07-10' })
  assert.equal(fim.completo, true)
  assert.equal(situacaoSocietaria(loj, { guiaPagaEm: '2026-07-01' }, hoje).aguardandoDownload, true)
})

test('revisão: sem data mostra "informe a data"; cobrança validada segue depois dos 12 meses; isento não pede encaminhamento', async () => {
  const { checklistTT } = await import('../src/societario.js')
  assert.equal(situacaoSocietaria(loj, { houveMudanca: true }, hoje).status, STATUS_SOC.FALTA_DATA)
  const velho = { houveMudanca: true, dataMudanca: '2025-06-01', tipo: 'capital', isencao: 'nao', validadoEm: '2025-07-01', cobrar: true, negociado: '2025-08-01' }
  const s = situacaoSocietaria(loj, velho, hoje)
  assert.equal(s.recente, false); assert.equal(s.emCobranca, true); assert.equal(s.status, STATUS_SOC.NEGOCIADO)
  assert.equal(situacaoSocietaria(loj, { houveMudanca: true, dataMudanca: '2025-06-01', tipo: 'capital' }, hoje).status, STATUS_SOC.MUDANCA_ANTIGA)
  const isento = checklistTT(loj, { houveMudanca: true, dataMudanca: '2026-06-10', tipo: 'capital', isencao: 'sim', validadoEm: '2026-07-01', cobrar: false })
  assert.equal(isento.itens.find(i => i.chave === 'encaminhado').naoAplica, true)
})
