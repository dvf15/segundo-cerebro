import { prisma } from "@/lib/prisma";
import { IS_OWNER } from "@/lib/preset";
import { BP_SEED } from "@/lib/bp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const order = { orderBy: [{ date: "asc" as const }, { time: "asc" as const }] };

async function listReadings() {
  return prisma.bpReading.findMany(order);
}

export async function GET() {
  let readings = await listReadings().catch(() => []);
  // Seed inicial só na instância do dono e apenas se a tabela estiver vazia.
  if (readings.length === 0 && IS_OWNER) {
    try {
      await prisma.bpReading.createMany({
        data: BP_SEED.map((r) => ({ date: r.date, time: r.time, sys: r.sys, dia: r.dia })),
      });
      readings = await listReadings();
    } catch {
      /* tabela ainda não migrada — retorna vazio */
    }
  }
  return Response.json({ readings });
}

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const date = typeof b.date === "string" ? b.date : "";
  const time = typeof b.time === "string" ? b.time : "";
  const sys = Math.round(Number(b.sys));
  const dia = Math.round(Number(b.dia));
  const note = typeof b.note === "string" && b.note.trim() ? b.note.trim() : null;

  if (!date || !time || !isFinite(sys) || !isFinite(dia) || sys <= 0 || dia <= 0) {
    return Response.json({ error: "Preencha data, hora, sistólica e diastólica." }, { status: 400 });
  }

  await prisma.bpReading.create({ data: { date, time, sys, dia, note } });
  return Response.json({ readings: await listReadings() });
}
