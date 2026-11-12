import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizarData, parseReducaoZSped, parseReducaoZImpressa, parseMovimentoTabular, parsePdvImpresso,
  parseMovimentoTexto, triangular, conferirSequencia, cruzarComAuditoria,
  STATUS_TRI, VEREDITO, triangulacaoCsv, resumirFontes, limitesTri } from '../src/triangulacao.js'

/* ------------------------------------------------------------------ datas */

test('data: todas as formas viram AAAA-MM-DD', () => {
  for (const [e, s] of [['15/03/2025', '2025-03-15'], ['2025-03-15', '2025-03-15'], ['15032025', '2025-03-15'],
    ['15/03/25', '2025-03-15'], ['1/3/2025', '2025-03-01'], ['20250315', '2025-03-15'],
    ['32/03/2025', null], ['15/13/2025', null], ['', null], [null, null]]) {
    assert.equal(normalizarData(e), s, `entrada ${e}`)
  }
})

/* -------------------------------------------------------- redução Z SPED */

const SPED_Z = [
  '|0000|017|0|01032025|31032025|LOJA TESTE LTDA|11222333000181||SP|110123456789|3550308|||A|1|',
  '|C400|2D|ECF-IF|SER123|001|',
  '|C405|03032025|1|41|1500|120000,00|3000,00|',
  '|C405|04032025|1|42|1560|124500,00|4500,00|',
  '|C405|05032025|1|43|1610|127000,00|2500,00|',
  '|9999|6|',
].join('\n')

test('redução Z: lê os C405 com CRZ, Grande Total e venda bruta', () => {
  const r = parseReducaoZSped(SPED_Z, 'sped.txt')
  assert.equal(r.movimentos.length, 3)
  const d = r.movimentos[0]
  assert.equal(d.cnpj, '11222333000181')
  assert.equal(d.data, '2025-03-03')
  assert.equal(d.competencia, '2025-03')
  assert.equal(d.fonte, 'z')
  assert.equal(d.crz, 41)
  assert.equal(d.gt, 120000)
  assert.equal(d.valor, 3000)
  assert.equal(d.equipamento, 'ECF-IF SER123 001')
  assert.equal(r.avisos.length, 0)
})

test('redução Z: Grande Total coerente não gera alerta', () => {
  // 124500 - 120000 = 4500 (venda do dia 04) e 127000 - 124500 = 2500 (dia 05)
  assert.deepEqual(conferirSequencia(parseReducaoZSped(SPED_Z).movimentos), [])
})

test('redução Z: salto no contador CRZ é acusado', () => {
  const comSalto = SPED_Z.replace('|C405|05032025|1|43|', '|C405|05032025|1|46|')
  const alertas = conferirSequencia(parseReducaoZSped(comSalto).movimentos)
  const a = alertas.find(x => x.tipo === 'crz_com_salto')
  assert.ok(a, 'precisa acusar o salto')
  assert.match(a.texto, /3 redução/)
  assert.equal(a.grave, true)
})

test('redução Z: Grande Total que não fecha com a venda do dia é acusado', () => {
  // o GT avança 9.500 mas o dia declara 2.500 de venda bruta
  const adulterado = SPED_Z.replace('|127000,00|2500,00|', '|134000,00|2500,00|')
  const a = conferirSequencia(parseReducaoZSped(adulterado).movimentos)
    .find(x => x.tipo === 'grande_total_nao_fecha')
  assert.ok(a)
  assert.match(a.texto.replace(/ /g, ' '), /sobra R\$ 7\.000,00/)
})

test('redução Z: Grande Total que retrocede é acusado — ele é acumulador', () => {
  const adulterado = SPED_Z.replace('|127000,00|2500,00|', '|119000,00|2500,00|')
  const alertas = conferirSequencia(parseReducaoZSped(adulterado).movimentos)
  assert.ok(alertas.some(x => x.tipo === 'grande_total_retrocede'))
})

/* -------------------------------------------------- redução Z impressa */

const Z_IMPRESSA = `LOJA TESTE LTDA
CNPJ: 11.222.333/0001-81
REDUÇÃO Z
Data: 03/03/2025
COO: 001500
CRZ: 0041
CRO: 001
VENDA BRUTA DIÁRIA: 3.000,00
GRANDE TOTAL: 120.000,00
------------------------------
REDUÇÃO Z
Data: 04/03/2025
COO: 001560
CRZ: 0042
VENDA BRUTA DIÁRIA: 4.500,00
GRANDE TOTAL: 124.500,00`

test('redução Z impressa: lê bloco a bloco, por rótulo', () => {
  const r = parseReducaoZImpressa(Z_IMPRESSA, 'z.pdf')
  assert.equal(r.movimentos.length, 2)
  assert.equal(r.movimentos[0].valor, 3000)
  assert.equal(r.movimentos[0].crz, 41)
  assert.equal(r.movimentos[0].gt, 120000)
  assert.equal(r.movimentos[0].cnpj, '11222333000181')
  assert.equal(r.movimentos[1].data, '2025-03-04')
})

test('formato: o despachante reconhece SPED e Z impressa', () => {
  assert.equal(parseMovimentoTexto(SPED_Z).movimentos.length, 3)
  assert.equal(parseMovimentoTexto(Z_IMPRESSA).movimentos.length, 2)
  assert.equal(parseMovimentoTexto('qualquer coisa').movimentos.length, 0)
})

/* ---------------------------------------------------------------- PDV */

const PDV = [
  ['Relatório de vendas por dia'], [],
  ['Data', 'Terminal', 'Forma de pagamento', 'Valor'],
  ['03/03/2025', 'PDV1', 'Dinheiro', '1.000,00'],
  ['03/03/2025', 'PDV1', 'Cartão', '2.000,00'],
  ['04/03/2025', 'PDV1', 'Cartão', '4.500,00'],
  ['05/03/2025', 'PDV1', 'Cartão', '3.900,00'],
]

test('PDV: linhas do mesmo dia são somadas', () => {
  const r = parseMovimentoTabular(PDV, { fonte: 'pdv', cnpjPadrao: '11222333000181', arquivo: 'pdv.xlsx' })
  assert.equal(r.movimentos.length, 4)
  const { porDia } = triangular(r.movimentos)
  assert.equal(porDia.find(d => d.data === '2025-03-03').pdv, 3000, '1.000 + 2.000 do mesmo dia')
})

/* -------------------------------------------------------- triangulação */

function cenario () {
  const z = parseReducaoZSped(SPED_Z).movimentos
  const pdv = parseMovimentoTabular(PDV, { fonte: 'pdv', cnpjPadrao: '11222333000181' }).movimentos
  return { z, pdv }
}

test('triangulação: dia que bate e dia que não bate', () => {
  const { z, pdv } = cenario()
  const { porDia } = triangular([...z, ...pdv])
  const em = (d) => porDia.find(x => x.data === d)
  assert.equal(em('2025-03-03').status, STATUS_TRI.COERENTE, '3.000 dos dois lados')
  assert.equal(em('2025-03-04').status, STATUS_TRI.COERENTE, '4.500 dos dois lados')
  // dia 05: Z 2.500 x PDV 3.900 -> 1.400 vendidos sem cupom
  assert.equal(em('2025-03-05').dif, -1400)
  assert.equal(em('2025-03-05').status, STATUS_TRI.DISPERSO)
})

test('triangulação: PDV acima da Z é lido como venda sem documento fiscal', () => {
  const { z, pdv } = cenario()
  const { porMes } = triangular([...z, ...pdv])
  const m = porMes[0]
  assert.equal(m.z, 10000)
  assert.equal(m.pdv, 11400)
  assert.equal(m.difZP, -1400)
  const a = m.alertas.find(x => x.tipo === 'venda_sem_documento')
  assert.ok(a, 'precisa nomear o caso')
  assert.equal(a.grave, true)
})

test('triangulação: declarado a menor que o próprio equipamento fiscal', () => {
  const { z, pdv } = cenario()
  const { porMes } = triangular([...z, ...pdv],
    [{ cnpj: '11222333000181', competencia: '2025-03', valor: 8000 }])
  const m = porMes[0]
  assert.equal(m.declarado, 8000)
  assert.equal(m.difDZ, -2000)
  assert.ok(m.alertas.some(a => a.tipo === 'declarado_a_menor' && a.grave))
  // dispersão = (11400 - 8000) / 11400
  assert.equal(m.dispersao, 29.82)
  assert.equal(m.status, STATUS_TRI.DISPERSO)
})

test('triangulação: com uma fonte só não finge concordância', () => {
  const { z } = cenario()
  const { porMes } = triangular(z)
  assert.equal(porMes[0].status, STATUS_TRI.FONTE_UNICA)
  assert.equal(porMes[0].dispersao, null)
  assert.match(porMes[0].explicacao, /Falta uma segunda fonte/)
})

test('triangulação: três fontes iguais ficam coerentes', () => {
  const z = parseReducaoZSped(SPED_Z).movimentos
  const pdv = z.map(m => ({ ...m, fonte: 'pdv' }))
  const { porMes } = triangular([...z, ...pdv], [{ cnpj: '11222333000181', competencia: '2025-03', valor: 10000 }])
  assert.equal(porMes[0].status, STATUS_TRI.COERENTE)
  assert.equal(porMes[0].dispersao, 0)
  assert.equal(porMes[0].alertas.length, 0)
})

test('triangulação: o maior valor e de qual tipo de lançamento ele vem', () => {
  const r = resumirFontes({ z: 100000, pdv: 100300, napp: 104500, declarado: 98000 })
  assert.equal(r.maior, 104500)
  assert.deepEqual(r.fonteMaior, ['napp'])
  assert.equal(r.amplitude, 6500, 'maior − menor')
  assert.equal(r.naoDeclarado, 6500, 'maior − declarado')
  assert.equal(r.status, STATUS_TRI.DISPERSO)
  assert.deepEqual(resumirFontes({ z: 500, pdv: 500 }).fonteMaior, ['z', 'pdv'], 'empate: os dois são o maior')
})

test('triangulação: o status vem da maior variação em R$, não do percentual', () => {
  // R$ 80 de variação em R$ 1.000 é 8%, mas fica dentro do limite em reais
  assert.equal(resumirFontes({ z: 1000, pdv: 1080 }).status, STATUS_TRI.COERENTE)
  // R$ 600 em R$ 900 mil é 0,07%, mas passa do limite de coerência
  assert.equal(resumirFontes({ z: 900000, pdv: 900600 }).status, STATUS_TRI.ATENCAO)
  assert.equal(resumirFontes({ z: 900000, pdv: 901600 }).status, STATUS_TRI.DISPERSO)
  // os limites são editáveis
  assert.equal(resumirFontes({ z: 900000, pdv: 901600 }, { triAtencaoReais: 2000 }).status, STATUS_TRI.ATENCAO)
  assert.deepEqual(limitesTri({}), { coerente: 100, atencao: 1000, dia: 100 })
})

test('NAPP: planilha diária pelo número da loja entra como quarto tipo de lançamento', () => {
  const linhas = [['Data', 'Loja', 'Nome fantasia', 'Venda'], ['01/03/2025', '101', 'Bela', '3.100,00'], ['02/03/2025', '101', 'Bela', '4.600,00']]
  const r = parseMovimentoTabular(linhas, { fonte: 'napp' })
  assert.equal(r.movimentos.length, 2)
  assert.equal(r.movimentos[0].cnpj, null, 'número da loja não vira CNPJ')
  assert.equal(r.movimentos[0].luc, '101')
  assert.equal(r.movimentos[0].fonte, 'napp')
  // ligado ao CNPJ (o app faz pela carteira), cruza com Z e PDV no mesmo dia e no mês
  const napp = r.movimentos.map(m => ({ ...m, cnpj: '11222333000181' }))
  const { z, pdv } = cenario()
  const { porMes, porDia } = triangular([...z, ...pdv, ...napp.map(m => ({ ...m, data: m.data.replace('-03-01', '-03-03').replace('-03-02', '-03-04'), competencia: '2025-03' }))])
  assert.equal(porMes[0].napp, 7700)
  assert.equal(porMes[0].diasNapp, 2)
  assert.deepEqual(porMes[0].fonteMaior, ['pdv'])
  const d3 = porDia.find(d => d.data === '2025-03-03')
  assert.equal(d3.napp, 3100); assert.deepEqual(d3.fonteMaior, ['napp']); assert.equal(d3.variacao, 100)
})

test('NAPP: cabeçalho fora do padrão entra pelo mapeamento manual de colunas', () => {
  const linhas = [['Dia', 'Unidade', 'Faturado'], ['05/03/2025', '101', '1.500,00']]
  assert.equal(parseMovimentoTabular(linhas, { fonte: 'napp' }).movimentos.length, 0, 'sem reconhecer, não inventa')
  const r = parseMovimentoTabular(linhas, { fonte: 'napp', mapa: { data: 0, luc: 1, valor: 2 } })
  assert.equal(r.movimentos.length, 1)
  assert.deepEqual([r.movimentos[0].data, r.movimentos[0].luc, r.movimentos[0].valor], ['2025-03-05', '101', 1500])
})

test('cruzamento: o NAPP entra como fonte e o veredito sai da maior diferença em R$', () => {
  const { linhas } = cruzarComAuditoria(
    [{ cnpj: '1', competencia: '2025-05', vendasLiquidas: 100000, informado: 100000, livros: ['saidas'], tipo: 'livro', alertas: [] }],
    [{ cnpj: '1', competencia: '2025-05', z: 100000, pdv: 100050, napp: 100700, alertas: [] }])
  const l = linhas[0]
  assert.equal(l.napp, 100700)
  assert.deepEqual(l.fonteMaior, ['napp'])
  assert.equal(l.piorValor, 700)
  assert.equal(l.veredito, VEREDITO.ATENCAO)
})

/* ------------------------------------------- cruzamento com a auditoria */

test('cruzamento: as quatro fontes numa linha, contra o apurado', () => {
  const { z, pdv } = cenario()
  const { porMes } = triangular([...z, ...pdv])
  const fiscais = [{ cnpj: '11222333000181', competencia: '2025-03', vendasLiquidas: 10000,
    informado: 9000, tipo: 'livro', alertas: [] }]
  const { linhas, resumo } = cruzarComAuditoria(fiscais, porMes)
  assert.equal(linhas.length, 1)
  const l = linhas[0]
  assert.equal(l.referencia, 'apurado')
  assert.equal(l.apurado, 10000)
  assert.equal(l.z, 10000)
  assert.equal(l.pdv, 11400)
  assert.equal(l.informado, 9000)
  assert.equal(l.desvios.z.valor, 0)
  assert.equal(l.desvios.pdv.valor, 1400)
  assert.equal(l.desvios.informado.valor, -1000)
  assert.equal(l.fontes, 4)
  assert.equal(l.veredito, VEREDITO.GRAVE, 'há alerta grave vindo da triangulação')
  assert.equal(resumo.pior.piorValor, 1400)
})

test('cruzamento: sem livro fiscal, a redução Z vira a referência', () => {
  const { z, pdv } = cenario()
  const { porMes } = triangular([...z, ...pdv])
  const { linhas } = cruzarComAuditoria([], porMes)
  assert.equal(linhas[0].referencia, 'z')
  assert.equal(linhas[0].apurado, null)
  assert.equal(linhas[0].desvios.pdv.valor, 1400)
})

test('cruzamento: uma fonte só vira FONTES DE MENOS, não "tudo fecha"', () => {
  const { linhas } = cruzarComAuditoria(
    [{ cnpj: '1', competencia: '2025-03', vendasLiquidas: 100, informado: null, alertas: [] }], [])
  assert.equal(linhas[0].veredito, VEREDITO.PARCIAL)
  assert.match(linhas[0].leitura, /Carregue ao menos mais uma fonte/)
})

test('cruzamento: livro sem saídas não vira apurado zero que "fecha" com tudo', () => {
  const { linhas } = cruzarComAuditoria(
    [{ cnpj: '1', competencia: '2025-05', vendasLiquidas: 0, informado: 74000, livros: ['entradas'], tipo: 'livro', alertas: [] }], [])
  assert.equal(linhas[0].apurado, null, 'sem o livro de saídas não há apurado')
  assert.equal(linhas[0].veredito, VEREDITO.PARCIAL)
  assert.match(linhas[0].leitura, /sem apurado nem redução Z/)
  assert.ok(linhas[0].alertas.some(a => a.tipo === 'livro_incompleto'))
})

test('cruzamento: referência zero com diferença não passa por 0%', () => {
  const { linhas } = cruzarComAuditoria(
    [{ cnpj: '1', competencia: '2025-05', vendasLiquidas: 0, informado: 5000, livros: ['saidas'], tipo: 'livro', alertas: [] }], [])
  assert.equal(linhas[0].desvios.informado.percent, null)
  assert.equal(linhas[0].veredito, VEREDITO.GRAVE)
})

test('CSV da triangulação sai com ; e vírgula decimal', () => {
  const { z, pdv } = cenario()
  const csv = triangulacaoCsv(triangular([...z, ...pdv]).porMes)
  assert.ok(csv.startsWith('﻿'))
  assert.ok(csv.includes('11400'))
  assert.ok(csv.includes('Dispersão %'))
})

test('data: oito dígitos ambíguos são resolvidos pela validade, não pela ordem do código', () => {
  assert.equal(normalizarData('15032025'), '2025-03-15', 'ddmmaaaa, como vem no SPED')
  assert.equal(normalizarData('20250315'), '2025-03-15', 'aaaammdd')
  assert.equal(normalizarData('01022025'), '2025-02-01', 'empate resolve como ddmmaaaa quando aaaammdd é inválido')
  assert.equal(normalizarData('99999999'), null)
})

test('PDV: CNPJ num bloco de rótulo acima do cabeçalho é aproveitado', () => {
  const linhas = [
    ['Relatório de vendas — LOJA TESTE LTDA'],
    ['CNPJ', '11.222.333/0001-81'], [],
    ['Data', 'Valor'],
    ['03/03/2025', '3.000,00'],
  ]
  const r = parseMovimentoTabular(linhas, { fonte: 'pdv' })
  assert.equal(r.movimentos.length, 1)
  assert.equal(r.movimentos[0].cnpj, '11222333000181', 'sem isto o arquivo não encontra a redução Z')
  assert.ok(!r.avisos.some(a => /sem CNPJ/.test(a)))
})

test('PDV: coluna de CNPJ ganha do bloco de cabeçalho', () => {
  const linhas = [
    ['CNPJ', '11.222.333/0001-81'], [],
    ['CNPJ', 'Data', 'Valor'],
    ['99.888.777/0001-66', '03/03/2025', '3.000,00'],
  ]
  const r = parseMovimentoTabular(linhas, { fonte: 'pdv' })
  assert.equal(r.movimentos[0].cnpj, '99888777000166')
})

test('triangulação: Z e PDV do mesmo CNPJ se encontram no mês', () => {
  const z = parseReducaoZSped(SPED_Z).movimentos
  const pdv = parseMovimentoTabular([
    ['CNPJ', '11.222.333/0001-81'], [], ['Data', 'Valor'],
    ['03/03/2025', '3.000,00'], ['04/03/2025', '4.500,00'], ['05/03/2025', '3.900,00'],
  ], { fonte: 'pdv' }).movimentos
  const { porMes } = triangular([...z, ...pdv])
  assert.equal(porMes.length, 1, 'uma linha só — não pode haver grupo SEM-CNPJ separado')
  assert.equal(porMes[0].z, 10000)
  assert.equal(porMes[0].pdv, 11400)
})

test('resumo: o declarado de meses sem Z nem PDV fica fora do total dos cards', () => {
  const movs = [
    { fonte: 'z', cnpj: '11222333000181', competencia: '2025-03', data: '2025-03-01', valor: 1000, registros: [] },
    { fonte: 'pdv', cnpj: '11222333000181', competencia: '2025-03', data: '2025-03-01', valor: 1000, registros: [] },
  ]
  const declarados = [
    { cnpj: '11222333000181', competencia: '2025-01', valor: 5000 },
    { cnpj: '11222333000181', competencia: '2025-03', valor: 900 },
  ]
  const t = triangular(movs, declarados)
  assert.equal(t.resumo.totalDeclarado, 900)
  assert.equal(t.porMes.find(p => p.competencia === '2025-01').status, STATUS_TRI.FONTE_UNICA)
})

test('PDV impresso: soma as linhas do mesmo dia, ignora totais, lê o CNPJ do cabeçalho', () => {
  const texto = [
    'RELATÓRIO DE VENDAS POR DIA — BELA COSMETICOS LTDA', 'CNPJ: 11.222.333/0001-81', '',
    'Data        Terminal  Forma        Valor',
    '01/03/2025  PDV 1     Cartão     2.240,00', '01/03/2025  PDV 1     Dinheiro     960,00',
    '02/03/2025  PDV 2     Cartão     1.000,50', 'Subtotal                         4.200,50',
    '03/03/2025  PDV 1     Cartão        10,00', 'TOTAL DO PERÍODO                 4.210,50',
  ].join('\n')
  const r = parsePdvImpresso(texto, 'pdv.pdf')
  assert.equal(r.movimentos.length, 3)
  assert.equal(r.movimentos[0].valor, 3200); assert.equal(r.movimentos[0].cnpj, '11222333000181'); assert.equal(r.movimentos[0].equipamento, 'PDV1')
  assert.equal(r.movimentos[1].valor, 1000.5); assert.equal(r.movimentos[1].competencia, '2025-03')
  assert.equal(parseMovimentoTexto(texto, 'pdv.pdf').formato, 'PDV impresso')
})
