"use client";

import { useRef, useState } from "react";
import type { DayDTO, Estimate } from "@/lib/types";
import { fileToResizedDataUrl, splitDataUrl } from "@/lib/image";
import EstimateResult from "./EstimateResult";

function hhmm(d: Date) {
  return d.toTimeString().slice(0, 5);
}

export default function MealLogger({
  day,
  onSaved,
  onClose,
  editId,
  initialText = "",
  initialTime = "",
}: {
  day: DayDTO;
  onSaved: (d: DayDTO) => void;
  onClose: () => void;
  editId?: string;
  initialText?: string;
  initialTime?: string;
}) {
  const [text, setText] = useState(initialText);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  // Horário da refeição (HH:MM), editável. Definido ao gerar a estimativa:
  // foto → hora da foto + 15 min; manual → hora atual.
  const [mealTime, setMealTime] = useState(initialTime);
  const photoAtRef = useRef<Date | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function pick(file?: File) {
    if (!file) return;
    setErr(null);
    try {
      const url = await fileToResizedDataUrl(file);
      photoAtRef.current = new Date(); // momento da foto (proxy da captura)
      setDataUrl(url);
    } catch {
      setErr("Não consegui ler a imagem.");
    }
  }

  async function estimateMeal() {
    setErr(null);
    if (!text.trim() && !dataUrl) {
      setErr("Tire/escolha uma foto ou descreva a refeição.");
      return;
    }
    setLoading(true);
    setEstimate(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        text: text.trim() || undefined,
        dayContext: {
          trainingType: day.training_type,
          totals: day.totals,
          remaining: day.remaining,
        },
      };
      if (dataUrl) {
        const { media_type, data } = splitDataUrl(dataUrl);
        payload.imageBase64 = data;
        payload.imageMediaType = media_type;
      }
      const r = await fetch("/api/meals/estimate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Falha ao estimar.");
      setEstimate(j);
      // Define o horário padrão: foto → +15min da foto; manual → agora.
      // Em edição, preserva o horário já existente se houver.
      const base =
        dataUrl && photoAtRef.current
          ? new Date(photoAtRef.current.getTime() + 15 * 60000)
          : new Date();
      setMealTime((prev) => (editId && initialTime ? prev || initialTime : hhmm(base)));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Falha ao estimar.");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!estimate) return;
    setSaving(true);
    setErr(null);
    try {
      const common = {
        description: estimate.description,
        kcal: estimate.kcal,
        protein_g: estimate.protein_g,
        carb_g: estimate.carb_g,
        fat_g: estimate.fat_g,
        confidence: estimate.confidence,
        flags: estimate.flags,
        micros: estimate.micros,
        time: mealTime || null,
      };
      const r = editId
        ? await fetch(`/api/meals/${editId}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ ...common, ...(dataUrl ? { photo_url: dataUrl } : {}) }),
          })
        : await fetch("/api/meals/save", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ date: day.date, photo_url: dataUrl, ...common }),
          });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Falha ao salvar.");
      onSaved(j);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Falha ao salvar.");
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-300">
          {editId ? "🤖 Re-estimar refeição" : "Registrar refeição"}
        </div>
        <button onClick={onClose} className="text-[15px] text-slate-300">
          Fechar
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0] || undefined)}
      />
      <button
        onClick={() => fileRef.current?.click()}
        className="w-full rounded-xl border border-[#55555f] bg-[#42424a] py-3 text-[15px] font-bold text-slate-200"
      >
        📷 Tirar / escolher foto
      </button>

      {dataUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={dataUrl}
          alt="prévia da refeição"
          className="mt-3 max-h-56 w-full rounded-lg border border-[#474750] bg-[#242427] object-contain"
        />
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ou descreva: 2 ovos, 100g arroz, 150g frango grelhado"
        className="mt-3 min-h-[64px] w-full rounded-xl border border-[#55555f] bg-[#42424a] px-3 py-2 text-white outline-none placeholder:text-slate-300"
      />

      <button
        onClick={estimateMeal}
        disabled={loading}
        className="mt-3 w-full rounded-xl bg-blue-600 py-3 text-[15px] font-bold text-white disabled:opacity-50"
      >
        {loading ? "Analisando..." : "Estimar macros"}
      </button>

      {err && <div className="mt-3 text-[15px] text-rose-400">{err}</div>}

      {estimate && (
        <>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#474750] bg-[#242427]/60 px-3 py-2">
            <div>
              <label className="block text-[11px] uppercase text-slate-300">
                🕐 Horário da refeição
              </label>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {dataUrl
                  ? "≈ foto + 15 min · ajuste se precisar"
                  : "horário atual · ajuste se já comeu antes"}
              </p>
            </div>
            <input
              type="time"
              value={mealTime}
              onChange={(e) => setMealTime(e.target.value)}
              className="rounded-lg border border-[#55555f] bg-[#42424a] px-3 py-2 text-[15px] font-semibold text-white outline-none"
            />
          </div>
          <EstimateResult
            value={estimate}
            onChange={setEstimate}
            onConfirm={save}
            onDiscard={() => setEstimate(null)}
            saving={saving}
          />
        </>
      )}
    </div>
  );
}
