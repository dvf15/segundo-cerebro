"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { MICROS, effectiveMicroTargets, type Supplement } from "@/lib/micros";
import { TRAINING_TYPES, TRAINING_LABELS } from "@/lib/targets";

type MacroPair = [string, string];
interface TgtRow {
  kcal: MacroPair;
  protein_g: MacroPair;
  carb_g: MacroPair;
  fat_g: MacroPair;
}
const TGT_MACROS: { key: keyof TgtRow; label: string; unit: string }[] = [
  { key: "kcal", label: "Calorias", unit: "" },
  { key: "protein_g", label: "Proteína", unit: "g" },
  { key: "carb_g", label: "Carboidrato", unit: "g" },
  { key: "fat_g", label: "Gordura", unit: "g" },
];

interface FoodRow {
  name: string;
  serving_g: number;
  kcal_per_serving: number;
  protein_g: number;
  carb_g: number;
  fat_g: number;
}

type Form = {
  name: string;
  weight_kg: string;
  skeletal_muscle_kg: string;
  body_fat_pct: string;
  tmb_kcal: string;
  goal: string;
  ldl: string;
  hdl: string;
  triglycerides: string;
  exam_date: string;
  notes: string;
  science_ref: string;
};

const EMPTY: Form = {
  name: "",
  weight_kg: "",
  skeletal_muscle_kg: "",
  body_fat_pct: "",
  tmb_kcal: "",
  goal: "",
  ldl: "",
  hdl: "",
  triglycerides: "",
  exam_date: "",
  notes: "",
  science_ref: "",
};

const s = (v: unknown) => (v === null || v === undefined ? "" : String(v));

// Aceita vírgula ou ponto como separador decimal.
const toNum = (v: string) => Number(String(v).replace(",", ".")) || 0;
const numMicros = (m: Record<string, string>): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(m)) out[k] = toNum(v);
  return out;
};
const strMicros = (m: Record<string, number>): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(m)) out[k] = String(v);
  return out;
};

type Targets = { kcal: number[]; protein_g: number[]; carb_g: number[]; fat_g: number[] };
const toTgtRows = (et: Record<string, Targets>): Record<string, TgtRow> => {
  const out: Record<string, TgtRow> = {};
  for (const [k, v] of Object.entries(et)) {
    out[k] = {
      kcal: [String(v.kcal[0]), String(v.kcal[1])],
      protein_g: [String(v.protein_g[0]), String(v.protein_g[1])],
      carb_g: [String(v.carb_g[0]), String(v.carb_g[1])],
      fat_g: [String(v.fat_g[0]), String(v.fat_g[1])],
    };
  }
  return out;
};
const tgtsToNum = (t: Record<string, TgtRow>) => {
  const out: Record<string, Targets> = {};
  for (const [k, v] of Object.entries(t)) {
    out[k] = {
      kcal: [toNum(v.kcal[0]), toNum(v.kcal[1])],
      protein_g: [toNum(v.protein_g[0]), toNum(v.protein_g[1])],
      carb_g: [toNum(v.carb_g[0]), toNum(v.carb_g[1])],
      fat_g: [toNum(v.fat_g[0]), toNum(v.fat_g[1])],
    };
  }
  return out;
};

export default function ProfileForm() {
  const [f, setF] = useState<Form>(EMPTY);
  const [foods, setFoods] = useState<FoodRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [importText, setImportText] = useState("");
  const [importErr, setImportErr] = useState<string | null>(null);
  const [microTargets, setMicroTargets] = useState<Record<string, string>>({});
  const [supps, setSupps] = useState<Supplement[]>([]);
  const [draftName, setDraftName] = useState("");
  const [draftDose, setDraftDose] = useState("1");
  const [draftMicros, setDraftMicros] = useState<Record<string, string>>({});
  const [tgts, setTgts] = useState<Record<string, TgtRow>>({});
  const [showTargets, setShowTargets] = useState(false);
  const [phase, setPhase] = useState("");
  const [phaseSetAt, setPhaseSetAt] = useState<string | null>(null);

  const setTgt = (tt: string, macro: keyof TgtRow, idx: 0 | 1, val: string) =>
    setTgts((p) => {
      const row = p[tt];
      const pair: MacroPair = idx === 0 ? [val, row[macro][1]] : [row[macro][0], val];
      return { ...p, [tt]: { ...row, [macro]: pair } };
    });

  const apply = useCallback((p: Record<string, unknown>, fd: FoodRow[]) => {
    setF({
      name: s(p.name),
      weight_kg: s(p.weight_kg),
      skeletal_muscle_kg: s(p.skeletal_muscle_kg),
      body_fat_pct: s(p.body_fat_pct),
      tmb_kcal: s(p.tmb_kcal),
      goal: s(p.goal),
      ldl: s(p.ldl),
      hdl: s(p.hdl),
      triglycerides: s(p.triglycerides),
      exam_date: s(p.exam_date),
      notes: s(p.notes),
      science_ref: s(p.science_ref),
    });
    setMicroTargets(strMicros(effectiveMicroTargets((p.micro_targets as Record<string, number>) ?? null)));
    setSupps(Array.isArray(p.supplements) ? (p.supplements as Supplement[]) : []);
    setPhase(typeof p.phase === "string" ? p.phase : "");
    setPhaseSetAt(typeof p.phase_set_at === "string" ? p.phase_set_at : null);
    setFoods(fd || []);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/profile", { cache: "no-store" });
        const j = await r.json();
        apply(j.profile || {}, j.foods || []);
        if (j.effective_targets) setTgts(toTgtRows(j.effective_targets));
      } finally {
        setLoading(false);
      }
    })();
  }, [apply]);

  function flash(m: string) {
    setToast(m);
    setTimeout(() => setToast(null), 2500);
  }

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  async function save() {
    setSaving(true);
    try {
      const r = await fetch("/api/profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: f.name,
          weight_kg: f.weight_kg,
          skeletal_muscle_kg: f.skeletal_muscle_kg,
          body_fat_pct: f.body_fat_pct,
          tmb_kcal: f.tmb_kcal,
          goal: f.goal,
          notes: f.notes,
          science_ref: f.science_ref,
          exams: {
            ldl: f.ldl,
            hdl: f.hdl,
            triglycerides: f.triglycerides,
            date: f.exam_date,
          },
          micro_targets: numMicros(microTargets),
          supplements: supps,
          targets: tgtsToNum(tgts),
          ...(phase ? { phase } : {}),
        }),
      });
      const j = await r.json();
      if (j.profile) apply(j.profile, j.foods || foods);
      flash("Perfil salvo ✓");
    } catch {
      flash("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function importJson() {
    setImportErr(null);
    let parsed: unknown;
    try {
      parsed = JSON.parse(importText);
    } catch {
      setImportErr("JSON inválido. Cole o resumo gerado pela skill.");
      return;
    }
    setSaving(true);
    try {
      const r = await fetch("/api/profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Falha ao importar.");
      if (j.profile) apply(j.profile, j.foods || []);
      setImportText("");
      flash("Importado ✓");
    } catch (e) {
      setImportErr(e instanceof Error ? e.message : "Falha ao importar.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmPhase() {
    if (!phase) return;
    setSaving(true);
    try {
      const r = await fetch("/api/profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phase, confirm_phase: true }),
      });
      const j = await r.json();
      if (j.profile) apply(j.profile, j.foods || foods);
      flash("Fase/metas confirmadas ✓");
    } catch {
      flash("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  function addSupp() {
    const name = draftName.trim();
    if (!name) return;
    const dose = toNum(draftDose) || 1;
    setSupps((prev) => [...prev, { name, dose, micros: numMicros(draftMicros) }]);
    setDraftName("");
    setDraftDose("1");
    setDraftMicros({});
  }

  const input = "w-full rounded-lg border border-[#55555f] bg-[#42424a] px-3 py-2 text-white outline-none";
  const label = "mb-1 block text-[12px] uppercase tracking-wide text-slate-300";

  if (loading) {
    return <div className="py-8 text-center text-[15px] text-slate-300">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-4">
        <div className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-300">
          Dados pessoais
        </div>
        <div className="mb-3">
          <label className={label}>Nome</label>
          <input className={input} value={f.name} onChange={set("name")} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Peso (kg)</label>
            <input className={input} inputMode="decimal" value={f.weight_kg} onChange={set("weight_kg")} />
          </div>
          <div>
            <label className={label}>Massa magra (kg)</label>
            <input className={input} inputMode="decimal" value={f.skeletal_muscle_kg} onChange={set("skeletal_muscle_kg")} />
          </div>
          <div>
            <label className={label}>Gordura (%)</label>
            <input className={input} inputMode="decimal" value={f.body_fat_pct} onChange={set("body_fat_pct")} />
          </div>
          <div>
            <label className={label}>TMB (kcal)</label>
            <input className={input} inputMode="numeric" value={f.tmb_kcal} onChange={set("tmb_kcal")} />
          </div>
        </div>
        <div className="mt-3">
          <label className={label}>Objetivo</label>
          <textarea className={`${input} min-h-[52px]`} value={f.goal} onChange={set("goal")} />
        </div>
      </div>

      <div className="rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-4">
        <div className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-300">
          Fase & metas
        </div>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className={label}>Fase atual</label>
            <select
              className={input}
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
            >
              <option value="">—</option>
              <option value="corte">Corte</option>
              <option value="manutencao">Manutenção</option>
              <option value="ganho">Ganho</option>
            </select>
          </div>
          <button
            onClick={confirmPhase}
            disabled={saving || !phase}
            className="shrink-0 rounded-xl border border-[#55555f] bg-[#42424a] px-4 py-2 text-[14px] font-bold text-slate-200 disabled:opacity-50"
          >
            ✔ Revisei as metas
          </button>
        </div>
        <p className="mt-2 text-[12px] text-slate-300">
          {phaseSetAt
            ? `Última revisão de metas: ${phaseSetAt}.`
            : "Defina a fase para acompanhar quando as metas foram revisadas."}{" "}
          O app avisa no diário se um exame novo for registrado depois disto (ou após 60 dias).
        </p>
      </div>

      <div className="rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-4">
        <div className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-300">
          Exames (lipídico)
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={label}>LDL</label>
            <input className={input} inputMode="numeric" value={f.ldl} onChange={set("ldl")} />
          </div>
          <div>
            <label className={label}>HDL</label>
            <input className={input} inputMode="numeric" value={f.hdl} onChange={set("hdl")} />
          </div>
          <div>
            <label className={label}>Triglic.</label>
            <input className={input} inputMode="numeric" value={f.triglycerides} onChange={set("triglycerides")} />
          </div>
        </div>
        <div className="mt-3">
          <label className={label}>Data do exame</label>
          <input className={input} placeholder="2026-06-10" value={f.exam_date} onChange={set("exam_date")} />
        </div>
      </div>

      <div className="rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-4">
        <div className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-300">
          Diretrizes para a IA
        </div>
        <textarea
          className={`${input} min-h-[80px]`}
          value={f.notes}
          onChange={set("notes")}
          placeholder="Ex.: priorizar proteína magra e ômega-3; reduzir gordura saturada; ..."
        />
        <p className="mt-2 text-[12px] text-slate-300">
          Tudo isto é usado nas estimativas por foto e nas sugestões de refeição.
        </p>
      </div>

      <div className="rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-4">
        <div className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-300">
          Referencial científico (IA)
        </div>
        <textarea
          className={`${input} min-h-[160px] text-[13px]`}
          value={f.science_ref}
          onChange={set("science_ref")}
          placeholder="Referencial científico e ordem de prioridade de autores que a IA deve seguir..."
        />
        <p className="mt-2 text-[12px] text-slate-300">
          Racional de instruções (ordem de prioridade de autores e fontes). A IA segue esta
          hierarquia ao justificar as sugestões e evita biohacks sem evidência.
        </p>
      </div>

      <div className="rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-4">
        <button
          onClick={() => setShowTargets((v) => !v)}
          className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-wide text-slate-300"
        >
          <span>Metas por treino (macros)</span>
          <span className="text-blue-400">{showTargets ? "▾ ocultar" : "▸ editar"}</span>
        </button>
        {showTargets && (
          <div className="mt-3 space-y-3">
            {TRAINING_TYPES.filter((tt) => tgts[tt]).map((tt) => (
              <div key={tt} className="rounded-lg border border-[#3d3d43] bg-[#2c2c30] p-2.5">
                <div className="mb-2 text-[13px] font-bold text-slate-100">{TRAINING_LABELS[tt]}</div>
                <div className="space-y-1.5">
                  {TGT_MACROS.map((m) => (
                    <div key={m.key} className="flex items-center gap-2">
                      <span className="w-24 shrink-0 text-[12px] text-slate-300">{m.label}</span>
                      <input
                        className="w-16 rounded-lg border border-[#55555f] bg-[#42424a] px-2 py-1.5 text-center text-[14px] text-white outline-none"
                        inputMode="numeric"
                        value={tgts[tt][m.key][0]}
                        onChange={(e) => setTgt(tt, m.key, 0, e.target.value)}
                      />
                      <span className="text-slate-400">–</span>
                      <input
                        className="w-16 rounded-lg border border-[#55555f] bg-[#42424a] px-2 py-1.5 text-center text-[14px] text-white outline-none"
                        inputMode="numeric"
                        value={tgts[tt][m.key][1]}
                        onChange={(e) => setTgt(tt, m.key, 1, e.target.value)}
                      />
                      <span className="text-[12px] text-slate-400">{m.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-[12px] text-slate-300">
              Faixa mín.–máx. por tipo de treino. As metas do dia seguem o treino selecionado.
            </p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-4">
        <div className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-300">
          Metas de micronutrientes
        </div>
        <div className="grid grid-cols-3 gap-3">
          {MICROS.map((d) => (
            <div key={d.key}>
              <label className={label}>
                {d.label} ({d.unit}){d.mode === "limit" ? " · máx" : ""}
              </label>
              <input
                className={input}
                inputMode="decimal"
                value={microTargets[d.key] ?? ""}
                onChange={(e) =>
                  setMicroTargets((p) => ({ ...p, [d.key]: e.target.value }))
                }
              />
            </div>
          ))}
        </div>
        <p className="mt-2 text-[12px] text-slate-300">
          Pré‑preenchidas por referência (sódio é teto). Ajuste conforme seus exames/orientação.
        </p>
      </div>

      <div className="rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-4">
        <div className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-300">
          Suplementos (diários)
        </div>
        {supps.length === 0 ? (
          <div className="text-[13px] text-slate-300">Nenhum suplemento. Adicione abaixo.</div>
        ) : (
          <div className="space-y-2">
            {supps.map((sp, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-2 rounded-lg border border-[#3d3d43] bg-[#2c2c30] p-2"
              >
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold text-slate-100">
                    {sp.name}
                    <span className="text-[11px] font-normal text-slate-400">
                      {" "}· {sp.dose} cáps/dia
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {MICROS.filter((d) => (sp.micros[d.key] || 0) > 0)
                      .map((d) => `${d.label} ${sp.micros[d.key]}${d.unit}`)
                      .join(" · ") || "sem micros"}
                  </div>
                </div>
                <button
                  onClick={() => setSupps(supps.filter((_, j) => j !== i))}
                  className="shrink-0 rounded-md border border-[#55555f] bg-[#42424a] px-2 py-1 text-[12px] text-slate-300"
                >
                  remover
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 rounded-lg border border-[#3d3d43] bg-[#2c2c30] p-3">
          <label className={label}>Adicionar suplemento</label>
          <div className="flex gap-2">
            <input
              className={`${input} flex-1`}
              placeholder="Nome (ex.: Vitamina D 2000 UI)"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
            />
            <div className="w-24 shrink-0">
              <input
                className={`${input} text-center`}
                inputMode="decimal"
                placeholder="cáps"
                value={draftDose}
                onChange={(e) => setDraftDose(e.target.value)}
              />
            </div>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Informe os micros para a dose padrão (nº de cápsulas) acima.
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {MICROS.map((d) => (
              <div key={d.key}>
                <label className="block text-[10px] uppercase text-slate-400">
                  {d.label} ({d.unit})
                </label>
                <input
                  className="w-full rounded-lg border border-[#55555f] bg-[#42424a] px-2 py-1.5 text-center text-white outline-none"
                  inputMode="decimal"
                  value={draftMicros[d.key] ?? ""}
                  onChange={(e) =>
                    setDraftMicros((p) => ({ ...p, [d.key]: e.target.value }))
                  }
                />
              </div>
            ))}
          </div>
          <button
            onClick={addSupp}
            disabled={!draftName.trim()}
            className="mt-3 w-full rounded-xl border border-[#55555f] bg-[#42424a] py-2.5 text-[15px] font-bold text-slate-200 disabled:opacity-50"
          >
            + Adicionar suplemento
          </button>
        </div>
        <p className="mt-2 text-[12px] text-slate-300">
          Configure uma vez. No diário, toque em “Repetir todos” ou marque os que tomou. Salve o
          perfil para aplicar.
        </p>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="w-full rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-600 py-3 text-[15px] font-bold text-white shadow-lg shadow-emerald-950/40 ring-1 ring-inset ring-white/10 active:to-emerald-700 disabled:opacity-50"
      >
        {saving ? "Salvando..." : "Salvar perfil"}
      </button>

      <div className="rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-4">
        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-300">
          Importar do resumo (skill)
        </div>
        <p className="mb-2 text-[12px] text-slate-300">
          Cole aqui o JSON gerado pela skill do seu projeto fitness — atualiza tudo de uma vez
          (perfil, exames, metas e alimentos).
        </p>
        <textarea
          className={`${input} min-h-[96px] font-mono text-[13px]`}
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder='{"weight_kg":110.4,"exams":{"ldl":120,...}}'
        />
        {importErr && <div className="mt-2 text-[15px] text-rose-400">{importErr}</div>}
        <button
          onClick={importJson}
          disabled={saving || !importText.trim()}
          className="mt-3 w-full rounded-xl border border-[#55555f] bg-[#42424a] py-2.5 text-[15px] font-bold text-slate-200 disabled:opacity-50"
        >
          Importar JSON
        </button>
      </div>

      <div className="pt-2 text-center">
        <Link href="/" className="text-[15px] font-semibold text-blue-400">
          ← Voltar ao diário
        </Link>
      </div>

      {toast && (
        <div className="fixed inset-x-0 bottom-6 mx-auto w-fit rounded-full bg-emerald-600 px-4 py-2 text-[15px] font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
