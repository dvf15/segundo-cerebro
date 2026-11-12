import { prisma } from "./prisma";
import { buildDayDTO } from "./day";
import { getProfile } from "./profile";
import { MICROS } from "./micros";

const r = (n: number) => Math.round(n || 0);

export const BRAZIL_CUISINE =
  "Priorize opções da culinária brasileira (arroz, feijão, carnes magras, frango, ovos, peixe, frutas, mandioca, tapioca, batata-doce, legumes, etc.) coerentes com o histórico do usuário.";

// Contexto compartilhado para sugestão da próxima refeição e plano do dia.
export async function buildMealContext(date: string, clientHour?: number) {
  const day = await buildDayDTO(date);
  const profile = await getProfile();

  // Histórico: últimos 7 dias antes de hoje, com refeições.
  const since = new Date(date + "T12:00:00");
  since.setDate(since.getDate() - 7);
  const sinceKey = since.toLocaleDateString("en-CA");
  const histDays = await prisma.day.findMany({
    where: { date: { gte: sinceKey, lt: date } },
    include: { meals: { orderBy: { createdAt: "asc" } } },
    orderBy: { date: "asc" },
  });
  const historyText =
    histDays
      .filter((d) => d.meals.length)
      .map(
        (d) =>
          `${d.date} (${d.training_type}): ` +
          d.meals
            .map(
              (m) =>
                `${m.code} ${m.description} [${r(m.kcal)}kcal P${r(m.protein_g)} C${r(m.carb_g)} G${r(m.fat_g)}]`
            )
            .join("; ")
      )
      .join("\n") || "sem histórico recente";

  const t = day.targets;
  const hour = typeof clientHour === "number" ? clientHour : new Date().getHours();
  const todayMeals = day.meals.map((m) => `${m.code} ${m.description}`).join("; ") || "nenhuma ainda";
  const nums = day.meals.map((m) => parseInt(m.code.replace(/[^0-9]/g, ""), 10) || 0);
  const nextCode = day.meals.length ? `R${Math.max(...nums) + 1}` : "R1";

  const lipids = [
    profile.ldl != null ? `LDL ${profile.ldl}` : null,
    profile.hdl != null ? `HDL ${profile.hdl}` : null,
    profile.triglycerides != null ? `triglicérides ${profile.triglycerides}` : null,
  ]
    .filter(Boolean)
    .join(" / ");

  const microRanked = MICROS.filter((d) => d.mode === "goal")
    .map((d) => ({
      d,
      pct: Math.round(((day.micros_totals[d.key] || 0) / (day.micro_targets[d.key] ?? d.target)) * 100),
    }))
    .sort((a, b) => a.pct - b.pct);
  const microLowList = microRanked
    .slice(0, 5)
    .map((x) => `${x.d.label} ${x.pct}%`)
    .join(", ");
  const microHint = `Micronutrientes (score micro ${day.micro_score}% das metas). Mais baixos hoje: ${microLowList} — favoreça alimentos ricos nesses.`;

  const IMMUNE = ["vit_c_mg", "vit_d_iu", "zinc_mg", "vit_b12_mcg", "iron_mg"];
  const immuneLow = MICROS.filter((d) => IMMUNE.includes(d.key))
    .map((d) => ({ d, pct: (day.micros_totals[d.key] || 0) / (day.micro_targets[d.key] ?? d.target) }))
    .filter((x) => x.pct < 0.7)
    .sort((a, b) => a.pct - b.pct)
    .map((x) => x.d.label);
  const immuneHint = immuneLow.length
    ? `Imunidade: hoje estão baixos ${immuneLow.join(", ")} — favoreça alimentos ricos nesses e cite o benefício na justificativa.`
    : "";

  const profileLine = `Perfil: ${profile.name}, homem, ${profile.weight_kg}kg, ${profile.skeletal_muscle_kg}kg músculo, objetivo: ${profile.goal}.${lipids ? ` Exames: ${lipids}.` : ""}`;
  const targetsLine = `Metas do dia: kcal ${t.kcal[0]}-${t.kcal[1]}, Proteína ${t.protein_g[0]}-${t.protein_g[1]}g, Carbo ${t.carb_g[0]}-${t.carb_g[1]}g, Gordura ${t.fat_g[0]}-${t.fat_g[1]}g.`;
  const consumedLine = `Já consumido (${day.meals.length} refeições): kcal ${r(day.totals.kcal)} | P ${r(day.totals.protein_g)}g | C ${r(day.totals.carb_g)}g | G ${r(day.totals.fat_g)}g.`;
  const remainingLine = `Falta até o teto: kcal ${r(day.remaining.kcal)} | P ${r(day.remaining.protein_g)}g | C ${r(day.remaining.carb_g)}g | G ${r(day.remaining.fat_g)}g.`;

  // Ritmo do dia: quanto da janela alimentar (~08h–22h) já passou.
  const frac = Math.max(0, Math.min(1, (hour - 8) / (22 - 8)));
  const pacePct = Math.round(frac * 100);
  const kcalPct = t.kcal[1] > 0 ? Math.round((day.totals.kcal / t.kcal[1]) * 100) : 0;
  const paceLine = `Momento do dia: ${hour}h — já passou ~${pacePct}% da janela alimentar; você consumiu ${kcalPct}% do teto calórico. ${
    kcalPct < pacePct - 15
      ? "Está atrasado nas metas para o horário — a refeição pode ser mais robusta."
      : kcalPct > pacePct + 15
        ? "Está adiantado/acima do ritmo — prefira algo mais leve para não estourar o teto."
        : "Ritmo equilibrado para o horário."
  } Considere quantas refeições ainda cabem até o fim do dia.`;

  return {
    day,
    profile,
    hour,
    nextCode,
    todayMeals,
    historyText,
    microHint,
    immuneHint,
    profileLine,
    targetsLine,
    consumedLine,
    remainingLine,
    paceLine,
  };
}

// Extrai o primeiro objeto/array JSON de um texto (tolera markdown).
export function parseJsonLoose(text: string): unknown {
  const clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    const s = clean.search(/[[{]/);
    const e = Math.max(clean.lastIndexOf("}"), clean.lastIndexOf("]"));
    return JSON.parse(clean.slice(s, e + 1));
  }
}
