import type { TrainingType, Targets } from "./types";

// Faixas calibradas por intensidade (kcal sobem conforme o gasto do treino).
export const TARGETS: Record<TrainingType, Targets> = {
  rest: { kcal: [2900, 3000], protein_g: [220, 240], carb_g: [180, 230], fat_g: [80, 100] },
  light: { kcal: [3000, 3150], protein_g: [220, 240], carb_g: [220, 300], fat_g: [80, 100] },
  strength: { kcal: [3100, 3300], protein_g: [220, 240], carb_g: [250, 320], fat_g: [80, 100] },
  legs: { kcal: [3100, 3300], protein_g: [220, 240], carb_g: [300, 350], fat_g: [80, 100] },
  pilates: { kcal: [2950, 3100], protein_g: [220, 240], carb_g: [200, 260], fat_g: [80, 100] },
  hiit: { kcal: [3200, 3350], protein_g: [220, 240], carb_g: [300, 380], fat_g: [80, 100] },
  strength_hiit: { kcal: [3350, 3550], protein_g: [230, 250], carb_g: [350, 430], fat_g: [85, 105] },
  bjj: { kcal: [3300, 3400], protein_g: [220, 240], carb_g: [320, 400], fat_g: [85, 105] },
  double: { kcal: [3300, 3500], protein_g: [230, 250], carb_g: [350, 420], fat_g: [85, 105] },
};

// Faixas genéricas para uma instância "em branco" (ex.: 2ª pessoa) — adulto
// moderado. A pessoa ajusta no Perfil (editor de metas por treino).
export const GENERIC_TARGETS: Record<TrainingType, Targets> = {
  rest: { kcal: [1500, 1700], protein_g: [90, 110], carb_g: [120, 160], fat_g: [45, 60] },
  light: { kcal: [1600, 1800], protein_g: [90, 110], carb_g: [140, 180], fat_g: [45, 60] },
  strength: { kcal: [1700, 1900], protein_g: [100, 120], carb_g: [150, 200], fat_g: [50, 65] },
  legs: { kcal: [1700, 1900], protein_g: [100, 120], carb_g: [170, 220], fat_g: [50, 65] },
  pilates: { kcal: [1550, 1750], protein_g: [90, 110], carb_g: [130, 170], fat_g: [45, 60] },
  hiit: { kcal: [1750, 1950], protein_g: [100, 120], carb_g: [180, 230], fat_g: [50, 65] },
  strength_hiit: { kcal: [1850, 2050], protein_g: [105, 125], carb_g: [200, 270], fat_g: [55, 70] },
  bjj: { kcal: [1800, 2000], protein_g: [100, 120], carb_g: [190, 240], fat_g: [50, 70] },
  double: { kcal: [1850, 2050], protein_g: [105, 125], carb_g: [200, 260], fat_g: [55, 70] },
};

// Faixas-base usadas quando não há override no perfil. Instâncias que não são
// do dono (PROFILE_PRESET != "owner") usam as genéricas (estimativa feminina).
export function baseTargets(): Record<TrainingType, Targets> {
  return (process.env.PROFILE_PRESET || "owner") !== "owner" ? GENERIC_TARGETS : TARGETS;
}

export const TRAINING_LABELS: Record<TrainingType, string> = {
  rest: "Descanso",
  light: "Treino nível 2",
  strength: "Musculação",
  legs: "Pernas",
  pilates: "Pilates",
  hiit: "HIIT",
  strength_hiit: "Musculação + HIIT",
  bjj: "BJJ",
  double: "Duplo (BJJ + musc.)",
};

export const TRAINING_TYPES: TrainingType[] = [
  "rest",
  "light",
  "strength",
  "legs",
  "pilates",
  "hiit",
  "strength_hiit",
  "bjj",
  "double",
];

export function isTrainingType(v: string): v is TrainingType {
  return (TRAINING_TYPES as string[]).includes(v);
}

// Sauna: opções de duração e gasto calórico extra (estimativa conservadora do
// estresse térmico, ~3,3 kcal/min).
export const SAUNA_OPTIONS = [0, 15, 30];
const SAUNA_KCAL: Record<number, number> = { 15: 50, 30: 100 };
export function saunaKcal(min: number): number {
  if (!min || min <= 0) return 0;
  return SAUNA_KCAL[min] ?? Math.round(min * 3.3);
}
