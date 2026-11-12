import { prisma } from "@/lib/prisma";
import { IS_OWNER } from "@/lib/preset";
import { WEIGHT_SEED, WEIGHT_SEED_SIGNATURE } from "@/lib/weight";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function listPoints() {
  const days = await prisma.day.findMany({
    where: { weight_kg: { not: null } },
    orderBy: { date: "asc" },
    select: { date: true, weight_kg: true },
  });
  return days.map((d) => ({ date: d.date, weight_kg: d.weight_kg as number }));
}

export async function GET() {
  let points = await listPoints().catch(() => [] as { date: string; weight_kg: number }[]);
  // Seed do histórico — só na instância do dono. Aplica quando a tabela está
  // vazia (instalação nova) OU quando um banco já semeado com a versão antiga
  // (esparsa) ainda não tem o seed enriquecido dos gráficos de 2026
  // (detectado pela data-assinatura). Após reaplicar, a assinatura passa a
  // existir e o seed não roda mais, preservando edições manuais.
  const hasSignature = points.some((p) => p.date === WEIGHT_SEED_SIGNATURE);
  if (IS_OWNER && (points.length === 0 || !hasSignature)) {
    try {
      for (const p of WEIGHT_SEED) {
        await prisma.day.upsert({
          where: { date: p.date },
          update: { weight_kg: p.weight_kg },
          create: { date: p.date, weight_kg: p.weight_kg },
        });
      }
      points = await listPoints();
    } catch {
      /* tabela ainda não migrada — retorna vazio */
    }
  }
  return Response.json({ points });
}

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const date = typeof b.date === "string" ? b.date : "";
  if (!date) {
    return Response.json({ error: "Informe a data." }, { status: 400 });
  }

  // Campo vazio/null limpa o peso do dia; caso contrário valida 0 < n ≤ 400.
  let weight_kg: number | null = null;
  if (b.weight_kg !== undefined && b.weight_kg !== null && b.weight_kg !== "") {
    const n = Number(b.weight_kg);
    if (!isFinite(n) || n <= 0 || n > 400) {
      return Response.json({ error: "Peso inválido." }, { status: 400 });
    }
    weight_kg = Math.round(n * 10) / 10;
  }

  await prisma.day.upsert({
    where: { date },
    update: { weight_kg },
    create: { date, weight_kg },
  });

  return Response.json({ points: await listPoints() });
}
