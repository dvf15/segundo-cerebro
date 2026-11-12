---
tipo: especificação
área: fitness
status: proposta
criado: 2026-08-09
base: nutritreino-2026-08-09.xlsx (49 dias com micros válidos)
tags: [nutritreino, app, alertas, produto]
aliases: [spec de alertas NutriTreino]
---

# NutriTreino — proposta de sinalização intradiária

> [!info] De onde vem esta proposta
> Não é opinião de design genérico. Cada alerta abaixo corresponde a um modo de falha **medido** nos seus 49 dias de dado limpo (21.06 a 08.08.2026).

---

## O diagnóstico central: o app quase nunca avisa nada

Aplicando três critérios duros aos seus próprios dados:

| Critério | Dias que falharam |
|---|---|
| Proteína < 210 g (piso Helms, 2,3 g/kg MLG) | 26 / 49 |
| Fibra < 25 g | 37 / 49 |
| Sódio > 2300 mg | 40 / 49 |
| **Pelo menos um dos três** | **46 / 49 = 94%** |
| **Os três ao mesmo tempo** | **18 / 49 = 37%** |

E o que o app sinalizou?

| Sinal do app | Dias |
|---|---|
| `score_micro` abaixo de 85 | **4 / 49 = 8%** |

> [!danger] Isto é o problema, não um detalhe
> Em 94% dos dias havia algo acionável. O app avisou em 8%.
>
> Pior: o score não é neutro, é **falsamente tranquilizador**. Média de 90,3/100 numa série em que a fibra rodou a 50% da meta e o sódio ficou acima do limite da OMS em 45 de 49 dias.

### O caso que resume tudo

**30.07.2026** — 2052 kcal, **125 g de proteína** (52% da meta), **7,0 g de fibra** (18% da meta).
Pior dia de fibra e pior dia de proteína de toda a série.

**Score do app naquele dia: 86/100.**

E, no dia seguinte, sua PA registrou 121/82 — classificada como "Atenção".

---

## Por que o score atual não funciona (a matemática)

Amplitude observada: **81 a 100**, média 90,3. **45 de 49 dias ≥ 85.** Um indicador que quase nunca sai da faixa "bom" não carrega informação.

Correlação do score com cada componente:

| Nutriente | r | Leitura |
|---|---|---|
| Fibra | +0,85 | domina o score |
| Potássio | +0,80 | domina o score |
| Magnésio | +0,71 | — |
| Vit. C | +0,61 | — |
| **Sódio** | **−0,38** | **penaliza pouco demais** |
| Cálcio | +0,11 | praticamente ignorado |
| Zinco | +0,16 | praticamente ignorado |
| **Proteína** | **não entra** | **o macro que mais importa para você** |

Três defeitos estruturais:

1. **Média em vez de elo mais fraco.** Excesso de vitamina C compensa fibra a 18% da meta. Nutrição não funciona assim — um nutriente crítico em déficit não é compensado por outro em excesso.
2. **Sódio tratado como "quanto mais perto da meta, melhor", quando é um teto.** Em 6 dias o sódio passou de 4000 mg e o score ficou ≥84.
3. **Proteína fora do score.** É a variável mais associada ao seu achado de perda de massa magra, e o indicador de qualidade do dia a ignora.

---

## O que eu trocaria

### Correção 1 — Matar o número único

Substituir "89/100" por **os dois piores nutrientes do dia, nomeados**, com o valor absoluto e a meta:

```
Hoje:  Fibra 7 g / 30 g  ·  Proteína 125 g / 240 g
```

Se quiser manter um score, calcule pelo **elo mais fraco** (mínimo dos componentes, ou média harmônica), não pela média aritmética. Com a regra do mínimo, o dia 30.07 pontuaria ~18, não 86.

> [!tip] Regra de produto
> Nunca mostrar um agregado sem mostrar, ao lado, o pior componente que ele está escondendo.

---

### Correção 2 — Alerta de trajetória de proteína (maior impacto isolado)

Este é o alerta que resolve o seu problema número 1.

**Por que trajetória e não saldo:** proteína é o único macro que **não dá para recuperar tarde**. Gordura e carboidrato entram com qualquer coisa às 22h. 110 g de proteína às 21h não entram. Quando o app mostra "faltam 118 g" no fim do dia, a informação chegou tarde demais para ser uma decisão.

**Regra proposta** (meta 240 g):

| Hora | Acumulado mínimo | Se abaixo, o app diz |
|---|---|---|
| 11h | 60 g (25%) | leve |
| 15h | 110 g (46%) | **alerta forte** |
| 18h | 170 g (71%) | **ponto de virada** |

O texto do alerta é tão importante quanto o gatilho. **Gramas são abstratas; porções são acionáveis:**

❌ "Faltam 130 g de proteína"
✅ "Faltam 130 g — isso é 2 shakes de whey + 200 g de frango. Ainda dá até as 21h, mas não se o jantar for leve."

E, passado o ponto de virada, o app deve ser honesto em vez de motivacional:

✅ "Faltam 115 g às 20h. Realisticamente hoje fecha em ~180 g. Amanhã é dia de descanso — programe 2 shakes."

---

### Correção 3 — Regra diferente para dia `rest`

Dado medido:

| Tipo de dia | n | Proteína média |
|---|---|---|
| `rest` | 21 | **181 g** |
| dias com treino | 33 | 220 g |

**39% dos seus dias são `rest`, e são os de pior proteína.** A explicação é estrutural: sem treino não há pré nem pós-treino puxando shake, e a arquitetura do dia se dissolve.

**Proposta:** em dia marcado como `rest`, o app antecipa o primeiro alerta para **09h**, com uma única mensagem:

```
Dia de descanso. Sem treino, sua proteína média cai 39 g.
Whey agora + whey antes de dormir = 80 g garantidos.
```

Um alerta, cedo, específico daquele contexto. É a intervenção de maior alavancagem do conjunto todo.

---

### Correção 4 — Fibra sai do score e vira alerta próprio

37 de 49 dias abaixo de 25 g. Média 19,3 g. Meta 30–38 g (IOM/DRI 2005). **Zero alertas.**

**Gatilho:** 16h, se fibra < 12 g → sugestão amarrada à próxima refeição, não um número solto:

```
Fibra em 9 g. Feijão no jantar (~9 g) ou psyllium no shake (~7 g) fecha o dia.
```

Relevante no seu caso específico por três motivos: HDL em faixa de atenção, doença diverticular documentada (colonoscopia 2023), e porque os alimentos que carregam fibra são os mesmos que carregam potássio.

---

### Correção 5 — Sódio como teto, com alerta *antes* do restaurante

40 de 49 dias acima de 2300 mg; 7 dias acima de 4000 mg (pico 5490 mg em 31.07). Os picos concentram-se em refeições fora de casa — o mesmo padrão já identificado para gordura.

Um aviso às 23h de que o dia fechou em 5490 mg não serve para nada.

**Proposta — dois gatilhos:**

1. **17h, se sódio ≥ 1800 mg:** "Você já está em 1800 mg. Se o jantar for fora, o dia fecha acima de 4000."
2. **Manhã seguinte a um dia > 4000 mg:** lembrete de **medir a PA** — porque hoje isso não está acontecendo (ver abaixo).

> [!caution] O que o app NÃO deve sugerir
> Se alguém programar isso, o caminho óbvio para a razão K/Na é "use sal light" ou "suplemente potássio". **No seu caso isso é contraindicado sem a Dra. Juliana**: valsartana (BRA) reduz a excreção renal de potássio e seu potássio sérico já apareceu no limite superior. Qualquer sugestão de potássio deve ser restrita a **alimento**, nunca a sal de potássio ou suplemento.

---

### Correção 6 — Alertas semanais de frequência de treino

O app registra o tipo de treino mas não confronta com a prescrição. Falhas que passaram em branco por 8 semanas:

| Falha | Dado | Prescrito |
|---|---|---|
| Perna | 0,91×/semana | 2× |
| Perna no dia errado | 3 de 7 sessões no domingo (24 h após BJJ) | terça e quinta |
| BJJ | 20 dias seguidos sem tatame (05–24.07) | 1×+ |

**Três alertas, semanais, não diários:**

1. **Quarta-feira:** "Nenhuma perna esta semana. Restam quinta e domingo — quinta é a boa (48 h antes do BJJ de sábado)."
2. **Ao registrar perna no domingo:** "Perna 24 h depois do BJJ. O estímulo rende menos com fadiga de tatame — considere mover para terça."
3. **10 dias sem BJJ:** "Último tatame há 10 dias." Só isso. Sem julgamento — pode ter sido lesão ou viagem, e o app não sabe.

---

### Correção 7 — Alerta de meta desatualizada

A recomendação de bloco de manutenção veio no InBody de **04.08**. Em 09.08, as `meta_kcal` do app continuam sendo metas de corte (2900 / 3400 / 3650).

**Enquanto a meta estiver errada, a adesão perfeita produz o resultado errado** — e o app não tem como saber disso.

**Proposta:** campo `fase` no perfil (`corte` / `manutenção` / `ganho`) + `perfil_atualizado_em`. Se passarem 60 dias, ou se um InBody novo for registrado depois da última atualização de perfil:

```
Perfil configurado em 12.06 (fase: corte).
InBody de 04.08 registrado depois disso. Revisar metas?
```

---

### Correção 8 — Higiene de dado

Quatro coisas que o app deveria detectar sozinho:

1. **Valor constante por N dias = suspeito.** Vitamina D em 4000 UI e B12 em ~975 mcg nos **54 dias**. São lançamentos fixos de suplemento entrando como se fossem estimativa alimentar. Sugestão: separar "suplemento" de "alimento" na contabilidade.
2. **Placeholder não sinalizado.** Os dias 16–20.06 têm micros idênticos e zeros em fibra/sódio/potássio. O app apresentou score 54 nesses dias como se fosse medição real.
3. **Unidade ambígua.** Ômega-3 variando de 2,2 a 10,3 g/dia — quase certamente mistura gramas de óleo com gramas de EPA+DHA. Padronizar em **mg de EPA+DHA**.
4. **Falta campo de peso corporal.** Sem peso diário não dá para cruzar déficit teórico (−307 kcal/dia) com perda real. Hoje o "0,28 kg/semana" é conta de 7700 kcal/kg, não medição.

---

### Correção 9 — Pressão arterial: falta o horário que importa

As **14 medições registradas são noturnas** (21h43 às 23h52). Nenhuma matinal em 3 semanas.

**Proposta:** lembrete matinal, antes do café e da medicação, e um indicador que mostre a cobertura:

```
Manhã: 0 medições · Noite: 14
A média matinal é a que a MRPA pede.
```

Protocolo da Diretriz Brasileira de Hipertensão (2020): 3 medidas pela manhã e 3 à noite, por 5 dias.

---

## Prioridade de implementação

Se só der para fazer três coisas:

1. **Alerta de trajetória de proteína às 15h** com o remanescente expresso em porções
2. **Regra de dia `rest` às 09h** — 39% dos seus dias, o pior déficit
3. **Matar o score único**, mostrar os dois piores nutrientes

Essas três atacam 100% do achado principal (perda de massa magra). O resto é margem.

---

## O contra-argumento que vale considerar

> [!warning] Não empilhe notificações
> Se todas as 9 correções virarem push, você recebe 6–8 alertas por dia e passa a ignorar todos. Fadiga de alerta é o modo de falha clássico de sistemas de apoio à decisão — em decisão clínica informatizada, taxas de override de alertas de interação medicamentosa acima de 80–90% são amplamente relatadas.
>
> **Teto sugerido: 2 notificações ativas por dia.** As demais correções (frequência de treino, higiene de dado, meta desatualizada) devem viver na tela, não no push — o usuário vê quando abre o app.
>
> Também vale considerar que **nem tudo é problema de app**. A semana de 22–28.06 fechou com 249 g de proteína e BJJ 2×, sem nenhum alerta novo. O padrão certo já existiu. Alerta ajuda a manter um sistema que funciona; não constrói um que não existe.

---

## Confiança: **7/10**

O que sustenta:
- A análise do `score_micro` (amplitude, média, correlações, 94% vs 8%) é aritmética direta sobre os seus dados, verificável e independente de julgamento de design.
- Os modos de falha (proteína em dia `rest`, fibra, sódio, frequência de perna) estão todos quantificados.

Descontos:
- **−2** — **Os horários de gatilho (09h, 11h, 15h, 16h, 17h, 18h) não são derivados dos seus dados.** O arquivo só tem totais diários; não há registro por refeição. Os limiares vêm da lógica de que proteína não se recupera tarde e do padrão já conhecido dos seus registros de refeição (café da manhã líquido → proteína baixa cedo). **Precisam ser calibrados contra 2–3 semanas de log por refeição antes de virarem regra.**
- **−1** — A citação sobre fadiga de alerta é de memória. A ordem de grandeza (maioria dos alertas ignorada em sistemas clínicos) está bem estabelecida na literatura de CDS, mas os percentuais exatos merecem conferência antes de virarem argumento.

> [!caution] Fora do escopo
> Qualquer alerta que sugira potássio suplementar, sal light ou mudança de medicação → **Dra. Juliana**. Este documento é especificação de produto.

---

## Conexões

- [[nutritreino-diario-jun-ago-2026]] — análise que originou esta proposta
- [[inbody agosto 2026, bioimpedância 04/08/2026]] — bloco de manutenção não implementado
- [[5-nutricao-recuperacao]]

## Pendências

- [ ] Logar 2–3 semanas por refeição para calibrar os horários de gatilho
- [ ] Adicionar campo de peso corporal diário
- [ ] Separar suplemento de alimento na contabilidade de micros
- [ ] Padronizar ômega-3 em mg de EPA+DHA
- [ ] Campo `fase` + `perfil_atualizado_em` no JSON
