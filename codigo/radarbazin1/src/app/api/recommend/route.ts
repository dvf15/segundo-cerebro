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
  // Estilo pedido nos botões: temperatura (quente/frio) ou sabor (salgado/doce).
  const STYLES: Record<string, string> = {
    quente:
      "QUENTE: a refeição deve ser servida quente (preparo no fogão, forno, grelha ou panela — ex.: arroz e feijão, omelete, sopa, carne grelhada, tapioca quente). Nada de pratos frios.",
    frio:
      "FRIA: a refeição deve ser consumida fria ou em temperatura ambiente, sem precisar aquecer (ex.: salada completa com proteína, iogurte, wrap frio, shake, frutas com whey, sanduíche natural).",
    salgado:
      "SALGADA: o sabor predominante deve ser salgado/umami (ex.: ovos, carnes, peixes, queijos, legumes, tortilhas, arroz e feijão). Evite doces e frutas como item principal.",
    doce:
      "DOCE: o sabor predominante deve ser doce, mas saudável e dentro das metas (ex.: iogurte com frutas e granola, shake de whey com banana, panqueca de aveia, açaí sem açúcar, pudim proteico). Sem açúcar refinado em excesso.",
  };
  const style = typeof body?.style === "string" && STYLES[body.style] ? body.style : "";
  if (!date) return Response.json({ error: "Data ausente." }, { status: 400 });

  const ctx = await buildMealContext(date, clientHour);
  const { day, profile, nextCode } = ctx;

  const intentLine = intent
    ? `O usuário pretende comer na próxima refeição: "${intent}". Use exatamente isso como base da sugestão — ajuste apenas as quantidades e os acompanhamentos para encaixar nas metas do dia (macros e micros). Se essa escolha destoar muito das metas, ofereça a melhor versão possível dela e avise no campo justificativa.`
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
${style ? `ESTILO OBRIGATÓRIO desta sugestão — ${STYLES[style]} Respeite o estilo E as metas do dia ao mesmo tempo.` : ""}
Histórico recente de refeições:
${ctx.historyText}

${BRAZIL_CUISINE}
Sugira UMA próxima refeição (${nextCode}) realista, parecida com o que ele já come (use o histórico). Equilibre macros E micronutrientes ao mesmo tempo:
1) Macros: complete a proteína e o carboidrato que faltam para o treino de hoje e mantenha a gordura saturada baixa.
2) Micros: escolha alimentos que aumentem os micronutrientes mais baixos e o score micro do dia, com atenção aos ligados à imunidade (vitamina C, vitamina D, zinco, B12, ferro).
Quando macro e micro competirem, busque o melhor equilíbrio entre os dois (não otimize só macros). Ajuste o TAMANHO da refeição ao horário e ao ritmo do dia (veja o "Momento do dia" acima): mais robusta se estiver atrasado, mais leve se estiver perto do teto. Dê quantidades aproximadas e os macros estimados.

RETORNE SOMENTE JSON, sem markdown:
{"titulo":"nome curto da refeição","descricao":"itens e quantidades","kcal":number,"protein_g":number,"carb_g":number,"fat_g":number,"justificativa":"1-2 frases dizendo quais macros fecha e quais micros melhora"}`;

  const client = anthropicClient();
  try {
    const resp = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system:
        "Você é um nutricionista que recomenda a próxima refeição equilibrando os macronutrientes (metas restantes, treino) e os micronutrientes (subir o score micro do dia), usando a culinária brasileira. Seja prático e realista. Responda em português do Brasil.\n\n" +
        profile.science_ref,
      messages: [{ role: "user", content: [{ type: "text", text: userText }] }],
    });
    const text = resp.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    const obj = parseJsonLoose(text) as Record<string, unknown>;
    return Response.json({
      meal_code: nextCode,
      titulo: String(obj.titulo ?? "Próxima refeição"),
      descricao: String(obj.descricao ?? ""),
      kcal: r(Number(obj.kcal)),
      protein_g: r(Number(obj.protein_g)),
      carb_g: r(Number(obj.carb_g)),
      fat_g: r(Number(obj.fat_g)),
      justificativa: String(obj.justificativa ?? ""),
      style,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Falha ao gerar recomendação.";
    return Response.json({ error: msg }, { status: 502 });
  }
}
