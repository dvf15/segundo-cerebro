#!/usr/bin/env node
/**
 * Grava o vídeo de orientação: um Chromium de verdade usando o sistema de
 * verdade, com os arquivos de demo/. Nada é encenado — o que aparece na tela
 * é o resultado real do cálculo.
 *
 *   node scripts/gerar-demo.mjs      (uma vez, para criar os arquivos)
 *   node scripts/gravar-video.mjs    -> demo/apurador-fiscal-passo-a-passo.mp4
 */
import { chromium } from 'playwright'
import { existsSync, mkdirSync, rmSync, readdirSync, renameSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'
import { caminhoChromium } from './chromium.mjs'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const demo = join(raiz, 'demo')
const bruto = join(demo, '.gravacao')
const LARGURA = 1280; const ALTURA = 820

const FFMPEG = [process.env.FFMPEG_PATH, '/usr/bin/ffmpeg', '/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux']
  .find(p => p && existsSync(p))
const CHROME = caminhoChromium()

for (const f of ['livro-entradas-2025.pdf', 'livro-saidas-2025.pdf', 'vendas-informadas.xlsx']) {
  if (!existsSync(join(demo, f))) {
    console.error(`falta demo/${f} — rode antes: node scripts/gerar-demo.mjs`)
    process.exit(2)
  }
}
rmSync(bruto, { recursive: true, force: true })
mkdirSync(bruto, { recursive: true })

/* ------------------------------------------------ camada de narração na tela */

const OVERLAY = () => {
  // addInitScript roda antes do documento existir; espera o body aparecer.
  if (!document.body) {
    document.addEventListener('DOMContentLoaded', () => instalar(), { once: true })
    return
  }
  instalar()

  function instalar () {
  const css = document.createElement('style')
  css.textContent = `
    #nar{position:fixed;left:0;right:0;bottom:0;z-index:99999;padding:18px 28px 22px;
      background:linear-gradient(to top,rgba(8,12,18,.97) 60%,rgba(8,12,18,0));color:#fff;
      font:15.5px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
      opacity:0;transition:opacity .35s;pointer-events:none}
    #nar.on{opacity:1}
    #nar b{display:block;font-size:12px;letter-spacing:1.3px;text-transform:uppercase;
      color:#7dc4ff;margin-bottom:5px;font-weight:700}
    #nar span{display:block;max-width:1060px;font-size:17px}
    #anel{position:fixed;z-index:99998;border:3px solid #ffc53d;border-radius:9px;
      box-shadow:0 0 0 9999px rgba(8,12,18,.45),0 0 18px rgba(255,197,61,.7);
      opacity:0;transition:all .4s cubic-bezier(.4,0,.2,1);pointer-events:none}
    #anel.on{opacity:1}
    #cur{position:fixed;z-index:99999;width:22px;height:22px;margin:-11px 0 0 -11px;
      border-radius:50%;background:rgba(255,197,61,.35);border:2px solid #ffc53d;
      opacity:0;transition:transform .55s cubic-bezier(.4,0,.2,1),opacity .25s;pointer-events:none}
    #cur.on{opacity:1}
    #cur.clique{animation:pulso .45s ease-out}
    @keyframes pulso{0%{transform:scale(1)}45%{transform:scale(.55)}100%{transform:scale(1)}}
    #titulo{position:fixed;inset:0;z-index:100000;background:#0b1118;color:#fff;display:flex;
      flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;
      font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
      opacity:0;transition:opacity .5s;pointer-events:none;padding:0 40px}
    #titulo.on{opacity:1}
    #titulo h2{font-size:40px;margin:0;letter-spacing:-.8px}
    #titulo p{font-size:19px;margin:0;color:#9db4c8;max-width:760px;line-height:1.55}`
  document.head.appendChild(css)
  const add = (id, html) => { const d = document.createElement('div'); d.id = id; if (html) d.innerHTML = html; document.body.appendChild(d); return d }
  const nar = add('nar', '<b></b><span></span>')
  const anel = add('anel'); const cur = add('cur')
  const tit = add('titulo', '<h2></h2><p></p>')

  window.__demo = {
    legenda (titulo, texto) {
      nar.querySelector('b').textContent = titulo || ''
      nar.querySelector('span').textContent = texto || ''
      nar.classList.toggle('on', !!(titulo || texto))
    },
    destacarCaixa (r, margem = 8) {
      if (!r) { anel.classList.remove('on'); return false }
      Object.assign(anel.style, {
        top: (r.y - margem) + 'px', left: (r.x - margem) + 'px',
        width: (r.width + margem * 2) + 'px', height: (r.height + margem * 2) + 'px',
      })
      anel.classList.add('on')
      return true
    },
    limpar () { anel.classList.remove('on') },
    cursor (x, y) { cur.classList.add('on'); cur.style.transform = `translate(${x}px,${y}px)` },
    cursorCaixa (r) {
      if (!r) return null
      const x = r.x + r.width / 2; const y = r.y + r.height / 2
      cur.classList.add('on'); cur.style.transform = `translate(${x}px,${y}px)`
      return { x, y }
    },
    clique () { cur.classList.remove('clique'); void cur.offsetWidth; cur.classList.add('clique') },
    esconderCursor () { cur.classList.remove('on') },
    titulo (h, p) {
      tit.querySelector('h2').textContent = h || ''
      tit.querySelector('p').textContent = p || ''
      tit.classList.toggle('on', !!h)
    },
  }
  }
}

/* ------------------------------------------------------------------ roteiro */

const navegador = await chromium.launch({ executablePath: CHROME })
const ctx = await navegador.newContext({
  viewport: { width: LARGURA, height: ALTURA },
  recordVideo: { dir: bruto, size: { width: LARGURA, height: ALTURA } },
  deviceScaleFactor: 1,
})
const p = await ctx.newPage()
const erros = []
p.on('pageerror', e => erros.push(e.message))

/** RAPIDO=1 ensaia o roteiro em um décimo do tempo, só para as conferências rodarem. */
const RAPIDO = !!process.env.RAPIDO
const pausa = (ms) => p.waitForTimeout(RAPIDO ? Math.min(ms, 120) : ms)
/** Tempo de leitura: ~16 caracteres por segundo, com piso e teto. */
const leitura = (t) => RAPIDO ? 150 : Math.min(11000, Math.max(2600, Math.round(String(t).length / 16 * 1000) + 1100))

async function fala (titulo, texto, extra = 0) {
  await p.evaluate(([t, x]) => window.__demo.legenda(t, x), [titulo, texto])
  await pausa(leitura(texto) + extra)
}
/**
 * Resolve o elemento pelo Playwright (que entende :has-text e afins) e manda
 * só a caixa para a camada de narração, que é CSS puro.
 */
async function caixa (sel) {
  const loc = p.locator(sel).first()
  if (!await loc.count()) { console.warn('  (não encontrei na tela:', sel + ')'); return null }
  return await loc.boundingBox()
}
const FAIXA_LEGENDA = 150   // altura reservada para a narração no rodapé

/**
 * Destaca um elemento. Rola antes, porque boundingBox() não rola: medir um
 * elemento fora da tela desenha o anel em cima de outra linha qualquer.
 */
async function aponta (sel, margem) {
  const loc = p.locator(sel).first()
  if (!await loc.count()) { console.warn('  (não encontrei na tela:', sel + ')'); return }
  await loc.evaluate(el => el.scrollIntoView({ block: 'center' }))
  await pausa(420)
  let r = await loc.boundingBox()
  if (r && r.y + r.height > ALTURA - FAIXA_LEGENDA) {
    // o alvo ficaria atrás da legenda: sobe mais um pouco
    await p.evaluate(d => window.scrollBy(0, d), r.y + r.height - (ALTURA - FAIXA_LEGENDA) + 20)
    await pausa(360)
    r = await loc.boundingBox()
  }
  await p.evaluate(([c, m]) => window.__demo.destacarCaixa(c, m), [r, margem ?? 8])
  await pausa(430)
}
const limpa = () => p.evaluate(() => window.__demo.limpar())
async function cliqueVisivel (sel) {
  // a legenda sai de cena antes da ação: narrar um estado que já mudou engana.
  await p.evaluate(() => { window.__demo.legenda('', ''); window.__demo.limpar() })
  await pausa(300)
  const r = await caixa(sel)
  if (r) {
    await p.evaluate(c => window.__demo.cursorCaixa(c), r)
    await pausa(650)
    await p.evaluate(() => window.__demo.clique())
    await pausa(220)
  }
  await p.click(sel)
  await pausa(450)
}
/**
 * Confere na tela o que a narração afirma. Se o sistema mudar e o vídeo passar
 * a dizer algo falso, a gravação para aqui em vez de publicar a mentira.
 */
async function confirmar (oQue, sel, esperado) {
  const texto = (await p.locator(sel).first().innerText()).replace(/\s+/g, ' ')
  const faltando = [].concat(esperado).filter(e => !texto.includes(e))
  if (faltando.length) {
    throw new Error(`a narração diz "${oQue}", mas a tela não mostra ${faltando.map(f => JSON.stringify(f)).join(', ')}\n  tela: ${texto.slice(0, 240)}`)
  }
  console.log('  ✓', oQue)
}

async function cartela (h, texto, ms) {
  await p.evaluate(([a, b]) => window.__demo.titulo(a, b), [h, texto])
  await pausa(ms)
  await p.evaluate(() => window.__demo.titulo('', ''))
  await pausa(600)
}
/** Acha a linha da tabela de conciliação de uma competência. */
const linhaDe = (comp, cnpjFinal) =>
  `tbody tr:has(td:nth-child(2):text-is("${comp}")):has(td:nth-child(1):has-text("${cnpjFinal}"))`

await p.addInitScript(OVERLAY)
await p.addInitScript(() => { try { localStorage.clear() } catch {} })  // começa sempre limpo
await p.goto(pathToFileURL(join(raiz, 'index.html')).href)
await p.waitForSelector('nav.abas')
await p.waitForFunction(() => !!window.__demo, null, { timeout: 15000 })
await p.click('nav.abas button[data-aba="auditoria"]')
await p.waitForSelector('#drop-livros')
await pausa(600)

/* 1. abertura */
await cartela('Radar de Auditoria',
  'A auditoria fiscal anual: compara as vendas dos livros fiscais com as vendas que o lojista informou, por CNPJ e por competência.', 5200)

await fala('O que você vai precisar',
  'Três coisas: o livro de Entradas, o livro de Saídas e a planilha com as vendas informadas. Os dados usados aqui são fictícios.')

/* 2. livros fiscais */
await aponta('#drop-livros')
await fala('Passo 1 — Livros fiscais',
  'Arraste os dois livros para esta área. Aceita PDF, SPED EFD em .txt, Excel, CSV e até foto.')
await fala('Por que os dois livros',
  'O livro de Saídas tem as vendas. O de Entradas tem as devoluções de venda, que reduzem o faturamento. Sem ele, a conta fica maior do que a realidade.')
await p.evaluate(() => document.querySelector('#drop-livros').classList.add('ativo'))
await p.evaluate(c => window.__demo.cursorCaixa(c), await caixa('#drop-livros'))
await pausa(700)
await p.setInputFiles('#in-livros', [join(demo, 'livro-entradas-2025.pdf'), join(demo, 'livro-saidas-2025.pdf')])
await p.evaluate(() => { document.querySelector('#drop-livros')?.classList.remove('ativo'); window.__demo.esconderCursor() })
await p.waitForFunction(() => document.querySelector('#progresso')?.style.display === 'none', { timeout: 120000 })
await pausa(700)

await confirmar('os dois livros foram lidos', '.arquivo:has-text("livro-saidas") .meta',
  ['Livro fiscal impresso', '2 CNPJ', '01/2025–03/2025'])
await aponta('.arquivo:has-text("livro-saidas") .meta', 6)
await fala('Confira o que foi lido',
  'Para cada arquivo o sistema mostra o formato que reconheceu, quantos lançamentos leu, os CNPJ encontrados e o intervalo de competências. Se algo aqui estiver errado, o resto estará errado também.')
await limpa()

/* 3. planilha */
await aponta('#drop-planilha')
await fala('Passo 2 — Vendas informadas',
  'Agora a planilha do que a empresa informou: CNPJ, competência e valor. O cabeçalho é reconhecido sozinho.')
await p.evaluate(() => document.querySelector('#drop-planilha').classList.add('ativo'))
await pausa(500)
await p.setInputFiles('#in-planilha', join(demo, 'vendas-informadas.xlsx'))
await p.evaluate(() => document.querySelector('#drop-planilha')?.classList.remove('ativo'))
await pausa(1400)
await limpa()

const detalhes = 'div[data-tipo="planilha"] details summary'
if (await p.$(detalhes)) {
  await cliqueVisivel(detalhes)
  await aponta('div[data-tipo="planilha"] details .opcoes', 6)
  await fala('Se a coluna errada for escolhida',
    'Abra o mapeamento e aponte na mão qual coluna é o CNPJ, qual é a competência e qual é o valor.')
  await limpa()
  await cliqueVisivel(detalhes)
}

/* 4. parâmetros */
await p.evaluate(() => document.querySelector('#p-tolR').scrollIntoView({ block: 'center' }))
await pausa(700)
await aponta('.painel:last-of-type .grade2', 10)
await fala('Passo 3 — Tolerância',
  'Aqui você decide a partir de quanto uma diferença importa. Abaixo da tolerância o mês fica OK; entre ela e o limite, ATENÇÃO; acima, DIVERGENTE.')
await limpa()
await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
await pausa(900)

/* 5. conciliação */
await cliqueVisivel('nav.subabas button[data-subaba="resultado"]')
await p.waitForSelector('tbody tr')
await pausa(500)
await aponta('.cards', 10)
await fala('O resultado, em uma olhada',
  'O total pelo livro, o total informado, a diferença entre os dois e quantos meses precisam de atenção.')
await limpa()

await confirmar('janeiro fecha em 115.500', linhaDe('01/2025', '0001-81'),
  ['R$ 120.000,00', 'R$ 4.500,00', 'R$ 115.500,00', 'OK'])
await aponta(linhaDe('01/2025', '0001-81'), 4)
await fala('Um mês que fecha',
  'Vendas brutas de 120 mil, menos 4.500 de devolução, dá 115.500 — exatamente o que a planilha informa. Status OK.')

await confirmar('fevereiro diverge em 40 mil', linhaDe('02/2025', '0001-81'),
  ['R$ 138.500,00', 'R$ 98.500,00', 'R$ 40.000,00', 'DIVERGENTE'])
await aponta(linhaDe('02/2025', '0001-81'), 4)
await fala('Um mês que não fecha',
  'O livro registra 138.500 e a planilha informa 98.500. Faltam 40 mil, ou quase 29%.')
await fala('Onde foi parar',
  'Na coluna Detalhe, esses 40 mil estão em CFOP 5405 — venda com substituição tributária. É venda, mas ficou fora da planilha. Erro comum.')

await confirmar('filial em janeiro fica em ATENÇÃO', linhaDe('01/2025', '0002-62'),
  ['R$ 45.000,00', 'R$ 45.900,00', 'ATENÇÃO'])
await aponta(linhaDe('01/2025', '0002-62'), 4)
await fala('Diferença pequena',
  'Aqui faltam 900 reais em 45 mil, menos de 2%. Vira ATENÇÃO, não DIVERGENTE: normalmente é desconto ou arredondamento.')

await confirmar('fevereiro da filial só existe no livro', linhaDe('02/2025', '0002-62'),
  ['R$ 52.000,00', 'SÓ NA APURAÇÃO'])
await aponta(linhaDe('02/2025', '0002-62'), 4)
await fala('Venda sem nada informado',
  'SÓ NA APURAÇÃO quer dizer que houve venda escriturada e a planilha não trouxe esse mês. Este é o caso que mais merece explicação.')
await limpa()

/* 6. detalhe por CFOP */
await cliqueVisivel('nav.subabas button[data-subaba="detalhe"]')
await pausa(600)
await fala('De onde cada número veio',
  'Esta aba abre todo CFOP lido e diz o que ele fez com o resultado: se somou, se deduziu ou se foi ignorado.')

await p.evaluate(() => {
  const tr = [...document.querySelectorAll('#conteudo tbody tr')].find(t => t.textContent.includes('5910'))
  tr?.scrollIntoView({ block: 'center' })
})
await pausa(800)
await confirmar('5910 não soma', '#conteudo tbody tr:has(code:text-is("5910"))',
  ['Remessa em bonificação', 'Não é venda'])
await aponta('#conteudo tbody tr:has(code:text-is("5910"))', 4)
await fala('O que não é venda',
  'Remessa em bonificação sai mercadoria, mas não entra dinheiro. Não soma.')
await confirmar('5949 exige revisão', '#conteudo tbody tr:has(code:text-is("5949"))',
  ['Outra saída', 'revisão manual'])
await aponta('#conteudo tbody tr:has(code:text-is("5949"))', 4)
await fala('O código que ninguém deve chutar',
  'O 5949 é "outra saída não especificada". Genérico demais: o sistema deixa de fora e avisa, para você decidir.')

await p.evaluate(() => {
  const tr = [...document.querySelectorAll('#conteudo tbody tr')].find(t => t.textContent.includes('5929'))
  tr?.scrollIntoView({ block: 'center' })
})
await pausa(800)
await confirmar('5929 é contra-lançamento', '#conteudo tbody tr:has(code:text-is("5929"))',
  ['R$ 110.250,00', 'Contra-lançamento'])
await aponta('#conteudo tbody tr:has(code:text-is("5929"))', 4)
await fala('O que dobraria o faturamento',
  'O 5929 é o espelho de uma venda já registrada no cupom fiscal. Somar os dois contaria a mesma venda duas vezes. Fica de fora.')
await limpa()

/* 7. mudar uma regra */
await cliqueVisivel('nav.abas button[data-aba="tabela"]')
await p.waitForSelector('#tab-cfop')
await fala('Discorda de alguma regra?',
  'A classificação é editável. Se na sua operação o 5949 é venda, mude aqui e o cálculo refaz na hora.')
await p.fill('#busca-cfop', '5949')
await pausa(900)
await p.evaluate(() => document.querySelector('tr[data-cfop="5949"]')?.scrollIntoView({ block: 'center' }))
await pausa(500)
await aponta('tr[data-cfop="5949"]', 4)
await pausa(600)
await p.selectOption('[data-override="5949"]', 'VENDA')
await pausa(1100)
await limpa()

await cliqueVisivel('nav.abas button[data-aba="auditoria"]')
await cliqueVisivel('nav.subabas button[data-subaba="resultado"]')
await p.waitForSelector('tbody tr')
await confirmar('janeiro recalculado para 117.000', linhaDe('01/2025', '0001-81'),
  ['R$ 121.500,00', 'R$ 117.000,00', 'ATENÇÃO'])
await aponta(linhaDe('01/2025', '0001-81'), 4)
await fala('O efeito é imediato',
  'Com o 5949 somando, janeiro passou de 115.500 para 117 mil e deixou de bater. A regra fica salva só no seu navegador.')
await limpa()

await cliqueVisivel('nav.abas button[data-aba="tabela"]')
await p.waitForSelector('#limpar-overrides')
await cliqueVisivel('#limpar-overrides')
await pausa(700)
await confirmar('a regra padrão do 5949 voltou', 'tr[data-cfop="5949"]', ['revisão manual'])

/* 8. exportar */
await cliqueVisivel('nav.abas button[data-aba="auditoria"]')
await cliqueVisivel('nav.subabas button[data-subaba="resultado"]')
await p.waitForSelector('#exp-conc')
await aponta('#exp-conc', 6)
await fala('Levar para o Excel',
  'Os dois botões exportam CSV: um com a conciliação mês a mês, outro com o detalhe de cada CFOP.')
await limpa()

/* 9. fechamento */
await p.evaluate(() => window.__demo.legenda('', ''))
await pausa(400)
await cartela('Antes de concluir qualquer coisa',
  'A ferramenta compara livro com planilha. Ela aponta onde olhar — não prova que o livro reflete as vendas reais, e não substitui a análise do seu contador.', 7000)

await p.evaluate(() => window.__demo.legenda('', ''))
await pausa(900)

if (erros.length) console.warn('erros de página:', erros)

const video = p.video()
await ctx.close()
await navegador.close()

/* ------------------------------------------------------------ pós-produção */

const origem = await video.path()
const cru = join(demo, '.bruto.webm')
renameSync(origem, cru)

if (RAPIDO) {
  rmSync(cru, { force: true })
  console.log('ensaio concluído — nada foi gerado')
} else if (FFMPEG) {
  // Duas codificações: o navegador escolhe a primeira que souber tocar.
  const webm = join(demo, 'apurador-fiscal-passo-a-passo.webm')
  const mp4 = join(demo, 'apurador-fiscal-passo-a-passo.mp4')
  console.log('convertendo (VP9 leva alguns minutos)…')
  execFileSync(FFMPEG, ['-y', '-i', cru, '-c:v', 'libvpx-vp9', '-crf', '34', '-b:v', '0',
    '-row-mt', '1', '-tile-columns', '2', '-threads', '8', '-deadline', 'good', '-cpu-used', '2',
    '-pix_fmt', 'yuv420p', '-vf', 'fps=24', webm], { stdio: 'pipe' })
  execFileSync(FFMPEG, ['-y', '-i', cru, '-c:v', 'libx264', '-preset', 'slow', '-crf', '23',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-vf', 'fps=24', mp4], { stdio: 'pipe' })
  rmSync(cru, { force: true })
  console.log('gerado:', webm)
  console.log('gerado:', mp4)
} else {
  renameSync(cru, join(demo, 'apurador-fiscal-passo-a-passo.webm'))
  console.log('ffmpeg não encontrado — ficou só a gravação bruta em webm')
}
rmSync(bruto, { recursive: true, force: true })
readdirSync(demo).forEach(f => console.log('  demo/' + f))
