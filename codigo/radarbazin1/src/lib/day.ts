import { prisma } from "./prisma";
import { isTrainingType, TRAINING_LABELS, saunaKcal } from "./targets";
import { defaultTrainingFor, visibleTrainingTypes } from "./preset";
import { getProfile, effectiveTargets } from "./profile";
import { sumMeals, remaining, dayFlags } from "./macros";
import { normalizeMicros, sumMicros, scaleMicros, microScore, effectiveMicroTargets } from "./micros";
import type { DayDTO, TrainingType, MealDTO } from "./types";

function parseFlags(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    // tolera formato antigo separado por vírgula
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  }
}

function parseMicros(raw: string | null): Record<string, number> {
  if (!raw) return normalizeMicros({});
  try {
    return normalizeMicros(JSON.parse(raw));
  } catch {
    return normalizeMicros({});
  }
}

export async function getOrCreateDay(date: string) {
  const existing = await prisma.day.findUnique({
    where: { date },
    include: { meals: { orderBy: { createdAt: "asc" } } },
  });
  if (existing) return existing;

  await prisma.day.create({ data: { date, training_type: defaultTrainingFor(date) } });
  return prisma.day.findUniqueOrThrow({
    where: { date },
    include: { meals: { orderBy: { createdAt: "asc" } } },
  });
}

export async function buildDayDTO(date: string): Promise<DayDTO> {
  const day = await getOrCreateDay(date);
  const training: TrainingType = isTrainingType(day.training_type)
    ? day.training_type
    : "rest";
  const profile = await getProfile();
  const baseTargets = effectiveTargets(profile.targets, training);

  // Alerta de metas/fase desatualizada: exame após a última revisão, ou > 60 dias.
  const PHASE_LABELS: Record<string, string> = {
    corte: "corte",
    manutencao: "manutenção",
    ganho: "ganho",
  };
  let metaAlert: string | null = null;
  const setAt = profile.phase_set_at;
  if (setAt) {
    const faseTxt = profile.phase ? ` (fase: ${PHASE_LABELS[profile.phase] ?? profile.phase})` : "";
    if (profile.exam_date && profile.exam_date > setAt) {
      metaAlert = `📋 Exame de ${profile.exam_date} registrado após a última revisão de metas${faseTxt}. Revisar as metas no Perfil?`;
    } else {
      const dref = new Date(setAt + "T12:00:00");
      const days = Math.round((Date.now() - dref.getTime()) / 86400000);
      if (days > 60) metaAlert = `📋 Metas revisadas há ${days} dias${faseTxt}. Vale conferir no Perfil.`;
    }
  }

  // Sauna: soma o gasto calórico estimado ao teto de kcal do dia.
  const saunaMin = day.sauna_min || 0;
  const sKcal = saunaKcal(saunaMin);
  const targets: typeof baseTargets = sKcal
    ? { ...baseTargets, kcal: [baseTargets.kcal[0] + sKcal, baseTargets.kcal[1] + sKcal] }
    : baseTargets;

  const meals: MealDTO[] = day.meals.map((m) => ({
    id: m.id,
    code: m.code,
    description: m.description,
    photo_url: m.photo_url,
    kcal: m.kcal,
    protein_g: m.protein_g,
    carb_g: m.carb_g,
    fat_g: m.fat_g,
    confidence: m.confidence,
    flags: parseFlags(m.flags),
    micros: parseMicros(m.micros_json),
    time: m.time ?? null,
  }));

  const totals = sumMeals(meals);
  const allFlags = meals.flatMap((m) => m.flags);

  // Cápsulas de cada suplemento tomadas no dia.
  // null => dia novo: assume a dose padrão de cada suplemento.
  // {}/[] => nada tomado. array => nomes na dose padrão. objeto => cápsulas.
  const doseOf = (name: string) =>
    profile.supplements.find((s) => s.name === name)?.dose || 1;
  let suppDoses: Record<string, number> = {};
  if (day.supps_json == null) {
    for (const s of profile.supplements) suppDoses[s.name] = s.dose;
  } else {
    try {
      const parsed = JSON.parse(day.supps_json);
      if (Array.isArray(parsed)) {
        for (const n of parsed) suppDoses[String(n)] = doseOf(String(n));
      } else if (parsed && typeof parsed === "object") {
        for (const [k, v] of Object.entries(parsed)) {
          const c = Number(v);
          if (isFinite(c) && c > 0) suppDoses[k] = c;
        }
      }
    } catch {
      suppDoses = {};
    }
  }

  const takenSupps = profile.supplements
    .filter((s) => (suppDoses[s.name] ?? 0) > 0)
    .map((s) => ({ micros: scaleMicros(s.micros, suppDoses[s.name] / (s.dose || 1)) }));
  const suppsTaken = profile.supplements
    .filter((s) => (suppDoses[s.name] ?? 0) > 0)
    .map((s) => s.name);

  const micros_totals = sumMicros([...meals, ...takenSupps]);
  const micro_targets = effectiveMicroTargets(profile.micro_targets);

  // Última refeição registrada (data+hora), p/ o jejum corrente. É global
  // (independe do dia visível): o jejum vai da última refeição até agora.
  // Refeições por foto ficam ~15min no futuro (foto + 15) — precisam contar
  // como "acabei de comer" e zerar o jejum; por isso aceitamos horários um
  // pouco à frente (até 6h) e o cliente trava o jejum em 0 quando negativo.
  // IMPORTANTE (timezone): o horário da refeição ("HH:MM") é o relógio LOCAL do
  // usuário. O servidor roda em UTC, então NÃO convertemos para instante aqui —
  // devolvemos uma string "naive" (sem fuso) e o CLIENTE interpreta no fuso do
  // navegador. Refeições sem hora usam createdAt (instante absoluto, com Z).
  // O ranking usa uma base-UTC consistente só para escolher a mais recente.
  let lastMealAt: string | null = null;
  try {
    const recent = await prisma.meal.findMany({
      include: { day: true },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
    const limite = Date.now() + 6 * 3600000; // ignora datas absurdas no futuro
    let bestRank = 0;
    let bestValue: string | null = null;
    const consider = (rankMs: number, value: string) => {
      if (isFinite(rankMs) && rankMs <= limite && rankMs > bestRank) {
        bestRank = rankMs;
        bestValue = value;
      }
    };
    for (const m of recent) {
      if (m.time && /^\d{2}:\d{2}$/.test(m.time)) {
        // valor "naive" p/ o cliente; rank em base-UTC só p/ ordenar.
        consider(Date.parse(`${m.day.date}T${m.time}:00Z`), `${m.day.date}T${m.time}:00`);
      } else {
        consider(new Date(m.createdAt).getTime(), new Date(m.createdAt).toISOString());
      }
    }
    // Reinício manual do jejum ("comi agora") conta como última refeição.
    if (profile.fast_reset_at) {
      const v = profile.fast_reset_at;
      const isAbs = /Z$|[+-]\d\d:?\d\d$/.test(v); // ISO com fuso (legado)
      if (isAbs) consider(new Date(v).getTime(), new Date(v).toISOString());
      else consider(Date.parse(`${v.slice(0, 16)}:00Z`), `${v.slice(0, 16)}:00`);
    }
    lastMealAt = bestValue;
  } catch {
    lastMealAt = null;
  }

  return {
    date: day.date,
    training_type: training,
    training_notes: day.training_notes,
    closed: day.closed,
    meals,
    totals,
    targets,
    remaining: remaining(totals, targets),
    flags: dayFlags(totals, targets, allFlags),
    micros_totals,
    micro_targets,
    micro_score: microScore(micros_totals, micro_targets),
    supplements: profile.supplements,
    supps_taken: suppsTaken,
    supps_doses: suppDoses,
    owner_name: profile.name,
    training_options: visibleTrainingTypes().map((tt) => ({
      value: tt,
      label: TRAINING_LABELS[tt],
    })),
    sauna_min: saunaMin,
    sauna_kcal: sKcal,
    weight_kg: day.weight_kg ?? null,
    meta_alert: metaAlert,
    last_meal_at: lastMealAt,
  };
}
