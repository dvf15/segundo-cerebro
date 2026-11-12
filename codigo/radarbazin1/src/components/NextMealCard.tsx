"use client";

import { useState } from "react";
import type { DayDTO } from "@/lib/types";

interface Rec {
  meal_code: string;
  titulo: string;
  descricao: string;
  kcal: number;
  protein_g: number;
  carb_g: number;
  fat_g: number;
  justificativa: string;
  style?: string;
}
interface Plan {
  meals: Rec[];
  totals: { kcal: number; protein_g: number; carb_g: number; fat_g: number };
  resumo: string;
}

function MealBlock({ m }: { m: Rec }) {
  return (
    <div>
      <div className="text-[15px] font-bold text-white">
        {m.meal_code} · {m.titulo}
      </div>
      {m.descricao && <div className="mt-1 text-[15px] text-slate-300">{m.descricao}</div>}
      <div className="mt-1.5 text-[13px] font-semibold" style={{ color: "#a78bfa" }}>
        ~{m.kcal} kcal{" "}
        <span className="font-normal text-slate-300">
          · P {m.protein_g}g · C {m.carb_g}g · G {m.fat_g}g
        </span>
      </div>
      {m.justificativa && <div className="mt-1 text-[13px] text-slate-300">{m.justificativa}</div>}
    </div>
  );
}

// Quatro jeitos de pedir a próxima refeição: temperatura ou sabor predominante.
const STYLES = [
  { key: "quente", label: "Quente", icon: "🔥" },
  { key: "frio", label: "Frio", icon: "❄️" },
  { key: "salgado", label: "Salgado", icon: "🧂" },
  { key: "doce", label: "Doce", icon: "🍯" },
] as const;

export default function NextMealCard({ day }: { day: DayDTO }) {
  const [rec, setRec] = useState<Rec | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loadingRec, setLoadingRec] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function generateRec(style: string) {
    setLoadingRec(style);
    setErr(null);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ date: day.date, clientHour: new Date().getHours(), style }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Falha ao gerar a sugestão.");
      setRec(j);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Falha ao gerar a sugestão.");
    } finally {
      setLoadingRec(null);
    }
  }

  async function generatePlan() {
    setLoadingPlan(true);
    setErr(null);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ date: day.date, clientHour: new Date().getHours() }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Falha ao gerar o cardápio.");
      setPlan(j);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Falha ao gerar o cardápio.");
    } finally {
      setLoadingPlan(false);
    }
  }

  const btn =
    "w-full rounded-xl border border-[#55555f] bg-[#42424a] py-2.5 text-[14px] font-bold text-slate-200 disabled:opacity-50";

  return (
    <div className="mb-4 rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-3">
      <div className="text-xs font-bold uppercase tracking-wide text-slate-300">
        🍽️ Sugestões de refeição
      </div>

      {/* Próxima refeição: 4 estilos (temperatura ou sabor predominante) */}
      <div className="mt-3 text-[13px] font-semibold text-slate-200">Sugerir próxima refeição</div>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {STYLES.map((st) => {
          const active = rec?.style === st.key;
          return (
            <button
              key={st.key}
              type="button"
              onClick={() => generateRec(st.key)}
              disabled={loadingRec !== null}
              className={`flex flex-col items-center gap-0.5 rounded-xl border py-2 text-[13px] font-bold disabled:opacity-50 ${
                active
                  ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300"
                  : "border-[#55555f] bg-[#42424a] text-slate-200"
              }`}
            >
              <span className="text-[18px] leading-none">{loadingRec === st.key ? "…" : st.icon}</span>
              {st.label}
            </button>
          );
        })}
      </div>

      {rec && (
        <div className="mt-2 rounded-xl border border-[#3d3d43] bg-[#2c2c30] p-2.5">
          {rec.style && (
            <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.1em] text-emerald-300">
              {STYLES.find((x) => x.key === rec.style)?.icon} {STYLES.find((x) => x.key === rec.style)?.label} · toque de novo para outra opção
            </div>
          )}
          <MealBlock m={rec} />
        </div>
      )}

      {/* Cardápio do dia */}
      <button onClick={generatePlan} disabled={loadingPlan} className={`mt-3 ${btn}`}>
        {loadingPlan
          ? "Montando cardápio..."
          : plan
            ? "↻ Refazer cardápio do dia"
            : "Sugerir cardápio do dia"}
      </button>

      {err && <div className="mt-2 text-[15px] text-rose-400">{err}</div>}

      {plan && (
        <div className="mt-2 space-y-2">
          {plan.meals.map((m) => (
            <div key={m.meal_code} className="rounded-xl border border-[#3d3d43] bg-[#2c2c30] p-2.5">
              <MealBlock m={m} />
            </div>
          ))}
          {plan.meals.length > 0 && (
            <div className="rounded-xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-2.5 text-[13px]">
              <div className="font-semibold text-slate-200">
                Soma do cardápio: ~{plan.totals.kcal} kcal · P {plan.totals.protein_g}g · C{" "}
                {plan.totals.carb_g}g · G {plan.totals.fat_g}g
              </div>
              {plan.resumo && <div className="mt-1 text-slate-300">{plan.resumo}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
