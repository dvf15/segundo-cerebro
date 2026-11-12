#!/usr/bin/env node
/**
 * A "câmera" dos vídeos verticais (9:16, 1080×1920): abre o app num Chromium de
 * verdade, grava, põe a narração (legenda e voz) e os destaques na tela, e no
 * fim faz a pós-produção em H.264 com a trilha de voz. Cada vídeo é só um
 * roteiro que usa estas peças:
 *
 *   scripts/gravar-video-celular.mjs   o passo a passo completo
 *   scripts/gravar-video-novidades.mjs só as mudanças mais recentes
 *
 * Nada é encenado: a narração confere na tela cada número que afirma — se o
 * sistema mudar e o roteiro passar a dizer algo falso, a gravação para.
 *
 * Por que zoom em vez de viewport de celular: o Playwright grava o vídeo no
 * tamanho do viewport em pixels CSS, ignorando deviceScaleFactor. Um viewport
 * de 432 px sairia borrado ao ampliar para 1080. Então o viewport é 1080×1920
 * de verdade e o <body> recebe zoom 2.5 — o layout se comporta como uma tela
 * de 432 px e cada pixel gravado é um pixel nítido. A camada de narração fica
 * fora do <body>, sem zoom, para as coordenadas do Playwright baterem.
 *
 * RAPIDO=1 ensaia (só as conferências, sem gerar vídeo); SEM_AUDIO=1 grava sem voz.
 */
import { chromium } from 'playwright'
import { existsSync, mkdirSync, rmSync, readdirSync, renameSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'
import { caminhoChromium } from './chromium.mjs'
import { sintetizar, montarTrilha, mixar, duracaoVideo, caminhoVoz, piperDisponivel } from './narracao.mjs'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const demo = join(raiz, 'demo')
const LARGURA = 1080; const ALTURA = 1920
const ZOOM = 2.5                       // 1080 / 2.5 = 432 px CSS: largura de um celular grande

const FFMPEG = [process.env.FFMPEG_PATH, '/usr/bin/ffmpeg', '/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux']
  .find(p => p && existsSync(p))
const FFPROBE = FFMPEG ? FFMPEG.replace(/ffmpeg(-linux)?$/, (m, l) => 'ffprobe' + (l || '')) : null

/**
 * Narração em áudio (padrão). SEM_AUDIO=1 grava só com legendas. Precisa do
 * Piper (pip install piper-tts) e da voz (node scripts/baixar-voz.mjs).
 */
const NARRAR = !process.env.SEM_AUDIO
if (NARRAR) {
  if (!piperDisponivel()) { console.error('piper não encontrado — pip install piper-tts, ou SEM_AUDIO=1'); process.exit(2) }
  if (!existsSync(caminhoVoz(raiz))) { console.error('voz não encontrada — rode: node scripts/baixar-voz.mjs (ou SEM_AUDIO=1)'); process.exit(2) }
}

/* ------------------------------------------------ camada de narração na tela */

const OVERLAY = (ZOOM) => {
  if (!document.body) {
    document.addEventListener('DOMContentLoaded', () => instalar(), { once: true })
    return
  }
  instalar()

  function instalar () {
    document.body.style.zoom = String(ZOOM)
    const css = document.createElement('style')
    css.textContent = `
      /* as regras de celular do ui.css dependem de media query, que o zoom não engana */
      .wrap{padding:0 16px 60px} section.painel{padding:14px;border-radius:10px}
      .rolagem{margin:0 -14px;padding:0 14px} h1{font-size:17px} .card .val{font-size:17px}
      html{scroll-behavior:auto}

      #nar{position:fixed;left:0;right:0;bottom:0;z-index:99999;padding:60px 44px 64px;
        background:linear-gradient(to top,rgba(8,12,18,.97) 62%,rgba(8,12,18,0));color:#fff;
        font:36px/1.42 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
        opacity:0;transition:opacity .35s;pointer-events:none}
      #nar.on{opacity:1}
      #nar b{display:block;font-size:24px;letter-spacing:2px;text-transform:uppercase;
        color:#7dc4ff;margin-bottom:10px;font-weight:700}
      #nar span{display:block}
      #anel{position:fixed;z-index:99998;border:6px solid #ffc53d;border-radius:18px;
        box-shadow:0 0 0 9999px rgba(8,12,18,.45),0 0 40px rgba(255,197,61,.7);
        opacity:0;transition:all .4s cubic-bezier(.4,0,.2,1);pointer-events:none}
      #anel.on{opacity:1}
      #cur{position:fixed;z-index:99999;width:64px;height:64px;margin:-32px 0 0 -32px;
        border-radius:50%;background:rgba(255,197,61,.35);border:5px solid #ffc53d;
        opacity:0;transition:transform .55s cubic-bezier(.4,0,.2,1),opacity .25s;pointer-events:none}
      #cur.on{opacity:1}
      #cur.clique{animation:pulso .45s ease-out}
      @keyframes pulso{0%{transform:scale(1)}45%{transform:scale(.55)}100%{transform:scale(1)}}
      #titulo{position:fixed;inset:0;z-index:100000;background:#0b1118;color:#fff;display:flex;
        flex-direction:column;align-items:center;justify-content:center;gap:34px;text-align:center;
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
        opacity:0;transition:opacity .5s;pointer-events:none;padding:0 80px}
      #titulo.on{opacity:1}
      #titulo h2{font-size:78px;margin:0;letter-spacing:-1.5px;line-height:1.1}
      #titulo p{font-size:40px;margin:0;color:#9db4c8;line-height:1.5;white-space:pre-line}
      #ficha{position:fixed;inset:0;z-index:100000;background:#0b1118;color:#fff;display:flex;
        flex-direction:column;justify-content:center;gap:40px;padding:0 60px;
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
        opacity:0;transition:opacity .5s;pointer-events:none}
      #ficha.on{opacity:1}
      #ficha h2{font-size:58px;margin:0;text-align:center;letter-spacing:-1px;line-height:1.15}
      #ficha table{border-collapse:separate;border-spacing:0;width:100%;font-size:30px;background:#fff;color:#16202b;
        border-radius:18px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.5)}
      #ficha th{background:#e7f0fa;color:#0b5fa5;text-align:left;padding:20px 22px;font-size:24px;
        text-transform:uppercase;letter-spacing:1px}
      #ficha td{padding:18px 22px;border-top:1px solid #e3e6ea;font-variant-numeric:tabular-nums;white-space:nowrap}
      #ficha td.n{text-align:right}
      #ficha p{font-size:34px;color:#9db4c8;margin:0;text-align:center;line-height:1.5;white-space:pre-line}`
    document.head.appendChild(css)
    // fora do <body>: o body tem zoom, a narração não pode ter
    const add = (id, html) => { const d = document.createElement('div'); d.id = id; if (html) d.innerHTML = html; document.documentElement.appendChild(d); return d }
    const nar = add('nar', '<b></b><span></span>')
    const anel = add('anel'); const cur = add('cur')
    const tit = add('titulo', '<h2></h2><p></p>')
    const fic = add('ficha', '<h2></h2><table></table><p></p>')
    const esc = (s) => String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))

    window.__demo = {
      legenda (titulo, texto) {
        nar.querySelector('b').textContent = titulo || ''
        nar.querySelector('span').textContent = texto || ''
        nar.classList.toggle('on', !!(titulo || texto))
      },
      destacarCaixa (r, margem = 8) {
        if (!r) { anel.classList.remove('on'); return false }
        // uma linha de tabela é mais larga que a tela: o anel para na borda
        const x = Math.max(r.x - margem, 10)
        const fim = Math.min(r.x + r.width + margem, innerWidth - 10)
        Object.assign(anel.style, {
          top: (r.y - margem) + 'px', left: x + 'px',
          width: (fim - x) + 'px', height: (r.height + margem * 2) + 'px',
        })
        anel.classList.add('on')
        return true
      },
      limpar () { anel.classList.remove('on') },
      cursorCaixa (r) {
        if (!r) return null
        const x = Math.min(r.x + r.width / 2, innerWidth - 40); const y = r.y + r.height / 2
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
      ficha (h, colunas, linhas, rodape) {
        if (!h) { fic.classList.remove('on'); return }
        fic.querySelector('h2').textContent = h
        fic.querySelector('table').innerHTML =
          `<thead><tr>${colunas.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead>` +
          `<tbody>${linhas.map(l => `<tr>${l.map((c, i) => `<td class="${i === l.length - 1 ? 'n' : ''}">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>`
        fic.querySelector('p').textContent = rodape || ''
        fic.classList.add('on')
      },
      /** Rola de ponta a ponta o contêiner horizontal que contém o elemento. */
      varrer (el, ms) {
        return new Promise(res => {
          const c = el.closest('.rolagem')
          if (!c) return res(false)
          const max = c.scrollWidth - c.clientWidth
          if (max <= 2) return res(false)
          const t0 = performance.now()
          const passo = (t) => {
            const k = Math.min(1, (t - t0) / ms)
            const e = k < 0.5 ? 2 * k * k : -1 + (4 - 2 * k) * k
            c.scrollLeft = max * e
            if (k < 1) requestAnimationFrame(passo); else res(true)
          }
          requestAnimationFrame(passo)
        })
      },
      voltar (el) { const c = el.closest('.rolagem'); if (c) c.scrollLeft = 0 },
    }
  }
}

/**
 * Abre a gravação. `nome` é o arquivo final (demo/<nome>.mp4); `arquivos`, os
 * de demo/ que o roteiro usa (conferidos antes de abrir o navegador).
 * Devolve as peças do roteiro e `finalizar()`, que fecha e faz a pós-produção.
 */
export async function gravacao ({ nome, arquivos = [] }) {
  for (const f of arquivos) {
    if (!existsSync(join(demo, f))) {
      console.error(`falta demo/${f} — rode antes: node scripts/gerar-demo.mjs`)
      process.exit(2)
    }
  }
  const bruto = join(demo, '.gravacao-' + nome)
  rmSync(bruto, { recursive: true, force: true })
  mkdirSync(bruto, { recursive: true })

  // o navegador em português: sem isso o campo de data aparece como mm/dd/aaaa mesmo com locale pt-BR
  const navegador = await chromium.launch({ executablePath: caminhoChromium(), args: ['--lang=pt-BR'],
    env: { ...process.env, LANG: 'pt_BR.UTF-8', LANGUAGE: 'pt_BR' } })
  const ctx = await navegador.newContext({
    viewport: { width: LARGURA, height: ALTURA },
    recordVideo: { dir: bruto, size: { width: LARGURA, height: ALTURA } },
    deviceScaleFactor: 1,
    locale: 'pt-BR', timezoneId: 'America/Sao_Paulo',   // datas dd/mm/aaaa nos campos
  })
  const p = await ctx.newPage()
  const t0 = Date.now()            // o vídeo começa a ser gravado junto com a página
  const narracao = []              // { segundo, wav } — onde cada trecho entra na trilha
  const erros = []
  p.on('pageerror', e => erros.push(e.message))
  p.on('dialog', d => d.accept())   // nenhum confirm() nativo é esperado; se surgir um, não trava a gravação

  /**
   * RAPIDO=1 ensaia o roteiro em um décimo do tempo, só para as conferências
   * rodarem, sem esperar dez minutos para descobrir que uma narração envelheceu.
   */
  const RAPIDO = !!process.env.RAPIDO
  const pausa = (ms) => p.waitForTimeout(RAPIDO ? Math.min(ms, 120) : ms)
  /** Tempo de leitura: no celular a letra é maior e a leitura, mais lenta. */
  const leitura = (t) => RAPIDO ? 150 : Math.min(12000, Math.max(2800, Math.round(String(t).length / 14 * 1000) + 1200))

  /**
   * Põe a legenda e, com narração, começa a voz no mesmo instante; espera o
   * maior entre o tempo de leitura e o da fala. Devolve quanto a voz dura.
   */
  function narrar (texto) {
    if (!NARRAR) return 0
    const { wav, segundos } = sintetizar(texto, raiz)
    if (!RAPIDO) narracao.push({ segundo: (Date.now() - t0) / 1000, wav })
    return segundos
  }
  async function fala (titulo, texto, extra = 0) {
    await p.evaluate(([t, x]) => window.__demo.legenda(t, x), [titulo, texto])
    const voz = narrar(texto)
    await pausa(Math.max(leitura(texto), Math.round(voz * 1000) + 700) + extra)
  }
  async function caixa (sel) {
    const loc = p.locator(sel).first()
    if (!await loc.count()) { console.warn('  (não encontrei na tela:', sel + ')'); return null }
    return await loc.boundingBox()
  }
  const FAIXA_LEGENDA = 360   // altura reservada para a narração no rodapé

  /**
   * Destaca um elemento. Rola antes (nos dois eixos), porque boundingBox() não
   * rola: medir um elemento fora da tela desenha o anel em cima de outra coisa.
   */
  async function aponta (sel, margem) {
    const loc = p.locator(sel).first()
    if (!await loc.count()) { console.warn('  (não encontrei na tela:', sel + ')'); return }
    await loc.evaluate(el => el.scrollIntoView({ block: 'center', inline: 'start' }))
    await pausa(420)
    let r = await loc.boundingBox()
    if (r && r.y + r.height > ALTURA - FAIXA_LEGENDA) {
      await p.evaluate(d => window.scrollBy(0, d), r.y + r.height - (ALTURA - FAIXA_LEGENDA) + 30)
      await pausa(360)
      r = await loc.boundingBox()
    }
    await p.evaluate(([c, m]) => window.__demo.destacarCaixa(c, m), [r, margem ?? 8])
    await pausa(430)
  }
  const limpa = () => p.evaluate(() => window.__demo.limpar())

  /** Narra enquanto passeia pela linha da tabela, como um dedo arrastando. */
  async function falaVarrendo (titulo, texto, sel) {
    await p.evaluate(([t, x]) => window.__demo.legenda(t, x), [titulo, texto])
    const voz = narrar(texto)
    const ms = Math.max(leitura(texto), Math.round(voz * 1000) + 700)
    await pausa(700)
    await p.locator(sel).first().evaluate((el, ms) => window.__demo.varrer(el, ms), Math.max(1800, ms - 1400))
    await pausa(900)
    await p.locator(sel).first().evaluate(el => window.__demo.voltar(el))
  }

  async function cliqueVisivel (sel) {
    await p.evaluate(() => { window.__demo.legenda('', ''); window.__demo.limpar() })
    await pausa(300)
    const loc = p.locator(sel).first()
    if (await loc.count()) await loc.evaluate(el => el.scrollIntoView({ block: 'center', inline: 'nearest' }))
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
  /** Responde Confirmar na janela de confirmação do app (desenhada na página, não o confirm() do navegador). */
  async function aceitar () {
    await p.waitForSelector('dialog.pergunta[open]')
    await pausa(900)
    await cliqueVisivel('dialog.pergunta[open] button[value="sim"]')
    await pausa(300)
  }
  async function confirmar (oQue, sel, esperado) {
    const texto = (await p.locator(sel).first().innerText()).replace(/\s+/g, ' ')
    const faltando = [].concat(esperado).filter(e => !texto.includes(e))
    if (faltando.length) {
      throw new Error(`a narração diz "${oQue}", mas a tela não mostra ${faltando.map(f => JSON.stringify(f)).join(', ')}\n  tela: ${texto.slice(0, 300)}`)
    }
    console.log('  ✓', oQue)
  }
  async function cartela (h, texto, ms) {
    await p.evaluate(([a, b]) => window.__demo.titulo(a, b), [h, texto])
    const voz = narrar(h + '. ' + texto)
    await pausa(Math.max(ms, Math.round(voz * 1000) + 900))
    await p.evaluate(() => window.__demo.titulo('', ''))
    await pausa(600)
  }
  async function ficha (h, colunas, linhas, rodape, ms) {
    await p.evaluate(([h, c, l, r]) => window.__demo.ficha(h, c, l, r), [h, colunas, linhas, rodape])
    const voz = narrar(h + '. ' + rodape)
    await pausa(Math.max(ms, Math.round(voz * 1000) + 900))
    await p.evaluate(() => window.__demo.ficha(''))
    await pausa(600)
  }
  async function topo () { await p.evaluate(() => window.scrollTo(0, 0)); await pausa(500) }
  const SUBABAS = ['dados', 'resultado', 'detalhe']   // vivem dentro da aba Auditoria fiscal
  async function aba (nome) {
    if (SUBABAS.includes(nome)) {
      if (await p.locator('nav.abas button[data-aba="auditoria"][aria-selected="true"]').count() === 0) {
        await cliqueVisivel('nav.abas button[data-aba="auditoria"]')
      }
      await cliqueVisivel(`nav.subabas button[data-subaba="${nome}"]`)
    } else {
      await cliqueVisivel(`nav.abas button[data-aba="${nome}"]`)
    }
    await topo()
  }
  const linhaDe = (comp, cnpjFinal, escopo = '') =>
    `${escopo} tbody tr:has(td:nth-child(2):has-text("${comp}")):has(td:nth-child(1):has-text("${cnpjFinal}"))`
  const painel = (titulo) => `.painel:has(h2:has-text("${titulo}"))`

  await p.addInitScript(OVERLAY, ZOOM)
  await p.addInitScript(() => { try { localStorage.clear() } catch {} })  // começa sempre limpo
  await p.goto(pathToFileURL(join(raiz, 'index.html')).href)
  await p.waitForSelector('nav.abas')
  await p.waitForFunction(() => !!window.__demo, null, { timeout: 15000 })
  await pausa(600)

  async function finalizar () {
    if (erros.length) console.warn('erros de página:', erros)

    const video = p.video()
    await ctx.close()
    await navegador.close()

    /* ------------------------------------------------------------ pós-produção */

    const origem = await video.path()
    const cru = join(demo, '.bruto-' + nome + '.webm')
    renameSync(origem, cru)

    if (RAPIDO) {
      rmSync(cru, { force: true })
      console.log('ensaio concluído — nada foi gerado')
    } else if (FFMPEG) {
      // Só H.264: é o que celular, WhatsApp e todo navegador atual tocam.
      const mp4 = join(demo, nome + '.mp4')
      console.log('convertendo para H.264…')
      // crf 35 com tune stillimage: tela de app é quase parada, o texto continua
      // legível e o arquivo fica abaixo dos 15 MB que a página publicada aceita.
      const mudo = NARRAR && narracao.length ? join(demo, '.mudo-' + nome + '.mp4') : mp4
      execFileSync(FFMPEG, ['-y', '-i', cru, '-c:v', 'libx264', '-preset', 'slow', '-crf', '35', '-tune', 'stillimage',
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-vf', 'fps=24', mudo], { stdio: 'pipe' })
      rmSync(cru, { force: true })
      if (mudo !== mp4) {
        // a trilha tem o tamanho exato do vídeo; cada trecho entra no segundo em que a legenda apareceu
        const trilha = montarTrilha(narracao, duracaoVideo(FFPROBE, mudo), join(demo, '.narracao', 'trilha-' + nome + '.wav'))
        mixar(FFMPEG, mudo, trilha, mp4)
        rmSync(mudo, { force: true })
        console.log(`narração: ${narracao.length} trecho(s) mixado(s)`)
      }
      console.log('gerado:', mp4)
    } else {
      renameSync(cru, join(demo, nome + '.webm'))
      console.log('ffmpeg não encontrado — ficou só a gravação bruta em webm')
    }
    rmSync(bruto, { recursive: true, force: true })
    readdirSync(demo).forEach(f => console.log('  demo/' + f))

  }

  return { p, RAPIDO, pausa, fala, aponta, caixa, limpa, falaVarrendo, cliqueVisivel, aceitar, confirmar, cartela, ficha,
    topo, aba, linhaDe, painel, finalizar }
}
