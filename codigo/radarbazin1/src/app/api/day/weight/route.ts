import { prisma } from "@/lib/prisma";
import { getOrCreateDay, buildDayDTO } from "@/lib/day";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { date, weight_kg } = (await req.json()) ?? {};
  if (!date) return Response.json({ error: "Data ausente." }, { status: 400 });

  const raw = weight_kg;
  let value: number | null = null;
  if (raw !== null && raw !== undefined && raw !== "") {
    const n = Number(String(raw).replace(",", "."));
    if (!isFinite(n) || n <= 0 || n > 400) {
      return Response.json({ error: "Peso inválido." }, { status: 400 });
    }
    value = Math.round(n * 10) / 10;
  }

  const day = await getOrCreateDay(date);
  await prisma.day.update({ where: { id: day.id }, data: { weight_kg: value } });
  return Response.json(await buildDayDTO(date));
}
