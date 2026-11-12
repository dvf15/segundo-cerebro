import { prisma } from "@/lib/prisma";
import { isTrainingType, saunaKcal } from "@/lib/targets";
import { sumMeals } from "@/lib/macros";
import { getProfile, effectiveTargets } from "@/lib/profile";
import {
  MICROS,
  normalizeMicros,
  sumMicros,
  scaleMicros,
  microScore,
  effectiveMicroTargets,
} from "@/lib/micros";
import type { TrainingType } from "@/lib/types";

export const runtime = "nodejs";

function safeParse(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const days = Math.max(1, Math.min(3650, Number(searchParams.get("days")) || 14));

  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  const sinceKey = since.toLocaleDateString("en-CA");

  const rows = await prisma.day.findMany({
    where: { date: { gte: sinceKey } },
    include: { meals: true },
    orderBy: { date: "asc" },
  });

  const profile = await getProfile();
  const microTargets = effectiveMicroTargets(profile.micro_targets);
  const doseOf = (name: string) =>
    profile.supplements.find((s) => s.name === name)?.dose || 1;

  // Cápsulas de suplementos do dia (mesma lógica do diário).
  function suppDosesFor(supps_json: string | null): Record<string, number> {
    const dz: Record<string, number> = {};
    if (supps_json == null) {
      for (const s of profile.supplements) dz[s.name] = s.dose;
      return dz;
    }
    const parsed = safeParse(supps_json);
    if (Array.isArray(parsed)) {
      for (const n of parsed) dz[String(n)] = doseOf(String(n));
    } else if (parsed && typeof parsed === "object") {
      for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
        const c = Number(v);
        if (isFinite(c) && c > 0) dz[k] = c;
      }
    }
    return dz;
  }

  const data = rows
    .filter((d) => d.meals.length > 0)
    .map((d) => {
      const training: TrainingType = isTrainingType(d.training_type)
        ? d.training_type
        : "rest";
      const t = effectiveTargets(profile.targets, training);
      const totals = sumMeals(d.meals);
      const mid = (x: [number, number]) => Math.round((x[0] + x[1]) / 2);

      const mealItems = d.meals.map((m) => ({
        micros: normalizeMicros(safeParse(m.micros_json)),
      }));
      const dz = suppDosesFor(d.supps_json);
      const takenSupps = profile.supplements
        .filter((s) => (dz[s.name] ?? 0) > 0)
        .map((s) => ({ micros: scaleMicros(s.micros, dz[s.name] / (s.dose || 1)) }));
      const microsTotals = sumMicros([...mealItems, ...takenSupps]);

      return {
        date: d.date,
        label: d.date.slice(5), // MM-DD
        training_type: training,
        closed: d.closed,
        kcal: Math.round(totals.kcal),
        protein_g: Math.round(totals.protein_g),
        carb_g: Math.round(totals.carb_g),
        fat_g: Math.round(totals.fat_g),
        weight_kg: d.weight_kg ?? null,
        meta_kcal: mid(t.kcal) + saunaKcal(d.sauna_min || 0),
        meta_protein: mid(t.protein_g),
        meta_carb: mid(t.carb_g),
        meta_fat: mid(t.fat_g),
        micro_score: microScore(microsTotals, microTargets),
        micros: microsTotals,
      };
    });

  return Response.json({
    days: data,
    micro_targets: microTargets,
    micro_keys: MICROS.map((m) => ({ key: m.key, label: m.label, mode: m.mode })),
  });
}
