/* Vídeo "Como usar" no computador: preenchimento (parâmetros, loja campo a campo, Excel, auditoria) e análises
   (radar, loja, laudo, perícia, planejamento, comitê). Sem áudio, legendas na tela, dados fictícios.
   Uso: node gravar-como-usar.cjs  → grava .webm em $SCR e converte para radar-renovacoes-como-usar.mp4/.webm aqui. */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os'); const { execSync } = require('child_process')
const REN = __dirname, SCR = process.env.SCR || os.tmpdir(), XLSX_LOCAL = process.env.XLSX_LOCAL
const html = fs.readFileSync(path.join(REN, 'radar-renovacoes.html'), 'utf8')
const espera = (ms) => new Promise(r => setTimeout(r, ms))
;(async () => {
  const dir = fs.mkdtempSync(path.join(SCR, 'video-usar-'))
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }).catch(() => chromium.launch())
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, recordVideo: { dir, size: { width: 1280, height: 800 } }, locale: 'pt-BR', colorScheme: 'light' })
  const p = await ctx.newPage()
  if (XLSX_LOCAL) await p.route('**/xlsx.full.min.js', r => r.fulfill({ path: XLSX_LOCAL, contentType: 'application/javascript' }))
  await p.setContent('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + html + '</body></html>', { waitUntil: 'load' })
  await p.waitForTimeout(1500)
  await p.evaluate(() => {
    const st = document.createElement('style'); st.textContent = `
      #leg{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);max-width:860px;background:rgba(13,30,34,.93);color:#fff;font:600 19px/1.35 "IBM Plex Sans",system-ui,sans-serif;padding:12px 20px;border-radius:12px;z-index:9999;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.35);opacity:0;transition:opacity .25s;pointer-events:none}
      #leg.on{opacity:1} #leg b{color:#8fe3f0}
      #cur{position:fixed;width:22px;height:22px;border-radius:99px;background:rgba(0,97,111,.35);border:2px solid #00616f;z-index:9998;pointer-events:none;transform:translate(-50%,-50%);transition:left .35s ease,top .35s ease;left:-100px;top:-100px}
      #cur.click{animation:pulso .45s ease} @keyframes pulso{0%{transform:translate(-50%,-50%) scale(1)}40%{transform:translate(-50%,-50%) scale(.55)}100%{transform:translate(-50%,-50%) scale(1)}}
      #tit{position:fixed;inset:0;background:#0d1e22;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;z-index:10000;font-family:"Archivo",system-ui,sans-serif;text-align:center;padding:24px;transition:opacity .5s}
      #tit h1{font-size:46px;margin:0;letter-spacing:-.5px} #tit p{font:400 20px/1.5 "IBM Plex Sans",system-ui,sans-serif;color:#b9d6dc;margin:0;max-width:60ch} #tit .faixa{font:600 14px "IBM Plex Mono",monospace;letter-spacing:.12em;color:#8fe3f0;text-transform:uppercase}
      html{scroll-behavior:smooth}`
    document.head.append(st)
    const leg = document.createElement('div'); leg.id = 'leg'; document.body.append(leg)
    const cur = document.createElement('div'); cur.id = 'cur'; document.body.append(cur)
    const tit = document.createElement('div'); tit.id = 'tit'; tit.innerHTML = '<div class="faixa">Como usar · dados fictícios · sem áudio</div><h1>Radar de Renovações</h1><p>Parte 1: preenchimento (parâmetros, cadastro campo a campo, Excel, histórico, auditoria). Parte 2: análises (radar, loja, laudo, perícia, planejamento, comitê).</p>'; document.body.append(tit)
    window.__leg = (t) => { leg.innerHTML = t; leg.classList.add('on') }; window.__legOff = () => leg.classList.remove('on')
    window.__cur = (x, y, click) => { cur.style.left = x + 'px'; cur.style.top = y + 'px'; if (click) { cur.classList.remove('click'); void cur.offsetWidth; cur.classList.add('click') } }
    window.__tit = (h) => { if (h) { tit.innerHTML = h; tit.style.opacity = 1; tit.style.pointerEvents = 'auto' } else { tit.style.opacity = 0; tit.style.pointerEvents = 'none' } }
  })
  const leg = async (t, ms = 3400) => { await p.evaluate(t => window.__leg(t), t); await espera(ms) }
  const centro = async (sel) => { const h = p.locator(sel).first(); await h.scrollIntoViewIfNeeded(); await espera(300); const bb = await h.boundingBox(); return bb ? { x: bb.x + Math.min(bb.width / 2, 160), y: bb.y + bb.height / 2 } : null }
  const mover = async (sel) => { const c = await centro(sel); if (!c) return null; await p.evaluate(c => window.__cur(c.x, c.y, false), c); await p.mouse.move(c.x, c.y); await espera(400); return c }
  const clicar = async (sel) => { const c = await mover(sel); if (!c) return; await p.evaluate(c => window.__cur(c.x, c.y, true), c); await p.locator(sel).first().click(); await espera(600) }
  const aba = async (n) => { await p.evaluate(() => window.scrollTo({ top: 0 })); await espera(200); await clicar(`nav.abas button[data-aba="${n}"]`) }
  const topo = async () => { await p.evaluate(() => window.scrollTo({ top: 0 })); await espera(400) }
  const rolar = async (sel, ms = 2200) => { await p.locator(sel).first().scrollIntoViewIfNeeded(); await espera(ms) }
  const digitar = async (sel, txt, delay = 28) => { await mover(sel); await p.locator(sel).first().click(); await p.locator(sel).first().fill(''); await p.locator(sel).first().type(String(txt), { delay }); await espera(300) }
  const escolher = async (sel, v) => { await mover(sel); await p.selectOption(sel, v); await espera(400) }

  await espera(3400); await p.evaluate(() => window.__tit(null)); await espera(600)
  await p.fill('#hoje', '2026-10-25'); await p.dispatchEvent('#hoje', 'change')
  // ---------- PARTE 1 · PREENCHIMENTO
  await aba('params'); await leg('<b>Parte 1 · Preenchimento</b> — comece pelos Parâmetros: nome do shopping, as médias das satélites, inflação e meta de LSR.', 3200)
  await digitar('#p_shopping', 'Shopping Teste'); await digitar('#p_mediaAmm', '100'); await digitar('#p_mediaVendas', '1200'); await digitar('#p_inflacao', '4,2'); await digitar('#p_meta', '18'); await digitar('#p_ano', '2027')
  await leg('Sem as médias de AMM/m² e Vendas/m² não há quadrante. Tolerâncias do Book ficam como estão; os limiares de risco e perícia são do sistema e podem ser calibrados.', 3800)
  await rolar('#p_eventos', 400); await digitar('#p_eventos', '2024-03-15;expansão da praça de alimentação', 18); await leg('Eventos estruturais (reforma, expansão, sinistro): contratos anteriores saem dos comparáveis do laudo prévio.', 3200)
  await clicar('#formParams button[type=submit]'); await espera(600)
  // cadastro: base de teste pelo Excel
  await aba('cadastro'); await leg('<b>Cadastro</b> — para a base inteira, importe o Excel do modelo: abas Lojas, Parametros e Historico. Vamos limpar o exemplo e importar a base de teste.', 3800)
  await clicar('#btnLimpar'); await clicar('#btnLimparOk'); await espera(400)
  const cb = await mover('#btnExcel'); if (cb) await p.evaluate(c => window.__cur(c.x, c.y, true), cb)
  await p.setInputFiles('#xlsxFile', path.join(REN, 'base-teste', 'base-teste.xlsx')); await espera(900); await rolar('#excelOut', 500)
  await leg('33 lojas, parâmetros e histórico lidos. LUC repetido atualiza a loja; colunas ausentes preservam o que já existe; comparativo em branco vira [FALTA].', 4200)
  // nova loja campo a campo
  await topo(); await clicar('#btnNova'); await leg('Para cadastrar uma loja à mão, <b>+ Nova loja</b>. Os blocos seguem as fases do Book. Obrigatórios: LUC, nome e fim da vigência.', 3600)
  await digitar('#c_luc', 'L-510'); await digitar('#c_nome', 'Demo Acessórios'); await digitar('#c_cnpj', '12.345.678/0001-90'); await digitar('#c_segmento', 'Acessórios'); await digitar('#c_piso', '1'); await digitar('#c_area', '45')
  await leg('<b>Identificação</b>: LUC, nome, CNPJ (casa com o Radar de Auditoria), segmento, piso e área.', 2600)
  await escolher('#c_mix', 'Relevante'); await escolher('#c_mixValidado', '1'); await leg('<b>Classificação</b>: o mix vem do comitê. Marque "validado" só depois dele; até lá a análise mostra preliminar.', 3200)
  await digitar('#c_inicio', '2022-07-01'); await digitar('#c_fim', '2027-06-30'); await digitar('#c_ultimoReajuste', '2026-07-01'); await digitar('#c_indice', 'IGP-M')
  await leg('<b>Contrato</b>: início, fim validado na minuta, último reajuste (define a janela), índice, cláusulas especiais e subsídios a retirar.', 3400)
  await digitar('#c_amm', '5400'); await digitar('#c_aPct', '480'); await digitar('#c_vendas', '72000'); await digitar('#c_co', '7600'); await digitar('#c_auditoria', '2026-08-10'); await digitar('#c_dispersao', '3,2'); await escolher('#c_livros', 'auditado')
  await leg('<b>Faturamento, desempenho e auditoria</b>: AMM do último mês, A% médio sem dezembro, vendas 12 meses expurgadas, custo de ocupação, última integral e dispersão.', 3800)
  await rolar('#c_historico', 300); await digitar('#c_historico', '2025-07;68000;5100;340;7100\n2025-08;69500;5100;460;7220\n2025-09;70200;5100;516;7280\n2025-10;71000;5100;580;7350', 10)
  await leg('<b>Histórico mensal</b>: uma linha por mês desde a última renovação. Alimenta o argumento de queda do custo de ocupação e preenche o que ficar em branco.', 3600)
  await digitar('#c_coRede', '12,5'); await digitar('#c_entorno', '135'); await digitar('#c_pisoM2', '128'); await digitar('#c_tamanho', '140'); await digitar('#c_conc', '138'); await digitar('#c_abc', '150')
  await leg('<b>Comparativos</b>: CO/Vendas da rede, AMM/m² de entorno, piso, tamanho, concorrentes, Abrasce e Tabela ABC. O que não tiver, deixe vazio: nunca estime.', 3800)
  await digitar('#c_racional', 'Ponto de esquina na entrada principal', 18); await leg('<b>Racional comercial</b>: por que a loja paga acima ou abaixo das similares. É o que sustenta o valor diante do perito.', 3000)
  await clicar('#form button[type=submit]'); await leg('Salvo. A loja já entra na fila, no mapa, no laudo e na linearidade.', 2400)
  // auditoria
  await aba('auditoria'); await leg('<b>Auditoria</b> — copie a agenda para o Radar de Auditoria: quem precisa de integral e em que janela (6 a 3 meses antes de negociar).', 3600)
  await rolar('#agenda', 1800); await rolar('#csvDisp', 300); await leg('Na volta, importe o CSV de dispersão: casa por CNPJ e atualiza a trava de cada loja. Acima de 15% bloqueia a negociação.', 3400)
  const cc = await mover('#csvDisp'); if (cc) await p.evaluate(c => window.__cur(c.x, c.y, true), cc)
  await p.setInputFiles('#csvDisp', path.join(REN, 'base-teste', 'dispersao-teste.csv')); await espera(500); await rolar('#csvOut', 2200)
  // ---------- PARTE 2 · ANÁLISES
  await aba('radar'); await leg('<b>Parte 2 · Análises</b> — o Radar: KPIs do ano e a fila priorizada por farol (Negociar, Preparar, Bloqueado, Aguardar, Renovado), com perito e risco de perda.', 4200)
  await rolar('#fila', 600); await mover('#fFarol'); await p.selectOption('#fFarol', 'verde'); await leg('Filtro Negociar: quem está na janela e sem bloqueio. A ordem é ganho em 60 meses × urgência × peso do mix.', 3400); await p.selectOption('#fFarol', '')
  await rolar('#quadChart', 1000); await leg('Mapa de quadrantes: AMM/m² × Vendas/m² contra a média das satélites. Q1 vende bem e paga pouco: maior espaço de LSR.', 3600)
  await topo(); await clicar('#fBusca'); await p.fill('#fBusca', 'T-101'); await espera(500); await clicar('#fila tbody tr'); await espera(600); await topo()
  await leg('<b>Análise da loja</b> — leia de cima para baixo: ficha, bloqueios e avisos; depois as 7 fases do Book.', 3400)
  await rolar('.fase', 600); await leg('Classificação (mix e quadrante), janela (quando negociar), due diligence com a trava de auditoria e as alçadas de negociação.', 3800)
  await rolar('#analise section:nth-of-type(3)', 400); await leg('Histórico por ano de contrato e o gráfico do CO/Vendas: se caiu, vira argumento.', 3200)
  await rolar('#analise section:nth-of-type(4)', 400); await leg('Os argumentos com memória de cálculo. Em cada um vale o maior indicador; o A% só entra se a loja já paga aluguel variável.', 3800)
  await rolar('#analise section:nth-of-type(5)', 400); await leg('LSR real pela matriz mix × quadrante, mais inflação, contra a Tabela ABC e o teste do perito.', 3400)
  await rolar('#analise section:nth-of-type(6)', 400); await leg('<b>Laudo prévio</b>: o que uma perícia pelo método comparativo tende a encontrar, com os comparáveis do próprio shopping, e o <b>risco de perda</b> em renovatória.', 4200)
  await rolar('#analise section:nth-of-type(6) .chart', 2200)
  await rolar('#analise section:nth-of-type(7)', 400); await leg('Risco renovatório com o checklist técnico da perícia; depois as ações em checklist e os dados faltantes.', 3400)
  await topo(); await clicar('#btnCopiarObsidian'); await leg('<b>Copiar análise (Obsidian)</b> leva a nota completa para o vault.', 2400)
  // laudo
  await aba('laudo'); await leg('<b>Laudo</b> — a visão de laudo da carteira: proposta × laudo prévio, loja a loja, com o risco de perda em baixo, moderado e alto.', 3800)
  await rolar('#laudoChart', 2600); await leg('Faixa = 1º ao 3º quartil dos comparáveis; traço = valor provável; círculo = AMM atual; losango = proposto na cor do risco.', 3600)
  await rolar('#tabLaudo', 600); await mover('#fPerda'); await p.selectOption('#fPerda', 'alto'); await leg('Filtro Alto: proposta acima do que os comparáveis sustentam ou laudo abaixo do atual. "Defensável" diz até onde ir; "receita em risco", o que se perde em 60 meses.', 4200); await p.selectOption('#fPerda', '')
  // perícia
  await aba('pericia'); await leg('<b>Perícia</b> — a linearidade do shopping: dispersão do AMM/m² no geral, por faixa de área e por piso. Média igual pode esconder dois grupos.', 4000)
  await rolar('#linChart', 2400); await rolar('#tabFora', 400); await leg('Lojas fora da curva pedem racional comercial documentado: é o que separa discrepância justificada de distorção.', 3400)
  // planejamento e comitê
  await aba('plano'); await leg('<b>Planejamento</b> — o ano: LSR planejado × realizado, meta, incremento por mês e contratos vencidos.', 3400); await rolar('#tabPlano', 1800)
  await aba('comite'); await leg('<b>Comitê</b> — o pacote em Markdown com proposta, laudo, perito, risco renovatório e risco de perda de cada loja. A decisão de valor é do comitê.', 3800); await clicar('#btnCopiarComite'); await espera(800)
  await aba('ajuda'); await leg('<b>Como usar</b> — este passo a passo, a rotina sugerida, os erros comuns e o glossário ficam aqui.', 3200)
  await p.evaluate(() => window.__legOff()); await espera(300)
  await p.evaluate(() => window.__tit('<div class="faixa">Radar de Renovações</div><h1>Pronto para usar</h1><p>Preencha Parâmetros e Cadastro, receba a dispersão do Radar de Auditoria e leve ao comitê a proposta com o laudo e o risco de perda.</p>'))
  await espera(3200)
  await ctx.close(); await b.close()
  const f = fs.readdirSync(dir).find(x => x.endsWith('.webm')); const src = path.join(dir, f)
  execSync(`ffmpeg -v error -y -i "${src}" -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -movflags +faststart -an "${path.join(REN, 'radar-renovacoes-como-usar.mp4')}"`)
  execSync(`ffmpeg -v error -y -i "${src}" -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -an "${path.join(REN, 'radar-renovacoes-como-usar.webm')}"`)
  console.log('gravado radar-renovacoes-como-usar.mp4/.webm a partir de', src)
})().catch(e => { console.error('FALHA', e); process.exit(1) })
