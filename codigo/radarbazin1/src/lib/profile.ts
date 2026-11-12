import { prisma } from "./prisma";
import { baseTargets } from "./targets";
import { IS_OWNER, DEFAULT_NAME } from "./preset";
import { normalizeSupplements, type Supplement } from "./micros";
import type { Targets, TrainingType } from "./types";

// Instâncias que não são do dono começam neutras (sem dados do dono).
const BLANK = !IS_OWNER;

export interface ResolvedProfile {
  name: string;
  weight_kg: number;
  skeletal_muscle_kg: number;
  body_fat_pct: number;
  tmb_kcal: number;
  goal: string;
  ldl: number | null;
  hdl: number | null;
  triglycerides: number | null;
  exam_date: string | null;
  notes: string;
  science_ref: string;
  phase: string | null;
  phase_set_at: string | null;
  fast_reset_at: string | null;
  targets: Record<string, Targets> | null;
  micro_targets: Record<string, number> | null;
  supplements: Supplement[];
}

// Racional de instruções padrão (referencial científico) — editável no Perfil.
export const DEFAULT_SCIENCE_REFERENCE = `REFERENCIAL CIENTÍFICO (ordem de prioridade):
1. Peter Attia (Outlive, Medicine 3.0): Zone 2, VO2max, força + estabilidade, proteína, sono, marcadores de longevidade.
2. Rhonda Patrick (FoundMyFitness): micronutrientes, fitoquímicos (sulforafano, quercetina, EGCG), saúde mitocondrial, inflamação, protocolos de calor/frio com evidência peer-reviewed.
3. Andy Galpin / Andrew Huberman: periodização, recuperação, protocolos neurais, sono e luz.
4. Stuart McGill: saúde da coluna, prevenção de lesão para grappling (McGill Big 3).
5. Literatura peer-reviewed sempre que disponível.
⚠️ NÃO usar biohacks sem evidência nem claims de marketing disfarçados de ciência. Se o usuário pedir algo nessa linha, avisar explicitamente.`;

type BaseProfile = Omit<ResolvedProfile, "targets" | "micro_targets" | "supplements">;

// Perfil do dono (instância principal).
const OWNER_PROFILE: BaseProfile = {
  name: "Daniel",
  weight_kg: 111.2,
  skeletal_muscle_kg: 53.1,
  body_fat_pct: 17.7,
  tmb_kcal: 2346,
  goal: "cutting lento (meta 102–104 kg até jun/2027)",
  ldl: 137,
  hdl: 39,
  triglycerides: 141,
  exam_date: null,
  notes:
    "Preservar massa magra; reduzir gordura saturada (LDL alto); priorizar proteína magra e fontes de ômega-3.",
  science_ref: DEFAULT_SCIENCE_REFERENCE,
  phase: "corte",
  phase_set_at: "2026-06-12",
  fast_reset_at: null,
};

// Perfil em branco (2ª pessoa) — preenchido por ela no app.
const BLANK_PROFILE: BaseProfile = {
  name: DEFAULT_NAME,
  weight_kg: 0,
  skeletal_muscle_kg: 0,
  body_fat_pct: 0,
  tmb_kcal: 0,
  goal: "",
  ldl: null,
  hdl: null,
  triglycerides: null,
  exam_date: null,
  notes: "Defina aqui suas diretrizes para a IA (objetivo, restrições, preferências).",
  science_ref: DEFAULT_SCIENCE_REFERENCE,
  phase: null,
  phase_set_at: null,
  fast_reset_at: null,
};

// Valores iniciais (usados enquanto o usuário não editar o perfil no app).
export const DEFAULT_PROFILE: BaseProfile = BLANK ? BLANK_PROFILE : OWNER_PROFILE;

// Suplementos diários padrão do dono. Na instância em branco começa vazio.
const OWNER_SUPPLEMENTS: Supplement[] = [
  { name: "Vitamina D3 2000 UI (Essential)", dose: 2, micros: { vit_d_iu: 4000 } },
  { name: "ETNA (B12)", dose: 1, micros: { vit_b12_mcg: 970 } },
  { name: "Vit C Immunity (Essential)", dose: 1, micros: { vit_c_mg: 167, zinc_mg: 3.3 } },
  { name: "Colagentek II (Vitafor)", dose: 2, micros: { calcium_mg: 100 } },
  { name: "CoQ10 + Ômega-3 (Essential)", dose: 2, micros: { omega3_g: 0.46 } },
  { name: "Omegafor Plus (Vitafor)", dose: 3, micros: { omega3_g: 1.65 } },
  { name: "Magnésio Dimalato", dose: 2, micros: { magnesium_mg: 260 } },
  { name: "Leucogen 80mg", dose: 2, micros: {} },
];
export const DEFAULT_SUPPLEMENTS: Supplement[] = BLANK ? [] : OWNER_SUPPLEMENTS;

export async function getProfile(): Promise<ResolvedProfile> {
  let row: Awaited<ReturnType<typeof prisma.profile.findUnique>> = null;
  try {
    row = await prisma.profile.findUnique({ where: { id: "default" } });
  } catch {
    // tabela ainda não migrada — usa defaults
  }

  const pick = <T>(v: T | null | undefined, d: T): T =>
    v === null || v === undefined ? d : v;

  let targets: Record<string, Targets> | null = null;
  if (row?.targets_json) {
    try {
      targets = JSON.parse(row.targets_json);
    } catch {
      targets = null;
    }
  }

  let micro_targets: Record<string, number> | null = null;
  if (row?.micro_targets_json) {
    try {
      micro_targets = JSON.parse(row.micro_targets_json);
    } catch {
      micro_targets = null;
    }
  }

  let supplements: Supplement[] = DEFAULT_SUPPLEMENTS;
  if (row?.supplements_json) {
    try {
      supplements = normalizeSupplements(JSON.parse(row.supplements_json));
    } catch {
      supplements = DEFAULT_SUPPLEMENTS;
    }
  }

  return {
    name: pick(row?.name, DEFAULT_PROFILE.name),
    weight_kg: pick(row?.weight_kg, DEFAULT_PROFILE.weight_kg),
    skeletal_muscle_kg: pick(row?.skeletal_muscle_kg, DEFAULT_PROFILE.skeletal_muscle_kg),
    body_fat_pct: pick(row?.body_fat_pct, DEFAULT_PROFILE.body_fat_pct),
    tmb_kcal: pick(row?.tmb_kcal, DEFAULT_PROFILE.tmb_kcal),
    goal: pick(row?.goal, DEFAULT_PROFILE.goal),
    ldl: pick(row?.ldl, DEFAULT_PROFILE.ldl),
    hdl: pick(row?.hdl, DEFAULT_PROFILE.hdl),
    triglycerides: pick(row?.triglycerides, DEFAULT_PROFILE.triglycerides),
    exam_date: pick(row?.exam_date, DEFAULT_PROFILE.exam_date),
    notes: pick(row?.notes, DEFAULT_PROFILE.notes),
    science_ref: pick(row?.science_ref, DEFAULT_SCIENCE_REFERENCE),
    phase: pick(row?.phase, DEFAULT_PROFILE.phase),
    phase_set_at: pick(row?.phase_set_at, DEFAULT_PROFILE.phase_set_at),
    fast_reset_at: pick(row?.fast_reset_at, null),
    targets,
    micro_targets,
    supplements,
  };
}

// Metas efetivas: usa override do perfil se houver e for válido, senão o padrão.
export function effectiveTargets(
  override: Record<string, Targets> | null,
  training: TrainingType
): Targets {
  const t = override?.[training];
  if (t && t.kcal && t.protein_g && t.carb_g && t.fat_g) return t;
  return baseTargets()[training];
}
