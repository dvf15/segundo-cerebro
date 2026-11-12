/**
 * Narração em áudio para os vídeos de orientação, sintetizada local com o
 * Piper (rede neural, roda na CPU, sem internet depois de baixar a voz).
 *
 *   node scripts/baixar-voz.mjs      (uma vez: traz a voz pt-BR para demo/.narracao/voz)
 *
 * Cada trecho narrado vira um WAV em cache (pelo hash do texto), então o
 * ensaio RAPIDO=1 enche o cache e a gravação de verdade não espera síntese.
 * No fim, os trechos são montados numa trilha única pelo instante em que cada
 * legenda entrou na tela, e a trilha é mixada no MP4.
 */
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { execFileSync, spawnSync } from 'node:child_process'
import { join } from 'node:path'

export const VOZ = 'pt-br-edresson-low'
export const TAXA = 16000           // Hz — a voz é de 16 kHz, mono, 16 bits

export function caminhoVoz (raiz) {
  return join(raiz, 'demo', '.narracao', 'voz', VOZ + '.onnx')
}
export function piperDisponivel () {
  const r = spawnSync('piper', ['--help'], { stdio: 'pipe' })
  return !r.error && r.status === 0
}

/**
 * O que a legenda escreve não é o que a voz deve ler: siglas são soletradas,
 * "R$" some (o texto já diz "reais" quando importa), milhar com ponto vira
 * número inteiro, códigos CFOP saem dígito a dígito e os símbolos de tela caem.
 */
export function paraFala (texto) {
  return String(texto)
    .replace(/([.!?:;,])\s*\n\s*/g, '$1 ').replace(/\s*\n\s*/g, '. ')
    .replace(/R\$\s*/g, '')
    // código CFOP (4 dígitos soltos, sem ponto de milhar em volta) sai dígito a dígito; ano não
    .replace(/(?<![\d.])([1235-7]\d{3})(?![\d.,])/g, m => /^(19|20)\d{2}$/.test(m) ? m : m.split('').join(' '))
    .replace(/\b(\d{1,3})(\.\d{3})+\b/g, m => m.replace(/\./g, ''))   // 121.196 -> 121196
    .replace(/,00\b/g, '')
    .replace(/\bCNPJ\b/g, 'C N P J').replace(/\bPDV\b/g, 'P D V').replace(/\bCRZ\b/g, 'C R Z')
    .replace(/\bCFOP\b/g, 'C F O P').replace(/\bLUC\b/g, 'L U C').replace(/\bECF\b/g, 'E C F')
    .replace(/\bCSV\b/g, 'C S V').replace(/\bPDF\b/g, 'P D F').replace(/\bSPED\b/g, 'spéd').replace(/\bOCR\b/g, 'O C R')
    .replace(/\bGT\b/g, 'G T').replace(/\bJSON\b/g, 'jêisom').replace(/\bWhatsApp\b/g, 'uótis-ápi')
    .replace(/\bZ\b/g, 'zê').replace(/\bDEC\b/g, 'declarado').replace(/\bINF\b/g, 'informado')
    .replace(/\.txt\b/g, 'ponto t x t')
    .replace(/[✦✕▶•]/g, '').replace(/→/g, ' para ').replace(/[—–]/g, ',').replace(/·/g, ',')
    .replace(/"/g, '').replace(/\s{2,}/g, ' ').trim()
}

/** Sintetiza (ou pega do cache) e devolve { wav, segundos }. */
export function sintetizar (texto, raiz, opts = {}) {
  const dir = join(raiz, 'demo', '.narracao', 'cache')
  mkdirSync(dir, { recursive: true })
  const falado = paraFala(texto)
  const chave = createHash('sha1').update(VOZ + '|' + (opts.lengthScale || 0.92) + '|' + falado).digest('hex').slice(0, 16)
  const wav = join(dir, chave + '.wav')
  if (!existsSync(wav)) {
    const r = spawnSync('piper', ['-m', caminhoVoz(raiz), '--length-scale', String(opts.lengthScale || 0.92),
      '--sentence-silence', '0.28', '-f', wav], { input: falado, stdio: ['pipe', 'pipe', 'pipe'] })
    if (r.status !== 0) throw new Error('piper falhou: ' + String(r.stderr).slice(-400))
  }
  return { wav, segundos: duracaoWav(wav), falado }
}

export function duracaoWav (wav) {
  const b = readFileSync(wav)
  const { dados } = lerWav(b)
  return dados.length / 2 / TAXA
}

/** Lê um WAV PCM 16 bits mono e devolve o bloco de amostras. */
function lerWav (b) {
  if (b.toString('ascii', 0, 4) !== 'RIFF') throw new Error('não é WAV')
  let pos = 12
  let fmt = null; let dados = null
  while (pos + 8 <= b.length) {
    const id = b.toString('ascii', pos, pos + 4); const tam = b.readUInt32LE(pos + 4)
    if (id === 'fmt ') fmt = { canais: b.readUInt16LE(pos + 10), taxa: b.readUInt32LE(pos + 12), bits: b.readUInt16LE(pos + 22) }
    if (id === 'data') { dados = b.subarray(pos + 8, pos + 8 + tam); break }
    pos += 8 + tam + (tam % 2)
  }
  if (!fmt || !dados) throw new Error('WAV sem fmt/data')
  if (fmt.canais !== 1 || fmt.taxa !== TAXA || fmt.bits !== 16) throw new Error(`WAV inesperado: ${JSON.stringify(fmt)}`)
  return { fmt, dados }
}

/**
 * Monta a trilha: silêncio do tamanho do vídeo com cada trecho colado no seu
 * instante. Dois trechos que se sobreponham (não deveria acontecer) são somados
 * com corte, não mixados — a narração é sequencial por construção.
 */
export function montarTrilha (eventos, duracaoSegundos, saida) {
  const total = Math.ceil(duracaoSegundos * TAXA) * 2
  const buf = Buffer.alloc(total)   // silêncio
  for (const e of eventos) {
    const { dados } = lerWav(readFileSync(e.wav))
    const ini = Math.round(e.segundo * TAXA) * 2
    for (let i = 0; i + 1 < dados.length && ini + i + 1 < total; i += 2) {
      const v = Math.max(-32768, Math.min(32767, buf.readInt16LE(ini + i) + dados.readInt16LE(i)))
      buf.writeInt16LE(v, ini + i)
    }
  }
  const cab = Buffer.alloc(44)
  cab.write('RIFF', 0); cab.writeUInt32LE(36 + total, 4); cab.write('WAVE', 8)
  cab.write('fmt ', 12); cab.writeUInt32LE(16, 16); cab.writeUInt16LE(1, 20); cab.writeUInt16LE(1, 22)
  cab.writeUInt32LE(TAXA, 24); cab.writeUInt32LE(TAXA * 2, 28); cab.writeUInt16LE(2, 32); cab.writeUInt16LE(16, 34)
  cab.write('data', 36); cab.writeUInt32LE(total, 40)
  writeFileSync(saida, Buffer.concat([cab, buf]))
  return saida
}

/** Mixa a trilha no vídeo, sem recodificar a imagem. */
export function mixar (ffmpeg, videoEntrada, trilhaWav, videoSaida) {
  execFileSync(ffmpeg, ['-y', '-i', videoEntrada, '-i', trilhaWav, '-map', '0:v:0', '-map', '1:a:0',
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '56k', '-ac', '1', '-shortest', '-movflags', '+faststart', videoSaida], { stdio: 'pipe' })
}

export function duracaoVideo (ffprobe, arquivo) {
  return Number(execFileSync(ffprobe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', arquivo]).toString().trim())
}
