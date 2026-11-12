"use client";

import { useState } from "react";
import type { DayDTO } from "@/lib/types";
import { MICROS, microStatus } from "@/lib/micros";

const BAR: Record<string, string> = {
  good: "bg-emerald-500",
  mid: "bg-amber-400",
  low: "bg-rose-500",
  over: "bg-rose-500",
};

function scoreColor(s: number) {
  if (s >= 80) return "#4ade9a";
  if (s >= 50) return "#fbd24e";
  return "#fb8da0";
}

function fmt(v: number, unit: string) {
  const n = unit === "g" ? Math.round(v * 10) / 10 : Math.round(v);
  return `${n}${unit}`;
}

export default function MicroScoreCard({ day }: { day: DayDTO }) {
  const [open, setOpen] = useState(false);
  const score = day.micro_score;

  // Nunca mostrar o agregado sem o pior componente que ele esconde.
  // Inclui a proteína (macro que mais importa) junto dos micros "goal".
  const items = [
    {
      label: "Proteína",
      value: day.totals.protein_g,
      target: day.targets.protein_g[1],
      unit: "g",
    },
    ...MICROS.filter((d) => d.mode === "goal").map((d) => ({
      label: d.label,
      value: day.micros_totals[d.key] || 0,
      target: day.micro_targets[d.key] ?? d.target,
      unit: d.unit,
    })),
  ];
  const worst = items
    .map((x) => ({ ...x, pct: x.target > 0 ? x.value / x.target : 1 }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 2);

  return (
    <div className="mb-4 rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2"
      >
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-extrabold leading-none" style={{ color: scoreColor(score) }}>
            {score}%
          </span>
          <span className="text-[13px] font-semibold text-slate-300">das metas do dia</span>
        </div>
        <span className="text-[12px] font-semibold text-blue-400">
          {open ? "▾ ocultar" : "▸ detalhes"}
        </span>
      </button>

      {/* Piores do dia — sempre visível, ao lado do agregado */}
      <div className="mt-2 text-[12.5px] text-slate-300">
        <span className="text-slate-400">Piores hoje: </span>
        {worst.map((w, i) => (
          <span key={w.label}>
            {i > 0 && <span className="text-slate-500"> · </span>}
            <span style={{ color: scoreColor(Math.round(w.pct * 100)) }}>
              {w.label} {fmt(w.value, w.unit)}/{fmt(w.target, w.unit)}
            </span>
          </span>
        ))}
      </div>

      {open && (
        <>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
            {MICROS.map((d) => {
              const target = day.micro_targets[d.key] ?? d.target;
              const v = day.micros_totals[d.key] || 0;
              const st = microStatus(v, d, target);
              const pct = Math.max(0, Math.min(100, target > 0 ? (v / target) * 100 : 0));
              const ref = d.mode === "limit" ? `máx ${target}` : `meta ${target}`;
              return (
                <div key={d.key}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[12px] font-semibold text-slate-200">{d.label}</span>
                    <span className="text-[12px] text-slate-300">
                      {v}
                      <span className="text-slate-400">{d.unit}</span>
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/30 ring-1 ring-inset ring-white/5">
                    <div
                      className={`h-full rounded-full ${BAR[st]} shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-0.5 text-[10px] text-slate-400">
                    {ref} {d.unit}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            Estimativa aproximada da IA — referência de qualidade, não medição exata.
          </div>
        </>
      )}
    </div>
  );
}
