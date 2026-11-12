#!/usr/bin/env node
/**
 * Gera os ícones do app a partir de um desenho único.
 *
 * Um livro aberto minimalista: duas páginas simétricas separadas por uma
 * fresta que deixa o verde do fundo aparecer como lombada. A página da
 * direita é levemente tingida — dá volume sem nenhuma linha interna, que
 * some de qualquer jeito a 48px na tela inicial.
 *
 * As cores vivem só em icones/paleta.json.
 *
 *   npm run icones   ->  icones/*.svg e *.png
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { caminhoChromium } from './chromium.mjs'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const dir = join(raiz, 'icones')
if (!existsSync(dir)) mkdirSync(dir)
const cor = JSON.parse(readFileSync(join(dir, 'paleta.json'), 'utf8'))

/** Traço arredondado nos cantos das páginas, em vez de bicos. */
const ARREDONDA = 'stroke-linejoin="round" stroke-linecap="round" stroke-width="10"'

/**
 * @param {boolean} cheio  true = sangra até a borda (ícone "maskable", que o
 *   sistema recorta como quiser); false = quadrado de cantos arredondados.
 */
function svg (cheio) {
  // no maskable o desenho encolhe para caber na área segura do recorte
  const k = cheio ? 0.76 : 1
  const t = (256 * (1 - k)).toFixed(1)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img" aria-label="Livro aberto">
  <defs>
    <linearGradient id="fundo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${cor.verde}"/>
      <stop offset="1" stop-color="${cor.verdeProfundo}"/>
    </linearGradient>
  </defs>
  ${cheio
    ? `<rect width="512" height="512" fill="url(#fundo)"/>`
    : `<rect width="512" height="512" rx="112" ry="112" fill="url(#fundo)"/>`}
  <g transform="translate(${t} ${t}) scale(${k})">
    <path d="M 250 200 C 210 174, 148 162, 88 182 L 88 332 C 148 312, 210 324, 250 352 Z"
      fill="${cor.papel}" stroke="${cor.papel}" ${ARREDONDA}/>
    <path d="M 262 200 C 302 174, 364 162, 424 182 L 424 332 C 364 312, 302 324, 262 352 Z"
      fill="${cor.papelSombra}" stroke="${cor.papelSombra}" ${ARREDONDA}/>
  </g>
</svg>`
}

const ARQUIVOS = [
  { nome: 'icone.svg', conteudo: svg(false) },
  { nome: 'icone-maskable.svg', conteudo: svg(true) },
]
for (const a of ARQUIVOS) writeFileSync(join(dir, a.nome), a.conteudo, 'utf8')

const PNGS = [
  { nome: 'icone-192.png', tamanho: 192, cheio: false },
  { nome: 'icone-512.png', tamanho: 512, cheio: false },
  { nome: 'icone-maskable-512.png', tamanho: 512, cheio: true },
  { nome: 'apple-touch-icon.png', tamanho: 180, cheio: false },
]

const navegador = await chromium.launch({ executablePath: caminhoChromium() })

for (const p of PNGS) {
  const pagina = await navegador.newPage({ viewport: { width: p.tamanho, height: p.tamanho }, deviceScaleFactor: 1 })
  await pagina.setContent(
    `<!DOCTYPE html><html><head><style>html,body{margin:0;padding:0;overflow:hidden}
     svg{display:block;width:${p.tamanho}px;height:${p.tamanho}px}</style></head>
     <body>${svg(p.cheio)}</body></html>`, { waitUntil: 'load' })
  await pagina.screenshot({ path: join(dir, p.nome), omitBackground: true })
  await pagina.close()
  console.log('icones/' + p.nome)
}
await navegador.close()

/* ------------------------------------------------------- manifesto do app */

const manifesto = {
  name: 'Radar de Auditoria',
  short_name: 'Radar',
  description: 'Acelerador de auditoria de vendas: triangulação mensal (redução Z, PDV, declarado) e auditoria fiscal anual dos lojistas, com o acompanhamento do recebimento dos livros.',
  start_url: './',
  scope: './',
  display: 'standalone',
  orientation: 'any',
  background_color: cor.verdeProfundo,
  theme_color: cor.verde,
  lang: 'pt-BR',
  icons: [
    { src: './icones/icone-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: './icones/icone-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: './icones/icone-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}
writeFileSync(join(raiz, 'manifest.webmanifest'), JSON.stringify(manifesto, null, 2) + '\n', 'utf8')
console.log('manifest.webmanifest')
console.log('\ncores usadas:', cor.verde, '/', cor.verdeProfundo, '— provisórias, veja icones/paleta.json')
