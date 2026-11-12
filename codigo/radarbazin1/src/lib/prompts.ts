import type { ResolvedProfile } from "./profile";

export interface FoodRow {
  name: string;
  serving_g: number;
  kcal_per_serving: number;
  protein_g: number;
  carb_g: number;
  fat_g: number;
}

// System prompt da estimativa de macros, construído a partir do perfil atual
// (editável no app) e dos alimentos com macros fixos cadastrados no banco.
export function buildEstimateSystemPrompt(p: ResolvedProfile, foods: FoodRow[]): string {
  const lipids = [
    p.ldl != null ? `LDL ${p.ldl}` : null,
    p.hdl != null ? `HDL ${p.hdl}` : null,
    p.triglycerides != null ? `triglicérides ${p.triglycerides}` : null,
  ]
    .filter(Boolean)
    .join(" / ");

  const foodLines = foods.length
    ? foods
        .map(
          (f) =>
            `- ${f.name} (${f.serving_g}g): ${Math.round(f.kcal_per_serving)} kcal P:${f.protein_g} C:${f.carb_g} G:${f.fat_g}`
        )
        .join("\n")
    : "(nenhum cadastrado)";

  return `Você é assistente de nutrição especializado em estimar macros de refeições.

PERFIL DO USUÁRIO:
- ${p.name}, homem, ${p.weight_kg}kg, ${p.skeletal_muscle_kg}kg músculo esquelético, objetivo: ${p.goal}
${lipids ? `- Exames lipídicos: ${lipids}${p.exam_date ? ` (${p.exam_date})` : ""}\n` : ""}- Diretrizes: ${p.notes}
- Sempre sinalizar: gordura saturada concentrada (queijo, creme, manteiga, embutido, fritura)

${p.science_ref}

ALIMENTOS COM MACROS FIXOS — use estes valores exatos quando mencionados:
${foodLines}

INFERÊNCIAS SILENCIOSAS:
- Sem preparo mencionado = grelhado
- Empanado = +30% kcal sobre grelhado equivalente
- Sem bebida na foto = água (0 kcal)

MICRONUTRIENTES: estime também os principais (aproximado; use 0 se desprezível):
fibra (g), sódio (mg), potássio (mg), cálcio (mg), ferro (mg), magnésio (mg), zinco (mg), ômega-3 (g), vitamina C (mg), vitamina D (UI — unidades internacionais; 1 mcg = 40 UI), vitamina B12 (mcg).

RETORNE SOMENTE JSON, sem texto antes ou depois, sem markdown:
{
  "description": "descrição curta do identificado",
  "kcal": number,
  "protein_g": number,
  "carb_g": number,
  "fat_g": number,
  "confidence": number (1-10),
  "flags": ["saturada_alta" | "carbo_baixo" | "omega3" | "poco_proteina"],
  "uncertainties": ["descrição de itens não confirmados"],
  "questions": ["pergunta se algo importante precisar confirmação"],
  "micros": { "fiber_g": number, "sodium_mg": number, "potassium_mg": number, "calcium_mg": number, "iron_mg": number, "magnesium_mg": number, "zinc_mg": number, "omega3_g": number, "vit_c_mg": number, "vit_d_iu": number, "vit_b12_mcg": number }
}`;
}
