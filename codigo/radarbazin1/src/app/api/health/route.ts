import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Diagnóstico: confirma conexão com o banco e se as tabelas existem.
// Mostra apenas os NOMES das variáveis de banco presentes (nunca os valores).
export async function GET() {
  const dbVars = Object.keys(process.env)
    .filter((k) => /(DATABASE_URL|POSTGRES)/i.test(k))
    .sort();

  try {
    await prisma.$queryRaw`SELECT 1`;
    const dayCount = await prisma.day.count();
    return Response.json({ ok: true, db: "conectado", tabelas: "ok", dayCount, dbVars });
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    return Response.json({ ok: false, error, dbVars }, { status: 500 });
  }
}
