#!/usr/bin/env node
/**
 * Atualiza data/cotacoes.json (preços e câmbio) e data/tecnica.json (suporte,
 * resistência e tendência) a partir de provedores públicos, sem chave.
 *
 * Cadeia de provedores (testada a partir do runner do GitHub em 06/09/2026):
 *   B3      cotacao.b3.com.br      ações brasileiras      (oficial, sem chave)
 *   Nasdaq  api.nasdaq.com         ações e ETFs dos EUA   (sem chave)
 *   Yahoo   query2.finance.yahoo   reserva + histórico 1a (sujeito a 429)
 *   brapi   brapi.dev              reserva B3, só com BRAPI_TOKEN (secret)
 *   BCB     api.bcb.gov.br SGS 1   USD/BRL oficial        (sem chave)
 *   Frankfurter                    USD/BRL reserva
 *
 * Regras:
 *  - nunca sobrescreve um preço bom com lixo: se todos falharem, mantém o
 *    anterior e marca `defasado: true`;
 *  - cada cotação registra a fonte e o horário;
 *  - o histórico diário próprio (data/historico.json) acumula um candle por
 *    dia a partir das cotações oficiais, para os níveis técnicos continuarem
 *    sendo calculados mesmo se o Yahoo parar de responder;
 *  - sai com código 0 mesmo em falha parcial.
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { calcularNiveis } from "./tecnica.mjs";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const arq = {
  cotacoes: join(raiz, "data", "cotacoes.json"),
  tecnica: join(raiz, "data", "tecnica.json"),
  historico: join(raiz, "data", "historico.json"),
};

const MAPA = {
  ALOS3:  { b3: "ALOS3",  yahoo: "ALOS3.SA",  moeda: "BRL" },
  TAEE11: { b3: "TAEE11", yahoo: "TAEE11.SA", moeda: "BRL" },
  AURE3:  { b3: "AURE3",  yahoo: "AURE3.SA",  moeda: "BRL" },
  BBSE3:  { b3: "BBSE3",  yahoo: "BBSE3.SA",  moeda: "BRL" },
  ITSA4:  { b3: "ITSA4",  yahoo: "ITSA4.SA",  moeda: "BRL" },
  KLBN4:  { b3: "KLBN4",  yahoo: "KLBN4.SA",  moeda: "BRL" },
  SAPR11: { b3: "SAPR11", yahoo: "SAPR11.SA", moeda: "BRL" },
  CMIG4:  { b3: "CMIG4",  yahoo: "CMIG4.SA",  moeda: "BRL" },
  BBDC4:  { b3: "BBDC4",  yahoo: "BBDC4.SA",  moeda: "BRL" },
  NVDA:   { nasdaq: ["NVDA", "stocks"], yahoo: "NVDA",   moeda: "USD" },
  PLTR:   { nasdaq: ["PLTR", "stocks"], yahoo: "PLTR",   moeda: "USD" },
  TSLA:   { nasdaq: ["TSLA", "stocks"], yahoo: "TSLA",   moeda: "USD" },
  SPY:    { nasdaq: ["SPY", "etf"],     yahoo: "SPY",    moeda: "USD" },
  VUAA:   { yahoo: "VUAA.L", moeda: "USD" },
};

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
const num = (x) => {
  if (typeof x === "number") return x;
  if (typeof x === "string") { const n = Number(x.replace(/[^0-9.\-]/g, "")); return Number.isFinite(n) ? n : NaN; }
  return NaN;
};
const bom = (n) => typeof n === "number" && Number.isFinite(n) && n > 0;

async function buscar(url, extra = {}) {
  const r = await fetch(url, {
    signal: AbortSignal.timeout(20000),
    headers: { "user-agent": UA, accept: "application/json,text/plain,*/*", ...(extra.headers ?? {}) },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status} em ${url.split("?")[0]}`);
  return r;
}

/* ---------------------------------------------------------------- provedores */

async function viaB3(codigo) {
  const json = await (await buscar(`https://cotacao.b3.com.br/mds/api/v1/instrumentQuotation/${codigo}`)).json();
  const q = json?.Trad?.[0]?.scty?.SctyQtn;
  if (!q) throw new Error(`B3 sem SctyQtn para ${codigo}`);
  const preco = [q.curPrc, q.closPric, q.avrgPric].map(num).find(bom);
  if (!bom(preco)) throw new Error(`B3 sem preço para ${codigo} (campos: ${Object.keys(q).join(",")})`);
  const anterior = num(q.prvsDayAdjstmntPric ?? q.prvsDayClosPric);
  return {
    preco,
    variacao: bom(anterior) ? (preco / anterior - 1) * 100 : null,
    fonte: "B3 (cotacao.b3.com.br)",
    candle: { o: num(q.opngPric), h: num(q.maxPric), l: num(q.minPric), c: preco, v: num(q.tradQty ?? q.trdQty ?? q.finVol ?? 0) || 0 },
  };
}

async function viaNasdaq([codigo, classe]) {
  const json = await (await buscar(`https://api.nasdaq.com/api/quote/${codigo}/info?assetclass=${classe}`, { headers: { accept: "application/json" } })).json();
  const p = json?.data?.primaryData;
  const preco = num(p?.lastSalePrice);
  if (!bom(preco)) throw new Error(`Nasdaq sem preço para ${codigo}`);
  const variacao = num(p?.percentageChange);
  const ks = json?.data?.keyStats ?? {};
  return {
    preco,
    variacao: Number.isFinite(variacao) ? variacao : null,
    fonte: "Nasdaq (api.nasdaq.com)",
    candle: { o: num(ks?.OpenPrice?.value), h: num(ks?.DayRange?.value?.split("-")?.[1]), l: num(ks?.DayRange?.value?.split("-")?.[0]), c: preco, v: num(ks?.Volume?.value) || 0 },
  };
}

let ultimaChamadaYahoo = 0;
async function viaYahoo(simbolo, alcance = "1y") {
  // espaça as chamadas: o Yahoo devolve 429 com facilidade para IPs de nuvem
  const espera = 1800 - (Date.now() - ultimaChamadaYahoo);
  if (espera > 0) await pausa(espera);
  ultimaChamadaYahoo = Date.now();
  const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(simbolo)}?interval=1d&range=${alcance}`;
  let r;
  try { r = await buscar(url); }
  catch (e) {
    if (!/429/.test(e.message)) throw e;
    await pausa(8000); ultimaChamadaYahoo = Date.now();
    r = await buscar(url);
  }
  const json = await r.json();
  const res = json?.chart?.result?.[0];
  const preco = res?.meta?.regularMarketPrice;
  if (!bom(preco)) throw new Error(`Yahoo sem preço para ${simbolo}`);
  const q = res?.indicators?.quote?.[0] ?? {};
  const ts = res?.timestamp ?? [];
  const barras = ts.map((t, i) => ({ t: t * 1000, o: q.open?.[i], h: q.high?.[i], l: q.low?.[i], c: q.close?.[i], v: q.volume?.[i] }));
  // variação do dia = último fechamento contra o anterior (chartPreviousClose
  // é o fechamento anterior ao INÍCIO da janela, não o de ontem)
  const fech = barras.map((b) => b.c).filter(bom);
  const ant = fech.length >= 2 ? fech[fech.length - 2] : (alcance === "5d" ? res?.meta?.chartPreviousClose : null);
  return { preco, variacao: bom(ant) ? (preco / ant - 1) * 100 : null, fonte: "Yahoo Finance", barras };
}

async function viaBrapi(codigo) {
  const token = process.env.BRAPI_TOKEN;
  if (!token) throw new Error("BRAPI_TOKEN ausente");
  const json = await (await buscar(`https://brapi.dev/api/quote/${codigo}`, { headers: { authorization: `Bearer ${token}` } })).json();
  const it = json?.results?.[0];
  if (!bom(it?.regularMarketPrice)) throw new Error(`brapi sem preço para ${codigo}`);
  return { preco: it.regularMarketPrice, variacao: it.regularMarketChangePercent ?? null, fonte: "brapi.dev" };
}

async function cambioUsdBrl() {
  const tentativas = [
    async () => {
      const j = await (await buscar("https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json")).json();
      const v = num(j?.[0]?.valor);
      if (!bom(v)) throw new Error("BCB sem valor");
      return { valor: v, fonte: `Banco Central (PTAX venda, ${j[0].data})` };
    },
    async () => {
      const j = await (await buscar("https://api.frankfurter.app/latest?from=USD&to=BRL")).json();
      const v = num(j?.rates?.BRL);
      if (!bom(v)) throw new Error("Frankfurter sem valor");
      return { valor: v, fonte: `Frankfurter/BCE (${j.date})` };
    },
    async () => { const { preco } = await viaYahoo("USDBRL=X", "5d"); return { valor: preco, fonte: "Yahoo Finance" }; },
  ];
  for (const t of tentativas) { try { return await t(); } catch (e) { console.warn(`  câmbio: ${e.message}`); } }
  return null;
}

/* --------------------------------------------------------------------- main */

const agora = new Date().toISOString();
const hoje = agora.slice(0, 10);
const lerJson = async (p, padrao) => { try { return JSON.parse(await readFile(p, "utf8")); } catch { return padrao; } };

const anterior = await lerJson(arq.cotacoes, { cotacoes: {}, cambio: {} });
const tecnicaAnterior = await lerJson(arq.tecnica, { ativos: {} });
const historico = await lerJson(arq.historico, { nota: "Um candle por dia útil, acumulado pelo workflow a partir das cotações oficiais (B3/Nasdaq). Serve de reserva para os níveis técnicos.", ativos: {} });

const saida = { atualizadoEm: agora, origem: "scripts/atualizar-cotacoes.mjs", nota: anterior.nota, cambio: anterior.cambio ?? {}, cotacoes: {} };
const tecnica = { atualizadoEm: agora, metodo: tecnicaAnterior.metodo, ativos: { ...tecnicaAnterior.ativos } };

let sucessos = 0, mantidos = 0, niveis = 0;

for (const [ticker, cfg] of Object.entries(MAPA)) {
  const cadeia = [];
  if (cfg.b3) cadeia.push(["B3", () => viaB3(cfg.b3)]);
  if (cfg.nasdaq) cadeia.push(["Nasdaq", () => viaNasdaq(cfg.nasdaq)]);
  if (cfg.yahoo) cadeia.push(["Yahoo", () => viaYahoo(cfg.yahoo)]);
  if (cfg.b3) cadeia.push(["brapi", () => viaBrapi(cfg.b3)]);

  let cot = null;
  for (const [nome, fn] of cadeia) {
    try { cot = await fn(); break; }
    catch (e) { console.warn(`  ${ticker}/${nome}: ${e.message}`); }
  }

  if (!cot) {
    const previa = anterior.cotacoes?.[ticker];
    if (previa) { saida.cotacoes[ticker] = { ...previa, defasado: true }; mantidos += 1; console.warn(`  ${ticker}: mantendo ${previa.preco}`); }
    continue;
  }

  saida.cotacoes[ticker] = {
    preco: Number(cot.preco.toFixed(4)),
    variacao: cot.variacao == null ? null : Number(cot.variacao.toFixed(2)),
    moeda: cfg.moeda, fonte: cot.fonte, ts: agora,
  };
  sucessos += 1;
  console.log(`  ${ticker}: ${cot.preco} (${cot.fonte})`);

  // histórico próprio: um candle por dia
  const serie = historico.ativos[ticker] ?? [];
  const candle = cot.candle && bom(cot.candle.c)
    ? { d: hoje, o: bom(cot.candle.o) ? cot.candle.o : cot.candle.c, h: bom(cot.candle.h) ? cot.candle.h : cot.candle.c, l: bom(cot.candle.l) ? cot.candle.l : cot.candle.c, c: cot.candle.c, v: cot.candle.v || 0 }
    : { d: hoje, o: cot.preco, h: cot.preco, l: cot.preco, c: cot.preco, v: 0 };
  const idx = serie.findIndex((x) => x.d === hoje);
  if (idx >= 0) serie[idx] = candle; else serie.push(candle);
  historico.ativos[ticker] = serie.slice(-400);
  // variação do dia a partir do histórico próprio, quando o provedor não deu
  if (saida.cotacoes[ticker].variacao == null) {
    const ontem = [...serie].reverse().find((x) => x.d < hoje && bom(x.c));
    if (ontem) saida.cotacoes[ticker].variacao = Number(((cot.preco / ontem.c - 1) * 100).toFixed(2));
  }

  // níveis técnicos: histórico do Yahoo (1 ano) quando houver; senão, o próprio
  let barras = cot.barras;
  if (!barras?.length) {
    try { barras = (await viaYahoo(cfg.yahoo)).barras; }
    catch (e) { console.warn(`  ${ticker}/histórico Yahoo: ${e.message}`); }
  }
  const origem = barras?.length ? "calculado" : "calculado (histórico próprio)";
  if (!barras?.length) barras = historico.ativos[ticker].map((x) => ({ t: Date.parse(x.d), o: x.o, h: x.h, l: x.l, c: x.c, v: x.v }));
  const n = calcularNiveis(barras);
  if (n) {
    tecnica.ativos[ticker] = { ...n, origem, fonte: `${origem === "calculado" ? "Yahoo Finance" : "histórico acumulado pelo painel"}, ${n.barras} candles diários`, confianca: n.barras >= 200 ? 7 : n.barras >= 120 ? 6 : 4, ts: agora };
    niveis += 1;
  } else {
    console.warn(`  ${ticker}: histórico curto (${barras?.length ?? 0} candles), níveis mantidos`);
  }
}

const cambio = await cambioUsdBrl();
if (cambio) { saida.cambio.USDBRL = { valor: Number(cambio.valor.toFixed(4)), fonte: cambio.fonte, ts: agora }; console.log(`  USD/BRL: ${saida.cambio.USDBRL.valor} (${cambio.fonte})`); }
else if (saida.cambio.USDBRL) saida.cambio.USDBRL = { ...saida.cambio.USDBRL, defasado: true };

if (sucessos === 0) { console.error("Nenhum provedor respondeu. Nada foi alterado."); process.exit(0); }

await writeFile(arq.cotacoes, JSON.stringify(saida, null, 2) + "\n");
await writeFile(arq.historico, JSON.stringify(historico) + "\n");
if (niveis > 0) await writeFile(arq.tecnica, JSON.stringify(tecnica, null, 2) + "\n");
console.log(`\n${sucessos} cotações atualizadas, ${mantidos} mantidas, ${niveis} leituras técnicas recalculadas.`);
