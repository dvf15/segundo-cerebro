#!/usr/bin/env node
/**
 * Gera data/opcoes.json: para cada papel da carteira, as melhores puts para
 * "dividendo sintético" (venda de put coberta por caixa), com preço ideal de
 * venda e último preço de mercado.
 *
 * Fontes (testadas a partir do runner do GitHub em 19/09/2026):
 *   B3  arquivos.b3.com.br  InstrumentsConsolidatedFile  (todas as séries: strike, vencimento, lote)
 *   B3  arquivos.b3.com.br  TradeInformationConsolidatedFile (último negócio, nº de negócios, volume, preço de referência)
 *   B3  cotacao.b3.com.br   instrumentQuotation/<série>  (último intradiário das séries negociadas)
 *   Nasdaq api.nasdaq.com   option-chain                 (EUA: bid/ask, último, volume, contratos em aberto)
 *   BCB  SGS 4389           CDI anualizado               (taxa livre de risco BR)
 *   Yahoo query2            histórico 1 ano              (volatilidade realizada)
 *
 * A B3 não publica bid/ask nem posição em aberto de graça; a liquidez vem do
 * número de negócios do dia. Sai com código 0 mesmo em falha parcial e mantém
 * o resultado anterior do papel quando a coleta dele falha (marcado defasado).
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { avaliarPuts, volRealizada } from "./putsel.mjs";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const arq = (n) => join(raiz, "data", n);
const lerJson = async (p, padrao) => { try { return JSON.parse(await readFile(p, "utf8")); } catch { return padrao; } };

const BR = { ALOS3: "ALOS3", TAEE11: "TAEE11", ITSA4: "ITSA4", KLBN4: "KLBN4", SAPR11: "SAPR11", CMIG4: "CMIG4", BBDC4: "BBDC4", BBSE3: "BBSE3", AURE3: "AURE3" };
const US = { NVDA: ["NVDA", "stocks"], PLTR: ["PLTR", "stocks"], TSLA: ["TSLA", "stocks"], SPY: ["SPY", "etf"] };
const YAHOO = { ...Object.fromEntries(Object.keys(BR).map((t) => [t, `${t}.SA`])), NVDA: "NVDA", PLTR: "PLTR", TSLA: "TSLA", SPY: "SPY" };

const JANELA = { diasMin: 10, diasMax: 75, strikeMin: 0.78, strikeMax: 1.03, maxSeriesCotadas: 16 };

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
const numBr = (s) => { if (s == null || s === "") return null; const n = Number(String(s).replace(/\./g, "").replace(",", ".")); return Number.isFinite(n) ? n : null; };
const numUs = (s) => { if (s == null || s === "" || s === "--") return null; const n = Number(String(s).replace(/[^0-9.\-]/g, "")); return Number.isFinite(n) ? n : null; };
const bom = (n) => typeof n === "number" && Number.isFinite(n) && n > 0;

async function buscar(url, extra = {}) {
  const r = await fetch(url, { signal: AbortSignal.timeout(extra.timeout ?? 30000), headers: { "user-agent": UA, accept: "application/json,text/plain,*/*", ...(extra.headers ?? {}) } });
  if (!r.ok) throw new Error(`HTTP ${r.status} em ${url.split("?")[0]}`);
  return r;
}

/* ------------------------------------------------------------- B3 arquivos */

async function baixarB3(fileName, data) {
  const req = await (await buscar(`https://arquivos.b3.com.br/api/download/requestname?fileName=${fileName}&date=${data}`, { headers: { accept: "application/json" } })).json();
  if (!req?.token) throw new Error(`${fileName} ${data}: sem token`);
  const r = await buscar(`https://arquivos.b3.com.br/api/download/?token=${encodeURIComponent(req.token)}`, { timeout: 90000 });
  const texto = Buffer.from(await r.arrayBuffer()).toString("latin1");
  const linhas = texto.split(/\r?\n/);
  const iCab = linhas.findIndex((l) => l.startsWith("RptDt;"));
  if (iCab < 0) throw new Error(`${fileName} ${data}: cabeçalho não encontrado`);
  const cab = linhas[iCab].split(";");
  const idx = Object.fromEntries(cab.map((c, i) => [c, i]));
  return { status: linhas[0], cab, idx, linhas: linhas.slice(iCab + 1).filter(Boolean) };
}

// tenta hoje e volta até 6 dias, até achar o arquivo
async function baixarB3Recente(fileName, aPartirDe) {
  const d = new Date(aPartirDe);
  let ultimoErro;
  for (let i = 0; i < 7; i++) {
    const data = d.toISOString().slice(0, 10);
    const dow = d.getUTCDay();
    if (dow !== 0 && dow !== 6) {
      try { const f = await baixarB3(fileName, data); return { data, ...f }; }
      catch (e) { ultimoErro = e; console.warn(`  B3 ${fileName} ${data}: ${e.message}`); }
    }
    d.setUTCDate(d.getUTCDate() - 1);
  }
  throw ultimoErro ?? new Error(`${fileName}: nenhuma data disponível`);
}

async function cotacaoIntradiaria(codigo) {
  const json = await (await buscar(`https://cotacao.b3.com.br/mds/api/v1/instrumentQuotation/${codigo}`, { timeout: 15000 })).json();
  const t = json?.Trad?.[0];
  const q = t?.scty?.SctyQtn;
  if (!q) return null;
  const ultimo = [q.curPrc, q.closPric, q.avrgPric].map(Number).find(bom) ?? null;
  return { ultimo, negocios: Number(t.ttlQty) || null };
}

/* ------------------------------------------------------------------ Nasdaq */

async function cadeiaNasdaq([codigo, classe]) {
  const json = await (await buscar(`https://api.nasdaq.com/api/quote/${codigo}/option-chain?assetclass=${classe}&fromdate=all&todate=undefined&excode=oprac&callput=put&money=all&type=all`, { headers: { accept: "application/json" }, timeout: 60000 })).json();
  const rows = json?.data?.table?.rows ?? [];
  const puts = [];
  let vencimento = null;
  for (const r of rows) {
    if (r.expirygroup) { const d = new Date(r.expirygroup + " UTC"); vencimento = Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10); continue; }
    const strike = numUs(r.strike);
    if (!vencimento || !bom(strike)) continue;
    puts.push({
      codigo: `${codigo} ${vencimento} P${strike}`,
      strike, vencimento,
      ultimo: numUs(r.p_Last), bid: numUs(r.p_Bid), ask: numUs(r.p_Ask),
      volume: numUs(r.p_Volume), aberto: numUs(r.p_Openinterest), negocios: null,
    });
  }
  return puts;
}

/* -------------------------------------------------------- taxas e volatil. */

async function cdiAnual() {
  const j = await (await buscar("https://api.bcb.gov.br/dados/serie/bcdata.sgs.4389/dados/ultimos/1?formato=json")).json();
  const v = Number(j?.[0]?.valor);
  if (!bom(v)) throw new Error("BCB 4389 sem valor");
  return { valor: v / 100, fonte: `CDI anualizado (BCB SGS 4389, ${j[0].data})` };
}

let ultimaChamadaYahoo = 0;
async function fechamentosYahoo(simbolo) {
  const espera = 1800 - (Date.now() - ultimaChamadaYahoo);
  if (espera > 0) await pausa(espera);
  ultimaChamadaYahoo = Date.now();
  const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(simbolo)}?interval=1d&range=1y`;
  let r;
  try { r = await buscar(url); }
  catch (e) { if (!/429/.test(e.message)) throw e; await pausa(8000); ultimaChamadaYahoo = Date.now(); r = await buscar(url); }
  const json = await r.json();
  const c = json?.chart?.result?.[0]?.indicators?.quote?.[0]?.close ?? [];
  return c.filter(bom);
}

/* --------------------------------------------------------------------- main */

const agora = new Date();
const iso = agora.toISOString();
const anterior = await lerJson(arq("opcoes.json"), { ativos: {} });
const cotacoes = await lerJson(arq("cotacoes.json"), { cotacoes: {} });
const fundamentos = await lerJson(arq("fundamentos.json"), { ativos: {}, bazin: { yieldMinimo: 0.06 } });
const tecnica = await lerJson(arq("tecnica.json"), { ativos: {} });
const termometro = await lerJson(arq("termometro.json"), null);
const historico = await lerJson(arq("historico.json"), { ativos: {} });
const carteira = await lerJson(arq("carteira.json"), { posicoes: [] });

const naCarteira = new Set(carteira.posicoes.map((p) => p.ticker));
const tickersBR = Object.keys(BR).filter((t) => naCarteira.has(t));
const tickersUS = []; // painel só com papéis nacionais (pedido de 19/09/2026)

const saida = {
  atualizadoEm: iso,
  origem: "scripts/opcoes.mjs",
  objetivo: "Dividendo sintético para carteira previdenciária: vender put coberta por caixa em papel que se quer ter, com strike abaixo do preço, prazo curto e prêmio que, sozinho, renda pelo menos o CDI sobre o caixa reservado (que segue aplicado). Se exercido, compra o papel abaixo do teto Bazin; se não, embolsa o prêmio.",
  regras: {
    prazoDias: "15 a 60 (ideal 25 a 45)", colchao: "strike 3% a 15% abaixo do preço (ideal 5% a 10%)", delta: "-0,10 a -0,35",
    liquidez: "≥ 10 negócios no dia (ou ≥ 300 contratos em aberto); abaixo disso a série é 'evitar'", coerencia: "strike no máximo no teto Bazin; bônus abaixo do suporte técnico",
    precoIdeal: "maior entre (a) preço justo Black-Scholes com a volatilidade realizada (média de 21 e 63 pregões) mais 5% de margem, (b) prêmio que faz a put render, sozinha, a taxa livre de risco no período sobre o caixa reservado (o caixa continua aplicado, então a renda dobra), (c) bid atual",
    sinal: "vender = mercado paga ≥ 97% do ideal; limitar = deixar ordem no ideal e esperar",
  },
  taxas: {}, fontes: {}, ativos: {},
};

// taxas
try { const c = await cdiAnual(); saida.taxas.BR = c; console.log(`  CDI: ${(c.valor * 100).toFixed(2)}%`); }
catch (e) { console.warn(`  CDI: ${e.message}`); saida.taxas.BR = anterior.taxas?.BR ?? { valor: 0.1365, fonte: "CDI anualizado (valor padrão, BCB indisponível)" }; }
const us10 = termometro?.indicadores?.find((i) => i.id === "us10")?.valor;
saida.taxas.US = bom(us10) && us10 < 20 ? { valor: us10 / 100, fonte: "Treasury 10 anos (termômetro)" } : (anterior.taxas?.US ?? { valor: 0.045, fonte: "valor padrão" });

// volatilidade realizada por papel
const vols = {};
for (const t of [...tickersBR, ...tickersUS]) {
  let fech = null, fonte = null;
  try { fech = await fechamentosYahoo(YAHOO[t]); fonte = "Yahoo Finance, 1 ano"; }
  catch (e) { console.warn(`  ${t}/vol Yahoo: ${e.message}`); }
  if (!fech || fech.length < 30) {
    const h = (historico.ativos?.[t] ?? []).map((x) => x.c).filter(bom);
    if (h.length >= 22) { fech = h; fonte = "histórico próprio do painel"; }
  }
  const v21 = fech ? volRealizada(fech, 21) : null;
  const v63 = fech ? volRealizada(fech, 63) : null;
  if (v21) vols[t] = { vol21: v21, vol63: v63, fonte };
  else if (anterior.ativos?.[t]?.vol21) vols[t] = { vol21: anterior.ativos[t].vol21 / 100, vol63: (anterior.ativos[t].vol63 ?? anterior.ativos[t].vol21) / 100, fonte: "leitura anterior" };
  else vols[t] = { vol21: 0.30, vol63: 0.30, fonte: "valor padrão (30%)" };
  console.log(`  ${t}: vol21 ${(vols[t].vol21 * 100).toFixed(1)}% (${vols[t].fonte})`);
}

const baseAtivo = (t, moeda) => {
  const spot = cotacoes.cotacoes?.[t]?.preco ?? fundamentos.ativos?.[t]?.precoRef ?? null;
  const f = fundamentos.ativos?.[t];
  const dpa = f?.bazin?.aplicavel ? f.bazin.dpaRecorrente : null;
  const teto = dpa ? dpa / (fundamentos.bazin?.yieldMinimo ?? 0.06) : null;
  const suporte = tecnica.ativos?.[t]?.suporte ?? null;
  return { spot, teto, suporte, moeda, vol21: vols[t].vol21, vol63: vols[t].vol63, volFonte: vols[t].fonte };
};

const preencher = (t, base, puts, extra) => {
  const taxa = base.moeda === "BRL" ? saida.taxas.BR.valor : saida.taxas.US.valor;
  const av = avaliarPuts({ spot: base.spot, puts, vol: base.vol21, vol63: base.vol63, taxa, teto: base.teto, suporte: base.suporte, hoje: agora, lote: extra.lote ?? 100 });
  // melhor = primeira put que não é "evitar" (liquidez mínima, colchão e prazo ok); sem isso, nenhuma
  const melhor = av.find((x) => x.classe !== "evitar") ?? null;
  saida.ativos[t] = {
    spot: base.spot, moeda: base.moeda, teto: base.teto ? Number(base.teto.toFixed(2)) : null, suporte: base.suporte,
    vol21: Number((base.vol21 * 100).toFixed(1)), vol63: base.vol63 ? Number((base.vol63 * 100).toFixed(1)) : null, volFonte: base.volFonte,
    taxa: Number((taxa * 100).toFixed(2)), lote: extra.lote ?? 100,
    universo: extra.universo, comNegocio: puts.filter((p) => bom(p.ultimo)).length,
    candidatas: av.filter((x) => x.sinal !== "sem-preco").slice(0, 6), melhor: melhor?.codigo ?? null,
    fonte: extra.fonte, referencia: extra.referencia ?? null, obs: extra.obs ?? null, ts: iso,
  };
  console.log(`  ${t}: ${extra.universo} séries na janela, ${saida.ativos[t].comNegocio} com preço; melhor ${melhor ? `${melhor.codigo} (nota ${melhor.nota}, ${melhor.classe})` : "—"}`);
};

const manterAnterior = (t, motivo) => {
  if (anterior.ativos?.[t]) { saida.ativos[t] = { ...anterior.ativos[t], defasado: true, obs: `coleta de hoje falhou (${motivo}); leitura anterior mantida` }; }
  else saida.ativos[t] = { spot: null, candidatas: [], melhor: null, universo: 0, obs: `sem dados: ${motivo}`, ts: iso };
  console.warn(`  ${t}: ${motivo}`);
};

/* ---- Brasil */
if (tickersBR.length) {
  let inst = null, neg = null;
  try {
    inst = await baixarB3Recente("InstrumentsConsolidatedFile", agora);
    console.log(`  B3 instrumentos ${inst.data}: ${inst.linhas.length} linhas`);
    try { neg = await baixarB3Recente("TradeInformationConsolidatedFile", inst.data); console.log(`  B3 negociação ${neg.data}: ${neg.linhas.length} linhas`); }
    catch (e) { console.warn(`  B3 negociação: ${e.message}`); }
  } catch (e) { console.warn(`  B3 instrumentos: ${e.message}`); }

  if (inst) {
    saida.fontes.B3 = `arquivos.b3.com.br (instrumentos ${inst.data}${neg ? `, negociação ${neg.data}` : ""}) + cotacao.b3.com.br intradiário`;
    const I = inst.idx;
    const quer = new Set(tickersBR.map((t) => BR[t]));
    const porAtivo = {};
    for (const l of inst.linhas) {
      const c = l.split(";");
      if (c[I.SctyCtgyNm] !== "OPTION ON EQUITIES" || c[I.OptnTp] !== "Put") continue;
      const asst = c[I.Asst];
      if (!quer.has(asst)) continue;
      const strike = numBr(c[I.ExrcPric]);
      const vencimento = c[I.XprtnDt];
      if (!bom(strike) || !/^\d{4}-\d{2}-\d{2}$/.test(vencimento)) continue;
      (porAtivo[asst] ??= []).push({ codigo: c[I.TckrSymb], strike, vencimento, lote: Number(c[I.AllcnRndLot]) || 100, estilo: c[I.OptnStyle] });
    }
    const negMapa = {};
    if (neg) {
      const N = neg.idx;
      for (const l of neg.linhas) {
        const c = l.split(";");
        if (!/PUT/.test(c[N.SgmtNm] ?? "")) continue;
        negMapa[c[N.TckrSymb]] = { ultimo: numBr(c[N.LastPric]), negocios: numBr(c[N.TradQty]), quantidade: numBr(c[N.FinInstrmQty]), volume: numBr(c[N.NtlFinVol]), referencia: numBr(c[N.RefPric]) };
      }
    }
    for (const t of tickersBR) {
      const base = baseAtivo(t, "BRL");
      if (!bom(base.spot)) { manterAnterior(t, "sem preço à vista"); continue; }
      const todas = porAtivo[BR[t]] ?? [];
      const janela = todas.filter((o) => {
        const dias = Math.round((new Date(o.vencimento + "T00:00:00Z") - agora) / 86400000);
        return dias >= JANELA.diasMin && dias <= JANELA.diasMax && o.strike >= base.spot * JANELA.strikeMin && o.strike <= base.spot * JANELA.strikeMax;
      });
      const puts = janela.map((o) => ({ ...o, ...(negMapa[o.codigo] ?? {}), bid: null, ask: null, aberto: null }));
      // intradiário: séries com negócio ontem primeiro, depois as mais perto do preço
      const ordem = [...puts].sort((a, b) => (bom(b.negocios) - bom(a.negocios)) || Math.abs(a.strike - base.spot) - Math.abs(b.strike - base.spot));
      let cotadas = 0;
      for (const p of ordem.slice(0, JANELA.maxSeriesCotadas)) {
        try {
          const q = await cotacaoIntradiaria(p.codigo);
          if (q?.ultimo) { p.ultimo = q.ultimo; p.negocios = Math.max(p.negocios ?? 0, q.negocios ?? 0); p.intradiario = true; cotadas += 1; }
        } catch (e) { /* série sem cotação hoje */ }
        await pausa(250);
      }
      const obs = !todas.length ? "a B3 não lista puts para este papel"
        : !janela.length ? `${todas.length} puts listadas, nenhuma na janela de prazo/strike`
        : !puts.some((p) => bom(p.ultimo)) ? "há séries listadas, mas nenhuma com negócio recente: liquidez inexistente"
        : !puts.some((p) => (p.negocios ?? 0) >= 10) ? "há séries com negócio, mas nenhuma com 10 ou mais negócios no dia: liquidez insuficiente para a regra"
        : null;
      preencher(t, base, puts, { lote: todas[0]?.lote ?? 100, universo: janela.length, fonte: "B3", referencia: { instrumentos: inst.data, negociacao: neg?.data ?? null, intradiarias: cotadas }, obs });
    }
  } else {
    for (const t of tickersBR) manterAnterior(t, "arquivos da B3 indisponíveis");
  }
}

/* ---- EUA */
for (const t of tickersUS) {
  const base = baseAtivo(t, "USD");
  if (!bom(base.spot)) { manterAnterior(t, "sem preço à vista"); continue; }
  try {
    const todas = await cadeiaNasdaq(US[t]);
    const puts = todas.filter((o) => {
      const dias = Math.round((new Date(o.vencimento + "T00:00:00Z") - agora) / 86400000);
      return dias >= JANELA.diasMin && dias <= JANELA.diasMax && o.strike >= base.spot * JANELA.strikeMin && o.strike <= base.spot * JANELA.strikeMax;
    });
    saida.fontes.Nasdaq = "api.nasdaq.com option-chain (último, bid/ask, volume, contratos em aberto)";
    preencher(t, base, puts, { lote: 100, universo: puts.length, fonte: "Nasdaq", obs: todas.length ? null : "sem cadeia de opções na Nasdaq" });
  } catch (e) { manterAnterior(t, `Nasdaq: ${e.message}`); }
  await pausa(600);
}

// papéis sem mercado de opções (ex.: VUAA)
for (const p of carteira.posicoes) {
  if (!BR[p.ticker]) continue;
  if (!saida.ativos[p.ticker]) saida.ativos[p.ticker] = { spot: cotacoes.cotacoes?.[p.ticker]?.preco ?? null, candidatas: [], melhor: null, universo: 0, obs: "sem mercado de opções listado para este ativo", ts: iso };
}

await writeFile(arq("opcoes.json"), JSON.stringify(saida, null, 2) + "\n");
const comMelhor = Object.values(saida.ativos).filter((a) => a.melhor).length;
console.log(`\ndata/opcoes.json gravado: ${Object.keys(saida.ativos).length} ativos, ${comMelhor} com put recomendável.`);
