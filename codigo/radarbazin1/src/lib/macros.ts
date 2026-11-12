import type { Macros, Targets, TrainingType } from "./types";

export function sumMeals(
  meals: { kcal: number; protein_g: number; carb_g: number; fat_g: number }[]
): Macros {
  return meals.reduce(
    (a, m) => ({
      kcal: a.kcal + m.kcal,
      protein_g: a.protein_g + m.protein_g,
      carb_g: a.carb_g + m.carb_g,
      fat_g: a.fat_g + m.fat_g,
    }),
    { kcal: 0, protein_g: 0, carb_g: 0, fat_g: 0 }
  );
}

// Saldo restante: sempre contra o TETO da faixa.
export function remaining(totals: Macros, t: Targets): Macros {
  return {
    kcal: t.kcal[1] - totals.kcal,
    protein_g: t.protein_g[1] - totals.protein_g,
    carb_g: t.carb_g[1] - totals.carb_g,
    fat_g: t.fat_g[1] - totals.fat_g,
  };
}

export type MacroStatus = "over" | "good" | "under";

export function macroStatus(value: number, target: [number, number]): MacroStatus {
  const [min, max] = target;
  if (value > max * 1.1) return "over"; // vermelho
  if (value >= min * 0.8) return "good"; // verde
  return "under"; // amarelo
}

export function nextMealCode(meals: { code: string }[]): string {
  if (meals.length === 0) return "R1";
  const nums = meals.map((m) => parseInt(m.code.replace(/[^0-9]/g, ""), 10) || 0);
  return `R${Math.max(...nums) + 1}`;
}

export interface DayFlag {
  message: string;
  type: "warning" | "success";
}

// Flags que NÃO dependem do horário (baseadas nas refeições). As leituras de
// "dia" (déficit/carbo p/ treino, ritmo calórico) ficam em paceFlags, que só
// dispara depois do almoço para não contradizer no começo do dia.
export function dayFlags(totals: Macros, t: Targets, mealFlags: string[]): DayFlag[] {
  const out: DayFlag[] = [];
  if (mealFlags.includes("saturada_alta")) {
    out.push({
      message: "⚠️ Gordura saturada concentrada hoje — atenção ao LDL",
      type: "warning",
    });
  }
  if (totals.protein_g >= t.protein_g[0]) {
    out.push({ message: "✅ Proteína no alvo", type: "success" });
  }
  return out;
}

// Alertas que consideram o horário do dia e o que já foi consumido até agora.
// Janela alimentar de referência ~08h–22h. As leituras de "dia"
// (ritmo/déficit/carbo) só aparecem depois do almoço (>=14h) para serem fáceis
// de entender e nunca contraditórias entre si.
export function paceFlags(
  totals: Macros,
  t: Targets,
  training: TrainingType,
  hour: number,
  mealCount: number
): DayFlag[] {
  const out: DayFlag[] = [];
  const START = 8;
  const END = 22;
  const frac = Math.max(0, Math.min(1, (hour - START) / (END - START)));
  const rnd = (n: number) => Math.round(n);
  const heavy = ["bjj", "double", "legs", "hiit", "strength_hiit"].includes(training);
  const proMin = t.protein_g[0];
  const proMid = (proMin + t.protein_g[1]) / 2;

  if (mealCount === 0) {
    if (hour >= 13) {
      out.push({
        message: "⚠️ Nenhuma refeição registrada e o dia já avançou — registre o que comeu",
        type: "warning",
      });
    }
    return out;
  }

  // Proteína atrasada para o horário (da tarde em diante).
  if (frac >= 0.5 && totals.protein_g < frac * proMid * 0.7) {
    const faltam = rnd(proMin - totals.protein_g);
    out.push({
      message: `⚠️ Proteína abaixo do ritmo para o horário${faltam > 0 ? ` — faltam ~${faltam}g até o mínimo` : ""}`,
      type: "warning",
    });
  }
  if (hour >= 20 && totals.protein_g < proMin) {
    out.push({
      message: "⚠️ Já é noite e a proteína está abaixo do mínimo — priorize proteína no jantar",
      type: "warning",
    });
  }

  // Leitura do DIA (projeção) — só depois do almoço, e mutuamente exclusiva.
  if (hour >= 14) {
    const projected = frac > 0.05 ? totals.kcal / frac : totals.kcal;
    if (totals.kcal > t.kcal[1]) {
      out.push({ message: "⚠️ Você já passou do teto de calorias do dia", type: "warning" });
    } else if (projected > t.kcal[1] * 1.12) {
      out.push({
        message: "⚠️ Ritmo calórico alto para o horário — segure nas próximas refeições",
        type: "warning",
      });
    } else if (projected < t.kcal[0] * 0.85) {
      out.push({
        message: heavy
          ? "⚠️ Ritmo de déficit agressivo para um dia de treino pesado"
          : "⚠️ Ritmo calórico baixo para fechar a meta do dia",
        type: "warning",
      });
    }
    if (heavy) {
      const projCarb = frac > 0.05 ? totals.carb_g / frac : totals.carb_g;
      if (projCarb < t.carb_g[0] * 0.75) {
        out.push({ message: "⚠️ Carbo abaixo do alvo para esse tipo de treino", type: "warning" });
      }
    }
  }

  if (hour >= 20 && totals.kcal >= t.kcal[0] && totals.protein_g >= proMin) {
    out.push({ message: "✅ Metas do dia praticamente fechadas — bom trabalho", type: "success" });
  }
  return out;
}
