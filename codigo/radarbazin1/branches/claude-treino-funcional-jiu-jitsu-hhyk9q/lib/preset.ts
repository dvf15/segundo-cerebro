import type { TrainingType } from "./types";

// Identidade da instância. "owner" = app do dono (Daniel). Outras instâncias
// (ex.: "renata") rodam o mesmo código, com banco próprio e PROFILE_PRESET set.
export const PROFILE_PRESET = process.env.PROFILE_PRESET || "owner";
export const IS_OWNER = PROFILE_PRESET === "owner";

// Nome padrão do perfil por instância (a pessoa pode editar no app).
const NAMES: Record<string, string> = { owner: "Daniel", renata: "Renata" };
export const DEFAULT_NAME = NAMES[PROFILE_PRESET] ?? "";

// Tipos de treino visíveis por instância (o seletor só mostra estes).
const VISIBLE: Record<string, TrainingType[]> = {
  owner: ["rest", "light", "strength", "legs", "hiit", "strength_hiit", "bjj", "double"],
  renata: ["rest", "strength", "pilates", "light"],
};
export function visibleTrainingTypes(): TrainingType[] {
  return VISIBLE[PROFILE_PRESET] ?? VISIBLE.owner;
}

// Agenda semanal: treino padrão por dia da semana (0=domingo). Aplicado só ao
// criar um novo dia; a pessoa pode trocar e a escolha é mantida.
const SCHEDULES: Record<string, Record<number, TrainingType>> = {
  // Daniel: seg/sex musculação, qua BJJ no-gi (+ esteira leve), qui HIIT ou
  // caminhada, sáb duplo (musculação + BJJ de kimono), dom pernas.
  owner: { 1: "strength", 3: "bjj", 4: "hiit", 5: "strength", 6: "double", 0: "legs" },
  // Renata: ter/qui musculação, qua/sex pilates.
  renata: { 2: "strength", 4: "strength", 3: "pilates", 5: "pilates" },
};
export function defaultTrainingFor(date: string): TrainingType {
  const sched = SCHEDULES[PROFILE_PRESET];
  if (!sched) return "rest";
  const wd = new Date(date + "T12:00:00").getDay();
  return sched[wd] ?? "rest";
}
