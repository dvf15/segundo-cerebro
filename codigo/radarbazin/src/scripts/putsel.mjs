/**
 * Motor de seleção de puts para "dividendo sintético" (venda de put coberta
 * por caixa) numa carteira previdenciária. Módulo puro: não acessa rede.
 *
 * Entrada: preço à vista, lista de puts (strike, vencimento, último, bid, ask,
 * negócios, contratos em aberto), volatilidade realizada, taxa livre de risco,
 * teto Bazin e suporte técnico do papel.
 *
 * Saída: cada put avaliada com preço justo (Black-Scholes), delta, prob. de
 * exercício, yield sobre o caixa (período e anualizado), preço ideal de venda,
 * nota (0-100) e classificação; e a lista ordenada da melhor para a pior.
 */

// Normal acumulada (Abramowitz-Stegun, erro < 7.5e-8)
export function N(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989422804014327 * Math.exp(-x * x / 2);
  const p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return x >= 0 ? 1 - p : p;
}

/** Preço e gregas de uma put europeia (Black-Scholes, sem dividendo discreto). */
export function putBS(S, K, T, r, sigma) {
  if (!(S > 0 && K > 0 && T > 0 && sigma > 0)) return null;
  const sq = sigma * Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / sq;
  const d2 = d1 - sq;
  const preco = K * Math.exp(-r * T) * N(-d2) - S * N(-d1);
  return { preco, delta: N(d1) - 1, probExercicio: N(-d2), d1, d2 };
}

/** Volatilidade implícita de uma put por bissecção (retorna null se não converge). */
export function volImplicita(precoMercado, S, K, T, r) {
  if (!(precoMercado > 0 && S > 0 && K > 0 && T > 0)) return null;
  const intrinseco = Math.max(K * Math.exp(-r * T) - S, 0);
  if (precoMercado <= intrinseco + 1e-6) return null;
  let lo = 0.01, hi = 4;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    const p = putBS(S, K, T, r, mid).preco;
    if (Math.abs(p - precoMercado) < 1e-5) return mid;
    if (p > precoMercado) hi = mid; else lo = mid;
  }
  return (lo + hi) / 2;
}

/** Volatilidade realizada anualizada a partir de fechamentos diários (janela em pregões). */
export function volRealizada(fechamentos, janela = 21) {
  const c = fechamentos.filter((x) => typeof x === "number" && x > 0).slice(-(janela + 1));
  if (c.length < Math.min(janela, 10) + 1) return null;
  const r = [];
  for (let i = 1; i < c.length; i++) r.push(Math.log(c[i] / c[i - 1]));
  const m = r.reduce((s, x) => s + x, 0) / r.length;
  const v = r.reduce((s, x) => s + (x - m) ** 2, 0) / (r.length - 1);
  return Math.sqrt(v * 252);
}

export function diasUteis(de, ate) {
  let n = 0;
  const d = new Date(Date.UTC(de.getUTCFullYear(), de.getUTCMonth(), de.getUTCDate()));
  const fim = new Date(Date.UTC(ate.getUTCFullYear(), ate.getUTCMonth(), ate.getUTCDate()));
  while (d < fim) { d.setUTCDate(d.getUTCDate() + 1); const w = d.getUTCDay(); if (w !== 0 && w !== 6) n += 1; }
  return n;
}

/**
 * Regras da carteira previdenciária (o que torna uma put "boa" para renda):
 *  - vencimento entre 15 e 60 dias corridos (ideal 25-45): theta trabalha a favor
 *    sem prender o caixa por muito tempo;
 *  - strike abaixo do preço (OTM) entre 3% e 15%, ideal 5-10%: colchão contra
 *    a queda, mas prêmio ainda relevante;
 *  - delta entre -0,10 e -0,35 (prob. de exercício ~10-35%);
 *  - strike no máximo no teto Bazin (se exercido, compra abaixo do teto = compra
 *    que a carteira faria de qualquer jeito) — bônus se abaixo do suporte;
 *  - liquidez mínima: 10 negócios no dia (ou 300 contratos em aberto); abaixo
 *    disso a série é classificada como "evitar" e nunca vira a melhor escolha;
 *  - retorno anualizado sobre o caixa reservado acima do CDI é o objetivo;
 *    abaixo de 60% do CDI, não compensa o risco.
 */
export const REGRAS = {
  diasMin: 15, diasMax: 60, diasIdeal: [25, 45],
  otmMin: 0.03, otmMax: 0.15, otmIdeal: [0.05, 0.10],
  deltaMin: -0.35, deltaMax: -0.10,
  liquidezMinNegocios: 10, liquidezMinAberto: 300,
};

/**
 * Avalia e ordena as puts de um papel.
 * @param {object} p
 * @param {number} p.spot preço à vista
 * @param {Array} p.puts [{codigo, strike, vencimento(ISO), ultimo, bid, ask, negocios, aberto, volume}]
 * @param {number} p.vol volatilidade realizada anualizada (ex.: 0.28)
 * @param {number} p.taxa taxa livre de risco anual (ex.: 0.15 = CDI)
 * @param {number|null} p.teto preço-teto Bazin
 * @param {number|null} p.suporte suporte técnico
 * @param {Date} p.hoje
 * @param {number} p.lote tamanho do contrato (B3: 100; EUA: 100)
 */
export function avaliarPuts({ spot, puts, vol, vol63 = null, taxa, teto, suporte, hoje = new Date(), lote = 100 }) {
  const R = REGRAS;
  // vol de referência: média da realizada de 21 e de 63 pregões (menos ruidosa que só a curta)
  const sigmaBase = vol > 0 && vol63 > 0 ? (vol + vol63) / 2 : vol > 0 ? vol : vol63 > 0 ? vol63 : 0.30;
  const avaliadas = [];
  for (const o of puts) {
    const venc = new Date(o.vencimento + "T00:00:00Z");
    const dias = Math.round((venc - hoje) / 86400000);
    if (!(dias > 0) || !(o.strike > 0)) continue;
    const T = dias / 365;
    const otm = 1 - o.strike / spot; // >0 quando strike abaixo do preço
    const ultimo = o.ultimo > 0 ? o.ultimo : null;
    const bid = o.bid > 0 ? o.bid : null, ask = o.ask > 0 ? o.ask : null;
    const mid = bid && ask ? (bid + ask) / 2 : null;

    // vol de referência: implícita do mercado (se houver preço) limitada a
    // [0,7x ; 1,6x] da realizada, para não herdar preço lixo; senão a realizada
    const refPreco = mid ?? ultimo;
    let sigma = sigmaBase;
    const iv = refPreco ? volImplicita(refPreco, spot, o.strike, T, taxa) : null;
    if (iv) sigma = Math.min(Math.max(iv, sigmaBase * 0.7), sigmaBase * 1.6);
    const bs = putBS(spot, o.strike, T, taxa, sigma);
    const justo = bs?.preco ?? null;

    // preço ideal de venda = limite da ordem. É o maior entre:
    //  a) o justo teórico com a vol realizada (média 21/63 pregões) + 5% de
    //     margem: não vender abaixo do que a volatilidade recente justifica;
    //  b) o prêmio que faz a put, sozinha, render a taxa livre de risco no
    //     período sobre o caixa reservado (o strike). Como o caixa segue
    //     aplicado à taxa, a operação dobra a renda do caixa — essa é a meta;
    //  c) o bid atual, se houver (nunca abaixo do que já pagam).
    // Se o mercado (último/mid) está acima do ideal, vale vender; se está
    // abaixo, deixa a ordem limitada no ideal e espera.
    const alvoAnual = taxa;
    const justoRealizada = putBS(spot, o.strike, T, taxa, sigmaBase)?.preco ?? 0;
    const premioAlvo = o.strike * (Math.pow(1 + alvoAnual, dias / 365) - 1);
    let ideal = Math.max(justoRealizada * 1.05, premioAlvo, bid ?? 0);
    ideal = Math.max(ideal, 0.01);

    const premioRef = ultimo ?? mid ?? ideal;
    const yieldPeriodo = premioRef / o.strike;              // sobre o caixa reservado (strike)
    const yieldAnual = Math.pow(1 + yieldPeriodo, 365 / dias) - 1;
    const yieldIdealAnual = Math.pow(1 + ideal / o.strike, 365 / dias) - 1;
    const breakeven = o.strike - premioRef;
    const delta = bs?.delta ?? null;
    const probEx = bs?.probExercicio ?? null;
    const liquido = (o.negocios ?? 0) >= R.liquidezMinNegocios || (o.aberto ?? 0) >= R.liquidezMinAberto;

    // ---- nota 0-100
    let nota = 0; const motivos = [];
    // 1. retorno anualizado vs taxa (0-35)
    const rel = taxa > 0 ? yieldAnual / taxa : yieldAnual / 0.1;
    nota += Math.max(0, Math.min(35, rel * 23.33));
    if (rel < 0.6) motivos.push(`prêmio anualizado (${(yieldAnual * 100).toFixed(1)}%) abaixo de 60% da taxa`);
    // 2. colchão OTM (0-25)
    if (otm >= R.otmIdeal[0] && otm <= R.otmIdeal[1]) nota += 25;
    else if (otm >= R.otmMin && otm <= R.otmMax) nota += 15;
    else if (otm > R.otmMax) { nota += 8; motivos.push("muito longe do preço: prêmio pequeno"); }
    else { motivos.push(otm < 0 ? "strike acima do preço (ITM): não é renda, é compra" : "colchão menor que 3%"); }
    // 3. prazo (0-15)
    if (dias >= R.diasIdeal[0] && dias <= R.diasIdeal[1]) nota += 15;
    else if (dias >= R.diasMin && dias <= R.diasMax) nota += 9;
    else motivos.push(dias < R.diasMin ? "vence em menos de 15 dias" : "vencimento longo demais (caixa preso)");
    // 4. delta (0-10)
    if (delta != null) {
      if (delta >= R.deltaMin && delta <= R.deltaMax) nota += 10;
      else if (delta < R.deltaMin) motivos.push(`prob. de exercício alta (${(probEx * 100).toFixed(0)}%)`);
      else nota += 4;
    }
    // 5. liquidez (0-10)
    if (liquido) nota += 10;
    // 6. coerência com a carteira (0-5, e penalidades)
    if (teto && o.strike <= teto) nota += 5; else if (teto) { nota -= 15; motivos.push("strike acima do teto Bazin: se exercido, compra caro"); }
    if (suporte && o.strike <= suporte) nota += 3;
    // preço pedido vs mercado
    const semPreco = !ultimo && !mid;
    if (semPreco) { nota = Math.min(nota, 40); motivos.push("série sem negócio: o prêmio mostrado é teórico"); }
    else if (!liquido) { nota = Math.min(nota, 49); motivos.push(`liquidez abaixo do mínimo (${o.negocios ?? 0} negócios no dia; exige ${R.liquidezMinNegocios})`); }
    nota = Math.max(0, Math.min(100, Math.round(nota)));

    const classe = nota >= 70 ? "boa" : nota >= 50 ? "aceitavel" : "evitar";
    avaliadas.push({
      codigo: o.codigo, strike: o.strike, vencimento: o.vencimento, dias, diasUteis: diasUteis(hoje, venc),
      otm: Number((otm * 100).toFixed(2)),
      ultimo, bid, ask, mid: mid == null ? null : Number(mid.toFixed(2)),
      negocios: o.negocios ?? null, aberto: o.aberto ?? null, volume: o.volume ?? null,
      justo: justo == null ? null : Number(justo.toFixed(2)),
      ideal: Number(ideal.toFixed(2)),
      volUsada: Number((sigma * 100).toFixed(1)),
      volImplicita: iv == null ? null : Number((iv * 100).toFixed(1)),
      delta: delta == null ? null : Number(delta.toFixed(2)),
      probExercicio: probEx == null ? null : Number((probEx * 100).toFixed(0)),
      yieldPeriodo: Number((yieldPeriodo * 100).toFixed(2)),
      yieldAnual: Number((yieldAnual * 100).toFixed(1)),
      yieldIdealAnual: Number((yieldIdealAnual * 100).toFixed(1)),
      breakeven: Number(breakeven.toFixed(2)),
      caixaPorLote: Number((o.strike * lote).toFixed(2)),
      premioPorLote: Number((premioRef * lote).toFixed(2)),
      alvoAnual: Number((alvoAnual * 100).toFixed(1)),
      sinal: semPreco ? "sem-preco" : (mid ?? ultimo) >= ideal * 0.97 ? "vender" : "limitar",
      nota, classe, motivos,
    });
  }
  avaliadas.sort((a, b) => b.nota - a.nota || b.yieldAnual - a.yieldAnual);
  return avaliadas;
}
