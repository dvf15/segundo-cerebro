import React, { useState, useMemo } from "react";

// ============================================================
// SISTEMA DE CALIBRAÇÃO — Força · Cardio · Longevidade (+ BJJ opcional)
// Baseado em: Attia (Outlive), Galpin, McGill, Morton, Helms, Schoenfeld
// ============================================================

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
* { -webkit-font-smoothing: antialiased; }
`;

// ---------- LÓGICA DE CÁLCULO ----------

function calculate(inputs) {
  const {
    age, weight, height, sex, bodyFat,
    goal, phase, practicesBJJ, bjjDays, strengthDays, cardioDays, level,
    injuries
  } = inputs;

  const w = Number(weight) || 0;
  const a = Number(age) || 0;
  const effectiveBjj = practicesBJJ ? bjjDays : 0;

  // --- Cenário semanal ---
  // S = sem BJJ (força + cardio). A/B/C = com BJJ por volume.
  let scenario;
  if (!practicesBJJ) scenario = "S";
  else if (effectiveBjj >= 4) scenario = "A";
  else if (effectiveBjj >= 2) scenario = "B";
  else scenario = "C";

  // --- TDEE / Calorias ---
  const totalTraining = effectiveBjj + strengthDays + cardioDays;
  const tdeeFactor = totalTraining >= 6 ? 34 : totalTraining >= 4 ? 32 : totalTraining >= 2 ? 30 : 28;
  const maintenance = Math.round(w * tdeeFactor);

  let calLow, calHigh;
  if (phase === "cutting") { calLow = maintenance - 500; calHigh = maintenance - 300; }
  else if (phase === "bulking") { calLow = maintenance + 200; calHigh = maintenance + 400; }
  else { calLow = maintenance - 100; calHigh = maintenance + 100; }

  // --- Proteína ---
  let pLow = 1.6, pHigh = 2.2;
  if (phase === "cutting") { pLow = 2.0; pHigh = 2.4; }
  if (a >= 50) { pLow = Math.max(pLow, 2.0); pHigh = Math.max(pHigh, 2.2); }
  const proteinLow = Math.round(pLow * w);
  const proteinHigh = Math.round(pHigh * w);

  // --- Carbo ---
  const carbsHardLow = Math.round(3 * w);
  const carbsHardHigh = Math.round(practicesBJJ ? 6 * w : 5 * w);
  const carbsLightLow = Math.round(2 * w);
  const carbsLightHigh = Math.round(4 * w);

  // --- Gordura ---
  const fatLow = Math.round(0.8 * w);
  const fatHigh = Math.round(1.2 * w);

  // --- Força ---
  let strengthSets, strengthFocus;
  if (scenario === "A") {
    strengthSets = "6–10 séries/sessão (volume baixo, alta qualidade)";
    strengthFocus = "2x/semana, full body ou upper/lower. Prioridade: BJJ.";
  } else if (scenario === "B") {
    strengthSets = "8–14 séries/sessão";
    strengthFocus = "2–3x/semana, full body. Mais espaço para hipertrofia.";
  } else if (scenario === "C") {
    strengthSets = "10–14 séries/sessão";
    strengthFocus = "2x/semana, full body. Mínimo viável p/ manter massa.";
  } else {
    strengthSets = "12–18 séries/sessão";
    strengthFocus = `${strengthDays}x/semana. Sem BJJ, força + cardio são os pilares.`;
  }

  // --- Cardio ---
  const z2Sessions = scenario === "S" ? Math.max(2, cardioDays - 1) : scenario === "A" ? 1 : scenario === "B" ? 2 : 1;
  const vo2Sessions = 1;

  // --- Prehab ---
  const prehab = [];
  prehab.push({ area: "Base diária", items: ["McGill Big 3 (curl-up, side plank, bird-dog) — 5–10 min", "CARs de pescoço, ombro, quadril — 3–5 min"] });
  if (injuries.lombar) prehab.push({ area: "Lombar", items: ["McGill Big 3 diário, sem falhar", "Dead bug 2x8 por lado", "Evitar flexão repetida sob carga", "Hinge bem ensinado antes de carregar"] });
  if (injuries.joelho) prehab.push({ area: "Joelho", items: ["ATG split squat 2x8/perna", "Tibialis raises 3x20", "Nordic curl excêntrico 2x5", "Step-down lento (5s descida) 2x8"] });
  if (injuries.ombro) prehab.push({ area: "Ombro", items: ["Scapular pull-up / dip 3x8", "Sleeper stretch 30s/lado", "Band pull-aparts 2x15", "Dead hang 60s/dia acumulado"] });
  if (injuries.cervical) prehab.push({ area: "Cervical", items: ["Isometrias 4 direções, 3x30s, 2–3x/sem", "Evitar wrestler's bridge sem base", "Reforço de trapézio"] });
  if (practicesBJJ) {
    prehab.push({ area: "BJJ sempre", items: ["Pescoço isométrico 3x30s (4 direções) 2x/sem", "Dead hang 60s/dia", "Tindão pince ou rice bucket 1x/sem"] });
  } else {
    prehab.push({ area: "Manutenção geral", items: ["Dead hang 30–60s/dia (saúde do ombro + grip)", "Carry pesado 1x/sem (farmer's carry)", "Mobilidade de tornozelo e quadril 5min/dia"] });
  }

  // --- Flags ---
  const flags = [];
  if (a >= 45 && phase === "cutting" && effectiveBjj >= 4 && strengthDays >= 2) {
    flags.push({ level: "alto", text: "Risco de RED-S: 45+ + cutting + volume alto. Deficit suave (–300 kcal max), proteína no topo (2.2–2.4 g/kg), monitore libido/sono/FC. Mountjoy et al., Br J Sports Med 2018." });
  }
  if (totalTraining >= 7) {
    flags.push({ level: "alto", text: "≥7 sessões/sem. Recuperação será o gargalo. Reserve 1 dia off completo e considere cortar cardio antes de força/BJJ." });
  }
  if (effectiveBjj >= 4 && cardioDays >= 2 && phase === "cutting") {
    flags.push({ level: "médio", text: "BJJ pesado + cardio + cutting empilhados. Interferência (Wilson 2012) + queda de performance. Considere cortar VO2max em cutting." });
  }
  if (phase === "bulking" && goal === "longevity") {
    flags.push({ level: "médio", text: "Bulk + foco em longevidade conflitam parcialmente. Surplus modesto (+200 kcal) preserva marcadores metabólicos." });
  }
  if (a >= 50 && strengthDays < 2) {
    flags.push({ level: "alto", text: "50+ com menos de 2x força/sem é insuficiente contra sarcopenia (Volpi 2004). Mínimo: 2x/sem com cargas progressivas." });
  }
  if (practicesBJJ && bjjDays === 0 && goal === "bjj") {
    flags.push({ level: "alto", text: "Sem BJJ na semana mas objetivo é BJJ. Especificidade ganha. Mínimo 2x/sem." });
  }
  if (!practicesBJJ && goal === "bjj") {
    flags.push({ level: "alto", text: "Objetivo BJJ mas BJJ desligado. Reative a opção ou troque o objetivo principal." });
  }
  if (injuries.lombar && strengthDays >= 2) {
    flags.push({ level: "médio", text: "Histórico de lombar + força ≥2x. Hinge só com técnica validada. Em dúvida, kettlebell swing ou hip thrust." });
  }
  if (a >= 40 && cardioDays === 0) {
    flags.push({ level: "médio", text: "40+ sem cardio estruturado. VO2max é o preditor isolado mais forte de mortalidade (Mandsager 2018). Mínimo: 1x Zone 2 + 1x VO2max." });
  }
  if (level === "begin" && totalTraining >= 6) {
    flags.push({ level: "alto", text: "Iniciante com volume alto. Risco de overtraining/lesão. Comece com 3–4 sessões e progrida." });
  }
  if (!practicesBJJ && strengthDays < 2 && cardioDays < 1) {
    flags.push({ level: "alto", text: "Sem BJJ + força <2x + cardio <1x = volume insuficiente p/ qualquer adaptação. Mínimo viável: 2x força + 1x cardio." });
  }

  const week = buildWeekTemplate(scenario, effectiveBjj, strengthDays, cardioDays);
  const meals = {
    train: buildMeals(w, calLow, calHigh, phase, true, practicesBJJ),
    rest: buildMeals(w, calLow, calHigh, phase, false, practicesBJJ),
  };

  return {
    scenario, maintenance, calLow, calHigh,
    proteinLow, proteinHigh,
    carbsHardLow, carbsHardHigh, carbsLightLow, carbsLightHigh,
    fatLow, fatHigh,
    strengthSets, strengthFocus,
    z2Sessions, vo2Sessions,
    prehab, flags, week, meals,
    totalTraining, effectiveBjj
  };
}

function buildWeekTemplate(scenario, bjjDays, strengthDays, cardioDays) {
  let plan;
  if (scenario === "A") {
    plan = {
      SEG: ["Zone 2 30–45min (opc.)", "BJJ"],
      TER: ["Força A (lower)"],
      QUA: ["BJJ"],
      QUI: ["Força B (upper)", "BJJ técnico leve"],
      SEX: ["VO2max 4x4 (Norwegian)"],
      "SÁB": ["BJJ (rolamento duro)"],
      DOM: ["Mobilidade + caminhada"],
    };
  } else if (scenario === "B") {
    plan = {
      SEG: ["Força A (full body)"],
      TER: ["BJJ"],
      QUA: ["Zone 2 45–60min"],
      QUI: ["BJJ"],
      SEX: ["Força B (full body)"],
      "SÁB": ["BJJ ou VO2max"],
      DOM: ["Mobilidade"],
    };
  } else if (scenario === "C") {
    plan = {
      SEG: ["Força A (full body, 40–50min)"],
      TER: ["BJJ"],
      QUA: ["Zone 2 longo (60–75min)"],
      QUI: ["Força B (full body, 40–50min)"],
      SEX: ["BJJ"],
      "SÁB": ["Mobilidade + caminhada"],
      DOM: ["Off"],
    };
  } else {
    // S — sem BJJ
    plan = {
      SEG: ["Força A (lower)", "Zone 2 30min (opc.)"],
      TER: ["Zone 2 45–60min"],
      QUA: ["Força B (upper)"],
      QUI: ["VO2max 4x4 (Norwegian)"],
      SEX: ["Força C (full body) ou Lower 2"],
      "SÁB": ["Zone 2 longo (60–75min) ou esporte recreativo"],
      DOM: ["Mobilidade + caminhada"],
    };
  }
  return plan;
}

// --------- CARDÁPIO ---------

function buildMeals(weight, calLow, calHigh, phase, isTrainDay, practicesBJJ) {
  const w = Number(weight) || 80;
  // Base de referência: 80kg, manutenção ~2800 kcal/dia, ~160g proteína
  // Escala calorias por meta calórica do dia
  const target = isTrainDay ? calHigh : (calLow + (calHigh - calLow) / 3);
  const baseTrain = 3200;  // kcal de referência do template de treino
  const baseRest = 2600;
  const scaleRef = isTrainDay ? baseTrain : baseRest;
  const scale = target / scaleRef;

  // Em cutting, puxa carbos pra baixo um pouco mais
  const carbAdj = phase === "cutting" ? 0.85 : phase === "bulking" ? 1.1 : 1.0;

  const r = (n) => Math.max(5, Math.round((n * scale) / 5) * 5);
  const rC = (n) => Math.max(5, Math.round((n * scale * carbAdj) / 5) * 5);
  const rPiece = (n) => Math.max(1, Math.round(n * scale));

  if (isTrainDay) {
    return [
      {
        name: "R1 · Café da manhã",
        items: [
          { n: "Aveia em flocos", q: rC(60), u: "g" },
          { n: "Leite (vaca ou vegetal sem açúcar)", q: r(250), u: "ml" },
          { n: "Banana", q: rPiece(1), u: "und" },
          { n: "Ovos inteiros", q: rPiece(3), u: "und" },
          { n: "Pasta de amendoim integral", q: r(15), u: "g" },
        ],
        approx: `~${Math.round(700 * scale)} kcal · ~45g P · ~${Math.round(80 * scale * carbAdj)}g C · ~22g G`
      },
      {
        name: "R2 · Almoço",
        items: [
          { n: "Frango / peixe / carne magra grelhada", q: r(180), u: "g" },
          { n: "Arroz (integral ou branco) cozido", q: rC(150), u: "g" },
          { n: "Feijão cozido (opcional, troca arroz)", q: rC(80), u: "g" },
          { n: "Salada de folhas + tomate + pepino", q: 1, u: "prato" },
          { n: "Azeite extra-virgem", q: r(15), u: "ml" },
        ],
        approx: `~${Math.round(900 * scale)} kcal · ~55g P · ~${Math.round(90 * scale * carbAdj)}g C · ~25g G`
      },
      {
        name: "R3 · Pré ou pós-treino",
        items: [
          { n: "Whey protein", q: r(30), u: "g" },
          { n: "Banana ou fruta da estação", q: rPiece(1), u: "und" },
          { n: "Aveia ou tapioca", q: rC(40), u: "g" },
          { n: "Pasta de amendoim ou castanhas", q: r(15), u: "g" },
        ],
        approx: `~${Math.round(500 * scale)} kcal · ~32g P · ~${Math.round(60 * scale * carbAdj)}g C · ~12g G`
      },
      {
        name: "R4 · Jantar",
        items: [
          { n: "Peixe (salmão, tilápia) ou frango", q: r(200), u: "g" },
          { n: "Batata doce ou mandioca cozida", q: rC(200), u: "g" },
          { n: "Brócolis ou vegetais verdes refogados", q: r(150), u: "g" },
          { n: "Azeite extra-virgem", q: r(10), u: "ml" },
        ],
        approx: `~${Math.round(800 * scale)} kcal · ~50g P · ~${Math.round(55 * scale * carbAdj)}g C · ~18g G`
      },
    ];
  } else {
    return [
      {
        name: "R1 · Café da manhã",
        items: [
          { n: "Ovos inteiros mexidos", q: rPiece(4), u: "und" },
          { n: "Pão integral 100%", q: rPiece(2), u: "fatias" },
          { n: "Abacate", q: r(60), u: "g" },
          { n: "Iogurte grego natural", q: r(150), u: "g" },
        ],
        approx: `~${Math.round(550 * scale)} kcal · ~40g P · ~${Math.round(35 * scale * carbAdj)}g C · ~25g G`
      },
      {
        name: "R2 · Almoço",
        items: [
          { n: "Frango / peixe / carne magra grelhada", q: r(180), u: "g" },
          { n: "Arroz cozido (porção menor)", q: rC(80), u: "g" },
          { n: "Salada generosa com folhas e legumes", q: 1, u: "prato grande" },
          { n: "Azeite extra-virgem", q: r(15), u: "ml" },
        ],
        approx: `~${Math.round(700 * scale)} kcal · ~50g P · ~${Math.round(35 * scale * carbAdj)}g C · ~22g G`
      },
      {
        name: "R3 · Lanche",
        items: [
          { n: "Iogurte grego natural", q: r(200), u: "g" },
          { n: "Castanhas (mix)", q: r(30), u: "g" },
          { n: "Fruta da estação", q: rPiece(1), u: "und" },
        ],
        approx: `~${Math.round(350 * scale)} kcal · ~22g P · ~${Math.round(25 * scale * carbAdj)}g C · ~18g G`
      },
      {
        name: "R4 · Jantar",
        items: [
          { n: "Peixe ou omelete (4–5 ovos)", q: r(180), u: "g" },
          { n: "Vegetais variados refogados", q: r(200), u: "g" },
          { n: "Batata doce ou abóbora", q: rC(100), u: "g" },
          { n: "Azeite extra-virgem", q: r(10), u: "ml" },
        ],
        approx: `~${Math.round(600 * scale)} kcal · ~40g P · ~${Math.round(30 * scale * carbAdj)}g C · ~15g G`
      },
    ];
  }
}

// ---------- SYSTEM PROMPT ----------

function buildSystemPrompt(inputs, calc) {
  const goalMap = {
    bjj: "Performance no jiu-jitsu (gás, força funcional, prevenção de lesão)",
    hyper: "Hipertrofia e força progressiva",
    longevity: "Longevidade saudável (VO2max alto, força preservada, marcadores metabólicos)",
    recomp: "Recomposição corporal (perder gordura, manter/ganhar massa magra)"
  };
  const phaseMap = { cutting: "Cutting (deficit controlado)", maintain: "Manutenção", bulking: "Bulking suave" };
  const levelMap = { begin: "Iniciante", inter: "Intermediário", adv: "Avançado" };
  const injuryList = Object.entries(inputs.injuries).filter(([,v]) => v).map(([k]) => k).join(", ") || "nenhuma reportada";

  const bjjLine = inputs.practicesBJJ
    ? `- BJJ: ${inputs.bjjDays}x/semana (prioridade — musculação serve ao tatame)`
    : `- BJJ / esportes de combate: não pratica atualmente`;

  const priorityLine = inputs.practicesBJJ
    ? "BJJ é prioridade. Periodize tudo em torno dele."
    : "Força + cardio são os pilares. Não tente substituir BJJ específico se eu mudar de objetivo — me avise se for o caso.";

  return `Você é meu coach de performance física focado em ${inputs.practicesBJJ ? "jiu-jitsu, musculação e longevidade" : "força, condicionamento e longevidade"}.

REFERENCIAL CIENTÍFICO (em ordem de prioridade)
1. Peter Attia (Outlive, Medicine 3.0): Zone 2, VO2max, força + estabilidade, proteína, sono.
2. Andy Galpin / Andrew Huberman: periodização, recuperação, protocolos neurais, sono.
3. Stuart McGill: saúde da coluna e prevenção de lesão.
4. Literatura peer-reviewed sempre que possível.

NÃO use Gary Brecka, biohacks sem evidência, ou claims de marketing disfarçados de ciência. Se eu pedir algo nessa linha, me avise.

MEU PERFIL
- Idade: ${inputs.age} anos
- Peso: ${inputs.weight} kg | Altura: ${inputs.height} cm | Sexo: ${inputs.sex === "M" ? "Masculino" : "Feminino"}${inputs.bodyFat ? ` | ~${inputs.bodyFat}% gordura` : ""}
- Nível: ${levelMap[inputs.level]}
- Lesões/limitações: ${injuryList}

OBJETIVO ATIVO
- Foco principal: ${goalMap[inputs.goal]}
- Fase nutricional: ${phaseMap[inputs.phase]}

DISPONIBILIDADE SEMANAL
${bjjLine}
- Força: ${inputs.strengthDays}x/semana
- Cardio estruturado: ${inputs.cardioDays}x/semana

ALVOS CALIBRADOS
- Manutenção calórica: ~${calc.maintenance} kcal/dia
- Meta calórica atual: ${calc.calLow}–${calc.calHigh} kcal/dia
- Proteína: ${calc.proteinLow}–${calc.proteinHigh} g/dia (${(calc.proteinLow/inputs.weight).toFixed(1)}–${(calc.proteinHigh/inputs.weight).toFixed(1)} g/kg)
- Carbo dia treino duro: ${calc.carbsHardLow}–${calc.carbsHardHigh} g
- Carbo dia leve: ${calc.carbsLightLow}–${calc.carbsLightHigh} g
- Gordura: ${calc.fatLow}–${calc.fatHigh} g
- Template semanal: Cenário ${calc.scenario}

COMO RESPONDER
- Objetivo, sem floreio. Direto ao ponto.
- Cite a fonte quando der um número, estudo ou claim específico.
- Se a evidência for fraca, diga "evidência fraca" ou "opinião de X".
- Ofereça quando fizer sentido 2 versões: ótima e mínima viável.
- ${priorityLine}
- Não é aconselhamento médico. Para sintomas, lesão ou exames fora da faixa, recomende consulta presencial.

CONFIANÇA
Ao final de respostas técnicas, classifique sua confiança 1–10. Abaixo de 7, sinalize por quê.`;
}

// ---------- UI ----------

const S = {
  page: { fontFamily: "'IBM Plex Sans', sans-serif", background: "#f4efe6", color: "#1a1817", minHeight: "100vh", paddingBottom: 60 },
  display: { fontFamily: "'Fraunces', serif", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 },
  mono: { fontFamily: "'IBM Plex Mono', monospace" },
  accent: "#a63a1e",
  border: "#1a1817",
  paper: "#fbf7ee",
  dim: "#6a6560",
};

function SectionHeader({ num, title }) {
  return (
    <div className="flex items-baseline gap-3 mb-4 pb-2" style={{ borderBottom: `1px solid ${S.border}` }}>
      <span style={{ ...S.mono, fontSize: 11, color: S.dim, letterSpacing: "0.1em" }}>{num}</span>
      <h2 style={{ ...S.display, fontSize: 22 }}>{title}</h2>
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <div className="mb-4">
      <label className="block mb-1.5" style={{ ...S.mono, fontSize: 10, letterSpacing: "0.12em", color: S.dim, textTransform: "uppercase" }}>{label}</label>
      {children}
      {hint && <div className="mt-1" style={{ ...S.mono, fontSize: 10, color: S.dim }}>{hint}</div>}
    </div>
  );
}

const inputStyle = () => ({
  width: "100%", padding: "10px 12px", background: S.paper, border: `1px solid ${S.border}`,
  fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, color: S.border, outline: "none", borderRadius: 0
});

function Radio({ value, current, onChange, label }) {
  const active = current === value;
  return (
    <button type="button" onClick={() => onChange(value)} style={{
      ...S.mono, fontSize: 12, padding: "8px 12px",
      border: `1px solid ${S.border}`,
      background: active ? S.border : "transparent",
      color: active ? S.paper : S.border,
      cursor: "pointer", letterSpacing: "0.04em",
      marginRight: 6, marginBottom: 6, textTransform: "uppercase"
    }}>{label}</button>
  );
}

function Check({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 mb-2" style={{ cursor: "pointer" }} onClick={() => onChange(!checked)}>
      <span style={{ width: 18, height: 18, border: `1.5px solid ${S.border}`, background: checked ? S.border : "transparent", display: "inline-block", position: "relative" }}>
        {checked && <span style={{ position: "absolute", top: 1, left: 4, color: S.paper, fontSize: 13 }}>✓</span>}
      </span>
      <span style={{ ...S.mono, fontSize: 13 }}>{label}</span>
    </label>
  );
}

function Toggle({ checked, onChange, label, sub }) {
  return (
    <div className="mb-4 p-3" style={{ background: checked ? `${S.accent}10` : S.paper, border: `1px solid ${checked ? S.accent : S.border}`, cursor: "pointer" }} onClick={() => onChange(!checked)}>
      <div className="flex items-center justify-between">
        <div>
          <div style={{ ...S.mono, fontSize: 11, letterSpacing: "0.12em", color: S.dim, textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
          {sub && <div style={{ fontSize: 12, color: S.dim }}>{sub}</div>}
        </div>
        <span style={{
          width: 44, height: 24, borderRadius: 12,
          background: checked ? S.accent : "#ccc",
          position: "relative", transition: "all 0.2s", flexShrink: 0
        }}>
          <span style={{
            position: "absolute", top: 2, left: checked ? 22 : 2,
            width: 20, height: 20, borderRadius: "50%",
            background: "#fff", transition: "all 0.2s"
          }} />
        </span>
      </div>
    </div>
  );
}

function OutputBlock({ label, children }) {
  return (
    <div className="mb-6 p-4" style={{ background: S.paper, border: `1px solid ${S.border}` }}>
      <div className="mb-3" style={{ ...S.mono, fontSize: 10, letterSpacing: "0.15em", color: S.accent, textTransform: "uppercase", fontWeight: 600 }}>◆ {label}</div>
      {children}
    </div>
  );
}

function DataRow({ k, v, accent }) {
  return (
    <div className="flex justify-between items-baseline py-1.5" style={{ borderBottom: `1px dashed ${S.dim}40` }}>
      <span style={{ ...S.mono, fontSize: 12, color: S.dim }}>{k}</span>
      <span style={{ ...S.mono, fontSize: 14, color: accent ? S.accent : S.border, fontWeight: 600 }}>{v}</span>
    </div>
  );
}

// ---------- MAIN ----------

export default function CalibrationSystem() {
  const [inputs, setInputs] = useState({
    age: 35, weight: 80, height: 175, sex: "M", bodyFat: "",
    goal: "longevity", phase: "maintain",
    practicesBJJ: true,
    bjjDays: 3, strengthDays: 2, cardioDays: 1,
    level: "inter",
    injuries: { lombar: false, joelho: false, ombro: false, cervical: false }
  });

  const update = (k, v) => setInputs(p => ({ ...p, [k]: v }));
  const updateInjury = (k, v) => setInputs(p => ({ ...p, injuries: { ...p.injuries, [k]: v } }));

  const calc = useMemo(() => calculate(inputs), [inputs]);
  const sysPrompt = useMemo(() => buildSystemPrompt(inputs, calc), [inputs, calc]);

  const [copied, setCopied] = useState(false);
  const [mealDay, setMealDay] = useState("train");
  const copyPrompt = () => {
    navigator.clipboard.writeText(sysPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={S.page}>
      <style>{FONTS}</style>

      {/* HEADER */}
      <div className="px-5 pt-8 pb-6" style={{ borderBottom: `2px solid ${S.border}` }}>
        <div style={{ ...S.mono, fontSize: 10, letterSpacing: "0.2em", color: S.dim, marginBottom: 8 }}>FIELD MANUAL · CALIBRATION SYSTEM v1.1</div>
        <h1 style={{ ...S.display, fontSize: 38, lineHeight: 0.95, marginBottom: 8 }}>
          Força · Cardio · <em style={{ fontStyle: "italic", color: S.accent }}>Longevidade</em>
        </h1>
        <p style={{ fontSize: 13, lineHeight: 1.5, maxWidth: 540, color: S.dim }}>
          Sistema reutilizável baseado em Attia (Outlive), Galpin/Huberman e McGill. BJJ opcional. Entre seus dados → recebe plano calibrado, alvos nutricionais, semana sugerida, cardápio do dia e um <em>system prompt</em> pronto para usar como coach AI.
        </p>
      </div>

      <div className="px-5 py-6" style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* === INPUTS === */}
        <SectionHeader num="01 / 05" title="Perfil" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Idade"><input style={inputStyle()} type="number" value={inputs.age} onChange={e => update("age", Number(e.target.value))} /></Field>
          <Field label="Peso (kg)"><input style={inputStyle()} type="number" value={inputs.weight} onChange={e => update("weight", Number(e.target.value))} /></Field>
          <Field label="Altura (cm)"><input style={inputStyle()} type="number" value={inputs.height} onChange={e => update("height", Number(e.target.value))} /></Field>
          <Field label="% gordura (opc.)" hint="se souber"><input style={inputStyle()} type="number" value={inputs.bodyFat} onChange={e => update("bodyFat", e.target.value)} /></Field>
        </div>
        <Field label="Sexo">
          <Radio current={inputs.sex} value="M" onChange={v => update("sex", v)} label="Masc." />
          <Radio current={inputs.sex} value="F" onChange={v => update("sex", v)} label="Fem." />
        </Field>
        <Field label="Nível de experiência">
          <Radio current={inputs.level} value="begin" onChange={v => update("level", v)} label="Iniciante" />
          <Radio current={inputs.level} value="inter" onChange={v => update("level", v)} label="Intermediário" />
          <Radio current={inputs.level} value="adv" onChange={v => update("level", v)} label="Avançado" />
        </Field>

        <div className="mt-8"><SectionHeader num="02 / 05" title="Objetivo" /></div>
        <Field label="Foco principal">
          <Radio current={inputs.goal} value="bjj" onChange={v => update("goal", v)} label="BJJ" />
          <Radio current={inputs.goal} value="hyper" onChange={v => update("goal", v)} label="Hipertrofia" />
          <Radio current={inputs.goal} value="longevity" onChange={v => update("goal", v)} label="Longevidade" />
          <Radio current={inputs.goal} value="recomp" onChange={v => update("goal", v)} label="Recomp" />
        </Field>
        <Field label="Fase nutricional">
          <Radio current={inputs.phase} value="cutting" onChange={v => update("phase", v)} label="Cutting" />
          <Radio current={inputs.phase} value="maintain" onChange={v => update("phase", v)} label="Manutenção" />
          <Radio current={inputs.phase} value="bulking" onChange={v => update("phase", v)} label="Bulking" />
        </Field>

        <div className="mt-8"><SectionHeader num="03 / 05" title="Modalidades" /></div>

        <Toggle
          checked={inputs.practicesBJJ}
          onChange={v => update("practicesBJJ", v)}
          label="Pratica BJJ ou esporte de combate?"
          sub={inputs.practicesBJJ ? "Sim — periodização vai priorizar o tatame" : "Não — plano focado em força + cardio + longevidade"}
        />

        {inputs.practicesBJJ && (
          <Field label={`BJJ — ${inputs.bjjDays}x/semana`}>
            <input type="range" min="0" max="6" value={inputs.bjjDays} onChange={e => update("bjjDays", Number(e.target.value))} style={{ width: "100%", accentColor: S.accent }} />
          </Field>
        )}
        <Field label={`Força/musculação — ${inputs.strengthDays}x/semana`}>
          <input type="range" min="0" max="5" value={inputs.strengthDays} onChange={e => update("strengthDays", Number(e.target.value))} style={{ width: "100%", accentColor: S.accent }} />
        </Field>
        <Field label={`Cardio estruturado — ${inputs.cardioDays}x/semana`} hint="Zone 2 + VO2max somados">
          <input type="range" min="0" max="4" value={inputs.cardioDays} onChange={e => update("cardioDays", Number(e.target.value))} style={{ width: "100%", accentColor: S.accent }} />
        </Field>

        <div className="mt-8"><SectionHeader num="04 / 05" title="Limitações" /></div>
        <Field label="Lesões / áreas sensíveis" hint="ajusta prehab">
          <Check checked={inputs.injuries.lombar} onChange={v => updateInjury("lombar", v)} label="Lombar / coluna" />
          <Check checked={inputs.injuries.joelho} onChange={v => updateInjury("joelho", v)} label="Joelho" />
          <Check checked={inputs.injuries.ombro} onChange={v => updateInjury("ombro", v)} label="Ombro" />
          <Check checked={inputs.injuries.cervical} onChange={v => updateInjury("cervical", v)} label="Cervical / pescoço" />
        </Field>

        {/* === OUTPUTS === */}
        <div style={{ borderTop: `2px solid ${S.border}`, paddingTop: 32, marginTop: 32 }}>
          <div className="mb-6">
            <div style={{ ...S.mono, fontSize: 10, letterSpacing: "0.2em", color: S.accent, marginBottom: 4 }}>OUTPUT CALIBRADO</div>
            <h2 style={{ ...S.display, fontSize: 32 }}>Seu plano</h2>
          </div>

          <OutputBlock label="Diagnóstico">
            <DataRow k="Cenário semanal" v={`${calc.scenario}${calc.scenario === "S" ? " (sem BJJ)" : ""}`} accent />
            <DataRow k="Sessões totais/sem" v={`${calc.totalTraining}`} />
            <DataRow k="Manutenção (TDEE)" v={`~${calc.maintenance} kcal`} />
            <DataRow k="Meta calórica" v={`${calc.calLow}–${calc.calHigh} kcal`} accent />
          </OutputBlock>

          <OutputBlock label={`Semana sugerida · Cenário ${calc.scenario}`}>
            {Object.entries(calc.week).map(([day, items]) => (
              <div key={day} className="flex items-start gap-3 py-2" style={{ borderBottom: `1px dashed ${S.dim}40` }}>
                <span style={{ ...S.mono, fontSize: 11, width: 38, color: S.dim, letterSpacing: "0.08em" }}>{day}</span>
                <div className="flex-1">
                  {items.map((it, i) => <div key={i} style={{ ...S.mono, fontSize: 12.5, marginBottom: 2 }}>{it}</div>)}
                </div>
              </div>
            ))}
            <div className="mt-3 pt-2" style={{ ...S.mono, fontSize: 10, color: S.dim, lineHeight: 1.5 }}>
              {inputs.practicesBJJ
                ? "Nunca força pesada de pernas no dia anterior a competição BJJ. Rolamento duro conta como HIIT. Não empilhar VO2max + BJJ duro + força pesada em 24h."
                : "Separar VO2max de força pesada por ≥24h. Zone 2 pode coexistir no mesmo dia que força (manhã + noite, ou em sequência leve). Deload a cada 4–6 semanas."}
            </div>
          </OutputBlock>

          <OutputBlock label="Nutrição · alvos diários">
            <DataRow k="Proteína" v={`${calc.proteinLow}–${calc.proteinHigh} g/dia`} accent />
            <DataRow k="↳ por refeição (4/dia)" v={`${Math.round(calc.proteinLow/4)}–${Math.round(calc.proteinHigh/4)} g`} />
            <DataRow k="Carbo · dia treino" v={`${calc.carbsHardLow}–${calc.carbsHardHigh} g`} />
            <DataRow k="Carbo · dia leve" v={`${calc.carbsLightLow}–${calc.carbsLightHigh} g`} />
            <DataRow k="Gordura" v={`${calc.fatLow}–${calc.fatHigh} g`} />
            <div className="mt-3" style={{ ...S.mono, fontSize: 10.5, color: S.dim, lineHeight: 1.55 }}>
              Proteína · Morton 2018 (1.6–2.2 g/kg) · Helms 2014 (2.0–2.4 em cutting) · Phillips 2016 (2.0+ p/ 50+).
              Distribuir em 3–5 refeições (Areta 2013).
            </div>
          </OutputBlock>

          {/* CARDÁPIO */}
          <OutputBlock label="Cardápio sugerido · escalado p/ seu peso e fase">
            <div className="mb-3 flex gap-2">
              <button onClick={() => setMealDay("train")} style={{
                ...S.mono, fontSize: 11, padding: "8px 14px",
                border: `1px solid ${S.border}`,
                background: mealDay === "train" ? S.border : "transparent",
                color: mealDay === "train" ? S.paper : S.border,
                cursor: "pointer", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 600
              }}>Dia treino</button>
              <button onClick={() => setMealDay("rest")} style={{
                ...S.mono, fontSize: 11, padding: "8px 14px",
                border: `1px solid ${S.border}`,
                background: mealDay === "rest" ? S.border : "transparent",
                color: mealDay === "rest" ? S.paper : S.border,
                cursor: "pointer", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 600
              }}>Dia leve / descanso</button>
            </div>

            {calc.meals[mealDay].map((meal, i) => (
              <div key={i} className="mb-4 pb-3" style={{ borderBottom: `1px dashed ${S.dim}40` }}>
                <div style={{ ...S.display, fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{meal.name}</div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    {meal.items.map((it, j) => (
                      <tr key={j}>
                        <td style={{ ...S.mono, fontSize: 12, padding: "3px 0", color: S.border }}>· {it.n}</td>
                        <td style={{ ...S.mono, fontSize: 12, padding: "3px 0", textAlign: "right", color: S.accent, fontWeight: 600, whiteSpace: "nowrap" }}>{it.q} {it.u}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ ...S.mono, fontSize: 10.5, color: S.dim, marginTop: 6, letterSpacing: "0.02em" }}>{meal.approx}</div>
              </div>
            ))}

            <div style={{ ...S.mono, fontSize: 10, color: S.dim, lineHeight: 1.55, marginTop: 8 }}>
              Gramaturas escaladas pelo seu peso e meta calórica. Macros são estimativas (±15%). Use como ponto de partida — não como prescrição rígida. Substituições válidas: frango ↔ peixe ↔ carne magra ↔ ovos; arroz ↔ batata doce ↔ mandioca ↔ quinoa; iogurte grego ↔ queijo cottage; pasta de amendoim ↔ castanhas ↔ abacate.
            </div>
          </OutputBlock>

          <OutputBlock label="Força · programação">
            <DataRow k="Frequência" v={`${inputs.strengthDays}x/semana`} />
            <DataRow k="Volume" v={calc.strengthSets} />
            <div className="mt-2" style={{ ...S.mono, fontSize: 12, lineHeight: 1.55 }}>{calc.strengthFocus}</div>
            <div className="mt-3" style={{ ...S.mono, fontSize: 11, color: S.dim, lineHeight: 1.55 }}>
              Padrões não-negociáveis: agachamento, hinge (deadlift/RDL), empurrar e puxar horizontal, puxar vertical, carry.
              Acessórios: dead hang (60s/dia), Turkish get-up, pescoço isométrico. RIR 1–3.
            </div>
          </OutputBlock>

          <OutputBlock label="Cardio · framework Attia">
            <DataRow k="Zone 2" v={`${calc.z2Sessions}x · 30–60 min`} />
            <DataRow k="VO2max" v={`${calc.vo2Sessions}x · Norwegian 4×4`} accent />
            <div className="mt-2" style={{ ...S.mono, fontSize: 11.5, lineHeight: 1.55, color: S.dim }}>
              Zone 2: conversação difícil mas possível (~70% FCmax). Bike preferida.<br/>
              VO2max 4×4 (Helgerud 2007): 4min @ 85–95% FCmax + 3min recuperação, 4x.
            </div>
          </OutputBlock>

          <OutputBlock label="Prehab · McGill + área específica">
            {calc.prehab.map((p, i) => (
              <div key={i} className="mb-3">
                <div style={{ ...S.mono, fontSize: 11, color: S.accent, marginBottom: 4, letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 600 }}>{p.area}</div>
                {p.items.map((it, j) => (
                  <div key={j} style={{ ...S.mono, fontSize: 12, marginBottom: 2, paddingLeft: 10 }}>· {it}</div>
                ))}
              </div>
            ))}
          </OutputBlock>

          {calc.flags.length > 0 && (
            <OutputBlock label="⚠ Sinais de alerta personalizados">
              {calc.flags.map((f, i) => (
                <div key={i} className="mb-3 p-3" style={{ background: f.level === "alto" ? "#a63a1e15" : "#f5e6d3", border: `1px solid ${f.level === "alto" ? S.accent : "#c89a5c"}` }}>
                  <div style={{ ...S.mono, fontSize: 10, color: f.level === "alto" ? S.accent : "#8a6a3a", letterSpacing: "0.1em", marginBottom: 4, fontWeight: 600 }}>
                    {f.level === "alto" ? "■ ALTO" : "□ MÉDIO"}
                  </div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>{f.text}</div>
                </div>
              ))}
            </OutputBlock>
          )}

          <OutputBlock label="System prompt · copie p/ seu coach AI">
            <div style={{ ...S.mono, fontSize: 11, color: S.dim, lineHeight: 1.5, marginBottom: 10 }}>
              Cole em Claude, ChatGPT ou qualquer LLM como instrução de sistema. Reflete seus dados + princípios.
            </div>
            <button onClick={copyPrompt} style={{
              ...S.mono, padding: "10px 16px",
              background: copied ? S.accent : S.border, color: S.paper,
              border: "none", fontSize: 12, letterSpacing: "0.1em",
              cursor: "pointer", marginBottom: 12, textTransform: "uppercase", fontWeight: 600
            }}>{copied ? "✓ Copiado" : "Copiar prompt"}</button>
            <pre style={{
              ...S.mono, fontSize: 10.5, lineHeight: 1.5,
              background: "#1a1817", color: "#e8e0d0",
              padding: 14, overflowX: "auto", whiteSpace: "pre-wrap",
              maxHeight: 320, overflowY: "auto"
            }}>{sysPrompt}</pre>
          </OutputBlock>

          <div className="mt-8 pt-6" style={{ borderTop: `1px solid ${S.border}`, ...S.mono, fontSize: 10, color: S.dim, lineHeight: 1.6 }}>
            <div style={{ fontWeight: 600, color: S.border, marginBottom: 4 }}>AVISO</div>
            Não é aconselhamento médico. Para sintomas, lesão ou exames fora da faixa, procure médico do esporte ou fisioterapeuta.<br/>
            Volumes e gramaturas variam por indivíduo, idade biológica, histórico e nível. Ajustar pela resposta real, não pelo papel.<br/><br/>
            <span style={{ color: S.accent }}>Confiança geral do framework: 8/10.</span> Cardápio é ponto de partida (erro ±15%), não prescrição.
          </div>
        </div>
      </div>
    </div>
  );
}
