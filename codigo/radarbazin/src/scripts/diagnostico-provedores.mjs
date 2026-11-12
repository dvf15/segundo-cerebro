// Testa provedores de cotação a partir de onde o script roda (GitHub runner).
// Uso: node scripts/diagnostico-provedores.mjs
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
async function tenta(nome, url, opts = {}) {
  const t0 = Date.now();
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { "user-agent": UA, accept: "*/*", ...(opts.headers || {}) }, ...opts });
    const corpo = await r.text();
    const amostra = corpo.replace(/\s+/g, " ").slice(0, 160);
    console.log(`${r.ok ? "OK " : "ERR"} ${String(r.status).padEnd(3)} ${(Date.now() - t0 + "ms").padEnd(7)} ${nome}\n      ${amostra}`);
    return { ok: r.ok, status: r.status, corpo, headers: r.headers };
  } catch (e) {
    console.log(`EXC     ${nome}: ${e.message}`);
    return { ok: false };
  }
}

// 1) Yahoo com cookie + crumb
const c = await tenta("yahoo cookie (fc.yahoo.com)", "https://fc.yahoo.com/");
const cookie = c.headers?.get?.("set-cookie")?.split(";")[0];
if (cookie) {
  const cr = await tenta("yahoo crumb", "https://query2.finance.yahoo.com/v1/test/getcrumb", { headers: { cookie } });
  if (cr.ok) {
    await tenta("yahoo chart c/ crumb ALOS3", `https://query2.finance.yahoo.com/v8/finance/chart/ALOS3.SA?interval=1d&range=5d&crumb=${encodeURIComponent(cr.corpo)}`, { headers: { cookie } });
  }
}
await tenta("yahoo chart query2 s/ crumb NVDA", "https://query2.finance.yahoo.com/v8/finance/chart/NVDA?interval=1d&range=5d");

// 2) Stooq
await tenta("stooq alos3.br", "https://stooq.com/q/l/?s=alos3.br&f=sd2t2ohlcv&h&e=csv");
await tenta("stooq alos3.sa", "https://stooq.com/q/l/?s=alos3.sa&f=sd2t2ohlcv&h&e=csv");
await tenta("stooq nvda.us", "https://stooq.com/q/l/?s=nvda.us&f=sd2t2ohlcv&h&e=csv");
await tenta("stooq vuaa.uk", "https://stooq.com/q/l/?s=vuaa.uk&f=sd2t2ohlcv&h&e=csv");
await tenta("stooq histórico nvda.us", "https://stooq.com/q/d/l/?s=nvda.us&i=d");
await tenta("stooq usdbrl", "https://stooq.com/q/l/?s=usdbrl&f=sd2t2ohlcv&h&e=csv");

// 3) B3
await tenta("b3 instrumentQuotation ALOS3", "https://cotacao.b3.com.br/mds/api/v1/instrumentQuotation/ALOS3");
await tenta("b3 DailyFluctuationHistory ALOS3", "https://cotacao.b3.com.br/mds/api/v1/DailyFluctuationHistory/ALOS3");

// 4) brapi sem token
await tenta("brapi sem token ALOS3", "https://brapi.dev/api/quote/ALOS3");
await tenta("brapi sem token PETR4", "https://brapi.dev/api/quote/PETR4");

// 5) câmbio
await tenta("BCB SGS 1 (dólar venda)", "https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json");
await tenta("awesomeapi USD-BRL", "https://economia.awesomeapi.com.br/json/last/USD-BRL");
await tenta("frankfurter USD->BRL", "https://api.frankfurter.app/latest?from=USD&to=BRL");

// 6) EUA
await tenta("nasdaq api NVDA", "https://api.nasdaq.com/api/quote/NVDA/info?assetclass=stocks", { headers: { accept: "application/json" } });
await tenta("nasdaq api SPY etf", "https://api.nasdaq.com/api/quote/SPY/info?assetclass=etf", { headers: { accept: "application/json" } });
