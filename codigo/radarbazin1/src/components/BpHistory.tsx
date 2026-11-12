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
  Legend,
  ReferenceLine,
} from "recharts";
import { classifyBp, BP_REF_SYS, BP_REF_DIA, type BpReadingDTO } from "@/lib/bp";
import BpForm from "./BpForm";
import PeriodSlider, { PeriodButtons, daysCutoff, daysSince } from "./PeriodSlider";

const SYS_COLOR = "#fb7185";
const DIA_COLOR = "#6ea8fe";
const tooltipStyle = {
  background: "#34343a",
  border: "1px solid #474750",
  borderRadius: 8,
  fontSize: 12,
  color: "#e2e8f0",
};
const axisTick = { fontSize: 10, fill: "#94a3b8" };

const PERIODS = [
  { key: 7, label: "7d" },
  { key: 30, label: "30d" },
  { key: 90, label: "90d" },
  { key: 365, label: "1a" },
  { key: 0, label: "Tudo" },
];

const card = "rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-3";

export default function BpHistory() {
  const [readings, setReadings] = useState<BpReadingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [period, setPeriod] = useState(0);
  const [showList, setShowList] = useState(true);
  const [editing, setEditing] = useState<BpReadingDTO | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/pressao", { cache: "no-store" });
        const j = await r.json();
        setReadings(j.readings || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function del(id: string) {
    if (!confirm("Excluir esta medição?")) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/pressao/${id}`, { method: "DELETE" });
      const j = await r.json();
      if (r.ok) setReadings(j.readings || []);
      if (editing?.id === id) setEditing(null);
    } finally {
      setBusy(false);
    }
  }

  const maxDays = daysSince(readings[0]?.date);
  const filtered = useMemo(() => {
    const cutoff = daysCutoff(period === 0 ? 0 : Math.min(period, maxDays));
    return cutoff ? readings.filter((r) => r.date >= cutoff) : readings;
  }, [readings, period, maxDays]);

  const chartData = filtered.map((r) => ({ label: r.date.slice(5), sys: r.sys, dia: r.dia }));

  if (loading) {
    return <div className="py-8 text-center text-[15px] text-slate-300">Carregando...</div>;
  }
  if (readings.length === 0) {
    return (
      <div className={`${card} text-center text-[15px] text-slate-300`}>
        Nenhuma medição de pressão ainda. Registre em <b>🩺 Pressão</b>.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Edição inline */}
      {editing && (
        <div className={card}>
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-300">
            Editar medição
          </div>
          <BpForm
            editing={editing}
            onSaved={(rs) => {
              setReadings(rs);
              setEditing(null);
            }}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {/* Gráfico */}
      <div className={card}>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-bold uppercase text-slate-300">Pressão (mmHg)</div>
          <PeriodButtons value={period} onChange={setPeriod} presets={PERIODS} />
        </div>
        {/* Barra de tempo: calibra quantos dias olhar para trás */}
        <div className="mb-3">
          <PeriodSlider
            value={period}
            maxDays={maxDays}
            count={filtered.length}
            countLabel="medições"
            onChange={setPeriod}
          />
        </div>
        {chartData.length === 0 ? (
          <div className="py-8 text-center text-[15px] text-slate-300">Sem medições no período.</div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} margin={{ left: -8, right: 8, top: 6 }}>
              <CartesianGrid stroke="#474750" vertical={false} />
              <XAxis dataKey="label" tick={axisTick} minTickGap={16} />
              <YAxis tick={axisTick} width={36} domain={[50, 160]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={BP_REF_SYS} stroke={SYS_COLOR} strokeDasharray="4 4" strokeOpacity={0.7} />
              <ReferenceLine y={BP_REF_DIA} stroke={DIA_COLOR} strokeDasharray="4 4" strokeOpacity={0.7} />
              <Line dataKey="sys" stroke={SYS_COLOR} dot={{ r: 2 }} name="Sistólica" />
              <Line dataKey="dia" stroke={DIA_COLOR} dot={{ r: 2 }} name="Diastólica" />
            </LineChart>
          </ResponsiveContainer>
        )}
        <div className="mt-1 text-[11px] text-slate-400">
          Linhas tracejadas: limiar residencial {BP_REF_SYS}/{BP_REF_DIA} (DBH/SBC).
        </div>
      </div>

      {/* Lista */}
      <div className={card}>
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="text-xs font-bold uppercase text-slate-300">
            Medições ({readings.length})
          </div>
          <button
            onClick={() => setShowList((v) => !v)}
            className="text-xs font-semibold text-blue-400"
          >
            {showList ? "▾ ocultar" : "▸ mostrar"}
          </button>
        </div>
        {showList && (
          <div className="divide-y divide-[#474750]">
            {readings
              .slice()
              .reverse()
              .map((r) => {
                const c = classifyBp(r.sys, r.dia);
                return (
                  <div key={r.id} className="flex items-center justify-between gap-2 py-2">
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[15px] font-bold text-white">
                          {r.sys}/{r.dia}
                        </span>
                        <span
                          className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                          style={{ color: c.color, background: `${c.color}22` }}
                        >
                          {c.label}
                        </span>
                      </div>
                      <div className="text-[12px] text-slate-400">
                        {r.date.slice(5)} · {r.time}
                        {r.note ? ` · ${r.note}` : ""}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        onClick={() => {
                          setEditing(r);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        disabled={busy}
                        className="rounded-md border border-[#55555f] bg-[#42424a] px-2 py-1 text-[12px] text-slate-200"
                      >
                        editar
                      </button>
                      <button
                        onClick={() => del(r.id)}
                        disabled={busy}
                        className="rounded-md border border-[#55555f] bg-[#42424a] px-2 py-1 text-[12px] text-slate-300"
                      >
                        excluir
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
