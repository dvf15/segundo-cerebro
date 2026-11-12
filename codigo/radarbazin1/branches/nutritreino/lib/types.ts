export type TrainingType =
  | "rest"
  | "light"
  | "strength"
  | "legs"
  | "pilates"
  | "hiit"
  | "strength_hiit"
  | "bjj"
  | "double";

export interface Macros {
  kcal: number;
  protein_g: number;
  carb_g: number;
  fat_g: number;
}

export interface Targets {
  kcal: [number, number];
  protein_g: [number, number];
  carb_g: [number, number];
  fat_g: [number, number];
}

export interface Estimate {
  description: string;
  kcal: number;
  protein_g: number;
  carb_g: number;
  fat_g: number;
  confidence: number;
  flags: string[];
  uncertainties: string[];
  questions: string[];
  micros: Record<string, number>;
}

export interface MealDTO {
  id: string;
  code: string;
  description: string;
  photo_url: string | null;
  kcal: number;
  protein_g: number;
  carb_g: number;
  fat_g: number;
  confidence: number;
  flags: string[];
  micros: Record<string, number>;
  time: string | null; // horário da refeição "HH:MM"
}

export interface DayDTO {
  date: string;
  training_type: TrainingType;
  training_notes: string | null;
  closed: boolean;
  meals: MealDTO[];
  totals: Macros;
  targets: Targets;
  remaining: Macros;
  flags: { message: string; type: "warning" | "success" }[];
  micros_totals: Record<string, number>;
  micro_targets: Record<string, number>;
  micro_score: number;
  supplements: { name: string; dose: number; micros: Record<string, number> }[];
  supps_taken: string[];
  // Cápsulas tomadas no dia, por nome do suplemento (0 = não tomou).
  supps_doses: Record<string, number>;
  // Identidade/treinos por instância (perfil).
  owner_name: string;
  training_options: { value: TrainingType; label: string }[];
  // Sauna do dia (minutos) e gasto calórico extra somado ao teto.
  sauna_min: number;
  sauna_kcal: number;
  // Peso corporal do dia (kg) e alerta de meta/fase desatualizada.
  weight_kg: number | null;
  meta_alert: string | null;
  // Horário (ISO) da última refeição registrada (≤ agora), p/ o jejum corrente.
  last_meal_at: string | null;
}
