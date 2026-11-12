import { prisma } from "@/lib/prisma";
import { buildDayDTO } from "@/lib/day";
import { normalizeMicros } from "@/lib/micros";

export const runtime = "nodejs";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const meal = await prisma.meal.findUnique({
    where: { id: params.id },
    include: { day: true },
  });
  if (!meal) {
    return Response.json({ error: "Refeição não encontrada." }, { status: 404 });
  }

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const num = (v: unknown) =>
    v === undefined || v === null || v === "" ? undefined : Number(String(v).replace(",", "."));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {};
  if (typeof b.description === "string" && b.description.trim()) data.description = b.description.trim();
  const kcal = num(b.kcal);
  const protein = num(b.protein_g);
  const carb = num(b.carb_g);
  const fat = num(b.fat_g);
  if (kcal !== undefined && isFinite(kcal)) data.kcal = Math.max(0, kcal);
  if (protein !== undefined && isFinite(protein)) data.protein_g = Math.max(0, protein);
  if (carb !== undefined && isFinite(carb)) data.carb_g = Math.max(0, carb);
  if (fat !== undefined && isFinite(fat)) data.fat_g = Math.max(0, fat);

  // Campos vindos de uma re-estimativa por IA.
  const conf = num(b.confidence);
  if (conf !== undefined && isFinite(conf)) data.confidence = Math.max(1, Math.min(10, Math.round(conf)));
  if (Array.isArray(b.flags)) data.flags = b.flags.length ? JSON.stringify(b.flags) : null;
  if (b.micros !== undefined) data.micros_json = b.micros ? JSON.stringify(normalizeMicros(b.micros)) : null;
  if (typeof b.photo_url === "string") data.photo_url = b.photo_url || null;
  // Horário da refeição "HH:MM" (string vazia limpa o campo).
  if (typeof b.time === "string") {
    data.time = /^\d{2}:\d{2}$/.test(b.time) ? b.time : null;
  }

  await prisma.meal.update({ where: { id: params.id }, data });
  return Response.json(await buildDayDTO(meal.day.date));
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const meal = await prisma.meal.findUnique({
    where: { id: params.id },
    include: { day: true },
  });
  if (!meal) {
    return Response.json({ error: "Refeição não encontrada." }, { status: 404 });
  }
  await prisma.meal.delete({ where: { id: params.id } });
  return Response.json(await buildDayDTO(meal.day.date));
}
