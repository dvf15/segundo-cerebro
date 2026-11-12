// Micronutrientes acompanhados, com metas diárias de referência (adulto).
// "goal" = mais é melhor; "limit" = teto (menos é melhor, ex.: sódio).
export interface MicroDef {
  key: string;
  label: string;
  unit: string;
  target: number;
  mode: "goal" | "limit";
}

export const MICROS: MicroDef[] = [
  { key: "fiber_g", label: "Fibra", unit: "g", target: 30, mode: "goal" },
  { key: "sodium_mg", label: "Sódio", unit: "mg", target: 2300, mode: "limit" },
  { key: "potassium_mg", label: "Potássio", unit: "mg", target: 3400, mode: "goal" },
  { key: "calcium_mg", label: "Cálcio", unit: "mg", target: 1000, mode: "goal" },
  { key: "iron_mg", label: "Ferro", unit: "mg", target: 8, mode: "goal" },
  { key: "magnesium_mg", label: "Magnésio", unit: "mg", target: 420, mode: "goal" },
  { key: "zinc_mg", label: "Zinco", unit: "mg", target: 11, mode: "goal" },
  { key: "omega3_g", label: "Ômega-3", unit: "g", target: 1.6, mode: "goal" },
  { key: "vit_c_mg", label: "Vit. C", unit: "mg", target: 90, mode: "goal" },
  { key: "vit_d_iu", label: "Vit. D", unit: "UI", target: 600, mode: "goal" },
  { key: "vit_b12_mcg", label: "Vit. B12", unit: "mcg", target: 2.4, mode: "goal" },
];

export const MICRO_KEYS = MICROS.map((m) => m.key);

export type MicroStatus = "good" | "mid" | "low" | "over";

export function microStatus(value: number, d: MicroDef, target: number): MicroStatus {
  if (d.mode === "limit") {
    if (value <= target) return "good";
    if (value <= target * 1.3) return "mid";
    return "over";
  }
  const pct = target > 0 ? value / target : 0;
  if (pct >= 0.8) return "good";
  if (pct >= 0.5) return "mid";
  return "low";
}

function contribution(value: number, d: MicroDef, target: number): number {
  if (target <= 0) return 100;
  if (d.mode === "limit") {
    return value <= target ? 100 : Math.max(0, 100 - ((value - target) / target) * 100);
  }
  return Math.min(100, (value / target) * 100);
}

// Score do dia com ênfase no ELO MAIS FRACO: um nutriente crítico em déficit
// não é compensado por outro em excesso. Mistura mínimo e média (0,5/0,5), então
// um componente muito baixo (ex.: fibra a 18% da meta) derruba o score.
export function microScore(totals: Record<string, number>, targets: Record<string, number>): number {
  const contribs = MICROS.map((d) => contribution(totals[d.key] || 0, d, targets[d.key] ?? d.target));
  const mean = contribs.reduce((a, b) => a + b, 0) / contribs.length;
  const min = Math.min(...contribs);
  return Math.round(0.5 * min + 0.5 * mean);
}

// Metas efetivas: override do perfil quando houver, senão o padrão.
export function effectiveMicroTargets(override: Record<string, number> | null): Record<string, number> {
  const out: Record<string, number> = {};
  for (const d of MICROS) {
    const v = override?.[d.key];
    out[d.key] = typeof v === "number" && v > 0 ? v : d.target;
  }
  return out;
}

function roundMicro(key: string, n: number): number {
  const d = MICROS.find((m) => m.key === key);
  return d && d.unit === "g" ? Math.round(n * 10) / 10 : Math.round(n);
}

// Escala os micros de um item por um fator (ex.: meia dose = 0.5).
export function scaleMicros(micros: Record<string, number>, factor: number): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(micros || {})) out[k] = (Number(v) || 0) * factor;
  return out;
}

export function sumMicros(items: { micros: Record<string, number> }[]): Record<string, number> {
  const t: Record<string, number> = {};
  for (const d of MICROS) t[d.key] = 0;
  for (const m of items) for (const d of MICROS) t[d.key] += m.micros?.[d.key] || 0;
  for (const d of MICROS) t[d.key] = roundMicro(d.key, t[d.key]);
  return t;
}

// Normaliza um objeto de micros recebido (IA/JSON) para os keys conhecidos.
export function normalizeMicros(raw: unknown): Record<string, number> {
  const src = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out: Record<string, number> = {};
  for (const d of MICROS) out[d.key] = roundMicro(d.key, Number(src[d.key]) || 0);
  return out;
}

export interface Supplement {
  name: string;
  dose: number; // dose padrão diária, em nº de cápsulas/porções
  micros: Record<string, number>; // micros correspondentes à dose padrão
}

export function normalizeSupplements(raw: unknown): Supplement[] {
  if (!Array.isArray(raw)) return [];
  const out: Supplement[] = [];
  for (const s of raw) {
    if (!s || typeof s !== "object") continue;
    const o = s as Record<string, unknown>;
    const name = typeof o.name === "string" ? o.name.trim() : "";
    if (!name) continue;
    const dose = Number(o.dose);
    out.push({
      name,
      dose: isFinite(dose) && dose > 0 ? dose : 1,
      micros: normalizeMicros(o.micros),
    });
  }
  return out;
}
