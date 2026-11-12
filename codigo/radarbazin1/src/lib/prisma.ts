import { PrismaClient } from "@prisma/client";

// A integração Storage->Neon da Vercel cria a URL com prefixo (ex.: NUTRI_*) e
// nas variantes "pooled" (com -pooler) e "unpooled" (direta). Para o cliente em
// serverless de baixo tráfego, a conexão DIRETA é a mais confiável (evita
// problemas de prepared statements do PgBouncer). Caímos para a pooled só se
// for a única disponível — e aí garantimos o parâmetro pgbouncer=true.
// Acha uma variável de ambiente por sufixo, ignorando o prefixo que a
// integração da Vercel possa adicionar (ex.: NUTRI_, STORAGE_, ou nenhum).
function envBySuffix(...suffixes: string[]): string | undefined {
  for (const s of suffixes) {
    const exact = process.env[s];
    if (exact && exact.trim()) return exact;
  }
  for (const [k, v] of Object.entries(process.env)) {
    if (v && v.trim() && suffixes.some((s) => k.endsWith("_" + s))) return v;
  }
  return undefined;
}

function resolveDatabaseUrl(): string | undefined {
  const direct = envBySuffix("DATABASE_URL_UNPOOLED", "POSTGRES_URL_NON_POOLING");
  if (direct) return direct;

  const pooled = envBySuffix("DATABASE_URL", "POSTGRES_PRISMA_URL", "POSTGRES_URL");
  if (!pooled) return undefined;

  if (pooled.includes("-pooler") && !/pgbouncer=/.test(pooled)) {
    return pooled + (pooled.includes("?") ? "&" : "?") + "pgbouncer=true";
  }
  return pooled;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ datasourceUrl: resolveDatabaseUrl() });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
