"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";
import BpHistory from "./BpHistory";
import WeightHistory from "./WeightHistory";
import PeriodSlider, { PeriodButtons, daysCutoff, daysLabel, daysSince } from "./PeriodSlider";
import { classifyBp } from "@/lib/bp";
import { buildHistorySheetHTML } from "@/lib/historySheet";

interface BpRow {
  date: string;
  time: string;
  sys: number;
  dia: number;
  note: string | null;
}

interface Row {
  date: string;
  label: string;
  kcal: number;
  protein_g: number;
  carb_g: number;
  fat_g: number;
  meta_kcal: number;
  meta_protein: number;
  meta_carb: number;
  meta_fat: number;
  training_type: string;
  closed: boolean;
  micro_score: number;
  micros: Record<string, number>;
  weight_kg: number | null;
}
interface MicroKey {
  key: string;
  label: string;
  mode: "goal" | "limit";
}

const COLORS = { kcal: "#a78bfa", protein: "#34d399", carb: "#fb923c", fat: "#f87171", meta: "#474750" };
const GOOD = "#34d399", MID = "#fbbf24", LOW = "#fb7185";
const tooltipStyle = {
  background: "#34343a",
  border: "1px solid #474750",
  borderRadius: 8,
  fontSize: 12,
  color: "#e2e8f0",
};
const axisTick = { fontSize: 10, fill: "#94a3b8" };

function pctColor(pct: number, mode: "goal" | "limit") {
  if (mode === "limit") return pct <= 100 ? GOOD : pct <= 130 ? MID : LOW;
  return pct >= 80 ? GOOD : pct >= 50 ? MID : LOW;
}
function scoreColor(s: number) {
  return s >= 80 ? GOOD : s >= 50 ? MID : LOW;
}

export default function HistoryCharts() {
  const [days, setDays] = useState(14); // dias olhando para trás; 0 = tudo
  const [view, setView] = useState<"macros" | "micros" | "pressao" | "peso">("peso");
  const [exporting, setExporting] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [allRows, setAllRows] = useState<Row[]>([]);
  const [microTargets, setMicroTargets] = useState<Record<string, number>>({});
  const [microKeys, setMicroKeys] = useState<MicroKey[]>([]);
  const [loading, setLoading] = useState(true);

  // Abre direto numa visão específica via ?v= (ex.: vindo da aba Pressão).
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("v");
    if (v === "macros" || v === "micros" || v === "pressao" || v === "peso") setView(v);
  }, []);

  // Carrega todo o histórico uma vez; a barra de tempo só filtra no cliente.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const r = await fetch("/api/history?days=3650", { cache: "no-store" });
        const j = await r.json();
        if (active) {
          setAllRows(j.days || []);
          setMicroTargets(j.micro_targets || {});
          setMicroKeys(j.micro_keys || []);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const maxDays = daysSince(allRows[0]?.date);
  const rows = useMemo(() => {
    const cutoff = daysCutoff(days === 0 ? 0 : Math.min(days, maxDays));
    return cutoff ? allRows.filter((r) => r.date >= cutoff) : allRows;
  }, [allRows, days, maxDays]);
  const periodLabel = days === 0 ? "todo o período" : daysLabel(Math.min(days, maxDays));

  // Médias do período selecionado na barra de tempo.
  const avg = (k: keyof Row) =>
    rows.length ? Math.round(rows.reduce((a, r) => a + (r[k] as number), 0) / rows.length) : 0;
  const macroCmp = [
    { macro: "Proteína", Realizado: avg("protein_g"), Meta: avg("meta_protein") },
    { macro: "Carbo", Realizado: avg("carb_g"), Meta: avg("meta_carb") },
    { macro: "Gordura", Realizado: avg("fat_g"), Meta: avg("meta_fat") },
  ];

  // Média do período por micro, em % da meta.
  const microCmp = microKeys.map((mk) => {
    const vals = rows.map((r) => r.micros?.[mk.key] ?? 0);
    const a = vals.length ? vals.reduce((x, y) => x + y, 0) / vals.length : 0;
    const target = microTargets[mk.key] || 0;
    const pct = target > 0 ? Math.round((a / target) * 100) : 0;
    return { label: mk.label, pct, mode: mk.mode };
  });
  const avgMicroScore = avg("micro_score");
  const kcalInMeta = rows.filter((r) => r.meta_kcal > 0 && r.kcal <= r.meta_kcal * 1.1).length;

  // Exporta TODOS os dados (diário: macros + micros; e pressão) em um único CSV.
  async function exportAll() {
    setExporting(true);
    try {
      const [dRes, pRes, wRes] = await Promise.all([
        fetch("/api/history?days=3650", { cache: "no-store" }),
        fetch("/api/pressao", { cache: "no-store" }),
        fetch("/api/peso", { cache: "no-store" }),
      ]);
      const dj = await dRes.json();
      const pj = await pRes.json();
      const wj = await wRes.json();
      const allDays: Row[] = dj.days || [];
      const mk: MicroKey[] = dj.micro_keys || microKeys;
      const pres: BpRow[] = pj.readings || [];
      const peso: { date: string; weight_kg: number }[] = wj.points || [];
      const esc = (v: unknown) => {
        const s = String(v ?? "");
        return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      };
      const lines: string[] = [];
      lines.push("DIARIO (macros + micros)");
      lines.push(
        ["data", "treino", "peso_kg", "kcal", "proteina_g", "carbo_g", "gordura_g", "meta_kcal", "score_micro", ...mk.map((m) => m.label)]
          .map(esc)
          .join(",")
      );
      for (const r of allDays) {
        lines.push(
          [r.date, r.training_type, r.weight_kg ?? "", r.kcal, r.protein_g, r.carb_g, r.fat_g, r.meta_kcal, r.micro_score, ...mk.map((m) => r.micros?.[m.key] ?? 0)]
            .map(esc)
            .join(",")
        );
      }
      lines.push("");
      lines.push("PESO (historico completo)");
      lines.push(["data", "peso_kg"].map(esc).join(","));
      for (const r of peso) {
        lines.push([r.date, r.weight_kg].map(esc).join(","));
      }
      lines.push("");
      lines.push("PRESSAO ARTERIAL");
      lines.push(["data", "hora", "sistolica", "diastolica", "classificacao", "observacao"].map(esc).join(","));
      for (const r of pres) {
        lines.push([r.date, r.time, r.sys, r.dia, classifyBp(r.sys, r.dia).label, r.note || ""].map(esc).join(","));
      }
      const csv = "﻿" + lines.join("\r\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nutre-${new Date().toLocaleDateString("en-CA")}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  // Exporta os 4 gráficos históricos (peso, pressão, macros, micros) numa única
  // página PDF. Abre uma folha HTML autocontida (SVG) e chama imprimir/salvar.
  async function exportPdf() {
    setExportingPdf(true);
    // Abre a aba já no gesto do clique (evita bloqueio de pop-up), depois preenche.
    const win = window.open("", "_blank");
    try {
      const [dRes, pRes, wRes] = await Promise.all([
        fetch("/api/history?days=3650", { cache: "no-store" }),
        fetch("/api/pressao", { cache: "no-store" }),
        fetch("/api/peso", { cache: "no-store" }),
      ]);
      const dj = await dRes.json();
      const pj = await pRes.json();
      const wj = await wRes.json();
      const html = buildHistorySheetHTML({
        appName: process.env.NEXT_PUBLIC_APP_NAME || "Nu.tre",
        appUrl: window.location.origin + "/",
        generatedAt: new Date().toLocaleDateString("pt-BR"),
        peso: (wj.points || []).map((x: { date: string; weight_kg: number }) => ({
          date: x.date,
          weight_kg: x.weight_kg,
        })),
        pressao: (pj.readings || []).map((x: BpRow) => ({ date: x.date, sys: x.sys, dia: x.dia })),
        days: (dj.days || []).map((d: Row) => ({
          label: d.label,
          kcal: d.kcal,
          meta_kcal: d.meta_kcal,
          protein_g: d.protein_g,
          carb_g: d.carb_g,
          fat_g: d.fat_g,
          micro_score: d.micro_score,
        })),
      });
      if (win) {
        win.document.open();
        win.document.write(html);
        win.document.close();
      } else {
        // Pop-up bloqueado: baixa a folha como .html (imprimível para PDF).
        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `nutre-historico-${new Date().toLocaleDateString("en-CA")}.html`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
    } finally {
      setExportingPdf(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {(["macros", "micros", "pressao", "peso"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                view === v ? "bg-emerald-600 text-white" : "border border-[#55555f] bg-[#42424a] text-slate-300"
              }`}
            >
              {v === "macros" ? "Macros" : v === "micros" ? "Micros" : v === "pressao" ? "Pressão" : "Peso"}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={exportPdf}
            disabled={exportingPdf}
            className="rounded-full border border-[#55555f] bg-[#42424a] px-3 py-1.5 text-xs font-semibold text-slate-200 disabled:opacity-50"
          >
            {exportingPdf ? "..." : "⬇ PDF"}
          </button>
          <button
            onClick={exportAll}
            disabled={exporting}
            className="rounded-full border border-[#55555f] bg-[#42424a] px-3 py-1.5 text-xs font-semibold text-slate-200 disabled:opacity-50"
          >
            {exporting ? "..." : "⬇ CSV"}
          </button>
        </div>
      </div>

      {view !== "pressao" && view !== "peso" && !loading && allRows.length > 0 && (
        <div className="space-y-2">
          <PeriodButtons value={days} onChange={setDays} />
          <PeriodSlider value={days} maxDays={maxDays} count={rows.length} countLabel="dias" onChange={setDays} />
        </div>
      )}

      {view === "pressao" ? (
        <BpHistory />
      ) : view === "peso" ? (
        <WeightHistory />
      ) : loading ? (
        <div className="py-8 text-center text-[15px] text-slate-300">Carregando...</div>
      ) : allRows.length === 0 ? (
        <div className="rounded-xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-6 text-center text-[15px] text-slate-300">
          Sem dias registrados ainda.
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-6 text-center text-[15px] text-slate-300">
          Sem dias registrados no período.
        </div>
      ) : view === "macros" ? (
        <>
          <div className="rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-3">
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <span className="text-xs font-bold uppercase text-slate-300">Calorias vs meta</span>
              <span className="text-[12px] text-slate-300 tabular-nums">
                média <b style={{ color: COLORS.kcal }}>{avg("kcal")}</b> / {avg("meta_kcal")} kcal
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={rows}>
                <CartesianGrid stroke="#474750" vertical={false} />
                <XAxis dataKey="label" tick={axisTick} minTickGap={16} />
                <YAxis tick={axisTick} width={36} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#47475055" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="kcal" fill={COLORS.kcal} radius={[4, 4, 0, 0]} name="Realizado" />
                <Bar dataKey="meta_kcal" fill={COLORS.meta} radius={[4, 4, 0, 0]} name="Meta" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-1 text-[11px] text-slate-400">
              {kcalInMeta} de {rows.length} dias até 10% acima da meta.
            </div>
          </div>

          <div className="rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-3">
            <div className="mb-2 text-xs font-bold uppercase text-slate-300">Macros ao longo do tempo (g)</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={rows}>
                <CartesianGrid stroke="#474750" vertical={false} />
                <XAxis dataKey="label" tick={axisTick} minTickGap={16} />
                <YAxis tick={axisTick} width={36} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line dataKey="protein_g" stroke={COLORS.protein} dot={false} name="Proteína" />
                <Line dataKey="carb_g" stroke={COLORS.carb} dot={false} name="Carbo" />
                <Line dataKey="fat_g" stroke={COLORS.fat} dot={false} name="Gordura" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-3">
            <div className="mb-2 text-xs font-bold uppercase text-slate-300">
              Realizado vs meta por macro (média {periodLabel})
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={macroCmp}>
                <CartesianGrid stroke="#474750" vertical={false} />
                <XAxis dataKey="macro" tick={axisTick} />
                <YAxis tick={axisTick} width={36} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#47475055" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Realizado" fill={COLORS.protein} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Meta" fill={COLORS.meta} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-3">
            <div className="mb-2 text-xs font-bold uppercase text-slate-300">Dias</div>
            <div className="divide-y divide-[#474750]">
              {rows
                .slice()
                .reverse()
                .map((r) => (
                  <div key={r.date} className="flex items-center justify-between py-2 text-[15px]">
                    <div>
                      <span className="text-slate-200">{r.label}</span>{" "}
                      <span className="text-[12px] text-slate-300">
                        {r.training_type}
                        {r.weight_kg != null ? ` · ${r.weight_kg} kg` : ""}
                        {r.closed ? " · fechado" : ""}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold" style={{ color: COLORS.kcal }}>
                        {r.kcal}
                      </span>{" "}
                      <span className="text-[12px] text-slate-300">
                        P{r.protein_g}/C{r.carb_g}/G{r.fat_g}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-3">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-xs font-bold uppercase text-slate-300">Score micro ao longo do tempo</span>
              <span className="text-[12px] text-slate-300">
                média{" "}
                <span className="font-bold" style={{ color: scoreColor(avgMicroScore) }}>
                  {avgMicroScore}%
                </span>
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={rows}>
                <CartesianGrid stroke="#474750" vertical={false} />
                <XAxis dataKey="label" tick={axisTick} minTickGap={16} />
                <YAxis tick={axisTick} width={36} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line dataKey="micro_score" stroke={GOOD} dot={false} name="Score micro (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-3">
            <div className="mb-2 text-xs font-bold uppercase text-slate-300">
              % da meta por micronutriente (média {periodLabel})
            </div>
            <ResponsiveContainer width="100%" height={Math.max(260, microCmp.length * 26)}>
              <BarChart data={microCmp} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid stroke="#474750" horizontal={false} />
                <XAxis type="number" tick={axisTick} domain={[0, 150]} unit="%" />
                <YAxis type="category" dataKey="label" tick={axisTick} width={78} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "#47475055" }}
                  formatter={(v: number) => [`${v}%`, "da meta"]}
                />
                <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                  {microCmp.map((m, i) => (
                    <Cell key={i} fill={pctColor(m.pct, m.mode)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-1 text-[11px] text-slate-400">
              Verde ≥ 80% da meta · amarelo ≥ 50% · vermelho abaixo. Sódio é teto (verde = dentro do limite).
            </div>
          </div>

          <div className="rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-3">
            <div className="mb-2 text-xs font-bold uppercase text-slate-300">Dias · score micro</div>
            <div className="divide-y divide-[#474750]">
              {rows
                .slice()
                .reverse()
                .map((r) => (
                  <div key={r.date} className="flex items-center justify-between py-2 text-[15px]">
                    <div>
                      <span className="text-slate-200">{r.label}</span>{" "}
                      <span className="text-[12px] text-slate-300">
                        {r.training_type}
                        {r.closed ? " · fechado" : ""}
                      </span>
                    </div>
                    <span className="font-bold" style={{ color: scoreColor(r.micro_score) }}>
                      {r.micro_score}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
