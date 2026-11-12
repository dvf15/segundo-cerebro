"use client";

// Atalhos + barra de tempo em DIAS (mesmo formato da barra do gráfico de peso).
// value = dias olhando para trás a partir de hoje; 0 = todo o histórico.

export function daysLabel(n: number) {
  if (n < 60) return `${n} ${n === 1 ? "dia" : "dias"}`;
  if (n < 730) return `${Math.round(n / 30)} meses`;
  const a = Math.floor(n / 365), m = Math.round((n % 365) / 30);
  return `${a} ${a === 1 ? "ano" : "anos"}${m ? ` e ${m} ${m === 1 ? "mês" : "meses"}` : ""}`;
}

export function daysCutoff(n: number) {
  if (!n) return "";
  const d = new Date();
  d.setDate(d.getDate() - (n - 1));
  return d.toLocaleDateString("en-CA");
}

// Dias entre a data (YYYY-MM-DD) e hoje, contando os dois.
export function daysSince(dateKey: string | undefined) {
  if (!dateKey) return 30;
  const a = new Date(dateKey + "T12:00:00").getTime();
  return Math.max(1, Math.round((Date.now() - a) / 86400000) + 1);
}

function fmtDate(k: string) {
  return new Date(k + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export const DAY_PRESETS = [
  { key: 7, label: "7d" },
  { key: 14, label: "14d" },
  { key: 30, label: "30d" },
  { key: 90, label: "90d" },
  { key: 0, label: "Tudo" },
];

export function PeriodButtons({
  value,
  onChange,
  presets = DAY_PRESETS,
}: {
  value: number;
  onChange: (v: number) => void;
  presets?: { key: number; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {presets.map((p) => (
        <button
          key={p.key}
          onClick={() => onChange(p.key)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            value === p.key ? "bg-blue-600 text-white" : "border border-[#55555f] bg-[#42424a] text-slate-300"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

export default function PeriodSlider({
  value,
  maxDays,
  count,
  countLabel = "registros",
  onChange,
}: {
  value: number;
  maxDays: number;
  count: number;
  countLabel?: string;
  onChange: (v: number) => void;
}) {
  const max = Math.max(2, maxDays);
  const days = value === 0 ? max : Math.min(value, max);
  const cutoff = value === 0 ? "" : daysCutoff(days);
  return (
    <div className="rounded-xl border border-[#4c4c57] bg-[#2e2e36] px-3 py-2.5">
      <div className="flex items-baseline justify-between gap-2 text-[13px]">
        <span className="font-semibold text-white">
          {value === 0 ? "Todo o histórico" : `Últimos ${daysLabel(days)}`}
        </span>
        <span className="text-slate-400 tabular-nums">
          {count} {countLabel}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={max}
        step={1}
        value={days}
        onChange={(e) => {
          const v = Number(e.target.value);
          onChange(v >= max ? 0 : v);
        }}
        aria-label="Período em dias"
        className="mt-2 w-full accent-emerald-500"
      />
      <div className="flex justify-between text-[11px] text-slate-400">
        <span>1 dia</span>
        <span>{cutoff ? `desde ${fmtDate(cutoff)}` : "todo o histórico"}</span>
        <span>{daysLabel(max)}</span>
      </div>
    </div>
  );
}
