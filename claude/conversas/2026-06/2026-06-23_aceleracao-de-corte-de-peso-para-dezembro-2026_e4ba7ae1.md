---
title: "Aceleração de corte de peso para dezembro/2026"
date: 2026-06-23
updated: 2026-06-23
source: "claude-chat"
source_id: "e4ba7ae1-0143-45fb-b882-5a7507f22b73"
url: "https://claude.ai/chat/e4ba7ae1-0143-45fb-b882-5a7507f22b73"
project: null
messages: 6
generated_files: 0
tags: ["claude", "conversa"]
---
# Aceleração de corte de peso para dezembro/2026

> **Resumo:** **Conversation Overview** The person is working toward a body composition goal using the NutriTreino app, which uses a JSON-based profile to configure daily caloric and macronutrient targets. Their current weight is 111 kg, with a target range of 102–104 kg. The conversation focused on recalibrating the timeline and associated nutritional targets in their NutriTreino JSON profile. The person initially requested acceleration of the cutting timeline from June 2027 to December 2026, which Claude calculated would require approximately 0.35 kg/week — a 30–40% increase in deficit. Claude provided an updated JSON with reduced rest-day calories (2,700–2,850 kcal) to drive that faster rate. The person then reconsidered, prioritizing quality of life over speed, and requested adjustment to March 2027 instead. Claude recalculated to approximately 0.22 kg/week — nearly identical to the person's current observed pace of 0.21 kg/week — and revised the JSON accordingly with rest days at 2,850–2,950 kcal. The final JSON structure includes six training-type tiers: `rest`, `light`, `strength`, `legs`, `bjj`, and `double`, each with ranges for kcal, protein, carbohydrates, and fat. Key recurring priorities noted across both responses include maintaining Zona 2 cardio at minimum twice per week, reserving CarboLift for glycogen-dependent sessions only, sustaining protein at 2.0–2.2 g/kg/day, and monitoring for signs of excessive deficit (declining sleep quality, libido, or BJJ performance). The person practices BJJ and follows a structured strength training routine. Claude noted that the March 2027 timeline requires no significant protocol change — consistency on rest and light days is the primary lever, not adjusting training-day targets.

**Mensagens:** 6 · **Criada:** 2026-06-23 · **Atualizada:** 2026-06-23

---

## 👤 Usuário · 2026-06-23 09:27

Estou com 111 kg, tenho seguido o protocolo do app nutritreino, mas tenho sentido que o corte de peso está muito lento, a meta anterior era chegar a 102-104kg em junho/2027, refaça o arquivo json, calibrando a meta para chegar no peso em dezembro/2026

## 🤖 Claude · 2026-06-23 09:27


```
This block is not supported on your current device yet.
```

Tenho os dados necessários. Vou calcular o ritmo de perda exigido e gerar o JSON atualizado.

**Análise rápida:**
- Peso atual: ~111 kg
- Meta: 102–104 kg
- Prazo anterior: junho/2027 (~12 meses)
- Novo prazo: dezembro/2026 (~6 meses)
- Perda necessária: ~7–9 kg em 6 meses → **~0,3–0,37 kg/semana**
- Seu ritmo atual: −4,3 kg em 5 meses → ~0,21 kg/semana

Isso exige aumentar o deficit em ~30–40% sem comprometer massa magra nem performance no BJJ. Ainda dentro do range seguro (~0,5–0,75% do peso corporal/semana para atletas em cutting, Helms et al., 2014), mas vai exigir disciplina maior com calorias nas semanas de menor treino.

**Ajuste nas metas calóricas:** reduzo dias de descanso em ~200–250 kcal e mantenho dias de treino pesado para não sacrificar glicogênio.

```json
{
  "weight_kg": 111,
  "goal": "cutting moderado, meta 102–104 kg até dez/2026 (~6 meses, ~0,35 kg/semana)",
  "notes": "Deficit calibrado para ~−400 a −500 kcal/dia nos dias de descanso e leve. Dias de treino pesado (BJJ + força) mantêm calorias altas para preservar performance e massa magra. Priorizar proteína magra 2.0–2.2 g/kg. Reduzir gordura saturada (HDL limítrofe, LDL monitorado). Usar CarboLift apenas em treinos glicogênio-dependentes (força + BJJ), nunca antes de Zona 2. Piso mínimo de 2 sessões de Zona 2/semana — principal alavanca de HDL e HRV. Ferritina e creatinina em acompanhamento médico ativo.",
  "targets": {
    "rest": {
      "kcal": [2700, 2850],
      "protein_g": [220, 240],
      "carb_g": [160, 200],
      "fat_g": [75, 95]
    },
    "light": {
      "kcal": [2900, 3100],
      "protein_g": [220, 240],
      "carb_g": [200, 250],
      "fat_g": [80, 100]
    },
    "strength": {
      "kcal": [3200, 3500],
      "protein_g": [225, 245],
      "carb_g": [300, 370],
      "fat_g": [80, 100]
    },
    "legs": {
      "kcal": [3200, 3500],
      "protein_g": [225, 245],
      "carb_g": [300, 370],
      "fat_g": [80, 100]
    },
    "bjj": {
      "kcal": [3300, 3600],
      "protein_g": [225, 250],
      "carb_g": [320, 400],
      "fat_g": [85, 105]
    },
    "double": {
      "kcal": [3500, 3800],
      "protein_g": [230, 250],
      "carb_g": [350, 430],
      "fat_g": [85, 110]
    }
  }
}
```

---

**O que mudou e por quê:**

- **Rest day:** caiu de 2.950 para 2.700–2.850 kcal — esse é o maior alavanca do deficit semanal
- **Light day:** novo tier explícito entre descanso e treino pesado
- **Treinos pesados:** mantidos ou levemente reduzidos no teto — não vale sacrificar performance para acelerar corte
- **Meta no `goal`:** texto reescrito com prazo e ritmo esperado

**Próximos passos:** NutriTreino → ⚙️ Perfil → Importar do resumo → colar → Importar JSON.

---

⚠️ **Aviso importante:** acelerar o corte de 6 para 12 meses vai exigir mais consistência nos dias de descanso. Se você perceber queda de libido, sono pior, ou performance no BJJ caindo, isso é sinal de deficit excessivo — e o prazo pode precisar ser revisado. Não é fraqueza, é fisiologia.

**Confiança: 8/10** — os números são coerentes com a literatura (Helms 2014, Morton 2018), mas a taxa de perda individual varia. Monitore peso semanalmente (mesma hora, mesmo dia) e ajuste a cada 3–4 semanas conforme resposta real.

## 👤 Usuário · 2026-06-23 09:28

Ok, nao quero piorar a qualidade de vida, ajuste para março/27

## 👤 Usuário · 2026-06-23 09:29

Ok, nao quero piorar a qualidade de vida, ajuste para março/27

## 🤖 Claude · 2026-06-23 09:29


```
This block is not supported on your current device yet.
```

Boa decisão. Março/2027 = ~9 meses, ritmo de ~0,22–0,25 kg/semana. Mais próximo do que você já vinha fazendo, com margem para ondular sem estresse.

```json
{
  "goal": "cutting lento, meta 102–104 kg até mar/2027 (~9 meses, ~0,25 kg/semana)",
  "notes": "Deficit conservador de ~250–350 kcal/dia nos dias de descanso. Dias de treino pesado (BJJ + força) mantêm calorias altas para preservar performance e massa magra. Priorizar proteína magra 2.0–2.2 g/kg. Reduzir gordura saturada (HDL limítrofe). Usar CarboLift apenas em treinos glicogênio-dependentes (força + BJJ), nunca antes de Zona 2. Mínimo 2 sessões de Zona 2/semana — principal alavanca de HDL e HRV. Ferritina e creatinina em acompanhamento médico ativo. Sinais de deficit excessivo (sono pior, libido, queda de performance no tatame) = sinal para subir calorias, não ignorar.",
  "targets": {
    "rest": {
      "kcal": [2800, 2950],
      "protein_g": [220, 240],
      "carb_g": [170, 215],
      "fat_g": [78, 98]
    },
    "light": {
      "kcal": [3000, 3150],
      "protein_g": [220, 240],
      "carb_g": [210, 260],
      "fat_g": [80, 100]
    },
    "strength": {
      "kcal": [3250, 3500],
      "protein_g": [225, 245],
      "carb_g": [300, 370],
      "fat_g": [82, 102]
    },
    "legs": {
      "kcal": [3250, 3500],
      "protein_g": [225, 245],
      "carb_g": [300, 370],
      "fat_g": [82, 102]
    },
    "bjj": {
      "kcal": [3300, 3550],
      "protein_g": [225, 248],
      "carb_g": [320, 400],
      "fat_g": [85, 105]
    },
    "double": {
      "kcal": [3500, 3750],
      "protein_g": [230, 250],
      "carb_g": [350, 430],
      "fat_g": [85, 108]
    }
  }
}
```

Mudanças vs. versão dez/2026: rest day +100 kcal, light day +100 kcal. Treinos mantidos — o deficit necessário é pequeno o suficiente pra não precisar comprimir o lado do treino.

NutriTreino → ⚙️ Perfil → Importar do resumo → colar → Importar JSON.

**Confiança: 8/10** — ritmo alinhado com Helms et al. (2014) para cutting em atletas treinados. O único fator que não controlo é variabilidade individual de adesão e NEAT.

## 🤖 Claude · 2026-06-23 09:29


```
This block is not supported on your current device yet.
```

Faz sentido — março/2027 é ~9 meses, ritmo mais sustentável.

**Conta rápida:**
- 111 kg → 102–104 kg = ~7–9 kg em 9 meses
- ~0,20–0,25 kg/semana — praticamente idêntico ao seu ritmo atual (0,21 kg/semana)
- Deficit de apenas ~200–300 kcal/dia nos dias de descanso já sustenta isso

Ou seja: **o protocolo atual funciona, o problema provavelmente não é o target calórico — é consistência nos dias de folga e nos dias de menor treino.** Ajuste mínimo necessário no JSON.

```json
{
  "goal": "cutting lento e sustentável, meta 102–104 kg até mar/2027 (~9 meses, ~0,22 kg/semana). Prioridade: preservar massa magra, performance no BJJ e qualidade de vida.",
  "notes": "Deficit leve (~250–350 kcal/dia) nos dias de descanso e leve. Dias de treino pesado (BJJ + força + double) mantêm calorias altas — sem comprometer recuperação, hormônios ou sono. Proteína 2.0–2.2 g/kg/dia. Reduzir gordura saturada sistematicamente (HDL limítrofe). CarboLift apenas em treinos glicogênio-dependentes, nunca antes de Zona 2. Zona 2 mínimo 2x/semana — principal alavanca de HDL, HRV e gordura visceral. Ferritina e creatinina em acompanhamento médico ativo. Sinal de alerta de deficit excessivo: libido caindo, sono piorando, performance no tatame em queda — se ocorrer, revisar metas calóricas.",
  "targets": {
    "rest": {
      "kcal": [2850, 2950],
      "protein_g": [220, 240],
      "carb_g": [170, 210],
      "fat_g": [78, 95]
    },
    "light": {
      "kcal": [3000, 3150],
      "protein_g": [220, 240],
      "carb_g": [210, 260],
      "fat_g": [80, 100]
    },
    "strength": {
      "kcal": [3300, 3500],
      "protein_g": [225, 245],
      "carb_g": [300, 370],
      "fat_g": [80, 100]
    },
    "legs": {
      "kcal": [3300, 3500],
      "protein_g": [225, 245],
      "carb_g": [300, 370],
      "fat_g": [80, 100]
    },
    "bjj": {
      "kcal": [3300, 3600],
      "protein_g": [225, 250],
      "carb_g": [320, 400],
      "fat_g": [85, 105]
    },
    "double": {
      "kcal": [3500, 3800],
      "protein_g": [230, 250],
      "carb_g": [350, 430],
      "fat_g": [85, 110]
    }
  }
}
```

---

O `rest` subiu levemente vs. a proposta de dez/26 — 2.850–2.950 ao invés de 2.700–2.850. Isso é o suficiente pra manter o ritmo atual sem apertar. Se em 6–8 semanas o peso não estiver se movendo, o primeiro ajuste é fechar os dias de descanso 150 kcal, não os dias de treino.

**NutriTreino → ⚙️ Perfil → Importar do resumo → colar → Importar JSON.**

Confiança: 8/10 — cálculo de deficit é sólido; a incerteza é variação individual de TDEE, que só o acompanhamento semanal vai calibrar.
