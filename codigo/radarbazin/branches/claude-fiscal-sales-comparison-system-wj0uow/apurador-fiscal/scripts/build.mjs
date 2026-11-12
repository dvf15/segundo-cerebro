#!/usr/bin/env node
/**
 * Gera `index.html`: um único arquivo HTML, autocontido e offline.
 * Junta src/*.js (na ordem de dependência), src/ui.css e as bibliotecas de
 * vendor/. O worker do pdf.js entra como blob, para não precisar de arquivo solto.
 */
import { readFileSync, writeFileSync, statSync, existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const ler = (p) => readFileSync(join(raiz, p), 'utf8')

/**
 * Juntar tudo num escopo só significa que dois módulos não podem declarar o
 * mesmo nome no topo — o navegador recusa o script inteiro com
 * "Identifier already declared" e a página nasce em branco. O build acusa
 * antes, porque o sintoma não diz qual é o nome nem de onde ele veio.
 */
function conferirColisoes (arquivos) {
  const rx = /^(?:export\s+)?(?:const|let|var|function|class|async\s+function)\s+([A-Za-z_$][\w$]*)/gm
  const onde = new Map()
  const colisoes = []
  for (const nome of arquivos) {
    const fonte = ler(join('src', nome))
    for (const m of fonte.matchAll(rx)) {
      const id = m[1]
      if (onde.has(id)) colisoes.push(`${id} (em ${onde.get(id)} e ${nome})`)
      else onde.set(id, nome)
    }
  }
  if (colisoes.length) {
    throw new Error('nomes declarados duas vezes no topo, o bundle ficaria quebrado:\n  ' + colisoes.join('\n  '))
  }
}

/** Junta os módulos ES locais num só script: tira os imports internos e os `export`. */
function juntarModulos (arquivos) {
  // módulo novo em src/ e esquecido da lista vira página em branco: falha aqui, com nome
  const esquecidos = readdirSync(join(raiz, 'src')).filter(f => f.endsWith('.js') && !arquivos.includes(f))
  if (esquecidos.length) throw new Error('módulo(s) fora da ordem de empacotamento: ' + esquecidos.join(', '))
  conferirColisoes(arquivos)
  return arquivos.map(nome => {
    const fonte = ler(join('src', nome))
    return '/* ===== src/' + nome + ' ===== */\n' + fonte
      .replace(/^\s*import\s+[\s\S]*?from\s+['"]\.\/[^'"]+['"]\s*;?\s*$/gm, '')
      .replace(/^export\s+(const|let|function|class|async)\b/gm, '$1')
      .replace(/^export\s*\{[^}]*\}\s*;?\s*$/gm, '')
  }).join('\n\n')
}

/** Um `</script>` dentro do código fecharia a tag no HTML. */
const seguro = (js) => js.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--')

const css = ler('src/ui.css')
const pdfjs = ler('vendor/pdf.min.js')
const pdfWorker = ler('vendor/pdf.worker.min.js')
/*
 * O SheetJS traz U+FFFD de propósito nas tabelas de code page (CP437 e afins).
 * Embutir o texto cru esbarra em validadores que tratam esse caractere como
 * corrupção, e reescrevê-lo mudaria a biblioteca. Vai em base64 e é decodificado
 * byte a byte no carregamento — idêntico ao original.
 */
const sheetjsB64 = readFileSync(join(raiz, 'vendor/xlsx.full.min.js')).toString('base64')
const app = juntarModulos(['cfop.js', 'parsers.js', 'triangulacao.js', 'acompanhamento.js', 'societario.js', 'dashboard.js', 'basefic.js', 'apurar.js', 'ingest.js', 'app.js'])

const versao = new Date().toISOString().slice(0, 10)

/* --------------------------------------------------------------- ícones */

const b64 = (rel) => readFileSync(join(raiz, rel)).toString('base64')
const dataPng = (rel) => 'data:image/png;base64,' + b64(rel)

const temIcones = ['icones/icone-192.png', 'icones/icone-512.png',
  'icones/icone-maskable-512.png', 'icones/apple-touch-icon.png'].every(f => existsSync(join(raiz, f)))
if (!temIcones) console.warn('aviso: ícones ausentes — rode `npm run icones`')

const paleta = temIcones ? JSON.parse(ler('icones/paleta.json')) : { verde: '#0b5fa5', verdeProfundo: '#00754A' }
const icones = temIcones ? {
  i180: dataPng('icones/apple-touch-icon.png'),
  i192: dataPng('icones/icone-192.png'),
  i512: dataPng('icones/icone-512.png'),
  iMask: dataPng('icones/icone-maskable-512.png'),
  svg: 'data:image/svg+xml;base64,' + Buffer.from(ler('icones/icone.svg'), 'utf8').toString('base64'),
} : null

/*
 * O manifesto nasce em tempo de execução, como blob.
 * Um manifesto embutido em data: URL seria de outra origem, e aí `start_url`
 * e `scope` relativos não resolvem. O blob é da mesma origem do documento,
 * então os dois campos podem ficar de fora e o navegador assume a própria
 * página — que é o que se quer em um arquivo único.
 */
const blocoIcones = !icones ? '' : `
<link rel="icon" type="image/svg+xml" href="${icones.svg}">
<link rel="icon" type="image/png" sizes="192x192" href="${icones.i192}">
<link rel="apple-touch-icon" sizes="180x180" href="${icones.i180}">
<meta name="theme-color" content="${paleta.verde}">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Radar">
<meta name="application-name" content="Radar">
<script>
(function () {
  try {
    var m = {
      name: 'Radar de Auditoria', short_name: 'Radar', lang: 'pt-BR',
      description: 'Acelerador de auditoria de vendas: triangulação mensal (redução Z, PDV, declarado) e auditoria fiscal anual dos lojistas, com o acompanhamento do recebimento dos livros.',
      display: 'standalone', orientation: 'any',
      background_color: ${JSON.stringify(paleta.verdeProfundo)},
      theme_color: ${JSON.stringify(paleta.verde)},
      icons: [
        { src: ${JSON.stringify(icones.i192)}, sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: ${JSON.stringify(icones.i512)}, sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: ${JSON.stringify(icones.iMask)}, sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    }
    var url = URL.createObjectURL(new Blob([JSON.stringify(m)], { type: 'application/manifest+json' }))
    var l = document.createElement('link')
    l.rel = 'manifest'; l.href = url
    document.head.appendChild(l)
  } catch (e) { /* sem manifesto: a página segue funcionando normalmente */ }
})();
</script>`

const html = `<!DOCTYPE html>
<html lang="pt-BR" data-tema="">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Radar de Auditoria</title>
<meta name="description" content="Acelerador de auditoria de vendas de lojistas: triangulação mensal de redução Z, PDV e declarado, auditoria fiscal anual e acompanhamento do recebimento dos livros. Roda inteiro no navegador.">
<meta name="color-scheme" content="light dark">
${blocoIcones}
<style>${css}</style>
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
  Versão ${versao} · gerado por <code>npm run build</code> · bibliotecas embutidas: pdf.js 3.11.174 e SheetJS 0.18.5 (Apache-2.0).
  Ferramenta de triagem: aponta onde conferir, não substitui a análise do seu contador.
</p></footer>

<script id="sheetjs-b64" type="text/plain">${sheetjsB64}</script>
<script>
(function () {
  var b = atob(document.getElementById('sheetjs-b64').textContent.trim())
  var bytes = new Uint8Array(b.length)
  for (var i = 0; i < b.length; i++) bytes[i] = b.charCodeAt(i)
  var s = document.createElement('script')
  s.textContent = new TextDecoder('utf-8').decode(bytes)
  document.head.appendChild(s)
})();
</script>
<script>${seguro(pdfjs)}</script>
<!-- O worker do pdf.js fica aqui como texto, sem executar. -->
<script type="text/plain" id="pdf-worker-fonte">${seguro(pdfWorker)}</script>
<script>
/*
 * Duas formas de rodar o pdf.js, nesta ordem:
 *  1. Worker de verdade, a partir de um blob — não trava a interface.
 *  2. Se o ambiente barrar blob ou Worker (sandbox restrito), o mesmo código é
 *     injetado na página. Ao definir globalThis.pdfjsWorker, o pdf.js passa a
 *     usar o handler da thread principal e nem tenta criar um Worker.
 */
(function () {
  var fonte = document.getElementById('pdf-worker-fonte').textContent
  try {
    var url = URL.createObjectURL(new Blob([fonte], { type: 'text/javascript' }))
    var teste = new Worker(url)
    teste.terminate()
    globalThis.__PDF_WORKER_SRC__ = url
    return
  } catch (e) { /* cai para a thread principal */ }
  try {
    var s = document.createElement('script')
    s.textContent = fonte
    document.head.appendChild(s)
    globalThis.__PDF_MAIN_THREAD__ = !!globalThis.pdfjsWorker
  } catch (e2) {
    globalThis.__PDF_ERRO__ = 'Este ambiente bloqueia a leitura de PDF. Use SPED (.txt), Excel ou CSV.'
  }
})();
</script>
<script type="module">
${seguro(app)}
</script>
</body>
</html>
`

const destino = join(raiz, 'index.html')
writeFileSync(destino, html, 'utf8')
const kb = (statSync(destino).size / 1024).toFixed(0)
console.log(`index.html gerado — ${kb} KB (autocontido, abre com duplo clique)`)
