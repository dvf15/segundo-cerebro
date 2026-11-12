"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface WeightPoint {
  date: string; // YYYY-MM-DD
  weight_kg: number;
}

const LINE_COLOR = "#a78bfa";
const tooltipStyle = {
  background: "#34343a",
  border: "1px solid #474750",
  borderRadius: 8,
  fontSize: 12,
  color: "#e2e8f0",
};
const axisTick = { fontSize: 10, fill: "#94a3b8" };
const card = "rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-3";

function todayKey() {
  return new Date().toLocaleDateString("en-CA");
}
function monthsBefore(dateKey: string, n: number) {
  const d = new Date(dateKey + "T12:00:00");
  d.setMonth(d.getMonth() - n);
  return d.toLocaleDateString("en-CA");
}
function fmtDate(k: string) {
  return new Date(k + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}
function monthsLabel(m: number) {
  if (m < 12) return `${m} ${m === 1 ? "mês" : "meses"}`;
  const a = Math.floor(m / 12), r = m % 12;
  return `${a} ${a === 1 ? "ano" : "anos"}${r ? ` e ${r} ${r === 1 ? "mês" : "meses"}` : ""}`;
}

// Atalhos em meses (0 = tudo).
const PERIODS = [
  { key: 1, label: "1m" },
  { key: 6, label: "6m" },
  { key: 12, label: "1a" },
  { key: 60, label: "5a" },
  { key: 0, label: "Tudo" },
];

export default function WeightHistory() {
  const [points, setPoints] = useState<WeightPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [period, setPeriod] = useState(6); // meses; 0 = tudo
  const [showList, setShowList] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/peso", { cache: "no-store" });
        const j = await r.json();
        setPoints(j.points || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function save(d: string, w: string) {
    if (!d) return;
    setBusy(true);
    try {
      const r = await fetch("/api/peso", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ date: d, weight_kg: w }),
      });
      const j = await r.json();
      if (r.ok) setPoints(j.points || []);
      else alert(j.error || "Erro ao salvar.");
    } finally {
      setBusy(false);
    }
  }

  // Meses cobertos pelos dados (limite da barra de tempo).
  const maxMonths = useMemo(() => {
    if (!points.length) return 12;
    const a = new Date(points[0].date + "T12:00:00"), b = new Date();
    return Math.max(1, (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + 1);
  }, [points]);
  const months = period === 0 ? maxMonths : Math.min(period, maxMonths);
  const cutoff = period === 0 ? "" : monthsBefore(todayKey(), months);

  const filtered = useMemo(
    () => (cutoff ? points.filter((p) => p.date >= cutoff) : points),
    [points, cutoff]
  );

  const chartData = filtered.map((p) => ({ label: p.date, weight: p.weight_kg }));

  const domain = useMemo<[number, number] | undefined>(() => {
    if (!filtered.length) return undefined;
    const ws = filtered.map((p) => p.weight_kg);
    const lo = Math.floor(Math.min(...ws) - 2);
    const hi = Math.ceil(Math.max(...ws) + 2);
    return [lo, hi];
  }, [filtered]);

  const first = filtered[0];
  const last = filtered[filtered.length - 1];
  const delta = first && last ? last.weight_kg - first.weight_kg : 0;

  function exportCsv() {
    const esc = (v: unknown) => {
      const s = String(v ?? "");
      return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = ["data,peso_kg"];
    for (const p of points) lines.push([p.date, p.weight_kg].map(esc).join(","));
    const csv = "﻿" + lines.join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nutre-peso-${todayKey()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <div className="py-8 text-center text-[15px] text-slate-300">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Gráfico */}
      <div className={card}>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-bold uppercase text-slate-300">Peso (kg)</div>
          <div className="flex flex-wrap gap-1.5">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  period === p.key
                    ? "bg-blue-600 text-white"
                    : "border border-[#55555f] bg-[#42424a] text-slate-300"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        {/* Barra de tempo: calibra quantos meses olhar para trás */}
        <div className="mb-3 rounded-xl border border-[#4c4c57] bg-[#2e2e36] px-3 py-2.5">
          <div className="flex items-baseline justify-between gap-2 text-[13px]">
            <span className="font-semibold text-white">Últimos {monthsLabel(months)}</span>
            <span className="text-slate-400 tabular-nums">
              {filtered.length} registros
            </span>
          </div>
          <input
            id="peso-periodo"
            type="range"
            min={1}
            max={maxMonths}
            step={1}
            value={months}
            onChange={(e) => {
              const v = Number(e.target.value);
              setPeriod(v >= maxMonths ? 0 : v);
            }}
            aria-label="Período em meses"
            className="mt-2 w-full accent-emerald-500"
          />
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>1 mês</span>
            <span>{cutoff ? `desde ${fmtDate(cutoff)}` : "todo o histórico"}</span>
            <span>{monthsLabel(maxMonths)}</span>
          </div>
        </div>
        {chartData.length === 0 ? (
          <div className="py-8 text-center text-[15px] text-slate-300">Sem registros no período.</div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} margin={{ left: -8, right: 8, top: 6 }}>
              <CartesianGrid stroke="#474750" vertical={false} />
              <XAxis dataKey="label" tick={axisTick} minTickGap={24} />
              <YAxis tick={axisTick} width={40} domain={domain} unit=" kg" />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v} kg`, "Peso"]} />
              <Line dataKey="weight" stroke={LINE_COLOR} dot={{ r: 2 }} name="Peso" />
            </LineChart>
          </ResponsiveContainer>
        )}
        {first && last && (
          <div className="mt-1 text-[11px] text-slate-400">
            {first.date} → {last.date} ·{" "}
            <span className={delta <= 0 ? "text-emerald-400" : "text-rose-400"}>
              {delta > 0 ? "+" : ""}
              {delta.toFixed(1)} kg
            </span>{" "}
            no período.
          </div>
        )}
      </div>

      {/* Lista + exportar */}
      <div className={card}>
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="text-xs font-bold uppercase text-slate-300">
            Registros ({points.length})
          </div>
          <div className="flex gap-2">
            <button onClick={exportCsv} className="text-xs font-semibold text-blue-400">
              ⬇ exportar peso
            </button>
            <button
              onClick={() => setShowList((v) => !v)}
              className="text-xs font-semibold text-blue-400"
            >
              {showList ? "▾ ocultar" : "▸ mostrar"}
            </button>
          </div>
        </div>
        {showList && (
          <div className="divide-y divide-[#474750]">
            {points
              .slice()
              .reverse()
              .map((p) => (
                <div key={p.date} className="flex items-center justify-between gap-2 py-2">
                  <span className="text-[13px] text-slate-300">{p.date}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold text-white">{p.weight_kg} kg</span>
                    <button
                      onClick={() => {
                        const v = prompt(`Peso em ${p.date} (kg). Vazio para remover.`, String(p.weight_kg));
                        if (v === null) return;
                        save(p.date, v.trim().replace(",", "."));
                      }}
                      disabled={busy}
                      className="rounded-md border border-[#55555f] bg-[#42424a] px-2 py-1 text-[12px] text-slate-200"
                    >
                      editar
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
        {points.length === 0 && (
          <div className="py-4 text-center text-[13px] text-slate-400">Nenhum peso registrado ainda.</div>
        )}
        <div className="mt-2 text-[11px] text-slate-400">
          Novos pesos são registrados na tela inicial (campo <b>Peso</b> do dia). Aqui você acompanha e ajusta os
          pontos — os históricos (2011–2026) são aproximados do gráfico de longo prazo.
        </div>
      </div>
    </div>
  );
}
