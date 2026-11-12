import { prisma } from "@/lib/prisma";
import { getOrCreateDay, buildDayDTO } from "@/lib/day";
import { nextMealCode } from "@/lib/macros";
import { normalizeMicros } from "@/lib/micros";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    date,
    description,
    photo_url,
    kcal,
    protein_g,
    carb_g,
    fat_g,
    confidence,
    flags,
    micros,
    time,
  } = body ?? {};

  if (!date) {
    return Response.json({ error: "Data ausente." }, { status: 400 });
  }

  const mealTime =
    typeof time === "string" && /^\d{2}:\d{2}$/.test(time) ? time : null;

  const day = await getOrCreateDay(date);
  const code = nextMealCode(day.meals);

  await prisma.meal.create({
    data: {
      day_id: day.id,
      code,
      description: String(description ?? "Refeição"),
      photo_url: photo_url ? String(photo_url) : null,
      kcal: Number(kcal) || 0,
      protein_g: Number(protein_g) || 0,
      carb_g: Number(carb_g) || 0,
      fat_g: Number(fat_g) || 0,
      confidence: Math.max(1, Math.min(10, Math.round(Number(confidence) || 5))),
      flags: Array.isArray(flags) && flags.length ? JSON.stringify(flags) : null,
      micros_json: micros ? JSON.stringify(normalizeMicros(micros)) : null,
      time: mealTime,
    },
  });

  return Response.json(await buildDayDTO(date));
}
