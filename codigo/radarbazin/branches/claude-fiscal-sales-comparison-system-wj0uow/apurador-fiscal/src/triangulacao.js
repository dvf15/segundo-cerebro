/**
 * Triangulação de auditoria de vendas.
 *
 * Três fontes que deveriam contar a mesma história e quase nunca contam:
 *
 *   Redução Z   o que o equipamento fiscal registrou (ECF). É o número que o
 *               fisco enxerga, e o único que a loja não consegue reescrever
 *               depois — o Grande Total é acumulador e não zera.
 *   PDV         o que o sistema comercial registrou. É o que a loja de fato
 *               vendeu, cupom emitido ou não.
 *   Declarado   o que foi informado (ao shopping, na planilha, ou ao fisco no
 *               extrato do Simples).
 *
 * A direção da diferença é que diz o que aconteceu:
 *   PDV > Z         venda sem documento fiscal
 *   Z > PDV         cupom sem venda correspondente, ou exportação do PDV incompleta
 *   Declarado < Z   informou a menor o que o próprio equipamento fiscal registrou
 *
 * Nada aqui é opinião sobre a loja: são subtrações entre números que ela mesma
 * produziu, e cada uma aparece com as duas parcelas à vista.
 */
import { numeroBR, normalizarCnpj, normalizarCompetencia, competenciaLabel, formatarCnpj,
  moedaBR, percentBR, acharCabecalho, mapearColunas, cnpjNoCabecalho } from './parsers.js'

export const FONTES = {
  z: 'Redução Z (equipamento fiscal)',
  pdv: 'Relatório de PDV',
  napp: 'NAPP',
  declarado: 'Declarado / informado',
}
/** Nome curto de cada tipo de lançamento, como aparece nas tabelas. */
export const NOME_FONTE_TRI = { z: 'Redução Z', pdv: 'PDV', napp: 'NAPP', declarado: 'Declarado' }

/**
 * Limites da triangulação em reais — a leitura é pela maior variação em R$
 * entre os tipos de lançamento, não pelo percentual. No mês: até `coerente`
 * fecha, até `atencao` pede atenção, acima disso é DISPERSO. No dia: até `dia`
 * fecha, acima é DISPERSO. Os valores padrão são ponto de partida e ficam
 * editáveis na aba.
 */
export function limitesTri (opts = {}) {
  return {
    coerente: Number(opts.triCoerenteReais ?? 100),
    atencao: Number(opts.triAtencaoReais ?? 1000),
    dia: Number(opts.triDiaReais ?? 100),
  }
}

/**
 * O resumo de um conjunto de lançamentos (Z, PDV, NAPP, declarado) de um mesmo
 * lojista e período: o maior valor e de qual tipo ele vem, a variação em R$
 * entre o maior e o menor, quanto o maior passa do declarado e o status. É a
 * mesma conta no mês, no dia, no fechamento e na base fictícia.
 */
export function resumirFontes (fontes, opts = {}) {
  const { coerente, atencao } = limitesTri(opts)
  const presentes = Object.entries(fontes).filter(([, v]) => v != null && Number.isFinite(Number(v)))
  const valores = presentes.map(([, v]) => Number(v))
  const maior = valores.length ? Math.max(...valores) : null
  const menor = valores.length ? Math.min(...valores) : null
  const fonteMaior = presentes.filter(([, v]) => Number(v) === maior).map(([k]) => k)
  const declarado = fontes.declarado ?? null
  if (valores.length < 2) {
    return { maior, menor, fonteMaior, amplitude: null, dispersao: null, naoDeclarado: null, status: STATUS_TRI.FONTE_UNICA }
  }
  const amplitude = arred2(maior - menor)
  return {
    maior, menor, fonteMaior, amplitude,
    // o percentual continua calculado para o detalhe, mas não decide nada
    dispersao: maior > 0 ? arred2(amplitude / maior * 100) : 0,
    naoDeclarado: declarado == null ? null : arred2(Math.max(0, maior - declarado)),
    status: amplitude <= coerente ? STATUS_TRI.COERENTE : amplitude <= atencao ? STATUS_TRI.ATENCAO : STATUS_TRI.DISPERSO,
  }
}

const arred2 = (n) => Math.round((Number(n) || 0) * 100) / 100

/* ------------------------------------------------------------------- datas */

/** Converte para 'AAAA-MM-DD'. Aceita ddmmaaaa do SPED, dd/mm/aaaa, ISO e serial do Excel. */
export function normalizarData (bruto) {
  if (bruto == null || bruto === '') return null
  if (bruto instanceof Date && !isNaN(bruto)) return iso(bruto.getUTCFullYear(), bruto.getUTCMonth() + 1, bruto.getUTCDate())
  if (typeof bruto === 'number' && bruto > 20000 && bruto < 80000) {
    return normalizarData(new Date(Math.round(bruto) * 86400000 + Date.UTC(1899, 11, 30)))
  }
  const s = String(bruto).trim()
  let m
  if ((m = s.match(/^(\d{4})-(\d{2})-(\d{2})/))) return iso(m[1], m[2], m[3])
  if ((m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/))) return iso(m[3], m[2], m[1])
  if ((m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2})$/))) return iso('20' + m[3], m[2], m[1])
  if ((m = s.match(/^(\d{8})$/))) {
    /*
     * Oito dígitos são ambíguos: 15032025 é ddmmaaaa (o do SPED) e 20250315 é
     * aaaammdd. Vale a ordem que produzir uma data válida; havendo empate, ganha
     * aaaammdd, porque aí os quatro primeiros dígitos são um ano plausível.
     */
    const d = m[1]
    const comoDDMM = iso(d.slice(4), d.slice(2, 4), d.slice(0, 2))
    const comoAAAA = iso(d.slice(0, 4), d.slice(4, 6), d.slice(6))
    return comoAAAA || comoDDMM
  }
  return null
  function iso (a, mes, d) {
    const A = Number(a); const M = Number(mes); const D = Number(d)
    if (!(A >= 1900 && A <= 2200) || !(M >= 1 && M <= 12) || !(D >= 1 && D <= 31)) return null
    return `${A}-${String(M).padStart(2, '0')}-${String(D).padStart(2, '0')}`
  }
}

export const dataLabel = (d) => d ? d.split('-').reverse().join('/') : '—'
const competenciaDe = (data) => data ? data.slice(0, 7) : null

function mov (base) {
  return { cnpj: null, data: null, competencia: null, valor: 0, fonte: null,
    crz: null, cro: null, gt: null, coo: null, equipamento: null, origem: {}, ...base }
}

/* --------------------------------------------- 1. Redução Z via SPED EFD */

/**
 * Registros C400 (identificação do ECF) e C405 (a redução Z do dia).
 * Layout do C405: DT_DOC | CRO | CRZ | NUM_COO_FIN | GT_FIN | VL_BRT
 * (Guia Prático da EFD ICMS/IPI, bloco C.)
 */
export function parseReducaoZSped (texto, arquivo = '') {
  const linhas = String(texto).split(/\r?\n/)
  const out = []
  const avisos = []
  let cnpj = null; let equipamento = null

  for (let i = 0; i < linhas.length; i++) {
    const f = linhas[i].split('|')
    const reg = (f[1] || '').trim().toUpperCase()
    if (reg === '0000') { cnpj = normalizarCnpj(f[7]) || normalizarCnpj(f[8]); continue }
    if (reg === 'C400') {
      // COD_MOD | ECF_MOD | ECF_FAB | ECF_CX
      equipamento = [(f[3] || '').trim(), (f[4] || '').trim(), (f[5] || '').trim()].filter(Boolean).join(' ') || null
      continue
    }
    if (reg !== 'C405') continue
    const data = normalizarData(f[2])
    if (!data) { avisos.push(`C405 na linha ${i + 1} sem data legível — ignorado.`); continue }
    out.push(mov({
      cnpj, data, competencia: competenciaDe(data), fonte: 'z', equipamento,
      cro: inteiro(f[3]), crz: inteiro(f[4]), coo: inteiro(f[5]),
      gt: numeroFinito(f[6]), valor: numeroFinito(f[7]) || 0,
      origem: { formato: 'SPED EFD (C405)', arquivo, referencia: `linha ${i + 1}` },
    }))
  }
  if (!out.length) avisos.push('Nenhum registro C405 (redução Z) encontrado neste arquivo.')
  return { movimentos: out, avisos, formato: 'Redução Z — SPED EFD (C405)' }
}

const inteiro = (x) => { const n = parseInt(String(x ?? '').replace(/\D/g, ''), 10); return Number.isFinite(n) ? n : null }
const numeroFinito = (x) => { const n = numeroBR(x); return Number.isFinite(n) ? n : null }

/* ------------------------------------- 2. Redução Z impressa (PDF/texto) */

const RX_Z_BLOCO = /REDU[ÇC][ÃA]O\s*[- ]?\s*Z/i

/**
 * Cupom de redução Z impresso. O layout muda de fabricante para fabricante, então
 * a leitura é por rótulo e não por posição: cada bloco que começa em "REDUÇÃO Z"
 * é varrido atrás da data, da venda bruta diária, do CRZ e do Grande Total.
 */
export function parseReducaoZImpressa (entrada, arquivo = '') {
  const texto = Array.isArray(entrada) ? entrada.join('\n') : String(entrada)
  if (!RX_Z_BLOCO.test(texto)) {
    return { movimentos: [], avisos: ['Não encontrei nenhum bloco "REDUÇÃO Z" neste arquivo.'], formato: 'Redução Z impressa' }
  }
  const cnpjDoc = normalizarCnpj((texto.match(/C\.?N\.?P\.?J\.?[\s.:/]*([\d]{2}[.\s]?\d{3}[.\s]?\d{3}[/\s]?\d{4}[-\s]?\d{2})/i) || [])[1])
  const partes = texto.split(new RegExp(`(?=${RX_Z_BLOCO.source})`, 'i')).filter(p => RX_Z_BLOCO.test(p))
  const out = []
  const avisos = []

  for (let i = 0; i < partes.length; i++) {
    const b = partes[i]
    const valor = rotulo(b, /VENDA\s+BRUTA\s+DI[ÁA]RIA/i) ?? rotulo(b, /VENDA\s+BRUTA/i)
    const data = normalizarData((b.match(/(\d{2}\/\d{2}\/\d{4})/) || [])[1]) ||
                 normalizarData((b.match(/(\d{4}-\d{2}-\d{2})/) || [])[1])
    if (valor == null || !data) {
      avisos.push(`Bloco ${i + 1} de redução Z: ${!data ? 'sem data' : 'sem "venda bruta diária"'} legível — ignorado.`)
      continue
    }
    out.push(mov({
      cnpj: normalizarCnpj((b.match(/C\.?N\.?P\.?J\.?[\s.:/]*([\d./-]{14,20})/i) || [])[1]) || cnpjDoc,
      data, competencia: competenciaDe(data), fonte: 'z', valor,
      crz: inteiroRotulo(b, /(?:CRZ|CONTADOR\s+DE\s+REDU[ÇC][ÃA]O)/i),
      cro: inteiroRotulo(b, /(?:CRO|CONTADOR\s+DE\s+REIN[ÍI]CIO)/i),
      coo: inteiroRotulo(b, /COO/i),
      gt: rotulo(b, /GRANDE\s+TOTAL/i),
      equipamento: ((b.match(/N[ºO°]?\s*DE\s+S[ÉE]RIE\s*:?\s*(\S+)/i) || [])[1] || '').trim() || null,
      origem: { formato: 'Redução Z impressa', arquivo, referencia: `bloco ${i + 1}` },
    }))
  }
  if (!out.length) avisos.push('Nenhum bloco de redução Z pôde ser lido por completo.')
  return { movimentos: out, avisos, formato: 'Redução Z impressa' }
}

/** Primeiro número monetário que aparece depois do rótulo. */
function rotulo (texto, rx) {
  const m = texto.match(new RegExp(rx.source + '[^\\d\\n-]{0,40}(-?[\\d.]+,\\d{2})', 'i'))
  return m ? numeroBR(m[1]) : null
}
function inteiroRotulo (texto, rx) {
  const m = texto.match(new RegExp(rx.source + '[^\\d\\n]{0,20}(\\d{1,9})', 'i'))
  return m ? Number(m[1]) : null
}

/* ------------------------------------------------- 3. Tabular (Z ou PDV) */

export const SINONIMOS_MOV = {
  cnpj: ['cnpj', 'cnpjcpf', 'cnpj/cpf', 'estabelecimento', 'documento'],
  luc: ['luc', 'numeroloja', 'numerodaloja', 'nloja', 'numloja', 'codigoloja', 'codloja', 'loja'],
  data: ['data', 'dia', 'datavenda', 'datamovimento', 'datareducao', 'dtdoc', 'dataemissao', 'competencia', 'periodo'],
  valor: ['valor', 'vendabruta', 'vendabrutadiaria', 'total', 'totalvendas', 'valortotal', 'venda', 'vendas',
    'faturamento', 'receita', 'vlbrt', 'valorbruto', 'totalliquido', 'valorvenda'],
  crz: ['crz', 'contadorreducaoz', 'reducaoz', 'numeroz', 'nz'],
  cro: ['cro', 'contadorreinicio'],
  gt: ['grandetotal', 'gt', 'gtfin', 'totalizadorgeral'],
  coo: ['coo', 'contadorordemoperacao'],
  equipamento: ['ecf', 'equipamento', 'caixa', 'pdv', 'terminal', 'serie', 'numeroserie'],
  cancelamentos: ['cancelamentos', 'cancelados', 'valorcancelado', 'cancelamento'],
  descontos: ['descontos', 'desconto', 'valordesconto'],
}

/**
 * Planilha ou CSV de redução Z / PDV: uma linha por dia (ou por dia e terminal).
 * Linhas do mesmo dia são somadas — é o caso de relatório quebrado por forma de
 * pagamento ou por caixa.
 */
export function parseMovimentoTabular (linhas, opts = {}) {
  const fonte = opts.fonte || 'pdv'
  const avisos = []
  const { i: iCab, mapa: mapaAuto } = acharCabecalho(linhas, SINONIMOS_MOV)
  const mapa = opts.mapa || mapaAuto
  if (iCab === -1 || mapa.valor == null) {
    return { movimentos: [], avisos: ['Não encontrei uma coluna de valor nesta planilha. Use o mapeamento de colunas.'], mapa, formato: 'Tabular' }
  }
  if (mapa.data == null) {
    return { movimentos: [], avisos: ['Não encontrei uma coluna de data. Use o mapeamento de colunas.'], mapa, formato: 'Tabular' }
  }
  // sem coluna de CNPJ, procura um no bloco de rótulos acima do cabeçalho
  const cnpjArquivo = normalizarCnpj(opts.cnpjPadrao) || (mapa.cnpj == null ? cnpjNoCabecalho(linhas, iCab + 1) : null)
  const out = []
  let semData = 0
  for (let r = iCab + 1; r < linhas.length; r++) {
    const linha = linhas[r]
    if (!linha || linha.every(c => c === '' || c == null)) continue
    const valor = numeroBR(linha[mapa.valor])
    if (!Number.isFinite(valor)) continue
    const data = normalizarData(linha[mapa.data])
    if (!data) { semData++; continue }
    const cnpjLido = mapa.cnpj != null ? String(linha[mapa.cnpj] ?? '').replace(/\D/g, '') : ''
    out.push(mov({
      // só vale como CNPJ o que tem 14 dígitos; o resto é tratado pela LUC
      cnpj: (cnpjLido.length === 14 ? cnpjLido : null) || cnpjArquivo,
      luc: mapa.luc != null ? String(linha[mapa.luc] ?? '').trim() || null : null,
      data, competencia: competenciaDe(data), fonte, valor,
      crz: mapa.crz != null ? inteiro(linha[mapa.crz]) : null,
      cro: mapa.cro != null ? inteiro(linha[mapa.cro]) : null,
      gt: mapa.gt != null ? numeroFinito(linha[mapa.gt]) : null,
      coo: mapa.coo != null ? inteiro(linha[mapa.coo]) : null,
      equipamento: mapa.equipamento != null ? String(linha[mapa.equipamento] ?? '').trim() || null : null,
      cancelamentos: mapa.cancelamentos != null ? numeroFinito(linha[mapa.cancelamentos]) : null,
      descontos: mapa.descontos != null ? numeroFinito(linha[mapa.descontos]) : null,
      origem: { formato: 'Tabular', arquivo: opts.arquivo || '', referencia: `linha ${r + 1}` },
    }))
  }
  if (semData) avisos.push(`${semData} linha(s) sem data legível foram ignoradas.`)
  const semCnpj = out.filter(m => !m.cnpj && !m.luc).length
  if (semCnpj) avisos.push(`${semCnpj} linha(s) sem CNPJ nem número da loja — informe o CNPJ padrão do arquivo.`)
  return { movimentos: out, avisos, mapa, formato: `Tabular (${NOME_FONTE_TRI[fonte] || fonte})` }
}

/* ------------------------------------------ 4. Relatório de PDV impresso */

const RX_DATA_LINHA = /\b(\d{2}\/\d{2}\/\d{4})\b/
const RX_VALORES = /-?\d{1,3}(?:\.\d{3})*,\d{2}\b/g

/**
 * Relatório de vendas do PDV em PDF ou foto: uma linha por dia (ou por dia e
 * caixa, ou por dia e forma de pagamento), cada uma com a data e um valor. O
 * layout muda de sistema para sistema, então a leitura é por padrão e não por
 * posição: em cada linha com data, o último número monetário é o valor da
 * linha, e as linhas do mesmo dia são somadas. Linhas de total são ignoradas
 * para não dobrar o mês.
 */
export function parsePdvImpresso (entrada, arquivo = '', opts = {}) {
  const texto = Array.isArray(entrada) ? entrada.join('\n') : String(entrada)
  const fonte = opts.fonte || 'pdv'
  const cnpjDoc = normalizarCnpj((texto.match(/C\.?N\.?P\.?J\.?[\s.:/]*([\d]{2}[.\s]?\d{3}[.\s]?\d{3}[/\s]?\d{4}[-\s]?\d{2})/i) || [])[1]) ||
    normalizarCnpj(opts.cnpjPadrao)
  const porDia = new Map()
  const avisos = []
  let linhasComData = 0
  for (const linha of texto.split(/\r?\n/)) {
    if (/\b(sub)?total\b|acumulad|somat[óo]rio/i.test(linha)) continue
    const md = linha.match(RX_DATA_LINHA)
    if (!md) continue
    const data = normalizarData(md[1])
    if (!data) continue
    const valores = (linha.slice(md.index + md[1].length).match(RX_VALORES) || [])
    if (!valores.length) continue
    linhasComData++
    const valor = numeroBR(valores[valores.length - 1])
    if (!Number.isFinite(valor)) continue
    const eq = (linha.match(/\b(PDV|CAIXA|TERMINAL|ECF)\s*-?\s*(\d{1,3})\b/i) || [])
    const chave = data
    const acc = porDia.get(chave) || { data, valor: 0, linhas: 0, equipamentos: new Set() }
    acc.valor = Math.round((acc.valor + valor) * 100) / 100
    acc.linhas++
    if (eq.length) acc.equipamentos.add(eq[1].toUpperCase() + eq[2])
    porDia.set(chave, acc)
  }
  if (!porDia.size) {
    return { movimentos: [], avisos: ['Não encontrei linhas com data e valor neste relatório de PDV.'], formato: 'PDV impresso' }
  }
  const movimentos = [...porDia.values()].sort((a, b) => a.data.localeCompare(b.data)).map(d => mov({
    cnpj: cnpjDoc, data: d.data, competencia: competenciaDe(d.data), fonte, valor: d.valor,
    equipamento: d.equipamentos.size === 1 ? [...d.equipamentos][0] : null,
    origem: { formato: 'PDV impresso', arquivo, referencia: `${d.linhas} linha(s) do dia` },
  }))
  if (!cnpjDoc) avisos.push('O relatório não traz CNPJ — informe o CNPJ padrão do arquivo ou escolha o lojista.')
  return { movimentos, avisos, formato: 'PDV impresso', linhasLidas: linhasComData }
}

/** Escolhe o parser pelo conteúdo. */
export function parseMovimentoTexto (texto, arquivo = '', opts = {}) {
  const t = String(texto)
  if (/\|C405\|/.test(t) || (/^\|0000\|/m.test(t) && /\|C400\|/.test(t))) return parseReducaoZSped(t, arquivo)
  if (RX_Z_BLOCO.test(t)) return parseReducaoZImpressa(opts.paginas || t, arquivo)
  const pdv = parsePdvImpresso(opts.paginas || t, arquivo, opts)
  if (pdv.movimentos.length) return pdv
  return { movimentos: [], avisos: ['Formato não reconhecido: esperava um cupom de redução Z ou um relatório de PDV com data e valor por linha.'], formato: 'desconhecido' }
}

/* ======================================================= motor da triangulação */

export const STATUS_TRI = {
  COERENTE: 'COERENTE',
  ATENCAO: 'ATENÇÃO',
  DISPERSO: 'DISPERSO',
  FONTE_UNICA: 'FONTE ÚNICA',
}

/**
 * Cruza os tipos de lançamento de venda — redução Z, PDV, NAPP e declarado —
 * por CNPJ e competência, e também dia a dia. A leitura é pelo MAIOR valor e
 * pela maior variação em reais entre os tipos (maior − menor), não pelo
 * percentual. Com um tipo só não há triangulação — a linha é marcada como tal
 * em vez de fingir concordância.
 *
 * @param {Array} movimentos  saída dos parsers (fonte 'z', 'pdv' e 'napp')
 * @param {Array} declarados  registros mensais { cnpj, competencia, valor }
 */
export function triangular (movimentos, declarados = [], opts = {}) {
  const lim = limitesTri(opts)

  /* --- diário: Z x PDV x NAPP --- */
  const dias = new Map()
  for (const m of movimentos) {
    if (!m || !m.data) continue
    const k = `${m.cnpj || 'SEM-CNPJ'}|${m.data}`
    if (!dias.has(k)) dias.set(k, { cnpj: m.cnpj, data: m.data, competencia: m.competencia, z: null, pdv: null, napp: null, registros: [] })
    const d = dias.get(k)
    d[m.fonte] = arred2((d[m.fonte] || 0) + (Number(m.valor) || 0))
    d.registros.push(m)
  }
  const porDia = [...dias.values()].map(d => {
    const dif = (d.z != null && d.pdv != null) ? arred2(d.z - d.pdv) : null
    const base = Math.max(Math.abs(d.z || 0), Math.abs(d.pdv || 0))
    const percent = dif == null ? null : (base > 0 ? arred2(dif / base * 100) : 0)
    const r = resumirFontes({ z: d.z, pdv: d.pdv, napp: d.napp }, { triCoerenteReais: lim.dia, triAtencaoReais: lim.dia })
    return { ...d, dif, percent, maior: r.maior, fonteMaior: r.fonteMaior, variacao: r.amplitude, status: r.status }
  }).sort(ordenarDia)

  /* --- mensal: Z x PDV x declarado --- */
  const meses = new Map()
  const chaveMes = (cnpj, comp) => `${cnpj || 'SEM-CNPJ'}|${comp}`
  const pegar = (cnpj, comp) => {
    const k = chaveMes(cnpj, comp)
    if (!meses.has(k)) {
      meses.set(k, { chave: k, cnpj, cnpjFmt: formatarCnpj(cnpj), competencia: comp,
        competenciaLabel: competenciaLabel(comp), z: null, pdv: null, napp: null, declarado: null,
        diasZ: 0, diasPdv: 0, diasNapp: 0, alertas: [], equipamentos: new Set(), arquivos: new Set() })
    }
    return meses.get(k)
  }
  for (const d of porDia) {
    const p = pegar(d.cnpj, d.competencia)
    if (d.z != null) { p.z = arred2((p.z || 0) + d.z); p.diasZ++ }
    if (d.pdv != null) { p.pdv = arred2((p.pdv || 0) + d.pdv); p.diasPdv++ }
    if (d.napp != null) { p.napp = arred2((p.napp || 0) + d.napp); p.diasNapp++ }
    for (const r of d.registros) {
      if (r.equipamento) p.equipamentos.add(r.equipamento)
      if (r.origem && r.origem.arquivo) p.arquivos.add(r.origem.arquivo)
    }
  }
  for (const r of declarados) {
    if (!r || !r.cnpj || !r.competencia) continue
    const p = pegar(r.cnpj, r.competencia)
    p.declarado = arred2((p.declarado || 0) + (Number(r.valor) || 0))
  }

  const porMes = [...meses.values()].map(p => {
    const r = resumirFontes({ z: p.z, pdv: p.pdv, napp: p.napp, declarado: p.declarado }, opts)
    const difZP = (p.z != null && p.pdv != null) ? arred2(p.z - p.pdv) : null
    const difDZ = (p.declarado != null && p.z != null) ? arred2(p.declarado - p.z) : null
    const difDP = (p.declarado != null && p.pdv != null) ? arred2(p.declarado - p.pdv) : null

    const alertas = [...p.alertas]
    if (difZP != null && -difZP > lim.coerente) {
      alertas.push({ tipo: 'venda_sem_documento', grave: true,
        texto: `O PDV registra ${moedaBR(Math.abs(difZP))} a mais do que a redução Z. ` +
          'A leitura direta é venda sem documento fiscal — confira antes de concluir.' })
    }
    if (difZP != null && difZP > lim.coerente) {
      alertas.push({ tipo: 'z_maior_que_pdv',
        texto: `A redução Z registra ${moedaBR(difZP)} a mais do que o PDV. ` +
          'Costuma ser exportação incompleta do PDV, não venda a mais.' })
    }
    if (r.naoDeclarado != null && r.naoDeclarado > lim.coerente) {
      alertas.push({ tipo: 'declarado_a_menor', grave: true,
        texto: `Foi declarado ${moedaBR(r.naoDeclarado)} a menos do que o maior valor registrado ` +
          `(${nomesFonte(r.fonteMaior)} ${moedaBR(r.maior)}).` })
    }
    return { ...p, equipamentos: [...p.equipamentos], arquivos: [...p.arquivos],
      difZP, difDZ, difDP, ...r, alertas, explicacao: explicarTri(p, r) }
  }).sort(ordenarMes)

  return { porDia, porMes, sequencia: conferirSequencia(movimentos), resumo: resumirTri(porMes) }
}

/** "PDV", "PDV e NAPP" — quando dois tipos empatam no maior valor, os dois aparecem. */
export const nomesFonte = (lista) => (lista || []).map(k => NOME_FONTE_TRI[k] || k).join(' e ')

function explicarTri (p, r) {
  if (r.status === STATUS_TRI.FONTE_UNICA) {
    const curto = { z: 'a redução Z', pdv: 'o PDV', napp: 'o NAPP', declarado: 'o declarado' }
    const tem = ['z', 'pdv', 'napp', 'declarado'].filter(f => p[f] != null)
    return tem.length ? `Só ${curto[tem[0]]}. Falta uma segunda fonte.` : 'Nenhuma fonte com valor.'
  }
  const partes = [`Maior valor: ${nomesFonte(r.fonteMaior)} ${moedaBR(r.maior)}`]
  if (r.status === STATUS_TRI.COERENTE) return `${partes[0]}. Os tipos de lançamento variam ${moedaBR(r.amplitude)}, dentro do limite.`
  partes.push(`variação de ${moedaBR(r.amplitude)} entre os tipos de lançamento`)
  if (r.naoDeclarado) partes.push(`${moedaBR(r.naoDeclarado)} acima do declarado`)
  const difZP = (p.z != null && p.pdv != null) ? arred2(p.z - p.pdv) : null
  if (difZP != null && Math.abs(difZP) > 0.05) {
    partes.push(difZP < 0 ? `PDV acima da Z em ${moedaBR(Math.abs(difZP))}` : `Z acima do PDV em ${moedaBR(difZP)}`)
  }
  return partes.join('; ') + '.'
}

/**
 * Duas conferências que só a redução Z permite, e que pegam o que a subtração
 * entre fontes não pega:
 *
 *  CRZ  o contador de reduções Z sobe de um em um. Um salto significa que a
 *       redução daquele dia não está no material entregue.
 *  GT   o Grande Total é acumulador e não zera. A diferença entre o GT de duas
 *       reduções seguidas tem de ser igual à venda bruta da segunda; quando não
 *       é, houve movimento entre elas que não aparece na sequência.
 */
export function conferirSequencia (movimentos) {
  const alertas = []
  const grupos = new Map()
  for (const m of movimentos) {
    if (m.fonte !== 'z') continue
    const k = `${m.cnpj || 'SEM-CNPJ'}|${m.equipamento || 'ECF'}`
    if (!grupos.has(k)) grupos.set(k, [])
    grupos.get(k).push(m)
  }
  for (const [k, lista] of grupos) {
    const [cnpj, equipamento] = k.split('|')
    const ordenada = [...lista].sort((a, b) => (a.data || '').localeCompare(b.data || '') || (a.crz || 0) - (b.crz || 0))
    let anterior = null
    for (const m of ordenada) {
      if (anterior) {
        if (m.crz != null && anterior.crz != null && m.crz - anterior.crz > 1) {
          alertas.push({ tipo: 'crz_com_salto', grave: true, cnpj, equipamento, data: m.data,
            texto: `${formatarCnpj(cnpj)} · ${equipamento}: o contador de redução Z pula de ${anterior.crz} ` +
              `(${dataLabel(anterior.data)}) para ${m.crz} (${dataLabel(m.data)}). ` +
              `Falta${m.crz - anterior.crz - 1 > 1 ? 'm' : ''} ${m.crz - anterior.crz - 1} redução(ões) no material entregue.` })
        }
        if (m.gt != null && anterior.gt != null) {
          const esperado = arred2(m.gt - anterior.gt)
          const dif = arred2(esperado - (m.valor || 0))
          if (Math.abs(dif) > 0.05) {
            alertas.push({ tipo: 'grande_total_nao_fecha', grave: true, cnpj, equipamento, data: m.data,
              texto: `${formatarCnpj(cnpj)} · ${equipamento}: entre ${dataLabel(anterior.data)} e ${dataLabel(m.data)} ` +
                `o Grande Total avançou ${moedaBR(esperado)}, mas a venda bruta do dia é ${moedaBR(m.valor)} — ` +
                `sobra ${moedaBR(dif)} sem redução Z correspondente.` })
          }
        }
        if (m.gt != null && anterior.gt != null && m.gt < anterior.gt) {
          alertas.push({ tipo: 'grande_total_retrocede', grave: true, cnpj, equipamento, data: m.data,
            texto: `${formatarCnpj(cnpj)} · ${equipamento}: o Grande Total caiu de ${moedaBR(anterior.gt)} ` +
              `para ${moedaBR(m.gt)}. Ele é acumulador e não deveria diminuir nunca.` })
        }
      }
      anterior = m
    }
  }
  return alertas
}

function resumirTri (porMes) {
  const r = { competencias: porMes.length, coerente: 0, atencao: 0, disperso: 0, fonteUnica: 0,
    totalZ: 0, totalPdv: 0, totalNapp: 0, totalDeclarado: 0, totalNaoDeclarado: 0, maiorDispersao: null, maiorVariacao: null, alertasGraves: 0 }
  for (const p of porMes) {
    if (p.status === STATUS_TRI.COERENTE) r.coerente++
    else if (p.status === STATUS_TRI.ATENCAO) r.atencao++
    else if (p.status === STATUS_TRI.DISPERSO) r.disperso++
    else r.fonteUnica++
    r.totalZ += p.z || 0; r.totalPdv += p.pdv || 0; r.totalNapp += p.napp || 0
    // o declarado só entra no total onde há Z, PDV ou NAPP para comparar: somar o
    // ano inteiro declarado contra um mês de Z faria o card mentir
    if (p.z != null || p.pdv != null || p.napp != null) { r.totalDeclarado += p.declarado || 0; r.totalNaoDeclarado += p.naoDeclarado || 0 }
    if (p.amplitude != null && (!r.maiorVariacao || p.amplitude > r.maiorVariacao.amplitude)) r.maiorVariacao = p
    r.alertasGraves += (p.alertas || []).filter(a => a.grave).length
    if (p.dispersao != null && (!r.maiorDispersao || p.dispersao > r.maiorDispersao.dispersao)) r.maiorDispersao = p
  }
  r.totalZ = arred2(r.totalZ); r.totalPdv = arred2(r.totalPdv); r.totalNapp = arred2(r.totalNapp)
  r.totalDeclarado = arred2(r.totalDeclarado); r.totalNaoDeclarado = arred2(r.totalNaoDeclarado)
  return r
}

const ordenarDia = (a, b) => (a.cnpj || '').localeCompare(b.cnpj || '') || (a.data || '').localeCompare(b.data || '')
const ordenarMes = (a, b) => (a.cnpj || '').localeCompare(b.cnpj || '') || (a.competencia || '').localeCompare(b.competencia || '')

/* ================== cruzamento final: triangulação x auditoria fiscal ===== */

export const VEREDITO = {
  COERENTE: 'TUDO FECHA',
  PARCIAL: 'FONTES DE MENOS',
  ATENCAO: 'ATENÇÃO',
  GRAVE: 'INVESTIGAR',
}

/**
 * Junta as quatro fontes numa linha só por CNPJ e competência:
 *
 *   Apurado    o que sai do livro fiscal (CFOP) ou do extrato do Simples
 *   Redução Z  o que o equipamento fiscal registrou
 *   PDV        o que o sistema comercial registrou
 *   Informado  o que foi declarado na planilha
 *
 * A referência é o apurado quando existe, porque é a peça que o fisco já tem;
 * sem ele, a redução Z assume. Toda diferença é medida contra essa referência,
 * e a linha diz qual fonte é a referência para ninguém comparar contra o que não
 * imagina.
 */
export function cruzarComAuditoria (periodosFiscais, porMes, opts = {}) {
  // mesma régua da triangulação: a maior diferença em reais contra a referência
  const lim = limitesTri(opts)

  const linhas = new Map()
  const pegar = (cnpj, comp, empresa) => {
    const k = `${cnpj || 'SEM-CNPJ'}|${comp}`
    if (!linhas.has(k)) {
      linhas.set(k, { chave: k, cnpj, cnpjFmt: formatarCnpj(cnpj), competencia: comp,
        competenciaLabel: competenciaLabel(comp), empresa: empresa || null,
        apurado: null, tipoApurado: null, z: null, pdv: null, napp: null, informado: null, alertas: [] })
    }
    const l = linhas.get(k)
    if (!l.empresa && empresa) l.empresa = empresa
    return l
  }

  for (const p of periodosFiscais || []) {
    const l = pegar(p.cnpj, p.competencia, p.empresa)
    // sem o livro de saídas o "apurado" seria zero por falta de arquivo, não por falta de venda
    const semSaidas = p.tipo !== 'declaracao' && Array.isArray(p.livros) && p.livros.length > 0 && !p.livros.includes('saidas')
    l.apurado = semSaidas ? null : (p.vendasLiquidas ?? null)
    if (semSaidas) l.alertas.push({ tipo: 'livro_incompleto', texto: 'Livro de saídas não carregado: o apurado desta competência fica fora do cruzamento.' })
    l.tipoApurado = p.tipo === 'declaracao' ? 'extrato do Simples' : 'livro fiscal'
    l.informado = p.informado ?? null
    if (p.alertas) l.alertas.push(...p.alertas.filter(a => a.tipo === 'exige_revisao' || a.tipo === 'cfop_desconhecido'))
  }
  for (const t of porMes || []) {
    const l = pegar(t.cnpj, t.competencia)
    l.z = t.z; l.pdv = t.pdv; l.napp = t.napp ?? null
    if (t.fechado !== undefined) l.fechado = t.fechado   // veio do histórico mensal (fechado) ou da sessão (aberto)
    if (t.declarado != null && l.informado == null) l.informado = t.declarado
    if (t.alertas) l.alertas.push(...t.alertas)
  }

  const out = [...linhas.values()].map(l => {
    const referencia = l.apurado != null ? 'apurado' : l.z != null ? 'z' : null
    const base = referencia ? l[referencia] : null
    const campos = ['apurado', 'z', 'pdv', 'napp', 'informado']
    const presentes = campos.filter(c => l[c] != null)

    const desvios = {}
    for (const c of campos) {
      desvios[c] = (base == null || l[c] == null || c === referencia) ? null
        : { valor: arred2(l[c] - base), percent: base !== 0 ? arred2((l[c] - base) / Math.abs(base) * 100) : null }
    }
    const piorPercent = Math.max(0, ...Object.values(desvios).filter(Boolean).map(d => Math.abs(d.percent ?? 0)))
    const piorValor = Math.max(0, ...Object.values(desvios).filter(Boolean).map(d => Math.abs(d.valor)))

    const grave = l.alertas.some(a => a.grave)
    const veredito = presentes.length < 2 ? VEREDITO.PARCIAL
      : grave ? VEREDITO.GRAVE
      : piorValor <= lim.coerente ? VEREDITO.COERENTE
      : piorValor <= lim.atencao ? VEREDITO.ATENCAO : VEREDITO.GRAVE
    const valoresPresentes = presentes.map(c => l[c])
    const maior = valoresPresentes.length ? Math.max(...valoresPresentes) : null

    return { ...l, referencia, desvios, piorPercent: arred2(piorPercent), piorValor: arred2(piorValor),
      maior, fonteMaior: presentes.filter(c => l[c] === maior),
      fontes: presentes.length, veredito, leitura: lerCruzamento(l, desvios, referencia, presentes) }
  }).sort(ordenarMes)

  return { linhas: out, resumo: resumirCruzamento(out) }
}

const NOME_FONTE = { apurado: 'apurado', z: 'redução Z', pdv: 'PDV', napp: 'NAPP', informado: 'informado' }

function lerCruzamento (l, desvios, referencia, presentes) {
  if (!referencia) {
    return presentes.length
      ? `Só ${presentes.map(c => 'o ' + NOME_FONTE[c]).join(' e ')} — sem apurado nem redução Z não há referência para cruzar.`
      : 'Nenhuma fonte com valor nesta competência.'
  }
  if (presentes.length < 2) {
    return `Só o ${NOME_FONTE[referencia]} tem valor aqui. Carregue ao menos mais uma fonte para cruzar.`
  }
  const partes = []
  for (const [campo, d] of Object.entries(desvios)) {
    if (!d || Math.abs(d.valor) <= 0.05) continue
    partes.push(`${NOME_FONTE[campo]} ${d.valor > 0 ? 'acima' : 'abaixo'} do ${NOME_FONTE[referencia]} em ` +
      `${moedaBR(Math.abs(d.valor))}${d.percent != null ? ` (${percentBR(Math.abs(d.percent))})` : ''}`)
  }
  if (!partes.length) return `As ${presentes.length} fontes fecham com o ${NOME_FONTE[referencia]}.`
  return partes.join('; ') + '.'
}

function resumirCruzamento (linhas) {
  const r = { competencias: linhas.length, coerente: 0, atencao: 0, grave: 0, parcial: 0, pior: null }
  for (const l of linhas) {
    if (l.veredito === VEREDITO.COERENTE) r.coerente++
    else if (l.veredito === VEREDITO.ATENCAO) r.atencao++
    else if (l.veredito === VEREDITO.GRAVE) r.grave++
    else r.parcial++
    if (l.fontes >= 2 && (!r.pior || l.piorValor > r.pior.piorValor)) r.pior = l
  }
  return r
}

/* ------------------------------------------------------------------ export */

const escCsv = (v) => v == null ? '' : typeof v === 'number' ? String(v).replace('.', ',')
  : /[";\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : String(v)

export function triangulacaoCsv (porMes) {
  const cab = ['CNPJ', 'Competência', 'Redução Z', 'PDV', 'NAPP', 'Declarado', 'Maior valor', 'Tipo do maior valor',
    'Variação R$ (maior − menor)', 'Não declarado R$ (maior − declarado)', 'Z − PDV', 'Dispersão %',
    'Dias com Z', 'Dias com PDV', 'Dias com NAPP', 'Status', 'Leitura']
  const linhas = [cab.join(';')]
  for (const p of porMes) {
    linhas.push([p.cnpjFmt, p.competenciaLabel, p.z, p.pdv, p.napp, p.declarado, p.maior, nomesFonte(p.fonteMaior),
      p.amplitude, p.naoDeclarado, p.difZP, p.dispersao, p.diasZ, p.diasPdv, p.diasNapp, p.status, p.explicacao].map(escCsv).join(';'))
  }
  return '\ufeff' + linhas.join('\r\n')
}

export function cruzamentoCsv (linhas) {
  const cab = ['CNPJ', 'Empresa', 'Competência', 'Referência', 'Apurado (livro/extrato)', 'Redução Z',
    'PDV', 'NAPP', 'Informado', 'Maior valor', 'Desvio Z R$', 'Desvio PDV R$', 'Desvio NAPP R$', 'Desvio informado R$',
    'Maior desvio R$', 'Veredito', 'Leitura']
  const out = [cab.join(';')]
  for (const l of linhas) {
    out.push([l.cnpjFmt, l.empresa, l.competenciaLabel, NOME_FONTE[l.referencia] || '', l.apurado, l.z, l.pdv, l.napp,
      l.informado, l.maior, l.desvios.z?.valor, l.desvios.pdv?.valor, l.desvios.napp?.valor, l.desvios.informado?.valor,
      l.piorValor, l.veredito, l.leitura].map(escCsv).join(';'))
  }
  return '\ufeff' + out.join('\r\n')
}
