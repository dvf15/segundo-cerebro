import type { DayDTO } from "./types";
import type { DayFlag } from "./macros";

// Alertas intradiários orientados aos modos de falha medidos (proteína em dia
// rest, fibra, sódio-teto). Janela alimentar ~08h–22h; os horários são
// heurísticos (o app só tem totais diários) — calibrar com log por refeição.
//
// SEGURANÇA: nenhuma sugestão de potássio/sal light — apenas alimento.

const r = (n: number) => Math.round(n || 0);

// Remanescente de proteína expresso em porções (mais acionável que gramas).
function proteinPortions(g: number): string {
  const shakes = Math.max(1, Math.round(g / 25));
  const frango = Math.round(g / 0.31 / 10) * 10; // g de peito de frango (~31 g prot/100 g)
  return `≈ ${shakes} shake${shakes > 1 ? "s" : ""} de whey ou ${frango} g de frango`;
}

export function intradayAlerts(day: DayDTO, hour: number): DayFlag[] {
  const out: DayFlag[] = [];
  const t = day.targets;
  const meals = day.meals.length;
  const frac = Math.max(0, Math.min(1, (hour - 8) / (22 - 8)));
  const isRest = day.training_type === "rest";

  const proteinGoal = t.protein_g[1];
  const protein = day.totals.protein_g;
  const remaining = Math.max(0, r(proteinGoal - protein));
  const fiber = day.micros_totals["fiber_g"] || 0;
  const sodium = day.micros_totals["sodium_mg"] || 0;

  if (meals === 0) {
    if (hour >= 13) {
      out.push({
        type: "warning",
        message: "⚠️ Nenhuma refeição registrada e o dia já avançou — registre o que comeu.",
      });
    }
    return out;
  }

  // --- Prioridade 1: proteína ---
  if (isRest && hour >= 9 && hour < 15 && protein < frac * proteinGoal * 0.85) {
    // Dia de descanso: nudge cedo (o de pior déficit de proteína).
    out.push({
      type: "warning",
      message: `🥩 Dia de descanso costuma render menos proteína. Faltam ${remaining} g — ${proteinPortions(remaining)}. Programe um whey agora e outro à noite.`,
    });
  } else if (frac >= 0.45 && protein < frac * proteinGoal * 0.75) {
    // Trajetória (tarde): proteína não se recupera tarde.
    out.push(
      hour >= 18
        ? {
            type: "warning",
            message: `🥩 Proteína atrasada: ${r(protein)}/${proteinGoal} g às ${hour}h. Faltam ${remaining} g — ${proteinPortions(remaining)}. Proteína não se recupera tarde; capriche no jantar.`,
          }
        : {
            type: "warning",
            message: `🥩 Ritmo de proteína baixo para o horário (${r(protein)}/${proteinGoal} g). Faltam ${remaining} g — ${proteinPortions(remaining)}. Dá para fechar, mas não com jantar leve.`,
          }
    );
  }

  // --- Prioridade 2: sódio (teto, não meta) ---
  if (sodium > 2300) {
    out.push({
      type: "warning",
      message: `🧂 Sódio já em ${r(sodium)} mg (acima do teto de 2300). Prefira comida sem sal adicionado no resto do dia.`,
    });
  } else if (hour >= 16 && sodium >= 1800) {
    out.push({
      type: "warning",
      message: `🧂 Sódio em ${r(sodium)} mg. Se o jantar for fora/industrializado, o dia passa de 4000 — segure no jantar.`,
    });
  }

  // --- Prioridade 3: fibra (só alimento) ---
  if (hour >= 16 && fiber < 12) {
    out.push({
      type: "warning",
      message: `🌾 Fibra em ${r(fiber)} g. Feijão no jantar (~9 g), aveia ou frutas com casca ajudam a fechar a meta.`,
    });
  }

  // Teto anti-fadiga: no máximo 3 avisos (prioridade acima).
  return out.slice(0, 3);
}
