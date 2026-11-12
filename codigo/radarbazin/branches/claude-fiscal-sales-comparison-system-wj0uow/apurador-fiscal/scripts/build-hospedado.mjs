#!/usr/bin/env node
/**
 * Build para hospedagem (Vercel, servidor próprio, o que for).
 *
 * Diferente do index.html de arquivo único, aqui as bibliotecas, os ícones e o
 * manifesto são arquivos separados. Isso deixa a página pequena, permite cache
 * pelo navegador e dispensa os truques que o arquivo único exige: o worker do
 * pdf.js vem por caminho relativo em vez de blob, e o manifesto é um .webmanifest
 * de verdade, da mesma origem, então start_url e scope resolvem sozinhos.
 *
 *   npm run build:hospedado   ->  deploy/
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, statSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const destino = join(raiz, 'deploy')
const ler = (p) => readFileSync(join(raiz, p), 'utf8')

// o LEIA-ME é escrito à mão: sobrevive à limpeza da pasta
let leiaMe = null
try { leiaMe = readFileSync(join(destino, 'LEIA-ME.txt'), 'utf8') } catch {}
rmSync(destino, { recursive: true, force: true })
mkdirSync(join(destino, 'vendor'), { recursive: true })
if (leiaMe) writeFileSync(join(destino, 'LEIA-ME.txt'), leiaMe)
mkdirSync(join(destino, 'icones'), { recursive: true })

function juntarModulos (arquivos) {
  return arquivos.map(nome => '/* ===== src/' + nome + ' ===== */\n' + ler(join('src', nome))
    .replace(/^\s*import\s+[\s\S]*?from\s+['"]\.\/[^'"]+['"]\s*;?\s*$/gm, '')
    .replace(/^export\s+(const|let|function|class|async)\b/gm, '$1')
    .replace(/^export\s*\{[^}]*\}\s*;?\s*$/gm, '')).join('\n\n')
}
const seguro = (js) => js.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--')

for (const f of ['pdf.min.js', 'pdf.worker.min.js', 'xlsx.full.min.js', 'LICENSE-pdfjs.txt', 'LICENSE-sheetjs.txt']) {
  cpSync(join(raiz, 'vendor', f), join(destino, 'vendor', f))
}
for (const f of readdirSync(join(raiz, 'icones'))) cpSync(join(raiz, 'icones', f), join(destino, 'icones', f))
cpSync(join(raiz, 'manifest.webmanifest'), join(destino, 'manifest.webmanifest'))

const paleta = JSON.parse(ler('icones/paleta.json'))
const versao = new Date().toISOString().slice(0, 10)

const html = `<!DOCTYPE html>
<html lang="pt-BR" data-tema="">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Radar de Auditoria</title>
<meta name="description" content="Acelerador de auditoria de vendas: triangulação mensal (redução Z, PDV, declarado) e auditoria fiscal anual dos lojistas, com o acompanhamento do recebimento dos livros. Roda inteiro no navegador.">
<meta name="color-scheme" content="light dark">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/svg+xml" href="icones/icone.svg">
<link rel="icon" type="image/png" sizes="192x192" href="icones/icone-192.png">
<link rel="icon" type="image/png" sizes="512x512" href="icones/icone-512.png">
<link rel="apple-touch-icon" sizes="180x180" href="icones/apple-touch-icon.png">
<meta name="theme-color" content="${paleta.verde}">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Radar">
<meta name="application-name" content="Radar">
<style>${ler('src/ui.css')}</style>
</head>
<body>
<header class="topo"><div class="wrap">
  <h1>📡 Radar de Auditoria <small class="versao">2.1 · acelerador de auditoria de lojistas</small></h1>
  <span class="selo" title="Nenhum arquivo sai deste navegador">🔒 processamento local</span>
  <span class="espaco"></span>
  <button class="leve" id="tema">Tema: auto</button>
</div></header>
<main class="wrap"><div id="app"></div></main>
<footer class="wrap"><p class="nota">
  Versão ${versao} · bibliotecas: pdf.js 3.11.174 e SheetJS 0.18.5 (Apache-2.0).
  Ferramenta de triagem: aponta onde conferir, não substitui a análise do seu contador.
</p></footer>

<script src="vendor/xlsx.full.min.js"></script>
<script src="vendor/pdf.min.js"></script>
<script>
// Servido por HTTP, o worker é só um caminho relativo — nada de blob.
globalThis.__PDF_WORKER_SRC__ = 'vendor/pdf.worker.min.js'
</script>
<script type="module">
${seguro(juntarModulos(['cfop.js', 'parsers.js', 'triangulacao.js', 'acompanhamento.js', 'societario.js', 'dashboard.js', 'basefic.js', 'apurar.js', 'ingest.js', 'app.js']))}
</script>
</body>
</html>
`
writeFileSync(join(destino, 'index.html'), html, 'utf8')

writeFileSync(join(destino, 'vercel.json'), JSON.stringify({
  $schema: 'https://openapi.vercel.sh/vercel.json',
  headers: [{
    source: '/(.*)',
    headers: [
      { key: 'Content-Security-Policy',
        value: "default-src 'none'; script-src 'self' 'unsafe-inline' blob: https://cdn.jsdelivr.net; " +
               "style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; " +
               "media-src 'self' data: blob:; connect-src 'self' data: blob: https://cdn.jsdelivr.net; " +
               "worker-src 'self' blob:; manifest-src 'self'; base-uri 'none'; form-action 'none'; " +
               "frame-ancestors 'self'; object-src 'none'" },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'no-referrer' },
      { key: 'Permissions-Policy', value: 'geolocation=(), camera=(), microphone=(), payment=(), usb=()' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
    ],
  }],
}, null, 2) + '\n', 'utf8')

const lista = []
function andar (dir, prefixo = '') {
  for (const f of readdirSync(join(destino, dir || '.'), { withFileTypes: true })) {
    const rel = prefixo ? prefixo + '/' + f.name : f.name
    if (f.isDirectory()) andar(rel, rel)
    else lista.push([rel, statSync(join(destino, rel)).size])
  }
}
andar('')
let total = 0
for (const [f, s] of lista.sort()) { total += s; console.log(String(Math.round(s / 1024)).padStart(5) + ' KB  ' + f) }
console.log('-'.repeat(28))
console.log(String(Math.round(total / 1024)).padStart(5) + ' KB  total em deploy/')
