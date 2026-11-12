/**
 * Parsers de livros fiscais. Tudo aqui é função pura sobre texto/linhas —
 * a leitura de arquivo (PDF, XLSX, OCR) fica em ingest.js, que só roda no browser.
 *
 * Saída padronizada: lista de LANCAMENTOS
 * {
 *   cnpj, empresa, ie, competencia:'AAAA-MM', livro:'entradas'|'saidas',
 *   cfop, cst, valorContabil, baseCalculo, icms, isentas, outras,
 *   origem:{ formato, arquivo, referencia }, confianca:'alta'|'media'|'baixa'
 * }
 */

/* ---------------------------------------------------------------- utilidades */

/** "1.234.567,89" | "1234567.89" | "1234,5" -> number. Retorna NaN se não parecer número. */
export function numeroBR (bruto) {
  if (typeof bruto === 'number') return Number.isFinite(bruto) ? bruto : NaN
  if (bruto == null) return NaN
  let s = String(bruto).trim()
  if (!s) return NaN
  let negativo = false
  if (/^\(.*\)$/.test(s)) { negativo = true; s = s.slice(1, -1) }
  s = s.replace(/[R$\s ]/g, '')
  if (/^-/.test(s)) { negativo = true; s = s.slice(1) }
  if (!/^[\d.,]+$/.test(s)) return NaN
  const temVirgula = s.includes(',')
  const temPonto = s.includes('.')
  if (temVirgula && temPonto) {
    // o separador decimal é o último que aparece
    s = s.lastIndexOf(',') > s.lastIndexOf('.')
      ? s.replace(/\./g, '').replace(',', '.')
      : s.replace(/,/g, '')
  } else if (temVirgula) {
    s = s.replace(/\./g, '').replace(',', '.')
  } else if (temPonto) {
    // "1.234" é milhar; "1.23" é decimal
    const partes = s.split('.')
    const ultimo = partes[partes.length - 1]
    s = (partes.length > 1 && ultimo.length === 3 && partes[0].length <= 3 && partes.every((p, i) => i === 0 || p.length === 3))
      ? partes.join('')
      : s
  }
  const n = Number(s)
  if (!Number.isFinite(n)) return NaN
  return negativo ? -n : n
}

/** Extrai só dígitos e valida tamanho de CNPJ (14) ou CPF (11). */
export function normalizarCnpj (bruto) {
  if (bruto == null) return null
  const d = String(bruto).replace(/\D/g, '')
  if (d.length === 14 || d.length === 11) return d
  if (d.length > 0 && d.length < 14) return d.padStart(14, '0')
  return null
}

export function formatarCnpj (d) {
  if (!d) return ''
  if (d.length === 14) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
  if (d.length === 11) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
  return d
}

const MESES_PT = { jan: 1, fev: 2, mar: 3, abr: 4, mai: 5, jun: 6, jul: 7, ago: 8, set: 9, out: 10, nov: 11, dez: 12 }

/**
 * Converte várias formas para 'AAAA-MM':
 * '01/2025', '1/2025', '2025-01', '15/01/2025', '01012025' (ddmmaaaa),
 * 'jan/25', Date, serial de Excel.
 */
export function normalizarCompetencia (bruto) {
  if (bruto == null || bruto === '') return null
  if (bruto instanceof Date && !isNaN(bruto)) {
    return `${bruto.getUTCFullYear()}-${String(bruto.getUTCMonth() + 1).padStart(2, '0')}`
  }
  if (typeof bruto === 'number' && bruto > 20000 && bruto < 80000) {
    // serial de data do Excel (base 1899-12-30)
    const ms = Math.round(bruto) * 86400000 + Date.UTC(1899, 11, 30)
    return normalizarCompetencia(new Date(ms))
  }
  const s = String(bruto).trim()
  let m
  if ((m = s.match(/^(\d{4})[-/](\d{1,2})$/))) return mm(m[1], m[2])
  if ((m = s.match(/^(\d{1,2})[-/.](\d{4})$/))) return mm(m[2], m[1])
  if ((m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/))) return mm(m[3], m[2])
  if ((m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/))) return mm(m[1], m[2])
  if ((m = s.match(/^(\d{2})(\d{2})(\d{4})$/))) return mm(m[3], m[2])   // ddmmaaaa (SPED)
  if ((m = s.match(/^(\d{1,2})[-/.](\d{2})$/))) return mm('20' + m[2], m[1])
  if ((m = s.match(/^([a-zç]{3})[a-zç]*[-/. ]+(\d{2,4})$/i))) {
    const mes = MESES_PT[m[1].toLowerCase()]
    if (mes) return mm(m[2].length === 2 ? '20' + m[2] : m[2], mes)
  }
  return null
  function mm (ano, mes) {
    const a = Number(ano); const b = Number(mes)
    if (!(a >= 1900 && a <= 2200) || !(b >= 1 && b <= 12)) return null
    return `${a}-${String(b).padStart(2, '0')}`
  }
}

/** Formata em reais para as mensagens dos parsers. */
export function moedaBR (n) {
  return (Number(n) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/** Percentual com vírgula, como o dinheiro: "16,29%" e não "16.29%". */
export function percentBR (n, casas = 2, sinal = false) {
  if (n == null || !Number.isFinite(Number(n))) return '—'
  const v = Number(n)
  const t = v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas }) + '%'
  return sinal && v > 0 ? '+' + t : t
}

export function competenciaLabel (c) {
  if (!c) return '—'
  const [a, m] = c.split('-')
  return `${m}/${a}`
}

function lanc (base) {
  return {
    cnpj: null, empresa: null, ie: null, competencia: null, livro: null,
    cfop: null, cst: null, valorContabil: 0, baseCalculo: 0, icms: 0,
    isentas: 0, outras: 0, confianca: 'alta', origem: {}, ...base,
  }
}

/* ------------------------------------------------------- 1. SPED EFD ICMS/IPI */

const COD_SIT_CANCELADO = new Set(['02', '03', '04', '05'])

/**
 * EFD ICMS/IPI (arquivo .txt delimitado por "|").
 * Registros usados: 0000 (contribuinte/período), C100+C190, C500+C590,
 * C400+C490 (ECF), C800+C850 (SAT/CF-e), D100+D190, D500+D590.
 * Documentos com COD_SIT de cancelamento/denegação são descartados.
 */
export function parseSpedEfd (texto, arquivo = '') {
  const linhas = String(texto).split(/\r?\n/)
  const out = []
  const avisos = []
  let ctx = { cnpj: null, empresa: null, ie: null, competencia: null }
  let pai = null           // documento corrente { livro, cancelado }
  let descartados = 0

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i]
    if (!linha || linha.indexOf('|') === -1) continue
    const f = linha.split('|')
    const reg = (f[1] || '').trim().toUpperCase()

    switch (reg) {
      case '0000': {
        ctx = {
          cnpj: normalizarCnpj(f[7]) || normalizarCnpj(f[8]),
          empresa: (f[6] || '').trim() || null,
          ie: (f[10] || '').trim() || null,
          competencia: normalizarCompetencia(f[4]) || normalizarCompetencia(f[5]),
        }
        if (!ctx.cnpj) avisos.push(`Registro 0000 sem CNPJ legível (linha ${i + 1}).`)
        if (!ctx.competencia) avisos.push(`Registro 0000 sem período legível (linha ${i + 1}).`)
        break
      }
      case 'C100': case 'C500': case 'D100': case 'D500': {
        const indOper = (f[2] || '').trim()
        const codSit = (f[6] || '').trim().padStart(2, '0')
        pai = {
          livro: indOper === '1' ? 'saidas' : 'entradas',
          cancelado: reg === 'C100' && COD_SIT_CANCELADO.has(codSit),
          reg,
        }
        break
      }
      case 'C400': case 'C800': case 'C860': {
        pai = { livro: 'saidas', cancelado: false, reg } // ECF / SAT: sempre saída
        break
      }
      case 'C190': case 'C590': case 'D190': case 'D590': {
        if (!pai) { avisos.push(`${reg} sem documento pai na linha ${i + 1} — ignorado.`); continue }
        if (pai.cancelado) { descartados++; continue }
        out.push(lanc({
          ...ctx, livro: pai.livro,
          cst: (f[2] || '').trim() || null,
          cfop: (f[3] || '').trim() || null,
          valorContabil: numeroBR(f[5]) || 0,
          baseCalculo: numeroBR(f[6]) || 0,
          icms: numeroBR(f[7]) || 0,
          origem: { formato: 'SPED EFD', arquivo, referencia: `${reg} linha ${i + 1}` },
        }))
        break
      }
      case 'C490': case 'C850': {
        if (!pai) pai = { livro: 'saidas', cancelado: false, reg }
        out.push(lanc({
          ...ctx, livro: 'saidas',
          cst: (f[2] || '').trim() || null,
          cfop: (f[3] || '').trim() || null,
          valorContabil: numeroBR(f[5]) || 0,
          baseCalculo: numeroBR(f[6]) || 0,
          icms: numeroBR(f[7]) || 0,
          origem: { formato: 'SPED EFD', arquivo, referencia: `${reg} linha ${i + 1}` },
        }))
        break
      }
    }
  }
  if (descartados) avisos.push(`${descartados} lançamento(s) de documento cancelado/denegado foram descartados.`)
  return { lancamentos: out, avisos, formato: 'SPED EFD ICMS/IPI' }
}

/* ------------------------------------------- 2. Livro clássico (PDF impresso) */

const RX_CNPJ = /C\.?N\.?P\.?J\.?[\s.:/]*([\d]{2}[.\s]?\d{3}[.\s]?\d{3}[/\s]?\d{4}[-\s]?\d{2})/i
const RX_CPF_CNPJ2 = /CNPJ\s*\/?\s*CPF\s*:?\s*([\d.\-/]{11,20})/i
const RX_IE = /INSCR(?:I[ÇC][ÃA]O)?\.?\s*EST(?:ADUAL)?\.?\s*:?\s*([\d.\-/]{6,20})/i

/**
 * Livro Registro de Entradas/Saídas impresso (modelo P1/P2), no qual cada
 * mês termina com "RESUMO MENSAL DE OPERAÇÕES E PRESTAÇÃO POR CÓDIGO FISCAL".
 * Recebe o texto do PDF; se `paginas` for um array, cada item é uma página.
 */
export function parseLivroClassico (entrada, arquivo = '') {
  const paginas = Array.isArray(entrada) ? entrada : dividirPaginas(String(entrada))
  const out = []
  const avisos = []
  const mesesSemResumo = new Map()
  const somaDetalhe = new Map()   // chave -> soma das linhas de detalhe (fora as canceladas)
  const cancelados = new Map()    // chave -> { qtd, valor }
  let achouCabecalho = false

  for (let p = 0; p < paginas.length; p++) {
    const texto = paginas[p] || ''
    const livro = /REGISTRO\s+DE\s+SA[IÍ]DAS/i.test(texto) ? 'saidas'
      : /REGISTRO\s+DE\s+ENTRADAS/i.test(texto) ? 'entradas' : null
    if (!livro) continue
    achouCabecalho = true

    const cnpj = normalizarCnpj((texto.match(RX_CNPJ) || [])[1])
    const ie = ((texto.match(RX_IE) || [])[1] || '').replace(/\D/g, '') || null
    const empresa = limparRazaoSocial((texto.match(/FIRMA\s*:?\s*(.+)/i) || [])[1])
    const compBruta = (texto.match(/M[EÊ]S\s+OU\s+PER[IÍ]ODO\s*\/?\s*ANO\s*:?\s*([\d]{1,2}\s*\/\s*[\d]{4})/i) || [])[1]
    const competencia = normalizarCompetencia((compBruta || '').replace(/\s/g, ''))
    const ctx = { cnpj, ie, empresa, competencia, livro }
    const chave = `${cnpj}|${competencia}|${livro}`

    if (!competencia) { avisos.push(`Página ${p + 1}: não foi possível ler a competência.`); continue }
    if (!cnpj) avisos.push(`Página ${p + 1} (${compBruta}): não foi possível ler o CNPJ.`)

    if (/SEM\s+MOVIMENTO/i.test(texto) && !/RESUMO\s+MENSAL/i.test(texto)) {
      out.push(lanc({ ...ctx, cfop: null, valorContabil: 0, semMovimento: true,
        origem: { formato: 'Livro clássico', arquivo, referencia: `pág. ${p + 1} — SEM MOVIMENTO` } }))
      continue
    }

    // soma das linhas de detalhe (conferência interna do livro)
    const det = valoresDetalheLivro(texto)
    if (det.valores.length) somaDetalhe.set(chave, (somaDetalhe.get(chave) || 0) + det.valores.reduce((a, b) => a + b, 0))
    if (det.canceladosQtd) {
      const c = cancelados.get(chave) || { qtd: 0, valor: 0, ctx }
      c.qtd += det.canceladosQtd; c.valor += det.canceladosValor
      cancelados.set(chave, c)
    }

    const idx = texto.search(/RESUMO\s+MENSAL/i)
    if (idx === -1) {
      if (!mesesSemResumo.has(chave)) mesesSemResumo.set(chave, ctx)
      continue
    }
    mesesSemResumo.delete(chave)

    const bloco = texto.slice(idx)
    let achouLinha = false
    for (const linha of bloco.split(/\n/)) {
      if (/SUB\s*TOTAL|^\s*TOTAL\b/i.test(linha)) continue
      // "5.102 66.468,00 66.468,00 0,00 0,00 0,00"
      const m = linha.match(/^\s*([1-7])\.?(\d{3})\s+((?:-?[\d.]+,\d{2}\s+){2,5}-?[\d.]+,\d{2})\s*$/)
      if (!m) continue
      const vals = m[3].trim().split(/\s+/).map(numeroBR)
      achouLinha = true
      out.push(lanc({
        ...ctx,
        cfop: m[1] + m[2],
        valorContabil: vals[0] ?? 0,
        baseCalculo: vals[1] ?? 0,
        icms: vals[2] ?? 0,
        isentas: vals[3] ?? 0,
        outras: vals[4] ?? 0,
        origem: { formato: 'Livro clássico', arquivo, referencia: `pág. ${p + 1} — resumo mensal` },
      }))
    }
    if (!achouLinha) avisos.push(`Página ${p + 1} (${compBruta}): "RESUMO MENSAL" encontrado, mas nenhuma linha de CFOP foi lida.`)
  }

  for (const [chave, ctx] of mesesSemResumo) {
    avisos.push(`${competenciaLabel(ctx.competencia)} (${ctx.livro}): nenhum "RESUMO MENSAL" no arquivo. ` +
      (somaDetalhe.has(chave)
        ? `Somando as linhas de detalhe daria ${moedaBR(somaDetalhe.get(chave))} — confira manualmente.`
        : 'Nada foi apurado para esse mês.'))
  }
  if (!achouCabecalho) avisos.push('Nenhum cabeçalho "REGISTRO DE ENTRADAS/SAÍDAS" foi encontrado.')

  // conferência: resumo x detalhe
  const porChave = new Map()
  for (const l of out) {
    const k = `${l.cnpj}|${l.competencia}|${l.livro}`
    porChave.set(k, (porChave.get(k) || 0) + l.valorContabil)
  }
  for (const [k, somaDet] of somaDetalhe) {
    const somaRes = porChave.get(k)
    if (somaRes == null) continue
    if (Math.abs(somaRes - somaDet) > 0.05) {
      const [, comp, livro] = k.split('|')
      avisos.push(`Conferência interna ${competenciaLabel(comp)} (${livro}): resumo mensal ${moedaBR(somaRes)} ` +
        `x soma das linhas de detalhe ${moedaBR(somaDet)} — diferença de ${moedaBR(somaRes - somaDet)}.`)
    }
  }
  for (const [, c] of cancelados) {
    avisos.push(`${competenciaLabel(c.ctx.competencia)} (${c.ctx.livro}): ${c.qtd} documento(s) cancelado(s) somando ` +
      `${moedaBR(c.valor)} ficaram fora da apuração (constam só no detalhe do livro).`)
  }
  return { lancamentos: out, avisos, formato: 'Livro fiscal impresso (modelo P1/P2)' }
}

/**
 * Linhas de detalhe do livro impresso: "... 358,00 5.102Icms 358,00 0,00 0,00 0,00".
 * Documentos marcados como cancelados são separados — eles constam do detalhe
 * mas, corretamente, ficam de fora do resumo mensal.
 */
function valoresDetalheLivro (texto) {
  const valores = []
  let canceladosQtd = 0; let canceladosValor = 0
  const rx = /(-?[\d.]+,\d{2})\s*([1-7]\.\d{3})\s*Icms/i
  for (const linha of String(texto).split(/\n/)) {
    const m = linha.match(rx)
    if (!m) continue
    const v = numeroBR(m[1])
    if (!Number.isFinite(v)) continue
    if (/cancelad/i.test(linha)) { canceladosQtd++; canceladosValor += v } else valores.push(v)
  }
  return { valores, canceladosQtd, canceladosValor }
}

/**
 * No livro impresso a legenda dos códigos fiscais fica na mesma linha da razão
 * social, à direita. Sem isto o nome da empresa sai grudado em "1 - Operacoes
 * com Credito do Imposto".
 */
export function limparRazaoSocial (bruto) {
  if (!bruto) return null
  let s = String(bruto).split(/\s{3,}/)[0]
  s = s.replace(/\s+\d\s*[-–]\s*Opera[cç][õo]es\b.*$/i, '')
       .replace(/\s+(?:C\.?N\.?P\.?J|INSCR|CNPJ|UF|MUNIC[IÍ]PIO|IE|PER[IÍ]ODO)\b.*$/i, '')
       .replace(/\s+\d\s*[-–]\s*[A-ZÀ-Ú].{0,60}$/, '')
  return s.trim() || null
}

function dividirPaginas (texto) {
  const partes = texto.split(/(?=REGISTRO\s+DE\s+(?:ENTRADAS|SA[IÍ]DAS))/i)
  return partes.length > 1 ? partes : [texto]
}

/* ------------------------------ 3. Resumo por CST/CFOP (relatório tipo SPED) */

/**
 * "REGISTROS FISCAIS DOS DOCUMENTOS DE ENTRADAS/SAÍDAS ..." — relatório de
 * conferência do SPED, com bloco "RESUMO - TOTAIS" por CST/CFOP.
 * Também é o formato mais comum quando o livro chega como foto (via OCR).
 */
export function parseResumoCstCfop (entrada, arquivo = '', confianca = 'alta') {
  const paginas = Array.isArray(entrada) ? entrada : [String(entrada)]
  const out = []
  const avisos = []

  for (let p = 0; p < paginas.length; p++) {
    const texto = paginas[p] || ''
    const livro = /DOCUMENTOS\s+DE\s+SA[IÍ]DAS|REGISTRO\s+DE\s+SA[IÍ]DAS/i.test(texto) ? 'saidas'
      : /DOCUMENTOS\s+DE\s+ENTRADAS|REGISTRO\s+DE\s+ENTRADAS/i.test(texto) ? 'entradas' : null
    if (!livro) { avisos.push(`Página ${p + 1}: não identifiquei se é livro de entradas ou de saídas.`); continue }

    const cnpj = normalizarCnpj((texto.match(RX_CPF_CNPJ2) || [])[1]) ||
                 normalizarCnpj((texto.match(RX_CNPJ) || [])[1])
    const ie = ((texto.match(RX_IE) || [])[1] || '').replace(/\D/g, '') || null
    const empresa = limparRazaoSocial((texto.match(/CONTRIBUINTE\s*:?\s*(.+)/i) || [])[1])
    const periodo = texto.match(/PER[IÍ]ODO\s+DE\s+APURA[ÇC][ÃA]O\s*:?\s*(\d{2}\/\d{2}\/\d{4})/i)
    const competencia = normalizarCompetencia(periodo ? periodo[1] : null)
    if (!competencia) { avisos.push(`Página ${p + 1}: não foi possível ler o período de apuração.`); continue }
    if (!cnpj) avisos.push(`Página ${p + 1}: não foi possível ler o CNPJ.`)

    const linhas = texto.split(/\n/)
    const candidatas = linhas.filter(l => !/^\s*(?:SUB\s*)?TOTAL\b/i.test(l) && contarColunas(l) !== null)
    // Quantas colunas numéricas a página usa. Uma linha sem alíquota traz uma a
    // menos; é a maioria que define o padrão, não a primeira linha encontrada.
    const esperado = moda(candidatas.map(contarColunas))

    let achou = false
    for (const linha of linhas) {
      if (/^\s*(?:SUB\s*)?TOTAL\b/i.test(linha)) continue
      const reg = lerLinhaCstCfop(linha, esperado)
      if (!reg) continue
      achou = true
      out.push(lanc({
        cnpj, ie, empresa, competencia, livro,
        confianca: reg.consistente ? confianca : (confianca === 'alta' ? 'media' : 'baixa'),
        cst: reg.cst,
        cfop: reg.cfop,
        aliquota: reg.aliquota,
        valorContabil: reg.valores[0] ?? 0,
        baseCalculo: reg.valores[1] ?? 0,
        icms: reg.valores[2] ?? 0,
        origem: { formato: 'Resumo CST/CFOP', arquivo, referencia: `pág. ${p + 1}` },
      }))
      if (!reg.consistente) {
        avisos.push(`Página ${p + 1}, CFOP ${reg.cfop}: não consegui confirmar a ordem das colunas pela conta ` +
          `"base × alíquota = ICMS". Valores lidos como Total/Base/ICMS = ${reg.valores.slice(0, 3).join(' / ')} — confira.`)
      }
    }
    if (!achou) { avisos.push(`Página ${p + 1}: nenhuma linha CST/CFOP foi reconhecida.`); continue }

    // Conferência contra o TOTAL impresso na própria página.
    const impresso = totalImpresso(linhas)
    if (impresso != null) {
      const lido = out.filter(l => l.competencia === competencia && l.livro === livro &&
                                   l.origem.referencia === `pág. ${p + 1}`)
                      .reduce((a, l) => a + l.valorContabil, 0)
      if (Math.abs(lido - impresso) > 0.05) {
        avisos.push(`Página ${p + 1}: a soma das linhas deu ${moedaBR(lido)}, mas o TOTAL impresso é ` +
          `${moedaBR(impresso)} — diferença de ${moedaBR(lido - impresso)}. Confira antes de usar este mês.`)
      }
    } else {
      avisos.push(`Página ${p + 1}: não achei a linha TOTAL para conferir a leitura.`)
    }
  }
  return { lancamentos: out, avisos, formato: 'Resumo fiscal por CST/CFOP' }
}

/** Primeiro valor da linha "TOTAL ..." — o total da coluna Total Operação. */
function totalImpresso (linhas) {
  for (const l of linhas) {
    if (!/^\s*TOTAL\b/i.test(l)) continue
    const m = String(l).trim().split(/[\s|]+/).filter(t => RX_MOEDA.test(t))
    if (m.length) return numeroBR(m[0])
  }
  return null
}

/** Quantos valores monetários a linha traz depois do CST, ou null se não for linha de CFOP. */
function contarColunas (linha) {
  const tokens = String(linha).trim().split(/[\s|]+/).filter(Boolean)
  if (tokens.length < 5) return null
  const i = tokens.findIndex(t => RX_CFOP_TOKEN.test(t))
  if (i === -1) return null
  const n = tokens.filter(t => RX_MOEDA.test(t)).length
  return n >= 3 ? n : null
}

function moda (lista) {
  const c = new Map()
  for (const v of lista) c.set(v, (c.get(v) || 0) + 1)
  let melhor = null; let max = 0
  for (const [v, n] of c) if (n > max || (n === max && v > melhor)) { melhor = v; max = n }
  return melhor
}

/* ------------------------------ 3b. Extrato do Simples Nacional (PGDAS-D) */

/**
 * Extrato do Simples Nacional (PGDAS-D).
 *
 * Não é livro fiscal: não tem CFOP e não se separa em entradas e saídas. É a
 * RECEITA DECLARADA à Receita Federal, então entra do lado das vendas
 * informadas — é a versão oficial do "quanto a empresa disse que vendeu".
 *
 * Duas escalas convivem no documento, e misturá-las dá erro:
 *  - a seção 3 traz a receita POR ESTABELECIMENTO, com CNPJ completo;
 *  - a seção 2.2 traz o histórico mensal CONSOLIDADO da empresa inteira.
 * O histórico só é atribuído a um CNPJ quando o extrato tem um único
 * estabelecimento; havendo mais de um, ele não tem como ser repartido.
 *
 * A leitura se confere sozinha contra três números impressos: o RBA
 * (acumulado do ano), o RBT12 (doze meses anteriores) e a soma das receitas
 * por atividade de cada estabelecimento.
 */
export function parsePgdasD (entrada, arquivo = '') {
  const texto = Array.isArray(entrada) ? entrada.join('\n') : String(entrada)
  const linhas = texto.split(/\r?\n/)
  const avisos = []

  const pa = normalizarCompetencia((texto.match(/Per[ií]odo\s+de\s+Apura[çc][ãa]o\s*\(PA\)\s*:?\s*(\d{1,2}\/\d{4})/i) || [])[1])
  if (!pa) return { registros: [], avisos: ['Não encontrei o "Período de Apuração (PA)" — este arquivo não parece um extrato do PGDAS-D.'], formato: 'PGDAS-D' }

  const empresa = ((texto.match(/Nome\s+Empresarial\s*:?\s*(.+)/i) || [])[1] || '').trim() || null
  const rpa = numerosAposRotulo(linhas, /Receita\s+Bruta\s+do\s+PA\s*\(RPA\)/i)
  const rbt12 = numerosAposRotulo(linhas, /doze\s+meses\s+anteriores\s+ao\s+PA\s*$|\(RBT12\)/i)
  const rba = numerosAposRotulo(linhas, /ano-calend[áa]rio\s+corrente\s*\(RBA\)/i)

  /* --- seção 3: receita por estabelecimento --- */
  const blocos = texto.split(/CNPJ\s+Estabelecimento\s*:/i).slice(1)
  const estabelecimentos = []
  for (const bloco of blocos) {
    const cnpj = normalizarCnpj((bloco.match(/^\s*([\d./-]{14,20})/) || [])[1])
    if (!cnpj) continue
    const atividades = []
    for (const parte of bloco.split(/Valor\s+do\s+D[ée]bito\s+por\s+Tributo\s+para\s+a\s+Atividade/i).slice(1)) {
      const m = parte.match(/Receita\s+Bruta\s+Informada\s*:?\s*R?\$?\s*(-?[\d.]+,\d{2})/i)
      if (!m) continue
      atividades.push({ valor: numeroBR(m[1]), tipo: tipoDeAtividade(parte.slice(0, m.index)) })
    }
    const declarado = numeroBR((bloco.match(/Valor\s+Informado\s*:?\s*R?\$?\s*(-?[\d.]+,\d{2})/i) || [])[1])
    const somaAtiv = round2c(atividades.reduce((a, x) => a + x.valor, 0))
    const total = Number.isFinite(declarado) ? declarado : somaAtiv
    if (Number.isFinite(declarado) && atividades.length && Math.abs(somaAtiv - declarado) > 0.05) {
      avisos.push(`${formatarCnpj(cnpj)}: a soma das receitas por atividade (${moedaBR(somaAtiv)}) não bate com o ` +
        `"Valor Informado" (${moedaBR(declarado)}) — diferença de ${moedaBR(somaAtiv - declarado)}.`)
    }
    estabelecimentos.push({
      cnpj, total,
      mercadoria: round2c(atividades.filter(a => a.tipo === 'mercadoria').reduce((a, x) => a + x.valor, 0)),
      servico: round2c(atividades.filter(a => a.tipo === 'servico').reduce((a, x) => a + x.valor, 0)),
      outros: round2c(atividades.filter(a => a.tipo === 'outro').reduce((a, x) => a + x.valor, 0)),
    })
  }
  if (!estabelecimentos.length) {
    return { registros: [], avisos: ['Não encontrei nenhum "CNPJ Estabelecimento" na seção 3 do extrato.'], formato: 'PGDAS-D' }
  }

  const registros = []
  for (const e of estabelecimentos) {
    registros.push({
      cnpj: e.cnpj, competencia: pa, valor: e.total, empresa,
      arquivo, linha: null, fonte: 'PGDAS-D', escopo: 'estabelecimento',
      detalhe: { mercadoria: e.mercadoria, servico: e.servico, outros: e.outros },
    })
  }

  const somaEstab = round2c(estabelecimentos.reduce((a, e) => a + e.total, 0))
  if (rpa != null && Math.abs(somaEstab - rpa) > 0.05) {
    avisos.push(`A soma dos estabelecimentos (${moedaBR(somaEstab)}) não bate com a Receita Bruta do PA ` +
      `(${moedaBR(rpa)}) — diferença de ${moedaBR(somaEstab - rpa)}.`)
  }

  /* --- seção 2.2: histórico mensal, consolidado da empresa --- */
  const historico = somarSeries(
    mesesDoBloco(texto, /2\.2\.1\)/, /2\.2\.2\)/),
    mesesDoBloco(texto, /2\.2\.2\)/, /2\.3\)|Folha\s+de\s+Sal/i))

  if (historico.size) {
    if (estabelecimentos.length === 1) {
      const cnpj = estabelecimentos[0].cnpj
      for (const [comp, valor] of [...historico].sort()) {
        if (comp === pa) continue   // o mês do PA já veio da seção 3, com o detalhe por atividade
        registros.push({
          cnpj, competencia: comp, valor, empresa, arquivo, linha: null,
          fonte: 'PGDAS-D (histórico)', escopo: 'empresa',
        })
      }
    } else {
      avisos.push(`O histórico mensal do extrato é consolidado da empresa e este PA tem ` +
        `${estabelecimentos.length} estabelecimentos — não dá para reparti-lo por CNPJ. ` +
        `Só ${competenciaLabel(pa)} foi aproveitado; para os outros meses, carregue o extrato de cada PA.`)
    }
    conferirAcumulados(historico, pa, rpa, rba, rbt12, avisos)
  }

  return { registros, avisos, formato: 'Extrato do Simples Nacional (PGDAS-D)', competencia: pa }
}

function tipoDeAtividade (texto) {
  if (/Revenda\s+de\s+mercadorias|Venda\s+de\s+mercadorias|Ind[úu]stria/i.test(texto)) return 'mercadoria'
  if (/Presta[çc][ãa]o\s+de\s+Servi[çc]os|Loca[çc][ãa]o/i.test(texto)) return 'servico'
  return 'outro'
}

/** Valores da linha do rótulo; quando o rótulo quebra a linha, olha as seguintes. */
function numerosAposRotulo (linhas, rx, janela = 2) {
  for (let i = 0; i < linhas.length; i++) {
    if (!rx.test(linhas[i])) continue
    for (let j = i; j <= i + janela && j < linhas.length; j++) {
      const m = String(linhas[j]).match(/-?[\d.]+,\d{2}/g)
      if (m && m.length) return numeroBR(m[0])
    }
  }
  return null
}

/** Pares "MM/AAAA valor" de um trecho delimitado do documento. */
function mesesDoBloco (texto, de, ate) {
  const i = texto.search(de)
  if (i === -1) return new Map()
  const resto = texto.slice(i)
  const j = resto.slice(1).search(ate)
  const bloco = j === -1 ? resto : resto.slice(0, j + 1)
  const mapa = new Map()
  const rx = /(\d{2})\/(\d{4})\s+(-?[\d.]+,\d{2})/g
  let m
  while ((m = rx.exec(bloco))) {
    const comp = normalizarCompetencia(`${m[1]}/${m[2]}`)
    if (comp) mapa.set(comp, numeroBR(m[3]))
  }
  return mapa
}

function somarSeries (a, b) {
  const out = new Map(a)
  for (const [k, v] of b) out.set(k, round2c((out.get(k) || 0) + v))
  return out
}

/** Confere a série lida contra o RBA e o RBT12 impressos no próprio extrato. */
function conferirAcumulados (historico, pa, rpa, rba, rbt12, avisos) {
  const [ano, mes] = pa.split('-').map(Number)
  if (rba != null && rpa != null) {
    let soma = rpa
    for (const [c, v] of historico) if (c.startsWith(ano + '-') && c !== pa) soma += v
    if (Math.abs(round2c(soma) - rba) > 0.05) {
      avisos.push(`A série mensal lida soma ${moedaBR(soma)} no ano, mas o RBA impresso é ${moedaBR(rba)} — ` +
        `diferença de ${moedaBR(soma - rba)}. Confira antes de usar estes meses.`)
    }
  }
  if (rbt12 != null) {
    let soma = 0
    for (let k = 1; k <= 12; k++) {
      const d = new Date(Date.UTC(ano, mes - 1 - k, 1))
      const c = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
      soma += historico.get(c) || 0
    }
    if (Math.abs(round2c(soma) - rbt12) > 0.05) {
      avisos.push(`Os doze meses anteriores lidos somam ${moedaBR(soma)}, mas o RBT12 impresso é ` +
        `${moedaBR(rbt12)} — diferença de ${moedaBR(soma - rbt12)}.`)
    }
  }
}

const round2c = (n) => Math.round((Number(n) || 0) * 100) / 100

/** Reconhece um extrato do PGDAS-D pelo conteúdo. */
export function ehPgdasD (texto) {
  const t = String(texto)
  return /Extrato\s+do\s+Simples\s+Nacional/i.test(t) ||
    (/PGDAS-D/i.test(t) && /Per[ií]odo\s+de\s+Apura[çc][ãa]o/i.test(t))
}

/* ------------------------------------------------- 4. Tabular (CSV / XLSX) */

const SINONIMOS = {
  cnpj: ['cnpj', 'cnpjcpf', 'cnpj/cpf', 'cnpjempresa', 'documento', 'cnpjestabelecimento', 'estabelecimento'],
  empresa: ['empresa', 'razaosocial', 'razao', 'contribuinte', 'firma', 'nome', 'loja', 'filial'],
  competencia: ['competencia', 'mes', 'mesano', 'periodo', 'mesreferencia', 'referencia', 'data', 'dataemissao', 'datasaida', 'dtdoc', 'anomes'],
  cfop: ['cfop', 'codigofiscal', 'codfisc', 'codfiscal', 'cfo', 'naturezaoperacao'],
  cst: ['cst', 'csticms', 'cstc', 'situacaotributaria'],
  livro: ['livro', 'tipo', 'tipooperacao', 'entradasaida', 'operacao', 'indoper', 'esentrada'],
  valorContabil: ['valorcontabil', 'vlrcontabil', 'valortotal', 'totaloperacao', 'valoroperacao', 'vloperacao', 'vlropr', 'valor', 'vldoc', 'valordocumento', 'total'],
  baseCalculo: ['basecalculo', 'basedecalculo', 'basecalc', 'bc', 'vlbcicms', 'basecalculoicms'],
  icms: ['icms', 'valoricms', 'vlicms', 'impostodebitado', 'imposto', 'impostocreditado'],
  isentas: ['isentas', 'isentasnaotributadas', 'isentonaotributado', 'isentonaotrib'],
  outras: ['outras', 'outrasoperacoes'],
  valorInformado: ['vendas', 'vendainformada', 'vendasinformadas', 'valorvenda', 'faturamento', 'receita', 'valorinformado', 'totalvendas', 'vendabruta', 'vendaliquida'],
}

const chaveNorm = (s) => String(s ?? '').toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]/g, '')

/** Descobre, a partir do cabeçalho, qual coluna é o quê. */
export function mapearColunas (cabecalho, sinonimos = SINONIMOS) {
  const mapa = {}
  const usadas = new Set()
  const normalizado = cabecalho.map(chaveNorm)
  for (const [campo, nomes] of Object.entries(sinonimos)) {
    for (const nome of nomes) {
      const i = normalizado.findIndex((h, idx) => !usadas.has(idx) && (h === nome || (h.length > 3 && h.startsWith(nome))))
      if (i !== -1) { mapa[campo] = i; usadas.add(i); break }
    }
  }
  return mapa
}

/**
 * Muita planilha traz o CNPJ num bloco solto acima do cabeçalho —
 * "CNPJ | 11.222.333/0001-81" numa linha de rótulo e valor — em vez de numa
 * coluna. Sem isto o arquivo inteiro entra sem CNPJ e não encontra as outras
 * fontes na hora de cruzar.
 */
export function cnpjNoCabecalho (linhas, ateLinha = 12) {
  for (let i = 0; i < Math.min(linhas.length, ateLinha); i++) {
    for (const celula of linhas[i] || []) {
      const t = String(celula ?? '')
      const m = t.match(/\b\d{2}[.\s]?\d{3}[.\s]?\d{3}[/\s]?\d{4}[-\s]?\d{2}\b/)
      if (m) { const c = normalizarCnpj(m[0]); if (c && c.length === 14) return c }
    }
  }
  return null
}

/** Acha a linha de cabeçalho num bloco de linhas (pula títulos soltos). */
export function acharCabecalho (linhas, sinonimos = SINONIMOS) {
  let melhor = { i: -1, n: 0, mapa: {} }
  for (let i = 0; i < Math.min(linhas.length, 30); i++) {
    const mapa = mapearColunas(linhas[i].map(c => String(c ?? '')), sinonimos)
    const n = Object.keys(mapa).length
    if (n > melhor.n) melhor = { i, n, mapa }
  }
  return melhor
}

/**
 * Linhas tabulares de LIVRO FISCAL (uma linha por CFOP/documento).
 * @param {any[][]} linhas matriz já lida do CSV/XLSX
 * @param {{livroPadrao?:string, mapa?:object, arquivo?:string}} opts
 */
export function parseTabularLivro (linhas, opts = {}) {
  const avisos = []
  const { i: iCab, mapa: mapaAuto } = acharCabecalho(linhas)
  const mapa = opts.mapa || mapaAuto
  if (iCab === -1 || mapa.cfop == null) {
    return { lancamentos: [], avisos: ['Não encontrei uma coluna de CFOP nesta planilha. Use o mapeamento manual de colunas.'], mapa, formato: 'Tabular' }
  }
  const out = []
  for (let r = iCab + 1; r < linhas.length; r++) {
    const linha = linhas[r]
    if (!linha || linha.every(c => c === '' || c == null)) continue
    const cfop = linha[mapa.cfop]
    if (cfop == null || String(cfop).trim() === '') continue
    const cfopDig = String(cfop).replace(/\D/g, '')
    if (cfopDig.length < 4) continue

    let livro = opts.livroPadrao || null
    if (mapa.livro != null) {
      const v = chaveNorm(linha[mapa.livro])
      if (/^(s|saida|saidas|1|venda|vendas)$/.test(v)) livro = 'saidas'
      else if (/^(e|entrada|entradas|0|compra|compras)$/.test(v)) livro = 'entradas'
    }
    if (!livro) livro = /^[567]/.test(cfopDig) ? 'saidas' : 'entradas'

    const comp = normalizarCompetencia(mapa.competencia != null ? linha[mapa.competencia] : opts.competenciaPadrao)
    out.push(lanc({
      cnpj: normalizarCnpj(mapa.cnpj != null ? linha[mapa.cnpj] : opts.cnpjPadrao),
      empresa: mapa.empresa != null ? String(linha[mapa.empresa] ?? '').trim() || null : null,
      competencia: comp,
      livro,
      cfop: cfopDig,
      cst: mapa.cst != null ? String(linha[mapa.cst] ?? '').trim() || null : null,
      valorContabil: valOu0(linha, mapa.valorContabil),
      baseCalculo: valOu0(linha, mapa.baseCalculo),
      icms: valOu0(linha, mapa.icms),
      isentas: valOu0(linha, mapa.isentas),
      outras: valOu0(linha, mapa.outras),
      origem: { formato: 'Tabular', arquivo: opts.arquivo || '', referencia: `linha ${r + 1}` },
    }))
  }
  const semComp = out.filter(l => !l.competencia).length
  if (semComp) avisos.push(`${semComp} linha(s) sem competência legível — informe a competência padrão ou corrija a coluna de data.`)
  const semCnpj = out.filter(l => !l.cnpj).length
  if (semCnpj) avisos.push(`${semCnpj} linha(s) sem CNPJ legível — informe o CNPJ padrão do arquivo.`)
  return { lancamentos: out, avisos, mapa, formato: 'Tabular (livro fiscal)' }
}

function valOu0 (linha, i) {
  if (i == null) return 0
  const n = numeroBR(linha[i])
  return Number.isFinite(n) ? n : 0
}

/**
 * Planilha de VENDAS INFORMADAS: CNPJ, competência, valor.
 * @returns {{registros: Array<{cnpj,empresa,competencia,valor,linha}>, avisos, mapa}}
 */
export function parseVendasInformadas (linhas, opts = {}) {
  const avisos = []
  const { i: iCab, mapa: mapaAuto } = acharCabecalho(linhas)
  const mapa = opts.mapa || mapaAuto
  const colValor = mapa.valorInformado ?? mapa.valorContabil
  if (iCab === -1 || colValor == null) {
    return { registros: [], avisos: ['Não encontrei uma coluna de valor de vendas. Use o mapeamento manual de colunas.'], mapa }
  }
  const registros = []
  for (let r = iCab + 1; r < linhas.length; r++) {
    const linha = linhas[r]
    if (!linha || linha.every(c => c === '' || c == null)) continue
    const valor = numeroBR(linha[colValor])
    if (!Number.isFinite(valor)) continue
    const cnpj = normalizarCnpj(mapa.cnpj != null ? linha[mapa.cnpj] : opts.cnpjPadrao)
    const competencia = normalizarCompetencia(mapa.competencia != null ? linha[mapa.competencia] : opts.competenciaPadrao)
    if (!cnpj || !competencia) {
      avisos.push(`Linha ${r + 1}: ${!cnpj ? 'CNPJ' : 'competência'} ilegível — linha ignorada.`)
      continue
    }
    registros.push({
      cnpj, competencia, valor,
      empresa: mapa.empresa != null ? String(linha[mapa.empresa] ?? '').trim() || null : null,
      linha: r + 1, arquivo: opts.arquivo || '',
    })
  }
  return { registros, avisos, mapa }
}

/* ------------------------------------------------------------- 5. dispatcher */

/** Descobre o formato pelo conteúdo e chama o parser certo. */
export function parseTexto (texto, arquivo = '', opts = {}) {
  const t = String(texto)
  if (/^\|(0000|9999|0001)\|/m.test(t) || /\|C190\|/.test(t) || /\|C490\|/.test(t)) {
    return parseSpedEfd(t, arquivo)
  }
  if (/RESUMO\s+MENSAL\s+DE\s+OPERA/i.test(t) || /M[EÊ]S\s+OU\s+PER[IÍ]ODO/i.test(t)) {
    return parseLivroClassico(opts.paginas || t, arquivo)
  }
  if (/PER[IÍ]ODO\s+DE\s+APURA[ÇC][ÃA]O/i.test(t) || /RESUMO\s*[-–]\s*TOTAIS/i.test(t)) {
    return parseResumoCstCfop(opts.paginas || t, arquivo, opts.confianca || 'alta')
  }
  return {
    lancamentos: [],
    avisos: ['Formato não reconhecido automaticamente. Converta para CSV/XLSX ou use o SPED EFD (.txt).'],
    formato: 'desconhecido',
  }
}

const RX_MOEDA = /^-?\d{1,3}(?:\.\d{3})*,\d{2}$|^-?\d+,\d{2}$/
const RX_CFOP_TOKEN = /^([1-7])\.?(\d{3})$/

/**
 * Lê uma linha do bloco "RESUMO - TOTAIS" por CST/CFOP.
 * A ordem das colunas varia entre sistemas: umas trazem CST | CFOP | Alíquota | valores,
 * outras CST | Alíquota | CFOP | valores. A ordem é decidida pela conta
 * "base de cálculo x alíquota = ICMS"; quando ela não fecha, a linha é marcada
 * como não confirmada em vez de ser adivinhada em silêncio.
 */
export function lerLinhaCstCfop (linha, esperado = null) {
  const tokens = String(linha).trim().split(/[\s|]+/).filter(Boolean)
  if (tokens.length < 5) return null
  const iCfop = tokens.findIndex(t => RX_CFOP_TOKEN.test(t))
  if (iCfop === -1) return null
  const mc = tokens[iCfop].match(RX_CFOP_TOKEN)
  const cfop = mc[1] + mc[2]

  const antes = tokens.slice(0, iCfop)
  const depois = tokens.slice(iCfop + 1)
  while (depois.length && !RX_MOEDA.test(depois[depois.length - 1])) depois.pop()
  if (depois.length < 3 || !depois.every(t => RX_MOEDA.test(t))) return null

  const moedaAntes = antes.filter(t => RX_MOEDA.test(t))
  const inteirosAntes = antes.filter(t => /^\d{1,3}$/.test(t))
  const cst = inteirosAntes.length ? inteirosAntes[inteirosAntes.length - 1].padStart(3, '0') : null
  const total = moedaAntes.length + depois.length

  const opcoes = []
  if (moedaAntes.length) {
    // layout com a alíquota antes do CFOP
    opcoes.push({ aliquota: numeroBR(moedaAntes[moedaAntes.length - 1]), valores: depois.map(numeroBR) })
  } else if (esperado != null && total === esperado - 1) {
    /*
     * Uma coluna a menos que o resto da página: a alíquota veio em branco
     * (acontece em CST 090). Tomar o primeiro número como alíquota zeraria o
     * valor da operação — e a conta "0 x alíquota = 0" confirmaria o erro.
     */
    opcoes.push({ aliquota: null, valores: depois.map(numeroBR) })
  } else {
    if (depois.length >= 4) opcoes.push({ aliquota: numeroBR(depois[0]), valores: depois.slice(1).map(numeroBR) })
    opcoes.push({ aliquota: null, valores: depois.map(numeroBR) })
  }

  for (const o of opcoes) {
    if (o.valores.length < 3) continue
    const [, base, icms] = o.valores
    const esperadoIcms = (base || 0) * (o.aliquota || 0) / 100
    const ok = Math.abs(esperadoIcms - (icms || 0)) <= Math.max(0.02, Math.abs(icms || 0) * 0.01) ||
               ((o.aliquota === 0 || o.aliquota == null) && (icms || 0) === 0)
    if (ok) return { cst, cfop, aliquota: o.aliquota, valores: o.valores, consistente: true }
  }
  const o = opcoes[0]
  if (!o || o.valores.length < 3) return null
  return { cst, cfop, aliquota: o.aliquota, valores: o.valores, consistente: false }
}
