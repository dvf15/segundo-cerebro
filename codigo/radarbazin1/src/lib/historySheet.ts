// Gera uma folha HTML de uma página com os gráficos históricos (peso,
// pressão, calorias vs meta, macros e micros) + um resumo desenhados como SVG inline — sem dependências.
// Usada pelo exportador de PDF do Histórico (abre em nova aba → imprimir/salvar).

interface Series {
  label: string;
  color: string;
  values: number[];
  dashed?: boolean;
}
interface RefLine {
  y: number;
  color: string;
  label?: string;
}
interface ChartOpts {
  width: number;
  height: number;
  title: string;
  subtitle?: string;
  series: Series[];
  xLabels: string[];
  yMin?: number;
  yMax?: number;
  refs?: RefLine[];
  unit?: string;
  dots?: boolean;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function niceBounds(min: number, max: number): [number, number] {
  if (!isFinite(min) || !isFinite(max)) return [0, 1];
  if (min === max) return [min - 1, max + 1];
  const pad = (max - min) * 0.08;
  return [min - pad, max + pad];
}

function chartSVG(o: ChartOpts): string {
  const { width: W, height: H } = o;
  const padL = 46, padR = 16, padT = 58, padB = 30;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const all = o.series.flatMap((s) => s.values).concat((o.refs ?? []).map((r) => r.y));
  let yMin = o.yMin ?? Math.min(...all);
  let yMax = o.yMax ?? Math.max(...all);
  if (o.yMin === undefined && o.yMax === undefined) [yMin, yMax] = niceBounds(yMin, yMax);
  if (yMin === yMax) { yMin -= 1; yMax += 1; }

  const n = Math.max(...o.series.map((s) => s.values.length), 1);
  const xAt = (i: number) => padL + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const yAt = (v: number) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

  const parts: string[] = [];
  // moldura + título
  parts.push(`<rect x="0" y="0" width="${W}" height="${H}" rx="10" fill="#ffffff" stroke="#e5e7eb"/>`);
  parts.push(`<text x="${padL}" y="22" font-size="14" font-weight="700" fill="#111827">${esc(o.title)}</text>`);
  if (o.subtitle)
    parts.push(`<text x="${padL}" y="37" font-size="10.5" fill="#6b7280">${esc(o.subtitle)}</text>`);

  // grade + eixo Y (4 divisões)
  for (let g = 0; g <= 4; g++) {
    const v = yMin + ((yMax - yMin) * g) / 4;
    const y = yAt(v);
    parts.push(`<line x1="${padL}" y1="${y.toFixed(1)}" x2="${padL + plotW}" y2="${y.toFixed(1)}" stroke="#eef0f3"/>`);
    parts.push(`<text x="${padL - 6}" y="${(y + 3).toFixed(1)}" font-size="9" fill="#9ca3af" text-anchor="end">${Math.round(v)}</text>`);
  }
  // linhas de referência (ex.: 130/80)
  for (const r of o.refs ?? []) {
    const y = yAt(r.y);
    parts.push(`<line x1="${padL}" y1="${y.toFixed(1)}" x2="${padL + plotW}" y2="${y.toFixed(1)}" stroke="${r.color}" stroke-dasharray="4 4" stroke-opacity="0.6"/>`);
  }
  // rótulos X (até 6, uniformes)
  if (o.xLabels.length) {
    const step = Math.max(1, Math.ceil(o.xLabels.length / 6));
    for (let i = 0; i < o.xLabels.length; i += step) {
      const x = xAt(i);
      parts.push(`<text x="${x.toFixed(1)}" y="${H - 10}" font-size="9" fill="#9ca3af" text-anchor="middle">${esc(o.xLabels[i])}</text>`);
    }
  }
  // séries
  for (const s of o.series) {
    if (!s.values.length) continue;
    const d = s.values
      .map((v, i) => `${i === 0 ? "M" : "L"}${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`)
      .join(" ");
    parts.push(`<path d="${d}" fill="none" stroke="${s.color}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"${s.dashed ? ' stroke-dasharray="5 4"' : ""}/>`);
    if (o.dots && !s.dashed && s.values.length <= 60)
      for (let i = 0; i < s.values.length; i++)
        parts.push(`<circle cx="${xAt(i).toFixed(1)}" cy="${yAt(s.values[i]).toFixed(1)}" r="1.9" fill="${s.color}"/>`);
  }
  // legenda (própria linha, acima do gráfico) — só para múltiplas séries
  if (o.series.length > 1) {
    let lx = padL;
    const ly = 52;
    for (const s of o.series) {
      parts.push(`<rect x="${lx}" y="${ly - 8}" width="9" height="9" rx="2" fill="${s.color}"/>`);
      parts.push(`<text x="${lx + 13}" y="${ly}" font-size="9.5" fill="#374151">${esc(s.label)}</text>`);
      lx += 22 + esc(s.label).length * 5.8;
    }
  }

  return `<svg viewBox="0 0 ${W} ${H}" width="100%" xmlns="http://www.w3.org/2000/svg">${parts.join("")}</svg>`;
}

export interface SheetPayload {
  appName: string;
  appUrl: string; // origem do app, para o botão "Voltar"
  generatedAt: string; // dd/mm/aaaa
  peso: { date: string; weight_kg: number }[];
  pressao: { date: string; sys: number; dia: number }[];
  days: {
    label: string;
    kcal: number;
    meta_kcal: number;
    protein_g: number;
    carb_g: number;
    fat_g: number;
    micro_score: number;
  }[];
}

export function buildHistorySheetHTML(p: SheetPayload): string {
  const charts: string[] = [];

  // 1) Peso
  if (p.peso.length) {
    const first = p.peso[0], last = p.peso[p.peso.length - 1];
    const delta = (last.weight_kg - first.weight_kg).toFixed(1);
    charts.push(
      chartSVG({
        width: 360, height: 230, title: "Peso (kg)",
        subtitle: `${first.date} → ${last.date} · ${Number(delta) > 0 ? "+" : ""}${delta} kg`,
        series: [{ label: "Peso", color: "#7c3aed", values: p.peso.map((x) => x.weight_kg) }],
        xLabels: p.peso.map((x) => x.date.slice(0, 4)),
        unit: " kg", dots: true,
      })
    );
  } else charts.push(emptyCard("Peso (kg)"));

  // 2) Pressão
  if (p.pressao.length) {
    charts.push(
      chartSVG({
        width: 360, height: 230, title: "Pressão (mmHg)",
        subtitle: "referência residencial 130/80",
        series: [
          { label: "Sistólica", color: "#e11d48", values: p.pressao.map((x) => x.sys) },
          { label: "Diastólica", color: "#2563eb", values: p.pressao.map((x) => x.dia) },
        ],
        xLabels: p.pressao.map((x) => x.date.slice(5)),
        yMin: 50, yMax: 160,
        refs: [{ y: 130, color: "#e11d48" }, { y: 80, color: "#2563eb" }],
      })
    );
  } else charts.push(emptyCard("Pressão (mmHg)"));

  // 3) Calorias vs meta
  if (p.days.length) {
    const n = p.days.length;
    const avgK = Math.round(p.days.reduce((a, d) => a + d.kcal, 0) / n);
    const avgM = Math.round(p.days.reduce((a, d) => a + d.meta_kcal, 0) / n);
    charts.push(
      chartSVG({
        width: 360, height: 230, title: "Calorias vs meta (kcal)",
        subtitle: `média ${avgK} kcal · meta média ${avgM} kcal`,
        series: [
          { label: "Realizado", color: "#7c3aed", values: p.days.map((d) => d.kcal) },
          { label: "Meta", color: "#9ca3af", values: p.days.map((d) => d.meta_kcal), dashed: true },
        ],
        xLabels: p.days.map((d) => d.label),
        dots: true,
      })
    );
  } else charts.push(emptyCard("Calorias vs meta (kcal)"));

  // 4) Macros (g)
  if (p.days.length) {
    charts.push(
      chartSVG({
        width: 360, height: 230, title: "Macros (g)",
        subtitle: "proteína · carbo · gordura por dia",
        series: [
          { label: "Proteína", color: "#059669", values: p.days.map((d) => d.protein_g) },
          { label: "Carbo", color: "#ea580c", values: p.days.map((d) => d.carb_g) },
          { label: "Gordura", color: "#dc2626", values: p.days.map((d) => d.fat_g) },
        ],
        xLabels: p.days.map((d) => d.label),
      })
    );
  } else charts.push(emptyCard("Macros (g)"));

  // 5) Micros (score)
  if (p.days.length) {
    const avg = Math.round(p.days.reduce((a, d) => a + (d.micro_score || 0), 0) / p.days.length);
    charts.push(
      chartSVG({
        width: 360, height: 230, title: "Score micro (%)",
        subtitle: `média do período ${avg}%`,
        series: [{ label: "Score micro", color: "#0891b2", values: p.days.map((d) => d.micro_score) }],
        xLabels: p.days.map((d) => d.label),
        yMin: 0, yMax: 100,
      })
    );
  } else charts.push(emptyCard("Score micro (%)"));

  // 6) Resumo
  charts.push(summaryCard(p));

  const grid = charts.map((c) => `<div class="chart">${c}</div>`).join("");

  const appUrl = JSON.stringify(p.appUrl || "/");
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"/>
<title>${esc(p.appName)} — Histórico</title>
<style>
  @page { size: A4 landscape; margin: 10mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #111827; margin: 0; }
  header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 10px; }
  h1 { font-size: 18px; margin: 0; }
  .sub { font-size: 11px; color: #6b7280; }
  .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  .chart { break-inside: avoid; }
  footer { margin-top: 10px; font-size: 10px; color: #9ca3af; }
  .bar { position: fixed; top: 16px; display: flex; gap: 8px; z-index: 10; }
  .btn { padding: 8px 16px; border: 0; border-radius: 999px; font-weight: 600; cursor: pointer; font-size: 13px; }
  .print { right: 16px; background: #059669; color: #fff; }
  .back { left: 16px; background: #e5e7eb; color: #111827; }
  @media screen { body { background: #f3f4f6; padding: 16px; } .sheet { background: #fff; max-width: 1040px; margin: 56px auto 0; padding: 20px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,.1); } }
  @media print { .bar { display: none; } .sheet { padding: 0; } }
</style></head>
<body>
  <button class="btn back bar" onclick="goBack()">← Voltar para o app</button>
  <button class="btn print bar" onclick="window.print()">⬇ Salvar como PDF</button>
  <div class="sheet">
    <header>
      <h1>${esc(p.appName)} — Histórico completo</h1>
      <span class="sub">gerado em ${esc(p.generatedAt)}</span>
    </header>
    <div class="grid">${grid}</div>
    <footer>Peso, pressão, calorias vs meta, macros e micros. Registro pessoal — não substitui avaliação médica.</footer>
  </div>
  <script>
    function goBack(){ try { window.close(); } catch(e){} setTimeout(function(){ location.href = ${appUrl}; }, 150); }
    window.addEventListener('load', function(){ setTimeout(function(){ try { window.print(); } catch(e){} }, 400); });
  </script>
</body></html>`;
}

function summaryCard(p: SheetPayload): string {
  const lines: [string, string][] = [];
  const n = p.days.length;
  if (n) {
    const avg = (f: (d: SheetPayload["days"][number]) => number) => Math.round(p.days.reduce((a, d) => a + f(d), 0) / n);
    const inMeta = p.days.filter((d) => d.meta_kcal > 0 && d.kcal <= d.meta_kcal * 1.1).length;
    lines.push(["Dias registrados", String(n)]);
    lines.push(["Calorias (média)", `${avg((d) => d.kcal)} / ${avg((d) => d.meta_kcal)} kcal`]);
    lines.push(["Dias na meta (até +10%)", `${inMeta} de ${n} (${Math.round((inMeta / n) * 100)}%)`]);
    lines.push(["Macros (média)", `P ${avg((d) => d.protein_g)} · C ${avg((d) => d.carb_g)} · G ${avg((d) => d.fat_g)} g`]);
    lines.push(["Score micro (média)", `${avg((d) => d.micro_score)}%`]);
  }
  if (p.peso.length) {
    const a = p.peso[0], b = p.peso[p.peso.length - 1];
    lines.push(["Peso", `${a.weight_kg} → ${b.weight_kg} kg`]);
  }
  if (p.pressao.length) {
    const k = p.pressao.length;
    const s = Math.round(p.pressao.reduce((x, r) => x + r.sys, 0) / k);
    const d = Math.round(p.pressao.reduce((x, r) => x + r.dia, 0) / k);
    lines.push(["Pressão (média)", `${s}/${d} mmHg · ${k} medições`]);
  }
  const rows = lines
    .map(([k, v], i) => {
      const y = 62 + i * 22;
      return `<text x="20" y="${y}" font-size="10.5" fill="#6b7280">${esc(k)}</text><text x="340" y="${y}" font-size="11" font-weight="700" fill="#111827" text-anchor="end">${esc(v)}</text>`;
    })
    .join("");
  return `<svg viewBox="0 0 360 230" width="100%" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="360" height="230" rx="10" fill="#ffffff" stroke="#e5e7eb"/>
    <text x="20" y="22" font-size="14" font-weight="700" fill="#111827">Resumo</text>
    <text x="20" y="37" font-size="10.5" fill="#6b7280">médias de todo o histórico</text>
    ${rows || `<text x="180" y="120" font-size="12" fill="#9ca3af" text-anchor="middle">Sem dados.</text>`}
  </svg>`;
}

function emptyCard(title: string): string {
  return `<svg viewBox="0 0 360 230" width="100%" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="360" height="230" rx="10" fill="#ffffff" stroke="#e5e7eb"/>
    <text x="46" y="22" font-size="14" font-weight="700" fill="#111827">${esc(title)}</text>
    <text x="180" y="120" font-size="12" fill="#9ca3af" text-anchor="middle">Sem dados no período.</text>
  </svg>`;
}
