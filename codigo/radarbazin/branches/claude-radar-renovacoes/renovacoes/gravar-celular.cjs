/* Vídeo vertical "tela de celular": captura quadros nítidos (DPR 2) do painel em 390×844, com legendas e toque visível,
   e monta o MP4 dentro de uma moldura de celular. Uso: node gravar-celular.cjs [saida.mp4]  (precisa de ffmpeg e Playwright) */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os'); const { execSync } = require('child_process')
const REN = __dirname
const SCR = process.env.SCR || os.tmpdir()
const XLSX_LOCAL = process.env.XLSX_LOCAL // cópia local da biblioteca, quando o cdnjs não está acessível
const saida = process.argv[2] || path.join(REN, 'radar-renovacoes-celular.mp4')
const html = fs.readFileSync(path.join(REN, 'radar-renovacoes.html'), 'utf8')
const espera = (ms) => new Promise(r => setTimeout(r, ms))
;(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }).catch(() => chromium.launch())
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'pt-BR', colorScheme: 'light' })
  const p = await ctx.newPage()
  if (XLSX_LOCAL) await p.route('**/xlsx.full.min.js', r => r.fulfill({ path: XLSX_LOCAL, contentType: 'application/javascript' }))
  await p.setContent('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + html + '</body></html>', { waitUntil: 'load' })
  await p.waitForTimeout(1500)
  await p.evaluate(() => {
    const st = document.createElement('style'); st.textContent = `
      #leg{position:fixed;left:12px;right:12px;bottom:18px;background:rgba(13,30,34,.93);color:#fff;font:600 14.5px/1.35 "IBM Plex Sans",system-ui,sans-serif;padding:11px 14px;border-radius:12px;z-index:9999;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.35);opacity:0;transition:opacity .25s;pointer-events:none}
      #leg.on{opacity:1} #leg b{color:#8fe3f0}
      #cur{position:fixed;width:30px;height:30px;border-radius:99px;background:rgba(0,97,111,.28);border:2px solid #00616f;z-index:9998;pointer-events:none;transform:translate(-50%,-50%);transition:left .3s ease,top .3s ease;left:-100px;top:-100px}
      #cur.click{animation:pulso .45s ease}
      @keyframes pulso{0%{transform:translate(-50%,-50%) scale(1)}40%{transform:translate(-50%,-50%) scale(.5)}100%{transform:translate(-50%,-50%) scale(1)}}
      #tit{position:fixed;inset:0;background:#0d1e22;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:10000;font-family:"Archivo",system-ui,sans-serif;text-align:center;padding:28px;transition:opacity .5s}
      #tit h1{font-size:30px;margin:0;letter-spacing:-.5px} #tit p{font:400 15px/1.5 "IBM Plex Sans",system-ui,sans-serif;color:#b9d6dc;margin:0}
      #tit .faixa{font:600 11px "IBM Plex Mono",monospace;letter-spacing:.12em;color:#8fe3f0;text-transform:uppercase}
      html{scroll-behavior:auto}`
    document.head.append(st)
    const leg = document.createElement('div'); leg.id = 'leg'; document.body.append(leg)
    const cur = document.createElement('div'); cur.id = 'cur'; document.body.append(cur)
    const tit = document.createElement('div'); tit.id = 'tit'; tit.innerHTML = '<div class="faixa">Passo a passo no celular · dados fictícios · sem áudio</div><h1>Radar de Renovações</h1><p>Como usar o app: da planilha de cadastro ao pacote do comitê.</p>'; document.body.append(tit)
    window.__leg = (t) => { leg.innerHTML = t; leg.classList.add('on') }
    window.__legOff = () => leg.classList.remove('on')
    window.__cur = (x, y, click) => { cur.style.left = x + 'px'; cur.style.top = y + 'px'; if (click) { cur.classList.remove('click'); void cur.offsetWidth; cur.classList.add('click') } }
    window.__tit = (h) => { if (h) { tit.innerHTML = h; tit.style.opacity = 1 } else { tit.style.opacity = 0; tit.style.pointerEvents = 'none' } }
  })
  // captura contínua de quadros (jpeg) com carimbo de tempo
  const frames = []; let gravando = true; const t0 = Date.now()
  const loop = (async () => { while (gravando) { try { const buf = await p.screenshot({ type: 'jpeg', quality: 86 }); frames.push({ t: Date.now() - t0, buf }) } catch (e) {} await espera(60) } })()
  const leg = async (t, ms = 3200) => { await p.evaluate(t => window.__leg(t), t); await espera(ms) }
  const centro = async (sel) => { const h = p.locator(sel).first(); await h.scrollIntoViewIfNeeded(); await espera(350); const bb = await h.boundingBox(); return bb ? { x: bb.x + Math.min(bb.width / 2, 120), y: bb.y + bb.height / 2 } : null }
  const tocar = async (sel) => { const c = await centro(sel); if (!c) return; await p.evaluate(c => window.__cur(c.x, c.y, true), c); await espera(250); await p.locator(sel).first().click(); await espera(650) }
  const aba = async (n) => { await p.evaluate(() => window.scrollTo(0, 0)); await espera(200); await tocar(`nav.abas button[data-aba="${n}"]`) }
  const rolarAte = async (sel, ms = 2200) => { await p.locator(sel).first().scrollIntoViewIfNeeded(); await espera(ms) }
  const rolarSuave = async (px, passos = 8, ms = 90) => { for (let i = 0; i < passos; i++) { await p.evaluate(d => window.scrollBy(0, d), px / passos); await espera(ms) } }

  await espera(3000); await p.evaluate(() => window.__tit(null)); await espera(500)
  await p.fill('#hoje', '2026-10-25'); await p.dispatchEvent('#hoje', 'change')
  // 1 Parâmetros
  await aba('params'); await leg('<b>1 · Parâmetros</b> — shopping, médias de AMM/m² e Vendas/m² das satélites, inflação e meta de LSR. Sem as médias não há quadrante.', 3800)
  await rolarSuave(300); await espera(900)
  // 2 Cadastro + Excel
  await aba('cadastro'); await leg('<b>2 · Cadastro</b> — vamos limpar o exemplo e importar a base de teste em Excel (abas Lojas, Parametros e Historico).', 3600)
  await tocar('#btnLimpar'); await tocar('#btnLimparOk'); await espera(500)
  const cb = await centro('#btnExcel'); if (cb) await p.evaluate(c => window.__cur(c.x, c.y, true), cb)
  await p.setInputFiles('#xlsxFile', path.join(REN, 'base-teste', 'base-teste.xlsx')); await espera(900)
  await rolarAte('#excelOut', 500); await leg('25 lojas, parâmetros e 359 meses de histórico lidos. LUC repetido atualiza; o que falta vira <b>[FALTA]</b>, nunca estimativa.', 4200)
  // 3 Auditoria
  await aba('auditoria'); await leg('<b>3 · Auditoria</b> — agenda para o Radar de Auditoria: quem precisa de integral e em que janela.', 3600)
  await rolarAte('#agenda', 600); await rolarSuave(260); await espera(1200)
  await rolarAte('#csvDisp', 400); await leg('A volta do Radar de Dispersão: o CSV casa por CNPJ. Dispersão acima de 15% bloqueia a negociação.', 3400)
  const cc = await centro('#csvDisp'); if (cc) await p.evaluate(c => window.__cur(c.x, c.y, true), cc)
  await p.setInputFiles('#csvDisp', path.join(REN, 'base-teste', 'dispersao-teste.csv')); await espera(600); await rolarAte('#csvOut', 2600)
  // 4 Radar
  await aba('radar'); await leg('<b>4 · Radar</b> — KPIs do ano e a fila priorizada por farol: Negociar, Preparar, Bloqueado, Aguardar, Renovado.', 4000)
  await rolarSuave(420, 10); await espera(800)
  await rolarAte('#fFarol', 400); await p.selectOption('#fFarol', 'verde'); await leg('Filtro <b>Negociar</b>: só quem está na janela e sem bloqueio. A ordem é ganho em 60 meses × urgência × peso do mix.', 3600)
  await rolarSuave(500, 10); await espera(1200); await p.selectOption('#fFarol', ''); await espera(300)
  await rolarAte('#quadChart', 400); await leg('Mapa de quadrantes: AMM/m² × Vendas/m² contra a média das satélites. Q1 vende bem e paga pouco: maior espaço de LSR.', 4200)
  // 5 Análise T-101
  await p.evaluate(() => window.scrollTo(0, 0)); await tocar('#fBusca'); await p.fill('#fBusca', 'T-101'); await espera(600)
  await tocar('#fila tbody tr'); await espera(600); await p.evaluate(() => window.scrollTo(0, 0))
  await leg('<b>5 · Análise da loja</b> — farol, AMM atual, LSR total, AMM proposto, ganho em 60 meses e nota de confiança.', 4000)
  await rolarSuave(520, 10); await leg('As 7 fases do Book: classificação, janela, due diligence com a trava de auditoria, alçadas.', 3800)
  await rolarAte('#analise section:nth-of-type(3)', 300); await leg('Histórico desde a última renovação: vendas, AMM, A% e CO/Vendas por ano de contrato, com o gráfico mensal.', 4200)
  await rolarSuave(420, 10); await espera(600)
  await rolarAte('#analise section:nth-of-type(4)', 300); await leg('Os argumentos com memória de cálculo: A% (só se já paga variável), CO/Vendas, entorno/piso/tamanho, pares e a queda do CO/Vendas.', 4600)
  await rolarSuave(500, 10); await espera(600)
  await rolarAte('#analise section:nth-of-type(5)', 300); await leg('<b>LSR real</b> pela matriz mix × quadrante, mais inflação, contra a Tabela ABC e o teste do perito.', 4200)
  await rolarAte('#analise section:nth-of-type(6)', 300); await leg('Risco renovatório, ações em checklist e dados faltantes.', 3200)
  await p.evaluate(() => window.scrollTo(0, 0)); await tocar('#btnCopiarObsidian'); await leg('<b>Copiar análise (Obsidian)</b> gera a nota no formato da skill.', 2800)
  // 6 Planejamento
  await aba('plano'); await leg('<b>6 · Planejamento anual</b> — LSR planejado × realizado, meta, incremento por mês e contratos vencidos.', 4000)
  await rolarSuave(600, 12); await espera(1200)
  // 7 Comitê
  await aba('comite'); await leg('<b>7 · Comitê</b> — o pacote em Markdown com as lojas em negociação para a reunião semanal. A decisão de valor é do comitê.', 4000)
  await tocar('#btnCopiarComite'); await espera(1000)
  // 8 Ajuda
  await aba('ajuda'); await leg('<b>Ajuda</b> — este vídeo, o que o sistema faz, onde os dados ficam e o que é do Book ou do sistema.', 3400)
  await p.evaluate(() => window.__legOff()); await espera(300)
  await p.evaluate(() => window.__tit('<div class="faixa">Radar de Renovações</div><h1>Pronto para testar</h1><p>Base de teste: base-teste.xlsx + dispersao-teste.csv. Resultados esperados em guia-de-teste.md.</p>'))
  await p.evaluate(() => { document.getElementById('tit').style.pointerEvents = 'auto' }); await espera(3000)
  gravando = false; await loop; await ctx.close(); await b.close()
  // monta o vídeo: quadros com duração real + moldura de celular
  const dir = fs.mkdtempSync(path.join(SCR, 'cel-')); const lista = []
  frames.forEach((f, i) => { const n = path.join(dir, `f${String(i).padStart(5, '0')}.jpg`); fs.writeFileSync(n, f.buf); const dur = (i + 1 < frames.length ? frames[i + 1].t - f.t : 100) / 1000; lista.push(`file '${n}'`, `duration ${Math.max(0.02, dur).toFixed(3)}`) })
  lista.push(`file '${path.join(dir, `f${String(frames.length - 1).padStart(5, '0')}.jpg`)}'`)
  fs.writeFileSync(path.join(dir, 'lista.txt'), lista.join('\n'))
  execSync(`python3 "${path.join(REN, 'moldura-celular.py')}" "${dir}"`)
  execSync(`ffmpeg -v error -y -i "${path.join(dir, 'moldura.png')}" -i "${path.join(dir, 'mascara.png')}" -f concat -safe 0 -i "${path.join(dir, 'lista.txt')}" -filter_complex "[2:v]scale=780:1688:flags=lanczos,format=rgba[v];[v][1:v]alphamerge[va];[0:v][va]overlay=60:106:format=auto,format=yuv420p" -r 25 -c:v libx264 -preset medium -crf 22 -movflags +faststart -an "${saida}"`)
  console.log('gravado', saida, frames.length, 'quadros,', ((frames[frames.length - 1].t) / 1000).toFixed(0), 's')
})().catch(e => { console.error('FALHA', e); process.exit(1) })
