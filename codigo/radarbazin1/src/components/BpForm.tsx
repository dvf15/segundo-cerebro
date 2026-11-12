"use client";

import { useEffect, useState } from "react";
import { classifyBp, type BpReadingDTO } from "@/lib/bp";

function todayKey() {
  return new Date().toLocaleDateString("en-CA");
}
function nowTime() {
  return new Date().toTimeString().slice(0, 5);
}

export default function BpForm({
  editing = null,
  onSaved,
  onCancel,
}: {
  editing?: BpReadingDTO | null;
  onSaved: (readings: BpReadingDTO[]) => void;
  onCancel?: () => void;
}) {
  const [date, setDate] = useState(todayKey());
  const [time, setTime] = useState(nowTime());
  const [sys, setSys] = useState("");
  const [dia, setDia] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (editing) {
      setDate(editing.date);
      setTime(editing.time);
      setSys(String(editing.sys));
      setDia(String(editing.dia));
      setNote(editing.note || "");
    } else {
      setDate(todayKey());
      setTime(nowTime());
      setSys("");
      setDia("");
      setNote("");
    }
  }, [editing]);

  async function save() {
    const s = Math.round(Number(sys));
    const d = Math.round(Number(dia));
    if (!date || !time || !isFinite(s) || !isFinite(d) || s <= 0 || d <= 0) {
      setErr("Preencha data, hora, sistólica e diastólica.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const url = editing ? `/api/pressao/${editing.id}` : "/api/pressao";
      const r = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ date, time, sys: s, dia: d, note }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Falha ao salvar.");
      onSaved(j.readings || []);
      if (!editing) {
        setSys("");
        setDia("");
        setNote("");
        setDate(todayKey());
        setTime(nowTime());
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Falha ao salvar.");
    } finally {
      setBusy(false);
    }
  }

  const input =
    "w-full rounded-lg border border-[#55555f] bg-[#42424a] px-3 py-2 text-white outline-none";
  const label = "mb-1 block text-[12px] uppercase tracking-wide text-slate-300";
  const preview =
    sys && dia ? classifyBp(Math.round(Number(sys)), Math.round(Number(dia))) : null;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label}>Data</label>
          <input type="date" className={input} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className={label}>Hora</label>
          <input type="time" className={input} value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div>
          <label className={label}>Sistólica (mmHg)</label>
          <input
            className={input}
            inputMode="numeric"
            placeholder="120"
            value={sys}
            onChange={(e) => setSys(e.target.value)}
          />
        </div>
        <div>
          <label className={label}>Diastólica (mmHg)</label>
          <input
            className={input}
            inputMode="numeric"
            placeholder="80"
            value={dia}
            onChange={(e) => setDia(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-3">
        <label className={label}>Observação (opcional)</label>
        <input
          className={input}
          placeholder="Ex.: após acordar, em repouso"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      {preview && (
        <div className="mt-2 text-[13px] text-slate-300">
          Classificação: <b style={{ color: preview.color }}>{preview.label}</b>
        </div>
      )}
      {err && <div className="mt-2 text-[15px] text-rose-400">{err}</div>}
      <div className="mt-3 flex gap-2">
        <button
          onClick={save}
          disabled={busy}
          className="flex-1 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 py-2.5 text-[15px] font-bold text-white shadow-lg shadow-emerald-950/40 ring-1 ring-inset ring-white/10 active:to-emerald-700 disabled:opacity-50"
        >
          {busy ? "Salvando..." : editing ? "Salvar alteração" : "Salvar medição"}
        </button>
        {editing && onCancel && (
          <button
            onClick={onCancel}
            disabled={busy}
            className="rounded-xl border border-[#55555f] bg-[#42424a] px-4 py-2.5 text-[15px] font-bold text-slate-200 disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
