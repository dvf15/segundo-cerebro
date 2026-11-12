"use client";

import type { Estimate } from "@/lib/types";
import { FLAG_LABELS } from "@/lib/flags";
import { MICROS } from "@/lib/micros";

export default function EstimateResult({
  value,
  onChange,
  onConfirm,
  onDiscard,
  saving,
}: {
  value: Estimate;
  onChange: (v: Estimate) => void;
  onConfirm: () => void;
  onDiscard: () => void;
  saving: boolean;
}) {
  const set = (k: "kcal" | "protein_g" | "carb_g" | "fat_g", v: number) =>
    onChange({ ...value, [k]: v });

  const field = (k: "kcal" | "protein_g" | "carb_g" | "fat_g", label: string) => (
    <div>
      <label className="block text-[11px] uppercase text-slate-300">{label}</label>
      <input
        type="number"
        inputMode="numeric"
        value={value[k]}
        onChange={(e) => set(k, Math.round(Number(e.target.value) || 0))}
        className="w-full rounded-lg border border-[#55555f] bg-[#42424a] px-2 py-2 text-center text-white outline-none"
      />
    </div>
  );

  const conf = value.confidence;

  return (
    <div className="mt-3 rounded-xl border border-[#474750] bg-[#242427]/60 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[15px] font-bold text-white">{value.description}</div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
            conf >= 7 ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"
          }`}
        >
          confiança {conf}/10
        </span>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {field("kcal", "kcal")}
        {field("protein_g", "Prot")}
        {field("carb_g", "Carb")}
        {field("fat_g", "Gord")}
      </div>

      {value.micros && (
        <div className="mt-3 text-[12px] leading-relaxed text-slate-300">
          <span className="font-semibold text-slate-200">Micros (aprox.): </span>
          {MICROS.map((d) => `${d.label} ${value.micros[d.key] ?? 0}${d.unit}`).join(" · ")}
        </div>
      )}

      {value.flags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {value.flags.map((f) => {
            const m = FLAG_LABELS[f];
            return (
              <span
                key={f}
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  m?.tone === "good"
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "bg-rose-500/15 text-rose-300"
                }`}
              >
                {m?.label || f}
              </span>
            );
          })}
        </div>
      )}

      {value.uncertainties.length > 0 && (
        <ul className="mt-3 space-y-1">
          {value.uncertainties.map((u, i) => (
            <li key={i} className="text-[12px] text-slate-300">
              🔍 {u}
            </li>
          ))}
        </ul>
      )}

      {value.questions.length > 0 && (
        <ul className="mt-2 space-y-1">
          {value.questions.map((q, i) => (
            <li key={i} className="text-[12px] text-blue-300">
              ❓ {q}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          disabled={saving}
          onClick={onConfirm}
          className="rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 py-3 text-[15px] font-bold text-white shadow-lg shadow-emerald-950/40 ring-1 ring-inset ring-white/10 active:to-emerald-700 disabled:opacity-50"
        >
          {saving ? "Salvando..." : "✓ Salvar no diário"}
        </button>
        <button
          disabled={saving}
          onClick={onDiscard}
          className="rounded-xl border border-[#55555f] bg-[#42424a] py-3 text-[15px] font-bold text-slate-200 disabled:opacity-50"
        >
          Descartar
        </button>
      </div>
    </div>
  );
}
