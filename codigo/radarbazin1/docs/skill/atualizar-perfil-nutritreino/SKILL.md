---
name: atualizar-perfil-nutritreino
description: >-
  Use sempre que o usuário informar dados novos de bioimpedância, exames de
  sangue, objetivo, metas por treino ou alimentos/suplementos com macros fixos.
  Gera um JSON no formato exato que o app NutriTreino importa (campo
  "Importar do resumo"), para o usuário colar e atualizar o app de uma vez.
---

# Atualizar perfil do NutriTreino

Quando o usuário trouxer informações novas (peso, % de gordura, massa magra, TMB,
exames lipídicos, objetivo, metas por treino, ou alimentos com macros fixos),
produza **um único bloco JSON** com **apenas os campos que mudaram** e entregue
para ele copiar e colar no app, em **⚙ Perfil → Importar do resumo (skill) →
Importar JSON**.

## Regras

- Responda com **somente o JSON**, dentro de um bloco de código ```json.
- Inclua **apenas os campos informados/alterados** — o app mantém o resto.
- Números são **números**, não texto (sem aspas, sem "kg"/"%"/"mg").
- Datas no formato **YYYY-MM-DD**.
- `goal` e `notes` são texto livre em português.
- `notes` = diretrizes que a IA do app deve sempre seguir (ex.: priorizar
  ômega-3, reduzir gordura saturada). Reescreva de forma completa quando mudar.
- `targets` (opcional): metas por tipo de treino. Chaves válidas:
  `rest`, `light` (= "Treino nível 2"), `strength`, `legs`, `hiit`, `bjj`,
  `double`. Cada macro é uma faixa `[min, max]`.
- `known_foods` (opcional): alimentos/suplementos com macros fixos, **por
  porção** (`serving_g`). Faça upsert por `name`.
- `micro_targets` (opcional): metas de micronutrientes. Chaves: `fiber_g`,
  `sodium_mg` (teto), `potassium_mg`, `calcium_mg`, `iron_mg`, `magnesium_mg`,
  `zinc_mg`, `omega3_g`, `vit_c_mg`, `vit_d_mcg`, `vit_b12_mcg`.
- `supplements` (opcional): suplementos diários — lista de
  `{ "name": "...", "micros": { ...mesmas chaves de micro_targets... } }`.

## Formato (todos os campos são opcionais)

```json
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
    "rest":     { "kcal": [2900, 3000], "protein_g": [220, 240], "carb_g": [180, 230], "fat_g": [80, 100] },
    "bjj":      { "kcal": [3300, 3400], "protein_g": [220, 240], "carb_g": [320, 400], "fat_g": [85, 105] }
  },
  "known_foods": [
    { "name": "Rap10 tortilla", "serving_g": 40, "kcal_per_serving": 93, "protein_g": 2.9, "carb_g": 18, "fat_g": 1 }
  ]
}
```

## Exemplos

**Usuário:** "Fiz bioimpedância: 109,8 kg, 16,2% de gordura, 54 kg de músculo."

```json
{ "weight_kg": 109.8, "body_fat_pct": 16.2, "skeletal_muscle_kg": 54 }
```

**Usuário:** "Exame novo (12/06): LDL 118, HDL 44, triglicérides 120."

```json
{ "exams": { "ldl": 118, "hdl": 44, "triglycerides": 120, "date": "2026-06-12" } }
```

**Usuário:** "Comecei a usar um whey novo: 32 g por dose, 130 kcal, 25 P, 3 C, 2 G."

```json
{ "known_foods": [ { "name": "Whey novo", "serving_g": 32, "kcal_per_serving": 130, "protein_g": 25, "carb_g": 3, "fat_g": 2 } ] }
```

Depois de gerar o JSON, lembre o usuário: **abrir o NutriTreino → ⚙ Perfil →
Importar do resumo → colar → Importar JSON.**
