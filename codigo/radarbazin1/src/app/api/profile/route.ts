import { prisma } from "@/lib/prisma";
import { getProfile, effectiveTargets } from "@/lib/profile";
import { normalizeSupplements } from "@/lib/micros";
import { TRAINING_LABELS } from "@/lib/targets";
import { visibleTrainingTypes } from "@/lib/preset";
import type { Targets, TrainingType } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const profile = await getProfile();
  const foods = await prisma.knownFood
    .findMany({ orderBy: { name: "asc" } })
    .catch(() => []);
  // Metas efetivas por treino (override do perfil ou base), p/ o editor.
  const effective_targets: Record<string, Targets> = {};
  for (const tt of visibleTrainingTypes()) {
    effective_targets[tt] = effectiveTargets(profile.targets, tt as TrainingType);
  }
  const training_labels = TRAINING_LABELS;
  return Response.json({ profile, foods, effective_targets, training_labels });
}

// Aceita o objeto do formulário OU o JSON gerado pela skill. Todos os campos
// são opcionais — só os enviados são atualizados.
export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {};
  const num = (v: unknown) =>
    v === undefined || v === null || v === "" ? undefined : Number(v);
  const int = (v: unknown) => {
    const n = num(v);
    return n === undefined || isNaN(n) ? undefined : Math.round(n);
  };

  if (typeof b.name === "string") data.name = b.name;
  if (num(b.weight_kg) !== undefined) data.weight_kg = num(b.weight_kg);
  if (num(b.skeletal_muscle_kg) !== undefined)
    data.skeletal_muscle_kg = num(b.skeletal_muscle_kg);
  if (num(b.body_fat_pct) !== undefined) data.body_fat_pct = num(b.body_fat_pct);
  if (int(b.tmb_kcal) !== undefined) data.tmb_kcal = int(b.tmb_kcal);
  if (typeof b.goal === "string") data.goal = b.goal;
  if (typeof b.notes === "string") data.notes = b.notes;
  if (typeof b.science_ref === "string") data.science_ref = b.science_ref;

  // Fase (corte/manutenção/ganho): carimba a data de revisão quando muda ou é
  // confirmada explicitamente (botão "revisei as metas").
  if (typeof b.phase === "string" && ["corte", "manutencao", "ganho"].includes(b.phase)) {
    data.phase = b.phase;
    const existing = await prisma.profile.findUnique({ where: { id: "default" } }).catch(() => null);
    if (b.confirm_phase || !existing || existing.phase !== b.phase || !existing.phase_set_at) {
      data.phase_set_at = new Date().toLocaleDateString("en-CA");
    }
  }

  // Exames: aceita aninhado em "exams" ou campos diretos.
  const exams = (b.exams as Record<string, unknown>) || {};
  if (int(exams.ldl ?? b.ldl) !== undefined) data.ldl = int(exams.ldl ?? b.ldl);
  if (int(exams.hdl ?? b.hdl) !== undefined) data.hdl = int(exams.hdl ?? b.hdl);
  if (int(exams.triglycerides ?? b.triglycerides) !== undefined)
    data.triglycerides = int(exams.triglycerides ?? b.triglycerides);
  const examDate = exams.date ?? b.exam_date;
  if (typeof examDate === "string" && examDate) data.exam_date = examDate;

  // Metas por treino (override).
  if (b.targets && typeof b.targets === "object") {
    data.targets_json = JSON.stringify(b.targets);
  }

  // Metas de micronutrientes (override).
  if (b.micro_targets && typeof b.micro_targets === "object") {
    const mt: Record<string, number> = {};
    for (const [k, v] of Object.entries(b.micro_targets as Record<string, unknown>)) {
      const n = Number(v);
      if (!isNaN(n) && n > 0) mt[k] = n;
    }
    data.micro_targets_json = JSON.stringify(mt);
  }

  // Suplementos diários configurados.
  if (Array.isArray(b.supplements)) {
    data.supplements_json = JSON.stringify(normalizeSupplements(b.supplements));
  }

  await prisma.profile.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data },
  });

  // Alimentos com macros fixos (upsert por nome).
  if (Array.isArray(b.known_foods)) {
    for (const f of b.known_foods as Record<string, unknown>[]) {
      if (!f || typeof f.name !== "string" || !f.name.trim()) continue;
      const fd = {
        name: f.name.trim(),
        serving_g: Number(f.serving_g) || 0,
        kcal_per_serving: Number(f.kcal_per_serving) || 0,
        protein_g: Number(f.protein_g) || 0,
        carb_g: Number(f.carb_g) || 0,
        fat_g: Number(f.fat_g) || 0,
        notes: typeof f.notes === "string" ? f.notes : null,
      };
      await prisma.knownFood.upsert({
        where: { name: fd.name },
        update: fd,
        create: fd,
      });
    }
  }

  const profile = await getProfile();
  const foods = await prisma.knownFood
    .findMany({ orderBy: { name: "asc" } })
    .catch(() => []);
  return Response.json({ ok: true, profile, foods });
}
