#!/usr/bin/env node
/**
 * Termômetro de risco: coleta indicadores de volatilidade e risco (mundo e
 * Brasil) e produz uma leitura do dia em data/termometro.json.
 *
 * Fonte: Yahoo Finance (query2), histórico diário de 1 ano por símbolo, com
 * espaçamento entre chamadas e uma nova tentativa em 429. Se um símbolo
 * falhar, mantém o valor anterior marcado como defasado.
 *
 * O score é uma soma de pontos simples e transparentes (ver PONTUACAO). Não é
 * previsão: é a leitura mecânica de onde o risco global está na abertura.
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const arquivo = join(raiz, "data", "termometro.json");

const INDICADORES = [
  // mundo
  { id: "vix",    grupo: "mundo",  nome: "VIX (vol. S&P 500)",       simbolo: "^VIX",      unidade: "pts",   casas: 1 },
  { id: "spx",    grupo: "mundo",  nome: "S&P 500 futuro",           simbolo: "ES=F",      unidade: "pts",   casas: 0 },
  { id: "ndx",    grupo: "mundo",  nome: "Nasdaq 100 futuro",        simbolo: "NQ=F",      unidade: "pts",   casas: 0 },
  { id: "us10",   grupo: "mundo",  nome: "Treasury 10 anos",         simbolo: "^TNX",      unidade: "%",     casas: 2 },
  { id: "dxy",    grupo: "mundo",  nome: "Dólar (DXY)",              simbolo: "DX-Y.NYB",  unidade: "pts",   casas: 2 },
  { id: "brent",  grupo: "mundo",  nome: "Petróleo Brent",           simbolo: "BZ=F",      unidade: "US$",   casas: 2 },
  { id: "ouro",   grupo: "mundo",  nome: "Ouro",                     simbolo: "GC=F",      unidade: "US$",   casas: 0 },
  { id: "cobre",  grupo: "mundo",  nome: "Cobre",                    simbolo: "HG=F",      unidade: "US$/lb", casas: 2 },
  { id: "nikkei", grupo: "mundo",  nome: "Nikkei 225",               simbolo: "^N225",     unidade: "pts",   casas: 0 },
  { id: "hsi",    grupo: "mundo",  nome: "Hang Seng",                simbolo: "^HSI",      unidade: "pts",   casas: 0 },
  { id: "dax",    grupo: "mundo",  nome: "DAX",                      simbolo: "^GDAXI",    unidade: "pts",   casas: 0 },
  { id: "stoxx",  grupo: "mundo",  nome: "Euro Stoxx 50",            simbolo: "^STOXX50E", unidade: "pts",   casas: 0 },
  { id: "btc",    grupo: "mundo",  nome: "Bitcoin",                  simbolo: "BTC-USD",   unidade: "US$",   casas: 0 },
  // brasil
  { id: "ibov",   grupo: "brasil", nome: "Ibovespa",                 simbolo: "^BVSP",     unidade: "pts",   casas: 0 },
  { id: "ewz",    grupo: "brasil", nome: "EWZ (Brasil em NY)",       simbolo: "EWZ",       unidade: "US$",   casas: 2 },
  { id: "brl",    grupo: "brasil", nome: "Dólar / Real",             simbolo: "BRL=X",     unidade: "R$",    casas: 4 },
  { id: "vxewz",  grupo: "brasil", nome: "VXEWZ (vol. do Brasil)",   simbolo: "^VXEWZ",    unidade: "pts",   casas: 1 },
];

// Perps 24/7 na Hyperliquid (dex HIP-3 "xyz"): dão uma leitura de tendência de
// EWZ e S&P 500 fora do horário de pregão (noite, fim de semana, feriado nos
// EUA), quando o Yahoo ainda mostra o fechamento anterior. Não entram na
// pontuação do score — são só contexto.
const INDICADORES_HL = [
  { id: "ewz_hl", grupo: "brasil", nome: "EWZ na Hyperliquid (24/7)",     simbolo: "xyz:EWZ",   unidade: "US$", casas: 2 },
  { id: "spx_hl", grupo: "mundo",  nome: "S&P 500 na Hyperliquid (24/7)", simbolo: "xyz:SP500", unidade: "pts", casas: 0 },
];

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
const bom = (n) => typeof n === "number" && Number.isFinite(n);

let ultima = 0;
async function yahoo(simbolo) {
  const espera = 1800 - (Date.now() - ultima);
  if (espera > 0) await pausa(espera);
  ultima = Date.now();
  const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(simbolo)}?interval=1d&range=1y`;
  const pegar = async () => {
    const r = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { "user-agent": UA, accept: "application/json" } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  };
  let json;
  try { json = await pegar(); }
  catch (e) { if (!/429/.test(e.message)) throw e; await pausa(8000); ultima = Date.now(); json = await pegar(); }
  const res = json?.chart?.result?.[0];
  const meta = res?.meta ?? {};
  const q = res?.indicators?.quote?.[0] ?? {};
  const ts = res?.timestamp ?? [];
  const serie = ts.map((t, i) => ({ t: t * 1000, c: q.close?.[i] })).filter((x) => bom(x.c));
  const atual = bom(meta.regularMarketPrice) ? meta.regularMarketPrice : serie.at(-1)?.c;
  if (!bom(atual)) throw new Error("sem preço");
  // fechamento anterior: se o último candle é do mesmo dia do preço atual
  // (mercado aberto ou fim de semana), o "anterior" é o candle de antes.
  const fech = serie.map((x) => x.c);
  const dia = (ms) => new Date(ms).toISOString().slice(0, 10);
  const horaAtual = meta.regularMarketTime ? meta.regularMarketTime * 1000 : Date.now();
  let anterior = null;
  if (fech.length >= 2) anterior = dia(serie.at(-1).t) === dia(horaAtual) ? fech.at(-2) : fech.at(-1);
  else if (bom(meta.chartPreviousClose)) anterior = meta.chartPreviousClose;
  return { atual, anterior, serie, hora: new Date(horaAtual).toISOString() };
}

async function hyperliquidInfo(body) {
  const r = await fetch("https://api.hyperliquid.xyz/info", {
    method: "POST",
    signal: AbortSignal.timeout(20000),
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

// Preço atual (markPx) e preço de 24h atrás (prevDayPx, janela rolante — não
// fechamento por dia UTC) de todos os mercados de uma dex HIP-3, numa só
// chamada. Chave do mapa é o nome do mercado com o prefixo da dex (ex. "xyz:EWZ").
async function hyperliquidMeta(dex) {
  const [meta, ctxs] = await hyperliquidInfo({ type: "metaAndAssetCtxs", dex });
  // o nome em meta.universe já vem com o prefixo da dex (ex. "xyz:TSLA"),
  // igual ao "coin" usado no resto da API — não precisa (nem deve) remover.
  const nomes = meta?.universe?.map((u) => u.name) ?? [];
  return Object.fromEntries(nomes.map((n, i) => [n, ctxs?.[i]]).filter(([, c]) => c));
}

// Histórico de fechamentos diários (até ~1 ano) de um mercado, só para o
// gráfico e o percentil — a variação do dia usa o markPx/prevDayPx acima.
async function hyperliquidFechamentos(coin) {
  const fim = Date.now();
  const inicio = fim - 370 * 24 * 3600 * 1000;
  const candles = await hyperliquidInfo({ type: "candleSnapshot", req: { coin, interval: "1d", startTime: inicio, endTime: fim } });
  return (Array.isArray(candles) ? candles : []).map((k) => Number(k.c)).filter(bom);
}

function volRealizada(fech, n = 20) {
  const xs = fech.filter(bom);
  if (xs.length < n + 1) return null;
  const rets = [];
  for (let i = xs.length - n; i < xs.length; i += 1) rets.push(Math.log(xs[i] / xs[i - 1]));
  const m = rets.reduce((s, r) => s + r, 0) / rets.length;
  const v = rets.reduce((s, r) => s + (r - m) ** 2, 0) / (rets.length - 1);
  return Math.sqrt(v) * Math.sqrt(252) * 100;
}

function percentil(valor, serie) {
  const xs = serie.filter(bom);
  if (xs.length < 20) return null;
  const abaixo = xs.filter((x) => x < valor).length;
  return Math.round((abaixo / xs.length) * 100);
}

/* ------------------------------------------------------------ pontuação */
// Cada regra devolve {pontos, motivo}. Soma final vai de ~-10 a ~+10.
const PONTUACAO = {
  vix: (i) => {
    const v = i.valor;
    let p = v < 15 ? 2 : v < 20 ? 1 : v < 25 ? 0 : v < 30 ? -1 : -2;
    let m = `VIX em ${v.toFixed(1)} (${v < 15 ? "calmo" : v < 20 ? "normal" : v < 25 ? "atento" : v < 30 ? "tenso" : "estresse"})`;
    if (bom(i.variacaoPct) && i.variacaoPct > 10) { p -= 1; m += `, subindo ${i.variacaoPct.toFixed(0)}% no dia`; }
    if (bom(i.variacaoPct) && i.variacaoPct < -10) { p += 1; m += `, caindo ${Math.abs(i.variacaoPct).toFixed(0)}% no dia`; }
    return { pontos: p, motivo: m };
  },
  spx: (i) => ({ pontos: i.variacaoPct > 0.5 ? 1 : i.variacaoPct < -0.5 ? -1 : 0, motivo: `S&P 500 futuro ${fmtPct(i.variacaoPct)}` }),
  us10: (i) => {
    const bp = (i.valor - i.anterior) * 100;
    return { pontos: bp > 8 ? -1 : bp < -8 ? 1 : 0, motivo: `Treasury 10a em ${i.valor.toFixed(2)}% (${bp >= 0 ? "+" : ""}${bp.toFixed(0)} bp)` };
  },
  dxy: (i) => ({ pontos: i.variacaoPct > 0.4 ? -1 : i.variacaoPct < -0.4 ? 1 : 0, motivo: `DXY ${fmtPct(i.variacaoPct)}` }),
  brent: (i) => ({ pontos: 0, motivo: `Brent US$ ${i.valor.toFixed(0)} (${fmtPct(i.variacaoPct)})` }),
  asia: (media) => ({ pontos: media > 0.5 ? 1 : media < -0.5 ? -1 : 0, motivo: `Ásia (Nikkei/Hang Seng) média ${fmtPct(media)}` }),
  europa: (media) => ({ pontos: media > 0.5 ? 1 : media < -0.5 ? -1 : 0, motivo: `Europa (DAX/Stoxx) média ${fmtPct(media)}` }),
  ewz: (i) => ({ pontos: i.variacaoPct > 0.7 ? 1 : i.variacaoPct < -0.7 ? -1 : 0, motivo: `EWZ ${fmtPct(i.variacaoPct)} na última sessão em NY` }),
  brl: (i) => ({ pontos: i.variacaoPct > 0.5 ? -1 : i.variacaoPct < -0.5 ? 1 : 0, motivo: `Dólar a R$ ${i.valor.toFixed(2)} (${fmtPct(i.variacaoPct)})` }),
  volibov: (i) => ({ pontos: i.valor < 18 ? 1 : i.valor < 28 ? 0 : -1, motivo: `Vol. realizada do Ibovespa (20d) em ${i.valor.toFixed(0)}% a.a. (${i.valor < 18 ? "calma" : i.valor < 28 ? "normal" : "alta"})` }),
};
function fmtPct(x) { return bom(x) ? `${x >= 0 ? "+" : ""}${x.toFixed(2)}%` : "—"; }

function classificar(score) {
  if (score >= 5) return { nivel: "risk-on forte", cor: "bom", frase: "Apetite a risco alto: bolsas e moedas emergentes tendem a abrir compradas." };
  if (score >= 2) return { nivel: "risk-on", cor: "bom", frase: "Apetite a risco moderado: viés positivo para Ibovespa e real." };
  if (score > -2) return { nivel: "neutro", cor: "atencao", frase: "Sem direção clara no exterior: o Ibovespa tende a seguir o fluxo local e o noticiário." };
  if (score > -5) return { nivel: "risk-off", cor: "ruim", frase: "Aversão a risco: pressão sobre bolsa e real; dólar e juros tendem a subir." };
  return { nivel: "risk-off forte", cor: "ruim", frase: "Estresse global: dia de proteção, não de compra." };
}

/* --------------------------------------------------------------------- main */
const agora = new Date().toISOString();
let anterior = { indicadores: [] };
try { anterior = JSON.parse(await readFile(arquivo, "utf8")); } catch { /* primeira execução */ }
const antigos = Object.fromEntries((anterior.indicadores ?? []).map((i) => [i.id, i]));

const indicadores = [];
for (const cfg of INDICADORES) {
  try {
    const d = await yahoo(cfg.simbolo);
    const fech = d.serie.map((x) => x.c);
    const variacaoPct = bom(d.anterior) && d.anterior !== 0 ? ((d.atual / d.anterior) - 1) * 100 : null;
    indicadores.push({
      ...cfg, valor: d.atual, anterior: d.anterior, variacaoPct,
      percentil1a: percentil(d.atual, fech),
      min1a: fech.length ? Math.min(...fech) : null, max1a: fech.length ? Math.max(...fech) : null,
      serie30: fech.slice(-30).map((x) => Number(x.toPrecision(6))),
      fechamentos: fech,
      horaMercado: d.hora, fonte: "Yahoo Finance", ts: agora,
    });
    console.log(`  ${cfg.id.padEnd(7)} ${d.atual} (${fmtPct(variacaoPct)})`);
  } catch (e) {
    console.warn(`  ${cfg.id}: ${e.message}`);
    if (antigos[cfg.id]) indicadores.push({ ...antigos[cfg.id], defasado: true });
  }
}

let metaHL = {};
try { metaHL = await hyperliquidMeta("xyz"); } catch (e) { console.warn(`  hyperliquid (meta xyz): ${e.message}`); }

for (const cfg of INDICADORES_HL) {
  try {
    const ctx = metaHL[cfg.simbolo];
    if (!ctx) throw new Error("mercado não encontrado");
    const atual = Number(ctx.markPx);
    const anterior = Number(ctx.prevDayPx);
    if (!bom(atual)) throw new Error("sem preço");
    const fech = await hyperliquidFechamentos(cfg.simbolo).catch(() => []);
    const variacaoPct = bom(anterior) && anterior !== 0 ? ((atual / anterior) - 1) * 100 : null;
    indicadores.push({
      ...cfg, valor: atual, anterior: bom(anterior) ? anterior : null, variacaoPct,
      percentil1a: percentil(atual, fech),
      min1a: fech.length ? Math.min(...fech) : null, max1a: fech.length ? Math.max(...fech) : null,
      serie30: fech.slice(-30).map((x) => Number(x.toPrecision(6))),
      horaMercado: agora, fonte: "Hyperliquid (perp xyz, 24/7)", ts: agora,
    });
    console.log(`  ${cfg.id.padEnd(7)} ${atual} (${fmtPct(variacaoPct)})`);
  } catch (e) {
    console.warn(`  ${cfg.id}: ${e.message}`);
    if (antigos[cfg.id]) indicadores.push({ ...antigos[cfg.id], defasado: true });
  }
}

// derivados: volatilidade realizada (20 pregões, anualizada) do Ibovespa e do dólar
for (const [id, base, nome] of [["volibov", "ibov", "Vol. realizada Ibovespa 20d"], ["volbrl", "brl", "Vol. realizada dólar/real 20d"]]) {
  const b = indicadores.find((i) => i.id === base);
  if (!b?.serie30) continue;
  // reconstrói a série de vol a partir de uma janela maior salva pelo próprio indicador
  const atual = volRealizada(b.fechamentos ?? [], 20);
  if (!bom(atual)) continue;
  const hist = [];
  const f = b.fechamentos;
  for (let k = 30; k >= 1; k -= 1) { const v = volRealizada(f.slice(0, f.length - k), 20); if (bom(v)) hist.push(Number(v.toFixed(2))); }
  const pct1a = [];
  for (let k = f.length - 21; k >= 0; k -= 1) { const v = volRealizada(f.slice(0, f.length - k), 20); if (bom(v)) pct1a.push(v); }
  indicadores.push({ id, grupo: "brasil", nome, simbolo: `${b.simbolo} (calc.)`, unidade: "% a.a.", casas: 1,
    valor: Number(atual.toFixed(2)), anterior: hist.at(-1) ?? null, variacaoPct: hist.length ? ((atual / hist.at(-1)) - 1) * 100 : null,
    percentil1a: percentil(atual, pct1a), min1a: pct1a.length ? Math.min(...pct1a) : null, max1a: pct1a.length ? Math.max(...pct1a) : null,
    serie30: hist.concat([Number(atual.toFixed(2))]).slice(-30), horaMercado: b.horaMercado, fonte: "calculado sobre Yahoo Finance", ts: agora });
}
// VXEWZ: o dado do Yahoo para esse índice é irregular; salto acima de 25% num dia é marcado como suspeito
for (const i of indicadores) if (i.id === "vxewz" && bom(i.variacaoPct) && Math.abs(i.variacaoPct) > 25) i.nota = "salto atípico no dado do Yahoo; usar com cautela";
for (const i of indicadores) delete i.fechamentos;

const por = Object.fromEntries(indicadores.map((i) => [i.id, i]));
const pontos = [];
const media = (ids) => { const xs = ids.map((k) => por[k]?.variacaoPct).filter(bom); return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null; };

for (const id of ["vix", "spx", "us10", "dxy", "brent", "ewz", "brl", "volibov"]) {
  const i = por[id];
  if (i && bom(i.valor) && (id === "brent" || id === "volibov" || id === "vix" || bom(i.variacaoPct)) && (id !== "us10" || bom(i.anterior))) {
    pontos.push({ id, ...PONTUACAO[id](i) });
  }
}
const mAsia = media(["nikkei", "hsi"]); if (bom(mAsia)) pontos.push({ id: "asia", ...PONTUACAO.asia(mAsia) });
const mEuropa = media(["dax", "stoxx"]); if (bom(mEuropa)) pontos.push({ id: "europa", ...PONTUACAO.europa(mEuropa) });

const score = pontos.reduce((s, p) => s + p.pontos, 0);
const classe = classificar(score);

// viés de abertura do Ibovespa: futuros dos EUA + EWZ + câmbio + Europa
const sinais = [por.spx?.variacaoPct, por.ewz?.variacaoPct, bom(por.brl?.variacaoPct) ? -por.brl.variacaoPct : null, mEuropa].filter(bom);
const mediaSinais = sinais.length ? sinais.reduce((s, x) => s + x, 0) / sinais.length : 0;
const vies = mediaSinais > 0.35 ? "alta" : mediaSinais < -0.35 ? "baixa" : "indefinido";

// viés de abertura de Wall Street: futuros dos EUA, Europa e movimento do VIX
const vixMov = bom(por.vix?.variacaoPct) ? Math.max(-1.5, Math.min(1.5, -por.vix.variacaoPct / 10)) : null;
const sinaisEua = [por.spx?.variacaoPct, por.ndx?.variacaoPct, mEuropa, vixMov].filter(bom);
const mediaEua = sinaisEua.length ? sinaisEua.reduce((s, x) => s + x, 0) / sinaisEua.length : 0;
const viesEua = mediaEua > 0.3 ? "alta" : mediaEua < -0.3 ? "baixa" : "indefinido";

/* ------------------------------------------------------------- manchetes */
const FEEDS = [
  { fonte: "CNBC", url: "https://www.cnbc.com/id/100003114/device/rss/rss.html" },
  { fonte: "BBC Business", url: "https://feeds.bbci.co.uk/news/business/rss.xml" },
  { fonte: "Google News", url: "https://news.google.com/rss/search?q=(site:reuters.com+OR+site:bloomberg.com+OR+site:ft.com)+(markets+OR+stocks+OR+Fed+OR+economy)+when:1d&hl=en-US&gl=US&ceid=US:en" },
  { fonte: "MarketWatch", url: "https://feeds.content.dowjones.io/public/rss/mw_topstories" },
];
const CHAVES = /\b(fed|federal reserve|rate|rates|yield|treasur|inflation|cpi|jobs|payroll|stocks?|wall street|s&p|nasdaq|dow|market|oil|opec|china|tariff|trade|dollar|recession|gdp|earnings|nvidia|ecb|boj|europe|emerging|brazil|selic|default|debt|war|iran|russia|ukraine)\b/i;
const limpa = (x) => (x ?? "").replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
async function lerFeed(f) {
  const r = await fetch(f.url, { signal: AbortSignal.timeout(15000), headers: { "user-agent": UA, accept: "application/rss+xml,application/xml,text/xml,*/*" } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const xml = await r.text();
  const itens = [];
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const bloco = m[1];
    const titulo = limpa((bloco.match(/<title>([\s\S]*?)<\/title>/) || [])[1]);
    let link = limpa((bloco.match(/<link>([\s\S]*?)<\/link>/) || [])[1]);
    if (!link) link = limpa((bloco.match(/<guid[^>]*>([\s\S]*?)<\/guid>/) || [])[1]);
    const pub = limpa((bloco.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1]);
    const origem = limpa((bloco.match(/<source[^>]*>([\s\S]*?)<\/source>/) || [])[1]) || f.fonte;
    const quando = Date.parse(pub);
    if (!titulo || !link) continue;
    itens.push({ titulo: titulo.replace(/\s+-\s+[^-]+$/, (t) => (f.fonte === "Google News" ? "" : t)), link, fonte: origem, publicadoEm: Number.isFinite(quando) ? new Date(quando).toISOString() : null });
  }
  return itens;
}
let manchetes = [];
const agoraMs = Date.now();
for (const f of FEEDS) {
  try {
    const itens = await lerFeed(f);
    const recentes = itens.filter((i) => !i.publicadoEm || agoraMs - Date.parse(i.publicadoEm) < 36 * 3600 * 1000);
    manchetes.push(...recentes.map((i, idx) => ({ ...i, pontos: (CHAVES.test(i.titulo) ? 2 : 0) + (idx < 3 ? 1 : 0) + (f.fonte === "Google News" ? 0 : 0) })));
    console.log(`  manchetes ${f.fonte}: ${recentes.length}`);
  } catch (e) { console.warn(`  manchetes ${f.fonte}: ${e.message}`); }
}
// deduplica por título parecido e ordena por relevância, depois por hora
const vistos = new Set();
manchetes = manchetes
  .sort((a, b) => b.pontos - a.pontos || (Date.parse(b.publicadoEm || 0) - Date.parse(a.publicadoEm || 0)))
  .filter((m) => { const k = m.titulo.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(" ").slice(0, 6).join(" "); if (vistos.has(k)) return false; vistos.add(k); return true; })
  .slice(0, 5)
  .map(({ pontos: _p, ...m }) => m);
if (!manchetes.length && anterior.manchetes?.length) manchetes = anterior.manchetes.map((m) => ({ ...m, defasada: true }));

const positivos = pontos.filter((p) => p.pontos > 0).map((p) => p.motivo);
const negativos = pontos.filter((p) => p.pontos < 0).map((p) => p.motivo);
const neutros = pontos.filter((p) => p.pontos === 0).map((p) => p.motivo);

const saida = {
  atualizadoEm: agora,
  origem: "scripts/termometro.mjs",
  score, scoreMin: -10, scoreMax: 10,
  nivel: classe.nivel, cor: classe.cor, frase: classe.frase,
  vies: { ibovespa: vies, mediaSinais: Number(mediaSinais.toFixed(2)),
    texto: vies === "alta" ? "Viés de abertura positivo para o Ibovespa." : vies === "baixa" ? "Viés de abertura negativo para o Ibovespa." : "Abertura sem viés claro para o Ibovespa.",
    eua: viesEua, mediaEua: Number(mediaEua.toFixed(2)),
    textoEua: viesEua === "alta" ? "Futuros e Europa apontam abertura positiva em Wall Street." : viesEua === "baixa" ? "Futuros e Europa apontam abertura negativa em Wall Street." : "Wall Street sem direção clara nos futuros." },
  manchetes,
  motivos: { positivos, negativos, neutros },
  pontos,
  metodo: "Soma de pontos por regra fixa: VIX por faixa (±2) e salto diário; S&P futuro, DXY, Treasury 10a, EWZ, dólar/real, Ásia e Europa (±1 cada quando cruzam limiares); volatilidade realizada do Ibovespa (20 pregões) por faixa. VXEWZ é exibido mas não pontua, porque o dado público dele é irregular. EWZ e S&P 500 da Hyperliquid (perps 24/7 da dex xyz, licenciados pela S&P DJI) também são exibidos mas não pontuam: servem para ver a tendência fora do horário de pregão dos EUA, quando o Yahoo ainda mostra o fechamento anterior. Escala de −10 a +10. Viés do Ibovespa = média de S&P futuro, EWZ, Europa e câmbio invertido. Viés de Wall Street = média de S&P e Nasdaq futuros, Europa e o movimento do VIX (invertido). Manchetes: itens das últimas 36h de CNBC, BBC, MarketWatch e Google News (Reuters, Bloomberg, FT), ranqueados por palavras-chave de mercado e posição no feed. É leitura de posicionamento na abertura, não previsão de fechamento.",
  indicadores,
};

if (!indicadores.length) { console.error("Nenhum indicador coletado; arquivo mantido."); process.exit(0); }
await writeFile(arquivo, JSON.stringify(saida, null, 2) + "\n");
console.log(`\nscore ${score} → ${classe.nivel}; viés Ibovespa: ${vies}; ${indicadores.length} indicadores (${indicadores.filter((i) => i.defasado).length} defasados).`);
