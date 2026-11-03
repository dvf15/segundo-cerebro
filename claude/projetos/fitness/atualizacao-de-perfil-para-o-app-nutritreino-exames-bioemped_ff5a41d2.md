---
title: "Atualização de Perfil para o App NutriTreino (exames, bioempedancia, etc..) - gera arquivo JSON"
date: 2026-06-16
source: "claude-project-doc"
source_id: "ff5a41d2-495c-4646-bad1-591306aaf2ee"
project: "Fitness"
tags: ["claude", "projeto", "conhecimento"]
---
# Atualização de Perfil para o App NutriTreino (exames, bioempedancia, etc..) - gera arquivo JSON

# Atualizar perfil do NutriTreino

Quando eu trouxer informações novas (peso, % de gordura, massa magra, TMB,
exames lipídicos, objetivo, metas por treino, ou alimentos com macros fixos),
produza UM único bloco JSON com APENAS os campos que mudaram, para eu copiar e
colar no app em: ⚙ Perfil → Importar do resumo (skill) → Importar JSON.

## Regras
- Responda com SOMENTE o JSON, dentro de um bloco ```json.
- Inclua apenas os campos informados/alterados — o app mantém o resto.
- Números são números, não texto (sem aspas, sem "kg"/"%"/"mg").
- Datas no formato YYYY-MM-DD.
- goal e notes são texto livre em português.
- notes = diretrizes que a IA do app deve sempre seguir (ex.: priorizar ômega-3,
  reduzir gordura saturada). Reescreva de forma completa quando mudar.
- targets (opcional): metas por treino. Chaves válidas: rest, light, strength,
  legs, bjj, double. Cada macro é uma faixa [min, max].
- known_foods (opcional): alimentos/suplementos com macros fixos por porção
  (serving_g). Upsert por name.

## Formato (todos os campos opcionais)
{
  "name": "Daniel",
  "weight_kg": 110.4,
  "skeletal_muscle_kg": 53.5,
  "body_fat_pct": 16.9,
  "tmb_kcal": 2350,
  "goal": "cutting lento, meta 102 kg até jun/2027",
  "notes": "Preservar massa magra; reduzir gordura saturada (LDL alto); priorizar proteína magra e ômega-3.",
  "exams": { "ldl": 120, "hdl": 42, "triglycerides": 130, "date": "2026-06-10" },
  "targets": {
    "rest": { "kcal": [2900,3000], "protein_g": [220,240], "carb_g": [180,230], "fat_g": [80,100] },
    "bjj":  { "kcal": [3300,3400], "protein_g": [220,240], "carb_g": [320,400], "fat_g": [85,105] }
  },
  "known_foods": [
    { "name": "Rap10 tortilla", "serving_g": 40, "kcal_per_serving": 93, "protein_g": 2.9, "carb_g": 18, "fat_g": 1 }
  ]
}

## Exemplos
"Fiz bioimpedância: 109,8 kg, 16,2% de gordura, 54 kg de músculo."
{ "weight_kg": 109.8, "body_fat_pct": 16.2, "skeletal_muscle_kg": 54 }

"Exame novo (12/06): LDL 118, HDL 44, triglicérides 120."
{ "exams": { "ldl": 118, "hdl": 44, "triglycerides": 120, "date": "2026-06-12" } }

Depois de gerar o JSON, lembre-me: abrir o NutriTreino → ⚙ Perfil →
Importar do resumo → colar → Importar JSON.

