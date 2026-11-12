// Testa, a partir do runner do GitHub, detalhes das fontes de opções.
// Uso: node scripts/diagnostico-opcoes.mjs [AAAA-MM-DD]
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
async function tenta(nome, url, opts = {}) {
  const t0 = Date.now();
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(60000), headers: { "user-agent": UA, accept: "*/*", ...(opts.headers || {}) } });
    const buf = Buffer.from(await r.arrayBuffer());
    const texto = buf.toString(opts.latin1 ? "latin1" : "utf8");
    console.log(`${r.ok ? "OK " : "ERR"} ${String(r.status).padEnd(3)} ${(Date.now() - t0 + "ms").padEnd(7)} ${(buf.length + "B").padEnd(9)} ${nome}\n      ${texto.replace(/\s+/g, " ").slice(0, opts.amostra ?? 200)}`);
    return { ok: r.ok, texto };
  } catch (e) { console.log(`EXC     ${nome}: ${e.message}`); return { ok: false, texto: "" }; }
}
const data = process.argv[2] ?? (() => { const d = new Date(); d.setUTCDate(d.getUTCDate() - 1); return d.toISOString().slice(0, 10); })();

// cabeçalho completo do arquivo de instrumentos + uma put de outubro
const req = await tenta("requestname Instruments", `https://arquivos.b3.com.br/api/download/requestname?fileName=InstrumentsConsolidatedFile&date=${data}`, { headers: { accept: "application/json" }, amostra: 40 });
let outubro = [];
if (req.ok) {
  const token = JSON.parse(req.texto)?.token;
  const arq = await tenta("download Instruments", `https://arquivos.b3.com.br/api/download/?token=${encodeURIComponent(token)}`, { latin1: true, amostra: 0 });
  const linhas = arq.texto.split(/\r?\n/);
  console.log("CABEÇALHO COMPLETO:\n" + linhas[1]);
  outubro = linhas.filter((l) => /;(ITSA4|BBDC4|CMIG4|ALOS3|KLBN4|TAEE11|SAPR11);/.test(l) && /;Put;/.test(l) && /;2026-10-16;/.test(l));
  console.log(`puts vencendo 2026-10-16 nos nossos papéis: ${outubro.length}`);
  outubro.slice(0, 12).forEach((l) => console.log("  " + l));
}
// consolidado de negociação: linhas de opções ITSA/BBDC
const req2 = await tenta("requestname TradeInfo", `https://arquivos.b3.com.br/api/download/requestname?fileName=TradeInformationConsolidatedFile&date=${data}`, { headers: { accept: "application/json" }, amostra: 40 });
if (req2.ok) {
  const token = JSON.parse(req2.texto)?.token;
  const arq = await tenta("download TradeInfo", `https://arquivos.b3.com.br/api/download/?token=${encodeURIComponent(token)}`, { latin1: true, amostra: 0 });
  const linhas = arq.texto.split(/\r?\n/);
  console.log("CABEÇALHO:\n" + linhas[1]);
  const op = linhas.filter((l) => /^[^;]*;(ITSAV|BBDCV|CMIGV)\w+;/.test(l));
  console.log(`linhas ITSAV/BBDCV/CMIGV: ${op.length}`);
  op.slice(0, 12).forEach((l) => console.log("  " + l));
}
// cotação intradiária de séries
const codigos = outubro.slice(0, 4).map((l) => l.split(";")[1]);
for (const c of [...codigos, "ITSAV140", "BBDCV180"]) {
  await tenta(`instrumentQuotation ${c}`, `https://cotacao.b3.com.br/mds/api/v1/instrumentQuotation/${c}`, { amostra: 1500 });
}
// taxa livre de risco
await tenta("BCB SGS 432 Selic meta", "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json");
await tenta("BCB SGS 4389 CDI anual", "https://api.bcb.gov.br/dados/serie/bcdata.sgs.4389/dados/ultimos/1?formato=json");
