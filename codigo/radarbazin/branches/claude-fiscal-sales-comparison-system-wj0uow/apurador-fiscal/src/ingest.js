/**
 * Camada de leitura de arquivos. Só roda no navegador.
 * Nada aqui envia dados para lugar nenhum: tudo é lido com FileReader e
 * processado em memória. pdf.js e SheetJS estão embutidos na própria página.
 */
import { parseTexto, parseTabularLivro, parseVendasInformadas, parseLivroClassico, parseResumoCstCfop,
  parseSpedEfd, parsePgdasD, ehPgdasD } from './parsers.js'
import { parseMovimentoTexto, parseMovimentoTabular } from './triangulacao.js'

export const FORMATOS_ACEITOS = '.pdf,.txt,.csv,.xls,.xlsx,.xlsm,.png,.jpg,.jpeg,.webp,.tif,.tiff,.bmp'
/** A triangulação recebe só o que sai da loja como documento: PDF ou foto. */
export const FORMATOS_TRIANGULACAO = '.pdf,.png,.jpg,.jpeg,.webp,.tif,.tiff,.bmp,.heic'
const EXT_TRIANGULACAO = new Set(['pdf', 'png', 'jpg', 'jpeg', 'webp', 'tif', 'tiff', 'bmp', 'heic', 'gif'])
export const ehFormatoDeTriangulacao = (nome) => EXT_TRIANGULACAO.has(ext(nome))
/** O NAPP chega em planilha, um valor por dia: é o único lançamento da triangulação que entra em Excel. */
export const FORMATOS_NAPP = '.xlsx,.xls,.xlsm,.csv'
const EXT_NAPP = new Set(['xlsx', 'xls', 'xlsm', 'csv'])

const ext = (nome) => (String(nome).match(/\.([a-z0-9]+)$/i) || [, ''])[1].toLowerCase()

/**
 * Lê um arquivo e devolve { tipo, texto?, paginas?, linhas?, aviso? }.
 * @param {File} file
 * @param {(msg:string)=>void} [progresso]
 */
export async function lerArquivo (file, progresso = () => {}) {
  const e = ext(file.name)
  if (e === 'pdf') {
    progresso(pdfNaThreadPrincipal() ? 'lendo PDF (sem worker — pode travar a tela por alguns segundos)…' : 'lendo PDF…')
    const paginas = await textoDePdf(file, progresso)
    const vazio = paginas.every(p => !p.trim())
    return { tipo: 'pdf', paginas, texto: paginas.join('\n'), confianca: 'alta',
      aviso: vazio ? 'Este PDF não tem camada de texto (provavelmente é digitalizado). Ative o OCR ou exporte o livro em TXT/Excel.' : null }
  }
  if (['xls', 'xlsx', 'xlsm', 'xlsb', 'ods'].includes(e)) {
    progresso('lendo planilha…')
    return { tipo: 'planilha', abas: await linhasDePlanilha(file), confianca: 'alta' }
  }
  if (e === 'csv' || e === 'tsv') {
    progresso('lendo CSV…')
    const texto = await lerTexto(file)
    return { tipo: 'planilha', texto, abas: [{ nome: file.name, linhas: csvParaLinhas(texto) }], confianca: 'alta' }
  }
  if (['png', 'jpg', 'jpeg', 'webp', 'tif', 'tiff', 'bmp', 'gif'].includes(e)) {
    progresso('rodando OCR (pode demorar)…')
    const texto = await ocr(file, progresso)
    return { tipo: 'imagem', texto, paginas: [texto], confianca: 'baixa',
      aviso: 'Texto obtido por OCR de imagem. Confira valor por valor antes de usar o resultado como definitivo.' }
  }
  progresso('lendo texto…')
  const texto = await lerTexto(file)
  return { tipo: 'texto', texto, paginas: [texto], confianca: 'alta' }
}

/* ------------------------------------------------------------------- PDF */

let pdfPronto = false
function prepararPdfJs () {
  if (pdfPronto) return
  const lib = globalThis.pdfjsLib
  if (!lib) throw new Error('pdf.js não carregou.')
  if (globalThis.__PDF_ERRO__) throw new Error(globalThis.__PDF_ERRO__)
  if (globalThis.__PDF_WORKER_SRC__) lib.GlobalWorkerOptions.workerSrc = globalThis.__PDF_WORKER_SRC__
  else if (!globalThis.pdfjsWorker) throw new Error('O motor de leitura de PDF não carregou. Use SPED (.txt), Excel ou CSV.')
  pdfPronto = true
}

/** true quando o PDF é processado na thread principal (ambiente sem Worker). */
export function pdfNaThreadPrincipal () {
  return !globalThis.__PDF_WORKER_SRC__ && !!globalThis.pdfjsWorker
}

/**
 * Descobre em que ângulo o texto da página foi desenhado.
 *
 * Livro fiscal em A4 retrato com conteúdo em paisagem é comum: o texto sai
 * com matriz [0,1,-1,0], girado 90°. Lido como se estivesse na horizontal,
 * ele vira "SOÇIVRES" em vez de "SERVIÇOS" e nenhum cabeçalho é reconhecido.
 * O peso é por quantidade de caracteres, para um carimbo solto de lado não
 * decidir a orientação da página inteira.
 */
export function rotacaoDoTexto (items) {
  const peso = new Map()
  for (const it of items || []) {
    if (!it.str || !it.str.trim() || !it.transform) continue
    const g = (Math.round(Math.atan2(it.transform[1], it.transform[0]) * 180 / Math.PI / 90) * 90 + 360) % 360
    peso.set(g, (peso.get(g) || 0) + it.str.trim().length)
  }
  let melhor = 0; let max = -1
  for (const [g, n] of peso) if (n > max) { max = n; melhor = g }
  return melhor
}

/** Extrai o texto de cada página, endireitando o que estiver girado. */
export async function textoDePdf (file, progresso = () => {}) {
  prepararPdfJs()
  const lib = globalThis.pdfjsLib
  const buf = await file.arrayBuffer()
  const pdf = await lib.getDocument({ data: new Uint8Array(buf), isEvalSupported: false }).promise
  const paginas = []
  for (let i = 1; i <= pdf.numPages; i++) {
    if (i % 10 === 0 || i === 1) progresso(`lendo PDF… página ${i}/${pdf.numPages}`)
    const page = await pdf.getPage(i)
    const conteudo = await page.getTextContent()
    const giro = rotacaoDoTexto(conteudo.items)
    /*
     * O viewport gira no MESMO ângulo do texto, não no oposto: compondo
     * V(θ)·T(θ) a matriz do fragmento volta a [s,0,0,-s], que é texto
     * horizontal no espaço da tela. Usar 360-θ deixa a página espelhada —
     * a ordem das linhas e a das palavras saem ambas de trás para frente.
     */
    const viewport = page.getViewport({ scale: 1, rotation: giro })
    paginas.push(montarLinhas(conteudo.items, { projetar: projetorDeViewport(lib, viewport) }))
    page.cleanup()
  }
  await pdf.destroy()
  return paginas
}

/** Leva cada fragmento para o espaço da tela já endireitado. */
function projetorDeViewport (lib, viewport) {
  return (it) => {
    const t = lib.Util.transform(viewport.transform, it.transform)
    return { x: t[4], y: t[5], w: it.width || 0 }   // no espaço da tela, y cresce para baixo
  }
}

/**
 * Agrupa os fragmentos de texto do pdf.js em linhas legíveis.
 * `projetar` converte um fragmento em {x, y, w} já endireitado; sem ele, o
 * fragmento é lido como está (usado nos testes e em páginas sem rotação).
 */
export function montarLinhas (items, opts = {}) {
  const tolerancia = opts.tolerancia ?? 2.2
  const projetar = opts.projetar || (it => ({ x: it.transform[4], y: -it.transform[5], w: it.width || 0 }))
  const frags = items
    .filter(it => typeof it.str === 'string' && it.str.length)
    .map(it => { const q = projetar(it); return { x: q.x, y: q.y, s: it.str, w: q.w } })
  if (!frags.length) return ''
  frags.sort((a, b) => (a.y - b.y) || (a.x - b.x))
  const linhas = []
  let atual = null
  for (const f of frags) {
    if (!atual || Math.abs(atual.y - f.y) > tolerancia) {
      atual = { y: f.y, frags: [f] }
      linhas.push(atual)
    } else {
      atual.frags.push(f)
    }
  }
  return linhas.map(l => {
    l.frags.sort((a, b) => a.x - b.x)
    let texto = ''
    let fimAnterior = null
    for (const f of l.frags) {
      if (fimAnterior !== null && f.x - fimAnterior > 1 && !/\s$/.test(texto) && !/^\s/.test(f.s)) texto += ' '
      texto += f.s
      fimAnterior = f.x + f.w
    }
    return texto.trim()
  }).filter(Boolean).join('\n')
}

/* -------------------------------------------------------------- planilhas */

export async function linhasDePlanilha (file) {
  const XLSX = globalThis.XLSX
  if (!XLSX) throw new Error('SheetJS não carregou.')
  const buf = await file.arrayBuffer()
  const wb = XLSX.read(buf, { type: 'array', cellDates: true, raw: false })
  return wb.SheetNames.map(nome => ({
    nome,
    linhas: XLSX.utils.sheet_to_json(wb.Sheets[nome], { header: 1, raw: false, defval: '', blankrows: false }),
  }))
}

/** CSV/TSV simples com aspas, detectando ; , ou tab. */
export function csvParaLinhas (texto) {
  const t = String(texto).replace(/^﻿/, '')
  const amostra = t.slice(0, 5000)
  const sep = [';', ',', '\t'].map(s => [s, (amostra.split(s).length - 1)]).sort((a, b) => b[1] - a[1])[0][0]
  const linhas = []
  let campo = ''; let linha = []; let aspas = false
  for (let i = 0; i < t.length; i++) {
    const c = t[i]
    if (aspas) {
      if (c === '"') { if (t[i + 1] === '"') { campo += '"'; i++ } else aspas = false }
      else campo += c
    } else if (c === '"') aspas = true
    else if (c === sep) { linha.push(campo); campo = '' }
    else if (c === '\n') { linha.push(campo); linhas.push(linha); linha = []; campo = '' }
    else if (c === '\r') { /* ignora */ }
    else campo += c
  }
  if (campo !== '' || linha.length) { linha.push(campo); linhas.push(linha) }
  return linhas
}

function lerTexto (file) {
  return new Promise((ok, erro) => {
    const fr = new FileReader()
    fr.onerror = () => erro(new Error('Falha ao ler o arquivo.'))
    fr.onload = () => {
      const buf = new Uint8Array(fr.result)
      let txt = new TextDecoder('utf-8', { fatal: false }).decode(buf)
      // SPED e livros exportados costumam vir em latin-1
      if (/\uFFFD/.test(txt)) txt = new TextDecoder('windows-1252').decode(buf)
      ok(txt)
    }
    fr.readAsArrayBuffer(file)
  })
}

/* -------------------------------------------------------------------- OCR */

const OCR_CDN = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js'
let ocrCarregando = null

/**
 * OCR é o único recurso que precisa de internet: a biblioteca e o modelo de
 * idioma são baixados sob demanda. Fora dele, a página funciona 100% offline.
 */
export async function carregarOcr () {
  if (globalThis.Tesseract) return globalThis.Tesseract
  if (!ocrCarregando) {
    ocrCarregando = new Promise((ok, erro) => {
      const s = document.createElement('script')
      s.src = OCR_CDN
      s.onload = () => globalThis.Tesseract ? ok(globalThis.Tesseract) : erro(new Error('tesseract.js carregou vazio.'))
      s.onerror = () => erro(new Error('Não foi possível baixar o OCR (tesseract.js). Verifique a conexão ou converta a foto em PDF/Excel.'))
      document.head.appendChild(s)
    })
  }
  return ocrCarregando
}

export async function ocr (file, progresso = () => {}) {
  const T = await carregarOcr()
  const worker = await T.createWorker('por', 1, {
    logger: (m) => { if (m.status === 'recognizing text') progresso(`OCR ${Math.round((m.progress || 0) * 100)}%`) },
  })
  try {
    const { data } = await worker.recognize(file)
    return data.text || ''
  } finally {
    await worker.terminate()
  }
}

/* -------------------------------------------------- conversão -> lançamentos */

/**
 * Converte um arquivo lido em lançamentos, escolhendo o parser certo.
 * @param {object} lido  saída de lerArquivo
 * @param {object} opts  { arquivo, fonteId, formatoForcado, livroPadrao, cnpjPadrao, competenciaPadrao, mapa, aba }
 */
export function extrairLancamentos (lido, opts = {}) {
  const arquivo = opts.arquivo || ''
  const marcar = (r) => {
    for (const l of r.lancamentos || []) {
      l.origem = { ...(l.origem || {}), arquivo, fonteId: opts.fonteId }
      if (lido.confianca === 'baixa' && l.confianca === 'alta') l.confianca = 'baixa'
    }
    if (lido.aviso) r.avisos = [lido.aviso, ...(r.avisos || [])]
    return r
  }

  if (lido.tipo === 'planilha') {
    const aba = (lido.abas || []).find(a => a.nome === opts.aba) || (lido.abas || [])[0]
    if (!aba) return { lancamentos: [], avisos: ['Planilha sem abas legíveis.'], formato: 'Tabular' }
    return marcar(parseTabularLivro(aba.linhas, { ...opts, arquivo }))
  }

  const texto = lido.texto || ''
  const paginas = lido.paginas || [texto]
  if (ehPgdasD(texto)) {
    const r = parsePgdasD(paginas, arquivo)
    for (const x of r.registros || []) { x.arquivo = x.arquivo || arquivo; x.fonteId = opts.fonteId }
    if (lido.aviso) r.avisos = [lido.aviso, ...(r.avisos || [])]
    return { lancamentos: [], declaracoes: r.registros, avisos: r.avisos, formato: r.formato, competencia: r.competencia }
  }
  const rodar = (formato) => {
    switch (formato) {
      case 'sped': return parseSpedEfd(texto, arquivo)
      case 'livro-classico': return parseLivroClassico(paginas, arquivo)
      case 'resumo-cst': return parseResumoCstCfop(paginas, arquivo, lido.confianca || 'alta')
      default: return parseTexto(texto, arquivo, { paginas, confianca: lido.confianca })
    }
  }
  const forcado = opts.formatoForcado
  const r = rodar(forcado)
  /*
   * Formato escolhido na mão que não lê nada costuma ser formato errado, e a
   * mensagem do parser sozinha não diz isso. Se a detecção automática acha
   * lançamentos, o aviso passa a dizer qual formato usar.
   */
  if (forcado && forcado !== 'auto' && !(r.lancamentos || []).length) {
    const auto = rodar(null)
    if ((auto.lancamentos || []).length) {
      r.avisos = [`Nenhum lançamento foi lido com o formato escolhido. Este arquivo parece ser ` +
        `"${auto.formato}" — mude o Formato para "detectar" (ou para esse formato) e ele lê ` +
        `${auto.lancamentos.length} lançamento(s).`, ...(r.avisos || [])]
    }
  }
  return marcar(r)
}

/**
 * Vendas informadas: planilha, CSV ou extrato do Simples Nacional (PGDAS-D).
 * O extrato é a receita declarada à Receita — a versão oficial do "quanto a
 * empresa disse que vendeu" —, então entra por aqui e não pelo livro fiscal.
 */
export function extrairVendasInformadas (lido, opts = {}) {
  const arquivo = opts.arquivo || ''
  const marcar = (r) => {
    for (const x of r.registros || []) { x.arquivo = x.arquivo || arquivo; x.fonteId = opts.fonteId }
    if (lido.aviso) r.avisos = [lido.aviso, ...(r.avisos || [])]
    return r
  }
  if (lido.tipo !== 'planilha') {
    const texto = lido.texto || ''
    if (ehPgdasD(texto)) {
      return { registros: [],
        avisos: ['Este é um Extrato do Simples Nacional (PGDAS-D): ele é a receita declarada à Receita, ' +
          'a referência contra a qual a venda informada é conferida. Carregue-o no Passo 1.'] }
    }
    return marcar(parseVendasInformadas(csvParaLinhas(texto), { ...opts, arquivo }))
  }
  const aba = (lido.abas || []).find(a => a.nome === opts.aba) || (lido.abas || [])[0]
  if (!aba) return { registros: [], avisos: ['Planilha sem abas legíveis.'] }
  return marcar(parseVendasInformadas(aba.linhas, { ...opts, arquivo }))
}


/**
 * Movimento diário para a triangulação: redução Z ou relatório de PDV.
 * Aceita os mesmos formatos dos livros — SPED, PDF, planilha, CSV e foto.
 */
export function extrairMovimentos (lido, opts = {}) {
  const arquivo = opts.arquivo || ''
  const fonte = opts.fonte || 'pdv'
  if (fonte === 'napp') {
    if (!EXT_NAPP.has(ext(arquivo))) throw new Error('O NAPP entra em planilha (Excel ou CSV), com um valor por dia.')
  } else if (!ehFormatoDeTriangulacao(arquivo)) {
    throw new Error('A redução Z e o relatório de PDV entram só em PDF ou foto (como saem da loja). ' +
      'Planilha, CSV e SPED não entram aqui — a planilha diária vai na caixa do NAPP.')
  }
  const marcar = (r) => {
    for (const m of r.movimentos || []) {
      m.origem = { ...(m.origem || {}), arquivo, fonteId: opts.fonteId }
      if (!m.fonte) m.fonte = fonte
      if (!m.cnpj && opts.cnpjPadrao) m.cnpj = opts.cnpjPadrao
    }
    if (lido.aviso) r.avisos = [lido.aviso, ...(r.avisos || [])]
    return r
  }
  if (lido.tipo === 'planilha') {
    const aba = (lido.abas || []).find(a => a.nome === opts.aba) || (lido.abas || [])[0]
    if (!aba) return { movimentos: [], avisos: ['Planilha sem abas legíveis.'], formato: 'Tabular' }
    return marcar(parseMovimentoTabular(aba.linhas, { ...opts, arquivo, fonte }))
  }
  const texto = lido.texto || ''
  const r = parseMovimentoTexto(texto, arquivo, { paginas: lido.paginas })
  // CSV solto cai no leitor de texto e não casa com nenhum formato conhecido
  if (!(r.movimentos || []).length && texto.includes(',') === false && texto.includes(';') === false) return marcar(r)
  if (!(r.movimentos || []).length) {
    const tab = parseMovimentoTabular(csvParaLinhas(texto), { ...opts, arquivo, fonte })
    if ((tab.movimentos || []).length) return marcar(tab)
  }
  return marcar(r)
}
