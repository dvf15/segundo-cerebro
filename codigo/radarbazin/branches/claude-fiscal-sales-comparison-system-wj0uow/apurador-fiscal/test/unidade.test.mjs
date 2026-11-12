import { test } from 'node:test'
import assert from 'node:assert/strict'
import { classificarCfop, normalizarCfop, listarCfops, NATUREZA } from '../src/cfop.js'
import { numeroBR, normalizarCompetencia, normalizarCnpj, parseSpedEfd, parseLivroClassico,
  parseResumoCstCfop, lerLinhaCstCfop, parseTabularLivro, parseVendasInformadas, mapearColunas,
  limparRazaoSocial, parsePgdasD, ehPgdasD } from '../src/parsers.js'
import { apurar, apurarDeclaracoes, mesclarApuracao, conciliar, STATUS, paraCsv } from '../src/apurar.js'
import { csvParaLinhas, montarLinhas, rotacaoDoTexto } from '../src/ingest.js'

/* ---------------------------------------------------------------- CFOP */

test('CFOP: normalização aceita as grafias usuais', () => {
  for (const [entrada, esperado] of [['5102', '5102'], ['5.102', '5102'], ['05102', '5102'],
    [' 5.102 ', '5102'], ['5102/SP', '5102'], [5102, '5102'], ['102', null], ['', null], [null, null], ['9102', null]]) {
    assert.equal(normalizarCfop(entrada), esperado, `entrada ${entrada}`)
  }
})

test('CFOP: vendas somam, devoluções deduzem, o resto é neutro', () => {
  for (const c of ['5102', '6102', '7102', '5101', '5405', '6404', '5403', '5113', '5116', '5253', '5353', '5301']) {
    assert.equal(classificarCfop(c).natureza, NATUREZA.VENDA, `${c} deveria ser venda`)
    assert.equal(classificarCfop(c).efeito, 1)
  }
  for (const c of ['1201', '1202', '2202', '1411', '2410', '1205', '1503', '3201']) {
    assert.equal(classificarCfop(c).natureza, NATUREZA.DEVOLUCAO_VENDA, `${c} deveria ser devolução de venda`)
    assert.equal(classificarCfop(c).efeito, -1)
  }
  for (const c of ['5910', '5911', '5927', '5152', '5409', '5901', '5917', '1102', '2403', '1556']) {
    assert.equal(classificarCfop(c).efeito, 0, `${c} não deveria mexer nas vendas`)
  }
})

test('CFOP: contra-lançamentos de ECF/SAT e entrega futura não entram na venda', () => {
  assert.equal(classificarCfop('5929').natureza, NATUREZA.CONTRA_LANCAMENTO)
  assert.equal(classificarCfop('5922').natureza, NATUREZA.CONTRA_LANCAMENTO)
  assert.equal(classificarCfop('5929').efeito, 0)
})

test('CFOP: ativo, ISS e genérico ficam em baldes próprios', () => {
  assert.equal(classificarCfop('5551').natureza, NATUREZA.ATIVO)
  assert.equal(classificarCfop('5933').natureza, NATUREZA.SERVICO_ISS)
  assert.equal(classificarCfop('5949').natureza, NATUREZA.REVISAR)
  assert.equal(classificarCfop('6949').natureza, NATUREZA.REVISAR)
})

test('CFOP: o sentido vem do primeiro dígito', () => {
  assert.equal(classificarCfop('1102').sentido, 'entrada')
  assert.equal(classificarCfop('2102').sentido, 'entrada')
  assert.equal(classificarCfop('3102').sentido, 'entrada')
  assert.equal(classificarCfop('5102').sentido, 'saida')
  assert.equal(classificarCfop('6102').sentido, 'saida')
  assert.equal(classificarCfop('7102').sentido, 'saida')
})

test('CFOP: regra do usuário sobrepõe a tabela', () => {
  const ov = { 5949: { natureza: NATUREZA.VENDA } }
  assert.equal(classificarCfop('5949', ov).natureza, NATUREZA.VENDA)
  assert.equal(classificarCfop('5949', ov).efeito, 1)
  assert.equal(classificarCfop('5949').natureza, NATUREZA.REVISAR, 'sem override volta ao padrão')
})

test('CFOP: um código fora da tabela não é adivinhado', () => {
  const c = classificarCfop('5199')
  assert.equal(c.natureza, NATUREZA.DESCONHECIDO)
  assert.equal(c.efeito, 0)
  assert.equal(c.valido, true)
})

test('CFOP: a tabela cobre os seis grupos', () => {
  const l = listarCfops()
  assert.ok(l.length > 500)
  for (const g of [1, 2, 3, 5, 6, 7]) assert.ok(l.some(c => c.grupo === g), `falta grupo ${g}`)
})

/* ------------------------------------------------------------- números */

test('número: separadores brasileiros e americanos', () => {
  assert.equal(numeroBR('1.234.567,89'), 1234567.89)
  assert.equal(numeroBR('66.468,00'), 66468)
  assert.equal(numeroBR('0,10'), 0.1)
  assert.equal(numeroBR('1234.56'), 1234.56)
  assert.equal(numeroBR('1.234'), 1234)
  assert.equal(numeroBR('R$ 1.000,50'), 1000.5)
  assert.equal(numeroBR('(1.000,00)'), -1000)
  assert.equal(numeroBR('-50,25'), -50.25)
  assert.equal(numeroBR(42), 42)
  assert.ok(Number.isNaN(numeroBR('abc')))
  assert.ok(Number.isNaN(numeroBR('')))
})

test('competência: todas as formas viram AAAA-MM', () => {
  for (const [e, s] of [['01/2025', '2025-01'], ['1/2025', '2025-01'], ['2025-01', '2025-01'],
    ['15/01/2025', '2025-01'], ['01012025', '2025-01'], ['jan/25', '2025-01'], ['Dez/2025', '2025-12'],
    ['2025-01-15', '2025-01'], ['13/2025', null], ['xx', null]]) {
    assert.equal(normalizarCompetencia(e), s, `entrada ${e}`)
  }
})

test('CNPJ: fica só com os dígitos', () => {
  assert.equal(normalizarCnpj('30.571.578/0001-69'), '30571578000169')
  assert.equal(normalizarCnpj('07739834001720'), '07739834001720')
  assert.equal(normalizarCnpj('123.456.789-00'), '12345678900')
  assert.equal(normalizarCnpj(''), null)
})

/* ------------------------------------------------------------ SPED EFD */

const SPED = [
  '|0000|017|0|01012025|31012025|EMPRESA TESTE LTDA|30571578000169||SP|119507412110|3550308|||A|1|',
  '|C100|1|1|PART1|55|00|1|1001||15012025|15012025|1000,00|0|||1000,00|',
  '|C190|000|5102|18,00|1000,00|1000,00|180,00|0,00|0,00|0,00|0,00||',
  '|C100|1|1|PART1|55|02|1|1002||16012025|16012025|500,00|0|||500,00|',
  '|C190|000|5102|18,00|500,00|500,00|90,00|0,00|0,00|0,00|0,00||',
  '|C100|0|0|PART2|55|00|1|9001||20012025|20012025|300,00|0|||300,00|',
  '|C190|000|1202|18,00|300,00|300,00|54,00|0,00|0,00|0,00|0,00||',
  '|C800|59|00|1|1|abc|20012025|250,00|250,00||||',
  '|C850|000|5102|18,00|250,00|250,00|45,00||',
  '|C100|1|1|PART3|55|00|1|1003||22012025|22012025|700,00|0|||700,00|',
  '|C190|000|5910|18,00|700,00|700,00|126,00|0,00|0,00|0,00|0,00||',
  '|9999|11|',
].join('\n')

test('SPED: lê 0000, C190 e C850 e descarta documento cancelado', () => {
  const r = parseSpedEfd(SPED, 'teste.txt')
  assert.equal(r.lancamentos.length, 4, 'o C190 do documento cancelado (COD_SIT 02) não deve entrar')
  const s = r.lancamentos.find(l => l.cfop === '5102' && l.valorContabil === 1000)
  assert.equal(s.cnpj, '30571578000169')
  assert.equal(s.competencia, '2025-01')
  assert.equal(s.livro, 'saidas')
  assert.equal(s.icms, 180)
  assert.equal(r.lancamentos.find(l => l.cfop === '1202').livro, 'entradas')
  assert.equal(r.lancamentos.find(l => l.valorContabil === 250).livro, 'saidas', 'C850 é sempre saída')
  assert.ok(r.avisos.some(a => /cancelado/i.test(a)))
})

test('SPED: apuração descarta cancelado, soma venda e deduz devolução', () => {
  const { periodos } = apurar(parseSpedEfd(SPED).lancamentos)
  assert.equal(periodos.length, 1)
  const p = periodos[0]
  assert.equal(p.vendasBrutas, 1250, '1000 (NF) + 250 (SAT); os 500 cancelados ficam fora')
  assert.equal(p.devolucoes, 300)
  assert.equal(p.vendasLiquidas, 950)
  assert.equal(p.naoVenda, 700, 'a remessa em bonificação não é venda')
})

/* --------------------------------------------------- livro impresso (PDF) */

const paginaLivro = (mes, corpo, resumo) => `REGISTRO DE SAIDAS
FIRMA : LOJA TESTE LTDA
INSCR. EST. : 119507412110 C.N.P.J.: 30.571.578/0001-69
FOLHA :2 MES OU PERIODO/ANO:${mes}
${corpo}
${resumo}`

test('livro impresso: usa o resumo mensal e lê CNPJ e competência do cabeçalho', () => {
  const pg = paginaLivro('01/2025',
    'CFSAT 001229639 8120 2 SP 358,00 5.102Icms 358,00 0,00 0,00 0,00',
    `RESUMO MENSAL DE OPERACOES E PRESTACAO POR CODIGO FISCAL
COD. FISC. VLR. CONTABIL BASE CALC. IMPOSTO ISENTAS OUTRAS
5000 - Saidas e/ou Prestação de serviços no estado
5.102 358,00 358,00 0,00 0,00 0,00
SUB TOTAL 358,00 358,00 0,00 0,00 0,00
TOTAL 358,00 358,00 0,00 0,00 0,00`)
  const r = parseLivroClassico([pg], 'livro.pdf')
  assert.equal(r.lancamentos.length, 1)
  assert.deepEqual(
    [r.lancamentos[0].cnpj, r.lancamentos[0].competencia, r.lancamentos[0].cfop, r.lancamentos[0].valorContabil, r.lancamentos[0].livro],
    ['30571578000169', '2025-01', '5102', 358, 'saidas'])
  assert.equal(r.avisos.length, 0, 'resumo e detalhe batem, nada a avisar')
})

test('livro impresso: documento cancelado fica fora e é avisado', () => {
  const pg = paginaLivro('12/2025',
    `NFCE 0 2 4 20,00 5.102Icms 20,00 0,00 0,00 0,00 Cancelada
NFCE 0 3 4 80,00 5.102Icms 80,00 0,00 0,00 0,00`,
    `RESUMO MENSAL DE OPERACOES E PRESTACAO POR CODIGO FISCAL
5.102 80,00 80,00 0,00 0,00 0,00
TOTAL 80,00 80,00 0,00 0,00 0,00`)
  const r = parseLivroClassico([pg], 'livro.pdf')
  assert.equal(r.lancamentos[0].valorContabil, 80)
  assert.ok(r.avisos.some(a => /cancelado/i.test(a) && a.replace(/\u00a0/g, ' ').includes('R$ 20,00')))
  assert.ok(!r.avisos.some(a => /Conferência interna/.test(a)), 'sem falso alarme de conferência')
})

test('livro impresso: resumo que não bate com o detalhe vira aviso', () => {
  const pg = paginaLivro('03/2025',
    'CFSAT 001229639 8120 2 SP 358,00 5.102Icms 358,00 0,00 0,00 0,00',
    `RESUMO MENSAL DE OPERACOES E PRESTACAO POR CODIGO FISCAL
5.102 999,00 999,00 0,00 0,00 0,00`)
  const r = parseLivroClassico([pg], 'livro.pdf')
  assert.ok(r.avisos.some(a => /Conferência interna/.test(a)))
})

test('livro impresso: mês sem movimento é registrado, não sumido', () => {
  const pg = paginaLivro('05/2025', 'SEM MOVIMENTO', '')
  const r = parseLivroClassico([pg], 'livro.pdf')
  assert.equal(r.lancamentos.length, 1)
  assert.equal(r.lancamentos[0].semMovimento, true)
  assert.equal(r.lancamentos[0].competencia, '2025-05')
})

/* ------------------------------------------------ resumo por CST e CFOP */

test('resumo CST/CFOP: reconhece as duas ordens de coluna', () => {
  // alíquota ANTES do CFOP
  const a = lerLinhaCstCfop('000 18,00 1152 342,21 342,21 61,60 0,00 0,00 0,00')
  assert.deepEqual([a.cfop, a.aliquota, a.valores[0], a.valores[1], a.valores[2], a.consistente],
    ['1152', 18, 342.21, 342.21, 61.6, true])
  // alíquota DEPOIS do CFOP
  const b = lerLinhaCstCfop('000 1152 18,00 342,21 342,21 61,60 0,00 0,00 0,00')
  assert.deepEqual([b.cfop, b.aliquota, b.valores[0], b.valores[2], b.consistente],
    ['1152', 18, 342.21, 61.6, true])
})

test('resumo CST/CFOP: linha com situação na frente e alíquota zero', () => {
  const l = lerLinhaCstCfop('00 060 0,00 5405 182.967,88 0,00 0,00 0,00 0,00 0,00')
  assert.equal(l.cfop, '5405')
  assert.equal(l.cst, '060')
  assert.equal(l.valores[0], 182967.88)
  assert.equal(l.consistente, true)
})

test('resumo CST/CFOP: totais conferem com o relatório impresso', () => {
  const texto = `REGISTROS FISCAIS DOS DOCUMENTOS DE SAÍDAS DE MERCADORIAS E PRESTAÇÃO DE SERVIÇOS
CONTRIBUINTE: EMPRESA EXEMPLO LTDA
CNPJ/CPF: 07.739.834/0017-20 INSCRIÇÃO ESTADUAL: 126156913113 UF: SP PERÍODO DE APURAÇÃO: 01/01/2025 a 31/01/2025
RESUMO - TOTAIS
00 000 18,00 5102 0,10 0,10 0,02 0,00 0,00 0,00
00 000 18,00 5910 4.922,60 4.922,60 886,07 0,00 0,00 0,00
00 000 18,00 5949 332,45 332,47 59,84 0,00 0,00 0,00
00 040 0,00 5927 144,09 0,00 0,00 0,00 0,00 0,00
00 060 0,00 5405 182.967,88 0,00 0,00 0,00 0,00 0,00
00 060 0,00 5409 507,31 0,00 0,00 0,00 0,00 0,00
00 060 0,00 5910 1.546,60 0,00 0,00 0,00 0,00 0,00
00 060 0,00 5927 107,46 0,00 0,00 0,00 0,00 0,00
00 060 0,00 5949 768,46 0,00 0,00 0,00 0,00 0,00
TOTAL 191.296,95 5.255,17 945,93 0,00 0,00 0,00`
  const r = parseResumoCstCfop(texto, 'saidas.pdf')
  assert.equal(r.lancamentos.length, 9)
  assert.equal(r.lancamentos[0].cnpj, '07739834001720')
  assert.equal(r.lancamentos[0].competencia, '2025-01')
  assert.equal(r.lancamentos[0].livro, 'saidas')
  const soma = r.lancamentos.reduce((a, l) => a + l.valorContabil, 0)
  assert.equal(Math.round(soma * 100) / 100, 191296.95, 'a soma tem de bater com o TOTAL impresso')

  const { periodos } = apurar(r.lancamentos)
  assert.equal(periodos[0].vendasBrutas, 182967.98, '5102 + 5405')
  assert.equal(periodos[0].naoVenda, 7228.06, 'bonificação, transferência e baixa de estoque')
  assert.equal(periodos[0].revisar, 1100.91, 'os dois 5949')
  assert.ok(periodos[0].alertas.some(a => a.tipo === 'exige_revisao'))
})

/* --------------------------------------------------------------- tabular */

test('tabular: mapeia colunas pelo cabeçalho', () => {
  const mapa = mapearColunas(['CNPJ', 'Competência', 'CFOP', 'Valor Contábil', 'Base de Cálculo'])
  assert.equal(mapa.cnpj, 0); assert.equal(mapa.competencia, 1)
  assert.equal(mapa.cfop, 2); assert.equal(mapa.valorContabil, 3); assert.equal(mapa.baseCalculo, 4)
})

test('tabular: deduz entrada ou saída pelo primeiro dígito do CFOP', () => {
  const linhas = [
    ['Relatório da empresa'], [],
    ['CNPJ', 'Competencia', 'CFOP', 'Valor Contabil'],
    ['30.571.578/0001-69', '01/2025', '5102', '1.000,00'],
    ['30.571.578/0001-69', '01/2025', '1202', '100,00'],
  ]
  const r = parseTabularLivro(linhas, { arquivo: 'x.xlsx' })
  assert.equal(r.lancamentos.length, 2)
  assert.equal(r.lancamentos[0].livro, 'saidas')
  assert.equal(r.lancamentos[1].livro, 'entradas')
  const { periodos } = apurar(r.lancamentos)
  assert.equal(periodos[0].vendasLiquidas, 900)
})

test('planilha de vendas: linha sem CNPJ ou competência é recusada com aviso', () => {
  const linhas = [
    ['CNPJ', 'Competencia', 'Vendas'],
    ['30.571.578/0001-69', '01/2025', '66.468,00'],
    ['', '02/2025', '1.000,00'],
  ]
  const r = parseVendasInformadas(linhas)
  assert.equal(r.registros.length, 1)
  assert.equal(r.registros[0].valor, 66468)
  assert.ok(r.avisos.some(a => /CNPJ/.test(a)))
})

/* ---------------------------------------------------------- conciliação */

const periodoFake = (cnpj, comp, liquidas) => ({
  cnpj, competencia: comp, competenciaLabel: comp, cnpjFmt: cnpj,
  vendasBrutas: liquidas, devolucoes: 0, vendasLiquidas: liquidas,
  naoVenda: 0, revisar: 0, desconhecido: 0, contraLancamento: 0, alertas: [], cfops: [], livros: ['saidas'],
})

test('conciliação: classifica OK, ATENÇÃO e DIVERGENTE pela tolerância', () => {
  const periodos = [periodoFake('1', '2025-01', 1000), periodoFake('1', '2025-02', 1000), periodoFake('1', '2025-03', 1000)]
  const informadas = [
    { cnpj: '1', competencia: '2025-01', valor: 1000, linha: 2 },
    { cnpj: '1', competencia: '2025-02', valor: 1010, linha: 3 },   // 1%
    { cnpj: '1', competencia: '2025-03', valor: 1200, linha: 4 },   // ~17%
  ]
  const { linhas } = conciliar(periodos, informadas, { toleranciaReais: 0.05, toleranciaPercent: 0.5, atencaoPercent: 2 })
  assert.equal(linhas[0].status, STATUS.OK)
  assert.equal(linhas[1].status, STATUS.ATENCAO)
  assert.equal(linhas[2].status, STATUS.DIVERGENTE)
  assert.equal(linhas[2].diferenca, -200)
})

test('conciliação: mês só no livro e mês só na planilha aparecem', () => {
  const { linhas, resumo } = conciliar([periodoFake('1', '2025-01', 500)],
    [{ cnpj: '1', competencia: '2025-02', valor: 800, linha: 2 }])
  assert.equal(linhas.length, 2)
  assert.equal(linhas.find(l => l.competencia === '2025-01').status, STATUS.SO_LIVRO)
  assert.equal(linhas.find(l => l.competencia === '2025-02').status, STATUS.SO_PLANILHA)
  assert.equal(resumo.soLivro, 1)
  assert.equal(resumo.soPlanilha, 1)
})

test('conciliação: CNPJ diferente não se mistura', () => {
  const periodos = [periodoFake('11111111111111', '2025-01', 100), periodoFake('22222222222222', '2025-01', 200)]
  const { linhas } = conciliar(periodos, [
    { cnpj: '11111111111111', competencia: '2025-01', valor: 100, linha: 2 },
    { cnpj: '22222222222222', competencia: '2025-01', valor: 999, linha: 3 },
  ])
  assert.equal(linhas.find(l => l.cnpj === '11111111111111').status, STATUS.OK)
  assert.equal(linhas.find(l => l.cnpj === '22222222222222').status, STATUS.DIVERGENTE)
})

test('conciliação: duas linhas da planilha no mesmo mês são somadas e avisadas', () => {
  const { linhas } = conciliar([periodoFake('1', '2025-01', 300)], [
    { cnpj: '1', competencia: '2025-01', valor: 100, linha: 2 },
    { cnpj: '1', competencia: '2025-01', valor: 200, linha: 3 },
  ])
  assert.equal(linhas[0].informado, 300)
  assert.equal(linhas[0].status, STATUS.OK)
  assert.ok(linhas[0].alertas.some(a => a.tipo === 'planilha_duplicada'))
})

test('apuração: CFOP de saída lançado no livro de entradas gera alerta', () => {
  const { periodos } = apurar([
    { cnpj: '1', competencia: '2025-01', livro: 'entradas', cfop: '5102', valorContabil: 100, baseCalculo: 100, icms: 0 },
  ])
  assert.ok(periodos[0].alertas.some(a => a.tipo === 'cfop_no_livro_errado'))
})

test('apuração: sem livro de entradas, avisa que devolução não foi deduzida', () => {
  const { periodos } = apurar([
    { cnpj: '1', competencia: '2025-01', livro: 'saidas', cfop: '5102', valorContabil: 100, baseCalculo: 100, icms: 0 },
  ])
  assert.ok(periodos[0].alertas.some(a => a.tipo === 'sem_livro_entradas'))
})

test('apuração: mesmo mês vindo de dois arquivos é conflito, não soma dobrada', () => {
  const l = (fonteId, v) => ({ cnpj: '1', competencia: '2025-01', livro: 'saidas', cfop: '5102',
    valorContabil: v, baseCalculo: v, icms: 0, origem: { fonteId, arquivo: fonteId } })
  const r = apurar([l('a', 100), l('b', 100)])
  assert.equal(r.conflitos.length, 1)
  assert.equal(r.periodos[0].vendasBrutas, 100, 'usa uma fonte só')
  const r2 = apurar([l('a', 100), l('b', 250)], { fontePreferida: { '1|2025-01|saidas': 'b' } })
  assert.equal(r2.periodos[0].vendasBrutas, 250, 'respeita a fonte escolhida')
})

test('apuração: medida base de cálculo troca o número comparado', () => {
  const lanc = [{ cnpj: '1', competencia: '2025-01', livro: 'saidas', cfop: '5102', valorContabil: 1000, baseCalculo: 800, icms: 144 }]
  assert.equal(apurar(lanc).periodos[0].vendasLiquidas, 1000)
  assert.equal(apurar(lanc, { medida: 'baseCalculo' }).periodos[0].vendasLiquidas, 800)
})

/* --------------------------------------------------------------- saídas */

test('CSV exportado usa ; e vírgula decimal, com BOM para o Excel', () => {
  const csv = paraCsv([{ cnpjFmt: '30.571.578/0001-69', competenciaLabel: '01/2025',
    vendasLiquidas: 1234.5, informado: 1000, diferenca: 234.5, status: 'DIVERGENTE', explicacao: 'teste; com ponto e vírgula' }])
  assert.ok(csv.startsWith('﻿'))
  assert.ok(csv.includes('1234,5'))
  assert.ok(csv.includes('"teste; com ponto e vírgula"'))
})

test('CSV de entrada: detecta o separador e respeita aspas', () => {
  const l = csvParaLinhas('a;b;c\n1;"x;y";3\n')
  assert.deepEqual(l, [['a', 'b', 'c'], ['1', 'x;y', '3']])
  assert.deepEqual(csvParaLinhas('a,b\n1,2\n'), [['a', 'b'], ['1', '2']])
})

test('pdf.js: fragmentos viram linhas pela posição vertical', () => {
  const it = (s, x, y, w = 10) => ({ str: s, transform: [0, 0, 0, 0, x, y], width: w })
  const texto = montarLinhas([it('CFOP', 10, 100), it('5.102', 60, 100), it('358,00', 10, 80)])
  assert.equal(texto, 'CFOP 5.102\n358,00')
})

/* ------------------------------------------------------ correções de leitura */

test('razão social: a legenda impressa ao lado não gruda no nome', () => {
  assert.equal(limparRazaoSocial('APA COMERCIO DE JOIAS EIRELI 1 - Operacoes com Credito do Imposto'),
    'APA COMERCIO DE JOIAS EIRELI')
  assert.equal(limparRazaoSocial('SPAD COMERCIO DE COSMETICOS LTDA   CNPJ/CPF: 07.739.834/0017-20'),
    'SPAD COMERCIO DE COSMETICOS LTDA')
  assert.equal(limparRazaoSocial('LOJA TESTE LTDA'), 'LOJA TESTE LTDA')
  assert.equal(limparRazaoSocial(''), null)
})

test('apuração: entrada que não é devolução não é descrita como saída', () => {
  const { periodos } = apurar([
    { cnpj: '1', competencia: '2025-01', livro: 'saidas', cfop: '5102', valorContabil: 1000, baseCalculo: 1000, icms: 0 },
    { cnpj: '1', competencia: '2025-01', livro: 'saidas', cfop: '5910', valorContabil: 50, baseCalculo: 50, icms: 0 },
    { cnpj: '1', competencia: '2025-01', livro: 'entradas', cfop: '1102', valorContabil: 700, baseCalculo: 700, icms: 0 },
  ])
  const p = periodos[0]
  assert.equal(p.naoVenda, 750)
  assert.equal(p.naoVendaSaidas, 50, 'só a remessa em bonificação')
  assert.equal(p.naoVendaEntradas, 700, 'a compra para comercialização')
  const { linhas } = conciliar(periodos, [{ cnpj: '1', competencia: '2025-01', valor: 2000, linha: 2 }])
  const texto = linhas[0].explicacao.replace(/\u00a0/g, ' ')   // toLocaleString usa espaço não separável
  assert.ok(texto.includes('R$ 50,00'), 'a explicação cita só as saídas')
  assert.ok(!texto.includes('700'), 'não pode chamar a compra de "saída que não é venda"')
})

/* ------------------------------------------ PDF girado e colunas faltando */

/** Fragmento como o pdf.js entrega: transform = [a, b, c, d, e, f]. */
const frag = (s, t, w = 10) => ({ str: s, transform: t, width: w })

test('rotação: o ângulo do texto é lido da matriz, com peso por caractere', () => {
  assert.equal(rotacaoDoTexto([frag('horizontal', [10, 0, 0, 10, 5, 100])]), 0)
  assert.equal(rotacaoDoTexto([frag('de lado', [0, 10, -10, 0, 5, 100])]), 90)
  assert.equal(rotacaoDoTexto([frag('de ponta-cabeça', [-10, 0, 0, -10, 5, 100])]), 180)
  assert.equal(rotacaoDoTexto([frag('do outro lado', [0, -10, 10, 0, 5, 100])]), 270)
  // um carimbo curto de lado não decide a orientação de uma página inteira
  assert.equal(rotacaoDoTexto([
    frag('texto longo da pagina inteira aqui', [10, 0, 0, 10, 5, 100]),
    frag('ab', [0, 10, -10, 0, 5, 100]),
  ]), 0)
  assert.equal(rotacaoDoTexto([]), 0)
  assert.equal(rotacaoDoTexto([frag('   ', [0, 10, -10, 0, 5, 100])]), 0, 'espaço em branco não conta')
})

test('rotação: com o projetor certo, a página girada sai na ordem de leitura', () => {
  /*
   * Texto girado 90°: cada linha corre no eixo y e as linhas se sucedem no
   * eixo x. É o caso do livro fiscal em A4 retrato com conteúdo em paisagem.
   */
  const itens = [
    frag('CFOP', [0, 10, -10, 0, 20, 100]), frag('5102', [0, 10, -10, 0, 20, 140]),
    frag('Total', [0, 10, -10, 0, 40, 100]), frag('236,00', [0, 10, -10, 0, 40, 140]),
  ]
  // o projetor imita V(90)·T: x vem de f, y vem de e
  const projetar = (it) => ({ x: it.transform[5], y: it.transform[4], w: it.width })
  assert.equal(montarLinhas(itens, { projetar }), 'CFOP 5102\nTotal 236,00')
  // sem o projetor, o mesmo conteúdo sai embaralhado
  assert.notEqual(montarLinhas(itens), 'CFOP 5102\nTotal 236,00')
})

test('resumo CST/CFOP: linha sem a coluna de alíquota não pode zerar a operação', () => {
  // 7 colunas numéricas é o padrão da página; esta linha traz 6 (alíquota vazia)
  const l = lerLinhaCstCfop('090 1353 630,28 0,00 0,00 0,00 0,00 0,00', 7)
  assert.equal(l.cfop, '1353')
  assert.equal(l.aliquota, null)
  assert.equal(l.valores[0], 630.28, 'o 630,28 é o total da operação, não a alíquota')
  // sem saber quantas colunas a página usa, o primeiro número viraria alíquota
  const semContexto = lerLinhaCstCfop('090 1353 630,28 0,00 0,00 0,00 0,00 0,00')
  assert.equal(semContexto.valores[0], 0, 'é justamente o engano que a contagem de colunas evita')
})

const RESUMO_OUT = `REGISTROS FISCAIS DOS DOCUMENTOS DE ENTRADAS DE MERCADORIAS E AQUISIÇÃO DE SERVIÇOS
CONTRIBUINTE: SPAD COMERCIO DE COSMETICOS LTDA PERÍODO DE APURAÇÃO:  01/10/2025 a 31/10/2025
CNPJ/CPF: 07.739.834/0017-20 INSCRIÇÃO ESTADUAL: 126156913113 UF:  SP MUNICÍPIO:  São Paulo - SP
RESUMO - TOTAIS
CST/ICMS CFOP Alíquota ICMS Total Operação Base de Cálculo ICMS Total ICMS Base de Cálculo ICMS ST Total ICMS ST Total IPI
000 1102 18,00 2.009,06 2.009,09 361,62 0,00 0,00 0,00
000 1202 18,00 366,40 366,40 65,96 0,00 0,00 0,00
000 1353 12,00 283,08 283,11 33,96 0,00 0,00 0,00
000 2102 12,00 3.123,51 2.932,88 351,94 0,00 0,00 0,00
060 1403 0,00 118.038,68 0,00 0,00 0,00 0,00 0,00
060 1411 0,00 1.712,95 0,00 0,00 0,00 0,00 0,00
090 1353 630,28 0,00 0,00 0,00 0,00 0,00
090 1556 0,00 2.272,63 0,00 0,00 0,00 0,00 0,00
090 2556 0,00 2.050,00 0,00 0,00 0,00 0,00 0,00
TOTAL 130.486,59 5.591,48 813,48 0,00 0,00 0,00`

test('resumo CST/CFOP: relatório real de outubro fecha com o TOTAL impresso', () => {
  const r = parseResumoCstCfop(RESUMO_OUT, 'entradas.pdf')
  assert.equal(r.lancamentos.length, 9)
  assert.equal(r.lancamentos[0].cnpj, '07739834001720')
  assert.equal(r.lancamentos[0].competencia, '2025-10')
  assert.equal(r.lancamentos[0].empresa, 'SPAD COMERCIO DE COSMETICOS LTDA', 'sem o período grudado no nome')
  const soma = r.lancamentos.reduce((a, l) => a + l.valorContabil, 0)
  assert.equal(Math.round(soma * 100) / 100, 130486.59)
  assert.equal(r.avisos.length, 0, 'batendo com o TOTAL, não há o que avisar')

  const { periodos } = apurar(r.lancamentos)
  assert.equal(periodos[0].devolucoes, 2079.35, '1202 + 1411')
  assert.equal(periodos[0].vendasBrutas, 0, 'livro de entradas não tem venda')
})

test('resumo CST/CFOP: soma que não bate com o TOTAL vira aviso', () => {
  const adulterado = RESUMO_OUT.replace('TOTAL 130.486,59', 'TOTAL 999.999,99')
  const r = parseResumoCstCfop(adulterado, 'entradas.pdf')
  assert.equal(r.lancamentos.length, 9)
  assert.ok(r.avisos.some(a => /TOTAL impresso/.test(a)), 'precisa avisar que a leitura não fecha')
})

test('resumo CST/CFOP: sem linha TOTAL, avisa que não deu para conferir', () => {
  const semTotal = RESUMO_OUT.split('\n').filter(l => !/^TOTAL/.test(l)).join('\n')
  const r = parseResumoCstCfop(semTotal, 'entradas.pdf')
  assert.equal(r.lancamentos.length, 9)
  assert.ok(r.avisos.some(a => /conferir/.test(a)))
})

test('conciliação: competência sem livro de saídas não vira divergência falsa', () => {
  // só o livro de entradas foi carregado: a "diferença" é falta de arquivo
  const { periodos } = apurar([
    { cnpj: '1', competencia: '2025-01', livro: 'entradas', cfop: '1202', valorContabil: 2308, baseCalculo: 0, icms: 0 },
  ])
  const { linhas, resumo } = conciliar(periodos, [{ cnpj: '1', competencia: '2025-01', valor: 178283.19, linha: 2 }])
  assert.equal(linhas[0].status, STATUS.INCOMPLETO)
  assert.equal(resumo.divergente, 0)
  assert.equal(resumo.incompleto, 1)
  assert.equal(resumo.totalDiferenca, 0, 'não contamina o total')
  assert.match(linhas[0].explicacao, /livro de SAÍDAS/)
})

test('conciliação: com os dois livros, a divergência volta a ser divergência', () => {
  const { periodos } = apurar([
    { cnpj: '1', competencia: '2025-01', livro: 'saidas', cfop: '5102', valorContabil: 100000, baseCalculo: 0, icms: 0 },
    { cnpj: '1', competencia: '2025-01', livro: 'entradas', cfop: '1202', valorContabil: 2308, baseCalculo: 0, icms: 0 },
  ])
  const { linhas } = conciliar(periodos, [{ cnpj: '1', competencia: '2025-01', valor: 80000, linha: 2 }])
  assert.equal(linhas[0].status, STATUS.DIVERGENTE)
  assert.equal(linhas[0].vendasLiquidas, 97692)
})

/* ------------------------------ Extrato do Simples Nacional (PGDAS-D) */

const PGDAS = `Extrato do Simples Nacional
PGDAS-D 2018 Versão IC-2.2.19
1) Informações do Contribuinte
CNPJ Básico: 20.700.519 Nome Empresarial: RASI COMERCIO DE CALCADOS FEMININOS LTDA
2) Informações da Apuração 20700519202512001
Período de Apuração (PA): 12/2025
Total de Receitas Brutas (R$) Mercado Interno Mercado Externo Total
Receita Bruta do PA (RPA) - Competência 532.040,50 0,00 532.040,50
Receita bruta acumulada nos doze meses anteriores ao PA
2.579.132,19 0,00 2.579.132,19
(RBT12)
Receita bruta acumulada no ano-calendário corrente (RBA) 2.520.621,37 0,00 2.520.621,37
2.2) Receitas Brutas Anteriores (R$)
2.2.1) Mercado Interno
12/2024 590.551,32 01/2025 168.485,07 02/2025 173.378,87 03/2025 174.020,33
04/2025 160.662,36 05/2025 280.637,24 06/2025 161.573,91 07/2025 145.202,51
08/2025 155.479,75 09/2025 155.751,34 10/2025 169.409,60 11/2025 243.979,89
2.2.2) Mercado Externo
12/2024 0,00 01/2025 0,00 02/2025 0,00 03/2025 0,00
04/2025 0,00 05/2025 0,00 06/2025 0,00 07/2025 0,00
08/2025 0,00 09/2025 0,00 10/2025 0,00 11/2025 0,00
2.3) Folha de Salários Anteriores (R$)
3) Informações dos Estabelecimentos - valores referentes às Receitas Informadas
CNPJ Estabelecimento: 20.700.519/0001-90
Município: SAO PAULO UF: SP
Valor do Débito por Tributo para a Atividade (R$):
Revenda de mercadorias, exceto para o exterior - Sem substituição tributária
Receita Bruta Informada: R$ 531.592,42
Parcela 1: R$ 531.592,42
Valor do Débito por Tributo para a Atividade (R$):
Prestação de Serviços, exceto para o exterior - Anexo III
Receita Bruta Informada: R$ 448,08
Informações por Estabelecimento
Valor Informado: 532.040,50`

test('PGDAS-D: é reconhecido e não confundido com livro fiscal', () => {
  assert.equal(ehPgdasD(PGDAS), true)
  assert.equal(ehPgdasD('REGISTRO DE SAIDAS\nFIRMA : LOJA LTDA'), false)
})

test('PGDAS-D: lê o mês do PA por estabelecimento e o histórico da empresa', () => {
  const r = parsePgdasD(PGDAS, 'extrato.pdf')
  assert.equal(r.competencia, '2025-12')
  assert.equal(r.registros.length, 13, '1 mês do PA + 12 meses de histórico')
  assert.equal(r.avisos.length, 0, 'RBA, RBT12 e soma por atividade conferem')

  const pa = r.registros.find(x => x.competencia === '2025-12')
  assert.equal(pa.cnpj, '20700519000190')
  assert.equal(pa.valor, 532040.50)
  assert.equal(pa.escopo, 'estabelecimento')
  assert.deepEqual(pa.detalhe, { mercadoria: 531592.42, servico: 448.08, outros: 0 })
  assert.equal(pa.empresa, 'RASI COMERCIO DE CALCADOS FEMININOS LTDA')

  assert.equal(r.registros.find(x => x.competencia === '2025-11').valor, 243979.89)
  assert.equal(r.registros.find(x => x.competencia === '2024-12').valor, 590551.32)
})

test('PGDAS-D: série que não bate com o RBA impresso vira aviso', () => {
  const adulterado = PGDAS.replace('01/2025 168.485,07', '01/2025 1.168.485,07')
  const r = parsePgdasD(adulterado, 'extrato.pdf')
  assert.ok(r.avisos.some(a => /RBA impresso/.test(a)), 'precisa acusar a série inconsistente')
})

test('PGDAS-D: receita por atividade que não bate com o Valor Informado vira aviso', () => {
  const adulterado = PGDAS.replace('Valor Informado: 532.040,50', 'Valor Informado: 999.000,00')
  const r = parsePgdasD(adulterado, 'extrato.pdf')
  assert.ok(r.avisos.some(a => /Valor Informado/.test(a)))
})

test('PGDAS-D: com mais de um estabelecimento, o histórico não é repartido', () => {
  const doisEstab = PGDAS + `
CNPJ Estabelecimento: 20.700.519/0002-71
Valor do Débito por Tributo para a Atividade (R$):
Revenda de mercadorias, exceto para o exterior
Receita Bruta Informada: R$ 100.000,00
Informações por Estabelecimento
Valor Informado: 100.000,00`
  const r = parsePgdasD(doisEstab, 'extrato.pdf')
  assert.equal(r.registros.length, 2, 'só o mês do PA, um por estabelecimento')
  assert.ok(r.registros.every(x => x.competencia === '2025-12'))
  assert.ok(r.avisos.some(a => /consolidado da empresa/.test(a)))
})

test('conciliação: duas origens de venda informada não são somadas', () => {
  const periodos = [{ cnpj: '1', competencia: '2025-12', competenciaLabel: '12/2025', cnpjFmt: '1',
    vendasBrutas: 530000, devolucoes: 0, vendasLiquidas: 530000, naoVenda: 0, naoVendaSaidas: 0,
    revisar: 0, desconhecido: 0, contraLancamento: 0, alertas: [], cfops: [], livros: ['saidas', 'entradas'] }]
  const { linhas } = conciliar(periodos, [
    { cnpj: '1', competencia: '2025-12', valor: 532040.50, arquivo: 'a.xlsx', fonteId: 'a', escopo: 'estabelecimento' },
    { cnpj: '1', competencia: '2025-12', valor: 400000, arquivo: 'b.xlsx', fonteId: 'b', linha: 5 },
  ])
  assert.equal(linhas[0].informado, 532040.50, 'vence a de maior peso, sem somar as duas')
  assert.ok(linhas[0].alertas.some(a => a.tipo === 'fontes_de_venda_divergem'))
})

/* ------------------- extrato do Simples como lado de referência */

const declaracoesAnaCapri = () => parsePgdasD(PGDAS, 'extrato.pdf').registros

test('declaração: o extrato vira período de referência, sem CFOP', () => {
  const { periodos } = apurarDeclaracoes(declaracoesAnaCapri())
  const dez = periodos.find(p => p.competencia === '2025-12')
  assert.equal(dez.tipo, 'declaracao')
  assert.equal(dez.vendasLiquidas, 532040.50, 'por padrão compara pela receita bruta total')
  assert.equal(dez.devolucoes, 0)
  assert.deepEqual(dez.cfops, [])
  assert.equal(dez.declarado.mercadoria, 531592.42)
  assert.equal(dez.declarado.servico, 448.08)
})

test('declaração: base "só mercadoria" muda o número comparado', () => {
  const { periodos } = apurarDeclaracoes(declaracoesAnaCapri(), { baseDeclaracao: 'mercadoria' })
  const dez = periodos.find(p => p.competencia === '2025-12')
  assert.equal(dez.vendasLiquidas, 531592.42)
  // mês do histórico não tem quebra por atividade: cai para o total e avisa
  const nov = periodos.find(p => p.competencia === '2025-11')
  assert.equal(nov.vendasLiquidas, 243979.89)
  assert.ok(nov.alertas.some(a => a.tipo === 'sem_quebra_por_atividade'))
})

test('declaração: conciliação com o Excel da loja, mês a mês', () => {
  const { periodos } = apurarDeclaracoes(declaracoesAnaCapri())
  const excel = [
    { cnpj: '20700519000190', competencia: '2025-11', valor: 243979.89, linha: 15 },
    { cnpj: '20700519000190', competencia: '2025-12', valor: 531592.42, linha: 16 },
    { cnpj: '20700519000190', competencia: '2025-05', valor: 316221.75, linha: 9 },
  ]
  const { linhas } = conciliar(periodos, excel)
  const em = (c) => linhas.find(l => l.competencia === c)
  assert.equal(em('2025-11').status, STATUS.OK, 'novembro bate exatamente')
  assert.equal(em('2025-05').diferenca, -35584.51)
  assert.equal(em('2025-05').status, STATUS.DIVERGENTE)
  // dezembro: a diferença é exatamente o serviço com ISS, e isso é dito
  assert.equal(em('2025-12').diferenca, 448.08)
  const aviso = em('2025-12').alertas.find(a => a.tipo === 'receita_de_servico')
  assert.ok(aviso, 'a parcela de ISS precisa ser explicada')
  assert.match(aviso.texto.replace(/\u00a0/g, ' '), /diferença seria R\$ 0,00/)
})

test('declaração: sem livro de saídas não vira LIVRO INCOMPLETO', () => {
  const { periodos } = apurarDeclaracoes(declaracoesAnaCapri())
  const { linhas } = conciliar(periodos, [{ cnpj: '20700519000190', competencia: '2025-11', valor: 243979.89, linha: 2 }])
  const nov = linhas.find(l => l.competencia === '2025-11')
  assert.equal(nov.status, STATUS.OK, 'a regra do livro de saídas não se aplica a declaração')
})

test('mesclar: com livro e extrato na mesma competência, o livro manda e o extrato confere', () => {
  const { periodos: doLivro } = apurar([
    { cnpj: '20700519000190', competencia: '2025-12', livro: 'saidas', cfop: '5102', valorContabil: 500000, baseCalculo: 500000, icms: 0 },
  ])
  const { periodos: daDeclaracao } = apurarDeclaracoes(declaracoesAnaCapri())
  const juntos = mesclarApuracao(doLivro, daDeclaracao)
  const dez = juntos.find(p => p.competencia === '2025-12')
  assert.equal(dez.vendasLiquidas, 500000, 'o livro continua sendo a base')
  assert.equal(dez.declarado.total, 532040.50)
  assert.ok(dez.alertas.some(a => a.tipo === 'livro_x_declaracao'))
  // as competências que só o extrato tem entram na lista
  assert.ok(juntos.some(p => p.competencia === '2025-06' && p.tipo === 'declaracao'))
})
