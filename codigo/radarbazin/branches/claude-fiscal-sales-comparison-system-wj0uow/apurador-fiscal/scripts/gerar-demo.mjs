#!/usr/bin/env node
/**
 * Gera os arquivos de demonstração usados no vídeo e para quem quiser testar
 * o sistema sem usar dados reais.
 *
 * Empresa, CNPJ e valores são FICTÍCIOS. As divergências são propositais:
 * cada uma ensina um caso que aparece de verdade na conciliação.
 *
 *   demo/livro-saidas-2025.pdf     livro impresso (mesmo layout dos livros reais)
 *   demo/livro-entradas-2025.pdf
 *   demo/vendas-informadas.xlsx    planilha com o que a empresa informou
 *   demo/reducao-z-marco-2025.pdf  cupons de redução Z (só PDF/foto entram na triangulação)
 *   demo/pdv-marco-2025.pdf        relatório de vendas por dia do PDV
 *   demo/napp-marco-2025.xlsx      NAPP diário (planilha do shopping, pelo número da loja)
 *   demo/lojistas.csv              relação de lojistas para o painel de acompanhamento
 */
import { chromium } from 'playwright'
import { writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'
import { caminhoChromium } from './chromium.mjs'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const saida = join(raiz, 'demo')
if (!existsSync(saida)) mkdirSync(saida)

const MATRIZ = { cnpj: '11.222.333/0001-81', ie: '110123456789', nome: 'BELA COSMETICOS LTDA' }
const FILIAL = { cnpj: '11.222.333/0002-62', ie: '110123456790', nome: 'BELA COSMETICOS LTDA' }

/**
 * Cenário. Cada mês foi montado para produzir um desfecho didático:
 *  matriz 01  tudo bate                       -> OK
 *  matriz 02  vendas com ST fora da planilha  -> DIVERGENTE
 *  matriz 03  contra-lançamento de ECF        -> OK, mas o detalhe explica
 *  filial 01  diferença pequena               -> ATENÇÃO
 *  filial 02  venda no livro sem nada informado -> SÓ NO LIVRO
 */
const LIVROS = [
  { emp: MATRIZ, mes: '01/2025', saidas: [['5.102', 120000], ['5.910', 3000], ['5.949', 1500]],
    entradas: [['1.102', 60000], ['1.202', 4500]] },
  { emp: MATRIZ, mes: '02/2025', saidas: [['5.102', 98500], ['5.405', 40000]],
    entradas: [['1.102', 55000]] },
  { emp: MATRIZ, mes: '03/2025', saidas: [['5.102', 110250], ['5.929', 110250]],
    entradas: [['1.102', 48000], ['1.411', 2200]] },
  { emp: FILIAL, mes: '01/2025', saidas: [['5.102', 45000]], entradas: [] },
  { emp: FILIAL, mes: '02/2025', saidas: [['5.102', 52000]], entradas: [['1.102', 20000]] },
]

const INFORMADAS = [
  [MATRIZ.cnpj, 'Matriz', '01/2025', 115500],   // bate: 120.000 - 4.500
  [MATRIZ.cnpj, 'Matriz', '02/2025', 98500],    // faltou a venda com ST (5.405)
  [MATRIZ.cnpj, 'Matriz', '03/2025', 108050],   // bate: 110.250 - 2.200
  [FILIAL.cnpj, 'Filial 02', '01/2025', 45900], // 900 a mais: diferença pequena
  // fevereiro da filial não foi informado de propósito
]

const brl = (n) => n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** Reproduz o layout do livro fiscal impresso (modelo P1/P2). */
function paginaLivro (emp, mes, tipo, linhas, folha) {
  const titulo = tipo === 'saidas' ? 'REGISTRO DE SAIDAS' : 'REGISTRO DE ENTRADAS'
  const grupo = tipo === 'saidas'
    ? '5000 - Saidas e/ou Prestação de serviços no estado'
    : '1000 - Entradas e/ou Aquisição de serviços no estado'
  const total = linhas.reduce((a, l) => a + l[1], 0)
  const detalhe = linhas.map(([cfop, v], i) => `
    <tr><td>${String(i + 3).padStart(2, '0')}/${mes.slice(0, 2)}</td><td>NFE</td><td>1</td>
      <td>${1000 + i}</td><td>SP</td><td class="n">${brl(v)}</td><td>${cfop}</td>
      <td>Icms</td><td class="n">${brl(v)}</td><td class="n">0,00</td><td class="n">0,00</td></tr>`).join('')
  return `<section>
    <h1>${titulo}</h1>
    <p class="cab">FIRMA : ${emp.nome}</p>
    <p class="cab">INSCR. EST. : ${emp.ie} &nbsp;&nbsp; C.N.P.J.: ${emp.cnpj}</p>
    <p class="cab">FOLHA : ${folha} &nbsp;&nbsp; MES OU PERIODO/ANO: ${mes}</p>
    <table>
      <thead><tr><th>Data</th><th>Esp</th><th>Serie</th><th>No Dcto</th><th>UF</th>
        <th class="n">Valor Contabil</th><th>CFOP</th><th>ICMS</th>
        <th class="n">Base de Calculo</th><th class="n">Aliq</th><th class="n">Imposto</th></tr></thead>
      <tbody>${detalhe}
        <tr class="soma"><td colspan="5">Icms</td><td class="n">${brl(total)}</td><td colspan="2"></td>
          <td class="n">${brl(total)}</td><td class="n">0,00</td><td class="n">0,00</td></tr>
      </tbody>
    </table>
    <p class="resumo">RESUMO MENSAL DE OPERACOES E PRESTACAO POR CODIGO FISCAL</p>
    <table class="rm">
      <thead><tr><th>COD. FISC.</th><th class="n">VLR. CONTABIL</th><th class="n">BASE CALC.</th>
        <th class="n">IMPOSTO</th><th class="n">ISENTAS</th><th class="n">OUTRAS</th></tr></thead>
      <tbody>
        <tr class="grupo"><td colspan="6">${grupo}</td></tr>
        ${linhas.map(([cfop, v]) => `<tr><td>${cfop}</td><td class="n">${brl(v)}</td>
          <td class="n">${brl(v)}</td><td class="n">0,00</td><td class="n">0,00</td><td class="n">0,00</td></tr>`).join('')}
        <tr class="soma"><td>SUB TOTAL</td><td class="n">${brl(total)}</td><td class="n">${brl(total)}</td>
          <td class="n">0,00</td><td class="n">0,00</td><td class="n">0,00</td></tr>
        <tr class="soma"><td>TOTAL</td><td class="n">${brl(total)}</td><td class="n">${brl(total)}</td>
          <td class="n">0,00</td><td class="n">0,00</td><td class="n">0,00</td></tr>
      </tbody>
    </table>
  </section>`
}

function documento (tipo) {
  let folha = 1
  const paginas = LIVROS
    .filter(l => l[tipo].length || tipo === 'saidas')
    .map(l => paginaLivro(l.emp, l.mes, tipo, l[tipo], ++folha))
    .join('')
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><style>
    @page { size: A4 landscape; margin: 12mm }
    body { font-family: "DejaVu Sans Mono", monospace; font-size: 8.5pt; color: #000; margin: 0 }
    section { page-break-after: always }
    section:last-child { page-break-after: auto }
    h1 { font-size: 11pt; text-align: center; margin: 0 0 6px; letter-spacing: 1px }
    p.cab { margin: 1px 0 }
    table { width: 100%; border-collapse: collapse; margin-top: 8px }
    th, td { border-bottom: 1px solid #999; padding: 2px 4px; text-align: left; font-weight: normal }
    thead th { border-top: 1px solid #000; border-bottom: 1px solid #000; font-size: 7.5pt }
    td.n, th.n { text-align: right }
    tr.soma td { font-weight: bold; border-top: 1px solid #000 }
    tr.grupo td { font-weight: bold; border: 0; padding-top: 6px }
    p.resumo { margin: 14px 0 0; font-weight: bold; font-size: 9pt }
    table.rm { margin-top: 2px }
  </style></head><body>${paginas}</body></html>`
}

const navegador = await chromium.launch({ executablePath: caminhoChromium() })
const pagina = await navegador.newPage()

for (const tipo of ['saidas', 'entradas']) {
  await pagina.setContent(documento(tipo), { waitUntil: 'load' })
  const pdf = await pagina.pdf({ format: 'A4', landscape: true, printBackground: true })
  writeFileSync(join(saida, `livro-${tipo}-2025.pdf`), pdf)
  console.log(`demo/livro-${tipo}-2025.pdf`)
}

// A planilha é montada com o mesmo SheetJS que a página usa.
await pagina.goto(pathToFileURL(join(raiz, 'index.html')).href)
await pagina.waitForFunction(() => typeof globalThis.XLSX !== 'undefined')
const b64 = await pagina.evaluate((dados) => {
  const wb = XLSX.utils.book_new()
  const aoa = [['CNPJ', 'Empresa', 'Competencia', 'Vendas'], ...dados]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), 'Vendas')
  return XLSX.write(wb, { bookType: 'xlsx', type: 'base64' })
}, INFORMADAS)
writeFileSync(join(saida, 'vendas-informadas.xlsx'), Buffer.from(b64, 'base64'))
console.log('demo/vendas-informadas.xlsx')


/* ------------------------------------------- triangulação: Z e PDV diários */

/*
 * Março da matriz, dia a dia. Três casos plantados:
 *   - a maior parte dos dias fecha entre Z e PDV;
 *   - nos dias 12, 13 e 14 o PDV vende mais do que a Z registra (venda sem cupom);
 *   - a redução Z do dia 20 não está no material, e o CRZ pula por isso.
 */
const DIAS_MARCO = 31
const zLinhas = []
const pdvLinhas = []
let gt = 480000        // Grande Total acumulado no fim de fevereiro
let crz = 610
for (let dia = 1; dia <= DIAS_MARCO; dia++) {
  const data = `${String(dia).padStart(2, '0')}/03/2025`
  const base = 3200 + ((dia * 971) % 1900)          // variação diária estável
  const semCupom = [12, 13, 14].includes(dia) ? 900 + dia * 40 : 0
  const z = Math.round(base * 100) / 100
  const pdv = Math.round((base + semCupom) * 100) / 100
  pdvLinhas.push([data, 'PDV1', 'Cartão', brl(Math.round(pdv * 0.7 * 100) / 100)])
  pdvLinhas.push([data, 'PDV1', 'Dinheiro', brl(Math.round((pdv - Math.round(pdv * 0.7 * 100) / 100) * 100) / 100)])
  if (dia === 20) { crz += 1; gt += z; continue }   // redução Z ausente de propósito
  crz += 1
  gt = Math.round((gt + z) * 100) / 100
  zLinhas.push({ data, crz, gt, z })
}

/*
 * A triangulação recebe só PDF ou foto — o cupom de redução Z e o relatório do
 * PDV como saem da loja. Os dois são gerados aqui como PDF impresso, no layout
 * genérico de cada um (a leitura é por rótulo, não por posição).
 */
const cuponsZ = zLinhas.map(l => `<div class="cupom">
  <p>BELA COSMETICOS LTDA<br>CNPJ: 11.222.333/0001-81   IE: 110123456789<br>ECF-IF VR   Nº DE SÉRIE: BE0912345   ECF: 001</p>
  <h2>REDUÇÃO Z</h2>
  <p>MOVIMENTO DO DIA: ${l.data}<br>COO: ${1000 + l.crz}   CRO: 1   CRZ: ${l.crz}</p>
  <p>VENDA BRUTA DIÁRIA: R$ ${brl(l.z)}<br>GRANDE TOTAL: ${brl(l.gt)}<br>CANCELAMENTOS: 0,00   DESCONTOS: 0,00</p>
</div>`).join('')
// bobina de 80 mm, um cupom por página: é assim que o cupom sai da impressora fiscal
await pagina.setContent(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  @page { size: 80mm 120mm; margin: 5mm } body { font-family: "DejaVu Sans Mono", monospace; font-size: 8.5pt; margin: 0 }
  .cupom { break-after: page } h2 { font-size: 11pt; text-align: center; margin: 4px 0 } p { margin: 3px 0; line-height: 1.35 }
</style></head><body>${cuponsZ}</body></html>`, { waitUntil: 'load' })
writeFileSync(join(saida, 'reducao-z-marco-2025.pdf'), await pagina.pdf({ width: '80mm', height: '120mm', printBackground: true }))
console.log('demo/reducao-z-marco-2025.pdf')

const linhasPdv = pdvLinhas.map(([data, term, forma, valor]) => `<tr><td>${data}</td><td>${term}</td><td>${forma}</td><td class="n">${valor}</td></tr>`).join('')
const totalPdv = brl(pdvLinhas.reduce((a, l) => a + Number(l[3].replace(/\./g, '').replace(',', '.')), 0))
await pagina.setContent(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  @page { size: A4; margin: 14mm } body { font-family: "DejaVu Sans", sans-serif; font-size: 9.5pt; margin: 0 }
  h1 { font-size: 13pt; margin: 0 0 2px } p { margin: 2px 0 } table { border-collapse: collapse; width: 100%; margin-top: 10px }
  th, td { border-bottom: 1px solid #bbb; padding: 3px 6px; text-align: left } td.n, th.n { text-align: right } tr.t td { font-weight: bold; border-top: 2px solid #000 }
</style></head><body>
  <h1>Relatório de vendas por dia — Março/2025</h1>
  <p>BELA COSMETICOS LTDA · CNPJ: 11.222.333/0001-81 · Sistema PDV Exemplo 4.2 · emitido em 01/04/2025</p>
  <table><thead><tr><th>Data</th><th>Terminal</th><th>Forma de pagamento</th><th class="n">Valor</th></tr></thead>
  <tbody>${linhasPdv}<tr class="t"><td colspan="3">TOTAL DO PERÍODO</td><td class="n">${totalPdv}</td></tr></tbody></table>
</body></html>`, { waitUntil: 'load' })
writeFileSync(join(saida, 'pdv-marco-2025.pdf'), await pagina.pdf({ format: 'A4', printBackground: true }))
console.log('demo/pdv-marco-2025.pdf')

// NAPP de março: a planilha diária do shopping, pelo número da loja (LUC 101).
// Igual ao PDV dia a dia — confirma o PDV contra a redução Z.
const nappDia = new Map()
for (const [data, , , valor] of pdvLinhas) nappDia.set(data, Math.round(((nappDia.get(data) || 0) + Number(valor.replace(/\./g, '').replace(',', '.'))) * 100) / 100)
const b64Napp = await pagina.evaluate((linhas) => {
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Data', 'Loja', 'Nome fantasia', 'Venda'], ...linhas]), 'NAPP')
  return XLSX.write(wb, { bookType: 'xlsx', type: 'base64' })
}, [...nappDia].map(([data, v]) => [data, '101', 'Bela Cosméticos', v]))
writeFileSync(join(saida, 'napp-marco-2025.xlsx'), Buffer.from(b64Napp, 'base64'))
console.log('demo/napp-marco-2025.xlsx')

/* ----------------------------------------------------- carteira de lojistas */

// CNPJ fictícios com dígito verificador válido — o sistema recusa os inválidos.
const LOJISTAS = [
  ['101', 'Bela Cosméticos', 'BELA COSMETICOS LTDA', '11.222.333/0001-81', 'fiscal@belacosmeticos.com.br', '11 98888-1001', 'Lucro presumido', 'Beleza'],
  ['102', 'Bela Cosméticos — quiosque', 'BELA COSMETICOS LTDA', '11.222.333/0002-62', 'fiscal@belacosmeticos.com.br', '11 98888-1002', 'Lucro presumido', 'Beleza'],
  ['207', 'Café Aurora', 'AURORA CAFES E DOCES ME', '12.345.678/0001-95', 'contato@cafeaurora.com.br', '11 98888-2007', 'Simples Nacional', 'Alimentação'],
  ['214', 'Trilha & Cia', 'TRILHA ARTIGOS ESPORTIVOS LTDA', '45.678.912/0001-55', 'adm@trilhaecia.com.br', '', 'Lucro real', 'Esporte'],
  ['308', 'Ótica Horizonte', 'HORIZONTE OTICA EIRELI', '78.912.345/0001-09', 'otica.horizonte@gmail.com', '11 98888-3008', 'Simples Nacional', 'Serviços'],
  ['311', 'Brinquedos Pipa', 'PIPA COMERCIO DE BRINQUEDOS LTDA', '32.165.498/0001-39', '', '11 98888-3011', 'Simples Nacional', 'Infantil'],
  ['402', 'Casa Linho', 'LINHO DECORACAO LTDA', '65.498.732/0001-07', 'financeiro@casalinho.com.br', '11 98888-4002', 'Lucro presumido', 'Casa'],
  ['415', 'Studio Vinil', 'VINIL DISCOS E LIVROS ME', '14.725.836/0001-68', 'oi@studiovinil.com.br', '11 98888-4015', 'Simples Nacional', 'Cultura'],
]
const INICIOS = ['15/03/2021', '01/08/2023', '10/11/2019', '20/05/2024', '02/02/2022', '18/09/2025', '05/06/2020', '12/12/2023']
const csv = [['LUC', 'Loja', 'Razão Social', 'CNPJ', 'E-mail', 'WhatsApp', 'Regime', 'Segmento', 'UF', 'Início do contrato'], ...LOJISTAS.map((l, i) => [...l, 'SP', INICIOS[i]])]
  .map(l => l.map(c => /[;"]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c).join(';')).join('\r\n') + '\r\n'
writeFileSync(join(saida, 'lojistas.csv'), '\ufeff' + csv, 'utf8')
console.log('demo/lojistas.csv')

await navegador.close()
