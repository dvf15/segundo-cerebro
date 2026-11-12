import { prisma } from "@/lib/prisma";
import { getOrCreateDay, buildDayDTO } from "@/lib/day";
import { SAUNA_OPTIONS } from "@/lib/targets";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { date, sauna_min } = (await req.json()) ?? {};
  if (!date) return Response.json({ error: "Data ausente." }, { status: 400 });
  const min = Number(sauna_min);
  if (!SAUNA_OPTIONS.includes(min)) {
    return Response.json({ error: "Duração de sauna inválida." }, { status: 400 });
  }

  const day = await getOrCreateDay(date);
  await prisma.day.update({ where: { id: day.id }, data: { sauna_min: min } });
  return Response.json(await buildDayDTO(date));
}
