// Build da Vercel: normaliza as variáveis do Postgres (Neon/Vercel), que podem
// vir com prefixo (ex.: NUTRI_DATABASE_URL) ou como POSTGRES_*, para os nomes
// que o Prisma espera (DATABASE_URL / DATABASE_URL_UNPOOLED), e então roda
// generate -> migrate deploy -> next build.
import { execSync } from "node:child_process";

// Acha a variável por SUFIXO, ignorando o prefixo que a integração da Vercel
// possa adicionar (ex.: NUTRI_, STORAGE_, ou nenhum).
const pick = (...suffixes) => {
  for (const s of suffixes) {
    const exact = process.env[s];
    if (exact && exact.trim()) return exact;
  }
  for (const [k, v] of Object.entries(process.env)) {
    if (v && v.trim() && suffixes.some((s) => k.endsWith("_" + s))) return v;
  }
  return undefined;
};

const url = pick("DATABASE_URL", "POSTGRES_PRISMA_URL", "POSTGRES_URL");

const direct =
  pick("DATABASE_URL_UNPOOLED", "POSTGRES_URL_NON_POOLING") || url;

const hasRealDb = Boolean(url);

// Garante que as variáveis existam para o `prisma generate` validar o schema.
process.env.DATABASE_URL =
  url || "postgresql://placeholder@localhost:5432/placeholder";
process.env.DATABASE_URL_UNPOOLED = direct || process.env.DATABASE_URL;

const run = (cmd) => execSync(cmd, { stdio: "inherit" });

run("prisma generate");

if (hasRealDb) {
  console.log("→ Aplicando migrations (prisma migrate deploy)…");
  run("prisma migrate deploy");
} else {
  console.warn(
    "⚠ Nenhuma DATABASE_URL encontrada — pulando migrate deploy. " +
      "Conecte um banco (Storage → Neon) e refaça o deploy."
  );
}

run("next build");
