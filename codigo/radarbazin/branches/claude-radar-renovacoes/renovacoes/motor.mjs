/* ============================================================
   MOTOR DE RENOVAÇÕES — regras do Book de Renovações em código
   ------------------------------------------------------------
   Tudo que é FÓRMULA DO BOOK está marcado [BOOK].
   Tudo que é HEURÍSTICA DESTE SISTEMA está marcado [SISTEMA] —
   são julgamentos operacionais, não regras do método, e podem
   ser recalibrados nos parâmetros.
   Nenhuma função inventa dado: quando falta insumo, a saída
   traz `faltantes` com o nome do dado e segue com o que dá.
   ============================================================ */

export const MIX = ['Essencial', 'Relevante', 'Indiferente', 'Ofensora']

export const PARAMS_PADRAO = {
  shopping: 'Meu Shopping',
  // Comparativos do shopping (médias das lojas-satélite) — [BOOK] insumo obrigatório
  mediaAmmM2Satelites: null,
  mediaVendasM2Satelites: null,
  // Inflação acumulada padrão (do último aniversário ao início da nova vigência), em % — pode ser sobrescrita por loja
  inflacaoAcumuladaPct: null,
  // Meta anual de LSR (% médio ponderado) — validada com o comitê
  metaLsrAnualPct: null,
  anoPlanejamento: new Date().getFullYear(),
  // Trava de auditoria [BOOK]: integral em pelo menos 1 mês nos 6 meses anteriores ao início da negociação
  janelaAuditoriaMeses: 6,
  mesesSazonais: [12],          // auditorias em mês de sazonalidade histórica não contam
  toleranciaDispersaoPct: 15,   // dispersão da curva acima disso → reauditar no mês seguinte
  // Alçadas [BOOK] — sobre a proposta aprovada em comitê
  alcadas: [
    { cargo: 'Coordenador Comercial', de: 1.15, ate: 1.10 },
    { cargo: 'Gerente Financeiro/Comercial', de: 1.10, ate: 1.05 },
    { cargo: 'Superintendente', de: 1.05, ate: 1.00 },
  ],
  degrauMeses: [12, 36],        // [BOOK] preferir 12º e 36º mês
  horizonteMeses: 60,           // [BOOK] o erro de hoje se paga por 5 anos
  // [SISTEMA] pesos de prioridade e limiares de risco — recalibráveis
  pesoMix: { Essencial: 1.2, Relevante: 1.0, Indiferente: 0.8, Ofensora: 0.6 },
  lsrAgressivoPct: 25,
  lsrMuitoAgressivoPct: 40,
  tolerAcimaAbcPct: 10,
}

/* ------------------------------------------------------------ utilidades */
export function num(v) {
  if (v === null || v === undefined || v === '') return null
  const n = typeof v === 'number' ? v : Number(String(v).replace(/\./g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : null
}
export function data(v) {
  if (!v) return null
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v
  const m = String(v).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]))
  const b = String(v).match(/^(\d{2})\/(\d{2})\/(\d{4})/)
  if (b) return new Date(Date.UTC(+b[3], +b[2] - 1, +b[1]))
  return null
}
export function mesesEntre(a, b) {
  // meses (fracionários) de a até b
  const da = data(a), db = data(b)
  if (!da || !db) return null
  return (db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24 * 30.4375)
}
export function somaMeses(d, n) {
  const x = data(d); if (!x) return null
  const y = new Date(x.getTime()); y.setUTCMonth(y.getUTCMonth() + n); return y
}
export function iso(d) { const x = data(d); return x ? x.toISOString().slice(0, 10) : '' }
export const r1 = (x) => (x === null || x === undefined ? null : Math.round(x * 10) / 10)
export const r2 = (x) => (x === null || x === undefined ? null : Math.round(x * 100) / 100)
export const pct = (x) => (x === null || x === undefined ? '[FALTA]' : `${r1(x * 100).toLocaleString('pt-BR')}%`)
export const brl = (x) => (x === null || x === undefined ? '[FALTA]' : x.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }))

/* ------------------------------------------------------------ Fase 1 — classificação */
// [BOOK] AMM/m² = AMM do último mês ÷ área · Vendas/m² = média 12m expurgada ÷ área
// Quadrante: compara com a média das satélites do shopping
export function classificar(loja, params) {
  const area = num(loja.area)
  const amm = num(loja.faturamento?.amm)
  const vendas = num(loja.desempenho?.vendas12mExpurgada ?? loja.desempenho?.vendas12m)
  const faltantes = []
  if (!area) faltantes.push('área (m²)')
  if (amm === null) faltantes.push('AMM do último mês')
  if (vendas === null) faltantes.push('vendas média 12 meses (expurgada)')
  const ammM2 = area && amm !== null ? amm / area : null
  const vendasM2 = area && vendas !== null ? vendas / area : null
  const mA = num(params.mediaAmmM2Satelites), mV = num(params.mediaVendasM2Satelites)
  if (mA === null) faltantes.push('média AMM/m² das satélites do shopping')
  if (mV === null) faltantes.push('média Vendas/m² das satélites do shopping')
  let quadrante = null
  if (ammM2 !== null && vendasM2 !== null && mA !== null && mV !== null) {
    const vendeBem = vendasM2 >= mV, pagaBem = ammM2 >= mA
    quadrante = vendeBem ? (pagaBem ? 2 : 1) : (pagaBem ? 3 : 4)
  }
  const leitura = { 1: 'Vende bem, paga pouco → maior espaço de LSR', 2: 'Vende bem, já paga bem', 3: 'Vende mal, já paga caro → avaliar posicionamento/permanência', 4: 'Vende mal, paga pouco → investigar a origem do problema' }[quadrante] || '[FALTA: quadrante]'
  const mix = MIX.includes(loja.mix) ? loja.mix : null
  if (!mix) faltantes.push('classificação de mix')
  return { ammM2, vendasM2, mediaAmmM2: mA, mediaVendasM2: mV, quadrante, leitura, mix, mixValidado: !!loja.mixValidado, faltantes }
}

/* ------------------------------------------------------------ Fase 2 — janela */
// [BOOK] Nunca negociar antes do último reajuste (em geral faltando 12 meses).
// Essencial/Relevante: contato ativo 12 a 6 meses do fim · Indiferente/Ofensora: < 6 meses.
// < 6 meses: direito à renovatória expira → confirmar com o jurídico que não há ação ajuizada.
export function janela(loja, params, hoje) {
  const fim = data(loja.contrato?.fim)
  const faltantes = []
  if (!fim) faltantes.push('data de fim da vigência (validar na minuta)')
  const meses = fim ? mesesEntre(hoje, fim) : null
  const ultimoReajuste = data(loja.contrato?.ultimoReajuste)
  const proximoReajuste = ultimoReajuste ? somaMeses(ultimoReajuste, 12) : null
  const aindaReajusta = fim && proximoReajuste ? proximoReajuste < fim && proximoReajuste > data(hoje) : null
  const mix = loja.mix
  const preferencial = mix === 'Essencial' || mix === 'Relevante'
  let fase, acao
  if (meses === null) { fase = 'indefinida'; acao = 'Informar a data de fim da vigência' }
  else if (meses <= 0) { fase = 'vencido'; acao = 'CRÍTICO: nenhuma loja pode operar com contrato vencido — regularizar já' }
  else if (aindaReajusta && meses > 12) { fase = 'antes-do-reajuste'; acao = `Aguardar o reajuste de ${iso(proximoReajuste)} — negociar antes derrete o LSR` }
  else if (meses > 12) { fase = 'preparacao'; acao = 'Preparar: pedir auditoria integral e levantar comparativos' }
  else if (meses > 6) { fase = preferencial ? 'ativa' : 'monitorar'; acao = preferencial ? 'Negociar agora (12 a 6 meses do fim)' : 'Monitorar; contato ativo abaixo de 6 meses. Lojista pode procurar a qualquer momento' }
  else { fase = preferencial ? 'curta' : 'ativa'; acao = (preferencial ? 'Atrasado para o ideal (12–6). ' : 'Negociar agora (< 6 meses). ') + 'Confirmar com o jurídico que não há renovatória ajuizada' }
  const alertas = []
  if (meses !== null && meses <= 6 && meses > 0) alertas.push('Abaixo de 6 meses: direito à ação renovatória expirado — checar jurídico antes de negociar')
  if (meses !== null && meses > 6 && meses <= 12) alertas.push('Janela de ajuizamento da renovatória (12 a 6 meses): atenção redobrada')
  if (loja.juridico?.renovatoriaAjuizada) alertas.push('AÇÃO RENOVATÓRIA AJUIZADA: contraproposta vincula e define sucumbência — envolver jurídico')
  return { meses: meses === null ? null : r1(meses), fase, acao, ultimoReajuste: iso(ultimoReajuste), proximoReajuste: iso(proximoReajuste), aindaReajusta, alertas, faltantes }
}

/* ------------------------------------------------------------ Fase 3 — trava de auditoria (integração com o Radar de Auditoria) */
// [BOOK] 100% das lojas a renovar com auditoria integral em pelo menos um mês nos 6 meses
// anteriores ao início da negociação. Mês sazonal não conta. Dispersão de 15% → reauditar.
export function travaAuditoria(loja, params, hoje, inicioNegociacao) {
  const a = loja.auditoria || {}
  const ultima = data(a.ultimaIntegral)
  const inicio = data(inicioNegociacao) || data(hoje)
  const faltantes = []
  if (!ultima) faltantes.push('data da última auditoria integral')
  const sazonais = params.mesesSazonais || []
  const mesSazonal = ultima ? sazonais.includes(ultima.getUTCMonth() + 1) || !!a.mesSazonal : false
  const limite = somaMeses(inicio, -(params.janelaAuditoriaMeses || 6))
  const dentro = ultima ? ultima >= limite && ultima <= inicio : false
  const dispersao = num(a.dispersaoPct)
  const dispersa = dispersao !== null && dispersao > (params.toleranciaDispersaoPct ?? 15)
  const idealDe = somaMeses(inicio, -6), idealAte = somaMeses(inicio, -3)
  let status, motivo
  if (!ultima) { status = 'bloqueio'; motivo = 'Sem auditoria integral registrada — a negociação não deveria começar' }
  else if (mesSazonal) { status = 'bloqueio'; motivo = `Auditoria de ${iso(ultima)} caiu em mês sazonal e não conta — reauditar` }
  else if (!dentro) { status = 'bloqueio'; motivo = `Última integral em ${iso(ultima)}, fora da janela de ${params.janelaAuditoriaMeses || 6} meses antes de ${iso(inicio)} — a negociação não deveria começar` }
  else if (dispersa) { status = 'bloqueio'; motivo = `Dispersão de ${dispersao}% na curva de vendas (tolerância ${params.toleranciaDispersaoPct}%) — reauditar no mês seguinte` }
  else { status = 'ok'; motivo = `Integral em ${iso(ultima)} dentro da janela${dispersao !== null ? ` · dispersão ${dispersao}%` : ' · dispersão não informada'}` }
  const livros = a.statusLivros || null
  if (livros && !['recebido', 'auditado', 'negociado', 'cobrado', 'ok'].includes(livros)) {
    motivo += ` · livros fiscais: ${livros}`
  }
  return { status, motivo, ultimaIntegral: iso(ultima), janelaIdeal: `${iso(idealDe)} a ${iso(idealAte)}`, dispersaoPct: dispersao, livros, faltantes }
}

/* ------------------------------------------------------------ bloqueios absolutos */
export function bloqueios(loja, trava) {
  const b = []
  if ((loja.formato || 'satelite') !== 'satelite') b.push('Fora do escopo do método: só lojas-satélite (âncora, megaloja, quiosque, mídia e atípicos não entram)')
  const mi = num(loja.desempenho?.mesesInadimplente) || 0, sa = num(loja.desempenho?.saldoAberto) || 0
  if (mi > 0 || sa > 0) b.push(`Lojista inadimplente (${mi} mês(es), ${brl(sa)} em aberto) — NÃO renovar até regularizar`)
  if (loja.juridico?.acaoContraShopping) b.push('Lojista com ação judicial contra o shopping — NÃO renovar')
  if (trava?.status === 'bloqueio') b.push(`Trava de auditoria: ${trava.motivo}`)
  return b
}

/* ------------------------------------------------------------ Fase 4 — os 4 argumentos */
// [BOOK] dentro de cada argumento usa-se sempre o MAIOR valor entre seus indicadores
export function argumentos(loja, cls, hist = null) {
  const f = loja.faturamento || {}, d = loja.desempenho || {}, c = loja.comparativos || {}
  const amm = num(f.amm), ammM2 = cls.ammM2
  const out = []
  // Argumento 1 — Incorporação do A% no AMM: só cabe quando a loja JÁ paga aluguel variável (A% > 0)
  {
    const aPct = num(f.aPctMedioSemDezembro ?? f.aPct)
    const falt = []
    if (aPct === null) falt.push('A% médio 12 meses (expurgando dezembro)')
    if (amm === null) falt.push('AMM')
    const pagaVariavel = aPct !== null && aPct > 0
    const inc = pagaVariavel && amm ? aPct / amm : (aPct === 0 ? 0 : null)
    const mesesTxt = hist?.disponivel && hist.ultimos12 ? ` · pagou A% em ${hist.ultimos12.mesesComAPct} dos últimos ${hist.ultimos12.meses} meses` : ''
    out.push({ n: 1, nome: 'Incorporação do A% no AMM', tipo: 'A%', incremento: inc, usavel: inc !== null && inc > 0,
      detalhe: pagaVariavel ? `Loja já paga aluguel variável${mesesTxt}: ${brl(aPct)} ÷ ${brl(amm)} = ${pct(inc)} · o boleto não muda, o A% migra para o AMM e passa a corrigir pela inflação` : aPct === 0 ? 'Loja não paga aluguel variável (A% = 0): não há o que incorporar' : 'sem base', faltantes: falt, indicadores: [{ k: 'A% ÷ AMM', v: inc }] })
  }
  // Argumento 2 — CO/Vendas da mesma loja em outros shoppings (ou do segmento no shopping)
  {
    const vendas = num(d.vendas12mExpurgada ?? d.vendas12m)
    const co = num(d.custoOcupacao)
    const coLoja = co !== null && vendas ? co / vendas : num(d.coVendasPct) !== null ? num(d.coVendasPct) / 100 : null
    const coRede = num(c.coVendasRedePct) !== null ? num(c.coVendasRedePct) / 100 : null
    const coSeg = num(c.coVendasSegmentoShoppingPct) !== null ? num(c.coVendasSegmentoShoppingPct) / 100 : null
    const falt = []
    if (coLoja === null) falt.push('custo de ocupação / CO÷Vendas da loja')
    if (coRede === null && coSeg === null) falt.push('CO/Vendas da mesma loja na rede OU do segmento no shopping')
    let base = null, dif = null, inc = null, fonte = ''
    if (coLoja !== null && coRede !== null && coRede - coLoja > 0) { base = coRede; fonte = 'mesma loja em outros shoppings' }
    else if (coLoja !== null && coSeg !== null) { base = coSeg; fonte = 'segmento dentro do próprio shopping' + (coRede !== null ? ' (base de rede com diferença negativa)' : ' (sem base de rede)') }
    if (base !== null && vendas && amm) { dif = base - coLoja; inc = (amm + dif * vendas) / amm - 1 }
    out.push({ n: 2, nome: 'CO/Vendas comparado', tipo: fonte || 'CO/Vendas', incremento: inc, usavel: inc !== null && inc > 0,
      detalhe: inc !== null ? `CO/Vendas loja ${pct(coLoja)} vs ${fonte} ${pct(base)} → dif. ${pct(dif)} × ${brl(vendas)} = ${brl(dif * vendas)} → (${brl(amm)} + ${brl(dif * vendas)}) ÷ ${brl(amm)} − 1 = ${pct(inc)}` : 'sem base positiva', faltantes: falt,
      indicadores: [{ k: 'CO/Vendas loja', v: coLoja }, { k: 'CO/Vendas rede', v: coRede }, { k: 'CO/Vendas segmento (shopping)', v: coSeg }] })
  }
  // Argumento 3 — Entorno, piso e tamanho
  {
    const itens = [['Entorno (lojas próximas)', num(c.ammM2Entorno)], ['Mesmo piso', num(c.ammM2Piso)], ['Mesmo tamanho', num(c.ammM2Tamanho)]]
    const falt = []
    if (ammM2 === null) falt.push('AMM/m² da loja')
    const ind = itens.map(([k, v]) => { if (v === null) falt.push(`média AMM/m² — ${k.toLowerCase()}`); return { k, v: v !== null && ammM2 ? v / ammM2 - 1 : null } })
    const best = ind.filter(i => i.v !== null).sort((a, b) => b.v - a.v)[0] || null
    out.push({ n: 3, nome: 'Entorno, piso e tamanho', tipo: best ? best.k : 'Entorno/piso/tamanho', incremento: best ? best.v : null, usavel: !!best && best.v > 0,
      detalhe: ind.filter(i => i.v !== null).map(i => `${i.k}: ${pct(i.v)}`).join(' · ') + (best ? ` → usa ${pct(best.v)}` : ''), faltantes: falt, indicadores: ind })
  }
  // Argumento 4 — Pares: concorrentes, segmento (Abrasce), satélites
  {
    const itens = [['3 principais concorrentes no shopping', num(c.ammM2Concorrentes)], ['Mesmo segmento (Abrasce)', num(c.ammM2SegmentoAbrasce)], ['Satélites do shopping', cls.mediaAmmM2]]
    const falt = []
    const ind = itens.map(([k, v]) => { if (v === null) falt.push(`média AMM/m² — ${k.toLowerCase()}`); return { k, v: v !== null && ammM2 ? v / ammM2 - 1 : null } })
    const best = ind.filter(i => i.v !== null).sort((a, b) => b.v - a.v)[0] || null
    out.push({ n: 4, nome: 'Pares', tipo: best ? best.k : 'Pares', incremento: best ? best.v : null, usavel: !!best && best.v > 0,
      detalhe: ind.filter(i => i.v !== null).map(i => `${i.k}: ${pct(i.v)}`).join(' · ') + (best ? ` → usa ${pct(best.v)}` : ''), faltantes: falt, indicadores: ind })
  }
  out.push(argumentoHistorico(loja, hist))
  return out
}

/* ------------------------------------------------------------ Fase 5 — LSR real */
// [BOOK] Relevante Q1/2/4: média dos 2 maiores + inflação · Indiferente Q1/2/4: maior + inflação
// Q3: avaliar posicionamento (Relevante) / permanência (Indiferente)
// Essencial: caso a caso · Ofensora: pode-se inviabilizar (LSR alto), atenção à renovatória
export function lsrReal(cls, args, inflacaoPct) {
  const validos = args.filter(a => a.incremento !== null && a.incremento > 0).sort((a, b) => b.incremento - a.incremento)
  const maior = validos[0]?.incremento ?? null
  const media2 = validos.length >= 2 ? (validos[0].incremento + validos[1].incremento) / 2 : validos.length === 1 ? validos[0].incremento : null
  const infl = num(inflacaoPct)
  const faltantes = []
  if (infl === null) faltantes.push('inflação acumulada (último aniversário → início da nova vigência)')
  const mix = cls.mix, q = cls.quadrante
  let regra, base, caso = null, tipo = 'formula'
  if (!mix) { regra = '[FALTA: mix] — sem diretriz'; base = null; tipo = 'indefinido' }
  else if (mix === 'Relevante') {
    if (q === 3) { regra = 'Relevante Q3: avaliar POSICIONAMENTO da operação (referência: média dos 2 maiores)'; base = media2; tipo = 'avaliar'; caso = 'posicionamento' }
    else { regra = 'Relevante Q1/2/4: média dos 2 maiores argumentos + inflação'; base = media2 }
  } else if (mix === 'Indiferente') {
    if (q === 3) { regra = 'Indiferente Q3: avaliar PERMANÊNCIA da operação (referência: maior argumento)'; base = maior; tipo = 'avaliar'; caso = 'permanencia' }
    else { regra = 'Indiferente Q1/2/4: maior argumento + inflação'; base = maior }
  } else if (mix === 'Essencial') {
    regra = 'Essencial: cálculo CASO A CASO (referência do sistema: média dos 2 maiores) — mais atenção aos valores, não aplicar fórmula mecanicamente'; base = media2; tipo = 'caso-a-caso'
  } else if (mix === 'Ofensora') {
    regra = 'Ofensora: a ideia é que não permaneça — LSR alto pode inviabilizar (referência: maior argumento). Atenção redobrada à renovatória'; base = maior; tipo = 'inviabilizar'
  }
  if (q === null && mix && mix !== 'Essencial' && mix !== 'Ofensora') faltantes.push('quadrante (depende das médias das satélites)')
  const total = base !== null && infl !== null ? base + infl / 100 : null
  return { regra, tipo, caso, lsrBase: base, inflacao: infl === null ? null : infl / 100, lsrTotal: total, usados: validos.slice(0, mix === 'Relevante' || mix === 'Essencial' ? 2 : 1).map(a => `Arg ${a.n} (${a.tipo}) ${pct(a.incremento)}`), faltantes }
}

/* ------------------------------------------------------------ proposta: ABC, perito, alçadas, degrau */
export function proposta(loja, cls, lsr, params, meses) {
  const amm = num(loja.faturamento?.amm), area = num(loja.area)
  const abcM2 = num(loja.comparativos?.tabelaAbcM2)
  const faltantes = []
  if (abcM2 === null) faltantes.push('Tabela ABC (R$/m²) para o espaço')
  const ammProposto = amm !== null && lsr.lsrTotal !== null ? amm * (1 + lsr.lsrTotal) : null
  const abc = abcM2 !== null && area ? abcM2 * area : null
  const vsAbc = ammProposto !== null && abc ? ammProposto / abc - 1 : null
  // [SISTEMA] Teste do perito — heurística: "se virar renovatória, o laudo me dá razão?"
  const refs = [num(loja.comparativos?.ammM2Entorno), num(loja.comparativos?.ammM2Piso), num(loja.comparativos?.ammM2Tamanho), num(loja.comparativos?.ammM2Concorrentes), num(loja.comparativos?.ammM2SegmentoAbrasce), cls.mediaAmmM2].filter(v => v !== null)
  const tetoMercadoM2 = refs.length ? Math.max(...refs) : null
  const propM2 = ammProposto !== null && area ? ammProposto / area : null
  let perito = 'indefinido', peritoMotivo = 'faltam comparativos ou proposta'
  if (propM2 !== null && (tetoMercadoM2 !== null || abcM2 !== null)) {
    const acimaMercado = tetoMercadoM2 !== null && propM2 > tetoMercadoM2 * (1 + (params.tolerAcimaAbcPct || 10) / 100)
    const acimaAbc = abcM2 !== null && propM2 > abcM2 * (1 + (params.tolerAcimaAbcPct || 10) / 100)
    if (acimaMercado && acimaAbc) { perito = 'fragil'; peritoMotivo = `AMM/m² proposto ${brl(propM2)} acima do maior comparativo (${brl(tetoMercadoM2)}) e da Tabela ABC (${brl(abcM2)}) — laudo tende a dar razão ao lojista: apertar menos` }
    else if (acimaMercado || acimaAbc) { perito = 'atencao'; peritoMotivo = acimaMercado ? `AMM/m² proposto mais de ${params.tolerAcimaAbcPct || 10}% acima do maior comparativo de mercado (${brl(tetoMercadoM2)}/m²)` : `AMM/m² proposto mais de ${params.tolerAcimaAbcPct || 10}% acima da Tabela ABC` }
    else { perito = 'forte'; peritoMotivo = `AMM/m² proposto ${brl(propM2)} dentro dos comparativos${abcM2 !== null ? ` e da Tabela ABC (${brl(abcM2)}/m²)` : ''}` }
  }
  const alcadas = ammProposto !== null ? (params.alcadas || PARAMS_PADRAO.alcadas).map(a => ({ cargo: a.cargo, de: ammProposto * a.de, ate: ammProposto * a.ate, faixa: `${Math.round(a.de * 100)}% → ${Math.round(a.ate * 100)}%` })) : []
  const ganho60m = ammProposto !== null && amm !== null ? (ammProposto - amm) * (params.horizonteMeses || 60) : null
  return { ammAtual: amm, ammProposto, ammPropostoM2: propM2, tabelaAbc: abc, tabelaAbcM2: abcM2, vsAbc, perito, peritoMotivo, tetoMercadoM2, alcadas, degrau: params.degrauMeses || [12, 36], ganho60m, faltantes,
    aberturaNegociador: ammProposto !== null ? ammProposto * 1.15 : null }
}

/* ------------------------------------------------------------ [SISTEMA] risco renovatório */
export function riscoRenovatorio(loja, cls, jan, lsr, prop, params) {
  const f = []
  let s = 0
  if (loja.juridico?.renovatoriaAjuizada) { f.push('Renovatória já ajuizada'); s = 100 }
  if (cls.mix === 'Ofensora') { s += 30; f.push('Loja Ofensora: lojista tende a litigar para permanecer') }
  if (jan.meses !== null && jan.meses > 6 && jan.meses <= 12) { s += 20; f.push('Dentro da janela de ajuizamento (12 a 6 meses)') }
  if (lsr.lsrTotal !== null && lsr.lsrTotal * 100 >= (params.lsrMuitoAgressivoPct || 40)) { s += 30; f.push(`LSR total ${pct(lsr.lsrTotal)} muito agressivo`) }
  else if (lsr.lsrTotal !== null && lsr.lsrTotal * 100 >= (params.lsrAgressivoPct || 25)) { s += 15; f.push(`LSR total ${pct(lsr.lsrTotal)} agressivo`) }
  if (prop.perito === 'fragil') { s += 25; f.push('Teste do perito frágil') }
  else if (prop.perito === 'atencao') { s += 10; f.push('Teste do perito em atenção') }
  if (loja.negociacao?.resistencia) { s += 15; f.push('Lojista sinalizou resistência') }
  if (loja.contrato?.inicio && mesesEntre(loja.contrato.inicio, loja.contrato.fim) >= 60) { s += 5; f.push('Contrato ≥ 5 anos: requisito da renovatória atendido') }
  s = Math.min(100, s)
  const nivel = s >= 60 ? 'alto' : s >= 30 ? 'medio' : 'baixo'
  const lembretes = ['Janela de ajuizamento 12 a 6 meses', 'Resposta do shopping em 15 dias', 'Contraproposta vincula e define a sucumbência', 'Aluguel provisório ≤ 80% do pedido/contraproposta', 'Honorários 10% a 20%', 'Duração média 2,5 anos', 'Acordo, em regra, é a melhor opção', 'Laudo Preliminar não vai aos autos']
  return { score: s, nivel, fatores: f, lembretes }
}

/* ------------------------------------------------------------ [SISTEMA] prioridade e farol */
export function prioridade(loja, cls, jan, prop, bloq, params) {
  const ganho = prop.ganho60m ?? 0
  const urg = jan.meses === null ? 0.5 : jan.meses <= 0 ? 1.3 : jan.meses <= 6 ? 1.1 : jan.meses <= 12 ? 1.0 : jan.meses <= 18 ? 0.6 : 0.3
  const pm = (params.pesoMix || PARAMS_PADRAO.pesoMix)[cls.mix] ?? 0.8
  const risco = ganho < 0 ? Math.abs(ganho) : 0 // loja que já paga acima do calculado: prioridade é defender a receita
  const score = (Math.max(ganho, 0) + risco * 0.5) * urg * pm
  return { score, urgencia: urg, pesoMix: pm }
}
export function farol(loja, jan, bloq) {
  if (loja.status === 'renovado') return { cor: 'azul', rotulo: 'Renovado' }
  if (loja.status === 'nao-renovado') return { cor: 'cinza', rotulo: 'Não renovado' }
  if (jan.fase === 'vencido') return { cor: 'vermelho', rotulo: 'Contrato vencido' }
  if (bloq.length) return { cor: 'vermelho', rotulo: 'Bloqueado' }
  if (jan.fase === 'ativa' || jan.fase === 'curta') return { cor: 'verde', rotulo: 'Negociar' }
  if (jan.fase === 'monitorar' || jan.fase === 'preparacao') return { cor: 'amarelo', rotulo: 'Preparar' }
  if (jan.fase === 'antes-do-reajuste') return { cor: 'cinza', rotulo: 'Aguardar reajuste' }
  return { cor: 'cinza', rotulo: 'Aguardar' }
}

/* ------------------------------------------------------------ análise completa de uma loja */
export function analisarLoja(loja, params = PARAMS_PADRAO, hoje = new Date(), todasLojas = null) {
  const p = { ...PARAMS_PADRAO, ...params }
  const lojaOriginal = loja
  const hist = historico(loja, p, hoje)
  const enr = enriquecer(loja, hist)
  loja = enr.loja
  const cls = classificar(loja, p)
  const jan = janela(loja, p, hoje)
  // início da negociação: hoje se já está na janela; senão 12 meses antes do fim
  const inicioNeg = jan.meses !== null && jan.meses > 12 ? somaMeses(loja.contrato.fim, -12) : data(hoje)
  const trava = travaAuditoria(loja, p, hoje, inicioNeg)
  // fora da janela de negociação (> 12 meses) a auditoria pendente é "programar", não bloqueio
  if (trava.status === 'bloqueio' && jan.meses !== null && jan.meses > 12) { trava.status = 'programar'; trava.motivo = 'Programar: ' + trava.motivo }
  const bloq = bloqueios(loja, trava)
  const args = argumentos(loja, cls, hist)
  const inflacao = loja.inflacaoAcumuladaPct ?? p.inflacaoAcumuladaPct
  const lsr = lsrReal(cls, args, inflacao)
  const prop = proposta(loja, cls, lsr, p, jan.meses)
  // [PERÍCIA] laudo prévio pelo método comparativo intra-shopping; quando suficiente, substitui a heurística do perito
  const comp = todasLojas ? comparaveis(lojaOriginal, todasLojas, p, hoje) : null
  const laudo = comp ? laudoPrevio(lojaOriginal, comp, prop.ammAtual, prop.ammProposto) : { disponivel: false, veredito: 'insuficiente', motivo: 'sem base de comparáveis', n: 0 }
  prop.peritoHeuristico = prop.perito; prop.peritoMotivoHeuristico = prop.peritoMotivo
  if (laudo.disponivel && laudo.veredito !== 'indefinido') { prop.perito = laudo.veredito; prop.peritoMotivo = `Laudo prévio (${laudo.n} comparáveis): ${laudo.motivo}`; prop.peritoFonte = 'laudo-previo' } else prop.peritoFonte = 'heuristica'
  const risco = riscoRenovatorio(loja, cls, jan, lsr, prop, p)
  const perda = riscoPerda(lojaOriginal, laudo, prop, jan, lsr, p)
  const prio = prioridade(loja, cls, jan, prop, bloq, p)
  const far = farol(loja, jan, bloq)
  const faltantes = [...new Set([...cls.faltantes, ...jan.faltantes, ...trava.faltantes, ...args.flatMap(a => a.faltantes), ...lsr.faltantes, ...prop.faltantes])]
  const avisos = []
  if (enr.derivados.length) avisos.push(`Derivado do histórico mensal (cadastro em branco): ${enr.derivados.join(', ')}`)
  if (cls.mix && !cls.mixValidado) avisos.push('Classificação de mix PRELIMINAR — precisa de validação do comitê comercial')
  if (cls.quadrante === 4) avisos.push('Quadrante 4: antes do número, responder a ORIGEM do problema (localização × performance)')
  if ((loja.contrato?.clausulasEspeciais || []).length || (loja.contrato?.subsidios || []).length) avisos.push('Negociar a retirada de cláusulas especiais e subsídios; incluir reforma como obrigação no novo contrato')
  if (loja.contrato?.comercial === false) avisos.push('Contrato não comercial: haverá CDU')
  if (loja.keyAccount) avisos.push('Key Account: informar a Holding')
  const ações = acoes(loja, cls, jan, trava, bloq, lsr, prop, risco, perda)
  // [SISTEMA] confiança da análise: cai com cada dado faltante e com mix não validado
  const confianca = Math.max(1, Math.min(10, 10 - faltantes.length - (cls.mixValidado ? 0 : 1) - (lsr.tipo === 'indefinido' ? 2 : 0)))
  return { loja: lojaOriginal, lojaCalculo: loja, hist, comp, laudo, perda, cls, jan, trava, bloq, args, lsr, prop, risco, prio, farol: far, faltantes, avisos, acoes: ações, confianca, hoje: iso(hoje) }
}

function acoes(loja, cls, jan, trava, bloq, lsr, prop, risco, perda) {
  const a = []
  if (jan.fase === 'vencido' && loja.status !== 'renovado' && loja.status !== 'nao-renovado') a.push('Regularizar contrato vencido imediatamente (aditivo ou nova vigência)')
  if (trava.status === 'bloqueio') a.push(`Solicitar auditoria integral ao Radar de Auditoria (janela ideal ${trava.janelaIdeal})`)
  if (!cls.mixValidado) a.push('Levar classificação de mix ao comitê comercial para validação')
  if (bloq.some(b => b.includes('inadimplente'))) a.push('Regularizar inadimplência antes de qualquer proposta')
  if (jan.meses !== null && jan.meses <= 6) a.push('Confirmar com o jurídico que não há ação renovatória ajuizada')
  if (lsr.tipo === 'avaliar') a.push(lsr.caso === 'posicionamento' ? 'Avaliar reposicionamento da operação (layout, estoque, equipe, produto) antes de precificar' : 'Avaliar permanência da operação; considerar troca do ponto')
  if (lsr.tipo === 'caso-a-caso') a.push('Essencial: montar cálculo caso a caso e explicar a tensão imagem × valor ao comitê')
  if (prop.ammProposto !== null) a.push(`Levar ao comitê semanal: AMM proposto ${brl(prop.ammProposto)} (LSR ${pct(lsr.lsrTotal)}); abertura do coordenador ${brl(prop.aberturaNegociador)}`)
  if (prop.perito === 'fragil') a.push('Apertar menos: proposta não resiste ao teste do perito' + (prop.peritoFonte === 'laudo-previo' ? ' (laudo prévio pelos comparáveis do shopping)' : ''))
  if (prop.peritoFonte !== 'laudo-previo') a.push('Montar laudo prévio: faltam comparáveis similares e contemporâneos no cadastro (área ±50%, contrato recente, sem subsídio)')
  if (risco.nivel === 'alto') a.push('Preparar cenário de renovatória com o jurídico (contraproposta vincula)')
  if (perda?.nivel === 'alto' && perda.disponivel && perda.ajuste > 0) a.push(`Risco de perda ALTO: trazer a proposta para até ${brl(perda.defensavel)} (3º quartil dos comparáveis) ou documentar o que justifica o excedente de ${brl(perda.ajuste)}`)
  else if (perda?.nivel === 'alto' && perda.laudoAbaixoDoAtual) a.push('Laudo abaixo do AMM atual: evitar a renovatória; buscar acordo e reforçar comparáveis que sustentem o valor')
  if (jan.fase === 'ativa' && !bloq.length) a.push('1º contato: ouvir, apresentar o shopping e o que vem; sair com proposta do próprio lojista; decisão é do comitê')
  a.push('Degrau no 12º e 36º mês; retirar cláusulas especiais/subsídios; reforma obrigatória')
  return a
}

/* ------------------------------------------------------------ Fase 7 — planejamento anual */
export function planejamento(lojas, params = PARAMS_PADRAO, hoje = new Date()) {
  const p = { ...PARAMS_PADRAO, ...params }
  const ano = +p.anoPlanejamento || new Date(hoje).getFullYear()
  const linhas = lojas.map(l => analisarLoja(l, p, hoje, lojas)).filter(a => { const f = data(a.loja.contrato?.fim); return f && f.getUTCFullYear() === ano })
  let ammBase = 0, ammPlanejado = 0, ammRealizado = 0, baseRealizado = 0, n = 0, nReal = 0
  const porMes = Array.from({ length: 12 }, (_, i) => ({ mes: i + 1, lojas: 0, planejado: 0, realizado: 0 }))
  for (const a of linhas) {
    const amm = a.prop.ammAtual ?? 0
    const m = data(a.loja.contrato.fim).getUTCMonth()
    porMes[m].lojas++
    n++
    ammBase += amm
    if (a.prop.ammProposto !== null) { ammPlanejado += a.prop.ammProposto; porMes[m].planejado += a.prop.ammProposto - amm } else ammPlanejado += amm
    const rl = num(a.loja.realizado?.ammNovo)
    if (a.loja.status === 'renovado' && rl !== null) { nReal++; ammRealizado += rl; baseRealizado += amm; porMes[m].realizado += rl - amm }
  }
  const lsrPlanejado = ammBase ? ammPlanejado / ammBase - 1 : null
  const lsrRealizado = baseRealizado ? ammRealizado / baseRealizado - 1 : null
  const meta = num(p.metaLsrAnualPct)
  const atingimento = meta && lsrRealizado !== null ? (lsrRealizado * 100) / meta : null
  const gap = meta !== null && lsrPlanejado !== null ? meta / 100 - lsrPlanejado : null
  return { ano, lojas: linhas, n, nReal, ammBase, ammPlanejado, ammRealizado, lsrPlanejado, lsrRealizado, meta: meta === null ? null : meta / 100, atingimento, gap, porMes, vencidos: lojas.filter(l => { const f = data(l.contrato?.fim); return f && f < data(hoje) && l.status !== 'renovado' && l.status !== 'nao-renovado' }).length }
}

/* ------------------------------------------------------------ agenda de auditoria (saída para o Radar de Auditoria) */
export function agendaAuditoria(lojas, params = PARAMS_PADRAO, hoje = new Date(), horizonteMeses = 18) {
  const p = { ...PARAMS_PADRAO, ...params }
  return lojas.map(l => analisarLoja(l, p, hoje)).filter(a => a.jan.meses !== null && a.jan.meses > 0 && a.jan.meses <= horizonteMeses + 12 && a.loja.status !== 'renovado' && a.loja.status !== 'nao-renovado')
    .map(a => {
      const inicio = a.jan.meses > 12 ? somaMeses(a.loja.contrato.fim, -12) : data(hoje)
      return { luc: a.loja.luc, nome: a.loja.nome, cnpj: a.loja.cnpj || '', inicioNegociacao: iso(inicio), integralDe: iso(somaMeses(inicio, -6)), integralAte: iso(somaMeses(inicio, -3)), fechamento: `${iso(somaMeses(inicio, -2))} a ${iso(inicio)}`, status: a.trava.status, motivo: a.trava.motivo, dispersaoPct: a.trava.dispersaoPct, prioridade: a.trava.status === 'bloqueio' ? (a.jan.meses <= 12 ? 'urgente' : 'programar') : 'ok' }
    }).sort((x, y) => (x.prioridade === 'urgente' ? 0 : x.prioridade === 'programar' ? 1 : 2) - (y.prioridade === 'urgente' ? 0 : y.prioridade === 'programar' ? 1 : 2) || x.inicioNegociacao.localeCompare(y.inicioNegociacao))
}

/* ------------------------------------------------------------ importação do Radar de Dispersão de Vendas (CSV) */
// Aceita o CSV exportado pelo Radar de Dispersão: colunas CNPJ · Competência · Dispersão % · Status (nomes flexíveis)
export function importarDispersao(csvTexto, lojas) {
  const linhas = csvTexto.split(/\r?\n/).filter(l => l.trim())
  if (!linhas.length) return { atualizadas: 0, semLoja: [] }
  const sep = linhas[0].includes(';') ? ';' : ','
  const cab = linhas[0].split(sep).map(s => s.replace(/"/g, '').trim().toLowerCase())
  const ix = (re) => cab.findIndex(c => re.test(c))
  const iC = ix(/cnpj/), iComp = ix(/compet/), iD = ix(/dispers/), iS = ix(/status/), iLuc = ix(/\bluc\b/)
  const porLoja = new Map()
  for (const l of linhas.slice(1)) {
    const c = l.split(sep).map(s => s.replace(/"/g, '').trim())
    const cnpj = (iC >= 0 ? c[iC] : '').replace(/\D/g, '')
    const luc = iLuc >= 0 ? c[iLuc] : ''
    const chave = cnpj || luc
    if (!chave) continue
    const comp = iComp >= 0 ? c[iComp] : ''
    const prev = porLoja.get(chave)
    if (!prev || comp > prev.comp) porLoja.set(chave, { comp, dispersao: num(iD >= 0 ? c[iD] : null), status: iS >= 0 ? c[iS] : '' })
  }
  let atualizadas = 0; const semLoja = []
  for (const [chave, v] of porLoja) {
    const loja = lojas.find(l => (l.cnpj || '').replace(/\D/g, '') === chave || l.luc === chave)
    if (!loja) { semLoja.push(chave); continue }
    loja.auditoria = loja.auditoria || {}
    if (v.dispersao !== null) loja.auditoria.dispersaoPct = v.dispersao
    if (v.status) loja.auditoria.statusLivros = v.status.toLowerCase()
    if (v.comp) loja.auditoria.competenciaDispersao = v.comp
    atualizadas++
  }
  return { atualizadas, semLoja }
}

/* ------------------------------------------------------------ saída Obsidian (formato da skill) */
export function analiseObsidian(a) {
  const l = a.loja, c = a.cls, j = a.jan, p = a.prop, s = a.lsr
  const seg = (l.segmento || 'segmento').toLowerCase().replace(/\s+/g, '-')
  const shop = (a.shopping || '').toLowerCase().replace(/\s+/g, '-') || 'shopping'
  const linhas = [
    '---', 'tipo: analise-renovacao', 'área: shopping-centers/comercial', `status: ${l.status === 'renovado' ? 'renovado' : 'em-negociacao'}`, `criado: ${a.hoje}`, `tags: [renovacao, ${shop}, ${seg}]`, `aliases: [${l.nome}, ${l.luc}]`, '---', '',
    `# Renovação — ${l.nome} (${l.luc})`, '',
    `> [!info] Ficha`, `> ${a.shopping || '[FALTA: shopping]'} · ${l.segmento || '[FALTA: segmento]'} · ${l.area || '[FALTA]'} m² · Fim da vigência ${l.contrato?.fim || '[FALTA]'} · ${j.meses ?? '[FALTA]'} meses restantes · Última auditoria ${a.trava.ultimaIntegral || '[FALTA]'}`, '',
    '## 1. Classificação',
    `Mix: ${c.mix || '[FALTA]'} (validado pelo comitê? ${c.mixValidado ? 'sim' : 'não — preliminar'}) · Quadrante: ${c.quadrante ?? '[FALTA]'} — ${c.leitura} · AMM/m²: ${brl(c.ammM2)} vs satélites ${brl(c.mediaAmmM2)} · Vendas/m²: ${brl(c.vendasM2)} vs satélites ${brl(c.mediaVendasM2)}`, '',
    '## 2. Janela',
    `${j.fase} (${j.meses ?? '?'} meses) · último reajuste em ${j.ultimoReajuste || '[FALTA]'} · ação: ${j.acao}`,
    ...j.alertas.map(x => `> [!warning] ${x}`), '',
    '## 3. Diagnóstico',
    `Auditoria: ${a.trava.motivo}`,
    `Bloqueios: ${a.bloq.length ? a.bloq.join(' · ') : 'nenhum'}`,
    `Cláusulas a extinguir: ${[...(l.contrato?.clausulasEspeciais || []), ...(l.contrato?.subsidios || [])].join(', ') || 'nenhuma informada'}`, '',
    '## 3b. Histórico desde a última renovação',
    a.hist?.disponivel ? `${a.hist.meses} meses desde ${a.hist.inicio} (${a.hist.origem})${a.hist.crescimentoVendas !== null ? ` · vendas ${pct(a.hist.crescimentoVendas)} vs 1º ano` : ''}${a.hist.deltaCoVendas !== null ? ` · CO/Vendas ${pct(a.hist.primeiro.coVendas)} → ${pct(a.hist.ultimos12.coVendas)}` : ''}` : '[FALTA: histórico mensal desde a última renovação]',
    ...(a.hist?.disponivel ? ['| Ano | Meses | Vendas/mês | AMM médio | A% total | CO/Vendas |', '|---|---|---|---|---|---|', ...a.hist.anos.map(y => `| ${y.rotulo} (${y.de} a ${y.ate}) | ${y.meses} | ${brl(y.vendasMes)} | ${brl(y.ammMedio)} | ${brl(y.aPct)} | ${y.coVendas === null ? '[FALTA]' : pct(y.coVendas)} |`)] : []), '',
    '## 4. Argumentos', '| Argumento | Tipo | Incremento |', '|---|---|---|',
    ...a.args.map(x => `| Argumento ${x.n} | ${x.tipo} | ${x.incremento === null ? '[FALTA]' : pct(x.incremento)} |`), '',
    '## 5. Proposta',
    `Diretriz: ${s.regra}`,
    `LSR real ${pct(s.lsrBase)} + inflação ${pct(s.inflacao)} = **${pct(s.lsrTotal)}** → AMM proposto ${brl(p.ammProposto)} (atual ${brl(p.ammAtual)})`,
    `Tabela ABC: ${brl(p.tabelaAbc)} (${p.vsAbc === null ? '[FALTA]' : pct(p.vsAbc)} vs proposta) · Teste do perito: ${p.perito} — ${p.peritoMotivo} · Degrau sugerido: ${p.degrau.join('º e ')}º mês`, '',
    '## 5b. Laudo prévio (método comparativo intra-shopping)',
    a.laudo?.disponivel ? `${a.laudo.n} comparáveis similares e contemporâneos · mediana ${brl(a.laudo.medianaM2)}/m² (Q1 ${brl(a.laudo.q1M2)} · Q3 ${brl(a.laudo.q3M2)} · máx ${brl(a.laudo.maxM2)}) · valor locativo provável **${brl(a.laudo.provavel)}** (faixa ${brl(a.laudo.faixa[0])} a ${brl(a.laudo.faixa[1])})${a.laudo.bimodal ? ' · amostra bimodal' : ''} · veredito **${a.laudo.veredito}**` : `[FALTA: comparáveis suficientes] ${a.laudo?.motivo || ''}`,
    ...(a.comp ? ['| Comparável | Área | Piso | AMM/m² | Contrato | Situação |', '|---|---|---|---|---|---|', ...a.comp.amostra.filter(x => x.incluido).slice(0, 12).map(x => `| ${x.luc} ${x.nome} | ${x.area} m² | ${x.piso} | ${brl(x.ammM2)} | ${x.dataContrato} (${x.idadeMeses} m) | incluído${x.mesmoPiso ? ', mesmo piso' : ''} |`)] : []),
    ...(a.risco.nivel !== 'baixo' || l.juridico?.renovatoriaAjuizada ? ['', '## Checklist da perícia', ...CHECKLIST_PERICIA.map(x => `- [ ] ${x}`)] : []),
    `Faixa de alçada: comitê ${brl(p.ammProposto)} · ${p.alcadas.map(x => `${x.cargo} ${brl(x.de)} → ${brl(x.ate)}`).join(' · ')}`,
    `Ganho em 60 meses: ${brl(p.ganho60m)}`, '',
    '## 6. Ações', ...a.acoes.map(x => `- [ ] ${x}`), '',
    '## 7. Riscos',
    `> [!danger] Risco renovatório ${a.risco.nivel.toUpperCase()} (${a.risco.score}/100): ${a.risco.fatores.join(' · ') || 'sem fatores agravantes'}`,
    a.perda ? `> [!danger] Risco de perda em renovatória (visão de laudo): **${a.perda.nivel.toUpperCase()}** — ${a.perda.motivos.join(' · ')}${a.perda.disponivel ? ` · defensável até ${brl(a.perda.defensavel)} · receita em risco (60 m) ${brl(a.perda.receitaEmRisco)}` : ''}` : '',
    ...a.avisos.map(x => `> [!warning] ${x}`), '',
    '## Dados faltantes', ...(a.faltantes.length ? a.faltantes.map(x => `- [FALTA: ${x}]`) : ['- nenhum']), '',
    '```dataview', 'LIST FROM #renovacao WHERE contains(file.outlinks, this.file.link)', '```', '',
    `> [!note] Confiança: ${a.confianca}/10 — ${a.faltantes.length} dado(s) faltante(s)${c.mixValidado ? '' : '; mix não validado pelo comitê'}. Fórmulas: Book de Renovações (2011). Teste do perito, risco renovatório e prioridade são heurísticas deste sistema, não do Book.`,
  ]
  return linhas.join('\n')
}

/* ------------------------------------------------------------ importação de planilha Excel/CSV (cadastro e parâmetros) */
// Recebe as linhas já lidas (um objeto por linha, chave = cabeçalho). O casamento de colunas é por
// palavras-chave, sem depender de acento, maiúscula ou ordem. Lojas com o mesmo LUC são atualizadas.
const semAcento = (s) => String(s ?? '').replace(/²/g, '2').replace(/³/g, '3').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9%/ ]+/g, ' ').replace(/\s+/g, ' ').trim()
const simNao = (v) => ['sim', 's', '1', 'x', 'true', 'verdadeiro', 'yes'].includes(semAcento(v))
const dataCel = (v) => { if (v instanceof Date) return iso(v); if (typeof v === 'number' && v > 20000 && v < 80000) { const d = new Date(Date.UTC(1899, 11, 30) + v * 86400000); return iso(d) } return iso(data(v)) || '' }
const COLUNAS_LOJA = [
  ['luc', /^luc$/], ['nome', /nome|fantasia|loja$/], ['cnpj', /cnpj/], ['segmento', /^segmento$/], ['piso', /^piso$/], ['area', /^area|^metragem/], ['formato', /formato/],
  ['keyAccount', /key/], ['mix', /^mix$|classifica/], ['mixValidado', /valid/], ['cluster', /cluster|batalha/], ['status', /^status/],
  ['inicio', /inicio/], ['fim', /^fim|fim vig|fim da vig|termino/], ['ultimoReajuste', /reajuste/], ['indice', /indice/], ['degrau', /degrau/], ['fatorPercentual', /fator/], ['comercial', /comercial/], ['inflacaoAcumuladaPct', /inflacao/], ['clausulasEspeciais', /clausula/], ['subsidios', /subsidio/],
  ['amm', /^amm( ultimo| do ultimo| atual)?( mes)?$|^amm$/], ['aPctMedioSemDezembro', /^a ?%|a% medio|aluguel percentual/], ['vendas12mExpurgada', /^vendas/], ['custoOcupacao', /custo de ocupacao|custo ocupacao|^co$/], ['mesesInadimplente', /inadimpl/], ['saldoAberto', /saldo/],
  ['ultimaIntegral', /auditoria/], ['dispersaoPct', /dispers/], ['statusLivros', /livro/], ['acaoContraShopping', /acao contra|acao judicial/], ['renovatoriaAjuizada', /renovatoria/], ['resistencia', /resist/],
  ['coVendasRedePct', /co ?\/ ?vendas rede|co vendas rede|rede %?/], ['coVendasSegmentoShoppingPct', /co ?\/ ?vendas segmento|co vendas segmento|segmento shopping/], ['ammM2Entorno', /entorno/], ['ammM2Piso', /amm ?\/ ?m2 piso|amm m2 piso|m² piso|m2 piso/], ['ammM2Tamanho', /tamanho/], ['ammM2Concorrentes', /concorrente/], ['ammM2SegmentoAbrasce', /abrasce/], ['tabelaAbcM2', /abc/],
  ['ammNovo', /amm novo|realizado/], ['dataRenovacao', /data renov|renovacao$/], ['novoFim', /nova vig|novo fim/], ['racionalForaDaCurva', /racional/],
]
export function mapearCabecalho(cabecalhos) {
  const mapa = {}
  const usados = new Set()
  for (const h of cabecalhos) {
    const n = semAcento(h)
    const hit = COLUNAS_LOJA.find(([campo, re]) => !usados.has(campo) && re.test(n))
    if (hit) { mapa[h] = hit[0]; usados.add(hit[0]) }
  }
  return mapa
}
export function importarLojasPlanilha(linhas, lojasAtuais = []) {
  if (!linhas.length) return { lojas: lojasAtuais, novas: 0, atualizadas: 0, ignoradas: 0, colunas: {}, naoReconhecidas: [] }
  const cab = Object.keys(linhas[0])
  const mapa = mapearCabecalho(cab)
  const naoReconhecidas = cab.filter(h => !mapa[h] && String(h).trim())
  const lojas = lojasAtuais.map(l => ({ ...l }))
  let novas = 0, atualizadas = 0, ignoradas = 0
  for (const linha of linhas) {
    const g = {}
    for (const [h, campo] of Object.entries(mapa)) g[campo] = linha[h]
    const luc = String(g.luc ?? '').trim()
    if (!luc) { ignoradas++; continue }
    const lista = (v) => String(v ?? '').split(/[,;]/).map(s => s.trim()).filter(Boolean)
    const mixRaw = semAcento(g.mix); const mix = MIX.find(m => semAcento(m) === mixRaw) || null
    const st = semAcento(g.status).replace(/ /g, '-'); const status = ['a-negociar', 'em-negociacao', 'renovado', 'nao-renovado'].includes(st) ? st : 'a-negociar'
    const fmt = semAcento(g.formato); const formato = /anc/.test(fmt) ? 'ancora' : /mega/.test(fmt) ? 'megaloja' : /quios/.test(fmt) ? 'quiosque' : /atip|midia/.test(fmt) ? 'atipico' : 'satelite'
    const existente = lojas.find(l => l.luc === luc)
    const tem = (campo) => Object.values(mapa).includes(campo)
    const ou = (campo, valor, atual) => (tem(campo) ? valor : (atual === undefined ? valor : atual))
    const ex = existente || {}, exC = ex.contrato || {}, exF = ex.faturamento || {}, exD = ex.desempenho || {}, exA = ex.auditoria || {}, exJ = ex.juridico || {}, exN = ex.negociacao || {}, exP = ex.comparativos || {}, exR = ex.realizado || {}
    const loja = {
      id: existente?.id || ('x' + luc.replace(/\W/g, '') + Date.now().toString(36)), luc, nome: ou('nome', String(g.nome ?? '').trim(), ex.nome), cnpj: ou('cnpj', String(g.cnpj ?? '').trim(), ex.cnpj), segmento: ou('segmento', String(g.segmento ?? '').trim(), ex.segmento), piso: ou('piso', String(g.piso ?? '').trim(), ex.piso), area: ou('area', num(g.area), ex.area), formato: ou('formato', formato, ex.formato), keyAccount: ou('keyAccount', simNao(g.keyAccount), ex.keyAccount),
      mix: ou('mix', mix, ex.mix), mixValidado: ou('mixValidado', simNao(g.mixValidado), ex.mixValidado), cluster: ou('cluster', String(g.cluster ?? '').trim(), ex.cluster), status: ou('status', status, ex.status), inflacaoAcumuladaPct: ou('inflacaoAcumuladaPct', num(g.inflacaoAcumuladaPct), ex.inflacaoAcumuladaPct),
      contrato: { inicio: ou('inicio', dataCel(g.inicio), exC.inicio), fim: ou('fim', dataCel(g.fim), exC.fim), ultimoReajuste: ou('ultimoReajuste', dataCel(g.ultimoReajuste), exC.ultimoReajuste), indice: ou('indice', String(g.indice ?? '').trim(), exC.indice), degrau: ou('degrau', String(g.degrau ?? '').trim(), exC.degrau), fatorPercentual: ou('fatorPercentual', num(g.fatorPercentual), exC.fatorPercentual), comercial: ou('comercial', g.comercial === undefined || g.comercial === '' ? true : simNao(g.comercial), exC.comercial), clausulasEspeciais: ou('clausulasEspeciais', lista(g.clausulasEspeciais), exC.clausulasEspeciais), subsidios: ou('subsidios', lista(g.subsidios), exC.subsidios) },
      faturamento: { amm: ou('amm', num(g.amm), exF.amm), aPctMedioSemDezembro: ou('aPctMedioSemDezembro', num(g.aPctMedioSemDezembro), exF.aPctMedioSemDezembro) },
      desempenho: { vendas12mExpurgada: ou('vendas12mExpurgada', num(g.vendas12mExpurgada), exD.vendas12mExpurgada), custoOcupacao: ou('custoOcupacao', num(g.custoOcupacao), exD.custoOcupacao), mesesInadimplente: ou('mesesInadimplente', num(g.mesesInadimplente), exD.mesesInadimplente), saldoAberto: ou('saldoAberto', num(g.saldoAberto), exD.saldoAberto) },
      auditoria: { ultimaIntegral: ou('ultimaIntegral', dataCel(g.ultimaIntegral), exA.ultimaIntegral), dispersaoPct: ou('dispersaoPct', num(g.dispersaoPct), exA.dispersaoPct), statusLivros: ou('statusLivros', semAcento(g.statusLivros), exA.statusLivros) },
      juridico: { acaoContraShopping: ou('acaoContraShopping', simNao(g.acaoContraShopping), exJ.acaoContraShopping), renovatoriaAjuizada: ou('renovatoriaAjuizada', simNao(g.renovatoriaAjuizada), exJ.renovatoriaAjuizada) },
      negociacao: { resistencia: ou('resistencia', simNao(g.resistencia), exN.resistencia) },
      comparativos: { coVendasRedePct: ou('coVendasRedePct', num(g.coVendasRedePct), exP.coVendasRedePct), coVendasSegmentoShoppingPct: ou('coVendasSegmentoShoppingPct', num(g.coVendasSegmentoShoppingPct), exP.coVendasSegmentoShoppingPct), ammM2Entorno: ou('ammM2Entorno', num(g.ammM2Entorno), exP.ammM2Entorno), ammM2Piso: ou('ammM2Piso', num(g.ammM2Piso), exP.ammM2Piso), ammM2Tamanho: ou('ammM2Tamanho', num(g.ammM2Tamanho), exP.ammM2Tamanho), ammM2Concorrentes: ou('ammM2Concorrentes', num(g.ammM2Concorrentes), exP.ammM2Concorrentes), ammM2SegmentoAbrasce: ou('ammM2SegmentoAbrasce', num(g.ammM2SegmentoAbrasce), exP.ammM2SegmentoAbrasce), tabelaAbcM2: ou('tabelaAbcM2', num(g.tabelaAbcM2), exP.tabelaAbcM2) },
      realizado: { ammNovo: ou('ammNovo', num(g.ammNovo), exR.ammNovo), data: ou('dataRenovacao', dataCel(g.dataRenovacao), exR.data), novoFim: ou('novoFim', dataCel(g.novoFim), exR.novoFim) },
      historico: ex.historico || [],
      racionalForaDaCurva: ou('racionalForaDaCurva', String(g.racionalForaDaCurva ?? '').trim(), ex.racionalForaDaCurva),
    }
    if (existente) { Object.assign(existente, loja); atualizadas++ } else { lojas.push(loja); novas++ }
  }
  return { lojas, novas, atualizadas, ignoradas, colunas: mapa, naoReconhecidas }
}
const PARAMS_PLANILHA = [
  ['shopping', /^shopping|nome do shopping/], ['mediaAmmM2Satelites', /amm/], ['mediaVendasM2Satelites', /vendas/], ['inflacaoAcumuladaPct', /inflacao/], ['metaLsrAnualPct', /meta/], ['anoPlanejamento', /^ano/],
  ['janelaAuditoriaMeses', /janela/], ['toleranciaDispersaoPct', /dispers/], ['mesesSazonais', /sazon/], ['lsrAgressivoPct', /lsr agressivo|agressivo %$/], ['lsrMuitoAgressivoPct', /muito/], ['tolerAcimaAbcPct', /abc/],
]
export function importarParamsPlanilha(linhas, paramsAtuais = PARAMS_PADRAO) {
  const p = { ...paramsAtuais }
  let aplicados = 0; const naoReconhecidos = []
  for (const linha of linhas) {
    const vals = Object.values(linha)
    if (vals.length < 2) continue
    const nome = semAcento(vals[0]); const valor = vals[1]
    if (!nome || nome === 'parametro' || nome === 'parametros') continue
    const hit = PARAMS_PLANILHA.find(([k, re]) => !(k === 'lsrAgressivoPct' && /muito/.test(nome)) && re.test(nome))
    if (!hit) { naoReconhecidos.push(vals[0]); continue }
    const k = hit[0]
    if (k === 'shopping') p.shopping = String(valor ?? '').trim()
    else if (k === 'mesesSazonais') p.mesesSazonais = String(valor ?? '').split(/[,;]/).map(s => +s.trim()).filter(n => n >= 1 && n <= 12)
    else p[k] = num(valor)
    aplicados++
  }
  return { params: p, aplicados, naoReconhecidos }
}

/* ------------------------------------------------------------ histórico desde a última renovação (venda, AMM, A%, custo de ocupação) */
// loja.historico = [{ competencia: 'AAAA-MM', vendas, amm, aPct, custoOcupacao }], um registro por mês.
// Janela: da última renovação/entrada (contrato.inicio) até a data de referência; sem início, os últimos 60 meses.
export function normalizarHistorico(lista) {
  return (lista || []).map(r => ({ comp: String(r.competencia ?? r.comp ?? '').trim().slice(0, 7).replace(/^(\d{2})\/(\d{4})$/, '$2-$1'), vendas: num(r.vendas), amm: num(r.amm), aPct: num(r.aPct ?? r.apct ?? r['a%']), co: num(r.custoOcupacao ?? r.co) }))
    .filter(r => /^\d{4}-\d{2}$/.test(r.comp)).sort((a, b) => a.comp.localeCompare(b.comp))
    .filter((r, i, arr) => i === arr.findIndex(x => x.comp === r.comp))
}
export function historico(loja, params = PARAMS_PADRAO, hoje = new Date()) {
  const todos = normalizarHistorico(loja.historico)
  const hojeIso = iso(hoje).slice(0, 7)
  const inicio = data(loja.contrato?.inicio)
  const inicioComp = inicio ? iso(inicio).slice(0, 7) : iso(somaMeses(hoje, -60)).slice(0, 7)
  const linhas = todos.filter(r => r.comp >= inicioComp && r.comp <= hojeIso)
  const sazonais = params.mesesSazonais || [12]
  const mes = (c) => +c.slice(5, 7)
  if (!linhas.length) return { disponivel: false, meses: 0, inicio: inicioComp, origem: inicio ? 'última renovação / entrada' : 'últimos 60 meses', anos: [], ultimos12: null, primeiro: null, deltaCoVendas: null, linhas: [], derivado: {} }
  // agrupa por ano de contrato (12 meses a partir do início)
  const grupos = new Map()
  for (const r of linhas) {
    const k = Math.floor(Math.max(0, mesesEntre(inicioComp + '-01', r.comp + '-01') + 0.01) / 12)
    if (!grupos.has(k)) grupos.set(k, [])
    grupos.get(k).push(r)
  }
  const agrega = (rs) => {
    const vendas = rs.reduce((s, r) => s + (r.vendas || 0), 0), co = rs.reduce((s, r) => s + (r.co || 0), 0), aPct = rs.reduce((s, r) => s + (r.aPct || 0), 0)
    const comAmm = rs.filter(r => r.amm !== null), comVendas = rs.filter(r => r.vendas !== null)
    return { meses: rs.length, de: rs[0].comp, ate: rs[rs.length - 1].comp, vendas, vendasMes: comVendas.length ? vendas / comVendas.length : null, co, coMes: rs.filter(r => r.co !== null).length ? co / rs.filter(r => r.co !== null).length : null, aPct, mesesComAPct: rs.filter(r => (r.aPct || 0) > 0).length, ammMedio: comAmm.length ? comAmm.reduce((s, r) => s + r.amm, 0) / comAmm.length : null, coVendas: vendas && rs.some(r => r.co !== null) ? co / vendas : null }
  }
  const anos = [...grupos.entries()].sort((a, b) => a[0] - b[0]).map(([k, rs]) => ({ ano: k + 1, rotulo: `Ano ${k + 1}`, ...agrega(rs) }))
  const u12 = linhas.slice(-12)
  const ultimos12 = agrega(u12)
  const naoSazonal = u12.filter(r => !sazonais.includes(mes(r.comp)) && r.vendas !== null)
  ultimos12.vendasMediaExpurgada = naoSazonal.length ? naoSazonal.reduce((s, r) => s + r.vendas, 0) / naoSazonal.length : ultimos12.vendasMes
  const semDez = u12.filter(r => mes(r.comp) !== 12 && r.aPct !== null)
  ultimos12.aPctMedioSemDezembro = semDez.length ? semDez.reduce((s, r) => s + r.aPct, 0) / semDez.length : null
  ultimos12.ammUltimo = [...u12].reverse().find(r => r.amm !== null)?.amm ?? null
  // período inicial de referência: os primeiros 12 meses (mínimo 6) após a renovação/entrada
  const p12 = linhas.slice(0, 12)
  const primeiro = p12.length >= 6 && linhas.length > 12 ? agrega(p12) : null
  const deltaCoVendas = primeiro && primeiro.coVendas !== null && ultimos12.coVendas !== null ? ultimos12.coVendas - primeiro.coVendas : null
  const derivado = { vendas12mExpurgada: ultimos12.vendasMediaExpurgada, custoOcupacao: ultimos12.coMes, aPctMedioSemDezembro: ultimos12.aPctMedioSemDezembro, amm: ultimos12.ammUltimo, pagaVariavel: ultimos12.mesesComAPct > 0, mesesComAPct: ultimos12.mesesComAPct }
  return { disponivel: true, meses: linhas.length, inicio: inicioComp, origem: inicio ? 'última renovação / entrada' : 'últimos 60 meses', anos, ultimos12, primeiro, deltaCoVendas, linhas, derivado, crescimentoVendas: primeiro && primeiro.vendasMes && ultimos12.vendasMes ? ultimos12.vendasMes / primeiro.vendasMes - 1 : null }
}
// Preenche o que o cadastro deixou em branco com o que sai do histórico (marcando a origem)
export function enriquecer(loja, hist) {
  if (!hist?.disponivel) return { loja, derivados: [] }
  const d = hist.derivado, derivados = []
  const l = { ...loja, faturamento: { ...(loja.faturamento || {}) }, desempenho: { ...(loja.desempenho || {}) } }
  if (num(l.faturamento.amm) === null && d.amm !== null) { l.faturamento.amm = d.amm; derivados.push('AMM do último mês') }
  if (num(l.faturamento.aPctMedioSemDezembro) === null && d.aPctMedioSemDezembro !== null) { l.faturamento.aPctMedioSemDezembro = d.aPctMedioSemDezembro; derivados.push('A% médio sem dezembro') }
  if (num(l.desempenho.vendas12mExpurgada) === null && d.vendas12mExpurgada !== null) { l.desempenho.vendas12mExpurgada = d.vendas12mExpurgada; derivados.push('vendas média 12 meses expurgada') }
  if (num(l.desempenho.custoOcupacao) === null && d.custoOcupacao !== null) { l.desempenho.custoOcupacao = d.custoOcupacao; derivados.push('custo de ocupação') }
  return { loja: l, derivados }
}
// Argumento 5 — queda do custo de ocupação desde a última renovação (pedido do usuário; não está no Book)
export function argumentoHistorico(loja, hist) {
  const amm = num(loja.faturamento?.amm)
  const falt = []
  if (!hist?.disponivel) falt.push('histórico mensal de vendas e custo de ocupação desde a última renovação')
  else if (!hist.primeiro) falt.push('histórico com pelo menos 18 meses (12 iniciais + 12 recentes) para comparar CO/Vendas')
  else if (hist.deltaCoVendas === null) falt.push('custo de ocupação no histórico')
  let inc = null, detalhe = 'sem base'
  if (hist?.disponivel && hist.primeiro && hist.deltaCoVendas !== null && amm) {
    const dif = -hist.deltaCoVendas
    if (dif > 0) { inc = dif * hist.ultimos12.vendasMes / amm; detalhe = `CO/Vendas caiu de ${pct(hist.primeiro.coVendas)} (${hist.primeiro.de} a ${hist.primeiro.ate}) para ${pct(hist.ultimos12.coVendas)} (últimos 12 m) → dif. ${pct(dif)} × vendas ${brl(hist.ultimos12.vendasMes)}/mês = ${brl(dif * hist.ultimos12.vendasMes)} → ÷ AMM ${brl(amm)} = ${pct(inc)}` }
    else { inc = 0; detalhe = `CO/Vendas subiu de ${pct(hist.primeiro.coVendas)} para ${pct(hist.ultimos12.coVendas)}: a loja ficou mais pesada, não há argumento aqui` }
  }
  return { n: 5, nome: 'Queda do custo de ocupação', tipo: 'Histórico CO/Vendas', incremento: inc, usavel: inc !== null && inc > 0, detalhe, faltantes: falt, indicadores: [{ k: 'CO/Vendas inicial', v: hist?.primeiro?.coVendas ?? null }, { k: 'CO/Vendas últimos 12 m', v: hist?.ultimos12?.coVendas ?? null }], origem: 'sistema' }
}
export function parseHistoricoTexto(txt) {
  const out = []
  for (const linha of String(txt || '').split(/\r?\n/)) {
    const c = linha.split(/[;\t,]/).map(s => s.trim())
    if (c.length < 2 || !/^\d{4}-\d{2}|^\d{2}\/\d{4}/.test(c[0])) continue
    out.push({ competencia: c[0], vendas: num(c[1]), amm: num(c[2]), aPct: num(c[3]), custoOcupacao: num(c[4]) })
  }
  return normalizarHistorico(out).map(r => ({ competencia: r.comp, vendas: r.vendas, amm: r.amm, aPct: r.aPct, custoOcupacao: r.co }))
}
export function historicoTexto(lista) { return normalizarHistorico(lista).map(r => [r.comp, r.vendas ?? '', r.amm ?? '', r.aPct ?? '', r.co ?? ''].join(';')).join('\n') }
// Planilha: aba Historico com LUC · Competência · Vendas · AMM · A% · Custo de ocupação
export function importarHistoricoPlanilha(linhas, lojas) {
  if (!linhas.length) return { lojas, meses: 0, lojasAtualizadas: 0, semLoja: [] }
  const cab = Object.keys(linhas[0])
  const col = (re) => cab.find(h => re.test(semAcento(h)))
  const cLuc = col(/^luc$/), cComp = col(/compet|mes|periodo/), cV = col(/venda/), cAmm = col(/^amm/), cA = col(/^a ?%|percentual|variavel/), cCo = col(/custo|ocupacao|^co$/)
  if (!cLuc || !cComp) return { lojas, meses: 0, lojasAtualizadas: 0, semLoja: [], erro: 'a aba Historico precisa das colunas LUC e Competência' }
  const porLuc = new Map()
  for (const r of linhas) {
    const luc = String(r[cLuc] ?? '').trim(); if (!luc) continue
    let comp = r[cComp]
    if (typeof comp === 'number') comp = dataCel(comp).slice(0, 7)
    else if (comp instanceof Date) comp = iso(comp).slice(0, 7)
    else comp = String(comp).trim()
    if (!porLuc.has(luc)) porLuc.set(luc, [])
    porLuc.get(luc).push({ competencia: comp, vendas: num(cV ? r[cV] : null), amm: num(cAmm ? r[cAmm] : null), aPct: num(cA ? r[cA] : null), custoOcupacao: num(cCo ? r[cCo] : null) })
  }
  let meses = 0, lojasAtualizadas = 0; const semLoja = []
  for (const [luc, regs] of porLuc) {
    const loja = lojas.find(l => l.luc === luc)
    if (!loja) { semLoja.push(luc); continue }
    const h = normalizarHistorico(regs).map(r => ({ competencia: r.comp, vendas: r.vendas, amm: r.amm, aPct: r.aPct, custoOcupacao: r.co }))
    loja.historico = h; meses += h.length; lojasAtualizadas++
  }
  return { lojas, meses, lojasAtualizadas, semLoja }
}

/* ============================================================ PERÍCIA — método comparativo, laudo prévio e linearidade
   Fonte: "Aspectos técnicos da perícia judicial em avaliações de lojas em shopping centers" (Rodrigo Salton Leites, 2025).
   Comparáveis devem ser SIMILARES (área, localização, condições contratuais) e CONTEMPORÂNEOS (contrato recente, sem
   evento estrutural no meio). A média do shopping pode esconder grupos: medir a LINEARIDADE. O LAUDO PRÉVIO estima o
   provável resultado da perícia antes da renovatória. Tudo aqui é [PERÍCIA]: deriva da apresentação, não do Book. */
export const PARAMS_PERICIA = {
  contemporaneidadeMeses: 36,     // contrato (início ou renovação) com mais que isso perde representatividade
  similaridadeAreaPct: 50,        // comparável: área entre (1−x%) e (1+x%) da loja avaliada
  faixasArea: [50, 100, 200],     // limites das faixas de área (m²) para linearidade: ≤50 · 50–100 · 100–200 · >200
  eventosEstruturais: [],         // [{ data: 'AAAA-MM-DD', descricao }] — reforma, expansão, sinistro, pandemia
  cvLinear: 0.15, cvDisperso: 0.30, // coeficiente de variação do AMM/m²: abaixo = linear; acima = disperso
  minimoComparaveis: 3,
}
export const CHECKLIST_PERICIA = [
  'O método utilizado é o Método Comparativo Direto de Dados de Mercado?',
  'Os elementos comparativos pertencem ao mesmo shopping ou a universo efetivamente comparável?',
  'As áreas são suficientemente semelhantes?',
  'A localização interna (piso, setor) foi considerada?',
  'As estruturas contratuais são comparáveis (AMM, CTO, CMM, subsídios)?',
  'Os contratos são contemporâneos à data-base da avaliação?',
  'Houve mudança estrutural no shopping desde a assinatura dos comparáveis?',
  'Houve evento extraordinário relevante (pandemia, reforma, acidente)?',
  'O tratamento inflacionário é coerente com a realidade econômica do período?',
  'Existem outliers ou grupos claramente diferentes dentro da amostra?',
  'A média utilizada representa a distribuição ou esconde forte dispersão?',
  'Os fatores de homogeneização têm justificativa econômica e técnica?',
  'A tipologia da loja (satélite, megaloja, âncora) foi respeitada?',
  'O perito justificou a seleção ou exclusão dos comparáveis?',
  'Existe laudo prévio para confrontar o resultado da perícia?',
]
const quantil = (arr, q) => { if (!arr.length) return null; const s = [...arr].sort((a, b) => a - b); const pos = (s.length - 1) * q; const lo = Math.floor(pos), hi = Math.ceil(pos); return s[lo] + (s[hi] - s[lo]) * (pos - lo) }
export function estatisticas(vals) {
  const v = vals.filter(x => x !== null && Number.isFinite(x))
  if (!v.length) return { n: 0, media: null, mediana: null, q1: null, q3: null, min: null, max: null, desvio: null, cv: null }
  const media = v.reduce((s, x) => s + x, 0) / v.length
  const desvio = v.length > 1 ? Math.sqrt(v.reduce((s, x) => s + (x - media) ** 2, 0) / (v.length - 1)) : 0
  return { n: v.length, media, mediana: quantil(v, 0.5), q1: quantil(v, 0.25), q3: quantil(v, 0.75), min: Math.min(...v), max: Math.max(...v), desvio, cv: media ? desvio / media : null }
}
export function faixaArea(area, limites = PARAMS_PERICIA.faixasArea) {
  const a = num(area); if (a === null) return null
  const l = [...limites].sort((x, y) => x - y)
  for (let i = 0; i < l.length; i++) if (a <= l[i]) return i === 0 ? `até ${l[0]} m²` : `${l[i - 1]}–${l[i]} m²`
  return `acima de ${l[l.length - 1]} m²`
}
// data que vale como "data do contrato" para contemporaneidade: renovação registrada > início da vigência
export function dataContrato(loja) { return data(loja.realizado?.data) || data(loja.contrato?.inicio) }
// Universo de comparáveis intra-shopping para uma loja: satélites ativas, com AMM/m² conhecido, sem subsídio
export function comparaveis(loja, lojas, params = {}, hoje = new Date()) {
  const p = { ...PARAMS_PERICIA, ...params }
  const area = num(loja.area)
  const eventos = (p.eventosEstruturais || []).map(e => ({ ...e, d: data(e.data) })).filter(e => e.d)
  const ultimoEvento = eventos.length ? eventos.reduce((m, e) => (e.d > m.d ? e : m)) : null
  const amostra = []
  for (const l of lojas) {
    if (l === loja || l.id === loja.id) continue
    const a = num(l.area), amm = num(l.realizado?.ammNovo) ?? num(l.faturamento?.amm)
    const motivos = []
    if ((l.formato || 'satelite') !== 'satelite') motivos.push('tipologia diferente')
    if (l.status === 'nao-renovado') motivos.push('loja saiu')
    if (!a || amm === null) motivos.push('sem área ou AMM')
    if ((l.contrato?.subsidios || []).length) motivos.push('contrato com subsídio')
    if (l.contrato?.comercial === false) motivos.push('contrato não comercial (CDU)')
    const dc = dataContrato(l)
    const idade = dc ? mesesEntre(dc, hoje) : null
    const contemporaneo = idade !== null && idade <= p.contemporaneidadeMeses
    const anteriorEvento = ultimoEvento && dc ? dc < ultimoEvento.d : false
    if (idade === null) motivos.push('sem data de contrato')
    else if (!contemporaneo) motivos.push(`contrato com ${Math.round(idade)} meses (> ${p.contemporaneidadeMeses})`)
    if (anteriorEvento) motivos.push(`anterior a ${ultimoEvento.descricao || 'evento estrutural'} (${iso(ultimoEvento.d)})`)
    const similarArea = area && a ? a >= area * (1 - p.similaridadeAreaPct / 100) && a <= area * (1 + p.similaridadeAreaPct / 100) : false
    if (area && !similarArea) motivos.push(`área ${a} m² fora de ±${p.similaridadeAreaPct}% de ${area} m²`)
    const mesmoPiso = !!loja.piso && String(l.piso || '') === String(loja.piso)
    amostra.push({ luc: l.luc, nome: l.nome, area: a, piso: l.piso || '', segmento: l.segmento || '', ammM2: a && amm !== null ? amm / a : null, dataContrato: iso(dc), idadeMeses: idade === null ? null : Math.round(idade), contemporaneo, anteriorEvento, similarArea, mesmoPiso, renovado: l.status === 'renovado', incluido: motivos.length === 0, motivos })
  }
  const incluidos = amostra.filter(x => x.incluido)
  // outliers pela regra de 1,5 × IQR dentro dos incluídos
  const st0 = estatisticas(incluidos.map(x => x.ammM2))
  let outliers = []
  if (st0.n >= 4) { const iqr = st0.q3 - st0.q1; outliers = incluidos.filter(x => x.ammM2 < st0.q1 - 1.5 * iqr || x.ammM2 > st0.q3 + 1.5 * iqr); for (const o of outliers) { o.incluido = false; o.motivos.push('outlier (1,5 × IQR)') } }
  const finais = amostra.filter(x => x.incluido)
  const st = estatisticas(finais.map(x => x.ammM2))
  // grupos: maior salto entre valores ordenados > 35% do valor indica dois agrupamentos (Shopping B do exemplo)
  let grupos = null
  if (st.n >= 4) { const s = finais.map(x => x.ammM2).sort((a, b) => a - b); let maior = 0, idx = -1; for (let i = 1; i < s.length; i++) { const salto = (s[i] - s[i - 1]) / s[i - 1]; if (salto > maior) { maior = salto; idx = i } } if (maior > 0.35 && idx >= 2 && s.length - idx >= 2) grupos = { salto: maior, inferior: estatisticas(s.slice(0, idx)), superior: estatisticas(s.slice(idx)) } }
  const mesmoPisoSt = estatisticas(finais.filter(x => x.mesmoPiso).map(x => x.ammM2))
  return { amostra: amostra.sort((x, y) => (y.incluido - x.incluido) || (x.ammM2 ?? 0) - (y.ammM2 ?? 0)), finais, n: st.n, stats: st, mesmoPiso: mesmoPisoSt, outliers, grupos, suficiente: st.n >= (p.minimoComparaveis || 3), eventoReferencia: ultimoEvento ? { data: iso(ultimoEvento.d), descricao: ultimoEvento.descricao } : null, params: { contemporaneidadeMeses: p.contemporaneidadeMeses, similaridadeAreaPct: p.similaridadeAreaPct } }
}
// Laudo prévio: provável valor locativo pela mediana dos comparáveis, faixa interquartil, posição do atual e do proposto
export function laudoPrevio(loja, comp, ammAtual, ammProposto) {
  const area = num(loja.area)
  if (!comp.suficiente || !area) return { disponivel: false, veredito: 'insuficiente', motivo: comp.n ? `${comp.n} comparável(is) após os filtros de similaridade e contemporaneidade; mínimo ${PARAMS_PERICIA.minimoComparaveis}. Buscar comparáveis externos (segmento Abrasce, Tabela ABC) ou revisar filtros.` : 'Nenhum comparável intra-shopping após os filtros.', n: comp.n }
  const s = comp.stats
  const provavel = s.mediana * area, faixa = [s.q1 * area, s.q3 * area], teto = s.max * area
  const posicao = (v) => v === null ? null : comp.finais.filter(x => x.ammM2 <= v / area).length / comp.n
  const pAtual = posicao(ammAtual), pProp = posicao(ammProposto)
  let veredito = 'indefinido', motivo = ''
  if (ammProposto !== null) {
    const propM2 = ammProposto / area
    if (propM2 <= s.q3) { veredito = 'forte'; motivo = `AMM/m² proposto ${brl(propM2)} até o 3º quartil dos comparáveis (${brl(s.q3)}): laudo tende a sustentar a proposta` }
    else if (propM2 <= s.max) { veredito = 'atencao'; motivo = `AMM/m² proposto ${brl(propM2)} acima do 3º quartil (${brl(s.q3)}) mas dentro da amostra (máx. ${brl(s.max)}): defensável só com comparáveis do topo` }
    else { veredito = 'fragil'; motivo = `AMM/m² proposto ${brl(propM2)} acima do maior comparável (${brl(s.max)}): o laudo tende a dar razão ao lojista, apertar menos` }
    if (comp.grupos) motivo += ` · amostra bimodal (grupos em ~${brl(comp.grupos.inferior.mediana)} e ~${brl(comp.grupos.superior.mediana)}/m²): a média não representa; o perito pode escolher o grupo inferior`
  }
  return { disponivel: true, n: comp.n, provavel, faixa, teto, medianaM2: s.mediana, q1M2: s.q1, q3M2: s.q3, maxM2: s.max, cv: s.cv, posicaoAtual: pAtual, posicaoProposto: pProp, veredito, motivo, bimodal: !!comp.grupos, mesmoPiso: comp.mesmoPiso.n ? comp.mesmoPiso : null }
}
// Linearidade do shopping: dispersão do AMM/m² das satélites, por faixa de área e por piso, com lojas fora da curva
export function linearidade(lojas, params = {}, hoje = new Date()) {
  const p = { ...PARAMS_PERICIA, ...params }
  const base = lojas.filter(l => (l.formato || 'satelite') === 'satelite' && l.status !== 'nao-renovado' && num(l.area) && (num(l.realizado?.ammNovo) ?? num(l.faturamento?.amm)) !== null)
    .map(l => { const amm = num(l.realizado?.ammNovo) ?? num(l.faturamento?.amm); const dc = dataContrato(l); const idade = dc ? Math.round(mesesEntre(dc, hoje)) : null; return { id: l.id, luc: l.luc, nome: l.nome, area: num(l.area), piso: String(l.piso || '—'), ammM2: amm / num(l.area), faixa: faixaArea(l.area, p.faixasArea), idadeMeses: idade, contemporaneo: idade !== null && idade <= p.contemporaneidadeMeses, subsidio: (l.contrato?.subsidios || []).length > 0, racional: l.racionalForaDaCurva || '' } })
  const geral = estatisticas(base.map(x => x.ammM2))
  const classif = (cv) => cv === null ? 'indefinida' : cv < p.cvLinear ? 'linear' : cv < p.cvDisperso ? 'moderada' : 'dispersa'
  const porChave = (k) => { const m = new Map(); for (const x of base) { const key = x[k]; if (!m.has(key)) m.set(key, []); m.get(key).push(x) } return [...m.entries()].map(([chave, xs]) => ({ chave, lojas: xs, stats: estatisticas(xs.map(x => x.ammM2)), classif: classif(estatisticas(xs.map(x => x.ammM2)).cv) })) }
  const ordemFaixa = (f) => { const l = [...p.faixasArea].sort((a, b) => a - b); const labels = [`até ${l[0]} m²`, ...l.slice(1).map((v, i) => `${l[i]}–${v} m²`), `acima de ${l[l.length - 1]} m²`]; return labels.indexOf(f) }
  const porFaixa = porChave('faixa').sort((a, b) => ordemFaixa(a.chave) - ordemFaixa(b.chave))
  const porPiso = porChave('piso').sort((a, b) => a.chave.localeCompare(b.chave))
  // fora da curva: fora de 1,5 × IQR da própria faixa de área (ou do geral, se a faixa tiver menos de 4 lojas)
  const fora = []
  for (const x of base) {
    const f = porFaixa.find(g => g.chave === x.faixa); const ref = f && f.stats.n >= 4 ? f.stats : geral
    if (ref.n < 4) continue
    const iqr = ref.q3 - ref.q1, lo = ref.q1 - 1.5 * iqr, hi = ref.q3 + 1.5 * iqr
    if (x.ammM2 < lo || x.ammM2 > hi) fora.push({ ...x, referencia: f && f.stats.n >= 4 ? `faixa ${x.faixa}` : 'shopping', mediana: ref.mediana, desvioPct: x.ammM2 / ref.mediana - 1, lado: x.ammM2 > hi ? 'acima' : 'abaixo' })
  }
  // teste do exemplo Shopping A/B: faixa ±30% da média vs. distribuição real
  const dentro30 = geral.n ? base.filter(x => Math.abs(x.ammM2 / geral.media - 1) <= 0.30).length / geral.n : null
  return { base: base.sort((a, b) => a.ammM2 - b.ammM2), geral: { ...geral, classif: classif(geral.cv) }, porFaixa, porPiso, fora: fora.sort((a, b) => Math.abs(b.desvioPct) - Math.abs(a.desvioPct)), dentro30, naoContemporaneos: base.filter(x => !x.contemporaneo).length, params: p }
}


/* ------------------------------------------------------------ [PERÍCIA] risco de perda em ação renovatória (visão de laudo)
   Confronta a proposta com o laudo prévio. Se a renovatória for ajuizada, o perito tende a chegar perto do valor provável;
   quanto mais a proposta passa do que os comparáveis sustentam, maior a chance de sentença abaixo dela, com sucumbência e
   honorários para o shopping. Classificação em alto / moderado / baixo conforme a saída do cálculo. */
export const PARAMS_PERDA = { perdaGapModeradoPct: 10, perdaGapAltoPct: 25, probabilidadePerda: { alto: 0.6, moderado: 0.3, baixo: 0.1 } }
export function riscoPerda(loja, laudo, prop, jan, lsr, params = {}) {
  const p = { ...PARAMS_PERDA, ...params }
  const area = num(loja.area)
  const atual = prop.ammAtual, proposto = prop.ammProposto
  const out = { nivel: 'indefinido', motivos: [], gapLaudo: null, gapAtual: null, defensavel: null, ajuste: null, receitaEmRisco: null, perdaEsperada: null, laudoAbaixoDoAtual: false, disponivel: false }
  if (proposto === null) { out.motivos.push('sem proposta calculável'); return out }
  if (!laudo?.disponivel) {
    // sem laudo: classifica pelo que resta — LSR agressivo e renovatória ajuizada
    out.motivos.push(`sem laudo prévio (${laudo?.motivo || 'comparáveis insuficientes'})`)
    const lsrPct = lsr?.lsrTotal !== null && lsr?.lsrTotal !== undefined ? lsr.lsrTotal * 100 : null
    if (loja.juridico?.renovatoriaAjuizada) { out.nivel = 'alto'; out.motivos.push('renovatória ajuizada sem laudo para confrontar o perito') }
    else if (lsrPct !== null && lsrPct >= (params.lsrMuitoAgressivoPct || 40)) { out.nivel = 'alto'; out.motivos.push(`LSR total ${pct(lsr.lsrTotal)} muito agressivo sem base comparativa`) }
    else if (lsrPct !== null && lsrPct >= (params.lsrAgressivoPct || 25)) { out.nivel = 'moderado'; out.motivos.push(`LSR total ${pct(lsr.lsrTotal)} agressivo sem base comparativa`) }
    else { out.nivel = 'moderado'; out.motivos.push('proposta sem laudo: montar comparáveis antes de negociar abaixo de 12 meses') }
    return out
  }
  out.disponivel = true
  out.gapLaudo = proposto / laudo.provavel - 1
  out.gapAtual = atual ? laudo.provavel / atual - 1 : null
  out.defensavel = laudo.q3M2 * area                  // até onde o laudo tende a sustentar
  out.ajuste = Math.max(0, proposto - out.defensavel)   // quanto a proposta excede o defensável
  out.receitaEmRisco = Math.max(0, proposto - laudo.provavel) * 60   // se a sentença vier no valor provável, por 60 meses
  out.laudoAbaixoDoAtual = atual !== null && laudo.provavel < atual
  const propM2 = proposto / area
  let nivel = 'baixo'
  if (propM2 > laudo.maxM2) { nivel = 'alto'; out.motivos.push(`proposto ${brl(propM2)}/m² acima do maior comparável (${brl(laudo.maxM2)}/m²)`) }
  if (out.gapLaudo * 100 > p.perdaGapAltoPct) { nivel = 'alto'; out.motivos.push(`proposta ${pct(out.gapLaudo)} acima do valor provável do laudo (${brl(laudo.provavel)})`) }
  else if (out.gapLaudo * 100 > p.perdaGapModeradoPct && nivel !== 'alto') { nivel = 'moderado'; out.motivos.push(`proposta ${pct(out.gapLaudo)} acima do valor provável do laudo`) }
  if (propM2 > laudo.q3M2 && nivel === 'baixo') { nivel = 'moderado'; out.motivos.push(`proposto acima do 3º quartil (${brl(laudo.q3M2)}/m²): só os comparáveis do topo sustentam`) }
  if (out.laudoAbaixoDoAtual) { nivel = 'alto'; out.motivos.push(`laudo provável (${brl(laudo.provavel)}) ABAIXO do AMM atual (${brl(atual)}): a renovatória pode reduzir o aluguel`) }
  if (laudo.bimodal && nivel !== 'alto') { nivel = 'moderado'; out.motivos.push('amostra bimodal: o perito pode escolher o grupo inferior') }
  if (loja.juridico?.renovatoriaAjuizada && nivel === 'baixo') { nivel = 'moderado'; out.motivos.push('renovatória já ajuizada: contraproposta vincula') }
  if (jan?.meses !== null && jan?.meses <= 12 && jan?.meses > 6 && nivel === 'alto') out.motivos.push('dentro da janela de ajuizamento (12 a 6 meses)')
  if (!out.motivos.length) out.motivos.push(`proposto ${brl(propM2)}/m² até o 3º quartil dos comparáveis: o laudo tende a sustentar`)
  out.nivel = nivel
  out.perdaEsperada = out.receitaEmRisco * (p.probabilidadePerda[nivel] ?? 0)
  return out
}

Object.assign(PARAMS_PADRAO, PARAMS_PERICIA, PARAMS_PERDA)
