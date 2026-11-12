#!/usr/bin/env node
/**
 * Kit de simulação completa: os arquivos que o time carrega no app, cada um no
 * formato em que chega de verdade, para exercitar todas as funcionalidades sobre
 * a base fictícia (os CNPJs são os dos lojistas dela).
 *
 *   demo/simulacao/0-base           a base fictícia (JSON para Restaurar cópia e Excel)
 *   demo/simulacao/1-carteira       lojistas novos, com erros de propósito
 *   demo/simulacao/2-auditoria      livros fiscais em todos os formatos lidos
 *                                   (PDF impresso, SPED EFD, resumo CST/CFOP,
 *                                   extrato do Simples, planilha) e a ficha 2025
 *   demo/simulacao/3-triangulacao   reduções Z e relatórios de PDV (PDF e foto)
 *                                   de 10/2026 e de 2025, e a ficha de 10/2026
 *
 * Empresas, CNPJs e valores são FICTÍCIOS. Cada cenário está descrito em
 * CENARIOS, com o resultado esperado; scripts/conferir-simulacao.mjs carrega
 * tudo no app e confere.
 */
import { chromium } from 'playwright'
import { writeFileSync, mkdirSync, copyFileSync, rmSync, existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'
import { caminhoChromium } from './chromium.mjs'
import { gerarBaseFicticia } from '../src/basefic.js'
import { formatarCnpj } from '../src/parsers.js'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const demo = join(raiz, 'demo')
const saida = join(demo, 'simulacao')
rmSync(saida, { recursive: true, force: true })
for (const d of ['0-base', '1-carteira', '2-auditoria', '3-triangulacao']) mkdirSync(join(saida, d), { recursive: true })
// a base em si: gerada por npm run base e python3 scripts/gerar-base-excel.py
for (const f of ['base-ficticia.json', 'base-ficticia.xlsx']) {
  if (existsSync(join(demo, f))) { copyFileSync(join(demo, f), join(saida, '0-base', f)); console.log('demo/simulacao/0-base/' + f) }
}

// os CNPJs da base não dependem da data em que ela é gerada
const base = gerarBaseFicticia(new Date())
const L = (i) => base.lojistas[i]
const BELA = L(0); const QUIOSQUE = L(1); const CAFE = L(2); const TRILHA = L(3); const OTICA = L(4)
const VERTICE = L(9); const LUME = L(10); const URBANO = L(12); const MUNDOPET = L(14); const RAIZ = L(21); const BAMBU = L(22)

const brl = (n) => n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const cnpjF = (l) => formatarCnpj(l.cnpj)
const p2 = (n) => String(n).padStart(2, '0')
const escrever = (rel, conteudo) => { writeFileSync(join(saida, rel), conteudo); console.log('demo/simulacao/' + rel) }

/** Valor diário estável e com cara de loja: varia com o dia, sem aleatoriedade. */
const diario = (semente, dia, baseValor) => Math.round((baseValor + ((dia * semente) % 1700) - 600) * 100) / 100

const navegador = await chromium.launch({ executablePath: caminhoChromium() })
const pagina = await navegador.newPage()
async function pdf (rel, html, opts = { format: 'A4', printBackground: true }) {
  await pagina.setContent(html, { waitUntil: 'load' })
  escrever(rel, await pagina.pdf(opts))
}
async function xlsx (rel, abas) {
  if (!pagina.url().startsWith('file:')) {
    await pagina.goto(pathToFileURL(join(raiz, 'index.html')).href)
    await pagina.waitForFunction(() => typeof globalThis.XLSX !== 'undefined')
  }
  const b64 = await pagina.evaluate((abas) => {
    const wb = XLSX.utils.book_new()
    for (const [nome, aoa] of abas) XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), nome)
    return XLSX.write(wb, { bookType: 'xlsx', type: 'base64' })
  }, abas)
  escrever(rel, Buffer.from(b64, 'base64'))
}

/* ================================================================ carteira */

function dvCnpj (doze) {
  const calc = (s, pesos) => { const r = s.split('').reduce((a, d, i) => a + Number(d) * pesos[i], 0) % 11; return r < 2 ? 0 : 11 - r }
  const d1 = calc(doze, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  const d2 = calc(doze + d1, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  return doze + d1 + d2
}
const NOVO1 = dvCnpj('418529630001'); const NOVO2 = dvCnpj('527418960001'); const NOVO3 = dvCnpj('639271850001')
const linhasCarteira = [
  ['LUC', 'Loja', 'Razão Social', 'CNPJ', 'UF', 'Início do contrato', 'E-mail', 'WhatsApp', 'Regime', 'Segmento'],
  ['401', 'Verde Vida Empório', 'VERDE VIDA EMPORIO LTDA', formatarCnpj(NOVO1), 'SP', '01/09/2026', 'fiscal@verdevida.com.br', '11 97777-4010', 'Simples Nacional', 'Alimentação'],
  ['402', 'Nova Era Calçados', 'NOVA ERA CALCADOS LTDA', formatarCnpj(NOVO2), 'MG', '15/10/2026', 'adm@novaeracalcados.com.br', '', 'Lucro presumido', 'Calçados'],
  ['403', 'Loja Sem UF', 'LOJA SEM UF ME', formatarCnpj(NOVO3), '', '', 'contato@lojasemuf.com.br', '11 97777-4030', 'Simples Nacional', 'Serviços'],
  ['404', 'CNPJ Digitado Errado', 'ERRO DE DIGITACAO LTDA', '12.345.678/0001-00', 'SP', '01/01/2026', '', '', '', ''],
  ['405', 'Verde Vida (repetida)', 'VERDE VIDA EMPORIO LTDA', formatarCnpj(NOVO1), 'SP', '01/09/2026', '', '', '', ''],
  [BELA.luc, BELA.nome, BELA.razao, cnpjF(BELA), 'SP', '10/01/2016', 'novo.fiscal@belacosmeticos.com.br', '11 98888-0000', 'Lucro presumido', 'Beleza'],
]
await xlsx('1-carteira/lojistas-novos-e-com-erros.xlsx', [['Lojistas', linhasCarteira]])

/* =============================================================== auditoria */

// Bela (matriz e quiosque): os livros impressos e a ficha da demonstração
for (const f of ['livro-saidas-2025.pdf', 'livro-entradas-2025.pdf']) {
  copyFileSync(join(demo, f), join(saida, '2-auditoria', 'bela-' + f)); console.log('demo/simulacao/2-auditoria/bela-' + f)
}

// Trilha & Cia: SPED EFD ICMS/IPI, um arquivo por mês (é assim que o SPED sai)
const SPED_TRILHA = {
  '2025-01': { saidasSat: [62000, 58000, 60000], cancelada: 5000, devolucao: 0, st: 0 },      // 180.000 — tudo fecha
  '2025-02': { saidasSat: [80000, 80000], cancelada: 0, devolucao: 3000, st: 0 },             // 157.000 — ficha 155.500: ATENÇÃO
  '2025-03': { saidasSat: [85000, 85000], cancelada: 0, devolucao: 0, st: 25000 },            // 195.000 — ficha 170.000: DIVERGENTE
}
// no SPED o número vai sem separador de milhar: 62000,00
const sp = (n) => (Math.round(n * 100) / 100).toFixed(2).replace('.', ',')
for (const [comp, m] of Object.entries(SPED_TRILHA)) {
  const [a, mes] = comp.split('-'); const ult = new Date(Number(a), Number(mes), 0).getDate()
  const dt = (d) => `${p2(d)}${mes}${a}`
  const r = [`|0000|017|0|${dt(1)}|${dt(ult)}|${TRILHA.razao}|${TRILHA.cnpj}||SP|119507412110|3550308|||A|1|`]
  let doc = 5000
  m.saidasSat.forEach((v, i) => {
    r.push(`|C800|59|00|${900 + i}|${doc++}|chave${i}|${dt(10 + i * 5)}|${sp(v)}|${sp(v)}||||`)
    r.push(`|C850|000|5102|18,00|${sp(v)}|${sp(v)}|${sp(v * 0.18)}||`)
  })
  if (m.st) {
    r.push(`|C100|1|1|CLI01|55|00|1|${doc++}||${dt(20)}|${dt(20)}|${sp(m.st)}|0|||${sp(m.st)}|`)
    r.push(`|C190|060|5405|0,00|${sp(m.st)}|0,00|0,00|0,00|0,00|0,00|0,00||`)
  }
  if (m.cancelada) {
    r.push(`|C100|1|1|CLI02|55|02|1|${doc++}||${dt(22)}|${dt(22)}|${sp(m.cancelada)}|0|||${sp(m.cancelada)}|`)
    r.push(`|C190|000|5102|18,00|${sp(m.cancelada)}|${sp(m.cancelada)}|${sp(m.cancelada * 0.18)}|0,00|0,00|0,00|0,00||`)
  }
  if (m.devolucao) {
    r.push(`|C100|0|0|CLI03|55|00|1|${doc++}||${dt(25)}|${dt(25)}|${sp(m.devolucao)}|0|||${sp(m.devolucao)}|`)
    r.push(`|C190|000|1202|18,00|${sp(m.devolucao)}|${sp(m.devolucao)}|${sp(m.devolucao * 0.18)}|0,00|0,00|0,00|0,00||`)
  }
  r.push(`|9999|${r.length + 1}|`)
  escrever(`2-auditoria/trilha-sped-efd-${comp}.txt`, r.join('\r\n') + '\r\n')
}

// Urbano Moda Masculina: relatório "Resumo por CST/CFOP" do sistema fiscal, em PDF
const RESUMO_URBANO = {
  saidas: {
    '2025-01': [['00', '000', '18,00', '5102', 210000], ['00', '060', '0,00', '5405', 40000], ['00', '000', '18,00', '5949', 6500], ['00', '000', '18,00', '5910', 1200]],
    '2025-02': [['00', '000', '18,00', '5102', 190000], ['00', '060', '0,00', '5405', 35000]],
  },
  entradas: {
    '2025-01': [['00', '000', '18,00', '1202', 5000], ['00', '000', '18,00', '1102', 98000]],
    '2025-02': [['00', '000', '18,00', '1202', 2000], ['00', '000', '18,00', '1102', 91000]],
  },
}
for (const tipo of ['saidas', 'entradas']) {
  const paginas = Object.entries(RESUMO_URBANO[tipo]).map(([comp, linhas]) => {
    const [a, mes] = comp.split('-'); const ult = new Date(Number(a), Number(mes), 0).getDate()
    const total = linhas.reduce((s, l) => s + l[4], 0)
    const bc = linhas.reduce((s, l) => s + (l[1] === '060' ? 0 : l[4]), 0)
    const imp = linhas.reduce((s, l) => s + (l[1] === '060' ? 0 : l[4] * 0.18), 0)
    return `<section>
      <p>REGISTROS FISCAIS DOS DOCUMENTOS DE ${tipo === 'saidas' ? 'SAÍDAS DE MERCADORIAS E PRESTAÇÃO DE SERVIÇOS' : 'ENTRADAS DE MERCADORIAS E AQUISIÇÃO DE SERVIÇOS'}</p>
      <p>CONTRIBUINTE: ${URBANO.razao}</p>
      <p>CNPJ/CPF: ${cnpjF(URBANO)} INSCRIÇÃO ESTADUAL: 126156913113 UF: SP PERÍODO DE APURAÇÃO: 01/${mes}/${a} a ${ult}/${mes}/${a}</p>
      <p>&nbsp;</p><p>RESUMO - TOTAIS</p>
      ${linhas.map(([sit, cst, aliq, cfop, v]) => `<p>${sit} ${cst} ${aliq} ${cfop} ${brl(v)} ${brl(cst === '060' ? 0 : v)} ${brl(cst === '060' ? 0 : v * 0.18)} 0,00 0,00 0,00</p>`).join('')}
      <p>TOTAL ${brl(total)} ${brl(bc)} ${brl(imp)} 0,00 0,00 0,00</p>
    </section>`
  }).join('')
  await pdf(`2-auditoria/urbano-resumo-cst-cfop-${tipo}-2025.pdf`, `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    @page { size: A4; margin: 14mm } body { font-family: "DejaVu Sans Mono", monospace; font-size: 9pt; margin: 0 }
    section { break-after: page } section:last-child { break-after: auto } p { margin: 0 0 4px; white-space: pre }
  </style></head><body>${paginas}</body></html>`)
}

// Café Aurora: Simples Nacional — o extrato do PGDAS-D de dezembro/2025
const CAFE_MESES = { '12/2024': 88000, '01/2025': 81000, '02/2025': 79500, '03/2025': 83000, '04/2025': 84500, '05/2025': 92000,
  '06/2025': 86000, '07/2025': 90500, '08/2025': 88500, '09/2025': 85000, '10/2025': 87500, '11/2025': 93000 }
const CAFE_PA = 95000
const rbt12 = Object.values(CAFE_MESES).reduce((a, b) => a + b, 0)
const rba = Object.entries(CAFE_MESES).filter(([m]) => m.endsWith('2025')).reduce((a, [, v]) => a + v, 0) + CAFE_PA
const histLinhas = []
const ents = Object.entries(CAFE_MESES)
for (let i = 0; i < ents.length; i += 4) histLinhas.push(ents.slice(i, i + 4).map(([m, v]) => `${m} ${brl(v)}`).join(' '))
const zeros = []
for (let i = 0; i < ents.length; i += 4) zeros.push(ents.slice(i, i + 4).map(([m]) => `${m} 0,00`).join(' '))
const pgdas = [
  'Extrato do Simples Nacional', 'PGDAS-D 2018 Versão IC-2.2.19', '1) Informações do Contribuinte',
  `CNPJ Básico: ${cnpjF(CAFE).slice(0, 10)} Nome Empresarial: ${CAFE.razao}`,
  `2) Informações da Apuração ${CAFE.cnpj.slice(0, 8)}202512001`, 'Período de Apuração (PA): 12/2025',
  'Total de Receitas Brutas (R$) Mercado Interno Mercado Externo Total',
  `Receita Bruta do PA (RPA) - Competência ${brl(CAFE_PA)} 0,00 ${brl(CAFE_PA)}`,
  'Receita bruta acumulada nos doze meses anteriores ao PA', `${brl(rbt12)} 0,00 ${brl(rbt12)}`, '(RBT12)',
  `Receita bruta acumulada no ano-calendário corrente (RBA) ${brl(rba)} 0,00 ${brl(rba)}`,
  '2.2) Receitas Brutas Anteriores (R$)', '2.2.1) Mercado Interno', ...histLinhas, '2.2.2) Mercado Externo', ...zeros,
  '2.3) Folha de Salários Anteriores (R$)', '3) Informações dos Estabelecimentos - valores referentes às Receitas Informadas',
  `CNPJ Estabelecimento: ${cnpjF(CAFE)}`, 'Município: SAO PAULO UF: SP', 'Valor do Débito por Tributo para a Atividade (R$):',
  'Revenda de mercadorias, exceto para o exterior - Sem substituição tributária', `Receita Bruta Informada: R$ ${brl(CAFE_PA)}`,
  `Parcela 1: R$ ${brl(CAFE_PA)}`, 'Informações por Estabelecimento', `Valor Informado: ${brl(CAFE_PA)}`,
]
await pdf('2-auditoria/cafe-aurora-extrato-pgdas-d-2025-12.pdf', `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  @page { size: A4; margin: 14mm } body { font-family: "DejaVu Sans", sans-serif; font-size: 9.5pt; margin: 0 } p { margin: 0 0 4px }
</style></head><body>${pgdas.map(l => `<p>${l}</p>`).join('')}</body></html>`)

// Ótica Horizonte: o livro exportado em planilha pelo sistema da loja
const OTICA_LIVRO = [
  ['2025-01', '5102', 80000], ['2025-01', '1202', 1000],
  ['2025-02', '5102', 75000], ['2025-02', '1102', 32000],
  // 03/2025: sem livro (a ficha informa) -> SÓ NO INFORMADO
  ['2025-04', '5102', 72000],                       // sem ficha -> SÓ NA APURAÇÃO
  ['2025-05', '1102', 30000],                       // só entradas -> LIVRO INCOMPLETO
]
await xlsx('2-auditoria/otica-livro-fiscal-planilha-2025.xlsx', [['Livro', [
  ['Livro fiscal — exportação do sistema da loja'], [],
  ['CNPJ', 'Competência', 'CFOP', 'Valor Contábil', 'Base de Cálculo', 'ICMS'],
  ...OTICA_LIVRO.map(([c, cfop, v]) => [cnpjF(OTICA), `${c.slice(5)}/${c.slice(0, 4)}`, cfop, v, v, Math.round(v * 0.18 * 100) / 100]),
]]])

// Ficha anual de vendas informadas (o que cada loja declarou ao shopping) — 2025
const FICHA_2025 = [
  [cnpjF(BELA), 'Bela Cosméticos', '01/2025', 115500], [cnpjF(BELA), 'Bela Cosméticos', '02/2025', 98500],
  [cnpjF(BELA), 'Bela Cosméticos', '03/2025', 108050], [cnpjF(QUIOSQUE), 'Bela — quiosque', '01/2025', 45900],
  [cnpjF(TRILHA), 'Trilha & Cia', '01/2025', 180000], [cnpjF(TRILHA), 'Trilha & Cia', '02/2025', 155500],
  [cnpjF(TRILHA), 'Trilha & Cia', '03/2025', 170000],
  [cnpjF(URBANO), 'Urbano Moda Masculina', '01/2025', 245000], [cnpjF(URBANO), 'Urbano Moda Masculina', '02/2025', 200000],
  ...Object.entries(CAFE_MESES).filter(([m]) => m.endsWith('2025')).map(([m, v]) => [cnpjF(CAFE), 'Café Aurora', m, m === '05/2025' ? 80000 : v]),
  [cnpjF(CAFE), 'Café Aurora', '12/2025', CAFE_PA],
  [cnpjF(OTICA), 'Ótica Horizonte', '01/2025', 50000], [cnpjF(OTICA), 'Ótica Horizonte', '01/2025', 29000],   // duas linhas: somadas e avisadas
  [cnpjF(OTICA), 'Ótica Horizonte', '02/2025', 75000], [cnpjF(OTICA), 'Ótica Horizonte', '03/2025', 70000],
  [cnpjF(OTICA), 'Ótica Horizonte', '05/2025', 74000],
  ['', 'Linha sem CNPJ', '06/2025', 12000],                                                                   // recusada com aviso
]
await xlsx('2-auditoria/ficha-vendas-informadas-2025.xlsx', [['Vendas', [['CNPJ', 'Empresa', 'Competencia', 'Vendas'], ...FICHA_2025]]])

/* ============================================================ triangulação */

/**
 * Gera dias de redução Z e de PDV. `pdvExtra(dia)` soma venda sem cupom ao PDV;
 * `faltaZ` lista dias cuja redução Z não veio (o CRZ pula).
 */
function movimento ({ semente, baseValor, ano, mes, dias, pdvExtra = () => 0, faltaZ = [], total = null, crz0 = 300, gt0 = 900000 }) {
  const z = []; const pdv = []
  let crz = crz0; let gt = gt0
  const valores = dias.map(d => diario(semente, d, baseValor))
  if (total != null) {                    // ajusta o último dia para fechar o total pedido
    const soma = valores.reduce((a, b) => a + b, 0)
    valores[valores.length - 1] = Math.round((valores[valores.length - 1] + total - soma) * 100) / 100
  }
  dias.forEach((d, i) => {
    const data = `${p2(d)}/${p2(mes)}/${ano}`
    const v = valores[i]
    const vp = Math.round((v + pdvExtra(d)) * 100) / 100
    const cartao = Math.round(vp * 0.68 * 100) / 100
    pdv.push([data, 'PDV1', 'Cartão', cartao], [data, 'PDV1', 'Dinheiro/PIX', Math.round((vp - cartao) * 100) / 100])
    crz++
    gt = Math.round((gt + v) * 100) / 100
    if (!faltaZ.includes(d)) z.push({ data, crz, gt, v })
  })
  return { z, pdv }
}
const cupom = (l, x, serie) => `<div class="cupom">
  <p>${l.razao}<br>CNPJ: ${cnpjF(l)}   IE: 110${l.cnpj.slice(0, 9)}<br>ECF-IF   Nº DE SÉRIE: ${serie}   ECF: 001</p>
  <h2>REDUÇÃO Z</h2>
  <p>MOVIMENTO DO DIA: ${x.data}<br>COO: ${2000 + x.crz}   CRO: 1   CRZ: ${x.crz}</p>
  <p>VENDA BRUTA DIÁRIA: R$ ${brl(x.v)}<br>GRANDE TOTAL: ${brl(x.gt)}<br>CANCELAMENTOS: 0,00   DESCONTOS: 0,00</p>
</div>`
async function pdfZ (rel, l, zs, serie) {
  await pdf(rel, `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    @page { size: 80mm 120mm; margin: 5mm } body { font-family: "DejaVu Sans Mono", monospace; font-size: 8.5pt; margin: 0 }
    .cupom { break-after: page } h2 { font-size: 11pt; text-align: center; margin: 4px 0 } p { margin: 3px 0; line-height: 1.35 }
  </style></head><body>${zs.map(x => cupom(l, x, serie)).join('')}</body></html>`, { width: '80mm', height: '120mm', printBackground: true })
}
async function pdfPdv (rel, l, linhas, titulo) {
  const total = linhas.reduce((a, x) => a + x[3], 0)
  await pdf(rel, `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    @page { size: A4; margin: 14mm } body { font-family: "DejaVu Sans", sans-serif; font-size: 9.5pt; margin: 0 }
    h1 { font-size: 13pt; margin: 0 0 2px } p { margin: 2px 0 } table { border-collapse: collapse; width: 100%; margin-top: 10px }
    th, td { border-bottom: 1px solid #bbb; padding: 3px 6px; text-align: left } td.n, th.n { text-align: right } tr.t td { font-weight: bold; border-top: 2px solid #000 }
  </style></head><body>
    <h1>Relatório de vendas por dia — ${titulo}</h1>
    <p>${l.razao} · CNPJ: ${cnpjF(l)} · Sistema PDV Exemplo 4.2</p>
    <table><thead><tr><th>Data</th><th>Terminal</th><th>Forma de pagamento</th><th class="n">Valor</th></tr></thead>
    <tbody>${linhas.map(([d, t, f, v]) => `<tr><td>${d}</td><td>${t}</td><td>${f}</td><td class="n">${brl(v)}</td></tr>`).join('')}
    <tr class="t"><td colspan="3">TOTAL DO PERÍODO</td><td class="n">${brl(Math.round(total * 100) / 100)}</td></tr></tbody></table>
  </body></html>`)
}
const somaZ = (m) => Math.round(m.z.reduce((a, x) => a + x.v, 0) * 100) / 100
const somaPdv = (m) => Math.round(m.pdv.reduce((a, x) => a + x[3], 0) * 100) / 100

const OUT = Array.from({ length: 25 }, (_, i) => i + 1)   // 1 a 25/10/2026
const mLume = movimento({ semente: 613, baseValor: 4200, ano: 2026, mes: 10, dias: OUT })
const mVert = movimento({ semente: 887, baseValor: 5100, ano: 2026, mes: 10, dias: OUT, pdvExtra: d => (d >= 8 && d <= 12 ? 1500 + d * 20 : 0) })
const mPet = movimento({ semente: 431, baseValor: 3600, ano: 2026, mes: 10, dias: OUT, faltaZ: [15] })
const mRaiz = movimento({ semente: 271, baseValor: 2900, ano: 2026, mes: 10, dias: OUT })
const mBambu = movimento({ semente: 359, baseValor: 3300, ano: 2026, mes: 10, dias: [1, 2, 3] })
const mTrilha = movimento({ semente: 701, baseValor: 5800, ano: 2025, mes: 1, dias: Array.from({ length: 31 }, (_, i) => i + 1), total: 180000 })

await pdfZ('3-triangulacao/lume-joias-reducao-z-2026-10.pdf', LUME, mLume.z, 'LJ0451122')
await pdfPdv('3-triangulacao/lume-joias-pdv-2026-10.pdf', LUME, mLume.pdv, 'Outubro/2026 (1 a 25)')
await pdfZ('3-triangulacao/vertice-calcados-reducao-z-2026-10.pdf', VERTICE, mVert.z, 'VC0987001')
await pdfPdv('3-triangulacao/vertice-calcados-pdv-2026-10.pdf', VERTICE, mVert.pdv, 'Outubro/2026 (1 a 25)')
await pdfZ('3-triangulacao/mundo-pet-reducao-z-2026-10.pdf', MUNDOPET, mPet.z, 'MP0332190')
await pdfPdv('3-triangulacao/mundo-pet-pdv-2026-10.pdf', MUNDOPET, mPet.pdv, 'Outubro/2026 (1 a 25)')
await pdfZ('3-triangulacao/raiz-natural-reducao-z-2026-10.pdf', RAIZ, mRaiz.z, 'RN0120455')
await pdfPdv('3-triangulacao/bambu-decor-pdv-2026-10.pdf', BAMBU, mBambu.pdv, 'Outubro/2026 (1 a 3)')
await pdfZ('3-triangulacao/trilha-reducao-z-2025-01.pdf', TRILHA, mTrilha.z, 'TC0774410')
await pdfPdv('3-triangulacao/trilha-pdv-2025-01.pdf', TRILHA, mTrilha.pdv, 'Janeiro/2025')
for (const f of ['reducao-z-marco-2025.pdf', 'pdv-marco-2025.pdf']) {
  copyFileSync(join(demo, f), join(saida, '3-triangulacao', 'bela-' + f)); console.log('demo/simulacao/3-triangulacao/bela-' + f)
}

// Bambu Decor: a redução Z chega como FOTO do cupom (o caminho do OCR)
await pagina.setViewportSize({ width: 620, height: 900 })
for (const x of mBambu.z) {
  await pagina.setContent(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body { margin: 0; background: radial-gradient(circle at 30% 20%, #b9a58a, #8c7a62); height: 900px; display: flex; align-items: center; justify-content: center }
    .cupom { background: #fbfaf5; width: 420px; padding: 26px 24px; transform: rotate(-2.2deg); box-shadow: 0 10px 30px rgba(0,0,0,.35);
      font-family: "DejaVu Sans Mono", monospace; font-size: 17px; color: #222 }
    h2 { text-align: center; font-size: 22px; margin: 8px 0 } p { margin: 6px 0; line-height: 1.45 }
  </style></head><body>${cupom(BAMBU, x, 'BD0556032')}</body></html>`, { waitUntil: 'load' })
  escrever(`3-triangulacao/bambu-decor-reducao-z-foto-${x.data.slice(0, 2)}-10-2026.jpg`, await pagina.screenshot({ type: 'jpeg', quality: 88 }))
}

// Ficha de vendas informadas de outubro/2026 — o "declarado" da triangulação
const FICHA_OUT = [
  [cnpjF(LUME), 'Lume Joias', '10/2026', somaZ(mLume)],                                   // = Z = PDV
  [cnpjF(VERTICE), 'Vértice Calçados', '10/2026', somaZ(mVert)],                          // = Z, abaixo do PDV
  [cnpjF(MUNDOPET), 'Mundo Pet Center', '10/2026', Math.round(somaPdv(mPet) * 0.995 * 100) / 100],
  [cnpjF(BAMBU), 'Bambu Decor', '10/2026', somaZ(mBambu)],
]
await xlsx('3-triangulacao/ficha-vendas-informadas-2026-10.xlsx', [['Vendas', [['CNPJ', 'Empresa', 'Competencia', 'Vendas'], ...FICHA_OUT]]])

// NAPP: a planilha diária do shopping, pelo número da loja (LUC), com o nome fantasia
const pdvDia = (m) => { const d = new Map(); for (const [data, , , v] of m.pdv) d.set(data, Math.round(((d.get(data) || 0) + v) * 100) / 100); return d }
const nappLinhas = []
for (const x of mLume.z) nappLinhas.push([x.data, LUME.luc, LUME.nome, x.v])                              // = Z: coerente
for (const [data, v] of pdvDia(mVert)) nappLinhas.push([data, VERTICE.luc, VERTICE.nome, v])                // = PDV: empata no maior
for (const [data, v] of pdvDia(mPet)) nappLinhas.push([data, MUNDOPET.luc, MUNDOPET.nome, Math.round((v + (Number(data.slice(0, 2)) <= 5 ? 400 : 0)) * 100) / 100])  // dias 1–5 acima do PDV
nappLinhas.push(['01/10/2026', '999', 'Loja fora da carteira', 1234.56])                                   // LUC sem cadastro: aviso
await xlsx('3-triangulacao/napp-vendas-diarias-2026-10.xlsx', [['NAPP', [['Data', 'Loja', 'Nome fantasia', 'Venda'], ...nappLinhas]]])
const somaNapp = (luc) => Math.round(nappLinhas.filter(l => l[1] === luc).reduce((a, l) => a + l[3], 0) * 100) / 100

await navegador.close()

/* ================================================================ cenários */

/** O que cada arquivo deve produzir no app. scripts/conferir-simulacao.mjs confere um a um. */
const CENARIOS = {
  lojas: { BELA, QUIOSQUE, CAFE, TRILHA, OTICA, VERTICE, LUME, URBANO, MUNDOPET, RAIZ, BAMBU },
  novos: { NOVO1, NOVO2, NOVO3 },
  totais: {
    lume: { z: somaZ(mLume), pdv: somaPdv(mLume) }, vertice: { z: somaZ(mVert), pdv: somaPdv(mVert) },
    mundopet: { z: somaZ(mPet), pdv: somaPdv(mPet) }, raiz: { z: somaZ(mRaiz) }, bambu: { z: somaZ(mBambu), pdv: somaPdv(mBambu) },
    trilhaJan: { z: somaZ(mTrilha), pdv: somaPdv(mTrilha) },
    napp: { lume: somaNapp(LUME.luc), vertice: somaNapp(VERTICE.luc), mundopet: somaNapp(MUNDOPET.luc) },
  },
}
writeFileSync(join(saida, '.cenarios.json'), JSON.stringify(CENARIOS, null, 2))
