---
title: "Tratamento para contusão e agendamento de medicamentos"
date: 2026-09-12
updated: 2026-09-13
source: "claude-chat"
source_id: "16ee1076-dc57-478b-afa6-ab98f235eb92"
url: "https://claude.ai/chat/16ee1076-dc57-478b-afa6-ab98f235eb92"
project: null
messages: 12
generated_files: 0
tags: ["claude", "conversa"]
---
# Tratamento para contusão e agendamento de medicamentos

> **Resumo:** **Conversation Overview** Daniel is working on a structured fitness and nutrition system using what he calls a "NutriTreino" app that accepts JSON configuration files with tiers (rest, light, strength, legs, bjj, double), micronutrient targets, supplement stacks, and alert rules. The conversation centered on updating this JSON config and establishing a recovery protocol following a muscle injury (tennis leg — partial high-grade tear of the medial gastrocnemius myotendinous junction with 1.4 cm retraction and hematoma, confirmed by imaging). He had already taken two prescribed medications earlier that day and asked Claude to create reminders for additional medications without fixed schedules. Claude attempted to use a reminder creation tool but the operation failed due to permissions. The conversation then evolved into a detailed clinical and nutritional discussion covering the PEACE & LOVE rehabilitation framework (Dubois & Esculier, BJSM 2020), return-to-sport criteria, cardiovascular monitoring given recent discontinuation of an antihypertensive by his physician Dr. Juliana, and the interaction risk of a COX-2 inhibitor (Arcoxia) without the previous antihypertensive buffer. Daniel's blood pressure trend data from the prior two weeks was analyzed, showing a ~10 mmHg rise across both components before the new medication was introduced, with sodium averaging 2,758 mg/day (38% above target) and potassium averaging 2,985 mg/day (below target). Claude produced a chart of the nightly blood pressure readings across this period. Daniel's NutriTreino JSON was updated twice across the conversation: first to reduce calories for full rest, then recalibrated upward after Daniel clarified he wants to maintain fat loss momentum without sacrificing tissue repair. The final JSON reflects a 10–12% deficit with protein fixed at 235–250 g across all tiers (distributed across 5 meals including a 40 g pre-sleep dose), hardcoded sodium ceiling of 2,000 mg, potassium floor of 4,000 mg with a Na/K ratio alert at 0.60, omega-3 target raised to 3.5–4.0 g, gelatina/collagen at 15 g plus 50 mg vitamin C 60 minutes before physiotherapy sessions, creatine at 5 g/day maintained throughout immobilization, CarboLift and PeptiStrong suspended, and all legs/bjj/double tiers marked inactive with the label "SUSPENSO - lesao." Active medications (Arcoxia through 18/09, Mitrul at 18h through 18/09, Mounjaro ongoing) and the discontinued antihypertensive are documented in a `medicacao_ativa` block. A `monitoramento` block specifies twice-daily blood pressure checks until 19/09, a 3-day average alert threshold, immediate contact threshold, and a weight trend rule triggering a 150 kcal upward adjustment if weekly average loss exceeds 0.25 kg over 14 days. Expected fat loss pace is 0.12–0.18 kg/week. Claude detailed the full Phase 1 (Protection/PEACE, days 0–7) protocol including heel lift instructions for both feet, compression stocking specs (20–30 mmHg, below-knee), elevation positioning requirements (above heart level, not chair-elevated), permitted movements (ankle pumping, gentle isometrics from day 3–4 only if pain-free, unilateral training of the unaffected leg for cross-education, upper body seated/supine from days 3–5), and a detailed contraindication list (stretching, ice, local massage or myofascial release, heat in first 3–4 days, terminal dorsiflexion, "testing" the injury). Claude flagged the PEACE framework's recommendation to avoid anti-inflammatories as having weak human evidence and instructed Daniel not to stop prescribed medication unilaterally, but to raise the question with the orthopedist. DVT warning signs were listed as requiring immediate emergency care. Daniel's physiotherapy (10 sessions already prescribed) and return-to-sport criteria (25+ unilateral calf raises pain-free, <10% force asymmetry) were referenced. Key clinicians mentioned: Dr. Juliana (physician managing cardiovascular monitoring and antihypertensive decisions) and Dr. Fernando (orthopedist). Daniel was explicitly instructed to notify Dr. Juliana about the COX-2

**Mensagens:** 12 · **Criada:** 2026-09-12 · **Atualizada:** 2026-09-13

---

## 👤 Usuário · 2026-09-12 21:00

Analise a monha contusao e me passe o melhor tratamento, ja tomei a dipirona e p arcoxia as 15:15, crie um alarme pra me avisar quando devo tomar os remédios que nao estao definidos a partir da dor

- 📎 IMG_2080.jpeg
- 📎 IMG_2077.jpeg
- 📎 IMG_2078.jpeg
- 📎 IMG_2079.jpeg

## 🤖 Claude · 2026-09-12 21:01


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Não consegui criar os alarmes: o acesso aos Lembretes está desativado ou foi recusado no app do Claude. Se liberar, eu crio de novo. Enquanto isso, os horários:

⏰ **Medicação fixa (não depende da dor)**
- **Mitrul 15 mg (ciclobenzaprina):** hoje às 18h e todo dia às 18h até 18/09 (7 doses). Dá sonolência — não dirigir depois.
- **Arcoxia 90 mg:** próxima dose amanhã 13/09 às 15:15, depois todo dia até 18/09 (total 7 doses).
- Dipirona (6/6h) e Tylex (8/8h) só se dor — sem alarme.

📌 **O que você tem**
Tennis leg: rotura parcial de alto grau da junção miotendínea da cabeça medial do gastrocnêmio, retração de 1,4 cm, com hematoma. É a lesão clássica de "chute no chão" em grappler/corredor 40+. Não é ruptura completa, não é tendão de Aquiles — bom prognóstico, mas a retração de 1,4 cm coloca na faixa mais lenta de recuperação.

🎯 **Tratamento — o que a evidência apoia**
- **Semana 0–1:** protocolo PEACE & LOVE (Dubois & Esculier, BJSM 2020): proteção, elevação, compressão (meia elástica), carga conforme tolerância com muleta se mancar. Salto de 1–2 cm no calçado dos dois pés reduz tensão no gastrocnêmio. Sem gelo prolongado nem alongamento — alongar músculo rompido é o erro nº 1.
- **Semana 1–3:** fisio (as 10 sessões já estão pedidas) com panturrilha isométrica → excêntrica lenta sentado, depois em pé; bike sem carga quando sem dor.
- **Semana 3–6:** carga progressiva, elevação de panturrilha unilateral, pliometria leve. Retorno ao BJJ quando: 25+ elevações unilaterais sem dor e assimetria <10% (critério clínico usual; evidência de nível de opinião de especialista).
- **Prazo realista:** 4–8 semanas para gastrocnêmio; com retração de 1,4 cm e hematoma, conte 6–8 (Dixon, Curr Sports Med Rep 2009; Bryan Dixon 2009 relata retorno em 3–6 semanas para lesões menores). Retorno precoce = re-rotura, que é o cenário que vira crônico.

⚠️ **Três alertas**
1. **Hematoma + imobilidade = risco de TVP.** Dor na panturrilha que muda de padrão, inchaço que sobe, calor ou pele avermelhada: pronto-socorro, não espera.
2. **Arcoxia é AINE COX-2 e sobe pressão** — em 7 dias é aceitável, mas você está com MAPA alterado e valsartana. Meça PA em casa esses dias e avise a Dra. Juliana. Se subir consistentemente, pergunte ao ortopedista sobre trocar por dipirona/paracetamol só. PEACE & LOVE inclusive recomenda evitar AINE nos primeiros dias por prejudicar reparo tecidual — evidência moderada; a receita é do médico, só levante a questão.
3. **Tylex tem codeína**: constipação, sonolência, e somado ao Mitrul à noite deixa você bem apagado. Use só se dor forte real.

🏋️ **Treino**
- BJJ e pernas: zero até liberação da fisio. Regra das 48h fica suspensa.
- Superiores sentado/deitado a partir de 3–5 dias sem dor em repouso (supino, remada, puxada). Evita ficar em pé com carga.
- Zona 2: some por 2 semanas; depois bike leve. Mantém proteína alta (não é hora de cortar — 2,2 g/kg ajuda na reparação).
- Aviso: a perda de massa magra que você já vinha vendo vai acelerar se ficar 6 semanas sem estímulo. Vale considerar pausar o déficit e ir para manutenção nesse período.

Confiança: **7/10.** O que rebaixa: prazo de retorno é estimativa de faixa ampla, evidência de critérios de retorno é opinião de especialista, e não sei o quanto de dor/edema você tem agora. Isso não substitui a conduta do ortopedista.

## 👤 Usuário · 2026-09-12 21:09

Esqueci de avisar a dra juliana tirou o remedio para pressao, minha pressão vem controlada sem remedio, segue

- 📎 nutritreino-2026-09-12.csv (csv)

```
DIARIO (macros + micros)
data,treino,peso_kg,kcal,proteina_g,carbo_g,gordura_g,meta_kcal,score_micro,Fibra,Sódio,Potássio,Cálcio,Ferro,Magnésio,Zinco,Ômega-3,Vit. C,Vit. D,Vit. B12
2026-06-16,rest,,2161,178,142,92,2900,27,0,0,0,100,0,260,3,2.2,167,4000,970
2026-06-17,bjj,,3266,201,363,100,3450,27,0,0,0,100,0,260,3,2.2,167,4000,970
2026-06-18,light,,2251,225,197,52,3075,27,0,0,0,100,0,260,3,2.2,167,4000,970
2026-06-19,strength,,3627,252,325,132,3400,27,0,0,0,100,0,260,3,2.2,167,4000,970
2026-06-20,double,110.5,3449,236,381,90,3650,27,0,0,0,100,0,260,3,2.2,167,4000,970
2026-06-21,rest,,2734,196,216,118,2900,62,12,1170,2065,423,9,443,10,2.6,209,4008,972
2026-06-22,legs,,3112,254,270,96,3400,85,31.3,2927,4211,1108,16,616,16,6.6,219,4428,978
2026-06-23,hiit,,3274,295,315,80,3275,95,39.5,2525,5220,1202,13,634,19,6,487,4064,980
2026-06-24,bjj,,3108,228,226,124,3450,61,13.8,3740,3200,595,17,466,21,2.9,209,4176,981
2026-06-25,rest,,3277,232,178,164,2900,65,24,3660,4150,556,24,511,26,3.3,262,4106,985
2026-06-26,strength,,3315,244,358,90,3400,68,41.7,3644,4751,1128,19,669,19,5.6,308,4128,979
2026-06-27,double,109.7,3351,228,331,105,3650,92,30,2035,4075,849,15,559,16,8.5,307,4480,979
2026-06-28,rest,,3444,265,281,118,2900,55,20.3,4117,3580,1367,14,511,19,2.9,293,4122,979
2026-06-29,legs,,2903,226,298,72,3400,91,25,2146,3780,947,15,572,18,2.6,223,4108,979
2026-06-30,hiit,,2879,217,316,74,3275,100,35.5,2219,4640,1067,15,643,13,3.3,580,4104,976
2026-07-01,rest,,3149,238,261,110,2900,65,22.5,3700,3030,1080,12,527,14,3.1,253,4226,976
2026-07-02,bjj,,3189,215,223,136,3450,58,14.5,3950,2820,1210,13,495,19,2.9,304,4132,977
2026-07-03,strength,,2617,208,215,93,3400,69,14.5,2715,2170,925,8,470,13,5.7,179,4068,975
2026-07-04,double,109.1,3346,263,241,139,3650,60,10,3445,2640,1099,14,467,20,3.1,189,4272,982
2026-07-05,legs,,3275,248,330,96,3400,89,38.1,2765,4950,1058,15,602,16,6.7,383,4676,980
2026-07-06,strength,,2727,201,231,98,3400,66,13,3334,2560,1035,12,466,18,2.7,203,4188,977
2026-07-07,rest,,2441,182,197,84,2900,55,7.3,2445,2010,813,6,418,13,5.1,188,4488,978
2026-07-08,rest,,2257,166,238,65,2900,64,12,1785,3005,790,7,456,9,2.9,329,4316,976
2026-07-09,rest,,2080,135,178,84,2900,59,10,2850,1720,665,11,397,12,2.6,191,4136,975
2026-07-10,rest,,2436,202,189,82,2900,75,17,2671,2590,1120,9,472,14,2.7,331,4160,975
2026-07-11,strength,109.2,3061,188,328,110,3400,86,28.1,2873,3832,1019,11,844,19,2.8,305,4108,976
2026-07-12,legs,,2969,204,250,117,3400,74,19.5,3260,2660,895,13,478,16,5.4,218,4144,977
2026-07-13,rest,,1931,134,213,52,2900,73,20.6,2170,2480,560,9,454,11,2.5,198,4028,974
2026-07-14,rest,,2390,108,237,98,2900,61,11,2800,1740,730,9,387,12,2.7,189,4140,975
2026-07-15,rest,,2307,201,204,72,2900,58,9,3364,2790,713,10,490,13,4.5,225,4588,979
2026-07-16,rest,,2315,209,218,55,2900,74,16.5,1695,3462,755,10,800,18,4.9,303,4528,979
2026-07-17,strength,,3218,228,262,126,3400,70,15.2,3230,3350,758,14,498,19,2.8,201,4140,977
2026-07-18,strength,109.5,2600,187,234,84,3400,78,19.2,2575,2980,790,10,512,12,7.3,228,4592,981
2026-07-19,light,,3862,226,360,159,3125,44,20,4810,3406,2552,15,538,19,2.8,322,4148,978
2026-07-20,legs,,3171,218,282,113,3400,61,19,3860,3040,1335,14,483,20,4.4,207,4340,980
2026-07-21,rest,,2271,142,203,87,2900,67,13.3,2029,2710,525,12,439,17,2.8,231,4140,979
2026-07-22,rest,,2838,142,262,115,2900,69,18,3480,3190,805,11,474,14,3,334,4188,977
2026-07-23,rest,,3041,188,276,122,2900,59,15.5,3850,2535,845,11,476,11,4.6,241,4216,975
2026-07-24,strength,,2774,202,213,111,3400,58,9,3695,2770,1006,10,488,14,10.3,185,5432,985
2026-07-25,double,108.7,3374,215,248,157,3650,66,29,3660,2550,1400,14,512,20,7.5,199,4128,977
2026-07-26,legs,,3680,264,229,181,3400,45,13.9,4510,3110,1466,21,466,27,3,246,4092,985
2026-07-27,strength,,1887,160,202,40,3400,62,12.1,1588,2288,372,9,595,12,2.7,224,4036,972
2026-07-28,hiit,,3073,160,286,124,3275,65,14,3205,2180,553,14,438,15,2.6,231,4156,977
2026-07-29,rest,,2371,170,169,98,2900,82,21,2390,2720,860,11,454,16,4.4,255,4228,977
2026-07-30,rest,,2052,125,142,98,2900,55,7,2391,2242,671,8,425,10,5.4,199,4672,979
2026-07-31,strength,,3658,205,375,134,3400,42,17.5,5490,2405,1915,11,468,17,2.9,239,4174,977
2026-08-01,double,107.5,2992,161,318,106,3650,41,11,4850,1940,1140,10,411,12,2.9,210,4056,976
2026-08-02,rest,,2834,209,306,71,2900,87,26.5,2329,4170,772,17,597,17,2.9,381,4112,977
2026-08-03,legs,,3240,228,312,106,3400,55,21.3,4155,3685,1279,15,538,17,3.3,385,4128,980
2026-08-04,rest,,2552,173,235,92,2900,79,20.1,2695,3042,699,11,494,15,2.6,256,4068,976
2026-08-05,bjj,,3177,234,266,116,3450,82,27,3020,3894,1222,17,665,17,5.7,297,4316,980
2026-08-06,rest,,3005,213,215,135,2900,52,16.2,4210,3165,1645,14,554,18,2.9,239,4196,976
2026-08-07,strength_hiit,,3559,232,311,141,3450,81,25.2,3076,3403,1905,12,595,16,3.5,327,4216,976
2026-08-08,double,,3427,247,320,110,3650,74,17.4,2986,3340,630,17,479,29,3.1,262,4052,983
2026-08-09,legs,109.1,3551,248,256,157,3400,51,20.5,4300,3310,1645,17,491,21,6.3,221,4136,981
2026-08-10,strength,109.2,2629,239,219,74,3400,72,16,2856,2880,887,11,479,13,3.4,342,4124,979
2026-08-11,rest,109.4,2495,124,156,150,2900,50,6.5,3070,1660,378,10,378,19,2.7,196,4064,977
2026-08-12,rest,,2570,142,196,120,2900,62,11.6,2982,2600,623,14,445,16,3.3,243,4160,981
2026-08-13,rest,107.7,2730,153,230,110,2900,61,11,2910,2044,656,12,562,16,2.7,201,4124,976
2026-08-14,strength,108.2,3143,232,305,95,3400,62,10.8,3400,3070,1165,9,466,13,4.4,185,4332,980
2026-08-15,strength,108.4,3355,246,359,86,3500,79,28.5,3170,3510,1095,13,576,14,2.6,283,4038,975
2026-08-16,rest,,2822,222,180,136,2900,84,23,2905,4020,943,17,518,23,3.2,396,4244,979
2026-08-17,strength,109.7,2892,215,240,93,3400,90,24.8,2450,3650,850,14,535,14,2.9,287,4164,978
2026-08-18,rest,109,2444,182,261,63,2900,63,10,1840,2800,1010,9,619,14,4.8,242,4532,980
2026-08-19,rest,109,3282,210,302,122,2900,78,27.8,3170,3450,810,20,541,25,2.9,216,4060,979
2026-08-20,hiit,109.4,3350,193,324,136,3275,54,16.5,4140,3218,1085,14,480,18,2.9,278,4052,976
2026-08-21,legs,109,2788,197,296,79,3400,78,18.4,2801,3480,970,9,619,11,4.9,380,4532,979
2026-08-22,double,110,3677,224,304,163,3650,61,10.5,3680,2670,1099,15,456,22,3.2,213,4164,981
2026-08-23,light,108.5,4075,180,333,190,3175,42,13.5,6705,3120,977,14,547,18,3,262,4052,974
2026-08-24,strength,109.1,3038,253,235,107,3400,72,15.5,2660,3000,870,14,764,18,2.8,236,4104,976
2026-08-25,rest,109.5,2565,187,251,71,2900,64,12.6,3110,3032,570,12,679,19,4.2,241,4324,979
2026-08-26,rest,109,3169,183,241,150,2900,68,13.5,3105,3200,1230,9,484,19,2.9,240,4164,978
2026-08-27,rest,,2026,159,166,70,3000,67,13,2000,2610,670,9,441,11,2.8,246,4288,976
2026-08-28,rest,,2453,145,147,137,2900,63,12,2920,2604,570,8,435,11,3.5,250,4404,978
2026-08-29,light,,3825,171,321,194,3075,57,21,4025,3460,895,16,476,19,3.1,350,4144,981
2026-08-30,light,,2776,189,188,137,3075,70,14,2120,3460,798,12,456,15,2.8,285,4172,978
2026-08-31,strength,108,3188,212,250,142,3400,58,18.1,3951,3380,867,18,723,18,3.1,222,4392,979
2026-09-01,rest,108.3,2469,202,269,47,2900,79,19,1869,3350,775,8,719,12,4.8,212,4464,980
2026-09-02,rest,108.7,2925,200,220,130,2900,53,5.5,2670,2400,963,13,578,19,3,193,4198,980
2026-09-03,rest,107.8,2624,221,222,72,2900,84,22.5,2795,2810,785,11,629,15,2.6,212,4028,975
2026-09-04,strength,109.1,3637,185,336,159,3400,60,17,3891,3242,1090,15,487,19,3,217,4280,980
2026-09-05,strength,108.8,3333,215,325,100,3400,80,20,2780,3150,783,15,472,19,2.8,215,4036,980
2026-09-06,legs,109.2,2789,124,298,111,3500,75,18,2680,2220,775,12,459,12,2.8,218,4104,974
2026-09-07,bjj,109,3141,254,304,79,3450,89,30,2758,3415,1256,11,536,14,2.6,330,4084,975
2026-09-08,rest,109.9,2299,189,170,80,2900,74,17.1,2246,3112,585,14,483,17,2.9,203,4240,979
2026-09-09,rest,,2086,156,173,73,2900,59,9,2285,2230,755,9,434,17,5.3,175,4544,980
2026-09-10,rest,108.2,2896,192,278,100,2900,96,28.3,2413,3780,957,11,715,20,2.8,226,4068,979
2026-09-11,strength,108.2,3502,215,291,169,3400,52,17.5,4220,2790,1285,15,740,19,3,206,4128,977
2026-09-12,double,108.2,2154,183,184,64,3650,63,11,1940,2450,785,9,455,12,2.6,202,4076,975

PESO (historico completo)
data,peso_kg
2011-03-05,123
2011-10-01,122
2012-06-01,113
2013-06-01,116
2014-06-01,119
2015-06-01,123
2016-06-01,122
2017-01-01,109
2017-06-01,110
2017-12-01,111
2018-06-01,113
2018-12-01,116
2019-06-01,127
2019-12-01,122
2020-06-01,110
2020-12-01,112
2021-06-01,117
2021-12-01,123
2022-06-01,123
2023-01-01,124
2023-08-01,121
2024-06-01,120
2025-01-01,123
2025-06-01,125
2025-09-01,124
2025-10-01,124
2025-11-01,121
2025-12-01,117.5
2026-01-01,115.5
2026-02-02,112.5
2026-02-16,112
2026-03-02,111.3
2026-03-16,111
2026-03-23,110.6
2026-03-30,110.4
2026-04-13,110.6
2026-04-20,111.2
2026-04-27,110.4
2026-05-04,110.6
2026-05-15,111.3
2026-05-22,110.7
2026-05-30,110
2026-06-06,110.5
2026-06-13,111
2026-06-20,110.5
2026-06-27,109.7
2026-07-04,109.1
2026-07-11,109.2
2026-07-18,109.5
2026-07-25,108.7
2026-08-01,107.5
2026-08-09,109.1
2026-08-10,109.2
2026-08-11,109.4
2026-08-13,107.7
2026-08-14,108.2
2026-08-15,108.4
2026-08-17,109.7
2026-08-18,109
2026-08-19,109
2026-08-20,109.4
2026-08-21,109
2026-08-22,110
2026-08-23,108.5
2026-08-24,109.1
2026-08-25,109.5
2026-08-26,109
2026-08-31,108
2026-09-01,108.3
2026-09-02,108.7
2026-09-03,107.8
2026-09-04,109.1
2026-09-05,108.8
2026-09-06,109.2
2026-09-07,109
2026-09-08,109.9
2026-09-10,108.2
2026-09-11,108.2
2026-09-12,108.2

PRESSAO ARTERIAL
data,hora,sistolica,diastolica,classificacao,observacao
2026-07-19,23:12,114,71,Normal,
2026-07-20,23:11,112,70,Normal,
2026-07-23,23:26,114,77,Normal,
2026-07-24,22:32,115,78,Normal,
2026-07-25,23:52,115,73,Normal,
2026-07-26,22:55,118,78,Normal,
2026-07-27,22:28,113,63,Normal,
2026-07-30,23:48,121,82,Atenção,
2026-07-31,23:47,123,80,Atenção,
2026-08-01,23:08,109,70,Normal,
2026-08-05,21:43,113,71,Normal,
2026-08-06,21:58,114,71,Normal,
2026-08-07,22:14,119,81,Atenção,
2026-08-08,22:15,109,65,Normal,
2026-08-09,22:32,117,75,Normal,"Noite, antes de dormir, sentado"
2026-08-10,22:27,122,79,Atenção,Noite sentado
2026-08-10,22:30,116,81,Atenção,
2026-08-13,22:47,109,64,Normal,Deitado a noite
2026-08-14,23:39,110,73,Normal,Noite sentado
2026-08-15,23:49,112,76,Normal,Noite sentado
2026-08-16,22:06,110,74,Normal,Sentado à noite
2026-08-17,23:34,116,75,Normal,Sentado a noite
2026-08-18,22:07,110,75,Normal,Sentado a noite
2026-08-19,23:01,107,72,Normal,Sentado a noite
2026-08-20,21:24,125,79,Atenção,
2026-08-21,22:47,125,82,Atenção,
2026-08-22,23:51,121,85,Alta,
2026-08-23,21:57,118,79,Normal,
2026-08-24,22:11,127,81,Atenção,
2026-08-25,22:29,120,82,Atenção,
2026-08-30,21:16,115,72,Normal,
2026-08-31,21:58,117,76,Normal,
2026-09-01,21:52,108,66,Normal,
2026-09-02,23:42,116,73,Normal,
2026-09-03,22:10,113,75,Normal,
2026-09-04,22:18,106,65,Normal,
2026-09-05,22:27,116,67,Normal,
2026-09-06,06:45,112,73,Normal,"Manha, sentado"
2026-09-06,22:22,130,81,Alta,Noite
2026-09-07,06:23,116,71,Normal,"Apos acordar, stress renata barulho"
2026-09-07,22:08,121,85,Alta,
2026-09-08,09:11,130,80,Alta,
2026-09-08,23:14,117,73,Normal,Noite deitado
2026-09-09,22:28,121,85,Alta,
2026-09-10,22:40,129,83,Atenção,
2026-09-11,22:30,120,76,Atenção,
```
- 📎 nutritreino-2026-09-12.csv

## 🤖 Claude · 2026-09-12 21:10

Isso muda a prioridade do que te falei antes. Você saiu do anti-hipertensivo **e** começou hoje um inibidor de COX-2 por 7 dias. Esses dois fatos juntos merecem atenção agora.

📈 **O que os dados mostram**

Comparando as duas últimas semanas (leituras noturnas):

| Período | Média |
|---|---|
| 30/08 – 05/09 | **113 / 71** |
| 06/09 – 11/09 | **123 / 80** |

Subiu ~10 mmHg nos dois componentes em uma semana, antes mesmo do Arcoxia. E a diastólica em 80 é exatamente o limiar de hipertensão para medida domiciliar (AHA/ACC 2017: ≥130/80 em automedida).
```
This block is not supported on your current device yet.
```

⚠️ **Por que o Arcoxia importa mais agora**

Etoricoxibe é, entre os AINEs, um dos que mais eleva PA. No programa MEDAL (Cannon et al., *Lancet* 2006, n≈34.700), a taxa de descontinuação por hipertensão foi significativamente maior com etoricoxibe do que com diclofenaco. Sem a valsartana, você não tem mais o amortecedor farmacológico.

Some a isso: dor aguda, imobilidade (perde o Zone 2, que era seu principal lever não-farmacológico) e, se usar Tylex, o estresse extra.

**Conduta prática nos próximos 7 dias:**
- Meça PA **2x/dia** (manhã ao acordar, noite sentado) até 19/09. Mesmo braço, mesma posição, 5 min sentado antes.
- Dipirona não eleva PA de forma relevante — prefira ela como analgésico de base e use o Arcoxia só enquanto houver inflamação real.
- Se a média de 3 dias passar de **135/85**, avise a Dra. Juliana antes de terminar os 7 dias. Se algum valor isolado passar de 160/100, contato imediato.
- **Avise a Dra. Juliana que você está tomando Arcoxia.** Ela te tirou da medicação há pouco — introduzir um COX-2 sem ela saber tira a validade do washout que ela está avaliando.

🧂 **Sódio e potássio — aqui está um problema concreto**

Últimos 14 dias:

| | Média | Meta | Status |
|---|---|---|---|
| Sódio | **2.758 mg** | <2.000 | 38% acima, só 2/14 dias na meta |
| Potássio | **2.985 mg** | 3.500–4.700 | abaixo em quase todos os dias |

Razão Na/K ≈ 0,92. A literatura observacional associa razão mais baixa a menor PA e menor mortalidade CV (Cook et al., *Arch Intern Med* 2009, seguimento dos ensaios TOHP). Sem medicação, esse é o lever que sobra enquanto você não treina.

Pontos fora da curva recentes: 11/09 (4.220 mg), 04/09 (3.891), 31/08 (3.951), 23/08 (6.705). O padrão de restaurante que já estava mapeado.

Ação mínima viável: subir potássio (abacate, batata-doce, feijão, banana, iogurte, folhas escuras) é mais fácil que cortar sódio, e move a razão nos dois sentidos.

🍗 **Nutrição na lesão**
- Proteína caiu em alguns dias (124 g em 06/09, 156 g em 09/09). Durante reparo tecidual, manter 2,0–2,2 g/kg (≈215–240 g) é mais importante que o déficit.
- Peso travou em 108,2 há 3 dias e a tendência está plana desde agosto. Está ok — com 6 semanas sem treino de perna, manutenção calórica é a escolha certa. Retoma o corte quando voltar ao tatame.

📌 **Resumo do que fazer hoje**
1. Mitrul 18h (já passou do horário — tome agora).
2. PA 2x/dia por 7 dias, registre.
3. Mensagem para a Dra. Juliana sobre o Arcoxia.
4. Potássio para cima, sódio para baixo — sem treino, é o que te resta.

Confiança: **7/10.** O que desconta: são leituras únicas por dia, não MAPA; não dá para separar quanto da alta é estresse da lesão, quanto é perda do exercício, quanto é a retirada da valsartana. O sinal de tendência é claro, a atribuição de causa não é. Nada aqui substitui a Dra. Juliana.

## 👤 Usuário · 2026-09-12 21:14

Me passe as orientações para eu colar no Json do nutri treino a luz do que vc passou, se possível reduza a injestao calorica dado que ficarei em repouso e preciso continuar perdendo gordura

## 🤖 Claude · 2026-09-12 21:15

Antes do JSON, um ponto honesto: déficit durante reparo tecidual atrasa a cicatrização. A literatura suporta déficit **moderado** (~15–20%) com proteína alta, não agressivo (Tipton, *Sports Med* 2015). Então dá para continuar perdendo gordura, mas em ritmo menor — não force além disso.

**Cálculo do novo gasto:** sem BJJ, pernas e Zone 2, você perde ~2.000–2.500 kcal/semana de treino, mais queda de NEAT (~100–150 kcal/dia mancando/sentado). Total ≈ **450–500 kcal/dia a menos**. Por isso o rest cai de 2.900 → 2.400.

Repurpose dos 6 tiers existentes (não criei tier novo, para não quebrar o schema):

```json
{
  "profile": {
    "nome": "Daniel",
    "peso_kg": 108.2,
    "fase": "lesao_tennis_leg_gastrocnemio_medial",
    "inicio_fase": "2026-09-12",
    "revisao_fase": "2026-10-24",
    "objetivo": "perda de gordura em deficit moderado com preservacao maxima de massa magra durante imobilizacao relativa",
    "observacao": "Rotura parcial alto grau juncao miotendinea gastrocnemio medial, retracao 1,4 cm. Sem treino de MMII, BJJ ou Zone 2 ate liberacao da fisioterapia."
  },
  "tiers": {
    "rest": {
      "label": "Repouso total",
      "kcal": { "min": 2300, "max": 2500, "alvo": 2400 },
      "proteina_g": { "min": 220, "max": 245 },
      "carbo_g": { "min": 160, "max": 200 },
      "gordura_g": { "min": 80, "max": 95 }
    },
    "light": {
      "label": "Fisioterapia / mobilidade / caminhada tolerada",
      "kcal": { "min": 2400, "max": 2600, "alvo": 2500 },
      "proteina_g": { "min": 220, "max": 245 },
      "carbo_g": { "min": 180, "max": 220 },
      "gordura_g": { "min": 80, "max": 95 }
    },
    "strength": {
      "label": "Superiores sentado/deitado (sem carga em pe)",
      "kcal": { "min": 2550, "max": 2750, "alvo": 2650 },
      "proteina_g": { "min": 230, "max": 250 },
      "carbo_g": { "min": 210, "max": 250 },
      "gordura_g": { "min": 80, "max": 95 }
    },
    "legs":   { "label": "SUSPENSO - lesao", "ativo": false, "kcal": { "alvo": 2400 } },
    "bjj":    { "label": "SUSPENSO - lesao", "ativo": false, "kcal": { "alvo": 2400 } },
    "double": { "label": "SUSPENSO - lesao", "ativo": false, "kcal": { "alvo": 2400 } }
  },
  "micronutrientes": {
    "sodio_mg":    { "max": 2000, "alerta_duro": true, "prioridade": "critica" },
    "potassio_mg": { "min": 4000, "alvo": 4700, "alerta_duro": true, "prioridade": "critica" },
    "fibra_g":     { "min": 30, "alvo": 35, "alerta_duro": true },
    "calcio_mg":   { "min": 1000 },
    "magnesio_mg": { "min": 420 },
    "zinco_mg":    { "min": 11 },
    "vit_c_mg":    { "min": 200 },
    "vit_d_ui":    { "min": 2000 },
    "omega3_g":    { "min": 2.0 }
  },
  "alertas": {
    "usar_score_composto": false,
    "alertas_por_nutriente_nomeado": true,
    "criticos": ["proteina_g", "sodio_mg", "potassio_mg", "fibra_g"],
    "regra_razao_na_k": { "ativo": true, "max": 0.60 }
  },
  "suplementos": {
    "creatina_g": 5,
    "whey": "conforme necessidade para atingir proteina",
    "carbolift": { "ativo": false, "motivo": "sem dias de treino - palatinose suspensa" },
    "supercoffee": { "ativo": true, "restricao": "1x/dia, manha - auditar impacto em PA" }
  },
  "monitoramento": {
    "pa_frequencia": "2x/dia ate 2026-09-19",
    "pa_limite_media_3d": "135/85",
    "peso_frequencia": "diario, avaliar media movel 7 dias",
    "ritmo_esperado_kg_semana": 0.15
  }
}
```

📌 **O que mudou e por quê**

| Item | Antes | Agora | Razão |
|---|---|---|---|
| Rest kcal | 2.900 | 2.400 | perda de treino + NEAT |
| Proteína | ~200–250 | 220–245 fixo todos os dias | atenuar atrofia por desuso |
| Sódio | alerta brando | teto duro 2.000 | sem anti-hipertensivo + Arcoxia |
| Potássio | sem piso | piso 4.000 | razão Na/K está em 0,92 |
| Razão Na/K | inexistente | alerta em 0,60 | move os dois lados de uma vez |
| CarboLift | dias de treino | desativado | não há dias de treino |

⚠️ **Três avisos**
1. Proteína alta **não previne** atrofia por desuso — só atenua. A evidência é clara nisso (Wall & van Loon, *Nutr Rev* 2013). O que realmente protege é reintroduzir carga o quanto antes o fisio liberar.
2. **Creatina vale manter** — 5 g/dia durante imobilização + reabilitação preservou área muscular e acelerou recuperação em ensaio controlado (Hespel et al., *J Physiol* 2001, n=22). É um dos poucos suplementos com evidência específica nesse cenário.
3. Ritmo esperado caiu para **0,15 kg/semana**. Se o peso cair mais rápido que isso, provavelmente é massa magra ou água — não comemore.

Confiança: **7/10.** Desconta: o gasto energético foi estimado, não medido — não sei sua altura nem seu MLG total exato, e o impacto do Mounjaro sobre apetite/gasto adiciona ruído. Reavalie o alvo de 2.400 após 2 semanas usando a média móvel de peso, não o cálculo. Se em 14 dias a média cair mais de 0,25 kg/semana, suba 150 kcal.

## 👤 Usuário · 2026-09-12 21:17

Ok o foco é recuperar mas nao quero perder o ritmo, faça o melhor ponto de equilíbrio possivel e me passe as recomendações do que há de melhor para recuperação e cicatrização

## 🤖 Claude · 2026-09-12 21:18

Reajustando o equilíbrio: o número anterior (2.400) era déficit de ~17%. Para cicatrização, a faixa defensável é **10–12%** — o suficiente para continuar perdendo gordura sem competir com a síntese proteica. Perde-se ritmo de balança, não se perde ritmo de projeto.

🎯 **Novo ajuste calórico**

| Tier | Antes (lesão) | Ajustado | Δ |
|---|---|---|---|
| rest | 2.400 | **2.550** | +150 |
| light (fisio) | 2.500 | **2.650** | +150 |
| strength (superiores) | 2.650 | **2.800** | +150 |

Proteína sobe para **235–250 g** (≈2,2 g/kg) em todos os dias. Expectativa realista: **0,12–0,18 kg/semana**, ou ~0,8–1,2 kg de gordura nas 6–8 semanas. Modesto, mas é o máximo que não compromete o reparo.

---

## 🧬 O que tem evidência real para cicatrização

**Nível bom (ensaios controlados em humanos):**

| Intervenção | Protocolo | Fonte |
|---|---|---|
| **Creatina** | 5 g/dia, contínuo | Hespel et al., *J Physiol* 2001 (n=22): preservou área muscular e acelerou recuperação durante imobilização + reabilitação. É o suplemento com melhor evidência específica nesse cenário. |
| **Proteína distribuída** | 0,4 g/kg × 5 tomadas (≈43 g cada), incluindo 40 g pré-sono | Moore et al., *J Gerontol* 2015; Snijders et al., *J Nutr* 2015 |
| **Ômega-3 (EPA+DHA)** | 3–4 g/dia | McGlory et al., *FASEB J* 2019: atenuou atrofia por desuso em imobilização de 2 semanas. n pequeno (n=20), só mulheres jovens — extrapolação com ressalva. Sua ingestão atual (~3 g) está no piso. |
| **Sono 7–9 h** | não negociável | Saner et al., *J Physiol* 2020: restrição de sono reduziu síntese proteica muscular. Com Mitrul à noite, você tem uma janela favorável — aproveite. |
| **Zero álcool** | durante toda a fase | Parr et al., *PLoS One* 2014: ~1,5 g/kg de álcool pós-exercício reduziu síntese proteica em ~24–37% mesmo com proteína adequada. |

**Nível moderado (marcadores, não desfecho clínico):**

- **Gelatina/colágeno + vitamina C**: 15 g de gelatina + ~50 mg vit C, 60 min antes de carga na perna. Shaw et al., *AJCN* 2017 — aumentou marcadores de síntese de colágeno. Relevante aqui porque a lesão é na **junção miotendínea**, tecido rico em colágeno. Barato e sem risco, mas o desfecho medido foi biomarcador, não tempo de cura. Vale fazer, com expectativa calibrada.
- **BFR (restrição de fluxo sanguíneo)** com carga leve no membro lesionado, quando o fisio liberar. Hughes et al., *BJSM* 2017 (revisão sistemática): preserva massa e força em reabilitação quando carga pesada é impossível. **É o melhor lever não-nutricional que você tem.** Só com supervisão do fisio — não improvise em casa.
- **Treinar a perna saudável** (cross-education): gera transferência neural para o membro imobilizado. Efeito real, magnitude modesta (~10–15% de preservação de força). Grátis. Faça.

**Evidência fraca — não invista esperança:**
- Sauna/calor para preservação muscular: os dados humanos são preliminares e em desenho pequeno. Calor local pós-fase aguda é confortável e provavelmente inofensivo, mas não é intervenção de cicatrização.
- HMB, BCAA, colágeno em cápsula para músculo, peptídeos "reparadores" (incluindo o PeptiStrong): nada disso muda desfecho com proteína já em 2,2 g/kg.
- Gelo: contraindicado aqui. Já está no PEACE & LOVE — atrapalha a fase inflamatória necessária.

---

## 🏋️ Como não perder o ritmo

**Superiores — 4x/semana, sentado/deitado.** Supino, remada máquina, puxada, desenvolvimento sentado, rosca, tríceps, abdominal. Volume igual ou até um pouco maior que o normal — você tem energia sobrando. Isso sozinho segura boa parte da sua massa magra.

**Cardio — o ponto que quase todo mundo perde.** VO₂max cai ~5–10% em 3–4 semanas de destreino. Duas saídas:
- **Ergômetro de braço** (ou remo só com braços): Zone 2, 30–40 min, 3x/semana. Como a massa muscular envolvida é menor, use PSE 4–5/10 em vez da faixa de 120–140 bpm.
- **Natação com pull buoy** (pernas amarradas, sem pernada), a partir de ~2–3 semanas se o fisio liberar. É a melhor opção — carga aeróbica alta, panturrilha zerada.

**McGill Big 3**: mantém desde já. Bird dog adaptado se a posição incomodar.

---

## 📅 Fases

| Fase | Janela | Foco |
|---|---|---|
| 1 — Proteção | dias 0–7 | PEACE & LOVE, carga conforme tolerância, superiores sentado, isometria de tornozelo indolor |
| 2 — Carga inicial | sem. 2–3 | Fisio, excêntrico lento sentado, braço-ergômetro, BFR se liberado |
| 3 — Progressão | sem. 3–6 | Elevação de panturrilha bipodal → unipodal, natação, carga em pé |
| 4 — Retorno | sem. 6–8+ | Pliometria leve, drills de BJJ sem oponente, depois rola leve |

**Critério de retorno ao tatame** (não a data): 25+ elevações unilaterais sem dor, assimetria de força <10%, salto unipodal indolor. Isso é consenso clínico, não ensaio randomizado — trate como referência, e a palavra final é do fisio.

---

⚠️ Dois lembretes que não mudam: PA 2x/dia até 19/09, e avisar a Dra. Juliana sobre o Arcoxia.

Confiança: **8/10.** Sobe em relação às respostas anteriores porque aqui as recomendações têm citação direta. Desconta: o efeito do ômega-3 vem de população que não é a sua; o dado de gelatina é biomarcador; e eu não sei seu status atual de dor/carga, o que muda o timing das fases 2 e 3.

## 👤 Usuário · 2026-09-12 22:06

Me passe o jason

## 🤖 Claude · 2026-09-12 22:07

```json
{
  "profile": {
    "nome": "Daniel",
    "peso_kg": 108.2,
    "fase": "lesao_tennis_leg_gastrocnemio_medial",
    "inicio_fase": "2026-09-12",
    "revisao_fase": "2026-10-24",
    "objetivo": "deficit moderado 10-12% com preservacao maxima de massa magra e suporte a cicatrizacao miotendinea",
    "observacao": "Rotura parcial de alto grau na juncao miotendinea do gastrocnemio medial, retracao 1,4 cm, hematoma. Sem MMII, BJJ ou Zone 2 em pe ate liberacao da fisioterapia. Sem anti-hipertensivo desde retirada pela Dra. Juliana."
  },
  "tiers": {
    "rest": {
      "label": "Repouso total",
      "kcal": { "min": 2450, "max": 2650, "alvo": 2550 },
      "proteina_g": { "min": 235, "max": 250 },
      "carbo_g": { "min": 180, "max": 220 },
      "gordura_g": { "min": 80, "max": 95 }
    },
    "light": {
      "label": "Fisioterapia / mobilidade / caminhada tolerada",
      "kcal": { "min": 2550, "max": 2750, "alvo": 2650 },
      "proteina_g": { "min": 235, "max": 250 },
      "carbo_g": { "min": 200, "max": 240 },
      "gordura_g": { "min": 80, "max": 95 }
    },
    "strength": {
      "label": "Superiores sentado/deitado + ergometro de braco",
      "kcal": { "min": 2700, "max": 2900, "alvo": 2800 },
      "proteina_g": { "min": 240, "max": 255 },
      "carbo_g": { "min": 230, "max": 270 },
      "gordura_g": { "min": 80, "max": 95 }
    },
    "legs":   { "label": "SUSPENSO - lesao", "ativo": false, "kcal": { "alvo": 2550 } },
    "bjj":    { "label": "SUSPENSO - lesao", "ativo": false, "kcal": { "alvo": 2550 } },
    "double": { "label": "SUSPENSO - lesao", "ativo": false, "kcal": { "alvo": 2550 } }
  },
  "distribuicao_proteica": {
    "tomadas_dia": 5,
    "g_por_tomada": 45,
    "pre_sono_g": 40,
    "nota": "0,4 g/kg por tomada (Moore 2015); dose pre-sono conforme Snijders 2015"
  },
  "micronutrientes": {
    "sodio_mg":    { "max": 2000, "alerta_duro": true, "prioridade": "critica" },
    "potassio_mg": { "min": 4000, "alvo": 4700, "alerta_duro": true, "prioridade": "critica" },
    "fibra_g":     { "min": 30, "alvo": 35, "alerta_duro": true },
    "proteina_g":  { "min": 235, "alerta_duro": true, "prioridade": "critica" },
    "calcio_mg":   { "min": 1000 },
    "magnesio_mg": { "min": 420 },
    "zinco_mg":    { "min": 11 },
    "ferro_mg":    { "min": 8, "nota": "ferritina persistentemente elevada - nao suplementar" },
    "vit_c_mg":    { "min": 200, "alvo": 300, "nota": "cofator de sintese de colageno" },
    "vit_d_ui":    { "min": 2000 },
    "omega3_g":    { "min": 3.0, "alvo": 4.0, "alerta_duro": true }
  },
  "alertas": {
    "usar_score_composto": false,
    "alertas_por_nutriente_nomeado": true,
    "criticos": ["proteina_g", "sodio_mg", "potassio_mg", "fibra_g", "omega3_g"],
    "regra_razao_na_k": { "ativo": true, "max": 0.60 },
    "alerta_alcool": { "ativo": true, "limite_g": 0, "motivo": "Parr 2014 - reduz sintese proteica 24-37%" }
  },
  "suplementos": {
    "creatina_g": { "dose": 5, "frequencia": "diaria", "prioridade": "alta", "fonte": "Hespel 2001 - preservacao muscular em imobilizacao" },
    "whey": { "ativo": true, "uso": "completar tomadas ate 45 g" },
    "omega3_epa_dha_g": { "dose": 3.5, "ativo": true, "fonte": "McGlory 2019 - evidencia moderada" },
    "gelatina_colageno": { "dose_g": 15, "vit_c_mg": 50, "timing": "60 min antes da sessao de fisioterapia", "fonte": "Shaw 2017 - biomarcador, nao desfecho clinico" },
    "carbolift": { "ativo": false, "motivo": "sem dias de treino intenso - palatinose suspensa" },
    "supercoffee": { "ativo": true, "restricao": "1x/dia pela manha - auditar impacto em PA" },
    "peptistrong": { "ativo": false, "motivo": "sem beneficio adicional com proteina em 2,2 g/kg" }
  },
  "monitoramento": {
    "pa_frequencia": "2x/dia ate 2026-09-19, depois 1x/dia",
    "pa_limite_media_3d": "135/85",
    "pa_contato_imediato": "160/100 isolado",
    "peso_frequencia": "diario, avaliar media movel 7 dias",
    "ritmo_esperado_kg_semana": 0.15,
    "regra_ajuste": "se media movel cair >0,25 kg/semana por 14 dias, somar 150 kcal em todos os tiers",
    "sono_h": { "min": 7, "alvo": 8 }
  },
  "medicacao_ativa": {
    "mounjaro": true,
    "valsartana": false,
    "arcoxia_90mg": { "ativo": true, "ate": "2026-09-18", "nota": "COX-2, eleva PA - monitorar" },
    "mitrul_15mg": { "ativo": true, "ate": "2026-09-18", "horario": "18h" }
  }
}
```

Confiança: **8/10.** Desconta: não conheço o schema exato que o NutriTreino aceita — os campos `distribuicao_proteica`, `medicacao_ativa` e `regra_ajuste` podem não ser reconhecidos no import. Se der erro, remova esses três blocos e reimporte; o essencial (tiers, micronutrientes, alertas) fica intacto.

## 👤 Usuário · 2026-09-13 08:24

Detalhe o que devo fazer na fase protecao peance &love

## 🤖 Claude · 2026-09-13 08:25

## 🛡️ Fase P.E.A.C.E. — dias 0 a 7

Você está no **dia 0–1** (lesão e exame ontem/hoje, 12/09). O acrônimo é de Dubois & Esculier, *BJSM* 2020 — substituiu o antigo RICE/POLICE.

---

**P — Protection (dias 0–3)**

- Descarga parcial com **muleta ou bengala** enquanto você mancar. Regra simples: se o padrão de marcha está alterado, use apoio. Mancar cria compensação em quadril, joelho e lombar — e é assim que uma lesão de panturrilha vira dor lombar em três semanas.
- **Calcanheira de 1–2 cm nos dois pés**, inclusive dentro de casa. Encurta o gastrocnêmio e tira tensão da junção lesionada. Nos dois pés, senão você cria discrepância de comprimento.
- Zero descalço, zero chinelo sem suporte. Tênis o dia inteiro.
- Corte total: pisar em ponta de pé, subir escada empurrando com a ponta, agachar, correr, dirigir carro manual com pé direito (é a perna direita — pode ser impeditivo para dirigir, confirme se tem embreagem).

**E — Elevation**

- Perna **acima do nível do coração**, 15–20 min, 4–6x/dia. Deitado com travesseiros, não sentado com o pé numa cadeira — isso não eleva o suficiente.
- Prioridade nos primeiros 3 dias, enquanto o hematoma ainda está formando edema.

**A — Avoid anti-inflammatories**

Aqui há um conflito real que preciso ser direto sobre: a recomendação do PEACE é evitar AINE nos primeiros dias, porque a fase inflamatória faz parte do reparo. Mas **a evidência disso em humanos é limitada** — vem majoritariamente de modelos animais e raciocínio mecanístico, não de ensaios clínicos com desfecho de cicatrização.

**Você tem prescrição do ortopedista. Não pare por conta própria.** O que faz sentido é: usar dipirona como analgésico de base, reservar o Arcoxia para quando a dor realmente exigir, e mencionar essa questão ao Dr. Fernando na reavaliação. Ele decide.

**C — Compression**

- **Meia de compressão graduada 20–30 mmHg**, do pé até abaixo do joelho. Coloque de manhã ao levantar, tire para dormir.
- Reduz edema e tem benefício adicional aqui: você tem hematoma + mobilidade reduzida, ou seja, risco de TVP. Compressão é profilaxia.
- Não improvise com bandagem elástica apertada — compressão mal aplicada faz garrote.

**E — Education**

O ponto central: **expectativa realista evita o erro que custa caro**. Retração de 1,4 cm com hematoma coloca você na faixa de 6–8 semanas, não 3. A re-rotura por retorno precoce é o cenário que transforma isso em problema de meses.

---

## ❌ O que NÃO fazer (mais importante que a lista acima)

| Não faça | Por quê |
|---|---|
| **Alongar a panturrilha** | Erro nº 1. Tração em músculo rompido separa as fibras. Nada de rampa, nada de alongar no degrau, nada de "esticar que solta". |
| **Gelo** | Interfere na fase inflamatória necessária ao reparo. |
| **Massagem ou liberação miofascial no local** | Com hematoma ativo, pode aumentar sangramento. |
| **Dorsiflexão em amplitude final** | Mesmo passiva. |
| **Testar "pra ver como está"** | Pisar em ponta de pé para avaliar a dor é retestar a lesão. |
| **Calor nos primeiros 3–4 dias** | Vasodilata e aumenta o hematoma. Liberado depois. |

---

## ✅ O que você PODE fazer nesta semana

- **Bombeamento de tornozelo**: flexão plantar ativa suave (apontar o pé), 10–15 rep, várias vezes ao dia. Só até a posição neutra na volta — não passe dela. Ajuda circulação e reduz risco de TVP.
- **Isometria indolor** de panturrilha a partir do dia 3–4: sentado, pé no chão, pressione levemente contra o solo, 10 s, 5 rep. **Só se não doer.** Dor = parou.
- **Superiores sentado/deitado** a partir do dia 3–5, se não houver dor em repouso.
- **McGill Big 3** adaptado, desde já.
- **Perna esquerda**: treine normalmente (leg press unilateral, panturrilha, extensora). Cross-education gera transferência para o lado lesionado.
- **Caminhar em casa** com padrão de marcha normal, distâncias curtas. Movimento indolor é bom; é o que a "Load" do LOVE vai formalizar na semana 2.

---

🚨 **Sinais de alerta — pronto-socorro, não espera**

- Dor na panturrilha que muda de caráter (de aguda para latejante constante)
- Inchaço que sobe para a coxa
- Panturrilha quente, vermelha, endurecida
- Falta de ar ou dor no peito

Hematoma + imobilidade + 49 anos é combinação de risco para TVP. Não normalize.

---

📅 **Transição para LOVE**: por volta do dia 7, com a fisio. Load (carga progressiva), Optimism, Vascularisation (ergômetro de braço), Exercise.

Confiança: **8/10.** O framework PEACE & LOVE é consenso publicado em revista de peso, e as contraindicações (alongamento, massagem no hematoma) são bem estabelecidas na prática clínica de lesão muscular. Desconta: o item "evitar AINE" tem evidência humana fraca e eu sinalizei isso; e o timing exato da isometria depende da sua dor atual, que eu não sei — o fisio ajusta.
