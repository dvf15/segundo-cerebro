#!/usr/bin/env node
/**
 * Baixa a voz pt-BR do Piper para demo/.narracao/voz (fora do git: 63 MB).
 *
 * A voz é a "pt-br-edresson-low" publicada no release v0.0.2 do Piper no
 * GitHub (MIT). As vozes mais novas ficam no Hugging Face, que alguns proxies
 * bloqueiam — o release do GitHub é o caminho que funciona em qualquer lugar.
 * Limite conhecido desta voz: o mapa de fonemas dela não tem a marca de
 * nasalização, então "não" sai quase como "nau". Inteligível, com sotaque.
 *
 *   pip install piper-tts        (o sintetizador)
 *   node scripts/baixar-voz.mjs  (a voz)
 */
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { VOZ, caminhoVoz } from './narracao.mjs'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const destino = caminhoVoz(raiz)
const URL_VOZ = `https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-${VOZ}.tar.gz`

if (existsSync(destino)) {
  console.log('voz já está em', destino)
  process.exit(0)
}
const dir = dirname(destino)
mkdirSync(dir, { recursive: true })
console.log('baixando', URL_VOZ)
const resp = await fetch(URL_VOZ)
if (!resp.ok) { console.error('falhou:', resp.status, resp.statusText); process.exit(1) }
const tgz = join(dir, 'voz.tar.gz')
writeFileSync(tgz, Buffer.from(await resp.arrayBuffer()))
execFileSync('tar', ['xzf', tgz, '-C', dir])
rmSync(tgz, { force: true })
if (!existsSync(destino)) { console.error('o pacote não trouxe', destino); process.exit(1) }
console.log('voz pronta em', destino)
