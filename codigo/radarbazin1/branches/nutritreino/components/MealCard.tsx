"use client";

import { useState } from "react";
import type { MealDTO } from "@/lib/types";
import { FLAG_LABELS } from "@/lib/flags";

interface EditData {
  description: string;
  kcal: number;
  protein_g: number;
  carb_g: number;
  fat_g: number;
  time: string;
}

export default function MealCard({
  meal,
  onDelete,
  onEdit,
  onReestimate,
}: {
  meal: MealDTO;
  onDelete: (id: string) => void;
  onEdit: (id: string, data: EditData) => void | Promise<void>;
  onReestimate: (meal: MealDTO) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [desc, setDesc] = useState(meal.description);
  const [kcal, setKcal] = useState(String(Math.round(meal.kcal)));
  const [prot, setProt] = useState(String(Math.round(meal.protein_g)));
  const [carb, setCarb] = useState(String(Math.round(meal.carb_g)));
  const [fat, setFat] = useState(String(Math.round(meal.fat_g)));
  const [time, setTime] = useState(meal.time ?? "");

  const num = (v: string) => Number(String(v).replace(",", ".")) || 0;

  function open() {
    setDesc(meal.description);
    setKcal(String(Math.round(meal.kcal)));
    setProt(String(Math.round(meal.protein_g)));
    setCarb(String(Math.round(meal.carb_g)));
    setFat(String(Math.round(meal.fat_g)));
    setTime(meal.time ?? "");
    setEditing(true);
  }

  async function save() {
    setBusy(true);
    try {
      await onEdit(meal.id, {
        description: desc.trim() || meal.description,
        kcal: num(kcal),
        protein_g: num(prot),
        carb_g: num(carb),
        fat_g: num(fat),
        time,
      });
      setEditing(false);
    } finally {
      setBusy(false);
    }
  }

  const input =
    "w-full rounded-lg border border-[#55555f] bg-[#42424a] px-2 py-1.5 text-center text-white outline-none";
  const smallLabel = "mb-0.5 block text-[10px] uppercase text-slate-400";

  if (editing) {
    return (
      <div className="rounded-xl border border-blue-500/40 bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-3">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded bg-[#42424a] px-1.5 py-0.5 text-[11px] font-bold text-slate-300">
            {meal.code}
          </span>
          <span className="text-[12px] font-bold uppercase tracking-wide text-slate-300">
            Editar refeição
          </span>
        </div>
        <input
          className="w-full rounded-lg border border-[#55555f] bg-[#42424a] px-3 py-2 text-white outline-none"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Descrição"
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <label className={smallLabel + " mb-0"}>🕐 Horário</label>
          <input
            type="time"
            className="rounded-lg border border-[#55555f] bg-[#42424a] px-3 py-1.5 text-center text-white outline-none"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className="mt-2 grid grid-cols-4 gap-2">
          <div>
            <label className={smallLabel}>kcal</label>
            <input className={input} inputMode="numeric" value={kcal} onChange={(e) => setKcal(e.target.value)} />
          </div>
          <div>
            <label className={smallLabel}>Prot g</label>
            <input className={input} inputMode="numeric" value={prot} onChange={(e) => setProt(e.target.value)} />
          </div>
          <div>
            <label className={smallLabel}>Carb g</label>
            <input className={input} inputMode="numeric" value={carb} onChange={(e) => setCarb(e.target.value)} />
          </div>
          <div>
            <label className={smallLabel}>Gord g</label>
            <input className={input} inputMode="numeric" value={fat} onChange={(e) => setFat(e.target.value)} />
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={save}
            disabled={busy}
            className="flex-1 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 py-2 text-[14px] font-bold text-white shadow-lg shadow-emerald-950/40 ring-1 ring-inset ring-white/10 active:to-emerald-700 disabled:opacity-50"
          >
            {busy ? "Salvando..." : "Salvar"}
          </button>
          <button
            onClick={() => setEditing(false)}
            disabled={busy}
            className="rounded-xl border border-[#55555f] bg-[#42424a] px-4 py-2 text-[14px] font-bold text-slate-200 disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
        <button
          onClick={() => {
            setEditing(false);
            onReestimate(meal);
          }}
          disabled={busy}
          className="mt-2 w-full rounded-xl border border-[#55555f] bg-[#42424a] py-2 text-[14px] font-bold text-slate-200 disabled:opacity-50"
        >
          🤖 Re-estimar por IA (foto/descrição)
        </button>
        <p className="mt-1.5 text-[11px] text-slate-400">
          Editar os macros ajusta os totais do dia. Os micronutrientes estimados são mantidos.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#42424a] px-1.5 py-0.5 text-[11px] font-bold text-slate-300">
              {meal.code}
            </span>
            {meal.time && (
              <span className="shrink-0 rounded bg-[#42424a] px-1.5 py-0.5 text-[11px] font-semibold text-slate-300">
                🕐 {meal.time}
              </span>
            )}
            <span className="truncate text-[15px] font-semibold text-slate-100">
              {meal.description}
            </span>
          </div>
          <div className="mt-1 text-[12px] text-slate-300">
            P {Math.round(meal.protein_g)}g · C {Math.round(meal.carb_g)}g · G{" "}
            {Math.round(meal.fat_g)}g
          </div>
          {meal.confidence < 7 && (
            <span className="mt-1 inline-block rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-300">
              ⚠️ estimativa incerta ({meal.confidence}/10)
            </span>
          )}
          {meal.flags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {meal.flags.map((f) => {
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
        </div>
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-base font-extrabold" style={{ color: "#a78bfa" }}>
            {Math.round(meal.kcal)}
          </span>
          <button
            onClick={open}
            aria-label="Editar refeição"
            className="h-7 w-7 rounded-md border border-[#55555f] bg-[#242427] text-[12px] text-slate-300"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(meal.id)}
            aria-label="Remover refeição"
            className="h-7 w-7 rounded-md border border-[#55555f] bg-[#242427] text-slate-300"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
