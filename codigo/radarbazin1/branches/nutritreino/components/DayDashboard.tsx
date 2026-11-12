"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { DayDTO, MealDTO, TrainingType } from "@/lib/types";
import { TRAINING_LABELS } from "@/lib/targets";
import { intradayAlerts } from "@/lib/alerts";
import MacroProgress from "./MacroProgress";
import MicroScoreCard from "./MicroScoreCard";
import SupplementsCard from "./SupplementsCard";
import MealCard from "./MealCard";
import MealLogger from "./MealLogger";
import NextMealCard from "./NextMealCard";
import TrainingSelector from "./TrainingSelector";
import BottomNav from "./BottomNav";

// Título de seção padronizado (eyebrow com ponto de cor).
function SectionTitle({ title, hint, accent }: { title: string; hint?: string; accent: string }) {
  return (
    <div className="mb-2 mt-1 flex items-center gap-2">
      <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
      <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-200">{title}</span>
      {hint && <span className="text-[12px] font-medium text-slate-400">· {hint}</span>}
    </div>
  );
}

// Cores por macro adaptadas para boa leitura no tema escuro.
const COLORS = {
  kcal: "#a78bfa",
  protein: "#34d399",
  carb: "#fb923c",
  fat: "#f87171",
};

function todayKey() {
  return new Date().toLocaleDateString("en-CA");
}
function shift(date: string, days: number) {
  const d = new Date(date + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-CA");
}
function labelFor(date: string) {
  const d = new Date(date + "T12:00:00");
  if (date === todayKey())
    return "Hoje · " + d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  const s = d.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Jejum corrente desde a última refeição. Retorna null se não houver refeição.
function fastingInfo(lastIso: string | null, nowTs: number) {
  if (!lastIso) return null;
  const last = Date.parse(lastIso);
  if (!isFinite(last)) return null;
  const ms = Math.max(0, nowTs - last);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const label = h > 0 ? `${h}h ${String(m).padStart(2, "0")}min` : `${m}min`;
  const since = new Date(last).toLocaleString("pt-BR", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  return { label, since, hours: ms / 3600000 };
}

export default function DayDashboard() {
  const [date, setDate] = useState(todayKey());
  const [day, setDay] = useState<DayDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [logging, setLogging] = useState(false);
  const [showMeals, setShowMeals] = useState(true);
  const [reestimate, setReestimate] = useState<MealDTO | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [weightInput, setWeightInput] = useState("");
  const [savingWeight, setSavingWeight] = useState(false);
  const [nowTs, setNowTs] = useState<number>(() => Date.now());

  // Relógio do jejum: atualiza a cada 30s enquanto a tela está aberta.
  useEffect(() => {
    const id = setInterval(() => setNowTs(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const fetchDay = useCallback(async (d: string) => {
    setLoading(true);
    try {
      const r = await fetch(`/api/day/${d}`, { cache: "no-store" });
      setDay(await r.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDay(date);
  }, [date, fetchDay]);

  // Mantém o campo de peso em sincronia com o dia carregado/salvo.
  useEffect(() => {
    setWeightInput(day?.weight_kg != null ? String(day.weight_kg) : "");
  }, [day?.date, day?.weight_kg]);

  function flash(m: string) {
    setToast(m);
    setTimeout(() => setToast(null), 2500);
  }

  async function setTraining(t: TrainingType) {
    const r = await fetch("/api/day/training", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ date, training_type: t }),
    });
    if (r.ok) setDay(await r.json());
  }

  async function setSauna(min: number) {
    const r = await fetch("/api/day/sauna", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ date, sauna_min: min }),
    });
    if (r.ok) setDay(await r.json());
  }

  // Registra o peso do dia visível. Alimenta o histórico de peso: grava em
  // Day.weight_kg — a mesma fonte lida pela aba Peso do Histórico (/api/peso).
  async function resetFast() {
    if (!confirm("Reiniciar o jejum agora? (marca que você acabou de comer)")) return;
    // Envia o horário LOCAL do navegador (naive), p/ o servidor não errar o fuso.
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, "0");
    const at = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:00`;
    const r = await fetch("/api/day/fast-reset", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ date, at }),
    });
    if (r.ok) {
      setDay(await r.json());
      setNowTs(Date.now());
      flash("Jejum reiniciado ✓");
    }
  }

  async function saveWeight() {
    if (savingWeight || !day) return;
    setSavingWeight(true);
    try {
      const r = await fetch("/api/day/weight", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ date, weight_kg: weightInput.trim() }),
      });
      if (r.ok) {
        setDay(await r.json());
        flash(weightInput.trim() ? "Peso salvo ✓" : "Peso removido");
      } else {
        const j = await r.json().catch(() => ({}));
        flash(j.error || "Peso inválido");
      }
    } finally {
      setSavingWeight(false);
    }
  }

  async function delMeal(id: string) {
    const r = await fetch(`/api/meals/${id}`, { method: "DELETE" });
    if (r.ok) setDay(await r.json());
  }

  async function editMeal(
    id: string,
    data: { description: string; kcal: number; protein_g: number; carb_g: number; fat_g: number; time: string }
  ) {
    const r = await fetch(`/api/meals/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    if (r.ok) setDay(await r.json());
  }

  async function closeDay() {
    const willClose = !day?.closed;
    const r = await fetch("/api/day/close", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ date, closed: willClose }),
    });
    if (r.ok) {
      setDay(await r.json());
      flash(willClose ? "Dia fechado ✓" : "Dia reaberto");
    }
  }

  const isToday = date === todayKey();

  return (
    <main className="mx-auto max-w-2xl p-4 pb-32">
      <header className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={process.env.NEXT_PUBLIC_APP_ICON || "/icon.svg"}
            alt=""
            className="h-10 w-10 rounded-[12px] shadow-sm ring-1 ring-white/10"
          />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              {process.env.NEXT_PUBLIC_APP_NAME || "Nu.tre"}
            </h1>
            <p className="text-[13px] text-slate-400">
              Diário{day?.owner_name ? ` · ${day.owner_name}` : ""}
            </p>
          </div>
        </div>
      </header>

      {/* Jejum corrente desde a última refeição */}
      {day && (() => {
        const f = fastingInfo(day.last_meal_at, nowTs);
        return (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">⏳</span>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Jejum atual
                </div>
                <div className="text-[12px] text-slate-400">
                  {f ? `desde ${f.since}` : "nenhuma refeição registrada"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="text-xl font-extrabold"
                style={{ color: f ? (f.hours >= 16 ? "#34d399" : "#e2e8f0") : "#64748b" }}
              >
                {f ? f.label : "—"}
              </div>
              <button
                onClick={resetFast}
                disabled={!day}
                aria-label="Reiniciar jejum"
                className="rounded-lg border border-[#55555f] bg-[#42424a] px-3 py-1.5 text-[13px] font-semibold text-slate-200 active:bg-[#4c4c57] disabled:opacity-50"
              >
                ↺ Reiniciar
              </button>
            </div>
          </div>
        );
      })()}

      {/* Data + treino */}
      <div className="mb-4 rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-3">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setDate(shift(date, -1))}
            className="h-9 w-10 rounded-lg border border-[#55555f] bg-[#42424a] text-slate-300"
          >
            ‹
          </button>
          <div className="flex-1 text-center text-[15px] font-bold text-white">{labelFor(date)}</div>
          <button
            onClick={() => !isToday && setDate(shift(date, 1))}
            disabled={isToday}
            className="h-9 w-10 rounded-lg border border-[#55555f] bg-[#42424a] text-slate-300 disabled:opacity-40"
          >
            ›
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-xs text-slate-300">Treino do dia</span>
          <TrainingSelector
            value={day?.training_type ?? "rest"}
            onChange={setTraining}
            disabled={loading}
            options={day?.training_options}
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-xs text-slate-300">
            Sauna
            {day && day.sauna_kcal > 0 && (
              <span className="ml-1 text-emerald-400">+{day.sauna_kcal} kcal</span>
            )}
          </span>
          <div className="flex gap-1.5">
            {[
              { m: 0, label: "Não" },
              { m: 15, label: "15 min" },
              { m: 30, label: "30 min" },
            ].map((o) => {
              const on = (day?.sauna_min ?? 0) === o.m;
              return (
                <button
                  key={o.m}
                  onClick={() => setSauna(o.m)}
                  disabled={loading || !day}
                  className={`rounded-lg border px-2.5 py-1.5 text-[13px] font-semibold disabled:opacity-50 ${
                    on
                      ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                      : "border-[#55555f] bg-[#42424a] text-slate-300"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-xs text-slate-300">Peso (kg)</span>
          <div className="flex items-center gap-2">
            <input
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveWeight()}
              inputMode="decimal"
              placeholder="0,0"
              disabled={!day}
              className="w-24 rounded-lg border border-[#55555f] bg-[#42424a] px-3 py-1.5 text-center text-[15px] font-semibold text-white outline-none disabled:opacity-50"
            />
            <button
              onClick={saveWeight}
              disabled={!day || savingWeight}
              className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-[14px] font-semibold text-white disabled:opacity-50"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>

      {/* Aviso de meta/fase desatualizada */}
      {day?.meta_alert && (
        <div className="animate-in mb-4 flex items-center justify-between gap-2 rounded-xl border border-blue-500/40 bg-blue-500/10 px-3 py-2 text-[14px] text-blue-200">
          <span>{day.meta_alert}</span>
          <Link href="/settings" className="shrink-0 font-semibold text-blue-300">
            Perfil →
          </Link>
        </div>
      )}

      {/* Progresso */}
      {day && <SectionTitle title="Score Macro" hint="Look Good" accent={COLORS.protein} />}
      {day && (
        <div className="mb-4 grid grid-cols-2 gap-3">
          <MacroProgress label="Calorias" value={day.totals.kcal} target={day.targets.kcal} unit="" accent={COLORS.kcal} />
          <MacroProgress label="Proteína" value={day.totals.protein_g} target={day.targets.protein_g} unit="g" accent={COLORS.protein} goal />
          <MacroProgress label="Carbo" value={day.totals.carb_g} target={day.targets.carb_g} unit="g" accent={COLORS.carb} />
          <MacroProgress label="Gordura" value={day.totals.fat_g} target={day.targets.fat_g} unit="g" accent={COLORS.fat} />
        </div>
      )}

      {/* Micronutrientes (score) */}
      {day && <SectionTitle title="Score Micro" hint="Feel Good" accent="#fbbf24" />}
      {day && <MicroScoreCard day={day} />}

      {/* Saldo */}
      {day && (
        <div className="mb-4 rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-3 text-[15px]">
          <div className="flex justify-between py-0.5">
            <span className="text-slate-300">Restante até o teto</span>
            <span className="font-bold text-white">{Math.round(day.remaining.kcal)} kcal</span>
          </div>
          <div className="text-[12px] text-slate-300">
            P {Math.round(day.remaining.protein_g)}g · C {Math.round(day.remaining.carb_g)}g · G{" "}
            {Math.round(day.remaining.fat_g)}g · meta {day.targets.kcal[0]}–{day.targets.kcal[1]} kcal
            ({TRAINING_LABELS[day.training_type]})
          </div>
        </div>
      )}

      {/* Sugestão da próxima refeição (IA) */}
      {day && <NextMealCard key={day.meals.length} day={day} />}

      {/* Flags automáticas (inclui alertas por horário/ritmo do dia) */}
      {day && (() => {
        const flags = [
          ...intradayAlerts(day, new Date().getHours()),
          ...day.flags,
        ];
        return flags.length > 0 ? (
        <div className="mb-4 space-y-2">
          {flags.map((f, i) => (
            <div
              key={i}
              className={`animate-in rounded-xl border px-3 py-2 text-[15px] ${
                f.type === "success"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  : "border-amber-500/40 bg-amber-500/10 text-amber-200"
              }`}
            >
              {f.message}
            </div>
          ))}
        </div>
        ) : null;
      })()}

      {/* Logger / botão */}
      {logging && day ? (
        <div className="mb-4">
          <MealLogger
            day={day}
            onSaved={(d) => {
              setDay(d);
              setLogging(false);
              flash("Refeição salva ✓");
            }}
            onClose={() => setLogging(false)}
          />
        </div>
      ) : (
        <button
          onClick={() => setLogging(true)}
          disabled={!day}
          className="mb-4 w-full rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-600 py-4 text-base font-bold text-white shadow-lg shadow-emerald-950/40 ring-1 ring-inset ring-white/10 active:from-emerald-600 active:to-emerald-700 disabled:opacity-50"
        >
          + Registrar refeição
        </button>
      )}

      {/* Suplementos do dia */}
      {day && <SupplementsCard day={day} onChange={setDay} />}

      {/* Refeições */}
      {day && day.meals.length > 0 && (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-200">
            Refeições <span className="font-medium normal-case tracking-normal text-slate-400">· {day.meals.length}</span>
          </span>
          <button
            type="button"
            onClick={() => setShowMeals((v) => !v)}
            aria-expanded={showMeals}
            className="rounded-full border border-[#55555f] bg-[#42424a] px-3 py-1.5 text-[13px] font-semibold text-slate-200"
          >
            {showMeals ? "▾ Ocultar" : "▸ Mostrar"}
          </button>
        </div>
      )}
      <div className="space-y-2" hidden={!showMeals && !!day && day.meals.length > 0}>
        {loading && !day && (
          <div className="rounded-xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-4 text-center text-[15px] text-slate-300">
            Carregando...
          </div>
        )}
        {day && day.meals.length === 0 && (
          <div className="rounded-xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-4 text-center text-[15px] text-slate-300">
            Nenhuma refeição registrada neste dia.
          </div>
        )}
        {day?.meals.map((m) =>
          reestimate?.id === m.id && day ? (
            <MealLogger
              key={m.id}
              day={day}
              editId={m.id}
              initialText={m.description}
              initialTime={m.time ?? ""}
              onSaved={(d) => {
                setDay(d);
                setReestimate(null);
                flash("Refeição atualizada ✓");
              }}
              onClose={() => setReestimate(null)}
            />
          ) : (
            <MealCard
              key={m.id}
              meal={m}
              onDelete={delMeal}
              onEdit={editMeal}
              onReestimate={(mm) => {
                setLogging(false);
                setReestimate(mm);
              }}
            />
          )
        )}
      </div>

      {/* Fechar o dia */}
      {day && day.meals.length >= 3 && (
        <button
          onClick={closeDay}
          className={`mt-4 w-full rounded-2xl py-3 text-[15px] font-bold ${
            day.closed
              ? "border border-[#55555f] bg-[#42424a] text-slate-200"
              : "bg-blue-600 text-white"
          }`}
        >
          {day.closed ? "Reabrir o dia" : "Fechar o dia"}
        </button>
      )}

      {toast && (
        <div className="animate-in fixed inset-x-0 bottom-24 z-50 mx-auto w-fit rounded-full bg-emerald-600 px-4 py-2 text-[15px] font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
      <BottomNav />
    </main>
  );
}
