// Pressão arterial — classificação residencial (MRPA) e utilidades.
// Referência residencial anormal: média ≥ 130/80 (DBH/SBC).

export interface BpReadingDTO {
  id: string;
  date: string; // "2026-07-19"
  time: string; // "23:12"
  sys: number;
  dia: number;
  note: string | null;
}

export const BP_REF_SYS = 130; // limiar residencial sistólica
export const BP_REF_DIA = 80; // limiar residencial diastólica

export type BpLevel = "normal" | "atencao" | "alta" | "muito_alta";

export interface BpClass {
  level: BpLevel;
  label: string;
  color: string;
}

// Classificação por medição (residencial).
export function classifyBp(sys: number, dia: number): BpClass {
  if (sys >= 180 || dia >= 110)
    return { level: "muito_alta", label: "Muito alta", color: "#ef4444" };
  if (sys >= 130 || dia >= 85) return { level: "alta", label: "Alta", color: "#fb7185" };
  if (sys >= 120 || dia >= 80)
    return { level: "atencao", label: "Atenção", color: "#fbbf24" };
  return { level: "normal", label: "Normal", color: "#34d399" };
}

// Histórico inicial (seed) — 14 medições de 2026.
export const BP_SEED: { date: string; time: string; sys: number; dia: number }[] = [
  { date: "2026-07-19", time: "23:12", sys: 114, dia: 71 },
  { date: "2026-07-20", time: "23:11", sys: 112, dia: 70 },
  { date: "2026-07-23", time: "23:26", sys: 114, dia: 77 },
  { date: "2026-07-24", time: "22:32", sys: 115, dia: 78 },
  { date: "2026-07-25", time: "23:52", sys: 115, dia: 73 },
  { date: "2026-07-26", time: "22:55", sys: 118, dia: 78 },
  { date: "2026-07-27", time: "22:28", sys: 113, dia: 63 },
  { date: "2026-07-30", time: "23:48", sys: 121, dia: 82 },
  { date: "2026-07-31", time: "23:47", sys: 123, dia: 80 },
  { date: "2026-08-01", time: "23:08", sys: 109, dia: 70 },
  { date: "2026-08-05", time: "21:43", sys: 113, dia: 71 },
  { date: "2026-08-06", time: "21:58", sys: 114, dia: 71 },
  { date: "2026-08-07", time: "22:14", sys: 119, dia: 81 },
  { date: "2026-08-08", time: "22:15", sys: 109, dia: 65 },
];

export function isNightReading(time: string): boolean {
  const h = parseInt(String(time).slice(0, 2), 10);
  return isFinite(h) && h >= 18;
}
