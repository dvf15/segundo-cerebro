#!/usr/bin/env node
/**
 * Gera os ícones do app a partir de um desenho único.
 *
 * No estilo dos ícones das ferramentas do radarbazin1 (Radar de Varejo e
 * família): fundo verde-petróleo chapado, traço branco grosso e um detalhe em
 * verde-claro. O desenho é uma folha de livro fiscal sob uma lupa, com a venda
 * (três barras) dentro da lente — legível a 48px na tela inicial.
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

/**
 * @param {boolean} cheio  true = ícone "maskable" (o sistema recorta como quiser):
 *   o desenho encolhe para a área segura. Os dois sangram até a borda, como os
 *   ícones das outras ferramentas (operacoes-icon-*.png), e o sistema arredonda.
 */
function svg (cheio) {
  const k = cheio ? 0.8 : 1
  const t = (256 * (1 - k)).toFixed(1)
  const traco = `stroke="${cor.papel}" stroke-linecap="round" stroke-linejoin="round" fill="none"`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img" aria-label="Livro fiscal sob a lupa">
  <rect width="512" height="512" fill="${cor.verde}"/>
  <g transform="translate(${t} ${t}) scale(${k})">
    <!-- a folha do livro -->
    <path d="M 128 86 H 300 L 352 138 V 250 M 128 86 V 426 H 236" ${traco} stroke-width="30"/>
    <path d="M 176 168 H 268 M 176 228 H 252 M 176 288 H 214" ${traco} stroke-width="26"/>
    <!-- a lupa, com a venda (três barras) dentro da lente -->
    <circle cx="334" cy="336" r="86" fill="${cor.destaque}" stroke="${cor.papel}" stroke-width="30"/>
    <path d="M 398 400 L 446 448" ${traco} stroke-width="36"/>
    <path d="M 300 368 V 344 M 334 368 V 308 M 368 368 V 328" stroke="${cor.verde}" stroke-width="20" stroke-linecap="round" fill="none"/>
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
  background_color: cor.fundo,
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
console.log('\ncores usadas:', cor.verde, '/', cor.destaque, '— as do template do Radar de Varejo, em icones/paleta.json')
