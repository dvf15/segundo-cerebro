---
tipo: registro-saude
área: fitness
status: ativo
criado: 2026-08-09
fonte: nutritreino-2026-08-09.xlsx
período: 2026-06-16 a 2026-08-08
tags: [nutrição, diário, macros, micronutrientes, pressão-arterial, nutritreino]
aliases: [diário NutriTreino jun-ago 2026, análise 54 dias]
---

# Diário NutriTreino — 54 dias (16.06 → 08.08.2026)

> [!info] Escopo
> 55 registros importados. **09.08 excluído** de todas as médias (dia em curso: 851 kcal / 92 g proteína às 13h40).
> Os 5 primeiros dias (16–20.06) têm micronutrientes com valores idênticos e zeros em fibra/sódio/potássio — **placeholder do app, não dado real**. Excluídos da análise de micros (n=49 para micros, n=54 para macros).

---

## Resumo em números

| Métrica | Média | Meta / referência | Situação |
|---|---|---|---|
| Calorias | 2913 kcal | 3220 (meta do app) | −307/dia |
| Proteína | 206 g | 240–250 g | **−36 a −44 g** |
| Proteína (g/kg MLG) | 2,26 | 2,3–3,1 (Helms 2014) | **abaixo do piso** |
| Carboidrato | 259 g | — | 2,4 g/kg peso |
| Gordura | 104 g | — | 32% das kcal |
| Fibra | 19,3 g | 30–38 g (IOM 2005) | **−11 a −19 g** |
| Sódio | 3104 mg | <2000 mg (OMS) | **1,5× acima** |
| Potássio | 3107 mg | 3400 mg (AI, IOM) | levemente abaixo |
| Razão K/Na | 1,09 | quanto maior, melhor | baixa |
| Score micro (app) | 89/100 | — | bom |

---

## 1. O déficit está no ritmo — mas é o déficit errado para o momento

Déficit médio de **−307 kcal/dia**. Nos 49 dias com dado limpo, acumulado de **−14.857 kcal ≈ 1,9 kg**, ou **0,28 kg/semana**.

O plano vigente mira 0,22 kg/semana. Ou seja: o ritmo está ~27% mais rápido que o planejado.

> [!danger] O ponto crítico
> A análise do InBody de 04.08 recomendou **bloco de manutenção de 8–12 semanas** — déficit zero. O diário mostra que isso **não foi implementado**: as `meta_kcal` do app continuam sendo metas de corte (2900 descanso / 3400 força / 3650 double), e o consumo real segue abaixo delas.
>
> Nos 5 dias pós-InBody (04–08.08) o déficit caiu para −126 kcal/dia. Melhorou, mas ainda não é manutenção — e o alvo do app não mudou.

**Ação:** atualizar o perfil JSON do NutriTreino com metas de manutenção (+300 a +350 kcal em cada tier) antes de qualquer outra coisa. Enquanto a meta estiver errada, a adesão perfeita produz o resultado errado.

---

## 2. Proteína — a explicação mecanística da perda de massa magra

Este é o achado mais forte do conjunto.

- Média **206 g/dia = 2,26 g/kg de MLG** (91,1 kg, InBody 04.08)
- **Piso** da faixa de retenção de massa magra em déficit: 2,3 g/kg MLG → **210 g** (Helms et al., *Int J Sport Nutr Exerc Metab*, 2014)
- Apenas **9 de 54 dias** atingiram os 240 g prescritos
- **13 dias abaixo de 180 g** (<2,0 g/kg MLG)

### Evolução semanal da proteína

| Semana | Proteína média | Δ vs meta 240 g |
|---|---|---|
| 16–21.06 | 215 g | −25 |
| 22–28.06 | **249 g** | **+9** ✅ |
| 29.06–05.07 | 231 g | −9 |
| 06–12.07 | 183 g | −57 |
| 13–19.07 | 185 g | −55 |
| 20–26.07 | 196 g | −44 |
| 27.07–02.08 | **170 g** | **−70** ⚠️ |
| 03–08.08 | 221 g | −19 |

> [!warning] Correlação temporal
> As quatro semanas de proteína mais baixa de toda a série (06.07 a 02.08, média 183 g) são exatamente as que antecedem o InBody de 04.08 que registrou **MME 54,2 → 52,9 kg** e **proteína corporal 18,6 → 18,2 kg**.
>
> Isso não prova causalidade — parte é ruído de hidratação (água caiu 1,4 L no mesmo intervalo). Mas é a hipótese mais parcimoniosa, e é a única variável totalmente sob seu controle.

### Onde a proteína vaza: dias de descanso

| Tipo de dia | n | Proteína média | Déficit médio |
|---|---|---|---|
| rest | 21 | **181 g** | −334 kcal |
| strength | 10 | 208 g | −452 kcal |
| legs | 7 | 235 g | −207 kcal |
| double | 6 | 225 g | −327 kcal |
| bjj | 4 | 220 g | −265 kcal |
| hiit | 3 | 224 g | −200 kcal |

**39% dos dias são `rest`, e são os de pior proteína.** Nos dias sem treino a estrutura da alimentação se solta — não há pré/pós-treino puxando shake, e o consumo cai ~40 g.

> [!tip] Correção de maior alavancagem
> **Ótima:** 2 whey de 40 g fixos em dia de descanso (manhã e antes de dormir), independentemente do resto. Sozinho isso leva a média de 181 → 261 g.
> **Mínima viável:** 1 whey de 40 g logo ao acordar em todo dia `rest`. Custa 90 segundos e fecha 44 dos 59 g que faltam.
>
> Base: Longland et al., *Am J Clin Nutr*, 2016 — em déficit de 40 dias com treino resistido, o grupo com 2,4 g/kg **ganhou** massa magra; o de 1,2 g/kg não ganhou. Proteína alta + estímulo resistido é o par; nenhum dos dois resolve sozinho.

---

## 3. Volume de treino — perna está em metade do prescrito

Em 7,7 semanas de registro:

> [!note] `double` = musculação + BJJ (confirmado 09.08)
> Portanto sessões de tatame = `bjj` + `double` = **10 sessões / 1,3× por semana**.

| Modalidade | Sessões | Por semana | Prescrito |
|---|---|---|---|
| Perna (`legs`) | 7 | **0,91×** | **2×** |
| BJJ (`bjj` + `double`) | 10 | 1,3× | 1×+ (sábado) |
| Força total (`strength` + `legs` + `strength_hiit` + `double`) | 24 | 3,1× | — |
| Descanso | 21 | 2,7× | — |

### Regra de 48 h — está sendo respeitada

Perna cai em **segunda (4×)** e **domingo (3×)**. Nenhuma sessão de perna na quinta ou sexta. O BJJ de sábado está protegido. ✅

Duas ocorrências de perna em D−2 de um BJJ de **quarta** (22.06→24.06 e 03.08→05.08) — exatamente 48 h, no limite, e o BJJ de meio de semana não é a sessão prioritária. Não é problema.

> [!warning] Mas a perna de domingo é o dia errado
> 3 das 7 sessões de perna foram no **domingo, o dia seguinte ao BJJ de sábado**. Treinar perna pesada com fadiga acumulada de um treino de tatame reduz a qualidade do estímulo justamente na variável que está caindo.
>
> A prescrição do InBody era **terça e quinta**. Nenhuma sessão de perna caiu nesses dias em 54 dias.

> [!danger] Convergência com o InBody
> Perna esquerda 12,61 kg e direita 13,01 kg são os **pontos mais baixos das 10 medições** — abaixo inclusive de agosto/25, quando o peso era 22 kg maior.
>
> A causa não é mistério: **0,91 sessão de perna por semana, e 43% delas em dia de fadiga**.

### O apagão de 05 a 24 de julho

| Bloco | Sessões de BJJ | Por semana |
|---|---|---|
| 16.06 → 04.07 (19 dias) | 6 | **2,2×** |
| 05.07 → 24.07 (20 dias) | **0** | **0×** |
| 25.07 → 08.08 (15 dias) | 4 | 1,9× |

Vinte dias sem tatame, incluindo os sábados de 11.07 e 18.07 (ambos registrados como `strength`).

> [!warning] Esse é o mesmo intervalo do colapso da proteína
> A janela de 06.07 a 02.08 concentra: proteína média de 183 g (a mais baixa da série), 5 dias `rest` por semana, calorias em 2567–2695 kcal, e **zero BJJ por 20 dias**.
>
> Não é coincidência estatística — é um bloco de vida que saiu do trilho. Se foi lesão, doença ou viagem, isso muda a interpretação: não é falha de adesão, é interrupção. Vale registrar o motivo, porque o InBody de 04.08 leu justamente o efeito desse período.

---

## 4. Fibra — o buraco mais silencioso

Média **19,3 g/dia**. Recomendação: 30–38 g (IOM/DRI, 2005; 38 g para homens até 50 anos).

- Apenas **12 de 54 dias** ≥25 g
- Apenas **3 dias** ≥38 g
- Mínimo: 7,0 g (30.07)

Por que importa neste caso específico, e não como conselho genérico:

1. **HDL em faixa preocupante** (pendência de laboratório em aberto). Fibra solúvel (aveia, psyllium, leguminosas) reduz LDL de forma consistente; o efeito sobre HDL é fraco, mas a fibra viscosa melhora o perfil lipídico global.
2. **Doença diverticular documentada** (colonoscopia 2023). Dieta rica em fibra é a principal recomendação de manejo conservador.
3. **Pressão arterial.** Alimentos que carregam fibra são os mesmos que carregam potássio — resolver um resolve o outro.

> [!tip] Correção
> **Ótima:** 1 porção de leguminosa (feijão, lentilha, grão-de-bico ~150 g cozido = 8–10 g) no almoço + 2 frutas com casca + vegetal em duas refeições → +18 g/dia.
> **Mínima viável:** 10 g de psyllium ou 40 g de aveia no shake de whey. +7–9 g com zero esforço de preparo.

---

## 5. Sódio e potássio — relevante por causa da pressão, não por dogma

- Sódio médio **3104 mg/dia**; **45 de 49 dias acima de 2000 mg** (limite OMS); 7 dias acima de 4000 mg (pico 5490 mg em 31.07)
- Potássio médio **3107 mg** vs AI de 3400 mg (IOM/NASEM 2019)
- **Razão K/Na = 1,09**

A literatura de PA (INTERSALT; TOHP; meta-análises de He & MacGregor) trabalha tanto com redução de sódio quanto com aumento de potássio, e a razão K/Na aparece em vários estudos observacionais como preditor mais forte que qualquer um isolado.

> [!caution] Aqui há uma armadilha específica do seu caso
> A saída óbvia — sal light (cloreto de potássio) ou suplemento de potássio — **não se aplica sem conversa com a Dra. Juliana**.
>
> Você usa **valsartana (BRA)**, que reduz a excreção renal de potássio, e seu potássio sérico já apareceu **no limite superior da normalidade**. BRA + carga extra de potássio é a combinação clássica de hipercalemia iatrogênica.
>
> Potássio de alimento (vegetais, leguminosas, abacate, batata) é a via segura — mas mesmo essa merece ser mencionada na próxima consulta, junto com o potássio sérico do próximo exame.

**Ação prática:** atacar o sódio, não forçar o potássio. Os 7 dias >4000 mg concentram-se em refeições de restaurante — mesmo padrão já flagrado para gordura.

---

## 6. Pressão arterial — bem controlada, mas o dado tem viés

14 medições entre 19.07 e 08.08.

| Métrica | Sistólica | Diastólica |
|---|---|---|
| Média | 114,9 | 73,6 |
| Mediana | 114 | 72 |
| Máximo | 123 (31.07) | 82 (30.07) |
| Mínimo | 109 | 63 |

3 registros classificados como "Atenção" (30.07, 31.07, 07.08) — todos por **diastólica ≥80**, consistente com o histórico de hipertensão diastólica isolada.

> [!warning] Viés de amostragem
> **Todas as 14 medições são noturnas** (21h43 às 23h52). Não há uma única medida matinal na série.
>
> Isso importa porque a PA matinal (surto matinal / *morning surge*) é a que mais se associa a desfecho cardiovascular, e é a que a MRPA/diretrizes pedem. A série atual mostra que a PA noturna está boa — não diz nada sobre a matinal.

**Ação:** protocolo de MRPA da Diretriz Brasileira de Hipertensão (2020) — 3 medidas pela manhã (antes do café e da medicação) e 3 à noite, por 5 dias consecutivos. Levar a média à Dra. Juliana.

Testei correlação entre sódio e PA nos dados: **não há sinal utilizável** (r = 0,13 sistólica / 0,27 diastólica no mesmo dia; negativa no dia seguinte). Com n=14 e sem medida matinal, isso é ruído — não conclua nada em nenhuma direção.

---

## 7. Higiene do dado — três coisas a corrigir no app

1. **16–20.06:** micros zerados/placeholder. Se der para editar ou marcar, marque; senão, lembre-se de excluir em análises futuras.
2. **Vitamina D constante em 4000 UI e B12 em ~975 mcg** em todos os 54 dias. São lançamentos fixos de suplemento, não estimativa alimentar. 4000 UI/dia é exatamente o **UL** (nível superior tolerável) do IOM para adultos. → **dosar 25-OH-vitamina D na próxima coleta**, junto da PCR ultrassensível já pendente.
3. **Ômega-3 registrado entre 2,2 e 10,3 g/dia** com variação de 5×. Provavelmente mistura g de óleo com g de EPA+DHA. Vale padronizar para **mg de EPA+DHA**, que é a unidade que a literatura usa.

---

## Plano de ação — 8 semanas até o próximo InBody (~29.09)

### Versão ótima

1. **Reescrever o JSON do NutriTreino para manutenção** — +300 kcal em cada tier. `rest` 3200 / `strength` 3700 / `legs` 3700 / `bjj` 3750 / `double` 3950.
2. **Proteína 240 g piso, todo dia.** Regra fixa: 2 whey em dia `rest`.
3. **Perna 2×/semana — terça e quinta.** Inegociável até setembro. É o único item que mexe diretamente na variável que está caindo.
4. **BJJ de sábado protegido**, regra de 48 h mantida.
5. Fibra ≥30 g: leguminosa no almoço + psyllium/aveia no shake.
6. Sódio <2500 mg: cortar os picos de restaurante, não a comida de casa.
7. MRPA de 5 dias com medidas matinais antes da próxima consulta.
8. McGill Big 3 + isometria cervical mantidos.

### Versão mínima viável (semana corrida)

1. Metas do app em manutenção (10 min de configuração, uma vez).
2. **1 whey de 40 g ao acordar em todo dia de descanso.**
3. **1 sessão de perna pesada, terça:** agachamento ou leg press + terra romeno + panturrilha. 4 séries, 5–8 reps, RIR 1–2. 25 min.
4. Psyllium no shake.
5. McGill Big 3.

---

## Confiança da análise: **8/10**

O que sustenta o 8:
- 54 dias consecutivos é amostra sólida para tendência de macros; as médias por tier de treino têm n suficiente (exceto `light` e `strength_hiit`).
- Os cálculos de déficit, g/kg MLG e frequência de treino são aritmética direta sobre os dados, verificável.
- A convergência entre três fontes independentes (diário de proteína ↓, frequência de perna ↓, InBody de perna e MME ↓) é o que dá força ao achado principal.

Descontos:
- **−1** — O diário é autorrelato. Subestimativa de ingestão calórica em autorrelato é bem documentada e chega a 20–30% em alguns estudos; se houver subestimativa aqui, o déficit real é menor que −307 kcal e parte da conclusão sobre ritmo de perda muda. A proteína tende a ser menos subestimada que gordura/carboidrato, então o achado principal resiste.
- **−1** — Não sei o que compõe o tier `double`. Se ele inclui BJJ, minha leitura sobre frequência de tatame está errada. Também não tenho peso corporal diário no arquivo para cruzar com o déficit calculado — o "0,28 kg/semana" é estimativa teórica (7700 kcal/kg), não medição.

> [!caution] Não é aconselhamento médico
> Ajuste de dose de tirzepatida ou valsartana, interpretação de potássio sérico, decisão sobre potássio dietético sob BRA e qualquer mudança farmacológica → **Dra. Juliana**. Este arquivo é análise nutricional e de programação de treino.

---

## Conexões

- [[inbody agosto 2026, bioimpedância 04/08/2026]] — origem do bloco de manutenção e da prioridade de perna
- [[5-nutricao-recuperacao]] — meta de proteína e fibra
- [[2-forca-hipertrofia]] — perna 2×/semana
- [[1-treino-bjj-periodizacao]] — regra de 48 h
- [[3-cardio-longevidade]] — Zona 2 e PA
- [[checkup-medrio-2025-01-15]] — histórico de PA, doença diverticular

## Pendências abertas

- [ ] Atualizar JSON do NutriTreino para metas de manutenção
- [ ] Confirmar o que compõe o tier `double`
- [ ] Registrar peso corporal diário no diário (permite cruzar déficit teórico × real)
- [ ] MRPA de 5 dias com medidas matinais
- [ ] Próxima coleta: PCR ultrassensível + 25-OH-vitamina D + potássio + ferritina + HDL
- [ ] Padronizar registro de ômega-3 em mg de EPA+DHA
- [ ] Próximo InBody ~29.09.2026, protocolo padronizado
