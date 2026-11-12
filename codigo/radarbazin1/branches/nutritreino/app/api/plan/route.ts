import { anthropicClient } from "@/lib/anthropic";
import { TRAINING_LABELS } from "@/lib/targets";
import { buildMealContext, BRAZIL_CUISINE, parseJsonLoose } from "@/lib/mealAI";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const r = (n: number) => Math.round(n || 0);

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY ausente — configure no projeto." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const date: string | undefined = body?.date;
  const clientHour: number | undefined = body?.clientHour;
  const intent = typeof body?.intent === "string" ? body.intent.trim() : "";
  if (!date) return Response.json({ error: "Data ausente." }, { status: 400 });

  const ctx = await buildMealContext(date, clientHour);
  const { day, profile, nextCode } = ctx;

  const intentLine = intent
    ? `O usuário já decidiu a próxima refeição (${nextCode}): "${intent}". Use isso como a primeira refeição do plano (ajustando quantidades) e planeje as seguintes ao redor dela.`
    : "";

  const userText = `${ctx.profileLine}
Diretrizes: ${profile.notes}
Treino de hoje: ${TRAINING_LABELS[day.training_type]}.
${ctx.targetsLine}
${ctx.consumedLine}
${ctx.remainingLine}
Horário agora: ${ctx.hour}h. A próxima refeição seria a ${nextCode}.
${ctx.paceLine}
Refeições de hoje: ${ctx.todayMeals}.
${ctx.microHint}
${ctx.immuneHint}
${intentLine}
Histórico recente de refeições (veja quantas refeições por dia ele costuma fazer e o que come):
${ctx.historyText}

${BRAZIL_CUISINE}
Monte um PLANO das próximas refeições do dia, a partir da ${nextCode} até o fim do dia, para fechar as metas do dia. Decida quantas refeições ainda fazem sentido (no máximo 3) com base no horário, no que falta de calorias e no padrão do histórico. O plano, somado ao que já foi consumido, deve aproximar as metas de macros (kcal, proteína, carbo, gordura — gordura saturada baixa) e melhorar o score de micronutrientes, com atenção à imunidade. Cada refeição deve ser realista e da culinária brasileira.
Seja CONCISO para caber na resposta: "descricao" curta (itens e quantidades) e "justificativa" em no máximo uma frase curta.

RETORNE SOMENTE JSON, sem markdown:
{"refeicoes":[{"meal_code":"${nextCode}","titulo":"nome curto","descricao":"itens e quantidades","kcal":number,"protein_g":number,"carb_g":number,"fat_g":number,"justificativa":"1 frase curta"}],"resumo":"1 frase de como o plano fecha as metas"}`;

  const client = anthropicClient();
  try {
    const resp = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 3000,
      system:
        "Você é um nutricionista que planeja as refeições restantes do dia equilibrando macronutrientes (metas restantes, treino) e micronutrientes (score micro), usando a culinária brasileira. Seja prático e realista. Responda em português do Brasil.\n\n" +
        profile.science_ref,
      messages: [{ role: "user", content: [{ type: "text", text: userText }] }],
    });
    const text = resp.content.map((b) => (b.type === "text" ? b.text : "")).join("");

    // Resgata objetos de refeição completos mesmo se o JSON vier truncado.
    const salvageMeals = (s: string): Record<string, unknown>[] => {
      const out: Record<string, unknown>[] = [];
      for (const frag of s.match(/\{[^{}]*\}/g) || []) {
        try {
          const m = JSON.parse(frag);
          if (m && typeof m === "object" && (m.titulo || m.kcal != null)) out.push(m);
        } catch {
          /* ignora fragmento incompleto */
        }
      }
      return out;
    };

    let arr: Record<string, unknown>[] = [];
    let resumo = "";
    try {
      const obj = parseJsonLoose(text) as Record<string, unknown>;
      if (Array.isArray(obj.refeicoes)) arr = obj.refeicoes as Record<string, unknown>[];
      resumo = String(obj.resumo ?? "");
    } catch {
      /* JSON inválido/truncado — cai no resgate abaixo */
    }
    if (!arr.length) arr = salvageMeals(text);
    if (!arr.length) {
      return Response.json({ error: "Não consegui montar o cardápio agora. Tente de novo." }, { status: 502 });
    }

    const nextNum = parseInt(nextCode.replace(/[^0-9]/g, ""), 10) || 1;
    const meals = arr.map((m, i) => ({
      meal_code: typeof m.meal_code === "string" && m.meal_code ? m.meal_code : `R${nextNum + i}`,
      titulo: String(m.titulo ?? "Refeição"),
      descricao: String(m.descricao ?? ""),
      kcal: r(Number(m.kcal)),
      protein_g: r(Number(m.protein_g)),
      carb_g: r(Number(m.carb_g)),
      fat_g: r(Number(m.fat_g)),
      justificativa: String(m.justificativa ?? ""),
    }));
    const totals = meals.reduce(
      (a, m) => ({
        kcal: a.kcal + m.kcal,
        protein_g: a.protein_g + m.protein_g,
        carb_g: a.carb_g + m.carb_g,
        fat_g: a.fat_g + m.fat_g,
      }),
      { kcal: 0, protein_g: 0, carb_g: 0, fat_g: 0 }
    );
    return Response.json({ meals, totals, resumo });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Falha ao gerar o plano.";
    return Response.json({ error: msg }, { status: 502 });
  }
}
