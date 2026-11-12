"use client";

import { macroStatus } from "@/lib/macros";

// Cor do anel pelo status (dentro do alvo, abaixo, acima).
const RING = {
  good: "#34d399",
  under: "#fbbf24",
  over: "#fb7185",
} as const;

const R = 20;
const C = 2 * Math.PI * R;

export default function MacroProgress({
  label,
  value,
  target,
  unit,
  accent,
  goal = false,
}: {
  label: string;
  value: number;
  target: [number, number];
  unit: string;
  accent: string;
  // Macro que é meta a atingir (proteína): o saldo mostra quanto falta (vermelho)
  // ou quanto superou (verde), em vez de quanto ainda cabe até o teto.
  goal?: boolean;
}) {
  const status = macroStatus(value, target);
  const [min, max] = target;
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  const pctLabel = max > 0 ? Math.round((value / max) * 100) : 0;
  const offset = C * (1 - pct / 100);
  const saldo = Math.round(max - value);

  return (
    // Altura fixa: os quatro cards ficam do mesmo tamanho, mesmo quando o alvo é mais longo.
    <div className="h-[118px] rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] px-3.5 py-2.5">
      <div className="flex h-full items-center justify-between gap-2">
        {/* Texto: título, realizado em destaque e meta logo abaixo */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div
            className="truncate text-[14px] font-extrabold uppercase leading-none tracking-[0.06em]"
            style={{ color: accent }}
          >
            {label}
          </div>
          <div className="mt-2 flex items-baseline gap-1 whitespace-nowrap">
            <span className="text-[21px] font-extrabold leading-none text-white tabular-nums">
              {Math.round(value)}
            </span>
            <span className="text-[11px] font-semibold leading-none text-slate-300">{unit || "kcal"}</span>
          </div>
          <div className="mt-1.5 whitespace-nowrap text-[11px] font-medium leading-none text-slate-300 tabular-nums">
            meta <span className="font-bold text-slate-100">{min}–{max}</span>
            {unit}
          </div>
          {/* Saldo. Teto (kcal, carbo, gordura): verde = ainda cabe; vermelho = estourou.
              Meta a atingir (proteína): vermelho = quanto falta; verde = quanto superou. */}
          {goal ? (
            <div
              className={`mt-1.5 whitespace-nowrap text-[11.5px] font-bold leading-none tabular-nums ${
                saldo > 0 ? "text-rose-400" : "text-emerald-400"
              }`}
            >
              {saldo > 0 ? `−${saldo} ${unit} faltam` : `+${Math.abs(saldo)} ${unit} superou`}
            </div>
          ) : (
            <div
              className={`mt-1.5 whitespace-nowrap text-[11.5px] font-bold leading-none tabular-nums ${
                saldo >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {saldo >= 0 ? `+${saldo}` : `−${Math.abs(saldo)}`} {unit || "kcal"} {saldo >= 0 ? "livres" : "acima"}
            </div>
          )}
        </div>

        {/* Anel de progresso — cresce nas telas maiores, sem espremer os números nas menores */}
        <div
          className="relative h-[60px] w-[60px] shrink-0"
          aria-label={`${pctLabel}% da meta`}
        >
          <svg viewBox="0 0 48 48" className="h-full w-full -rotate-90">
            <circle cx="24" cy="24" r={R} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="5" />
            <circle
              cx="24"
              cy="24"
              r={R}
              fill="none"
              stroke={RING[status]}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={offset}
              className="transition-[stroke-dashoffset] duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[14px] font-extrabold text-white">
            {pctLabel}%
          </div>
        </div>
      </div>
    </div>
  );
}
