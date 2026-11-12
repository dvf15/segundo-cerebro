import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const order = { orderBy: [{ date: "asc" as const }, { time: "asc" as const }] };

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const existing = await prisma.bpReading.findUnique({ where: { id: params.id } });
  if (!existing) return Response.json({ error: "Medição não encontrada." }, { status: 404 });

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const data: { date?: string; time?: string; sys?: number; dia?: number; note?: string | null } = {};
  if (typeof b.date === "string" && b.date) data.date = b.date;
  if (typeof b.time === "string" && b.time) data.time = b.time;
  if (b.sys !== undefined && isFinite(Number(b.sys))) data.sys = Math.round(Number(b.sys));
  if (b.dia !== undefined && isFinite(Number(b.dia))) data.dia = Math.round(Number(b.dia));
  if (b.note !== undefined)
    data.note = typeof b.note === "string" && b.note.trim() ? b.note.trim() : null;

  await prisma.bpReading.update({ where: { id: params.id }, data });
  return Response.json({ readings: await prisma.bpReading.findMany(order) });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const existing = await prisma.bpReading.findUnique({ where: { id: params.id } });
  if (!existing) return Response.json({ error: "Medição não encontrada." }, { status: 404 });
  await prisma.bpReading.delete({ where: { id: params.id } });
  return Response.json({ readings: await prisma.bpReading.findMany(order) });
}
