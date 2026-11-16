#!/usr/bin/env node
/**
 * Exporta o Radar de Auditoria no modelo das ferramentas do repositório
 * radarbazin1 (o mesmo do Radar de Varejo, public/operacoes.html): um arquivo
 * único em public/, com manifest e ícones próprios, servido pela Vercel em
 * /auditoria.html.
 *
 *   npm run build                                   (gera index.html)
 *   node scripts/exportar-radar.mjs ../radarbazin1  (copia para o outro repositório)
 *
 * O código continua aqui — apurador-fiscal/ é a fonte; a cópia em radarbazin1
 * é saída deste script. Editar lá direto faz as duas versões divergirem.
 *
 * O que muda em relação ao index.html:
 *   - no <head>, o padrão das ferramentas de lá: noindex, a política de
 *     segurança na própria página (com as exceções que este app precisa: o
 *     leitor de PDF roda num worker blob: e o OCR de foto baixa o tesseract.js
 *     do cdn.jsdelivr.net), e ícones/manifest em arquivo, não embutidos;
 *   - os vídeos ganham o prefixo auditoria- (a pasta public/ é compartilhada
 *     com as outras ferramentas). O vídeo de computador, da versão 1.x, fica
 *     de fora: a página remove sozinha o vídeo que não encontra.
 */
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve, relative } from 'node:path'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const destino = resolve(process.argv[2] || join(raiz, '..', '..', 'radarbazin1'))
const pub = join(destino, 'public')
if (!existsSync(join(destino, 'middleware.ts')) || !existsSync(pub)) {
  console.error(`não parece o repositório radarbazin1: ${destino} (esperava middleware.ts e public/)`)
  process.exit(2)
}
const ler = (p) => readFileSync(join(raiz, p), 'utf8')
const paleta = JSON.parse(ler('icones/paleta.json'))
const escrever = (abs, conteudo) => { mkdirSync(dirname(abs), { recursive: true }); writeFileSync(abs, conteudo); console.log('  ' + relative(destino, abs)) }
const copiar = (de, abs) => { mkdirSync(dirname(abs), { recursive: true }); copyFileSync(de, abs); console.log('  ' + relative(destino, abs)) }

/* ------------------------------------------------------------- a página */

let html = ler('index.html')
const trocar = (de, para, contar = 1) => {
  const n = html.split(de).length - 1
  if (n !== contar) throw new Error(`esperava ${contar} ocorrência(s) de ${JSON.stringify(de.slice(0, 60))}, achei ${n} — o index.html mudou de forma`)
  html = html.split(de).join(para)
}
// ícones embutidos (data:) saem; entram os arquivos, como nas outras ferramentas
html = html.replace(/<link rel="icon" type="image\/svg\+xml" href="data:[^"]*">\n?/, '')
html = html.replace(/<link rel="icon" type="image\/png" sizes="192x192" href="data:[^"]*">/, '<link rel="icon" type="image/png" sizes="192x192" href="auditoria-icon-192.png">')
html = html.replace(/<link rel="apple-touch-icon" sizes="180x180" href="data:[^"]*">/, '<link rel="apple-touch-icon" sizes="180x180" href="auditoria-icon-180.png">\n<link rel="manifest" href="auditoria.webmanifest?v=1">')
if (/href="data:image/.test(html.slice(0, html.indexOf('</head>')))) throw new Error('sobrou ícone embutido no <head>')
const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' blob: https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; " +
  "img-src 'self' data: blob:; font-src 'self' data:; media-src 'self' data: blob:; connect-src 'self' data: blob: https://cdn.jsdelivr.net; " +
  "worker-src 'self' blob:; manifest-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'self'"
trocar('<meta charset="utf-8">', `<meta charset="utf-8">\n<meta name="robots" content="noindex, nofollow">\n<meta http-equiv="Content-Security-Policy" content="${CSP}">`)
trocar('src="apurador-fiscal-celular.mp4"', 'src="auditoria-passo-a-passo-celular.mp4"')
trocar('src="radar-novidades.mp4"', 'src="auditoria-novidades.mp4"')
escrever(join(pub, 'auditoria.html'), html)

/* ---------------------------------------------------- manifest e ícones */

escrever(join(pub, 'auditoria.webmanifest'), JSON.stringify({
  name: 'Radar de Auditoria',
  short_name: 'Radar Auditoria',
  description: 'Auditoria de vendas de lojistas: triangulação (redução Z, PDV, NAPP e declarado), auditoria fiscal anual, notificações e mudança societária',
  start_url: '/auditoria.html',
  scope: '/',
  display: 'standalone',
  orientation: 'portrait',
  background_color: paleta.fundo || '#e5ded4',
  theme_color: paleta.verde,
  lang: 'pt-BR',
  icons: [
    { src: '/auditoria-icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/auditoria-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
  ],
}, null, 2) + '\n')
copiar(join(raiz, 'icones', 'apple-touch-icon.png'), join(pub, 'auditoria-icon-180.png'))
copiar(join(raiz, 'icones', 'icone-192.png'), join(pub, 'auditoria-icon-192.png'))
copiar(join(raiz, 'icones', 'icone-512.png'), join(pub, 'auditoria-icon-512.png'))

/* ---------------------------------------------------------------- vídeos */

// o passo a passo em 1080p tem ~29 MB: vai em 720p, como no Artifact; o de novidades já é leve
const ffmpeg = ['/usr/bin/ffmpeg', '/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux'].find(existsSync)
const passo = join(raiz, 'demo', 'apurador-fiscal-celular.mp4')
const passoDestino = join(pub, 'auditoria-passo-a-passo-celular.mp4')
if (ffmpeg) {
  execFileSync(ffmpeg, ['-y', '-v', 'error', '-i', passo, '-vf', 'scale=720:1280', '-r', '15', '-c:v', 'libx264', '-preset', 'slow',
    '-crf', '37', '-tune', 'stillimage', '-c:a', 'aac', '-ac', '1', '-b:a', '48k', '-movflags', '+faststart', passoDestino])
  console.log('  ' + relative(destino, passoDestino) + ' (720p)')
} else {
  copiar(passo, passoDestino)
}
copiar(join(raiz, 'demo', 'radar-novidades.mp4'), join(pub, 'auditoria-novidades.mp4'))

/* ------------------------------------------------- base de teste e simulação */

const ex = join(pub, 'exemplos')
copiar(join(raiz, 'demo', 'base-ficticia.json'), join(ex, 'auditoria-base-teste.json'))
copiar(join(raiz, 'demo', 'base-ficticia.xlsx'), join(ex, 'auditoria-base-teste.xlsx'))
copiar(join(raiz, 'demo', 'lojistas-base-ficticia.csv'), join(ex, 'auditoria-lojistas-base-teste.csv'))
copiar(join(raiz, 'demo', 'roteiro-de-testes.md'), join(ex, 'auditoria-roteiro-de-testes.md'))
const sim = join(raiz, 'demo', 'simulacao')
const percorrer = (dir) => readdirSync(dir).flatMap(f => {
  const p = join(dir, f)
  return f.startsWith('.') ? [] : statSync(p).isDirectory() ? percorrer(p) : [p]
})
for (const f of percorrer(sim)) copiar(f, join(ex, 'auditoria-simulacao', relative(sim, f)))

console.log(`\nexportado para ${destino}`)
