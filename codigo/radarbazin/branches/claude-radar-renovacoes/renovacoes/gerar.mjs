// Gera as duas edições do painel a partir do mesmo motor:
//   radar-renovacoes.html         edição completa (desktop, tabelas)  ← src/painel.src.html
//   radar-renovacoes-mobile.html  edição no modelo do Radar de Varejo ← src/app.src.html (arquivo único, sem dependência externa)
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const dir = dirname(fileURLToPath(import.meta.url))
const ler = (f) => readFileSync(join(dir, f), 'utf8')
const motor = ler('motor.mjs').replace(/^export (const|function) /gm, '$1 ')
const exemplo = JSON.stringify(JSON.parse(ler('exemplo.json')))
const painel = ler('src/painel.src.html')
const out = painel.replace('/*__MOTOR__*/', () => motor).replace('/*__EXEMPLO__*/', () => exemplo)
writeFileSync(join(dir, 'radar-renovacoes.html'), out)
console.log('gerado radar-renovacoes.html', (out.length / 1024).toFixed(0), 'KB')
// gráficos: as mesmas funções da edição completa, extraídas pelo nome
const graficos = ['renderQuadrantes', 'renderHistChart', 'renderLinChart', 'renderLaudoChart', 'renderLaudoRangeChart', 'renderPlanoChart'].map(n => {
  const i = painel.indexOf(`\nfunction ${n}(`); if (i < 0) throw new Error('gráfico não encontrado: ' + n)
  const j = painel.indexOf('\n}\n', i); return painel.slice(i + 1, j + 3)
}).join('\n')
// o SheetJS traz tabelas de codepage em bytes latin-1: lido como latin-1 e escapado para ASCII, para o HTML ficar UTF-8 válido
const xlsx = readFileSync(join(dir, 'vendor/xlsx.mini.min.js'), 'latin1').replace(/[^\x00-\x7f]/g, c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).replace(/<\/script/gi, '<\\/script')
const app = ler('src/app.src.html').replace('/*__XLSX__*/', () => xlsx).replace('/*__MOTOR__*/', () => motor).replace('/*__EXEMPLO__*/', () => exemplo).replace('/*__ICONS__*/', () => ler('src/icones-varejo.js')).replace('/*__CHARTS__*/', () => graficos)
writeFileSync(join(dir, 'radar-renovacoes-mobile.html'), app)
console.log('gerado radar-renovacoes-mobile.html', (app.length / 1024).toFixed(0), 'KB')

// --publicar <pasta public/ do radarbazin1>: grava renovacoes.html no padrão dos outros radares do repositório
// (cabeçalho PWA com ícone, manifesto e a mesma Content-Security-Policy; vídeos com o prefixo renovacoes-).
const iPub = process.argv.indexOf('--publicar')
if (iPub > 0) {
  const destino = process.argv[iPub + 1]
  if (!destino) throw new Error('informe a pasta public/ de destino')
  const cabeca = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="robots" content="noindex, nofollow">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; media-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'self'">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Radar de Renovações">
<link rel="icon" type="image/png" sizes="192x192" href="renovacoes-icon-192.png">
<link rel="apple-touch-icon" sizes="180x180" href="renovacoes-icon-180.png">
<link rel="manifest" href="renovacoes.webmanifest?v=1">
`
  const pub = cabeca + app.replace('<title>Radar de Renovações Mobile</title>', '<title>Radar de Renovações — Maximização de Renovação Contratual</title>')
    .replace(/<source src="radar-renovacoes-como-usar\.webm" type="video\/webm">/, '')
    .replace(/radar-renovacoes-como-usar\.mp4/g, 'renovacoes-como-usar.mp4').replace(/radar-renovacoes-celular\.mp4/g, 'renovacoes-celular.mp4')
    .replace(/<\/script>\s*$/, '</script>\n</body>\n</html>\n')
  const corpo = pub.replace('<meta name="claude:viewport-fit-sides" content="cover">', '')
  const i = corpo.indexOf('<style>')
  const html = corpo.slice(0, i) + '</head>\n<body>\n' + corpo.slice(i).replace('</style>\n', '</style>\n', 1)
  writeFileSync(join(destino, 'renovacoes.html'), moverEstilos(html))
  console.log('publicado', join(destino, 'renovacoes.html'))
}
// estilos vão para o <head>: tudo antes de <div class="wrap"> que seja <style>…</style>
function moverEstilos(html) {
  const ini = html.indexOf('</head>\n<body>\n')
  const resto = html.slice(ini + '</head>\n<body>\n'.length)
  const fimEstilo = resto.indexOf('</style>') + '</style>'.length
  return html.slice(0, ini) + resto.slice(0, fimEstilo) + '\n</head>\n<body>\n' + resto.slice(fimEstilo)
}
