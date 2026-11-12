import { prisma } from "@/lib/prisma";
import { buildDayDTO } from "@/lib/day";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Reinício manual do jejum: marca "comi agora" (ou o horário informado) como
// referência da última refeição, zerando o relógio de jejum. Global (perfil).
export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const date =
    typeof b.date === "string" && b.date
      ? b.date
      : new Date().toLocaleDateString("en-CA");

  // O cliente envia o horário LOCAL "naive" (YYYY-MM-DDTHH:MM) — guardamos como
  // está para o cliente reinterpretar no fuso do navegador (evita erro de
  // timezone). Sem "at", cai para o ISO do servidor (fallback).
  let stored = new Date().toISOString();
  if (typeof b.at === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(b.at)) {
    stored = `${b.at.slice(0, 16)}:00`;
  }

  await prisma.profile.upsert({
    where: { id: "default" },
    update: { fast_reset_at: stored },
    create: { id: "default", fast_reset_at: stored },
  });

  return Response.json(await buildDayDTO(date));
}
