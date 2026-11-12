"use client";

import { useState } from "react";
import Link from "next/link";
import type { DayDTO } from "@/lib/types";

export default function SupplementsCard({
  day,
  onChange,
}: {
  day: DayDTO;
  onChange: (d: DayDTO) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const supps = day.supplements;
  const doses = day.supps_doses || {};
  const takenCount = supps.filter((s) => (doses[s.name] ?? 0) > 0).length;

  async function saveDoses(next: Record<string, number>) {
    setBusy(true);
    try {
      const r = await fetch("/api/day/supplements", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ date: day.date, doses: next }),
      });
      if (r.ok) onChange(await r.json());
    } finally {
      setBusy(false);
    }
  }

  function toggle(name: string) {
    const next = { ...doses };
    if ((next[name] ?? 0) > 0) delete next[name];
    else next[name] = supps.find((s) => s.name === name)?.dose ?? 1;
    saveDoses(next);
  }

  function openEdit() {
    const d: Record<string, string> = {};
    for (const s of supps) d[s.name] = String(doses[s.name] ?? 0);
    setDraft(d);
    setEdit(true);
  }

  async function commitEdit() {
    const next: Record<string, number> = {};
    for (const s of supps) {
      const f = Number(String(draft[s.name] ?? "").replace(",", "."));
      if (isFinite(f) && f > 0) next[s.name] = f;
    }
    await saveDoses(next);
    setEdit(false);
  }

  const chipInput =
    "w-16 rounded-lg border border-[#55555f] bg-[#42424a] px-2 py-1.5 text-center text-white outline-none";

  return (
    <div className="mb-4 rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-3">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-300"
        >
          <span>💊 Suplementos do dia</span>
          {supps.length > 0 && (
            <span className="font-semibold normal-case text-slate-400">
              {takenCount}/{supps.length}
            </span>
          )}
          <span className="text-blue-400">{open ? "▾" : "▸"}</span>
        </button>
        {open &&
          supps.length > 0 &&
          (edit ? (
            <button
              onClick={() => setEdit(false)}
              disabled={busy}
              className="text-xs font-semibold text-slate-400 disabled:opacity-50"
            >
              Cancelar
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={openEdit}
                disabled={busy}
                className="text-xs font-semibold text-blue-400 disabled:opacity-50"
              >
                ✎ Editar doses
              </button>
              <button
                onClick={() =>
                  saveDoses(
                    takenCount === supps.length
                      ? {}
                      : Object.fromEntries(supps.map((s) => [s.name, s.dose]))
                  )
                }
                disabled={busy}
                className="text-xs font-semibold text-blue-400 disabled:opacity-50"
              >
                {takenCount === supps.length ? "Limpar" : "Repetir todos"}
              </button>
            </div>
          ))}
      </div>

      {!open ? null : supps.length === 0 ? (
        <div className="mt-2 text-[13px] text-slate-300">
          Nenhum suplemento configurado.{" "}
          <Link href="/settings" className="font-semibold text-blue-400">
            Configurar no Perfil
          </Link>
          .
        </div>
      ) : edit ? (
        <div className="mt-3">
          <div className="space-y-2">
            {supps.map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-between gap-2 rounded-lg border border-[#3d3d43] bg-[#2c2c30] p-2"
              >
                <span className="min-w-0 flex-1 truncate text-[14px] text-slate-100">
                  {s.name}
                  <span className="text-[11px] text-slate-400"> · padrão {s.dose}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    className={chipInput}
                    inputMode="decimal"
                    value={draft[s.name] ?? ""}
                    onChange={(e) =>
                      setDraft((p) => ({ ...p, [s.name]: e.target.value }))
                    }
                  />
                  <span className="text-[12px] text-slate-400">cáps</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Nº de cápsulas tomadas hoje · 0 = não tomei
          </p>
          <button
            onClick={commitEdit}
            disabled={busy}
            className="mt-3 w-full rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 py-2.5 text-[15px] font-bold text-white shadow-lg shadow-emerald-950/40 ring-1 ring-inset ring-white/10 active:to-emerald-700 disabled:opacity-50"
          >
            Salvar doses
          </button>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {supps.map((s) => {
            const c = doses[s.name] ?? 0;
            const on = c > 0;
            return (
              <button
                key={s.name}
                onClick={() => toggle(s.name)}
                disabled={busy}
                className={`rounded-full border px-3 py-1.5 text-[13px] font-semibold disabled:opacity-50 ${
                  on
                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                    : "border-[#55555f] bg-[#42424a] text-slate-300"
                }`}
              >
                {on ? "✓ " : ""}
                {s.name}
                {on ? ` · ${c} cáps` : ""}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
