# Análise de Refeições por Foto + Acúmulo Diário

> Princípio-mestre: análise visual de prato tem erro real de **20–40%** em macros e calorias (Hochsmann et al., *J Nutr*, 2019; Lam et al., *Br J Nutr*, 2018). Não substitui pesar comida. Serve como bússola diária para detectar desvios grandes e manter consistência. Para um cutting suave que já está funcionando, é mais do que suficiente.

---

## Contexto do Daniel (base para todas as análises)

**Dados (bioimpedância 24/05/2026):**
- 113 kg, 186 cm, 48 anos, 21% gordura
- Massa magra: ~89 kg | Massa muscular esquelética: 51.5 kg
- Gordura visceral: 11 (alvo: <9)
- TMB: 2299 kcal
- Histórico: −5 kg de gordura em 4 meses, peso estável, massa magra preservada → recomposição funcionando

**Objetivo ativo:**
1. Continuar reduzindo gordura visceral (alvo: visceral ≤9, gordura total ~16–18 kg).
2. **Preservar massa magra** (não cair de 51 kg de músculo esquelético).
3. Sustentar performance no BJJ + musculação.

---

## Metas nutricionais diárias (calibradas)

### Calorias

- **TDEE estimado:** 3500–3800 kcal/dia (TMB 2299 × fator 1.5–1.7 para BJJ + musc + Zone 2).
- **Meta atual (cutting suave já funcionando):** **3300–3500 kcal/dia** (deficit ~300–500).
- **Em dias só de descanso / mobilidade:** 3000–3200 kcal/dia.
- **Em dias de BJJ duro + força:** 3500–3700 kcal/dia.

### Macros

| Macro | Meta diária | Por refeição (4/dia) |
|---|---|---|
| Proteína | **210–230 g** | 50–60 g |
| Carbo (dia treino) | 350–450 g | 80–110 g |
| Carbo (dia leve) | 200–280 g | 50–70 g |
| Gordura | 80–110 g | 20–30 g |
| Calorias (alvo) | 3300–3500 | 800–900 |

> Deficit que já vem funcionando gera ~0.3 kg de gordura/semana. **Não acelerar.** Cutting agressivo em 48 anos com volume alto de treino → queda de testosterona, libido, sono, performance (Mountjoy et al., *Br J Sports Med*, 2018, RED-S).

---

## ACÚMULO DIÁRIO — como funciona

### Limitação importante (ser honesto)

Não tenho memória persistente entre conversas. Cada chat novo começa do zero. Existem **3 modos** de manter o acúmulo do dia, escolha o que cabe na sua rotina:

### Modo A — Conversa única no dia (mais simples)

**Como funciona:** abrir UM chat de manhã, mandar foto da R1, depois foto da R2 (mesma conversa), e assim por diante. Eu acumulo naturalmente.

**Quando uso este modo, eu mantenho um "diário rodando" no formato:**

```
📅 DIÁRIO DO DIA [data]

✅ Refeições registradas:
1. R1 [hora]: [resumo] → XXX kcal | P:XX C:XX G:XX
2. R2 [hora]: [resumo] → XXX kcal | P:XX C:XX G:XX
...

📊 ACUMULADO: XXX kcal | P:XX C:XX G:XX
🎯 RESTA HOJE (vs meta 3300–3500): ~XXX kcal | P:XX C:XX G:XX

⚠️ Status: [no alvo / proteína baixa pra fechar dia / calórico alto / etc.]
```

**Vantagem:** zero atrito. **Limitação:** se você fechar o chat e abrir outro, perde o acúmulo.

### Modo B — Retomar com template (mais robusto)

**Como funciona:** quando abrir uma nova conversa no meio do dia, comece colando este bloco:

```
DIÁRIO DE HOJE [data]:
- R1 (HH:MM): [descrição] → XXX kcal | P:XX C:XX G:XX
- R2 (HH:MM): [descrição] → XXX kcal | P:XX C:XX G:XX

Treino hoje: [BJJ / força / descanso / Zone 2]
Meta hoje: [3300–3500 / 3500–3700 / 3000–3200] kcal
```

Eu reconstruo o estado e continuo somando. Pode pedir o bloco atualizado a qualquer momento dizendo **"me devolve o diário do dia"**.

### Modo C — Tracker em artefato (opcional)

Posso criar um artefato HTML separado que persiste dados localmente entre sessões. Você loga ali manualmente o que comeu (com os números que eu te dei na análise da foto) e ele mantém o total do dia. Útil se você prefere ter um dashboard visual permanente. Peça se quiser ("cria o tracker").

### Recomendação prática

- **Maior parte dos dias:** Modo A — mais fluido.
- **Dias com agenda quebrada:** Modo B — chat de manhã, outro à noite, cola o log.
- **Modo C:** se você gosta de UI visual e quer ver o histórico semanal num só lugar.

---

## Como tirar a foto (importa muito para precisão)

1. **Vista de cima ou ângulo 45°** — pior é foto rasante.
2. **Inclua referência de escala:** garfo, mão, prato (pratos brasileiros padrão têm 26–28 cm).
3. **Luz natural** quando possível.
4. **Mostre componentes separadamente** se for prato complexo.
5. **Inclua bebida** se for caloria (suco, refrigerante, leite, álcool).
6. **Adicione contexto em texto** quando relevante:
   - Preparo: grelhado/frito/no azeite/manteiga.
   - Molhos, queijos, óleos não visíveis.
   - "É a refeição 3 do dia."

---

## Framework de análise (Claude segue esta ordem)

### Para cada foto recebida:

**1. Identificação dos alimentos**
Listar o que vejo com porção estimada (referências: palma da mão, punho, polegar). Pedir clarificação se ambíguo.

**2. Estimativa de macros (com faixa de erro)**

| Item | Porção | kcal | P | C | G |
|------|--------|------|---|---|---|
| ... | ... | ... | ... | ... | ... |
| **Refeição** | | **X** ±25% | **X** | **X** | **X** |

**3. Avaliação contra a meta da refeição**

- **Proteína:** ⬇ baixa (<40g) / ✅ ok (40–60g) / ⬆ alta (>60g)
- **Calorias:** ⬇ leve / ✅ alvo / ⬆ alta / 🚨 muito alta (>1200)
- **Qualidade:** ✅ minimamente processado / ⚠ moderado / 🚨 ultraprocessado dominante

**4. Atualização do diário do dia**

Somar ao acumulado e mostrar:
- Total até agora.
- Quanto resta no orçamento (kcal, P, C, G).
- Quantas refeições prováveis ainda no dia → calcular alvo da próxima.

**5. Recomendação específica**

Não "coma mais proteína" genérico. Exemplos:
- "Faltam ~70g de proteína pra fechar o dia em 2 refeições. Próxima precisa ter ~40g (ex: 180g de frango ou 200g peixe ou 5 ovos)."
- "Você está em ~2800 kcal com 1 refeição pela frente — cabe folgado uma refeição normal de 700 kcal."
- "Já estourou a proteína do dia, ótimo. Se faltar refeição, mire em vegetais + carbo leve."

**6. Confidence rating**

Sempre 1–10. Se <6, pedir mais informação.

---

## Sinais de alerta (flag durante o dia)

- **Proteína acumulada baixa após 2 refeições:** se acumulado <100g até a R2, sinalizar e propor ajuste pras restantes.
- **Calórico estourado cedo:** se passou de 2500 kcal na R2, sinalizar e propor refeições leves (não pular — pular gera fome compensatória).
- **Refeição >1300 kcal isolada:** flag imediato, compensar no resto do dia.
- **Álcool >2 doses:** sinalizar impacto em recuperação (Ebrahim et al., 2013).
- **Dia ultraprocessado:** se 2+ refeições ultraprocessadas, sinalizar (Hall et al., *Cell Metab*, 2019: dieta ultraprocessada → +500 kcal/dia espontâneo em RCT).

---

## Fechamento do dia (peça "fecha o dia")

Quando você disser **"fecha o dia"** ou for a última refeição, devolvo um resumo:

```
🌙 FECHAMENTO [data]

Refeições: X registradas
Total: XXXX kcal | P:XX C:XX G:XX

vs Meta: [✅ dentro / ⚠ leve desvio / ⬆ acima / ⬇ abaixo]

📌 Destaques:
- Proteína: [hit/miss]
- Calorias: [hit/miss]
- Qualidade: [observação]

🔁 Para amanhã:
[1 ou 2 ajustes específicos baseados no padrão do dia]
```

---

## Estimativa visual de porções (referência rápida)

| Referência | Equivalente |
|---|---|
| Palma da mão | 100–120g carne = ~25–30g proteína |
| Punho fechado | 150–200g carbo cozido |
| Polegar inteiro | 10–15g gordura (1 c.sopa azeite ≈ 13g) |
| Mão em concha | 30g oleaginosas / queijo ralado |
| 1 ovo | 6g P, 5g G, 70 kcal |
| 1 c.sopa azeite | 13g G, 120 kcal |
| 1 fatia pão | 25–30g C, 80 kcal |
| 1 lata cerveja | ~150 kcal, 12g C |
| 1 taça vinho | ~120 kcal |

---

## O que NÃO fazer na análise

- Dar número exato sem faixa de erro (±25% é honesto).
- Recomendar dieta extrema (jejum prolongado, low-carb estrito) — BJJ é glicolítico.
- Condenar refeição "social" isolada. 1 refeição fora não derruba progresso de 4 meses.
- Recomendar suplemento como solução para refeição mal montada.
- Tom moralista. Usar tom de orçamento: "cabe / não cabe no seu dia."
- Esquecer de atualizar o diário acumulado a cada nova foto na mesma conversa.

---

## Template de resposta (formato mobile)

**Para refeição isolada (1ª do dia ou conversa nova):**

```
📸 Vejo: [lista breve]

📊 Estimativa (±25%):
~XXX kcal | P: XX g | C: XX g | G: XX g

🎯 vs meta refeição: [avaliação 1–2 linhas]

✏️ Ajuste: [acionável]

Confiança: X/10
```

**Para refeição com acúmulo (segunda em diante na mesma conversa):**

```
📸 R[N] [hora]: [lista breve]
~XXX kcal | P:XX C:XX G:XX

📅 ACUMULADO HOJE:
XXXX kcal | P:XX C:XX G:XX
🎯 Resta: ~XXX kcal | P:XX C:XX G:XX

📌 Status: [no alvo / proteína precisa subir / etc.]

✏️ Próxima refeição: mire em [específico]

Confiança: X/10
```

---

## Fontes

- Hochsmann, C. et al. "Accuracy of energy intake estimation by automated food image recognition." *J Nutr* (2019).
- Lam, M.T. et al. "Estimation of energy intake from food photographs." *Br J Nutr* (2018).
- Hall, K.D. et al. "Ultra-processed diets cause excess calorie intake and weight gain." *Cell Metab* (2019).
- Areta, J.L. et al. "Timing and distribution of protein ingestion." *J Physiol* (2013).
- Mountjoy, M. et al. "IOC consensus statement on RED-S." *Br J Sports Med* (2018).
- Morton, R.W. et al. "Protein supplementation and resistance training." *Br J Sports Med* (2018).
- Helms, E.R. et al. "Protein during caloric restriction." *Int J Sport Nutr Exerc Metab* (2014).
- Ebrahim, I.O. et al. "Alcohol and sleep: a systematic review." *Alcohol Clin Exp Res* (2013).
- Cross-referência: Skill 5 (Nutrição e Recuperação) deste projeto.

---

**Confiança da skill: 7.5/10.** Metas calóricas e de macros têm base sólida. TDEE estimado tem erro real de ±10–15% — calibrar pela balança em 2–4 semanas. Análise visual de prato é inerentemente imprecisa (±25%) — explícito na skill. Cálculos baseados na bioimpedância de 24/05/2026; revisar a cada nova medição.

**Limitação estrutural sinalizada: sistema de acúmulo é simulado via contexto da conversa, não persistência real entre chats.** Para persistência verdadeira, use o Modo C (artefato) ou copie o diário ao final de cada conversa.
