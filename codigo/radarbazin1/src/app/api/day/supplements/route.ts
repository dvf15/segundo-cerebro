import { prisma } from "@/lib/prisma";
import { getOrCreateDay, buildDayDTO } from "@/lib/day";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { date, names, doses } = (await req.json()) ?? {};
  if (!date) return Response.json({ error: "Data ausente." }, { status: 400 });

  // Armazena um mapa { nome: fator } (dose relativa à padrão). Aceita também o
  // formato antigo "names" (lista) por compatibilidade.
  const store: Record<string, number> = {};
  if (doses && typeof doses === "object" && !Array.isArray(doses)) {
    for (const [k, v] of Object.entries(doses)) {
      const f = Number(v);
      if (isFinite(f) && f > 0) store[k] = f;
    }
  } else if (Array.isArray(names)) {
    for (const n of names) store[String(n)] = 1;
  }

  const day = await getOrCreateDay(date);
  await prisma.day.update({
    where: { id: day.id },
    data: { supps_json: JSON.stringify(store) },
  });
  return Response.json(await buildDayDTO(date));
}
